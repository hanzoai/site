# /compare/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/compare/Ledger.jsx` (+ `Ledger.css`, `compareData.js`, `app/compare/[slug]/page.jsx`) · gallery: `docs/gallery/compare/` · metric id: `api_key_created`. Member checked: `/compare/model-routing` (the family's only member).

Open copy questions for James: none decided. "Models reachable" is Hanzo's own row label from hanzo.ai/compare; the switch label "Where they do differ" is the lede's own words.
Shared changes requested (`docs/requests/<page>.md`): none filed. Noted: `components/pages/Compare.css` (the /compare index, another chat) had a CSS parse error that 500s that route in dev; the shared desktop ask bar floats over content.
Forks this page deleted: the hand-made role="table" ledger (now kit `DataTable`), the hand-made segmented control (now kit `Tabs` / `TabPanel`), the hand-made buttons (now kit `Cta`), the hand-written h1 mask (now `Lines`), `Magnetic` and every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport ("Hanzo Enso", the page's own first door)
- [x] One h1; the question is the page
- [x] No dead button; n/a prices
- [x] Copy questions listed above

Done here: 1 solid in the first view at both test sizes; the ask repeats only at "Go deeper".

## 2. Information architecture and navigation
- [x] One `<main>`; skip link from the shared shell
- [x] Links through `A` / `Cta`; vendor rows are real links with their host shown
- [x] n/a breadcrumb: the live page has none
- [x] Link parity: 6/6

Done here: the page moved from the catch-all port to its own family route `app/compare/[slug]`.

## 3. First impression and page narrative
- [x] Sells in 5 s; the race counts within 1 s, its stamp lands, then it reads each router once (≈10 s alive) and rests
- [x] `Lines` cut-in; nothing above the h1 (the label sits under it)
- [x] JS off legible: a `<noscript>` rule draws the bars at their real lengths; the shared rule clears entrance states
- [x] One idea per screen: race → ledger → honest room → doors out
- [x] Ends on the doors out, then the footer (no `Band`: the live page has none)
- [x] n/a Morph cards

Done here: phone first screen: h1 (40px), label, lede, the compact race, then "Hanzo Enso" ending at y=640 (inside 667).

## 4. Conversion system
- [x] `<Cta>` only
- [x] Sticky ask: the shared bar carries "Hanzo Enso" (data-thumb); the close's ask row has `data-ask-hide`
- [x] n/a copy buttons
- [x] `data-cta="compare-model-routing.hero|close"`, `data-thumb` on the hero primary

Done here: the bar never lands on the close's own "Hanzo Enso".

## 5. Trust and proof
- [x] No logo, no seal; figures are the vendors' own published counts, stamped "they published this"
- [x] The measured row is stamped "we ran this" and links to its run with the date
- [x] n/a marquees
- [x] n/a submit

Done here: provenance stamps are 13px mono chips; the reported rows come word for word from hanzo.ai/compare.

## 6. Content presentation (copy untouched)
- [x] 13px floor (12px only for mono capitals in table heads and labels)
- [x] Headings balanced; lede 40ch; body 64–68ch
- [x] Kit `DataTable` (caption, scope, sticky header and first column, tinted subject column) inside kit `Tabs`
- [x] `parity.py`: 29/29 text, 6/6 links

Done here: table cells 16px with ink verdict words; row headers 17px/606; rows over 48px.

## 7. Visual design system
- [x] `taste.py` passes; deck values held in page-local custom properties
- [x] Nothing above a headline
- [x] Radii 24 (ledger), 6 (stamps), full (buttons, switch); no shadows
- [x] n/a icons beyond the kit chevron; verdict marks are drawn shapes (filled, hollow, dashed, half)
- [x] Differs from neighbours: a race and a ledger, not cards

Done here: one black room ("Reading this honestly") opening from a rounded card.

## 8. UI component library
- [x] Tabs (kit), switch (hover fill, press .97, disabled while on Measured), vendor rows (underline, host to ink, 1px press)
- [x] Focus ring from the shared system
- [x] n/a dialogs
- [x] n/a inputs
- [x] Forks deleted: listed above

Done here: the switch knob moves with ease-emphasis in 300 ms (no spring).

## 9. Motion and interaction
- [x] Signature: the reported rows file in (60 ms stagger, 400 ms) when their tab opens; supporting: count-up race, clip opening; `variety.py` OK (2 counted)
- [x] Kinds: arrival (cut-in, race), idle (one reading pass), state (tabs, rows filing in, switch), pointer (hover a race row to read it), scroll (room opening): scroll under half
- [x] Moves untouched within 1 s
- [x] Reduced motion: rows and race at their final state; no `setInterval`
- [x] n/a sound

Done here: no springs (kit tab pill aside, which is the shared Tabs). 8 Nov: the hero race keeps reading while in view (each router lit in turn with a blinking read cursor, then every figure in ink, then again; a hover holds one), and the "we ran this" stamp's dot breathes, so no screen is still at either width.

## 10. Media
- [x] n/a: the live page has no images or video; the race and the ledger are the objects

Done here: n/a: no media on the live page.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801: no overlap (walked)
- [x] No horizontal page scroll at 375; the table pin-scrolls inside its region (keyboard reachable)
- [x] Targets 44px (tabs on coarse pointers, switch, vendor rows 72px)
- [x] Primary above the fold at 375×667: "Hanzo Enso" spans y 596–640, with the race still above it

Done here: under 900px the race is a 2 × 2 grid of 32px figures over 2px bars with 13px names, between the lede and the ask; measured at 375×667, 375×812 and 1470×801 with no overlap and no sideways scroll.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a / #525252 / #737373 on white and #f5f5f5 (muted text on #f5f5f5 uses #525252)
- [x] n/a pause control: the race reads once and rests
- [x] n/a forms
- [x] One h1, h2 per section; the table has caption and scopes
- [x] Keyboard: Tabs with arrow keys, `role="switch"` with `aria-checked`, count in `aria-live`

Done here: axe not run.

## 13. Performance and engineering
- [x] h1 in server HTML; data read on the server
- [x] Only transform, opacity and clip-path animate
- [x] No poller
- [x] Nothing heavy on James's laptop

Done here: budgets not measured (no build run here).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from the shared helper
- [x] `<JsonLd route>`
- [x] Vendor rows are real links

Done here: static params over `/compare/<slug>` members; `dynamicParams = false`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a: proof page.

## 16. Developer experience
- [x] n/a: no code on the page

Done here: n/a: no code.

## 17. States and resilience
- [x] With no reported rows the switch hides; folded rows are listed by name
- [x] No live data
- [x] n/a forms
- [x] JS off and reduced motion legible

Done here: both tab panels are in the server HTML (`hidden` until chosen).

## 18. Measurement and handover
- [x] `data-cta` on both asks (kit `Cta` sends `cta_click`)
- [x] Nothing before consent
- [x] `V2:` line in the page file
- [x] Review read: `docs/review/compare-family.md` (7/10 at `8c3aede`; its three fixes are in `02de55b`)

Done here: film presses both controls; phone stills in `docs/gallery/compare/`.
