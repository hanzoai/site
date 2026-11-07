# /investors coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Investors.jsx` (+ `Investors.css`) · route: `app/investors/page.jsx` · gallery: `docs/gallery/investors/`

1. **Strategy and conversion.** Persona: an investor (or press) doing diligence (PLAN 1.1). Goal: reach investor relations. One ask in Hanzo's words, "Contact investor relations" (mailto:ir@hanzo.ai), metric: the one contact click. It is the only solid button on the page. "See the research" and "Book a call" are outlined, and ir@hanzo.ai is an underlined link. `data-cta` sits on each action (`investors.hero`, `investors.research`, `investors.call`).
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the headline and the figure counter, then the thesis (smarter, faster, cheaper), the stack, the results, the commit record, what Hanzo built, people and structure, every figure to its source, and the close. All 43 links are kept.
3. **First impression and page narrative.**
   - "The intelligence layer for business." cuts in by line at Display size (line height 0.92). The lede and "Contact investor relations" sit under it, and the counter rolls in to the right.
   - All of it fits 1470×801 and 375×812, and something moves within a second.
   - There are no labels over the h1 or any headline. "Hanzo Investor Relations" is the hero section's name and the ask bar's page name. "Hanzo.Thesis · one platform" names the pinned thesis.
4. **Conversion system.** `data-thumb="Contact investor relations"` feeds the site's shared ask bar after the hero at every width, named by `data-ask-name`. Buttons are the kit's `Btn`: press .98, hover lift.
5. **Trust and proof.**
   - Each of the seven figures carries Hanzo's own name for it and links to the run it comes from: the counter, the results room and the "Read the source" list.
   - Qualifiers stay beside the figures ("Up to 200×", "~3,665", "95% interval 2.06–4.36×").
   - The commit record shows the heatmap and the latest commits with their links.
   - Products Hanzo built appear as a still logo wall.
6. **Content presentation (copy untouched).** Parity is 131/131 text and 43/43 links, with no new visible words. Control names are `aria-label`s: Pause and Replay on the counter, and Hanzo's "Read the source" on the source arrow. The detail lives in the pinned thesis, the cells and the list.
7. **Visual design system.**
   - Type and space follow `vc-type.css`, with figures in tabular numerals as heroes.
   - 0 UI hues: ink, greys and alpha steps. The heatmap is a grey ladder, and Enso's bar is white in the dark room. Colour comes only from the partners' and customers' own logos on hover.
   - There is one dark room: the results.
8. **UI component library.** It uses the kit's `A`, `Img` (logos, with a reserved box and a fallback to the name) and `Btn`, plus `Sigil`. The ticks are real buttons with `aria-pressed` and a drawn check; the native checkboxes are gone. There are no native tooltips.
9. **Motion and interaction.**
   - Idle: the counter rolls digit by digit through the seven figures once and rests on the first, with Pause and Replay. The Sigil at the close drifts and leans toward the pointer.
   - Pointer: the logo wall tiles light up and the logos regain colour and scale, the source arrows nudge, and buttons lift and press.
   - State: the counter steps, and the list ticks draw and fill the giant counter.
   - Scroll (1 of 5 kinds): the pinned thesis chapters.
   - Arrival: line-mask headlines.
10. **Media.**
   - Logos use the kit's `Img` with width and height reserved; a failed load becomes the name set in type.
   - The executives' discs show Hanzo's portraits, with a grey disc as fallback; the visible initials are gone.
   - There is no video.
11. **Mobile and responsive.**
   - At 375 the counter sits under the ask, the chapters stack with their visuals, the wall is 3 across, and the list stacks the figure over its name.
   - All targets are 44px or more, and there is no sideways scroll at 320 or 375.
12. **Accessibility.**
   - One h1. The counter's label is `aria-live="polite"`, and its steps are buttons with `aria-pressed` and names that read the figure.
   - The ticks are toggle buttons, and the giant counter announces politely.
   - Focus rings are ink with a white halo (white in the dark room).
   - Reduced motion: the counter does not roll, and the final state shows.
13. **Performance and engineering.**
   - Transform and opacity only. The counter runs only while seen and stops after one round, and the Sigil pauses off screen.
   - The infinite marquee was deleted.
   - The ticked state is kept in localStorage with try/catch.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All seven figures and every chapter are in the server HTML. JS off shows the headlines through the `<noscript>` rule in the Company MaskLines.
15. **Catalogue and product pages.** Not a catalogue. As a company page it has an identity hero, three facts as chapters, proof cells, structure and a closing ask.
16. **Developer experience.** Not applicable beyond the public commit record, which links each commit and the source.
17. **States and resilience.** The figures are a static snapshot from Hanzo's page ("Forge listing · read Nov 6, 06:04" shown). A failed logo becomes its name, a failed portrait leaves a grey disc, and blocked storage starts the list empty.
18. **Measurement and handover.** `data-cta` on every action, with no analytics yet (PLAN 2.18). Ledger: deleted the indigo accent, two eyebrows, the endless counter loop, the endless marquee, native checkboxes, invented labels (including "Open the source", "Check our work", "Every figure, to its run", "checked" and composed figure names) and the visible initials. Gallery: `docs/gallery/investors/`.
