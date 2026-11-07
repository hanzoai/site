# Coverage: /kata

Page: `components/pages/Kata.jsx` + `Kata.css`, on the Apps 2 kit (`components/v2/A2*`). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = get an API key. One solid ask, "Get API key" (`data-thumb`, `data-cta="kata.hero"`), again on the closing band (`kata.close`); the global ask bar carries it once the hero has gone by. Every other action is an outline or a text link.
- **2.2 IA and navigation:** header and footer untouched (shared). In-page links stay in-site through kit `A`.
- **2.3 First impression and narrative:** the loop on one line ("Test. Repair. Verify."), the word the loop is on in ink, the lede and the ask above the fold at 1470×801, and the live test board and terminal beside them. Then one idea per screen: hero → paste strip → the loop intro → the dial pinned while the four stations come in → the dark room wiped to white ("1 failed" becomes "0 failed") → capabilities as a passing report with "Will it fit my stack?" → reading rows → questions → one closing band.
- **2.4 Conversion system:** hero and closing asks only; secondaries are outlines or text links. No forms send anything.
- **2.5 Trust and proof:** Only Hanzo's figures: 12 passed · 1 failed, 13 passed · 0 failed, confidence 0.96. The diff is drawn as bars because Hanzo shows no code.
- **2.6 Content presentation:** copy untouched (parity 76/76 text, 11/11 links). No eyebrow above any headline: those labels are visually hidden and stay in the HTML for screen readers and search. Detail lives in things you open where there is a lot of it.
- **2.7 Visual design system:** white page, ink, greys and silvers only (0 UI hues; `scripts/taste.py` passes). One dark room: the wipe (dark to white). Radii 28 on hero objects, 16 on cards; hairlines and long soft shadows.
- **2.8 UI component library:** kit `A`, `Go`, `More`, `Copy`; Apps 2 kit `A2Lines`, `A2Paste` and, where used, `A2Chapters`, `A2Sheet`, `A2Faq`. Buttons press to .98 (shared `.x-btn`); targets 44px or more on touch.
- **2.9 Motion and interaction:** signature = the headline is the loop (time). Supporting: the dial (scroll), the wipe (scroll), the self-drawing ticks (arrival), the fit picker (state). Scroll is under half. `scripts/variety.py` passes.
- **2.10 Media:** No images; terminal, board and dial are drawn.
- **2.11 Mobile and responsive:** designed at 375: the h1 flows into three or four lines, pinned scenes become a plain vertical story or a swipe rail, no sideways scroll.
- **2.12 Accessibility:** one h1; an h2 per section; tabs, switches and accordions carry their aria states; decorative art is `aria-hidden`; visible focus.
- **2.13 Performance:** transform and opacity (and clip-path for one wipe) only; loops stop off screen; typing writes to text nodes, not React state per character; no layout shift measured.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all text in the server HTML.
- **2.15 Catalogue and product pages:** Not a catalogue. The documentation rows preview where each goes on hover.
- **2.16 Developer experience:** Copy on the agent prompt; Replay on the terminal.
- **2.17 States and resilience:** The fit check has its own empty line; passing is ink and failing a hollow ring (shape, not colour). Reduced motion shows final states; with JavaScript off a `noscript` rule shows every masked line and anything that starts hidden. No live API calls.
- **2.18 Measurement and handover:** `data-cta` on the hero and closing primaries; Persona, Goal, CTA and Metric lines in the page header; no analytics wired yet (the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1 in server HTML; a closing ask; page-owned hero and buttons until a shared `PageHero` lands. ◐
3. Greys only; one filled primary per screen; `data-thumb` and `data-cta`. ✔
4. Parity 0 missing (76/76 text, 11/11 links). ✔
5. Reduced motion final states; JavaScript off legible; keyboard paths for every control. ✔
6. 375×812 and 1470×801 checked, no sideways scroll; Lighthouse not run (no CI yet). ◐
7. Film and phone shots in `docs/gallery/kata/`. ✔
8. Ledger (removed): green as the theme and red as decoration; the eyebrows; a four-line 128px hero that pushed the ask off screen; a second solid in the FAQ; the plain link list.
