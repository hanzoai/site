# /templates coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Templates.jsx` (+ `Templates.css`) · gallery: `docs/gallery/templates/` · metric id: `first_chat`

Open copy questions for James: the terminal shows Hanzo's four setup commands only (its paraphrased `#` notes are gone); the closing band repeats the front template's name and address; the dark room's heading is now Hanzo's own strip label "Drop into any agent" (live copy) instead of a second "Open one. Edit it in Hanzo.", and the invented "Setup" label is gone.
Shared changes requested (`docs/requests/templates.md`): the shared header "Try Hanzo" is now always solid, so the first screen shows it beside the page's "Edit in Hanzo" (two solids); `SetupMenu` draws agent marks in brand colours (overridden page-locally to greys). No skip link change needed.
Forks this page deleted: the 4×3 shelf with a sentence under every tile (now a titled wall; sentences live in the sheets), the unproven `git clone https://github.com/hanzo-apps/template-<slug>` line (now `hanzo template get <slug>`), the readout above the deck (now in the deck's own nav row), the floating pause, ten dots for twelve templates, the drag-then-open bug, the solid "Copy setup prompt" in the dark room, the black empty preview, the "orange accent" comment and self-score, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Edit in Hanzo" → /chat?template=<slug>
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 page solid per viewport; the dark room's setup prompt is outlined.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link from shared chrome
- [x] Every link through `A` (agent docs links are plain external anchors from Hanzo's strip)
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 45/45.

## 3. First impression and page narrative
- [x] Sells in 5 s; the deck riffles within 3.6 s and the address types on load
- [x] h1 CSS cut-in painted by the server; "Templates" sits under the h1
- [x] JS off legible
- [x] Deck hero → wall of twelve → dark setup room → closing band
- [x] Ends on a band with the one ask, then footer
- [x] Wall tiles open into sheets (Morph-style layout open)

Done here: at 1470×801 the front preview spans y 494–949 (67% above the fold); at 375×812 the phone deck is 470px tall and its preview spans y 482–751 (269px on the first screen).

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Edit in Hanzo"
- [x] Copy copies the four `hanzo` commands shown
- [x] `data-cta` on hero, card, sheet and close; `data-thumb` on hero and close

Done here: `templates.hero`, `templates.card`, `templates.sheet`, `templates.close`.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Counts (12, per kind) come from Hanzo's list
- [x] n/a marquees
- [x] n/a submit

Done here: the clone URL that no Hanzo source shows is gone.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+
- [x] Wall tiles carry title and kind only; sentences in sheets; each preview sits over a drawn page of that site (name, nav, hero, blocks laid out by kind)
- [x] Sheets via OpenCards (focus trapped)
- [x] `parity.py /templates`: 0 missing

Done here: parity `text 96/96 links 45/45`; gate small375 [].

## 7. Visual design system
- [x] `taste.py` passes; rendered hues 0 (agent marks greyed)
- [x] No label above a headline
- [x] Tiles flat; the deck floats
- [x] One icon set
- [x] Differs from neighbours: a deck of browser windows

Done here: gate hues []; every literal in `Templates.css` is now a deck value (#0a0a0a, #171717, #262626, #a3a3a3, #d4d4d4, #e4e4e7, #ededed, #fafafa); the back windows hide their labels so the fanned edges never print over each other.

## 8. UI component library
- [x] Hover in `@media (hover:hover)` (all 8 wrapped), press .98 on arrows and chips
- [x] Focus ring on every stop; the deck takes arrow keys
- [x] Sheets trap Tab and return focus
- [x] Kind chips are a filter (`aria-pressed`)
- [x] Forks deleted: listed above

Done here: a drag marks the card and its click is swallowed, so a flick never opens chat.

## 9. Motion and interaction
- [x] Signature (the riffling deck), supporting: Settle, sheets, magnetic; 0 fade-ups. The wall deals in once by a clip-path wipe 60 ms apart and rings the tile the deck has in front; the terminal re-types each time its room comes into view, caret blinking
- [x] Idle (riffle), pointer (drag, magnetic), state (filter re-deal, sheets), time (address typing), arrival (h1)
- [x] Moves without input; every control answers
- [x] Reduced motion: the deck holds still; no springs
- [x] n/a sound (shared kit)

Done here: back cards peek 48px across and 30px up on desktop (12/14px on phone so the front keeps its width).

## 10. Media
- [x] Kit `Img` only; the front preview has `priority`
- [x] n/a video
- [x] Sized 1280×800; alt from the template's title
- [x] Twelve real previews together on the wall; none dimmed

Done here: every preview sits on a drawn grey page with the template's name; if Hanzo's screenshot fails it is hidden (`onError` or `complete && !naturalWidth`) and the drawn page stays, never a broken-image icon.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: on phone the filter row starts at "All" (left-aligned scroller) and the pause sits in the nav row, off every chip (Playwright: 0 overlaps at 375 and 320); the wall is two columns; at 320 nothing in the dark room passes the right edge (the agent marks hide under 380px). An opened sheet's "Edit in Hanzo" sits at y 587 of 801, inside its first view.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured
- [x] Pause in the deck's nav row
- [x] Agent filter labelled
- [x] One h1; an `x-sr` h2 names the wall
- [x] Keyboard reaches every control

Done here: the counter announces only after the visitor moves the deck.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Images sized
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: previews come from hanzo.ai (blocked in this sandbox; layout holds).

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/templates" />`
- [x] Wall tiles open sheets whose ask is a real link

Done here: `app/templates/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a model cards
- [x] Tiles open into sheets
- [x] All twelve templates linked
- [x] n/a prices

Done here: twelve of twelve in the deck and on the wall.

## 16. Developer experience
- [x] Copy equals the display: four commands, no notes; the `$ ` prompts are `aria-hidden` and `user-select:none`, so the paste runs in zsh
- [x] n/a config blocks
- [x] The terminal types its four lines once per entry into view (no loop); final frame static
- [x] No hand-typed version

Done here: `hanzo login`, `hanzo template list`, `hanzo template get <slug>`, `hanzo dev`.

## 17. States and resilience
- [x] Failed preview: the drawn page of that site; agent filter empty state "No agents match."
- [x] Blocked images leave a complete page
- [x] n/a submit
- [x] n/a

Done here: Playwright console at 1470/375/320 shows only the sandbox's blocked hanzo.ai image requests; the two SetupMenu 404s (`/antigravity-icon.svg`, `/muse-icon.svg`) are fixed with greyscale stand-ins in `public/` (request 4 in `docs/requests/templates.md`).

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [ ] `V2:` line in `components/pages/Templates.jsx` (added once the fresh critic scores it)
- [ ] Review 8 or more (re-review pending)

Done here: previous review 5/10; its ten fixes addressed; a drag on the front preview advanced 4 of 4 times and never left /templates (Playwright).
