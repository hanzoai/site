# /computer — James-eye review

Verdict: 6.5/10
First complaint: "There's a red error badge sitting in the corner, and the hero is grey boxes. That's a wireframe of a computer, not a computer. It doesn't feel premium."

Walked 7 Nov 2026 on the dev server at 1470×801 and 375×812, moving. Method: Playwright with recorded video. Wheel-scrolled in 130px notches with 1.2s dwells. Clicked every hero tab, the pause button, the 01/02/03 steppers, all three checklist ticks and Copy. Hovered and pressed the asks. Did a 26-stop Tab crawl. Checked reduced motion, JS off, CDP platform fonts, and the phone top to bottom with taps. Ran parity.

## What works
- **The hero moves untouched within about 300ms.** A scan line sweeps the stage, a scripted cursor travels to the CSV field, and the grid fades. The counter auto-advances 01→02 at about 3s. The pause button flips its label to Play, sets `aria-pressed=true` and freezes the counter.
- **The pinned "It reads pixels / OCR / Mouse and keyboard" stage behaves like a real Apple-style pinned scene.** The left text swaps and one panel changes on the right, and the room goes from white to `#f5f5f5` for step 02. The 01/02/03 steppers scroll to each step.
- **The checklist "It has whatever you have" is a good small Beyond.** It uses `role=checkbox` with ticks that fill ink. The 0/3 figure counts up to 3/3, and the hairline bar fills. Hover darkens the box outline.
- **The sticky ask changes from "Try Hanzo" to "Try Hanzo Computer" once the hero leaves view (desktop).** Hero CTA press is `scale(0.98)` and hover lightens `#f5f5f7` to `#fff`, with no opacity fade.
- **Copy copies exactly what is displayed:** `Read https://hanzo.ai/skill.md and use Hanzo Computer in my project. Start with: hanzo desktop`.
- **Copy parity: 33/33 text, 4/4 links.** CLS during the walk was 0.0007. The h1, lede and h3 all render in Zen (CDP platform fonts), and I saw no font swap.
- **Reduced motion works.** The hero counter holds at 01 and `getAnimations()` is 0 after 3.8s. With JS off, the hero stage is visible (opacity 1 via the fallback).
- **Monochrome throughout,** and no label sits above any h1 or h2. "BEFORE YOU RUN IT" is correctly set below its h2.
- **The closing black Band "For the software with no API"** enters as a rounded card inside the gutters, with one solid ask and a text secondary.

## The 11 answers
1. **5 seconds / 1 second: mostly yes.**
   - The h1 "Hanzo Computer" is 52px at y 92–153, the lede is at y 182, and the asks are top right at y 122. The stage starts at y 262.
   - Motion arrives within 300ms (scan line, cursor). In frame 0 the lede is painted before the h1 has cut in, so the h1 arrives second, after its own subtitle.
   - The sell is weakened by the object itself. The stage is two grey-bar wireframe windows ("The vendor portal…", "The desktop tool from 2009.") full of placeholder bars and empty grey tiles. It reads as a skeleton loader, not as a product doing something.
   - The tab strip and caption ("If a person can click it, so can this", 01/06) sit at y 985–1100, below the fold at 801.
2. **One in, one out: half.**
   - The hero demo and the pinned three-step stage work as scenes.
   - After the pinned scene ends there is about 250px of empty white, with the 01/02/03 stepper stranded alone at the top (desktop, scrollY ≈ 3000).
   - There is another 250px of dead white below the checklist before "Paste and ship".
   - The "Paste and ship" / "Get Computer" pair is a static document block with no motion.
3. **Real visual object per section: partially.**
   - Hero: an illustrated stage, but placeholder-grey.
   - Pixels: abstract circles, squares and bars.
   - OCR: wireframe bars.
   - Mouse and keyboard: toggles and a waveform pill (the best of them).
   - Checklist: the counter.
   - Paste and ship: a code card.
   - None of it is real Hanzo media or product UI. The only image on the page is `models/mori.webp`, used as a faint mesh texture behind the stage. There is no block of 4 or more real visuals.
4. **One ask / scale rhythm: mostly yes on desktop, mixed on phone.**
   - Desktop: the header carries "Try Hanzo Computer" after the hero. The hero has one solid fill (189×44) plus a text "Documentation →".
   - Scale is reasonable: h1 52, h3 32, h2 26, Band h2 44, figure 0/3 about 64.
   - Phone: the header stays a solid black "Try Hanzo" while a bottom bar "Try Hanzo Computer →" rises. That puts two asks with different labels on screen at once (p_06). The bar also sits over the bottom of the canvas panel (p_03).
   - The cookie card (shared chrome) covers the Band headline at 1470×801 until it is dismissed.
5. **Hover and press: mostly, with one jump.**
   - Hero tabs change grey `#a3a3a3` → `#fafafa`, and the active tab gets an underline.
   - **Copy button jumps.** "Copy the agent prompt" is 205px wide; on click it becomes "Copied" at 120px, then 100px. The prompt beside it rewraps from 3 lines to 4. That is a layout jump on press, and loading/success must keep its width.
   - The checklist rows have no row hover (only the box outline darkens). The 01/02/03 steppers give minimal feedback.
6. **Overlap, font swap, layout shift.**
   - **Console error: a React hydration mismatch, shown as the red "1 Issue" badge.** It appeared on the first desktop load and on every reduced-motion load (3 of 3 reduced-motion runs).
   - The diff is on `.cp-stage` (the hero stage): the server sends `opacity:"0"`, `transform-origin:"50% 0%"`, `transform:"none"`, `clip-path: inset(0% 3% round 24px)`, and the client renders `opacity: 1`.
   - No font swap and no horizontal scroll (phone `scrollWidth` 375). CLS is 0.0007.
   - The phone bottom ask bar covers the panel edge.
   - Misalignment in "Get Computer": "Apache-2.0" sits about 12px higher than "hanzoai/computer" (desktop y 224 vs 236, and the same on phone).
7. **Reference: apple.com product page,** for the pinned stage with one panel changing and the sticky ask, and that motion is there. The synchronized.studio Morph is not felt: `data-morph-target` is on the stage, but there is no card-opens-into-page moment from this page.
8. **Different from neighbours: probably.** The self-running desktop demo with a cursor, plus a pixels/OCR pinned stage, is its own idea. The grey-wireframe illustration language risks looking like every other "illustrated product" page. I did not walk the neighbouring pages.
9. **18 parts.**
   - Present: one h1 with an sr span and a line-mask cut-in; `data-cta` on all asks; Band then footer; pause control first in the demo; checklist as a Beyond; copy equals display; reduced-motion final state; 44px tap targets on phone (none under 44 found); Zen and Zen Mono only.
   - Gaps: the console error (part 3/17), copy button width (part 8), dead white gaps (part 3 rhythm), no real media (part 10).
   - Orphan at 375: "Text on a web page can redirect / it". Body measures look fine.
10. **Banned tells.**
    - Hard failures: the console error/red badge and the copy-button layout jump.
    - Borderline: the hero is a framed or boxed illustration in a rounded dark card, which is close to the "framed static hero" tell, although it does move.
    - Not present: no hue, no gradient text, no Inter, no pill above a headline.
11. **Copy untouched: yes.** Parity is OK (text 33/33, links 4/4). The six hero tab labels repeat the section h3s; that is presentation, not new copy.

## Fix list (to reach 8+), most important first
1. **Kill the hydration mismatch on `.cp-stage`.** The server and the first client render must produce the same `style` under every `prefers-reduced-motion` value. Let the initial motion props come from CSS (`html.js .cp-stage{opacity:0}`), or render the stage's `initial` only after mount, not from a `useReducedMotion()` branch at render time. Zero console errors and no red badge, in both motion modes.
2. **Fix the Copy button width.** "Copy the agent prompt" must keep its 205px (min-width or overlay the "Copied" label) so the prompt never rewraps 3→4 lines.
3. **Make the hero stage feel like a real computer, not a skeleton.**
   - Replace the grey placeholder bars and empty grey tiles in "The vendor portal…" / "The desktop tool from 2009." with real-looking content drawn from the page's own words: CSV rows that actually fill as the cursor clicks, and the 2009 tool's tiles getting Set-of-Mark numbers.
   - At minimum, put the readable state change in the first viewport.
   - Lift the caption, counter and tabs so "If a person can click it, so can this" sits above the 801 fold.
4. **Remove the dead white gaps.** Cut the about-250px empty band after the pinned scene, where the 01/02/03 stepper is left stranded with no panel. Either unpin the stepper with its stage, or close the section's bottom padding. Do the same for the empty band under the checklist.
5. **Give "Paste and ship / Get Computer" one live thing.** For example, the prompt types itself in once at 60% visible, or "hanzoai/computer · 3 stars" counts in. Align "Apache-2.0" with "hanzoai/computer" on one baseline.
6. **Phone: one ask at a time.** When the bottom bar "Try Hanzo Computer →" is up, the header should not also show a solid black "Try Hanzo" with a different label. Keep the bar off panels: add bottom padding equal to the bar height on the pinned panels.
7. **Make the h1 arrive first.** The lede "An agent that uses the computer in front of it" paints before the h1 cut-in. Stagger the lede after the h1 lines (60ms), or don't hold the h1.
8. **Smaller items.**
   - Fix the orphan "it" on "Text on a web page can redirect it" at 375 (`text-wrap: balance` on the h3s).
   - Give the 01/02/03 steppers and checklist rows a hover that tells something (a row hover fill).
   - Keep the hero tab strip's peek on phone, but make sure the active tab scrolls into view (it does on tap; check on auto-advance).
