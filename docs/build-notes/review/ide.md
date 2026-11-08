# /ide — James-eye review
Ready: 2026-11-08 chapter memories sit in their own code line (chips can never cover code, measured at 1470 and 375), no arrival pop or wipe, uncut stage shadow, Teach as one hairline sheet, start script wraps, hero words gone before the editor rises over them, short idle loops in the chapter pictures and Rust plane (0 still screens).
Verdict: 7/10
First complaint: "Those little memory tags are still sitting on top of the code. On my phone 'episodic' hides half the git clone line, and on the laptop it eats the last letter of ide.git. Then when the page opens the editor pops a bit bigger and wipes itself clean."
(Walked 7 Nov 17:00–17:23 UTC at HEAD `252e313a` (the page's last change is round 7, `6b0d251b`). Sizes: 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×700, 375×667, reduced motion and JS off. Requests to api.hanzo.ai were blocked and no form was sent. The frames are in the critic's scratch folder; nothing was added to the repo.)

## What works
- **Round 7 fixed most of the last review (measured):**
  - **Phone chapters fit.** At 375, every `.a2-ch-item`, `.a2-ch-pv` and `.ide-pic` ends at x 359, with scrollWidth equal to clientWidth (343/343).
  - **The h1 cuts in from first paint.** At 150 ms, before hydration, the line transform is already `translateY(7.7px)`. It reaches 0 by 800 ms. The lede and the ask are visible from the first frame at both sizes.
  - **The editor no longer drops.** `.ide-obj` top is 490 at 150 ms and still 490 at 2.5 s (desktop), and 588 throughout on phone.
  - **Reduced motion is clean.** 0 console errors on 4 of 4 loads across both sizes, and 0 running animations after 3.5 s. `elementFromPoint` hits the h1, the lede and `[data-cta="ide.hero"]` themselves.
  - **Recall answers hover.** It fills #f5f5f5 and the border goes from black 10% to black 30%.
- **The hero is the product, and it is alive.**
  - A real editor runs Hanzo's own start script. The cursor walks, the memories land in the gutter and the agent panel runs its session.
  - Desktop idle frames 1 s apart differ 3 of 3 times.
- **Scroll story.** The page goes in sequence: stage settle, paste strip, exploded planes, three pinned chapters (01/02/03 with the picture changing), Teach, the dark room with orbiting tiers and an accordion, the start script typing itself, related rows, and the Band.
  - The header ask turns solid "Open the IDE" once the hero ask leaves. Nothing of the page floats over content.
- **Hover and press answer, with 0px size change on every control tested:**
  - The primary goes #0a0a0a → #2c2c2e and presses to 0.98.
  - "View on GitHub" underlines and its arrow moves 4px.
  - The chapter tabs go #737373 → #0a0a0a.
  - The memory kinds fill #f5f5f5.
  - The accordion rows go #a3a3a3 → #fafafa, and the plus moves 4px.
  - The related rows fill #f5f5f5, and the arrow moves 4px.
  - Copy, the Pause controls and "Deploy to Cloud" all answer.
  - Only the currently selected tab and radio stay static, which is right.
- **Measured basics:**
  - 0 console errors on 6 of 6 clean loads (networkidle, both sizes).
  - CLS is 0.00036 on desktop, all from the shared header tools, and 0 on phone.
  - scrollWidth at 320 is 320.
  - Phone `main` has 0 targets under 44px.
  - With JS off, 0 text blocks are hidden at either size and the ask sits at 410–458 (desktop) and 492–540 (phone).
  - Fonts are Zen and Zen Mono only.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes.
   - The h1, lede and "Open the IDE" read at once, and the h1 cut-in runs from 150 ms.
   - Two arrival blemishes:
     - **The editor grows at hydration.** It goes from 1200 to 1248px wide (left edge 135 → 111) at about 400–500 ms. This is `ss.set(Math.min(1.04, …))` in Stage's mount effect.
     - **The editor wipes its first frame.** The server HTML paints the finished picture: three memories plus the full agent session. About 0.5 s later the loop restarts at t=0, so the memories and the session vanish (d-arr-150 vs d-arr-1000).
2. **One in, one out?** Yes, it is a sequence, not a document.
   - Section heights: 1842 stage, 227 paste, 548 engine, 2403 pinned chapters, 723 teach, 887 dark, 718 start, 419 end, 701 Band.
   - The gaps match the deck's section padding (about 160px at 1470).
3. **A real object in every section?** Yes:
   - the editor
   - the prompt strip
   - the two planes
   - the code, graph and sandbox pictures
   - the Teach tiles
   - the tier orbit
   - the typing script
   - the related rows
4. **One ask, sticky; scale rhythm?**
   - Desktop: the header's "Open the IDE" turns solid after the hero.
   - Phone: the header keeps a solid "Try Hanzo", as the card says.
   - Sizes: h1 52, sections 26, Engine 32 growing by A2Grow, H3 17, body 14–16, mono 12–13, and one 88px Band statement. The rhythm holds.
5. **Every hover and press answers?** Yes on page-owned controls (see What works). The kit Band button now hovers #f5f5f7 → #fff and presses to 0.98.
6. **Overlaps, font swap or layout shift?** There is no font swap and CLS is about 0. Two real problems:
   - **The memory chips cover code at both sizes (measured):**
     - At 1470, chapter 01 line 5 text ends at x 1078 and the episodic chip starts at 1072, so the "t" of "ide.git" is under it.
     - At 375, the line 5 text box runs to 281 and the chip starts at 255. "git clone https://git" is cut under "episodic" (chip-375.png).
   - **The editor's shadow is cut straight.** At 1470, after a 1443px scroll, the editor's large shadow stops in a straight horizontal line about 120px under the captions (d-s-03). `.ide-stick { overflow: hidden }` clips it.
   - The arrival scale pop is covered in 1.
   - A test note: a "1 Issue" badge appeared only in runs where Playwright screenshotted before hydration. Its caret-hiding style lands on the Teach input, so that is my artefact, not the page's.
7. **Which reference, is its motion there?**
   - Apple product page: a stage that settles, pinned chapters with one panel changing, and a closing statement. Present.
   - synchronized.studio: the related rows Morph. Present.
8. **Different from neighbours?** Yes. The hero is a self-running editor with a memory gutter, and the dark room is a memory-tier orbit. It is distinct from the /cli terminal and the /desktop window.
9. **18 parts?** The card is complete in form, but part 11 and the round-7 note under part 18 make false claims (see the card check).
10. **Banned tells?**
    - Page-owned: none. The kickers are 1×1 and sr-only, there is no hue, Zen only, and no gradient text.
    - The Teach tiles are three filled grey boxes in a row at 1470. They are unequal (460/368/276), so they are not banned, but they read close to "three boxes".
    - **The kit Band is still kit-owned and still off-deck.** Its words reveal through `blur()` (1.8px on the frames I caught, still easing in). Its text is #f5f5f7 and #a1a1a6, and its button has no `data-cta`.
11. **Copy untouched?** Yes. No new words were seen. Parity was 75/75 last round, and the copy is unchanged since.

## Card check (docs/coverage/ide.md)
- **False, part 11:** "375×812 and 1470×801 pass with no overlap". The episodic chip covers line 5 by 6px at 1470 and by 26px at 375. A false claim caps the verdict at 7.
- **False, part 18 round-7 note:** "memory chips never cover code". Same measurement.
- **Partly false, part 18:** "the editor rests under the ask … no jump". The top holds at 490, but the editor scales from 1200 to 1248px wide at hydration.
- **Wrong number, part 11:** "ask bottom at 520px on 375x667". I measured 540. It is still above the fold, so the claim holds.
- **True:**
  - Phone chapter items end at x 359.
  - The h1 cuts in by CSS from first paint.
  - Reduced motion hydrates with 0 errors.
  - JS off is legible, with 0 hidden text.
  - 320 has no horizontal scroll.
  - 0 phone targets under 44px.
  - Recall has a hover.
  - `data-cta="ide.hero"` and `data-thumb` are on the primary.
  - One h1, and the editor is in the server HTML.
  - The related rows Morph.
  - The phone header ask is "Try Hanzo", as stated.
  - Something moves within 1 s.

## Fixes (in order)
1. **Chips never cover code.**
   - The `padding-right: 230px` (110px on phone) on `.ide-pic-src` does not hold the text back. The text runs to 1078 at 1470 and to 281 at 375.
   - Cap only the chip-bearing lines: `.ide-pic-code li:is(:nth-child(5),:nth-child(6),:nth-child(8)) > .ide-pic-src { flex: 0 1 auto; max-width: calc(100% - 270px); padding-right: 0; overflow: hidden; text-overflow: ellipsis; }`.
   - Under 899px, use `max-width: calc(100% - 128px)`.
   - Verify that each chip-bearing line's text right edge is less than or equal to the chip's `getBoundingClientRect().left` minus 8, at 1470 and at 375.
2. **No pop and no wipe on arrival.**
   - In Stage, start `ss` at its final value on the server too, or drop the 1.04 start entirely: `useMotionValue(1)` and leave `ss` alone in the mount effect. Verify that the `.ide-obj` width is identical at 150 ms and at 1000 ms.
   - In Editor, do not hard-reset from the finished picture.
     - Option A: hold `t=99` for 1.5 s after `seen`, then fade the memories out in order (MOVE, 60 ms stagger) before `tick(0)`.
     - Option B: render `t=0` on the server and show the finished picture only under `html:not(.js)` and reduced motion through CSS.
   - Either way, the first painted frame equals the first animated frame.
3. **Uncut shadow under the stage.** Keep `.ide-stick` clipping horizontally but let the shadow breathe: `.ide-stick { overflow: clip; overflow-clip-margin: 64px; }`. Or move the shadow to a `::after` inside `.ide-win` with a smaller spread (`0 24px 60px -16px rgba(0,0,0,.18)`, the deck's floating shadow). Verify that no hard horizontal edge shows in a frame at a 1443px scroll.
4. **Teach tiles quieter.** Drop the fills on `.ide-teach-c` (`background: none`) and divide the three columns with 1px black 10% hairlines, so they read as one sheet, not three boxes.
5. **Kit Band (request, do not edit).** Re-file in `docs/requests/ide.md`:
   - a word reveal by line mask with no blur (4px or less);
   - #fafafa and #a3a3a3 for the text, in place of #f5f5f7 and #a1a1a6;
   - `data-cta="ide.close"` on its button.
6. **Card.**
   - Correct part 11 and the round-7 note until fix 1 is measured.
   - Note the hydration scale until fix 2 lands.
   - Change the 375×667 ask bottom from 520 to 540.
