# /visor: James-eye review

Verdict: 6/10
First complaint: "It's black and white now, that's better. But when it opens, the main picture is still chopped off the left side of my screen. Then the six boxes just sit there and nothing moves unless I touch it. On two of them the writing is white on white, so it's gone. And there's still a little label stuck on top of 'Volumes and images'."

Reviewed: main @ `2106935` (last page commit `d1a2614`, which reached main at 14:52, after this walk started; see "Not judged" below). Files hash: `8cb3e9b4066f`
Walked 7 Nov 14:51–14:54 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/visor.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: the colour.** There are 0 hues at either width. Last time there were 60 magenta counts on desktop, 41 on phone and the green "ready" lights. The lights are grey now, the picked AWS card has an ink border and the glows are grey (`--ac: #525252`). **New from the recolour:** two chips lost their words. In the dark room `--ac` is `#fafafa`, and `.vs2-p1 .vm` and `.vs2-p4 span.on` set `color: #fff` on it. So tile 02's "train-01/02/03" and tile 05's "SSH" are white on white (d-shot-03, p-shot-02).
- **Half done: nothing above a headline.** "HANZOAI/VISOR" is now a 12px caption under the h1 at both widths. **Still open:** "NAME A FLEET" sits directly above the h2 "Volumes and images" (d-shot-04: label at y 670, heading at y 700). Those words are not Hanzo's (`newtext.txt`).
- **Half done: the hero and the ask.**
  - The title and "View on GitHub" now stay at full strength and stay clickable while the console settles (s1: button sticky at y 384). The close's solid button is now "View on GitHub", and "Deploy to Cloud" is a text link. There are 3 `data-cta`. With JS off, 1 text run is hidden; it was 8, and the lede and the ask were among them.
  - **Still open:** at 1470×801 the console starts with about a quarter of it off the left edge. "launch" and "DigitalOcean" are off the screen, and the inventory shows only its right-hand labels. Under 900px, AWS and GCP are still `display: none`.
- **Still open: the tile room and the controls.**
  - The tiles are still six boxes in one grid, with three equal boxes in a row (03–05) and no pin.
  - The only idle movers are six pulsing dots and a caret.
  - The card has no focus trap, the hero loop has no pause, and the coverage card is still missing.
  - This walk did not open a tile on desktop, so last walk's jammed 01 card is unverified there. On phone, 01, 04 and 06 open and fold back cleanly.
- **Not judged:** this walk did not include page commit `d1a2614` (14:51, merged to main 14:52:13; the walk ran 14:51:20–14:54 on `2106935`). In source it does three things:
  - It sets the h1 to 52px, section heads to 26px and the close to 32/26px in the shared `Launch.css`.
  - It swaps the tiles' spring for ease-emphasis.
  - It removes the cursor-following "Open" label from the tiles.

  So the 116px h1, the "Open" label and the spring seen below may be gone on main. "quote" stays at `clamp(56px, 6vw, 88px)`. The next walk has to check.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words do, and it moves. The picture is still cut.
   - **Desktop:** the body is blank for the usual ~2 s, and the "first second after paint" reading of 0/25 falls inside that window (d-sheet-01 frames 1–4). After that the console starts within a second, with 19/48 moving frames in the rest of the 3 s:
     - the providers light "cached and priced" (3.0 s);
     - AWS is picked with an ink border and the dry-run line shows (4.5 s);
     - train-01 to train-03 name themselves;
     - the SSH console turns dark with "$ ▍" and the audit row is written.
   - **But the first screen at 1470×801 shows half a product.**
     - The request reads "3 × GPU instance · prefix train" ("launch" is off the screen).
     - DigitalOcean shows as "n", and "ONE INVENTORY" as "RY".
     - The machine names are cut down to their "machine" labels.
     - The SSH box is a grey placeholder until its step comes.
     - The console only slides fully into view once you scroll (s1).
     - The h1 is 116px.
   - **Phone:** the 52px title cuts in by line mask (p-sheet-01), then the caption, the lede and "View on GitHub" (y 355), then the full request card and the DigitalOcean card. 8/25 frames move in the first second and 41/60 after that. AWS and GCP are hidden, so "several clouds" shows one cloud and the pick never happens.
2. **One in, one out, or a document?** A document after the hero.
   - The hero is the one pinned scene: the console slides into place beside a title that now stays readable (s0 → s1).
   - Then it reads top to bottom with no scene:
     - s2: the 96px "What you get for the price of one integration" on black, with the tops of tiles 01 and 02;
     - s3: all six tiles at once (01 wide and 02, then 03 / 04 / 05 equal, then 06 wide);
     - s4: tile 06 and a band of empty black;
     - s5: the naming tool;
     - s6: the close;
     - s7: "Get Visor".
   - Nothing pins or changes as you scroll after the hero. The detail only comes by tapping a tile.
   - On phone the tiles are six cards in a column (s2–s4), which is right for that width.
3. **A real object in every section?** The hero and the naming tool, yes. The tile room only half.
   - **Hero:** the fleet console, cut on desktop.
   - **Tile room:** six small pictures: bars, chips, blocks, the word "quote", RDP/VNC/SSH chips with a caret, and three audit rows.
     - Nothing in them moves except six pulsing grey dots and the caret. Phone s3–s5 measure STILL. The desktop shot pairs for s2–s8 differ only by a 1–2px scroll drift (residual 0.4–0.9 once aligned).
     - Two pictures have lost their words: the white-on-white chips above.
   - **Naming tool:** the best thing on the page. "−" and "+" step the count, and the rows enter and leave (phone film 3 → 2 → 3). The rows stay striped while it is a dry run.
   - **Close:** only the shared "Paste and ship" prompt, with no product object.
4. **One ask, sticky; nothing floating; scale with rhythm?** The ask is right. The scale is not.
   - **The ask:** one solid button per screen.
     - The hero has "View on GitHub" (y 605, then held in the pin at 384), and the close has "View on GitHub" (y 292 desktop, 346 phone).
     - Between them the only solid is the header's "Try Hanzo" (desktop s2–s5, phone s1–s5).
     - There are 3 `data-cta` and 1 `data-thumb`.
   - **Floating:** the FLOATS reading is empty on every screen, and no ask bar shows at either width. **But** a cursor-following "Open" label rode the pointer over the tiles (d-sheet-07, beside "quote"). At s4 it was left stranded at the right edge over the black room (d-shot-04-a, x 1448, y 432). That is banned. `d1a2614` removes it in source.
   - **Scale, as walked:** everything is a headline.
     - Desktop: h1 116px; s1 116 + 96; s2 96; s3 88 ("quote"); s5 74 + 56; s6 88 + 74. That is BIG×2 on s1, s5 and s6, and the close puts "Get started with Hanzo Visor" and "Get Visor" on one screen.
     - Phone: h1 52, then 47, 56 ("quote" is bigger than the h1), 36, 40 and 42.
     - Live hanzo.ai rests at 52 / 26 / 64.
5. **Every hover and press answers?** Mostly.
   - **These answer:**
     - "View on GitHub": a ring on hover, press 0.98.
     - Tiles 03–05: the border lightens and the "+" disc fills; press 0.98.
     - "Fewer" and "More": press 0.92.
     - "Copy": press 0.94, and "Copied" with a tick on phone.
     - "hanzoai": it now presses (0.98), which it did not last time.
   - **Dead:** the hover on "dry run" and on "launch" (the press answers).
   - **Small breaks:**
     - The tile hover fills the "+" disc white, so the white "+" vanishes into it. The card's "×" does the same on hover.
     - On phone the page scrolls behind an open card, so card 06 folded back across the naming tool (p-sheet-03, about 23 s).
   - **Phone taps:** 01, 04 and 06 grow into a bottom card with the heading, Hanzo's paragraph, Previous / Next and the picture, then fold back. The walker logged "Fewer" as no change, but the film shows 3 → 2.
   - **Pointer:** besides the magnetic ask there is only the banned "Open" label: no tilt and no preview.
6. **Overlap, font swap, layout shift?**
   - No overlap was measured at either width, and there is no horizontal scroll at 375 or 320.
   - The h1 box sets once (497 ms desktop, 648 ms phone), so there is no font swap.
   - **CLS is 0.088 on desktop** (fleet console 0.070, stage 0.018), up from 0.037. It comes from the console changing height as machines are added. Phone is 0.035.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The hero pins and the product settles as you scroll.
   - **synchronized.studio:** half. The tiles grow into a card with the heading and picture carried across, and on phone it reads cleanly. But it opens a box over the page, not the next page.
   - **motion.dev:** the inventory's layout reflow in the naming tool.
   - **anthropic.com launch:** no hero figure. "quote" is a word at 88px, not a number.
8. **Different from its neighbours?** Less than before, because the colour used to do the work.
   - **The first screen is /sentinel mirrored:** both use `StageHero look="side"`, and Visor adds `flip`. Each has:
     - a 116px two-line title on one side;
     - the live panel cut by the screen edge on the other;
     - a mono caption under the h1 ("SENTRY.HANZO.AI" / "HANZOAI/VISOR"; also /stream's "KAFKA WIRE PROTOCOL" and /telemetry's "TELEMETRY.HANZO.AI").
   - **The close is the shared `Finale`,** the same as 8 other Cloud 4 pages (/auto, /billing, /search, /sentinel, /stream, /telemetry, /tunnel, /world): "Get started with Hanzo X / Paste and ship / Get X / licence chip / hanzoai / Deploy to Cloud".
   - **Its own:** the tiles that open and the naming tool. It is also the only one of these walks with no floating "Hanzo X | ask" pill.
   - Magenta used to set it apart from /sentinel's violet. With both grey, the top of the two pages differs only by which side the panel is on. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. `docs/coverage/visor.md` is missing on main.
10. **Banned tells?** Yes:
    - **A label above a headline:** "NAME A FLEET" (12px) directly over the h2 "Volumes and images", at both widths.
    - **Three equal boxes in a row:** tiles 03, 04 and 05 (desktop s3).
    - **Everything big at once, as walked:** s1, s5 and s6 each carry two headings of 56–116px.
    - **Floating over content, as walked:** the cursor-following "Open" label.
    - **Dead after the hero:** nothing moves untouched past s1 apart from six blinking dots and a caret.

    Clean now: 0 hues, nothing above the h1, no opacity-only hover, 0 `title=` tooltips, no sound, no console errors.
11. **Copy untouched?** Yes.
    - Parity is 29/29 text and 2/2 links.
    - The 18 added strings are demo data (DigitalOcean, AWS, GCP, train-01 to train-03, gpu-pool, "$ ▍", "org · project") and labels lifted from Hanzo's sentences ("regions · sizes · gpus", "dry run · quote returned · spends nothing", "launched · console opened · org · project").
    - Two are the builder's own: "Name a fleet", set over a heading like a title, and "ready", a status on six tiles that are not machines.
    - There is no new claim or number. Hanzo's "Volumes and images" is used as two headings (tile 02 and the naming tool).

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/visor.md` does not exist on main (HEAD `a2f6b60`, origin/main `27241b8`). That alone caps the page at 7, and no part has a `Done here:` line.
- **Part 1 Strategy:** the header has no `Persona:`, `Goal:`, `CTA:` or metric line (all four checks false). It still reads "Accent: fleet magenta" and scores itself "V2: 8/10". No copy questions are listed, because there is no card.
- **Part 3 First impression:**
  - At 1470×801 the hero object starts with about a quarter of it off the left edge.
  - With JS off, 1 run is hidden: the audit line "launched · console opened · org · project".
  - The tiles open into a box over the page, not into a page (Morph).
  - The close has two headings, "Get started with Hanzo Visor" and then "Get Visor".
- **Part 4 Conversion:** "Previous" and "Next" in the open card are raw `.x-btn` (7 uses), not `<Cta>`.
- **Part 6 Content:** 7 text runs are 13px on phone ("prefix", "machines", "machine" and others), under the 14px floor. Hanzo's six tile paragraphs sit in `hidden` spans, not `hidden="until-found"`, so find-in-page cannot reach them.
- **Part 7 Visual system:**
  - "NAME A FLEET" sits above an h2, and there are three equal boxes in a row.
  - The tiles have both a fill and a 1px outline, and `.vs2-inv2` has both an outline and a 48/120 shadow (raise or outline, never both).
  - `Visor.css` uses literal hex throughout instead of tokens.
  - Two chips are white on white.
- **Part 8 Components:**
  - The open card is a `role="dialog"` div: focus is not trapped and does not return to the tile.
  - "dry run" and "launch" have no hover.
  - There are 13 bare `:hover` rules.
  - "−" and "+" press to 0.92 (the deck press is 0.97).
  - As walked, the tiles opened on a spring (no springs); `d1a2614` swaps it in source.
- **Part 9 Motion:**
  - Past the hero nothing moves without input at either width.
  - The tile room runs six pulsing dots and a caret at once (budget: one continuous mover per viewport).
  - The hero console loops (about 9.6 s) with no pause control.
  - The family's `Frame.jsx` has 2 `setInterval` timers.
  - The only pointer motion is the magnetic ask and the banned "Open" label.
  - Reduced motion settles (0 running after 3 s).
- **Part 11 Mobile:**
  - Two of the three providers are hidden under 900px.
  - "Deploy to Cloud" is 132×21, under 44px.
  - The page scrolls behind an open card.
- **Part 12 Accessibility:** the looping hero has no pause (WCAG 2.2.2). For the dialog focus, see part 8.
- **Part 13 Performance:** CLS is 0.088 on desktop (fleet console 0.070), up from 0.037, against a lab target of 0.02. The console needs its full height reserved.
- **Part 18 Handover:** no card (above).
- Passing:
  - one h1, visible with JS off, and one main;
  - 0 hues at both widths and nothing above the h1;
  - no overlap and no horizontal scroll at 375 or 320;
  - 0 low-contrast runs measured and 0 `title=` tooltips;
  - no raw img, video or table;
  - 3 `data-cta` and 1 `data-thumb`, and one solid ask per screen;
  - nothing floating at either width, apart from the "Open" label;
  - reduced motion settles and the h1 box is steady;
  - no console errors;
  - parity 29/29 and 2/2.

## Fixes (in order)
1. **Put the whole console on the first screen at 1470×801.** Pass `travel={{ s: [1, 1], x: ['0%', '0%'] }}` to `StageHero` in `Visor.jsx` (the prop exists). The request line "launch 3 × GPU instance · prefix train", all three providers and the inventory names are then on screen from the first frame. Give `.vs2-inv` a fixed height for five rows plus the console, so adding machines stops shifting the layout. On phone, show DigitalOcean, AWS and GCP as one compact row instead of hiding two, so the AWS pick still happens.
2. **Delete the "Name a fleet" label** (`<p className="l2-kick ac">` in `Name()`). The words are not Hanzo's, and the h2 "Volumes and images" stands on its own.
3. **Make the tile room move one thing at a time, and break the row of three.**
   - Make the grid two columns, so 01 and 06 span the width and 02|03 and 04|05 sit in pairs.
   - Let each tile's own picture run once while it is in view (with `useLive` from `Frame.jsx`): the catalogue bars fill, train-01 to train-03 name themselves, "dry run" turns into "quote", the caret types after "$", and the three audit rows land in order.
   - Stop the six pulsing "ready" dots.
4. **Give the lost words back, and settle the figures.**
   - In the dark room set `color: #0a0a0a` on `.vs2-p1 .vm` and `.vs2-p4 span.on`, so they read ink on white.
   - Do the same for the "+" on `.vs2-tile:hover::after` and the "×" on `.vs2-x:hover`.
   - Bring "quote" (`.vs2-p3 b`) down to the 64px figure size.
   - Re-walk to confirm `d1a2614`'s 52 / 26 / 32 headings on screen.
5. **Write `docs/coverage/visor.md`** from `_TEMPLATE.md`, with a filled `Done here:` line for all 18 parts. In the page header, add the `Persona:`, `Goal:`, `CTA:` and metric lines, and delete "Accent: fleet magenta".
6. **Make every control answer.**
   - Make the open card a native `<dialog>` with `showModal()`, so focus stays inside and returns to the tile.
   - Give "dry run" and "launch" a hover that changes more than opacity (the selected state's white fill at half strength).
   - Add a 44px pause control to the looping hero console.
   - Swap "Previous" and "Next" to the kit's quiet `Cta`.
   - Raise the phone labels "prefix", "machines" and "machine" to 14px, and give "Deploy to Cloud" a 44px hit area.
