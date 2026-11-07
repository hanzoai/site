# /ide — James-eye review
Verdict: 6/10
First complaint: "On my phone the three chapters are cut off on the right. The code, the graph, the sandbox, and even the sentences under them run off the edge of the screen. And when the page opens, the headline isn't there. It's just the editor, and then it jumps down."
(Walked 7 Nov 16:51–17:20 UTC at HEAD `654afeb4`, the round-6 commit. Sizes: 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×700, 375×667, reduced motion and JS off. api.hanzo.ai was blocked and no form was sent. The frames are in the critic's scratch folder; nothing was added to the repo.)

## What works
- **Every round-6 desktop fix is real (measured):**
  - Chapter 01 now shows whole lines at 1470, up to "# First launch: pick a provider, paste a key, choose a model."
  - Under reduced motion at 1470×801, `elementFromPoint` on the h1, the lede and `[data-cta="ide.hero"]` returns the element itself. The editor rests at top 486, under the ask.
  - The chapter tabs now hover #737373 → #0a0a0a.
  - "Deploy to Cloud" now hovers to white 8% fill and a white 60% border.
  - The Teach field shows "One thing about your project" as its placeholder.
- **The hero is the product.**
  - The h1 is 52px on desktop and 40px on phone, cut in by line mask.
  - At 1470, frames 1 s apart still differ after 4 s idle: the cursor walks the lines, the gutter memories land and the agent panel runs its session.
- **Hover and press answer almost everywhere, with 0px box change on all 15 controls tested:**
  - The primary goes #0a0a0a → #2c2c2e and presses to 0.98.
  - The "View on GitHub" arrow moves 4px and its label underlines.
  - Pause fills white 8%.
  - The memory kinds fill #f5f5f5.
  - The accordion rows go #a3a3a3 → #fafafa.
  - Copy goes #171717 → #262626.
  - The related rows fill #f5f5f5.
  - The app links fill #f2f2f2.
- **Measured basics:**
  - 0 console errors on normal loads at both sizes.
  - CLS is 0.00036 on desktop (all from the shared header tools) and 0 on phone.
  - Max scrollWidth at 320 is 320.
  - The ask's bottom edge is at 520 on 375×667.
  - The phone `main` has 0 targets under 44px.
  - Under reduced motion, 0 animations are running after 3.5 s.
  - With JS off, 0 text blocks are hidden and the primary is hit-testable at both sizes.
  - `parity.py /ide` gives text 75/75 and links 10/10; `taste.py` is OK on both files.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** After hydration, yes. Before it, no.
   - The server HTML ships the h1 lines at `translateY(105%)`, so the first paint has no headline. On desktop the editor also paints at its settled top (206), over the lede and "Open the IDE".
   - At hydration the editor jumps to 470 (+264px, scale 1.08) and the h1 starts to cut in.
   - Frames at 250 ms and 1000 ms after load are identical: no h1, no lede, no ask (d-arr-250.png, d-arr-1000.png).
   - The first visual change came at 1.26–1.31 s on desktop and 1.22–2.31 s on phone.
   - The dev server is slower than production, but the bare state and the jump are in the server HTML itself.
2. **One in, one out?** Mostly a sequence: stage settle, paste strip, planes, three pinned chapters, Teach, the dark room, Start, the close, the Band. Two empty white bands remain at 1470:
   - About 230px between the paste strip and "The workbench you know" (d-s-04).
   - About 170px between the Teach caption and the dark room (d-s-13).
3. **A real object in every section?** Yes on desktop. On phone, all three chapter pictures are clipped (see 6).
4. **One ask, sticky; scale rhythm?**
   - Desktop: yes. Past the hero, the header carries a solid "Open the IDE", and nothing of the page floats over content.
   - Phone: the header stays a solid "Try Hanzo", as the card says.
   - Scale: h1 52, sections 26 (Engine 32), accordion 16.4, one 88px Band statement. Big, medium and small are all present.
5. **Every hover and press answers?** All but two:
   - **Recall** (`.ide-teach-c li button`) shows no computed change on hover.
   - **The kit Band's "Open the IDE"** shows no change on hover (#f5f5f7) and no press transform.
6. **Overlaps, font swap or layout shift?** There is no font swap and CLS is about 0. Four real problems:
   - **Phone chapters overflow the screen.**
     - At 375, `.a2-ch-item`, `.a2-ch-pv` and `.ide-pic` measure 16..554px wide, in a 375px viewport.
     - The `white-space: pre` lines (`.ide-pic-src`, scrollWidth 476) set the grid item's min-content width, and the overflow is clipped.
     - So chapter 01's code, chip and copy ("…lasts past the", cut), chapter 02's graph and legend, and chapter 03's sandbox and copy are all cut at the right edge (p-ch1.png, p-idepicgraph.png, p-idepicsafe.png).
     - This is a round-6 regression: `flex: 1` and `width: auto` on `.ide-pic-src`.
   - **The episodic chip covers code.** It sits on line 5's text by 22px at 1470 (the text ends at x 1104, the chip starts at 1083, so ".git" is hidden). On phone it starts at 338, over text that runs to 421.
   - **Arrival jump on desktop.** The editor moves 264px after hydration (see 1). This is a transform, so CLS does not catch it, but the eye does.
   - **Reduced motion logs a hydration error and shows the red "1 Issue" badge on 3 of 3 loads at both sizes.** The diff names `translateY(105%)` against `none` on the A2Lines lines, `opacity` on Editor, `translateY(-120px) rotateX(14deg)` against `none` on Planes, and the `clip-path` of A2Room.
7. **Which reference, is its motion there?**
   - The Apple product page: the stage settle, pinned chapters with one panel changing, and a closing statement. Present.
   - synchronized.studio: the related rows Morph. Present.
8. **Different from neighbours?** Yes. The hero is a self-running editor with a memory gutter, and the dark room has the orbiting memory tiers. It is distinct from the /cli terminal and the /desktop window.
9. **18 parts?** The card is complete in form, but its part 11 and part 8 claims are false (see the card check).
10. **Banned tells?**
    - Page-owned: none. The kickers are clipped to 1×1 and sr-only. There is no hue, no Inter, and no gradient text.
    - **The kit Band reveals "around." through blur up to 12px.** That is an opacity-and-blur reveal over the 4px cap. The Band also renders #f5f5f7 and #a1a1a6, which are off-deck. These are kit-owned, but they are on this page.
11. **Copy untouched?** Yes. Parity is 75/75 text and 10/10 links, and no new words were seen.

## Card check (docs/coverage/ide.md)
- **Part 11, false:** "375×812 and 1470×801 pass with no overlap". At 375 the three chapter items are 538px wide and clip their pictures and copy. At 1470 the episodic chip covers 22px of line 5. A false claim caps the verdict at 7.
- **Part 7, partly false:** "the chapter code reads … with whole lines". True at 1470. At 375 the whole lines push the chapter off the screen.
- **Part 8, partly false:** "Every control has hover". Recall has none, and neither has the kit Band button.
- **Part 9, partly false:** "reduced motion shows final states". The states are right, but every reduced-motion load logs a hydration mismatch (red badge), against DONE item 3.
- **Part 3, unverified:** "it moves within 1 s (measured)". Here the first change came at 1.2–2.3 s, and before it there is no h1 on screen.
- **True:**
  - JS off is legible, with 0 hidden text and the primary hit-testable.
  - 320 has no horizontal scroll.
  - The ask bottom is at 520 on 375×667.
  - 0 phone targets under 44px.
  - The phone header ask is "Try Hanzo", as stated.
  - `data-cta="ide.hero"` and `data-thumb` are on the primary.
  - Parity and taste pass.
  - One h1, and the editor is in the server HTML.
  - The related rows Morph.
  - The chapter-tab and "Deploy to Cloud" hovers are now real.

## Fixes (in order)
1. **Phone chapters fit the screen.**
   - Add `.ide .a2-ch-item, .ide .a2-ch-pv, .ide .ide-pic, .ide-pic-code, .ide-pic-code li { min-width: 0; max-width: 100%; }`.
   - Add `.ide-pic-code { overflow: hidden; }`.
   - Under 899px: `.ide-pic-src { text-overflow: ellipsis; }` and `.ide-pic-chip { font-size: 0; gap: 0; padding-right: 6px; }` (the kind tag only, for all three chips).
   - Verify at 375 that every `.a2-ch-item` and `.ide-pic` has `getBoundingClientRect().right ≤ 359`, and that no element in `main` passes `innerWidth`.
2. **The chip never covers code.**
   - At 1470, set `.ide-pic-code li > .ide-pic-src { font-size: 14px }`; line 5 then ends about 27px earlier and clears the chip at 1083.
   - Or give chip-bearing lines `max-width: calc(100% - 230px)` with an ellipsis.
   - Verify that the line-5 text's right edge is less than or equal to the chip's left edge minus 8px at 1470 and at 375.
3. **No bare first paint and no jump.**
   - Invert the Stage: let the editor's normal flow position be under the ask (the flat JS-off layout), and animate it *up* (negative y) and scale it as you scroll, instead of shifting it *down* after measuring. The server HTML then equals the starting frame.
   - In `docs/requests/ide.md`, ask the A2Lines owner for a CSS-keyframe cut-in (`animation: a2-cut 700ms cubic-bezier(.16,1,.3,1) both`, 60 ms per line), so the h1 cuts in from first paint without waiting for hydration.
   - Verify that the frames at 250 ms and 1000 ms show the h1, and that `.ide-obj` top never changes by more than 4px across hydration.
4. **Reduced motion without a hydration error.**
   - In `Planes`, do not branch on `useReducedMotion()` during render. Use the same ranges for SSR and client, and let the existing `@media (prefers-reduced-motion: reduce)` CSS (`transform: none !important`) or a post-mount flag set the final state.
   - Do the same for Editor's initial `animate` / opacity.
   - Request the same from the A2Lines and A2Room owners.
   - Verify 0 console errors on 3 of 3 loads with `reducedMotion: 'reduce'` at both sizes.
5. **Recall hover.** `@media (hover:hover){ .ide-teach-c li button:hover { background:#f5f5f5; border-color: rgba(0,0,0,.3); } }`
6. **Kit Band (request, do not edit):**
   - Word reveal by line mask, with no blur (or 4px or less).
   - Text in #fafafa and #a3a3a3 instead of #f5f5f7 and #a1a1a6.
   - The button gets a hover (white 92%) and press `scale(.97)`.
7. **The last dead air.**
   - Trim the A2Paste bottom padding or the `.ide-engine` top padding so no 120px scroll step between the paste strip and "The workbench you know" shows more than 116px of empty white.
   - Do the same between `.ide-teach-s` and the dark room: `.ide-teach { padding-bottom: 44px }`.
8. **Card.**
   - Correct parts 11, 7 and 8 until fixes 1, 2 and 5 are measured.
   - Mark the part 3 "1 s" claim with the real arrival timing after fix 3.
   - Note the reduced-motion error under part 9 or part 17 until fix 4 lands.
