# /ide — James-eye review
Verdict: 7/10
First complaint: "The first chapter picture is broken. It's a big dark slab with the code chopped down to 'git', 'cd', 'npm' in a thin strip on the left. And if I turn animations off, the editor sits right on top of the headline and the button. It looks unfinished."
(Walked 7 Nov 16:38–16:49 UTC. HEAD was `748e2adc` and moved to `6daba878` during the walk; for /ide only the shared `usePhoneAsk.js` changed. Sizes: 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×700, 375×667, reduced motion and JS off. The frames are in the critic's scratch folder; nothing was added to the repo.)

## What works
- **The hero is the product, and it is alive.**
  - The h1 is 52px on desktop and 40px on phone, cut in by line mask.
  - The editor types Hanzo's start script and lands EPISODIC / SEMANTIC / PROCEDURAL in the gutter.
  - The agent panel walks "deploy the gateway to staging" to "gateway is on staging".
  - Frames 250 ms and 1 s after arrival differ at both sizes. At 1470, frames 1 s apart still differ after 3 s idle.
- **Last round's phone breaks are fixed (measured):**
  - `.ide-teach-g` is a single 343px column at 375, and every card's scrollWidth is 343.
  - The `.ide-key` and `.ide-box .x-mono` rectangles no longer intersect.
  - "uses pnpm" adds as a whole line.
- **The hydration badge is not the page's fault.** It came from Playwright's screenshot caret-hiding, which stamps `caret-color` on inputs while the page hydrates. With `caret: 'initial'` there were 0 errors in 4 of 4 cold loads, and 0 in 8 of 8 loads with no early screenshot. Real visitors get no red badge.
- **Pinned chapters work.** 01 → 02 → 03 change their picture: the memory gutter, then a call graph drawing its edges, then a sandbox with an audit trail. The dark orbit room drifts on its own and has a working pause; next to it sits a one-open accordion. The close is the Get IDE card, 72px hairline rows that Morph, and the Band.
- **Hover and press:**
  - The primary goes #0a0a0a → #2c2c2e and presses to 0.98.
  - The script Copy now answers hover (#171717 → #262626, text #d4d4d4 → #fafafa).
  - The Teach kinds fill #f5f5f5 on hover.
  - The related rows fill #f5f5f5, and their arrow slides 4px.
  - The "View on GitHub" arrow translates 4px.
- **Other measurements:**
  - CLS is 0.00036 on desktop (all from the shared header tools) and 0 on phone.
  - Max scrollWidth at 320 is 320.
  - The primary's bottom edge is at 520 on 375×667.
  - The phone `main` has 0 targets under 44px.
  - Under reduced motion, 0 animations are running after 3.5 s.
  - With JS off, the primary is hit-testable at both sizes.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. At 1470 the first screen holds the h1, lede, "Open the IDE" (y 382–430) and the editor top. At 375 it holds the h1 (3 lines), lede and primary (bottom 520), with the editor from y 568. Something moves within 1 s at both sizes.
2. **One in, one out, or a document?** Mostly a sequence: stage settle, paste strip, planes, three pinned chapters, Teach, the dark room, Start, the close, the Band. **Dead air remains between rooms.**
   - The gap from the bottom of the `.ide-engine` grid to the 01/02/03 tabs is **351px of white** (the engine ends at 2657 and the tabs first show at 2713 + 295). For about 4 scroll steps of 120px, more than 240px of the screen is empty (frame d-s-05).
   - Another empty band of about 240px sits between the sandbox chapter and the Teach input (d-s-10).
3. **A real object in every section?** Yes: the editor, prompt strip, planes, chapter pictures, memory cards, orbit, typed script, Get IDE card, related rows and Band. **But the chapter 01 picture is visibly broken** (see 6).
4. **One ask, sticky; scale rhythm?**
   - Desktop: yes. Once past the hero, the header swaps to a solid "Open the IDE".
   - Phone: since `d7ce999c` the header reads a solid **"Try Hanzo"**, not "Open the IDE", at 1500 to 9000 whether scrolled or jumped. The new no-clip rule reverts the label because "Open the IDE" ran into the 16px gutter. That is still Hanzo's words, but not this page's ask.
   - Scale: h1 52, sections 26–32, H3 17–26, one 88px Band statement. Big, medium and small are all present.
5. **Every hover and press answers?** Press: yes everywhere (0.95–0.99). Hover: two still fail.
   - **The chapter tabs** (`.a2-ch-stick button`) stay #737373 before and after hover.
   - **"Deploy to Cloud"** changes only by an inset `rgba(128,128,128,.1)` wash on #0a0a0a, which is invisible.
6. **Overlaps, font swap or layout shift?** There is no font swap and CLS is about 0. Two real problems:
   - **The chapter 01 picture code is clipped to 26px.** `IdePage.css:87` has `.ide-pic-code li span { width: 26px; font-size: 12px }`, which also hits `.ide-pic-src` (a span with overflow hidden). Each line renders 26px wide with a scrollWidth of 183–284. It reads "# Op", "oper", "# Oı", "git", "cd", "npm", "# Fi" at both sizes (d-ch1b.png, p-ch.png). The round-5 fix removed the padding, but the line-87 width still wins.
   - **Reduced motion at 1470×801 is an overlap.**
     - With `still = calm || narrow`, the editor goes straight to its settled spot (top 206) while the hero copy stays at full opacity.
     - `elementFromPoint` on the h1 returns `.ide-bar`, the lede returns covered, and the primary returns `LI.k3`.
     - So "An IDE that remembers" is cut by the window bar, and the lede and "Open the IDE" are under the editor (rm-1470.png).
     - Phone reduced motion is fine.
7. **Which reference, is its motion there?** The Apple product page: the stage settle, pinned chapters with one panel changing, and one closing statement. Present. synchronized.studio: the related rows carry `data-morph`. Present.
8. **Different from neighbours?** Yes. The hero is a self-running editor with a memory gutter, and the signature is the orbiting memory tiers. It differs from the /cli terminal and the /desktop window.
9. **18 parts?** The card is complete in form, with honest gaps left unticked. Its part 7, 11 and 18 claims are partly false (see the card check).
10. **Banned tells?**
    - None outright. The kicker above the h1 is visually hidden (`.a2-kick:not(.show)`).
    - Minor: the A2 kit's `--acc: #0a0a0b` renders on 15 page elements (`.ide-plane-k`, `.ide-ring-r`, `.ide-g`), and #f5f5f7 and #a1a1a6 render in the kit Band. These are near-deck, kit-owned values.
    - The Teach input is an empty 56px box with no visible label or hint. Its name, "One thing about your project", is only in `aria-label`, so it reads as a lazy plain box.
11. **Copy untouched?** Yes. Every string matches the hero, chapters, Teach and close as before. No new words were seen.

## Card check (docs/coverage/ide.md)
- **Part 7, false:** "the chapter code reads at white 55% on #171717 with whole lines". The colour is right (rgba 255,255,255,.55 on #171717), but every line is clipped to 26px (see 6). A false claim caps the verdict at 7.
- **Part 11, false under reduced motion:** "1470x801 and 375x812 checked (no overlap)". Under `prefers-reduced-motion` at 1470×801, the editor covers the h1, lede and primary.
- **Part 9, partly false:** "reduced motion shows final states". It does, but the final state of the stage overlaps the hero copy on desktop.
- **Part 8, partly false:** "Every control has hover". The chapter tabs and "Deploy to Cloud" show no visible hover.
- **Part 18, stale:** "last review 5/10". The last review was 6/10.
- **True:**
  - The phone memory kinds stack (343px each), and the keychain clears the sandbox label.
  - The script Copy answers hover.
  - IdePage.css itself has no off-deck greys; the remaining ones come from the A2 kit.
  - One h1; the h1 and the editor are in the server HTML.
  - JS off is legible, and the primary is hit-testable at both sizes.
  - 320 has no horizontal scroll.
  - The ask bottom is at 520 on 375×667.
  - 0 phone targets under 44px.
  - `data-cta="ide.hero"` and `data-thumb` are on the primary.
  - No console errors on real loads.
  - The related rows Morph.

## Fixes (in order)
1. **Chapter 01 code, whole lines.** Scope the line-number rule to the number only:
   - In `IdePage.css:87`, change `.ide-pic-code li span {…}` to `.ide-pic-code li > span:first-child {…}`.
   - Add `.ide-pic-src { width: auto; flex: 1; min-width: 0; font-size: 15px }` (13px under 899px).
   - Re-measure that `.ide-pic-src` clientWidth ≥ scrollWidth on lines 1–8 at 1470, and that the visible text reaches "https://github.com/hanzoai/ide.git" (or ends in a single ellipsis on phone).
2. **Reduced motion hero on desktop.** In `Stage` (`IdePage.jsx:136–152`), keep the start offset when only `calm` applies: `const y = useTransform([p, sy], ([v, y0]) => (narrow ? 0 : calm ? y0 : y0 * (1 - k(v))))`. The editor then rests under the buttons, as with JS off. Alternatively, reuse the `html:not(.js)` flat-stage rules under `@media (prefers-reduced-motion: reduce)`. Verify at 1470×801 that `elementFromPoint` on the h1, lede and `[data-cta="ide.hero"]` returns the element itself.
3. **Close the dead air.**
   - `.ide .a2-ch-stick { align-items: flex-start; padding-top: clamp(96px, 12vh, 140px) }` (desktop only), so the tabs sit about 120px under the header, not 295px.
   - Trim `.ide-engine` padding-bottom to 0.
   - Do the same between the sandbox chapter and `.ide-teach`: reduce its top padding from `clamp(72px, 8vw, 116px)` to 44px.
   - Target: no 120px scroll step at 1470×801 shows more than 116px of empty white.
4. **Last hovers.**
   - `@media (hover:hover){ .ide .a2-ch-stick button:not([aria-current]):hover { color:#0a0a0a } }`.
   - `@media (hover:hover){ .ide-get .x-btn:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.6) } }`.
5. **Teach input.** Show its name visibly, with no new strings: render "One thing about your project" as a 13px #737373 label above the field (part 8: label above), or as its placeholder.
6. **Phone header ask.** Since `usePhoneAsk` now refuses "Open the IDE" (it runs into the 16px gutter), either shrink the phone header button padding so the label fits within 16px, or accept "Try Hanzo" and note it on the card. Right now the header carries no page ask on phone, and part 4 stays unticked.
7. **Kit accents (optional, page-local).** Add `.ide { --acc: #0a0a0a }` so `.ide-plane-k`, `.ide-ring-r` and `.ide-g` render the deck ink, not #0a0a0b.
8. **Card.** Correct part 7 (chapter 01 lines) and part 11/9 (reduced-motion overlap) until fixes 1 and 2 are measured, and update part 18's "last review" line.
