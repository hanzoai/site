# Coverage: /models/* — model pages (components/pages/models/ModelSheet.jsx, 470), maker shelves (ProviderShelf.jsx, 73) and the flagship shell (components/ModelPage.jsx, 9)

Header lines:

| | ModelSheet | ProviderShelf | ModelPage |
|---|---|---|---|
| `Persona:` | Developer picking a model | Developer comparing one lab | A visitor who opened a flagship card |
| `CTA:` | The page's first action in Hanzo's words (usually "Get API key") | "Get API Access" | The body's own first action |

All three use metric `api_key_created`.

## §5.5 brief, line by line
- **Thesis** (pick it and try it): the first screen holds the name, the three numbers and the CTA pair.
- **Order:**
  1. Name and three numbers, then the CTA pair.
  2. The maker's family switcher, where Hanzo prints one.
  3. Spec table.
  4. Quick start.
  5. Related: Hanzo's "More from <maker>", holding the sibling field, the bill comparer and the rail of siblings.
  6. Close (Band).
- **Hero object:** the model's own Sigil at 4:5 on the right, carrying its maker label and a Model ID pill with Copy. The three numbers (context window on split-flaps, In and Out per million tokens) are the largest type on the screen: up to 96px, against a name of up to 76px. Light comes from the top left. It reads fully with animations and JS off.
- **Signature:** it arrives by morph from the card. The card's name (`data-morph`) lands as the h1 (`data-morph-target`).
- **Removed:**
  - The "…" readouts (now an em dash).
  - The auto-rotating snippet. The chosen language now persists across model pages through localStorage.
  - The "No published rate" string.

## The 18 areas
- **2.1 Strategy and conversion:**
  - One solid per viewport.
  - Hero: Hanzo's first action, with `data-thumb` and `data-cta="model.hero"`. The second action is outlined.
  - The close carries Hanzo's own band action (`data-cta="model.band"`). The site Ask bar carries the hero ask after the hero, and the phone bar matches it.
- **2.2 Information architecture and navigation:**
  - A visible breadcrumb (Models / maker / id) from Hanzo's crumbs.
  - The family switcher row on Hanzo's own models.
  - "View all <maker> models" and the siblings rail. Every dot in the field links to its model.
  - Every model and maker page is linked from /models (544 of 544).
- **2.3 First impression and page narrative:**
  - The first screen sells in one look: name, one line, three figures, one ask.
  - No eyebrow over the h1: the maker label moved into the Sigil object.
  - The headings are only Hanzo's: the spec group titles, "Quick start", "More from <maker>", "Use <model> via Hanzo AI". The old invented "<model> among N siblings" and "What <model> costs at your volume" are gone.
- **2.4 Conversion system:** One filled primary per viewport. Copy model ID works from both the hero and the spec sheet.
- **2.5 Trust and proof:** Only Hanzo's figures: the printed rates, refreshed from api.hanzo.ai only when not printed. The bill is rate × volume and nothing is estimated.
- **2.6 Content presentation (copy untouched):**
  - Parity is 0 missing on all 470 model pages (run on every one) and on 72 of 73 makers.
  - `/models/enso` still renders Hanzo's captured page (39 texts were already missing on `main`; it needs its own room).
  - Long spec sets (e.g. Kai's 3 groups) show 2 groups, and the rest open with an icon button (`hidden` until then).
- **2.7 Visual design system:**
  - 0 UI hues. The "here" dot is ink with a ring, the bill bar is ink, the sliders are ink, and code is greyscale (keywords bold, strings white).
  - Colour arrives only through films on the flagship pages.
  - v2 type, 28px radii on objects and 16px on cards.
  - Gap: values are in `models.css` (no tokens.css on main).
- **2.8 UI component library:**
  - Kit `A`, `Flap`, `Copy`, `Img` (shell), plus `Sigil`. ModelFilm in the shell.
  - The volume sliders are drawn (track, fill and thumb, with focus and press) instead of the browser default.
  - Gaps:
    - Raw `<pre>` in `Codes` (no `CodeBlock` in the kit).
    - `.x-btn` (no `Cta`).
    - The close is Hanzo's band words in page markup, not kit `Band`.
- **2.9 Motion and interaction:**
  - **Arrival:** the name cuts in, and the context window spins in on split-flaps.
  - **Idle:** the Sigil drifts, and the field's light sweeps.
  - **Pointer:** the Sigil leans to the cursor, and dots answer with name, context and rates.
  - **State:** the bill's sliders and sibling picks (springs), code tabs with a layoutId pill, the spec fold.
  - **Scroll:** the Sigil object eases up as you leave the first screen. That is 1 of the 5 kinds.
  - Press is scale .98 or 1px down everywhere. `variety.py` OK.
- **2.10 Media:**
  - Model pages have no film of their own, so their picture is the Sigil (1 hero canvas, plus 1 behind the close).
  - The flagship shell: the hero still is kit `Img` (`priority`, 1200×1500) and the film is ModelFilm. At most two films play, and the next model's film waits its turn.
- **2.11 Mobile and responsive:**
  - The hero stacks with the three figures in one row. The Sigil object follows the figures, and the field turns 4:5.
  - The spec rows stack. Rails scroll-snap. Targets are 44px.
  - `phone.mjs` OK on `/models/anthropic/claude-opus-5.5`, `/models/anthropic`, `/models/hanzo/kai` and `/kai`.
- **2.12 Accessibility (WCAG 2.2 AA):**
  - One h1 and a labelled breadcrumb.
  - The figures are a `dl` with the full price as its name. Sliders announce "N million tokens a month". Tabs use arrow keys. Copy has a label.
  - The focus ring is two-tone.
  - Gaps: the field's sweep is a CSS loop with no pause; no axe run.
- **2.13 Performance and engineering:**
  - Two canvases per model page. The catalogue is fetched only when a rate is missing.
  - `motion.mjs`: layout shift 0.000 and 0 still screens.
  - Gap: no Lighthouse.
- **2.14 SEO and machine files:** Titles, descriptions and JsonLd are unchanged. Crumbs are visible.
- **2.15 Catalogue and product pages:**
  - Model header: name, lede, three numbers, the CTA pair and the id pill.
  - Same price rounding everywhere (`money()`: under $1 to 3 places, otherwise 2), the rounding Hanzo's /models already prints.
  - Related: the field, the bill and Hanzo's sibling rail.
  - The maker shelf keeps sort and modality filters.
- **2.16 Developer experience:**
  - Quick start: Copy equals the displayed code, and the model id is in every sample.
  - The language persists across pages and no longer rotates.
- **2.17 States and resilience:**
  - A missing rate shows an em dash.
  - JS off: the `NoScript` sheet resets entrance states, so every word shows.
  - Reduced motion: no flaps spinning, no Sigil drift, final states.
- **2.18 Measurement and handover:**
  - `data-cta` on the primaries.
  - Gap: no event library on main.
  - Proof is in `docs/gallery/models/`.

## §4 gate
1. Header comments: yes.
2. One h1: yes. Kit-only: partly (gaps above).
3. One primary per viewport, `data-thumb` and `data-cta`: yes.
4. Parity: yes, and no new visible strings. Control names are icon-only with an aria-label.
5. Reduced motion and JS-off: yes.
6. 375 and 1470: yes.
7. Gallery: yes.
8. Ledger: below.

## Ledger (what the template deleted)
- The auto-rotation timer in `Codes`.
- "No published rate".
- The "See the full spec" and "Show less" strings.
- Both invented section headings.
- The kicker over the h1 and over every h2.
- The raw `<img>`/`<video>` pairs in the shell.
- The coloured syntax palette.
- The vermilion accent.
- The browser-default range control look.
