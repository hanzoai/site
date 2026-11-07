# /commerce — James-eye review

Reviewed 7 Nov 2026, walked moving at 1470x801 and 375x812 (wheel steps of 400px every 700ms, rest shots ~1s apart, hover and press on the stops, pause, noun rows, finder chips, group sheets, processor pills, ways rows and closing rows).

Verdict: 7/10

First complaint: "Where's the title? I land on a grey strip with a card in it, and 'Hanzo Commerce' is sitting down at the bottom of the screen. Then I scroll and it shows me the same five little order cards all over again."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Partly. At 1470x801 the h1 "Hanzo Commerce" sits at y 594–648 (about 74% down the screen, not near 38%), under a 387px grey rail band. The rail reads first and the title reads last. Nothing moves for the first ~1.3s: the t0 and t1 shots are identical, and the rider first moves at about 2.5s. On the phone the order is right (h1, lede, ask, then the rail), and the ask sits at about 350px.
2. **One in, one out?** Mostly. The pinned horizontal journey (left column with a big 01–05 figure, the cards sliding through on the right, neighbours dimmed) is a real scene. The nouns index with its preview card and the black finder room are each one idea. But the journey repeats the hero: the same five steps with the same card art ("size colour price", "cart {id}", "held", "captured", "return"). After the processor switch, the page becomes a document: a two-line wall of integration names, 4 use-case tiles, 6 spec rows, then 4 "ways in" rows, then the close. That is about 4 quiet screens with nothing new to look at, separated by empty white gaps of 200–250px (above "When to reach for it" and above the ways rows).
3. **A real object in every section?** No. The hero rail, journey cards, nouns preview, finder, processor card and line-art tiles all hold. "Who takes the money"'s integration rows, "What you are running" and the ways/Get Commerce block are text only.
4. **One ask, sticky after the hero?** Yes on desktop. "Read the docs" is the one page-owned solid fill (hero, then the close), and the header swaps to "Read the docs" after the hero. Scale has rhythm (h1 52, headings 26, the big 01–05 figure, 44px close). On the phone the header keeps "Try Hanzo" and no bottom bar appeared at scrollY 1600, so the card's "phone bar reads Read the docs" did not show in this walk (shared chrome, noted, not counted).
5. **Every hover and press answers?** Mostly. Stops, pause, noun rows, finder chips, group buttons and processor pills all fill on hover, press to 0.97 and change state (aria-pressed, Play/Pause, sheet opens, focus returns to the trigger on Esc). "API Platform" changes nothing on hover; it only nudges 1px on press. The "ways in" rows and the "View on GitHub" row fill on hover but have no press state (transform stays none).
6. **Overlap, font swap, layout shift?** CLS 0.0004 desktop and 0 phone, no horizontal overflow at either size, and no console errors from this page. The red Next badge seen mid-walk is a parse error in `components/pages/Benchmarks.jsx`, which belongs to another page; it is not counted. Visual faults:
   - Phone: the rail's connector tick stays fixed at x≈187 (over dot 03) while the active dot moves to 01, 02, 04 and 05, so it points at the wrong stop 4 times out of 5.
   - Phone: "/order/{id}/capture" breaks mid-word as "capt / ure" in the journey's captured card.
   - Desktop: the hero's step-01 card hangs outside the gutter (left edge x 105 against the 159 column).
   - Desktop: the ways rows' description column drifts (x 392, 390, 380, 380), and the first three hairlines start at x 143 while the last starts at 159.
   - Mid-fade the endpoint sheet shows the page's lede through its rows, at about 250–500ms.
7. **Which reference, and is its motion there?** apple.com product pages: the pinned scrubbed journey with a big figure counting 01–05 is genuinely there. The osply-style pointer detail is thin, with only the 12px art drift.
8. **Different from its neighbours?** Yes by the card. A full-bleed order rail as the hero medium, against /payments (a phone) and /captable (a figure). I did not walk the neighbours.
9. **All 18 parts covered?** The card has 18 parts filled. These claims did not hold on the page:
   - "something moves within 1 s" (the first move is at about 2.5s);
   - the phone bar reading "Read the docs" (not seen);
   - "Ends in proof strip, Band, footer" with no gap (about 160px of white sits between the GitHub row and the footer).
   The rest checked out: 1 solid fill, h1 52, no text under 13px except 12px Zen Mono capitals, 0 text under 14px on phone, focus returns from sheets.
10. **Banned tells?** None of the hard list: no hue, no gradient text, no pill above a heading, no fade-on-hover. Light ones remain: "inconsistent spacing" in the ways rows, and a mono "COMMERCE" tag repeated on every row of the noun panel.
11. **Copy untouched?** It appears so. Every string I read is Hanzo's register (the card reports parity 272/272), and I found no rewritten line.

## Fixes (ordered, most important first)
- **Hero order and first second.** Lift the h1 so its baseline sits near 38% of 100svh (now at about 74%, y 594–648). Either shrink the rail band (387px tall now) or put the h1 and lede above it on desktop as on the phone. Start the rider within 1s: the first move is at about 2.5s, so either move the card from 01 to 02 at about 700ms on first view or give the resting card an idle motion.
- **Stop showing the order twice.** The pinned journey re-uses the hero's five cards and art. Either let the hero card *become* the journey's first card (one object carried down) or give the journey something the hero does not show, such as its endpoint rows growing as the card lands. Leave the card art off one of them.
- **Give the last four screens an object and cut the gaps.** "Who takes the money"'s integration names (21px two-line walls), "What you are running" (6 text rows) and the ways/Get Commerce block have nothing to look at. Pick one moving or openable object (for example, the spec rows open one at a time beside a still drawing). Close the 200–250px empty bands above "When to reach for it" and above the ways rows, and the ~160px before the footer.
- **Phone rail tick and path wrap.** Move the connector tick with the active dot. It is fixed at x≈187 now and points at 03 while 01/02/04/05 are active. Stop "/order/{id}/capture" breaking mid-word in the captured card: use `overflow-wrap: anywhere` only at "/" (insert `<wbr>` after slashes) or drop the pill to 13px.
- **Ways-in rows and small states.** Align the description column to one x (now 392/390/380/380) and start every hairline at the 159 gutter (rows 1–3 start at 143). Give the ways rows and the "View on GitHub" row a press state (0.98 or translateY 1px). Give "API Platform" a visible hover (arrow nudge or underline). Pull the hero's step-01 card inside the gutter (left edge 105, column 159). Drop the repeated "COMMERCE" mono tag on every row of the noun panels; it says nothing new.
