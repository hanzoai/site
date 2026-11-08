# /ui coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/UiPage.jsx` (+ `UiPage.css`) · gallery: `docs/gallery/ui/` · metric id: `install_copy`

Open copy questions for James: board demo labels not in `content/ui-strings.json` ("Field", "Panel", "Options ▾", "@hanzo/design tokens", "--radius", "--density", the accent names graphite/steel/silver, "Tab", "/ 45"); the chapter board reuses Hanzo's own phrases from the page ("one atomic stylesheet", the three product names, the `npx` line) as its labels.
Shared changes requested (`docs/build-notes/requests/ui.md`): on phones (≤ 700px) the shared header keeps a solid "Try Hanzo" for the whole page, and the shared phone bar (`Ask.jsx`) shows "GitHub →" only where nothing sits under it, so it is rarely on screen on this page. Asked for: let the header carry the page's own `data-thumb` ask on phones, as it does on desktop. Until then the page's GitHub asks are outlined on phones, so one solid shows per screen. Also noted: `Paste`, `Get` strip and `.w2-cta` are shared (`components/pages/cloud/Frame.jsx`, `components/v2/Scale.css`); this page overrides only `.w2-cta`'s greys to deck values.
Forks this page deleted: the two browser range inputs (now `components/v2/x-gauss/Slider.jsx`), the shared `Code` block in the dark room (now a page terminal whose Copy copies the two shell commands), the floating hero and chapter pauses, the ink accent that made "Ship it" a second black pill, every spring, the shared PinChapters (now one real board the chapters recompose), the "React Component Library" pill with the Enso picture (now a mono caption under the h1, same words), the hero board's 1.02 settle scale (it now settles by lift only, inside the gutters).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "GitHub" → github.com/hanzoai/ui
- [x] One h1; clear in 5 seconds
- [x] No dead button: the rendered "Ship it" in the Hello() card answers a press (a tick lands beside it, `aria-pressed`, and the card rings once for 1.8 s)
- [x] Copy questions listed

Done here: desktop (> 700px): the hero "GitHub" is the one solid while it is on screen (the shared header's ask goes quiet), then the header carries "GitHub", and at the close "View on GitHub" is the one solid. Phone (≤ 700px): the shared header keeps its solid "Try Hanzo", so the page's "GitHub" and "View on GitHub" are outlines (`@media (max-width: 700px)` in `UiPage.css`): one solid per screen, shared request filed above. The board's accents are deck greys (#404040, #525252, #737373).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared)
- [x] Every link through `A`
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s: the board's first act (the DropdownMenu opens, the ring lands on Options) fires 600 ms after the board is seen; measured open at 1.0 s after load at both widths. Then a 1.5 s rhythm: idle, Dialog, idle, token retune.
- [x] h1 CSS cut-in painted by the server; "React Component Library" sits under the h1
- [x] JS off legible
- [x] Board hero → six chapters, each recomposing one sticky board → dark init room with the "60" figure → closing band
- [x] Proof first, then the page ends on one band ("Stop reinventing buttons." with "View on GitHub" beside the board it sells), then the footer
- [x] n/a Morph

Done here: the paste prompt (on paper, hairline, no black card) and the Get UI strip come first, then the close is one band: the 64px line, the lede, the ask and `pnpm add`, beside the hero board itself settled small (its tokens at rest, one product row lit at a time); measured h2 order in the section: "Get UI", "Stop reinventing buttons.". JS off: every word is in the HTML (gate hidden 0).

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "GitHub" in the header on desktop; on phone see part 1 (shared request)
- [x] Copy copies exactly the two `npx` commands (no `#` lines, no JSX)
- [x] `data-cta` and `data-thumb` on both primaries

Done here: `ui.hero` and `ui.close` (both `data-thumb="GitHub"`).

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] "8 stars", "in production" rows and "60 seconds" are Hanzo's
- [x] n/a marquees
- [x] n/a submit

Done here: production rows are Hanzo's three named products; "60" counts up once and rests on Hanzo's value (the HTML carries 60).

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+
- [x] "in production" and "every Hanzo dashboard" never wrap at 375 (tighter row padding, `nowrap` on the name)
- [x] The code is Hanzo's text, line for line
- [x] `parity.py /ui`: 0 missing

Done here: parity `text 59/59 links 2/2`. The h1 has no `white-space: nowrap` (measured `normal`).

## 7. Visual design system
- [x] `taste.py` passes (0 hues); page greys are deck values (#f5f5f5, #737373, #a3a3a3, #262626, #171717, #0a0a0a)
- [x] No label above a headline
- [x] Tiles flat, one surface each: no tray behind the hero (the board is paper with a hairline, the token panel a flat #f5f5f5 tile) and none behind the closing board
- [x] One icon set
- [x] Differs from neighbours: a live component board with a token panel; chapters recompose the board's body

Done here: gate hues []; the off-deck #f5f5f7, #86868b, #1d1d20, #2c2c2e and #0a0a0b are gone from `UiPage.css`, and the shared `.w2-cta` hover (#2c2c2e) is overridden to #262626 on this page.

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press on every control: board buttons, chips and the hero/close asks .98, chapter numbers and swatches .97, "Deploy to Cloud" translateY(1px)
- [x] The board's Dialog, when the visitor opens it ("Ship it"), moves focus in, keeps Tab inside, closes on Esc and returns focus to "Ship it" (`aria-modal`). The self-running script never takes focus: it holds while focus is anywhere on the hero stage and puts away anything it had open, so a Tab crawl runs Ship it → Options ▾ → Field → Pause → swatch → --radius → --density and on (measured at 600 ms per press, the Dialog never opened)
- [x] The DropdownMenu takes arrow keys and Esc; the swatches are one tab stop with arrows
- [x] Hover says something: a swatch under the pointer or focus names its token and value ("graphite #404040"); a chapter number under the pointer previews its chapter on the board
- [x] Forks deleted: listed above

Done here: sliders are drawn (`role="slider"`, arrows, Page keys, Home/End, drag) with a hover ring.

## 9. Motion and interaction
- [x] Signature (MOTION-MAP `magnet-grid`): a 12×4 field (6×4 on phones) of the library's parts right after the hero bends toward the cursor and ripples out from a click or tap; one rAF loop that runs only while the field is on screen and something moves; a quiet ripple starts itself after 3.5 s without a pointer. Reduced motion: still. The hero keeps the board that uses itself and the page-local Stage lift.
- [x] Entrances (MOTION-MAP, in order, each its own code in `components/pages/apps/ui/Motion.*`): accordion (the grid's rows unfold from a top hinge, 110 ms apart), page-curl (the paper above the dark init room peels off from its bottom-left corner, a grey flap along the fold), magnet-gather (the six chapter cards start scattered and rotated and are pulled into place), cursor-trail (fine pointers: a cursor sweeps the paste and Get UI strip once, uncovering it behind a ten-dot trail, then the trail follows the visitor's cursor; touch shows it at rest), zoom-through (the closing band flies in from 720px behind the screen). All under `html.js`; JS off and reduced motion show the final state.
- [x] No pinned chapter scene: the six chapters are cards, each with its own small board in that chapter's state, running only while on screen. Order: hero → grid → dark init room → chapters → paste/Get UI → closing band.
- [x] Idle (hero board, grid ripples, chapter boards), time (the init room types once; "60" counts once), state (dialog, menu, tokens), pointer (grid magnet, sliders, magnetic ask, cursor trail), arrival (h1, five entrances)
- [x] Reduced motion: the init room shows its full text and "60" as is; entrances show their final state; no springs
- [x] n/a sound (shared kit)

Done here: Playwright at 1470×801 and 375×812 (and reduced motion at 1470): every entrance's section gets `data-in` and plays (mid and settled screenshots), the grid moved 48 of 48 tiles under a pointer and rippled on click, a 45-press Tab crawl passed the hero, grid (not focusable) and chapters without a trap, 0 console errors, no horizontal scroll, CLS 0.0011 / 0.0024 / 0.0003. `variety.py` OK.

## 10. Media
- [x] n/a images
- [x] n/a video
- [x] n/a sizes
- [x] n/a photos

Done here: no media; the page's objects are the live component boards and the terminal.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: on phone the six chapter cards stack one per screen, each board's body a fixed 300px with its heading under it; the grid drops to 6 columns. The closing board's body takes its own height, so its third product row is whole.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: "Hello()" #525252 on #f5f5f5; terminal comments #a3a3a3 on #0f0f0f
- [x] Pause in the token panel bar, the terminal bar and the chapter section's head row; the chapter and closing boards are `inert` and `aria-hidden` (the words are in the list and the band)
- [x] Field labelled
- [x] One h1; h2 order
- [x] Keyboard reaches every control; the terminal is a focusable labelled region

Done here: dialog focus is trapped and returned only for a Dialog the visitor opened; the script's own Dialog is never a trap.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island; the chapter board's body has a fixed height per width, so recomposing never moves the page (CLS 0.0020 at 1470 and 0.0020 at 375 over a full walk).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/ui" />`
- [x] n/a cards

Done here: `app/ui/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 16. Developer experience
- [x] One terminal block; Copy equals the two commands shown
- [x] n/a config blocks
- [x] The terminal pauses (in its bar) and ends on its full text
- [x] No hand-typed version

Done here: `pnpm add @hanzo/ui` has its own Copy at the close.

## 17. States and resilience
- [x] n/a live data
- [x] Blocked network: complete page
- [x] n/a submit
- [x] n/a

Done here: 0 console errors on 8 cold loads waiting for load before any screenshot: 1 normal and 3 reduced-motion at 1470×801, the same at 375×812. The reduced-motion hydration mismatch came from the shared `Settle` (it reads `useReducedMotion()` during render); /ui now uses a page-local Stage instead, and the shared fix is requested in `docs/build-notes/requests/ui.md`.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `UiPage.jsx`
- [x] Review read: Ready line in docs/build-notes/review/ui.md

Done here: Ready 7 Nov (James's bar: holds up next to /api and /affiliate, no score). Round-4 fixes all hold on the rebuilt page (no keyboard trap: a 30-press Tab crawl goes Ship it, Options, Field, Pause, swatch, sliders with no stop on Close; 0 errors under reduced motion; Ship it answers; no repeated board; ends on the band; the title bar names an app only in chapter 04). This pass: the h1 sits about 35px higher (hero padding 40-52px), so the whole board fits the 801 first screen; Hello()'s button lands in a fixed outlined slot, so the card is never empty and nothing moves when it renders.
