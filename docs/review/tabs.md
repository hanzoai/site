# /tabs: James-eye review

Verdict: 7/10
First complaint: "The top is right now. The window splits itself and the tree keeps up, on my phone too. But the further down I go, the deader it gets. The machine map has already finished playing before I reach it. One of the 'What you get' panes is a blank white block. And it ends on a single button in an empty black box."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `2eb72b7f`. The page files last changed in `14f1655` (Tabs.css: the phone tree height) and `30e721f` (Tabs.jsx). Files hash (sha256 of `Tabs.jsx`, `Tabs.css`, `tabsTree.js` and `app/tabs/page.jsx`, first 12 characters): `84f48d9ed285`.
The shared ask (`components/Ask.jsx`) was replaced in `0ebd0a44` while I was walking. Every ask finding below was measured again on `2eb72b7f`.
Walked 7 Nov 14:55–15:12 UTC on the dev server, moving, at 1470×801 and 375×812 with touch emulation. I kept:
- load bursts (8 frames, 150 ms apart);
- per-screen bursts (6 frames, 150 ms apart) with frame differences;
- a tree sampler (every 100 ms for 12 s, at both widths);
- user split and close runs;
- a hover and press probe with a hover-capable pointer;
- a tab crawl, a JS-off render and a reduced-motion run;
- wheel-scroll ask logs.

The cookie note was skipped.
Proof: `img/tabs.jpg`.
- Top row: the desktop first screen and the phone first screen.
- Bottom row: the close (one still button, then the footer); the "Closing a pane loses nothing" tile with its blank white pane; the ink focus ring on the black window; the phone key row with "Ctrl" cut to "Ctr".

## Since the last review (fixes 1–8)
1. **Done: the tree.** It is keyed by id and no longer shares a `layoutId`.
   - Sampled every 100 ms for 12 s: 0 of 119 samples were illegible more than 600 ms after a change, at both widths. Before, 77–90% of samples failed.
   - The tree went through 4 distinct layouts in those 12 s, and the leaf count always matched the pane count.
   - User splits and closes read cleanly 700 ms later.
2. **Done: a running shell on the phone's first screen.**
   - Pane content starts at y=470, so 190px of it sits inside 660.
   - The first self-split comes at about 1.3 s (`useLive(0.12)`).
   - Still open: the tree itself starts at y=742, so the phone fold shows only "layout / split ⇄". With four panes its 180px box holds 313px of tree and scrolls inside itself.
3. **Done: panes work on a phone.** "Split right" folds away, the glyphs have 44px hit areas, and splits stop at 4 panes. At 375 every pane keeps Split down and Close, and 0 targets are under 44px.
4. **Done at the close.**
   - The close has `data-thumb`, and its ↗ nudges on hover.
   - The map's tile is no longer a black button.
   - At rest there is one page solid per screen. The header's "Try Hanzo" is now always solid (shared, see answer 4).
5. **Half done: the dead bands.**
   - At scroll 801 the lede ends at y=105 and the chapter card starts at y=351, so there are about 250px of white before the next object. The chapter heading is still about 435px below the lede (the old review measured 410px).
   - There is no gap between the chapters and the map.
   - On phone, the 62svh blanks are gone.
   - Still: no Band. The page ends on one button with about 165px of black under it.
6. **Done, but one tile is broken.** The term tile pages its scrollback, the phone tile presses its keys, and MIT is the link. The "keep" tile is broken (fix 1 below). All three loops run forever with no pause control.
7. **Not done: kit `<Tabs>`.**
   - Browser/Phone is still a hand-rolled radiogroup. ArrowRight changes the selection but leaves focus on the button that just became `tabindex=-1`. There's no Home/End and no gliding thumb.
   - The phone dots are still `role=tablist` with 0 tabpanels.
   - Done: the labels are now icons with aria-labels.
8. **Partly done: template and polish.**
   - **Done:**
     - The composition is new: a one-line h1 and the ask over a full-width app window.
     - The "HANZO TABS" eyebrow is gone (the name is in the window bar).
     - The phone chapter pause is off the pane.
     - Bare `:hover` rules went from 4 to 0.
     - Machine cards slide 6px with an ink ring.
   - **Not done:**
     - Chapter 3 still jumps 7px on phone (274 → 281px; 0 on desktop).
     - Literal hexes went from 18 to 23, worse.

## The 11 answers
1. **Does it sell in 5 seconds, and does something move within 1 second?** Yes, at both widths.
   - **Desktop:**
     - "Keep tabs on your agents." is 52px at y=191, with "Open Tabs" on the same row.
     - The window starts at y=297. The h1 cuts in at first paint (CSS LineMask), then the panes split themselves from 1.3 s while the tree grows in the sidebar.
     - The lede starts at y=833, below the fold.
   - **Phone:**
     - The h1 is 2 lines at 40px (y 156–240), and the ask sits at y 258–310.
     - Four live panes show above the fold.
     - The lede starts at y=926, below the fold.
2. **One in, one out, or a document?** The first half is one in, one out. The second half is a document.
   - The first half: the hero, then three pinned chapters, one diagram each, with the 01–03 rail. Frame bursts: desktop screens 0–2 moved in 5/5 frames, screens 3–4 in 2/5.
   - At scroll 4005 (the map), only the "What you get" heading moved (1/5). The map's packets run twice from page load (`xtb-out 2.4s linear 2`), so they're over before you arrive.
   - The close moved in 0/5.
   - **Phone:**
     - Screens at 1624 and 2436 moved in 0/5. The map's wires are `display: none` there, so it is a static list.
     - The chapters pin their visual at the top while the text scrolls under it. MASTER part 11 says to stack pinned scenes under 900px.
     - At scroll 1624 the pinned visual shows chapter 3's diagram while the text on screen is still chapter 2's.
3. **Does every section hold a real object?** Yes, except the close.
   - Hero: the window and its tree.
   - Chapters: three diagrams.
   - Map: three machines wired to a tabs.hanzo.ai card.
   - Dark room: four running objects.
   - Close: one button.
4. **One ask, sticky after the hero? Nothing floating? Scale rhythm?**
   - **Ask:** the words are Hanzo's ("Open Tabs", `data-thumb`, `data-cta` tabs.hero and tabs.close).
   - **Shared system (since `0ebd0a44`):** the header's "Try Hanzo" is solid at every width.
     - The first screen therefore carries two solid black pills with different words and destinations: "Try Hanzo" at y=13 and "Open Tabs" at y=183. The close carries two light ones.
     - After the hero, the page's own ask is gone until the close. Desktop has no bar by design. On phone the quiet bar never found a clear spot at the rest positions I checked (900, 1700, 2600, 3500).
   - **Nothing floats over content:** pass.
   - **Scale rhythm:** pass.
     - h1 52/40, h2 26/24, h3 17, lede 21, body 16–19.
     - One big thing per screen: the window, then the chapter card, the map, the tiles.
5. **Does every hover and press answer, with no jumps?** Mostly. Tested with a hover-capable pointer.
   - **Answer:**
     - The hero ask: #0a0a0b → #2c2c2e, a magnetic pull and the ↗ nudge; press 0.98.
     - Browser/Phone: grey → white; press 0.98.
     - Pause: inverts; press 0.94.
     - Pane buttons: a #26262b fill; press 0.98.
     - The rail: inks; press 1px.
     - Copy: a veil; press 0.93.
     - Machines: slide 6px with an ink ring.
     - Tiles: lift 4px and pause their loop.
     - MIT: inverts and underlines.
     - The close ask: its ↗ nudges; press 0.98.
   - **Weak:** the close's fill goes from #f5f5f7 to #fff, which you can't see. No hover tells you anything (JAMES rule 5): the machines slide but say nothing.
   - **Dead:** the tree leaves (hovering "shell 3" doesn't light its pane) and the tabs.hanzo.ai card in the map.
   - **Jumps:** none.
6. **Overlaps, font swap or layout shift?**
   - **Steady:** the h1 box doesn't move (3 readings at each width), and there's no horizontal scroll at 320, 375 or 1470.
   - **CLS:** 0.0025 on desktop and 0.0077 on phone. The sources are the keep tile, which animates `flex-grow` and `padding` and logs a shift on every cycle, and phone chapter 3 (274 → 281px).
   - **Clipping:**
     - On phone, the hero pause is cut by the stage: 4px at 375, 7px at 320.
     - The window bar's three dots squash into 4–5px slits at 375.
     - On phone, "Ctrl" overflows its key cap (46px of text in a 35px cap) and reads "Ctr".
     - In the term tile, scrollback lines run through the "$ ▮" line.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The product is the hero, Settle runs on scroll, and the chapters pin and swap.
   - **motion.dev:** the tree's layout re-flow now reads. Browser/Phone isn't a gliding pill.
   - **synchronized.studio:** n/a (no cards).
   - **osply/hamol pointer detail:** only the magnetic ask and the machine slide.
8. **Different from its neighbours?** Yes, mostly.
   - It no longer has /sign and /risk's title-left, stage-right first screen (contact sheet kept by the critic).
   - A one-line h1 over a full-width dark app window with its own tree is its own hero.
   - It still shares the "title row over a wide stage" layout with /ui and /treasury, and the PinChapters rail with a sideways mono title with /sign.
9. **Are all 18 parts covered?** No; see below. Six of the card's claims fail the walk.
10. **Banned tells?** None outright.
    - 0 hued values in `<main>` at 1470, 375 and 320. The blue "Privacy choices" toggle is in the shared footer.
    - Nothing sits above the h1, there's no gradient text, and nothing fades on hover.
    - **Borderline:**
      - The magnetic ask is a spring: released at 19.4px, it overshoots to −0.6px. The rule is no springs and no overshoot, and the card says "no springs".
      - The keep tile's pane names render in italic, because `<i>` is the wrapper.
11. **Is the copy untouched?** Yes: `parity.py /tabs` gives text 26/26 and links 2/2. Still unlisted on the card for James:
    - Hanzo's order is hero, Link a machine, Why it is shaped this way, What you get. Here, Link moves after Why.
    - Hanzo's section heading "Why it is shaped this way" is now a 13px `aria-hidden` rail label (14px on phone).

## Missing from the 18 parts (MASTER part 2, measured)
- **Gate and part 1:**
  - The hero is a hand-written `function Hero`, not `PageHero`.
  - The first screen shows two solid fills: the shared header's and the hero's.
  - The lede misses the first screen at both widths. The h1 baseline sits at 29% of the height (target 38%), and nothing of the next section peeks.
- **Part 3:** there's no Band. The page ends on a lone `.w2-cta` and about 165px of black, then the footer.
- **Part 4:** the card says "sticky ask in header and bar after the hero, same label". The header carries "Try Hanzo", there's no desktop bar, and no phone bar appeared at rest.
- **Part 6:**
  - Desktop text under 13px that isn't mono capitals and isn't `aria-hidden`: pane names, "layout" and "split ⇄/⇅" at 12.5px.
  - Phone art under 14px, `aria-hidden`: "server" at 11.2px, "tmux · build" at 13px.
  - The page called Tabs doesn't use the kit `<Tabs>`. The radiogroup drops focus on arrow keys, and the dots form a tablist with no panels.
- **Part 7:** 23 distinct literal hexes in `Tabs.css`.
  - Many are off the deck ramp: #f5f5f7, #a1a1a6, #d1d1d6, #86868b, #d2d2d7 and #e3e3e8.
  - There are blue-cast near-blacks: #1c1c20, #26262b, #2c2c32, #3a3a40 and #48484f.
  - The card calls these "deck-grey literals".
- **Part 8:**
  - The focus ring is invisible on 15 stops. The Browser/Phone radio (one stop), Pause and the 12 pane buttons draw a 2px #0a0a0b ring on #141417–#3a3a3c, and Copy draws one inside its black pill. The card says the "focus ring is visible on every stop".
  - The keep tile animates `flex-grow` and `padding` (only transform, opacity and clip-path are allowed).
- **Part 9:**
  - The card says "no springs: every transition is ease-emphasis 300ms". The magnetic ask is a spring, and the CSS uses .15s, .2s, .25s, .35s, .4s and .5s with the default `ease`.
  - The map's packets run at page load, not on arrival.
  - Passes:
    - Reduced motion is fully still: 0 running animations after 3.5 s and no self-splits.
    - Pause stops the tree and the chapter loops.
    - The motion mix covers idle, pointer, state, arrival and scroll.
- **Part 11:**
  - On phone the chapters pin instead of stacking.
  - The hero pause is clipped, the window dots are squashed, and "Ctrl" is clipped.
  - The phone tree is cut in its 180px box.
- **Part 12:** the dark-room loops (scrollback 7 s, keep 4.8 s, keys 4.2 s, all infinite) have no pause control. Hover holds them, which does nothing on touch or keyboard. The card says "pause control on every moving item".
- **Part 13:** the h1 sits at byte 24,476 of the server HTML, past the first 14 KB. That's mostly the shared head and header.
- **Coverage card:**
  - Parts 4, 6, 8, 9, 11 and 12 claim things the walk disproves.
  - Part 2 says the shared chrome has no skip link. It has one (`.x-skip`, "Skip to content").
  - The copy-questions line lacks the section reorder and the demoted heading.
- **Passing:**
  - One h1 and one `<main id="main">`.
  - JS off: every word is legible at both widths (1 hidden run on phone, the URL, by design).
  - No raw img, video, table or `.x-btn`, and 0 `title=`.
  - `data-cta` ×3 and `data-thumb` ×2.
  - Canonical and title from `content/pages.json`.
  - Taste OK, parity 26/26.

## Fixes (in order)
1. **Repair "Closing a pane loses nothing".**
   - The old v2 rules still win: `.xtb-tile.keep i { width: 30%; height: 72px }` and `.xtb-tile.keep i:nth-child(2) { background: #f5f5f7 }`. They make the "work" pane a blank white block with a white label, and leave a 48px black band under 72px panes. Delete both rules.
   - Set `font-style: normal` on `.xtb-keep i` (the labels are italic).
   - Animate the close and reopen with `transform: scaleX` and opacity, or a clip-path, on a pane of fixed width. Today it's `flex-grow` and `padding`, which shifts layout every 4.8 s.
2. **Wake the second half.**
   - Start the map's packets when `.xtb-map` is half in view (toggle a class from `useLive`), not at page load.
   - Make the machine hover tell you something: hovering "a GPU box" sends its packet and lights its pane in the mini window. On phone, where the wires are hidden, light the mini window's panes in turn.
   - Hovering a tree leaf should light its pane in the window.
3. **Make focus visible in the dark window.**
   - Put `data-room="dark"` on `.xtb-stage` and `.xtb-cmd`, so the shared ring turns #f5f5f7, or set `.xtb-stage :focus-visible { outline-color: #fafafa }`.
   - Acceptance: a tab crawl shows a ring of at least 3:1 on all 15 stops.
4. **End on a Band, not a lone button.**
   - Close with the kit Band in the page's own words, with "Open Tabs" as its one ask. Give it a small live object (the window at rest, its tree settled), so the last screen isn't still.
   - Cut the 165px of empty black under it.
5. **Phone polish.**
   - Let the key caps size to their labels, for example `grid-template-columns: repeat(3, auto) repeat(4, 1fr)`, so "Ctrl" fits.
   - Give `.xtb-win-bar > i` `flex: none` (the dots squash to 4px).
   - Bring the hero pause inside the stage (it is cut 4px at 375 and 7px at 320).
   - Let the phone tree grow to its content, or lay it out across, instead of a 180px box that scrolls.
   - Stack the chapters on phone instead of pinning the visual on top.
6. **Use the kit `<Tabs>` for Browser/Phone,** with a gliding thumb, arrows that move focus, and Home/End. Turn the phone dots into plain buttons with `aria-current`, or real tabs with panels.
7. **Put the lede on the first screen.**
   - Desktop: set it beside the ask on the h1 row, or under the h1 before the window. Let the window peek, so the h1 baseline moves toward 38%.
   - Phone: move it above the window.
8. **Hygiene, then the card.**
   - Map the 23 literals onto the deck ramp: #f5f5f7 → #f5f5f5, #a1a1a6 → #a3a3a3, #86868b → #737373, #1c1c20 → #171717, #26262b → #262626, #0b0b0c → #0a0a0a, and so on.
   - Replace `Magnetic` (it overshoots) with a 300ms ease-emphasis tween, or drop it.
   - Move transitions onto the deck durations.
   - Add a pause, or pause-when-off-screen, to the dark-room loops.
   - Raise the desktop pane and tree labels to 13px.
   - Correct parts 2, 4, 6, 8, 9, 11 and 12 of the card. Add the section reorder and the demoted heading to the copy questions.
   - File `docs/requests/tabs.md` asking the shared owner to let `data-thumb` put the page's own words in the header ("Open Tabs"), so the first screen stops showing two solid pills with different verbs.
