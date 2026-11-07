# /tabs: James-eye review

Verdict: 5/10
First complaint: "The tree is the whole point of this page, and it's broken. Every time a pane splits, the tree beside it shows a ghost box and a stretched black blob with squashed text. It looks like a glitch, not a product. Then on my phone the first screen is a headline and a paragraph. The panes don't even have names, and nothing moves."

Reviewed: branch `claude/youthful-gauss-hiiqm9`. The walk started at `622a356`. The branch moved three times during the review: `8aa94d9` and `00b5029` changed `Tabs.jsx`/`Tabs.css`, `Scale.css` and `PinChapters`; `8ab6fa7` changed `Settle`/`LineMask` for reduced motion; `2daa8e8` fixed the stale "terminal-green" comment in `app/tabs/page.jsx`. Every finding below was re-checked on `2daa8e8`. Files hash (sha256 of `Tabs.jsx`, `Tabs.css`, `tabsTree.js` and `app/tabs/page.jsx`, first 12 characters): `016f7da79ab5`.
Walked 7 Nov 14:05–14:35 UTC on the dev server, moving, at 1470×801 and 375×812 with touch emulation. The critic kept screencasts, load-burst frames, a tree-state sampler (every 100ms for 12s), a hover and press probe, and a JS-off render. The cookie note was skipped.
Proof: `img/tabs.jpg`. Top row: desktop first screen and phone first screen. Bottom row: the hero window on desktop with four panes while the tree shows a ghost "split ⇅" and a stretched "shell 4" blob.

## The 11 answers
1. **Does it sell in 5 seconds, and does something move within 1 second?**
   - **Desktop: yes, mostly.** The headline is 111.7px with a line height of 0.92, it cuts in, and the lede rises 14px. The tiling window peeks from y=533, showing the "build" and "work" pane bars and their first lines. The first self-split comes at 1.3s inside that strip.
   - **Phone: no.** After the 1.1s cut-in, nothing moves except a blinking cursor in the bottom 30px. The window's top edge is at y=724 and pane content starts at y=837, below the fold, so the first screen shows no shell. The self-running tree doesn't start because `useLive(0.3)` needs 30% of the 760px stage in view and only 26% is.
2. **One in, one out, or a document?** Half and half.
   - The three pinned chapters work on desktop: one chapter swaps in while its diagram changes (packets with the server struck out, the URL naming sessions, a pane closing so its sibling takes the space).
   - Every section boundary has a dead band of 220–440px. At scroll 801 the stage ends at y=310 and "There is no backend" starts at y=720. At scroll 4005 there are 440px of nothing above "Link a machine". There are about 350px above "What you get", and 220px of empty black before the footer.
   - On phone, each chapter's `min-height: 62svh` leaves about 230px of blank after its text.
3. **Does every section hold a real object?**
   - **Hero: yes,** the best object in this batch: a tiling window plus its layout tree.
   - **Chapters: yes,** three diagrams.
   - **"Link a machine": yes,** a map of three machines wired to a tabs.hanzo.ai tile. Its packets run twice when it scrolls into view, then the map is still.
   - **"What you get": no.** The four tiles hold glyphs: "$▮", three grey bars, key caps and an outlined "MIT". The "Closing a pane loses nothing" tile is three grey rectangles that show nothing about closing.
4. **One ask, sticky after the hero?** Nearly.
   - "Open Tabs" is Hanzo's words, solid in the hero with `data-thumb` and `data-cta="tabs.hero"`, and the ask bar carries it after the hero.
   - From scroll ≈450 to ≈1250 on desktop, the stage is still on screen but the hero button isn't. In that range the only solid on screen is the header's "Try Hanzo", a different verb. This is shared-system behaviour.
   - At the dark room, two solid "Open Tabs" share the screen at both widths: the close button and the ask bar. Desktop: scroll ≈4800–5200. Phone: ≈4060–4470. The close button has `data-cta` but no `data-thumb`, so the bar doesn't step aside.
5. **Does every hover and press answer, with no jumps?** Partly. Tested with hover-capable pointer emulation.
   - **Answer well:**
     - The hero ask darkens from #0a0a0b to #2c2c2e, its ↗ nudges 3px, it has a magnetic pull, and press is scale 0.98.
     - The ghost button gets a border and a 6% fill.
     - Pane buttons get a #26262b fill.
     - The rail now inks and stretches its bar on hover.
     - Key caps press to 0.94, and Copy presses to 0.92.
   - **Weak:**
     - The close ask on dark goes from #f5f5f7 to #fff, which you can't see, and it has no arrow.
     - Browser/Phone changes text colour only.
   - **Dead:**
     - The machine cards.
     - The four dark tiles.
     - The tree leaves (no detail).
     - The black "tabs.hanzo.ai · Open Tabs" tile in the machine map. It looks like a button but is an `aria-hidden` div, so tapping it does nothing.
   - **Jumps:** none.
6. **Overlaps, font swap or layout shift?**
   - The h1 box never moves at either width, so there is no font swap. CLS is 0.001 on desktop. There is no horizontal scroll at 320 or 375.
   - On phone, CLS is 0.0135, all from `.xtb-v.tree`: chapter 3's diagram grows from 259px to 281px every 1.8s when its note wraps to two lines. The visual that says "nothing else moves" jumps 22px.
   - **Overlaps:**
     - The broken tree, above all: a stretched leaf drawn over the tree column.
     - On phone, the chapter-3 pause button sits on the "work" pane.
     - On desktop, the ask bar covers the "a GPU box" lane of the map at scroll 4005.
     - On phone, panes clip their own controls (see fix 3).
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. The hero stage settles on scroll, and the chapters pin and swap.
   - **synchronized.studio card-open:** none.
   - **anthropic launch:** no hero figure. "10k lines" stays inside a paragraph.
   - **Pointer-aware details** (osply, hamol): only the magnetic ask.
8. **Different from its neighbours?** The object is, the composition isn't.
   - /tabs shares the first screen of /sign, /risk, /ui and /treasury (contact sheet kept by the critic):
     - a giant two-line title on the left, the lede and one button on the right;
     - a grey stage on the fold with a 13px uppercase, 0.12em-tracked mono label at top left ("HANZO TABS" here, "DOCUMENT SIGNING" and "RISK" there);
     - a pause disc at top right;
     - Settle, then PinChapters with a numbered rail, then a grey two-column section, then a dark tile room.
   - The live tiling window is the page's own idea. Its layout isn't.
9. **Are all 18 parts covered?** No; see below. `docs/coverage/tabs.md` exists but overstates parts 8, 11 and 12, and it lacks the ledger entry and the contact sheet.
10. **Banned tells?** None outright.
    - 0 hued values were computed anywhere in `<main>` at 1470, 375 and 320. No green.
    - Nothing sits above the h1. No gradient text, no browser-default controls, and nothing fades on hover.
    - Borderline:
      - "HANZO TABS" is styled exactly like the eyebrow it replaced.
      - The dark room's 2×2 grid of glyph-plus-title-plus-paragraph boxes reads close to "icon boxes".
11. **Copy untouched?** Yes: `scripts/parity.py /tabs` gives text 26/26 and links 2/2.
    - **Visible control labels outside the register:** "Browser", "Phone" and "Reset" aren't in `content/ui-strings.json` (override 2: icon plus aria-label until James approves).
    - **Demo labels in the art:** "layout", "split ⇄", "shell 3", "closed · the sibling takes the space", "split ⇅ · two siblings" and "its own network · nothing exposed". They paraphrase Hanzo's sentences and make no claims, which is acceptable.
    - **Section order changed:** Hanzo's order is hero, Link a machine, Why it is shaped this way, What you get. Here, Link a machine moves after the chapters.
    - **A heading demoted:** Hanzo's section heading "Why it is shaped this way" is now a sideways 13px mono rail title.
    - Flag both for James.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy and the §4 common gate:**
  - `Persona:`, `Goal:`, `CTA:` and the metric are in the header (pass).
  - The hero is a hand-written `function Hero`, not `PageHero`.
  - There's no closing Band: the dark room ends in 220px of black, then the footer.
  - No ledger entry (what the page deleted), no contact sheet, no rubric scores.
- **2.3 First impression:**
  - Phone fold: 0px of pane content in the first 660px (the plan asks for 80px or more of app). The window bar sits at y=724 and panes start at y=837.
  - JS off: every word is legible at both widths (pass).
- **2.4 Conversion:** two solid asks at the close. The close lacks `data-thumb`.
- **2.6 and 2.8, Tabs:** the page named Tabs doesn't use the kit `<Tabs>`.
  - Browser/Phone is a hand-rolled `role=radiogroup` with no arrow keys.
  - The phone dots are a `role=tablist` with no tabpanels and no arrow keys, the exact pattern §2.16 lists as a defect.
  - The selected thumb doesn't glide (JAMES.md 9: "tabs that morph").
- **2.6 Content:** on phone, every pane name is 0px wide. Product-art text under 14px on phone: "tabs.hanzo.ai" at 12.5px, "server" at 11.2px, "tmux · build" at 13px, all `aria-hidden`.
- **2.7 Visual system:** 18 distinct literal hexes in `Tabs.css`, including 9 near-blacks (#0a0a0b, #0b0b0c, #111113, #141417, #1c1c20, #1d1d20, #26262b, #2c2c30, #2c2c32). The plan's dark-room target is fewer than 5.
- **2.8 Components:** 4 bare `:hover` rules (`.xtb-seg`, `.xtb-reset`, `.xtb-pane-acts`, `.xtb-keyrow`). `aria-label` sits on the tree's plain `div`, which has no role, so it isn't announced.
- **2.9 Motion:**
  - The signature layout animation is broken: on desktop, 77–79% of 100ms samples show a node at opacity 0 or a leaf at scaleY ≈ 3.4. On phone it's 90%. In those runs, whenever a nested split existed, the tree was never legible: 0 of 78, 0 of 90 and 0 of 99 samples. One earlier sample run caught brief legible moments.
  - It fails the same way after your own split (proof, bottom row).
  - Three `setInterval` timers via `useEvery` (1.3s, 1.5s, 1.8s) rather than one rAF scheduler.
  - Passes: reduced motion is fully static, with 0 running animations and no self-splits. Pause stops both the React loop and the CSS loops.
  - The motion mix is good on paper: idle (tree, chapters), pointer (split/close, magnetic, swipe), state (Browser/Phone, key row) and scroll (Settle, pin).
- **2.11 Mobile:** at 375, a pane is 155px wide and its three 44px buttons take all of it. After one split, the 77px panes show only "Split right"; "Split down" and "Close" are clipped by `overflow: hidden`, so you can't close those panes on a phone.
- **2.12 Accessibility:**
  - The radiogroup has no arrow keys, and the tablist has no tabpanels.
  - The chapter-3 pause button overlaps content on phone.
  - Otherwise good: one h1, one main, every pane button labelled ("Close shell 3").
- **2.16 Developer experience:** Copy gives "hanzo link" for a displayed "$ hanzo link". That's fine, but the plan prefers a `user-select: none` prefix.
- **2.17 States:** Reset returns to the start, and the last pane can't be closed (pass).
- **Coverage doc:** it claims "targets are 44px" (they clip), "every pane control has a label" (true, but on phone you can't reach them) and APG-shaped roles (no keys). It has no ledger entry or contact sheet.

## Fixes (in order)
1. **Fix the tree. It is the signature and it's broken on every split.**
   - Likely cause: `Tree` and `Panes` render their two children without `key`. React then reuses a leaf's `<motion.li>` as the new split node and swaps its `layoutId` mid-flight (for example `xtb-t-p2` to `xtb-t-s3`). The nested `layout="position"` plus `layoutId` then leave the new node at opacity 0 and its children at `scale(1.16, 3.41)`.
   - Fix:
     - Key each child by id: `<Tree key={t.a.id} …/>`, and the same in `Panes`.
     - Put the window and the tree in one `LayoutGroup`.
     - Give a new split node its own small enter (opacity and scale) instead of a shared `layoutId`.
   - Acceptance: sampling every 100ms for 12s, no `.xtb-tree li` has opacity under 1 or scaleY ≠ 1 more than 600ms after a change, for both the self-running script and a user split.
2. **Put a running shell on the phone's first screen.**
   - Lift the stage so that at least 80px of pane content shows within 660px. Today the stage starts at y=611 with 104px of hero padding and a wide CTA-to-stage gap.
   - Start the self-running tree at about 15% visibility instead of 30%.
   - Acceptance: at 375×812 a split happens within 2s with no input.
3. **Make panes usable on a phone.**
   - On coarse pointers, fold the three actions into one 44px "⋯" (icon with an aria-label), or draw 28px glyphs with 44px `::after` hit areas.
   - Keep at least 4ch of the pane name.
   - Cap phone splits at the width where Close still fits.
4. **One solid at the close.**
   - Add `data-thumb="Open Tabs"` to the dark room's "Open Tabs" so the bar steps aside.
   - Give that button the hero's ↗ nudge, since its #f5f5f7 → #fff hover can't be seen.
   - Make the map's black "Open Tabs" tile a real link (same href, `data-cta`), or take away its button look.
5. **Close the dead bands.** Bring the gaps between sections down from 300–440px to the CANON rhythm (about 160px). End the dark room in a Band, not 220px of black. On phone, drop the chapters' 62svh minimum that leaves about 230px of blank after each.
6. **Give the dark room objects, not glyphs.** Reuse the page's own parts:
   - "Closing a pane loses nothing": a pane closes, reopens by name, and its scrollback is intact.
   - "Your terminal, not a viewer": a scrollback strip you can page.
   - "Works on a phone": the phone flip with live key caps.
   - "MIT": the source link as the object.
7. **Use the kit `<Tabs>` for Browser/Phone,** with a gliding thumb, arrow keys and Home/End. Make the phone dots real tabs with panels, or plain buttons. Put "Browser", "Phone" and "Reset" in `ui-strings.json` for James, or make them icons with aria-labels.
8. **Break the template, then polish.**
   - Let the window itself be the composition, for example the first split cutting the hero into panes as you arrive, instead of the /sign, /risk and /ui title-left, stage-under layout. Drop the eyebrow-styled "HANZO TABS" label.
   - Reserve two lines for chapter 3's note so it stops jumping 22px.
   - Move the phone chapter-3 pause button off the "work" pane.
   - Tokenise the 18 literal hexes.
   - Wrap the 4 bare `:hover` rules in `@media (hover: hover)`.
   - Give the machine cards and tiles a hover that tells you something.
