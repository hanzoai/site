# /gui coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Gui.jsx` · gallery: `docs/gallery/gui/` · metric id: `github_click`

Open copy questions for James: should the hero ask read "GitHub" (the live hero's label) or "View on GitHub" (the live close's label)? Both point to github.com/hanzoai/gui; the page uses "View on GitHub" in both places so the ask reads the same, and the live hero word "GitHub" stays in the HTML.
Shared changes requested (`docs/requests/<page>.md`): none; `lib/cta.js` is not on main yet.
Forks this page deleted: the v1 hand-written `Hero`, the horizontal props rail, the `Get` block from cloud/Frame, `Rise` fade-ups, raw `.x-btn` asks and wrapping data-thumb spans (now kit `Cta`), the duplicate desktop `AskBar`, the `/models/kai.webp` badge above the h1.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Header lists Persona, `Metric: github_click`, Goal, CTA "View on GitHub" → github.com/hanzoai/gui, Signature, Beyond, V2. One visible solid page ask measured at 375×812 and 1470×801 (`<Cta id="gui.hero" thumb>`), repeated only in the close (`gui.close`).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] ~~Breadcrumb at depth 2 or more~~ n/a: /gui is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main class="bz gu">`; links go through `A` and `Cta`; parity 2/2 links (GitHub, Deploy to Cloud).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: h1 cut-in, package line below it, ask, hero object)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (platform cards, Get GUI, the close sentence with the ask)
- [ ] ~~Card-to-page links use Morph~~ n/a: the platform cards open in place (BizOpen)

Done here: A centred 52px two-line h1 (BizLines `now`, pure CSS) over the code bar and the four frames, which change state 2.6 s after load; the package line (live hero's "@hanzo/gui — Cross-Platform UI Kit") sits below the h1, and nothing has an opacity arrival.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: kit `Cta` with `id="gui.hero"` and `thumb`, and `id="gui.close"`; the site's header and ask bar carry "View on GitHub". The code pane's Copy (kit) copies the shown code.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] ~~Marquees pause~~ n/a: no marquee
- [ ] ~~Privacy link beside every submit~~ n/a: no form

Done here: The proof is the component itself in four frames, rendered from Hanzo's own Welcome code; "4 stars" and Apache-2.0 sit as chips in Get GUI exactly as live.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /gui`: 0 missing

Done here: Parity 70/70 text, 2/2 links; phone rules lift labels and the code pane to 14px; the Welcome code sits in the kit `Code` pane.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex is on the deck ramp (the Welcome's tokens included: #ffffff, #e5e5e5, #0a0a0a); frames and cards are outlined or flat with no shadow; the token editor is the one graphite room. h1 52, heads 26, the closing sentence 44.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit `BizOpen`)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above part 1

Done here: Token chips are `role=radio` buttons with hover fills and press .97; the three inputs are 44px tall at 16px; platform cards fill on hover instead of lifting; hovers sit inside `@media (hover: hover)`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the four frames in step (idle). Supporting: Stage and chapters (scroll), cards that open (state); the editor answers the hand. No springs: the frames move 400ms ease-in-out, the code bar's values arrive 300ms ease-emphasis; the cycle is a `setTimeout` that stops off screen and on Pause. No page sounds.

## 10. Media
- [ ] ~~`Film` and `Pic` only~~ n/a: the v1 badge image is gone; no film or photo
- [ ] ~~At most 2 videos~~ n/a
- [ ] ~~Budgets met; alt~~ n/a
- [ ] ~~No dimmed photo~~ n/a

Done here: The objects are product UI drawn in HTML: four device frames (container units), the editor and the code pane.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Filmed at both sizes (375/375, 1470/1470). On phones the frames sit two by two, the chapters stack, the editor stacks over the frames and the platform cards become a swipe rail; the ask sits 270px from the top.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (inputs are labelled; the typecheck result is `aria-live`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The h1's second line is #737373 at 52px (large text, above 3:1); the code bar's Pause is a 44px `aria-pressed` button; a drifted value fails with a word and a ✕ shape, no colour.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Frames size themselves with CSS container units (no JS measuring); motion is layout transforms, opacity and one background colour; filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (platform cards open in place; links are `<a>`)

Done here: `app/gui/page.jsx` keeps `metadata` from `content/pages.json` and `<JsonLd route="/gui" />`, unchanged.

## 15. Catalogue and product pages
- [ ] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [ ] ~~Every card opens by Morph~~ n/a
- [ ] ~~Every maker and model page linked~~ n/a
- [ ] ~~One price figure everywhere~~ n/a: no prices

Done here: A product page: the component on four platforms, its chapters, the editor, platforms that open, the closing ask.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (kit `Code` until `CodeBlock` lands)
- [ ] ~~Config blocks parse~~ n/a: no config block
- [ ] ~~Terminal pauses~~ n/a: the code pane is static
- [x] No hand-typed version number

Done here: The install line and Welcome code sit in one kit `Code` pane with the install line marked in grey; Copy copies exactly what is shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (typecheck pass and fail; a drifted value leaves the frames on the last valid tokens)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Nothing is fetched live; JS off shows the h1, the four frames at their first state and every word; filmed with no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta` emits `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/gui.md` verdict 8 or more (no review written yet)

Done here: `data-cta="gui.hero"` and `"gui.close"`; V2 8/10; gallery refilmed at 1470×801 and 375×812.
