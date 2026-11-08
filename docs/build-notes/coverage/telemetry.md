# /telemetry coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Telemetry.jsx` · gallery: `docs/gallery/telemetry/` · metric id: `cta_click:telemetry.primary`

Open copy questions for James: the config.yaml and builder.yaml files (their names, keys and `${CEILING}`/`${BACKEND}` placeholders) and the builder's group labels "signals", "protocols", "processors" are visible text written for this page: a standard OpenTelemetry collector config, not text Hanzo published. They are NOT in `content/ui-strings.json`; approve them, or the config window and the Copy button come out. The stage names in the strip and the collector at rest ("OTLP in", "pipelines", "batching", "memory ceiling", "OTLP out") are the same kind of question.
Shared changes requested (`docs/requests/telemetry.md`): the `FooterHTML` hydration mismatch (red "1 Issue" badge on fresh loads, all pages); the phone header going quiet while a page's own ask is on screen.
Forks this page deleted: the yellow boxes and code highlights (greys now), the label on the headline, the dark chapters next to the dark band (light now).

Measured on the dev server at 1470×801, 375×667 and 320×640 with `audit.cjs` (Playwright), JS on and off.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a platform engineer putting a collector in front of a backend; the one ask is Hanzo's "View on GitHub" (`data-cta` primary in the hero, "close" in the band), metric `cta_click:telemetry.primary`. One solid per screen, checked by screenshot at every 70% scroll step: desktop, the hero's "View on GitHub" is solid while the header's "Try Hanzo" is an outline, then the header carries "View on GitHub" solid, and goes quiet again while the band's "View on GitHub" is in view; phone (≤700px), the header keeps Hanzo's solid "Try Hanzo" and the page's two "View on GitHub" buttons are outlined. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. No prices on the live page. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /telemetry is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main">`; the layout's "Skip to content" targets `#main`. 4 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /telemetry` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is split (title on 8 columns, line and action on 4, the pipe rising under); the object is the OTLP pipe: traces, metrics and logs enter, batch in the collector and leave in batches, so the signals moving through the pipe moves within the first second; the incoming and outgoing span share one grid cell on the dotted line, so no span lands on a second row. The hero holds for 125svh on desktop and the chapters' head follows 27px after it, so no screen between them is half blank. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Telemetry" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (light) → six chapters beside the config file (light, pinned) → closing band with "your config" (dark). The live page has no proof strip, so it ends on the band and the footer. The band ends on the page's own object: the collector at rest (OTLP in → collector → OTLP out) on top of "Your config", redrawn by its toggles, with "Put it in front of your backend" and its ask riding beside it (sticky on desktop). On desktop the copy takes 4 columns and "Your config" 8, in two inner columns (collector at rest and toggles left, the config right), so the band has no empty black half. The shared Finale's "Get Telemetry" row below keeps its own layout.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header after the hero (desktop, same label); phone: header keeps "Try Hanzo", the shared bar may carry "View on GitHub"
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, close*, deploy (* = solid). Desktop: once the hero's "View on GitHub" leaves view the shared header's button reads "View on GitHub" (solid), and it turns quiet while the band's twin is on screen. Phone: the header keeps "Try Hanzo"; the shared bar carries "View on GitHub" only where nothing sits under it (a heavy walk at 375×812 saw it twice, both over empty chapter margin). Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No partner logos; product names appear as text only. Parity holds every printed figure. Demo values (counts, offsets, machine names) are labelled examples in the header comment and drawn as objects, not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /telemetry`: 0 missing

Done here: Small text (every text node in main, measured after a full scroll): 0 runs under 13px on desktop, 0 under 14px on the phone, mono capitals excepted; the only smaller glyph is the 11px ✓ inside the config toggles (an icon, not text). The collector at rest is 13px desktop, 14px phone. Sizes follow the deck: h1 52px (40 phone), section heads 26px (including the band's "Put it in front of your backend" and "Get Telemetry"), chapter h3 21px, lede 20px, body 15px, figures 64px Air, growing only in their moment. Lede 44ch, body 66ch, headings balanced. Code: the config file is the chapter object; the agent prompt in the band. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS; only the deck neutrals and `#e4e4e7`, written as literals from the deck ramp (the shared Cloud kit's habit; no off-deck value). Captions sit under headings. Radii snapped to the deck set: 6, 8, 12, 16, 20, 24 and full (the 10, 14 and 18px radii are gone). The lit config lines no longer carry a left stripe; a lit line is a fill only. Icons are one inline 16px stroke set. /billing shares the split hero look with a different object (the meter); below the hero this page is its own: the living graph room, then the facts read beside their file.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover)` and changes fill or border (the config toggles also fill grey and nudge their check, on or off); press is scale .98 (the config toggles) or the kit's press (Cta, Copy, Pause); focus-visible draws a 2px ink or white ring; disabled controls drop to 40%. Nothing on the page loads data, so no loading state. Dialogs: none. Inputs: the config pills (aria-pressed). Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: the living graph (the pipeline settles like a physics graph; hover, focus or tap a node and its paths light). Then the facts read beside their file (desktop): config.yaml stands sticky beside the six facts, and the fact at the middle of the screen lights its block, writes its lines in by clip-path, runs a span along the strip to its stage and counts 01 / 06 to 06 / 06; click a fact to read it. Chapter 05 outlines the five stages instead of filling them. Phones keep the stepped config (time, with Pause; tap a key). Supporting: batch filling (time), config pills (state; the collector at rest strikes through what you switch off), hover a hero signal (pointer, with a pointer cursor) and only that kind flows in. `scripts/variety.py` OK. Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion (`useCalm`) renders the settled frame.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML and SVG; each loop over 5 s carries a 44px pause button: the hero pipe, and one beside each chapter's key (the chapter strip's running span). All seven are one switch, so pausing anywhere stops both.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: The chapter rail sits under the chapter copy (columns 9–12), clear of the config window on every desktop chapter (window right edge 821px, rail from 943px). Overflow 0px at 375 and 0px at 320. 0 controls under 44px at 375 after scrolling the whole page. The primary ask's bottom edge sits at 378px on a 667px screen. Pinned scenes stack below 900px; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Contrast measured on every visible text node at each 600px scroll step against its nearest opaque background: lowest 7.11:1 on desktop, 4.54:1 on the phone (a hero signal chip), 0 under 4.5:1. Unlit strip stages are #525252 on white (7.8:1); code lines, line numbers and placeholders are #a3a3a3 on #0f0f0f. Headings 1233333322 with 0 skips. Pause controls: the hero pipe and each chapter (one shared switch, `aria-pressed`). Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /telemetry/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. Layout shift (PerformanceObserver, a 6 s hero dwell then a wheel walk in 240px steps, cookie note dismissed): 0.0009 at 1470×801 and 0.0000 at 375×812, with and without reduced motion; a plain 70%-step walk measured 0.0036 desktop, 0.0000 phone. 0 page console errors in those runs. The shared footer's intermittent hydration badge is requested, not this page's.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Telemetry — Hanzo AI". Canonical https://hanzo.ai/telemetry/, og:url https://hanzo.ai/telemetry/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity, the pipe as console, the chapters as the openable features, the band. Prices: no prices on the live page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: the config file is the chapter object; the agent prompt in the band. The copyable config is the builder's text and is listed above as a question for James. The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network still shows the whole page; JS off was checked above. Each demo is its own component; the page has no shared runtime state to lose.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/telemetry.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/cloud/Telemetry.jsx` (to carry the critic's score). Ready (7 Nov, D2 run). Earlier critic verdict on file: 7/10 (walked before these round-2 fixes); this version waits for the next walk.
