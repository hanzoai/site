# /solutions/* (template): James-eye review

Ready: 7 Nov 22:35, held up next to /api and /affiliate. Sheets rise over the header; a team card's name lands on the h1 (52px, same breaks) and the open lands on the clicked film; no film twice per page (Sigil where none is left); overlap shows 0; stronger hovers; phone strip peeks. taste/unique/parity OK (agents 45/45, finance 50/50); 0 console errors, no overlap at 1470 and 375.
Copy: 8 Nov, copycheck missing 0 of 37 on /solutions/agents and 0 of 36 on /solutions/finance (captured pages), Hanzo's images kept.
Verdict: 7/10
First complaint: "I click 'What it runs on' and the panel slides in under the menu bar, so its title is cut in half and I can barely see the close button. And the films in the chapters are the same ones I see again in the team cards right below them."

Walked 2026-11-07 17:16 UTC on the dev server at 1470x801 and 375x812, moving (run 4). Members: /solutions/finance (full walk at both sizes; hovers, presses, both sheets, Esc, team matrix tabs, a team card opened to /solutions/sales and timed) and /solutions/reserved (full walk at both sizes, sheet on phone). /solutions/ and /solutions/healthcare were opened first so the dev server had compiled them. Parity: finance 50/50 text and 19/19 links; reserved 50/50 and 11/11.

## The 11 answers
1. **First screen, 1 s.**
   - Yes, on both members at both sizes. Frames at 300 ms and 1000 ms differ. The h1 words cut in: translateY goes from 57px to 0 between 580 and 1300 ms (reserved). The hero film plays from the first frame.
   - Desktop h1 is 52px with its bottom at 328/801 (41%). On phone the h1 is 40px at 76-159px, the ask ends at 342px (it is above the fold at 375x667 too), and the art is 365px tall (45svh, fixed since run 3).
2. **One in, one out?**
   - Yes. On desktop a pinned, scrubbed rail takes five panels across ~3,200px with a 01-05 bar. One film plays at a time, only in the panel in focus (kai, then koma, uta, iro, mori, zen). Panel 01 no longer repeats the hero film (fixed).
   - Between the rail and "More teams" the gap is now 71px. The run-3 dead stretch is gone.
   - On phone the rail is a swipe rail with snap set to `x mandatory`, and 4 of the 5 chapters sit behind the swipe.
3. **Real visual per section?**
   - Yes: the hero film, five rail films, six team-art cards (finance), the finance-to-team overlap matrix (finance), the capacity table (reserved: 3 rows, tabular figures) and a moving black Band.
   - Repeats: 4 of finance's 5 chapter films come back in the "More teams" row a screen later (koma = Sales, iro = Marketing, mori = Engineering, zen = Data). In d-05, panel 05's zen sphere and the Data card's zen sphere are on screen together. Kai (finance's hero) is also the Design card. Hero films are Hanzo's choice and stay; I count only the in-page reuse of chapter films.
4. **One ask, scale.**
   - One solid Try Hanzo in the hero with Contact sales as a text link, and both again in the Band. On desktop the header ask is quiet while a page ask is on screen and turns solid between them. Nothing floats over content while scrolling.
   - Shared chrome: the phone header's always-solid "Try Hanzo" is site-wide, not this template's.
   - Scale has rhythm: the h1 at 52px, rail numerals at 64px, panel heads at 21px, section heads at 26px and 12px mono captions. Never everything big at once.
5. **Hover and press.**
   - Every main control answers, with 0px size change. Primary: #0a0a0a to #262626 on hover, press scale .97. Contact sales: press translateY(1px). Sheet pills fill #f5f5f5, press .97. Matrix tabs: grey fill on hover, and the chips re-sort on click.
   - Sheet rows fill #f5f5f5 and the arrow nudges. Team cards: the art scales to 1.05, but the card itself has no press state (transform none on mousedown).
   - The Band's light button goes from #f5f5f7 to #d2d2d7. These are Apple greys from the shared ramp, not deck values; this is a shared issue.
6. **Overlap, font swap, shift.**
   - CLS was 0.0002 on desktop. No horizontal scroll at either size. 0 console errors on 4 of 4 cold loads for each member. A hydration-mismatch warning appeared once in about 10 loads, so I do not count it.
   - **Overlap (desktop, both members):** the sheet opens at top 12px but sits under the site header (z 300 against the header's 60px). The title "What it runs on" (y 43-65) and the close button (y 32-76) are covered: elementFromPoint at the title returns the header. Cause: `.xs2-after { position: relative; z-index: 1 }` (Solution.css:79) traps the sheet's z-index 960 inside its own stacking context. On phone the sheet starts at 97px and is clear. Esc closes it at both sizes.
7. **Reference.**
   - apple.com: a pinned, scrubbed scene with one idea per screen, and it is there.
   - synchronized.studio is now there too. On a "Hanzo for sales teams" click the card art grows to full screen (150 ms), then lands as the destination's hero film (900 ms). The page is settled at about 1.4 s on the warmed dev server.
   - The card's title does not land on the h1. It shows at 32px on one line near y 125, disappears, and the real h1 then cuts in at 52px on two lines near y 220-330. The hold is longer than 700 ms.
8. **Different from neighbours?** Members share one skeleton by design and differ in film, chapters and one section each (team matrix or capacity table). The /solutions index uses a different hero (a stacked card on the right), so the family does not echo its parent.
9. **18 parts.**
   - Present: PageHero, the kit Cta, sheet disclosure with a native-feeling Esc, tabs, the table, Band and footer.
   - Every phone target is 44px or more (none smaller found on either member).
   - Still open:
     - The matrix has no zero state (Finance × Engineering hides the black overlap strip and shows only two pill lists).
     - "SOLUTIONS · TEAMS" is a caption, not a linked breadcrumb.
10. **Banned tells.** None: no hue, nothing above an h1 or h2, no gradient text, no fading buttons, no cursor glow. The black rooms are the hero film and the Band only.
11. **Copy.** Untouched: parity passes on both members.

## Fixes (in order)
1. Lift the sheet above the header on desktop. Drop `z-index: 1` from `.xs2-after`, or portal the sheet to `body`, so the title, the close button and the scrim cover the header (finance and reserved).
2. Stop chapter films reappearing in "More teams" on the same page. For each member, pick the rail films from those not used by the team cards shown below (or swap that panel to Sigil), so no film shows twice within two screens.
3. Morph polish: carry the card title into the h1 position (within 12px, 52px, the same line breaks) instead of dropping it, and cap the hold at 700 ms.
4. Team matrix: when the overlap is 0, keep the black strip and show "0" with its label. Give the team cards a press state (scale .98).
5. Phone rail: set snap to `x proximity` with a 14-18% peek.
