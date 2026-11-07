# /realtime — James-eye review

Verdict: 7/10
First complaint: "Top's good, the three screens are alive. Then I scroll and it's seven screens of the same thing: words on the left, the same three little boxes on the right, lots of white around them. It's the right idea, it just goes on too long and nothing gets big. Then there's a big empty gap before the next bit."

Walked 7 Nov 2026, about 17:00 UTC, on main `b9ca6fb0`, which includes the fix `6edadcc1` (chapters pin the hero's clients, one hard stop on the rail, card hovers). I walked it fresh with my own frames. I used Playwright Chromium against the dev server on :4180:
- **Desktop** at 1470×801 and **phone** at 375×812 (isMobile, hasTouch, DPR 2), both recorded on video.
- **First frames with no input** at 0.25, 0.6, 1, 1.6, 2.5, 3.5, 4.8 and 6 s.
- **Scroll:** the whole page in quarter-viewport steps, wheel on desktop and scrollBy on phone, 0.5 s dwell per step, frames every half screen, viewed as contact sheets and at full size.
- **Controls:** hovered and pressed the hero ask, "View Documentation", Client 3's rule switch, the hero pause, a drag throw on the rail then Next and Prev, a use-case card hover, the three handshake calls, "The handshake, in full", the three growth figures and the close ask.
- **Other checks:** reduced motion, JS off, CLS, fixed elements, section heights, 375×667 fold, 320 width. Non-localhost POSTs blocked.

Stills in `docs/review/realtime/`: `d-hero.jpg`, `d-chapter.jpg`, `d-gap.jpg` and `p-hero.jpg`.

## What works
- **The hero sells and is alive.** h1 52px on 2 lines at y 132, then "Live record updates", **Start Building** and "View Documentation" on one line (y 268–316), then the three clients. The record cycles create → update → delete inside the first second; Client 3 ("no b") never sees b. On phone the h1 is 34px on 2 lines and the ask's bottom sits at 259px at 375×667 (330 at 320 wide).
- **The chapter template is gone.** The eight pinned chapters now show the hero's own three clients, and each chapter changes what they do: the stream drops and reconnects, Client 3 watches one record (`orders/ord_42`), clients become org a / org a / org b brokers, a delete skips the client that cannot read b, the rule labels change, the grant counts down, org c waits on the limit of two. This is no longer the PubSub/S3/Registry box (`d-chapter.jpg`).
- **Last round's bugs are fixed:**
  - **Rail:** a drag throw stops at −822px, exactly where Next stops; Next after a throw stays at −822, Prev returns to 0. No overshoot, no backwards move.
  - **Use-case cards:** hover steps the fill #f5f5f5 → #ededed and lifts the vignette 6px.
- **Every other control answers:**
  - **Hero and close asks:** hover #0a0a0a → #262626, press scale 0.971. Not an opacity fade.
  - **"View Documentation":** underline 30% → full ink, offset 3 → 7px.
  - **Client 3's switch:** "no b" → "reads b", `aria-pressed` false → true. Pause → Play.
  - **Handshake calls** mark `/v1/realtime/token`, `subscriptions` and `render(record)` in the wire; the disclosure opens.
  - **Growth figures** change the tenant map (data-at 0/1/2; the third adds org c's lane, 3 → 4).
- **One solid at a time on desktop.** The header swaps to "Start Building" after the hero and goes quiet (transparent) at the close.
- **Checks:**
  - CLS 0.0023 desktop, 0.0008 phone over the full walk; no shift entry over 0.002.
  - Parity 138/138 text, 4/4 links. `taste.py` OK. `unique.py` OK.
  - Reduced motion: 0 running animations after 3.5 s.
  - JS off: 93 text blocks, 0 hidden.
  - No horizontal scroll at 375 or 320; no target under 44px at 375×667 or 320.

## The 11 answers
1. **Sells in 5 s? Moves in 1 s?** Yes. The h1, ask and stage read in that order, and the first change lands before 1 s.
2. **One in, one out, or a document?** One in, one out, but too long in one place.
   - The pinned chapters run 5,559px at 1470 (5,635 at 375): 44% of the page, about seven screens, all one composition (title, `0N / 08`, paragraph left; the three clients at about 620×300 right, with ~250px of white above and below). The object changes; the page does not. Nothing grows or shrinks across the run.
   - When the pin releases, there is about 400px of empty white before "Build Interactive Experiences" (`d-gap.jpg`). On phone, "Limits belong to the deployment" sits alone over most of a blank screen before the rail.
   - The growth section ends with ~520px of space below its last row at 1470 (~450 on phone) before the "Two calls" strip.
3. **A real visual in every section?** Yes: the three clients, the subscribe code, the chapter clients, six drawn use-case vignettes, the wire, the tenant map, the GitHub card art and the close contour. No Hanzo media exists for Realtime, so no 4-image block, which is fair. The "Two calls" card art and the close Sigil are both contour drawings, one after the other.
4. **One ask, nothing floating? Scale rhythm?**
   - **Ask:** desktop is right. On phone the shared header keeps a black "Try Hanzo" pill all the way down, so the phone shows two asks in different words. That is shared chrome and not held against the page. The cookie card (203px on phone) is shared too.
   - **Scale:** h1 52, chapter titles about 30, mono captions small, growth figures 21 → 32 while open, "Get Realtime" the one big thing at the end. Good at the ends, flat in the middle: seven screens with no big moment.
5. **Every hover and press answers, no jumps?** Yes, everything I pressed answered without a layout jump.
6. **Overlap, font swap, layout shift?** None at either size. The red "1 Issue" badge (a hydration attribute mismatch) appeared during the long recorded walks under shared load. It did not appear on six single loads, with or without video. That matches `_shared.md` §3, so it is not counted.
7. **Which reference, and is its motion there?**
   - **Apple pinned scene with one changing panel:** present, and now with the page's own product.
   - **motion.dev:** layout glides, a drag rail with inertia and a hard stop, the black-room wipe. Present.
   - **osply/hamol editorial asymmetry:** still absent. Every chapter uses the same split at the same size.
8. **Different from its neighbours?** Yes now. The hero medium (three devices of three widths receiving one record) carries into the chapters, so the body no longer reads as the shared cloud chapter page.
9. **18 parts covered?** Yes: 18 headings, every `Done here:` filled. See the card check.
10. **Banned tells?** None: no hue, no gradient text, nothing above the h1 or an h2, no Inter, no springs. The ✓/× and dashed outlines are status shapes. "POPULAR USE CASES" and "OPEN A STREAM" sit below their headings, not above.
11. **Copy untouched?** Yes. Parity 0 missing. The drawn demo words are flagged on the card.

## Card check
`docs/coverage/realtime.md` has all 18 parts filled, with copy questions, requests and deleted forks listed. Most of it checks out (rail hard stop, card hover, CLS, phone h1 decision now stated in part 15). Corrections:
- **Part 11:** "the ask's bottom at 355px at 375×667". I measured 259px at 375×667 (330 at 320×700). That is better than claimed, but the number is wrong.
- **Part 18:** "no review file exists yet". One does (this one, and a 7/10 before it).
- **Part 9:** "magnetic close ask". A centred hover moved nothing measurable (transform none). It may only pull off-centre; worth stating how far.
- **Part 3:** "One idea per 100svh" is true, but the card does not say the chapter run is 44% of the page. It should.
- **`V2: 8/10`** in the page file is the builder's own score. This review is 7.

## To reach 8
- **Shorten and shape the chapter run.** Keep all eight chapters' words, but cut the pinned distance (about 5,600px → 3,200–3,600px, roughly 450px per chapter). Give the run one moment of scale: for example the clients grow to near hero size on "Deletes are checked too" (the page's own thesis, 04/08) and settle back after. Or flip that chapter's stage to the left. Seven screens of one size at one split is the main complaint.
- **Close the empty bands:**
  - The ~400px blank after the pin releases before "Build Interactive Experiences" (and the near-blank phone screen under "Limits belong to the deployment"). The rail heading should be arriving as the last chapter leaves.
  - The ~520px under the growth list before the "Two calls" strip.
- **Make the last two art pieces different.** The "Two calls" card and the close both use contour Sigils back to back. Give the card a different drawing, or let the close own the contour.
- **Fix the card's numbers:** part 11 fold (259px), part 18 review status, part 9 magnetic ask.
- **Shared, not held against the page:** the phone header's "Try Hanzo" pill against the page's "Start Building", the phone cookie card, and the hydration badge under load.
