# /compare coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Compare.jsx` · gallery: `docs/gallery/compare/`

1. **Strategy and conversion.** One ask, Hanzo's "Model routing APIs" (/compare/model-routing): solid in the hero, then the sticky ask after the hero. "Every row, in full" is a quiet (+) that opens a sheet, and the two cards are links, not buttons.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the claim and the live board, the full table you can count, the comparison card, then the different question that leads to /comparison. Each screen answers the question the one before raised.
3. **First impression and page narrative.** The first screen holds the headline (line-mask cut-in) and one live object: the verdict board. Its progress line runs within 1s, and a row flips by itself every 3.4s. After that, one idea per screen.
4. **Conversion system.** `data-thumb="Model routing APIs"` drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. There is one solid button per screen.
5. **Trust and proof.** Every verdict is cut from Hanzo's own row sentence, and the full sentence for all seven rows sits one press away in the sheet. The table foot re-counts each API's Yes from the cells, so the tally is checkable.
6. **Content presentation (copy untouched).** Parity is 28/28 text and 2/2 links. Detail sits behind clicks: the row sentences in a sheet, one row at a time on the board. "Hanzo vs" and "Model routing APIs" sit under their headlines as captions; nothing sits above a headline.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display about 68, headline 56, lede 24, Zen Mono captions). Ink, greys and alpha steps only: Yes is ink with a tick, No is grey with a dash, and Enso's lane is the one inverted (ink) tile. Colour comes only from the Enso image. One dark room.
8. **UI component library.** Uses the kit (`A`) and the v2 pieces `MaskLines`, `DetailSheet`, `SceneWipe` and `AskBar`. The row pills, the count switches and the table are styled; no control uses browser defaults and there are no tooltips.
9. **Motion and interaction.**
   - Idle: the board walks the seven rows by itself; a hairline times the next row.
   - Pointer: pills lift 1px, lanes lift 2px, table rows fill and their names slide 3px, switches swell, cards lift and their image or arrow moves; presses scale .98 or .94.
   - State: the row pill glides (layoutId spring), lanes flip in masks, the Yes figures and bars re-count, the sheet rises.
   - Scroll: only the dark room's wipe. A moving hand pauses the board; a resting pointer lets it go on.
10. **Media.** The Enso image (Hanzo's own model art) is the board's mark and the full card that opens into /compare/model-routing.
11. **Mobile and responsive.** At 375px: the headline breaks into five short lines, the board stacks under the ask with 44px row pills, the table scrolls sideways inside its frame with the row column pinned, and the card and dark room stack. No sideways page scroll, no text under 14px.
12. **Accessibility.**
   - The pills are a `role=tablist` with arrow keys; the counter is `aria-live`.
   - Count switches are buttons with `aria-pressed` and a spoken label; the table foot is `aria-live`.
   - The sheet traps focus, Esc closes it, and focus returns. Reduced motion stops the board and shows final states.
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only.
   - The board's clock is a 10 Hz check that runs only while the board is on screen (`useInView`), and stops for reduced motion.
   - No blur, no video, no canvas; one image.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/compare/page.jsx`). All text is in the server HTML, including every row sentence in the sheet and "01 / 07".
15. **Catalogue and product pages.** The index of comparisons is a numbered card (`01`) that opens into its page with the Morph layer (`data-morph` on the image).
16. **Developer experience.** Does not apply: no code or install on this page.
17. **States and resilience.** The table is static (Hanzo's comparison as published), so there is no loading or error state. Counting has an empty state: untick every row and each figure reads "—" with empty bars.
18. **Measurement and handover.** The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop, 0 still screens, layout shift 0.000; the remaining "dead" hovers are the sticky ask while it is hidden). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
