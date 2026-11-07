# /solutions/: James-eye review
Verdict: 7/10
First complaint: "The same pictures are bunched together. Marketing and Financial services, Operations and Cybersecurity, Finance and Design are all on one screen with the same film. And when I click a card it goes to a black screen, sits there, then the page shows a different picture."

Walked 2026-11-07 17:13 UTC on the dev server at 1470x801 and 375x812, moving. All 17 solution pages were warmed first, so compile time is not counted.
## The 11 answers
1. First screen sells, and it moves within 1 s
   - h1 52px with a lede and two asks on the left. On the right is a black self-running card (kai.webm playing, "TEAMS 02 / 07", a progress bar, pause) that rotates through the teams.
   - The frames at 300 ms and 1000 ms differ. The card is the moment. The 17 count is not a focal figure, and the hero has no search (MASTER 4.3 screen 1).
2. One in, one out? Partly.
   - It is a 17-tile bento grid, about 4 screens of black film tiles (2 large tiles and 1 small per row). Every tile loops, so nothing is dead. It still reads as one long wall: no pinned stage, no change of pace until the Reserved tier band.
   - Dead white gaps: about 240px between the hero and the filters (y 180-420 at 1470), and about 160px above the band.
3. Real visual in every section: yes. Hero card film, 17 film tiles, Reserved band film (enso), footer. Phone rows carry 56px stills.
4. Ask, header and scale
   - The ask is "Try Hanzo" in the sticky header (outline at the top, solid once scrolled), and "Contact sales" is the outline second. Nothing floats over content.
   - Scale is mostly right: h1 52px, tile titles 40px (17px small-tile labels on phone), Reserved tier 84px as the one big moment. Rows 6 (Research + Agents) and 5 (Government) put two 40px titles side by side at large size.
5. Hover and press
   - Tile hover shows an arrow chip in the top-right corner and the film shifts. Press is scale 0.97. The hero "Try Hanzo" goes #0a0a0a to #262626 on hover and scale 0.97 on press. No layout jump.
   - The hover tells you nothing new (only an arrow, no count or preview).
   - The Teams / Industries / Use cases filters work: a grey pill, and the grid re-filters and renumbers ("01 / 07"). There is no visible glide.
6. Overlap, font swap, shift
   - CLS 0.0002 on desktop and 0 on phone. The h1 box is identical before and after fonts load. No horizontal overflow. Console errors: 0 on 4 of 4 cold loads, desktop and phone.
   - During the open, the tile title is clipped mid-flight ("eering", desktop Engineering frame 0).
7. Reference: synchronized.studio card-to-page, partly delivered.
   - Desktop (Retail, Engineering): the tile grows to the full 1470x801 viewport in about 220 ms and holds black for about 1 s. The route changes at about 1.2 s, then the film drops to its band (0,372,1470x441) at about 2.1 s. The tile overshoots to full screen, then cuts. It never lands on the destination's film band.
   - Phone (Law): the row expands into a black sheet with the koe ribbon. The sheet slides up, leaving a white strip, and the Law page arrives with kai (diamond). The picture changes on arrival.
   - The same mismatch on 5 of 17 cards: Cybersecurity (enso to kai), Financial services (iro to kai), Law (koe to kai), Government (koe to kai), Agents (oto to enso).
8. Different from its neighbours: yes. The bento of model films with a self-running hero card is its own pattern among the catalogues.
9. 18 parts: most are covered (header, hero, filters, grid, band, footer, a11y pressed state, 72px phone rows). Missing: the focal count and search in the hero.
10. Banned tells: none seen. Monochrome, no eyebrow above the h1 (the "TEAMS" label sits inside the card), no fading buttons, and no hue except Hanzo's own films.
11. Copy: parity.py reports OK, text 47/47 and links 20/20.

Repeats (9 films for 17 tiles; judging the spread, not that repeats exist):
- Order: kai, zen, koma, iro, enso, mori, kai, enso, iro, uta, koe, koma, koe, mori, oto, zen, oto. Uta, koe and oto are held back until tile 10, while tiles 1-9 use only 6 films.
- One desktop viewport (y 1362) shows three same-film pairs at once: 01/07 kai, 04/09 iro, 05/08 enso. Koe (11/13) and oto (15/17) are diagonal neighbours.
- On phone, the same pairs sit 2-3 rows apart, on one screen.
- Enso appears a third time in the Reserved band, and kai a third time in the hero card.

Shared chrome (not this page's fault): the phone header "Try Hanzo" is always solid.

## Fixes (in order)
1. Spread the films. Tiles 1-9 should use all nine films once, then repeat in the same order (each repeat 9 tiles later, never in the same or the next row). Keep the hero card and the Reserved band off films that sit in the first visible rows.
2. Make the open land. The tile should morph to the destination's film band rect (about y 372, 1470x441 on desktop), not the full viewport. Drop the roughly 1 s black hold (start the route on press, cross-fade at 600 ms). Keep the title unclipped and scale it toward the destination label position.
3. Make card and page agree. Each tile's film must be the destination hero's film. Today 5 of 17 differ (Cybersecurity, Financial services, Law, Government, Agents). Either change the tile or have the destination take the tile's film.
4. Tighten the 240px gap between the hero and the filters to one section step (116px). Let the filter pill glide between Teams, Industries and Use cases (300 ms ease-emphasis).
5. Let a tile's hover say something: the solution's product line or its count of workflows, not only an arrow.
6. On phone, play the row thumbnail of the row in focus (the one with the filled arrow) so the list is not a column of stills.
