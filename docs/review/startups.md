# /startups/: James-eye review
Verdict: 7/10
First complaint: "The application card is lovely, it answers me as I type. But the rest is dead. The money counter flips once and then it's a white box with a shadow. Then I hit a big black 'Not venture-backed?' slab with nothing in it, just text and two buttons."

Walked 2026-11-07 17:18 UTC on the dev server at 1470x801 and 375x812, moving. I walked all three form steps with test values. Every non-GET request was aborted (the one POST to api.hanzo.ai …/hanzo.startups-apply/responses), so nothing was sent.

## The 11 answers
1. **First screen**
   - Sells in 5 s: the 52px h1, the lede, "Apply for credits" and a $150,000 odometer card.
   - Motion within 1 s: yes. At 250 ms the card is absent and the lede sits 16px low. At 950 ms the digits are mid-roll.
   - On the first screen nothing moves after about 3 s. The only running animation at 6 s is a shared `prism-spin`.
   - Phone: the ask's bottom edge is at 519px, above the 667 fold.
2. **One in, one out**
   - The program rows now track the viewport. Row 02 is ink at scrollY 500 and row 03 from 700 on. Inactive rows are #737373 at scale 0.6. This is fixed since the last review.
   - Dead stretches:
     - About 216px of empty white between the hero buttons (bottom 490) and "THE PROGRAM" (706).
     - The Techstars paragraph alone in white.
     - The Band's roughly 600px of black.
3. **A real object per section**
   - Hero: the odometer card.
   - Form: the live summary card. It follows the form, e.g. "Testco Critic · 4 / 5 · Pre-seed". Ticking Sequoia turns its tile into "Up to $150,000 in credits · Sequoia · Techstars". BYO compute and "AI & inference" also light up. This is the page's moment.
   - No object in three places: the Techstars paragraph, the black "Not venture-backed?" Band, and row 03, which re-uses the hero's $150,000 odometer as its object (a duplicate, not a new object).
4. **One ask; rhythm**
   - The header ask swaps from a quiet "Try Hanzo" to a solid "Apply for credits" after the hero.
   - The first screen has one solid fill on desktop.
   - The phone summary strip is now static: no floating over content. This is fixed.
   - Rhythm: a 52px h1, about 59px odometer digits, and 44px rows that settle to 0.6 when inactive. The h1 and the odometer are two big things side by side on the hero.
5. **Hover and press**
   - Every page control changes background or border, not opacity:
     - primary #0a0a0a to #262626;
     - ghost to #f5f5f5 with an ink border;
     - Band "Start free" #fafafa to #e4e4e7.
   - Press scales to 0.97 or 0.98 with no jump.
   - Stage chips go from #f2f2f2 to #ececef on hover, which you can barely see.
   - No hover tells you anything, and the hero card ignores the pointer (transform `none`).
   - The ask now lands focus on `input[name=company]`. This is fixed.
6. **Overlap, font swap, layout shift**
   - CLS is 0.0002 desktop and 0 phone, with no font swap and no horizontal scroll at 375.
   - No tap target under 44px in main.
   - Phone: the strip's "1 / 5 · Select stage" line is clipped. Its text bottom is 368 and the black strip ends at 365.
7. **Reference**
   - Calm like chatgpt.com/business/enterprise.
   - The live card gives the "it answers you" feel.
   - Kinds of motion: arrival (h1 cut, odometer), scroll (rows), state (steps, card mirror).
   - No pointer motion and no idle life after arrival.
8. **Neighbours**
   - Its own medium: an odometer hero plus a live application card. Not a template.
9. **The 18 parts**
   - Present: one h1, `data-cta="startups.hero"`, the sticky ask, a honeypot, the Privacy line by Submit, the 01 / 03 steps, a Band and the footer.
   - Weak:
     - The empty required field gets a grey summary box and no `aria-invalid` (0 fields flagged).
     - A failed POST shows the browser's raw "Failed to fetch", not Hanzo's error string. The entries are kept, which is good.
10. **Banned tells**
    - No hue, no gradient text, and no eyebrow above a headline. "TECHSTARS '17" is a caption below the h1, and "The program" is itself a 12px h2.
    - The hero card is both outlined (1px) and raised (a large soft shadow): a boxed white card next to the h1.
    - The Band is full-bleed from the start (radius 0, x 0, width 1470 at every offset). It never enters as a rounded card.
11. **Copy**
    - parity.py: `/startups: OK text 82/82 links 3/3`.
    - Every rendered sentence is in content/live or forms.json. The only additions are the "/ 5 ·" separator and the aria-label "Your match".

Console: no reproducing error. One batch of 4 cold loads showed a hydration-mismatch "1 Issue" badge on 4 of 4 during a recompile. Two later batches of 4 fresh loads showed 0, so it is not counted.

Shared (not this page): the phone header's "Try Hanzo" is always solid, so the phone first screen has two solid fills. The header ask's hover is opacity only (1 to 0.88).

## Fixes (in order)
1. Band:
   - Enter it as a rounded card inside the gutters that opens to full width.
   - Cut its empty black height by about half.
   - Give it a quiet object built from existing words. No new sentences.
2. Hero card:
   - Drop either the 1px border or the shadow.
   - Add a fine-pointer response (a tilt to 2.5° or a sheen) so it lives after the roll.
   - Close the 216px gap so the next section peeks 56px.
3. Phone strip: give the "n / 5 · stage" line room inside the black strip (it is clipped by 3px).
4. Form states:
   - Set `aria-invalid` and `aria-describedby` on the empty field and show the error inline under it.
   - On a failed POST, show Hanzo's existing error string instead of "Failed to fetch".
5. Row 03: give it something other than a second copy of the hero odometer. For example, let it roll to ink only when lit, so it reads as the hero figure arriving rather than a duplicate. Make the stage-chip hover visible.
