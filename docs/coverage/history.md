# Coverage: /history

Page: `components/pages/History.jsx` + `History.css` + `story.css` (page-owned Story grammar) + `historyData.js`. Signature: the timeline scrub (one pinned scene; the year is cut into its line, the old year clearing before the new one arrives, as each year's story comes in and the last goes out). One line per area of docs/PLAN-COMPONENTS.md §2, then the §4 gate.

- **2.1 Strategy and conversion:** goal = see twelve years of shipped work and trust it, then talk to Hanzo FDE. One solid ask per screen: "Explore Our History" in the hero (`data-cta="history.hero"`), and "Talk to Hanzo FDE" (`data-thumb`, `data-cta="history.band"`) in the closing Band and in the global ask bar, named "History", once the hero has gone by. Everything else is a text link.
- **2.2 IA and navigation:** header and footer untouched. "About Hanzo" and "Return to About Hanzo" link the Story pages; the 13-year rail jumps to any year.
- **2.3 First impression and narrative:** screen one: the h1 at display size (cut into its lines) with the lede and one ask under it; beside it the hero's object, a giant year that runs from 2014 to 2026 by itself while the four eras' bars fill in turn (each era's dates after its title). All of it fits 1470×801. Then: clippings, the year-by-year scene, Your year, the principles, and the FDE Band (with its four steps and the way back to /about).
- **2.4 Conversion system:** hero ask, ask bar, Band ask; no second solid button anywhere. No forms.
- **2.5 Trust and proof:** every figure is Hanzo's (year metrics, clippings); each clipping keeps its press source link (TechCrunch, Crunchbase News, Nasdaq, Startland News, hanzo.blog).
- **2.6 Content presentation:** copy untouched (parity 214/214 text, 42/42 links). No eyebrow above any headline: labels sit beside headlines (Track record, Full History) or after them (Your year, Operating Principles). One year on screen at a time; all 13 stay in the HTML.
- **2.7 Visual design system:** white page, ink, greys and silvers only (the gold accent is gone). Colour comes only from the customers' own photos and logos and the Zen film. The dark room is the closing Band. Radii 28 on plates, 16 on clippings.
- **2.8 UI component library:** kit `A`, `Img`, `Film`, `StoryClose`; year rail buttons with `aria-current`; the year input has −/+ buttons (56px) and a numeric keyboard.
- **2.9 Motion and interaction:** signature = the scroll scrub (the year cut into its line, the old year clearing before the new one, one story in, one out). Supporting: the hero's years running by themselves (time, idle), the clippings rail you throw (pointer, drag with inertia, one nudge on arrival), "Your year" cutting its year in (state). Also: principles' giant numerals lift on hover. The odometer digits and the split-flap board are gone (no invented digits ever show). Scroll-linked motion is the minority. Variety: 2 techniques, 0 fade-ups.
- **2.10 Media:** customer photos and logos via kit `Img` with sizes; the 2026 Zen film via kit `Film`, rendered only while that year is on stage. Plates fall back to the year's own figure when an image cannot load.
- **2.11 Mobile and responsive:** at 375 the hero stacks (h1, ask, the giant year, the eras), the clippings swipe natively with snap, and the 13 years become a swipe rail, one year per card with the next one peeking (no pinning; the page is half its old length). Links are 44px tall. No sideways scroll.
- **2.12 Accessibility:** one h1; years are `article`s labelled by their titles; inactive years are `inert`; the rail marks the current year; decorative year cut `aria-hidden`; keyboard focus slides a clipping into view.
- **2.13 Performance:** transform and opacity only; the scrub sets state only when the year changes; the film loads only on its year; CLS 0 measured on the v2 build.
- **2.14 SEO and machine files:** metadata and JsonLd unchanged; all 13 years in server HTML.
- **2.15 Catalogue and product pages:** not a catalogue; case-study links go to /customers anchors.
- **2.16 Developer experience:** not a developer page; GitHub links kept.
- **2.17 States and resilience:** image failure shows the figure; reduced motion shows final states (bars full, no playhead, no nudge); JavaScript off: a `noscript` rule shows every line and stacks the 13 years.
- **2.18 Measurement and handover:** `data-cta` on the hero primary; no analytics wired yet (needs the conductor's event layer).

## §4 gate
1. Persona, Goal, CTA and Metric lines in the page file header. ✔
2. One h1; the closing Band is `StoryClose` (kit Band's room and markup, line cut instead of word blur); kit `Img` and `Film` (no raw `<img>`, `<video>`, `<table>`). No shared `PageHero` or `Cta` exists yet, so the hero and buttons are page-owned. ◐
3. Greys only; one filled primary per screen; `data-thumb`, `data-cta`. The header's "Try Hanzo" is solid in the hero (shared chrome). ◐
4. Parity 0 missing, links 0 unexpected, no new strings. ✔
5. Reduced motion final states; JS off legible; keyboard paths for the rail, year input and clippings. ✔
6. 375×812 and 1470×801 pass, no sideways scroll. Lighthouse not run (no CI yet). ◐
7. Contact sheet and film in `docs/gallery/history/`. ✔
8. Ledger (deleted): the badge above the h1; kickers above headlines, the pill above each year's title and the tag above each metric (now after them); the gold accent; the odometer digits and the split-flap board; three equal buttons in the hero; the hero's text-only era strip (now the running year); the separate dark FDE room and the separate back-link section (now inside the closing Band); raw `<img>`/`<video>` on the plates. The closing Band is `StoryClose` (the kit Band's room with a line cut instead of the kit's word blur).
