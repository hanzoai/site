# /contact-sales — James-eye review

Ready: 2026-11-07 fixes verified on the live page: inclusions rest at 64px numerals with a 26–36px heading and fit one desktop screen (a plain grow-from-point list per MOTION-MAP rule 3, no pinned scene), hero card sized to its question with the contour visible round it, rail is a type rail (no /logos 404s) whose speed answers the scroll, phone demo layout shift 0 (was 0.0136), coverage card's ask/shift lines updated; full form walked with the POST intercepted (1 call, sent state), Band film line settles solid; reduced motion 0 running animations. taste OK, parity 30/30 + 17/17, unique OK, check.mjs 0 errors / 0 overlaps / no h-scroll at both sizes.

Verdict: 7/10
First complaint: "The top's nice, the form plays itself, but scroll down and it's a document again: a long list of giant grey numbers, then a screen of logo names floating in white. Nothing comes in as something goes out. It's not premium yet."

Walked on build `221cf9bb` at 1470×801 (mouse wheel in 200px steps with dwells, a real Playwright mouse for every hover and press; `(hover: hover)` measured true) and at 375×812 (isMobile, hasTouch, tap and touch-scroll). I filmed both with recordVideo, sampled the first 3.5s with no input, pulled frames with ffmpeg and looked at them. I filled every step, pressed an empty Next, and opened the inclusion picks and the rows. I pressed the Band's "Talk to sales" and submitted with every POST aborted: 2 calls to the leads API (the retry), then the failed state, and nothing was sent. I also checked reduced motion, JS off, 375×667, 320 width, CLS (PerformanceObserver), console, hue, tap targets, fixed and sticky layers and labels above headings. Stills: `docs/review/contact-sales/desktop-walk.jpg`, `docs/review/contact-sales/phone-walk.jpg`.

Measured:
- **Parity:** 30/30 text, 17/17 links.
- **taste.py:** OK.
- **Hue in `main`:** 0.
- **Width:** no sideways scroll at 320 or 375.
- **Page targets under 44px:** none (the small ones are shared header, footer and cookie controls).
- **Labels above an h1 or h2:** none (the only "previous sibling" is a `<noscript>` style).
- **Desktop CLS:** 0.0003, all from the shared header.
- **Phone CLS:** 0.0136, all from this page. It is two shifts of 0.0068 on `.xcs-more` and `.xcs-btns`, while the idle demo lands and removes its chip.
- **Console:** 8 × 404 for local `/logos/customers/*.{png,svg}`. One hydration-mismatch warning appeared once under parallel load with video recording. Three clean reloads did not reproduce it, so it is not held against the page; the "1 Issue" badge seen in the films is that.

## What works
- **The signature is real and authored.** About 1s after load, "Full name" types itself into the card at 80ms a letter, lifts away, "Work email" rises with the progress line, a "Full name" chip lands, and at about 4s the empty live form returns. I saw it in the idle frames at both sizes. Under reduced motion there is no demo (12 samples, no ghost text), the rail is a still wrapped wall, and 0 animations run after 3s.
- **One question at a time.** Set at 32px with a ringed field and Enter to move on, the card is calm and clear. Size pills move on with a tap. The picks 01–05 read their sentence out on hover ("Dedicated compute, and your own models trained and hosted") and ink when chosen.
- **Every control I touched answered with more than opacity:**
  - The route rows slide their text 6px and ink it, and their arrow slides −6px.
  - Next goes #262626 on hover and presses to 0.98.
  - The size pills ink on hover.
  - The inclusion rows light their numeral (#d4d4d4 to #737373) on hover, press to 0.98 and ink to #0a0a0a on a click or tap.
  - The rail pauses on hover, and a logo name lifts 4px and inks.
  - The AI link's underline opens from 3px to 6px.
- **The Band's "Talk to sales" glides back to the card** without a navigation. I measured the card top at y=191 on desktop and 203 on phone, with focus on the current question (`xcs-need`).
- **The failed state is right.** It keeps the answers and shows Hanzo's "Prefer email? enterprise@hanzo.ai" with no false success.
- **JS off** stacks all five questions legibly at opacity 1.
- **Clean system:** no hue, no tells, nothing above a headline, no font swap seen. The h1 cut-in is by line mask.

## The 11 answers
1. **Sells in 5s, moves within 1s?** Yes. "Talk to sales", the lede and the first question are all above the fold, and the demo starts at about 1s. At rest, though, the desktop card is half empty: a 486px white card with one label and one field, then about 230px of nothing above the arrow. The contour field meant to make the stage alive is barely visible (a few faint arcs at the bottom), so the hero reads as a white box inside a grey box.
2. **One in, one out, or a document?** After the hero it is a document:
   - "What Enterprise includes" is 1,250px of five list rows with a sticky heading; the rows just scroll past.
   - The rail screen is about 340px of mostly white with a small heading and logo names in grey.
   - Then a black Band.

   Scroll motion is one heading cut-in. Nothing enters as something leaves.
3. **A real object in every section?**
   - Hero: yes, the card.
   - Inclusions: only giant numerals, which are typography rather than an object.
   - Rail: the logos 404 locally, so it shows type fallbacks. That is acceptable as a fallback, but the screen looks empty.
   - Band: words only, as the kit intends.
4. **One ask, nothing floating, scale rhythm?**
   - **Ask:** the page's ask is "Talk to sales" in the card and in the Band. The shared header swaps to "Talk to sales" once the hero leaves on desktop, and the shared phone ask bar reads "Talk to sales". That chrome is not held against the page. The phone cookie card covers the card's Next arrow on first load; it is shared chrome, but worth knowing.
   - **Scale:** h1 84px, section heading 64px and five 112px numerals (72px on phone). The inclusions screen is big at once: a 64px heading beside three 112px figures, with nothing medium or small except the row text. Resting sizes should sit nearer 52/26/64, with one numeral growing as it becomes the moment.
5. **Every hover and press answers, no jumps?** Hover and press: yes (see What works). Jumps: on phone the idle demo shifts the routes below the card twice (0.0068 each) when its chip row appears and goes.
6. **Overlaps, font swap, layout shift?** No overlap of page elements at either size, and no font swap seen. The only shift is the phone demo shift above. Desktop is clean.
7. **Which reference?** The hero has a little of chatgpt.com/business/enterprise's calm and a motion.dev-style step transition. No apple-style pinned scene where one panel changes, even though the inclusions list is the natural place for one.
8. **Different from its neighbours?** Yes. A self-playing one-question conversation card is its own hero medium, unlike /contact (the patch panel) and /support (the search pill).
9. **All 18 parts covered?** The card is in the 18 `## N.` + `Done here:` format, and most parts hold (see Card check). Gaps:
   - Part 3's "one idea per 100svh": the inclusions block is about 1.5 screens of a list.
   - Part 5's Privacy link by the submit is listed as a copy question.
   - Part 13: 8 console 404s.
10. **Banned tells?** None from the list.

    Two caveats sit close:
    - "Everything big at once" on the inclusions screen.
    - The box-in-box hero stage at rest.
11. **Copy untouched?** Yes: parity 30/30 and 17/17.

## Card check
Spot-checked against my measurements:
- **Demo timing** ("types from about 1.0s, lifts at about 2.1s, empty form at about 4.2s"): true. The idle frames show "Fu…", then "Work email" with a chip, then "Full name" again within about 4s.
- **Hovers re-measured by hand** (route text slides 6px and inks, arrow −6px, Next #262626, logo lifts 4px and inks): true, exactly.
- **Band glide** ("card measured in view at y=191–677"): true. I measured top 191 at 1470.
- **Rail** pauses on hover and is a still wrapped wall under reduced motion: true (`paused`; `animation: none`, `flex-wrap: wrap`).
- **Hung or failed POST** makes 2 calls, then the failed state: true (2 aborted POSTs, then "Prefer email?").
- **Stale, not inflating:**
  - Part 4 says the header "carries the site's solid 'Try Hanzo', which this page cannot relabel". On desktop the shared header now swaps to "Talk to sales" after the hero.
  - Part 4's probe ("only the header, the progress line, the cookie notice…") misses the shared phone ask bar.
  - Part 11 does not mention the phone demo layout shift (0.0136).

  These are out of date, not false in the page's favour, so no cap applies. Update them.

## Fixes (in order)
1. **Make "What Enterprise includes" a moment, not a list.**
   - Pin the heading and bring one inclusion in at a time while the last goes out (a pinned scene where one row changes), stacking under 900px.
   - Rest the numerals near 64px; let only the active one grow to 112px.
   - Bring the section heading toward the 26–44px rest.
   - Cut the block from 1,250px to about one screen per idea.
   - Keep the tap-to-add.
2. **Give the hero card no dead half.**
   - Size the resting card to the question (or let the stage hold the chips, progress and arrow closer to the field).
   - Make the contour field actually visible within the neutral ramp, so the stage reads as a live field around the card, not a grey frame around a white frame.
3. **Fix the rail screen.**
   - The 8 local `/logos/customers/*` files 404, which also breaks DONE's "no console errors". Mirror them, or render the names as a deliberate type rail without requesting the images.
   - Tighten the about 340px of white around it.
   - Let its speed answer the scroll (JAMES item 3).
4. **Stop the phone demo shifting the page.** Reserve the chip row's height so `.xcs-more` and `.xcs-btns` do not move when the demo chip lands and leaves (0.0068 × 2).
5. **Update the coverage card.** Part 4 needs the header swap and the shared phone bar; part 11 needs the phone demo shift.
