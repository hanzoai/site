# /comparison — James-eye review

Verdict: 8/10
First complaint: "The headline's small and off to the left with a big empty patch beside it, and the total, the whole point, is below the fold on my laptop."

Walked 7 Nov 15:16 (third walk, after the shared system landed), page file at `18823f5f` (`components/pages/Comparison.jsx`, `Comparison.css`), unchanged during the walk. Judged by `docs/JAMES.md` and `docs/MASTER.md`. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/comparison/desktop-walk.jpg`, `review/comparison/phone-walk.jpg`. The machine was overloaded, so motion is judged from frames.

## What works
- **The bill is the object.** A paper slip feeds out of a black slot under the hero and prints its eleven stacks line by line.
- **Every line is a switch.** Take a stack out and the total rolls to the new figure ("Your selection 10 / 11, $221.19/mo"). The price list now shows once, not twice.
- **Scale has rhythm:** h1 at rest (52px), the total as the one big figure of its screen, and the dark room's "$ ?" at figure size.
- **The dark room is still the best moment on the page.** A tilted receipt lists the five things you hold (Upgrades, Backups, Availability, Identity, On-call). Each comes in beside its sentence as the last goes out, each priced "$ ?". Then Hanzo's closing line and the ask.
- **Greys and ink only;** `taste.py` passes. Nothing floats over content: the old total pill is gone.
- **One ask, "Try Hanzo":** in the hero and again closing the dark room.
- **The checks pass:** parity 63/63; CLS 0; reduced motion 0 running animations; JS off shows all 24 text blocks; press scales to .97; the switches answer tap and hover.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on words, and the slip feeds once the page arrives. After the feed, the first screen is still until you touch it.
2. **One in, one out, or a document?** Yes: the hero, the bill, then five duties one at a time.
3. **A real visual object in every section?** Yes: the slip and the duty receipt.
4. **One ask, sticky after the hero?** In the hero and the dark room. After the hero, the header and phone bar carry "Try Hanzo" (shared).
5. **Every hover and press answers, no jumps?** Yes.
6. **Overlaps, font swap or layout shift?** None. The "1 Issue" hydration badge is shared.
7. **Which reference, is its motion there?** Apple's pinned chapter in the dark room, and osply's calm type. Both there.
8. **Different from neighbours?** Yes. A printed bill and unpriced receipts are its own; nothing else in Proof uses paper.
9. **18 parts (MASTER card)?** 18 of 18 `Done here:` lines, checked below.
10. **Banned tells?** None. "COMPARISON" is a caption over the lede, not over a headline.
11. **Copy untouched?** Yes. Every price and the method note (compute only, DigitalOcean retail plus Hanzo margin, estimate) are Hanzo's.

## Card check (docs/coverage/comparison.md)
- 18 of 18 filled.
- Spot-checked as true: part 3 (52px h1 on the 8/5 split, slip feeding within 1 s, JS off 0 hidden), part 6 (each price once), part 7 (the total as the one big moment), part 11 (no floating pill) and part 17 (empty selection shows $0.00/mo).

## What is missing
- **Part 3:** the first screen has no big thing. The h1 is at rest size, the slip shows its title and three lines, and the total sits about 700px below the fold.
- **Part 9:** after the feed, nothing in the hero moves by itself.

## Fixes
1. **Put the total on the first screen.** Show the slip's foot ("All of them, running $225.57/mo") as soon as it feeds, pinned under the slot while the lines print above it. Or shorten the feed so the total lands above the fold at 1470×801. That is the one big thing for the hero.
2. **Close the empty patch.** Bring the slip up beside the h1 on the 8/5 split (h1 and lede left, slip right, aligned to the bottom), so the first screen has one focal object, not a gap.
3. **Keep the slip alive at rest.** For example, the line under the pointer lifts and shows its vCPU and GB, or the "11 / 11" counter ticks as lines finish printing, so the hero still answers after the feed.
