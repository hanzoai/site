# /careers coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Careers.jsx` (+ `CareersBoard.css`, `app/careers/page.jsx`, page-local `components/pages/careers/door.js` and `careers/MaskLines.jsx`; reads `components/pages/company/*` without editing it) · gallery: `docs/gallery/careers/` · metric id: `cta_click careers.*` (one contact click: a role page)

Open copy questions for James: none.
Shared changes requested (`docs/requests/careers.md`): Morph times out (rAF inside a held view transition); kit `A` treats `#hash` as external; `doorway.js` `useArrival` should be idempotent (careers now uses page-local `careers/door.js`); the header's solid "Try Hanzo" stays solid when a page turns its ask bar off (`data-ask="off"`).
Forks this page deleted: the `xcr-btn` and raw `.x-btn` buttons (all asks are kit `Cta`); the 8-pill team filter (each team had one role); the multi-select dashed skill chips (now one quiet row with one gliding ink pill); the shared doorway's grey flood (now the sheet's own white, carrying its title); the old orange accent; the perks' PinScenes pin; native `title=` tooltips.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist; labels verbatim from `content/pages/careers`)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a prices: none on this page.
- [x] Open copy questions for James listed, none decided

Done here: Header comment rewritten (no Ask bar claim, no "title flies into Morph" claim; the door is page-local). The page's one solid per screen is "View Open Positions" (hero, bottom 604px at 1470×801), then "Apply for Research Internship", "Submit Open Application" on the dark sheet and "Browse Open Positions" in the close; role sheets' asks are `kind="quiet"`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site layout)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- n/a: Breadcrumb at depth 2 or more (/careers is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /careers` gives text 76/76, links 13/13. Every role sheet is a real `<a href="/careers/<slug>/">` (kit `A`); a click is intercepted only for the open transition, modified clicks open normally.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the h1 lines cut in from 0.12s, CSS at first paint; the hiring card's bar runs)
- [~] `PageHero`: not in the kit yet; the hero follows its rules (line-mask h1, one lede, one primary, one object). Nothing sits above the h1.
- [x] JS off: legible; the hiring steps read as a plain stacked list (no overprint, counter and bars hidden)
- [x] One idea per 100svh; no 3 same-height sections in a row
- [~] Ends in the page's own dark close and the footer. No proof strip: the careers copy has none.
- [~] Card-to-page: Morph is broken (requests); `careers/door.js` grows the whole sheet in its own white (#fff, 600ms in-out) carrying its title and numeral, pushes the route at once, then flies both onto the role h1 and numeral (500ms ease-emphasis) and lifts the cover (300ms). Measured: title lands on the h1 box (FLIP to its rect, then hands over). Back does not reverse it.

Done here: 1470×801: h1 52px in 4 lines (y 195–421), lede, ask bottom 604, and the next section's heading "How the team actually works." shows at y≈727 (perks section top 711; before it was 861, off screen). 375×812: h1 40px, ask bottom 526. Filmed open (dev): white grow with the title visible, the role page under the cover in about 1.1s, title and numeral land, no grey hold.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page file
- [x] Sticky ask: careers has none by rule (MASTER part 4); `data-ask="off"`
- [x] Copy button: a drawn tick and `role=status` "Link copied" only when the clipboard write succeeds
- [x] `data-cta` and `data-thumb` on every primary (kit `Cta id` and `thumb`)

Done here: `data-cta` ids: `careers.hero`, `careers.history`, `careers.role.<id>`, `careers.open`, `careers.intern`, `careers.grant`, `careers.close`. The header's solid "Try Hanzo" is shared chrome (request 5).

## 5. Trust and proof
- [x] No logo without permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy ("2,137+ open repositories")
- n/a: Marquees (none)
- n/a: Privacy link beside a submit (no form on this page)

Done here: The only figure is 2,137+, verbatim from the careers copy; counts ("2 / 7") are counts of the page's own roles.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; phone titles never split a word and never run over the numeral
- n/a: Tables, FAQ, tabs, code (none)
- [x] `python3 scripts/parity.py /careers`: 0 missing

Done here: Scale rests at live sizes (page-local overrides): h1 52, section heads 26, close 44, sheet titles 32 (26–30 phone), body 17. One big thing per screen: the hiring step (64px), the perk numeral, each sheet's Air numeral, the 2,137+ figure. Phone: the numeral has its own row; measured 0 of 7 titles intersect their numeral at 375 and at 320.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24 on tiles and sheets, 28 on the hiring card; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours (black hiring card hero object; the sheet deck signature)

Done here: `taste.py` OK on all 6 careers files. Hover on the dark sheet's and the close's solid: `#fafafa` → `#e4e4e7` (measured), the deck's one brand tone.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97), focus-visible
- [x] Focus ring visible (2px ink plus white halo; white plus black halo in dark rooms)
- n/a: Dialogs (none)
- n/a: Inputs (none)
- [x] Forks this page deleted: listed above

Done here: The skill row's ink pill glides between chips (Motion `layoutId`, 300ms ease-emphasis, no spring); every chip is a 44px `aria-pressed` button; a pick plays the kit's tick (after first interaction only).

## 9. Motion and interaction
- [x] One signature (the deck and its open), 3 supporting (h1 line mask, hiring card steps, perk crossfade); `variety.py` OK (via unique.py)
- [x] Kinds: arrival (h1 cut-in, the open landing), idle (hiring card, Sigil drift), pointer (perk crossfade, numeral lift), state (gliding pill, marked words, sheet open), scroll (the deck). Scroll is 1 of 5.
- [x] Something moves without input; every control answers
- [x] Reduced motion: final state, deck unstuck, bars full, perk swap a cut, sheet open a cut; no hydration error (console clean, measured)
- [x] Sound: kit `play('tick')` on a skill pick, `play('whoosh')` on a sheet open (lib/sound.js; plays only after first interaction, never on hover/scroll)

Done here: Perks crossfade the Sigil field and numeral (300ms ease-emphasis, numeral moves 12px) instead of a one-frame swap. Film: see part 11.

## 10. Media
- n/a: `Film` and `Pic`: the careers copy carries no Hanzo images or films
- n/a: Videos (none)
- [x] Nothing missing; no `<img>`
- n/a: No photo to dim; Sigil fields are the designed image

Done here: Objects are drawn: hiring card, a Sigil per perk, Air numerals, a Sigil band in Academic, a Sigil in the close.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more (0 under 44 in main at 375 and 320); every hover has a tap path
- [x] Primary ask above the fold at 375×667 (bottom 526)

Done here: Phone perk tile is sticky under the header (top 64, 132px tall): after a tap on perk 04 the tile reads "04" at y 64–196, on screen (measured at 375 and 320). The skill row scrolls sideways with a fade edge; the count sits beside it. Film results: see the report lines in the gallery note below.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: body `#737373`/`#525252` on white (4.74:1 / 7.8:1), white 78% on black
- [~] Pause control: the hiring card stops on any step tap and pauses off screen; no separate pause button
- n/a: Forms
- [x] One h1; no heading skips
- [x] Keyboard reaches every control (perk rows focusable; focus also crossfades the tile)

Done here: `role=status` on the count and copy confirmation; `aria-pressed` on skill chips; covers are `pointer-events:none` and removed after landing (or by a 6s failsafe).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML; the h1 cut-in is CSS and starts 0.12s after first paint (no hydration wait)
- [x] Sigil pauses off screen; at most 2 perk canvases during a 300ms crossfade
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (cloud container)

Done here: Motion is transform, opacity and clip-path only. CLS 0.000 in the film.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` via `metaOf('/careers')`
- [~] Canonical: shared layout owns it
- [x] `<JsonLd route="/careers">` rendered
- [x] Every card is a real link

Done here: `app/careers/page.jsx` sets `metadata` from `metaOf` and renders `JsonLd`.

## 15. Catalogue and product pages
- n/a: Model card
- [~] Every card opens into its page: by `careers/door.js` while Morph is broken
- n/a: Maker and model pages
- n/a: Price

Done here: 7 role sheets and the open application each open into `/careers/<slug>/`; probe: after a click the URL is `/careers/compiler-engineer/` and 0 covers remain.

## 16. Developer experience
- n/a: no code on the page

Done here: n/a. No code blocks, config or terminals on /careers.

## 17. States and resilience
- [x] Empty state: a skill with no hits dims every role and the count shows 0; the open-application sheet always stays
- [x] Blocked live data: none fetched
- n/a: Submit (no form)
- [x] A thrown island does not blank the page; a stuck cover is removed by a 6s failsafe

Done here: A blocked clipboard shows no false confirmation. JS off renders every word with the hiring steps as a list.

## 18. Measurement and handover
- [x] `data-cta` on every primary; `lib/track.js` not used by this page (kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent
- [x] `V2: 8/10 …` in `Careers.jsx` and `app/careers/page.jsx`
- [~] Review read: `docs/review/careers.md` 7/10; every numbered fix answered here, re-walk pending

Done here: Fixes: 1 JS off and reduced motion clean (measured, console clean); 2 the open grows the whole sheet in #fff with title and numeral carried to the role h1/numeral, page-local idempotent landing (production build not run here, by rule); 3 toolbar cut to one quiet row with a gliding pill; 4 perks crossfade, sticky tile on phone; 5 phone titles clear (0/7 at 320 and 375); 6 dark solid hover, next-section sliver at 1470×801, header and card corrected.
