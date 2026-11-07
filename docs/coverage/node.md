# /node coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Node.jsx` · route: `app/node/page.jsx` · gallery: `docs/gallery/node/`

1. **Strategy and conversion.** Persona: a developer with a machine to lend (a compute provider). Goal: run a node. One ask, Hanzo's "Run a Node" (docs.hanzo.ai/docs/proof-of-ai/node-operator), metric `api_key_created`: solid in the hero (`data-cta="node.hero"`), carried by the site's sticky ask after the hero, and the close's one solid (`node.close`). "View Source", "About the Network", "View on GitHub", "Deploy to Cloud" and "Self-host" are text links; "Quickstart" in the dark room is a ghost (it was a second solid).
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: one machine, why run one (figures), six reasons in one terminal, put a machine on the fabric, get it. "About the Network" opens /network (morph).
3. **First impression and page narrative.** At 1470×801 the first screen is the machine (settling, running itself) beside the h1 "Hanzo Node", its line "Decentralized AI Compute" (moved from an eyebrow above the h1 to under it), the lede and the ask. The machine starts, joins, reports hardware and serves within 1–3s, with no input. Neighbour /network opens on a full-bleed map instead; the two never share a hero medium.
4. **Conversion system.** `data-thumb="Run a Node"` on the hero ask drives the site's sticky ask at every width; `data-ask-name="Hanzo Node"` names it; the close's ask carries `data-thumb`, so the bar steps aside there. One solid per screen. The levels sheet is mounted only while open so the sticky ask is not suppressed (see kit note).
5. **Trust and proof.** The figures are Hanzo's (one Rust binary, three commands, five levels, a tenth of the block reward). Hashes and bars are drawn and said to be.
6. **Content presentation (copy untouched).** Parity 37/37 text, 4/4 links. Detail lives in things you open: the levels sheet, the drive buttons, the pinned terminal.
7. **Visual design system.** v2 launch type. 0 UI hues: the teal accent and its cyan terminal are gone. The machine's states differ by shape and fill (hollow LED stopped, grey joining, solid ink with a ring serving); the terminal is ink with white and silver text.
8. **UI component library.** Kit: `SettleStage`, `LineMask`, `SpecDrawer` (figures) and its `Sheet`, `PinnedChapters`, `ClipWipe`, `LaunchClose` (ask/cta), `LivePause`. Frame's `Paste`. The level rows and drive buttons are real buttons with `aria-pressed`; no browser-default controls; no `title=` attributes.
9. **Motion and interaction.**
   - Idle: the machine's own loop, pausable from its toolbar (`LivePause`; runs only on screen, not paused, not while you point at a level).
   - Pointer: the machine leans a few degrees toward a fine pointer (spring {300, 30}); pointing at a level of the work routes a job of that level and settles a Merkle root for it; the close's ask is magnetic.
   - State: up / join / stop in chapter five swap the terminal's process list; the levels sheet rises.
   - Arrival: cut-in titles; the timed wipe into the dark room.
   - Scroll (under half): Stage settle and the pinned terminal.
   - No `setInterval` in the page (timeouts only).
10. **Media.** No Hanzo images or film on this page; its objects are product UI: the machine, the terminal, the figures, the agent prompt, the close's Sigil.
11. **Mobile and responsive.** At 390×664 the first screen holds the h1, its line, the lede, the ask and the machine's toolbar and command already running. On phones the five levels become five 44px columns whose height is the share, with the lit level named beneath. Pinned chapters put the terminal on top, words clear of the thumb bar (pinchk 6/6 ok). No text under 14px, targets ≥ 44px (320px too), no sideways scroll.
12. **Accessibility.** Level buttons are named by their level; the status is `aria-live`; the sheet traps focus, Esc closes it and focus returns. Contrast ≥ 4.5:1 on white and in the dark room (probe flags only mid-transition frames). Reduced motion: the machine shows its serving state, no tilt, no line-in, chapters swap without movement.
13. **Performance and engineering.** Transforms, opacity and colour transitions only; the loop is a chain of timeouts that stops off screen; no canvas, video or blur.
14. **SEO and machine files.** Metadata and JSON-LD unchanged. All Hanzo copy is in the server HTML and visible with JS off (0 invisible after load); Frame's Paste is held visible by the page CSS.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** `hanzo fabric up / join / stop` are shown as they behave; the agent prompt is copyable; Node docs one tap away.
17. **States and resilience.** The machine walks stopped → starting → joined → serving and shows "waiting for work" before its first root; stop leaves the other same-named process running. No live data, so no loading or failure state.
18. **Measurement and handover.** `data-cta` on both asks (node.hero, node.close); no analytics wired yet. Filmed with the scratch `film.cjs` (d.mp4, d.jpg, p.jpg; no errors, no sideways scroll).

Ledger: deleted the teal accent (LED glow, cyan terminal, teal pills and bars), the "● Decentralized AI Compute" eyebrow over the h1 (its words now sit under it), the second solid "Quickstart" (now a ghost), the ghost "View Source" and two ghost links in the dark room (now text links, so no row of three equal buttons), a bare `:hover` rule, and the always-mounted sheet that silenced the sticky ask.
