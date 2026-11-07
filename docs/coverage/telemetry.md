# /telemetry coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Telemetry.jsx` · styles `Telemetry.css` · shared: `components/v2/StageHero` (split), `x-hamilton/PinScenes`, `Finale`, `x-hamilton/{Demo,Launch.css}` · gallery: `docs/gallery/telemetry/`

1. **Strategy and conversion.** Persona: a platform engineer who wants one collector between apps and backends. Goal: open the repo. One ask, Hanzo's "View on GitHub": solid in the hero (`data-thumb`, `data-cta="primary"`), the ask bar after the hero, the one solid in the closing band (`data-cta="close"`). Metric id: `cta_click:telemetry.primary`.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the collector running → six facts read through its config (pinned, dark) → one dark ending: "Put it in front of your backend" and the ask beside "Your config", then Get Telemetry with the agent prompt.
3. **First impression and page narrative.** Editorial split: the h1 on eight columns, the lede, the ask and the caption ("telemetry.hanzo.ai") beside it, and the collector rising underneath; spans start flowing on arrival. Nothing above the h1. Ends in a band repeating the ask.
4. **Conversion system.** Kit `<Cta>`; one solid per viewport; "Deploy to Cloud" is a text link.
5. **Trust and proof.** The config uses only parts Hanzo names (OTLP over gRPC and HTTP, batching, a memory ceiling, OTLP out); placeholders `${CEILING}` and `${BACKEND}` instead of invented values.
6. **Content presentation (copy untouched).** Parity 29/29 text, 2/2 links. One fact per screen, each with the config block that does it.
7. **Visual design system.** Ink, greys and white only: traces are ink chips, the batch fills white in the dark core, the memory ceiling hatches when it is hit, the lit config line is white on graphite. One dark middle room (the config) and the dark closing band.
8. **UI component library.** Kit `Cta`, `Copy`; "Your config" toggles are outlined `aria-pressed` pills with an ink check when on (44px, press scale); no browser-default controls, no `title=`.
9. **Motion and interaction.** Idle: spans in, batches out, memory rising and refusing (with Pause). Scroll: the stage settles; the chapters light config blocks and pipeline stages. State: "Your config" rewrites the config as you choose.
10. **Media.** No Hanzo media for Telemetry; objects are the collector, the config file and the builder manifest.
11. **Mobile and responsive.** The collector stacks in three panels; chapters stack, each showing only its own config block (not the whole file six times); no page sideways scroll; text ≥14px.
12. **Accessibility.** One h1; 44px Pause (WCAG 2.2.2); toggles `aria-pressed`; contrast ≥4.5:1; reduced motion shows the final collector state.
13. **Performance and engineering.** One timer, only while seen and not paused; transform/opacity only; the batch list and memory gauge hold fixed heights (no layout shift).
14. **SEO and machine files.** Metadata and JSON-LD unchanged; all chapters and config text in the server HTML.
15. **Catalogue and product pages.** Product anatomy: identity, the product working, facts, Get, band.
16. **Developer experience.** A copyable collector config generated from the chosen parts; the agent prompt with honest Copy.
17. **States and resilience.** Collector states: taking, batching, at the ceiling (refused), recovering. JS off shows every word.
18. **Measurement and handover.** `data-cta`: primary, deploy, close. Filmed at 1470×801 and 375×812, no console errors.

**Ledger (deleted):** the amber accent and glow, the red refused/ceiling marks (now a dashed word and a hatch), the magnetic primary, the kicker set above the lede.
