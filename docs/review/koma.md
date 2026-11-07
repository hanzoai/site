# /koma — James-eye review

Reviewed: main, page files at `dbe4459` (Koma is built on the shared creative-model template, `components/pages/model/Creative.jsx`, with its own anamorphic frames and a "Scrub the shot." signature). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "The frames film is strong and it's black and white. But again no button on the first screen, the capability list is tiny mono text, and there's one red bar in the scrubber that isn't ours."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes for motion: Hanzo's Koma film (receding film frames over peaks) plays full-bleed under "Koma" and "Video generation and world simulation." No ask on the first screen.
2. **One in, one out?** Yes: the film settles beside "Every frame tells a story.", "What Koma does" pins the film while each capability (01 Temporal character continuity … 04 Keyframe-guided scene trajectories) takes its turn, then "Scrub the shot.", fields and the try-it close.
3. **A real object in every section?** Yes: film, capability film card, scrubber, field cards.
4. **One ask, sticky after the hero?** After the hero, yes: "Request access" solid, "Try it in Design" second, then the shared ask bar. Not on the first screen.
5. **Every hover and press answers?** Not reliably measured: the walk's hover pass ran while the hero buttons were still hidden under the film.
6. **Overlap, font swap, layout shift?** None visible; layout shift 0 and 0.04 on the phone.
7. **Which reference, and is its motion there?** synchronized.studio (card opens into this page, with a close) and apple.com pinned capability chapters. Both there.
8. **Different from its neighbours?** Yes: the frames film and the scrubber are Koma's own.
9. **All 18 parts covered?** See below.
10. **Banned tells?** One red UI fill on the scrubber's head (`kf-head`). Otherwise greys only, nothing above the h1.
11. **Copy untouched?** Yes: parity 56/56 text, 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask on the first screen; 0 `data-cta`.
- **2.6 Type floor:** 11 labels under 13px (11px "VIDEO" chip, 12px ids, the mono capability list).
- **2.10 Media:** 13 images without width and height.
- **2.11 Mobile:** after the hero most phone screens are still.

## Fixes (shared ones belong in `Creative.jsx`)
1. Put "Request access" (solid) and "Try it in Design" (link) on the first screen under the lede.
2. Make the scrubber head ink or white, not red.
3. Set the capability list at 13px or more in the body face, not tiny mono caps.
4. Give images width and height.
