# /iro — James-eye review
Verdict: 6/10
First complaint: "It's a black and white brand, then the canvas fills with rainbow static. Where did all those colours come from?"
(walked 7 Nov 16:57 UTC at `63e56e7e`, moving, at 1470×801 and 375×812, plus 320, 375×667, reduced motion and JS off)

The page itself would score 6: a banned tell (hue made by the page) fails it, whatever the rest does. Even after that is fixed, the card's false claims cap it at 7 until they are corrected.

## What works
- The arrival works. Iro's own film is full-bleed under "Iro" (112px desktop, 52px phone), with "Request access" on the first screen. Something moves within 1 s at both sizes (frames differ across 1 s idle). The film then settles into a square beside "Imagine without limits." (44px).
- The canvas idea is the right object for an image model. Noise resolves to the picture over 50 steps, then reseeds. The step counter advances by itself (43 to 50 in 0.8 s), and Pause, the slider, New seed and the 16:9 / 1:1 / 21:9 aspects all answer. The aspect change cross-fades and rescales (600 ms, ease-emphasis).
- The pinned chapters do one thing in, one thing out. One 44px chapter title shows at a time on desktop, Iro's film is reframed per chapter, and the rail tracks it. On the phone the chapters stack as picture-then-words, with no pin.
- It mixes kinds of motion: idle (film, the self-running canvas, the studio map touring fields), time (step count), state (aspect morph, field tabs), pointer (model-card tilt) and arrival (line cut-in). Scroll is not the only mover.
- Hanzo's model-card grid is copied, with 9 real films and posters together.
- Measured clean: no horizontal scroll at 320 or 375. One h1. JS off hides 0 text blocks. Reduced motion leaves `getAnimations()` empty with the stage settled. Desktop CLS is 0.0015 (all from the shared header's language control). 0 console errors on 9 fresh loads.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes on both sizes. At 375×667 "Request access" sits at y 591 to 635, inside the fold.
2. **One in, one out?** Mostly. Film, then the settled headline, the canvas, 4 pinned chapters, "Where Iro fits", the studio map, model cards and the Band. Two dead stretches: about 300px of empty white under the fits list and under the map tiles (desktop frames at y≈6400 and ≈7200). The studio window does not fit one screen at 1470×801: the canvas starts at y≈360, and Pause, the slider and the aspects sit about 1.3 screens lower, so you watch noise without the controls in view.
3. **A real object in every section?** Yes: film, canvas, the film framed per chapter, the film beside the fits, the map tiles, the model cards.
4. **One ask, sticky; scale rhythm?** Desktop: the header swaps to a solid "Request access" after the hero, and the hero ask is outlined, so there is one solid fill. Phone: the header keeps a solid "Try Hanzo" and the page ask is outlined. Scale has rhythm: 112, then 44, then 26 and 21, with mono 12. In the Band, "Every model" (15px) sits beside "Research preview" (20.58px), which reads as a mistake.
5. **Every hover and press answers?** Most do. Gaps:
   - The 9 model cards tilt on hover, but press shows no change (measured). The inline tilt `transform` overrides `.mc-card:active { transform: scale(.98) }`.
   - "Every model" shows no hover change.
   - "Research preview" shows no press change.
   - The selected chips (1:1, Advertising, chapter 01) show no hover, which is acceptable.
6. **Overlap, font swap, layout shift?** One shift on the phone: CLS 0.012 at y≈888. The `.ir-tag.ir-bl` step line "FLOW-MATCHING CONVERGENCE: STEP n/50" changes width as the count ticks, re-wraps and moves 17.5px. Also on the phone, both canvas labels overlap the picture: `.ir-tl` by 16px and `.ir-bl` by 33px (picture at y 251 to 457, tags at 239 to 267 and 423 to 468). There was no font swap. On the first walk the dev overlay showed a "1 Issue" hydration warning at both sizes; it did not reproduce on 9 later loads (shared dev server), so it is not counted.
7. **Reference, and is its motion there?** apple.com pinned chapters (there) and the synchronized.studio card-to-page open on the model cards (the opener is wired). The canvas is the page's own moment.
8. **Different from neighbours?** Its own settle shape (a square) and signature (the noise-to-image canvas). The section order is still the shared creative template (Koma, Oto, Koe, Uta, Mori), so the layout repeats across the family.
9. **All 18 parts covered?** All 18 `Done here:` lines are filled, but three claims are false (below).
10. **Banned tells?** Yes, one. The canvas noise is generated per RGB channel (`s.noise[i]` for each of r, g, b), so it is full-hue confetti. Measured at step 1: mean RGB spread 103/255, max 255. That is colour made by the page as decoration, not Hanzo's media (MASTER 3.1 "No hue", 3.3 "Any hue"). It fills a 625×625 square for about 2 s on every cycle, and reseeds every 7 s. Smaller: the frame grid uses white at 4% (`.ir-frame::before`), which is not on the deck's step list.
11. **Copy untouched?** Nothing seen contradicts parity. The visible strings are Hanzo's.

## Card check (docs/coverage/iro.md)
- Part 13, "CLS … 0.000 at 375": **false.** Measured 0.012 on the phone, from the page's own `.ir-bl` step line re-wrapping.
- Part 9, "n/a: the shared sound kit is not on main": **false.** `lib/sound.js` and `components/Sound.jsx` are on main (`f99df11e`), and the header shows the Sound toggle. The canvas finishing a run never calls `play('done')`.
- Part 8, "Model cards … press to .98": **false on a fine pointer.** The inline tilt transform wins over `:active`, and measured press shows no change on all 9 cards.
- Part 11, "Every target 44px or more": not met. "Every model" and "Research preview" are 25px tall on the phone. The card admits this in Part 13 but ticks Part 11 anyway.
- True: one h1 in server HTML. No horizontal scroll at 320 or 375. JS off is legible. Reduced motion shows the settled stage. At most 2 films playing (measured max 2). Ask above the fold at 375×667. Desktop CLS 0.0015. `lib/cta.js` and `lib/track.js` are not on main.

## Fixes
1. **Greyscale noise** (`components/pages/model/Iro.jsx`, `reseed` and `draw`): make one noise value per pixel. Allocate `new Float32Array(n / 4)`; in `draw`, use `N[i >> 2]` for all three channels. No hue then reaches the canvas.
2. **Stop the phone shift and overlap** (`Iro.css`): give `.ir-bl` a fixed width with tabular numerals, e.g. `.ir-bl span { display:inline-block; min-width:2ch; text-align:right; font-variant-numeric:tabular-nums }`, and stop it wrapping: shorten the box with `max-width:calc(100% - 28px)` plus `white-space:nowrap` at ≤899px, or let it wrap from the start at a fixed 2-line height. At ≤899px, move `.ir-tl` and `.ir-bl` outside `.ir-pic`'s box (e.g. give the frame `padding-block:44px` so the tags sit in the frame margin), so text never sits on the picture.
3. **Fit the studio window in one screen at 1470×801**: cap `.ir-frame` with `max-height: calc(100svh - 330px)` (keeping `aspect-ratio` via `width:auto; margin-inline:auto`), or switch it to 16:9 on wide screens, so the canvas and Pause, the slider and the aspects are visible together.
4. **Model-card press** (`ModelCards.jsx` / `Creative.jsx` `tilt`): on `pointerdown`, set the inline transform to the current tilt plus ` scale(.98)`, and restore it on `pointerup`. Or move the tilt onto an inner wrapper so `.mc-card:active` can scale the outer one.
5. **Band links** (shared `Creative.jsx` close; ask its owner): set "Research preview" to the same 15px as "Every model", give both 44px hit areas (`padding-block:10px` or `min-height:44px`), and give "Every model" the kit link hover (underline or arrow nudge).
6. **Trim the dead white**: reduce the bottom padding after `.cr-fits` and after the map tiles. Each now leaves about 300px of empty paper at 1470×801.
7. **Sound**: call `play('done')` from `lib/sound.js` when the canvas reaches step 50 after the visitor has interacted with it (not on the automatic loop). Put `data-sound="tick"` on the aspect chips if the kit does not wire `aria-pressed` buttons already.
8. **Correct the card**: Part 13 phone CLS (write 0.012, or 0 after fix 2), Part 9 sound (the kit is on main), Part 8 press (true only after fix 4), Part 11 (the two 25px links).
