# /pricing coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Pricing.jsx` (+ `Pricing.css`) · route: `app/pricing/page.jsx` · gallery: `docs/gallery/pricing/`

Persona: a builder or a team lead choosing a plan. Goal: know the price before you ask (brief 5.2). CTA: "Try Hanzo" on the plan you pick (`data-cta` pricing.free, pricing.go, pricing.pro). Metric: cta_click on those ids.

1. **Strategy and conversion.** The plan cards are the hero object, read left to right, all equal: there is no written rule for a recommended plan, so none is dark or solid. Each card has one outlined ask. The single solid on the page is the closing Band ("Talk to our AI Buying Specialist →").
2. **Information architecture and navigation.** Order per 5.2: tabs (Personal, Team, API), plan cards, Hanzo's trust links beside the asks, the FAQ (its first three questions open the list), Band. The tabs stay pinned under the header while you read the plans; `#team` and `#api` open a tab.
3. **First impression and page narrative.** One word, "Pricing", cuts in by line; at 1470×801 the three cards' names, lines and prices sit in the first screen. The Pro card walks its own ladder (3x, 5x, 15x, ∞) while it is on screen and nobody has touched it.
4. **Conversion system.** Kit `<Cta>` everywhere, each with a `data-cta` id. Dead buttons removed: Hanzo's page links checkout only for Go and Pro, so Dev, Max, Ultra and Team offer "Chat with buying specialist" (/buying-specialist) instead of invented checkout links.
5. **Trust and proof.** "How Hanzo is secured", "Trust center" and "Read the Privacy Policy" (Hanzo's own labels) sit right under the asks on Personal and Team.
6. **Content presentation (copy untouched).** Parity 100/100 text, 5/5 links. Kit `Faq` (hidden="until-found", hash-open, multi-open). Kit `DataTable` for every table (one per model group, tools, the compare sheet). Rates with floating-point dust (0.026250000000000002) show their real precision (0.02625). The invented helper sentences of the first v2 are gone; the repeated "Pay as you go" price line is gone.
7. **Visual design system.** v2 scale, greys only (JAMES.md 7): no UI hue. Cards 28px radius with a hairline; the Volume card is the grey card.
8. **UI component library.** Kit: `Tabs`/`TabPanel`, `Cta`, `Faq`, `DataTable`, `Band`, `Lines`, `A`, `More`. v2: `Odometer`, `x-cannon/Drawer`. Page-local: the in-card segmented radios (usage ladder, billing period) and the seat steppers.
9. **Motion and interaction.** Signature: prices roll as odometers in 300ms with no blur and are announced politely (`aria-live`). Idle: the Pro ladder. State: tab pill, card segmented pill, Pro name roll, the compare sheet growing out of the card you pressed. Press: .98 on buttons and steppers, 1px on links. Scroll-linked motion: none.
10. **Media.** None: the plan cards and their rolling figures are the object. The first v2's Enso art behind the Pro card is gone with the dark card.
11. **Mobile and responsive.** One column at 375 (Free, Go, Pro in order); tabs fill the width; 44px targets; the compare table and model tables scroll sideways inside their own box, never the page.
12. **Accessibility.** APG tabs (arrow keys, Home, End); the ladder and billing period are radio groups; steppers are named groups with live counts; prices announce politely; the compare sheet is a modal that traps Tab, closes on Esc and returns focus.
13. **Performance and engineering.** The odometer is CSS only (no JS loop); the ladder timer runs only on screen and stops on first touch; no images.
14. **SEO and machine files.** Metadata and JSON-LD unchanged. Every tab, variant and answer is in the server HTML. JS off: the Pro card shows all four variants stacked; hidden tabs stay hidden.
15. **Catalogue and product pages.** The API tab lists every model group with its own table and its "Start Using" links.
16. **Developer experience.** "Get API Key" (/dev) and the OpenAI-compatible endpoint line stay; tables use tabular figures.
17. **States and resilience.** Steppers never go below 2 members or above 100; disabled ends show as disabled, never as dead presses.
18. **Measurement and handover.** `data-cta` ids: pricing.free, pricing.go, pricing.pro, pricing.help, pricing.team, pricing.enterprise, pricing.api.key, pricing.api.sales, pricing.api.try, pricing.compare.*.

Ledger (deleted): the dark Pro and Team cards, three solid buttons in a row, checkout links with no Hanzo destination, the duplicate "Pay as you go" line, the reading-row stripe, the invented helper sentences, the Pro card's background art.
