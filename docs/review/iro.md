# /iro — James-eye review

Reviewed: main at `25b197c` (page files at `f68c8e5`), 7 Nov 15:06 UTC, under MASTER.md. Earlier: 7/10 at `1417fde`. Built on the shared creative-model template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10 (the pill floats over the film and the field cards)

First complaint: "The bar at the bottom sits right on the film and cuts through the campaign card's words."

**Card:** `docs/coverage/iro.md` is now in MASTER format, 18/18 `Done here:` lines. Most measured claims hold (h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, first-screen ask). Part 13 says "CLS 0.000 at 375"; my phone walk measured 0.029. Small, but correct the line.

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** at 1470×801 the shared pill ("Iro · search · Request access") is on screen from screen 3 to 15 of my walk. It sits over the chapter film card (next to "16-bit wide-gamut output") and over the field cards' text ("…channel campaign", "Custom hero cover artwork"). Turn it off here (`data-ask="off"` on `<main>`) and let the header carry "Request access". The phone walk saw no bar over content.

**Scale (MASTER 3.1):** passes. "Iro" rests at 112px alone over the film, the headline settles at 44px, and each capability screen shows one title (my counter sees four stacked chapter titles; only one shows).

## What changed since the last review
Now on the MASTER card. The name rests at 112px (was 176px); the related-model labels follow SPEC.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the cloud film under "Iro", "Request access" on the first screen, settling into "Imagine without limits."
2. **One in, one out?** Yes: stage, capabilities pinned one at a time, signature, fields, related models, close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** Through the floating pill on desktop (fail above).
5. **Every hover and press answers?** "Request access" and the model cards answer. The × close shows no hover change.
6. **Overlap, font swap, layout shift?** The pill over content (above). Shift 0.0004 and 0.029.
7. **Which reference, and is its motion there?** synchronized.studio and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; Part 4 fails MASTER 3.2 rule 6; Part 13's phone figure is off.
10. **Banned tells?** A floating pill over content.
11. **Copy untouched?** Card states parity 51/51 text, 4/4 links; not contradicted.

## Fixes
1. `data-ask="off"` on this page (or the shared header-only mode once it lands); "Request access" solid in the sticky header after the hero.
2. Find the 0.029 phone shift and fix it, or write the measured figure in Part 13.
3. Give the × close the kit hover.
