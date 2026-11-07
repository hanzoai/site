# /iro — James-eye review

Reviewed: main at `648b798` (page files at `f68c8e5`; shared ask fix `d2b5ab8c` in), re-walked 7 Nov 15:12 UTC, under MASTER.md. Earlier: 7/10 at `1417fde`; 6/10 at `25b197c` (before the shared ask fix). Built on the shared creative-model template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10 (capped: a card claim is false; the page itself scores 8)

First complaint: "Lovely film. On my phone something on the page nudges as I scroll, and up top I see two black-and-white buttons at once."

**Card:** `docs/coverage/iro.md` is now in MASTER format, 18/18 `Done here:` lines. Most measured claims hold (h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, first-screen ask). **Cap: Part 13 performance (claim false).** Part 13 says "CLS measured 0.000 at 1470 and at 375"; my phone walk measured 0.029 on two walks (`25b197c` and `648b798`). Fix the shift or write the true figure.

**Floats over content (MASTER 3.2 rule 6):** passes since the shared fix (`d2b5ab8c`): no pill on desktop; on the phone the bar showed at 1 of 31 rest stops and covered nothing.

**Scale (MASTER 3.1):** passes. "Iro" rests at 112px alone over the film, the headline settles at 44px, and each capability screen shows one title (my counter sees four stacked chapter titles; only one shows).

## What changed since the last review
The shared fix took the floating pill away. Now on the MASTER card. The name rests at 112px (was 176px); the related-model labels follow SPEC.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the cloud film under "Iro", "Request access" on the first screen, settling into "Imagine without limits."
2. **One in, one out?** Yes: stage, capabilities pinned one at a time, signature, fields, related models, close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; the hero's "Request access" is solid too, so the first screen shows two solids (the shared header, see `_shared.md`).
5. **Every hover and press answers?** "Request access" and the model cards answer. The × close shows no hover change.
6. **Overlap, font swap, layout shift?** No overlap. Shift 0.0004 and 0.029 (cap above).
7. **Which reference, and is its motion there?** synchronized.studio and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; Part 13's phone figure is false.
10. **Banned tells?** None measured.
11. **Copy untouched?** Card states parity 51/51 text, 4/4 links; not contradicted.

## Fixes
1. Find the 0.029 phone shift and fix it, or write the measured figure in Part 13 (lifts the cap).
2. Give the × close the kit hover.
