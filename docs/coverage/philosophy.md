# /philosophy coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Philosophy.jsx` · gallery: `docs/gallery/philosophy/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Explore the 64 patterns" (to #patterns): solid in the hero, then the sticky ask after the hero. "Build with Hanzo" is a text link with an arrow. The close repeats one solid ask in Hanzo's words ("Explore Hanzo"), with "Read the research" and "View the source" as text links.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order, one idea per screen: the hexagram (what this is), the premise, the five laws, the 64 patterns, how we build, the stack, the questions, the belief statement, the close.

## 3. First impression and page narrative
Done here: The first screen is a stage: one huge hexagram, centred, that changes within 1s with no input and keeps walking the sixty-four in King Wen order, its name and trigrams either side; "The Zen of Hanzo" runs across the foot of the screen (line-mask cut-in), unlike the headline-left/object-right heroes of its neighbours. The whole hero fits 1470×801. No label sits above the headline; "Philosophy" is a caption under it.

## 4. Conversion system
Done here: `data-thumb="Explore the 64 patterns"` drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. One solid button per screen.

## 5. Trust and proof
Done here: Does not apply as numbers: the page makes no figures or claims. Its proof is its completeness: all 64 patterns, each with its principle, practice and question, in Hanzo's words.

## 6. Content presentation (copy untouched)
Done here: Parity is 437/437 text and 10/10 links. Detail sits behind clicks: every pattern opens in one sheet that steps to its neighbours; the matrix and lenses are tabs; all 64 details stay in the server HTML. Captions sit under headlines, never above.

## 7. Visual design system
Done here: v2 scale from `components/v2/ProofScale.css` (display 148/80, headline 56, lede 24, body 19, Zen Mono captions). Ink, greys and whites only, with no hues; changing lines are marked with a dot, not a colour. One dark room: the close.

## 8. UI component library
Done here: Uses the kit (`A`, `More`) and the v2 pieces `MaskLines`, `PinScenes`, `AskBar` and the `DetailSheet` look (one page-local sheet for all 64). The view switch and the lens chips are styled pills (layoutId); no browser-default controls, no native tooltips.

## 9. Motion and interaction
Done here: as listed.
   - Idle: the hero hexagram walks the sixty-four; the premise's one line opens and closes; the laws' last line never settles; the method ring steps round until you point at a step.
   - Pointer: press any hero line and it flips (Beyond: "Change a line"); tiles lift and swap their subtitle for the principle; matrix cells scale; the method hand follows the step you point at; stack rows fill with a clip-path wipe. Press is scale .98 or 1px.
   - State: the view pill and lens pill glide (layoutId), the pattern sheet rises and steps with ← →.
   - Scroll: the pinned five laws (≤ 250svh) and the word-by-word reveal of the belief statement.

## 10. Media
Done here: The page has no Hanzo images or film. Its objects are the hexagrams themselves: the hero oracle, the building law hexagram, 64 tiles, the 8 × 8 matrix, the method ring and the 1 → 2 → 8 → 64 close.

## 11. Mobile and responsive
Done here: At 375px: the hero stacks with the oracle under the ask; the pinned laws become stacked chapters each with its hexagram (only the newest line labelled); tiles are 3 per row; the matrix scrolls inside its own frame; the sheet rises from the bottom. Targets are 44px or more, no sideways scroll, no text under 14px.

## 12. Accessibility
Done here: as listed.
   - Real buttons; the views are `role=tab` with arrow keys; matrix and chips use `aria-pressed`.
   - The sheet traps focus, Esc closes it, ← → step, focus returns to the tile.
   - Hero lines are buttons with labels ("Line 3, open: change it"); `aria-live` only after the visitor changes one.
   - Reduced motion: the walk and every loop stop, the word reveal shows the full sentence.

## 13. Performance and engineering
Done here: Motion is transform, opacity and clip-path only. Idle loops stop off screen (`useInView`, `[data-off]`). No canvas, no video, no blur.

## 14. SEO and machine files
Done here: Metadata and JSON-LD are unchanged (`app/philosophy/page.jsx`). All text is in the server HTML, including all 64 sheet entries and every chapter.

## 15. Catalogue and product pages
Done here: The 64 patterns act as a catalogue: sequence, matrix and lens views, each item opening its detail in a sheet.

## 16. Developer experience
Done here: Does not apply.

## 17. States and resilience
Done here: All content is static, so there is no loading or error state. The lens view has an empty-state line in Hanzo's words; the sheet wraps from 64 to 01. JavaScript off: a `<noscript>` rule lays out every view and all 64 patterns in the page and the belief statement in full ink; measured 0 of 910 text blocks hidden at 1470 (on phone only the matrix's own sideways scroller holds cells off screen).

## 18. Measurement and handover
Done here: `// Persona:`, `// Goal:` and `// CTA:` lines head the page file; every solid ask carries `data-cta` (explore-patterns, explore-hanzo) and AskBar takes the same id. No analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
