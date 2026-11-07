# /brand — James-eye review

Verdict: 7/10
First complaint: "I open it and it's a white page for a second or two. Then the title comes in, then the words, then the drawing. Show me the mark straight away."

Walked 2026-11-07 16:45 UTC, HEAD ca765e59, at 1470x801 and 375x812 (first visit and reload, with screenshots at 0.2, 1, 3, 6 and 8 s and pixel-diffed; a wheel and touch scroll of the whole page; hover and press on the primary; a click or tap on all 17 controls in main, with the clipboard on and off; reduced motion; JS off; taste.py and parity.py).

## What works
- The hero is the mark's own construction drawing, full-bleed with no frame. The guides draw, the five pieces land, the compass keeps turning slowly (about 0.2 to 1.5% pixel change every 2 s after it settles) and the pieces lean toward the pointer. It has a pause control (aria-pressed toggles).
- Principles are a real pinned scene. 01, 02 and 03 replace each other with one big numeral and its own material: a lone mark, the Brand Glow sphere, a grid of marks.
- The colour room is black, with no hue anywhere. The gray strip opens from one bar into six. Swatches copy the real hex (verified on phone: `#404040`) and show a tick only when the copy succeeds. The White/Black contrast board has a gliding pill and draws its pass/fail as shapes.
- The type specimen is the signature. A screen-filling "Aa" sweeps its weight once, then the slider is yours (895 to 189 on a tap). The scale rows answer on hover.
- The components bench works: buttons press, the card hovers, and copying brand@hanzo.ai really copies.
- The primary hover darkens (#0a0a0a to #2c2c2e) with no opacity fade. Press scales to 0.98 with no layout jump. "Download Assets" scrolls to #assets, and the header ask turns into "Download Assets" after the hero.
- No console errors or page errors at either size. No horizontal scroll (scrollWidth equals the viewport). Nothing under 44px on phone. taste.py OK, parity 76/76 text, 4/4 links.
- Reduced motion shows the final mark with nothing running (0 running animations after the walk). JS off is fully legible.

## The 11 answers
1. It sells within 5 s: the name, a one-line lede, Download Assets and the mark. Not within 1 s. On a first visit at 1470 the stage was empty at 0.2, 1 and even 3 s in one run (0% change). On a reload the h1 only starts to cut in at about 1.5 s, the lede reaches full opacity at about 2.1 s and the drawing comes after that. The MaskLines h1 waits 0.5 s plus the curtain, the lede waits for `useArrived()` plus 0.45 s, and the drawing waits for the same gate. Even on a fast production load, nothing is on screen for at least the first half second. Phone was better (the h1 was there at 1 s) but showed nothing else.
2. It is mostly one-in-one-out. The hero, then the pinned 01/02/03, then the colour room, the specimen, the bench and the assets each take their own screen. The colour room runs long on desktop (about 2,300px: brand colours, grays, the board, gradients) and reads a little like a document there.
3. Yes. Every section has a real object: the drawing, the numerals with their marks or sphere, the swatches, the board, the gradients, the "Aa" specimen, live components, and the asset tiles with the marks.
4. Yes. There is one solid ask, "Download Assets", and the header carries it after the hero. "Try Hanzo" is outlined while the hero ask is on screen. Nothing page-owned floats over content (the cookie card is shared). The scale has rhythm: one big thing per screen (the numerals, "Aa"), 44px heads, 26px h3s, small mono captions.
5. Yes on every control in main. The gray swatches give no visible feedback when the clipboard is blocked. That is by design: no fake "Copied".
6. No overlap, clipping or horizontal scroll at either size. The off-screen SVG guides are clipped by the hero. There is no font swap. The blank-then-cut-in hero is a delayed entrance, not a layout shift.
7. It feels like apple.com product pages (the pinned principles, one idea per screen) with an osply/hamol editorial specimen. Both motions are present.
8. Yes. The hero medium is a construction drawing, not a photo, card or terminal, and the signature (the variable-weight specimen) is its own.
9. Mostly covered. Parts 1 to 12 are visible on the page. Part 17 is good with JS off. I did not audit the coverage card.
10. No banned tells: no hue, no eyebrow over a headline, no gradient text, no fade-on-hover. The contrast board is 3 equal tiles per row across two rows on desktop. It reads as a results grid, not "three icon boxes", but it is the closest thing to the tell.
11. The copy is untouched (parity 76/76, 4/4).

Shared (not counted): the cookie consent card sits over the lower hero and over every phone screen until it is dismissed, and the arrival curtain gates the hero.

## Fixes (in order)
1. Put something on the first frame. Server-render the drawing's guides and circle, already visible or drawing from 0 ms. Take the h1 delay from 0.5 s to about 0.1 s and stop gating the lede and actions on `useArrived()` plus 0.45 s, so the stage is never white. Re-check that the 0.2 s and 1 s frames differ at both sizes.
2. With JS off, hide the hero pause button (`.xbr-pause`) or have the NOJS style remove it. It shows but does nothing.
3. Tighten the desktop colour room so it reads as one scene, for example by letting the board replace the gray strip as you go rather than stacking. Consider an asymmetric board layout instead of a 3-across grid of equal tiles.
4. Trim the roughly 200px of empty white between the assets band and the footer on desktop.
5. Minor: in the 01 principle panel, the top and bottom hairlines start about 22px right of the panel's left edge. Align them.
