# hanzoai/site — hanzo.ai, the signed-out site

Every signed-out page of hanzo.ai: research, models, open source, products, pricing, company. Open source
(Apache-2.0); anyone may send a pull request. The app — chat, sign-in, sign-up, checkout and every room — is
hanzo-inc/app on **hanzo.app**, and this site links there for all of it.

- Stack: Next.js 16 static export (`output: 'export'`, `trailingSlash: true`), React 19, Motion 12, JSX.
  Light/dark from `@hanzo/appearance` + `@hanzo/design` tokens (docs/DARK-MODE.md).
- Node 22.18+, pnpm via corepack (`packageManager`). `pnpm dev` (:4180), `pnpm build` (out/), `pnpm preview` (:4181),
  `pnpm test` (node --test).
- `pnpm build` runs `scripts/live.mjs` first: figures and plan prices from api.hanzo.ai into `content/live/_*.json`;
  any failed source stops the build. `HZ_LIVE_OFFLINE=1` builds from the snapshots.

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

## Rules

- No price is typed: plans come from `/v1/billing/plans`, model rates from `/v1/pricing/models`. Personal plans are
  monthly only; a year is offered only where the catalog sells one (Team, Team Premium, Enterprise).
- No sign-in, sign-up, card or code is collected here. Those are hanzo.app's.
- Copy is Hanzo's: change wording only on purpose.

## Ship

`.github/workflows/cicd.yml` calls hanzoai/ci build.yml with `hanzo.yml`: every push and pull request runs the test
(install, `pnpm test`, `pnpm build`); a push to main publishes `out/` to the Sites plane slug `hanzo-site`
(prefix `hanzo/hanzo-site`, KMS org `hanzo`) with the agent files (`agent: hanzo.ai`: Markdown twins, llms.txt,
robots.txt, sitemap.xml, the API catalog). universe `infra/sites/sites.yaml` serves hanzo.ai from that prefix.
