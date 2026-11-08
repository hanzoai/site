# /templates coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Templates.jsx` (+ `Templates.css`) · gallery: `docs/gallery/templates/` · metric id: `first_chat`

Open copy questions for James: the terminal shows Hanzo's four setup commands only (its paraphrased `#` notes are gone); the closing band repeats the front template's name and address; the dark room's heading is now Hanzo's own strip label "Drop into any agent" (live copy) instead of a second "Open one. Edit it in Hanzo.", and the invented "Setup" label is gone. The strip's "+25 more" (live copy, five names shown) sits under the shared setup pill's "+26" (four marks shown): two counts of the same agent list; keep both, or show four names so the strip reads "+26 more"? The agent links' hidden "(opens in a new tab)" is not in `content/ui-strings.json` yet (request 6). "Filter agents...", "MCP client" and "No agents match." are Hanzo's own strip strings (live on /mcp and /solutions/agents), not new words.
Shared changes requested (`docs/requests/templates.md`): on phones the shared header keeps a solid "Try Hanzo" and never takes "Edit in Hanzo" (request 5; the page outlines its own asks under 900px meanwhile); `SetupMenu` draws agent marks in brand colours (overridden page-locally to greys); a register string for new-tab links (request 6). No skip link change needed.
Forks this page deleted: the 4×3 shelf with a sentence under every tile (now a titled wall; sentences live in the sheets), the unproven `git clone https://github.com/hanzo-apps/template-<slug>` line (now `hanzo template get <slug>`), the readout above the deck (now in the deck's own nav row), the floating pause, ten dots for twelve templates, the drag-then-open bug, the solid "Copy setup prompt" in the dark room, the black empty preview, the "orange accent" comment and self-score, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Edit in Hanzo" → /chat?template=<slug>
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: 1 h1. Measured (Playwright, solid ink fills in view): first screen 1470×801 = 1 ("Edit in Hanzo", header quiet); 375×812 = 1 (the header's "Try Hanzo"; the page's asks are outlined under 900px). The dark room's setup prompt is outlined.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link from shared chrome
- [x] Every link through `A` (the agent docs links now too: `rel="noopener noreferrer"`, `target="_blank"`, hidden "(opens in a new tab)")
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 45/45.

## 3. First impression and page narrative
- [x] Sells in 5 s; the deck riffles within 3.6 s and the address types on load
- [x] h1 CSS cut-in painted by the server; "Templates" sits under the h1
- [x] JS off legible
- [x] Deck hero → drifting wall of twenty-nine (live's list since 9 Nov) → dark setup room → closing band
- [x] Ends on a band with the one ask and the front window, small, then footer
- [x] Wall tiles open into sheets (Morph-style layout open)

Done here: at 1470×801 the headline, lede and ask stand in the left third and the deck owns the right two thirds, with no grey stage: the whole front window (y 250–637), its readout and arrows (y 660) sit inside the first screen; the pause sits inside the deck's empty top-left corner. At 375×812 the h1, lede and ask come first and the deck starts at y 430.

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

Done here: gate hues []; every literal in `Templates.css` is a deck value (#fff, #fafafa, #f5f5f5, #ededed, #e5e5e5, #e4e4e7, #d4d4d4, #a3a3a3, #737373, #525252, #262626, #171717, #0a0a0a); the back windows show only their bars (no address, kind, footer or ask), so nothing prints down the deck's edge; the setup pill has one outline (the wrapper's inset rule is gone).

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press .98 on arrows, chips, wall tiles and asks; kind chips lift to a white-70% fill on hover
- [x] Focus ring on every stop; the deck takes arrow keys
- [x] Sheets trap Tab and return focus
- [x] Kind chips are a filter (`aria-pressed`)
- [x] Forks deleted: listed above

Done here: a drag marks the card and its click is swallowed, so a flick never opens chat.

## 9. Motion and interaction
- [x] Signature (MOTION-MAP `h-gallery`): on wide screens with motion the vertical scroll drives all twenty-nine tiles sideways for one stretch, as two rows since 9 Nov (page 8,027px at 1470) (the section grows by the rail's overflow, measured 4,544px at 1470, and its rail sticks for that stretch, then lets go); phones, JS off and reduced motion get the same twelve as a native horizontal rail (swipe or scroll, snap proximity). Keyboard: focusing a tile scrolls the page to where that tile is in view (tile 9 focused lands at x 441–901 of 1470). The hero deck still riffles and drags (kept); sheets, magnetic and the typing terminal stay. No pinned chapter scene; order is hero deck → sideways gallery → counts by kind → setup room → close.
- [x] Entrances, page-local (`components/pages/templates/Motion.jsx` + `Templates.css`), in order: velocity-skew (the hero deck leans with scroll speed, up to 5°, and eases back), fold-out (each gallery tile unfolds from its top hinge, rotateX −78° to 0, as the rail carries it in), count-roll (the twelve by kind as figures whose digits roll 0–9 to their value; each re-deals the deck), explode-gather (the setup room's five pieces start scattered and gather), shutter (two ink bars close from top and bottom, then open on the close). Each arms only after hydration and only if its section starts below the fold, so server HTML, JS off and reduced motion show the final state. Measured at 1470×801 and 375×812: 0 console errors, no horizontal page scroll.
- [x] The gallery rings the tile the deck has in front, and while in view every preview drifts slowly down its page, out of step (16 s, `translate`, paused off screen); the terminal types its commands character by character (32 ms a key, one rAF loop) each time its room comes into view or the template changes
- [x] Idle (riffle), pointer (drag, magnetic), state (filter re-deal, sheets), time (address typing), arrival (h1)
- [x] Moves without input; every control answers
- [x] Reduced motion: the deck holds still; no springs
- [x] n/a sound (shared kit)

Done here: back cards are offset 48px across and 30px up per step on desktop (12/14px on phone); with scale 0.965 per step, the visible peek above the front window measures about 11–12px per step. `motion.mjs`: 0 still screens on desktop; on the phone the 2 still screens follow the script's own Pause taps.

## 10. Media
- [x] Kit `Img` only; the front preview has `priority`
- [x] n/a video
- [x] Sized 1280×800; alt from the template's title
- [x] Twelve real previews together on the wall; none dimmed

Done here: a failed or blocked preview paints its own drawn page from the first frame: the image's `::before` (which browsers render only for a broken image) draws a grey page with the template's name (`data-t`), so no broken-image icon or alt text shows at 150 ms or with JS off (checked at 1470 and 375 with hanzo.ai images aborted). With JS, `onError` then hides the image and the fuller drawn page under it (nav, hero, blocks by kind) shows.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: on phone ←, the count, → and the pause share one row (all at y 939; the dots give way); the address bar hides its kind chip under 400px so "drive.hanzo.app" shows in full (scrollWidth = clientWidth); the filter row starts at "All"; the wall is two columns; the setup pill and its menu button are 44px; at 320 nothing in the dark room passes the right edge (the agent marks hide under 380px). An opened sheet's "Edit in Hanzo" sits at y 587 of 801, inside its first view.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured
- [x] Pause inside the deck (desktop) or in its nav row (phone); hidden with JS off
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
- [x] The terminal types its four lines character by character once per entry into view (no loop); every character is in the server HTML (the untyped rest in transparent ink, so the block never changes size); JS off and reduced motion show the final frame
- [x] No hand-typed version

Done here: `hanzo login`, `hanzo template list`, `hanzo template get <slug>`, `hanzo dev`.

## 17. States and resilience
- [x] Failed preview: the drawn page of that site; agent filter empty state "No agents match."
- [x] Blocked images leave a complete page, with or without JS (drawn page per preview; JS off also shows only the front window, not a stack)
- [x] n/a submit
- [x] n/a

Done here: Playwright console at 1470/375 over three fresh loads (no screenshot before load) shows only the sandbox's blocked hanzo.ai image requests; layout shift over a full scroll 0.003 desktop, 0.004 phone (the typing's text nodes); the two SetupMenu 404s (`/antigravity-icon.svg`, `/muse-icon.svg`) are fixed with greyscale stand-ins in `public/` (request 4 in `docs/requests/templates.md`).

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [ ] `V2:` line in `components/pages/Templates.jsx` (added once the fresh critic scores it)
- [ ] Review 8 or more (re-review pending)

Done here: previous review 7/10; its ten fixes addressed (round 2); a drag on the front preview advanced 4 of 4 times and never left /templates (Playwright, round 1).
