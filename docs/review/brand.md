# /brand — James-eye review

Verdict: 6/10
First complaint: "The logo moves for a second, then the whole page just sits there. I scroll and it's a document: nothing comes in, nothing goes out. And the top looks like the press page."

Walked 7 Nov, page file at `215d6ed` (`components/pages/Brand.jsx`, `Brand.css`), HEAD `94acb12`. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus a return visit without the curtain, reduced motion, JS off, and 320 wide. Stills: `review/brand/desktop-walk.jpg`, `review/brand/phone-walk.jpg`.

## What works
- The colour is right: only ink, white and Hanzo's greys. Color Palette is the one dark room, and the swatches, gradients and samples are the content. The proof-red is gone.
- The headline is a real Display moment: 128px (56px on phone) with line height 0.92, and it cuts in by line. Fonts load under the curtain, so there is no swap. CLS is 0 on desktop and 0.0005 on phone (from the flap board).
- One ask in Hanzo's words. "Download Assets" is the hero's only solid button. The shared bar carries it after the hero at both widths and steps aside when the ZIP link is on screen. While the bar is up, the header's "Try Hanzo" turns to an outline.
- The objects are things you use:
  - Copy a swatch and its icon draws a tick.
  - Switch between Hanzo White and Hanzo Black and the six ratios flip again, each with a shape verdict.
  - Drag the slider and the "Aa" and every Heading take the weight.
  - The bench buttons press (scale .95–.97), the card lifts, and the download disc drops 4px.
- The hero fits both frames: the ask's bottom edge is at 689 of 801, and at 465 of 812 on phone. Every phone target is 44px or more. There is no sideways scroll at 320 or 375. Under reduced motion, 0 animations run, the mark is shown in its final state and the weight sits at 560. Parity is 76/76 for text and 4/4 for links.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: the title says what it is, and the mark is the brand. It barely moves.
   - On a first visit, the line cut-in, the grid draw and the pieces landing all play under the 2.4s curtain. All that is left after the lift is about 1.5s of the mark closing. From about 3s after the lift, the hero does not change by a single pixel (checked to 7s).
   - On a return visit, with no curtain, the arrival is lovely: the lines cut in at 0.4–0.8s, the guides draw, the pieces fly in, and the mark opens and closes by 4.6s. Then it rests.
2. **One in, one out, or a document?** A document. There is no pinned scene and no scroll choreography; only "Color Palette" masks in. The principles are three still rows, Typography is a list, and Components is a bench. The signature sweep is the only move below the hero that runs by itself. It fires when 25% of a section about 2,000px tall is in view, so its dip to weight 200 plays while the "Aa" is still under the fold and the ask bar. By the time the "Aa" is in view it is already at 896 (still 7).
3. **A real visual object in every section?** Mostly. The mark, the swatches, the contrast board, the gradients, the giant "Aa" and the bench all qualify. The principles' objects are 96–108px tiles, and the first is a mark icon in a grey box: an icon alone. The assets close is a black text card with a download disc.
4. **One ask, sticky after the hero?** Yes, at both widths. But its one destination, `/press/hanzo-press-kit.zip`, is not in `public/`. The dev server fetches it from hanzo.ai (blocked here, so it returned 404). A static export would return 404 unless the file is mirrored (2.10).
5. **Every hover and press answers, no jumps?** Mostly. The faults:
   - A gray swatch lifts 10px inside its `overflow:hidden` strip. That clips its top and opens a black notch below it (still 5).
   - There is no hover on the big swatches, the inactive "Hanzo Black" segment, the "Link Button" sample or brand@hanzo.ai. That link also has no underline, against the ink-plus-underline rule.
   - On desktop, pressing a gray swatch shows no scale, because the CSS hover lift wins.

   On the phone, every tap answered.
6. **Overlaps, font swap or layout shift?** None at 1470×801 or 375×812, no swap, and CLS of about 0. Two failures elsewhere:
   - **At 320:** the contrast board squeezes the gray names to one letter a line ("Gra / y / 90 / 0"), "presentations." breaks into "presentation / s.", and the segment labels wrap.
   - **With JS off:** the lede, "Download Assets", "Press Kit" and the whole mark are invisible, because the server HTML sets them to `opacity:0`. The hero becomes a headline beside an empty white card.
7. **Which reference, is its motion there?** Apple shows in the specimen and the dark colour room: huge type, with the product as the object. Its motion does not: there is no pinned, scrubbed scene. The bench and the spring lifts follow motion.dev correctly, but they are small. It reads as a well-set, static brand book.
8. **Different from neighbours?** Not from /press, which links here. Both heroes have:
   - a Display headline ending in a full stop;
   - the same lede and solid/outline button pair;
   - a white rounded card holding the Hanzo mark on the right.

   Going from press to brand looks like one template twice. The type specimen is this page's own, but it is four screens down.
9. **18 areas (PLAN-COMPONENTS)?** `docs/coverage/brand.md` exists and is mostly true. Four claims do not hold: "JS off shows them", "lands its five pieces within a second" (true only without the curtain), "no labels over any headline", and the tick on a blocked clipboard. See below.
10. **Banned tells?** One. "01 / 03", "02 / 03" and "03 / 03" are 13px mono kickers over each principle headline: directly above it on phone, above and to the left on desktop. The six mono group labels (BRAND COLORS, GRAY SCALE, GRADIENTS, BUTTONS, CARDS, BADGES) have the same kicker look, and "CARDS" sits over "Card Title". The green "Success Badge" is a component sample, so it counts as content, not accent.
11. **Copy untouched?** All of Hanzo's words are there, and none is reworded ("Design System" and "Design Principles" became aria-labels, per the eyebrow rule). But the page adds visible figures that Hanzo does not publish:
    - six contrast ratios per background (17.93:1 to 2.52:1);
    - the weight readout "560", with "100" and "900";
    - a "→ PRIMARY BUTTON" echo under the bench.

    They are computed, not made up, but they are new copy, and there is no `content/ui-strings.json` to hold them. They need James's yes, or they go.

## Missing from the 18 areas
- **2.3 First impression:** the arrival plays under the curtain. It is not gated on `useArrived()` (Careers already is). Nothing lives in the hero after the first 3s.
- **2.3 / 2.9 Scroll story and motion:** there is no scene where one thing comes in as another goes out, and the one signature move fires off screen.
- **2.3 / 2.17 Server-rendered text:** the hero lede, the ask and the mark are hidden with JS off (a P1).
- **2.7 Visual system:**
  - The hero object is the same card as /press.
  - `Brand.css` uses literal hex values throughout.
  - The 28px radius, the {120,18} spring and the .95 tap scale are not CANON values.
- **2.8 Components:**
  - Bare `:hover` rules (not inside `@media (hover:hover)`) on the swatches, bench buttons, card and download link.
  - The tear in the gray strip on hover.
  - The missing hover states listed in answer 5.
- **2.8 / 2.17 Copy:** the swatch tick, and the kit Copy's tick with its "Copied" aria-label, appear even when the clipboard write fails. The plan requires that a blocked clipboard never reads as "Copied".
- **2.10 Media:** the assets ZIP is not mirrored into `public/`.
- **2.11 Mobile:** at 320, the contrast board, the assets headline and the segment control break.
- **2.12 Accessibility:**
  - The heading outline jumps from h1 to h3 at the principles.
  - "Need brand assistance?" is an h3 with no h2 above it in its section, because the assets headline is a `<p>`.
  - The verdict icons sit centred under left-aligned gray names.
- **0.6 UI strings:** new visible figures and new aria strings ("WCAG AA 4.5:1", "below WCAG AA", "Font weight", "Background"), with no register.

## Fixes (in order)
1. **Play the arrival where it can be seen, then keep the hero alive.**
   - Gate the h1's `now`, the guide draw, the landing and the open-once on `useArrived()`.
   - Then give the hero one ambient life within the 2.9 budget: the mark's pieces lean toward the pointer anywhere in the hero (on a spring, not only when the pointer is over the card).
   - Add one slow idle mover with a pause control, frozen under reduced motion.
2. **Make the scroll a set of scenes, not a list.**
   - Pin the three principles so each line replaces the last.
   - Turn "01 / 03" into a giant ink numeral as the row's object. That also removes the kicker over each headline and the icon-in-a-box tiles.
   - Let the colour room arrive: the gray strip opens from a single bar into six as it enters.
3. **Fix JS off.** Render `.xbr-hero-f` and the mark's pieces visible in the server HTML, using the same kind of noscript rule MaskLines uses, so the lede, the ask and the mark show with scripts off.
4. **Fire the signature in view.** Watch `.xbr-spec` at amount 0.6, not the whole section at 0.25. Then the full 200 → 900 → 560 sweep plays on screen, above the ask bar.
5. **Split the hero from /press.** Take the mark out of the white card and let the construction grid run full-bleed on the stage at hero scale. Then /press is a card stack and /brand is a drawing.
6. **Tidy:**
   - On gray hover, widen the hovered swatch (flex-grow) instead of moving it inside a clipped strip, and put the rule inside `@media (hover:hover)`.
   - At 360px and narrower, stack each contrast row (name over figure), size the assets headline so "presentations." fits, and stop the segment labels from wrapping.
   - Underline brand@hanzo.ai and give it a hover. Give the inactive segment, the Link Button sample and the big swatches a hover too.
   - Show no tick when the clipboard write fails.
   - Fix the heading outline.
   - Ask James about the ratios, "560 / 100 / 900" and the bench echo.
   - Mirror the ZIP into `public/press/`.
