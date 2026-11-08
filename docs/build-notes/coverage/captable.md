# /captable coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Captable.jsx` · gallery: `docs/gallery/captable/` · metric id: `signup_start`

Open copy questions for James: none new. ("Try Hanzo" is kept as the ask until `lib/cta.js` lands. The example company's inputs, 8,000,000 founder shares, a 1,000,000 pool, a $500,000 SAFE at an $8M cap and 20% discount, a $2M raise, are v1's labelled example, shown as "Example company. Every number in it is an input you would give your own."; James may want them confirmed.)
Shared changes requested (`docs/build-notes/requests/captable.md`): none.
Forks this page deleted: the raw `.x-btn` asks and the interim `BizAsk` (now the kit `Cta`), the v1 `Get` block and `Rise` fade-ups, the drift's `setInterval` (now one setTimeout), the pulse dot, the inverted price chip and (round 2) the solid black "Founders, fully diluted" chip (now ink-on-white mono), every spring, the kickers above headlines, BizChapters' six stacked phone tables (replaced on phones by the page-local `captable/PhoneSteps.jsx`), the stray "×" on the term sheet's signature line.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (plan prices are Hanzo's four plans as printed; `lib/plans.js` is not on main yet)
- [x] Open copy questions for James listed, none decided

Done here: the top comment carries Persona, Goal, CTA, `Metric: signup_start`, Signature and Beyond; the header's "Try Hanzo" is the one solid fill (SYSTEM.md §5), the page's hero and close asks with the same words are quiet kit Ctas; the audit counts 0 page-owned solid buttons in the first 1470×801 view. (8 Nov) The hero "Try Hanzo" is the solid fill while it is on screen (header goes quiet, also on phones), so the first screen has exactly one solid ask.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's, untouched)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: links are `A`, `More` and the kit `Cta`; parity links 7/7. Plan cards open their own panels; each panel's CTA (Get on GitHub, Contact Sales) is a real `<a>` in the server HTML.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: BizLines h1 + the table object until `PageHero` merges)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close: one 44px sentence, the ask, a full-width "Read the docs" row)
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: plan cards open panels in place)

Done here: the h1 cuts in by CSS line mask; the founders' share is the one big thing, 112px at the top and settling to 64px over the first 360px of scroll. The first price step fires 450ms after the hero is live (measured about 590ms after hydration), then one every 1.3s. Blank bands between sections are 188px or less at 1470 (measured: 188, 142, 188, 188, 188, ~120). On phones the six chapters no longer repeat the table: one compact table pins under the header and the chapter text scrolls under it, so no run of same-height sections. The table's top sits at 148px at 1470×801.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the header's "Try Hanzo"; the phone bar reads `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button)
- [x] `data-cta` and `data-thumb` on every primary

Done here: hero `<Cta kind="quiet" to="/login" id="captable.hero" thumb>`, close `<Cta kind="quiet" id="captable.close">`, "Documentation" is `<Cta kind="link" id="captable.docs">`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: none)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: every percentage and payout is computed from the labelled example inputs, and "Example company…" sits inside the object; "SOC 2 compatible controls" stays Hanzo's wording inside the term sheet.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (the cap table is product UI drawn as a table; the ten clauses sit in a `BizSheet`)
- [x] `python3 scripts/parity.py /captable`: 0 missing

Done here: parity 103/103 text, 7/7 links; the phone audit finds 0 text under 14px and 0 targets under 44px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; colours are `--bz-*` tokens plus #000000, #fafafa, #fdfdfd, #a3a3a3, #737373, #171717, #262626; holders are ink, #737373, #a3a3a3 and the track grey; radii 6/8/12/16/24/full; the table object and the term sheet are outlined, nothing is raised; h1 52, headings 26, figures 64 (32–44 in cards). Hero medium is a figure, unlike /payments (a phone) and /commerce (a rail).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit BizSheet and BizOpen)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: pause, chips, the close row, the Documentation / For Developers / Custom Solution rows (fill #f2f2f2 and the link steps 4px, measured transparent → rgb(242,242,242)) and the Growth card have a hover answer inside `@media (hover: hover)`; the hero "Documentation →" draws an underline in from the left and steps its arrow 4px; press scale .97 and a 2px focus ring; the two range inputs have labels, 44px hit areas and `aria-valuetext`. (8 Nov) The inline "Captable, Inc." link answers hover (underline thickens and steps down).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: no sound of its own)

Done here: signature (the round re-runs itself, idle) + the figure settling (scroll) + chapters (scroll) + BizOpen (state) + the fork drawing's lines drawing in once in view; the exit price grows 64→84px only while dragged (pointer), anchored at its bottom-left with a 34px reserve, so the digits stay clear of the "Exit price" label. variety OK, 0 `Rise`, 0 springs (digit roll is a 300ms ease-emphasis tween), the drift is one setTimeout; reduced motion stops the drift and shows the figure at rest.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no image or film)
- [x] At most 2 videos playing; pause button on loops over 5 s (no video; the drifting round has a 44px pause)
- [x] Budgets met; nothing missing; alt on every image (n/a: no image)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a)

Done here: the page's objects are drawn product UI (table, bar, term sheet, waterfall, plan cards, the fork drawing of hanzoai/captable branching from captableinc/captable, the "Get Captable" repo card with its Apache-2.0 and 3-stars chips); the self-running round has its own pause button.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: overflow 0 at 375×812 and 1470×801 (errs.js); the hero stacks title, figure, ask, table, then the lede; the chapters pin one compact table under the header with the text scrolling under it (`captable/PhoneSteps.jsx`); under 600px the close row stacks ("Get started with Cap Table" on one line, "Read the docs →" right-aligned below, each 1 line); the ask sits at about 430px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: text is #0a0a0a or #525252 on white and cards, #737373 only on white, #a3a3a3 and white 55% only on black; the rolling figure has a screen-reader copy (`x-sr`); pause has `aria-pressed`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: bars move by transform only; the drift runs only while the hero is on screen (`useLive`); filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (n/a: plan cards open panels in place)

Done here: `app/captable/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/captable" />`.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: each plan's price ($50/mo, $150/mo, Free, Custom) appears once on its card and once in its own panel, the same string both times.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (n/a: no code on the page)
- [ ] Config blocks parse on their own (n/a)
- [ ] Terminal pauses and ends on a static frame (n/a)
- [x] No hand-typed version number

Done here: n/a beyond links: the docs, hanzoai/captable and the upstream captableinc/captable are kept.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page

Done here: no live data; the SAFE says whether it converts at its cap or its discount; the waterfall handles exits below the preferences (pro rata) and shows 0% rather than dividing by zero. Film: no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/captable.md` verdict 8 or more (no review written yet)

Done here: `data-cta="captable.hero"`, `"captable.docs"`, `"captable.close"`; gallery `desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`, and round 2's `desktop-r2.jpg`, `phone-r2.jpg` at 1470×801 and 375×812; errs.js 0 errors at both sizes; V2 line updated for round 2.
