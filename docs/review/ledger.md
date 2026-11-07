# /ledger: James-eye review

Verdict: 6/10
First complaint: "It's grey now and the live book is good. But everything is huge: the title, then 'Every cent lands somewhere' just as big on an empty white screen, then giant numbers on every screen. Nothing is small or medium. There's a little 'Watch' tag stuck on the edge of the screen, and a 'NUMSCRIPT' label sitting on a heading again."

Reviewed: main @ `2106935` (last page commit `f4d15c1`; owner.txt's `9a02a49` reached main at 14:54, after the desktop walk). Files hash: `9417373c04b2`
Walked 7 Nov 14:51–14:54 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/ledger.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour.** The walk found no hue at either width. The "See the request" sheet is now ink on white with a grey wash on the Idempotency-Key line: the phone film at 23.6 s shows it open, with 0 saturated pixels. Before, it had green strings, blue keywords and a yellow highlight.
- **Done: the stacked sticky asks.** No "Read the docs" bar shows on any screen at either width. From s1 to s8 the only fixed solid button is the header's "Try Hanzo" (desktop y 13, phone y 8). At the close (desktop s9) the header's ask turns to an outline beside the close's own "Read the docs". So there is one solid fill per screen. But the coverage card and the V2 line still say a sticky bar carries "Read the docs".
- **Partly done: floors and JS off.**
  - Done: desktop has 0 text runs under 13px (before: "Agent prompt" and "Copy" at 12.5px), and every phone target is 44px or more.
  - Still open: on phone, 10 runs are just under 14px; they round to 14 ("@users:001", "@merchants:042", "9,500", "500"). It was 22 runs at 13px.
  - Better: with JS off, 5 runs are hidden (it was 12). They are the selected capability's "Numscript", its sentence and its balances.
- **Still open:**
  - The dark room's selected tab: "send" measures 1.2:1 at both widths, the pill never draws and the hover is dead.
  - The phone chapter stage still pins on top, and it now covers chapter 03's heading (s4).
  - The phone code panes are still cut off mid-word ("@merchant", "@platform:").
  - Nothing answers the pointer except a cursor label, and James has banned those since the last review.
- **Not walked (needs a fresh walk):**
  - These landed on main after the desktop walk: `d66e1ef9` (the tab pill selector, phone chapters stacked, the book answering the pointer, a receipt close), `a241a1aa` (`BizAsk` instead of raw `.x-btn`) and `9a02a49` (names the page in the ask bar), all at 14:54:02; then the kit's `8b2ca468` (52 / 26 / 64 type scale, no springs) at 14:57. This review gives them no credit. Main's files hash is now `23c875b3cb32`.
  - Main's source still has the "Watch" cursor label, the "Numscript" label over the h2, `kick="bash"` on the sheet and the page's own 80–120px figure sizes.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - Desktop: all of this fits inside 801px:
     - "Hanzo / Ledger" at 96px, on two lines;
     - "A double-entry ledger you post to over HTTP.";
     - "Read the docs" and "GitHub →";
     - the paragraph;
     - the whole live book, which ends at about y 745 (four balances −10,000 / 0 / 9,500 / 500, the journal and the note).
   - The h1 cuts in by line mask (5/25 moving frames in the first second). The book then posts by itself (18/46 moving frames in the rest of the 3 s; s0 shotdiff 10.6). It shows new money from world and the split, then "× users:001 → merchants:042 · 100 — refused whole", the sha256 chain, the reversal and "same key, different postings — caught".
   - The title lands last: on sheet 01 the lede and the book are up at 0.5 s, and the title finishes cutting in at about 2.5 s. This is within the dev-server allowance, so I note it but don't score it.
   - Phone: the 48px h1, the line, the ask and all four balances are above the fold (the book starts at about 450px), with 16/25 moving frames in the first second.
2. **One in, one out, or a document?** Half.
   - Desktop: the chapters pin, with the stage on the left, the text on the right and a 01–03 progress line. Each scene moves (s2–s4 shotdiff 2.5 / 5.2 / 6.65), and in chapter 01 a dot runs along the source → destination arrow.
   - But s1 is a whole screen holding one heading, "Every cent lands somewhere" at 96px on blank white. It is STILL (shotdiff 0.017).
   - s8 is about 450px of empty white between the splitter and "Get started with Ledger".
   - Phone: the stage pins on top while the text scrolls under it. Chapters 02 and 03 are STILL (s3 0.001, s4 0.003), and so are the dark room (s5, 0) and the splitter (s7, 0). That makes 4 of the 10 page screens on phone.
   - The close is still a block of text: "Get Ledger", two chips, "Get started with Ledger", "Paste and ship", the agent prompt and the "Deploy to Cloud" row. It is not a `Band`.
   - Evidence caveats:
     - Main moved under the phone walk. The page reloaded at 14:54:10, so phone s12–s14 are void: s12 is a shrunken render, s14 is a grey frame, and muts reads −1570.
     - The desktop film runs about 6 s behind the walker (sheet 04 shows the hero hover tests during dwell 1). I read the screens from the shots.
3. **A real object in every section?** Yes, except the close and s1.
   - The hero has the book.
   - The chapters have the posting, the chain and the retries.
   - The dark room has the Numscript and its balances, then "USD/2" with "10000 → 100.00".
   - The Numscript section has the splitter: dragging 95% to 75% gives 7,500 / 2,500.
   - The close has only the shared agent prompt box.
   - s1 is a heading and nothing else.
4. **One ask, nothing floating, scale with rhythm?** The ask passes. Floats fail. Scale fails.
   - **Ask:** after the hero, the one solid button is the header's "Try Hanzo", sticky at both widths and in Hanzo's words. The page's own "Read the docs" only comes back at the close.
   - **Floats, desktop:** the book carries `data-cursor="Watch"`, so a black "Watch" tag rides the pointer. In the s0 and s1 shots it is stuck at the right edge (x 1448, y 432), cut off to "W". At s1 the book is gone and the tag still hangs over empty white. Hovering "See the request" adds the kit's "Open" tag beside the button (sheet 11, last row).
   - **Floats, phone:** at s4 the pinned chapter stage (white, with a shadow) covers chapter 03's "Safe to retry", its "03" and the first lines of its text. Only "sent, so reusing a key…" shows under it.
   - The walk's FLOATS list is empty at both widths. It does not count a cursor tag or a sticky stage, but the shots show both.
   - **Scale, desktop: everything is big.**
     - The h1 is 96px, and "Every cent lands somewhere" is 96px too.
     - The chapter heads are 47px.
     - Chapter 01 has "Σ 0" at 118px, "9500" and "USD/2" at 82px, and "@users:001" at 32px (BIG×5 at s2 and s3). Chapter 03 has its "1" at 118px.
     - The dark room has "What the API gives you" at 56px, with "send" at 80px under it.
     - The Numscript h2 is 80px over three lines, beside "$ 100.00" at about 94px.
     - The close has "Get Ledger" at 96px and "Deploy to Cloud" at 44px.
     - Live hanzo.ai rests at 52 / 26 / 64. Nothing here is a 26px section head, and nothing grows and then settles back.
   - **Scale, phone:** the section heads are the same 48px as the h1. "Σ 0" is 56px and the figures are 40px. The Numscript screen is BIG×5 (s6).
5. **Every hover and press answers?** Mostly.
   - These answer on hover and press:
     - hero "Read the docs" (0.98);
     - "GitHub" (1px);
     - Pause (a 1px lift that the walker logs as a jump, then 0.94);
     - "Σ users:*" (0.98);
     - "See the request" (0.97);
     - "hanzoai" (0.98);
     - "View on GitHub" (1px);
     - Copy (0.92).
   - Dead: the selected tab "send" has no hover and an invisible label. The amount slider has no hover and no press.
   - Phone taps:
     - Pause, "USD/2" and Copy answer.
     - "See the request" opens its sheet: the film shows it rise at 23.6 s, but the walker logged no change because it checked too early.
     - "send" and the slider show nothing.
   - Pointer: the only things that follow the mouse are the banned "Watch" and "Open" tags. Hovering the book tells you nothing.
6. **Overlap, font swap, layout shift?**
   - Nothing was measured:
     - the overlap list is empty at both widths;
     - CLS is 0 at both widths;
     - the h1 box is steady (one reading each);
     - there is no horizontal scroll at 375 or 320.
   - But on phone the sticky chapter stage covers chapter 03's words (answer 4). The overlap check skips it because the stage is sticky.
   - At 375 the code panes in the dark room and the splitter are cut off at the card edge mid-word.
7. **Which reference, and is its motion there?**
   - apple.com product page: yes. The product is the hero, and the chapters pin on desktop.
   - motion.dev: the balances roll and the sheet rises, but the roll and the tab pill both run on springs, which the deck bans ("no springs, no overshoot"). The gliding pill (`layoutId`) is in the code but never draws.
   - synchronized.studio card-open: absent.
   - anthropic launch: there is no hero figure.
8. **Different from its neighbours?** Only the hero is its own.
   - The book beside the title is not /treasury's black split flow or /metrics' full-bleed chart.
   - After the hero, the page is the Business 1 kit:
     - `BizChapters` (stage left, a 0N/03 progress line, the number under the heading), as on /captable, /console, /dataroom, /flow, /gui and /payments;
     - the `BizStage` settle, as on /console, /gui and /payments;
     - the `BizSheet` "See the request", as on /captable, /commerce, /jin and /payments;
     - the same `data-cursor="Watch"`, as on /dataroom, /jin and /payments;
     - the same "Get X" close (licence chip, hanzoai chip, Paste and ship, Deploy to Cloud row) as every Cloud page.
   - The splitter tells the same Hanzo split (`send [USD/2 10000]`, @users:001 → @merchants:042) that /treasury draws as its hero.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card is there with all 18 parts, but three of its claims fail the walk.
10. **Banned tells?** Yes:
    - **Everything big at once** (answer 4).
    - **Cursor-following labels:** "Watch" on the book, stuck at the screen edge on s0 and s1, and "Open" on "See the request".
    - **A label directly above a headline:**
      - "NUMSCRIPT" (13px Zen Mono capitals) sits just over the h2 "One transaction, however many parties" at both widths (desktop s7, phone s6).
      - "BASH" sits over the sheet's h2, which uses the same words.
    - **A panel covering text:** the phone's pinned chapter stage over chapter 03.
    - Clean now: no hue, no opacity-only hover, 0 title tooltips, no sound and 0 console errors at both widths.
11. **Copy untouched?** Yes.
    - Parity is 55/55 text and 3/3 links.
    - The 18 new strings are demo data (balances, the Numscript, "tx 2", the request's content-type) and labels ("journal", "received", "Split it yourself", "Amount, USD").
    - The closest to a sentence is still "10,000 in USD/2, the smallest unit: whole numbers, nothing rounds on the way in". It repeats Hanzo's own "USD/2" line and adds no claim.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/ledger.md` has all 18 parts (the older numbered form), but three claims fail the walk:
  - Parts 1 and 4 say "the site's sticky ask bar after the hero, the phone thumb bar" carry "Read the docs". No bar showed on any screen at either width, and the V2 line makes the same claim.
  - Part 9 says "the capability pill glides (layoutId)". It never draws: "send" measures 1.2:1.
  - Part 11 says "text is 14px or larger". 10 phone runs are under 14px.
  - The card also lacks the three lines above part 1 (copy questions, requested shared changes, forks deleted).
  - The card on main now also claims the book lights up on hover and that nothing pins under 900px. This walk shows neither, so re-check both after the re-walk.
  - This caps the page at 7.
- **Part 1:** the metric `docs_click` sits inside the Persona line and is not one of MASTER §1's metric ids, so the check finds none. The hero and close asks are 2 raw `.x-btn` in `Ledger.jsx`. No copy questions are listed.
- **Part 3:**
  - With JS off, 5 runs are hidden (the selected capability's panel).
  - s1 is a heading-only screen, and s8 is about 450px of empty white.
  - The close is not a `Band` (`bandAtEnd` false).
- **Part 4:** the page's own ask is not carried after the hero. That is fine under the new no-float rule, but the card says it is. `data-cta` is "primary" / "secondary", not `ledger.<slot>`.
- **Part 6:** 10 phone runs are under 14px, and the code panes are cut off at 375.
- **Part 7:**
  - "NUMSCRIPT" sits over the h2, and "BASH" over the sheet's h2.
  - `Ledger.css` has 39 literal hexes, several of them not in the deck (`#f5f5f7`, `#a1a1a6`, `#86868b`, `#e8e8ed`, `#d4d5d9`, `#c7c7cc`, `#1c1c1e`, `#141416`).
  - The book and splitter cards are both outlined and raised with a large shadow. The rule is one or the other.
- **Part 8:** the selected tab and the slider have no hover. 14 `:hover` rules sit outside `@media (hover: hover)` (5 in `Ledger.css`, 9 in the shared `Frame.css`).
- **Part 9:**
  - The only pointer motion is the banned cursor tags.
  - There are 2 springs (the balance roll and the tab pill).
  - The shared `Frame.jsx` has 2 `setInterval` timers.
  - On phone, chapters 02–03, the dark room and the splitter are STILL.
- **Part 11:** the chapter stage pins under 900px and covers chapter 03 (s4).
- **Part 12:** the selected tab "send" measures 1.2:1 at both widths.
- **Part 18:** the V2 line says "one ask everywhere (hero, sticky bar, close)", but there is no bar.
- Passing:
  - one h1, visible with JS off, and one main;
  - no hue;
  - CLS 0 at both widths, no overlap, and no horizontal scroll at 375 or 320;
  - 0 tiny targets, 0 desktop text under 13px and 0 title tooltips;
  - 3 `data-cta` and 1 `data-thumb`;
  - no raw img, video or table;
  - reduced motion settles (0 running after 3 s);
  - a pause control on the book and an empty-amount state on the splitter;
  - 0 console errors;
  - parity 55/55 and 3/3.

## Fixes (in order)
1. **Bring the scale down to the deck's resting sizes.** The kit is now 52 / 26 / 64 (`8b2ca468`), but the page's own CSS still goes past it.
   - Cap these at 64px: `.ld-post-row .bz-fig` (82px), `.ld-seal b` (118px), `.ld-prec b` (96px), `.ld-glyph` (80px) and `.ld-amt-in input` (94px).
   - Set "Every cent lands somewhere", "One transaction, however many parties" and "Get Ledger" as section heads (`bz-headline`) instead of display size.
   - Leave one big thing per screen: the balances in the hero, "Σ 0" while chapter 01 is lit, the amount in the splitter.
2. **Delete the cursor labels.** Remove `data-cursor="Watch"` from `.ld-book` in `Ledger.jsx`, and put `data-cursor=""` on the "See the request" button so the kit's "Open" stays off. Let the book answer the pointer itself instead: a journal row lights the accounts it touched.
3. **Take the labels off the headings.** Move "Numscript" from above the h2 to a caption under it (it is Hanzo's word). Drop `kick="bash"` from the `BizSheet`, since the code pane's own tab already says "bash".
4. **Make the selected tab visible.** The selector fix (`button > span:not(.ld-caps-pill)`) is on main now. Check that the white pill draws and "send" reads ink on white at 4.5:1 or better, and give the selected tab a hover. Then swap both springs (the tab pill and the balance roll) for `ease-emphasis` at 300 ms.
5. **Stop the phone stage covering words.** Under 900px, put each chapter's scene above its own text with no sticky. Let the dark-room and splitter code wrap, or show a scroll edge, instead of cutting off "@merchant".
6. **Make the card and the V2 line true.**
   - Remove the sticky-bar claim: no bar showed, and a floating bar is now banned on desktop anyway.
   - Restate the pill and 14px claims only once a walk measures them.
   - Add the three lines above part 1.
   - Set `data-cta` to `ledger.hero` and `ledger.close`.
