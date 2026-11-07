# /founder — James-eye review

Reviewed: main, page files at `4350f66`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "There's a label on the headline again, and it's purple bars and green buttons. The pull request merges, goes back to open, and merges again, forever. And the page ends on a list of questions, not on the thing I came to do."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "Merge a pull request. Get Pro." beside a pull request that merges itself (Open → Merge → Merged) is clear and alive on desktop. But it loops: it resets to "Open" and merges again every few seconds. **Phone:** the pull request sits under the buttons and the first screen is still once it has played (0% change).
2. **One in, one out?** Yes for the levels: a giant counter pins on the left while "Founding Contributor" and "Founding Builder" light up on the right as you scroll. After that it becomes a stack: the "Where do yours land?" stepper, the dark open-bounties room, the claim form, then the questions.
3. **A real object in every section?** Hero, levels and open bounties: yes. The claim form and questions are plain.
4. **One ask, sticky after the hero?** Yes on desktop: a floating pill carries "Claim a merged pull request" after the hero, and the header's "Try Hanzo" turns outlined. On the phone the pill and the header's solid "Try Hanzo" show together. The page does not end on the ask: it ends on the FAQ.
5. **Every hover and press answers?** "Claim a merged pull request" answers on hover; no press. "Find an issue" does not change on hover. "Send the claim" stays a grey disabled pill until the field is filled, with no hint why.
6. **Overlap, font swap, layout shift?** None; layout shift 0. A hydration error fires on desktop load (red "1 Issue" badge on localhost).
7. **Which reference, and is its motion there?** apple.com pinned counter with panels changing beside it. Present.
8. **Different from its neighbours?** Yes: the self-merging pull request and the merge counter are its own.
9. **All 18 parts covered?** See below. No `docs/coverage/founder.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• FOUNDER PROGRAM", purple dot, mono caps).
    - UI hues: purple level bars, "Merged" pill and dots; **green** "Open" and "Merge" buttons; red and green diff bars. JAMES.md allows 0 UI hues and bans green outright (even when it imitates GitHub, it is UI here, not Hanzo media).
    - "Endless loop" on the hero demo (brief: no looping decoration).
11. **Copy untouched?** Mostly: parity 37/37 text. "Where do yours land?" is not in Hanzo's copy (a new headline).

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 Page endings:** no closing band; the page ends on the FAQ.
- **2.3 / 2.17 No-JS:** with JavaScript off, the lede and the FAQ answers (as visible text) stay hidden (5 of 25 blocks).
- **2.17 Submit states:** the disabled "Send the claim" has no visible reason.
- **2.13:** hydration error on desktop.
- **2.4:** 0 `data-cta`.

## Fixes
1. Remove "• FOUNDER PROGRAM" from above the h1.
2. Take the purple, green and red out of the UI: level bars, pills, buttons and diff bars in ink and greys (the diff can use weight or +/− marks).
3. Let the hero pull request merge once and rest on "Merged".
4. End the page on the ask: a closing band with "Claim a merged pull request" after the questions (or move the questions above the claim form).
5. Drop "Where do yours land?" or use Hanzo's own wording for the stepper.
6. Fix the hydration mismatch; render the lede visible without JavaScript.
