# /solutions/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/solutions/Solution.jsx` (+ `Solution.css`, `solData.js`; 18 members: 7 teams, 7 industries, 3 use cases, the reserved tier) · gallery: `docs/gallery/solutions/finance-*`, `reserved-*` (the other files there belong to the /solutions index) · metric id: `signup_start` (second ask `contact_sales_submit`)

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/solutions-family.md`): none filed. Noted for the shell owner: at the closing room the header's "Try Hanzo" can show solid beside the room's white button.
Forks this page deleted: the title-left / black-card-right hero and the pinned word-and-card chapters it shared with /oss/* and /products/* (now a full-bleed film under an 8/5 title row and a horizontal strip), the sibling contour rail with filled arrow discs (now a block of film stills), raw `<img>`/`<video>` (kit `Img` + `Film`), the per-member accent, coloured scrims, the eyebrow over the h1, chapter counters, the empty "More solutions" section on the reserved tier, the black zero box in the overlap finder, the standalone "What it runs on" and "Security and compliance" sections (now sheets), springs and object shadows.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; labels are Hanzo's own ("Try Hanzo", "Contact sales") (`lib/cta.js` does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions for James listed, none decided

Done here: "Try Hanzo" solid and magnetic with `data-thumb` (the header carries it after the hero), "Contact sales" a text link. The h1 (kit: arrives big, settles to 52) is the first thing read, above the film.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A`; every card a real link
- [x] n/a breadcrumb: Hanzo's solution pages carry none
- [x] Link parity: 0 removed

Done here: links finance 19/19, engineering 17/17, reserved 11/11, the /solutions index 20/20.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero from kit parts (`FamLines`); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh
- [x] Ends in the other teams, the overlap finder, the closing room, footer
- [x] Card-to-page links use Morph (title `data-morph` → the next page's h1)

Done here: an 8/5 title row (h1 left; lede, ask and caption right, aligned to the bottom), then Hanzo's film full-bleed under it, playing the jobs as stories (bar per job, the job's title rising) for one round, then settling. Then the jobs as a horizontal strip, then a slim row with the two sheets, the other teams, the close. Reserved: capacity, then the close carries "More solutions" with its link (no empty section). JS off: 0 hidden text blocks on finance and reserved.

## 4. Conversion system
- [x] Kit buttons only; no raw `.x-btn`
- [x] Sticky ask: the header carries the hero's label (`data-thumb`)
- [x] n/a copy button
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` = `solutions.hero`, `solutions.hero-second`, `solutions.band`, `solutions.band-second`. The closing room has one solid (white "Try Hanzo"); its second ask is a text link.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] n/a marquee
- [x] n/a submit

Done here: the only figures are the reserved tier's per-hour prices and the reel's "01 / 05" (both in Hanzo's live text). "Security and compliance" opens as a calm numbered list with Hanzo's two links.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; previews never cut mid-word (the sheet triggers show the section title whole)
- [x] Capacity table keeps its server markup (no kit `DataTable` yet); sheets use `FamDrawer`
- [x] Parity 0 missing

Done here: parity finance 50/50, engineering 43/43, reserved 50/50 text. Sizes rest at live hanzo.ai: h1 52, job heads 26, titles 21, lede 20, body 16; numerals 64 at weight 220.

## 7. Visual design system
- [x] `taste.py` passes; no literal hex in `Solution.css` (tokens only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii from tokens (art 20, objects 24); no shadows
- [x] Only the arrow icon
- [x] Differs from neighbours: full-bleed film under an 8/5 title row and a horizontal strip (oss and products: title left, black card right, pinned chapters)

Done here: colour appears only inside Hanzo's film and its stills.

## 8. UI component library
- [x] Hover (inside `@media (hover:hover)`), press, focus on every control
- [x] Focus ring visible on the ask, sheet triggers, strip, team cards, overlap pills and link
- [x] Sheets trap and return focus, Esc closes, and open above the header (measured: the sheet's header is the element at the top of the screen)
- [x] n/a inputs
- [x] Forks deleted: listed above

Done here: hover on every control is more than a hairline: the sheet pills fill and their plus turns, arrow links step 3px, the hero pause inverts, the band's light ask lifts, the overlap pills fill, the team cards' stills drift and press at .98.

## 9. Motion and interaction
- [x] One signature (the horizontal strip) + 3 supporting (film stories, magnetic ask, overlap pill); 0 fade-ups
- [x] Kinds: idle (film), time (one round of stories, then the sound kit's 'done'), pointer (magnetic ask, holding the story, stills drifting), state (pill glide, sheets); scroll is only the strip
- [x] Moves untouched; every control answers
- [x] Reduced motion: 0 running animations after 3.5 s; the strip becomes a plain swipe rail; no `setInterval`
- [x] Sound: `play('done')` when the stories finish their round; the kit plays the rest

Done here: no springs (300–400 ms ease-emphasis); `variety.py` OK.

## 10. Media
- [x] Kit `Img` + `Film` only; 1200×1500 with posters
- [x] At most 2 playing: the hero film and the one job in view
- [x] Nothing missing; images decorative with the words as real text
- [x] No dimmed photo; 6 sibling film stills together on desktop (JAMES.md 6)

Done here: no picture twice on a page: the strip and the band take only films the hero and the team cards below do not show; a job with no film left takes the solution's own Sigil on black. Arriving from a card, the hero keeps the clicked film. Five jobs, five pictures: each job's shot has its own framing (object position and scale on the still and on the playing film, measured 50%/1.06, 14% 22%/1.7, 86% 70%/1.5, 30% 88%/1.9, 78% 16%/1.6) and starts at its own moment of the film.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap from this page
- [x] No horizontal page scroll (scrollWidth 375)
- [x] Targets 44px; hover detail has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phones read title, lede, ask, caption, then the film; the strip is a native swipe of one job a screen width; the teams a swipe of stills. A sideways swipe elsewhere turns to the neighbouring solution (finance → financial-services, tested).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text from the deck ramp
- [x] Moving items stop off screen and under reduced motion; the stories hold under pointer and focus and end after one round
- [x] n/a forms
- [x] One h1; h2 per job and section; names start with visible text
- [x] Keyboard reaches every control

Done here: the film overlay and shots are `aria-hidden`; the jobs are real h2 headings in the strip.

## 13. Performance and engineering
- [x] h1 and the LCP still in server HTML
- [x] Every image and video sized
- [x] No poller; the story timer runs only in view and ends after one round
- [x] All rendering and filming ran in the cloud

Done here: transform, opacity and clip-path only; one contour canvas (behind the overlap finder).

## 14. SEO and machine files
- [x] Title and description unchanged
- [x] Canonical unchanged
- [x] `<JsonLd route>` unchanged
- [x] Every card is a real link

Done here: `solData.js` only adds each sibling's film slug.

## 15. Catalogue and product pages
- [x] n/a model card
- [x] Every team card opens by Morph (title → h1)
- [x] Hanzo's sibling links as up to 6 cards; the rest stay links ("All solutions")
- [x] One price figure everywhere (reserved only)

Done here: the overlap finder over this member's own contour; when two teams share nothing the black strip stays and reads 0 with its label.

## 16. Developer experience
- [x] n/a: no code on these pages
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a; "the quickstart" link stays inside "What it runs on".

## 17. States and resilience
- [x] Static data; a member without a film shows an empty black frame
- [x] No live data
- [x] n/a submit
- [x] Sheets degrade to inline content with JS off; the strip to a vertical list

Done here: members without security, capacity or siblings simply have no sheet, section or rail for them.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` does not exist yet)
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/build-notes/review/solutions-family.md` 6/10 at a4af13e; fixes in this commit

Done here: (7 Nov, 22:30) the sheet rises over the site header (no stacking context on the sheet row); a card's name travels to the h1's own box at 52px with its line breaks and the h1 skips its second cut-in, settled in about 0.8 s; the open lands on the destination film band, which is the film you clicked; no film shown twice on a page; overlap zero state; phone strip peeks 16%. Earlier: (1) five jobs, five pictures (own framing and moment each); (2) the sheets now open above the header (their triggers sit outside the pinned strip); (3) one page-owned solid at the close, hover on its buttons and the overlap controls; (4) no empty "More solutions" on the reserved tier (heading and link in the close); (5) triggers show the section title whole; (6) no zero box in the overlap; own hero medium and layout (full-bleed film, horizontal strip, film-still teams).
