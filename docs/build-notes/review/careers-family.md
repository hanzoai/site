# /careers/* (template) — James-eye review

Reviewed: main, page files at `4e657ee`. Members walked: `/careers/compiler-engineer` and `/careers/ai-ml-research-engineer`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). Walked compiler-engineer, academic-research-intern and open: the earlier fixes held (tags under the h1, grey deck, contents plate on the first screen with the contour live, JS-off chapters readable); this pass gave the dark application room's heading its light ink back (it was dark on black). copycheck missing 0 of 38/39/34/38 (compiler-engineer, academic-research-intern, open, product-designer), after wrapping Share position, the three Why Join Hanzo titles and the file hint as plain text leaves. taste/unique/parity OK (text 47/47, 46/46, 42/42, 48/48; links 2/2 each); 0 console errors (also reduced motion and JS off), no overflow at 1470 and 375. Shared, not this page: FamChapters stacks its chapters, so motion.mjs counts the covered ones' rows as dead hovers (the shown chapter's rows answer).

First complaint: "On the compiler role the button is orange and there's an orange tag line over the title. And the first screen just sits there: a big title, two buttons, and a grey box starting at the bottom."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It reads: the role at display size, Hanzo's one-paragraph summary, "Apply for this position". But **nothing moves** after the title lands (0% to 0.3% change on desktop). The contour plate starts at the fold and only its top edge shows.
2. **One in, one out?** Partly. A contents plate (01 About the Role … 06 Apply for this Role, with counts) leads into chapters with a "01 / 06" counter. The chapters are lists of responsibilities and requirements, which is fair for a job page.
3. **A real object in every section?** The contents plate (a contour in a grey card) is the only object; it is decoration more than product. For roles at an AI company, a real object is available: the team's own product (Hanzo Engine for the compiler role, the Zen models for research).
4. **One ask, sticky after the hero?** Yes: the shared ask bar carries "Apply for this position" after the hero and the header's "Try Hanzo" turns outlined. In the hero, "Apply for this position" (solid) sits beside "Email resume directly" (outlined) — fine.
5. **Every hover and press answers?** Not measured on the in-page controls (the walk's hover pass did not reach them); "Back to all careers" answers.
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** osply / hamol editorial (big title, numbered contents). Present but static.
8. **Different from its neighbours?** The two members differ only by tint and words.
9. **All 18 parts covered?** See below. `docs/build-notes/coverage/careers.md` is the index's; no family coverage file.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 on both: a mono tag line ("ENGINEERING · REMOTE · FULL-TIME", "AI RESEARCH · REMOTE / SF · FULL-TIME").
    - A UI hue on the compiler role: orange tag line, orange solid button and border, orange contour. JAMES.md allows 0 UI hues. (The research role is grey, so the hue is per member.)
11. **Copy untouched?** Yes: parity 47/47 and 48/48 text, 2/2 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 / 2.17 No-JS:** 9 of 44 text blocks stay invisible with JavaScript off ("02 / 06", "Key Responsibilities", the "0 / 4" counters). These are hidden by the page's own CSS; SYSTEM.md §11b says to scope them to `html.js`.
- **2.3 First impression:** no moving object in the first screen.
- **2.4:** 0 `data-cta`.
- **2.5 / 2.7:** per-member hue instead of the grey deck.

## Fixes
1. Move the tag line ("ENGINEERING · REMOTE · FULL-TIME") below the title or into the breadcrumb row; nothing above the h1.
2. Use the grey deck for every member: no orange button, tag or contour.
3. Bring the contents plate fully into the first screen and give it one quiet move (the counts filling once, or the contour drifting), so the page is alive on arrival.
4. Scope the chapter text's hidden state to `html.js` so it reads with JavaScript off.
5. Consider one real Hanzo object per team (Engine for compilers, Zen for research) instead of a generic contour.
