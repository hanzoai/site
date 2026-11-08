# /benchmarks/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/bench/BenchRun.jsx` (+ `bench.css`, data `benchData.js`, route `app/benchmarks/[slug]/page.jsx`, 27 members) · gallery: `docs/gallery/benchmarks-family/` · metric id: `signup_start` (and GitHub or weights click)

Open copy questions for James: none decided here. Functional strings used (all `needs_james` in `content/ui-strings.json`): table, chart, pause, replay, read_run, loading, failed, log, previous, next, close, more, chapter, of.
Shared changes requested (not fixed here, shared code): the pinned chapters crossfade (`components/v2/FamChapters`), so two chapters' text overlap mid-scroll; the phone header's solid "Try Hanzo" beside the hero's solid ask (header); the cookie card over the first screen on phones (consent); the related rail's three equal cards (`components/v2/FamNext`).
Forks this page deleted: its own button (`v2f-btn` on the asks → kit `Cta`), its own table wrapper (`xbr-tw` → kit `DataTable`), its own command block (`xbr-cmd` → kit `CodeBlock`), its own sticky bar (`AskBar` → the site's ask bar).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (n/a `lib/cta.js`: not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button (n/a prices: none on these pages)
- [x] Open copy questions for James listed, none decided

Done here: Persona (researcher, developer weighing the router and engines), Goal, CTA and metric in the file header. The one solid is the page's own "Start on Hanzo Cloud" (paper pages, from their close) or the header's "Try Hanzo" (result pages), via `Cta id="benchmarks.hero" thumb`.

## 2. Information architecture and navigation
- [x] One `<main>` (the layout's skip link reaches it); no second main
- [x] Every link through `A` or `Cta`; every sibling card a real link
- [x] Breadcrumb at depth 2: Hanzo's own crumb ("Benchmarks / GPQA-Diamond") under the title
- [x] Link parity: 0 removed, 0 unexpected (gpqa 41/41, fleet 27/27, kai-ag-news 17/17, locomo 29/29, zen-6 6/6)

Done here: the crumb moved from above the title to a caption under it; previous/next and the board close the page; result pages get their neighbours among the results plus the board.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (title cuts in; the card turns to its chart and the readout rolls)
- [x] Nothing above the h1 (n/a `PageHero`: the kit has none on main; the stage is built from kit parts)
- [x] JS off: legible (chapters stack, sheets show inline); no `opacity:0` on the h1 (7 Nov: fleet, gpqa, locomo h1 whole at 375 and 1470)
- [x] One idea per 100svh; sections alternate (stage, figures, pinned chapters, spec rows, dark source, tail, dark band)
- [x] Ends in sibling cards, a closing band (paper pages), footer
- [x] Sibling titles carry `data-morph` into the next page's h1 (`data-morph-target`)

Done here: at 1470×801 the title (52px), lede, ask and the chart card with its 84px readout are on the first screen; at 375×812 the title, lede, ask, crumb and the card's figure.

## 4. Conversion system
- [x] Kit `Cta` only for the asks; no raw `.x-btn` in the template
- [x] Sticky ask: the site bar carries the hero's `data-thumb` after the hero (`components/Ask.jsx`)
- [x] Copy copies exactly the displayed text (kit `CodeBlock`; "$ " drawn, not copied)
- [x] `data-cta` on every primary (`benchmarks.hero`, `benchmarks.band`, `benchmarks.band-2`) and `data-thumb` on the hero ask

Done here: one solid per viewport; the dark band's solid is light on black; the source room's button is an icon, not a second label.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure is a cell of Hanzo's own table (`benchData.js` parses the capture; the chart re-draws those cells)
- [x] n/a marquees: none
- [x] n/a submit: no form

Done here: the source room reads the cited research run live from api.hanzo.ai and lays its raw record beside the transcribed figures; the "02 / 13" row counter (not Hanzo's number) was removed.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (figure labels 13px mono caps)
- [x] Measures held (body 16px at 68ch); headings balance
- [x] Tables use `DataTable`, code uses `CodeBlock` (n/a FAQ, tabs)
- [x] `python3 scripts/parity.py /benchmarks/gpqa /benchmarks/kai-ag-news /benchmarks/fleet`: 0 missing

Done here: long sections show their first paragraph; the rest is in a sheet whose trigger previews it in Hanzo's own first words. Tables never wrap a cell: at 375 the System column is pinned and the rest scrolls with a right-edge fade; on desktop the sheet is 860px wide so the widest table (fleet, 749px) shows every column.

## 7. Visual design system
- [x] `python3 scripts/taste.py components/pages/bench/BenchRun.jsx components/pages/bench/bench.css`: OK
- [x] No label, tag, badge or pill above a headline
- [x] Objects outlined, tiles flat, no box plus shadow; radii 24/20; sizes on the live scale (h1 52, heads 26, figures 64, readout 84 as the screen's one big thing)
- [x] One icon set (inline 1.5–1.8px strokes for view switch, pause, play, JSON); no icon in a rounded box
- [x] Differs from neighbours: the hero object is the benchmark's own chart card (integrations: an editor; oss: a ledger)

Done here: two dark rooms (graphite source, black close), never back to back; each enters as a rounded card inside the gutters and opens to full width as it is reached (`FamRoom`).

## 8. UI component library
- [x] Controls have hover (inside `@media (hover:hover)`), press (scale .97), focus-visible, disabled (source button while loading)
- [x] Focus ring visible (site ring) on the view switch, columns, pause, sheet triggers, sibling cards
- [x] Sheets trap focus and return it; Escape closes
- [x] n/a inputs: none
- [x] Forks deleted: listed above

Done here: `FamDrawer` sheet (dialog, `aria-modal`, inert when closed, focus returns to its trigger). A chapter with no table of its own gets a real object (the card's runs as nested squares, Hanzo's row in ink) where no other chapter draws them, instead of a contour field.

## 9. Motion and interaction
- [x] One signature (table turns into chart), supporting: stage settle, title cut-in, sigil field; 0 fade-ups
- [x] Kinds: idle (playhead walk, readout roll), state (re-flow, switch, sheets), pointer (row hover picks its figure, magnetic ask, rail drags with inertia), time (source types its reply), scroll (settle, chapters, the latest figure grows while it is the moment); scroll is under half
- [x] Something moves without input; every control answers
- [x] Reduced motion: chart shown turned, no playhead, no typing, no stage transform; the playhead is one `setInterval` that stops after one pass (it rests on Hanzo's first row)
- [x] n/a sound

Done here: `variety.py` OK; the walk plays once and has a 44px pause/replay control.

## 10. Media
- [x] n/a `Film`/`Pic`: Hanzo has no imagery for benchmarks
- [x] n/a videos
- [x] Nothing missing
- [x] n/a photos: the visuals are the benchmark's own chart and each member's contour (Sigil seeded `bench/<slug>` with its figures)

Done here: ≤4 canvases (hero Sigil and at most 3 sibling contours drawn once).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (screenshots `docs/gallery/benchmarks-family/`)
- [x] No horizontal scroll at 375 (tables scroll inside their own region)
- [x] Targets 44px or more (switch, pause, chips, sheet triggers); hover details have tap paths (tap a row)
- [x] Primary ask above the fold at 375×667 (full-width, under the lede)

Done here: 7 Nov walk (gpqa, fleet, kai-ag-news): 0 console errors, 0 px horizontal overflow, CLS ≤0.022 phone and ≤0.009 desktop; earlier, phone layout shift 0.000 on fleet and 0.013 on gpqa (it was 0.38 before the readout got fixed boxes); the sideways swipe turns to the next benchmark (gpqa → inference).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text contrast at 4.5:1 or better (ink #0a0a0a, muted #525252 on white)
- [x] Pause control on the moving playhead
- [x] n/a forms
- [x] One h1; sections h2; sheets h2; names start with visible text (icon controls named from the register)
- [x] Keyboard reaches every control (switch, chips, pause, rows, sheets, cards)

Done here: the readout is `aria-hidden` (the table holds the same figures); the live read announces via `aria-live`.

## 13. Performance and engineering
- [x] h1 and the chart card in server HTML
- [x] Transform and opacity only (clip-path for rooms and wipes); no image or video to size
- [x] No poller; the only request is the user-triggered source read
- [x] Nothing heavy run on James's laptop (all checks in the cloud)

Done here: one interval for the playhead, paused in hidden tabs, stopped after one pass.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical: route unchanged (shared layout)
- [x] `<JsonLd route>` per member
- [x] Every sibling card is a real `<a href>`

Done here: every word, table and link is in the server HTML, sheets included.

## 15. Catalogue and product pages
- [x] n/a model card: no model card on these pages
- [x] Sibling cards hand their title to the next h1 (`data-morph`)
- [x] Every benchmark linked: Hanzo's own "Other benchmarks" list stays in the tail
- [x] n/a price

Done here: at most 6 siblings, each with its own contour and, on hover, its own lede.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] n/a config blocks
- [x] The source reply types once and ends on its static record
- [x] No hand-typed version number

Done here: the reproduce command and the API query are `CodeBlock`s; the source can be opened as raw JSON.

## 17. States and resilience
- [x] No hydration error on a single load of gpqa, fleet or kai-ag-news at either width (the red badge was seen only under parallel load, `_shared.md` 3)
- [x] Loading (skeleton, `aria-busy`), empty (`{ "data": [] }`), error (the HTTP status) states for the live read
- [x] Blocked live data leaves a complete page (the read is opt-in)
- [x] n/a submit
- [x] A failed read shows its status, never a blank panel

Done here: nothing else on the page depends on the network.

## 18. Measurement and handover
- [x] `data-cta` on every primary (n/a `lib/track.js`: not on main; the kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing; no field values
- [x] `V2:` line in the file's top comment
- [ ] Review read: `docs/review/benchmarks-family.md` verdict 8 or more (waiting on the critic's walk of this version)

Done here: every review complaint so far is addressed (layout shift, looping card, invented counter, first-screen figure).
