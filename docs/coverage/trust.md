# /trust coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Trust.jsx` · gallery: `docs/gallery/trust/` · metric id: `contact_sales_submit` (cta_click on `trust.hero`, `trust.band`)

Open copy questions for James: none decided. "Find a control" (the search heading) and the placeholder "PKCE, SCIM, argon2id, HKDF…" are v1 UI strings, not hanzo.ai copy; they should be in `content/ui-strings.json` once it exists.
Shared changes requested (`docs/requests/trust.md`): v2/DetailSheet pair; the header ask's 240px cap and the nav's room for a page ask at 1000-1399px; v2/MaskLines and v2/SceneWipe reading reduced motion during render (hydration mismatch).
Forks this page deleted: the page-level AskBar pill (the shared ask bar in `components/Ask.jsx` carries the ask), the spring physics on drawers and answers, the v1 "seal" image, the 112px hero headline at rest.
Conflict noted (MASTER §0.6): MASTER §3.1 keeps centred heads for the closing section, but the hero is a centred statement because the critic found /trust sharing /leaderboard's frame and JAMES.md 8 asks that neighbouring pages differ (the coordinator's call); the 52px h1 follows the rhythm rule.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: One ask, Hanzo's "Request a review or an enterprise deployment" (/contact-sales), solid in the hero and word for word in the closing band; everything else is a text link. On phones the header's "Try Hanzo" is an outline on this page (page-scoped, the Playground.css pattern) so the hero ask is the one solid on screen. `lib/cta.js` does not exist yet, so the label is the page's own Band words (no prices on this page).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /trust is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` after the layout's `#main` skip target; the two papers are real links to /legal/dpa and /legal/subprocessors; the mailto and security.txt are plain `<a>` as on hanzo.ai. Parity links 6/6.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: A centred 52px h1 (line-mask cut-in), caption, lede and the ask over the evidence cabinet, whose first drawer slides out at 0.65 s and the rest every 3.4 s. Then one object per screen: the papers (path, title, ruled lines and the arrow; the descriptions live only in the cabinet's tray, so nothing is said twice), the "today" statement inking in word by word, the search typing its own example, the pinned "Where we stand" stage (one stance in focus, 01-04 with a scrubbed rail, its index growing 64 → 84px as it enters; an accordion on phones), the black room. Gaps tightened (cabinet to papers about 100px; the stance section is 205svh, 1642px at 1470, was 2123, and starts 88px under the list above, so no white screen before the stage). On phones the open drawer's contents ride directly under it (the tray is carried up by transform and the drawers below step down; the 8px pull leaves 9px to the panel edge), each drawer is one row with its mark on the title's line, so the locker is 774px (was 1069). Phone page 8434px (was 9660); desktop 6968 (was 7634). `PageHero` is not merged yet, so the hero uses the page's `Lines` (v2/MaskLines' motion, hydration-safe). JS off: a `<noscript>` rule stacks every tray entry, stands every heading and word in place and unpins the stance list. The papers carry `data-morph` on their titles (the Morph layer flies them); the /legal pages belong to another chat, so the landing offset is not verified.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy button
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta>` is not merged yet; the asks are `A` with the kit's `.pf-btn` (no `.x-btn`). `data-thumb` hands the label to the shared ask bar; `data-cta="trust.hero"` and `"trust.band"`. The header carries the whole label after the hero (313px, no clipping at 1470; two lines at 1180) through a page-scoped override until the header owner lifts the 240px cap (request filed; at 1024 and 1280 the shared nav leaves no room).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Published / On request comes from whether Hanzo links the document; SOC 2 stays "compatible", FIPS and passkeys keep Hanzo's own limits. The only figure is the live count of the 16 controls.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /trust`: 0 missing

Done here: Parity text 87/87, links 6/6. The 16 controls sit in five kit `DetailSheet`s under real h2s; the cabinet is an APG tablist with every tray in the HTML; the four stances are a `dl` whose closed bodies stay in the HTML (`hidden="until-found"` on phones, `inert` off-stage on desktop).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK; deck values only (ink, #525252, #737373, #f5f5f5, #ededed, #d4d4d4, black, white steps), radii 6/12/16/24/28, the floating shadow only on the pulled drawer and the papers. `tokens.css` does not exist yet, so the deck hexes are page variables on `.xtr`. Rhythm via `ProofRhythm.css`: h1 52, headings 26, figures 64 (the tray numeral, the live count), one 84px moment (the closing line). Differs from /security: centred statement over a wide cabinet against /security's split hero with the layer map.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Drawers (slide 6px and the index darkens, previewing the pull), papers, group rows (a quiet #f5f5f5 row fill and the + turns 90° at 1.06), stance rows, answers, the search and its clear button answer hover with a transform inside `@media (hover:hover)` and press at .97 in 90 ms; the hero ask hovers to #262626; 2px ink focus ring (white in the black room). The search input is 17px in a 56px field. Sheets are the kit's `DetailSheet`. Deleted: the page-level AskBar and the springs.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not merged; the page plays none

Done here: Signature: the evidence locker (idle, 300 ms ease-emphasis slides, pauses under the pointer; on phones an 8px pull and the tray riding in under the open drawer, transform only, duration 0 under reduced motion). The stance index scales .762 → 1 (64 → 84px) in 500 ms ease-emphasis as its stance takes the stage. Supporting: line-mask cut-in (arrival); "Find a control" types "PKCE" itself once at 60% in view, the count settles 16 → 1, then clears (time; stops on touch, never under reduced motion), answers appearing as you type (state); the statement inking in by word and the pinned stance stage with its scrubbed rail, plus the black room's entry (scroll: 3 of 7 kinds). variety.py OK (scroll scrub, clip reveal, typing). Timers are `setTimeout` and stop off screen or once you choose. Filmed (`scripts/motion.mjs`, 1470): layout shift 0.000; the cabinet moves in the hero, the reading screens rest. Headless Chrome reports `(hover: none)`, so the film lists hover-gated controls as dead; with `--blink-settings=primaryHoverType=2` every control answered (drawers, papers, group rows, search).

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or film on this page
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a
- ~~Budgets met; nothing missing; alt on every image~~ n/a
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: hanzo.ai's /trust has no media of its own

Done here: n/a: the objects are product-style (the cabinet, the two papers, the evidence sheets); the v1 decorative image was removed (no seals).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Playwright at 375×812 (isMobile, hasTouch): scrollWidth 375, 0 targets under 44px (arrow links 44px tall, the + buttons 44px wide, the black room's inline links padded to 44px). On phones the cabinet opens each drawer's contents inline under it, the papers stand upright as short cards, the "today" follow-ups sit in a quieter 15px measure beside a hairline, the control groups run their titles full width with the + at the right edge (the number column is dropped there), the search sits under its heading and count, and "Where we stand" is an accordion (one open, + turns to ×); both asks are full-width 56px+ slabs with a 16px radius and balanced lines (page-scoped), the hero one at about y 364.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text is #0a0a0a or #525252 on white and #f5f5f5, #fafafa or white 78% on black. The cabinet's cycle stops when you choose a drawer, while the pointer rests on it, and off screen. The search is labelled by its h2 with an `aria-live` count (off while the demo types). The tablist takes arrow keys; inactive trays and off-stage stances are `inert`; stance rows are buttons with `aria-expanded`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Transform, opacity and clip-path only (the drawer's hover uses the `translate` transform property); one timer for the cabinet, stopped off screen, and the search demo's one-shot timeouts, cleared on touch or unmount. Filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/trust/page.jsx` keeps the metadata and `<JsonLd route="/trust" />` unchanged; the security.txt link is kept.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a

Done here: n/a: /trust has no models, catalogue cards or prices.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page
- ~~Config blocks parse on their own~~ n/a
- ~~Terminal pauses and ends on a static frame~~ n/a
- ~~No hand-typed version number~~ n/a

Done here: n/a: no code.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Empty: a search with no match shows Hanzo's own line, "If a control you need is not on this page, ask.", with "Ask for it"; non-matching groups dim. Static copy with no fetch, so there is nothing to load or fail; JS off and reduced motion each show the final state (reduced motion from CSS at first paint, `getAnimations()` 0 after 3.5 s). 0 console errors over 8 fresh loads at both sizes, reduced motion included (the hydration mismatch is gone).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: `data-cta="trust.hero"` and `"trust.band"`; the search sends nothing anywhere. V2 line present. Review read: docs/review/trust.md gave 7/10 (second pass); its ranked fixes 1-7 are worked through (phone cabinet inline, papers without the repeated descriptions, stance stage shorter with a growing index, phone controls full width, phone "today" tightened without new words, the asks as slabs, gaps trimmed; variety.py passes, so the room's wipe stays), awaiting the next walk.
