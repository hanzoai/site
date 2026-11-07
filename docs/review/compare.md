# /compare — James-eye review

Verdict: 8/10
First complaint: "Tidy and honest, but the top is just a heading and a table. I want one moment that makes me stop."

Walked 7 Nov 15:10 (third walk, after the shared system landed), page file at `575d9913` (`components/pages/Compare.jsx`, `Compare.css`), unchanged during the walk. Judged by `docs/JAMES.md` and `docs/MASTER.md`. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/compare/desktop-walk.jpg`, `review/compare/phone-walk.jpg`. The machine was overloaded, so motion is judged from frames.

## What works
- **The first screen fits at 1470×801:** the h1 at rest size (52px, line height 1.04), lede, one ask ("Model routing APIs →") and the table as a wide object with four rows showing.
- **The table reads itself:** a reading line walks the rows, "05 / 07" counts, a hairline times the next row, and a pause button sits in the table head. It moves within a second with no input.
- **Scale has rhythm:** Enso's tally is the one big figure (5/5 at 84px), the other three sit at 44px, and the rest is small.
- **Only greys and ink:** "Yes" in ink, "No" in grey with a dash, Enso's column raised by weight. The Enso film still is the one image. `taste.py` passes.
- **Phone is its own design:** the table becomes one card per row with the four APIs stacked, and the full sentence opens on tap.
- **Counting the Yes still works:** untick rows and each tally recounts.
- **The ask repeats once more**, solid, in the dark room ("A different question").
- **The checks pass:** parity 28/28 text and 2/2 links, CLS 0.0002, reduced motion 0 running animations, and JS off shows all 23 text blocks. Both cards answer hover (the Enso art drifts up; the dark card fills) and press scales to .98.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. Claim, ask and a table already walking its rows.
2. **One in, one out, or a document?** Yes. Four screens, one idea each: the table, the count, the comparison card and the different question.
3. **A real visual object in every section?** Yes: table, tally figures, Enso card, dark "Buy it, or run it" card.
4. **One ask, sticky after the hero?** The page's ask is in the hero and the dark room. After the hero, the phone gets the slim "Model routing APIs →" bar. On desktop the sticky header still says "Try Hanzo", so the first screen shows two solid buttons with different labels (shared).
5. **Every hover and press answers, no jumps?** Yes. Row hovers fill, cards lift their art or fill, and presses scale.
6. **Overlaps, font swap or layout shift?** None. The hydration warning badge ("1 Issue") shows on every page (shared).
7. **Which reference, is its motion there?** motion.dev's reading pill and Apple's one idea per screen are both there. synchronized.studio is claimed for the Enso card, but the destination (`/compare/model-routing`, family owner) has no matching hero yet.
8. **Different from neighbours?** Yes. A self-reading table as the hero is not used by /comparison (receipt), /research (paper desk) or /security (layer stack).
9. **18 parts (MASTER card)?** 18 of 18 `Done here:` lines, checked below.
10. **Banned tells?** None. The "HANZO VS" caption sits over the lede, not over a headline. No hue and no floating bar.
11. **Copy untouched?** Yes; every figure (600+, 500+, 1,600+, 1,800+, 198 questions) is in its source cell.

## Card check (docs/coverage/compare.md)
- 18 of 18 parts filled. Spot-checked: part 3 (52px h1, 4 rows at 1470×801, JS off 0 hidden), part 7 (84px tally as the one moment), part 11 (phone rows) and part 12 (pause) are all true.
- Part 8 says presses scale .97; measured .98. Close, but correct the card or the CSS.

## What is missing
- **Part 3:** no closing `Band`. The dark room carries the ask, then the footer, which is acceptable. The destination of the Morph is not designed yet (family owner).
- **Part 4:** the header label "Try Hanzo" and the page's ask disagree on desktop (shared).

## Fixes
1. **Give the first screen its moment.** Let the row the reading line is on grow for the beat it is read (Enso's cell up to the 64px figure size, then back to rest), so the eye has one big thing in the hero, as the count screen already does.
2. **Land the card.** With the `/compare/*` family owner, make the Enso image and the question title the destination hero, so the click is continuous.
3. **Correct the press value** on the card (part 8) to match what ships.
