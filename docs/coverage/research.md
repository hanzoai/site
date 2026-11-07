# /research coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Research.jsx` · gallery: `docs/gallery/research/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Explore papers.hanzo.ai ↗": solid in the hero, then the sticky ask after the hero. "Specifications (HIPs) ↗" and "Benchmarks" are text links. Each opened title page carries one solid "Read on papers.hanzo.ai ↗" (or hips.hanzo.ai) and a plain Close.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the newest papers (hero deck), the library at a glance, the index (kinds rail, search, list), the open-source note.

## 3. First impression and page narrative
Done here: The first screen is a desk: the six newest title pages laid across the whole width, the headline set over them at the lower left (not a headline-left/object-right hero like its neighbours). One sheet lifts within 1s with no input and every few seconds after; point at one and it lifts, press it and it opens to full size. The whole desk fits 1470×801. No label sits above the headline; "Research" is a caption under it.

## 4. Conversion system
Done here: `data-thumb` on the hero ask drives the phone thumb bar; `AskBar` carries the same label on desktop once the hero has gone. One solid button per screen.

## 5. Trust and proof
Done here: Every paper links to its own page on papers.hanzo.ai and every HIP to hips.hanzo.ai. The tally (19 papers, 6 specifications, 5 standards) is a count of Hanzo's own list, nothing more.

## 6. Content presentation (copy untouched)
Done here: Parity is 91/91 text and 34/34 links. The hero's six captions ("01 / 06", date and subtitle) are all in the HTML, the current one shown. Detail opens from the row: the paper's title page.

## 7. Visual design system
Done here: v2 scale from `components/v2/ProofScale.css` (display 128, headline 56, figure 240, body 19, Zen Mono captions). Ink, greys and whites only; the title pages are typeset in ink. One dark room: the open-source close.

## 8. UI component library
Done here: Uses the kit (`A`, `More`) and the v2 pieces `MaskLines`, `SceneWipe`, `AskBar`. The kinds rail is a styled list with a gliding pill (layoutId), the search is a styled field, the month bars are styled buttons; no browser defaults, no native tooltips.

## 9. Motion and interaction
Done here: as listed.
   - Idle: one desk sheet lifts at a time, its caption reading out beside the ask.
   - Pointer: rows fill from the left with a clip-path wipe and their sheet lifts and tilts; the ↗ button fills; bars rise; the deal arrows lift. Press is scale .98 or 1px.
   - State: the row's sheet opens into a full title page (shared layoutId), the kinds pill glides, the list re-flows (layout) as you filter.
   - Scroll: the desk's sheets drift apart at their own depths as you leave the hero, and the dark room wipes in.

## 10. Media
Done here: The page has no Hanzo images or film. Its objects are typeset title pages: the hero deck, a small sheet per row, the opened page.

## 11. Mobile and responsive
Done here: At 375px: the desk is two loose rows of three sheets above the headline, which overlaps their foot; the tally stacks into rows; the kinds rail is a 2 × 2 grid above the list; rows put the date above the title; the opened page fits the screen. Targets are 44px or more, no sideways scroll, no text under 14px.

## 12. Accessibility
Done here: Rows are real buttons that open a dialog (`aria-haspopup`), with a separate link to the paper; the reader moves focus to Close, Esc closes, focus returns to the row. The month bars and kinds use `aria-pressed`; the search has a label. Reduced motion: the deck holds still, the open is a cross-fade.

## 13. Performance and engineering
Done here: Motion is transform, opacity and clip-path only. The deck stops dealing off screen (`useInView`). No canvas, no video, no blur.

## 14. SEO and machine files
Done here: Metadata and JSON-LD are unchanged (`app/research/page.jsx`). All text and all 34 links are in the server HTML.

## 15. Catalogue and product pages
Done here: The library is the catalogue: filter by kind, search, filter by month (Beyond: "When it was published"), each item opening its title page.

## 16. Developer experience
Done here: The HIPs (specifications and standards) are listed and linked as Hanzo publishes them.

## 17. States and resilience
Done here: Empty state: "Nothing in the library by that name." with a Clear button; the active month shows as a removable chip. Content is static, so there is no loading or error state. JavaScript off: a `<noscript>` rule lists all six hero captions; measured 0 hidden text blocks at 1470 and at 375.

## 18. Measurement and handover
Done here: `// Persona:`, `// Goal:` and `// CTA:` lines head the page file; every solid ask carries `data-cta` (explore-papers, read-paper, github) and AskBar takes the same id. No analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
