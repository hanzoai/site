# /customers — James-eye review

Verdict: 7/10
First complaint: "On the phone, 'Every launch' is still four screens of names and numbers with nothing coming in or going out. And on the desktop, when the big number changes, the old one is still showing under the new one."

Walked 7 Nov, page file at `d996c96` (`components/pages/Customers.jsx`, `Customers.css`). I filmed it moving at 1470×801 and at 375×812 (isMobile, hasTouch), on a fresh visit and on a return visit. The walk scrolled with the wheel and by touch, dwelling on every screen. On desktop it hovered and pressed; on the phone it tapped. It used the year filter, the case tabs (mouse and arrow keys) and opened both cases. I also checked reduced motion, JS off, 320 and 375 wide, a Tab crawl, CLS and the console. Stills: `review/customers/desktop-walk.jpg`, `review/customers/phone-walk.jpg`.

The arrival curtain never shows on /customers. It is home-only, and I tested that with automation hidden, so a first visit and a return visit behave the same here. Covers and logos come from hanzo.ai through the dev rewrite, which is blocked in this box, so I judged the plate's Sigil fallback and the name fallbacks. On the phone, the dev "1 Issue" badge is a hydration mismatch in the shared `FooterHTML` (`dangerouslySetInnerHTML` differs). It is not this page's fault: it showed 5 of 5 times when screenshots ran during load and 0 of 8 times otherwise.

## What works
- **Every fix from the last review is in, and I verified each one moving:**
  - The year chips filter: 11 rows become 3, the rest glide up 466px in about 200ms, and the page shortens from 5,608 to 4,346px.
  - The pill shows (111×48, `#ededed`).
  - The row sheet paints (`#f5f5f5`, opacity 1).
  - The pointer preview is gone, and a pinned stage beside the rows does its job.
  - The ask sits beside the lede (x=820, y=425 at 1470).
  - The shared bar takes over at about scroll 719 on desktop and 600 on the phone, so there is no gap.
  - The case tabs are kit `Tabs`; arrow keys move both the selection and focus.
  - The 01/02 marks and the seven tiles are gone.
- **The desktop index is now a scene.** As each row crosses the middle, the stage brings in that launch's figure at 84px Air and lifts the last one out: Bellabeat 250,000 → STONED $135K → Unikrn 120,000 ETH → Arca $500M → … → Personas Social. Pointing at a row answers at once: sheet, name 8px, stage. The hover tells you a number, which is exactly James's rule.
- **The first screen moves on its own.**
  - The plate's line starts filling as soon as the page is up (12% threshold).
  - The h1 cuts in by line.
  - The plate wipes to KANOA at about 6s, then back, and rests.
  - Even the Sigil fallback drifts.
  - The h1 is the deck's 84px/1.02, one h1, with nothing above it.
- **The close is its own room.** "Launch with us" sits over two rows of Hanzo's own figures in `#262626` that slide against each other with the scroll. White "Talk to us"; the bar steps aside. There is no third Sigil room.
- **The doorway open works.** On a warm load, ink grows from the plate (640ms) and lifts off the Damon page about 750ms after the click. Back returns to scroll 250.
- **Housekeeping is clean.**
  - CLS is 0.000005 on desktop and 0.000018 on the phone, with no font swap.
  - Parity is 72/72 text and 10/10 links; `taste.py`, `unique.py` and `variety.py` pass.
  - Reduced motion leaves 0 running animations, the plate holds, and the h1 is final.
  - No sideways scroll at 320 or 375, and no phone tap target in `main` is under 44px.
  - On a Tab crawl every stop shows the 2px ink ring with a white halo, and none sits under the header or the bar.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes: the headline, the lede and "Talk to us" are all on the first screen.
   - **The order is wrong.** The plate (CSS, 0.25s delay) and the lede (0.5s) are timed from first paint, but the h1 waits for hydration. On a warm desktop load the plate is 65% in by 0.9s and the h1 cuts in at 1.2–2.0s. On the phone at 1.0s, the plate is the only thing in `main`. The headline arrives last.
   - **The plate shows almost nothing on the first desktop screen.** At 1470×801 only its top 45% (275px) is on screen, so the screen shows a dark slab with "Damon Motorcycles 2020" and a 2px line. The $8.4M sits at y≈1,000–1,080, below the fold.
2. **One in, one out, or a document?** On desktop, it is a scene now: the stage swaps one launch for the next and the filter closes the list up. On the phone, the stage is `display:none`. "Every launch" runs from y≈1,157 to ≈4,450 (about four screens) of rows with inline 40px figures. Only the sticky year rail's underline changes, so on the phone it is still a document.
3. **A real visual object in every section?**
   - Hero: the plate. With the fallback it is a dark slab with a faint contour, and during the turn it is blank for about 1s between the two cases' text, because both fallbacks are the same dark gradient and the wipe edge cannot be seen.
   - Index: the stage on desktop, and nothing on the phone.
   - Backers: a still row of grey names (logos when they load).
   - Close: the sliding figures.
4. **One ask, sticky after the hero?** Yes. "Talk to us" sits beside the lede, then in the shared bar from scroll ≈719 (desktop) and ≈600 (phone), then in the close. The header's "Try Hanzo" goes to outline once the page hydrates.
5. **Every hover and press answers, no jumps?** Mostly.
   - What answers: the hero ask darkens and presses at .97; the plate's arrow fills white, moves 4px and presses at .97, with the "Open" cursor label; tabs ink on hover; rows get the sheet, the 8px name move and the stage; years and wall go grey to ink; the close ask answers.
   - **The stage swap overprints.** Enter and exit run together at the same spot, so for about 100ms "$135K", "in sales from a $20K budget", "70,000" and "2016" ghost under the incoming "120,000 ETH" (`desktop-walk.jpg`, row 2, first still). It happens at every handoff, 10 times down the list.
   - **"120,000 ETH" breaks onto two lines in the stage.** The stage is 368px wide and the figure is set at 84px.
   - **The hovered row's sheet runs into the stage.** The sheet's right edge is at x=943 and the stage starts at x=943, so the two rounded shapes join.
   - The years and the wall press at .98, not the deck's .97.
6. **Overlaps, font swap, layout shift?** At rest: none at either size, no swap, CLS ≈0. In motion: the stage overprint above.
7. **Which reference, is its motion there?** The index plus the stage is osply/hamol with an Apple-style pinned panel, and it is there on desktop. The plate is an Apple product tile. synchronized.studio's card-becomes-hero is not attempted. The doorway ink stands in for it (Morph is broken site-wide), which is acceptable, but `doorway.js` has no 700ms hold cap. On a cold destination the screen stays black until the next page lifts the ink, with only an 8s failsafe; the phone held over 1.3s here.
8. **Different from neighbours?** Yes. The full-width case plate, the index stage and a figure-slide close are this page's own, and `unique.py` passes.
9. **18 parts?** Mostly covered. The card is wrong in places (listed below).
10. **Banned tells?** None. No hue, no eyebrow above a heading ("Case studies" is a caption under the plate), no gradient text, no tiles.
11. **Copy untouched?** Parity is clean.
    - The $8.4M / $7M+ lines come from the case pages, and that question is already on the card.
    - **SKULLY has moved.** It is first on live and here sits after Triller, because undated launches go to the end. That order change is not on the card's copy questions.

## Missing from the 18 areas
- **3 / 11 (phone composition):** the page's signature has no phone version. "Every launch" is about 3,300px of static rows at 375, so the phone gets no one-in-one-out.
- **3 (first screen):** the h1 lands after the plate and the lede, because CSS arrivals race a hydration-gated cut-in. The desktop plate's figure is below the fold.
- **8 / 9 (craft):**
  - The stage enter and exit overprint.
  - "120,000 ETH" wraps.
  - The row sheet touches the stage.
  - The years and wall press at .98.
- **9 (transition):** the doorway has no hold cap (MASTER part 9: cap at 700ms).
- **3 (JS off):** everything is legible, but the KANOA panel sits under Damon, so its copy cannot be seen, and the tabs do nothing. The blocked cover's alt text ("The Damon Hypersport") and a broken-image box show over the plate's top edge; that part is minor, as the images are remote.
- **Card corrections:**
  - Part 7 says "Radii … from tokens", but radii are literals. The plate and the stage use 28px (the composer radius) where the deck gives art cards 20 and tiles 24.
  - Part 8 says "Press is .97"; the years and the wall press at .98.
  - Part 10 says covers and logos "come from Hanzo's /public … on localhost they load". Nothing is mirrored into `public/`: dev pulls them from hanzo.ai by rewrite, and the static export has no fallback (MASTER part 10, mirror into `public/`).
  - Part 9 says the plate turns "once", but it goes Damon → KANOA → Damon and then rests. Its line then shows only the first segment filled.
  - Part 12 says "the list is aria-live", which means the whole 11-row `ol` is a polite live region, so a year tap would read the entire list.
  - The SKULLY order question is missing.

## Fixes (in order)
1. **Give the phone index its scene.**
   - Put a slim sticky figure strip under the year rail. It shows the figure and label of the row crossing the middle, and swaps it as the desktop stage does: same copy, 300ms ease-emphasis, one in and one out.
   - Or settle each row's figure once as it becomes `.on`.
   - Either way, the four screens should read as one moving thing, not a list.
2. **Stop the stage overprint.**
   - Run the handoff in sequence: `AnimatePresence mode="wait"`, out in 150ms (rise 16px), in in 300ms. Or give each figure its own line mask, so outgoing and incoming never share pixels.
   - Keep every figure on one line: `white-space: nowrap`, and step a figure longer than 8ch (120,000 ETH) down to clamp(40px, 4.4vw, 64px).
3. **Let the headline lead, and show the plate's number on the first screen.**
   - Start the `.xcu-in` and `.xcu-in2` arrivals only once the h1 cut-in starts, by adding the class after hydration or by putting the h1 mask on CSS keyframes too. The order should be h1, then lede and ask, then plate.
   - At ≥900px, set the figure and name block in the plate's upper half, or trim hero padding, so $8.4M is on screen at 1470×801.
   - Make the fallback turn readable: give each case its own Sigil tone or seed so the wipe edge shows, and bring the incoming text in at 0.25s, not 0.55s.
4. **Craft.**
   - End the row sheet 12px short of the stage, e.g. `inset: 0 -12px 0 -24px`.
   - Set years and wall press to .97.
   - Use deck radii: plate 20 (art card), stage 24 (tile).
   - Cap the doorway hold at 700ms, then cut to the page.
5. **Housekeeping.**
   - Correct the coverage card (radii, press, media mirroring, plate turns, aria-live).
   - Add "SKULLY moved from first to after Triller" to the copy questions, or keep Hanzo's order.
   - Narrow `aria-live` to a one-line count, e.g. the year chip's existing label.
   - With JS off, show both cases stacked instead of KANOA hidden under Damon.
