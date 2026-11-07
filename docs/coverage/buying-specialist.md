# /buying-specialist coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/BuyingSpecialist.jsx` (+ `.data.js`) · gallery: `docs/gallery/buying-specialist/`

1. **Strategy and conversion.** The first action is the conversation (the four starters and the composer). The one solid button is Hanzo's own "Start Team Plan →" on the quote card (`data-thumb`, `data-cta="buying-specialist.quote"`), which the sticky ask bar carries after the hero. "Start Enterprise Plan →" is a text link.
2. **Information architecture.** Header and footer untouched. The desk (greeting, chat, quote card), then the six promises.
3. **First impression.** No label above the h1. The greeting cuts in; the quote card re-prices itself (4, 10, 25, 50 members) within the first seconds; the orb breathes.
4. **Conversion system.** One solid per screen; `data-cta` on the plan button; the chat answer shows Hanzo's own plan buttons.
5. **Trust and proof.** Prices only from Hanzo's own specialist brief ($20/$25 Standard seat, 20% annual saving).
6. **Content (copy untouched).** Parity 20/20. The quote card's words are the card Hanzo's specialist writes into a reply ("Hanzo Team Configuration", "SAVE 20% ANNUALLY", "Annual Rate (Recommended)", "Billed … annually upfront", "Monthly Rate", "Cancel anytime", "Start Team Plan →", "Start Enterprise Plan →"); they are not in the static page because hanzo.ai shows them after a message. The earlier invented labels ("Billed yearly", "Yearly saves", the seat legend) are gone. The members slider is labelled by aria only.
7. **Visual design.** Grey deck, 0 UI hues (the blue is gone). The quote card is the one dark object; no dark room.
8. **UI components.** System `.x-btn`, a native range input styled light on dark, the composer as a real form, the promise rail with real buttons.
9. **Motion.** Signature: the live quote card (idle/time: it re-prices by itself; state: it takes the size you type). Pointer: the promises rail is thrown with inertia; starters and buttons press. Time: the answer's waiting state. Arrival: line-mask greeting. No scroll-linked effects.
10. **Media.** Product UI: the chat and Hanzo's quote card.
11. **Mobile.** Greeting, starters (full width), composer under the thumb, then the card; promises as a native swipe rail.
12. **Accessibility.** Log is `aria-live`; composer labelled; slider labelled; the rail's arrows are buttons. Reduced motion stops the re-pricing.
13. **Performance.** Transform/opacity only; the re-pricing timer stops off screen.
14. **SEO.** All text server-rendered.
15. **Catalogue.** Does not apply.
16. **Developer experience.** Does not apply.
17. **States.** Chat: idle, waiting ("Finding the best plan for your team..."), answered, and Hanzo's written answer when the endpoint cannot be reached. The chat sends exactly what hanzo.ai sends (`/v1/chat/public`, then the sales-chat form), tested only with interception.
18. **Measurement.** `data-cta="buying-specialist.quote"`; metric signup_start. Ledger: deleted the seat mixer's invented labels, the Premium slider and the blue accent.
