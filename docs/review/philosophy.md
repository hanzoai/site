# /philosophy — James-eye review
Ready: 2026-11-07, slice D — arrival on CSS from first paint (h1 cut-in + hexagram draw, no hydration wait), Sequence tile names whole at 1470/1200/900/375/320, card parts 1/3/11/17 corrected; dead screens, tile breaks and the last-third big trigram were fixed in 9f011438/f687922c.

Verdict: 7/10
First complaint: "It's much better, the panel's gone and nothing jumps. But I scroll and there are whole screens of nothing. 'Five operating laws' sits on its own on a blank screen, then the questions have half the screen empty. And in the list of 64 the names are snapped in half: 'The Receptiv / e', 'Beginnin / g'. That looks broken."

Walked 7 Nov, about 16:55 to 17:05 UTC, against `edda1b3e` (the sheet-as-dialog fix). Files: `components/pages/Philosophy.jsx`, `Philosophy.css`, `philosophyData.js`. The scripts are in the scratch folder `critic-philosophy/` (`walk.js`, `act.js`, `misc.js`, `hyd.js`, `nojs.js`).
- **Desktop, 1470×801.** Recorded video. Took 12 frames over the first 6 s with no input. Then the mouse wheel, 400px per step with a 0.9 s dwell, top to bottom (31 steps, 11,765px).
  - I hovered and pressed a hexagram line, the hero ask and a matrix cell. I opened a pattern, pressed Tab ×8, then → and Esc.
  - I switched to Sequence and Lenses, then hovered a tile, a method step, a stack row, a question and the closing ask.
- **Phone, 375×812** (isMobile, hasTouch). Recorded video. Took 12 frames over 11 s idle, then 500px smooth-scroll steps with a 0.8 s dwell (27 steps, 14,079px). I tapped a matrix cell and Close, then checked 320 wide.
- **Also checked:** reduced motion, JS off, console, layout shift, fixed elements, and `parity.py`, `taste.py`, `unique.py`.
- **Machine noise, not scored.**
  - The red "1 Issue" badge is a hydration mismatch in the shared footer (`<footer class="is_View _paddingInline-…">` `__html` differs). It appeared in 2 of 10 loads and never named a page file.
  - The cookie card sits over the hero ask's lower half at 375 and over mid-screen content at 1470 until it is dismissed.
  - The phone header's solid "Try Hanzo" sits beside the hero's solid ask.
  - The close ask's `#f5f5f7` and the hero ask's `#2a2a2c` hover come from the shared `pf-btn`.

Stills (new): `philosophy/desk-sequence-titles-break-midword.jpg`, `philosophy/desk-laws-heading-empty-screen.jpg`, `philosophy/phone-sheet-rises.jpg`. The three older stills in that folder (`phone-closed-sheet-over-premise`, `desk-sheet-jumps-to-top`, `desk-premise`) are from the 16:35 review. They show bugs that are now fixed.

## What works
- **Last review's three blockers are fixed.**
  - **The sheet.** The pattern sheet is now a native modal `<dialog>`. Closed, it draws nothing (`display:none`, 0×0) at either size.
  - **Opening it.** A matrix cell opens it in place: `scrollY` was 4120 before and 4120 after on desktop, and 4677 before and 4677 after on phone. It slides in at the right on desktop and rises as a bottom sheet on phone, over a scrim.
  - **Focus and keys.** Tab cycles only Previous, Next and Close (plus the browser's own chrome stop). → steps 49 to 50, and Esc closes it and returns focus to the cell.
- **The hero no longer shifts.** CLS over the whole walk was 0.005 on desktop and 0.003 on phone, against 0.125 before. The h1 stayed at y 601 (desktop) and y 405 (phone) in every idle frame.
- **The 64 open on the Matrix.** The 8×8 is now the default view: one object instead of eight rows of tiles. A cell hover fills it.
- **The idea is still its own.** A hexagram walks the King Wen sequence (01 The Creative, 02, 03, 04…), with changing lines marked by a dot.
  - Pressing a line flips it and jumps to the hexagram that change makes (04 Youthful Folly → 60 Limitation).
  - Hovering a line parts its strokes.
- **Pinned laws.** The laws scene is a real Apple-style pinned stage: one hexagram builds a line per law, ending on "64 · Before Completion / No system is final."
- **The word-reveal signature works at 84px.** "The Zen of Hanzo is not a promise…" fills ink out of grey as you scroll.
- **The dark close is the best screen.** 1 → 2 → 8 → 64 is drawn in white, the stanza steps down in ink, and there is one ask. It enters as a rounded card.
- **Motion mix.**
  - Idle: the hero walk with a pause control, the premise line, the method ring's lap.
  - Pointer: strokes part, fills.
  - State: the sheet rises and the view pill glides.
  - Arrival: the h1 line cut-in.
  - Scroll: the pinned laws and the word reveal.
  - Scroll is well under half.
- **Presses.**
  - The hero ask lifts 1px on hover and presses to scale 0.97, with no fade.
  - Stack rows fill and their arrow turns solid ink.
  - The method ring's hand swings to the step you point at.
- **Checks.**
  - Parity 437/437 text, 10/10 links. `taste.py` OK. `unique.py` OK.
  - No page console errors.
  - Reduced motion: 0 running animations at 3.5 s, and the hero holds 01 The Creative.
  - JS off: the h1, the laws and all 64 pattern details are visible. Only the Sequence view is hidden, a tab whose content is in the sheet.
  - No sideways page scroll at 375 or 320.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** It sells: a huge hexagram plus "The Zen of Hanzo" reads as "change, drawn in lines" at once.
   - **Desktop:** nothing moves until about 1.9 s, when the h1 cuts in, because the mask waits for hydration on this loaded dev server. The first hexagram change came between 2.5 and 3.1 s.
   - **Phone:** about the same. "The Creative" held for 2.8 s and the h1 drew at about 1.8 to 2.8 s.
   - **Composition:** the h1 sits at y 601 of 801 (75%, not near 38%), and the hero ends with no 56px peek of the premise.
2. **One in, one out, or a document?** The first half has one idea per screen: hero, premise, pinned laws. Between them there are dead screens.
   - **The premise screen's lower 400px is empty** once the big sentence leaves.
   - **"Five operating laws" + "The synthesis" sits alone** on an otherwise blank 800px screen before the pin starts (`desk-laws-heading-empty-screen.jpg`).
   - **"Every hexagram is active" has about 300px of nothing above it.**
   - **Then three list sections run back to back:** the method list by its ring, the six stack rows, and the eight questions. The questions screen has an empty left half under its lede. That stretch reads as a document.
3. **A real visual object in every section?** Mostly: hexagrams, the 8×8 matrix, the ring and the 1 → 64 drawing.
   - Stack rows carry 34px hexagram glyphs, which are not an object.
   - The questions' 22px trigrams are bullets.
4. **One ask in the header, nothing floating; scale rhythm?**
   - **The ask:** yes. After the hero leaves view, the header ask becomes "Explore the 64 patterns" (solid), and the page itself has one solid fill per screen. Nothing floats over content now.
   - **Scale rhythm** is right in the first half: a 420px hexagram over a 52px h1, the 84px premise, the 52px laws heading, 26px section heads and the 84px belief statement.
   - **The second half is all one medium size** (21–26px rows, three sections running).
5. **Every hover and press answers, no jumps?** Yes: line strokes part, cells and tiles fill, steps nudge 8px, rows fill with a solid arrow, and asks lift and press to 0.97. The sheet opens with no jump. Questions have no hover, which is fine, since they are not controls.
6. **Overlap, font swap, layout shift?** No overlap or shift at either size, and the h1 box never moves (CLS 0.005 / 0.003). One fault remains:
   - **Sequence view, desktop:** tile titles break mid-word, with no hyphen, in 8-up columns: "The Receptiv / e", "Difficulty at the Beginnin / g" (`desk-sequence-titles-break-midword.jpg`).
   - `overflow-wrap: break-word; hyphens: auto` on `.xph-tile-t` traded last review's collision for broken words.
7. **Which reference, is its motion there?** apple.com: the pinned laws stage is there. osply/hamol: the editorial word reveal is there. synchronized.studio card-to-page: no, but a sheet is the right call for 64 non-pages.
8. **Different from its neighbours?** Yes. Its own medium (a line-art oracle you can press), centred stage and own dark close. `unique.py` agrees.
9. **The 18 parts?** See the card check below.
10. **Banned tells?** None found.
    - No hue, gradient text, kicker above a heading (captions sit under), fade-on-hover, springs or floating panel.
    - The broken tile words are a "lazy look" risk, not a banned tell.
11. **Copy untouched?** Yes: parity 437/437 and 10/10.
    - Data note, carried over: the Lenses copy says "four modern minds", but `LENSES` has one entry (Zen, 6), so the view shows "All lensed patterns" plus a single "Zen 6" chip.
    - If live hanzo.ai has four, the data is short. Otherwise it is a copy question for James and should be on the card.

## Card check (`docs/coverage/philosophy.md`)
The card exists, has 18 headings and every `Done here:` line filled. Most claims now hold: the native dialog, no scroll jump, the focus trap, CLS 0.005, Matrix by default, and no overlap at 375. These are wrong or overstated:
- **Part 11:** "Tile titles wrap instead of colliding at 1470." They wrap by snapping words in half.
- **Part 3:** "The hexagram's first change at 900 ms." Measured here: no movement before about 1.9 s on either size, on a loaded dev server. Re-measure on a build, or render the h1 unmasked in server HTML so arrival doesn't wait for hydration.
- **Parts 3 and 17:** "JS off measured 0 hidden blocks." The Sequence view is hidden with JS off. Its words are in the visible sheet details, so this is harmless but not "0".
- **Part 1:** "Copy questions: none." The single-lens "four modern minds" mismatch belongs here.
- **Part 18:** "Review read" is unticked. Tick it after reading this review.

## To reach 8
1. **Kill the dead screens.** The page should feel like one thing in, one thing out, never a blank screen.
   - Pull "Five operating laws / The synthesis" into the first pinned frame, above chapter 01, instead of its own 800px screen.
   - Trim the premise section's tail so the laws peek in once the sentence settles.
   - Cut the empty band above "Every hexagram is active".
2. **Fix the Sequence tile titles.** Never break inside a word: `overflow-wrap: normal; hyphens: manual`.
   - Give names room: 4 tiles per row at 1470 (two rows per group), or 14px titles at 8-up.
   - Check "The Receptive", "Difficulty at the Beginning", "Contemplation", "Enthusiasm" and "Deliverance" at 1470, 1200 and 900.
3. **Give the last third a big thing.** Method, stack and questions are three medium list sections in a row.
   - Let the questions use their empty left column. For example, the eight trigrams drawn large, each lighting as its question reaches mid-screen or is hovered.
   - Or make one of the three quiet (for example, the stack rows tighter) so the rhythm goes loud, quiet, loud.
4. **Arrival within 1 s.** Render the h1 visible in server HTML and run the cut-in as an enhancement after paint. Start the hero walk's first change at about 900 ms after mount, not after the full hydration of the page.
5. **Hero composition.** Raise the h1 toward the 38% line on desktop (a slightly smaller stage, about 340–360px, or the foot tucked up) and let the premise peek 56px at 1470×801.
6. **Card:** correct parts 1, 3, 11 and 17 as above, and tick "Review read".
