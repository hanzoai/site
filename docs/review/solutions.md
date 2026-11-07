# /solutions — James-eye review

Verdict: 7/10
First complaint: "When I hover a tile, the little pills pile on top of its name. When I click it, the whole screen just goes black instead of the card opening. And on my phone the cards aren't even the same width."

Walked 7 Nov, page files as of `dd2af62` (`components/pages/solutions/SolutionsIndex.jsx`, `SolutionsIndex.css`, `openTile.js`, `app/solutions/page.jsx`).
- Filmed with headless Chromium at 1470×801: wheel notches with a dwell on every screen, hover and press on the asks, the reel's pause, the group words and tiles, all three filters, a Tab crawl, and clicks into `/solutions/sales`, `/finance`, `/data` and `/design`.
- Filmed at 375×812 (isMobile, touch): scroll, taps on the group words, a tile tap into its page.
- Also checked:
  - 320 and 375 widths, and 375×667 for the fold;
  - 1024 and 1280 for the hover state;
  - JS off at both sizes, and reduced motion;
  - the layout-shift observer, the console and how many videos play at once.
- Frames were pulled with ffmpeg for the reel walk, the filter change and the tile open.
- Stills: `review/solutions/desktop-walk.jpg` (hero, four identical films in a row, hover overlap at 1470/1280/1024, the black open), `review/solutions/phone-walk.jpg` (375 first screen, ragged tiles at 375, the reel overflow at 320).
- The dev server was shared and hot-reloaded during two walks: one frame drew an unstyled 1200px image (CLS 2 in that run) and once the page went white. Clean re-runs showed CLS 0 and no console errors, so neither is counted against the page.

## What works
- **The first screen sells.**
  - At 1470×801 the h1 is 84px at 1.02 in three tight lines, the lede and both asks sit above the fold (ask bottom 716), and the black film reel stands beside them.
  - At 375 the h1 runs three lines at 41px, the ask bottom is at 482 (also 482 at 375×667), and 130px of reel shows inside 660.
- **It is alive with no input.**
  - The reel's film plays at once.
  - The reel walks Finance → Data → Sales… every 3.8s with a crossfade and a filling bar, on desktop and phone, and rests after one pass.
- **The filter is a real object.**
  - Teams, Industries and Use cases are 84px words; pressing one slides an `#ededed` pill under it and re-numbers the wall (01 / 07, 01 / 03).
  - Pressing it again restores all 17.
  - `aria-pressed` is set; press is .97 on words, tiles and asks.
- **The hover tells you something.** Each tile's film starts, the frame darkens and that solution's real jobs rise in, and the open arrow arrives. Keyboard focus shows the same (2px ink ring).
- **Clean numbers.**
  - Parity: text 47/47, links 20/20.
  - `taste.py` and `unique.py` pass, with 0 hues.
  - CLS 0 on clean runs at both sizes, filter included.
  - No sideways scroll at 320 or 375.
  - 0 phone targets under 44px.
  - At most 2 videos play at once (reel plus hovered tile; tile plus reserved film).
  - Reduced motion: 0 running animations, 0 videos, the reel rests on Finance.
  - JS off: every word reads (only the 16 off-screen reel panes stay hidden, by design).
- **The reserved tier is a good closing room:** the enso film over black, a clean two-part layout and a white ask.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes. The reel film moves at first paint, and the h1 cuts in on hydration.
   - There is no arrival curtain on this route: it is home-only and skips deep links, which is correct.
   - So the `useArrived` and `html.x-arriving` hooks never fire here; the code sets no `x-arriving` class.
2. **One in, one out, or a document?** Hero, catalogue, room, but the catalogue is one long, still wall.
   - Desktop: 17 black tiles over 2,460px, all still posters until the pointer lands on one.
   - Phone: 17 tiles × 320px is about 5,600px (seven screens) and no tile film ever plays, because they mount only for `pointerType === 'mouse'`. After the hero, nothing moves on the phone until the reserved room.
   - MASTER part 15 asks for 72px list rows in a phone catalogue.
3. **A real visual object in every section?** Yes, Hanzo's model films throughout, but they repeat.
   - `kai` (the stacked diamonds) is the film on 7 of 17 tiles.
   - Design, Cybersecurity, Financial services and Law show the identical film in one viewport.
   - Under Industries, 4 of 7 tiles are the same picture.
   - The hero reel opens on it too. With the black reel, 17 black tiles and the black room, it reads as one tone.
4. **One ask, sticky after the hero?** Yes.
   - "Try Hanzo" is the hero solid, and the header turns to an outline while it shows.
   - After the hero the site bar carries "Try Hanzo" (checked by direct scroll at both sizes).
   - Two walks never raised the bar while scrolling smoothly, but /customers and /enterprise do the same, so it is a site-wide Ask issue, not this page's.
   - In the reserved room, the header's black "Try Hanzo" and the room's white "Explore the reserved tier" are two solids on one screen, because Ask's SOLID list does not count `.xso-cta.lt`.
5. **Every hover and press answers, no jumps?** Press does. Hover breaks in two places.
   - **The tile hover overlaps its own title.** The jobs stack from `top: 56px` and their pills wrap to two lines in the 276px tiles.
     - At 1470 the Sales jobs run to 299px while the name starts at 288.
     - Data, Cybersecurity, Financial services, Law and Education end 5px above their names.
     - At 1280, Data's last pill sits on the word "Data".
     - At 1024 every tile's jobs cover its name and sentence.
   - **The group words do nothing on hover at rest:** ink to ink. They only answer once one is already chosen.
6. **Overlaps, font swap or layout shift?** No font swap and CLS 0, but:
   - **Phone tiles are ragged.**
     - The base `.xso-tile.w6 { grid-column: span 6 }` (two classes) beats the phone rule `.xso-tile { grid-column: 1 / -1 }` (one class).
     - The one-column grid grows implicit tracks: computed `283px 0px 0px 0px 0px 0px`.
     - So every w3 tile is 283px and every w6 tile is 343px, with the right edges stepping in and out down the whole wall at 375 (and at 768).
   - **At 320 the reel's text overflows the reel.** The panes are bottom-anchored in a 288×374 box, so the longest ones rise past the top:
     - Finance by 6px, Cybersecurity by 6px and Financial services by 39px, clipped by the rounded edge;
     - 10 more panes cover the TEAMS / 01 / 07 row.
   - **Orphans at 1440:** "…traced to its / source." in the reel, and "…remember what was / true." on the Research tile.
   - **The filter change has a blank beat.** Every visible tile fades, the grid sits empty white for about 200ms, then the chosen tiles slide up from below, overlapping each other while they glide. Only position animates; size snaps.
7. **Which reference, and is its motion there?**
   - motion.dev, for the pill and the re-flow.
   - **synchronized.studio is claimed but not delivered.** `openTile` clips a flat black box out of the tile:
     - the film and name vanish in the first frame;
     - the box grows to fill the screen in 500ms;
     - it holds black until the route commits, then wipes up.
   - Timed on the dev server (routes pre-warmed):
     - Full black held 1.1–1.6s on desktop and about 3s on the phone.
     - In 4 of 6 opens the 3s fallback lifted the cover back onto the index, then the solution page cut in.
     - Production prefetch would shorten the hold, but the card still never travels.
   - Back is a plain cut.
8. **Different from its neighbours?** Not from its closest ones.
   - The index hero (headline left; a black 4:5 film card right with a mono kicker, an `01 / 07` counter, a progress bar and pills) is the same composition as all 17 `/solutions/*` heroes you land on.
   - It is also the same split the careers review flagged for /contact and /investors.
   - The film wall and the giant group words are its own.
   - MASTER §4.3's catalogue focal figure (the count) and search are absent; the card lists this as a copy question.
9. **18 areas?** See below.
10. **Banned tells?**
    - No hues, gradient text, native tooltips or default controls; JS off shows Chrome's forced video controls on the reel, which is a browser rule.
    - **Off-palette text:** the unchosen group words turn `#a3a3a3` on white, at 2.5:1. The deck keeps `#a3a3a3` for black and graphite, and large text needs 3:1.
    - **Borderline:** on hover, five mono pills stack directly over the tile's name.
11. **Copy untouched?** Yes: parity clean.
    - The `07 / 07 / 03` superscripts and the `01 / 17` tile numerals are new marks, and they are listed on the card.
    - The jobs come from each solution's own page.

## Missing from the 18 areas
- **2.3 First impression:**
  - No next section peeks at 1470×801 (the catalogue starts at 861).
  - The card does not hand its title and picture to the destination, and Back does not reverse.
- **2.4 Conversion:** two solids in the reserved room (header plus room ask).
- **2.6 Content:** two one-word last lines at 1440, and no `text-wrap: pretty` on `.xso-tile-t` or `.xso-pane-t`.
- **2.8 Components:** the group words have no hover state at rest.
- **2.9 Motion:**
  - The filter has an empty beat and overlapping tiles.
  - The lede, asks and reel use CSS fade-ups (`xso-in`, `xso-in2`), so "0 fade-ups" is wrong. Two are within budget.
- **2.10 Media:**
  - The reel's Pause stops the walk, but its film keeps looping (checked: still playing 5s after Pause).
  - The pause button is last in the reel's DOM (17th of 18 stops) with no `aria-pressed`.
  - Hanzo's films repeat (7 of 17 tiles on one).
- **2.11 Mobile:**
  - Ragged tile widths at 375 and 768.
  - The reel overflows at 320.
  - A 5,600px phone wall with no motion.
- **2.12 Accessibility:** `#a3a3a3` group words on white (2.5:1).
- **2.15 Catalogue:** the open is a black wipe, not the card.
- **2.18 Coverage doc accuracy.** Claims that are wrong:
  - "once the curtain lifts (about 4.4 s)" (there is no curtain on this route);
  - "375×812 and 1470×801 pass with no overlap" (the hover at 1470; the ragged tiles at 375);
  - "no orphan word";
  - "0 fade-ups";
  - "pause button on the reel" as the film's pause;
  - "tiles leave and glide into the gap";
  - "differs from neighbours: a film reel hero" (it is the family's hero).

## Fixes (in order)
1. **Phone tiles one width.** In the `max-width: 899px` block, use `.xso-tile, .xso-tile.w3, .xso-tile.w4, .xso-tile.w6, .xso-tile.w12 { grid-column: 1 / -1; }`. Check that every tile is 343px at 375 and that `grid-template-columns` computes to one track.
2. **Hover that never covers the name.**
   - On hover and focus, fade `.xso-tile-t` out and put the jobs in the bottom block under the name (in flow, not `top: 56px`), so they cannot collide.
   - Where the jobs do not fit (w3 tiles at 1280 and below), set the pills on one line at 12px mono, or show them on w6 tiles only.
   - Measure the jobs bottom against the name top on all 17 tiles at 1024, 1280 and 1470.
3. **Make the open carry the card.**
   - Build the cover from the tile itself: its poster as the background, `object-fit: cover`, and its name.
   - Grow it to where the destination's hero film sits, or to full screen with the film still showing, never flat black.
   - Call `router.prefetch(href)` on `pointerenter` and `touchstart` so the push lands inside the 500ms grow.
   - On the 3s fallback, keep the cover until the route commits rather than lifting onto the index.
   - Reverse it on Back, or at least crossfade.
4. **Stop the wall repeating and wake it on the phone.**
   - Give each repeat of the same film its own crop (`object-position` and scale per tile index), so no two neighbours look identical.
   - On the phone, play the film of the one tile nearest the screen's centre (IntersectionObserver, one at a time, pause when off), or move to the compact list rows MASTER part 15 asks for.
5. **Group words on the deck.**
   - Unchosen words go to `#737373` (4.74:1), not `#a3a3a3`.
   - At rest, hover answers with something other than colour, for example the pill fading in at low strength under the word, or its count rising.
6. **The reel at 320 and the pause.**
   - Under about 400px, drop the reel's fixed aspect ratio and let `.xso-panes` sit in flow under the kicker row, so the tallest pane sets the height.
   - Make Pause also pause the film (`video.pause()`), move the button first in the reel's DOM, and add `aria-pressed`.
7. **Smooth the filter.** Animate size as well as position (`layout` instead of `layout="position"`), and let the chosen tiles start moving while the others leave (drop `popLayout`'s empty beat, or stagger exit and enter), so the wall never sits blank.
8. **Small ones.**
   - Add `text-wrap: pretty` to the tile and reel sentences.
   - Let the header step aside in the reserved room: give its ask a `.solid` class, or `data-ask-hide` the room.
   - Correct `docs/coverage/solutions.md` to what ships, with the measured numbers above.
