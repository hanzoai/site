# /research — James-eye review

Verdict: 6/10
First complaint: "The top is a pile of paper with the headline sitting on top of it. Things overlap, the little caption is reading a different paper from the one I'm pointing at, and once you scroll past it, it's just a long list."

Walked 7 Nov 2026 on localhost:4180 with Playwright Chromium. At 1470×801 I recorded video, took frames at 0.3, 0.8, 1.3, 2.5, 4 and 6 s with no input, then wheel-scrolled half a screen at a time with a 0.9 s dwell (20 screens). At 375×812 (isMobile, hasTouch) I did the same with 27 screens. I hovered desk sheets, rows and ↗ links, opened a sheet into its title page, and used Esc. I tried the kinds rail, an empty search with Clear, and the month filter. I also loaded the page with reduced motion and with JS off at both sizes. Then I ran parity, taste and unique. Stills are in `docs/review/research/`.

## What works
- **The idea is right for the page.** The hero is a desk of six real title pages, typeset in HTML from Hanzo's own titles, dates and subtitles. It is an object, not an icon. A sheet lifts within 0.9 s with no input, then another every 1.6 s, and the cycle has its own Pause.
- **The card-to-page open is real.** A desk sheet or a row grows into its full title page (shared layoutId, 600 ms in-out). Focus moves to Close, Esc closes it and focus comes back. "Read on papers.hanzo.ai ↗" sits under the sheet. It is the best moment on the page.
- **The Beyond aid works.** Press a month bar and the page scrolls to the index, which narrows to that month (Jun 2026 showed 7 rows). A removable month chip appears and the kind counts update. The empty state has a Clear button.
- **The rows answer.** Hover fills the row from the left and tilts its mini sheet. The ↗ link turns ink with white glyph. Nothing jumps (the row box is identical before and after hover).
- **The dark room enters as a rounded card and opens to full width.** The statement lifts out of grey word by word.
- **Clean numbers.** Parity is 91/91 text and 34/34 links, taste OK, unique OK. CLS is 0.0005 at desktop and 0.0004 on phone. No horizontal scroll at 375. I saw no errors on single loads (3 clean loads). The "1 Issue" hydration badge showed only during the busy walk, as `_shared.md` §3 describes. JS off is fully legible, and reduced motion holds the desk still and shows the statement in full.

## The 11 answers
1. **Does it sell in 5 s, and does something move in 1 s?** Movement, yes: a sheet lifts at 0.9 s. Selling, only partly. The h1 cuts in late (not visible at 300 ms) and lands on top of the "One Native Stack" sheet. "we" sits over that sheet's left edge (`desk-hero.jpg`). The right-hand caption block (01 / 06, a 4-line bold title, a 4-line subtitle, three round buttons) is crowded and right-aligned. It also sits over the AIVM sheet, so you read fragments ("Aug", "(M)", "ative") around it. The first screen reads busy rather than one big thing on a quiet stage.
2. **One thing in, one out, or a document?** Desk, then tally and chart, then the dark room: that part works. But the index is 31 rows in one long column, about five full screens at 1470 and eleven on the phone. Nothing changes while you read it except a hover fill. It is a document in the middle of the page.
3. **A real visual object in every section?** Hero: the desk, yes. Glance: the 19 and the bar chart, yes. Index: only 46px mini-sheet glyphs repeated 31 times. Dark room: type only.
4. **One ask, nothing floating, scale rhythm?** The header ask becomes "Explore papers.hanzo.ai" once you scroll, which is good. No page-level float. The rhythm is fine: 52px h1, 19 as the moment, 6 and 5 medium, rows at 17px. But the glance section has huge dead air: about 250px of empty white above the chart and about 300px below it before the index starts (frames s01 and s02).
5. **Does every hover and press answer?** The rows, ↗ links, kinds and bars do. **The desk does not.** Pointing at a sheet lifts it with CSS, but the timer keeps running. I held the pointer on "Cloud Economics" for 5 s and the caption moved from 02 to 03 to 04, lifting other sheets. At one point two sheets were raised at once while the caption named a third (`desk-hover-mismatch.jpg`). Only keyboard focus takes the desk over (`onFocus={pick}`). There is no `onMouseEnter`.
6. **Overlaps, font swap or layout shift?** No shift and no font swap. **Overlap, yes, at both sizes.**
   - Desktop: the h1 glyphs sit over a sheet's edge, and the caption sits over the AIVM sheet (198×3px measured; visually the AIVM sheet's text shows around the caption).
   - Phone (`phone-hero.jpg`): six sheets are crammed into 340px, and the titles are clipped mid-word ("en 6: ubquadratic ltra-Long", "ai: Calibrated iscrete"). The top row starts at y=68, touching the 60px header. The bottom row runs to y=412, under the h1 that starts at y=339.
   - JAMES.md: "Overlap: hero card, buttons and nav overlapping at 1470×801 or at 375×812" fails.
7. **Which reference, and is its motion there?** It wants to be osply.co or hamol.studio editorial, with a playful desk and pointer-aware details. The card-to-page open is properly synchronized.studio. The pointer-awareness is missing: the desk ignores the pointer, as question 5 shows.
8. **Different from its neighbours?** The hero medium (a paper desk) is its own. **The signature is not.** The scroll word reveal of a statement in the dark room is also the declared signature of /philosophy ("the belief statement reveals word by word as you scroll, ink rising out of grey") and of /press. MASTER §4 says never reuse a taken signature. The V2 header line is near word-for-word Philosophy's, and that reads as a template. `unique.py` passes, but James would see three Story pages ending the same way. PAGES.md lists /research as "hover previews of each abstract", and `app/research/page.jsx` claims "the title page of the row under your pointer follows it as a tilting live preview". Neither exists.
9. **All 18 parts covered?** The card exists with 18 headings and filled `Done here:` lines, but several claims are false (see Card check).
10. **Banned tells?** No hue, gradient text, Inter, emoji or stripe, and no browser-default controls. The eyebrow "Research" is under the h1, not above it, so that is fine. Two solid fills share the dark-room screen (the header ask and github.com/hanzoai, both white). That is the shared header issue and is not held against the page.
11. **Copy untouched?** Hanzo's copy is all there (91/91). New strings were added that are neither Hanzo's nor in `content/ui-strings.json`: the h2 "When it was published", the placeholder "Find a paper or a HIP", "Nothing in the library by that name.", and "Previous paper" / "Next paper". The h2 is the visible one. MASTER gate 4 says new UI strings come only from `ui-strings.json`. There is also a count mismatch on screen: the tally says **6** Specifications and the rail says **7** two screens later (the "All HIPs" index row is counted in one and not the other).

## Card check
`docs/coverage/research.md`: 18/18 headings, `Done here:` filled. These claims are false:
- Part 12: "stops when a visitor points at a sheet". It does not; only focus stops it (verified, the caption kept cycling under a held pointer).
- Parts 3 and 11: "375×812 and 1470×801 pass with no overlap" and "the 52px headline over its lower left". The headline sits over sheets at both sizes, and phone sheet titles are clipped mid-word.
- Part 7: "Differs from neighbours". The hero does, but the signature is /philosophy's and /press's.
- The header comment in `app/research/page.jsx` (Signature: pointer-following tilting preview) contradicts `Research.jsx` (Signature: scroll word reveal) and PAGES.md.
- Per `_shared.md` §2, a false claim caps the page at 7. The overlap puts it below that.

## To reach 8
1. **Clear the hero.** Keep the desk off the headline. Either confine the six sheets to the top 55% with the h1, lede and ask on clean paper below, or shrink the desk so its lower-left quadrant really is empty, so no glyph of "Work we publish" touches a sheet edge. Take the right-hand caption out from over the AIVM sheet: one line (number and title), not a 4+4-line block, sitting below the sheets.
2. **Fix the phone desk.** Six sheets at about 135px wide cannot hold a title, so they clip mid-word. Use three sheets in one fanned row, or one sheet large with the others peeking behind it. Keep a 24px gap below the header and keep it clear of the 40px h1.
3. **Let the pointer own the desk.** `onMouseEnter` on a sheet should do what `onFocus` does: stop the timer, lift that sheet only, and switch the caption to it. When the pointer leaves, resume after a beat. Only one sheet should be lifted at a time.
4. **Give the page its own signature.** The word reveal belongs to /philosophy. Make the desk the signature (a sheet lifts off and opens into its title page), as PAGES.md and `page.jsx` already promise. Then demote the dark-room reveal or change it, for example the statement typed in once, or the github link drawing an underline. Align the three header comments and the card.
5. **Break up the index.** Thirty-one rows in one column is a document. Show Papers grouped by month as a short list with the rest collapsed behind "All 19", or pin the rail and let the month heading cross-fade as each month passes, so something changes while you read. On phone, the 2×2 kinds rail should stick under the header.
6. **Small ones:**
   - Make the 6 and 7 Specifications counts agree.
   - Cut the empty space around the glance section by half.
   - Space the Oct 2024 bar to show the time gap (or mark the break), since it currently sits a month's width from Jun 2026.
   - Request "When it was published" and the search placeholder in `docs/requests/research.md` for `ui-strings.json`, or render that heading as an `aria-label` only.
