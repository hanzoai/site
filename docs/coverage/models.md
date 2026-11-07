# Coverage: /models — components/pages/ModelsPage.jsx (also served at /models/stealth)

Header: `Persona:` Developer choosing a model (and the buyer comparing labs) · `Goal:` find the model, open its page · `CTA:` "Get API key" · metric `api_key_created`. `Signature:` the wall that opens · `Beyond:` every model reachable.

## §5.4 brief, line by line
- **Thesis** (every model has a page, and the page opens from the card): every card is a real `<a href>`. Catalogue cards morph their name into the model page's h1 (`data-morph` → `data-morph-target`). The nine flagship films open through the WebGL opener (`data-card`), and Close flies back into the card.
- **Order:** editorial families (the wall, Three families, Enso vs Zen, Kai's figures), then maker shelves (the catalogue: Enso, Zen, Kai, Creative, Other labs), then the collapsed link list of every model and maker (reachability).
- **Hero object:** the model grid. All nine flagship films are on the first screen at 1470×801, 9 of them fully visible (≥6 required). A light moves through them by itself, and the lit one plays its film.
- **Signature:** a card opens into the model page.
- **Removed:**
  - Per-item `whileInView` on cards (one list-level entrance per family group).
  - The compare tray (deferred in §7).
  - The auto-rotating quick start.
  - The second solid in the Try panel.
  - The vermilion accent.

## The 18 areas
- **2.1 Strategy and conversion:**
  - One solid ask per viewport, in Hanzo's words: "Get API key" in the hero (`data-thumb`, `data-cta="models.hero"`). "Every model" is a text link.
  - The Try section's own solid is "Get free API key" (`data-cta="models.try"`). "Sign up for free" in the composer is now outlined.
  - The site Ask bar carries the hero ask after the hero, and the phone bar reads "Get API key".
  - Gap: `lib/cta.js` is not on main, so labels are not checked against a table.
- **2.2 Information architecture and navigation:**
  - Hanzo's header and footer are unchanged.
  - The hero link goes to `#families`. Chips filter the catalogue and scroll its top back under the header.
  - "Every model" (a native `<details>`) links all 470 model pages and all 74 maker pages (the 73 makers plus `/models/stealth`). Checked: 544 of 544 `/models/*` routes in the server HTML. Find-in-page opens it.
- **2.3 First impression and page narrative:**
  - First screen: the h1 "Frontier AI families" (no eyebrow), the lede, one ask, and the wall of nine films with "Models" and the pause control under it.
  - Then one idea per screen: the fly-in to Enso, Three families (pinned, one dark room), Enso vs Zen, Kai's figures, the catalogue, every model, prices, Try, the first request, Related.
- **2.4 Conversion system:**
  - One filled primary per viewport inside `main`.
  - The header's own "Try Hanzo" turns outline while the Ask bar is on (shared Ask.jsx).
  - Gap: no risk-reducer line (Hanzo has none on this page).
- **2.5 Trust and proof:**
  - Only Hanzo's figures: 11 suites, 84.4% against 76.6%, 100.0% against 44.2% (Kai vs Jev), and the price list as Hanzo prints it.
  - No logos and no seals.
- **2.6 Content presentation (copy untouched):**
  - Parity on /models and /models/stealth: text 305/305, links 58/58.
  - Eyebrows moved below their headlines ("Three families", "Enso vs Zen", "Decision Benchmarks", "Priced"). "Models" sits beside the pause under the wall.
  - The price list folds to 10 rows. The rest stays in the HTML (`hidden`) and opens with an icon button.
  - On phones the price list becomes 72px rows, with no table scroll.
- **2.7 Visual design system:**
  - 0 UI hues: ink, greys and white only. Colour arrives only through the films (Kai plays blue, for example).
  - v2 type: display 128 (56 on phone), headline 56 (36), lede 24, body 19, Zen Mono 13 for figures and labels.
  - Radii are 28px on objects and 16px on cards; 12 columns at a max of 1392px.
  - Gap: no `tokens.css` on main, so the values sit in the page CSS.
- **2.8 UI component library:**
  - Kit `A`, `Copy` and `Count`, plus `Sigil`.
  - New shared piece `components/v2/ModelFilm.jsx` (with `FilmPause` and `usePaused`).
  - Gaps:
    - Raw `<table>` (no `DataTable` in the kit) and raw `<pre>` (no `CodeBlock`).
    - `.x-btn` (no `Cta`).
    - The closing is not kit `Band`.
    - ModelFilm holds a `<video>` because kit `Film` has no `play` prop and no page budget. **Request to the kit owner:** add `play` and a two-film budget to `Film`, then ModelFilm becomes a thin wrapper.
- **2.9 Motion and interaction:**
  - **Signature (state and scroll):** the wall flies into Enso; cards open into pages.
  - **Idle:** the lit film plays and the light moves on every 2.6s; the request card switches models by itself; the Sigil drifts behind Related.
  - **Pointer:** hovering a film tile or an Enso/Zen column plays that film; the Sigil leans to the cursor.
  - **State:** chips re-flow with a layoutId pill (spring 300/30), tabs, the fold, the disclosure.
  - **Arrival:** the h1 cuts in, and the figures count up once.
  - **Scroll:** the fly-in and the pinned families. That is 2 of the 6 kinds.
  - `variety.py`: 4 techniques, 0 fade-ups.
  - Press is scale .98 or 1px down on every control. Hover is in `@media (hover:hover)`.
- **2.10 Media:**
  - ModelFilm has the poster at once, loads nothing until the film is near the screen, plays only on screen with the tab visible, and never under reduced motion or Data Saver.
  - **At most 2 films play on the page** (a shared budget).
  - Gaps: no AVIF or H.264 variants; the posters are Hanzo's 1200×1500 WebP.
- **2.11 Mobile and responsive:**
  - The wall becomes a swipe rail (Enso first) and the families stack. Chips and lenses scroll in their own rows, and the price list becomes rows.
  - Targets are 44px. No sideways scroll at 375 (checked by `phone.mjs`).
- **2.12 Accessibility (WCAG 2.2 AA):**
  - One h1. Real buttons with `aria-pressed` and `aria-expanded`. Tabs with arrow keys.
  - A pause for everything that moves by itself (WCAG 2.2.2): films, the moving light, the self-switching request.
  - The request's live region speaks only after a person picks a model.
  - Focus ring: 2px ink with a white halo (white with an ink halo in dark parts).
  - Gaps: the CSS loops (live dot, caret) are not tied to the pause; no axe run.
- **2.13 Performance and engineering:**
  - Transform and opacity only. Two films at most. Wall tiles are laid out large and scaled down (always drawn smaller than laid out). Live rates are fetched once, near the catalogue.
  - `motion.mjs`: 60 fps median (headless) and layout shift 0.030.
  - Gap: no Lighthouse or `budgets.json`.
- **2.14 SEO and machine files:**
  - Title, description and JsonLd are unchanged.
  - The server HTML now holds a real link to every model and maker page (reachability for crawlers and agents).
- **2.15 Catalogue and product pages:**
  - Reachability: 544 of 544.
  - Every card is one tab stop, opens into its page, and shows Hanzo's rate.
  - Group heads pin beside their cards. Chips show true counts.
  - The phone catalogue uses rows, not a table.
  - Deferred per §7: the compare tray (removed), facets, maker chip rail.
- **2.16 Developer experience:**
  - "Your first request" in cURL, Python, TypeScript and Go. Copy equals the displayed code.
  - "Try any model" shows the real request shape with the model string swapping.
- **2.17 States and resilience:**
  - JS off: a `<noscript>` sheet (`components/pages/models/NoScript.jsx`) shows every entrance at its final state and lays the pinned scenes flat.
  - Reduced motion: final states, no pin, no autoplay.
  - Live rates fall back to the printed ones when api.hanzo.ai is unreachable (as in the cloud sandbox).
- **2.18 Measurement and handover:**
  - `data-cta` on both primaries.
  - Gap: no `lib/track.js` on main, so no events fire.
  - Proof films and stills are in `docs/gallery/models/`.

## §4 gate
1. Header comments: yes.
2. One h1: yes. `PageHero`/`Band`/kit-only: no (gaps above).
3. One filled primary per viewport: yes. `data-thumb` and `data-cta`: yes. Tokens: page CSS (no tokens.css yet).
4. Parity 0 missing, and no new visible strings. Control names are icon-only with an aria-label ("Pause", "Play", "Show all (27)") until James approves the register.
5. Reduced motion and JS-off: yes.
6. 375 and 1470 pass. 320 not separately checked.
7. Contact sheet: `docs/gallery/models/`.
8. Ledger: below.

## Ledger (what this page deleted)
- The compare tray (Tray, its buttons and CSS).
- The page's own img+video `Film` (now ModelFilm).
- The rounded-panel entry clip on the dark room.
- The vermilion accent and every hue.
- The "Show all N / Show fewer" visible strings.
- The duplicate page ask bar (the site Ask bar does it).
- The kicker above the h1.
