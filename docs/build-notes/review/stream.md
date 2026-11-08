# /stream/: James-eye review

Ready: 8 Nov 23:27, copycheck missing 0 of 40 (captured page), Hanzo's images kept. The bootstrap server and the hanzoai/stream chip now read as their own lines, and Hanzo's Mori art (the black card behind the six facts on live) stands under 'Your clients, our store'. taste/unique/parity OK (75/75); 0 console errors, no overlap at 1470 and 375.
Verdict: 6/10
First complaint: "The opening's nice, the lanes ticking, but they're crashing straight into the title, there's an error label sitting on top of the numbers, and on my phone that little 'committed offset' pill floats over the text the whole way down. Then it's six grey boxes of paragraphs and nothing moves."

Walked 2026-11-07 (run 3) on the dev server at 1470x801 and 375x812, moving. Judging frames taken 1.6 s at rest after each scroll (the pinned rail smooths). 4 cold loads: 0 console errors.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes on motion: at 300 ms the h1 is mid line-mask and the four partition lanes are already sliding (frames 700 ms apart differ). Selling is weaker: the h1 box (top 399px) sits 1px under the last lane (bottom 398px), so the 52px title reads as a fifth row of the diagram, not the headline.
   - The lower 190px of the hero is empty black. At scroll 401 the lanes have gone and the screen is about 430px of empty black above the rail: a dead stretch of half a screen.
2. **One in, one out?** Desktop yes: the 3,845px pinned rail moves cards sideways, the focused card's number turns to solid 0003 ink and grows, the strip highlights its offset cell, and "committed offset 0003" counts in the footer line. That is a real moment.
   - Phone no: the rail stacks into six tall paragraph cards from y406 to about y5,280 (≈6.5 screens) and every rest frame there is still. It is a document.
3. **Real visual in every section?** Hero lanes, the card rail with offset strips, the code block plus call checker, the band lane. Yes, but the band reuses the hero's lane (partition 0, committed-offset pill) instead of a new object.
4. **One ask, nothing floating, scale rhythm?** Desktop: one solid hero ask (GitHub), rhythm is good (52px h1, 26px heads, a growing focus number, 13px mono). Phone fails: the "committed offset 000N" pill is fixed at the bottom over card body text on every stop (y812: covers "batch is..."; y2436: covers "client resets"), and it already sits over the hero on first load.
   - Shared: header "Try Hanzo" is always solid on phone, and the header ask swaps Try Hanzo → GitHub timing. Not this page's fault.
5. **Every hover and press answers?** GitHub asks: bg #f5f5f7 → #fff and press scale .98, fine. Copy: inset tint and press scale .94. But the hero client names (kafka-python, sarama, confluent-kafka, franz-go) look like tabs next to a filled pill and do nothing on hover or click. The 12 API chips in the checker look like chips (21px tall) with no hover, cursor `auto`. Typing in the checker does answer ("DescribeAcls is not among the twelve...") which is nice.
6. **Overlaps, font swap, layout shift?**
   - Desktop hero: the "INVALID_RECORD" stamp fades in over cells 1265/1266 so the text collides (hero-b frame, x1299-1445, y300-345).
   - Partition labels sit over the sliding cells, leaving digit fragments ("2", "8", "12") beside them.
   - The hero Pause button is at x1455-1503, past the 1470 edge: about 33px of it is off screen.
   - Phone hero: "my-service · consumer down ..." truncates with an ellipsis and covers the "partition 1" label.
   - No font swap seen.
7. **Reference?** apple.com pinned scene (the rail) is genuinely there, and the measured scrubbing reads smooth. No synchronized.studio or editorial pointer detail.
8. **Different from neighbours?** Partly. /pubsub is also a black hero with numbered offset tiles and a GitHub ask; /stream's full-bleed lanes differ in layout but share the medium and vocabulary.
9. **18 parts?** Hero, one ask, proof chips (Apache-2.0, 4 stars), objection (Stateless, Durable), code with copy, band, footer. Pause control is present but partly off screen; the phone floating pill breaks part 11 (one bottom layer that never covers content).
10. **Banned tells?** Floating panel over text on phone. The client-name row and solid pill sit above the h1 in the hero (top right, not a kicker, but it reads as tags over the headline). No hue, no gradient text, no Inter.
11. **Copy untouched?** Looks intact; the checker's "is not among the twelve APIs Hanzo lists" sentence should be confirmed as a register string.

## Fixes (in order)
1. Phone: kill the fixed "committed offset" pill or dock it inside the rail heading so it never covers text; hide it in the hero.
2. Hero: give the h1 at least 44px clear of the last lane (or move lanes behind/under the copy with a gradient), stop INVALID_RECORD drawing over cells (give it its own slot or replace the cell), and pull the Pause button inside the 1470 edge.
3. Phone rail: give the stacked cards a motion of their own (offset strip ticking at rest, focus card growing on entry, or a sticky one-card stage) and trim the dead half-screen of empty black after the hero on desktop.
4. Make the client names real controls (choose a client, the code snippet or a lane label answers) or drop the tab look; give the API chips a hover that lights the matching state in the checker.
5. Give the band its own object instead of repeating the hero lane.
