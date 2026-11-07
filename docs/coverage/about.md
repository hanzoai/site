# Coverage: /about

Page: `components/pages/About.jsx` + `About.css` + `story.css` (Story grammar, page-owned). Signature: six "why we build" tiles that open into their own sheet (shared-element morph). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = believe the team and its record, then start building. One solid ask, "Get Started" (/pricing, `data-thumb`, `data-cta="about.hero"`), repeated after the track record (`about.record`); the global ask bar carries it once the hero has gone by (named "About"). Every other action is a text link with a chevron, never a second solid button.
- **2.2 IA and navigation:** header and footer untouched (shared). In-page links stay in-site through `A`; "Our History" and "Read Our Full History" link the Story pages together.
- **2.3 First impression and narrative:** screen one is the h1 at display size (cut into its lines on arrival), the lede beside its short last line, one ask, and the frontier full-bleed below. All of it fits 1470×801. Then one idea per screen: statement and switches, six tiles (360px, radar at two thirds of the tile), three figures, two founders, the Zen index, the dark room (one pane at a time in tabs beside the live commit log), models and papers, the roles, the closing Band. The page is shorter by the empty gap after the tiles and the second pane.
- **2.4 Conversion system:** hero, after-proof and Band asks; the Band repeats the careers ask with Hanzo's words ("Explore Open Roles"), and its two secondaries are text links. No forms.
- **2.5 Trust and proof:** every figure is Hanzo's (100+, $1B+, 2024, 1700+); commits link to GitHub; papers link to papers.hanzo.ai and hanzo.blog. The frontier carries no values on its vertical axis (it is drawn, not plotted), and the page adds no strings of its own.
- **2.6 Content presentation:** copy untouched (parity 167/167 text, 36/36 links). No eyebrow above any headline: each section's label sits beside its headline in the margin column (after it on phones). Pillar detail lives in the sheet; the full text stays in the HTML (hidden copies).
- **2.7 Visual design system:** white page, ink, greys and silvers only (0 UI hues; no italic accent words). Colour arrives only through Hanzo's Kai, Zen and Enso art. One dark middle room (Open source and safety) and the dark closing Band. Radii 28 on hero objects and tiles, 16 on cards.
- **2.8 UI component library:** kit `A`, `Img`, `Tabs`/`TabPanel` (the dark room's two panes), `StoryClose`; `v2/Unfold` for the sheet (focus in, trapped and back, Esc, arrow keys, scroll held); switches are `role="switch"` buttons; 44px+ targets (socials, commit links).
- **2.9 Motion and interaction:** signature = tile to sheet (state). Supporting: the frontier draws itself (time) and reads the year under the pointer (pointer); the 100+ figure counts up once (scroll); the commits land once with a live dot (scroll, idle). Also: tiles cue one line at a time while idle, the next switch to keep breathes until touched, the Zen plate turns by itself and follows the hand (the old principle leaves before the new one arrives), the dark room's tabs glide, a role lights its track on hover. Scroll-linked motion is the minority. Variety check: 4 techniques, 0 fade-ups.
- **2.10 Media:** Hanzo's own model art (Kai, Zen, Enso) via kit `Img` with sizes; the cards lift into the model page with the WebGL opener; Hanzo Engine has no art, so its plate is a Sigil field. Founders' portraits via `Img` with a designed monogram fallback when the image cannot load.
- **2.11 Mobile and responsive:** designed at 375: display 56px h1, stacked hero, curve full width without labels, switches two by two, tiles stacked, sheet rises from the bottom, figures stacked, Zen as a plain list. No sideways scroll at 375.
- **2.12 Accessibility:** one h1; h2 per section; the sheet is a labelled `role="dialog"` with focus return; tiles carry `aria-haspopup`; decorative SVGs `aria-hidden`; the curve has an accessible name.
- **2.13 Performance:** transform and opacity only; the curve's loop stops off screen; the pointer cursor writes motion values, not React state per frame (state only when the year changes); CLS 0 measured on the v2 build.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all text in server HTML.
- **2.15 Catalogue and product pages:** the four model and runtime cards open into their pages (WebGL opener; synchronized.studio).
- **2.16 Developer experience:** not a developer page; commit hashes and repo names are real links.
- **2.17 States and resilience:** portrait fallback when an image fails; reduced motion shows final states (curve drawn, no pulses, no auto-turn); JavaScript off: a `noscript` rule shows every line and the curve.
- **2.18 Measurement and handover:** `data-cta` on the two primaries; no analytics wired yet (needs the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1 in server HTML; the closing Band is `StoryClose` (kit Band's room and markup, line cut instead of the kit's word blur); kit `Img` (no raw `<img>`, `<video>`, `<table>`). There is no shared `PageHero` or `Cta` yet, so the hero and buttons are page-owned (`v2s-btn`), to be swapped when the kit lands. ◐
3. Greys only; one filled primary per page section; `data-thumb` and `data-cta`. The header's own "Try Hanzo" is solid in the hero (shared chrome; the ask system outlines it after the hero). ◐
4. Parity 0 missing, links 0 unexpected, no new strings. ✔
5. Reduced motion final states; JS off legible; keyboard paths for the sheet, switches, Zen index and roles. ✔
6. 375×812 and 1470×801 pass, no sideways scroll; CLS 0. Lighthouse not run (no CI yet). ◐
7. Contact sheet and film in `docs/gallery/about/`. ✔
8. Ledger (deleted): the badge above the h1; every kicker above a headline; the ultramarine accent and the green status dot; the italic accent words; three equal buttons in three places (now one solid plus text links); raw `<img>`/`<video>` on the model cards and portraits; the hover-only films; the second pane of the dark room shown at once (now tabs); "Illustration, not data" and "2 of 4 kept" (strings the page had added); the kicker above each model card's name; the page no longer uses `components/v2/Story.css` (its owner may delete it).
