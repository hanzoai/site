# /models/* coverage (MASTER.md part 2, the 18 parts)

Page files:
- `components/pages/models/ModelSheet.jsx`: the 470 model pages, `/models/<maker>/<model>`.
- `components/pages/models/ProviderShelf.jsx`: the 73 maker shelves, `/models/<maker>`.
- Shared: `parts.jsx`, `models.css`, `rates.js`, `NoScript.jsx`.

Members checked: `/models/anthropic/claude-opus-5.5`, `/models/hanzo/kai` (plus `/models/hanzo/zen6`, `/models/anthropic`, `/models/openai`) · gallery: `docs/gallery/models/` · metric id: `api_key_created`

Open copy questions for James:
- `/models/enso` still renders Hanzo's captured research report. It was already missing 39 texts on main and needs its own room.
- 4.7's benchmark table: Hanzo's model pages print no benchmarks, so none is added.

Shared changes requested (`docs/requests/models.md`): kit `Film` with `play` and a budget, one `ModelCard`, `DataTable`, `CodeBlock`, `lib/cta.js`/`lib/track.js`.

Forks this template deleted:
- The white sibling card (now Hanzo's black card).
- The split-flap figures.
- The auto-rotating quick start.
- The "No published rate" string.
- The invented section headings.
- The kicker over the h1.
- The coloured syntax palette.
- The browser-default range control.
- Every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond (both files)
- [x] One solid fill per viewport ~~`lib/cta.js`~~ n/a: not on main; labels are Hanzo's
- [x] One h1; clear in 5 seconds
- [x] No dead button ~~`lib/plans.js`~~ n/a: no plans
- [x] Open copy questions listed

Done here:
- Hero: Hanzo's CTA pair (solid "Get API key" with `data-thumb` and `data-cta="model.hero"`, outlined "Try in Chat").
- The sticky local nav's ask turns solid only after the hero ask leaves view, so there is one solid at a time.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link (site)
- [x] Every link through `A`; every card a real link
- [x] Breadcrumb at depth 2+ from Hanzo's crumbs, inside the hero object so nothing sits over the h1; the maker shelf's is beside its count
- [x] Link parity: 0 removed

Done here: Parity is 0 missing on all 470 model pages (run on every one) and on 72 of 73 makers (`/models/enso` is the known exception, unchanged from main).

## 3. First impression and page narrative
- [x] Sells in 5 s, and something moves within 1 s: the name cuts in, the figures rise and the Sigil drifts
- [x] ~~`PageHero`~~ n/a: not in the kit · nothing above the h1
- [x] JS off legible (`NoScript.jsx`)
- [x] One idea per screen: hero, spec, quick start (the black room), "More from <maker>", close
- [x] Ends in Hanzo's own close ("Use <model> via Hanzo AI"), then the footer
- [x] Arrives by Morph: catalogue and sibling card names (`data-morph`) land as the h1 (`data-morph-target`)

Done here: The order follows MASTER 4.7. The sticky local nav uses the page's own section names: "Specifications", "Quick start", "More from <maker>".

## 4. Conversion system
- [x] `<Cta>` only: hero pair (solid with `thumb`, plus a text link), the local nav (quiet, then solid once the hero ask is gone), the close (solid plus link) and the maker hero and close
- [x] Sticky ask: the local nav carries the hero's label (`data-thumb`), and the site Ask steps aside for it
- [x] Copy equals the display (model ID, code)
- [x] `data-cta` on every primary (`model.hero`, `model.local`, `model.band`, `maker.hero`, `maker.band`)

Done here: One ask label per page: Hanzo's first action, used in the hero, the local nav and the phone bar.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Figures trace to Hanzo: the spec value, the shelf card's short context ("33K") and the printed rates, with `rates.js` as fallback
- [x] ~~Marquees~~ n/a
- [x] ~~Forms~~ n/a

Done here: No count-up or flap anywhere. The figures rise into their line (MaskFig), so no number Hanzo did not print ever shows.

## 6. Content presentation (copy untouched)
- [x] 13px floor (mono captions 12px; `SPEC.md` pills 10px)
- [x] Measures and balance
- [x] Quick start uses kit `Tabs` + `CodeBlock` (copy equals display, the language persists); the spec is a `dl` (label and value pairs, not a table)
- [x] Parity 0 missing

Done here: Long spec sets (Kai) show 2 groups, and the rest open with an icon button (`hidden` in the HTML until then).

## 7. Visual design system
- [x] `taste.py` passes; deck neutrals scoped on `.xmf`
- [x] Nothing above a headline: no eyebrows; Hanzo's labels sit in the hero object
- [x] Radii 16/20/24, flat objects with no shadow
- [x] No icon boxes
- [x] Differs from neighbours: a launch layout with the model's own Sigil, not a film grid

Done here: The name is 52px (44 or 32 for long names), the three figures 64px (the largest), section headings 26px and the close 44px, on the deck's 8/5 split.

## 8. UI component library
- [x] Hover, press (.97 at 90 ms), focus-visible (2px ink plus white halo) on every control; disabled on empty picks
- [x] Focus ring on a Tab crawl
- [x] ~~Dialogs~~ n/a
- [x] Sliders are drawn (track, fill and thumb, with focus and press) instead of the browser default
- [x] Forks deleted: listed above

Done here: Bill rows, sibling picks, code tabs and the shelf re-flow all ease at 300 ms (no springs).

## 9. Motion and interaction
- [x] Signature: the Morph arrival. Supporting: the Sigil field, the sibling field's light, the layoutId pills. 0 fade-ups.
- [x] Kinds of movement:
  - **Arrival:** the name and figures.
  - **Idle:** the Sigil and the field's light.
  - **Pointer:** the Sigil leans; dots tell rates; the card tilt.
  - **State:** bill sliders, picks, tabs, spec fold.
  - **Scroll:** only the Sigil object easing up.
- [x] Moves untouched; every control answers
- [x] Reduced motion final; no `setInterval`
- [x] Sound through the kit (tabs and picks tick, the open whooshes, Copy chimes)

Done here: `variety.py` OK on ModelSheet and ProviderShelf.

## 10. Media
- [x] ~~`Film`/`Pic`~~ n/a: model pages have no film of their own; the Sigil is the designed image (MASTER part 7)
- [x] One `FilmPause` (44px, `aria-pressed`) stops the Sigils and the field's CSS loops
- [x] Two canvases per page (hero object, close)
- [x] No dimmed image

Done here: The Sigil is seeded from the route and the model's own numbers (context, in, out), so no two of the 470 pages share a picture.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 with no overlap
- [x] No horizontal scroll (`phone.mjs` OK on 4 members)
- [x] 44px targets; tap paths
- [x] Ask above the fold at 375×667

Done here:
- Phone order: name, lede, CTA pair, then the Sigil object (breadcrumb and ID) and the three figures in a row.
- The local nav keeps the name and the ask.
- The field turns 4:5 and the rails scroll-snap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Deck contrast: #0a0a0a, #525252 or #737373 on white; #fafafa or #a3a3a3 on black
- [x] Pause control for the moving Sigils and loops
- [x] ~~Forms~~ n/a
- [x] One h1, h2 per section, h3 in the spec
- [x] Keyboard: field dots, sliders, tabs, picks, Copy

Done here: The figures are a `dl` named with the full price. Sliders announce "N million tokens a month". Gap: no axe run.

## 13. Performance and engineering
- [x] h1 and figures in server HTML (the figures carry Hanzo's real values)
- [x] Transform and opacity only; two canvases
- [x] Catalogue fetched only when a rate is missing
- [x] Heavy jobs in the cloud only

Done here: `motion.mjs` on the model page shows layout shift 0.000 and 0 still screens.

## 14. SEO and machine files
- [x] Titles and descriptions unchanged
- [ ] ~~Canonical~~ shared owner
- [x] JsonLd unchanged
- [x] Cards are links

Done here: The breadcrumb is visible on every model page and every maker shelf.

## 15. Catalogue and product pages
- [x] Sibling and shelf cards are `SPEC.md` cards (`SpecCard`)
- [x] Every card opens by Morph
- [x] Every maker and model page is linked from /models (544/544)
- [x] One price everywhere (`rates.js`; `money()` rounds under $1 to 3 places, else 2, as Hanzo's /models prints)

Done here:
- Model header: name, lede, three numbers (largest), the CTA pair and a mono id pill with Copy.
- A rate Hanzo hasn't printed shows "—", never "…".

## 16. Developer experience
- [x] Copy equals the display; the model id is in every sample
- [x] ~~Config~~ n/a
- [x] ~~Terminal~~ n/a · the maker's guest cURL is static with Copy
- [x] No hand-typed version

Done here: The quick start no longer rotates. The chosen language persists across model pages (`localStorage` in try/catch).

## 17. States and resilience
- [x] A missing rate is an em dash; spec groups fold
- [x] Blocked live data leaves a complete page, from Hanzo's printed list
- [x] ~~Failed submit~~ n/a
- [x] The Sigil failing leaves the page

Done here: JS off: `NoScript.jsx`. Reduced motion: no drift, final states.

## 18. Measurement and handover
- [x] `data-cta` on every primary ~~`lib/track.js`~~ not on main
- [x] Nothing before consent
- [x] `V2:` line in `ModelSheet.jsx`
- [ ] Review: waiting for a fresh critic (`docs/review/models-family.md`)

Done here: Gallery is in `docs/gallery/models/` (refresh pending after this round).
