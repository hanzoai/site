# /philosophy coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Philosophy.jsx` · gallery: `docs/gallery/philosophy/`

1. **Strategy and conversion.** One ask, Hanzo's "Explore the 64 patterns" (to #patterns): solid in the hero, then the sticky ask after the hero. "Build with Hanzo" is a text link with an arrow. The close repeats one solid ask in Hanzo's words ("Explore Hanzo"), with "Read the research" and "View the source" as text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order, one idea per screen: the hexagram (what this is), the premise, the five laws, the 64 patterns, how we build, the stack, the questions, the belief statement, the close.
3. **First impression and page narrative.** The first screen holds the headline (line-mask cut-in) and one live object: a hexagram that changes within 1s with no input and keeps walking the sixty-four in King Wen order. No label sits above the headline; "Philosophy" is a caption under it.
4. **Conversion system.** `data-thumb="Explore the 64 patterns"` drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. One solid button per screen.
5. **Trust and proof.** Does not apply as numbers: the page makes no figures or claims. Its proof is its completeness: all 64 patterns, each with its principle, practice and question, in Hanzo's words.
6. **Content presentation (copy untouched).** Parity is 437/437 text and 10/10 links. Detail sits behind clicks: every pattern opens in one sheet that steps to its neighbours; the matrix and lenses are tabs; all 64 details stay in the server HTML. Captions sit under headlines, never above.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 148/80, headline 56, lede 24, body 19, Zen Mono captions). Ink, greys and whites only, with no hues; changing lines are marked with a dot, not a colour. One dark room: the close.
8. **UI component library.** Uses the kit (`A`, `More`) and the v2 pieces `MaskLines`, `PinScenes`, `AskBar` and the `DetailSheet` look (one page-local sheet for all 64). The view switch and the lens chips are styled pills (layoutId); no browser-default controls, no native tooltips.
9. **Motion and interaction.**
   - Idle: the hero hexagram walks the sixty-four; the premise's one line opens and closes; the laws' last line never settles.
   - Pointer: press any hero line and it flips (Beyond: "Change a line"); tiles lift and swap their subtitle for the principle; matrix cells scale; the method hand follows the step you point at; stack rows fill with a clip-path wipe. Press is scale .98 or 1px.
   - State: the view pill and lens pill glide (layoutId), the pattern sheet rises and steps with ← →.
   - Scroll: the pinned five laws (≤ 250svh) and the word-by-word reveal of the belief statement.
10. **Media.** The page has no Hanzo images or film. Its objects are the hexagrams themselves: the hero oracle, the building law hexagram, 64 tiles, the 8 × 8 matrix, the method ring and the 1 → 2 → 8 → 64 close.
11. **Mobile and responsive.** At 375px: the hero stacks with the oracle under the ask; the pinned laws become stacked chapters each with its hexagram (only the newest line labelled); tiles are 3 per row; the matrix scrolls inside its own frame; the sheet rises from the bottom. Targets are 44px or more, no sideways scroll, no text under 14px.
12. **Accessibility.**
   - Real buttons; the views are `role=tab` with arrow keys; matrix and chips use `aria-pressed`.
   - The sheet traps focus, Esc closes it, ← → step, focus returns to the tile.
   - Hero lines are buttons with labels ("Line 3, open: change it"); `aria-live` only after the visitor changes one.
   - Reduced motion: the walk and every loop stop, the word reveal shows the full sentence.
13. **Performance and engineering.** Motion is transform, opacity and clip-path only. Idle loops stop off screen (`useInView`, `[data-off]`). No canvas, no video, no blur.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/philosophy/page.jsx`). All text is in the server HTML, including all 64 sheet entries and every chapter.
15. **Catalogue and product pages.** The 64 patterns act as a catalogue: sequence, matrix and lens views, each item opening its detail in a sheet.
16. **Developer experience.** Does not apply.
17. **States and resilience.** All content is static, so there is no loading or error state. The lens view has an empty-state line in Hanzo's words; the sheet wraps from 64 to 01.
18. **Measurement and handover.** The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
