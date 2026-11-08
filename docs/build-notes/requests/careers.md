# Shared changes requested by /careers (Wave 2 Company chat)

1. **components/Morph.jsx (Chrome or kit owner): every data-morph click times out.**
   - The cause: the view-transition update callback resolves inside `requestAnimationFrame`, and rAF does not run while a transition holds rendering. A bare test took 4062ms with rAF against 852ms with a timeout.
   - The fix: call `ok()` directly once the new route has committed, or use a `setTimeout(0)`.
   - Until then the Company pages open cards with the page-local `components/pages/doorway.js`.
2. **components/kit.jsx `A`: a bare `#hash` href counts as external** and gets `target=_blank`. `A` should treat `#…` (and `mailto:`) as same-tab. The Company pages pass `/<page>#hash` meanwhile.
3. ~~`/careers/*` role template: blue kicker and blue ask~~ done: the template is grey deck only, tags under the title.
4. **`components/pages/doorway.js` `useArrival` (Company group): make the landing idempotent.** A cancelled wipe must never remove the cover (`a.finished.then(remove, () => {})`, plus a timed failsafe). /careers and /careers/* no longer use it: they open through the page-local `components/pages/careers/door.js` (`openSheet` / `useSheetLanding`), which also lifts any shared `[data-door]` cover that way.
5. **Header (Chrome owner):** with `data-ask="off"` (careers, MASTER part 4) the header's solid "Try Hanzo" shares the first screen with the page's solid ask. The header could turn quiet when a page turns its ask bar off. Not hacked here.
