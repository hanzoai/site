# /operator — James-eye review

Verdict: 7/10
First complaint: "The top's alive, I like the board putting things back. Then it goes dead. The 'thirty objects' bit is a big empty white screen with one black box, the rest is grey cards of text, and the main button doesn't even react when I hover it."

Walked 7 Nov 2026 with Playwright (Chromium), moving: 1470×801 desktop (video, 10 frames over the first 6 s with no input, then the whole page by wheel in 300px steps with a pause on each screen, hover and press on the ask, tiles, repo link and pause control, a tile dragged, a Tab crawl, keyboard Enter on a tile) and 375×812 phone (isMobile, hasTouch; real touch-event swipes down the page, a swipe started on a tile, a horizontal swipe on the six-point rail). Also reduced motion, JS off, 320×640 and 375×667. Non-localhost POSTs blocked. Stills: `docs/review/operator/d-f6.jpg` (hero at 4 s), `d-s03.jpg` (the Declare screen once its moment is over), `p-trap.jpg` (phone: a swipe dragged the Gateway tile under the header instead of scrolling).

## What works
- The hero object is the best idea on the page and it is truly Operator's own: ten Kinds on a dot grid, a sweep line crosses them, one drifts at about 3 s, the next sweep puts it back, and the log says "drift", "reverted", "already in sync" in Hanzo's own words. Something moves inside 1 s (h1 cut-in finishes at about 0.9 s, first sweep at 0.6 s). Dragging a tile yourself works and the next sweep reverts it with a log line. Keyboard Enter on a tile drifts it too. It stops off screen and has a pause control first.
- Kinds of motion are well mixed: idle (the loop), pointer (drag), time (log lines), scroll (converge, horizontal track), arrival (h1 mask). Scroll is half or less.
- The header ask swaps to a solid "View on GitHub" once the hero ask leaves view (desktop). One solid fill per screen.
- Scale is on the deck: h1 52px, h2 26px, card titles 21px. No pill above any headline. Greys only; `taste.py` OK.
- Parity 29/29 text, 2/2 links. `unique.py` OK. No horizontal scroll at 1470, 375 or 320. CLS 0.002 desktop, 0.007 phone. JS off: all 22 text nodes visible. Copy button copies exactly the shown prompt and says "Copied".
- The six-point track pins and slides 1808px sideways with a progress hairline; on phone it becomes a swipe rail that does scroll (scrollLeft 331 after one swipe).

## The 11 answers
1. **5 s / 1 s:** Yes. "Hanzo Operator", the lede and "View on GitHub" read at once, and the board is moving before 1 s. The log panel is 188px tall with two or three lines in it for the first 5 s, so a third of the board is empty black.
2. **One in, one out?** Partly. Hero, then Declare, then the pinned track is a real sequence. But Declare plays its whole convergence while the section is still in the lower half of the screen (objects gone by the time the headline reaches the middle; `d-s03.jpg` is 600px of white with one black "Service" box), and after the track there is a ~250px empty band before "Paste and ship" and "Get Operator", two quiet grey text cards that read as a document tail.
3. **A real object in every section?** Hero yes (strong). Declare yes but weak: thirty `#f5f5f5` chips on white are barely visible, and the end state is one small box. The track's six cards are text paragraphs with a code chip, not objects. Paste and Get are text cards. So two of five sections hold a real object.
4. **One ask, nothing floating; scale rhythm:** One ask, kit `Cta`, sticky header carries "View on GitHub" after the hero on desktop. Nothing page-owned floats. (Shared: on phone the header keeps a solid "Try Hanzo", and the cookie card covers the lower 200px of the phone screen; not held against the page.) Rhythm is fine; the shared Band headline jumps to 88px at the close.
5. **Every hover and press answers?** No. The hero primary "View on GitHub" has no hover change at all (measured: background, colour, transform, shadow, border identical). Cause: `.xop-hero .x-btn.solid { background:#fafafa }` in `Operator.css` outranks the global `.x-btn.solid:hover`. Press does scale to 0.98. The pause button has no hover either. Tiles (border brightens) and the repo link (underline) do answer.
6. **Overlap, font swap, shift?** No font swap or real layout shift. Two problems: (a) **phone scroll trap**: the tiles are `drag` with `touch-action:none`, so a swipe that starts on a tile (about a third of the screen while the board is in view) drags the tile up to 250px out of the board, over the header, instead of scrolling (`p-trap.jpg`); (b) **reduced motion**: the shared `A2Lines` mismatches on hydration (server `translateY(105%)`, client `none`), React does not patch it, and the Declare h2 "Declare the thing, not the thirty objects" stays below its mask, invisible; Next shows the red "1 Issue" badge. Minor: "kms.hanzo.ai" is clipped at the KMSSecret tile edge at 1470, and a drifting tile overlaps its neighbour (intended, but at 375 it pokes past the board edge).
7. **Reference:** The hero feels like an apple.com "the product doing the thing" scene, and the track is a pinned horizontal strip. The measured feel is there in the hero; Declare is meant to be a scrubbed scene but its scrub window is spent off-centre, so the apple "one idea per screen, scrubbed while pinned" isn't actually delivered.
8. **Different from neighbours?** Yes. A dark control-room board is unlike /sdks (code) and /pubsub (a bus). Unique.py agrees.
9. **18 parts:** Card has 18 sections filled, but several ticks are not true (see Card check).
10. **Banned tells?** None from the list. Text-wall risk in the six track cards (40 to 60 words each, Hanzo's copy, shown all at once).
11. **Copy untouched?** Yes (parity 29/29, 2/2). The log uses Hanzo's words; "kind" over the Service box is the only page-added label.

## Card check
`docs/coverage/operator.md` exists with 18 parts filled, but these ticks are not truthful:
- Part 8 "Every control has hover, press, focus-visible…": the hero primary and the pause button have no hover state.
- Part 9 and 12 "Reduced motion shows the final state": the Declare h2 is invisible under reduced motion (shared `A2Lines` hydration mismatch), with a dev error badge.
- Part 11 "both sizes pass… every hover has a tap path": on phone, swiping on the board drags tiles instead of scrolling.
- Part 3 "Ends in proof strip, Band, footer": there is no proof strip.
- Part 16 "One CodeBlock; copy equals display": there is no CodeBlock; "operator up" in Get is an `aria-hidden` chip that looks like a command but cannot be copied.
- Part 18 "Review read: verdict 8 or more": no review existed before this one.
- The page file's trailing `// Signature:` / `// Beyond:` (git on one side, cluster on the other; remove a file from git, install twice) describe a different page from the one built and from the top comment. Keep one.
- The `V2: 8/10` self-score in the file header does not count.

## To reach 8
- **Fix the primary's hover.** In `Operator.css` add `@media (hover:hover) { .xop-hero .x-btn.solid:hover { background:#e5e5e5; border-color:#e5e5e5; } }` (or drop the override and use the kit's dark-room variant), and give the pause control a hover (border to white 30%).
- **Free the phone scroll.** Under 900px (or `pointer:coarse`) turn tile `drag` off and let the existing tap-to-drift be the touch path; or set `drag` only after a long-press and keep `touch-action: pan-y`. Clamp drag inside the board (`dragConstraints` to the grid ref) on desktop too so a tile can't leave the board.
- **Make Declare a real moment.** Pin the section (sticky 100svh stage) and run the convergence across the pin, centred, so the thirty objects visibly fly in while the headline is on screen; give the loose chips a visible tone (`#e5e5e5` fill with the 10% hairline, or `#d4d4d4`) and let the final Service box land at the 26px heading's scale. Right now the moment happens off-centre and ends on white.
- **Fix the reduced-motion hole.** Request a fix to `components/v2/A2Lines` (write `docs/requests/operator.md`: under reduced motion the server style must equal the client's, or render without the transform); until then render the Declare h2 page-locally without the mask when `useReducedMotion()` is true after mount.
- **Give the tail an object.** The Get card could hold the board's final rest frame in miniature, or turn "operator up" into a real copy control (kit copy with "Copied") so the last screen before the Band has something to press. Close the ~250px gap after the track.
- **Fill the log.** Seed the first lap's log on mount (operator up, sweep created) so the 188px panel isn't two-thirds empty on first screen, or shrink it to 5 lines.
- Correct the coverage card ticks listed above and delete the stale trailing Signature/Beyond comment.
