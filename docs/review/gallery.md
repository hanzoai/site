# /gallery — James-eye review
Verdict: 7/10
First complaint: "It's much better: the windows don't fly about any more. But when it loads there are two black buttons at the top fighting each other for a second. Then as I scroll it's still one block after another. Nothing comes in while something else goes out, and the prompt bit is mostly empty white."

Walked 7 Nov 2026 (critic round 5), HEAD `3ce53893`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×640, 375×667, reduced motion and JS off. Page files unchanged since `28a731ae`. api.hanzo.ai was blocked; no form or message was sent.

## What works
- **The round-4 stepped-close flight is fixed.**
  - Desktop flow: open 03, → to 04 ("Open Source"), Esc.
  - Every `.xga-frame` matched its slot to 0px at +17, 210, 373, 550, 700 and 855 ms.
  - The viewer fades out (opacity .85 → .09 → 0) with nothing flying (`f/d-close0..5.png`).
  - On phone, a tap on × gives the same clean fade (`f/m-close*.png`).
  - A plain open and close of 01 lands back to 0px.
- **The phone mini wall is fixed.**
  - 2 columns of 167×120 tiles, 12px gaps, 0 overlapping pairs.
  - 0 text spans clipped outside their tile.
  - On desktop it is 6 tiles of 130×112, staggered, with 0 overlaps.
- **The prompt box is shorter.** `.xga-term` is now 830×175 (it was about 340).
- **Alive with no input.**
  - 6 of 6 idle frames differed at both sizes.
  - The Zen film plays, the light walks 01→02 in about 2.8 s, and the Moves stage steps by itself.
- **Pointer, state and time all answer.**
  - Hovering frame 05 held "05 / 06" for 3.5 s. Leaving it resumes the walk.
  - The hero ask goes #0a0a0a→#2c2c2e with opacity 1 and presses at scale .98.
  - Move rows take a 4% fill on hover and press at .99.
  - The prompt types itself.
- **The pause control works.**
  - The 45px button has `aria-pressed`, and its label turns from Pause to Play.
  - It froze the plaque at 01, paused the video, and held the Moves stage for 7 s.
- **The viewer behaves.**
  - Tab stays inside it for 12 of 12 presses.
  - Esc returns focus to `#xga-f1`.
  - The clipboard got exactly "Read https://hanzo.ai/skill.md and use Hanzo Gallery in my project.", and the label turned to "Copied".
- **Edge cases pass.**
  - Reduced motion: 0 running animations, 1 distinct frame out of 4, and the video paused.
  - JS off: h1 "Gallery", with 0 headings, paragraphs or frames below opacity 1.
  - At 320 the scrollWidth is 320, `overflow-x: clip`, and nothing in `<main>` reaches past 321.
  - The ask's box is 311–365 on 375×667.
  - 0 targets under 44px in `<main>` at 375.
  - A 20-stop Tab crawl showed a ring on every stop.
- **CLS:** 0.0007 on desktop for the walk (0.0018 including viewer use), 0.0013 on phone. No font swap; the h1 is 52px desktop, 40px phone.
- **Scripts:** parity 32/32 text and 5/5 links; taste OK.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes.
   - The h1 is at y 236 with the ask at y 265 on desktop. The Zen plaque and six app-shaped frames are on the first screen.
   - On phone the plaque starts at y 446.
   - Frames differ from the first idle burst on.
2. **One in, one out?** Partly.
   - There are four distinct rooms: wall 977, moves 812, paste 499, dark close 510 px tall (desktop).
   - Nothing is pinned, scrubbed or exits as the next one arrives, so it still reads as stacked sections.
   - The paste room is 499px of white holding one 175px box and a two-line heading (`f/d-s2.png`).
   - On phone the wall alone is 1771px (2.2 screens).
3. **A real object in every section?** Yes: the film plaque plus 6 renders, the browser-window stage, the prompt box, and the wall in miniature.
4. **One ask, nothing floating, rhythm?** Mostly.
   - Once hydrated there is one solid per screen.
   - **Before hydration both sizes show the header's "Try Hanzo" solid beside the solid hero "Browse the Gallery"** (`f/d-arr0.png`, `f/m-arr0.png`). It lasted until about 1.46 s on desktop and 0.74 s on phone on this dev load, then turned outlined 35 ms after the first script frame.
   - Mid-page the desktop header carries "Browse the Gallery". On phone it stays solid "Try Hanzo", the fallback because the label does not fit.
   - Scale: h1 52, h2 26, viewer h3 44, with mono captions small.
   - The cookie card covers the phone viewer's index (shared chrome, already filed).
5. **Every hover and press answers, no jumps?** Yes, with two exceptions.
   - After stepping 03→04 and closing, the plaque reads "04 / 06", then flicks to "03 / 06", and the lit ring goes back to 03 (`f/d-close1.png` → `f/d-close4.png`). It lands on the frame you opened, not the one you were looking at.
   - The desktop Copy button is 75×30 (MASTER part 8 wants 44px).
6. **Overlap, font swap, layout shift?** No overlap measured at either size. No font swap. CLS is at most 0.0018. The dev "1 Issue" badge (a hydration-attribute mismatch) appeared on 2 of 13 loads, both at the start of my first walk; the later 11 were clean.
7. **Reference?**
   - osply/hamol: the salon hang and the hover-held light are present.
   - synchronized.studio: the frame grows into the viewer and shrinks back on a plain open; after stepping it fades.
   - apple: there is still no pinned or scrubbed scene.
8. **Different from neighbours?** Yes: a wall-hung title, a film plaque, a walking light and a miniature-wall close. It is unlike /templates.
9. **18 parts?** Mostly. Three are honestly unticked on the card:
   - no `PageHero`;
   - no kit `Band`;
   - the viewer is a `role=dialog` div, not native `<dialog>`.
10. **Banned tells?**
    - **No:** hue, eyebrow over a headline, gradient text, fading buttons, cursor label, three equal boxes, default controls or overlap.
    - Borderline: the pre-hydration double solid, and the intermittent dev error badge.
11. **Copy untouched?** Yes. Parity is 32/32 and 5/5. The renders are aria-hidden fragments of Hanzo's sentences. The open copy question is left for James.

## Card check (docs/coverage/gallery.md)
- **True:**
  - header comment and metric;
  - one h1 with nothing above it;
  - `data-cta` on gallery.hero, gallery.viewer and gallery.close;
  - copy equals display;
  - the focus trap, and Esc returns focus;
  - the pause control stops the film, the light and the stage;
  - reduced motion is final, and JS off is legible;
  - scrollWidth 320 at 320;
  - 0 targets under 44px in `<main>` at 375;
  - the ask above the fold at 375×667;
  - one video;
  - parity and taste;
  - part 15: the stepped close fades and every frame matches its slot to 0px (measured);
  - part 11: the 2-column mini wall of 167×120 tiles with 0 overlaps (measured);
  - CLS small (measured 0.0007 / 0.0013; the card says 0.0004 on phone, a trivial difference).
- **False:**
  - **Part 4** says phones show "'Browse the Gallery' after it" in the header.
  - Measured mid-page at 375, the header is solid "Try Hanzo". Part 11 of the same card says the header keeps "Try Hanzo".
  - The card contradicts itself, and part 4's claim is untrue.
- **Partly false:**
  - **Part 1** says "one solid per screen at both widths". In server HTML, before hydration, "Try Hanzo" is solid beside the hero ask at both sizes (`f/d-arr0.png`, `f/m-arr0.png`).
  - **Part 17** says the hydration warning is "not reproduced here". It reproduced on this page on 2 of 13 loads, with the red "1 Issue" badge.
- A false claim caps the verdict at 7. On the walk alone this is also about a 7: the big round-4 faults are gone, but the scroll is still a stack of sections with no pinned or in/out moment.

## Fixes (in order)
1. **Correct the card.**
   - Change part 4 to say the phone header keeps "Try Hanzo" (`usePhoneAsk` falls back because "Browse the Gallery" does not fit), outlined while the page's ask shows and solid after.
   - Change part 1 to say "after hydration", or fix item 2 and keep it.
   - Change part 17 to say "intermittent, 2 of 13 loads" and point to the shared request.
2. **No double solid before hydration.**
   - Outline the header ask from server HTML on this route, so it never depends on `usePhoneAsk`'s first `update()`.
   - Either render `<html data-pq>` from `app/gallery/page.jsx` (a server-set attribute on a wrapper the rule can match), or add a page-CSS default such as `body:has(main.xga) header[data-slot=masthead] a[data-x-ask] { background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1px rgb(0 0 0 / .14) }` (the same look as the `html[data-pq]` rule) that `usePhoneAsk` lifts once the hero ask has left view.
   - Verify: `f/d-arr0`-style frames at 0, 250 and 500 ms show one solid only.
3. **One in, one out between wall and Moves.**
   - Give `.xga-moves` an arrival tied to the wall leaving: the wall's last row scales to .96 and lifts while the Moves stage window rises 40px over it (40px overlap, per part 3).
   - Or pin `.xga-moves-obj` for one screen (`position: sticky; top: calc(var(--header) + 24px)`) while the three rows scroll past and drive `at` by scroll. The auto-step stays for idle.
   - Stack it under 900px.
4. **Paste room.**
   - Cut `.xga-paste` padding so the section is about 360px at 1470, not 499.
   - Or let the box arrive at a larger scale (the prompt line at 21px, the box min-height 200px) so the room is not a white plain with one line.
5. **Stepped close lands where you were.**
   - In `close()`, when `open !== from`, set `setLit(open)` and focus `#xga-f${open}` (not `from`), so the plaque never shows 04 then 03.
6. **Desktop Copy target.** Give `.xga-term .x-copy` `min-height: 44px; padding-inline: 14px` (it is 75×30 now).
7. **Hydration badge.** Reproduce on a first load after a dev rebuild and read the attribute diff. If it is the shared footer or header (seen on other pages), say so in `docs/requests/gallery.md` and on the card.
8. (Structural, already honest on the card.) Move the viewer to native `<dialog>.showModal()` when the kit `Sheet` lands, and swap the dark close to the kit `Band` once it can hold a second link and an object.
