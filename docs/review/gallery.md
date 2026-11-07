# /gallery — James-eye review

Ready: 8 Nov, held up next to /api and /agents (no score). Frames press (.98) and the lit one lifts 4px for real (individual scale/translate, measured), closing the viewer no longer moves the page, the Moves window rises into place by its own scroll position, the prompt room is short with the prompt box as its object, and the miniature wall's first tile clears its chrome and is whole on phone. taste/unique/parity OK (text 32/32, links 5/5); 0 console errors from the page (the one shared footer hydration warning shows on /agents too), no overflow/overlap at 1470x801 and 375x812.

Verdict: 7/10
First complaint: "It's tidy now and the wall is alive, but as I scroll it's still one block and then the next. The prompt bit is a big empty white room with one line in it, and when I click a tile it doesn't press. Nothing gives under my finger."

Walked 7 Nov 2026 (critic round 6), HEAD `bd1204f2`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch). Also checked 320×640, 375×667, reduced motion and JS off. api.hanzo.ai was blocked, and no form or message was sent.

## What works
- **The round-5 double solid is fixed.**
  - In the server HTML the header ask is outlined. The hero is the only solid at 0, 150, 300, 500, 800 and 1,200 ms after commit on desktop, and at 0 to 1,000 ms on phone (`f/d-arr0.png`, `f/m-arr0.png`).
- **It is alive with no input.**
  - 5 of 5 idle frames differed at both sizes.
  - The Zen film plays, and the light walks 02→03 in about 2.8 s.
  - The Moves stage steps Fork→Deploy in 3.2 s.
- **Hover answers.**
  - A real mouse on frame 05 held "05 / 06" and the lit ring for 4 s.
  - The hero ask goes #0a0a0a→#2c2c2e at opacity 1 and presses at scale .98.
  - Move rows take a 4% fill.
- **Focus returns to the frame you closed on.** After stepping 03→04 and pressing Esc, the plaque reads 04 / 06, the lit frame is `#xga-f3` and focus is on `#xga-f3`, with no flick back to 03.
- **The viewer behaves.**
  - It grows from scale .93 to 1 in about 220 ms.
  - Tab stays inside it for 12 of 12 presses.
  - On phone the × is 44×44 and is hit-tested as itself. A tap closes it.
- **Copy is now 81×44.**
- **Edge cases pass.**
  - Reduced motion: 0 running animations, 0 of 3 frames differ, the video is paused, and the counter holds at 01.
  - JS off: one h1, "Gallery", with 0 elements below opacity 1.
  - At 320 the scrollWidth is 320, with 0 elements past 321.
  - On 375×667 the ask sits at 311–365.
  - At 375, 0 controls in `<main>` are under 44px.
- **Low CLS:** 0.0002 on desktop and 0.0009 on phone. There is no font swap. The h1 is 52px on desktop and 40px on phone.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes.
   - The h1 is at y 236, and the ask at y 265, 206×54.
   - The plaque and 6 app frames are on the first screen.
   - Motion is visible from the first idle burst.
   - Minor: the h1 waits for the cut-in. It is absent in the first frame (811 ms after commit) while the lede and the ask already show.
2. **One in, one out?** No, it is still a stack.
   - The rooms are: wall 977, Moves 812, Paste 499, dark close 510 px tall.
   - The new Moves `Settle` is tied to page scroll 0→0.7 screen, not to the element. Its 28px→0 rise finishes while the window's top is still at 713–1098 px, mostly below the fold. On phone it finishes at scroll 400, while Moves is 2,065px away, so it is never seen.
   - Nothing is pinned, scrubbed or exits as the next room arrives.
3. **A real object in every section?** Yes: the film plaque with 6 renders, the browser-window stage, the prompt box, and the wall in miniature.
4. **One ask, nothing floating, rhythm?** Mostly.
   - There is one solid on arrival, the hero. On a paused scroll the header turns solid "Browse the Gallery" (desktop) or "Try Hanzo" (phone) once the hero has gone.
   - `usePhoneAsk` only updates 80 ms after scroll events stop. During a steady wheel scroll (200 px every 350 ms) the header stayed outlined from y 343 to 3195, with 0 solids on screen.
   - Scale: 52 / 26 / 44 (viewer) with small mono captions. That has rhythm.
5. **Every hover and press answers, no jumps?** No.
   - **The frames do not press.** `motion.button` writes an inline `transform: none`, which beats `.xga-frame:active { scale(.98) }` and `.xga-frame.lit { translateY(-4px) }`. The computed transform while pressed was `none` (all 6 frames carry `style="transform: none"`).
   - **Closing the viewer can jump the page.** Closing on frame 06 scrolled the page 0→63 px, because `focus()` scrolls the partly hidden frame into view. Every frame moved 58–60 px in the viewport (`f/d-close5.png`: the h1 is pushed up and the wall top is cropped).
6. **Overlap, font swap, layout shift?**
   - There is no font swap, and CLS is at most 0.0009.
   - In the desktop mini wall, tile 01's "Vector" chip sits on its chrome dots (`f/d-band.png`).
   - On phone, tile 01's Zen bubble is cut at the tile's bottom edge (`f/m-band.png`).
   - The dev "1 Issue" hydration badge (attribute mismatch) appeared on 3 of the first 5 cold contexts, then on 0 of 6 warm loads.
7. **Reference?**
   - osply/hamol: the salon hang and the hover-held light are present.
   - synchronized.studio: the frame grows into the viewer, and on a plain close it shrinks back to its slot.
   - apple: still no pinned or scrubbed scene.
8. **Different from neighbours?** Yes. It has a wall-hung title, a film plaque, the walking light and a miniature-wall close.
9. **18 parts?** Mostly. The card is honest that there is no `PageHero`, no kit `Band` and no native `<dialog>`. Parts 8 and 15 overclaim (see below).
10. **Banned tells?**
    - None of these: hue, eyebrow above a headline, gradient text, fading button, cursor label, three equal boxes, default control.
    - The hero hover #2c2c2e and the dark-room ask #f5f5f7 come from the shared kit `Cta` and are off-deck (shared, not this page).
11. **Copy untouched?** Yes. The renders are aria-hidden fragments of Hanzo's sentences, and the open copy question is left for James.

## Card check (docs/coverage/gallery.md)
- **True:**
  - Part 1: the arrival is outlined at 0 to 1,500 ms, measured.
  - Part 4: phones keep "Try Hanzo".
  - `data-cta` on gallery.hero, gallery.viewer and gallery.close.
  - Focus trap and Esc.
  - Pause control.
  - Reduced motion and JS off.
  - 320 / 44px / 375×667.
  - One video.
  - CLS figures (I measured lower).
  - Part 17: the hydration warning is intermittent on cold loads.
- **False:**
  - Part 8 says "frames press to .98". Measured: the computed transform is `none` while pressed, because the motion inline transform overrides the CSS. The lit lift of -4px never applies either.
  - A false claim caps the verdict at 7.
- **Partly false:**
  - Part 15 says that after a stepped close every frame "matches its slot to 0px". The frames hold their place in the page, but the page itself scrolls 63px on close when the frame you closed on sits under the fold, so on screen every frame jumps about 60px.
  - Part 9 says "the only scroll move is the wall's settle". Moves now has a second `Settle`.
- **Walk alone:** about a 7. Round 5's arrival and Copy fixes landed, but the "prompt room is empty white" fix did not take effect: the section is still 499px, because the `!important` padding loses (the computed padding is 161.7px = 11vw). The scroll still reads as stacked rooms.

## Fixes (in order)
1. **Frames press and lift for real.**
   - The inline `transform` from `motion.button` wins over the CSS. Switch the CSS to the individual properties, which compose with the inline transform:
     - `.xga-frame:active { scale: .98; transition: scale 90ms }`
     - `.xga-frame.lit { translate: 0 -4px }`
     - transition `translate .3s var(--eio), scale .15s`.
   - Alternatively, use `whileTap={{ scale: .98 }}` and `animate={{ y: lit === i ? -4 : 0 }}`.
   - Verify that the computed `scale` is `0.98` while the mouse is down.
2. **No page jump on close.** In `gone()`, use `document.getElementById('xga-f' + lit)?.focus({ preventScroll: true })`. Verify that `scrollY` is unchanged after closing on frame 06 from the top.
3. **Paste room actually shorter.**
   - `.xga-paste` padding loses to the shared `.w2-sec` rule. Raise the specificity with `.xga .w2-sec.xga-paste { padding-block: clamp(56px, 6vw, 88px) !important; }`. The section should come out at about 350px at 1470, not 499.
   - Optionally, let the box be the object: `.xga-term-t` at 21px with `min-height: 200px`.
4. **One in, one out that you can see.**
   - Drive the Moves window by its own progress, not page scroll: `useScroll({ target: ref, offset: ['start end', 'start 35%'] })` mapped to y 80→0 and scale .94→1, while the wall's last row lifts out over the same span. Keep a 40px overlap.
   - Or pin `.xga-moves-obj` (`position: sticky; top: calc(var(--header) + 24px)`) for one screen while the three rows pass, and set `at` from the scroll position. The idle stepping stays.
   - On phone use the element-based version too, because the current one is spent 1,600px before Moves arrives.
5. **The header ask follows during scroll, not after.** In `usePhoneAsk.js`, replace the 80 ms scroll debounce with an `IntersectionObserver` on the `[data-thumb]` and `.close` asks, so the header turns solid as the hero ask leaves view, even mid-scroll.
6. **Mini wall tile 01.**
   - Desktop: give `.xga-mini-f .xga-r` `padding-top: 26px` (or `justify-content: flex-start`) so the chips clear the chrome dots.
   - Phone: make `.xga .xga-mini-f` 132px tall, or drop tile 01's render to zoom .62, so the Zen bubble is not cut.
7. **Correct the card.**
   - Part 8: until fix 1 lands, frames do not press.
   - Part 15: the page scroll on close.
   - Part 9: Moves has a `Settle` too.
8. **(Shared, already filed)** The hydration badge on cold loads, the kit `Cta` hover #2c2c2e and the dark-room fill #f5f5f7 are off-deck. Note them in `docs/requests/gallery.md` if they are not already there.
