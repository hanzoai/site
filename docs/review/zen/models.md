# /zen/models — James-eye review

Verdict: 7/10
First complaint: "It's the same contour lines everywhere: the hero, behind every number, on every card, and again at the end. And the little bars on the cards are all full, so they tell me nothing. On my phone the numbers are just five huge figures stacked down the page."

I walked it with Playwright in Chromium against the dev server, moving, not from screenshots alone.
- **Desktop, 1470x801:** I recorded video and took frame bursts while wheel-scrolling in 100px notches with a 120 ms dwell, from the top to the footer (6018px). I then stepped through the pinned figures in 7 stops.
- **Phone, 375x812 (isMobile, hasTouch, DPR 2):** I did the same walk (8202px).
- **What I pressed on desktop:** I hovered and pressed the hero ask, Explore Models, Full Pricing and the field pause. I sampled the Quick Start typer every 150 ms for 6 s, pressed a `model=` pick and Copy, and read the clipboard. I tried every tier and sort pill, hovered a model card (tilt and size bars), hovered a sheet row, opened a row with `+`, and clicked a card through to its page (Morph), then pressed Back.
- **What I tapped on phone:** the sort rail and the tier rail.
- **What I checked:**
  - idle frames at 100, 400, 800 and 1200 ms;
  - horizontal overflow;
  - the console over 17 fresh loads;
  - reduced motion: the final state, and `getAnimations()` after 3 s;
  - the computed value of every card bar.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/zen-models/

## What works
- **Alive within 1 s, with its own hero object now.**
  - The h1 cuts in by line mask (52px, 2 lines). The Zen5 contour field drifts, and frames differed at every sample from 100 ms on.
  - The black room starts as a rounded card in the gutters and is full-bleed by scroll y≈590 (MASTER 3.1).
  - The pause button holds the field (frames were identical after the press, `aria-pressed=true`), and its hover fills at white 14%.
- **The phone first screen is now a composition.** A 28svh field band sits above the h1 (filmbox 76 to 303px). The h1 (40px, 3 lines), lede and Get API key (656 to 700px) all fit inside 812.
- **The Quick Start typer is fixed.** Code, pressed pill and clipboard agree.
  - The 40 samples step cleanly: `zen6` → `z` → `zen6-f` → `zen6-flash`, and the pill follows only when the name is complete.
  - After I pressed zen5-coder, the slot, the pill and the clipboard all read `zen5-coder`, the button said "Copied", and the slot still read zen5-coder 4 s later.
- **The signature works.**
  - By size gives Pro, Mini, Coder, Default, Flash. By context gives Pro, Coder, Default, Mini, Flash.
  - The leader takes the tall card, and the sheet re-orders with the cards.
  - The Ultra tier leaves 1 card and 1 row.
  - Empty tiers (ultra max, pro max) are no longer struck-through buttons; they are hidden text.
- **The Morph is real.** The card grows into /models/hanzo/zen5-pro, the title lands on the destination h1, and Back returns to the same scroll (y=3094).
- **The sheet is a genuine "Beyond".**
  - Its total, active and context bars are drawn to scale.
  - Row hover wipes in a #f5f5f5 fill (clip-path).
  - `+` rotates to × and opens Hanzo's paragraph inline (the sheet grows from 383 to 461px).
- **Every tap answers.**
  - The hero ask goes from #f5f5f7 to #fff, and press scales it to 0.98.
  - The arrow links nudge their arrow 4px.
  - Picks fill #f5f5f5, and the closing ask goes from #0a0a0a to #2c2c2e.
  - The card tilt reaches about 3°.
- **Reduced motion shows the final state.** The figures become a plain list (948px), the h1 sits at rest, and `getAnimations()` is 0 after 3 s.
- **At 375 there is no horizontal page scroll.** The tier rail overflows inside itself with `data-over` (a peek) and `scroll-snap-type: x`.
- There is no hue in the page's UI. The pinned figures stage now carries a field per figure, and it drifts at idle, so that scene is no longer a dead white slide.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The card size bars are all full, so the hover lies.**
   - `.zc-mc-bar i { transform: scaleX(var(--w)) }` reads `--w`, but `public/hanzo.css` registers `@property --w` as a length (computed `--w: 420px`). The scale is invalid and every bar draws at full width.
   - I measured it on desktop hover (both bars 118 of 118px for Zen5 Coder, whose total should be 28%). On phone, where the bars always show, every card read 144/144/144 of 144px.
   - So the hover detail (JAMES rule 4) tells you nothing, and on phone it shows wrong data. /investors had the same bug.
   - Fix in `ZenCatalog.jsx`: rename the property to `--zc-w`, or set `transform: scaleX(n)` inline as the sheet's `Row` already does. Make the same rename in `ZenCatalog.css` lines 125 to 126.
2. **One motif repeated four times; no real Hanzo visual anywhere.**
   - The same Sigil contour drawing is the hero, the backdrop of each pinned figure, the art on all five cards, and the closing field.
   - The per-figure fields do not visibly encode their number: "18", "2M" and "7" all look like the same topography.
   - James's own words were "too many repeats", and JAMES rule 6 asks for real visuals.
   - Fixes in `ZenCatalog.jsx`:
     - Keep the field as the hero and the cards' art, but make the figures scene its own object. For example, draw the figure as data: 18 marks for Models, a 2M-wide context ruler against the Zen5 contexts, or the five Zen5 size bars for Architectures.
     - Drop the closing `<Sigil className="zc-sig">`, or swap it for a quiet still of the hero field (no second live field).
     - If `/models/zen.webp` is permitted, it could be the tall card's art only.
3. **On phone, the figures are five huge numbers stacked down the screen.**
   - Below 900px, `.zc-figs` becomes a plain list. From about y=1300 to 2100, every number sits at figure size, one after another, with nothing small or medium between them. That is "everything big at once" and reads as a document.
   - Fix in the `@media (max-width: 899px)` block of `ZenCatalog.css`: lay the five out as a 2-column grid at 32px with the first (18) at 64px. Or make them a `scroll-snap-type: x proximity` rail of single figures with a 14 to 18% peek and the `01 / 05` caption.
4. **The model grid is not the SPEC grid.**
   - It measures `564px 282px 282px` with a 564x452 lead card. MASTER part 15 says `385px repeat(4,192px)`, rows 220px, Enso spanning column 1.
   - Fix in `ZenCatalog.css`: set `.zc-grid { grid-template-columns: 385px repeat(4, 192px) }` at desktop and let the tall card span both rows, so the five cards sit in one 1201px band as on the home grid. The non-lead titles should stay 22px.
5. **Two dead white bands.**
   - About 160px of empty white with one hairline between Quick Start and the figures.
   - About 170px between the last figure's field and the Zen5 heading.
   - Together with the 144px of white above the hero card, the page breathes in gaps rather than overlaps (MASTER part 3: objects overlap by 40px).
   - Fix in `ZenCatalog.css`: trim `.zc-quick` bottom padding and the `.zc-figs` margin, and pull `.zc-shelf` up so its heading rises over the tail of the last figure's field.
6. **The sort and tier pills' hover is a colour change only** (grey to #0a0a0a).
   - Fix in `ZenCatalog.css`: give the hover a #ededed fill under `@media (hover:hover)`, so it previews where the gliding pill will land. Or preview the re-order: on hover of "By size", show the leader's name in the pill's `small`.

Shared, not counted against the page:
- **The footer hydration mismatch.** "A tree hydrated but some attributes… didn't match" on `FooterHTML`'s `dangerouslySetInnerHTML`, on 8 of 8 loads in the last batch, with the red "1 Issue" badge. It comes from the shared footer.
- **Two solid asks on the phone first screen.** The header shows a solid "Try Hanzo" while the hero has a solid "Get API key"; the header does not follow the page's `data-cta` on phone. The desktop header swaps to "Get API key" correctly.
- **The header glass.** It shows a grey translucent block behind the right half of the nav over dark or code content (y≈980 desktop, y≈1300 phone).
- **The cookie card covers about 210px of the phone's bottom edge.** It is under 220px, so it is within the rule.
