# /integrations/* (template) — James-eye review

Reviewed: main, page files at `f4231e5` (second review; the first, at `3389ac0`, scored 5/10). Members walked: `/integrations/openai-sdk` and `/integrations/langchain`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "Better: the code is right there and it types. But on my phone the page still jumps while it types, and the list of other integrations at the bottom is a wall of little coloured icons."

## What changed since the first review
Fixed: no tag or emoji above the h1 (the category now sits in the breadcrumb under the lede), no blue or green UI, the editor sits in the first screen and types on arrival, "Get API key — Free" is the solid ask in the hero and sticky after it, text reads with JavaScript off, and the hero ask and Copy answer on hover and press.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: the promise at display size beside Hanzo's lede and the ask, with the editor typing `pip install openai` and the client lines below it. On desktop the full code shows for a moment, clears, then types; that flash reads as a glitch.
2. **One in, one out?** Yes for the samples (pinned 01 / 04 chapters). Then the integrations list and the dark "Ready to get started?" close.
3. **A real object in every section?** Yes until the list.
4. **One ask, sticky after the hero?** Yes: "Get API key — Free" in the hero, the shared ask bar and the close; the header's "Try Hanzo" turns outlined on desktop. On the phone it stays solid beside the bar.
5. **Every hover and press answers?** Yes on the ask and Copy; the breadcrumb has hover only.
6. **Overlap, font swap, layout shift?** No overlap. **Phone layout shift 0.17 (openai-sdk) and 0.15 (langchain)**, still over Google's 0.1, as the editor and chapters fill in. Desktop 0.04–0.05.
7. **Which reference, and is its motion there?** motion.dev typewriter and apple.com chapters. Both there.
8. **Different from its neighbours?** The typed editor and "Only the Hanzo lines" switch are its own; members differ by their code.
9. **All 18 parts covered?** `docs/coverage/integrations-family.md` exists; gaps below.
10. **Banned tells?** The integrations list at the end carries a small coloured icon (emoji or logo glyph) beside every item's category; it reads as "icons everywhere".
11. **Copy untouched?** Yes: parity 93/93 and 92/92 text, 23/23 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.13 Layout shift:** 0.15–0.17 on the phone.
- **2.6 Content:** the integrations list is long and icon-led; plan says lists over six collapse with a true count.

## Fixes
1. Reserve the editor's and each chapter's final height on the phone so typing never pushes the page (target under 0.02).
2. Start the editor empty on first paint; show the full code only for no-JS and reduced motion.
3. Drop the coloured icons from the integrations list (names and categories in ink), and collapse it to the first six with "show all".
