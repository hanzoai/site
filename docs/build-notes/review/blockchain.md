# /blockchain — James-eye review
Reviewed: 2026-11-07 16:40 UTC, walked at 1470x801 and 375x812.
Verdict: 6/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). Hero "Try Hanzo" is the one solid on the first screen with quiet product pills in one swipe row, phone h1 sets in 3 lines, pieces fold to 5 on phone with a working Show all (5 → 19 → 5), and piece and close rows answer hover with an arrow nudge even when already lit. taste/unique/parity OK (text 153/153, links 16/16); 0 console errors, no overflow at 1470 and 375. Left alone (shared): the card-to-page Morph landing height and the phone motion.mjs walk stepping only ~91px per screen (scrollBy under smooth scroll), so phone STILL counts from it are not real. copycheck missing 0 of 79 (8 Nov, after restoring one text run per line: facts, piece names, group titles, agent bullets).
First complaint: "The top's nice, the chain name ticking over, fine. Then I scroll and it's a list, another list, an accordion, a list of chain names, then a table of dots. Four screens where nothing moves and nothing to look at. And where's the button? The loudest thing up top is a wall of black pills, not Try Hanzo."

Walked moving with `scripts/.cloud/motion.mjs` (film strips in `shots/blockchain/`) and my own Playwright walk (`/tmp/claude-0/critic-blockchain/r2/`): idle at 0.3 s, 1 s and 4 s, a scroll every 700 px, hovers and a press, console, phone first screen, JS off, reduced motion, and a click through a piece row.

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.** The h1 "One API key, every chain. And an agent that can use it." (52px) reads at once. The `chain:` ticker (64px) moves within 1 s, stepping Ethereum, Solana, Bitcoin and on with a `01 / 32` counter and a progress hairline, and the product pills light per chain. But the first screen has **no solid ask**. The hero "Try Hanzo" is an outlined pill, and the header "Try Hanzo" also rests outlined (transparent background) while the hero is in view. The solid weight goes to 14 black product pills and a black "NOW AVAILABLE" chip instead. At about 0.3 s the h1 is still mid cut-in (desktop strip 1, frame 1, half-masked), which is fine.
2. **One in, one out: no, it is a document.** motion.mjs: desktop screens 2 to 6 (y=900 to 4500) are **STILL**, with 0 changes. After the hero you get a paragraph with tag chips, then a 4-column text stat row, "The pieces" (8 text rows, the left column sticky), "What sits behind the key" (9 accordion rows on `#f5f5f5`), the black agent room with a code block, "The chains" (32 chain names as a text paragraph), then the products × chains dot matrix. That is a docs index. Nothing enters as something leaves. Phone: 9 of 14 sampled screens are STILL.
3. **A real visual in every section: no.** Real objects: the hero ticker, the code block, and the dot matrix (its crosshair walks the cells by itself, e.g. "Hanzo DeFi × Bitcoin: not named on its page · 5 chains across · 1 product down", which is good). The stat row, the tag chips, the pieces list, the accordion and the chain-name paragraph are text only. The left halves of "The pieces" and "What sits behind the key" are large empty voids (desktop scroll 4: a blank grey left half next to rows 05 to 09).
4. **One ask, scale rhythm: partly.** One ask label, "Try Hanzo", in Hanzo's words, and the header turns solid only after the hero leaves view. But on the first screen nothing is solid except decoration (see 1). The closing "Make the first call" ask is outlined too, with "View Pricing" as a full-width row. Scale: the hero has two big things at once, the 52px h1 and the 64px chain word, plus a black pill wall. Below the hero everything rests at 26px heads and 13 to 17px rows, so there is no medium or small "moment" that grows. Nothing floats over content apart from the shared cookie card.
5. **Every hover and press answers: no.**
   - The header ask press scales to 0.97 (good).
   - The piece rows fill `#f5f5f5` and "Get started" darkens, with no jump. That is opacity-adjacent, and the hover tells you nothing new (the chains count is already printed).
   - **Dead:**
     - The accordion rows: the hover fill is `#f5f5f5` on a `#f5f5f5` room, so the pixels are identical.
     - The agent use-case rows ("AI agents that can send on-chain transactions" and the rest).
     - The tag chips (Nodes, Wallets…).
     - motion.mjs counted 14 dead controls on desktop, including the "Pause the chains" hover, "Hanzo Rollups" and "NFT API".
   - The hero "Try Hanzo" hover only greys its background.
6. **Overlap, font swap, shift:**
   - Layout shift is 0.000 at both widths, and there is no overlap at 1470 or 375.
   - **A red "1 Issue" dev badge** appeared on desktop, from a hydration mismatch ("A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"). It is intermittent: seen on a domcontentloaded load, not on a networkidle load.
   - On phone the code block clips mid-word at the right edge ("Ethereum mainn") with no fade or scroll cue.
   - The matrix shows 6 of 41 chain columns, with the dots cut at the edge and no cue.
   - Phone h1 is 4 lines at 40px (the brief says 3).
7. **Reference: none clearly.** The ticker plus the counter is a nod to the Apple "one idea" sub-nav, but there is no pinned scene, no scrubbed strip and no marquee that answers scroll. The card-to-page Morph exists (a piece row opens /blockchain/chains/ with "Hanzo Chains" flying in at about 96px). But it lands low (y≈630 at 350 ms against a destination h1 at y≈235, well past the 12px rule), and a faint ghost "…nzo Chains" stays behind the destination's capabilities card at 1.5 s.
8. **Different from neighbours: yes, in idea.** A typographic chain ticker plus a products × chains matrix is its own signature. No hero film or app render is reused.
9. **The 18 parts:** most pass. One h1, a skip path, JS off fully legible (the ticker shows Ethereum with all pills), reduced motion leaves `getAnimations()` empty with the final state shown, and parity is 153/153 text and 16/16 links. Fails: part 4 (no solid fill on the first screen), part 8 (dead hover states on accordion, list and chips), part 3 (rhythm: 4 quiet text sections in a row), part 17 (a hydration error), part 15 (Morph lands far from the h1, and the ghost lingers).
10. **Banned tells:**
    - The black "NOW AVAILABLE" chip sits beside the h1, under the asks. It is not strictly above the h1, but it reads as a hero badge.
    - The 14 solid black pills make the first screen "in your face".
    - "ONE KEY / ARCHIVE / PUSH / TOOLS" eyebrows sit over h3s, which is allowed.
    - No hue, gradient, emoji or Inter.
11. **Copy untouched: yes.** `parity.py /blockchain`: OK, text 153/153, links 16/16.

## Fixes (ranked)
1. **Give the first screen its one solid ask.** Make the hero "Try Hanzo" the solid fill (the header stays quiet until it leaves, as now). Turn the product pills to quiet: an ink outline or a `#ededed` fill for "named", hollow grey for "not named". Then the only black on the screen is the ask. Set "NOW AVAILABLE" as an 11-12px mono grey caption under the asks, not a black chip.
2. **Turn screens 2 to 6 into one-in, one-out.**
   - Pin "The pieces" (the left column already sticks) and make the right side change one piece at a time as you scroll.
   - Or tie the pieces to the hero ticker: hovering or focusing a piece lights its chains in a mini strip, and scrolling the list advances the `chain:` word.
   - Fill the empty left halves with that live object instead of white or grey void.
3. **Fix the dead hovers.**
   - Accordion rows on the grey room need a visible state, such as a white fill, the + rotating to ×, or a 12px row inset.
   - The agent use-case rows and the tag chips need a hover that says something.
   - Make the piece-row hover tell you something new, for example the first 3 chain names its page lists, rather than only a grey fill.
4. **Merge "The chains" text paragraph into the matrix.** The 32 names appear twice. Let the matrix column heads be the list, or hide the paragraph and make the matrix the section's one object at full width, with a pinned label row.
5. **Kill the hydration mismatch** (the red "1 Issue" badge on desktop load). Probably a client-only value in the ticker or sound toggle state rendered on the server.
6. **Morph landing.** The flying "Hanzo Chains" title must land on the destination h1 (within 12px, at the h1's size), and the ghost copy must be removed after the hand-off. Currently it lingers faintly behind the capabilities card on /blockchain/chains/.
7. **Phone:**
   - Put a right-edge fade and a "scroll →" mono caption on the code block and the matrix, or stack the matrix as per-product rows of chain chips.
   - Bring the h1 to 3 lines at 40px.
   - Trim the 10,577px page by keeping pieces collapsed to 5 on phone.
8. **Scale rhythm in the hero.** The 52px h1 and the 64px chain word compete. Either let the chain word be the one big thing and drop the h1 to rest under it in reading order, or settle the chain word to 44px and let it grow only while it is changing.
