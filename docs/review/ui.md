# /ui: James-eye review (re-review)

Verdict: 6/10
First complaint: "The top's good now. It's alive and it's all greys. Then it turns into the same page as Sign and Treasury: a sideways label, numbers down the side, and a big grey box with a little drawing of the buttons you've just shown me for real. Those sliders are just the browser's sliders. And on my phone there's a pause button sitting on top of a heading."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `c647368`. Files hash (UiPage.jsx, UiPage.css, app/ui/page.jsx, Scale.css, Settle.jsx, x-gauss/*, Frame.jsx): `4c87a2d0ce71`. The page's own files last changed in `86b4125` (the "JAMES.md pass"). Shared pieces changed while I walked: x-gauss PinChapters (`00b5029`, `ffe7921`, `c647368`), Frame.css greys (`4b53974`) and Ask.jsx (`c647368`). Every finding below was re-checked on `c647368`.
Walked 7 Nov 14:13–14:45 UTC on the dev server at 1470×801 and at 375×812 (touch, 2× DPR). I recorded screencasts, frame bursts 150 ms and 400 ms apart, per-screen stills, a frame-difference log and a layout-shift observer. The cookie note was skipped.
Since the 6/10 at `86852aa`, these are fixed:
- the violet, and the blue, green and yellow code colours;
- the label above the h1 (it now sits below);
- JS-off legibility;
- `data-cta` and the `Persona:`/`Goal:`/`CTA:` header;
- the pause controls;
- the raw `<table>` and `<img>`;
- hover on the chapter rail;
- the coverage file.

Proof: `img/ui.jpg` (desktop first screen with the board's Dialog open | phone first screen with the board's menu open).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes.
   - **Desktop.** "Hanzo UI" is 161.7px with a 0.92 line height. Beside it are "The React components powering Hanzo apps" and an ink "GitHub ↗". All three paint at first paint (about 0.9 s). The title cuts in by line mask and is set by about 2.0 s.
   - **The board.** It uses itself every 1.5 s: the menu opens, then the Dialog over a scrim, the focus ring walks and the tokens retune (radius 14 → 4 → 22, ink → graphite → steel). In the idle log, 7 of 11 intervals of 0.4 s change.
   - **Desktop fit.** At 1470×801 the board is 325 of its 436px on screen (y 476–801), and the Dialog fits (y ≈ 595–791).
   - **Phone.** The board starts at y 513 and the menu and Dialog open on the first screen.
   - **The catch.** The h1 is server-rendered out of its mask. On a 4× throttled phone (dev build) "Hanzo UI" lands 3.3 s after first paint, after the board and the pill.
2. **One in, one out, or a document?** One in, one out through the six pinned chapters: the words cross-fade and the specimen swaps. On desktop, between the board and chapter 1 sits about one still screen: the board's tail, about 300px of white, a floating pause and the start of the vertical label. After the chapters it becomes a document again:
   - a still dark room;
   - "Paste and ship";
   - "Stop reinventing buttons.";
   - the "Get UI" bar.
3. **A real object in every section?** The hero has the best one in this group: real working Button, Field, Panel, list, DropdownMenu, Dialog and a token panel.
   - **Chapters.** Wireframes in a 787×540 grey box: a Dialog drawn as two grey bars and a black block, three app cards of grey bars, a "Tab" key under four pills. About 85% of the box is empty. Only "Accessible by Default" (focus walks every 0.7 s) and "One package" (cards hop every 1.4 s) move.
   - **Dark room.** A code pane and one "Ship it" in a light card; nothing runs.
   - **Close.** "Stop reinventing buttons." and "Get UI" have no object.
4. **One ask, sticky after the hero?** Mid-page yes: the "Hanzo UI · search · GitHub →" pill on desktop, the thumb bar on phone, with the header outlined. The ends break it:
   - **First screen.** Next to the ink "GitHub ↗" sits the board's ink "Ship it" (97×50 at y 509 desktop, y 546 phone). At a squint these are two black pills 200px apart.
   - **Second screen (y 681).** No page ask is on screen. Only the header's solid "Try Hanzo" shows, because the bar has not arrived yet.
   - **The close.** On desktop the solid "View on GitHub" (y 536) and the bar's solid "GitHub →" show together. On phone the bar steps aside, but the header's "Try Hanzo" turns solid, so the screen holds two solid buttons with two verbs.
5. **Every hover and press answers?** Mostly. These answer:
   - hero "GitHub" (ink → #2c2c2e, arrow nudge 3px, press 0.98);
   - the ask bar;
   - "View on GitHub";
   - "Deploy to Cloud" (outline → ink border and veil);
   - the rail numbers (ink, line grows, press 1px);
   - "Copy";
   - the dark room's "Ship it" (1.04 hover, 0.95 press).

   These do not:
   - **No hover:** the board's "Ship it" and "Options ▾" (press 0.98 only).
   - **No press:** the accent swatches (hover scale 1.08).
   - **Neither:** the "hanzoai/ui 8 stars" chip.
   - **Native browser sliders:** the radius and density sliders, on the first screen.

   Keyboard (desktop):
   - **Dialog.** Enter on "Ship it" opens it, but focus stays on "Ship it" behind the scrim. Tab goes to "Options ▾" behind the scrim, Esc does nothing, and there is no `aria-modal`.
   - **Menu.** "Options ▾" opens it, but ArrowDown doesn't enter it, Esc doesn't close it, and the items aren't focusable.
   - **Accent swatches.** The `radiogroup` takes 3 tab stops and the arrow keys do nothing.

   On the page that says "focus management, keyboard behaviour … that CSS cannot", the demo's own Dialog and menu have neither. Touch taps on the board work.
6. **Overlap, font swap, layout shift?**
   - **Clean.** CLS is 0.0000 over full walks at both widths. The h1 box is steady, there is no font swap, and there is no horizontal scroll at 320 or 375.
   - **Phone overlap.** The chapter pause (44px, x 315–359) sits on top of the section title "Components your design team will sign off on" (top 1416). The title is `nowrap`, so it clips at the screen edge: "…will s[II] of" at 375 and "…team [II] s" at 320.
   - **Desktop overlap.** The hero pause (x 1412–1457, y 460–505) covers the token card's top-right corner, which runs to x 1441 from y 476. About 28px still overlaps at rest.
   - **Desktop orphan.** The chapter pause floats 11px under the header and 60px above its box (pause y 71, box y 131).
   - **Phone cuts.** Chapter headings slide under the sticky specimen and are cut through the letters: "Overlays are compone…" at y 1442 and "One package, everywh…" at y 2442.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The pinned chapters and the bottom pill (sub-nav with a persistent ask) are there.
   - **motion.dev:** yes. The Dialog and menu open on a 300/30 spring, the hero ask is magnetic and the board's radius morphs over 0.5 s.
   - **synchronized.studio:** absent. Nothing opens into its page.
   - **anthropic launch:** no hero figure. The "60" in "in 60 seconds" could be one.
8. **Different from its neighbours?** The hero is now the only light hero in the group with a working component board, and that is its own idea. The arrangement is not:
   - **The hero.** Giant name left, lede and ask right, object tray on the fold line: the same as /treasury and /zap, in light.
   - **The middle.** The same PinChapters as /risk, /sign, /tabs and /treasury: a vertical 13px mono label up the rail, 01–06, words left, a 28px-radius grey box on the right with a small drawing in it.
   - **The close.** The same "Get X" bar (License chip, stars chip, Deploy to Cloud) as /treasury and /zap.
9. **All 18 parts covered?** No; see below. `docs/coverage/ui.md` exists but overclaims:
   - "One solid per viewport" is false at the close.
   - "The dialog is role=dialog" is a role without the behaviour.
   - The Enso picture is not "Hanzo's Enso mark".
10. **Banned tells?** Two items from the reject list:
    - **Browser-default controls:** the two `<input type="range">` (appearance auto, `accent-color` ink) on the first screen.
    - **Overlap at 375×812:** the pause on the chapter title (answer 6).

    Also:
    - **Dead controls:** the stars chip, and no hover on the board's buttons.
    - **The pill under the h1.** "React Component Library" is still a pill (13px mono, on the card colour, 12px under the h1). It is not an eyebrow now, but it is a badge. Its icon is now the Enso model's art (`/models/enso.webp`), not live's "blocks" icon.

    Clean:
    - **No UI hue:** 0 saturated colours in `main`, and the code pane is greys only.
    - **No eyebrow above any headline.**
11. **Copy untouched?** Yes. Parity is 59/59 for text and 2/2 for links on `c647368`. The added strings are demo labels and data ("Options ▾", "@hanzo/design tokens", "--radius", "--density", "<Dialog />", ".button/.panel/.field/.table", "aria-* · role · focus", "Hello()", "in production" ×3). "in production" restates Hanzo's "Powers chat.hanzo.ai, platform.hanzo.ai, and every Hanzo dashboard". There is no new claim or number.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 / 4 Common gate.** The `Persona:`, `Goal:`, `CTA:` and metric header is present, but two solid buttons show on the close at both widths (answer 4). The header comments are stale:
  - UiPage.jsx line 3 still says "violet accent".
  - UiPage.css line 1 still says "violet".
  - There is no PageHero or Band.
- **2.3 First impression.**
  - The h1 is painted out of its mask until hydration, so on a slow phone it arrives last.
  - The page ends in three stacked blocks (Paste, Stop, Get), not one Band repeating the ask.
- **2.4 Conversion.** The close shows two solid buttons (answer 4). `data-thumb` is only on the hero, so the bar does not yield to "View on GitHub".
- **2.6 Content.**
  - "in production" wraps to two lines at 375, in the hero board ("● in / production") and in chapter 6.
  - The desktop section title is 13px mono set vertically (`writing-mode: vertical-rl`, 366px tall), and it is clipped under the header as the pin releases.
  - On desktop, "terminal", "Copy" and "Agent prompt" are 12.5px, under the 13px floor (shared Frame.css). The phone floor passes, except code at 13.5px, which CANON allows.
- **2.7 Visual system.** Three nested boxes in the hero: a grey 28px tray, a white board and a grey panel. At load the tray is scaled edge to edge (x 0–1470), with its corners at the screen edges.
- **2.8 Components.**
  - Native range sliders.
  - The Dialog has no focus move, trap, Esc or return.
  - `role="menu"` has no arrow keys or Esc, and its `li` items are not focusable.
  - The `radiogroup` has no arrow keys.
  - 2 bare `:hover` rules (UiPage.css lines 19 and 34).
  - The stars chip has no states.
- **2.9 Motion.**
  - The mix is good. Idle: the board, the focus walk, the package hop and the caret. Pointer: magnetic, swatches. State: the Dialog, the menu and the token retune. Scroll: Settle and the pinned chapters. Arrival: the cut-in. Scroll is well under half.
  - The dark room is still.
  - 3 `setInterval` loops (1.5 s, 0.7 s, 1.4 s), gated by view and pause.
  - The "Paste and ship" caret blinks forever, with no pause.
  - Reduced motion is good: the board stays still, the h1 is in place, and 0 animations run after 3 s.
- **2.11 Mobile.**
  - The pause overlaps the title (answer 6).
  - The "hanzoai/ui 8 stars" chip is 40px tall, under 44.
  - Headings are cut by the sticky specimen.
- **2.12 Accessibility.**
  - "Hello()" is 3.33:1 (#86868b on #f5f5f7).
  - The board's Dialog and menu keyboard paths (answer 5).
- **2.16 Developer experience.** The init pane's one Copy copies the shell lines and the JSX together, so a paste into a terminal fails.
- **2.10 Media.** No Hanzo media beyond the swapped 24px Enso picture. That is fine for a UI page, but the picture ties the library to a model it isn't.
- **Shared, not the page's fault:**
  - No sound kit exists yet.
  - The footer's "Privacy choices" toggle is blue.
  - One hydration error appeared once, during a mid-merge reload, and did not reproduce in 3 clean loads.
- **Passing:**
  - one h1 and one main;
  - 0 hues;
  - no eyebrow above a headline;
  - CLS 0;
  - no horizontal scroll at 320 or 375;
  - JS off legible at both widths (0 hidden runs);
  - reduced motion settles;
  - `data-thumb` and `data-cta` on the hero, and `data-cta` on the close;
  - a sticky ask after the hero;
  - touch works on the board;
  - parity clean.

## Fixes (in order)
1. **Clear the two items from the reject list.**
   - Draw the radius and density sliders yourself: a hairline track, an ink fill, a 20px thumb with a hover ring and a 0.98 press, keeping the labels and the value readouts.
   - On phone, take the chapter pause off "Components your design team will sign off on". Put it inside the specimen box's corner, and let the title wrap instead of `nowrap`, so nothing overlaps or clips at 375 or 320.
   - On desktop, put the chapter pause inside its grey box, not under the header.
   - Move the hero pause into the board's own corner (or the tray gutter) so it stops covering the token card.
2. **Make the demo do what the copy says.**
   - Dialog: on open, move focus to it, trap Tab, close on Esc and on Close, and return focus to "Ship it". Add `aria-modal="true"`.
   - Menu: arrow keys, roving `tabindex` on the items, Esc closes it and focus returns to the trigger.
   - Accent swatches: one tab stop with arrows.

   A developer will press Tab on a page titled "Accessible by Default".
3. **One solid at the close.** Put `data-thumb` on "View on GitHub" (or make the bar treat it as its twin), so on desktop the bar steps aside and on phone the header stays outlined. On the first screen, start the board on the graphite or steel token, so the only ink pill is "GitHub".
4. **Let the chapters use the real board, not drawings.** Pin the hero's board, or a copy at full size, and let each chapter act on it:
   - 01 opens the real Dialog and menu, with the .button/.panel/.field/.table tags on the parts that are CSS;
   - 02 walks focus through the real controls;
   - 03 retunes the real tokens, so the Beyond lands where its words are;
   - 04 shows the same board as chat, console and cloud;
   - 05 shows its one stylesheet;
   - 06 shows its three live rows.

   This also breaks the shared PinChapters look (vertical label, grey box, small drawing) that /risk, /sign, /tabs and /treasury all have.
5. **Wake the dark room.** Once, in view and pausable:
   - type `npx @hanzo/ui init` and `add …`;
   - render "Ship it" into the Hello() card when `return <Button>` lands.

   Split Copy into the shell block and the JSX block. Lift "Hello()" to 4.5:1 or better.
6. **Finish the edges.**
   - Keep "in production" on one line at 375.
   - Make the stars chip 44px, with a hover (ink border) and a 0.98 press.
   - Give the board's buttons a hover.
   - Restore live's icon on "React Component Library" or drop the picture.
   - Fix the stale "violet" comments.
   - Server-render the h1 in place, so a slow phone shows the name first.
