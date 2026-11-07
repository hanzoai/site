# /comparison coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Comparison.jsx` · gallery: `docs/gallery/comparison/`

1. **Strategy and conversion.** One ask, Hanzo's "Try Hanzo" (hanzo.ai/signup, `data-cta="try-hanzo"`): solid in the hero, in the sticky AskBar after the hero, and again closing the dark room. "Images it runs" is a quiet (+) that opens a sheet; "Put them all back" is a text control.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the question, the bill that answers it, then the part no bill prices, and Hanzo's closing line with the ask. Each screen answers the question the one before raised.
3. **First impression and page narrative.** The headline is centred at Display size (about 111px), and beneath it a slot the receipt feeds out of: a tall centred slip that prints the eleven stacks line by line once the page has arrived (within 1s of it), its total rolling to $225.57/mo. At 1470×801 the slot and the head of the slip are on the first screen.
4. **Conversion system.** `data-thumb="Try Hanzo"` (with `data-href`) drives the phone thumb bar. `AskBar` (watching the hero text) carries the same label and `cta` id on desktop. On phones a dark total pill follows the thumb through the slip once the hero has gone. One solid button per screen.
5. **Trust and proof.** Every line is a compose footprint and compute cost as Hanzo's SBOM serves them; each stack's images, vCPU and GB open in the sheet. The note under the slip says what the figure leaves out. The duties are printed as "$ ?", as Hanzo declines to cost them.
6. **Content presentation (copy untouched).** Parity is 63/63 text. "Comparison" sits under the h1 as a caption; "Run it yourself, and here is the bill" is the slip's real h2; "And the part that is not a line item" is the dark room's h2. Nothing sits above a headline.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css`. Paper white, ink and its alpha steps only: the stack bar is four ink alphas, the line boxes and the slot are ink. One dark room, wiped in.
8. **UI component library.** Uses the kit (`A`) and the v2 pieces `MaskLines`, `PinScenes`, `DetailSheet`, `SceneWipe` and `AskBar`. Every slip line is a styled `role=switch` button; no browser-default controls, no tooltips.
9. **Motion and interaction.**
   - Time: the slip feeds out of the slot and prints line by line; the total is an odometer whose digits roll, right-hand digits first.
   - Pointer: a line's box swells and its name slides 3px, the sheet's plus turns, the reset arrow turns, the ask lifts 1px; presses step 1px or scale .98.
   - State: lines strike through and return, the stack bar regrows on a spring, "same image, more than once" comes and goes, the sheet rises.
   - Scroll: the dark room's wipe and five duty chapters (PinScenes, ≤ 250svh), each printing one more "$ ?" line.
10. **Media.** The page has no Hanzo images or film. Its hero object is product-style paper: the slip, and the unpriced slip in the dark room.
11. **Mobile and responsive.** At 375px the headline stays centred at about 68px, the slip runs full width with 44px lines, the total pill follows the thumb, and the duty chapters stack, each with its single printed line. No sideways page scroll (the sheet's table scrolls inside the sheet), no text under 14px.
12. **Accessibility.**
   - Each line is a button with `role=switch`, `aria-checked` and a spoken "Take out / Add" label with its price.
   - The total is real text for screen readers (the rolling strips are `aria-hidden`), and the full figure stays in the page whatever is selected.
   - Reduced motion: the slip is fed and printed at once and nothing rolls. JS off: a noscript rule shows the slip and every line (checked, 0 hidden).
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only; the slip's shadow is a static pseudo-element.
   - Unprinted lines wait invisible in place and the slip feeds by transform, so printing causes no layout shift.
   - No blur, no video, no canvas, no images.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/comparison/page.jsx`). All text is in the server HTML, including every stack's images and figures, every duty and the full total.
15. **Catalogue and product pages.** Does not apply: a utility page. It is the target of /compare's "Buy it, or run it" card (`data-morph-target` on the slip).
16. **Developer experience.** Image names are shown in mono as their compose files write them; otherwise does not apply.
17. **States and resilience.** The figures are static. Edge states: strike every stack and the slip reads "Nothing running, nothing to pay. Add a stack back."; when the selection repeats an image, "same image, more than once" appears with what the copies reserve.
18. **Measurement and handover.** Persona, Goal and CTA lines head the page file; every ask carries `data-cta="try-hanzo"` for `cta_click`. No analytics are wired yet (BRIEF-v3 §1). Filmed with `scripts/motion.mjs` at desktop; gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
