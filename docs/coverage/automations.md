# /automations coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Automations.jsx` · gallery: `docs/gallery/automations/` (this round: `desktop-r2.jpg`, `phone-r2.jpg`) · metric id: `cta_click:automations.primary`

Open copy questions for James: "Category" (`c4_category`), and "Clear" (the search's clear button, screen-reader name only; not yet in `content/ui-strings.json`). Until approved, the control is icon-only and the name is for screen readers only.
Shared changes requested (`docs/requests/automations.md`): none. Noted for the shared-system chat: kit `A` treats an in-page `#hash` as external and adds `target="_blank"`; this page passes `target="_self"` on its three hash links instead of changing the kit.
Forks this page deleted: the dragged dock icons with spring snap-back (tap now), the invented "is not in the catalogue yet" line (Hanzo's "Not here?" now), raw .x-btn asks, the label above the h1, the browser's blue search-cancel control, the dotted-grid canvas shared with /auto.

Measured on the dev server at 1470×801 and 375×812 (isMobile, hasTouch) with Playwright, 7 Nov round 2.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a builder checking whether the apps they use can be steps; the one ask is Hanzo's "All Integrations" (`data-cta` primary in the hero, "close" as the band's solid), metric `cta_click:automations.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. No prices on the live page. Every button changes something on screen: dock tiles and catalogue tiles drop their app into the flow, chips and search filter, clear empties the search, pause stops the canvas.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /automations is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. Links in main go through `A` or `Cta`. The three canvas nodes link to their catalogue entry (`#slack` and so on) in the same tab; if a chip or search has hidden that entry, the catalogue resets to All and scrolls the entry to the centre (checked: Commerce on, tap the Slack node, lands on `#slack` with "81 integrations"). Catalogue tiles are buttons that drop the app into the flow (the live page's entries are not links). `python3 scripts/parity.py /automations`: text 102/102, links 2/2. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: The hero is its own: three-line title at left, lede and ask at right, dock and canvas under. The h1 cuts in by line mask (700 ms, 60 ms apart), lede, ask and object follow by 0.2 s, and the first app drops at 0.45 s. At 1470×801 the whole object (dock and the three-place canvas) sits between y 403 and 770, inside the first screen; on the phone the canvas starts at y 529 under the ask. The mono caption sits under the h1. Rooms: hero (light) → catalogue with a sticky side (light) → "Not here?" as the closing band (dark), then the footer. The live page has no proof strip.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs: primary*, find-not-here, close*, close-build (* = solid), at most one solid per screen. The header carries the sticky ask at every width; the page bar is off (`data-ask="off"`) because the critic's shared note (15:00) fails any pill seen over content. There is no copy button. 1 `data-thumb` in main.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No partner logos; the app emoji are the live catalogue's own. The counts (81, per-category counts) are counted from Hanzo's own list. Parity holds every printed word.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /automations`: 0 missing

Done here: h1 52px (40 phone), section heads 26px, category heads 15px (16 phone), tile names 15px (14 phone), lede 17px. Mono capitals at 11-12px only ("Popular", tray and dock captions). Tile names never break mid-word (`overflow-wrap: normal; hyphens: manual`); Playwright finds 0 names overflowing their tile at either size, and dock names wrap onto two balanced lines instead of being cut. Code: none. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS; only deck neutrals. Every emoji renders in greyscale (`grayscale(1) contrast(1.08)`, as /integrations); colour returns only as state: the app that has just landed on the canvas, and a dock or catalogue tile under the pointer or keyboard focus. The search's native blue cancel is hidden and replaced by the page's own 44px ink clear button. Differs from /auto: no dotted grid; a clean white board where apps wire left to right along one dashed rail, with travelling run packets and a drop clock (/auto stacks nodes down a dotted canvas); the catalogue has a sticky side holding a tray.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover), (pointer: none)` (as /blockchain), so a desktop without a hover media flag still answers. Catalogue tiles: hover lifts 2px, fills white with a grey hairline, brings the emoji's colour back and slides in a "+" (tells you a tap adds it); in the flow they carry an ink ring and their place number (1, 2, 3). Dock tiles and canvas nodes change border and fill; nodes lift 2px. Press is scale .97-.98. Focus-visible draws a 2px ink ring. Nothing loads data, so no loading state; no control is disabled. Dialogs: none. The search input is 16px, aria-label is Hanzo's placeholder. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: apps dropping onto a canvas (time; pausable). Supporting: chip pill (layoutId, state), catalogue re-flow (groups and tiles leave and close up by FLIP on transform, 300 ms ease-emphasis), tiles dropping into the tray (state). Kinds: idle (the canvas runs itself, packets travel the wires, a clock fills to the next drop; in the gallery a soft wave runs across the "+" marks of the panel in view, 0.32 s a tile in a 7 s cycle), time, state, pointer (tile lift and "+"), scroll (the sideways gallery, the one scroll-linked move: the track rests on each panel for half of its 528 px share of scroll, then glides to the next with a smoothstep, so a panel is read whole and never two halves slide past). Timers are one timeout chain (first drop 0.45 s, then 1.6 s), no `setInterval`. Reduced motion: the canvas holds its settled flow and CSS animations collapse. `scripts/variety.py` OK.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML; the one loop over 5 s (the canvas, its packets and clock) carries a 44px pause button at its foot. The tray's packet runs once per change (about 1 s), not in a loop.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Overflow 0px at 375 and 1470. Layout shift: CLS 0.0000 on the phone and 0.0002 on desktop over the first 5 s (the canvas always holds three fixed-height places, so it never grows). On the phone the flow stands up (fixed 84px places), the dock is 4 across, and the catalogue is nine swipe rails (snap) instead of 27 rows: the catalogue section is about 1,960px tall, against about 2,880px for the grid before. Chips swipe. Tiles have a tap path for every hover (tap drops the app; the "+" sits at half strength on touch). The ask's bottom edge sits at about 490px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Body and captions use the deck's ink and #525252 on white or #f5f5f5; the selected chip is white on its ink pill. Headings: h1, h2 "Most reached for", h2 "All Integrations", h3 per category, h2 "Not here?", 0 skips. Pause control: the canvas. The flow list is `aria-live="polite"`; the count is `aria-live`. Dock and catalogue tiles are native buttons with `aria-pressed` (in the flow or not); the tray is a visual mirror (`aria-hidden`). Every input has a label; nothing validates.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /automations/` returns the h1 in the HTML. The canvas runs only while seen (`useInView`) and stops when paused. No fetch, poller or third-party script. Console: `errs.js /automations` prints 0 errors at 1470 and 375; `hyd.js /automations 3` prints 0 hydration diffs in 3 loads at each size (the page has no Date, random or window reads in its first render).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "The apps a workflow can reach — Hanzo AI". Canonical https://hanzo.ai/automations/, og:url https://hanzo.ai/automations/. 1 JSON-LD block, parses. Metadata comes from `content/pages.json` through the route file. Catalogue tiles are buttons, not links, as the live entries are not links.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. The catalogue is grouped by Hanzo's own nine categories; "Commerce" shows 8 tiles, "goo" 7, "zzzq" 0 with Hanzo's "Not here?" answer in place (checked in Playwright at both sizes). No prices on the live page.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: none, no prompt string, no terminal. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network still shows the whole page. Empty state: a search with no match shows Hanzo's "Not here?" answer with "Request Integration" in place of the groups; clear (44px) brings the 81 back.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/automations.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line updated in `components/pages/apps/Automations.jsx`. Last critic verdict on file: 5/10 (7 Nov 16:30); every fix it lists is addressed in this round, which waits for the next walk.
