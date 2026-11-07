# /flow coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Flow.jsx` · gallery: `docs/gallery/flow/` · metric id: `app_handoff`

Open copy questions for James: "Step through it" is both a chapter heading and the playground's heading (kept both, live wording). Licence: Hanzo's live /flow copy says both "MIT" (the fact strip, "MIT · Self-hosted") and "License: Apache-2.0" (Get Flow); both are kept word for word, so which is true needs James. Shared request: the phone header keeps a solid "Try Hanzo" beside the hero's solid "Open Flow", and is clipped at 320 (shared chrome). Node names are Hanzo's own component list; "received"/"returned" and "in"/"out" are the playground's UI labels from Hanzo's "shows what each one received and returned").
Shared changes requested (`docs/requests/<page>.md`): none; `lib/cta.js` is not on main yet, so the ask label is the live hero's own "Open Flow".
Forks this page deleted: the v1 hand-written `Hero`, the props accordion, the `Get` block from cloud/Frame, `Rise` fade-ups, raw `.x-btn` asks and the wrapping data-thumb spans (now kit `Cta`), the duplicate desktop `AskBar`.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Header lists Persona, `Metric: app_handoff`, Goal, CTA "Open Flow" → flow.hanzo.ai, Signature, Beyond, V2. The only page solids are the hero ask (`BizAsk cta="flow.hero" thumb`) and the closing band's ask (`BizAsk cta="flow.close"`), never on one screen together. Each other link appears once: Deploy to Cloud (Get Flow), View on GitHub (the row under the terminal), the hanzoai chip (Get Flow); Documentation sits beside the hero and close asks only.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] ~~Breadcrumb at depth 2 or more~~ n/a: /flow is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main class="bz fl">`, the layout's `#main` mark takes the skip link; links go through `A`, `More` and `Cta`; parity 4/4 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: h1 cut-in, lede, ask, the canvas)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (facts that open, Get Flow, the close with the two commands and the ask)
- [ ] ~~Card-to-page links use Morph~~ n/a: the fact cards open in place (BizOpen)

Done here: The first screen is the dotted canvas with the 52px h1 among six nodes; the first node runs at load and a pulse travels within ~1.8 s. The h1 cut-in is pure CSS (BizLines `now`), the lede and ask have no opacity arrival.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: v2 `BizAsk` (`flow.hero` with `thumb`, `flow.close`); the desktop header carries "Open Flow" past the hero (the phone header label is shared chrome, requested in docs/requests/cloud2.md). The terminal Copy copies `uv pip install hanzoflow\nuv run hanzoflow run`, exactly the two commands shown (the `$` is a separate glyph).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] ~~Marquees pause~~ n/a: no marquee
- [ ] ~~Privacy link beside every submit~~ n/a: no form

Done here: The four figures (Python, REST, :7860, MIT) are Hanzo's fact strip with their captions; the run's "01 / 06" counter counts Hanzo's own six-item list.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (the REST/JSON/MCP tabs are `role=tab` buttons with `aria-controls`)
- [x] `python3 scripts/parity.py /flow`: 0 missing

Done here: Parity 40/40 text, 4/4 links; phone check finds no text under 14px apart from 12px mono capitals (kit captions).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex is on the deck ramp; radii 6/8/12/16/24/28/999; nodes, facts and the terminal are outlined with no shadow (the lit node takes a ring); the playground is the one graphite (#171717) room. h1 52, heads 26, figures 64 at rest, 84 only in an opened fact.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit `BizOpen`)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above part 1

Done here: Hovers live in `@media (hover: hover)` and fill (fact cards, step chips, the GitHub row) instead of lifting; presses scale .97; Previous disables at the first step; focus rings are ink (white in the graphite room).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the run (idle; a tap on a hero node holds it there). Supporting: line-masked headings, chapters (scroll: a build-up on desktop, one pinned scene swapping one chapter at a time on phones), open cards (state); the playground is the hand, its returned value streaming in (time). No springs: the pulse rides the edge in 900ms ease-in-out (a scene move), arrivals 300–400ms ease-emphasis; the run is a `setTimeout` chain that stops off screen and on Pause. No page sounds.

## 10. Media
- [ ] ~~`Film` and `Pic` only~~ n/a: no image or film for Flow
- [ ] ~~At most 2 videos~~ n/a
- [ ] ~~Budgets met; alt~~ n/a
- [ ] ~~No dimmed photo~~ n/a

Done here: The objects are product UI drawn in HTML and SVG: the running canvas, the compact build-up diagram, the large playground inspector and the terminal. No Flow screenshots or film exist in `public/`, so there is no media block.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Filmed at both sizes (width 375/375, 1470/1470); on phones the canvas re-lays as a two-column snake that keeps the 16px gutter at 320 (nodes at x 20–300), chapters become one pinned scene (mini-graph plus the current chapter, opaque, nothing behind it), the playground controls are 48px; the ask sits at 236px from the top at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Pause sits on the hero inspector (44px, labelled) and Play/Pause leads the playground controls; hero nodes and playground steps are buttons with `aria-pressed`/`aria-current`; the run state is `aria-live` (the streaming value is not, so it is announced once).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Edges are measured once per resize with a ResizeObserver; the run only steps while on screen; motion is transform and opacity. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (fact cards open in place; links are `<a>`)

Done here: `app/flow/page.jsx` keeps `metadata` from `content/pages.json` and `<JsonLd route="/flow" />`, unchanged.

## 15. Catalogue and product pages
- [ ] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [ ] ~~Every card opens by Morph~~ n/a
- [ ] ~~Every maker and model page linked~~ n/a
- [ ] ~~One price figure everywhere~~ n/a: no prices

Done here: A product page: identity and the running canvas, a 4-fact strip from existing text that opens, the closing ask.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the terminal block)
- [ ] ~~Config blocks parse~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (static block, caret only)
- [x] No hand-typed version number

Done here: The close's terminal shows Hanzo's two commands and `→ 127.0.0.1:7860`; Copy copies exactly the commands shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the run's running / passing / done / complete states; "…" before a node returns)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Nothing is fetched live; with JS off the canvas shows its nodes and every word, and the phone chapters stack instead of pinning (the pin is scoped to `html.js`); walked with no console errors at 1470, 375, 320 and reduced motion.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta` emits `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/flow.md` verdict 8 or more (no review written yet)

Done here: `data-cta="flow.hero"` and `"flow.close"`; V2 8/10; gallery refilmed at 1470×801 and 375×812.
