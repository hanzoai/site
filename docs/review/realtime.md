# /realtime — James-eye review

Verdict: 7/10
First complaint: "The top is good, three screens and the record jumping across them straight away. Then I scroll and it's eight screens of a bit of text on the left and a white box on the right, the same as Datastore and PubSub. And on the first screen the button is floating down on its own in the bottom right with nothing above it."

Walked 7 Nov 2026 by an independent critic, with Playwright Chromium against the dev server on :4180. Desktop was 1470×801 and phone was 375×812 (isMobile, hasTouch, DPR 2), both recorded on video. I took frames at 0.25, 0.6, 1, 1.6, 2.5, 3.5, 4.8 and 6 s with no input. Then I scrolled the whole page in steps of 1/16 viewport (wheel on desktop, small scrollBy steps on phone) and paused 0.9 s on each screen: 34 stops on desktop, 37 on phone. I hovered and pressed the hero ask, the docs link, the rule switches, pause, the handshake calls, the disclosure, the rail (drag and arrows), the growth figures, the card and the close ask. I also ran a Tab crawl, reduced motion, JS off, CLS and a check for fixed elements. Non-localhost POSTs were blocked. Stills are in `docs/review/realtime/`: `d-hero.jpg`, `d-chapter.jpg` and `p-hero.jpg`.

## What works
- **Alive at once.** The first record change lands by about 0.6 s. Create, update and delete then cycle on all three clients, and the delete visibly skips Client 3, whose rule can't read b. That puts Hanzo's own claim, "deletes are checked too", on screen as the hero object. A real idea, not decoration.
- **Every demo is self-running and pausable**: the hero, the stream map, the handshake wire and the tenant map. Each has a 44px pause with `aria-pressed`.
- **Every control I tried answered:**
  - The rule switch flips Client 3 to "reads b" (aria-pressed true) and the next replay includes b.
  - Each handshake call marks its line in the wire (`/v1/realtime/token`, `subscriptions`, `render(record)`).
  - "The handshake, in full" opens.
  - Hovering the third growth figure grows it (21 → 32px) and adds org d to the tenant map (4 lanes).
  - The rail drags with inertia (−903px on a 500px throw).
  - Ask press scales to 0.971. Hover darkens the fill (#0a0a0a → #262626), never by opacity.
  - Card hover changes the fill (#f5f5f5 → #ededed).
- **Scale has rhythm.**
  - h1 52px on desktop and 40px on phone.
  - Chapter titles are medium, notes small.
  - The active growth figure grows while it is the moment.
  - "Get Realtime" is the one big thing at the close.
- **One black room** (the handshake), entered by a wipe and placed well, about two-thirds of the way down.
- **Sticky ask.** The desktop header swaps "Try Hanzo" to "Start Building" once you leave the hero. On phone, a quiet "Start Building" bar rises during the chapters.
- **Checks:**
  - Parity 138/138 text, 4/4 links. `taste.py` OK. `unique.py` OK.
  - No horizontal scroll at either size.
  - Reduced motion: 0 running animations after 3.5 s, and the final state shows.
  - JS off: the full page reads, with 0 hidden text runs.
  - No phone target under 44px.
  - The Tab crawl reaches every control in a sensible order.

## The 11 answers
1. **Sells in 5 s? Moves in 1 s?** Yes, it moves by 0.6 s.
   - **Desktop selling is weaker than it should be.** The h1 sits top left (y 132). "Live record updates" and the ask hang alone in the right column at y 528–660, bottom-aligned to the stage. The top right of the first screen is empty white, so the ask reads as an afterthought (`d-hero.jpg`).
   - **Phone:** the h1 wraps to 4 lines, not the brief's 3. The ask is above the fold.
2. **One in, one out, or a document?** One in and one out, technically: the pinned chapters swap one panel at a time. But it is eight of them in a row, about 8 screens of the same composition: a small title and paragraph left, an outlined white box right, a row of ticks. By chapter 5 it reads as a document. The statement section ("Open one stream…") also leaves a very tall empty band at 1470 before the code card appears.
3. **A real visual in every section?** Yes:
   - the three clients
   - the subscribe code
   - the stream map, which changes per chapter
   - six drawn vignettes on the rail
   - the wire
   - the tenant map
   - the GitHub card art
   - the close Sigil

   There is no Hanzo media for Realtime, so there is no 4-image block, which is fair.
4. **One ask, nothing floating? Scale rhythm?** One solid ask; the docs link and the strip links are text. Nothing floats over content apart from the shared cookie card.
   - **Desktop header:** "Try Hanzo" while the hero ask says "Start Building". It swaps after the hero.
   - **Phone header:** keeps a black "Try Hanzo" pill all the way down while the bottom bar says "Start Building". That is two asks in different words, the same complaint the PubSub review made.
   - **Scale:** rhythm is good, as above.
5. **Every hover and press answers, no jumps?** Mostly.
   - "View Documentation" shows no computed change on hover (same colour, no transform).
   - Rail: after a drag throw the track sits at −903px, past the arrow clamp of −822px. Pressing **Next** then moves the rail *backwards* 81px.
   - The phone tablet card's switch label wraps to "reads / b" on two lines.
6. **Overlap, font swap, layout shift?** No overlap, and the h1 box doesn't move.
   - **Phone CLS is 0.051 in 40 s idle**, with single shifts of 0.0248, 0.0138 and 0.0035. Every create/delete cycle changes the hero stage's height on phone, and that pushes the `rt-say` section below it down. Over the 0.02 lab target.
   - **Desktop CLS is 0.0023**, but the card heights still pump: Client 1 shrinks when b leaves and Client 2's switch lands at a different y from Client 1's.
   - **Red "1 Issue" badge on desktop in the first walk.** It was a React hydration mismatch in the shared `FooterHTML`, not in this page's code. It did not recur in the second run. It is shared, but James would see it.
7. **Which reference, and is its motion there?**
   - **Apple:** pinned chapters where one panel changes, the product as the hero, a persistent ask. These are present.
   - **motion.dev patterns:** layout glides, the drag rail with inertia, the magnetic close. Present.
   - **osply/hamol:** the editorial asymmetry is missing. Every chapter is the same left/right split.
8. **Different from its neighbours?** The hero medium is its own (three devices receiving one record). The body is not: PinnedChapters with text left and an outlined box right is the same shape as `/datastore`, and close to `/pubsub`, which its critic already called out. Eight chapters makes it the longest run of that shared shape.
9. **18 parts covered?** The card has all 18 headings with `Done here:` lines. See the card check.
10. **Banned tells?**
    - None in the page: no hue, no gradient text, no pill above a headline, no Inter, no springs.
    - The "OPEN A STREAM" eyebrow sits above the GitHub card, which is a card title, not an h1 or h2. Acceptable.
    - The ✓ and × glyphs in the stream-map rows are status shapes, which is allowed.
11. **Copy untouched?** Yes. Parity is 0 missing, and the drawn demo words are flagged on the card as not yet in `ui-strings.json`.

## Card check
`docs/coverage/realtime.md` exists, with 18 headings, every `Done here:` filled, and copy questions, requests and deleted forks listed. Mostly truthful. Corrections:
- **Parts 11 and 13** imply the page is shift-free. Measured phone CLS is 0.051, from the hero stage changing height. The card should not claim "pass" until that is fixed.
- **Parts 17 and 9** say 0 console errors. True of page code, but one walk raised a hydration error badge from the shared footer. Note it as a shared issue.
- **Part 18** cites a self-score of `V2: 8/10`. This review is 7.
- **Part 4** says the header label is a shared request. Fair, but the phone header never swaps to "Start Building", so in practice a phone shows two different asks.

## To reach 8
- **Break the eight-chapter monotony.** This is the biggest issue. Either:
  - group the eight into 3–4 pinned beats, keeping every word (for example, chapters 1–2 as one stream panel, 3–4 as one isolation panel, 5–6 as one rule panel, 7–8 as one grant-and-limits panel), or
  - change the composition partway, so the stage flips sides or goes full-width with the words underneath, for 2–3 of the chapters.

  Either way the page should stop reading as the same left/right box as Datastore and PubSub.
- **Fix the desktop hero composition.** Put "Live record updates" and "Start Building" up beside or directly under the h1, top-aligned on the 8/5 split. Don't leave them bottom-aligned at y 528–660 with empty white above. Read order should be h1 → ask → stage.
- **Lock the hero stage height on phone and desktop.** Give the client cards a fixed min-height, or let rows enter and leave inside a fixed box. Then no create or delete can move `rt-say` (phone CLS 0.051 → under 0.02), and the switches sit on one baseline.
- **Fix the phone switch label.** Make it fit on one line in the tablet card ("reads b" wraps).
- **Fix the phone h1 wrap.** Get the h1 to 3 lines at 375 if the brief's 40px can hold it. Otherwise note it on the card.
- **Fix the rail.** Clamp the drag to the same minimum the arrows use, so Next never moves backwards.
- **Give "View Documentation" a hover state.** The underline should part or thicken, or the ink should shift. Right now nothing happens.
- **Chase the shared header ask** (`docs/requests/realtime.md`). On phone the black "Try Hanzo" pill and the "Start Building" bar are two asks in different words.
- **Tighten the empty band in the desktop statement section**, so the code card arrives with the paragraph instead of a screen later.
