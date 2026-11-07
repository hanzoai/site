# /blog — James-eye review

Verdict: 7/10
First complaint: "On my phone the posting chart stops at July. October, the month the list is actually showing, is cut off the side and nothing tells me to swipe."

Walked 2026-11-07 16:51 UTC, HEAD f95f77b1, at 1470x801 and 375x812, plus 320x812 (first screen at 0.2/1/3/6 s, reload, wheel-scrolled the whole page in 160px notches, hovered and pressed the ask, cover tabs, pause, trio cards, rows, month bars, both "All 24" controls; tapped tabs and bars on phone; reduced motion; JS off; taste.py and parity.py).

## What works
- The first screen is alive with no input. The cover story auto-advances (01 → 02 in about 7 s) with a timer line under the active tab. A black curtain wipes the plate, the headline cuts up into its line, and the Sigil contour plate drifts. Hovering a tab jumps straight to that story. Pause stops it (aria-pressed true, icon becomes play) and resumes correctly.
- Scale rhythm: the h1 is 52px, the cover headline 32px and the tab titles small. The trio is one big film card with two smaller ones, not 3 equal boxes. "24" is the one big figure in Contents.
- Real objects in every section: the contour plate, three Hanzo model films in the trio, the monthly publishing strip (bars grow in, then a silver sweep runs across them on idle), and the month-grouped index.
- The controls answer. Clicking a month bar swaps the list with a slide (Jun → June's 3 posts). "All 24" opens every month (Oct to Feb, 24 rows). On row hover the title nudges and the dotted leader draws. On the ask, hover lightens the fill (#0a0a0a → #2c2c2e) and press scales to 0.98, so it doesn't just fade.
- One ask: the header shows outlined "Try Hanzo" while the hero's solid "Read the latest" is on screen, then swaps to a solid "Read the latest" once you scroll. The close is the page's own "Every post".
- No hue, no gradient text, no pill above the h1 (the "BLOG" mono label sits beside the lede, not over the h1). taste.py OK on 4 files; parity 95/95 text, 29/29 links.
- Reduced motion shows the final state (h1, cover 01, bars at height, no curtain). JS off is fully legible: the hero, cover 01 and all 24 rows show, and the dead controls are hidden.
- No console errors or page errors from this page at any size. No horizontal page scroll at 375 or 320.

## The 11 answers
1. Yes, it sells in 5 s ("News & Guides." plus a live cover story), and the plate and timer move within 1 s. The h1 cut-in leaves the masthead empty for the first ~0.5 s, while the cover block is already painted.
2. The top half works: the hero gives way to the trio films, which give way to the strip. Contents is a document by design (a long index), but the default shows only October, so it stays short until you ask.
3. Yes: plate, films, chart, index.
4. One ask in Hanzo's words in the sticky header, and nothing of the page's floats over content (the cookie bar is shared). Rhythm is good. One slip: when "All 24" in the strip is active it turns solid black, so it and the header's solid "Read the latest" make 2 solid fills in one viewport.
5. Yes, everything answers. The trio card moves about 17px between scroll-in and hover (scroll parallax settling), which is a drift, not a jump.
6. No overlaps on desktop. On phone the publishing strip is a hidden-scrollbar rail: at 375 it shows Feb to Aug and clips Sep and Oct (scrollWidth 444 vs 343). At 320 it shows Feb to Jul only. The newest months are the ones off screen, with only a 2px sliver as a cue. No font swap or h1 shift was seen.
7. An editorial magazine cover (osply / grubogrubo restraint) with an Apple-style timed carousel. The curtain wipe and the line cut-in are present and authored, not fade-ups.
8. Yes. The cover-story carousel with its contour plate and the publishing strip are its own; no home-hero trick is reused.
9. Mostly covered. States, no-JS, reduced motion, keyboard (tabs pick on focus), aria-live counts and the closing link are all present. I did not check the coverage card (not read, per brief).
10. No banned tells seen.
11. The copy is untouched (parity 0 missing).

Shared (not counted): the header's "Try Hanzo" is clipped off the right edge at 320px (shared header). The cookie bar covers the lower screen on phone (shared). Font preload "not used" warnings (shared layout). During the walk a hot-reload parse error appeared from `components/pages/Brand.jsx:147` (another page, being edited concurrently).

## Fixes (in order)
1. Phone strip (`.xbl-strip` in `@media (max-width: 899px)`, BlogIndex.css ~line 166): make all 9 months fit at 375 and 320 (narrower bars or gap, or drop `overflow-x:auto`). Failing that, start the rail scrolled to the newest month and give it a visible edge fade, so October is never off screen by default.
2. Keep one solid per viewport: `.xbl-allbtn.on` should not be a black fill while the header ask is solid. Use an ink outline or underline for its active state, as the bars do with their own ink.
3. Merge the two "All 24" controls (the strip pill and the `.xbl-more` button under the list): they do the same thing within one screen of each other.
4. Tighten the empty band between the cover tab rail and the trio (about 240px at 1470), so the hero hands over to the films rather than to a blank screen during the scroll.
