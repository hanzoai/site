# /sign/: James-eye review
Verdict: 7/10
First complaint: "The top's lovely, the document signs itself, but then it goes flat. Eight grey boxes with just a title in them, then an open-source block of text, then the black bit at the end has four headings and six links fighting each other. It starts premium and ends as a template."

Walked 2026-11-07 16:16 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. First screen and 1 s
   - Sells in 5 s: h1 "Hanzo Sign" 52px at y342, one-line lede, solid Try Hanzo, and a document stage running. Frames 0.3 s and 1.0 s after load differ; 14 animations running at load.
   - The stage self-runs (it reads 03/05 "Send it" at rest), but scrolling into the pin snaps it back to 01/05 "Upload the PDF". Autoplay and scroll fight for the same scene.
2. One in, one out
   - Yes for the pinned 5-chapter scene (y0 to ~4100): one chapter text in, one out, while the document builds and gets its certificate.
   - After that it reads as a document: tiles, pad, plans, open source, closing room, each a full block stacked; 7 of 17 desktop stops are fully still.
3. A real object in every section
   - Yes: signing stage, live recipient list (5 people, statuses changing), 12-language ticker, signature pad (draws, stamps "Signed Nov 7, 2026, 4:15 PM"), plan sheet.
   - No: the 8 feature tiles (each ~260px tall, a number, a title, a +, and nothing else) and "Built on Open Source" (text plus two pills, no object).
4. One ask, nothing floating, scale rhythm
   - Desktop: header ask is outlined while the hero ask shows, then fills. Good.
   - Phone: header Try Hanzo and hero Try Hanzo are both solid in the first 812px (two solid fills).
   - Rhythm fine at the top (52 / 26 / 17). Plans put four 64px figures side by side (Free, $30, $50, Custom): everything big at once for one screen.
   - Closing black room: "Send the first one", "Start signing", "Something more specific", "Get started with Sign", "Get Sign" plus 2 Contact Sales / 2 docs / 2 GitHub links. Overload.
5. Hover and press
   - Hero ask: hover darkens fill, press scale 0.98. Docs and plan buttons: border goes ink, press 0.98. Tiles lift 3px. Good.
   - Header ask (shared chrome) hover is opacity 0.88 only: a fading button.
   - Pricing toggle: at rest neither "Run it yourself" nor "We run it" is selected; the cards change only after a click (Community greys out).
6. Overlap, font swap, shift
   - No horizontal overflow at 375; no console errors on the walk.
   - Signer chips wrap "signer / 1" onto two lines at 1470 (chip too narrow for its label).
   - Phone tap targets under 44px: "Documenso" 87x21, "Read the docs" 109x22, "View on GitHub" 115x22.
7. Reference
   - apple.com product page for the pinned stage, and it is really there (pinned, numbered 01-05 rail, one panel changing). The tiles open into a centred dialog, not a card-to-page open.
8. Neighbours
   - Own medium (a document being signed, a pad you can sign). Distinct.
9. 18 parts
   - Not audited from source; visible gaps: part 3 rhythm after the pin, part 4 one solid fill on phone, part 11 44px targets.
10. Banned tells
   - Header button fading on hover (shared). "Most Popular" mono label sits above the "Business" plan title (small, but a label over a heading). Vertical "A document, signed" plus "DOCUMENT SIGNING" are two labels on one stage (phone shows both stacked).
11. Copy
   - parity.py /sign: OK, text 106/106, links 9/9.

## Fixes (in order)
1. Closing room: one statement and one ask. Merge "Send the first one", "Get started with Sign" and "Get Sign" into one composed band (Try Hanzo solid, docs and GitHub as text links once each, "Something more specific" as a quiet row). No duplicate links.
2. Feature tiles: give each a small live object or cut their height to ~120px rows; 8 empty 260px grey boxes read lazy. Better: open each card into its content (Morph) rather than a modal.
3. Hero stage: let autoplay hand over to scroll without snapping 03 back to 01 (start the pin at the chapter the demo is showing, or pause the demo once pinned).
4. Phone: header ask quiet while the hero ask is on screen (one solid fill); 44px hit areas on the inline links.
5. Pricing: default the toggle to one state; let only one figure be large at a time (the selected plan), others at 44px.
6. Built on Open Source: one object (the fork line drawn from documenso/documenso to hanzoai/esign, or the repo card).
7. Widen signer chips so "signer 1" stays on one line; drop one of the two stage labels.
