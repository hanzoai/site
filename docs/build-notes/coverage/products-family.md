# /products/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ProductPage.jsx` (+ `ProductPage.css`, data `components/pages/productsData.js`, route `app/products/[slug]/page.jsx`) · gallery: `docs/gallery/products-family/` · metric id: `signup_start` (`data-cta` products.hero, products.close)

Members: /products/company, agents, models, memory, identity, machines, record (one template, seven captured pages).

Open copy questions for James: none.
Shared changes requested: no Breadcrumb in the shared kit used here; `Cta` swap for `.v2f-btn` once `lib/cta.js` lands; a `Film`/`Pic` of Hanzo's product UI if Hanzo publishes one for these layers.
Forks this page deleted: the pinned Stage and scroll-scrubbed sentence strip, the phone swipe rail, the dark console card, the separate spec sheet, the repeated operation lists, the thin count, the empty no-figure card, the link-list ending.

Tick what applies. Strike the rest as `n/a: reason`.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport (hero "Try Hanzo"; the band's white ask is the only fill in the dark room)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; no prices
- [x] Open copy questions for James listed, none decided

Done here: Head of `ProductPage.jsx` carries Persona, Goal, CTA, Metric, Signature, Beyond. The h1 is the product name at 72px desktop / 40px phone with Hanzo's one line and ask beside it; the ask is Hanzo's own "Try Hanzo".

## 2. Information architecture and navigation
- [x] One `<main>`; skip link reaches it
- [x] Every link through `A` or `More`; every OS row and measured card is a real link
- ~~Breadcrumb at depth 2 or more~~ not done: the Hanzo OS list (current layer marked `aria-current`) is the wayfinding; no kit breadcrumb
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity on :4182, agents 60/60 text 21/21 links, memory 59/59 and 19/19, company 59/59 and 20/20. The seven layers are a `<nav>` list; the current one is marked and the others open their page.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1 (no kicker)
- [x] JS off: legible (`NoJs` unstacks the console); h1 in server HTML
- [x] One idea per screen: hero+console, Measured, Hanzo OS, links, band
- [x] Ends in links, `Band` (dark room with the one ask), footer
- [x] Card-to-page: OS row name flies into the next h1 (`data-morph` to `data-morph-target`)

Done here: The request types within ~150 ms of view and the API rows land while it types. Clicking an OS row on /products/memory went to /products/identity with no scroll jump on the old page (scrollY stayed 2116 until the route changed) and "Identity" flew into the h1.

## 4. Conversion system
- [ ] `<Cta>` only: still `A` with `.v2f-btn` (Cta swap waits on `lib/cta.js`)
- [x] Sticky ask in header, same label
- [x] Copy button copies exactly the displayed request (shared `Copy`, text = the typed tokens joined)
- [x] `data-cta` and `data-thumb` on the hero primary; `data-cta` on the close

Done here: products.hero and products.close carry `data-cta`; the hero ask has `data-thumb`. The header carries "Try Hanzo" at both widths.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy; the sentence stays whole beside it
- ~~Marquees~~ n/a: none
- ~~Privacy beside submit~~ n/a: no form

Done here: Measured figures (memory: 37.5, 90.6%, 67) are parsed from Hanzo's own link text by `figOf`; the OS op counts are counted from each captured page's API table.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except mono capitals (12px labels)
- [x] Measures held (lede 34ch, sentences 26ch, OS desc 44ch)
- [x] API table is an accessible role=table, not a raw `<table>`; code scrolls in its own pane, never breaks mid-URL
- [x] `parity.py`: 0 missing

Done here: Each operation is listed once (the console's table); the paragraph's sentences are console steps that light the operations they name, so nothing repeats.

## 7. Visual design system
- [x] `taste.py` passes on both files
- [x] No label, tag, badge or pill above a headline
- [x] Radii from tokens (`--r-hero`, `--r-card`)
- [x] One icon set (two inline strokes: pause, replay)
- [x] Differs from neighbours: name over a wide light console, not a title-left/black-card-right split

Done here: Ink, greys and white only; reads vs writes told apart by outline vs fill. Each member is told apart by its own Sigil contour (seeded with the slug), request and operations.

## 8. UI component library
- [x] Every control has hover, press, focus-visible (steps, replay, copy, rows, cards, chips)
- [x] Focus ring visible on steps and the code pane
- ~~Dialogs~~ n/a: none
- [x] No bare `:hover` (all behind `@media (hover: hover)`)
- [x] Forks deleted: listed above

Done here: Steps are a role=tablist with arrow keys and a layoutId pill; press is scale(.97) everywhere, never an opacity fade.

## 9. Motion and interaction
- [x] One signature (the morph-panel console) plus entrances deal, rule, iris
- [x] Kinds: time (typing, rows landing, the one-pass walk), state (steps morph the pane, light slides), pointer (magnetic ask, row fill, OS op count on hover), arrival (h1 settles, entrances), scroll (first figure grows)
- [x] Moves without input; every control answers
- [x] Reduced motion: final state, no rAF typing, no entrances; no `setInterval`
- [x] Sound: faint 'done' when the self-run walk finishes, through `lib/sound`

Done here: New this pass, matching the Ready pages' authored entrances: Measured cards rise out of a clip one by one (deal), the OS list and link hairlines draw left to right with rows arriving behind (rule), the closing band opens from a rounded inset (iris). Transforms and clip-path only; CLS stayed ≤0.0015.

## 10. Media
- ~~Film and Pic~~ not done: Hanzo's product pages have no images or films to use
- ~~Videos~~ n/a
- ~~Budgets~~ n/a
- [ ] 4+ real visuals: n/a for these pages; the console and Sigil are the objects

Done here: The live console (Hanzo's own request and API table) is the product object; the Sigil is drawn from each page's own numbers. No media exists on Hanzo's captured pages.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll (scrollWidth − innerWidth = 0 on three members)
- [x] Targets 44px (steps 40px tall in a 44px bar, replay/copy 44, doc links and chips 44)
- [x] Primary ask above the fold at 375

Done here: The phone request pane is a fixed 240px and the table scrolls in its own box, so the answer landing moves nothing; after typing the pane now returns to the request's first line instead of resting mid-request.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text contrast: ink on white, greys #525252/#737373 on white or #fafafa
- [x] Pause control on the self-running console
- ~~Forms~~ n/a
- [x] One h1; h2s for panes and sections
- [x] Keyboard reaches steps (arrows), panes, rows, cards

Done here: The full paragraph is in an `x-sr` paragraph for screen readers; the sentence panes are aria-hidden so it is read once.

## 13. Performance and engineering
- [x] h1 and LCP in server HTML (checked with curl)
- [x] No images; one rAF loop only while typing
- [x] No poller; prefetch of the other six layers after 1.5 s
- [x] Nothing heavy run on James's laptop

Done here: Static export via `generateStaticParams` over the seven slugs; data read once per server process.

## 14. SEO and machine files
- [x] Title and description from the captured page (`metaOf`)
- [x] Canonical is `https://hanzo.ai/products/<slug>/`
- [x] `<JsonLd route>` on every member
- [x] Every card is a real link

Done here: Checked on /products/agents: canonical `https://hanzo.ai/products/agents/`.

## 15. Catalogue and product pages
- ~~Model card SPEC~~ n/a: not a model page
- [x] Every OS row opens by Morph
- [x] Every layer page linked in the DOM (seven rows)
- ~~Price~~ n/a

Done here: Product anatomy: identity (name, line, ask), console, measured figures where Hanzo has them, the seven layers, docs, band.

## 16. Developer experience
- [x] One console; copy equals the displayed request
- [x] Requests are Hanzo's own curl, verbatim
- [x] Console pauses (Pause) and ends on a static frame ("Try it" with the full request)
- [x] No hand-typed version number

Done here: Replay re-types; picking a step holds the walk; arrow keys move steps.

## 17. States and resilience
- [x] Empty state: a measured result without a figure is a text row, not an empty card
- [x] No live data; no console errors on three members at both widths
- ~~Submit~~ n/a
- [x] JS off: everything legible; the typed text is in the server HTML

Done here: Playwright walk of company, agents, memory at 1470×801 and 375×812: 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/build-notes/review/products-family.md` is 5/10 on an older build (v4); fixes 1–6 checked against this build, re-walk pending

Done here: Review fixes: 1 operations once (done), 2 h1 72px and section heads 44px (done), 3 phone pane height, code scroll, 44px links (done), 4 band (done), 5 no-figure row (done), 6 row-to-page open with no jump (done, verified by walk).
