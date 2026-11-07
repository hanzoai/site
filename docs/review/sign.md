# /sign/: James-eye review
Verdict: 7/10
First complaint: "I let the contract play, it gets to step four, I touch the scroll wheel and it snaps back to an empty page at step one. It's undoing itself in front of me."

Walked 2026-11-07 17:10 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.**
   - h1 52px "Hanzo Sign", lede, Try Hanzo and the contract stage all fit the first screen. The demo plays by itself: 01 at 0.5 s, 02 at 1.5 s, 03 at 3.5 s, 04 at 5.5 s.
   - **Bug:** after 7 s of autoplay (at 04/05), a 240px wheel scroll snaps the stage back to 01/05, an empty page with no fields. Measured, and the same thing shows in the walk (d-00 at 03, then d-01 back at 01).
2. **One in, one out: mostly yes.**
   - The pinned stage changes one panel per step over about 4.5 screens, and the left heading swaps step by step. Status list, language ticker, signature pad, pricing and the fork line each get their own screen.
   - The closing black Band is a document: 5 stacked link rows at 1470 with the left half empty for about 1.4 screens. View on GitHub and the docs link each appear twice.
3. **A real object in every section: yes, except two.**
   - Contract stage, live recipient list, 12-language ticker, drawable signature pad (Sign stamps "Signed Nov 7, 2026, 5:03 PM"), and a fork-line SVG.
   - The 8 feature tiles (01 to 08) are text and a "+". The Band is text only.
4. **One ask, rhythm: yes.**
   - One solid Try Hanzo in the hero. Nothing floats over content. Phone: the primary is at 238 to 290px, inside the first screen.
   - Scale steps down properly: 52 h1, 26 h2, 44 figures (the language word and prices), 17 h3. Nothing gets big at once.
   - Shared: the header ask is always solid (request filed).
5. **Hover and press: they answer.**
   - Primary: hover darkens the fill (#0a0a0b to #2c2c2e), press scales to 0.98. Secondary: 4% fill. The pricing toggle slides and dims the plans that don't apply.
   - Tiles lift 3.5px and the "+" fills black, but the hover tells you nothing (no preview, no number). Opening them is the shared OpenCards sheet.
6. **Overlap, font swap, shift:**
   - On the field grid, "CHECKBOX" is clipped at the right edge of its tile, and the tick circle sits on top of the word (d-00, d-06). The tile also shows a second, empty checkbox square next to the tick.
   - CLS measured 0.0003. No horizontal scroll at 375.
   - "Built on Open Source" (h2) is still masked while its paragraph is already on screen (d-11): the cut-in fires late.
   - Shared: hydration mismatch in the footer's injected HTML (`components/Shell.jsx`): "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties…", diff in `__html: "<footer class=…"`. The red badge showed on 4/4 cold loads when first paint is slow, and 0/4 with networkidle. This is not the page's code.
7. **Reference: Apple product page.** The pinned scene where one panel changes and the product is the hero is there. The signature pad is the playful moment from osply/hamol. No card-to-page Morph of its own.
8. **Different from its neighbours: yes.** Its own medium (the contract building up) and its own delight (sign it yourself).
9. **18 parts:** mostly covered. The tiles have no hover detail, the Band is long, and the pricing on phone is 4 stacked cards of about 3.5 screens with no way to collapse them.
10. **Banned tells: none.** No hue (the only colour is the shared red dev badge). "Most Popular" in mono sits above the "Business" h3, which is minor and below the h2 rule.
11. **Copy: untouched.** parity.py: text 106/106, links 9/9.

## Fixes (in order)
1. Stop the rewind. When scrolling takes over the stage, start the scroll steps from the step the autoplay reached, or let autoplay run only until the first scroll and then hold.
2. Fix the CHECKBOX tile: no clipped label, no tick over the word, and one checkbox mark, not two.
3. Shorten the closing Band. Put the 5 rows into the empty left column or a 2-column grid so it fits one screen at 1470.
4. Give the tile hover something to say, such as the first line of what opens, and keep the 3.5px lift.
5. Fire the "Built on Open Source" cut-in when the section enters, before its paragraph shows.
6. Phone pricing: collapse the feature lists under each price so the 4 plans don't run about 3.5 screens.
