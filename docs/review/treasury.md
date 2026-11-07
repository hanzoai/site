# /treasury: James-eye review (round 3)


Verdict: 6/10
First complaint: "On my laptop the middle of the page just stops. The top is lovely, the money pours out, but then I scroll into the five chapters and nothing moves. The flow never ticks, the wallet sits there until I click it, and the postings have little black blobs where the arrows should be. On the phone the same bits are alive, so somebody's broken the desktop."

Reviewed: Treasury files committed at `98795f0a` (7 Nov 16:50 UTC), working tree clean. Walked 7 Nov 16:52–17:08 UTC on the dev server at :4180, moving, at 1470×801 and 375×812 (touch emulation). The walk recorded:
- dwells of 2.4 s at every half screen, with a pixel diff between two frames 1.5 s apart;
- a slow wheel scroll through the whole desktop page (90 px every 260 ms), logging the live chapter state;
- the h1 box on every frame for 4 s, plus the loaded font faces;
- a layout-shift observer over a full scroll;
- hover and press computed-style diffs on every control;
- a Tab crawl, and the wallet driven by its own buttons;
- the close's count-up, reduced motion, JS off, 320 px and 375×667.

`scripts/motion.mjs` could not run: the browser lock was held by another job for 4 minutes.

Proof frames are in the critic scratchpad, `treasury-critic3/`:
- `d-w03.png`, `d-w06.png`, `d-w10.png`, `d-w13.png`: the desktop chapters, frozen, with the hot row stuck on row 1, the wallet at "held" and the flow with 0 steps lit.
- `m-postings.png` and `d-w03.png`: the posting "arrows" drawn as 28 px circles with a stray chevron.
- `m-wallet-paid.png`: the phone wallet working.
- `m-close.png`: the phone close with the 64 px figure.

Fixed since round 2 (verified):
- **Phone chapters.** They now stack: words, then their own card, nothing pinned over text. The wallet has a screen of its own and plays itself.
- **Phone Balances** keeps the account names.
- **Phone first screen.** The streams come first and sit inside it (the @merchants:042 card is at y 480).
- **Phone type floor.** No lowercase text under 14 px on phone, none under 13 px on desktop (measured).
- **Emit ring** clipped to its panel on phone.
- **Figure moment.** The close's 10,000 counts up at 84 px on desktop and 64 px on phone.
- **Reduced motion.** It hydrates cleanly: 0 errors and 0 running animations after 3.5 s at both sizes, with 11/11 code lines in.
- **Hatched tile.** The "held" tile is now flat with a hairline.

## The 11 answers

1. **Does it sell in 5 seconds and move within 1 second?** Yes, at both sizes.
   - **Desktop first screen.** "Hanzo Treasury" (52 px), the lede, "Read the docs" and the editor plus the streams all sit inside 801 (stage 299–684). The h1 holds at y 200 from the first frame; only its width changes, 671 to 700 as Zen lands.
   - **Desktop motion.** It moves within 1 s: 2.1% of pixels change between 100 ms and 900 ms (stage settle, lede rise, emit ring). Then the split re-writes and the streams retract and pour again.
   - **Phone.** h1 40 px, lede, ask (bottom 354 at 375×667, 382 at 320×640), then the streams. The first second changes 12.5% of the frame.
2. **As you scroll, does one thing come in as one goes out?** On phone, yes: each chapter is its words and then its card. On desktop the structure is right but the stage is dead:
   - **The structure.** A pinned stage with a 01–05 rail, where one card changes beside one paragraph.
   - **Dwells.** Pixel diff over 1.5 s was **0.00% at all 11 dwells** from y 802 to 5213.
   - **Wheel walk.** Through the whole pin, Postings, Reconciliation and Balances each kept row 1 "hot", Flow kept 0 of 4 steps lit, and the wallet never left "held".
   - **Cause.** In `Parts()`, the one `useLive(0.05)` ref is attached first to the stacked `<section className="ts-stack">` (the server and first render). After hydration it moves to the `<div>` around `PinChapters` once `wide` flips. motion's `useInView` keeps observing the detached section, so `live` is false forever and every chapter visual gets `on={false}`.
   - **What still changes.** The only thing that moves through the five chapters is the 0.5 s crossfade when a card swaps. Five screens of a still table on a "subtle and alive" brief is the reject list's "dead page" in the middle of the page.
3. **Does every section hold a real visual object?** Yes:
   - the hero's editor and streams;
   - postings, reconciliation, balances, the wallet and the flow;
   - the close's split card with its figure.

   Two are damaged:
   - **The posting arrows.** `.ts-v-row i` (28 px circle, `display:grid`, grey or ink fill) also matches `<i className="ts-arr">`, and it outranks `.ts-arr`. Every "arrow between accounts" renders as a 28 px disc with a 7 px chevron poking out of its top right corner, at both sizes. The hot row's disc is solid black (`d-w03.png`, `m-postings.png`).
   - **Cards 01–03.** These are still three white mono tables of the same shape.
4. **One ask in Hanzo's words in the sticky header, nothing floating, and rhythmic scale?**
   - **Desktop: right.** The header shows an outlined "Try Hanzo" while the hero ask is on screen, then a solid "Read the docs" from y 802 to 5213, then goes quiet at the close, where only the close's solid shows. Nothing floats over content (the chapter pause sits under the card).
   - **Phone.** One solid per screen, but it is the shared header's "Try Hanzo" for the whole page. The page's own "Read the docs" is outlined at the hero and at the close, and no ask bar appeared. This is the header's and ask bar's issue, filed in `docs/requests/treasury.md`.
   - **Scale.** The h1 is 52 px, the lead statement 32 px and the chapter heads 26 px. The figures are 21 px, and the close's 10,000 is 84 px Air (64 px on phone). There is now one big figure moment; nothing else grows or shrinks.
5. **Does every hover and press answer, with no jumps?** Yes, with no jumps (all boxes identical before and after):
   - hero ask: fill shift and magnetic pull, press 0.98;
   - ghosts: border to ink plus a veil, press 0.98;
   - editor pause: inverts, press 0.94;
   - close ask: #0a0a0b to #2c2c2e, press 0.98;
   - `hanzoai` chip: inverts, press 0.97;
   - "Deploy to Cloud": ink border and veil;
   - split rows: veil, text to #fafafa, and their part of the bar lights.

   The wallet buttons work at both sizes: Reset, Take, Pay, Take, Reset, Take, Release. The coin travels by transform, the log fills, and the wallet keeps its height (454 px desktop, 486 px phone). The close's top did not move (2226 and 1185). The split rows are the only hover that tells you a number.
6. **Do overlaps, a font swap or layout shift appear anywhere?**
   - **CLS.** 0.0007 at 1470: 0.00025 from the `ts-stack` to pin swap at 2.6 s, the rest from the shared header's tools. 0.0000 at 375.
   - **Fonts and overflow.** No visible font swap: the h1 y and height are constant. No horizontal scroll at 320.
   - **Overlap.** None by the page. On phone the shared cookie card covers about 220 px of the first screen (shared chrome).
   - **The red "1 Issue" badge.** It appears on some cold loads. The full message is a hydration attribute mismatch in **FooterHTML** (`__html` of the footer), the known site-wide footer issue, not this page. Six further cold loads, including reduced motion and phone, logged 0 errors.
   - **Small blemish.** The close's count-up first paints the true 10,000, then drops to about 0 and counts up. It reads as a blink (samples: 10,000 ×6, then 7,800, 8,500, 9,800, 10,000).
7. **Which reference does it feel like, and is that reference's motion there?** The apple.com product page: a pinned stage with a rail where one panel changes. On desktop the panels are now still pictures, so the "alive" half of that reference is missing. The hero streams are the page's own idea and they are good. The anthropic-launch "hero figure" now shows in the close's 10,000. Nothing opens into a page (synchronized.studio), which is acceptable for a product page.
8. **Is it different from its neighbours?** The hero medium is its own: a dark room with Numscript and money streams. The skeleton is shared: `PinChapters` with a 01–05 rail is also on /sign, /risk, /platform, /features and four cloud pages. The subject overlaps /ledger (the same @users:001 split, which is Hanzo's own copy), so the streams carry the difference. The chapters, now frozen on desktop, don't.
9. **Is every one of the 18 parts covered?** No; see below. The coverage card makes claims that are false on the page (**cap 7**):
   - **Part 9:** "Chapters 01–03 read their rows in turn while in view (one lit every 1.3 s …)" and "motion.mjs at 1470 reports 0 still screens". On desktop no chapter row, flow step or wallet state changes without input (0.00% diff at 11 dwells; wheel walk above).
   - **Part 18:** "postings as arrows … addressed". The arrows render as discs (CSS specificity collision).
   - **Part 9 and the header comment:** "the fourth a wallet whose 10,000 travels …" by itself. True on phone only; on desktop the wallet waits for a press.
10. **Are there any banned tells?** None of the hard ones:
    - 0 hues;
    - no eyebrow above a headline (the lead statement leads, and "Treasury Operations" is in the editor bar);
    - no gradient text;
    - no fade-on-hover;
    - no springs.

    Soft tells:
    - the wallet's three equal grey tiles in a row on desktop;
    - literal hex throughout the page CSS (`tokens.css` not merged, noted on the card);
    - the disc-arrows look like a broken icon set.
11. **Is the copy untouched?** Yes. Every h2 matches PARTS (Hanzo's sentences), JS off shows all 8 headings with 0 hidden text, and parity is 57/57 per the card. The demo labels come from Hanzo's sentences. The four icon-only wallet controls are listed for James.

## Missing from the 18 parts
- **3 First impression and narrative:**
  - The desktop middle is dead (above).
  - The close has no `Band`: it is a heading, the split card, the ask and a grey Get card.
  - After the Flow card there is still about 300 px of white inside the pin's tail before the close.
- **4 Conversion:** on phone the page's own words never sit in a solid ask (the shared header's "Try Hanzo"); requested, not this page's to fix.
- **7 Visual system:**
  - The disc-arrow collision.
  - Literal hex and radii.
  - Cards 01–03 are the same table shape.
- **9 Motion:**
  - On desktop the chapter visuals never run, so desktop motion is the hero loop, the pin swap and the count-up; the "idle" and "time" kinds stop at the hero.
  - `useEvery` is `setInterval`, not one rAF scheduler.
  - The count-up blinks from 10,000 to 0.
- **12 Accessibility:**
  - The Tab crawl is clean: 16 stops in main on desktop and 13 on phone, all with a 2 px ring, none invisible.
  - On desktop the wallet buttons are reachable only after choosing 04 on the rail; then Tab goes 05, Pause, Pay, Release, Reset. That is acceptable, but the "Take at checkout" button is disabled while the state is "held", so the first stop is Pay.
- **17 States:** fine (reduced motion and JS off pass). The badge is the footer's.
- **18 Handover:** the coverage card's Part 9 and 18 claims are false on desktop; the `V2:` line still reads 6/10.
- **Passing:**
  - one h1 and one main;
  - h1 and code in the server HTML;
  - JS off legible at both widths;
  - reduced motion rests finished with 0 errors;
  - CLS ≈ 0;
  - no font swap;
  - no scroll at 320;
  - 44 px targets;
  - pause controls;
  - one solid per screen;
  - `data-cta` and `data-thumb` on both asks;
  - the phone composition is now its own.

## Fixes (in order)
1. **Bring the desktop chapters back to life.** In `Parts()`, give the pinned branch its own in-view hook, or put the ref on one wrapper element that is rendered in both branches (for example, always render `<div ref={ref}>` and swap its children). motion's `useInView` must observe an element that stays mounted. Then re-walk at 1470: every chapter dwell must show change without input (rows read in turn, flow steps, wallet plays itself).
2. **Fix the arrows.** Scope the round icon rule to the reconciliation marks (`.ts-v-row.two > i`) so `.ts-arr` keeps its 28×1 px line and chevron. Check both sizes: the hot row's arrow should draw out, not show a black disc.
3. **Make the card true.** Correct the Part 9 and Part 18 lines once 1 and 2 are verified at 1470, and rerun `motion.mjs` for real (it was not runnable during this walk).
4. **Stop the count-up blink.** Start counting from the value already painted (for example, settle from 9,000 or from the last digit), or begin the count on the frame the figure enters, so the true 10,000 never flashes and then drops to 0.
5. **Shorten the pin's tail.** Cut the about 300 px of white after the Flow card, and consider closing on a `Band`.
6. **Craft.**
   - Give cards 01–03 different shapes: postings as real arrows between account chips, reconciliation as two columns that meet.
   - Move the page's hex to tokens when `tokens.css` merges.
