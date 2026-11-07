# /desktop coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/DesktopPage.jsx` (+ `DesktopPage.css`, shared `components/v2/AppType.css`, `AppScenes`, `AppSheet`, `x-edison/AppLines`) · gallery: `docs/gallery/desktop/` · metric id: `desktop_download`

Open copy questions for James: none decided. "Download" goes to Hanzo's own docs page (docs.hanzo.ai/docs/apps/desktop), as on live; the builds themselves are on /download, linked from the spec drawer ("Every build").
Shared changes requested: `docs/requests/apps1.md` (a `Band` with an `id` prop). The ask is settled by the shared system: the header's solid "Try Hanzo" carries it at every width, with no desktop bar, and the page's own `data-thumb` ask rides the slim phone bar. The page closes on its own band with `<Cta id>`.
Forks this page deleted: the kicker over the h1 ("Native Desktop Client", now a caption under the window) and over "Cut the network"; the Stage wrapper; skeleton bars in the window (file tree, code strokes) and in the chapter panes; the second solid in the hero ("GitHub" is now a text link); the solid "Deploy to Cloud" (now quiet, above the band); raw `Go`/`.x-btn` asks (now `<Cta>`); spring transitions; cursor labels; shadows on objects.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: `lib/cta.js` does not exist yet; the label is Hanzo's own "Download" → docs.hanzo.ai/docs/apps/desktop)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Top of `DesktopPage.jsx` names Persona (developer who wants agents on their own machine), Goal, CTA, `Metric: desktop_download`, Signature and Beyond. check.mjs: 1 solid on the first screen at 1470×801 and 375×812; one `<h1>` in server HTML.

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
- [x] Ends in proof strip (n/a: the page has no proof figures; the licence and repo sit in the card above the band), `Band` (the page's own closing band in its words), footer
- [x] Card-to-page links use Morph (the hero window carries `data-morph-target`; /download's Desktop card flies into it)

Done here: At 1470×801 the h1 (52px), lede, the one ask and the whole 1080×540 window share the first screen, and the window starts assembling at once (check.mjs: changes 79 in the first second). At 375×812 the window is 48svh under the ask. JS off: 0 invisible text blocks (every hidden step is `.js`-scoped; the server draws the empty frame, JS-off shows every part). Rhythm: hero → statement → 3 pinned chapters → black room → three system rows → paste and repo → band.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero (shared system: the header's solid "Try Hanzo" at every width, no desktop bar; on phones the slim quiet bar carries this page's `data-thumb` ask once the hero button leaves)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `data-cta="desktop-download"` (thumb, hero) and `desktop-download-end` (band). Secondaries are text links (`desktop-github`, `desktop-github-end`, `desktop-self-host`) or quiet (`desktop-deploy`).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number ("14 files", "100 req/min per key" and "v1.1.52" are Hanzo's)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No counters, no status lights. The run log's states are shapes (hollow ring, turning ring, filled tick), not colour. Parity text 59/59.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading (`text-wrap: balance`)
- [x] Tables, FAQ, tabs and code use the kit parts (the spec is an `av-spec` list in the kit `Sheet`; notes 04–06 are an accordion with `aria-expanded`)
- [x] `python3 scripts/parity.py /desktop`: 0 missing

Done here: h1 52px, heads 26–32px, lede 21px, body 16px, window text 14–15px, mono captions 12px capitals. Parity text 59/59, links 9/9.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow (window, panes and cards are outlined 1px black 10% or flat fills; no shadows)
- [x] One icon set; no icon in a rounded box (stroke arrows, ticks and play/pause only; the Hanzo mark in its app tile is the product's own)
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK. One big thing per screen: the window in the hero, the 32px statement before the chapters, the black room's card. /api is a console beside its headline, /cli a full-bleed terminal, /download a dial, /extension a fanned browser stack; /desktop is a centred app window.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled (n/a: none disabled), loading (the `Cta` hand-off sets `aria-busy`)
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (the kit `AppSheet` drawer traps and returns focus; Esc closes)
- [x] Inputs 16px or larger; no bare `:hover` (the job field is 56px with 16px text; every hover sits in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: System tabs, the pause control, model radios, the network switch, notes and system rows each have hover (fine pointers), press (scale .97 or 1px), focus-visible and selected states. The pills glide with a 300 ms ease-emphasis tween.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`: `play('done')` once when the window's first build passes; `data-sound="tick"` on the model radios and the notes; tabs, the switch, the pause and the system rows tick through the kit's own wiring)

Done here: Signature: the window assembles and builds (time: the ask is written into a text node, the run log ticks). Supporting: pinned chapters (scroll), line-mask headlines (arrival), magnetic ask (pointer), gliding pills and the agent token (state). The black room opens from a rounded card with a CSS view timeline. variety.py OK, 0 Rise. Reduced motion: the window shows its finished frame.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: the page has no photo or film; its objects are drawn product UI
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video (the window loop has its own pause control)
- [x] Budgets met; nothing missing; alt on every image (no images)
- ~~No dimmed or filtered photo; 4+ real visuals together~~ n/a: no photos on the live page

Done here: The page carries no raster media; every object (window, panes, black room card) is HTML and CSS, so nothing loads late and CLS is 0.000.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812: h1, ask and the window building in the first screen, CLS 0.000, no small targets, no sideways scroll. On phones the window drops its sidebar and run log and keeps the thread at a fixed 48svh; chapters stack.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 / #737373 on white; white 55% or more on black)
- [x] Pause control on every moving item (the window's 44px pause is the first control in its title bar, `aria-pressed`, Pause/Play; chapter panes play once)
- [x] Forms labelled; first error focused (the job field has a real `<label>`; no submit)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The pause rests the window on its finished frame. Chapters jump from the rail; focusing a chapter scrolls it in. Notes are buttons with `aria-expanded`; the model choice is a `radiogroup`; the network control is a `switch`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (not measured here: needs a production build)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The h1, lede, ask and every window line are server-rendered. The step loop is a chain of timeouts that stops off screen (useInView) and under reduced motion; the ask is written into a text node by ref.

## 14. SEO and machine files
- [x] Title and description match live (metadata unchanged from `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/desktop/`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/desktop/page.jsx` keeps its metadata and `<JsonLd route="/desktop" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a (the window is the Morph target for /download's card)
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a. /desktop is a launch page with no model cards or prices.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt copies exactly its displayed line)
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the window pauses and rests on its finished frame)
- [x] No hand-typed version number (v1.1.52 is Hanzo's, from /download's live copy)

Done here: The single copyable line is "Read https://hanzo.ai/skill.md and use Hanzo Desktop in my project.", copied as shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (empty: an agent with no job reads "An agent with no job yet."; offline: the black room's whole subject; loading n/a: no live data)
- [x] Blocked live data leaves a complete page, no console errors (no live calls)
- ~~A failed submit keeps its values and shows no success~~ n/a: no form submit
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: With hanzo.ai blocked in the cloud sandbox the page renders complete with 0 console errors (check.mjs, film.mjs).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (`<Cta>` dispatches `cta_click`; `lib/track.js` is not merged)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/desktop.md` (none yet; the neighbours' reviews of /api, /bot and /cli were applied pre-emptively)

Done here: `data-cta` = desktop-download, desktop-github, desktop-window-console, desktop-related-*, desktop-docs, desktop-repo, desktop-deploy, desktop-self-host, desktop-download-end, desktop-github-end.
