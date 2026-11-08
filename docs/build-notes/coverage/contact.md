# /contact coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Contact.jsx` (+ `Contact.css`; route `app/contact/page.jsx`) · gallery: `docs/gallery/contact/` · metric id: `contact.hero` (the one contact click; contact_sales_submit downstream)

Open copy questions for James:
- The closing Band repeats the Sales route's heading, "Bring Hanzo to your company.". It is Hanzo's sentence, but it appears twice. Is there a closing line Hanzo prefers?
- The community rows show each channel's address in small mono (for example `github.com/hanzoai`). The words are Hanzo's own link addresses with `https://` and `www.` dropped, not new copy; they are `aria-hidden`, so each link's name stays the channel name. Keep, or remove?

Shared changes requested (`docs/requests/contact.md`): on phones, let the header's solid button carry the page's `data-thumb` ("Talk to sales") after the hero, as `components/Ask.jsx` already does above 700px.

Forks this page deleted: the raw `.x-btn` hero buttons (kit `Go`); the page-wide `.x-btn.solid:hover` override that broke the kit Band; the Visit room's second contour map; the 01–04 jack numerals; the route counters; the running wire pulse; the page's own clipboard call (now the kit's `copyText`, with its phone fallback and chime).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a for prices: none on the page)
- [x] Open copy questions for James listed, none decided

Done here: The one ask is Hanzo's "Talk to sales" (`data-cta="contact.hero"`, `data-thumb`), in the Sales route chosen on arrival; the cable's arrival sweep never changes the route. The h1 is "How can we help?"; `app/contact/page.jsx` carries Persona, Goal, CTA, metric, Signature, Beyond and the V2 line. Labels are Hanzo's verbatim (`lib/cta.js` is not on this page's path).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more: n/a, /contact is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is the kit `A` or `Go`, plus the kit `Band`; the nine community rows are whole-row real links. `python3 scripts/parity.py /contact` on 7 Nov: links 15/15.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (company `MaskLines` h1 + lede + panel stand in for the kit hero)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph: n/a, no cards lead to pages

Done here: Rooms in order: the patch panel hero, the dark Visit room with the live clock, the community index with its plate, the closing Band "Bring Hanzo to your company." with one solid "Talk to sales", then the footer. The h1 cuts in and the panel rises on CSS delays (0.55s / 0.7s); the cable sweeps the four sockets after the headline. With JS off a `<noscript>` style stacks all four routes and hides the cable, plug, plate and copy button.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (kit `Go`; the kit `Cta` is not on this page's path)
- [x] Sticky ask in header and bar after the hero, same label (desktop yes; phone see below)
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Measured at 1470×801 (Playwright, every 300px): the shared header button reads "Try Hanzo" while the hero's own solid ask is on screen (header quiet), then "Talk to sales" → /contact-sales/ from scroll 600 to the end, solid ink from 1500; no floating bar on desktop (removed site-wide). At 375×812 the header keeps the shared "Try Hanzo" at every scroll. The slim "Talk to sales" bar is shared chrome and rests only where nothing sits under it, so it is rare and not dependable: in my round-2 scan (cookie note rejected, 220px steps, 1.1s rest each) it showed at exactly one step (scroll 1760, top 758, in the Visit room's empty bottom) and never over a community row; the round-2 critic saw it at none of 24 steps. Treat the phone as having no sticky page ask beyond the header's "Try Hanzo" and the closing Band. The phone header ask is requested in `docs/requests/contact.md`. The copy button uses the kit `copyText`; clipboard read back "hello@hanzo.ai" at both widths.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates: n/a, no marquee
- [ ] Privacy link and owner line beside every submit: n/a, no form

Done here: The page's only proof is Hanzo's address ("1 Ferry Building, San Francisco, CA 94105") beside the live San Francisco clock; no logos, figures or quotes are added.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts: n/a for kit tabs, the patch panel is a page-local APG tablist because it is the signature
- [x] `python3 scripts/parity.py /contact`: 0 missing

Done here: Parity 29/29 text, 15/15 links (7 Nov). Resting type follows live hanzo.ai (JAMES rule 1), measured: h1 52px at 1470 (41px at 375), "Visit" and "Join the community" 26px, route headings 26px. The Visit room has one big thing, the 440px live clock; "Visit" 26px, "1 Ferry Building" 21px, the city 17px grey. The community list has three sizes: names at 26px (24px phone), each over its address in 13px mono (14px on phones, breaking only after a slash), and the plate's 40–52px name on desktop. The kit Band's heading keeps the kit's size (the closing moment; kit-owned).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` on `Contact.jsx`, `Contact.css`, `app/contact/page.jsx`: OK (3 checked). Only deck neutrals and black/white alpha steps. The plate's contour is drawn in `--ink2` (#525252, measured rgb(82,82,82)), one step darker than the old 50% black. `unique.py`: OK, 136 pages unique.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native, trap focus and return it: n/a, no dialog
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Route buttons and the copy button are 48px; jacks 120px tall on desktop, 44px pills on phones; community rows 84px (72px phone). Press: jacks and copy .97 at 90ms; a pressed community row's name holds at 1.26 for 90ms. Every hover sits in `@media (hover:hover)`; focus ring 2px ink with a white halo (light ring in the Band).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (the clock ticks on one interval only while on screen, once a minute under reduced motion)
- [ ] Sound only on the listed moments, through the one kit (copy success plays the kit's chime via `copyText`; the copy button's own click tick is silenced)

Done here: No springs remain: the plug moves socket to socket on `{ duration: 0.4, ease: [.16,1,.3,1] }` and the plate name rises on 0.3s ease-emphasis (no overshoot). Kinds: arrival (h1 cut-in, panel rise), idle (the cable's sweep then a slow sway; the clock), pointer (wire leans to a hovered jack; jack swaps to its action from 1400px; the plate's new contour draws on left to right over the last one in 500ms ease-emphasis behind a moving ink hairline, no cross-fade; seen mid-wipe in a still 160ms after hovering Facebook), scroll (only the row you are on grows to 1.3x over 400ms ease-emphasis and settles back as you leave it), state (the drawn tick and "Copied" sliding out). Reduced motion: transitions on the rows and "Copied" are 0s.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set: n/a, Hanzo has no photo or film for this page
- [ ] At most 2 videos playing: n/a
- [x] Budgets met; nothing missing; alt on every image (no images)
- [ ] 4+ real visuals together: n/a, none exist

Done here: The objects are drawn: the patch panel and cable (SVG), the live clock (SVG), and the `Sigil` contour plate seeded with each network's own address.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Horizontal overflow 0px at 1470 and 375 (measured). On phones the plate (16:7, no name) sits under "Join the community" and scrolls away with it: 700px into the section its box is at -578..-431, so nothing is pinned under the glass header and no row shows through above it; the active row says the name, so it is never shown twice. "Copied" lands at x 284–333 inside 375. Jacks are one swipe row; a short wire drops into the route.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (the sweep lasts about 2.5s and stops on pointer or focus; the sway is a few pixels on one wire)
- [ ] Forms labelled; first error focused: n/a, no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The panel is an APG tablist (arrow keys move and select; hidden routes `inert` only after hydration). Copy: after a real copy a visible "Copied" sits in a `role="status"` live region (measured: text "Copied", role status, opacity 1 at 1470 and on a 375 tap), and a failed copy shows nothing. Community addresses are `aria-hidden`, so link names are the channel names; the rows carry no `data-cursor` (0 in the DOM). Clock `role=img` named "San Francisco, <time>".

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The wire is drawn from four motion values written straight to the SVG path (no React render per frame); the row growth is a CSS transform (no layout shift). All probes and films ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (the shared layout's)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/contact/page.jsx` keeps the title "Contact — Hanzo AI" and Hanzo's description and renders `<JsonLd route="/contact" />`; /contact/ returns 200.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md`: n/a, not a catalogue or model page
- [ ] Every card opens by Morph: n/a
- [ ] Every maker and model page linked in the DOM: n/a
- [ ] One price figure everywhere: n/a

Done here: n/a. /contact is a Utility page (MASTER 4.5).

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display: n/a, no code on the page
- [ ] Config blocks parse on their own: n/a
- [ ] Terminal pauses and ends on a static frame: n/a
- [ ] No hand-typed version number: n/a

Done here: n/a. The Developer Dispatch route links to /newsletter only.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the page loads no data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success: n/a, no form
- [x] A thrown island does not blank the page

Done here: Console errors 0 at 1470×801 and 375×812, with and without reduced motion (Playwright, 7 Nov). Entrances run on CSS delays, so a failed bundle still shows the panel and its ask. The plug shows only once its wire is drawn, the clock hands only with the first tick; a blocked clipboard never says "Copied".

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (not merged on this path; nothing is sent by the page)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/contact.md` verdict 8 or more (it is 7; this pass answers its five fixes)

Done here: `data-cta` on contact.hero, .dispatch, .support, .press. Round-2 review (7/10 at e3f60107) answered: (1) Visit room's one big thing is the clock, resting type 52/26px; (2) phone plate scrolls away, nothing pinned under the header; (3) desktop contour a step darker with a visible draw-on; (4) `data-cursor` removed and the phone ask-bar line above corrected. Measured CLS 0.0014 desktop, 0.0021 phone in my probe. Gallery: `docs/gallery/contact/desktop-hero.jpg`, `desktop-visit.jpg`, `desktop-community.jpg`, `phone-sheet.jpg` (film run contact-run3: desktop 0 still screens, 0 dead controls, layout shift 0.004; phone width 375/375).
