# /startups/: James-eye review
Verdict: 7/10
First complaint: "Why does the big number say $741,529 in credits? It's up to $150,000. It keeps spinning to amounts we don't offer, and on my phone a black card sits over the form the whole way down."

Walked 2026-11-07 16:43 UTC on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving: scroll walk per 0.85 viewport, first-screen frames at 0.3 s, 1.0 s and 5 s, the board sampled every 500 ms for 12 s on 4 cold loads, hover and press on the asks, chips and band buttons, the form filled and an empty submit tried (every non-GET request aborted; nothing posted). Fresh eyes; the old review, coverage card and source were read only after scoring.

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes, but the figure misleads.**
   - h1 "The Hanzo Startup Program" 52px at y163, lede, one solid ask at y442, and a split-flap "$150,000" board right. The h1 cut-in plus the flap move within 1 s.
   - The board flips again every ~4.2 s and passes through random amounts it shows for a moment. Sampled over 12 s on 4 cold loads: $418,296, $741,529, $852,630, $529,307, $296,074, $074,852. "Up to $741,529 in credits" is on screen. The aria-label stays $150,000, but James reads the screen. This is an unverifiable figure, and a figure that never settles.
   - Below the asks, 1470x801 shows ~300px of empty white before "THE PROGRAM" peeks.
2. **One in, one out: partly.**
   - The program "ladder" works: 3 rows at 44px, one in ink and the rest grey. It climbs on a 2.4 s timer and on pointer, and the $150,000 rung flaps.
   - Then come a lone Techstars paragraph with ~330px of blank before "Apply to the program", and a form ~2,700px tall on desktop (about 6,000px of the 8,968px page on phone). In that stretch only the match card changes, and only when you type. It reads as a document there.
3. **Real object per section: mostly.**
   - Hero: flap board. Program: ladder plus flap. Apply: the live match card. Close: the match card again.
   - The Techstars block has no object. The page has no Hanzo media, so the 4+ visuals rule does not apply.
4. **One ask, nothing floating, scale rhythm: mixed.**
   - The header ask swaps to "Apply for credits" (solid) once the hero ask leaves view: good.
   - Desktop: the sticky match card stays in its own column, which is fine.
   - Phone: the sticky card sits at y64-212 (148px, 18% of the screen) over the form the whole way down. It hides field labels as they pass, for example "Backed by any of these?".
   - Phone close: the bottom "Apply for credits" bar sits over the band's second match card.
   - Scale: 52 / 44 / 17 / 13 type, and one big thing per screen except the close (52px h2 plus a card). OK.
   - Shared issue only: the phone header "Try Hanzo" is always solid (request filed).
5. **Hover and press: yes.**
   - Primary hover goes #0a0a0a to #262626, and press scales 0.97 (width 190 to 184, no layout jump). The secondary fills #f5f5f5. Chips change fill and scale 0.98 on press. The band "Start free" goes #fafafa to #e4e4e7.
   - Hover tells you nothing beyond colour, apart from the ladder rungs.
6. **Overlap, font swap, shift:**
   - No horizontal scroll at 375 (scrollWidth 375).
   - Phone: the sticky card over the form labels, and the bottom bar over the band card (see 4).
   - Desktop: the header glass shows a grey smear where the card shadow passes under it (x≈860-1070).
   - Empty submit: one grey box above Submit says "Your name is required." Focus stays on the button and no field gets aria-invalid, so it is not inline.
7. **Reference:** calm chatgpt.com/business/enterprise with an Apple-style single figure. The live match card is the synchronized "answers back" idea and the page's real moment. Pointer and idle motion are present, but there is no tilt or preview.
8. **Different from neighbours:** yes. The split-flap plus the assembling match card are its own (PAGES.md: own layout). /grants and /founder were not checked side by side.
9. **18 parts:** the coverage card has 18 headings. A focus on the first invalid field is missing (part 12), and so is an inline error per field (part 17).
10. **Banned tells:** none seen. No hue, no gradient text, no pill above h1; "TECHSTARS '17" is a caption below the h1. "THE PROGRAM" 12px Mono sits over a rule above the ladder, which is borderline but not on the h3s.
11. **Copy:** `parity.py /startups`: text 82/82, links 3/3.

Console: 0 errors or warnings on 4 of 4 fresh cold loads. A "1 Issue" dev badge appeared once in a 5th run and did not reproduce (0 of 4), so it is not counted.

## Fixes (in order)
1. Make the flap honest. Let it settle once on $150,000, or re-flip only through digits that land on $150,000 without showing a bigger amount. No interim figure over the cap, ever, and stop the 4.2 s loop (part 9: "a figure settles or counts once").
2. Phone: unstick the match card under 900px. Dock it as a slim one-line strip (name, n/5, tier) of 56px or less, or show it only above Submit. Never 148px over the labels.
3. Fill the dead stretches. Pull the Techstars line up into the ladder's tail or beside the Apply heading, and cut the ~300px under the hero asks so the program peeks 56px. Give the long form one thing that changes per screen as you scroll (the match card's rung lighting with the section you are in).
4. Validation: give each field its own inline error, aria-invalid, and focus on the first invalid field.
5. Close: one match card is enough. The band's duplicate under "Not venture-backed?" leaves the right half empty and collides with the phone ask bar.
