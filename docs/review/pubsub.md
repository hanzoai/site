# /pubsub — James-eye review

Verdict: 7/10
First complaint: "Good, the bus comes down with me now. But on the accounts chapter there's a white line drawn straight through 'account b', and on my phone half the cards say 'from the …', 'as fast a…', 'one ans…'. It looks unfinished right where it should feel premium."

Walked 7 Nov on main at `e152bcc7` ("the chapters pin the hero's bus itself…"), fresh, without using the earlier review's findings. Playwright, moving: 1470×801 (wheel in quarter-steps of 260px, ~0.9 s dwell, 38 stops to the footer) and 375×812 (isMobile, hasTouch, smooth `scrollBy` in 300px steps, 37 stops), each with video recorded and 8 frames over the first 6 s with no input. Then: hover and press on the hero ask, hover on stream cell 39, every start choice in chapter 01, "no acks" and "ack all below" in chapter 02 (sampled the subscriber states for 6 s each), the chapter pause, a bounding-box check of the account wall, and a check for ellipsis truncation in each phone chapter. Also reduced motion, JS off, an isolated load for console errors, and /realtime, /stream and /datastore at chapter depth. Non-localhost POSTs blocked. Stills: `review/pubsub/desktop-hero-replay.jpg` (hover names the replay), `review/pubsub/desktop-chapter.jpg` (06: the wall through "account b"), `review/pubsub/phone-walk.jpg` (01 on phone: "from the …", "as fast a…").

## What works
- **The hero runs itself.** Within half a second the next message drops in, its cell turns white, and the wires draw down. Audit goes "↻ redelivered" and then acks, and the queue group lights one of three. All 8 idle frames differ. Nothing sits above the h1.
- **Hovering tells you something.** With the pointer on 39, cells 39–43 light up and the toolbar reads "replay · from #39 → #43".
- **The chapters now pin the hero's own bus.** This was the old main complaint, and it is fixed. It is the same black object: toolbar, publish card, EVENTS cells, the three wires and three subscribers. Each chapter changes the bus in a way you can read:
  - **01:** "keep by age/count/bytes" cycles, and the start switch really moves the cursor. "Newest" fades 38–39 as aged out and outlines 43; "a sequence" reads 40→43.
  - **02:** "no acks" turns all three into "delivered" with no redelivery. "Ack all below" shows "ack ≤ 44" on all three. "Ack every" shows audit dashed "↻ redelivered".
  - **03:** one key at a time goes "✓ watch · 1056".
  - **04:** a single wire goes to exactly one instance.
  - **05:** cells fill with chunks, then "put back together" and "watch changed".
  - **06:** account b is dashed and struck through.
  - Side by side with /realtime's white client cards (`nb-realtime`), the two now read as different pages.
- **Every control answers.** The hero ask presses to scale .97. The pills glide (layoutId). The ack clause updates under the switch (`aria-live`). The chapter pause flips to "Play" with `aria-pressed`.
- **The phone hero shows the full fan**: three wires over three subscribers. The ask's bottom edge is at 234px.
- **Numbers:**
  - No horizontal scroll at either size (1470/1470, 375/375).
  - With reduced motion, 0 animations are running and the hero text is stable.
  - With JS off, 0 of 37 headings and paragraphs are hidden.
  - An isolated load logs 0 console errors.
  - Parity 82/82 text and 2/2 links; taste OK; unique OK.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. "Hanzo PubSub / The bus everything else rides / GitHub" sits beside a bus that publishes and fans out before you have read the line.
2. **One in, one out, or a document?** Through the hero and the six chapters, yes: the bus stays pinned and one thing changes per chapter. After the chapters it turns back into a document: the quiet room (heading, prompt, then four equal spec words), a static events.go split, and the close. The bottom third has no moment of its own.
3. **A real object in every section?** Yes: bus, bus, prompt, spec row, events.go, the Sigil card. Some chapters carry leftovers from the hero bus that the chapter doesn't use:
   - **03 (bucket):** five empty cells and a lone "43" next to a value of 1056.
   - **04 (Request-Reply):** still shows stream cells 38–43, though no stream is involved.
   - **06:** the stream row and the publish card are identical to the hero's.

   Chapter 02 dropped the "duplicate collapsed · two minutes" visual, so the copy's second sentence has no picture.
4. **One ask, nothing floating; scale rhythm?**
   - **Desktop:** one solid at a time. The header "Try Hanzo" is outlined over the hero, then becomes a solid "GitHub". Only the shared cookie card floats.
   - **Phone:** the shared header keeps a solid "Try Hanzo" beside the hero's "GitHub", and the shared bottom "GitHub" bar appears after the hero. Both are shared chrome, not held against the page.
   - **Scale:** big hero, medium chapters (32px titles), 44px Air spec words, and "Get PubSub" growing at the close. The middle now has its object, but no element grows or shrinks as its own moment.
5. **Every hover and press answers, no jumps?**
   - **Hover:** answers on everything I tried. The hero ask's hover is #fafafa → #fff on black, which you can hardly see; the press carries it.
   - **Jump 1:** picking "no acks" wraps the ack clause onto two lines, and the whole left column re-centres. The title moves 224 → 212px under your pointer.
   - **Jump 2:** in chapter 04 the black card shrinks from 484 to 468px and its top jumps 189 → 197px. It jumps back at 05. This is page CLS: 0.006 → 0.021 on desktop and 0.009 → 0.025 on phone, all from these steps.
6. **Overlaps, font swap, layout shift?** Two overlaps, both from the page:
   - **(a) The account wall (desktop).** `.ps-subs.walled::after` sits at `left: calc(66.6% - 5px)`, but the third card is wider (1052–1287 against 181px cards). The 2px white line lands at x≈1076, inside "account b", and crosses its name and "events.>". On phone the columns are equal, so it falls in the gap.
   - **(b) The chapter pause.** It sits flush in the card's top-right corner (box 1267–1311 against a card edge of 1311, 4px from the top), jammed into the rounded corner instead of inset like the toolbar text. Same on phone.
   - **The red "1 Issue" badge:** it appeared in the long walks, from a hydration attribute mismatch. An isolated load logged 0 console errors, so it is not held against the page. No font swap seen.
7. **Which reference, is its motion there?** The Apple product page: a pinned stage where the product changes per chapter is really there now. From motion.dev: the layoutId pill, the line-mask cut-in, and the wires drawing as line art. The osply/hamol editorial asymmetry is not there below the chapters, which use the shared cloud layout.
8. **Different from its neighbours?** Yes, through the chapters now. /realtime pins white client cards with pills. /datastore and /stream have their own objects. /pubsub pins one black top-down bus. The heading-left, dashes, object-right frame is shared system, which is fine.
9. **18 parts?** The card exists with 18/18 `Done here:` filled, but several entries now describe a page that no longer exists; see Card check.
10. **Banned tells?** None. No hue, no eyebrow above the h1 ("NATS JetStream" is the bus's own toolbar), no gradient text, no glow, no fade on hover, and no feature row of three equal boxes (the three subscribers are the object).
11. **Copy untouched?** Yes, parity is clean.

## Card check
`docs/coverage/pubsub.md` has 18 headings, every `Done here:` filled, three lines on top, in MASTER format. Checked against the page:
- **True:**
  - parity and links;
  - part 7's "the chapters' object is now the hero's bus itself" and its per-chapter list;
  - the `aria-pressed` switches with a gliding pill;
  - the replay hover naming the range;
  - reduced motion settled and JS off legible;
  - the desktop one-solid header;
  - the phone fan with three wires;
  - the ask above the fold at 375.
- **Stale or false (the server inspector was removed; `ps-ins`, `ps-ov` and `ps-dup` are absent from the served HTML):**
  - Part 2: "The inspector's six rows are buttons that scroll to their chapter."
  - Part 8: "the inspector rows … a row opens its chapter."
  - Part 9: "idle (bus, inspector)".
  - Part 10: "the bus and the inspector each have a 44px LivePause".
  - Part 11: "the inspector sits in a fixed 35svh window".
  - Part 17: "duplicate collapsed" as a designed state on the page.
  - The page file's `V2:` line still says "six pinned chapters over one outlined server inspector". `Inspector`, `Overview` and `Panel` remain in `Pubsub.jsx` as dead code.
- **Overstated:** part 7 says that on phones the bus has "nothing hidden inside the panel". The publish card is hidden on phone (the card does say so), and 4 of 6 chapters cut subscriber labels with an ellipsis ("from the beginning", "as fast as it can", "watch · 1048", "one answer", "chunk 4 / 6").
- No cap applied; the misstatements are noted and should be corrected.

## To reach 8
- **Fix the account wall.** Place it in the gap between card 2 and card 3 (measure the gap, or put the wall in the grid as its own track) so it never crosses "account b". It is the payoff of chapter 06, and right now it reads as a rendering bug.
- **Phone chapters: no ellipses.** Let the subscriber line wrap to two lines inside a taller fixed card, or use shorter drawn states that fit 100px ("from start", "fast", "✓ one", "4/6"). This keeps every card the same height while nothing gets cut. Also keep "↻ redelivered" in the hero from wrapping and lifting the audit label above its neighbours.
- **No jumps in the pin.** Give the chapter bus one fixed height across all six chapters (04 loses 16px when it draws one wire). Reserve two lines for the ack clause so "no acks" doesn't re-centre the left column under the pointer.
- **Make every chapter's leftovers belong to it.**
  - In 03, show the bucket as keys (orders/payments/signups with their last value), not five blanks and a stray "43".
  - In 04, replace the sequence row with the queue group or the request in flight.
  - In 06, split the cells by account.
  - Bring "duplicate collapsed · two minutes" back into 02 (two identical publishes, one cell).
- **Inset the chapter pause** to the toolbar's padding (top/right 16–24px), not flush in the card corner.
- **After the chapters, one moment that isn't a document.** For example, events.go highlights the line the bus just did (Publish, Fetch, Ack) as you arrive, or the four spec words land one by one from the bus. Stay within the motion budget.
- **Correct the card** (parts 2, 7, 8, 9, 10, 11 and 17) and the `V2:` line, and delete the dead `Inspector`/`Overview`/`Panel` code.
