# /mcp: requests (Apps 2 chat)

UI strings: `Pause`, `Close` and `Copy` are already listed in `content/ui-strings.json`; this page adds none.

## Open (shared chrome, round 2 review, 7 Nov)
1. **Phone header ask (Ask.jsx / masthead).** At 1470 the header's solid swaps to the page's own ask ("Browse 260+ tools", the `data-thumb` twin of `data-cta="mcp.hero"`) once the hero ask has gone by. At 375 it stays "Try Hanzo" all the way down, so the page's ask leaves with the hero. The only phone carrier is the bottom `.x-ask` bar, and it shows only at rest and only where it covers nothing. Request: run the desktop label swap at ≤700px too, or document that the bar is the phone carrier. The page outlines "Try Hanzo" on phones page-locally (`McpPage.css`, `html:has(main.mcp)`), so only one solid shows; that rule can go once the header swaps.
2. **Header ask clips at 320.** At 320×640 the masthead's "Try Hanzo" runs to x≈352 and is cut off (the logo, search and language controls leave too little room). Request: shrink the ask's padding or hide the language label under 360px.
3. **Cookie card covers the hero object on phones** until it is dismissed (shared `.x-cookie`). At 375×812 it sits over y≈595–795, the lede and the asks. Request: a slimmer phone layout, or one that starts below the first screen's ask.

## Done / no longer needed
- The kit `Band` button has no `data-cta` (see `docs/requests/ide.md`): /mcp no longer uses Band; its close is page-local with `data-cta="mcp.close"`.
- The desktop ask bar floating over content: fixed in shared `Ask.jsx` (desktop now carries the ask in the header).
- Kit parts this page still waits for: `PageHero`.
