# /products/* coverage (MASTER.md part 2, the 18 parts)

Family template: `components/pages/ProductPage.jsx` + `ProductPage.css`, data `components/pages/productsData.js`, route `app/products/[slug]/page.jsx` · seven members · checked: `/products/agents`, `/products/memory` (also `/products/models`, `/products/record`) · gallery: `docs/gallery/products/` · metric id: `signup_start` (then `api_key_created`)

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): none. The kit (`components/v2/Fam*`, `fam.css`) is this family group's own.
Forks this page deleted: the per-product accent colours, the green live dot, syntax and method hues, the kicker over the h1, the coloured hover stripe, the invented "operations" and "Replay" labels, the word-lit 60-word paragraph, the Stage zoom that pushed the console under the fold, the console's endless replay, every hover nudge outside James's list, and the 96–200px type.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's own hero (`lib/cta.js` not merged yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices on these pages
- [x] Open copy questions for James listed, none decided

Done here: "Try Hanzo" (Hanzo's label and href from the captured hero) is the only solid in the hero and again at the close; the product's API link is outlined. The first screen is the product name (h1), its one line, the ask and the live console.

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
- [x] Ends in docs, the rest of the site and one ask before the footer
- [x] Card-to-page links use Morph (`data-morph` on each layer name, `data-morph-target` on the h1)

Done here: at 1470×801 the h1 (52px), line (20px), "Try Hanzo" and the whole console (fixed 480px pane) sit on the first screen; the request starts typing 250 ms after arrival. Hanzo's paragraph then reads one sentence per screen beside the operations it describes (FamChapters), then the API sheet, the Measured figures (memory), Hanzo OS and the close. JS off: 0 of 64 text blocks hidden (measured); the paragraph is in the HTML whole.

## 4. Conversion system
- [x] Kit buttons (`v2f-btn`) only; no raw `.x-btn`
- [x] Sticky ask after the hero, same label (the site ask bar reads `data-thumb`)
- [x] Copy button (kit `Copy`) copies exactly the request on screen
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-thumb="Try Hanzo"` and `data-cta="products.hero"` on the hero ask (magnetic, at most 22px), `data-cta="products.close"` at the close; the site ask bar names the page through `data-ask-name`.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] n/a: no marquee on these pages
- [x] n/a: no form on these pages

Done here: the operation counts are the row counts of Hanzo's own API table; the Measured figures on /products/memory are taken from Hanzo's own sentences ("from A to B" stands as B), each linking to its benchmark.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; sentences `pretty`, headings `balance`
- [x] The API table keeps Hanzo's columns; code in the console is Hanzo's own "Try it"
- [x] `python3 scripts/parity.py`: 0 missing

Done here: parity agents 60/60, memory 59/59, models 54/54. Sizes follow live hanzo.ai: h1 52, section heads 26, sentences 32, paths 21, body 16, figures 64; method tags and pane labels 13px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes from the kit tokens; objects outlined, never box plus shadow
- [x] One icon set (two inline strokes: arrow, replay); no icon in a rounded box
- [x] Differs from neighbours: a dark console beside the title (benchmarks lead with a chart card, careers with a white sheet)

Done here: ink, greys and white only; GET and POST differ by outline against fill. The console is a dark object, not a room; the page has 0 dark rooms. Sentence cards are outlined (1px black 10%) with no shadow.

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
- [ ] Sound only on the listed moments: n/a: the shared sound kit has not merged

Done here: time (the console types and answers once, then rests), state (point at an operation and its line slides in; replay), pointer (magnetic ask, counts that surface on hover), arrival (h1 cut-in), scroll (the sentence chapters and one figure that grows past 64px only while it crosses the middle, FamGrow).

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

Done here: on phones the name, line and both asks come first and the console starts under them; the request pane caps at 360px and scrolls inside. Sideways swipe turns to the previous or next product (site Phone layer; tested agents → company and agents → record).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: muted #525252 on white 7.8:1; console text #a1a1a6 on #0b0b0c about 7.9:1
- [x] Nothing moves for more than 5 s untouched (the console runs once; the hero contour is still)
- [x] n/a: no form
- [x] One h1; h2 per section; the replay control's name comes from `content/ui-strings.json`
- [x] Keyboard reaches every control

Done here: the console's answer pane is `aria-hidden` (the same operations are in the API table); the paragraph is read whole once (the on-screen sentences are its picture, `aria-hidden`).

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

Done here: the Hanzo OS list is the related rail (six siblings plus the current one); each name is the Morph source into its page's h1.

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

Done here: JS off and reduced motion both show the final state (measured: 0 hidden blocks).

## 18. Measurement and handover
- [x] `data-cta` on every primary (`products.hero`, `products.close`)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/products-family.md` verdict 8 or more: awaiting the critic's re-score after this round

Done here: round 5 answers the critic's list (label over the title, console under the fold, wall of text, hues, 12px labels) and MASTER's scale rules.
