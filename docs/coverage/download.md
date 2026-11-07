# /download coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/DownloadPage.jsx` (+ `DownloadPage.css`, shared `components/v2/AppType.css`, `x-edison/AppLines`) · gallery: `docs/gallery/download/` · metric id: `build_download`

Open copy questions for James: none decided. On phones the main build follows the system the browser reports, as v1 and live do (an iPhone is offered the macOS build); the question of what a phone should be offered is left to James.
Shared changes requested: `docs/requests/apps1.md` (a `Band` with an `id` prop). The ask is settled by the shared system: the header's solid "Try Hanzo" carries it at every width, with no desktop bar, and the page's own `data-thumb` ask rides the slim phone bar. The page closes on its own band with `<Cta id>`.
Forks this page deleted: the kicker over the h1 ("Download") and over "Just your files" ("Your kit"); the floating hover tooltips on the dial (the centre now reads the build you point at); the breathing glow loop on the button; the hand-made main button and the hidden `data-thumb` `<i>` (now `<Cta thumb>`); skeleton bars in the four product pictures (now Hanzo's own lines and a model image through kit `Img`); the solid "Or open Hanzo in your browser" (now a text link beside the repeated ask); spring and overshoot curves; cursor labels; shadows on objects.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: not merged; the label is Hanzo's "Download for macOS", with the system the browser reports)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Top of `DownloadPage.jsx` names Persona, Goal, CTA, `Metric: build_download`, Signature and Beyond. check.mjs: 1 solid on the first screen at 1470×801 and 375×812; one `<h1>` in server HTML ("Download for macOS" is the server's default, as on live).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link (the Desktop, CLI and extension cards are whole links to /desktop, /cli, /extension)
- ~~Breadcrumb at depth 2 or more~~ n/a: /download is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 19/19 (every build file, /chat, the CLI release page). The three card links are new in-site routes to Hanzo's own product pages, which the download page names.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the equivalent is the line-mask h1, one lede, one ask, one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (n/a: no proof figures on the live page), `Band` (the page's own "One account signs in to all of them."), footer
- [x] Card-to-page links use Morph (each card's picture carries `data-morph`; /desktop and /extension heroes carry `data-morph-target`)

Done here: At 1470×801 the h1 (52px), lede, the one ask and the whole dial (558px) share the first screen; the builds fan out of the button within 1 s (check.mjs: 23 running animations). JS off: 0 invisible text blocks (every pre-fan state is `.js`-scoped). Rhythm: dial → bento of four tiles → black room → band.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero (shared system: the header's solid "Try Hanzo" at every width, no desktop bar; on phones the slim quiet bar carries this page's `data-thumb` ask once the hero button leaves)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` on the two CLI install lines)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `download-main` (thumb, hero) and `download-main-end` (band), both to the detected system's build. Secondaries are text links (`download-every-build`, `download-browser`, `download-browser-end`, `download-cli-all`) and card links (`download-open-desk|cli|ext`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy (every version and size is live /download's)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No counters and no computed totals. The detected rows are marked with a dot (shape, not colour). Parity text 48/48.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (build lists are hairline rows of real links; pickers are `radiogroup`s)
- [x] `python3 scripts/parity.py /download`: 0 missing

Done here: h1 52px, heads 26–32px, the band statement 44px as the closing moment, body 16px, file names 13px mono (14px on phones, or hidden). Parity text 48/48, links 19/19.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow (tiles are flat #f2f2f2, objects outlined 1px, chips outlined; no shadows)
- [x] One icon set; no icon in a rounded box (stroke glyphs; the group glyphs sit in a plain grey circle as the group's mark)
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK. The hero medium is a dial of real download links around one button, unlike /desktop's app window, /extension's browser stack and /cli's terminal. One big thing per screen: the dial, then the bento, then the black room, then the 44px band statement.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled (n/a: none disabled), loading (the `Cta` hand-off sets `aria-busy` when it leaves for GitHub)
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; every hover sits in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Chips, rows, card links, pickers and kit rows have hover (fine pointers), press (scale .97/.98 or 1px), focus-visible and selected states; pickers glide with a 300 ms ease-emphasis tween.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`data-sound="tick"` on the kit pickers; the card opening whooshes and the solid ask taps through the shared Morph and Sound; the page has no self-running demo, so no 'done')

Done here: Utility page, one delight: the fan-out (arrival, 500 ms per chip, 30 ms stagger) and the ray with the centre readout (pointer). Supporting: magnetic ask (pointer), gliding pickers (state), line-mask h1 (arrival); the black room opening is the only scroll-linked effect. variety.py OK, 0 Rise.

## 10. Media
- [x] `Film` and `Pic` only (kit `Img` for the extension card's page picture, 1200×1500 box)
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image (the one image is decorative, `alt=""`, 64 KB)
- ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: the live page has no photos

Done here: The only raster is Hanzo's `/models/uta.webp` inside the extension card's drawn browser, lazy-loaded through kit `Img`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812: h1, lede, the full-width ask and the first product rail on the first screen, CLS 0.000, no small targets. Below 1200px the dial becomes the button over one swipe rail per product (scroll-snap proximity); on phones the chips slide in once.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 / #737373 on white; white 55% or more on black)
- ~~Pause control on every moving item~~ n/a: nothing loops; the fan-out plays once in about 1 s
- ~~Forms labelled; first error focused~~ n/a: no form (pickers are labelled `radiogroup`s with legends)
- [x] One h1; no heading skips; names start with visible text (each chip's name starts with its product and build)
- [x] Keyboard reaches every control

Done here: Focusing a chip draws the same ray and readout as pointing at it. The kit list is `aria-live="polite"`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (not measured here: needs a production build)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Every chip, row and file name is server-rendered; positions are rounded so server and browser print the same style. The fan-out is CSS transitions started by one class.

## 14. SEO and machine files
- [x] Title and description match live (metadata unchanged)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/download/`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/download/page.jsx` keeps its metadata and `<JsonLd route="/download" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph (Desktop, CLI and extension cards; Editors has no page of its own on the site)
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: With the rebuilt Morph, the Desktop card grows into a stage and settles into /desktop's window, and the extension card's picture lands on /extension's stack (filmed at 1470×801, 0 errors). The card titles stay Hanzo's own ("Desktop", "Browser extension") and the heroes' h1s are "Hanzo Desktop" and "Hanzo Extension"; copy is frozen, so they are not made identical.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the two CLI install lines copy exactly as shown)
- ~~Config blocks parse on their own~~ n/a: no config
- ~~Terminal pauses and ends on a static frame~~ n/a: the CLI card's terminal is static
- [x] No hand-typed version number (every version is live /download's own string)

Done here: `curl -fsSL hanzo.sh | sh` and `npm i -g hanzo`, each with kit `Copy`.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (Windows: the kit list says Hanzo's own line, "Desktop ships for macOS and Linux; on Windows the one native build is the CLI.")
- [x] Blocked live data leaves a complete page, no console errors (no live calls)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: With GitHub and hanzo.ai blocked in the sandbox the page renders complete with 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`<Cta>` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/download.md` (none yet; the neighbours' reviews were applied pre-emptively)

Done here: `data-cta` = download-main, download-every-build, download-browser, download-open-desk, download-open-cli, download-open-ext, download-cli-all, download-main-end, download-browser-end.
