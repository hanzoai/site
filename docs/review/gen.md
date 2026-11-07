# /gen — James-eye review
Verdict: 7/10
First complaint: "On the phone there are two black buttons at the top, 'Try Hanzo' and 'Get API key'. Which one am I meant to press? And once I scroll past the hero, the ask is gone."
(Walked 7 Nov at HEAD `2b6f82fd`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 375×667 and 320. API, platform and form hosts were blocked.)

## What works
- **The hero object is the page's own idea.** A split-flap board sits inside Gen's four rails (TOOLS, MODELS, SESSIONS, FENCES).
  - It starts moving in the first second with no input: the four rail beacons ping and the cursor blinks.
  - The first tile flip lands at 2.2 s. It walks the 23 agents once, then rests on "Hanzo Dev 01 / 23". At 55 s the Pause button is hidden and no JS animation is running.
  - No other page in the Apps group looks like this.
- **The command builder is a real interaction, the "Beyond" of this page.** Pressing a key (Gemini CLI) turns both lines into `gen --gemini --cloud` and `hanzo dev --gemini --cloud`.
  - Flipping `--no-mcp` adds the flag to both lines. `--model` stays disabled until `--cloud` is on.
  - On desktop the builder is sticky beside the switches, so you watch the command change as you flip them.
- **Labels over headings are gone.** 0 elements sit above any h1 or h2. Their words became a numbered in-page index of 8 links, each 56px tall.
- **The page ends properly.** The black "MIT, in the open." room opens from an inset rounded card to full width as you scroll. It carries the one closing "Get API key" (light solid), with "Read the docs" and "The source" as text links.
- **The header ask swaps on desktop.** It reads "Try Hanzo" (outlined) on the first screen, then turns into a solid "Get API key" once the hero is out of view.
- **Hard checks pass:**
  - CLS is 0.0003 on desktop and 0 on phone.
  - Switching the install tabs changes page height by 0px.
  - JS off hides 0 of 129 text blocks.
  - Reduced motion leaves 0 running animations and shows the board at rest.
  - No horizontal scroll at 320 (scrollWidth 320).
  - No touch target on phone is under 44px.
  - There is 1 `<main>` and 1 h1 (52px desktop, 40px phone, Zen 497).
  - Monochrome only.

## The 11 answers
1. **Does it sell in 5 s, and move within 1 s?** Yes on both. The h1, lede and "Get API key" are all on the first screen; on phone the ask's bottom is at y=432 at 375×667. Moving in under 1 s: the beacon ping and cursor blink (CSS). The first board flip is at 2.2 s. The h1 bottom sits at 48% of the viewport (the brief asks for a baseline near 38%), and the next section does not peek at 1470×801.
2. **One thing in, one out, or a document?** Desktop holds up through the board, install, Gen/Dev pair, keys and rails. After that it turns into a document: CLI code, then a 3-column link list ("Read"), then a "Paste and ship" prompt, then the FAQ, about 2.5 screens of rows. Phone is a long document at 13,088px:
   - the 23 agent keys stack 2-up, about 1,900px of grey tiles;
   - the rails run about 3 screens with no heading in view at y=4544–5680.
3. **Is there a real visual object in every section?** Mostly. The board, install window, the Gen/Dev pair, keys, the builder, the CLI code and the black flag field all count. "Read" is only hairline link rows with arrows, and the FAQ is only text.
4. **One ask in the sticky header, nothing floating? Scale rhythm?**
   - Desktop: yes. One solid on the first screen ("Get API key"), and the header turns into "Get API key" after the hero. No floating bar.
   - Phone: no.
     - The header "Try Hanzo" is a solid #0a0a0a fill on the first screen beside the solid hero "Get API key", so there are 2 solid fills and 2 different asks.
     - The header stays "Try Hanzo" at every scroll depth (checked at 0, 1200, 3000, 4200 and 6000 with the cookie card dismissed).
     - No ask bar ever rises.
   - Scale: h1 52, h2 26, one 32 statement ("One runs agents."), the 44 closing room. That is medium and calm, but nothing grows or shrinks as you scroll.
5. **Does every hover and press answer, with no jumps?** Yes, with no layout jumps.
   - The primary goes from #0a0a0a to rgb(44,44,46) and scales to 0.98 on press.
   - Keys go #f2f2f2 to #e9e9e9 and scale 0.98. Switch borders darken and scale 0.98. Tabs scale 0.97.
   - Arrow links underline and press 1px. Read-row arrows slide 5px. Dev card text underlines and the card scales 0.98.
   - Board hover shades the tiles.
6. **Overlaps, font swap or layout shift?** None measured. CLS ≈ 0, the h1 box is stable, no overlaps at either size.
   - During the first walk the Next dev "1 Issue" badge, a hydration attribute mismatch, showed at both sizes. It did not come back in 5 later loads, so it is likely a recompile during a shared edit. Recheck it.
7. **Which reference, and is its motion there?** grubogrubo/hamol restrained micro-motion: yes, the board flip at 90+150 ms, the rail beacons and the switches. Apple one-idea-per-screen: on desktop only through the rails. No pinned scene, and the index row is not sticky.
8. **Different from its neighbours?** Yes. A 4/8 copy column beside a departure board is unlike /api's console, /cli's terminal room or /dev.
9. **All 18 parts?** The card is filled, but parts 1 and 4 make false claims (below). Part 3 "one idea per 100svh" fails on phone (the keys wall and the rails run).
10. **Banned tells?** No hue, no label over a headline, no gradient text, no Inter, no floating desktop bar. Two near-tells:
    - the 2 solid fills on the phone's first screen;
    - a dead Pause control under reduced motion. `.xgn-pause` measured `hidden=false` there while the board does not walk.
11. **Is the copy untouched?** Yes, as far as walked. The card states parity text 164/164 and links 10/10, and every line reads as Hanzo's.

## Card check (docs/coverage/gen.md)
- Part 1, "check.mjs counts 1 solid on the first screen at both sizes": **false.** The phone first screen measures 2 solid fills, header "Try Hanzo" (rgb 10,10,10) and hero "Get API key".
- Part 4, "on phones the slim shared bar carries this page's own `data-thumb` ask": **false.** No fixed bar exists at any scroll depth with the cookie card dismissed. The page's ask on phone exists only in the hero and the closing room.
- Part 4, "The header carries the solid 'Try Hanzo'": **stale.** On desktop it is outlined "Try Hanzo" at the top and a solid "Get API key" after the hero. On phone it is a solid "Try Hanzo" throughout.
- Part 3, JS off with 0 hidden blocks: true (0/129).
- Part 11, CLS 0.000 and 0 small phone targets: true. Install tabs keep a fixed height: true (0px delta).
- Part 9, reduced motion final state: true (0 animations). The walk rests after one pass: true. The Pause hides after the walk: true. But under reduced motion the Pause shows while nothing walks.
- Part 2, index links 52–56px: true (56px).

A false claim caps the verdict at 7.

## Fixes (in order)
1. **One solid ask on the phone.** On /gen at <900px:
   - the header ask must not be a second solid while the hero "Get API key" (`[data-cta="gen.hero"]`) is in view;
   - after the hero it must read "Get API key" (the page's `data-thumb` label), as it already does on desktop.

   The header is shared chrome, so add this to `docs/requests/apps1.md` (item 1) with the measurement: phone header "Try Hanzo", bg #0a0a0a, at y 0–6000.
2. **Ask after the hero on phone.** Either get the shared slim bar to rise for `[data-thumb]` once `gen.hero` leaves view, or correct the card. Right now nothing carries the ask from y≈450 to the closing room at y≈9100.
3. **Phone rails: keep the command in view.** At 375 the first switch sits 1,451px above `.xgn-build`. Under 899px, either:
   - move `.xgn-build-wrap` above `.xgn-rail-list` and make it `position: sticky; top: 64px` with only the `gen` row showing, or
   - pin a one-line `gen …` readout to the bottom of `#rails` while it is in view.
4. **Phone agents: turn the wall into a rail.** Make `.xgn-keys` a 2-row horizontal rail with `scroll-snap-type: x proximity`, a 14–18% peek and 56px compact rows. That takes 23 keys from about 1,900px to under one screen.
5. **Desktop tail: make it less of a document.**
   - Collapse `#read` (`.xgn-cols`) and `.xgn-paste` into one viewport: Read rows at 56px, and the Paste prompt beside them as the section's one object.
   - Or give "Read" a hover preview (the target's lede) so the section holds an object.
   - Keep every link and word.
6. **Hero placement.** Cut `.xgn-hero` top padding by about 80px so the h1 baseline sits near 38% of 801. The index row (`.xgn-index`) should then peek about 56px above the fold at 1470×801.
7. **Reduced motion.** Hide `.xgn-pause` when `useReducedMotion()` is true. It measured visible with 0 animations running.
8. **Black room.** Trim about 120px of empty black below `.xgn-src-flags` (`.xgn-src` padding-bottom) so the room ends on the flag field, not on a void.
9. **Fix the card.** Correct the part 1 and part 4 lines to what is measured above, then re-file.
10. **Recheck the hydration warning.** The "1 Issue" badge (an attribute mismatch) appeared on the first cold walk only. Load cold 3 times after a fresh compile and confirm 0.
