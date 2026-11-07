# /referral — James-eye review

Reviewed: main, page files at `4b53974` (re-walked after the site-wide palette recolour of 14:29; first review at `3a5cb5f`, 5/10). Walked moving at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Note (7 Nov 14:12): a hydration error seen in the first walks came from the shared shell and is gone on main; it is not counted against this page. Text is now legible with JavaScript off (shared fix at 14:05, re-checked).

Verdict: 6/10

What changed: the palette recolour took the lime out (0 UI hues measured). Nothing else on the page changed: the eyebrow, the icon boxes and the fading Copy are still there.

First complaint: "The green is gone, good. But there's still a 'REFERRALS' label on top of the headline, and 'How it works' is still four little icons in boxes in a row."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It reads: "Bring a builder to Hanzo." and Hanzo's line, "Get your link", beside hanzo.ai's own referral card. But the card is small and nearly still: after arrival the first screen changes by 0.2% (a few dots moving in the counts). It does not feel alive.
2. **One in, one out?** Partly. The display-size rails ("Referred → Pending → Qualified", the ways to share) run past in opposite directions, which is a good moment. "How it works" is a row of four boxes. The dark room compares referral and affiliate side by side.
3. **A real object in every section?** Hero card and rails, yes. "How it works" is icons and sentences.
4. **One ask, sticky after the hero?** Yes on desktop: a floating pill carries "Get your link" after the hero and the header's "Try Hanzo" turns outlined. On the phone the header's solid "Try Hanzo" shows beside the pill.
5. **Every hover and press answers?** "Get your link" answers on hover; "Sign in" does not. **"Copy" only fades on hover** (a banned tell); it does press.
6. **Overlap, font swap, layout shift?** None; layout shift 0.
7. **Which reference, and is its motion there?** grubogrubo (big type rails, playful) and a product-card hero. The rails are there; the card is too small to carry the first screen.
8. **Different from its neighbours?** Yes: the rails are its own.
9. **All 18 parts covered?** See below. No `docs/coverage/referral.md`.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 ("• REFERRALS", now a grey dot, mono caps).
    - Icon boxes in a row ("How it works": four icons in rounded boxes with a sentence each).
    - A button that fades on hover ("Copy").
11. **Copy untouched?** Yes as measured: parity 20/20 text, 3/3 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.8 Button states:** "Copy" hover is opacity only.
- **2.4:** two solid buttons after the hero on the phone; 0 `data-cta`.

## Fixes
1. Remove "• REFERRALS" from above the h1.
2. Replace the four icon boxes with one object (for example the referral card itself stepping through Share → Signs up → Qualifies → Moves up), so the steps happen rather than sit in boxes.
3. Make the hero card larger and let one builder visibly land in it, once, so the first screen moves.
4. Give "Copy" a real hover (not opacity) and the copy confirmation from the brief.
