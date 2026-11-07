# /support coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Support.jsx` (+ `Support.css`) · route: `app/support/page.jsx` · gallery: `docs/gallery/support/`

Persona: a customer or developer who needs help now. Goal: reach the right door in one step. CTA: "Open Help Center" (https://hanzo.help), `data-cta="support.answer.1"`. Metric: the one contact click.

1. **Strategy and conversion.** One ask: the answer card's solid button. It starts as "Open Help Center" and becomes whichever of the six ways your words match. The six ways in the list beside it are quiet rows of links. The enterprise line's email is an underlined text link. There is one solid per viewport; the ↵ hint is outline only.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the question, the answer, the six ways, the enterprise line. All 6 hrefs are Hanzo's.
3. **First impression and page narrative.**
   - "How can we help?" cuts in on one line of display type, after the site's arrival curtain lifts (company `MaskLines` and the CSS arrivals are held while `html.x-arriving`).
   - Then, gated on `useArrived`, the pill types three of Hanzo's own phrases once ("support ticket", "API references", "incident history"). Each re-ranks the list and swaps the answer, then the pill rests empty.
   - At 1470×801 the h1, lede and "Open Help Center" are above the fold (button bottom at y≈686).
   - At 375×812 the order is h1, lede, pill, then the answer with its button, all in the first screen.
4. **Conversion system.**
   - `data-thumb="Open Help Center"` sits on the first door's button, so the site's ask bar carries it after the hero at every width; the header's "Try Hanzo" turns outline while it shows.
   - `data-ask-name="Support"` names the bar.
   - Each door's button has its own `data-cta` (support.answer.1–6), plus support.enterprise.
5. **Trust and proof.** Each door is a real link to its destination, the same as hanzo.ai. Nothing is claimed. The mono host lines and the small 01–06 list numerals were removed as added text; only the giant numeral in the answer card remains, as a visual.
6. **Content presentation (copy untouched).** Parity is 24/24 text and 6/6 links.
   - There is no eyebrow: "Support" now names the search landmark (`aria-label`).
   - Invented labels are gone: "Best match", "Start here", "From what you typed", "Email support@hanzo.ai about". Your typed words show only as your own subject line, in quotes.
   - All six answers stay in the HTML. Hidden ones are `aria-hidden` and `inert` only once the page has hydrated, so with JS off all six are stacked and readable (a noscript rule).
7. **Visual design system.**
   - v2 scale; ink, greys and white only.
   - Matched words are marked with a light grey fill and an ink underline, not green.
   - The answer card is the hero object at a 28px radius, with a giant #e8e8ed numeral (01–06) that springs to the door shown.
   - There is one dark room, the enterprise line.
8. **UI component library.** Kit: `A`. Page-local: search pill (`role=search`), answer panes, live door list. The pause control is an icon with an aria-label. The `<input type=search>` is styled with its cancel button hidden. There are no `title=` tooltips.
9. **Motion and interaction.** Scroll-linked motion: none.
   - **Arrival:** line cut-in; the pill and card rise, and the list fades in (CSS keyframes).
   - **Time:** the pill types three phrases once, then rests.
   - **State:** the list re-orders on a spring (`layout`) as you type; panes slide in; the numeral springs.
   - **Pointer:** pointing at or focusing a door previews it in the answer card.
   - **Idle:** the dark room's contour field drifts.
   - **Press:** .98.
10. **Media.** Hanzo has no image for this page. The objects are the search pill and answer card (product UI), the giant numeral, the live list and the Sigil field in the dark room.
11. **Mobile and responsive.**
   - At 375px the h1 breaks to two lines; then the lede, pill and answer (button above the fold), then the list.
   - Rows are 64px, and every target is 44px or more.
   - There is no sideways scroll at 320 or 375.
12. **Accessibility.**
   - The search is a labelled `role=search` form; Enter opens the answer.
   - A polite live region names the matched door once you type.
   - Hidden panes are `inert`. The demo has a Pause button (WCAG 2.2.2), and any focus or pointer on the pill also stops it.
   - The focus ring is ink with a white halo.
   - Reduced motion: no demo, no arrivals, and the numeral and panes swap without movement.
13. **Performance and engineering.**
   - Typing writes straight to the input (no state per character); state changes only on whole words.
   - The demo stops off screen.
   - One Sigil drifts, in the dark room only.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All six ways, with their descriptions and links, are in the server HTML.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** The Documentation and GitHub doors lead to docs.hanzo.ai and github.com/hanzoai, unchanged.
17. **States and resilience.** JS off (checked: 0 hidden texts, 0 inert): all six answers stacked with their buttons, the list, and the enterprise line. Empty query shows the Help Center. A match shows the best door. No match shows "Email us", with your words as the subject of the mailto (checked: "billing refund" gives `mailto:support@hanzo.ai?subject=billing%20refund`). The page has no network calls.
18. **Measurement and handover.** `data-cta` support.answer.1–6 and support.enterprise. No analytics are wired yet. Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg`, `before-desktop.jpg`.

Ledger (deleted): the green accent; the Support eyebrow; the invented labels; the mono host lines and the small list numerals; the endless typing loop and the bouncing dots; the separate text-only index section (its six ways now live in the hero list); the opacity-0 arrivals in the server HTML.
