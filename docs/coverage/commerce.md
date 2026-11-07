# /commerce coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Commerce.jsx` · gallery: `docs/gallery/commerce/`

1. **Strategy and conversion.** One ask, Hanzo's "Read the docs" (docs.hanzo.ai/docs/cli/commerce): solid in the hero, in the sticky AskBar, on the phone thumb bar and as the one solid button in the close. "API Platform", the ways in, "Deploy to Cloud" and "View on GitHub" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: an order's life (rail, then the scroll-driven journey), the ten nouns, the endpoints (find), who takes the money, when to reach for it, what you are running, the ways in, the close.
3. **First impression and page narrative.** A full-bleed rail fills the top of the first screen, with one order card riding its five stops by itself and showing the endpoint it calls; the title sits bottom-left, the line and the ask to its right. At 375×812 the title, line and ask come first and the rail starts inside the first 660px.
4. **Conversion system.** `data-thumb="Read the docs"` and `data-cta="primary"` on the hero ask; `data-cta="primary"` on the close; `AskBar title="Commerce"` as the last child of main. One solid button per screen.
5. **Trust and proof.** Every endpoint shown is Hanzo's own (path and description), and the counts are counts of Hanzo's list. "What you are running" is kept as a spec sheet.
6. **Content presentation (copy untouched).** Parity 272/272 text, 7/7 links. Detail lives in things you open: each noun opens into its endpoints; each endpoint group opens a sheet with its full list. No label sits above a headline.
7. **Visual design system.** Biz grammar; ink, greys and white only (held and captured cards invert to ink, a return is a dashed outline). The only colour is Hanzo's own Zen image on the order card. One dark room: find an endpoint.
8. **UI component library.** Kit `A`, `More`; v2 `BizLines`, `BizSheet`, `BizOpen`, `AskBar`. Styled stops, pause button, search field, suggestion chips, processor radio pills.
9. **Motion and interaction.**
   - Idle: the order rides the rail and changes shape at each stop (signature), with a pause button.
   - Scroll: the same journey as a sticky horizontal scene; the text pins while the five stops pass sideways (useScroll/useTransform).
   - State: nouns open into their panels (BizOpen morph); sheets slide in; the processor pill glides (layoutId).
   - Time and pointer: endpoints answer as you type; index rows preview on hover; stops, chips, rows and tiles lift; presses scale .98.
10. **Media.** Hanzo's `/models/zen.webp` on the order card; the shape tiles are line drawings; the rest is product UI.
11. **Mobile and responsive.** At 375px: title, line, ask, then the rail (card centred, stops as numbered dots); the journey becomes five vertical steps; the index has no hover preview; the endpoint groups stack; no sideways scroll; text ≥ 14px; targets ≥ 44px.
12. **Accessibility.** Stops and suggestion chips are buttons with `aria-pressed`; the processor switch is a radiogroup with arrow keys; the search has a label and a Clear button; sheets and panels trap focus; reduced motion stops the rail and lays the journey out still.
13. **Performance and engineering.** Transform and opacity only for movement; the rail runs only while on screen; one scroll-linked transform drives the journey; no canvas, video or blur.
14. **SEO and machine files.** Metadata and JSON-LD unchanged (`app/commerce/page.jsx`). Every endpoint, noun and sentence is in the server HTML (sheets and panels included).
15. **Catalogue and product pages.** A product page for an API: hero object, journey, type index, finder, spec sheet, one close.
16. **Developer experience.** Find an endpoint across all five groups at once; full lists one tap away; docs, API reference and GitHub kept.
17. **States and resilience.** The finder has a no-match state per group (dimmed, an em dash) and a Clear button; it starts on "refund" so it reads with JS off. The rail pauses and holds a tapped stop.
18. **Measurement and handover.** `data-cta` marks the asks; no analytics wired yet (BRIEF-v3 §1). Filmed with the cloud film script at 1470×801 and 375×812, no console errors. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`.
