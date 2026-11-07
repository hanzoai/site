# /payments coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Payments.jsx` · gallery: `docs/gallery/payments/` · metric id: `signup_start`

Open copy questions for James: none new. ("Try Hanzo" is kept as the ask until `lib/cta.js` lands; the order "6735", amount 2000 and connector 'adyen' on the phone are Hanzo's own request sample, not new figures.)
Shared changes requested (`docs/requests/payments.md`): none.
Forks this page deleted: the raw `.x-btn` hero and close asks (now `BizAsk`), the v1 `Get` block and `Rise` fade-ups (24), the hand-written step list beside the phone, the `data-cursor` label, the page-level AskBar, every spring.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on this page)
- [x] Open copy questions for James listed, none decided

Done here: the top comment carries Persona, Goal, CTA, `Metric: signup_start`, Signature and Beyond; "Try Hanzo" → /login is the only solid fill (hero, then the close), the audit counts 1 solid button in the first 1470×801 view. `lib/cta.js` does not exist yet, so the label is Hanzo's own hero label, noted above.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's main and skip link, untouched)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: every link is `A`, `More` or `BizAsk` (which wraps `A`); parity reports links 6/6; the BizOpen cards open panels, and every panel link is a real `<a>` in the server HTML.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: BizLines h1 + BizStage object until `PageHero` merges)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is one 44px sentence, the ask and a full-width Contact Sales row)
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: the cards open panels in place, they do not lead to pages)

Done here: the h1 "Hanzo Payments" cuts in by CSS line mask (no JS), the caption sits under it; the phone starts its checkout within 1 s. The audit finds 0 inline `opacity:0` runs in the hero's server HTML; the phone's top sits at 258px at 1470×801 and 388px at 375×812 (272px of product inside 660px).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (kit `BizAsk` until `<Cta>` merges)
- [x] Sticky ask in header and bar after the hero, same label (the site's shared ask bar reads `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (the kit `Code` copy)
- [x] `data-cta` and `data-thumb` on every primary

Done here: hero `BizAsk to="/login" thumb="Try Hanzo" cta="payments.hero"`, close `cta="payments.close"`; the shared bar takes the hero's `data-thumb`, so the same "Try Hanzo" follows the reader. "Explore APIs", "API Reference", "Deploy to Cloud" and "Contact Sales" are text links.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: the v1 marquees were removed)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: the only figures are Hanzo's code sample (amount 2000, $20.00, order 6735, 'adyen') and the split's own percentages, which are the reader's input; the payment methods are a type list, not logos.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /payments`: 0 missing

Done here: parity 139/139 text, 6/6 links. The phone audit's only sub-14px text is 12px Zen Mono capitals and the 13.5px code pane (MASTER part 6); code is the kit `Code`, the spec and checkout lists live in `BizSheet` drawers.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; the CSS uses only `--bz-*` tokens plus #000000, #fafafa, #a3a3a3 and #fff; radii are 6/8/12/16/24/full (the device frame's own radius is drawn art); type sizes 12–64 from the deck list, h1 52, headings 26, figures 64; the phone, hub and code pane are outlined, nothing is raised. Hero medium (a phone under a centred title) differs from /ledger (a book beside the title) and /captable (a figure).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit BizSheet and BizOpen trap and return focus)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: pause, tracker steps, chips, "Roll back at once", rows and sheet buttons have a hover fill inside `@media (hover: hover)`, press scale .97 and a 2px focus ring; "Roll back at once" disables at 0%. 6 `:hover` rules, 0 outside a hover media query. Deleted forks are listed at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own)

Done here: signature (the checkout, idle) + Stage (scroll) + chapters (scroll) + BizOpen (state); the split figures grow 64→84px only while dragged (pointer). variety OK, 0 `Rise`, 0 springs, tweens at 300/400/500ms with the deck curves; the film uses setTimeout only and reduced motion shows `succeeded`.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: one decorative `<img>`, Hanzo's enso.webp at 48×48 with width and height)
- [x] At most 2 videos playing; pause button on loops over 5 s (no video; the checkout loop has a 44px pause)
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: the page has one image)

Done here: the merchant image is `/models/enso.webp` with `alt=""` (decorative) and fixed 48×48; the self-running checkout has its own pause button.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: film at 375×812 width 375/375, 0 targets under 44px; the ask sits at about 320px on a 375 phone. Chapters stack under 900px with a compact checkout card each; the route diagram is desktop only.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form; the range input has a label and `aria-valuetext`)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: text is #0a0a0a or #525252 on white and cards, #737373 only on white, #a3a3a3 and white 55% only on black; the checkout pause has `aria-pressed`; tracker steps are buttons with `aria-pressed`; one h1, then h2 sections and h3 inside.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the phone render on the server; motion is transform and opacity; timers run only while the hero is on screen (`useLive`) and stop on pause; filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: the BizOpen cards open panels in place)

Done here: `app/payments/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/payments" />`.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a)
- [ ] Every maker and model page linked in the DOM (n/a)
- [ ] One price figure everywhere (n/a: no price)

Done here: n/a, a Launch page for one product; nothing on it is a catalogue card.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (kit `Code` until `CodeBlock` merges)
- [x] Config blocks parse on their own (n/a: no config block)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal)
- [x] No hand-typed version number

Done here: one code pane, Hanzo's `hanzo.payments.create` request in greys (kit `.bz .cf-code`), 13.5px/1.65, Copy copies the displayed text.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: no live data; the checkout shows every state it narrates (method, vault token, rule, soft decline as an inverted chip, backup, `succeeded` as an outlined chip); the split's empty state is "Roll back at once" disabled at 0%. Film: no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (data-cta set; `lib/track.js` not on main yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/payments.md` verdict 8 or more (no review written yet)

Done here: `data-cta="payments.hero"` and `"payments.close"`; no tracking code of the page's own. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`, filmed at 1470×801 and 375×812 with no console errors.
