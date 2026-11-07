# /computer — James-eye review

Verdict: 7/10
First complaint: "Why is there a red '1 Issue' error sitting in the corner? And once I'm past the demo it goes quiet: a checklist, a grey box and a line saying 3 stars."

Walked 7 Nov 2026 on the dev server at 1470×801 and 375×812, moving. Method: Playwright with video, wheel notches of 130px and about 1.2s dwell per screen; idle frames over the first 2s; hovered and pressed all 20 controls in `main`; clicked every tab, chapter number and checklist row; a 14-stop Tab crawl and Esc; reduced motion; JS off; phone screens top to bottom with taps; 6 extra cold loads to pin down the console error. Proof: `docs/review/computer/desktop-sheet.jpg` and `phone-sheet.jpg`. (`desktop-walk.jpg` and `phone-walk.jpg` in that folder come from the earlier review, not this one.)

## What works
- **The hero object is alive and on-message.** A dark stage (`.cp-stage`) runs a scripted demo by itself: a cursor works down the "vendor portal that exports one CSV at a time", ticking rows, while "the desktop tool from 2009" sits beside it, a scan line sweeps across, and the `01 / 06` caption advances about every 4s. It moves within about 400ms of load. A pause button sits first in the stage (49×49, `aria-pressed`).
- **Scale has rhythm in the hero.** The stage enters at 1273px wide, wider than the 1152px container, then settles to 1151px inside the gutters as you scroll. h1 52px, section h2s 26px, the meter figure 64px Air, the closing band h2 44px.
- **A real pinned stage** (`.av-sc-pin`, sticky, 801px tall, 2211px of scroll): one panel changes per chapter. Chapter 01 shows four thumbnails (native app, canvas, remote desktop, web page) with a scan line. Chapter 02 shows OCR and Set-of-Mark boxes. Chapter 03 shows macOS permission switches that flip on and a voice waveform that keeps moving. The `01 02 03` numbers are real buttons (44×44) that jump to their chapter.
- **The checklist is a good "Beyond".** Ticking a row fills a black 48px box with a check and moves the `0 / 3` meter figure and its bar. It works the same on phone. It turns the warning copy into something you do.
- **Copy action is correct.** "Copy the agent prompt" presses at scale 0.97, shows "✓ Copied", and the prompt is plain mono text.
- **One ask and one solid fill.** At the top the header ask is outlined ("Try Hanzo"). Once the hero ask leaves view, the header swaps to a filled "Try Hanzo Computer". Only one fill is ever in view on desktop.
- **Colour, type and copy are clean.** I found 0 hued pixels in computed colours. Faces are Zen and Zen Mono only. Parity: `text 33/33, links 4/4`. Nothing sits above any h1 or h2, and "BEFORE YOU RUN IT" is set below its h2 as a caption.
- **Resilient.** With JS off the h1 and stage are fully legible. Under reduced motion `getAnimations()` is empty at 3.5s and the final states show (switch on, waveform flat). CLS over the full scroll was 0.0007. The h1 box never moves (92px top, 662×61 from the first frame). No horizontal scroll on phone (scrollWidth 375).

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes. "Hanzo Computer" (52px) with its lede is on the left, and "Try Hanzo Computer" plus "Documentation →" are on the right at y=122. The running stage starts at y=255 and is visible in the first screen at both sizes. Motion starts with no input within about 0.4s: the stage arrives, the cursor moves and the rows tick.
2. **One in, one out, or a document?** The top 60% is: hero, then the pinned stage where one panel swaps per chapter. After the pin releases at about y=3376 it turns into three static light blocks in a row: the checklist (534px), "Paste and ship" with "Get Computer" (467px), then the band. Nothing comes in or goes out there; they just scroll past. It is not a document, but the second half goes flat.
3. **A real visual in every section?** Hero: yes (live stage). Pinned scene: yes (three drawn panels). Checklist: the 64px meter and the check boxes are the object, which is weak but interactive. "Paste and ship" with "Get Computer": the prompt card is the object. The right column is bare text (License / Source / "hanzoai/computer 3 stars" / "Deploy to Cloud →") with no object. Band: text only (shared `x-band`).
4. **One ask, nothing floating, scale rhythm?** One ask, in the header, in Hanzo's words. Nothing floats over content on desktop. Rhythm is good: one big thing per screen (stage, then panel, then the 64px meter), the rest at 26 / 16 / 12px.
5. **Every hover and press answers, no jumps?**
   - Tabs: colour change on hover, scale 0.97 on press, the active tab underlined.
   - Chapter numbers: ink on hover, press scale about 0.985.
   - Checklist rows: background fills to `#fafafa` on hover.
   - Copy: inset fill on hover, scale 0.97 on press.
   - Text links: underline on hover, arrow nudged 4px.
   - "Try Hanzo Computer": background goes to `#fff`.

   No layout jump. The one gap is the hero ask: its hover only changes `#f5f5f7` to `#fff`, which you can barely see on black.
6. **Overlap, font swap, layout shift?** No overlap at either size. No font swap: h1 metrics are stable from the first rAF. CLS 0.0007. One focus problem: Tab stop 7 (checklist row 01) reported its box at y=1365 in a 801px viewport, 200ms after the keypress. The smooth scroll lags focus, so the focused row is briefly off screen. By stop 8 it is in view.
7. **Which reference, and is its motion there?** apple.com product page: one idea per screen in a pinned, scrubbed stage with a persistent ask. The pin and panel swap are really there. A touch of motion.dev in the switch flip and waveform. synchronized.studio is not present: no card opens into anything.
8. **Different from neighbours?** Partly.
   - `/operative` (same idea: a model driving a desktop) also uses a windowed desktop mock with a cursor as its hero, though on a light room and with a different layout.
   - `/agents` uses the same stage chrome: an `0N / 0N` counter plus a pause button on a dark card.

   The dark grid stage with two "legacy app" windows and the pinned three-panel scene are /computer's own. The family resemblance is visible.
9. **All 18 parts?** Mostly covered: one h1, `data-cta` on the hero, band and deploy asks, JS-off legible, reduced motion final state, 44px targets, pause control on the looping demo, copy equals display, tabs with roving tabindex. Gaps:
   - A page-owned console error (part 3 / DONE item 3).
   - No proof strip before the band (part 3, "end on one proof strip"). "3 stars" is the only proof and it argues against.
   - Hero hover too faint (part 8).
10. **Banned tells?** None found: no hue, no gradient text, no pill above a headline, no Inter, no cursor glow, no three equal boxes. The six-tab rail under the stage lists the same six topics that the pinned chapters and checklist then repeat. That reads as the same story told twice, not as clutter.
11. **Copy untouched?** Yes. Parity is OK (33/33 text, 4/4 links).

**Console error (page-owned, decides the score).** A React hydration mismatch on the hero `Stage` (`motion.div.cp-stage[data-morph-target]`):
- The server renders `style="opacity:0; transform-origin:50% 0%; transform:none"` and the client renders `opacity:1`.
- It reproduced in 2 of 2 reduced-motion loads and in 1 of 5 normal loads.
- Each time it raises the red "1 Issue" badge in the bottom-left corner of the screen (seen in my desktop walk and reduced-motion frames).
- The fix: render the same initial style on the server and the client. Decide reduced motion after mount, or use `initial={false}` together with a CSS-only entry.

## Fix list (to reach 8+), most important first
1. **Fix the hydration mismatch on the hero `Stage`** (`.cp-stage`, `data-morph-target`). The server's `opacity:0` style must equal the client's first render under both motion preferences. 0 console errors across 5 cold loads, reduced motion included.
2. **Give the second half its own motion.** The checklist plus "Paste and ship" run is static until touched. Ideas:
   - The `0 / 3` meter and its bar settle in once on arrival.
   - The checklist rows enter one by one as a list, not as three blocks.
   - "Paste and ship" types its prompt into the card once (time-based, then rests, with a final state under reduced motion) before Copy is offered.

   One time-based mover here would break the "goes quiet" feeling.
3. **"Get Computer" needs an object, and lose the anti-proof.** The right column of `.cp-ship` is four bare lines, and "3 stars" next to `hanzoai/computer` reads as weakness. If the star count stays, set it small and grey beneath the repo name rather than as the only figure. Better: give the column a small drawn object (a repo or terminal card from the existing "hanzoai/computer · Apache-2.0" facts).
4. **Hero ask hover:** `#f5f5f7` to `#fff` is invisible on black. Add a real hover answer, such as a magnetic shift up to 22px (deck-allowed, fine pointer only) or an arrow that slides in, plus press at scale 0.97 (currently the link has no pressed transform).
5. **Tab focus versus smooth scroll:** stop the smooth-scroll handler from fighting native focus scrolling, so a focused checklist row is in view on the same frame (`scroll-padding-top` is header + 16px).
6. **Trim the double telling.** The six-label tab rail under the hero stage repeats the six chapter or checklist headings that follow. Keep the rail as the stage index, but let the pinned chapters carry the detail. Or shorten the rail on desktop to the `01 / 06` counter plus dots, as the phone already nearly does.
7. **The stray glyph behind "The desktop tool from 2009" window** (a `</>`-like mark peeking above its title bar at about x 900–960, y 515 at 1470×801) looks like an accident. Either show it fully or hide it.

## Shared chrome
- **Phone, first screen:** the header "Try Hanzo" is a white solid fill while the hero "Try Hanzo Computer" is also a white solid fill. That is two solid fills in one viewport. Desktop correctly keeps the header outlined until the hero ask leaves.
- **Phone mobile ask bar** ("Try Hanzo Computer", outlined, at the bottom of the screen) appears together with the header's filled "Try Hanzo": two asks with different labels.
- **The cookie card on phone** covers the hero stage's tab rail and part of the stage (bottom 210px) until dismissed. "Reject all" has equal weight.
- **Band** (`.x-band`): 692px of black with the content centred and about 180px empty above and below. It feels padded rather than like a closing moment.
- The dev overlay "1 Issue" badge comes from the page's own hydration error above, not from shared chrome.
