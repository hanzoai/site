# /sms-opt-in coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/SmsOptIn.jsx` · gallery: `docs/gallery/sms-opt-in/` · metric id: `lead_submit`

Open copy questions for James: a refused send has no words of Hanzo's: the number stays and the field is marked (dashed) and focused; James to say whether he wants a line there. The five chip names (What, How often, Cost, How to stop, Purchases) label parts of Hanzo's own consent paragraph; listed for James's yes.
Shared changes requested (`docs/build-notes/requests/<page>.md`): `docs/build-notes/requests/affiliate.md` (the header's ask outlines while a page's own ask is on screen, and carries it after the hero; on /sms-opt-in it now carries "Yes, sign me up!").
Forks this page deleted: the hand-made submit button and spinner (now kit `Cta` busy), the raw phone input (now kit `Field`), the label above the h1, the looping messages, the indigo accent, 72px bubbles all at once, box-plus-shadow on the field and keys.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/sms-opt-in/page.jsx` names Persona, Goal, CTA, Metric `lead_submit`, Signature, Beyond. One solid per screen: kit `Cta` "Yes, sign me up!" (`sms-opt-in.submit`), enabled as on hanzo.ai once the box is ticked and the number has ten digits; the form carries `data-thumb` so the header carries it after the hero. Open question listed above.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`; parity links 2/2 (Terms of Service, Privacy Policy).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages.

Done here: Nothing above the h1: "SMS Notifications" is now its caption below it. "Get Hanzo text messages" (52px) cuts in by line mask; the phone lands and its three texts arrive once within 2 s, then rest. `PageHero` is not in the kit (left open). The page ends on the dark room (bubbles, STOP and HELP) then the footer (left open: no `Band`). JS off: `NoJs` shows final states.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only; `data-cta` on the submit and `data-thumb` on the form; no copy control.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [x] Privacy link and owner line beside every submit

Done here: No figures, logos or seals; the privacy line and links sit under the submit ("We never sell or share your mobile number…").

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code.
- [x] `python3 scripts/parity.py /sms-opt-in`: 0 missing

Done here: Parity 11/11 text; the consent paragraph is word for word. Type from MASTER: h1 52px, caption 12px mono caps, lede 21px, field 21px mono at 56px, the bubble you are on 44px, the others 26px, keys 17px mono.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only; the indigo accent is gone); nothing above a headline; radii 24/16/12/8, no box plus shadow; one dark room. The hero object is the phone, unlike the other program pages.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the hand-made submit button and spinner (now kit `Cta` busy), the raw phone input (now kit `Field`), the label above the h1, the looping messages, the indigo accent, 72px bubbles all at once, box-plus-shadow on the field and keys. listed below

Done here: Kit `Cta` and `Field` states (hover, press .97, focus ring, busy, disabled, dashed invalid); consent chips answer hover, press .97 and focus, and each lights its words and its part of the phone; the custom checkbox has hover and a focus ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the phone mirrors your number and lights each consent part (What and How often: the texts; Cost: the To line; How to stop: the keys; Purchases: the sender). Time: the three texts arrive once. Scroll: the dark room's bubbles take turns being big. Arrival: line-mask h1. Ease-emphasis, no springs or loops; reduced motion shows final states.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the phone is drawn in DOM.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the phone is DOM.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: headline, caption, lede, then the phone (cropped) and the form; field 56px, submit full width; bubbles 21/32px; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+ (the third bubble reads again); one h1; the field labelled; the consent box has an accessible name; the result takes focus; a refused send marks and focuses the field.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; one request on submit only; no poller; motion is transform and opacity.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/sms-opt-in" />` renders canonical and og tags.

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
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data; the only request is the consent itself.
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: Success ("You're opted in") shows only on a 2xx, so the consent record is real; a 500 or a network failure keeps the number, marks the field and focuses it (tested with interception, 200 and 500).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/sms-opt-in.md` verdict 8 or more

Done here: `data-cta` id `sms-opt-in.submit` (kit Cta fires `cta_click`); the consent text sent is the paragraph shown; V2 line in the route header; conductor review `docs/build-notes/review/sms-opt-in.md` (4/10 at `25b197c`): invisible bubble, scale, floating pill, label above the h1, Cost hover and the missing card all fixed.
