# /integrations: shared changes requested (Wave 2 Proof chat)

1. **UI strings for `content/ui-strings.json`** (the register is shared; the page uses these today, pending James):
   - `int_find`: "Find your tool" — the catalogue search field's placeholder and accessible name (the page's Beyond).
   - `int_no_match`: "Nothing matches" — the empty state when the search finds no tool (followed by the query in quotes).
2. **`components/Morph.jsx`** (shared): inside `document.startViewTransition(...)` the update callback resolves through `requestAnimationFrame(() => ok())`. Chromium suppresses rendering, and so rAF, during that callback, so it only resolves at the 4 s View Transition timeout: every in-site click freezes about 4 s and the morph is skipped. Measured: rAF inside the callback 4,069 ms, `setTimeout` 81 ms. Fix: `setTimeout(ok, 16)` in place of `requestAnimationFrame(() => ok())`. With that change simulated, `/integrations` cards land in their guide's h1 (`docs/gallery/integrations/click-through.jpg`).
