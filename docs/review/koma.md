# /koma — James-eye review

Reviewed: main at `25b197c` (page files at `f68c8e5`), 7 Nov 15:01 UTC, under MASTER.md. Earlier: 7/10 at `1417fde`. Built on the shared creative-model template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10 (the pill floats over the film and the chapter list)

First complaint: "The frames film is great, but that bar at the bottom covers the corner of the film and the last chapter name."

**Card:** `docs/coverage/koma.md` is now in MASTER format, 18/18 `Done here:` lines. Measured claims hold: CLS 0.0002 at 1470 and 0 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion. The 10px model-card pills follow `SPEC.md`, which MASTER says wins; no longer raised.

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** at 1470×801 the shared pill ("Koma · search · Request access") sits over the capability chapters from screen 4 to 11 of my walk, covering the foot of the film card and "04 Keyframe-guided scene trajectories" in the chapter list. The phone bar does the same on screens 2–14, over the "Previsualization and virtual production" card and the field grid. Turn it off here (`data-ask="off"` on `<main>`) and let the header carry "Request access".

**Scale (MASTER 3.1):** passes. "Koma" rests at 112px alone over the film, the headline settles at 44px, and each capability screen holds one title, a medium lede and a small mono list. (My counter sees four titles at once; they are stacked chapters, and only one shows.)

## What changed since the last review
Now on the MASTER card. The name rests at 112px (was 176px); the related-model labels follow SPEC.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: film frames recede over the peaks under "Koma", with "Request access" on the first screen.
2. **One in, one out?** Yes: film settles, capabilities pin one at a time (01–04), signature, fields, related models, try-it close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** Through the floating pill on desktop (fail above).
5. **Every hover and press answers?** The hero ask, close and model cards answer.
6. **Overlap, font swap, layout shift?** The pill over the film and chapter list (above). Layout shift 0.0002 and 0.
7. **Which reference, and is its motion there?** synchronized.studio and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; Part 4 fails MASTER 3.2 rule 6 as written.
10. **Banned tells?** A floating pill over content.
11. **Copy untouched?** Card states parity clean; not contradicted.

## Fixes
1. `data-ask="off"` on this page's `<main>` (or the shared header-only mode once it lands); "Request access" solid in the sticky header after the hero.
2. Films through the kit `Film` (7 raw `<video>` elements counted).
