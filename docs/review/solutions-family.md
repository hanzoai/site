# /solutions/* (template): James-eye review
Verdict: 7/10
First complaint: "I scroll past the diamond film and the very first card is the same diamond film again. Then I click a team and the page just goes white for a second. It should open into that page."

Walked 2026-11-07 17:00 UTC on the dev server at 1470x801 and 375x812, moving (run 3). Members: /solutions/finance (full walk, hovers, presses, sheet, team matrix, card click to /solutions/data and /solutions/sales, 4 cold loads per size) and /solutions/reserved (both sizes, 4 cold loads per size). Hero media checked in server HTML for all 18 members. Parity: finance 50/50 text, 19/19 links; reserved 50/50, 11/11.

## The 11 answers
1. **First screen, 1 s.**
   - Yes on both members at both sizes. Frames at 250/600/1000/1700/2400 ms all differ: the h1 cuts in (absent at 250 ms, set by 600 ms) and the hero film runs. h1 52px, bottom at 328/801 (41%). Phone: h1 40px at 76-159px, primary above the fold, art from 394px.
   - The h1, the lede and the film sell "finance on a ledger" in 5 s. The old vestigial "01 / 05" hero counter is gone.
2. **One in, one out?**
   - Yes on desktop. The pinned rail scrubs five panels over ~3,000px (y 680-3,400), one in focus with a 01-05 progress bar, the neighbours ghosted. Each panel now has its own film (finance: diamonds, wave, wireframe hill, curve, ring). This is the template's moment.
   - But panel 01 is the hero film again (kai.webm at 1470x441 in the hero, then 576x458 in panel 01; reserved: enso ring, same). On phone they sit back to back (p-00 and p-01). Finance shows kai a third time on the "Design" team card.
   - After the rail there is a dead stretch on desktop: ~150px of white, the two sheet pills alone, then ~250px of white before "More teams" (finance d-05/d-06). Reserved has the same gap around its single pill.
3. **Real visual per section?** Yes: hero film, five rail films, six team-art cards, the team matrix (finance), the capacity table (reserved, 3 rows, tabular figures), and a moving black Band. When the matrix overlap is zero (Finance x Engineering) the black "1 FINANCE ∩ DATA" strip collapses and no zero state shows; the section is just two pill lists.
4. **One ask, scale.**
   - Try Hanzo solid in the hero, Contact sales as text, both repeated in the Band. On desktop the header ask goes quiet while a page ask is on screen and solid between them. Nothing floats over content.
   - (Shared chrome: the phone header's always-solid "Try Hanzo" makes two solid fills on the first phone screen. That is site-wide, not this template's.)
   - Scale rhythm holds: one 52px h1, 64px rail numerals, 21px panel heads, 26px section heads, 12px mono captions. Never everything big at once.
5. **Hover and press.** Every main control answers, with no size change (boxes measured before and after). Primary #0a0a0a to #262626, press .97. Contact sales and All solutions underline and nudge 4px, press 1px down. Sheet pills fill #f5f5f5 and the + turns 90°, press .97. Team cards: art scales 1.05, title underlines, press .98. Matrix tabs: grey fill, then the chips fly to their new places on click (frame at 120 ms shows them mid-flight). The sheet rises from the right with six numbered rows.
6. **Overlap, font swap, shift.** CLS 0.0002 desktop, 0 phone, on both members. No horizontal scroll. No overlap at either size; the phone rail keeps its 16px gutter now. Console: 0 errors on 4 of 4 cold loads per member per size.
   - Phone hero art is 420px tall (52svh, brief says 45svh or less). The phone rail uses `scroll-snap-type: x mandatory` (brief says proximity).
7. **Reference.** apple.com is there (pinned scrubbed scene, one idea per screen). synchronized.studio is not: clicking "Hanzo for data teams" wipes the page white and shows a blank screen until the new h1 lands at 1.0-1.5 s (two timed runs, dev server). One run showed the new page scrolled to its old depth first (h1 at -3,356px) before jumping to the top. The card's art is the destination's hero film (sphere to sphere), so the Morph is right there and unused.
8. **Different from neighbours?** Members share one skeleton by design and differ in film plus one section. But the film pool repeats: kai is the hero on 6 of 18 members (finance, design, cybersecurity, financial-services, law, government), so finance and financial-services, the two closest neighbours by subject, open on the same picture. Enso is on operations, agents and reserved.
9. **18 parts.** PageHero, kit Cta, sheet disclosure, kit tabs, table, Band and footer are present; 44px+ targets throughout (smallest 44x44). "SOLUTIONS · TEAMS" sits below the asks as a caption (correct), but it is plain text, not a breadcrumb with links. Morph missing (part 3). Zero state of the matrix missing (part 17).
10. **Banned tells.** None seen: no hue, nothing above an h1 or h2, no gradient text, no fading buttons, no cursor glow.
11. **Copy.** Untouched: parity OK on both members.

## Fixes (in order)
1. Stop the hero film repeating: give rail panel 01 its own film (not the hero's) on every member, and take the member's own art out of its "More teams"-style rails. Spread the hero pool so no two members in one nav column share a film (kai is on 6 of 18; finance and financial-services both open on it).
2. Make the team cards open into their page: the card art is already the destination hero film, so grow it into the hero (600 ms in-out, title within 12px of the h1), keep the hold under 700 ms, start the new page at the top, and reverse on Back. Replace the white wipe and the blank screen.
3. Close the dead stretch after the rail: tuck the sheet pills directly under the rail's last panel (or beside the progress bar) and cut the ~150px and ~250px of white either side.
4. Phone: cap the hero art at 45svh (365px; it is 420px), and set the rail snap to proximity.
5. Team matrix: when the overlap is zero, keep the black strip and show "0" with its label instead of collapsing it. Make "SOLUTIONS · TEAMS" a real breadcrumb (Solutions linked, last item not).
