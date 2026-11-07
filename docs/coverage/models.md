# /models coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ModelsPage.jsx` (+ `ModelsPage.css`; also served at `/models/stealth`) · gallery: `docs/gallery/models/` · metric id: `api_key_created`

Open copy questions for James:
- The catalogue's "Every model" disclosure reuses Hanzo's own "Every model" label. The hero link with the same words still goes to `#families`, as live. Should it open the full list instead?

Shared changes requested (`docs/requests/models.md`):
- Kit `Film` needs a `play` prop and a two-film page budget (until then, `components/v2/ModelFilm.jsx`).
- One `ModelCard` for every context. The flagship grid in `components/pages/model/ModelCards.jsx` and my `components/v2/SpecCard.jsx` carry the same `SPEC.md` values.
- Kit `DataTable` with filter, fold and bar options, so the price list can move onto it.

Forks this page deleted:
- The compare tray.
- Its own img+video film.
- The white catalogue card (now Hanzo's black card).
- Count-ups.
- The page ask bar (the site Ask does it).
- The 3×3 wall and its scale camera (now the exact `SPEC.md` grid).
- Every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport ~~label and href from `lib/cta.js`~~ n/a: `lib/cta.js` is not on main; the label is Hanzo's own "Get API key"
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button ~~prices from `lib/plans.js`~~ n/a: no plan prices here; model rates come from Hanzo's printed list (`models/rates.js`)
- [x] Open copy questions for James listed, none decided

Done here:
- One h1, "Frontier AI families", with one solid "Get API key" (`data-thumb`, `data-cta="models.hero"`) and a text link, "Every model".
- The Try section's solid is the next one down the page. Its composer's "Sign up for free" is outlined.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site layout)
- [x] Every link through `A` or a real `<a href>`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /models is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here:
- Parity shows links 58/58.
- The collapsed "Every model" list links all 544 `/models/*` routes: 470 models, 73 makers and `/models/stealth` (checked against `content/pages.json`, 0 missing).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ n/a: not in the kit yet (the hero is page-local) · nothing above the h1
- [x] JS off: legible (`models/NoScript.jsx`); no `opacity:0` on the LCP element (the h1 is masked, not faded)
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in a proof strip ~~`Band`~~ (Related index over a drifting Sigil), then footer
- [x] Card-to-page links use Morph (catalogue) and the WebGL opener (flagships)

Done here:
- First screen at 1470×801: the h1 cut in by line mask (700 ms), the lede and ask on the 8/5 split, and Hanzo's model grid with all nine cards. Enso's film plays at once.
- Then come the pinned black room, Enso vs Zen, Kai's figures, the catalogue, every model priced, Try, the first request and Related.

## 4. Conversion system
- [x] `<Cta>` only: hero "Get API key" (solid, `thumb`), Try "Get free API key" (solid) and "Open Hanzo Chat" (link), composer "Log in"/"Sign up for free" (quiet sm). No raw `.x-btn` left in the page file.
- [x] Sticky ask: Hanzo's "Try Hanzo" in the header (shared system); on phones the slim bar carries "Get API key" once the hero's has gone (`thumb`)
- [x] Copy button copies exactly the displayed code (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` comes from `Cta id`: `models.hero`, `models.try`, `models.try.chat`, `models.try.login` and `models.try.signup`. Secondary asks are text links, so the only solids are the header's and the page's own, one per view.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link beside every submit~~ n/a: no form

Done here: 11 suites, 84.4% against 76.6% and 100.0% against 44.2% are Hanzo's Kai figures. They rise into their line (MaskFig), so no in-between number ever shows. Rates are Hanzo's printed list.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except mono capitals (Zen Mono captions 12px, card pills 10px per `SPEC.md`)
- [x] Measures held; headings balanced
- [x] Code uses kit `Tabs` + `CodeBlock` ("Your first request"); the price list stays a page table because it filters, folds and draws bars (kit `DataTable` has none of these; request filed)
- [x] `parity.py /models`: 0 missing

Done here: text 305/305 and links 58/58 (also `/models/stealth`). The price list folds to 10 rows with the rest `hidden` in the HTML. On phones it becomes 72px rows.

## 7. Visual design system
- [x] `taste.py` passes; deck neutrals only (scoped on `.xmo`)
- [x] No label, tag, badge or pill above a headline. Captions ("Three families", "Enso vs Zen", "Decision Benchmarks", "Priced", "Models") sit below. Enso's "Flagship model" pill is `SPEC.md`'s exact card.
- [x] Radii 6/16/20/24/28, no shadow on any tile or object
- [x] No icon boxes
- [x] Differs from neighbours: the home page uses the same grid as a section; here it is the hero, followed by the black-room chapters and a catalogue no other page has

Done here: h1 52px, section headings 26px, figures 64px. The one moment that grows is Kai's "11" (×1.75 while centred). Tiles are flat #000 (art) and #f5f5f5 (quiet).

## 8. UI component library
- [x] Every control has hover (in `@media (hover:hover)`), press (scale .97/.98, 90 ms), focus-visible (2px ink with a white halo; reversed in the black room) and disabled
- [x] Focus ring visible on a Tab crawl
- [x] ~~Dialogs~~ n/a: none
- [x] ~~Inputs~~ n/a: none
- [x] Forks deleted: listed above

Done here: chips and tabs glide on a layoutId pill (300 ms ease-emphasis, no spring). The disclosure and fold are native or icon-only with `aria-label`.

## 9. Motion and interaction
- [x] One signature (a card opens into its page) plus 3 supporting techniques (pinned families with a clip wipe, chip re-flow, the growing figure); 0 fade-ups
- [x] At least 3 kinds of movement, scroll half or less:
  - **Idle:** films, the light moving through the grid, the request switching models, the Sigil.
  - **Pointer:** the measured tilt, hover plays a film, the Sigil leans.
  - **State:** chips, tabs, the open.
  - **Arrival:** the h1 cut-in and figures rising.
  - **Scroll:** the pinned room and the growing 11.
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (one-step timeouts)
- [x] Sound only through the kit (chips and tabs tick, the open whooshes, Copy chimes; the disclosure has `data-sound="tick"`)

Done here: `variety.py` OK (4 techniques: scroll scrub, clip reveal, layout re-flow, Sigil).

## 10. Media
- [x] Films through ModelFilm (poster first, nothing loads until near, plays only on screen) ~~`Film`/`Pic` only~~ see the shared request
- [x] At most 2 films playing (a page budget); one pause (`FilmPause`, 44px, `aria-pressed`) stops films, Sigil and CSS loops
- [x] Posters are Hanzo's 1200×1500 WebP
- [x] Never dimmed; 9 real films together in the hero

Done here: Enso plays, plus the lit or hovered card, so two at most. The pause sits under the grid beside the "Models" caption.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 375 (`phone.mjs` OK)
- [x] Every target 44px or more; hover previews have tap or focus paths
- [x] Primary ask above the fold at 375×667

Done here:
- Phones follow `SPEC.md`'s phone layout: Enso full width (360px), then cards two by two (220px).
- The black room stacks, the price list becomes rows and chip rows scroll in place.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: text on white uses #0a0a0a, #525252 or #737373; on black, #fafafa, white 78% or #a3a3a3
- [x] A pause control for everything that moves by itself
- [x] ~~Forms~~ n/a
- [x] One h1, h2 per section, h3 inside
- [x] The keyboard reaches every control

Done here: The request's live region speaks only after a person picks a model. Gap: axe has not been run here.

## 13. Performance and engineering
- [x] h1 and grid in server HTML
- [x] Transform, opacity and clip only; `content-visibility` on the 544-link list
- [x] No poller; live rates are fetched once, near the catalogue
- [x] Heavy jobs in the cloud only

Done here: `motion.mjs` shows layout shift 0.030 and 60 fps median (headless). Gap: no Lighthouse run.

## 14. SEO and machine files
- [x] Title and description match `content/pages.json`
- [ ] ~~Canonical~~ shared layout owner
- [x] `<JsonLd route="/models">` unchanged
- [x] Every card is a real link

Done here: 544 crawlable model and maker links are in the server HTML.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md`: #000, 20px radius, 22/500 title with →, 13/18 description, 10px Zen Mono pills, Enso's 44px title and "Flagship model", the measured tilt
- [x] Every card opens: Morph (catalogue name lands as the sheet's h1) or the WebGL opener (flagships)
- [x] Every maker and model page linked in the DOM (544/544)
- [x] One price figure everywhere (`models/rates.js` feeds cards, table and model pages)

Done here: The hero is the `SPEC.md` grid (2fr + 4×1fr, rows 220px, gap 12px). Catalogue, creative and shelf cards share `components/v2/SpecCard.jsx`.

## 16. Developer experience
- [x] Copy equals the display
- [x] ~~Config blocks~~ n/a
- [x] ~~Terminal~~ n/a: the request card has no terminal
- [x] No hand-typed version number

Done here: "Your first request" has cURL, Python, TypeScript and Go, with the model in each, and the kit `Copy`.

## 17. States and resilience
- [x] Loading: posters and server-rendered figures; empty: n/a; error: rates fall back to the printed list
- [x] Blocked live data leaves a complete page (api.hanzo.ai is blocked in the cloud sandbox and the page is complete)
- [x] ~~Failed submit~~ n/a
- [x] Islands degrade (the opener falls back to plain navigation)

Done here: JS off shows every word (the `NoScript` sheet). Reduced motion shows final states with no pin.

## 18. Measurement and handover
- [x] `data-cta` on every primary ~~events through `lib/track.js`~~ not on main yet
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file
- [ ] Review: waiting for a fresh critic (`docs/review/models.md`)

Done here: Gallery films and stills are in `docs/gallery/models/` (to be refreshed after this round).
