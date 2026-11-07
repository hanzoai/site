#!/usr/bin/env python3
"""James's two most repeated complaints, checked automatically (docs/JAMES.md):
  1. colour: UI must be 0 hues (greys, silvers, blacks, whites); colour only from Hanzo's media
  2. a label, tag, pill, badge or eyebrow sitting directly above a headline

Usage: python3 scripts/taste.py [file ...]   (no args = every page file; exit 1 = a file fails)
"""
import colorsys, re, sys
from pathlib import Path

PAGES = Path(__file__).resolve().parent.parent / "components"
HEX = re.compile(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")
FUNC = re.compile(r"(?:rgba?|hsla?)\(([^)]*)\)")
EYEBROW = re.compile(r"className=[\"'{`][^\"'}`>]*(kick|eyebrow|overline|badge|pill|tag|label|chip)[^>]*>[^<]{0,80}</\w+>\s*<(?:h1|h2|[A-Za-z.]+[^>]*\bas=[\"']h[12][\"'])", re.S)

def sat(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return s * (1 - abs(2 * l - 1))  # chroma: 0 for any grey, black or white

def hues(text):
    bad = set()
    for m in HEX.finditer(text):
        h = m.group(1); h = "".join(c * 2 for c in h) if len(h) == 3 else h
        if sat(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)) > 0.08: bad.add("#" + m.group(1))
    for m in FUNC.finditer(text):
        nums = re.findall(r"\d*\.?\d+%?", m.group(1))
        if "$" in m.group(1) or "var(" in m.group(1): continue
        if m.group(0).startswith("hsl"):
            if len(nums) >= 3 and float(nums[1].rstrip("%")) > 8 and 8 < float(nums[2].rstrip("%")) < 92: bad.add(m.group(0)[:30])
        elif len(nums) >= 3 and sat(*[float(n.rstrip("%")) for n in nums[:3]]) > 0.08: bad.add(m.group(0)[:30])
    return sorted(bad)

def check(path):
    text = path.read_text(errors="ignore")
    why = []
    h = hues(re.sub(r"/\*.*?\*/|//[^\n]*", "", text, flags=re.S))
    if h: why.append(f"{len(h)} UI hue(s) (James: greys/silvers/blacks/whites only): {', '.join(h[:6])}")
    if path.suffix == ".jsx" and EYEBROW.search(text): why.append("a label/tag/pill sits right above a headline")
    return why

def main(args):
    files = [Path(a) for a in args] or sorted(p for p in PAGES.rglob("*") if p.suffix in (".jsx", ".css"))
    bad = [(f, w) for f in files if f.is_file() and (w := check(f))]
    for f, w in bad: print(f"TASTE FAIL {f}: {'; '.join(w)}")
    print(f"taste: {'OK' if not bad else str(len(bad)) + ' file(s) break James rules'} ({len(files)} checked)")
    return 1 if bad else 0

if __name__ == "__main__":
    assert sat(128, 128, 128) == 0 and sat(255, 120, 0) > 0.5 and hues("#0a0a0a #fff rgba(0,0,0,.5)") == [] and hues("#ff8800") == ["#ff8800"]
    sys.exit(main(sys.argv[1:]))
