# /customers/* (template) — James-eye review

Reviewed: main, page files at `6d77b65`. Members walked: `/customers/damon-motorcycles` and `/customers/kanoa`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

**Not verified:** Hanzo's own campaign pictures. They are fetched from hanzo.ai, which this cloud machine cannot reach, so every picture frame showed its fallback (a grey plate with Hanzo's caption) and the hero showed only its contour. Judge the imagery on localhost before signing off.

Verdict: 6/10

First complaint: "The numbers spin through figures that aren't ours. I saw '963,741 users' and '$3.74' flash up before it landed on 150,000 and $1.50. Every number on the page has to be Hanzo's."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The name ("Damon Motorcycles", "KANOA") lands at display size on a dark first screen with the year, the campaign kind and "The original case study (PDF)". A contour drifts behind it. With the picture missing (see above) the first screen is mostly empty dark; with it, it should sell.
2. **One in, one out?** Yes: the hero settles into a plate, the lede reads as one large statement, the figures stand on a hairline rule, then each chapter is a full screen that wipes over the last with a reel counting "01 / 06". This is the most "one comes in, one goes out" template in my scope.
3. **A real object in every section?** By design yes (campaign frames per chapter, a media wall). Unverified here because the pictures did not load.
4. **One ask, sticky after the hero?** Yes: a floating pill carries "The original case study (PDF)" after the hero on both sizes, and the header's "Try Hanzo" turns outlined. It is Hanzo's own link, but it sends a buyer to a PDF rather than to Hanzo; that is James's call.
5. **Every hover and press answers?** Yes on the controls tested ("← Customers", the PDF link): both hover and press.
6. **Overlap, font swap, layout shift?** None; layout shift under 0.001. A hydration error fires on load of Damon (both sizes); KANOA is clean.
7. **Which reference, and is its motion there?** apple.com scene changes (chapters wiping over each other) and osply editorial type. Both present.
8. **Different from its neighbours?** Yes, and each launch has its own contour seed.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None found: no hue, no eyebrow over the h1.
11. **Copy untouched?** Yes: parity 37/37 and 26/26 text, 2/2 links. **But the count-ups show numbers that are not Hanzo's while they run** ("$9.3M", "596:0", "69,307", "+9,307%" on Damon; "45,418", "157,185", "963,741", "$3.74" on KANOA) before settling on Hanzo's figures. JAMES.md: every number traces to Hanzo's copy.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.6 Stat:** the plan's count-up "never rounds" and shows Hanzo's value; here it scrambles through invented values.
- **2.10 Media:** 14 (Damon) and 7 (KANOA) images without width and height; pictures unverified (see above).
- **2.9 / 2.12 Reduced motion:** 1 animation still running after 3 s with reduced motion on.
- **2.13:** hydration error on Damon.
- **2.4:** 0 `data-cta`.

## Fixes
1. Make every figure count up from 0 to Hanzo's value (or not count at all); never pass through other numbers, and never overshoot.
2. Give every image its width and height (or aspect ratio) so frames cannot jump when the pictures arrive.
3. Stop the contour (and any loop) under reduced motion.
4. Fix the hydration mismatch on Damon.
5. Check on localhost that each launch's own picture fills the first screen; if it does not, the dark hero with only a contour is too empty and needs the plate in view.
