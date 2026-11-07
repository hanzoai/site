# /newsletter — James-eye review

Reviewed: main at `648b798` (page files at `57dfa0a`; shared ask fix `d2b5ab8c` in), 7 Nov 15:19 UTC, under MASTER.md. Earlier: 6/10 at `ca08189`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The form was never submitted.

Verdict: 5/10 (no card; labels over the headings; three equal big steps)

First complaint: "There's still a little label on top of the headline and another on the steps. The three steps are three big words in three equal boxes. And 'Subscribe' doesn't react when I hover."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/newsletter.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page.

**Floats over content (MASTER 3.2 rule 6):** passes: no pill on desktop, and my phone walk saw no bar over content.

**Scale and space (MASTER 3.1, fail):** the statements pass (one 88px line per screen, "New models and what they measured, the day they ship"). The dark three-step room fails: "Subscribe", "Confirm", "Read" at 44px in three equal columns, all big at once, which is also the banned three equal boxes.

## What changed since the last review
Fixed: the red is gone (0 UI hues) and the paper issue now rests after it types instead of looping. Still there: "• NEWSLETTER" above the h1, and "• THREE STEPS" above the step room's h2.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "The Hanzo newsletter", one email field, and the tilted paper issue typing Hanzo's lines, then resting.
2. **One in, one out?** Yes for a short page: hero, three statements, the step room.
3. **A real object in every section?** Paper issue, statements (type only), the step room.
4. **One ask, sticky after the hero?** The sticky header carries a solid "Try Hanzo"; "Subscribe" does not follow you. 0 `data-cta` on desktop.
5. **Every hover and press answers?** No: "Subscribe" (the page's ask) has no hover; it does press. "Privacy" has no hover.
6. **Overlap, font swap, layout shift?** No overlap. Phone layout shift 0.032 from the step list (`li.xnl-st`) moving as it arrives.
7. **Which reference, and is its motion there?** osply.co copy-in-place (type on paper). Present.
8. **Different from its neighbours?** Yes: the paper issue is its own.
9. **All 18 parts covered?** No card (cap above).
10. **Banned tells?** Labels directly above the h1 and an h2; three equal boxes in a row; everything big at once in the step room.
11. **Copy untouched?** Parity 7/7 at the last check; "Read" and "Nothing is sent to you until you do." are still not in Hanzo's copy.

## Missing from the 18 parts (MASTER, measured)
- **Part 7:** labels above headings.
- **Part 8 button states:** the page's own ask has no hover.
- **Part 13:** phone layout shift 0.032.
- **Part 17 submit states:** not exercised (the walk never sends real forms).

## Fixes
1. Write the 18-part card (lifts the cap).
2. Move "Newsletter" and "Three steps" below their headings as captions.
3. Turn the three steps into one object that changes (the paper moving Subscribe → Confirm → Read), one step big at a time.
4. Give "Subscribe" the kit hover and `data-cta`; reserve the step list's height on the phone.
