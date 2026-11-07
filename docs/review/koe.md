# /koe — James-eye review

Reviewed: main at `648b798` (page files at `f68c8e5`; shared ask fix `d2b5ab8c` in), re-walked 7 Nov 15:18 UTC, under MASTER.md. Earlier: 7/10 (capped) at `1417fde`. Built on the shared creative-model template `components/pages/model/Creative.jsx`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10 (the phone's first screen freezes)

First complaint: "On my laptop it's lovely. On my phone the voice pill stops dead once it lands, with a big empty gap under it."

**Card:** `docs/coverage/koe.md` is now in MASTER format, 18/18 `Done here:` lines (lifts the old cap). Measured claims hold: layout shift 0.0002 at 1470 and 0 at 375, the h1 in server HTML, 0 hidden blocks with JavaScript off, nothing running under reduced motion, "Request access" inside the phone's first screen.

**Floats over content (MASTER 3.2 rule 6):** passes: no pill on desktop, and my phone walk saw no bar over content.

**Scale (MASTER 3.1):** passes. "Koe" rests at 112px alone over the waveform film, the headline settles at 44px ("Performance in every word."), and each capability screen shows one title (my counter sees stacked chapter titles; only one shows).

## What changed since the last review
Now on the MASTER card. The name rests at 112px (was 176px). The shared fix took the floating pill away. The phone capsule is still frozen.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop yes: the waveform plays and keeps moving at rest (32% change). Phone: the film plays for 2 seconds, settles into the pill shape, then **stops** (0% change at rest, frames 3.0–5.5 s identical) while the Pause button still shows "playing". About 100px of empty white sits between the pill and the headline.
2. **One in, one out?** Yes: stage, capabilities pinned one at a time, the booth (phonemes of "Hanzo" lighting in step), fields, related models, close.
3. **A real object in every section?** Yes.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; the hero's "Request access" is solid too, so the first screen shows two solids (the shared header, see `_shared.md`).
5. **Every hover and press answers?** The hero ask, booth presets and model cards answer. The × close presses but shows no hover change.
6. **Overlap, font swap, layout shift?** None; shift 0.0002 and 0.
7. **Which reference, and is its motion there?** synchronized.studio and apple.com pinned chapters. Both there on desktop.
8. **Different from its neighbours?** In film and signature, yes; layout is the shared creative template.
9. **All 18 parts covered?** Card 18/18; claims hold as written.
10. **Banned tells?** A still first screen on the phone.
11. **Copy untouched?** Card states parity clean; not contradicted.

## Fixes
1. Phone: keep Koe's film playing inside the pill after it settles (as /koma and /iro do; they keep moving at 10–15% on the phone).
2. Phone: close the gap between the pill and the headline so the headline and ask sit higher.
3. Give the × close the kit hover.
