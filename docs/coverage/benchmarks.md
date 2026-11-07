# /benchmarks coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Benchmarks.jsx` · gallery: `docs/gallery/benchmarks/`

1. **Strategy and conversion.** One ask, Hanzo's "Start on Hanzo Cloud" (cloud.hanzo.ai). It is solid in the hero, sticky after the hero, and solid again in the closing room. "The results" and "Every benchmark" are text links with a chevron. Persona, goal and CTA lines sit at the top of the page file.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. A sticky product rail sits under the header (Enso, Kai, Zen 6, Agent harness, Agent platform, Methods, Every benchmark). It has a scroll-spy pill and a "/" jump-to-benchmark search. The order follows a model launch: frontier, figures, Enso, Kai, the board, Zen 6, harness, platform, methods, shelf.
3. **First impression and page narrative.** The headline (display, line-mask cut-in) sits over a full-bleed GPQA frontier. Within 1s, without input, its points plot themselves and it starts reading points aloud. As you scroll, the headline lifts away and the chart settles beside its caption (Stage). After that comes one idea per screen.
4. **Conversion system.** The thumb bar on phones comes from `data-thumb="Start on Hanzo Cloud"`, and `AskBar` gives the same label on desktop once the hero has gone. All three asks carry `data-cta="start-on-hanzo-cloud"`. There is one solid button per screen; sheet triggers and the race button are light.
5. **Trust and proof.** Every figure is Hanzo's, and it sits beside its source:
   - run links and re-run links;
   - API endpoints;
   - commit hashes;
   - "Hanzo-measured; harness private" notes.

   The full tables and methods open in sheets, and Methodology is one press away.
6. **Content presentation (copy untouched).** Parity is 860/860 text and 134/134 links. Detail sits behind (+) sheets, which are kept in the server HTML: the 12 runs, every system, the Decision Suite, the evidence, the trolley and qualification tables, coding, handlers, context lengths, the race numbers, the platform note, methodology and papers. There are no labels above headlines; Hanzo's section labels sit under them as captions.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 116, headline 56, body 19, Zen Mono captions) on a 1440 grid with asymmetric 4/8, 5/7 and 7/5 splits. Colour is ink, greys and silvers only, with no UI hue: Hanzo's series is ink and the rest is grey. Hero objects use 28px radii and tiles 16px. There is one dark middle room (Zen 6) and a dark closing room.
8. **UI component library.** Uses the kit `A` and `More`, plus the v2 pieces `MaskLines`, `PinScenes`, `DetailSheet` and `AskBar`. Seg pills, tool buttons, tick boxes, the shelf checkboxes, the dial's range and the search field are all styled; no control uses browser defaults. Platform and start-up figures are spec-sheet rows (96px, hairlines), not box grids.
9. **Motion and interaction.**
   - Idle: the frontier reads points by itself, the live dot pulses, and the race runs once in view.
   - Pointer: figures slide, tiles and panels lift, spec rows fill with a clip-path wipe, links open their underline, chevrons nudge, presses are .98 or a 1px drop, and scatter points ring.
   - State: the board's eleven rows spring into a new order (layoutId), seg and rail pills glide, sheets rise, and the dial springs.
   - Scroll (about half): the Stage settle, two pinned scenes (Kai in 4 beats, Zen 6 in 3, each ≤ 250svh) with the Zen dial swept by scroll, bars drawing, and headline masks.
10. **Media.** The page has no Hanzo images or film. Its hero objects are product-style data UI: the frontier, the 16 duel tiles, the board, the context dial, the race arena and the 477-byte square drawn to scale.
11. **Mobile and responsive.** At 375px the page is designed for the phone:
   - the Stage lies flat (headline, ask, then chart);
   - the pinned scenes become stacked chapters, each with its visual;
   - a point's record reads in a reserved band under the chart, so nothing moves;
   - targets are 44px or more, there is no sideways scroll, no text is under 14px, and layout shift is 0.
12. **Accessibility.**
   - Real buttons, with `role=tab` and `aria-selected`, `aria-pressed` and `aria-expanded`.
   - The board summary is `aria-live`, and scatter points are focusable with aria-labels.
   - Sheets trap focus and close on Esc, then focus returns. Keyboard focus inside a pinned chapter scrolls to it.
   - Reduced motion shows final states (the Stage lies flat).
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only, with no backdrop blur on the page.
   - Scroll-linked opacity uses function transforms, because Motion's ScrollTimeline acceleration misread the sticky runway.
   - Idle loops (point reading, dial) stop off screen via `useInView`.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/benchmarks/page.jsx`). All text is in the server HTML, including every sheet, every chapter and every visual state. With JS off the Stage lies flat and every text block is visible, including point records and filters.
15. **Catalogue and product pages.** The shelf is a catalogue of 24 runs (of 166). You can search, filter by facet, use saved views, reorder (springs), compare rows of one benchmark in a sticky compare tray, and export CSV or JSON. There is also an index of every benchmark page.
16. **Developer experience.** The regenerate command is a copy-to-clipboard line. The research API endpoints and harness commits are links, and CSV, JSON and copy-link exports sit on every board.
17. **States and resilience.**
   - Shelf: an empty state ("No run on this page matches", with "Show all 166") and a Clear control.
   - Board: "All 11" resets Your suites, and the view is kept in the address.
   - Race: a running state with a disabled button and a "Racing..." label.
   - The figures are static as Hanzo publishes them, so there is no loading or error state.
18. **Measurement and handover.** The asks carry `data-cta`; no analytics are wired yet (pending Hanzo's event log). Filmed with `scripts/motion.mjs`: desktop 0 still screens and layout shift 0.000; phone layout shift 0 after the fix. Gallery: `desktop.mp4`, `desktop.jpg` and `phone-1..3.jpg`.
