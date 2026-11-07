# Shared changes requested by /careers (Wave 2 Company chat)

1. **components/Morph.jsx (Chrome or kit owner): every data-morph click times out.**
   - The cause: the view-transition update callback resolves inside `requestAnimationFrame`, and rAF does not run while a transition holds rendering. A bare test took 4062ms with rAF against 852ms with a timeout.
   - The fix: call `ok()` directly once the new route has committed, or use a `setTimeout(0)`.
   - Until then the Company pages open cards with the page-local `components/pages/doorway.js`.
2. **components/kit.jsx `A`: a bare `#hash` href counts as external** and gets `target=_blank`. `A` should treat `#…` (and `mailto:`) as same-tab. The Company pages pass `/<page>#hash` meanwhile.
3. **`/careers/*` role template (Families A): the blue mono kicker over the h1 and the blue "Apply for this position" break the Hanzo palette.** That template's owner should switch them to ink, so a sheet from /careers lands on a page of its own kind.
