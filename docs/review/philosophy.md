# /philosophy — James-eye review

Verdict: 5/10
First complaint: "On my phone there's a white panel sitting on top of the second section, with 'The Creative' in it, and I never opened anything. On the laptop I click a pattern and the whole page throws me back up to the top. And the headline keeps jumping up and down while the lines change."

Walked 7 Nov, about 16:20 to 16:35 UTC, against `eb0b3b98` (page) and `5e4c6ce5` (shared kit). Files: `components/pages/Philosophy.jsx`, `Philosophy.css`, `philosophyData.js`. The scripts are in the scratch folder `critic-philosophy/` (`walk.js`, `walk2.js`, `phone2.js`, `probe.js`, `sheetpos.js`).
- **Desktop, 1470×801.** Frames over the first 6 s with no input. Then the mouse wheel, 400px per step with a 1.1 s dwell, top to bottom (36 screens, 13,591px). I hovered and pressed a hexagram line, the hero ask, a tile, a matrix row header and cell, a lens chip, a method step, a stack row and the closing ask. I opened a pattern, pressed → and Tab ×6, then Esc.
- **Phone, 375×812** (isMobile, hasTouch). 12 s idle on the hero, sampling where the h1 sits every 0.5 s. Then 640px scroll steps with a 0.9 s dwell (28 screens, 17,292px). I tapped a tile, Close and the Matrix tab, then checked 320 wide.
- **Also checked:** reduced motion, JS off, console, layout shift, overflow and `parity.py`, `taste.py`, `unique.py`.
- **Machine noise.** The dev overlay's red "1 Issue" badge is another chat's broken `components/pages/Pricing.jsx` ("the name `lit` is defined multiple times"), sent to every open page by the dev server. A hydration-mismatch error showed once in the first walk and did not come back in four later loads. Neither is scored against this page.

Stills: `philosophy/phone-closed-sheet-over-premise.jpg`, `philosophy/desk-sheet-jumps-to-top.jpg`, `philosophy/desk-premise.jpg`.

## What works
- **The idea is its own and it is good.** The hero is one huge hexagram walking the King Wen sequence. Changing lines are marked with a dot, the name and trigrams sit either side, and the 52px h1 sits beneath. Pressing any line flips it and jumps to the hexagram that change makes (03 → 63 "After Completion"). Hovering a line parts its strokes. No other page has a hero like it.
- **The five laws are a real pinned Apple-style scene.** The chapter on the left changes while one hexagram builds a line per law on the right (grey for the line being drawn, ink once it is set). It ends on "64 · Before Completion / No system is final." Its last line flicks six times, then rests.
- **The signature is present.** The belief statement fills in word by word, ink rising out of grey, at 84px (`d-whole--250.jpg`). The premise sentence is the one big thing on its screen, with a single line opening and closing beside it.
- **The close is the best screen on the page.** The dark room enters as a rounded card and opens to full width. Then 1 → 2 → 8 → 64 drawn in white, the stanza cut in by line, and one ask.
- **Hovers tell you something.** A tile hover fills it and swaps the subtitle for the principle ("Systems become what they consume."). The method ring's hand swings to the step you point at. Stack rows fill and their arrow turns solid ink. The hero ask presses to 0.97.
- **Checks.**
  - Parity: 437/437 text, 10/10 links.
  - `taste.py` OK and `unique.py` OK.
  - Reduced motion: no running animations after 3.5 s, the hero walk stops and the belief statement is full ink.
  - JS off: 1 of 521 text blocks hidden (the laws' "No system is final." caption).
  - No sideways scroll at 375 or 320. The matrix scrolls inside its own frame.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?**
   - **Phone:** yes. The first change came between 1.0 and 1.5 s.
   - **Desktop:** the first change came at 2.5–4 s on this loaded dev server, and the h1 was not drawn until about 2 s (the mask waits for hydration).
   - **Composition:** the hexagram sells "change, drawn in lines" at once. But the h1 sits at y 601 (75% of the screen, not near 38%), and the hero ends exactly at 801 with no 56px peek of the next section.
2. **One in, one out, or a document?**
   - **The first half is one idea per screen:** hero, premise, pinned laws.
   - **Then it turns into a document:**
     - "Five operating laws" is a 52px heading alone on an otherwise empty 800px screen (`w2-s-03.jpg`).
     - The Sequence view is eight identical rows of eight tiles, about 2,700px of the same rhythm.
     - Then come three list sections in a row: the method list beside its ring, the stack rows, and the eight questions. The questions screen has an empty left half under its lede.
3. **A real visual object in every section?** Mostly yes, all drawn: hexagrams, the ring, trigram glyphs and the 1 → 64 drawing. The questions section's 22px trigrams are bullets, not an object, and the stack section has none beyond its 34px glyphs.
4. **One ask in the header, nothing floating; scale rhythm?**
   - **The ask:** after the hero leaves view the header ask becomes "Explore the 64 patterns". The hero has one solid fill and the rest are text links. Good.
   - **But a panel floats over content:** on the phone, the closed pattern sheet sits over the premise (answer 6).
   - **Scale rhythm is right in the first half:** 340px hexagram over a 52px h1, then the 84px premise, the 52px laws heading and 26px section heads. The patterns screen is all small.
5. **Every hover and press answers, no jumps?** The hovers answer, as above.
   - **Opening a pattern jumps:** from the patterns section, a tile click scrolls the whole page to the very top. The sheet slides in at the top right over the hero, with no scrim and with the header pushed half off-screen (`desk-sheet-jumps-to-top.jpg`).
   - **Focus is not trapped:** Tab from the sheet's Close goes to "Skip to content", "Hanzo AI home", "Company" and on into the page behind.
6. **Overlap, font swap, layout shift?** Yes, three of them.
   - **The closed sheet is on the page (phone, the worst).** The shared kit moved to a native `<dialog>` in `5e4c6ce5`, so `components/v2/DetailSheet.css` now positions only `dialog.pf-sheet`. This page renders `<div class="pf-sheet xph-sheet">`, which is now `position: static`.
     - Its panel is `position: absolute` against `<body>`: visible, with `pointer-events: auto` and a `0 40px 120px -30px` black-45% shadow, while closed.
     - **Phone:** the closed panel sits at document y 812–1504, drawn over the premise. "01 / 64 The Creative … Principle … Ask" covers "No intelligent system remains fixed." (`phone-closed-sheet-over-premise.jpg`).
     - **Desktop:** it sits at x 1482, so its shadow bleeds a grey band down the right edge of the first screen (`d-first-4000.jpg`).
     - `scrollWidth` is 2,122 (hidden by `overflow-x: clip`).
   - **The phone h1 moves while the hero walks.** When the name or the trigram line wraps to two lines ("Difficulty at the Beginning", "Open Collaboration · Heaven over Fire"), the h1 drops from y 358 to 383 and back. Layout shift was 0.125 in 12 s of idle, from shifts of 0.022, 0.049 and 0.052 attributed to `.xph-hero-foot`, `.xph-h1` and the flank. That is over Google's 0.1 fail line, and "the h1 box never moves" is a hard rule.
   - **Text collides at 1470:** "Contemplation" runs into "Biting Through" with no gap in the Correction row (`d-s-002.jpg`). "Enthusiasm" and "Deliverance" touch the right gutter.
7. **Which reference, is its motion there?** apple.com: the pinned laws scene is there. osply/hamol: the editorial word reveal is there. synchronized.studio card-to-page: no; tiles open a side sheet, which today does not even stay in view.
8. **Different from its neighbours?** Yes. Line-art hexagram hero, centred stage, its own dark close. Distinct from /about (frontier curve) and /research (paper index). `unique.py` agrees.
9. **The 18 parts?** See the card check below.
10. **Banned tells?**
    - A panel covering text (the phone sheet).
    - Overlap and layout shift (answer 6).
    - Otherwise clean: no hue, no kicker above a heading (the captions sit under), no fade-on-hover, no springs.
11. **Copy untouched?** Yes: parity 437/437, 10/10. Data note, not a copy edit: the lens copy says "Four modern minds", but `LENSES` has one entry (Zen, 6 patterns), so the Lenses view has one chip beside "All". If live hanzo.ai has four, the data is short; if not, it is a copy question for James.

## Card check (`docs/coverage/philosophy.md`)
The card exists and has 18 headings with every `Done here:` line filled. These claims are false today:
- **Part 8:** "The pattern sheet traps focus." Tab leaves the sheet on the first press. It is a `<div role="dialog">`, not the kit's native `<dialog>`, and has no trap.
- **Part 8 / part 3:** "Only the sheet floats." Closed, it does not float: it sits in the document.
- **Part 10:** "Nothing loads and nothing shifts." The phone hero shifts the h1 each time the name wraps (CLS 0.125 in 12 s).
- **Part 11:** "375×812 and 1470×801 pass with no overlap." The closed sheet is over the premise at 375, and the tile titles collide at 1470.
- **Part 3:** "Something moves within 1 s." True on phone, but the desktop h1 is not drawn until hydration (about 2 s here).
- **Part 18:** "Review read" is unticked. Correctly so until now.

## To reach 8
1. **Put the sheet back on the kit.** Replace the hand-rolled `PatternSheet` `<div class="pf-sheet">` with the shared native `DetailSheet` (`<dialog>` + `showModal()`). That gives the focus trap, Esc, outside-click and the `::backdrop` in one move. Keep the ← → stepping as buttons inside it.
   - Until then, give `.xph-sheet` its own `position: fixed; inset: 0; visibility: hidden; pointer-events: none` when `data-open="false"`, and a styled `.pf-sheet-scrim`.
   - Check that a tile click at /philosophy#patterns leaves `scrollY` unchanged and nothing of the sheet shows at 375 before you open it.
2. **Lock the hero's height.** Give `.xph-flank.l b` and `.xph-flank.r span` a fixed two-line box at every width (`min-height: 2lh`, or reserve the tallest name), so the h1, ask and lede never move while the walk runs. Target 0 shifts over 20 s idle at 375×812.
3. **Fix the tile titles at 1470.** Let `.xph-tile-t` wrap (`overflow-wrap: anywhere` is a last resort; better, a 7-up grid or 13px more column) so "Contemplation" and "Biting Through" keep a gap, and nothing touches the gutter.
4. **Make the 64 one screen, not eight.** Default the patterns to the Matrix view: one 8×8 object, where every cell opens the sheet. Keep Sequence as the second tab. That removes about 2,000px of identical rows and gives the section its one big thing.
5. **Give the laws heading a job.** Pull "Five operating laws" into the first pinned frame (above chapter 01) instead of a standalone 800px empty screen. Let the questions section use its empty left column: for example, the eight trigrams large, lighting as each question is reached or hovered.
6. **Hero composition.** Raise the h1 toward the 38% line on desktop (shrink the hexagram stage to about 300px, or tuck the foot up) and let the premise peek 56px. Render the h1 un-masked in server HTML, so it is visible before hydration.
7. **Correct the card** (parts 3, 8, 10, 11) to what ships after the fixes.

Shared, not scored: the dev overlay's "1 Issue" comes from `components/pages/Pricing.jsx`. The header shows "Try Hanzo" solid beside the hero's solid ask on the phone's first screen. The cookie card covers the hero ask's lower half at 375 until dismissed.
