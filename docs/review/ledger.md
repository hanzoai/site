# /ledger: James-eye review

Verdict: 5/10
First complaint: "It's green. Green accents are on my reject list, and the whole book is emerald, with red on top. Then on my phone the first screen is a label, a title and a paragraph of small text, with no ledger in sight. That's a document, not a product."

Reviewed: branch `claude/friendly-mccarthy-g2d3no` @ `981cd30` (not on main yet). Files hash: `f86c86c3d263`
Walked 7 Nov 13:39–13:45 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/ledger.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: the title cuts in by line mask, so it moves. But the self-balancing book, the page's best idea, sits on the fold: at 801 high you see only its toolbar ("POST /v2/main/transactions · Balanced by construction · 01 / 03"). The rest of the first screen is a 4-line paragraph. Phone: no object at all on the first screen. The book starts below it.
2. **One in, one out, or a document?** The three sticky chapters (posting, chain, retry) work: one scene changes while the text holds, with a 01–03 progress line. The dark room "What the API gives you" is four stacked items with paragraphs, which reads as a list. The close is three text blocks.
3. **A real object in every section?** Hero: yes, the book (accounts, journal, Σ 0 seals, idempotency key), but it is below the first screen. Chapters: yes. The splitter: yes, the best Beyond so far. Dark room: big mono glyphs ("send", "USD/2", "Σ users:*") stand in for objects; that is type, not a thing. Close: no object.
4. **One ask, sticky after the hero?** No. The hero has "Read the docs" (solid) and "GitHub" (outlined). The phone bottom bar carries "Read the docs" while the header shows a solid "Try Hanzo": two solid asks on every phone screen. The close's solid button is a third verb, "Deploy to Cloud". On desktop no page ask follows you after the hero; only the header's "Try Hanzo" does.
5. **Every hover and press answers?** No. "Read the docs" (hero) and "Deploy to Cloud" (close): the hover only changes the border colour, which is invisible on a black button, and there is no press state. The split slider shows no hover. "See the request" answers well (press 0.97). The close's text links answer. Nothing responds to the pointer otherwise (no magnetic ask, tilt or preview).
6. **Overlap, font swap, layout shift?** None found. CLS 0 on both, h1 box steady, no horizontal scroll at 375.
7. **Which reference, and is its motion there?** apple.com product page: sticky chapters, yes. synchronized.studio card-open: no; "See the request" opens a sheet, which is the nearest. There is no hero figure for the anthropic-launch feel, even though the balances (−10,000 / 10,000 / 9,500 / 500) could be one.
8. **Different from its neighbours?** No. Same first screen as /metrics and the Cloud kit: a two-line 128px "Hanzo X" left, lede and buttons right, product strip on the fold, numbered chapters, one dark room, a "Get X" block.
9. **All 18 parts covered?** No; see below. `docs/coverage/ledger.md` is missing.
10. **Banned tells?** Yes:
   - Green accent (balances, Σ seals, chain highlight, slider, the dark room's mono glyphs), declared in the file as "accent emerald". This is a JAMES.md reject.
   - Red in "same key, different postings — caught".
   - A "DOUBLE-ENTRY LEDGER" eyebrow 23px above the h1.
   - Dead hover on the two solid buttons.
11. **Copy untouched?** Yes. Parity 55/55 text and 3/3 links. Additions are demo data (accounts, amounts, hashes, Numscript) plus labels such as "may go below zero", "a reversing transaction points back at the original" and "transaction 2, posted once". They paraphrase Hanzo's own sentences on the page, and none is a new claim.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. More than one solid button shows per viewport.
- **2.3 First impression:** with JS off, the hero lede, the "Money here only ever moves…" paragraph and the "Read the docs" button are invisible (15 hidden runs), which fails a P1 row. The phone fold has no product peeking (plan: ≥80px of app within 660px). The close is not a Band that repeats the hero ask.
- **2.4 Conversion:** 0 `data-cta`. The thumb bar's verb ("Read the docs") differs from the close ("Deploy to Cloud").
- **2.5 Proof:** no figure is staged, even though the balances could be one.
- **2.6 Content:** 51 text runs under 14px on phone (journal rows, labels).
- **2.7 Visual system:** emerald and red break the 0-hue override. The override's "status colour only with a shape or text cue" does not cover a whole-page accent.
- **2.8 Components:** 10 bare `:hover` rules. The solid buttons have no press state, and their hover changes only an invisible border.
- **2.9 Motion:** 2 `setInterval` timers. The self-posting book has no pause control (2.12, WCAG 2.2.2). Reduced motion settles.
- **2.11 Mobile:** the close's "Read the docs" and "View on GitHub" text links are 21px tall (plan: 44px), and the "hanzoai" chip is 40px.
- **2.12 Accessibility:** green figures "10,000" and "Σ 0" measure 4.1:1, under 4.5:1.
- **2.17 States:** no loading or failure state for the book or the splitter.
- **Coverage:** `docs/coverage/ledger.md` is missing.
- Passing: one h1, one main, no horizontal scroll at 320, no raw img/video/table, CLS 0.

## Fixes (in order)
1. **Strip the emerald and the red.** Use ink for balances and Σ 0, grey for the chain highlight and the slider, and an inverted ink chip for "caught". Contrast and weight do the work that colour did.
2. **Delete the "DOUBLE-ENTRY LEDGER" eyebrow above the h1.**
3. **Put the book on the first screen at both widths.** On desktop, bring it up beside or directly under the title so its four balances are visible at 801 high. On phone, show the title, one line, the ask and then the book. The long "Money here only ever moves…" paragraph moves behind the book or into chapter 1.
4. **One ask.** Use "Read the docs" in the hero, in a desktop sticky bar after the hero, in the phone bar, and as the one solid button in the close. "Deploy to Cloud" and "View on GitHub" become the text row.
5. **Make the solid buttons answer.** Give the hover a fill or ink shift plus an arrow nudge, and give the press scale 0.98. Give the slider thumb a hover state.
6. **Give the dark room an object.** For example, the book's journal row expanding per capability, instead of four stacked text items.
