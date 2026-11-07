#!/usr/bin/env python3
"""James's two most repeated complaints, checked automatically (docs/JAMES.md):
  1. colour: UI must be 0 hues (greys, silvers, blacks, whites); colour only from Hanzo's media
  (eyebrows are allowed: Hanzo's own system uses 11-12px Zen Mono capitals; coloured ones fail via rule 1)

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

DECK = ['#000000','#0a0a0a','#0f0f0f','#171717','#262626','#404040','#525252','#737373','#a3a3a3','#d4d4d4','#e4e4e4','#e4e4e7','#e5e5e5','#e9e9e9','#ededed','#f2f2f2','#f5f5f5','#f6f6f6','#f7f7f7','#fafafa','#fbfbfb','#fdfdfd','#ffffff']
def lum(r, g, b): return 0.2126 * r + 0.7152 * g + 0.0722 * b
def nearest(r, g, b):
    L = lum(r, g, b)
    return min(DECK, key=lambda h: abs(lum(int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)) - L))
def fix(text):
    def hx(m):
        h = m.group(1); h6 = "".join(c * 2 for c in h) if len(h) == 3 else h
        rgb = [int(h6[i:i + 2], 16) for i in (0, 2, 4)]
        return m.group(0) if sat(*rgb) <= 0.08 else nearest(*rgb)
    def fn(m):
        if "$" in m.group(1) or "var(" in m.group(1) or m.group(0).startswith("hsl"): return m.group(0)
        n = re.findall(r"\d*\.?\d+%?", m.group(1))
        if len(n) < 3: return m.group(0)
        rgb = [float(x.rstrip("%")) for x in n[:3]]
        if sat(*rgb) <= 0.08: return m.group(0)
        d = nearest(*rgb); a = n[3] if len(n) > 3 else None
        return d if a is None else f"rgba({int(d[1:3],16)}, {int(d[3:5],16)}, {int(d[5:7],16)}, {a})"
    return FUNC.sub(fn, HEX.sub(hx, text))

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
    if h: why.append(f"{len(h)} colour(s) not in Hanzo's live palette (docs/original/brand-deck.html): {', '.join(h[:6])}")
    return why

def main(args):
    if args and args[0] == "--fix":
        n = 0
        for a in args[1:]:
            p = Path(a); s = p.read_text(errors="ignore"); f = fix(s)
            if f != s: p.write_text(f); n += 1
        print(f"taste --fix: recoloured {n} file(s) to Hanzo's live palette"); args = args[1:]
    files = [Path(a) for a in args] or sorted(p for p in PAGES.rglob("*") if p.suffix in (".jsx", ".css"))
    bad = [(f, w) for f in files if f.is_file() and (w := check(f))]
    for f, w in bad: print(f"TASTE FAIL {f}: {'; '.join(w)}")
    print(f"taste: {'OK' if not bad else str(len(bad)) + ' file(s) break James rules'} ({len(files)} checked)")
    return 1 if bad else 0

if __name__ == "__main__":
    assert nearest(255, 120, 0) in DECK and fix("a{color:#ff8800}") != "a{color:#ff8800}" and fix("#0a0a0a") == "#0a0a0a"
    assert sat(128, 128, 128) == 0 and sat(255, 120, 0) > 0.5 and hues("#0a0a0a #fff rgba(0,0,0,.5)") == [] and hues("#ff8800") == ["#ff8800"]
    sys.exit(main(sys.argv[1:]))
