# /tabs coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Tabs.jsx` (+ `Tabs.css`, `tabsTree.js`) · gallery: `docs/gallery/tabs/` · metric id: `signup_start` (app hand-off to tabs.hanzo.ai)

Open copy questions for James: "Browser", "Phone" and "Reset" are icon buttons with aria-labels only (not in `content/ui-strings.json`); add them to the register if visible labels are wanted.
Shared changes requested (`docs/requests/tabs.md`): none yet. Noted for shared owners: no skip link exists in the shared chrome; `useEvery` (cloud/Frame.jsx) uses `setInterval`; `tokens.css` is not merged, so page CSS still carries deck-grey literals.
Forks this page deleted: the old title-left/stage-under hero, the eyebrow-styled "HANZO TABS" label, the dark room's duplicate "Read the source" button (now the MIT tile itself), the map's black button-like "Open Tabs" tile, every spring transition.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy ("Open Tabs" → tabs.hanzo.ai)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices (no price on the page)
- [x] Open copy questions for James listed, none decided

Done here: Persona developers running coding agents in shells, metric `signup_start`. Gate script: 1 h1, max 1 solid per desktop viewport ("Open Tabs ↗" at y 0); the closing ask carries `data-thumb` so the bar steps aside.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared chrome has none; noted above)
- [x] Every link through `A`; the MIT tile is a real link to the source
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" className="xtb w2 gx">`; `parity.py /tabs` → links 2/2 (tabs.hanzo.ai, github.com/hanzo-apps/tabs).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero is the h1 line-mask cut-in + one primary + one object; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in one ask in the dark room, then footer
- [x] n/a Morph: no cards that open into pages

Done here: h1 "Keep tabs on your agents." (52px) and "Open Tabs" share one line; the window below is the composition and splits its own panes from load (tree grows in its sidebar). Gate: JS-off hidden text 0. Sections: window hero → pinned chapters → light map → dark room of 4 objects → one ask.

## 4. Conversion system
- [x] Kit `A` with `.w2-cta` (no raw `.x-btn`); n/a `<Cta>` until it merges
- [x] Sticky ask in header and bar after the hero, same label ("Open Tabs" via `data-thumb`)
- [x] Copy button copies exactly `hanzo link` (displayed text, `$` not copied)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta="tabs.hero"` and `"tabs.close"` (both `data-thumb="Open Tabs"`), `"tabs.source"` on the MIT link. The primary appears twice (hero, close).

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy (10k lines of scrollback, MIT)
- [x] n/a marquees: none
- [x] n/a submit: no form

Done here: the only figures are Hanzo's "10k lines of scrollback" and "MIT"; demo pane names (build, work, shell 3, shell 4) are UI state, not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; headings balanced
- [x] n/a tables/FAQ; Browser/Phone is a radiogroup with arrow keys
- [x] `python3 scripts/parity.py /tabs`: 0 missing

Done here: parity `/tabs: OK text 26/26 links 2/2`. Phone pane names raised 13 → 14px; Rhythm.css sets h2 26px, h3 17px, lede 21px, body 16px.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (0 hues)
- [x] No label, tag, badge or pill above a headline
- [x] Tiles are flat fills; only the window and map card float
- [x] One icon set (inline 1.5px strokes); no icon in a rounded box
- [x] Differs from neighbours: hero medium is a full-width terminal window, not a split title/stage

Done here: `taste.py components/pages/Tabs.{jsx,css}` OK; gate hues []. The rail title, window name and URL sit inside the objects, never above a heading.

## 8. UI component library
- [x] Every control has hover (in `@media (hover:hover)`), press .98, focus-visible
- [x] Focus ring visible on every stop (pane actions, icon radios, reset, pause, copy, MIT link)
- [x] n/a dialogs: none
- [x] No bare `:hover` (all 6 hover blocks are wrapped)
- [x] Forks deleted: listed above

Done here: phone pane actions are 32px glyphs with a 44px `::after` hit area; "split right" folds away on phone; machine rows slide 6px on hover.

## 9. Motion and interaction
- [x] One signature (the live tree), 3 supporting (Settle, PinChapters, magnetic), 0 fade-ups
- [x] Idle (tree, chapter visuals, tile loops), pointer (split/close, magnetic), state (Browser/Phone flip), arrival (h1 cut-in), scroll (pin, settle)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; n/a `setInterval` (shared `useEvery`)
- [x] n/a sound: shared kit not merged

Done here: `variety.py` OK. No springs: every transition is ease-emphasis 300ms or the Morph 600ms curve. Dark-room tiles run scrollback paging, a pane that closes and comes back by name, and a key row pressing; hover holds each.

## 10. Media
- [x] n/a `Film`/`Pic`: the page has no Hanzo media; every object is drawn UI
- [x] n/a videos
- [x] n/a budgets/alt
- [x] n/a photos

Done here: no images or video on the live page; the objects are the product's own UI drawn in HTML.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phone first screen shows h1 (2 lines at 40px), "Open Tabs", and four live panes inside 660px; the phone caps splits at 4 panes so Close always fits.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: pane text #d1d1d6 / #a1a1a6 on #0b0b0c, body #48484a on white
- [x] Pause control on every moving item (window bar, chapter visual)
- [x] n/a forms
- [x] One h1; h2 → h3 order; names start with visible text
- [x] Keyboard reaches every control (arrow keys on Browser/Phone)

Done here: the chapter pause now sits under the visual (not on a pane); the hero pause lives in the window bar.

## 13. Performance and engineering
- [x] h1 and lede in server HTML
- [x] No images; nothing unsized
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: one client island; LineMask cut-in is CSS so the h1 paints before hydration.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical via shared layout
- [x] `<JsonLd route="/tabs" />` rendered
- [x] n/a cards

Done here: `app/tabs/page.jsx` reads `INDEX['/tabs']` and renders `<JsonLd route="/tabs" />`.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a, a product launch page with no model cards or prices.

## 16. Developer experience
- [x] Copy equals display (`hanzo link`)
- [x] n/a config blocks
- [x] Self-running panes pause and rest
- [x] No hand-typed version number

Done here: the one command block copies `hanzo link`; the `$` is drawn, not copied.

## 17. States and resilience
- [x] n/a loading/empty/error: no live data
- [x] Blocked network leaves a complete page, no console errors
- [x] n/a submit
- [x] Reset restores the window if every pane is closed

Done here: look.cjs at both widths reports errors none; closing every pane is refused for the last one, and Reset rebuilds the default split.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing; no tracking code in the page
- [x] `V2:` line in `app/tabs/page.jsx`
- [ ] Review read: `docs/review/tabs.md` verdict 8 or more (re-review pending after this rework)

Done here: `tabs.hero`, `tabs.close`, `tabs.source`. Previous review 5/10; every numbered fix in it is addressed in this push.
