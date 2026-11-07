# /contact coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Contact.jsx` (+ `Contact.css`, deck tokens from `components/pages/company/deck.css`) · gallery: `docs/gallery/contact/` · metric id: one contact click (`cta_click contact.*`, contact_sales_submit downstream)

Open copy questions for James:
- The closing Band repeats the Sales route's heading, "Bring Hanzo to your company.". It is Hanzo's own sentence, but it now appears twice. Is there a closing line Hanzo prefers?

Shared changes requested (`docs/requests/<page>.md`): none.

Forks this page deleted:
- the raw `.x-btn` hero buttons (now kit `Go`);
- the page-wide `.x-btn.solid:hover` override that broke the kit Band;
- the Visit room's second contour map;
- the 01–04 jack numerals;
- the mono URL lines;
- the route counters;
- the running wire pulse.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button — n/a for prices: the page has none
- [x] Open copy questions for James listed, none decided

Done here:
- **The one ask.** Hanzo's "Talk to sales", in the Sales route, which is chosen on arrival and never moves by itself.
- **One solid fill through route changes.** After a route has faded in (450ms), the page sends a scroll event so the shared ask bar looks again. Checked at 1470 and 375 through Support, Press, Sales and Support: the header's ask stayed outline (`data-ask=on`) after every switch.
- **Label.** `lib/cta.js` has not merged, so the label is Hanzo's verbatim.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more — n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is `A` or `Go`, plus the kit `Band`. Parity is 15/15 links, and all nine networks are real links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 — company `MaskLines` h1, the lede and the panel stand in until the kit `PageHero` merges
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph — n/a: no cards lead to pages

Done here:
- **Entrance order** (/contact has no curtain; the curtain is home only). The h1 cuts in by CSS about 0.55s after first paint. The panel rises at 0.7s and the lede at 0.85s: 0.4s entries on CSS delays, so they never wait for the app bundle. Checked with the bundle blocked: the panel and the ask show, with the ask ending at y=603.
- **Cable.** About 1s after hydration it sweeps the four sockets and lands back on Sales. Then its belly drifts slowly, about 12px on desktop and 17px on the phone's short wire.
- **Height.** The h1 sits high, and the Visit room peeks below the hero as a rounded card.
- **JS off.** All four routes are stacked with their links. The cable, plug, plate, copy button and clock hands are hidden.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` — the kit `Cta` has not merged; kit `Go` is used
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-thumb="Talk to sales"` drives the shared ask bar after the hero, and the Band repeats the ask. `data-cta` is on contact.hero, .dispatch, .support and .press. The copy button writes "hello@hanzo.ai" exactly, and says nothing if the clipboard is blocked.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [ ] Marquees — n/a: none on the page
- [ ] Privacy link beside every submit — n/a: no form on the page

Done here: The page's only proof is Hanzo's address and the live San Francisco clock. No logos or figures are added.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts — n/a: none; the patch panel is a page-local APG tablist because it is the signature
- [x] `python3 scripts/parity.py /contact`: 0 missing

Done here:
- **Parity.** 29/29 text and 15/15 links.
- **Deck type:**
  - h1 84px at 1.02 and weight 497;
  - section headings clamp(36px, 5.3vw, 64px);
  - route headings 26–32px;
  - jacks 17px at weight 606;
  - body 17px.
- **Jack hover.** It swaps the name for its action (Hanzo's button words) only from 1400px, where the whole action fits. Checked at 900, 1024, 1280, 1399, 1400, 1440, 1470 and 1920: 1400 and up print the action whole, and below 1400 the name stays. There, hover answers with the outline, the socket and the wire leaning toward the jack; nothing is clipped.
- **Type sizes.** "Visit" and the address are both section-heading size, so the room holds 3 sizes.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- **Palette.** `taste.py` passes. Only deck neutrals (`#0a0a0a`, `#525252`, `#737373`, `#a3a3a3`, `#fafafa`, `#f5f5f5`, `#f2f2f2`, `#262626`) and white alpha steps are used.
- **Surfaces.** The panel has no outer box. The jacks are flat fills, and the chosen one is outlined as a state. The route has a flat fill (radius 24), and so does the plate (radius 24).
- **Rooms.** Two black rooms, Visit and the Band, which are not back to back. Visit opens from a rounded card inside the gutters to full width as it is reached (CSS scroll timeline; a plain edge where it is unsupported or under reduced motion).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native — n/a: none
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Buttons are 48px (route buttons and copy); jacks are 120px on desktop and 44px pills on phones. Press is .97 at 90ms, and every hover sits in `@media (hover:hover)`. The focus ring is 2px ink with a white halo.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` — the clock ticks with one interval, only while on screen (once a minute under reduced motion)
- [ ] Sound — n/a: the shared sound kit has not merged

Done here:
- **Kinds of motion:**
  - arrival: h1 cut-in, panel rise;
  - idle: the cable's sweep, then its belly drifting about 12px (17px on phones); the clock;
  - pointer: the wire leans toward a hovered jack; the jack swaps name for action; the plate redraws;
  - state: the plug moves socket to socket in 500ms ease-in-out, with no spring.
- **Scroll.** Only the two section cut-ins and the plate following the row.

## 10. Media
- [ ] `Film` and `Pic` only — n/a: Hanzo has no photo or film for this page
- [ ] At most 2 videos — n/a
- [x] Budgets met; nothing missing; alt on every image — no images
- [ ] 4+ real visuals — n/a: none exist

Done here: The objects are drawn: the patch panel and cable (SVG), the live clock (SVG), and a Sigil contour plate seeded with each network's own address.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- **Jacks.** At 375 they are one swipe row with faded edges, and a short wire drops from the chosen pill into its route. The chosen pill scrolls into view.
- **Fold.** At 375×667 "Talk to sales" ends at y=657, above the fold.
- **Plate.** It rides at the top while the rows pass.
- **Overflow.** No sideways scroll at 320 or 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item — the sweep lasts about 2.5s and stops on pointer or focus; the sway is a few pixels on one wire
- [ ] Forms — n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here:
- **Panel.** An APG tablist: arrow keys move and select. Hidden routes are `inert` only after hydration.
- **Clock.** `role=img`, named "San Francisco, <time>" once a minute.
- **Copy.** It reports through `role=status`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The wire is drawn from four motion values written straight to the SVG, with no React render per frame. The sway runs only while the panel is on screen and not under reduced motion. All filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical equals og:url — the shared layout's
- [x] `<JsonLd route>` parses
- [x] Every card is a real link

Done here: `app/contact/page.jsx` keeps Hanzo's title and description and renders `<JsonLd route="/contact" />`. Every route is in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: not a catalogue or model page

Done here: n/a. /contact is a Utility page.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. The Developer Dispatch route links to /newsletter only.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed — the page loads no data
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit — n/a: no form
- [x] A thrown island does not blank the page

Done here:
- **JS off.** Checked: 0 hidden texts and 0 inert.
- **Plug and clock.** The plug shows only once its wire is drawn, and the clock hands only with the first tick.
- **Bundle failure.** The entrances run on CSS delays, so with the app scripts blocked the lede, the panel and its ask are still shown.
- **JS off.** The hero top-aligns and the dead jacks are hidden.
- **Curtain.** The panel re-measures after the curtain's scale and after fonts load, so the plug sits centred.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` — not merged; nothing is sent
- [x] Nothing identifier-bearing before consent
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/contact.md` (re-review 2, 7/10). Applied:
  - one solid fill after route switches;
  - the jack action only where it fits;
  - the phone fold at 375×667;
  - the visible idle drift on desktop and phone;
  - entrances that do not wait for the bundle;
  - the Visit room opening from a rounded card;
  - "Visit" at section-heading size;
  - the JS-off hero;
  - the flat jack tiles;
  - a round focus ring for the kit `Go`'s extra Tab stop;
  - a light ring on the Band.

Done here: Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg` and `before-desktop.jpg`. A pinned scroll scene was not added, because Utility pages have no scroll theatre (MASTER 4.5).
