# /ui: James-eye review (third walk)

Reviewed: `main` @ `2586ae4b` (the page's own last change is `6967dabb`, "one real board drives the six chapters…"). Files: `components/pages/apps/UiPage.jsx`, `UiPage.css`, shared `components/v2/x-gauss/*`.
Walked 7 Nov, about 15:45 to 16:30 UTC, on the running dev server, at 1470×801 and at 375×812 (touch, 2× DPR), plus 320 wide. The walk: slow wheel and touch scrolls of half a screen, with a 1.5 s dwell on each stop to see what moves untouched; a 150 ms state log for the first 5.5 s; hover and press probes on 12 controls; a 45-stop Tab crawl; keyboard runs on the Dialog, the menu and the sliders; a layout-shift PerformanceObserver; an h1 box log; console capture over 6 loads; reduced motion; JS off at both widths. `taste.py` OK, `parity.py /ui` text 59/59 and links 2/2, `variety.py` OK. I did not run `motion.mjs`; the frame logs above stand in for it.

Verdict: 7/10
First complaint: "Better. It moves, it's all greys, and nothing sits on top of anything now. But I scroll past the box of buttons and get the same box of buttons again, and all that changes is a little grey line at the bottom. After that it's a black room with a small headline in it, and the end is three grey strips. Nothing on the page is big. And on my phone there are still two black buttons on the first screen saying different things."

The cap applies: `docs/coverage/ui.md` makes claims that are false on the page (see answer 9), so this verdict cannot go above 7 until the card is true.

Fixed since the 6/10 at `c647368`, all re-checked:
- The sliders are drawn (`role="slider"`; arrows, Page keys and drag move them; a hover ring on the thumb). The page has 0 `input[type=range]`.
- The board's Dialog moves focus to Close, keeps Tab inside, closes on Esc and returns focus to "Ship it" (`aria-modal="true"`).
- The menu takes Enter (focus goes to "button"), ArrowDown (to "dialog") and Esc (closes, focus goes back to "Options ▾").
- The swatches are one tab stop with arrow keys.
- The hero pause sits inside the token card (x 1368–1413, y 412–457, inside 973–1432).
- On phone, the chapter pause sits beside the h2 with no overlap (h2 x 16–299, pause x 315–359).
- The board's buttons hover (Ship it #525252 → #262626; Options border → ink). The stars chip is 44px and inverts on hover.
- The dark room types once, then renders "Ship it" into the Hello() card. Copy copies only the two `npx` lines.
- The chapters now act on one real board, not drawings.

## The 11 answers

1. **Does it sell in 5 seconds, and does something move within 1 second?**
   - **Sells: yes.** "Hanzo UI" (52px), "React Component Library" as a mono caption under it, the lede, an ink "GitHub ↗", and a real board of Button, Field, Panel and table beside a token panel.
   - **Within 1 s: only just.** The h1 cut-in plays at first paint, and the right column drifts up 14px. The board, which is the page's idle object, does nothing for its first 1.5 s tick after hydration. In the state log the focus ring first moves at 3.66 s from navigation (FCP 0.87 s), so about 2.8 s after paint at 1470 and 2.1 s after paint at 375. The Dialog opens at about 4.2 s after paint. The menu waits a full cycle (about 9 s), because the script starts on `menu` at k=0 and its first tick lands on `idle`.
   - **The first screen itself.** The h1 sits at y 234 under about 170px of empty white. The grey tray is scaled by Settle to x 10–1460, so its corners nearly touch the screen edges. It reads as a tray of boxes, not a hero.

2. **One thing in, one thing out, or a document?**
   - **Hero to chapters.** The thing that comes in is the thing that just went out. The chapter board (`ShowBoard`) is the hero board again: the same Ship it, Options, Field, Panel and three "in production" rows.
   - **Chapter by chapter.**
     - 01 adds tags and the menu or Dialog. It is good.
     - 02 walks the ring. It is fine.
     - 03 retunes radius and grey. It is visible.
     - 04 changes only a 13px word in the title bar ("chat → console → cloud"). The board does not change.
     - 05 fills 18 tiny cells in the footer strip.
     - 06 outlines one row.

     From 03 to 06 the big object barely changes, and the chapter's change lives in a 56px footer line.
   - **After the chapters.** The page turns back into a document: a dark room (it types once, then holds still), "Paste and ship", "Stop reinventing buttons.", then the "Get UI" strip. That makes 4 quiet blocks in a row.

3. **Does every section hold a real visual object?**
   - **Hero:** yes, a working board and token panel.
   - **Chapters:** yes, but it is the same object as the hero.
   - **Dark room:** yes, a terminal and a rendered button.
   - **Paste:** a shared prompt card.
   - **"Stop reinventing buttons." and "Get UI":** no object. A 26px line sits alone at the left of an empty 1470px band (screenshot at y 5415).

4. **One ask in the sticky header, nothing floating over content? Does scale have rhythm?**
   - **Desktop.**
     - The header ask becomes an ink "GitHub" once the hero ask leaves, and it yields at the close: at y 5200 and 5600 only "View on GitHub" is solid. Good.
     - For the first 1 to 2 s the header shows a solid "Try Hanzo" beside the hero's solid "GitHub" (frames at 0.3 s and 1 s), until it turns outlined.
   - **Phone: fails.**
     - The header ask stays a solid "Try Hanzo" for the whole page. It never becomes "GitHub".
     - First screen: "Try Hanzo" (y 8) and "GitHub ↗" (y 345) are both solid.
     - Close: "Try Hanzo" and "View on GitHub ↗" (y 275) are both solid. That is two verbs, which is the same complaint as last time.
     - The "GitHub →" thumb bar shows at y 758 only around scroll 700 to 800, then leaves the DOM for the rest of the page. So for most of the phone walk the page's own ask is not in the bar.
   - **Scale.**
     - Measured sizes: h1 52px; every h2 and h3 26px (24 and 21px on phone); body 16px; mono 12 to 13px.
     - Nothing on the page is big, and nothing grows or shrinks as you scroll. The "60" in "From init to UI in 60 seconds" is set inline at 26px, so the one figure Hanzo gives is not a figure.
     - The dark room puts a 26px line in about 300px of black.
     - The rhythm is all medium.

5. **Does every hover and press answer, with no jump?** Mostly. With no layout jump (Δy 0 or ±1):
   - hero "GitHub" (ink → #2c2c2e, 0.98);
   - "View on GitHub" (same);
   - board "Ship it" (→ #262626, 0.98);
   - "Options ▾" (border → ink, 0.98);
   - the chapter numbers (#f2f2f2 fill, 0.97);
   - terminal Copy (veil and ring, 0.986);
   - pnpm Copy;
   - stars chip (inverts, 0.98);
   - slider thumb (ring, 0.98);
   - pause (inverts).

   These miss:
   - **Accent swatches:** hover scale 1.08, and press does nothing (it stays 1.08).
   - **"Deploy to Cloud":** the underline darkens on hover, and press does nothing.
   - **Hover tells you nothing.** No hover shows a number or a preview: the swatches don't name their token, and the chapter numbers don't preview.

6. **Overlap, font swap, layout shift?** Clean.
   - **CLS:** 0.0010 over the full desktop walk and 0.0004 over the phone walk. The h1 box held at top 234 and height 60 from first sample to 4 s.
   - **Fonts:** Zen and Zen Mono load, with no visible swap.
   - **Width:** no horizontal scroll at 320, 375 or 1470.
   - **Overlap:** no control overlaps a heading at either width.
   - **Small overlaps inside the demo:**
     - In chapter 01, the open menu covers the `.panel` tag (desktop).
     - On phone, the scrim and Dialog cut through the `.field` tag ("f̶i̶e̶l̶d").
   - **Phone wrap:** "every Hanzo dashboard" wraps to 2 lines in the hero board's table at 375 (row height 44 against 22).

7. **Which reference, and is its motion there?**
   - **apple.com product page:** partly. A sticky board drives the chapters on desktop. But "one panel changes" is mostly a footer line changing.
   - **motion.dev:** yes. The menu and Dialog open on ease-emphasis, the tokens morph radius over 0.5 s, and the asks are magnetic.
   - **synchronized.studio:** absent. Nothing opens into its page.
   - **anthropic launch:** absent. There is no hero figure, and the "60" is not used.
   - **The real feel:** a tidy docs page.

8. **Different from its neighbours?**
   - **The hero idea is its own:** a board that uses itself, with tokens you can drag.
   - **/gui is too close.** Its own top comment describes "five sticky chapters" and "the graphite room is the token editor". /ui has six sticky chapters and a token editor too, so the two library pages (both in PAGES.md group 5) share the same two ideas.
   - **The close is shared.** The "Get UI" strip (License chip, stars chip, Deploy to Cloud) has the same shape as /zap, /treasury, /gui and about 25 other pages that render `License:` through the shared Frame.

9. **Is every one of the 18 parts covered?** The card has 18 headings, but these claims are false on the page:
   - **Part 1, "One solid fill per viewport":** false on phone. The first screen and the close both show "Try Hanzo" and a GitHub ask, both solid.
   - **Part 3, "the board opens its menu and dialog by itself within 1.5 s":** false. The first change is about 2.8 s after paint, the Dialog about 4.2 s and the menu about 9 s.
   - **Part 4, "Sticky ask 'GitHub'":** true on desktop only. On phone the header holds "Try Hanzo" and the bar is gone after about 800px.
   - **Part 8, "press .98 … on every control":** false for the swatches and "Deploy to Cloud".
   - **Part 17, "Blocked network: complete page, no console errors":** 1 of 6 cold loads logged a hydration mismatch ("A tree hydrated but some attributes of the server rendered HTML didn't match"), and the red "1 Issue" badge stayed on screen. The other 5 loads were clean, so the error is intermittent, but it is there.

10. **Banned tells?** None from the hard list:
    - 0 hues (`taste.py` OK);
    - no eyebrow above a headline (the mono caption is below the h1);
    - no springs;
    - no Inter;
    - no gradient text;
    - no browser-default control;
    - nothing floating over content on desktop.

    Near misses:
    - **"In your face" is not the problem; flatness is.** Every heading is 26px.
    - **Literal colours.** The page CSS uses hex values that are not in the deck: `#f5f5f7` (the render card), `#0a0a0b`, `#1d1d20`, `#2c2c2e` and `#86868b` (MASTER part 7: tokens only, no literal hex). They pass the chroma check but are Apple's greys, not Hanzo's.

11. **Is the copy untouched?** Yes. Parity is text 59/59 and links 2/2. The added strings are demo labels ("Field", "Panel", "Options ▾", the `.button`/`.panel` tags, "chat/console/cloud") and they are listed as copy questions on the card.

## Missing from the 18 parts
- **1 Strategy.** There are two solid fills on the phone's first screen and at its close.
- **3 Narrative.**
  - The hero is a hand-built `LineMask` block, not `PageHero`.
  - The next idea repeats the hero object.
  - The page ends on three blocks (Paste, Stop, Get UI), not one proof strip and one `Band`.
  - The board's first idle act lands after 2 s.
- **4 Conversion.**
  - The phone header never carries the page's ask.
  - The phone thumb bar appears for about 100px of scroll, then leaves the DOM.
- **6 Content.** "every Hanzo dashboard" wraps in the hero table at 375.
- **7 Visual.**
  - Non-deck literal greys (#f5f5f7, #86868b, #1d1d20, #2c2c2e, #0a0a0b) and literal shadows in page CSS.
  - The hero is still three nested boxes (grey tray, white board, white token card), with the tray scaled to within 10px of the screen edges at load.
  - The page differs too little from /gui.
- **8 Components.**
  - The swatches and "Deploy to Cloud" have no press state.
  - Hover never carries information.
- **9 Motion.**
  - The board's script starts on a wasted `idle` tick, so the menu waits about 9 s.
  - In chapters 03 to 06 the change sits in the footer, not on the board.
  - The dark room holds still after its one typing run.
- **11 Mobile.**
  - The swipe rail is `scroll-snap-type: x mandatory`, where MASTER part 8 says proximity.
  - The board (y 209–730) and the chapter card (from y 754) do not fit on one 812px screen, so you swipe text you can't read while watching a board whose change you can't see. One of the two is always off screen.
- **17 States.** There is an intermittent hydration mismatch with the red dev badge.
- **18 Handover.** The card overclaims (answer 9), and the `V2: 7/10` line is self-scored.
- **Passing:**
  - one h1 and one `main#main`;
  - JS off at both widths (45 text nodes, 0 hidden, terminal at full opacity);
  - under reduced motion, 0 animations after 3.5 s, the board still and the terminal's 12 of 12 lines with "Ship it" rendered;
  - Tab crawl: 45 of 45 stops visible with a ring;
  - CLS of 0.001 or less;
  - no scroll at 320;
  - 44px targets;
  - `data-cta` and `data-thumb` on both asks;
  - parity, taste and variety pass.

## Fixes (in order)
1. **Make the card true, then make the phone carry one ask.**
   - On phone, the header ask must be the page's ask ("GitHub"), or outlined while a page solid is on screen. That way the first screen and the close each show one solid.
   - Keep the thumb bar present after the hero ask leaves, not just for 100px.
   - Correct the card's "1.5 s", "every control", "one solid" and "no console errors" lines to what the page does.
2. **Stop showing the same box twice.** The chapter board must be a different view of the library, not the hero board again.
   - One option: on desktop, pin the hero board itself and let the chapters act on it.
   - Another: change the chapter board's composition so each chapter changes the board's body, not its footer.
   - In 04, the board itself must become chat, console and cloud (three different real layouts made of the same parts), not a 13px word swap.
   - In 05, let the stylesheet fill across the board.
   - In 06, show the three products.
3. **Give the page one big thing per screen.**
   - Make "60" in "From init to UI in 60 seconds" a 64px figure that counts or settles once (the true value stays in the HTML, tabular numerals).
   - Give the close an object, for example the hero board, settled small beside "Stop reinventing buttons.", so the page ends on the thing it sells.
   - Merge Paste, Stop and Get UI into one closing `Band`, with the strip under it as quiet proof.
4. **Wake the hero inside 1 s.**
   - Start the script on its first real act (the menu) on the first tick, about 600 ms after hydration, then keep the 1.5 s rhythm.
   - Let the tray settle inside the gutters at load (no edge-to-edge scale), so the first screen is not a tray of boxes.
5. **Every tap answers, and says something.**
   - Give the swatches a 0.97 press and a tooltip-free label on hover (the token name and value, e.g. "graphite #404040").
   - Give "Deploy to Cloud" a translateY(1px) press.
   - Let a chapter number's hover preview its chapter on the board.
6. **Finish the edges.**
   - Keep "every Hanzo dashboard" on one line at 375 (shorter row padding, or let the status drop under it by design).
   - Make the rail `proximity`, and on phone show the board's changing part (the footer line or the tagged part) inside the chapter card, so both are on one screen.
   - Swap the non-deck greys for deck tokens: #f5f5f7 → #f5f5f5, #86868b → #737373, #1d1d20 or #2c2c2e → #171717 or #262626, #0a0a0b → #0a0a0a.
   - Find the intermittent hydration mismatch (attributes that differ server versus client on first load) so no load shows the red badge.
