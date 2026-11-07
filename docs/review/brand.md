# /brand — James-eye review

Verdict: 7/10
First complaint: "There's a red error badge in the corner every time it loads, and the principles screen is in your face: a huge heading and a giant number at the same time."

Walked 2026-11-07 16:33 UTC, HEAD e584018d, at 1470x801 and 375x812 (isMobile, touch). First screen sampled at 0.2/1/3/6 s on a fresh visit and on a reload. Scrolled the whole page in 200px (desktop wheel) and 160px (phone) steps with about 0.7 s dwell. Hovered, clicked and tapped every control in main, with clipboard permission for the copy checks. Also checked reduced motion and JS off, collected console errors over 6 extra loads, and ran taste.py (OK) and parity.py (76/76 text, 4/4 links).

## What works
- The hero object is the Hanzo mark drawn on its own construction grid (circle, ticks, guide lines). The pieces drift apart and reassemble on an idle loop, so the screen is alive without input. It has a pause control. Reduced motion shows the assembled mark.
- "Download Assets" is the one solid ask. The header swaps "Try Hanzo" for "Download Assets" once the hero ask leaves view. Press Kit is outlined. Nothing floats over content except the shared cookie card.
- Principles is a real pinned stage: 01, 02 and 03 swap one panel at a time, with "/ 03" and a left progress line. On phone it stacks one panel per screen.
- The colour room is good. In the grey strip, hovering widens a swatch (an accordion, not opacity), and a click copies the hex: the clipboard read back `#404040` and the icon turned into a tick. The White/Black readability toggle slides a pill and re-grades all six "Aa" rows with pass, partial and fail marks. The hover and the toggle both tell you something.
- In Typography, the "Aa" weight sweeps once when it is on screen (560→200→900→560, under 5 s) and then rests. The slider takes over and the scale rows follow it. This is real time-based plus pointer motion.
- The email copy button really copies `brand@hanzo.ai` and confirms with a tick.
- The motion mix covers idle (mark), scroll (pin), time (weight sweep), state (toggle, copy confirmation) and pointer (swatch accordion, slider), so scroll is under half.
- No hue anywhere. Monochrome only, and taste.py passes. Copy matches live. No horizontal scroll at either size. JS off is fully legible and reduced motion shows final states.

## The 11 answers
1. **Sell in 5 s / move in 1 s:** Yes on a warm load. h1, lede, both asks and the mark are on screen by about 0.8 s, and the mark starts moving at once. One cold first load in my run was blank at 1 s, but the warm reloads were not, so I put that down to dev compile.
2. **One in, one out:** Mostly yes. The pinned principles and the colour room each carry one idea. It drifts back toward a document in Typography → Components → Assets, which are tall static blocks separated by about 250px of empty white (between the end of the colour room and Typography, and above Components). The right column of the assets screen is also empty for its top 350px.
3. **A real object per section:** Yes. The mark, the 01/02/03 panels (Hanzo marks, the glow, the 4×4 mark grid), live swatches, the "Aa" specimen, real button/card/badge specimens, and the asset tiles.
4. **One ask, nothing floating; scale rhythm:** The ask passes. Scale fails in places. The h1 is 84px, and the principles h2s and "Color Palette" are also 84px. The principles screen pairs an 84px heading with a ~300px numeral, so two big things fight on one screen. Typography, Components and the Assets heading all sit at 64px. Very little settles back to the 26px resting size.
5. **Every hover and press answers:** Mostly. Primary, Press Kit, swatches, the toggle, the ZIP link and the copy buttons all answer. The demo "Card Title" card says "with hover states" but nothing visibly changes on hover. The Secondary and Link specimen buttons show no computed change on hover either.
6. **Overlaps, font swap, layout shift:** No visible overlaps at either size. The stacked principle headings only overlap inside the pinned stage, where one shows at a time. On phone, a mid-glide frame of the White/Black toggle briefly shows the pill over the "Hanzo Black" label, and it settles cleanly. **Console:** a hydration mismatch fires on every early-screenshot load (6/6) and raises the red "1 Issue" badge. Its diff points into this page: the Typography range input `style={{'--p': ...}}` in `components/pages/Brand.jsx:318-319`, in the `Type()` component.
7. **Reference:** apple.com product page for the pinned principles and the one-idea colour room, and osply/hamol for the editorial type specimen. The pinned-stage motion is really there.
8. **Different from neighbours:** Yes. The hero medium is a drawn logo-construction diagram, and the signature is the weight sweep plus slider. Neither is a stock hero.
9. **18 parts:** What I could see covers one h1, one solid ask with the header swap, a pause control on idle motion, copy confirmations, a closing assets card with the page's own link and contact, legible JS off, reduced motion, sound toggle in the header and the footer. I did not read the coverage card, as instructed.
10. **Banned tells:** No hue, no eyebrow above any h1 or h2 (taste.py OK), no gradient text and no fading buttons. Risks: "everything big at once" on the principles and colour screens, three black or graphite rooms (black 02 panel, the colour room and the assets card; the brief allows 2), and the three equal logo tiles in the assets card. The tiles read as a logo specimen, not icon boxes, so I am not counting them.
11. **Copy untouched:** Yes. parity.py gives 76/76 text and 4/4 links.

Shared (not counted): the FooterHTML hydration diff appears in the same error, and the shared cookie card covers the lower part of the screen on both sizes.

## Fixes (in order)
1. Kill the page's hydration mismatch. In `Brand.jsx` `Type()`, stop rendering the range input's `style={{'--p': ...}}` from state on the server. One option is to set `--p` in an effect or ref after mount, or to render a static server value and update it on the client. Re-test with screenshots taken in the first 600 ms until the red badge is gone.
2. Bring scale back to rhythm. Rest the principle h2s and "Color Palette" at section size (26–44px) so the 01/02/03 numeral is the one big thing on the principles screen and the swatches are the big thing in the colour room. Consider settling the h1 nearer 52–64px so the mark leads.
3. Close the dead white gaps. Trim the ~250px empty bands before Typography and Components, and fill or collapse the empty top of the assets right column, for example by bottom-aligning less or lifting "Need brand assistance?" to the card's top, so each screen still brings one thing in.
4. Give the demo "Card Title" card a visible hover (the 2.5° tilt or a hairline/fill change), plus visible hovers on the Secondary and Link specimens, since the copy promises hover states.
5. Drop to 2 dark rooms. For example, make the assets card graphite inside a light section, or make the 02 panel quiet `#f5f5f5` with the glow as its object.
