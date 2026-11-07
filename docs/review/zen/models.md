# /zen/models — James-eye review

Verdict: 7/10
First complaint: "Where are the models? It's the same contour lines on the hero and on all five cards, then I click one and land on a sphere film I never saw on the catalogue. And the numbers section is a giant number with a giant drawing under it on every screen. That's two big things at once, not one."

I walked it with Playwright in Chromium against the dev server, moving, not from screenshots alone.
- **Desktop, 1470x801:**
  - I recorded video while wheel-scrolling in 100px notches with a 130 ms dwell, top to footer (5730px, 58 notches), keeping frames.
  - I stopped at each of the 5 pinned figures and dwelt 1.4 s on each.
- **Phone, 375x812 (isMobile, hasTouch, DPR 2):** I did the same walk (7798px), with video.
- **What I pressed on desktop:**
  - The hero ask (hover and press), Explore Models, the field pause (hover and press).
  - The Quick Start picks and Copy, then read the clipboard.
  - The "By size" pill (hover, then click), By context, the Ultra, Starter and All tiers, and Hanzo's order.
  - A model card: a pointer sweep for tilt and bars.
  - A sheet row: `+` to open, then close.
  - The lead card, clicking through into its page (Morph), then Back.
- **What I tapped on phone:** By size, then the card bars and the typer. Phone frames were kept.
- **What I checked:**
  - Idle frames at 100, 400, 800 and 1200 ms on both sizes.
  - Horizontal overflow at 375.
  - The console over 13 fresh loads.
  - Reduced motion: the final state, and `getAnimations()` after 3.2 s.
  - JS off.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/zen-models/

## What works
- **Alive within 1 s.**
  - Frames differ at 100, 400, 800 and 1200 ms on desktop and phone. The h1 cuts in by line mask at 52px (40px on phone, 3 lines).
  - The field pause holds the field: frames were identical after the press, and `aria-pressed=true`.
  - The black room opens from a rounded card to full width as you scroll.
- **The figures scene is now its own object, not a repeated field.** Each of the 5 figures cuts in at 112px Air with its own data drawing:
  - 18 marks, with the 5 Zen5 in ink and a wave running through them;
  - the Zen5 contexts on a 2M ruler, with a playhead sweeping it;
  - one inked cent of a 100-cell dollar, breathing;
  - the five Zen5 sizes, total against active;
  - 7 capsules filling in turn.

  The `01 / 05` index tracks the active figure. It is the best moment on the page, and it mixes scroll with idle motion.
- **The sort race is real and quick.**
  - By size gives Pro, Mini, Coder, Default, Flash. By context gives Pro, Coder, Default, Mini, Flash.
  - The leader takes the tall card, and the sheet re-orders with the cards.
  - Ultra leaves one 1201x452 card.
  - The pill hover now grows an #ededed pill under the label (::before opacity 0 to 1, scale .86 to 1).
- **The SPEC grid is honoured.** The computed columns are `385px 192px 192px 192px 192px` and the rows `220px 220px`. The leader is 385x452 and the others are 396x220. Cards are #000 with a 20px radius. The tilt measured `rotateX(2.45deg) rotateY(-2.57deg)` and goes flat on leave.
- **The card size bars now tell the truth.** On Zen5 Coder, total measured 47 of 168px (28%), as it should. On phone, where the bars always show, they read 144/19, 117/5, 41, 18/2 and 2/2 (px). That fixes last round's top complaint.
- **The Morph works.**
  - The lead card grows to full screen, then crossfades to /models/hanzo/zen5. The title lands on the destination h1.
  - Back returns to the same scroll (3028 = 3028).
- **Quick Start agrees with itself.**
  - On phone the typer stepped zen6, ze, zen6-, zen6-fla, zen6-flash, zen, zen5-c, zen5-coder. On desktop it holds while the pointer is over the block, by design.
  - After I picked zen5-coder, the clipboard held `model="zen5-coder"` and the button said "Copied".
- **The sheet is a good "Beyond".** Its bars are to scale, and the row hover wipes in an #f5f5f5 fill. `+` rotates and opens Hanzo's paragraph inline (the sheet grew from 383 to 487px).
- **Every tap answers.** The hero ask goes from #f5f5f7 to #fff, and press scales it to 0.98. The pause hover fills at white 14%. The picks fill #f5f5f5, and press is .97.
- **Reduced motion is clean.** `getAnimations()` is empty, the figures become a plain list (830px), and the h1 sits at rest.
- **The page holds up at the edges.**
  - JS off: legible.
  - At 375: no horizontal page scroll (scrollWidth 375). The tier rail peeks inside itself.
  - No hue anywhere in the page UI.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **There is no real Hanzo visual in the catalogue, and the Morph hands over the wrong picture.**
   - The hero and all five model cards are the same Sigil contour drawing (canvas on every card, measured). JAMES rules 2, 6 and 11 and SPEC.md say the card's media is the model's `.webm` looping over its `.webp` with a 0.6 s crossfade.
   - `/models/zen.webm` and `/models/zen.webp` exist in `public/`, and the destination page /models/hanzo/zen5 plays `zen.webm` (the sphere on ripples) as its hero.
   - So the card you click shows contours, and the page it opens into shows a sphere. The Morph does not hand over "the card you clicked" (synchronized.studio). It is also James's "too many repeats" again.
   - Fix in `ZenCatalog.jsx` `ModelCard`: render the kit `Film` with `src="/models/zen.webm"` and `poster="/models/zen.webp"` (IntersectionObserver play, at most 2 playing) in place of `<Sigil className="zc-mc-art">`, on the leader card at least.
   - Keep Sigil only as the fallback for any model without media. If all five must not share one film, give the leader the film and the four small cards the `.webp` still (Pic), so the picture you click is the one that lands.
2. **The figures scene is everything big at once.**
   - On each pinned screen a 112px figure sits over a drawing that fills roughly 450px of height. The 18 bars, the 100-cell grid and the 7 black capsules each take the whole right column. Two big things share each screen, with nothing medium or small beside them except the index.
   - The 7 capsules also say less than the number: they do not name the modalities.
   - Fix in `ZenCatalog.css`: cap `.zc-figs-art` at about 200 to 240px (`max-height`). Set the capsules at about 44px wide with a 12px Zen Mono caption under each, taken from words already in Hanzo's lede: language, code, vision, image, audio, retrieval.
   - Or let the figure shrink from 112px to 64px as its drawing grows in, so only one thing is the moment at a time (JAMES rule 1, "start big and shrink").
3. **Blank white bands at the top of the page.**
   - There is 84px of empty white between the header and the black hero card (the card starts at y=144).
   - On the first scroll there is about 160px of empty white between the hero's bottom edge and Quick Start (`.zc-sec` top padding at 11vw).
   - The page breathes in gaps here, where MASTER part 3 asks for objects that overlap by 40px.
   - Fix in `ZenCatalog.css`:
     - `.zc-stage { padding-top: 72px }` (or 27px plus the header height).
     - Give `.zc-quick` `padding-top: 72px; margin-top: -40px`, so the terminal rises under the hero's tail.
4. **The phone, after the hero, reads as a document.**
   - Below 900px the figures lose their drawings and become type only.
   - The shelf is five 220px contour cards stacked, about 1,160px of near-identical black.
   - Then a sheet of tall 4-line rows.
   - Fix in the `@media (max-width: 899px)` block:
     - Keep one figure drawing on phone (the 2M ruler fits at 375). Render `FigArt i={1}` statically under the 64px lead figure, which needs a small change in `Figures()` so the art renders when `!on`.
     - Make the four small cards a `scroll-snap-type: x proximity` rail with a 14 to 18% peek and the leader full width above it, or use 72px list rows for the four (MASTER part 15).
5. **The sheet legend breaks apart.** The header key wraps as "▬ TOTAL PARAMS ▬ / ACTIVE PER TOKEN ▬ CONTEXT", so the "active" swatch is stranded at the end of line 1, away from its label.
   - Fix in `ZenCatalog.jsx` and `ZenCatalog.css`: wrap each swatch and its label in a `<span style="white-space:nowrap">`, or give `.zc-key` its own row above the column heads.
6. **Small craft slips.**
   - "Explore Models ↓" nudges its down arrow 4px sideways on hover (`matrix(1,0,0,1,4,0)`). It should drop 3 to 4px on the y axis. Fix with a page-local override in `ZenCatalog.css`: `.zc-frame .x-arrow[href="#zen5"]:hover svg { transform: translateY(3px) }`.
   - With JS off, the black hero is an empty black slab with a dead pause button. Fix: give the stage a static SVG still of the field (or `zen.webp`) inside `<noscript>`, and hide `.zc-hold` under `html:not(.js)`.

Shared, not counted against the page:
- **An intermittent hydration mismatch with the red "1 Issue" badge.** It appeared on 1 of 13 loads in this walk; the earlier review traced it to `FooterHTML`.
- **The header glass.** It shows a grey translucent block behind the nav over dark or code content (desktop y≈980 and later; phone over the code block).
- **Two solid asks on the phone first screen.** The header shows a solid "Try Hanzo" next to the hero's "Get API key". The desktop header swaps to "Get API key" only after scroll.
- **The phone cookie card covers the hero ask.** It is 203px tall at y 593 to 796, and covers "Get API key" at y=656 on first load. It is within the 220px rule, but it hides the one ask.
