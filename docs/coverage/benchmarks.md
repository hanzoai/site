# /benchmarks coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Benchmarks.jsx` · gallery: `docs/gallery/benchmarks/` · metric id: `cta_click` (`benchmarks.hero`, `benchmarks.close`)

Open copy questions for James: none. Section labels Hanzo shows as eyebrows ("Enso · intelligence per dollar", "Kai · decisions", "Leaderboard") now sit under their headings as captions, with the words unchanged.
Shared changes requested (`docs/requests/benchmarks.md`): none.
Forks this page deleted:
- the hand-built `<table>` helper and the evidence table (now the kit's `DataTable`);
- the hero and close `pf-btn` links (now the kit's `Cta`);
- the kit `Band` (replaced by a closing room that carries `data-cta`);
- the floating `AskBar`;
- the sticky compare tray (now in the flow);
- the floating scatter tooltips (now a record band under the chart);
- every spring;
- the v2 `DetailSheet` (its closed panels were laid out off-screen and shoved the page sideways): replaced by the page-local `components/pages/benchmarks/Sheet.jsx`, fixed to the viewport, hidden and inert when closed;
- the page's own copy row (now the kit's `CodeBlock`).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`. Note: `lib/cta.js` does not exist yet, so the label is Hanzo's own Band label, verbatim.
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. ~~Prices from `lib/plans.js`~~ n/a: the page shows no plan prices.
- [x] Open copy questions for James listed, none decided

Done here: One ask, "Start on Hanzo Cloud" → cloud.hanzo.ai. It is `Cta` in the hero (`benchmarks.hero`, thumb) and again in the closing room (`benchmarks.close`). "The results" and "Every benchmark" are text links with a chevron. The one h1 is "Intelligence, cost and speed, each measured." at 52px, over the frontier chart.

## 2. Information architecture and navigation
- [x] One `<main>`; the skip link reaches the layout's `#main` mark (the page adds no second `id="main"`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] ~~Breadcrumb at depth 2 or more~~ n/a: /benchmarks is depth 1.
- [x] Link parity: 0 removed, 0 unexpected

Done here: A sticky in-page product band sits under the header: Enso, Kai, Zen 6, Agent harness, Agent platform, Methods and Every benchmark. It has a scroll-spy pill and a "/" jump-to-benchmark search. Parity links: 134/134.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1. ~~`PageHero`~~ not merged in the kit yet, so the page uses its own Stage.
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in a closing room (Band equivalent) and the footer
- [x] Card-to-page links use Morph (site layer; every in-site link morphs)

Done here: In the first second the h1 cuts in line by line (0, 60, 120ms), then the lede, the meta line and the ask follow 380, 440 and 500ms after, so the screen reads left to right and never shows a finished right half beside a blank h1. The frontier draws its dashed line and points and reads the GLM 5.3 record at 900ms. On scroll the headline lifts away and the large chart settles beside its caption (Stage). The long lists show their head and fold the rest behind a (+) count (4 of the 16 duel tiles, with "16 of 16" itself as the opener; 5 of 11 board rows; 6 of 24 shelf rows; the "Every benchmark page" index), and on the phone side-by-side panels become swipe rails: about 25 screens at desktop (was 29) and 34 on the phone (was 47). With JS off, a `NoJs` rule lays the stage flat and shows every record, fold and filter.

## 4. Conversion system
- [x] `<Cta>` only for the asks; no raw `.x-btn`
- [x] Sticky ask in the header and the system's bar after the hero, same label (the page adds no floating bar of its own)
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `Cta thumb` drives the system bar with "Start on Hanzo Cloud". The methods command is the kit `CodeBlock` (whole line shown, wrapped; a 44px Copy beside it). "Copy link" returns early on a clipboard failure, so they never show "Copied" unless the copy worked.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [ ] ~~Privacy link and owner line beside every submit~~ n/a: no form submit.

Done here: Every figure sits with its source on the same screen or in its sheet: run links, re-run links, API endpoints, commit hashes and "Hanzo-measured; harness private" notes. Parity text: 860/860.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading (`text-wrap: balance`)
- [x] Tables use the kit's `DataTable`. ~~FAQ~~: no FAQ. Tabs are the page's own (Evidence and the race, `role=tab`). The command line is the kit `CodeBlock`.
- [x] `python3 scripts/parity.py /benchmarks`: 0 missing

Done here: Detail lives in (+) sheets, which stay in the server HTML: the 12 runs, every system, the Decision Suite, the evidence, trolley and qualification, coding, handlers, context lengths, the race numbers, the platform note, methodology and papers. Font sizes are snapped to the deck list (12–112). "Subquadratic Ultra-Long Context" keeps "Ultra-Long Context" on one line, so it never breaks on its hyphen.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; deck greys only
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes from tokens; tiles are flat `#f5f5f5` at 24px (`ProofRhythm`); never box plus shadow
- [x] One icon set (inline strokes); no icon in a rounded box; no colour emoji (the race lanes' ⚡ ⚙️ 🐌 are mono stroke marks, the words unchanged)
- [x] Differs from neighbours in hero medium (a data chart that settles) and room order

Done here: Scale rhythm comes from `ProofRhythm.css` with `pf-r`: h1 52/40, section headings 26, figures 64, and one 84px `pf-moment` per screen (3.02×, 2.0×, 477 bytes, ~3,665 tok/s, 72.40×). Two-part layouts split 8/5. There are two black rooms, Zen 6 and the close, never back to back, and each enters as a rounded card.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled and loading where it applies (the race button's disabled "Racing...", Cta busy on leaving)
- [x] Focus ring visible on every stop of a Tab crawl (2px ink, white in the black rooms)
- [x] Dialogs trap focus and return it (page-local `benchmarks/Sheet.jsx`: closed sheets are `visibility:hidden` and `inert`; the open one is `position:fixed` in the viewport; Esc, the scrim and × close it and focus returns to its (+) with `preventScroll`; opening never changes scrollX or scrollY, measured at both sizes)
- [x] Inputs 16px or larger; no bare `:hover` (all 47 hover rules sit under `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Seg pills, tool buttons, tick boxes, checkboxes, the dial's range and the search field are all styled. Presses are .98 or a 1px drop, and hovers move something (the figure slides, tiles lift, rows fill, underlines open).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound only on the listed moments, through the one kit~~ n/a: no sound moment on this page.

Done here: The signature is Stage. Supporting: line-mask headlines, the board's rows gliding into a new order (layout, 300ms ease-emphasis) and the pinned chapters. Movement kinds: idle (points read themselves), state (sheets, pills, board), pointer and scroll. Timings are deck only (90, 150, 300, 400, 500ms, line art 1.2s) with no springs.

## 10. Media
- [ ] ~~`Film` and `Pic` only; sizes and posters set~~ n/a: Hanzo has no image or film for /benchmarks.
- [ ] ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- [ ] ~~Budgets met; nothing missing; alt on every image~~ n/a: no image.
- [ ] ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: no photos.

Done here: The hero objects are product-style data UI drawn from Hanzo's own figures. They are the frontier chart, the 16 duel tiles, the board, the context dial, the race arena and the 477-byte square drawn to scale.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: No overflow at either size (`errs.js`: overflow 0). Layout shift measured with a full scroll: desktop 0.002; phone 0.057, all of it from the shared footer (0.026 + 0.031), none from this page. The context dial's number crosses inside a fixed 64px box, so it no longer shifts. The sub-nav rail is opaque (#fff, #000 in Zen 6) with a hairline, so nothing shows through it. On the phone the stage lies flat, pinned scenes stack and paired panels swipe. The ask sits at about 500px from the top at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured: body #525252 on white is 7.8:1, captions #737373 4.7:1, white 55% on black about 6:1
- [x] Pause control on every moving item. The frontier's self-reading stops for good once you point at, focus or tap any point. The live dot pulses three times, then rests.
- [ ] ~~Forms labelled; first error focused~~ n/a: no form. The search fields have aria-labels.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (focus inside a pinned chapter scrolls the scene to it)

Done here: Tabs use `role=tab` and `aria-selected`, toggles use `aria-pressed`, and sheets use `aria-expanded`. The board summary is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; no image or video
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (cloud only)

Done here: 0 console errors at both sizes (`errs.js`), 0 hydration diffs (`hyd.js`). The dial's fill variable sits on its wrapper and the page's inputs carry `suppressHydrationWarning`, because a screenshot taken before hydration writes an inline caret style on every input. Motion is transform, opacity and clip-path only. Scroll-linked opacity uses function transforms, because Motion's ScrollTimeline acceleration misread the sticky runway. Idle loops stop off screen (`useInView`).

## 14. SEO and machine files
- [x] Title and description match live (`app/benchmarks/page.jsx` equals `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (site layout)
- [x] `<JsonLd route="/benchmarks">` unchanged
- [x] Every card is a real link

Done here: All text is in the server HTML, including every sheet, chapter and visual state.

## 15. Catalogue and product pages
- [ ] ~~Model card matches `SPEC.md`~~ n/a: no model cards on this page.
- [ ] ~~Every card opens by Morph~~ n/a beyond the site layer: the shelf rows and spec rows are links that morph.
- [x] Every benchmark page linked in the DOM (the index of every benchmark page)
- [ ] ~~One price figure everywhere~~ n/a: the only price is Kai against Jev, shown the same in figures, chapter and sheet.

Done here: The shelf (24 of 166 runs) is searchable and filterable. It has saved views and reorder, a compare panel in the flow, and CSV/JSON export.

## 16. Developer experience
- [x] The command line is shown whole in the kit `CodeBlock` and copied exactly (the `$ ` prompt is not copied).
- [ ] ~~Config blocks parse on their own~~ n/a: no config.
- [ ] ~~Terminal pauses and ends on a static frame~~ n/a: no terminal. The race ends on its final lanes.
- [x] No hand-typed version number beyond Hanzo's own run ids

Done here: Research API endpoints and harness commits are links, and every board has CSV, JSON and copy-link.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed where data is interactive (shelf empty state: "No run on this page matches", "Show all 166", Clear)
- [x] Blocked live data leaves a complete page: the figures are static as Hanzo publishes them, and there are no console errors
- [ ] ~~A failed submit keeps its values~~ n/a: no submit.
- [x] A thrown island does not blank the page (each section is self-contained; no data fetch)

Done here: "All 11" resets Your suites. The board view is kept in the address. The race shows a running state.

## 18. Measurement and handover
- [x] `data-cta` on every primary. Events are sent by the kit's `Cta` (`hz-event`, `cta_click`).
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/benchmarks.md` (5/10); every listed fix addressed in round 2

Done here: Round 2 proofs: `desktop-r2.jpg` and `phone-r2.jpg` (first screens). Earlier: `desktop.mp4`, `desktop.jpg` and `phone-1..3.jpg`.
