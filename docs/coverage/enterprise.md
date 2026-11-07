# /enterprise coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Enterprise.jsx` (+ `Enterprise.css`) · gallery: `docs/gallery/enterprise/` · metric id: `cta_click` on `enterprise.hero` and the Band (toward `contact_sales_submit`)

Open copy questions for James: the CTA labels. The hero's live label is "Get Enterprise plan" and the old close said "Talk to sales"; the Band's solid repeats the hero ask and "Talk to sales" stays its text link, so no wording changed. Years beside the customer figures: the case copy has none, so none are shown.
Shared changes requested (`docs/requests/enterprise.md`): vendor the 12 customer and cloud logos into `public/logos/` (they 404'd; the page now shows names in type); kit `Band` blurs with JS off; kit `Film` has no pause control; `lib/cta.js`, `PageHero`, `tokens.css` pending. The header ask is shared chrome and not touched here.
Forks this page deleted: the 3×2 results boxes (now a hairline ledger), icons in rounded boxes (now the hero's nested-wall glyph), the repeated deployment block and its second sales button, the long dark GPU room (now an instrument plus a drawer), the split-flap results, the logo marquee, the kicker over the h1, the hand-made close (now kit `Band`), `Answers` (now kit `Faq`), the 12 hot-linked logo requests.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; n/a `lib/cta.js` (not merged): Hanzo's own label "Get Enterprise plan"
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a `lib/plans.js` (no plan price on this page)
- [x] Open copy questions for James listed, none decided

Done here: At 1470×801 the h1 (y 209-433), lede, ask (bottom y 619), trust row and 246px of the live audit log are all in the first screen (Playwright). Once the hero ask scrolls away, the header's solid button reads "Get Enterprise plan" (shared `Ask.jsx`, via `data-thumb`).

## 2. Information architecture and navigation
- [x] One `<main>`; skip link reaches it (the shell's `#main` mark)
- [x] Every link through `A`, `More` or `Cta`; every card a real link
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /enterprise` reports links 23/23.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (first log row lands at 0.9 s, walls draw in from 0.6 s, h1 cuts in on hydration)
- [x] n/a `PageHero` (not merged); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 loud sections in a row
- [x] Ends in proof, `Band`, footer
- [x] Card-to-page: the rack card grows into its drawer; result rows are links

Done here: Server HTML ships the h1 lines and lede in place (JS off: h1 opacity 1, transform none, 0 text nodes at opacity 0); the line-mask plays only from `.xe-cut`, added after hydration. Section order alternates: Security (quiet list + panel), Includes (loud tiles), Results (quiet ledger), GPUs (instrument), Partners, Questions (quiet), Band.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask: desktop header carries the page's ask after the hero; phone bar only where it covers nothing
- [x] n/a: no copy button
- [x] `data-cta` and `data-thumb` on the primary

Done here: Nothing floats on desktop. On phone the place-tabs block gets 72px more bottom room; a 375×812 scroll probe at 30 stops saw the bar once and 0 overlaps with the place tabs, captions or result rows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] n/a: no marquee (still row of cloud names)
- [x] n/a: no form on this page

Done here: "16 of 16" is the one big figure (64px) with 16 marks that fill once. The six commerce results are a hairline ledger of rows: figure 28px, line 15px, company 13px, no boxes. No logo is requested (they are not in `public/`), so 0 console 404s.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except mono capitals (the workspace render is decorative, `aria-hidden`)
- [x] Measures held; no orphan word in a heading
- [x] Tables and FAQ use kit `DataTable` and `Faq`
- [x] `python3 scripts/parity.py /enterprise`: 0 missing

Done here: Parity reports text 179/179, links 23/23.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24 tiles, 28 workspace; never box plus shadow
- [x] No icon in a rounded box
- [x] Differs from neighbours: a scrolled zoom over a product render

Done here: Scale has rhythm: h1 52px, headings 26px, one 64px figure per screen. Figures now rest small and grow only as the moment: prefill 32px → 44px while you pick a size, rack figures 26px → 32px on hover, 24/7 32px → 44px on hover, $999 26px and "From $4,999" 21px, growing a step on hover. The includes tile draws the hero's four walls with the workspace window at the centre; on hover the solid wall travels inward.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press, focus-visible
- [x] Focus ring on every Tab stop (kit ring)
- [x] Dialog: `x-cannon/Drawer`, Esc closes, focus returns
- [x] n/a: no inputs
- [x] Forks deleted: listed above

Done here: Result rows: a wash past the row edge, the figure slides 6px, the arrow moves 4px, press scale .98 at 90 ms. Offers press .98. At 375×812 every text link in `main` measures 44px or more (Playwright: 0 under 44), using min-height plus an `::after` inset.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (chained timeouts only while on screen)
- [x] n/a: sound kit not merged (shared)

Done here: Kinds: scroll (the boundary zoom), idle (the log keeps writing every 2.6 s while on screen; the instrument steps through sizes until touched; the security panel writes a row while "Audit log" is read), arrival (h1 cut-in, figure masks, tally and 32 GPUs light once), state (drawer, figure rolls), pointer (prefill by pointing, hover growth). Every existing motion is kept. FILM_SUMMARY

## 10. Media
- [x] `Film` (Zen) with poster
- [x] One video; 44px pause button (`aria-pressed`)
- [x] Budgets met; alt from names
- [x] No dimmed photo (only a gradient under tile text)

Done here: The pause button no longer causes a hydration mismatch under reduced motion (it decides after mount). Logos are not requested until vendored.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 375
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667 (ask bottom y 432)

Done here: Phone: h1, lede, ask (y 380-432), then the workspace with 142px of the log rows in the first 812px. `scrollWidth` equals the viewport at 375 and 1470.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a, #525252, #737373 on white; #525252 on #f5f5f5
- [x] Pause control on the film; the log and panel are decorative and `aria-hidden`
- [x] n/a: no form
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: The instrument's readout is `aria-live` only after a person picks a size, so the self-running steps are not announced.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML, visible
- [x] Images and film sized
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Motion is transform, opacity and colour only; timers run only while their object is on screen.

## 14. SEO and machine files
- [x] Title and description match `content/pages.json`
- [x] Canonical from the shared head
- [x] `<JsonLd route="/enterprise">` rendered
- [x] Every card is a real link

Done here: Title "Enterprise AI — Hanzo AI"; every place, caption, drawer line and answer is in the server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a; the Zen 6 links go to `/benchmarks/zen-6` and `/zen/zen6-max`.

## 16. Developer experience
- [x] n/a: no code block (endpoints in the workspace render are decorative)
- [x] n/a
- [x] n/a
- [x] No hand-typed version number

Done here: n/a; "Build on Hanzo Platform" goes to platform.hanzo.ai.

## 17. States and resilience
- [x] n/a: no live data
- [x] Missing media leaves a complete page (names in type, film poster)
- [x] n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: 0 console errors at 1470×801, 375×812 and 1470×801 reduced motion (Playwright, after the logo and hydration fixes).

## 18. Measurement and handover
- [x] `data-cta` on every primary (kit `Cta` dispatches cta_click; `lib/track.js` not merged)
- [x] Nothing identifier-bearing before consent
- [x] `V2: 7.5/10 ...` in the page file's top comment
- [ ] Review read: `docs/review/enterprise.md` was 6/10; this pass answers its six fixes, re-review pending

Done here: Review fixes: (1) nothing floats on desktop, phone place tabs padded; (2) quiet ledger, figures rest small; (3) 246px of log above the fold; (4) panel writes rows, walls glyph replaces icons; (5) hero in place, cut-in on hydration, hydration error fixed; (6) 44px phone links, row press.
