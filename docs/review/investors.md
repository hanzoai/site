# /investors — James-eye review

Verdict: 6/10
First complaint: "It opens like Apple, then turns into a spreadsheet. After the three big chapters it's boxes of numbers, a commit log and a grid of names, and nothing comes in or goes out. And the bars are wrong: 200× and 400× are the same length, and every model in the code chart looks equal."

Walked 7 Nov, about 14:15 to 14:30 UTC. Page file at `215d6ed` (`components/pages/Investors.jsx`, `Investors.css`, with `company/PinScenes`, `company/MaskLines`). HEAD was `94acb12`; the hero arrival was re-filmed after `9e22aba` changed MaskLines. Filmed moving at 1470×801 and 375×812: wheel scroll and finger swipes, a dwell on every screen, hover and press on desktop, taps on the phone. Also checked reduced motion, JS off at both sizes, and 320 and 375 widths.

Stills:
- `review/investors/desktop-walk.jpg`. Row 1: the hero after the curtain; the counter rolled on to 93.7%; the 200× chapter; the 400× chapter, whose bar is the same length. Row 2: the "Smarter" and "Faster" titles on top of each other mid-change; the stack; the results room with flat bars; the commit record. Row 3: the wall (names, because the logos are remote); people and structure; "Read the source"; the end, where the only solid on screen is the header's "Try Hanzo".
- `review/investors/phone-walk.jpg`. The hero; 400× and the stack; the flat LiveCodeBench bars; "Damon Motorcycles" running into "KANOA"; the close; the hero with JS off (only the h1).

## What works
- **Headline and colour.** The h1 is a real Display moment: Zen at 116px, line height 0.92 (47px on the phone). Since `9e22aba` it rises after the curtain. The page uses ink, greys and white only, with no hue, gradient text or Inter.
- **Fits the first screen.** At 1470×801, "Contact investor relations" ends at y=627. At 375×812 it ends at y=512.
- **The counter is the page's own idea.** It rolls digit by digit every 3.4s, goes round once and rests on 16 of 16. It has Pause and Replay, and pressing a step holds that figure. Under reduced motion it stays on the first figure, with 0 running animations.
- **The thesis is a real scene.** The three chapters pin, a rail scrubs, and each visual wipes up over the last. That is one in, one out, Apple-style.
- **Sticky ask, both widths.** "Hanzo Investor Relations · Contact investor relations" arrives after the hero: a bottom bar on desktop at y≈1080, and a thumb bar on the phone at y≈1215. The header's "Try Hanzo" turns outline while the bar shows, and the bar goes dark in the results room. Each screen of the body has one solid.
- **Objects.** The commit heatmap is a real grey ladder. The Read the source list ticks, fills its giant counter and remembers the ticks. The Sigil at the close drifts with no input and leans toward the pointer.
- **Engineering checks pass:**
  - CLS is 0.0008 on desktop and 0.0085 on the phone, with no font swap.
  - No page errors appeared; only the blocked hanzo.ai images failed.
  - There is no sideways scroll at 320 or 375.
  - Parity is 131/131 text and 43/43 links.
  - Every figure traces to Hanzo's copy. 16 of 16 through ~3,665 are in the live JSON. 732,288, 78,421, 1,263, 1,733, 5,125, 3,617 and 51% are in `content/pages/investors.html`.
  - `data-cta` is on the hero, research and call buttons, and both files carry the Persona/Goal/CTA header.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. Within a second of the curtain lifting, the h1 rises and the counter's line fills, and the first figure rolls 2.4s later. But the lede, both buttons and the counter fade in behind the curtain (opacity 0→1 between 2.2s and 2.9s; the curtain lifts at 2.85s). They are already sitting there when the headline arrives, so the order is upside down. The counter card also runs 28px past the fold at 1470×801.
2. **One in, one out, or a document?** Only the thesis is a scene. From the stack on, it is a document: 7 sections where the only scroll motion is a headline rising. Desktop is 13,161px (about 16 screens), the phone 15,738px (about 19). The stack is three grey text cards. The results are two big cells over four equal boxes, each with its sentence. The commit record is 6 stats, a heatmap and an 8-row log.
3. **A real visual object in every section?** Mostly:
   - **Yes:** the counter, the 200× and 400× numerals, the giant 16 of 16, the heatmap, the 51% diagram, the 0/7 counter and the Sigil.
   - **No:** the stack is text cards, and the governance block is text. The executives are two blank grey discs.
   - **The Pareto chart is invented:** 11 grey dots and a curve, with no source.
4. **One ask, sticky after the hero?** Yes, at both widths (above). But the close has no solid. It offers "Book a call" in outline and an underlined ir@hanzo.ai. Once the bar steps aside for the footer, the only solid on screen is the header's "Try Hanzo", which is the wrong ask for an investor.
5. **Every hover and press answers, no jumps?**
   - **These answer:** the hero buttons (#0a0a0a to #2c2c2e, lift 1.02, press .98), the slabs (lift 6px with a shadow and the arrow nudging), the wall tiles, the source arrows, the commit rows (underline) and the exec arrows.
   - **These barely answer or not at all:**
     - 732,288 and the five stats go from ink to ink (#0a0a0a to #1d1d1f).
     - ir@hanzo.ai has no hover state.
     - The tick circles have no hover.
     - The six dark result cells only shift #161618 to #1c1c1f and show no cue that they link.
   - **Nothing tells you anything on hover.** On the phone, every tap answers.
6. **Overlaps, font swap, layout shift?**
   - **Shift and swap:** none.
   - **Overlaps:**
     - In the thesis, the outgoing and incoming titles sit on top of each other for about 300ms ("Smarter" over "Faster", "Faster" over "Cheaper").
     - At 375 the wall's fallback names overflow their cells: "Damon Motorcycles" runs into "KANOA", and "STONED Audio" touches "Unikrn".
   - **Phone tap targets under 44px:**
     - the 7 counter steps (36px wide);
     - "Read the source" (21px tall);
     - Legal (36px) and Press (37px).
   - **JS off:** the hero shows only the h1 at both sizes. The lede, "Contact investor relations", "See the research" and the whole counter stay at opacity 0. On desktop, "Faster" and "Cheaper" are hidden too.
7. **Which reference, is its motion there?** The goal is an anthropic.com model launch (benchmarks as hero figures) with Apple's pinned scenes. The pinned scenes are really there, for one section. The benchmark story is undercut: a global `@property --w` (syntax `<length>`, initial 420px, in `public/hanzo.css`) swallows the page's `--w`. So all six LiveCodeBench bars draw full length (78.3% looks like 93.7%), and the 200× and 400× bars are both 420px. The chart also uses a 60% baseline, against PLAN 2.5's zero baseline.
8. **Different from neighbours?** Partly. It has its own signature (the counter). But it shares the Company kit build: a masked h1 left with a white shadowed card right (as on /contact and /careers), PinScenes chapters (/careers, /philosophy), one dark middle room, and a Sigil contour close (as on /press and /contact). The Pareto curve repeats /about's frontier.
9. **18 areas (PLAN-COMPONENTS)?** See below. `docs/coverage/investors.md` exists, but three of its claims are wrong:
   - "All targets are 44px or more" is false.
   - "JS off shows the headlines" is true but hides that the ask disappears.
   - "the stack as layered slabs" describes three static cards.
10. **Banned tells?** No hue, gradient text, Inter or eyebrow over the h1. These are borderline:
    - Mono kickers still sit over figures and blocks: "COMMITS" over the 732,288 display figure, "01 / 03" over each chapter title, "CORPORATE STRUCTURE" and "GOVERNANCE", and the wall's h2 set as a kicker.
    - The results row is four equal boxes with an explaining sentence under each.
11. **Copy untouched?** Yes in words (parity clean). Two small additions are visible:
    - The stack slabs carry the ordinals 03 / 02 / 01, which Hanzo does not number.
    - Hanzo's 01–03 appear as "01 / 03".

    "Hanzo Investor Relations" and "Hanzo.Thesis · one platform" moved into labels, which the eyebrow rule allows; the first still shows in the ask bar.

## Missing from the 18 areas
- **2.3 First impression:** the lede, the buttons and the counter don't wait for the curtain (`useArrived`). The page ends without a Band carrying one solid in Hanzo's words. The hero is a hand-written `Hero`, not `PageHero`.
- **2.3 Scroll story:** one new idea per 100svh holds only for the thesis.
- **2.4 Conversion:** there is no solid in the close, and ir@hanzo.ai has no `data-cta`.
- **2.5 Trust and proof:**
  - The benchmark bars are flat today.
  - Once fixed, they would still sit on a 60% baseline, not zero.
  - The 200× and 400× bars are equal.
  - The Pareto scatter is drawn, not measured.
- **2.8 Components:** the PinScenes cross-fade ghosts two titles. There are hover dead spots on the figures, the email and the ticks.
- **2.10 Media:** the portraits are CSS backgrounds, not the kit's `Img`, and their fallback is a blank grey disc, not Sigil (2.17). The logo fallback names overflow at 375.
- **2.11 Mobile:** tap targets are under 44px. The heatmap is cut at May in an inner scroller with no cue.
- **2.12 / 2.17:** with JS off, the ask, the lede and the counter are hidden, and so are chapters 2–3 on desktop.
- **2.13 Engineering:** the page's `--w` collides with a registered global property. Any page-local custom property needs a prefix.

## Fixes (in order)
1. **Make the bars tell the truth.** Rename `--w` to `--xin-w` in `Investors.jsx` and `Investors.css`, because `@property --w` in `public/hanzo.css` eats it. Draw LiveCodeBench on a zero baseline (width = v/100) with Enso in white and the rest in grey. Make the 400× bar twice the 200× bar against the same 1× dot, or drop the bars and let the numerals stand.
2. **Make the second half one in, one out.** Make the stack actually layer: each slab is sticky and rises over the last as you scroll, and drop the 03/02/01. Run the four result cells as a pinned scene where one giant figure replaces the last (the counter's own roll), with its sentence under it. Let the commit record's stats arrive one at a time beside the heatmap.
3. **Fix the hero's arrival and JS off.** Give the lede, the buttons and the counter `useArrived`, so they follow the h1 instead of waiting behind the curtain, as /careers does. Add an `html:not(.js)` / `<noscript>` rule so they render at opacity 1. Stack the PinScenes chapters when JS is off.
4. **Give the close its one solid.** ir@hanzo.ai (the ask's own mailto, Hanzo's words) becomes the solid button with `data-cta="investors.close"`. "Book a call" becomes the quiet second.
5. **Phone.** Let the wall's fallback names wrap or step down to 15px at 3 across, so nothing collides. Make every target 44px:
   - the counter steps, through a 44px hit on a 36px line;
   - "Read the source", with `min-height: 44px`;
   - Legal and Press, with padding.

   Give the heatmap's inner scroller a peek or edge fade so the rest of the year is findable.
6. **Fix the chapter change and the dead hovers.** In PinScenes, the outgoing title must clear before the incoming one rises (a mask slide, like the h1), so two titles never overlap. Give hover an answer that tells you something:
   - the source arrow appears on 732,288, on each stat and on each dark result cell;
   - ir@hanzo.ai thickens its underline;
   - the tick circle previews its check.

   Replace the blank portrait discs with the kit's `Img` and a Sigil fallback. Move "COMMITS" under 732,288, as "In the past year" already sits.
