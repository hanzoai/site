# /tunnel: James-eye review

Verdict: 5/10
First complaint: "It's black and white now, and the address landing under the title is nice. But on my phone the middle is just a black gap with one thin line where the laptop and the phone should be. And once the address lands, nothing moves unless I scroll. The bottom half is still text, and it ends the same way as the other Cloud pages."

Reviewed: main @ `2475ed02` (last page commit `42470f7a`). Files hash: `54b593f6c601`
Walked 7 Nov 15:21–15:24 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/tunnel.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour, and the label over the title.**
  - The walk found no hue at either width. Before, there was orange, green, red and blue.
  - `--ac` is gone. The "open internet" is now a white-to-`#d4d4d4` light, the dots are white or ink, and "terminal closed" is grey italic.
  - "hanzo share" is now a 12px mono caption under the h1, not a dotted eyebrow above it.
  - Contrast is fixed too: 0 runs under 4.5:1 (it was 7).
- **Done: presses, scale, and the builder's place.**
  - Every button now presses: 0.98, "Deploy to Cloud" 1px down, Copy 0.94, Pause 0.97. Before, none of the six link buttons did.
  - The type rests at the live sizes (h1 52px, the URL 64px, heads 26px).
  - The name builder sits inside fact 02, the fact it acts out.
  - Typing starts on arrival: the URL lands at about 5 s on desktop (it was 7.5 s) and by 3 s on phone.
- **Half done: one ask.**
  - Desktop: the header turns to a solid "View Source" from s1 to s10. "Install the CLI" is now outlined, and "See Pricing" and "Deploy to Cloud" are text links.
  - But at s8 the close's solid "View on GitHub" sits under the header's solid "View Source": the same link under two labels.
  - Phone: the header's solid "Try Hanzo" sits with the hero's "View Source" (s0) or with the bar's (s1, s5).
- **Worse: the phone scene.** The old build played the stage on phone on a 9 s loop. It is now placed between "01 / 06" and "05 / 06" as asked, but it draws 0px wide. The phone shows about 520px of black with one thin line (s1 and s2, shotdiff 0).
- **Still open:**
  - With JS off, 5 runs are hidden (it was 9), and they now include the hero's URL.
  - The code block's Copy still takes the "$" and the output lines.
  - The selected mode's hover is dead.
  - The coverage card now exists, but five of its claims are false.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, at both widths.
   - Desktop: all of this fits inside 801px:
     - "Hanzo Tunnel" (52px, top 132) with "HANZO SHARE" under it;
     - the lede and "View Source" (y 288);
     - the black terminal band, where `hanzo share 3000` types, "→ sharing 3000" prints, and "wispyfox7421.share.hanzo.ai → localhost:3000" lands at 64px.
   - 3/25 frames move in the first second after paint, then 13/43 in the rest of the 3 s.
   - Sheet 01: the hero is white until 1.5 s, which is the dev server's allowance. Then the terminal band fades in through light grey and mid grey for about a second before it turns black. Typing starts at about 2.5 s, and the URL lands at about 5 s.
   - Phone: all of this fits 375×812: the 40px h1, the lede, "View Source" (y 461) and the whole band, with the URL at 26px. 8/25 frames move in the first second, and the URL is in by 3 s.
   - Then it stops. Once the caret switches off, s0 is STILL at both widths (shotdiff 0).
2. **One in, one out, or a document?** On desktop, through the room only. Then it is a document. On phone, no.
   - The desktop room is pinned (320svh) and scrubbed by scroll. One stage changes per screen:
     - s1: the café laptop types "$ h".
     - s2: the silver "open internet" wipe opens, packets run along "Hanzo fabric", and the phone loads a page.
     - s3: "05 / 06 It ends when you do", with three `GET /` lines.
     - s4: "terminal closed", the phone reads "stopped answering", and the room goes dark again.
   - It is still the best part of the page, but it only moves while you scroll. s1 and s4 are shotdiff 0, and s2 and s3 move (0.094 / 0.097) only because of the packets.
   - After the room comes a document:
     - "For the things that need a real URL" (26px) holds on the left while four facts scroll by on the right.
     - Fact 02 has the builder, 03 and 04 are a heading and a paragraph each, and 06 has the mode switch.
     - Then "One command, one URL" on grey, then the dark close.
     - s4 to s8 are all STILL.
   - On phone the room is broken.
     - Between "01 / 06" and "05 / 06" there are about 520px of black with one thin vertical line at x 187. This shows at s1 and s2 (both shotdiff 0) and in film frames from 6.2 s to 11.8 s.
     - The line is the stage's border: the stage draws 0px wide. So you read "It ends when you do" before anything has opened.
   - Count:
     - Desktop: 8 of 11 screens are STILL. Only s2, s3 and the prompt caret at s9 move.
     - Phone: 11 of 12 screens are STILL. Only s7 (the prompt caret) moves.
   - That makes it a dead page.
3. **A real object in every section?** On desktop mostly. On phone, no.
   - Hero: the terminal band and the URL.
   - Room (desktop): the laptop, the phone and the fabric wire. The phone's "page" is still a wireframe: a black block and four grey bars.
   - Facts: 02 has the builder (typing a name rewrites the command and the URL), and 06 has the mode switch. 03 and 04 are words only.
   - "One command, one URL": the code block.
   - Close: a static share card (the URL at 44px) and the shared "Paste and ship" prompt.
   - Phone room: no object at all (the 0px stage).
4. **One ask, nothing floating, scale with rhythm?** Floats and scale pass. The ask passes only on desktop, and not at the close.
   - **Floats:** none.
     - FLOATS is empty at both widths, and there are no cursor labels.
     - The phone bar "View Source →" (s1, s5) sits below the content in the shots. At s5 it clears the code block by about 10px.
   - **Ask, desktop:**
     - While the hero ask is in view, the header shows a quiet "Try Hanzo". From s1 to s10 it shows a solid "View Source".
     - At s8, the close's solid white "View on GitHub" sits under the header's solid black "View Source". Both go to github.com/hanzoai, so that is two solid fills and two labels for one link.
   - **Ask, phone:** the header's "Try Hanzo" is solid on every screen and never becomes the page's ask.
     - The first screen has two solid black buttons: "Try Hanzo" (y 8) and "View Source" (y 461).
     - s1 and s5 have the header plus the bar's "View Source →".
     - s6 has the header plus "View on GitHub".
     - The header is shared, but the page still fails part 4.
   - **Scale:** it rests at the live sizes.
     - s0: the h1 is 52px, the URL 64px (Air), the command 26px and the lede 17px.
     - The room heads are 26px. The close has a 26px head, and its share card's URL is 44px.
     - There is one big thing per screen, and the wipe grows and then shrinks back.
     - One slip: the four fact titles (h3) are 32px, set under their own 26px h2, so the items outrank the section head.
5. **Every hover and press answers?** Yes, except one.
   - These answer on hover and press:
     - "View Source" (0.98) and Pause (0.97);
     - "web" and "drive" (0.98);
     - "Install the CLI", "View on GitHub" and "hanzoai" (0.98);
     - "Deploy to Cloud" (1px down) and Copy (0.94).
   - Dead: the selected mode, "proxy". Its hover darkens text that is already ink.
   - Phone taps:
     - "static" and Copy answer.
     - "proxy", which is already chosen, shows nothing.
     - The walker's Pause tap logged no change. It tapped as it scrolled, and the stage that Pause controls is invisible anyway.
   - There is no opacity-only hover and no jump. But no hover tells you anything: nothing on the page answers the pointer beyond button states.
6. **Overlap, font swap, layout shift?**
   - Nothing was measured:
     - no overlaps;
     - no horizontal scroll at 375 or 320;
     - the h1 box is steady (one reading each: 1152×60 at top 132, 343×46 at top 172);
     - CLS is 0.017 on desktop and 0.001 on phone.
   - Broken, though not an overlap: the phone stage draws 0px wide (answer 2).
   - The builder's URL breaks mid-word:
     - Phone: "https://wispyfox7421.sh / are.hanzo.ai", with the underline under "wispyfox7421" touching the second line.
     - Desktop: "…share.hanzo. / ai".
7. **Which reference, and is its motion there?**
   - apple.com product page, on desktop: a pinned dark room where one stage changes as the caption swaps. Its motion is there, but only with scroll.
   - The mix of motion:
     - arrival: the h1 cut-in and four fade-ups;
     - time: the typing, once;
     - scroll: the wipe;
     - ambient: the packets, only while the wipe is open;
     - state: the mode switch and the builder.
   - On phone the Apple scene is gone.
   - synchronized.studio card-open: absent.
   - anthropic launch: there is no hero figure, but Hanzo's Tunnel copy has no figures, so that is fair.
8. **Different from its neighbours?** The object, yes. The frame around it, no.
   - Its own:
     - a terminal band where the URL lands as a 64px line;
     - the wipe room that opens and shuts.
   - Shared:
     - In Cloud 4, the first screens of /search, /sentinel, /stream, /telemetry and this page are each a 52px "Hanzo X" with a 12px mono caption under it. /visor, walked on an older build, has the same caption.
     - Tunnel's layout is the arrangement /telemetry and /metrics use: title and lede on the left, the black button on the right, a product strip on the fold.
     - The close is `Finale`, the same block on 9 Cloud 4 pages (/auto, /billing, /search, /sentinel, /stream, /telemetry, /tunnel, /visor, /world). It has "Get started with X" in a dark band with one ask and an object, then "Get X" with the licence and "hanzoai" chips, "Deploy to Cloud" and "Paste and ship".
     - "0N / 06" under each heading is shared with /sentinel.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/tunnel.md` now exists with all 18 parts, but five of its claims fail the walk.
10. **Banned tells?** One: a dead page.
    - On desktop 8 of 11 screens don't move untouched, and on phone 11 of 12 don't. The desktop room moves only with scroll.
    - That caps the page at 6. The phone's room, an empty black gap where the page's signature should be, takes it to 5.
    - Clean:
      - no hue at either width;
      - nothing above any headline;
      - nothing floating and no cursor labels;
      - no opacity-only hover;
      - 0 title tooltips;
      - 0 console errors at either width;
      - no sound code of its own, so nothing plays on hover, scroll or load.
11. **Copy untouched?** Yes.
    - Parity is 38/38 text and 4/4 links.
    - The 4 strings that are not in Hanzo's source ("café network", "nothing listening", "open internet", "Target: a port.") are labels lifted from Hanzo's own sentences. The rest is demo data. There is no new claim or number.
    - On screen, the six facts still read 01, 05, then 02, 03, 04, 06. Their words are untouched.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/tunnel.md` is the same at HEAD and in the pack. It uses the older form, 18 numbered paragraphs, and all 18 are there. Five claims fail the walk:
  - Part 4, "one solid per viewport": two solid fills at desktop s8 ("View Source" in the header and "View on GitHub") and at phone s0, s1, s5 and s6.
  - Part 9, "on phones the scene plays by itself with a Pause": the phone stage draws 0px wide, and s1 and s2 are shotdiff 0.
  - Part 11:
    - "the scene reads 01, then the stage playing on its own, then 05": the stage is a line.
    - "targets ≥44px": on phone, "See Pricing" is 100×21 and "Deploy to Cloud" is 132×21.
  - Part 13, "packets are CSS transforms": `@keyframes tn2-pk` animates `left`.
  - Part 17, "JS off shows every word": 5 runs are hidden, including the hero's URL.
  - The card also lacks the copy-questions and requested-changes lines above part 1.
  - The V2 line ("played when seen on phones") repeats the part 9 claim.
  - This caps the page at 7.
- **Part 1:**
  - The metric is `cta_click:tunnel.primary`. That is not one of MASTER §1's metric ids, so the check finds none.
  - Two solid fills on one screen, as above.
- **Part 3:**
  - With JS off, these are hidden: "→ sharing 3000", the URL, and "It ends when you do" / "05 / 06". `.tn2-url`, `.tn2-share` and `.tn2-cap-i` start at opacity 0 through their class, and the page has no `html:not(.js)` rule for them.
  - On arrival, the terminal band fades in through grey.
  - The phone room has no object.
- **Part 4:**
  - `data-cta` reads "primary", "close", "install-cli", "pricing" and "deploy", not `tunnel.<slot>`.
  - On phone the header never carries "View Source". That is shared, so request it.
- **Part 6:**
  - Phone has 8 runs under 14px. Desktop has 2 under 13px: the code bar's "terminal" and "Copy". The two 12px mono captions are allowed.
  - The builder's URL breaks mid-word, and its lines touch.
  - The fact titles (32px) outrank their 26px h2.
- **Part 7:**
  - `Tunnel.css` holds 54 literal hex values. All are on the deck's ramp, but they are not tokens.
  - The hero's black terminal band runs straight into the black room, so the top of the page is one long black block.
- **Part 8:**
  - The selected mode has no hover.
  - The mode switch is `aria-pressed` buttons, not the kit `Tabs`, so there are no arrow keys.
  - The packets animate `left`.
- **Part 9:**
  - A dead page (above).
  - Four fade-ups on the hero (caption, lede, ask and terminal band), against a budget of 2.
  - The desktop room moves only with scroll, and nothing answers the pointer.
- **Part 11:** the phone stage draws 0px wide, and two phone targets are 21px tall.
- **Part 16:** the Copy on "One command, one URL" puts "$ hanzo share 3000", "→ sharing 3000" and the URL line on the clipboard. The paste does not run in zsh.
- **Part 17:** JS off, as in part 3.
- **Part 18:** the `data-cta` form is wrong, and the V2 line claims 8/10 and the phone scene.
- Passing:
  - structure: one h1, visible with JS off; one `main#main`; a band at the end; no raw img, video or table;
  - colour and headings: no hue at either width; nothing above any headline; 0 low-contrast runs;
  - layout: no overlap; no horizontal scroll at 320; the h1 box steady; CLS 0.017 / 0.001;
  - asks: the header carries "View Source" on desktop; 5 `data-cta` and 1 `data-thumb`; every button presses;
  - motion: reduced motion settles (0 running after 3 s); a 44px Pause on the room;
  - working: 0 console errors at both widths; parity 38/38 and 4/4; no audio code of its own.

## Fixes (in order)
1. **Put the phone scene back.**
   - The cause: every child of the stage is absolutely placed. Under 900px, `.tn2-scene-in` becomes a flex column but keeps `align-items: center` from its desktop grid, so the stage shrinks to 0px.
   - The fix: add `.tn2-scene:not(.pin) .tn2-stage { align-self: stretch; }` to the phone block of `Tunnel.css`.
   - Then check the phone film: between "01 / 06" and "05 / 06" the laptop should type, the wipe should open and shut, and Pause should swap its icon.
2. **Let the still half run once by itself.** Use what is already on the page:
   - When the builder comes into view, type the placeholder already in the `--name` field once, so the command and the URL rewrite. Then rest, and stop at the first key.
   - When the mode switch comes into view, step proxy → web → static → drive once, then stop at the first touch.
   - On desktop, when the room is reached, let the café laptop type the command by time, as the hero does. Leave the wipe on scroll.
   - Keep one mover per screen. Reduced motion shows the end state.
3. **Make JS off and the arrival clean.**
   - Add a `NoJs` rule: `.tn2-url,.tn2-share{opacity:1;transform:none}` and `.tn2-cap-i{position:relative;opacity:1;transform:none}`.
   - Drop the opacity fade on the terminal band, so it never shows as a grey block. Keep the 40px rise, or clip it in.
   - Cut the hero to 2 fade-ups.
4. **One solid ask per screen.**
   - Make s8 hold one solid. Either the header's ask steps aside while the `data-ask-hide` band is on screen (request it), or the close's "View on GitHub" becomes an outline button on this page.
   - Write `docs/requests/tunnel.md` for phone: the header should go quiet while the hero's "View Source" is in view, then carry "View Source" after it, as desktop already does.
   - Give "See Pricing" and "Deploy to Cloud" a 44px hit area on phone (padding on the link `Cta` in `Tunnel.css`).
5. **Make the card true.**
   - Animate the packets with `transform: translateX` instead of `left`.
   - Make the Copy on "One command, one URL" take `hanzo share 3000` only. The three lines on screen stay as they are.
   - Set `data-cta` to `tunnel.hero`, `tunnel.close` and so on, and use a MASTER §1 metric id.
   - Then correct parts 4, 9, 11, 13 and 17 and the V2 line, and add the two missing lines above part 1.
6. **Tidy the type.**
   - Set the fact titles (`.tn2-list .l2-title`) to 21px, so the 26px "For the things that need a real URL" leads.
   - In the builder, put a `<wbr>` before ".share" and set `line-height: 1.2` on `.tn2-name-url`, so the URL breaks at the dot and the lines no longer touch.
