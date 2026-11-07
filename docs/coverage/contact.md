# /contact coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Contact.jsx` (+ `Contact.css`) · route: `app/contact/page.jsx` · gallery: `docs/gallery/contact/` · answers `docs/review/contact.md` (7 Nov, 7/10).

Persona: anyone with a question for Hanzo (buyer, developer, customer, press). Goal: reach the right people in one choice. CTA: "Talk to sales" (`data-cta="contact.hero"`). Metric: the one contact click (contact_sales_submit downstream).

1. **Strategy and conversion.** One ask, Hanzo's "Talk to sales" (/contact-sales).
   - **Never moves.** It is the solid button in the Sales route. The route is chosen on arrival and stays until the visitor picks another line; nothing switches it by itself.
   - **One solid per viewport.** Each other route has one solid button (Subscribe to newsletter, Get support, hello@hanzo.ai), shown only when its line is chosen. "See Enterprise" and "Book a 30-minute call" are text links.
   - **Closing Band.** The page ends on the kit `Band` with Hanzo's "Bring Hanzo to your company." and one solid "Talk to sales".
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: why you are writing (the panel), where we are (Visit), where we talk (community), the ask again (Band). All 15 hrefs are Hanzo's.
3. **First impression and page narrative.**
   - **Arrival waits for the curtain.** The masked h1 (company `MaskLines`, gated on `useArrived`) and the lede and panel rise (CSS keyframes held while `html.x-arriving`) play after the site curtain lifts, so a first visit sees them.
   - **The cable sweep.** About 0.7s after the lift, the cable alone sweeps the four sockets once (each socket lights as the plug seats), then lands back on Sales. The Sales route and its button do not move.
   - **Fit.** At 1470×801 the h1, the lede and "Talk to sales" sit above the fold (button bottom at y=707), and stay there. At 375×812 the jacks are one swipe row, so the Sales route and its button fit the first screen.
4. **Conversion system.** `data-thumb="Talk to sales"` drives the site's ask bar (`components/Ask.jsx`) after the hero at every width, and the header's "Try Hanzo" turns outline while it shows. `data-ask-name="Contact"`. Each route's button has its own `data-cta` (contact.hero, contact.dispatch, contact.support, contact.press). Hero buttons are the kit `Go`.
5. **Trust and proof.** The address (1 Ferry Building, San Francisco, CA 94105) and a live San Francisco clock. No logos or claims are added.
6. **Content presentation (copy untouched).** Parity is 29/29 text and 15/15 links.
   - **No labels over headlines.** "Visit" is the dark room's own headline.
   - **Additions removed.** The 01–04 jack numerals and the mono URL lines under the networks are gone.
   - **Jack hover.** Hovering a jack shows that line's own action, Hanzo's button words ("Talk to sales", "Subscribe to newsletter", "Get support", "hello@hanzo.ai"). These words already sit in the routes, so nothing new is written.
   - **What is still new on screen.** The clock's live readout (for example "6:21 AM PST") is the one generated string on the page: it is data, not copy.
7. **Visual design system.**
   - v2 scale, with ink #1d1d1f, greys and white only: no UI hue anywhere.
   - The hero object has a 28px radius.
   - **Rooms.** One dark middle room ("Visit") and the dark closing Band (PLAN 0.1 allows both).
   - **One contour.** The page has one contour graphic, the community plate. The Visit room's map is gone, so the room's object is the big clock alone, a different medium.
8. **UI component library.**
   - **From the kit.** `A`, `Go` and `Band`.
   - **Page-local.** The Panel (an APG tablist: arrow keys move and select; `aria-selected` and `aria-controls`; kept page-local because the jacks and cable are the page's signature, which the kit `Tabs` pill cannot draw), the Clock, the Community plate and CopyMail.
   - **Company kit.** `MaskLines` and `useArrived`.
   - **Controls.** No browser-default controls and no `title=` tooltips.
9. **Motion and interaction.**
   - **Arrival:** the h1 cut-in, then the lede and panel rise, all after the curtain.
   - **Idle:** the cable sweeps the four sockets once and rests; the clock ticks.
   - **Pointer and focus:** they stop the sweep at once. Jack hover lifts the name and shows the line's action. Pointing at or focusing a network redraws the plate (a 320ms cross-fade, not a cut) with its name springing up.
   - **State:** choosing a line lifts the plug out of its socket and seats it in the next on a spring. The plug and the wire are one drawing, so the wire never hangs from empty air (checked mid-swing: the nub sits on the wire's end). The route slides in.
   - **Scroll (the only scroll-linked part):** the community plate follows the row you reach.
   - **Press:** .98.
10. **Media.** Hanzo has no photo for this page. The objects are product-style UI (the panel), a big live clock, and a Sigil contour plate drawn from each network's own address; all are monochrome.
11. **Mobile and responsive.**
   - **Panel.** At 375px the jacks are one swipe row: the chosen jack scrolls into view, and the row scrolls, never the page. The panel and routes stack.
   - **Community.** The plate rides at the top of the screen (sticky, 64px) while the rows pass under it, and follows the row in the middle.
   - **Checks.** There is no sideways page scroll at 320 or 375, and every target is 44px or more.
12. **Accessibility.**
   - The panel is a real tablist with keyboard support.
   - Hidden routes are `aria-hidden` and `inert` once the page has hydrated; the server HTML has neither, so with JS off every route and link is readable and reachable.
   - The clock is `role=img`, and its name carries the time once a minute ("San Francisco, 6:21 AM PST"). Its digits are `aria-hidden`.
   - The copy button is named and reports through `role=status`.
   - Pointer or focus on the panel stops its arrival sweep, which lasts about 2.5s (WCAG 2.2.2).
   - Reduced motion: no sweep and no arrivals, and the clock is set once a minute.
13. **Performance and engineering.**
   - The wire and plug are drawn from two motion values written straight to the SVG, with no React render per frame.
   - Motion is transform and opacity, plus the SVG path.
   - The clock interval and the community Sigil run only on screen.
   - The running wire pulse (an infinite CSS animation) is deleted.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. All text, every route included, is in the server HTML.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** Does not apply beyond the Developer Dispatch route, which goes to /newsletter.
17. **States and resilience.**
   - **JS off** (checked: 0 hidden texts, 0 inert):
     - all four routes stacked and readable, each with its link;
     - hello@hanzo.ai visible;
     - the jacks shown as labels;
     - no cable or plug;
     - the dial without hands (the server never draws 12:00);
     - the kit Band shown in place.
   - The hands appear with the first tick in the browser.
   - If clipboard access is blocked, nothing claims "Copied".
18. **Measurement and handover.** `data-cta` on every primary (contact.hero, .dispatch, .support, .press). The Band's button is the kit's. No analytics are wired yet (PLAN 2.18 is pending the tracking plan). Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg`, `before-desktop.jpg`.

Ledger (deleted):
- the blue accent;
- the eyebrows over the h1 and over the address;
- the route counters and the 01–04 jack numerals;
- the mono URL lines;
- the invented clock captions;
- the routes that switched by themselves, and the running wire pulse;
- the contour map under the Visit room;
- raw `.x-btn` hero buttons (now `Go`);
- the opacity-0 and inert server states that hid three routes with JS off.
