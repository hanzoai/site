# /referral: James-eye review (critic 3, 7 Nov)

Verdict: 7/10
First complaint: "The meter in How it works is broken: the needle is floating off in the corner, nowhere near the dial. That looks unfinished."

Walked moving at 1470×801 (desktop hover enabled) and 375×812 (touch), cookie bar dismissed, wheel-scrolled top to footer, then held each screen for 3 s. 0 console errors, 0 layout shifts recorded, no horizontal scroll, parity `text 20/20 links 3/3`.

## The 11 answers
1. **5 s sell, motion within 1 s.** Yes. The h1 cuts in by line, and the signed-out card rises at about 0.2 s. One builder (the ring) then lands on Referred, Pending and Qualified in turn, with the dotted flow under the counts looping. The h1, lede, ask and card all fit the first screen at both sizes. On desktop the lower 280px of the first screen is a blank band with a hairline (the pinned stage centres its content in 100svh), so the "peek" shows nothing.
2. **One in, one out.** Yes. Hero card, then the pinned journey: one word at 112px cut in by mask, Referred → Pending → Qualified, scrubbed by scroll with the rider on its track and `01 / 03`. Then the four-step strip, the dark room opening from a rounded card to full width, and the close.
3. **A real visual in every section.** Yes. The card UI, the journey track, four drawn SVG scenes, the two pay tracks and the card at rest. Hanzo has no imagery for this page, so the 4+ media rule does not apply.
4. **One ask, the header, scale.** Yes. The header carries quiet "Try Hanzo" while the hero ask is on screen, solid "Get your link" past it, and goes quiet again at the close. This works on the phone too. There was only ever one solid fill per screen. Nothing floats over content. Scale has rhythm: h1 52, the journey word 112 (the moment), steps 17, the dark room at 44, the close at 26.
5. **Hover and press.** Mostly yes:
   - Copy inverts to ink on hover. Pressing it while signed out shakes the link and pulses Sign in.
   - Steps lift 2px and ink their sentence, and a press replays the drawing.
   - The Affiliates link moves its underline.
   - The Sign in ghost tints and inks its border.
   - The hero ask only shifts its fill from ink to `rgb(44,44,46)`, the kit's hover (shared, see below).
   - No layout jumps.
6. **Overlap, font swap, layout shift.** None measured (CLS 0 on both walks). There is one visual fault inside a drawing: on the step 03 meter, the needle's `<motion.g>` gets `transform-box: fill-box` with `transform-origin: 200px 220px`. The origin is resolved inside the needle's own box, so it rotates around a point far below-right. The needle lands detached at the top right of the dial, about 60px from its hub. It is reproduced on every load (desktop proof: `img/referral-needle.jpg`).
7. **Reference.** Apple's pinned, scrubbed scene (one word per stop) is really there. The dark room opening to full width is the chatgpt enterprise calm. Both are present in the motion, not just the layout.
8. **Different from neighbours.** Yes. The journey word over a link track, and the card-as-hero, are this page's own. It shares the `ProgramScale` base with the affiliate family but not its signature.
9. **18 parts.** Covered as far as a walk can show: one h1 and one `<main>`, `data-cta` on the primaries, a JS-off rule, reduced motion lands the final state, Copy at 44px with a signed-out answer, and a dark room limit of 1.
10. **Banned tells.** None. "Referrals" is set as a mono caption below the asks, not above the h1. There is no hue in page CSS, no gradient text and no icon boxes.
11. **Copy untouched.** Yes. All 20 strings and 3 links match `content/live/referral.json`.

**Shared chrome (not counted against the page):**
- The kit's solid `Cta` hover is `rgb(44,44,46)`, a faint blue cast and not one of the deck's neutrals.
- The top progress hairline leaves a short gap at the right edge of the dark room's bottom border at 1470.

## Fixes to reach 8
1. Fix the step 03 meter needle so it pivots on the hub at (200, 220): drop `transform-box: fill-box`, e.g. `style={{ transformBox: 'view-box', transformOrigin: '200px 220px' }}`, or put the needle in a `<g transform="translate(200 220)">` and draw it from 0,0 up to 0,-92 with the origin at 0 0. It must sweep from −90° to 50° and end touching the hub, on desktop and phone, including on the press-to-replay.
2. Close the dead band under the desktop hero. Either tighten `.xrf-hero` bottom padding, or start the pinned journey's content near the top of the stage so the next section actually peeks (about 56px of the journey word or track visible at 1470×801).
