# /kms — James-eye review
Ready: 2026-11-07 refused write takes v2's slot (0px overlap at 375/1470); the spotlight vault room, its light masks and the five entrances are styled (they had shipped as markup only, leaving the rules unstyled and a black grid-wave over the page); Seal seals on its own until taken; the terminal types once; one "Example project" caption; hero ask arrow with no width change; Copy hovers.

Verdict: 7/10
First complaint: "On my phone the 'write replaces v3 · refused' label lands right on top of the v2 row, so you can't read either one. And the panel next to the six rules keeps wiping itself to an empty white box."

Walked 7 Nov 2026 (round 3) on the dev server at 1470x801 and 375x812. I used the recorder (12 desktop and 17 phone scroll stops, each with an a/b pair 1.2 s apart, first 0/1000/3000 ms, 14 hovers, 4 clicks) and looked at every frame. I also ran my own probes: hero frames every 250 ms over 12 s, the bounding boxes of the refused chip against the version rows, hover and press styles on both hero buttons, the vault tilt, typing into the Sealed field, hovering a rule, hovering the related links, the dark room's clip-path at 5 scroll steps, whether the terminal changes over time, panel screenshots every 800 ms through a 4.8 s lap, reduced motion (getAnimations after 3 s), JS off, a 45-stop Tab crawl, overflow at 320, and touch-target sizes on phone. I also opened the hero of each neighbour (/iam, /authz, /hsm). `parity.py /kms` and `taste.py` both pass.

Frames: `kms/r3-p-hero-refused-overlap.jpg`, `kms/r3-d-pinned-panel-blank.jpg`, `kms/r3-d-seal-static.jpg`.

## What works

- **The hero moves before you touch it, and it means something.** The h1 cuts in through its mask (translateY 56.8 px at t0, then 12.7, 2.8 and 0 by 800 ms). The vault lifts from scale 1.1 to rest. Within 2 s the cipher chain lights Argon2id, then HKDF-SHA256, then AES-256-GCM, the dots turn into the sealed hex, v3 rolls to v4, a stale write is refused, and the agent's read lands in the log. It is a real scripted story built from Hanzo's own words, with a pause button. This is the KMS idea in one object.
- **Pointer depth.** The vault leans toward the mouse, measured `--km-ry 2deg / --km-rx 1.5deg` near a corner, and flattens when the pointer leaves. Hovering a rule drives the pinned panel: hovering rule 03 switches the caption to `03 / 06`. Hovering the console rows moves the secret strip under the console.
- **The Beyond is genuinely good.** Typing "hunter2" into DATABASE_PASSWORD gives real AES-256-GCM ciphertext (`icLAc99cHmsqNh0vcd41JUXa0mvIukw=`) from WebCrypto, and Argon2id is honestly struck through because it is not run in the browser.
- **An Apple-style pinned stage.** "What it holds and how it holds it" pins one panel while six rules scroll past. The panel redraws as each rule's picture, and the `01 / 06` numeral rolls through a mask.
- **The dark room opens from a card.** The clip-path is scrubbed from `inset(0 24px round 24px)` to `inset(0)` over about 700 px of scroll. "Every read recorded" is the one big thing on that screen (64 px Air 220), and AES-256 / K8s / MIT sit at 26 px on hairlines. Scale has rhythm here.
- **Scale at rest follows the deck:** h1 52/497, lede 20, section heads 26, rule h3s 21, body 16, closing h2 44.
- **Hygiene is clean.** CLS is 0.0010 on desktop and 0.0004 on phone. There is no horizontal overflow at 375 or 320. No failed requests. Reduced motion leaves 0 running animations after 3 s and shows final states (the vault rests on its last step, the panel shows rule 01 drawn). With JS off the h1 stands by 2 s and every section is legible. In the Tab crawl all 29 stops in main have a 2 px ring. All three buttons press to scale 0.98.
- **Copy is intact:** parity reads text 87/87, links 12/12.

## The 11 answers

1. **Sells in 5 s and moves within 1 s?** Yes. "Hanzo KMS / Secrets management / Open KMS" plus a vault that visibly seals a password is a 3-second read. Motion starts at t0 (h1 mask, vault scale), and the chain starts lighting at 1 s.
2. **One in, one out, or a document?** Mostly one in, one out on desktop. The hero vault leads to Seal, then to the pinned rules (one panel changing), then to the dark room opening, then to the console, then to Get KMS. Two things weaken it:
   - The "Sealed on your machine" screen is a still card until you type: idle diff is 12 bytes on desktop screen 01 (`r3-d-seal-static.jpg`).
   - On phone, 4 of the 10 body screens are fully still (scrollY 2070, 4140, 5520, 6210 all show idleDiff 0). There the rule pictures draw once and stop, and the terminal never types.
3. **A real visual object in every section?** Yes: the vault, the seal box, the pinned rule panel, the figures plus terminal, the example console with its secret strip, and the Sigil contour in Get KMS (which drifts idle; the band screenshot changes over 2 s). The weak spot is the pinned panel. It re-keys its Scene on every 4.8 s lap, so it clips down to an empty white box before redrawing. That happened in 3 of the 6 desktop frames the recorder took in that section (`r3-d-pinned-panel-blank.jpg`), and in 1 of 6 frames when I sampled a steady lap.
4. **One ask, sticky, nothing floating; scale rhythm?** On desktop, yes. "Open KMS" is the one solid fill in the hero. The header ask turns quiet while the hero ask is in view, then turns solid "Open KMS" once you scroll past it, and goes quiet again over the dark room and the closing band. Nothing of the page's own floats over content. Rhythm is good: one 64 px moment in the dark room, everything else at 26/21/16. Shared-chrome note: on phone the header ask stays "Try Hanzo" all the way down and never becomes "Open KMS". The cookie card is 203 px tall at 375, which is within the 220 px rule.
5. **Every hover and press answers, no jumps?**
   - Open KMS: #0a0a0a goes to #262626 on hover, and presses to scale 0.98.
   - Documentation: fills #f5f5f5 with an ink border on hover, and presses to scale 0.98.
   - Related links: fill white and the arrow moves 4 px.
   - Rules: hovering one selects the pinned panel.
   - Console rows: hovering one drives the secret strip.
   - Vault: tilts toward the pointer.

   The recorder's single "dead" desktop hover was the "KMS" side-rail item in the example console, which is the current item, so that is expected. On phone all 14 hovers read dead because it is a touch device; the tap paths exist (console rows click, rules draw when reached). The hero ask's hover is a darker fill and nothing more: it tells you nothing.
6. **Overlap, font swap, layout shift?** **Overlap at 375. This is the failing item.** At step t===5 of the vault loop, `.km-stale` ("write replaces v3 · refused") is absolutely placed at `bottom: 8px` on phone (Kms.css line 221). It sits on the v2 row and covers 26 of its 34 px of height, so the "4b7557b1c9" hash and the chip text sit on top of each other for about 1.8 s of every loop (`r3-p-hero-refused-overlap.jpg`). On desktop the same chip uses `bottom: -18px` (line 56) and straddles the gap between the versions box and the log box. It reads like it slipped rather than like it was placed. There was no font swap (h1 box steady at 57 px) and CLS is 0.001.
7. **Which reference, and is its motion there?** Apple product page: one idea per screen, the pinned scrubbed stage, the product as hero, a persistent ask. It is there: the pin, the scrubbed dark-room open, and the lift. The anthropic-launch "story told as figures" shows up lightly in the dark room's figure rows. There is no synchronized.studio-style card-to-page open here, and none is needed on a cloud page.
8. **Different from its neighbours?** Yes. /iam leads with a full-bleed grey token stage and the h1 bottom-left. /authz uses a split h1 over a caller/location graph. /hsm uses a left h1 with an isometric key slab. /kms uses a centred h1 over a split vault (black secret card plus version stack). The signature (seal, rotate, refuse, record) is its own. One small note: MASTER asks for centred heads only in the closing section, and this hero is centred.
9. **All 18 parts covered?**
   - Visible evidence for parts 1, 3, 4, 6, 7, 8, 9, 10 (no media to show, so n/a), 11, 12, 13 and 16:
     - one h1;
     - one solid fill per viewport;
     - `data-cta` kms.hero, kms.mid and kms.close;
     - CodeBlock with Copy that responds;
     - pause buttons on both self-running demos;
     - 2 px focus ring;
     - 56 px input at 22 px text;
     - reduced-motion final state;
     - JS-off legible.
   - The one phone touch target under 44 px is the console's "KMS — Hanzo" title bar (86x13), which is not a control.
   - Part 16 is soft: the terminal in the dark room is a static CodeBlock with no typewriter, while the brief's Developer/Launch pattern asks for a terminal that types once with a static final frame.
   - Part 17 is untested here: there is no live-data failure state to see.
10. **Banned tells?** None of the hard ones: no hue (taste passes), no gradient text, no Inter, no pill above a headline, no buttons that fade.
    - Soft clutter: under the example console, "Example project. Every name in it is one you would give your own." (21 px) sits beside an "EXAMPLE PROJECT" mono caption on the same line. The same words appear twice side by side.
    - The "Related capabilities" row is three equal items. They are hairline links, not boxes, so it passes.
11. **Copy untouched?** Yes: parity is 87/87 text and 12/12 links. Copy questions for James, not page faults:
    - The closing band says "License: Apache-2.0" while the dark room says "The source is MIT". The same page states two licences.
    - The GitHub pill shows "3 stars". That is real data, but it is weak proof to put beside the closing ask.

## Fixes (in order)

1. **Put the refused chip in a slot, not on top of a row.** In `components/pages/cloud/Kms.jsx` `Vault`, render the chip inside `.km-vers-in` as the third slot at `y = 2 * ROW`. In the same step (t===5), fade the v2 row to 0, the same way v1 already leaves. Then drop the absolute `bottom: -18px` (Kms.css line 56) and `bottom: 8px` (line 221). The chip then reads as "the next write, refused", in line with the versions, at both sizes, with nothing under it. Recheck at 375 that the chip box intersects no visible row.
2. **Stop the pinned panel wiping to blank.** In `Holds`, `<Scene key={lap} …>` remounts the scene on every `km-panel-run` iteration and on every arrival, so it clips in from empty. Keep the drawn scene mounted for the lap. On lap end, re-run only the line stagger (toggle a class that restarts the `--d` delays from the current drawn state), or only redraw when `at` changes. The panel should never be empty for a frame while a rule is in view.
3. **Give "Sealed on your machine" an idle.** Until the visitor focuses the field, have the box seal on its own: type the placeholder dots into the input at about 80 ms per character, show the ciphertext rolling in under AES-256-GCM, rest, and repeat once. Stop the moment the field gets focus. Use no new words; the dots and the ciphertext are not copy. This turns the only dead desktop screen into a live one and invites the Beyond.
4. **Type the terminal once.** Swap the dark room's `CodeBlock` for the kit `Terminal` (or a typed `CodeBlock`). Start it at 40 % in view, type the `kms login … kms scan` lines once, rest on the static final frame, and give it a pause control. Copy must still equal the display. That adds a Time motion to the dark room, and it fixes the phone screen at 5520, which is still.
5. **Phone stillness.** The rule pictures on phone draw once (`seen`) and then sit still: phone screens at 2070 and 4140 have idle 0. Let the picture of whichever rule is centred re-run its line stagger every 4.8 s, the same lap the desktop panel uses (after fix 2), and pause it when it is off screen.
6. **De-duplicate "Example project".** In `Ship`, the 21 px `.v2-title` sentence and the `v2-kick` "Example project" caption sit on one line. Keep both strings (copy is frozen). Set the sentence at body size, 16 px #525252, as the caption under the console, and put the mono "Example project" directly under it, so they read as one caption rather than a heading competing with "Paste and ship".
7. **Give the hero ask's hover something to say** beyond a darker fill: a 2 px arrow nudge or the magnetic pull (to 22 px, fine pointer only), as on the other launch pages.
8. **Requests, not page fixes:**
   - Shared header: on phone, swap the ask to the page's own "Open KMS" once the hero ask leaves view, as it does on desktop.
   - FooterHTML: its hydration mismatch is still raising the red "1 Issue" badge on every load (excluded from this score).
   - Copy questions for James: Apache-2.0 versus MIT, and whether "3 stars" belongs beside the closing ask.
