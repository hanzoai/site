# /research — James-eye review
Ready: 2026-11-07, slice D — h1 arrives on CSS from first paint, filtering keeps the list's height (footer never jumps), Standards from 01, rail reads HIPs in the specs; phone caption, ask above 667, reduced-motion hydration and signature move were fixed in bb7920b4/f687922c and hold

Verdict: 7/10
First complaint: "On my phone the paper title under the buttons is one word per line, a skinny column running down the side. The big button sits just below the fold on a small phone. And the list still goes on and on."

Walked 7 Nov 2026 on localhost:4180 with Playwright Chromium, fresh. This is not a re-read of the earlier review.
- **1470×801:** I recorded video and took frames at 0.3, 0.8, 1.3, 2.5, 4 and 6 s with no input. I wheel-scrolled half a screen at a time with a 0.9 s dwell (16 steps).
- **Desk sheets:** I held the pointer on one for 4.8 s and checked which sheet was lifted every 0.8 s. I opened a sheet into its title page, then pressed Esc and checked where focus went.
- **Index:** I hovered a row and compared its box before and after. I used Show all, the kinds rail, an empty search with Clear, and the month filter. I traced layout-shift sources for each action.
- **375×812:** isMobile and hasTouch, smooth touch-style scrolling over 22 steps.
- **Other conditions:** reduced motion and JS off at both sizes, plus 320 px.
- **Scripts:** parity, taste and unique.

Stills are in `docs/review/research/`:
- `desk-hero.jpg`: the desktop first screen at 1.3 s.
- `desk-hover-mismatch.jpg`: the old name is kept, but it now shows the pointer holding Kai, which is fixed.
- `phone-hero.jpg`: the phone desk.
- `phone-caption.jpg`: the phone caption column.

## What works
- **The hero is fixed on desktop.** The desk of six typeset title pages now sits on the right half. "Work we publish" (52 px) sits on clean paper at the lower left, with the rule, the "Research" caption, the lede and one solid ask under it. Visually no glyph touches a sheet. (The h1 box touches the Cloud Economics sheet's box, but the empty part of the box, not the type.) The caption is one line ("01 / 06 Zen 6: Subquadra…") beside Pause, Previous and Next. It reads as one object on a quiet stage, editorial, osply-like.
- **Something moves within 1 s, and the pointer now owns the desk.** The newest sheet is raised at 0.3 s, and the next lifts at about 2.5 s. With the pointer held on Kai for 4.8 s, Kai stayed lifted and the caption stayed on "02 / 06" the whole time. Only one sheet is lifted at a time.
- **The card-to-page open is the best moment.** The sheet grows into its full title page (shared layoutId, 600 ms in-out) over a soft scrim. "Read on papers.hanzo.ai ↗" and Close sit under it. Focus goes to Close, Esc closes it, and focus returns to the same sheet's button.
- **The index is shorter and alive.**
  - Papers open on the newest six with "Show all 19" (31 rows when expanded).
  - The rail sticks. Its month ("Sep 2026", "Jun 2026") rolls through a line mask as you read.
  - Rows fill from the left on hover, and the mini sheet tilts. The row box is identical before and after hover (551, 322, 760×143).
  - Kinds filter correctly (Specifications shows 7 rows).
  - The month bars narrow the list ("Oct 2026" shows 1 row, with a removable chip).
  - The empty search shows "Nothing in the library by that name." and Clear works.
- **Counts agree now.** The tally reads 19 / 6 / 5, and the rail reads 30 / 19 / 6 / 5. The Oct 2024 bar sits behind a dashed break, so the time gap is honest. "When it was published" is now only an aria-label, not a visible h2.
- **The dark room enters as a rounded card and opens to full width.** The statement lifts out of grey as you scroll, and "github.com/hanzoai" is a white solid ask.
- **Clean numbers.**
  - Parity: 91/91 text and 34/34 links.
  - `taste.py` OK and `unique.py` OK.
  - No horizontal scroll at 1470, 375 or 320.
  - Untouched-scroll CLS is 0 at desktop and 0.010 on phone.
  - JS off at both sizes leaves 0 hidden text blocks.
  - Reduced motion holds the desk still, and `getAnimations()` is 0.

## The 11 answers
1. **Does it sell in 5 s, and does something move in 1 s?**
   - Yes on desktop. A lifted sheet is there at 0.3 s.
   - Under this machine's load, the h1's line-mask cut-in had not landed at 0.8 s. It was in by 1.3 s, so for most of the first second the screen shows a desk and a lede with no headline. On an idle machine it will be faster, but the headline should never be the last thing to arrive.
   - Phone: the three-sheet fan sits above the 40 px headline, and the lede and ask follow. The ask spans y 643 to 691, inside 812 but 24 px below the fold at 375×667. MASTER part 11 asks for the primary above the fold at 375×667.
2. **One thing in, one out, or a document?**
   - Desktop is close: desk, then tally and bars, then the index with a sticky rail and a rolling month, then the dark room.
   - Phone is still a document in the middle. Each row is about 240 px tall, so the index runs about 7 screens even folded (page height 8,904 px). The 2×2 kinds grid scrolls away, and the rolling month is hidden.
3. **A real visual object in every section?** Hero: the desk, yes. Glance: the 19 and the bar chart, yes. Index: the mini sheets plus the rolling month and the rail, which is acceptable. Dark room: type only, but the word reveal is the object.
4. **One ask, nothing floating, scale rhythm?**
   - Desktop header: the ask becomes "Explore papers.hanzo.ai" after the hero, which is right. On phone the header keeps "Try Hanzo" (shared).
   - Floating: nothing page-level floats. The cookie card is shared chrome.
   - Rhythm is good: 52 px h1, the desk as the big thing, 19 as the moment, 6 and 5 medium, 17 px rows.
   - Space is still heavy: about 150 px of white between the glance and the index on both sizes.
   - Two white solids share the dark-room screen (the header ask and github.com/hanzoai). That is the shared header issue (`_shared.md` §1) and is not held against the page.
5. **Does every hover and press answer?** Yes: sheets lift and hold, rows fill, ↗ links turn ink, kinds and bars fill, and the deal controls press. None of it jumps.
6. **Overlaps, font swap or layout shift?**
   - No font swap. Untouched CLS is 0 on desktop and 0.010 on phone.
   - Desktop: no overlap of text or controls with the desk.
   - Phone: the fanned sheets cover each other's titles ("Zen 6: Su… Ultra-Lor…"). That reads as a desk, not a bug.
   - **Phone caption:** the caption below the hero is squeezed into a 150 px column beside three 44 px buttons. "Kai: Calibrated Discrete Decision Intelligence for Autonomous Agent Loops" runs one word per line, eight lines tall (`phone-caption.jpg`). It looks broken.
   - **Filtering moves the page:** choosing a kind or typing a search with no results collapses the list. The footer jumps up into the viewport: one shift of 1.0 sourced to FOOTER, and 0.48 on "All". It is user-caused, but it feels like the page fell over.
7. **Which reference, and is its motion there?** The desk is osply.co or hamol.studio editorial, and it is now pointer-aware. The open is synchronized.studio and lands well. The pinned index with a changing month is a light apple.com touch.
8. **Different from its neighbours?** Yes. The hero medium (a paper desk) and the signature (the sheet that lifts and opens into its title page) are the page's own, and `unique.py` passes. The dark-room word reveal is still the same move /philosophy and /press use. It is now supporting rather than the signature, which is acceptable.
9. **All 18 parts covered?** The card has 18 headings, each with `Done here:` filled, but parts of it are stale (see Card check).
10. **Banned tells?** No hue, gradient text, Inter, emoji, stripe, browser-default control, or label above a headline. "Research" is a caption under the h1.
11. **Copy untouched?** Parity is 91/91. One new visible UI string is not in `content/ui-strings.json`: the search placeholder "Find a paper or a HIP". The same applies to "Nothing in the library by that name." in the empty state. "Show all" is in `ui-strings.json`.

**It works?** On clean default loads there are no errors. **Under reduced motion there is a deterministic hydration failure**, two loads out of two: "Hydration failed because the server rendered HTML didn't match the client", with the red "1 Issue" badge.
- The diff points at `Open()` in `Research.jsx`. `calm ? <>{OPEN_A} …</> : <>…Word spans…</>` renders a plain string on the client but `xrs-w` spans on the server.
- The shared `MaskLines` and `SceneWipe` also differ on that branch.
- During the busy walk, the default load also showed one "attributes didn't match" error with the badge. That matches `_shared.md` §3 and is not held against the page.

## Card check
`docs/coverage/research.md` has 18/18 headings with `Done here:` filled. These claims no longer match the page:
- **Part 9:** "Signature scroll word reveal". The page's header comment and `app/research/page.jsx` now say the signature is the desk and the open.
- **Part 11, layout:** "Phone desk is two loose rows of three sheets". It is now one fan of three.
- **Part 11, ask:** "Primary ask above the fold at 375". It is at 812 tall, not at the 375×667 MASTER asks for.
- **Parts 9 and 17:** they claim reduced motion is clean. Under `reducedMotion: 'reduce'` the page throws a hydration error and shows the red badge.
- **Part 18:** the "Review read" box is unticked.
- Per `_shared.md` §2, a false claim caps the page at 7.

## To reach 8
1. **Fix the reduced-motion hydration error.** In `Open()`, render the same word spans on server and client, and let reduced motion set their opacity to 1 (CSS under `prefers-reduced-motion`, or a style computed after mount). Do not swap the tree on `useReducedMotion()`. Check under `reducedMotion: 'reduce'` that the red badge is gone.
2. **Fix the phone caption.** Under 900 px, put the deal controls on their own row (Pause, Previous and Next right-aligned). Under them, give the caption the full width as a single line, number plus title, clamped to 2 lines.
3. **Lift the phone ask above 667.** Trim the gap between the fan and the h1 (about 88 px now) and shorten the fan by about 30 px, so "Explore papers.hanzo.ai" ends at or above y 640 at 375×667.
4. **Make the phone index feel less like a document.** Tighten phone rows to about 140 to 160 px by putting the date inline with the title rather than on its own line. Make the 2×2 kinds rail and the rolling month a slim sticky strip under the header, so something changes as you read.
5. **Stop filtering from collapsing the page.** Give `.xrs-list` a min-height equal to its pre-filter height while a filter is active (or at least 100svh), so the footer never jumps into view.
6. **Correct the card** (parts 9, 11, 17 and 18) to match what the page does now. Request "Find a paper or a HIP" and the empty-state sentence in `docs/requests/research.md` for `ui-strings.json`.
7. **Small ones:**
   - Cut the white between the glance and the index by about half.
   - When the reader is in Specifications or Standards, the rail month should drop to blank or "HIPs" instead of keeping the stale "Jun 2026".
   - Number Standards from 01, not 00 (the 00 belongs to the "All HIPs" index row only).
