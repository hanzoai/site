# /models coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ModelsPage.jsx` (+ `ModelsPage.css`; also served at `/models/stealth`) · gallery: `docs/gallery/models/` · metric id: `api_key_created`

Open copy questions for James:
- The catalogue's "Every model" disclosure reuses Hanzo's own "Every model" label. The hero link with the same words still goes to `#families`, as live. Should it open the full list instead?
- The catalogue card reads "Zen6" (Hanzo's /models card) but the page it opens, `/models/hanzo/zen6`, has the h1 "zen6" (Hanzo's model page), so the Morph lands on a different case. Which spelling is right for both?
- Several catalogue and shelf cards (other labs' batch variants, Claude Fable 5, GPT-3.5 Turbo 0613) link to model pages hanzo.ai has but this rebuild does not. They open hanzo.ai in a new tab and say so (↗ plus a spoken "opens in a new tab"). Keep them, or drop them from the shelves?

Shared changes requested (`docs/build-notes/requests/models.md`):
- Kit `Film` needs a `play` prop and a two-film page budget (until then, `components/v2/ModelFilm.jsx`).
- One `ModelCard` for every context (`components/pages/model/ModelCards.jsx` and `components/v2/SpecCard.jsx` carry the same `SPEC.md` values).
- Kit `DataTable` with filter, fold and bar options.
- `ui.jsx` `Copy` should own a `role="status"` announcement (page-local `CopyStatus` until then).
- Kit `A` opens `#section` links in a new tab.
- The header's solid "Try Hanzo" should stay quiet while a page `data-thumb` is on screen.

Forks this page deleted:
- The compare tray, its own img+video film, the white catalogue card, count-ups, the page ask bar, the 3×3 wall and its scale camera, every spring.
- The hero's 2,600 ms relight timer (now pointer- and scroll-lit).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond, V2
- [x] One solid fill per viewport ~~label and href from `lib/cta.js`~~ n/a: `lib/cta.js` is not on main; the label is Hanzo's own "Get API key"
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button ~~prices from `lib/plans.js`~~ n/a: no plan prices; model rates come from Hanzo's printed list (`models/rates.js`)
- [x] Open copy questions for James listed, none decided

Done here: One h1, "Frontier AI families", with one solid "Get API key" (`data-thumb`, `data-cta="models.hero"`) and a text link. The page ends on a black closing room with the page's own words and the one "Get API key" (`models.close`).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site layout)
- [x] Every link through `A` or a real `<a href>`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /models is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity shows text 305/305 and links 58/58. The collapsed "Every model" list links all 544 `/models/*` routes (470 models, 73 makers, `/models/stealth`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (Enso's film plays at once; the h1 cuts in by line mask)
- [x] ~~`PageHero`~~ n/a: not in the kit yet (the hero is page-local) · nothing above the h1
- [x] JS off: legible (`models/NoScript.jsx`, written with `<NoJs>`); no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends on a closing `Band`-style black room (h2 44px, lede, the one "Get API key", Enso's film), then the footer
- [x] Card-to-page links use Morph (catalogue) and the WebGL opener (flagships)

Done here: Order: the SPEC grid, the pinned black room, Enso vs Zen, Kai's figures, the catalogue, every model priced, Try, the first request, Related, the close. The last catalogue group drops its bottom rule and "Every model" hands straight to the price list (96px, not 188px); Try starts 112px below it.

## 4. Conversion system
- [x] `<Cta>` only: hero "Get API key" (solid, `thumb`), Try "Get free API key" (solid) and "Open Hanzo Chat" (link), composer "Log in"/"Sign up for free" (quiet sm), close "Get API key" (solid)
- [x] Sticky ask: the header carries the page's "Get API key" once the hero's has gone (`thumb`)
- [x] Copy button copies exactly the displayed code (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The Copy on "Your first request" is a 44px outlined pill with a white-78% label on graphite (white on hover), and a page-level `role="status"` region (`CopyStatus`) says "Copied" only when the copy really happened.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link beside every submit~~ n/a: no form

Done here: 11 suites, 84.4% against 76.6% and 100.0% against 44.2% are Hanzo's Kai figures; they rise into their line (MaskFig), never counting through numbers Hanzo did not print.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except mono capitals (12px captions, 10px card pills per `SPEC.md`)
- [x] Measures held; headings balanced
- [x] Code uses kit `Tabs` + `CodeBlock`; the price list stays a page table (filter, fold, bars)
- [x] `parity.py /models`: 0 missing

Done here: Catalogue cards on desktop show the name, id, price and pills; the 3–4 line description waits in the HTML and arrives on hover or focus at SPEC's 57px (`SpecCard hush`). Phones read the catalogue as 72px rows.

## 7. Visual design system
- [x] `taste.py` passes; deck neutrals only (scoped on `.xmo`)
- [x] No label, tag, badge or pill above a headline (captions sit below; Enso's "Flagship model" pill is `SPEC.md`'s card)
- [x] Radii 6/12/16/20/24/28, no shadow on any tile or object
- [x] No icon boxes
- [x] Differs from neighbours: the home page uses the grid as a section; here it is the hero, followed by the black room and a catalogue no other page has

Done here: h1 52px, section headings 26px, figures 64px. Kai's "11" has its own 58px box and grows ×1.75 up and right from its bottom-left corner while centred; "Suites won · Kai vs Jev" sits on the line below, so the two never touch at rest or at the peak (1470 and 375).

## 8. UI component library
- [x] Every control has hover (in `@media (hover:hover)`), press (scale .97/.98, 90 ms), focus-visible (2px ink with a white halo; reversed on black) and disabled
- [x] Focus ring visible on a Tab crawl
- [x] ~~Dialogs~~ n/a: none
- [x] ~~Inputs~~ n/a: none
- [x] Forks deleted: listed above

Done here: Chips and tabs glide on a layoutId pill (300 ms ease-emphasis). The disclosure and fold are native or icon-only with `aria-label`.

## 9. Motion and interaction
- [x] One signature (a card opens into its page) plus pinned families with a clip wipe, chip re-flow and the growing figure; 0 fade-ups
- [x] Kinds of movement, scroll half or less:
  - **Idle:** Enso's film, the request switching models, the Related Sigil, the "Flagships from other labs" head's drifting contour field, the price list's live dot and the code's caret (the screens `motion.mjs` found still now each have one).
  - **Scroll:** the grid's light walks Kai to Mori as the grid passes (that card's film plays, its arrow leans), the pinned room, the growing 11.
  - **Pointer:** the measured tilt; the card under the pointer or focus plays its film.
  - **State:** chips, tabs, the open. **Arrival:** the h1 cut-in, figures rising.
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`, and no relight timer (MASTER 4.3)
- [x] Sound only through the kit

Done here: `Stage()` has no `setTimeout`: `lit` comes from pointer/focus, else from the grid's `useScroll` progress.

## 10. Media
- [x] Films through ModelFilm (poster first, nothing loads until near, plays only on screen)
- [x] At most 2 films playing; one pause (`FilmPause`, 44px, `aria-pressed`) stops films, Sigil and CSS loops
- [x] Posters are Hanzo's WebP; phone catalogue thumbs are the family posters (or a still Sigil for other labs)
- [x] Never dimmed

Done here: Enso plays, plus the lit card (pointer, focus or scroll), so two at most.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap; no horizontal scroll at 375 or 320
- [x] Every target 44px or more; hover previews have tap or focus paths
- [x] Primary ask above the fold at 375×667

Done here:
- The catalogue is 72px rows on phones: a 48px thumb, the name, the id and the price (description and pills wait in the HTML).
- Creative tiles keep the film; their words sit on a black fade in the top of the card, the id only (endpoints stay in the HTML, never broken mid-word), one pill.
- The code tabs stay on one row (they scroll in place).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: on white #0a0a0a, #525252 or #737373; on black #fafafa, white 78% or #a3a3a3 (Copy is white 78% on #171717)
- [x] A pause control for everything that moves by itself
- [x] ~~Forms~~ n/a
- [x] One h1, h2 per section, h3 inside
- [x] The keyboard reaches every control

Done here: One polite `role="status"` region announces Copy; the request's live region speaks only after a person picks a model. Gap: axe has not been run.

## 13. Performance and engineering
- [x] h1 and grid in server HTML
- [x] Transform, opacity and clip only; `content-visibility` on the 544-link list
- [x] No poller; live rates fetched once, near the catalogue
- [x] Heavy jobs in the cloud only

Done here: No hydration mismatch at 1470×801 or 375×812: the JS-off sheet is a plain `<style>` scoped under `html:not(.js)` (`<NoJs>`), not a `<noscript>` inside a client tree, which was the attribute React could not hydrate. Playwright scroll pass: 0 console errors from the page (only the sandbox's blocked api.hanzo.ai request), layout shift 0.000.

## 14. SEO and machine files
- [x] Title and description match `content/pages.json`
- [ ] ~~Canonical~~ shared layout owner
- [x] `<JsonLd route="/models">` unchanged
- [x] Every card is a real link

Done here: 544 crawlable model and maker links are in the server HTML.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md`: #000, 20px radius, 22/500 title with →, 13/18 description, 10px Zen Mono pills, Enso's 44px title, 13/18 description and "Flagship model", the measured tilt
- [x] Every card opens: Morph (catalogue) or the WebGL opener (flagships); cards with no page here open hanzo.ai in a new tab and say so
- [x] Every maker and model page linked in the DOM (544/544)
- [x] One price figure everywhere (`models/rates.js`)

Done here: The hero grid is `SPEC.md` to the pixel at 1265px and wider: `grid-template-columns: 385px repeat(4, 192px)`, rows 220px, gap 12px (the hero's wrap is 1,201px so the h1 lines up with Enso). Narrower screens keep 2:1:1:1:1.

## 16. Developer experience
- [x] Copy equals the display
- [x] ~~Config blocks~~ n/a
- [x] ~~Terminal~~ n/a
- [x] No hand-typed version number

Done here: "Your first request" has cURL, Python, TypeScript and Go, with the model in each.

## 17. States and resilience
- [x] Loading: posters and server-rendered figures; error: rates fall back to the printed list
- [x] Blocked live data leaves a complete page (api.hanzo.ai is blocked in the cloud sandbox)
- [x] ~~Failed submit~~ n/a
- [x] Islands degrade (the opener falls back to plain navigation)

Done here: JS off shows every word (`NoScript`). Reduced motion shows final states with no pin.

## 18. Measurement and handover
- [x] `data-cta` on every primary ~~events through `lib/track.js`~~ not on main yet
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file
- [ ] Review: waiting for a fresh critic (`docs/build-notes/review/models.md`)

Done here: Fresh proof in `docs/gallery/models/` (first screens at 1470×801 and 375×812, film-strip sheets).
