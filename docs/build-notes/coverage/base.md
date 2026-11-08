# /base coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Base.jsx` (+ `Base.css`; the shared `ExampleConsole` is no longer used here: "Run the binary" has its own `Deploy` object) · gallery: `docs/gallery/base/` · metric id: `api_key_created` (developers; the click is `cta_click base.hero`)

Open copy questions for James: the hero's primary is Hanzo's "Try Hanzo" (/login), the same words as the header's ask: on desktop the header outlines while the hero's solid is on screen (SYSTEM §5), and on phones the header keeps the solid "Try Hanzo" while the hero's is outlined; keep Hanzo's order, or lead with "Read the docs"? The demo's UI labels are ours ("collection", "the moment it exists", "exists", "one stream", "declare", "it exists", "single Go binary", the step names); keep them or move them to `content/ui-strings.json`? "4 stars" is the live page's static GitHub figure. The hero lede is Hanzo's "Open source (MIT)…" line and Hanzo's hero paragraph ("Base is a single Go binary…") opens the next section: same words, new order.
Shared changes requested (`docs/build-notes/requests/base.md`): none. Kit notes for the Cloud 1 owner: KeynoteClose's text-link "Self-host" reads `--ink` inside the dark room (ink on graphite) and the kit link asks are 21px tall; this page sets them white and 44px locally.
Forks this page deleted: Frame's `Console` (4 `title=` tooltips, a spring row, a `setInterval`) replaced by page-local `ExampleConsole`; Frame's `useEvery` interval in the admin (now one `setTimeout` per record, paused with the Stage); the phones' endless `setInterval` build loop (now one pass, 900 ms a step); the hand-made `.kn-btn` asks in "Run the binary" (now kit `Cta`s, `base.run`, `base.run-2`); the fake tabs without panels (now a two-button view switch with `aria-pressed` and a steps nav with `aria-current`); the accent `--ac` and every off-deck grey (#fbfbfd, #e3e3e8, #f2f2f5, #e8e8ed, #f5f5f7, #8e8e93, #d1d1d6, #a1a1a6, #f0f0f3); 6 box-shadows; the 72px/40px clamp sizes.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live hero's)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: The hero's one own solid is "Try Hanzo" → /login (`base.hero`, `data-thumb`): KeynoteStage draws it quiet, so Base.css fills it with `--btn-solid-bg/ink` at every size (computed rgb(10,10,10)); hover is the deck's #262626, not the kit's #2c2c2e. One solid per viewport, measured every 400px of scroll at 1470 and 375 (`solids.js`: 1 everywhere): while a page ask (`base.hero`, `base.run`, `base.close`) is on screen, `useOwnAsk()` sets `html.bs-own-ask` and the header's "Try Hanzo" outlines; between them the header carries the one solid. "Read the docs" and "View on GitHub" are kit text links. "Run the binary" has one solid ("Deploy on Hanzo Cloud", `base.run`) and a link ("GitHub"); the close has "Deploy to Cloud" (`base.close`) and the "Self-host" link. The first screen reads "An app backend in one file" beside the admin with records landing.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /base is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link goes through the kit's `A` or `Cta`, the console's sidebar (Base, Datastore, Object Storage, Memory) included. `parity.py /base`: links 11/11.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's KeynoteStage stands in until `PageHero` merges; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the close is Hanzo's own "Get Base" dark room, related links inside it)
- [x] ~~Card-to-page links use Morph~~ n/a: the capability cards open in place (KeynoteOpen's shared-element morph), they are not page links

Done here: With Next's JS blocked (`prehyd.cjs`), the admin's newest row lands (`bs-land`) and the live dot beats in the server HTML (screens differ by 157 and 829 samples at 250–1000 ms). With JS off every tile stands built and every sentence of the pinned scene stacks (audit: 0 hidden text). The stage sits higher (h1 at y 196–303 of 801, baseline ~36%). Section steps after the cards and before the dark room are ~150–190px. Order: admin (hero) → one file (Hanzo's paragraph beside the binary) → declare a collection (pinned, quiet room) → what you get (six cards that open) → run the binary + console → Get Base (dark).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text (the close's kit `CodeBlock`); failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Asks are kit `Cta`s only: `base.hero`, `base.hero-2`, `base.hero-3` (KeynoteStage), `base.run`, `base.run-2`, `base.close`, `base.close-self`. At both sizes the header's button outlines while any page ask is on screen (hero, "Deploy on Hanzo Cloud", "Deploy to Cloud") and is the one solid between them; the phone bar stays away because the hero's words equal the header's (SYSTEM §5).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form (the collection name field submits nothing)

Done here: The only figures are MIT, "4 stars" (live) and the step numbers 01–03 (live). The admin's rows are blank bars and hashed ids, never invented data; the record count is not shown.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs~~ n/a: the admin table is a drawn, `aria-hidden` mock; code uses the kit `CodeBlock` (close)
- [x] `python3 scripts/parity.py /base`: 0 missing

Done here: Parity 70/70 text, 11/11 links. Sizes are deck only: h1 52 (40 phone), headings 26 ("Declare a collection, get an API", "What you get", "Run the binary"), H3 21 (kit title), lede 21, body 16, labels 14/13, mono caps 12; "base" 44px mono, the collection name 32px mono. The records path breaks at its slashes (`<wbr>`), never mid-word.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` (main's stricter 0.03 chroma) OK. Colours: #fff, #fafafa, #f5f5f5, #ededed, #e4e4e7, #d4d4d4, #a3a3a3, #737373, #525252, #262626, #0a0a0a, black 10%, white 14/78%. 0 box-shadows; radii 6/8/12/16/24/999. "What is Hanzo Base" now sits under "Declare a collection, get an API", "Capabilities" under "What you get", and each pillar's 01–03 under its words. Build state is a shape: a faint hairline sketch of the tile (its parts drawn at 22%), white tile, ink tile. The six capability cards are an uneven composition (4+2, 2+4, 3+3 of six columns), never three equal boxes in a row.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native-equivalent (KeynoteOpen: `role="dialog"`, Esc, backdrop, focus to Close and back to the card)
- [x] Inputs 16px or larger (the collection field is 17px); no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: The view switch, steps, related links and console rows press to .97 in 90 ms, hover by fill or underline (never opacity) inside `@media (hover: hover)`, and focus with `2px solid var(--focus)`; the collection field shows the ring on its whole label. Capability cards on hover lift 4px, the plus turns 90°, and each drawing acts out its idea (the stream's dots all fill, the files' page slides to its record, denied rules slide out, the tenant files spread, the arrow to /records grows). Text-link asks ("Read the docs", "View on GitHub", "GitHub", "Self-host") underline and their arrow steps 4px. In the hero admin a hovered row turns its id ink and the address pill shows that record's path (`/v1/collections/posts/records/<id>`), pausing the stream while pointed at. In "Run the binary" each place is a button (hover, focus or click picks it; pressed = ink). No `title=` attributes.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: `variety.py` OK (useScroll; 0 `Rise`). Idle: a record lands every 2.6 s (gated on `live && !useStagePause()`). Scroll (1 of 5 kinds): the pinned build-up and the Stage settle. State: typing a collection name re-declares the scene; Records/Schema; cards open by shared-element morph (600 ms in-out). Time: the stream's records arrive three times and rest; in "Run the binary" the request moves to the next place every 2.8 s while seen and untouched, its rows landing, and checkout-web finishes building once. Arrival: line masks; each capability card's drawing plays its idea once as the card is 60% in view (`data-play` for 1.4 s), then rests. 0 springs; deck easing; loops end at rest.

## 10. Media
- [x] ~~`Film` and `Pic`~~ n/a: no photo or film; the objects are drawn product UI
- [x] ~~At most 2 videos~~ n/a: no video
- [x] Nothing missing; ~~alt~~ n/a: no image
- [x] ~~No dimmed photo; 4+ real visuals~~ n/a: Base has no Hanzo media

Done here: Every section's object is product UI in HTML: the admin, the binary, the build-up tiles, six card drawings, and Base's own deploy window in "Run the binary": the four places (Hanzo Cloud, a laptop, a box, a cluster) each answering `/v1/collections/{the typed name}/records`, the example project's apps reading it, and Hanzo's console words (api.hanzo.ai/v1/base, "Open in the console").

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `sweep.cjs base`: no sideways scroll, no errors (desk + 375). `audit2.cjs`: 0 sideways at 320, 0 targets under 44px on phone (the kit's link asks set to 44px here). At 375 "Try Hanzo" sits at y≈295–338. On phones the build-up is one thing in, one out: each paragraph is followed by its own tile (CSS `display: contents` + `order`), and each tile builds as it comes into view (IntersectionObserver, threshold 0.6), then rests built. On desktop the pin sits at top 60px, under the glass header, and all five tiles fit the pinned screen (y≈122–738 at 801). The admin's "live" marker sits under the collections (y≈448), not at the fold. Section steps: admin to the binary card ≈130px; the dark room ends one step under its content (related links in two columns).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; ~~first error focused~~ n/a: the one field cannot be invalid (it filters to a-z, 0-9, _)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: On white #525252/#737373; in the quiet room `--quiet`/`--body` become #525252; on ink #fafafa/#a3a3a3/white 78%. Headings: h1 → h2 → h3 ×3 → h2 ×3. The collection field is inside its visible label and named "Collection name".

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; ~~every image sized~~ n/a: no image
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: One `setTimeout` per record, only while seen and unpaused; the deploy window's cycle and build are single `setTimeout`s while seen; the card play and the one-solid watcher are IntersectionObservers, disconnected on unmount; motion is transform, opacity and colour. Filmed in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (from `content/pages.json`)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/base" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (related rows); capability cards are disclosure buttons

Done here: `app/base/page.jsx` is unchanged: metadata from `content/pages.json` and `<JsonLd route="/base" />`.

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a (cards open in place)
- [x] ~~Every maker and model page linked~~ n/a
- [x] ~~One price figure everywhere~~ n/a: no price

Done here: Cloud product anatomy: identity (hero), the live object (the admin), facts that open in turn (the build-up, six cards), the deploy window (four places, one API), the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the close's agent prompt)
- [x] ~~Config blocks parse~~ n/a: no config block
- [x] ~~Terminal pauses~~ n/a: no terminal; the self-running admin has the Stage pause
- [x] No hand-typed version number

Done here: The agent prompt is the kit `CodeBlock` inside KeynoteClose; the records path in the build-up follows the typed collection name, and the same name is carried down into all four places in "Run the binary".

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a beyond: no fetch)
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit~~ n/a: no form
- [x] A thrown island does not blank the page (site error boundary)

Done here: An empty collection field falls back to "posts" so the scene is never blank; paused, reduced-motion (all built) and JS-off states read as intended. Console errors: 0 at 1470 and 375 (`errs.js`). Base's own server/client differences are gone: the build-up reads reduced motion through `useCalm` (after mount), and the collection input carries `suppressHydrationWarning` (a screenshot tool's caret hiding writes its style before hydration). Two shared mismatches remain and are not this page's: KeynoteStage's object transform under reduced motion, and the footer shell's HTML when captured before hydration.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit's `Cta` (`cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [x] Review read: `docs/build-notes/review/base.md` (7/10), its fixes applied

Done here: ids listed in part 4; metric `api_key_created`. Gallery: `docs/gallery/base/` (desktop.mp4, desktop.jpg, phone-1..3.jpg, after review 1 desktop-r2.jpg, phone-r2.jpg; after review 2 desktop-r3.jpg, phone-r3.jpg). Own score 8/10; the critic's verdict decides. The example project's names (gateway, payments-api, checkout-web, docs-site) and the limiter sentence are Hanzo's live copy on /base (parity needs them), so they stay, now as the apps reading this Base inside its own window.
