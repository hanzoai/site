# /solutions/* (template): James-eye review
Verdict: 7/10
First complaint: "It's the same picture over and over. Finance is the diamond film in the hero, five times in the cards and again at the bottom; Reserved is the ring seven times. The scroll moves, but nothing new comes in."

Walked 2026-11-07 16:47 UTC on the dev server at 1470x801 and 375x812, moving (run 2). Members: /solutions/finance (full walk, hovers, presses, sheets, team matrix, 4 cold loads) and /solutions/reserved (both sizes, hovers, 4 cold loads). Parity: finance 50/50 text, 19/19 links; reserved 50/50, 11/11.

## The 11 answers
1. **First screen, 1 s.**
   - Yes, on both members at both sizes. The h1 cuts in word by word (150 ms frame shows words mid-rise, settled by 500 ms), and the hero film loops (6.0 s). h1 52px, bottom at 41% of 801. Phone: h1 bottom 159px, primary bottom 342px (finance) / 366px (reserved), art from ~395px.
   - The hero strip shows "01 / 05" and it never changes (read every 2.5 s for 15 s, finance). It looks like a slide counter but nothing counts. The pause button (44x44) is there.
2. **One in, one out?**
   - Yes on desktop: the pinned rail scrubs one panel at a time across ~3,000px (y 600-3,600). Exactly one heading is in focus per 200px step, and the panel on either side is ghosted. This is the template's moment.
   - But every panel uses the hero's film. Finance loads kai.webm/webp 10 times (hero, rail 01-05, band); reserved loads enso 11 times. Five steps, one picture.
   - Finance: "More teams" (6 cards) sits directly above a matrix whose 6 tabs are the same 6 team names.
3. **Real visual per section?**
   - Hero film, rail films, 6 distinct team-art cards (finance: zen, koma, iro, enso, mori, kai) and the capacity table (reserved, 3 rows, tabular figures): yes.
   - Finance matrix: once its count goes to zero (Finance x Engineering) it is two pill lists on faint drifting circles, and the Finance box is ~45% empty white. On reserved, the "What it runs on" pill sits alone in a mostly empty screen between the rail and Capacity.
4. **One ask, scale.**
   - Try Hanzo solid in the hero, Contact sales as a text link, both repeated in the black Band. Nothing floats over content on desktop. (Shared chrome: the phone header's always-solid "Try Hanzo" makes two solid fills on the first phone screen. That is a site-wide issue, not this template's.)
   - Scale rhythm holds: one 52px h1, rail numerals 64px, 21px panel heads, 26px section heads, 12px mono captions.
5. **Hover and press.**
   - Primary: #0a0a0a to #262626 on hover, scale .97 on press. Pause: fill change and .97. Sheet triggers: .97 press, and the sheet rises with numbered rows. Team card: art scales 1.05 and the title underlines. Matrix: grey pill glides and the chips fly to their new places (frame at 150 ms shows chips mid-flight).
   - Hover changes nothing on "Contact sales" or on the "What it runs on" / "Security and compliance" triggers (only a 1px press). Same on both members.
6. **Overlap, font swap, shift.**
   - CLS 0.0002 on both members. No horizontal scroll at 375 or 320. No overlap at either size.
   - Phone: the rail cards and their text sit at x=0 with no 16px gutter ("Reconcile against a ledger…" x=0, "A dedicated compute cluster" x=0) on both members.
   - Phone hero product line is right-aligned and wraps with "Sign" (finance) or "Enterprise" (reserved) alone on the last line.
   - Faint concentric rings drift behind the matrix tabs, crossing "Marketing" and "Operations".
   - Console: 0 errors on 4 of 4 cold loads per member. A red "1 Issue" badge showed once in a 5th context and did not reproduce on 4 fresh cold loads, so it is not counted.
7. **Reference.** apple.com (pinned scrubbed scene, one idea per screen) is clearly in the rail. synchronized.studio card-to-page was not exercised (team cards hover only).
8. **Different from neighbours?** Within the family, members differ only in their film and one section (finance matrix, reserved capacity table). That is acceptable for a template, but the single film per member makes members read as recolours of one page.
9. **18 parts.** The eyebrow "SOLUTIONS · TEAMS / RESERVED TIER" correctly sits below the asks as a caption. Sheet disclosure, kit tabs, DataTable-style capacity, Band and footer are all present. I did not see a breadcrumb at depth 2. Hero counter is vestigial.
10. **Banned tells.** None: no hue, nothing above the h1/h2, no gradient text, and buttons do not fade. The repeated film is a "repeats" complaint, not a banned tell.
11. **Copy.** Parity OK on both members.

## Fixes (in order)
1. Give each rail panel its own picture: a distinct frame or crop of motion per step (finance kai x5, reserved enso x5 today), and do not reuse the hero film in the Band. Then each step brings in something new.
2. Make the hero counter true or remove it: either advance it with the rail below, or drop "01 / 05" so the strip is one running film.
3. Phone: put the 16px gutter back on the rail (cards and copy start at x=0 on both members), and set the hero product line left-aligned so it does not end on one orphan word.
4. Finance: stop stacking six team names twice ("More teams" cards, then matrix tabs). Fold one into the other, and when the overlap is zero give the matrix something to show instead of a half-empty white box. Keep the drifting rings clear of the tab labels.
5. Give "Contact sales" and the sheet triggers a hover answer (arrow nudge, the + turning), not only a 1px press. Close the empty screen around the lone "What it runs on" pill on reserved.
