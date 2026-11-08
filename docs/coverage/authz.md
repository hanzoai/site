# /authz coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Authz.jsx` (+ `Authz.css`, page-local `ExampleConsole.jsx/.css`) · gallery: `docs/gallery/authz/` · metric id: `api_key_created` (developers; the click is `cta_click authz.hero`)

Open copy questions for James: the demo's UI labels are ours, not Hanzo's ("caller", "location", "can", "grant", "target", "Replay", "Delegate it yourself", "your grant", "the agent's grant", "with an expiry", "edge", "token", "accepted", "rejected", and the statement drawing's "JWT", "one question", "can", "true"); keep them or move them to `content/ui-strings.json`? The spec sheet's "1 rule" and "3" are counts of Hanzo's own "one question" and its three named algorithms (RSA, EC, ML-DSA-65), not new figures; keep? "4 stars" is the live page's static GitHub figure.
Shared changes requested (`docs/requests/authz.md`): none. Kit notes for the Cloud 1 owner: KeynoteStage's `cta` default is the bare id `hero` (pages must pass `<page>.hero`); KeynoteClose's CodeBlock caption is 12px sentence case; its text-link "Self-host" reads `--ink` inside the dark room and the kit link asks are 21px tall (this page sets them white and 44px locally).
Forks this page deleted: Frame's `Console` (6 `title=` tooltips, a spring row, a `setInterval`) replaced by page-local `ExampleConsole` (visible labels, no tooltip, built once); the spring on the answer (now a line-mask cut-in); the spring on the delegation picker (now a 300 ms tween glide); the native checkbox (now a switch button); the phones' `setInterval` scene loop (now one pass, a step a second); the violet/grey accent `--ac` and every off-deck grey (#fbfbfd, #f5f5f7, #e3e3e8, #0b0b0c, #8e8e93, #3a3a3e, #f0f0f3); 8 box-shadows; the 112px/128px answers and the 44px statement.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live hero's)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: "Read the docs" (docs.hanzo.ai/…/authz) is the hero's one solid (`data-cta="authz.hero"`, `data-thumb`), "View on GitHub" is a kit text link (`authz.hero-2`); the close's one solid is Hanzo's "Deploy to Cloud" (`authz.close`) with the "Self-host" link. The header's "Try Hanzo" is always solid (SYSTEM §5), so the page keeps one own solid per view. The first screen reads "Hanzo Authz / Fine-grained authorization" over a graph answering true or false: at 1470×801 the title block sits right under the header (page-local `.az .kns` padding 24px instead of the kit's 38svh drop) on an 8/5 split of two shared rows (h1 and lede share a baseline at y≈137; the pause/label line and the asks share row 2), the window starts at y≈256 and the whole decision panel, last line included, ends at y≈789; at 375×812 a compact answer line (`.az-mini`: "true" at 44px beside "workspace member → acme/prod/web") sits at y≈500, above the caller pills.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /authz is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link goes through the kit's `A` or `Cta` (the console's sidebar, "Authz — Hanzo" and "Open in the console ↗" included). `parity.py /authz`: links 11/11.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's KeynoteStage stands in until `PageHero` merges; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is Hanzo's own "Get Authz" dark room)
- [x] ~~Card-to-page links use Morph~~ n/a: no card opens into a page; the related rows are plain links (Morph turns the page)

Done here: With Next's JS blocked (`prehyd.cjs`), the request bar's fill (`az-fill`), the steps and the answer's line mask run in the server HTML at 250–1000 ms (screens differ by 171 and 480 samples). With JS off nothing is hidden (audit: 0 hidden text). Order: check (hero) → statement (with its drawn token → one question → true line) + six pinned rules → delegate it yourself (quiet room) → tech specs → related + console → Get Authz (dark). The hero's bottom pad is 56px and the statement's top pad 27–56px, so the hero window is followed by the statement without a 250px gap. The pinned rules run 0.7 screen a chapter (`tall={70}`, 3,364px instead of 5,263px); the scene in front grows from .94 to 1 as its chapter arrives, 05's token card scrubs across the edge with the scroll, and 04 stands on white, not the quiet grey. Lower-half section pads cut page-locally (116/72px instead of the kit's 161px each side), so the rooms follow without 300px white gaps. Phones: the six rules are a snap swipe rail (scene first, then words and 01 / 06, the next card peeking), each card 706px, so the chapters take 1,430px instead of 5,183px (page 13,887 → 10,231px). The decision panel never sits empty: the last answer stays in the quiet grey (#d4d4d4) under the next check until the new one cuts in, and the step list waits at 22% rather than blank.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text (the close's kit `CodeBlock`); failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero asks come from KeynoteStage's kit `Cta` with `cta="authz.hero"`, and the close's from KeynoteClose with `cta="authz.close"`; no page-made button asks. The ask bar carries `data-thumb="Read the docs"`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The only figures are Apache-2.0, "4 stars" (live), ML-DSA-65 and the spec's counts 1 and 3 (listed for James). The demo draws Hanzo's own example path (acme, acme/prod, acme/prod/web, the app or site under that) and shows no statistics.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs~~ n/a: none; code uses the kit `CodeBlock` (close)
- [x] `python3 scripts/parity.py /authz`: 0 missing

Done here: Parity 58/58 text, 11/11 links. No value breaks mid-word: the token's path is `nowrap` with a 13ch floor in a 250px column, the rule chips are `nowrap` (one line at 1470 and 375), and the chapter headings set in two balanced lines (20ch, `text-wrap: balance`). Sizes are deck only: h1 52 (40 phone), headings 26, H3 26 (kit chapters), scene labels 32/26/21/17, body 16, captions 14/13, mono caps 12, the answers 64px Air 220 (52 phone). `audit2.cjs`: the only sub-14px phone text is the kit's 12px mono counts and CodeBlock caption.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK (4 files). Colours: #fff, #fafafa, #f5f5f5, #ededed, #e4e4e7, #d4d4d4, #a3a3a3 (lines; text only on ink), #737373, #525252, #404040, #0a0a0a, black 10/30%, white 30%. 0 box-shadows; radii 6/8/12/16/24/999. The "Delegation is a narrower grant" kick now sits under "Delegate it yourself"; the statement is an h2 with Hanzo's paragraph beside it. Status is a shape: filled ink on the path, hollow off it, dashed when refused. The hero (a permission graph) differs from /iam and /kms.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs are native~~ n/a: no dialog on this page
- [x] ~~Inputs 16px~~ n/a: no input; no bare `:hover` (all inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: "View on GitHub" underlines and its arrow moves 4px; the expiry switch's track and thumb change on hover (off: track #e4e4e7, thumb ink, nudged; on: track #404040, thumb grows); hero location rows hover to a #a3a3a3 border and #fafafa fill (lit rows to #262626). Hovering a hero request mark fills its 44px target, thickens the mark and names that request in the bar ("workspace member → acme/prod/web" lifts in where "hanzoai/authz" was). Hovering a related row fills that product's entry in the example console's sidebar (IAM row → IAM entry) and darkens its line. Callers, locations, request marks, Replay, the picker pills, the expiry switch (`role="switch"`), related rows and console rows all press to .97 in 90 ms, hover by border/fill/underline (never opacity) and focus with `2px solid var(--focus)`. The console's listbox moves by ↑ ↓ Home End. No `title=` attributes.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (Cta tap via the shared kit; nothing page-made)

Done here: `variety.py` OK (pathLength, layoutId, Count; 0 `Rise`). The spec's 1 and 3 count up once in Air 220 as their row arrives, and each spec row's hairline draws across as it scrolls in (CSS `animation-timeline: view()`, where supported). The statement's line draws once when seen (~1.4 s: hairline, question fills, hairline, then an ink rule draws under "true", which is in the HTML from the start). Scale rhythm: the 64px Air answer is the hero's only; the statement and delegation answers are 44px (36px on phones). Chapter scenes scale .94 → 1 on arrival (CSS); scene 05 scrubs its token with `useTransform` of the chapter's progress. Idle: the check asks itself every 4.6 s (gated on `live && !useStagePause()`; pause beside the asks). Time: the request fill, the expiry rings running down once. State: picking a caller/location, the picker glide (300 ms tween), the switch. Pointer: the magnetic ask, hovers. Arrival: line masks. Scroll (1 of 6): the pinned rules and the Stage settle. 0 springs, deck easing `[.4,0,.2,1]`/`[.16,1,.3,1]`; loops end at rest (lines run 3×, phone scenes one pass ≤ 4.5 s).

## 10. Media
- [x] ~~`Film` and `Pic`~~ n/a: no photo or film; the objects are product UI (graph, scenes, console)
- [x] ~~At most 2 videos~~ n/a: no video
- [x] Nothing missing; ~~alt~~ n/a: no image
- [x] ~~No dimmed photo; 4+ real visuals~~ n/a: Authz has no Hanzo media

Done here: The page has no Hanzo image or film; every section's object is drawn product UI in SVG and HTML.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs authz`: no sideways scroll, no errors (desk + 375). `audit2.cjs`: 0 sideways at 320, 0 targets under 44px on phone. At 375 "Read the docs" sits at y≈190–234. The graph stacks to the compact answer line, callers (2×2), locations, decision. The rules are a horizontal snap rail (88% cards; overflow contained in the rail, page overflow 0). On phones the answer line sits right under the asks (the pause and the repo line move below the window); the location rows hold their height through every pick (the last row reserves 88px, chips stack) and every chip sits 16px in from its row edge.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On white #525252/#737373, on #f5f5f5 #525252 or ink (the decision panel, scenes and quiet room override `--quiet` to #525252), on ink #fff/#a3a3a3. Headings: h1 → h2 statement → h3 ×6 → h2 ×4. The decision is `aria-live="polite"`; callers and locations are radiogroups; requests are `aria-pressed` buttons named by caller and location.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; ~~every image sized~~ n/a: no image
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Only `setTimeout` steps, run while seen; animation is transform, opacity, clip and SVG stroke. Filmed in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/authz" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/authz/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/authz" />`.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a
- [x] ~~Every maker and model page linked~~ n/a
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Cloud product anatomy: identity (hero), the live object (the check), facts that open in turn (six rules), the console, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the close's agent prompt)
- [x] ~~Config blocks parse~~ n/a: no config block
- [x] ~~Terminal pauses~~ n/a: no terminal; the self-running check has the Stage pause
- [x] No hand-typed version number

Done here: The agent prompt is the kit `CodeBlock` inside KeynoteClose; `hanzo authz check` in the hero bar is a label, not a copy target.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a beyond: no fetch on this page)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit~~ n/a: no form
- [x] A thrown island does not blank the page (site error boundary)

Done here: The page fetches nothing; paused, picked (Replay), reduced-motion and JS-off states each read as intended. Console errors: none (`errs.js /authz`, both sizes, 3 runs). The reviewer's intermittent hydration warning did not reproduce in single loads; the page's own first render reads no Date, random or window (the check starts at step 0, `useGeo` starts null and fills in a layout effect), so it is left to the shared-noise note (several browsers on the dev server at once).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit's `Cta` (`cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [x] Review read: `docs/review/authz.md` (round 2, 7.5/10) acted on: token/chip wraps, pin length and scene scale, hero-statement gap and the statement's final state in HTML, the 8/5 hero baseline, one 64px answer, hover gaps, chapter 2 heading

Done here: ids `authz.hero`, `authz.hero-2`, `authz.close`, `authz.close-self`; metric `api_key_created`. Gallery: `docs/gallery/authz/` (desktop.mp4, desktop.jpg, phone-1..3.jpg, desktop-r2.jpg, phone-r2.jpg, desktop-r3.jpg, phone-r3.jpg). Own score 8/10; the critic's verdict decides.
