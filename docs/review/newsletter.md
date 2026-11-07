# /newsletter: James-eye review (independent critic, 7 Nov, third pass)

Verdict: 7/10
First complaint: "Why am I reading the same three lines over and over? They're on the paper, then I scroll and they're there again big, and again on another paper. And when the next line comes in it runs straight over the little number."

Walked moving at 1470×801 (hover-capable pointer) and 375×812 (touch) with the cookie bar dismissed. Frames were taken about 1 s apart on every screen, with a wheel-scroll and video recording and a layout-shift observer. The subscribe POST was intercepted: it sent `{email, source: "hanzo.ai/newsletter", locale: "en-US"}` and nothing left the machine. Parity: `/newsletter: OK text 7/7 links 3/3`. taste.py: OK. A clean load gives 0 console errors and no horizontal scroll at either size. The hydration warning and red badge seen in one run came from my own screenshot tool, which hid the caret on the input before hydration, so they are not counted. Proof images: `img/newsletter-counter-overlap.jpg` (desktop, mid-swap) and `img/newsletter-phone-repeat.jpg` (phone, the same three lines twice on one screen).

## The 11 answers

1. **Sells in 5 s, moves in 1 s?** Yes, at both sizes. The h1 cuts in by line at 52px (40px on phone). The paper rises at 200 ms and sets its three lines like type, and the Sigil in the masthead drifts on its own. On phone the h1, lede, field and Subscribe all sit in the first 410px, with the paper peeking below. Typing writes your address on the paper ("To ada@example.com"), which is the best detail on the page.
2. **One in, one out, or a document?** On desktop, yes: two pinned scenes. The first sets each statement at 44px and onto a second paper. The second is a dark room that walks the four opt-in steps at 64px; scroll drives it, and if you leave it alone it walks itself. On phone it reads as a list. Below the hero paper come the same three lines as three rows, then a 28px step word with the same word repeated in the rail directly under it.
3. **A real visual in every section?** The hero has the paper. The Inside scene has a second paper, which is the same object in the same pose and only redraws what the hero already showed. The dark room has a big word and a rail but no object. On phone the Inside scene has no object at all: the paper is hidden there and only the rows remain.
4. **One ask, sticky header, rhythm?** On desktop the header changes to "Subscribe" after the hero and keeps it through the dark room, which is good. But in the dark room the header's white Subscribe and the room's white "Subscribe ↑" are both solid fills on the same screen, so there are two solids with the same label. On phone the room's button is outlined, which is correct. Scale has rhythm: one 44 or 64px thing per screen, with 13px indexes and 17px rows.
5. **Hover and press answer, no jumps?**
   - Subscribe darkens and presses to 0.98.
   - The paper tilts up to 2.5° toward the pointer.
   - The steps brighten and underline, press to 0.97 and hold, and the rail marker glides.
   - The "Subscribe ↑" arrow lifts 3px. The mark brightens. The Privacy underline thickens to 2px.

   There are two gaps. Pressing a step makes no sound: the steps carry no `role=tab`, `aria-pressed` or `data-sound`, so the kit's tick never fires. And the "Enter an email address…" error with its dashed border stays up after you type a valid address; it only clears on the next submit.
6. **Overlap, font swap, layout shift?**
   - **Overlap (desktop):** on every step of the Inside scene, the outgoing 44px statement slides up through the "02 / 03" counter, because the counter sits inside the same 172px mask box. You see it 3 times per pass, 600 ms each (proof jpg).
   - **Shift:** after a successful submit the paper (4:5) swaps for the envelope (16:10). The swap measured CLS 0.053 at 375 (0.07 in one run), which is over the 0.05 line, and 0.024 at 1470. All of it comes from `.xnl-tilt` re-centring as the form's box changes.
   - **Fonts:** no font swap; the h1 box holds.
7. **Which reference, and is its motion there?** On desktop it borrows apple.com: one idea per screen and a pinned stage where one panel changes. The scrub, the line-mask swaps and the word-by-word inking are real. The paper folding into the envelope has synchronized.studio's sense of an object changing state. On phone the pinned scenes are gone and none of that comes through.
8. **Different from its neighbours?** Yes. The paper issue takes your address and folds into an envelope; that belongs to this page.
9. **18 parts covered?** Mostly. There is one h1. The kit `Cta` carries `data-cta`/`data-thumb`, and the Privacy link sits in the submit viewport. The form has idle, sending, failed and sent states, and success shows only on `status: pending`, so the double opt-in is respected. Reduced-motion and JS-off rules are present. Gaps:
   - the sent-state shift;
   - two solids in the dark room;
   - steps without sound;
   - the error not clearing on input;
   - the Privacy link's touch target is 18px tall;
   - the phone field is 44 to 52px, not the 56px `Field`.
10. **Banned tells?** None hard. There is no hue (taste OK), no fade on hover, nothing floating over content, and no eyebrow over the h1 or h2. Borderline: a mono "02 / 03" counter sits directly above the 44px statement, which reads like a label over a headline.
11. **Copy untouched?** Parity shows 0 missing. The dark room's h2 "We email a link to confirm first." and the four step labels are fragments cut from Hanzo's one sentence, and the full sentence is still under the form. That makes the room a section the live page does not have, built from cut copy. Put it on the card as a copy question.

## Shared chrome (not counted against the page)
- Phone header: "Try Hanzo" stays a solid fill next to the hero's solid "Subscribe", so the first screen has two fills with different labels. The header never takes the page's ask on phone.
- The kit `Cta` hover goes to `rgb(44,44,46)` (#2c2c2e) and the inverted Cta rests at `#f5f5f7`; neither is on the deck ramp.
- In dev, a parse error in another chat's `Press.jsx` showed the Next build overlay on this route for a while. Not this page's.

## Fixes to reach 8
1. **Say each line once per screen.** The hero paper already carries the three lines. In the Inside scene, either give the second paper something new (for example, it folds or turns to show the address side, or it is the issue being stamped) or drop it and let the 44px statement be the object. On phone, don't follow the hero paper with the same three lines as rows. Either make the rows set the lines on the hero paper while it is in view (a short sticky stage), or replace them with one object that changes. In the dark room, don't repeat the big word in the rail directly under it at 375: show the numbers only, or the words only.
2. **Move the counter out of the mask.** Put "0n / 03" (and "0n / 04" in the dark room) outside `.xnl-now`/`.xnl-big`, or under the statement as a caption. Outgoing text must never cross it, and nothing should sit above the statement.
3. **One solid in the dark room on desktop.** The header already says Subscribe, so make the room's "Subscribe ↑" outlined at every width, as you already do under 700px.
4. **No jump on success.** Give `.xnl-stage` and `.xnl-slot` boxes that both states fit at each breakpoint (fixed height or aspect-ratio for the stage, and a min-height on the phone slot equal to the form block). The fold should then move only transform and opacity. Target CLS < 0.01 at 375 and 1470.
5. **Small polish.**
   - Clear the error and the dashed border on input once the address is valid.
   - Add `data-sound="tick"` (or `aria-pressed`) to the steps.
   - Give the Privacy link a 44px hit area.
   - Use the 56px `Field` height on phone.
   - Put the copy-fragment question on the card.
