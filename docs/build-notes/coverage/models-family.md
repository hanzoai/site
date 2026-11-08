# /models/* coverage (MASTER.md part 2, the 18 parts)

Page files:
- `components/pages/models/ModelSheet.jsx`: the 470 model pages, `/models/<maker>/<model>`.
- `components/pages/models/ProviderShelf.jsx`: the 73 maker shelves, `/models/<maker>`.
- Shared: `parts.jsx`, `models.css`, `rates.js`, `NoScript.jsx`.

Members checked: `/models/aion-labs`, `/models/aion-labs/aion-2.0`, `/models/anthropic/claude-opus-5.5`, `/models/hanzo/kai`, `/models/anthropic`, `/models/hanzo` (plus `/models/hanzo/enso`, `/models/hanzo/zen6`, `/models/google`, `/models/openai`) · gallery: `docs/gallery/models/family-*` and `docs/gallery/models-family/` · metric id: `api_key_created`

Open copy questions for James:
- `/models/enso` still renders Hanzo's captured research report and needs its own room.
- 4.7's benchmark table: Hanzo's model pages print no benchmarks, so none is added.
- Hanzo's "More from <maker>" and shelf cards link some models hanzo.ai has but this rebuild does not (Claude Fable 5, 5.1, the batch variants). They open hanzo.ai in a new tab and say so. Keep, or drop them?
- Ask labels drift within a page in Hanzo's own words: "Get API key" (hero) and "Get an API key" (close); "Get decisions" on Kai. Which one per page?

Shared changes requested (`docs/build-notes/requests/models.md`): kit `Film` with `play` and a budget, one `ModelCard`, `DataTable`, `Copy` with `role="status"`, kit `A` keeping `#section` links on the page, `lib/cta.js`/`lib/track.js`.

Forks this template deleted:
- The white sibling card, the split-flap figures, the auto-rotating quick start, the "No published rate" string, the invented section headings, the kicker over the h1, the coloured syntax palette, the browser-default range control, every spring.
- The maker shelf's three-equal card grid (now 72px rows).
- The duplicate "More from Hanzo" h2 on Kai (the family row is a caption).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond (both files)
- [x] One solid fill per viewport ~~`lib/cta.js`~~ n/a: not on main; labels are Hanzo's
- [x] One h1; clear in 5 seconds
- [x] No dead button ~~`lib/plans.js`~~ n/a: no plans
- [x] Open copy questions listed

Done here: Hero: Hanzo's CTA pair (solid with `data-thumb`, `data-cta="model.hero"`, plus a text link). A `#quickstart` ask (Kai's "Get decisions") stays on the page instead of opening a new tab. The local nav's ask turns solid only after the hero ask leaves view.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link (site)
- [x] Every link through `A`; every card a real link
- [x] Breadcrumb at depth 2+ from Hanzo's crumbs, inside the hero object; the maker shelf's beside its count
- [x] Link parity: 0 removed

Done here: Parity 0 missing on Aion Labs (37/37, 10/10), Aion-2.0 (111/111, 9/9), Opus (106/106, 10/10), Kai (209/209, 9/9), Anthropic (56/56, 28/28), Hanzo (80/80, 34/34) and a 43-page sample across makers after this round.

## 3. First impression and page narrative
- [x] Sells in 5 s, and something moves within 1 s: the name cuts in, the figures rise (done by about 0.8 s) and the Sigil drifts or the film plays
- [x] ~~`PageHero`~~ n/a: not in the kit · nothing above the h1
- [x] JS off legible (`NoScript.jsx`)
- [x] One idea per screen: hero, spec (with its drawn rates), quick start (the black room), "More from <maker>", close
- [x] Ends in Hanzo's own close ("Use <model> via Hanzo AI"), then the footer
- [x] Arrives by Morph from catalogue and sibling cards; no card leaves the site without saying so

Done here: The sibling rail holds only models that have a page here (Hanzo's own "More from" picks first, then the maker's nearest by context and output rate, 6 at most). Hanzo's other "More from" cards follow as one-line rows; those without a page here show ↗, `target="_blank" rel="noopener noreferrer"` and a hidden "(opens in a new tab)", with no Morph promise. 8 Nov: the rail cards are SPEC's card exactly (#000, 20px, 220px tall, 22px/500 title, the description at 57px from the top always shown, Zen Mono 10px pills: context and the in → out rate), tilt ±2.7° toward the pointer, flat on leave, no scale or lift.

## 4. Conversion system
- [x] `<Cta>` only: hero pair, the local nav (quiet, then solid), the close and the maker hero and close
- [x] Sticky ask: the local nav carries the hero's label (`data-thumb`); no shared Ask pill floats over any member (checked on Opus, Kai and Anthropic: the only fixed elements are the header and the cookie notice)
- [x] Copy equals the display (model ID, code, guest cURL)
- [x] `data-cta` on every primary (`model.hero`, `model.local`, `model.band`, `maker.hero`, `maker.band`)

Done here: Copy and "Copy model ID" are 44px with an ink label on white (white 78% on graphite and black); a page-level `role="status"` region says "Copied" only when the copy happened.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Figures trace to Hanzo: spec values, the shelf card's short context ("33K"), printed rates, `rates.js` as fallback
- [x] ~~Marquees~~ n/a
- [x] ~~Forms~~ n/a

Done here: Kai's Limits object draws two numbers from Hanzo's own spec line, "32,768 tokens (YaRN; trained: 1,024)": 32 cells, the first (the trained length) in ink.

## 6. Content presentation (copy untouched)
- [x] 13px floor (mono captions 12px; `SPEC.md` pills 10px)
- [x] Measures and balance
- [x] Quick start uses kit `Tabs` + `CodeBlock`; the spec is a `dl`
- [x] Parity 0 missing

Done here: A long spec (more than six facts, e.g. Kai) reads in MASTER 4.7's four groups, Identity, Limits, Price, Modalities, under Hanzo's own heading ("Shipping today"); further groups ("In development") fold behind an icon button and stay in the HTML.

## 7. Visual design system
- [x] `taste.py` passes; deck neutrals scoped on `.xmf`
- [x] Nothing above a headline
- [x] Radii 12/16/20/24, flat objects with no shadow
- [x] No icon boxes
- [x] Differs from neighbours: a launch layout with the model's own Sigil or film, not a film grid

Done here: The model name is 52px (44 or 32 for long names); the maker h1 is 52px (40px on phones) so its 64px count is the one big thing; figures 64px; section headings 26px, Kai's "Limits" included; the close 44px.

## 8. UI component library
- [x] Hover, press (.97/.995 at 90 ms), focus-visible (2px ink) on every control
- [x] Focus ring on a Tab crawl
- [x] ~~Dialogs~~ n/a
- [x] Drawn sliders (track, fill, thumb, focus, press)
- [x] Forks deleted: listed above

Done here: Shelf rows answer hover with a #f5f5f5 fill, the name easing 4px and the description replacing the rate; keyboard focus shows the same description.

## 9. Motion and interaction
- [x] Signature: the Morph arrival. Supporting: the Sigil field, the sibling field's light, the layoutId pills. 0 fade-ups.
- [x] Kinds of movement:
  - **Arrival:** the name, the figures, the spec's rate bars and Kai's reach cells drawing in.
  - **Idle:** the Sigil or the model's film, the field's light, the current dot's ring; the field's light carries on as a faint band sweeping the shelf rows and Hanzo's other "More from" rows, a light runs along the spec's rate bars, and the quick-start code waits on a caret (the screens `motion.mjs` found still now each have one).
  - **Pointer:** the Sigil leans; dots tell rates; card tilt; rows reveal their description.
  - **State:** bill sliders, picks, tabs, spec fold, shelf sort and filter.
  - **Scroll:** the hero object easing up.
- [x] Moves untouched; every control answers
- [x] Reduced motion final; no `setInterval`
- [x] Sound through the kit

Done here: No motion was removed; the shelf's tilt on full-width rows is replaced by the row fill, the name's ease and the description reveal.

## 10. Media
- [x] Hanzo's own models (Enso, Kai, Koma, Zen pages) show the model's film over its poster as the 4:5 hero object; other makers keep the Sigil
- [x] One `FilmPause` (44px, `aria-pressed`) stops the film, the Sigils and the field's CSS loops
- [x] At most two canvases per page
- [x] No dimmed image

Done here: `/models/hanzo/kai` plays `kai.webm` over `kai.webp` in the hero object, its breadcrumb in white 78%. 8 Nov: `/models/hanzo` leads its shelf with Hanzo's four filmed models (Enso, Kai, hanzo/zen, koma) as SPEC black cards, Enso spanning both rows (2fr 1fr 1fr), each film over its poster; Enso and Kai play, a hovered card takes Kai's turn (two playing at most).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 with no overlap; no horizontal scroll at 375 or 320
- [x] 44px targets; tap paths
- [x] Ask above the fold at 375×667

Done here:
- The maker shelf on phones is 72px rows (name and rate, one pill); its contour field starts below the CTA pair, so no line crosses the lede.
- 8 Nov: the phone maker field is masked to the right (radial), so no line runs behind the guest-key words; no sideways scroll at 320 on all six members checked.
- The sibling field keeps every dot inside the plot (log context, padded 18% each side, clamped 5–95%) and labels the current model.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Deck contrast
- [x] Pause control for the moving Sigils, film and loops
- [x] ~~Forms~~ n/a
- [x] One h1; h2 per section; the family row is a caption, not a second "More from" h2
- [x] Keyboard: field dots, sliders, tabs, picks, Copy, rows

Done here: Field dots of models with a page are links; the others are `role="img"` points with the same label, focusable, so nothing sends a keyboard user off the site. Gap: no axe run.

## 13. Performance and engineering
- [x] h1 and figures in server HTML
- [x] Transform and opacity only
- [x] api.hanzo.ai is asked only when a rate is in neither the page nor `rates.js`
- [x] Heavy jobs in the cloud only

Done here: No hydration mismatch on Opus, Kai, Anthropic, Enso or Google members (Playwright, 1470 and 375): the field's positions are rounded so the server's and the browser's maths print the same style.

## 14. SEO and machine files
- [x] Titles and descriptions unchanged
- [ ] ~~Canonical~~ shared owner
- [x] JsonLd unchanged
- [x] Cards are links

Done here: The breadcrumb is visible on every model page and maker shelf.

## 15. Catalogue and product pages
- [x] Sibling cards are `SPEC.md` cards (`SpecCard`, description on hover or focus)
- [x] Every rail card opens by Morph (rail = pages of this site only)
- [x] Every maker and model page is linked from /models (544/544)
- [x] One price everywhere (`money()`: under $1 to 3 places, else 2)

Done here: The spec sheet sits right under the hero with its object, the model's in and out rates drawn to one scale; the bill comparer uses Hanzo's short context ("33K") for the model.

## 16. Developer experience
- [x] Copy equals the display; the model id is in every sample
- [x] ~~Config~~ n/a
- [x] ~~Terminal~~ n/a · the maker's guest cURL is static with Copy
- [x] No hand-typed version

Done here: The chosen quick-start language persists across model pages (`localStorage` in try/catch). The quick start shows its whole sample (no inner vertical scroll), so the wheel never gets trapped in the code on its way down the page.

## 17. States and resilience
- [x] A missing rate is an em dash; spec groups fold
- [x] Blocked live data leaves a complete page
- [x] ~~Failed submit~~ n/a
- [x] The Sigil failing leaves the page

Done here: JS off: `NoScript.jsx`. Reduced motion: no drift, final states, bars and cells drawn.

## 18. Measurement and handover
- [x] `data-cta` on every primary ~~`lib/track.js`~~ not on main
- [x] Nothing before consent
- [x] `V2:` line in `ModelSheet.jsx`
- [ ] Review: waiting for a fresh critic (`docs/build-notes/review/models-family.md`)

Done here: Proof in `docs/gallery/models/family-*` and `docs/gallery/models-family/`.
