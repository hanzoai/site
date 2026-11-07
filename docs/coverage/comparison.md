# /comparison coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Comparison.jsx` · gallery: `docs/gallery/comparison/`

1. **Strategy and conversion.** One ask, Hanzo's "Try Hanzo" (hanzo.ai/signup): solid in the hero, then the sticky ask after the hero. "Put them all back" is a quiet text control, not a second button.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the question and the bill, the stacks that make the bill, then the part no bill prices, and Hanzo's closing line. Each screen answers the question the one before raised.
3. **First impression and page narrative.** The first screen holds the headline (line-mask cut-in) and one live object: the receipt, which prints line by line once the page has arrived while its total rolls digit by digit to $225.57/mo.
4. **Conversion system.** `data-thumb="Try Hanzo"` drives the phone thumb bar. `AskBar` (watching the hero itself, not the long bill section) carries the same label on desktop once the hero has gone. On phones a dark total pill also follows the thumb through the stack list.
5. **Trust and proof.** Every line is a compose footprint and compute cost as Hanzo's SBOM serves them; open a line to see each image and what it reserves. The note under the list says what is not in the figure. The unpriced duties are printed as "$ ?", as Hanzo declines to cost them.
6. **Content presentation (copy untouched).** Parity is 63/63 text. Detail sits behind clicks: each stack's images open in place. "Comparison" sits under the headline as a caption; nothing sits above a headline.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 128, headline 56, lede 24, Zen Mono for figures). Paper white, ink and its alpha steps only: the stack bar is four ink alphas, switches are ink. One dark room, wiped in.
8. **UI component library.** Uses the kit (`A`) and the v2 pieces `MaskLines`, `PinScenes`, `SceneWipe` and `AskBar`. The switches are styled over real checkboxes; the plus buttons, the reset and the receipt are custom. No browser-default controls, no tooltips.
9. **Motion and interaction.**
   - Time: the receipt prints after arrival; the total is an odometer whose digits roll, right-hand digits first.
   - Pointer: switches swell, row names slide 3px, the plus grows and turns, the reset arrow turns, the ask's arrow nudges; presses scale .98 or step 1px.
   - State: switches spring, receipt lines re-stack (layout springs), the stack bar regrows, the image lists open, "same image twice" appears.
   - Scroll: the dark room's wipe and five duty chapters (PinScenes, ≤ 250svh), each printing one more "$ ?" line.
10. **Media.** The page has no Hanzo images or film. Its hero objects are product-style paper: the bill and the unpriced bill.
11. **Mobile and responsive.** At 375px the receipt comes straight after the hero copy; stacks become rows with the switch, price, images and figures laid out for the thumb; a sticky total pill follows the list; the duty chapters stack, each with its single printed line. 44px targets, no sideways scroll, no text under 14px.
12. **Accessibility.**
   - Each switch is a real checkbox with a spoken "Take out / Add" label; the plus buttons use `aria-expanded`.
   - The total is real text for screen readers (the rolling strips are `aria-hidden`), and the full figure stays in the page whatever is selected.
   - Reduced motion: the bill is printed at once and nothing rolls. JS off: a noscript rule shows every line.
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only; the receipt's shadow is a static pseudo-element (no filter on the sticky paper).
   - Lines that have not printed wait invisible in place, so printing causes no layout shift (filmed CLS 0.000).
   - No blur, no video, no canvas, no images.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/comparison/page.jsx`). All text is in the server HTML, including every stack's images, every duty and the full total.
15. **Catalogue and product pages.** Does not apply: this is a utility page. It is the target of /compare's "Buy it, or run it" card (`data-morph-target` on the receipt).
16. **Developer experience.** Image names are shown in mono as their compose files write them; otherwise does not apply.
17. **States and resilience.** The figures are static. Edge states: take every stack out and the receipt reads "Nothing running, nothing to pay. Add a stack back."; when the selection repeats an image, the "same image, more than once" block appears with what the copies reserve.
18. **Measurement and handover.** The ask is a standard link; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs` (desktop, 0 still screens, layout shift 0.000; the remaining "dead" hovers are the sticky ask while it is hidden). Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
