# /<page> coverage (MASTER.md part 2, the 18 parts)

Copy this file to `docs/coverage/<page>.md`. Page file: `components/pages/<Name>.jsx` · gallery: `docs/gallery/<page>/` · metric id: `<id>`

Open copy questions for James:
Shared changes requested (`docs/requests/<page>.md`):
Forks this page deleted:

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [ ] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [ ] One solid fill per viewport; label and href from `lib/cta.js`
- [ ] One h1; the page is clear in 5 seconds
- [ ] No dead or self-looping button; prices from `lib/plans.js`
- [ ] Open copy questions for James listed, none decided

Done here:

## 2. Information architecture and navigation
- [ ] One `<main id="main">`; skip link reaches it
- [ ] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more
- [ ] Link parity: 0 removed, 0 unexpected

Done here:

## 3. First impression and page narrative
- [ ] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [ ] JS off: legible; no `opacity:0` on the LCP element
- [ ] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px

Done here:

## 4. Conversion system
- [ ] `<Cta>` only; no raw `.x-btn`
- [ ] Sticky ask in header and bar after the hero, same label
- [ ] Copy button copies exactly the displayed text; failure never says Copied
- [ ] `data-cta` and `data-thumb` on every primary

Done here:

## 5. Trust and proof
- [ ] No logo without documented permission; no seal; no invented number
- [ ] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates
- [ ] Privacy link and owner line beside every submit

Done here:

## 6. Content presentation (copy untouched)
- [ ] No text under 13px (14px phone) except mono capitals
- [ ] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts
- [ ] `python3 scripts/parity.py /<path>`: 0 missing

Done here:

## 7. Visual design system
- [ ] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [ ] No label, tag, badge or pill above a headline
- [ ] Radii, shadows and sizes from tokens; never box plus shadow
- [ ] One icon set; no icon in a rounded box
- [ ] Differs from neighbours in hero medium and room order

Done here:

## 8. UI component library
- [ ] Every control has hover, press, focus-visible, disabled, loading
- [ ] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native, trap focus and return it
- [ ] Inputs 16px or larger; no bare `:hover`
- [ ] Forks this page deleted: listed below

Done here:

## 9. Motion and interaction
- [ ] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [ ] At least 3 kinds of movement; scroll-linked is half or less
- [ ] Something moves without input; every control answers
- [ ] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit

Done here:

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set
- [ ] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here:

## 11. Mobile and responsive
- [ ] 375×812 and 1470×801 pass with no overlap
- [ ] No horizontal scroll at 320
- [ ] Every target 44px or more; every hover has a tap path
- [ ] Primary ask above the fold at 375×667

Done here:

## 12. Accessibility (WCAG 2.2 AA)
- [ ] Contrast measured, text at 4.5:1 or better
- [ ] Pause control on every moving item
- [ ] Forms labelled; first error focused
- [ ] One h1; no heading skips; names start with visible text
- [ ] Keyboard reaches every control

Done here:

## 13. Performance and engineering
- [ ] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [ ] No poller; no third-party request before consent
- [ ] Nothing heavy run on James's laptop

Done here:

## 14. SEO and machine files
- [ ] Title and description match live (or are listed for James)
- [ ] Canonical equals og:url equals the live URL
- [ ] `<JsonLd route>` parses; no broken URL
- [ ] Every card is a real link

Done here:

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph
- [ ] Every maker and model page linked in the DOM
- [ ] One price figure everywhere

Done here:

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] Config blocks parse on their own
- [ ] Terminal pauses and ends on a static frame
- [ ] No hand-typed version number

Done here:

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed
- [ ] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success
- [ ] A thrown island does not blank the page

Done here:

## 18. Measurement and handover
- [ ] `data-cta` on every primary; events only through `lib/track.js`
- [ ] Nothing identifier-bearing before consent; no field value in a payload
- [ ] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more

Done here:
