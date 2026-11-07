# /sentinel coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Sentinel.jsx` · styles `Sentinel.css` · shared: `components/v2/StageHero` (side), `Finale`, `x-hamilton/{Demo,Launch.css}` · gallery: `docs/gallery/sentinel/`

1. **Strategy and conversion.** Persona: an engineer whose frontend and services throw errors they can't reproduce. Goal: read the migration docs. One ask, Hanzo's "Read the docs": solid in the hero (`data-thumb`, `data-cta="primary"`), carried by the ask bar after the hero, and the one solid in the closing band (`data-cta="close"`). Metric id: `cta_click:sentinel.primary`.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the issue view → ten thousand events into one issue (pinned dark scene) → five facts as stacking sheets → Get Sentinel and the agent prompt → closing band.
3. **First impression and page narrative.** At 1470×801 the h1, its caption ("sentry.hanzo.ai", under the h1), the lede, the ask and the live issue view share the first screen; the count ticks and the histogram grows within a second. Ends in a band repeating the hero ask.
4. **Conversion system.** Kit `<Cta>` for every action; one solid per viewport; "View on GitHub" and "Deploy to Cloud" are text links.
5. **Trust and proof.** Hanzo's fork statement (Functional Source License, Sentry trademark) is a sheet of its own with its lineage picture; licence chip BSL-1.1 in Get Sentinel.
6. **Content presentation (copy untouched).** Parity 29/29 text, 3/3 links. One fact per screen; chapter numbers sit under their headlines.
7. **Visual design system.** Ink, greys and white only: the issue tag is an ink outline, the slow span and the regressed release are ink against silver, accounts are grey discs. One dark middle room (the collapse) and the dark closing band.
8. **UI component library.** Kit `Cta`, `Copy`; the alert router's choices are real `aria-pressed` buttons with press scale and ink selection; no `title=` tooltips, no browser-default controls.
9. **Motion and interaction.** Idle: the issue's count, histogram and source-map resolve (with Pause); the event rain (with Pause). Scroll: the stage, the collapse scrub and the stacking sheets. State: the router builds its sentence; the issue card's "1 issue" chip arrives at the end of the collapse.
10. **Media.** No Hanzo media for Sentinel; objects are product UI (issue view, trace waterfall, release bars, account list, router) and a 2D canvas.
11. **Mobile and responsive.** The collapse plays by itself when seen (no pin); sheets stack; the router wraps; no sideways scroll; targets ≥44px; text ≥14px.
12. **Accessibility.** One h1; 44px Pause on both self-running objects (WCAG 2.2.2); router outcome in `aria-live`; contrast ≥4.5:1; reduced motion shows the resolved issue and the full count.
13. **Performance and engineering.** One canvas loop, only while seen and not paused; the count is written straight into a text node; transform/opacity only.
14. **SEO and machine files.** Metadata and JSON-LD unchanged; every word in the server HTML.
15. **Catalogue and product pages.** Product anatomy: identity, the product working, facts, Get, band.
16. **Developer experience.** Agent prompt with honest Copy; docs link is the ask.
17. **States and resilience.** Issue states: minified → source-mapped; unresolved tag; JS off shows every word.
18. **Measurement and handover.** `data-cta`: primary, primary-2, deploy, close, close-view-on-github. Filmed at 1470×801 and 375×812, no console errors.

**Ledger (deleted):** the violet accent and its glows, the coloured account discs, the red regression bar and missed-cron ring (now ink), the eyebrow above the h1, the numbers above chapter headlines, the magnetic primary.
