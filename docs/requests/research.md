# Request: register two /research UI strings in `content/ui-strings.json` (shared owner)

- `research_find`: "Find a paper or a HIP" — the placeholder and accessible name of the index search.
- `research_when`: "When it was published" — now only the accessible name of the month bars (no visible heading).

The page keeps both strings inline until the register has them.

# Request: hydration-safe `components/v2/MaskLines.jsx` and `SceneWipe.jsx` (shared owner: Wave 2 Proof kit)

Both read `useReducedMotion()` during render (MaskLines' `initial`, SceneWipe's `clipPath`), and MaskLines writes a `<noscript>` inside a client component. Under reduced motion the server and client HTML differ, so every page using them shows Next's red "1 Issue" hydration badge (seen on /research and /security, 2 of 2 loads). Asked: hold the reduced-motion value in state set in an effect (render the motion start on the server, settle at once after hydration) and use the shared `<NoJs>` for the JS-off rule. /research and /security use page-local copies in `components/pages/proof/` until then.
