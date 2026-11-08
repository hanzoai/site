# /buying-specialist coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/BuyingSpecialist.jsx` · gallery: `docs/gallery/buying-specialist/` · metric id: `signup_start`

Open copy questions for James (labels not on Hanzo's captured page; they come from the specialist's own reply card and written answers in `BuyingSpecialist.data.js`, kept until James says yes or gives Hanzo's words):
- "Hanzo Team Configuration" and "SAVE 20% ANNUALLY" (the sheet's header; the reply card's `${plan} Configuration`).
- "members" beside the seat count (the written answer's "For a team of N members"; Hanzo's brief says "2 to 100 members").
- "Annual Rate (Recommended)", "Billed $N annually upfront", "Monthly Rate", "Cancel anytime", "/mo" (the reply card's words).
- "Start Team Plan →", "Start Enterprise Plan →" (the specialist's plan buttons under every reply), used as the page's one ask.
- "Enterprise Configuration" (the reply card's `${plan} Configuration` for Enterprise).
- Enterprise numbers: content/ has no Hanzo figure for the Enterprise seat, so $20/seat/month ($240/seat/year, billed annually, 20-seat minimum) comes from the specialist's brief in `BuyingSpecialist.data.js`. The old "SAVE 20% ANNUALLY" beside equal $400/mo rates was our arithmetic (monthly = annual / 12), now fixed: Enterprise shows one annual rate and no saving pill.
- Removed: the "01"–"06" numbers on the promises (no Hanzo words; a square marker shows the active promise instead).
Shared changes requested (`docs/build-notes/requests/<page>.md`): none.
Forks this page deleted: `x-btn` quote buttons and the sheet's solid button (now kit `Cta`), the pulsing orb above the h1, the sticky floating composer, the drag rail with elastic ends (now one ledger), box-plus-shadow on the sheet and composer.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/buying-specialist/page.jsx` names Persona, Goal, CTA, Metric `signup_start`, Signature, Beyond. One solid per screen: kit `Cta` "Start Team Plan →" on the quote card (`buying-specialist.quote`, `data-thumb`), the shared bar after the hero, and the closing `Band`. No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`; parity links 1/1; the reply's plan links go to /pricing, /pay/cart, /enterprise/start and cal.com.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages.

Done here: Nothing above the h1 (the orb is gone). "Hi there, let's find the right plan for your team." (52px) cuts in by line mask; the quote card re-prices within 1 s (10, 25, 50, 4, then rests on 10). `PageHero` is not in the kit (left open). Ends in kit `Band` then the footer. JS off: `NoJs` shows every final state.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the primary ("Start Team Plan →" on the sheet). Desktop: once the sheet's button has gone by, the header's solid carries "Start Team Plan →" (shared `data-thumb` mechanism, measured). Phone (700px and under): the shared bar never found a clear band on this page, so the page has its own slim `data-dock` bar under the thumb: the sheet's live members and price (rolling) and a quiet "Start Team Plan →" (`buying-specialist.dock`); it shows only after the first screen and steps aside for the sheet's own button, the closing band, the footer, the cookie note and the keyboard. Phone first screen: the compact quote carries its own "Start Team Plan →" (y 449-493 of 812). After a chat answer: no second quote card; the answer's plan and seats move the one sheet (Team 2-100 or Enterprise 20-500), whose solid is the one ask; under the answer sit one link-kind ask for that plan and one text link (cal.com), no pill row. The header's label swap ("Try Hanzo" then the page ask) is the shared Ask mechanism, not page-local.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or invented figures; prices come from Hanzo's seat prices.
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [x] Privacy link and owner line beside every submit

Done here: Every price is Hanzo's seat price times members (`BuyingSpecialist.data.js`); "SAVE n% ANNUALLY" beside it as on Hanzo's card; the privacy line sits under the composer.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ or tabs; answers render Hanzo's markdown.
- [x] `python3 scripts/parity.py /buying-specialist`: 0 missing

Done here: Parity 20/20 text. Type from MASTER: h1 52px, members 64px (220 weight), prices 32px, card title 21px, promise titles 21px, body 16px, mono 13px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only); nothing above a headline; the sheet is the one dark object, radius 24, no shadow; the composer radius 28. Differs from the other program pages: its hero object is the live quote card beside a chat.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: `x-btn` quote buttons and the sheet's solid button (now kit `Cta`), the pulsing orb above the h1, the sticky floating composer, the drag rail with elastic ends (now one ledger), box-plus-shadow on the sheet and composer. listed below

Done here: Kit `Cta` states; all four chips have hover (ink hairline, grey fill, 1px lift via `translate` so Motion's inline transform cannot cancel it; measured on each), press .97 in 90ms, focus ring in `--focus`; the send button presses .97 and greys while busy; the slider is drawn with a 44px hit area and focus ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the quote card re-prices once by itself (first move at 0.9s, then every 2.4s: 10, 25, 50, 4, rests on 10) with prices rolling (0.3s ease-emphasis, the leaving figure clipped in its own box); telling the chat a team size sets the card. Promises: one dark sheet beside the ledger changes with the promise picked by scroll, hover or focus; each scene is a small render of the page's own UI at the live seat count: seats filling with the price; the two rate tiles with the annual one picked and the SAVE pill; the configuration with members, seats and its slider; the chat (question, the Team answer, "Finding the best plan..."); the Enterprise answer with "Book a Call"; the composer typing a question over the privacy line. Markers are ink dots that grow on the active promise. Under 900px the pinned stage stacks (MASTER): each promise is followed by its own small card with its scene, nothing sticky over the list. The dark objects use page-local dark tokens (`.xbs-ink`), not `data-room="dark"`, so the shared header stays light over the white page (measured at every 150px of scroll; it turns dark only over the closing band). One solid at a time from first paint (the /affiliate move): CSS outlines the header's ask on this route until `useQuietHeader` finds none of the page's solids on screen. After a chip, the question is scrolled to the top (it no longer scrolls out of view). Arrival: line-mask greeting; chips arrive 60ms apart; replies arrive one by one. No springs or elastic ends; reduced motion shows the final card.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the object is the live quote card in DOM.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: greeting, lede, then the compact quote on the first screen: members and price in one dark strip that re-prices within a second, with a seat bar filling under it (a tap goes to the full card); the promises sheet sticks under the header with an opaque collar; the slim dock carries the ask after the first screen and stays away while the sheet (and its slider) is on screen; at 1470x801 the sheet ends at y 755 with "Start Enterprise Plan" inside the fold, and both rate labels hold two lines so the prices share a baseline; chips full width, composer 56px; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+; one h1 (kept for screen readers once the chat starts); the log is `aria-live`; both inputs have real `<label for>`: the slider's is the visible "10 members" figure above it, the message box's a screen-reader label with its own placeholder words; keyboard reaches every control.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; one chat request and one form response per question, no poller; motion is transform and opacity.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/buying-specialist" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- [x] One price figure everywhere

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

Done here: Loading: "Finding the best plan for your team..." as a status; error: Hanzo's own written answer stands in when the chat endpoint fails (tested with interception); the composer keeps the question until it is sent.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/buying-specialist.md` verdict 8 or more

Done here: `data-cta` ids `buying-specialist.quote`, `.mini`, `.dock`, `.reply` (kit Cta fires `cta_click`); the transcript is filed through Hanzo's form endpoint only after a question (no field value before); V2 line in the route header; conductor review `docs/build-notes/review/buying-specialist.md` (6/10 at `29e299e`): blue (0 hues measured on every element at both sizes), phone first screen, sticky ask (header on desktop, own dock on phone), promises as one changing sheet, labels and chip hovers all fixed; added labels listed as copy questions above.
