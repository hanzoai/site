# /extension coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ExtensionPage.jsx` (+ `ExtensionPage.css`, shared `components/v2/AppType.css`, `AppScenes`, `AppSheet`, `x-edison/AppLines`) · gallery: `docs/gallery/extension/` · metric id: `extension_download`

Open copy questions for James: none decided. The hero now leads with "Download Extension" (Hanzo's own label from the page's closing section) as its one solid; the live hero's "Availability" and "Use Hanzo Chat" stay, as text links, with the same words and links.
Shared changes requested: see `docs/requests/apps1.md` (header ask label per page, a desktop-off mode for the ask bar, a `Band` with `id`). Until then `<main data-ask="off">` and the page closes on its own band with `<Cta id>`.
Forks this page deleted: the kicker over the h1 ("Browser extension", kept in "Browser extension + MCP bridge" and the spec drawer) and over "Mostly the work…" (now a caption under it); skeleton bars in the windows' page and tabs and in the "Read a page as text" picture (now Hanzo's own page title, line and model images through kit `Img`); raw `<img>`; the solid "Availability" and the solid row button (now text links and quiet buttons); the second ending ("Get Extension" card with a solid "Deploy to Cloud", now quiet above the band); spring transitions; overlapping point crossfades; cursor labels; shadows on objects.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: not merged; "Download Extension" → github.com/hanzoai/extension/releases/latest, Hanzo's own)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Top of `ExtensionPage.jsx` names Persona, Goal, CTA, `Metric: extension_download`, Signature and Beyond. check.mjs: 1 solid on the first screen at both sizes; one `<h1>`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 6/6 (docs, chat.hanzo.ai, releases, /chat, GitHub, deploy); every link is `A` or `Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the equivalent is the line-mask h1, one lede, one ask, one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (n/a: no proof figures), `Band` (the page's own "Get the Hanzo Extension"), footer
- [x] Card-to-page links use Morph (the stack carries `data-morph-target`; /download's extension card flies into it)

Done here: At 1470×801 the h1 (52px), lede, the one ask and the whole fanned stack share the first screen, and the side panel walks the five points at once (check.mjs: changes 142 in the first second). JS off: 0 invisible text blocks; without JS the panel lists all five points (scrollable) instead of stacking them. Rhythm: hero → black room → 3 pinned chapters → build rows → tab window → docs and repo → band.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the bar is off by request, see apps1.md)
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `extension-download` (thumb, hero) and `extension-download-end` (band). Builds rows are quiet (`extension-build-chrome|firefox|edge|other`); text links `extension-availability`, `extension-chat`, `extension-docs`, `extension-chat-end`; quiet `extension-deploy`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number (no browser logos: the three windows are neutral chrome)
- [x] Every figure traces to Hanzo's copy (v1.9.31 and the sizes in the spec drawer are live /download's)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No counters. "You are on Chrome" is the page's own detection line from v1, shown as a caption under the row title. Parity text 60/60.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (the uses are APG tabs: arrow keys, Home and End, roving tabindex; the spec is in the kit drawer)
- [x] `python3 scripts/parity.py /extension`: 0 missing

Done here: h1 52px, heads 26–32px, panel titles 21px, chapter titles via the kit (26 growing to 32), body 14–16px. Parity text 60/60, links 6/6.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow (windows, panes and tiles are outlined or flat; no shadows)
- [x] One icon set; no icon in a rounded box (stroke glyphs; the extension's own icon in the toolbar is product UI)
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK. /chrome is one big Chrome window with an inspector; /extension is a fanned stack of three neutral browsers led by the side panel. /desktop's hero is a centred app window, /download's a dial.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled (n/a: none disabled), loading (the `Cta` hand-off sets `aria-busy`)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (the kit `AppSheet` drawer)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; every hover sits in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Pause, browser tabs, the extension toggle, point steps and use tabs each have hover (fine pointers), press (scale .97 or 1px), focus-visible and selected states. The browser pill and the use tab glide with a 300 ms ease-emphasis tween; windows deal with a 500 ms ease-in-out (a scene move).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: not merged; none played)

Done here: Signature: the stack and its panel (idle: the panel walks the points, the windows shuffle on "one behaviour"; state: you deal a browser to the front). Supporting: pinned chapters (scroll), the request travelling the path (idle, in the black room), line-mask headlines (arrival). variety.py OK, 0 Rise. Points change without overlap: the old one leaves in 150 ms before the new one arrives.

## 10. Media
- [x] `Film` and `Pic` only (kit `Img` for every picture; sizes 1200×1500 given)
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video (the stack's loop has its own pause)
- [x] Budgets met; nothing missing; alt on every image (decorative, `alt=""`; koma 10 KB, zen 18 KB, uta 64 KB, iro 18 KB)
- [x] No dimmed or filtered photo; 4+ real visuals together (n/a: four model pictures appear, three at once in the stack)

Done here: The pages inside the windows show Hanzo's own model pictures, the page's only colour. Only the first window's picture loads eagerly.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812: h1, ask and the stack walking on the first screen, CLS 0.000, no small targets (the windows behind draw the extension icon without a button). On phones the panel rises in the window's lower half, chapters stack, the tab strip swipes.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 on white; white 55% or more on black)
- [x] Pause control on every moving item (the 44px pause is first in the stage's DOM, `aria-pressed`, Pause/Play; the black room's travelling request is a decorative 4.2 s loop that stops under reduced motion)
- ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The panel's steps are `role="tab"` buttons named by their point. The back windows are `aria-hidden` with no focusable parts. Use tabs move with arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (not measured here: needs a production build)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1, lede, ask, the five points and every row are server-rendered. The walk is a chain of timeouts that stops off screen, on pause, on your first choice and under reduced motion.

## 14. SEO and machine files
- [x] Title and description match live (metadata unchanged)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/extension/`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/extension/page.jsx` keeps its metadata and `<JsonLd route="/extension" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a (the stack is the Morph target for /download's card)
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a. /extension is a launch page with no model cards or prices.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code to copy on this page
- ~~Config blocks parse on their own~~ n/a
- [x] Terminal pauses and ends on a static frame (the stack's walk pauses and rests on point 01 with your browser in front)
- [x] No hand-typed version number (v1.9.31 and the build names are Hanzo's)

Done here: The "Installs from a file" chapter shows the three real build files from Hanzo's releases.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (unknown browser: Chrome is dealt to the front and no row is marked; loading n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors (no live calls)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: With GitHub and hanzo.ai blocked in the sandbox the page renders complete with 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`<Cta>` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/extension.md` (none yet; the neighbours' reviews were applied pre-emptively)

Done here: `data-cta` = extension-download, extension-availability, extension-chat, extension-build-*, extension-docs, extension-repo, extension-deploy, extension-download-end, extension-chat-end.
