# /operator coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Operator.jsx` · gallery: `docs/gallery/operator/` · metric id: `cta_click operator.hero`

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/<page>.md`): none.
Forks this page deleted: the teal accent, the eyebrows over headings, a derived "10 Kinds" count that is not Hanzo's, the raw `.x-btn` asks (now kit `Cta` and `Band`).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment lines 2-7 carry Persona, Goal, CTA, Metric, Signature, Beyond; one solid fill in the hero (`Cta` "View on GitHub", `operator.hero`), one h1 (probe: h1=1 at all widths); no prices on the page.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` (probe main=1); every link through kit `A`/`Cta`; parity links 2/2, 0 removed.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- ~~`PageHero`; nothing above the h1~~ n/a: page-owned hero on the kit grammar (A2Lines h1 cut-in); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in `Band`, footer (n/a for a proof strip: Hanzo's /operator copy has no figures or proof to show)
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open a page

Done here: The cluster board sweeps within 1 s with no input; h1 lines cut in by mask; ends in the Band "Get started with Hanzo Operator" / Deploy to Cloud, then the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` in the hero and `Band` in the close; the shared header carries the sticky ask; `A2Paste` copies its displayed text; `data-cta`+`data-thumb` on `operator.hero`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No logos, seals or numbers beyond Hanzo's words ("thirty objects").

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no tables or FAQ; tabs n/a
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: `python3 scripts/parity.py /operator`: text 29/29, links 2/2.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (0 hues); the only labels above headings are visually hidden; one dark room (the hero board) — neighbours /sdks and /pubsub open on code and a bus, not a cluster board.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialogs
- ~~Inputs 16px or larger; no bare `:hover`~~ n/a: no inputs
- [x] Forks this page deleted: listed below

Done here: Kit buttons press to .97 with focus rings; the board's Kinds are buttons (press to drift) and keyboard-reachable; pause control is `A2Pause` (`aria-pressed`).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature `card-stack` on the second screen: "Declare the thing, not the thirty objects" heads a stack of Hanzo's six points, one per card (three visible, each 16px lower and 4% smaller); the top card is dragged or flicked away to either side (a throw past 110px or 600px/s, ease-in-out 400 ms, tilting at most 4°), swiped on touch (pan-y kept for page scroll), or sent with the arrow buttons / arrow keys; Previous brings the last card back from the side; the stack refills after the sixth, with a 01 / 06 count and six ticks. On arrival the top card leans 44px aside once and settles. The pinned Declare converge scene and the scroll-driven horizontal Track are removed (their words now head and fill the stack). The approved hero cluster board (sweep, drift, drag, log) is unchanged. Reduced motion: cards change instantly, no lean; JS off: the six cards read as a list (NoJs). Probe: 0 console errors at 1470×801 and 375×812 (also reduced), CLS ≤ 0.0006, hscroll 0 at 1470/375/320, no card overflows at 320; `variety.py` OK.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no media on this page: the board is drawn
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos

Done here: No images or films; the hero object is a drawn SVG/DOM cluster board.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Probe: hscroll 0 at 1470, 375 and 320; CLS 0; 8 Nov: drifting tiles stay inside the board at 375 (drift is toward the board centre); the card stack is a fixed 500px on phones with 48px arrow buttons under it and swipes sideways; hero ask above the fold at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no forms
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: One h1, h2 per section; the moving board has a pause control first; decorative art `aria-hidden`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and lede are in server HTML; motion is transform/opacity only; loops stop off screen; nothing heavy ran locally (cloud session).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/operator/page.jsx` takes title/description from `content/pages.json` and renders `<JsonLd route="/operator" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no cards
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: a single product page, no model cards or prices.

## 16. Developer experience
- [x] n/a for `CodeBlock` (not merged; the only commands are the paste prompt and "operator up", each copied by the kit `Copy` exactly as displayed)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Install lines through `A2Paste`; the log is a terminal-like region with a pause and a static rest state under reduced motion; no typed version number.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Loading has nothing to fetch (all copy and samples are in the server HTML); no live API call, so blocked networks leave the full page with 0 console errors (probe at 1470, 375, 320). Islands sit inside the shared error boundary.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/operator.md` (7/10 on the walk before this build; its fixes are in: hero ask and pause answer hover, board tiles drag only with a mouse and stay inside the board, touch scrolls the page and a tap drifts a Kind, "Declare" now heads the six-point card stack (the pinned converge was replaced in the motion-map pass), the heading shows under reduced motion with no hydration mismatch, "operator up" copies; 8 Nov: a drifting Kind always moves toward the middle of the board so it never pokes past the edge at 375, the log holds five lines in a 156px panel so it is never two-thirds empty, kms.hanzo.ai breaks after "kms." instead of clipping at 1470)

Done here: `data-cta` on `operator.hero`; `Cta` dispatches `hz-event` cta_click; nothing before consent; `V2:` line in the page file; verdict in `docs/build-notes/review/operator.md`.
