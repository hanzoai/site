> **Conductor overrides (7 Nov 14:20), and they win over anything below:**
> 1. **COPY IS FROZEN.** Every proposal below to rewrite, shorten, merge, cut or rename any Hanzo headline, claim, button label or link is void. That includes "one headline instead of two", "the claim is cut", "Try Zen is cut" and the "stranger sentence". Change only presentation, hierarchy, flow and motion.
> 2. **No live AI calls from the page.** The hero "prompt box" is a scripted demo of real Hanzo content, so it costs Hanzo nothing.
> 3. **`docs/JAMES.md` wins on taste:**
>    - Colour: 0 UI hues (greys, silvers, blacks, whites); colour comes only from Hanzo's media.
>    - No badge, pill or eyebrow above any headline.
>    - Motion is not just scroll.
> 4. **Hanzo facts not yet confirmed** (SOC 2 or ISO, logos, the "200x" method, analytics) stay exactly as the live site states them. Add nothing, imply nothing.

# Hanzo site brief v3

Audience: James (read the next block only) and every build chat (read the rest). This supersedes the v2 "add motion" framing. A rule marked "proposal" is not evidence and needs James's yes.

## 1. The goal in one paragraph

**For James (six lines, no code):**
1. **Goal:** a visitor understands Hanzo in five seconds and does one thing, usually "Get API key".
2. **Hero object:** one live prompt box on an empty dark stage. It types a real question, streams a real Zen answer, and a price counter beside it stays at $0.0000. Nothing else competes with it.
3. **Three changes on home:** one headline instead of two. Four product cards (Zen, API, Chat, Dev) instead of about 60 links. A card opens into its own page, which is the synchronized.studio move you like.
4. **What stays:** every Hanzo word, number and link. Detail moves behind clicks and is not deleted.
5. **What you decide:** the sentence below, the one action colour, and the Motion+ licence (Open items 1 to 3).
6. **How we proceed:** I build the home page only, show you stills at desktop and phone plus one clickable pass, and you approve the feel before anything else is built.

**The stranger sentence (proposal, built from Hanzo's words "one API for every model" and "200x faster and 400x cheaper"):** *Hanzo is one API for every model, faster and cheaper, and you can try it before you sign up.* If a competitor or method challenges "200x faster and 400x cheaper", the fallback headline drops the superlatives and keeps only "One API. Every model." The build chat does not choose between them. James does.

**Big idea (proposal): one live object on a quiet stage.** Hanzo owns candidate raw material in its own names (Zen, Enso, Kai). The idea is that the product is the only thing that moves while everything else is still. Luxury here means three things:
- Empty space.
- A real product, not art.
- Anything that waits does so on purpose, and anything that responds is instant.

**Pacing rule:** the page is instant to respond (press under 100ms, prices in static HTML) and unhurried to reveal (0.4 to 1.2s). That does not contradict the speed positioning. The reveal never blocks an action, so the button is clickable from first paint.

**Why v1 scored 4/10 (observed on the live site):**
- Two competing headlines on home.
- About 60 nav links.
- Product names (Enso, Kai, Koma, Iro, Mori, Oto, Koe, Uta, Base, Datastore) used before they are defined.
- A different primary CTA on almost every page.
- Login before value on /chat.

**Ranked goals, with measures (proposal; goes at the top of docs/VISION.md):**

| # | Goal | Event to log | Baseline | Target |
|---|---|---|---|---|
| 1 | Developers, agents and founders create an account and an API key at api.hanzo.ai | `cta_click`, `key_created`, `curl_copied` | From v1 analytics, read before build | Set once baseline exists. No invented numbers. |
| 2 | Consumers enter Chat and Go or Pro plans | `chat_prompt_sent`, `plan_click` | same | same |
| 3 | Enterprises talk to sales (enterprise@hanzo.ai, /contact-sales) | `contact_submitted` | same | same |
| 4 | Installs of Hanzo Dev (`curl -fsSL https://hanzo.sh | sh`) and stars (1,600+ repos) | `install_copied` | same | same |
| 5 | Investor and recruiting credibility | `investor_email_click` | same | same |

Primary metric: share of landing sessions that create a key. Second metric: median time from landing to first successful API call. Both stay unknown until Hanzo shares analytics. "60 seconds" is not promised on the page until a stopwatch test on the real signup flow proves it.

**Instrumentation:** first-party event log only (no third-party scripts above the fold). The hero line is tested as a pair: belief sentence A against Hanzo's current headline B, with a minimum sample and a stopping rule agreed before launch.

**Free-first-value cost and abuse guard (the one unasked technical risk that threatens the build):** an anonymous prompt box and a free curl run cost real inference.
- **Cap per visitor:** 3 live prompts per IP and per browser.
- **Daily spend cap:** a hard site-wide ceiling. When it is hit, the box switches to a pre-recorded real answer with a "Sign in to run your own" action.
- **Bot handling:** rate limit at the door and token-length caps, with no Cloudflare bot-check on forms (existing rule).
- **Failure states:** loading is a skeleton of fixed height. Rate-limited, offline and error each have written copy. If the API is slow, the page shows the measured latency honestly.

**Competitor frame:** the real field is OpenAI direct, OpenRouter, Together, Fireworks, Groq and Bedrock. The page must answer "why not OpenRouter?" with a sourced line.
- The method link behind "200x faster and 400x cheaper" is mandatory.
- If Hanzo cannot supply the method, the claim is cut.
- Zen models, the sovereign cloud (~37 cloud products) and open source are the answer to commodity pitches. They sit in chapters 3 and 5 of the home page.

## 2. Audiences and their jobs

| Audience | Objection to beat | Proof that convinces | The one action |
|---|---|---|---|
| Developer | "Another gateway." | Working curl against api.hanzo.ai/v1 with a real streamed response; model IDs; price per million tokens in static HTML; "Start free: 50 requests a day" (from /api; shown or hidden is a test, see section 11) | **Get API key** (secondary: Read the docs) |
| Founder / CTO | "Switching costs me a rewrite." | The savings slider (Cheaper.jsx) with their own usage; "200x faster and 400x cheaper" with its method one click away; "a budget on every key" | **Get API key** |
| Enterprise buyer / security lead | "Not safe on our data." | The evidence checklist below | **Talk to sales** (secondary: Get Enterprise plan) |
| Researcher / contributor | "Marketing, not research." | Hero figure with its caveat on the same screen (Dev: "3.02x faster", "42 of 44 tasks", "95% interval 2.06-4.36x"); model cards; repos | **Read the method** (secondary: View on GitHub) |
| Consumer | "I already have an app." | A prompt box with no login; Free $0, Go $8/mo, Pro $15/mo | **Try Hanzo** |
| Investor | "Is there traction?" | 1,600+ open repositories, Techstars '17, sovereign AI cloud (from /about) | Email contact (footer and /investors only) |

**Enterprise evidence checklist.** Each item needs an owner at Hanzo and a due date. If an item does not exist, the page omits it, James is told, and the page never says "available on request".
- Four places to run it: Hanzo Cloud, your cloud, your servers, air-gapped.
- SSO via OpenID Connect and SCIM 2.0.
- Per-organization database.
- Audit log.
- Written uptime guarantee, with the number.
- Security or trust-center URL.
- DPA and subprocessor list.
- Data retention and zero-retention terms.
- Region list.
- Pen-test status.
- Procurement contact.
- Named AI-relevant reference customers.

**Rules:**
- **Home serves developers first.** Consumers get a text link under the hero button, and enterprise gets the closing Band. Enterprise is not in the hero.
- **Customer results are commerce results.** Damon $8.4M in 30 days, Triller 169M viewers, SKULLY $2.5M and the rest are real Hanzo content, but they are commerce outcomes. Label them as such and move them earlier on /enterprise.
- **No SOC 2 or ISO 27001 claim** unless James confirms Hanzo holds it.
- **Thin-proof plan.** Real proof today is 1,600+ repos, Techstars '17 and the 3.02x result. The proof chapter is designed around one live number, the 3.02x result with its interval, and lets space carry the rest. Logos and named quotes are added only if permitted. The page must look finished without them.

## 3. Site logic

### 3.1 Information architecture

**Header (one rule, no contradictions).** The header holds the logo, five items, a "Log in" text link and a "Talk to sales" text link. At the top of a page there is no solid button in the header. "Get API key" fades in as the solid header button only after the hero button leaves the viewport (the Apple local-nav pattern from section 3.3). Exactly one solid button is visible at any moment.

The five items are **Products, Models, Developers, Enterprise, Pricing.** Each opens a mega-menu of at most 4 items per group. Every entry has its name plus a six-word descriptor from Hanzo's own pages, which fixes the undefined names.

| Item | Menu content |
|---|---|
| Products | API, Chat, Dev, Agents, Cloud |
| Models | Zen, Enso, Kai, Creative, Partner models |
| Developers | Docs, CLI, SDKs, MCP, Benchmarks, Blog |
| Enterprise | Platform, Security, On-prem, Contact sales |
| Pricing | Plans, API prices |

Company pages (About, Careers, Investors, History) live in the footer. Nothing is deleted, only demoted: the footer keeps every existing link.

- **Cmd+K palette** lists every page (pattern: motion.dev Command Palette). Phone equivalent: a full-screen search sheet opened from the menu button.
- **Skip link** is the first tab stop.
- **Hick's law is measured, not claimed.** Header 5 items, menu at most 4 items per group, home 4 product cards, one solid button per screen. The gate script counts all four.

### 3.2 The visitor path: question and answer per screen

Each screen answers the question the previous one created. Copy lines are proposals built from Hanzo's words.

| # | Screen | Question the visitor has | What answers it | Last line that sets up the next |
|---|---|---|---|---|
| 1 | Promise | "What is this?" | Headline, one proof line, live prompt box | "See it work." |
| 2 | Show it | "Does it really work?" | Pinned scene: a real Zen answer streams, price stays $0.0000 | "One key opens every model." |
| 3 | One key, every model | "Why not what I use?" | One figure plus method chip; first place a product name is defined | "Your code stays the same." |
| 4 | Build | "How hard is it?" | Terminal: typed curl, streamed response, Copy | "Run it where you choose." |
| 5 | Run it where you choose | "Is it safe at my size?" | Four places, one line each | "Here is the evidence." |
| 6 | Proof | "Who says so?" | 3.02x with interval; 1,600+ repos; logos only if permitted | "Start in a minute." (only after the stopwatch test; otherwise "Start free.") |
| 7 | Close | "What do I do?" | One sentence at Display size, one button | End. |

### 3.3 The CTA system

Config lives in `lib/cta.js`: `{primary, secondary, tertiary}` per page type. Header, hero and closing Band all read it, so labels cannot drift.

| Label | Action |
|---|---|
| Get API key | Signup plus key at api.hanzo.ai |
| Try Hanzo | Consumer signup / Chat |
| Install Dev | Copy the install command |
| Open Dev | Logged-in app |
| Talk to sales | Contact sales |
| Start free, Get Go, Get Pro | Plan buttons on /pricing only (outlined; see rule 4) |
| Log in | Always a header text link |

Rules:
1. **One solid button per screen.** The gate counts solid buttons in the first viewport and in the Band. More than one fails.
2. **Primary CTA appears three times:** hero, after the proof chapter, closing Band. The header copy exists only while the hero button is off-screen.
3. **Sticky sub-nav CTA (Apple pattern, source: AirPods Pro markup `data-localnav-trigger-anchor`).** Product pages have a sticky local nav (proposal: 52px) with the product name left and tabs plus the CTA right. The CTA fades in (opacity, scale .96 to 1, x 8 to 0, 250ms, ease-calm) only after the hero CTA leaves view. The verb is the same in nav and hero. The home page and the global header use the same trigger.
4. **Secondary CTA** is a text link with a chevron that nudges x +3px. No second solid button in the same block. The pricing row is the exception: only the recommended plan is solid, and the others are outlined.
5. **Risk-reducer line** (12px) under each solid button, real Hanzo text only: "No card needed" (Free), "Cancel anytime" (Go, Pro), "Start free: 50 requests a day" (/api, A/B tested).
6. **Try before sign-up** where the page type allows: Chat prompt box, API curl with copy-run, savings slider, static prices.
7. **Copy-to-clipboard CTA** for developer actions (osply.co pattern): label slides up in a mask, "Copied" slides in, 600ms, holds 2s, swaps back; `aria-live="polite"`.
8. **Closing Band repeats the hero button verbatim** as the one solid button. Below it sits one full-width text row, "Talk to sales" (or the page's secondary), with a 56px+ hit area and an arrow nudging 6px up-right on hover (grubogrubo.com contact block). That is a repeat plus one row, not two CTAs.
9. **Mobile:** after the first screen the primary button becomes a full-width bottom bar. It hides while the keyboard is open.
10. **Signup-to-first-call spec** (the off-site half of conversion). Click "Get API key" > one-tap Google or GitHub > key shown once with copy > prefilled curl using the new key > streamed response > success state. The console at api.hanzo.ai sits outside this site; Hanzo must name its owner. Time to first successful call is logged.

**Fix list for today's mismatches:**
- Home "Apply for Beta Access or Start Free" (two intents) becomes "Get API key", with "Try Hanzo" as a text link.
- /chat "Open Hanzo Chat" no longer leads to a login wall.
- /pricing plan labels become "Start free", "Get Go", "Get Pro".
- /models uses "Get API key", never "Get free API key".
- Model pages use "Get API key" in the sticky nav ("Try Zen" is cut).

### 3.4 Progressive disclosure

- One idea per screen: kicker, headline, lede, one action.
- Anything beyond that goes behind a click: full spec tables, FAQ, lists above six items, benchmark methods, legal. They open as a sheet, drawer or tab but **stay in the server HTML** (collapsed `<details>` or inert sheets), so nothing is lost for SEO or parity.
- Claims carry a superscript marker linking to numbered notes at the page foot. Hero figures carry a footnote chip that opens a method drawer.
- Product names get a one-line definition on first use, or are held back until chapter 3 of home.
- A pattern ships only if it shortens time-to-understand or time-to-action. Otherwise it is cut.

## 4. Psychology rules, each tied to a place and a test

Only rules with a mechanism and a measure stay. Costly signalling and variable reward are cut as rules; restraint is enforced by the lints in section 7, and hover gags are decoration with no claim.

| # | Principle | Place | Test or measure |
|---|---|---|---|
| 1 | Fogg: cut effort at the decisive moment | /chat prompt box with three suggested prompts; /api copy-run curl; one-tap Google/GitHub | `curl_copied` rate; time to first call |
| 2 | Hick: fewer choices | Counts in 3.1 | Gate script counts |
| 3 | Curiosity gap | The question/answer table in 3.2 | Scroll depth by chapter |
| 4 | Candour: show the limit beside the claim | /dev "3.02x faster" with "42 of 44 tasks, single-fault repairs, one try each, 95% interval 2.06-4.36x" directly under it; /models "11 benchmark suites won" and "84.4% vs 76.6%" with a source; tables show where Hanzo trails | Checklist: every claim has a limit on the same screen |
| 5 | Proof right after the claim | Proof chapter above the closing Band; /enterprise earlier; /pricing under plan cards | CTA click after proof vs before |
| 6 | True constraints only | Zen 7 "Request access", creative models "research preview", /beta, the real 50-a-day cap. These are release states, not scarcity, so they are labelled honestly and given no urgency styling. No timers. | n/a |
| 7 | Anchoring | /pricing: the savings slider shows the competitor cost first; the recommended plan gets the solid button and a thin ink border; Free is quiet; Enterprise is a fourth card. A true decoy is not proposed. | Plan mix after launch |
| 8 | Peak-end | One live demo per Launch page runs once for 6 to 10 seconds, then settles; the end is a 100svh closing scene | Closing-Band click rate |
| 9 | Risk reversal | The 12px line under each button | A/B on the free-cap line |
| 10 | Von Restorff | The odd tile in a grid is **inverted**: ink-filled, not action-coloured. It is the "sovereign cloud" tile. | n/a |

Rule on perceived speed: prefetch on hover and touchstart, fixed-height skeleton rows, static fallback prices that live data replaces without movement, press states under 100ms.

## 5. Page types

Default structure (the Apple-style template): Hero > scenes (one idea each) > Stats > Compare > Objections > Final CTA scene > Footnotes. **Each page type below overrides this default.** Utility has no scroll theatre, and Story has its own six screens.

**Phasing (the order the work ships):**
- **Round 1:** home only, at 1470 and 375. James sees stills plus one clickable pass and approves the feel. Only then does Round 2 start.
- **Round 2:** /chat, /dev, /api, /models, /pricing, /enterprise. These are the six flagships, with full treatment and analytics on. Read results for a fixed window.
- **Round 3:** templates for the ~37 cloud products and 544 model pages. "One signature per page" becomes "one signature per template".

**Cut list if time runs short:** WebGL globe, scrubbed video, Cmd+K, custom cursor, compare drawer.

**Signature rule:** one signature, at most 3 supporting, per page. The signature is named in the table below. Nothing else on the page is chosen from the pattern library. A "forbidden here" column keeps pages quiet.

| Template | Signature | Supporting (max 3) | Forbidden here |
|---|---|---|---|
| Home | Card opens into its page | Line-mask headline reveal (global component); pinned scene on chapter 2; count-up on proof | Wordmark letters, diagonal reveal, grain, depth blur, custom cursor, ticker, footer wordmark scrub, Lenis |
| Chat, Dev | Screenshot scroll reveal of live UI | Typewriter in prompt/terminal; line-mask; copy confirmation | Card morph, cursor, WebGL |
| Dev only | Plus one scrubbed video, only after budgets pass without it | n/a | n/a |
| Enterprise / System | Four-places card row (one in focus) | Line-mask; count-up; role tabs | Scroll theatre, globe |
| Catalogue | Card opens into its page | Gliding tab pill; numbered `01 / 37` caption; row hover fill | Pinned scenes |
| Story | Scroll word reveal | Count-up; timeline scrub | Anything on the home hero |
| Utility | None | Tab pill, rolling price, 150ms hover | All scroll theatre |
| Developer | Typewriter terminal | Language switcher; copy confirmation | Cursor effects on code blocks |
| Model (544) | Sticky nav pill | Count-up once | Everything else |

### 5.1 Launch (home, /chat, /dev, /agents, cloud products)

**Home storyboard (proposal; times are targets, not observed):**
1. **0 to 0.4s:** server-rendered text paints. The button is clickable now. The header shows logo, five items and text links only.
2. **0.4 to 1.2s:** the headline appears by line-mask. The stage is dark and empty.
3. **1.2s:** the prompt caret appears and types a question.
4. **2.5 to 8s:** the Zen reply streams; the price counter stays at $0.0000. The proof line and footnote chip sit under the headline.
5. **8s onward:** the demo settles and does not loop. Scroll starts the pinned scene.
6. **Header state:** when the hero button leaves the viewport, the solid "Get API key" fades into the header.

**Screens:** hero (100svh) > show it > one key, every model > build > run it where you choose > proof > objection strip (security, data residency, open source, pricing, support, migration, using Hanzo's existing FAQ and compliance copy) > closing Band.
- **Hero:** kicker, Display headline, one proof line, one solid button, a text link "Try Hanzo", and the live prompt box beside the text. The announcement pill "A New Pareto Frontier" moves below the fold.
- **Headline candidates (proposal, from Hanzo's words):** "One API. Every model." / "Every model. One key." If James wants superlatives, the proof line carries them with the footnote chip.
- **Copy voice rules:** short sentences, present tense, product named first, no adjectives that cannot be footnoted.
- **Banned words:** *revolutionary, seamless, unleash, next-generation, world-class, cutting-edge, game-changing.*

**Product cards (home, four):** Zen, API, Chat, Dev. A card opens into its page (see section 8.1). The ~37 cloud products sit behind one "Explore the cloud" step. The inverted tile is "sovereign cloud".

**Per-product hero objects (answering "what is on stage when there is no UI"):**
| Product | Hero object |
|---|---|
| Chat | Live Chat window |
| Dev | Terminal with a diff landing |
| API | Terminal with the streamed curl |
| Zen / model pages | The benchmark table's first column, in large type |
| Cloud products | One status chip plus one real number from Hanzo's page |
| Enterprise | The four-places row |

Where no real UI exists, a large tabular number or a one-line terminal is the object. Stock art and abstract gradients are never the object.

**Mobile composition (its own design, not a reduction):**
- **Hero:** headline at 56 or 48px, then the button, then the prompt box. The prompt box is full-width, one line high, and runs the same demo.
- **Cards:** a vertical stack, one per screen. A tap opens the page directly (no morph).
- **Pinned scene:** replaced by a vertical sequence of three static panels.
- **Navigation:** the bottom bar holds the primary button after the first screen, and search replaces Cmd+K.
- **Pointer effects:** hover and cursor effects are off.

### 5.2 System (/enterprise, /platform, /security, /cloud index)

Screens: hero with "Talk to sales" and a human fallback line (enterprise@hanzo.ai) > four places to run it (four-card row, one in focus) > security checklist (three-column claim block, then "see detail" drawers) > proof (commerce results labelled honestly) > role tabs (max 6, each with a sample prompt) > what you get after the sale (only items Hanzo offers) > objection strip > closing Band.
- **Form:** name, work email, what you want to build, plus one optional "company size" select.
- **Routing and follow-up:** a named owner at Hanzo gets each submission, and an auto-confirmation email goes out. Spam is handled by rate limit and honeypot, not by a bot-check.
- **The "what happens next" list** appears only with real steps Hanzo confirms. A response-time promise appears only if Hanzo states one.
- Collapse today's ten sections and three "Talk to sales" links into this structure.

### 5.3 Catalogue (/models, /cloud, /integrations, /solutions, /oss)

Screens: hero with the count as the focal figure (exact value from content/pages.json) and search field > filter tabs with a gliding pill > grid of numbered items (`01 / 37`) with status chips (GA, Beta, Open source) > card opens into its detail page > compare drawer > closing Band.
- **Rules:** search and filter are mandatory on /models; prices are visible in static HTML; skeleton rows for live rates.
- **Partner models:** the "500+ partner models" promise must be matched by visible partner models, or the promise is cut. The count shown on the page comes from content/pages.json, never from this brief.
- **Cmd+K:** covers pages and the ~37 cloud products. The 544 model pages are searched through the /models search, not duplicated in the palette until counts are reconciled.
- **Where the morph does not go:** it never sits between the hero and the CTA. A sticky "Get API key" bar stays on screen.

### 5.4 Story (/about, /history, /blog, /investors)

Screens: hero sentence > scroll word reveal of the belief statement > big figures (1,600+ repos, Techstars '17, counted up once) > timeline scrub > team or founders if Hanzo has them > soft end "See what we build" linking to /models. The investors page ends with the email button. Never on the home hero.

### 5.5 Utility (/pricing, /contact-sales, /download, /careers, legal)

/pricing screens: audience tabs (Personal, Team, API), defaulting by referrer, with a gliding pill > rolling price number (existing Pricing.jsx) > plan row (recommended solid with a thin ink border, others outlined, Free as the quiet button, Enterprise as the fourth card) > per-1M-token table on the API tab, only with Hanzo's real prices > objection strip > closing Band.
- Motion is limited to the tab pill, the rolling price and 150ms hover lifts.
- Whether the Team and API tabs have content is an open item.

### 5.6 Developer (/api, /cli, /sdks, /mcp, /dev docs)

Screens: hero is a terminal (typed curl against api.hanzo.ai/v1, streaming response, Copy with a drawn tick, "Get API key" beside it) > language switcher (curl, Python, JS; 250ms) > prices and the free-tier cap in static HTML > latency sparkline or request-flow drawing > install block with copy > closing Band ("Get API key" plus "Read the docs").
- The terminal states are: loading skeleton, streaming, rate-limited, and error, each with written copy.
- Cursor effects are off on code blocks.

### 5.7 Model (544 pages, one template)

Shape taken from the anthropic.com/claude-sonnet-5-5 page (text fetched).
- **Header block:** model name, date, version, numbered tracker, a 4-anchor sticky nav (Overview, Benchmarks, Pricing, Get started) with "Get API key" in the nav.
- **Four headline specs:** large tabular figures; the full spec lives in a sheet.
- **Benchmark table:** the model's column first and tinted, honest gaps shown, method footnotes, count-up once at 900ms.
- **Price per 1M tokens:** real prices only.
- **Try-it:** copy-run request. Then a compare tab, then the closing Band ("Get API key").
- **JS budget:** under 100 KB gzipped.
- **Conflict to resolve first:** Zen 5 context-window badge (1M) against its text (256K).

## 6. The UI system

All values are starting tokens. If docs/DESIGN.md already holds a value, the existing value wins and this table gap-fills. No Apple spacing or ratio is quoted: every number here is a Hanzo proposal.

**Type** (two weights, 400 and 600; one family plus Zen Mono for kickers, code and footnotes):
| Role | Desktop / phone | Line-height | Tracking |
|---|---|---|---|
| Display | 128 / 96 / 80 desktop steps (VISION.md), 56 / 48 phone | 1.0 to 1.05 | -0.03em |
| Section headline | clamp(32px, 4.5vw, 56px) | 1.07 | -0.015em |
| Lede | clamp(19px, 1.8vw, 24px), 400 | 1.33 | 0 |
| Body | 17px | 1.47 | -0.01em |
| Chrome (kicker, button label, footnote, risk line, chip) | 12 to 14px, Zen Mono for kickers | 1.2 to 1.33 | kicker +0.12em |
| Figures | 64 to 96px, 600, tabular | 1 | -0.02em |

- **Lint:** max 3 sizes among headline, lede and body per viewport. Chrome is excluded.
- Headlines are 2 to 6 words, max 2 lines, end with a period and use `text-wrap: balance`. Hanzo's existing copy wins where it cannot meet this; the rewrite is proposed to James, not decided by the build chat.
- Hero type is server-rendered with no opacity 0 and no no-JS fallback gap. The fallback font uses `size-adjust`, and only the hero font is preloaded.

**Spacing and grid:** 8pt base; section air 200 to 260px desktop, 120px phone (VISION.md); 12 columns at 1440, 24px gutters, side padding `clamp(24px, 3.45vw, 72px)`; asymmetric 7/5 or 8/4 splits (centred three-box rows banned); hit targets at least 44px, list rows at least 56px.

**Room rhythm (when a page flips between dark and light):** pages are dark by default. A page flips to a light room only for reading-heavy content (docs, legal, pricing tables, long model comparisons). Within a page the room changes at most once, at a chapter boundary, over a 0.4s fade. Never mid-viewport.

**Colour (proposal):**
- **Dark room:** bg `#0a0a0b`, ink `#f5f5f7`, muted white at 60%, hairline white at 14%, surface `#141416`.
- **Light room:** bg `#ffffff`, ink `#1d1d1f`, hairline black at 10%.
- **Hierarchy** comes from alpha steps of one ink, not hues.
- **One action colour** (`--action`) for buttons, links, focus and hover only. James picks the hue. No gradient text. The inverted tile uses ink, not the action colour.
- **Contrast:** text meets 4.5:1.

**Imagery:** real product UI, large, in a rounded device-like frame. Live React components beat screenshots. No stock illustration, no abstract gradient hero, no icon-grid heroes. AVIF/WebP with explicit width and height. Grain and vignette are not in v3 (cut from home).

**Components:**
- **Buttons:** solid `--action`, pill radius, 44px in hero, 36px in nav; hover darkens 3 to 4% over 200ms; press `scale .98` under 100ms.
- **Cards:** 28px radius, 1px hairline, no shadows on dark, hover lift `y -5` in .25s, at most 3 text lines.
- **Header:** 64px; backdrop blur on this bar only, and no other blur anywhere on the page; 1px bottom border fading in after 8px scroll. It hides on scroll down and returns on scroll up; while hidden, the sticky bottom bar or the sub-nav carries the CTA.
- **Spec sheets:** row 96px, hairline between rows, value 28 to 40px tabular.
- **Compare tables:** semantic `<table>`, sticky header and first column, subject column tinted (tint is not the action colour), honest gaps, footnotes below. Lives in a tab or sheet.
- **Forms:** inline validation, loading and success states, `aria-live`, 2px focus ring.
- **Status chips:** GA, Beta, Open source, Preview.
- **Empty, error and loading states** are specified for every live component (Chat box, curl run, savings slider, tables).

## 7. The Apple / luxury feel: do and don't

| Do | Don't |
|---|---|
| One idea, one visual, one verb per screen | Two claims, two images or two CTAs on a stage |
| Display type huge and tight, body small, two weights | Mid-size type everywhere; bold body text |
| Headline 2 to 6 words, ends in a period | Colons, subtitles as headlines, 3-line headlines |
| Real product at large scale with empty space around it | Stock art, gradient blobs, icon-in-box grids |
| One action colour, for actions only | Accent scattered into decoration |
| Hierarchy from size and alpha steps | Boxes inside boxes |
| Numbers big, sourced, footnoted | Unsourced superlatives |
| Detail behind tabs and sheets, kept in the HTML | Every spec, FAQ and legal line in the main scroll |
| Ease-out 0.4 to 0.6s moves; 200ms hovers | Bounce on large surfaces; endless loops |
| Native scroll, scroll-linked reveals | Scroll-speed changes. **Lenis is dropped.** |
| Real text rendered first | A blocking loader on a speed product |
| Fast: LCP under 1.8s on a mid-phone | A heavy WebGL or video hero before first paint |

**Hard lints the gate script checks:**
- Max 3 sizes among headline, lede and body.
- One solid button per screen.
- One accent hue per page.
- No `transition: all`.
- Only transform, opacity, clip-path and filter animate.
- No Display sentence over 6 words without a labelled exception.
- One backdrop blur per page (header).

**Gate scripts and ownership:** the Round 1 build chat writes them before the first stills go to James. A separate review chat, not the builder, runs them. They cover variety, unique content, solid-button count, copy lexicon and type sizes. The scripts do not exist today.

## 8. Motion library

`lib/motion.js` defines the tokens once. Ad hoc easings are banned.

**Tokens:**
- `ease-out-expo` = [0.16, 1, 0.3, 1] (headline reveals, hero moves)
- `ease-calm` = [0.33, 1, 0.68, 1] (enter, sub-nav CTA)
- `ease-soft` = [0.22, 1, 0.36, 1] (fades)
- **Durations:** hover/press .2s; exit .25s; fade/page .4s; enter .6s; reveal 1.1 to 1.2s (headlines only); card morph about .6s.
- **Springs:** sheet/toggle `{300, 34}`; card morph `{260, 32}`; tab pill `{500, 35}`; cursor `{500, 40, mass .4}`.
- Stagger 80ms, max 4 items. Wrap the app in `MotionConfig reducedMotion="user"`.

**Decision rule:** a pattern ships only if it shortens time-to-understand or time-to-action. Everything below is a library, and the table in section 5 decides what each template uses.

**Patterns (kept):**
1. **Shared-element morph (card to page).** Home signature. `layoutId="card-{slug}"` on the card image and the detail hero; `layout="position"` on children; surrounding grid fades over .4s. The route stays URL-backed through Next.js intercepting and parallel routes (`@modal`), so deep links work and Back and Esc close it. Canonical stays on the destination page. Fallback: cross-fade under reduced motion; direct navigation on touch. Prefetch the destination via `requestIdleCallback`. The timing is a proposal; the morph must never delay a signup.
2. **Line-mask headline reveal.** One `<Reveal>` component on every H1 and H2. Per-line spans in `overflow:hidden`, y 110% to 0, 1.1 to 1.2s, ease-out-expo, `whileInView` once. Text is in server HTML.
3. **Pinned scene.** 2 to 4 beats, outer section 250svh at most, inner sticky 100svh, mapped with `useScroll` and `useTransform`. It never sits before the first value.
4. **Screenshot scroll reveal** (Chat, Dev): rotateX 25 to 0, scale .85 to 1, perspective 1200px.
5. **Single-slot caption** `01 / 05`: opacity-only fade .55 to 1, .68s, no blur, slide or stagger.
6. **Selection pill** (layoutId glide) for tabs and toggles.
7. **Row hover fill** (clip-path inset, .6s), only under `(hover:hover) and (pointer:fine)`.
8. **Count-up:** 1.2s once in view, tabular figures.
9. **Typewriter:** 40 to 70ms jitter, used in the hero prompt and developer terminals.
10. **Copy confirmation** (section 3.3 rule 7).
11. **Scroll word reveal** for Story.
12. **Hide-on-scroll header.**
13. **Footer wordmark reveal** (if used): `clip-path` inset from 100% to 0 as the footer enters. Never animate height.

**Deferred or cut for v3:**
- **Lenis smooth scroll:** cut (see section 7).
- **Diagonal word reveal, hero wordmark letters, grain, depth-of-field blur, custom cursor, ticker, drag skew:** removed from home. Re-add one per round only if James asks.
- **Custom cursor:** allowed on Catalogue only, `(hover:hover) and (pointer:fine)`, never over forms or code.
- **Scroll-scrubbed video:** /dev only, Round 3, only after budgets pass without it.
- **WebGL globe:** /cloud only, Round 3, lazy, DPR capped, "Static view" toggle, off by default on low-power devices.
- **Mask wipe / `AnimateView`:** only after React 19.3+ is verified.

**Restraint rules:**
1. One signature, at most 3 supporting, per template.
2. One scroll-linked effect per viewport.
3. Reveal once; never replay.
4. Animate transform, opacity, clip-path, filter only.
5. No looping decoration.
6. Every motion has a cause (scroll, click, hover, presence).
7. Mobile keeps the destination and CTA with simpler motion.
8. Lock input during route transitions, with Esc and a CLOSE control always available.
9. Reduced motion: final states, cross-fades only.
10. Motion+ components (Cursor, Ticker, AnimateNumber, Typewriter, Carousel, useCurtains) need James's licence approval. Every pattern above has a free fallback.

## 9. Reference catalogue: features and exact Hanzo pages

**Evidence and limits:**
- All references were read from source code, served HTML or text fetches. Nobody watched a recording, so "feel" is inferred.
- Before the build starts, the Round 1 chat runs the `watch` skill (yt-dlp plus ffmpeg frames, no browser) on case-study or Awwwards videos of synchronized.studio, osply.co, hamol.studio and grubogrubo.com. It adds a frame or timecode to every row below that lacks one.
- Where the watch step finds a conflict with this table, the watched version wins.

**Craft references vs conversion references.** Craft sites are agency portfolios built to impress. Hanzo is a conversion product. A craft pattern may not delay or sit between the visitor and the CTA.

### Craft references

| Reference | Moment (source) | Take | Do not take | Lands on |
|---|---|---|---|---|
| **synchronized.studio** (favourite; Nuxt 2 bundle, possibly older than the live site) | Click a card and it opens in one persistent stage, URL-backed `?case=slug` (code) | Card becomes page; Back closes it | Delay before the CTA; any feel claim until watched | Home product cards; /models; /cloud |
| | 74px difference-blend cursor with "Open"/"Drag" labels (code) | Cursor label teaches the click | On forms, code, touch | Catalogue only |
| | Diagonal headline reveal, 2s Power4.easeOut, offsets ±60px (code) | Nothing on home v3 | Cut from home | Possible later hero variant |
| | Text anchored to viewport edges; a single pale accent for interaction only (code) | Edge-anchored hero text, one accent | n/a | Home hero layout; colour |
| | Below 992px the card opens the client link directly (code) | Mobile simplification | n/a | All card grids |
| **osply.co** (HTML/CSS/JS read) | Cover flies into the page, blur 10px, 1.9s, with prefetch (code) | Prefetch idea only | The blur and 1.9s flight | Catalogue cards |
| | Line-mask on every heading, 1.2s, power4.out (code) | The reveal | n/a | `<Reveal>` component |
| | Copy-email-in-place confirmation (code) | Copy CTA | n/a | /enterprise, /dev, /api |
| | Token ladder: near-black, white alpha steps (CSS) | Alpha-step hierarchy | Lay Grotesk font pairing (trial font) | docs/DESIGN.md |
| **hamol.studio** (source read; visuals not seen) | Always-visible numbering `01 / 09`, status chips | Numbered catalogue | n/a | /cloud, /models |
| | Overlay with Next project, Back, ending in a CTA | Overlay pattern | n/a | Card detail overlays |
| | Spatial scene with objects as nodes; Static view; skip link | One globe on /cloud, with Static view | Named preloader | /cloud (Round 3) |
| **grubogrubo.com** (source read; not watched) | Single-slot caption `01 / 05` | The caption | 3D letters, Arial Black | Home chapters, catalogues |
| | Service cards with per-card hover gag and one accent tile | Gag as decoration only; accent tile becomes the inverted tile | The playful tone is not imported until James asks | Cloud grid |
| | Two-row contact footer, whole-row hit areas | Closing Band shape | n/a | Every page |
| | Scroll-scrubbed video | /dev only, Round 3 | Home | /dev |

### Conversion references (text fetched; sizes and motion not observed)

| Reference | Moment | Take | Lands on |
|---|---|---|---|
| **chatgpt.com/business/enterprise** | "Contact sales" repeated in header, hero and close; one named quote plus five numbers, no logo wall | One CTA label everywhere; proof right after claim | All pages; /enterprise |
| **anthropic.com/claude-sonnet-5-5** | Editorial launch page, 4 method footnotes, benchmark table with honest gaps | Model-page shape | /models/*, /zen |
| **claude.com/solutions/enterprise** | Dual-path hero; four product cards; "Made to pass security review"; role tabs | Home closing; security checklist | /enterprise |
| **apple.com** (HTML, CSS and text read; scroll frame counts not measured) | Sticky local nav that gains the Buy button after the hero button leaves (markup `data-localnav-trigger-anchor`); final CTA repeats the hero; footnotes at the foot | The CTA behaviour and footnotes; the pacing principle (one idea per beat) | Product pages; all pages |
| **vercel.com, linear.app** (text skimmed) | Real-UI hero | Real components, not screenshots | /chat, /dev |

For Apple, the pacing is specified in Hanzo's own storyboard and scene tables above. It is not measured from apple.com, and build chats do not quote Apple spacing or grid numbers.

### motion.dev

| Example | Hanzo moment |
|---|---|
| Screenshot scroll reveal | /chat, /dev hero |
| Toggle group (layoutId pill) | /pricing tabs; /models filters |
| Scroll word reveal | /about belief statement |
| Hide-on-scroll header | Global |
| Typewriter / Cursor / Ticker / AnimateNumber | Motion+; free fallbacks exist |
| layoutId and AnimateView | Home card-to-page |
| Image-reveal slider | Zen before/after (flagship models only) |

### godly.design
- Observed with one fetch: a curated gallery whose navigation includes Hero, CTA and Footer categories. The page listed these entries without descriptions: Cofounder, Gumloop, Agentwork, Griffin, LocalCan. No design pattern was read from any of them.
- **Rule:** it is not cited as a source of any rule in this brief.
- **Action for James:** pick 3 entries from the Hero and CTA categories (Agentwork, Gumloop and Cofounder are the AI-related entries in that listing). The Round 1 chat then adds a row to the table above with the URL, the moment, what Hanzo takes and where it lands. If James picks none, godly.design is removed from the brief.

## 10. Speed and quality budgets

All proposals except the Core Web Vitals "good" lines (web.dev, 75th percentile).

| Metric | "Good" line | Hanzo target |
|---|---|---|
| LCP | ≤ 2.5s | ≤ 1.8s mid-phone on 4G; ≤ 1.2s desktop |
| INP | ≤ 200ms | ≤ 100ms |
| CLS | ≤ 0.1 | ≤ 0.02 |
| Animation | n/a | 50+ fps on the 8 GB MacBook Air |

The effects list was cut to fit these targets. Heavy effects (grain blend, cursor, WebGL, scrubbed video) are not in Rounds 1 and 2.

**JS on first load, gzipped:** Home ≤ 170 KB; Launch/System ≤ 150 KB; Catalogue ≤ 140 KB; Utility/legal ≤ 90 KB; Model ≤ 100 KB; Developer ≤ 130 KB.

**Implementation rules:**
- Server components by default; `"use client"` only for interactive islands; `next/dynamic` for below-fold scenes; Motion via `LazyMotion` with `domAnimation`.
- First-view imagery ≤ 250 KB; `priority` on the one LCP image only; no autoplay video above 1.5 MB.
- Fonts: ≤ 2 variable files, `font-display: swap`, preload the hero font.
- No third-party scripts above the fold. `content-visibility: auto` on long off-screen sections.
- Prefetch on hover and touchstart. Decorative layers unmount on touch, when content is open, and when the tab is hidden.
- CI: Lighthouse CI on the six flagships plus a bundle-size check; a PR over budget fails.
- **SEO and migration:**
  - A 301 redirect map for the ~60 old nav links and all 544 model URLs.
  - One canonical per model.
  - `<details>` content in server HTML.
  - A metadata and structured-data template for model pages.
  - Intercepted card routes canonicalise to the destination page.
- **Accessibility:** visible focus; 4.5:1 contrast; touch targets ≥ 44px; skip link; arrow-key tabs; `aria-live` on copy confirmations; Esc closes overlays and returns focus; `prefers-reduced-motion` verified in a test.

## 11. Definition of done, per page

A page ships only when every box is checked.

**Logic**
- [ ] 5-second test: 5 unmoderated respondents per audience (developer, founder, enterprise buyer) answer "what is it, who is it for, what would you click". Pass = at least 4 of 5 name the category and the right CTA.
- [ ] Task test: "get one streamed response from the API" unaided, with time recorded.
- [ ] One solid button per screen; label from `lib/cta.js`; risk-reducer line under it.
- [ ] Primary CTA in hero, after proof and in the closing Band; sub-nav CTA after the hero button leaves view.
- [ ] Each screen answers the question the previous screen created.
- [ ] Every number has its source; every limit is on the same screen as its claim.
- [ ] No invented claims, customers, certifications or numbers; every content conflict is logged in docs/AUDIT.md and reported to James.
- [ ] Product names defined on first use; try-before-sign-up exists where the page type allows.
- [ ] Original text and links still exist in the HTML.
- [ ] Loading, empty, error and rate-limit states exist for every live component.

**Feel**
- [ ] One named signature, at most 3 supporting, tokens from `lib/motion.js`; nothing from the "forbidden here" column.
- [ ] Real product UI or a large figure as the hero object; no stock art.
- [ ] One accent hue for actions only; near-black dark room; Display tight, body small.
- [ ] Reveals play once; transform and opacity only; no scroll-speed change.
- [ ] Mobile is checked as its own composition.

**Quality**
- [ ] Budgets in section 10 met at 375px and 1470px; Lighthouse CI green; no layout shift.
- [ ] Reduced-motion and keyboard paths tested; Esc/Back close overlays.
- [ ] Verified on a live address with test data, not only local.
- [ ] Gate scripts pass (variety, unique, solid-button count, copy lexicon, type sizes).
- [ ] Events from section 1 fire and are visible in the log.

**Scoring (independent, not self-graded).** A reviewer who did not build the page scores it 1 to 10 against each dimension below, with a one-line reason. The page's score is the **lowest** score, and below 8 it goes back.
- **Anchor pages:** three anchors (a 4, a 7 and a 9, each with stills at both viewports) are set in Round 1: v1 home is the 4, and James picks the 7 and 9 from the references.
- **Dimensions:** restraint (apple.com); card-to-page continuity (synchronized.studio / osply.co); type and spacing (osply.co / hamol.studio); CTA clarity and proof placement (chatgpt.com/business/enterprise / anthropic Sonnet 5.5); motion restraint (motion.dev); speed (measured).
- **James's check:** side-by-side stills against the reference, plus Lighthouse numbers and the fixed AUDIT items, go in the PR.

## Open items for James (build chats must not decide these)

1. Confirm the one-sentence belief, the big idea ("one live object on a quiet stage") and the ranked goals.
2. Pick the single action colour hue.
3. Approve or reject the Motion+ licence. Free fallbacks exist for all.
4. Confirm what Hanzo can state: SOC 2 or ISO 27001 status, permitted customer logos, an investor contact address, a sales response-time promise, the method behind "200x faster and 400x cheaper".
5. Provide analytics baselines and the owner of the api.hanzo.ai console and signup flow.
6. Approve the cost cap per anonymous visitor and the daily spend ceiling.
7. Content conflicts on live pages that need Hanzo's answer before building:
   - Two home headlines ("Smarter, Faster, Cheaper" vs "Smarter, Faster, Open Source").
   - /pricing meta lists Pro, Max and Team but the page shows Free, Go, Pro.
   - Checkout slug `pro-2x` vs on-page "3x"; multipliers "3x, 5x, 15x, infinity" are unattached.
   - Zen 5 context badge 1M vs text 256K (and Zen 5 Flash).
   - The "/s" unit in the home tool grid.
   - Whether the Team and API pricing tabs have content (the static fetch could not see scripted content).
   - /dev install says Linux/macOS/Windows but curl and Homebrew are not Windows.
8. Check React and React DOM are 19.3 or later before using AnimateView or Mask wipe.
9. Pick 3 godly.design entries, or cut it.
10. Approve the Round 1 stills before Round 2 starts.

**Not verified in the research:** synchronized.studio's exact card-expansion timing; apple.com scroll-scrub frame counts and padding/grid values; the contact-sales forms on any reference; live-rendered visuals of any reference; any godly.design entry's patterns. The storyboard times, headline candidates, token values and budgets in this brief are proposals, not observations.