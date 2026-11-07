# /history — James-eye review

Verdict: 7/10
First complaint: "I scroll through the years at a normal speed and the screen goes blank. The year slides out and nothing comes in. And why does every year show the same number twice, once in a grey box?"

Walked 7 Nov at `9afbb4b` (`components/pages/History.jsx`, `History.css`, `historyData.js`, `story.css`, `StoryPause.jsx`, `StoryClose.jsx`). Working files are in the `critic2/` scratch folder.
- **Desktop film:** 1470×801, 103 s (`vid-history/history.webm`, sheets `sheets/history-01…13.jpg`).
  - Pressed the pause beside the hero year, then resumed.
  - Hovered the hero asks.
  - Dragged the press-clipping rail left, to its end, and back.
  - Scrolled the pinned scene slowly in 80px notches, 160 ms apart, with a 1 s dwell on each new year (13 stills, `history-d-year-00…12.png`). Then flicked back up and clicked "2019" on the year rail.
  - Used Your year: + twice, then typed 2024, 1999, 2031 and 2017.
  - Hovered the principles, the Band ask and "Return to About Hanzo".
- **Phone:** 375×812 (isMobile, hasTouch), 15 screens (`sheets/history-phone-01…03.png`).
- **Also checked:** reduced motion, JS off, console, and the card-to-page Morph into /about.

## What works
- **The signature exists and pins.** The scene holds for 7,257px, and the 13 years change every about 500px of scroll: 2014 at 2028, 2015 at 2815, … 2026 at 8287.
  - The progress hairline and the 13-year rail track where you are.
  - "2019" on the rail jumps there with Lenis. Apple's pinned stage is really here.
- **The drag rail is real** (grubogrubo or osply).
  - On arrival it leans −90px and back, once.
  - A throw carries on with inertia: −871px at release, −1,112px settled.
  - It stops with the last clipping on the gutter (right edge 1311 of 1470), and a hovered clipping straightens and lifts 6px.
- **The first screen is alive.**
  - The h1 is cut in by line.
  - The giant year runs 2014 → 2026 in 15 s while each era's bar fills.
  - The 44px pause holds the year (probe: `aria-pressed=true`, 2016 still 2016 after 2.5 s). It is also a keyboard path, and it is hidden under reduced motion.
- **Your year answers every input.**
  - 2024 shows that year.
  - 1999 says "Building business software since 2014."
  - 2031 says "Not written yet."
  - ± step one year at a time and press to .94.
- **Clean numbers.**
  - 0 hues.
  - Parity 214/214 text and 42/42 links.
  - CLS 0.0002 (header).
  - Reduced motion: 17 of 17 screens still, with the hero resting on 2026.
  - JS off stacks all 13 years legibly.
  - No sideways scroll at 375, and 0 phone targets under 44px.
  - "Return to About Hanzo" opens /about.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the year starts running at once.
   - But the first screen is wordy. A 5-line lede plus four eras, each with a title, a span and a 2-line description, is about 18 lines of text beside the headline.
2. **One in, one out, or a document?** Inside the scene, yes, but only when you scroll slowly.
   - **At normal speed the stage goes blank.**
     - Frames 64.5, 66.0, 68.5–70.5 s are empty: no year, just the era caption, with a half-cut year sliding under it (`fr/history-68.5.png`).
     - Cause: every change waits 0.28 s out, then 0.3 s delay plus 0.7 s in (`.xhi-cut > span`, History.css:50–52), and the text has the same lag (:79–83). A year that changes faster than about 0.6 s never arrives.
   - Outside the scene it is a document: the clippings, the intro and the principles.
3. **A real visual object in every section?** Weak in the scene.
   - When there is no photo or logo, the plate prints the year's metric ("$8.4M in 30 days · Nasdaq") in a grey box. The same words sit 110px to its right as the highlight (`history-d-year-05.png`).
   - That is by design for 2021, 2022, 2023 and 2025 even online, and for 12 of 13 years here.
   - Only 2026 shows real Hanzo media (the Zen art).
4. **One ask in the sticky header, nothing floating; scale rhythm?**
   - **Two different solids.** The hero's solid is an in-page jump ("Explore Our History" → #timeline), while the page's real action is "Talk to Hanzo FDE" (the Band and the bar).
   - **Scale.** The hero year is 153px and the scene year 141px: both above the 112px top step, and both permanently big rather than growing for a moment.
   - **Numeral runs.** The principles (six 64px numerals) and the FDE steps (four 64px numerals) are back to back, so there are 10 Air numerals in two screens.
5. **Every hover and press answers, no jumps?** Yes.
   - Clippings straighten and lift.
   - Principle numerals turn ink and rise 4px.
   - The rail years underline.
   - The back-link arrow moves 8px.
   - ± press to .94.
6. **Overlaps, font swap, layout shift?** No font swap or shift. No page overlap at either size.
   - On the phone the scene becomes a sideways rail of 13 cards, each 972px tall and 295px wide (scroll width 4,011px). It has no year index (`.xhi-rail2` is `display: none`), so 12 years hide behind sideways swipes with no sense of where you are.
   - MASTER part 11 says pinned scenes stack under 900px, and the page's own comment says "On a phone the years simply stack".
7. **Which reference, is its motion there?**
   - Apple's pinned, scrubbed scene: there, but it blanks under a normal flick.
   - The drag rail with inertia: there.
   - grubogrubo or hamol tilt-cards: there.
8. **Different from its neighbours?**
   - The hero medium (a running year) is its own.
   - But the page uses the same object three times: hero (153px), scene (141px) and Your year (64px), all the same `YearCut`.
   - It closes on the same StoryClose band as /about and /blog.
9. **The 18 parts?** See below.
10. **Banned tells?**
    - None of the page's own. The year badge pill and the era caption sit under their headings.
    - Borderline: the "01 / 06" counter above each clipping figure.
    - The rail opts into the shared "Drag" cursor label.
11. **Copy untouched?** Yes: parity is clean.
    - Copy question: "1,600+ repositories" (lede, era 4) against "1700+ repos" (clipping 6) on the same page.

## Missing from the 18 parts
- **1 Strategy:** the hero's solid is an anchor, not the page's action. There are two solid labels.
- **3 First impression:**
  - No 56px peek at 1470×801.
  - About 18 lines of text in the first screen.
  - The scene blanks under a fast scroll.
- **7 Visual:**
  - The clippings are both outlined (`0 0 0 1px`) and raised (a 36px drop shadow), with literal rgba in page CSS.
  - The years are 153 and 141px, off the scale and never settling.
- **9 Motion:** time-delayed transitions on a scroll-driven scene. The same YearCut is used three times.
- **10 Media:** the image fallback repeats the metric beside it instead of a Sigil.
- **11 Mobile:** the pinned scene is a 4,011px sideways rail with no index, not a stack.
- **17 States:** "Not written yet." and "Type a year." sit alone at the top of a 360px empty grey box.
- **18 Coverage card:**
  - "One idea per 100svh" fails under a normal scroll.
  - The page comment's "on a phone the years simply stack" is false.

## Fixes (in order)
1. **Never blank the scene.**
   - Drive the cut from scroll, not timers. For each year, derive its own progress (`useTransform(p, [i/N, (i+1)/N], …)`) and map y and opacity of the year, text and plate to that progress, so any scroll position shows exactly one year.
   - Or, if you keep CSS transitions: when the index changes less than 400 ms after the last change, set a `.fast` class that removes the 0.3 s and 0.26 s delays and crossfades in 150 ms.
   - Test with 400px wheel flicks every 100 ms: no frame without a year.
2. **A real plate for every year.**
   - When there is no photo or logo, or on image error, draw `<Sigil seed={y.year}>` (ink on #f5f5f5) in the plate and drop `.xhi-plate-f`, so the metric is never printed twice.
   - Keep the 2026 Zen art.
3. **Thin each stage.**
   - Show the title, the badge, the first line and the post links.
   - Put the 2nd and 3rd lines and the highlight block (metric, htitle, desc, tag) in an inline disclosure that is in the HTML (`hidden="until-found"`) and opens on click. Detail lives in things you open.
4. **Scale back to the deck.**
   - Hero year at most 112px; the scene year rests at 84px and grows to 112px only while that year is current.
   - Give Your year its own object (for example a 64px figure without the cut, or the year's Sigil), so the cut is not used three times.
5. **Phone: stack, or give the rail an index.** Either stack the 13 years vertically (the comment's own plan), or show the 13-year rail as a sticky, scrollable strip above the swipe rail with `aria-current`, so a reader knows where they are.
6. **Outline or raise, not both.** Drop the `0 0 0 1px` ring from `.xhi-clip` and keep one token shadow (or make the clippings flat #f5f5f5 tiles). Move "01 / 06" under the figure.
7. **One solid.** Make "Explore Our History" a text link (`v2s-tlink`). It is a jump, and the page's action is "Talk to Hanzo FDE".
8. **Your year empty states.** Set the message where the year title would sit, at the same size, and drop the box's 360px min-height when there is no year.
9. **Correct `docs/coverage/history.md`** and the page comment.

**Shared chrome (not scored):**
- The desktop ask bar ("History · Talk to Hanzo FDE") floats over content. At the scene's entry it covers the "SKULLY Case Study" link (`history-d-year-00.png`), and a floating pill bar on desktop is banned.
- "Drag" cursor label on the rail.
- One of three pause clicks did not take on a cold dev load during the film; two direct probes paused cleanly.
