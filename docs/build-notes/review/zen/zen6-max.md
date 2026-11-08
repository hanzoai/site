# /zen/zen6-max — James-eye review

Verdict: 8/10
First complaint: "It's alive now, on the computer and on the phone. But on my phone I scroll through the same black rack with the same 9,216 GB four times in a row, and the first copy is identical to the one straight under it. Show it once and let it change. And on the computer, after the rack, there's a whole empty band of nothing before the table."

Walked with Playwright (Chromium), moving, on 7 Nov 2026 (third critic pass, against ZenMax.jsx/.css as of 16:49):
- **Desktop, 1470x801.** Wheel-scrolled from top to footer in 100px notches with about 140 ms dwell (80 notches). Recorded on video, with a frame every 3 notches and a probe of the film card, h1 and asks on every notch. I also took fixed scroll stops at 40, 80, 120 and 180 to check the film wipe.
- **Phone, 375x812** (isMobile, hasTouch, DPR 2). The same walk in 100px steps, with video and frames. I tapped B200, then "Redundant pools", then "Around the servers".
- **Also checked:** 320x700 for horizontal scroll and 375x667 for the ask above the fold.
- **Controls.** I hovered and pressed each one, reading computed style at rest, on hover and on press:
  - hero "Talk to sales" and "Run it on your own GPUs";
  - the film pause (clicked twice);
  - the four promise rows (the router's `data-at` was read on each);
  - the B300/B200 radio;
  - the three planning chips;
  - the sheet column buttons and a source link;
  - the "Around the servers" drawer (opened);
  - the close ask.

  I also moved the pointer across the close Sigil.
- **Checks.**
  - Motion inside 1 s with no input.
  - Reduced motion at both sizes: running animations after 3.2 s, `--k`, and the video state.
  - Touch targets and overflow at 375.
  - The console over 16 fresh loads at both sizes.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/zen6-max/

## What works
- **The first screen sells and moves.**
  - The name, Hanzo's lede and "Talk to sales" sit over the full-bleed Zen film. The h1 cuts in on load.
  - The film is playing by 1 s with no input (`currentTime` 0.95 on desktop, 0.66 on phone).
- **The wipe is now an authored moment.**
  - At 80px of scroll the film's left edge splits "Zen 6 Max", the lede and the asks exactly. Each letter is flat ink on one side and flat white on the other, with no blended grey (wipe-80.png). Last pass's near-gradient-text tell is gone.
  - The hero ask flips from a light fill to an ink fill as the edge crosses it.
  - By 300px the card has settled top-right with its bottom on the crumb's line. The dead white quarter from last pass is gone (desk-s003.png).
- **The promises answer and change.**
  - Desktop: the router drawing changes per row as each reaches mid-screen: the fan, the lit configuration, the context bar, then the terminal with a caret.
  - Hovering a row also sets it (`data-at` followed the pointer 0, 1, 2, 3).
  - Phone: the drawing now rides under the header while the rows scroll beneath it (phone-s012, phone-s018). The phone document problem is fixed.
- **The rack is still the signature, and it is strong.**
  - A pinned dark panel with a `01 / 04` counter. Servers slide in and the count runs to 9,216 GB. The GPUs then tint into pools, and the twin rack lands across the dashed domain line.
  - The planning chips scroll to their step and advance the counter to 03 / 04.
  - B200 swaps the rack and the total (5,760 GB) at both sizes. On phone each step now carries its own compact rack set to its plan, and it follows B200.
- **The sheet is a real Beyond.**
  - Hovering a column tints its cells and previews its figure.
  - Picking B200 grows 5,760 GB to full size while 9,216 GB shrinks to grey (i-drawer.png).
  - The figures arrive once the sheet is in view instead of repeating at full size.
  - The drawer opens.
- **The close now overlaps the sheet's room.** The Sigil's key contour is drawn dark enough to read, and it bends to the pointer.
- **Hover and press answer.**
  - Hero ask: inverts to ink on hover, scale 0.98 on press.
  - Pause: fills white 10% and grows to 1.1 on hover, 0.97 on press.
  - Chips: fill white 8% on hover, 0.97 on press.
  - Sheet columns: darken to `#525252` on hover, 0.97 on press.
  - Drawer: presses to 0.99.
- **It is clean.**
  - No horizontal scroll at 375 or 320.
  - The ask's bottom sits at 364px at 375x667.
  - The phone crumb and secondary ask are now 44px tall.
  - Reduced motion lands settled at both sizes: `--k` 0, the film paused on its poster, 0 running animations.
  - Monochrome throughout, nothing above the h1, and the copy is unchanged.
  - The desktop header swaps to "Talk to sales" once the hero ask leaves view.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **Phone: the same rack and the same big number, four to five times in a row.**
   - At 375 the full panel shows four white servers and 9,216 GB (phone-s024). Then the intro text, then "Qualification" with a compact rack that is pixel-identical to it (phone-s030). Then Isolated, then Redundant, each with 9,216 GB again, then the sheet's 9,216 GB.
   - That is five showings of one figure at the same size. It reads as repetition, not one thing in, one thing out.
   - **Fix in `ZenMax.jsx` `Chapters()` with `ZenMax.css` `@media (max-width: 899px)`:** on phone, keep only the chip bar from the full `.zx-pin` panel: hide its `.zx-racks` and `.zx-total` under 900px, so the switches sit at the top of the chapter. Then drop `.zx-mini-n`'s figure from every StepRack except the last, so the number lands once at the end of the build. Alternatively, skip the Qualification StepRack (plan 0) on phone, since the panel above already shows plan 0.
2. **Desktop: a dead band between the rack and the sheet.**
   - The pinned panel's travel ends with `.zx-dep` padding-bottom 162px, then `.zx-spec` padding-top 162px. That makes about 324px of empty white, then grey, with nothing in it (desk-s054.png).
   - It is the one place on the desktop walk where nothing is on stage.
   - **Fix in `ZenMax.css`:** set `.zx-dep` padding-bottom to one 72px step and `.zx-spec` padding-top to 72px. Or start the grey room 40px under the rack panel so the sheet's figures overlap the panel's exit, the way the close now overlaps the sheet.
3. **Phone sheet column headers wrap.**
   - "DGX B300" and "DGX B200" break onto two lines at 21px. The value cells ("8 x 800 Gb/s InfiniBand or Ethernet") run 3 to 4 lines in a 120px column (phone-s042), so the sheet is the heaviest-looking block on the phone.
   - **Fix in `ZenMax.css` phone block:** set `.zx-col` to 17px with `white-space: nowrap`, and drop the row-label column to about 30% so the two value columns gain width. Or stack the sheet as two cards (B300, then B200) under 600px, as MASTER part 6 allows for tables.
4. **An intermittent hydration warning.**
   - In 2 of 16 fresh loads (the first two after the dev server recompiled ZenMax), React logged "A tree hydrated but some attributes of the server rendered HTML didn't match", and the red "1 Issue" badge showed at both sizes.
   - It did not reproduce in the 14 loads after that. Last pass saw the same thing once.
   - **Fix in `ZenMax.jsx`:**
     - `Chapters` seeds `wide` as `true` and then flips it in an effect, which changes `dx` and the `motion.div` initial `x` that is already written into the server HTML. Seed `dx` from CSS (a `--dx` custom property set in the media query) instead of from state, so the server and the first client paint match.
     - Check `data-over` on `.zx-acts` the same way.
5. **The promise row itself does not answer the pointer.** Hovering a row changes the drawing, which is good. The row's own heading and rule stay exactly as they are (computed style identical at rest and on hover), so on a quick pass the hover looks dead.
   - **Fix in `ZenMax.css`:** under `@media (hover:hover)`, on `.zx-prom-l li:hover`, set the top rule to ink and move `.zx-idx` 4px with `transform`, using the deck's 150 ms ease-out.
6. **Phone crumb "Zen" is 21px wide** (it is now 44px tall). Give `.zx-crumb a` `min-width: 44px` with padding-inline, keeping its text position.

**Noted, not counted (shared header, cookie bar, button component):**
- **Phone header.** It keeps "Try Hanzo" as a solid fill beside the hero's solid "Talk to sales" for the whole walk, and never swaps to the page's ask. Desktop swaps correctly.
- **Header glass.** It smears grey over the film and the rack as they pass under it (desk-s006, desk-s054, phone-s006).
- **Header position.** It sits about 15px lower during some scroll frames (desk-s003, desk-s030).
- **Cookie card.** It is about 400px tall at 375x812 (MASTER allows 220px), and covers the lower half of every phone frame until dismissed.
- **Kit `Cta`, link kind.** "Run it on your own GPUs" and the NVIDIA source links have no hover change, only a 1px press.
- **Solid `Cta` hover.** It goes to `rgb(44,44,46)`, which is off the deck ramp.
