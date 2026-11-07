# /zen — James-eye review

Reviewed: main at `25b197c` (page files at `f68c8e5`), 7 Nov 15:00 UTC, under MASTER.md. First review of this page. Built on the shared model-launch template (`components/pages/model/`). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10 (capped: a card claim is false; the page itself scores 8)

First complaint: "On my phone the model cards jump around while the little demo steps through them, and the price figures are three huge numbers in a row."

**Cap: Part 13 performance (claim false).** `docs/coverage/zen.md` is in MASTER format with 18/18 `Done here:` lines, but Part 13 says "CLS measured 0.000 at 1470 and at 375 during a scroll of the page". My phone walk measured **0.166** (desktop 0.005). The shifts come from the model-cards demo: as "Next step" / "Replay" runs, `ul.ze-cards` grows and pushes the cards and the step button down (0.012, 0.014, 0.029, 0.047 …). Capped at 7 until the demo reserves its final height and the claim is true.

**Floats over content (MASTER 3.2 rule 6):** passes on desktop; my walk never saw the pill over content (a solid "Try Hanzo" stays on screen). The film's Pause sits in the stage, not over text.

**Scale (MASTER 3.1):** desktop passes: "Zen" at 112px alone over the film, then the 44px headline beside the film, one chapter title at a time, one 64px-class line in the close. On the phone the figures screen stacks three 44px figures at once (5.95 GB, 27.3B, $2.28): let one lead and set the other two at medium.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the sphere film and rings play under "Zen" and "Deep reasoning for complex problems." with "Try Hanzo" on the first screen; it settles into "Open models. Yours to run." beside the film.
2. **One in, one out?** Yes: stage, figures, chapters one at a time, the model-cards demo, the model grid, the black close.
3. **A real object in every section?** Yes: film, figures, cards, the demo, the model grid.
4. **One ask, sticky after the hero?** Yes: "Try Hanzo" in the hero, the header and the close; `data-cta` on the first screen and the headline.
5. **Every hover and press answers?** "Try Hanzo" and Pause answer on hover and press. The settled "API Platform" / "Docs on GitHub" sit invisible under the first screen until the stage settles, so my hover test there was empty; not counted.
6. **Overlap, font swap, layout shift?** No overlap seen. **Phone layout shift 0.166** (cap above). Desktop 0.005.
7. **Which reference, and is its motion there?** apple.com pinned launch and synchronized.studio (card opens into the page, × closes). Both there.
8. **Different from its neighbours?** The family page shares the model-launch frame with the nine Zen-name pages; its own film and demo set it apart.
9. **All 18 parts covered?** Card 18/18; Part 13 claim false.
10. **Banned tells?** None measured.
11. **Copy untouched?** Card states parity 23/23 text, 6/6 links; not contradicted by the walk.

## Missing from the 18 parts (MASTER, measured)
- **Part 13 performance:** the model-cards demo shifts layout on the phone (0.166).
- **Part 10 media:** 5 raw `<video>` elements on the page (the card names `ModelFilm`; check they all go through it).

## Fixes
1. Reserve the demo's final height (or animate inside a fixed box) so stepping never moves the cards; re-measure and correct the Part 13 line.
2. Phone figures: one figure big, the other two at medium.
