# Coverage: /operator

Page: `components/pages/Operator.jsx` + `Operator.css`, on the Apps 2 kit (`components/v2/A2*`). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = install the operator. One solid ask, "View on GitHub" (`data-thumb`, `data-cta="operator.hero"`), and "Deploy to Cloud" in the close (`operator.close`); the global ask bar carries it once the hero has gone by. Every other action is an outline or a text link.
- **2.2 IA and navigation:** header and footer untouched (shared). In-page links stay in-site through kit `A`.
- **2.3 First impression and narrative:** the dark control room: the name, the lede and the ask, with the live cluster board beside them; fits 1470×801. Then one idea per screen: hero board → thirty loose objects becoming one declared Kind → the six points on a track your scroll drives sideways → paste strip → get.
- **2.4 Conversion system:** hero and closing asks only; secondaries are outlines or text links. No forms send anything.
- **2.5 Trust and proof:** No figures beyond Hanzo's words ("thirty objects") and the Kinds it names.
- **2.6 Content presentation:** copy untouched (parity 29/29 text, 2/2 links). No eyebrow above any headline: those labels are visually hidden and stay in the HTML for screen readers and search. Detail lives in things you open where there is a lot of it.
- **2.7 Visual design system:** white page, ink, greys and silvers only (0 UI hues; `scripts/taste.py` passes). One dark room: the hero. Radii 28 on hero objects, 16 on cards; hairlines and long soft shadows.
- **2.8 UI component library:** kit `A`, `Go`, `More`, `Copy`; Apps 2 kit `A2Lines`, `A2Paste` and, where used, `A2Chapters`, `A2Sheet`, `A2Faq`. Buttons press to .98 (shared `.x-btn`); targets 44px or more on touch.
- **2.9 Motion and interaction:** signature = drift, reverted, said out loud (time, with drag by hand). Supporting: the converge (scroll), the horizontal track (scroll), the log lines (time). Scroll is under half. `scripts/variety.py` passes.
- **2.10 Media:** No images; the board is drawn.
- **2.11 Mobile and responsive:** designed at 375: the h1 flows into three or four lines, pinned scenes become a plain vertical story or a swipe rail, no sideways scroll.
- **2.12 Accessibility:** one h1; an h2 per section; tabs, switches and accordions carry their aria states; decorative art is `aria-hidden`; visible focus.
- **2.13 Performance:** transform and opacity (and clip-path for one wipe) only; loops stop off screen; typing writes to text nodes, not React state per character; no layout shift measured.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all text in the server HTML.
- **2.15 Catalogue and product pages:** Not a catalogue.
- **2.16 Developer experience:** Drag or press any Kind to drift it; the next sweep reverts it and the log says so.
- **2.17 States and resilience:** The log has a first line before any sweep ("operator up"). Reduced motion shows final states; with JavaScript off a `noscript` rule shows every masked line and anything that starts hidden. No live API calls.
- **2.18 Measurement and handover:** `data-cta` on the hero and closing primaries; Persona, Goal, CTA and Metric lines in the page header; no analytics wired yet (the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1 in server HTML; a closing ask; page-owned hero and buttons until a shared `PageHero` lands. ◐
3. Greys only; one filled primary per screen; `data-thumb` and `data-cta`. ✔
4. Parity 0 missing (29/29 text, 2/2 links). ✔
5. Reduced motion final states; JavaScript off legible; keyboard paths for every control. ✔
6. 375×812 and 1470×801 checked, no sideways scroll; Lighthouse not run (no CI yet). ◐
7. Film and phone shots in `docs/gallery/operator/`. ✔
8. Ledger (removed): the teal accent; the eyebrows; a derived count ("10 Kinds") that is not Hanzo's.
