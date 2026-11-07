# /ui coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/UiPage.jsx` (+ `UiPage.css`) · gallery: `docs/gallery/ui/` · metric id: `install_copy`

Open copy questions for James: board demo labels not in `content/ui-strings.json` ("Field", "Panel", "Options ▾", "@hanzo/design tokens", "--radius", "--density", the accent names graphite/steel/silver, "Tab", "/ 45"); the chapter board reuses Hanzo's own phrases from the page ("one atomic stylesheet", the three product names, the `npx` line) as its labels.
Shared changes requested (`docs/requests/ui.md`): on phones (≤ 700px) the shared header keeps a solid "Try Hanzo" for the whole page, and the shared phone bar (`Ask.jsx`) shows "GitHub →" only where nothing sits under it, so it is rarely on screen on this page. Asked for: let the header carry the page's own `data-thumb` ask on phones, as it does on desktop. Until then the page's GitHub asks are outlined on phones, so one solid shows per screen. Also noted: `Paste`, `Get` strip and `.w2-cta` are shared (`components/pages/cloud/Frame.jsx`, `components/v2/Scale.css`); this page overrides only `.w2-cta`'s greys to deck values.
Forks this page deleted: the two browser range inputs (now `components/v2/x-gauss/Slider.jsx`), the shared `Code` block in the dark room (now a page terminal whose Copy copies the two shell commands), the floating hero and chapter pauses, the ink accent that made "Ship it" a second black pill, every spring, the shared PinChapters (now one real board the chapters recompose), the "React Component Library" pill with the Enso picture (now a mono caption under the h1, same words), the hero board's 1.02 settle scale (it now settles by lift only, inside the gutters).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "GitHub" → github.com/hanzoai/ui
- [x] One h1; clear in 5 seconds
- [x] No dead button
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
- [x] Ends on one band ("Stop reinventing buttons." with "View on GitHub" beside the board it sells), the paste prompt and Get UI strip under it, then footer
- [x] n/a Morph

Done here: the close is one band: the 64px line, the lede, the ask and `pnpm add`, beside a small board cycling Hanzo's three products; Paste and Get UI sit under it as quiet proof. JS off: every word is in the HTML (gate hidden 0).

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

Done here: parity `text 59/59 links 2/2`.

## 7. Visual design system
- [x] `taste.py` passes (0 hues); page greys are deck values (#f5f5f5, #737373, #a3a3a3, #262626, #171717, #0a0a0a)
- [x] No label above a headline
- [x] Tiles flat; the board and token panel are one stage
- [x] One icon set
- [x] Differs from neighbours: a live component board with a token panel; chapters recompose the board's body

Done here: gate hues []; the off-deck #f5f5f7, #86868b, #1d1d20, #2c2c2e and #0a0a0b are gone from `UiPage.css`, and the shared `.w2-cta` hover (#2c2c2e) is overridden to #262626 on this page.

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press on every control: board buttons, chips and the hero/close asks .98, chapter numbers and swatches .97, "Deploy to Cloud" translateY(1px)
- [x] The board's Dialog moves focus in, keeps Tab inside, closes on Esc and returns focus to "Ship it" (`aria-modal`)
- [x] The DropdownMenu takes arrow keys and Esc; the swatches are one tab stop with arrows
- [x] Hover says something: a swatch under the pointer or focus names its token and value ("graphite #404040"); a chapter number under the pointer previews its chapter on the board
- [x] Forks deleted: listed above

Done here: sliders are drawn (`role="slider"`, arrows, Page keys, Home/End, drag) with a hover ring.

## 9. Motion and interaction
- [x] Signature (the board that uses itself), supporting: Settle (lift), the chapter board (sticky; the chapter in the middle of the screen recomposes it), magnetic; 0 fade-ups
- [x] Idle (board; chapter board: 01 tags on the parts with the menu and Dialog, 02 the Tab key pressing as the ring walks, 03 the radius as a 64px+ readout retuning, 04 the same parts laid out as chat, console and cloud, 05 the stylesheet filling 45 cells, 06 the three products lit in turn), time (the init room types once; "60" counts once), state (dialog, menu, tokens), pointer (sliders, magnetic, chapter preview), arrival (h1)
- [x] Moves without input; every control answers
- [x] Reduced motion: the init room shows its full text and "60" as is; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK; "Ship it" renders in the Hello() card when `return <Button>` is typed.

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

Done here: on phone the chapters are a swipe rail (`scroll-snap-type: x proximity`, 16% peek) under the board, which is not sticky; the board's body is a fixed 268px so the board and its chapter card fit one 812px screen together.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: "Hello()" #525252 on #f5f5f5; terminal comments #a3a3a3 on #0f0f0f
- [x] Pause in the token panel bar, the terminal bar and the chapter section's head row; the chapter and closing boards are `inert` and `aria-hidden` (the words are in the list and the band)
- [x] Field labelled
- [x] One h1; h2 order
- [x] Keyboard reaches every control; the terminal is a focusable labelled region

Done here: dialog focus is trapped and returned.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island; the chapter board's body has a fixed height per width, so recomposing never moves the page (CLS 0.0035 at 1470 and 0.0063 at 375 over a full walk).

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

Done here: 0 console errors on 6 cold loads (3 at 1470×801, 3 at 375×812). The earlier critic saw one hydration-mismatch on 1 of 6 cold loads; nothing in this page's render differs between server and client (no Date, random or window reads in render), so if it recurs it comes from shared parts (Settle, LineMask, usePause, the header); unverified.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `UiPage.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 7/10; its fixes 1–6 addressed (card made true, phone one solid, chapters recompose the board, "60" figure and closing band, the board wakes in 1 s, presses and hover labels, deck greys, proximity rail, no wrap at 375). Fresh critic pending.
