# /sms-opt-in — James-eye review

Reviewed: main at `25b197c` (page files at `57dfa0a`), 7 Nov 14:59 UTC, under MASTER.md. Earlier: 6/10 at `85bb6b6`, 5/10 at `4b53974`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The form was never submitted.

Verdict: 4/10 (a blank bubble; everything big at once; the pill floats; no card)

First complaint: "Scroll down and the third message is just an empty white box. And the other two are giant, with that pill sitting over them at the bottom."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/sms-opt-in.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page.

**Floats over content (MASTER 3.2 rule 6, fail, cap 6):** at 1470×801 the shared pill ("Get Hanzo text messages · search · Yes, sign me up!") sits over the dark room once the hero is past. Turn it off on this page (`data-ask="off"` on `<main>`) and let the header carry the ask.

**Scale (MASTER 3.1, fail):** the dark room stacks three 72px bubbles ("Two-factor authentication codes", "Account and security alerts", "Transactional notifications") with nothing medium or small beside them except the STOP / HELP line: everything big at once.

## What changed since the last review
Only the motion: springs became short eases (`57dfa0a`). The hero phone now rests after it lands (under 1% change when idle). The layout and words are the same.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "Get Hanzo text messages", Hanzo's line, the number field and the phone land within the first second, then rest.
2. **One in, one out?** Yes for a short page: hero, then the dark room, then STOP / HELP.
3. **A real object in every section?** Yes: phone, message bubbles, STOP / HELP keys.
4. **One ask, sticky after the hero?** Desktop: only through the floating pill (fail above); the header keeps "Try Hanzo". Phone: the header's "Try Hanzo", not the page's ask.
5. **Every hover and press answers?** Four of five disclosure chips answer; **"Cost" does nothing on hover** (it does on press).
6. **Overlap, font swap, layout shift?** **The third bubble's words are invisible**: "Transactional notifications" is `#f5f5f7` text on a `#f5f5f7` bubble, so James sees an empty white box. The pill floats over content (above). Layout shift 0.0002 and 0.
7. **Which reference, and is its motion there?** osply / grubogrubo type-led scenes. Present.
8. **Different from its neighbours?** Yes.
9. **All 18 parts covered?** No card (cap above).
10. **Banned tells?** Eyebrow directly above the h1 ("SMS NOTIFICATIONS", 12px); a floating pill over content; everything big at once.
11. **Copy untouched?** Words unchanged since the parity-clean first review, but one of Hanzo's three message kinds cannot be read.

## Missing from the 18 parts (MASTER, measured)
- **Part 12 accessibility (contrast):** one bubble at 1:1 contrast.
- **Part 4 conversion:** the ask lives in a floating pill, not the header.
- **Part 7:** label above the h1.
- **Part 17:** success only on a 2xx (TCPA record) not verified; the walk never submits.

## Fixes
1. Give the third bubble dark ink (or a dark fill like the other two) so "Transactional notifications" reads.
2. Dark room: one bubble big at a time, the others medium, so the scale has rhythm.
3. Turn the pill off here (`data-ask="off"`) and put "Yes, sign me up!" in the sticky header.
4. Move "SMS notifications" below the h1 as a caption; give the "Cost" chip the same hover as the others.
5. Write the 18-part card (lifts the cap).
