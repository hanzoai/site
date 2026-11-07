# Request: KeynoteStage hydration under reduced motion (from the /base, /analytics, /authz owner, 7 Nov)

`components/v2/KeynoteStage.jsx` reads `useReducedMotion()` during render. With reduced motion on, the server renders
`.kns-obj` with `style="transform: translateY(4%) scale(1.08)"` and the client renders it with no style, so React logs a
hydration mismatch and the red "1 Issue" badge shows on every Keynote page for reduced-motion visitors.

Asked: read reduced motion after mount (the `useCalm` pattern), so the first client render matches the server.
Reproduce: Playwright context with `reducedMotion: 'reduce'`, load /base/ and watch the console.

Also seen (shared chrome): the footer's `dangerouslySetInnerHTML` shell (`data-x-shell="footer"`) differs when captured before hydration.
