# /commerce coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Commerce.jsx` · gallery: `docs/gallery/commerce/` · metric id: `docs_click`

Open copy questions for James: none new. ("Read the docs" is Hanzo's own hero label and stays the ask until `lib/cta.js` lands. The cards' "held", "captured", "return", "size · colour · price" and "cart {id}" are labels drawn from Hanzo's own stop sentences; the endpoint counts are counts of Hanzo's list.)
Shared changes requested (`docs/requests/commerce.md`): none.
Forks this page deleted: the raw `.x-btn` asks and the interim `BizAsk` (now the kit `Cta`), the v1 `Get` block and `Rise` fade-ups, the hand-rolled endpoint tabs (now five columns plus one `BizSheet` per group), the `data-cursor` label, every spring, the three equal integration columns.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: the top comment carries Persona, Goal, CTA, `Metric: docs_click`, Signature and Beyond; "Read the docs" differs from the header's "Try Hanzo", so it is the page's one solid fill (hero, then the close); the audit counts 1 page-owned solid button in the first 1470×801 view.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's, untouched)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: links are `A`, `More` and the kit `Cta`; parity links 7/7; the ten noun cards open panels in place and the four ways in are real links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: BizLines h1 + the rail until `PageHero` merges)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close: one 44px sentence, the ask, a full-width "View on GitHub" row, then the footer about 72px below it)
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: noun cards open panels in place)

Done here: at 1470×801 the h1 sits at y 267–321 (bottom at 40% of the screen) with the lede beside it at y 194–253, and the full-bleed rail (y 365–725) sits under them, as on the phone (h1 132–174). The order's first move is at 700ms on first view (then every 3.2s), so the t≈1.1s shot already shows stop 02. The journey no longer repeats the hero's cards: each stop is a line drawing that draws itself as its pane lands, with its endpoint rows arriving one by one. Section gaps after the processor switch are about 88px at 1470 (were 160–250px). (8 Nov) The close stands alone: a full section pad (116–188px) now separates it from the ways rows and Get Commerce.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header after the hero, same label (desktop header swaps to "Read the docs" after the hero; on the phone the header keeps "Try Hanzo" and no bottom bar was seen in the walk, which is shared chrome, not this page's code)
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button)
- [x] `data-cta` and `data-thumb` on every primary

Done here: hero `<Cta to={DOCS} id="commerce.hero" thumb>Read the docs</Cta>`, close `<Cta id="commerce.close">`, "API Platform" is `<Cta kind="link" id="commerce.platform">`. (8 Nov) While the close's solid "Read the docs" is on screen the header ask goes quiet, so one solid fill per viewport.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: none)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: every path and description is Hanzo's endpoint list (74 endpoints in 5 groups); integrations are Hanzo's names as text, no logos; "MIT or Apache-2.0" and the rest of the spec sheet are Hanzo's words.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (endpoint lists live in `BizOpen` panels and `BizSheet` drawers)
- [x] `python3 scripts/parity.py /commerce`: 0 missing

Done here: parity 272/272 text, 7/7 links; the phone audit finds 0 text under 14px and 0 targets under 44px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; colours are `--bz-*` tokens plus #000000, #fafafa, #a3a3a3, #171717; radii 6/8/12/16/24/full; the order card, panes and switch are outlined, tiles are flat fills, nothing is raised; h1 52, headings 26, figures 64 at rest (the find word 44, counts 32). The integrations are rows (label left, names right), not three equal boxes. Hero medium is a full-bleed rail, unlike /payments (a phone) and /captable (a figure).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit BizSheet and BizOpen)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: stops, pause, suggestion chips, Clear, processor pills, index rows, spec rows and chips have a hover fill inside `@media (hover: hover)`, press .97/.98 and a 2px focus ring; the four ways rows fill on hover, nudge their link 4px and press to .98; "View on GitHub" fills, nudges its arrow and presses 1px; "API Platform" underlines and steps its arrow 4px on hover; the ways rows' descriptions all start at x 355 and every hairline runs 159–821; the processor switch is a radiogroup with arrow keys; the find input is 44px (32px phone) with a label.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: no sound of its own)

Done here: signature (the order rides the rail, idle, first move at 700ms) + the scroll-driven journey (scroll) whose stop drawings draw in with `pathLength` dashes + BizOpen (state) + line-mask headings; the processor pill glides (state, 300ms ease-emphasis), the endpoints answer as you type (time), and the spec sheet opens one row at a time and lights its part of the install drawing (state). `variety.py`: 3 techniques (layoutId, useScroll, pathLength). The rider and the tick move with a 500ms ease-in-out tween, no springs; reduced motion lays the journey out still and drops the draw-in; the rail uses setTimeout only.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: one decorative `<img>`, Hanzo's zen.webp with width and height)
- [x] At most 2 videos playing; pause button on loops over 5 s (no video; the riding order has a 44px pause)
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: one image)

Done here: `/models/zen.webp` with `alt=""` and fixed 104×104, shown once (on the rail's order card only); the five journey stops, the four shape tiles and the install drawing beside the spec sheet are line drawings; the tile art drifts 12px on hover with a fine pointer only (James's art drift).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812 overflow 0; the hero stacks title, line, ask, then the rail (card full width, stops as numbered dots) and the tick under the card walks to the active dot (centre within 1px of it); the journey becomes five stacked steps; endpoint paths break only after "/" (`<wbr>`), so "/order/{id}/capture" never splits inside a word; the ask sits at about 330px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (the search has a label and a Clear button)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: text is #0a0a0a or #525252 on white and room fills, #737373 only on white, #a3a3a3 and white 55% only on black; stops and chips use `aria-pressed`, the switch `role="radio"` with `aria-checked`, the spec rows are buttons with `aria-expanded`/`aria-controls` (every answer stays in the HTML, collapsed). Noun panels name an endpoint's group once where a run of it starts, not on every row.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: one scroll-linked transform drives the journey; the rail runs only while on screen (`useLive`); transform and opacity only; filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: noun cards open panels in place)

Done here: `app/commerce/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/commerce" />`.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a)
- [ ] Every maker and model page linked in the DOM (n/a)
- [ ] One price figure everywhere (n/a: no price)

Done here: n/a, a Launch page for one API; the noun index is a page-level disclosure, not a catalogue.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (n/a: endpoint paths are shown as text rows, not a code block)
- [x] Config blocks parse on their own (n/a)
- [x] Terminal pauses and ends on a static frame (n/a)
- [x] No hand-typed version number

Done here: "Find an endpoint" searches all five groups at once and starts on "refund" (3 across 2 groups); each group's full list is one tap away in its sheet.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: the finder's no-match state dims the group and shows an em dash; Clear empties it and the columns show every group's count; it reads with JS off because it renders "refund" on the server. Film: no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/commerce.md` verdict 7/10, every listed fix addressed in round 2; awaiting a fresh review

Done here: `data-cta="commerce.hero"`, `"commerce.platform"`, `"commerce.close"`; gallery `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`, plus round 2 `desktop-r2.jpg` and `phone-r2.jpg` at 1470×801 and 375×812; errs.js 0 errors, overflow 0 at both sizes.
