# /ledger — James-eye review

Verdict: 7/10
First complaint: "I pressed 'See the request' and the calculator's sitting on top of the panel, and the panel's tucked under the header. Things are overlapping. It's not finished."

Walked: 2026-11-07, 16:58 to 17:20 UTC, dev server on :4180 (warmed with curl first). Desktop 1470x801 with a fine pointer emulated over CDP (`matchMedia('(hover: hover)')` true), video recorded, wheel-scrolled one real screen at a time (801px in 6 steps, then a 0.9 s dwell, then a 1.2 s idle frame diff on every screen). Phone 375x812 (isMobile, hasTouch), scrolled one real screen (812px) at a time with the same dwell and idle diffs. No Pause was pressed during the idle checks. Also: hovered every control and pressed Pause, the capability tabs, the "See the request" sheet (opened, then Esc), the slider and Copy; tapped a journal row, the sheet and a tab on phone; ran a 40-stop Tab crawl; tested 320x700, reduced motion and JS off; measured the first second on three fresh loads; took screenshots of the neighbours /payments and /jin. I sent no forms. I read Ledger.jsx and Ledger.css. Scratch work is in `/tmp/claude-0/-home-user-hanzo-site/6caedeaa-53b0-5e08-a8b1-5e1fef4c9934/scratchpad/ledger-critic/`.

## The 11 answers

1. **Sells in 5 s, moves in 1 s: yes, narrowly.**
   - The h1 "Hanzo Ledger" sits at 52px, top at y=178. Next to it are the lede, "Read the docs" (solid, y 399 to 447) and the live book (four account balances and a journal). It reads at once as "a ledger, posting".
   - The h1 line-mask cut-in (`.bz-lines.now`, 0.7 s) runs from first paint.
   - The book's first self-driven change comes about 2.0 s after DOMContentLoaded on all three loads (2391 to 4410 ms, 3881 to 5966 ms, 2220 to 4409 ms). So the only movement inside the first second is the h1 cut-in. The book starts on frame 2 of 4 and holds it for 1.5 s.
   - The book is 593px tall from y=218, so its bottom (the black note bar) lands at y=811, under the fold at 801. The next section does not peek in; MASTER part 3 asks for a 56px peek.
2. **One in, one out: mostly yes.**
   - Desktop: the chapters are a pinned stage, and one scene swaps per chapter (posting, then hash chain, then idempotent retries) while the words change on the right. After that come the dark capabilities room (one tab panel at a time), the splitter, a quiet "Get Ledger" receipt, and a black Band that opens from 0.94 to full width.
   - Phone: the chapters stack one per screen, and each scene idles by itself.
   - Weak spot: on desktop chapter 1 there is about 150px of empty white between "Every cent lands somewhere" (y=256) and the scene. It reads as a hole, not as room around the scene.
3. **A real object in every section: yes.**
   - Hero: the book.
   - Chapters: the posting diagram with a running dot, the tx chain with sha256 tags and a back-arrow, and three retry rows with sweeping hairlines.
   - Capabilities: the Numscript code with its output rows, 10000 USD/2 to 100.00 USD, and balances with Σ.
   - Numscript: the working splitter.
   - Get: the receipt and the agent prompt.
   - Band: type only, which is fine for a closing Band.
4. **One ask, sticky header, scale rhythm: desktop yes, phone no.**
   - Desktop: while the hero ask is on screen, the header ask is an outline "Try Hanzo". Once you scroll, it becomes a solid "Read the docs" in the sticky header. I found one solid on each screen. Nothing of the page's own floats over content.
   - Phone: the header ask stays **"Try Hanzo"** (solid black from screen 1 onwards), while the page's ask is "Read the docs". So two different solid asks take turns.
   - Scale is fine at both sizes: h1 52/40px, section heads 26px, figures 32 to 64px (the Σ 0 seal is 64, the amount input 64), captions 12 to 14px. No screen has everything big.
5. **Every hover and press answers: yes, with one exception.**
   - Journal row: the fill goes from #f2f2f2 to #fff with a 1px ink ring, and the note reads it back ("tx 1 · @world · @users:001 · Σ 0").
   - Account: the fill turns #e4e4e7 and the note reads "@merchants:042 · 9,500 · tx 2". A tap pins it on phone (confirmed).
   - Pause: the fill changes to #f5f5f5, the press scales to 0.97, and the book holds still for 4.5 s (confirmed).
   - Tabs: the label colour changes from #a3a3a3 to #fafafa, and the pill glides (layoutId).
   - GitHub and arrow links: the arrow moves 4px and an underline appears.
   - Deploy row: the arrow moves (6, -6).
   - Copy: a ring appears. Band CTA: the fill changes. The slider thumb scales to 1.08.
   - No layout jumps (desktop CLS 0.0005, phone 0.0002).
   - The exception is the "See the request" sheet. It opens, but on desktop it is broken (see 6).
6. **Overlaps, font swap, layout shift: one hard overlap.**
   - **Desktop, sheet open:** the `.ld-split` card (the splitter) paints on top of the open sheet and its scrim. The sticky header also sits over the sheet's title row.
   - Cause: `.ld-nsec-copy` is `position: sticky`, which creates a stacking context. The sheet's `z-index: 950` is trapped inside it, and the later sibling `.ld-nsec-obj` wins. The same sheet on phone is fine, because `.ld-nsec-copy` is static under 900px.
   - No font swap; the h1 box is stable. At 320 the document scrollWidth is 320, so there is no horizontal scroll.
   - On phone the journal's account names cut off with an ellipsis inside the hero object ("@users:0…", "@merchan…", "@platform…"). It looks cramped.
   - **Console:** 2 of 7 fresh loads logged a React hydration-mismatch error ("A tree hydrated but some attributes of the server rendered HTML didn't match"), and the Next.js "1 Issue" badge showed on screen. The other 5 loads were clean. I could not pin it to a Ledger element, so it may come from shared chrome, but on this route it fails "no console errors".
7. **Reference: apple.com product page.** Its pinned stage where one panel changes is here and working, and so is the product as the hero. A little of the motion.dev state work shows (the gliding tab pill, the popLayout balance roll). Nothing of synchronized.studio (no Morph), which is fine for this page type.
8. **Different from its neighbours: yes in medium, close in layout.**
   - The hero medium is a live data UI. /payments has a centred h1 over a phone mock; /jin has a research figure.
   - The hero layout is close to /jin's: h1 left, "Read the docs" plus a GitHub link, then a hairline and a paragraph, with the object on the right. The Biz grammar (BizChapters, BizSheet, BizPaste) is shared with Payments, Flow and Captable.
   - The signature itself (a book that balances itself, then "split it yourself") is its own.
9. **18 parts: mostly covered; see the next section for the gaps.**
10. **Banned tells: none found.**
    - No hue: `taste.py` OK, and the accent is `--acc: var(--bz-ink)`.
    - No gradient text, no Inter, no stripe, no pill above an h1 or h2. "CAPABILITIES" sits beside its h2, not above it.
    - No three equal icon boxes; the capabilities are one tabbed object.
    - No cursor label, and no buttons that fade on hover.
    - The large "send" / "USD/2" glyph sits above an h3 (not an h1 or h2) and is `aria-hidden`. That is acceptable.
11. **Copy untouched: yes.** `parity.py /ledger` gives text 55/55 and links 3/3.

## Missing from the 18 parts

- **Part 4 / 3.2 rule 6:** the phone header ask is "Try Hanzo" while the page's ask is "Read the docs", so the two do not match. On desktop the header swaps correctly.
- **Part 8:**
  - BizSheet is a `div role=dialog`, not a native `<dialog>.showModal()`.
  - On desktop it breaks the z scale (sheet 90 / header 40): the header and the splitter both paint over it.
  - The coverage card's ticks for "Dialogs are native" and "1470x801 pass with no overlap" are therefore not true.
- **Part 3:**
  - There is no 56px peek of the next section at 1470x801, because the book runs past the fold.
  - The coverage card ticks "Ends in proof strip". In fact the page ends receipt, then Band, then footer, with no proof strip. That is acceptable if the live page has no proof (the live copy has only licence and GitHub), but the tick should say n/a.
- **Part 1 / 3:** the h1, primary and object fit. The first self-run book change comes at about 2 s; it should start inside 1 s.
- **Part 17 / DONE 3:** intermittent hydration error and the "1 Issue" badge.
- **Part 9:** sound was not verified in this walk, and I did not trigger the audio kit.
- **Part 11:** I found no target under 44px. The ellipsis truncation in the phone journal is a craft gap.
- **Idle:** the "Get Ledger" screen (desktop screen 7, phone screen 7) has an idle frame diff of 0.0000. Nothing moves there at rest; it is the one dead screen in the page body.

## Fixes (in order)

1. **Unbreak the sheet on desktop.** Free the sheet from the sticky stacking context, using one of these:
   - render BizSheet's `.bz-sheet-wrap` through a portal to `document.body`;
   - add `.ld-nsec-copy:has(.bz-sheet-wrap[data-open='true']) { z-index: 950; }`;
   - drop `position: sticky` from `.ld-nsec-copy`.

   Then confirm at 1470x801 that, with the sheet open, the sheet's title row sits fully above the header, and that the scrim covers both the header and `.ld-split`.
2. **Find and kill the hydration mismatch.**
   - Reload /ledger 10 times and log the full React diff.
   - Suspects: the `data-ask-on=""` attribute that the server renders on `<main>` and the IO effect then removes, and the header ask swapping "Try Hanzo" to "Read the docs" from `data-ask-name`.
   - If it is shared chrome, write it up in `docs/requests/ledger.md`. The "1 Issue" badge must not appear.
3. **Phone header ask: same words as the page.** Make the header ask read "Read the docs" on phone too, as it does on desktop (the `[data-ask-name]` swap is not applied under 900px). Or outline the header "Try Hanzo" whenever the page's own solid is not on screen. Never show two different solid asks.
4. **First second:** start the book's film one beat earlier.
   - Either begin at `f = 1` with the first timeout at about 600 ms, or fire the first step on `seen` after 500 ms. Then a balance rolls inside 1 s.
   - Shorten the book on desktop so its note bar ends above about 745px and the chapter section peeks 56px. For example, `.ld-journal { min-height: 392px }` → about 330px, and trim `.ld-hero` top padding from 120px to 96px.
5. **Phone journal truncation.** Under 900px, stack each posting as two lines: "@users:001 →" on one line, then "@merchants:042  9,500" on the next. This replaces `.ld-posts p` with `grid-template-columns: 1fr auto` and `span` on its own row, so no account name ends in "…" inside the hero object. Do the same for `.ld-posting` in the splitter ("@merchants…", "@platform:f…").
6. **Close the hole on desktop chapter 1.** Cut the gap between `.ld-ch-h` and the scene, either with `.ld-scenes { height: min(56svh, 520px) }` or by aligning the scene to the top, so the scene sits about 48px under its heading.
7. **One quiet idle on the Get screen.** Make the `.cf-caret` in the agent prompt blink (opacity 1 to 0, step-end, 1.1 s), or draw the `.ld-rc-sum` 2px rule once on enter (900 ms hairline). Freeze both under reduced motion.
8. **Correct the coverage card:** part 8 (dialog is not native), part 11 (overlap at 1470x801 with the sheet open), part 3 (proof strip is n/a, not done).
