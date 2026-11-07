# /ingress: shared changes requested (round 2, from docs/review/ingress.md fix 9)

The page does not edit these files; it carries on page-local.

1. **Phone header ask** (`components/Chrome.jsx` / `Nav.jsx`): at 375×812 the header keeps a solid black "Try Hanzo" beside the hero's solid "View on GitHub" (two solid fills in one viewport) and never swaps to the page's ask. Ask: on phones, swap the header ask to the page ask once the hero ask leaves view (as desktop already does), and render it quiet while the hero ask is on screen.
2. **Cookie card** (consent, shared chrome): 203px tall at 375×812, which meets the 220px limit but sits over the hero routing board. Ask: keep it at 220px or less and let it sit below the page's own ask without covering the hero object (or collapse to a one-line bar on phones).
3. **ShipPrompt Copy button** (`components/v2/ShipPrompt.jsx`): Copy is 32px tall; MASTER part 8 wants 44px copy buttons.
4. **GetIt spacing** (`components/v2/GetIt.jsx`): the "Get Ingress" band stacks the h2, the mono caption and the tag with almost no space between them; ask for the golden steps (10.5 / 17px) between them.
