# /models — James-eye review

Verdict: 6/10
Ready: 7 Nov, GA item 15. Each model shows its own rate where Hanzo prints one (snapshots and /pricing's API tab; none guessed) and has a "Use it now" to /chat. Re-measured against this review: the 11 never touches its label (26 frames at 1470 and 375), Copy is 44px and legible, the code tabs sit on one row, catalogue cards are quiet (phone: 72px rows), no hero timer, 0 console errors in dev, no overlaps at 1470x801 or 375x812. Copy (COPY-RULE, 8 Nov): copycheck missing 0 of 134 against content/live/models.json, live.mjs's capture of hanzo.ai/models (hanzo.ai itself is blocked from the cloud session); "Explore Enso / Kai / Zen →" restored. Taste, unique and the build pass.
First complaint: "The top is right. It's the real grid and it moves. Then the big 11 crashes into its own label, and after the black room it turns into a long wall of black text boxes. I'm scrolling a document again."

Walked 7 Nov on main at `b8c4ac3` (`components/pages/ModelsPage.jsx`, `ModelsPage.css`, `components/v2/SpecCard.jsx`) on the dev server, judged against `docs/build-notes/MASTER.md` (parts 1–18, section 3, 4.3), `docs/JAMES.md` and `docs/build-notes/refs/hanzo-model-cards/SPEC.md`.
- **Desktop 1470×801:** first-screen frames at 0, 500 and 1,000 ms, then a full scroll pass in 120px steps every 50 ms (19 frames). Hover, tilt and press on the grid, the chips and catalogue cards. A click on two flagship cards and one catalogue card, then Back.
- **Phone 375×812 (touch):** the same walk (28 frames), plus a 320px pass.
- Stills and scripts are in `/tmp/claude-0/critic2/`.

## What works
- **The first screen is the right idea.** At 1,000 ms you see the h1 (52px, baseline at 35% of the screen), the lede and "Get API key" on the 8/5 split, and Hanzo's nine black cards. Enso and Kai films are playing and the light steps through the grid (`models-desktop/first-1000.png`). At 375 the h1, lede, ask and the Enso card all fit (`mp-sheet1.jpg`).
- **The cards match `SPEC.md` closely.**
  - Card shape: `#000`, radius 20px, no shadow or border.
  - Text: title 22px/500/-0.44px/28px, inset 21px; Enso title 44px/500/-0.88px/48px. Description 13/18 at white 80%, 57px from the top.
  - Pills: 10px Zen Mono capitals, 0.8px tracking, 4px 10px padding, 1px white-20% border, 175px from the top.
  - Motion: `transform .3s cubic-bezier(.2,.8,.2,1)`. The tilt is 2.6° toward the top-left corner and flat on leave.
- **The black room is a real scene.** It enters as a rounded card, pins, steps through "Enso routes. / Kai decides. / Zen reasons." with `01 / 03` and the film changes under it (`md-sheet1.jpg`).
- **Cards open their pages.**
  - Kai → `/kai` (h1 "Kai"), Koma → `/koma` (h1 "Koma"). Both press to scale .988 first.
  - The catalogue card "Zen6" → `/models/hanzo/zen6`. Back returns to `/models`.
- **Controls answer.** Chips change ink on hover and press to .978, and the pill glides. The hero button darkens and presses to .97.
- **Checks:**
  - No sideways scroll at 375 or 320.
  - 544 distinct `/models/*` links are in the DOM.
  - `parity.py /models`: text 305/305, links 58/58.
  - `taste.py`: OK.
  - No floating bar over content on desktop or phone.

## Card check
`docs/build-notes/coverage/models.md` uses the 18-part format. No cap. Spot checks:
- "The collapsed list links all 544 `/models/*` routes": **true**. I counted 544 distinct hrefs.
- "At most 2 films playing": **true**. At load only `enso.webm` and `kai.webm` play.
- "Contrast: on black, #fafafa…" and "Copy button copies exactly the displayed code": **false in practice**. The Copy button on "Your first request" is a white pill whose label is `#fafafa`, so it is invisible (1.04:1). It is also 30px tall, not 44px (`crop-code.png`).
- "The one moment that grows is Kai's '11'": it does grow, but it grows into its own label (see 6).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. Frames at 0, 500 and 1,000 ms differ: the h1 cuts in, two films play and the light moves. The ask is on the first screen at both sizes. Nothing sits above the h1.
2. **One in, one out, or a document?** It is one-in-one-out until the end of the black room. After that it is a document:
   - Enso vs Zen, the Kai figures, then a 28-card catalogue in which each card carries an id, a price line and a 3–4 line description cut with "…".
   - Then a near-empty "Every model" disclosure with about 300px of white around a "+", a price table, Try, code and Related.
   - Length: 14,123px on desktop (17.6 screens) and **20,569px on phone (25 screens)** (`md-sheet2.jpg`, `md-sheet3.jpg`, `mp-sheet2.jpg`).
3. **A real visual object in every section?** Mostly. The grid, the room, the films, the figure bars, the composer, the code and the Sigil rows are all real. The catalogue is mostly text-only black boxes (only Creative carries films), and "Every model" is a lone "+".
4. **One ask in the header, nothing floating, scale has rhythm?**
   - **Floating:** nothing floats on this page.
   - **The ask:** the header carries the site's solid "Try Hanzo", not the page's "Get API key". So the first screen has two solid black fills at both sizes (shared header).
   - **Rhythm:** good at the top (52 / 20 / 22 / 44). The "Enso routes…" headline is 44px as the room's moment. The catalogue is one size all the way down.
5. **Every hover and press answers, no jumps?** Yes on grid cards (tilt, press .988), catalogue cards (tilt, press .988), chips (ink, press .978) and the hero ask (fill, press .97). The Copy button gives nothing you can see, because its label is invisible.
6. **Overlap, font swap, layout shift?** **Yes, an overlap at both sizes.**
   - Kai's "11" sits on top of "Suites won · Kai vs Jev". Measured at rest, the figure box runs x 611–737 and the label starts at x 710, so the "1" touches "vs Jev" (`int/kai11-centred.png`, `crop-kai11.png`). The phone shows the same collision (`models-phone/s-006.png`).
   - A hydration-mismatch error ("A tree hydrated but some attributes … didn't match") fired on every single load I made, at both sizes, so the red "1 Issue" badge sits in every frame.
7. **Which reference, and is its motion there?** synchronized.studio: yes, the cards open into their pages. The apple.com pinned chapter is there in the black room. After that the page has none of either.
8. **Different from its neighbours?** Yes. The home page uses the grid as a section; here it is the hero, followed by the black room and the catalogue.
9. **All 18 parts covered?** The card is complete, but parts 3, 8, 11, 12 and 15 have gaps (below).
10. **Banned tells?**
    - The overlap at 1470×801 and 375×812 ("any one fails the page").
    - Walls of text and an explaining paragraph under every catalogue tile.
    - Nothing else: no hue (`taste.py` OK), no pill above a heading, no floating bar.
11. **Copy untouched?** Yes (parity 305/305, 58/58).

## Missing from the 18 parts
- **Part 3:**
  - No closing `Band`. The page ends on "Related capabilities" (the card admits it).
  - The middle of the page is several sections of the same weight in a row.
  - About 300px of empty white around "Every model" and above "Try any model".
- **Part 4:** the header's solid "Try Hanzo" sits beside the hero's solid in the same viewport (shared header).
- **Part 8 / 12:** the Copy button is invisible (white on white) and 30px tall.
- **Part 9:** MASTER 4.3 says /models "Removed: … auto timers". `Stage()` still chains a 2,600 ms `setTimeout` that relights a card forever. The card answers this with "no `setInterval`", which is the letter of the rule, not its intent.
- **Part 11:**
  - The phone catalogue is full-width black text cards, not the 72px list rows of part 15.
  - Creative card descriptions print over the film art.
  - Endpoint ids break mid-word ("api.hanzo.ai/v1/v ideo", "…/a udio/speech").
  - The code tabs wrap onto two rows (`mp-sheet2.jpg`).
- **Part 13:** a hydration mismatch on every load.
- **Part 15:**
  - The grid is `368px repeat(4,184px)`, against SPEC's `385px repeat(4,192px)`.
  - Enso's description is 15/21px, against 13/18.
  - The "Zen6" card lands on an h1 that reads "zen6", so the Morph title changes case.

## Fixes (most important first)
1. **Stop the 11 colliding.** Give the figure its own line, or keep its growth inside a box that pushes the label (`min-width` in `ch`), so "Suites won · Kai vs Jev" never sits under the "1". Check at rest and at the ×1.75 peak, at 1470 and 375. Evidence: `/tmp/claude-0/critic2/int/kai11-centred.png`, `/tmp/claude-0/critic2/crop-kai11.png`, `/tmp/claude-0/critic2/models-phone/s-006.png`.
2. **Make the catalogue one-thing-in, not a wall.**
   - Desktop: show the title, price and pills on the card. Let the 3–4 line description arrive on hover or focus (the hover then "tells you something"), keeping the text in the HTML.
   - Phone: turn the catalogue into 72px list rows (MASTER part 15), with the film or Sigil as a small thumb.
   - This alone takes the phone page from 25 screens to about 12. Evidence: `/tmp/claude-0/critic2/md-sheet2.jpg`, `/tmp/claude-0/critic2/mp-sheet2.jpg`.
3. **Fix the Copy button on "Your first request".** Use an ink label on the white pill, or a white-78% label on a graphite pill. Make it 44px tall with `role="status"` feedback. Evidence: `/tmp/claude-0/critic2/crop-code.png`.
4. **End on a `Band`** in the page's own words with the one "Get API key", after Related. Close the white gaps around "Every model" and above "Try any model" so one section hands to the next. Evidence: `/tmp/claude-0/critic2/md-sheet3.jpg`.
5. **Find and fix the hydration mismatch.** It fires on every load at both sizes. Log the attribute it names, which is likely a client-only value in the first render, and make the server and client agree. Evidence: the "1 Issue" badge in `/tmp/claude-0/critic2/models-desktop/first-1000.png`.
6. **Replace the hero's auto timer** (MASTER 4.3 removed it). Light the card under the pointer, or tie the light to scroll. Enso's film already gives the 1-second mover.
7. **Phone creative cards:**
   - Keep the description clear of the art: put it in the top 57px as SPEC places it, or under a gradient, never a dimmed film.
   - Stop the endpoint ids breaking mid-word: shorten to the id, or break only at "/".
   - Keep the code tabs on one row.
   - Evidence: `/tmp/claude-0/critic2/mp-sheet2.jpg`.
8. **Match SPEC to the pixel:** grid `385px repeat(4,192px)` (or say on the card why 1152/6 is used), and Enso's description at 13/18. Make the card's label match the destination h1 ("Zen6" vs "zen6"), or list it as a copy question.
9. **Shared, not counted here:**
   - The header's solid "Try Hanzo" doubles the hero's solid. Ask the shared owner to make it quiet while a page `data-thumb` is on screen.
   - The header glass turns into a grey smear over black cards and the black room (`/tmp/claude-0/critic2/crop-header.png`).
