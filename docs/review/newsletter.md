# /newsletter — James-eye review

Reviewed: main, page files at `ca08189`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Verdict: 6/10

First complaint: "A red dot label on the headline and red marks on the paper. The issue keeps rewriting itself over and over. And 'Subscribe' doesn't react when I hover over it."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "The Hanzo newsletter", one email field with "Subscribe", and a tilted paper issue that types Hanzo's three lines ("New models and what they measured…"). Clear and alive. But the paper keeps erasing and retyping its lines (seen again at 9–11 s), which is a loop.
2. **One in, one out?** It is a short page and that suits it: hero, three statements that swell in weight as you scroll, then a dark room with Subscribe → Confirm → Read. No document feel.
3. **A real object in every section?** Paper issue, weighted statements, the three-step room: yes, though the statements are type only.
4. **One ask, sticky after the hero?** Yes: a floating pill carries "Subscribe" after the hero, and the header's "Try Hanzo" turns outlined on desktop. On the phone the header's solid "Try Hanzo" shows beside the pill.
5. **Every hover and press answers?** No. "Subscribe" has no hover change (it does press); the "Privacy" link has no hover.
6. **Overlap, font swap, layout shift?** No overlap. Phone layout shift 0.033 (over the 0.02 target, under Google's 0.1). No console errors.
7. **Which reference, and is its motion there?** osply.co copy-in-place feel (type on paper, a drawn tick when sent). Present.
8. **Different from its neighbours?** Yes: the paper issue folding into an envelope is its own.
9. **All 18 parts covered?** See below. No `docs/coverage/newsletter.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• NEWSLETTER", red dot, mono caps).
    - A UI hue: postmark red on the dot, the paper's rings and marks, the step "01" chip, and a red outline on the email field. JAMES.md allows 0 UI hues.
    - A looping demo (the paper retypes).
11. **Copy untouched?** Mostly: parity 7/7. The step labels "Read" and "Nothing is sent to you until you do." and the paper's "The newsletter" are not in Hanzo's copy.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 / 2.17 No-JS:** the lede ("Releases, benchmarks and engineering notes…") stays invisible with JavaScript off.
- **2.8 Button states:** "Subscribe" has no hover.
- **2.4:** 0 `data-cta`; on the phone two solid buttons after the hero.
- **2.17 Submit states:** not exercised (the walk never sends real forms).

## Fixes
1. Remove "• NEWSLETTER" from above the h1.
2. Take the red out: dot, rings, chip and field outline in ink and greys (the focus ring per CANON).
3. Let the paper type its lines once and rest.
4. Give "Subscribe" a hover that changes something (not opacity) and keep its press.
5. Replace "Read", "Nothing is sent to you until you do." and "The newsletter" with Hanzo's words, or get James's yes.
6. Render the lede visible without JavaScript; on the phone keep only one solid button after the hero.
