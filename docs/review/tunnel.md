# /tunnel: James-eye review

Verdict: 5/10
First complaint: "It's orange again, with green and red as well. I said greys, silvers, blacks and whites. The best moment on the page is just a box filling up with orange. That little label is on top of the headline again, and after the dark part it turns into a list of paragraphs."

Reviewed: branch `claude/laughing-hamilton-uisesd` @ `cd5ee2a` (merged to main; the branch has since moved to `486d6d0`, which only changes how Tunnel.jsx reads reduced motion). Files hash: `0bf81264f27b`
Walked 7 Nov 14:05–14:08 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/tunnel.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes on phone, late on desktop. The idea is clear and good: under the title a black terminal types `hanzo share 3000`, prints "→ sharing 3000", and the public URL "wispyfox7421.share.hanzo.ai → localhost:3000" lands as a second headline. The title is 128px at line height 0.92.
   - Phone: by 2.5 s the title, the lede, "View Source" and the landed URL all fit 375×812. In the first second after paint, 13 of 25 frames move (the title cuts in and the typing starts).
   - Desktop: the URL lands at about y 680–750, inside 801, so the object is on the first screen. But the film is white with only the header for about 2.5 s: 1 of 25 frames moves in the first second after paint. The same blank start shows on /search, /telemetry and /visor on this dev server. The title cuts in at about 3 s, the typing starts at about 3.5 s, and the URL lands at about 7.5 s.
   - With JS off, 9 text runs are hidden, including the lede and "View Source". The check passes the h1 on opacity, but in source the h1 is server-rendered at translateY(108%) inside an `overflow: hidden` line, so it starts out of sight.
2. **One in, one out, or a document?** One in, one out through the dark room, then a document.
   - Desktop dark room: a real pinned scene, 320svh tall. The laptop types the command, prints the URL and logs three `GET /` lines. The stage floods with "open internet", the phone loads a page, then "terminal closed" appears and the phone reads "stopped answering". The caption swaps from "01 / 06 The port stays on localhost" to "05 / 06 It ends when you do". This is the Apple move and the best part of the page.
   - After it: "For the things that need a real URL" holds on the left while four numbered paragraphs (02, 03, 04, 06) scroll by on the right. Only 06 has a thing to touch (the proxy / web / static / drive switch). Then "One command, one URL", then two endings in a row ("Get started with Tunnel" with the agent prompt, then "Get Tunnel").
   - Phone: the room is not pinned. Both captions come first as stacked text (s1 STILL), so you read "It ends when you do" before anything has opened. Then the stage plays itself on a 9 s loop.
   - On both widths the chapter numbers read 01, 05, 02, 03, 04, 06.
   - STILL: desktop 1 of 11 screens (s5, the room at 05/06), with s3 nearly still (3 frames, max 0.16). Phone: 2 of the 9 page screens (s1 captions, s6 the name builder), plus the footer.
3. **A real object in every section?** No.
   - Hero: yes, the terminal and the URL.
   - Dark room: yes, a laptop, a phone and the "Hanzo fabric" wire with packets running along it. The phone's "page", though, is four grey bars under an orange gradient tile: a wireframe, not anything of Hanzo's.
   - Facts: three of the four items are a heading and a paragraph only.
   - "One command, one URL": yes, the code block and the "A name you can keep" builder. Typing a name rewrites the command and the URL. It is a good Beyond.
   - Endings: the agent prompt card. "Get Tunnel" has no object.
4. **One ask, sticky after the hero?** No.
   - Five button verbs: "View Source" (hero, solid, magnetic), "Install the CLI" (solid) with "See Pricing" (outlined), "View on GitHub" (solid) and "Deploy to Cloud" (solid). "View Source" and "View on GitHub" go to the same github.com/hanzoai under two labels.
   - Desktop: after the hero, the only sticky button is the global header's "Try Hanzo" (s1–s10). No page ask follows you.
   - Phone: the header's "Try Hanzo" and the bottom bar's "View Source →" are two solid asks on every screen from s2 to s7, and s5 adds a third ("Install the CLI"). At s7 the bar sits on top of the close's "Deploy to Cloud"; only "ep" shows behind it.
5. **Every hover and press answers?** No.
   - Hero "View Source": the hover answers (it pulls toward the pointer), but there is no press state.
   - "Install the CLI", "See Pricing", "View on GitHub", the "hanzoai" chip and "Deploy to Cloud": the hover answers, but there is no press state.
   - The proxy / web / drive switch: dead hover (no hover rule at all), though it presses to 0.98. Phone: tapping "static" answers, and tapping "proxy", which is already selected, shows nothing.
   - "Copy" answers with a drawn tick and "Copied".
   - No opacity-only hover and no jumps.
6. **Overlap, font swap, layout shift?** None measured.
   - CLS 0 on desktop and 0.005 on phone (the room's laptop and caret).
   - The h1 box is steady (one reading: 1422×136 at top 240, phone 343×58 at 216).
   - No horizontal scroll at 375 or 320, and no overlaps.
   - Two small notes. The fixed phone bar covers "Deploy to Cloud" at s7. On desktop the console logged "Transition was aborted because of timeout in DOM update" on arrival; /risk and /search log the same, so it is likely the shared page transition.
7. **Which reference, and is its motion there?** apple.com product page, and its motion is there: a pinned dark room where one stage changes while the caption swaps.
   - The motion is a real mix, not only scroll: time (typing, caret), pointer (the magnetic "View Source"), ambient (the packets on the wire, and the room playing itself on phone), state (the mode switch, the name builder) and scroll (the wipe).
   - On desktop the walker's 650px steps show the room cutting from dark to full orange. The wipe growing from the terminal is visible in the phone film.
   - synchronized.studio is absent: nothing opens into its page. There is no anthropic-style hero figure, but Hanzo's Tunnel copy has no figures, so that is fair.
8. **Different from its neighbours?** Half. It is in Cloud 4 with /search, /sentinel, /stream, /telemetry and /visor.
   - The first screen is /telemetry's skeleton: a dot eyebrow, a one-line 128px "Hanzo X" on the left, the lede, one black button on the right and a product strip on the fold. Here the strip is a black terminal band, and the URL landing as a second headline is Tunnel's own idea. The orange wipe room is its own signature.
   - The rest is the Cloud kit: orange mono "0N / 06" numbers (as on /metrics and /sentinel), one dark room, an editorial list, the same "Paste and ship" card, and the same "Get X" block with license and "hanzoai" chips and "Deploy to Cloud" that /metrics and /search close on.
   - It is the second orange page after /metrics, and /telemetry is amber. James: "too many repeats of the same colours."
9. **All 18 parts covered?** No; see below. `docs/coverage/tunnel.md` is missing.
10. **Banned tells?** Yes:
    - An orange UI hue, declared in the file as "Accent: share orange" (`--ac: #ff6a13`). On desktop it covers 27 text runs and 1 background (16 and 1 on phone): the "$" prompts, the caret, "→ localhost:3000", every "0N / 06", the room's URL line, "A NAME YOU CAN KEEP", the mode word, the token in the built URL, the input focus ring and the eyebrow dot.
    - The signature itself is an orange radial gradient box (`#ffb27d → #ff6a13 → #c2410c`) that fills the stage, and the drawn phone page carries another orange gradient tile. JAMES.md rule 7: "Colour from the brand, not from boxes."
    - Green (`#30d158`) on 9 text runs and 3 backgrounds: "→ sharing 3000", the big green dot in front of the hero URL, "nothing listening" and the phone's address dot. Green accents are on the reject list.
    - Red (`#ff6b6b`) on "terminal closed". The URL in the "One command" code block is blue.
    - A "● HANZO SHARE" eyebrow 24px above the h1, with an orange dot.
    - Dead hover on the mode switch.
11. **Copy untouched?** Yes. Parity 38/38 text and 4/4 links.
    - Four strings are not in Hanzo's source: "café network", "nothing listening", "open internet" and "Target: a port." They are labels lifted from Hanzo's own sentences ("a café… sees nothing", "nothing is listening").
    - The rest is demo data ("GET / · 127.0.0.1:3000", "terminal closed", "stopped answering").
    - None is a claim or a number. The order of the six facts on screen changes (01, 05, then 02, 03, 04, 06), but their words do not.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - No `Persona:`, `Goal:`, `CTA:` or metric id in the page header.
  - More than one solid button per viewport on phone (s2–s7), and three at s5.
  - One href (github.com/hanzoai) under two labels.
- **2.3 First impression:**
  - With JS off, 9 runs are hidden, including the lede, "View Source", the eyebrow and the terminal. That fails a P1 row. The h1 is also server-rendered pushed out of its clipped line.
  - The page hand-writes its own `function Hero` instead of `PageHero`.
  - Two endings in a row, and the last solid button is "Deploy to Cloud", not the hero ask (`bandAtEnd` false).
  - No Morph.
  - On phone the facts read 01, 05, 02, 03, 04, 06.
- **2.4 Conversion:** 0 `data-cta`. The one `data-thumb` ("View Source") differs from the close ("Deploy to Cloud") and from "View on GitHub". 7 raw `.x-btn`. No sticky page ask on desktop.
- **2.6 Content:** 8 text runs under the 14px phone floor (the room's terminal lines, and the code block's "terminal" and "Copy"), and 3 at 13px on desktop. The facts are four stacked paragraphs of 30–50 words each.
- **2.7 Visual system:**
  - Orange, green, red and blue break the 0-hue override.
  - The orange is a page token (`--ac`).
  - Tunnel.css holds 41 raw hex literals (16 distinct, including four near-blacks: `#000`, `#0b0b0c`, `#111113`, `#1c1c1f`).
- **2.8 Components:**
  - 9 bare `:hover` rules.
  - No press state on the six link buttons, and a dead hover on the mode switch.
  - The switch is `aria-pressed` buttons, not the kit `Tabs` (no arrow keys).
  - The shared Copy says "Copied" even when the clipboard is blocked (a P1 row).
- **2.9 Motion:** 3 `setInterval` timers (the typing and two in Frame.jsx). On phone the room loops forever (9 s, `repeat: Infinity`), and the wire's packets loop forever on both widths, with no pause control (the WCAG 2.2.2 row in 2.12). Reduced motion is good: everything comes to rest.
- **2.11 Mobile:** the "hanzoai" chip is 111×36, under 44px. The phone bar covers "Deploy to Cloud" at s7.
- **2.12 Accessibility:** 7 runs under 4.5:1: the orange "02 / 06", "03 / 06", "04 / 06" and "06 / 06" at 2.9:1, and the mode word "proxy" at 2.6:1.
- **2.16 Developer experience:** the code block's Copy takes "$ hanzo share 3000 / → sharing 3000 / https://… → localhost:3000", with the prompt and the output included, so the paste does not run in a shell.
- **Coverage:** `docs/coverage/tunnel.md` is missing.
- Passing: one h1, one main, no horizontal scroll at 320, no raw img/video/table, no `title=` tooltips or native controls, reduced motion settles (0 running after 3 s), CLS ≤ 0.005, h1 line height 0.92 at 128px, inputs 52px with 17px text and real labels, parity complete, the room stacks under 900px as the plan asks, and both first screens hold the object.

## Fixes (in order)
1. **Take the colour out.** Set `--ac` to ink, or remove it.
   - Make the "open internet" flood a silver-to-white wash (`#f5f5f7 → #fff`) instead of the orange radial gradient, and keep the clip-path wipe, so the room goes from dark to light. Make the drawn phone page's tile grey.
   - Make "→ sharing 3000", "nothing listening" and the status dots grey or white. The green dot in front of the hero URL becomes a white dot.
   - Make "terminal closed" and the code block's URL grey or ink.
   - Make the chapter numbers grey. That also fixes the 2.9:1 contrast.
2. **Delete the "● HANZO SHARE" eyebrow above the h1.** Hanzo's words "hanzo share" are already what the terminal types under the title. If parity needs the exact run, make it the terminal band's label.
3. **Land the first screen fast, with or without JS.** Render the lede and "View Source" visible in the server HTML, and let the h1 cut-in animate from a visible state. Start the typing on arrival instead of at 30% in view, so the URL lands within about 2 s on desktop as it does on phone.
4. **One ask.** "View Source" is already the hero primary and the phone bar.
   - Carry it in a desktop sticky bar after the hero.
   - In their places, "Install the CLI", "View on GitHub" (the same link) and "Deploy to Cloud" become outlined or text links, so each screen has one solid button.
   - Lift the phone bar away before the close so it stops covering "Deploy to Cloud".
5. **Make every control answer.**
   - Give "View Source", "Install the CLI", "See Pricing", "View on GitHub", "Deploy to Cloud" and the "hanzoai" chip a press of scale 0.98.
   - Give the mode switch a hover (ink text on a grey fill) and swap it for the kit `Tabs` with arrow keys.
   - Make the code block copy `hanzo share 3000` only, with the "$" set to `user-select: none`.
6. **Fix the order and give the list an object.** On phone, put the stage between "01 / 06" and "05 / 06", so the URL opens before "It ends when you do". On desktop, move the "A name you can keep" builder up beside fact 02, the fact it acts out, so the middle of the page is not four paragraphs in a column.
