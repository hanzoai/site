# /oss/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/oss/OrgPage.jsx` (+ `oss.css`, `ossData.js`; route `app/oss/[slug]/page.jsx`, 56 organizations) · gallery: `docs/gallery/oss/` · metric id: GitHub or weights click

Open copy questions for James:
- The sort and filter icons and the open card's controls are named from the register: `oss_sort*`, `oss_language`, `oss_all`, `oss_clone_from`, `oss_copy`, `oss_show_all`, `oss_loading`, `oss_no_match`. All need James.

Shared changes requested (`docs/requests/oss.md`):
- n/a. Site-level: kit `Copy` swaps its `aria-label` instead of `role=status`.

Forks this page deleted:
- The accent colours.
- The kicker over the h1 and the chapter counters over the headings.
- The invented sort, "Open on GitHub" and "Open on Hanzo Forge" labels, and the visible "Copy clone command".
- The 96–168px type and the springs.
- The cursor label on tiles.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport: "<org> on GitHub" (Hanzo's hero link)
- [x] One h1 (the organization's name); clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions for James listed, none decided

Done here: "hanzoai on GitHub" is magnetic, with `data-thumb` and `data-cta="oss.hero"`. The open card's solid is the repository link, and the close repeats the ask.

## 2. Information architecture and navigation
- [x] One `<main>` (the site's skip link reaches it)
- [x] Every link through `A`; every tile and card a real link or button
- [x] Breadcrumb: n/a. Hanzo's page has none; "Every organization" leads back, in the hero and under the cards.
- [x] Link parity: 0 removed, 0 unexpected (hanzoai 123/123, hanzo-app 25/25, crowdstart 9/9)

Done here: The page runs hero, two counted chapters, repositories, the next four organizations as cards, then the close.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1 ("Open source · Hanzo" is a caption under the lede)
- [x] JS off: legible (0 hidden blocks; chapters stack)
- [x] One idea per 100svh: ledger, chapters, tiles, cards, close
- [x] Ends in a black close (the org's contour, its line, the one ask), then the footer
- [ ] Card-to-page uses Morph (`data-morph` into `data-morph-target`). The 12px landing can't be checked on the dev server.

Done here:
- The ledger is whole beside the name at 1470×801 and under it at 375×812.
- It leads with the strongest true figure, never a zero: hanzoai 568,900 commits, hanzo-app 11 repositories, crowdstart 3 repositories.
- The lead's digits rise into place and the lead rests at 64px; it is larger only on arrival and settles as you scroll.
- An organization with commits shows its waveform and playhead; one without shows its own repositories as a slow ticker. 1–2% of pixels change between 1.5 s and 3.5 s, idle.

## 4. Conversion system
- [x] No raw `.x-btn` (`v2f-btn`; `Cta` not merged yet)
- [x] Sticky ask in header and bar after the hero, same label (`data-thumb`)
- [x] Copy copies exactly the displayed `git clone …` text
- [x] `data-cta` and `data-thumb` on the primary (`oss.hero`, `oss.card`, `oss.close`)

Done here: The tiles' GitHub and Forge links are a quiet icon and chip, never solid.

## 5. Trust and proof
- [x] No logo, seal or invented number; every figure is Hanzo's, read from GitHub and Hanzo Forge on the date the page states
- [x] The qualifier sits beside the figure (the ledger's corner: "GitHub Nov 6, 2026")
- [x] The ticker freezes under reduced motion; its duplicate names are `aria-hidden`
- n/a: no submit

Done here: The tiles keep Hanzo's own "N commits this year" and "Pushed …" lines.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] h1 at 52 (sized to the longest word on narrow columns), headings 26, tile names 21 and 26, body 16
- [x] The open card's labels are Hanzo's own (stars, forks, "N commits this year", "Pushed …") or icons
- [x] `parity.py`: hanzoai 208/208, hanzo-app 37/37, crowdstart 28/28, hanzo-community 72/72 text

Done here: No more than three sizes among the headline, lede and body in any one view.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only (`#fafafa`, `#a3a3a3`, `#737373`, `#d4d4d4`, `#ededed`, `#0a0a0a`) plus white or black alpha
- [x] No label above a headline
- [x] Radii 24 and 16; the ledger is a flat black surface (no shadow); only the open card floats (`--float`)
- [x] One icon set (inline strokes); no icon in a rounded box
- [x] Differs from neighbours by the org's own contour (Sigil seeded with `/oss/<org>`), figures, waveform or ticker

Done here: The ledger is white on black, the waveforms are silver, and the chips are ink when pressed.

## 8. UI component library
- [x] Hover (in `@media (hover:hover)`), press (scale .97 or .96), focus-visible and loading (the "Show all" spinner with `aria-busy`) on every control
- [x] Focus ring on a Tab crawl (site ring; tiles show an inset ring)
- [x] The open card is a modal: focus goes to Close, Escape closes it, and focus returns to the tile (tested)
- [x] Search input is 16px with Hanzo's own label
- [x] Forks deleted: listed above

Done here: The sort is three icons in one pill that glides (300 ms, no spring). The language chips are a swipe rail on phones.

## 9. Motion and interaction
- [x] One signature (a tile grows into its card, 600 ms in-out) plus 3 supporting: the ledger settling, the lead's rise and grow, the waveform or ticker. Fade-ups: 0.
- [x] Five kinds of movement; scroll is 2 of them:
  - idle: playhead or ticker, contour;
  - pointer: magnetic ask, a hovered tile's playhead, drag rail;
  - state: open card, sort pill, re-flow;
  - arrival: masked h1;
  - scroll: settle and chapters.
- [x] Moves without input; every control answers
- [x] Reduced motion: 0 running animations after load (tested); no `setInterval`
- n/a: sound kit not merged yet

Done here: Counters never pass through other numbers; every frame shows Hanzo's figure.

## 10. Media
- n/a: Hanzo has no film or photograph for an organization. The objects are the ledger, the waveform or ticker of its own repositories, and its contour.

Done here: Canvases: 2 live contours (hero and close) plus 4 still (6 of 12).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 with no overlap (hanzo-app, crowdstart, hanzoai walked)
- [x] No horizontal scroll (scrollWidth 375)
- [x] Targets 44px or more on phones (chips, sort, Forge, GitHub icon, close)
- [x] Primary ask above the fold at 375×667

Done here: A sideways swipe turns to the next organization (crowdstart → hanzo-app, hanzoai → hanzobot). The open card rises from the bottom.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: text `#525252` or ink on white; `#a3a3a3` or white on black
- [x] The ticker and playhead stop under reduced motion. The playhead is a 6.5 s read, and pause controls are n/a for decorative loops.
- n/a: forms (search only, labelled)
- [x] One h1; h2 per chapter and the repositories; icon controls named
- [x] Keyboard reaches every control

Done here: The waveforms are `role=img` with Hanzo's own label ("Commits a month over the past year").

## 13. Performance and engineering
- [x] h1 and ledger in server HTML
- [x] Transform, opacity and clip only; tile re-flow skips layout animation above 80 items
- [x] No poller; the GitHub read happens only on "Show all"
- [x] Filmed in the cloud only

Done here: CSS animations pause off screen through the site's `[data-off]`.

## 14. SEO and machine files
- [x] Title and description unchanged
- [x] Canonical unchanged (site-level)
- [x] `<JsonLd route>` unchanged
- [x] Every repository and sibling is a real link

Done here: Hidden tiles stay in the DOM as `hidden`.

## 15. Catalogue and product pages
- n/a: model card
- [x] Sibling cards open by Morph; tiles open their card in place
- [x] Every repository linked (GitHub and the forge)
- n/a: no price

Done here: The next four organizations are cards with their own contour, figures and one line on hover (always shown on phones).

## 16. Developer experience
- [x] `git clone` box; copy equals display
- n/a: config blocks
- n/a: terminal
- [x] No hand-typed version

Done here: The open card's clone box switches between GitHub and Hanzo Forge.

## 17. States and resilience
- [x] Empty search shows an icon, the query and a screen-reader status. Loading is a spinner with `aria-busy`. If the GitHub read fails, it falls back to Hanzo's own link.
- [x] Blocked GitHub leaves a complete page (everything listed is served)
- n/a: no submit
- [x] A failed Sigil leaves the page

Done here: JS off shows every figure, chapter and tile.

## 18. Measurement and handover
- [x] `data-cta` on the primaries (`lib/track.js` not merged yet)
- [x] Nothing identifier-bearing
- [x] `V2:` line in `OrgPage.jsx` (v5)
- [ ] Review read: `docs/review/oss-family.md` was 5/10 on an older build; v4 and v5 fix its four items. A re-score is pending.

Done here: Film and phone shots for hanzoai and hanzo-app are in `docs/gallery/oss/`, re-shot over the same names.
