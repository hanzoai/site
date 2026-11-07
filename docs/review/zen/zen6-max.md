# /zen/zen6-max — James-eye review

Verdict: 7/10
First complaint: "On the computer it's good now: the film slides off the name and settles, and the rack builds itself. But on my phone it turns back into a document. I get a drawing, then four blocks of text under it with nothing changing. Then the rack, then a whole screen of paragraphs with nothing to look at. One thing in, one thing out has to work on the phone too."

Walked with Playwright (Chromium), moving, on 7 Nov 2026 (second critic pass, after commit 7ca6de73):
- **Desktop, 1470x801.** Wheel-scrolled top to footer in 100px notches with about 120 ms dwell, recorded on video, a frame every 4 notches. I probed the film card against the h1, lede, asks and crumb on every notch through the hero. I also took exact scroll stops at 0, 40, 80, 120, 160, 200, 260, 330 and 420 to see the wipe.
- **Phone, 375x812** (isMobile, hasTouch, DPR 2). Same walk in 100px steps with video and frames. I tapped the rack's B200 chip and the "Redundant pools" chip.
- **Controls.** I hovered and pressed each one, reading computed style at rest, on hover and on press: hero ask, "Run it on your own GPUs", film pause (and clicked it twice), the four promise rows, B300/B200, the three planning chips, the sheet column headers, a source link, the "Around the servers" drawer (opened) and the close ask. I also moved the pointer across the close Sigil.
- **Checks.** Motion inside 1 s with no input. Reduced motion (running animations after 3 s, `--k`, video state). Horizontal overflow and touch-target sizes at 375. The console over 13 fresh loads at both sizes.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/zen6-max/

## What works
- **The first screen sells, and the start is fixed.**
  - The name, lede and "Talk to sales" sit over the full-bleed Zen film.
  - The h1 cuts in, and the film is playing by 1 s (frames at 150 ms and 1000 ms differ; `currentTime` 1.05).
  - As you scroll, the film's left edge wipes cleanly across the words. Difference blend splits each letter black and white exactly at the edge (wipe-80.png). By about 120px of scroll the edge has cleared the words, and the card settles top-right with the pause in its corner at every `--k`.
  - Last pass, the card collided with the words. Now the crossing reads as an authored moment.
- **Promises now have an object.**
  - The router drawing changes per row: the fan first, then a lit configuration, a context bar, then a terminal with a caret.
  - Hovering a row sets the drawing (`data-at` followed the pointer 0, 1, 2, 3). The hover tells you something.
- **The rack chapters are still the signature, and they are strong.**
  - A pinned dark panel with `01 / 04`. Servers slide in, the count runs to 9,216 GB, the GPUs tint into pools, and the twin rack lands across the dashed domain line.
  - The planning chips scroll to their step and advance the counter (02, 03, 04).
  - B200 swaps the rack and the total (5,760 GB).
  - This is the Apple pinned scene done right.
- **The sheet works as a Beyond.** Hovering a column tints its cells and grows its total from 0.5 to 0.75 scale as a preview. Picking it lands the figure at full size. The drawer's plus turns on hover and opens to a two-column list.
- **Hover and press answer.**
  - Hero ask inverts to ink and presses to 0.98.
  - Pause fills white 10% and grows to 1.1.
  - The chips fill white 8%.
  - The close Sigil bends to the pointer and drifts on its own.
- **It is clean.**
  - No horizontal overflow at 375 (scrollWidth 375). The phone chip row now wraps.
  - Reduced motion lands settled: `--k` 0, film paused on its poster, 0 running animations after 3 s.
  - Monochrome throughout, and nothing sits above the h1.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **Phone promises are a document.**
   - At 375 the router drawing sits once above the four rows, then scrolls away. "Right-sized per request", "Long context" and "Tools and code" read as about 1.3 screens of 26px headings and 17px sentences with nothing beside them (phone-s012.png).
   - The drawing does change state, but you can't see it while reading the rows.
   - **Fix in `ZenMax.css` `@media (max-width: 899px)`:** make `.zx-prom-art` `position: sticky; top: calc(header + 16px)` at about 34svh tall, with the rows scrolling under it. The existing IntersectionObserver in `Promises()` already sets `at`, so each row will change the drawing as it reaches mid-screen.
   - Alternative fix in `ZenMax.jsx`: render a 160px `<Router at={i} />` inside each `li` on phone, so each row carries its own state.
2. **Phone chapters are a document.**
   - The rack panel comes first. Then "What a rack for Zen 6 Max is made of", the recommendation paragraph, the four-servers line, and the three steps follow as more than a full screen of plain text with no object (phone-s024.png).
   - The chips at the bottom of the panel change a rack that has already scrolled under the header.
   - MASTER part 4.1 says a pinned scene "becomes 3 static panels" on phone.
   - **Fix in `ZenMax.jsx` `Chapters()`:** under 900px, render a compact rack (racks plus total only, no chip bar) under each step, set to that step's plan (Qualification shows plan 0, Isolated shows plan 1, Redundant shows plan 2). Keep the full panel with chips only once, above. Alternatively, drop the `if (!mq.matches) return` early exit and make `.zx-pin` sticky at about 40svh on phone so the steps drive it as on desktop.
3. **The settled hero leaves a dead white quarter on desktop.**
   - After the settle, the card rests from 14svh to 60svh top-right, with the words bottom-left. That leaves an empty block about 700x330px under the card, beside the asks (wipe-330.png, desk-s004.png).
   - **Fix in `ZenMax.css` `.zx-card` resting box:** anchor the card's bottom edge to the crumb baseline (`bottom: 9svh` with the same `--k` interpolation), and give it about 62svh of height. Card and words then share one baseline in an 8/5 split, with no void.
4. **The gap before the close is too big.**
   - Between the drawer's bottom rule and the close card there is about 320px of empty band: the end of the grey room, then white (desk-s064.png).
   - The close's Sigil is pale contour lines on `#f5f5f5`, so the last screen reads faint.
   - **Fix in `ZenMax.css`:**
     - cut `.zx-spec` bottom padding and `.zx-close` top padding to one section step (72px), so the close overlaps the sheet by about 40px;
     - raise the Sigil stroke for the close to black 30–55% (deck steps) so the object reads at a glance.
5. **Phone touch targets under 44px in the page's own markup.** "Run it on your own GPUs" is 21px tall and the crumb "Zen" is 24px tall.
   - **Fix in `ZenMax.css` phone block:** give `.zx-acts` link and `.zx-crumb a` `min-height: 44px; display: inline-flex; align-items: center`. Use padding, not a size change.
6. **The difference blend tints "Max" over the bright sphere.** At rest on load (t1000), the right half of the h1 sits over the lit sphere. The blend renders it as a white-to-grey shaded fill, which reads close to gradient text, one of the banned tells.
   - **Fix in `ZenMax.jsx` `Stage` and `ZenMax.css`:** replace `mix-blend-mode: difference` on `.zx-name` and `.zx-sub` with two stacked copies clipped by the same `--edge`: a white copy clipped to the film's area, and an ink copy clipped to the white. The split stays exact and every letter stays one flat colour. Or move the film's focal point so the sphere sits right of column 8 at `--k` 1.
7. **9,216 GB rests at 64px twice in a row:** first on the rack, then on the sheet. The second time it has no punch.
   - **Fix:** let the sheet's figures rest at their 0.5 scale until the sheet is 60% in view, then grow the picked one (`useInView` on `.zx-figs`, same 500 ms ease-emphasis). That makes the sheet's figure a moment that arrives, not a repeat.
8. **One console error on the first walk:** a React hydration attribute mismatch, with the red "1 Issue" badge at both sizes. It did not reproduce in 10 later fresh loads. Other loads showed only another page's compile error (`Skills.jsx`), which I ignored.
   - **Fix:** confirm that `Stage`'s `style={{'--k': ke}}` and `data-over` render the same value on the server and on the first client paint (seed `over` from `true` and `--k` from 1 in both). Then do a clean load with 0 errors.

**Noted, not counted (shared chrome or shared button):**
- **Phone header.** It shows "Try Hanzo" as a solid fill beside the hero's solid "Talk to sales", and it never switches to the page's ask on phone. Desktop switches correctly after the hero.
- **Header glass.** It smears grey when the black film or rack passes under it (desk-s004, desk-s052).
- **Cookie card.** It is about 400px tall at 375x812 (MASTER allows 220px).
- **Kit `Cta`, link kind.** "Run it on your own GPUs" has no hover change, only the 1px press.
- **Solid `Cta` hover.** It goes to `rgb(44,44,46)`, which is off the deck ramp.
