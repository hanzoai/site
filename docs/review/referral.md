# /referral: James-eye review (critic 4, 7 Nov)

Verdict: 7/10
First complaint: "In How it works there's a line running straight through the speedometer and through the list, like it's been crossed out. It looks broken. Everything else is nearly there."

Walked moving at 1470×801 (desktop hover enabled) and 375×812 (touch). I dismissed the cookie bar, wheel-scrolled from top to footer, then held each screen and compared frames about 1 s apart. I hovered and pressed every control in `main`.

Results from the walk:
- Parity: `text 20/20 links 3/3`, matching `content/live/referral.json`.
- Layout shift: total CLS 0.0047 on desktop and 0.0020 on phone. All of it is the riders animating `left`, which a person does not see.
- Horizontal scroll: none at 375.
- `taste.py` passes on `Referral.jsx` and `Referral.css`.
- Console: one error, a hydration mismatch inside the shared `FooterHTML` (shared chrome, not this page).

## The 11 answers
1. **5 s sell, motion within 1 s.** Yes.
   - The h1 cuts in by line mask.
   - At 0.9 s the link pill inks, then the rider lands on Referred, Pending and Qualified in turn (to about 5 s), with the dotted flow running under the counts.
   - The h1, lede, ask and card fit the first screen at both sizes.
   - The journey word "Referred" now peeks under the desktop hero, so the old dead band is gone.
2. **One in, one out.** Yes. The page runs:
   1. The hero card.
   2. A pinned journey: one 112px word cut in by mask (Referred → Pending → Qualified), scrubbed by scroll, with the rider on its track and `01 / 03`. On phone it plays once when reached.
   3. The four-step strip.
   4. The dark room opening from a rounded card to full width.
   5. The close, ending on the card at rest.

   One weak spot: on desktop the pinned journey fills only the top 55% of the screen (word, track, `03 / 03`). The lower ~350px of 801 is empty white for the whole pin (proof: `img/referral-journey.jpg`).
3. **A real visual in every section.** Yes. The sections show:
   - the card UI;
   - the journey track;
   - four drawn SVG scenes;
   - two pay tracks in the dark room;
   - the card at rest at the close.

   Hanzo has no media for this page, so the 4+ images rule does not apply.
4. **One ask, the header, scale.** Yes.
   - While the hero ask is on screen, the header shows a quiet "Try Hanzo".
   - Past the hero it shows a solid "Get your link". At the close it goes quiet again. This holds on phone too, at 375.
   - One solid fill per screen, and nothing floats over content.
   - Scale has rhythm: h1 52, the journey word 112 (the moment), steps 17, the dark room 44, the close 26.
5. **Hover and press.** Yes, with no layout jumps.
   - Press is scale 0.98 on the asks and 0.975 on Copy.
   - Copy inverts to ink on hover. Signed out, it does not pretend to copy: it nudges the link and pulses Sign in.
   - Steps lift their sentence 2px and ink it; a press replays that step's drawing.
   - The Affiliates underline opens on hover.
   - The Sign in ghost tints.
   - The hero ask's hover is the kit's fill shift (shared, see below).
6. **Overlap, font swap, layout shift.** No overlap at either size, no visible font swap, and the CLS is negligible. The step 03 needle now pivots on its hub (the last review's fault is fixed). There is one new assembly fault, on desktop only:
   - The strip's shared hairline (`.xrf-st-art::before`, `top: 50%`, drawn behind the SVGs) runs at 50% height.
   - The SVGs have no paper behind them, so the line shows through the drawings.
   - It cuts horizontally across the face of the step 03 gauge, above the hub, through its ticks.
   - On step 04 it runs through the waitlist bars and across the arrow.
   - On steps 01 and 02 it reads as the link line and is fine. On 03 and 04 it reads as a strike-through (proof: `img/referral-strip.jpg`).
   - At ≤899px the hairline is hidden, so phone is clean.
7. **Reference.** Apple's pinned, scrubbed scene (one word per stop) is really there in motion. The dark room opening from a card to full width brings the calm of the chatgpt enterprise page.
8. **Different from neighbours.** Yes. The journey word over a link track and the card as hero are its own. Affiliate uses sticky chapters, Startups an answering form and Grants stacked sheets.
9. **18 parts.** Covered as far as a walk can show:
   - one h1 and one `<main>`;
   - `data-cta`/`data-thumb` on the primaries;
   - Copy at 44px with a signed-out answer;
   - reduced motion lands every final state;
   - one dark room;
   - the header ask on phone.
10. **Banned tells.** None.
    - "Referrals" sits as a mono caption below the asks, not above the h1.
    - Page CSS uses only deck neutrals.
    - No gradient text, no icon boxes, no three equal boxes.
11. **Copy untouched.** Yes. All 20 strings and 3 links match the live file.

**Shared chrome (not counted against the page):**
- The kit's solid `Cta` hover `rgb(44,44,46)` and the greys `rgb(110,110,115)` and `rgb(245,245,247)` carry a faint blue cast. They are not deck neutrals.
- The `FooterHTML` hydration mismatch logs a console error and shows the dev "1 Issue" badge on every page.

## Fixes to reach 8
1. Stop the strip hairline crossing the drawings. Use one of these:
   - give each `.xrf-scene` a paper backing (a white rect behind the drawing's own body, not the full viewBox, so the line still meets the fan and lock where it should); or
   - draw the hairline in each SVG as its own path that stops at the gauge and the waitlist.

   Either way, the line must meet the drawings and not pass through the gauge face, the ticks, the bars or the arrow, at rest and during the replay.
2. Fill the lower half of the pinned journey on desktop. Either centre the word, track and count in the 100svh stage, or give the empty band something that belongs to the journey. One option is the three counts from the card, set small under the track, inking as the rider passes. Use only existing words.
