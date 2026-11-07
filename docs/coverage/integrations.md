# /integrations coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/integrations/IntegrationsIndex.jsx` · gallery: `docs/gallery/integrations/` · metric id: `api_key_created`

Open copy questions for James: none on Hanzo's copy. Two UI strings wait for the register: "Find your tool" and "Nothing matches" (see the request file).
Shared changes requested (`docs/requests/integrations.md`): the two UI strings; the `components/Morph.jsx` 4 s freeze (rAF inside the View Transition callback).
Forks this page deleted: the floating AskBar pill, cursor labels on badges and cards ("Open"), springs on the chip pill and grid, the `setInterval` language timer, the outlined second hero button (now a text link), shadows and lifts on cards.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` — n/a for prices: none on the page
- [x] Open copy questions for James listed, none decided

Done here: `// Persona / Goal / CTA / Metric: api_key_created / Signature / Beyond` head the file. The one solid ask is Hanzo's "Get an API key" (hero), repeated once as the closing room's ask; "SDK docs" is a text link. The label and href are the live page's own (`doc.actions`).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site chrome)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more — n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity 21/21 links. All 19 cards are `<a href="/integrations/<slug>">`; the hub badges link the same guides (desktop).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 — `PageHero` not merged; the h1 cuts in by `MaskLines`
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: "Works with everything" + the base URL lede + one ask; the hub turns from first paint with the count 19 as the one big figure. JS off: 94 text blocks, 0 invisible. Order: hub → editor → catalogue → "Paste and ship" (the closing black room, with the ask) → footer. Card titles carry `data-morph`; the guide's h1 is `data-morph-target` (filmed: `click-through.jpg`, with the Morph fix simulated).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` — kit `.pf-btn` until `<Cta>` merges
- [ ] Sticky ask in header and bar after the hero, same label — n/a: "nothing floats over content" (conductor) removed the bar; the phone thumb bar comes from `data-thumb`
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta="integrations.hero"` + `data-thumb="Get an API key"`; `data-cta="integrations.band"` on the closing ask. Copy buttons use the kit `Copy` with the sample's own `text`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates — the ring has a Pause and freezes under reduced motion
- [x] Privacy link and owner line beside every submit — n/a: no form

Done here: the only figure is the count of Hanzo's own guides (19 cards). The badges are each guide's own emoji, drawn in grey.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts — page-local APG tabs and code block until `Tabs`/`CodeBlock` merge
- [x] `python3 scripts/parity.py /integrations`: 0 missing

Done here: parity 71/71 text, 21/21 links. Body 14–16px; mono 12px only for numbers and file captions.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; code is greys by white alpha steps (no syntax hues). Rhythm on `ProofRhythm.css`: h1 52, headings 26, one moment (19 at 84). Cards are flat `#f5f5f5` tiles (no outline, no shadow). Hero medium: a turning hub, unlike /open-source's canvas sky.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it — n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: chips, tabs, cards, Pause and Copy press at `scale(.97)` in 90 ms; hovers inside `@media (hover: hover)`; disabled chips (no match) are styled; the search field is 56px with 16px text.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit — n/a: sound kit not merged

Done here: signature the card that opens (Morph). Supporting: the hub turning (idle), the editor switching language on a per-step timer (time), the dark room's widening panel (scroll). State: the chip pill glides at 300 ms ease-emphasis and the grid re-flows; cards lean up to 2.5°. No springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set — n/a: no images or film on the live page
- [x] At most 2 videos playing — n/a
- [x] Budgets met; nothing missing; alt on every image — n/a
- [x] No dimmed or filtered photo — n/a (the emoji badges are greyed by the 0-hue rule; they are glyphs, not photos)

Done here: the visuals are the tools' own badges and Hanzo's own code.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `node scripts/phone.mjs /integrations`: OK. At 375 the ask is full width above the fold; the ring is a picture (badges 36px, no taps, per the conductor); the catalogue becomes 72px list rows; chips scroll sideways inside their rail.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused — the search field has an accessible name
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: the ring and the editor each have a 44px Pause (`aria-pressed`). Chips and language tabs are `role=tab` with arrow keys; the hub centre is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the ring is one CSS animation (paused off screen by `[data-off]`); the editor's timer runs only in view. No canvas, no video.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/integrations/page.jsx` unchanged (metadata from `content/pages.json`, `<JsonLd route="/integrations" />`).

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` — n/a: no model cards
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM — n/a: every guide is linked
- [x] One price figure everywhere — n/a: no prices

Done here: 19 numbered cards (`01 / 19`), the first card in view spanning two columns; titles morph into the guide h1.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse on their own — n/a: no config block
- [x] Terminal pauses and ends on a static frame — the editor pauses (button, a pick, or reduced motion)
- [x] No hand-typed version number

Done here: each sample's Copy copies its own `text`; the agent prompt's Copy copies the prompt exactly.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values — n/a: no form
- [x] A thrown island does not blank the page

Done here: static data (no fetch); the search's empty state and disabled chips are designed.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/integrations.md` verdict 8 or more — not reviewed yet

Done here: `data-cta="integrations.hero"` and `"integrations.band"`; no tracking code on the page. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`, `click-through.jpg`.
