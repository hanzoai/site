# /ide — James-eye review
Verdict: 6/10
First complaint: "Three grey boxes in a row, twice: the memory tiers and then CLI, Playground, Desktop. That's the template look I said no to, and the arrow is jammed right into 'Playground'. And turn JavaScript off and the editor sits on top of the headline and the button."
(Walked 7 Nov 16:16 UTC, HEAD `c73ec2f5`, at 1470×801 (fine pointer) and 375×812 (isMobile, hasTouch), plus 320×700, 375×667, reduced motion and JS off. Frames are in the critic's scratch folder; nothing was added to the repo.)

## What works
- The hero is the product. The h1 is cut in by line mask, and at 400 ms you can see it rising. A live editor running Hanzo's own start script sits under the ask. Memories (episodic, semantic, procedural) surface in its gutter, and the agent panel runs "deploy the gateway to staging". Two screenshots 1 s apart differ with no input, on both sizes.
- The dark room is the best screen on the page. The orbiting tiers have a working Pause (hover lifts the fill from #171717 to #262626 and the border from 14% to 30% white), and the accordion rows brighten on hover (#a1a1a6 to #f5f5f7) and press to .99.
- The header ask swaps on desktop. It reads "Try Hanzo" at the top, then a solid "Open the IDE" once you scroll, and it turns white in the dark room. The primary darkens on hover (#0a0a0a to #2c2c2e) and presses to .98. The related cards lift 4px on hover. Copy puts the exact displayed prompt on the clipboard (verified by reading it back).
- CLS 0.0004 on desktop (only the header tools) and 0 on phone. With reduced motion, 0 animations are running after 3.5 s and the top screen is still. Scroll width at 320 is 320.
- `taste.py` passes on both files. Parity is 75/75 text and 10/10 links.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The h1 (52px), lede, "Open the IDE" and the editor all fit 1470×801. The editor moves untouched.
2. **One in, one out, or a document?** Mostly a scene: stage, then planes, then three pinned chapters, then "Tell it something", then the dark room. Three moments read as a document:
   - The "Paste and ship" strip, a row of form text right after the hero.
   - About 250px of empty white before "The workbench you know" and again before the memory demo.
   - "Open it in the browser, or build it on your machine": a small heading floating in a 560px-wide void beside a terminal that is still typing line 10 after 6 s.
3. **A real object in every section?** Yes: editor, planes, call graph, sandbox, memory cards, orbit, terminal, the Get IDE card, the related cards.
4. **One ask, sticky; scale rhythm?**
   - Desktop: yes, the header swaps to "Open the IDE".
   - Phone: the header says solid "Try Hanzo" at y = 0, 900, 3000 and 6000, and no ask bar ever rises, even after cookies are rejected. So the first phone screen has two solid fills ("Try Hanzo" and "Open the IDE"), and the page's own ask never sticks. This is shared, but real.
   - Scale has rhythm: 52 / 32 / 26 headings, and one 88px statement in the Band.
5. **Every hover and press answers?** No. These show no hover change:
   - the editor's Pause (`.ide-pause` in the stage: colour #a3a3a3, transparent before and after);
   - the memory kind radios ("what happened", "what is true about the project", "how things are done here");
   - the plane chips (those are decorative, which is fine).
6. **Overlaps, font swap, layout shift?**
   - Overlap at rest: in the related card, the "Playground" title and its arrow touch, with a measured gap of 0px. The CLI gap is 47px and Desktop 17px.
   - JS off: the editor overlaps the h1, the lede and the primary. `elementFromPoint` at the centre of "Open the IDE" returns `li.k3` from the editor, so the ask cannot be clicked.
   - In the first walk the dev overlay showed a red "1 Issue" badge in every frame on both sizes. It was a hydration attribute mismatch (`console.error`). It did not recur in 9 later loads, so it is intermittent, but it is real.
   - No font swap; CLS is about 0.
7. **Which reference, is its motion there?** Apple product page: the stage settles, there are pinned chapters, and one statement closes the page. Yes. synchronized.studio: the related cards carry `data-morph`. Present.
8. **Different from neighbours?** Yes. The hero is a self-running editor with a memory gutter, not the /cli or /desktop window. The tab row "IDE · CLI · Playground · Desktop · API Keys" now sits in the close as Hanzo's link row, not in the editor.
9. **18 parts?** The card is complete in form, but some ticks are false (see below).
10. **Banned tells?** Yes, two cases of "three equal boxes in a row":
    - the memory tier cards `.ide-teach-g` (`repeat(3, 1fr)`, measured 368×240 ×3);
    - the related cards CLI / Playground / Desktop (223×168 ×3).

    Smaller breaks:
    - `.ide-mem-w` animates `max-width`, and part 8 bans animating width.
    - `.ide-mem-k` sets lowercase mono labels at 11.5px, under the 13px floor.
    - Off-deck greys are hard-coded in `IdePage.css`: #26262c, #e9e9ec, #86868b, #c5c5c5, #bababa, #b6b6b6.
11. **Copy untouched?** Yes (parity is clean).

## Card check (`docs/coverage/ide.md`)
- **Part 3, false:** "JS off: legible … 0 hidden text blocks". With JS off, the editor covers the h1, the lede and the primary, and 13 of 99 text blocks are hidden: the chapter visuals `.a2-ch-vis`, the `.ide-pic-chip` labels and the sandbox list. A false claim caps the verdict at 7.
- **Part 4, false on phone:** "Sticky ask in header and bar after the hero, same label". At 375 the header stays "Try Hanzo" and there is no bar (shared). It is true on desktop.
- **Part 8, false:** "Every control has hover…". The editor Pause and the three memory kind radios do not change on hover.
- **Part 6, partly false:** "No text under 13px except mono capitals". `.ide-mem-k` is 11.5px lowercase.
- **Part 11, partly false:** "Every target 44px". At 375 the editor's gutter memories ("episodic what happened" and the others) are focusable at 102–118 × 28px.
- **Part 17 / 3, partly false:** "no console errors". A hydration mismatch fired on the first walk (intermittent).
- **True:** one h1; the h1 and editor are in the server HTML; parity is clean; `taste.py` passes; reduced motion shows the final state; no horizontal scroll at 320; the ask's bottom edge is at 520px on 375×667; Copy copies exactly what it shows; `data-cta="ide.hero"` and `data-thumb` are on the primary; the related cards Morph.
- **Honest gaps, already unticked:** `lib/cta.js`, `PageHero`, kit tables and code, the icon set, budgets, `CodeBlock`, an error boundary, the review at 8 or more.

## Fixes (in order)
1. **Break the three equal boxes.**
   - `.ide-teach-g`: make it one wide card and two narrow ones, for example `grid-template-columns: minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)` with the episodic card the tallest. Or make it a single sheet with three rows divided by 1px hairlines.
   - Related cards (`.ide-rel-a` big cards): use 8/5 asymmetry (CLI large, Playground and Desktop stacked small), or a hairline list of three 72px rows with the glyph as the hover preview.
2. **Fix the arrow collision.** Inside the card, give `.ide-rel-a b` `flex: 1` and `.ide-rel-i` `margin-left: auto`, so every arrow sits at the right edge with an equal gap (currently 47 / 0 / 17px).
3. **Make JS off safe.**
   - Add `html:not(.js) .ide-stage{height:auto} html:not(.js) .ide-stick{position:static;height:auto;display:block} html:not(.js) .ide-obj{transform:none!important;margin:48px auto 0}`, so the editor sits below the ask and does not cover it.
   - Add `html:not(.js) .a2-ch-vis, html:not(.js) .ide-pic-chip{opacity:1!important;visibility:visible!important}`.
   - Re-measure until 0 hidden text blocks remain and `elementFromPoint` on the primary returns the primary.
4. **Make the last controls answer hover.**
   - `@media (hover:hover){ .ide-pause:hover{color:#fafafa;background:rgba(255,255,255,.08)} }`.
   - For the memory kind radios (`.ide-teach-f [role=radio]`): on hover, a border of black 30% and the `#f5f5f5` fill.
5. **Find the hydration mismatch.** Look for anything in `Stage`/`Editor` that reads `useNarrow`, `matchMedia`, time or random values during render, and move it into `useEffect`, so the dev overlay never shows "1 Issue".
6. **Stop animating width.** Replace the `.ide-mem-w` `max-width` transition with `clip-path: inset(0 100% 0 0)` → `inset(0)` (or a transform), and raise `.ide-mem-k` to 12px (with mono capitals) or 13px.
7. **Close the dead air.**
   - Cut the empty band above `.ide-engine` and above the "Tell it something" block to one section padding (about 116px), not two.
   - In `Start`, bottom-align the heading with the terminal (the 8/5 rule) and speed the typed script so it finishes within 3 s of the section entering view.
8. **Move the literal greys onto deck tokens.** Replace #26262c, #e9e9ec, #86868b, #c5c5c5, #bababa and #b6b6b6 with #262626, #e5e5e5, #737373 and white at 78% / 55% on black.
9. **Report the phone ask (shared).** In `docs/requests/ide.md`, note that at 375 the header keeps a solid "Try Hanzo" and no ask bar rises after the hero. Until it is fixed, untick the part 4 box for phone.
