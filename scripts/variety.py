#!/usr/bin/env python3
"""Motion variety check (DESIGN.md "Motion: varied and restrained", James 7 Nov).

Counts the motion techniques each page file uses, prints how often each is used
site-wide, and fails a page that overdoes it:
  - more than 2 fade-ups (<Rise) on one page
  - more than 4 distinct techniques on one page (one signature + supporting few)

Usage: python3 scripts/variety.py [page.jsx ...]   (no args = every page; exit 1 = a page fails)
"""
import re, sys
from pathlib import Path

PAGES = Path(__file__).resolve().parent.parent / "components" / "pages"
TECH = {
    "fade-up (Rise)": r"<Rise\b", "word reveal (Words)": r"<Words\b", "count-up (Count)": r"<Count\b",
    "split-flap (Flap)": r"<Flap\b", "drawn tick (Tick)": r"<Tick\b", "tilt (useTilt)": r"\buseTilt\(",
    "magnetic": r"<Magnetic\b", "sigil field": r"<Sigil\b", "layout re-flow (layoutId)": r"\blayoutId=",
    "scroll scrub (useScroll)": r"\buseScroll\(", "svg line draw (pathLength)": r"\bpathLength\b",
    "drag / inertia": r"\bdrag(=|Constraints)", "clip reveal": r"clipPath", "canvas / rAF loop": r"requestAnimationFrame",
    "spring follow (useSpring)": r"\buseSpring\(", "typing": r"\b(useType|typeWriter|typing)\b",
}
MAX_RISE, MAX_TECH = 2, 4

def scan(path):
    text = path.read_text(errors="ignore")
    used = {name: len(re.findall(rx, text)) for name, rx in TECH.items()}
    return {k: v for k, v in used.items() if v}

def main(args):
    files = [Path(a) for a in args] or sorted(PAGES.rglob("*.jsx"))
    files = [f for f in files if "Signature:" in f.read_text(errors="ignore")[:4000]] if not args else files  # page files only, not parts
    site, bad = {}, []
    for f in files:
        used = scan(f)
        for k in used: site[k] = site.get(k, 0) + 1
        why = []
        if used.get("fade-up (Rise)", 0) > MAX_RISE: why.append(f"{used['fade-up (Rise)']} fade-ups (max {MAX_RISE})")
        if len(used) > MAX_TECH: why.append(f"{len(used)} techniques (max {MAX_TECH}): {', '.join(used)}")
        if why: bad.append((f, why))
    print(f"variety: {len(files)} page file(s). Site-wide use (pages):")
    for k, v in sorted(site.items(), key=lambda kv: -kv[1]): print(f"  {v:4d}  {k}")
    print("  least used = reach for these first")
    for f, why in bad: print(f"FAIL {f.relative_to(PAGES.parent.parent) if f.is_absolute() else f}: {'; '.join(why)}")
    print(f"variety: {'OK' if not bad else str(len(bad)) + ' page(s) overdo motion'}")
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
