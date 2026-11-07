# /blog — James-eye review

Verdict: 8/10
First complaint: "The Kai post is everywhere: it's in the slideshow, it's a picture tile, it's in the list. Same picture twice too. Show me each thing once."

Walked 2026-11-07 16:55 UTC, HEAD a0eac38c, at 1470x801 and 375x812 (isMobile, hasTouch). Ran Playwright: first screen at 0.2/1/3/6 s with pixel diffs, a reload, a 200px-step scroll walk with 0.7 s dwell, hovers on 14 controls, clicks/taps on hero tabs, month bars and "All 24". Also checked reduced motion, JS off and 320px width. Ran `taste.py` on the four page files (OK) and `parity.py /blog` (OK, text 95/95, links 29/29).

## What works
- The first screen sells at once. "News & Guides." (52px) has a quiet lede and ask on the right. Below it, a featured-post deck runs on its own: a contour line drawing drifts in a black card, a progress hairline fills under "01", and the deck advances through six posts, with a pause control. Pixel change was 2.9% from 0.2 to 1 s (h1 cut-in plus drift). On phone the idle change was 28% between 6 and 7.5 s, which is the deck advancing. The page is never dead.
- Each section has a real object: the self-running deck, then a 1-large and 2-small media trio of Hanzo art, then Contents with a 64px "24" and a monthly bar histogram, then the month ledger, then the black Band.
- The histogram is the Beyond: clicking a month bar swaps the ledger to that month, and "All 24" expands to all eight months. Each control answered at both sizes.
- Scale has rhythm: the 52px h1, 32px feature titles, the 64px figure and 17px rows each lead their own screen.
- Hover answers: the primary darkens (no fade), deck tabs go from grey to ink, ledger rows slide the title and ink the tag, and the media tiles respond. No hover moved the layout.
- On scroll, the sticky header ask changes to "Read the latest" (desktop). There is only one solid fill on screen at a time.
- No console errors or page errors at either size. The only warnings were Canvas2D readback and font-preload notices. No red dev badge appeared.
- No horizontal scroll at 1470, 375 or 320 (scrollWidth equals the viewport).
- Reduced motion shows the final state: 0 running animations, the h1 and deck fully set, no progress fill. With JS off, all 24 posts are listed and readable.

## The 11 answers
1. Yes. The h1, lede, ask and a live featured deck all fit the first screen, and motion starts inside 1 s (cut-in plus contour drift, then auto-advance).
2. Mostly one-in-one-out: deck, then trio, then Contents, then the ledger, then the Band. The ledger shows one month by default, so it does not read as a document.
3. Yes: line-art canvas, Hanzo media tiles, histogram plus figure, ledger rows, and the Band.
4. One solid ask per viewport ("Read the latest"), and it moves into the sticky header on desktop. On phone the header keeps a solid "Try Hanzo" and the hero ask is outlined, so the page's own ask never gets the fill on phone. Scale rhythm is good.
5. Yes on desktop, no jumps. On phone, taps on tabs and bars respond.
6. No real overlaps. The flagged intersections are the stacked, inactive deck slides (opacity 0). The phone tab rail scrolls sideways inside itself, as designed. There was no font swap. The cookie card covering the bottom is shared chrome.
7. It feels like osply.co or hamol.studio editorial: asymmetric 8/5 head, numbered `01 / 06` deck, and a ledger with mono dates. The reference's restrained micro-motion is present. No Morph card-open was observed from the trio.
8. Yes. The hero medium is a self-advancing featured deck plus a histogram index, unlike other Story pages.
9. Not audited part by part. Visible evidence for parts 1–12 and 17 is present: one h1, one `<main>`, JS-off legible, a pause control, `data-cta` on hero and band.
10. None seen. One borderline item: the "BLOG" mono label sits inline before the lede, top right. That is beside the h1, not above it, so I did not count it.
11. Parity is OK (95/95 text, 29/29 links).

Shared (not counted): the cookie card is about 400px tall at 375x812, over the 220px rule, and covers the deck caption and the Band ask. The header "Try Hanzo" clipping at 320 is also shared chrome.

## Fixes (in order)
1. Stop the repeats. Kai 1 appears in deck slide 03, as a trio tile with the same diamond art, and in the ledger. Give the trio posts that are not in the deck, or drop the duplicated art, so each image appears once on the page.
2. Phone ask: the hero "Read the latest" is outlined, and the solid fill sits on the header "Try Hanzo". Make the page's own ask carry the fill on phone, as it does on desktop, where the header swaps to "Read the latest".
3. Phone hero: the pause button sits alone on its own row, and there is about 150px of dead white between the deck rail and the media trio, on both sizes. Put the pause control on the rail's row and tighten the gap, so the trio peeks in sooner.
4. The month bars, "All 24" and the deck tabs all report `aria-pressed="false"`, so the current filter or month has no pressed or selected state. Mark the active one, visually and with ARIA.
5. With JS off, every histogram bar renders at full height, which makes the chart wrong. Set the bar heights in server CSS.
