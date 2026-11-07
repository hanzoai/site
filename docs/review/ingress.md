# /ingress — James-eye review

Verdict: 7/10
First complaint: "I scroll down and the page pulls me back up on its own. And every new card turns up as an empty white box, then the headings run into each other while it wipes. It's fighting me, and that isn't premium."

Walked 2026-11-07 on the dev server at 1470x801 and 375x812. I used the recorder walk (14 desktop and 16 phone scroll stops, 14 hovers, 10 clicks), then my own probes: a 250 px wheel walk through the pinned stage, frame-by-frame captures of the hero board and of three scene arrivals every 150-250 ms, `scrollTo` and wheel tests of the stage's settle, press and hover styles on the hero ask, the solid fills on the first screen at both sizes, 375x667 and 320 widths, reduced motion (with `getAnimations()` read after 3.2 s) and JS off. The only console error was the known FooterHTML hydration mismatch, which also accounts for the dev "1 Issue" badge. I did not count it against the page.

Frames: `ingress/r2-wipe-collision-1470.jpg` (the scene 3 to scene 4 wipe mid-scroll: "compose by annotation / without a restart" read as one heading, and the chips are sliced), `ingress/r2-empty-stage-1470.jpg` (scene 3 just after arriving: the stage card is an empty white box), `ingress/r2-phone-two-solids-375.jpg` (phone first screen: a solid "Try Hanzo" in the header and a solid "View on GitHub" in the hero).

## What works
- **The hero object is real and alive.** It is a routing board (host and path, then middleware, then backends) that runs by itself. It ticks every 1 s: a request lights a host row and its backend, the middleware chips swap, a pulse runs down the wire, a backend drops out of rotation, and `shop.example.com` goes from "certificate…" to Let's Encrypt. Frames at 0, 1000 and 3000 ms all differ (idle diff 2802 bytes on screen 0). It has a pause control.
- **The type has rhythm.** The h1 is 52 px/497, the `:80 / :443` figure is light and large on the right, and the lede is small. Section heads step 44 (edge), 26 (Paste and ship), 32 (pipeline), 44 (Get Ingress). Nothing shouts all at once.
- **There is one pinned stage where one panel changes.** It is the most Apple thing on the page. Six facts sit on the left with a `01 / 06` count, and each scene draws once on the right: the sources list, the lock shackle closing on Let's Encrypt, a request passing the black chips, four pods with one hollow, file paths typing in, and 80 and 443 settling.
- **The Beyond aid is real.** "Chain your own pipeline" sits in a black room that opens from a rounded card. The chips toggle, the arrows reorder, and a white request dot walks the chain on every change. Every chip and arrow responded to a click (10/10), and hovers changed style on 13 of 14 targets on desktop.
- **The engineering is clean.** CLS is 0.0020 on desktop and 0.00005 on phone. Horizontal overflow is 0 at 1470, 375 and 320. Parity is 29/29 text and 2/2 links. `taste.py` passes. Reduced motion leaves 0 running animations after 3.2 s and stacks the scenes in their final frames. JS off shows the h1, lede, ask and board, because the cut-in is a CSS animation. The hero ask carries `data-cta="ingress.hero"` and `data-thumb`.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes. "Hanzo Ingress / The entry point of a Kubernetes cluster" plus the board reads as a product at a glance. The h1 cuts in by line mask and the board is ticking before 1000 ms. One weakness: the board opens on its least telling state, "certificate…" with an ellipsis that reads like truncated text. Let's Encrypt only lands after about 10 s.
2. **One in, one out, or a document?** Mostly one in, one out. The pinned wipe swaps one fact at a time, and then the prompt, the pipeline and the band each take their own screen. Three things undercut it:
   - **The stage takes the scroll away from you.** `useWipe().settle` in `components/pages/cloud/Ingress.jsx` (lines 140-151) scrolls the page 180 ms after you stop. `scrollTo(3500)` came to rest at 3318, 182 px back up. A 300 px wheel flick reached 2692, then the page carried itself on to 3013. In the recorder walk, three successive page-down steps all ended back at scrollY 2517.
   - **The wipe's in-between frames collide.** The clip-path wipe shows both scenes in place at once. At y≈3200 the left column reads "Middleware you / compose by annotation / without a restart", and the scene 3 chips are cut in half (`r2-wipe-collision-1470.jpg`). At y≈1100, "already wrote" is cut through by the incoming grey panel, and scene 2's paragraph shows without its heading.
   - **Every scene arrives as an empty white card** for 300-450 ms before its drawing starts (`r2-empty-stage-1470.jpg`, and the stage stills at t0). Below the hero board, about 300 px of blank white runs before "What happens at the edge".
3. **A real object in every section?** Yes:
   - hero: the board;
   - six scenes: a drawing each (the lock is the weakest, an icon plus a word);
   - Paste and ship: the agent-prompt block;
   - pipeline: the reorderable chain;
   - band: the drifting contour lines.
4. **One ask, sticky, nothing floating, scale rhythm?**
   - Desktop: yes. The header ask swaps from "Try Hanzo" to the page's own "View on GitHub" once you scroll, the header ask goes quiet while the hero ask is solid, and nothing covers content. The cookie card and the dev badge are shared chrome.
   - Phone: no. At 1000 ms the header shows a solid "Try Hanzo" (#0a0a0a, 44 px) and the hero shows a solid "View on GitHub" (#0a0a0a, 44 px) on the same screen. The header never takes the page's ask on the phone. That is two solid fills and two different labels on the first screen.
   - Scale: has rhythm (see above).
5. **Every hover and press answers, no jumps?**
   - Hovers changed on 13 of 14 desktop targets. The hero ask presses to `scale(0.98)`, but its hover only lightens the fill (#0a0a0a to rgb(44,44,46), a value off the deck ramp, from the shared `Cta`) and tells you nothing. Phone hovers are n/a, and every tap responded.
   - **There is a jump inside the hero object.** Each tick, the middleware column re-centres as the chain goes from 2 chips to 1 to empty during the exit. The "MIDDLEWARE" label moves from y 185 to y 162 and back, about 23 px every second (probe hero frames 04 vs 09).
   - In scene 3, the moving white dot rides over the chip lettering ("compre•sion", "redirec•s").
6. **Overlap, font swap or layout shift?** There was no font swap and CLS was 0.002. The overlaps are the wipe collisions in answer 2, and on desktop they are visible on every scene change while you scroll. On phone the scenes stack and do not collide. In the phone pipeline, the request dot sits outside the row's left edge.
7. **Which reference, and is its motion there?** apple.com product pages: a pinned stage where one panel changes, and the product as the hero. The pin and the one panel are there. Apple's smoothness is not: Apple scrubs continuously and never moves the page under you. This page snaps your scroll and shows half-wiped frames. There is a light touch of osply/hamol in the contour band.
8. **Different from neighbours?** Partly. The hero recipe is shared with about 9 cloud siblings (Gateway, Guard, Hsm, Iam, Idv, Kms, Machines, Insights): `Lines` h1 left, a mono figure right, the lede and ask row, and a `Lift` board under it. The board object is Ingress's own. `WipeScenes` is used only here, and the pipeline room is unique. The closing `ShipPrompt` and `GetIt` are shared family parts. It is distinct enough in its object and signature, but not in its first-screen layout.
9. **18 parts?** Seen:
   - one `<main>` and one h1;
   - `data-cta` and `data-thumb` on the primary;
   - `data-morph-target` on the h1;
   - parity 0 missing and taste passes;
   - CLS under 0.02 and no overflow at 320;
   - the ask above the fold at 375x667 (bottom at 446 px);
   - reduced motion shows the final state, and JS off is legible;
   - pause on the board;
   - `data-sound="tick"` on the chips and arrows;
   - a closing `Band` (Get Ingress) running into the footer.

   Not seen: no proof strip, because Hanzo's copy has no figures beyond 80/443, which is fine. The phone fails the "one solid fill" rule (answer 4). The `01 / 06` captions sit above the h3s, which is allowed: they are not above an h1 or h2.
10. **Banned tells?** No hue, no gradient text and no Inter. There is no eyebrow above an h1 or h2. "GET STARTED WITH HANZO INGRESS" is set below "Get Ingress" as a caption, which is allowed, but it is jammed against the heading with no space and reads as three lines crushed together. The lock scene is close to "an icon alone". The agent prompt is clipped at the right edge ("…hanzo ingress route"; scrollWidth 883 vs 818) with no fade or cue on desktop, and it is clipped far more on phone.
11. **Copy untouched?** Yes. Parity is 29/29 text and 2/2 links. "certificate…" is a UI state label the page made up, not Hanzo copy. It reads as truncation.

## Fixes (in order)
1. **Stop moving the page under the user.** Remove the `settle()` auto-scroll in `useWipe` (`components/pages/cloud/Ingress.jsx` lines 140-152), or at most use CSS `scroll-snap-type: y proximity` on the scene spans. The fix for "two scenes resting half-drawn" is fix 2, not taking the scroll away.
2. **Make the wipe read cleanly mid-scroll.** In `WipeScenes` (as used by `.ig-ws`), give the incoming scene's left column its own entrance: a line-mask cut-in of its h3 and a 16 px rise of the body as its wipe passes about 50%. Hold the outgoing text in place, and fade it out by 30% of the wipe. Then two headings never stack into one ("compose by annotation / without a restart"). Wipe the stage drawing and the text on the same edge so the chips are never sliced while the old heading is still readable.
3. **No empty stage.** Start each scene's drawing as its wipe begins, not at about 87% in (`look()`: `+ (1 - REST) + 0.08`). Alternatively, render the drawing's first frame statically so the white card is never blank. Then let the drawing play as it finishes. Tighten the blank gap between the hero board and "What happens at the edge" (about 300 px of white at 1470).
4. **Steady the hero board.** Give `.ig-col.mid .ig-chain` a fixed min-height of two chips and align it to the top, not the centre, so "MIDDLEWARE" stops jumping 23 px each tick (`Ingress.css`). Open the loop on a telling state: start at phase 3 or 0 with the Let's Encrypt label shown, and keep "certificate…" for the middle of the loop. Keep the request dot in scene 3 off the chip text: run it on a line below the chips, or under them in z-order.
5. **Phone: one solid fill.** On phone, the header still shows a solid "Try Hanzo" while the hero "View on GitHub" is solid. Either let the header take the page's ask quietly at all widths, like desktop does (shared Header and `lib/cta.js`: file `docs/requests/ingress.md`), or confirm the header goes quiet while the hero ask is in view.
6. **Closing band type.** In `GetIt` as used here, put space (17-27 px) between "Get Ingress" and its caption line, and between the caption and "K8s ingress + static plugin". Right now three sizes are stacked with no leading.
7. **Agent prompt.** Wrap the prompt (`white-space: pre-wrap`) or add a right-edge fade and a scroll cue. Then the visitor sees the whole command they will copy, and on phone it is not cut off after "use H".
8. **Small things.**
   - Give the hero ask's hover something beyond a lighter fill: an arrow nudge, say, kept on the deck ramp (shared `Cta`; request it).
   - Give the lock scene a second line of content from the copy, such as the hostname arriving with its certificate, so it is not an icon plus a word.
   - Keep the phone pipeline's request dot inside the row.
