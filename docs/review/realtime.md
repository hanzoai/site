# /realtime — James-eye review

Verdict: 7/10
First complaint: "The top's right now. The title, the button, then the three screens with the record landing on all of them. Then I scroll and it's eight screens of the same thing: a bit of text on the left and a grey box with a black bar on the right. PubSub, S3 and Registry have that exact box. It's a template again."

Walked 7 Nov 2026, about 16:45 UTC, on main `fa67b96f`, which includes the fix `45ffde99`. I walked it fresh and did not reuse the earlier critic's frames. I used Playwright Chromium against the dev server on :4180:
- **Desktop** at 1470×801 and **phone** at 375×812 (isMobile, hasTouch, DPR 2), both recorded on video.
- **First frames with no input** at 0.25, 0.6, 1, 1.6, 2.5, 3.5, 4.8 and 6 s.
- **Scroll:** the whole page in 1/16-viewport steps, wheel on desktop and small scrollBy steps on phone, dwelling 0.8 s per screen. That gave 34 stops on desktop and 37 on phone, viewed as contact sheets.
- **Controls:** hovered and pressed the hero ask, the docs link, all three rule switches, the hero pause, the three handshake calls, "The handshake, in full", the three growth rows, the rail (a drag throw plus the Next and Prev arrows) and the close ask.
- **Other checks:** reduced motion, JS off, CLS, fixed elements, 375×667 fold, 320 width, and the phone bottom layers while scrolling. Non-localhost POSTs were blocked.

Stills in `docs/review/realtime/`: `d-hero.jpg`, `d-chapter.jpg` and `p-hero.jpg`.

## What works
- **The hero is fixed and it sells.** At 1470 the read order is now the h1 (52px, 2 lines, y 132), then "Live record updates", **Start Building** and "View Documentation" on one line (y 268), then the three clients below. The old complaint about the ask hanging alone bottom-right is gone. On phone the h1 is 2 lines and the ask's bottom is at 259px at 375×667, well above the fold.
- **Alive at once.** The record cycles create → update → delete across Client 1 and Client 2. Client 3 (dashed, "no b") never sees b. That is Hanzo's "deletes are checked too" played out as the hero object.
- **Interactions answer:**
  - Flipping Client 3's switch changes it to "reads b" (`aria-pressed` true).
  - Pause turns into Play.
- **No shift.** The client heights are now fixed: `rt-say` sits at y 860 across 10 samples over 7 s. CLS is 0.0010 on desktop and 0.0048 on phone over the full walk (it was 0.051 on phone before).
- **Every control I pressed answered:**
  - **Hero ask:** hover goes #0a0a0a → #262626, press scales 0.974. Not an opacity fade.
  - **"View Documentation":** the underline goes from 30% to full ink and its offset moves 3 → 7px. This was dead last round.
  - **Handshake calls:** each one marks its line in the wire (`/v1/realtime/token`, `subscriptions`, `render(record)`).
  - **The disclosure** opens.
  - **The third growth row** adds org c's lane to the tenant map (3 → 4 lanes).
  - **Close ask:** same hover and press as the hero ask.
- **One solid fill.** At the close, the header ask goes quiet (transparent "Start Building") while the close's solid shows.
- **The black room is good.** It has three calls, one open at a time, beside the real `realtime.js` on graphite. It is the strongest middle section.
- **Checks:**
  - Parity 138/138 text and 4/4 links. `taste.py` OK. `unique.py` OK.
  - Reduced motion: 0 running animations after 3.5 s.
  - JS off: 75 text blocks, 0 hidden.
  - No horizontal scroll at 375 or 320.
  - No phone target under 44px.

## The 11 answers
1. **Sells in 5 s? Moves in 1 s?** Yes on both counts. The first change lands inside the first second, and the h1, ask and stage read in that order.
2. **One in, one out, or a document?** Better, but still a document in the middle.
   - **The chapters:** the eight pinned chapters change one panel at a time. That is the Apple move. But it is about 10 screens of the identical composition: title, `0N / 08` and a paragraph left, an outlined grey tile with a black header bar right, and a tick row. By chapter 4 or 5 nothing new is happening to the *page*, only inside the box (`d-chapter.jpg`).
   - **Statement section:** "Open one stream…" has roughly 300px of empty white above it at 1470 before the paragraph and code arrive (`d-s01`).
   - **Before "Two calls…":** the page opens a half-screen of blank space just before that strip (`d-s27`).
3. **A real visual in every section?** Yes:
   - the three clients
   - the subscribe code
   - the per-chapter stream panel
   - six drawn use-case vignettes
   - the wire
   - the tenant map
   - the GitHub card art
   - the close contour Sigil

   There is no Hanzo media for Realtime, so there is no 4-image block, which is fair.
4. **One ask, nothing floating? Scale rhythm?**
   - **Desktop:** one solid at a time. The header swaps "Try Hanzo" to "Start Building" after the hero and goes quiet at the close.
   - **Phone:** the slim "Start Building" bar rises through the chapters and sits clear of content. The phone header keeps a black "Try Hanzo" pill, so the phone shows two asks in different words. That is the shared header and is not held against the page.
   - **Scale:** h1 52, chapter titles about 26, mono captions small, the growth headings large-light, and "Get Realtime" the one big thing at the end. Good rhythm.
5. **Every hover and press answers, no jumps?** Mostly.
   - **The rail still breaks.** A drag throw carries the track to −981px, past the arrow clamp of −822px. Pressing **Next** then moves it *back* to −822. The previous review flagged this exact bug and it is not fixed.
   - **The use-case cards** show no measured change on hover (fill stays #f5f5f5, no transform).
6. **Overlap, font swap, layout shift?**
   - No overlap at either size. The h1 box doesn't move. CLS is 0.001 on desktop and 0.005 on phone.
   - A red "1 Issue" badge (a React hydration attribute mismatch) appeared in the recorded walk. It did not appear on a single quiet load (0 console errors). This matches `_shared.md` §3: it only shows under load, it is shared, and it is not held against the page.
7. **Which reference, and is its motion there?**
   - **Apple pinned scenes with one changing panel:** present.
   - **motion.dev:** layout glides, the drag rail with inertia (but no hard stop), and the magnetic close are present.
   - **osply/hamol editorial asymmetry:** absent. Every chapter uses the same split.
8. **Different from its neighbours?** The hero is its own: three devices of three widths receiving one record. The body is not. `PinnedChapters` with text left and box right is used by 9 cloud pages (Metrics, Mq, Network, Node, O11y, Pubsub, Realtime, Registry, S3). Realtime runs it longest, with 8 chapters.
9. **18 parts covered?** The card has all 18 headings with `Done here:` filled. See below.
10. **Banned tells?**
    - None: no hue, no gradient text, nothing above the h1 or an h2, no Inter, no springs.
    - "OPEN A STREAM" sits over a card title, not a headline, which is acceptable.
    - The ✓ and × marks are status shapes, which is allowed.
11. **Copy untouched?** Yes. Parity is 0 missing. The drawn demo words are flagged on the card.

## Card check
`docs/coverage/realtime.md` has 18 headings, every `Done here:` filled, and copy questions, requests and deleted forks listed. It is mostly truthful now. CLS, the docs hover and the hero order are all verified. Corrections:
- **Part 9 and Part 8:** "the drag rail with inertia and hard stops" is false. The throw overshoots to −981 against an arrow clamp of −822, and Next then moves backwards.
- **Part 6 / Part 3:** the phone h1 measures 34px on 2 lines. MASTER asks for 3 lines at 40px. Two lines is arguably better, but it should be stated on the card as a decision.
- **Part 18:** `V2: 8/10` in the page file is the builder's own score. This review is 7.

## To reach 8
- **Break the eight-chapter run.** This is the main issue, and every word should stay. Either:
  - **Group into 3–4 beats:** stream + collection, isolation + deletes, one store + the rule, grant + limits. Each beat's panel shows two states.
  - **Change the composition partway:** for 2–3 chapters (for example "Deletes are checked too", which is the page's own thesis), flip the stage to the left, or go full-width with the words underneath.

  Either way, Realtime should stop reading as the shared cloud chapter template that 8 other pages use.
- **Clamp the rail drag** to the same minimum the arrows use (−822 at 1470), so a throw stops hard and Next never moves backwards. Then give the use-case cards a hover answer (a fill step to #ededed or a vignette that plays).
- **Close the two empty bands:** about 300px of white above the statement paragraph, and the half-screen gap before "Two calls and the page keeps itself current". The next thing should arrive as the last one leaves.
- **Note the 2-line phone h1 on the card** as a decision against MASTER's "3 lines at 40px".
- **Shared, not held against the page:** the phone header's "Try Hanzo" pill against the page's "Start Building" bar, and the hydration badge under load.
