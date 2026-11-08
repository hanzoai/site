# /careers — James-eye review

Verdict: 7/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). The earlier fixes (JS-off list, reduced-motion match, whole-sheet open, one skill row, perk crossfade, phone numerals) held on re-walk; this pass made the close's sticky-stack actually hold (`.vc-sec` was overriding sticky, leaving a blank screen before the dark close, 443px at 1470 and 1218px at 375) and let the 2,137+ figure read into its label. copycheck missing 0 of 63 (8 Nov, after James's copy rule). taste/unique/parity OK (text 76/76, links 13/13); 0 console errors (also under reduced motion and JS off), no overflow at 1470 and 375. Shared, not this page: the header's solid "Try Hanzo" beside the hero ask; motion.mjs reports the stacked sheets' covered buttons as dead hovers (probe artefact: the top sheet's controls answer).
First complaint: "Why are there twenty-one buttons above seven jobs? Every team button just shows me one job. And when I click a role, the card turns into a grey box, the screen goes grey, and the page just pops in."

Walked 7 Nov. I started on `927bd19` (pinned perks, Ask bar on). Then `38cf09d` and `49e828e` landed at 14:45, mid-walk ("to MASTER.md": deck type, kit `Cta`, no Ask bar, still perks). So everything below was re-run on `49e828e`: `components/pages/Careers.jsx`, `CareersBoard.css`, `company/deck.css` and `doorway.js`.
- Filmed with headless Chromium at 1470×801: wheel in 110px notches with a 1.1s dwell on every screen, plus hover and press on 15 controls, filter, skill chip, copy, the hero ask and a click into a role.
- Filmed at 375×812: isMobile, touch-drag scroll, and taps on the step rail, a perk row, filter, skill chip, copy and a sheet.
- Also checked:
  - the 320 and 375 widths;
  - JS off at both sizes;
  - reduced motion;
  - the layout-shift observer, the console and a Tab crawl.
- Frames were pulled with ffmpeg for the entrance, the filter change, the perk swap and the card open.
- Since the `origin/main` merge (`arrival.js`), the arrival curtain runs on `/` only. So /careers has no curtain, and a first visit and a return visit are the same load.
- Stills: `review/careers/desktop-walk.jpg`, `review/careers/phone-walk.jpg`.

## What works
- **Most of the last review's fixes landed.**
  - The team filter's ink pill now paints ("All" is 51px black at load) and glides 300ms to the team you pick.
  - Phone titles never split a word: a Range check at 320 and 375 found 0.
  - The hiring card's four bars sit on one line (y=644).
  - The card runs on the phone's first screen: it peeks 180px from y=632, its bar is at 25% 1s after load, and it reaches step 2 at about 4.3s.
  - At 320 the step rail wraps two by two.
  - 0 phone targets are under 44px, at 320 and at 375.
  - The Academic pills now sit under each h3.
- **The first screen sells and fits.**
  - At 1470×801 the h1 is the deck's 84px Book at line height 1.02, in four lines (200–558). The lede ends at 677 and "View Open Positions" sits at 705–753.
  - At 375 the h1 is 41px in four lines, and the ask's bottom is at 528.
  - The h1 cuts in line by line, and the card's bar fills within 1s.
- **One solid at a time.**
  - Careers has no Ask bar by rule (MASTER part 4; PLAN 2.4), so `data-ask="off"` is set.
  - Down the page the solids come singly: the hero, "Submit Open Application", "Apply for Research Internship", then "Browse Open Positions". Two never share a screen, at either width.
  - The hero ask smooth-scrolls to `#open-positions` in about 800ms, in the same document.
- **The deck is still the moment.**
  - Sheets rise and stack, and the stack behind settles.
  - Hover darkens and lifts the Air numeral 6px and underlines the title.
  - Press is .97 on every button.
  - Copy link draws a tick, puts `…/careers#compiler-engineer` on the clipboard and announces "Link copied".
  - A skill chip ("compilers") lights 2 of 7 roles, marks the words and dims the rest.
- **The landing now matches.** The role template (another group's) opens on the same giant numeral in ink, with no blue.
- **Clean numbers.**
  - CLS 0 at both sizes.
  - The console is clean with motion on.
  - Reduced motion: 0 running animations, and the deck is unstuck.
  - No sideways document scroll at 320 or 375.
  - Parity: text 76/76, links 13/13.
  - `taste.py` OK.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes: the h1 cuts in, and the card's bar runs.
   - With no curtain, the server HTML holds the h1 lines below their masks, and the card and lede at opacity 0, until hydration.
   - On the dev server, first paint (560ms) is the header over an empty hero for about 450ms before the cut-in.
   - It is shorter in production, but the LCP text is still invisible until JS.
2. **One in, one out, or a document?** Hero, then a headline screen, then the perks as a still list, then the deck (the one scene), then Academic, then the dark close.
   - That is MASTER 4.5's Utility brief: no scroll theatre, one delight.
   - To James it reads as a calm document with one strong scene in the middle.
   - The Open Positions screen is the busy one: 8 team pills, 13 dashed mono skill chips and a count, over 7 roles.
     - Each team has exactly one role, so every team filter returns one sheet.
   - Academic is still two boxes of paragraphs.
3. **A real visual object in every section?** Yes:
   - the hiring card;
   - a Sigil tile with a giant Air numeral for the perks;
   - the sheets' ghost numerals;
   - a Sigil band and the 2,137+ figure in Academic;
   - a Sigil in a hairline box in the close, drawn only in its left third.

   Every object is a numeral or a contour. Numbered runs repeat: card 01/04, perks 01–04, roles 01–07, and the role page's 03.
4. **One ask, sticky after the hero?** There is no sticky ask, by the careers rule. The page's own ask returns only at the deck end and in the close.
   - The header's "Try Hanzo" stays solid black on every screen, so the first screen shows two black pills with different words. That is the site header's state, not this page's.
5. **Every hover and press answers, no jumps?** Yes, with no jumps, apart from these:
   - The dark sheet's "Submit Open Application" has no hover state (press only).
   - A perk row swaps its numeral and field in one frame (under 16ms). The "redraw" is a cut; only the h3 eases 6px.
   - A filter change fades the whole deck out (about 450ms) and back in (by about 700ms). It is still a remount, not a re-flow.
6. **Overlaps, font swap, layout shift?** No hero overlap, no font swap, CLS 0. But:
   - **JS off, both sizes: the hiring card prints all four steps on top of each other** (desktop still 8, phone still 9).
     - Cause: the site's noscript rule in `app/layout.jsx` (`main [style*="transform"]{transform:none!important}`) clears the 104% offsets that keep steps 2–4 below the mask.
     - The page's own `NOJS` only resets the containers.
   - **Reduced motion: a hydration mismatch.**
     - `Hire` renders the first bar `className="wait"` on the server and `"done"` on the client (`useReducedMotion`).
     - React does not patch it, so the bar stays empty and the console logs a hydration error.
   - **Phone:** each title runs over its ghost numeral. At 320 that is 6 of 7 titles ("Compiler Engineer" across "02", phone still 6). At 375 it is 2 of 7: "Compiler Engineer" and "Senior Backend Engineer (Go/Rust)".
   - At 320 the header's "Try Hanzo" is cut at the right edge, and body is 352px wide (site header and footer, not this page).
7. **Which reference, is its motion there?** Apple: the stacked deck. osply: the type.
   - **synchronized.studio is only half there.** On a click, the sheet's content area becomes a flat #f5f5f7 slab inside the white card (still 6). It grows to full screen in 677ms, holds flat grey until the route commits (about 400ms on desktop, about 500ms on the phone), then cuts to the role page.
   - The title never travels, and the next page's hero is not the card you clicked; only its numeral matches.
   - The wipe away never plays on the dev server: the cover vanishes in the same frame as the URL change.
     - Cause: React's dev double effect runs `useArrival` twice. The second run cancels the first wipe, and that wipe's rejection handler (`() => d.remove()`) removes the cover.
     - A production build runs the effect once, so the wipe should play there. Not verified here.
8. **Different from neighbours?** The deck is its own signature. The hero is still the headline-left, card-right split that the last review found on /contact and /investors (not re-walked).
9. **18 areas (PLAN-COMPONENTS)?** See below.
10. **Banned tells?** None found.
    - No hue, no gradient text, no native tooltip and no default control.
    - No pill or eyebrow over an h1 or h2. "OPEN REPOSITORIES" is a figure label above an h3, which MASTER allows.
11. **Copy untouched?** Yes: parity clean, and "2,137+" traces to the careers copy.

### The previous review's fixes
- **Done:**
  - fix 1, the filter pill;
  - fix 3, phone titles;
  - fix 4, one solid with the bar (the bar is now off by rule);
  - fix 5, the JS-off perks;
  - fix 6, waking the card, aligning the bars and wrapping at 320;
  - the Academic half of fix 7.
- **Partly done:**
  - Fix 2: the doorway replaces the white blink, but there is no title flight. The role template's blue is gone (another group's fix).
  - Fix 7's filter: it now fades out and back in, but it still remounts.
  - Fix 8: coverage is corrected, but there are new errors (below).
- **New since then:** the JS-off overprint in the hiring card, and the reduced-motion hydration error.

## Missing from the 18 areas
- **2.3 First impression:**
  - No next section peeks at 1470×801: the perks start at y=861.
  - The h1 is invisible at first paint now that the curtain is gone.
  - No title lands within 12px of the role h1.
- **2.6 Content:** phone titles over their ghost numerals (6/7 at 320).
- **2.8 Components:** the dark sheet's solid has no hover.
- **2.9 Motion:**
  - The perk swap is a cut.
  - The filter fades out and back in, not a re-flow.
  - On the dev server, the open holds on grey and cuts.
- **2.11 Mobile:** a tap on perk 03 redraws a tile that is mostly above the screen (tile top -61, bottom 148), so the answer is unseen.
- **2.12 / 2.17 Accessibility and states:**
  - JS off: the hero card overprints.
  - Reduced motion: an empty first bar and a hydration error.
- **2.15 Catalogue:** the card does not open into its page in the synchronized sense. It is a grey flood.
- **2.18 Coverage doc and header accuracy.** Claims that are wrong:
  - "ask bottom about 660px" at 1470 (it is 753);
  - "at 375 the ask's bottom is at 603px" (it is 528, which is better);
  - "the h1 cuts in once the curtain lifts" (there is no curtain on /careers);
  - "JS off: legible… 0 hidden" (the hero card overprints);
  - "grows in #f5f5f5 … the cover wipes, about 1.1s" (the code uses #f5f5f7, which is not a deck value and not the sheet's white, and on the dev server it cuts at about 1.1s);
  - "every control has hover";
  - "Sigil field redrawing" (it swaps).

  Also, `Careers.jsx`'s header (lines 2–8) still says the ask rides the site Ask bar and that the title flies into the role h1.

## Fixes (in order)
1. **Make JS off and reduced motion clean.**
   - Add `.xcb-hire-s[aria-hidden="true"]{display:none}` to the page's `NOJS` rule, so only step 1 shows without JS.
   - In `Hire`, derive the bar class after mount, or add a CSS rule `@media (prefers-reduced-motion: reduce){.xcb-hire-n u.wait{transform:scaleX(1)}}`, so server and client agree.
   - Check that the console is clean under reduced motion.
2. **Make the click open the card.**
   - Grow the whole `.xcb-sheet-in` rectangle, not the anchor's inner box, in the sheet's own white (#fff), with the title still visible.
   - Carry the title (or at least the numeral) toward the role page's h1 and numeral positions as it grows.
   - Make `useArrival` idempotent, so a cancelled wipe never removes the cover (`a.finished.then(remove, () => {})`, and remove on the last run).
   - Confirm the wipe in a production build, and that no flat-grey hold goes past about 150ms.
3. **Cut the toolbar.**
   - Each team has one role, so drop the team filter row, or let the sheet's own team tag be the filter.
   - Keep the skill chips in one quiet row, so the Open Positions screen holds the title, one row and the deck.
4. **Let the perks answer visibly.**
   - Crossfade the numeral and field (300ms, ease-emphasis) instead of swapping them in one frame.
   - On phones, put each perk's numeral in its own row, or keep the tile sticky above the list, so a tap shows its answer on screen.
5. **Phone titles clear of the numerals.** At 900px and below, reserve right padding for the numeral (about 64px), or sit it lower behind the meta row, and check 320.
6. **Smaller items:**
   - Give the dark sheet's solid a hover state (to white, as the close's does).
   - Let a sliver of the next section show at 1470×801.
   - Correct the `Careers.jsx` header and `docs/build-notes/coverage/careers.md` with the numbers above.
