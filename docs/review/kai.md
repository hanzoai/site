# /kai — James-eye review

Reviewed: main at `648b798` (page files at `f68c8e5`; shared ask fix `d2b5ab8c` in), re-walked 7 Nov 15:15 UTC, under MASTER.md. Earlier: 7/10 at `d3752c2`; 6/10 at `25b197c` (before the shared ask fix). Built on the shared model-launch template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 8/10 (ready on my checks; polish only)

First complaint: "Good. The diamond and the decision demo sell it. Up top I see two black-and-white buttons at once, though."

**Card:** `docs/coverage/kai.md` is now in MASTER format, 18/18 `Done here:` lines. Measured claims hold: layout shift 0.0003 at 1470 and 0.0007 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, the first-screen ask.

**Floats over content (MASTER 3.2 rule 6):** passes since the shared fix (`d2b5ab8c`): no pill on desktop; on the phone the bar showed at no rest stop of 25.

**Scale (MASTER 3.1):** passes. "Kai" at 112px alone over the diamond film, the 44px headline, one chapter title at a time, the 64px-class close line.

## What changed since the last review
The shared fix took the floating bar away. Fixed: "Open Decisions" now sits solid on the first screen (one ask, not two), the phone's layout shift is gone (0.13 → 0.0009), and the page is on the MASTER card.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the diamond film, "Kai", "Precise decisions and structured reasoning." and "Open Decisions".
2. **One in, one out?** Yes: stage, the self-resolving decision tree, chapters, model cards, the close.
3. **A real object in every section?** Yes: film, decision tree (POST /v1/decisions, `churn_risk`, P(true) slider), cards.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; the hero's "Open Decisions" is solid too, so the first screen shows two solids (the shared header, see `_shared.md`).
5. **Every hover and press answers?** "Open Decisions" and the cards answer; the × close presses but shows no hover change.
6. **Overlap, font swap, layout shift?** None; shift 0.0003 and 0.0007.
7. **Which reference, and is its motion there?** apple.com pinned launch and synchronized.studio. Both there.
8. **Different from its neighbours?** Yes: the decision tree is its own.
9. **All 18 parts covered?** Card 18/18; the claims I measured hold.
10. **Banned tells?** None measured.
11. **Copy untouched?** Card states parity 16/16 text, 4/4 links; not contradicted.

## Fixes (polish, not blocking)
1. Give the × close the kit hover.
2. When the shared header can carry a page's own ask, put "Open Decisions" there so only one solid shows.
