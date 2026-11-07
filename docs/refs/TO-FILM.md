# To film once the network is allowed

**Status (7 Nov).** This cloud environment's network policy blocks every reference site except anthropic.com: the proxy answered 403 to each of them. WebFetch is blocked too. Creating a network environment needs James himself, so the request was declined until he is back.

So far:
- **Measured in a real browser:** anthropic.com (`docs/refs/anthropic/`), plus the motion engine Hanzo ships (`node_modules/motion`).
- **Written from write-ups and earlier code reads:** the other 7 references, every value labelled. Each needs the run below.

## 1. Hosts to allow (one environment, exact hosts)

These are the site hosts plus the asset servers they are most likely to load from. The two lists were checked differently:
- **Checked here:** anthropic.com's two blocked asset hosts (`assets.claude.com`, `www-cdn.anthropic.com`); their failed requests were seen.
- **Guessed:** the CDN hosts for the other sites, which nobody could load. After the first run, `measure.json → blockedOrFailedHosts` lists any host still missing.

```
synchronized.studio  www.synchronized.studio
osply.co  www.osply.co
hamol.studio  www.hamol.studio
grubogrubo.com  www.grubogrubo.com
www.apple.com
chatgpt.com  cdn.openai.com  persistent.oaistatic.com  images.ctfassets.net
motion.dev
assets.claude.com  www-cdn.anthropic.com
framerusercontent.com  cdn.prod.website-files.com  player.vimeo.com
```

## 2. The run (about 6 to 15 minutes per site)

Setup:
- Run from the repo root after `npm ci`.
- The lab uses `/opt/pw-browsers/chromium`. Set `CHROME=<path>` to use another browser.
- **Never add `--use-gl=angle`.** It breaks WebGL2 heroes in headless (anthropic.com's hero failed with it).
- **Temp files:** set `LAB_TMP=<a short folder>` for the lab's screenshots and raw video. Do not set `TMPDIR`: a long TMPDIR path stops Chrome from starting.
- **Heavy heroes:** this container has no GPU, so a WebGL hero renders at about 0.4 fps (anthropic.com: 2.3s frames). The lab detects this (`heavy-top` in the walk timeline), films the arrival, then moves one screen down before hovering, so the rest of the walk runs at real speed. Treat the arrival part of such a video as slow motion. Timing values are unaffected: they come from the browser's animation records and the site's code.

```bash
node docs/refs/lab/film.mjs https://synchronized.studio docs/refs/synchronized
```

```bash
node docs/refs/lab/film.mjs https://osply.co docs/refs/osply
```

```bash
node docs/refs/lab/film.mjs https://hamol.studio docs/refs/hamol
```

```bash
node docs/refs/lab/film.mjs https://grubogrubo.com docs/refs/grubogrubo
```

```bash
node docs/refs/lab/film.mjs https://www.apple.com/iphone-17-pro/ docs/refs/apple/iphone
```

```bash
node docs/refs/lab/film.mjs https://www.apple.com/macbook-pro/ docs/refs/apple/macbook-pro
```

```bash
node docs/refs/lab/film.mjs https://chatgpt.com/business/enterprise docs/refs/chatgpt-enterprise
```

```bash
node docs/refs/lab/film.mjs https://motion.dev/examples docs/refs/motion-dev
```

Each run writes:
- `desktop.mp4` (1470×801) and `phone.mp4` (375×812)
- 8 to 10 frames
- `measure.json`
- `summary.md`, which is the measured data the SPEC is written from

The walk covers:
- arrival and idle
- a pointer sweep
- nav hovers
- a menu open
- one screen of scrolling at a time, with a hover on each screen
- a card-to-page open

The measuring covers:
- the CDP Animation domain (durations, delays, easing)
- `getAnimations()` and computed transitions
- the shipped CSS and JS (beziers, keyframes, GSAP, ScrollTrigger, Lenis, springs)
- 10 scroll positions, sampled down and back up (scroll-linked, triggered once, or pinned)
- sticky lengths
- hover and press diffs
- custom cursor lag
- idle pixel change per screen (motion that is not scroll)
- type, spacing, grid and colour at both widths

If the Apple model page has moved (a new iPhone), use the current Pro page from apple.com/iphone/.

## 3. What each run must answer (check `summary.md`, then rewrite that SPEC.md)

Rewrite rule:
- Replace every "from write-up" value with the measured one.
- Delete any "to verify" line that the run settles.

### synchronized.studio (James's favourite)
The lab auto-clicks the first internal card. Pass `--open "<selector>"` if it picks the wrong link.

Answer:
- **Card to page:** time from click to URL change; whether it is a full page load or a single-page swap; the animations it starts (duration, easing); the frames at 120, 300, 600, 1000 and 1600 ms; whether the next page's hero is the clicked image.
- **Cursor:** size, blend mode, labels ("Open"/"Drag") and lag (the cursor block in `summary.md`).
- **Headlines:** the reveal (the earlier code read says a diagonal reveal, 2s Power4.easeOut, ±60px).
- **Smooth scroll:** whether it is used, and its lerp.
- **Phone:** whether the card still opens the client link below 992px.

Then film a second walk on a case page and on /work if they exist.

### osply.co
Answer:
- **Cover flight:** the cover flying into the page (earlier read: blur 10px, 1.9s).
- **Headings:** the line-mask on every heading (1.2s power4.out).
- **Copy email:** the copy-email confirmation.
- **Colour:** the near-black and white alpha token ladder.
- **Type:** the editorial scale.
- **Idle motion:** pointer-aware details and idle loops.

### hamol.studio
Answer:
- **Numbering:** `01 / 09` numbering and status chips.
- **Overlay:** the overlay with Next project and Back.
- **Spatial scene:** WebGL or canvas, its idle motion and its pointer response.
- **Static view:** whether there is a static-view toggle and a preloader.

### grubogrubo.com
Answer:
- **Caption:** the single-slot `01 / 05` caption.
- **Hover gags:** the per-card hover gags (what changes, and how long it takes).
- **Contact footer:** the two-row footer hit areas.
- **Scrubbed video:** the scroll-scrubbed video (frames per scroll px).

### apple.com (iPhone Pro and MacBook Pro)
Answer:
- **Pinned scenes:** each scene's length in screens, from the sticky list.
- **Scrubbed sequences:** whether they are canvas or video.
- **Sub-nav:** how the local nav gains Buy after the hero button leaves (watch `data-localnav-trigger-anchor`).
- **Type:** headline sizes. Apple's own CSS, seen only as search snippets, says `.typography-headline-super` is 80px / 1.05 / -0.015em.
- **Tiles:** tile-grid gaps and radius.
- **Footnotes:** the footnote pattern.
- **Rhythm:** idle loops versus scroll-only screens.

### chatgpt.com/business/enterprise
Answer:
- **The ask:** "Contact sales" in header, hero and close.
- **Logo wall:** whether it moves (marquee speed in px/s, whether hover pauses it).
- **Proof:** the quote and number blocks.
- **Calm motion:** the actual durations and easing.
- **Type:** the type scale.

### motion.dev/examples
Answer:
- **The gallery:** filter or category chips, the card hover preview (does the example play on hover?) and the layout re-flow on filter.

Then film 5 examples on their own pages, the ones BRIEF-v3 §8 and §9 use: toggle group (layoutId pill), scroll word reveal, hide-on-scroll header, ticker, and cursor or magnetic. Example:
```bash
node docs/refs/lab/film.mjs https://motion.dev/examples/<slug> docs/refs/motion-dev/<slug>
```
