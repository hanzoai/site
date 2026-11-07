# /beta — James-eye review

Reviewed: main, page files at `f45d4c2` (7 Nov 13:22). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks; the once-per-visit loader skipped).

Verdict: 5/10

First complaint: "Three identical 'Apply' buttons next to each other, pink letters, and a little tag over the headline. And on my phone nothing moves at all."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop yes: "Get there first." cuts in and the Kai, Enso and Zen films play in the row below. **Phone no:** after the headline arrives, nothing on the first screen moves (0% change over 4 s). The films sit off-screen to the right of the rail; you see a grey Dev sketch.
2. **One in, one out?** Partly. The five product tiles settle into one row as you scroll, which is nice. Then the three pass tiles arrive together and the page reads as a block of cards, then the dark close.
3. **A real object in every section?** Hero yes (real films). The pass tiles are a big pink letter on white, which is decoration, not an object. The close is two big words.
4. **One ask, sticky after the hero?** No. There are **three equal solid "Apply" buttons in one view** (A, B, C) on both sizes, which JAMES.md rules out ("never 3 or more equal buttons"). On desktop nothing sticky carries "Apply" after the hero; the header still says "Try Hanzo". On phone the bottom bar says "Apply" while three more solid "Apply" buttons sit above it.
5. **Every hover and press answers?** Hovering a product tile answers. But **pressing a product tile leaves the page before you let go** (the press itself navigated to /dev in the walk), so you cannot cancel a press by sliding off.
6. **Overlap, font swap, layout shift?** None. Layout shift 0, headline box steady, no sideways scroll at 375.
7. **Which reference, and is its motion there?** synchronized.studio (pass tile opens into a sheet) and grubogrubo (the big two-row close). Both are present. The apple product-row settle is there on desktop.
8. **Different from its neighbours?** Yes. The film row and the A / B / C passes are its own.
9. **All 18 parts covered?** No, see below. There is no `docs/coverage/beta.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• HANZO BETA", pink dot, mono caps).
    - A UI hue: magenta on the A / B / C letters, the dot, the "+" and arrow in the close, the bars in the Dev sketch. JAMES.md allows 0 UI hues; colour may only come from Hanzo's films.
11. **Copy untouched?** No. Parity is 12/12, but new words were added: "What are you after?", "Use it first / Evaluate it first / Build it with the team" as choices, "Pass" labels and "Sign in so this is filed on your account".

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4 Conversion:** three solid buttons per view; no sticky "Apply" on desktop; 0 `data-cta`.
- **2.3 / 2.17 No-JS:** with JavaScript off, the lede "Early access to Dev, Studio, Kai, Enso and Zen." and one more line stay invisible.
- **2.10 Media:** 3 raw `<video>` elements, not through a shared film part; no pause control for the looping films.
- **2.11 Mobile:** first screen is still; the films are off-screen in the rail.
- **2.18 Measurement:** no coverage file, no `Persona:` / `Goal:` / `CTA:` header.

## Fixes
1. Remove "• HANZO BETA" from above the h1 and take the magenta out of every UI element (letters, dot, plus, arrow, sketch bars). Greys and ink only.
2. One solid "Apply" per view: make the pass tiles' buttons text links with an arrow, or show the button only on the tile that is open or in focus. Carry "Apply" as the sticky ask after the hero on desktop too.
3. Phone: put one of the films (Kai, Enso or Zen) on the first screen, playing.
4. Navigate on click, not on press, so a press can be cancelled.
5. Drop the added words ("What are you after?", the three choices, "Pass", the sign-in line) or get James's yes for them.
6. Make the lede visible without JavaScript (render it in its final state, animate only after load).
