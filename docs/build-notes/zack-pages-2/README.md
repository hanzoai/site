# Zack's pages, round 2: /studio, /models, /benchmarks, /enso, /blog (preview)

Redesigned to the standard of the approved home page (home-wow + home-models-journey): split headings with a drawn hairline, lit corners and Hanzo's halftone, lifted stages, one dark room per page, and every section in one frame. No wording changed, no price changed, every buying button kept, Hanzo's images kept.

## Checks (on the production build)

| | /studio | /models | /benchmarks | /enso | /blog | /blog/kai-decision-models |
|---|---|---|---|---|---|---|
| Tallest section at 1470x801 | 772px | 761px | 774px | 763px | 763px | 736px (article body excepted) |
| Page height at 1470, before → after | 6,956 → 5,381 | 13,649 → 6,693 | 19,215 → 9,868 | 8,792 → 5,329 | 8,116 → 3,844 | 6,162 → 5,534 |
| Live lines missing (before → after) | 0 → 0 | 0 → 0 | 3 → 3 | 0 → 0 | 5 → 0 | 0 → 0 |
| Dark check (scripts/darkcheck.mjs) | 0 | 0 | 0 | 0 | 0 | 0 |
| Console errors / sideways scroll, 1470 + 375, light + dark | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

`npm run build` passes. The 3 /benchmarks lines were already missing before (two "Nov 7, 2026" price-date footnotes and "0 tokens"); /blog/pareto-frontier's 16 chart labels were also missing before and are unchanged. The home page and its 3D models section are untouched.

On a phone (375x812), every section shows its heading with its first card or row. A few sections still run longer than one phone screen below that first card (for example the /benchmarks board).

## /studio

**Zack's ask:** A clear upgrade path: "See plans, from $8/month" sits beside "Launch studio.hanzo.ai" in the first screen, and the close is a three-step ladder (Launch, See plans, Open Hanzo Design).

**Cinematic moments:** A projector beam rises from the timeline playhead; the reel opens like a curtain with letterbox bars drawing back.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/studio-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/studio-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/studio-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/studio-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![studio-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s00.jpg?raw=true)
![studio-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s01.jpg?raw=true)
![studio-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s02.jpg?raw=true)
![studio-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s03.jpg?raw=true)
![studio-light-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s04.jpg?raw=true)
![studio-light-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s05.jpg?raw=true)
![studio-light-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-1470-s06.jpg?raw=true)

![studio-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s00.jpg?raw=true)
![studio-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s01.jpg?raw=true)
![studio-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s02.jpg?raw=true)
![studio-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s03.jpg?raw=true)
![studio-dark-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s04.jpg?raw=true)
![studio-dark-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s05.jpg?raw=true)
![studio-dark-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-1470-s06.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-light-375-s06.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/studio-dark-375-s06.jpg?raw=true" width="180">

</details>

## /models

**Zack's ask:** All 43 models in one priced, filterable list (family chips, price chips, search): name, context, In $/M, Out $/M and "Use it now" on every row, in one screen. Zen 7 keeps live's "Request access" (research preview).

**Cinematic moments:** The families room opens like a curtain with a light sweep; a beam passes down the list each time a filter changes.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/models-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/models-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/models-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/models-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![models-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s00.jpg?raw=true)
![models-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s01.jpg?raw=true)
![models-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s02.jpg?raw=true)
![models-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s03.jpg?raw=true)
![models-light-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s04.jpg?raw=true)
![models-light-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s05.jpg?raw=true)
![models-light-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s06.jpg?raw=true)
![models-light-1470-s07.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s07.jpg?raw=true)
![models-light-1470-s08.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-1470-s08.jpg?raw=true)

![models-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s00.jpg?raw=true)
![models-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s01.jpg?raw=true)
![models-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s02.jpg?raw=true)
![models-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s03.jpg?raw=true)
![models-dark-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s04.jpg?raw=true)
![models-dark-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s05.jpg?raw=true)
![models-dark-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s06.jpg?raw=true)
![models-dark-1470-s07.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s07.jpg?raw=true)
![models-dark-1470-s08.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-1470-s08.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s06.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s07.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-light-375-s08.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s06.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s07.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/models-dark-375-s08.jpg?raw=true" width="180">

</details>

## /benchmarks

**Zack's ask:** "Start on Hanzo Cloud" plus "View Models & Pricing" or "Use every model here, Go is $8/month" beside every results block; every result opens (tabs, sheets, its own page). 19,215px down to 9,868px with all 881 lines kept.

**Cinematic moments:** The Zen 6 dark room opens like a curtain under a turning beam; Kai's 16 tiles tilt in on a 3D hinge.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/benchmarks-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/benchmarks-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/benchmarks-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/benchmarks-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![benchmarks-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s00.jpg?raw=true)
![benchmarks-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s01.jpg?raw=true)
![benchmarks-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s02.jpg?raw=true)
![benchmarks-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s03.jpg?raw=true)
![benchmarks-light-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s04.jpg?raw=true)
![benchmarks-light-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s05.jpg?raw=true)
![benchmarks-light-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s06.jpg?raw=true)
![benchmarks-light-1470-s07.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s07.jpg?raw=true)
![benchmarks-light-1470-s08.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s08.jpg?raw=true)
![benchmarks-light-1470-s09.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s09.jpg?raw=true)
![benchmarks-light-1470-s10.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s10.jpg?raw=true)
![benchmarks-light-1470-s11.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s11.jpg?raw=true)
![benchmarks-light-1470-s12.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s12.jpg?raw=true)
![benchmarks-light-1470-s13.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s13.jpg?raw=true)
![benchmarks-light-1470-s14.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-1470-s14.jpg?raw=true)

![benchmarks-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s00.jpg?raw=true)
![benchmarks-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s01.jpg?raw=true)
![benchmarks-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s02.jpg?raw=true)
![benchmarks-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s03.jpg?raw=true)
![benchmarks-dark-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s04.jpg?raw=true)
![benchmarks-dark-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s05.jpg?raw=true)
![benchmarks-dark-1470-s06.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s06.jpg?raw=true)
![benchmarks-dark-1470-s07.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s07.jpg?raw=true)
![benchmarks-dark-1470-s08.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s08.jpg?raw=true)
![benchmarks-dark-1470-s09.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s09.jpg?raw=true)
![benchmarks-dark-1470-s10.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s10.jpg?raw=true)
![benchmarks-dark-1470-s11.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s11.jpg?raw=true)
![benchmarks-dark-1470-s12.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s12.jpg?raw=true)
![benchmarks-dark-1470-s13.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s13.jpg?raw=true)
![benchmarks-dark-1470-s14.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-1470-s14.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s06.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s07.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s08.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s09.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s10.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s11.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s12.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s13.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-light-375-s14.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s05.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s06.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s07.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s08.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s09.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s10.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s11.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s12.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s13.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/benchmarks-dark-375-s14.jpg?raw=true" width="180">

</details>

## /enso

**Zack's ask:** Enso Flash, Pro and Ultra prices with Try Hanzo, Open in Workbench and Docs on GitHub in the first screen, in one lifted band under the hero.

**Cinematic moments:** The switchboard room opens like a curtain with a beam; the Pareto frontier draws itself as the chart arrives.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/enso-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/enso-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/enso-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/enso-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![enso-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s00.jpg?raw=true)
![enso-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s01.jpg?raw=true)
![enso-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s02.jpg?raw=true)
![enso-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s03.jpg?raw=true)
![enso-light-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s04.jpg?raw=true)
![enso-light-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-1470-s05.jpg?raw=true)

![enso-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s00.jpg?raw=true)
![enso-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s01.jpg?raw=true)
![enso-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s02.jpg?raw=true)
![enso-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s03.jpg?raw=true)
![enso-dark-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s04.jpg?raw=true)
![enso-dark-1470-s05.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-1470-s05.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-light-375-s05.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s04.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/enso-dark-375-s05.jpg?raw=true" width="180">

</details>

## /blog

**Zack's ask:** The 4,609px list becomes one screen: a scrolling contents pane beside the month strip, which filters it.

**Cinematic moments:** The cover swings back in 3D as each headline turns.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/blog-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/blog-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/blog-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/blog-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![blog-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-1470-s00.jpg?raw=true)
![blog-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-1470-s01.jpg?raw=true)
![blog-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-1470-s02.jpg?raw=true)
![blog-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-1470-s03.jpg?raw=true)

![blog-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-1470-s00.jpg?raw=true)
![blog-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-1470-s01.jpg?raw=true)
![blog-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-1470-s02.jpg?raw=true)
![blog-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-1470-s03.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-light-375-s03.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog-dark-375-s03.jpg?raw=true" width="180">

</details>

## /blog/kai-decision-models

**Zack's ask:** Every post ends with its own closing links from live (Kai: "Results, request shapes and limits", How to use Kai, Kai against Jev, API reference) and "The Hanzo newsletter" with Subscribe beside them. Same on /blog/pareto-frontier and /blog/synthesis.

**Cinematic moments:** The end band opens like the home page's dark room; the plate tilts up into place.

| Before, light | After, light | Before, dark | After, dark |
|---|---|---|---|
| ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/blog_kai-decision-models-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/blog_kai-decision-models-light-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/before/blog_kai-decision-models-dark-1470-full.jpg?raw=true) | ![](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/after/blog_kai-decision-models-dark-1470-full.jpg?raw=true) |

<details><summary>One-frame shots, every section (1470x801 light and dark, then 375x812 light and dark)</summary>

![blog_kai-decision-models-light-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-1470-s00.jpg?raw=true)
![blog_kai-decision-models-light-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-1470-s01.jpg?raw=true)
![blog_kai-decision-models-light-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-1470-s02.jpg?raw=true)
![blog_kai-decision-models-light-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-1470-s03.jpg?raw=true)
![blog_kai-decision-models-light-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-1470-s04.jpg?raw=true)

![blog_kai-decision-models-dark-1470-s00.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-1470-s00.jpg?raw=true)
![blog_kai-decision-models-dark-1470-s01.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-1470-s01.jpg?raw=true)
![blog_kai-decision-models-dark-1470-s02.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-1470-s02.jpg?raw=true)
![blog_kai-decision-models-dark-1470-s03.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-1470-s03.jpg?raw=true)
![blog_kai-decision-models-dark-1470-s04.jpg](https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-1470-s04.jpg?raw=true)

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-light-375-s04.jpg?raw=true" width="180">

<img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-375-s00.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-375-s01.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-375-s02.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-375-s03.jpg?raw=true" width="180"> <img src="https://github.com/jamessburnss1313-dev/hanzo-site/blob/zack-pages-2/docs/build-notes/zack-pages-2/frames/blog_kai-decision-models-dark-375-s04.jpg?raw=true" width="180">

</details>
