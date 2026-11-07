# MASTER: the one brief for the Hanzo site redesign (James, 7 Nov)

## 0. How to use this file

1. This is the only brief. It replaces BRIEF-v3, VISION, DESIGN, NEXT-LEVEL and PLAN, now in `docs/_archive/`. Do not read them.
2. Read this file, then `docs/DONE.md` (the finish line), then `docs/CLOUD.md` (your pages and owners).
3. Look up only what a part points to: `PLAN-COMPONENTS.md`, `JAMES.md`, `original/brand-deck.html`, `refs/hanzo-model-cards/SPEC.md`, `PAGES.md`.
4. **Precedence when rules conflict:**
   1. **Copy is frozen.** Every Hanzo word, number and link stays exactly. Nothing rewrites, cuts, merges or renames copy.
   2. **Hanzo's brand deck wins** on colour, type, space, radii and motion tokens. Colour means only the deck's neutral ramp plus `#e4e4e7`.
   3. **`JAMES.md` wins** on taste and feel.
   4. **`PLAN-COMPONENTS.md` wins** on structure.
   5. Everything else.
5. One exception: the home model cards copy `SPEC.md` exactly, even where the deck bans a hover transform.
6. If two rules still clash, take the higher one and note it on your card. Never ask James.

---

## 1. The goal and DONE

**Goal.** A visitor reaches a first successful call or message fast; an enterprise visitor reaches a sales conversation. The site feels premium: subtle, alive, never a template. It is pure design on frozen copy: about 151 designs (top-level pages plus family templates), each with its own idea, object and moment on one shared system.

**A design is done when all six are true** (`DONE.md`):
1. **Colours:** only the deck palette (section 3). `python3 scripts/taste.py <files>` passes.
2. **Copy:** `python3 scripts/parity.py /<path>` shows 0 missing.
3. **It works:** 200, no red error badge, no console errors, every button and menu responds, nothing overlaps at 1470×801 or 375×812.
4. **Unique and calm:** `python3 scripts/unique.py` passes.
5. **Judged:** a critic walked it moving and scored it 8/10 or better against `JAMES.md`. On money pages six axes (Clarity, Hierarchy, Craft, Motion, Distinctiveness, Action) score 1 to 5: none under 3, and Hierarchy, Distinctiveness, Action 4 or more.
6. **Model cards** match `SPEC.md` exactly wherever they appear.

**The site is done when** all 151 designs are green "Ready" on `docs/status.html` (verdict 8+, variety passes, gallery proof, 18 of 18 card), `npm run build` exits 0, and sound feedback is in. Then everything stops; nothing extra gets built.

**Visitors and their metric:** developers (`api_key_created`), enterprise buyers (`contact_sales_submit`), founders (`signup_start`), researchers (a GitHub or weights click), investors and press (one contact click), consumers (`first_chat`), machine agents (`llms.txt` fetch).

| Page type | The one action (Hanzo's existing label, via `lib/cta.js`) |
|---|---|
| Launch | The product's primary ask (Try Hanzo, Start free, Open App) |
| System | The sales ask |
| Catalogue | Open a card |
| Story | The page's own closing link |
| Utility | The form submit or the plan button |
| Developer | Copy the code, then the key |
| Model | The primary of its existing CTA pair |

---

## 2. The 18 parts of every page

Deeper, not bigger: no new pages, products, sections or copy. Each part gives rules, then a tick-list; tick each on your coverage card with evidence, or write why it does not apply.

**Gate for every page:**
1. Header comment: `// Persona:`, `// Goal:`, `// CTA:`, a metric id, `// Signature:`, `// Beyond:`.
2. One h1 in server HTML. Kit parts only: no raw `<video>`, `<img>`, `<table>`, `.x-btn` or hand-written `Hero`.
3. Tokens only. One solid fill per viewport. `data-thumb` and `data-cta` on the primary.
4. Parity 0 missing; every number exists in `content/pages`; new UI strings only from `content/ui-strings.json`.
5. Reduced motion shows the final state, JS off is legible, every motion has a keyboard path.
6. Budgets met; 375×812 and 1470×801 pass; no horizontal scroll at 320.
7. Gallery proof attached; the card lists what the page deleted (forked buttons, heroes, tabs, tables).

**Kit parts named below** (`Cta`, `PageHero`, `Tabs`, `Field`, `DataTable`, `Code`, `CodeBlock`, `Stat`, `Film`, `Pic`, `Demo`, `Terminal`, `ModelCard`, `Sheet`, `Tip`) come from the shared-file owners. Until one merges, use the existing kit equivalent and swap later. Never fork one.

### Part 1. Strategy and conversion

- Serve one metric and one audience, named in the header comment.
- One filled primary and one text secondary per viewport. Labels come from `lib/cta.js` {page, audience, label, href, event id, thumb label}. Weight and order change; wording never.
- One h1. A second headline (the home sign-in panel) becomes an h2 with the same words. The h1, subhead and primary fit the first screen at both test sizes.
- Hanzo's existing answer to an objection (lock-in, data, price, reliability, security, support, procurement) sits within one viewport of the primary, citing its source line, or is dropped.
- Current proof (benchmarks with method link, GitHub figures, status) sits above old case studies. Cases stay.
- The existing `Bill()` comparer is reachable from home Cheaper and `/pricing`. The base-URL line sits beside the OpenAI-compatible claim.
- Forms use `LeadForm`. ContactSales: 5 fields (email first, company, size bucket, use case, optional message), 8 s timeout with 1 retry, draft in `sessionStorage`, payload identical to `content/forms.json`. SmsOptIn succeeds only on a 2xx.
- One `lib/plans.js` feeds every price. A button with no destination is hidden, never looped.
- **Copy questions for James: leave the live wording and list the question on your card.** Home H1 string; pricing source of truth; "Backed by" logos; dead pricing-button destinations; the cURL text; the CLI docs link; commit tiles 835,124 versus 805,254; titles over 70 characters and empty descriptions; years beside customer figures; any CTA label change.

**Tick:** [ ] header comment; [ ] one solid fill, `lib/cta.js` label; [ ] one h1; [ ] no dead button; [ ] copy questions listed.

### Part 2. Information architecture and navigation

Hanzo's header, footer and links are unchanged. Re-home a link, never delete one.

- One `<main id="main">`; a skip link first in tab order; the h1 takes focus on route change with a live title.
- Every link uses `A`, `Go`, `More` or `href()`. A true external link gets `rel` and a hidden "opens in a new tab" (register).
- Depth 2 or more shows a breadcrumb in labels the nav already uses; the last item is not a link.
- **Shared chrome (request, do not edit):** mega-menu (5 columns, 7 links each, opaque); mobile sheet (56px rows, pinned Log in and ask); ⌘K fuzzy search; footer (phone `<details>`). URLs match live (no trailing slash). `scroll-padding-top` is header height plus 16px.

**Tick:** [ ] one `<main>`, skip link; [ ] link helpers, no orphan card; [ ] breadcrumb; [ ] 0 links removed.

### Part 3. First impression and page narrative

- Sell in 5 seconds; something moves within 1 second with no input. Keep Hanzo's heroes (concept and words); change presentation only.
- One `PageHero`: the h1 cut in by line mask (translateY 105% to 0, 700 ms, ease-emphasis, 60 ms between lines), one lede, one primary, one hero object. The h1 baseline sits near 38% of 100svh; the next section peeks 56px. Nothing sits above the h1 (part 7).
- Phone: h1 (3 lines at 40px), lede, primary and 80px+ of product inside 660px. Art is 45svh or less.
- Every word is in the exported HTML. No `opacity:0` on the LCP element. Counters render their final value. An `html:not(.js)` rule shows everything with JS off.
- One thing in, one thing out: each 100svh holds one new idea; old and new objects overlap by 40px. Alternate loud and quiet sections: no 3 in a row within 15% of one height.
- End on one proof strip, one `Band` in the page's own words, then the footer with no gap.
- Home only: an arrival curtain on first visit, 700 ms at most; skipped for return visits, deep links, Save-Data, slow networks, reduced motion and bots; no counter; a CSS-only failsafe at 3.5 s.
- Cards open into pages (Morph): the card hands its title and picture to `data-morph-target`, 600 ms in-out, 250 ms crossfade fallback; the title lands within 12px of the destination h1; Back reverses it.

**Tick:** [ ] 5 s, 1 s; [ ] `PageHero`; [ ] JS off legible; [ ] rhythm varies; [ ] proof, `Band`, footer; [ ] Morph.

### Part 4. Conversion system

- One `<Cta>` (solid, quiet, link; 48px and 40px). No raw `.x-btn`. The primary appears at most three times: hero, after the proof, closing `Band`.
- **The sticky ask.** The hero ask's label also sits in the header (quiet; a signed-in hint swaps it to "Open app") and in a bar that rises once the hero ask leaves view (300 ms, ease-emphasis, 16px rise), hidden while the keyboard is open. Legal and careers pages have none. The solid fill sits in one place at a time: the hero ask, then the bar.
- Auth options form one control (email solid; Google and GitHub outlined). Adjacent buttons never share an href with different labels.
- A cross-origin hand-off shows a pressed state (`aria-busy`, 200 to 400 ms).
- The install command copies exactly the displayed text (no `$ ` prefix). A failed copy never says Copied. One `KEY_URL` constant for the key path.
- `/pricing`: plan CTAs share one y within 1px, the selector defaults to the lowest plan, and a plan is recommended only if a written rule exists.
- `data-cta="<page>.<slot>"` and `data-thumb` on every primary.

**Tick:** [ ] `<Cta>`, one solid fill; [ ] sticky ask; [ ] copy equals display; [ ] `data-cta`, `data-thumb`.

### Part 5. Trust and proof

- One `BACKERS` module. Names and logos appear only with documented permission; otherwise no strip.
- Trust is a stationary row (greyscale, 28 to 32px, linking to `/investors` or `/customers/<slug>`) or a marquee of 25 s or slower that pauses on hover and focus, freezes under reduced motion, hides its duplicate half and has a pause control past 5 s.
- Show a customer year only where the case copy has it. Figures use `Stat`: tabular numerals, source link and qualifier ("Up to") beside the number, value byte-identical to source. A zero never gets hero size.
- Benchmarks: a method line from existing text, a zero baseline, Hanzo in ink and the rest in grey, `role="table"`.
- No seal, certification mark or invented uptime. SOC 2 stays "compatible, not certified".
- Every form has the Privacy link and owner line in its submit viewport.

**Tick:** [ ] no unpermitted logo or seal; [ ] figures traced; [ ] marquees pause and freeze; [ ] Privacy link by every submit.

### Part 6. Content presentation (copy untouched)

- Type comes from the deck scale (section 3). Body text is 13px or more (14px on phone); only 11 to 12px Zen Mono capitals go smaller.
- Measures: headings 12 to 18 characters, lede 44 or fewer, body 62 to 68 (75 hard limit). Headings `text-wrap: balance`, paragraphs `pretty`. No one-word last line at 375, 768 or 1440.
- Cards have one `::after` link. Disclosure is one of 4 patterns: inline, accordion, drawer, tab; opens by hash. Hidden text stays in the HTML (`hidden="until-found"`). FAQs are multi-open with `#q-slug`.
- Tables use `DataTable`: caption, `scope`, sticky header, tabular numerals, 48px rows; under 720px they stack or pin-scroll.
- Code uses `Code`: 13.5px, line height 1.65, build-time Shiki, comments at 4.5:1, copies the displayed text. One APG `<Tabs>` with hash sync.

**Tick:** [ ] 13px floor; [ ] measures, no orphan; [ ] kit tables, FAQ, tabs, code; [ ] parity 0 missing.

### Part 7. Visual design system

- Every colour, radius, shadow and size comes from `tokens.css` (section 3). No literal hex, radius or shadow in page CSS.
- Raise a surface or outline it, never both. Tiles are flat fills with no outline or shadow. Rows are divided by 1px hairlines. Only what floats (menus, dialogs, the ask bar) takes a shadow.
- Preload Zen and Zen Mono (`swap`, `size-adjust` fallback, about 25 KB Latin subset). The h1 box never moves while fonts load.
- One icon set (Lucide): 24px grid, 1.5px stroke, actions and status only. Never an icon in a rounded box.
- Product renders (`components/render/`) draw at true size, then integer scale. Model marks and Sigil are the designed image fallback.
- Base details: `scrollbar-gutter: stable`, `::selection`, `caret-color`, a 1px image outline at black 8%, concentric radii (inner = outer minus padding).
- Glass only on the header, palette and sheet scrim. Dark only inside dark rooms.
- No label, tag, badge or pill directly above an h1 or h2. If Hanzo's copy has one, keep the words and set them below the heading as a caption.

**Tick:** [ ] `taste.py` passes; [ ] nothing above a headline; [ ] token radii and shadows; [ ] one icon set; [ ] differs from neighbours.

### Part 8. UI component library

- Every control has default, hover (inside `@media (hover:hover)`), pressed (scale .97, 90 ms, back in 150 ms), focus-visible, disabled and loading (keeps its width).
- One focus ring: 2px ink with a white halo (white with a black halo on dark rooms).
- Modals are native `<dialog>.showModal()`: focus trapped and returned, Esc closes. The cookie bar is a non-modal region.
- Inputs use `<Field>`: 56px, 16px text, label above, `aria-invalid` and `describedby`, correct `autocomplete`, `inputmode` and `enterkeyhint`, errors on blur in plain words, paste allowed.
- Copy buttons are 44px with a fallback select and `role="status"`. One `Sheet` and one `Tip` (`aria-describedby`, focus, Esc). No `title=` on a button or link.
- Animate only transform, opacity and clip-path. Blur 4px or less, once per page. Never `transition: all`; never width, height, margin or padding.
- Rails use `scroll-snap-type: x proximity` with a 14 to 18% peek.
- Z scale: base 0, sticky 10, header 40, overlay 60, sheet 90, cursor 1000.

**Tick:** [ ] all control states; [ ] focus ring on a Tab crawl; [ ] dialogs trap focus; [ ] inputs 16px+.

### Part 9. Motion and interaction

- Durations and curves come from the deck (section 3). No ad hoc number, no `duration: n` literal.
- **Budget: one signature plus at most 3 supporting techniques; at most 2 fade-ups (`Rise`); at most one continuous mover per viewport.** `variety.py` fails more.
- Mix the kinds of movement; a page whose only motion is scroll fails, and scroll-linked effects are at most half of it. **Idle** (a demo that runs itself, a drifting Sigil, a ticker). **Pointer** (cursor-aware light, magnetic asks, tilt, hover previews, a drag rail with inertia). **Time** (typing, streaming text, staged loading). **State** (tabs that morph, sheets that rise, the card-to-page open). **Arrival** (the h1 cut-in, the page transition).
- Text reveals by line mask, words 50 to 60 ms apart, 900 ms or less for 6 words. No opacity-and-blur reveal.
- A figure settles or counts once: the true value is in the HTML, tabular numerals, `min-width` in `ch`, never rounded.
- Live demos use `<Demo>`: start at 60% visible, pause when hidden, end at rest, one rAF scheduler, one per viewport.
- Page transitions reverse on Back and cap the hold at 700 ms. Lenis smooths the wheel on fine pointers only. Cursor labels: 6 words at most.
- Reduced motion: a global `.01ms` rule and `useCalm()` with a change listener. `getAnimations()` is empty after 3 s.
- **Sound.** One shared kit, Web Audio, no files, about -24 dB, only after the first interaction; a header mute toggle (icon plus register `aria-label`) remembers its choice. Sounds: a card opening (whoosh), the primary ask (tap), tabs and toggles (tick), copy success (chime), ⌘K (pop), a demo finishing (faint chime). Never on hover, scroll or load; never two at once.

**Tick:** [ ] 1 signature + 3; [ ] 3+ kinds, scroll half; [ ] moves untouched; [ ] reduced motion final state; [ ] sound only as listed.

### Part 10. Media

- `Film` and `Pic` only (`<video>` lives only in `Film`). Both play and pause by IntersectionObserver; reduced motion and Save-Data show the poster. Films loop muted, at most 2 playing at once; a loop over 5 s gets a pause button.
- Every image has width and height or an aspect ratio (`lib/media.json`); every video has a poster from frame 0. CLS under 0.02.
- AVIF or WebP at 480, 800 and 1200px; `fetchpriority="high"` on one hero image. Budgets: hero image 120 KB, card film 150 KB, hero film 500 KB, home images 600 KB.
- Show 4 or more real Hanzo images or films together wherever the page has them. Never filter, dim or black out a photo; dimming is only a gradient under text.
- Mirror every logo, cover, face and avatar into `public/`. Every `<img>` has alt from a nearby existing label (`alt=""` if decorative).
- The WebGL opener loads on the first card `pointerenter`, with a `router.push` fallback. Sigil runs from one scheduler; at most 12 canvases. Media failure falls back to an aspect-ratio box with Sigil.

**Tick:** [ ] `Film`/`Pic` only; [ ] 2 videos max; [ ] budgets, alt; [ ] no dimmed photo.

### Part 11. Mobile and responsive

- At 375×812 the page is its own composition, not a shrunk desktop. Check 320, 375, 768, 1024, 1470, 1920. Breakpoints 599, 899, 1199.
- `100svh` for static heights, `100dvh` for overlays; no `100vh`. Viewport: `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content`; zoom allowed.
- Every touch target is 44px or more. The primary is above the fold at 375×667. The hero object is cropped at true size, never shrunk to fit.
- Every hover has a tap equivalent. Tilt, magnetic and cursor effects switch off on touch.
- Pinned scenes stack under 900px. Sheets close with Back. One bottom layer at a time: the ask bar, or the cookie card, or a banner.

**Tick:** [ ] both sizes pass; [ ] no scroll at 320; [ ] 44px targets, tap paths; [ ] ask above fold at 375×667.

### Part 12. Accessibility (WCAG 2.2 AA)

- Text contrast is measured at 4.5:1 (3:1 large). On white use `#0a0a0a`, `#525252` or `#737373` (4.74:1). On `#f5f5f5` or `#ededed` use `#525252` or darker (`#737373` fails there). `#a3a3a3` text lives only on black and graphite; white at 30% is disabled only.
- Moving content (carousel, marquee, roster, rotating code, terminal, loop) has a pause control first in the DOM (44px, `aria-pressed`) and freezes under reduced motion.
- Forms: `<label for>`, inline errors, focus on the first invalid field, honeypot `tabindex="-1"` and `aria-hidden`.
- A focused element is never under the header or the ask bar.
- One h1, no skipped levels (use the `as` prop when levels differ). Accessible names start with their visible text.
- 320px and 400% zoom pass; no `white-space: nowrap` on the h1.
- axe shows 0 serious or critical issues; a tab crawl shows 0 invisible stops.

**Tick:** [ ] contrast measured; [ ] pause controls; [ ] forms labelled; [ ] heading order; [ ] keyboard path.

### Part 13. Performance and engineering

Fail line: Google "good" (LCP 2.5 s, INP 200 ms, CLS 0.1, p75). Lab target: LCP 2.0 s, INP 200 ms, CLS 0.02.

- The heading and hero image are in the first 14 KB of server HTML.
- Brotli JS budgets: text and ported routes 110 KB, home 170 KB, model pages 100 KB, developer pages 130 KB. Critical CSS 14 KB, total CSS 40 KB.
- Server components by default; `"use client"` only for islands; `LazyMotion` with `m`; dynamic imports below the fold. Cursor and Phone load after idle, Lenis after the first interaction. Islands sit in error boundaries.
- Long sections use `content-visibility:auto` with `contain-intrinsic-size`.
- No third-party script on the critical path; any tag loads only after consent. No client dependency over 20 KB gzipped.
- **Heavy jobs run in the cloud.** Filming, Lighthouse, axe, ffmpeg and a full `next build` never run on James's laptop. Build a page with `HZ_ONLY=<route>`.

**Tick:** [ ] LCP in server HTML; [ ] JS and CSS in budget; [ ] no poller or early third party; [ ] nothing heavy run locally.

### Part 14. SEO and machine files (mirror live, add nothing new)

- Title and description come unedited from `content/pages.json`. The 24 doubled "— Hanzo AI — Hanzo AI" titles lose only the duplicate. List titles over 70 characters and empty descriptions for James; never truncate or auto-fill.
- Render `<JsonLd route="/<path>" />` and an absolute canonical equal to og:url, the sitemap entry and the live URL.
- Signup, login, pay, console and sms-opt-in are `noindex,follow`, outside the sitemap.
- Robots, sitemap, redirects, `llms.txt` and `security.txt` belong to the shared owners and mirror live files only. Title, description, canonical, h1, JSON-LD types and link count equal live.

**Tick:** [ ] title, description match live; [ ] canonical = og:url; [ ] JSON-LD parses; [ ] cards are links.

### Part 15. Catalogue and product pages

- `/models` links every existing model and maker page (a collapsed link list per maker, real `<a href>`): all 470 model and 73 maker pages are in the DOM.
- One `ModelCard` in all 4 contexts, the exact `SPEC.md` card (it wins any difference): grid `385px repeat(4,192px)`, rows `220px 220px`, gap 12px, Enso spanning column 1 and both rows; card `#000`, radius 20px, no shadow or border; title 22px/500 (Enso 44px); the `.webm` loops over its `.webp` with a 0.6 s crossfade; a pointer tilt of about 3°, flat on leave, none under reduced motion.
- Every card opens by Morph; reduced motion is a cut.
- Model header: name, lede, three numbers (context, input, output) largest, the existing CTA pair, a mono id pill. Where Hanzo prints "…", show an em dash with an accessible name from the register.
- Spec table in 4 groups (Identity, Limits, Price, Modalities), empty rows omitted. One rounding rule for every price.
- Quick start stops rotating on hover and focus. Related rail: same maker or family first, then nearest context and price; 6 at most.
- Cloud products (42) share one anatomy: identity, console, a 3-fact strip from existing text, openable features, `Band`.
- Phone catalogue is 72px list rows. A duplicate name shows its id.

**Tick:** [ ] card matches `SPEC.md`; [ ] Morph, title within 12px; [ ] all pages linked; [ ] one price everywhere. *Else n/a.*

### Part 16. Developer experience

- One `CodeBlock`: 13.5px/1.65, a labelled scroll region (`tabindex="0"`), build-time Shiki, 5 colours at 4.5:1, `textContent` identical to the display. One `<pre>` owner.
- Copy exactly the displayed text. A `$` prefix is `user-select:none`, not stripped. A shell block never turns into JSON; the paste runs in zsh.
- MCP config splits into pure blocks: JSON that passes `JSON.parse`, and shell. No `//` comments in a copied block.
- Language tabs are APG tabs at a fixed height; the choice persists in `localStorage` inside `try/catch`. Docs links use `lib/devLinks.js`.
- Terminals use `Terminal`: start at 40% in view, pause control, static final frame, SSR poster. Versions come from registries at build time.

**Tick:** [ ] one `CodeBlock`; [ ] config parses; [ ] terminal pauses; [ ] no typed version. *No code: n/a.*

### Part 17. States and resilience

- Every state looks intended: loading (a skeleton the exact size; no spinner on sections), empty (a register sentence and one action), error (an error room with retry), offline (a banner and a disabled submit), reduced motion, JS off.
- Live data goes through `fetchLive(url, {timeout: 6000, ttl})`: abort, one retry, 403 and 429 count as unreachable, fall back to the build snapshot with an "as of" stamp. With the API and GitHub blocked the page is complete, with no console errors.
- Forms run idle, sending, failed, sent. A failure keeps the form and shows Hanzo's existing error string (Grants: `grants@hanzo.ai`). An idempotency key makes a retry deliver once. Success never shows on a failed POST.
- Consent: an equal-weight Reject all, `globalPrivacyControl` honoured, a card of 220px or less at 375×812.
- `app/error.jsx` (header and footer kept), `global-error.jsx` and `loading.jsx` exist. A throw in Sigil, Opener, Phone or Cursor leaves the page standing.

**Tick:** [ ] four states designed; [ ] blocked data leaves a full page; [ ] failed submit keeps values; [ ] thrown island survives.

### Part 18. Measurement and handover

- `data-cta="<page>.<slot>"` on every primary; `page_view` on the committed route. Events are `object_action`, carry ids, never copy or PII, and go through `lib/track.js` (the only SDK import). Hover fires nothing.
- App-bound links carry `hz_sid` and the cta id; `app_handoff` goes by `sendBeacon`. Anything identifier-bearing loads only after consent; GPC and Do Not Track mean decline.
- Forms use `useFormTrack` (view, start, error with field name only, submit, success, fail, abandon; a honeypot hit is `spam_blocked`). No field value in a payload.
- Write the coverage card (section 6), add `V2: <score>/10 <one line>` to the page file's top comment, and read `docs/review/<page>.md` after each pull.
- **Not yours:** the live baseline counter, CI and previews, field Web Vitals, rollout, handover docs.

**Tick:** [ ] `data-cta`, `lib/track.js`; [ ] nothing before consent; [ ] `V2:` line and card.

---

## 3. The look

### 3.1 Hanzo's tokens (the only values)

Source: `original/brand-deck.html` and `hanzo.css`, from `@hanzo/design` (commit `12408ef`). The atom: **monochrome, true black, white type, colour only as state, never as decoration.**

**Palette.**
- Whites: `#ffffff` page, `#fdfdfd`, `#fbfbfb`, `#fafafa`, `#f7f7f7`, `#f5f5f5` quiet room, `#f2f2f2` card, `#ededed` muted tiles.
- Silvers: `#e9e9e9` to `#f6f6f6` (silver gradient), `#e5e5e5`, `#e4e4e7` the one brand tone, `#e4e4e4`, `#d4d4d4` bar tracks, `#a3a3a3` text on black.
- Greys: `#737373` quiet text, `#525252` body grey, `#404040`.
- Blacks: `#262626`, `#171717` graphite, `#0f0f0f`, `#0a0a0a` ink, `#000000` art and rooms.
- On black, text and lines use white at 3, 5, 6, 8, 10, 14, 15, 16, 18, 20, 22, 30, 40, 45, 55, 60, 78, 80 or 92%. Never invent a step. Text ranks on black: `#fafafa`, white 78%, white 55%, `#a3a3a3`, white 30% (disabled).
- **No hue.** Status (done, failed, live) is a shape or a word: filled ink against hollow, a tick, a line. Colour enters only through Hanzo's own media. Links are ink with a 1px underline, offset 3px. `taste.py` fails chroma above 0.08.

**Rooms (five).** Paper `#ffffff` (reading, forms, rows); Quiet `#f5f5f5` (questions, tables); Silver gradient (a sheen follows the pointer); Graphite `#171717` (ledgers, code, help); Black `#000` (art, races, the field). Light roles: foreground `#0a0a0a`, muted `#525252`, border black 10%, floating shadow `0 24px 60px -16px` black 18%. Black roles: foreground `#fafafa`, border white 10%, floating shadow black 75%. At most 2 black or graphite rooms per page, never back to back. A black room enters as a rounded card inside the gutters and opens to full width as it is reached.

**Type.** Zen for everything; Zen Mono for labels, code and figures; never a third face.
- Weights: Air 220 (largest figures), Regular 400 (body), Book 497 (every heading), Medium 606 (UI emphasis).
- Scale in px (add no size): 12, 13, 16, 17, 21, 26, 32, 40, 52, 64, 84, 112.
- H1 `clamp(52px, 7vw, 84px)`, line height 1.02, tracking -0.035em. Section heading `clamp(36px, 5.3vw, 64px)`, 1.02, -0.035em, two-tone (first clause ink, rest `#737373` or `#525252`; the words do not change). Closing line `clamp(40px, 6.6vw, 84px)`. Statement `clamp(22px, 2.6vw, 32px)`, one per page (two at most). Lead `clamp(17px, 1.5vw, 21px)`, 1.45. Body 17px, 1.55. Hero figure `clamp(72px, 13vw, 112px)`, Air, 0.9, tabular, -0.03em. Row figure `clamp(28px, 3vw, 40px)`, Air.
- Eyebrows: 11 to 12px Zen Mono capitals, Medium, tracking 0.14em, ink or grey. Fine on captions, tags, table heads and figure labels; never directly above an h1 or h2.
- At most 3 sizes among headline, lede and body in one viewport.

**Space (golden).** Steps in px: 4, 6.5, 10.5, 17, 27, 44, 72, 116, 188. Section padding `clamp(72px, 11vw, 188px)`. Gutter `clamp(16px, 4vw, 32px)`. Container 1152px, prose 768px, tile gap 12px. A 13-column grid splits 8 and 5 (38.2% and 61.8%) for every two-part layout: heading left, lead right, aligned to the bottom. Centred heads only in the closing section. Three equal boxes in a row are banned.

**Radii (px).** 6 chips, 8, 12, 16, 24 tiles, 28 composer, full for pills and buttons; art cards 20. Buttons 48px (40px small), fields 56px.

**Motion.**
- Durations: press 90 ms, fast 150, base 300, slow 400, slower 500. Stagger 60 ms. Entry rise 16px (24px large).
- Easing: `ease-out` `cubic-bezier(0,0,.2,1)` for hover and colour; `ease-in-out` `cubic-bezier(.4,0,.2,1)` for things that move and stay; `ease-emphasis` `cubic-bezier(.16,1,.3,1)` for arrivals.
- Only scene moves run past 500 ms: a hairline draws in 900 ms, line art 800 to 1,400 ms, Morph 600 ms in-out.
- **No springs, no overshoot.** James's "toggles with springs" is delivered with `ease-emphasis` at 300 ms.
- Hover transforms allowed are James's only: card tilt to 2.5° (3° on the model card, per `SPEC.md`), a magnetic ask to 22px, strokes parting to 12px, art drift to 140px. Fine pointers only; none under reduced motion.

### 3.2 James's taste rules (`JAMES.md`)

1. **Display type reads like a logo:** big and tight, h1 line height 1.05 or less at 72px and up.
2. **One live object on a quiet stage** in every section: a real product UI, a film, a canvas, an SVG, a giant numeral, a logo wall. An icon alone fails.
3. **Authored motion, not fade-ups, and not only scroll** (part 9): line-mask cut-ins, scrubbed strips, pinned stages where one panel changes, cards that open into their page, one 3D or WebGL moment where it earns its place.
4. **One thing in, one thing out.** Detail lives in things you open. Not a document.
5. **Every tap answers:** hover and press change more than opacity, with no layout jump, and the hover tells you something (a number, a preview).
6. **One solid ask** in Hanzo's words, in the header and the sticky bar after the hero, at every width.
7. **Neighbouring pages differ** in hero medium, layout and signature.
8. **References show up,** with the measured values in `docs/refs/<site>/`: synchronized.studio, apple.com, osply.co, hamol.studio, grubogrubo.com, chatgpt.com/business/enterprise, anthropic.com launch, motion.dev.

### 3.3 The banned list (any one fails the page)

- Clutter: walls of text, an explaining sentence under every tile, 3 equal boxes. A dead page: nothing moves untouched, or only fade-ups.
- Any hue, green accents, repeated colours or one tone across pages.
- A framed or boxed static hero, blacked-out or filtered photos, stock imagery, abstract-gradient or icon-grid heroes.
- A visible font swap, layout shift, or overlap at 1470×801 or 375×812. Browser-default controls. Unverifiable claims.
- Purple-to-blue gradients, gradient text, emojis in headings, Inter, a coloured stripe down a card, low-contrast dark mode, three icon boxes in a row, Lucide everywhere, untouched shadcn.
- A badge, pill or eyebrow above a headline.
- A cursor beam or glow, buttons that fade on hover, serif italic accent words, grain over a gradient.
- Any rewrite of Hanzo's copy. Any live AI call from the page (demos are scripted from real Hanzo content).

---

## 4. Page types

Seven types. Each lists its screens in order, one job and one real object per screen. Hanzo's copy supplies the words; a section the live page lacks is not added. Pick one signature plus at most 3 supporting techniques, check `docs/PAGES.md`, and never reuse a taken signature. Families differ by their own data and Sigil seed.

Signature options by type: Launch (a card opens into its page, a live demo that runs itself, a scrubbed build-up); System (a map you zoom into, one shape becoming the next); Catalogue (a card opens into its page); Story (scroll word reveal); Utility (none, or a small delight such as a rolling price); Developer (a typewriter terminal); Model (the Morph arrival). Supporting techniques come from: line-mask cut-in, pinned scene, typewriter, count-up, gliding tab pill, numbered `01 / 37` caption, row hover fill, timeline scrub, language tabs, copy confirmation.

### 4.1 Launch (home, `/chat`, `/dev`, `/agents`, cloud products)

**Screens:** (1) hero, the product as the object; (2) show it, the product doing the thing; (3) 3 to 5 chapters, one idea and one object each; (4) proof; (5) objection strip from Hanzo's existing FAQ and compliance copy; (6) closing `Band`.
- Hero objects: Chat is the live chat window at 100%. Dev is a terminal with a diff landing. API is a terminal with the streamed curl. Cloud products show one status chip and one real number. With no real UI, a large tabular number or a one-line terminal is the object.
- Demos are scripted from real Hanzo content, run once for 6 to 10 s, then settle. On phone, a pinned scene becomes 3 static panels and cards stack one per screen.

**`/` (home).** One key reaches every model, for less.
- Order: Hero; Models and Platform; Agents; Race, Cheaper and Pareto together on one shared room; Open source; Trusted before Pricing; Pricing; Backed by (permitted names only); `Band`.
- Hero: the desktop app at 100% scale is the focal point, centred low (about 18% headroom). Read order: h1, primary, app. The phone mock is about 0.45× its width, right and behind, entering at 600 ms. The terminal docks as a one-line install strip under the ask.
- The hero app lifts 24px and fades as the Models grid rises. The `SPEC.md` cards start within one viewport of the hero headline: shorten the hero if needed.
- The existing top label is the primary; Google and GitHub are outlined; the beta ribbon, Open App and Download App become text links. One solid fill.
- Signature: a model card opens into its page. Removed: the counter, the second Pareto headline above the fold, two marquees, the sign-in panel's competing h1.

**`/chat`.** The existing app render at 100%, the existing plan cards, Download, `Band`. "Open" gets a hand-off state; "Open App" and "Try Hanzo" never share a weight.

**`/agents`.** Hero, the existing literal sequence at `#headless` as a numbered code block, one `AgentPrompt` component, `Band`; a terminal demo with pause and a static final frame.

### 4.2 System (`/enterprise`, `/platform`, `/security`, `/cloud` index)

**Screens:** (1) hero with the sales ask; (2) where it runs, four places with one in focus; (3) trust strip within 2 screens; (4) results, labelled as commerce results; (5) detail one click down (GPU drawer, spec sheets); (6) `Band` with one identical sales ask.

**`/enterprise`.** It runs where you need it, and you can verify it. Hero object: a deployment diagram from existing text, animating in once (0.9 s). Calm, like chatgpt.com/business/enterprise. Removed: the repeated deployment block, duplicate sales buttons.

**`/platform`.** 37 products, one sovereign cloud. Hero, the product directory (44px rows, 3 to 4 columns) as the hero object, the diagram, `Band`. Signature: row hover or focus reveals the existing description. It is Hanzo's strongest page: apply tokens and states, keep its idea.

**`/security`.** An honest status. The status row in Hanzo's words, chips, DPA and subprocessors, `security.txt` link, contact. No seals, no signature, a 0.4 s entry. Removed: the split with `/trust`, any invented certification mark.

### 4.3 Catalogue (`/models`, `/cloud`, `/integrations`, `/solutions`, `/oss` and families)

**Screens:** (1) hero with the exact count from `content/pages.json` as the focal figure, plus search; (2) filter tabs with a gliding pill; (3) numbered grid or list (`01 / 37`), prices in static HTML; (4) a card opens into its page; (5) `Band`. Morph never sits between the hero and the ask.

**`/models`.** Every model has a page, and the page opens from the card. Editorial families, maker shelves, collapsed link lists (part 15). The `SPEC.md` model grid is the hero object, with 6 or more cards above the fold at 1440×900. Keep the WebGL opener. Removed: per-item `whileInView` (use a list-level entrance), auto timers.

### 4.4 Story (`/about`, `/history`, `/blog`, `/investors`, `/press`)

**Screens:** (1) hero sentence; (2) the belief statement with a scroll word reveal; (3) big figures (1,600+ repos, Techstars '17) counted once; (4) a timeline scrub; (5) team or founders if Hanzo has them; (6) a soft end on the page's own closing link. Editorial like osply.co, hamol.studio and grubogrubo.com; never reuse the home hero's trick. Reading pages get one calm column (768px).

### 4.5 Utility (`/pricing`, `/contact-sales`, `/contact`, `/download`, `/careers`, legal)

Calm, precise, fast. No scroll theatre, at most one delight, 0.4 s entries. Forms: the result panel replaces the form and says what happens next; on failure the entries stay and the reason shows. Legal: reading column, sticky index, print CSS.

**`/pricing`.** Know the price before you ask. The existing audience tabs (Personal, Team, API) with a gliding pill, plan cards as columns of one sheet (the hero object), the first 3 FAQ questions, Privacy and Trust links near the ask, `Band`. Signature: prices roll in within 300 ms, no blur, announced politely. Removed: dead buttons, the competing "Pay as you go" definition.

### 4.6 Developer (`/api`, `/cli`, `/sdks`, `/mcp`, `/ide`)

**Screens:** (1) a terminal or code block as the hero, Copy beside the key ask; (2) language tabs; (3) prices and the free-tier line from the page; (4) a request-flow drawing; (5) install block; (6) `Band` (key ask and docs link). States: loading skeleton, streaming, rate-limited, error.

**`/api`.** The first call works on first paste. Existing request, existing response, key CTA adjacent, error line, docs link. Hero object: the `CodeBlock`. Signature: the response streams in once, pausable. Removed: gated key placeholders, hidden 429 art.

### 4.7 Model (544 pages, one template)

Shaped like the anthropic.com launch page. Pick it and try it.
**Screens:** (1) name, lede and the three numbers largest on the left, the film or Sigil at 4:5 on the right, light from the top left; (2) the existing CTA pair and a mono id pill; (3) the benchmark table, this model's column first and tinted `#f5f5f5`, honest gaps, method footnotes; (4) price per 1M tokens, real prices only; (5) quick start; (6) related models; (7) `Band`. It arrives by Morph from the card and reads well with animations off. A sticky local nav carries the ask, using the page's existing section names. Removed: "…" readouts, the auto-rotating snippet.

---

## 5. Mechanics

**Setup.** `npm ci`; `npm run dev` (port 4180) in the background.

**Files for a page.**
- `components/pages/<Name>.jsx` (`'use client'`) and `<Name>.css` (imported at the top, own `@media (max-width: 899px)` rules, a short class prefix such as `xa-`).
- `app/<path>/page.jsx`, a server file: `metadata` from `content/pages.json` and `<JsonLd route="/<path>" />`. Families use `app/<family>/[slug]/page.jsx` with `generateStaticParams`.
- Top comment: `// Persona:`, `// Goal:`, `// CTA:`, `// Signature:`, `// Beyond:`, and when done `V2: <score>/10 <one line>`. `Beyond:` names the one interactive aid the page adds (a calculator, a re-sortable table, a scrubbable timeline), built only from facts already on the page.
- Reuse `components/ui.jsx` and `kit.jsx` first (reference page: `components/pages/Enterprise.jsx`). Morph, Sigil, the thumb bar, the cursor, ⌘K and the 404 already exist.

**Parity.** `python3 scripts/parity.py /<path>` shows 0 missing before you push. The reference is `content/live/<path>.json` when present, else `content/pages/`. Where the outline looks thin, check live hanzo.ai: some parts draw in the browser.

**Forms: never submit for real.** The rebuilt form sends the same request as Hanzo's (`content/forms.json`, from `node scripts/forms.mjs /path`). While building, intercept the request so nothing is sent, as `scripts/forms.mjs` does. Never send a real form or chat message to Hanzo's live API. No deploys.

**Shared-file ownership.**
- Never edit `app/globals.css`, `tokens.css`, `app/layout.js`, `lib/*`, `docs/PAGES.md`, `components/ui.jsx`, `kit.jsx`, `Chrome.jsx`, `Nav.jsx`, `HeaderTools.jsx`, an existing `components/v2/*` file, or another chat's pages.
- Need a shared change? Write `docs/requests/<page>.md` and carry on page-local, in `components/pages/<page>/`.
- A new `components/v2/<Name>.jsx` is allowed only if the name is free: `git pull --rebase origin main`, check, one file per piece with a usage note on top, pull again right before the push.

**Git: no PRs, push per page.** Finish a page, commit (conventional message), `git pull --rebase origin main`, push your branch. The conductor merges every pushed branch within 2 to 10 minutes. No PR, no watching, no scheduled check-ins: carry on to the next page. After each pull, read `docs/review/<page>.md` and fix anything under 8 before a new page. End your turn only when every page you own has 8 or more. Never stall on an approval (avoid `rm` with globs; write each run into a fresh folder; never ask to change environment or network settings). Act as James: decide, and note it on your card.

**Checks before every push** (script checks take under 10 s):
1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:4180/<path>/` returns 200; the dev log shows no error or red badge.
2. `python3 scripts/parity.py /<path>`: 0 missing.
3. `python3 scripts/taste.py --fix <your files>`, then `python3 scripts/taste.py <your files>`: passes. It fails any hue and any label above a headline.
4. `python3 scripts/unique.py`: passes. It fingerprints sections, signature and first screen, and runs `scripts/variety.py` (2 fade-ups and 4 techniques at most) and `scripts/taste.py` on every page file touched since 7 Nov 06:00.

**Filming and proof (cloud only).** Install Chrome for Testing (`npx @puppeteer/browsers install chrome@stable`). Run `node scripts/motion.mjs /<page>` and `node scripts/phone.mjs /<page>`. Fix every STILL screen, DEAD control and layout shift over 0.05, then film again. Commit small proof to `docs/gallery/<page>/`.

**Reviews decide "ready".** Cloud critics write `docs/review/<page>.md` with `Verdict: N/10` and `First complaint:`. Your own score does not count.

---

## 6. The per-page 18-part card

Every page produces `docs/coverage/<page>.md`, copied from `docs/coverage/_TEMPLATE.md` (a family writes `<family>.md` and names two members it checked). It has exactly 18 headings, `## 1. Strategy and conversion` to `## 18. Measurement and handover`. Under each: tick the boxes that apply, strike the rest with `n/a: reason`, then fill the `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line is filled; the board shows "Ready" only at 18 of 18. The three lines above part 1 list open copy questions, requested shared changes, and the forks this page deleted.
