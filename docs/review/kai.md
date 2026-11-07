# /kai — James-eye review

Reviewed: main at `25b197c` (page files at `f68c8e5`), 7 Nov 15:04 UTC, under MASTER.md. Earlier: 7/10 at `d3752c2`. Built on the shared model-launch template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10 (the phone bar covers the cards; page otherwise 8)

First complaint: "On my phone the black 'Open Decisions' bar sits on top of the cards and the demo as I scroll."

**Card:** `docs/coverage/kai.md` is now in MASTER format, 18/18 `Done here:` lines. Measured claims hold: layout shift 0.0005 at 1470 and 0.0009 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, the first-screen ask.

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** desktop passes (my walk never saw the pill; a solid stays on screen). On the phone the full-width "Open Decisions" bar is on screen from the second screen to the tenth and sits over content: the decision demo's chips ("Support ticket", "Payment question"), the foot of the Kai 1.8 card and the model grid. MASTER allows a phone bar "only where it never covers content". Turn it off here (`data-ask="off"`) until the shared owner offers a bar that clears content.

**Scale (MASTER 3.1):** passes. "Kai" at 112px alone over the diamond film, the 44px headline, one chapter title at a time, the 64px-class close line.

## What changed since the last review
Fixed: "Open Decisions" now sits solid on the first screen (one ask, not two), the phone's layout shift is gone (0.13 → 0.0009), and the page is on the MASTER card.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the diamond film, "Kai", "Precise decisions and structured reasoning." and "Open Decisions".
2. **One in, one out?** Yes: stage, the self-resolving decision tree, chapters, model cards, the close.
3. **A real object in every section?** Yes: film, decision tree (POST /v1/decisions, `churn_risk`, P(true) slider), cards.
4. **One ask, sticky after the hero?** Desktop yes. Phone: through a bar that covers content (fail above).
5. **Every hover and press answers?** "Open Decisions" and the cards answer; the × close presses but shows no hover change.
6. **Overlap, font swap, layout shift?** The phone bar over content (above). Shift 0.0005 and 0.0009.
7. **Which reference, and is its motion there?** apple.com pinned launch and synchronized.studio. Both there.
8. **Different from its neighbours?** Yes: the decision tree is its own.
9. **All 18 parts covered?** Card 18/18; Part 4 fails MASTER 3.2 rule 6 on the phone.
10. **Banned tells?** A bar over content on the phone.
11. **Copy untouched?** Card states parity 16/16 text, 4/4 links; not contradicted.

## Fixes
1. `data-ask="off"` on this page (or the shared mode that clears content once it lands); the header's "Try Hanzo" becomes "Open Decisions" after the hero.
2. Give the × close the kit hover.
