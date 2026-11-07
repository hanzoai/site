# /telemetry coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Telemetry.jsx` · gallery: `docs/gallery/telemetry/` · metric id: `cta_click:telemetry.primary`

Open copy questions for James: "Mode" (`c4_mode`); the copyable config.yaml and builder.yaml are a standard OpenTelemetry collector config with `${CEILING}`/`${BACKEND}` placeholders written by the builder, not text Hanzo published: approve them, or the Copy button comes out. Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only.
Shared changes requested (`docs/requests/telemetry.md`): none.
Forks this page deleted: the yellow boxes and code highlights (greys now), the label on the headline, the dark chapters next to the dark band (light now).

Measured on the dev server at 1470×801, 375×667 and 320×640 with `audit.cjs` (Playwright), JS on and off.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a platform engineer putting a collector in front of a backend; the one ask is Hanzo's "View on GitHub" (`data-cta` primary in the hero, "close" as the later solid), metric `cta_click:telemetry.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. no prices on the live page. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /telemetry is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. 4 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /telemetry` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is split (title on 8 columns, line and action on 4, the pipe rising under); the object is the OTLP pipe: traces, metrics and logs enter, batch in the collector and leave in batches, so the signals moving through the pipe moves within the first second. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Telemetry" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (light) → six chapters beside the config file (light, pinned) → closing band with "your config" (dark). The live page has no proof strip, so it ends on the band and the footer. The band ends on the page's own object: the collector at rest (OTLP in → collector → OTLP out) on top of "Your config", redrawn by its toggles, with "Put it in front of your backend" and its ask riding beside it (sticky on desktop) so the band never shows an empty half.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, close*, deploy (* = solid). The header carries the sticky ask at every width; the page bar is off (`data-ask="off"`) because the critic's shared note (15:00) fails any pill seen over content. Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

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

Done here: Small text: 0 runs under 13px on desktop, 0 under 14px on the phone (mono capitals excepted). Sizes follow the deck: h1 52px (40 phone), section heads 26px (including the band's "Put it in front of your backend" and "Get Telemetry"), chapter h3 21px, lede 20px, body 15px, figures 64px Air, growing only in their moment. Lede 44ch, body 66ch, headings balanced. Code: the config file is the chapter object; the agent prompt in the band. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS and the Cloud 4 shared files; only the deck neutrals and `#e4e4e7`. Captions sit under headings. Radii 6, 8, 12, 16, 20, 24 (28 on the search composer only); objects are outlined with a hairline and carry no shadow. Icons are one inline 16px stroke set. /billing shares the split look with a different object (the meter).

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

Done here: Signature: read the collector's config as you scroll (pinned scene). Supporting: batch filling (time), the chapter arrival (a span runs the pipeline strip to the lit stage in 1.2 s, the lit lines write in by clip-path 80 ms apart, a caret blinks 5 times and stops; on phones each stacked chapter plays it once as it comes into view), config pills (state; the collector at rest above them strikes through a signal or processor you switch off). `scripts/variety.py` OK. Kinds: idle (the hero collector), time (write-in, caret), state (pills, chapter swap), pointer (hover a signal in the hero and only that kind flows in), with scroll only in the pinned scene. Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion (`useCalm`) renders the settled frame. No springs: every transition is 300 ms ease-emphasis or shorter.

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

Done here: Overflow 0px at 375 and 0px at 320. 0 controls under 44px at 375 after scrolling the whole page. The primary ask's bottom edge sits at 378px on a 667px screen. Pinned scenes stack below 900px; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Lowest measured text contrast 7.11:1 (0 runs flagged). Headings 1233333322 with 0 skips. Pause controls: the hero pipe and each chapter (one shared switch, `aria-pressed`). Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /telemetry/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. Layout shift over a full wheel scroll (16:28, `scripts/motion.mjs` and a PerformanceObserver walk): 0.007–0.010 at 1470×801, 0.005–0.016 at 375×812 (the code window holds its 20-line height, so builder.yaml no longer re-centres the stage). 0 console errors at both widths (0 desktop, 0 phone).

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

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/cloud/Telemetry.jsx`. Last critic verdict on file: 6/10 (walked an earlier version); this version waits for the next walk.
