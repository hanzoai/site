# /compare — James-eye review

Verdict: 7/10
First complaint: "The board up top is lovely, then it turns into a spreadsheet of tiny grey sentences. One thing at a time."

Walked 7 Nov (second walk, after the rework to greys), page file at `b6f73d1` (`components/pages/Compare.jsx`, `Compare.css`), on the preview of main plus the Proof branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/compare/desktop-walk.jpg`, `review/compare/phone-walk.jpg`. The machine was overloaded, so motion is judged from frames.

## What works
- The colour is gone. Greys, ink and white only. The Enso film still is the one image.
- The hero now has a live object. The verdict board walks rows 01–07 on its own: the pill glides, the four lanes flip to that row's answer, and Enso's lane is raised in ink. It moves without input and pauses under the hand.
- One ask, "Model routing APIs →" (Hanzo's words), in the hero, plus a desktop pill ("Hanzo vs · Model routing APIs") that stays after the hero.
- "HANZO VS" moved under the headline as a caption, so there is no eyebrow over the h1.
- "Count the Yes" still works (5/5, 2/5, 2/5, 4/5 recount as you untick rows). It is honest: Enso's 600+ sits beside 1,600+ and 1,800+.
- Parity: text 28/28, links 2/2. CLS 0 on desktop, 0.01 on phone. Reduced motion leaves 0 running animations. Hovers answer; the ask lifts 1px and darkens.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. Headline, one ask and a board that is already flipping.
2. **One in, one out, or a document?** The hero is a scene. After it, the page is a document: a full seven-row table with a sentence under every cell, then the tally, a card and the dark room. The row-per-screen chapters are gone, so nothing hands over to the next thing as you scroll.
3. **A real visual object in every section?** Board, tally figures, Enso card: yes. The table is a wall of 13px text, not an object.
4. **One ask, sticky after the hero?** Desktop: yes, the pill. But it sits under a solid "Try Hanzo" in the site header, so two different solid asks show together. Phone: the ask is in the hero only. After that there is just the header's "Try Hanzo", and no thumb bar for "Model routing APIs".
5. **Every hover and press answers, no jumps?** Yes on desktop, and the row switches answer taps on phone. The press on the ask does not scale or drop (hover lift only).
6. **Overlaps, font swap or layout shift?** None seen. Phone: the table runs off the right edge and you scroll it sideways with columns cut ("Op…"). JS off: 16 of 22 text blocks stay invisible.
7. **Which reference, is its motion there?** The board is motion.dev's toggle pill, done well. Apple's one-idea-per-screen is gone below the hero. synchronized.studio is claimed for the Enso card, but it lands on `/compare/model-routing`, a plain text page without the image.
8. **Different from neighbours?** Partly. Same frame as /comparison, /research and /security (white page, headline left, card right). The live board does give it its own hero object.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/compare.md`.
10. **Banned tells?** Clutter: an explaining sentence under every Yes and No in the table. The other tells are cleared.
11. **Copy untouched?** Yes. Parity clean; every figure (600+, 500+, 1,600+, 1,800+, 198 questions, 58.2%, 46.8%) sits in its source cell.

## Missing from the 18 areas
- **2.3 First impression:** the h1 is 67px, below the Display step (CANON h1 is about 106px at this width). The board wins the squint test, not the headline. No closing Band with the one solid ask (the dark room ends on a round arrow icon).
- **2.3 Morph:** the card's Enso image does not reach the destination hero.
- **2.4 Conversion:** no phone thumb bar for the page's ask. Header and pill compete on desktop.
- **2.6 Content:** the full table sits in the main scroll. The plan puts long tables behind a tab or sheet, and the page already has "Every row, in full".
- **2.15 / 2.11 Phone:** a sideways-scrolling table instead of list rows.
- **2.17 States:** most text is hidden with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Fold the table into the sheet.** The full sentences already live behind "Every row, in full". In the main scroll, keep only Yes or No per cell (ink and 40% grey) with the row name. Or bring back one row per screen, with the board pinned as you scroll.
2. **Phone gets list rows, not a table.** One row per card: the row name, then Enso, OpenRouter, Portkey and LiteLLM stacked, each Yes or No, and the sentence on tap.
3. **One ask everywhere.** Add the phone thumb bar for "Model routing APIs →". End the dark room on the same solid ask, not a round icon. Give the ask a press state (scale .98 or a 1px drop).
4. **Let the headline lead.** Raise the h1 to the Display step (about 96–112px at 1470) and let the board take the 5 columns beside it, so the words are the first mass and the board the second.
5. **Make the card land.** Ask the `/compare/*` family owner for the Enso image and the question title as that page's hero, so the click is continuous.
