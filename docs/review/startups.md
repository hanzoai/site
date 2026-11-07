# /startups/: James-eye review
Verdict: 7/10
First complaint: "The big $150,000 is spilling out of its own box, and once it lands the top just sits there. On my phone a black card sits over the form the whole way down."

Walked 2026-11-07 16:32 UTC on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving: scroll walk per 0.85 viewport, load frames at 150/450/850/1300/2200/4000 ms, hovers and presses on the asks, chips and rows, form filled and an empty submit tried (all non-GET requests aborted; the form never posted). Fresh eyes; the earlier review and the coverage card were read only after scoring.

Big improvement on the 5/10: the native selects are gone (chips now), the eyebrow sits under the h1, the three tiles became one scrubbed list, and the form has a live object.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?**
   - Sells: h1, lede, "Apply for credits" and the $150,000 reel all in the first screen at both sizes.
   - The h1 cuts in at 150 ms; the lede, buttons and reel only arrive at about 1.3 s (850 ms frame: h1 and caption only).
   - After the reel lands (about 2 s) the first screen is still: two frames 2 s apart at 4 s are identical.
2. **One in, one out?**
   - Yes for the program list: the row at the reading line grows to 44px and goes ink while the other two sit grey at about 26px. Good.
   - Then a dead stretch: about 300px of empty white between the Techstars paragraph and "Apply to the program" (desktop stop 2).
3. **A real object in every section?**
   - Hero: the flap reel. Program: the numbered list with its own small reel. Form: the black application card that fills as you type (name, "2 / 5", stage, the matched tier "Up to $150,000 in credits", use-case pills light). That card is the page's moment.
   - "Not venture-backed?" black band: words and two buttons only, about 250px of empty black under the headline.
4. **One ask, sticky; scale rhythm?**
   - Desktop: the header swaps "Try Hanzo" for a solid "Apply for credits" once the hero ask leaves. Good.
   - Phone: the header stays "Try Hanzo" all the way down; the page's own ask is never sticky.
   - Phone: the application card is sticky at y 64-212 (148px, 18% of the screen) over the form for its whole length. It covers the fields as they scroll under it.
   - Scale: hero h1 52px plus a 74px reel side by side (two big things, reel above the 64px rest size); the rest rhythms well (44px active row, 26px rest rows).
5. **Hover and press?**
   - "Apply for credits": hover #0a0a0a to #262626, press scale 0.97. "Start building free": hover fill #f5f5f5, press 0.97. Chips: hover #f2f2f2 to #ececef only (barely visible), selected gets an ink border. Rows answer on hover (become the active row).
   - Hovering the hero card re-spins the reel and flashes random figures ("$963,741"); the program reel does the same ("$150,085"). A number bigger than the offer on screen, even for 300 ms, reads as an unverifiable claim.
6. **Overlap, font swap, layout shift?**
   - Overlap at 1470x801: the last "0" tile of the hero reel pokes about 8px past the card's right border, with 0 right padding against 47px left.
   - Console error on load (desktop, fresh context): React hydration mismatch on the Company name input (`style={{}}`), and the red "1 Issue" dev badge shows. Not reproduced on the phone run.
   - CLS 0.003. No font swap seen; the h1 box holds. No horizontal scroll at 375.
   - Desktop form: "Your role" input sits about 34px lower than its row partner because "Company stage" chips wrap to two lines.
   - The header's frosted glass smears the sticky card's shadow into a grey patch top right (desktop stop 5).
7. **Reference?** apple.com: one figure as hero, and the scrubbed list is a small pinned-scene feel. synchronized/osply: none. The live card is its own idea.
8. **Different from neighbours?** Yes: the flap reel and the filling application card are not used elsewhere that I walked.
9. **18 parts?** The card exists (19 "Done here" lines). Gaps seen on the walk: no proof strip before the closing band (part 3); phone sticky ask (part 4); empty submit shows "Your name is required." above the button but focus stays on the button and the page does not move to the field (part 17).
10. **Banned tells?** None hard: no hue, no eyebrow above a headline ("The program" sits over the list, not over a headline), no native controls, no Inter. Borderline: a panel covering the form on phone.
11. **Copy untouched?** Yes: `parity.py /startups` OK, text 82/82, links 3/3.

## Fixes (in order)
1. Fit the hero reel inside its card at 1470 (equal side padding, or step the reel to 64px rest size); and stop the re-spin showing random large figures: roll only through digits that end on 150,000, or drop the hover re-spin.
2. Phone: make the application card a slim one-line strip (name and "2 / 5") or put it after the submit; nothing should sit over the fields. Swap the phone header ask to "Apply for credits" past the hero, as on desktop.
3. Fix the hydration mismatch on the Company name input (no `style` difference between server and client), so the console is clean.
4. Give the hero one quiet idle move after the reel lands, tied to the program (for example the card stepping slowly through the three program lines under the figure).
5. Close the 300px dead gap before "Apply to the program"; give the black band an object (the application card in its submitted state, or the free-plan line as a figure).
6. On a failed submit, focus and scroll to the first invalid field and mark it; make chip hover visible (#ededed or a border change).
7. Bring the lede and buttons in with the h1 (under 600 ms), not at 1.3 s.
