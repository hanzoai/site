# /tunnel: James-eye review

Verdict: 7/10
First complaint: "It's alive now, and on my phone I finally see the laptop and the phone open and shut. But the top has two black buttons again, 'Try Hanzo' and 'View Source', and the header never turns into View Source any more. Turn on reduced motion and there's a red error in the corner. And the ending is still the same block as every other Cloud page."

Reviewed: main @ `68da3e6d` (last page commit `013a6e3a`).
Walked 7 Nov, about 16:10 to 16:39 UTC, on the dev server, moving, at 1470×801 and 375×812 (Playwright Chromium). Each walk scrolled by wheel in 0.6-viewport steps, waited, then compared two frames 1.6 s apart for idle motion. It also filmed the first 10 s of the first screen, logged layout shift with a PerformanceObserver, polled the h1 box, and logged font loads. Separate runs covered hover and press on every control in `main`, a Tab crawl, Copy to the clipboard, the builder, both Pause controls, taps on the phone, 320×640 and 375×667, reduced motion and JS off. Parity and taste were run as well.
Note on the tooling: a Playwright screenshot taken before hydration writes `style=""` onto inputs and causes a false hydration error. Those runs were thrown out. The reduced-motion error below comes from runs with no early screenshot.

## Since the last review (5/10)
- **Fixed: the phone scene.** The stage now spans the column (343×520). The laptop types, the open internet opens, packets run, the phone loads, then "terminal closed" and "stopped answering" appear. It loops by itself, and Pause stops it (tested: moving before the tap, still after).
- **Fixed: it is no longer a dead page.**
  - The hero keeps rolling "GET / · 127.0.0.1:3000" every 2.6 s, and Pause freezes it (tested).
  - The café laptop types on arrival.
  - The builder types "acme-callbacks" once.
  - The modes step proxy → web → static → drive once.
  - The gate's shackle shuts.
  - "One command" types itself.
  - The close plays "terminal closed" and strikes through the URL.
  - Still screens: 4 of 15 on desktop (s2, s3, s6, s13; it was 8 of 11). On phone, the still screens are now mostly the footer.
- **Fixed: JS off.** The URL, "→ sharing 3000" and both scene captions show. The only hidden run is the close's "terminal closed", which is meant to come in. The hero's `hanzo share 3000` is still missing, though: the span is filled only by script, so JS off shows "$ ▮".
- **Fixed:** Copy writes exactly `hanzo share 3000` (clipboard read back). Packets use `translateX`. The fact titles are 21px. The builder URL breaks at ".share". The selected mode answers hover with a ring and shadow. The phone links are 44px tall.
- **Worse: the ask.** `main` now carries `data-ask="off"`, and the header shows a solid "Try Hanzo" at every scroll position at both widths (sampled at 9 positions on desktop and 7 on phone). The desktop first screen has two solid black fills: header "Try Hanzo" and hero "View Source". The header no longer becomes "View Source", and the phone has no ask bar.
- **New: a red error badge under reduced motion.** `Gate` renders `tn2-gate` on the server and `tn2-gate shut` on the client (`shut = live || calm`). This happened on 2 of 2 reduced-motion loads. The red "1 Issue" badge shows, and the console logs the hydration error. Normal motion: 0 errors.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - Desktop: "Hanzo Tunnel" (52px, top 132, box steady at 1152×60), the "HANZO SHARE" caption, the lede, "View Source" (y 288) and the black band all fit in 801px. Typing starts at about 0.9 s (frame diff 0.007 at 0.9 s, 0.074 at 1.2 s). The 64px URL is in by about 5 s.
   - Phone: the h1 (343×46 at 172), lede and "View Source" (bottom 509 at 375×667) are above the fold. The band's URL sits under the consent card until it is dismissed.
   - After that, the request lines keep the first screen alive.
2. **One in, one out, or a document?** Mostly one in, one out.
   - Desktop: the pinned room (320svh) changes one stage per screen: 01 → wipe opens → 05 → wipe shuts.
   - Then comes "For the things that need a real URL", where four facts scroll past a sticky 26px head. Each fact carries one object that plays when reached: builder, gate, modes. Then "One command", then the close.
   - Weak spot: in the facts, the left 60% is an empty white column for about 2.5 screens (s7–s11). It reads as a document with a margin.
   - Phone: caption 01 → the stage playing → caption 05 → facts. It works now.
3. **A real object in every section?** Yes.
   - Hero: the terminal band and the URL.
   - Room: the laptop, the fabric wire and the phone. The phone's page is still a wireframe (a black block and four bars).
   - Facts: the builder (02), the gate (04) and the modes (06). Fact 03, "Your login is the account", is words only.
   - One command: the code pane.
   - Close: the share card and the agent prompt.
4. **One ask, nothing floating, scale with rhythm?** Floats and scale pass. The ask fails.
   - Ask:
     - Desktop s0 has two solid black fills ("Try Hanzo" at 1357,13 and "View Source" at 1167,288).
     - After the hero the header says "Try Hanzo", never the page's ask.
     - The phone has the same two solids on the first screen, and there is no ask bar.
     - The close's "View on GitHub" is outlined, which is correct.
   - Floats: nothing floats over content except the shared consent card (343×203 on phone; it is under 220px, so allowed). There is no cursor label.
   - Scale: h1 52, URL 64 Air, heads 26, fact titles 21, close URL 44. One big thing per screen. The wipe grows and shrinks.
5. **Every hover and press answers?** Yes.
   - "View Source": fill goes to #2c2c2e, press 0.98.
   - Pause: the disc fills white, press 0.97.
   - Modes: ink and ring on hover, press 0.98. The selected mode gets a ring and shadow.
   - "Install the CLI": inset tint, 0.98.
   - "See Pricing" and "Deploy to Cloud": underline, arrow moves 4px, press 1px down.
   - Copy: tint, 0.92.
   - "View on GitHub": white border and 10% fill, 0.98. "hanzoai": border, 0.98.
   - Phone taps: "drive" answers ("drive hands over files"), and Pause answers.
   - No jumps. But no hover tells you anything beyond its own state. The open internet's sheen follows the pointer, and that is the only pointer detail.
6. **Overlap, font swap, layout shift?**
   - Pass:
     - No overlaps at either width.
     - scrollWidth is 320 at 320 and 375 at 375.
     - The h1 box never moves (one reading at each width). Zen loads by 1.2 s with no visible swap.
   - Fail:
     - Total CLS is 0.035 on desktop and 0.046 on phone, against MASTER's lab target of 0.02.
     - The causes are the self-typing builder (desktop 0.011 and 0.018 as `.tn2-name-note` and the URL line rewrap) and the "One command" output lines landing (phone 0.012). The page caused all of these shifts itself.
   - Craft slip: on phone, the close card's first line wraps to "$ hanzo share / 3000", with "terminal closed" squeezed in beside it. On desktop, `justify-content: space-between` leaves a wide gap after "$".
7. **Which reference, and is its motion there?**
   - apple.com product page: the pinned scene where one stage changes is there on desktop, and on phone it plays as a loop with Pause.
   - The motion mix is now varied:
     - arrival: the h1 cut-in;
     - time: typing and request lines;
     - scroll: the wipe;
     - pointer: the sheen;
     - state: modes with a gliding pill, and the builder;
     - ambient: packets and the retry dot.
   - But the same typewriter runs 5 times (hero, café laptop, builder, "One command", close). The time motion is one trick repeated.
   - synchronized.studio card-open: absent, which is fair here.
8. **Different from its neighbours?** The object, yes. The frame, no.
   - Its own: the URL as headline, the open-and-shut wipe room, and a close card that plays the page's own ending.
   - Shared: the 52px "Hanzo X" with a 12px mono caption under it, and the `Finale` close. Finale is the same "Get started with X" / "Get X" / licence chip / "hanzoai" / "Deploy to Cloud" / "Paste and ship" block used on 9 Cloud 4 pages. Only its object differs here.
9. **All 18 parts covered?** The card has all 18, but several claims are false (see below).
10. **Banned tells?**
    - None outright. There is no hue (taste OK), nothing above a headline, nothing floating, no fading buttons and no title tooltips.
    - Against MASTER's "works" bar: the red error badge under reduced motion, and two solid fills per screen.
11. **Copy untouched?** Yes. Parity is 38/38 text and 4/4 links. Demo labels are lifted from Hanzo's own sentences.

## Coverage card: claims checked (false claims cap the page at 7)
- **False, part 4:** "Sticky ask in header and bar after the hero, same label" and "The desktop header carries the page's ask after the hero". Measured: the header is "Try Hanzo" everywhere, and there is no bar on phone.
- **False, part 18:** "`V2:` line in `components/pages/cloud/Tunnel.jsx`". There is no `V2:` line in the file. The box "Review read: verdict 8 or more" is ticked, but the review was 5/10.
- **Partly false, parts 9 and 13:** "Reduced motion renders the settled frame" and "0 console errors". The frame settles (0 running animations after 3 s), but reduced motion throws a hydration error with a red badge.
- **Partly false, part 3:** "JS off legible". The hero command line is empty with JS off.
- **Partly false, part 6:** "phone small text set to 14px". The scene laptop's terminal (`.tn2-tw`) is 13px on phone.
- **Partly false, part 12:** "Pause control on every moving item". The blinking carets (One command, the close prompt) run forever, and the phone's retry dot (`.tn2-phone.down .tn2-bar i`) keeps pulsing after the scene's Pause.
- **True:** Copy equals display, packets use transform, parity, taste, 44px phone targets, one h1, `main#main`, no horizontal scroll at 320, the ask above the fold at 375×667, the radiogroup with arrow keys, and the Tab crawl showing a 2px ring on every stop.

## Missing from the 18 parts
- **Part 1 and part 4:** two solid fills on the first screen at both widths. The header carries "Try Hanzo", not the page's ask. There is no phone ask bar.
- **Part 3:** the hero command is not in the server HTML, so JS off shows an empty prompt.
- **Part 6:** the phone laptop terminal is 13px. The close card's command line wraps badly on phone.
- **Part 8 and part 12:** endless carets, and a retry dot that Pause does not stop.
- **Part 9:** the typewriter repeats 5 times. The supporting motion should vary.
- **Part 10 and part 13:** CLS is 0.035 / 0.046, against a target under 0.02.
- **Part 17:** a reduced-motion hydration error (`Gate`).
- **Part 18:** no `V2:` line. Finale's `data-cta` is still "close" / "deploy" (already requested).
- **Part 7 and question 8:** the close is the shared Finale template.

## Fixes (in order)
1. **One solid ask.**
   - Remove `data-ask="off"` from `main`, or set it to whatever the shared header reads, so the header goes quiet while "View Source" is in view and then carries "View Source". This is what desktop did at the last review.
   - If the shared Ask cannot do that, request it in `docs/requests/tunnel.md`. Until then, do not claim it on the card.
   - Check desktop s0: there should be exactly one solid black fill.
2. **Kill the reduced-motion error.**
   - In `Gate`, do not let `calm` change the first render. Keep `shut` false on the first render, then set it in an effect (`useEffect(() => { if (calm || live) setShut(true) }, [calm, live])`), or render `shut` on both server and client when calm.
   - Recheck with `reducedMotion: 'reduce'`: 0 console errors and no badge.
3. **Hold the layout while things type.**
   - Give `.tn2-name-note` and `.tn2-name-url` a fixed `min-height` (two lines at 375), so the builder's self-typing and the note swap do not shift the list.
   - Reserve the "One command" output lines. They already use `opacity`, so find the line that shifts on phone (`l2-sec tn2-one`, 0.012) and fix its height.
   - Target CLS under 0.02 at both widths.
4. **Put the hero command in the HTML.** Render `CMD` as the span's server text and let the effect clear it and type it. Alternatively, add `.tn2-cmd span:empty::after{content:"hanzo share 3000"}` under `html:not(.js)`.
5. **Vary the time motion.** Keep the typing in the hero and on the café laptop. Make "One command" arrive by line mask, not a third typewriter. In the close, keep the one-shot ending. One self-typing builder is enough.
6. **Tidy the close card.** In `.tn2-end-k`, keep "$ hanzo share 3000" together (`white-space: nowrap` on the command, then "terminal closed" on its own line on phone), and drop `space-between` after "$".
7. **Pause and size slips.**
   - Stop the infinite caret blink after 3 cycles, or tie it to the section being in view.
   - Pause the retry dot under `.tn2-scene-pin.still`.
   - Set the phone `.tn2-tw` to 14px.
8. **Make the card true.** Correct parts 3, 4, 6, 9, 12, 13 and 18. Add the `V2:` line to the top comment of `Tunnel.jsx`. Untick "Review read: verdict 8 or more" until a review says 8.
9. **Give the facts' left column a job,** or narrow the gap. For 2.5 screens the sticky 26px head sits alone in a white field. Let it carry the current fact's number ("02 / 06"…) as it changes. The data is already on the page.
