# /extension — James-eye review
7 Nov, round 4. Walked in Playwright Chromium at 1470x801, at 375x812 and at 320 (isMobile, hasTouch), and with prefers-reduced-motion at 1470 and 375. At each size I took frames at 0, 1 and 3 s with no input, scrolled one screen at a time with the wheel (a touch scroll on phone) and dwelt 1.5 s on each screen. I hovered and pressed every main control on desktop, tapped them on phone, ran one fast-scroll pass, and dismissed the cookie card with Reject all.

Verdict: 7/10

First complaint: "On my phone the one moving thing in the hero is a thin black strip with its frame chopped off at the bottom, and I've read 'Hanzo Extension' four times before I've scrolled. Then right at the end there's a grey box with four buttons in it that just sits there. Most of it is alive, but that box looks like a template."

## The 11 answers
1. **Sells in 5 s; moves within 1 s?** Yes on desktop. The h1, the lede, one solid "Download Extension" and a browser-window object all fit the first screen. The window runs its own 01 to 05 slideshow: a progress bar fills, the slide copy changes, the Hanzo film plays in the page pane, and a pause control and Chrome/Firefox/Safari switcher sit under it. All of it is moving by 1 s. On phone the h1, lede and ask fit, but the film inside the window is cropped to a strip about 46px tall. Its outlined frame is cut off with no bottom edge, so the hero's only real visual reads as a mistake. The browser switcher falls below the fold at 375.
2. **One in, one out, or a document?** Mostly one in, one out on desktop. "How it works" is a black room with a node rail that lights 01 to 06 as you go and swaps a single caption line. "The rest of your tools / Read a page as text / Installs from a file" is a pinned stage: one panel changes, with a 01/02/03 pager. The browser section ties a big figure to the row you point at. The use-cases are tabs. Two weak spots:
   - On a fast scroll the "Read a page as text" panel arrives as a big empty graphite slab with only "PAGE CONTENT" in it, and the outgoing white card peeks out above it. The room tone also shifts from white to #fafafa to #f5f5f5 inside the one pinned stage.
   - The last two screens drop back to a document: a static "Get started" card, then the Band.
   On phone the stages stack, as the rules require.
3. **A real visual in every section?** Yes, except one:
   - hero: the browser window and film
   - How it works: the node rail
   - tools: the hub diagram (an SVG)
   - read as text: a typed panel
   - installs: a repo-to-zip tree using the real build file names
   - browsers: the 976/956/310 KB figure with bars
   - use-cases: a staged mock for each tab
   The exception is the "Get started with Extension" card. Its only visual is the Hanzo mark in a rounded black square, which is an icon in a box. The film is the page's only Hanzo media and it is reused in the use-case mock, so a 4-up block does not apply.
4. **One ask in the sticky header; nothing floating; scale has rhythm?**
   - **Desktop:** the header swaps "Try Hanzo" for a solid "Download Extension" once the hero ask leaves view, and goes quiet again while the Band's solid ask is on screen. That is right, and nothing floats over content.
   - **Phone (375 and 320):** the header keeps "Try Hanzo" for the whole page and never carries the page's ask. That is shared header chrome, so I note it and don't count it.
   - **Scale:** the rhythm is mostly good. The h1 is 52px, section heads 26px, and the browser figure (64px) is the one big thing on its screen.
   - **Too many asks:** the page carries too many of them. The hero has 3 (a solid button and two text links). "Download for Chrome" is an outlined button while Firefox and Edge are text links. The "Get started" card has 4 more ("Read the docs", "hanzoai", "Deploy to Cloud" as a white outlined pill, plus its own "Get Extension" heading). The Band has 2. That makes 3 button styles in the lower half.
5. **Every hover and press answers, no jumps?**
   - **Mostly yes.** The solid ask darkens and presses to 0.98. The tabs and pause press to 0.97. The text links press translateY(1px). Hovering a browser row fills it and changes the big figure to that build's size or version, which is the best hover on the page because it tells you a number. The 01 to 06 nodes press to 0.98. No layout jumps were measured.
   - **Text links:** "Availability" and "Use Hanzo Chat" showed no colour, background or transform change on hover in the computed styles. If they answer, they do it with something subtle I couldn't measure.
   - **Hero switcher:** choosing Firefox moves the pill, but the dot stays on "Chrome", so the control half-contradicts itself.
6. **Overlaps, font swap or layout shift?**
   - **No page overlap** at 1470 or 375, and no font swap: Zen and Zen Mono load, with no Inter.
   - **No horizontal page scroll** at 375 or 320 (scrollWidth equals clientWidth). The side windows of the hero stack bleed past the edge but are clipped, which is intended.
   - **At 320** the header's "Try Hanzo" is clipped at the right edge. That is shared chrome; noted, not counted.
   - **At 375** the build file names break mid-string ("hanzo-ai-chrome-" / "v1.9.31.zip").
   - **No hydration diff from this page.** The console was clean on every normal load. The only error was a Turbopack build error in `components/pages/cloud/Functions.jsx` ("the name `MOVES` is defined multiple times"). That is another page on the shared dev server, so I note it and don't count it.
   - **Reduced motion** at 1470 and 375 shows the final states: `getAnimations()` is empty, the rail, hub, tree and figure are all at rest, and nothing is left hidden except slides that are off-screen.
7. **Which reference, and is its motion there?** It feels like an apple.com product page: one idea per screen, a pinned stage where one panel changes, the product (a browser window) as the hero, and the persistent ask in the header on desktop. The motion is genuinely there: an idle self-running slideshow, pointer previews in the browser rows, typed text, state-changing tabs and a scroll-driven rail. That is more than half non-scroll motion. There is no osply/hamol-style asymmetry or pointer-aware detail beyond the row hover, and no card-to-page Morph. Nothing on the page is a card that opens a page, so the Morph does not apply.
8. **Different from its neighbours?** The browser-window hero with a running slideshow is its own medium, and the repo-to-zip tree and size figure are specific to this page. One risk: /download uses the same build file names and sizes, so the file-tree and figure moments should not repeat there. I did not walk /download this round.
9. **All 18 parts covered?** From the walk, without reading the card:
   - **Covered:** one h1, one primary, the header and footer kept, a closing Band, a pause control on the self-running hero, reduced motion, no overflow at 320, monochrome tokens, tabs and the hairline-divided rows.
   - **Weak:**
     - Part 3, "end on one proof strip, one Band": the proof (Apache-2.0, hanzoai) is buried in a static CTA card rather than sitting in a quiet strip.
     - Part 4: the primary appears at most 3 times, which passes, but the secondaries multiply.
     - Part 6: "Browser extension", Hanzo's own label from the live hero, does not appear as a visible caption anywhere. The rule is to keep the words and move them below the heading, not to drop them.
     - Part 11: the hero object is cropped to a sliver on phone instead of being cropped at true size.
10. **Banned tells?**
    - None of the hard ones:
      - no hue (the only gradients are ink-to-ink and a white fade)
      - no gradient text
      - no badge or pill above a headline ("WHAT YOU WOULD USE IT FOR" sits correctly below its h2)
      - no Inter
      - no fading buttons
      - nothing floating
    - **Borderline:** the Hanzo mark in a rounded black tile on the "Get started" card (an icon in a box). The h1's words are also repeated 4 times on the first screen (h1, browser tab, card title, slide header), which reads as filler.
11. **Copy untouched?** Yes, as far as I can trace. Every visible sentence and label I read is in `content/live/extension.json`, or comes from the build names and sizes in `content/live/download.json`, or is "Pause" from `ui-strings.json`. The node labels, hub words and typed lines are fragments of Hanzo's own sentences. "hanzo.ai/extension" in the fake address bar is the page's own route. The one gap is the dropped "Browser extension" label (see 9). Nothing is invented.

## Fixes, in order
1. **Phone hero film:** stop squashing the film into a 46px strip with a cut outline. Under 600px, give the page pane a fixed aspect ratio (true-size crop, at least 160px tall) and close the outlined frame. If it won't fit, drop the right-hand slide copy below the window instead of shrinking the film. Move the Chrome/Firefox/Safari switcher up so it is visible at 375x812.
2. **"Get started" card:** replace it with one quiet proof strip: "Browser extension + MCP bridge · License: Apache-2.0 · hanzoai", in a hairline row with no box and no icon tile. Keep "Read the docs" as the one text link. Move "Deploy to Cloud" into that strip as a text link, not a third button style. The Band stays as the single closing ask.
3. **First-screen repetition:** cut the h1 words to at most one echo on the first screen. Inside the mock, let the page pane carry the film and the card title, and drop the repeated "Hanzo Extension / Your browser, as a tool…" pair under the film (or show it only on slide 01).
4. **Pinned stage:** fix the fast-scroll arrival. The incoming "Read a page as text" panel must already hold its three rows (PAGE CONTENT, CONSOLE MESSAGES, NETWORK REQUESTS) and type into them; never show an empty graphite slab. Hold one room tone for the whole pinned stage instead of shifting white, #fafafa, #f5f5f5. Remove the stray hairline that floats above the hub diagram as the stage enters.
5. **Hero switcher dot:** make the dot follow the selected browser, or remove it.
6. **Browser rows:** use one ask style. Make all four row asks the same text link with an arrow, and show the size in every row that has one (Chrome 976 KB, Firefox 956 KB; Safari's 310 KB under "Safari & Others"), not only the hovered or active row.
7. **Hero text links:** give "Availability" and "Use Hanzo Chat" a hover that changes something, such as the arrow nudging 3px or the underline drawing in. Use ease-out at 150 ms, not opacity.
8. **Missing label:** restore "Browser extension" as a 12px Zen Mono caption below the hero lede (not above the h1).
9. **Phone file names:** keep them on one line. Let the file name truncate with an ellipsis and a full accessible name, or shrink the size column, so it never breaks mid-name.
10. **Heading levels:** the five slide titles inside the hero mock are h2 at 17px ahead of "How it works" (h2 at 26px), and "The rest of your tools, too" is an h3 at 26px. Make the slide titles h3 (or non-headings) so the outline matches the visual scale.
11. **For the shared owners, not this page:** the phone header keeps "Try Hanzo" instead of the page's ask, and "Try Hanzo" clips at 320. Both are in the shared header (request only).
