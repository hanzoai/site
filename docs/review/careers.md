# /careers — James-eye review

Verdict: 7/10
First complaint: "I click a role and it just blinks white and jumps to another page. Where's the card opening into the page? And why is there an empty white button in the filters?"

Walked 7 Nov, page files as of `9e22aba` (`components/pages/Careers.jsx`, `CareersBoard.css`, `company/PinScenes`, `company/MaskLines`, `company/useArrived`). Two careers commits landed during the walk (`bc78cc6` Ask name, `9e22aba` hero waits for the curtain, hero legible with JS off), so the arrival, idle and JS-off checks were re-run on them.
- Filmed with headless Chromium at 1470×801 (wheel in 100–120px notches with a dwell on every screen; hover and press on 15 controls; filter, skill chip, copy link; a click into a role page).
- Filmed at 375×812 (isMobile, touch-drag scroll, taps on the step rail, filters, skill chip and copy).
- Also checked: 320 and 375 widths, JS off at both sizes, reduced motion, the layout-shift observer and the console.
- Frames were pulled with ffmpeg for the arrival, the perk wipes, the deck, the filter change and the morph.
- Stills: `review/careers/desktop-walk.jpg`, `review/careers/phone-walk.jpg`.

## What works
- **The previous review's main complaints are fixed.**
  - 0 UI hues (no saturated colour anywhere in `<main>`).
  - No eyebrow over the h1 or any section headline.
  - No native `title=` tooltips.
  - Every phone target is 44px or more (0 under).
  - The hiring card now slides through a mask, never two titles at once.
  - Copy link draws a tick and announces "Link copied", on desktop and on a phone tap.
- **The first screen sells and fits.** At 1470×801 the h1 is 91px at line height .94 in four lines, and the lede and "View Open Positions" sit above the fold (button bottom about 774px at rest). At 375 they also fit (button bottom 603).
  - The headline now cuts in as the curtain clears.
  - The hiring card slides to step 2 within 1s of the curtain going, with its bar filling.
- **One ask, and it is sticky.** The site bar carries "View Open Positions" after the hero on desktop and on the phone, labelled "Careers", and the header's "Try Hanzo" turns outline while it shows.
- **The scroll story now has scenes.**
  - The perks pin: 02 wipes up over 01 with a clip-path, and the rail counts.
  - The roles are a deck: each sheet rises over the last and the stack behind settles.
  - Sheet hover darkens and lifts the numeral 6px and underlines the title.
  - Press is .98 on every button, and text links underline and nudge their arrow.
- **Clean numbers.**
  - CLS 0 at both sizes.
  - Reduced motion: 0 running animations, and the deck is unstuck.
  - No sideways document scroll at 320 or 375.
  - Parity: text 76/76, links 13/13, re-run after the mid-walk commits.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes. Phone: the words sell, but once the curtain is gone the first screen is dead. Two shots 1s and 4s after it lifts differ by 0 pixels.
   - The hiring card only peeks at y=707, so its timer is paused (it needs half the card in view).
   - Its first bar has already filled to the end anyway, so it looks stuck.
2. **One in, one out, or a document?** Mostly scenes now: the pinned perks and the role deck.
   - The perks spend four full screens on four one-sentence perks set at about 17px, beside a 340px numeral.
   - The Open Positions toolbar is a wall of 21 pills (8 teams and 13 skills).
   - After the deck there are about 330px of blank white before Academic.
   - Academic is still two boxes of paragraphs.
3. **A real visual object in every section?** Yes, though every object is a numeral or a contour:
   - the hiring card;
   - numeral plus Sigil for each perk;
   - the sheets with ghost numerals;
   - a Sigil band and the 2,137+ figure in Academic;
   - a Sigil in a thin bordered box in the close.

   That is three numbered runs back to back: card 01–04, perks 01–04, roles 01–07. The careers copy has no Hanzo imagery, so no image wall is owed.
4. **One ask, sticky after the hero?** Yes at every width. But the bar's solid shares the screen with a second solid in three places:
   - "Submit Open Application" at the end of the deck;
   - "Apply for Research Internship" in Academic;
   - "Browse Open Positions" in the close. Here the bar does not step aside, so two white solids with near-identical words sit on one screen (desktop still 8).
5. **Every hover and press answers, no jumps?** Hover and press do, but one state is broken.
   - **The team filter's selected state is invisible.** The label turns white, but the black pill never paints.
     - Cause: `.xcb-filter button span { position: relative }` (CareersBoard.css:57) also matches the pill span. It outranks `.xcb-pill { position: absolute }`, so the pill is 0px wide.
     - So "All" is a blank white pill on load, and any team you pick goes blank too (desktop still 4).
   - A filter change is a hard cut: the deck remounts on `key`, so nothing glides or re-flows.
6. **Overlaps, font swap, layout shift?** No hero overlaps, no font swap and CLS 0. But:
   - **Phone:** "Cryptography Engineer (ZKP)" breaks mid-word into "Cryptograph / y Engineer". The title column is 187px at 32px, with `overflow-wrap: break-word` (phone still 5).
   - **Desktop:** in the hiring card, the third progress bar sits 8px above the others (644 vs 652). Its two-line label is centred in the button.
   - **At 320:** the step rail (to 346px) and "Apply for Research Internship" (to 332px) are clipped inside their boxes.
   - **JS off on desktop:** the hero is now legible, but 3 of 4 perks ("Your own hours", "Small team", "The work is public", headings and bodies) stay at opacity 0. PinScenes renders its off-state on the server.
   - A hydration warning appeared on two cold compiles and did not come back on warm loads (dev only).
7. **Which reference, is its motion there?** Apple: the pinned perks and the deck are real. osply: the type.
   - **synchronized.studio is claimed but does not happen.** Clicking a sheet aborted the view transition every time (3 of 3): "Transition was aborted because of timeout in DOM update".
   - The frames go sheet, white frame, then the role page's own headline cutting in. The title never flies.
   - **Cause, in the shared `components/Morph.jsx`:** it resolves the update inside `requestAnimationFrame`. rAF does not fire while a view transition holds rendering: a bare test took 4062ms with rAF against 852ms with a timeout.
   - **The landing is off-brand too.** The role page (`CareerRole`) opens on a blue mono kicker over its h1 and a blue solid "Apply for this position".
8. **Different from neighbours?** Partly. It is no longer the /affiliate twin (orange and kicker gone). But the hero is the same split as /contact and /investors: headline left, card right. The deck is its own signature.
9. **18 areas (PLAN-COMPONENTS)?** See below.
10. **Banned tells?**
    - **Pills above a headline:** both Academic panels set a row of pills directly over their h3 ("Free API & GPU credits / Full Hanzo Team access / Publish open weights & papers", and "Recurring credit grants / Hanzo Team & Dev access").
    - **Borderline:**
      - the mono "HOW WE HIRE" label and the "01" over each step title inside the card;
      - the "01 / 04" counter over each perk title.
    - No hues, gradient text, native tooltips or default controls.
11. **Copy untouched?** Yes: parity clean, and "2,137+" traces to the careers copy.

### The previous review's fixes
- **Done:**
  - Fix 1, the eyebrows. Only the Academic pills remain.
  - Fix 2, the orange.
  - Fix 3, the fold and the desktop sticky ask.
  - Fix 4, one solid on the sheets and in the Academic pair. The bar now doubles up instead (answer 4).
  - Fix 6, mostly: the perks pin with numerals, and the card's mask slide, 44px targets and "Copied" all landed.
- **Not done:** fix 5, the continuous click.

## Missing from the 18 areas
- **2.3 First impression:**
  - The phone first screen is idle after the curtain.
  - No next section peeks at 1470×801.
  - The morph title does not land within 12px of the destination h1; it does not fly at all.
- **2.4 Conversion:** one solid per viewport fails where the bar meets "Submit Open Application", the Academic solid and the close.
- **2.6 Content:** the mid-word break on the phone sheet title.
- **2.8 Components:** the filter's pressed state is invisible (a CSS specificity clash).
- **2.9 Motion:**
  - A filter change is a cut, not the claimed re-flow.
  - The perk words only fade and rise.
  - The hiring card's bar and timer fall out of step when the card starts off screen.
- **2.11 Mobile:** clipping at 320 in the step rail and the intern button.
- **2.12 / 2.17 JS off:** 3 perks hidden on desktop.
- **2.15 Catalogue:** the card does not open into its page.
- **2.18 Coverage doc accuracy.** Claims that are wrong:
  - "the ask's bottom is at about 680px" (it is about 774);
  - "the filter pill glides";
  - "JS off: every heading is legible";
  - "a filter re-flows the deck";
  - "its title flies into the role page's h1".

## Fixes (in order)
1. **Show the selected team.** Scope the label rule to `.xcb-filter button span:not(.xcb-pill)`, or raise `.xcb-pill` to `.xcb-filter .xcb-pill { position: absolute }`. Check that "All" loads as a black pill and that the pill glides on a click.
2. **Make the click open the card.**
   - Send the Morph owner the bug: `Morph.jsx` must resolve the view-transition update without `requestAnimationFrame`, for example by calling `ok()` directly once the new route has committed. Then confirm the sheet title lands within 12px of the role h1.
   - On the role page, the kicker over the h1 and the blue "Apply for this position" go to ink, so the white sheet lands on its own kind of page.
3. **Phone sheet titles never break inside a word.** At 900px and below, take the numeral out of the title's row (absolute, top right, behind the title) so the title gets the full width, or clamp it to about 28px. Check "Cryptography" and "Senior Backend Engineer (Go/Rust)" at 320 and 375.
4. **One solid on screen with the bar.** In the close, make the bar step aside: mark it `data-ask-hide`, or make it the closing `.x-band`. At the deck end and in Academic, either let the bar yield or outline the in-section button, so two solids never meet.
5. **JS off for the perks.** Give PinScenes the same `noscript` rule the hero got (perk words and visuals at opacity 1, unclipped, stacked), so all four perks read on desktop.
6. **Wake the phone first screen and tidy the card.**
   - Run the hiring card once its top is on screen (`amount` about .15). Start its bar only when its timer starts, so 375 has something alive after the curtain.
   - Top-align the step labels so the four bars sit on one line.
   - At 320, let the four steps wrap two by two and let the intern button wrap.
7. **Last pills and the cut.**
   - Move the Academic perk pills under each h3 as a meta row, as the sheets already do.
   - Animate the team filter (shared layout or exit/enter) instead of remounting the deck.
8. **Correct `docs/coverage/careers.md`** to what ships, with the measured numbers above.
