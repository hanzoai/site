# /tunnel: James-eye review (third walk)

Ready: 8 Nov 23:27, copycheck missing 0 of 28 (captured page), Hanzo's images kept. 'You get a random token by default…' reads as one sentence again (balanced wrap keeps --name whole), and Hanzo's Iro art stands under the 02 / 06 counter. taste/unique/parity OK (38/38); 0 console errors, no overlap at 1470 and 375.

Reviewed: main @ `0fa3c9ed`. The last page commit is `5ebd0fae` (16:45 UTC), and the tree is clean for the page files.
Walked 7 Nov, about 16:50 to 17:05 UTC, on the dev server at 1470×801 and 375×812 (Playwright Chromium), moving.
- **The scroll walk.** Each walk scrolled by wheel in 0.6-viewport steps. On each screen it compared two frames taken 1.6 s apart for idle motion. It recorded solid fills, the header's ask label and fixed layers per screen.
- **The first screen.** It filmed the first 3 s of the first screen. It filmed the hero band at 200 ms intervals for 8 s, then again for 5 s while paused.
- **Shift, fonts and the h1.** Layout shift was logged with a PerformanceObserver over a full scroll, two runs per size, with the phone run both plain and with `isMobile`. The h1 box was polled every frame for 4 s, and font loads were logged.
- **Separate runs** covered:
  - hover and press on all 16 controls in `main`;
  - a Tab crawl;
  - Copy, with the clipboard read back;
  - the builder and the mode radios by keyboard;
  - both Pause controls;
  - 320×640 and 375×667;
  - reduced motion and JS off.
- **Also run:** `node scripts/motion.mjs /tunnel`, `scripts/parity.py` and `scripts/taste.py`.

Tooling note: a run that took screenshots straight after `load` logged a hydration error with a red "1 Issue" badge. The diff is the header inputs' `style={{}}` (Playwright's injection) plus `FooterHTML`'s `__html` (the known site-wide footer issue, owned elsewhere). The same loads with no early screenshot show **0 console errors and no badge at both widths, with normal and with reduced motion.** I put neither error on this page.

Verdict: 7/10
First complaint: "On the computer it's lovely now. The ask hands over to the header, and the laptop and the phone open and shut. But pick up my phone: there are two black buttons on the first screen, 'Try Hanzo' and 'View Source', and the top never turns into View Source. And the page jumps about while it types."

## Since the last review (7/10)
- **Fixed: the desktop ask.** At s0 the header shows "Try Hanzo" outlined (transparent) and the hero shows "View Source" solid: exactly one solid fill. Once the hero ask leaves the screen, the header carries "View Source". It was sampled at 10 scroll positions and was right at every one.
- **Fixed: the reduced-motion error.** `Gate` now sets `shut` after mount. Reduced motion gave 0 errors and 0 running animations after 3 s at both widths, and every scene shows its settled frame.
- **Fixed: JS off.** The hero reads "$ hanzo share 3000" from the server text. The only text left hidden is the close's "terminal closed", and it is meant to come in.
- **Fixed: Pause and size slips.**
  - The carets blink 4 times and rest (`tn2-blink x4`).
  - The scene's Pause leaves 0 running animations in the scene, so the retry dot stops too.
  - The close card keeps "$ hanzo share 3000" on one line, with "terminal closed" on its own line on phone.
- **Fixed: the facts' left column.** It now carries a live 64px "02 / 06" … "06 / 06" figure.
- **Not fixed: the phone ask.**
  - At 375×812 (plain and `isMobile`) and at 375×667, the header's "Try Hanzo" is a solid `rgb(10,10,10)` fill on the first screen, beside the solid hero "View Source".
  - The header never turns into "View Source" at any of 10 scroll positions. There is no ask bar.
- **Not fixed: phone CLS.** Phone CLS is still about 0.04 to 0.05 (see question 6).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - Desktop: "Hanzo Tunnel" is 52px at y 132, and its box stays at 1152×60 for all 4 s. The "HANZO SHARE" caption, the lede, "View Source" (y 288) and the black band with the 64px URL all fit in 801px.
   - Desktop motion: frames differ from 0.35 s on, as the h1 cuts in and the command types. After that, a "GET / · 127.0.0.1:3000" line rolls in about every 2.6 s, taking about 600 ms (film: `....MMM......MMM......`). Pause freezes it (25 of 25 frames still).
   - Phone: the h1 is 343×46 at y 172. The lede and "View Source" (bottom 509) are above the fold at 375×667.
   - Phone weak spot: the terminal band sits under the shared consent card until it is dismissed. The first screen also reads still between request lines.
2. **One in, one out, or a document?** Mostly one in, one out.
   - Desktop: the pinned dark room (320svh) changes one stage at a time: 01, the wipe opens, packets run, the phone loads, 05, "terminal closed", the wipe shuts. Then the facts, each with one object that plays when reached, under a sticky head whose number changes. Then "One command", then the close.
   - Phone: caption 01, then the self-playing stage, then caption 05, then the facts.
   - Weak spot: a dead white strip of about 100px between the hero band and the dark room (d-s01). Desktop still has empty white space under the sticky "04 / 06" for about 2 screens, but now it carries something.
3. **A real object in every section?** Yes, with two thin spots.
   - Hero: the band and the URL. Room: the laptop, the fabric and the phone. Facts: the builder (02), the gate (04) and the modes (06). One command: the code pane. Close: the share card and the agent prompt.
   - Fact 03 is still words only.
   - The phone's page is still a wireframe (a black block and four bars).
   - The phone's address bar cuts off at "wispyfox7421.shar" with no fade or ellipsis, at both widths.
4. **One ask, nothing floating, scale with rhythm?** Desktop passes. The phone fails.
   - Desktop: one solid fill per screen throughout. At s11 and s12 the dark Copy chip (`rgb(23,23,23)`) sits inside the code pane; that is a code tool, not an ask. The close's "View on GitHub" is outlined.
   - Phone: two solid fills on the first screen (header "Try Hanzo" at 262,8 and hero "View Source" at 215,461). The header never carries the page's ask.
   - Floats: nothing floats over content except the shared consent card (203px on phone, inside the 220px limit) and the dev badge. There is no cursor label.
   - Scale: h1 52, URL 64, heads 26, fact titles 21, the sticky figure 64, close URL 44. One big thing per screen, and the wipe grows and shrinks.
5. **Does every hover and press answer?** Yes, with no jumps (0 position or size changes on hover across all 16 controls).
   - "View Source": fill goes to #2c2c2e, press 0.98.
   - Pause: the disc turns white, press 0.97.
   - Inputs: the border darkens and a 3.7px ring appears on focus.
   - Modes: ink and border on hover, press 0.98. The arrow keys move the selection and the live text.
   - "Install the CLI": inset tint, 0.98.
   - "See Pricing" and "Deploy to Cloud": the arrow moves (visual change confirmed), press 1px down.
   - Copy: a faint tint, press 0.92. "View on GitHub": a 10% fill and a white border. "hanzoai": the border only.
   - `motion.mjs` calls the Copy and "hanzoai" hovers dead. They are only very faint.
   - Copy writes exactly `hanzo share 3000` (clipboard read back) and says "Copied".
   - The builder works: "My Hook!" + "localhost:8080" gives "$ hanzo share --name myhook localhost:8080", "https://myhook.share.hanzo.ai" and "Target: a host:port."
   - The only pointer detail is still the open internet's sheen.
6. **Overlap, font swap, layout shift?**
   - Pass:
     - No overlaps at either width.
     - scrollWidth is 320 at 320 and 375 at 375.
     - The h1 box never moves (one reading at each width over 4 s).
     - Zen and Zen Mono finish loading by 0.64 s (1.15 s for the second set), with no visible swap.
   - Fail, phone CLS: 0.041 and 0.043 (plain), 0.055 and 0.047 (`isMobile`), against MASTER's lab target of 0.02. It reproduced on all 4 runs. The causes, all from the page:
     - `.tn2-scene-pin` moves 25px (0.012 to 0.022), with the hero's Pause moving with it, so something in the hero changes height after paint on phone.
     - The modes stepping by themselves: "serves a directory as a site" and "passes traffic through to a local port" wrap to different line counts. This pushes `.tn2-one` 22px (0.016 to 0.021).
     - The builder note and target swap (0.0045).
   - Borderline, desktop CLS: 0.008 and 0.022. The builder's ".share.hanzo.ai" line jumps 31px up and back as "acme-callbacks" types (0.0037 + 0.0045), and once the band and pin shifted 29px (0.0083). `motion.mjs` measured 0.013 on desktop and 0.007 on phone with its own scroll.
   - Craft slips:
     - On phone, the body copy breaks the flag "--name" across a line ("Pass --" / "name").
     - The "One command" pane wraps "→ localhost:3000" onto its own line at both widths, with the waiting caret on a third line.
7. **Which reference, and is its motion there?**
   - apple.com product page: the pinned scene where one stage changes. It is there on desktop, and on phone it plays as a loop with Pause.
   - The mix:
     - arrival: the h1 cut-in;
     - time: typing, request lines and the close's one-shot ending;
     - scroll: the wipe;
     - pointer: the sheen;
     - state: the gliding mode pill and the builder;
     - ambient: packets and the retry dot.
   - Still one trick repeated: the same typewriter runs 4 times (hero, café laptop, builder, "One command"). The card declines the line-mask swap.
8. **Different from its neighbours?** The object, yes. The frame, partly.
   - Its own: the URL as the headline, the open-and-shut wipe room, the gate, and a close card that plays the page's own ending.
   - Shared: the "Hanzo X" h1 with a mono caption under it, and the `Finale` block ("Get started with X" / "Get X" / licence chip / "hanzoai" / "Deploy to Cloud" / "Paste and ship"). Only its object differs here.
9. **All 18 parts covered?** The card ticks them, but parts 1, 4, 11 and 13 claim phone results that are false (see below).
10. **Banned tells?** None. There is:
    - no hue (`taste.py` OK);
    - nothing above a headline;
    - no fading buttons;
    - no `title=` tooltips;
    - no gradient text;
    - no Inter.
11. **Copy untouched?** Yes. `parity.py`: text 38/38, links 4/4.

## Coverage card: claims checked (a false claim caps the page at 7)
- **False, part 1:** "exactly one solid fill on the first screen at 1470×801 and at 375×812". It is true at 1470. At 375 there are two (header "Try Hanzo" solid and hero "View Source").
- **False, part 4:** "The shared header carries 'View Source' solid after the hero at both widths (checked at 1470 and 375)". At 375 the header says "Try Hanzo" at every scroll position, plain and `isMobile`.
- **False, part 13:** "CLS over a full scroll was 0.0071 at 1470 and 0.0048 at 375". Measured: 0.041 to 0.055 at 375 (4 runs) and 0.008 to 0.022 at 1470.
- **Partly false, part 11:** "375×812 … pass". There is no overlap, but the phone fails the one-solid rule and the CLS target.
- **True:**
  - 0 console errors with normal and reduced motion once the tooling artifact is set aside, and the reduced-motion settled frame.
  - JS off is legible, with the hero command in the HTML.
  - Copy equals display, and the `$` is not copied.
  - Packets use transform. The carets blink 4 times. Pause stops the retry dot.
  - The radiogroup has arrow keys.
  - The Tab crawl shows a ring on every stop: 2px ink on light, 2px white on dark, and the inputs' border with a ring.
  - 44px targets. No horizontal scroll at 320. The ask is above the fold at 375×667.
  - Parity, taste, one h1 and `main#main`.
  - `data-cta` in `tunnel.<slot>` form on the page's own asks, with `data-thumb` on the hero.
  - The `V2:` line is honestly unticked and not in the file.

## Missing from the 18 parts
- **Part 1, part 4 and part 11:** on phone, two solid fills on the first screen, the header never carries "View Source", and there is no ask bar.
- **Part 10 and part 13:** phone CLS is 0.04 to 0.05 against 0.02, from the 25px hero or pin shift, the mode text rewrap and the builder rewrap.
- **Part 6:** the "--name" flag breaks across a line on phone. The one-command pane wraps its URL line.
- **Part 9:** the typewriter repeats 4 times. The supporting time motion should vary.
- **Part 3:** a dead 100px white strip between the hero band and the dark room on desktop.
- **Part 18:** no `V2:` line yet (correctly unticked). Finale's `data-cta` is still "close" / "deploy" (already requested in `docs/requests/tunnel.md`).
- **Part 7 and question 8:** the close is still the shared Finale template.

## Fixes (in order)
1. **One solid ask on phone.**
   - Find why the shared header's phone ask ignores the page's hero ask. Desktop does it right: quiet "Try Hanzo" while "View Source" is in view, then a solid "View Source".
   - If it is the shared `Ask` or `Header` phone branch, request it in `docs/requests/tunnel.md`. Until it lands, untick parts 1 and 4 for phone, or make the header's phone ask quiet while the hero ask is on screen.
   - Check: exactly one solid fill at 375×812 s0, and "View Source" in the header after the hero.
2. **Phone CLS under 0.02.**
   - Find the 25px change in the phone hero after paint. The likely suspects are the `.tn2-term` URL and share lines or the command line's box while it types. Reserve their final height in CSS.
   - Give the modes' description line (`.tn2-modes p`) a `min-height` of its longest variant at 375 (two lines), so the auto-step does not push "One command".
   - Pin the builder URL to two lines at every width, so ".share.hanzo.ai" never jumps 31px as the name types.
   - Re-measure with a wheel scroll at 375 (plain and `isMobile`) and 1470, two runs each.
3. **Make the card true.** Correct parts 1, 4, 11 and 13 with the phone numbers above.
4. **Phone typography slips.**
   - Keep "--name" whole in the fact 02 body. Use a no-break on the flag in presentation only (wrap it in a `white-space:nowrap` span; the words stay the same).
   - In "One command", let the output line keep "→ localhost:3000" with the URL (a narrower letter-spacing or a `<wbr>` before "→"), or accept the wrap and drop the third-line caret.
5. **Vary the time motion.** Four typewriters is one trick. Keep the hero and the café laptop typing. Let "One command" land by line mask (the lines already exist as `cf-ln`). This replaces one typing motion with another kind of motion, so no motion is removed.
6. **Close the white gap** between the hero band and the dark room, or give it the room's peek (MASTER part 3: the next section peeks 56px; old and new overlap by 40px).
7. **Small finishes.**
   - Fade the phone's address bar into its edge rather than cutting "wispyfox7421.shar".
   - Give fact 03 a small object of its own, for example the first-share print with the identity line, from the existing words.
   - Make the Copy and "hanzoai" hovers visible enough that `motion.mjs` does not call them dead.
