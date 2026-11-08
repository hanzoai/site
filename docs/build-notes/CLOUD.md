# Cloud chats: shared rules and tasks (7 Nov)

James's 8 GB laptop could not run the chats, so the remaining work runs in the cloud. A local conductor chat merges each finished branch into James's copy, and he watches it on localhost:4180.

## Shared rules (every cloud chat)
- **The law, in order:**
  1. `docs/build-notes/MASTER.md`: the one brief (precedence, the 18 parts, the look, page types, mechanics, the coverage card).
  2. `docs/build-notes/DONE.md`: the finish line.
- **Reviews decide "ready", not your own score.** Cloud James-eye critics walk every pushed page and write `docs/build-notes/review/<page>.md`, with `Verdict: N/10` and the first complaint. After every `git pull`, read the reviews of your pages and fix anything under 8 **before** starting a new page.
- **Coverage.** Each page you finish gets `docs/build-notes/coverage/<page>.md`, copied from `docs/build-notes/coverage/_TEMPLATE.md` (MASTER.md section 6).
- **Setup.** Run `npm ci`, then `npm run dev` (port 4180) in the background.
- **Filming.** Cloud only, never on James's Mac. See MASTER.md section 5 (Filming and proof).
- **Style.** Hanzo's way: the smallest change that fully works, reuse the kit (`components/ui.jsx`, `components/kit.jsx`), and review your own work before calling it done. Act as James: never ask him questions, and make the decisions yourself.
- **Ownership.** Other cloud chats work on other files at the same time on their own branches, so touch only the files you own. Never edit `app/globals.css`, `lib/route.js`, `docs/build-notes/PAGES.md`, `components/ui.jsx`, `components/kit.jsx` or another chat's pages. Report any shared change you need instead.
- **Safety.** Never submit real forms or send real chat messages to Hanzo's live API; intercept requests, as `scripts/forms.mjs` does. No deploys.
- **Shared `components/v2/` files: reuse, never re-create.** Before adding one, run `git pull --rebase origin main` and check whether it already exists. If it does, use it as it is. If it lacks something, build that piece page-local (`components/pages/<your page>/...`). Only add a brand-new v2 file if the name is free, and pull right before pushing it. Two chats creating the same file caused the first merge conflict (7 Nov 13:45).
- **Taste gate.** `python3 scripts/unique.py` now also runs `scripts/taste.py` on every page file you touch. It fails any UI hue (colour belongs only to Hanzo's media) and any label, tag or pill sitting directly above a headline. These are the critics' two most common complaints. If that label is Hanzo's own copy, keep the words but move them so they are not above the headline. Also fix any Next.js error badge (the red dev overlay) on your pages.
- **No PRs, no watching, no scheduled check-ins.** The conductor merges every pushed branch into main within 2-10 minutes. Opening a PR and then waiting on it stalls you and needs approvals while James is away. After each push, pull main and carry straight on with the next page or fix. Only end your turn when every page you own has a critic verdict of 8 or more.
- **Never stall on approvals.** James is away, so a prompt waits until the conductor's next tick. Avoid commands that need manual approval, such as `rm` with globs: write each run into a fresh folder instead. Never ask to change cloud environment or network settings. Work with what you have and note what you need in your PR body.
- **Push after every page, not at the end.** James watches the site build live on his localhost: the conductor merges every pushed commit about every 10 minutes. Commit and push each page as soon as it works.
- **Mark it done.** When a page meets MASTER.md, add this line to the top comment of its page file: `V2: <score>/10 <one line on what changed>`. The status board reads that line; a page without it counts as not done.
- **Finish.** Commit, push your branch, and push your branch (no PR needed). The PR body gives one line per page: what changed, the evidence (200, parity, unique) and what is unverified. James reads that list to know what to look at.

## Tasks: Wave 1, the flagships that set the v2 bar
Each chat owns its pages' `components/pages/...` files, their `app/<path>/` routes, and any `components/v2/<Name>.jsx` it creates (one file per piece, with a usage note at the top). Rebuild each page to MASTER.md; do not just patch it. Score each page 1–10 in the PR, and ship only 8 or better.

1. **Home** `/`, with the home sections `components/Hero.jsx`, `Platform.jsx`, `Agents.jsx`, `Race.jsx`, `Cheaper.jsx`, `Pareto.jsx`, `Open.jsx`, `Pricing.jsx`, `Models.jsx`. This is the bar-setter: Stage hero, chapters, cards that open (synchronized.studio).
2. **Models**: `/models` (catalogue) + the `/models/*` template (`components/ModelPage.jsx`), read like the anthropic.com model launch. Keep the WebGL opener.
3. **Enterprise + Pricing**: `/enterprise` (calm trust, like chatgpt.com/business/enterprise) and `/pricing` (rolling prices, a compare drawer).
4. **Platform + Cloud**: `/platform` (a system map you zoom into) and the `/cloud/*` template, a launch page for each product.
5. **Apps**: `/chat`, `/dev`, `/agents`. Each gets one live, self-running product demo as its hero.
6. **Story**: `/about`, `/history`, and the `/blog` index (editorial, osply/hamol/grubogrubo style).

Later waves (the conductor launches these after Wave 1 merges): the remaining ~120 pages in archetype groups of about 10 per chat, the families not covered above, Content/Data wiring for hard-coded figures, then Build / Release (`npm run build` exits 0, preview :4181).

## Wave 2 (launched 7 Nov 13:30, in parallel with Wave 1, because James wants speed)
Same rules. Each chat owns its group's page files and routes. Page types are in MASTER.md section 4.
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
