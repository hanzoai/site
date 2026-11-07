> **Conductor overrides (7 Nov), and they win over anything below:**
> 1. **`docs/JAMES.md` wins on taste.** That means 0 UI accent hues: links are ink with an underline, not #0066cc blue. Status colours appear only together with a shape or text cue. No eyebrow above any headline. Motion is not only scroll.
> 2. **Copy is frozen.** Any new UI string is limited to `content/ui-strings.json`, and only for function (legal, accessibility, control labels), never to replace Hanzo's wording. Until James approves those strings, controls use an icon with an aria-label.
> 3. **No local browser jobs.** All rendering, filming and Lighthouse checks run in the cloud.
> 4. **Coverage.** Every page writes `docs/coverage/<page>.md` against the 18 areas below, and the critics check it.

# Hanzo component master plan

Revision 2. Scope: deeper, not bigger. No new pages, products or sections. Copy is frozen (every word, number and link as Hanzo has it). The only strings outside Hanzo's copy are the entries in `content/ui-strings.json` (section 0.6), and James approves each one. No local browser or dev-server job runs on the 8 GB laptop. All rendering, Lighthouse, axe, Playwright, ffmpeg, sharp and Shiki run in CI or a cloud chat. Priority 1 is capped at 40 rows (section 6).

---

## 0. Look, canon, method

### 0.1 The Look (James signs this first)

- **Brand idea.** One API for every model, shown as calm negative space (the Japanese "ma" behind the Zen model names enso, iro, kai, koe, koma, mori, oto, uta, zen). The Sigil mark is the one ownable visual. Hero objects are product UI and Sigil, never stock imagery or gradients.
- **Temperature.** Decision for James. The default is a light page (#fff and #f5f5f7), at most one dark middle room, and a dark closing room. Dark rooms use the `.room-dark` tokens. Dark mode for the whole site is out of scope. The earlier "halftone 60% under copy" is dropped. Any texture behind copy must keep H1 contrast at 7:1 or better, and CI measures it.
- **Type voice.** Zen for sentences. Zen Mono only for kickers, figures, code, model IDs and prices. One specimen sheet goes in `docs/CANON.md`.
- **Principles, each with a test:**
  1. *One thing in, one thing out.* Every new component names what it deletes (section 0.5). Each 100svh holds at most one new idea or object.
  2. *One focal point per viewport.* It passes the squint test (section 0.3).
  3. *Show the real thing.* Hero objects are real product renders with no invented content.
  4. *Weight, not words.* Hierarchy fixes crowding. Copy never moves to fix it.
  5. *Quiet until needed.* At most one continuous mover per viewport.

### 0.2 Scoring rubric (replaces the unanchored /10 scores)

Each axis scores 1 to 5, and every score cites a screenshot.

| Axis | 1 | 3 | 5 (anchor: apple.com home) |
|---|---|---|---|
| Clarity | Can't say what it is | Product named, value vague | Category and value in 5 s |
| Hierarchy | Several equal masses | Two competing | One focal mass, clear order |
| Craft | Drift visible | Consistent, generic | Optical details, concentric radii |
| Motion | None or noisy | Decorative | Each move explains a state |
| Distinctiveness | Template | Polished SaaS | Unmistakably Hanzo |
| Action | Many equal buttons | One primary, unclear next | One primary, label matches table, event fires |

- Every anchor gets one reference screenshot in `docs/anchors/`: apple.com = 5, anthropic.com and stripe.com as comparison anchors.
- The old "4/10, 5.5/10, 6.5/10" area scores are retired. Baseline scores on the current build are re-taken from `shots/` (0.3) and recorded in `docs/BASELINE.md`.
- Pass mark per money page: no axis below 3, and Hierarchy, Distinctiveness and Action at 4 or more.

### 0.3 The human-eye loop without James's laptop

1. **Today, zero browser cost.** Claude reads the existing `shots/` PNGs (about 215 MB) with the image Read tool. It writes a dated crit list per page in `docs/CRITS.md`. Example entries: "hero H1 fights stage", "cards uneven", "text under 12px".
2. **CI contact sheets (Step 0 of the build).** A GitHub Actions job runs Playwright on Chromium and WebKit. It renders the 17 templates plus the 10 money pages at 375x812, 768x1024 and 1470x801, and home at 6 scroll positions. It uploads PNG contact sheets as artifacts. Every PR attaches its sheet, and Claude reads it against the rubric.
3. **Perceptual gate in the PR template:**
   - **Squint test.** At an 8px blur, the H1 and the primary action are still the two strongest masses.
   - **Focal-point test.** One focal object per viewport.
   - **Blind hero comparison.** Two reviewers score the hero screenshot against anthropic.com and apple.com on a 1 to 5 scale. The pass mark is an average of 4 or more.
   - **Motion contact strip.** Frames at 0, 100, 300, 600 and 900 ms for each signature move.
   - **One-line answer.** Someone who has not seen the page writes what it is and what to do next. This replaces the "5 of 5 reviewers" check. Five people is a smoke test, not evidence.
4. **Human test, scheduled once before cutover.** An unmoderated test with 30 or more participants per audience (developers, buyers), live site against new. The pass mark is 70% naming the category and 60% naming the next action, reported with a confidence interval. Owner: James. It is marked manual, with no CI claim.

### 0.4 Reference teardown (`docs/REFERENCES.md`, 8 rows)

Rows: synchronized.studio, osply.co, hamol.studio, grubogrubo.com, apple.com, chatgpt.com/business/enterprise, anthropic.com/claude-sonnet-5-5, motion.dev examples. Method: read-only fetch, no local browser. Columns:

- What it does.
- Measured numbers: hero type size and tracking, section height, card-to-page duration and easing, grid, colour count, moving things per viewport.
- Three rules Hanzo steals.
- The plan row that uses each rule.

Any plan row that no reference or finding supports is demoted to Priority 3 or deleted. Seed rule already known: synchronized.studio's card opening into its page becomes the Morph row (2.3).

### 0.5 Subtraction ledger (`docs/LEDGER.md`, a PR gate)

Every component this plan adds must list the code it deletes. The PR fails without the deletion.

| Adds | Deletes |
|---|---|
| `Cta` | Five button forks: `xex-cta`, `xpr-cta`, `xop-btns`, `xcr-btn`, `xfo-btn`, `xos-btn-d`, `xch-cta` |
| `PageHero` | 49 hand-written `Hero` functions |
| `Tabs` | 34 hand-rolled tab sets |
| `DataTable` | 4 table implementations |
| `CodeBlock` | 6 code surfaces |
| `Film` and `Pic` | 18 raw `<video>` and 106 raw `<img>` |
| `Field` and `LeadForm` | At least 5 form implementations |
| One MutationObserver | Two 1500ms pollers and the 1200ms thumb poller |
| `tokens.css` | Literal radii, shadows and hex values in 171 CSS files |
| `Stat` | Count and Flap one-offs |
| `Dialog` (native) | Palette, prefs, gallery and beta hand-rolled modals |

The list is checked by `jscpd` (under 3% duplication) and the lint bans in 3.1.

### 0.6 UI-string register (`content/ui-strings.json`)

One file lists every functional string that is not Hanzo marketing copy. Each entry has: string, where used, reason, and `needs_james: true|false`. The copy-freeze hash test covers all of `content/pages` and excludes only this file.

- **Legal and accessibility, approved with counsel:**
  - "Reject all"
  - "Cookie preferences" (the footer link)
  - "Privacy choices" (maps an existing dead `#choices` anchor)
  - "Skip to content"
  - Visually hidden "(opens in a new tab)"
- **Functional microcopy, each needing James's yes, otherwise the control renders icon-only with an `aria-label` from this file:**
  - "Copied" and "Press ⌘C"
  - "Try again"
  - "Replay", "Pause" and "Stop"
  - "Showing saved data"
  - "Back to results"
  - "show all (N)" and "expand all"
- **No new strings may replace Hanzo wording.** "No published rate" and similar replacements for "…" are NOT used. A missing value shows an em dash with an accessible name from this register, or James supplies wording.
- Meta text counts as copy. The 31 empty descriptions and 13 over-long titles are listed for James. Nothing is truncated or auto-filled.

### 0.7 Canon values (`docs/CANON.md`, the single source; every area table cites it)

| Token group | Pinned value |
|---|---|
| Text on white | ink #1d1d1f; secondary #424245; muted #6e6e73 (5.0:1). `--faint #86868b` is dark rooms only. |
| Link and ring | link #0066cc (5.57:1). Focus ring: two-tone (2px ink plus white halo), `#0a84ff` / `#5eb0ff` on dark. |
| Status | green #1a7f37 (5.0:1), always with a shape or text second cue |
| Neutrals | page #fff, raised #f5f5f7, sunken #ececf0, lines black 8/14/28% (dark: white 10/16/30%) |
| Type scale (9 steps) | micro 13 (14 on phone), small 14, body 17 (19 wide), lede 21–24, title 28, head 36–56, display-m 48–96, display 56–128, figure 72–160 |
| H1 | `clamp(3rem,7.2vw,7rem)` (replaces the three competing clamps) |
| Measures | head 14–18ch, lede 38–48ch, body 62–68ch |
| Tracking | display −0.05em, head −0.04em, body −0.011em, kicker +0.12em |
| Weights | 400, 500, 560, 600 |
| Radii | 6, 10, 16, 24, 32, pill (inner = outer − padding) |
| Spacing | 4/8pt; section 96/160/240, phone 56/120/120; wrap 1280; gutter `clamp(20px,4vw,48px)` |
| Durations | press 120, ui 220, reveal 520, scene 800 (ms) |
| Easing | out `(.16,1,.3,1)`, in `(.7,0,.84,0)`, in-out `(.76,0,.24,1)` |
| Springs | SNAP {420,34}, SOFT {300,30}, SLOW {90,18}. Docs and code follow this. |
| Z-index | base 0, sticky 10, header 40, overlay 60, sheet 90, cursor 1000 |
| Breakpoints | 599, 899, 1199 (container queries inside components) |
| Arrival curtain | Home, first visit only. Min 0 to max 700ms, ends when fonts are ready and the hero is painted. Skipped for return visits (7 days), deep links, Save-Data, 2g/3g, reduced motion, bots. No dimming and no transform on `.x-page`. |
| Budgets (`budgets.json`) | Fail line is Google "good": LCP 2.5s, INP 200ms, CLS 0.1 (p75). Lab target is LCP 2.0s, INP 200ms, CLS 0.02. Brotli JS: text routes 110 KB, home 170 KB. CSS 40 KB. Hero image 120 KB. Total home images under 600 KB. |
| Sticky layers | See 0.9. |

Delete duplicate values from all area tables. They cite "CANON".

### 0.8 Browser support matrix

CI runs Chromium, WebKit (Safari macOS and iOS), plus a Firefox smoke run. Progressive enhancement only, each with a stated fallback:

| Feature | Fallback |
|---|---|
| View Transitions | 250ms crossfade or cut |
| Scroll-driven animation | IntersectionObserver |
| `backdrop-filter` | Opaque 92% surface |
| `dvh` / `svh` | `vh` via `@supports` |
| `hidden=until-found` | Panel stays open |
| `corner-shape: squircle`, `text-box-trim` | Plain radius and normal trim |
| Popover and anchor positioning (mega-menu) | Absolute positioning |

### 0.9 Sticky-layer policy

At most two fixed layers per viewport.

- **Desktop:** header, plus at most one of announcement bar or cookie card.
- **Phone:** thumb bar OR cookie OR banner, never two. Order of appearance: arrival, hero, cookie (after first interaction or 3s), then the thumb bar.
- **Header CTA:** always visible on phone. On desktop it is outlined while the hero CTA is in view and solid after. It is never hidden.
- **Hide-on-scroll header:** disabled when any element has focus, when a menu is open, and under reduced motion. Acceptance: a focused element is never under the header in either state.
- **Chapters:** the pill is not a layer. See the deferred list.

---

## 1. Goal, audiences, conversion spec

**Site goal.** A visitor gets to a first successful call or message fast, and enterprise visitors reach a sales conversation.

**Conversion spec (first guardrail):**

- **Primary metric:** `api_key_created` within 24 hours of first visit. It is server-side and joined to the marketing visit on `hz_sid`.
- **Secondary:** `contact_sales_submit`. "Qualified" means a company email domain plus a size bucket, as a field rule.
- **Leading indicators:** `signup_start`, `first_chat`, `install_copy`.
- **Time to first call:** the span from first touch to the first 2xx on api.hanzo.ai. It is measured server-side. The signup, email verification and key page steps live in the app, so they are a tracked dependency (1.2).
- Every page row cites a metric id. A row without one is deleted.
- The score is not a page-level score. A page serves one of these metrics or it is not a priority.

### 1.1 Audiences (7 rows)

| Audience | Alternative | Trigger | Must believe | Metric | Entry |
|---|---|---|---|---|---|
| Developer | OpenAI or Anthropic direct, OpenRouter, Bedrock | Cost, model access | One key, OpenAI-compatible, cheaper | `api_key_created` | /api, /cli, /sdks |
| Enterprise buyer | Cloud vendor direct | Data residency, vendor consolidation | Safe, deployable in my cloud, supported | `contact_sales_submit` | /enterprise |
| Founder | Credits elsewhere | Runway | I can ship on this free | `signup_start` | /startups |
| Researcher | Own hosting | Reproducibility | Models are real, open, reproducible | GitHub or weights click | /benchmarks |
| Investor and press | — | Diligence | Traction, team | One contact click | /investors, /press |
| Consumer | ChatGPT, Claude | Price | Best chat for the price | `first_chat` | /chat |
| Agent (machine) | — | Task | Literal sequence works | llms.txt fetch | /agents#headless |

Journeys (Evaluate, Build, Buy, Fund, Learn) are treated as funnels with named step events and a leak report after week 1, not as page lists.

### 1.2 Dependencies on other teams (each needs owner and date from James)

- Signup deep-link contract: `/signup?next=/api-keys&ref=<cta id>&hz_sid=…`, with a return path to the quickstart after key creation.
- Server events `signup_complete`, `api_key_created` and `first_2xx_call`, joined on `hz_sid`.
- A "Get an API key" return path from the top docs pages, with `hz_sid` and UTM pass-through (docs.hanzo.ai is out of scope but its return CTA is not).
- Lead handling for /contact-sales: recipient, reply time, routing by size, spam filter, CRM fields. A speed-to-lead alert goes out within 5 minutes.
- Signed-in hint (a cookie the app already sets) so returning developers see "Open app". This is Priority 1 because returning users are most of the developer traffic.

### 1.3 Copy decisions only James or Hanzo can make (engineering will not edit these)

1. Home H1 says "Open Source" while title and meta say "Cheaper. Pick all three." Pick the string.
2. Pricing has three truths: `content/pages.json` (Pro/Max/Team plus USDC/USDT), live `/pricing` (Free, Go $8, Pro $15, with Personal/Team/API tabs), and `Pricing.jsx` ("Pay as you go"). Pick the live site as source and confirm the tab labels.
3. "Backed by" logos conflict with `/enterprise` ("not partners or customers"). Written logo permission is needed. **The logo strip ships only for names with documented permission.**
4. Home pricing buttons for Dev, Max and Ultra, and both Enterprise buttons, have no href and loop to /pricing. Supply a destination per button. Until then **the button is hidden, not looped.**
5. `/playground` cURL uses model `zen` with no Content-Type header. `/sdks` uses `zen5`. The Python block calls `KeysApi.get_keys()` under "the same request from code". "Copy" must equal the displayed text, so any fix to the copied text is a copy decision.
6. `/cli` "Install from hanzo.sh" links to docs. The TypeScript SDK has no docs link.
7. Home commit tiles sum 835,124 against the label 805,254.
8. 13 titles are over 70 characters and 31 pages have empty descriptions. List them for approval.
9. Customer years: adding "Hanzo-built launches" or a year beside figures is allowed only if the year or wording already exists in the case copy. Otherwise it is new copy and needs James.
10. CTA label unification (Try Hanzo, Start free, Open App, Apply for Beta Access): existing labels are listed per CTA in `lib/cta.js`. Engineering only reorders and restyles them. Changing a label needs James.
11. Doc questions: statement of VPAT/EAA expectation; what is "available on request" for security buyers (using existing wording only, since SOC 2 is "compatible, not certified").

---

## 2. Areas

Each area keeps the live evidence from the audits. The Pri column uses the 6.1 list. Rows without a P1 or P2 tag are P3 or later.

### 2.1 Strategy and conversion

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Goal and spec | No written goal | `docs/STRATEGY.md` with 1 and 1.2 | File exists; every page row cites a metric | P1 |
| One primary per screen | Home stacks beta ribbon, sign-in panel, Open App, Install CLI, Download App (8 actions above 900px); 97 of ~147 pages carry `data-thumb` | One filled primary plus one text secondary per viewport, chosen from existing labels via `lib/cta.js` {page, audience, label, href, event id, thumb label}. Weight and order change, wording does not. | `cta-audit.mjs`: 1 solid per viewport; a label or href differing from the table fails; a same-page href fails | P1 |
| Home first 5 seconds | Two H1s (hero and sign-in panel) | One h1; sign-in headline becomes h2 with the same words; h1, subhead and primary fit 1470x801 and 375x812 | One h1 in server HTML; one-line answer test | P1 |
| Pricing truth | Three sources, four dead buttons | One `lib/plans.js` for /pricing, home, enterprise; decisions per 1.3 | 0 numbers differing from live | P1 |
| Header CTA and login | Try Hanzo to external /signup; no visible sign-up on desktop | Quiet Log in plus Try Hanzo pill, always visible (0.9). Signed-in hint swaps to "Open app". | Signup-label link visible at every scroll offset at 1470x801 and 375x812 | P1 |
| Enterprise page order | Security 8th, deployment repeated | Where it runs, then trust strip within 2 screens, results, GPU drawer, one identical "Talk to sales" | Trust strip in first 2 screens; one label and href | P1 |
| Developer first call | Install and CLI in hero phone; docs external | Existing code block moves up as the hero object; Copy equals displayed text | /api reaches API keys in 2 clicks | P1 |
| Objections | Big claims, no "how" | Place the existing answer sentence within one viewport of the primary CTA, from the 7 objection rows (lock-in, data, price at scale, reliability, security, support, procurement). Each cites its source line, or the row is dropped. | A reviewer finds the answer in under 10 s | P2 |
| Proof order | Cases 2015–2020 sit high | In the Buy journey, current verifiable proof (benchmarks with method link, GitHub figures, status) sits above old cases. Cases stay. | Order check on /customers and home | P2 |
| Belief ladder (home) | Order inherited from hanzo.ai | Order stays until section_view data supports a change. Hypothesis only. | — | P3 |
| Cheaper claim | No path to check your own cost | The existing `Bill()` comparer is reachable from home Cheaper and /pricing. No new copy. | Link exists | P2 |
| OpenAI-compat claim | Claim without contrast | Show the existing snippet's base-URL line adjacent to the claim. Only existing snippet text is used. | Adjacent in DOM | P2 |
| Forms | ≥5 implementations; ContactSales is the only revenue path | `LeadForm` + `useLeadForm`. Priority goes to ContactSales: 5 fields (email first, company, size bucket, use case, optional message), 8s timeout with 1 retry, draft in sessionStorage, byte-identical payload to `forms.json`. SmsOptIn success only on 2xx (TCPA record). Other forms follow later. | 500 and network failure keep all values; SMS success shows only on 2xx | P1 (Contact-sales, SMS) |
| Drift gate | Live differs from local | `scripts/check.mjs` includes numeric and href diff vs live on 10 flagships | 0 diffs | P1 |

### 2.2 Information architecture and navigation

Constraint: the IA generator may re-home links but never deletes one. Parity compares hrefs only.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| IA table | 130 top-level pages; 50 in nav; same item under different labels | One IA table (route, home menu, ≤2 cross-mentions) feeds nav, footer, ⌘K, sitemap, crumbs | 0 orphans, depth ≤3 | P2 |
| Mega-menu | Text wall; Solutions 5 cols/30 links, Products 5 cols/28 links | ≤5 cols, ≤7 links per column. The right side becomes a stage tile (Sigil or product media plus the page's existing description). Opaque. Click or Enter opens; hover intent is an enhancement. | Stage swap ≤250ms, CLS 0 | P1 |
| Menu keyboard | Focus never enters panel; one `aria-controls` for all; no sheet trap | APG disclosure navigation; `inert` behind sheet; targets ≥44px | axe 0 serious with panel open | P1 |
| Mobile sheet | 6 accordions plus Pricing; no search, login or CTA | Logo, search, close on top; 56px rows; pinned Log in and CTA at bottom; safe area, `100dvh` | All visible at 375x812 | P1 |
| Pricing link | Pricing only in mobile sheet (Nav.jsx:186) | Pricing link on desktop too (existing label) | 0 removed links in routes diff | P1 |
| Header behaviour | Two `setInterval(…,1500)` pollers; hard-coded `top:60px` | One MutationObserver; `--x-top` variable; hide rules per 0.9 | No `setInterval` in Chrome.jsx | P1 |
| ⌘K | Substring only; empty query dumps 400 rows; no ⌘K chip | Weighted fuzzy; empty state shows ≤12 rows; ≤60 option nodes | 30 queries put the target in the top 3 | P2 |
| Language switcher | Sets `lang`/`dir` for 44 locales; content English | Keep control; `<html lang="en">` stays truthful; no RTL flip | Arabic leaves LTR, lang stays "en" | P1 |
| Footer | ~100 links, 41 KB, no collapse; `#choices` dead anchor | 6 columns desktop; `<details>` accordions on phone (≥48px); relative URLs; "Privacy choices" opens prefs | Link count before = after | P2 |
| Breadcrumbs | JSON-LD only on 56 of 131 | Visible crumb at depth ≥2 using labels already in nav; JSON-LD for all | /models/openai/gpt-5 shows Models / OpenAI / GPT-5 | P2 |
| Skip link, landmarks | None; per-page `<main>` | Skip link to one `<main id="main">`; focus and live title on route change | Tab once shows skip link | P1 |
| 404 | Strong; Go back no-op on direct hit; `decodeURIComponent` can throw | try/catch; hide Go back when history ≤1; focus h1 | `/%E0%A4%A` renders | P2 |
| Scroll on Back | Resets to top | POP restores per URL | Back within 40px | P2 |
| Link integrity | 8 nav links to absolute hanzo.ai pages missing here | One link helper; same-site via Link; true external gets `rel` and hidden text | `links.mjs` 0 broken | P2 |
| URL form | `trailingSlash:true` vs live no-slash | Match live (2.14) | See 2.14 | P1 |

### 2.3 First impression and page narrative

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Arrival curtain | Up to 2.4s, 1.15s floor, content at 40% opacity, counter 000–100 fake | Per CANON 0.7. Drop the counter. CSS-only failsafe at 3.5s. | LCP is the hero; curtain ≤700ms; header rect unchanged | P1 |
| **Home hero composition** (see brief 5.1) | 3 tilted devices, 32-row roster tiny, 8 actions | See brief | Rubric ≥4 on Hierarchy, Distinctiveness | P1 |
| PageHero | 49 pages hand-write `Hero`; 46 copy their line helper | One `PageHero` in kit.jsx: kicker, H1 lines 1.1s entry, lede, one primary, hero object. H1 baseline at ~38% of 100svh; next section peeks 56px. | No `function Hero` in pages; H1 offset within 8px at 1440x900 | P1 |
| Phone fold | `.x-hero{min-height:0;padding-top:32px}`; buttons before product | Badge, H1 (≤3 lines at 40px), lede, one primary, ≥80px of app peeking; svh plus safe area | All visible in 660px | P1 |
| Server-rendered text | 333 `initial={{opacity:0}}` in server HTML; no noscript | Every word in exported HTML; animated headings are real text; `html:not(.js)` rule; counters render final value | JS off: /, /pricing, /models/zen, /careers legible | P1 |
| **Scroll story** (see 5.1) | 9 stacked sections fading | Stays 9 sections. Choreography is per object (5.1), not per timing rule. Pinned chapters ship only as a staged test (6.3), never default. No proximity snap (conflicts with Lenis and focus). | One new idea per 100svh; Page Down reaches every section | P2 |
| Section rhythm | Uniform `x-sec` 96–168px | Loud/quiet alternation with CANON spacing | No 3 consecutive within 15% height; ≥3 sections ≥90svh on home | P2 |
| Page endings | Home ends on marquee; 12 pages no Band | Proof strip, then one Band with its existing words; footer at 0 gap | All templates end in Band or equivalent | P2 |
| Social proof | Backed marquee shows no names | Static strip of names with documented permission only (1.3 #3); marquee 25s loop, pauses on hover | ≥5 logos with images blocked | P2 |
| Morph (card opens into page) | Not every card marks `data-morph` | Card hands title and picture to `data-morph-target`; 600ms in-out; 250ms crossfade fallback | Title lands within 12px of destination H1 | P1 |
| Ported fallback | Raw HTML with no hero or ending | Auto PageHero from first h1/p; auto closing Band | Parity 0 missing | P2 |
| Error and loading | No `error.jsx`/`loading.jsx` | Designed room with retry (2.17) | Throw shows error room | P1 |
| Hero motion budget | 2.2s and 700ms intervals wake under reduced motion | ≤1 continuous animation; shared rAF clock; final frames under reduced motion | No `setInterval` on `/` | P2 |
| Titles and OG | Default title for rebuilt pages | See 2.14 | — | P1 |
| `story.py` | `unique.py` checks sameness only | Checks: one h1, PageHero, action in first 100svh, Band ending, ≤1 dark middle, no new strings | Table of 148 | P2 |

### 2.4 Conversion system

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Hero auth | Google, GitHub, email all to /signup | If `?provider=` works, use it. Otherwise group as one control (email solid, others outlined). | No adjacent buttons share an href with different labels | P1 |
| Pricing CTAs | Dev, Max, Ultra with no href; Enterprise to /pricing | Hidden until a destination exists (1.3 #4) | 0 same-page hrefs | P1 |
| Plan hierarchy | Pro only solid; $15 anchor moves with selector | Recommended plan only if a written rule exists (e.g. team size field); otherwise all equal. Aligned CTAs; selector defaults lowest. | CTAs same y within 1px | P2 |
| Handoff states | Cross-origin jumps flash | Pressed state 200–400ms, `aria-busy`; app same tab, docs new tab | Pressed <100ms | P2 |
| Thumb bar | DOM-scraped; default Try Hanzo; `setInterval(…,1200)` | Driven from `lib/cta.js`; none on legal and careers; hides when hero CTA visible | Label matches table on 12 pages | P2 |
| Install command | CMD constant; hero only; false "Copied" | `<InstallCommand>` copies exactly the displayed text (no `$ ` prefix). Failure never says Copied. | Clipboard equals string | P1 |
| API key path | Login wall; placeholder keys | Existing curl and key CTA adjacent; `KEY_URL` constant; `?from=` | Single source for key URL | P2 |
| Pricing objections | FAQ at bottom | Move the existing first 3 FAQ questions under the plan cards. Links to /security, /trust adjacent. | Link adjacent to `.xpr-cta` | P2 |
| Closing Band | Inconsistent | CTAs at hero, after proof, at end; never 4+ | — | P2 |
| Button primitive | 5 implementations | One `<Cta>` (solid, quiet, link; md, lg); lint bans raw `.x-btn` | grep none | P1 |
| External handoff | /signup, /login, /pay not in routes.json | Nightly HEAD of every CTA target | All 2xx/3xx | P2 |
| Contact | Four solid buttons | One solid | /contact has one `.solid` | P3 |

### 2.5 Trust and proof

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Claim integrity | "Backed by" vs "not partners or customers" | Single `BACKERS` module; James signs; names only with permission | One shared array | P1 |
| Home trust strips | Two scroll-velocity marquees | Stationary ordered row (grayscale, 28–32px); logos link to /investors or /customers/<slug>; optional 60s drift pauses on hover and focus | Legible at 1470x801 | P2 |
| Marquee a11y | rAF ignores reduced motion; duplicate halves | Freeze under reduced motion; duplicate `aria-hidden` and `inert`; pause control if over 5s | Transform constant under reduce | P1 |
| Customer proof | Cases 2015–2020 ($8.4M, $7M+, 169M, $2.5M, $650M, 250,000) | Year shown only where it exists in the case copy. Order per 2.1. | No figure with an unsourced year | P2 |
| Figures | Scattered (16 of 16, 93.7%, 95.6%, 0.8 ms, 3.02x, ~3,665, 732,288) | Shared `Stat` with tabular numerals. Existing source link and qualifier ("Up to") stay adjacent to 200x/400x. | Qualifier in card | P2 |
| Benchmarks | 1,111-line file | Method line per board using existing text; zero baseline; Hanzo = ink, others 40% grey; stable hash URLs | role=table; no component over ~400 lines | P2 |
| Trust/Security | Two siblings | One reading path; status panel first in Hanzo's words | DPA, subprocessors, security.txt, security@hanzo.ai in 2 clicks | P2 |
| Compliance badges | None | Typographic status row in Hanzo's words; no seals, no invented uptime | grep finds no SOC 2/ISO/HIPAA seal and no invented "99." figure | P1 |
| security.txt | Not shipped by export | `public/.well-known/security.txt` (RFC 9116) | 200 text/plain, future Expires | P1 |
| Legal typesetting | Draft DPA marked | 68ch, sticky index, anchors, print CSS | Stable ids | P2 |
| Logo assets | Referenced logos/covers not in public/ | Vendor all; build gate | 0 missing | P1 |
| Footer trust | Legal links only in sign-in | Group Trust, Security, Legal, Status in footer | End, Tab reaches all | P2 |
| Forms trust | — | Existing Privacy link and owner line in the submit viewport | Privacy link in submit area | P2 |
| Numeric diff gate | — | Every number in components exists in `content/pages` | Fails on seeded "99.99%" | P1 |
| TrustRow on other pages | — | Not added. Only reuse a block already on that page. | — | — |

### 2.6 Content presentation (copy untouched)

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Type tokens and floors | 37 font sizes; 192 declarations at 10–12.5px; `--faint` 3.5:1 used 425× | CANON scale; floors 13px (14 phone); `--muted` replaces `--faint` for text | 0 axe color-contrast; <20 literals | P1 |
| Reading width | 25+ measures | CANON measures; `text-wrap: balance`/`pretty` | p ≤75ch; no one-word last line at 375/768/1440 | P1 |
| Stat | Count/Flap | `<Stat>` with tabular numerals; count-up once, one per screen; never rounds | Value byte-identical to source | P2 |
| Disclosure | DetailSheet, x-code, Faq, buttons all different | 4 patterns: inline, accordion, drawer, tab; hash-open | Ctrl-F opens | P1 |
| FAQ | Single-open, first open, inert | `hidden="until-found"`; multi-open; `#q-slug` | Ctrl-F works | P1 |
| Tables | 4 implementations; sticky offsets 118/96/0 | One `DataTable`: caption, `scope`, sticky header, tabular numerals, 48px rows; <720px stacked or pinned scroller | All 5+ table pages use it | P1 |
| Code | `.x-code` 12px | `<Code>` 13.5px/1.65; build-time Shiki; comments ≥4.5:1; copies displayed text | 4.5:1 | P2 |
| Long reading | No global scroll-margin; no print | `scroll-padding-top: calc(var(--hdr)+16px)`; print CSS | Anchors visible | P2 |
| Catalogue chunking | open-source.html 797 KB | Sticky group headers with true counts; `content-visibility:auto` >60 items | Long task <50ms with 300+ cards | P2 |
| Tabs | Seg and Pricing tabs differ | One APG `<Tabs>`; hash sync | Keyboard test | P1 |
| Cards | Per page | Anatomy: media, title, desc (text stays in DOM), mono meta 13px, one `::after` link | One tab stop per card | P2 |
| Phone density | — | Body 17px; gutters 20px; lists >5 collapse with a true count from the register | No horizontal scroll | P2 |
| Presentation gate | Parity/unique/variety only | `presentation.mjs` rules inside the one `check` (3.1) | Exits non-zero on 11px / h2→h4 | P1 |

### 2.7 Visual design system

Evidence: 89 radii, 323 hex colours, 37 font sizes, 395 shadows, 171 CSS files.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Tokens | 8 vars in globals.css; v2 `.v2f` own set | `app/tokens.css` first in layout, from CANON. Land with today's majority values. Codemod last, per file (6.2). | `border-radius: *[0-9]` ~2,400 → <200 | P1 |
| Fonts | Zen preloaded, Zen Mono not; font-display block (24 of 33 faces) | Preload both; `swap` plus `size-adjust` fallback; Arabic behind `[dir=rtl]`; ~25 KB Latin subset | CLS from swap <0.02 | P1 |
| Colour and accents | #f5f5f7 ×1049, #fff ×1042; 12 hash-assigned accents | CANON neutrals; 6 group accents (models, chat/dev, agents, cloud, security, open source) from `--art-tide`/`iris`/`ember` | Distinct hex <60; each of 37 cloud products maps to one | P2 |
| Radii, shadows | 89 and 395 | 6 radii; 5 elevations; hairlines as ring shadow | <12 unique shadows | P1 |
| Icons | 101 inline SVG files; stroke 1.2–3 | `<Icon>` 24px grid, 1.5px stroke; tree-shaken Lucide or Phosphor Light | One stroke | P2 |
| Buttons | `.x-btn` 44, `.v2f-btn` 48, `.x-auth-b` 46 | Heights 36/44/52 via `Cta` | 3 heights | P1 |
| Imagery | 9 renders (enso, iro, kai, koe, koma, mori, oto, uta, zen) 1200x1500; 544 model pages | Art direction is a look, not a doc: per-family accent, `objectPosition`, scrim in `lib/media.json`, applied to the 37 cloud products and 544 model pages through Sigil as the designed fallback. A 12-rule sheet is a reference, not the deliverable. | Contact sheet of 12 random cloud and model pages scores ≥3 Distinctiveness | P2 |
| Product renders | Fixed 720x590 scaled; grey dots | `components/render/` (Win, Term, Phone, Dash): true size, then integer scale; crisp text; `aria-hidden` plus description | One chrome style | P1 |
| Dark rooms | 8 near-blacks | `.room-dark` semantic tokens; near-black count <5 | — | P2 |
| Glass, z-index | 7 `backdrop-filter` | Glass only on header, palette, sheet scrim; CANON z scale | ≤3 selectors | P3 |
| Theme | 0 `prefers-color-scheme` | `color-scheme: light`; dark only in rooms; dynamic `theme-color` | Inputs dark in dark rooms | P3 |
| Favicon, OG, manifest | None in app/public | Copy live set; `app/icon.svg`, 180 apple-icon, manifest | Tab icon shows | P2 |
| Invisible details | Scattered or absent | One `details.css`: `scrollbar-gutter: stable`, `font-optical-sizing`, `-webkit-font-smoothing`, `::selection`, `caret-color`, `accent-color`, 1px image outline black 8%, concentric radii, optical icon alignment, `interpolate-size` and `@starting-style` where supported | Present in base CSS | P2 |
| Drift gate | None | Part of `check` (3.1) | <10s | P1 |

### 2.8 UI component library

Only items that replace existing parts are kept. Toaster, Badge system, warm-open Tip logic and Switch redesign are deferred.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Button states | `.x-btn` hover only; JS scale on Btn/Go | CSS-first: hover in `@media(hover:hover)`, active scale(.97) 120ms, focus-visible ring, disabled, loading | 0 bare `:hover` on buttons | P1 |
| Hover policy | 438–482 `:hover` vs 2 hover media | Codemod wraps all; `touch-action: manipulation`; tap highlight off | 0 bare `:hover` | P2 |
| Focus ring | Global blue 2px; 10+ overrides; `outline:none` in 5+ pages; atomic `_outlineWidth-0px` beats `:focus-visible` on ported | CANON ring; scoped rule `main.x-ported *:focus-visible` | Tab crawl: 0 invisible stops | P1 |
| Tabs | 34 files; 22 without arrows | One APG `<Tabs>` | 0 of 34 lack ArrowRight | P1 |
| Modal | Palette, prefs, gallery, beta: no trap or return | Native `<dialog>.showModal()`; restore focus; cookie bar becomes a non-modal region | Tab ×20 stays inside | P1 |
| Inputs | 60 files; 11 unlabeled; 14–15px | `<Field>` 48px, 16px text, `aria-invalid`/`describedby`, autocomplete tokens, validate on blur | No input <16px | P1 |
| Copy button | Shows "Copied" on failure; 30px | Fallback select plus register string; `role=status`; 44px hit | Blocked clipboard ≠ "Copied" | P1 |
| Sheet and popover | `useSheet` read once; `role=menu` without arrows | One Sheet: snaps, `overscroll-behavior: contain`, safe area; Pop = disclosure | Language menu typeahead | P2 |
| Tooltip | CSS `::after` plus 180 native `title=` | `<Tip>`: `aria-describedby`, focus, Esc | 0 `title=` on button/a | P2 |
| Rails | 0 scroll-snap in page CSS | Native `scroll-snap-type: x proximity`; 14–18% peek | Touch snap at 375 | P2 |
| Animation perf | `Words` `filter: blur(12px)`; Faq height | Opacity and translate; blur ≤4px once per page; `grid-template-rows` | No filter in animated paths | P2 |
| Tokens | z-index 980/992/1000 literals | CANON; `ui-drift` check in `check` | Fails on literal `#0a84ff` | P1 |

### 2.9 Motion and interaction

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Tokens | Durations ad hoc (0.9 ×176, 1.1 ×143); springs {420,34} ×60; docs say {300,30} | `lib/motion.js` and CSS vars from CANON | 0 `duration: n` in pages | P1 |
| Budget | `variety.py` counts Rise only | 1 signature plus ≤3 supporting per page; ≤1 continuous mover per viewport; extend `variety.py` to keyframes, intervals, blur | Exits 1 on infinite plus concurrent mover | P1 |
| Reduced motion (rule for every motion row) | Opacity/blur still play; 138 files; 8 CSS files lack rule | Global `.01ms` rule; `useCalm()` with change listener; every new motion row carries a reduced-motion line and a keyboard path | `getAnimations()` empty after 3s | P1 |
| Words reveal | Opacity, y .42em, blur(12px) per word, 1s | Line-masked rise (translateY 105%→0, 700ms) using `v2/MaskLines` | <900ms for 6 words | P2 |
| Page transitions | Click-only; Back = cut; 3s hold | Reverse on popstate; cap hold 700ms with `skipTransition()`; skip on `traverse` | Back reverses | P1 |
| Lenis | `scroll-snap-type: y proximity` and `scroll-behavior: smooth` in hanzo.css | `html.lenis{scroll-snap-type:none}`; fine pointers only; one ref-counted scroll lock | `scrollSnapType === 'none'` | P1 |
| Header/mega motion | Always visible | Per 0.9; panel clip-path 320ms, close 180ms; open delay 80ms, close grace 200ms | Closes only after 200ms | P2 |
| Cursor | One pill 18px off | 6-word vocabulary max; hide in fields; dynamic import on `(pointer:fine)` | ≤6 labels | P3 |
| Live demos | 35 `setInterval` | `<Demo>` wrapper: starts at 60% visible, pauses hidden, ends at rest, one rAF scheduler. Replay/Pause strings via register. | One demo per viewport; 0 rAF when hidden | P2 |
| Number motion | Count rewinds in layout effect | Count-up on hero figures only (≤2 per screen); `min-width` ch | CLS 0 | P2 |
| Perf guardrails | 21 `blur()`; 7 `backdrop-filter` | One observer; `content-visibility`; solid 92% thumb bar | No poll DOM scans | P1 |
| Dropped | Logo-reassembles flourish, sound, haptics, odometer digits, cursor magnetism | Deleted from plan. No decoration without a reason tied to Hanzo's story. | — | — |

### 2.10 Media

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Film and Pic | 18 raw `<video>`, 106 `<img>`; 10 autoplay, 4 with poster | `Film.jsx` and `Pic.jsx` only; IntersectionObserver play/pause; reduced motion and Save-Data show poster | grep `<video` only in Film | P1 |
| Autoplay | Mixed | muted loop playsInline; **max 2 playing**; pause button for loops over 5s | ≤2 `paused=false` on /models | P1 |
| Posters, dimensions | 4 of 18 posters; 98 of 106 `<img>` lack width/height | Poster from frame 0; sizes from `lib/media.json` | CLS <0.02 | P1 |
| Codecs | VP9 WebM only, 1200x1500 | VP9 plus H.264 fallback (AV1 only if CI encode is cheap) | Card film ≤150 KB, hero ≤500 KB | P2 |
| Responsive images | `images.unoptimized`; 0 next/image | sharp: AVIF/WebP at 480/800/1200; `fetchpriority=high` on one hero image | /models grid <400 KB before play | P1 |
| Asset ownership | Dev proxies missing files to hanzo.ai; export has only /models and /fonts | `media-mirror.mjs` mirrors /logos, /connectors, /memoji, covers, faces, `/brand/hanzo-logo.png`; fails build on missing | `media-check.mjs` 0 missing | P1 |
| Sigil | Each instance own rAF | One scheduler: top 1–2 visible; low-end 15fps still; inline SVG still | ≤2 loops | P2 |
| WebGL opener | Context for every visitor | Lazy on first card `pointerenter`; context-loss handlers; router.push fallback | No context on /about until hover | P2 |
| Avatars | Hot-linked from hanzo.ai | Mirror; ≤12 KB each | 0 cross-origin | P2 |
| Delivery | No `_headers` | Content-hashed names; immutable cache; HTML revalidated | `curl -I` immutable | P2 |
| 3D | 2D canvas only | No three.js | No dependency >20 KB gz | — |

### 2.11 Mobile and responsive

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Viewport | No `viewportFit` | `{width:'device-width', initialScale:1, viewportFit:'cover', interactiveWidget:'resizes-content'}`; zoom stays | No `maximum-scale` | P1 |
| Units | 15× 100svh, 5× raw 100vh | `100svh` static, `100dvh` overlays | grep `100vh` = 0 | P1 |
| Breakpoints | 105 of ~125 queries at 900px | CANON ladder plus container queries | No `max-width: 7xx` | P2 |
| Thumb bar | See 2.4 | — | Last footer link above bar | P2 |
| Touch targets | `.x-btn.sm` 34, `.x-copy` 30 | `pointer:coarse` min 44px via `::after` inset | Script: all ≥44 effective | P1 |
| Hero fold | `--sw:420` board scaled ~0.89 | Crop at true size, not shrink; CTA first in DOM; art ≤45svh | CTA above fold at 375x667 | P1 |
| Forms | 0 `inputMode/autoComplete/enterKeyHint` | ≥16px, correct types, 52px, submit above keyboard via `visualViewport`, values preserved | Script lists missing | P1 |
| Phone perf | Curtain, 3 timers, Cursor/Morph mount on phones, 288 KB blocking CSS | `lib/perf.js` sets `html[data-perf]`; skip curtain on coarse/low-end; dynamic Cursor | Budget table in DESIGN.md | P1 |
| Pinned scenes | 64 sticky; 100vh pins | Under 900px stacked; landscape disables | No big sticky at ≤900 | P2 |
| Sheets | One height; grip-only drag | One Sheet; `pushState` so back closes | Back closes sheet | P2 |
| Verification | Browser scripts only | CI: Lighthouse mobile, Playwright 375/390/430 (Chromium and WebKit), axe. BrowserStack spot checks before cutover. | Exits non-zero | P1 |

### 2.12 Accessibility (WCAG 2.2 AA)

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Skip link, landmarks | None | Per 2.2 | `landmark-one-main`, `region` 0 | P1 |
| Contrast | `--faint` 3.62:1 (3.33 on card); `#0a84ff` 3.65:1 as text; green `#30d158` 2.02:1 | CANON colours; computed contrast check in `check`, not hand-picked | All text ≥4.5:1 | P1 |
| Menu and dialogs | Escape only; no trap/return; cookie dialog without `aria-modal` | Per 2.2 and 2.8; `useFocusScope`; combobox `aria-activedescendant` | Esc returns to trigger; focus stays 10 Tabs | P1 |
| Auto-moving content | Carousel, marquee, hero roster, rotating code, terminals, video | Pause control first in DOM (44px, `aria-pressed`); frozen under reduced motion (WCAG 2.2.2) | Pause toggles | P1 |
| Forms | Placeholders as labels; honeypot exposed | `<label for>`, inline errors, focus first invalid; honeypot `tabindex=-1` and `aria-hidden` | Empty submit focuses first error | P1 |
| Live regions | Route changes announce nothing | Focus h1 and announce title after nav (Morph stops propagation) | VoiceOver announces | P1 |
| Scroll/focus obscured | 60px sticky header | `scroll-padding-top` per CANON; check both header states | Never under header | P1 |
| Headings | ~17 ported pages lack h1; SecHead always h2 | `outline.py`: one h1, no skips; `as` prop | Per route | P2 |
| Accessible names | `aria-label` ≠ visible text | Name starts with visible text; arrows become SVG | `label-content-name-mismatch` 0 | P2 |
| Zoom/reflow | `white-space: nowrap` on hero h1; fixed 420 stage | 320px and 400% pass | `scrollWidth == clientWidth` on 10 routes | P2 |
| High contrast | None | `forced-colors` borders; `prefers-contrast: more` | Controls bounded | P3 |
| CI gate | None | axe via Playwright on all routes; tab crawl; manual VoiceOver/NVDA/TalkBack on home, models, pricing, contact, search once before cutover (manual, owner James) | 0 serious/critical on 160+ routes | P1 |

### 2.13 Performance and engineering

Targets cite `budgets.json` (0.7). They are lab targets with no field data before launch.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Budgets and CI | None | `budgets.json`; size-limit and `@lhci/cli` in GitHub Actions | Red on +50 KB import | P1 |
| Header/footer in client JS | `content.js` 375,722 B imported by `'use client'` Chrome.jsx | Render in a Server Component; client islands attach by selector | Header-only class string in 0 JS files | P1 |
| Ported twice | `Ported` is client; open-source.html 796,765 B, benchmarks 432,583, bot 365,683, platform 365,538, philosophy 289,740 | Server Component markup plus empty `<PortedBehaviour/>`; strip class bloat and empty attrs; SVG `<symbol>` sprite | open-source ≤450 KB raw; no text-node change | P1 |
| Blocking CSS | `hanzo.css` 291,410 B, 33 @font-face | Inline critical ≤14 KB; per-route purge; ≤40 KB brotli | No visual diff vs `shots/` <0.1% | P1 |
| LCP element | No preload/priority; Hero 21 KB client with opacity states | Server-render final state; `fetchpriority=high`; no `opacity:0` on LCP | Heading and image in first 14 KB | P1 |
| JS per route | 197 client components; root mounts Smooth, Progress, Morph, Phone, Cursor; both `motion/react` and `motion` | `LazyMotion` plus `m`; dynamic Cursor/Phone after idle on fine pointers; Lenis after interaction, skip touch | Ported ≤110 KB, home ≤170 KB | P1 |
| INP, CLS | Two 1.5s intervals; 393 of 492 ported `<img>` have width | One observer; build step injects dimensions; `content-visibility` with `contain-intrinsic-size` | Every img/video has w+h or aspect-ratio | P1 |
| Caching | No `_headers`; live HTML `s-maxage=60`, HSTS 30 days | `_headers`: static immutable 1 year, HTML revalidated, HSTS `max-age=63072000; includeSubDomains; preload` | `curl -sI` shows immutable | P2 |
| Prefetch | Ported links `router.push` cold | Hover and focus `router.prefetch`; Speculation Rules for top CTAs | Click after hover: no RSC request | P3 |
| Third parties | Live CSP lists GTM, Facebook, Google Sign-In, Cloudflare Insights | No third-party JS on the critical path; any tag only after consent | 0 non-hanzo requests cold | P2 |
| Build pipeline | `prebuild` runs `scripts/live.mjs` | Hermetic: committed snapshot; scheduled PR job refreshes it; `live.mjs` fails if `fetched_at` >48h | Two CI builds byte-identical (CI only) | P2 |
| Local rule | 892-route export on 8 GB | Page chats build with `HZ_ONLY=<route>` and run lint scripts (<10s) only. Everything else is CI or cloud. | — | P1 |
| Lean mode | `saveData` not read | `lib/network.js` flag: no curtain, Lenis, autoplay, hover prefetch | ≤300 KB, 0 videos | P3 |
| Resilience | No boundary around islands | Error boundaries degrade to nothing; no-JS content complete | JS off renders full | P2 |

### 2.14 SEO and machine files (mirror live, add nothing new)

Rule: only files the live site already ships. Per-page markdown twins, per-route generated OG images beyond what live has, RSS, SearchAction and hreflang are deferred. Staging is noindex, and a James decision on URL form comes before the layout shell.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| URL form and canonical | `trailingSlash:true`; live slashless (`/pricing/` → 301); no canonical | Match live; `alternates.canonical` absolute; og:url equals canonical | 893 routes: canonical = og:url = sitemap = live | P1 |
| Titles | 24 doubled "— Hanzo AI — Hanzo AI"; 13 >70; /models twice | `title.template`; strip the duplicate only; the 13 listed for James | Built = live except the 24 defects | P1 |
| Descriptions | 31 empty; home missing last sentence | Restore the exact live home sentence; list the 31 for James. No truncation, no auto-fill. | 0 unexplained empty | P1 |
| robots, sitemap | Absent; live 893 locs | Copy live robots verbatim; `app/sitemap.js` from routes | Count = routes.json | P1 |
| Redirects, 404 | None in export | `public/_redirects` from live diff; 404 status | Each live URL 200 or a single 301 | P1 |
| llms.txt and api-catalog | Absent; live has llms.txt (199 KB), llms-full.txt (3.2 MB), security.txt, `Link` headers | Copy from live; `_headers` Link | /llms.txt 200 | P1 |
| JSON-LD | 148 files; Organization repeated; BreadcrumbList on 68 | `@id` graph; one Organization; logo URL exists | Parses; 0 broken URLs | P2 |
| Internal links | Opener cards may be non-links | Real `<a href>` on every card | 0 orphans | P1 |
| Image alt | ~194 `<img>` lack non-empty alt | Alt from nearby existing label | 0 missing | P2 |
| Robots meta | 404 noindex only | `noindex,follow` on signup, login, pay/*, console, sms-opt-in; not in sitemap | Documented list | P2 |
| Parity gate | Text only | `seo-diff` rule inside `check`: title, description, canonical, robots, h1, JSON-LD types, og:image, link count vs live | 0 unexpected on 893 | P1 |
| Monitoring | None | Baseline of top 200 queries and 100 pages before cutover; day-7 and day-28 compare; rollback in 6.4 | Dated CSV | P2 |

### 2.15 Catalogue and product pages

Compare tray, facet bar, maker rail of chips, cloud "Find a product", `?cmp=`, J/K keys, share button and a newly created index of 470 models are deferred (section 7). The deeper version is below.

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Reachability | ~26 hand-typed cards plus 34 rows; 470 model pages and 73 makers unlinked | Link every existing model and maker page from the existing /models structure: collapsed link list per maker, real `<a href>`, nothing visible by default beyond what is there now | Every one of 470 and 73 pages reachable from /models in DOM | P1 |
| Card anatomy | Three card types | One `ModelCard`: name, mono id, ctx/rate row, maker monogram via Sigil; stretched link | Same component in 4 contexts | P2 |
| Open into page | WebGL for 9 flagships only | Morph (2.3) for every card; reduced motion = cut | Title within 12px of destination | P1 |
| Model header | Readout prints "…" | Name, lede, three numbers (ctx, in, out) largest, existing CTA pair; id mono pill; "…" replaced by an em dash with an accessible name from the register | 5-second one-line answer | P1 |
| Spec matrix | Facts only what Hanzo prints | Typed table (Identity, Limits, Price, Modalities); chips only where the sentence contains the phrase; empty rows omitted | 20-page traceability | P2 |
| Price clarity | Rounding varies | Same rounding rule everywhere | Same figure in card, table, page | P2 |
| Quick start | Auto-rotates every 5.2s | Stops on hover and focus; language persists | Snippet id = header id | P2 |
| Related | Sibling rail | Keep rail; rank same maker/family, then nearest ctx and output price; max 6 | ≥2 other-maker where within 3× | P3 |
| Cloud product template | 42 products | Anatomy: identity, console, 3-fact strip from existing text, openable features, Band | Consistent across 42 | P2 |
| Scale and a11y | — | ≤12 canvases; `content-visibility`; axe 0 serious on 4 templates | Lighthouse ≥90 | P2 |
| Status labels | Duplicate "Enso" rows | Visible id disambiguates | No same-name row without id | P3 |
| Phone catalogue | Horizontal-scroll table | List rows (72px), not a table | No horizontal scroll | P1 |

### 2.16 Developer experience

StartStrip, DevRail, InstallPicker, MCP client tabs, "Add to Cursor" links and language-sync events are deferred. Deeper version:

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| CodeBlock | Six surfaces (Sdks Console, McpPage, CliPage, IdePage, DevPage, ApiPage) | One `CodeBlock`: 13.5px/1.65, scroll region (tabindex 0, label), Shiki build-time, 5 colours ≥4.5:1, textContent identical to displayed | One `<pre>` owner | P1 |
| Copy | False "Copied"; `$ ` prefixes | Copy equals displayed text. Prefix `$` is `user-select:none` rather than stripped. A shell block does not become JSON. | Paste runs in zsh | P1 |
| Language tabs | Console tabs without panels, emoji icons | APG tabs; fixed height; remembered language in localStorage with try/catch | Pick Python on /sdks, /api and /mcp show Python | P2 |
| /api | No request/response | Existing chat request first; existing response shown; Copy adds nothing not displayed (1.3 #5) | Copy returns 200 | P1 |
| MCP config | Copy includes `//` comments and shell lines | Split displayed blocks so each is pure (JSON block, shell block); copy equals block | `JSON.parse(copy)` succeeds | P1 |
| Key path | 15 key CTAs to platform.hanzo.ai/api-keys | `KEY_URL` constant; `?from=`; same tab | One constant | P1 |
| Docs handoff | Raw absolute URLs repeated | `lib/devLinks.js` map; build-time link check | All 200 | P2 |
| Terminal demos | Autoplay, no pause | `Terminal` wrapper: 40% in view, pause, static final frame, SSR poster | Hidden tab 0% CPU | P2 |
| SDK page | Console 3 languages vs 6 official | Picker drives existing blocks only | One gesture updates all | P3 |
| Machine surface | public/ lacks skill.md/llms.txt | Confirm served or copy from live | 200 on 4 routes | P2 |
| Trust cues | Typed `v0.7.7` | Versions from registries at build | No hand-typed versions | P3 |
| A11y, perf | Chips role=tab without panels; duplicate sr DOM | axe in CI; samples once in panels | 0 serious/critical on 8 dev routes | P1 |

### 2.17 States and resilience

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| No-JS | 333 `opacity:0` states; no noscript | Per 2.3 | JS off legible | P1 |
| Error boundary | None | `app/error.jsx` (keeps header/footer), `global-error.jsx`, `loading.jsx`; boundaries around Sigil, Opener, Phone, Cursor | Throw in Sigil leaves the page | P1 |
| Live data | Swallowed `.catch(() => {})` | `fetchLive(url,{timeout:6000,ttl})`: AbortController, 1 retry, 403/429 = unreachable; build snapshot fallback; "as of" stamp from register | API and GitHub blocked: page complete, no console errors | P1 |
| Submit states | SmsOptIn shows done on failed POST; honeypot silent; Founder ignores 2nd form; BuyingSpecialist swallows errors | idle/sending/failed/sent; failure keeps form and shows Hanzo's existing error string (Grants: grants@hanzo.ai); idempotency key | Blocked POST shows no success; retry delivers once | P1 |
| Consent | No Reject all; no GPC; Accept stores `sale:true` | Equal-weight Reject all; honor `globalPrivacyControl`; focus trap in prefs; ≤220px at 375x812 | Reject visible in first view | P1 |
| Arrival safety | Stuck state if script errors | CSS-only failsafe at 3.5s | Error → visible ≤3.5s | P1 |
| Media failure | No `onError` | Aspect-ratio plus Sigil fallback; `webglcontextlost` handler | Blocking /media leaves tiles | P2 |
| Offline | None | Banner and disabled submit with a register string | Banner ≤1s | P3 |
| 404 | See 2.2 | — | — | P2 |

### 2.18 Measurement and handover

Deferred: PostHog, Sentry dashboards, edge A/B, six funnels as dashboards, DPIA programme, tree testing, session replay. Kept:

| Element | Today | Plan | Acceptance | Pri |
|---|---|---|---|---|
| Baseline on live | None | Before any build ships, add a cookieless first-party aggregate counter (page, CTA slot, referrer class, no IP, no persistent id; no consent needed) to live hanzo.ai, or use existing Cloudflare Web Analytics. Run 14 days. Record in `docs/BASELINE.md`: visits by source, clicks on signup, pricing and contact-sales, form submits. | File dated | P1 |
| Tracking plan | None | `docs/MEASUREMENT.md`: 12 events, `object_action` names, no PII, ids not copy. `lib/track.js` is the only SDK import; the tool is a later choice. | Events in code = events in doc | P1 |
| Consent layer | `hz-consent` fires; nothing listens | Identifier-bearing layer loads only after consent; GPC/DNT = decline | 0 identifier requests without consent | P1 |
| Pageviews and CTAs | No data-attributes | `page_view` on committed route; `data-cta="<page>.<slot>"` on every primary; `hz_sid` plus cta id appended to app-bound links; `app_handoff` via `sendBeacon` | `/` → /pricing → back = 3 events; hover = 0 | P1 |
| Funnel proof | "track() exists" | Staging funnel report shows non-zero counts for: visit, cta_click, signup_start, signup_complete, api_key_created, first_call, contact_sales_submit | Report exists | P1 |
| Form events | Only ContactSales has consent and UTM | `useFormTrack`: view, start, error (name only), submit, success, fail, abandon; honeypot = `spam_blocked` | No field value in payload | P2 |
| Field vitals | Lab only | `web-vitals` attribution (~2 KB) | p75 by route | P2 |
| Error beacon | None | 20-line `error.jsx` beacon with release = git sha | Throw yields event | P2 |
| Experiments | Static export | No A/B. Use staged rollout (6.4) and pre/post comparison. If traffic ever supports about 13,000 visitors per arm, add tests with a stated hypothesis, metric, minimum effect and n. | — | — |
| Lint and types | No ESLint, Prettier, jsconfig | ESLint (next/core-web-vitals, react-hooks, jsx-a11y), Prettier, `checkJs` on `lib/`; ban raw `fetch` to api.hanzo.ai outside `lib/api.js` (9 hard-coded today) | `npm run check` exits 0 | P1 |
| Environments | `HZ_DEV`/export; hard-coded endpoints | `.env.example`; staging noindex and sandbox endpoint so tests never create real leads | No prod host in staging | P1 |
| CI/CD | No `.github`, no rollback | See 3.1 (Step 0) and 6.4 | Preview <15 min; rollback <2 min | P1 |
| Tests | 6 unit plus page-local | Link checker over `out/`; routes vs pages vs sitemap parity; copy-freeze hash of each `content/pages/*.html`; form payload contract with mocked fetch | One-word change fails | P1 |
| Ownership | MaskLines clash | `FILES.lock` table (3.2); CODEOWNERS | <3% duplication | P1 |
| Handover | README plus chat briefs | `docs/HANDOVER.md`, `RUNBOOK.md`, `DECISIONS.md`; archive PLAN and BRIEF-v3; list 5 risks (api.hanzo.ai contracts, GitHub 60/h rate limit, WebGL, static-export limits, 892-route build time) | New engineer deploys staging in under 60 min | P2 |
| Security posture | No audit, Dependabot or CSP | Dependabot weekly; `npm audit`; `_headers` CSP allowlist tested with inline ARRIVE and JSON-LD | Header grade at least live | P3 |
| Dependency allow-list | Not stated | `docs/DEPS.md` with gz size per dependency (Shiki build-time only, sharp and ffmpeg in CI only, web-vitals, Lucide subset); nothing client-side over 20 KB gz | Fails over budget | P2 |

---

## 3. Build order and ownership

### 3.1 Step 0, before anything else (conductor)

- CI skeleton: install, `npm run check`, build with `HZ_ONLY`, copy-freeze hash, link check, contact-sheet job (0.3), preview per PR.
- `npm run check` is **one script with about 6 rule groups**, not 14 scripts: (a) copy and numbers (copy-freeze hash, numeric diff, link parity, SEO diff), (b) tokens and presentation (font floor, contrast, radii, hex, shadows, z-index, durations, DataTable use), (c) CTA audit (solid count, label and href vs `lib/cta.js`), (d) media and assets, (e) IA and links, (f) structure (one h1, no raw `<video>`/`<img>`/`<table>`/`.x-btn`/`function Hero`, no `setInterval` in chrome, `100vh`, bare `:hover`). It runs in under 10 seconds, locally and in CI.
- Lint bans land now so page chats cannot fork shared parts.
- CODEOWNERS and `FILES.lock` (3.2).
- `docs/STRATEGY.md`, `CANON.md`, `REFERENCES.md`, `LEDGER.md`, `ui-strings.json`, `BASELINE.md` (the live counter starts here).

### 3.2 File ownership (`docs/FILES.lock`)

One named chat owns each shared file. Other chats send a request file and never edit it.

| File | Owner |
|---|---|
| `tokens.css`, `globals.css`, `layout.js` | Design-systems chat |
| `Chrome.jsx`, `Nav.jsx`, `HeaderTools.jsx` | Chrome chat |
| `ui.jsx`, `kit.jsx` | Kit chat |
| `v2/*` | Hero/page-frame chat |
| `lib/*` | Data chat |

Page chats only consume the kit and add `Persona:`/`Goal:`/`CTA:` comments (derived from the route table where possible, not free text).

### 3.3 Order

1. Step 0 above, plus the live baseline counter and copy decisions (1.3) requested from James.
2. Tokens (`tokens.css`, `lib/motion.js`, `lib/bp.js`), with today's majority values.
3. Base CSS and states (no-JS rule, reduced-motion block, focus ring, hover wrap, text-wrap), then layout shell (server header and footer, skip link, one `<main>`, viewport, metadata helper, fonts).
4. Data single sources (`lib/plans.js`, `BACKERS`, `figures`, `lib/cta.js`, `lib/links.js`, `lib/devLinks.js`, IA table, redirects).
5. Kit v0 (`Cta`, `Tabs`, `Dialog`, `Field`, `Faq`, `DataTable`, `CodeBlock`, `Stat`). **Page chats may start here**; later kit parts are "after merge", not blocking.
6. Nav and chrome, `PageHero`, `Band`, Ported auto-hero.
7. Media (`Film`, `Pic`, `render/`, mirror, build).
8. Forms and live data (`LeadForm`, `fetchLive`, consent), resilience (`error.jsx`, arrival rewrite).
9. Performance delivery (critical CSS, `_headers`, LazyMotion, dynamic layers), SEO and machine files.
10. Measurement.
11. Codemods (6.2). Handover docs.

---

## 4. Common gate (8 lines, every page)

1. `Persona:`, `Goal:`, `CTA:` and metric id in the header.
2. One h1 in server HTML; `PageHero` and `Band`; kit parts only (no raw `<video>`, `<img>`, `<table>`, `.x-btn`).
3. Tokens only (CANON); one filled primary per viewport; `data-thumb`; `data-cta` on every primary.
4. Copy parity 0 missing; link parity 0 unexpected; numeric diff clean; UI strings only from the register.
5. Reduced motion shows the final state; JS off is legible; every new motion has a keyboard and reduced-motion path.
6. LCP, CLS, INP within `budgets.json`; 375x812 and 1470x801 pass; no horizontal scroll at 320.
7. Contact sheet attached; rubric scores (no axis below 3).
8. Ledger entry: what this page deleted.

---

## 5. Per-page briefs (the 10 money pages)

Format: thesis; section order with one job each; hero object and composition (focal point, read order, scale ratio, light side); signature interaction; removed.

### 5.1 `/` (home)

- **Thesis.** One key reaches every model, for less.
- **Order.** 1 Hero (promise). 2 Models and Platform (breadth). 3 Agents. 4 Race, Cheaper, Pareto, consecutive (proof of the claim). 5 Open source. 6 Trusted (before Pricing). 7 Pricing (price). 8 Backed by (static names). 9 Band. Order stays unless section_view data justifies a change.
- **Hero object and composition.** Focal point: the desktop app at 100% scale, centred low (about 18% headroom). Read order: 1 H1, 2 primary action, 3 app. The phone mock is about 0.45× the app width and sits right and behind, entering at 600ms. The terminal docks as a one-line install strip under the CTA. The roster shows about 6 rows at 14px or larger. The light source is top left on every object. Nothing inside the stage is smaller than 12px. Text contrast ≥7:1.
- **CTA.** Primary "Start free" if that label exists in the live copy (1.3 #10), otherwise the existing top label. Secondary is a text link "Install CLI". Google and GitHub are outlined. Beta ribbon, Open App and Download App become text links. Exactly one solid fill.
- **Scroll choreography (per object).** The hero app lifts 24px and fades as the Models grid rises. The old object leaves as the new one arrives, over 40px of overlap. Race, Cheaper and Pareto share one background room so the story reads as one argument. Each section holds the screen for one idea.
- **Signature interaction.** A model card opens into its page (Morph).
- **Removed.** The counter; the second Pareto headline above the fold; two marquees; the sign-in panel's competing H1.

### 5.2 `/pricing`

- **Thesis.** Know the price before you ask.
- **Order.** Audience tabs (existing Personal/Team/API), plan cards, first 3 FAQ questions, Privacy and Trust links near the CTA, Band.
- **Hero object.** The plan cards themselves; focal point is the recommended card only if a written rule exists; read order left to right; aligned CTAs.
- **Signature.** Prices roll in ≤300ms, no blur, announced politely.
- **Removed.** Dead buttons; the "Pay as you go" competing definition.

### 5.3 `/enterprise`

- **Thesis.** It runs where you need it, and you can verify it.
- **Order.** Where it runs, trust strip (within 2 screens), results, GPU drawer, one "Talk to sales".
- **Hero object.** A deployment diagram from existing text; focal point is "where it runs"; read order top to bottom.
- **Signature.** Diagram animates in (0.9s, once).
- **Removed.** The repeated deployment block; duplicate sales buttons with different labels.

### 5.4 `/models`

- **Thesis.** Every model has a page, and the page opens from the card.
- **Order.** Editorial families, maker shelves, collapsed link lists (reachability).
- **Hero object.** The model grid; at least 6 cards above the fold at 1440x900.
- **Signature.** Card opens into the model page.
- **Removed.** Per-item `whileInView` (replaced by a list-level entrance); auto timers.

### 5.5 Model page (template)

- **Thesis.** Pick it and try it.
- **Order.** Name and three numbers, CTA pair, spec table, quick start, related, Band.
- **Hero object.** The film or Sigil at 4:5 on the right; the three numbers largest on the left; light top left. Readable with animations off.
- **Signature.** Arrives by Morph from the card.
- **Removed.** "…" readouts; auto-rotating snippet.

### 5.6 `/api`

- **Thesis.** The first call works on first paste.
- **Order.** Existing request, existing response, key CTA adjacent, error line, docs link.
- **Hero object.** The `CodeBlock`; focal point is the request; scale: code 13.5px with the Copy button at 44px.
- **Signature.** Response streams in once, pausable.
- **Removed.** Gated key placeholders; hidden 429 art.

### 5.7 `/chat`

- **Thesis.** The best chat for the price.
- **Order.** Hero with the existing app render, plan cards (existing), Download (OS preselected only if existing), Band.
- **Hero object.** The chat window at 100%.
- **Signature.** The existing "Open" action with a handoff state.
- **Removed.** Competing "Open App" and "Try Hanzo" at the same weight. The public chat try-before-signup is parked (7).

### 5.8 `/agents`

- **Thesis.** An agent can sign up and pay by itself.
- **Order.** Hero, the existing literal sequence at `#headless`, `AgentPrompt` (one component), Band.
- **Hero object.** The sequence as a numbered code block.
- **Signature.** Terminal demo with pause and static final frame.
- **Removed.** The six `AgentPrompt` re-implementations.

### 5.9 `/platform` (cloud)

- **Thesis.** 37 products, one sovereign cloud.
- **Order.** Hero, the product directory (44px rows, 3–4 columns), diagram, Band.
- **Hero object.** The directory itself; each product gets its group accent and Sigil.
- **Signature.** Row hover/focus reveals the existing description.
- **Removed.** The 100% white panel look; uneven link lists.

### 5.10 `/security`

- **Thesis.** An honest status, easy to verify.
- **Order.** Status row in Hanzo's words, chips, DPA and subprocessors, security.txt link, contact.
- **Hero object.** Typographic status row; no seals.
- **Signature.** None; this is a utility page (0.4s entry).
- **Removed.** The split with /trust; any invented certification mark.

---

## 6. Priorities, migration, rollout

### 6.1 Priority 1 (capped at 40 rows)

**Visible moments (12):** home hero composition; one-CTA hierarchy; curtain trim; pricing truth and dead buttons; mega-menu stage; Morph on every model card; model-page header; enterprise order; type and contrast floor; mobile hero fold; light/dark room arc; server-rendered text.

**Breakage and legal (each a P1):** SMS success on failed POST; Reject all and GPC; no-JS opacity; broken or unmirrored media; false "Copied"; invalid MCP copy; skip link and landmarks; focus trap on dialogs; pause controls (WCAG 2.2.2); redirects, canonical and sitemap; `error.jsx`; arrival failsafe; server-component header/footer (bundle size); consent-gated measurement; the live baseline counter; contact-sales form robustness; signed-in header swap; copy-freeze and numeric gates; Step 0 CI.

Everything else is P2 or lower. CI hygiene, Sentry, Dependabot and budgets are one parallel infra track owned by one chat, not part of the 40.

### 6.2 Migration against the 20 live chats

1. **Freeze list.** Starting now, the 20 page chats may not edit `ui.jsx`, `kit.jsx`, `Chrome.jsx`, `v2/*` or `lib/*` (the MaskLines clash is the precedent). They request changes through `FILES.lock` owners.
2. **Consume as it lands.** Chats adopt tokens, `Cta` and `PageHero` as each merges (step 5 of 3.3).
3. **Thrown away.** Any page work that forks a button, hero, tab set or table is rewritten once the kit part exists. This is stated up front.
4. **Codemods.** `tokenize.mjs`, hover wrap, fork-button removal and `title=` sweep run per file, only when a page chat merges, and never on files with open PRs. A one-day freeze window is used only for the final sweep. Per-route branches and a rebase bot handle the rest.
5. **Merge order.** Tokens, kit v0, chrome, then pages by journey (Evaluate, Build, Buy first).
6. **Re-skin sweep.** Each page gets one checklist entry (section 4) after the kit lands.

### 6.3 Pinned chapters and heavy home choreography

Ship as a flagged test behind the staged rollout, not as the default. Default home keeps 9 sections with per-object choreography (5.1).

### 6.4 Staged rollout (replaces single cutover)

- Staging is noindex; the URL-form decision is made before step 3 of 3.3.
- Edge split 5/25/50/100% per 48 hours, home and /pricing first, then the rest.
- Automatic halt if, relative to the control, any of these drops: `signup_start` rate or `contact_sales_submit` rate by more than 15%; LCP p75 above 2.5s; JS errors above 1% of sessions.
- Rollback in under 2 minutes by keeping the previous build.
- SEO rollback if there is a drop of more than 20% for 7 days against the day-0 baseline.
- Named funnel owners (Dev activation, Enterprise lead, Pricing) review weekly for the first 8 weeks.

---

## 7. Deferred (bigger, not deeper). Not part of this project

Compare tray and `?cmp=`; faceted catalogue with maker chip rail and sort; cloud "Find a product"; `StartStrip`; `DevRail`; `InstallPicker`; MCP client tabs and "Add to Cursor"/VS Code links; language-sync events; audience routing row with stored role; `<NextUp/>`/`<Next/>`, prev/next and J/K; Chapters rail; public chat try-before-signup (needs a cost cap, per-IP limit, a 3-message cap, kill switch and fallback to the existing `/chat?q=`; revisit only if James confirms the backend); PostHog, Sentry dashboards, edge A/B, alerts, RUM dashboards; tree testing, VPAT/EAA statement and DPIA (moved to a launch-readiness list outside this plan); per-page markdown twins, per-route generated OG images beyond live, RSS, SearchAction, hreflang; `Toaster`, `Badge` system, warm-open `Tip`, cursor magnetism, haptics, logo flourish, sound; OffscreenCanvas worker, scrubbed video, P3 AVIF, AV1 as a requirement; page-type first-screen timing table (replaced by one motion budget); TrustRow on pages that lack a trust block.

---

## 8. Top 12 things that were missing (sorted by funnel stage)

1. **Understand.** No governing goal or conversion spec; fixed by STRATEGY.md and the primary metric `api_key_created`.
2. **Understand.** The home hero has no composition and offers 8 actions; it needs a focal point, read order and one primary (brief 5.1).
3. **Understand.** The arrival curtain costs every first visit up to 2.4s; capped at 700ms and home first-visit only.
4. **Try.** First-paste failures (false "Copied", invalid MCP copy, POST cURL without Content-Type) cost more trust than any visual flaw.
5. **Try.** Three pricing truths and four buttons that link to the page they sit on.
6. **Activate.** Returning developers see "Start free"; the signed-in swap and the server-side key event are missing.
7. **Buy.** Customer proof dates 2015–2020 and "Backed by" contradicts /enterprise; both need James's decision, and old proof moves below current proof.
8. **Buy.** Enterprise order and the lead-handling loop (who answers, how fast) are undefined.
9. **Acquire.** Rankings risk in the move: URL form, canonical, robots, sitemap, redirects, llms.txt, favicons.
10. **Acquire.** AI crawlers and agents read exported HTML only; 333 `opacity:0` states hide text.
11. **All.** Accessibility is systemic: no skip link, 3.5:1 text, dialogs without focus return, moving content without pause controls.
12. **All.** Nothing enforces the rules across 20 parallel chats; Step 0 CI, `FILES.lock` and the subtraction ledger fix that.

**What was not verified.** No browser, Lighthouse or Playwright run was done (James's rule). Lab numbers are targets for CI. Live-site facts come from text fetches, not rendered styles. Reference teardown measurements (0.4) and baseline scores (0.2) are still to be produced.