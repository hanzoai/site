# /treasury coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Treasury.jsx` (+ `Treasury.css`) · gallery: `docs/gallery/treasury/` · metric id: `api_key_created` (docs hand-off)

Open copy questions for James: the wallet's four controls are icons with aria-labels ("Take at checkout", "Delivered: pay the seller", "Release the hold", "Reset"); visible labels would need `content/ui-strings.json`.
Shared changes requested (`docs/requests/treasury.md`): none. Noted for shared owners: no skip link in shared chrome; `useEvery` uses `setInterval`; `tokens.css` not merged (page CSS uses deck values as literals).
Forks this page deleted: the separate Hold section (its h2 and lede were cut and spliced from Hanzo's sentences), the static `.ts-say` statement screen (now the chapters' lead), the solid "Take at checkout" button, the floating hero pause, the gold comment and duplicate `.ts-ed`/`.ts-flow`/`pre` rules, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Read the docs" → docs.hanzo.ai/docs/cli/treasury
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions for James listed, none decided

Done here: gate: 1 h1, max 1 solid per desktop viewport ("Read the docs" at y 0). Wallet buttons are outlined icons; the close's ask carries `data-thumb` so the bar steps aside.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared chrome)
- [x] Every link through `A`
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 3/3 (docs, GitHub, platform deploy).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] h1 line-mask cut-in (CSS, painted by the server), one lede, one primary, one object; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; heights vary (dark hero, pinned chapters, short close)
- [x] Ends on the close's heading beside the finished split (a small graphite card whose bar draws in its three parts; hover or focus a row to light its part), one ask and the Get card, then the footer
- [x] n/a Morph

Done here: the server paints the split finished and balanced; it holds, then re-writes from the source line so a destination is named within 0.8 s (no empty box). Gate: JS-off hidden 0.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`; no raw `.x-btn`
- [x] Sticky ask: header, bar after the hero, same label "Read the docs"
- [x] n/a copy button
- [x] `data-cta` and `data-thumb` on every primary

Done here: `treasury.hero` and `treasury.close`, both `data-thumb="Read the docs"`. Primary appears twice.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure is the split's own (10,000 = 9,000 + 500 + 500 from Hanzo's split.num)
- [x] n/a marquees
- [x] n/a submit

Done here: figures come only from the 90% / 5% / remaining split of USD/2 10000; posting lines use only Hanzo's account names.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone); mono capitals 12px only
- [x] Measures held; headings balanced
- [x] n/a tables (chapter rows are drawings, aria-hidden); n/a FAQ/tabs
- [x] `python3 scripts/parity.py /treasury`: 0 missing

Done here: parity `text 57/57 links 3/3`; gate small375 []. Editor comments raised to #a3a3a3 on #0f0f0f (≥7:1).

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline (the lede now leads the chapters as a 32px statement)
- [x] Tiles flat; only the chapter cards float
- [x] One inline icon set (1.5px strokes)
- [x] Differs from neighbours: a dark room with an editor and money streams, not a window or a dial

Done here: gate hues []; deck values (#0a0a0a, #171717, #262626, #a3a3a3, #f2f2f2, #ededed). One chapter grid so the destination column holds still.

## 8. UI component library
- [x] Hover inside `@media (hover:hover)`, press .97, focus-visible, disabled
- [x] Focus ring on every stop
- [x] n/a dialogs
- [x] No bare `:hover`; chips 44px with hover and press
- [x] Forks deleted: listed above

Done here: wallet buttons invert on hover, the `hanzoai` chip 44px inverts on hover, the pause inverts.

## 9. Motion and interaction
- [x] Signature (the split writes itself), 3 supporting (Settle, PinChapters, magnetic), 0 fade-ups
- [x] Idle (split, flow events), time (typing), state (wallet), pointer (magnetic), scroll (pin)
- [x] Something moves without input; every control answers
- [x] Reduced motion: the split rests finished, the coin and log rest; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK (magnetic, pathLength). Chapters 01–03 read their rows in turn while in view (one lit every 1.3 s, background only, stops off screen, under pause and reduced motion). Hero stage settles from 1.015 so its edges stay inside the gutters at 1470. The coin travels by transform only (500ms in-out); nothing below the wallet moves (log height fixed to 4 rows). Idle while held: a ring leaves @users:001 every 2.4 s (transform and opacity, stops under pause, off screen and reduced motion), and the row being read draws a 1px hairline under it over 1.3 s; motion.mjs at 1470 reports 0 still screens. The chapters' lead statement cuts in by line mask (LineMask, 3 lines, same words). The hero's balanced line stays in the layout and only fades, so the re-writing split never pushes the page: CLS measured 0.0004 at 1470x801 and 0.0000 at 375x812 over a full scroll.

## 10. Media
- [x] n/a: no Hanzo media on the live page; objects are drawn UI
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a, the page has no images or films.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px or more
- [x] Primary above the fold at 375×667

Done here: on phone the streams stack as rows (no SVG), the balanced line sits under them (not over an account), the wallet stacks vertically with the coin sliding down the rows, and the pause lives in the editor bar.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured (comments #a3a3a3 on #0f0f0f, body #525252 on white)
- [x] Pause control on every moving item (editor bar, chapter visual)
- [x] n/a forms
- [x] One h1, h2/h3 order
- [x] Keyboard reaches every control; hidden chapter visuals are `inert`

Done here: wallet log is `aria-live` only after the visitor drives it.

## 13. Performance and engineering
- [x] h1 and code in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island; the h1 cut-in is CSS.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/treasury" />`
- [x] n/a cards

Done here: `app/treasury/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 16. Developer experience
- [x] The split is Hanzo's own Numscript, displayed as written
- [x] n/a config blocks
- [x] The split pauses and rests finished
- [x] No hand-typed version

Done here: n/a copy button; the code is a display of Hanzo's example.

## 17. States and resilience
- [x] n/a live data
- [x] Blocked network leaves a complete page, no console errors
- [x] n/a submit
- [x] Reset returns the wallet to its start

Done here: Playwright walk at 1470x801 and 375x812 (7 Nov): 0 console errors, no horizontal scroll; the hero stage ends at y 684 inside 801.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `components/pages/apps/Treasury.jsx`
- [ ] Review read: verdict 8 or more (re-review pending after this rework)

Done here: previous review 6/10; its fixes addressed (no un-write on load, phone stacking, wallet fixed height, outlined wallet controls, chapter 04 is the wallet, live chapter rows, the split carried into the close, inset hero stage).
