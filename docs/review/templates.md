# /templates: James-eye review

Verdict: 5/10
First complaint: "The best thing here is the deck of sites, and on my laptop I get a strip of it at the bottom of the screen. I grab the window to flick it and it throws me into chat. Then I get the same twelve pictures again underneath, three in a row with a sentence under each, for four screens. That's a catalogue, not a moment. And on my phone I can't get back to 'All', because the filter row starts at E-commerce and the pause button sits on top of Portfolio."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `30e721f`, plus the uncommitted shared `x-gauss/LineMask.jsx` and `Rhythm.css` edits in the tree at 14:51. Files hash: `61c1312bbdcd` (page, CSS, SetupMenu, route, Scale, Settle, OpenSheet, x-gauss).
The page and the standard both changed while I walked. I first walked `bf5c941` at 14:18. Then `ffe7921` landed (white chip thumb, greyed agent icons), JAMES.md changed at 14:41 (scale rhythm, ask in the header, nothing floating), `c647368` changed the shared Ask so the desktop pill bar no longer shows, and `30e721f` set h1 52 and h2 26 and dropped springs. Every finding below was re-measured at 14:51–14:55 on `30e721f`, and the review applies the 14:41 JAMES.md.
Walked 7 Nov 14:18–14:55 UTC on the dev server at 1470×801 (fine pointer, hover on) and at 375×812 (touch). I used screencasts, 6- and 10-frame bursts with pixel diffs, a layout-shift observer, hover and press style diffs, mouse and touch drags, the keyboard, JS off, reduced motion, and widths of 320 and 375. The previews at hanzo.ai/templates/*.webp cannot load in this sandbox. I served 1280×800 stand-ins of the same size so the layout reads as it will on hanzo.ai.
Proof: `img/templates.jpg` (desktop first screen | phone first screen, with stand-in previews).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half.
   - **What moves:** the h1 cuts in by line mask, the right column rises, and the deck now riffles at load: `02/12 → 03/12` with no input, the readout ("E-commerce / Savor") follows it, and the address bar types the name.
   - **Desktop, 1470×801:** the first screen is a 52px two-line h1 at the left, the lede, readout and ask at the right, then 140px of empty white, then the grey stage with its chip row. Of the front window, only 154px shows (`.xtp-card.front` top 647), and 111px of that is preview. The thing that sells the page sits under the fold.
   - **Phone, 375×812:** 111px of the front card shows, 69px of it preview.
   - **On `bf5c941`** (h1 120px), the preview showed 0px and the first screen did not move at all after 1.6s.
2. **One in, one out, or a document?**
   - **The deck:** this is the one good moment. It settles (Settle 1.06→1, 60px lift) and riffles while in view.
   - **The shelf:** next comes "All 12", the same twelve previews again as 4 rows × 3 tiles, each with a kind label, a title and Hanzo's sentence. That is about four screens on desktop (y≈1080–2880) and about 5.5 on phone (y≈1218–5684). The tiles have no entrance and no idle motion; only hover lifts them.
   - **The dark room:** a 26px h2, the setup pill, agent chips and a terminal. The terminal only re-types when the deck changes, three screens up, so nobody ever sees it react.
   - After the hero, the page is a document.
3. **A real object in every section?** Yes:
   - **Hero:** the window deck with real previews.
   - **Shelf:** twelve previews.
   - **Dark room:** the terminal.
   - **Problem 1, the deck:** on desktop it does not read as a deck. The back cards peek 0–4px past the front window, because `scale: 1 - d*.06` from the bottom centre cancels the `x: d*22, y: -d*26` offset. Riffling looks like one window swapping. On phone the back cards do show (21, 41 and 59px).
   - **Problem 2, a failed preview:** it leaves a flat #0a0a0a slab with no name or Sigil.
4. **One ask in the sticky header, nothing floating over content, scale with rhythm?** Mostly no.
   - **Hero ask:** "Edit in Hanzo" is solid, with `data-thumb` and `data-cta="templates.hero"`, and it follows the template in front.
   - **After the hero:** the sticky solid is the header's "Try Hanzo". That is shared-system behaviour, but the page's own verb is gone from y=720 on, and the deck's "Edit in Hanzo" is an outline.
   - **Dark room:** the white "Copy setup prompt" pill and the header's solid "Try Hanzo" show together. On desktop that lasts from y=3240 to 3600; on phone from y=5684 to 6090.
   - **Sheet ask:** in each shelf sheet, the "Edit in Hanzo" sits below the sheet's own fold (CTA top 782 against sheet bottom 745 at 801 high).
   - **Floating:** on phone, the pause disc floats over the chip row.
   - **Scale:** the h1 rests at 52px, as the new rule says. The other sizes are out of step:
     - The readout name beside the h1 is 38px.
     - Shelf tile titles are 28px, bigger than the dark room's 26px h2.
     - The sheet title falls to 17px, because `.gx h3` reaches the sheet that is portalled into `main.gx`. Opening a tile makes its headline smaller than the tile's own title.
5. **Every hover and press answers?** Mostly, and nothing fades.
   - **Hero ask:** the fill goes from #0a0a0b to #2c2c2e, the arrow moves 3px, it has a magnetic pull, and press scales to .98.
   - **Tiles:** they lift 4px, the image zooms to 1.04 and the "+" turns; press scales to .99.
   - **Card ask:** the border turns ink over a veil; press scales to .98.
   - **Pause:** now inverts on hover.
   - **Weak:**
     - The kind chips change text colour only.
     - The arrows grow 1.05 on hover but have no press.
     - The agent chips have no press.
     - Eight bare `:hover` rules in `Templates.css` stick on touch: after a tap on phone, the Next arrow stays at scale 1.05.
   - **Broken:**
     - A mouse drag on the front preview, where `data-cursor="Drag"` invites it, advances the deck and then follows the link to `/chat/?template=drive`, the card you just threw away. It failed this way in 5 of 6 runs; a drag by the address bar or title works.
     - At 11/12 and 12/12 the dots mark dot 1 or dot 2 as current, because only 10 dots exist (`list.slice(0, 10)`, `at % 10`).
6. **Overlap, font swap, layout shift?**
   - **Layout shift:** CLS 0 over full walks at both widths, and the h1 box is steady. One phone walk logged CLS 2 while the file was being hot-reloaded by its owner; a re-walk gave 0.
   - **Overlap at 375×812:**
     - The pause button (x 311–356, y 579–624) covers the "Portfolio 06" chip.
     - "All 12" and "Business 01" sit off the left edge at x −187 and −115 and cannot be scrolled to. The row's `scrollLeft` minimum is 0, because `.xtp-kinds` keeps `justify-content: center` inside an `overflow-x: auto` row.
   - **At 320px:** the dark room's column is 345px wide (SetupMenu's minimum width), so 41px is clipped: the terminal's Copy button, the right edge of the "Copy setup prompt" pill and the chips. The page itself does not scroll sideways.
7. **Which reference, and is its motion there?**
   - **synchronized.studio:** yes for the shelf. A tile grows into its sheet as a shared element, and Esc folds it back with focus returned.
   - **apple.com stage:** Settle is there.
   - **The deck:** it has no reference behind it. On desktop it reads as a 0.3s swap of one window, not a riffle.
8. **Different from its neighbours?**
   - **Different:** the hero medium (browser windows) is its own.
   - **The same:** the composition matches /gallery, /features, /zap and /ledger: a two-line h1 at the left, lede and ask at the right, and a grey rounded stage under it with a pause disc at the top right.
   - **/gallery** ("Curated template showcase") is its nearest neighbour in content, and it shows its object on the first screen.
9. **All 18 parts covered?** No; see below. `docs/coverage/templates.md` exists, but three of its claims do not hold.
10. **Banned tells or reject-list items?**
    - **None found:**
      - No hue: agent icons are greyed by the filter, and the 0-hue probe found nothing.
      - No gradient.
      - No eyebrow above the h1 or h2 ("Templates" and "Setup" sit under them).
      - No fade on hover.
    - **Reject-list hits:**
      - Overlap at 375×812: the pause disc covers a chip.
      - "3 equal boxes in a row" plus "explaining sentences under every tile": the shelf's 4 × 3 tiles.
      - Something floating over content: the same pause disc.
11. **Copy untouched?** Yes: parity 96/96 text and 45/45 links. Additions and doubts:
    - **New strings:** "Setup", "MCP client", "No agents match." and the "Filter agents..." placeholder are new UI strings, in neither the live copy nor `content/ui-strings.json`.
    - **Paraphrase:** the terminal notes paraphrase Hanzo's setup prompt (it lives in the `title` of the live button).
    - **Unverified clone URL:** `git clone https://github.com/hanzo-apps/template-<slug>` is in neither Hanzo's copy nor Hanzo's hanzo-apps repo list. The list has only `hanzo-apps/templates`, and none of the 60 named repos is `template-<slug>`. The page shows it twice and copies it to the clipboard.
    - **Repeated line:** "Open one. Edit it in Hanzo." is used twice, as the hero lede and as the dark room's h2. Live uses it once.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - `Persona:`, `Goal:`, `CTA:` and `Metric: first_chat` are present.
  - Two solid buttons share the dark-room viewport.
  - The header comment still says "orange accent" and self-scores "8/10" (`Templates.jsx` line 5).
- **2.3 First impression:**
  - At 1470×801 only 111px of the hero object shows; at 375×812, 69px.
  - The page ends in the dark room, with "Copy setup prompt" as its solid. There is no closing Band repeating "Edit in Hanzo".
- **2.4 Conversion:**
  - `data-cta` exists only on the hero ask. The 12 deck-card asks and the 12 sheet asks have none.
  - The hidden ask-bar link still carries `/chat/?template=drive` while the hero offers Kinetic. The shared bar reads the href once; it is harmless only while the bar stays hidden.
- **2.5 Proof:** the `hanzo-apps/template-<slug>` clone line is unverifiable (see 11).
- **2.6 Content:**
  - The 12 shelf address labels (`.xtp-tile-img span`) are 13px on phone.
  - The phone counter wraps to two lines, "02 /" over "12" (`.xtp-count`, 66×44).
  - The phone card description is clamped with an ellipsis.
  - The heading outline skips from h1 to h3: the deck cards are h3 with no h2, and the shelf has no heading.
- **2.7 Visual system:**
  - The deck is 35px left of the centred chip row: `.xtp-slot { right: 66px }` reserves room for a fan that does not show.
  - Literal hexes instead of tokens: #161617, #0b0b0c, #e3e3e8, #a1a1a6.
  - Dead CSS: `.xtp-kind-bg`, `.xtp-grid`, `.xtp-agents`.
  - Duplicate rules: `.xtp-kick`, `.xtp-card` radius, `.xtp-kinds button i`.
- **2.8 Components:**
  - 8 bare `:hover` rules.
  - The arrows and agent chips have no press.
  - The kind chips are `role="tab"` with no tabpanel and no arrow-key movement. ArrowRight on "All" leaves focus there.
  - The dots: 10 for 12 templates, and the wrong one is current at 11/12.
- **2.9 Motion:**
  - A mouse drag on the preview navigates.
  - The shelf has no entrance or idle motion across its 4 to 5.5 screens.
  - The terminal's re-type is never seen.
  - Scroll-linked motion stays under half (Settle only), which passes.
- **2.10 Media:**
  - All 24 template images are `loading="lazy"` and none has `priority`, the front window included. The coverage says "the three cards in front load eagerly".
  - A failed preview leaves a #0a0a0a slab.
- **2.11 Mobile:**
  - "All" and "Business" are unreachable.
  - The pause disc sits on a chip.
  - At 320 the dark room is clipped by 41px.
  - The shelf is about 5.5 screens of stacked tiles.
- **2.12 Accessibility:**
  - The h1 → h3 skip.
  - `aria-current` sits on the wrong dot.
  - The tabs have no panels.
- **2.16 Developer:** Copy gives the five commands without `$ ` and without the `# notes`. The displayed text includes the notes, so Copy does not equal what is shown.
- **2.17 States:** a preview that fails to load has no designed fallback.
- **2.18 Measurement:**
  - `data-cta` is on the hero ask only.
  - There is no ledger entry for what this page deleted.
- **Coverage:** `docs/coverage/templates.md` claims three things that are not true:
  - "only the three cards in front load eagerly" (all are lazy);
  - "chips scroll sideways inside their own row" (two cannot be reached);
  - "one solid per screen" (two in the dark room).
- **Passing:**
  - One h1 in the server HTML.
  - CLS 0.
  - No page sideways scroll at 320 or 375.
  - JS off is legible: 0 hidden text runs outside the closed menu.
  - Reduced motion is still: the deck holds and no animations run after 6s.
  - 0 hues.
  - No eyebrow over a headline.
  - Sheets trap focus, close on Esc and return focus to the tile.
  - Copy never says "Copied" without copying.
  - Parity is clean.

## Fixes (in order)
1. **Make the deck the first screen's one big thing.** At 1470×801, at least 60% of the front window's preview should show. At 375×812, at least 240px of it.
   - Cut `.xtp-hero` top padding and the `.xtp-top` bottom margin.
   - Drop Settle's 60px lift, or start the deck small and let it grow (the rhythm rule).
   - Move the readout row under the deck, or onto the window's own bar.
   - On phone, put the chips under the deck.
2. **Stop the drag from opening chat.** Record `onDragStart` in a ref and, in `onClickCapture` on `.xtp-shot` and `.xtp-edit`, `preventDefault()` when the pointer moved more than 6px. Or take the link off the preview so only "Edit in Hanzo" navigates.
3. **Let the deck read as a deck on desktop.** The back cards must clear the scale shrink, at least 24px each. For example: `x: d*48, y: -d*30`, `scale: 1 - d*.035`, origin `100% 100%`. Measured peeks today are 0–4px.
4. **Delete the repeat.**
   - Either drop the 4 × 3 shelf, since the deck plus chips already is the catalogue and the sheet can open from the deck card.
   - Or turn it into one dense wall or rail of 12 previews with titles only, entering as you scroll. Hanzo's sentence stays in the sheet, where it already is, so copy parity holds.
   - Three equal tiles in a row with a sentence under each is on the reject list.
5. **Fix the phone chip row and the pause.**
   - Give `.xtp-kinds` `justify-content: flex-start` (or `safe center`) at ≤900px.
   - Move the pause off the row: `usePause({ right: 8, top: <under the chips> })` or the window's top-right corner. It should never cover a chip or the preview text.
6. **One solid in the dark room, and an ending.**
   - Make "Copy setup prompt" an outline in this room.
   - Close the page with a Band carrying "Edit in Hanzo" (`data-cta="templates.close"`).
   - Put `data-cta` on the deck-card and sheet asks.
   - Place the sheet's ask beside its title, or shrink the art, so it shows without scrolling the sheet.
   - Request that the shared sheet title is exempt from `.gx h3` (17px). A sheet's headline should not be smaller than the tile you clicked (28px).
7. **Prove or drop the clone line.** Snapshot the `/v1/templates` response with each template's `source` into `content/` and read the URL from it. Otherwise show only `hanzo template get <slug>`, which names the repository in Hanzo's own prompt.
8. **Fix the dots.** Render one dot per template (12), or drop the dots and keep the counter. Give the counter `white-space: nowrap`.
9. **Fix 320.** Give `.xtp-cmd-in > div` `min-width: 0`, and let `.x-setup` shrink (`max-width: 100%`, the label truncating), so the terminal's Copy button and the chips are not clipped.
10. **Small, but James will touch them:**
    - Wrap the 8 bare `:hover` rules in `@media (hover: hover)`.
    - Give the arrows and agent chips press .98.
    - Make the kind chips buttons with `aria-pressed` (a filter, not tabs), or full APG tabs.
    - Add an h2 for the deck and the shelf.
    - Make the shelf address labels 14px on phone.
    - Give the front window's image `priority`.
    - Put a Sigil or the name on a failed preview.
    - Remove "orange accent" and the self-score from the header comment.
    - Correct the three coverage claims.
