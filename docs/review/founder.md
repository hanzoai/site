# /founder — James-eye review
Verdict: 7/10
First complaint: "The counter bit is lovely, but once it's done the page goes back to being a document: a widget, a list, questions, a form, all just sitting there. And the button in the top corner flicks from Try Hanzo to Claim and back while it loads."
(walked 7 Nov 2026, HEAD `f244a55c`, 1470×801 fine pointer and 375×812 touch; also 320×700, 375×667, reduced motion, JS off; api.hanzo.ai intercepted, no real claim sent)

## What works
- Monochrome throughout; `taste.py` passes; no eyebrow above the h1; the green/purple/red from the last review are gone.
- Hero reads in 5 s: 52px h1 cut in by line mask, 21px lede, one solid ask (`founder.hero`), and a pull request that goes Open → Merge (pressed) → Merged once at ~1.4 s and stays merged.
- The signature is real and scrubbed: pinned 320svh scene, count 0→1 (y≈1200) →2 (1600) →3 (2000), scale 0.57→1 (64→112px), Level 1 pour and outline ink at 12–30%, Level 2 at 62–85%. One thing comes in while the other settles.
- Header ask becomes "Claim a merged pull request" once the hero ask leaves view on desktop; no floating bar, nothing covers content.
- Stepper answers: hover fill, press scale .97, level text swaps (Level 1 → Founding Contributor → Founding Builder at 3).
- Live bounty rows (hanzo-go/lz4#1 …) with arrow nudge (translate 3px,-3px) and underline on hover; list keeps 400px room.
- Claim: empty submit focuses email, marks email/github/pull `aria-invalid`, sends nothing; a 500 keeps every value and shows Hanzo's support sentence.
- CLS desktop 0.0039 (header chrome only), phone 0. No horizontal scroll at 320. Phone ask top 373–421 at 375×667. Reduced motion: Merged, 3, both levels lit, scene flat. JS off: h1 opacity 1, nothing hidden, scene laid flat.
- Parity 37/37 text; every heading and label found in `content/live/founder.json`.

## The 11 answers
1. **5 s / 1 s:** yes. h1 cuts in at 0–0.7 s, PR rises at 0.2 s, merges at ~1.4 s. After ~2 s the first screen is completely still (two screenshots 1 s apart identical on both sizes): no idle life.
2. **One in, one out:** yes through the pinned levels scene; after it (y > 2560) it is a stack: stepper (402px), dark room (922px), FAQ (611px), form (691px), no motion between them except the bounty rows sliding in once.
3. **Real object per section:** hero PR, counter + level cards, live bounty list: yes. Stepper section is a bare widget with a grey 44px "Level 1" and no heading; the dark room's left half is four org names and ~250px of empty black under them; FAQ and claim are plain.
4. **One ask / scale:** desktop yes (header swaps to the page ask after the hero). Phone: header "Try Hanzo" stays solid the whole page and sits beside the solid hero ask (2 solids in the first screen); no phone bar. In the dark room "Every open bounty" is a white filled pill (bg #fff) next to the white header ask: 2 solids. Scale rhythm good: 52 / 21 / 16, count 64→112, then 44 / 26 / 17.
5. **Hover and press:** hero ask hover bg #0a0a0a→#2c2c2e, press .98; Find an issue underline + arrow; steppers, rows, FAQ underline all answer. "Every open bounty" hover only adds a 10% grey ring (barely visible). Invalid fields turn dashed with no words.
6. **Overlap / font swap / shift:** none on page. Header flicker on arrival measured: "Try Hanzo" solid (0.35–1.05 s) → "Claim a merged pull request" solid (1.2–1.37 s, while the hero ask is still fading in) → "Try Hanzo" outline (1.5 s+). Cause: hero ask starts at opacity 0 inside the delayed `motion.div`, so the header thinks it is off screen.
7. **Reference:** apple.com pinned scene with a growing figure and panels changing beside it; present and measured.
8. **Neighbours:** own hero medium (self-merging PR) and own signature (merge counter); differs from /bounty and /grants.
9. **18 parts:** card filled; two claims false (below); part 3 `PageHero` and `Band` left open honestly.
10. **Banned tells:** none seen. Off-deck greys in page CSS (#6e6e73, #a1a1a6, #f5f5f7 at Founder.css 79/80/83/84/92) are Apple greys, not the deck ramp (#737373, #a3a3a3, #f5f5f5).
11. **Copy:** untouched; parity 37/37.

## Card check (docs/coverage/founder.md)
- FALSE: part 5 "[x] Privacy link and owner line beside every submit": `#claim` contains no Privacy link (DOM search for "privacy" in `#claim`: none).
- FALSE: part 7 "no literal hex outside tokens": Founder.css has literal #6e6e73, #a1a1a6, #f5f5f7, #fff and rgba values.
- Partly false: part 4 "Sticky ask in header and bar after the hero, same label": true on desktop; on phone the header keeps "Try Hanzo" and there is no bar.
- Partly false: part 1 "'Every open bounty' is quiet in the dark room": it renders as a white filled pill (computed bg rgb(255,255,255)).
- Inexact: part 2 "One `<main>` from the layout": the `<main>` is the page's (`main.xp.xfo`, no id); `#main` is a layout `div`.
- True: one h1 52px; `data-cta` founder.hero / founder.bounties / founder.claim, `data-thumb` on the primary; PR merges once; count 64→112 only in the scene; phone counts 0, 1, 3 once (measured 0→1→3 in ~1.2 s); list min-height 400px; failed submit keeps values and shows no success; JS-off and reduced-motion states; no horizontal scroll at 320; parity 37/37.
- A false claim caps this verdict at 7.

## Fixes (in order)
1. Header flicker: render the hero ask visible from the first paint. In `Hero`, drop `opacity:0` from the `motion.div` wrapping `.xfo-acts` (animate only `y`, or move `.xfo-acts` outside it) so `[data-thumb]` is in view at hydration and the header never swaps to "Claim…" during load.
2. Privacy by the submit: add the shared Privacy link (existing footer label "Privacy", `/privacy`) beside "Send the claim" in `.xfo-form`, or untick part 5 and say why.
3. Replace off-deck literals in Founder.css with tokens/deck values: `.xfo-orgs li:nth-child(even)` #6e6e73 → white 55%; `.xfo-any`, `.xfo-open li a span`, `.xfo-say` #a1a1a6 → #a3a3a3; `.xfo-open li a` #f5f5f7 → #fafafa; `.xfo-badge` / `.xfo-lv-c` #fff → token.
4. Make the dark-room "Every open bounty" truly quiet: `.xfo-every` transparent fill, 1px white 30% outline, #fafafa text; hover fills white 8% and nudges an arrow, so the header ask stays the only solid.
5. Give the after-scene stack life (James's "one in, one out"): e.g. `.xfo-orgs li` light one by one as the room enters (ink #fafafa travelling down the four names, 300 ms each, once), and let the stepper section open with the count from the scene handing off (the 3 shrinks into the stepper output) instead of a grey "Level 1".
6. Fill the dead black under `.xfo-orgs`: top-align `.xfo-repos-l` with `position: sticky; top: 120px` so the org list rides beside the bounty list instead of leaving ~250px of empty black.
7. Invalid fields need words: pass the existing Hanzo field message (or `content/ui-strings.json` entry) to `Field` `error` for email/github/pull so `.x-field-msg` is not empty; dashed border alone does not say why.
8. Phone ask: request in `docs/requests/founder.md` that the header ask label swap to the page ask (or go quiet) under 900px once `founder.hero` leaves view, so the first phone screen has one solid.
9. One idle life after arrival on the hero: e.g. the PR diff bars draw in once more slowly as the hero sits (or the merged check settles with a 900 ms hairline), so the first screen is not frozen after 2 s. Keep it once, no loop.
10. Fix the card: correct parts 1, 2, 4, 5, 7 as above.
