# /startups — James-eye review

Reviewed: main at `25b197c` (page files at `57dfa0a`), re-walked 7 Nov 15:01 UTC, under MASTER.md. Earlier: 5/10 at `6744777` and `4b53974`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 5/10 (no card; the pill floats over the form; native selects)

First complaint: "A bar floats over the form while I'm filling it in, the dropdowns are plain browser ones, and there's still a label on top of the headline."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/startups.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page. 

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** at 1470×801 the shared pill ("The Hanzo Startup Program · search · Apply for credits") is on screen from the first scroll and sits over the application form (over the "Team size" field in my walk). Turn it off here (`data-ask="off"` on `<main>`) and let the header carry "Apply for credits".

**Scale (MASTER 3.1):** the hero is fine (one $150,000 flap counter beside the h1). The program screen puts three big titles side by side (44px "Start in minutes", 44px "Bring your own compute", 64px "Up to $150,000 in credits"), which is three boxes and three big things at once.

## What changed since the last review
Only the motion: springs became short eases (`57dfa0a`). The first screen is still at rest (0% change) after the flip.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells; the flap counter flips to "$150,000" once, then **the first screen is still** (0% change) on both sizes.
2. **One in, one out?** No: three tiles, a Techstars paragraph, the form, "Not venture-backed?".
3. **A real object in every section?** Only the flap counter.
4. **One ask, sticky after the hero?** Only through the floating pill (fail above); the header keeps "Try Hanzo".
5. **Every hover and press answers?** "Apply for credits" answers on hover; "Start building free" does not; no press caught.
6. **Overlap, font swap, layout shift?** The pill over the form (above). Layout shift 0.0013 and 0.0017.
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
1. Write the 18-part card (lifts the 7 cap); `data-ask="off"` and "Apply for credits" in the header (lifts the 6 cap).
2. Replace both native selects with a kit control (same field names and values).
3. Move "Techstars ’17 — Built for founders" below the h1 as a caption.
4. Turn the three tiles into one object that changes (the flap counter stepping through the three), one big at a time.
5. Give the first screen one quiet move after the flip; on the phone put the counter above the buttons.
