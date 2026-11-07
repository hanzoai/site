# /sms-opt-in — James-eye review

Reviewed: main at `4b53974` (re-walked 14:43 after the site-wide palette recolour), under MASTER.md. First review at `85bb6b6`: 6/10. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The form was never submitted.

Verdict: 5/10 (scale fails; no card)

First complaint: "In the dark part, three giant message bubbles sit on top of each other at the same huge size, with nothing small around them. And there's still a little label over the headline."

**Cap: part card (MASTER section 6).** There is no `docs/coverage/sms-opt-in.md`. Capped at 7 until the card is copied from `docs/coverage/_TEMPLATE.md` with 18 `Done here:` lines true on the page. The shared desktop ask bar floats over content (site-wide, see `_shared.md`); not counted against this page.

**Scale (MASTER 3.1, fail):** the dark room stacks three 72px bubbles ("Two-factor authentication codes", "Account and security alerts", "Transactional notifications") with no medium or small text beside them: everything big at once. Let each message arrive at display size and shrink to medium as the next one lands, so one is big at a time.

## What changed since the first review
The palette recolour took the indigo out (0 UI hues measured). Nothing else changed.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "Get Hanzo text messages", Hanzo's line, the number field, and a phone receiving Hanzo's three message kinds. The phone keeps cycling them (a loop).
2. **One in, one out?** Yes for a short page: hero, then the dark room, then STOP / HELP.
3. **A real object in every section?** Yes: phone, message bubbles, STOP / HELP keys.
4. **One ask, sticky after the hero?** Desktop yes ("Yes, sign me up!" in the shared ask bar). On the phone only the header's solid "Try Hanzo" was seen sticking; the page's own ask did not.
5. **Every hover and press answers?** Yes on the five disclosure chips (hover and press).
6. **Overlap, font swap, layout shift?** None on the page; layout shift 0.
7. **Which reference, and is its motion there?** osply / grubogrubo type-led scenes. Present.
8. **Different from its neighbours?** Yes.
9. **All 18 parts covered?** No card (cap above).
10. **Banned tells?** Eyebrow above the h1 ("• SMS NOTIFICATIONS"); a looping demo; everything big at once in the dark room.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts (MASTER, measured)
- **Part 7:** label above the h1.
- **Part 9:** the hero phone loops; demos should play once and rest.
- **Part 17:** success only on a 2xx (TCPA record) not verified; the walk never submits.

## Fixes
1. Write the 18-part card (lifts the cap).
2. Move "SMS notifications" below the h1 as a caption.
3. Dark room: one bubble big at a time; the others medium.
4. Let the hero phone receive its three messages once and rest; put "Yes, sign me up!" in the phone's ask bar.
