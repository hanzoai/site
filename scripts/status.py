#!/usr/bin/env python3
"""Writes docs/status.html: one row per design (top-level pages + family templates) with its v2 state,
so James can see what is ready to hand over without opening 800+ pages.

Ready = a James-eye critic verdict (docs/review/<name>.md) of 8+, passes scripts/variety.py, and proof in docs/gallery/<name>/.
Owner and group come from docs/CLOUD.md. Run: python3 scripts/status.py && open docs/status.html
"""
import html, importlib.util, json, re, time
from pathlib import Path

HZ = Path(__file__).resolve().parent.parent
BASE = "http://localhost:4180"
INDEX = json.loads((HZ / "content/pages.json").read_text())
spec = importlib.util.spec_from_file_location("variety", HZ / "scripts/variety.py")
variety = importlib.util.module_from_spec(spec); spec.loader.exec_module(variety)
tspec = importlib.util.spec_from_file_location("taste", HZ / "scripts/taste.py")
taste = importlib.util.module_from_spec(tspec); tspec.loader.exec_module(taste)
MEDIA = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm")

# owner: route or "/fam/*" -> chat label, parsed from the numbered task lines in CLOUD.md
owner, wave = {}, "Wave 1"
for line in (HZ / "docs/CLOUD.md").read_text().splitlines():
    if line.startswith("## Wave 2"): wave = "Wave 2"
    m = re.match(r"\s*(\d+)\.\s+\*\*([^*]+)\*\*", line)
    if m:
        for r in re.findall(r"(/[a-z0-9\-]*(?:/\*)?)(?=[\s`,)+]|$)", line):
            owner.setdefault(r.rstrip("/") or "/", f"{wave} · {m.group(2).strip(': ')}")

def comp_of(page):
    src = page.read_text(errors="ignore")
    m = re.search(r"from\s+['\"](\.\./[^'\"]*components/[^'\"]+)['\"]", src)
    p = (page.parent / m.group(1)).resolve() if m else page
    return next((c for c in [p, p.with_suffix(".jsx")] if c.is_file()), page)

def row(key, route, page, members=0):
    comp = comp_of(page); text = comp.read_text(errors="ignore")
    v2 = re.search(r"V2:\s*(\d+(?:\.\d+)?)\s*/\s*10\s*(.*)", text)
    score = float(v2.group(1)) if v2 else None
    note = re.sub(r"\s*\*/.*", "", v2.group(2)).strip() if v2 else ""
    used = variety.scan(comp)
    var_ok = used.get("fade-up (Rise)", 0) <= variety.MAX_RISE and len(used) <= variety.MAX_TECH and not taste.check(comp)
    name = "home" if route == "/" else key.strip("/").replace("/*", "")
    gdir = HZ / "docs/gallery" / name
    media = sorted(p for p in gdir.rglob("*") if p.suffix.lower() in MEDIA) if gdir.is_dir() else []
    rv = HZ / "docs/review" / f"{name}.md"
    rtext = rv.read_text(errors="ignore") if rv.is_file() else ""
    rm = re.search(r"Verdict:\s*(\d+(?:\.\d+)?)\s*/\s*10", rtext)
    review = float(rm.group(1)) if rm else None
    complaint = (re.search(r"(?:First complaint|Complaint):\s*(.+)", rtext) or [None, ""])[1]
    if review is not None: score, note = review, f"critic: {complaint}" if complaint else note
    cv = HZ / "docs/coverage" / f"{name}.md"
    ctext = cv.read_text(errors="ignore") if cv.is_file() else ""
    parts = sum(1 for sec in re.split(r"\n(?=## \d+\.)", ctext)[1:] if re.search(r"Done here:\s*\S", sec))  # 18-part card: a part counts once its "Done here:" line is filled  # the critic's verdict outranks the chat's own
    state = ("ready" if review is not None and review >= 8 and var_ok and media and parts >= 18 else
             "v2" if score is not None else "todo")
    title = (INDEX.get(route) or {}).get("title", route).split(" — ")[0]
    return dict(key=key, route=route, title=title, members=members, score=score, note=note, var_ok=var_ok,
                media=[m.relative_to(HZ / "docs").as_posix() for m in media[:3]], state=state, parts=parts,
                owner=owner.get(key) or owner.get(route) or owner.get("/" + route.strip("/").split("/")[0], "unassigned"), age=int((time.time() - comp.stat().st_mtime) / 60))

rows = []
for page in sorted((HZ / "app").rglob("page.jsx")):
    rel = page.parent.relative_to(HZ / "app").as_posix()
    if rel.startswith(("_", "[...")): continue
    if "[" in rel:
        prefix = "/" + rel.split("/[")[0] + "/"
        members = [r for r in sorted(INDEX) if r.startswith(prefix)]
        if members: rows.append(row(prefix + "*", members[0], page, len(members)))
    else:
        r = "/" + rel if rel != "." else "/"
        rows.append(row(r, r, page))

count = {s: sum(r["state"] == s for r in rows) for s in ("ready", "v2", "todo")}
assert sum(count.values()) == len(rows) and len(rows) > 100
urls = len(INDEX)  # every hanzo.ai page captured in content/pages.json
LABEL = {"ready": "Ready to hand over", "v2": "v2 built, awaiting review or under 8", "todo": "Not v2 yet"}

def tr(r):
    media = "".join(f'<video src="{m}" muted loop autoplay playsinline></video>' if m.endswith((".mp4", ".webm"))
                    else f'<img src="{m}" loading="lazy" alt="">' for m in r["media"])
    fam = f' <span class="fam">{r["members"]} pages</span>' if r["members"] else ""
    score = f'{r["score"]:g}/10' if r["score"] is not None else "–"
    return (f'<tr class="{r["state"]}"><td><a href="{BASE}{html.escape(r["route"].rstrip("/"))}/" target="_blank">{html.escape(r["key"])}</a>{fam}'
            f'<div class="t">{html.escape(r["title"])}</div><div class="n">{html.escape(r["note"])}</div></td>'
            f'<td><span class="s {r["state"]}">{LABEL[r["state"]]}</span></td><td class="num">{score}</td>'
            f'<td class="num">{r["parts"]}/18</td><td>{"✓" if r["var_ok"] else "✗ fails"}</td><td class="g">{media or "–"}</td>'
            f'<td class="o">{html.escape(r["owner"])}<div class="t">edited {r["age"]} min ago</div></td></tr>')

order = {"ready": 0, "v2": 1, "todo": 2}
rows.sort(key=lambda r: (order[r["state"]], r["key"]))
pct = round(100 * count["ready"] / len(rows))
out = f"""<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="60"><title>Hanzo status board</title><style>
:root{{--ink:#0a0a0a;--soft:#6e6e73;--line:rgba(0,0,0,.08);--card:#f5f5f7}}
body{{margin:0;background:#fff;color:var(--ink);font:14px/1.45 -apple-system,system-ui,sans-serif}}
main{{max-width:1280px;margin:0 auto;padding:40px 16px 80px}}h1{{font-size:32px;letter-spacing:-.03em;margin:0}}
.lede{{color:var(--soft);margin:6px 0 24px}}.bar{{height:10px;border-radius:99px;background:var(--card);overflow:hidden;margin:0 0 16px}}
.bar i{{display:block;height:100%;background:#16a34a;width:{pct}%}}.kpis{{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 28px}}
.kpi{{background:var(--card);border-radius:16px;padding:14px 18px;min-width:150px}}.kpi b{{display:block;font-size:28px;font-variant-numeric:tabular-nums}}
table{{width:100%;border-collapse:collapse}}th{{text-align:left;color:var(--soft);font-weight:500;padding:8px;border-bottom:1px solid var(--line);position:sticky;top:0;background:#fff}}
td{{padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:top}}a{{color:var(--ink);font-weight:600;text-decoration:none}}
.t{{color:var(--soft);font-size:12px}}.n{{font-size:12px;max-width:44ch}}.fam{{font-size:11px;background:var(--card);padding:1px 6px;border-radius:99px;color:var(--soft)}}
.s{{font-size:12px;padding:2px 8px;border-radius:99px;white-space:nowrap}}.s.ready{{background:#dcfce7;color:#166534}}.s.v2{{background:#e0e7ff;color:#3730a3}}
.s.building{{background:#fef3c7;color:#92400e}}.s.todo{{background:var(--card);color:var(--soft)}}.num{{font-variant-numeric:tabular-nums}}
.g img,.g video{{width:120px;height:75px;object-fit:cover;border-radius:8px;margin-right:6px;background:var(--card)}}.o{{font-size:12px;white-space:nowrap}}
@media(max-width:800px){{.g,.o,th:nth-child(5),th:nth-child(6){{display:none}}}}
</style><main><h1>Hanzo v2 status board</h1>
<p class="lede">{len(rows)} designs cover {urls} pages (families share one template). Ready means a critic scored it 8/10 or more, all 18 parts of the master brief are done on the page (its 18-part card), only Hanzo's colours, motion not overdone,
and video or screenshots as proof. Refreshes every minute; the conductor regenerates it every 10 minutes.</p>
<div class="bar"><i></i></div><div class="kpis">{"".join(f'<div class="kpi"><b>{count[s]}</b>{LABEL[s]}</div>' for s in order)}</div>
<table><tr><th>Page</th><th>State</th><th>Score</th><th>18 parts</th><th>Taste + motion</th><th>Proof</th><th>Chat</th></tr>{"".join(map(tr, rows))}</table></main>"""
(HZ / "docs/status.html").write_text(out)
print(f"status: {count['ready']} ready, {count['v2']} v2, {count['todo']} todo of {len(rows)} designs ({urls} pages)")
