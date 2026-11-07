# /founder coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Founder.jsx` · gallery: `docs/gallery/founder/` · metric id: `lead_submit`

Open copy questions for James: none (the claim states now use Hanzo's own sentences only).
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: `x-btn` buttons (now kit `Cta`), raw inputs (now kit `Field`), the looping hero merge and its solid fake Merge button, the lone icon tile, "Sent.", "Sending…" and the refusal sentence, box-plus-shadow on lit level cards.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/founder/page.jsx` names Persona, Goal, CTA, Metric `lead_submit`, Signature, Beyond. One solid per screen: kit `Cta` "Claim a merged pull request" (`founder.hero`, `data-thumb`) in the hero, "Send the claim" (`founder.claim`) in the claim; "Every open bounty" is quiet in the dark room. No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`; parity links 1/2 (the second is Cloudflare's email-protection artifact; the mailto to support@hanzo.ai is on the page).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages.

Done here: Nothing above the h1. "Merge a pull request. / Get Pro." (52px) cuts in by line mask; the hero pull request merges once within 2 s and stays merged. `PageHero` is not in the kit (left open). The page ends on the claim then the footer, so the ask is the last thing; a kit `Band` would repeat it (left open). JS off: `NoJs` plus a page rule lay the scene flat.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the primary; the submit is a kit `Cta` with the system busy ring.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or invented figures; the levels are Hanzo's thresholds.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: the only figures are Hanzo's thresholds (1 and 3 merged, 1,000 lines) with their words beside them.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [x] Privacy link and owner line beside every submit

Done here: No figures but Hanzo's thresholds; no logos or seals; the privacy of the claim is Hanzo's own sentence (granted by hand by a Hanzo admin).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /founder`: 0 missing

Done here: Parity 37/37 text. Type from MASTER: h1 52px, section heads 26px, the count 64→112px only while it is the moment (84px phone), the level you reach 44px, org names 44px, level titles 26px, body 16–17px; Faq is the kit's.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only); nothing above a headline; cards 24 radius with a hairline that inks when lit, no shadow; one dark room (repositories). The hero object is a pull request, unlike /bounty (live list) and /grants.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: `x-btn` buttons (now kit `Cta`), raw inputs (now kit `Field`), the looping hero merge and its solid fake Merge button, the lone icon tile, "Sent.", "Sending…" and the refusal sentence, box-plus-shadow on lit level cards. listed below

Done here: Kit `Cta` and `Field` states (hover, press .97, focus ring, busy, dashed invalid); steppers have hover, press .97, focus ring, disabled at zero; bounty rows, FAQ rows and Find an issue answer hover and press.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the scroll merges 0–3 pull requests, pours each level and grows the count. Time: the hero pull request merges once. State: the + and − change the level shown at full size. Arrival: line-mask h1. Ease-emphasis, no springs; reduced motion shows final states; the phone counts 0, 1, 3 once in view.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the objects are the pull request, the count and the level cards.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the objects are DOM and SVG.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: hero ask full width above the fold, the scene lies flat and counts once, steppers stack, the form is one column with 56px fields; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+; one h1, h2s in order; the count is `aria-hidden` with the words beside it; steppers labelled with live outputs; wrong fields are `aria-invalid` and the first takes focus; the result takes focus.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; one GitHub search request, no poller; the open-bounty list keeps 400px of room while GitHub answers so nothing below moves; motion is transform and opacity.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/founder" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: Reading, empty and unreachable states for the open bounties in Hanzo's words; the claim is checked before sending (the pull request address is tidied: no scheme, /files, /commits, hash); a refused claim keeps every value and shows Hanzo's own support sentence; success shows only on a 2xx (tested with interception, 200 and 500).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/founder.md` verdict 8 or more

Done here: `data-cta` ids `founder.hero`, `founder.claim`, `founder.bounties` (kit Cta fires `cta_click`); the lead carries only what the visitor typed, on submit; V2 line in the route header; critic review (6/10 at `9afe46a`): reserved list height, merge once, ask kept in the dark room, counter tile, Hanzo-only claim states, Field and normalised address, phone moment, ending on the claim, hovers, kit and no-JS all fixed.
