# /zen/models — James-eye review

Verdict: 7/10
First complaint: "I've seen that black ball on the other pages already, and then it goes white and empty for three screens with one number on it. It feels like a slideshow, not a catalogue. On my phone it's just a black box of text."

Walked with Playwright in Chromium against the dev server, moving, not from screenshots alone. At 1470x801 (desktop) I recorded video and took frame bursts while wheel-scrolling in 100px notches with a 140 ms dwell, top to footer (6977px). At 375x812 (isMobile, hasTouch, DPR 2) I did the same (8524px). On desktop I hovered and pressed the hero ask, Explore Models, the film pause, the model= picks, Copy, every tier and sort pill, a model card (tilt), the row "+" and a card click through to its page (Morph). On phone I tapped the sort and tier rails. I also checked: idle frames in the first second, horizontal overflow, the console, and reduced motion (final state, `getAnimations()` after 3 s). Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic/zen-models/

## What works
- **Alive within 1 s.** The h1 cuts in by line mask (52px, 2 lines) and the film loops behind it. The idle frames differed at 250 ms. The pause button works (video.paused true) and its hover fills at white 14%.
- **The motion mixes kinds; it is not only scroll.** Time: the Quick Start model name retypes itself. State: the tier and sort pills glide (layoutId), and the cards re-flow so the leader takes the tall card. Scroll: the pinned figures. Arrival: the h1 cut-in and the Morph. Pointer: the card tilt measured at about 3°. The Morph is real: the card grows to full-bleed black, then lands on /models/hanzo/zen5-pro.
- **The signature reads.** By size gives Pro, Mini, Coder, Default, Flash. By context re-orders both the cards and the sheet. The Ultra tier leaves one card. The sheet's total and active bars are a genuine "Beyond".
- The SPEC-style black cards (20px radius, Sigil contour art, tier pill bottom-left) look right, and the Sigil drifts at idle.
- **Reduced motion shows the final state.** The figures become a plain list, the bars sit at their full values, the video is paused, and 0 animations remain after 3 s.
- **No horizontal page scroll at 375.** The code block and tier rail scroll inside themselves (`overflow-x:auto`).
- Every hover changes more than opacity: the CTA's fill (#f5f5f7 to #fff), a pick's fill (#fff to #f5f5f5), the colour on the sort pills. Press scales the ask to 0.98.
- No hue in the UI. The copy matches live: "$0 / $0" and "Zen5 -- Agentic Frontier" are in content/live/zen/models.json.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The Quick Start typer snaps back to the old name, and Copy copies a name the code does not show.** Sampled every 150 ms: `zen6-flas` became `zen6` the instant the pressed pill moved to zen6-flash, and stayed `zen6` for about 2.4 s. Later the code read `zen6-flash` while the pill and the clipboard said `zen5-coder`. The cause is the effect cleanup in `Quick()`, `return () => { clearTimeout(t); el.textContent = from; }`. It runs after `setM(toI)` and writes the old name back. This breaks MASTER part 4, "copy equals display".
   - Fix in `components/pages/model/ZenCatalog.jsx`: in the cleanup, only clear the timeout. Set `el.textContent = NAMES[m]` at the start of the effect body, not in the cleanup.
   - Better: render the slot from state (`typed` string state) instead of writing to the DOM.
2. **Dead white screens in the pinned figures.** `.zc-figs[data-live]` is 300svh, holding one 112px figure and a small index on an otherwise empty white stage. At entry (scroll y≈2000) the screen was about 70% blank. Nothing in the scene moves unless you scroll, so it reads as a slideshow. There is a second blank band of about 250px between the sheet and the closing Band.
   - Fix in `ZenCatalog.css`: cut it to about 200svh.
   - Fix in `ZenCatalog.jsx`: give the stage a real object tied to the figure. For example, the Sigil from the closing section, seeded per figure and redrawing as `at` changes. Or the five Zen5 bars, re-scaling to the active figure.
   - Pull `.zc-end` up so the sheet and the Band overlap per MASTER part 3 (40px).
3. **The hero film is the shared sphere film, and it sits in a box.** `/models/zen.webm` also appears in Enterprise, BlogIndex, Learn, Jin, Commerce and ZenMax, and on the zen5-pro page this card opens into. So the hero is not this page's own medium (JAMES rule 8, variation). The `.zc-frame` also stays a rounded 24px card inside the gutters for good.
   - Use the Zen5 card grid's Sigil field, or a montage of the five model cards, as the hero object.
   - Or at least let `.zc-frame` open to full width as it scrolls (MASTER 3.1, black room: "enters as a rounded card … opens to full width"), e.g. animate border-radius and inset with `useScroll` on the stage.
4. **The phone first screen has no hero object.** At 375x812 the frame is all type: h1 (44px, 3 lines), badge, a 7-line lede, two asks. The sphere starts below the fold (only visible after about 500px of scroll), against MASTER part 3, "80px+ of product inside 660px".
   - Fix in the `@media (max-width: 899px)` block of `ZenCatalog.css`: give `.zc-filmbox` a top band of about 30svh above `.zc-frame-in` (stacked, not behind the text), or crop `object-position` so the sphere sits at the top.
5. **Two solid asks with different words on phone.** The header shows a solid black "Try Hanzo", and the hero shows a solid white "Get API key". On desktop the header swaps to "Get API key" once the hero leaves view; on phone it never swaps. The header is shared chrome, so:
   - write `docs/requests/zen-models.md` asking for the phone header ask to follow the page's `data-cta` primary;
   - until then, make the hero Get API key read as the single solid on phone.
6. **The tier rail looks broken.** "ULTRA MAX 0" and "PRO MAX 0" render struck-through, which reads as an error. At 375 the rail cuts "PRO" mid-word with no peek cue (MASTER part 8: 14 to 18% peek).
   - Fix in `ZenCatalog.jsx`: hide tiers with `count(t) === 0`, or keep them as plain quiet text with no line-through.
   - Fix in `ZenCatalog.css`: under 900px give `.zc-seg` `scroll-snap-type:x proximity` and a right-edge fade/peek.
7. **Hover tells you nothing new.** The card hover is tilt only, sheet rows get no hover fill (rgba 0 on hover), and the sort pills change colour only. JAMES rule 4: the hover detail should tell you something.
   - On card hover, reveal the sheet's total/active bar for that model inside the card's bottom edge.
   - Give `.zc-li .zc-row` a `#f5f5f5` hover fill that also lights its row bars.
8. **A one-off console error on a cold load.** A React hydration-mismatch error (and the red "1 issue" badge) appeared on the first two fresh loads, desktop and phone, but not in 7 later loads, so it is likely first-compile. Re-check on a cold build. If it recurs, look at the server/client branches in `Stage`, the `Film` and `Sigil` seeds, and the `useStage()` `data-live` attribute.
