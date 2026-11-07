# /integrations/* coverage (PLAN-COMPONENTS areas 2.1–2.18)

Template: `components/pages/integrations/Guide.jsx`, `intParts.jsx`, `guide.css`, `intData.js` · route `app/integrations/[slug]/page.jsx` · 19 guides · gallery: `docs/gallery/integrations/` (the index page has its own `docs/coverage/integrations.md`).

1. **Strategy and conversion.**
   - Persona: developer. Goal: connect this tool to Hanzo with one paste. Metric: `api_key_created` (leading: `install_copy`).
   - One solid ask, the guide's own first action (e.g. "Get API key — Free"), sits beside the promise in the hero (magnetic, `data-thumb`, `data-cta="integrations.hero"`).
   - The site's ask bar carries the same words after the hero, and the dark close repeats it (`integrations.close`).
2. **Information architecture and navigation.**
   - Hanzo's header and footer are unchanged.
   - Hanzo's breadcrumb ("Integrations / Cursor") sits in the meta row under the lede, as real links.
   - The six nearest guides are cards that open. The other twelve follow as a quiet list of links, so every guide is one tap away.
3. **First impression and page narrative.**
   - At 1470×801 the promise, the lede, the tool's badge and the ask share the first screen with the editor, whose first 8 lines type themselves within the first second. At 375×812 the editor's first lines sit under the ask.
   - No label sits above a heading: the badge, category and crumbs moved under the lede, and the chapter counters are gone.
   - One idea per screen: the editor, one chapter per sample, the credit, the cards, the close.
4. **Conversion system.** One filled button per screen. The close's second action is outlined, and every Copy is an icon.
5. **Trust and proof.** The proof is the working code: Hanzo's own samples, with the lines that point at Hanzo marked and counted ("2 / 9").
6. **Content presentation (copy untouched).**
   - Parity: langchain 92/92 text and 23/23 links; cursor 77/77 and 23/23; openai-sdk 93/93 and 23/23.
   - New functional strings live in `content/ui-strings.json`: "Only the Hanzo lines", "lines point at Hanzo", "Copy", "Copy base URL". They are names for icon controls, all `needs_james`.
7. **Visual design system.**
   - v2 type. 0 UI hues, code included: tokens differ by weight and grey step.
   - Hanzo's lines carry a grey band, a bold line number and an ink dot in the gutter (no coloured stripe).
   - The tools' own emoji badges are the only colour. Radii 32 and 16. One dark room, the close.
8. **UI component library.**
   - From the kit: `A`, `Copy` (icon-only) and `Magnetic`.
   - From Families A: `FamLines`, `FamStage`, `FamChapters`, `FamNext`, plus `Sigil`.
   - The "Only the Hanzo lines" switch is a styled toggle, not a browser checkbox.
9. **Motion and interaction.** Scroll is 2 of 6 kinds.
   - Time: the first sample types itself, once, in about 4 s (text nodes, no state per character).
   - State: the switch dims every window at once; a card opens into its guide.
   - Pointer: the ask is magnetic; the rail drags with inertia; a hovered card shows Hanzo's line for that tool; the list links slide.
   - Idle: the guide's contour drifts in the close.
   - Arrival: the promise's masked rise.
   - Scroll: the editor settles; the chapters wipe.
10. **Media.** Hanzo has no film or photographs for a guide. The hero object is the editor (real code) beside the route to Hanzo over the guide's own still contour (Sigil seeded with `/integrations/<tool>`).
11. **Mobile and responsive.**
   - At 375 the editor stacks its connection under the code, and the chapters stack.
   - The card rail swipes, and the list becomes two columns.
   - A sideways swipe turns to the next guide (tested: langchain → llamaindex, cursor → docker).
   - Targets are 44px or more; no sideways scroll.
12. **Accessibility.**
   - Code blocks are focusable with a label. The switch is a button with `aria-pressed`, and its count is read in full.
   - The route diagram is decorative (`aria-hidden`); the base URL and the key line are real text beside it.
   - Reduced motion: no typing, 0 running animations after load (tested).
13. **Performance and engineering.**
   - Typing writes text nodes in one rAF loop that stops when done.
   - Canvases: 1 still and 1 live contour, plus up to 6 still card contours (8 of 12 allowed).
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every sample is in the server HTML in full; the typing only blanks it in the browser.
15. **Catalogue and product pages.**
   - Six sibling cards, each with its title, Hanzo's one line on hover, its badge and its own still contour. Each is a stretched link and the Morph source into the next guide's h1 (`data-morph-target`).
   - The rest are real links. At most 6 cards and 12 canvases.
16. **Developer experience.** Copy on every sample and on the base URL, and the copied text equals the displayed text. "Only the Hanzo lines" shows how little of your code changes.
17. **States and resilience.**
   - JS off: every sample, heading and paragraph is visible (0 hidden, tested).
   - The data is static, so there is no loading or error state.
18. **Measurement and handover.**
   - `data-cta` sits on the hero ask and on the close. No analytics are wired yet.
   - Ledger: this round deleted the accent colours and syntax hues, the coloured gutter stripe, the "Frameworks" kicker over the h1, the chapter counters over the headings, and the visible "Only the Hanzo lines", "Copy" and "Copy base URL" words.
