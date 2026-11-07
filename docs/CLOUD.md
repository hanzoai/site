# Cloud chats: shared rules and tasks (7 Nov)

James's 8 GB laptop could not run the chats, so the remaining work runs in the cloud. A local conductor chat merges each finished branch into James's copy, and he watches it on localhost:4180.

## Shared rules (every cloud chat)
- **Setup.** Run `npm ci`, then `npm run dev` (port 4180) in the background.
- **The law.** Follow `docs/DESIGN.md`:
  - Nothing is lost: `python3 scripts/parity.py /<path>` shows 0 missing.
  - Hanzo's words only, and never invent a number.
  - Every page is unique, moves without hover, is fast and accessible, and works first-class on phones. Meet the elite bar.
  - **Motion: varied and restrained.** One signature motion plus at most 3 supporting techniques, and at most 2 fade-ups per page. Reach for the least-used techniques first. `scripts/variety.py` checks this inside `scripts/unique.py`.
  - Also read `docs/NEXT-LEVEL.md` (site-wide layers, `Beyond:`) and `docs/PAGES.md` (signatures).
- **Filming.** The "No filming on this laptop" rule is about James's Mac. In the cloud, run `node scripts/motion.mjs` or `phone.mjs` only if a Chrome or Chromium binary exists (puppeteer-core needs one). Otherwise judge the motion from the code.
- **Style.** Hanzo's way: the smallest change that fully works, reuse the kit (`components/ui.jsx`, `components/kit.jsx`), and review your own work before calling it done. Act as James: never ask him questions, and make the decisions yourself.
- **Ownership.** Other cloud chats work on other files at the same time on their own branches, so touch only the files you own. Never edit `app/globals.css`, `lib/route.js`, `docs/PAGES.md`, `components/ui.jsx`, `components/kit.jsx` or another chat's pages. Report any shared change you need instead.
- **Safety.** Never submit real forms or send real chat messages to Hanzo's live API; intercept requests, as `scripts/forms.mjs` does. No deploys.
- **Finish.** Commit, push your branch, and open a draft PR titled `Hanzo: <your task>`. The PR body gives one line per page: what changed, the evidence (200, parity, unique) and what is unverified. James reads that list to know what to look at.

## Tasks

### 1. Family Builder 2
Finish the 7 small families: `/blog/*`, `/customers/*`, `/agents/*`, `/compare/*`, `/help/*`, `/zen/*`, `/kai/*`.
- Some of this already exists. `components/pages/post/Post.jsx` fails variety with 5 techniques; bring it to 4 or fewer.
- Each family is one template with `generateStaticParams`, its own signature and a `<Sigil seed>` per member. Blog posts and customer stories read like reading rooms (60-72ch).
- **You own** the `[slug]` routes and their templates only, not the index pages.
- **Done when** every member returns 200, parity is 0, unique passes and `scripts/tracker.py` shows all 7 families `rebuilt`.

### 2. Content / Data
Connect the live sources: GitHub counts, the commit calendar, pricing and benchmarks.
- A local chat started this, so check `scripts/live.mjs`, `content/live/` and `package.json` first.
- Refresh the data from Hanzo's own public sources into `content/live/*.json`, with `source` + `fetched_at`. Keep the last good snapshot when a source fails, so the build never fails or shows an invented number.
- Add a `prebuild` step and `scripts/live.test.mjs`, which proves both the online path and the offline fallback.
- **You own** those files, the `scripts` block of `package.json` and data-only files. List any figure that is hard-coded in a page, with its file and line.

### 3-6. Motion Polish 1-4
Take already rebuilt pages to the elite bar.
- First fix every `variety.py` FAIL on your pages. Then upgrade the weakest sections with the least-used techniques, so that each section earns its motion and the rest sits still.
- Add a `Beyond:` feature where it is missing, built only from Hanzo's facts.
- Keep each page's signature and keep `unique.py` passing.
- **You own** each page's `components/pages/...` file and its `app/<path>/page.jsx`.

Page lists:
- **Polish 1:** `/` (plus the home section components `components/Hero.jsx`, `Platform.jsx`, `Agents.jsx`, `Race.jsx`, `Cheaper.jsx`, `Pareto.jsx`, `Open.jsx`, `Pricing.jsx`, `Models.jsx`) `/about /agents /analytics /api /authz /auto /automations /base /benchmarks /billing /blockchain /brand /captable /careers /chat /cli /commerce /compare /comparison /console /contact-sales /crawl /dashboards`
- **Polish 2:** `/dataroom /datastore /design /desktop /dev /dns /download /edge /engine /enso /enterprise /flow /functions /gateway /guard /gui /history /hsm /iam /ide /identity /idv /ingress /insights /integrations /investors`. `/enterprise` is the reference page, so keep its patterns intact.
- **Polish 3:** `/iro /jin /kai /kms /koe /koma /ledger /legal /machines /mcp /metrics /models /mori /mq /network /node /o11y /open-source /oto /payments /philosophy /platform /playground /press /pricing`. `/models` keeps the WebGL opener.
- **Polish 4:** `/pubsub /realtime /registry /research /risk /s3 /search /security /sentinel /sign /solutions /stream /team /telemetry /treasury /trust /tunnel /ui /uta /visor /world /zen`, then the family templates `/models/*` (`components/ModelPage.jsx`; keep the WebGL opener), `/oss/*`, `/integrations/*`, `/solutions/*`, `/blockchain/*`, `/legal/*`, `/careers/*` and `/products/*`. For each family, check 2 members.

### 7. Build / Release
Run `npm run build` (the static export), then `npm run preview` (:4181) and `curl` 30 routes, including 5 from families.
- **Fix:** build errors in shared code, layer files and `next.config.mjs` (you own those).
- **Report, don't edit:** a page that breaks the build. Give its file and the error in the PR body, because another chat owns it.
- **Done when** `npm run build` exits 0, or the PR lists every remaining blocker.
