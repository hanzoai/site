# /visor coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Visor.jsx` · gallery: `docs/gallery/visor/` · metric id: `cta_click:visor.primary`

Open copy questions for James: "Fewer" (`c4_fewer`); "More" (`c4_more_machines`); "Machines" (`c4_machines`); "Launch" (`c4_launch`). Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only.
Shared changes requested: none filed. Noted for the shared owner: `Finale` renders two h2s ("Get started with Hanzo Visor" and "Get Visor"); not changed here.
Forks this page deleted: the shared-element dialog that froze half open (kit Sheet now), the blinking "ready" lights, the "Name a fleet" label over the heading, the row of three equal tiles, then the 2-column grid of dark boxes (now one pinned room: a numbered list and one picture large), the `noscript` copy of the six paragraphs (they now sit in each row as `hidden="until-found"`).

Measured on the dev server at 1470×801, 375×812 and 320×640 with Playwright (`audit.js`, `shot.js`) and `scripts/motion.mjs`, JS on and off, 7 Nov round 2.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a platform engineer running machines on more than one cloud; the one ask is Hanzo's "View on GitHub" (`data-cta` primary in the hero, "close" as the later solid), metric `cta_click:visor.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. no prices on the live page. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /visor is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main">`; the layout's "Skip to content" targets `#main`. 4 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /visor` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is `StageHero look="rise"` with page-local CSS: a left-set title and, under it, the fleet console running left to right as a pipeline (request → three providers → one inventory → console), which rises 10svh as you scroll. The object is one request launching three GPU machines: providers answer, a dry run quotes, machines land in reserved slots of one inventory, so the launch sequence (first step at 0.5 s) moves within the first second. On the phone the providers sit side by side and the machines land first in the inventory, so train-01 and train-02 land inside the first 812px screen (y 717 and 756). `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Visor" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (light) → the pinned room of six (dark) → name a fleet (light) → closing band (dark), which carries Visor's own object: the inventory landing row by row with the SSH console open. The live page has no proof strip, so it ends on the band and the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [ ] Sticky ask in header and bar after the hero, same label (partly: the header carries Hanzo's "Try Hanzo" at every width; the page's own ask is "View on GitHub" in the hero and the close; the bar is off)
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, close*, deploy (* = solid). `data-ask="off"` is gone, so the shared header is quiet ("Try Hanzo" outlined) while the hero's solid "View on GitHub" is on screen and carries "View on GitHub" (solid) once it leaves: one solid per screen at 1470 and 375. Nothing floats over content. Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

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
- [x] `python3 scripts/parity.py /visor`: 0 missing

Done here: Small text: 0 visible text runs under 13px at 1470, 375 and 320 (11-12px mono capitals excepted; none on the page), measured by walking every text node in `main`. The hero's lowercase mono runs ("cached and priced", the "train-01" tab, the audit line) are 13px. Sizes follow the deck: h1 52px (40 phone), section heads 26px, h3 17px, lede 20px, body 15px, figures 64px Air, growing only in their moment. Lede 44ch, body 66ch, headings balanced. Code: the agent prompt in the band. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; every literal value is a deck value
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS; only the deck neutrals (the CSS writes them as literal deck hex values, not `var()` tokens). The tile pictures draw ink on `#fafafa` chips, so no word is white on white. Captions sit under headings. Radii 6, 8, 12, 16, 20, 24 (28 on the search composer only); objects are outlined with a hairline and carry no shadow. Icons are one inline 16px stroke set. Neighbours: /sentinel and /world sit beside their object (side), /search centres (rise), /telemetry and /billing split, /stream frames; /visor is the only left-set title over a full-width pipeline console, and the only pinned numbered room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs trap focus and return it (the kit `Sheet`, a `role="dialog"` element, not a native `<dialog>`)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover)` and changes fill or border only; press is scale .97 in 90 ms; focus-visible draws a 2px ink or white ring; disabled controls drop to 40%. Nothing on the page loads data, so no loading state. Dialogs: the six rows open in the kit Sheet, a `div role="dialog"` (focus held, Escape closes, focus returns). Inputs: prefix input (20px text; focus draws the one 2px ink ring with a white halo, caret in ink), machine count (48px icon buttons), dry run or launch toggle. Row hover on desktop previews that item's picture on the stage, brightens the title and turns the plus. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: the pinned room (desktop): scroll walks 01 → 06, a hairline under the current row fills over 4 s and the room then steps on by itself, hovering a row previews it, and the stage replays that item's picture large (bars price, machines name themselves, the pool fills, "quote" cuts in by line mask, SSH is picked, audit rows land); any row opens into its card (kit Sheet). On phones the rows stack as cards whose pictures play once on arrival. Supporting: launch sequence (time, pausable; the pause also stops the console caret), the naming tool's batch naming itself 01, 02, 03 on arrival (time), inventory re-flow (state), the close's inventory landing once (time). `scripts/variety.py` OK. Kinds: idle (hero, the room's resting step), time, state, pointer (row preview), with scroll only driving the pinned room. Timers are `setTimeout` chains, no `setInterval`. `motion.mjs` desktop: 2 still screens of 9 (the hero caught mid-hold, and the room's entry frame). Reduced motion (`useCalm`) renders the settled frame. No springs: controls answer in 90 to 300 ms; the tile pictures' one-time arrivals (bars, the "quote" line mask) run 500 to 700 ms with ease-emphasis.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML and SVG; the one loop over 5 s (the hero fleet, about 9 s) carries the shared 44px `PauseBtn` (`aria-pressed`) in the request card's top-right corner, clear of its text.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Overflow 0px at 375 and 0px at 320. Under 900px the three providers sit side by side (48px chips), so the AWS pick still happens on the phone and the first machines land inside the first screen. 0 controls in `main` under 44px at 1470, 375 and 320 after scrolling the whole page (the shared footer and header were not counted). The primary ask's bottom edge sits at 388px on a 667px screen. Pinned scenes stack below 900px; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Resting states are legible: the dry-run line and the unanswered providers' "…" are #525252 on #f5f5f5 / #fff (7.0:1 / 7.8:1) at every step of the loop, no faded opacity; an unanswered provider is drawn with a dashed border instead of 45% opacity. Inactive rows in the dark room are white at 55% on black (about 6.6:1). Contrast is computed from the CSS values, not run through an automated checker this round. Headings 12222 with 0 skips. Pause controls: the hero fleet. Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /visor/` returns the h1 in the HTML. Layout shift 0.0024 desktop, 0.0005 phone (Playwright walk, whole page, round 2); `motion.mjs` 0.014 desktop, 0.000 phone: the hero inventory reserves three dashed machine slots that fill in place, so nothing moves. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. 0 console errors at both widths (0 desktop, 0 phone).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Visor — Hanzo AI". Canonical https://hanzo.ai/visor/, og:url https://hanzo.ai/visor/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity, the fleet as console, six openable features, the band. Prices: no prices on the live page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: the agent prompt in the band. The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML (the six paragraphs too, in their rows, shown in place with JS off and `hidden="until-found"` with JS on) and every demo is local, so a blocked network still shows the whole page. Each demo is its own component; the page has no shared runtime state to lose.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/visor.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/cloud/Visor.jsx`. Last critic verdict on file: 7/10 (walked round 1); this version (round 2) waits for the next walk.
