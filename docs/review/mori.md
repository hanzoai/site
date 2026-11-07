# /mori — James-eye review

Reviewed: main, page files at `dbe4459` (Mori is built on the shared creative-model template, `components/pages/model/Creative.jsx`; see also /iro, /koe, /koma). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Same as Koe: a lovely film and black and white, but no button on the first screen, and on my phone the cube stops moving once it lands."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes for motion (Hanzo's Mori film, a wireframe terrain, plays full-bleed under "Mori" and "3D generation and spatial understanding."); no ask on the first screen. Phone: the film settles into a cube beside "Build worlds, not just images." and then stops (0% change).
2. **One in, one out?** Yes on desktop: film into cube, capabilities pinned one at a time, fields, try-it close. Phone screens after the hero are mostly still.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** After the hero, yes ("Request access", then the shared ask bar). Not on the first screen.
5. **Every hover and press answers?** Not reliably measured (hero buttons hidden under the film during the hover pass).
6. **Overlap, font swap, layout shift?** None; layout shift 0 and 0.018.
7. **Which reference, and is its motion there?** synchronized.studio card-to-page with a close; apple.com chapters. Both there.
8. **Different from its neighbours?** Yes in film and shape (cube vs capsule vs frame); same layout as the other creative models.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None measured.
11. **Copy untouched?** Yes: parity 52/52 text, 4/4 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask on the first screen; 0 `data-cta`.
- **2.11 Mobile:** the cube's film stops after it settles.
- **2.6 Type floor:** 11 labels under 13px (11px "3D" chip, 12px ids).
- **2.12 Accessibility:** no pause control for the looping film.

## Fixes (in `Creative.jsx`, shared with Iro, Koe, Koma, Oto, Uta)
1. "Request access" (solid) and "Try it in Design" (link) on the first screen.
2. Keep the film playing inside its shape on the phone.
3. Raise chips and ids to 13px; add a pause control for the film.
