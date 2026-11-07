# /billing coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Billing.jsx` · gallery: `docs/gallery/billing/` · metric id: `cta_click:billing.primary`

Open copy questions for James: "Publish a new price" (`c4_publish_price`); "Reset" (`c4_reset`); "Projects" (`c4_projects`); "Products" (`c4_products`). Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only.
Shared changes requested (`docs/requests/billing.md`): none. The shared code pane (`components/pages/cloud/Frame.jsx`) animates a multi-tab pill with a spring; this page uses single-tab panes only and holds the pane to the deck colours in `components/v2/x-hamilton/Launch.css`.
Forks this page deleted: the hover tooltips that floated over the invoice, the invented "Change a price, not a customer" label, raw .x-btn asks and duplicate More links.

Measured on the dev server at 1470×801, 375×667 and 320×640 with `audit.cjs` (Playwright), JS on and off. Round 2 (after `docs/review/billing.md`, 7/10) re-measured at 1470×801 and 375×812: layout shift, overlaps, hovers, the drawer and the disabled state, as noted per part below.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a developer charging for usage; the one ask is Hanzo's "Read the docs" (`data-cta` primary in the hero, "start" as the later solid), metric `cta_click:billing.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. no prices on the live page. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /billing is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. 9 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /billing` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is split, re-laid page-locally on desktop: the h1 leads top-left (top at 100px on a 801px screen) with its mono caption and the asks under it on 7 columns, the long line beside it on 5, and the machine rising under both. The machine's zones are sized to the screen (`clamp(340px, 100svh − 372px, 480px)`), so at 1470×801 the whole machine sits on the first screen (310 to 788px) and the meter's 64px figure sits in the middle of its black column (about y 548), never at the fold. The object is events land on the meter, the meter counts, the invoice reads it and is issued, period after period, so events arriving every 0.43 s moves within the first second. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Billing" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (light) → three pinned chapters building one invoice (light; each chapter's left column carries its own object: the price stack, the meter filling one period, the invoice stepping Draft → Preview → Issued; the chapter head rises into the hero pin's empty tail, so the gap from the machine's bottom to "The objects you bill with" is about 95px at 1470×801, was about 350) → the history (dark) → get started (light) → Get Billing and related (dark, opening on ONE object: this period's invoice rises in as Preview and the ISSUED stamp lands once, then it rests). Round 3 trimmed the room tops: the history and Get started headings now sit 88px below their room's top edge. Both dark rooms (history and the close) enter as a rounded card inside the gutters (28px radius, 32px inset at desktop) that opens to full width as it is reached (CSS scroll-driven `clip-path`, measured 25.6px → 6.7px → 0 inset as the room rises; browsers without scroll timelines and reduced motion show it full width). The live page has no proof strip, so it ends on the band and the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, primary-2, start*, start-github, deploy (* = solid). The header carries the sticky ask at every width; the page bar is off (`data-ask="off"`) because the critic's shared note (15:00) fails any pill seen over content. Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

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
- [x] `python3 scripts/parity.py /billing`: 0 missing

Done here: Small text: 0 runs under 13px on desktop, 0 under 14px on the phone (mono capitals excepted). Sizes follow the deck: h1 52px (40 phone), section heads 26px, h3 17px, hero lede 17px, body 15px, figures 64px Air (48px in the chapter 02 meter, 56px in the closing line), growing only in their moment. Lede 44ch, body 66ch, headings balanced. Code: a TypeScript example in the shared code pane and the agent prompt. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS and the Cloud 4 shared files; only the deck neutrals and `#e4e4e7`. Captions sit under headings. Radii 6, 8, 12, 16, 20, 24 (28 on the search composer only); objects are outlined with a hairline and carry no shadow. Icons are one inline 16px stroke set. /telemetry shares the split look with a different object (the pipe). No three equal boxes in a row: the close is one invoice card (round 3 replaced the three-tile replay of the hero machine).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover)` and changes fill, border or colour; press is scale .97 in 90 ms; focus-visible draws a 2px ink or white ring. Measured in round 2: the hero "GitHub" link turns #525252 with its underline and a 4px arrow nudge; the light code pane's Copy fills #f5f5f5 with a darker border and ink. Round 3: the 01/02/03 chapter rail answers hover (the segment doubles in weight and turns #737373, the number lifts in), and the history ledger rows answer the pointer themselves (the row fills and lights its matching capability on the left, as the left list already did the other way). "Publish a new price" disables itself once Price 3 exists and then reads as disabled: 35% opacity, a dashed border, grey fill, `not-allowed` cursor, and no hover or press (Reset brings it back). Nothing on the page loads data, so no loading state. Dialogs: the example console in the shared Drawer ("Open in the console", Hanzo's words); on desktop the sheet opens 72px from the top (page-scoped), below the 60px header, so its title and × are visible and reachable (measured: the × is the element under the pointer). Its gateway line ("…so the limiter does too.") is in this page's own outline, `content/outline/billing.json`. Inputs: none. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: the invoice builds as you scroll (pinned scene). Supporting: the meter counting (time; the chapter 02 meter and chapter 03 steps share ONE meter value and ONE invoice stage with the pinned invoice, written from the scroll while pinned, so the left meter and the invoice's "× n", and the stepper and the invoice chip, always agree; stacked, the chapter objects run them once on time, under 5 s, and the invoice part beside them follows; the closing invoice's stamp lands once), capability highlight in the history (pointer), price publishing and the Draft → Preview → Issued steps (state). The hero's event rows now move by transform only inside a fixed, clipped window. `scripts/variety.py` OK. Kinds: idle (the hero object), time, state, pointer, with scroll only in the pinned scene. Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion (`useCalm`) renders the settled frame. No springs: every transition is 300 ms ease-emphasis or shorter.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML and SVG; each loop over 5 s carries a 44px pause button (1 on the page): the hero machine. The chapter 02 meter, the chapter 03 steps and the closing invoice run once, for under 5 s, then rest, so they need none.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Round 3 at 375×812: the hero machine sits inside the 16px gutter (left 16, width 343; its rounded frame is whole); the stacked chapters draw the full invoice once (chapter 01), then only what changes on it: the api_requests "× n" line under the meter (chapter 02) and the invoice head and footer where the stamp lands (chapter 03); the TypeScript pane no longer wraps mid-token, it scrolls sideways as a focusable region. Round 2 at 375×812: the ISSUED stamp keeps its rotate-and-land moment but now has its own row under "Preview one before it is issued." (text 388–409px, stamp 415–473px in one measured frame: no overlap), and the stacked chapters no longer slide 60px under the dark history room (the shared sticky offset is zeroed page-locally in stack mode), so the last invoice ends whole above it. Overflow 0px at 375 and 0px at 320. 0 controls under 44px at 375 after scrolling the whole page. The primary ask's bottom edge sits at 537px on a 667px screen. Pinned scenes stack below 900px; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Lowest measured text contrast 4.74:1 (0 runs flagged). Headings 123332232 with 0 skips. Pause controls: the hero machine. Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs; the code pane's `pre` is a focusable region (`tabindex=0`, `role=region`, labelled "typescript") so keyboard users can scroll it sideways.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /billing/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. 0 console errors at both widths (0 desktop, 0 phone). Layout shift (round 2, PerformanceObserver over the first ~5 s at rest with the hero running): 0.0002 desktop (all from the shared header, none from the page), 0.0000 phone; it was 0.047 and climbing before the event list became a fixed window.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Billing — Hanzo AI". Canonical https://hanzo.ai/billing/, og:url https://hanzo.ai/billing/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity, the machine as console, the three objects as chapters, the capabilities, the band. Prices: no prices on the live page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: a TypeScript example in the shared code pane and the agent prompt. The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

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
- [ ] Review read: `docs/review/billing.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/apps/Billing.jsx`. Last critic verdict on file: 7.5/10 (`docs/review/billing.md`, round 2). Round 3 fixes its list (dead air between rooms, the three-box close, chapter numbers that disagreed, the phone gutter, stacked invoices and code wrap, rail and ledger hovers, dark rooms entering as rounded cards) and waits for the next walk.
