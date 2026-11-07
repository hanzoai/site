# /brand — James-eye review

Verdict: 7/10
First complaint: "On my phone the grey scale shows two colours and then a big black hole. Where are the other four? And there's a red error badge when I turn animations down."

Walked Sat 7 Nov 2026 ~16:15 UTC, HEAD 0661c16f, at 1470x801 and 375x812 (isMobile, touch). First screen at 0.2, 1, 3 and 6 s plus a reload. Scrolled the whole page in 200px wheel notches with about 1 s dwell. Hovered and pressed every control on desktop and tapped them on phone. Then checked reduced motion and JS off, and ran taste.py (OK) and parity.py (76/76 text, 4/4 links).

## What works
- The hero object is the logo being built: guide lines draw, the compass rings in and the four squares and bar land into the mark (pixel change 8% between 1 and 3 s). The compass then turns slowly and the pieces lean toward the pointer. A pause button is there. It's alive, on-brand and different from every other hero.
- The principles are a pinned stage: 01 / 02 / 03 swap one at a time, each with its own object (the mark, a radial glow, a 4x4 mark grid). This is real one-in, one-out.
- The colour room earns its place. Copy swatches tick only when the clipboard really took the text (checked: `#0A0A0B` copied, aria-pressed true). The grey strip widens the hovered swatch. The Hanzo White / Hanzo Black toggle glides and turns the six contrast tiles into a live WCAG check (tick, half disc, cross). Status is a shape, not a hue.
- In the type specimen, the weight slider really changes the "Aa" (560 to 200 measured). The scale list is quiet and editorial.
- Presses answer with scale 0.97–0.98 and the card lifts 8px. Hover changes fill or border, not just opacity.
- The header ask changes from "Try Hanzo" to the page's own "Download Assets" once the hero has passed (desktop): one solid ask in the page's own words.
- No horizontal scroll at either size. Normal-motion loads are console-clean on desktop. JS off shows the full hero and mark.

## The 11 answers
1. **Sells in 5 s / moves within 1 s?** Yes on desktop: the headline cuts in by 1 s and the mark builds by 3 s. On phone the mark sits mostly below the fold (top at 453px, under the asks), so the first phone screen is the headline only, plus a sliver of drawing.
2. **One in, one out?** Yes through the principles pin and the colour room. It goes slack after Components: a ~250px empty grey tail plus ~200px of white before the assets band (desktop scroll frames 20–21).
3. **A real object per section?** Yes: the mark build, the numbered stages, the swatches, the contrast tiles, the gradients, "Aa" with its slider, live components, and the 3-plate assets band.
4. **One ask, no floaters, scale rhythm?** One solid ask in the header. Big "01/02/03" and "Aa" alternate with 26px heads and small mono, so the rhythm is good. The only floater is the site-wide cookie sheet, which covers about 120px (desktop) or about 170px (phone) of content until dismissed. That's shared, not page-owned.
5. **Every hover and press answers?** Mostly. The gradient cards, the scale rows and the assets download row show no hover change. The shared header ask drops to opacity 0.88 on hover, alongside a fill change.
6. **Overlaps, font swap, layout shift?** On phone, the Gray Scale fan-in is broken (see Fix 1). On desktop the big swatch title nearly collides with its hex: `.xbr-sw.big .xbr-sw-t b` is 44px on an inherited 21.6px line box, so "Hanzo Black" glyphs sit on top of "#0A0A0B". No font swap seen.
7. **Reference?** apple.com product page (a pinned stage, one idea per screen, the product as hero), with an osply-style editorial type scale. The pin and the scrub are really there.
8. **Different from neighbours?** Yes. The construction drawing and the contrast checker are this page's own.
9. **18 parts?** From the walk: strategy, nav, narrative, conversion, components, motion, media, mobile and states are all visibly addressed. Accessibility and resilience are weakened by the two defects below. I did not audit the coverage card.
10. **Banned tells?** None found: no hue (taste OK), no eyebrow over h1/h2, no equal three-box row (the gradient cards are unequal widths), no gradient text, and no fade-only buttons on the page itself.
11. **Copy untouched?** Yes, parity 76/76 text and 4/4 links.

## Fixes (in order)
1. **Phone Gray Scale is missing 4 of 6 colours.** At 375 the `.xbr-grays` grid is 2 columns with `overflow:hidden`. Swatches 3–6 stay at `translateX(-335 … -837px)` because the fan entry (`initial x: -i*100%`, `whileInView amount 0.7` in `Swatch`, Brand.jsx ~l.196) can never reach 70% visibility while it is translated outside a clipped box. Below 900px, drop the fan (or trigger it from the parent's inView) so all six show.
2. **Hydration error under reduced motion (red "1 Issue" badge, desktop and phone).** Brand.jsx l.105 `{!calm && (<button className="xbr-pause">…)}`: the server renders the button, but a reduced-motion client does not. Render it always and hide it with CSS or `hidden`, or gate it behind a mounted flag. Also check the other `useReducedMotion()` branches (l.235, l.289) for the same pattern.
3. **Big swatch title crowds its hex.** Give `.xbr-sw.big .xbr-sw-t b` a real line-height (about 1.05) so "Hanzo Black" and "#0A0A0B" stop touching.
4. **Close the dead space after Components** (empty grey tail plus white gap before the assets band) so the band arrives as the next thing in.
5. **On phone, bring the mark build into the first screen** (shorter top padding or a smaller drawing above the fold), so the phone hero moves without scrolling.
6. **Add a hover answer** to the gradient cards, the scale rows and the ZIP download row (a fill, a border or a nudge of the arrow).
