# /contact coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Contact.jsx` (+ `Contact.css`) · route: `app/contact/page.jsx` · gallery: `docs/gallery/contact/`

Persona: anyone with a question for Hanzo (buyer, developer, customer, press). Goal: reach the right people in one choice. CTA: "Talk to sales" (`data-cta="contact.hero"`). Metric: the one contact click (contact_sales_submit downstream).

1. **Strategy and conversion.** One ask, Hanzo's "Talk to sales" (/contact-sales). It is the solid button in the Sales route, which the panel rests on. Each other route has its own single solid button (Subscribe to newsletter, Get support, hello@hanzo.ai), and only one route is visible at a time, so there is one solid button per viewport. "See Enterprise" and "Book a 30-minute call" are text links.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: why you are writing (the panel), where we are (Visit), where we talk (community). Every href is Hanzo's (15/15).
3. **First impression and page narrative.** The two-line h1 cuts in by line (masked rise, 800ms). The panel rises beside it, then patches each of the four lines once, swinging its cable on a spring, and rests on Sales. At 1470×801 the h1, the lede and "Talk to sales" sit above the fold (button bottom at y≈693). At 375×812 the jacks become one swipe row, so the Sales route and its button fit the first screen.
4. **Conversion system.** `data-thumb="Talk to sales"` drives the site's ask bar (`components/Ask.jsx`) after the hero at every width; while it is on, the header's "Try Hanzo" turns outline. Each route's solid button has its own `data-cta` (contact.hero, contact.dispatch, contact.support, contact.press).
5. **Trust and proof.** The address (1 Ferry Building, San Francisco, CA 94105) and a live San Francisco clock. No logos or claims are added.
6. **Content presentation (copy untouched).** Parity is 29/29 text and 15/15 links.
   - There are no labels above headlines: the "Contact" eyebrow and the "01 / 04" route counters are gone, and "Visit" is now the dark room's own headline.
   - The invented clock captions are removed.
   - Copying hello@hanzo.ai is an icon with an aria-label.
7. **Visual design system.** v2 scale (`components/v2/vc-type.css`). Ink #1d1d1f, greys and white only, with no UI hue: the wire, jacks, plug, clock hands and focus ring are all ink or grey. Hero object at a 28px radius. There is one dark room, "Visit".
8. **UI component library.** Kit: `A`, `More`. Page-local: Panel (APG tabs: arrow keys move and select, `aria-selected`, `aria-controls`), Clock, Community plate, CopyMail. Company kit: `MaskLines`. No browser-default controls and no `title=` tooltips.
9. **Motion and interaction.** Scroll-linked motion: none.
   - **Arrival:** the h1 line cut-in; the lede and the panel enter on CSS keyframes.
   - **Idle:** the panel patches each line once, then rests; the San Francisco clock ticks.
   - **Pointer:** jacks darken on hover; pointing at or focusing a network redraws the contour plate from that network's own address, and its name springs up in the plate.
   - **State:** the cable swings on a spring; routes slide in and out.
   - **Press:** buttons, jacks and the copy icon scale to .98.
10. **Media.** Hanzo has no photo for this page. The objects are product-style UI (the panel), a Sigil contour map of the address under the dark room, a live clock, and a Sigil plate in the community section, all monochrome.
11. **Mobile and responsive.** At 375px the jacks are one swipe row: the chosen jack scrolls into view, and the row scrolls, never the page. The panel and routes stack, and the community index has a short plate above it. There is no sideways page scroll at 320 or 375, and every target is 44px or more.
12. **Accessibility.**
   - The panel is a real tablist with keyboard support.
   - Hidden routes are `aria-hidden` and `inert`.
   - The clock is `role=img`, named San Francisco; its digits are `aria-hidden`, so nothing announces every second.
   - The copy button is named and reports through `role=status`.
   - The focus ring is ink with a white halo.
   - Reduced motion: arrivals off, the clock is set once a minute, and the panel does not auto-patch.
13. **Performance and engineering.**
   - Motion is transform, opacity and SVG `d` only. The running wire pulse (an infinite CSS animation) is deleted.
   - The dark-room map is a still Sigil frame.
   - The clock interval and the community Sigil run only on screen.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All text, including every route, is in the server HTML. With JS off, the h1 shows through the company MaskLines noscript rule, and the lede and panel arrive by CSS.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** Does not apply beyond the Developer Dispatch route, which goes to /newsletter.
17. **States and resilience.**
   - The clock draws only in the browser; the server sends a blank line, so there is no wrong server time.
   - If clipboard access is blocked, nothing claims "Copied".
   - Blocked media is not an issue: the page has no remote images.
18. **Measurement and handover.** `data-cta` is on every primary (contact.hero, .dispatch, .support, .press). No analytics are wired yet (PLAN 2.18 is pending the tracking plan). Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg`, `before-desktop.jpg`.

Ledger (deleted): the blue accent; the eyebrows over the h1 and over the address; the route counters; the invented clock captions ("Local time in San Francisco", "N hours behind you"); the endless patching loop and the running wire pulse; the opacity-0 arrivals in the server HTML; the text-only community list (now beside a plate).
