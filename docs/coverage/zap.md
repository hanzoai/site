# /zap coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Zap.jsx` · gallery: `docs/gallery/zap/` · Persona: developers running many agents against shared MCP tool servers · Goal and metric: `install_copy` (zapd from the quick start) · CTA: "Read the docs" → zap-proto.dev/docs/quick-start

1. **Strategy and conversion.** One ask, Hanzo's "Read the docs": solid in the hero (`data-thumb`, `data-cta="zap.hero"`), in the ask bar after the hero, solid again at "Point one agent at it" (`data-cta="zap.close"`). Papers, GitHub, "Deploy to Cloud" and "Self-host" are outlined.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the wire (hero) with four hero figures, why bother (eight packets that open), four lines and it is running, how it is put together (figures, diagram, the fleet counter), point one agent at it, read the protocol, Get ZAP.
3. **First impression and page narrative.** "ZAP" cuts in over the dark room; under it the pointer jumps to a field while the JSON lane is walked character by character, on its own, within a second. The four figures step underneath.
4. **Conversion system.** One solid per viewport; the terminal's Copy copies the four commands shown.
5. **Trust and proof.** "we have not published a benchmark and will not quote one we cannot show you" stays beside the mechanism claims; the fleet counts processes only, never time.
6. **Content presentation (copy untouched).** Parity 71/71, 7/7. "Zero-Copy Agent Protocol" sits under the headline with Hanzo's Enso mark; "Go · Rust · TypeScript" sits under its headline. The eight reasons open into sheets; all text is in the HTML.
7. **Visual design system.** v2 scale. 0 UI hues: pointer, walked text and chosen field are white/silver in the dark room; zapd is an ink block with a halo. One dark room (the hero). The ASCII diagram is an ink object on white.
8. **UI component library.** Kit `A`, `Img`, `Copy`, `Magnetic`; v2 `Settle`, `OpenCards`, `x-gauss/LineMask`, `Pause`, `NoJs`. "Read a field" is a `radiogroup`; the slider is labelled.
9. **Motion and interaction.**
   - Idle: pointer versus parser runs itself; the four figures step; the terminal types its four lines; the fleet grows from 1 to 16 agents.
   - Pointer: magnetic ask; packets lift and open; choose a field.
   - State: packets morph into sheets; the slider re-counts processes (the Beyond).
   - Time: the parser's walk is real-time, one character per 22ms.
   - Scroll: only the wire's settle.
   - Pause buttons on the wire, the terminal and the fleet.
10. **Media.** Hanzo's Enso mark (kit `Img`); the rest is product UI (buffer, JSON lane, terminal, diagram, processes).
11. **Mobile and responsive.** At 375px the buffer shows half-words, labels only on the chosen field; figures two by two; sheets rise from the bottom; targets 44px; no sideways scroll.
12. **Accessibility.** One h1. JS off: `NoJs`. Sheets trap focus and return it.
13. **Performance and engineering.** The walker writes straight to text nodes (no React state per character); loops stop off screen and when paused.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The four `zapd` commands with Copy; the address `zap://localhost:9999`.
17. **States and resilience.** Static content; the fleet clamps between 1 and 100.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/zap/`.
