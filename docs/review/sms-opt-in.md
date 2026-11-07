# /sms-opt-in — James-eye review

Reviewed: main, page files at `85bb6b6`. Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The form was never submitted.

Verdict: 6/10

First complaint: "Purple message bubbles and purple chips, like an iPhone, not like us. And a little label sitting over the headline again."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes: "Get Hanzo text messages", Hanzo's line on what you get, the phone-number field, and a phone beside it where Hanzo's three kinds of message arrive one by one. A real, readable object. It keeps cycling the messages (a loop).
2. **One in, one out?** Yes for a short page: the dark room brings the three messages in at display size as you scroll ("Two-factor authentication codes", "Account and security alerts", "Transactional notifications"), then STOP / HELP.
3. **A real object in every section?** Phone, display-size messages, STOP / HELP keys: yes.
4. **One ask, sticky after the hero?** Yes on desktop: the shared ask bar carries "Yes, sign me up!" after the hero and the header's "Try Hanzo" turns outlined. On the phone the bar did not show in the walk; only the header's solid "Try Hanzo" was sticky.
5. **Every hover and press answers?** The disclosure chips (What, How often, Cost, How to stop, Purchases) answer; one fills purple when chosen.
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** osply / grubogrubo type-led scenes. Present.
8. **Different from its neighbours?** Yes: the phone and the message scene are its own.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• SMS NOTIFICATIONS", mono caps).
    - A UI hue: indigo on the third message bubble, the chosen chip and the avatar. JAMES.md allows 0 UI hues.
    - A looping demo in the hero phone.
11. **Copy untouched?** Yes as measured (parity clean); the consent text is Hanzo's.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.17 Submit states:** not exercised (no real submission). PLAN 2.17 requires success only on a 2xx for this page (TCPA record); check it before sign-off.
- **2.4 / 2.11:** no phone ask bar seen; 0 `data-cta`.

## Fixes
1. Remove "• SMS NOTIFICATIONS" from above the h1.
2. Take the indigo out: bubbles, chips and avatar in ink, greys and white (the inverted bubble can be ink on white).
3. Let the hero phone receive its three messages once and rest.
4. Show "Yes, sign me up!" in the phone's ask bar after the hero.
5. Confirm the form shows success only on a 2xx and keeps the number on failure.
