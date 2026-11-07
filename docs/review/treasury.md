# /treasury: James-eye review

Verdict: 6/10
First complaint: "When it opens, the split is already done, then the title drops in and the whole thing wipes itself. I'm looking at an empty black box for three seconds while it types again. On my phone the 'balanced' pill and the pause button sit on top of the last account, and at the bottom the bar covers the 'Read the docs' button, so I get two of the same button. And the wallet keeps jumping the page while I read."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `ffe7921`. The Treasury files last changed in `2daa8e8`. The walk began on `a343de2`; the branch moved during the review, so every finding below was measured again on the current tree. Files hash: `2e75d4843c0a`
Walked 7 Nov 14:15–14:42 UTC on the dev server, moving, at 1470×801 and 375×812:
- Desktop: once with a fine pointer and Lenis, once without.
- Phone: touch emulation.
- Kept by the critic: screencasts of the load and of a full scroll, 6-frame bursts every half screen with a frame-difference motion log, a 100 ms state timeline of the hero, a CLS observer, and hover and press diffs on every control.

Proof: `img/treasury.jpg`, four panels:
1. Desktop first screen.
2. Phone first screen.
3. Phone, the streams' payoff: the pill and the pause button sit on the third account.
4. Phone, the close: the ask bar sits on the close's own "Read the docs".

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The parts are right: name, lede, "Read the docs" and the product (split.num plus the money streams) are on the desktop first screen, and the title cuts in by line mask. The order is wrong.
   - **Load sequence.** The server HTML paints the finished, balanced split with an empty black band where the h1 goes; LineMask starts the line at y 108%. On hydration, `useEffect(() => setK(0))` wipes it: 11 lines go to 0 and 3 streams go to 0. It then re-types at 380 ms a line.
   - **The empty panel.** The streams panel (58% of the stage) is black with one white "@users:001" chip for 2.7 s. "balanced" returns 4.2 s after hydration. Every 8 s loop repeats the 2.7 s blank.
   - **Desktop fold.** The stage's bottom 24 px and the "balanced" pill (y 766–805) sit under the fold.
   - **Phone.** Title, lede, ask and the editor fit the first screen. The money streams, the signature, start at y 877, below the fold.
2. **One in, one out, or a document?** The five pinned parts work: a 01–05 rail, and one card changing beside the words. Around them it reads as a document:
   - Right after the hero, a full white screen holds one static sentence (`.ts-say`). It has 0% pixel change in a burst at both widths and no object.
   - At 1470×801, the Hold section's h2, label and lede fill one screen, and the wallet arrives on the next. The words and their object never share a screen.
   - The close is words plus a card of chips.
   - Chapter 04 already shows the wallet ("10,000 held at checkout"). The Hold section then repeats the same idea a screen later, with the same sentence.
3. **A real object in every section?** Partly:
   - **Hero:** yes (editor and streams).
   - **Statement:** no.
   - **Chapters:** yes, but cards 01–03 are three near-identical white mono tables, and 01–04 are static (0% change in bursts). Only "Flows and webhooks" moves by itself.
   - **Hold:** yes, the wallet you drive.
   - **Close:** no.
4. **One ask, sticky after the hero?** The word is right everywhere ("Read the docs", with `data-thumb` and `data-cta`), and the ask bar carries it after the hero at both widths. But:
   - **At the close,** `.ts-first .w2-cta` is a second solid "Read the docs" on the same screen as the bar's (desktop y 7218: button at 531, bar at 734). On phone the bar sits on top of it.
   - **In the wallet,** "Take at checkout" (`.ts-b.solid`, ink) is a second solid whenever it is enabled.
   - **After the hero,** no ask is on screen from scroll ≈400 to ≈1200 (desktop) and ≈400 to ≈1600 (phone). The bar waits for the 957 px / 1298 px hero to pass.
5. **Every hover and press answers?** Most do:
   - **Answer well:**
     - Hero ask: magnetic pull up to 23 px, arrow nudge 3 px, press .98.
     - Close ask: ink to #2c2c2e.
     - Ghosts: border and veil.
     - Rail: ink, and the bar widens.
     - Every press is .98 or .94.
   - **Dead:**
     - "Take at checkout" hover changes nothing (ink border on ink fill).
     - The `hanzoai` chip has no hover and no press.
     - The hero pause has no hover in the dark room. The other pauses go from 92% to 100% white, which can't be seen.
     - `.ts-b:hover` is a bare `:hover` that sticks after a tap.
   - **Jumps.** While the wallet runs by itself on phone, its buttons jump 29 px under the thumb (see 6).
   - **Hover detail.** No hover tells you anything (no number, no preview).
6. **Overlap, font swap, layout shift?** The load itself is clean: CLS 0 on both widths, the h1 box is steady, and there is no horizontal scroll at 320 or 375. Three problems after that:
   - **Wallet shift, desktop.** The wallet's height goes 497 → 545 → 503 px as it plays by itself, and the close moves with it. CLS is 0.047 over one desktop scroll.
   - **Wallet shift, phone.** On phone the "held" tile grows from 103 to 131 px when "not spendable, not paid" wraps. CLS 0.038–0.055.
   - **Overlap at 375×812 (reject list):**
     - In the streams panel, the "balanced" pill (38–361 × 1144–1204), the "@platform:revenue" card (229–349 × 1124–1192) and the pause button (301–346 × 1166–1211) sit on top of each other.
     - The ask bar covers the close's "Read the docs".
7. **Which reference, and is its motion there?** Mostly the apple.com product page: pinned chapters with a rail. The chapter swap is a timed crossfade (opacity and 24 px) at thresholds, not a scrubbed scene. The streams pouring is the page's own idea and it is good. The synchronized.studio card-to-page is absent: nothing on the page opens into a page. There is no anthropic-style hero figure, though 9,000 / 500 / 500 could be one; today they are 20 px labels.
8. **Different from its neighbours?** Partly. The hero medium is its own: a dark room with code and money streams, unlike /ledger's light book, /sign's desk and /risk's dial. The skeleton is shared:
   - The composition is the /tabs and /billing first screen: "Hanzo X" at 136 px left, lede and two buttons right, a two-part stage strip on the fold.
   - The rail chapters are /sign's component.
   - The "Get X" card close repeats from page to page.
   - The subject overlaps /ledger: the same @users:001 → @merchants:042 $100 split. That is Hanzo's own copy, so the treatment has to carry the difference.
9. **All 18 parts covered?** No; see below. `docs/coverage/treasury.md` exists, but two of its claims fail measurement ("One solid per viewport", "targets 44px").
10. **Banned tells?** None of the hard ones:
    - 0 hues in `<main>`, checked at 14 scroll positions.
    - No eyebrow: "Treasury Operations" moved into the editor bar, which is right.
    - No button fades on hover.
    - Soft tells:
      - Inconsistent spacing: the destination column steps 12 px between rows in the Postings and Balances cards, because each row is its own grid with an `auto` amount column.
      - The wallet's three equal grey tiles in a row are close to "3 equal boxes".
11. **Copy untouched?** Mostly. Parity is 57/57 text and 3/3 links, and split.num, "Treasury Operations" and "What it is made of" are Hanzo's. Demo labels (agrees/disagrees, held, available, event lines) are UI data. New strings remain:
    - The four wallet control labels ("Take at checkout", "Delivered: pay the seller", "Release the hold", "Reset") are not in `content/ui-strings.json`. Override 2 says icon plus aria-label until James approves.
    - The Hold h2 "Take money at checkout and pay a seller on delivery" is a new heading cut from Hanzo's sentence.
    - The Hold lede splices two Hanzo sentences.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** `Persona:`, `Goal:`, `CTA:` and metric are present. The page fails one solid per viewport: the close plus the bar, and the wallet's solid plus the bar.
- **2.3 First impression:** the h1 is not visible in the server paint (it is masked until hydration). The hero object un-writes on hydration. The phone fold has code but not the streams. The close is not a Band (`.x-band`), so the ask bar never yields there.
- **2.4 Conversion:** two identical solid asks at the close. There is no ask on screen for about one screen after the hero.
- **2.6 Content:** phone type is now at least 14px (fixed in `2daa8e8`). At 375 the three account names in the streams are cut with an ellipsis ("@merchant…", "@fees:pro…", "@platform:…"), and they are the object's content.
- **2.7 Visual system:**
  - At scroll 0, Settle's scale is capped to exactly the viewport, so the stage runs 0→1470. The editor's left border and the streams panel's right border sit on the screen edges: it is neither inset nor deliberately full-bleed.
  - Duplicate rules: `.ts-ed` and `.ts-flow` are each declared twice (radius 28 vs 22, min-height 420 vs 380), and `.ts-ed pre` twice with `!important`.
  - `.ts-kick` is unused.
  - The CSS header still says "gold".
- **2.8 Components:**
  - One bare `:hover` (`.ts-b`).
  - The solid wallet button has no hover.
  - The `hanzoai` chip has no states.
  - The dark-room pause has no hover.
- **2.9 Motion:**
  - Three `setInterval` loops (via `useEvery`, at 380, 900 and 2600 ms). They stop off screen and when paused.
  - Reduced motion settles: final state, 0 running animations.
  - Four of the five chapter visuals are static.
  - The wallet's numbers roll in place; the money never travels between accounts.
- **2.11 Mobile:**
  - The `hanzoai` chip is 40 px tall (plan: 44).
  - The streams panel is cramped at 375: overlap and truncation.
- **2.12 Accessibility:** the editor's comment lines are #6e6e73 on #0f0f11, 3.8:1. "nothing held yet" is about 3.9:1. Both are under 4.5:1.
- **2.17 States:** while the events list changes state, stale lines linger next to the new state ("paid out to @merchants:042" beside "nothing held yet"), because exits carry the entry stagger delay.
- **Coverage:** the file exists. Correct its one-solid and 44 px claims.
- **Passing:**
  - One h1 and one main.
  - JS off is fully legible (`NoJs`).
  - No raw img, video or table; no `title=`.
  - No horizontal scroll at 320 or 375.
  - Load CLS 0.
  - `data-thumb` and `data-cta` are on both asks.
  - Pause controls work (`aria-pressed`).
  - No hue in `<main>`.
  - The footer's blue "Privacy choices" toggle belongs to the shared footer, not this page.

## Fixes (in order)
1. **Never un-write the first screen.**
   - Let the server-painted balanced split hold first, then dim it and re-type: start `k` at `N` and let the loop run from the hold, instead of `setK(0)` on mount.
   - Draw each stream as its line is typed, so the right panel is never an empty black box for 2.7 s.
   - Render the h1 visible in the server HTML: the cut-in may play, but never from nothing.
   - Bring the stage up about 30 px (`lift`) so the "balanced" pill and the card bottoms sit inside 801.
2. **Clear the phone overlaps and the double ask.**
   - Put `data-thumb="Read the docs"` on `.ts-first .w2-cta`, or make the close an `.x-band`. The bar then steps aside, which also removes the two-solid screen on desktop.
   - In `.ts-flow` at ≤900px, move `.ts-ok` out of the bottom-left (under the panel, or into the @users:001 chip) and move the pause to the top-right.
   - Give the destination names a full line, so nothing is cut or covered.
3. **Stop the wallet from moving the page.**
   - Fix the `.ts-w` tile height at every width (keep `em` on its own line).
   - Give `.ts-ev` a fixed height, and drop the delay on exits.
   - Nothing below the wallet may move while it plays (target CLS 0).
4. **One solid per screen in the wallet.**
   - "Take at checkout" becomes a selected or outlined control (for example the `.w2-seg` thumb), not an ink button.
   - Move `.ts-b:hover` inside `@media (hover:hover)`, with a fill shift that also shows on the dark variant.
   - Give the chip hover and press, and the dark-room pause a hover.
   - Raise the chip to 44 px.
5. **Make the money move, once.**
   - Merge chapter 04 and the Hold section: the playable wallet is chapter 04's pinned object. That deletes the repeated idea, the cut h2 and the spliced lede (or list them for James).
   - In the wallet, the 10,000 should travel from @users:001 into "held" and on to @merchants:042, instead of three numbers rolling in three equal tiles.
   - Put the four control labels in `ui-strings.json`, or render them icon-only with aria-labels until James approves.
6. **Give the dead screens something alive.**
   - The `.ts-say` statement is a full static screen. Cut it in with LineMask over the settling split, or let the hero's three destinations shrink into chapter 01's rows while it reads (the "same ledger" idea, authored).
   - Carry the small balanced split into the close beside "Post your first transaction".
7. **Craft.**
   - Inset the hero stage, or make it deliberately full-bleed (no radius or border at the edges).
   - Use one grid for the chapter tables so the destination column stops stepping 12 px.
   - Lighten the editor comments and "nothing held yet" to ≥4.5:1.
   - Delete the duplicate `.ts-ed`, `.ts-flow` and `pre` rules, `.ts-kick`, and the "gold" comment.
