# /oss/* (template) — James-eye review

Verdict: 6/10
First complaint: "Why am I reading the same numbers three times? 461, 1,602, 154 in the black box, then the same three in a grey box, then 568,900 again. And Hanzo Apps is just giant zeros. That's a spreadsheet, not premium."

Walked 7 Nov, 14:20 to 15:05. Template `components/pages/oss/OrgPage.jsx` and `oss.css`, judged on `74e626f` (v4) with the Families kit at `fe077aa`. v3 (`483255a`) was walked first and changed while I was walking it. Members: /oss/hanzoai and /oss/hanzo-app, both filmed moving:
- 1470×801 with the wheel, and 375×812 with finger drags;
- idle frames over the first 6.5 s;
- every kind of control hovered and pressed, a tile opened and closed, a sibling card clicked;
- a sideways swipe on the phone, reduced motion, and JS off.

An uncommitted v5 edit was in progress as this was written: h1 to 52px, the lead figure grows on arrival, no springs. None of it touches the complaints below.

Stills: `img/oss-family-repeat.jpg`, `img/oss-family-zeros.jpg`, `img/families-first-screens.jpg`.

## What works
- **The ledger is a real hero object made of Hanzo's own figures.** 568,900 commits in Air, the year as bars with a playhead reading them, and the organization's contour drifting behind. On /oss/hanzo-app (no commits this year) its repository names tick past instead. Either way, the first screen moves within 1 s on both members, and the lead's digits rise into place.
- **The signature is real (synchronized.studio).** Press a tile and it grows into a 960px card:
  - stars, forks, this year's commits and the bars;
  - `git clone` for GitHub or Hanzo Forge, with copy.

  Focus goes to Close, and Escape hands focus back to the tile.
- **The catalogue controls work.** Language chips, a sort pill that glides, and search. Tiles lift on hover, and their own playhead runs.
- **One ask in Hanzo's words: "hanzoai on GitHub".** It is magnetic in the hero, and the ask bar carries it after the hero at both widths. The header ask stays outlined while the hero ask is on screen.
- **Clean on the checks:**
  - 0 UI hues, in both the CSS and a pixel scan. The only hue on screen is the shared footer's blue "Privacy choices" toggle.
  - No eyebrow over any heading.
  - Parity: hanzoai text 208/208, links 123/123; hanzo-app 37/37 and 25/25.
  - CLS 0 on all four walks.
  - Reduced motion: 0 running animations. JS off: 0 hidden text.
  - Phone swipe: hanzoai to hanzobot, hanzo-app to hanzo-apps.
  - No sideways scroll at 375. Every phone tap target is 44px or more.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes at both sizes. The name, its line, one ask and the whole ledger share the first screen, and the playhead (or ticker) and contour move without input.

   Shared caveat: on a fresh deep link, the site's arrival curtain covers the first ~3 s (black, counter running). CANON limits it to the home page and 700 ms.
2. **One in, one out, or a document?** Half and half. The two counted chapters pin and swap. After that it is a document:
   - 11 grey tiles in four even rows, which is five phone screens of tall cards;
   - a ~300px dead white band under the hero;
   - a blank band above the sibling cards, whose section has no heading.
3. **A real visual object in every section?** The hero, the tiles (their bars) and the siblings (their contours) have one. The two chapters are boxes of numbers the hero already shows: 461, 1,602 and 154, then 568,900 again.

   On hanzo-app, the second chapter is four big figures, three of them 0 ("0 commits", "0 merges", "0 of those commits"). The close repeats the h1 and the lede word for word.
4. **One ask, sticky after the hero?** Yes, "hanzoai on GitHub" at every width. Two problems:
   - The sibling rail puts four solid black arrow discs in one viewport.
   - In the scroll step right after the hero, the header ask turns solid while the hero ask is still on screen, so there are two solids (shared Ask behaviour).
5. **Does every hover and press answer, with no jumps?** On desktop, yes for the asks, links, tiles, chips, sort, sibling cards and "Show all". The tiles' Forge chip and GitHub icon have no press state.
6. **Overlaps, font swap, layout shift?** None found. CLS was 0, and the h1 box stays still once the curtain is gone.

   One glitch inside the signature: while the tile grows into its card, the GitHub/Hanzo Forge pill slides in from the far right of the clone box.
7. **Which reference does it feel like, and is its motion there?** Apple (pinned chapters, the product as the hero) and synchronized.studio.
   - The tile-to-card open really is synchronized.studio.
   - The sibling card to the next organization is not. Clicking "hanzobot" shows a blank white frame, then the next page's name rises. No title flies into the next h1 (dev server).
8. **Different from its neighbours?** The medium is (a data ledger). The layout is not:
   - title on the left, a black rounded card on the right;
   - then chapters with words on the left and a card on the right;
   - a sibling rail with black discs;
   - a dark close.

   /products/* and /solutions/* now open with the same composition (`img/families-first-screens.jpg`).
9. **Every one of the 18 areas covered?** See below. `docs/coverage/oss.md` exists and is mostly accurate.
10. **Any banned tells?** None in the template. The shared header has one native `title="Talk to Hanzo"` tooltip.
11. **Copy untouched?** Yes; parity is clean. The close repeating the h1 and lede is still Hanzo's words, but it reads as filler.

## Missing from the 18 areas
- **2.3 Narrative:** the chapters restate the hero, and the close restates the hero. There are dead bands under the hero and above the siblings.
- **2.5 and 2.6 Proof and presentation:** zeros are set as hero figures. The master brief puts "small counts and zeros" in the row-figure size, not at 72–104px.
- **2.15 Catalogue:**
  - On the phone the catalogue is tall cards, not 72px list rows.
  - /oss/hanzo-app's first sibling card is also called "Hanzo Apps" (90 repositories, against this page's 11), with no id to tell them apart.
  - The card-to-page morph is not visible.
- **2.4 Conversion:** four filled arrow discs in the rail, and the header turns solid while the hero ask is still on screen.
- **2.8 Components:** no press state on the Forge chip and GitHub icon. The clone-source pill flies in during the open.
- **2.7 Type (kit):** section headings now rest at 26px ("Counted from GitHub", "Counted on Hanzo Forge"). The master brief calls that size the reason "sections feel like footnotes" and asks for 36–64px. The in-progress v5 takes the h1 to 52px, against JAMES.md 1 (72px and up).
- **JAMES.md 10 Sound:** no sound on the card opening or on copy. The shared sound kit is not built yet.

## Fixes (in order)
1. **Say each figure once.**
   - The hero carries the lead and its year. Repositories, stars and forks appear either in the hero's small row or in chapter 1, not both.
   - Chapter 2 shows only the forge's own figures (merges, repositories, commits by people and agents), never 568,900 again.
2. **No giant zeros.**
   - A figure that is 0 drops to the small row (Air, 28–40px) or leaves the chapter.
   - A chapter where everything but one figure is 0 shrinks to that one figure. On hanzo-app, the forge chapter becomes "11 repositories" alone, or is skipped.
3. **Make the close its own moment.** Do not repeat the h1 and the lede. Use the organization's contour full-bleed with the one ask, or the lead figure huge beside the ask.
4. **Fix the catalogue's rhythm and the dead space.**
   - Phone: 72px list rows (name, language, stars) that open the same card.
   - Desktop: break the four even rows of grey boxes.
   - Close the band under the hero and the blank space above the siblings (pull the rail up under the "Every organization" link line).
5. **Fix the siblings.**
   - Put the organization's id under a same-name title (for example "hanzo-apps").
   - Swap the four filled discs for an unfilled ink arrow, so the ask stays the only solid.
   - Make the clicked card's title fly into the next h1 (at the very least, no blank frame).
6. **Polish.**
   - Add a press state to the Forge chip and the GitHub icon.
   - Mount the clone-source pill without a layout animation when the card opens.
   - Keep JAMES.md sizes: h1 72px or more on desktop, section headings 36–64px. Do not ship the 52px h1.
