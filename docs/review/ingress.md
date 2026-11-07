# /ingress — James-eye review

Verdict: 7/10
First complaint: "The board up top is alive, then I scroll into a whole white screen with one heading on it, and after that six cards that just sit there. The certificate never arrives, the backend never drops. The middle of the page goes dead."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812 (recorder walk: 14 desktop and 16 phone scroll stops with idle pairs, hovers, 10 clicks, video). Then my own probes: the board sampled every 500 ms, the wipe scenes stepped in 11 scroll positions, press and hover computed styles, the pipeline add/reorder and its request dot sampled every 180 ms, reduced motion, JS off, a 45-stop tab crawl, 375x667 fold, 320 overflow, `parity.py` and `taste.py`.

Frames: [hero at 1 s](ingress/d-hero-1000ms.jpg) · [the empty intro screen](ingress/d-empty-intro.jpg) · [two scenes colliding at a scroll stop](ingress/d-wipe-overlap-at-rest.jpg)

## What works
- **The hero sells and moves.** "Hanzo Ingress" (52px/497) cuts in by line mask (frame 0 on phone shows the lines half-masked). `:80 :443` sits opposite in 64px Air 220, one ask (View on GitHub), and the routing board peeks inside the first screen. In the board a request lands each second (host → middleware → backend outline), and on a 20 s cycle a backend pod hollows out ("health check failed · out of rotation"), shop.example.com's "certificate…" turns into "Let's Encrypt", then "recovered · back in rotation". It is a real live object with a 44px pause control, and it stops under reduced motion (0 running animations at 3 s).
- **The signature belongs to this page.** WipeScenes (clip-path scenes rising over each other, each with its own tint) is used by no other page (`grep`: Ingress only).
- **The Beyond is good.** In "Chain your own pipeline" you press middleware to add it and move it with arrows or drag, and a dot walks the chain on every change. Verified: adding compression gives 4 rows, aria-pressed=true, "Move compression up" reorders, the dot travels 300px in about 1.3 s.
- **It is clean.** Greys only (`taste.py` OK). `parity.py` gives text 29/29, links 2/2. CLS 0.003 desktop and 0.00004 phone. No horizontal overflow at 375 or 320. JS off shows every scene and the h1 at opacity 1. The phone primary's bottom sits at 446px in a 667px viewport. The primary presses to scale(.98).

## The 11 answers
1. **5 s and 1 s: yes.** Name, ports, lede and primary are all on the first screen, and the board's request highlight and wire pulse move within 1 s with no input. The phone h1 is 40px over 2 lines.
2. **One in, one out: only partly; the middle is a document.** After the hero, desktop scroll stop 1 (y=681) is about 650px of white holding only the 44px "What happens at the edge" ([frame](ingress/d-empty-intro.jpg)). Then come 4,806px of pinned wipe in which every scene is a static card: idle change is 0 bytes at 6 of the 8 stops in the scene band (they hold still for 1.2 s). On phone the scenes stack (allowed) as text block then card, six times, with idle change 0 at stops 2–9 (about 4,000px with nothing moving).
3. **Real object in every section: no.** The intro section has none. The six scene drawings are real but frozen diagrams of things that should happen: "Certificates it fetches itself" is a lock icon plus a word, "Routes change without a restart" is four squares with one hollow that never changes, and the middleware chips have a `--d` stagger index set in `Draw` that no CSS uses.
4. **One ask, nothing floating, scale rhythm: mostly.** There is one page ask, View on GitHub. On desktop the header ask swaps from Try Hanzo to View on GitHub once the hero ask leaves (screen 1). Nothing of the page's floats over content. Rhythm is good in the hero (52 / 64 Air / 20) and inside each scene (26px heading against a 40–112px figure). Shared chrome: on phone the header keeps a solid black "Try Hanzo" beside the hero's solid "View on GitHub" (2 solid fills in one viewport) and never swaps. The cookie card is 203px tall at 375×812 and covers the board. Neither counts against the page.
5. **Every hover and press answers: no.** The primary goes #0a0a0a → #2c2c2e on hover and scale .98 on press: good. In the dark room, pressed chips have no hover change and no chip has a press state (`transform: none` during mousedown). The ↑/↓ buttons have no hover. That is 6/14 desktop hovers dead (recorder). The pause and the chips play no sound tick, though they are toggles.
6. **Overlap, font swap, layout shift: one overlap at rest.** No font swap (the h1 box holds) and CLS stays under 0.004. But the wipe is a pure scrub with no snap, so a scroll stop can leave two scenes half-drawn: at y=4086 and y=4767 (both a- and b-frames, so it does not resolve) "05 / 06" sits 35px above "06 / 06" and the "pricing.html" row lies across the 112px "80" ([frame](ingress/d-wipe-overlap-at-rest.jpg)).
7. **Reference: apple.com product pages** (one idea per screen, pinned scenes). The pin is there, but Apple's scenes play inside the pin; here the wipe is the only motion. Nothing from synchronized.studio or osply/hamol-style pointer detail.
8. **Different from neighbours: yes in the middle, no at the end.** Hero medium (port figures plus the live routing board) and the wipe are its own. The close (ShipPrompt then GetIt with the Sigil lines) is the same pair used on Gateway, Kms, Machines, Iam, Idv, Insights, Guard and Hsm.
9. **18 parts: gaps.**
   - Part 7: the scene cards are outlined and raised at once (`.ig-scene-r`: 1px ring plus a 40/80 drop shadow), and the page CSS uses literal non-deck hex (#f5f5f7, #161617, #2c2c2e).
   - The black room (`.ig-pipe`) arrives full-bleed with a hard edge (border-radius 0), not as a rounded card that opens.
   - On phone the board hides its whole middleware column (`.ig-col.mid { display:none }`), so the phone hero object loses the request path that is its story.
   - The pipeline's walking dot is 6px with a glow, travels a fixed 300px (`--h` is never set) and lights no row as it passes.
   - The "Get Ingress" band stacks h2, the mono caption and the tag with almost no space between them (shared GetIt).
   - Tab crawl: 0 invisible stops and a 2px ring everywhere, but Copy is 32px tall (shared ShipPrompt).
10. **Banned tells: none of the hard ones.** No hue, gradient text, Inter or kicker above an h1/h2 (the "01 / 06" numbered caption sits above an h3, which is allowed). Soft ones: a glow (`box-shadow: 0 0 12px`) on the walking dot, and outline-plus-shadow tiles.
11. **Copy untouched: the live strings are all present.** The Beyond adds strings that are in neither `content/live/ingress.json` nor `content/ui-strings.json`: "Chain your own pipeline", "No middleware: straight to the backend.", "request", "backend", the board's "health check failed · out of rotation" and "recovered · back in rotation". It also repeats "Middleware you compose by annotation" as a caption under the new h2. List them on the card as copy questions, or source them from the register.

## Fixes (in order)
1. **Make the six scenes play, not sit.** Do this in `components/pages/cloud/Ingress.jsx` → `Draw`: each drawing runs once when its scene is fully wiped in (a `useInView` / progress threshold), then rests, and reduced motion shows the final frame:
   - sources: the four sources slide into the `networking.k8s.io/v1 Ingress` row, then `default IngressClass` ticks on;
   - cert: the lock shackle closes (the path animates), then "Let's Encrypt" and "wildcards included" arrive;
   - mw: use the existing `--d` index for a 60 ms stagger and have a request dot pass through the black chips;
   - live: the hollow pod empties, then refills ("put back when it recovers");
   - files: the four paths type in one after another;
   - ports: 80 and 443 settle in place.

   This turns 4,800px of scroll-only motion into time-based motion and fixes answers 2 and 3.
2. **Kill the empty intro screen.** Cut `.ig-intro` padding (`Ingress.css` line 42, `clamp(120px,14vw,200px)` top) and let the h2 sit over the first scene, or move "What happens at the edge" into the pinned stage as its first frame, so no 801px viewport holds only a heading.
3. **Stop two scenes colliding at rest.** In `Ingress.jsx` / `Ingress.css`, either snap the pin per scene (`scroll-snap` on 6 invisible markers inside `.ig-ws`, or settle the progress to the nearest scene when scrolling stops), or keep the left text column out of the wipe: one pinned column whose kicker and h3 swap by line mask while only the right card wipes. Today the `ws-in` 6% y-offset leaves the old kicker visible above the new layer.
4. **Give the phone board its middleware.** Replace `.ig-col.mid { display:none }` (line 107) with a compact one-row chain between hosts and backends (the current `ig-chain` spans at 13px, inline), so the phone hero shows host → middleware → backend.
5. **Every tap answers in the dark room.** For `.ig-pipe-pick button` and `.ig-pipe-mv button`:
   - inside `@media (hover:hover)`, a hover that changes more than opacity (border to white 40% and text to #fafafa for off chips, background #fafafa for on chips);
   - `:active { transform: scale(.97) }` at 90 ms;
   - make the walking dot light each row it passes (set `--h` from the measured chain height, or animate a row-highlight index) and drop its `0 0 12px` glow;
   - call the shared sound kit's tick on chip toggle and reorder.
6. **Use tokens only.** In `Ingress.css`, swap #f5f5f7 → #f5f5f5, #161617 → #171717, #2c2c2e → #262626, and drop the stale "Accent: blue" comment. On `.ig-scene-r` and `.ig-host`, keep the raise or the 1px outline, not both (tiles flat; only the moment's card floats).
7. **Open the black room.** `.ig-pipe` should enter as a rounded card inside the gutters (radius 24–28) and open to full width as it is reached, per MASTER part 3.1.
8. **Clear the copy.** List the Beyond's new strings on `docs/coverage/ingress.md` as copy questions, or pull them from `content/ui-strings.json`. Drop the duplicate "Middleware you compose by annotation" caption under "Chain your own pipeline".
9. **Shared, request only (`docs/requests/ingress.md`):**
   - the phone header should swap to the page ask and stop being a second solid fill;
   - the cookie card should be 220px or less at 375×812 (it measures 203px but covers the hero board);
   - ShipPrompt's Copy should be 44px;
   - GetIt's h2/caption/tag spacing.
