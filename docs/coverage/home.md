# / (home) coverage (PLAN-COMPONENTS areas 2.1–2.18, gate §4, brief §5.1)

Page file: `components/pages/Home.jsx`. Sections: `components/Hero.jsx`, `Models.jsx`, `Platform.jsx`, `Agents.jsx`, `Race.jsx`, `Cheaper.jsx`, `Pareto.jsx`, `Open.jsx`, `Pricing.jsx`. Styles: `components/pages/Home.css`. v2 pieces owned by Home: `components/v2/system.css`, `Lines.jsx`, `Stage.jsx`, `Chapters.jsx`. Gallery: `docs/gallery/home/`.

## Brief 5.1, line by line
- **Thesis** "One key reaches every model, for less": the h1, the lede and the argument room (speed, cost, frontier) carry it.
- **Order:**
  1. Hero.
  2. Models and Platform.
  3. Agents.
  4. Race, Cheaper and Pareto, consecutive and in one dark room.
  5. Open source.
  6. Trusted (still wall).
  7. Pricing.
  8. Backed by (still wall).
  9. Band.
- **Hero composition:**
  - Read order is the h1, then the actions, then the app.
  - The desktop app is the focal object. It starts huge under the words and settles centred, true-size and then scaled.
  - The phone sits right of the app and behind it. It slides out from behind the app as the stage settles. On phones and with reduced motion it arrives after 600 ms instead.
  - The terminal is docked as a one-line install strip under the actions.
  - The roster shows 6 rows at 14px or larger in design pixels (phone zoom 1.5).
  - Nothing in the stage is under 12px at 1470×801. One light, from top left (long soft shadows).
- **CTA:**
  - The one solid ask is Hanzo's "Try Hanzo" (header, then the site ask bar after the hero, then the band).
  - Google, GitHub and email are all outlined, so the first screen has exactly one solid fill (the header).
  - "Install CLI" is a text link.
  - The beta ribbon and "A New Pareto Frontier" are text links under the lede.
  - "Open App" and "Download App" are quiet links inside the product renders.
- **Scroll choreography:**
  - The stage settles, then the model grid rises.
  - The argument room opens like a door, holds speed, cost and frontier as one argument, then closes like a door back to white.
- **Signature:** a model card opens into its page (WebGL opener). Product names open into their pages (Morph `data-morph`).
- **Removed:**
  - The two scroll-velocity marquees, now still walls.
  - The pill and badge above the h1.
  - The sign-in panel's solid button.
  - The counter.

## The 18 areas
1. **Strategy and conversion.**
   - `Persona:`, `Goal:`, `CTA:` and `Metric:` (api_key_created) head the page file.
   - One solid ask per viewport: the header at the top, the site ask bar after the hero (the header turns to outline while the bar shows), and the band at the end.
   - Every primary and secondary carries `data-cta="home.<slot>"`.
2. **Information architecture and navigation.**
   - Hanzo's header and footer are unchanged.
   - The spine (Beyond) at the right edge is a numbered chapter index written from the page's own headings. It jumps to any chapter and marks where you are. It is hidden at 1100px and below, and on touch.
3. **First impression and page narrative.**
   - One h1 in the server HTML. Its lines cut in from a mask within the first second, and the install line starts typing at 0.9 s.
   - One idea per screen after that: the stage, tiles, pinned chapters, the agent wall and console, the dark room, figures, the walls, pricing and the band.
4. **Conversion system.**
   - Hero auth is one quiet group with the same href.
   - Install: Copy puts exactly `curl -fsSL https://hanzo.sh | sh` on the clipboard (the `$` is `user-select: none`). If the clipboard is blocked, it selects the command instead of claiming "Copied".
   - Pricing buttons are quiet and aligned on one line (subgrid).
   - Dev, Max, Ultra, Enterprise and Volume have no Hanzo destination, so their buttons are hidden, not looped to /pricing (1.3 #4).
5. **Trust and proof.**
   - Every figure is Hanzo's: 3.02×, 9.6×, 14.2×, 530×, the GPQA chart, 805,254 and the tiles. Each keeps its qualifier and source line next to it ("up to", the 95% interval, the p50 note, the Epoch and Moonshot links).
   - Trusted and Backed are still, ordered walls. Logos are grey until pointed at, then they show their own colour and name. If a logo file cannot load, its name stands in.
6. **Content presentation (copy untouched).**
   - Parity is 570/570 text and 132/132 links.
   - Detail sits behind clicks: the console tabs, the agent script disclosure, pricing tabs, the multiplier and billing choices, and chart tooltips.
   - No label sits above any heading. Mono labels are captions under their figure ("3.02×" → "faster on the same coding tasks" → "HANZO DEV VS CLAUDE CODE").
7. **Visual design system.**
   - v2 type scale (`components/v2/system.css`): display 128/80, headline 56, title 28, lede 24, body 19, mono captions 13.
   - Shared tokens from `app/system.css` (room tokens in the dark room).
   - **0 UI hues:** ink, greys and silvers only. Colour arrives only through Hanzo's media: the model films, logos, and the product screens' own markup.
   - Radius 28 on hero objects and 16 on cards, hairlines, long soft shadows.
   - One dark middle room (the argument) and a dark closing band.
8. **UI component library.**
   - Kit `A`, `More`, `Tabs`/`TabPanel` (console and pricing), `Img`/`Film` (model tiles) and `Band`.
   - v2 `Lines`, `Stage` and `Chapters`.
   - Custom controls are styled (radio groups with arrow keys, the range slider). No browser-default controls or tooltips.
   - No raw `.x-btn`.
9. **Motion and interaction.** Scroll is under half of the motion:
   - **Time:** the hero prompt types, sends and answers; the install line types; the roster steps and its speeds and bill tick; the race runs at true speed once (Replay runs it again).
   - **Pointer:**
     - The app leans toward a fine pointer, on springs.
     - The agent wall swells like a dock.
     - Tiles play their film and show their tags.
     - Logos colour in and lift.
     - The budget line drags, and chart discs give a reading.
     - The calendar swells like a lens.
     - The repo rail is thrown with inertia.
   - **State:** kit tabs glide (layoutId), the multiplier and billing pills glide, prices roll (under 300 ms, no blur), the console switches, the script disclosure opens.
   - **Arrival:** headlines cut into their lines, and the app rises.
   - **Scroll:** the stage settles, the chapters wipe, the room's doors open and close.
   - Easing is (.16,1,.3,1). Springs are 300/30.
10. **Media.**
    - Model pictures use kit `Img` (Enso has priority). Films use kit `Film`.
    - **At most two films ever play** (Enso, plus the tile you point at or focus).
    - A pause control comes before them.
    - Reduced motion and Data Saver keep the posters.
11. **Mobile and responsive.**
    - At 375 the read order is the h1, the lede, the sign-up group, then the live phone (peeking at 375×667), then the links and the install line.
    - Pinned scenes become stacked chapters below 900px.
    - The type floor is 14px, targets are at least 44px, and there is no sideways scroll at 320, 375 or 1470.
12. **Accessibility.**
    - Pause controls come first for the hero demo and the films (WCAG 2.2.2), icon-only with the register's "Pause" as aria-label and `aria-pressed`.
    - Kit tabs follow the APG pattern (arrows, Home and End). Pricing choices are radio groups with arrow keys.
    - Inactive chapters are `inert`.
    - Muted text is #6e6e73 (5:1) on white. `--faint` appears only in the dark room.
    - Reduced motion shows the settled stage, every chapter stacked, open doors and final figures.
13. **Performance and engineering.**
    - Transform, opacity and clip-path only.
    - One timer for the roster (it rests off screen and when paused). The demo waits while the hero is unseen or paused.
    - No idle loops elsewhere.
    - The canvas field from v1 is gone.
    - Films play two at a time at most.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/page.jsx`). Every word is in the server HTML, including inactive tabs, every chapter and every pricing panel.
15. **Catalogue and product pages.** Model tiles open into `/<model>` (WebGL opener, `data-card`). Product names open into `/download`, `/dev`, `/design`, `/api`, `/cli`, `/mcp`, `/agent`, `/bot` and `/team` (`data-morph`). A click on a product screen does the same.
16. **Developer experience.** The install line has an exact copy, and the console tabs offer the CLI or the agent's own sign-up script (four steps, typed, copy per step or whole).
17. **States and resilience.**
    - **JS off:** every word is legible. The hero is in plain flow with the phone as its object, every chapter is shown, the doors are open and the band reads clearly (`@media (scripting: none)`).
    - **Logos blocked:** names stand in.
    - **Clipboard blocked:** the command is selected and nothing says "Copied".
    - No console errors.
18. **Measurement and handover.**
    - `data-cta="home.*"` sits on every action.
    - The site ask bar emits `cta_click`. No analytics SDK is on the page (2.18 pending).
    - Filmed and scored in the cloud. Gallery: `docs/gallery/home/`.

## Gate §4
1. Persona, Goal, CTA and metric: yes.
2. One h1: yes. Band: yes. Kit parts for media, tabs and buttons: yes. There is no `PageHero` in the kit yet, so the page's own `Hero.jsx` is the hero.
3. Tokens: v2 plus `app/system.css`. One filled primary per viewport: yes (with one exception below). `data-cta` on actions: yes. `data-thumb`: not set, so the site ask carries the header's "Try Hanzo", which is the page's ask.
4. Copy parity 570/570, link parity 132/132. No new UI strings except aria-labels from the register ("Pause").
5. Reduced motion shows final states, and JS off is legible.
6. No horizontal scroll at 320. 1470×801 and 375×812 pass the overlap check. No Lighthouse run in this cloud box.
7. Contact sheet and film are in `docs/gallery/home/`. Review is in `docs/review/home.md`.
8. Ledger (what this page deleted):
   - Two scroll-velocity `Marquee`s.
   - The v1 halftone canvas.
   - The 3D-tilted three-device hero and its terminal window.
   - The pill and badge above the h1.
   - The solid sign-in button.
   - The coverflow.
   - Tablists without panels (pricing and console).
   - `.x-btn` in pricing.
   - The calendar's idle sweep.
   - Blur in the price roll.
   - Per-card `whileInView` entrances.
   - Nine simultaneous film autoplays.
   - The false "Copied" on the hero install.

## Known gaps (not this page's to fix)
- The closing `Band` (kit) is solid by default. On the home its button is an outline that fills on hover, because the header's "Try Hanzo" turns solid again while the band hides the ask bar. A kit option for a quiet band button would remove this override.
- The kit `Copy` (console) still shows its tick when the clipboard is blocked. That needs a kit change.
- Partner and customer logos, and the images inside the Design, Bot and Team screens, load from hanzo.ai. They are blank where hanzo.ai is unreachable (this cloud box) until the media mirror lands (2.10).
- Brief 5.1 asks for a phone about 0.45× the app's width. It is 0.37× (354 px against 960), large enough for 14px roster rows without towering over the app.
- PLAN 6.3 keeps pinned chapters as a staged test. JAMES.md (which wins on taste) asks for pinned stages, so the product chapters pin on desktop and stack on phones and for reduced motion.
