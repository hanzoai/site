# Request: reduced-motion hydration mismatch in shared components (7 Nov)

From the chat owning /computer /console /crawl /dashboards /dataroom /datastore /design /dns /download /edge /engine.

**Symptom.** With `prefers-reduced-motion: reduce`, nearly every page throws a React hydration error ("A tree hydrated but some attributes of the server rendered HTML didn't match") and the Next dev badge turns red ("1 Issue"). Critics report it as a console error and dock the page (crawl and computer reviews, 7 Nov).

**Cause.** `useReducedMotion()` from `motion/react` returns `null` on the server and `true` on the first client render, so any `calm ? A : B` used in render props (style, initial, clipPath) differs between server and client. Reproduce with Playwright: `newContext({ reducedMotion: 'reduce' })`, load any of the pages above, read the console.

**Fix (one line per file).** Swap `useReducedMotion()` for the kit's hydration-safe `useCalm()` (`components/ui.jsx`; false on the server and first render, then follows the setting live). Files still calling it in render:
- `components/ui.jsx:114`, `components/kit.jsx:114, 355, 517`
- `components/pages/cloud/Frame.jsx:15`, `components/pages/cloud/ExampleConsole.jsx:23`
- `components/v2/`: KeynoteStage, KeynoteOpen, KeynoteRoom, LaunchClose, LaunchConsole, Launch, WipeScenes, SceneWipe, FamGrow, FamStage, FamRoom, BizOpen, BizStage, SpecCard, Settle, SettleStage, AppStage, AppDemo, MaskLines, StageZoom, A2Grow, A2Lines, A2Room, LiftStage, Stage, ModelFilm, OpenSheet, Chapters

My own page files have been switched to `useCalm()` already. Because the hero stages are where critics see it first, three page-local stand-ins carry the same one-line fix until the shared files are changed (delete them then and import the shared ones again):
- `components/pages/cloud/SafeStage.jsx` = `v2/KeynoteStage` (used by /crawl /dashboards /datastore /dns /edge /engine);
- `Settle` inside `components/pages/ComputerPage.jsx` = `v2/AppStage`;
- `BizStage` inside `components/pages/apps/ConsolePage.jsx` = `v2/BizStage`.
Still from shared code on my pages under reduced motion: `v2/KeynoteRoom` (via `KeynoteClose`) on the six Keynote pages, and `v2/x-edison/AppLines` on /design and /download. With JS on and normal motion there are 0 console errors on all 11 pages.
