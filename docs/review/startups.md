# /startups — James-eye review

Reviewed: main at `4b53974` (re-walked 14:46 after the site-wide palette recolour), under MASTER.md. First review at `6744777`: 5/10. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 5/10 (no card; unchanged apart from colour)

First complaint: "Two plain browser dropdowns in the form, a label on top of the headline, and three boxes in a row. And once the counter stops, nothing moves."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/startups.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page. The shared desktop ask bar floats over content (site-wide, see `_shared.md`); not counted against this page.

**Scale (MASTER 3.1):** the hero is fine (one $150,000 flap counter beside the h1). The program screen puts three big titles side by side (44px "Start in minutes", 44px "Bring your own compute", 64px "Up to $150,000 in credits"), which is three boxes and three big things at once.

## What changed since the first review
The palette recolour took the cyan out (0 UI hues measured). Nothing else changed.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells; the flap counter flips to "$150,000" once, then **the first screen is still** (0% change) on both sizes.
2. **One in, one out?** No: three tiles, a Techstars paragraph, the form, "Not venture-backed?".
3. **A real object in every section?** Only the flap counter.
4. **One ask, sticky after the hero?** Yes: "Apply for credits" in the hero and the ask bar.
5. **Every hover and press answers?** "Apply for credits" answers on hover; "Start building free" does not; no press caught.
6. **Overlap, font swap, layout shift?** None on the page; layout shift 0.001.
7. **Which reference, and is its motion there?** apple.com figure as hero. Present, once.
8. **Different from its neighbours?** The flap counter is its own.
9. **All 18 parts covered?** No card (cap above).
10. **Banned tells?** Yes: **two browser-default `<select>` menus** ("Company stage", "How did you hear about us?"); an eyebrow above the h1 ("• TECHSTARS ’17 — BUILT FOR FOUNDERS"); three equal boxes in a row with an explaining sentence each.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts (MASTER, measured)
- **Part 8:** inputs must use `<Field>`; the two selects are native.
- **Part 7:** label above the h1.
- **Part 3:** no narrative after the hero; dead first screen after the flip.

## Fixes
1. Write the 18-part card (lifts the cap).
2. Replace both native selects with a kit control (same field names and values).
3. Move "Techstars ’17 — Built for founders" below the h1 as a caption.
4. Turn the three tiles into one object that changes (the flap counter stepping through the three), one big at a time.
5. Give the first screen one quiet move after the flip; on the phone put the counter above the buttons.
