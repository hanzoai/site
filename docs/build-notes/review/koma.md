# /koma — James-eye review

Reviewed: main at `648b798` (page files at `f68c8e5`; shared ask fix `d2b5ab8c` in), re-walked 7 Nov 15:12 UTC, under MASTER.md. Earlier: 7/10 at `1417fde`; 6/10 at `25b197c` (before the shared ask fix). Built on the shared creative-model template. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 8/10 (ready on my checks; polish only)

First complaint: "This one I like. The film carries it. Up top I see two black-and-white buttons at once, though."

**Card:** `docs/build-notes/coverage/koma.md` is now in MASTER format, 18/18 `Done here:` lines. Measured claims hold: CLS 0.0002 at 1470 and 0 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion. The 10px model-card pills follow `SPEC.md`, which MASTER says wins; no longer raised.

**Floats over content (MASTER 3.2 rule 6):** passes since the shared fix (`d2b5ab8c`): no pill on desktop; on the phone the bar showed at 3 of 31 rest stops and covered nothing.

**Scale (MASTER 3.1):** passes. "Koma" rests at 112px alone over the film, the headline settles at 44px, and each capability screen holds one title, a medium lede and a small mono list. (My counter sees four titles at once; they are stacked chapters, and only one shows.)

## What changed since the last review
The shared fix took the floating pill away. Now on the MASTER card. The name rests at 112px (was 176px); the related-model labels follow SPEC.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: film frames recede over the peaks under "Koma", with "Request access" on the first screen.
2. **One in, one out?** Yes: film settles, capabilities pin one at a time (01–04), signature, fields, related models, try-it close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo" at every width; the page's own "Request access" is solid in the hero, so the first screen shows two solids (the shared header, see `_shared.md`). The phone bar carries "Request access" at rest.
5. **Every hover and press answers?** The hero ask, close and model cards answer.
6. **Overlap, font swap, layout shift?** None; layout shift 0.0002 and 0.
7. **Which reference, and is its motion there?** synchronized.studio and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; the claims I measured hold.
10. **Banned tells?** None measured.
11. **Copy untouched?** Card states parity clean; not contradicted.

## Fixes (polish, not blocking)
1. Films through the kit `Film` (7 raw `<video>` elements counted).
2. When the shared header can carry a page's own ask, put "Request access" there so only one solid shows.
