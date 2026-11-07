# /oto — James-eye review

Reviewed: main at `648b798` (page files at `f68c8e5`; shared ask fix `d2b5ab8c` in), re-walked 7 Nov 15:12 UTC, under MASTER.md. Earlier: 7/10 (capped) at `1417fde`. Built on the shared creative-model template `components/pages/model/Creative.jsx`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 8/10 (ready on my checks; polish only)

First complaint: "Good. The Foley console is the best thing on it. Up top I see two black-and-white buttons at once, though."

**Card:** `docs/coverage/oto.md` is now in MASTER format, 18/18 `Done here:` lines. Measured claims hold: layout shift 0.0002 at 1470 and 0 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, "Request access" on the first screen. The 10px model-card pills follow `SPEC.md`, which MASTER says wins; no longer raised.

**Floats over content (MASTER 3.2 rule 6):** passes: no pill on desktop; on the phone the bar showed at 1 of 33 rest stops and covered nothing.

**Scale (MASTER 3.1):** passes. "Oto" rests at 112px alone over the waveform film, the headline settles at 44px ("Give every moment its sound."), and each capability screen shows one title, a medium lede and a small mono list (my counter sees four stacked chapter titles; only one shows).

## What changed since the last review
Now on the MASTER card (lifts the old cap). The name rests at 112px (was 176px). The shared fix took the floating pill away.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: the waveform film under "Oto" with "Request access" on the first screen.
2. **One in, one out?** Yes: film settles into its shape, capabilities pin one at a time (01–04), the Foley console, fields, related models, the try-it close.
3. **A real object in every section?** Yes: film, capability film card, Foley console, field cards, model cards.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; the hero's "Request access" is solid too, so the first screen shows two solids (the shared header, see `_shared.md`).
5. **Every hover and press answers?** The hero ask, the console controls and the model cards answer. The × close presses but shows no hover change.
6. **Overlap, font swap, layout shift?** None; shift 0.0002 and 0.
7. **Which reference, and is its motion there?** synchronized.studio (card opens into the page, × closes) and apple.com pinned chapters. Both there.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; the claims I measured hold.
10. **Banned tells?** None measured.
11. **Copy untouched?** Card states parity clean; not contradicted.

## Fixes (polish, not blocking)
1. Give the × close the kit hover.
2. When the shared header can carry a page's own ask, put "Request access" there so only one solid shows.
