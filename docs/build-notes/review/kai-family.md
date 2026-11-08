# /kai/* (family: /kai/guide) — James-eye review

Reviewed: main, page files at `507397d`. The family has one member, `/kai/guide`, walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 7/10

First complaint: "On my phone the terminal sits under the buttons and nothing moves on the first screen. And on the laptop the code flashes up in full, vanishes, then starts typing again."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop yes: "How to Use Kai" beside a terminal that types Hanzo's own `POST /v1/decisions` request and streams the answer back. A good developer first screen. But at about 0.5 s the full request shows, then clears and retypes, which reads as a flicker. **Phone:** the terminal starts below "Get an API key" and the breadcrumb; the first screen is still (0% change).
2. **One in, one out?** Yes for a developer page: question types as a spec sheet, one request in three languages, limits beside a request checker, recipes in the dark room, then the move from Jev as a diff. Each is its own screen.
3. **A real object in every section?** Yes: terminal, spec rows with small slider glyphs, code, checker, diff.
4. **One ask, sticky after the hero?** Yes: "Get an API key" in the hero (solid) and in the shared ask bar after it; the header's "Try Hanzo" turns outlined on desktop. On the phone the header's "Try Hanzo" shows solid beside the bar.
5. **Every hover and press answers?** Copy and Replay press; a pause control exists for the session (the only one in my scope so far).
6. **Overlap, font swap, layout shift?** No overlap. **Layout shift 0.058 desktop, 0.078 phone**, over the brief's 0.02 target (under Google's 0.1): the terminal and code blocks grow as they type.
7. **Which reference, and is its motion there?** motion.dev typewriter and the anthropic launch page's "try it" moment. Present.
8. **Different from its neighbours?** Yes: terminal-first, unlike the Zen pages.
9. **All 18 parts covered?** See below.
10. **Banned tells?** None: greys only, nothing above the h1 (the mono "Hanzo decision model · 0 output tokens" sits under it).
11. **Copy untouched?** Yes: parity 184/184 text, 7/7 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.11 Mobile:** the hero object is below the fold on the phone.
- **2.13 Layout shift:** 0.058 / 0.078 from typing blocks that grow.
- **2.6 Type floor:** 12px figures in the limits ("1,024", "32,768", "100").
- **2.4:** 0 `data-cta`.

## Fixes
1. Phone: put the terminal (a few lines, typing) directly under the title, before the buttons, or start it typing as soon as it peeks.
2. Reserve the terminal's and code blocks' final height so typing never pushes the page (layout shift under 0.02).
3. Start the terminal empty on first paint (render the final text only for no-JS and reduced motion), so it does not flash full and then clear.
4. Raise the 12px limit figures to 13px or more.
