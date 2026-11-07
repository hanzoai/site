# /oss/* (template) — James-eye review

Reviewed: main, page files at `483255a`. Members walked: `/oss/hanzo-app` and `/oss/crowdstart`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 5/10

First complaint: "The first screen is just words and buttons and nothing moves. Then the first number I see is a giant '0' next to 'stars'. That's the opposite of selling."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** No. The first screen is the org name at display size, Hanzo's one-line description ("[Legacy] Hanzo app templates…"), and three actions. **Nothing moves** after the headline lands (0% change on both sizes, both members). The dark ledger card starts at the fold, and its first visible figure is "0 stars" set huge.
2. **One in, one out?** Partly: "Counted from GitHub" and "Counted on Hanzo Forge" pin as two chapters (01 / 02) with their figures, then the repositories list. It is short and orderly but static.
3. **A real object in every section?** The ledger card and the figure plates; the repositories are a list.
4. **One ask, sticky after the hero?** Yes: "hanzo-app on GitHub" / "crowdstart on GitHub" solid in the hero and carried by the shared ask bar; the header's "Try Hanzo" turns outlined on desktop.
5. **Every hover and press answers?** Not measured beyond the hero buttons (which answer).
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** hamol.studio numbered catalogue (01 / 02, figures). The numbering is there; the motion is not.
8. **Different from its neighbours?** Members differ only by their figures and name (each has its own contour seed in the ledger).
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 on desktop ("OPEN SOURCE · HANZO", mono caps).
    - A dead first screen.
11. **Copy untouched?** Yes: parity 37/37 and 28/28 text, 25/25 and 9/9 links. Figures come from GitHub on the walk date.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression:** no moving object; the hero object (ledger) is below the fold.
- **2.5 Proof order:** a zero is the lead figure; plan says lead with current verifiable proof.
- **2.3 / 2.17 No-JS (hanzo-app):** 3 of 22 blocks hidden with JavaScript off ("02 / 02", "Counted on Hanzo Forge"), hidden by the page's own CSS (scope to `html.js`, SYSTEM.md §11b).

## Fixes
1. Remove "OPEN SOURCE · HANZO" from above the h1.
2. Bring the ledger card into the first screen beside or under the title, with its contour drifting, so something is alive on arrival.
3. Lead the ledger with the member's strongest true figure (public repositories, commits in the past year, or Forge mirrors) and keep zeros in the small rows, not as the giant number.
4. Scope the chapter text's hidden state to `html.js`.
