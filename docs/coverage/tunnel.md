# /tunnel coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Tunnel.jsx` · styles `Tunnel.css` · shared: `components/v2/Finale`, `x-hamilton/{Demo,Launch.css}` · gallery: `docs/gallery/tunnel/`

1. **Strategy and conversion.** Persona: a developer who needs a real URL for something on their laptop. Goal: install the CLI and share a port. One ask on one href (github.com/hanzoai): "View Source" solid in the hero (`data-thumb`, `data-cta="primary"`), the ask bar after the hero, "View on GitHub" the one solid in the closing band. "Install the CLI" is an outline button, "See Pricing" a text link. Metric id: `cta_click:tunnel.primary`.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the command and its URL → the URL opens and closes (pinned dark scene, facts 01 and 05) → the other four facts (02 with the name builder it acts out, 03, 04, 06 with the modes) → one command (Hanzo's three lines) → one dark ending: "Get started with Tunnel" and the ask beside the live share, then Get Tunnel with the agent prompt.
3. **First impression and page narrative.** Terminal-first: the h1, its caption ("hanzo share", under the h1), Hanzo's sentence and the ask, then `hanzo share 3000` types and the public URL lands as a second headline, all within 1470×801. Ends in a band repeating the ask.
4. **Conversion system.** Kit `<Cta>`; one solid per viewport.
5. **Trust and proof.** Hanzo's own claims carry the scene: the port stays on localhost, the café network sees nothing listening, the URL ends with the terminal.
6. **Content presentation (copy untouched).** Parity 38/38 text, 4/4 links. Counters sit under their headlines; the modes explain themselves with Hanzo's words.
7. **Visual design system.** Ink, greys and white only: the open internet is a silver light the wipe reveals, the lock and status dots are white, closed states are grey italics. One dark middle room (the scene) and the dark closing band.
8. **UI component library.** Kit `Cta`, Frame `Code`; the mode switch is `aria-pressed` buttons; the name builder uses real labelled inputs (no browser-default look).
9. **Motion and interaction.** Time: the command types once. Scroll: the wipe opens and closes with the scroll (desktop); on phones the scene plays by itself with a Pause. State: modes switch; the builder rewrites the command and URL as you type.
10. **Media.** No Hanzo media for Tunnel; objects are the terminal, the phone, the fabric and the code.
11. **Mobile and responsive.** The URL wraps; the scene reads 01, then the stage playing on its own, then 05; the builder fields stack; no sideways scroll; targets ≥44px.
12. **Accessibility.** One h1; 44px Pause on the scene (WCAG 2.2.2); builder fields labelled, output `aria-live`; contrast ≥4.5:1; reduced motion shows the URL and the open scene.
13. **Performance and engineering.** The wipe is a clip-path from scroll; the phone clock is one motion value; packets are CSS transforms paused off screen and on Pause.
14. **SEO and machine files.** Metadata and JSON-LD unchanged; every word in the server HTML.
15. **Catalogue and product pages.** Product anatomy: identity, the product working, facts, how to start, Get, band.
16. **Developer experience.** The exact three lines Hanzo prints, with Copy; the builder applies Hanzo's `--name` rule and accepts a port, host:port or full URL.
17. **States and resilience.** URL states: sharing, serving requests, stopped answering. JS off shows every word.
18. **Measurement and handover.** `data-cta`: primary, install-cli, pricing, deploy, close. Filmed at 1470×801 and 375×812, no console errors.

**Ledger (deleted):** the orange accent and its gradient, the green status marks, the red "terminal closed", the eyebrow above the h1, the counters above headlines, the magnetic primary, a second solid ("Install the CLI").
