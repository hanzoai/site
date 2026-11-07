# /platform coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Platform.jsx` (+ `Platform.css`, `platformData.js`, `app/platform/page.jsx`; own v2 parts `IsoStack`, `PinChapters`, `SheetPanel`, `useCalm`) · gallery: `docs/gallery/platform/` · metric id: `api_key_created`

Open copy questions for James: none. Live /platform has no sales ask, so the System-type "sales ask" is not added; Hanzo's own "Start building" stays.
Shared changes requested (`docs/requests/platform.md`): the site ask bar (`components/Ask.jsx`) should not float over content on desktop (header-only there); kit `Band` should accept an `id` so its primary carries `data-cta`; kit `Copy` should not show its tick when the clipboard write fails; `lib/cta.js`, `lib/track.js` and a kit `PageHero` do not exist yet.
Forks this page deleted: the page-local ask bar (the site `Ask` reads `data-thumb` instead), the Kernel section (now inside layer 11's sheet), the five-tile grid (now five rows and one stage), the marquee (now a static row), the separate proof strip and facts row (now one figures section), the closing of the black room (it left a blank screen).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the second half: `lib/cta.js` does not exist; the label is Hanzo's own "Start building" → `platform.hanzo.ai/api-keys`, one constant `KEY_URL`)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for prices: no price on this page)
- [x] Open copy questions for James listed, none decided

Done here: Top comment of `Platform.jsx` names Persona (developer, buyer second), Goal and metric `api_key_created`, CTA, Signature, Beyond. One solid ("Start building") on the hero, the same words in the site ask and the closing Band; "Inspect the stack" is quiet. `audit.cjs`: h1 count 1 at both sizes.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets `#main`, a marker the layout places before every page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: /platform is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every anchor is the kit `A` (or `Go`, a local wrapper around it); directory rows and heads are real links. `python3 scripts/parity.py /platform`: links 129/129.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1 (nothing above the h1: yes; `PageHero` does not exist in the kit, requested)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: First screen: the h1 cuts in by line mask at once and from 0.7 s each of the eleven plates slides out and names itself (450 ms a plate, one pass, under 5 s). Order: hero and map, directory, planes, capabilities, One API, loop, open, figures, Band, about 15 screens at 1470×801 (14,430 px with footer) and 19 at 375 before the footer. JS off: 211 of 215 text blocks visible (the 4 "hidden" are `display: contents` rows that do render). Directory rows and heads mark their label `data-morph`, so the shared Morph flies it into the destination page.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (first half yes; the failure state is kit `Copy`, requested)
- [ ] `data-cta` and `data-thumb` on every primary (hero yes: `data-cta="platform.hero"` + `data-thumb`; the Band's primary is kit `Band`, which takes no id: requested)

Done here: Hero asks are kit `Cta` (`platform.hero`, `platform.stack`, `platform.inspect`). The hero primary carries `data-thumb`, so the site ask shows "Start building" after the hero and steps aside over the map and the chapters (`data-ask-hide`). Kit `CodeBlock` copies the command it shows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (the marquee is gone: a static row)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: Figures are Hanzo's only: 95.6% (GPQA Diamond, with "152 of 159 new questions"), 3.02× (with its 95% interval), 2.0× (LoCoMo, 37.5% vs 18.8%), 11 and 4; each sits beside its method line and links to its measurement page. No count-up flashes a number that is not Hanzo's: figures settle by scale, the value is in the HTML.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /platform`: 0 missing

Done here: `audit.cjs` lists only 12px mono-capital labels (map bar, group keys, ring numbers) under 13px on desktop; phone chapter numbers raised to 14px. Headings use `text-wrap: balance`, body 62ch. Kit `Tabs`/`TabPanel`, `CodeBlock`, `Band`. Parity: text 330/330, links 129/129. Copy pass (8 Nov): offline copycheck missing 31 → 0. Each Hanzo line is now one text leaf: the three commands as "$ …" lines (page-local Cmd; the prompt greyed by ::first-letter, Copy copies without it), the console's "API Platform — Hanzo" title and its "Containers — Hanzo" pane (Hanzo shows two windows; ours merges them), its rows, note, caption and endpoint, ZAP, the inspector's "Product · docs · source", the loop's step lines, the facts ("11 native layers", "4 GPU backends") and the proof links ("95.6% on GPQA Diamond" …) as single lines, the endpoint paths, and the footnote as one paragraph as Hanzo prints it. The One API typing and count-roll are visual only (the text node always holds the final path or figure).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on `Platform.jsx/.css`, `SheetPanel.css`, `IsoStack.css`, `PinChapters.css`; every value is a `--k-*` deck token declared once at the top of each stylesheet. The "architecture map" label moved from above the map headline to the bottom bar; mono tags under headings became captions under their objects (14px sans). The isometric stack and camera are this page's alone (`unique.py` OK).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (disabled/loading n/a: no async control)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Rows, pills, links, ring steps, capability rows and pause buttons change fill, colour or position on hover and press (`translateY(1px)` or `scale(.97)`, 90 ms); all hovers sit in `@media (hover: hover)`. The layer sheet (`SheetPanel`) is a `role="dialog"` with focus trap, Esc, focus return and `inert` when closed; it now starts below the 60px header, so its close button is on top (checked by `elementFromPoint`). The map finder input is 16px. Forks deleted: see the line at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the camera through the stack. Supporting: pinned chapters, typing (One API), Sigil preview; `variety.py` OK, no `Rise`. Kinds: scroll (camera, chapters), idle (arrival walk, capability walk, One API replay, ring), pointer (stack turns, previews), state (sheets, gliding pills), arrival (line masks). All auto-advancing parts are one-shot `setTimeout` steps that stop when off screen, with a pause control where they run past 5 s. Reduced motion: the stack rests open, no loops. No page-local sound; kit parts carry the shared ones. Slice D (7 Nov): in the black map the camera holds on a group while its words are up and crosses to the next only within ±1.5% of track around the switch; the words crossfade (incoming 300 ms with no delay, outgoing 180 ms) and the intro hands to API by a scrubbed crossfade, so the left column is never empty for more than one transient frame (probe: 80 px wheel steps, 140 ms dwell: 1 sample under 0.6 combined opacity at the intro/API handoff, none at the group switches). The intro is at full opacity by the time the room covers the screen. Section entrances from MOTION-MAP, page-local in Platform.jsx/.css under html.js and no-preference: inertia-drag (directory thrown in, coasts and settles), count-roll (capability numbers and the figure roll up into their slots, visual only), spiral-in (the improvement ring), underline-sweep (Open's heading lines and links), explode-gather (the figure strip). Probe: all five end with data-in and nothing under 0.5 opacity at 1470 and 375.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video on the page)
- [x] At most 2 videos playing; pause button on loops over 5 s (n/a: no video; animated loops have pause buttons)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images; every drawing is inline SVG, `aria-hidden`)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo's /platform has no photography)

Done here: The objects are drawn, not filmed: the iso stack, the console window, data shapes, wires, locks, the release rail, tapes, the capability drawings, the ring, the Sigil preview. No raw `img` or `video`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `audit.cjs`: scrollWidth equals width at 375 and 1470, taps list empty (all ≥44px), CLS 0 desktop / 0.003 phone. Phone first screen: h1, lede, "Start building", then the stack itself (300px) naming its plates and opening. Chapters become a vertical story; capability rows tap to the stage. Slice D (7 Nov): the directory reads 01-07 left to right, top to bottom (a 4-column grid, 2 on phones), second-row heads on one y, row fills inside their column; planes at 42svh a chapter and the journey at 420svh: 16.2 screens at 1470 (was 18.0). `check.mjs /platform`: 0 errors, no overlay, scrollWidth 1470/375; no in-page target under 44px at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a for errors: the only field is the map finder, labelled "Find in the stack")
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Smallest text is #525252 or #737373 on white (7.8:1 and 4.7:1) and #a3a3a3 on black (8.4:1). Pause buttons on the capability walk, the ring and the One API replay; the arrival walk is one pass under 5 s; the kernel bus dot lives inside the sheet. Keyboard focus inside the pinned map moves the camera to it (`follow`).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 is server-rendered (line spans shown by the `now` flag). Transform and opacity only; one CSS file per part; no images. No fetch from the page; the directory text is read at build time from `content/pages.json`.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/platform/page.jsx` metadata equals `content/pages.json['/platform']` ("Hanzo Platform — one stack, down to the kernel"); canonical and og:url come from the shared layout; `<JsonLd route="/platform" />`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: no model card on /platform)
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM (n/a: not a model catalogue; every product route in the directory is linked)
- [x] One price figure everywhere (n/a: no price)

Done here: The 5.9 directory (MASTER 4.2 /platform) sits right after the map: seven planes, 44px rows in four even CSS columns, and the preview shows each product's own existing description with its Sigil on hover or focus. Labels carry `data-morph`.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- [x] Config blocks parse on their own (n/a: no config blocks)
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Commands are kit `CodeBlock` (docker run, curl install, hanzo serve), command first with Copy at the line's end, wrapping on phones instead of clipping. The One API replay has play/pause and rests on its typed path.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a for loading/error/offline: no live data; empty: the map finder shows "0 / 11")
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no form)
- [ ] A thrown island does not blank the page (no page-local error boundary; requested as a kit part)

Done here: Nothing on the page calls a network API. Console errors: 0 on load and scroll at both sizes (`look.cjs`). JS off reads in full (NOJS rules lay every scene out in flow and open the sheets' text). Slice D (7 Nov): JS off, the four Data tiles and every planes picture show (0 text elements under 0.3 opacity at 1470 and 375); the finder input carries suppressHydrationWarning (a pre-hydration screenshot writes an inline caret-color), so only the shared FooterHTML mismatch remains.

## 18. Measurement and handover
- [ ] `data-cta` on every primary; events only through `lib/track.js` (hero and asks yes; Band primary blocked on kit; `lib/track.js` does not exist)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [ ] `V2: <score>/10 <one line>` in the page file's top comment (added after the critic's verdict)
- [ ] Review read: `docs/review/platform.md` verdict 8 or more (re-review requested after this rework)

Done here: The page sends nothing; `data-cta` ids `platform.hero`, `platform.stack`, `platform.inspect`. Gallery proof in `docs/gallery/platform/`. Critic verdict before this rework: 6/10; this card is updated with the new verdict.
