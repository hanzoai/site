# /sms-opt-in/: James-eye review
Verdict: 7/10
First complaint: "The phone already shows me the three messages and the STOP and HELP buttons. Then I scroll and get the exact same thing again, flat, in a big black box where nothing happens. Say it once."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812, moving. I ran walk.mjs at both sizes and took frames at 150, 850 and 3350 ms. I probed hover, press and tap on all 5 chips, the field, the checkbox, the submit and both dark-room buttons. I sent submits intercepted by page.route (503, then 200; nothing went out for real) and did 4 cold loads in fresh contexts.

## The 11 answers
1. **5 s / 1 s: yes.** On desktop the h1 (52px), lede, field, consent and submit (y695-743) all fit in 801px, with the phone beside them. Within 1 s the h1 cuts in by line mask, the lede and form rise, and the three bubbles arrive one after another (`xsm-in`). The chip rail then steps through What, Cost and How to stop on its own about every 2 s, then stops. The phone's clock colon ticks. On a 375px phone the submit sits at y671 and is in view.
2. **In/out: mostly a single form, then a repeat.** The page is short: 2488px desktop, 4859px phone, most of it footer. After the hero, the only section is a black room. It restates the three kinds, the STOP/HELP pair and the STOP/HELP sentence the phone already showed. On phone the two come back to back (p-01): the phone at y~160-520, then the room starting at y~590 with the same bubbles.
3. **Real object: yes in the hero, weak below.** The phone is a real working object: the TO line mirrors what you type, each chip lights its clause in the consent and its part of the phone, and on success a "You're opted in" bubble lands. The black room holds only 3 grey pills and 2 white 220x64 toggles: no object, and no motion until tapped.
4. **Ask and scale: correct.** One solid fill on the page, the submit, which stays disabled until consent is ticked. Nothing floats over content. Scale: one 52px h1, then 21px, 16px and 12px mono: good rhythm. *Shared:* the header ask starts solid "Try Hanzo" at 150 ms, settles to outlined, then swaps to solid "Yes, sign me up!" over the footer and after success, so two solid fills show on phone (header and chip). The glass header also blurs the phone's shadow into a grey smudge at x~880-1300 once the page scrolls.
5. **Every tap answers: yes.** Chip hover fills ink with white text (not opacity). Press scales to 0.971. A tap scrolls the phone rail to the chosen chip and marks its clause. The STOP/HELP hover changes the fill (#fafafa to #e4e4e7); pressing one darkens it and marks its half of the sentence. The submit hover is #262626. No jumps.
6. **Overlap and shift: clean.** CLS is 0.0002 on desktop and 0 on phone. No horizontal scroll (scrollWidth 1470 and 375). No overlaps. Console: 0 errors on 4 of 4 cold loads. One hydration-attribute mismatch appeared once, on a 5th load, so it is not counted.
7. **Reference: chatgpt enterprise calm.** Quiet and well spaced, and the live phone is a motion.dev-style state demo done with restraint. That suits Utility (MASTER 4.5): one delight, and here it is the phone answering the form.
8. **Different from neighbours: yes.** A live phone mirroring a form is its own idea. No other Utility page uses it.
9. **18 parts: largely covered.** Field: 56px, 21px text, tel/tel/tel. Custom checkbox, 26px box inside a 612x132 label. Privacy and Terms are in the submit viewport. Idle, sending, failed and sent states all exist. Gaps:
   - Desktop failure: "Request failed (503)" sits in a grey pill shaped like a disabled button, exactly where the submit was (y695). It pushes the live submit to y762-809, cut by the 801 fold.
   - The phone chip rail (555px inside 375px) has no scroll-snap and no peek mask. "How to s" is cut flush against the screen edge.
   - Inline Terms and Privacy links are 18px tall.
10. **Banned tells: none of weight.** "SMS NOTIFICATIONS" is set below the h1 as a caption (allowed). The 3 pills in a row in the black room are uneven widths, not equal boxes, but they are the page's weakest look.
11. **Copy: intact.** The consent paragraph sits beside the submit. The three kinds and the STOP/HELP sentence are on the page. The failure uses the existing "Request failed (status)" string. The success panel's number shows as typed (4155550123): display only, no copy change.

## Fixes (in order)
1. **End the repeat.** Make the phone the single home of the three kinds and STOP/HELP: give its bubbles the real text, and wire its STOP/HELP to the sentence highlight. Then fold the black room down to the frozen STOP/HELP sentence under the phone, or give the room a job the phone does not do, e.g. play the STOP reply in the phone as you reach it. On phone, never stack the phone mock directly on top of a room that repeats it.
2. **Failure state on desktop.** Put the failure reason below the submit, or style it as an inline alert with a mark rather than a button-shaped grey pill. Keep the live submit above the 801 fold (it is now at y762-809).
3. **Phone polish.**
   - Add `scroll-snap-type: x proximity` to the chip rail, with a peek and an edge fade, so the cut "How to s" reads as a rail.
   - Format the TO line and the success number as you type (+1 (415) 555-0123), as a display only.
   - On phone, crop the mock without the white fade that hides "Transactional notifications". *Shared:* fix the header ask's solid-then-outline flicker on load.
