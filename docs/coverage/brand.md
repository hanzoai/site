# /brand coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Brand.jsx` (+ `Brand.css`) · route: `app/brand/page.jsx` · gallery: `docs/gallery/brand/` · review: `docs/review/brand.md` (6/10, fixed in its order)

1. **Strategy and conversion.** Persona: a designer, partner or journalist who needs Hanzo's marks and rules. Goal: take the brand assets. One ask in Hanzo's words, "Download Assets", metric: the one contact click (the assets ZIP).
   - It is the only solid button in the hero. The ZIP link in the assets panel carries the same `data-thumb`.
   - "Press Kit" and "Contact Us" are outlined, and brand@hanzo.ai is an underlined link.
   - `data-cta` sits on each action (`brand.hero`, `brand.press`, `brand.assets`, `brand.contact`).
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the mark's construction, the three principles, colour, type, components, assets. All 4 links are kept (parity 4/4).
3. **First impression and page narrative.**
   - "Hanzo Brand Guidelines." cuts in by line at 128px (line height 0.92), once the arrival curtain has lifted (`useArrived`). The lede and asks follow 0.45s later.
   - The mark's construction is drawn full-bleed across the right of the stage, bleeding off the edges; it is not a card, so it no longer repeats /press's hero. After the curtain, the guides draw, the five pieces land, and the mark opens once to show its build.
   - It then stays alive: the pieces lean toward the pointer anywhere in the hero (soft spring), and the compass (circle, diagonal and ticks) turns once a minute. A 44px Pause control stops the turning.
   - The h1, lede and "Download Assets" fit 1470×801, 375×812 and 320. On phones the drawing sits under the ask.
   - Then come scenes rather than a document: the principles pin and replace one another; the colour room's strip fans open from one bar into six; the specimen's weight sweep plays when the specimen itself is 60% on screen.
4. **Conversion system.** `data-thumb="Download Assets"` feeds the site's shared ask bar after the hero at every width (`data-ask-name="Hanzo Brand Guidelines"`), and the bar steps aside while the ZIP link is on screen. The buttons are the kit's `Btn`: press .98, hover lift.
5. **Trust and proof.** The page is its own proof: Hanzo's exact hex values (copyable), each gray's WCAG AA verdict worked out from those hex values, and components that work in place.
6. **Content presentation (copy untouched).**
   - Parity is 76/76 text and 4/4 links, with no new visible words or figures. These were removed: the contrast ratios, the weight readout with its 100 and 900, the bench's "→ PRIMARY BUTTON" echo, "construction", "mark" and "Copied".
   - "Design System" and "Design Principles" are section names (`aria-label`). "01 / 03" is now the giant numeral that is each principle's visual, not a kicker over its headline.
   - Hanzo's group words (Brand Colors, Gray Scale, Gradients, Buttons, Cards, Badges) are real h3 headings in title type, not mono eyebrows.
7. **Visual design system.**
   - Hanzo's black, white and greys only. Values come from CANON as page tokens at the top of `Brand.css`: no literal hex below that block except the Success Badge sample, which is Hanzo's own component.
   - Radii are 32, 24, 16 and 10 (CANON). Springs are SOFT {300,30} and SLOW {90,18}. Press is .98.
   - There is one dark room, Color Palette.
8. **UI component library.**
   - Swatches and the e-mail copy are buttons with `aria-pressed`. A tick replaces the copy icon only when the clipboard write succeeds; a blocked clipboard leaves the icon as it was.
   - The background switch is a segmented control. The slider is fully styled.
   - Hovers sit inside `@media (hover: hover)`: the gray swatch widens (flex-grow, not a lift inside a clipped strip), the big swatches lift their name and copy icon, the inactive segment lightens, Link Button's underline drops, brand@hanzo.ai thickens its underline, and the card lifts.
9. **Motion and interaction.**
   - Arrival (after the curtain): line-mask headlines, then the drawing's guides and pieces.
   - Idle: the compass turns, with a pause control. The mark opens once.
   - Pointer: the pieces lean toward the pointer anywhere in the hero, plus the hovers listed above and presses.
   - State: copy ticks, the background switch (the verdict shapes spring in), and the slider taking the weight.
   - Scroll (2 of 5 kinds): the pinned principles and the gray strip fanning open.
   - The signature sweep (200 → 900 → 560, 4.6s, once) starts when the specimen is 60% visible.
10. **Media.** No photographs. The objects are Hanzo's own mark (SVG from its five pieces), its gradients, its swatches, and the logo plates the ZIP holds (mark on black, white and grey).
    - **Open:** `/press/hanzo-press-kit.zip` is not in `public/`. The dev server proxies it from hanzo.ai, which this cloud box cannot reach, so it needs mirroring (PLAN 2.10, conductor or media chat).
11. **Mobile and responsive.**
    - At 375 and 320 the hero copy and ask come first and the drawing follows. The principles stack, each with its numeral. The swatches go 2 across and the contrast list to 1 column.
    - At 360 and under, the assets headline is 30px and the segment labels shrink and don't wrap.
    - Targets are 44px or more. There is no sideways scroll at 320 or 375.
12. **Accessibility.**
    - Headings: one h1; h2 for each principle, Color Palette, Typography, Components and the assets headline; h3 for the groups; h4 for the sample card.
    - Verdicts are shapes with `role=img` and an accessible name, never colour alone, right-aligned in their row.
    - Focus rings are ink with a white halo (white in the dark room).
    - Reduced motion: the final mark, no compass turn (no pause control), the principles stacked, and a still specimen.
13. **Performance and engineering.**
    - Transform and opacity, plus SVG `pathLength` on the arrival and `font-weight` on the specimen once.
    - One continuous mover (the compass), only while the hero is seen, with a pause control.
    - Tick positions are rounded so the server and browser markup match (no hydration warning).
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every word is in the server HTML. With JS off, the hero's lede, asks and the whole drawing show (a page-level `<noscript>` rule). The masked headlines and the pinned principles use the Company kit's `<noscript>` rules.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The hex values copy exactly as displayed. The components are live samples.
17. **States and resilience.** Copy fails quietly: no tick and no claim. The verdicts are computed, so there is no loading or error state. The ZIP is the one asset this repo does not hold (see 10).
18. **Measurement and handover.** `data-cta` on every action; no analytics yet (PLAN 2.18). Ledger: deleted the red accent, every eyebrow and kicker over a headline, the card hero /press shared, the endless breathing and weight loops, the invented words and figures, and the tick on a failed copy.
    - **Open, for James:** the aria strings ("Pause", "Replay", "Copy", "Font weight", "Background", the three WCAG verdict names) wait for `content/ui-strings.json`, which does not exist yet.
