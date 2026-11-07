# /blog — James-eye review

Verdict: 6/10
First complaint: "I press pause on the cover and nothing happens; it just keeps turning. On my phone the picture runs off the edge of the screen. And below the cover it goes quiet: three grey squiggles and a list."

Walked 7 Nov at `9afbb4b` (`components/pages/BlogIndex.jsx`, `BlogIndex.css`, `story.css`, `StoryPause.jsx`, `StoryClose.jsx`). Working files are in the `critic2/` scratch folder.
- **Desktop film:** 1470×801, 88 s (`vid-blog/blog.webm`, sheets `sheets/blog-01…11.jpg`).
  - 15 s untouched on the cover.
  - Swept the pointer over the plate.
  - Hovered all six index headlines and let the pointer leave.
  - Pressed the cover's pause and waited 8 s.
  - Hovered the masthead ask and the cover headline, then the three on-site cards.
  - Hovered all nine month bars, clicked February, then July, then "All 24".
  - Walked the full contents, hovering rows, then hovered the Band ask.
- **Phone:** 375×812 (isMobile, hasTouch), 11 screens (`sheets/blog-phone-01…02.png`, `blog-p-first.png`, `blog-p-strip.png`).
- **Also checked:** reduced motion, JS off, console, the heading outline, and an on-site card's Morph into /blog/synthesis.

## What works
- **The first screen is a real front page and it turns by itself.**
  - The masthead h1 (52px) is cut in.
  - The cover holds 6.5 s, then the headline wipes and a brushed-silver curtain crosses the plate (frames 7.0–7.5 s), 0 → 1 → 2 untouched.
  - The index's hairline times the current story.
  - Kai posts show Hanzo's own Kai art, and the other posts draw a contour field from their title.
  - Feels like a hamol or osply magazine front. One idea, well staged.
- **A hand answers at once.** Hovering an index headline cuts straight to its story with no curtain, holds while the pointer is in, and resumes when it leaves.
- **The publishing strip works as the Beyond.**
  - The bars rise once on arrival.
  - February closes the contents to "February 2026: 9", and July to 4.
  - "All 24" restores eight months and shows its pressed (ink) state.
  - A month click scrolls the list into view. Rows slide 8px on hover.
- **Clean numbers.**
  - 0 hues.
  - Parity 95/95 text and 29/29 links.
  - CLS 0.0002 (header).
  - Reduced motion: 7 of 7 screens still, the curtain off, the timer frozen.
  - JS off shows the masthead and first story.
  - No sideways document scroll at 375.
  - The on-site card's title lands at x=159 on /blog/synthesis (Morph runs).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the curtain and h1 move by 0.5 s.
   - The phone first screen holds the h1, lede, ask and the plate, but the plate is broken (answer 6).
2. **One in, one out, or a document?** The cover is one-in-one-out. Below it the page goes still:
   - three static contour cards;
   - a heading with a bar strip;
   - a contents list that, after "All 24", is about 4 screens of rows with 2–3 line summaries, where nothing moves without a hover.
3. **A real visual object in every section?** The cover plate, yes. The others are thin:
   - The on-site trio is three faint grey contour fields, 72% opacity on #f5f5f5 (`blog-d-here.png`), with no heading. "Kai 1: Decisions, Not Completions" gets a Sigil there, though the cover shows the Kai art for that same post.
   - The strip is the Contents object.
4. **One ask in the sticky header, nothing floating; scale rhythm?**
   - **Asks.** Two different solids: "Read the latest" in the masthead and "Every post" in the Band.
   - **Scale is flat.** The biggest type is the 52px h1 and the 32px cover headline. Nothing grows or settles: no figure, no moment.
5. **Every hover and press answers?** Mostly. The index cuts, rows slide, cards brighten and scale 1.03, bars darken, and buttons press.
   - **But the cover's pause does nothing with a mouse.**
     - `.xbl-index` (`grid-column: 1 / -1`, later in the DOM) lies over the 44px pause. `elementFromPoint` at the button's centre returns `OL.xbl-index`.
     - A click left `aria-pressed="false"`, and the cover turned 0 → 1 during the 8 s "pause".
     - Enter on the focused button does pause (true, held 8 s).
6. **Overlaps, font swap, layout shift?** No font swap or shift. Desktop is clean. The phone fails twice:
   - **The cover plate is 455px wide in a 343px column** (16 → 471). It is clipped at the screen edge with no right corners (`blog-p-first.png`).
     - Cause: the desktop `height: clamp(260px, 42vh, 360px)` plus the phone `aspect-ratio: 4/3` sets the width from the height.
   - **The sticky "All 24" pill (286–359px) sits on the July and August bars (256–348px)** and hides "Aug" (`blog-p-strip.png`).
7. **Which reference, is its motion there?**
   - hamol or osply editorial: the cover with its timer and curtain is there.
   - synchronized.studio card-open: the on-site cards Morph, but on a cold load there was about 2 s of white before the title flew (dev compile; re-check on a warm build).
8. **Different from its neighbours?**
   - The cover is its own.
   - But the masthead is /about's layout: h1 on the left 8 columns, lede and ask bottom-aligned on the right.
   - The close is the same StoryClose band as /about and /history.
9. **The 18 parts?** See below.
10. **Banned tells?**
    - Borderline: the 12px mono "BLOG" run-in sits at the top right, 90px above the h1's line, so it reads first, like a kicker.
    - Otherwise none.
11. **Copy untouched?** Yes: parity is clean.
    - The cover shows the date twice, in the meta row ("OCTOBER 26, 2026") and as the first words of the summary ("October 26, 2026. Buyers…"). The meta date is the page's addition.

## Missing from the 18 parts
- **1 Strategy:** two solid labels.
- **3 First impression:**
  - No 56px peek.
  - Nothing below the fold moves untouched except the bars rising once.
  - No scale moment.
- **6 Content:**
  - The "Contents" h2 is pushed to column 3 (`.xbl-c-head > .xbl-c-h { grid-column: 3 / 8 }`) while its caption "EVERY POST" stays at column 1, so the head and caption do not align (`blog-d-contents.png`).
  - The meta date repeats the summary's date.
- **8 Components:** the pause control is unclickable with a mouse.
- **10 Media:** the Kai post on the on-site trio does not use its Kai art.
- **11 Mobile:**
  - The plate overflows by 112px.
  - The strip pill covers the bars.
  - The cover headline links are 343×32 targets.
- **12 Accessibility:**
  - The heading outline is H1 → H3 ×6 (the cover headlines) → H2, so a level is skipped.
  - The on-site trio has no heading.
  - `.xbl-h1 { white-space: nowrap }` at desktop (part 12 bans nowrap on the h1).
  - Under reduced motion the index keeps a 61px empty indent for the hidden pause.
- **18 Coverage card:** it claims "no overlap at 375" and a working pause.

## Fixes (in order)
1. **Make the pause clickable.**
   - Either `.xbl-cover > .xst-pause { position: relative; z-index: 1; }`, or start the index at column 2 (`.xbl-index { grid-column: 2 / -1; padding-left: 0; }`) with the pause in its own 44px column.
   - Check that `elementFromPoint` returns the button, a click sets `aria-pressed="true"`, and the cover holds 8 s.
   - Under reduced motion drop the 61px indent.
2. **Fit the phone plate.** Inside `@media (max-width: 900px)` set `.xbl-plate { height: auto; width: 100%; aspect-ratio: 4 / 3; }`. Check that the plate is 343px wide with all four corners at 375 and 320.
3. **Free the phone strip.**
   - Remove `position: sticky` from `.xbl-allbtn` at 900px and below.
   - Set the pill on its own row under the bars (or give the scroller `padding-right: 96px`), so no bar or label is covered.
4. **Give the page a second moment.** Use only facts already on the page:
   - When a month is pressed, that month's count grows from the bar to a 64px Air figure beside the strip, then settles.
   - The on-site Kai card uses `/models/kai.webp` (the cover's own ART map) instead of a Sigil.
   - The trio gets a hover tilt to 2.5° (fine pointers only) so the second screen answers the hand.
5. **Align the Contents head and close the gap.**
   - Drop the `grid-column: 3 / 8` override so "Contents" sits above "EVERY POST".
   - Bring `.xbl-toc` margin-top from 128px to 44–72px.
6. **Fix the outline.**
   - Render the cover headlines as h2 (`motion.h2`, or the `as` prop) and give the on-site trio a visually hidden h2 from the register.
   - Remove `white-space: nowrap` from `.xbl-h1`.
   - Give the cover headline links `min-height: 44px` on the phone.
7. **One date, one solid.**
   - Drop the `<time>` from the cover's meta row (keep the tag), since the summary already opens with the date.
   - Consider making "Read the latest" quiet (outline) so the Band's "Every post" is the one solid ask on a Story page.
8. **Correct `docs/coverage/blog.md`** (pause, 375 overlap, heading levels).

**Shared chrome (not scored):**
- On the phone the bottom ask bar ("Read the latest") rises over the on-site cards.
- The bar never showed on desktop here.
- A cold dev load logged "[Turbopack HMR] Expected module to match pattern: lib/search.json" (shared search module).
