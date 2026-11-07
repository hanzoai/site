# /customers coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Customers.jsx` + `Customers.css` · route: `app/customers/page.jsx` · gallery: `docs/gallery/customers/` · metric id: `contact_sales_submit`

Open copy questions for James:
- (1) May the backer names and logos show? PLAN 1.3 #3 / MASTER part 5. They show as live shows them, as names only, with no tiles.
- (2) May "Case studies" stay as the caption under the plate? It is Hanzo's heading, moved below the plate.
- (3) There is no current proof (benchmarks, GitHub figures) on this page's copy to put above the 2015–2020 cases. Should any be linked in?
- (5) The index keeps Hanzo's own order: SKULLY first, as on hanzo.ai. An earlier build moved it after Triller; that change is reverted, so there is nothing to decide.
- (4) $8.4M and $7M+ sit on the plate beside the case year. Both come word for word from the case pages, with the year as the case copy prints it.

Shared changes requested (`docs/requests/customers.md`):
- Filed: the media mirror into `public/`, a hold cap inside the shared `openDoor` (wrapped page-locally here), and the header ask (shared chrome, unchanged).
- Also noted: a shared `BACKERS` module (lib, Data chat) and a register string for the em dash.

Forks this page deleted:
- The hand-rolled case tabs, now kit `Tabs`.
- The overprinting stage hand-off: it now runs exit then enter (`mode="wait"`).
- The pointer preview card, replaced by the stage.
- The seven backer tiles.
- The `data-morph` plate, now doorway.
- The springs.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`. Hanzo's own "Talk to us"; `lib/cta.js` does not exist yet.
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a: prices (none on this page).
- [x] Open copy questions for James listed, none decided

Done here: one ask, "Talk to us" (/contact), sits beside the lede at 1470×801 (x=820, y=425–473) and at 375×812 (y≈408). It appears again in the shared bar after the hero and in the close. The header's "Try Hanzo" turns to outline while it shows.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it. Both come from the layout.
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] n/a: breadcrumb (depth 1 page)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 10/10. Both case plates are real `<a href>` links to `/customers/damon-motorcycles` and `/customers/kanoa`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (the kit equivalent until it merges: MaskLines h1, lede, one ask); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer. The close is the page's own "Launch with us" band.
- [x] Card-to-page links open into their page. The doorway is used instead of Morph, which times out site-wide (reported by the conductor).

Done here:
- **Arrival order:** the h1 cuts in first, as the company MaskLines CSS at first paint (+0.5s). Then the lede and ask (CSS, 0.95s), then the plate (1.15s). Playwright saw the h1 visible at 1.34s, the lede at 1.46s and the plate at 1.72s.
- **First screen at 1470×801:** the figure block sits in the plate's upper half, so $8.4M is on screen at y 638–739.
- **The plate turn:** Damon to KANOA, then back to Damon, then it rests. Each case has its own tone: a graphite gradient, with a lighter Sigil on KANOA. The incoming text arrives at 0.25s, so the wipe edge reads.
- **Rhythm:** hero, plate, launch scene, a quiet names row, the black close.
- **JS off:** the MaskLines and page `<noscript>` rules stack both cases readably and set the phone figures in place. Playwright with JS disabled: both cases `position: relative`, clip-path none, text opacity 1, at 1470 (526–1131, 1131–1736px) and at 375 (465–928, 928–1391px; phones get a 4/5.4 box so the text no longer overlaps); the logo boxes and the static phone strip are hidden. CSS keyframe arrivals pause only while `html.x-arriving` is set. A Playwright run with JS disabled found 0 faint or offset text.

## 4. Conversion system
- [x] No raw `.x-btn`. The asks are one page-local pill; kit `Cta` has not merged.
- [x] Sticky ask in header and bar after the hero, same label
- [ ] n/a: copy button (none on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta="customers.hero"` and `customers.close`, both with `data-thumb="Talk to us"`. The hero is now its own section, so the shared bar takes over as soon as the hero ask leaves view. This closes the gap the review found.

## 5. Trust and proof
- [x] No seal; no invented number. Logo permission is an open question (above).
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees: none. The closing figure rows move only with scroll.
- [ ] n/a: Privacy link (no form on this page)

Done here:
- Figures come from the page copy, plus $8.4M and $7M+ from the case pages' own copy.
- Years appear only where the case copy prints them. Undated launches show an `aria-hidden` dash.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts. The case tabs are kit `Tabs`.
- [x] `python3 scripts/parity.py /customers`: 0 missing

Done here: parity text 72/72, links 10/10. The lede is 44ch and the row text 44ch. The "01"/"02" marks are gone.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes. Literal hex values are deck values only (#0a0a0a, #525252, #737373, #f5f5f5, #ededed, #262626, #000).
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow. The plate shadow was removed, and the stage and plate are flat fills.
- [x] One icon set (one arrow glyph); no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- `deck.css` is imported. The h1 is the deck's clamp(52px, 7vw, 84px) at 1.02. Headings are 497, and the hero and stage figures are Air 220.
- Container 1152, sections clamp(72px, 11vw, 188px), buttons 48px.
- Radii are deck values: plate 20 (art card), stage 24 (tile), pills full. These are literals in page CSS because `tokens.css` has not merged.
- The row sheet ends 12px short of the stage.
- One black room (the close). The plate is a card, not a room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a: nothing loads)
- [x] Focus ring visible on every stop of a Tab crawl. The ring is 2px ink with a white halo.
- [ ] n/a: dialogs (none)
- [ ] n/a: inputs (none); no bare `:hover`. All hovers sit in `@media (hover: hover)`.
- [x] Forks this page deleted: listed above

Done here:
- The year chips are `aria-pressed` buttons whose gliding pill now has size (111×48).
- The case tabs are kit `Tabs` (arrow keys, Home/End). Every page control presses at .97: the asks, the years, the wall and the plate arrow.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] n/a: sound (the shared kit has not merged)

Done here:
- **Signature:** the launch stage. As each row crosses the middle, or under the pointer, the outgoing figure leaves (150ms, rising 16px), then the incoming one arrives (300ms ease-emphasis). Playwright saw at most 1 layer at a time.
- Figures longer than 8 characters step down, and every figure stays on one line. Measured with a text Range at 1470: every stage figure is 1 line box; "120,000 ETH" is 51.45px and 282px wide with 22px to spare; "250,000" at 84px is 300px wide with 4px to spare.
- **Phone scene:** a slim sticky strip (64px) sits right under the year rail (rail 60–121px, strip 121–185px at 375×812) and carries the first figure and label of the row crossing the middle, swapping as the desktop stage does (out 150ms rising 16px, then in 300ms ease-emphasis, `AnimatePresence mode="wait"`). Playwright, scrolling 300px at a time through the index: $2.5M → 250,000 → $135K → 120,000 ETH → $500M → $650M → €150M → 169M → Cover Build → Myle Tap → Personas Social, with exactly one strip layer each time. Rows also still read in (name to ink, figures settle once). Under reduced motion the strip swaps with no movement.
- **Supporting:** the line-mask h1; the plate's turn (Damon, KANOA, back to Damon, rest), where the outgoing text fades in 0.15s before the edge crosses it; the closing figure rows sliding with scroll.
- **State:** the year filter closes the list up with a 300ms glide.
- **Kinds:** arrival, idle, pointer, state and scroll; scroll is 2 of 6. **Idle in the index:** the stage dot for the launch being read gives off a slow 1px ring (2.4s ease-in-out loop, off under reduced motion), so the mid-index screen is no longer still.
- **Film** (`film.mjs motion customers-run3`, before the dot): desktop layout shift 0.000, 1 still screen (the mid-index, now answered by the dot); phone 0.000, 0 still screens. The desktop "DEAD hover" lines (asks, years, tab) are the tool's headless Chromium reporting `(hover: hover)` false (puppeteer check). Playwright shows the ask going #0a0a0a → #262626 on hover. The phone's "DEAD tap" is a tap on the already-selected case tab.
- No springs. The kit `Tabs` pill is the kit's own.

## 10. Media
- [x] `Pic` (kit `Img` with a fallback) only; sizes set
- [ ] n/a: videos (none)
- [x] Alt on every image (covers carry their case alt, logos are decorative or named)
- [x] No dimmed or filtered photo. The plate uses only a gradient under its text. 4+ visuals together: n/a, the page has two covers.

Done here: covers and logos are referenced at Hanzo's /public paths. They are not mirrored into this repo's `public/` (MASTER part 10, a shared media task): dev pulls them from hanzo.ai by rewrite, and the static export would need the mirror. In this cloud box they are blocked, so the films show the Sigil fallback and the names.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- At 375 the ask's bottom is at y≈471.
- At 375 the year chips become a sticky rail under the header. It marks the year being read and scrolls to keep it in view.
- Row figures show inline on phones; the stage is desktop-only.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better: #525252 on white is 7.8:1, #737373 on white 4.7:1, white on #000.
- [x] Pause control on every moving item. The plate moves once and stops; the tabs stop it.
- [ ] n/a: forms
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here:
- Plate cases are `role=tabpanel`, labelled by the kit tabs; inactive ones are `inert`.
- Row figures stay in the accessibility tree on desktop (visually hidden), while the stage is `aria-hidden`.
- A year tap announces one line through a `role=status` count ("2018: 3 launches"), not the whole list.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Every image sized
- [x] No poller (one IntersectionObserver); no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: transform, opacity and clip-path only. The plate timer runs only while it is in view and after arrival.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical: from the layout (shared owner)
- [x] `<JsonLd route="/customers">` unchanged
- [x] Every card is a real link

Done here: metadata unchanged in `app/customers/page.jsx`. All rows, both cases and every figure are in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: model card (not a model page)
- [x] Every card opens into its page (doorway; Morph is broken site-wide)
- [ ] n/a: maker and model pages
- [ ] n/a: prices

Done here: the plate opens Damon and KANOA by the doorway. The ink grows from the plate's rectangle, and the case page lifts it (`useArrival` in Story.jsx). The hold is capped at 700ms: if the page hasn't lifted the ink by then, the page cuts to it.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. The page has no code, terminal or config.

## 17. States and resilience
- [x] Loading and error: a missing cover shows a Sigil plate, a missing logo shows its name. Empty and offline: n/a (static copy).
- [x] Blocked live data leaves a complete page, no console errors
- [ ] n/a: no submit
- [x] A thrown island does not blank the page (Sigil is only a fallback)

Done here: with hanzo.ai blocked (this box), the page is complete. The only console lines are the browser's "Failed to load resource" 404s for the remote covers and logos (request 1). There are no script or hydration errors at 1470×801 or 375×812, with or without reduced motion. A reduced-motion hydration mismatch in the plate's line (`useReducedMotion` read on the first client render) was fixed by switching to the hydration-safe `useCalm`.

## 18. Measurement and handover
- [x] `data-cta` on every primary. `lib/track.js` does not exist yet.
- [x] Nothing identifier-bearing; no payload
- [x] `V2: 8/10 …` in the page file's top comment
- [x] Review read: `docs/review/customers.md` re-run was 7/10. Its fixes are done:
  - the phone scene (a sticky figure strip that swaps one in, one out, plus rows reading in);
  - the stage hands off in sequence;
  - "120,000 ETH" is on one line;
  - the h1 leads;
  - $8.4M is above the fold;
  - each case has its own tone, and text arrives at 0.25s;
  - the sheet stops short of the stage;
  - press is .97;
  - radii are 20 and 24;
  - the doorway hold is capped;
  - Hanzo's order is kept;
  - `aria-live` is narrowed;
  - the card is corrected.

  The next review is pending.

Done here: verified by Playwright on the dev server: filter 11→3→11, pill 111×48, row sheet opacity 1, stage figures Bellabeat 250,000 → Unikrn 120,000 ETH → Palladium €150M as you scroll, no console errors.
