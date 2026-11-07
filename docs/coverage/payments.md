# /payments coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Payments.jsx` · gallery: `docs/gallery/payments/`

1. **Strategy and conversion.** One ask, Hanzo's "Try Hanzo" (/login): solid in the hero, in the sticky AskBar after the hero, on the phone thumb bar and as the one solid button in the close. "Explore APIs", "API Reference", "Deploy to Cloud" and "Contact Sales" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the checkout (what it does), the four steps (how), the one API and its code, the checkout methods, tax and fraud, the traffic split, when a switch earns its place, where to read further, the close.
3. **First impression and page narrative.** The title cuts into its line over one huge phone that is already running the checkout. At 1470×801 the amount and the live step screen show; at 375×812 the phone starts under the ask, well inside the first 660px.
4. **Conversion system.** `data-thumb="Try Hanzo"` and `data-cta="primary"` on the hero ask; `data-cta="primary"` on the close; `AskBar title="Payments"` as the last child of main. One solid button per screen.
5. **Trust and proof.** The proof is Hanzo's own code: the phone ends on `'succeeded'` and `payment.connector 'adyen'`, the same values the request in "One API in front of all of them" prints. No invented figures.
6. **Content presentation (copy untouched).** Parity 139/139 text, 6/6 links. Detail sits behind clicks: the developer kit and the checkout features in sheets, tax and fraud and the four use cases in cards that open. No label sits above a headline.
7. **Visual design system.** Biz grammar (display 128, headline 56, title 28, body 19, Zen Mono labels). Ink, greys and white only: a decline is an inverted ink chip, a success an outlined chip with the word. One dark room: the traffic split.
8. **UI component library.** Kit `A`, `More`, `Code`; v2 `BizLines`, `BizStage`, `BizChapters`, `BizSheet`, `BizOpen`, `AskBar`. The slider, tracker, pause button and chips are styled; no browser-default control.
9. **Motion and interaction.**
   - Idle: the checkout runs its four steps (signature), with a pause button.
   - Scroll: the phone rises and settles (Stage); four sticky chapters pin the phone beside its route.
   - State: cards open into their panels (BizOpen), sheets slide in, the Pay button turns to `succeeded`.
   - Pointer: drag the traffic split; tracker steps nudge on hover and hold on tap; chips and rows lift, presses scale .98.
10. **Media.** No Hanzo film on this page; the hero object is product UI (phone, routing hub, request code). The merchant image is Hanzo's own `/models/enso.webp`.
11. **Mobile and responsive.** At 375px: the phone stacks under the ask; the chapters pin a compact checkout card (no route diagram); the split becomes a 10×10 grid; no sideways scroll; text ≥ 14px; targets ≥ 44px.
12. **Accessibility.** Real buttons with `aria-pressed` (tracker, pause), labelled range input with `aria-valuetext`, sheets and panels trap focus and return it, `aria-live` on the split shares, reduced motion shows the settled `succeeded` state.
13. **Performance and engineering.** Transform and opacity only; timers run only while the hero is on screen (`useLive`) and stop on pause; no canvas, video or blur.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/payments/page.jsx`). Every word is in the server HTML, including sheet and panel content and all chapters.
15. **Catalogue and product pages.** Product page (archetype A Launch): Stage hero, chapters, spec in sheets, compare by use case, one close.
16. **Developer experience.** The request is shown in full with a Copy button; the API reference and quickstart are kept as links.
17. **States and resilience.** The checkout shows each state (method, vault token, rule, soft decline, backup, succeeded); the split's "Roll back at once" disables at 0%. JS off: all text legible, the phone shows its first step.
18. **Measurement and handover.** `data-cta` marks the asks; no analytics wired yet (BRIEF-v3 §1). Filmed with the cloud film script at 1470×801 and 375×812, no console errors. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
