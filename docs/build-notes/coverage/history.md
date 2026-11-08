# /history coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/History.jsx` (+ `History.css`, `historyData.js`, `story.css`, `StoryClose.jsx`, `StoryPause.jsx`) · gallery: `docs/gallery/history/` · metric id: `contact_sales_submit` (`data-cta="history.*"`)

Open copy questions for James: none decided. Years beside customer figures appear only where Hanzo's own year copy has them. Question: the page says "1,600+ repositories" where other Hanzo copy says "1700+ repos" (kept as live).
Shared changes requested (`docs/build-notes/requests/about.md`, shared by the Story pages): kit Band word blur; v2/Lines timing; the floating ask bar.
Forks this page deleted: the page's own buttons and text links (now kit `Cta`); the drag cursor label; the metric printed twice on picture-less plates (now a Sigil); the year cut reused for "Your year" (now the year's plate); the phone swipe rail of years (stacked again); the clippings' outline (shadow only); the badge above the h1; kickers above headlines, the pill above each year title and the tag above each metric (now captions after them); the gold accent; the odometer digits and the split-flap board (no invented digits); three equal hero buttons; the separate dark FDE room and back-link section (now in `StoryClose`); raw `<img>`/`<video>` on the plates.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; labels are Hanzo's own (no `lib/cta.js` entry for /history yet)
- [x] One h1; clear in 5 seconds
- [x] No dead or self-looping button (the hero ask scrolls to the year-by-year scene)
- [x] Open copy questions listed, none decided

Done here: "Explore Our History" is a text link in the hero (it scrolls to the scene, so it is not the page's ask); the closing link "Talk to Hanzo FDE" is the page's one action (Story type), carried by `data-thumb` and `data-cta="history.band"`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`
- [x] Every link through `A`; clippings' press links keep `rel`
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 42/42; the 13-year rail jumps to any year; "Return to About Hanzo" morphs into /about.

## 3. First impression and page narrative
- [x] Sells in 5 s; moves within 1 s (the h1 cut-in and the year that runs by itself)
- [x] Page-owned hero; nothing above the h1
- [x] JS off: legible (`noscript` stacks the 13 years)
- [x] One idea per 100svh
- [x] Ends in proof (clippings above), Band, footer
- [x] Morph on "Return to About Hanzo"

Done here: h1 52px with lede and links under it; beside it the hero's one big thing, a 112px Air year running 2014→2026 while the four eras' bars fill; then the statement that lights word by word, the 13 years as plain rows under a jump rail (the pinned scene is gone, motion map 7 Nov), the clippings, Your year, principles, the FDE Band. The lede and links rise in after the h1's last line has landed (0.42 s), so the h1 is the first thing seen; JS off shows them at once.

## 4. Conversion system
- [x] kit `Cta` only; no raw `.x-btn`
- [ ] Sticky ask: on desktop the shared Ask carries the page's ask in the header after the hero; on phones "Talk to Hanzo FDE" is too long for the shared header, so it keeps "Try Hanzo" (outlined while a page ask shows, via `usePhoneAsk`); no ask bar on desktop by design (MASTER 3.3)
- [x] n/a: no copy button
- [x] `data-cta` and `data-thumb` on the primary

Done here: `data-cta="history.hero"` and `history.band`; `data-thumb` on the Band ask.

## 5. Trust and proof
- [x] No logo strip; no seal; no invented number
- [x] Every figure traces to Hanzo's year copy; each clipping keeps its press source
- [x] n/a: no marquee
- [x] n/a: no form

Done here: TechCrunch, Crunchbase News, Nasdaq, Startland News and hanzo.blog sources beside their clippings.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals
- [x] Measures held; headings `balance`
- [x] Disclosure: each year's remaining lines in an inline `<details>` (in the HTML; its (+) is named "Read more" from the register)
- [x] `parity.py /history`: 0 missing

Done here: parity 214/214 text, 42/42 links; one year on screen at a time, all 13 in the HTML.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only
- [x] No label above a headline (captions after: Track record, Full History, Your year, Operating Principles)
- [x] Radii 24 plates, 16 clippings; clippings are paper with one soft shadow (they are lifted objects you throw)
- [x] One arrow and one chevron; no icon boxes
- [x] Differs from neighbours: running year (About: frontier curve; Blog: cover)

Done here: headings rest at 26px, the h1 52px, big years in Air 220 (one per screen), principles and FDE numerals 64px Air.

## 8. UI component library
- [x] Hover, press (.97), focus-visible on every control
- [x] Focus ring 2px ink with white halo; white with black halo in the Band
- [x] n/a: no dialogs
- [x] Year input 64px text; −/+ buttons 56px
- [x] Forks deleted: listed above

Done here: rail buttons carry `aria-current`; the pause control is a 44px `aria-pressed` button named from the register ("Pause").

## 9. Motion and interaction
- [x] One signature, 2 supporting by script (variety OK), 0 fade-ups (round 3: the hero side's 1 s opacity fade is now a 12px rise with no fade)
- [x] Kinds: time (the running year), pointer (drag-throw clippings), state (Your year cut, rail jump), scroll (the scrub), arrival (h1)
- [x] Something moves without input; every control answers
- [x] Reduced motion final states; no `setInterval`
- [x] n/a: sound is the shared kit's

Done here: signature = word-light (the statement lights as it is read); the running hero year cuts in place (the old year leaves in 180 ms, the new one rises 100 ms later). The flick-proofing fix (review fix 4) no longer applies: the pinned scene it was for is gone, so nothing can blank under a hard flick. Entrances (domino, cover-slide, page-curl, explode-gather, split-merge) mark their sections with a `data-xhi-in` attribute, not a class, so a year turning current (React rewriting `className`) can never hide it again (8 Nov: that had left the years blank while scrolling). The domino tips 8° (3° on phones), so a column never swings into the year above.

## 10. Media
- [x] kit `Img` and `Film` for plates; sizes set
- [x] One film at most (2026, only while that year is on stage)
- [x] Alt: decorative plates `alt=""`, the year's figure stands in
- [x] No dimmed photo

Done here: 8 Nov: Hanzo's own customer logos are in `public/logos/customers/`, so each plate shows that year's logo in the plate's own ink (one tone, no hue) over the year's figure set large ($5.8M Raised, 120k ETH Raised, ...); years without a logo show the figure alone; dark and light plates alternate. The figure is no longer repeated in the text column (kept there for screen readers), and a badge that is the same words as the figure is said once, on the plate. The two photos (`/customers/kanoa/buds.webp`, `/customers/damon-motorcycles/reveal.webp`) are still not in `public/`, so those years fall back to their logo (request in `docs/build-notes/requests/history.md`); 2026 shows the Zen film.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass
- [x] No horizontal scroll at 320
- [x] 44px links (round 3: the hero links and "Explore the full Zen manifesto" were 21px; now 44px boxes); every hover has a tap path
- [x] Ask above the fold at 375×667

Done here: phone stacks the hero, swipes the clippings, and stacks the 13 years (as the brief asks), each short: title, badge, figure, first line, links, and the rest behind its (+).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a, #525252 on white; #a3a3a3 and white 78% in the Band
- [x] Pause control first in the hero object's DOM
- [x] n/a: no form submit (the year input is labelled)
- [x] One h1; years are `article`s; inactive years `inert`
- [x] Keyboard: rail, clippings (focus slides a card into view), year stepper, pause

Done here: the running year has a 44px pause (`aria-pressed`); reduced motion hides it and shows 2026.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Images and the film sized; the film loads only on its year
- [x] No poller
- [x] Nothing heavy run on James's laptop

Done here: the scrub sets state only when the year changes; transform and opacity only.

## 14. SEO and machine files
- [x] Title and description from content/pages.json (the doubled "— Hanzo AI — Hanzo AI" title is listed for James, untouched here)
- [x] Canonical: shared metadata layer
- [x] `<JsonLd route="/history" />` renders
- [x] Case-study and press links are real links

Done here: all 13 years in server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a: Story page.

## 16. Developer experience
- [x] n/a: no code

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Image failure shows the year's figure (a photo that is not there falls back to the year's logo; with neither, the figure plate, drawn from the first paint, never an empty box)
- [x] n/a: no live data
- [x] n/a: no submit
- [x] Reduced motion and JS off designed

Done here: with JS off a `noscript` rule stacks the 13 years; reduced motion holds 2026 in the hero. Your year out of range or empty: the last plate stays, dimmed under a gradient, and Hanzo's sentence ("Not written yet.", "Type a year.") takes the title's place.

## 18. Measurement and handover
- [x] `data-cta` on primaries; no analytics wired yet
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file
- [x] Review read: `docs/build-notes/review/history.md` (round 3, 7/10, 7 Nov); fixes applied 8 Nov

Done here: `docs/build-notes/review/history.md` round 3 (7/10): 1 hydration (the Your year input is `suppressHydrationWarning`; 0 console errors in clean loads at both sizes; footer part filed), 2 plates are real logos plus the figure, 3 Your year keeps the dimmed plate, 4 n/a (scene gone), 5 h1 first, 6 header label filed in `docs/build-notes/requests/history.md` (shared Ask), 7 deck tokens on `.xhi` (no scattered literals), hover inside `@media (hover:hover)`, the clipping counter under its figure, 8 this card. Copy: an offline copycheck against `content/live/history.json` reads missing 0 of 183 (hanzo.ai itself is not reachable from the cloud session).
