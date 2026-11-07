# /gallery — James-eye review
Verdict: 6/10
First complaint: "I clicked a template, flicked to the next one with the arrow, closed it, and the old one came flying back huge across the top of the page with the other one still see-through behind it. And at the bottom on my phone the little windows are sitting on top of each other with the words cut off."

Walked 7 Nov 2026 (critic round 4), HEAD `28a731ae`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×640, 375×667, reduced motion and JS off. api.hanzo.ai was blocked; no form or message was sent.

## What works
- **The round-3 phone trap is fixed.**
  - The viewer's × (307,36, 44×44) now hit-tests as the button.
  - A tap closes the viewer and the URL stays `/gallery/`.
  - ‹ › × sit at the top of the sheet, clear of the header.
- **The phone header is fixed.** It keeps "Try Hanzo" (x 262–352), with nothing clipped. It is outlined while the hero ask shows and solid after.
- **The tiles are flat.** Frames carry only a 1px inset line at black 6%. The lit frame gets a 1.5px ink inset line.
- **Alive with no input.**
  - 8 of 8 idle frames differed at both sizes.
  - The plaque steps 01→02→03 about every 2.8 s, and the Zen film plays.
- **Hover holds the light.** Pointing at frame 05 held "05 / 06 Searchable" on the plaque for 3.5 s.
- **The hero ask answers.** It goes #0a0a0a→#2c2c2e on hover and scales to .98 on press, with no opacity change. The move rows take a 4% fill on hover.
- **The viewer has weight.**
  - The h3 is 44px, with an index to jump between templates.
  - Tab stayed inside it for 14 of 14 presses.
  - Esc returns focus to `#xga-f2`.
  - A plain open (`g/d-open3.png`) is clean.
- **Copy is exact.** The clipboard got "Read https://hanzo.ai/skill.md and use Hanzo Gallery in my project."
- **Edge cases pass.**
  - Reduced motion: 0 running animations, 1 distinct frame out of 4, and the video paused.
  - JS off: h1 present, 0 headings, paragraphs or frames below opacity 1.
  - At 320 the scrollWidth is 320.
  - 0 targets under 44px in `<main>` at 375.
  - The ask's box is 312–365 on 375×667.
- **CLS:** 0.0007 on desktop and 0.0012 on phone over a full walk.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes.
   - The h1 "Gallery" is 52px at y 236 on desktop, with the ask at 265.
   - The Zen plaque and six app-shaped frames are on the first screen.
   - The frames change from the first burst on.
2. **One in, one out?** Partly. The wall, the Moves stage, the prompt and the dark close are four distinct rooms. Nothing is pinned or exits as the next arrives, so it still scrolls as stacked sections. The prompt room is mostly empty white at 1470: one typed line in a ~830×340 box.
3. **A real object in every section?** Yes: the film plus frames, the browser window (repo, deploy, PR), the prompt box and the wall in miniature.
4. **One ask, nothing floating, rhythm?** Yes.
   - Desktop has one solid per screen: the hero, then the header's "Browse the Gallery" mid-page, outlined again at the dark close. There is no floating bar.
   - Scale steps h1 52, h2 26, viewer h3 44.
   - One blip: on the first arrival frame (300 ms) the header's "Try Hanzo" is still solid beside the hero ask, until `usePhoneAsk` runs (`f/d-arr0.png`).
5. **Every hover and press answers, no jumps?** No.
   - **Desktop: open 03, → to 04, Esc.**
     - At 80 ms, "Open Source" fades at full viewer size while frame 03 flies back oversized (about 930×500, stretched type) over the hero lede, the ask and the plaque (`g/d-close0.png`).
     - Frame f2 measures 470×164 against its 460×156 slot at that moment.
     - It then lands on 03 lit, not 04.
   - **Phone:** the same flow closes almost cleanly. A faint ghost of frame 01's text shows (`g/m-close0.png`).
6. **Overlap, font swap, layout shift?** No font swap, and CLS is fine. Overlaps remain:
   - **Phone dark close, the miniature wall:** tiles [0,3] and [2,5] still overlap by 108×4px (`g/m-mini.png`). The renders are clipped: the m0 chips are cut at the top, "ship a branded" is cut mid-line, and the m4 chrome dots sit over "Filter by".
   - **Desktop:** the stepped-close flight above.
7. **Reference?**
   - osply/hamol: the salon hang and the hover-held light are present.
   - synchronized.studio: the morph works on a plain open and close, but is broken after stepping.
   - apple: no pinned or scrubbed scene.
8. **Different from neighbours?** Yes: a wall-hung title, a film plaque and a walking light. It is unlike /templates.
9. **18 parts?** Mostly, but:
   - the viewer is a `role=dialog` div, not native `<dialog>` (honestly unticked on the card);
   - there is no kit `Band` or `PageHero` (also unticked);
   - parts 11, 15 and 17 make false claims (below).
10. **Banned tells?**
    - **Yes:** overlap (the phone mini wall; the desktop frame flying over the hero after stepping). The dev "1 Issue" red badge (a hydration mismatch) shows on cold loads.
    - **No:** hue, eyebrow over a headline, fading buttons, cursor label, three equal boxes, or default controls.
11. **Copy untouched?** Yes. The renders are aria-hidden fragments of Hanzo's sentences. The open copy question is left for James.

## Card check (docs/coverage/gallery.md)
- **True:**
  - header comment with metric;
  - one h1, nothing above it;
  - one solid per screen;
  - `data-cta` gallery.hero, gallery.viewer, gallery.close;
  - copy equals display;
  - flat tiles;
  - focus trap, and Esc returns focus to the frame;
  - phone viewer above the header, and × closes it;
  - 0 targets under 44px;
  - scrollWidth 320;
  - ask above the fold at 375×667;
  - one video;
  - pause stops the film and light;
  - reduced motion is final;
  - JS off is legible;
  - CLS small (measured 0.0007 and 0.0012);
  - parity claims not contradicted.
- **False:**
  - **Part 15** says that after stepping "it closes by a plain fade … no frame flies from a stale box (round 3 … the wall is still)". Measured at 80 ms after Esc, frame 03 flies oversized across the hero, over a see-through "Open Source" viewer (`g/d-close0.png`).
  - **Part 11 and the commit message** say "375×812 … no overlap" and "phone mini wall gap". The mini tiles [0,3] and [2,5] still overlap 4px, with clipped renders.
- **Partly false:** part 17 says "0 console errors … not reproduced here". The hydration-mismatch console error and the red "1 Issue" badge appeared on the first load at both sizes in my walk (2 of 7 loads; the later 5 were clean). Its source is unproven, but it is visible on this page.
- A false claim caps the verdict at 7. The repeated stepped-close flight and the phone overlap, both banned tells, take it to 6.

## Fixes (in order)
1. **Stepped close must not fly** (`Gallery.jsx`, Wall/Viewer).
   - When `open !== from` at close time, drop the `layoutId` from both the viewer card and every `.xga-frame` before the exit starts. Set a `noMorph` state synchronously in `close()`, then render `layoutId={noMorph ? undefined : ...}`.
   - Restore it only in `AnimatePresence onExitComplete`.
   - Close with `opacity 1→0` on `.xga-view-in` (250 ms, ease-out) and no scale.
   - Land the light on the template you closed from: `setLit(open)`, i.e. 04, not the original 03.
   - Verify: in frames at 40/80/160/240 ms after Esc, every `.xga-frame` matches its slot ±2px, and nothing crosses y < 360.
2. **Phone mini wall** (`Gallery.css`, `@media (max-width: 899px)`).
   - `.xga-mini { grid-template-columns: repeat(2, 1fr); row-gap: 12px; }`
   - Remove the stagger transform on the middle column (`.xga-mini > :nth-child(3n+2) { transform: none }`).
   - Give each tile a fixed height with `overflow: hidden` and the render top-aligned under the chrome dots (`padding-top: 28px`), so no chip or line is cut mid-phrase and the dots never sit on "Filter by".
   - Verify: 0 overlapping tile pairs.
3. **Hydration mismatch.**
   - Reproduce on a cold dev load (new context, first hit after a file save), read the full warning's diff, and remove the server/client difference.
   - Likely candidates are the `initial` y/opacity on `.xga-frame`, a `layoutId`-dependent attribute, or `usePhoneAsk` writing `html[data-pq]` before hydration (move it to `useEffect` only, which it already should be, and check that it doesn't touch the header's class).
   - If it is the shared footer, file it in `docs/requests/gallery.md` and say so on the card.
4. **First-frame double solid.** Set `html[data-pq]` (outline the header ask) from server HTML or a CSS default for this route, so "Try Hanzo" is never solid beside the hero ask at 0–300 ms.
5. **Prompt room** at 1470: shorten the `.xga-term` box to its content (min-height around 200px), or give it the paste-and-ship moment at a bigger scale, so it is not an 830×340 near-empty white box in a section of white.
6. **Card:** correct parts 11, 15 and 17 to what is measured above, and re-film the stepped close before claiming it.
