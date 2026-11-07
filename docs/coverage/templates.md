# /templates coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Templates.jsx` · gallery: `docs/gallery/templates/` · Persona: builders who want a finished product to start from · Goal and metric: `first_chat` · CTA: "Edit in Hanzo" → /chat?template=<slug>

1. **Strategy and conversion.** One ask, Hanzo's "Edit in Hanzo": solid in the hero for the template in front (`data-thumb`, `data-cta="templates.hero"`), in the ask bar after the hero, and inside each shelf sheet. On the deck cards it is outlined, so one solid shows per screen.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the deck (hero), the shelf of all twelve, the setup room (prompt menu, agent strip, the commands for the template in front).
3. **First impression and page narrative.** "Start from a product." cuts in; under it a deck of live browser windows riffles itself and the address bar types each .hanzo.app name; the hero's readout follows the front template.
4. **Conversion system.** One solid per viewport; the commands' Copy copies what is shown.
5. **Trust and proof.** Hanzo's own list (GET api.hanzo.ai/v1/templates, the twelve with previews) and descriptions.
6. **Content presentation (copy untouched).** Parity 96/96, 45/45. "Templates" and "Setup" sit under their headlines. Each shelf tile opens into a sheet with its preview, description, clone line and the ask.
7. **Visual design system.** v2 scale; 0 UI hues: colour comes only from Hanzo's own template previews. Kinds and dots are ink. One dark room (setup).
8. **UI component library.** Kit `A`, `Img`, `Copy`, `Magnetic`; shared `SetupMenu`; v2 `Settle`, `OpenCards`, `x-gauss/LineMask`, `Pause`, `NoJs`. Kinds are a `tablist`; the deck is a keyboard carousel (arrow keys).
9. **Motion and interaction.**
   - Idle: the deck riffles every 3.6s; the front preview drifts; the address bar types.
   - Pointer: drag the front card (inertia, snap back); tiles lift and open; magnetic ask.
   - State: kinds re-deal the deck; the readout and the commands follow the front template; tiles morph into sheets.
   - Scroll: only the deck's settle.
   - The deck has a pause button (it pauses the drift too); the terminal caret blinks four times.
10. **Media.** Hanzo's twelve template previews from hanzo.ai/templates (kit `Img`, 1280×800). In the cloud sandbox they cannot load (network), on hanzo.ai they do.
11. **Mobile and responsive.** At 375px the deck is 420px tall with a swipe; chips scroll sideways inside their own row; tiles stack; targets 44px; no page sideways scroll.
12. **Accessibility.** One h1; back cards are `aria-hidden` and untabbable; the readout is `aria-live`. JS off: `NoJs`.
13. **Performance and engineering.** Only the three cards in front load eagerly; the rest are lazy.
14. **SEO and machine files.** Metadata unchanged.
15. **Catalogue and product pages.** Twelve templates, six kinds with counts, every tile a sheet with its link.
16. **Developer experience.** `hanzo login`, `template list`, `template get <slug>`, `git clone`, `hanzo dev`, filled for the front template.
17. **States and resilience.** Previews that fail to load leave their sized box (w/h reserved).
18. **Measurement and handover.** `data-cta` on the hero ask. Filmed into `docs/gallery/templates/`.
