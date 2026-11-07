# Coverage: /platform (components/pages/Platform.jsx, Platform.css, platformData.js; app/platform/page.jsx)

Shared parts used: `components/v2/IsoStack`, `PinChapters`, `SheetPanel`, `useCalm` (all owned by this chat), plus the kit's `A`, `Band`, `Tabs`/`TabPanel` and `Copy`, and the site's ask bar (`components/Ask.jsx`, through `data-thumb`).

- **2.1 Strategy and conversion:**
  - The file header holds Persona (Developer, then the enterprise buyer), Goal (`api_key_created`) and CTA ("Start building" → platform.hanzo.ai/api-keys).
  - One solid button per screen:
    - The hero has "Start building" (solid, `data-thumb`, `data-cta="platform.hero"`) and "Inspect the stack" (outline).
    - After the hero, the site's ask bar carries the same words, and the header's "Try Hanzo" turns to outline while the bar is up.
    - The closing Band has the same solid ask.
  - Gaps: there is no `lib/cta.js` yet. The Band's button is rendered by the kit, so it carries no `data-cta`.
- **2.2 Information architecture and navigation:**
  - The header and footer are untouched. Every link on the old page is kept (link parity 129/129).
  - The directory keeps all 7 planes and every item in them, plus "The complete catalog" → /products.
  - "Inspect the stack" carries the camera to the map's opening state (`#stack`). It falls back to a plain jump on phones and with JS off.
- **2.3 First impression and page narrative:**
  - The hero opens on the h1 "The AI‑native cloud." with no eyebrow. "Hanzo Platform" sits under it as a mono label.
  - The hero object is the whole stack as one white slab. It turns toward the pointer, and the marquee moves without input.
  - One idea per screen: hero, then the map (intro, then API, MIND, ACT, RUN and SILICON, each a pinned chapter), Kernel, the tile grid, the loop, the cloud plane by plane (six sticky chapters), One API, Open, the directory, the Band.
  - The night opens as a disc from the stack and closes back into it, so the dark room has no hard edge on either side.
  - Gap: the kit has no `PageHero` yet. The Band is the kit's.
- **2.4 Conversion system:**
  - The install commands (`docker run …`, `curl -fsSL https://hanzo.sh | sh`, `hanzo serve cloud`) copy exactly the displayed text. The `$` prompt is a separate span that is not selectable and not copied.
  - The ask never appears as three or more equal buttons.
  - Gap: the kit's `Copy` still shows its tick when the clipboard is blocked (kit behaviour, not this page).
- **2.5 Trust and proof:**
  - Only Hanzo's own figures appear, each beside its own method line: 95.6% (GPQA Diamond, with the sheet's "Historical multi-model research evaluation · new questions"), 3.02× (with the 42-task pairing and the interval), 2.0× (with the LoCoMo split), 11 layers and 4 GPU backends.
  - There are no badges, seals or invented numbers.
- **2.6 Content presentation (copy untouched):**
  - Parity: text 330/330, links 129/129.
  - Type uses five levels: display 56–124 px (line height .92), headline 36–56, title 28, lede 21–24, body 17–19. Mono labels are 13 px (14 on phones). Headlines use `text-wrap: balance`.
  - Detail lives in things you open: the layer inspector sheet, the console's tabs and the directory preview.
  - Measured floors: no visible text under 13 px on desktop or under 14 px at 375 px (`audit.cjs`).
- **2.7 Visual design system:**
  - 0 UI hues: ink, greys and silvers only.
    - The lit plates are white with a white glow in the dark room.
    - Status shows by shape: Ready is a filled dot, Building a turning ring.
    - The GET pill is white on black.
  - One dark middle room (the map) plus the dark closing Band.
  - Radii are 28 px on hero objects and 16–22 px on cards.
  - Gap: no CANON tokens file exists yet, so radii are literal values in `Platform.css`.
- **2.8 UI component library:**
  - The console's kinds-of-work tabs are the kit's APG `Tabs`/`TabPanel`.
  - The layer inspector is `v2/SheetPanel`, because the kit's `Sheet` unmounts when it closes, which would take the 11 layers' text out of the HTML. SheetPanel keeps it in, inert. SheetPanel has `role=dialog`, `aria-modal`, Esc to close, a focus trap, and returns focus to whatever opened it.
  - Every hover sits inside `@media (hover: hover)` and changes something other than opacity: a nudge, an ink fill, a lift or the plate lighting.
  - Presses are `scale(.98)`/`(.99)` or `translateY(1px)`.
  - Gap: the hero asks are raw `<a class="x-btn">`, because the kit's `Go` cannot carry `data-thumb` or `data-cta` and there is no `Cta` yet.
- **2.9 Motion and interaction:**
  - Signature: the camera (scroll). The stack explodes, the night opens and the camera zooms group by group.
  - The other kinds of motion, so scroll is 2 of 6:
    - Pointer: the stack turns to the pointer, tiles play their own drawing on hover, the directory previews a row, the ring holds a step.
    - Time: One API types each call path, the improvement ring turns by itself, the marquee drifts.
    - State: sheets rise, and the endpoint pill and tab pill glide.
    - Arrival: headlines cut into their line masks.
  - `variety.py` passes: 4 techniques (scroll scrub, typing, layoutId, Sigil) and 0 fade-ups.
  - Reduced motion shows final states: the stack is open and still, there is no typing, the ring stays put, the marquee stops, and the scenes stack in flow.
- **2.10 Media:**
  - Hanzo publishes no platform film or photo, so the objects are real product UI and drawings: the API Platform console, the One API terminal, the Open terminal, the plate stack, the kernel fan, the graph, AST tree, commit line, request flow and trace, and the directory's Sigil.
- **2.11 Mobile and responsive:**
  - At 375×812 there is no sideways scroll.
  - The pinned scenes become a vertical story. The map's groups each get a mini stack diagram, the chapters run words then picture, and the directory runs two columns of 48 px rows.
  - No tap target is under 44 px (measured). CLS while scrolling the whole page: 0.021 on phone, 0 on desktop.
- **2.12 Accessibility (WCAG 2.2 AA):**
  - One h1. Plates and drawings are `aria-hidden`, and every plate has a real button twin in the group rows.
  - Focusing a part of the map that is off screen brings the camera there.
  - The One API replay has a Play/Pause control.
  - Text on white is #6e6e73 or darker. Small text in dark rooms is white at .62 or above.
  - Gaps: the marquee only pauses on hover, with no pause button. No axe or screen-reader run has been done.
- **2.13 Performance and engineering:**
  - Animation is transform and opacity only. The night is a 200 px disc scaled up, so there is no clip-path and no huge layer. The camera is one translate and scale, and each plate is one translateZ.
  - Timers and typing stop when their section is off screen, and there is one Sigil canvas on the page.
  - Not measured: LCP and INP.
- **2.14 SEO and machine files:**
  - Title, description and JSON-LD are unchanged, and every word is in the server HTML.
  - The directory's preview text comes from each product's own meta description, looked up on the server and passed in, so nothing is fetched in the browser.
- **2.15 Catalogue and product pages:**
  - PLAN-COMPONENTS 5.9 directory:
    - 44 px rows in four columns, with plane headers that carry `data-morph`.
    - Hover or focus on a row reveals that product's existing description and its Sigil in a sticky preview card.
    - The description comes from its own page's meta description or, for a cloud product without one, that page's lede.
  - 5.9 asked for a "group accent". JAMES 7 (0 hues) wins, so the colour is left out.
- **2.16 Developer experience:**
  - The One API replay walks the existing paths, `/v1/models` to `/v1/billing/usage`.
  - The copy buttons copy exactly the displayed text.
- **2.17 States and resilience:**
  - With JS off, a `noscript` sheet lays every scene out in flow. Measured: 0 hidden text runs beyond the empty search counter and the ring's 0-size anchors. The closing Band and inactive tab panels also show.
  - Ask the map: below 2 characters nothing lights. With no match, every plate dims and the count reads "0 / 11". The clear control is an icon button.
  - Gap: no error boundary around IsoStack or Sigil.
- **2.18 Measurement and handover:**
  - `data-cta` is on the hero primary.
  - Gaps: no `lib/track.js` exists, so no events fire.
  - Proof is in `docs/gallery/platform/`. Checks: 200, parity 0 missing, `variety.py` OK, `audit.cjs` (floors, taps, CLS), and a JS-off render.

## §4 common gate
1. Persona, Goal and CTA: yes (file header). A metric id: yes (`api_key_created`).
2. One h1 in server HTML: yes. Band: yes. `PageHero`: not in the kit yet. No raw `<video>`, `<img>` or `<table>`. Raw `.x-btn` is on the two hero asks (see 2.8).
3. Tokens: system.css greys and room tokens, plus literal radii. One filled primary per screen: yes. `data-thumb` and `data-cta`: yes, on the hero.
4. Copy parity 0 missing; link parity 0 unexpected. UI strings: only control labels in `aria-label`s (Clear, Pause, Play, Previous layer, Next layer, Find in the stack). They wait for the `content/ui-strings.json` register.
5. Reduced motion shows final states. JS off is legible. Every motion has a keyboard path (the rows mirror the plates, the ring steps are buttons, tabs follow APG).
6. 375×812 and 1470×801 pass, with no sideways scroll at 375. CLS is 0.021 or less. LCP and INP are not measured.
7. Contact sheet: `docs/gallery/platform/`.
8. Ledger (what this page deleted):
   - The page's own console tab set (replaced by the kit `Tabs`).
   - The page's own closing section (replaced by the kit `Band`).
   - The v1 page AskBar (replaced by the site ask bar).
   - The iris accent and every clip-path wipe.
