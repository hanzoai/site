#!/usr/bin/env python3
"""Accent films for the v2 model launch pages (Zen-names chat, wave 2 group 12).

Each named model's card film (public/models/<slug>.webm|.webp, black and white) gets a duotone copy in its page's
accent: black stays black, the mid-tones take the accent, the highlights run to near-white. The colour is baked into
the picture itself, so the page needs no blend or filter on a playing video (both broke the hero's clip-path shape on
2x screens in Chromium). Output: public/models/v2/<slug>.webm|.webp. Re-run after changing an accent.

Usage: python3 scripts/tint.py [slug ...]      (ffmpeg with libvpx-vp9 and libwebp on PATH)
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "public" / "models", ROOT / "public" / "models" / "v2"
ACCENT = {
    "enso": "e5412d", "kai": "2d5bff", "zen": "0e9f8e", "iro": "e6337a", "koma": "f29a1f",
    "oto": "0ba5d9", "koe": "7b4dff", "uta": "e0a106", "mori": "1f9d55",
}
KNEE = 128  # the grey level that maps exactly to the accent

def lut(c):
    # black -> accent at the knee -> 92% of the way to white at the top
    return f"if(lt(val,{KNEE}),val/{KNEE}*{c},{c}+(val-{KNEE})/{255 - KNEE}*(255-{c})*0.92)"

def main(slugs):
    OUT.mkdir(parents=True, exist_ok=True)
    for s in slugs or ACCENT:
        r, g, b = (int(ACCENT[s][i:i + 2], 16) for i in (0, 2, 4))
        vf = f"format=gbrp,lutrgb=r='{lut(r)}':g='{lut(g)}':b='{lut(b)}'"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(SRC / f"{s}.webp"), "-vf", vf, "-c:v", "libwebp", "-quality", "82", str(OUT / f"{s}.webp")], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(SRC / f"{s}.webm"), "-vf", vf + ",format=yuv420p", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36",
                        "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-an", str(OUT / f"{s}.webm")], check=True)
        print(s, *(f"{(OUT / f'{s}.{e}').stat().st_size // 1024}KB" for e in ("webp", "webm")))

if __name__ == "__main__":
    main(sys.argv[1:])
