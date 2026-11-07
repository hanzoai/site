# /enso — James-eye review

Reviewed: main, page files at `d3752c2`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "There's a little 'FLAGSHIP MODEL' label over the name, and the red has crept out of the film into the labels, chips and the router. And there's no button on the first screen."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Moves, strongly: Hanzo's own Enso film (the red ring) fills the screen and plays, then closes into a circle that settles beside the next headline. Sells, mostly: "Enso" plus "Orchestrates every model for higher intelligence, faster and at lower cost." But the first screen has **no ask**; "Try Hanzo" arrives only after the film settles.
2. **One in, one out?** Yes: the film settles into the ring, the three tiers (Flash, Pro, Ultra) pin one per screen with their prices, then the live router room where requests route to their tier, then GPQA figures and the Pareto chart. One of the best-paced pages in my scope.
3. **A real object in every section?** Yes: film, tier cards, router, figures, chart.
4. **One ask, sticky after the hero?** After the hero, yes: the shared ask bar carries "Try Hanzo" and the header's "Try Hanzo" turns outlined. On the tier screens three links sit under each tier ("Try Hanzo", "Open in Workbench", "Docs on GitHub"), which is fine as text links.
5. **Every hover and press answers?** Tier and router controls were not exercised in the walk's first-screen pass; the close (×) answers.
6. **Overlap, font swap, layout shift?** None; layout shift 0.001 and 0.014.
7. **Which reference, and is its motion there?** synchronized.studio (the card opens into this page: the film lands full-bleed with a close button) and the anthropic launch page (GPQA as hero figures). Both visibly there.
8. **Different from its neighbours?** Yes: the ring is Enso's own.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 ("FLAGSHIP MODEL", mono caps).
    - UI hue: vermilion on tier labels ("ENSO FLASH"), use-case chips, the router ring and its "COST / SPEED" pills, and "CHEAPER". The film may be red; the interface around it should not be. JAMES.md allows 0 UI hues.
11. **Copy untouched?** Yes: parity 72/72 text, 11/11 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4:** no ask in the first screen; 0 `data-cta`.
- **2.6 Type floor:** 33 pieces of text under 13px (the 11px "ROUTING / AGENTS / MULTI-MODAL" chips, tier meta).
- **2.3 / 2.17 No-JS:** 5 of 48 blocks hidden with JavaScript off ("FLAGSHIP MODEL", the lede, the chips), hidden by the page's own CSS (SYSTEM.md §11b: scope to `html.js`).

## Fixes
1. Remove "FLAGSHIP MODEL" from above the h1 (it can sit with the chips under the lede).
2. Keep the red in the film only: tier labels, chips, router ring and pills in ink, white and greys.
3. Put "Try Hanzo" (solid) on the first screen under the lede, so the hero sells and asks.
4. Raise the chips and meta to 13px or more.
5. Scope the hero's hidden states to `html.js` so the lede reads with JavaScript off.
