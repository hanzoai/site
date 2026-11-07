# /oss/* coverage (PLAN-COMPONENTS areas 2.1–2.18)

Template: `components/pages/oss/OrgPage.jsx`, `oss.css`, `ossData.js` · route `app/oss/[slug]/page.jsx` · 56 members · gallery: `docs/gallery/oss/`

1. **Strategy and conversion.**
   - Persona: developer and researcher. Goal: find a repository and clone it. Metric: GitHub or weights click.
   - One solid ask in Hanzo's words: "<org> on GitHub" (`data-thumb`, `data-cta="oss.hero"`). It is magnetic in the hero.
   - The site's ask bar carries the same words once the hero has gone, at every width.
   - "On Hanzo Forge" and "Every organization" are text links. The open card's own solid button is the repository link, in Hanzo's words.
2. **Information architecture and navigation.**
   - Hanzo's header and footer are unchanged.
   - The page runs: the hero, the two counted chapters, the repositories, then the next four organizations as cards, then the close.
   - "Every organization" leads back to the catalogue twice: in the hero and under the cards.
3. **First impression and page narrative.**
   - At 1470×801 the name and the whole ledger share the first screen: this year's commits huge, the year as a waveform, then repositories, stars and forks. At 375×812 the ledger's lead figure and waveform sit on the first screen under the name and the ask.
   - Something moves within 1 s: the name rises out of its masks and the bars rise.
   - After that, one idea per screen: the counted chapters (one in as the other goes out), the tiles, the cards, the close.
   - Labels never sit above a heading. "Open source · Hanzo" is a meta line under the lede, and the chapter counters are gone (the chapter marks show where you are).
4. **Conversion system.**
   - One filled button per screen: the hero ask; in the open card, the repository link; in the close, the same ask.
   - The tiles' GitHub and Forge links are quiet icons and chips.
5. **Trust and proof.**
   - Every figure is Hanzo's own, read from GitHub and Hanzo Forge on the date the page states (the ledger's corner reads "GitHub Nov 6, 2026").
   - The tiles keep Hanzo's own "N commits this year" and "Pushed …" lines.
6. **Content presentation (copy untouched).**
   - Parity: hanzoai 208/208 text and 123/123 links; hanzo-app 37/37 and 25/25; hanzo-community 72/72 and 77/77.
   - The open card's labels are Hanzo's own (stars, forks, "N commits this year", "Pushed …") or icons.
   - New functional strings live in `content/ui-strings.json` (sort, language, clone from, copy, show all, loading, no match). They are names for icon controls, all `needs_james`.
7. **Visual design system.**
   - v2 type (display sized to the name's longest word, so "hanzo-community" stays one line).
   - 0 UI hues: ink, greys and white. The ledger is white on black over the organization's own contour; the waveforms are silver.
   - Radii 32 and 16. One dark object in the hero, plus one dark closing room.
8. **UI component library.**
   - From the kit: `A`, `Copy` (icon-only here) and `Magnetic`.
   - From Families A: `FamLines`, `FamStage`, `FamChapters`, `FamNext`.
   - The search field, the sort control (three icons in one pill that glides) and the language chips are all styled, so no browser defaults show.
9. **Motion and interaction.** Scroll is 2 of 5 kinds.
   - Idle: the ledger's playhead reads the year, and the contour drifts in the hero and the close.
   - Pointer: the ask is magnetic. A hovered tile lifts and its own playhead reads its bars. A hovered sibling card shows its line. The rail drags with inertia.
   - State: a tile grows into its card (shared-element morph); the sort pill glides; tiles re-flow as you filter.
   - Arrival: the name's masked rise.
   - Scroll: the ledger settles; the chapters swap.
10. **Media.** Hanzo has no photographs or film for an organization. The hero objects are its ledger, waveform and contour (Sigil seeded with `/oss/<org>`).
11. **Mobile and responsive.**
   - At 375 the name, lede, ask and ledger stack, with the lead figure on the first screen.
   - The chips are a swipe rail, and the tiles stack one per row. The open card rises from the bottom.
   - A sideways swipe turns to the next organization (tested: /oss/hanzoai → /oss/hanzobot, /oss/hanzo-app → /oss/hanzo-apps).
   - Targets are 44px or more; no sideways scroll at 375.
12. **Accessibility.**
   - The open card is a modal dialog: focus goes to Close, Escape closes it, and focus returns to its tile (tested).
   - Sort buttons and chips use `aria-pressed`, and icon controls carry names from the register.
   - Waveforms are `role=img` with Hanzo's own label, and search has Hanzo's own `aria-label`.
   - Reduced motion: 0 running animations after load (tested).
13. **Performance and engineering.**
   - Transform and opacity only, CSS animations (paused off screen by the site layer).
   - The tile list skips layout animation above 80 items.
   - Canvases: 2 live contours plus 4 still (6 of 12 allowed).
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every repository and figure is in the server HTML; hidden tiles stay in the DOM as `hidden`.
15. **Catalogue and product pages.**
   - Real `<a href>` reaches every repository on GitHub and the forge, and every sibling organization.
   - The next four organizations are cards: title, own contour and figures, with a stretched link and one tab stop. Their titles are the Morph source into the next page's h1 (`data-morph-target`).
   - Each card shows its own line on hover.
   - At most 6 siblings and 12 canvases. On a phone the tiles are list rows, not a table.
16. **Developer experience.** Each open card hands over `git clone` for GitHub or Hanzo Forge, ready to copy, and the copied text equals the displayed text.
17. **States and resilience.**
   - Empty search shows an icon, the query, and a status read to screen readers.
   - "Show all" loads the rest from GitHub, with a spinner and `aria-busy`. On failure it falls back to Hanzo's own link.
   - JS off: every heading and paragraph is visible (0 hidden, tested).
18. **Measurement and handover.**
   - `data-cta` sits on the hero ask (`oss.hero`), the card link (`oss.card`) and the close (`oss.close`). No analytics are wired yet.
   - Ledger: this round deleted the accent colours, the kicker over the h1, the chapter counters over the headings, the invented sort and card labels, the "Open on GitHub" and "Open on Hanzo Forge" button words, and the visible "Copy clone command" text.
