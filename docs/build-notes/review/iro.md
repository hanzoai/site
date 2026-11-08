# /iro — James-eye review
Ready: 2026-11-07 studio frame spans the stage with the canvas centred, phone tags off the picture and CFG on its own line (4:5 window), slider styling restored, chapters and fits show the flow at its own step (no 9× repeat), phone square sits right above the headline (no white band), card Part 4 corrected, model-card press under the tilt, 44px band links, rail hover, 5% grid hairline; model grid no longer overlaps Enso below 1100px and pills back to SPEC 10px
Verdict: 6/10
First complaint: "The canvas is the whole point of the page, and it's shoved to the left with a big empty black hole beside it. It looks broken."
(walked 7 Nov at `a7497921`, moving, at 1470×801 and 375×812 (isMobile, touch), plus 320×640, 375×667, reduced motion and JS off)

The grey-noise fix works, so the colour tell is gone. Two things hold the score down. First, the round-2 "fit the window" change broke the signature's layout on desktop. Second, the card makes one false claim (Part 4, the phone bar), which caps the verdict at 7 until it is corrected.

## What works
- **Arrival.** Iro's own film plays full-bleed under "Iro" (112px desktop, 52px phone), with "Request access" on the first screen. Frames differ across 1 s of idle at both sizes. The film then settles into a square beside "Imagine without limits." (44px desktop, 32px phone).
- **The canvas is monochrome now.** Measured on a fresh seed at step 1, the mean RGB spread is 0 and the max is 1/255. Colour arrives only as Hanzo's picture resolves.
- **The canvas controls work.**
  - The step count runs by itself.
  - New seed resets to step 1, on desktop and on a phone tap.
  - The aspect morph runs.
  - Pause, the slider and the chips have hover and press: New seed brightens its border and text on hover and scales to 0.96 on press.
  - The slider is styled, not a browser default.
- **The chapters change one at a time.** The 4 pinned chapters swap one 44px title at a time on desktop, and Iro's film is reframed per chapter. Rail buttons press to 0.97. On the phone the chapters stack as picture-then-words, with no pin.
- **Motion mix.**
  - Idle: the film and the self-running canvas.
  - Time: the step count.
  - State: aspect morph, field tabs.
  - Pointer: card tilt.
  - Arrival: the cut-in.
  - Scroll: the settle and the chapters, which is not the only mover.
- **Measured clean:**
  - No horizontal scroll at 320 or 375.
  - One h1, in server HTML. JS off hides 0 text blocks (4,214 chars visible).
  - Reduced motion: 0 running animations, the canvas rests at step 50, 0 videos playing.
  - At most 2 videos playing on a full desktop scroll.
  - CLS: desktop 0.0015, all from the shared header's language control. Phone 0.
  - `parity.py /iro` gives text 51/51 and links 4/4. `taste.py` passes on Iro.jsx and Iro.css.
  - Focus ring on every stop of a 40-stop Tab crawl. The one exception is the shared footer's "Ask Hanzo anything" field, which is not this page's.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes at both sizes. At 375×667 "Request access" sits at y 562–606 after the settle, inside the fold.
2. **One in, one out?** Mostly. The order is film, settled headline, studio canvas, 4 pinned chapters, "Where Iro fits", field map, model cards, Band. Two places break the flow:
   - About 330px of empty paper between the fits list and "Find your field" (desktop frame at y≈6253, rows end at y 338, heading at 677). Last round's fix 6 was not done.
   - On the phone, about 150px of white between the settled square and the headline.
3. **A real object in every section?** Yes. But it is the same object almost every time. Iro's mountain-and-frame picture appears in the hero, the settled square, the canvas, all 4 chapters, the fits tile, the field-map card and the model grid: 9 times on one page. James's "too many repeats" applies. The chapters reframe it, but they never change it.
4. **One ask, sticky? Scale rhythm?**
   - Desktop: the header swaps to a solid "Request access" after the hero, and it outlines while the Band's solid ask is on screen. One solid fill throughout.
   - Phone: the header keeps the solid "Try Hanzo" at every scroll stop (1500, 3000 and 5000 measured). It never carries "Request access", and no bottom bar appears.
   - Scale has rhythm: 112, then 44, 26 and 21, with mono 12.
   - In the Band, "Every model" is 15px and "Research preview" beside it is 20.58px. It still reads as a mistake.
5. **Every hover and press answers?** Most do. Gaps (measured):
   - The model cards tilt on hover, but press shows no change. The inline tilt `matrix3d` overrides `:active` scale(.98).
   - "Research preview": hover underlines, but press changes nothing.
   - The chapter rail has no hover change (press 0.97 only).
   - The kit asks, "Try it in Design", "Every model" and New seed all answer.
6. **Overlap, font swap, layout shift?** No shift and no font swap. Two problems:
   - **Desktop:** `.ir-frame` is 628px wide inside a 1040px stage, left-aligned. That leaves a 412px empty black strip to its right, with the grid pattern stopping dead at x≈843 (frames d-s03, d-s04, d-aspect169). The cause is `max-height: calc(100svh - 330px)` combined with `aspect-ratio: 4/3`, which shrinks the width with nothing centring it.
   - **Phone:** the canvas tags still sit on the picture. `.ir-tl` (285–313) overlaps `.ir-pic` (306–582) by 7px, and `.ir-bl` (557–602) overlaps it by 25px. `.ir-bl` also wraps mid-figure as "STEP 39 / /50".
   - The dev "1 Issue" hydration badge showed on my first walk at both sizes, then 0 of 6 later loads. That is a shared dev server, so it is not counted.
7. **Reference, and is its motion there?** Apple pinned chapters: there. The synchronized.studio card-to-page open: the model cards are wired to the opener. The canvas is the page's own moment.
8. **Different from neighbours?** The settle shape (a square) and the signature (noise to image) are its own. The room order is still the shared Creative template's (Koma, Oto, Koe, Uta, Mori).
9. **All 18 parts covered?** All 18 `Done here:` lines are filled. One claim is false (below).
10. **Banned tells?**
    - The hue tell is fixed.
    - Remaining: the off-centre studio frame with a black void reads as broken, the "lazy look".
    - Smaller: `.ir-frame::before` uses white at 4%, which is not on the deck's step list (3, 5, 6, 8…).
11. **Copy untouched?** Yes. Parity is 51/51 text and 4/4 links.

## Card check (docs/coverage/iro.md)
- **False:** Part 4, "on phones the shared bar carries 'Request access' after the hero". At 375×812 no bottom bar appears at y 1500, 3000 or 5000, and the header keeps "Try Hanzo". `usePhoneAsk` falls back when the words don't fit, so the phone's sticky ask is never the page's ask. This caps the verdict at 7.
- **True:**
  - Part 13: CLS 0.0015 at 1470 and 0 at 375 (measured 0.00147 and 0).
  - One h1 in server HTML.
  - No horizontal scroll at 320.
  - JS off is legible.
  - Reduced motion shows the final state.
  - At most 2 films playing.
  - Ask above the fold at 375×667.
  - Parity 51/51 and 4/4.
  - `taste.py` passes.
  - FilmPause is 44px.
- **Honest admissions, confirmed:**
  - Part 8: model-card press is overridden by the tilt.
  - Part 11: "Every model" and "Research preview" are 25px tall on the phone (measured 25px; 31px on desktop).
- **Not on the card, but claimed in commit `a7497921` ("phone tags off the picture"):** false. They overlap by 7px and 25px.

## Fixes (in order)
1. **Centre the studio frame and fill the stage** (`Iro.css`, `.ir-frame`).
   - Keep the max-height, but centre the frame: `.ir-frame { margin-inline: auto; width: auto; max-width: 100%; }`.
   - Better: make the frame span the stage and let the picture carry the aspect: `.ir-frame { aspect-ratio: auto; height: min(calc(100svh - 330px), 560px); width: 100%; }`. The `box()` percentages then fit `.ir-pic` inside it.
   - Check at 1470×801 that the grid reaches both stage edges and the canvas sits centred.
2. **Phone tags off the picture** (`Iro.css`, ≤899px).
   - The frame's `padding-block: 44px` does not move `.ir-pic`, because it is centred with `top: 50%` on the padding box.
   - Constrain `.ir-pic` instead: set its height so it fits inside the content box, e.g. `.ir-pic { top: 44px; translate: -50% 0; max-height: calc(100% - 88px); }`.
   - Make `.ir-bl` nowrap with a smaller step: `font-size: 11px; letter-spacing: .08em; white-space: nowrap`. Or put "· CFG: 7.0" on its own line with `display:block`, so it never breaks as "39 / /50".
3. **Correct the card, Part 4.** Either make the phone header carry "Request access" after the hero (check why `usePhoneAsk` judges it too wide: "Request access" at 15px fits in a 120px button), or write what is true: on phones the header keeps "Try Hanzo".
4. **Model-card press** (`ModelCards.jsx` tilt; tell its owner). Append ` scale(.98)` to the inline transform on `pointerdown`, and drop it on `pointerup` and `pointerleave`. Or move the tilt to an inner wrapper.
5. **Band links** (shared `Creative.jsx` close; tell its owner).
   - Set "Research preview" to 15px to match "Every model".
   - Give both `min-height: 44px; display: inline-flex; align-items: center`.
   - Add the kit's press (`translateY(1px)`) to "Research preview".
6. **Break the repeat** (this is what James would raise second). Give the 4 chapters and the fits tile something other than the same mountain picture: crops of distinct frames of Iro's film (different `currentTime` posters), or the canvas frozen at different steps (1, 12, 30, 50). The page would then show the image being made, not the same image 9 times.
7. **Trim the dead white.** Cut the bottom padding after `.cr-fits` (about 330px of empty paper at 1470×801). On the phone, close the ~150px gap between the settled square and "Imagine without limits.".
8. **Grid hairline:** change `.ir-frame::before` from white at 4% to the deck step, 5% or 3%.
9. **Chapter rail hover:** on fine pointers (`@media (hover:hover)`), give the inactive rail buttons a hover that darkens their text from #737373 to #0a0a0a and draws the left hairline in ink.
