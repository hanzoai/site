# /ui: James-eye review (fourth walk)

Ready: 8 Nov 23:27, copycheck missing 0 of 28 (captured page), Hanzo's images kept. 'View on GitHub' reads as its own line, and Hanzo's Enso art stands beside 'Components your design team will sign off on'. taste/unique/parity OK (59/59); 0 console errors, no overlap at 1470 and 375.

Reviewed: `main` @ `c7106d43`. The page's own last change is `788a0b2a`. Files: `components/pages/apps/UiPage.jsx`, `UiPage.css`, shared `components/v2/Settle.jsx` and `components/v2/x-gauss/*`.

Walked 7 Nov, about 16:15 to 16:55 UTC, on the running dev server:
- **Sizes:** 1470×801 (wheel), 375×812 (touch, 2× DPR), plus 320 and 375×667.
- **Scrolling:** slow steps of 400px with a 2 s dwell at each stop, comparing the DOM at 0.5 s and 2 s to see what moves untouched. I took a screenshot at every stop.
- **Logs:** a per-frame log of the board's state for the first 6 s, plus a log of the h1 box and the font-loading events.
- **Probes:** hover and press on 17 controls, and the chapter-number preview.
- **Keyboard:** two Tab crawls (fast, then at human pace with 600 to 900 ms between presses). I also tested the Dialog's keyboard behaviour.
- **Phone rail:** I swiped the chapter rail through all 6 chapters.
- **Checks:** a layout-shift PerformanceObserver, console capture over 10 cold loads, reduced motion at both widths, and JS off at both widths.
- **Scripts:** `parity.py /ui` reports text 59/59 and links 2/2. `taste.py` OK. `variety.py` OK.
- **Not run:** `motion.mjs`. The frame and state logs stand in for it.

Verdict: 7/10
First complaint: "Now it's alive. The 60 is a proper moment and the chapters actually change the board. But the first thing after the hero is the same box of buttons again, the end shows me the exact product list I saw one screen up, and the little window says 'chat' when it's clearly not chat. And when I tab through the board with the keyboard it throws a dialog at me and I can't get out."

The cap applies, and the walk lands at 7 on its own merits too:
- **Cap.** One claim on `docs/build-notes/coverage/ui.md` is false (part 1, "No dead button"; see answer 9).
- **Merits.** A keyboard trap, and a red error badge for every reduced-motion visitor, keep it under 8 on their own.

Fixed since the 7/10 walk, all re-checked:
- **The board wakes.** The hero menu opens 1.1 s after load at 1470 and 0.9 s at 375. The Dialog opens about 2.4 s later, and the tokens retune after that.
- **The chapters recompose the board.** Chapters 03 to 06 are real different views:
  - 03: an 84px `--radius` readout that retunes;
  - 04: chat, console and cloud layouts made of the same parts;
  - 05: 45 cells filling, 9 at a time;
  - 06: the three products, each lit in turn.
- **"60" is a figure.** It is 112px Air at 1470 and 64px on the phone. It counts up once (32, 42, 51, 55, 58, 60) and the HTML carries 60.
- **The close has an object.** "Stop reinventing buttons." is 64px (40px on the phone), with a board beside it.
- **Phone: one solid per screen.** The page's GitHub asks are outlined, so only the header's "Try Hanzo" is solid.
- **Hover says something.** A swatch under the pointer names its token ("steel #525252"). A chapter number under the pointer previews its chapter: hovering 05 while 01 was active moved the board to "05 / 06".
- **Presses.** Swatches press at 0.97, and "Deploy to Cloud" presses with translateY(1px).
- **Phone rail.** It is `proximity`. The board (y 70 to 438) and the chapter card (y 462 to 754) share one 812px screen in all 6 chapters.
- **Hero table.** "every Hanzo dashboard" stays on one line at 375.
- **Cold-load errors.** 0 console errors and no badge on 8 cold loads in default motion. The earlier hydration error only appears when a screenshot is taken while hydration is running (proved: 1 of 1 early-screenshot loads errored, 0 of 7 without).

## The 11 answers

1. **Does it sell in 5 seconds, and does something move within 1 second?**
   - **It sells:** yes.
     - "Hanzo UI" (52px) with "React Component Library" as a mono caption under it.
     - The lede and an ink "GitHub ↗".
     - A working board beside a token panel.
   - **Something moves within 1 s:** yes.
     - The h1 cut-in and the 14px drift of the right column play at first paint.
     - The menu opens at 2375 ms from navigation (FCP 820 ms, load 1258 ms). On the phone it opens at 2293 ms (load 1380 ms).
   - **It still reads as boxes.** The h1 sits at y 234 under about 170px of empty white. The object is three nested boxes: a grey tray, a white board and a white token card.

2. **One thing in, one thing out, or a document?**
   - **Much better.** On desktop the chapter board sticks and its body recomposes as each chapter reaches the middle.
   - **But the first thing in is the thing that just went out.**
     - Chapter 01 is the hero board again (Ship it, Options, Field, Panel, three "in production" rows) with tags added.
     - Chapter 02 is the same board with a ring walking.
     - So the first two screens after the hero repeat it (desk s03).
   - **The close repeats chapter 06.** It is the same `ShowBoard at={5}` product list, one screen later (desk s10 against s14).
   - **The page trails off after its ending.** Under the closing band come "Paste and ship" (a black card, loud) and then the "Get UI" strip. The page does not end on its band.

3. **Does every section hold a real visual object?**
   Yes, every section has one:
   - the hero board and token panel;
   - the chapter board;
   - the terminal and the rendered button in the dark room;
   - the closing board.

   "Paste" is a shared prompt card. "Get UI" is a strip of chips with no object, which is fine as proof.

4. **One ask in the sticky header, nothing floating over content? Does scale have rhythm?**
   - **Desktop: yes.**
     - The header's "Try Hanzo" is outlined while the hero's "GitHub" is solid.
     - From y 360 the header carries a solid "GitHub".
     - At the close (y 5040 and 5400) only "View on GitHub" is solid.
   - **Phone: half.** One solid shows per screen, but it is the shared header's "Try Hanzo" for the whole page. The page's own ask never sits in the header, and the shared request is still open. Nothing floats over content apart from the shared cookie card, which covers about half of the phone's first screen. That card is shared chrome, not this page.
   - **Scale: yes, now.** The sizes have rhythm:
     - h1 52px;
     - 26px section heads;
     - the 84px radius readout in chapter 03;
     - the 112px "60" in the dark room;
     - the 64px closing line.

     One big thing shows per screen.

5. **Does every hover and press answer, with no jumps?** Yes, all 17 probed controls answer, with Δy of 1px or less:

   | Control | Hover | Press |
   |---|---|---|
   | Hero GitHub and View on GitHub | #0a0a0a → #262626 | 0.98 |
   | Board "Ship it" | → #262626 | 0.98 |
   | "Options" | border → ink | 0.98 |
   | Swatches | 1.08, and the caption names the token | 0.97 |
   | Field | fill darkens | focus ring |
   | Chapter numbers | #f2f2f2 fill and a board preview | 0.97 |
   | Pauses | invert | 0.94 |
   | Terminal Copy | veil | 0.99; copies exactly the two `npx` lines, then shows "Copied" |
   | pnpm and paste Copy | answer | answer |
   | Stars chip | inverts | 0.98 |
   | "Deploy to Cloud" | underline darkens | translateY(1px) |

   - **The miss.** The rendered "Ship it" in the Hello() card is a real `<button>`, focusable (tabIndex 0) with a pointer cursor. Clicking it does nothing (URL and DOM unchanged). It is a dead button.
   - **Smaller.** The shared Copy's hover ink is #48484a, which is not a deck value (shared `Paste`/`Copy`).

6. **Overlap, font swap, layout shift?** Mostly clean.
   - **CLS:** 0.0055 over the desktop walk and 0.0024 over the phone walk.
   - **h1 box:** it held still (top 234, height 60 at desktop; top 164, height 46 at phone) from first sample to 5 s.
   - **Fonts:** Zen and Zen Mono load by about 1.0 s with no visible swap.
   - **Width:** no horizontal scroll at 320, 375 or 1470.
   - **Primary at 375×667:** the hero ask's bottom is at y 397.
   - **Defects inside the demo:**
     - In chapter 01 the open menu covers the `.panel` tag at desktop.
     - On the phone, the closing board's fixed 268px body clips the third product tile. "every Hanzo dashboard" sits flush against the board's bottom with its corners cut (phone s08 and s09).
     - Chapters 03 and 04 leave about 120 to 170px of blank white at the bottom of the 404px board body.

7. **Which reference, and is its motion there?**
   - **apple.com product page: yes.** A pinned stage where one panel changes, and a big figure in the dark room.
   - **motion.dev: yes.** The menu and Dialog open on ease-emphasis, the tokens morph radius over 0.5 s, the asks are magnetic, and the Tab key presses.
   - **anthropic launch: partly.** "60" is now a hero figure.
   - **synchronized.studio: absent.** It does not apply here; the card marks Morph n/a.
   - **The feel:** a confident product demo, not a docs page.

8. **Different from its neighbours?** Mostly.
   - **Its own hero idea:** a board that uses itself, with tokens you can drag.
   - **/gui shares the skeleton.** It has a live hero object, sticky chapters and a token editor, so the two library pages still share their structure. The hero media differ: four device frames on /gui, one component board here.
   - **The "Get UI" strip is the shared Frame strip,** the same as on about 25 other pages.

9. **Is every one of the 18 parts covered?** The card has 18 filled parts, and its other claims checked true on the walk:
   - 1.0 s wake;
   - 268px phone body, with board and card on one screen;
   - no wrap at 375;
   - copy equals display;
   - "60" counts once;
   - presses and hover labels;
   - inert chapter boards;
   - CLS under 0.01;
   - parity 59/59.

   Problems with the card:
   - **False, part 1, "No dead button":** the Hello() "Ship it" is a focusable `<button>` with a pointer cursor and no action. MASTER part 1 says a button with no destination is hidden, never looped.
   - **Incomplete, part 17:** the card says the old hydration error is "unverified" and comes from shared parts. It is now verified, and it is deterministic under reduced motion:
     - Each reduced-motion load (2 of 2 at 1470, 1 of 1 at 375) logs "A tree hydrated but some attributes … didn't match".
     - The diff is `transform: "none"` against `"translateY(10px)"`, `transform-origin: "50% 0%"`.
     - It comes from `Settle`, which reads `useReducedMotion()` in render.
     - The red "1 Issue" badge stays on screen.
     - This page wraps its hero in `Settle`, so every reduced-motion visitor to /ui gets the error. That fails DONE item 3 in that mode.
   - **Unclaimed, part 12:** "Keyboard reaches every control" is true only by luck of timing (answer 10b).

10. **Banned tells?** None from the hard list:
    - 0 hues;
    - no eyebrow above a headline;
    - no springs;
    - no Inter;
    - no gradient text;
    - no browser-default control;
    - nothing floating over content on desktop.

    Rule breaks that are not on the banned list:
    - **a. The h1 has `white-space: nowrap`** (`.ui-h1`), which MASTER part 12 forbids. It fits at 320 today.
    - **b. A keyboard trap in the hero board.** The self-running script keeps going while keyboard focus is on the board. At human Tab pace (600 ms), it went like this:
      1. Tab reaches "Ship it". The script opens the Dialog by itself.
      2. The next Tab lands on the Field. Its `onFocus` sets `mine`, and the Dialog's focus trap pulls focus into "Close".
      3. The next 14 Tabs (about 8.4 s) all stay on "Close", until the 8 s `mine` timeout lets go.
      4. The Field is skipped.

      In the fast crawl, 55 Tab presses in a row stayed on "Close". A keyboard visitor who never asked for the Dialog gets it, and gets stuck in it.
    - **c. The window title bar says "chat" when it isn't chat.** It reads "chat" in chapters 01, 02, 03, 05 and 06 and on the closing board. `APPS[0]` is the default; only chapter 04 changes it.
    - **d. Literal hex values in the page CSS.** They are all deck values, but MASTER part 7 says tokens only.

11. **Is the copy untouched?** Yes.
    - Parity is text 59/59 and links 2/2.
    - The demo labels are listed as copy questions on the card: "Field", "Panel", "Options ▾", the `.button`/`.panel` tags, "chat/console/cloud", "Tab", "/ 45".

## Missing from the 18 parts
- **1 Strategy.** The dead "Ship it" button in the Hello() card.
- **3 Narrative.**
  - Chapters 01 and 02 repeat the hero composition.
  - The closing board repeats chapter 06.
  - The page ends Band → Paste (black card) → Get UI, not proof → Band → footer.
  - About 170px of empty white sits above the h1 at desktop.
- **4 Conversion.** On the phone the header never carries "GitHub". This is a shared request, still open.
- **7 Visual.**
  - The hero is three nested boxes (tray, board, token card).
  - The page CSS uses literal hex, not tokens.
  - The "chat" title bar mislabels five of the six views.
- **8 Components.** The rendered "Ship it" has no action. The shared Copy hover is #48484a.
- **9 Motion.** The board's self-running script does not yield to keyboard focus.
- **11 Mobile.** The closing board clips its third tile at 375.
- **12 Accessibility.**
  - The keyboard trap in the hero Dialog, and the Field skipped in the Tab order.
  - `white-space: nowrap` on the h1.
- **17 States.** Under reduced motion every load hydrates with a mismatch and shows the red badge (`Settle`).
- **18 Handover.** The card overclaims part 1, and the `V2: 7/10` line is self-scored.
- **Passing:**
  - one h1 and `main#main`;
  - JS off at both widths (h1 present, 0 hidden or faint text nodes, no horizontal scroll);
  - reduced motion: 0 running animations after 3.5 s, the board still, the terminal 12 of 12 lines with "Ship it", "60" as is;
  - every Tab stop visible with a 2px ring once it scrolls into view (B crawl);
  - CLS under 0.01;
  - no scroll at 320;
  - 44px targets;
  - `data-cta` and `data-thumb` on both asks;
  - parity, taste and variety pass.

## Fixes (in order)
1. **Stop the keyboard trap.**
   - Freeze the hero board's script (`mine = true`) as soon as focus enters the board (`onFocusCapture` on `.ui-board` and `.ui-tok`).
   - Only trap Tab inside the Dialog when the visitor opened it themselves (a click or Enter on "Ship it"). Never trap it when the script opened it.
   - Re-crawl at human pace: Ship it → Options → Field → Pause → swatches → sliders, with no stop on "Close" unless you opened it.
2. **Kill the reduced-motion hydration error on this page.**
   - Render `Settle`'s reduced-motion branch only after mount (the same style on server and first client render), or drop `Settle` from the hero. It only lifts 10px here.
   - File the fix to `Settle`'s owner in `docs/build-notes/requests/ui.md`.
   - Check that a reduced-motion cold load shows no badge at both widths.
3. **No dead button.** In the Hello() card, make "Ship it" a non-interactive render: a `span` styled as the button, or `inert`/`aria-hidden` on the card. Otherwise give it a real answer, for example opening the same Dialog. Then correct part 1 on the card.
4. **Stop showing the same thing twice.**
   - Chapter 01 must not be the hero board again. Recompose its body the way 03 to 06 already are, for example the two real components open side by side with their tags, and the class-only parts as a quiet row.
   - Chapter 02 should be the keyboard path drawn on a different arrangement.
   - The closing board must not be chapter 06 again. Use a view the visitor has not seen, or the hero board itself, settled small with its tokens at rest.
5. **End on the band.** Move "Paste and ship" and the "Get UI" strip above "Stop reinventing buttons.", so the order is proof, then the band, then the footer. Make the Paste card quiet: on paper, not a black card next to the ending.
6. **Fix the craft edges.**
   - Make the title bar name the view, or drop the word outside chapter 04 (no "chat" on a token readout).
   - Give the phone's closing board body enough height or bottom padding that the third tile is whole.
   - Trim the blank space at the bottom of chapters 03 and 04, or vertically centre their views.
   - Remove `white-space: nowrap` from `.ui-h1`.
   - Pull the h1 up so less than 170px of empty white sits above it.
   - Flatten the hero to one surface: the tray, or the board and card, not both.
