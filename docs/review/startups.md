# /startups — James-eye review

Reviewed: main, page files at `6744777`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 5/10

First complaint: "Two plain browser dropdowns in the form, a blue-dot label over the headline, and three boxes in a row. And once the counter stops, nothing moves."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "The Hanzo Startup Program", Hanzo's line "Everyone starts free. Venture-backed teams get up to $150,000 in credits.", and a split-flap counter that flips to "$150,000". Then **the first screen is still** on both sizes (0% change over 4 s). On the phone the counter is below the buttons.
2. **One in, one out?** No. After the hero: "The program" as three tiles in a row (one inverted), a Techstars paragraph, the application form, "Not venture-backed?". It reads as a document.
3. **A real object in every section?** The flap counter, yes. The tiles are text boxes; the form is a form.
4. **One ask, sticky after the hero?** Yes: "Apply for credits" in the hero and in the shared ask bar after it; "Start building free" is outlined beside it. Good.
5. **Every hover and press answers?** Not measured on the in-page controls (the walk's hover pass did not reach them).
6. **Overlap, font swap, layout shift?** None; layout shift under 0.002.
7. **Which reference, and is its motion there?** apple.com figure-as-hero (the $150,000 flap). Present, once.
8. **Different from its neighbours?** The flap counter is its own.
9. **All 18 parts covered?** See below. No `docs/coverage/startups.md`.
10. **Banned tells?** Yes:
    - **Browser-default controls:** "Company stage" and "How did you hear about us?" are native `<select>` menus (appearance auto).
    - Eyebrow above the h1 ("• TECHSTARS ’17 — BUILT FOR FOUNDERS", cyan dot, mono caps).
    - A UI hue: cyan dot, "01 / 03" labels and the glow under the counter. JAMES.md allows 0 UI hues.
    - Three equal boxes in a row ("Start in minutes", "Bring your own compute", "Up to $150,000 in credits"), each with an explaining sentence.
11. **Copy untouched?** Yes as measured (parity clean).

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.8 / 2.11 Inputs:** two native selects; plan wants the kit `<Field>` (48px, 16px text) for every input.
- **2.3 Narrative:** the program as three equal tiles; no chaptering after the hero.
- **2.4:** 0 `data-cta`.

## Fixes
1. Replace both native selects with a designed control from the kit (a segmented choice or a custom list), keeping the same field names and values.
2. Move "Techstars ’17 — Built for founders" off the top of the h1 (it can sit under the lede as proof), and drop the cyan: dot, labels and glow in ink and greys.
3. Turn the three tiles into one object that changes (the flap counter stepping through "Start in minutes" → "Bring your own compute" → "Up to $150,000"), so one comes in as one goes out.
4. Give the first screen a quiet idle move after the flip (the credits line under the counter writing itself, once), and on the phone put the counter above the buttons.
