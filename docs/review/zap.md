# /zap: James-eye review

Verdict: 6/10
First complaint: "The top is good. The little pointer jumps while the JSON crawls along, and I get it straight away. Then I scroll and it goes dead: half a screen of nothing, eight grey boxes that all look the same with nothing in them, a text diagram whose lines don't even meet, and a pile of buttons at the bottom. It's a document again. As you scroll, one thing should come in and one go out."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `8ab6fa7`. The zap files are as of `cabe6e2`, which merged `b744202` "zap: JAMES.md pass" with main's 14:30 fixes (no fade on the hero asks, 14px phone floor for the label and counters). Files hash: `5a8ffb064192`.
Walked 7 Nov 14:05–14:40 UTC on the dev server, moving, at 1470×801 and 375×812 (touch). The walk used screencasts, 150 ms frame bursts per screen, a frame-difference motion log, a layout-shift observer, hover and press probes, the sheet and keyboard, JS off, and 320px. The cookie note was skipped. The headless browser reports `hover: none`, so rules inside `@media (hover: hover)` were read from the CSS rather than seen.
Proof: `img/zap.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly yes, and the hero is the page's best part.
   - **Desktop:** "ZAP" sits at 220px with a 0.8 line height (it reads like a logo), "The wire format is the data structure" sits beside it, and below them is one solid "Read the docs" with two outlines. The wire is on the first screen: the buffer lane and the first line of the JSON lane. The pointer jumps and the JSON highlight walks by itself, starting 120 ms after mount. The "Read a field" chooser is below the fold.
   - **Phone:** the title, label, lede and three buttons, then the top of the buffer from y≈640. The JSON lane, which is the half that tells the story, is below the fold.
   - **Risk:** the h1's line-mask rise waits for hydration, and the server HTML holds the line at `translateY(108%)`. On the dev server, "ZAP" was missing from the first screen for 1.3 s on phone and about 4 s on desktop after the HTML arrived.
2. **One in, one out, or a document?** A document after the hero.
   - The only scroll-linked move is the wire's Settle (scale 1.04 to 1, 30px). No h2 cuts in, nothing pins, and nothing hands over.
   - The sections sit 440px apart at 1470 (`.w2-sec` 220px top and bottom). The screens at y≈2160, y≈2880 and y≈4330 are each more than half empty white or grey.
3. **A real object in every section?**
   - **Hero:** yes, the wire.
   - **Why bother:** eight 344×280 grey tiles. Each holds a 10px "header bits" strip and a title, so about 75% of each tile is empty. Their 01–08 numbers are invisible (see 10).
   - **Running:** yes, the typing terminal.
   - **Built:** yes. N:1 / 1:M / 0 at 136px, the ASCII diagram and the fleet counter. But the diagram renders broken: its right edges land at three different x positions (about 585, 595 and 605px inside the box), the Gateway and server boxes don't close, and it sits left in a black panel with about 30% empty on the right.
   - **Point / Read the protocol / Get ZAP:** no object. There is a grey box of text, then chips and outlines. The cursor blinks 4 times and stops.
4. **One ask, sticky after the hero?** Mostly. "Read the docs" (`data-thumb`, `data-cta="zap.hero"`) is solid in the hero and rides in the ask bar from y≈1440 at both widths. It breaks at the close:
   - **Desktop y≈4330:** the bar and the close's solid "Read the docs" are both on screen.
   - **Desktop y≈5050:** the bar yields, the header's "Try Hanzo" turns solid black, and the close's solid "Read the docs" is still on screen.
   - **Phone y≈5850:** the close's solid and the bar's solid "Read the docs" sit 280px apart.
   - The close button has no `data-thumb`, so the bar never steps aside.
   - "Read the docs" goes to three different addresses on the page (quick-start, /docs, docs.hanzo.ai/docs/zap) and "View on GitHub" to two. That is Hanzo's copy, but the ending then stacks 7 actions in 1.5 screens.
5. **Every hover and press answers, with no jumps?** Mostly.
   - **What answers:** press is scale .98 on the asks, outlines, pause and field chips, and .92 on Copy. Packets lift 4px and their "+" turns. The hero ask is magnetic, and its arrow nudges 3px. Figures brighten. The slider re-counts. No layout jumps.
   - **`a.zp-chip2` "hanzoai":** no hover and no press.
   - **Hero ask in the dark room:** its hover fill goes from #f5f5f7 to #fff, which you can't see.
   - **Packet hover:** it turns the ink header bits to #6e6e73, which reads as dimming.
   - **Fleet slider:** a native `<input type=range>` with only `accent-color` (see 10).
6. **Overlap, font swap, layout shift?**
   - **Layout shift:** CLS 0.0135 on desktop (two unattributed shifts while scrolling) and 0.0127 on phone (one at 7.3 s). Both are under the 0.02 budget but not zero.
   - **Font:** the h1 box is steady.
   - **Overlap:** none on load. In passing, the ask bar sits over packet titles 06–07 at desktop y≈1440 and over the terminal's first lines at phone y≈2920.
   - **Load flip:** at both widths the header's "Try Hanzo" paints solid black, then flips to outline once the page hydrates (about 1.7 s on phone).
7. **Which reference, and is its motion there?**
   - **synchronized.studio:** the packets open into sheets with a shared-element morph. That works at both widths, rising from the bottom on phone.
   - **anthropic launch:** half there. N:1 / 1:M / 0 are true hero figures, but the four hero points are 36px text that steps every 3.6 s.
   - **apple.com product page:** not there. Nothing pins, and the screens don't hold one idea at a time.
8. **Different from its neighbours?** Only partly. It has its own object (the wire) and its own Beyond (sidecars versus one daemon). But the first screen is /treasury's composition: a dark room, a giant title on the left, the lede and pills on the right, and a dark product panel on the fold. /ui, /sign and /tabs use the same title-left, lede-right, object-below frame.
9. **All 18 parts covered?** No; see below. `docs/coverage/zap.md` exists, but it claims "one solid per viewport" and "sheets trap focus", and both are false.
10. **Banned tells?** No UI hue was measured in `<main>` at either width, there is no gradient, no green, and no eyebrow above the h1 ("Zero-Copy Agent Protocol" now sits under it). Still:
    - **Browser-default control:** the fleet's `<input type=range>` is the native Chrome track and thumb in ink. This is on JAMES.md's reject list.
    - **Equal boxes:** the eight equal, mostly empty grey tiles are the "equal boxes in a row" look.
    - **Low-contrast dark text:** the unwalked JSON is #48484f on #0c0c0e, about 2.2:1, and the untyped terminal lines sit at opacity .18, about 1.6:1. Both are states, but they read as low-contrast dark text.
    - **Kicker over the sheet title:** each sheet puts a mono "06" above its title. This comes from the shared `OpenSheet`.
    - **Invisible packet numbers:** the 01–08 numbers are `#f5f5f7` on `#f2f2f2`, because `.zp { --acc: #f5f5f7 }` sets the dark room's accent for the whole page.
11. **Copy untouched?** Mostly. Parity is 71/71 text and 7/7 links. But:
    - The terminal collapses Hanzo's aligned spacing: `--name slack  --url` and `--name db     --url` become single spaces.
    - About 10 new demo labels are not in `content/ui-strings.json`: "Read a field", "ZAP · the buffer that arrived", "pointer + offset", "JSON · the same message as text", "characters walked", "Agents you run", "An MCP server beside every agent", "One zapd in front, servers shared", "tool-server processes · N more of each", "…and zapd · none repeated". They paraphrase Hanzo's own sentences and make no new claim.
    - With "struct" chosen, the label reads "1 characters walked".

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / §4 common gate:**
  - What passes: `Persona:`, `Goal:`, `CTA:` and the metric are in the header.
  - Two solids share a viewport at the close (both widths; see answer 4).
  - No `PageHero` or `Band`.
  - The header comments in `app/zap/page.jsx`, `Zap.jsx` (V2 line) and `Zap.css` line 1 still say "electric-cyan accent".
- **2.3 First impression and narrative:**
  - The h1 waits for hydration (see answer 1).
  - The page doesn't end on a Band that repeats the hero ask. It ends on a grey "Get ZAP" box with 2 chips and 2 outlines, after a "Read the protocol" row of 2 more outlines.
  - Three desktop screens are more than half empty.
- **2.4 Conversion:** the close's solid lacks `data-thumb`, so the bar doubles it.
- **2.6 Content:**
  - The ASCII diagram is 9px on phone. It is readable text, not aria-hidden, and well under the 14px floor.
  - On desktop, the 12–12.5px lane labels, "Read a field", "Terminal" and "Copy" are under the 13px micro step.
  - The packet numbers can't be seen.
- **2.7 Visual system:**
  - 42 literal hex values (18 distinct) in `Zap.css` (#0c0c0e, #1c1c20, #2c2c32, #48484f, #a1a1a6…) and ad-hoc durations (.45s, .6s, .35s, .25s).
  - The page-wide `--acc` override (see answer 10).
  - The ASCII box-drawing glyphs don't hold a monospaced grid in Zen Mono.
- **2.8 Components:**
  - The native range input.
  - Three bare `:hover` rules (`.zp-pick button:hover`, `.zp-points button:hover b`, `.zp-packets .w2-oc-card:hover .zp-hdr i.f`).
  - The `zp-chip2` link has no states.
  - The "Read a field" `radiogroup` has no arrow keys or roving tabindex: each radio is its own tab stop.
- **2.9 Motion:**
  - Three `setInterval` loops (`useEvery` for the field cycle, the terminal and the fleet).
  - The JSON walker's `setTimeout` chain ignores reduced motion for its single walk.
  - Scroll motion is only the 4% Settle. Idle, pointer, state and time moves are present, and that part is good.
- **2.10 Media:** no Hanzo media beyond the 26px Enso mark. The product UI carries the page, which is acceptable here.
- **2.11 Mobile:**
  - The "hanzoai" chip is 40px tall (the plan asks for 44).
  - The 9px ASCII.
  - No horizontal scroll at 320 or 375.
- **2.12 Accessibility:**
  - Sheets do not trap focus. Tab from the sheet's close button goes straight to the footer's "Ask Hanzo anything". Esc does return focus to the card.
  - With JS off, the pointer sits over "header" while "text" is the chosen field.
- **2.16 Developer experience:** Copy strips "$ " instead of making it `user-select: none`, and the displayed block no longer matches Hanzo's spacing.
- **2.18 Handover:** the coverage file overstates two rows (see answer 9).
- **Passing:**
  - One h1, one main.
  - JS off is legible at both widths (desktop 0 hidden runs; phone hides only the decorative buffer labels).
  - No raw img, video or table; kit `Img` and `A`.
  - Pause buttons (44px) on the wire, the terminal and the fleet.
  - Sheets open at both widths and return focus.
  - 0 UI hues.

## Fixes (in order)
1. **Make the middle a story, not a document.**
   - Cut the 440px gaps; use `.w2-sec.tight`, or nearer 120–160px between objects.
   - Give each section an arrival:
     - "Why bother", "Four lines…", "How it is put together" and "Point one agent at it" cut in with `LineMask` like the h1.
     - Pin the terminal beside its copy while its four lines type.
     - Cut in or count up N:1 / 1:M / 0 as they arrive.
   - One thing in, one out, per screen.
2. **Rebuild the packets as objects, and fix their numbers.**
   - Scope `--acc: #f5f5f7` to `.zp-hero` so 01–08 render ink.
   - Let the 16-byte header be the tile: full width and tall, the bits filling as each packet lands, and filling the rest on hover instead of turning grey.
   - Or run the eight as one rail, so they stop reading as two rows of four equal empty boxes.
3. **Draw the diagram properly.** Render the same words ("Agent Swarm", "ZAP Gateway", "zap://localhost:9999", the three bullets, the MCP and ZAP servers) as an SVG or HTML diagram whose lines meet, centred in its panel, or give the `<pre>` a font with true monospaced box-drawing. On phone, no 9px text: stack the boxes or let it scroll sideways at 14px.
4. **One solid at the end.**
   - Put `data-thumb="Read the docs"` on the close's solid so the bar steps aside, and keep the header outline while it's on screen.
   - Make "Read the protocol" and the Get ZAP actions one quiet text row.
   - End on a Band that repeats the hero ask.
   - Give `a.zp-chip2` a hover and a .98 press, and make it 44px on phone.
5. **Replace the native slider.** Use a designed track, ideally the process boxes themselves, with an ink thumb, hover and press, 44px, and arrow-key steps.
6. **Make the hero headline paint without waiting for JS.** Drive the "ZAP" rise from CSS on first paint (the `LineMask` in `x-gauss` belongs to the same chat), so the first screen never shows an empty left half. Ask the shared system to start the header dark (and its ask outlined) when the first section is `data-room="dark"`, so a white bar doesn't box the dark room and "Try Hanzo" doesn't flip at load.
7. **Fix the sheet.** `OpenSheet` is owned by the Business 2 chat. Trap Tab inside it, and move the "06" kicker below or beside the title.
8. **Copy hygiene.**
   - Restore the terminal's original spacing.
   - Register the demo labels in `content/ui-strings.json`, or cut them to what the object needs.
   - Fix "1 characters walked".
   - Delete the stale "electric-cyan" comments.
   - Correct the two false rows in `docs/coverage/zap.md`.
