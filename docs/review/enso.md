# /enso — James-eye review

Reviewed: main at `25b197c` (page files at `f68c8e5`), 7 Nov 15:01 UTC, under MASTER.md. Earlier: 7/10 at `d3752c2`, `d37d413` and `1417fde`. Built on the shared model-launch template (`components/pages/model/`). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10 (the pill floats over the chart; three big figures at once)

First complaint: "That little bar at the bottom sits right on top of the chart. And the three percentages all shout at the same size."

**Card:** `docs/coverage/enso.md` is now in MASTER format, 18/18 `Done here:` lines. The claims I could measure hold: CLS 0.0003 at 1470 and 0.0004 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, the Pause at the stage foot.

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** at 1470×801 the shared pill ("Hanzo Enso · search · Try Hanzo") sits over the page from the GPQA screen to the tiers (screens 8–15 of my walk), over the Pareto chart's lower points. Part 4's card line says the shared ask bar carries "Try Hanzo" after the hero: true, and that is the problem. Turn it off on this page (`data-ask="off"` on `<main>`) and let the header carry the ask.

**Scale (MASTER 3.1):** the stage passes ("Enso" 112px alone over the film, then the 44px headline). The GPQA screen sets three 64px figures side by side (98.0%, 96.5%, 95.5%) on desktop and stacks them on the phone: three big things at once. Let Enso Ultra's figure lead and set the other two at medium.

## What changed since the last review
Now on the MASTER card. The name rests at 112px (was 176px) and the headline settles at 44px. The phone keeps "Try Hanzo" on the first screen.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the ring film, "Enso" and "Try Hanzo" on the first screen, settling into "The right intelligence. Every time."
2. **One in, one out?** Yes: stage, tiers, live router room, GPQA figures, Pareto chart, table, close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** Through the floating pill on desktop (fail above); the header's "Try Hanzo" stays an outline.
5. **Every hover and press answers?** "Try Hanzo" and Pause answer. The × close presses but shows no hover change.
6. **Overlap, font swap, layout shift?** The pill over the chart (above). Layout shift 0.0003 and 0.0004.
7. **Which reference, and is its motion there?** synchronized.studio (card opens into the page) and the anthropic launch (GPQA as hero figures). Both there.
8. **Different from its neighbours?** Yes: router room and GPQA tour are its own.
9. **All 18 parts covered?** Card 18/18; Part 4 fails MASTER 3.2 rule 6 as written.
10. **Banned tells?** A floating pill over content.
11. **Copy untouched?** Card states parity 72/72 text, 11/11 links; not contradicted.

## Fixes
1. `data-ask="off"` on this page's `<main>` (or the shared header-only mode once it lands); "Try Hanzo" solid in the sticky header after the hero.
2. GPQA row: one big figure (Enso Ultra 98.0%), the other two at medium.
3. Give the × close the kit hover.
