# /beta — James-eye review

Re-scored 7 Nov 14:47 under MASTER.md (card, scale, floating rules). Reviewed: main, page files at `bd4da31` (second review; the first, at `f45d4c2`, scored 5/10). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10 (capped; scale fails on the close)

First complaint: "Much better: black and white, the films are on the first screen, one Apply. When I hover over Kai or Enso, though, nothing happens, and those tiles are the best thing on the page."

## What changed since the first review
Fixed: no eyebrow over the h1 (the "Hanzo beta" label now sits with the film row), no magenta (grey deck only), one solid "Apply" from hero to close and sticky after the hero on both sizes, the Kai, Enso and Zen films play on the phone's first screen, the pass tiles are now Hanzo's films that open with a "+" instead of three equal "Apply" buttons, and the added words ("What are you after?", the three choices, "Pass", the sign-in line) are gone.


**Cap: part card (MASTER section 6).** `docs/coverage/beta.md` is in the old format: 0 of 18 `Done here:` lines under `## N.` headings. Capped at 7 until it is re-copied from `docs/coverage/_TEMPLATE.md` with every claim true on the page. The shared desktop ask bar also floats over content (see `_shared.md`); not counted against this page.

**Scale (MASTER 3.1, fail):** the closing screen is two 106px rows ("Feedback→", "Book a call↗") and nothing medium or small beside them on desktop (48px each on the phone): everything big at once. Fix: let one row be the big moment and set the other at 26–32px, or grow each row only on hover.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes: "Get there first.", Hanzo's line, "Apply", and the five products in a row with Kai, Enso and Zen playing their films. A pause control sits beside the row.
2. **One in, one out?** Yes: the row settles as you scroll, then the three passes arrive as film tiles (Beta access, Research access, Design partner), each opening into its sheet, then the close.
3. **A real object in every section?** Yes: films and product sketches, film pass tiles, the close.
4. **One ask, sticky after the hero?** Yes: "Apply" in the hero, in the shared ask bar after it, and in the close; the header's "Try Hanzo" turns outlined.
5. **Every hover and press answers?** "Apply" and the pause control answer. The product tiles (Dev, Studio, Kai, Enso, Zen) do not change on hover.
6. **Overlap, font swap, layout shift?** None; layout shift 0 on both sizes.
7. **Which reference, and is its motion there?** synchronized.studio (tile opens into its sheet) and apple.com (the product row settling). Both there.
8. **Different from its neighbours?** Yes: the film row and film passes are its own.
9. **All 18 parts covered?** `docs/coverage/beta.md` exists; measured gaps below are small.
10. **Banned tells?** None found.
11. **Copy untouched?** Yes: parity 12/12 text, 4/4 links; the added words are gone.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.8 Card states:** product tiles have no hover.
- **2.10 Media:** 4 raw `<video>` elements, not through the kit `<Film>`.

## Fixes (polish, not blocking)
1. Give each product tile a hover (lift and a stronger hairline, per the kit's `.x-card`).
2. Play the films through the kit `<Film>`.
