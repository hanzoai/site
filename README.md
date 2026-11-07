# hanzo.ai — the redesign

Every page of hanzo.ai, rebuilt on Hanzo's own stack with a motion layer: **Next.js 15 (App Router) · React 19 · Motion 12 · Lenis · WebGL**.
Hanzo's header, footer, logos, copy, numbers and links are kept as Hanzo ships them; what changes is how the site moves and how pages connect.

## What is in it

| Part | State | Where |
|---|---|---|
| Home | **Redesigned.** Live typing product demo in 3D, model cards that open into their pages, a turning product carousel, a dock of agents, true-speed races, a cost slider, a Pareto plot with a draggable budget line, a commit calendar wave, a throwable repo rail, pricing with rolling prices | `app/page.jsx`, `components/*` |
| 9 model pages (`/enso` … `/mori`) | **Redesigned hero + open transition**, then Hanzo's page content | `components/ModelPage.jsx` |
| The open transition | A card's picture lifts off as a WebGL plane, bends like pulled paper while it fills the screen, and lands as the next page's hero; Close runs it back into the card at the same scroll position | `components/Opener.jsx` |
| Every other page (892 routes from `sitemap.xml`) | **Ported**: Hanzo's server-rendered content, inside the new shell, with blocks that rise into place and in-site links that navigate without reloads | `app/[...slug]/page.jsx`, `components/Ported.jsx`, `content/pages/` |

Ported pages are the floor, not the finish: each page family (models catalogue, cloud, oss, solutions, benchmarks…) gets its own redesigned template in turn, the way the home and model pages did.

## Run it

```bash
npm install
npm run build        # static export of every page into out/ (HZ_ONLY=enso,kai,/pricing builds a subset)
npm run preview      # http://localhost:4181 — serves out/, fetches Hanzo's /public assets from hanzo.ai when missing
```

## Before it goes live on hanzo.ai

1. **Copy `public/` from the current site** (model media, logos, images). Ported pages reference them by their existing paths.
2. **App routes are not in this repo**: `/chat`, `/pay/*`, `/signup`, `/login`, dashboards, `/terms`, `/privacy`, `/products`. Links to them point at `https://hanzo.ai/...`. Keep serving them from the app (edge rewrites), or drop `output: 'export'` in `next.config.mjs` and add Next.js `rewrites()` to the app's origin.
3. **Data is a snapshot from 7 Nov 2026** (the daily commit figures hanzo.ai shows on hover sum to 835,124, while its label says 805,254; the page keeps Hanzo's label): GitHub counts and the commit calendar, pricing tiers, benchmark figures, the Pareto plot. Connect them to their live sources (the same ones the current site uses) before launch.
4. Ported pages are static: interactive widgets on them (calculators, live charts, forms) render as captured. Each family's redesign restores them.

## Refresh the content

```bash
npm run capture      # re-port every page in sitemap.xml into content/pages/ (or: python3 scripts/capture.py /cloud /oss)
npm run extract      # re-read the home page's header, footer, logos, product screens from source/home.html
```

## Motion rules

- Transform and opacity only; one easing family (`cubic-bezier(.16,1,.3,1)` for arrivals, `(.76,0,.24,1)` for the open transition); springs for anything the hand moves.
- Nothing animates off screen: sections pause their animations while out of view.
- `prefers-reduced-motion`: no smooth scrolling, no flight, no typing; every final state shown at once.
- Measured on a MacBook Air (8 GB), Chrome, 1470×801: home scrolls at 52 fps with a worst frame of 68 ms; idle 55–60 fps in every section. The current hanzo.ai measures 42 fps, worst frame 283 ms, on the same machine.

## Structure

```
app/layout.jsx          the shell: Hanzo's header and footer persist across pages; smooth scroll; the open transition
app/page.jsx            home
app/[...slug]/page.jsx  every other route: a model page or a ported page
components/             home sections, Opener (WebGL), ModelPage, Ported, Chrome (header, footer, marquee, smooth scroll)
content/pages/          ported page content, one file per route; content/pages.json holds titles and descriptions
content.js              home data pulled from Hanzo's page (header, footer, logos, product screens, repo cards)
public/hanzo.css        Hanzo's own stylesheet, so their markup renders exactly
scripts/                capture.py (port every page), extract.py (home data), serve.mjs (preview)
```
