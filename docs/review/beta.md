# /beta — James-eye review

Verdict: 7/10
First complaint: "The top's mostly empty. A headline, a button and a big white gap on the right, and the actual products are cut in half by the fold. On a first visit the bottom half's blank for a second or two. On the phone I've got two black buttons fighting each other."

Walked 2026-11-07 16:18 UTC, HEAD abcbf980, at 1470x801 and 375x812 (isMobile, hasTouch). What I did: first screen captured at 0.2/0.6/1/2/3/6 s on a first and a return visit, with pixel diffs; wheel-scrolled the whole page in 200px notches with dwell; hovered and pressed the hero ask and the rail tiles; opened and closed a pass card (Escape) and tapped one on the phone; toggled pause/play; reduced motion with a scroll-through; JS off; ran taste.py and parity.py.

## What works
- The pass cards open into their page. Clicking Research access morphs the card into a full sheet (film, h3, lede, Apply), and Escape or the veil closes it cleanly. On the phone it becomes a full-height sheet. This is the synchronized.studio move, done properly.
- The page is alive without input. The h1 cuts into its line, the Kai/Enso/Zen films loop on the rail, and the Dev/Studio sketches type and animate. The first screen keeps changing about 2% a frame-pair after 3 s and never goes dead. Pause works (aria-pressed flips, 0% change while paused).
- Real objects in every section: the rail of 5 product tiles, the Beta/Research/Design bento (1 large and 2 stacked, not 3 equal boxes), and the black Feedback band with the Kai film. The band opens from an inset card to full width.
- The hero ask answers: hover moves the fill from #0a0a0a to #2c2c2e, press scales to 0.98, and nothing fades. Rail tiles get a border, an arrow chip and an underlined name on hover.
- On desktop the header ask goes outlined while the hero Apply is visible, then becomes "Apply" further down. That gives one solid fill per screen on desktop.
- taste.py OK (no hue), parity 12/12 text and 4/4 links, no horizontal scroll at either size. Reduced motion lands in the final states (the cells are unclipped and the band text is visible). With JS off the page is legible.

## The 11 answers
1. **Sells in 5 s / moves in 1 s:** The h1 cut-in starts within 1 s, and "Get there first. Early access to Dev, Studio, Kai, Enso and Zen. Apply" is clear. But at 1470x801 the right half of the hero is empty white, and the rail (the hero object) starts at y=501, so only its top half shows. On a cold first visit the rail area is still blank at 1 s (the tiles land between 1 and 3 s; desktop diff 16% to 2.8%, phone 41% to 4%). On a return visit they are there by 1 s. Partial.
2. **One in, one out:** Mostly yes. There are 4 short screens with clip-path rises and the band opening. Two dead white gaps break the rhythm: about 250px between the rail and the bento, and about 200px before the band.
3. **Real object per section:** Yes, for all 4.
4. **One ask, sticky header, scale rhythm:** Desktop passes. **Phone fails.** The header keeps a solid black "Try Hanzo" while a full-width solid black "Apply" sits under the lede. That is two different asks and two solid fills in the first viewport, and the header never switches to Apply on the phone. Scale rhythm is fine: 52px h1, medium tiles, one large Beta card, a big "Feedback" only in the closing band.
5. **Hover and press:** Yes on the ask, the tiles and the cards (the card opens). There are no layout jumps.
6. **Overlaps / font swap / shift:** The h1 box is stable. Minor issue: on the Design partner card the "+" button sits on the right edge of the sketch panel, and the title "Design partner" is crammed 8px under that panel (desktop). On the phone the panel and the "+" crowd the card top. There are no overlaps of nav, hero or buttons.
7. **Reference:** synchronized.studio (card into page) is clearly present. The Apple "one idea per screen" is weakened by the half-shown rail and the empty right column.
8. **Different from neighbours:** Yes. Its own medium is the product rail, plus a bento that opens into sheets.
9. **18 parts:** Not fully verifiable from a walk. The ask, the states (pause, sheet focus with autoFocus close, Escape), reduced motion, JS off and parity all hold. The JS-off film tiles show native video controls (0:00 bar), which counts as browser-default chrome in that state.
10. **Banned tells:** None in the UI. There is no eyebrow above an h1 or h2 ("HANZO BETA" sits over the rail, not over a heading). There is no hue, no gradient text, no fading buttons and no 3 equal boxes. The phone's double solid ask is the nearest breach (rule: one solid fill and one ask).
11. **Copy untouched:** Yes, parity is 12/12 and 4/4.

Console: 0 page errors on repeat runs. One first-visit run showed a React hydration mismatch in the shared `FooterHTML` (the red "1 Issue" badge). It did not reproduce on 3 later runs or on /about/. It is shared, not this page's code, but the owner should know.

## Fixes (in order)
1. **Phone: one ask.** On /beta the header ask should read and act as "Apply" (or go outlined, as desktop does, while the hero Apply is on screen) so the 375x812 first screen has one solid fill and one ask, not "Try Hanzo" and "Apply" both in solid black.
2. **First screen: pull the rail up and fill the stage.** At 1470x801 the 5 tiles should be fully in the first viewport, or the hero should give the right half to the rail. Today the right half is blank and the products are cut by the fold. Also make the rail's posters render with the HTML, so a first visit is not blank under the ask for 1 to 3 s.
3. **Close the dead white gaps.** Remove the ~250px gap between the rail and the passes and the ~200px gap before the band, so one thing hands to the next.
4. **Design partner card:** give the sketch panel room. Keep the "+" off its edge and put at least 17px between the panel and the title. Check the phone stack too.
5. Minor: with JS off, hide the native controls on the rail and band films (poster only). Under reduced motion, stop the scroll-linked rail scale (it still reaches 1.027).
