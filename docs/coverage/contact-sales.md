# /contact-sales coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ContactSales.jsx` (+ `ContactSales.css`, deck tokens from `components/pages/company/deck.css`) · gallery: `docs/gallery/contact-sales/` · metric id: `contact_sales_submit`

Open copy questions for James:
- Part 5 asks for a Privacy link and owner line beside every submit, but /contact-sales has no Privacy link in Hanzo's copy, so none is added. Should one be?
- The success state reuses the lede's own sentence ("We come back with a plan for your company…"), because Hanzo has no thank-you wording for this form. Is there one?

Shared changes requested (`docs/requests/<page>.md`):
- `docs/requests/contact-sales.md`: (1) the header ask stays the shared "Try Hanzo"; the review wants "Talk to sales" there; (2) the kit `Band`'s `Magnetic` is a spring (ui.jsx); (3) the customer logos are not in `public/` and 404 in this box.
- Noted for the Company kit owner: the masked h1 lets the tops of tall letters peek out of the mask before its cut-in. A 120% start would hide them.

Forks this page deleted:
- the raw `.x-btn` submit (now its own ink button);
- the page-local "Your brief" panel;
- the numeral chips;
- the "01 / 05" counter;
- "cal.com ↗";
- the native `title=` tooltips on logos;
- raw `<img>` (now kit `Img`).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` — n/a for prices: the page has none
- [x] Open copy questions for James listed, none decided

Done here:
- **Audience and metric.** Enterprise buyer, `contact_sales_submit`.
- **Solid fills.** The only solid in the hero viewport is the card's arrow, then "Talk to sales" on the last step; the routes are quiet rows. `lib/cta.js` does not exist yet, so Hanzo's own label "Talk to sales" is used verbatim.
- **Form.** Five fields as on hanzo.ai (the live order, name first, is kept: copy is frozen). It has an 8s timeout with one retry (a hung POST tested: 2 calls, then the failed state) and a `sessionStorage` draft.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more — n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here:
- The shared layout supplies `<main>` and the skip link.
- Links go through `A`, `More` and the kit `Band`; the one mailto is a plain anchor, as Hanzo has it.
- Parity is 17/17 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 — no kit `PageHero` exists yet, so the company `MaskLines` h1, the lede and the card serve as one
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph — n/a: no cards lead to pages

Done here:
- **Arrival.** After the curtain, the h1 cuts in by line and the card rises in 0.4s (the Utility entry).
- **Idle, with a purpose.** Before anyone types, the conversation plays once from Hanzo's own field labels: from about 1.0s after load "Full name" types into the first field (80ms a letter, an aria-hidden overlay, never the field's value), at about 2.1s it lifts away and "Work email" rises with the progress line, a "Full name" chip lands, it rests, and at about 4.2s the empty live form returns (measured at 1470×801 by sampling every 150ms). The first pointer, key or focus on the card ends it at once (tested: a click mid-demo returns "Full name" and typing works). It never submits (0 requests to the intercepted API), never writes the draft and never moves focus. Reduced motion: no demo. The contour field still drifts and redraws (a 0.4s cross-fade) with every answer.
- **Ending.** The page ends on the logo rail (proof), the kit `Band` "Tell us what you want to build." (the lede's own first sentence) with one solid "Talk to sales", then the footer with a measured gap of 0px at both sizes. The Band's button glides back to the card (smooth `scrollIntoView`, centred) and focuses the question you are on, without a navigation (URL unchanged; tested at 1470 and 375, card measured in view at y=191–677 and y=319–561).
- **Fit.** At 1470×801 the h1, the lede and the arrow are above the fold (the arrow ends at y=624).
- **JS off.** All five questions are stacked and legible; the step controls are hidden.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` — no kit `Cta` exists yet; the submit is its own ink button (`.xcs-send`), and the Band uses the kit `Go`
- [ ] Sticky ask in header and bar after the hero, same label — not met: the header's ask is shared chrome ("Try Hanzo"), requested in `docs/requests/contact-sales.md`
- [ ] Copy button copies exactly the displayed text — n/a: no copy button
- [x] `data-cta` and `data-thumb` on every primary

Done here:
- **Sticky ask.** The page's own ask is not in the header: the sticky header carries the site's solid "Try Hanzo", which this page cannot relabel (requested). The floating pill bar was removed site-wide (d2b5ab8c), so nothing floats over content: a probe of fixed and sticky elements at 1470×801 and 375×812 found only the header, the progress line, the cookie notice and the page's own sticky section heading. The ask "Talk to sales" lives in the card (last step) and in the closing Band.
- **data-cta.** contact-sales.next and contact-sales.submit; the Band's button is the kit's.
- **Sending state.** The send stays ink (#0a0a0a) with a white turning ring and `aria-busy` (measured: background rgb(10,10,10), ring present).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates
- [ ] Privacy link and owner line beside every submit — not met: Hanzo's copy for this page has no Privacy link (listed for James)

Done here:
- The launches rail uses Hanzo's own customer list (`content.trusted`, on hanzo.ai/contact-sales).
- It is 48s per loop, pauses on hover and with its own pause button (`aria-pressed`), shows a still wrapped wall under reduced motion, and hides its duplicate half (`aria-hidden`, `tabIndex=-1`).
- The page has no figures.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts — n/a: none on the page
- [x] `python3 scripts/parity.py /contact-sales`: 0 missing

Done here:
- **Parity.** 30/30 text and 17/17 links.
- **Deck type** (`company/deck.css`).
  - h1: clamp(52px, 7vw, 84px), line height 1.02, weight 497.
  - Section heading: clamp(36px, 5.3vw, 64px).
  - Questions: 26–32px at 497.
  - Body: 16–17px.
  - Picks and chips: 13–14px.
- **Content changes.** The step counter, "cal.com ↗" and the numeral chips are removed. The 01–05 numerals stay only as the list's giant figures and the form's five toggles.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- **Taste.** `taste.py` passes. Only deck neutrals are used: `#0a0a0a`, `#525252`, `#737373`, `#d4d4d4`, `#ededed`, `#f5f5f5` and `#262626` for hover.
- **Surfaces.** The stage is a flat quiet fill (radius 28) and the card a flat white tile (radius 24, no shadow and no ring); fields are flat fills (radius 12).
- **Rooms.** One black room, the closing Band.
- **Neighbours.** The hero object differs from /contact (a patch panel) and /support (a search pill): it is a conversation card set into a contour field.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native — n/a: no dialogs
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here:
- **Buttons.** They are 48px: the round arrows, the send, the size pills and the picks.
- **Fields.** They are 56px with 16px text, `autocomplete`, `inputmode` and `enterkeyhint`.
- **Focus.** The ring is 2px ink with a white halo; on fields it is an inset 2px ink ring, so it no longer doubles the underline.
- **States.** Every hover sits in `@media (hover:hover)`. Press is scale .98 on the round buttons, the send, the size pills, the picks and now every inclusion row (`li:active`, 90ms), where the numeral also inks at once. The send's loading state keeps its width.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments — n/a: the shared sound kit has not merged

Done here:
- **Signature.** The one-question conversation.
- **Supporting.** The line-mask h1, the contour field redrawing per answer, and the rail.
- **Kinds of movement.** Arrival, idle and time (the self-playing conversation once, field drift, rail), state (step lift and rise, progress glide, chips) and pointer (numerals lighting, picks reading out their sentence). Scroll motion is one section heading's cut-in.
- **Tokens.** The progress line, the chips (entry and layout glide, `transition={{ ...T, layout: T }}`) and the inclusion toggles' glyph all use ease-emphasis `cubic-bezier(.16,1,.3,1)` at 300ms; the page file has no spring. The one spring left on the page is the shared kit `Band`'s `Magnetic` lean (ui.jsx), which this page cannot edit (requested).
- **Every control answers.** A click or tap anywhere on an inclusion row adds it (tested on the phone with a touch tap: the row turns `on`, `aria-pressed="true"`, the numeral is ink `rgb(10,10,10)`); the + stays the keyboard control.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set — the logos use kit `Img` with width and height
- [ ] At most 2 videos playing — n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- [ ] 4+ real visuals together — n/a: the page's only media is the logo row

Done here: The ten logos go through kit `Img` (128×30, lazy) with their names as alt. When an image fails, the name shows in type, which is what happens in this cloud box, where hanzo.ai is blocked.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- **Phone layout.** The order is h1, lede, card, then the routes. The chips get their own row, and each new step brings the card's buttons into view. The success panel lands at y=281–591 with CLS 0.000.
- **Fold.** The arrow sits above the 667 fold.
- **Width checks.** No sideways scroll at 320 or 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here:
- **Contrast.** Text is `#0a0a0a`, `#525252` on white and on `#f5f5f5`, and `#737373` on white only.
- **Demo.** The self-playing conversation lasts about 4.2s, under WCAG 2.2.2's 5s, so it needs no pause; it is aria-hidden, leaves the field values, `inert` and focus untouched, and stops on the first pointer, key or focus.
- **Size step.** Arrow keys only choose; Enter or a click moves on (WCAG 3.2.2).
- **Focus moves.** The list's + changes neither focus nor step. On success the status takes focus.
- **Errors.** A missing answer sets `aria-invalid` and an alert named by its own label, and focuses that step.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here:
- **Rendering.** Motion is transform and opacity only. One Sigil runs, behind the card.
- **Rail.** The rail is CSS and pauses on hover.
- **Testing.** All filming and form tests ran in the cloud, with api.hanzo.ai intercepted.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL — the shared layout's
- [x] `<JsonLd route>` parses; no broken URL
- [ ] Every card is a real link — n/a: no cards

Done here: `app/contact-sales/page.jsx` keeps Hanzo's title and description and renders `<JsonLd route="/contact-sales" />`. Every question, size and inclusion is in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: not a catalogue or model page

Done here: n/a. /contact-sales is a Utility page with no model cards.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. The page has no code blocks or terminals.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here:
- **States.** idle, sending (ink with a ring), sent and failed. Sent holds the card's height, scrolls it into view with `block: 'nearest'` and focuses the status. Failed keeps every answer and shows Hanzo's "Prefer email? enterprise@hanzo.ai".
- **Tested with the API intercepted:**
  - a 2.5s 200 showed success in view (CLS 0.000 at both sizes);
  - a hung POST timed out after 8s, retried once, then showed the failed state;
  - a filled honeypot is quietly accepted.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` — `lib/track.js` has not merged; nothing is sent
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/contact-sales.md` (6/10). Fixes 2–5 are applied here; fix 1 (the header ask) needs the shared header and is requested.

Done here:
- **Payload.** It is identical in shape to `content/forms.json` (name, email, company, size, need, source, visit). Inclusions join `need` only at send, one sentence per line after your own words.
- **Gallery.** `desktop-demo.jpg` (the self-playing conversation, 1470×801 film strip at 3 frames a second) and `phone-sheet.jpg` (375×812: demo typing, chip landed, rest, a tapped row inked, the Band, the footer), plus the earlier `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg`, `before-desktop.jpg`.
- **Film (7 Nov, film.mjs motion).** Desktop run 1: 0 still screens, layout shift 0.044; run 3: layout shift 0.000, one screen (the inclusions, at rest) read still, and its "dead" hovers on the route rows and "Next" were re-measured by hand and do change (route text slides 6px and inks, the arrow slides −6px, Next goes `#262626`, a logo name lifts 4px and inks). The phone walk inside film.mjs failed both times on a touch-dispatch timeout in the tool, so the phone was checked with my own probe (touch taps, demo, Band, console) and the strip above.
