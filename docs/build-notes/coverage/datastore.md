# /datastore coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Datastore.jsx` (+ `Datastore.css`) · gallery: `docs/gallery/datastore/` · metric id: `api_key_created` (developers; the click is `cta_click datastore.hero`)

Open copy questions for James: "Which way in?" is our heading for the protocol picker, not Hanzo's (Hanzo's "SQL, on several protocols" sits under it as its caption); keep it or move it to `content/ui-strings.json`? The demo labels are ours too ("example" rows, "node", "replica", "partition", "TTL", "Raft quorum", the scene captions, "Reads N of 12 columns" past Hanzo's own "Reads 1 of 12 columns"). Live's "Get Datastore" line reads "Document datastore" on a column-store page; kept exactly as live. "4 stars" is the live page's static GitHub figure.
Shared changes requested (`docs/build-notes/requests/datastore.md`): none. Kit notes for the Cloud 1 owner: the kit `Flap` flips through other digits (banned by brief 2 rule 8), so this page no longer uses it; KeynoteClose's "Self-host" text link reads `--ink` in the dark room and the kit link asks are 21px tall (set white and 44px here).
Forks this page deleted: the kit `Flap` split-flap (flipped 8128 → 8123 through foreign digits; now a page-local board where each true digit drops in from behind its tile's mask, 60 ms apart); the hero count's opacity rise (now a mask cut); 3 `setInterval` loops (phone chapter scenes, the exploded table's phone cycle; now one pass each with `setTimeout`); the fake tablist without panels on the exploded table's rail (now a nav of buttons with `aria-current`); the scrolling-by-`__lenis` jump (now `lib/scroll` `scrollToY`); the accent `--ac` and every off-deck grey (#fbfbfd, #e3e3e8, #f0f0f3, #f2f2f5, #e8e8ed, #f5f5f7, rgba 115/115/115 tints); 4 box-shadows; the 44px h1 (`size="md"`, now the kit's 52px), the 128px/96px port, the 40px port numbers, the 26px clamp SQL.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live hero's)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: The hero's one own solid is "Try Hanzo" → /login (`datastore.hero`, `data-thumb`); "Documentation" → docs.hanzo.ai is a kit text link (`datastore.hero-2`). The close's one solid is Hanzo's "Deploy to Cloud" (`datastore.close`) with the "Self-host" link. The first screen reads "A column store for analytical SQL" over the query console scanning one column of twelve.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /datastore is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link goes through the kit's `Cta` (hero and close) or `A` (close chips). `parity.py /datastore`: links 5/5.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's KeynoteStage stands in until `PageHero` merges; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is Hanzo's own "Get Datastore" dark room)
- [x] ~~Card-to-page links use Morph~~ n/a: no card opens into a page

Done here: With Next's JS blocked (`prehyd.cjs`), the scan beam runs down the `event` file in the server HTML (screens differ by 150 and 566 samples at 250–1000 ms). With JS off nothing is hidden (audit: 0 hidden text): the exploded table unpins and its four sentences stand stacked. Order: query console (hero) → what it does (six pinned facts) → where the speed comes from (pinned, quiet room) → what people point it at (index) → which way in (quiet room) → Get Datastore (dark).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text (the close's kit `CodeBlock`); failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `datastore.hero`, `datastore.hero-2`, `datastore.close`, `datastore.close-self`. On desktop the header's button outlines while the hero's solid is on screen (SYSTEM §5); on phones the bar stays away because the hero's words equal the header's.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The only figures are Hanzo's: 8123, 9000, 12 columns, Apache-2.0, "4 stars" and the index numbers 01–12. No counter or board ever draws a digit that is not the true one: the hero's count and the port board cut in from behind a mask. The example table's cells carry no values.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs~~ n/a: the console and exploded table are drawn objects; code uses the kit `CodeBlock` (close)
- [x] `python3 scripts/parity.py /datastore`: 0 missing

Done here: Parity 78/78 text, 5/5 links. Sizes are deck only: h1 52 (40 phone), headings 26, H3 26 (kit chapters) / 21, lede 21, SQL 21 (16 phone), body 16, labels 14/13, mono 12 digits; figures: the port board 64px Air 220 (52 phone), ports 32px Air, the count 26px. Column names break only at their underscore (`duration_ms`), never mid-word.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` (main's 0.03 chroma) OK. Colours: #fff, #fafafa, #f5f5f5, #ededed, #e4e4e7, #d4d4d4, #a3a3a3 (lines), #737373, #525252, #0a0a0a, black 10%, white 0–40% (the scan light on ink). 0 box-shadows; radii 6/8/12/16/24/999. "SQL, on several protocols" now sits under "Which way in?"; the speed sentences' 01–04 sit under their words. A column being read fills with ink; a column that steps back keeps a hollow outlined name.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a: no dialog on this page
- [x] ~~Inputs 16px~~ n/a: no input; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Column files (`aria-pressed`; `event` is `aria-disabled`, it is the query's own), the speed rail (`aria-current`), the protocol radios all press to .97 in 90 ms, hover by border or fill inside `@media (hover: hover)`, focus with `2px solid var(--focus)`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: `variety.py` OK (useScroll; 0 `Rise`, 0 `Flap`). Idle: the console adds and drops columns by itself every 2.6 s (gated on `live && !useStagePause()`). Scroll (1 of 5 kinds): the pinned facts and the exploded table. State: pressing a column rewrites the SQL; the protocol board. Time: the scan beam, the streams running three times and resting, the rollups settling. Arrival: line masks and the board's digit drops. 0 springs; deck easing.

## 10. Media
- [x] ~~`Film` and `Pic`~~ n/a: no photo or film; the objects are drawn product UI
- [x] ~~At most 2 videos~~ n/a: no video
- [x] Nothing missing; ~~alt~~ n/a: no image
- [x] ~~No dimmed photo; 4+ real visuals~~ n/a: Datastore has no Hanzo media

Done here: Every section's object is product UI in HTML and SVG: the console, six scenes, the exploded table, the index, the port board.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs datastore`: no sideways scroll, no errors (desk + 375). `audit2.cjs`: 0 sideways at 320, 0 targets under 44px on phone. At 375×667 "Try Hanzo" sits at y≈299–343. The files grid is 4 across on phones, 6 at 900–1199, 12 above.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On white #525252/#737373; in the quiet rooms and scenes `--quiet`/`--body` become #525252; on ink #fafafa. Headings: h1 → h2 → h3 ×6 → h2 → h3 ×4 → h2 ×3. The SQL line and the board are `aria-live="polite"`; the board's value is real text for readers.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; ~~every image sized~~ n/a: no image
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Only `setTimeout` steps, run while seen; the exploded table writes three CSS variables per scroll frame, no React render per frame beyond the step. Filmed in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/datastore" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] ~~Every card is a real link~~ n/a: no cards

Done here: `app/datastore/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/datastore" />`.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a
- [x] ~~Every maker and model page linked~~ n/a
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Cloud product anatomy: identity (hero), the live object (the console), facts that open in turn (six pinned scenes, four layers), the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the close's agent prompt)
- [x] ~~Config blocks parse~~ n/a: no config block
- [x] ~~Terminal pauses~~ n/a: no terminal; the self-running console has the Stage pause
- [x] No hand-typed version number

Done here: The agent prompt is the kit `CodeBlock` in KeynoteClose; the hero's SQL is a live readout of the pressed columns, not a copy target.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a beyond: no fetch)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit~~ n/a: no form
- [x] A thrown island does not blank the page (site error boundary)

Done here: Dropping every extra column returns the console to Hanzo's own "SELECT count() …" and "Reads 1 of 12 columns"; paused, reduced-motion (the table rests on its last layer) and JS-off states read as intended. Console errors: none.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit's `Cta` (`cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: no `docs/build-notes/review/datastore.md` yet

Done here: ids listed in part 4; metric `api_key_created`. Gallery: `docs/gallery/datastore/` (desktop.mp4, desktop.jpg, phone-1..3.jpg). Own score 8/10; the critic's verdict decides.
