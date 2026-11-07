# /grants — James-eye review
Verdict: 7/10
First complaint: "I clicked a different track and nothing showed which one I'd picked. There's just a little white line next to the words. And for most of the page the top button says Try Hanzo, not Apply for a Grant."
(walked 7 Nov 2026, HEAD d7ce999c, at 1470×801 and 375×812, plus 375×667 and 320×700. Moving: arrival bursts at 100/300/600/1000 ms, idle hashes of the hero field, wheel steps of 300 and 400px with 350 to 450 ms dwells, hover and press on every control, taps on the phone, a tab crawl, reduced motion, JS off. api.hanzo.ai was intercepted; the only submit was an empty-summary one that stopped at validation.)

## What works
- The round-4 fix landed. "Apply for a Grant" is now `href="/grants/#apply"` with no `target`. A click kept 1 page and scrolled to the form (`#apply` top at 76px). The three sheet asks stay in the tab too and pick their track: clicking "Apply as OSS Contributor" set the track to "Open Source Contributor Grant".
- The phone header no longer clips. "Try Hanzo" runs x 262 → 352 at 375 and at 320. The page has no horizontal scroll at 320 (scrollWidth 320); the only element past the edge is part of the shared header.
- Arrival: the h1 is 52px Zen 497 and sits at y 280–395. The ask's bottom is at 606, and the contour field changes between idle frames with no input (hash b2b9 → 1d0a). The pause button is 44×44 and fills on hover (#fff → rgb 245,245,247); once paused, the field holds still.
- How grants work is still the best "one comes in" moment. The line is scrubbed by scroll (scaleX 0.24 → 0.69 → 1) and the steps light 1 → 3 → 4.
- The stacked sheets are real. 01 shrinks to 0.92 while 02 slides over it and pins at 120, then 03 pins at 422 → 61. The 64px "2,137+" figure gives sheet 01 its object.
- Ledger rows answer hover: `::before` goes 0 → 0.99 and the tick redraws (stroke-dashoffset 0 → 3.7px).
- The hero ask goes #0a0a0a → rgb(44,44,46) on hover and to scale 0.98 on press, with 0.4px of vertical movement.
- The form validates well. An empty summary focuses `summary` and shows "Please fill in your name, email, and project / research summary." The filing card fills as you type ("Test Person", "x@example.edu"). Privacy Policy sits beside the submit.
- Reduced motion shows the final state: the sheets have transform `none`, there are no dim layers, all 4 steps are lit, and the frames hold still. The only two animations are `xp-cut` at 0.001 ms, already finished.
- JS off: 0 hidden headings, paragraphs or links.
- CLS: desktop 0.0017 (all of it from the shared header cluster), phone 0. There were no page errors on desktop. Parity is 57/57 text and 5/5 links; `taste.py` OK, `variety.py` OK.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. h1, lede and ask are in the first screen at both sizes. On phone the h1 is 40px in 3 lines and the ask's bottom is at 447 at 375×667. The field moves untouched.
2. **One in, one out?** Mostly yes: the scrubbed timeline, then the stacked sheets. There is still about 180px of air above "What Grant Recipients & Interns Receive" and about 120px below the ledger, and the ledger reads as text rows.
3. **A real object in every section?** Hero: the contour field. How: the line and dots. Receive: ticks beside text, still the weakest. Sheets: the figure and chips. Apply: the filing card. The form's own track control is visually broken (point 5).
4. **One ask, sticky; scale rhythm?**
   - **Desktop header:** "Try Hanzo", outlined, from the end of the hero (y 781) to y 4291. It only becomes "Apply for a Grant" at y 4562, inside the form.
   - For about 3,500px of scroll, no solid ask is on screen and the header carries a label that is not this page's ask.
   - **Phone header:** "Try Hanzo" turns solid after the hero, which the card admits.
   - Scale: 52 / 26 / 21 / 64 / 32 holds.
5. **Every hover and press answers?** Every button and link does. **The Program Track radiogroup does not show its selected state.**
   - `.xgr-track-bg` measures 2×20px with `position: relative`, at 1470 and at 375.
   - It renders as a thin white sliver at the left of the selected label (visible in `d-form.png` at x 717, and on phone).
   - Clicking a track leaves it at 2px wide (6 samples over 360 ms), so there is no glide.
   - Cause: `Grants.css:125` `.xgr-tracks span { position: relative; }` (0,1,1) beats `Grants.css:126` `.xgr-track-bg { position: absolute; inset: 0 }` (0,1,0).
   - The only remaining cue is the text colour: ink against `--soft`.
6. **Overlap, font swap, layout shift?** No font swap. Layout shift is negligible. No page-owned overlap; the shared cookie card covers the lower part of the screen on a first visit. On 1 of 6 phone loads the dev "1 Issue" badge showed a hydration-attribute mismatch. It did not reproduce in 4 dedicated loads; the last review traced it to the shared footer.
7. **Which reference, and is its motion there?** The apple.com chapter stack (the pinned sheets scale 1 → 0.92 and dim) and the apple-like scrubbed timeline are present and measured. There is no editorial asymmetry; every section uses the same heading-left grid.
8. **Different from neighbours?** Yes: the stacked sheets, the scrubbed timeline and the filing card belong to this page. The hero (a contour field in a grey card) is the shared Sigil look.
9. **All 18 parts?** Not all. There is no proof strip or `Band` at the end (left open on the card), and the card has false lines (below).
10. **Banned tells?** None hard. The hero is an outlined card, but it moves. The dark room does not "enter as a rounded card and open to full width": it is full-bleed at once.
11. **Copy untouched?** Yes: parity 57/57 text, 5/5 links.

## Card check (docs/coverage/grants.md)
- TRUE:
  - one h1 at 52px; sheet numbers 64 and titles 32;
  - parity 57/57, `taste.py` passes;
  - in-page asks stay in the tab (0 new tabs);
  - the field moves within 1 s and has a pause;
  - reduced motion shows the final state;
  - JS off is legible;
  - Privacy Policy sits beside the submit;
  - the first bad field takes focus;
  - the phone header no longer clips;
  - no scroll at 320;
  - `data-cta` ids are present;
  - the sheet asks set the track.
- **FALSE**, part 9 "State: the track chip glides" and part 8 "the track radios glide": the chip is 2px wide and never moves.
- **FALSE**, part 4 "desktop: the header carries 'Apply for a Grant' after the hero": it reads "Try Hanzo" from y 781 to 4291 and only switches inside the form, at y 4562.
- **Partly false**, part 8 "Every control has hover, press, focus-visible…": the track radios have no visible selected state.
- Part 7's literal radii are admitted (unticked), so that line is honest.

The false claims cap the verdict at 7. Otherwise the page is close: fix the chip and the header label and it can reach 8.

## Fixes (in order)
1. **Track chip:** in `components/pages/Grants.css`, change line 125 to `.xgr-tracks button > span:not(.xgr-track-bg) { position: relative; }`, or raise line 126 to `.xgr-tracks .xgr-track-bg { position: absolute; inset: 0; … }`. Check it is 201×50 at 1470 and 333×44 at 375, and that clicking track 3 glides it in 300 ms ease-emphasis.
2. **Header ask:** make `usePhoneAsk` (page-local) swap the header to "Apply for a Grant" as soon as `[data-cta="grants.hero"]` leaves the viewport (desktop y ≈ 650), not when the form arrives. Keep it outlined while the submit is on screen and solid otherwise, so the page always has one solid ask. Then correct the part 4 line on the card.
3. **Card:** correct parts 8 and 9 (the chip), and part 4 (when the header swaps), after fixing.
4. **Closing:** add one quiet proof line after the form, before the footer, in the page's own words (for example the 2,137+ · 122 organizations figure), or note on the card why there is no `Band`. Also trim the space around the ledger: `.xgr-gets` padding-top about 116px instead of the current ~180px of air.
5. **Optional, for 8+:** let the dark room enter as a rounded card inside the gutters and open to full width as it is reached (MASTER 3.1, rooms).
