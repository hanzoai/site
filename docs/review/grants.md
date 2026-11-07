# /grants — James-eye review

Reviewed: main, page files at `b220ed5`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "Gold everywhere, and a little gold label on top of the headline. Then on the internships sheet I've got two black buttons asking me different things."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "Open Source & Research Credit Grants" with Hanzo's lede, "Apply for a Grant", and a contour field that drifts by itself in a framed card, carrying Hanzo's "2,137+ repositories · 122 organizations". The card is decoration more than product, but it is alive.
2. **One in, one out?** Partly. The four steps draw across as one timeline (good), then "What Grant Recipients & Interns Receive" is a numbered text list, then the dark room where the three ways in arrive as stacked sheets that slide over each other (the best moment), then the form.
3. **A real object in every section?** Hero (contour), timeline, stacked sheets, form with a filing card: yes. The "Receive" list is text only.
4. **One ask, sticky after the hero?** Nearly. A floating pill carries "Apply for a Grant" after the hero and the header's "Try Hanzo" turns outlined on desktop, which is the right pattern. But each stacked sheet has its own solid button ("Apply for Internship", "Apply as OSS Contributor"), so two different solid asks show at once.
5. **Every hover and press answers?** "Apply for a Grant" answers on hover; no press state. "Academic Internships" does not change on hover.
6. **Overlap, font swap, layout shift?** None. Layout shift 0. A hydration error fires on desktop load (red "1 Issue" badge on localhost).
7. **Which reference, and is its motion there?** apple.com chapters (the stacked sheets) and grubogrubo's numbered tiles. Present.
8. **Different from its neighbours?** Yes: the timeline and stacked sheets are its own; the contour hero is shared with other Sigil pages.
9. **All 18 parts covered?** See below. No `docs/coverage/grants.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• GRANTS & RESEARCH", gold dot, mono caps).
    - A UI hue: gold on the dot, the timeline, the "01 / 04" labels, the giant "02" / "03" numerals, the arrows, the contour card's tint. JAMES.md allows 0 UI hues.
11. **Copy untouched?** Yes: parity 57/57 text, 5/5 links; every heading checked is Hanzo's.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.9 / 2.12 Reduced motion:** with reduced motion on, 3 animations are still running after 3 s (the plan wants none).
- **2.3 / 2.17 No-JS:** the lede ("Free API credits, GPU compute…") stays invisible with JavaScript off.
- **2.4:** two solid asks on the sheets; 0 `data-cta`.
- **2.13:** hydration error on desktop.

## Fixes
1. Remove "• GRANTS & RESEARCH" from above the h1.
2. Take the gold out: timeline, numerals, labels, arrows and the contour card in ink and greys.
3. One solid ask per view: make the sheets' buttons text links with an arrow while the "Apply for a Grant" pill is on screen.
4. Stop all looping animation under reduced motion (the contour field must freeze).
5. Turn the "What Grant Recipients & Interns Receive" list into an object (for example the filing card showing what lands in your account), or fold it into the sheets.
6. Render the lede visible without JavaScript; fix the hydration mismatch.
