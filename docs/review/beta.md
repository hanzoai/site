# /beta — James-eye review

Verdict: 8/10
First complaint: "It's the same three pictures over and over. Kai, Enso and Zen in the strip, then Enso and Zen again in the cards, then Kai again at the bottom. Give each screen its own thing."

Walked 2026-11-07 16:29 UTC, HEAD 27ecbacd, at 1470x801 and 375x812 (isMobile, hasTouch). First visit and reload sampled at 0.2/1/3/6 s with pixel diffs; wheel-scrolled the whole page in 200px notches with a 0.7 s dwell; hovered and pressed Apply, the strip tiles, the pass cards and the Feedback band; opened and Esc-closed the pass sheet; toggled the strip pause; tapped on phone and swiped the rail; checked reduced motion and JS off; ran taste.py and parity.py.

## What works
- The first screen sells at once: "Get there first." at 52px, lede with the five product links, one solid Apply, then a strip of five real objects: Kai, Enso and Zen films, plus live Dev and Studio sketches that write themselves.
- Alive without input: the h1 cuts in, the tiles settle from staggered heights, the films loop and the Dev/Studio sketches type and play. Pixel change 28% (0.2 to 1 s), 11% (1 to 3 s), and still 2 to 4% after 6 s, so it never goes dead. Return visit behaves the same.
- The pause control (44px, aria-label Pause/Play, aria-pressed) really freezes the strip: identical frames once paused.
- Passes are one large card plus two stacked, not three equal boxes. Each "+" opens a full film sheet (native dialog, Esc closes, focus returns) with a large title and its own Apply. That is the synchronized.studio card-opens-into-a-page idea, done well.
- Apply: hover darkens the fill (#0a0a0a to #2c2c2e, not a fade), press is scale .98. Strip tiles lift the film 12px, draw an ink hairline, underline the name and show an arrow chip; press is scale .97. Pass cards lift the image 16px and turn the "+" 90 degrees. The Feedback arrow moves 6px up and to the right. No layout shift anywhere.
- The header swaps "Try Hanzo" for the page's "Apply" once the hero ask scrolls away (desktop).
- Palette is monochrome; colour comes only from the films. taste.py OK; parity OK (text 12/12, links 4/4).
- Reduced motion shows the final state: no running animations after 3 s, and the tiles sit level. JS off: everything is legible, including the strip, the passes and Apply.
- No page console errors, no failed requests, no horizontal scroll (1470 and 375).

Shared (not counted): the red "1 Issue" badge is the FooterHTML hydration mismatch (layout.jsx > FooterHTML > dangerouslySetInnerHTML). It reproduced on 4 of 4 desktop loads and 3 of 4 phone loads, and its diff points only at the shared footer.

## The 11 answers
1. Yes. The h1, Apply and five moving objects are all inside the first screen at both sizes, and motion starts within 1 s.
2. Mostly one in, one out: hero strip, then passes, then the Feedback room, then the footer. The page is short and never reads as a document. At 1470x801, though, the Beta access card is 744px tall against a 741px viewport, so it can never be seen whole: its "+" and its Apply are never on screen together.
3. Yes. Films and sketches in the strip, a film or sketch in every pass card, and the Kai film in the Feedback room.
4. The one solid ask is Apply in Hanzo's words, and it moves into the desktop header after the hero. On phone the header keeps "Try Hanzo" all the way down (checked at y=0, 800 and 2000), so a phone visitor sees two different asks. Nothing floats over content apart from the shared cookie card. Scale has rhythm: a 52px h1, a 32px lead pass, 21px secondary passes, and a large Feedback link that closes the page.
5. Yes. Every hover and press I tried answers with transform, line or fill, not opacity, and nothing jumps.
6. No overlaps, font swap or layout shift at either size. (The full-card hit buttons cover their own card text by design; nothing is visibly covered.) Polish: on phone the rail rests at scrollLeft 16, so the first tile sits flush against the screen edge instead of on the 16px gutter.
7. synchronized.studio (card into sheet) together with an Apple-style product strip. The sheet open and the tile lift are actually there.
8. Its own hero medium: a staggered five-tile film-and-sketch strip under a split h1/lede/ask row, with the pass sheet as the signature. I did not walk the neighbouring pages in this run.
9. The parts I could see are covered: one h1, one solid ask with data-cta="beta.hero", a pause control, a dialog, reduced motion, JS off, Feedback/Book a call as the closing band, then the footer. There is no proof strip, but /beta has no proof copy to show.
10. No banned tells. "HANZO BETA" is a mono caption over the strip, not over a heading. There is no hue, no gradient text, no three equal boxes and no fading buttons.
11. Copy is untouched (parity 12/12 text, 4/4 links).

## Fixes (in order)
1. Stop repeating the same three films. Enso appears in the strip, the Beta access pass and its sheet; Zen in the strip and Research access; Kai in the strip and the Feedback room. Give the passes and the Feedback room media of their own (for example the Studio/Dev sketch at large scale, or a different Hanzo still), so each screen has its own object.
2. At 1470x801, cap the Beta access card so it fits under the header (at most about 100svh minus 60px minus the section gutter). Its "+" and its Apply should be visible together.
3. Phone header: swap "Try Hanzo" for "Apply" once the hero Apply leaves view, the same way desktop does, so the page has one ask at every width.
4. Phone rail: add `scroll-padding-inline: 16px` (or start it at scrollLeft 0) so the first tile rests on the gutter, not on the screen edge.
