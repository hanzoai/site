# /templates: James-eye review
Ready: 9 Nov, live copycheck missing 0 of 75 after Hanzo's update. The list is live's 29 templates in live's order (17 new, among them Instrument, Fernline, Warp Tunnel and Emptykit) with its 11 kinds (new: 3D & Shaders, AI/SaaS, App, Component Library), every preview Hanzo shows. On wide screens the sideways shelf now runs as two rows (10 previews on screen, page 8,027px instead of 17,091px), past twelve the dot row gives way to the 01 / 29 count and arrows, and the arrows sit right so a long kind and name never meet them. taste, parity (96/96, 45/45) and unique OK; 0 console errors, no overlap at 1470 and 375.


Verdict: 7/10
First complaint: "That's the same layout as Gallery: big title on the left, button on the right, a grey box with a pause button. Then I scroll and get the same twelve sites again as a wall. And the windows at the back of the deck all print their 'Edit in Hanzo' buttons on top of each other on the right."

Walked 7 Nov, about 16:00–16:49 UTC, on the dev server at http://localhost:4180/templates/. The tree was at `b484e9d` plus uncommitted work, and other pages were being edited at the same time.
- **Sizes:** 1470×801 (fine pointer) and 375×812 (touch), plus 320×640.
- **Load:** screenshots at 150, 600, 1000, 2000 and 4200 ms after load.
- **Scroll walk:** half-screen steps with 0.7 s dwells.
- **Measurements:** an idle check of the deck over 8 s with no input, a PerformanceObserver for layout shift, and the h1 box sampled every frame for 3 s.
- **Controls:** computed styles at rest, hover and press for ten controls; four mouse drags across the front preview; the arrow keys; the kind filter; a wall tile opened into its sheet and closed with Esc; Copy read back from the clipboard; "+25 more".
- **Modes:** JS off, reduced motion, and `scripts/motion.mjs /templates` (film at `shots/templates/`).

Hanzo's preview images (hanzo.ai/templates/*.webp) are blocked in this sandbox: every request fails with ERR_TUNNEL_CONNECTION_FAILED. What I judged is what a blocked visitor sees: the grey drawn page under each preview.

## The 11 answers

1. **Does it sell in 5 seconds, and does something move within 1 second?** Yes.
   - **Desktop:** the h1 "Start from a product." (52px) cuts in. The address bar types `drive.hanzo.app` from 0.25 s. The front preview drifts on a 14 s loop. The deck deals forward by itself (`01/12 → 02/12` by about 3.6 s, then `03/12`).
   - **Above the fold:** at 1470×801 the front preview spans y 494–949, so 67% of it is on the first screen. At 375×812, 269px of preview shows (y 482–751).
   - **What a blocked visitor sees:** a grey wireframe with the template's name in 84px type. On the real site this will be Hanzo's screenshot.
2. **One in, one out, or a document?** Better than before, but the middle repeats.
   - **The order:** deck, then a wall of twelve, then the dark setup room, then the closing band.
   - **The wall:** it deals in once by a clip-path wipe, 60 ms apart, and a ring follows the deck's front card (an "←" after the title). It is still the same twelve sites the deck just showed.
   - **Wall size:** 4×3 tiles over about 1.6 screens on desktop and about 3 screens on phone. After the wipe it has no idle motion (motion.mjs, screen 2: 0 pixel changes).
   - **The dark room:** the terminal lines come in again each time the room enters view.
3. **A real visual object in every section?** Mostly.
   - **With an object:** the deck, the wall and the terminal.
   - **Without:** the closing band is a name, an address and a button, with no object.
   - **Stand-ins:** with images blocked, every object is a drawn grey page. That reads as a wireframe kit, not twelve products.
4. **One ask in the sticky header, nothing floating, and scale with rhythm?** Mostly on desktop, not yet on phone.
   - **Desktop header:** it switches from "Try Hanzo" (outlined at the top) to "Edit in Hanzo" once the hero ask has scrolled away. Good.
   - **Phone, first screen:** the header's "Try Hanzo" is a solid black fill (rgb 10,10,10) beside the page's solid "Edit in Hanzo". That is two black buttons on the first screen.
   - **Phone, further down:** the header never changes to "Edit in Hanzo". The shared "Edit in Hanzo" bar floats over the dark room's terminal.
   - **Scale:** the h1 is 52px, the readout 21px, tile titles 17px, and the sheet title 26px.
   - **Too much big type on the wall:** each stand-in tile draws its name at about 40px, so twelve big words show at once. That is a stand-in artefact, but it is what a blocked visitor gets.
5. **Does every hover and press answer, with no jumps?** Yes, with small gaps.
   - **Asks:** the hero and band asks fill #0a0a0a → #262626, the arrow moves 3px, and press scales to 0.98. Both are magnetic.
   - **Deck controls:** the arrows grow 1.05 on hover and press to 0.98. The card ask's border turns ink on hover and it presses to 0.98. The pause inverts and presses to 0.94.
   - **Tiles:** they lift 4px, but press only scales to 0.997, which you cannot see.
   - **Copy:** hover and press work, and it copies exactly `hanzo login\nhanzo template list\nhanzo template get drive\nhanzo dev`.
   - **Weak:** the kind chips change text colour only. motion.mjs marks the dark room's agent marks ("A") and one back-card "Edit in Hanzo" as dead hovers.
   - **Drag:** 4 of 4 mouse drags across the front preview advanced the deck (01→05) and never left /templates. ArrowRight on the deck advanced it too.
6. **Overlap, font swap or layout shift?**
   - **Layout shift:** CLS 0.0002 on desktop, from the shared header's right cluster at 2.8 s, and 0 on phone. The h1 box held the same place from the first sampled frame (24,157 700×114 desktop; 16,140 343×88 phone). No font swap seen.
   - **Overlap, desktop:** the three back windows keep their footers, so their outlined "Edit in Hanzo →" buttons stack in a ghosted staircase at the deck's right edge ("n Hanzo →", "→"). The coverage note says back windows hide their labels; it hides only the address and kind.
   - **Overlap, phone:**
     - The address bar truncates to "hygg .hanzo…" while the "E-commerce" label keeps its full width.
     - The nav row splits: ← and the counter sit on one line; the dots, → and pause sit on the next.
   - **The setup control in the dark room (both widths):** a square-cornered 1px rectangle is drawn around the rounded pill and its chevron, so you see a double outline. It comes from the page's own `box-shadow: inset 0 0 0 1px` rule on `.xtp-setup2 .x-setup`.
   - **At 320:** nothing passes the right edge, and `scrollWidth` is 320.
   - **Errors:** during my first walk, the console once showed a hydration-mismatch error and the phone showed a red "1 Issue" badge. At that moment another page's file (`model/Creative.jsx`) had a parse error. Four clean reloads afterwards showed 0 errors and no badge, so I do not count it against this page.
7. **Which reference does it feel like, and is its motion there?**
   - **synchronized.studio:** yes for the wall. A tile grows into its sheet, Esc folds it back, and focus returns to the tile.
   - **apple.com:** Settle on the stage, yes.
   - **The deck:** the riffle (0.3 s, ease 0.16,1,0.3,1) now reads as a fanned stack, with the back cards peeking about 49px. No reference stands behind it.
8. **Different from its neighbours?** The hero medium is, the composition is not.
   - **Same composition:** at 1470 /gallery has the identical frame: a short h1 at the left with a mono caption under it, the lede and a solid ask at the right, then a grey rounded stage with a white pause disc.
   - **Own medium:** the browser-window deck is this page's own.
9. **Are all 18 parts covered?** No; see the next section. Also, the coverage card makes claims that are false (listed there).
10. **Banned tells?**
    - **None found:**
      - `taste.py` passes; no hue, no gradient, no Inter, no emoji.
      - No eyebrow above the h1 or h2 ("Templates" sits under the h1).
      - No button fades on hover, and no cursor glow.
    - **Reject-list hits:**
      - The ghosted back-card buttons and the double outline on the setup pill are visible craft slips.
      - Broken-image icons with alt text show at first paint and with JS off. That is a "lazy" look for a blocked visitor.
      - The page shares /gallery's frame ("every page being the same").
11. **Is the copy untouched?** Yes.
    - `parity.py /templates`: text 96/96, links 45/45.
    - **Open strings:** "No agents match.", "Filter agents..." and "MCP client" are UI strings that are not in `content/ui-strings.json`.
    - **Two different counts side by side:** "+25 more" (the strip) and "+26" (the shared SetupMenu pill) sit together in the dark room.

## Coverage claims checked (`docs/build-notes/coverage/templates.md`)

**False:**
- **Part 10 says:** "if Hanzo's screenshot fails it is hidden ... never a broken-image icon".
  - With JS on, the hero shows a broken-image icon and the alt text "Drive template preview" over the drawn page at 150 ms. It is gone by 600 ms.
  - With JS off, all 24 previews show broken-image icons and alt text (`complete && !naturalWidth`, visible) at both widths.
  - The fallback runs only after hydration. **This false claim caps the verdict at 7.**
- **Part 17 says:** "Blocked images leave a complete page". Not with JS off.
- **Part 3 says:** "JS off legible". The words are legible, but the deck and wall carry broken icons. The arrows, dots, pause and filter render but do nothing.
- **Part 9 says:** "0 fade-ups".
  - The terminal's title fades and rises (`opacity 0, y 6`).
  - Each command line fades in from `x -8`. "Types" overstates it: nothing is typed character by character.
- **Part 9 says:** back cards "peek 48px across and 30px up". Measured: 49px across but 11px up, because the scale from the bottom right cancels most of the rise.

**Imprecise:**
- **Part 7:** the list of literals leaves out #525252, #737373, #f5f5f5, #e5e5e5 and #fff. `taste.py` accepts them, but MASTER part 7 asks for tokens, not literals.
- **Part 11:** "Targets 44px+". The shared setup pill is 40px tall on phone.

**True:**
- One h1, painted by the server.
- 67% of the preview on the first screen at 1470, and 269px at 375.
- The drag never opens chat.
- The phone chips start at "All".
- The pause sits in the nav row.
- Hover rules are all inside `@media (hover:hover)`.
- `aria-pressed` on the chips.
- `data-cta` on the hero, card, sheet and close asks.
- The sheet ask sits at y 587 of 801.
- Copy equals the four commands shown.
- Reduced motion holds the deck still (01/12 after 8 s; only the cookie bar animates).
- No sideways scroll at 320.
- `parity.py` and `taste.py` pass.

## Missing from the 18 parts

- **1 Strategy:** on the phone's first screen there are two solid fills (the shared header "Try Hanzo" and the page's "Edit in Hanzo").
- **2 Navigation:** the agent links open a new tab (`target="_blank"`) with no hidden "opens in a new tab" text, and they are raw `<a>`.
- **3 Narrative:**
  - The wall repeats the deck's twelve.
  - The band has no object.
  - JS off shows broken images and controls that do nothing.
- **6 Content:** the phone address bar truncates the template's name.
- **7 Visual system:**
  - Literal hexes in the page CSS.
  - A square rectangle drawn around the rounded setup pill (double outline).
  - Tiles carry a 5% border as well as a fill.
- **8 Components:**
  - The kind chips' hover is colour only.
  - The tile press of 0.997 cannot be seen.
  - The back cards' asks render ghosted over each other.
  - The phone nav splits ← and → onto different rows.
- **9 Motion:**
  - Small fade-ups in the terminal.
  - The wall is still after its one wipe.
  - No signature reference behind the deck.
- **10 Media:** the `onError` fallback depends on JS, so first paint and JS off show broken icons.
- **11 Mobile:** the setup pill is 40px tall.
- **12 Accessibility:**
  - No new-tab notice on the external agent links.
  - JS off leaves the arrows, dots, pause and filter in place but inert.
- **18 Handover:** no `V2:` line, and the review is under 8 (open on the card itself).

## Fixes (in order)

1. **Hide failed previews without JS.**
   - Put the drawn page above a failed image with CSS, not only after hydration. For example, give the `<img>` `color: transparent` and `font-size: 0` so the alt text and icon never paint.
   - Or render it with `opacity: 0` in a `<noscript>`-safe rule and fade it in on `load`, while keeping LCP painted.
   - Then check at 150 ms and with JS off that no broken-image icon or alt text shows at 1470 or 375.
2. **Stop the back windows printing their asks.** Hide `.xtp-foot` (or at least `.xtp-edit` and the text) on `.xtp-card:not(.front)`, as was already done for the address and kind.
3. **Fix the double outline on the setup pill.** Drop the `box-shadow: inset 0 0 0 1px` on the `.xtp-setup2 .x-setup` wrapper and keep it only on the pill and chevron (lines 183 and 203 of `Templates.css`).
4. **Break the /gallery frame.** Change the first screen's composition:
   - Let the deck own the left two thirds, with the h1 sitting over or beside the deck.
   - Or start the deck small under the h1 and grow it as you scroll, then settle it.
   - Remove the grey rounded stage plus white pause disc, which /gallery also uses.
5. **Make the wall earn its screen.**
   - Either cut it to a single dense rail or strip that scrubs with scroll, with the ring following the deck.
   - Or give it idle life (each tile's preview drifting like the front window), so it is not the deck's twelve again, still.
6. **Phone deck controls.**
   - Keep ←, the counter and → on one row, with the dots under them or dropped.
   - Shrink the kind label in the address bar (or hide it under 400px) so `hygge.hanzo.app` shows in full.
7. **Phone ask.** Ask the shared-header owner to let the header take the page's thumb label ("Edit in Hanzo") on phone, as desktop does. Keep the header outlined while the hero ask is in view, so the first screen has one solid. The page then needs no floating bar over the terminal.
8. **Terminal.**
   - Either type the commands character by character, as the coverage says, or change the claim.
   - Drop the `opacity 0, y 6` on the terminal title (swap it with a clip or a cut instead).
9. **Small, but James will touch them:**
   - Tile press 0.98.
   - Give the kind chips a hover that does more than recolour, such as a background lift.
   - Add an "opens in a new tab" label to the agent links.
   - Move the three strings into `content/ui-strings.json`.
   - Put the close band on an object, such as the front window's preview at small size.
10. **Correct the coverage card.** Fix the broken-icon claim, "Blocked images leave a complete page", "0 fade-ups", "types", the 30px peek and the hex list. Then ask for a re-walk.
