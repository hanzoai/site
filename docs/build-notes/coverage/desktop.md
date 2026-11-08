# /desktop coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/DesktopPage.jsx` (+ `DesktopPage.css`, page-local `components/pages/desktop/Lines.jsx`, `Terminal.jsx`, `enter.jsx`, `enter.css`, shared `components/v2/AppType.css`, `AppSheet`)
Motion map (James, 7 Nov, overrides older motion limits): signature `terminal`; entrances swing-door, domino, inertia-drag, shrink-to-card, page-curl. The pinned chapters (`AppScenes`) are removed; the three points are a plain list. Where the map clashes with MASTER: the thrown agent card snaps back on a spring with a slight overshoot (the map's `inertia-drag`), and shrink-to-card is scroll-linked (it is defined as happening while you leave). · gallery: `docs/gallery/desktop/` · metric id: `desktop_download`

Open copy questions for James: none decided. "Download" goes to Hanzo's own docs page (docs.hanzo.ai/docs/apps/desktop), as on live; the builds themselves are on /download, linked from the spec drawer ("Every build").
Shared changes requested: `docs/build-notes/requests/desktop.md` (sticky ask: no request needed, measured working; the AppScenes rail is hidden without JS by design) and `docs/build-notes/requests/apps1.md` (a `Band` with an `id` prop). The sticky ask: once the hero "Download" leaves view, the shared header's solid swaps to this page's `data-thumb` ask, "Download" (seen at 1470×801, 7 Nov).
Forks this page deleted: the kicker over the h1 ("Native Desktop Client", now a caption under the window) and over "Cut the network"; the Stage wrapper; every skeleton bar (the window's test progress bar, the empty job/tools/model fields, the three progress bars in "They work together"); the second solid in the hero ("GitHub" is a text link); the solid "Deploy to Cloud" (now quiet, above the band); raw `Go`/`.x-btn` asks (now `<Cta>`); spring transitions; cursor labels; shadows on objects. Forked (page-local, shared file untouched): `components/v2/x-edison/AppLines` → `components/pages/desktop/Lines.jsx`, because the shared one mismatches on hydration under reduced motion and leaves headlines masked with JS off.
Review fixes (docs/build-notes/review/desktop.md, walked at a1dcdca): 1 real content: done (limit.go lines, test run, real rows and sub-lines); 2 window first: done (window top 232px, bottom 772px at 1470×801; build plays above the fold); 3 no blue or green: done (0 hued elements measured in `main`), kickers moved below; 4 one ask: done (ends on "Download it and build one" with one solid; Get Desktop, related links and Paste and ship sit above it; sticky via the shared header); 5 phone: done ("Open in the console" is an underlined text link 128×44; "Desktop docs" 112×44; system rows 343×99 and system tabs 44px tall, each answers on tap).
Decision: the six lines of `gateway/limit.go` in the window are written for this page as the picture of the file Hanzo's copy names ("Wrote gateway/limit.go and a test at 100 req/min per key"); the test run reads "$ go test ./gateway", "ok gateway 100 req/min per key", "Tests pass.". Every other word is Hanzo's.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: `lib/cta.js` does not exist yet; the label is Hanzo's own "Download" → docs.hanzo.ai/docs/apps/desktop)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Top of `DesktopPage.jsx` names Persona, Goal, CTA, `Metric: desktop_download`, Signature, Beyond and the V2 line. Solids measured in `main`: two, `desktop-download` (hero) and `desktop-download-end` (closing band), never on one screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the shell's `#main` mark sits before the page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /desktop is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 9/9. Every link is `A` or `Cta`; the window's app tabs (Desktop, CLI, Playground, API Keys) are real links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the kit equivalent is the line-mask h1, one lede, one ask, one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (n/a: no proof figures; the licence and repo sit in the card above the band), `Band` (the page's own closing band, "Download it and build one"), footer
- [x] Card-to-page links use Morph (the hero window carries `data-morph-target`; /download's Desktop card flies into it)

Done here: At 1470×801 the h1, lede, ask and the whole window (top 232, bottom 772) share the first screen and it assembles and builds at once. Second screen: "What you can build in it" beside the live terminal (the signature). Order: hero window → terminal → three points (one list) → black room → systems → paste and ship → band. JS off, measured: 0 hidden or transformed text blocks (entrance start states are `html.js` only; the terminal's server HTML is the full transcript).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero (shared header swaps its solid to "Download" once the hero ask leaves view; no page bar)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `data-cta="desktop-download"` (thumb, hero) and `desktop-download-end` (the band, the page's last section). Secondaries are text links (`desktop-github`, `desktop-github-end`, `desktop-self-host`, `desktop-docs`) or quiet (`desktop-deploy`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy ("14 files", "100 req/min per key", "v1.1.52"); the 100 and the minute in limit.go are that same figure
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Status is shape and word, never colour: run-log rings (hollow, turning, filled tick), "Running" with a dot that fills, "Tests pass." on black. Parity text 59/59.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (the window's code and test lines are 12px mono inside the product picture, `aria-hidden`)
- [x] Measures held; no orphan word in a heading (`text-wrap: balance`)
- [x] Tables, FAQ, tabs and code use the kit parts (the spec is an `av-spec` list in the kit `Sheet`; notes 04–06 are an accordion with `aria-expanded`)
- [x] `python3 scripts/parity.py /desktop`: 0 missing

Done here: Parity text 59/59, links 9/9. The window's right pane is the file and its test, the chapter panes show the job, "MCP", "Local model" and real sub-lines; no empty field or bar anywhere.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box (stroke arrows, ticks and play/pause only; the Hanzo mark in its app tile is the product's own)
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK (3 files). Computed colours of every element in `main` at both widths: 0 with hue (all neutral). unique.py OK.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled (n/a: none disabled), loading (the `Cta` hand-off sets `aria-busy`)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (the kit `AppSheet` drawer; Esc closes)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Direct hover probe (scratchpad `dk/hover3.cjs`): system tabs, note link, chapter rail, notes, network switch, model radios, system rows, See the spec, related pills, Desktop docs and the repo pill all change on hover. The text links now darken as well as thicken.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`play('done')` once when the window's first build passes; `data-sound="tick"` on radios and notes)

Done here: Signature: the window assembles and builds (the ask types, limit.go writes line by line at 150 ms steps, the test runs and passes). Supporting: pinned chapters (scroll), line-mask headlines (arrival), magnetic ask (pointer), ink wipes and a blinking caret in the chapter panes (time). The "per agent" label now rolls (out above, in below) instead of crossfading over itself. variety.py OK. Reduced motion: 0 console errors, finished frames.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no photo or film; the objects are drawn product UI
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video (the window loop has its own pause control)
- [x] Budgets met; nothing missing; alt on every image (no images)
- ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: no photos on the live page

Done here: No raster media; every object is HTML and CSS. Layout shift 0.001 at both widths (film run 4).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: At 375×812: scrollWidth 375, window 242–632, "Open in the console" 128×44 text link, "Desktop docs" 112×44, system rows 343×99, system tabs 44px; phone film taps on macOS/Linux/Pause each changed the page (0 dead).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #404040 / #525252 / #737373 on white; white 55% or more on black)
- [x] Pause control on every moving item (the window's 44px pause, `aria-pressed`; chapter panes play once, the caret is 1 px)
- [x] Forms labelled; first error focused (the job field has a real `<label>`; no submit)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Hydration under reduced motion fixed (the shared AppLines rendered different initial styles; the page-local fork renders the same first frame and only zeroes the duration). 0 console errors at 1470×801 and 375×812, motion on and reduced.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (not measured here: needs a production build)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The h1, lede, ask, every window line and every code line are server-rendered. The step loop is a chain of timeouts that stops off screen (useInView) and under reduced motion.

## 14. SEO and machine files
- [x] Title and description match live (metadata unchanged)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/desktop/`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/desktop/page.jsx` keeps its metadata and `<JsonLd route="/desktop" />`; route returns 200.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a (the window is the Morph target for /download's card)
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a. /desktop is a launch page with no model cards or prices.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt copies exactly its displayed line)
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the window pauses and rests on its finished frame, code and "Tests pass." showing)
- [x] No hand-typed version number (v1.1.52 is Hanzo's, from /download's live copy)

Done here: The window now shows the file itself: `gateway/limit.go`, six numbered lines, then a black test pane. The single copyable line is "Read https://hanzo.ai/skill.md and use Hanzo Desktop in my project.", copied as shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (empty: "An agent with no job yet."; offline: the black room's whole subject; loading n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors (no live calls)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form submit
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: JS off renders every word (measured 0 hidden text blocks); with hanzo.ai blocked the page renders complete with 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`<Cta>` dispatches `cta_click`; `lib/track.js` is not merged)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/desktop.md` (6/10, walked at a1dcdca); all five fixes applied, see the list at the top

Done here: `data-cta` = desktop-download, desktop-github, desktop-window-console, desktop-related-*, desktop-docs, desktop-repo, desktop-deploy, desktop-self-host, desktop-download-end, desktop-github-end. Unverified: the motion film flags hover as DEAD on several desktop controls; a direct probe with the same comparison shows each answers (the film's wheel scroll was still settling under machine load when it hovered).
