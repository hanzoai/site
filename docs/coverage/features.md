# /features coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Features.jsx` · gallery: `docs/gallery/features/` · Persona: anyone weighing Hanzo's products · Goal and metric: `first_chat` · CTA: "Open Chat" → /chat?skip=login

1. **Strategy and conversion.** One ask, Hanzo's "Open Chat": solid in the hero (`data-thumb`, `data-cta="features.hero"`), in the ask bar after the hero. "Launch Dev" and "Try Hanzo" are outlined text-weight siblings. The close is Hanzo's own "Try Hanzo" chat box (a real chat to POST https://api.hanzo.ai/v1/chat/public).
2. **Information architecture and navigation.** Header and footer unchanged. Order: the keyboard (hero), three pinned product chapters (Hanzo Chat, Hanzo Dev, Hanzo Design & Cloud), the dark "Try Hanzo" room.
3. **First impression and page narrative.** The headline cuts in; the keyboard under it plays itself, a key pressing every two seconds and its feature lighting on the display. Then one product per screen with its own running UI.
4. **Conversion system.** One solid per viewport.
5. **Trust and proof.** Hanzo's feature descriptions only.
6. **Content presentation (copy untouched).** All 30 page-content units present. `scripts/parity.py` still reports MISSING because `content/live/features.json` captured Hanzo's header and footer (157 units), which render outside `<main>`; this predates the rebuild. "Platform Features" sits under the headline; product tags (Default, CLI + Web) sit under the words.
7. **Visual design system.** v2 scale; 0 UI hues: the pressed key is ink, chips light ink, the terminal is silver on black. One dark room (Try Hanzo).
8. **UI component library.** Kit `A`, `Img`, `Magnetic`; v2 `Settle`, `x-gauss/PinChapters`, `LineMask`, `Pause`, `NoJs`. Keys have `aria-pressed` and `aria-keyshortcuts`; the finder is `role=search`.
9. **Motion and interaction.**
   - Idle: the keyboard plays itself; each product UI runs while its chapter is on screen (chips light, checks tick, graph nodes connect, memory fills).
   - Pointer: press keys, type 1–0, magnetic ask.
   - Time: type what you need and keys light as you type (the Beyond); the chat answer streams.
   - Scroll: the keyboard settles; the products pin.
   - Pause buttons on the keyboard and the product chapters; the chat ring turns once (and only spins while thinking).
10. **Media.** Hanzo's Enso mark (kit `Img`) in the chat UI and the answer.
11. **Mobile and responsive.** At 375px the keyboard stacks its clusters; product UIs pin above their words; targets 44px; no sideways scroll.
12. **Accessibility.** One h1; the display is `aria-live`; answer `aria-live`. JS off: `NoJs`.
13. **Performance and engineering.** Loops stop off screen and when paused; the streamed answer writes to a text node.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Ten features in three clusters; the finder filters them.
16. **Developer experience.** Does not apply.
17. **States and resilience.** The chat shows thinking, streaming, done and error ("No answer came back this time." with Open Hanzo Chat).
18. **Measurement and handover.** `data-cta` on the hero ask. Filmed into `docs/gallery/features/`.
