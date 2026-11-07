# /ide — James-eye review
Verdict: 6/10
First complaint: "On my phone the memory part is broken: three skinny grey boxes squeezed side by side, the words falling down one letter at a time, and 'procedural' cut off the edge. Then in 'safe by default' the keychain sits on top of the word Sandbox. It looks unfinished."
(Walked 7 Nov 16:20–16:33 UTC, HEAD `a070a06d` → `915e945a` (the later commit touched only the shared phone ask for /ide), at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×700, 375×667, reduced motion and JS off. Frames are in the critic's scratch folder; nothing was added to the repo.)

## What works
- The hero is the product, and it is alive. The h1 (52px desktop, 40px phone) is cut in by line mask. The editor runs Hanzo's own start script, and its memories (EPISODIC, SEMANTIC, PROCEDURAL) land in the gutter. The agent panel walks "deploy the gateway to staging". Two frames 1 s apart differ with no input, at both sizes.
- The fixes from the last review landed:
  - JS off is clean at 1470 and 375. `elementFromPoint` on "Open the IDE" returns the primary, and 0 text blocks are hidden.
  - The related apps are now 72px hairline rows (64px on phone). Every arrow sits 20px from its title, and each row fills #f5f5f5 on hover with the arrow sliding 4px.
  - The editor Pause fills white 8%. The memory kinds take a #f5f5f5 fill and a 30% border.
  - `.ide-mem-w` no longer animates width.
- Every primary control presses: scale .97–.98, or .99 on rows. The hero primary darkens from #0a0a0a to #2c2c2e. "View on GitHub" slides its arrow 4px. The Tiers Pause goes from #171717 to #262626.
- The dark room is the best screen. An orbit of three tiers drifts on its own, with a working pause, and sits beside a one-open accordion.
- Measured:
  - CLS 0.00036 on desktop (all from the shared header tools) and 0 on phone.
  - With reduced motion, 0 animations are running after 3.5 s and the hero is a still frame.
  - Scroll width at 320 is 320.
  - The primary's bottom edge is at 520px on 375×667.
  - On phone the header swaps to a solid "Open the IDE" after the hero (y = 1500 and 4000).
- `taste.py` passes on both files. Parity is 75/75 text and 10/10 links.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The h1, lede, "Open the IDE" and the top of the editor all fit 1470×801, and the editor moves untouched. On phone the h1 (3 lines), lede, primary and the editor's title bar fit the first 812px.
2. **One in, one out, or a document?** Mostly a scene: the stage settles, the planes explode, three pinned chapters change their picture (01 → 03, verified), then Teach, the dark room, Start, the close and the Band. It still has dead air. At 1470 there is about 380px of empty white between the end of the planes and the chapter tabs (frame d-s-06), so for one whole scroll step the screen shows nothing but the bottom edge of a black card.
3. **A real object in every section?** Yes: the editor, the planes, the memory picture, the call graph, the sandbox, the memory cards, the orbit, the terminal, the Get IDE card, the related rows and the Band.
4. **One ask, sticky; scale rhythm?**
   - The ask: yes on desktop, where the header turns to solid "Open the IDE" after the hero, and now on phone too (after the shared fix).
   - Scale: h1 52, sections 26–32, H3 17, one large Band statement. Big, medium and small are all present.
5. **Every hover and press answers?** Nearly. These do not answer hover:
   - the chapter tabs 01/02/03 (`.a2-ch` buttons: #737373 before and after);
   - "Deploy to Cloud" (quiet Cta in the Get IDE card: no computed change);
   - the script's Copy (`.ide-script-bar button`): only an inset `rgba(128,128,128,.1)` wash on #1c1c1f, effectively invisible.

   Every press answers.
6. **Overlaps, font swap or layout shift?** Desktop is clean: no font swap and CLS about 0. **The phone has two real breaks:**
   - **`.ide-teach-g` at 375 keeps three columns** (133 / 106 / 80px). Line 348 of `IdePage.css` (`grid-template-columns: minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)`) sits outside any media query, after the `max-width: 899px` rule at line 232, so it wins. The result:
     - "gateway is on staging" and any memory you add ("uses pnpm") wrap one letter per line;
     - the `procedural` chip overflows its 80px card (scrollWidth 116);
     - the Recall button hangs off the right card's edge.
   - **The sandbox picture at 375:** the `.ide-key` chip (x 85–339) covers the "SANDBOX" label (x 52–116). It reads "SAND".
   - The console showed a hydration attribute mismatch, with the red "1 Issue" badge in every frame, on 2 of 8 loads (both walk loads, 0 of 6 re-loads). It is intermittent, but James would see the badge.
7. **Which reference, is its motion there?** The Apple product page: the stage settles, the chapters pin while their panel changes, and one statement closes the page. Present. synchronized.studio: the related rows carry `data-morph`. Present.
8. **Different from neighbours?** Yes. The hero is a self-running editor with a memory gutter, and the signature is the orbiting memory tiers. It is not the /cli terminal or the /desktop window.
9. **18 parts?** The card is complete in form, with honest gaps left unticked, but the part 11 claim is false (see below).
10. **Banned tells?**
    - None outright.
    - **Low-contrast dark mode** in the chapter 01 picture. Its code is #48484e on #16161a, about 2.0:1. `.ide-pic-src { padding-right: 230px; text-overflow: ellipsis }` cuts every line to its first word ("open", "git", "cd", "npm"), so the picture reads as broken, not as a dimmed backdrop. It is `aria-hidden`, but James sees it.
    - The kit Band's headline arrives with `filter: blur(12px)` easing to 0. Part 9 says no opacity-and-blur reveal and blur of 4px or less. The Band is shared, but it is on this page.
    - The Teach tiles are still three grey boxes in a row at 460 / 368 / 276px. They are unequal, so this passes the letter of the rule, but it is the weakest-looking screen on desktop.
    - Apple-style greys still render: #f5f5f7, #16161a, #1b1b20, #48484e, #d1d1d6, #a1a1a6, #6e6e73 and #0a0a0b. `taste.py` passes them (low chroma), but they are not deck values.
11. **Copy untouched?** Yes (parity is clean).

## Card check (docs/coverage/ide.md)
- **Part 11, false:** "375×812 and 1470×801 pass with no overlap". At 375 the Teach grid stays three columns and its text breaks letter by letter, `procedural` overflows its card, and the keychain chip covers "SANDBOX". A false claim caps the verdict at 7.
- **Part 7, misleading:** "off-deck greys … overridden to deck values". The six named greys no longer render, true. But the computed styles of `main` still show #f5f5f7, #16161a, #1b1b20, #1e1e23, #48484e, #d1d1d6, #a1a1a6, #6e6e73, #0a0a0b, #b5b5b5, #c7c7c7, #aeaeae and #959595. The "no literal hex" box is honestly unticked.
- **Part 8, partly false:** "Every control has hover". The chapter tabs, the quiet "Deploy to Cloud" and the script Copy show no visible hover. The chapter tabs and Deploy to Cloud may be kit-owned; the script Copy is not.
- **Part 12, partly false:** "Contrast measured, text at 4.5:1". The chapter 01 picture code and the editor line numbers are #48484e on #16161a/#1b1b20, about 2:1 (decorative and `aria-hidden`, but visible).
- **Part 3 / 17, partly false:** "no console errors". A hydration mismatch fired on 2 of 8 loads.
- **True:**
  - JS off is legible, with 0 hidden blocks and the primary clickable at both sizes.
  - One h1; the h1 and the editor are in the server HTML.
  - Reduced motion shows the final state (0 running animations).
  - No horizontal scroll at 320.
  - The ask's bottom edge is at 520px on 375×667.
  - 0 targets under 44px in `main` on phone.
  - `data-cta="ide.hero"` and `data-thumb` are on the primary.
  - The related rows Morph, and the sticky ask swaps on desktop and phone.
  - Parity is 75/75 and 10/10; `taste.py` passes.

## Fixes (in order)
1. **Phone Teach grid.** Move the 5/4/3 rule inside a desktop query, or re-assert the phone rule after it:
   - `@media (min-width: 900px){ .ide-teach-g{grid-template-columns:minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)} }`, and delete the bare rule at line 348;
   - or append `@media (max-width: 899px){ .ide-teach-g{grid-template-columns:minmax(0,1fr)} }` at the end of the file.

   Re-measure at 375 that each `.ide-teach-c` is 343px wide and has no scrollWidth overflow.
2. **Phone sandbox label.** Under 899px, take `.ide-key` out of absolute positioning (`position:static; margin:56px auto 0; justify-self:center`), or move it below the dashed box (`top:auto; bottom:20px; right:20px`). Check that `.ide-box .x-mono` and `.ide-key` rectangles do not intersect at 375 and 320.
3. **Chapter 01 picture code.**
   - Remove `padding-right:230px` and the ellipsis from `.ide-pic-src`, or limit it to the three lines that carry chips, so the whole command shows.
   - Lift its colour from #48484e to white 55% (`rgba(255,255,255,.55)`, about 6:1 on #16161a). Comments can go to white 30% only if they stay readable.
   - Swap `.ide-pic-mem`'s #16161a for #171717.
4. **Close the gap above the chapters.** Trim the bottom padding of `.ide-engine` or the top of `.a2-ch` on this page so no scroll step at 1470×801 shows more than about 116px of empty white between the planes and the 01/02/03 tabs.
5. **Last hovers.**
   - `@media (hover:hover){ .ide-script-bar button:hover{background:#262626;color:#fafafa;border-color:rgba(255,255,255,.3)} }`.
   - Request kit hover states for the quiet Cta (a #f5f5f5 fill, or white 8% on dark) and for the `.a2-ch` tab buttons (#737373 → #0a0a0a). Write both in `docs/requests/ide.md`.
6. **Deck greys.** Replace #f5f5f7 → #fafafa, #16161a/#1b1b20/#1e1e23/#1c1c1f → #171717, #48484e → white 30%, #d1d1d6 → white 78%, #a1a1a6 → #a3a3a3, #6e6e73 → #737373, #0a0a0b → #0a0a0a, and #b5b5b5/#c7c7c7/#aeaeae/#959595 → #a3a3a3 or #d4d4d4.
7. **Hydration mismatch.** Find the attribute that differs between server and client. Likely candidates:
   - `inert` or `aria-hidden` on `.ide-acc-a`;
   - a `style` set from `useNarrow`, or the Teach `MID` counter.

   Make the first render match the server, so the "1 Issue" badge never appears on a cold load.
8. **Band blur (shared).** Ask the Band owner to replace `filter: blur(12px)` with the line-mask cut-in (translateY 105% → 0, 700 ms, ease-emphasis), or blur of 4px or less. Note it in `docs/requests/ide.md`.
9. **Card.** Untick part 11 until fixes 1 and 2 are measured. Correct the part 7 sentence to list the greys that still render, and add the part 12 contrast exception.
