# /insights: shared changes requested (round 2, 7 Nov)

Done page-local meanwhile in `components/pages/cloud/Insights.css`; please make them shared so every page gets them.

1. **Solid button hover is off the deck ramp.** `app/system.css` sets `--btn-solid-hover: #2c2c2e` (a blue-cast grey). Insights overrides it to `#262626` on `.in`. Ask: change the shared token to `#262626`.
2. **Kit `CodeBlock` greys are off the ramp.** `.x-codeblock` uses `#0a0a0b` (fill), `#e8e8ed` (code text), `#a1a1a6` (caption), `#d2d2d7` (Copy) and `#86868b` (comments). Insights maps them page-locally to `#0a0a0a`, `#fafafa`, `#a3a3a3`, white 78% and `#a3a3a3`. Ask: put the same values in the kit.
3. **`.v2-dark` text colour.** It is `#f5f5f7`; Insights sets `#fafafa`. Ask: change `components/v2/v2scale.css`.
4. **Phone header ask (critic's fix 9, not scored).** At 375 the header keeps a solid "Try Hanzo" beside the hero's solid "Open Insights", so screen one shows two fills with two labels. Ask: at phone width, the header should carry the page's hero label quietly, as it already does on desktop.
