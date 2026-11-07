# /ui: James-eye review

Verdict: 6/10
First complaint: "It's purple. I said greys, silvers, blacks and whites, and here the button, the sliders, the chapter numbers, even 'Nothing invents a colour' are violet, with a blue and a green dot next to them. There's a little label stuck on top of the headline again. And it's the same layout as Sign and Tabs in a different colour."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `86852aa` (since merged to main; main's copy of the page files is identical). Files hash: `4be2e55838b3`
Walked 7 Nov 14:06–14:09 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/ui.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half on desktop, yes on phone. The words are clear: "Hanzo UI" at 162px (line height 0.92), then "The React components powering Hanzo apps" and a violet "GitHub ↗". The title cuts in by line mask (d-sheet-01, frames 3–5). Then the board uses itself, which is the best idea in this group of pages. The focus ring steps from "Ship it" to "Options ▾". The Dialog opens over a grey scrim. The tokens retune, with the radius going 14px → 4px and the accent going violet → ink (d-sheet-01 frames 6–12, d-sheet-02). In the first second after paint, though, only 2 of 25 frames change (max 0.92). The board's first step comes about 1.5 s in, and 6 of 45 frames move in the s0 dwell. At 1470×801 only the top ~240px of the board is on screen: two buttons, the field and the swatches. The Dialog opens across the fold and is cut in half (proof). Phone is better: the board starts at y≈600, and the Dialog and the menu open on the first screen (29 of 69 frames move in the first 3 s).
2. **One in, one out, or a document?** It is one in, one out through the chapters, and then it turns into a document. The six pinned chapters (01/06 to 06/06) hold the words while the specimen beside them swaps, which is the Apple move. Between the hero and chapter 1 there is a still screen (s1, 2/46 frames): the bottom of the board, then about 250px of white. On desktop, pressing the chapter numbers threw the page down (650→1415, 2112→3504), so chapters 03 and 05 are judged from the phone film. After the chapters, the dark room (code and one rendered button) is still (s4, 0/46 frames). Then three closing blocks stack up: "Paste and ship", "Stop reinventing buttons." and the "Get UI" bar, each with its own button.
3. **A real object in every section?** The hero has one: real working components (buttons, field, panel, table, menu, Dialog and a token panel). The chapters are partly wireframes. "Overlays" is a Dialog drawn as two grey bars and a violet block. "One package" is three cards with two grey bars each. "Zero Runtime CSS" is 18 violet blocks, and "Nothing invents a colour" is three violet shapes. Only "Accessible by Default" (a focus ring walking four buttons every 0.7 s) and "One package" (cards hopping on a spring every 1.4 s) run by themselves. The dark room has a code pane and one "Ship it" button, and nothing runs. "Stop reinventing buttons." and "Get UI" have no object.
4. **One ask, sticky after the hero?** Nearly. "GitHub" is the hero ask. After the hero it follows you: on desktop as a bottom pill ("Hanzo UI · search · GitHub →"), and on phone as the thumb bar. Each time the header's "Try Hanzo" goes outlined, so mid-page there is one solid button per screen at both widths. The ends break it:
   - **The first screen** has the header's solid "Try Hanzo", the violet "GitHub ↗" and, right below, the board's violet "Ship it", which reads as a second violet button.
   - **The close (desktop s6)** has three solid buttons on one screen: violet "View on GitHub", black "Deploy to Cloud" and the sticky "GitHub →".
   - **One verb, three looks:** the ask is violet in the hero and the close but black in the sticky bar.
5. **Every hover and press answers?** No.
   - **Dead hover:** "Options ▾" (no press either), the radius and density sliders, the chapter numbers 01/02/04/06, "View on GitHub" in the close and the "hanzoai/ui 8 stars" chip (neither has a press).
   - **No press:** the hero "GitHub ↗" (its magnetic hover works) and "Deploy to Cloud".
   - **Jumps:** the accent swatch hover (scale 1.08) is flagged as a jump. Chapter numbers move the page rather than scrub it.
   - **Phone:** tapping "Ship it" and "Options ▾" on the board showed no visible change. The swatches and Copy answer.
   - **Good:** "Ship it" presses to 0.98 and Copy to 0.92.
6. **Overlap, font swap, layout shift?** CLS is 0 at both widths, the h1 box is steady, and there is no horizontal scroll at 375 or 320. The walker's one overlap is the board's own Dialog over its "Panel" label, and that is the modal doing its job. The phone has real ones:
   - **The thumb bar covers chapter headings at rest:** "Nothing invents a colour" and "Production Tested" sit under "GitHub →" (p-screens-1 frames 4, 6 and 7).
   - **The sticky specimen slices chapter 1's label** in half ("SIGN OFF ON", frame 3).
   - **Two specimens show at once mid-crossfade:** "styled-components / one atomic stylesheet" is ghosted over the "in production" rows (frame 6).
7. **Which reference, and is its motion there?** apple.com product page: yes. The pinned chapters are there, and the desktop bottom pill is Apple's sub-nav with a persistent ask. motion.dev: the Dialog and menu open on a spring (300/30), and the hero button is magnetic. synchronized.studio card-open: absent, because nothing opens into its page. There is no anthropic-style hero figure. The "60" in "in 60 seconds" is coloured, not staged.
8. **Different from its neighbours?** The object is, the page is not. It uses the same template as its Business 2 siblings from the same chat:
   - **The first screen:** a small label over a ~150px "Hanzo X" on the left, a lede and one coloured button on the right, and the product in a grey rounded tray on the fold.
   - **The rest:** numbered chapters on a left rail, one dark room, and a "Get X" bar with License and stars chips and "Deploy to Cloud".

   /sign is this page in blue, /tabs in green and /treasury in dark with gold. Giving each page its own tint is the template recoloured, not "its own idea". James: "It's not just a template." The self-using board is the most original hero in the group, and it deserves a layout of its own.
9. **All 18 parts covered?** No; see below. `docs/coverage/ui.md` is missing.
10. **Banned tells?** Yes:
   - Violet as the UI accent (the file header says "violet accent"). It is on the hero and close buttons, the board's solid button, the sliders, the focus rings, the chapter numbers and kicker, every specimen fill, the "in production" dots, and "init" and "60" in the dark room's headline. Hues measured: violet text 30 and background 29 on desktop, and violet background 65 on phone.
   - Blue and green accent swatches in the token panel. Green strings, blue keywords and a yellow highlight on "npx @hanzo/ui init" in the dark room's code. Green is on the reject list.
   - A "React Component Library" pill with the Enso image, 20px above the h1. Also a violet "COMPONENTS YOUR DESIGN TEAM WILL SIGN OFF ON" kicker above chapter 1's heading.
   - Dead buttons and links (answer 5).
   - Browser-default range sliders, only tinted violet.
11. **Copy untouched?** Yes. Parity is 59/59 for text and 2/2 for links. The 16 added strings are control labels and demo data ("Options ▾", "@hanzo/design tokens", "--radius", "--density", "<Dialog />", ".button/.panel/.field/.table", "aria-* · role · focus", the "Hello()" example). "in production" ×3 restates Hanzo's own "Powers chat.hanzo.ai, platform.hanzo.ai, and every Hanzo dashboard". There is no new claim or number.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:** no `Persona:`, `Goal:`, `CTA:` or metric id in the page header. More than one solid button shows on the first screen and the closing screen (answer 4).
- **2.3 First impression:**
  - With JS off, the h1 shows, but 30 text runs are hidden, including "React Component Library", the lede "The React components powering Hanzo apps" and the "GitHub ↗" button. This fails a P1 row.
  - At 1470×801 only the top ~240px of the board is visible.
  - The page does not end in a Band that repeats the hero ask.
- **2.4 Conversion:** 0 `data-cta`. The close's solid "Deploy to Cloud" is a second verb next to "View on GitHub".
- **2.6 Content:** 5 text runs under 13px on desktop ("terminal", "Copy" and "Agent prompt" at 12.5px). 18 runs under the 14px phone floor, mostly the code pane.
- **2.7 Visual system:** violet (#7c4ddb), the blue and green swatches, and the green, blue and yellow code colours break the 0-hue override.
- **2.8 Components:**
  - Dead hover on "Options ▾", the sliders, the chapter numbers, "View on GitHub" and the stars chip.
  - The sliders are native `<input type="range">` with `accent-color`.
  - The board's menu is `role="menu"` with no arrow keys.
  - 11 bare `:hover` rules (2 in UiPage.css, 9 in the shared Frame.css) and 4 raw `.x-btn` rules (Frame.css).
  - A raw `<table>` and a raw `<img>`, not kit parts.
- **2.9 Motion:** 2 `setInterval` timers (`useEvery` drives the board and specimens). The board loops forever while on screen and never comes to rest. It has no pause control (2.12, WCAG 2.2.2). The chapter numbers jump the page instead of scrubbing. Reduced motion is good: 0 running, still after 3 s.
- **2.10 Media:** the Enso image in the label is a raw `<img>` with no width or height. There is no Hanzo media anywhere else.
- **2.11 Mobile:** the "hanzoai/ui 8 stars" chip is 40px tall (179×40). The thumb bar covers chapter headings at rest.
- **2.12 Accessibility:** contrast under 4.5:1 on the code comments ("# Initialize in any React project", "# Add the components you need", "# Use them") at 3.9:1, and on "Hello()" at 3.3:1. There is no pause control for the self-running board.
- **2.16 Developer experience:** the dark room's single Copy copies the shell lines and the JSX together (`npx @hanzo/ui init` … `export function Hello()`), so pasting into a terminal fails. The plan says each block is pure and Copy equals one runnable block.
- **2.17 States:** "8 stars" is typed into the page, with no live read and no "as of" stamp.
- **Coverage:** `docs/coverage/ui.md` is missing.
- Passing: one h1, one main, no horizontal scroll at 320, CLS 0, h1 steady, reduced motion settles, 0 `title=` tooltips, 0 native selects, a sticky ask after the hero at both widths, a real object on the phone's first screen.

## Fixes (in order)
1. **Take the violet out.**
   - Make the hero "GitHub ↗" and the close's "View on GitHub" ink, matching the sticky "GitHub →".
   - Draw the sliders, focus rings, chapter numbers, specimen fills, "in production" dots, "init" and "60" in ink and greys (white and silver in the dark room).
   - Make the four accent swatches ink, graphite, silver and white, so the retune still visibly changes the whole board.
   - Make the code pane's strings, keywords and highlight greys and weight.
2. **Delete the "React Component Library" pill above the h1,** and move "Components your design team will sign off on" off the top of chapter 1's heading. Keep both phrases, but put them where they are not above a headline, for example as the token panel's caption and the chapter rail's label.
3. **Make every control answer.**
   - "Options ▾", "View on GitHub" and the stars chip: a fill or ink shift, an arrow nudge, and a press of scale 0.98.
   - Chapter numbers: a hover (the line grows), and a click scrubs to the chapter instead of jumping.
   - Swatches: a ring that grows instead of a scale that jumps.
   - On phone, a tap on "Ship it" and "Options ▾" must open the Dialog and the menu.
4. **One ask at the close.** Keep "View on GitHub" as the one solid button. "Deploy to Cloud" becomes a text link in the "Get UI" row, and the sticky pill hides while the close's ask is on screen.
5. **Fix the phone chapters.** Give each chapter's text enough bottom room that its heading rests above the thumb bar. Stop the sticky specimen from covering chapter 1's label. Make the crossfade a cut or a slide so two specimens never show at once.
6. **Break the template and show the whole board.** Give /ui a first screen /sign and /tabs don't have, for example the board full width at the top with "Hanzo UI" set as one of its components. Then 1470×801 shows the buttons, field, table and the Dialog opening. Render the lede and the GitHub button visible in the server HTML so JS-off is legible.
