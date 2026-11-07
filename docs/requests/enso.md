# /enso: shared requests (page fixer, 7 Nov)

These live in shared files the /enso chat does not own. Nothing here was edited; the page works around them locally where it can.

1. **Hovers inside `@media (hover: hover)` are invisible to the film probe.** Headless Chromium in `motion.mjs` reports `(hover: hover)` false, so every shared hover written that way (kit `Cta` quiet, `FilmPause`, `.lv-close`, `.lv-ch-rail`) films as DEAD. /enso now writes its own hovers under `(hover: hover), not all and (pointer: coarse)` and overrides the rail and the × close page-locally. Suggest the same query in `components/v2/Launch.css`, `ModelFilm.css` and the kit.
2. **`motion.mjs` re-uses stale `data-probe` keys.** It never clears `data-probe` between screens, so on a later screen `querySelector('[data-probe="4:0"]')` finds an earlier screen's element (on /enso, a faded chapter's "Try Hanzo"), and the hover reads DEAD even though the live link underlines. Measured: each chapter's live "Try Hanzo" and "Open in Workbench" underline on hover (puppeteer, same viewport). Suggest clearing old `data-probe` attributes at the start of each screen.
3. **Phone STILL screens at the paused stage** (y=91, 384, 597 in `enso-run3`) come from the probe tapping the stage `FilmPause`: the page is still because the visitor paused it (WCAG 2.2.2). The stage is shared `Launch.jsx`; if a quiet paused-state cue is wanted it belongs there.
4. **Stage "Try Hanzo" and the hidden stage link "A"** (desktop screens 1 and 2) are `Launch.jsx`'s first-screen ask and an element covered by `.lv-pin`; not page-local.
