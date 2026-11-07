# /sms-opt-in/: James-eye review
Verdict: 7/10
First complaint: "The button in the top corner can't make up its mind: it says Try Hanzo, then Yes, sign me up!, then Try Hanzo again while the page loads. And those big STOP and HELP buttons do nothing when I press them."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812, moving (walk helper plus own probes; submit intercepted with a 503, never sent).
## The 11 answers
1. First screen sells, and it moves.
   - The h1 (52px) cuts in by line mask (mid-cut at 150 ms). The phone's three texts arrive one by one (1 bubble at 800 ms, 2 at 1.2 s, 3 by 2 s). The chips then tour What, How often, Cost, How to stop, Purchases once, about 1 s each, lighting the matching consent clause. The clock ticks 4:30 to 4:31.
   - Against: inside the phone, about 380px of blank screen sits under the third bubble at 1470x801, and the fold cuts the phone off. The submit (748 to 796px) just fits above the fold and is disabled grey, so the first screen has no solid ask.
2. One in, one out: mostly. The form gives way to the black room, where one bubble at a time grows to 44px while the others rest at about 26px (scroll-linked). After that comes the footer: the page is 3048px with 2 scenes, so there are no dead stretches.
3. Real object: yes, in both rooms. Your typed number lands on the phone's TO line live ("TO 4155550123"). The black room re-stages the same three bubbles over STOP and HELP keys.
4. Ask and scale.
   - Header ask: 4 of 4 cold loads read "Try Hanzo", then "Yes, sign me up!" (from about 250 to 1250 ms), then "Try Hanzo", on desktop. It changes again to a solid "Yes, sign me up!" once you scroll past the form. On phone it stays "Try Hanzo" all the way down.
   - At 375x812 the submit's top is at 867px, below the fold (MASTER part 11 wants the primary above it at 375x667).
   - Nothing floats over content. Scale has rhythm: 52 / 21 / 16 / 12px on screen 1, and one 44px bubble at a time in the black room.
5. Hover and press.
   - Chips: hover inverts them to ink (#0a0a0a, white text), press scales to 0.974, with no layout jump.
   - The submit only darkens on hover (to #2c2c2e, which is not a deck value) and adds no transform.
   - STOP and HELP (220x64 white keys in the black room, plus the phone's keys) are plain `<span>`s with cursor auto. They look like buttons, but hover and tap do nothing.
6. Overlaps and shift.
   - No overlap at either size, and no horizontal overflow.
   - Console: 0 errors on 4 of 4 cold loads. A "1 Issue" badge appeared once in a run that intercepted every POST, but it did not come back on 8 later cold loads, so it is not counted.
   - The header-ask label swap above is a visible shift in the header.
7. Reference: Apple product page (the object is the product, one idea per screen), plus a calm Utility form. The pinned/scrubbed black room is a real, if small, Apple move.
8. Distinct: yes. No other page uses an SMS phone that mirrors your input. Its signature is its own.
9. 18 parts: the form states mostly hold.
   - Disabled until consent.
   - On a 503 the entries stay (number and tick kept) and the reason shows.
   - Labels use `for`, and the chips are 44px tall.
   - Gaps:
     - The failure line is the raw "Request failed (503)", with no next step.
     - The input's focus ring turns dashed after submit.
     - The checkbox box is 26x26, but its 612x132 label carries the tap.
10. Banned tells: none found. The "SMS NOTIFICATIONS" eyebrow sits under the h1, not above it. No hue: every value is grey, except the #2c2c2e hover.
11. Copy: `parity.py /sms-opt-in/` gives OK (text 11/11, links 2/2).
## Fixes (in order)
1. Stop the header ask flicker on load. Hold "Try Hanzo" until the form's submit has actually been measured out of view; do not swap during arrival. On phone, make the swap behave the same as on desktop.
2. Make STOP and HELP answer or stop looking like buttons. Either press them (translateY 1px plus a tick sound) to light the "How to stop" clause and send a reply bubble into the phone, or restyle them as keycaps that clearly are not controls.
3. Fill or shorten the phone's empty lower half on desktop, for example by ending the conversation with the STOP/HELP keys nearer the third bubble, so the object reads complete above the fold.
4. At 375x812, bring the submit above the fold. Tighten the lede-to-form gap (about 72px) and the consent block, or let the chips wrap into one row of scrollable pills.
5. Use deck values on the submit hover (#171717 or #262626) and add the 0.98 press, so the primary ask answers like the chips do.
6. Rewrite the visible failure state to read as a sentence in the form's own voice. Copy is frozen, so if no Hanzo wording exists, keep the reason and add only a retry affordance. Keep the solid focus ring after submit.
