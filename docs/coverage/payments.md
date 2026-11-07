# /payments coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Payments.jsx` · gallery: `docs/gallery/payments/` · metric id: `signup_start`

Open copy questions for James: none new. ("Try Hanzo" is kept as the ask until `lib/cta.js` lands; the order "6735", amount 2000 and connector 'adyen' on the phone are Hanzo's own request sample, not new figures.)
Shared changes requested (`docs/requests/payments.md`): none.
Forks this page deleted: the raw `.x-btn` hero and close asks and the interim `BizAsk` (now the kit `Cta`), the v1 `Get` block and `Rise` fade-ups (24), the hand-written step list beside the phone, the `data-cursor` label, the page-level AskBar, every spring.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on this page)
- [x] Open copy questions for James listed, none decided

Done here: the top comment carries Persona, Goal, CTA, `Metric: signup_start`, Signature and Beyond; "Try Hanzo" → /login: the hero's own "Try Hanzo" is the solid kit `Cta` with `data-thumb` (the header drops to an outline while it shows on desktop; measured 1 solid fill on the first screen at 1470×801), and the close's "Try Hanzo" is solid too. `lib/cta.js` does not exist yet, so the label is Hanzo's own hero label, noted above.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's main and skip link, untouched)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: every link is `A`, `More` or the kit `Cta` (which wraps `A`); parity reports links 6/6; the BizOpen cards open panels, and every panel link is a real `<a>` in the server HTML.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: BizLines h1 + BizStage object until `PageHero` merges)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is one 44px sentence, the ask and a full-width Contact Sales row)
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: the cards open panels in place, they do not lead to pages)

Done here: the h1 "Hanzo Payments" cuts in by CSS line mask (no JS), the caption sits under it; the phone starts its checkout within 1 s. The audit finds 0 inline `opacity:0` runs in the hero's server HTML; the phone's top sits at 258px at 1470×801 and 388px at 375×812. The whole checkout lands on the first screen: the Pay → "succeeded" button sits at y 677–733 at 1470×801 (the device is 30.5em tall there) and at y 630–682 at 375×812 (on phones the button sits under the amount).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the site's shared ask bar reads `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (the kit `Code` copy)
- [x] `data-cta` and `data-thumb` on every primary

Done here: hero `<Cta to="/login" id="payments.hero" thumb>` (solid), close `<Cta id="payments.close">` (solid), "Explore APIs" is `<Cta kind="link" id="payments.apis">`; the header carries the same "Try Hanzo" on desktop and the phone bar reads the hero's `data-thumb`. "Explore APIs", "API Reference", "Deploy to Cloud" and "Contact Sales" are text links.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: the v1 marquees were removed)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: the only figures are Hanzo's code sample (amount 2000, $20.00, order 6735, 'adyen') and the calculator's figures, which are computed only from those and the reader's own inputs (amount, payments, split, soft-decline share); the payment methods are a type list, not logos.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /payments`: 0 missing

Done here: parity 139/139 text, 6/6 links. On phones every label is 14px; only the 13.5px code pane is smaller (MASTER part 6); code is the kit `Code`, the spec and checkout lists live in `BizSheet` drawers.

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

Done here: pause, tracker steps, chips, "Roll back at once", rows and sheet buttons have a hover fill inside `@media (hover: hover)`, press scale .97 and a 2px focus ring; "Roll back at once" disables at 0%; the split's range input has a 2px white focus ring on the black room. The checkout's nine methods light one by one on arrival and the four cases deal in as one list, so the back half answers before it is touched. Every `:hover` rule sits inside a hover media query. Deleted forks are listed at the top. Slice D, 7 Nov: pointing at a method lights the line it belongs to (cards and wallets → 01; iDEAL, Bancontact, SOFORT → 02 and 03) and greys the other group; "Explore APIs" and "API Reference" underline and nudge their arrow 4px on hover (measured with a Playwright hover probe).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own)

Done here: Signature `calculator`, the black room right under the hero ("Move a percentage first"): the visitor types the order's amount (default $20.00, Hanzo's `amount: 2000`, usd) and how many payments (default a hundred), drags the split by percentage (64→84px figures while held) and the soft-decline share on the current processor (default 0, the visitor's own number; no rate is assumed). Everything reprices instantly: each processor's payments and value, the "attempt 2 · backup" count and value that fall through instead of reaching a customer, a hundred dots re-routing (filled = second processor, ring = backup), the `amount:` line beside the fields, the hero phone's amount and the code sample's `amount:`. "Roll back at once" still sends it all home. Removed: the BizChapters pinned scene and its route stage; its header, four steps and three notes are now plain rows ("What sits behind the one integration") after the calculator, and the BizStage scroll wrapper (a no-op at from=1, lift=0) is gone. Supporting: the self-running checkout (idle, pausable) and BizOpen cards (state). Probe: 0 console errors at 1470×801 and 375×812, also with reduced motion (the hero's reduced-motion read now happens after hydration); CLS ≤ 0.0002; hscroll 0; variety OK. Slice D, 7 Nov: the five motion-map entrances, page-local, once each: stretch-scroll on the calculator room (client-only scaleY 1.12 → 1 from the top as it scrolls in), curtain-rise on "What sits behind", word-shuffle on "One API in front of all of them" (words start in each other's places and swap home), side-carousel on the checkout methods (snapping steps from the right), stack-drop on the four cases (replaces their fade-up). Server render is the final state; a probe scrolls every entrance into view at 1470 and 375, under reduced motion and with JS off, and finds every element at opacity 1 with no transform or clip left.

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

Done here: film at 375×812 width 375/375, 0 targets under 44px; the ask sits at about 320px on a 375 phone. The calculator's fields are 56px tall and its sliders 44–88px; under 900px the fields sit two to a row and the step rows stack number-left. Slice D, 7 Nov: the step-04 rows measured under reduced motion: 'succeeded' and 'adyen' sit inside their rows at 1470 (row 609–861, chips 626–728 and 626–680), 375 (row 62–313) and 320 (row 34–286); check.mjs finds no text sticking out at 1470×801 or 375×812.

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

Done here: no live data; the checkout shows every state it narrates (method, vault token, rule, soft decline as an inverted chip, backup, `succeeded` as an outlined chip); the split's empty state is "Roll back at once" disabled at 0%. Each attempt row wraps its chip inside the row when narrow (measured 0px overflow at step 04 at 1470 and 375). The split's `--f` style is a string on server and client (one cause of a hydration warning the critic traced); the shared footer's own mismatch is not this page's file.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (data-cta set; `lib/track.js` not on main yet)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/payments.md` verdict 8 or more (no review written yet)

Done here: `data-cta="payments.hero"` and `"payments.close"`; no tracking code of the page's own. Gallery: `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`, filmed at 1470×801 and 375×812 with no console errors. Slice D, 7 Nov: check.mjs at 1470×801 and 375×812: 0 console errors, no Next issue badge, scrollWidth 1470/1470 and 375/375; `desktop-hero.jpg`, `desktop-checkout.jpg`, `phone-1..3.jpg` refreshed from those runs.
