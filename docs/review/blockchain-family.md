# /blockchain/* (template) — James-eye review

Reviewed: main, page files at `6e63fa2` (second review; the first, at `2b1420f`, scored 5/10). Members walked: `/blockchain/bundler` and `/blockchain/defi`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Much better on the laptop: black and white, the key card right there. But on my phone nothing moves at all once it loads, and the nine capability cards still end up as a grid of little boxes."

## What changed since the first review
Fixed: no "AVAILABLE NOW" eyebrow over the h1 (it sits under the lede), no blue or green (ink only), the dark key card with "Get Your API Key", "Try Hanzo" and the figures (HA, <50ms, 100+) is now beside the headline on the first screen, and the nine capabilities deal in one by one from a stack while a counter runs 00 → 09.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop yes: "Bundler API" / "Hanzo DeFi", Hanzo's lede, and the key card with the chain ticker sliding. Phone: the first screen barely moves after arrival (0.5–0.7% change).
2. **One in, one out?** Mostly: the capabilities now arrive one at a time with the counter, which works. They still finish as a 3×3 wall of boxes with a sentence each, and the page after them (code, built for, chains, start building, get) is long.
3. **A real object in every section?** Yes until the closing blocks.
4. **One ask, sticky after the hero?** Yes: "Try Hanzo" in the key card, the shared ask bar after it, and the close; five `data-cta` tags. "View Documentation" is the outlined second.
5. **Every hover and press answers?** The ask answers; capability cards were not exercised.
6. **Overlap, font swap, layout shift?** None; layout shift 0 on all walks.
7. **Which reference, and is its motion there?** apple.com stats as hero figures, and a dealt stack of cards. Present.
8. **Different from its neighbours?** Members share the layout; bundler and DeFi differ by words, chains and contour.
9. **All 18 parts covered?** `docs/coverage/blockchain-family.md` exists; text reads with JavaScript off.
10. **Banned tells?** None on the page now. The final 3×3 grid still reads as "boxes with explaining sentences".
11. **Copy untouched?** Yes (146/146 and 149/149 on the first review; unchanged words).

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.11 Mobile:** first screen and every later screen still on the phone.
- **2.3 Narrative:** long tail after the capabilities.

## Fixes
1. Phone: let the chain ticker run in the key card on the first screen, and deal the capabilities as a swipeable stack (one card per screen) rather than a stacked grid.
2. Let the dealt cards leave as the next arrives (keep the stack, not the full 3×3 wall).
3. Fold "Built For" and "Supported Chains" into the key card or a sheet, so the page ends sooner on "Start Building".
