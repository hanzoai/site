# /founder — James-eye review

Ready: 8 Nov, held up next to /api and /agents (no score). The hero diff now draws from the first paint, the merge ends in a drawn ✓ and a review mark that keeps walking the diff, the card tilts under a fine pointer, steppers tick, deck greys replace the shared Apple greys, and the phone header line in the card is true. taste/unique/parity OK (text 37/37, links 1/2: the miss is Cloudflare's email-protection artifact, the support@hanzo.ai mailto is on the page); 0 console errors, no overflow/overlap at 1470x801 and 375x812.
Verdict: 7/10
First complaint: "For the first second the card on the right is just an empty grey box with some plus signs in it. Then it fills, merges, and after that nothing on the screen moves again unless I scroll."
(walked 7 Nov 2026 at HEAD `28a731ae`; the walk started on `b593b6af` and HEAD moved twice during it (`d7ce999c` changed the founder ask href and `usePhoneAsk`), so every ask and header finding below was re-measured on `28a731ae`; 1470×801 fine pointer and 375×812 touch, also 320×700, 375×667, reduced motion, JS off; api.hanzo.ai answered with an intercepted 500, so no real claim was sent)

## What works
- Round-3 hero fix landed. `.xfo-hero-obj` is at opacity 1 from the first sample (0.3 s), and only `y: 40 → 0` moves. The PR card is visible on arrival, and the h1 is cut in by line mask at 52px (40px on phone, 3 lines, h1 at 92–222, ask at 373–421, PR top at 533 inside 660).
- Merge runs once and holds. Desktop shows Open at 1.8 s and Merged at 2.4 s from navigation. The phone shows Merged by 3.5 s. Then it stays merged.
- The signature is real and scrubbed. The count goes 0 (y 341–700), 1 (1060–1420), 2 (1780) and 3 (2140) while scale runs 0.57 → 0.68 → 0.83 → 0.97 → 1. Level 1 inks at ≈1060 and Level 2 at ≈2140. On the phone the scene lies flat and counts once.
- One solid at a time now holds on desktop and phone. On desktop the header shows outlined "Try Hanzo" while the hero ask shows (`data-ask=quiet`), swaps to solid "Claim a merged pull request" from y≈1000, inverts in the dark room, and goes outlined (`data-pq`) while "Send the claim" is on screen. On the phone the header is outlined on the first screen and on the claim screen.
- Every hover and press answers. The hero ask goes from rgb(10,10,10) to rgb(44,44,46) on hover with press scale .98, no opacity fade. Find an issue underlines and its arrow moves 4px. The steppers fill on hover, press .97 and disable at 0. Stepper + + rolls the number and the level swaps to "Founding Builder · Level 2 · A month of Pro, and Hanzo swag" on both click and tap.
- The claim works. An empty submit focuses email, marks email, github and pull `aria-invalid`, and writes "Please fill out this field." under each. A 500 keeps all values, shows "Write to support@hanzo.ai with the address of the pull request." and never shows success.
- CLS: desktop 0.0002 (shared header cluster only), phone 0. scrollWidth is 320 at 320. At 375×667 the ask sits at 373–421. No page target is under 44px; the only small ones are shared footer and skip-link items.
- Reduced motion: Merged, count 3, 2 levels lit, the scene flat, 0 running animations after 3 s. JS off: h1 legible, 0 text elements at opacity 0, count shows 3.
- Parity 37/37 text. `taste.py` OK on both files. The "1 Issue" hydration badge in my frames is a test artifact: Playwright's screenshot injects `caret-color: transparent` into inputs during hydration. It disappeared (0/8 loads) when no screenshot was taken during hydration. Not charged to the page.

## The 11 answers
1. **5 s / 1 s:** the words sell in 5 s and the h1 cut-in moves inside 1 s. The PR is there, but its diff is empty. All bars stay at `scaleX(0)` at 0.3, 0.6 and 1.0 s on desktop (0.94 at 1.4 s) and are still at 0.12 at 1.5 s on the phone, because `.go` waits for hydration plus `useInView`. For the first ~1.3 s the right half is a grey box holding only "−/+" glyphs (d-arr-600). From about 2.5 s on, idle frames 1 s apart are byte-identical at both sizes.
2. **One in, one out:** yes through the pinned levels scene (320svh). After it the page is a stack: stepper, dark room (org names light one by one, rows slide in 24px at 60 ms steps), Questions, Claim. Gaps are tighter than round 3 (Mine padding-top 72px, claim 116px).
3. **Real object per section:** the hero PR, the count with the level cards, and the live bounty list are real objects. The stepper section has a 44px level name and two rows. Questions and Claim have none (acceptable for FAQ and form).
4. **One ask / scale:** one solid per viewport at both sizes on `28a731ae` (above). The phone header never carries the page's ask: it stays "Try Hanzo" all page (solid through the scene and after, outlined while a page solid shows). Scale has rhythm: 52 / 21 / 17, count 64→112 only in the scene, then 44 / 26 / 17. The dark room's four 44px org names are the one big thing there.
5. **Hover and press:** all answer, with no jumps (above). The steppers make no sound (plain buttons), and the FAQ is single-open: opening Q2 closed Q1 (`aria-expanded` false,true,false,false).
6. **Overlap / font swap / shift:** none on the page. CLS is 0.0002 on desktop and 0 on phone.
7. **Reference:** apple.com pinned scene with a growing figure. Present and measured.
8. **Neighbours:** its own hero medium (a self-merging PR) and signature (merge counter). It differs from /bounty and /grants.
9. **18 parts:** card filled, with one false claim (below).
10. **Banned tells:** none in the page. Still off-deck greys via shared tokens: lede computes rgb(110,110,115) (#6e6e73), `.xfo-any` rgb(161,161,166) (#a1a1a6), stepper hover rgb(245,245,247) (`--hz-50`).
11. **Copy:** untouched. Parity 37/37. The href `#claim` → `/founder#claim` changed a link target, not a word.

## Card check (docs/coverage/founder.md)
- FALSE: part 4 says that on phones `usePhoneAsk` "swaps it to 'Claim a merged pull request' after the hero". Measured on `28a731ae` at 375 every 500px from 0 to 7195: the header reads "Try Hanzo" at every step. `d7ce999c` made the hook skip the swap when the words do not fit. A false claim caps this verdict at 7.
- TRUE: one solid per screen (now including the claim screen, via `data-pq`); `data-cta` founder.hero, founder.claim and founder.bounties with `data-thumb`; Privacy Policy beside the submit; h1 52px; count 64→112 only in the scene; phone counts once; the list keeps its room; a failed submit keeps its values with no success; JS-off and reduced-motion states; no scroll at 320; parity 37/37; field errors say why on submit.
- TRUE (disclosed): part 7 says deck greys stay literal in Founder.css (12 literal colour lines), with the reason given. Part 3 leaves `PageHero` and `Band` unticked and says why. Part 18 leaves the review unticked.
- Roughly true: part 3, "merges about 1.1 s after it is seen". From navigation, Merged lands at 1.8–2.4 s on desktop.

## Fixes (in order)
1. Card part 4: rewrite the phone line to what happens now: "phones: the header keeps 'Try Hanzo' (the page's ask does not fit), outlined via `html[data-pq]` while a page solid is on screen".
2. Hero diff on paint. Do not gate `.xfo-diff i` drawing on `.xfo-pr.go`, which waits for hydration and `useInView`. Run it from CSS on first paint: `.xfo-diff i { animation: xfo-draw .8s cubic-bezier(.16,1,.3,1) both }` with the existing nth-child delays shifted to start at .15s. Keep `.go` only for the merge. Target: bars at full width by about 0.9 s at both sizes, so the box is never empty.
3. Something alive after the merge. Give `.xfo-pr` a pointer tilt (≤2.5°, fine pointer only, flat on leave, none under reduced motion). Draw the ✓ in `.xfo-btn.done` as an SVG stroke (stroke-dashoffset, 400 ms ease-emphasis) instead of a text swap. Today the first screen is frozen from about 2.5 s.
4. Stepper sound. Add `data-sound="tick"` (or whatever hook `Sound.jsx` exposes) to the `.xfo-st button`s so − and + tick like toggles (MASTER part 9).
5. Off-deck greys used by the page. Replace `var(--hz-50)` / `var(--hz-300)` on `.xfo-st button:hover` with deck values (#f5f5f5 / #d4d4d4 as page custom properties). Set `.xfo-any` to #a3a3a3 with enough specificity to beat the shared `.xp-lede` (`.xfo-repos .xfo-any`). Keep the shared `--soft` note in `docs/requests/founder.md`.
6. Shared request: the kit `Faq` is single-open, and MASTER part 6 asks for multi-open with `#q-slug`. Add it to `docs/requests/founder.md` for the kit owner.
