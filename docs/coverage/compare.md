# /compare coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Compare.jsx` · gallery: `docs/gallery/compare/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Model routing APIs" (/compare/model-routing, `data-cta="compare-routing"`): solid in the hero, in the sticky AskBar after the hero, and again closing the dark room. "Every row, in full" is a quiet (+) that opens a sheet; the two cards are links, not buttons.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the claim over the table that reads itself, then counting the Yes, the comparison card, and the different question that leads to /comparison. Each screen answers the question the one before raised.

## 3. First impression and page narrative
Done here: At 1470×801 the first screen holds the Display headline across the full width (about 95px, line-mask cut-in) and, right under it, the table as a wide object with four rows showing. Its reading line is on a row within 1s and glides on every 2.6s. After that, one idea per screen.

## 4. Conversion system
Done here: `data-thumb="Model routing APIs"` (with `data-href`) drives the phone thumb bar. `AskBar` carries the same label and `cta` id on desktop once the hero has gone. One solid button per screen.

## 5. Trust and proof
Done here: Every verdict is cut from Hanzo's own row sentence; the full sentence for all seven rows sits one press away in the sheet (and on phones, under each row on tap). Counting the Yes works from the cells themselves, so the tally is checkable.

## 6. Content presentation (copy untouched)
Done here: Parity is 28/28 text and 2/2 links. The main scroll carries only Yes, No or the figure per cell; the sentences live in the sheet. "Hanzo vs" sits under the h1 as a caption; every section's headline is a real h2 ("Count the Yes", "Comparisons", "A different question"). Nothing sits above a headline.

## 7. Visual design system
Done here: v2 scale from `components/v2/ProofScale.css` (Display about 95, headline 56, lede 21–24, Zen Mono captions). Ink and its alpha steps only: Yes in ink, No at 40% grey with a dash, Enso's column raised by weight and a hairline, no tinted rows. Colour comes only from the Enso image. One dark room.

## 8. UI component library
Done here: Uses the kit (`A`) and the v2 pieces `MaskLines`, `DetailSheet`, `SceneWipe` and `AskBar`. Row buttons, count switches and phone row cards are styled; no browser-default controls and no tooltips.

## 9. Motion and interaction
Done here: see below.
- Idle: the reading line glides down the rows by itself (spring), a hairline under it timing the next row; the row it reaches lifts its verdicts.
- Pointer: row names slide 3px, count chips slide 4px, the card's image scales and its arrow moves, the dark card lifts; the ask lifts 1px and presses at .98.
- State: the gliding line, the re-counting figures and bars, the sheet rising, phone rows opening their sentence.
- Scroll: only the dark room's wipe. A moving hand pauses the reading line; a resting pointer lets it go on; a pressed row holds it.

## 10. Media
Done here: The Enso image (Hanzo's own model art) marks the table and fills the card that opens into /compare/model-routing.

## 11. Mobile and responsive
Done here: At 375px the table becomes one card per row: the row name, the four APIs stacked with their Yes or No, and the sentence on tap (44px targets). The ask comes first under the lede. No sideways scroll, no text under 14px.

## 12. Accessibility
Done here: see below.
- Row buttons use `aria-pressed`; the row counter is `aria-live`; phone rows use `aria-expanded`.
- Count chips are buttons with `aria-pressed`; the figures are `aria-live`.
- The sheet traps focus, Esc closes it, focus returns. Reduced motion stops the reading line and shows final states. JS off: every block is legible (noscript override; checked, 0 hidden).

## 13. Performance and engineering
Done here: see below.
- Motion is transform, opacity and clip-path only.
- The reading line's clock is a 10 Hz check that runs only while the table is on screen (`useInView`) and keeps its progress across pauses.
- No blur, no video, no canvas; one image.

## 14. SEO and machine files
Done here: Metadata and JSON-LD are unchanged (`app/compare/page.jsx`). All text is in the server HTML, including every row sentence and "01 / 07".

## 15. Catalogue and product pages
Done here: The index of comparisons is a numbered card (`01`) that opens into its page with the Morph layer (`data-morph` on the image). The destination hero belongs to the /compare/* family owner.

## 16. Developer experience
Done here: Does not apply: no code or install on this page.

## 17. States and resilience
Done here: The table is static (Hanzo's comparison as published), so there is no loading or error state. Counting has an empty state: untick every row and each figure reads "—" with empty bars.

## 18. Measurement and handover
Done here: Persona, Goal and CTA lines head the page file; every ask carries `data-cta="compare-routing"` for `cta_click`. No analytics are wired yet (BRIEF-v3 §1). Filmed with `scripts/motion.mjs` at desktop; gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
