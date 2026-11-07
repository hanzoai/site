# /comparison — James-eye review

Verdict: 8/10
First complaint: "On the second screen the same eleven prices are listed twice, side by side. Show them once."

Walked 7 Nov, page file at `812e080` (`components/pages/Comparison.jsx`, `Comparison.css`), on the preview of main plus the Proof branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/comparison/desktop-walk.jpg`, `review/comparison/phone-walk.jpg`. The machine was overloaded, so motion is judged from frames.

## What works
- **The headline reads like a logo:** "Buy it, or run it" at 128px, line height 0.92, cut in by line. "Comparison" sits under it as a caption, not above.
- **One live object on a quiet stage:** a paper receipt that prints itself line by line after arrival and rolls its total, $225.57/mo, digit by digit. It is greys and ink only.
- **The stack switches drive it:** take a stack out and the pinned receipt re-prints and the total rolls to the new figure. That is "try it before you believe it", built from Hanzo's own figures.
- **A dark room that tells a story:** five duties (Upgrades, Backups, Availability, Identity, On-call), one per screen. Each is printed on a receipt that cannot price it ("$ ?"), and the receipt tilts in as the last goes out. Then Hanzo's closing line.
- **It is honest:** the method sentence (compute only, from each compose file, DigitalOcean retail plus Hanzo margin, estimate) sits right under the table.
- **One ask, everywhere:** "Try Hanzo" in the hero, a desktop pill after it, and a phone thumb bar after the "All of them, running $225.57/mo" bar that follows the thumb through the table.
- **Clean numbers:** parity text 63/63; CLS 0.0003; reduced motion leaves 0 running animations; hover lifts, and press scales to .98.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. Big question, one ask, and a receipt already printing.
2. **One in, one out, or a document?** Yes in the dark room. The table section is a long list of 11 rows.
3. **A real visual object in every section?** Yes: the receipt, the switches, the duty receipts.
4. **One ask, sticky after the hero?** Yes, at both widths. On desktop the site header's solid "Try Hanzo" also shows, but it is the same label.
5. **Every hover and press answers, no jumps?** Yes. The switches spring and the plus turns. On phone, when one row's images open, the rows below move, so a quick second tap can land on the wrong row.
6. **Overlaps, font swap or layout shift?** None seen at either width. JS off: 10 of 23 text blocks stay invisible.
7. **Which reference, is its motion there?** Apple's pinned chapter (the receipt pinned beside the switches, the duty chapters) and osply's editorial type. Both are there.
8. **Different from neighbours?** Yes in its idea (the bill) and its dark room. Its first screen is the same frame as /compare and /security: white page, headline left, card right.
9. **18 areas (PLAN-COMPONENTS)?** Mostly covered, see below. No `docs/coverage/comparison.md`.
10. **Banned tells?** None found. 0 UI hues, no eyebrow over a headline, no gradient text.
11. **Copy untouched?** Yes.

## Missing from the 18 areas
- **2.3 Page ending:** the dark room ends on a paragraph, then the footer. There is no closing Band repeating "Try Hanzo" as the one solid button; only the pill carries it.
- **2.6 Content:** on desktop, screens 2 and 3 show the 11 stacks twice, as switches on the left and receipt lines on the right.
- **2.17 States:** most text is hidden with JS off. The receipt needs a printed final state in the server HTML.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Show the list once.** While the switches are on screen, shrink the receipt to its total, the bar and the "postgres ×4" note, and let it print the lines only in the hero. Or drop the prices from the switch rows. One column of prices per screen.
2. **End on the ask.** After "We have not costed that list…", close the dark room with "Try Hanzo" as one solid button in Hanzo's words, so the last screen repeats the hero.
3. **Server-render the final receipt.** Print the full receipt and total in the HTML, so JS off and slow phones see the finished bill, and let the print animation replay over it.
4. **Hold the rows still on phone.** When a row's images open, open them in a sheet or keep the row heights fixed, so the next row does not jump under the thumb.
