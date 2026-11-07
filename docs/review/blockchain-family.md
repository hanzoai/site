# /blockchain/* (template) — James-eye review

Reviewed: main, page files at `2b1420f`. Members walked: `/blockchain/bundler` and `/blockchain/defi`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 5/10

First complaint: "A little blue 'AVAILABLE NOW' tag sitting on the headline, a giant blue '09', and the DeFi page is green. Then a grid of nine boxes, each with a sentence under it. That's the overload I asked you to get rid of."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "Bundler API" / "Hanzo DeFi" at display size with Hanzo's lede, and a ticker of chains (Ethereum, Polygon, Arbitrum…) slides by itself under it on both sizes. But the hero has no ask and no product object: the ticker is the only thing on stage.
2. **One in, one out?** No, it reads as a document: hero, dark "Get Your API Key" card with three figures, a 3×3 grid of nine capabilities, a code block, "Built For" chips, supported chains, then two closing blocks ("Start Building with…", "Get…").
3. **A real object in every section?** The code block and the chain ticker, yes. The nine-box capability grid and "Built For" are text in boxes.
4. **One ask, sticky after the hero?** Partly. A floating pill carries "Try Hanzo" after the hero on desktop, and the header's "Try Hanzo" turns outlined, which is right. But the hero itself has no button; the first ask ("Try Hanzo" + "View Documentation") arrives in the dark card below the fold, and the page ends with a third ask, "Deploy to Cloud".
5. **Every hover and press answers?** Hover on the back link answers. Capability boxes do not change on hover. No press states caught.
6. **Overlap, font swap, layout shift?** No overlap or sideways scroll. **Hydration error on the phone for both members** (red "1 Issue" badge over the page on localhost).
7. **Which reference, and is its motion there?** apple.com stats (HA / <50ms / 100+ as big figures) and a ticker. The ticker is the only authored motion; nothing from synchronized.studio or osply.
8. **Different from its neighbours?** The two members are the same page in a different colour. The layout matches the Cloud product pages' generic skeleton.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 on both ("• AVAILABLE NOW", coloured dot, mono caps).
    - UI hues per member: blue on bundler (dot, "HA", the giant "09", numbers), **green** on DeFi. Lavender and mint code tokens on both.
    - Clutter: nine boxes in a 3×3 grid with an explaining sentence under each; "three equal boxes in a row", three times.
11. **Copy untouched?** Yes: parity 146/146 and 149/149 text, 3/3 links. All figures ("HA", "<50ms", "100+", "under 5 minutes") are Hanzo's.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.1 / 2.4 Conversion:** no ask in the hero; three different asks on the page ("Try Hanzo", "View Documentation", "Deploy to Cloud"); 0 `data-cta`.
- **2.3 Narrative:** no chaptering; the capability grid is a wall.
- **2.6 Content:** lists over six items in the main scroll (nine capabilities); plan says collapse with a true count.
- **2.13 / 2.17:** hydration error on phone.

## Fixes
1. Remove "• AVAILABLE NOW" from above the h1 (it can sit beside the ticker or in the dark card).
2. Take out the blue and green: dot, figures, the "09", code tokens all go to ink and greys.
3. Put the member's ask ("Try Hanzo", in Hanzo's words) in the hero, solid, with "View Documentation" as a text link.
4. Replace the 3×3 grid with one pinned object that changes per capability (the code block highlighting the line that does it, or the request walking the chains), so one comes in as one goes out.
5. Give each member one thing of its own beyond the colour (bundler: a UserOperation travelling into a bundle; DeFi: a swap or stake running through the router).
6. Fix the phone hydration mismatch.
