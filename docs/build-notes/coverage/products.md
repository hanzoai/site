# /products/* coverage (MASTER.md part 2, the 18 parts)

Family template: `components/pages/ProductPage.jsx` + `ProductPage.css`, data `components/pages/productsData.js`, route `app/products/[slug]/page.jsx` · seven members · checked: `/products/agents`, `/products/memory` (also `/products/models`, `/products/record`) · gallery: `docs/gallery/products/` · metric id: `signup_start` (then `api_key_created`)

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/<page>.md`): none. The kit (`components/v2/Fam*`, `fam.css`) is this family group's own.
Forks this page deleted: the dark console card and the pinned word+card chapters (the layout /oss and /solutions share), the separate spec sheet with its raw `<table>`, the repeated operation lists (said once now), the thin count, the empty no-figure card, the link-list ending, the per-product accent colours, the green live dot, syntax and method hues, the kicker over the h1, the coloured hover stripe, the invented "operations" and "Replay" labels, the word-lit 60-word paragraph, the Stage zoom that pushed the console under the fold, the console's endless replay, every hover nudge outside James's list, and the 96–200px type.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's own hero (`lib/cta.js` not merged yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices on these pages
- [x] Open copy questions for James listed, none decided

Done here: "Try Hanzo" (Hanzo's label and href from the captured hero) is the one solid in the hero and again in the closing band; the product's API link is outlined. The first screen is the product name (h1, arriving large and settling to 52), its line, the ask and the light console, nearly page-wide.

## 2. Information architecture and navigation
- [x] One `<main>`; the site layout carries the skip link
- [x] Every link through `A` or `More`; every Hanzo OS row a real link
- [ ] Breadcrumb at depth 2 or more: n/a: Hanzo's captured page has none and copy is frozen; the Hanzo OS list names all seven layers with the current one marked
- [x] Link parity: 0 removed, 0 unexpected

Done here: agents links 21/21, memory 19/19, models 18/18 (`scripts/parity.py`). The seven layers are `<a href>` rows with `aria-current="page"` on this one.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from kit parts (`FamLines` h1 cut-in by line mask, 700 ms, 60 ms apart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the docs and site links, quietly, then one dark `Band` (Hanzo's name, line and the one ask), then the footer
- [x] Card-to-page links use Morph (`data-morph` on each layer name, `data-morph-target` on the h1); the other layers are prefetched while you read and each page mounts fresh (keyed by slug)

Done here: at 1470×801 the name, line, ask and the whole console (470px panes) with its step bar ("Try it", 01, 02...) sit on the first screen; the request starts typing 250 ms after arrival, then the console steps through Hanzo's sentences by itself. Nothing pins: after the console come Measured (memory), Hanzo OS, the docs and a dark closing band with the one ask. JS off: the step bar is hidden and the console shows the request and every sentence in full (measured: console 783px tall, nothing clipped); the paragraph is in the HTML whole.

## 4. Conversion system
- [x] Kit buttons (`v2f-btn`) only; no raw `.x-btn`
- [x] Sticky ask after the hero, same label (the site ask bar reads `data-thumb`)
- [x] Copy button (kit `Copy`) copies exactly the request on screen
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-thumb="Try Hanzo"` and `data-cta="products.hero"` on the hero ask (magnetic, at most 22px), `data-cta="products.close"` in the closing band; the header carries the ask after the hero (site layer).

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] n/a: no marquee on these pages
- [x] n/a: no form on these pages

Done here: the operation counts are the row counts of Hanzo's own API table; the Measured figures on /products/memory are taken from Hanzo's own sentences ("from A to B" stands as B), each linking to its benchmark.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; sentences `pretty`, headings `balance`
- [x] Hanzo's API table is said once, inside the console (method, path, what it does), as an accessible `role=table` (no raw `<table>`); code scrolls sideways and never breaks mid-URL; paths break only after a slash
- [x] `python3 scripts/parity.py`: 0 missing

Done here: parity agents 60/60, memory 59/59, models 54/54, record 53/53. Sizes: h1 52 at rest (arrives at 72, measured), section heads 44 as a decision (each is the one big word of its screen, above JAMES.md's 26px rest; noted per MASTER §0.6), sentences 26 in the console (17 on phones), table 14, body 16, figures 64; pane labels and table heads are 12px mono capitals.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes from the kit tokens; objects outlined, never box plus shadow
- [x] One icon set (two inline strokes: arrow, replay); no icon in a rounded box
- [x] Differs from neighbours: a light, page-wide console under the name whose step bar morphs it through Hanzo's sentences (oss and solutions lead with a black card beside the title; /pricing's morph panel is a plan rail beside a growing plan sheet, this one a fixed-size two-pane console)

Done here: ink, greys and white only; GET and POST differ by outline against fill; an operation a sentence does not name steps back to grey #737373, the named ones sit on a #ededed light. The console is light and outlined (1px black 10%, no shadow); the one dark room is the closing band. Its own layout: name over a wide light console with its own step bar, not the title-left / black-card-right layout /oss and /solutions use.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring visible on every stop (site ring)
- [x] n/a: no dialog on these pages
- [x] n/a: no inputs
- [x] Forks this page deleted: listed above

Done here: replay, copy, asks, layer rows and Measured cards all press at .97; hover changes fill or border, never a fade and never a nudge outside James's list.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`): Copy and the solid asks sound by themselves; the console calls `play('done')` once when its walk ends

Done here: the signature is `morph-panel` (MOTION-MAP, 7 Nov): the console is ONE panel whose states are Hanzo's "Try it" and each of its sentences, picked from the console's own step bar (a pill slides between the steps; arrow keys move it). "Try it": the request types itself and the API table lands row by row. Each sentence step morphs the same panel in place: the left pane's request lifts away as the sentence rises into its seat (300 ms out, 400 ms in, 120 ms apart, all states stacked in one grid cell so the pane never changes size), its label turns from "Try it" to "02 / 03", and the light in the API table (one fill per named operation, placed by transform only) slides 500 ms in-out onto the operations the sentence names while the others step back to grey; on a phone the table's own box scrolls a named row into view. Once the request has landed the console walks the sentences by itself (3.4 s each) and rests back on "Try it" with `play('done')`; Pause holds it, any step takes over, Replay runs it all again. Removed: the pinned Stage (console pinned over a scroll-scrubbed sentence strip, the phone swipe rail) and the line-mask cut-in on the section headings (the h1's cut-in is the page's one reveal). Other movement: pointer (magnetic ask; a row fills under the pointer; layer counts on hover), arrival (the name cut in large and settling), scroll (only the first measured figure growing past 64px at its moment). Measured: untouched CLS during the whole walk 0.0002 desktop, 0.001 phone; 0 console errors on agents, memory, models, record at 1470×801 and 375×812, and with reduced motion (steps then change at once, no walk, no typing).

## 10. Media
- [x] n/a: Hanzo has no film or photograph for these pages
- [x] n/a: no video
- [x] Nothing missing
- [x] The product UI (console, API table) and the product's own contour (Sigil seeded `/products/<slug>`) are the visuals

Done here: each member is told apart by its own contour (seed `/products/<slug>`, data from its own counts) and its own request and operations, never by a colour.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path (tap an operation for its line)
- [x] Primary ask above the fold at 375×667

Done here: on phones the name, line and both asks come first and the console starts under them; the console's step bar takes its own row (40px steps, the full width) under the host, Copy and Replay; the left pane is 240px (request or sentence, 17px) and the API table at most 340px, each scrolling inside; the Hanzo OS rows keep their label beside the count (no layout shift as rows land: measured CLS 0.001); doc links are 44px tall. Sideways swipe turns to the previous or next product (tested memory → models, agents → record; the code pane keeps its own sideways scroll).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: muted #525252 on white 7.8:1; console text #a1a1a6 on #0b0b0c about 7.9:1
- [x] Moving content past 5 s has a pause: the console's walk through the sentences (about 12 s, once) shows Pause in place of Replay while it runs; the hero contour is still
- [x] n/a: no form
- [x] One h1; h2 per section; the replay control's name comes from `content/ui-strings.json`
- [x] Keyboard reaches every control

Done here: the API table is read once, in the console, with column headers; the paragraph is read whole once (the console's sentence pane is its picture, `aria-hidden`); the step bar is a `tablist` whose sentence steps are named "Chapter 2 of 3" from `content/ui-strings.json`, and the console body is its `tabpanel`; Pause and Replay take their names from the same register.

## 13. Performance and engineering
- [x] h1 and LCP in server HTML
- [x] One rAF while typing; typing writes text nodes by ref
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (all checks in the cloud)

Done here: transform and opacity only; the request pane scrolls itself only when the cursor would leave the view.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical unchanged from the site layout
- [x] `<JsonLd route>` unchanged
- [x] Every layer row is a real link

Done here: `app/products/[slug]/page.jsx` keeps `generateMetadata` and `JsonLd` for all seven members.

## 15. Catalogue and product pages
- [x] n/a: not a model page
- [x] Every layer row opens by Morph
- [x] All seven layers linked in the DOM
- [x] One operation count everywhere (console, sheet, layer rows)

Done here: the Hanzo OS list is the related rail (six siblings plus the current one); each name is the Morph source into its page's h1. On the dev server the open holds while the next page renders (2–3 s); the static build serves it pre-rendered.

## 16. Developer experience
- [x] Copy equals the displayed request
- [x] n/a: no config block
- [x] The console ends on a static frame and replays only on request
- [x] No hand-typed version number

Done here: the request is Hanzo's own "Try it" block, typed from the captured tokens; Copy copies it whole.

## 17. States and resilience
- [x] n/a: static data captured from Hanzo's page, no loading or offline state
- [x] No live request from the page
- [x] n/a: no submit
- [x] Without scripts the console shows the finished request and answer; with scripts a CSS failsafe shows them after 3.5 s if arming never happens

Done here: JS off and reduced motion both show the final state (measured: 0 hidden blocks). Measured results without a figure read as text rows after the figures (memory: CronQuestions), never an empty card.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`products.hero`, `products.close`)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/build-notes/review/products.md` (7/10 on the walk before this build; in this build the request types in 1.8 s at most with the rows landing while it types, the table never paints then fades (it is hidden from first paint with JS on), the desktop strip is wide in CSS from the first paint, and the phone fixes above)

Done here: round 6 answers docs/build-notes/review/products-family.md (5/10): operations said once, the product as the first screen's big thing, phone fixes, a closing band, no empty card, a continuous open, and a layout of its own.
