# /payments — James-eye review

Verdict: 7/10
First complaint: "Better: now I see it pay, and there's a proper button up top. But look at the 'succeeded' chip, the one moment the whole page is built on, and it's hanging out of its own box on both the laptop and the phone. And once the chapters finish it's a document again: a big list of card names with half a screen of nothing under it, two grey boxes with an icon, four grey boxes with a number. Nothing there is alive."

Walked 7 Nov 2026, about 16:35–16:55 UTC, on the dev server (last page commit `b0374eee`). I walked it moving at 1470×801 (wheel, 8 small steps per screen, then 0.9 s of dwell) and at 375×812 (isMobile, hasTouch, small touch-sized steps). Both walks were filmed with recordVideo. I sampled 12 frames over the first 6 s with no input and logged the hero state with each, then took one frame per screen to the footer. I hovered 15 controls, opened a tax card and the checkout sheet (Esc and focus return), dragged the split and pressed "Roll back at once", ran a 70-stop Tab crawl at both sizes, and loaded the page under reduced motion (desktop and phone), with JS off, at 375×667 and at 320×640. The machine was shared with other critics.
Stills: `payments/desktop-first-screen.jpg` (hero at step 04: the chip overflow is visible), `payments/desktop-chapter.jpg`, `payments/desktop-checkout.jpg` (the dead half under the method list), `payments/phone-first-screen.jpg` (step 04 at 375: the chip runs past its row).

Script checks: parity `text 139/139, links 6/6`; taste OK (2 files); unique OK (136 pages). The route returns 200. CLS is 0.00026 on desktop (the shared header) and 0 on phone. There is no horizontal scroll at 1470, 375 or 320.

## What works
- **The fixes from the last review landed.**
  - The whole checkout now fits on the first screen. At 1470×801 the phone runs from y 258 to y 763, and its Pay → "✓ succeeded" button sits at y 677–733. At 375×812 the button has moved under the amount (y 630–682), and it reads "succeeded" at step 04.
  - There is one solid fill on the first desktop screen: the hero "Try Hanzo" (y 434, `data-thumb`). The header's ask goes quiet while it shows and turns solid once it leaves. The close's "Try Hanzo" is solid too.
  - The checkout's nine method names light from grey to ink in sequence on arrival. The four cases deal in as one list.
- **The hero is still this page's own idea, and it is alive.** It moves inside 1 s with no input: Visa is highlighted at 0.9 s on phone and 2.1 s on desktop, under the shared load. A method is picked (Visa, Apple Pay, PayPal, iDEAL), then the vault token, the `rule` chip on "success rate", the soft decline, and the backup's `'succeeded'` with `'adyen'`. The tracker counts `01 / 04` with a filling bar. Tapping a step holds it, and the pause works.
- **The desktop chapters are still the best part.** The phone is pinned beside the route (the wire chip, the `hanzo` hub, the fork, the processor and the backup), and one chapter changes at a time. At step 04 the fork goes dashed to the processor's "soft decline" and solid to the backup's `'succeeded'`. This is apple.com's "pinned stage, one panel changes", properly done.
- **"Move a percentage first" is a real Beyond.** Dragging re-routes the 100 dots, and the figures scale ×1.31 (64 → 84px) only while the hand is down. "Roll back at once" goes to 0% / 100% and disables itself.
- **The type sits on the deck.** The h1 is 52px (40px on phone), headings 26px and figures 64px. There is no hue. The "Payment orchestration" caption sits under the h1.
- **Reduced motion and JS off hold.** Under reduced motion the hero lands on `04 / 04` and "succeeded" at both sizes, with 0 running animations after 2.5 s. With JS off the hero, the phone and every section read. The only hidden text is inside the two closed sheets, and it is still in the HTML.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes at both sizes now. The title, the lede, the ask and a phone that pays all sit inside the first screen. On phone the shared cookie card (343×203, from y 593) covers the button and the methods until it is dismissed. That is shared chrome and not held against the page.
2. **One in, one out, or a document?** It is still half and half.
   - From the hero through the four chapters it is one in, one out.
   - After that it is a run of static blocks:
     - the code pane and three ticked lines;
     - the 44px method word list, which lights once and then is a word wall. About 300px of empty paper sits under it on desktop, and the whole left column beside the three numbered lines is empty (see `desktop-checkout.jpg`);
     - two grey tax tiles;
     - the dark split, which is good;
     - four grey case tiles that rise in once (a fade-up);
     - link rows and the Get block;
     - the close.
   - The chapter head still has about 250px of dead paper between the hero and "What sits behind the one integration". The gaps before Tax, Cases and "Explore Further" are each 150–250px of nothing.
3. **A real object in every section?**
   - The hero, chapters, code pane and split have one.
   - These do not:
     - Checkout's object is still a typographic list of method names.
     - Tax is "VAT / GST" in 64px type and a shield outline in a grey tile, which reads as an icon in a box.
     - "What you can see once it is one pipe" is three ticked lines.
     - The case tiles are mostly empty grey: a 32px number, then a title at the bottom.
4. **One ask, nothing floating, scale with rhythm?**
   - **Ask:** yes. On desktop the hero holds the one solid fill, then the header does. On phone the header's ask is solid on every screen, and on the first screen it sits beside the solid hero ask, which makes two solid "Try Hanzo" buttons. The phone header's ask is shared chrome, so it is not held against the page.
   - **Floating:** nothing from the page floats over content.
   - **Scale:** good. There is one big thing per screen ($20.00, 20% / 80%), with medium headings and small mono captions. The 44px method list is big with nothing small near it but empty paper.
5. **Every hover and press answers, no jumps?**
   - Every press answers (scale .97–.98) with no layout change.
   - Hovers are still thin, and none of them tells you something, as JAMES.md asks:
     - hero and close "Try Hanzo": #0a0a0a → #2c2c2e;
     - case and tax tiles: a fill step, and the + inverts on the case tile;
     - rows and "See the …" buttons: a fill;
     - tracker steps: grey to ink.
   - "Explore APIs" and "API Reference" showed no change to colour, fill or border.
   - Hovering a method name turns it lighter (ink → #525252), which is close to a "fades on hover".
   - The Tab crawl found a visible ring on every page stop, including the range input. The only miss was the footer's "Ask Hanzo anything" input, which is shared.
6. **Overlap, font swap, layout shift?** **Yes: the signature overlaps itself.**
   - At step 04 the `'succeeded'` chip on "attempt 2 · backup" overflows its row.
   - At 375 the row ends at x 313 and the chip runs to x 335, 22px past its row and flush with the phone screen's inner edge.
   - At 1470 the chip pokes past the row's right edge to the bezel, and `'adyen'` on the next row is jammed against the edge (see both stills).
   - This is the page's payoff frame, so it shows on every loop.
   - Other phone polish is still open:
     - the code pane still wraps the trailing comments (`console.log(payment.status);    //` then `'succeeded'` alone on the next line);
     - the dot legend still breaks into two ragged lines.
   - No font swap, and CLS is ≈0.
   - **The red "1 Issue" badge:** a React hydration-attribute mismatch appeared on 2 of 2 filmed walks and on every load where a screenshot fired at about 300 ms. It did not appear on plain loads.
     - Part of the diff is this page's own: the range input's `style={{'--f': pct / 100}}` renders as the number `0.2` on the client against the string `"0.2"` from the server.
     - The rest is the shared footer's `__html`, and /ledger shows the same badge.
     - The page's half is a one-line fix: pass a string.
7. **Which reference, and is its motion there?**
   - apple.com pinned scenes: yes, in the chapters.
   - motion.dev state changes: the sheets, the card-to-panel opens and the AnimatePresence screens.
   - synchronized.studio card-to-page: no; the cards open panels in place.
   - The osply/hamol pointer-aware detail is missing: nothing answers the pointer except the drag.
8. **Different from its neighbours?**
   - The hero medium is different: a device mock under a centred title.
   - From screen 2 down it is still the Business-1 skeleton: `BizChapters` pinned stage, then a `bz-sec` dark room, then `BizOpen` tiles, then link rows and the close. That is the same order as /ledger and /captable.
9. **18 parts covered?** The card has all 18 headings and `Done here:` lines; see the card check.
10. **Banned tells?**
    - None outright from the page: no hue, no gradient text, no kicker over the h1, no Inter, no springs, no cursor label.
    - Borderline:
      - the shield in a grey tile (an icon in a box);
      - the case tiles' rise-in, which is a fade-up (it is one of the 2 allowed);
      - the method hover going lighter.
    - The overlap in answer 6 is on the banned list.
11. **Copy untouched?** Yes: parity 139/139 text, 6/6 links.

## Card check
- **True now:**
  - Part 1: one solid fill on the first desktop screen.
  - Part 3: the button at y 677–733 on desktop and y 630–682 on phone; the h1 and phone tops at 258 and 388.
  - Part 4: the `data-cta` ids.
  - Part 8: the range input's focus ring.
  - Part 9: reduced motion lands on `succeeded`.
  - Part 6: parity.
  - Part 7: taste.
- **Not true as written:**
  - Part 11 ticks "375×812 and 1470×801 pass with no overlap". The step-04 chip overflows its row at both sizes.
  - Part 17's film reports "no console errors". I got a hydration warning and a red badge on filmed loads, and part of that diff is this page's `--f` style.
- **Generous:**
  - Part 8 says every control has a hover. "Explore APIs" and "API Reference" showed none.
  - Part 3 ticks "one idea per 100svh". The Checkout, Tax and Further screens are mostly empty paper around one list.
- Part 18's review box is correctly unticked.

## To reach 8
- **Fix the payoff overflow.** Let the step-04 rows wrap or shrink the chip: put the chip on its own line under "attempt 2 · backup", or drop the row label to "attempt 2" with "backup" as the caption. `'succeeded'` and `'adyen'` must sit inside their rows at 1470 and at 375 (and check 320).
- **Make the back half arrive and move, one thing at a time, and kill the dead paper.**
  - Checkout: make the method list the object, not a word wall. For example, hovering or tapping a method shows which connector carries it, from Hanzo's own "Local methods handled by whichever processor supports them best". Or set the list beside the three lines so the left column is not empty. Close the roughly 300px gap under it.
  - Tax: replace the static glyph-in-a-box with a state change on arrival (VAT → GST rolling, the shield's tick drawing). Or let the open panel's first bullet preview on hover.
  - Cases: each tile is mostly empty grey. Let its four features preview on hover, or show them at rest, so the tile has an object.
  - Cut the chapter-head gap (about 250px) and the gaps before Tax, Cases and Further.
- **Hovers that tell you something.** Give "Explore APIs" and "API Reference" a visible answer (an underline or the arrow moving). Stop the method hover going lighter: darken it or show a detail instead.
- **Break the Business-kit order below the hero.** /payments still scrolls like /ledger and /captable from screen 2 on. The route diagram is this page's own, so let it lead somewhere the siblings don't (for example, carry the route into the split so the dark room continues the chapters).
- **Phone polish.** Stop the code pane wrapping the trailing comments (scroll horizontally, or break before `//`). Keep the dot legend on one line.
- **Small fix.** Change `'--f': pct / 100` to a string so this page adds nothing to the hydration badge. Then correct card parts 8, 11 and 17.
