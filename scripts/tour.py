#!/usr/bin/env python3
"""Writes docs/tour.html: what changed on the site, so James looks at ~20 pages, not 800.

New today = page file created since 7 Nov 06:00; upgraded today = older file edited since then.
Families show one example member each. Re-run any time: python3 scripts/tour.py && open docs/tour.html
"""
import html, json, re
from pathlib import Path

HZ = Path(__file__).resolve().parent.parent
CUT = 1794031200  # 7 Nov 2026 06:00, when the chats started
INDEX = json.loads((HZ / "content/pages.json").read_text())
BASE = "http://localhost:4180"

def note(text, key):
    m = re.search(key + r":\s*(.+?)(?=\n\s*(?:\*/|//)?\s*(?:Beyond:|Signature:)|\n\s*\n|\*/|$)", text, re.S)
    s = re.sub(r"\s*(\*|//)\s*", " ", m.group(1)).strip() if m else ""
    return (s[:170] + "…") if len(s) > 170 else s

def entry(route, page):
    src = page.read_text(errors="ignore")
    m = re.search(r"from\s+['\"](\.\./[^'\"]*components/pages/[^'\"]+)['\"]", src)
    comp = (page.parent / m.group(1)).resolve() if m else page
    comp = next((p for p in [comp, comp.with_suffix(".jsx")] if p.is_file()), page)
    st, text = comp.stat(), comp.read_text(errors="ignore")
    kind = "new" if st.st_birthtime > CUT else "upgraded" if st.st_mtime > CUT else "earlier"
    title = (INDEX.get(route) or {}).get("title", route).split(" — ")[0]
    return dict(route=route, title=title, kind=kind, sig=note(text, "Signature"), beyond=note(text, "Beyond"))

pages, fams = [], []
for page in sorted((HZ / "app").rglob("page.jsx")):
    rel = page.parent.relative_to(HZ / "app").as_posix()
    if rel.startswith(("_", "[...")): continue
    if "[" in rel:  # family template: link one real member
        prefix = "/" + rel.split("/[")[0] + "/"
        member = next((r for r in sorted(INDEX) if r.startswith(prefix) and r.count("/") == prefix.count("/")), None)
        if member: fams.append(entry(member, page) | {"fam": prefix + "*", "n": sum(r.startswith(prefix) for r in INDEX)})
    else:
        pages.append(entry("/" + rel if rel != "." else "/", page))

new = [p for p in pages if p["kind"] == "new"]
upg = [p for p in pages if p["kind"] == "upgraded"]
old = [p for p in pages if p["kind"] == "earlier"]
assert len(new) + len(upg) + len(old) == len(pages)
start = [p for p in pages if p["route"] == "/"] + [p for p in new if p["beyond"]][:9] + fams[:3]

def row(p):
    fam = f'<span class="tag">{html.escape(p["fam"])} · {p["n"]} pages</span>' if "fam" in p else ""
    badge = {"new": "New today", "upgraded": "Upgraded today", "earlier": "Rebuilt 6 Nov"}[p["kind"]]
    return (f'<li><a href="{BASE}{html.escape(p["route"].rstrip("/"))}/" target="_blank">{html.escape(p["route"])}</a>'
            f'<span class="b {p["kind"]}">{badge}</span>{fam}<div class="t">{html.escape(p["title"])}</div>'
            + (f'<div class="s"><b>Signature</b> {html.escape(p["sig"])}</div>' if p["sig"] else "")
            + (f'<div class="s"><b>Beyond</b> {html.escape(p["beyond"])}</div>' if p["beyond"] else "") + "</li>")

def sec(title, items, lede=""):
    return f'<h2>{title} <span>{len(items)}</span></h2><p class="l">{lede}</p><ul>{"".join(map(row, items))}</ul>' if items else ""

out = f"""<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hanzo site tour</title><style>
:root{{--ink:#0a0a0a;--soft:#6e6e73;--line:rgba(0,0,0,.08);--card:#f5f5f7}}
body{{margin:0;background:#fff;color:var(--ink);font:15px/1.5 -apple-system,system-ui,sans-serif}}
main{{max-width:880px;margin:0 auto;padding:48px 16px 96px}}h1{{font-size:34px;letter-spacing:-.03em;margin:0 0 6px}}
h2{{font-size:20px;margin:44px 0 4px;letter-spacing:-.02em}}h2 span{{color:var(--soft);font-weight:400}}
.l,.lede{{color:var(--soft);margin:0 0 14px}}ul{{list-style:none;margin:0;padding:0}}
li{{padding:14px 0;border-top:1px solid var(--line)}}a{{color:var(--ink);font-weight:600;text-decoration:none}}a:hover{{text-decoration:underline}}
.b,.tag{{font-size:12px;margin-left:10px;padding:2px 8px;border-radius:99px;background:var(--card);color:var(--soft)}}
.b.new{{background:#0a0a0a;color:#fff}}.b.upgraded{{background:#e8f0ff;color:#1d4ed8}}
.t{{color:var(--soft);font-size:14px}}.s{{font-size:14px;margin-top:4px;max-width:72ch}}.s b{{font-weight:600;margin-right:6px}}
</style><main><h1>What changed on the Hanzo site</h1>
<p class="lede">Open these in Chrome while the dev server runs (localhost:4180). {len(new)} pages new today, {len(upg)} upgraded today,
{len(fams)} page families (one example each), {len(old)} rebuilt on 6 Nov and not touched since. Re-run <code>python3 scripts/tour.py</code> for the latest.</p>
{sec("Start here", start, "The best ten or so to judge first: home, new pages with a feature hanzo.ai lacks, and the new families.")}
{sec("New today", new)}{sec("Upgraded today", upg)}{sec("Page families", fams, "One template each; the link opens one real member.")}
{sec("Rebuilt on 6 Nov, not touched since", old)}</main>"""
(HZ / "docs/tour.html").write_text(out)
print(f"tour: {len(new)} new, {len(upg)} upgraded, {len(fams)} families, {len(old)} earlier -> docs/tour.html")
