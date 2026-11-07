# /blog coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/BlogIndex.jsx` (+ `BlogIndex.css`, `story.css`, `StoryClose.jsx`, `StoryPause.jsx`) · gallery: `docs/gallery/blog/` · metric id: post opens (`data-cta="blog.*"`). The post template is `docs/coverage/blog-family.md`.

Open copy questions for James: none decided.
Shared changes requested (`docs/requests/about.md`, shared by the Story pages): kit Band word blur; v2/Lines timing; the floating ask bar.
Forks this page deleted: the "Blog" kicker above the h1, "Every post" above "Contents", the tag above the cover headline and above each phone row; the red accent; the italic "&"; the curtain on hand-picked stories; the corner numerals and circle buttons on the on-site cards (they echoed /about's tiles); 18 of 24 archive rows on first view (behind "All 24"); the outlined second button in the masthead; the page's own dark close (now `StoryClose`).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; labels are Hanzo's own
- [x] One h1; clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions listed, none decided

Done here: "Read the latest" (solid, the newest post) in the masthead; the closing link "Every post" (hanzo.blog) in the Band; "hanzo.blog" and "Read the docs" are text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`
- [x] Every link through `A` or a real `<a>`; on-site cards are links with `data-morph` titles
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity links 29/29; the three on-site posts open into their pages by Morph; the archive links out to hanzo.blog as Hanzo's own index does.

## 3. First impression and page narrative
- [x] Sells in 5 s; moves within 1 s (h1 cut-in, the curtain lifting off the cover plate)
- [x] Page-owned masthead; nothing above the h1 ("Blog" runs into the lede)
- [x] JS off: `noscript` shows the masthead and the first cover story
- [x] One idea per 100svh
- [x] Ends in Band, footer
- [x] Morph on the on-site cards

Done here: the masthead (52px), the cover story with its plate (the one big thing) and the six-headline index all fit 1470×801; then the on-site posts, the contents (two latest months, then "All 24"), the Band.

## 4. Conversion system
- [x] Page-owned `v2s-btn` until kit `Cta`; no raw `.x-btn`
- [x] Sticky ask: the shared bar carries "Read the latest" (`data-thumb`)
- [x] n/a: no copy button
- [x] `data-cta` and `data-thumb` on the primary

Done here: `data-cta="blog.hero"` and `blog.band`.

## 5. Trust and proof
- [x] No logos, seals or invented numbers
- [x] Titles, dates and summaries are Hanzo's
- [x] n/a: no marquee (the cover has a pause control)
- [x] n/a: no form

Done here: every word and date from content/live/blog.json.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals
- [x] Measures held; the cover summary clamps to 3 lines visually (the full text is in the HTML and in the contents)
- [x] n/a: no tables, FAQ, tabs or code
- [x] `parity.py /blog`: 0 missing

Done here: parity 95/95 text, 29/29 links; the archive reads as a book's contents, a dotted leader to each date.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only; the curtain is the deck's silver gradient
- [x] No label above a headline (tag and date follow the cover headline; captions after "Contents")
- [x] Radii 20 on art cards and the plate
- [x] One arrow, one chevron
- [x] Differs from neighbours: a magazine cover (About: drawn frontier; History: running year)

Done here: headings rest at 26px, the h1 52px, the cover headline 32px; Hanzo's Kai art on the Kai cover stories is the only colour source.

## 8. UI component library
- [x] Hover, press (.97), focus-visible on every control
- [x] Focus ring 2px ink with white halo
- [x] n/a: no dialogs
- [x] n/a: no inputs
- [x] Forks deleted: listed above

Done here: index buttons `aria-pressed`; strip bars are buttons with spoken counts; empty months are not controls; "All 24" expands.

## 9. Motion and interaction
- [x] One signature, 2 supporting by script (variety OK), 0 fade-ups
- [x] Kinds: time (the cover turns), pointer (index hover cuts in under 250 ms; contour fields lean to the pointer), state (strip filter, All 24), scroll (bars rise, month pins), arrival (h1)
- [x] Something moves without input
- [x] Reduced motion final states; no `setInterval`
- [x] n/a: sound is the shared kit's

Done here: signature = the self-turning cover (silver curtain on the timer's turn only).

## 10. Media
- [x] kit `Img` for the Kai art; Sigil fields elsewhere
- [x] n/a: no films
- [x] Decorative art `aria-hidden`
- [x] No dimmed photo

Done here: Hanzo's Kai art on the two Kai cover stories; one contour field per post title, paused off screen.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass
- [x] No horizontal scroll at 320
- [x] 44px strip bars (the strip scrolls sideways), 44px links
- [x] Ask above the fold at 375×667

Done here: plate above the story, index as a swipe rail, month headers stick under the header and clear the first row; tags follow summaries on phone.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a, #525252 on white; white 78% in the Band
- [x] Pause control first in the cover's DOM (44px, `aria-pressed`, register name)
- [x] n/a: no forms
- [x] One h1; months are labelled sections
- [x] Keyboard: index, strip, All 24, pause

Done here: the carousel is `aria-roledescription="carousel"`, inactive stories `inert` and `aria-hidden`.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] The Kai art sized; Sigil canvases pause off screen
- [x] No poller
- [x] Nothing heavy run on James's laptop

Done here: the cover timer is a timeout per turn, the index line is CSS.

## 14. SEO and machine files
- [x] Title and description from content/pages.json
- [x] Canonical: shared metadata layer
- [x] `<JsonLd route="/blog" />` renders
- [x] Every card is a real link

Done here: all 24 posts and the six cover stories in server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a: Story page (the on-site cards open by Morph).

## 16. Developer experience
- [x] n/a: no code

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Empty months are gaps, not controls; filtering never empties the list
- [x] n/a: no live data
- [x] n/a: no submit
- [x] Reduced motion and JS off designed

Done here: reduced motion: no turning, no curtain, bars at rest; JS off: masthead and first cover story visible.

## 18. Measurement and handover
- [x] `data-cta` on primaries; no analytics wired yet
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file
- [x] n/a: no `docs/review/blog.md` yet (critic round 1: 6/10, every complaint fixed; re-review pending)

Done here: `V2: 6/10` from round 1; index under the fold, hover curtain, eyebrows, long contents and tap targets fixed.
