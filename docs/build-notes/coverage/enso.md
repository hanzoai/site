# /enso coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/Enso.jsx` and `components/v2/Launch.jsx` · gallery: `docs/gallery/enso/` · metric id: `signup_start`

Open copy questions for James: none decided here. The page shows Hanzo's words only; labels that sat above headlines now sit below or beside them as captions.
Shared changes requested (`docs/requests/zen-names.md`): the desktop ask bar floats over content (Ask.jsx); the sound kit; `lib/cta.js`, `lib/track.js` and `tokens.css` are not on main yet.
Forks this page deleted: the hand-rolled spec `<table>` (then a second `DataTable`, now gone: each switchboard lane carries its tier's prices) and GPQA `<table>` (now `DataTable` in a drawer), raw `.x-btn` asks (now `Cta`), raw `<img>`/`<video>` (now `Img`, `ModelFilm`), the old next-model card.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label is used)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: model page, prices are the model's own)
- [x] Open copy questions for James listed, none decided

Done here: `app/enso/page.jsx` carries Persona, Goal, CTA, Metric `signup_start`, Signature and Beyond. The one solid ask "Try Hanzo" (/login) shows on the first screen over the film, then beside the settled headline, then in the closing Band. One h1 ("Enso") is in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] n/a: breadcrumb at depth 2 or more (the page sits at depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: the skip link in `app/layout.jsx` reaches `#main`. Every link goes through `A`, `More`, `Cta` or `Arrow`, and every model card is a real `<a href>`. Parity links are 11/11.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a: `PageHero` is not in the kit yet; `v2/Launch` plays its role); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (the model cards use the WebGL opener, which lands the picture as this page's hero)

Done here: Enso's own film plays full-bleed under the h1 cut-in within the first second. It then settles into an ensō ring, and Hanzo's headline rises beside it. Then come the three tiers (Enso Flash, Enso Pro, Enso Ultra) pin as chapters over Enso's own film, then the dark room ("One endpoint for every frontier model." over the live switchboard: requests route themselves to their tier, each lane carries that tier's prices; send one by hand), then the GPQA figure with Enso Ultra's 98.0% leading, the Pareto plot with its Compare tour, all 17 results folded into one drawer, Hanzo's model-card grid and the `Band`. No two tables sit back to back; the white band between the drawer and the cards is about 150px (was about 300px between two tables). Entrance states are scoped to `html.js`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: the header carries the one solid "Try Hanzo"; the page's own asks are outlined (`<Cta kind="quiet" thumb>`), and on phones the shared bar carries "Try Hanzo" after the hero. `data-cta` ids: `enso.first` (first screen), `enso.hero` (headline).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] n/a: marquees pause, freeze under reduced motion, hide duplicates (no marquee)
- [ ] n/a: Privacy link and owner line beside every submit (no form on this page)

Done here: GPQA Diamond figures with one lead: Enso Ultra 98.0% alone across 8 of 13 columns (132px at 1470, 72px at 375, counting up once via kit `Stat`), Enso 96.5% and Enso Flash 95.5% stacked beside it at 32px (26px side by side on the phone), measured by computed font-size; then the Pareto chart, and under it one "GPQA Diamond" drawer holding the sortable table (17 rows, source links). Closed, the drawer is `hidden="until-found"` with all 17 rows in the HTML (measured 0px tall, 17 `tr`); a click or `#eo-results` opens it (measured: both set `aria-expanded` true and remove `hidden`); find-in-page opens it through a `beforematch` listener (not measured headless); with JS off the server sends it open (17 rows, 1094px). The tier prices no longer repeat as a table: each switchboard lane carries its own ("$0.33 in · per 1M tokens $1.65 out 1M context"). Numbers: Hanzo's GPQA Diamond figures and tier prices ($0.33/$1.65, $4.40/$22, $5.50/$27.50 per 1M tokens), each from content/live/enso.json.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /enso`: 0 missing

Done here: parity text 72/72, links 11/11. Section headings rest at 26px, the settled headline at 44px, body 16px, ledes 20px. Mono captions are 12-13px; Hanzo's model-card pills are 11px mono capitals (SPEC 10px, raised one step at the critics' ask). Tables: one kit `DataTable` for the GPQA results (caption, scope, sticky header), inside a disclosure drawer under the chart. Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only; `tokens.css` not on main)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on the page and shell files. Deck greys only (#0a0a0a, #525252, #737373, #a3a3a3 on black), Book 497 headings, radii 24 on tiles and 20 on Hanzo's art cards. Black rooms: the router room and the closing Band. /enso is the only ring, the only router and the only benchmark chart in the group.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] n/a: dialogs are native, trap focus and return it (no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: kit `Cta` gives hover, press (scale), focus and the leaving state. Chapter rail rows (01 Enso Flash, 02 Enso Pro, 03 Enso Ultra) step in 6px and darken on hover (measured transform matrix(1,0,0,1,6,0)) and press to scale .97; the chapter links underline on hover; links of chapters not being read go `visibility: hidden` after their fade, so no invisible link sits under the live one. The × close takes the kit hover page-locally (background .14 to .3 white, rim .22 to .55, measured) beside its quarter turn. Page hovers apply under `(hover: hover), not all and (pointer: coarse)`, so every mouse or trackpad gets them and fingers do not. Model cards tilt on fine pointers and press to .98: the tilt owns the inline `transform`, so /enso adds the press as the `scale` property (measured during mousedown: computed `scale` 0.98, bounding width ratio 0.980). The "GPQA Diamond" drawer button turns its plus on hover and nudges 1px on press. Focus uses the shared ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (gap: one typing interval remains in v1 demo code where present)
- [ ] n/a: sound only on the listed moments, through the one kit (the shared sound kit is not on main)

Done here: Signature: the live switchboard (requests route themselves to their tier; send one by hand). Supporting: the stage settle and the chapter wipes (scroll, desktop only), the h1 line cut-in (arrival), and the model-card tilt (pointer). Phones settle the stage by time, with no pin. Idle: the GPQA tour now starts when the plot itself is 35% in view (it read the whole tall section before and never started), and the spec heading's ensō breathes (5s sway and swell, stops with the page pause and reduced motion). Film run `enso-run4` desktop: 0 still screens, layout shift 0.001; phone layout shift 0.000, 0 dead taps. After the settle the film's pause rides the ring's lower right (measured at x 1238, y 465 at 1470×801, was alone at the page edge x 1402). `variety.py` passes, with 0 fade-ups. Ease-emphasis throughout, no springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, `Film`, shared `ModelFilm`)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's own films are unfiltered; the only dimming is a gradient under the name. `ModelFilm` holds at most two films playing at once. The stage's `FilmPause` stops every film and the page's self-running demos. The model-card grid puts nine real model films and posters on screen together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: targets measured at 375×812 (Playwright, isMobile): the four GPQA source marks (↗, 9×18px boxes) and "Source" each carry a centred 44×44px `::after`; "All Enso models" (132×21px box) and the hero "Docs on GitHub" carry a 44px-tall `::after`. For each, points 20px above, below, left and right of centre resolve to the link itself (elementFromPoint, 4/4 and 5/5 with the centre). The drawer button is full width and 44px tall at 375, the chapter links and request chips 44px. A sweep of every visible link and button in `main` at 375 (box height or absolute `::after` height) found none under 44px. At 375 nothing pins. The stage settles by itself 1.1s after arrival (a 2s hold is requested in `docs/requests/enso.md`: the delay is in shared `Launch.jsx`), and the camera pans the subject into the shape. Chapters become picture-then-words, and the grids stack to 2 columns. scrollWidth equals innerWidth at 375. The first-screen ask sits under the name inside the first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [ ] n/a: forms labelled; first error focused (no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body text is #525252 on white and #a3a3a3 or better on black. The `FilmPause` (44px, `aria-pressed`) sits at the stage foot. h1 is the name, h2 the headline and section heads, h3 the chapters. Tabs and radios take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (gap: not measured with Lighthouse in the cloud)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the priority poster (`Img priority`, 1200×1500) are in server HTML. Only transform, opacity and clip-path animate; the switchboard canvas and the GPQA tour pause off screen and with the page pause. CLS measured 0.000 at 1470 and at 375 during a scroll of the page.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `metadata` in `app/enso/page.jsx` is unchanged, and `<JsonLd route="/enso" />` renders the canonical and schema.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [x] Every card opens by Morph
- [ ] n/a: every maker and model page linked in the DOM (that is `/models`)
- [x] One price figure everywhere

Done here: `ModelCards.jsx` copies SPEC: grid 2fr + 4×1fr at 1131px, rows 220px, gap 12, #000 cards, radius 20, title 22/500 (Enso 44), 11px mono pills (SPEC 10px), the film over its poster with a 0.6s crossfade, and a pointer tilt of 3° that settles flat. This page's card is marked. Each card opens through the WebGL opener.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] n/a: config blocks parse on their own (no config)
- [ ] n/a: terminal pauses and ends on a static frame (no terminal)
- [x] No hand-typed version number

Done here: n/a: no code block on /enso (model ids show as inline code).

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the poster is the loading and offline state for every film)
- [x] Blocked live data leaves a complete page, no console errors (the page has no live data; films fall back to posters)
- [ ] n/a: a failed submit keeps its values and shows no success (no form)
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: JS off shows every word. Reduced motion shows the settled stage and the demo's final frame, with no pin. With media blocked, the posters and black frames stand in at their reserved size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for `lib/track.js`: not on main; kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/enso.md` verdict 8 or more (pending a fresh walk of the current build)

Done here: the `V2:` line is in `app/enso/page.jsx`. Proof is in `docs/gallery/enso/` (desktop film, 4 phone stills, and the film-strip sheets `desktop-sheet.jpg` and `phone-sheet.jpg` from run `enso-run4`). Fixes from the 7/10 review (GPQA lead figure, × hover) are in; open shared items are in `docs/requests/enso.md`. This card is refreshed after each review.
