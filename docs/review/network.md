# /network: James-eye review (round 2, independent walk)

Verdict: 8/10
First complaint: "Once the map has done its run the black bit at the bottom just sits there. Two big dark boxes with nothing in them until I put my mouse on one."

Walked moving at 1470x801 (wheel-scrolled, hover pointer enabled, video recorded) and at 375x812 (touch), cookie bar dismissed, frames 1 s apart on every screen. Layout shift total 0.0011 desktop / 0.0006 phone (nothing over 0.005). Console clean on two fresh loads. The one red "1 Issue" badge in the first walk came from a parse error in another chat's `components/pages/Press.jsx` while it was mid-edit, not from this page. `parity.py /network`: OK, text 37/37, links 5/5. `taste.py` on Network.jsx/.css: OK. Proof: `img/network-hero.jpg` (first screen at 1 s), `img/network-room-rest.jpg` (black room left alone: two still frames 1 s apart are pixel-identical).

## The 11 answers

1. **Sells in 5 s, moves in 1 s?** Yes. "Hanzo Network", the lede and Buy Compute sit on the left. On the right a live peer map wears Hanzo's model renders and starts routing "kai" from "you" straight away, so by 1 s a route is lit. The four asks run for about 10 s, then it rests on the uta placement, and a small bead keeps walking the route after that. The idle state is quiet but it is alive.
2. **One in, one out?** Mostly. The pinned chapters do the Apple thing: one map, and each fact changes it (topology draws in, links thicken by the work, attested and declared peers, the kai route and the uta placement, a machine joins, the work settles into a Merkle root). The weak spots are the chapter intro, about 1.5 screens of "How the Network Works" beside a map of hollow circles with no links, and the black room, which stacks the strand, two ends, GitHub, Paste and ship, and docs into one long room.
3. **A real object in every section?** Yes. The hero has the fabric map, the chapters the same map changing per fact, the black room the strand with you and zen, and the close the line-art card. The black room's object is the thinnest: a static strand, plus two dark tiles that are mostly empty space.
4. **One ask, sticky, nothing floating; scale rhythm?** On the page, yes. There is one solid Buy Compute in the hero. The header takes "Buy Compute" solid once the hero leaves and goes back to outline while the close's solid ask is in view. Nothing floats over content on desktop. Scale has rhythm: h1 52px, chapter intro 44px, chapter heads about 32px, room head 26px, close 64px, with mono captions small. (Shared-chrome notes below.)
5. **Every hover and press answers?** Yes, and some hovers tell you something. Pointing at a peer draws the dashed route the fabric would take to it, and the readout says "zen · kai loaded". The model picker slides its pill and reroutes. The lend toggle relabels the joining machine ("CI runner") and swaps the command, and Copy put exactly `hanzo runner` on the clipboard. The hero ask darkens (#0a0a0a to #262626) and presses to a scale of 0.978. The black-room ends lift their fill and fire a pulse along the strand, and press to 0.974. Nothing jumps.
6. **Overlap, font swap, layout shift?** None found at either size. CLS is effectively 0, the h1 box is stable, and tags do not collide at 1470 or 375. On the phone the hero map hides most model tags, so the hero there shows only zen and kai. It is sparse, but it does not break.
7. **Which reference, and is its motion there?** apple.com: one pinned stage where one panel changes per fact, with a progress tick row. That motion is really there and scrubbed. There is a touch of osply/hamol in the pointer route-preview.
8. **Different from neighbours?** Yes. /node is a terminal plus a four-tile machine on the left with the copy on the right. /network is copy on the left and a live peer graph on the right. The signatures differ (an asked fabric versus a node booting).
9. **18 parts?** On the visible surface: one h1, one solid fill, `data-cta` and `data-thumb` on both primaries, a pause control on the hero demo, reduced-motion paths in code, the copy button with confirmation, and the close Band before the footer. Nothing visibly missing for a launch page. (Coverage card not consulted, as instructed.)
10. **Banned tells?** None. No hue (the only colour is Hanzo's own dark model renders), no label above an h1 or h2 ("04 / 06" and "Compute Marketplace" sit below their headings or in the toolbar), no gradient text, no glow, and no button fades on hover.
11. **Copy untouched?** Parity 37/37 text, 5/5 links. The drawn map labels ("idle · nothing billed", "attested ✓", "region ▾", "0xa96d…e4") are diagram annotations, not copy, and they are marked as drawn in the source.

## Fixes that would lift it further (it already clears 8)
1. **Black room at rest:** give the strand a slow idle pulse from you to zen while the room is in view, the same quiet bead the hero uses. Pause it on hover and under reduced motion. Right now the room is pixel-still unless pointed at.
2. **The two ends:** the dark tiles are about 280px of empty fill. Shorten them to roughly half height, or let each tile carry its own tiny object (the key's first call, or the node joining), so they read as objects and not plain boxes.
3. **Chapter intro:** shorten the hollow-circle intro so "Peers, not regions" arrives within about one screen of the hero.
4. Small: in chapter five the lend readout repeats the sentence that sits just above it in the body. Consider showing only the command and Copy there.

## Shared chrome (not counted against the page)
- On first paint at desktop the header shows "Try Hanzo" **solid** next to the solid hero ask, so two fills show for about the first second, until the header tools hydrate and it turns to outline.
- At 375 the header keeps "Try Hanzo" solid for the whole walk, while the bottom bar carries "Buy Compute". That makes two different asks, and the header one is not in the page's words.
- When the header passes from the black room onto the white close, it stays black for a beat.
