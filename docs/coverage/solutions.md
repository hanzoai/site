# /solutions coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/solutions/SolutionsIndex.jsx` + `SolutionsIndex.css` (the family keeps `solutions.css` and `Solution.jsx`, untouched) · route: `app/solutions/page.jsx` · gallery: `docs/gallery/solutions/`

1. **Strategy and conversion.**
   - Persona: a team lead or buyer in the Evaluate journey. Goal: find their solution, then try Hanzo.
   - The ask, in Hanzo's words, is "Try Hanzo" (/signup): solid, `data-cta="solutions.hero"`, metric `signup_start`. "Contact sales" stays beside it as a quiet outline (`solutions.sales`).
   - "Explore the reserved tier" is the dark room's single ask (`solutions.reserved`).
2. **Information architecture and navigation.**
   - Header and footer are unchanged.
   - Order: headline and ask with the reel, then the film wall by Teams, Industries and Use cases, then the reserved tier.
   - All 20 live links are present: the 17 solutions, reserved, /signup and /contact-sales.
3. **First impression and page narrative.**
   - At 1470×801: three-line h1 (line-mask cut-in, line height 0.94), lede, both asks, and the reel on the right already playing a model film. All of it sits above the fold.
   - At 375×812: h1, lede and both asks, with the reel starting below.
   - No kicker over the h1: "Solutions" now names the hero section (`aria-label`) and the ask bar (`data-ask-name`).
   - The page ends in the dark reserved room.
4. **Conversion system.**
   - `data-thumb="Try Hanzo"` on the hero ask drives the shared ask bar at every width.
   - One solid button per viewport: the hero's ink pill, or the white pill in the dark room.
   - The group words are toggles, not buttons that look solid. The invented "All" chip is gone: pressing the active group again shows every solution.
5. **Trust and proof.** No figures are added. The reel's counter ("01 / 07") is the live page's own. Each tile's jobs are Hanzo's sentences from that solution's page.
6. **Content presentation (copy untouched).**
   - Parity: text 47/47, links 20/20.
   - No new visible words. The tile's open arrow is an icon, and the reel's pause control is an icon with an aria-label ("Pause", "Play").
   - The repeated group label on every tile is gone (it sat over each tile's name).
7. **Visual design system.**
   - No UI hue: ink and greys. The reel bar is white, and the counts are muted grey.
   - Colour arrives only through Hanzo's model films.
   - The hero object uses a 28px radius, tiles 24px. The reserved tier is the one dark room.
8. **UI component library.**
   - Kit `A`, `Img` and `Film`; there is no raw `<img>` or `<video>` left on the index.
   - The company kit's `MaskLines`.
   - The group words are real `<button aria-pressed>` inside the `h2`s.
   - No browser-default controls or native tooltips.
9. **Motion and interaction.**
   - Arrival: the headline cut-in, plus a CSS rise for the lede, asks and reel that needs no JS.
   - Idle: the reel walks all seventeen once (3.8s each, with its bar filling), then rests on the first. Pointer or focus holds it, and the pause control stops it.
   - Pointer: a tile's film plays under the pointer while its jobs rise and the open arrow arrives.
   - State: the groups re-flow the wall, with tiles leaving and gliding into the gap on springs. Press is .98, and the group words move 1px.
   - Scroll: nothing is scroll-linked.
10. **Media.**
    - Hanzo's model renders and films come from `/public/models` (local, so they show in the films).
    - At most two videos play at once: the hero reel plus the hovered tile, checked with Playwright. The reserved film plays only in its room.
    - Posters come from the matching `.webp`, with width and height reserved.
11. **Mobile and responsive.**
    - At 375 the reel goes full width (4:5.2). Tiles stack at 320px each with the open arrow always shown; jobs are hidden on tiles but shown in the reel.
    - There is no sideways scroll at 320 or 375, and every target is 44px or larger.
12. **Accessibility.**
    - One h1. Reel panes that aren't showing are `aria-hidden` and out of the tab order.
    - The pause control is a real button with an accessible name. Focus shows a tile's jobs, as hover does.
    - The two-tone focus ring turns white in the dark room.
    - Reduced motion: the reel does not advance, no film plays (kit Film), and the arrivals sit still.
13. **Performance and engineering.**
    - A tile's film mounts only while the pointer is on it. The reel's timer runs only while the reel is in view.
    - Transform, opacity and clip only. No blur.
14. **SEO and machine files.** Metadata and JSON-LD are unchanged. Every tile and every reel pane is in the server HTML; JS off shows the headline (`<noscript>` rule) and the CSS arrival.
15. **Catalogue and product pages.**
    - The catalogue is the film wall: group filter, previews on hover and focus.
    - Every tile is a real `<a href>` with `data-morph` on its name, which opens into the solution page's hero (`data-morph-target` there).
16. **Developer experience.** Does not apply.
17. **States and resilience.**
    - A missing film leaves the poster or the grey tile under its name.
    - A filter cannot be empty, because every group holds solutions.
    - If the films are blocked, the tiles stay legible over the dark grey ground.
18. **Measurement and handover.**
    - `data-cta` is on the hero ask, the sales link and the reserved ask. No analytics are wired, since `lib/track.js` is pending.
    - Ledger (what this page deleted): the crimson accent, the kicker over the h1, the invented "All" chip, the group label on every tile, the endless reel loop, raw `<img>`/`<video>`, and the opacity:0 arrival states.
