# hanzoai/site — hanzo.ai, the signed-out site

Every signed-out page of hanzo.ai: research, models, open source, products, pricing, company. Open source
(Apache-2.0); anyone may send a pull request. The app — chat, sign-in, sign-up, checkout and every room — is
hanzo-inc/app on **hanzo.app**, and this site links there for all of it.

- Stack: Next.js 16 static export (`output: 'export'`; URLs have no trailing slash, as on hanzo.ai: `/pricing` is `out/pricing.html`, canonical, og:url and the sitemap say `https://hanzo.ai/pricing`), React 19, Motion 12, JSX.
  Light/dark from `@hanzo/appearance` + `@hanzo/design` tokens (docs/DARK-MODE.md).
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
| Telemetry | `components/Telemetry.jsx` (the one client, pageviews, observe, tags); `lib/track.js`: `track` (stream + browser tags) and `capture` (stream only) |
| The app's page events | named as hanzo-inc/app names them, same param keys: `lib/funnel.js` (the plan funnel), `lib/press.js` (links), `data-hz-view` bands for `$view`; asserted in a browser by `scripts/events.mjs` (`pnpm build`, then `pnpm events`) |

## Rules

- No price is typed: plans come from `/v1/billing/plans`, model rates from `/v1/pricing/models`. Personal plans are
  monthly only; a year is offered only where the catalog sells one (Team, Team Premium, Enterprise).
- No sign-in, sign-up, card or code is collected here. Those are hanzo.app's.
- Copy is Hanzo's: change wording only on purpose.
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
(prefix `hanzo/hanzoai-site`, KMS org `hanzo`) with the agent files (`agent: hanzo.ai`: Markdown twins, llms.txt,
robots.txt, sitemap.xml, the API catalog). universe `infra/sites/sites.yaml` serves hanzo.ai from that prefix.
