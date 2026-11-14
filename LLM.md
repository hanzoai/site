# hanzoai/site — hanzo.ai, the signed-out site

Every signed-out page of hanzo.ai: research, models, open source, products, pricing, company. Open source
(Apache-2.0); anyone may send a pull request. The app — chat, sign-in, sign-up, checkout and every room — is
hanzo-inc/app on **hanzo.app**, and this site links there for all of it.

- Stack: Next.js 16 static export (`output: 'export'`; URLs have no trailing slash, as on hanzo.ai: `/pricing` is `out/pricing.html`, canonical, og:url and the sitemap say `https://hanzo.ai/pricing`), React 19, Motion 12, JSX.
  Light/dark from `@hanzo/appearance`; the design variables are `@hanzo/tokens`' css (docs/DARK-MODE.md).
  `app/layout.tsx` imports `@hanzo/tokens/css` once (colours, radii, type, spacing, data hues). `public/hanzo.css` (Hanzo's captured
  stylesheet) keeps only the `:root`/`.light` declarations that differ from the tokens: the density, radius and type scales, and the
  white page of `.light`; it loads after the tokens, so what it states wins. `scripts/extract.py` rewrites it whole, so drop the
  declarations the tokens already state again after running it. The site's own roles (`--ink`, `--r`, `--room-*`) point at tokens where
  the value is the token's; the rest (the white light page, the grey deck) are the site's.
- Node 22.18+, pnpm via corepack (`packageManager`). `pnpm dev` (:4180), `pnpm build` (out/), `pnpm preview` (:4181),
  `pnpm test` (node --test).
- `pnpm build` runs `scripts/live.mjs` first: figures and plan prices from api.hanzo.ai into `content/live/_*.json`;
  any failed source stops the build. `HZ_LIVE_OFFLINE=1` builds from the snapshots.
- The open-source figures (home band, `/open-source`) are `lib/oss.mjs`, a port of hanzo-inc/app `scripts/sync-oss.ts`:
  the estate from `GET /v1/git/activity` every build, and GitHub's half (stars, forks, languages, contributors, cards)
  into `content/live/_github.json` when `GITHUB_TOKEN` is set (CI passes the runner's `GIT_TOKEN`), else kept; a push
  reuses the cards' contributors and the orgs' descriptions. `GITHUB_TOKEN=$(gh auth token) node scripts/live.mjs`
  refreshes it by hand. A repository public on GitHub but not on the forge (hanzoai/ai, hanzoai/cloud) keeps the year
  it last had, as the app does. `live.mjs` writes `components/pages/openSource/snapshot.js` through `shape.mjs`.
  The home band draws that snapshot (`components/Open.jsx`). A day's shade is `lib/heat.mjs`, the quartiles of the days that
  had commits, one function for the home and /open-source (an outlier or a quiet quarter cannot crush the rest); the tiles'
  and cards' bars are `components/home/spark.js`, @hanzo/ui's Sparkline; the year's bars are weeks counted back from the last
  day. Every cell and bar is `--x-heat` (ink; white in dark) over `--x-cell` (the empty cell) in `app/globals.css`.

## Where things are

| What | Where |
|---|---|
| A route | `app/<path>/page.jsx`; families under `[slug]` |
| A page's code | `components/pages/<Page>.jsx` (+ `.css`), home sections in `components/home/` |
| Shared parts | `components/kit.jsx`, `components/ui.jsx`, `components/Chrome.jsx` (header, footer) |
| Every route | `lib/routes.json`; `lib/route.js` `href()` keeps a path this site has, sends any other to hanzo.app |
| The app's origin | `lib/app.js` (`APP = https://hanzo.app`) |
| Plan prices, checkout links | `lib/plans.js`, from `content/live/_pricing.json` (`GET /v1/billing/plans`); nothing typed |
| Pages still drawn from captured HTML | `components/Ported` over `content/pages/*.html` |
| Go modules (`go get hanzo.ai/<module>`) | `lib/modules.js`: `OWNED` modules have a page of their own (`app/[...mod]`, `components/pages/Module.jsx`), `SHARED` ones are product pages whose metadata carries `other: goImport(name)`. `scripts/modules.json` is hanzo-inc/app's list (name to repository); `scripts/modules.test.mjs` checks every tag in `out/` and runs after `pnpm build` (postbuild) |
| Pages hanzo.ai serves without listing | `lib/unlisted.json`: in `routes.json` (links stay in the site), left out of the sitemap |
| The home hero's demo | `components/Hero.jsx` (the loop), `components/home/Devices.jsx` + `demo.css` (the devices), `hero-scenes.json` (the day it plays) |
| Telemetry | `components/Telemetry.jsx` (the one client, pageviews, observe, tags); `lib/track.js`: `track` (stream + browser tags) and `capture` (stream only) |
| The app's page events | named as hanzo-inc/app names them, same param keys: `lib/funnel.js` (the plan funnel), `lib/press.js` (links), `data-hz-view` bands for `$view`; asserted in a browser by `scripts/events.mjs` (`pnpm build`, then `pnpm events`) |

## Rules

- No price is typed: plans come from `/v1/billing/plans`, model rates from `/v1/pricing/models`. Personal plans are
  monthly only; a year is offered only where the catalog sells one (Team, Team Premium, Enterprise).
- A short address of a page (`/privacy`, `/terms`, `/aup`, `/cookies`, `/data-deletion`, `/bot/details`) renders the same page
  as its target and its canonical points there: one document, never a second copy (`components/pages/LegalRoute.jsx`).
- Every form sends what hanzo-inc/app sends, to api.hanzo.ai: the same URL, body and refusal sentence, and a thanks only
  once Hanzo took the answers. A form that keeps its answers in the browser alone is a fake. The bodies are built in
  `*.send.js` / `*.apply.js` beside the page, each with a node test, and checked end to end in a browser with the API
  intercepted (route + fulfill), never against production.
- No sign-in, sign-up, card or code is collected here. Those are hanzo.app's.
- Copy is Hanzo's: change wording only on purpose.
- The hero demo draws each device as its product draws itself, in the product's own words: the desktop is @hanzo/app's
  window (rail: Chat, Dev, Design, Studio, Tabs, Library, Scheduled tasks, Customize, More; the lit place's sidebar),
  the terminal is `hanzo dev` (`▶`, `• Explored`, `• Added`, `• Edited`, `• Ran`, `└`; tabs install, up and dev only),
  the phone is hanzo.app on a phone, @hanzo/app's mobile layout, which is what people use: the bar's two round glass
  buttons (menu, New chat), the conversation with the five marks under an answer, the composer pinned above the home
  indicator ("Type / for skills", +, mic, voice mode, Auto), and "What's up?" when the chat is empty. It has no tab bar.
  hanzo/mobile is the native app: use it only where it agrees with hanzo.app. Add nothing a product does not have: no
  roster, no notifications, no pause button.
- The logo strips (`Marquee`, `components/Chrome.jsx`) are CSS: a transform loop on `.x-mq-track`, paused under the pointer, on
  focus and off screen, none under reduced motion, no pause button. A `C.backed` item carries `w`, `h` and `hang` (px): the
  wordmark's size and how far it falls below its text (a smile, a descender, a mark), so `.x-logo[data-base]` sits every
  one on a single baseline. Measure a new logo, never eyeball it; crop a padded asset's viewBox to its ink in a file of its own (`techstars-mark.svg`): the CDN keeps a changed file under its old name for a day.
- An agent icon in `C.agents` has no `id` in its markup: the same string is drawn in the dock, the setup row and every
  menu row, and the first copy lives in a closed menu where nothing renders, so a `<mask>` or gradient by id goes blank
  (Grok Build did). Flat marks are inline paths; a gradient mark is a file (`public/<name>-mark.svg`). Colour is the
  brand's own (Claude orange, DeepSeek blue, Amp red, Codex, Antigravity, Gemini, Muse, OpenHands); the rest are in ink.
  A tile's tooltip (`data-name`) and its accessible name are the same words.
- The Pareto plot's points wear their lab's mark (`lab()` in `components/lab.ts`) at hanzo-inc/app's sizes in CSS px (`DISC` in
  `components/Pareto.tsx`, read off the drawing as it is shown, so a disc is the same at every width). A lab with a dock tile
  wears that tile's drawing, so a brand has one mark on the page; Enso's tiers wear Hanzo's H on ink; Z.ai, with no tile, wears
  hanzoai/icons' mark; any other lab wears none. A new lab is a dock tile and a pattern in `OF`; `components/lab.test.ts` holds it.
- How to add Hanzo MCP to each client (the file or command for the hosted endpoint with a key, and for the local server)
  lives on docs.hanzo.ai, `guides/coding` (hanzo-docs/docs LLM.md, "MCP clients"); the home draws no picker, and the setup
  menu's rows (`lib/setup.ts`) link those pages and their anchors. The marks for VS Code, OpenClaw and NanoClaw are files
  (`public/*-mark.*`, new names for the CDN's day-long cache); Claude's, Windsurf's and Warp's are inline paths.
- A card has a clean surface (no stripes, scan lines or dot grids) and one effect, the app's own: it leans toward a mouse
  and a glossy light follows it, and on a phone the device's tilt does the same; at rest nothing moves and no animation
  runs, and reduced motion has neither. Mark it `data-tilt=""` and write nothing else: `lib/tilt.js` (started once, in
  `Smooth`) is the one listener, writing `--rx --ry --lx --ly --lit` on the card; the lean is hanzo.css's `[data-tilt]` and
  the light is `[data-tilt]::after` in `app/globals.css`, a fixed layer moved by transform. The lean is a `transform`, so the
  card must be a plain element (Motion rewrites a motion element's transform): the plan cards and the platform window's
  frame are Motion's, and take the light (the window's face leans). Hover and press on such a card use `translate` and `scale`.
  The four headline figures of the speed and price cards share `--figure` (`.x-races`).
- Scroll-linked effects are CSS (`animation-timeline: view()` or `scroll()`), never a scroll listener or `useScroll`; animate
  `transform` and `opacity`, not `background-position` or `clip-path`, which repaint every frame.
  The home sections carry no rule above their headings and no hairline between rooms.
- Controls are at least 44 x 44 on a touch screen (`@media (pointer: coarse)` in `app/globals.css`): a pill, tab or link
  that must stay small borrows the space with an invisible `::after`.
- A press on a link to a page of this site is taken over by `components/Morph.jsx` at the top of the capture phase and
  stopped: an `onClick` on the link never runs. A moment that belongs to such a link is read with `press()`
  (`lib/press.js`); a button or an outside link can use `onClick`. A link marked `data-ga` sends its own moment, so
  the funnel's link moment (`checkout_started`, `sales_contacted`) leaves it alone.
- An event hanzo-inc/app fires on a page that stays in the app (sign-in, onboarding, pay, the member dashboards) is
  not fired here. Not fired for want of an element: `hero_demo` controls the redesign dropped (sidebar places, send,
  preview, composer, replay chips, agent toggles), `chat_started` (no composer), `page_copied_markdown` (no Help
  corner), `newsletter_confirmed` (no `/newsletter/confirm`), `video_shown`/`video_rated` (no video on `/beta`),
  `beta_closed`, `beta_feedback_sent`.

## Ship

`.github/workflows/cicd.yml` calls hanzoai/ci build.yml with `hanzo.yml`: every push and pull request runs the test
(install, `pnpm test`, `pnpm build`); a push to main publishes `out/` to the Sites plane slug `hanzoai-site`
(prefix `hanzoai/hanzoai-site`, KMS org `hanzo`) with the agent files (`agent: hanzo.ai`: Markdown twins, llms.txt,
robots.txt, sitemap.xml, the API catalog). universe `infra/sites/sites.yaml` serves hanzo.ai from that prefix.
