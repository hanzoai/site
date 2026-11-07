# /sms-opt-in/: James-eye review
Verdict: 7/10
First complaint: "It's a one-box form and I read the same three lines four times: in the intro, in the tick box, on the phone, and then again huge in a black room I had to scroll through. Say it once."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812, moving (walk.mjs both sizes, frames at 300/1000/1700/3000/6000 ms, hover/press probes, 503-intercepted submit, 8 cold loads).
## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.**
   - By 1000 ms the h1 (52px) has cut in, the phone has risen and its first bubble has landed; the clock colon ticks each second.
   - At 0.9 s the consent "tour" starts. Each of the five chips lights in turn every 1.3 s and highlights its clause in the paragraph and on the phone (Cost lights the To line, How to stop fills STOP/HELP). It then rests at about 7.4 s. This is the page's real moment.
2. **One in, one out: half.** Hero, then one black room, then the footer: 2942px on desktop.
   - The black room replays the phone's three bubbles at 44px/26px, taking turns as you scroll, over STOP/HELP keys that repeat the phone's.
   - It brings no new idea. MASTER 4.5 says "no scroll theatre, at most one delight", and this is a second delight made of scroll theatre.
3. **Real object in every section: yes.** A live handset that mirrors the typed number ("TO 4155550123", not formatted) and the bubble room. Neither is a picture.
4. **One ask, scale rhythm: page side yes.**
   - "Yes, sign me up!" is the only filled control in the hero. It stays disabled (black 8%) until the box is ticked and there are 10 digits, then turns to #0a0a0a.
   - Scale: h1 52, lede 21, chips 13 mono, form 16. That is good rhythm on the first screen.
   - In the room, one 44px bubble against 26px bubbles also reads as rhythm, but it is the same words again.
   - Shared: the header ask swaps from "Try Hanzo" to a solid "Yes, sign me up!" once the hero ask scrolls away. That fires a submit that still needs the tick box. The phone header's "Try Hanzo" is a solid fill.
5. **Hover and press: yes, with one gap.**
   - Chips invert on hover (white to #0a0a0a fill, border ink). Submit hover goes #0a0a0a to #262626, press scales 0.97. Room STOP/HELP hover goes #fafafa to #e4e4e7, press goes to graphite and lights its half of the sentence.
   - Gap: a submit fulfilled at once with a 503 showed no visible sending state (label unchanged, no aria-busy at 150 ms).
6. **Overlap, swap, shift: none found.**
   - No horizontal overflow at either size. The h1 box holds through the cut-in.
   - The form card rises 16px at 0.4 s by transform, so there is no CLS.
   - Phone: the five chips sit below the submit (y765-861), cut off at the fold. The tour lights clauses in the paragraph above while its own chips are out of view.
7. **Reference: apple.com product page in miniature.** The device is the hero and one idea sits in the room. The measured part is not there yet: the room is a scroll-indexed class swap, not a scrubbed scene.
8. **Different from its neighbours: yes.** No other utility page has a mirroring handset or a consent read in parts.
9. **18 parts:**
   - Covered: one h1, Field at 56px with label above, autocomplete=tel, inputmode=tel, 16px on phone, custom checkbox, Terms and Privacy by the submit, failed submit keeps number and tick and refocuses the field, payload matches live.
   - Missing: enterkeyhint (empty).
   - Terms/Privacy links are 18px tall on phone.
   - Failure copy is "Request failed (503)", which is a status code, not words. It sits half below the fold at 1470x801 (y756).
   - The black room is full-bleed from the first pixel, not a card opening out.
10. **Banned tells: none.**
    - "SMS NOTIFICATIONS" is set under the h1 as a caption, which is allowed.
    - No hue, no gradient text, no floating bar.
    - The active chip, enabled submit and header ask can be three ink fills in one viewport.
11. **Copy: untouched.** parity.py: text 11/11, links 2/2.

Console: 0 errors on 8 cold loads (4 desktop, 4 phone). A hydration-mismatch badge ("A tree hydrated but some attributes of the server rendered HTML didn't match...") appeared only in the 2 runs that used request interception, so it is not counted. Worth a look at the Clock's server/client first render.

## Fixes (in order)
1. Cut the black room's scroll-scrubbed bubbles. It repeats the phone. Utility allows one delight, and the mirroring phone plus the consent tour is that delight. If a second screen is kept, keep only STOP/HELP with its sentence lighting, at rest, as a quiet strip, not a 44px scroll scene.
2. Phone: put the five chips above the tick box (between the field and the consent) so the tour and the clause it lights share one screen. Show the handset as a short crop (45svh or less) rather than a full device after the form.
3. Failure state: show the reason in plain words next to the submit, inside the first viewport. Add a visible sending state on the submit (aria-busy, label kept, width kept). Briefly reflect the failure on the handset (the bubble does not arrive) so the signature answers both outcomes.
4. Polish: format the mirrored number as typed (+1 (415) 555-0123); add enterkeyhint="send"; bring Terms/Privacy tap height to 44px on phone. Shared: the header ask should not offer a submit that needs a tick box.
