# /gallery — James-eye review
Verdict: 6/10
First complaint: "It's a gallery and what's hanging is words in grey boxes, and most of them are faded out like they're switched off. Then on my phone the bit under the wall keeps jumping up and down while I'm reading it, all by itself."

Walked 7 Nov 15:55–16:31 UTC, HEAD `2b6f82fd` → `a070a06d` (HEAD moved during the walk; the page files did not, last changed in `07eea078`), at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320, reduced motion and JS off. api.hanzo.ai was blocked. No form or message was sent.

## What works
- **Real Hanzo media leads the wall.** The black "Start from a Working App" plaque plays Hanzo's own `zen.webm` over `zen.webp`. It is the only video on the page, and it is on the first screen at both sizes (phone: plaque top at y=498 of 812).
- **The light reads now.**
  - Unlit renders rest at opacity .42 and the lit one goes to 1, lifting 4px. The plaque reads out the lit template.
  - Steps measured every 2.8 s with no input: 0→1→2→3.
  - On hover the light holds: it stayed on frame 05 for 3.2 s.
  - The page pause stops the film, the light and the stage. Under reduced motion, 0 animations after 3.5 s and the screen is still.
- **The viewer is better.**
  - It opens from the clicked frame (600 ms), carries "Browse the Gallery" (`gallery.viewer`), and steps with ←/→.
  - Esc returns focus to the frame (`xga-f4`).
  - A plain open and close is clean.
- **Fixes since the last review:**
  - The typed prompt no longer shifts the page. Its shifts measured 0 at both sizes because the ghost text holds the box.
  - `data-cursor=""` (no cursor label), 0 targets under 44px in `<main>` at 375, scrollWidth 320 at 320.
  - `taste.py` OK, `parity.py` 32/32 text and 5/5 links.
- **Hover and press:**
  - Hero ask: fill #0a0a0a→#2c2c2e, magnetic, press scale .98.
  - Frames: press .98.
  - Move rows: 4% fill on hover.
  - Links: underline and arrow, press 1px.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?**
   - **Desktop:** yes on motion. The film plays and the frames rise. Idle frame-diff was 7/7 changes over 3.2 s.
   - **Selling:** half. The h1 is just "Gallery", and the "templates" are typographic wireframes, not apps.
   - **Phone:** the plaque and film move on the first screen. Idle diff 7/7.
2. **One in, one out, or a document?** Better than a document, still not a scene.
   - The wall Settles (scale 1.04→1, the only scroll move).
   - The Moves stage changes by itself every 3.2 s (0→1→2 measured).
   - Then a prompt types once, then a dark close.
   - Nothing is pinned and nothing leaves as the next thing arrives.
3. **A real object in every section?** Yes as objects, weak as pictures.
   - Wall: the Zen film plus six renders. Moves: a browser window that changes state. Paste: the prompt box. Close: the wall in miniature.
   - Every render, though, is chips, bullets and a pill made of Hanzo's words. In the Moves stage that leaves a 1:2 black panel with four lines of text in it.
4. **One ask, nothing floating, scale rhythm?**
   - **Desktop:** yes. One solid on the first screen (the header turns to outline about 0.4 s after arrival). Mid-page the header carries "Browse the Gallery" solid. No floating bar.
   - **Phone:** two solids on the first screen: header "Try Hanzo" (#0a0a0a) and hero "Browse the Gallery". In the close the header "Try Hanzo" sits above the band's light-solid "Browse the Gallery", so two solid asks with different words.
   - **Scale:** h1 52, h2 26, h3 17. The wall is the big thing, and it shrinks as you scroll.
   - The viewer title, though, is 17px in an 1100px sheet: the `.xga-view-copy h3` clamp(32–44px) is overridden by the `.gx h3 !important` rule in Rhythm.css. The viewer's copy column is mostly empty white.
5. **Every hover and press answers, no jumps?** Mostly.
   - Closing after stepping still jumps (filmed: open 02, → to 03, Esc):
     1. A see-through double exposure of the 03 render, the viewer text and the hero.
     2. Then frame 02 flies back oversized over the hero ask and frame 01, while the plaque already reads 03.
     3. Content swaps 03→02 mid-flight.
   - The frame-open has no sound (no `data-sound="whoosh"`).
6. **Overlap, font swap, layout shift?**
   - **Phone layout shift with no input:** each Moves auto-step animates `grid-template-rows`, so the list height changes and the stage under it moves (stage y 516→452→500). Measured CLS per step: 0.071, 0.028 and 0.035, about 0.13 per 9.6 s cycle, repeating while in view. Desktop: about 0.005 per cycle.
   - **Phone close overlap:** the miniature wall's odd tiles (`translateY(14px)`) overlap the row below by 4px (m0/m3 and m2/m5), and their text is clipped mid-phrase ("ship a branded").
   - **Phone viewer on first visit:** the shared cookie card (z 980, 203px) covers the viewer's ‹ › × and its "Browse the Gallery" link. `elementFromPoint` on × lands in `.x-cookie`.
   - **No font swap.** The h1 box holds.
7. **Reference?**
   - osply/hamol in the salon hang and the hover-held light: present.
   - synchronized.studio in the frame-to-viewer morph: present for a plain open, broken after stepping, and it opens into a modal, not a page.
   - apple: no pinned or scrubbed scene.
8. **Different from neighbours?** Half.
   - The first screen is the same composition as /templates (filmed side by side):
     - a 52px title top-left with a mono caption under it;
     - a lede and a solid ask to the right;
     - a 28px-radius grey stage from y≈335–350.
   - /tabs differs. The salon hang and walking light are this page's own.
9. **18 parts covered?** Mostly. The card has three false or stale claims (below).
   - The dialog is not native, and the card admits it.
   - Motion animates layout (`grid-template-rows`), which part 8 forbids.
   - Frames, the Moves window and the prompt box are raised with shadows (part 7: tiles are flat).
10. **Banned tells?**
    - **Yes:** layout shift (phone Moves, no input) and overlap in motion (the close after stepping).
    - **None of these:** hue (taste OK; the Zen film is monochrome), label above a headline ("gallery.hanzo.ai" sits under the h1), fading buttons, cursor label, three equal boxes, or default controls.
11. **Copy untouched?** Yes. Parity is 32/32 text and 5/5 links. The renders are aria-hidden fragments of Hanzo's own sentences. The open copy question ("Image + video gallery" against "Curated template showcase") is correctly left for James.

## Card check (docs/coverage/gallery.md)
- **True:**
  - header comment with Persona, Goal, CTA, metric, Signature, Beyond;
  - parity 32/32 and 5/5;
  - taste OK, and the radii (20, 12, 28, 24) are as stated;
  - 0 targets under 44px in `<main>` at 375, and scrollWidth 320 at 320;
  - the Zen plaque is on the phone's first screen;
  - frames press .98 and links 1px;
  - one video;
  - the pause stops the film, light and stage;
  - reduced motion is final and still;
  - JS off is legible: h1, all h2 and h3 at opacity 1;
  - the typed prompt never changes height (0 shift);
  - the `rel` and hidden "(opens in a new tab)" on "hanzoai";
  - no `setInterval`.
- **False:**
  - Part 15 says the viewer "closes back into it, with no hole and no frame crossing its neighbours". After stepping, frame 02 crosses the hero and frame 01, over a double exposure (frames `d2-close-0..2`).
- **Stale or false:**
  - Part 4 says "Sticky ask in header and bar after the hero". No bar exists. The only fixed layers on desktop mid-page are the skip link, the progress bar, the header and the cookie card.
  - Part 13 says "CLS 0.0007 desktop, 0.0001 phone". That is true for a scroll walk, but the phone Moves section shifts by itself (about 0.13 per cycle), which the card does not mention.
- **Overclaim:** part 1 says "One solid fill per viewport". It is false at 375: header "Try Hanzo" and the hero ask are both solid.
- **Minor:**
  - The card names `docs/requests/gallery.md`, which does not exist.
  - Part 17 says "0 console errors". 1 of 10 loads (the first, cold) showed a hydration-mismatch console error and the red "1 Issue" badge. 9 later loads were clean.
- A false claim caps the verdict at 7.

## Fixes (in order)
1. **Stop the phone Moves jumping.**
   - In `Gallery.css`, drop the `grid-template-rows` transition on `.xga-move-x`.
   - Give `.xga-moves-l` a fixed height: the tallest open state, with all three `.xga-move-x` stacked in one grid cell, showing the active one by `opacity` and `clip-path`.
   - Or, under 900px, put `.xga-moves-obj` above the list, so the auto-step never moves content below.
   - Target: 0 shift with no input.
2. **Fix the close after stepping.**
   - In `close()`, set `setLit(from)`, not `setLit(open)`.
   - Morph the `.xga-view-in` box only, and fade the viewer body out (opacity 0, 150 ms) before the layout flight.
   - Or, on ←/→, move `from` with `at`, so the frame flown home is the one shown.
   - Nothing should cross the hero ask or neighbours as a different template.
3. **Make the hung pieces read as apps, not word lists.**
   - Raise the unlit renders from opacity .42 to about .7, and dim with a `#f2f2f2` veil, so they don't look disabled.
   - Give each render one more piece of real UI chrome from its own words: a title bar with the template name, the deploy button's pressed state, PR title row.
   - In the Moves stage, scale the render to fill the 1:2 panel (`.xga-moves-st .xga-r { zoom: 2 }`, or lay the render out to the panel's width) so it is not four lines in a black void.
4. **The viewer has the weight of a page.**
   - Exempt `.xga-view-copy h3` from the 17px rest rule: it is the moment, so 44px as the CSS intends. Use a page-local selector `.gx .xga-view-copy h3` with matching specificity, or request the Rhythm exception.
   - Fill the right column: the template's full sentence at 21px, then the ask.
   - Add `data-sound="whoosh"` on `.xga-frame`.
5. **Phone layers.**
   - While the viewer is open, hide the shared cookie card or raise the viewer over it, so × and the ask are reachable. Request it from the Ask/HeaderTools owner, and meanwhile put the nav at the viewer's top on phone (`.xga-view-nav { top: 12px; bottom: auto }` under 899px).
   - Remove `.xga-mini-f:nth-child(odd) { transform: translateY(14px) }` under 899px, or add `row-gap: 24px`, so the miniature tiles stop overlapping.
6. **One ask on phone.** Request that the shared header ask swap to "Browse the Gallery" and go outline while the hero ask or band ask is on screen, as it does on desktop.
7. **Differ from /templates.** Change the first-screen composition rather than sharing the Business 2 head. For example:
   - put the h1 and lede on the wall itself, as the plaque's caption line;
   - or start the wall at y≈200 with the title as a museum label at the wall's bottom-left.
8. **Card housekeeping.**
   - Correct parts 1, 4, 13 and 15 as above.
   - Remove the `docs/requests/gallery.md` reference or create the file.
   - Change the "V2: 8/10" self-score line once a critic scores 8.
