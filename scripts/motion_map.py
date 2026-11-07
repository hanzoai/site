#!/usr/bin/env python3
"""Writes docs/MOTION-MAP.md + docs/motion-map.json: one signature interaction per design, so no two pages move alike.
James, 7 Nov: "every page follows the same process" (hero, pinned chapters, proof, band). Each page keeps its layout
but gets its own signature from SIGS. Rules: a signature is used by at most CAP pages, and never by two pages next to
each other in the tour order (public/wall/pages.json, grouped as the tour plays them). Run: python3 scripts/motion_map.py
"""
import json, re
from pathlib import Path

HZ = Path(__file__).resolve().parent.parent
CAP = 7
SIGS = {
    "drag-canvas":   ("Drag to explore", "An infinite canvas the visitor pans with the pointer (or a finger); the product's parts are laid out on it."),
    "zoom-map":      ("Zoom into the system", "Scroll zooms from the whole system down into one part, which then fills the screen and explains itself."),
    "h-gallery":     ("Sideways gallery", "Vertical scroll drives a horizontal track of panels; the page moves sideways for one stretch, then releases."),
    "spotlight":     ("Spotlight", "A dark section the cursor lights up; what is under the light reveals detail (touch: tap to place the light)."),
    "compare":       ("Before / after slider", "A divider the visitor drags across two states: without Hanzo and with it, old and new."),
    "card-stack":    ("Card stack", "A stack of cards flicked or dragged away one at a time; each card is one idea."),
    "terminal":      ("Live terminal", "A terminal types the real commands and streams real output; the visitor can pick the next command."),
    "object-3d":     ("Turn the object", "One 3D object (or 2.5D layered render) the visitor drags to rotate; parts label themselves as they face front."),
    "film-scrub":    ("Scrub the film", "Scroll scrubs a film or image sequence frame by frame, forwards and back."),
    "race":          ("Live race", "Bars, lanes or counters race against each other in real time, at the real ratios."),
    "graph":         ("Living graph", "Nodes and links that settle like a physics graph; hovering a node lights its paths and names them."),
    "split":         ("Split screen", "One side holds still while the other scrolls and changes it (the old pinned-chapters scene: rationed)."),
    "decode":        ("Decode", "Headlines and figures resolve out of scrambled characters as they arrive; hovering re-scrambles them."),
    "magnet-grid":   ("Magnetic grid", "A field of tiles or dots that bends toward the cursor and ripples when clicked."),
    "timeline":      ("Drag the timeline", "A timeline the visitor drags or scrubs; the page's content changes with the year or step."),
    "rows-open":     ("Rows that open", "A tight list whose rows expand in place on hover or tap into a full detail panel."),
    "live-chat":     ("Live conversation", "The product answers in real time on screen, with a choice of questions to ask it."),
    "flip-board":    ("Flip board", "Departure-board tiles flip through values (statuses, prices, regions) as data changes."),
    "ribbons":       ("Velocity ribbons", "Bands of words or logos whose speed and direction follow the scroll and lean with it."),
    "peel":          ("Peel the layers", "The product's stack lifts apart into floating layers in 3D, then closes again."),
    "word-light":    ("Words light up", "A long statement lights word by word as it is read (story pages)."),
    "stamp":         ("Stamp", "Elements land with weight: a short drop, a squash and a settle, like stamping a document."),
    "globe":         ("Globe", "A turning globe with live points and arcs between regions; drag to spin it."),
    "particles":     ("Particles form it", "A cloud of dots assembles into the product's shape or mark and scatters at the cursor."),
    "morph-panel":   ("One panel, many states", "A single panel that morphs smoothly between states as tabs or steps change, never cutting."),
    "waveform":      ("Waveform", "A live audio waveform that plays, scrubs and reacts to the pointer (voice and audio pages)."),
    "calculator":    ("Live calculator", "Sliders and inputs that reprice or re-plan everything on the page instantly."),
    "one-question":  ("One question at a time", "A form that asks one thing per screen, sliding to the next, with the answer summarised as it builds."),
    "keep":          ("Keep as is", "James approved this page's motion (7 Nov). Do not change it."),
}
# first matching rule gives a page its preference order; later fallbacks keep the spread even
RULES = [
    (r"^/$", ["keep"]),
    (r"^/(koe|oto|uta)$", ["waveform", "film-scrub", "particles"]),
    (r"^/(koma|gen|studio|gallery)$", ["film-scrub", "h-gallery", "card-stack"]),
    (r"^/(iro|design|brand|ui|gui)$", ["compare", "magnet-grid", "particles"]),
    (r"^/(mori|enso|zen|zen/.*)$", ["particles", "object-3d", "decode", "peel"]),
    (r"^/(kai|kai/.*|chat|bot|slack|operator|operative|agents)$", ["live-chat", "card-stack", "morph-panel"]),
    (r"^/(models|models/\*|leaderboard|benchmarks.*|compare.*|comparison)$", ["race", "rows-open", "card-stack", "flip-board"]),
    (r"^/(cli|dev|ide|sdks|api|mcp|kata|functions|tunnel|extension|chrome|desktop|download|computer)$", ["terminal", "compare", "peel", "morph-panel"]),
    (r"^/(platform|engine|base|machines|node|registry|s3|datastore)$", ["zoom-map", "peel", "drag-canvas", "object-3d"]),
    (r"^/(network|edge|dns|ingress|gateway|world|realtime|pubsub|stream|mq)$", ["globe", "graph", "ribbons", "flip-board"]),
    (r"^/(o11y|metrics|telemetry|insights|analytics|dashboards|visor|search|crawl)$", ["flip-board", "spotlight", "graph", "race"]),
    (r"^/(security|trust|guard|sentinel|hsm|kms|iam|identity|idv|authz|risk|sign)$", ["spotlight", "decode", "stamp", "peel"]),
    (r"^/(pricing|billing|payments|treasury|ledger|commerce|captable|startups|grants|tabs|zap)$", ["calculator", "flip-board", "stamp", "morph-panel"]),
    (r"^/(contact|contact-sales|beta|sms-opt-in|newsletter|support|buying-specialist|referral|affiliate|bounty|founder)$", ["one-question", "stamp", "card-stack"]),
    (r"^/(about|history|philosophy|team|careers|careers/\*|press|investors|research|learn|blog|blog/\*|customers|customers/\*)$", ["word-light", "timeline", "h-gallery", "magnet-grid"]),
    (r"^/(automations|auto|flow|playground|templates|skills|tag|features|integrations.*|oss/\*|open-source|solutions.*|products/\*|cloud/\*|dataroom|jin|enterprise|legal.*|help/.*|blockchain.*)$",
        ["drag-canvas", "h-gallery", "rows-open", "graph", "morph-panel", "ribbons"]),
]
ALL = [s for s in SIGS if s != "keep"]
# James, 7 Nov: "make them enter the screen different, vertical or merge together ... hundreds of different types".
# Each page's sections each enter a different way: PER_PAGE entrances per page, none repeated inside a page, none
# shared with the page before it in the tour, and the whole library used evenly.
ENTRANCES = {
    "split-merge": "two halves slide in from left and right and merge into one", "curtain-rise": "rises from below behind a clip, like a curtain",
    "drop-in": "falls in from above and settles with a small bounce", "iris": "a circular clip opens from the centre",
    "diagonal-wipe": "a diagonal clip sweeps across", "letter-cascade": "letters fall into place one by one",
    "word-shuffle": "words arrive out of order and swap into place", "grow-from-point": "grows from the point the visitor last clicked or the cursor",
    "fold-out": "unfolds like paper (rotateX from a hinge)", "card-deal": "items are dealt from a deck onto their places",
    "slot-roll": "text rolls vertically into place like a slot machine", "typewriter": "types itself out with a caret",
    "rack-focus": "comes into focus from a blur, like a camera pulling focus", "pixel-resolve": "resolves from coarse pixels to sharp",
    "tile-flip": "a grid of tiles flips in to form it", "blinds": "venetian-blind strips open",
    "zoom-through": "flies in from far behind the screen", "swing-door": "swings in on a vertical hinge (rotateY)",
    "spring-snap": "snaps in from the side and overshoots on a spring", "magnet-gather": "scattered pieces are pulled together into it",
    "explode-gather": "starts as fragments and collapses into the whole", "ink-spread": "an organic ink-blot mask spreads to reveal it",
    "line-draw": "its outlines draw themselves, then it fills", "count-roll": "its numbers count and roll into their values",
    "stack-drop": "layers drop and stack onto each other", "depth-parallax": "layers at different depths move at different speeds",
    "conveyor": "rides in on a horizontal conveyor", "shutter": "bars close from top and bottom, then open on it",
    "glitch-in": "a short monochrome glitch, then it holds still", "ripple": "a ripple spreads from the centre and leaves it behind",
    "domino": "items tip into place one after another like dominoes", "accordion": "unfolds section by section like an accordion",
    "page-curl": "the previous surface curls away at the corner to show it", "pendulum": "swings in and settles like a pendulum",
    "orbit-in": "items orbit into their places on a curve", "squash-land": "lands with a squash and stretch",
    "focus-pull-scroll": "the background blurs and the subject sharpens as it scrolls in", "invert-flash": "a black/white inversion flash, then normal",
    "grid-wave": "a grid ripples in by distance from the cursor", "scroll-tilt": "tilts on rotateX with scroll speed and levels out",
    "sticky-stack": "cards stack at the top as you scroll past them", "snap-sections": "sections snap one screen at a time",
    "side-carousel": "a horizontal snapping carousel", "text-mask-film": "a film plays through the letters of a headline",
    "opposite-drift": "left and right halves drift in opposite directions with scroll", "shrink-to-card": "the section shrinks into a card as you leave it",
    "cover-slide": "the next section slides up over the previous one", "pull-back": "starts zoomed right in and pulls back to reveal the whole",
    "tilt-3d-hover": "tilts in 3D toward the pointer", "cursor-trail": "a trail follows the cursor across it",
    "velocity-skew": "skews with scroll speed and straightens when still", "inertia-drag": "can be dragged and thrown with inertia",
    "scramble": "characters scramble and decode into it", "underline-sweep": "underlines sweep under key words in sequence",
    "stretch-scroll": "stretches vertically with scroll and relaxes", "noise-dissolve": "dissolves in from grain/noise",
    "cursor-lens": "a circular lens follows the cursor and magnifies", "vertical-ticker": "rides a vertical ticker into place",
    "spiral-in": "spirals in from the edge to its place", "venetian-type": "each line of type slides in from alternating sides",
}
PER_PAGE = 5

def group(k):  # same chapters as the tour (public/wall/index.html)
    if k == "/": return 0
    if k.endswith("/*"): return 6
    name = k[1:]
    if name in "enso kai koe koma mori oto uta iro zen models".split(): return 1
    if re.match(r"/(about|history|team|careers|press|investors|brand|contact|customers|philosophy|founder|support|trust|security|legal|newsletter)", k): return 5
    if re.match(r"/(pricing|enterprise|startups|grants|affiliate|referral|beta|bounty|buying|contact-sales|sms)", k): return 4
    if re.match(r"/(chat|dev|agents|api|bot|chrome|cli|computer|design|desktop|download|extension|gen|ide|kata|mcp|operative|operator|skills|slack|studio|tag|sdks|playground|console|gui|templates|ui)", k): return 2
    return 3

pages = json.loads((HZ / "public/wall/pages.json").read_text())
seen_keys, order = set(), []
for p in sorted(pages, key=lambda p: (group(p["key"]), p["key"])):
    if p["key"] in seen_keys: continue
    seen_keys.add(p["key"]); order.append(p)
used = {s: 0 for s in SIGS}
out, prev = [], None
for p in order:
    k = p["key"]
    pref = next((c for rx, c in RULES if re.match(rx, k)), [])
    rest = sorted(ALL, key=lambda s: used[s])  # least-used first, so the spread stays even
    pick = next(s for s in pref + rest if s == "keep" or (used[s] < CAP and s != prev))
    used[pick] += 1; prev = pick
    out.append({"key": k, "title": p["title"], "signature": pick})

import random
rng = random.Random(7)  # fixed seed: the map is stable between runs
ent_used, prev_set = {e: 0 for e in ENTRANCES}, set()
for r in out:
    if r["signature"] == "keep": r["entrances"] = []; continue
    pool = sorted((e for e in ENTRANCES if e not in prev_set), key=lambda e: (ent_used[e], rng.random()))
    r["entrances"] = pool[:PER_PAGE]
    for e in r["entrances"]: ent_used[e] += 1
    prev_set = set(r["entrances"])
assert all(not (set(a["entrances"]) & set(b["entrances"])) for a, b in zip(out, out[1:])), "neighbours share an entrance"
assert max(ent_used.values()) - min(ent_used.values()) <= 1
assert all(a["signature"] != b["signature"] for a, b in zip(out, out[1:])), "two neighbours share a signature"
assert max(v for s, v in used.items() if s != "keep") <= CAP
(HZ / "docs/motion-map.json").write_text(json.dumps({"signatures": {k: {"name": n, "what": w} for k, (n, w) in SIGS.items()}, "entrances": ENTRANCES, "pages": out}, indent=1))

md = ["# Motion map: one signature per page (James, 7 Nov)", "",
      "Every page used to move the same way: hero, then pinned scroll chapters, then proof, then a closing band. James:",
      "\"just don't have every page following the same process\". Keep each page's **layout**; change how it **moves**.", "",
      "## The rules", "",
      "1. Each page's **signature** (below) is its main interaction, built once and well, in the first or second screen.",
      "2. **No fixed section order.** MASTER.md's screen list is a menu, not a sequence. Start some pages with the demo, some with a statement, some with the signature itself.",
      "3. **The pinned-chapters scene (`split`) only where this map assigns it.** Elsewhere, remove pinned/sticky chapter scenes and scroll-scrubbed reveals that every page shares; replace them with the signature or plain, quick sections.",
      "4. **Supporting motion differs too:** no shared reveal on every section. At most one reveal style per page, and not the line-mask cut-in on every heading.",
      "5. Never remove motion James approved (`keep`), hover effects, counters or marquees. Layouts, copy and Hanzo's colours stay.",
      f"6. A signature is used by at most {CAP} pages and never by two neighbours in the tour (`/wall/`). Regenerate with `python3 scripts/motion_map.py`.",
      f"7. **Entrances (James: \"make them enter the screen different ... vertical or merge together\").** Each page also gets {PER_PAGE} entrances from the library below: its main sections each arrive a different way, in the order listed. No entrance repeats inside a page or with the page before it. Build them page-local (`components/pages/<page>/...`), not as one shared reveal.", "",
      "## Entrance library", ""]
md += [f"- **`{e}`**: {w}" for e, w in ENTRANCES.items()]
md += ["",
      "## Signatures", ""]
for s, (n, w) in SIGS.items():
    md.append(f"- **`{s}` {n}** ({used[s]} pages): {w}")
md += ["", "## Pages, in tour order", "", "| Page | Signature | Section entrances, in order |", "|---|---|---|"]
md += [f"| `{r['key']}` | `{r['signature']}` {SIGS[r['signature']][0]} | {', '.join('`' + e + '`' for e in r['entrances']) or 'keep as is'} |" for r in out]
(HZ / "docs/MOTION-MAP.md").write_text("\n".join(md) + "\n")
print(f"{len(out)} pages; signatures used: " + ", ".join(f"{s} {v}" for s, v in sorted(used.items(), key=lambda x: -x[1])))
