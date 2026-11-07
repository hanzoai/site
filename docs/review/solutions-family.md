# /solutions/* (template): James-eye review
Verdict: 7/10
First complaint: "It tells me the same five things twice. The hero flicks through them, then I scroll through the same five cards with the same picture five times. And the teams twice, back to back. That's a template showing, not one thing in, one out."

Walked 2026-11-07 16:28 UTC on the dev server at 1470x801 and 375x812, moving. Members: /solutions/finance (full walk, hovers, presses, sheets, matrix) and /solutions/reserved (both sizes). Parity: finance 50/50 text, 19/19 links; reserved 50/50, 11/11.

## The 11 answers
1. **First screen, 1 s.**
   - Yes. h1 cuts in word by word (frames 0 and 700 ms differ, both members, both sizes); the hero film plays (finance diamond lattice, reserved light ring); h1, lede, Try Hanzo and Contact sales all above the fold at both sizes (phone h1 76-159px, art from 395px).
   - The black film strip under the head (1470x441) auto-cycles 01/05 to 05/05 (about 5 s a slide) with **no pause control** in the DOM (finance; same on reserved).
2. **One in, one out?**
   - Mostly. The pinned horizontal rail scrubs 5 cards across ~2,700px of scroll on desktop (6 of 11 stops on finance, 6 of 10 on reserved), one card in focus, the last one fading.
   - But the rail repeats the hero: the same 5 headings the hero strip just cycled ("Reconcile against a ledger that balances" is hero caption 01 and rail card 01) over the **same film cropped 5 times** (finance all lattice, reserved all ring). Content shown twice, art shown six times.
   - Finance: "More teams" (6 cards) is followed directly by the matrix whose tabs are the same 6 team names.
3. **Real visual per section?**
   - Hero film, rail films, 6 distinct team art cards (finance) and a capacity table (reserved, 3 rows, tabular, right-aligned): yes.
   - Finance matrix: the "object" is a black box with a numeral and pills over faint circle lines on a canvas (1152x454); reads as a pill dump, not an object.
   - About 200px of empty white above "More teams" on desktop (finance d-06).
4. **One ask, scale.**
   - Try Hanzo solid in the header and hero; band repeats it (3 placements, within rule). data-cta on all four asks. Nothing floats over content.
   - Scale: h1 is **72px** at rest on desktop (rule: 52px resting); rail numerals 64px; H2s 26px, H3 13-21px. Rhythm is otherwise fine: one big thing per screen.
5. **Hover and press.**
   - Primary: background #0a0a0a to #262626 on hover, scale 0.974 on press. Team card: art scales 1.05 and title underlines. Matrix tabs: gliding grey pill, count updates (Finance x Data 1, x Sales 2). Sheets ("What it runs on", "Security and compliance") rise from the right on desktop and from the bottom on phone, numbered rows with arrows. All answer, no jumps.
   - Hero product pills (6, finance) look like buttons but are not links and do nothing.
6. **Overlap, font swap, shift.**
   - No overlap or horizontal overflow at either size; h1 box identical across the first 900 ms; Zen confirmed as the rendered face.
   - **Red "1 Issue" dev badge on a first visit** (no hz-arrived in storage): React hydration attribute mismatch, both members, both sizes. Return visits are clean. Fails DONE #3.
7. **Reference.** apple.com product page (pinned scrubbed scene, one idea per screen) is there in the rail. synchronized.studio card-to-page from the team cards was not tested in this walk (hover only).
8. **Different from neighbours?** Within the family, members differ only by film and one section (finance matrix vs reserved capacity table). Against /solutions index it has its own rail; acceptable for a family template.
9. **18 parts.** Breadcrumb not visible; eyebrow "SOLUTIONS · TEAMS" sits below the asks as a caption (correct). Disclosure via sheet, kit-like tabs, Band and footer present. No pause control on the auto hero (part 12).
10. **Banned tells.** None seen: no hue, no eyebrow above h1/h2, no gradient text, no fading buttons. Rail images are the same film repeated (repetition, not a banned tell).
11. **Copy.** Parity OK on both members.

## Fixes (in order)
1. Kill the hydration mismatch so the first visit has no red badge (finance and reserved, both sizes).
2. Stop saying it twice: make the hero strip one still-running film with a single caption (or no caption) and let the rail be where the five items arrive; give each rail card its own crop or frame of motion so 01-05 do not look identical.
3. Add a 44px pause control first in the hero strip (it runs past 5 s), frozen under reduced motion.
4. Finance: separate "More teams" from the team matrix (or fold the matrix into the cards) so six team names are not stacked twice; give the matrix a real object (e.g. the two product sets drawing into their overlap) rather than pills on faint circles.
5. Bring the resting h1 to 52px (let it grow only as the moment), and close the ~200px dead white above "More teams".
6. Make the hero product pills links to their product pages, or set them as plain captions so they stop looking pressable.
