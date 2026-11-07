# /blog — James-eye review

Verdict: 7/10
First complaint: "Where's the button? Nothing on the first screen is solid, so I don't know what you want me to press. And with scripts off the top story is six headlines printed on top of each other."

Walked 2026-11-07 16:20–16:40 UTC, HEAD fc751a9a, at 1470x801 and 375x812 (first screen at 0.2/1/3/6 s with pixel diffs, reload, 200px wheel/scroll walk with 0.7 s dwell, hover and press on cards, rotator tabs, contents rows, month bars and All 24, taps on phone, reduced motion, JS off, 9 repeat loads for console errors; taste.py OK, parity 95/95 text, 29/29 links).

## What works
- The first screen is alive without input. The h1 cuts in, the contour art draws itself, and the six-story rotator advances on its own with a progress hairline. Pixel change: 2.6% between 0.2 and 1 s, 6.7% between 1 and 3 s, still 3.7% at 6–7.5 s. It never goes dead, and Pause holds it (aria-pressed true, slide stays).
- The rotator tabs answer both hover (grey to ink) and click/tap (the slide changes, `aria-pressed` moves). It is a pinned stage where one panel changes, and it is not scroll-driven.
- The art cards answer properly: a 3D tilt, art scale 1.03, title underline and the arrow sliding 6px. Clicking one opens into its page (Morph to /blog/synthesis), which is the synchronized.studio move.
- "24" with a month bar chart doubles as a filter (Jun shows June's 3 posts). Older months stay collapsed behind "All 24", so the detail lives in things you open.
- Scale has rhythm: h1 52, story title 32, the 24 figure, 26px section heads, 13px mono meta. Nothing is big all at once.
- Copy and colours are clean: taste OK, parity 0 missing, monochrome, with colour only in the Kai art.
- Phone is its own composition: h1, lede and ask in the first 300px, the art card next, stories stacked, no horizontal scroll (scrollWidth equals clientWidth at both sizes).

## The 11 answers
1. It sells and moves within 1 s: yes, the h1 cut-in and contour draw-in start at once, and the rotator keeps ticking. But the first screen has no solid ask (see 4).
2. Mostly one-in-one-out through the hero, art grid and 24 chart. From "Contents" down it becomes a long month-grouped list (1,445px desktop, 1,915px phone), so that part reads as a document. Collapsing older months helps.
3. Yes, except the Contents list. Objects: rotator art, three art cards, the bar chart. Two of the three grid cards reuse the same grey contour drawing as the hero, so only one is real Hanzo media (Kai). No block of 4+ real images.
4. The ask is in the header and nothing of the page's floats over content. But at 1 s and later on desktop the header "Try Hanzo" drops to outlined while the hero "Read the latest" is also outlined, so the first screen has zero solid fills. After the hero, the header swaps to a solid "Read the latest", which is fine. Phone keeps a solid "Try Hanzo". Scale rhythm passes.
5. Cards, tabs, rows and month bars all answer, with no jumps. "hanzo.blog →" showed no measurable hover change. "Read the latest" hover is only an inset grey wash.
6. No overlap with JS on at either size. **With JS off, the six hero stories stack in one grid cell and overprint each other** (titles and ledes illegible). The shared cookie card covers the rotator tab titles at 1470x801 (shared chrome).
7. synchronized.studio (card opens into its page; present) and apple (a pinned stage where one panel changes; present as the rotator). osply-style editorial is present in the Contents rows.
8. Yes. A self-running editorial rotator plus a "24" posting-rhythm chart is its own hero and signature, unlike the About/News/Press pattern.
9. Mostly. The gaps: part 3/12 JS-off legibility fails in the hero, and part 4 needs one solid primary on the first screen.
10. No banned tells: no hue, no 3 equal boxes (the grid is 1 big + 2 stacked), no fade-on-hover buttons, no floating page bar. The "BLOG" mono label sits inline before the lede in the right column, not above the h1. It passes, but it is close.
11. Copy untouched (parity 95/95, 29/29).

Shared (not counted): a hydration-mismatch red "1 Issue" badge appeared once on phone (0 of 9 repeat loads reproduced it; consistent with the shared FooterHTML issue). A dev compile error from `components/pages/About.jsx:89` (another page) appeared in the desktop console. The cookie card covers content at both sizes. The /blog/synthesis destination shows a mid-Morph ghost of the title over its lede at ~800 ms (destination page, not this one).

## Fixes (in order)
1. JS off: hide inactive slides without JS. Every `.xbl-story` sits in `grid-area: 1 / 1` (`BlogIndex.css:16`), and the noscript rule (`BlogIndex.jsx:297`) only un-hides `.xbl-story.on *`. It never hides the others, so all six render on top of each other. Add `.xbl-story:not(.on){visibility:hidden}` to the noscript/`html:not(.js)` path, or make the SSR off-state hidden by CSS.
2. Put one solid fill on the first screen. Make "Read the latest" the solid `Cta` (with `data-cta`), or keep the header "Try Hanzo" solid while the hero ask is quiet. Right now there is none from about 1 s on desktop.
3. Give the "Posts on hanzo.ai" grid real media. Two of its three cards repeat the hero's grey contour drawing. Use each post's own cover/art where Hanzo has it, so the page shows 4+ real visuals together.
4. Break up the Contents list so it is not a document. For example, open only the current month by default, or let the bar chart drive which month is shown, with one month in and one out.
5. Tighten the dead air: ~200px blank between the rotator and the grid, and a ~400px empty left column above "Contents" at 1470x801.
6. Give "hanzo.blog →" a hover that tells you something (an arrow nudge or underline).
