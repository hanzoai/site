# /solutions/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/solutions/Solution.jsx` (+ `Solution.css`, `solData.js`; 18 members: 7 teams, 7 industries, 3 use cases, the reserved tier) · gallery: `docs/gallery/solutions/finance-*`, `reserved-*` (the other files there belong to the /solutions index) · metric id: `signup_start` (second ask `contact_sales_submit`)

Open copy questions for James: none.
Shared changes requested (`docs/requests/solutions-family.md`): none filed. Noted for the shell owner: the site ask bar (components/Ask.jsx) still floats a pill over content on desktop and covers text on phones (MASTER 3.2 rule 6); this page only feeds it `data-thumb`.
Forks this page deleted: raw `<img>`/`<video>` (now kit `Img` + `Film`), the per-member accent hue, the coloured film scrims, the eyebrow over the h1, the chapter counters, three equal overlap boxes, the standalone "What it runs on" and "Security and compliance" sections (now sheets), the 120–210px numerals.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's own fold (`lib/cta.js` does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices (no plan on these pages)
- [x] Open copy questions for James listed, none decided

Done here: Persona (a team lead or buyer), Goal (what Hanzo does for this team, then what one account runs on), CTA "Try Hanzo" solid and magnetic with `data-thumb`, "Contact sales" outlined; metric `signup_start`. One h1 ("Hanzo for finance teams") at 52px; the first screen holds it, the lede, the ask and the playing film.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main` just before it
- [x] Every link through `A`; every card a real link
- [x] n/a breadcrumb: Hanzo's solution pages carry none and the header names the page
- [x] Link parity: 0 removed, 0 unexpected

Done here: links 19/19 (finance), 17/17 (engineering), 11/11 (reserved), and the /solutions index 20/20. Product rows (in the sheet) and sibling cards are `<a href>`; the overlap pills are buttons.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from kit parts (`FamLines`, `FamStage`); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in sibling cards, the closing room, footer
- [x] Card-to-page links use Morph (title `data-morph` → the next page's h1 `data-morph-target`)

Done here: the film plays and its stories start (bar filling, job title rising) within the first second at 1470×801 and 375×812. Order: hero → five pinned job chapters → (reserved: capacity) → more teams with the overlap finder → closing room. "Solutions · Teams" sits as a caption under the ask. JS off: 0 hidden text blocks (sheets show in place).

## 4. Conversion system
- [x] Kit buttons only (`v2f-btn`); no raw `.x-btn`
- [x] Sticky ask: the header's "Try Hanzo" and the site ask bar carry the hero's label after the hero (`data-thumb`)
- [x] n/a copy button: no code here
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` = `solutions.hero`, `solutions.hero-second`, `solutions.band`, `solutions.band-second`; the closing room is `data-ask-hide` so the bar steps aside there. One solid per screen (the closing room's white button is the only solid there).

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] n/a marquee
- [x] n/a submit

Done here: the only figures are Hanzo's: the reserved tier's per-hour prices (from the live capacity table) and the reel's "01 / 05" counter, which is in Hanzo's live text. "Security and compliance" opens as a calm list of proof with Hanzo's two links.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held (lede 34–44ch, body 68ch); headings balanced
- [x] Tables: the reserved capacity table keeps its server markup (no kit `DataTable` yet); sheets use `FamDrawer`
- [x] `python3 scripts/parity.py`: 0 missing

Done here: parity finance 50/50, engineering 43/43, reserved 50/50, content-creation 39/39 text. Sizes rest at live hanzo.ai: h1 52, chapter heads 26, sheet titles 21, lede 20, body 16, captions 12–13; figures 44–64 at weight 220.

## 7. Visual design system
- [x] `taste.py` passes; no literal hex in page CSS (all `var(--…)` tokens)
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes from tokens; outlined or raised, never both (no shadows on the film or shots)
- [x] No icons beyond the arrow; none in a box
- [x] Differs from neighbours: the hero medium is the solution's own film (blockchain: a key card; integrations: an editor)

Done here: `python3 scripts/taste.py Solution.jsx Solution.css` OK; literal hex in `Solution.css` replaced by `--ink`, `--hz-*`, `--card` tokens. The only colour is the film's own (Hanzo media).

## 8. UI component library
- [x] Controls have hover (inside `@media (hover:hover)`), press (scale .98), focus-visible (global ring)
- [x] Focus ring visible on the ask, pills, sheet triggers, rows and cards
- [x] Sheets trap and return focus (FamDrawer; Esc closes, focus back on the trigger, tested)
- [x] n/a inputs
- [x] Forks deleted: listed above

Done here: overlap pills are 44px with `aria-pressed`; sheet triggers carry their name from the UI register and preview Hanzo's own words; no `title=`.

## 9. Motion and interaction
- [x] One signature (the jobs as pinned chapters), 3 supporting (stories on the film, magnetic ask, overlap pill), 0 fade-ups
- [x] Kinds: idle (film), time (stories every 5.2 s), pointer (magnetic ask, hover holds the stories, drag rail), state (pill glide 300 ms, sheets rise); scroll (stage settle, chapters) is under half
- [x] Something moves untouched; every control answers
- [x] Reduced motion: 0 running animations after 3.5 s (measured); stories hold on the first job
- [x] n/a sound (the shared kit is not merged)

Done here: no springs (300 ms ease-emphasis on the pill), story changes 400 ms; `variety.py` OK; at most one clip plays per screen (measured: 1 at the last chapter on desktop, 1 at each of the first three shots on a phone).

## 10. Media
- [x] Kit `Img` + `Film` only; sizes (1200×1500) and posters set
- [x] At most 2 playing (measured 1); the hero film loops are held by pointer and stop off screen
- [x] Nothing missing; images are decorative (`aria-hidden` objects with the words as real text)
- [x] No dimmed or filtered photo (dark gradient under text only)

Done here: the film is Hanzo's own model media for the solution; each job's shot is the same film re-framed and its clip mounts only for the job in view.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap from this page
- [x] No horizontal scroll (scrollWidth 375)
- [x] Targets 44px; hover detail has a tap path (cards show the sibling's first job without hover)
- [x] Primary ask above the fold at 375×667

Done here: phone order h1, lede, the two asks, caption, the film; chapters stack and each shot plays as it crosses the middle; a sideways swipe turns to the neighbouring solution (finance → financial-services / engineering, tested).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text contrast from the deck ramp (ink #0a0a0a and muted #525252 on white)
- [x] Moving items: the film stops off screen and under reduced motion; stories hold under pointer and focus
- [x] n/a forms
- [x] One h1; h2 per chapter and section; sheet h2; names start with visible text
- [x] Keyboard reaches every control; focus in a pinned chapter scrolls to it

Done here: chapter marks named from the register ("Chapter 2 of 5"); the film and stories are `aria-hidden` because the chapters hold the same words as headings.

## 13. Performance and engineering
- [x] h1 and the LCP still (kit `Img priority`) in server HTML
- [x] Every image and video sized; one clip per screen
- [x] No poller; the story timer runs only in view and when not held
- [x] All rendering and filming ran in the cloud

Done here: transform, opacity and clip-path only; one member contour canvas plus at most 6 still sibling contours.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical: unchanged from the shell
- [x] `<JsonLd route>` unchanged
- [x] Every card is a real link

Done here: `app/solutions/[slug]/page.jsx` unchanged in this round; all words in the server HTML.

## 15. Catalogue and product pages
- [x] n/a model card (not a model page)
- [x] Every sibling card opens by Morph (title → next page's h1)
- [x] Every sibling Hanzo links is a card (at most 6), the rest stay as links ("All solutions")
- [x] One price figure everywhere (reserved only)

Done here: "More teams / industries / use cases" as up to 6 cards that drag with inertia on a mouse, each with its own still contour and its first job as preview; the overlap finder over this member's own contour.

## 16. Developer experience
- [x] n/a: no code on these pages
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a; "the quickstart" link stays inside "What it runs on".

## 17. States and resilience
- [x] Static data: no loading or error state; a member without a film shows an empty black frame
- [x] No live data
- [x] n/a submit
- [x] Sheets degrade to inline content with JS off

Done here: members without security or capacity simply have no sheet or section for them; the overlap finder only appears where Hanzo links siblings.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` does not exist yet)
- [x] Nothing identifier-bearing; no field values
- [x] `V2:` line in the page file's top comment
- [x] Review read: `condrev/solutions.md` 7/10 at 9cffbc7; fixes 1–3 done in a4af13e, the MASTER pass in this commit

Done here: fixes against the review: (1) "What it runs on" and "Security and compliance" are sheets from the last job; (2) every `<video>` is the kit `Film` (`x-media`); (3) each job's film plays in view on phones. MASTER pass: sizes at rest (no 96–210px type), no springs, no shadows on objects, tokens only.
