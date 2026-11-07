# /solutions/: James-eye review
Verdict: 7/10
First complaint: "It's seventeen black boxes with the same five or six pictures in them. The diamond one is on Finance, Design, Cybersecurity, Financial services, Law and Government. Click one and it goes black for a second and then you're on a different page."

Walked 2026-11-07 16:20-16:45 UTC on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving. Before timing I warmed /solutions/engineering/, /law/ and /retail/. Page 200, parity 47/47 text and 20/20 links, CLS 0.0002 desktop and 0.0000 phone, h1 box steady from first paint. 0 console errors across 8 cold loads.

## The 11 answers
1. **5 s / 1 s.**
   - Sells: the h1 is 52px (40px on phone), with a lede, Try Hanzo and Contact sales.
   - Moves within 1 s: the hero card deck rotates by itself (01/07 Finance to 02/07 Data, with a progress hairline and a pause button), and its art is live.
   - Frames 700 ms apart differ. Phone shows h1, lede, both asks and about 290px of the deck inside 812px.
2. **In and out.**
   - Hero, then the filter, then the grid, then the Reserved tier black band (84px, the one big moment), then the footer.
   - The grid reads as a wall: 17 tiles over about 2,500px at desktop, and 17 rows of 72px on phone.
   - The tile whose row crosses the viewport centre swaps its sentence for the 5-line mono list. That is the only in/out inside the wall.
   - The walk flags motion at stops 0 to 6 (the art moves). Only the footer is still.
3. **Visual objects.** Every section has one: the deck, the tile art, the band ring. But the 17 tiles share about 6 drawings:
   - diamond stack ×6
   - sphere ×2 (Data, Research)
   - ring ×2 (Operations, Agents)
   - frames ×2 (Sales, Retail)
   - mesh ×2 (Engineering, Education)
   - Marketing, Healthcare and Content creation each have their own.

   Everything is the same black tile. This is "too many repeats" in his words.
4. **Ask and scale.**
   - The header has one ask. Nothing floats over content on desktop.
   - Scale: h1 52, tile titles 40 and 26 alternating with the tile width, mono 13, band 84. The rhythm holds.
   - The Catalogue brief's hero figure (the exact count, plus search) is missing. The counts show only as 07/07/03 superscripts on the filter.
   - Shared issue (not this page's): on phone the header's Try Hanzo is always solid, so the first screen has two solid fills.
5. **Hover and press.**
   - Primary: on hover the background goes #0a0a0a to #262626; press scales to 0.974.
   - Tile: on hover the product list and a white arrow disc appear; press scales to 0.97. No tilt (computed transform none).
   - Filter tab: a grey pill glides under Industries. The grid re-flows with a layout animation and renumbers 01/07 to 07/07.
   - No jumps.
6. **Overlap and shift.**
   - The Engineering tile (06/17, wide, right column) has a square black corner poking out past its 20px radius at the top right. It is there at rest and on hover.
   - The hero deck's sphere art sits behind the white lede on Data (desktop and phone).
   - Mid-filter (150 ms) the tiles overlap during the layout move. That is acceptable as transition.
7. **Reference.** synchronized.studio is present but rough. Two opens:
   - **Desktop**, Engineering and Law tiles: the tile grows to a full-viewport black stage with the title at top left (Engineering at 209,204). The URL changes at 0.89 to 1.02 s, and the destination is settled at 1.0 to 1.2 s. The art is upscaled and soft while it grows. The destination's hero band is the same art (good), but the title lands as a cut, not a move: the stage says "Engineering", and the h1 "Hanzo for engineering teams" sits at 159,220. For about one frame the rising band clips the h1's second line.
   - **Phone**, the Law row: a 48px thumbnail jumps to a full-screen black "Law" stage. The page appears at about 0.9 to 1.0 s, with the art as the band under the h1. Underneath the stage the destination opens at the old scroll offset (h1 at y -1507), then scrolls itself to the top over about 700 ms. The stage hides this.
   - **Back**: no reverse morph. For about 150 ms the header and grid slide up from y 560 over white, then the grid is restored at scrollY 1113.
   - The 700 ms hold cap is exceeded on both.
8. **Neighbours.** It matches PAGES.md: a three-way selector, and the hover previews the list. Its look (dark art tiles) is the same family as /models' black cards. A distinct medium: the self-rotating deck.
9. **18 parts.** Present: one h1, breadcrumb n/a at depth 1, numbered 01/17 grid, filter pill, Morph, band, footer. Missing: the count/search hero (part 15 and §4.3) and the Back reverse (part 3). Other parts were not audited.
10. **Banned tells.** None found:
    - no hue
    - no eyebrow over the h1 (the TEAMS label sits inside the deck card, not above a heading)
    - no fade-on-hover buttons
    - no glow
11. **Copy.** Untouched: parity 47/47, links 20/20.

## Fixes (in order)
1. Give each of the 17 tiles its own drawing (seed or vary the Sigil/art per slug). No drawing should appear more than twice, and the diamond should not repeat in neighbouring tiles. Break the all-black wall: let one row per screen be a wide feature tile, and set some art on the silver room.
2. Tighten the open:
   - The stage title should move to the destination h1's box (within 12px) instead of cutting from "Engineering" to "Hanzo for engineering teams".
   - Cap the black hold at 600 ms (prefetch the route on pointerenter so the URL is ready).
   - Draw the art at full resolution instead of upscaling the tile bitmap.
   - Reverse on Back, instead of the 150 ms white slide with the header mid-screen.
3. Add the Catalogue hero figure: 17 (the exact count from content/pages.json) with search, near the h1. Keep the filter pill.
4. Polish:
   - Clip the Engineering tile's art to its radius (overflow: hidden plus border-radius on the art layer).
   - Move the deck's sphere off the lede on Data (gradient under the text, or offset the art).
   - On phone, use a slower row-to-stage open from the thumbnail's own box, so the 48px picture visibly grows.
