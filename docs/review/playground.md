# /playground: James-eye review

Verdict: 6/10
First complaint: "The top is good, a real Playground running on our own pictures, but the window's right side just fades into the page. Then I scroll for nearly four screens and all that happens is one word goes bold next to a code box that's half empty. In the film wall an 'Open' label chases my cursor, which I said I don't want. And once the top has gone there's no button to open the Playground until the very end."

Reviewed: branch `claude/elegant-johnson-b2vx1q` @ `9898ac2`. The page files last changed at `c9784eb`; the Cloud 3 kit (`LaunchType`, `SettleStage`, `LaunchClose`, `RelatedCards`) changed at `3f456ca`. Files hash (Playground.jsx + .css + page.jsx): `cfd7a21d0c4d`.
Walked 7 Nov 14:34–15:02 UTC on the dev server, moving, at 1470×801, 375×812 and 390×664. I walked it once at `c9784eb` with the old kit and again after `3f456ca` landed; the verdict is on the second walk. I kept videos, frame sheets, a hover/press log and probe JSON. The once-per-visit loader was skipped, except for one walk with it on. The bar is the current `MASTER.md` and `JAMES.md` (scale rhythm, nothing floats, deck greys, flat surfaces, no springs).
Proof: `img/playground.jpg` (desktop first screen | phone first screen; the Next dev badge is hidden in the shot).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, with three blemishes.
   - What works: the first screen has the 52px h1, the lede, one solid ask and the Playground window running beside it, at 1470×801 and at 375×812. At 390×664 you see only the window's bar, its tabs and about 60px of canvas. Iro's tiles start clearing at first paint (CSS, no JS needed) and the meter fills. The eight kinds take turns every 3.8 s, and hovering a kind previews it. It sells.
   - The window's right and bottom edges have no line. The white run panel dissolves into the white page, so the box looks unfinished. The kit's hairline is an inset shadow painted under `.pg-win`'s opaque fill, and `3f456ca` removed the drop shadow that used to define the edge.
   - The window jumps about 40px up and left in a single frame when the page hydrates, with no input. `SettleStage` server-renders at scale 1.08 and +48px, then snaps to settled because the stage is already past its end offset. That was about 1.5 s after paint on the dev server.
   - On phones the running kind is off the right end of the tab strip. At 375, "Image" sits at x 399–465 and the strip ends at 359, so the window runs a kind with no tab lit.
2. **One in, one out, or a document?** Mostly one in, one out. The order is hero → the pinned "first request" scene → the dark room (ClipWipe) with the model wall → related → close.
   - The pinned scene is the weak stretch. It has four states over 3,044px, which is 3.8 screens at 1470×801. Three of the four states only bold one phrase and mark one token.
   - Meanwhile the curl card stays half empty: 3 lines in a card sized for the 12-line Python pane.
   - Related, then close, ends as a document.
3. **A real object in every section?** Yes at section level:
   - the live window;
   - Hanzo's own curl and Python;
   - nine model renders with one film playing (the best block on the page, and JAMES 6 met);
   - Sigil art on the related cards and the close.

   Inside the window it is weaker:
   - Chat and Completions are grey skeleton bars that read as "still loading".
   - The Model row says `zen` while the canvas shows Iro, Koma or Kai.
   - Audio is a generic CSS waveform, though Oto and Koe have their own films on this same page.
4. **One ask in the sticky header, nothing floating, scale with rhythm?** No.
   - Per viewport it is right: at most one solid button at every stop.
   - But from the end of the hero to the close (about 5 screens) there is **no solid ask anywhere**. `Playground.css` line 6 forces the header's "Try Hanzo" to an outline on this page, so the header never carries a solid ask.
   - The site's ask bar is shared chrome and not scored here. It did not arrive in any plain scroll walk at this HEAD, on desktop or phone, and the same is true on /s3 and /pubsub. In one run it did arrive, and sat over the last line of the agent prompt.
   - Something floats: the wall tiles carry `data-cursor="Open"`, so an "Open" chip follows the pointer (MASTER 3.3 banned list). `3f456ca` removed the same thing from RelatedCards, but the page keeps it.
   - Scale:
     - The h1 at 52 and "Get Playground" growing from 26 to 64 are right.
     - The first-request sentence and "Paste and ship" are set at `clamp(36px, 3.9vw, 56px)`, which is 56px. That is bigger than the h1, never settles, is off the deck scale (52/64) and is weight 600 against Book 497.
     - The 21px h2 "Then the same request from code" sits over the 56px sentence and reads as a kicker.
5. **Does every hover and press answer?** Almost all.

   | Control | Hover | Press |
   |---|---|---|
   | Hero ask | fill #0a0a0a → #262626 | .97 |
   | Read the API | border turns ink | .97 |
   | Pauses | fill | .97 |
   | Kind tabs | preview the run (the hover tells you something) | .98 |
   | curl/python | fill and ink | .98 |
   | Copy | ring | .92 |
   | Wall tiles | ring, picture 1.05, label flips, its film plays | .98 |
   | Related cards | fill and 70px art drift | .97 |
   | Close ask | magnetic, fill | .97 |

   Two fail:
   - **The phrases change weight 480 → 700** on hover and on scroll. That widens "a model name" from 338 to 351px and pushes ", and" sideways: a layout jump, logged as layout-shift on `#text , and`.
   - "Deploy to Cloud" has no press state.
6. **Overlap, font swap, layout shift?**
   - The page itself causes no overlap at 1470×801 or 375×812. The red "1 Issue" badge is a hydration mismatch in the shared `FooterHTML`, not this page.
   - The h1 box is steady.
   - CLS is 0.016 on desktop, 0.005 at 375 and 0.046 at 390×664. The phone figure comes from the code card changing height when Python swaps in.
   - At 320 the hero ask's label overflows its pill (the "O" is cut). At 375 its arrow is squeezed to 0.8px. The cause is `.pg-acts { flex-wrap: nowrap }`.
   - The 40px hero snap (answer 1) is the visible jump.
7. **Which reference, and is its motion there?**
   - apple.com, yes: the product as the hero, and a pinned scene where one panel changes.
   - osply/hamol pointer details, yes: hover-to-preview kinds and the magnetic close.
   - synchronized.studio, no. The tiles carry `data-morph`, but clicking Kai or Koma cut straight to the model page in about 0.5 s with no picture carried across. On a cold route the Playground's own hero flashed for about 0.8 s first (dev server).
8. **Different from its neighbours?** Partly.
   - Its own: the hero medium (a running Playground window on Hanzo's model media), the film wall and the "beyond" (the anatomy of a first request).
   - Shared: the plainest Cloud 3 composition (copy left 5fr, window right 7fr). The section order (hero → pinned scene → dark Paste room → related → Get X) is the same skeleton as /s3, /registry, /node and /mq.
   - /pubsub, /s3, /registry and /node vary their hero layout more. `unique.py` passes.
9. **All 18 parts covered?** No; see below. `docs/coverage/playground.md` is still the old numbered list, with no tick boxes and no `Done here:` lines, so the board counts 0 of 18. Several of its claims are false at this HEAD.
10. **Banned tells?** Yes:
   - The cursor-following "Open" label on the wall (MASTER 3.3).
   - Springs and overshoot (MASTER 3.1, "no springs, no overshoot"):
     - the kind pill (`layoutId` spring 420/34);
     - the Decisions nodes (spring 300/18);
     - the picked node (scale 0 → 1.25 → 1).
   - Shadows on things that do not float:
     - `.pg-req` (`0 40px 100px -40px`);
     - `.pg-input`;
     - the selected curl/python thumb.
   - 14 off-deck greys across 44 hex uses in `Playground.css`: #f5f5f7, #6e6e73, #8e8e93, #aeaeb2, #a1a1a6, #ececf0, #e0e0e5, #e3e3e6, #d9d9de, #f2f2f4, #f1f1f4, #fbfbfd, #161618 and #111. `taste.py` passes them because they carry no chroma, but MASTER 3.1 makes the deck ramp the only values.
   - Clean: 0 UI hues in the computed styles of `main` (the only one on the screen is the footer's blue privacy icon), no eyebrow over the h1, no `title=` in the page, no gradient text.
11. **Copy untouched?** Yes. Parity is 48/48 text and 7/7 links. The window adds UI labels that are not in `content/ui-strings.json` (gate 4): Tokens in, Tokens out, Time, Cost, Model, "Run ·", found, and the aria labels "Kind of run" and "This run". Copy decision 5 (the Python block calls `KeysApi.get_keys()`) is correctly left to James.

## Missing from the 18 parts (MASTER part 2, measured)
- **Coverage card:** it is in the old format, so 0/18 `Done here:` lines. These claims are false at this HEAD:
  - "carried by the site's sticky ask bar": not seen in plain walks.
  - "colour comes only from Iro, Koma and Kai" and "in full colour": all nine renders and films are pure greyscale (mean chroma 0.0), so the page has no colour at all. That is fine under the deck, but the card is wrong.
  - "related cards lift": the kit changed that.
  - "no text under 14px" on phones: there are 8 runs at 12–13px, all kit captions (Agent prompt, api, /v1/chat/completions, Related capabilities, License, Apache-2.0, hanzoai). MASTER allows captions at that size.
  - "hero buttons on one row": true, but the ask clips at 320 and 375.
- **Part 1, Strategy:** no solid ask between the hero and the close; page CSS line 6 outlines the header's ask.
- **Part 3, First impression:** the hero snaps at hydration. The hero is a hand-written section, not `PageHero` (the same is true of its siblings).
- **Part 6, Content:**
  - The 56px statements are off the scale.
  - An h2 is smaller than the paragraph it heads.
  - ", and" stays grey when the whole sentence is lit.
- **Part 7, Visual system:**
  - off-deck greys;
  - shadows on the code card and the composer;
  - radii of 10, 14 and 22px, which are off the deck list;
  - the window has no right or bottom edge.
- **Part 8, Components:**
  - The kinds are `role=tab` with no tabpanel and no arrow keys.
  - The inactive code pane sits on top of the active one (opacity 0, `pointer-events: auto`, not `inert`). Pointer and text selection over the curl land in the hidden Python pane, on desktop and phone.
- **Part 9, Motion:**
  - springs and overshoot;
  - the weight-change reflow;
  - moves that are not scene moves but run past 500 ms: the phrase weight (.6 s), the tile picture (.9 s), the meter fill (1.2 s).
- **Part 10, Media:**
  - The wall loads 1200×1500 sources for 115–250px tiles, with no `srcset` or `sizes`. On the phone walk the bottom row (Mori, Oto, Uta) arrived as blank grey tiles at scroll pace (dev server).
  - The Audio kind ignores Oto and Koe's own media.
- **Part 11, Mobile:**
  - The running kind is hidden off the tab strip.
  - The ask clips at 320 and its arrow is crushed at 375.
  - CLS is 0.046 at 390×664.
- **Part 12, Accessibility:** the hidden code pane stays in the reading order and on top; the tabs have no arrow keys.
- **Gate 4:** the window's labels are not in the UI-string register.
- **Passing:**
  - one h1 and one `main`;
  - parity 48/48 + 7/7;
  - 0 computed UI hues;
  - no horizontal scroll at 320;
  - every phone target ≥44px;
  - reduced motion at rest (0 running animations, 0 films playing);
  - JS off legible (nothing hidden; the first-request scene unpins into reading order);
  - `data-cta` and `data-thumb` on both primaries;
  - `taste.py`, `unique.py` and `variety.py` pass;
  - one film at a time with a 44px pause;
  - no `setInterval`.

## Fixes (in order)
1. **Nothing floats.** Delete `data-cursor="Open"` from the wall tiles. Keep the ring, the film and the label flip.
2. **One solid ask after the hero.** Delete `Playground.css` line 6, so the header's ask is solid once the hero ask has scrolled away. Alternatively, ask the Chrome owner for the header to carry "Open the Playground" on this page. Note for the Ask.jsx owner: the shared bar does not arrive on /playground, /s3 or /pubsub at this HEAD, and when it does arrive it covers the agent prompt.
3. **Finish the hero window.**
   - Outline `.pg-win` itself with a 1px ring at 10% black on the window, not an inset shadow under it, so its right and bottom edges exist.
   - Start `SettleStage` settled when its stage is already past the end offset at load, so it never jumps 40px on hydration.
   - On phones, scroll the lit kind into view in the tab strip on every change.
4. **Tighten the first-request scene.**
   - About 240svh, not 380.
   - Size the card to the pane that is showing (no empty half).
   - Make the off pane `inert`, `pointer-events: none` and `aria-hidden`.
   - Light a phrase with ink and its underline only, with no weight change, so nothing reflows. Light ", and" at the end too.
   - Set the sentence at 52 or 64 in Book 497.
   - Outline the card instead of shadowing it.
5. **No springs.** Run the kind pill and the tree nodes on ease-emphasis at 300 ms, and drop the 1.25 overshoot.
6. **Deck tokens only.**
   - Map the 14 greys to the deck: #f5f5f7 → #f5f5f5, #6e6e73 → #737373, #8e8e93/#aeaeb2/#a1a1a6 → #a3a3a3, #ececf0/#e0e0e5/#e3e3e6 → #ededed/#e4e4e7, #d9d9de → #d4d4d4, #161618/#111 → #171717.
   - Radii to 6, 8, 12, 16 or 24.
   - Drop the `.pg-input` shadow.
7. **Phone asks.** Let `.pg-acts` wrap below 360px, or give the arrow `flex: none`, so "Open the Playground" never clips.
8. **Make the window logical.**
   - The Model row should name the model whose media is on screen (Iro, Koma, Kai are already on the page).
   - Give Audio Oto's or Koe's own film.
   - Replace the grey skeleton bars in Chat and Completions, which read as loading.
9. **Paperwork.**
   - Rewrite `docs/coverage/playground.md` on `_TEMPLATE.md` with 18 `Done here:` lines, and correct the false claims.
   - Request the window's labels in `ui-strings.json`.
   - Give the wall images `sizes` with a 480px source.
