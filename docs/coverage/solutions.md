# /solutions coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/solutions/SolutionsIndex.jsx` + `SolutionsIndex.css` + `openTile.js`. The family keeps `solutions.css` and `Solution.jsx`, untouched. · Route: `app/solutions/page.jsx` · Gallery: `docs/gallery/solutions/` · Metric id: `signup_start`

Open copy questions for James:
- (1) The catalogue type asks for the exact count as the hero figure. Hanzo's copy prints no total for /solutions, so none is shown. Should "17" (from `content/pages.json`) be allowed?
- (2) The tiles carry a numbered caption ("01 / 17", the MASTER §4 supporting technique). These are new marks, so this is listed here.

Shared changes requested (`docs/requests/solutions.md`):
- None filed. The solution pages (`Solution.jsx`, another chat's) do not call `useArrival`, so this index's open lifts its own cover (`openTile.js`). Once Morph is fixed site-wide, the tiles can go back to it.

Forks this page deleted:
- The "All" chip.
- The per-tile group labels.
- Raw `<img>` and `<video>` (now kit `Img` and `Film`).
- The springs.
- `data-morph` on tile names.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport. "Try Hanzo" is Hanzo's own label (`lib/cta.js` does not exist yet); "Contact sales" is a quiet outline.
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. Prices: n/a, none on this page.
- [x] Open copy questions for James listed, none decided

Done here: at 1470×801 the h1, lede and both asks sit above the fold (ask bottom at y=716). At 375×812 the ask bottom is at y≈482.

## 2. Information architecture and navigation
- [x] One `<main id="main">` (layout); skip link (layout)
- [x] Every link through `A`; every card a real link
- [ ] n/a: breadcrumb. This is a depth-1 index.
- [x] Link parity: 0 removed, 0 unexpected

Done here: links 20/20 (17 solutions, reserved, /signup, /contact-sales). Every tile is an `<a href>` to its page.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input. Once the curtain lifts, the h1 cuts in and the reel starts.
- [x] `PageHero` equivalent: MaskLines h1, lede, one ask, the reel. Nothing sits above the h1.
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in the reserved tier's black room, Hanzo's own closing line and ask, then the footer.
- [x] Card-to-page opens. `openTile.js`: the tile's rectangle fills the screen and lifts on the destination. Morph is broken site-wide.

Done here:
- Playwright: while the curtain is up, the reel bar is not running. After it lifts (about 4.4 s) the bar runs.
- Clicking tile 1 landed on `/solutions/finance` with no cover left on screen.

## 4. Conversion system
- [x] No raw `.x-btn`. A page-local pill until kit `Cta` merges.
- [x] Sticky ask in header and bar after the hero, same label ("Try Hanzo")
- [ ] n/a: copy button. None on this page.
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` values are solutions.hero, solutions.sales and solutions.reserved; `data-thumb="Try Hanzo"`.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces. The only numbers are counts of the page's own items (07, 07, 03, 01 / 17).
- [ ] n/a: marquees. There are none.
- [ ] n/a: Privacy link. There is no form.

Done here: each tile's jobs are Hanzo's sentences from that solution's page (`solData.js`).

## 6. Content presentation (copy untouched)
- [x] No text under 13px, except 12px mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tabs: the group words are `aria-pressed` toggles. n/a: tables, FAQ, code.
- [x] `python3 scripts/parity.py /solutions`: 0 missing

Done here: parity text 47/47, links 20/20.

## 7. Visual design system
- [x] `taste.py` passes; only deck greys (#0a0a0a, #525252, #737373, #ededed, #a3a3a3, #000)
- [x] No label, tag, badge or pill above a headline. The reel's mono captions are inside the object.
- [x] Never box plus shadow. The reel's shadow is gone: tiles and reel are flat fills.
- [x] One icon set (one arrow); no icon in a rounded box
- [x] Differs from neighbours: a film reel hero (/customers has a case plate, /support a search pill)

Done here: `deck.css` (h1 clamp(52px, 7vw, 84px) at 1.02; headings 497), container 1152, sections clamp(72px, 11vw, 188px), buttons 48px. One black room.

## 8. UI component library
- [x] Every control has hover, press (.97), focus-visible, disabled (n/a) and loading (n/a)
- [x] Focus ring: 2px ink with a white halo; white with a black halo in the black room
- [ ] n/a: dialogs. There are none.
- [ ] n/a: inputs. There are none. Every hover sits in `@media (hover: hover)`.
- [x] Forks deleted: listed above

Done here: the reel's pause control is a 44px button named "Pause" or "Play". The group pill measures 437×99 when Industries is chosen.

## 9. Motion and interaction
- [x] One signature, 3 supporting, 0 fade-ups
- [x] At least 3 kinds: arrival, idle (reel), pointer (film and jobs), state (pill, re-flow, tile open). Nothing is scroll-linked.
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (the reel doesn't walk, no film plays); no `setInterval`
- [ ] n/a: sound. The kit hasn't merged.

Done here:
- Signature: the film wall. The pill and the re-flow both run at 300 ms ease-emphasis, with no springs.
- Supporting: line-mask h1; the reel walks once (3.8 s per solution) and rests; tile film and jobs.

## 10. Media
- [x] `Img` and `Film` (kit) only; sizes set, posters from the `.webp`
- [x] At most 2 videos playing (hero plus hovered tile, checked); pause button on the reel
- [x] Alt: films are decorative (`aria-hidden`); every tile carries its name in text
- [x] No dimmed photo; gradient under text only. 4+ real Hanzo films together on the wall.

Done here: the model films are local in `/public/models`, so they show in the gallery.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; tap opens the tile, the arrow always shows on touch
- [x] Primary ask above the fold at 375×667. Its bottom is at y≈482.

Done here: on phones the tiles stack at 320px each, and the reel shows each solution's jobs (no pointer needed).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #525252 on white is 7.8:1; white 78% on film over a gradient
- [x] Pause control on the reel
- [ ] n/a: forms
- [x] One h1; the group words are h2 buttons
- [x] Keyboard reaches every control; focus shows a tile's jobs

Done here: reel panes that aren't showing are `aria-hidden` and out of the tab order.

## 13. Performance and engineering
- [x] h1 and LCP poster in server HTML (reel poster `priority`)
- [x] Images and videos sized; a tile's film mounts only under the pointer
- [x] No poller (the open waits on one rAF loop of at most 3 s); no third party
- [x] Filmed in the cloud

Done here: transform, opacity and clip only. The reel timer runs only after arrival and only while the reel is in view.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from the layout (shared owner)
- [x] `<JsonLd route="/solutions">`
- [x] Every card is a real link

Done here: every tile and every reel pane is in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: model card. This is not a model page.
- [x] Every card opens into its page (`openTile.js` instead of Morph, noted above)
- [ ] n/a: maker and model pages
- [ ] n/a: prices

Done here: all 17 tiles plus the reserved tier link to their pages.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. There is no code, terminal or config.

## 17. States and resilience
- [x] Loading: posters render first, films load near the screen. Empty: n/a, every group has items. Error: a missing film leaves the poster or the dark tile.
- [x] Blocked live data leaves a complete page (no live data)
- [ ] n/a: no submit
- [x] A thrown island does not blank the page

Done here: Playwright run with no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary. `lib/track.js` is pending.
- [x] Nothing identifier-bearing
- [x] `V2: 8/10 …` in the page file header
- [ ] Review read: no `docs/review/solutions.md` yet. This page is ready for its critic.

Done here: filter 17 → 7 → 17, the pill shows, numbers "01 / 07", the open lands on /solutions/finance, no console errors.
