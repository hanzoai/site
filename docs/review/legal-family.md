# /legal/* (template) — James-eye review

Reviewed: main, page files at `de3afb9`. Members walked: `/legal/acceptable-use` and `/legal/cookies`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "A 'LEGAL' label over the headline again, and one policy has a lilac cover and the other a beige one. A legal page should be calm, black and white. And where does '6 min read' come from? We never wrote that."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes for what it is: "Acceptable Use Policy" at display size, Hanzo's one-line summary, and the version and effective date in mono. On desktop the first screen is still after the headline lands (the cover card with its contour is below the fold); on the phone the cover's contour drifts on screen. For a legal page that calm is acceptable, but the cover should be in view.
2. **One in, one out?** As a document, yes, and that is right for Utility: a cover card (contents plus "Sections 5 · Min read 6"), then the policy with a contents rail.
3. **A real object in every section?** The cover card; then text, as it should be.
4. **One ask, sticky after the hero?** A floating "Try Hanzo" pill follows you, beside the header's solid "Try Hanzo", so two solid buttons show. PLAN-COMPONENTS (2.4 thumb bar) says none on legal pages at all.
5. **Every hover and press answers?** The contents links answer on hover; no press states.
6. **Overlap, font swap, layout shift?** None; layout shift 0. A hydration error fires on desktop load (red "1 Issue" badge on localhost).
7. **Which reference, and is its motion there?** apple.com legal / osply editorial: quiet type, contents rail. Fine.
8. **Different from its neighbours?** The members differ only by tint.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 on both ("LEGAL", mono caps).
    - UI hues per member: lilac cover and purple "1." on acceptable-use, beige cover and gold "1." on cookies. JAMES.md allows 0 UI hues.
11. **Copy untouched?** Parity is clean (88/88 and 61/61 text). But the cover adds a number Hanzo never wrote: "Min read 6" / "Min read 2" (computed by the template), plus the labels "Sections" and "Min read".

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.4 Thumb bar:** the plan says none on legal; here a sticky "Try Hanzo" pill shows.
- **2.5 Legal typesetting:** 68ch measure and sticky index are there; print styles not checked.
- **2.6 Type floor:** 10 cookie names set at 12px on /legal/cookies (plan floor is 13px).
- **2.13:** hydration error on desktop.

## Fixes
1. Remove "LEGAL" from above the h1 (the breadcrumb or the page title can carry it).
2. One neutral cover for every legal page: no lilac, beige, purple or gold.
3. Drop the computed "Min read" figure (or get James's yes for it); keep "Sections" only if it is a plain count of Hanzo's own headings.
4. Remove the sticky "Try Hanzo" pill on legal pages, per the plan.
5. Bring the cover card into the first screen on desktop (shorter gap under the summary).
6. Raise the cookie-name table to 13px; fix the hydration mismatch.
