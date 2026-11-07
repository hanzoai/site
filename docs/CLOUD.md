# Cloud chats: shared rules and tasks (7 Nov)

James's 8 GB laptop could not run the chats, so the remaining work runs in the cloud. A local conductor chat merges each finished branch into James's copy, and he watches it on localhost:4180.

## Shared rules (every cloud chat)
- **The law, in order:**
  1. `docs/JAMES.md`: his standards and the James-eye review.
  2. `docs/BRIEF-v3.md`: goal, audiences, CTA logic, psychology, page types, UI system, motion library, references, budgets, done list.
  3. `docs/PLAN-COMPONENTS.md`: all 18 parts of a website and every element in them, which every page must cover. It lands soon; pull main.
  4. `docs/VISION.md` and `docs/DESIGN.md`.

  Copy is frozen.
- **Reviews decide "ready", not your own score.** Cloud James-eye critics walk every pushed page and write `docs/review/<page>.md`, with `Verdict: N/10` and the first complaint. After every `git pull`, read the reviews of your pages and fix anything under 8 **before** starting a new page.
- **Coverage.** Each page you finish gets `docs/coverage/<page>.md`: the 18 parts, one line each, saying what you did for that part on this page (or why it does not apply).
- **Read `docs/VISION.md` too.** It is James's expanded brief and outranks everything else: Apple-grade, chaptered, his references visible, v2 type, space and motion, scored 8/10 or better.
- **Setup.** Run `npm ci`, then `npm run dev` (port 4180) in the background.
- **The law.** Follow `docs/DESIGN.md`:
  - Nothing is lost: `python3 scripts/parity.py /<path>` shows 0 missing.
  - Hanzo's words only, and never invent a number.
  - Every page is unique, moves without hover, is fast and accessible, and works first-class on phones. Meet the elite bar.
  - **Motion: varied and restrained.** One signature motion plus at most 3 supporting techniques, and at most 2 fade-ups per page. Reach for the least-used techniques first. `scripts/variety.py` checks this inside `scripts/unique.py`.
  - Also read `docs/NEXT-LEVEL.md` (site-wide layers, `Beyond:`) and `docs/PAGES.md` (signatures).
- **Filming.** The "No filming on this laptop" rule is about James's Mac. The cloud has room, so install Chrome for Testing there (`npx @puppeteer/browsers install chrome@stable`) and point the scripts at it. Then film with `node scripts/motion.mjs` and `phone.mjs`, judge the motion, and commit small proof to `docs/gallery/<page>/` (VISION.md, Process 3).
- **Style.** Hanzo's way: the smallest change that fully works, reuse the kit (`components/ui.jsx`, `components/kit.jsx`), and review your own work before calling it done. Act as James: never ask him questions, and make the decisions yourself.
- **Ownership.** Other cloud chats work on other files at the same time on their own branches, so touch only the files you own. Never edit `app/globals.css`, `lib/route.js`, `docs/PAGES.md`, `components/ui.jsx`, `components/kit.jsx` or another chat's pages. Report any shared change you need instead.
- **Safety.** Never submit real forms or send real chat messages to Hanzo's live API; intercept requests, as `scripts/forms.mjs` does. No deploys.
- **Shared `components/v2/` files: reuse, never re-create.** Before adding one, run `git pull --rebase origin main` and check whether it already exists. If it does, use it as it is. If it lacks something, build that piece page-local (`components/pages/<your page>/...`). Only add a brand-new v2 file if the name is free, and pull right before pushing it. Two chats creating the same file caused the first merge conflict (7 Nov 13:45).
- **Never stall on approvals.** James is away, so a prompt waits until the conductor's next tick. Avoid commands that need manual approval, such as `rm` with globs: write each run into a fresh folder instead. Never ask to change cloud environment or network settings. Work with what you have and note what you need in your PR body.
- **Push after every page, not at the end.** James watches the site build live on his localhost: the conductor merges every pushed commit about every 10 minutes. Commit and push each page as soon as it works.
- **Mark it done.** When a page meets VISION.md, add this line to the top comment of its page file: `V2: <score>/10 <one line on what changed>`. The status board reads that line; a page without it counts as not done.
- **Finish.** Commit, push your branch, and open a draft PR titled `Hanzo: <your task>`. The PR body gives one line per page: what changed, the evidence (200, parity, unique) and what is unverified. James reads that list to know what to look at.

## Tasks: Wave 1, the flagships that set the v2 bar
Each chat owns its pages' `components/pages/...` files, their `app/<path>/` routes, and any `components/v2/<Name>.jsx` it creates (one file per piece, with a usage note at the top). Rebuild each page to VISION.md; do not just patch it. Score each page 1–10 in the PR, and ship only 8 or better.

1. **Home** `/`, with the home sections `components/Hero.jsx`, `Platform.jsx`, `Agents.jsx`, `Race.jsx`, `Cheaper.jsx`, `Pareto.jsx`, `Open.jsx`, `Pricing.jsx`, `Models.jsx`. This is the bar-setter: Stage hero, chapters, cards that open (synchronized.studio).
2. **Models**: `/models` (catalogue) + the `/models/*` template (`components/ModelPage.jsx`), read like the anthropic.com model launch. Keep the WebGL opener.
3. **Enterprise + Pricing**: `/enterprise` (calm trust, like chatgpt.com/business/enterprise) and `/pricing` (rolling prices, a compare drawer).
4. **Platform + Cloud**: `/platform` (a system map you zoom into) and the `/cloud/*` template, a launch page for each product.
5. **Apps**: `/chat`, `/dev`, `/agents`. Each gets one live, self-running product demo as its hero.
6. **Story**: `/about`, `/history`, and the `/blog` index (editorial, osply/hamol/grubogrubo style).

Later waves (the conductor launches these after Wave 1 merges): the remaining ~120 pages in archetype groups of about 10 per chat, the families not covered above, Content/Data wiring for hard-coded figures, then Build / Release (`npm run build` exits 0, preview :4181).

## Wave 2 (launched 7 Nov 13:30, in parallel with Wave 1, because James wants speed)
Same rules. Each chat owns its group's page files and routes. Archetypes are in VISION.md.
1. **Company:** `/careers /contact /contact-sales /customers /solutions /support /team /press /investors /brand`
2. **Proof:** `/benchmarks /compare /comparison /open-source /philosophy /research /security /trust /leaderboard /integrations`
3. **Apps 1:** `/api /bot /chrome /cli /computer /design /desktop /download /extension /gen`
4. **Apps 2:** `/ide /kata /mcp /operative /operator /skills /slack /studio /tag /sdks`
5. **Cloud 1:** `/analytics /authz /base /crawl /dashboards /datastore /dns /edge /engine /functions`
6. **Cloud 2:** `/gateway /guard /hsm /iam /identity /idv /ingress /insights /kms /machines`
7. **Cloud 3:** `/metrics /mq /network /node /o11y /playground /pubsub /realtime /registry /s3`
8. **Cloud 4:** `/search /sentinel /stream /telemetry /tunnel /visor /world /auto /automations /billing`
9. **Business 1:** `/blockchain /captable /commerce /console /dataroom /flow /gui /jin /ledger /payments`
10. **Business 2:** `/risk /sign /tabs /treasury /ui /zap /legal /templates /features /gallery`
11. **Programs:** `/affiliate /beta /bounty /buying-specialist /founder /grants /learn /newsletter /referral /sms-opt-in /startups`
12. **Zen family names:** `/enso /iro /kai /koe /koma /mori /oto /uta /zen`
13. **Families A** (templates; check 2 members each): `/benchmarks/* /oss/* /integrations/* /solutions/* /blockchain/* /legal/* /careers/* /products/*`
14. **Families B** (templates; a local chat had started these at v1, so finish them to v2): `/blog/* /customers/* /agents/* /compare/* /help/* /zen/* /kai/*`

Index pages and family templates are different files, so `/customers` (group 1) and `/customers/*` (group 14) do not collide.
