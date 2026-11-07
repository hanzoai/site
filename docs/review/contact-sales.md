# /contact-sales — James-eye review

Verdict: 6/10
First complaint: "There's a little floating bar sat on top of the page again. And after the logos it just stops: no ending, straight into the footer."

Walked 7 Nov at about 14:45 UTC (after the 14:45 refresh), page file at `94acb12` (`components/pages/ContactSales.jsx` and its css), on main plus the Company branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Judged by `JAMES.md` and `MASTER.md` (Utility, §4.5). Stills: `review/contact-sales/desktop-walk.jpg`, `review/contact-sales/phone-walk.jpg`. This replaces the 5/10 review of `f33ebae`.

## What works
- The recolour is clean: ink and greys only, with no violet, no eyebrow over the h1 and no fake caret. `taste.py` passes, and the native tooltips are gone.
- The form as a conversation is still the right idea for this page: one question at a time, set large, a progress line, and a round arrow to move on. It is one real form, and the request shape matches `content/forms.json`.
- "What Enterprise includes" now has rhythm: pale giant numerals 01–05 beside medium text, and a hover inks the numeral. One big thing, the rest medium and small.
- JS off: 0 hidden text (it was 3 of 6). Reduced motion: 0 running animations. No layout shift on desktop. Parity: text 30/30, links 17/17.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "Talk to sales" and a card ready for your name. Movement is thin: the line cut-in on arrival, then only a grey contour field so faint it reads as still.
2. **One in, one out, or a document?** Short and calm: form, inclusions, logo rail. Not a document, but there is no ending.
3. **A real visual object in every section?** Form card, giant numerals, logo rail. Logos are blocked in this box, so the rail showed names; not counted against the page.
4. **One ask, sticky after the hero?** Not the way James wants it now. On desktop a floating pill bar ("Talk to sales | search | Talk to sales →") sits over the content at the bottom of the screen; under the 14:45 rule that is a fail. The ask is not in the sticky header (the header shows "Try Hanzo"). There is no closing Band.
5. **Every hover and press answers, no jumps?** Hover yes. Pressing an inclusion row ("01 Run Hanzo in your cloud…") changes nothing. On the phone, tapping "02" and "04" showed no change in my walk.
6. **Overlaps, font swap, layout shift?** None at 1470. On the phone the bottom bar sits over the "01" inclusion row as it passes.
7. **Which reference, is its motion there?** chatgpt.com/business/enterprise calm, plus a Typeform-style one-question flow. The calm is there.
8. **Different from neighbours?** The hero frame (left Display headline, right card) is still the Company template shared with /contact, /support, /press, /investors, /brand and /careers.
9. **18 parts (MASTER §2)?** See the card check below.
10. **Banned tells?** One, plus a token break:
    - **Floating over content:** the desktop ask bar.
    - **Token break:** springs on the progress line, the chips and the toggles (MASTER §3.1: no springs, no overshoot).
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/contact-sales.md`)
- **Format.** 18 numbered paragraphs, no `## N.` headings or `Done here:` lines, so the board cannot count 18 of 18.
- **Part 3 is missing its ending.** MASTER asks for a proof strip, one `Band` in the page's words, then the footer. The page ends on the rail.
- **Part 4 describes the floating bar** as the sticky ask. That is now a fail, not a feature.
- **Part 9 is false in part.** "Press: .98 on every button": the inclusion rows showed no press state. "The progress line springs" breaks the no-springs rule.
- **Verdict capped at 7.** It sits at 6 on its own merits.

## Fixes (in order)
1. **Move the ask into the sticky header** at every width: "Talk to sales" in the header slot, solid once the card leaves view. Remove the floating pill bar on desktop, and on the phone keep a slim bar only if it never covers a row.
2. **End the page.** After the logo rail, add the kit `Band` with the page's own line and one solid "Talk to sales" that scrolls back to the form, then the footer with no gap.
3. **Let the stage move with a purpose once.** Before anyone types, play the conversation once from Hanzo's field labels: a name types in, slides up, the next question rises, a chip lands. Then rest. The faint field alone reads as still.
4. **Replace the springs** (progress line, chips, toggles) with `ease-emphasis` at 300ms. Give the inclusion rows a .98 press, and check that a phone tap adds and inks the numeral.
5. **Rewrite the card in the template format** and correct Parts 3, 4 and 9.
