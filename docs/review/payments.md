# /payments — James-eye review

Verdict: 7/10
First complaint: "The phone is a lovely idea and it's alive straight away, but I never see it pay. The 'succeeded' happens below the fold, and there's no solid button on the first screen at all. Then after the chapters it goes quiet: a list of card names, two grey tiles, four grey tiles, links. It turns back into a document."

Walked 7 Nov 2026, about 16:05–16:15 UTC, on the dev server (main `f244a55c`; last page commit `1aa34f9a`). I walked it moving at 1470×801 (wheel, 8 small steps per screen, then 0.9 s of dwell) and at 375×812 (isMobile, hasTouch, small scroll steps). Both walks were filmed with recordVideo. I took 12 frames over the first 6 s with no input, then one frame per screen to the footer. I also sampled the hero's state every 0.4 s for 8 s, hovered and pressed 13 controls, opened both sheets, one tax card and one case card, dragged the split, did a 70-stop Tab crawl, and loaded the page under reduced motion, with JS off, at 375×667 and at 320. Machine load was shared with 3 other critics.
Stills: `payments/desktop-first-screen.jpg`, `payments/desktop-chapter.jpg`, `payments/phone-first-screen.jpg`.

Script checks: parity `text 139/139, links 6/6`; taste OK (2 files); unique OK. The route returns 200. CLS is 0.0003 on desktop and 0 on phone. There is no horizontal scroll at 1470, 375 or 320.

## What works
- **The hero has a real idea, and it is this page's own.** A checkout runs by itself on a phone under the centred title. Methods are picked (Visa, Apple Pay, PayPal, iDEAL; the hover outline then fill), the card digits become a vault token, "success rate" gets the `rule` chip, then "soft decline", the backup and `'succeeded'` with `'adyen'`.
  - It moves within about 1 s at both sizes: the method highlight changes at 1.1 s on desktop and 1.8 s on phone.
  - The tracker on the right counts `01 / 04` and its bar fills.
  - Tapping a step holds it (I tapped 04 and it held).
  - The pause button works.
  - It differs from its neighbours' heroes: /ledger has a book beside the title, /captable a 72.7% figure and a table, /commerce an order rail.
- **The desktop chapters are the best part of the page.** The phone is pinned on the left with a route diagram (wire chip, `hanzo` hub, a forked path, processor and backup) and one chapter on the right. One chapter comes in as another goes out. The fork draws, and the processor chip turns to "soft decline" while the backup gets `'succeeded'`. This is the apple.com "pinned stage, one panel changes" move, and it is properly there.
- **The "Move a percentage first" black room is a real Beyond.** A 10×10 field of dots re-routes as you drag. The figure grows from 64px to 84px (scale 1.31) only while your hand is on it, then settles back. "Roll back at once" sends it to 0%/100% and disables itself. This is scale with rhythm done the way James described.
- **The type is calm and on the deck.** The h1 is 52px, headings 26px and figures 64px. There is no hue, and nothing sits above the h1: the "Payment orchestration" caption is under it.
- **Sheets and cards open properly.** "See the spec" opens a right-hand sheet, focus goes to the dialog, and Esc returns focus to "See the spec". The tax and case cards open into centred panels. The press is scale .97–.98 everywhere.
- **Reduced motion and JS off both hold.** Under reduced motion the hero lands on `04 / 04` and "succeeded". With JS off, 0 text runs are hidden.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** It moves: yes, at both sizes. It sells: mostly. But two things weaken it.
   - At 1470×801 the phone runs from y 258 to y 1018, and its Pay/"succeeded" button sits at y 924–982, below the 801 fold. On phone it sits at y 977–1032 of 812. The checkout's payoff, the moment the page is built around, happens off-screen. You see methods, a vault, a rule and attempts, but never the payment land.
   - At the top of the page on desktop there is **no solid button at all**. The header's "Try Hanzo" turns to an outline while the hero ask is in view, and the hero's own "Try Hanzo" is a quiet outlined Cta. I measured 0 solid fills at scroll 0. Phone is fine: the header's ask is solid.
2. **One in, one out, or a document?** Half.
   - From the hero through the 4 chapters it is one in, one out.
   - After the chapters it is a document of static blocks. "One API…" is a code pane and a list. Then:
     - Checkout: a 32px word list of card names and three numbered lines;
     - Tax: two grey tiles;
     - the dark split, which is good;
     - Cases: four grey tiles, one black;
     - Further: link rows and the Get block;
     - the close.
   - None of the light sections moves untouched, and none changes as you arrive. On phone the chapters are stacked as four static checkout cards with their text, which the rule allows. But it means that on phone, everything after the first screen is reading.
   - There is a lot of dead white at the chapter head (desktop s01: about 250px of empty paper between the hero phone and "What sits behind the one integration") and before "Explore Further".
3. **A real object in every section?** Most sections have one: the phone, the route, the code pane, the dots field, the case tiles. These do not:
   - Checkout's object is a typographic list of payment-method names. The words are Hanzo's, but it is a word wall, not an object.
   - Tax's object is "VAT / GST" in big type and a shield outline in a grey tile. That is close to an icon in a box.
   - "What you can see once it is one pipe" is three ticked lines.
4. **One ask, nothing floating, scale with rhythm?**
   - **Ask:** after the hero, the header's "Try Hanzo" is the one solid fill (it is in Hanzo's words and sticky). On the first desktop screen there is none (see 1).
   - **Floating:** nothing from the page floats over content. The shared cookie card (desktop 760×69 at the bottom; phone 343×203, 25% of the screen) covers the hero's tracker and the lower phone until it is dismissed. That is shared chrome, but it hides this page's signature on first load.
   - **Scale:** good. There is one big thing per screen ($20.00 at 64px, 20%/80% at 64px, which grow while dragged), with medium headings and small mono captions. The one exception is the 32px payment-method list, which is big and has nothing to answer it.
5. **Every hover and press answers, no jumps?**
   - Every press answers: scale .97–.98, with no layout change.
   - Hovers are thin, and none of them "tells you something" (a number or a preview), which JAMES.md asks for:
     - the hero and close "Try Hanzo": the border goes from black 8% to 18% only;
     - "Explore APIs": I measured no change on the link itself;
     - tracker steps: the label goes from grey to ink;
     - tiles: a grey step from #f2f2f2 to #ededed;
     - rows: a fill.
   - The header's "Try Hanzo" hover is opacity 1 → .88, which is a "button that fades on hover". That is shared chrome, but it shows on this page.
   - The range input shows no visible focus ring on the Tab crawl (1 of 70 stops).
6. **Overlap, font swap, layout shift?** None from the page. CLS is 0.0003 on desktop and 0 on phone. I saw no font swap and no horizontal scroll at 1470, 375 or 320.
   - The phone code pane wraps the trailing comments badly: `console.log(payment.status);    //` then `'succeeded'` alone on the next line.
   - The phone legend under the dots wraps "SECOND PROCESSOR ● / CURRENT PROCESSOR" onto two ragged lines.
   - One React hydration-mismatch warning and a red "1 Issue" badge appeared during the first two filmed walks. I did not reproduce it in 6 fresh loads (desktop, phone, video on and off). It is likely a dev recompile while other pages changed, but the owner should confirm.
7. **Which reference, and is its motion there?** apple.com pinned scenes: yes, in the chapters. motion.dev state changes: the sheets, the card-to-panel open and the AnimatePresence screens. synchronized.studio card-to-page: no, the cards open panels in place, which the card notes. The editorial pointer-aware detail of osply/hamol is missing: nothing answers the pointer except the drag.
8. **Different from its neighbours?** The hero medium is different: a device mock, which no Business 1 sibling has. The skeleton below it is not. /ledger, /captable, /console, /dataroom, /flow and /gui all use the same `BizChapters` pinned stage, a `bz-sec` dark room and `BizOpen` tiles, in nearly the same order. James's "not just a template" bites from the second screen on.
9. **18 parts covered?** The card has all 18 headings and 18 `Done here:` lines. See the card check.
10. **Banned tells?** None from the page: no hue, no gradient text, no kicker over the h1, no Inter, no springs, no cursor label. Borderline: the Tax shield in a grey tile reads as "an icon in a box". Shared: the header ask's opacity fade.
11. **Copy untouched?** Yes: parity 139/139 text, 6/6 links.

## Card check
- Truthful: 18/18 headings and Done-here lines. Parity, taste and the h1/phone positions (258px desktop, 388px phone) match what I measured. The hero, close and Explore APIs Ctas have the data-cta ids it names. Reduced motion lands on `succeeded`. There is no `setInterval`, and press states are present.
- **Not true as written:**
  - Part 1 ticks "One solid fill per viewport". The first desktop screen has zero solid fills.
  - Part 3 ticks "Sells in 5 s". The checkout's end state is below the fold at both test sizes, so the sale's last beat is not on the first screen.
- Generous: Part 8 says every control has hover. Explore APIs and the code pane's Copy showed no hover change, and the range input has no visible focus ring.
- Part 18's review box is correctly unticked.

## To reach 8
- **Land the payoff on the first screen.**
  - At 1470×801 the whole phone, including the Pay → "succeeded" button, must sit above 801. Shorten the device (the method grid can be 2 rows, the screen area shorter) or scale the stage so its bottom lands at about 760px.
  - On phone, keep the crop but move the outcome up: for example, put the button directly under the amount, so "succeeded" is visible inside 812.
- **Put one solid fill on the first desktop screen.** Either keep the header's "Try Hanzo" solid while the hero is in view, or make the hero "Try Hanzo" the solid one (with `data-thumb`) and let the header take over once it leaves view, as MASTER part 4 describes. Do the same at the close, which has no solid either.
- **Make the back half arrive and move, one thing at a time.**
  - Checkout: let the method list be the object. The words light in sequence and the hovered method shows which connector would carry it, from Hanzo's own "Local methods handled by whichever processor supports them best". Or cut the words in by line mask.
  - Tax: give the two tiles a state change on arrival (for example, VAT/GST rolling) rather than a static glyph in a box.
  - Cases: open the four tiles with a list-level entrance, not as a static grid.
  - Close the white gaps: the chapter head (about 250px dead) and the space before "Explore Further".
- **Hovers that tell you something.**
  - A case tile could preview its four features.
  - A tax tile could show its first bullet.
  - "Explore APIs" needs any visible answer.
  - Add a focus ring on the range input.
- **Break the Business-kit skeleton below the hero.** At least reorder or reshape the chapters, the dark room and the tiles so that /payments does not scroll like /ledger and /captable from screen 2 on. The route diagram is this page's own: let it lead.
- **Phone polish.** Stop the code pane wrapping trailing comments (the kit's `Code` should scroll horizontally on phone, or break before the `//`), and keep the dot legend on one line.
- **Fix the card** (parts 1, 3 and 8) once these land.
