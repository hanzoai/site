# /treasury coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Treasury.jsx` (+ `Treasury.css`) · gallery: `docs/gallery/treasury/` · metric id: `api_key_created` (docs hand-off)

Open copy questions for James: the wallet's four controls are icons with aria-labels ("Take at checkout", "Delivered: pay the seller", "Release the hold", "Reset"); visible labels would need `content/ui-strings.json`.
Shared changes requested (`docs/build-notes/requests/treasury.md`): the phone header ask and ask bar; `Settle` and `PinChapters` reading reduced motion during render; PinChapters' phone pin over text. Noted for shared owners: no skip link in shared chrome; `useEvery` uses `setInterval`; `tokens.css` not merged (page CSS uses deck values as literals).
Forks this page deleted: the separate Hold section (its h2 and lede were cut and spliced from Hanzo's sentences), the static `.ts-say` statement screen (now the chapters' lead), the solid "Take at checkout" button, the floating hero pause, the gold comment and duplicate `.ts-ed`/`.ts-flow`/`pre` rules, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Read the docs" → docs.hanzo.ai/docs/cli/treasury
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions for James listed, none decided

Done here: gate: 1 h1, max 1 solid per viewport at both widths. Desktop: the page's "Read the docs" is solid while the header is quiet, then the header carries it. Phones: the shared header keeps a solid "Try Hanzo", so the page's own "Read the docs" (hero and close) is outlined under 900px. Wallet buttons are outlined icons; the close's ask carries `data-thumb` so the bar steps aside.

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
- [x] Sticky ask: desktop header carries "Read the docs" after the hero; phones: the shared header keeps "Try Hanzo" and no bar shows (requested in `docs/build-notes/requests/treasury.md`)
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
- [x] No text under 13px on desktop, 14px on phone; mono capitals 11–12px only (the editor's "Treasury Operations" name)
- [x] Measures held; headings balanced
- [x] n/a tables (chapter rows are drawings, aria-hidden); n/a FAQ/tabs
- [x] `python3 scripts/parity.py /treasury`: 0 missing

Done here: parity `text 57/57 links 3/3`; measured at 375×812 over the whole page: 0 lowercase text runs under 14px (split.num, the close's figcaption and "event →" raised to 14px). Editor comments raised to #a3a3a3 on #0f0f0f (≥7:1).

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
- [x] Signature (the split writes itself), supporting: the Stage settle, PinChapters (desktop), the close's 10,000 counted once at figure size (64–84px), plus the magnetic ask as a pointer response; `variety.py` passes; 0 fade-ups
- [x] Idle (split, flow events), time (typing), state (wallet), pointer (magnetic), scroll (pin)
- [x] Something moves without input; every control answers
- [x] Reduced motion: the split rests finished, the coin and log rest; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK (magnetic, pathLength). No pinned chapters any more: the calculator re-plans every figure on the page; the wallet plays itself in its own room (held, paid, back, every 2.4 s while on screen, stops when driven, under pause and reduced motion); each carousel card runs its own ledger while half on screen (rows read in turn every 1.3 s with a drawn hairline, the flow lights its four steps). Entrances: accordion (calculator), iris (wallet), scramble (statement), side-carousel (parts), pixel-resolve (close). motion.mjs at 1470 (7 Nov 22:20): 0 still screens of 6, layout shift 0.000. The coin travels by transform only; the log height is fixed, so nothing below the wallet moves.

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

Done here: on phone the streams come first (inside the first screen) and stack as rows. The calculator stacks its sliders over the posting card; the wallet keeps its own room; the parts are a swipe rail (86% cards, prev/next and a 01 / 04 counter). Account names never break mid-name: reconciliation and balances rows size the account column to its name (desktop), and the phone postings keep @platform:revenue whole (12px arrow, 7ch amount).

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

Done here: Playwright walk at 1470x801 and 375x812 (7 Nov 22:25): 0 console errors in 6 cold loads, 2 of them with reduced motion on; no horizontal scroll; no text overlap at either size (overlap probe over every screen).

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `components/pages/apps/Treasury.jsx`
- [x] Review read: Ready line in docs/build-notes/review/treasury.md

Done here: Ready 7 Nov (James's bar: holds up next to /api and /affiliate, no score). The round-3 complaints are gone with the rebuild: desktop is alive end to end (0 still screens), postings draw real arrows, the count-up never blinks, no pin tail. This pass: account names whole in the carousel cards, the editor pause inverts on hover. taste/parity/unique OK.
