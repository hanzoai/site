# Coverage: /ide

Page: `components/pages/IdePage.jsx` + `IdePage.css`, on the Apps 2 kit (`components/v2/A2*`). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = open the IDE. One solid ask, "Open the IDE" (ide.hanzo.ai, `data-thumb`, `data-cta="ide.hero"`), again in the close (`ide.close`); the global ask bar carries it once the hero has gone by. Every other action is an outline or a text link.
- **2.2 IA and navigation:** header and footer untouched (shared). In-page links stay in-site through kit `A`.
- **2.3 First impression and narrative:** h1 in two lines at display size, the lede with the ask beside it, and the live editor starting just under the buttons (never over them), inside the screen at 1470×801; it rises and settles as you scroll. Then one idea per screen: stage → paste strip → the workbench lifting off its Rust engine → three pinned chapters (memory, call graph, sandbox) → "Tell it something" → the dark room (memory tiers, capabilities open one at a time) → the start script typing itself → the close, with CLI, Playground and Desktop as cards.
- **2.4 Conversion system:** hero and closing asks only; secondaries are outlines or text links. No forms send anything.
- **2.5 Trust and proof:** No figures. Apache 2.0, GitHub and Open VSX as Hanzo states them.
- **2.6 Content presentation:** copy untouched (parity 75/75 text, 10/10 links). No eyebrow above any headline: those labels are visually hidden and stay in the HTML for screen readers and search. Detail lives in things you open where there is a lot of it.
- **2.7 Visual design system:** white page, ink, greys and silvers only (0 UI hues; `scripts/taste.py` passes). One dark room: the capabilities with the three memory tiers. Radii 28 on hero objects, 16 on cards; hairlines and long soft shadows.
- **2.8 UI component library:** kit `A`, `Go`, `More`, `Copy`; Apps 2 kit `A2Lines`, `A2Paste` and, where used, `A2Chapters`, `A2Sheet`, `A2Faq`. Buttons press to .98 (shared `.x-btn`); targets 44px or more on touch.
- **2.9 Motion and interaction:** signature = the editor that remembers (time: cursor walks real lines, memories spring into the gutter, the agent session runs) inside the Stage settle (scroll). Supporting: the exploded planes (scroll), pinned chapters (scroll), Tell it something (state), the typed script (time), the tier motes (idle). Scroll is under half. `scripts/variety.py` passes.
- **2.10 Media:** No images: the product is drawn in the DOM, and the editor shows real text (Hanzo's own start script from this page).
- **2.11 Mobile and responsive:** designed at 375: the h1 flows into three or four lines, pinned scenes become a plain vertical story or a swipe rail, no sideways scroll.
- **2.12 Accessibility:** one h1; an h2 per section; tabs, switches and accordions carry their aria states; decorative art is `aria-hidden`; visible focus.
- **2.13 Performance:** transform and opacity (and clip-path for one wipe) only; loops stop off screen; typing writes to text nodes, not React state per character; no layout shift measured.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all text in the server HTML.
- **2.15 Catalogue and product pages:** CLI, Playground and Desktop are big cards that Morph flies into their pages (synchronized.studio).
- **2.16 Developer experience:** Copy on the agent prompt and the bash script; the script types itself once on screen.
- **2.17 States and resilience:** "Tell it something" has its own empty state ("Nothing yet."). Reduced motion shows final states; with JavaScript off a `noscript` rule shows every masked line and anything that starts hidden. No live API calls.
- **2.18 Measurement and handover:** `data-cta` on the hero and closing primaries; Persona, Goal, CTA and Metric lines in the page header; no analytics wired yet (the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1 in server HTML; a closing ask; page-owned hero and buttons until a shared `PageHero` lands. ◐
3. Greys only; one filled primary per screen; `data-thumb` and `data-cta`. ✔
4. Parity 0 missing (75/75 text, 10/10 links). ✔
5. Reduced motion final states; JavaScript off legible; keyboard paths for every control. ✔
6. 375×812 and 1470×801 checked, no sideways scroll; Lighthouse not run (no CI yet). ◐
7. Film and phone shots in `docs/gallery/ide/`. ✔
8. Ledger (removed): grey code bars (now real text); the eyebrows; indigo, orange, blue and green; two solids in the close; the 18px tap target; the hero object over the buttons at 1470×801.
