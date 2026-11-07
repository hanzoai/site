# /network: James-eye review (independent critic, 7 Nov round 4)

Verdict: 7/10
First complaint: "I watch the little dot hop round the map for ten seconds, then it just stops, and there's a big black play button sitting next to my Buy Compute. The top goes dead. And on my phone, in the models bit, a circle is sitting on top of the 'zen' label."

Walked on the dev server at 1470×801 (hover-capable Chromium) and 375×812 (touch), moving, with the cookie bar dismissed. I waited on every screen, hovered and pressed every control, and ran `scripts/motion.mjs /network` and `scripts/parity.py /network` (OK, 37/37 text, 5/5 links). Judged from `components/pages/cloud/Network.jsx`, `Network.css` and what renders, not from the builder's notes.

Proof: `img/network-hero-rest.jpg` (desktop hero about 11 s after load: the demo has stopped, and the solid black play disc sits in the hero). `img/network-phone-ch4-overlap.jpg` (375×812, chapter 04: peer 04's circle covers the "zen" tag on peer 03, and the "kai" tag runs to the tile's edge).

## The 11 answers
1. **Does it sell in 5 s and move within 1 s? Yes.**
   - Desktop: the h1 (52px) cuts in. The lede and "Buy Compute" sit together on the left. On the right, the live peer map shows Hanzo's model renders as 32px crops, and a request walks from "you" within the first second.
   - Phone: h1 at 40px, the lede, the ask at y 322, then the map.
   - **But the hero runs once and then rests.** After about 10 s nothing on the first screen moves. `motion.mjs` reports desktop screen 1 as STILL, with 0 changes. The rest state also turns the pause control into a 44px solid black play disc, so the hero has a second solid fill beside "Buy Compute".
2. **Does one thing come in as one goes out? Yes.**
   - The pinned chapters keep one stage and change one fact at a time: the struck "region ▾", links thickening by the work, attested peers filling, the kai route and the uta placement, a machine joining, and the work settling into a Merkle root.
   - The black room then holds the two ends, and the close holds "Get Network". It does not read as a document.
3. **Does every section hold a real visual object? Yes.**
   - The hero and the chapters each have a map.
   - The black room has the strand and two graphite ends, with the prompt box under them.
   - The close has the Sigil tile.
   - Monotony risk: everything is grey dots and hairlines. The model crops and the black room are what break it up.
4. **One ask, nothing floating, scale with rhythm? Yes on all three.**
   - The header's ask turns from "Try Hanzo" (outlined) to a solid "Buy Compute" once the hero ask leaves the screen. It drops back to outlined while the close's solid is in view, so there is one solid fill per viewport (except the play disc, answer 1).
   - Phone: a slim, outlined "Buy Compute" bar at the bottom that covers nothing.
   - Scale: the h1 is 52, chapter titles 32, the black room heading 26, and "Get Network" grows as it arrives.
5. **Does every hover and press answer? Mostly.**
   - Pointing at a peer draws its route dashed and names what it has loaded ("you → peer 06 → peer 04 · enso loaded"). That is the right kind of hover: it tells you something.
   - The model and lend pills fill #e4e4e7 on hover, press to .97 and slide on a 300 ms ease-emphasis.
   - The two ends deepen #171717→#262626 and send a pulse down the strand in their direction.
   - "Run a Node" and the docs link firm up their underline. The text links press 1px.
   - Miss: hovering the rested play disc turns it #f2f2f2 while its glyph stays white, so the control vanishes under the pointer. The CSS is in shared `LivePause.css`, but it is this page's hero that shows it.
   - `motion.mjs` also flags the shared chapter-index buttons, `Copy` and the ghost GitHub button as dead hovers.
6. **Overlap, font swap or layout shift? One overlap. CLS is clean** (0.001 desktop, 0.0006 phone), and there is no font swap or horizontal scroll.
   - **Overlap at 375×812, chapter 04:** peer 04's ring sits on peer 03's "zen" tag (see proof), and the "kai" tag runs to the tile's edge.
   - At 1470 the same ring touches the bottom edge of the black "kai" tag.
7. **Which reference, and is its motion there?**
   - apple.com: the pinned stage where one panel changes per fact. It is there and done well.
   - motion.dev patterns are present: the layoutId pill, the line-art draw-ins and the cut-in.
   - synchronized.studio: there is no card-into-page flight on this page.
8. **Different from its neighbours? Yes.**
   - /network's hero object is the fabric, a peer map with model renders.
   - /node keeps the terminal and the machine.
   - The Cloud close and the agent prompt are the shared family system.
9. **Are all 18 parts covered? Substantially.**
   - Header comment, one h1, `data-cta` and `data-thumb` on the primary, `JsonLd`, metadata from `pages.json`.
   - Kit parts only (`Img`, `A`, `Copy`).
   - A reduced-motion path exists in the CSS and the JS.
   - The pause control comes first in the toolbar, and there are 44px targets.
   - The gaps are in answers 1, 5 and 6.
10. **Any banned tells? None.**
    - No hue beyond Hanzo's own renders, no green, no gradients, no springs.
    - No eyebrow above a headline: "01 / 06", "call it" and "serve it" sit under their titles. "Compute Marketplace" heads the map's toolbar, not a heading.
    - No floating panel, no buttons that fade on hover.
11. **Is the copy untouched? Yes.**
    - Parity 0 missing.
    - The diagram's labels ("ask the fabric for", "nothing billed", "attested", "declared", "CI runner", "block reward", "Merkle root") come from Hanzo's own `/network` copy.
    - The drawn hash "0xa96d…e4" and the peer numbers are illustration. Keep them visibly diagrammatic.

**Shared chrome, not counted against the page:**
- A hydration mismatch in the site footer (`FooterHTML` `__html` differs) intermittently puts the dev server's red "1 Issue" badge on the page.
- During the walk, another chat's `Newsletter.jsx` parse error showed in the console.
- On phone, the header's "Try Hanzo" is a solid fill beside the hero's solid "Buy Compute".
- The `LivePause` hover bug (answer 5).

## Fixes to reach 8
1. **Keep the first screen alive after the demo rests.** Once the four asks finish, let one quiet idle mover keep running on the resting placement route. The chapters' small ink bead looping you → peer 06 → peer 07 at 2.4 s would do, with one mover only, paused by the same control and frozen under reduced motion. The demo still "ends at rest" as a story, but the screen is never STILL. Then rerun `motion.mjs`: desktop screen 1 should no longer report STILL.
2. **Take the solid fill off the play disc.** In page CSS, override `.nw .nw-pause[aria-pressed='true']` to the quiet state (white with a #d4d4d4 ring and an ink glyph, as the pause looks). Give it a hover that keeps the glyph visible (#f2f2f2 fill, ink glyph). "Buy Compute" is then the only solid in the hero. File the invisible-glyph hover for `LivePause.css` in `docs/requests/network.md`.
3. **Clear the chapter-04 collision at both sizes.** Peer 04's ring must not touch peer 03's tags:
   - Nudge peer 04 in the chapters' map, or flip peer 03's tags to its left in step 3, as `.nw-sp[data-p='4']` already does for peer 4's own tags.
   - At 375, hide peer 03's "zen" tag in step 3: only the kai hit matters there.
   - Then check that the "kai" tag keeps 12px from the tile edge at 375.
