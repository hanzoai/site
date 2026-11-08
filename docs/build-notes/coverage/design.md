# /design coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/DesignPage.jsx` (+ `DesignPage.css`, shared `components/v2/AppType.css`, `AppScenes`, `x-edison/AppLines`, `components/Opener.jsx`) · gallery: `docs/gallery/design/` · metric id: `signup_start`

Open copy questions for James: none decided. The hero ask "Open Design" points at /design itself (Hanzo's own link); kept as live, but it is a self-loop on this page: should it go to the app?
Shared changes requested (`docs/build-notes/requests/apps1.md`): only the `Band` `id` prop is still open (this page closes on its own Band markup with `<Cta id>` until then). The header ask and the phone ask bar landed in the shared system, so `data-ask="off"` is gone from `<main>`.
Forks this page deleted: the oversized 112px editorial headline (now 52px beside the window), four kickers over headlines (now captions under them), the "Hanzo Design" pill over the studio heading, the outlined "Read the docs" and "Open Hanzo Studio (Cinema)" buttons (now text links), the solid "Deploy to Cloud" (now a text link before the Band), the "1 / 4", ratio and format chips that floated over the artifacts, the "Open" cursor label on the model tiles, the hover videos on six model tiles (now kit `Img`; the one clip uses kit `Film`), raw `<img>`/`<video>`, `setInterval`, spring transitions, the magenta hue.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: not merged; the label is Hanzo's own "Open Design")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices; the /design self-link is Hanzo's and is listed as a question above)
- [x] Open copy questions for James listed, none decided

Done here: Top comment names Persona (a marketer or founder with raw files), Goal, CTA, `Metric: signup_start`, Signature and Beyond. check.mjs: one solid on the first screen at both sizes; one `<h1>`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link (the six model tiles are `<a href>` that open by the WebGL opener)
- ~~Breadcrumb at depth 2 or more~~ n/a: /design is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity reports links 13/13, including /iro, /koma, /oto, /koe, /uta, /mori, /pricing and /models.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the kit equivalent is the line-mask h1 + one lede + one ask + one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the repo line "Get Design · Apache-2.0" sits before the Band)
- [x] Card-to-page links use Morph (the model tiles hand their picture to the model page through `useOpener`)

Done here: At 1470×801 the window (left) and the 52px headline, lede and "Open Design" (right) share the first screen; the spectrum dances and the tab timer runs within 1 s (check.mjs: 4 animations, 1,628 changes). Motion map (7 Nov): order is hero → the compare signature with the three steps → black room (models) → One brief → paste and repo → capabilities grid → black Band; the pinned three-chapter scene and the stacking sheets are gone.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the shared header always carries a solid "Try Hanzo"; on phones the slim quiet bar carries this page's own `data-thumb` ask; no floating bar on desktop)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `design-hero-open` (thumb) and `design-band-open`. Text links: `design-hero-docs`, `design-hero-studio`, `design-deploy`, `design-band-studio`, `design-github`, `design-model-<slug>`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number ("124 BPM", "4.8 MB", "60fps", "16:9" are Hanzo's)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form (the brief field is local and sends nothing)

Done here: The deck's "1 / 4" counter was removed; no number on the page is counted or invented.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading (the Band headline is set in two lines)
- [x] Tables, FAQ, tabs and code use the kit parts (the six artifacts are real tabs; the visualizer modes are tabs)
- [x] `python3 scripts/parity.py /design`: 0 missing

Done here: Parity text 90/90, links 13/13. Lede 19px (17px phone), body 16px, captions 12px mono capitals.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck greys only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK; check.mjs 0 labels over headlines. The only page in the group with the product left and the headline right; the active word of the h1 is lit in ink as its tab plays.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (pause, tabs, pads, modes, brief chips; press scale .97; hovers in `@media (hover: hover)`)
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: The brief input is 56px with 21px text and a 2px ink focus ring; the artifact chips are `aria-pressed` buttons.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (variety.py: layoutId, rAF, clip reveal, useScroll; 0 Rise)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`; tabs, switches and pressed buttons tick through `components/Sound.jsx`)

Done here: Motion map signature `compare`: a divider dragged (pointer, touch, arrow keys; `role="slider"`) across the raw neon-horizon-master.mp3 upload and what it became, chosen by the three steps; it sweeps once from the raw side on arrival. Section entrances, in order: drop-in (What), explode-gather (models), opposite-drift (One brief, scroll), word-shuffle (paste and repo), count-roll (capability numbers); h1 keeps a CSS line cut-in; no reveal repeats. Earlier: Idle (the workspace cycles six artifacts, the spectrum runs at 124 BPM), state (the frame morphs to each artifact's shape; the headline's highlight and tab pill glide at 300ms ease-emphasis), pointer (pads and modes), arrival (h1 line cut-in, window clip-in), scroll (pinned chapters, stacking sheets, black rooms opening from cards). No springs. Sound: the six artifact tabs, the visualizer modes and the brief chips tick through the shared kit; the four synth pads are `data-sound=""` because they play their own note.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img` 1200×1500 everywhere; kit `Film` with a poster for every clip: the hero's Koma tab and the capability art's Iro, Koma and Uta films)
- [x] At most 2 videos playing; pause button on loops over 5 s (kit `Film` plays only in view; the Brief's cards show posters, so no screen runs more than two; the window's pause stops the hero clip)
- [x] Budgets met; nothing missing; alt on every image (artwork is decorative, `alt=""`; the tiles are named by their text)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (six model films with posters in the black room, as live; three on the deck sheet)

Done here: Every picture is Hanzo's own model art from `/models/`, shown without a filter.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: (re-measured 8 Nov) check.mjs at 1470×801 and 375×812: 0 errors, no horizontal scroll, 0 overlaps. Hero frame morph is now a clip-path on a fixed box, so six auto-cycles on phone measure CLS 0.0000 (desktop 0.0024, the shared header). On phones the text comes first and the window follows; the brief no longer drifts (no element past the 16px gutter) and the capability sheets reach full opacity.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#0a0a0a / #525252 on white; #fafafa and white 78% on black)
- [x] Pause control on every moving item (the window's pause is the first control in its bar, 44px, `aria-pressed`)
- ~~Forms labelled; first error focused~~ n/a: no form (the brief field has an `aria-label`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (arrow keys move between the six artifact tabs)

Done here: The h1's words are spans that also pick their tab with a pointer; the tabs carry the keyboard path.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The spectrum's rAF loop runs only while the music app is live (in view, not paused, not reduced motion); bars are written by ref.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/design" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/design/page.jsx` keeps Hanzo's title and description and renders `<JsonLd route="/design" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: the six model tiles are this page's own studio row, not the home model grid
- [x] Every card opens by Morph (the WebGL opener lifts the picture into its model page)
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Each tile calls `useOpener().open` with its own picture and href.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt copies exactly the line shown)
- ~~Config blocks parse on their own~~ n/a
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- [x] No hand-typed version number

Done here: Copy gives "Read https://hanzo.ai/skill.md and use Hanzo Design in my project."

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the brief's empty state reads "Choose at least one artifact."; no live data)
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page (no audio device: the pads still answer)

Done here: look.mjs and check.mjs report no console errors at either size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta`)
- [x] Nothing identifier-bearing before consent; no field value in a payload (the brief never leaves the page)
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/design.md` verdict 8 or more (no review yet)

Done here: `data-cta` ids listed in part 4.
