# /sign/: James-eye review
Verdict: 7/10
First complaint: "The top is lovely, the document signs itself, but look at the little signer list: 'signer' on one line and '1' on the next, right on the first screen. And the step name is written twice, once on the left and once bigger on the right. Then after the signing bit it goes quiet and turns into a pricing page and a list of links."

Walked 2026-11-07 ~16:30 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. First screen and 1 s
   - Sells in 5 s: h1 "Hanzo Sign" 52px at y342 (box steady over 1.6 s, CLS 0.003), one-line lede, solid Try Hanzo, and the document stage running. Frames 700 ms apart differ.
   - The stage self-runs (02 -> 05 over ~7 s idle), but the first scroll into the pin snaps it back from 03/05 to 01/05 "Upload the PDF". Autoplay and scroll still fight over one scene.
2. One in, one out
   - Yes in the pinned 5-chapter scene (y0 to ~4100 desktop): one chapter in, one out, the document gains a signature, a tick, then a CERTIFICATE stamp.
   - After it, stacked blocks. Desktop stops 10-13 (y6810 to y9534: plans, open source, closing room) are fully still; on phone stops 7-12 (about 6 screens) are still.
3. A real object in every section
   - Yes: signing stage, live recipient list (5 people, statuses change), 12-language ticker on black, a signature pad you can draw on (Sign stamps "Signed Nov 7, 2026, 4:29 PM"), the plan sheet.
   - No: "Built on Open Source" is two paragraphs and two pills. The 8 feature tiles (344x128) are a number, a title and a +.
4. One ask, nothing floating, scale rhythm
   - Desktop: header ask outlined while the hero ask shows, solid after. Good. Nothing fixed over content (only the 2px progress bar).
   - Phone first screen: header Try Hanzo and hero Try Hanzo are both solid black in 812px. Two solid fills.
   - Rhythm fine at top (52/26/17), but each chapter title is shown twice: left h2 26px and the stage label ~30px, the bigger copy on the object.
   - Plans: four 64px figures in a row (Free, $30, $50, Custom) mixing Zen and Zen Mono. Everything big at once for that screen.
5. Hover and press
   - Hero ask: hover fill #0a0a0b -> #2c2c2e, press 0.98. Docs, plan and repo buttons: border goes ink, press 0.98. Tiles lift 3.6px and open a sheet; Escape closes it.
   - Pricing toggle: hover changes nothing; at rest neither option is pressed (both aria-pressed=false), so the pill shows no state until clicked.
   - Closing-room links ("View Docs" row 674x44): hover no change, press 1px.
6. Overlap, font swap, shift
   - No console errors, no horizontal overflow at 375, no font swap seen.
   - Signer chips wrap "signer / 1" to two lines at 1470 once the status reads "sent" or "signed" (d-00, d-06). Visible on the first screen.
   - Phone targets under 44px: "Documenso" inline link 87x21, footer "Company" 30x44.
7. Reference
   - apple.com product page: the pinned stage with a 01-05 rail and one panel changing is really there. synchronized.studio card-to-page is not: tiles open a centred dialog.
8. Neighbours
   - Own medium (a document being signed, plus a pad you sign yourself). Distinct.
9. 18 parts
   - Not audited from source. Visible gaps: part 3 narrative after the pin, part 4 one solid fill on phone, part 11 targets, part 17 toggle default state.
10. Banned tells
   - "Most Popular" mono label sits directly above the "Business" plan title. Two labels on one stage ("A document, signed" rail plus "DOCUMENT SIGNING"); on phone they stack.
   - Tile hover is a plain lift, not one of the allowed hover transforms.
11. Copy
   - parity.py /sign/: OK, text 106/106, links 9/9.

## Fixes (in order)
1. Hero stage craft: widen the signer chip so "signer 1" never wraps; drop the duplicate chapter title on the stage (keep "03 / 05" only) or the left h2, not both; let the pin start at the chapter autoplay is on instead of snapping to 01.
2. Give the bottom half a moment: the plans' figures roll in once when reached (only the selected plan at 64px, others 44px), and "Built on Open Source" gets one object (the fork line documenso/documenso -> hanzoai/esign drawing in). Ends the 3-screen still stretch.
3. Phone: header ask outlined while the hero ask is on screen (one solid fill).
4. Pricing toggle: default to one state with the pill visible, hover answers.
5. Closing room: compose it as one statement and one ask; the five headings and repeated docs/GitHub links read as a link dump.
6. Feature tiles: a small live detail per tile or open into the content (Morph) rather than a modal; drop the "Most Popular" label above the plan title (make it a corner tag).
7. 44px hit area on the "Documenso" inline link on phone.
