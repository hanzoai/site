# /solutions/: James-eye review
Verdict: 7/10
First complaint: "The top's nice, the card flicks through the teams. Then it's a long wall of black boxes, and the pictures aren't even theirs: click Industries and Cybersecurity suddenly has Finance's diamond. And on my phone, opening one leaves a black slab over the header."

Walked 2026-11-07 on the dev server at 1470x801 and 375x812, moving (scroll walk, frames 700 ms apart, hover/press probes, tab filter, two tiles opened per size after warming /solutions/finance/ and /solutions/data/, Back, 4 cold loads).

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.**
   - The h1 is cut in by line mask (mid-mask at 400 ms; 52px desktop, 40px phone). The lede and asks fade in under it.
   - The hero card is the object: it cycles 01 to 07 teams about every 4 s (01, 02, 03 at t=0, 2, 6 s), with ambient art and a progress line. Pause control at 44px.
   - The h1 sits low on desktop: its bottom is at 59% of the viewport, against a brief of about 38%. Phone is 36%, fine.
2. **One in, one out: half.**
   - Hero, then a 17-tile grid, then the Reserved band. The grid is about 2,450px of black tiles, all 397px tall, six rows. Tiles only rise in (translateY 18px to 0). Nothing pins or scrubs, and nothing leaves as the next thing arrives.
   - There is a dead white stretch of about 290px between the hero card and the Teams/Industries/Use cases row.
3. **Real visual in every section: yes, but repeated.**
   - Every tile has idle ambient art (Finance art differs over 700 ms). But there are only about 8 motifs for 17 tiles, assigned by slot. Diamond: Finance/Design; ring: Operations/Cybersecurity; mountain: Marketing/Financial services.
   - The art follows the slot, not the solution: under Industries, Cybersecurity takes the diamond that Finance had. The pictures say nothing about the item.
4. **One ask, rhythm: mostly.**
   - Header "Try Hanzo" is quiet while the hero ask is in view, then solid on desktop. Nothing floats over content.
   - The hero has a solid Try Hanzo and an outlined pill for Contact sales. The brief wants a text secondary.
   - Scale: wide tiles have 40px titles and narrow ones about 26px, and Reserved is 84px. That is real big/medium/small.
   - Shared: on phone the header "Try Hanzo" is always solid, which competes with the hero ask (shared chrome).
5. **Hover/press: yes.**
   - Primary hover goes #0a0a0a to #262626, press is scale .97. The secondary gets a #f5f5f5 fill.
   - Tile hover shows a white arrow disc, art at scale 1.18 and the five Hanzo capability lines (the hover tells you something). Press is scale .972.
   - The tabs have a pill that moves to the chosen tab. The grid is blank for about 150 ms mid-filter.
6. **Overlap, swap, shift: transitions only.**
   - Static: CLS 0.0003 desktop and 0 phone. No horizontal overflow, no font swap seen.
   - Phone open (Data): the row grows to a full-screen black card over the header, which is right. Then at about 1.2 s the destination is up but a black slab still covers the header and the h1. It fades through grey and clears at about 1.6 s.
   - Desktop Back at 150 ms: the header is drawn mid-screen at y=418 over a grey wash for a frame.
   - Phone Back lands at scrollY 0, so the place in the list is lost. Desktop restores near the place (700 vs about 600).
7. **Reference: synchronized.studio, partly there.**
   - Desktop open (Finance): the tile expands to the viewport (about 1 s) and its art becomes the destination's art band. That is the right idea.
   - The tile title shrinks from 40px to about 17px and vanishes. It never lands on the h1 "Hanzo for finance teams" at 159,220 (brief: within 12px). Landing totals about 1.0 to 1.5 s, against 600 ms in the brief.
8. **Differs from neighbours: moderately.**
   - Same text-left, object-right hero as /integrations and /enterprise. The object here is a cycling dark card, against an orbit there and a nested diagram on /enterprise. The tile wall is its own.
9. **18 parts: gaps.**
   - Catalogue screen 1 asks for a search, and there is none. The counts are only superscripts (07/07/03), with no focal count figure.
   - No proof strip before the closing Band. Morph exists, but the title hand-off is missing.
   - Phone list rows look right (thumb plus 44px arrow); 0 targets in main under 44px on phone.
10. **Banned tells: none found.**
    - Monochrome throughout, Zen font, no badge above the h1, no hue.
    - The "TEAMS 01 / 07" mono label above the card title is inside the object, not above a headline.
11. **Copy: untouched.** parity.py: text 47/47, links 20/20.

Console: 0 errors on 4 of 4 cold loads (2 desktop, 2 phone). A hydration warning and Startups.jsx parse errors seen once were another page's hot recompile, not this page.

## Fixes (in order)
1. **Give each solution its own art, keyed by slug, not by slot.** The picture should stay with the item when filtering, and no motif should appear twice among the 7 shown under a tab.
2. **Fix the open hand-off.** Morph the tile title into the destination h1 (within 12px), cut the land to about 600 ms, and on phone clear the ghost before the header and h1 paint. Make Back reverse cleanly: no mid-screen header frame, and keep the list position on phone.
3. **Break the black wall.** Close the 290px gap above the tabs. Then either vary the tile heights by row, or let one tile per row grow or pin as it reaches centre, so the grid has one moment instead of 2,450px of equal fade-ups.
4. **Polish:**
   - Make Contact sales a text link.
   - Lift the desktop h1 toward 38% of the viewport.
   - Add the catalogue search and a focal count, if Hanzo's copy supports them.
