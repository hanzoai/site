# /gallery — James-eye review
Verdict: 6/10
First complaint: "I tapped a picture on my phone, then hit the little cross to close it and it threw me off to another website. The cross is sitting under the menu bar, and the menu's button is cut off the edge of the screen anyway."

Walked 7 Nov 2026 (critic round 3), HEAD `58089a04`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320, 375×667, reduced motion and JS off. api.hanzo.ai was blocked; no form or message was sent.

## What works
- **The wall now holds the title.** "Gallery" (52px) and the lede and ask sit on the silver wall, and the hang starts at y=362. That separates it from /templates' head.
- **It is alive with no input.**
  - Arrival and idle bursts changed in 7 of 7 frames at both sizes.
  - The light steps 1→2→3 every 2.8 s, and the plaque reads out the lit template.
  - Hovering a frame holds the light: frame 03 stayed lit for 3.2 s.
- **Frames read better as apps.**
  - The unlit renders rest at .72, not .42.
  - Each frame has window chrome (three dots).
- **The Moves stage no longer shifts the page.**
  - Desktop steps 0→1→2 by itself.
  - Phone: the stage y held at 27 across 4 steps, with an idle CLS of 0.
  - The whole-walk CLS is 0.0010 on desktop and 0.0009 on phone.
- **The viewer has weight.** Its h3 is 44px, with an index to jump between templates. Esc returns focus to `xga-f2`. A plain open and close (frame 05) is clean.
- **Hover and press answer.**
  - Hero ask: #0a0a0a→#2c2c2e, magnetic, press scale .98.
  - Move rows: 4% fill on hover.
  - Viewer index rows: #f5f5f5 fill on hover.
- **Desktop has one ask.** Only the hero is solid on the first screen. The header goes solid "Browse the Gallery" mid-page, then outline at the dark close. No floating bar.
- **Phone first screen:** the header "Try Hanzo" is outlined and the hero ask is the only solid. The ask's bottom is at 365 on 375×667.
- **Edge cases pass.**
  - Reduced motion: 0 running animations, 0 of 4 frames change, and the prompt is fully typed (67 characters).
  - JS off: 0 headings or frames below opacity 1.
  - At 320 the html scrollWidth is 320.
  - 0 targets under 44px in `<main>` at 375.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?**
   - Yes on motion: 7/7 frames changed on arrival at both sizes.
   - Selling is fair. The h1 is just "Gallery", but the Zen film plaque and six app-shaped frames say "templates" quickly.
2. **One in, one out?** Partly.
   - Wall → Moves (one changing window) → typed prompt → dark close: four distinct rooms.
   - Nothing is pinned or exits as the next arrives, though, so it still reads as stacked sections.
3. **A real object in every section?** Yes: film plus frames, the browser window, the prompt box, and the wall in miniature.
   - The viewer and Moves renders are still sparse: three words and a pill in a large empty grey pane (`d-open.png`: "Deploy to Cloud" + 3 ticks in a ~610×630 panel).
4. **One ask, nothing floating, rhythm?**
   - **Desktop:** yes.
   - **Phone:** the header's swapped ask "Browse the Gallery" spans x 262–408 on a 375 screen. It is clipped off the right edge (36px off-screen) at every scroll position from y=600 to the end.
   - **Scale:** h1 52, h2 26, viewer h3 44 as the moment. Good rhythm.
5. **Every hover and press answers, no jumps?** No.
   - **Desktop, close after stepping** (open 03, → to 04, Esc):
     - At 110 ms, a see-through double exposure: the "Open Source" viewer text over the hero lede and ask (`d-close-0.png`).
     - At 220 ms, frame 03 ("Deploy in One Click") flies back oversized and stretched, with distorted type, over the plaque and hero (`d-close-1.png`).
     - The plaque reads 04 during the flight, then 03.
   - **Phone:** the viewer's × is unreachable. `elementFromPoint` at × (y 36–80) returns `HEADER` (header z 300, viewer z 90). Tapping it hit the header's "Browse the Gallery" and navigated away (the URL left the page).
6. **Overlap, font swap, layout shift?**
   - No font swap and no layout shift.
   - **Overlap:**
     - The phone viewer's controls sit under the sticky header.
     - Phone close, the miniature wall: tiles m0/m3 and m2/m5 overlap by 4px, and their renders are clipped ("ship a branded", the chips cut at the top, the m4 chrome dots over "Filter by").
     - The phone header ask runs off-screen.
7. **Reference?**
   - osply/hamol in the salon hang and the hover-held light: present.
   - synchronized.studio in the frame-to-viewer morph: good on a plain open, broken after stepping.
   - apple: no pinned or scrubbed scene.
8. **Different from neighbours?** Yes now. The title hangs on the wall, unlike /templates' Business 2 head.
9. **18 parts?** Mostly, but:
   - the dialog is not native;
   - frames, the Moves window and the prompt box are raised with shadows (part 7 says tiles are flat);
   - the card has false claims (below).
10. **Banned tells?**
    - **Yes:** overlap (the phone viewer under the header; the mini tiles; the oversized frame flying across the hero after stepping).
    - **No:** hue, eyebrow above a headline, fading buttons, cursor label, three equal boxes, or default controls.
11. **Copy untouched?** Yes. The renders are aria-hidden fragments of Hanzo's sentences. The open copy question is correctly left for James.

## Card check (docs/coverage/gallery.md)
- **True:**
  - header comment;
  - LineMask h1 with nothing above it;
  - JS off legible;
  - Moves never change height (phone idle CLS 0);
  - CLS figures (measured 0.0010 and 0.0009);
  - h3 44px;
  - whoosh on frames (`data-sound="whoosh"`);
  - reduced motion is final;
  - Esc returns focus;
  - 0 targets under 44px;
  - scrollWidth 320 at 320;
  - ask above the fold at 375×667;
  - one video;
  - the pause stops the film, light and stage;
  - one solid on the phone's first screen.
- **False:**
  - **Part 15** says that after stepping it "closes by a plain fade … so nothing doubles or flies across the wall". Measured: a double exposure, then frame 03 flies oversized over the hero (`d-close-0/1.png`).
  - **Part 11** says "375×812 … pass with no overlap". Wrong on two counts:
    - the mini tiles overlap 4px ([0,3], [2,5]);
    - the viewer's ‹ › × sit under the sticky header.
  - **Part 8** says "Esc and the × close". On phone the × cannot be tapped; the tap lands on the header ask and leaves the page.
- **Partly false:** part 17 says "0 console errors". 2 of 5 loads showed a hydration-mismatch console error and the red "1 Issue" badge (the 3 later loads were clean).
- A false claim caps the verdict at 7. The phone viewer trap takes it to 6.

## Fixes (in order)
1. **Phone viewer above the header.**
   - Under 899px, put the viewer over the header: `.xga-view { z-index: 310 }`, above the header's 300 (or portal it to `body`).
   - Or keep the z-index and move the controls clear of the header: `.xga-view { padding-top: calc(60px + 12px) }` and `.xga-view-nav { top: 72px }`.
   - Verify that `elementFromPoint` at the centre of × returns the button, and that a tap closes the viewer and keeps the URL.
2. **Close after stepping must not fly.**
   - In `Wall`, keep the frame's `layoutId` off until the viewer has fully exited. In `close()`, set `setFrom(-1)` inside `AnimatePresence`'s `onExitComplete`, not after a 650 ms `setTimeout`. Or never restore `layoutId` on that frame when `open !== from` at close time.
   - Also call `setLit(from)` rather than `setLit(open)` when the morph is used.
   - Target: no frame larger than its slot crosses the hero or plaque in any close frame.
3. **Phone header ask fits.** "Browse the Gallery" at x 262–408 is clipped.
   - Request that the shared header shrink the ask under 400px (small size, 40px, 13–14px text), or hide the language control while the swapped ask shows.
   - Meanwhile, `usePhoneAsk` should not swap to a label wider than the space left (fall back to the outlined "Try Hanzo").
4. **Mini wall on phone.** Under 899px:
   - give `.xga-mini` `row-gap: 12px`;
   - remove the residual stagger (m1/m4 sit 14px higher, so tiles 0/3 and 2/5 overlap 4px);
   - or drop to 2 columns with a 140px tile height, so renders aren't clipped mid-phrase.
5. **Fill the empty render panes.**
   - In `.xga-view-art` and `.xga-moves-st`, centre the render and scale it to the panel: `.xga-view-art .xga-r { zoom: 2.2 }` on desktop, or lay it out at the panel width.
   - Add the frame's caption sentence beneath it in the panel, so three words don't float in a 610×630 void.
6. **Flatten the tiles** (part 7):
   - remove `box-shadow` from `.xga-frame`, `.xga-moves-obj` and `.xga-term`;
   - keep it only on the floating `.xga-view-in`.
7. **Hydration mismatch.** Find the SSR/client attribute difference that intermittently raises the badge. Likely candidates are `layoutId` and the `initial` y on `.xga-frame`, or `usePhoneAsk` touching the header before hydration.
8. **Card.** Correct parts 8, 11, 15 and 17 to what is measured above.
