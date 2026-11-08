# /security — James-eye review
Ready: 2026-11-07, slice D — re-verified the bb7920b4 fixes (chosen plate lifts above the stack on every tab incl. 06, rack grows, bigger place move, band press, phone labels on one line) and the decode signature; h1 now cuts in on CSS from first paint; card part 18 ticked

Verdict: 7/10
First complaint: "I click 'Where It Sits' and the black Koma plate just disappears. The stack goes all white with two little black slivers poking out the sides. It's meant to lift out and it hides instead. That looks broken."

Walked 7 Nov 2026 (main at `dba2ca82`, after `c17b43ac` and `c79a1ad5`, the security fixes). I used Playwright Chromium and walked it moving, not from screenshots:
- **Sizes:** 1470×801, and 375×812 with isMobile and hasTouch. Both recorded on video.
- **Arrival:** 10 frames over the first 5 s with no input.
- **Scroll:** desktop in 360px wheel steps, phone in 300px steps, with a 650 ms dwell on each screen.
- **Hover and press:** the hero ask, the hero layer labels, the tabs, the worksheet tick, rack rows, the place buttons, option rows, the sheet button, the email and the band ask.
- **Clicks:** a hero layer, then arrowed the tablist and ticked 6/6. Pressed "your cluster". Opened the Enterprise sheet and closed it with Esc.
- **Other checks:** reduced motion, JS off, 375×667 and 320. Non-localhost POSTs were blocked.
- **Neighbour:** /trust captured for comparison.

Stills in `docs/build-notes/review/security/`:
- `hero-1470.jpg`
- `controls-06-plate-hidden-1470.jpg`: the main bug.
- `sheet-open-1470.jpg`
- `phone-first-375.jpg`
- `phone-sheet-over-hero.jpg`: the old name, which now shows the fixed bottom sheet working as a modal.

## What works
- **The hero is the right idea, well made.** Six isometric plates go from the edge down to Koma's black file. They check themselves from 0.4 s in 300 ms steps (`01 / 06` to `06 / 06`) and then stop. Something moves inside 1 s, it says "checked", and it rests.
  - Hovering a layer label draws in its mechanism line, e.g. `HMAC signature · no algorithm · refresh token`. That is a hover that tells you something.
  - Clicking a label scrolls to the controls with that tab selected and focused.
- **The last review's blocker is fixed.** The sheet is now a native `<dialog>` with `showModal()`.
  - Desktop: a right panel with a scrim.
  - Phone: a proper bottom sheet with a grab bar.
  - Opening it leaves the scroll position alone (3130 → 3130). Esc returns focus to "What comes with Enterprise".
  - Nothing draws at rest. `scrollWidth` equals the viewport at 1470, 375 and 320.
- **One ask.** "Talk to Security Team" is solid in the hero.
  - Desktop: the header swaps from an outlined "Try Hanzo" to a solid "Talk to Security Team" once the hero leaves.
  - Black room: the header outlines while the band's light ask is the solid one.
  - All the secondaries are text links.
- **The middle has some life now.**
  - The rack powers on U1 to U4 as it enters (150 ms, then 400 ms steps).
  - The "Our cloud / your cluster / your rack" switcher steps by itself once (900 ms) and then hands control to the visitor.
  - The controls tablist is a correct APG tablist: arrows wrap, inactive panels are `inert`, and the pill glides at 300 ms ease-emphasis with no spring.
  - The worksheet works: 6/6 reveals "Schedule Security Review", and the count is `aria-live`.
- **The phone's first screen now carries the object.** The stack starts at y 538 inside 812 and checks itself in view. At 375×667 the ask's bottom sits at y 450.
- **Clean numbers:**
  - CLS 0.0023 on desktop (header-tools only) and 0 on the phone.
  - Reduced motion: all six checked, 0 running animations after 3 s, h1 at opacity 1.
  - JS off: 0 invisible text nodes.
  - Parity 60/60 and 6/6. `taste.py` OK. `unique.py` OK.
- **/trust has moved on.** It now has tilted document cards for the DPA and subprocessors, so the old "same numbered-list-plus-plate" overlap between neighbours is gone.

## The 11 answers
1. **5 s / 1 s:** Yes at both sizes. The h1, caption under it, lede, ask, status line and the moving six-layer stack all fit the desktop first screen. On the phone the stack starts inside the fold and moves.
2. **One in, one out?** Partly. The hero, the controls (one plate swaps for the next) and the black room each feel like a scene. "What runs underneath" and "Or none of our infrastructure" are still a paragraph beside a list, two white screens in a row. The rack power-on and the place switcher stop them from being dead, but it still reads more like a document than a sequence there.
3. **A real object in every section?**
   - Hero: the stack.
   - Controls: the carried-down stack and the mechanism glyphs.
   - Infra: the rack. It is now a lit object, though still a list at heart.
   - None: the small stack moving between three places. It is abstract and only just reads as "your cluster".
   - Black room: the statement and the address.
   - Yes overall, with the "none" visual the weakest.
4. **One ask, nothing floating, scale rhythm:**
   - Desktop ask: yes. Nothing is fixed over content at either size (only the header and the shared cookie card).
   - Phone: the shared header keeps a solid "Try Hanzo" next to the hero's solid "Talk to Security Team", so there are two solid fills with two different labels on the first screen. That comes from the shared header (`_shared.md` §1) and is not held against the page.
   - Scale: the h1 is 52, heads 26, the band moment 84. But from the controls to the black room everything sits at the same middle scale. Nothing grows or shrinks as you go.
5. **Hover and press:**
   - The hero ask darkens and presses to 0.98. Layer labels fill and show their mechanism, pressing to 0.971. Tabs ink their label and press to 0.98.
   - The tick lifts 1px. Place buttons fill and press to 0.97. The email lifts 2px. Rack rows nudge their label 4px. The "+" turns 90°.
   - The band ask lightens to `#e4e4e7` and lifts 2px. Its press keeps the same −2px lift, though: no 0.98 or 1px-down press, so the press does not answer.
   - The selected plate "lift" is the visual failure (see 6).
6. **Overlap, font swap, shift:**
   - No layout shift and no font swap. No horizontal scroll at 1470, 375 or 320.
   - **One visual overlap fault:** in the controls stack the chosen plate translates up (`translate: -6px -44px`, ink fill), but it keeps `z-index: 10 - i`, so it slides *behind* every plate above it.
     - Choosing 04 shows two black slivers peeking out of a white stack.
     - Choosing 06 hides the black Koma plate almost entirely, so the stack turns all white (`controls-06-plate-hidden-1470.jpg`).
     - Only 01 lifts visibly. The page's through-line object reads as a glitch on 5 of 6 tabs.
   - Phone detail: "your cluster" wraps to two lines while "Our cloud" and "your rack" stay on one, so the three labels don't sit on one baseline.
7. **Reference:** It has the calm of chatgpt.com/business/enterprise, "proof listed quietly", which is what MASTER §4.2 asks for. The controls with one changing panel are a light nod to an Apple single-panel stage, but nothing is pinned or scrubbed. No osply/hamol editorial asymmetry.
8. **Different from neighbours?** Yes:
   - /trust: tilted document cards.
   - /enterprise: a nested-box diagram.
   - /security: an isometric layer stack that checks itself and is carried into the controls.
9. **18 parts:** The card has 18/18 headings, each with a "Done here" line. See the card check.
10. **Banned tells:**
    - Nothing above the h1 ("Security Architecture" sits under it as a caption).
    - No hue, gradient text, Inter, seals or invented uptime. No floating bar.
    - The two paragraph-plus-list middle sections are close to "walls of text" but not over the line.
11. **Copy untouched:** Parity 60/60 and 6/6. No changes seen.

Console: on the first, loaded walk, the desktop had one hydration-mismatch error and the red "1 Issue" badge. Quiet reloads of /security (and /trust) were clean, with no badge and 0 errors. This matches `_shared.md` §3 (load-only), so it is not held against the page.

## Card check
`docs/build-notes/coverage/security.md` is in MASTER format, 18/18, and every "Done here" line is filled. The three claims I failed last time are now true:
- **Part 8:** the native dialog traps focus, Esc closes it, focus returns, and opening does not scroll.
- **Part 11:** no overlap from the sheet, and no scroll at 320.
- **Part 4:** the desktop header swap works, and the card honestly says the phone header is the shared "Try Hanzo".

Two small inaccuracies:
- **Part 18** says "No critic review exists yet on origin/main". That is stale: a 5/10 review existed. Update it.
- **Part 8** says "every control has hover, press…". The band ask's press is the same lift as its hover, not a press.

Neither is a design claim the walk contradicts, so I don't apply the false-claim cap.

## To reach 8
- **Fix the lifted plate (the blocker).** Give the chosen plate a z-index above the rest, e.g. `.xsc-stk-s li[data-on='true'] { z-index: 20 }`. It should then rise clear of the stack the way the copy promises ("the chosen one lifts out of the stack").
  - Check every tab, especially 06: the Koma plate must stay visible and dark when it is chosen.
  - The plates below it already drop 10px, so once the chosen plate sits on top the gap reads as a real lift.
- **Give the middle a scale change and a scene, not two text screens.** For example:
  - The rack grows from small to its moment as it powers on and settles back once U4 is lit.
  - Or the "Our cloud / your cluster / your rack" stack makes a larger, clearer move: the stack lifts off a labelled base and lands on the next, using the same plate language as the hero, at a size that holds the screen.
  - Right now both sections are a paragraph next to a list at the same mid scale.
- **Press states:** give the band ask a real press (scale 0.98 or translateY 1px), not the hover's lift.
- **Phone polish:**
  - Keep the three place labels on one line (smaller tracking or a two-line layout for all three).
  - The audit row at 375 reads as a hanging block (dot, then text, then the link indented under it). Align the link with the text or let it sit full width.
- **Card:** refresh the part 18 line, and part 8 once the band press is fixed.
