# /treasury: James-eye review

Verdict: 6/10
First complaint: "On my phone that white card sits on top of the words while I scroll, so I'm reading two lines at the bottom of the screen. The wallet, the bit I'm meant to play with, has already flipped to the next card before its words show up. The balances card just says USD/2 three times. On desktop it's nice, but on the phone it falls apart."

Reviewed: branch tree clean at `32406a2c` (the Treasury files last changed 7 Nov 16:32 UTC). Walked 7 Nov 16:20–16:46 UTC on the dev server at :4180, moving, at 1470×801 and 375×812 (touch emulation). For each half screen the walk dwelled 2.4 s and measured a pixel diff between two frames 1.5 s apart. It also recorded:
- the h1 box timeline per animation frame, plus the loaded font faces;
- a layout-shift observer over a full scroll;
- hover and press computed-style diffs on every control, and a Tab crawl;
- the wallet driven by its own buttons, with the close's position checked before and after each press;
- a phone sweep every 120 px through the chapters, logging the visible chapter visual against the visible headings;
- reduced motion (`getAnimations()` after 3.5 s), and JS off at both widths;
- 320 px and 375×667.

Proof frames (critic scratchpad, `treasury-critic/`):
- `m-at-2340.png`: phone, the Flow card shown over the wallet's own words.
- `m-w05.png`: Balances showing "USD/2" three times.
- `rm-hero.png`: the red "1 Issue" badge under reduced motion.
- `d-w14.png`: the empty band before the close.
- `m-w08.png`: two solids on the phone close.

Previous review: 6/10. Fixed since then:
- no un-write on load;
- no phone overlap in the streams panel;
- the wallet no longer moves the page;
- outlined wallet controls;
- the Hold section merged into chapter 04;
- the `.ts-say` screen cut;
- the close's split card;
- chip at 44 px with states;
- comment contrast;
- duplicate rules removed.

## The 11 answers

1. **Sells in 5 seconds, moves within 1 second?** On desktop, yes. The first screen shows "Hanzo Treasury", the lede, "Read the docs" and the product: split.num beside the money streams, all inside 801 (the stage ends at y 684, the "balanced" pill at 673).
   - **Server paint.** The server paints the finished, balanced split, so the first screen is never empty. The h1 is visible from the first frame (box steady at y 200, 700×60 through load).
   - **First second.** Within 1 s the stage settles from 1.015 and the lede rises 14 px. A ring leaves @users:001 every 2.4 s.
   - **The loop.** After about 3.4 s the last three code lines dim and re-type, and the streams retract and pour again: 8% of the stage changes per 1.5 s.
   - **Phone.** Title, lede, ask and the code fit the first screen (the ask's bottom is at 354 at 375×667). The money streams, the signature, start below the fold, so the phone's first screen is a code block.
2. **One in, one out, or a document?** On desktop it works:
   - one hero;
   - a pinned stage with a 01–05 rail where one card changes beside one paragraph (motion 2.5–7% at every dwell);
   - the close.

   The tail of the pin leaves about 400 px of empty white before "Post your first transaction" (`d-w14.png`).

   On phone it is broken. `.w2-pin-visual` stays `position: sticky` (white, z-index 2) and covers y 60–626 of the 812 screen. The chapter text scrolls underneath it, so only the bottom 186 px is readable. Headings at 250 and 488 are hidden under the card (sweep at scroll 2100).
   - **Visual against words.** The visual runs ahead of the words. At scroll 2340 it shows Flow while "Wallets with holds" and its paragraph are the readable text (`m-at-2340.png`).
   - **The wallet.** The wallet (chapter 04, the page's "Beyond") was the visible card in one 120 px step of the whole sweep.
   - **The brief.** MASTER part 11 says pinned scenes stack under 900px. These do not.
3. **A real object in every section?** Yes, on desktop:
   - hero: the editor and the streams;
   - chapter 01: postings;
   - chapter 02: reconciliation;
   - chapter 03: balances;
   - chapter 04: the wallet;
   - chapter 05: flow events;
   - close: the split bar.

   Every chapter card moves while in view: a row is read every 1.3 s with a drawn hairline, the wallet plays itself, and the flow steps. On phone, Balances hides the account column (`.ts-v-row > span:first-child {display:none}`), so the card reads "USD/2 9,000 / USD/2 500 / USD/2 500" and loses the only thing it says. Cards 01–03 are still three near-identical white mono tables.
4. **One ask, sticky, nothing floating; scale rhythm?**
   - **Desktop: right.** While the hero ask is on screen, the header's button is an outline. After the hero the header carries a solid "Read the docs", and at the close it goes quiet again (y 5614–6416: only the close's solid).
   - **Phone, first screen.** It holds two solids: the header's black "Try Hanzo" and the hero's light "Read the docs".
   - **Phone, chapters.** For the whole chapter run, no "Read the docs" is on screen. The ask bar never appeared at any of 10 rest positions (`.x-ask` absent), so the header shows "Try Hanzo" for 2,000 px.
   - **Phone, close.** Black "Try Hanzo" and black "Read the docs" share the screen (`m-w08.png`).
   - **Floating.** Nothing floats over content on desktop.
   - **Scale.** The h1 is 52px, the lead statement 32px and the figures 21px: the rhythm is calm but has no figure moment. 9,000 / 500 / 500 never becomes a hero number, and nothing grows or shrinks as the story turns.
5. **Every hover and press answers, no jumps?** Most controls do:
   - **Hero ask:** fill shift, magnetic pull, press .98.
   - **Ghosts:** border to ink plus a veil, press .98.
   - **Hero pause:** inverts. **Chapter pause:** inverts, press .94.
   - **Close ask:** ink to #2c2c2e.
   - **`hanzoai` chip:** inverts, press .97.
   - **Close split rows:** veil, and their part of the bar lights.
   - **Wallet buttons:** invert, inside `@media (hover:hover)`.
   - **Rail 01–05:** 44×46.

   No layout jump: the close's top stayed at 2109 through Reset, Take, and Pay, and the wallet held 454 px. The hover details that tell you something are the close's split rows (lighting their part); nothing else previews a number. The stream destination cards in the hero have no hover (they are aria-hidden drawings, acceptable).
6. **Overlap, font swap, layout shift?**
   - **CLS.** 0.0004 at 1470, all from the shared header's tools; 0 at 375. Zen and Zen Mono load with no h1 movement. There is no horizontal scroll at 320.
   - **Overlap.** The phone pin overlap above (sticky card over the chapter text) is the reject-list "overlap at 375×812".
   - **Emit ring on phone.** The @users:001 chip is full-width on phone, so `ts-emit`'s `scale(1.22, 1.5)` runs past the panel. It shows as a stray line cutting through the stream panel's top border every 2.4 s (`m-w01.png`, `m-hero-t2.png`).
   - **Reduced motion.** A hydration mismatch fires under reduced motion on every cold load (2 of 2), and Next shows the red "1 Issue" badge (`rm-hero.png`). The mismatch is in `Settle` (server `translateY(12px) scale(1.015)`, client `none`) and `PinChapters` (article transforms). Both are shared components, but the badge shows on this page.
7. **Which reference, and is its motion there?** The apple.com product page: a pinned stage with a rail where one panel changes (a timed crossfade with 24 px travel, not scrubbed). The streams pouring out of @users:001 is the page's own idea and it is good. Other references are absent:
   - **synchronized.studio:** nothing opens into a page.
   - **anthropic launch:** no hero figure.
8. **Different from its neighbours?** The hero medium is its own: a dark room with code and money streams. The skeleton is shared:
   - `PinChapters` with a 01–05 rail is also on /sign, /risk, /zap and /ui.
   - The "Get X" grey card close repeats.
   - The subject overlaps /ledger (the same @users:001 → @merchants:042 split, which is Hanzo's own copy), so the treatment must carry the difference. The streams do; the chapters don't.
9. **All 18 parts?** No; see below. `docs/coverage/treasury.md` has claims that are false on the page (cap 7):
   - **Part 6:** "No text under 13px (14px phone) … gate small375 []". At 375, visible text below 14px:
     - "split.num" at 12px (lowercase mono, so not the capitals exemption);
     - the close's "@users:001" and "9,000 + 500 + 500 = 10,000 · balanced" at 13px;
     - "event →" at 13px.
   - **Part 1:** "One solid fill per viewport" holds on desktop only. The phone hero and close each show two.
   - **Part 4:** "Sticky ask: header, bar after the hero, same label". On phone no bar appeared and the header says "Try Hanzo" throughout.
   - **Part 11:** "375×812 … pass with no overlap" is false: the pinned card covers the chapter text.
   - **Part 17:** "0 console errors" is true only with motion on. Under reduced motion there is 1 error and the red badge.
10. **Banned tells?** None of the hard ones:
    - 0 hues;
    - no eyebrow above a headline ("Treasury Operations" lives in the editor bar; "What it is made of" sits under the lead statement);
    - no fade-on-hover;
    - no gradient text.

    Soft tells:
    - the hatched "held" tile (`repeating-linear-gradient`) is decoration;
    - the wallet's three equal grey tiles in a row;
    - page CSS uses literal hex throughout (`tokens.css` is not merged, as the card says).
11. **Copy untouched?** Yes, per the coverage card (parity 57/57 text, 3/3 links), and the Hold section's spliced h2 and lede are gone. Demo labels (agrees, disagrees, held, event, flow steps) are UI data drawn from Hanzo's sentences. The four wallet controls are icon-only with aria-labels, listed for James.

## Missing from the 18 parts (measured)
- **1 Strategy:** one solid per viewport fails on phone (header "Try Hanzo" plus "Read the docs" at the hero and at the close).
- **3 First impression and narrative:**
  - The phone's first screen has no money streams; the signature starts below the fold.
  - The pin's tail leaves about 400 px of dead white before the close on desktop.
  - It does not end on a `Band`: the close is a heading, a card and a grey Get card.
- **4 Conversion:**
  - No sticky ask with the page's words on phone for the whole chapter run.
  - The close does not use `.x-band`, so the phone bar's blocker logic never yields cleanly there.
- **6 Content:** the phone type floor is broken in four places (above). On phone the Balances rows drop their account names.
- **7 Visual system:**
  - Literal hex and radii in page CSS.
  - The hatched tile.
  - The stage at scroll 0 runs 13→1457 (scaled), not on the 24 px gutters, until it settles.
- **9 Motion:**
  - `useEvery` uses `setInterval` (3 loops), not one rAF scheduler.
  - There is no figure count-up or settle.
  - The chapter swap is a timed crossfade, not scrubbed.
  - The phone emit ring overflows its panel.
  - Reduced motion rests correctly (0 running animations, 11/11 lines in), but hydrates with a mismatch.
- **11 Mobile:**
  - Pinned chapters do not stack under 900px: the sticky card covers 566 of 812 px of the text, and the visual runs ahead of its words.
  - Chapter 04, the wallet, is effectively skipped.
- **12 Accessibility:** "A focused element is never under the header or the ask bar": on phone, chapter text, though not a control, is under the sticky visual. The Tab crawl is clean: 16 stops in main, all with a 2px ring, none invisible.
- **17 States:** the reduced-motion hydration error and the red badge.
- **18 Handover:** the `V2:` line still reads 6/10; the coverage card's false claims need correcting.
- **Passing:**
  - one h1 and one main;
  - h1 and code in the server HTML;
  - JS off legible at both widths (1 decorative log line hidden);
  - no horizontal scroll at 320;
  - CLS ≈ 0;
  - no font swap;
  - every control has hover, press and focus;
  - 44 px targets;
  - pause controls with `aria-pressed`;
  - the wallet drives without moving the page;
  - 0 hues;
  - `data-cta` and `data-thumb` on both asks;
  - JSON-LD and canonical via the shared layout.

## Fixes (in order)
1. **Stack the chapters on phone.**
   - Under 900px, render each chapter as text followed by its own card in flow (`position: static` for `.ts-pin .w2-pin-visual`), or give the card a short sticky band whose words sit above it, never under it.
   - Each card must be on screen with its own heading. Chapter 04's wallet needs at least one full screen of its own.
2. **Fix the phone Balances card.** Keep the account name and drop the "USD/2" column instead (or put USD/2 in the card's header row).
3. **Make the coverage card true, then the page true.**
   - Raise "split.num" to 14px on phone, or set it in capitals at 12px.
   - Raise the close's figcaption and "event →" to 14px on phone.
   - Correct the one-solid, sticky-ask and "no overlap" claims, or fix them. For phone, ask the `Ask.jsx` owner (`docs/requests/treasury.md`) to quiet the header's "Try Hanzo" while a page's own solid is on screen, as desktop does, and to let the bar carry "Read the docs" through the chapters.
4. **Kill the reduced-motion hydration error.** `Settle` and `PinChapters` must render the same initial style on server and client (read reduced motion after mount, or use `initial={false}` for both). File it with the shared owners if you cannot edit them. The page must show no red badge in any mode.
5. **Clip the emit ring on phone.** Scale it uniformly by a few pixels (for example `scale(1.04)`), or switch it off when `.ts-src` is full-width, so it never crosses the panel border.
6. **Give the page one figure moment and close the gap.**
   - When the split balances, let 9,000 / 500 / 500 settle once at figure size (64px rest) in the close or in chapter 01, then shrink back.
   - Cut the about 400 px dead tail after the pin.
   - Bring the streams into the phone's first screen (shorter comments, or the streams above the code on phone).
7. **Craft.**
   - Replace the hatched "held" tile with a flat tone and a hairline outline.
   - Make cards 01–03 differ in shape, not only in words (for example, postings as arrows between accounts, reconciliation as two columns that meet).
   - Move page hex to tokens once `tokens.css` merges.
