# /sms-opt-in/: James-eye review
Verdict: 7/10
First complaint: "On my phone I get a picture of a phone and I have to scroll a whole screen to find where my number goes. And when it fails it just sits there, it doesn't tell me anything."

Walked 2026-11-07 16:24 UTC on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving. Submit tested only with the POST to api.hanzo.ai aborted by page.route.

## The 11 answers
1. **5 s / 1 s.** Desktop sells: h1, lede, field, consent and the solid submit all fit 801px (submit bottom at 795px), and the h1 cuts in by line plus the handset rises within 1 s (frames 700 ms apart differ). Phone does not: the 340px handset sits between lede and form, so the "Mobile phone number" label lands at y 800 and the submit at about y 1345, below the first screen.
2. **One in, one out.** Mostly. The dark room is a real scrubbed scene: the three message kinds take turns at 44px while the others rest at 26px (32/21 on phone), measured at scroll 840 to 1320. But between the legal line (ends ~y 850) and the dark room (starts y 1119) is ~270px of dead white where nothing happens, and the handset's middle is ~400px of empty screen.
3. **Real object per section.** Yes: a live handset (visitor's clock with a blinking colon, the "To" line mirrors the typed number, STOP/HELP keys), then the bubble stage. Footer as usual.
4. **One ask, nothing floating, scale.** Desktop: header shows outlined "Try Hanzo" while the hero submit is the one solid, then swaps to solid "Yes, sign me up!" once the form leaves view. Good. Phone: header keeps a solid black "Try Hanzo" the whole walk (never swaps), so phone has two solid asks in the form viewport with different words. Scale has rhythm: h1 52px (40 phone), lede 21, body 16, one 44px bubble at a time.
5. **Hover and press.** Consent chips invert to ink on hover and press to scale 0.971; submit darkens to #2c2c2e on hover. The chips auto-tour once (~6.5 s: How often, Cost, How to stop, Purchases), lighting the consent words and the matching part of the handset, then rest; a tap stops it. That is a good idle-plus-state moment.
6. **Overlaps, swap, shift.** No overlap or horizontal scroll at either size. Console: a hydration-attributes mismatch error on every load, and the Next dev "1 Issue" red badge sits bottom-left over the page at both sizes. Fails DONE item 3.
7. **Reference.** Apple product page in miniature (the device is the hero, one scrubbed scene). The scrub is genuinely there; the card-to-page and pointer kinds are absent, which is fine for a utility page.
8. **Neighbours.** Own hero medium (a handset you fill in) and own signature (consent that reads itself and lights the phone). Distinct.
9. **18 parts.** Gaps: robots meta is "index, follow" (part 14 wants noindex,follow for sms-opt-in); failed send shows no words (part 17, and 4.5: "on failure the entries stay and the reason shows"): the field gets a dashed ring and focus, nothing else; submit has no busy/pressed state while sending (`aria-busy` null); entering "12" and blurring shows no inline error. Privacy and Terms sit under the submit (good). Inline Terms/Privacy links are 18px tall on phone.
10. **Banned tells.** None found. "SMS NOTIFICATIONS" is set as a caption under the h1, which the rules allow. No hue; checkbox is custom (native at opacity 0).
11. **Copy.** Hero, consent and legal read as Hanzo's. The chip labels (What, How often, Cost, How to stop, Purchases) are new UI strings; confirm they are in `content/ui-strings.json`.

## Fixes (in order)
1. Phone composition: put the field, consent and submit directly under the lede; move the handset below the form (or shrink it to a 120px strip showing only the "To" line and one bubble). The submit must be in the first 812px.
2. Failure state: show Hanzo's existing error string beside the submit in words (role=alert), keep the entries, and give the submit a 200-400 ms `aria-busy` pressed state while sending. On a refused send let the handset show a failed bubble so the object answers too.
3. Kill the hydration mismatch (red "1 Issue" badge, console error) and set robots to `noindex,follow`.
4. Close the ~270px dead white between the form and the dark room so the bubbles arrive as the form leaves (40px overlap), and fill or shorten the empty middle of the desktop handset (it could hold the success bubble's slot).
5. Phone header: swap to the page's ask (or go quiet) the way desktop does, so there is one solid fill per viewport.
