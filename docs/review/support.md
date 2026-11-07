# /support — James-eye review (re-run)

Verdict: 7/10
First complaint: "On my phone the line under the headline turns up before the headline does, with a big white hole where the search and the answer should be, and then they pop in. Then the little demo types 'support ticket' and nothing happens. Answering as you type is the one trick this page has, and it never shows me."

Walked 7 Nov, about 15:00 to 15:27 UTC. The page file is at `24d2adc` (`components/pages/Support.jsx`, `Support.css`) and HEAD is `dc3a706`; nothing on this page's path changed during the walk. I filmed it moving at 1470×801 and 375×812 (isMobile, hasTouch), on a first visit and a return visit (`hz-arrived` set):
- a scroll with a dwell on every screen;
- hover and press on desktop, taps on the phone;
- typing whole words, partial words, words that match nothing and long queries, plus Enter.

I also checked 320×640, 375×667, JS off, reduced motion, a Tab crawl, a 4× CPU phone return visit, and /contact and /contact-sales side by side.

Stills:
- `review/support/desktop-walk.jpg`.
  - Top row: the arrival (h1 cutting in, card rising); the demo holding "support ticket", where two words are marked and nothing else changes; the Community row hovered and previewing in the card; "api key" answered by Documentation.
  - Bottom row: "refund xyz" turning into the email with your words as the subject; reduced motion with a Pause button that does nothing; the first Tab stop on the hero ask, a square ink box around a round button; the closing Band, with no ask bar after the hero.
- `review/support/phone-walk.jpg`, first visit, left to right:
  - first paint: the lede and the list, no h1, and a 250px hole;
  - the h1 is in and the hole is still there;
  - the card lands and the demo types;
  - "api key";
  - "refund xyz";
  - reduced motion with the dead Pause;
  - the list ending into the Band, with no bar.

## What changed since 6/10 (each checked again)
- **The focus ring in the pill is fixed.** Clicking or tapping the field gives the input outline none and box-shadow none. The pill carries one concentric ring (1px ink plus a 5px white halo). There is no square box inside the pill at either width.
- **The numerals are gone.** Nothing crosses the titles at 375 or 320. All six titles end inside the card (title right edge 334, card edge 355 at 375; 279 and 300 at 320).
- **Typing is calm.** I logged every key:
  - "g" and "gi" keep the Help Center, and "git" gives GitHub after the 300ms settle;
  - "api" waits, then "api " gives Documentation with "API" marked;
  - "status pa" stays on System Status the whole way;
  - "tickets" finds the Help Center with "ticket." marked;
  - "discord" gives Community and "bug" gives GitHub;
  - "refund xyz" and "qqqq" become "Email us", with `mailto:support@hanzo.ai?subject=refund%20xyz`, the subject shown in the card, and the live region saying "Email us".
  
  No flash of the no-match state appears at any first letter.
- **The demo no longer changes the ask.** I sampled every 120ms from load to 11s: the solid read "Open Help Center" throughout, on both widths and both visits. Pointing at the card stops the demo at once (the pill clears and Pause goes).
- **The preview stays reachable.** Moving from the Community row to the card's button lands on "Join the community" (`https://discord.gg/XthHQQj`). Leaving the hero returns the card to the Help Center.
- **The marks no longer move words.** CLS is 0.0000 in every run: desktop first and return visits, the phone, through the demo and through 16 typed queries.
- **One row is marked best.** With no match, the "Email us" row is ink.
- **Buttons are kit `Go`** and the page ends on the kit `Band`.

## What works
- **The idea is right and still this page's own.** It is one line of display type, a search pill, an answer under it, and the six doors beside it as a live list. Enter on a match opens that door ("status" then Enter opens status.hanzo.ai in a new tab). It is the clearest page in the company family.
- **Fit.**
  - At 1470×801: h1 171–273 (84px, line height 1.02); pill 306–362; card 379–675 with "Open Help Center" ending at y=630; lede and six rows to the right (to y=754).
  - At 375×812 the order is h1 (41px, one line), lede, pill, then card, and the button ends at y=590. That is also above the fold at 375×667.
- **Hover and press answer.**
  - A row inks, slides 6px and moves its arrow 4px, and the card previews that door.
  - The solid goes to #262626 and scales 1.02, and presses to 0.97.
  - The pill border inks from 10% to 30% black on hover.
  - The list re-orders on a 300ms ease when a finished word ranks a new door first.
- **Colour.** Ink, deck greys and white only. `taste.py`: OK.
- **States.**
  - JS off: all six answers are stacked and visible with their buttons, plus the pill, the list and the Band (0 hidden). No sideways scroll.
  - Reduced motion: no demo, and `getAnimations()` is empty after 4s.
  - Before hydration only the shown pane takes taps (`visibility` from the server CSS).
- **Engineering.**
  - No sideways scroll at 320 or 375.
  - No phone target under 44px (rows are 64px).
  - No font swap.
  - Parity is 24/24 text and 6/6 links.
  - `data-cta` support.answer.1–6, and `data-thumb` on the first.
  - Console: 0 errors across 14 clean loads. The hydration mismatches I first saw come from Playwright's caret-hiding screenshots during hydration (3 of 3 runs with it, 0 of 6 without), so they are not this page's.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** On desktop, yes. The h1 cuts in by CSS 0.55s after first paint. On a warm load the card rises with it and the list follows (0.4s entries). Two faults:
   - **The tool waits for JavaScript.** `.xsp-up` (the pill, the card, the primary) and `.xsp-in` (the lede and list) are paused at opacity 0 until `data-go`, and `data-go` is set only after hydration by `useGo()`. `useGo()` waits for an arrival curtain that never runs on /support: `arrival.js` returns unless the path is `/`. So the LCP element (the answer's description) is opacity 0 until JS arrives:
     - LCP was 2.7s on a warm desktop load and 4.7s on a phone first visit (dev build);
     - at 4× CPU the first paint was at 696ms and the card was still invisible until 2,783ms.
   - **The phone arrival is out of order.** At ≤899px, `.xsp-side { display: contents }` throws away the side's entrance, so the lede and the list paint at once. The h1 rises 0.55s later, and the pill and card fill a 250px hole only once JS lands. In the film:
     - first paint at 1.4s shows the lede, a hole and the rows;
     - the h1 arrives at about 2.0s;
     - the card arrives at 3.1s.
     
     The lede leads its own headline, and the header's "Try Hanzo" flips from solid to outline when the card finally shows.
2. **One in, one out, or a document?** Neither. It is a tool, then the closing Band, then the footer (document 2,649px on desktop). That is right for a help page. The Band's line is the only scroll moment, and it is the kit's own reveal.
3. **A real visual object in every section?** The hero has working product UI: the pill, the answer card and the live list. The Band is the standard closing room. No Hanzo media exists for /support, so this is not penalised.
4. **One ask, sticky after the hero?** One solid in the hero, in Hanzo's words, and it no longer changes under you. But **the ask bar never appears at either width**, because the shared bar yields to `.x-band`:
   - On desktop the Band starts at y=870 in an 801px window, so it is on screen before "Open Help Center" (bottom 630) scrolls away.
   - On the phone the Band enters at scroll 303 and the hero ask leaves at about 526.

   I scrolled both in 360px steps with a dwell and saw no bar. After the hero, the solid on screen is the Band's "Email support@hanzo.ai". For a page this short that is defensible, but the card claims the bar arrives, and it does not.
5. **Every hover and press answers, no jumps?** Yes for the pointer (see What works). The keyboard has two faults:
   - **Two Tab stops per ask, the first a square box.** The kit `Go` wraps its link in a `motion.span` with `whileTap`, which makes it `tabindex="0"`. Tab from the field lands on that span first. The page's own `.xsp :focus-visible` draws a 2px ink rectangle with a white halo around the round button, and Enter there does nothing (no popup). The second Tab reaches the link. The Band's ask does the same.
   - **The Band ask's ring is lost on black.** `.xsp :focus-visible` also reaches the Band, so the ring there is a 2px ink outline on #000 (invisible) plus a 5px white halo that merges into the #fafafa button. MASTER part 8 asks for white with a black halo on dark rooms.
6. **Overlaps, font swap, layout shift?** There are no overlaps at 1470×801, 375×812 or 320×640. CLS is 0 everywhere and there is no font swap. The "shift" left is the phone's arrival hole from 1.
7. **Which reference, and is its motion there?** Its true kin is still support.apple.com's "How can we help?" with search, which is not on his list.
   - The osply/hamol micro-motion is there: the row slide, the arrow nudge, the list re-order and the pane lift.
   - Apple's persistent ask is not (see 4).
   - Nothing opens into a page: every door leaves the site.
   - **The self-running demo no longer demonstrates anything.** It types "support ticket", which keeps the Help Center: the card does not change and the list does not move. The only visible results are two small marks and the "Email us" row darkening a shade, because "support@hanzo.ai" matches. So the idle moment shows the page answering nothing. The fix for the old complaint went too far.
8. **Different from its neighbours?** Yes.
   - /contact: a 2-line h1 on the left and a plug-board card on the right.
   - /contact-sales: an h1 and a form card.
   - /support: one full-width line over a pill and card, with the live list on the right.
   
   /contact and /support both open on Hanzo's "How can we help?". It is listed on the card as a copy question.
9. **18 areas?** See below. `docs/coverage/support.md` is mostly accurate now. The wrong claims:
   - **"The h1 cuts in once the curtain has cleared the top (550ms after it starts lifting)."** There is no curtain on /support; the 550ms branch in `useGo` never runs.
   - **"h1 and LCP element in server HTML" / "no `opacity:0` on the LCP element."** The LCP element is the answer's description, and it is opacity 0 until hydration.
   - **"`data-thumb` … drives the shared ask bar after the hero."** The bar never shows at either width.
   - **"Focus ring visible on every stop of a Tab crawl."** The first stop on each ask is the square box around the round button (see 5), and the Band's ring is lost on black.
   - **"Pause control on every moving item."** It is true with motion on. Under reduced motion the Pause is a dead button (see the 18 areas).
10. **Banned tells?** None:
    - nothing above the h1;
    - no hue;
    - no gradient text;
    - Zen, not Inter;
    - no `title=`;
    - no button that fades on hover;
    - no icon boxes.
11. **Copy untouched?** Parity is 24/24 and 6/6. The numerals, the ↵ glyphs and the repeated placeholder are gone. The demo phrase is Hanzo's own words.

## Missing from the 18 areas
- **2.3 First impression.**
  - The pill, the card and the primary (the LCP element) sit at opacity 0 until hydration, behind a curtain gate that never applies here.
  - On the phone the lede and the list paint before the h1, with a 250px hole for the card.
- **2.4 Conversion.** No ask bar at either width (the Band blocks it). The card says otherwise.
- **2.8 Components.**
  - Under reduced motion the Pause button is an orphaned server node. The server renders it because `useReducedMotion()` is null there. The client never renders it, and the node has no React fiber. So it stays in the pill, takes a Tab stop, is announced as "Pause", and clicking it does nothing (checked: still present after the click).
  - The kit `Go` adds a dead, square-ringed Tab stop before each ask. That is a kit fault, but this page's focus rule draws the square.
- **2.9 Motion.** The idle demo doesn't show the signature (no re-rank, no answer change).
- **2.12 Accessibility.**
  - The Band ask's focus ring is ink on black.
  - There are two stops per ask.
  - The reduced-motion Pause is dead.
- **2.13 Performance.** LCP is gated on JS (2.7s desktop warm, 4.7s phone first visit, dev build).
- **2.3 Rhythm (minor).** On desktop the Band starts at y=870, so nothing peeks below the first screen; MASTER asks for a 56px peek.

## Fixes (in order)
1. **Paint the tool at first paint.**
   - Drop the `data-go` gate and `useGo`'s curtain branch, since no curtain runs here.
   - Run `.xsp-up` and `.xsp-in` as plain CSS entries timed just after the h1 (for example 0.65s and 0.8s delays, as MaskLines does). Keep `html.x-arriving` pausing them as the other company pages do, in case a curtain ever comes.
   - On the phone, give the lede and `.xsp-doors` their own entry classes, so `display: contents` stops cancelling them and the lede never lands before the h1.
2. **Let the demo show the trick, once.** Type one phrase in Hanzo's words that re-ranks, such as "incident history" from System Status's line:
   - the list re-orders and the card shows that door for the hold (about 2.5s);
   - then it clears back to the Help Center and rests;
   - it plays once, and the pointer and focus stops already in place make the old ask-swapping complaint moot.
   
   If you keep "support ticket", the page's idle moment demonstrates nothing.
3. **Kill the dead Pause under reduced motion.** Render it only after hydration (`{hyd && playing && …}`), or hide it under `prefers-reduced-motion` in CSS, so the server never ships a control the client won't own.
4. **One Tab stop per ask, with a round ring.**
   - File `docs/requests/support.md` for the kit: `Go`'s `motion.span` needs `tabIndex={-1}`, or the tap scale should move onto the `<a>`.
   - Meanwhile set `.xsp .x-go:focus-visible { outline: none; box-shadow: none }`, so the stop at least draws no square.
   - Give the Band its dark-room ring: `.xsp .x-band :focus-visible { outline-color: #fafafa; box-shadow: 0 0 0 5px #000 }`.
5. **Correct the card.** Remove the curtain claim, the ask-bar claim, the LCP claim and the "every stop" focus claim. Decide on the missing bar and note the decision: the Band's email ask is the ask after the hero on a page this short.
6. **Optional: let the Band peek on desktop.** Trim the hero's bottom padding so about 56px of the black shows under the first screen at 1470×801.
