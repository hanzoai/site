# Coverage: /mcp

Page: `components/pages/McpPage.jsx` + `McpPage.css`, on the Apps 2 kit (`components/v2/A2*`). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = add Hanzo MCP to a client. One solid ask, "Browse 260+ tools" (`data-thumb`, `data-cta="mcp.hero"`), and "Browse All Tools" in the close (`mcp.close`); the global ask bar carries it once the hero has gone by. Every other action is an outline or a text link.
- **2.2 IA and navigation:** header and footer untouched (shared). In-page links stay in-site through kit `A`.
- **2.3 First impression and narrative:** h1 at display size, the lede, one solid and two outlines, and the live tool-call stream beside them; fits 1470×801; four lines on a 375 phone. Then one idea per screen: hero → 38 + 1,538 + 260+ as figures → the runtime as three stacking sheets → paste strip → the six domains on a drag rail, each opening into its sheet → the dark room (.mcp.json and bash) → add to your client.
- **2.4 Conversion system:** hero and closing asks only; secondaries are outlines or text links. No forms send anything.
- **2.5 Trust and proof:** Hanzo's figures only: 38, 1,538, 260+, 117, 34 regions, 2ms, 6.4ms, 8 stars.
- **2.6 Content presentation:** copy untouched (parity 72/72 text, 5/5 links). No eyebrow above any headline: those labels are visually hidden and stay in the HTML for screen readers and search. Detail lives in things you open where there is a lot of it.
- **2.7 Visual design system:** white page, ink, greys and silvers only (0 UI hues; `scripts/taste.py` passes). One dark room: the config. Radii 28 on hero objects, 16 on cards; hairlines and long soft shadows.
- **2.8 UI component library:** kit `A`, `Go`, `More`, `Copy`; Apps 2 kit `A2Lines`, `A2Paste` and, where used, `A2Chapters`, `A2Sheet`, `A2Faq`. Buttons press to .98 (shared `.x-btn`); targets 44px or more on touch.
- **2.9 Motion and interaction:** signature = cards that open (state). Supporting: the live stream (time), the count-up (arrival), the stacking sheets (scroll), the drag rail (pointer). Scroll is under half. `scripts/variety.py` passes.
- **2.10 Media:** No images; the stream and the sheet art are drawn.
- **2.11 Mobile and responsive:** designed at 375: the h1 flows into three or four lines, pinned scenes become a plain vertical story or a swipe rail, no sideways scroll.
- **2.12 Accessibility:** one h1; an h2 per section; tabs, switches and accordions carry their aria states; decorative art is `aria-hidden`; visible focus.
- **2.13 Performance:** transform and opacity (and clip-path for one wipe) only; loops stop off screen; typing writes to text nodes, not React state per character; no layout shift measured.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all text in the server HTML.
- **2.15 Catalogue and product pages:** Each domain card grows into its own sheet (shared-element morph); Esc and the scrim close it and focus returns to the card.
- **2.16 Developer experience:** .mcp.json copies as valid JSON; the bash block copies its own lines; Hanzo's block stays whole in the page for search.
- **2.17 States and resilience:** Reduced motion stills the stream on its last frame. Reduced motion shows final states; with JavaScript off a `noscript` rule shows every masked line and anything that starts hidden. No live API calls.
- **2.18 Measurement and handover:** `data-cta` on the hero and closing primaries; Persona, Goal, CTA and Metric lines in the page header; no analytics wired yet (the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1 in server HTML; a closing ask; page-owned hero and buttons until a shared `PageHero` lands. ◐
3. Greys only; one filled primary per screen; `data-thumb` and `data-cta`. ✔
4. Parity 0 missing (72/72 text, 5/5 links). ✔
5. Reduced motion final states; JavaScript off legible; keyboard paths for every control. ✔
6. 375×812 and 1470×801 checked, no sideways scroll; Lighthouse not run (no CI yet). ◐
7. Film and phone shots in `docs/gallery/mcp/`. ✔
8. Ledger (removed): orange buttons, figures and plus signs; the eyebrows; one config block that did not copy as JSON; the seven-line phone hero; the blank gaps; two solids in the close.
