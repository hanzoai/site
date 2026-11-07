# /koe — James-eye review

Reviewed: main, page files at `dbe4459` (Koe is built on the shared creative-model template, `components/pages/model/Creative.jsx`, with its own voice capsule and waveform). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Black and white, finally, and the voice film is lovely on my laptop. But on my phone the film freezes in its capsule, there's a big empty gap under it, and on both there's no button until I scroll."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes for motion, Hanzo's Koe film (white voice ribbons) plays full-bleed under "Koe" and "Voice synthesis and speech understanding."; no ask on the first screen. Phone: after the film settles into its capsule, the capsule is still (0% change) and a large white gap sits between it and "Performance in every word.".
2. **One in, one out?** Yes on desktop: the film settles into the capsule beside "Performance in every word.", then "What Koe does", then the signature "One word, four performances." (the waveform re-performs "Hanzo" per preset), then fields and the try-it close.
3. **A real object in every section?** Yes: film, capsule, waveform with phonemes, field cards.
4. **One ask, sticky after the hero?** After the hero, yes: "Request access" (Hanzo's honest label for a research preview) solid with "Try it in Design" as the second, then the shared ask bar. Not on the first screen.
5. **Every hover and press answers?** Not reliably measured: the walk's hover pass ran while the hero buttons were still hidden under the film.
6. **Overlap, font swap, layout shift?** None visible; layout shift 0 and 0.004.
7. **Which reference, and is its motion there?** synchronized.studio (card opens into this page, with a close) and apple.com chapters. Both there.
8. **Different from its neighbours?** Yes: the waveform-and-phonemes signature is Koe's own.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None measured: no UI hue, nothing above the h1 (the "Voice · Koe 1" line sits directly over the second headline as a small label, borderline).
11. **Copy untouched?** Yes: parity 58/58 text, 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask on the first screen; 0 `data-cta`.
- **2.11 Mobile:** the capsule film does not play after it settles; empty gap under it.
- **2.6 Type floor:** 10 labels under 13px (11px "VOICE" chip, 12px model ids).
- **2.10 Media:** 13 of 14 images without width and height.

## Fixes (in `Creative.jsx` where shared, so they reach all six creative models)
1. Put "Request access" (solid) and "Try it in Design" (link) on the first screen under the lede.
2. Phone: keep the film playing in the capsule, and close the gap so the headline follows it directly.
3. Raise the chip and ids to 13px or more; give images width and height.
