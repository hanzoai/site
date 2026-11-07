# /solutions/* (template) — James-eye review

Verdict: 6/10
First complaint: "It's the same picture five times with a big number on it. And when I press the plus, the panel's title is hiding under the menu."

Walked 7 Nov, 14:30 to 15:05. Template `components/pages/solutions/Solution.jsx` and `Solution.css`, judged on `a4af13e` (v4) with the Families kit at `fe077aa`. v3 (`9cffbc7`) was walked first.

Members: /solutions/finance and /solutions/reserved, both filmed moving:
- 1470×801 with the wheel, and 375×812 with finger drags;
- idle frames on a cold and a warm load;
- every kind of control hovered and pressed;
- a sheet opened and closed, the overlap finder used, a sibling card clicked;
- a sideways swipe on the phone, reduced motion, and JS off.

Stills: `img/solutions-family-jobs.jpg`, `img/solutions-family-sheet.jpg`, `img/families-first-screens.jpg`.

## What works
- **Hanzo's own model film is the hero object**: the kai lattice on finance, the enso ring on reserved. It sits beside the headline and plays the jobs like stories:
  - a bar fills over 5.2 s;
  - the job's title rises over the film;
  - hovering holds the story.

  On a warm load the film is playing by 0.4 s.
- **The jobs are a pinned scene.** Words on the left, the film on the right, a giant white numeral 01–05, and the story bar advancing one segment per job. That is Apple.
- **v4 ends the page sooner.** "What it runs on" and "Security and compliance" open as sheets from the last job, keeping every word (with JS off they show in place). The page now runs jobs, then more teams, then the closing room. Escape closes a sheet and focus returns to its trigger.
- **The overlap finder is a real "beyond".** Pick another team: the pill glides, the shared products land in a black box, and each side's own products are listed.
- **The closing room is dark, with the film behind it.** One solid "Try Hanzo" and an outlined "Contact sales".
- **Clean on the checks:**
  - 0 UI hues; the only colour comes from the film, which is monochrome anyway.
  - No eyebrows.
  - Parity: finance 50/50 and 19/19; reserved 50/50 and 11/11.
  - Reduced motion: 0 running animations, films paused on their poster. JS off: everything legible.
  - Phone swipe: finance to financial-services, reserved to retail.
  - No sideways scroll at 375. CLS 0.002 or less.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. But the h1 is now 44px (kit change), next to a 650px film, so the film is read first and the headline reads like a caption. On a cold dev load nothing moved for 1.5 s while the page hydrated; warm, it plays by 0.4 s.
2. **One in, one out, or a document?** One in, one out through the five jobs. Then the "More teams" rail and the overlap finder, then the close.

   On reserved, "More solutions" is a heading with nothing under it, followed by a blank band before the close.
3. **A real visual object in every section?** Yes, except reserved's empty "More solutions". But it is the same picture seven times: the hero, the five jobs and the close.
   - Since v4, the playing clip sits on top of each job's reframed still without that framing, so all five job shots show the identical frame (`img/solutions-family-jobs.jpg`).
   - JAMES.md 6, a block of four or more real Hanzo visuals at once, never happens.
4. **One ask, sticky after the hero?** "Try Hanzo" is magnetic in the hero, and the ask bar carries it after the hero at both widths. Two problems:
   - At the close, the header ask turns solid while the band's "Try Hanzo" is also solid: two at once (desktop around y=6100, phone around y=4977).
   - The sibling rail shows four or five solid black arrow discs.
5. **Does every hover and press answer, with no jumps?** No.
   - The closing room's "Try Hanzo" and "Contact sales" change nothing on hover.
   - Nor do the overlap pills or the overlap's side link ("Data").
   - The "+" triggers cut their previews off mid-word ("…on one acc…", "Creden…").
6. **Overlaps, font swap, layout shift?** Yes.
   - The sheet opens under the site header. Its title "What it runs on" and its close button sit at y=12–93, under the 60px header.
   - The header stays bright above the scrim, still showing its solid "Try Hanzo" (`img/solutions-family-sheet.jpg`).
   - A story change shifts the job block slightly (CLS 0.001–0.006 on reserved).
7. **Which reference does it feel like, and is its motion there?** The Apple pinned chapters are there, and the stories bar is a good idle mover.

   synchronized.studio is claimed for the sibling cards, but it is not there. After a click, the current page jumps to its own top, and only then cuts to the next page (dev server). No title flies into the next h1.
8. **Different from its neighbours?** The medium is (film). The composition is the same as /oss/* and /products/*:
   - title on the left, a black rounded card on the right;
   - chapters with words on the left and a card on the right;
   - a sibling rail with black discs;
   - a dark close (`img/families-first-screens.jpg`).
9. **Every one of the 18 areas covered?** See below.
10. **Any banned tells?** None as such. The text cut off in the "+" triggers gives the "lazy" look he rejects.
11. **Copy untouched?** Yes; parity is clean.

## Missing from the 18 areas
- **2.3 Narrative:** the five job shots are identical. Reserved's "More solutions" is empty.
- **2.4 Conversion:** two solids at the close, and filled arrow discs on the sibling cards.
- **2.8 Components:** the sheet opens under the header (FamDrawer is the shared kit, so the fix belongs there). The trigger text is cut off. The closing asks and the overlap controls have no hover.
- **2.10 Media:** one film is used seven times, with no block of several Hanzo visuals. The sibling cards could carry their own members' films instead of contours.
- **2.12 Accessibility:** the sheet's close button is hidden under the header. The overlap's "Data" link is 33px wide on the phone.
- **2.15 Catalogue:** the overlap finder can show a black box holding only a giant "0" ("0 FINANCE ∩ ENGINEERING").
- **2.6 Type (kit):** the h1 is 44px and the section headings 26px, against JAMES.md 1 and the master brief's 36–64px.
- **JAMES.md 10 Sound:** none on the sheets, pills or ask. The shared kit is not built yet.

## Fixes (in order)
1. **Five jobs, five pictures.** Apply each job's framing (object position and scale) to the playing video as well as to the still, so the five shots differ again. Better still, give each job its own Hanzo shot.
2. **Fix the sheet.** Open it below the header (top at the header's height), or above the header with the header dimmed under the scrim. The title and close button must always be visible.
3. **One solid at the close, and every tap answers.**
   - Keep the header outlined while the band's ask is on screen (treat `.xs2-band` like `.x-band`).
   - Give the band's two buttons, the overlap pills and the side link a hover that changes the fill or underline, not the opacity.
   - Swap the filled arrow discs on the sibling cards for an outlined arrow.
4. **No empty section.** Where a member has no sibling cards (reserved), drop the "More solutions" heading and put "All solutions" in the close, or show the rail built from Hanzo's existing links.
5. **The "+" triggers.** Show the section's title only, in Hanzo's words, or let the preview wrap to two lines. Never cut it mid-word.
6. **Overlap and type.**
   - When the intersection is 0, show the two columns only, with no black box holding a giant 0.
   - Give the headline its size back (72px or more on desktop, per JAMES.md 1), so the sentence is read before the film.
