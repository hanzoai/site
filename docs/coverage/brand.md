# /brand coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Brand.jsx` (+ `Brand.css`) · route: `app/brand/page.jsx` · gallery: `docs/gallery/brand/`

1. **Strategy and conversion.** Persona: a designer, partner or journalist who needs Hanzo's marks and rules. Goal: take the brand assets. One ask in Hanzo's words, "Download Assets", metric: the one contact click (the assets ZIP).
   - It is the solid button in the hero, and the ZIP link in the assets panel carries the same `data-thumb`.
   - "Press Kit" and "Contact Us" are outlined, and brand@hanzo.ai is a link with an icon copy control.
   - `data-cta` sits on each action (`brand.hero`, `brand.press`, `brand.assets`, `brand.contact`).
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the mark, the principles, colour, type, components, assets. All 4 links are kept.
3. **First impression and page narrative.**
   - "Hanzo Brand Guidelines." cuts in by line at 128px (line height 0.92). The lede and "Download Assets" sit under it.
   - The mark draws its construction grid and lands its five pieces within a second. It opens once to show its construction, then rests, and opens again under the pointer.
   - Everything fits 1470×801 and 375×812. There are no labels over any headline: "Design System" and "Design Principles" are section names (`aria-label`).
4. **Conversion system.** `data-thumb="Download Assets"` feeds the site's shared ask bar after the hero at every width (`data-ask-name="Hanzo Brand Guidelines"`). The bar steps aside when the assets panel's ZIP link is on screen. Buttons are the kit's `Btn`: press .98, hover lift.
5. **Trust and proof.** The page is its own proof: Hanzo's exact hex values (copyable), the grays' WCAG ratios worked out from those hex values, and the components working in place.
6. **Content presentation (copy untouched).** Parity is 76/76 text and 4/4 links. These invented words were removed: "construction", "mark", "Copied", "Will this gray read?", the three verdict phrases and "Zen ·". The px sizes shown under each type sample were also removed, as figures Hanzo does not publish. Controls name themselves through `aria-label`s.
7. **Visual design system.**
   - 0 UI hues: the proof-red accent is gone. Construction guides, numerals, the slider and the download disc are ink and greys. Hanzo's own swatches and gradients are the page's content.
   - There is one dark room, Color Palette. Hero objects use a 28px radius and cards 16px.
8. **UI component library.** It uses the kit's `A`, `Flap`, `Btn` and `Copy` (icon only here). The swatches are buttons with `aria-pressed` and an icon that swaps to a drawn tick. The background switch is a segmented control with `aria-pressed`. The range slider is fully styled, with no browser default.
9. **Motion and interaction.**
   - Idle: the mark lands and opens once. The specimen's weight sweeps once (4.6s, under 5s) across "Aa" while the heading scale moves with it, then rests.
   - Pointer: the mark opens under the pointer, the gray swatches lift, the principle demos tilt, the card lifts on a spring, and buttons press.
   - State: copy ticks, the background switch, and the contrast ratios flipping on a split-flap board. The slider takes the weight.
   - Arrival: line-mask headlines.
   - Scroll-linked: none.
10. **Media.** No photographs. The objects are Hanzo's own mark (SVG, drawn from its five pieces), its gradients and its swatches.
11. **Mobile and responsive.**
   - At 375: the mark sits under the ask, the principles stack with their demo tiles, the swatches go 2 across, the contrast list is 1 column, and "Aa" is 180px.
   - Targets are 44px or more (copy, switch, buttons). There is no sideways scroll at 320 or 375.
12. **Accessibility.**
   - One h1. The swatches read "name hex" and announce their pressed state.
   - The verdicts are shapes with `role=img` and an accessible name (filled check, half disc, cross), never colour alone.
   - Focus rings are ink with a white halo (white in the dark room).
   - The construction object is `aria-hidden` beside real text. Reduced motion shows the final mark and a still specimen.
13. **Performance and engineering.**
   - Transform and opacity only. The weight sweep animates `font-weight` on one element and the scale, once.
   - There are no infinite loops left, and nothing runs off screen.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every word is in the server HTML, and the masked headlines are real text. JS off shows them through the `<noscript>` rule in the Company MaskLines.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The hex values copy exactly as displayed. The components are live samples.
17. **States and resilience.** If the clipboard is blocked, the tick still confirms the press (it is a control state, not a "Copied" claim in text). The contrast figures are computed, so there is no loading or error state.
18. **Measurement and handover.** `data-cta` on every action, with no analytics yet (PLAN 2.18). Ledger: deleted the red accent, two eyebrows, the endless breathing and weight loops, invented labels and px figures. Gallery: `docs/gallery/brand/`.
