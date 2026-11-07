# /oss/* (template) — James-eye review

Reviewed: main, page files at `4fa3ca0` (second review; the first, at `483255a`, scored 5/10). Members walked: `/oss/hanzo-app` and `/oss/crowdstart`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Now the numbers are up front and it looks like us. But the screen barely moves; I have to look hard to see the contour drifting. And on my phone it's completely still."

## What changed since the first review
Fixed: no eyebrow above the h1 (the "Open source · Hanzo" line sits under the lede), the dark ledger card is in the first screen beside the title, its lead figure is now the true "11 public repositories" (zeros are in the small row), the sibling orgs are cards that open, and text reads with JavaScript off.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the org name, Hanzo's description, "hanzo-app on GitHub", and the ledger card with its figures. After arrival the movement is a faint contour drift (0.1–1.2% change); on the phone the first screen is still.
2. **One in, one out?** Yes: "Counted from GitHub" and "Counted on Hanzo Forge" pin as chapters, then repositories as cards, then sibling orgs, then a dark close repeating the ask.
3. **A real object in every section?** Yes: ledger, figure plates, repository cards, org cards.
4. **One ask, sticky after the hero?** Yes: "… on GitHub" in the hero, the shared ask bar and the dark close. `data-cta` present.
5. **Every hover and press answers?** The ask answers both. "On Hanzo Forge" and "Every organization" press but do not change on hover.
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** hamol.studio numbered catalogue and synchronized.studio (org cards that open). Both there.
8. **Different from its neighbours?** Members differ by figures and contour seed; layout shared, which is fine for a 56-member family.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None found.
11. **Copy untouched?** Yes: parity 37/37 and 28/28 text, 25/25 and 9/9 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.9 Motion:** first-screen motion is too faint to read as alive; none on the phone.
- **2.8 Link states:** two text links without hover.

## Fixes
1. Give the ledger one clear arrival move (figures counting up once to Hanzo's values, from zero) and let the contour drift visibly; do the same on the phone.
2. Add the kit's arrow-link hover to "On Hanzo Forge" and "Every organization".
