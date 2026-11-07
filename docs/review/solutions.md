# /solutions/: James-eye review
Verdict: 7/10
First complaint: "Once I'm past the top it's just a wall of black boxes, the same diamond picture over and over, and nothing moves until I touch it. On my phone it's seventeen of them in a row."

Walked 2026-11-07 on the dev server at 1470x801 and 375x812, moving. Two tiles opened on each size (Retail, Agents; plus Finance from the hero card), destinations pre-compiled, 6 s allowed to settle.

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.**
   - The h1 cuts in by line mask (mid-reveal at 300 ms). The hero card runs by itself: Finance 01/07 changes to Data 02/07 at about 4.5 s, with a 44px pause control. Lede and asks fit the first screen at both sizes (phone h1 at 154 to 293px).
   - But the h1 rests at 84px (41px on phone). Resting size is 52px.
2. **One in, one out: partly.**
   - Hero, then the tabs, then the grid, then the Reserved band. The grid itself is a document: 17 tiles over about 2,000px on desktop, and about 6,000px on phone (17 full-width cards, 343x320 each).
   - Desktop walk stops 2, 3 and 4 (y 1362 to 2724) are STILL: three dead screens. Tile art only moves on hover.
3. **A real visual in every section: yes, but repeated.**
   - Every tile has a canvas or art piece. The same diamond-lattice art appears on 6 of 17 tiles (Finance, Design, Cybersecurity, Financial services, Law, Government), and the sphere and ring appear twice each. Seventeen black #000 tiles in a row give James his "too many repeats of the same colours".
4. **One ask, nothing floating: yes. Scale rhythm: no.**
   - Try Hanzo sits in the header, outlined and then filled. No floating bar. Contact sales is the only text secondary.
   - "Teams / Industries / Use cases" are three 84px words in one row, under an 84px h1, with an 84px "Reserved tier" later. That is everything big at once. The tabs should be medium.
5. **Hover and press: yes.**
   - Primary: background #0a0a0a to #262626 on hover, press scale 0.97. Tile hover turns the description into a mono list of the tile's workflows plus an arrow button, which is a real preview. Tabs: a grey pill glides to the chosen word and the counts re-number (01 / 07).
   - Tab switch blanks the grid for about 150 ms before the new set arrives (flash, height jump).
6. **Overlap, font swap, shift: none at rest.**
   - No overflow and no overlap at either size. One console error on phone: "A tree hydrated but some attributes of the server rendered HTML didn't match". Desktop had none.
   - About 250px of empty white sits between the hero card and the tabs (desktop stop 1).
7. **Reference: synchronized.studio, and it is half there.**
   - Desktop: the tile grows to full width and its art becomes the destination's black stage. That part is right. Route changes at about 0.8 s and the overlay is gone at about 1.8 s.
   - The title does not travel: "Retail" shrinks to a roughly 12px label at the top left while the destination h1 "Hanzo for retail" sits at 72px at y 253. The brief asks for the title to land within 12px of the h1.
   - Phone: under the overlay, the destination scrolls from y -4521 to 76 over about 800 ms. On Agents, frames 6 to 8 show the wrong part of the page before it snaps to the top. Settled at about 2.0 to 2.2 s. The hold is well over the 700 ms cap.
8. **Different from neighbours: yes.** A self-running hero card, word tabs and an art tile grid are its own, apart from /models' SPEC cards and /platform's directory rows.
9. **18 parts: gaps.** The Catalogue screen 1 has no focal count figure (counts are only 07 superscripts) and no search. The phone catalogue is not 72px rows (part 15). Morph title landing (part 3) fails.
10. **Banned tells: none found.** No hue, nothing above the h1, no gradient text, no fade-on-hover buttons. The mono "TEAMS" label sits above a card h3, not an h1 or h2.
11. **Copy untouched: yes.** parity.py: text 47/47, links 20/20.

## Fixes (in order)
1. **Phone grid.** Replace the 17 stacked 320px cards with 72px list rows (title plus one-line description, with a small art thumb), or a snap rail per tab. Keep the big art for the tile that opens.
2. **Wake the grid.** Give each tile's art an idle drift while it is in view (one mover per viewport). Stop reusing the diamond lattice: 6 tiles share it. Vary the tile surfaces within the deck (graphite #171717 and the silver gradient beside #000) so the grid stops reading as one black wall.
3. **Scale.** Bring the tab words down to 26 to 32px and the h1 to its 52px resting size (it can grow only as the moment). Close the roughly 250px gap above the tabs.
4. **Morph title.** Carry the tile title at its own size into the destination h1 position (within 12px), 600 ms in-out. On phone, reset the destination scroll to 0 before the overlay lifts, so no scroll is seen. Total hold 700 ms or less.
5. **Tab switch.** Crossfade the old set out and the new set in, with the grid height held (no empty frame).
6. Fix the phone hydration mismatch. Add the exact count as a focal figure in the hero if Hanzo's copy has it.
