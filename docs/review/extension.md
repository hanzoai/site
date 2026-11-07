# /extension — James-eye review
7 Nov, round 5, walked at 1470x801, 375x812 and 320 (isMobile, hasTouch) with Playwright Chromium: frames at 0, 1 and 3 s untouched; scrolled a screen at a time with the wheel (desktop) or by touch scroll (phone), dwelling 1.5 s; hovered, pressed or tapped all 35 controls in `main`; repeated the walk with prefers-reduced-motion; checked console, overflow and visible copy against content/live/extension.json, content/pages/extension.html and content/live/download.json.

Verdict: 7/10

First complaint: "The top half is lovely: the browser runs itself, and the black room and the pinned scene feel like a product. Then it turns back into a document. 'Get started with Extension' is a row of grey labels with nothing to look at, and straight after it the same Download button turns up again in a grey band. And what's that black outline jumping around the picture in the hero? It doesn't fit the thing it's pointing at."

## The 11 answers
1. **Sells in 5 s, moves in 1 s: yes.** The h1 is 52px, with the lede, one solid "Download Extension" and two text links. On the right is a stack of browser windows whose extension panel runs through 01–05 by itself, with a progress bar that is already moving at 1 s. The media starts grey and settles into the Hanzo image by 1 s. On phone, the h1, lede, primary and the top of the window all fit inside 660px.
2. **One in, one out: mostly, until the end.** The order is: hero, then the black "How it works" room (a 6-node chain where one node lights at a time and a caption changes), then a pinned scene where one panel changes at a time (connector hub, then page-as-text readout, then build tree, with an 01/02/03 index), then the browser list with a live figure card, then the use-case tabs. After that come two closing sections back to back: "Get started with Extension", a meta row with no object, and the closing Band. That stretch reads as a document tail.
3. **A real visual object in every section: all but one.** Hero window, chain diagram, hub SVG, mono readout, build tree with the real file names and sizes, the 956 KB / 976 KB figure with bars, and a tab demo (card plus mono steps) each give a section its object. "Get started with Extension" has none: it is a heading, two links and "Browser extension + MCP bridge · License: Apache-2.0 · hanzoai" in grey mono. It is dead.
4. **One ask, nothing floating, rhythm: yes, with one repeat.** The header ask swaps to "Download Extension" once the hero ask leaves view, and goes quiet while the Band's solid button is on screen. Nothing floats over content on desktop. Scale has rhythm: the h1 is 52, the section heads 26, the chapter heads 21, the figure about 64 (the moment), with 13–16 mono and body around them. Never everything big at once. But the primary appears in the hero, in the header, and again in the Band directly under a section that already says "Get Extension", which is one ask too many at the bottom.
5. **Every hover and press answers: mostly.**
   - The primary darkens and presses to scale 0.98 with no jump.
   - The browser rows fill `#f5f5f5` and swap the figure card to that browser's size. The hover tells you a number, which is exactly right.
   - Tabs glide their pill, and the 01–05 and 01–03 indexes go ink.
   - Dead hovers:
     - The six chain nodes in the black room are `<button>`s, but hover changes nothing on them (colour, transform and border all measured unchanged).
     - The text links "Availability", "Use Hanzo Chat" and "Download for Chrome/Firefox/Edge" measured no colour, underline or transform change on the link itself.
6. **Overlap, font swap, layout shift: no layout shift and no font swap seen.** No horizontal scroll at 1470, 375 or 320. At 320 the body measures 352 wide only because of the shared header ask (not counted). Defects:
   - **Hero probe ring misfit (desktop).** Twice during the self-running cycle, a 2px black rounded outline appears around the hero media but does not fit it: it starts about 8px left of the image and stops about 60px above its bottom edge (seen at 03/05 and 04/05). It reads as a glitch, not a highlight.
   - **Chain progress line lags.** In "How it works" the filled line stops at node 02 while node 03 (desktop walk) or node 04 (reduced-motion walk) is the lit one.
   - **Phone file names cut.** At 375 the build tree truncates the very data it exists to show: "hanzo-ai-chrome-v1.9.31.…", "hanzo-ai-firefox-v1.9.31…".
   - **Phone hero debris.** The back windows of the stack poke in from both screen edges as grey slabs. The Chrome/Firefox/Safari switch sits detached above the window instead of attached to it. When you tap Firefox, the stack swings through overlapping tilted windows for a beat.
7. **Reference feel: apple.com product page, and it is actually there.** One idea per screen, a pinned scene where one panel changes, and the product as the hero. There is also a motion.dev gliding tab pill. No synchronized.studio card-to-page open (none is needed here). The chatgpt-enterprise "calm proof" is only partly there: the build sizes act as proof, but the closing stretch goes flat instead of calm.
8. **Different from neighbours: yes, as far as walked.** The hero medium (a self-running browser stack whose extension panel narrates Hanzo's own five claims), the black-room chain and the size figure belong to this page. This walk did not cover /download or /desktop to compare side by side.
9. **The 18 parts: mostly covered.** Covered: one h1, one solid fill per viewport, the sticky ask, a pause control on the self-running hero, 44px targets on phone, reduced motion with no running animations, APG tabs, a Band, and no console errors from this page. Gaps:
   - **Part 4:** four differently labelled links ("Download for Chrome", "Download for Firefox", "Download for Edge", "All Extension Builds") plus both "Download Extension" buttons all share one href, `github.com/hanzoai/extension/releases/latest`. "Adjacent buttons never share an href with different labels."
   - **Part 3:** the end is "one proof strip, one Band, then the footer". Here a link row with no object comes before the Band instead.
   - **Desktop index tabs:** the hero 01–05 tabs are 43px wide.
10. **Banned tells: none found.** No hue (greys, ink and Hanzo's own monochrome media only). No gradient text and no Inter (the stack is Zen; it opens with Noto Kufi Arabic for Arabic glyphs only). No eyebrow above a headline: "BROWSER EXTENSION" and "WHAT YOU WOULD USE IT FOR" sit below their headings as captions, which is allowed. No three equal boxes and no cursor glow.
11. **Copy untouched: yes.** Every visible string traces verbatim to extension.json, extension.html or download.json, including the chain labels, which are fragments of Hanzo's own sentences. The exceptions are the screen-reader "Chapter N: …" and "…: jump to" labels (shared, allowed) and the mock address bar text "hanzo.ai/extension", which is the page's own URL and acceptable as UI chrome. Reduced motion: hero, chain, pinned scene, figure and tabs all show a legible end state and `getAnimations()` is empty. Console: no hydration diff from this page. A parse error in `components/pages/cloud/Guard.jsx` showed on one load; that is another chat's file on the shared server and is not counted.

## Fixes, in order
1. **Kill the dead tail.** Merge "Get started with Extension" into the closing Band so the page ends with exactly one object-less band.
   - Keep every word: "Read the docs", "Deploy to Cloud", "Browser extension + MCP bridge", "License: Apache-2.0" and "hanzoai" become the Band's quiet caption row under its solid ask, in 12px mono.
   - Or give that section a real object instead: the build tree's three file names and sizes as a proof strip linking to the release.
   - Either way, the Download button must not appear twice within one screen of "Get Extension".
2. **Fix the hero probe ring.** Measure the target's box on each step (getBoundingClientRect relative to the window) and animate the outline to it, inset 4px with concentric radius. Hide it while the media's own transition runs. It must never overhang or stop short of the element it names.
3. **Tie the chain's progress line to the active node.** The fill should end exactly at the lit dot, at both desktop and phone (vertical) orientations and under reduced motion.
4. **Make the six chain nodes answer hover and focus.** On hover, preview that node's caption and move the lit dot there (ease-out 150 ms). If they are not meant to be pressed, make them non-buttons.
5. **Phone build tree: never truncate a file name.** Wrap to two lines in 13px mono, or drop the size to its own line under the name. The name is the object.
6. **Phone hero cleanup.**
   - Clip the back windows inside the gutter so no grey slab bleeds off the screen edges.
   - Attach the Chrome/Firefox/Safari switch and the pause control to the window: below it on phone, as on desktop.
   - Make the browser swap a clean crossfade or slide with no overlapping tilted frames mid-tap.
7. **Download hrefs (Part 4).** Either point each browser link at its own build asset from download.json (the chrome, firefox and safari zips), or, where only one URL exists, keep one link and list the browsers as text. Four labels must not lead to one URL.
8. **Text-link hovers.** "Availability", "Use Hanzo Chat" and the four row links need a visible non-opacity hover: the underline thickens or the arrow moves 3px at 150 ms, fine pointers only.
9. **Hero index tabs (01–05).** Make them 44px wide on desktop too.
