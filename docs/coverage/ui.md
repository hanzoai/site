# /ui coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/UiPage.jsx` (+ `UiPage.css`) · gallery: `docs/gallery/ui/` · metric id: `install_copy`

Open copy questions for James: board demo labels not in `content/ui-strings.json` ("Field", "Panel", "Options ▾", "@hanzo/design tokens", "--radius", "--density", the accent names graphite/steel/silver).
Shared changes requested (`docs/requests/ui.md`): none. Noted: no skip link in shared chrome; `tokens.css` not merged.
Forks this page deleted: the two browser range inputs (now `components/v2/x-gauss/Slider.jsx`), the shared `Code` block in the dark room (it rendered one tab and copied shell and JSX together; now a page terminal whose Copy copies the two shell commands), the floating hero and chapter pauses, the ink accent that made "Ship it" a second black pill, every spring, the "violet" comments, the shared PinChapters (vertical label, number rail, grey box of drawn specimens; now one real board the chapters act on), the "React Component Library" pill with the Enso picture (now a mono caption under the h1, same words).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "GitHub" → github.com/hanzoai/ui
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 solid per viewport. The board's accents are deck greys (#404040, #525252, #737373), never a second ink pill.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared)
- [x] Every link through `A`
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; the board opens its menu and dialog by itself within 1.5 s
- [x] h1 CSS cut-in painted by the server; "React Component Library" sits under the h1
- [x] JS off legible
- [x] Board hero → six chapters acting on one real sticky board → dark init room → paste and close
- [x] Ends on one ask ("View on GitHub", `data-thumb`), then footer
- [x] n/a Morph

Done here: gate JS-off hidden 0.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "GitHub"
- [x] Copy copies exactly the two `npx` commands (no `#` lines, no JSX)
- [x] `data-cta` and `data-thumb` on both primaries

Done here: `ui.hero` and `ui.close` (both `data-thumb="GitHub"`); the bar steps aside at the close.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] "8 stars", "in production" rows and "60 seconds" are Hanzo's
- [x] n/a marquees
- [x] n/a submit

Done here: production rows are Hanzo's three named products.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+
- [x] "in production" never wraps
- [x] The code is Hanzo's text, line for line
- [x] `parity.py /ui`: 0 missing

Done here: parity `text 59/59 links 2/2`.

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline
- [x] Tiles flat; the board and token panel are one stage
- [x] One icon set
- [x] Differs from neighbours: a live component board with a token panel

Done here: gate hues [].

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press .98, focus-visible on every control
- [x] The board's Dialog moves focus in, keeps Tab inside, closes on Esc and returns focus to "Ship it" (`aria-modal`)
- [x] The DropdownMenu takes arrow keys and Esc; the swatches are one tab stop with arrows
- [x] No bare `:hover`; chips 44px with hover and press
- [x] Forks deleted: listed above

Done here: sliders are drawn (`role="slider"`, arrows, Page keys, Home/End, drag) with a hover ring.

## 9. Motion and interaction
- [x] Signature (the board that uses itself), supporting: Settle, the chapter board (sticky; the chapter in the middle of the screen drives it), magnetic; 0 fade-ups
- [x] Idle (board, the chapter board: menu/dialog with class tags, focus walk, token retune, chat/console/cloud swap, stylesheet fill, production rows), time (the init room types once), state (dialog, menu, tokens), pointer (sliders, magnetic), arrival (h1)
- [x] Moves without input; every control answers
- [x] Reduced motion: the init room shows its full text; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK; "Ship it" renders in the Hello() card when `return <Button>` is typed.

## 10. Media
- [x] n/a images: the Enso picture beside the kicker is gone (it tied the library to a model it isn't)
- [x] n/a video
- [x] n/a sizes
- [x] n/a photos

Done here: no media; the page's objects are the live component boards and the terminal.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: on phone the chapters are a swipe rail (scroll-snap, 16% peek) under the board, which is not sticky, so no heading slides under it; the chapter pause sits in the section's head row beside its h2, off every heading.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: "Hello()" #525252 on #f5f5f7; terminal comments #a3a3a3 on #0f0f0f
- [x] Pause in the token panel bar, the terminal bar and the chapter section's head row; the chapter board is `inert` and `aria-hidden` (the words are in the list)
- [x] Field labelled
- [x] One h1; h2 order
- [x] Keyboard reaches every control; the terminal is a focusable labelled region

Done here: dialog focus is trapped and returned.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island.

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
- [x] Blocked network: complete page, no console errors
- [x] n/a submit
- [x] n/a

Done here: look.cjs both widths errors none.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/ui/page.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 6/10; fixes 1–6 addressed, including fix 4: the chapters now act on one real board (tags on the CSS parts, the real menu and Dialog, the focus walk, the token retune, chat/console/cloud, the stylesheet filling, the production rows). Fresh critic pending.
