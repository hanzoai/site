# /sms-opt-in/: James-eye review
Verdict: 7/10
First complaint: "I tapped 'Cost' on my phone and nothing happened. It just went dead. And I can't even see the sign-up button without scrolling."

Walked 7 Nov 2026, 16:55 UTC, on the dev server at 1470x801 and 375x812, moving. I ran walk.mjs at both sizes, took frames at 300 and 1000 ms, ran hover, press and tap probes, sent a submit intercepted with a 503 (instant and 2.5 s delayed), and did 8 cold loads.
## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.**
   - By 1000 ms the h1 (52px) has cut in, the handset has risen and the first bubble has landed; the clock colon ticks.
   - The consent tour starts at 0.9 s. It lights What, How often, Cost, How to stop and Purchases every 1.3 s, each with its clause in the paragraph and its part of the handset, then rests at about 7.4 s. This is the one delight, and it fits Utility.
2. **One in, one out: mostly.** The page is the hero, one black room, then the footer (2488px on desktop, 5008px on phone).
   - The black room repeats the handset's three bubbles, the STOP/HELP keys and the STOP sentence. It is quieter than in run 3, but it brings no new idea.
3. **Real object in every section: yes.** The live handset mirrors the typed number ("TO 4155550123", unformatted) and the room. Neither is a picture.
4. **One ask, scale rhythm: page side yes.**
   - "Yes, sign me up!" is the only page fill. It stays disabled (black 8%) until the box is ticked and the number has 10 digits, then turns #0a0a0a.
   - Scale: h1 52, lede 21, chips 13 mono, field 16. One big thing per screen.
   - **Phone:** the submit's top sits at y813, which is 1px below the 812 fold, so it is further below at 375x667. The chips moved above the tick box (good), but they wrap to 2 rows (y451 and y503), and the 209px consent label pushes the ask off the first screen.
   - Shared: the desktop header ask swaps to a solid "Yes, sign me up!" once the form scrolls away. The phone header's "Try Hanzo" is solid.
5. **Hover and press: desktop yes, phone no.**
   - Desktop: a chip on hover inverts to a #0a0a0a fill and lights its clause and the handset part. A chip on press scales to 0.97. Submit hover goes #0a0a0a to #262626.
   - The sending state is now real: a spinner, the width held at 612px and aria-busy="true".
   - **Phone: tapping a chip does nothing.** I tested this repeatedly: tap "Cost", and aria-pressed stays false on all 5 chips, nothing lights, and the tour stops. Pointerdown on the form calls stopTour and the emulated mouseleave/blur then clears `lit`. A tap kills the delight instead of answering it.
6. **Overlap, swap, shift: none found.** There is no horizontal overflow at either size, and the h1 box holds through the cut-in.
   - **Failure is off-screen on desktop:** "Request failed (503)" sits at y755-802 on an 801 viewport, half cut. scrollY stayed 0: the `scrollIntoView` in the timeout does not take effect, which may be Lenis or the focus call with preventScroll.
7. **Reference: an apple.com product page in miniature.** The device is the hero, and one idea lights part by part. The room is not a measured scrubbed scene.
8. **Different from its neighbours: yes.** No other utility page has a mirroring handset or a consent read in parts.
9. **18 parts:**
   - Covered:
     - one h1 and one `<main id="main">`, with the skip link
     - noindex,follow
     - Field 56px, label above, autocomplete=tel, inputmode=tel
     - a custom checkbox
     - Terms and Privacy by the submit
     - success only on a 2xx: the 503 kept the number and the tick, focused the field and marked it (dashed) on the handset
     - one POST, with no double send
   - Missing: `enterkeyhint` on the field. The mirrored number is not formatted.
   - Terms/Privacy are 18px-tall inline links on phone.
10. **Banned tells: none.**
    - "SMS NOTIFICATIONS" is a caption under the h1, which is allowed.
    - No hue: taste.py OK.
    - Nothing floats over content.
11. **Copy: untouched.** parity.py gives text 11/11 and links 2/2. The failure reason uses the existing "Request failed (status)" string, as on /startups.

Console: 0 errors on 8 cold loads (4 desktop, 4 phone, with and without request interception). A hydration-mismatch badge appeared only in my 2 probe runs that waited for 'commit', so it is not counted. It is still worth checking the Clock's first render on the server and the client.

## Fixes (in order)
1. **Phone chip tap.** A tap must select and light its part and keep it lit until another tap. Bind selection to `onClick` alone on touch: gate onMouseEnter/Leave behind `(hover:hover)`, and make stopTour not clear a lit chip that the same press is setting.
2. **Phone ask above the fold at 375x812 and 375x667.** Pick from these:
   - Put the chips on one scroll-snap row instead of 2 (saves 52px).
   - Tighten the hero top padding and the h1-caption-lede gaps.
   - Let the consent label run at 14px/1.5.
   - Check that the submit's top sits at or under about 600px at 667.
3. **Failure inside the first viewport on desktop.** Make the scroll to `.xsm-err` actually happen: run it after focus, or call it through Lenis. Or place the reason box above the Terms line so it lands at about y755 without overflowing. Also put the room's STOP/HELP strip at rest, or cut it. It repeats the handset.
4. **Polish:**
   - Format the mirrored number as typed (+1 (415) 555-0123).
   - Add `enterkeyhint="send"`.
   - Give Terms/Privacy 44px tap height on phone.
   - Shared: the header ask should not offer a submit that still needs the tick box.
