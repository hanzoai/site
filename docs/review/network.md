# /network: James-eye review

Verdict: 7/10
First complaint: "It's a wiring diagram. Grey hollow circles, hairlines and little grey labels, and one black dot crawling between them is the whole show. Then I scroll through six white cards with tiny drawings in the middle. Then I click through to /node and it tells me the same six things with the same pictures: the tenth of the block reward, declared against attested, models, route and placement, a Merkle tree. That's one page twice."

Reviewed: branch `claude/elegant-johnson-b2vx1q` @ `0d2a243` ("/network to MASTER"). Files hash: `3d60b6947db2` (sha256 of `Network.jsx`, `Network.css` and `app/network/page.jsx` at that commit).
HEAD when written: `2442636`. Its only change here is the 14px phone caption floor (`3766b94`), which I checked. The working tree also holds an uncommitted "run once, then rest" demo for the hero. It was not committed, so it is not judged.
Walked 7 Nov 15:12–15:22 UTC on the dev server, moving. Viewports: 1470×801, 375×812 and 390×664 (iPhone 13 touch emulation), plus 320 wide, JS off and reduced motion. The once-per-visit loader was skipped.
The page and the standard both moved during the review:
- Round 2 (`c9784eb`, 128px type over a full-bleed map) was filmed first and is superseded.
- JAMES.md and MASTER.md changed at 14:45. Everything below is measured on `0d2a243` against the current JAMES.md and MASTER.md.

Proof: `img/network.jpg` (desktop first screen | phone first screen, about 3 s after load).

## What round 3 fixed (checked, not assumed)
- **Nothing floats over the map or the words.** The "Compute Marketplace" card is now the map's own toolbar under a hairline. The white wash under the lede is gone.
- **Colour.** Every literal in `Network.css` is on the deck ramp, there are 0 Apple greys and `taste.py` passes. The only hue on screen is the shared footer's blue social icon.
- **Scale.** The h1 is 52/497 and the chapter intro 44. Chapter titles are 32, the black room heading 26, and "Get Network" grows 26→64 as you reach it.
- **One solid per viewport:** held at all 24 desktop and 28 phone probe stops.
- **Robustness:**
  - JS off: 131 text runs, 0 hidden, and the six blocks are laid out in order.
  - Reduced motion: no running animations, and the first screen is identical 4.5 s apart.
  - CLS: 0.0009 desktop, 0 at 375×812 and at 390×664.
  - No horizontal scroll at 320.
  - Contrast: 0 runs under 4.5:1 at either width.
- **Housekeeping:**
  - There are 0 springs (the picker pill slides 300 ms ease-emphasis) and 0 `setInterval`.
  - The "01 / 06" counts sit under the chapter titles.
  - Parity is 37/37 text and 5/5 links.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both widths.
   - Desktop: title, lede, "Buy Compute", the map and its toolbar all fit at 1470×801. The cut-in title and the walking request move from first paint.
   - Phone: title, lede and ask sit above a 240px map, and the ask is at y 322.
   - What it sells is thin, though. The object is 11 hollow 18px circles on 1px grey lines with 13px grey mono tags. The only ink is one route line and a 16px dot that walks for about 1 s in every 3.8 s.
   - At 1470×801 the left column has about 210px of empty paper between the title (ends y 264) and the lede (starts y 476).
2. **One in, one out, or a document?**
   - **Mostly one in, one out.** The six facts are one pinned chain. Each block settles as a header row while the next arrives, which is a real idea for a ledger.
   - **But the object barely speaks.** Each block is a 1px-hairline white card about 665×380 with a small grey drawing in its middle (a 200×90 mini graph, ten 32px cells, two 56px rows) and 13px mono captions.
   - **The intro repeats chapter 01.** "How the Network Works" and chapter 01 show the identical block 01 for about 1.5 screens of scroll.
   - **Then it is a document.** A black room, then a white "Paste and ship" section: a 26px heading and one code box with an empty field below. Then the close.
3. **A real object in every section?**
   - Hero: the fabric.
   - Chapters: the chain.
   - Black room: the strand and two ends.
   - Close: the Sigil tile.
   - "Paste and ship": only a prompt box on a bare white band, the weakest screen on the page.
4. **One ask in the sticky header, nothing floating, scale with rhythm?**
   - **Ask: no.** The page's ask, "Buy Compute", lives only in the hero and the close.
     - Between them the sticky header's solid says "Try Hanzo" (signup) at every desktop and phone stop. That is a different verb and a different destination.
     - In my three wheel-scrolled walks the site's ask bar never arrived. On a jump-scroll it did, as a pill floating at the bottom centre over content, which MASTER bans on desktop.
     - On phones, the header's "Try Hanzo" is solid beside "Buy Compute" for about 2 s after load (frames 0:02–0:03) before it turns to an outline.
     - This is mostly shared (`Ask.jsx`, the header). The page has filed it (`docs/requests/network.md` #3). The answer on screen is still no.
   - **Scale: yes,** as listed above.
5. **Every hover and press answers?** Mostly yes.
   - **What works:**
     - The model picker fills #e4e4e7 on hover and presses .97.
     - Pointing at a peer draws its route dashed and names what it has loaded ("you → peer 06 → peer 04", "enso loaded"). The detail tells you something, which is the right kind of hover.
     - The two ends deepen #171717→#262626, press .97, and send a pulse down the strand.
     - The pause control answers a tap.
   - **What misses:**
     - The text links ("Run a Node", "Deploy to Cloud", "Self-host", "hanzoai") have no press: `lx-text` has no `:active`.
     - The model picker is a `radiogroup`, but ArrowRight does nothing (the APG radio pattern).
     - Previewing the far peer truncates the route readout to "you → peer 06 → peer 04 → peer…" at 1470 wide, cutting the one word you pointed at.
6. **Overlap, font swap or layout shift?** None. There is no overlap at 1470×801 or 375×812, the h1 box is steady, and CLS is near 0 (above). One rough spot: during a chapter crossfade on the phone, the outgoing block's command pill ghosts through the incoming Merkle tree for about 0.3 s.
7. **Which reference, and is its motion there?**
   - apple.com: the pinned chain is there.
   - synchronized.studio: not there. "Provide Compute" carries `data-morph`, but clicking it showed a white frame, then /node cut in. No title flew into "Hanzo Node".
   - anthropic launch: no hero figure.
8. **Different from its neighbours (/node especially)?** In the hero, yes. Below it, no.
   - **The hero:** /network opens on a peer graph right of the copy. /node opens on a machine card left of the copy.
   - **The skeleton:** both share the Cloud 3 one. A 52px two-line "Hanzo X", lede, one black pill and one text link on the 8/5 split. Pinned chapters with 32px titles and "01 / 06". A wipe room. "Paste and ship". "Get X" beside a grey Sigil tile.
   - **The chapters (`67df8fa`'s `Screen`):** they mirror each other fact for fact. Network block 02 and Node 02 are block-reward bars ("a tenth"). Block 03 and Node 04 are the same three rows (declared / attested ✓ / trust-score bar). Block 04 and Node 03 are models / route / placement. Block 05 and Node 05 are `hanzo fabric …` commands. Block 06 and Node 06 are Merkle roots on Lux.
   - **The hero props:** /node's own hero has a "joins the fabric" tile drawn as a mini hollow-circle peer graph, the same drawing as /network's map.
   - Hanzo's copy overlaps, so the facts can't change. The objects that carry them should.
9. **All 18 parts covered?** The card ticks 18/18. Some ticks overstate:
   - part 4 says "sticky ask in header and bar after the hero, same label", which is not what happens;
   - part 7 says it "differs from neighbours in hero medium and room order", true of the hero only;
   - part 15 says "every card opens by Morph", but it is a cut.
10. **Banned tells?** None of the hard ones. Clear: no hue, no green, no Inter, no springs, no fade-only hover, no shadow over the map, no floating panel from this page. Two soft ones:
    - "CALL IT" and "SERVE IT" in mono capitals sit directly over the 32px titles of the two ends.
    - The thin grey wireframe of the hero and blocks reads close to the "lazy look": nothing on the page has weight except the one black line.
11. **Copy untouched?** Yes: parity 37/37 text, 5/5 links. "Compute Marketplace" moved from the h1 eyebrow into the toolbar, words unchanged. The drawn UI strings are not in `content/ui-strings.json`:
    - "ask the fabric for", "routing…", "a peer that already has … loaded", "nobody has … loaded · placement" and "nothing loaded";
    - "topology · connected right now", "provider", "by the work", "idle", "nothing billed", "declared", "attested", "trust score", "CI runner", "settled", "proposed", "prev" and "genesis".

## Missing from the 18 parts (MASTER part 2, measured on 0d2a243)
- **1 Strategy / 4 Conversion:**
  - The sticky ask says "Try Hanzo" while the page ask is "Buy Compute".
  - The metric `api_key_created` is not what "Buy Compute" (a docs link) feeds.
  - `lib/cta.js` does not exist (shared).
- **3 First impression:**
  - The intro and chapter 01 show the same block.
  - "Paste and ship" is a bare band.
  - The card-to-page Morph is a cut, so there is no flight.
  - There is no proof strip before the close.
- **6 Content:** About 20 drawn UI strings are outside the register (answer 11).
- **7 Visual:** The page has no Hanzo media, though Hanzo has renders for exactly the models the map names (zen, kai, enso, koe, uta). Colour may enter only through that media, and here the page is ink on paper throughout.
- **8 Components:**
  - The radiogroup has no arrow keys.
  - `lx-text` links have no press.
  - The shared `Copy` presses to .92, not .97 (requested).
- **9 Motion:** Three of the six chapter objects are static drawings that change only by swapping (blocks 03, 04, 06). The page's motion budget is spent in the hero and the strand.
- **11 Mobile:** In every chapter the block sits in the top 38svh and the words take 3–5 lines. The bottom 35–40% of the 375×812 screen stays blank for about six screens of scroll. The "01 / 06" counts are hidden on phones.
- **17 States:** The site footer's hydration mismatch puts the dev server's red "1 Issue" badge on this page (shared, not this page's code, but DONE #3).
- **Passing:** one h1 and one main, no raw img, video or table, 44px targets, 0 `title=` in the page, JS off and reduced motion complete, no scroll at 320, contrast clean.

## Fixes (in order)
1. **Stop telling /node's story with /node's pictures.**
   - Make the fabric itself the chapters' object: pin the hero map and let each chapter change it, so the page becomes the System type's "a map you zoom into". Leave the terminal and the machine to /node.
   - The six beats on the map:
     - 01: the struck "region ▾" dissolves into the live topology.
     - 02: links thicken by the work routed over them, and idle peers stay hairline.
     - 03: attested peers fill, declared ones stay hollow.
     - 04: the route and the placement play.
     - 05: a new peer joins with `hanzo fabric join`.
     - 06: the routes settle into one block.
   - This also fixes the intro repeating chapter 01.
2. **Give the hero object weight, with Hanzo's own colour.** The tags name zen, kai, enso, koe and uta, and Hanzo has a render for each.
   - Let a peer that has a model loaded wear that model's thumbnail (`Pic`, 28–36px, rounded). Let the placement land the uta render on peer 07. That is colour from Hanzo's media, which JAMES 7 allows, and it makes the map a product rather than a diagram.
   - Close the 210px gap in the left column: lede under the title, ask under the lede, all bottom-aligned with the map's toolbar.
3. **One ask, one verb.** Carry "Buy Compute" in the sticky header on this page and retire the floating desktop pill (shared, `docs/requests/network.md` #3). Stop the header's "Try Hanzo" showing solid for the first ~2 s on phones.
4. **Make "Paste and ship" a scene or fold it in.** Put the prompt in the black room under the two ends, where "call it" already lives, and delete the bare white band.
5. **Fill the phone chapters.** Either raise the object window (about 50svh), or let the block body take the words' place on short chapters. The bottom third of the screen should not be blank for six screens.
6. **Small craft:**
   - arrow keys on the model radiogroup;
   - never truncate the destination in the route readout (wrap it, or drop the middle hops);
   - a press on `lx-text` links (translateY 1px);
   - a real Morph flight from "Provide Compute" into /node's h1;
   - move "call it" and "serve it" under their titles;
   - register the drawn UI strings.
