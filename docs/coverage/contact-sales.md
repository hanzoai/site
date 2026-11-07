# /contact-sales coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/ContactSales.jsx` (+ `ContactSales.css`) · route: `app/contact-sales/page.jsx` · gallery: `docs/gallery/contact-sales/`

Persona: an enterprise buyer weighing data residency and vendor consolidation. Goal: send a qualified enquiry. CTA: "Talk to sales", the form (`data-cta="contact-sales.submit"`; each step's arrow is `contact-sales.next`). Metric: `contact_sales_submit`.

1. **Strategy and conversion.** One ask: the form. Its solid control is the round arrow on each step, then "Talk to sales" on the last step. The three other routes (cal.com, enterprise@hanzo.ai, Get Hanzo Team) are quiet rows of text links, and "Talk to AI Buying Specialist →" is an underlined link. There is one solid per viewport.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: the enquiry (hero), what Enterprise includes, the launches Hanzo built. All 17 hrefs are Hanzo's.
3. **First impression and page narrative.** After the site's arrival curtain lifts (company `MaskLines` and the CSS arrivals are held while `html.x-arriving`), the h1 "Talk to / sales" cuts in by line. The card rises over a slow grey contour field, and the first question is already set large.
   - At 1470×801 the h1, the lede and the card's arrow are above the fold (arrow at y≈605).
   - At 375×812 the order is h1, lede, card, then the routes below; the arrow sits at about y≈700.
4. **Conversion system.**
   - `data-thumb="Talk to sales"` sits on the card, so the site's ask bar (`components/Ask.jsx`) carries "Talk to sales" back to the form after the hero at every width; the header's "Try Hanzo" turns outline while it shows.
   - `data-ask-name="Talk to sales"` names the bar.
   - The request is byte-for-byte the shape in `content/forms.json`: POST https://api.hanzo.ai/v1/marketing/leads with name, email, company, size, need, source and visit. This was checked with the request intercepted, never sent.
5. **Trust and proof.** The launches Hanzo built (C.trusted) run on a slow rail with a pause control. Names show when a logo fails to load.
6. **Content presentation (copy untouched).** Parity is 30/30 text and 17/17 links.
   - There is no eyebrow over the h1: the old "Enterprise" kicker's word stays in "What Enterprise includes".
   - Every invented label is gone: "Your brief", "Your answers gather here.", "+N from Enterprise", "Next", "Back", "Sending…", "+ Add to brief", "In your brief", and the invented error and thank-you sentences.
   - Controls are icons with aria-labels. Errors show a mark beside Hanzo's own field label.
   - Failure shows Hanzo's own "Prefer email? enterprise@hanzo.ai".
   - Success shows Hanzo's own sentence, "We come back with a plan…".
7. **Visual design system.** v2 scale. Ink #1d1d1f, greys (#424245, #6e6e73, #d2d2d7) and white only, with no UI hue: the progress line, chosen size, chips, numerals, error mark and success disc are all ink. The card stage has a 36px radius and the card a 28px radius.
8. **UI component library.**
   - From the kit: `A`, `More` and `Img` (the logos).
   - Page-local: Form, Logo, Rail.
   - The team-size choice is styled radio pills inside a radiogroup, with no browser-default control. Inputs carry `inputMode`, `autoComplete` and `enterKeyHint`.
   - There are no `title=` tooltips.
9. **Motion and interaction.** Scroll-linked motion: none.
   - **Arrival:** the line cut-in; the card rises (CSS keyframes, so it works with JS off).
   - **Idle:** the contour field drifts slowly; the logo rail drifts and pauses on hover or with its pause control.
   - **Pointer:** hovering an inclusion lights its giant numeral from #d2d2d7 to grey; adding it inks it. Route rows nudge their value.
   - **State:** questions slide up and away, the progress line springs, answers appear as chips with a layout spring, and toggles spin plus into tick.
   - **Press:** .98 on every button.
10. **Media.** The customer logos (C.trusted) go through `Img` with width and height. The page has no other Hanzo media; the objects are the form card, the Sigil field and the giant numerals.
11. **Mobile and responsive.** At 375px:
   - h1, lede and card come first, then the routes;
   - inclusions stack as numeral and button over the sentence;
   - targets are 44px or more, the "Talk to AI Buying Specialist" link included;
   - there is no sideways page scroll at 320 or 375 (the rail scrolls inside its own mask).
12. **Accessibility.**
   - Real labels on every field; `aria-invalid` on a missing answer, with an alert named by the field's own label.
   - Hidden steps are `aria-hidden` and `inert`; focus moves to each new question.
   - Chips sit in an `aria-live` list, and the inclusion toggles are `aria-pressed`, named by their own sentence.
   - The rail has a pause button (WCAG 2.2.2).
   - The honeypot is `aria-hidden` with `tabIndex=-1`.
   - Reduced motion: no arrivals and a static, wrapped logo wall.
13. **Performance and engineering.**
   - Motion is transform and opacity only.
   - One Sigil on screen; the rail is CSS only and pauses on hover.
   - The fake blinking caret is deleted.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every question, size and inclusion is in the server HTML, with no `inert` or `aria-hidden` until the page hydrates. With JS off (checked: 0 hidden texts, 0 inert), a noscript rule stacks all five questions in order and hides the step controls, which need JS; the routes (cal.com, enterprise@hanzo.ai, Get Hanzo Team) stay as the way in.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** Does not apply.
17. **States and resilience.** idle, sending (a ring in the button with `aria-busy`), sent and failed.
   - Failure keeps every answer and offers Hanzo's email route.
   - A filled honeypot is quietly accepted.
   - Validation runs on Next and on submit, and focuses the first wrong step.
18. **Measurement and handover.** `data-cta` contact-sales.next and contact-sales.submit. UTM tags and consent go into `visit` exactly as before. No analytics are wired yet. Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg`, `before-desktop.jpg`.

Ledger (deleted): the violet accent and field; the Enterprise eyebrow; the invented labels and sentences; the blinking fake caret; the native `title=` tooltips on the logos; the raw `<img>`; the opacity-0 arrivals in the server HTML.
