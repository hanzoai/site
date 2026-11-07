# /solutions/* (template) — James-eye review

Reviewed: main, page files at `9cffbc7` (the v3 pass of 14:08: ink only, no eyebrows). Members walked: `/solutions/finance` (re-walked after the v3 pass) and `/solutions/engineering`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "This finally feels like one of ours: black film, big type, one button. But it goes on too long. After the five jobs there are four more sections, and by 'Security and compliance' I've stopped reading."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on both sizes. "Hanzo for finance teams" beside a black film card that plays the team's jobs as stories ("01 Reconcile against a ledger that balances", with a progress bar and the products it uses as chips). The film is Hanzo's own.
2. **One in, one out?** Yes for the jobs: each pins with its own giant numeral ("01") and film while the words change. After that the page turns back into sections: "What it runs on", "Security and compliance", "More teams", "Put it to work".
3. **A real object in every section?** Jobs, yes. The later sections are lists and cards.
4. **One ask, sticky after the hero?** Yes: "Try Hanzo" solid in the hero with "Contact sales" outlined, then carried by the shared ask bar; the header's "Try Hanzo" turns outlined. Four `data-cta` tags present (the only template in my scope wiring them).
5. **Every hover and press answers?** Not exercised beyond the hero buttons, which answer.
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** apple.com product page (pinned chapters, product as hero) and synchronized.studio (more teams as cards that open). Both present.
8. **Different from its neighbours?** Members share the film and layout; each team has its own film still and jobs. Acceptable for a family.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None on the v3 pass: greys only, the "SOLUTIONS · TEAMS" label moved under the buttons.
11. **Copy untouched?** Yes: parity 50/50 and 43/43 text, 19/19 and 17/17 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 Narrative:** after the jobs, four sections in a row; plan says one idea per screen, detail behind a click.
- **2.10 Media:** 2 raw `<video>` elements remain on finance (the rest go through the kit).
- **2.11 Mobile:** after the hero the phone is mostly still; the job chapters stack.

## Fixes
1. Fold "What it runs on" and "Security and compliance" into one sheet or drawer opened from the last job; keep "More teams" as the rail of cards that open.
2. Route the last two raw videos on finance through the kit `<Film>`.
3. On the phone, let each job's film play as it reaches the middle of the screen, so the stacked chapters move.
