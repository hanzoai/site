# /research coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Research.jsx` (+ `Research.css`) · gallery: `docs/gallery/research/` · metric id: `research.hero` / `research.reader` (cta_click to papers.hanzo.ai or hips.hanzo.ai), `research.close` (GitHub)

Open copy questions for James: none (no copy changed; "Research" is Hanzo's label, set as a caption under the h1; "When it was published", "Previous paper", "Next paper", "Pause" are control and chart labels).
Shared changes requested (`docs/requests/research.md`): none.
Forks this page deleted: the floating AskBar pill, the staged right-hand deck and its scroll runway, the desk's scroll drift, the gliding kinds pill, every spring (row thumbs, title page, pills), every hover lift and slide.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport ("Explore papers.hanzo.ai ↗"; in the reader "Read on papers.hanzo.ai ↗"; in the dark room "github.com/hanzoai")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: Story page for researchers and engineers; metric `research.hero`/`research.reader` (a papers or HIPs click) and `research.close` (GitHub). "Specifications (HIPs) ↗" and "Benchmarks" are text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A` or `More`; every row has a real link to its paper (↗) beside the button that opens it
- [x] n/a: depth 1, no breadcrumb
- [x] Link parity: 34/34, 0 removed

Done here: Parity shows 34/34 links; each of the 31 rows keeps its paper or HIP link.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (a desk sheet lifts at 900 ms)
- [x] Hero: the desk of six title pages is the one big thing; h1 52px by line mask; nothing above it ("Research" is a caption under it)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per screen: desk, 19 (the moment), the index, the statement
- [x] The dark room's link (github.com/hanzoai) now comes second, with the statement; the page ends on the index, then the footer
- [x] Sheets and rows open into the paper's full title page (shared element, 600 ms in-out); Back/Esc closes

Done here: First screen at 1470×801: the headline, lede and one ask on clean paper at the left (5 of 13 columns), the desk of six title pages to the right (no sheet touches the text), a one-line caption under the desk; JS off measured 0 of 149 blocks hidden at 1470 and 375.

## 4. Conversion system
- [x] Kit ask (`.pf-btn.solid`) only; no raw `.x-btn`
- [x] Sticky ask: the header's ask and the site bar read `data-thumb`; no page-level floating bar
- [x] n/a: no copy button
- [x] `data-cta="research.hero"` + `data-thumb` on the primary; `research.reader`, `research.close` on the others

Done here: The page's floating AskBar was removed (MASTER §3.2 rule 6); one solid fill per screen.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] 19, 6 and 5 are counts of Hanzo's own list (specifications exclude the "All HIPs" index row)
- [x] n/a: no marquee
- [x] n/a: no form

Done here: Every paper links to its page on papers.hanzo.ai and every HIP to hips.hanzo.ai; the month bars are counts of Hanzo's dates, nothing more.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals (the desk sheets are decorative, `aria-hidden`)
- [x] Headings 12–18ch, lede ≤ 44ch, body ≤ 66ch
- [x] The library is a filtered list, not a table; n/a: no FAQ, tabs or code
- [x] `python3 scripts/parity.py /research`: 91/91 text, 34/34 links

Done here: ProofRhythm sizes (h1 52, headings 26, row titles 17, lede 20, body 15–16); the six hero captions are all in the HTML, the current one shown.

## 7. Visual design system
- [x] `taste.py` passes (also main's stricter 0.03 chroma)
- [x] No label above a headline
- [x] Desk sheets outlined at rest, shadowed only while lifted; row thumbs outlined; only the title page floats
- [x] n/a: arrows only
- [x] Differs from neighbours: a full-width desk of paper under a lower-left headline

Done here: Ink only (#0a0a0a, #525252, #737373, #d4d4d4, #f5f5f5, #fafafa); the dark room enters as a rounded card and opens to full width (SceneWipe).

## 8. UI component library
- [x] Every control has hover (inside `@media (hover: hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring on every stop (sheets, rows, ↗ links, kinds, bars, deal controls)
- [x] The title page moves focus to Close, Esc closes, focus returns to the sheet or row
- [x] Search field 16px, labelled
- [x] Forks deleted: listed above

Done here: Hovers fill (rows from the left, 400 ms; kinds; bars; ↗) and the row's sheet tilts 2°; no lift, slide or scale on hover.

## 9. Motion and interaction
- [x] Signature `word-light` (MOTION-MAP), on the second screen; supporting: the desk and the open (600 ms in-out), a line-mask cut-in on the h1 and the figures only; 0 fade-ups
- [x] Kinds: idle (desk lift), pointer (fills, tilt), state (open, re-flow), scroll (the statement lighting, dark room) under half
- [x] The desk moves without input; every control answers
- [x] Reduced motion: the desk holds still, the statement shows in full; no `setInterval`
- [x] n/a: sound is a shared kit, not wired here

Done here: Signature: words light up. The open-source statement moved from the page's end to the second screen, in the dark room straight after the desk: its 45 words wait at white 22% and each brightens on its own stretch of the scroll (about two words wide), so a reading head travels the sentence from the moment it enters (statement top at 88% of the viewport) until it sits mid-screen; scrolling back dims them again; the link and its comma light as one word. The "Open source" heading no longer cuts in. Supporting: the desk (pointing at a sheet lifts it, pressing opens it into its title page, 600 ms), line-mask cut-ins on the h1 and the figures, the month in the rail following your reading. The hero's captions now share one cell (hidden ones keep their place), so the walk moves nothing on phones (CLS while scrolling 0 at 375 and 320, was 0.027 and 0.046; 0.0009 at 1470). Deck timings only, no springs; `variety.py` OK. Reduced motion: the final state with no hydration mismatch (the reveal and the cut-ins apply the setting after hydration; checked: 0 console errors at 375 and 1470 with reduced motion).

## 10. Media
- [x] n/a: no Hanzo photo or film on the live page; the objects are typeset title pages
- [x] n/a: no video
- [x] n/a: no image
- [x] n/a: no photo

Done here: Title pages are drawn in HTML (date, title, subtitle, rule, text lines), so nothing loads or shifts.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll (phone.mjs 375/375)
- [x] Every target 44px or more; sheets and rows open on tap
- [x] Primary ask above the fold at 375

Done here: Phone desk is three fanned sheets (one large in front) 16px under the header, the headline below it; the caption takes the full width with pause and arrows on their own row; the ask ends at y 633 at 375×667; the index opens on the six newest papers ("Show all 19"); the list keeps a 60svh minimum so a filter never collapses the page.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text #0a0a0a / #525252 on white and #f5f5f5; #fafafa on black
- [x] Pause control (LivePause, 44px, `aria-pressed`) first in the desk's controls
- [x] Search labelled; n/a: no form submit
- [x] One h1; h2 per section
- [x] Keyboard reaches every sheet, row, link, kind, bar and control

Done here: The desk cycle pauses from its own control and stops when a visitor points at a sheet; `aria-live` speaks captions only after the visitor takes over.

## 13. Performance and engineering
- [x] h1 and the desk in server HTML
- [x] No images or video
- [x] No poller; the desk timer stops off screen
- [x] Filming and checks run in the cloud

Done here: Motion is transform, opacity and clip-path; the scroll-linked effects are the statement lighting word by word (the signature) and the dark room's opening.

## 14. SEO and machine files
- [x] Title and description unchanged (`app/research/page.jsx`)
- [x] Canonical untouched (shared)
- [x] `<JsonLd route="/research" />` renders
- [x] Every row links to its paper

Done here: All 31 entries and 34 links are in the server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a model page
- [x] Rows and desk sheets open into their title page (shared element)
- [x] n/a: papers live on papers.hanzo.ai
- [x] n/a: no prices

Done here: The library acts as the catalogue: kinds, search and the month filter (Beyond), each item opening its title page.

## 16. Developer experience
- [x] n/a: no code on the page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a: the HIPs are listed and linked, no code blocks.

## 17. States and resilience
- [x] Empty state: "Nothing in the library by that name." with Clear; the month chip removes itself
- [x] No live data
- [x] n/a: no form
- [x] JS off: a `<noscript>` rule lists all six captions and shows the statement in full

Done here: JS off measured 0 hidden text blocks at 1470 and 375; nothing on the page fetches.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`research.hero`, `research.reader`, `research.close`); n/a: `lib/track.js` wiring is shared
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/research.md` (7/10 on the walk before these fixes; its five points are addressed in this build)

Done here: Filmed with `scripts/motion.mjs` (desktop) and `scripts/shot.mjs` (phone); gallery `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
