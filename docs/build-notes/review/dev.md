# /dev — James-eye review
Ready: 2026-11-08 copycheck missing 0 of 103 (COPY-RULE): every Hanzo line as its own text, arrows in the labels as Hanzo prints them, Latest release read from GitHub as hanzo.ai does (v0.7.10 fallback), Homebrew line plain; sections in Hanzo's order (race, places, install and sign-in, then models/Kai/proof/sandbox/Gen) so a visitor installs before the deep dive; Get Hanzo Dev $8/month close kept. taste, unique, check.mjs 1470/375 clean.
Verdict: 7/10
First complaint: "On the phone there are two black buttons fighting at the top, the cookie box sits on the demo, and there's a red '1 Issue' thing in the corner of every screen. And with motion turned down the race just says 0.00 against 0.00. It doesn't look finished."

Walk (7 Nov, dev server :4180): Playwright at 1470x801 and 375x812, deviceScaleFactor 1. I took frames every 250 ms for 9 s with no input, then a slow wheel scroll (120 px every 180 ms) with the race board held in view for 10 s at each size. I probed hover and press on 10 controls and ran 20 fresh loads at 10 s each (plain and reduced motion, both sizes). I also checked JS off, overflow at 320, CLS, and copy parity (`parity.py /dev`: text 176/176, links 12/12). The dev server did a Fast Refresh rebuild during one probe, so the page was being edited while I walked it. These results are for the build that was live at that moment.

## The 11 answers

**1. Sells in 5 s, moves within 1 s?** Yes on desktop. The h1 "Describe the change. Dev ships it." cuts in by about 0.5 s. The terminal types `curl -fsSL https://hanzo.sh | sh`, then `dev`, then the prompt, and the diff lands in `src/retry.ts` (red `-` line struck through, `+` line highlighted, `+1 -1 M`) at about 5 s. It settles with a replay icon at about 7 s. That is the "terminal with a diff landing" the brief asks for. Two flaws. The server render paints the finished diff first, and at about 0.3 s it wipes to an empty `$ curl -fsSL█`, so the first frame flashes the end state and then throws it away. On 375 the diff pane is stacked below the log, under the fold, and the cookie card covers the terminal from 470 px down. A phone visitor never sees the diff land.

**2. One in, one out, or a document?** The top half is a story: the hero demo, then the black race room, which enters as a rounded card and opens wide, then the places rail, then the "how" stack, where each chapter card slides over the last. After the stack it turns into a document. Install, open source, FAQ and the paste block arrive as quiet blocks with large empty gaps and nothing that changes as you pass. At 375 the page is 13,394 px tall and the "how" section alone is 3,621 px.

**3. Real visual object in every section?** Mostly yes: the terminal and diff, the race board, the terminal, web and cloud cards, the Gen fan-out diagram, the dashed sandbox "fence" with its `hanzo dev --ask` terminal, the install code blocks, the repo card. The weak one is "Built to be checked.": a heading next to three rows with tick icons in circles, and no object. The FAQ and the paste row are text only (acceptable for those parts).

**4. One ask in the header, nothing floating, scale rhythm?** Desktop is close. One solid "Open Dev" in the hero, and the header ask starts as quiet "Try Hanzo" and becomes a solid "Open Dev" once the hero ask leaves. But at t=0 the header "Try Hanzo" is also solid black for about 250 ms, which gives two fills on the first paint. On 375 the header "Try Hanzo" stays solid black next to the solid "Open Dev", so the first screen has two fills (proof 3). The header on phone never takes the page's label. The cookie card (shared chrome) floats over the hero terminal and the race board at both sizes and hides the "Replay race" control at 1470. Scale has rhythm: the h1 is 52 px and the race figure "3.02×" is the one big thing at about 112 px, with medium 26 px heads and small Mono labels. The closing Band breaks it: its h2 is bigger than the h1 and wraps "Describe the change. Dev / ships it." with a two-word last line.

**5. Every hover and press answers, no jumps?** Press is fine everywhere: scale .98 or .97, or translateY(1px) on links. Hover is weak:
- "Read the docs" and "Explore GitHub examples" do not change on hover (underline before and after, same colour).
- The places cards change nothing on hover.
- The header ask (shared chrome) only drops opacity to 0.88, which is a "button that fades on hover" (banned).
- The hero "Open Dev" goes to rgb(44,44,46) and the tabs rest at rgb(110,110,115). The Copy button text is rgb(210,210,215). These are Apple greys (#2c2c2e, #6e6e73, #d2d2d7) and are not on the deck ramp.
- The Copy button is 74x32, under the 44 px floor.
- The FAQ row moves up 2 px on hover.

Copy works ("Copied", with an aria-label update), and the install tabs switch.

**6. Overlaps, font swap, layout shift?** CLS is 0.0005 at 1470 and 0.0006 at 375. No horizontal overflow at 1470, 375 or 320 (scrollWidth equals clientWidth). The rail runs past the gutter by design, but after "Next place" the left card is cut mid-word at the viewport edge ("nds"). In the "how" stack the outgoing card's heading is sliced in half at the seam while the next card slides up ("Kai decides. Dev does" cut through its letters at y≈280), which looks like a rendering fault rather than a reveal. On 375 the hero code wraps mid-expression (`retry(fn, tries =` / `3) {`). There is no visible font swap, and the h1 box holds. The red "1 Issue" dev badge was present on 20 of 20 fresh loads. In both walk sessions (1470 and 375) one console error was logged, a React hydration mismatch in the shared footer: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up… `<FooterHTML>` `<div data-x-shell="footer" style={{display:"contents"}} dangerouslySetInnerHTML={{ + __html: "<footer class=\"is_View _paddingInline-_platformweb_page-gutter _fd-column ..." - __html: "<footer class=\"is_View …"}}>`". The 20 dedicated counting loads (5 plain and 5 reduced motion at each size) logged 0 console errors even though the badge was present each time. The badge and the footer mismatch are shared chrome.

**7. Which reference, and is its motion there?** The race board is anthropic.com's launch idea: a benchmark as the hero figure, with Hanzo in ink and the rest in grey. It is the best thing on the page, and its clocks really run in real time (Claude Code 0.83 → 9.52 s, Hanzo Dev 0.83 → 2.29 s then DONE, chips filling, model-call dots; at 375: 0.45 → 9.38 s, then 9.52 s on the next tick). The "how" card stack is an apple.com pinned scene. Neither synchronized.studio (a card opening into its page) nor the osply or hamol pointer details are present. Nothing responds to the pointer except basic hover fills. Motion mix: idle (terminal and race), time (typing), state (tabs, rail) and scroll (stack). There is no pointer motion at all.

**8. Different from its neighbours?** The hero medium is a terminal, and /api and /agents are also briefed as terminals, so the hero alone does not tell /dev apart. The split terminal-plus-diff pane and the live race give it its own signature. I did not walk the neighbours in this pass.

**9. All 18 parts covered?** What is visible:
- One h1, a lede, a primary and two text secondaries.
- A sticky ask that swaps in on desktop only.
- A proof strip with a method line ("3.02× faster over the 42 tasks both solved, 95% interval 2.06–4.36×", "Every coding task and both runs →").
- FAQ, closing Band and footer.
- A sound toggle in the header.
- A pause control on the terminal and on the race.
- APG tabs and copy buttons.
- An (i) disclosure that explains the demo.
- JS-off legibility (the hero shows its final frame; 5 paragraphs are hidden, all panel or step text).

Gaps:
- Reduced motion does not show the final state. The race reads "READY 0.00 s" against "READY 0.00 s" after 6 s in view at both sizes (proof 2), and `getAnimations()` is empty, so nothing will ever fill it.
- The phone header ask does not carry the page's label.
- The Copy button target is under 44 px.
- Off-palette greys on hover and the tabs.

**10. Banned tells?** These ones:
- Two solid fills in one viewport (375 first screen; 1470 at t=0).
- A fade-on-hover header button (shared).
- The Band headline reveals with opacity and blur (shared Band). The frame at s080 shows "Describe the change" half blurred.
- The cookie card floating over the page's own demo and controls (shared).
- Icons in circles on the proof list are borderline.

None of these appear: hue, gradient text, Inter (the h1 stack resolves to Zen; "Noto Kufi Arabic" leads the stack only for Arabic glyphs), or a pill above a headline.

**11. Copy untouched?** Yes, `parity.py /dev` reports text 176/176 and links 12/12. One question for James, not a design change: the race clocks end at 9.52 s against 2.29 s (about 4.2×) under a headline of "3.02×". A visitor does the division and sees a mismatch. The method line explains it is a different aggregate, but it sits a screen lower.

## Fixes (ordered by impact)

1. **Reduced motion: show the finished race.** With `prefers-reduced-motion: reduce`, both race cards must render "DONE", 9.52 s and 2.29 s, with all chips and dots filled, on first paint. Test: the race text at 1470 and 375 contains "9.52 s" and "2.29 s" and does not contain "0.00 s".
2. **One solid fill on the phone.** At 375x812 the header "Try Hanzo" must be quiet (outlined) while the hero "Open Dev" is in view, and the header should carry the page's "Open Dev" label after the hero ask leaves, as desktop does. Test: exactly 1 element with background rgb(10,10,10) in the first viewport at 375, and at 1470 in the frame at t=0.
3. **Clear the red badge and the footer hydration mismatch (shared chrome: footer owner).** The server HTML and the client `__html` of `FooterHTML` must be identical. Test: 0 console errors and no "Issue" badge across 5 fresh loads at each size, with a 10 s wait.
4. **No end-state flash at hero start.** Either server-render the demo's empty first frame, or start the replay from the finished frame without wiping it. Test: no frame between 0 and 500 ms shows the `+` diff line and then loses it.
5. **Let the phone see the diff land.** At 375, put the diff pane (or a 3-line excerpt of it) inside the first 812 px with the cookie card open, or lift the cookie card off the hero object. At 375, set code to `white-space: pre` with a horizontal scroll region instead of wrapping mid-expression. Test: the `+ for (let i = 0…` line is visible in the first screen at 375, and no code line wraps.
6. **Cookie card off the page's own controls (shared chrome).** At 1470 the card must not cover "Replay race" or the terminal status bar: move it to a bottom corner of 360 px or less, or lift the page's last row by its height. Test: the bounding boxes of the cookie card and any `main button` do not intersect.
7. **Fix the seam in the "how" stack.** The outgoing card must not slice through a heading. Either fade or lift it as a whole, or clip at the card's top padding so no text is cut. Test: no frame of a slow scroll shows a partial glyph row at the stack seam.
8. **Hover that answers.** "Read the docs" and "Explore GitHub examples" need a visible hover change other than opacity (underline offset 3 → 5 px, or the arrow moving 4 px). Places cards get a 2.5° tilt or a lift on fine pointers. The header ask (shared) must stop using opacity 0.88 as its hover. Test: computed style differs on hover for every `a` and `button` in `main`, and no hover changes only opacity.
9. **Deck colours only.** Replace #2c2c2e (Open Dev hover), #6e6e73 (tabs) and #d2d2d7 (Copy) with deck steps (#262626 or #404040, #525252 or #737373, white 78%). Test: `taste.py` passes and no computed colour outside the ramp appears on hover.
10. **Copy button at 44 px or more.** Currently 74x32. Test: height ≥ 44.
11. **Give "Built to be checked." an object.** One existing artefact from the page's own copy (the verifier ledger line, the exit status, the tests, the diff) drawn as a small live ledger row, instead of three ticked rows. Test: the section has a non-icon visual, at least 200 px tall.
12. **Bring the second half alive.** Install, open source, FAQ and paste each need one motion that is not a fade-up: the release tag counting to v0.7.7, a copy confirmation, a scrubbed repo card. Cut the dead space between them so the gap from each section's heading to its object is 116 px or less at 1470. Test: each 100svh after the stack has one moving or changing element.
13. **Band headline (shared Band).** Replace the opacity-and-blur reveal with the line-mask cut-in, and balance the wrap so "Dev ships it." is not split as "Dev / ships it.". Test: no `filter: blur` animation on the Band, and the last line has 3 or more words or keeps the h1's 2-line break.
14. **Rail edge.** After "Next place", snap so no card is cut mid-word at the viewport edge (the peek stays 14 to 18% of a card). Test: no text node of a rail card is clipped by the viewport.

## Proof images (in `docs/build-notes/review/dev/`)
- `1-hero-diff-landed-1470.jpg`: 1470x801 at t≈8.75 s with no input. The terminal has landed the diff (`-` line struck, `+ for (let i = 0; i < tries; i++)` highlighted, `+1 -1 M`). Also visible: the cookie card over the terminal's status bar and the red "1 Issue" badge in the bottom-left.
- `2-race-clock-stuck-at-0.jpg`: 1470x801 with `prefers-reduced-motion: reduce`, 6 s after the race board came into view. Both cards read "READY 0.00 s" and the race never shows its result. With motion on, the clocks do run, to 9.52 s and 2.29 s.
- `3-two-solid-fills-and-error-badge.jpg`: 375x812 at t≈6 s. A solid black header "Try Hanzo" and a solid black "Open Dev" are on the first screen together. The cookie card covers the hero terminal, so the diff never shows, and the red "1 Issue" badge sits on top.
