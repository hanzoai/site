# /sign/: James-eye review
Verdict: 7/10
First complaint: "On the phone the contract sticks over two thirds of the screen and the words slide underneath it. I'm reading the story through a letterbox at the bottom, and the picture is already a step ahead of the words."

Walked 2026-11-07 ~16:55 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. **First screen, 1 s.**
   - It sells. "Hanzo Sign" is the h1 at 52px (top at 342px), with the lede, Try Hanzo and Documentation beside the Agreement.pdf desk.
   - It moves with no input. Frames taken 300 ms and 1000 ms after load differ: the desk starts at "01 / 05 Upload the PDF" and by 2.5 s it is at 03/05 with the signature drawn and the signers "sent". There is a pause control.
2. **One in, one out.**
   - Desktop: the five steps form one pinned stage. Each stop swaps the left h2 and the desk state, so it reads as a story. After that come the recipient list and the language rotator, then the 8 tiles, the pad, the prices, the fork curve and the black Band.
   - Desktop still has about 150px of blank white between the last desk frame and "What is in it" (d-07).
   - Phone: the desk (`.w2-pin-visual`) is sticky from y=60 to y=577, which is 517px or 64% of 812. The five step headings and their paragraphs scroll underneath it and can only be read in the 235px strip below. Its counter runs ahead of the text: at scrollY 1100 it shows 05/05 while "Send it" and "Watch it move" are the visible headings.
3. **A real object in every section.**
   - Yes: the self-signing desk; the live recipient list (persons 1 to 5, sent, opened, signed); the "Twelve languages" rotator (Spanish 03/12); the drawable pad (a ghost signature at rest, then a "Signed Nov 7, 2026, 4:53 PM" stamp after you draw); the price cards; the documenso to hanzoai fork curve.
   - The 8 part tiles are text-only, but each one opens a sheet.
4. **Ask and scale.**
   - Desktop has one solid fill per viewport. The header Try Hanzo is outlined while the hero ask is on screen and goes solid once it leaves. Nothing floats over content on desktop.
   - Phone: the always-solid Try Hanzo in the header doubles the hero solid. This is shared chrome and a request is filed; it is not this page's fault.
   - Scale: h1 52, h2 26, h3 17, figures 44. The prices now land at 44px; the earlier "F r e e" shrink is gone. The rhythm holds.
5. **Hover and press.**
   - Hero ask: hover goes from #0a0a0b to #2c2c2e, and press scales to 0.98. Documentation gains a 4% fill.
   - Tiles lift 3.6px on hover and open a native-feeling sheet that closes with Esc.
   - The run toggle dims the paid plans. The pad's Sign button stamps a time.
   - No jumps. Phone CLS over a 3000px scroll is 0.003.
6. **Overlaps, swaps, shift.**
   - Phone: text passes under the opaque pinned desk (point 2).
   - Small overlap: in the desk art the checkbox cursor and tick sit on top of the word "CHECKBOX", at both sizes (d-00, p-01).
   - No horizontal scroll at 375. The h1 box is stable.
   - Console: 0 errors on 4 of 4 cold loads. A red "1 Issue" badge does appear, but its text is `./components/pages/Startups.jsx:322:14 Parsing ecmascript source code failed`. That is another page's hot recompile, so it is not counted against this one.
7. **Reference.** It feels like an apple.com product page: a pinned scene where one panel changes and the product is the hero, and that motion really happens on desktop. Apple stacks its scenes on phone, and this page does not.
8. **Different from neighbours.** It has its own hero medium, a PDF that signs itself, and its own signature moment: you sign the pad yourself. It reuses no home or launch trick.
9. **18 parts.**
   - Present: one h1, three pause controls, sheets, the pad, sound in the header, two black rooms that are not back to back.
   - Part 11 fails ("Pinned scenes stack under 900px").
   - One phone tap target is under 44px: the inline "Documenso" link at 87x21.
10. **Banned tells.**
    - None of the hard bans.
    - Borderline: the tiles have both a fill and a 5% outline, and the 3.6px tile lift is not on the allowed hover list.
    - "Most Popular" sits above the Business h3. That is not an h1 or h2, so it is allowed.
11. **Copy.** `parity.py /sign`: text 106/106, links 9/9.

## Fixes (in order)
1. **Unpin the desk under 900px.** On phone, stack the five steps as static panels: each desk state sits directly above its own heading and paragraph, per MASTER part 11. Or keep it self-running at about 45svh, but the text must never scroll under it. If it stays live, tie the counter to the step in view.
2. **Close the gap after the desktop pin.** About 150px of white sits between the last desk frame and "What is in it". Overlap the next object by about 40px.
3. **Polish.**
   - Move the tick off the "CHECKBOX" label.
   - Drop the 5% outline on the filled tiles.
   - Make the tile hover tell something (the 01 number or the sheet's first line) rather than only lift.
   - Give the Documenso link a 44px tap box.
