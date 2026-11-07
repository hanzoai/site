# /ingress: shared changes requested (round 2, from docs/review/ingress.md fix 9)

The page does not edit these files; it carries on page-local.

1. **Phone header ask** (`components/Chrome.jsx` / `Nav.jsx`): at 375×812 the header keeps a solid black "Try Hanzo" beside the hero's solid "View on GitHub" (two solid fills in one viewport) and never swaps to the page's ask. Ask: on phones, swap the header ask to the page ask once the hero ask leaves view (as desktop already does), and render it quiet while the hero ask is on screen.
2. **Cookie card** (consent, shared chrome): 203px tall at 375×812, which meets the 220px limit but sits over the hero routing board. Ask: keep it at 220px or less and let it sit below the page's own ask without covering the hero object (or collapse to a one-line bar on phones).
3. **ShipPrompt Copy button** (`components/v2/ShipPrompt.jsx`): Copy is 32px tall; MASTER part 8 wants 44px copy buttons.
4. **GetIt spacing** (`components/v2/GetIt.jsx`): `.v2-kick { margin: 0 }` can beat `.gi-lead { margin-top }` on load order, so the h2, caption and tag stack with no space. Round 3 fixes it page-local (17px / 27px from `Ingress.css`); a shared fix would help the other cloud pages.
5. **Hero ask hover** (`components/kit.jsx` Cta / `app/globals.css`): the solid hover only lightens the fill (to an off-deck rgb(44,44,46) on some pages). Round 3 adds a page-local #262626 fill and a 4px arrow nudge on /ingress; a shared hover that tells you something would serve every page.
6. **WipeScenes text handover** (`components/v2/WipeScenes.jsx`): the clip wipe shows both scenes' text at once mid-scroll. /ingress now drives `--out` and `data-t` per scene page-local (fade out by 30% of the next wipe, cut in at 50%); worth folding into the shared component.
