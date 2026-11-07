# /extension — James-eye review
7 Nov. Walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0 s, 1 s and 3 s untouched, then a wheel or scroll of one screen at a time with a 1.5 s dwell, hover and press on every main control on desktop, taps on phone, plus a 320 px check, a reduced-motion pass and the console. Compared against the /desktop and /cli heroes.

Verdict: 6/10

First complaint: "The top's lovely, the browser changes when I pick Safari, fine. Then you scroll past the connectors and it goes dead: a list of download buttons, a box of text behind tabs, an empty half-screen next to 'Get started'. And there's a red Issue badge sitting on the page. That's not premium, that's unfinished."

## The 11 answers
1. **First screen and movement.** Yes, mostly. The h1, lede and Download Extension sell it, and the fanned browser windows cycle 01/05 on their own within 1 s. But at 0 s the right-hand panel's text ("It uses your session…") floats alone on white before its browser window and the h1 arrive. On phone the h1 and window are both missing at 0 s, leaving the lede and ask with about 450 px of white.
2. **One in, one out, or a document?** The first half works: the hero, then the black How it works room with a travelling packet, then a pinned stage (01/02/03) where one panel changes (connectors, then read as text, then installs from a file). After that it turns into a document: the browser list, the use-case tabs, Get started, then the Band. These are flat rows of text with no moment.
3. **A real object in every section?** No. The hero, How it works, connectors, read-as-text and build all have one. "Built for every major browser" is four text rows and buttons. The use-case tabs are text only, and the right half of the panel is empty. The left half of "Get started with Extension" is about 600x300 px of nothing. In the How it works room, roughly the lower 300 px of black is empty.
4. **One ask, nothing floating, scale rhythm.** Mixed. On desktop the header swaps to a solid Download Extension once the hero ask leaves: good. On phone the header keeps "Try Hanzo" while a bottom bar says "Download Extension": two different asks at once. The scale rhythm is fair (52/32/26/21) and nothing is in your face. The use-case tab label is repeated as a 26 px h3 straight underneath, the same words twice.
5. **Does every hover and press answer?** No. The hero ask darkens and presses at 0.98, and the browser tabs, use-case tabs and Download for X buttons answer. Connector chips (tickets, mail, etc.) do nothing on hover or tap. The How it works steps (Unix socket, etc.) do nothing on hover or tap. "Deploy to Cloud" has no hover state. "See the spec" opens a nice sheet but has no hover state of its own.
6. **Overlap, font swap or layout shift?** Yes:
   - A Next.js "1 Issue" badge (a hydration-mismatch console error) at both sizes.
   - At 320 px the header "Try Hanzo" is cut off the right edge, and the fanned back windows show clipped text ("Har", "Hanz").
   - On phone the use-case tab labels truncate ("Check the change you j…", "Behind a lo"), which cuts Hanzo's copy.
   - On phone, "The rest of your tools, too" sits flush against the bottom of the black room with no top padding.
   - In the hero, the selected-film outline ring is clipped on its right side by the panel edge.
7. **Which reference, and is its motion there?** The top half reads as apple.com: a pinned stage where one panel changes, plus a product-as-hero browser. That motion is genuinely there. The bottom half reads as nothing in particular.
8. **Different from its neighbours?** Yes. /desktop is a centred app window and /cli is a black terminal room. This page has a left headline and a fanned stack of browser windows that switches with the browser tabs. Distinct.
9. **All 18 parts?** Not verified from source (out of scope). As rendered: a skip-free walk shows the Band, footer, spec sheet, pause control and reduced-motion final state working. A console error, two 21 px tap targets on phone ("Every build", "Read the docs") and the 320 header clip fail parts 3, 11 and 17.
10. **Banned tells?** Three:
    - Three equal boxes in a row: the chrome/firefox/safari zip tiles in the build panel.
    - The use-case tab markers are small grey squares that read as browser-default checkboxes.
    - The page goes dead below the fold. No hue, gradient text or eyebrow above an h1/h2. Captions such as CONNECTORS and "WHAT YOU WOULD USE IT FOR" sit below their heading, which is correct.
11. **Copy untouched?** Apparently yes, except where CSS truncation on phone visibly cuts the tab labels.

## Fixes, in order
1. **Kill the "1 Issue" badge.** Find the hydration mismatch: the server/client branch is probably the "Chrome ●" detected-browser dot or the "YOU ARE ON CHROME" line. Render a neutral state on the server and set the detected browser in an effect after mount. Re-check with 0 console errors at both sizes.
2. **Use-case tabs ("Mostly the work…") need a real object.** Inside the 1152x320 panel, put a small browser render on the right (about 420 px wide) that changes per tab: a rendered page with its console for "Check the change", a login-walled dashboard for "Behind a login", a request/console log list for "Debug the request", a form filling itself field by field for "The long boring form". Delete the 26 px h3 that repeats the tab label, or demote it to the lede only. Replace the grey-square tab markers with the 01–04 Zen Mono numerals already in the panel.
3. **On phone, stop truncating the tab labels.** Stack the four tabs as 48 px full-width rows (an accordion), or use a scroll-snap rail with a 16% peek and full labels. No ellipsis on Hanzo's words.
4. **"Built for every major browser" is a dead list.** Give it one object: tie the rows to the hero's browser stack, so hovering or focusing a row (Chrome/Firefox/Edge/Safari) swaps a small browser-chrome render on the left under the paragraph (about 360 px, filling the empty left column below "bring Hanzo agents into your everyday browsing"). Show the existing build size from the spec sheet (Chrome 976 KB, etc.) on hover as the detail.
5. **Make connector chips and How it works steps answer.** On hover, focus or tap of a connector chip, draw its spoke in ink and pulse the packet along it (300 ms ease-out). On a How it works step, hover, focus or tap moves the packet to that step and shows the existing transport line under it (for example the "over a Unix socket" sentence from the spec copy). Give these chips and steps a pressed scale of 0.98.
6. **Fill or cut the dead space.**
   - How it works: reduce the black room's bottom padding so the step row sits about 72 px from the bottom (it is about 300 px now).
   - Get started: move the "Get Extension" card left into the 8/5 split, or align the heading to the card's top so the left column isn't 300 px of white.
   - Use cases: drop the roughly 200 px of white above the heading.
7. **Fix the hero arrival order.** At 0 s the panel text must not appear before its browser window. Bring the window and its contents in as one piece, with the h1 line-mask first (0–700 ms) and the window at 200–400 ms. On phone, make sure the h1 is there at 0 s in the server HTML (the cut-in may start, but the box must not be blank for a second).
8. **Hero film selection ring:** the outline around the black film is clipped on its right side at about x=1000. Inset it (outline-offset negative, or padding on the frame) so it draws fully.
9. **Phone ask:** the header must say Download Extension (as desktop does once the hero ask leaves), not "Try Hanzo" while the bottom bar says Download Extension. One ask. The bottom bar is also outlined, so make it the solid fill once the hero ask is gone.
10. **320 px:** the header "Try Hanzo" is cut off the right edge. Request the shared-chrome fix (shrink the ask, or hide the EN switch under 360 px). Clip the back windows of the hero stack so no cropped "Har"/"Hanz" text shows: fade them or keep only their chrome at 320–375.
11. **Phone spacing:** add section top padding (at least 72 px) above "The rest of your tools, too" where it meets the black room.
12. **Build panel:** the three equal zip tiles are the banned three-in-a-row. Render them as a stacked file list (three 44 px hairline rows with filename and size), or as a fan off the repo node with differing offsets.
13. **Tap targets:** "Every build" and "Read the docs →" are 21 px tall on phone. Pad them to 44 px. Give "Deploy to Cloud" and "See the spec" a hover fill (background to #f5f5f5, 150 ms ease-out).
