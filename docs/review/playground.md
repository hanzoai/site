# /playground: James-eye review

Verdict: 6/10
First complaint: "The top's good, the Playground's really running. Then I scroll through five screens where nothing moves unless I do, just one word going bold next to a half-empty code box. And on this page even the Try Hanzo button up top has been made hollow, so once the top's gone there's nothing to press until the very end."

Reviewed: main @ `648b798` (last page commit `c9784eb`). Files hash: `e6de6830175d`
Walked 7 Nov 15:10–15:14 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/playground.jpg` (desktop first screen | phone first screen).

## Since the last review
- **The page itself has not changed.** `Playground.jsx`, `Playground.css` and `page.jsx` last changed at `c9784eb` (14:33), before the last review. Every change below comes from the shared system (the merges up to `648b798`), not from the builder.
- **Done by the shared system: nothing floats, and the red badge is gone.**
  - The cursor-following "Open" label on the wall is gone site-wide. `data-cursor="Open"` is still on line 253, but it now does nothing.
  - There is no desktop pill bar. The phone bar shows only at s2–s3, as a quiet white bar over the empty grey under the code card.
  - The walk found no floats and no overlaps at either width, and 0 console errors at either width (the last review had a red "1 Issue" badge).
  - Through the kit, "Paste and ship" now rests at 26px (it was 56px).
- **Worse: the ask.** The system now makes the header's "Try Hanzo" the one solid ask at every width ("it never outlines"). `Playground.css` line 6 still outlines it on this page, so on desktop nothing solid carries the ask from s1 to s8 (answer 4).
- **Still open, all with fresh evidence:**
  - the hero window's snap at load, and its missing right and bottom edge (answer 1);
  - the lit kind off the end of the phone tab strip;
  - the pinned scene, now measured as five STILL screens in a row (answer 2), with its half-empty curl card;
  - the 480→700 weight reflow on the phrases (JUMP);
  - the springs, the shadows on things that don't float, and the off-deck greys and radii;
  - "Deploy to Cloud", still dead with no press;
  - the coverage card, still the old list with false claims.
- **New:** each time Video comes round, the canvas goes blank for about 1.2 s. The proof image caught it.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, with four blemishes.
   - Desktop: all of this fits inside 801px:
     - the 52px h1 "Try a model, then ship it" on two lines (cut in by line mask; the mask shows at 2.8 s in the film);
     - the lede;
     - "Open the Playground" (y 518) and "Read the API";
     - the running window.

     Iro's tiles clear and the meter fills. Moving frames in the first second after paint: 6/25; s0 shotdiff 25.2. Paint came at 2.76 s, which is the dev server's first compile on the first walk, so I don't score it.
   - Phone: the 40px h1, the lede, both buttons and the window's bar, tabs and about 230px of canvas fit inside 812px. 8/25 frames move in the first second, and s0 shotdiff is 12.9.
   - **The window snaps.** At 4.6→4.8 s in the film (about 1.9 s after paint) the window shrinks by about 7% and jumps about 50px up in one frame, with no input. `SettleStage` server-renders it scaled and offset, then snaps it to rest.
   - **A blank canvas.** Each time the kinds reach Video, the canvas fades to a blank pale grey and the meter empties for about 1.2 s before Koma's film shows (film 9.0–10.2 s, `d-shot-00-b`, and the proof itself). It reads as "still loading".
   - **No edge.** The window's right and bottom edges have no line, so the white run panel runs into the white page (proof, left half).
   - **Phone tabs.** From Image onwards the lit kind is off the right end of the tab strip ("Embeddi" is the last tab you can see), so the window runs a kind with no tab lit.
2. **One in, one out, or a document?** Half. The order is:
   1. hero;
   2. the pinned "first request" scene;
   3. the dark room, which opens from a rounded black card to full width (as MASTER asks), with the nine-model wall;
   4. related;
   5. the close.

   - **Desktop, a dead stretch.** The pinned scene takes s1–s5 (3,250px), and all five screens are STILL (shotdiff 0 on each). Nothing there changes unless you scroll: one phrase goes bold and its token gets a black mark.
   - Add s7 (related) and s10 (footer), and 7 of 11 desktop screens are STILL. Only s0, s6 (the wall, 1.29), s8 (0.42) and s9 (0.59) move by themselves.
   - The code card stays half empty for curl: 3–4 lines in a card sized for Python's 12 (s2, s3).
   - Phone is better: s0, s1, s4, s5 and s6 move, and s2, s3 (the scene) and s7 (the close) are STILL.
   - After the wall it ends as the kit always does: related cards, then "Get Playground".
3. **A real object in every section?** Yes at section level:
   - the running window;
   - Hanzo's own curl and Python;
   - nine model renders with one film playing at a time (the best block on the page, and JAMES 6 met);
   - Sigil art on the related cards and the close.

   Inside the window it is weaker:
   - Chat and Completions draw grey bars (`#d9d9de`) that read as loading.
   - The Model row says `zen` while the canvas shows Iro, Koma or Kai.
   - Audio is a generic CSS waveform, though Oto and Koe have their own films on this page.
   - Video starts with the blank canvas from answer 1.
4. **One ask in the sticky header, nothing floating, scale with rhythm?** Floats pass. The ask fails on desktop. Scale is close.
   - **Floats:** none at either width, and no overlaps. The phone bar "Open the Playground →" shows only at s2–s3, under the code card, over empty grey.
   - **Ask:** `Playground.css` line 6 forces the header's "Try Hanzo" to an outline on this page. Every desktop screen shows it outlined, against SYSTEM.md §5 ("It stays solid; it never outlines").
     - From s1 to s8 (about 5,200px) there is no solid ask on desktop. The only fills there are the curl/python pill and Copy inside the scene.
     - Phone: the quiet bar carries "Open the Playground" at s2–s3 only.
     - The hero and the close each have one solid "Open the Playground".
   - **Scale:** mostly right. The h1 is 52px (40 on phone). "Paste and ship" and the related titles are 26px, and "Get Playground" is 64px (44 on phone): live hanzo.ai's rhythm.
     - The exception is the first-request sentence (`.pg-anat`). It rests at 56px, weight 600, for five screens (BIG×5 on s1–s5). That is bigger than the h1, off the deck's sizes, and never settles.
     - The 21px h2 above it, "Then the same request from code", is smaller than the paragraph it heads.
     - It is one big thing per screen, so not "everything big", but the biggest thing on the page is not the product.
5. **Every hover and press answers?** Mostly.
   - These answer on hover and press:
     - the hero ask (0.97);
     - "Read the API";
     - Pause (0.97);
     - Chat (0.98);
     - Copy (0.92);
     - Zen (0.99);
     - Kai;
     - Desktop (0.97);
     - API Keys (0.97).
   - Hovering a kind previews its run, which tells you something. Phone taps on Pause, Chat, "a message" and Copy answer.
   - These fail:
     - "a model name" and "a message" answer, but with a JUMP. The lit phrase goes from weight 480 to 700 (`.pg-ph.on`), widens, and pushes ", and" sideways.
     - "curl": dead hover plus a JUMP on desktop. On phone the tap shows nothing.
     - "A key": dead hover, and nothing on a phone tap. Scroll has already lit it, so it can't show it heard you.
     - "Deploy to Cloud": DEAD, with no press.
6. **Overlap, font swap, layout shift?**
   - Measured clean:
     - 0 overlaps at either width;
     - no horizontal scroll at 375 or 320;
     - the h1 box steady (one reading at each width);
     - CLS 0.015 on desktop (0.013 on the first-request grid) and 0 on phone.
   - But two visible jumps: the hero window's snap (answer 1) and the phrase reflow (answer 5).
   - Phone: the hero ask's arrow is missing at 375. `.pg-acts { flex-wrap: nowrap }` under 900px squeezes it to nothing.
   - 0 console errors at both widths.
7. **Which reference, and is its motion there?**
   - apple.com: yes. The product is the hero, and in the pinned scene one panel changes.
   - osply/hamol pointer details: yes. A kind previews on hover, and a wall tile picks its film.
   - synchronized.studio: the wall tiles and related cards carry `data-morph`, but this walk opened none, so it is unproven.
   - anthropic launch: n/a.
8. **Different from its neighbours?** The hero, yes; the rest, no.
   - Own: a running Playground window on Hanzo's model media. /metrics leads with a full-bleed chart under a one-line title, and /o11y with a centred title over a black room and a trace panel. The nine-model wall in the dark room is also its own.
   - Shared, Cloud 3 kit:
     - the same three-grey-dot window chrome as /metrics' "Hanzo Datastore" and /o11y's console;
     - a pinned scene with a rounded card on the right;
     - the `ClipWipe` dark room with "Paste and ship" and the same Agent prompt box as /o11y;
     - the same "RELATED CAPABILITIES" Sigil contour cards as /o11y;
     - the same "Get X" close ("Deploy to Cloud", "License: Apache-2.0", hanzoai and a Sigil card) as "Get O11y".
   - The order is the same skeleton as /metrics and /o11y: hero → pinned scene → dark Paste room → related → Get X. James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card has all 18 parts, in the old numbered form, but six of its claims fail the walk.
10. **Banned tells?** Yes:
    - **Visible jumps:** the hero window's 50px snap at load, and the phrase reflow on hover and scroll.
    - **A dead stretch:** five STILL screens in a row on desktop (s1–s5), and 7 of 11 STILL in all.
    - **Springs and overshoot** (the deck: "no springs, no overshoot"):
      - the kind pill (`layoutId`, spring 420/34, line 127);
      - the Decisions node (spring 300/18, line 61);
      - the picked node (`scale [0, 1.25, 1]`, line 62).

      While the pill glides, the old tab's label is white on white: "Image" measured 1.0:1 at both widths.
    - **Shadows on things that don't float:**
      - `.pg-req`, which is both outlined and shadowed (`0 40px 100px -40px`);
      - `.pg-input`;
      - the selected curl/python tab.
    - Clean:
      - no hue at either width;
      - nothing above the h1;
      - no floats;
      - no opacity-only hover;
      - 0 `title=` tooltips;
      - 0 console errors;
      - no audio code of its own (the shared kit ticks the tabs, taps the asks and chimes on Copy, and never on hover, scroll or load).
11. **Copy untouched?** Yes.
    - Parity is 48/48 text and 7/7 links.
    - The 18 new strings are:
      - the window's labels ("Run ·", "Tokens in", "Tokens out", "Time");
      - Hanzo's own curl and Python lines, lowercased by the diff;
      - the model names.

      None is a new claim.
    - The window's labels are not in `content/ui-strings.json` (gate 4).
    - The `KeysApi.get_keys()` question is correctly left to James.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/playground.md` is still the old numbered list. It has no `Done here:` lines and no three lines above part 1, so the board counts 0 of 18. These claims are false:
  - Part 4, "feeds the site's ask bar (desktop pill, phone thumb bar)": there is no desktop bar any more, and nothing solid carries the ask on desktop after the hero.
  - Part 7, "LaunchType scale (display.s 80, title 28, body 19)": the walk measures 52 / 26 / 64, plus the 56px sentence. Nothing is 80.
  - Part 7, "Colour comes only from Iro, Koma and Kai": every frame of them is greyscale. The page has no colour, which is fine, but the card (and the V2 line) say otherwise.
  - Part 9, "related cards lift": the kit's cards don't lift ("no lift" in `RelatedCards.css`). Hover deepens the fill and drifts the art.
  - Part 10, "in full colour with no filters": greyscale.
  - Part 11, "No text under 14px": 7 phone runs are 12–13px. "License: Apache-2.0" at 13px is not mono capitals.
  - Part 17, "Koma shows its poster until it can play": the canvas goes blank pale grey for about 1.2 s instead.
  - This caps the page at 7.
- **Parts 1 / 4, the ask:** page CSS line 6 outlines the header's "Try Hanzo", so desktop has no solid ask from s1 to s8.
- **Part 3, first impression:**
  - the hero snaps at load;
  - the hero is hand-written, not `PageHero`;
  - the middle of the desktop page is STILL for five screens;
  - the Video kind flashes blank.
- **Part 6, content:**
  - The 56px weight-600 sentence sits under a 21px h2.
  - ", and" stays grey when the rest of the sentence turns ink (s4).
- **Part 7, the visual system:**
  - The window has no right or bottom edge. The kit's hairline is an inset shadow painted under `.pg-win`'s white fill.
  - `.pg-req` is outlined and shadowed. `.pg-input` and the selected tab are shadowed.
  - 44 literal hex uses in `Playground.css`, 14 of them off the deck (`#f5f5f7` ×4, `#aeaeb2` ×3, `#8e8e93` ×3, `#f2f2f4`, `#ececf0`, `#6e6e73`, `#161618`, `#111` and others).
  - Radii of 10, 14 and 22px, which are not on the deck's list.
- **Part 8, components:**
  - The kinds are `role=tab` with no tabpanel and no arrow keys.
  - The off code pane is stacked under the on one at opacity 0, and not `inert`.
  - "Deploy to Cloud" has no hover change and no press.
- **Part 9, motion:**
  - the springs and the overshoot;
  - the phrase weight animates `font-variation-settings` for 0.6 s, which reflows the line, rather than moving by transform, opacity or clip;
  - five STILL screens on desktop.
- **Part 10, media:** Audio ignores Oto's and Koe's own films. Video shows no poster while Koma loads.
- **Part 11, mobile:** the lit kind is off the tab strip, and the hero ask's arrow is squeezed out at 375.
- **Part 12, accessibility:** "Image" measures 1.0:1 during the glide, and the tabs have no arrow keys.
- **Gate 4:** the window's labels are not in the UI-string register.
- Passing:
  - structure: one h1, visible with JS off; 0 hidden text with JS off; one main;
  - colour: no hue at either width;
  - layout: 0 overlaps and no float at either width; no horizontal scroll at 320; 0 tiny targets; 0 `title=`;
  - asks: 2 `data-cta` and 2 `data-thumb`;
  - motion: reduced motion settles (0 running after 3 s);
  - media and kit: no raw img, video or table; one film at a time on the wall, with a pause; the dark room opens from a rounded card; a Band at the end;
  - sound: from the shared kit only;
  - errors: 0 console errors;
  - header comment: Persona, Goal, CTA, Metric, Signature and Beyond are all there;
  - copy: parity 48/48 and 7/7.

## Fixes (in order)
1. **Give the ask back.**
   - Delete `Playground.css` line 6, so the header's "Try Hanzo" stays solid at every width, as SYSTEM.md §5 asks.
   - Keep "Open the Playground" solid in the hero and the close, and "Read the API" and "Deploy to Cloud" as the quiet ones.
2. **Make the first-request scene short and alive.**
   - Cut it from about 3,250px to about 240svh.
   - When it arrives, let it run itself once: "A key", "a model name" and "a message" light in turn, about 1.2 s apart, with their tokens marked, then hand over to scroll.
   - Size the card to the pane on show, so curl has no empty half.
   - Light a phrase with ink and its underline only, at a fixed weight, so nothing reflows. Light ", and" with the rest at the end.
   - Set the sentence at 44px in Book 497, below the h1 and on the deck scale.
   - Make the off pane `inert`.
3. **Steady and finish the hero window.**
   - Start `SettleStage` settled when its stage is already past the end offset at load, so it never snaps 50px.
   - Draw the 1px line at black 10% on `.pg-win` itself, so its right and bottom edges show.
   - Show `koma.webp` (already on the page) in the Video canvas until the film plays, instead of a blank panel.
   - On phones, scroll the lit kind into view in the tab strip on every change.
4. **No springs, no jumps.**
   - Run the kind pill and the tree nodes on ease-emphasis at 300 ms, and drop the 1.25 overshoot.
   - Fade the old tab's label with the pill, so "Image" is never white on white.
   - Ask the `LaunchClose` owner (`docs/requests/playground.md`) for a press on "Deploy to Cloud": translateY 1px, plus a hover beyond the underline.
5. **Flat, token-only surfaces.**
   - `.pg-req`: keep the outline and drop the `0 40px 100px` shadow. Drop the `.pg-input` and selected-tab shadows.
   - Map the 14 off-deck greys to the deck (`#f5f5f7` → `#f5f5f5`, `#6e6e73` → `#737373`, `#8e8e93`/`#aeaeb2`/`#a1a1a6` → `#a3a3a3`, `#d9d9de` → `#d4d4d4`, `#161618`/`#111` → `#171717`).
   - Radii 10 / 14 / 22 → 8 / 12 / 24.
6. **Make the card true.**
   - Rewrite `docs/coverage/playground.md` on `_TEMPLATE.md`, with 18 `Done here:` lines and the three lines above part 1.
   - Drop the false claims: the desktop pill, the 80px display, "full colour", the lift, the 14px floor, the poster. Correct the V2 line's colour claim the same way.
   - Request the window's labels in `content/ui-strings.json`.
