# /history coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/History.jsx` (+ `History.css`, `historyData.js`, `story.css`, `StoryClose.jsx`, `StoryPause.jsx`) · gallery: `docs/gallery/history/` · metric id: `contact_sales_submit` (`data-cta="history.*"`)

Open copy questions for James: none decided. Years beside customer figures appear only where Hanzo's own year copy has them.
Shared changes requested (`docs/requests/about.md`, shared by the Story pages): kit Band word blur; v2/Lines timing; the floating ask bar.
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

Done here: h1 52px with lede and links under it; beside it the hero's one big thing, a 112px Air year running 2014→2026 while the four eras' bars fill; then clippings, the pinned year scene, Your year, principles, the FDE Band.

## 4. Conversion system
- [x] kit `Cta` only; no raw `.x-btn`
- [x] Sticky ask: the shared bar carries "Talk to Hanzo FDE"
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
- [x] One signature, 2 supporting by script (variety OK), 0 fade-ups
- [x] Kinds: time (the running year), pointer (drag-throw clippings), state (Your year cut, rail jump), scroll (the scrub), arrival (h1)
- [x] Something moves without input; every control answers
- [x] Reduced motion final states; no `setInterval`
- [x] n/a: sound is the shared kit's

Done here: signature = the scrub; the old year leaves in 180 ms and the new one rises 100 ms later, so the stage is never blank at normal scroll speed and never shows two years at rest.

## 10. Media
- [x] kit `Img` and `Film` for plates; sizes set
- [x] One film at most (2026, only while that year is on stage)
- [x] Alt: decorative plates `alt=""`, the year's figure stands in
- [x] No dimmed photo

Done here: customer photos and logos from Hanzo's case studies; a year without a picture, or whose picture fails, gets a contour field seeded by its year (the figure is never printed twice).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass
- [x] No horizontal scroll at 320
- [x] 44px links; every hover has a tap path
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
- [x] Image failure shows the year's figure
- [x] n/a: no live data
- [x] n/a: no submit
- [x] Reduced motion and JS off designed

Done here: with JS off a `noscript` rule stacks the 13 years; reduced motion holds 2026 in the hero.

## 18. Measurement and handover
- [x] `data-cta` on primaries; no analytics wired yet
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file
- [ ] Review read: `docs/review/history.md` verdict 7/10, fixes pushed, re-review pending

Done here: `docs/review/history.md` (critic round 2: 7/10); all six fixes pushed.
