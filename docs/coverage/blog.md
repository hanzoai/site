# Coverage: /blog (the index)

Page: `components/pages/BlogIndex.jsx` + `BlogIndex.css` + `story.css` (page-owned Story grammar). Signature: the cover turns itself (headline wipe, a brushed-silver curtain across the art plate, the plate changes behind it). The post template has its own file: `docs/coverage/blog-family.md`. One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = find the post worth reading now and open it. One solid ask, "Read the latest" (the newest post; `data-thumb`, `data-cta="blog.hero"`; the global ask bar carries it, named "Blog"); "hanzo.blog" is a text link. The kit Band closes with "Every post".
- **2.2 IA and navigation:** header and footer untouched. Three posts that live on this site open into their pages (Morph, `data-morph` on the title); the archive links out to hanzo.blog as Hanzo's own index does.
- **2.3 First impression and narrative:** screen one: "News & Guides." on one display line (cut into its line), the lede (with "Blog" run into it) and one ask beside it, the cover story with its plate, and the issue's six headlines: all of it fits 1470×801. Then the three on-site posts (art plate, title under it), the contents (the two latest months, then "All 24"), and the closing Band.
- **2.4 Conversion system:** masthead ask, ask bar, Band ask. No forms.
- **2.5 Trust and proof:** every title, date and summary is Hanzo's; figures inside summaries untouched.
- **2.6 Content presentation:** copy untouched (parity 95/95 text, 29/29 links). No eyebrow above any headline: "Blog" runs into the lede, "Every post" sits beside "Contents", the cover's tag and date follow its headline, and on phones each post's tag follows its summary. The archive reads as a book's contents, grouped by month, a dotted leader to each date; it opens at the two latest months (the rest in the HTML, hidden) and "All 24" or any month shows more, scrolling the contents into view.
- **2.7 Visual design system:** white page, ink, greys and silvers only (the red accent is gone; no italic "&"). Colour arrives only through Hanzo's Kai art on the Kai cover stories. The dark room is the closing Band. Radii 28 on the plate and cards.
- **2.8 UI component library:** kit `A`, `Img`, `StoryClose`; cover index buttons with `aria-pressed`; strip bars are buttons with `aria-pressed` and full spoken counts; empty months are not controls.
- **2.9 Motion and interaction:** signature = the cover turning (time, with the silver curtain; pauses on hover and focus). A hand on the index cuts straight to that story in under 250 ms, without the curtain. Supporting: contour fields drift and lean toward the pointer (idle, pointer); the strip's bars rise once (scroll) and filter on tap (state); the month pins while you read (scroll, CSS sticky). Scroll-linked motion is the minority. Variety: 2 techniques, 0 fade-ups.
- **2.10 Media:** Hanzo's Kai art via kit `Img` for the Kai posts; Sigil contour fields (one per title) elsewhere; fields pause off screen.
- **2.11 Mobile and responsive:** at 375 the masthead wraps to two lines, the plate sits above the story, the index is a swipe rail with snap, the strip scrolls sideways with 44px bars and "All 24" pinned, the month header sticks under the header and clears the first row. No sideways page scroll.
- **2.12 Accessibility:** one h1; carousel `aria-roledescription` with inactive stories `inert` and `aria-hidden`; month sections labelled; decorative art `aria-hidden`.
- **2.13 Performance:** transform, opacity and clip-path only; the cover timer is CSS; one Sigil per visible card; CLS 0 measured on the v2 build.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all six cover stories and all 24 posts in server HTML.
- **2.15 Catalogue and product pages:** the on-site posts open into their page (synchronized.studio pattern via Morph).
- **2.16 Developer experience:** not a developer page.
- **2.17 States and resilience:** reduced motion: no turning, no curtain, bars at rest; JavaScript off: a `noscript` rule shows the masthead and the first cover story; with no posts in a month the bar is a gap, not a control.
- **2.18 Measurement and handover:** `data-cta` on the masthead primary; no analytics wired yet (needs the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1; the closing Band is `StoryClose` (kit Band's room and markup, line cut instead of word blur); kit `Img` (no raw `<img>`, `<video>`, `<table>`). No shared `PageHero` or `Cta` exists yet, so the masthead and buttons are page-owned. ◐
3. Greys only; one filled primary per screen; `data-thumb`, `data-cta`. The header's "Try Hanzo" is solid in the hero (shared chrome). ◐
4. Parity 0 missing, links 0 unexpected, no new strings. ✔
5. Reduced motion final states; JS off legible; keyboard paths for the cover index and the strip. ✔
6. 375×812 and 1470×801 pass, no sideways scroll. Lighthouse not run (no CI yet). ◐
7. Contact sheet and film in `docs/gallery/blog/`. ✔
8. Ledger (deleted): the "Blog" kicker above the h1, "Every post" above "Contents", the tag above the cover headline and above each phone row; the red accent (plate lines, curtain, timer, strip, tags); the italic "&"; the curtain on hand-picked stories; the corner numerals and circle buttons on the on-site cards (they echoed /about's tiles); 18 of 24 archive rows on first view (now behind "All 24"); the outlined second button in the masthead. The close is `StoryClose` (the kit Band's room with a line cut instead of the kit's word blur).
