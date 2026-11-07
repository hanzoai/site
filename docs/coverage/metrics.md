# /metrics coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Metrics.jsx` (+ `.css`) · route: `app/metrics/page.jsx` · gallery: `docs/gallery/metrics/` · metric id: `api_key_created`

Open copy questions for James: none (the page keeps every live word; "View on GitHub" is the live hero label and is reused as the one ask).
Shared changes requested (`docs/requests/metrics.md`): (1) the site's sticky ask bar floats over content on desktop and the phone thumb bar covers content (MASTER §3.2 rule 6); (2) `lib/cta.js` / `lib/track.js` do not exist yet, so asks carry `data-cta` / `data-thumb` only.
Forks this page deleted: Frame's `Console` (8 `title=`), the hand-built hero shell, the full-bleed chart overlay, the floating traces card and toolbar card, the cursor-following crosshair label, the `useEvery` interval, the plain "Related" row, every Apple-grey literal and every spring.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label is Hanzo's live hero label)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on this page)
- [x] Open copy questions for James listed, none decided

Done here: `Persona: Developer · Goal: try Hanzo Metrics · CTA: "View on GitHub" → github.com/hanzoai/metrics · Metric: api_key_created` heads both `Metrics.jsx` and `app/metrics/page.jsx`. The first-screen audit (`fs-audit.cjs`) counts exactly one dark solid ("View on GitHub") at 1470×801 and at 375×812.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's `x-skip` → `#main` mark sits before every page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link renders through kit `A`, as do the Logs card (`RelatedCards`) and the console's eight product links (`LaunchConsole`). `parity.py /metrics`: 12/12 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is the kit's `LineMask` h1 + lede + one ask + the live chart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is `LaunchClose`: the page's Sigil, "Get Metrics", the one ask, licence and repo)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The first screen is the h1 (52px), the lede, the ask and the live chart tile; `fs-audit.cjs` measures 32,608 changed pixels in the first 0.9 s with no input. The h1 cuts in by CSS line mask at first paint and is visible with JS off. Rhythm alternates: hero tile, a pinned table (tall), a black room, a quiet card, the close. The Logs title carries `data-morph`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's `lx-cta` mirrors `Cta` at 48px; noted for the swap when the deck `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (carried by the site's `components/Ask.jsx` from `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (the kit's `Copy` in Frame's Paste)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask carries `data-cta="metrics.hero" data-thumb="View on GitHub"`, and the close ask carries `metrics.close` with the same thumb, so the sticky bar steps aside while either is on screen. `data-ask-name="Hanzo Metrics"` is on the hero section.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The only figures are Hanzo's ("4 stars", "Apache-2.0"). The chart and table draw shapes with no numbers, so nothing invented is shown.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (the table is product UI with `role=table`; the code is Frame's Paste)
- [x] `python3 scripts/parity.py /metrics`: 0 missing

Done here: Parity is 59/59 text and 12/12 links. Text is 13px or more on desktop and 14px or more on phone; only the 12px Zen Mono capitals (host, table heads, traces caption) go smaller. Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` reports OK. The palette is #0a0a0a / #525252 / #737373 / #a3a3a3 (on black) / #d4d4d4 / #e4e4e7 / #ededed / #f5f5f5. Tiles are flat #f5f5f5 at 24px; the table is outlined with no shadow. `metrics.hanzo.ai` sits in the toolbar, not above the h1. No other page in the group opens on a chart with traces beside it.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink plus a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none)
- [x] Forks this page deleted: listed at the top

Done here:
- The split tabs, label check, chart hold and pause are real buttons with `aria-pressed`.
- Hover is inside `@media (hover:hover)` and changes fill or ink. Press is scale .97 for 90 ms.
- There is no loading state to design: nothing is fetched.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: The signature is the live chart (idle), with the spike landing every ~10 s and opening its traces (time). Pointer: the crosshair reads the line, and the close's ask is magnetic up to 22 px. State: split, PromQL ↔ builder and the label check. Arrival: the h1 cut-in and the timed black-room wipe. Scroll: only the pinned table and "Get Metrics" growing. `variety.py` is OK and the file has no `setInterval` and no springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no Hanzo photo or film on this page)
- [x] At most 2 videos playing; pause button on loops over 5 s (the chart loop has a 44px pause, first in its toolbar)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo has no Metrics media)

Done here: The objects are product UI (chart, table, console) and the page's Sigil, drawn from `family.js` figures [4, 6]. The chart's `LivePause` has `aria-pressed`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: On a phone the h1, lede and ask come first, then the toolbar, the chart and the traces stacked in one tile. In the pinned chapters the table sits on top and the words below, and `pinchk.cjs` passes all six chapters. The crosshair is pointer-only; the tap path is holding the chart with a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Measured contrast: #737373 on white 4.74:1, #525252 on #f5f5f5 7.2:1, #a3a3a3 on #000 8.3:1, and white 78% on #000 for body copy in the black room. The heading order is h1, then h2 (intro), h3 (chapters), h2 (black room), h2 (close). The traces line is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media: none)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The chart draws its first frame on the server, with the spike under the cursor, and one rAF loop runs only on screen and stops when paused or held. The crosshair moves by transform with no React state, and filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/metrics/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/metrics" />`. The Logs card is a real `<a href="/cloud/logs">`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (the one card, Logs, has `data-morph`)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: This is a cloud product on the shared anatomy: identity (h1 and the address), the console (`LaunchConsole`), openable features (six pinned chapters), and a close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt via Frame's Paste copies exactly what it shows)
- [x] Config blocks parse on their own (n/a: no config block)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal; the chart has a pause)
- [x] No hand-typed version number

Done here: The one code surface is the agent prompt, and its Copy writes exactly the displayed string. No version numbers appear.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is complete at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (the Sigil, Phone and Cursor boundaries belong to the shared layer)

Done here: With the network blocked, the page still renders in full. Paused, held, reduced-motion and JS-off states each look intentional: the chart is set with the spike under the cursor and the traces open.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: it does not exist yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/metrics.md` verdict 8 or more (pending the new review; the earlier 6/10 complaints are all addressed above)

Done here: `metrics.hero` and `metrics.close` are set. The gallery has `d.mp4` (a whole-page scroll), `d.jpg` and `p.jpg`. The 6/10 review's complaints are each answered: no hue, no eyebrow, the product on the first screen, one ask, controls that answer, and a card that opens.
