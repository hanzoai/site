# /leaderboard coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Leaderboard.jsx` · gallery: `docs/gallery/leaderboard/` · metric id: `cta_click` on `leaderboard.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/<page>.md`): none. (The Morph freeze on in-site clicks was filed under "Requests to the shared system" in `docs/review/SYSTEM.md`.)
Forks this page deleted: the v1 hero `Go` pair (second outlined button became a `More` text link); its own sticky pill (AskBar now defers to the shared ask bar); the gold accent; the 128px totals.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; Hanzo's own label "Open bounties" → /bounty
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button (no prices on the page)
- [x] Open copy questions for James listed, none decided

Done here: One audience (builders and bug hunters) and one ask, "Open bounties": solid in the hero, carried by the shared sticky ask, and repeated once in the closing `Band`. "GitHub issues" and "Browse open bounties" are text links.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link from the shared layout
- [x] Every link through `A`, `More` or the kit `Band`
- n/a Breadcrumb: /leaderboard is depth 1
- [x] Link parity: 0 removed, 0 unexpected (2/2)

Done here: The order is who leads, how ranks are counted, the token board, how to earn, then your own points, then the `Band`. Hanzo's header and footer are unchanged, and parity reports links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the podium lights a hunter and its tape adds up)
- [x] Nothing above the h1 ("Leaderboard" is a caption under it); `PageHero` n/a until the shared part merges
- [x] JS off: legible (0 hidden blocks measured with JS disabled); no `opacity:0` on the h1
- [x] One idea per 100svh; heights alternate (hero, list, dark board, pinned chapters, calculator, band)
- [x] Ends in proof (the calculator worked from the board's own rules), `Band`, footer
- n/a Card-to-page Morph: the page has no cards that open into pages

Done here: The h1 rests at 52px. The one big thing on the first screen is the tape's total (84px Air), which re-adds itself for each lit hunter. The page closes on the kit `Band`, "Climb the ranks. Earn AI credits.", with "Open bounties".

## 4. Conversion system
- [x] No raw `.x-btn` in the page (solid asks are `.pf-btn`; the `Band` uses the kit's `Go`)
- [x] Sticky ask after the hero, same label: `data-thumb="Open bounties"` feeds the shared ask bar (`components/Ask.jsx`)
- n/a Copy button: none on the page
- [x] `data-cta="leaderboard.hero"` and `data-thumb` on the primary

Done here: The solid fill sits in one place at a time: first the hero ask, then the shared bar, then the `Band`. The `Band`'s `Go` has no `data-cta` because the kit does not take one, and I may not edit the kit.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy; each total shows its sum (bounty pts + tokens ÷ 100K), checked by a development-time assertion
- n/a Marquees: none
- n/a Submit: no form

Done here: Every name, total and token count is Hanzo's own (parity 94/94). The receipt and the calculator only add up Hanzo's stated rules: +50 a bug, +100 to +500 a PR, +20 a referral, +1 per 100K tokens.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phone) except mono capitals
- [x] Measures held (`text-wrap: balance` on headings, `pretty` on paragraphs)
- [x] Disclosure through the kit sheet (recent rewards)
- [x] `python3 scripts/parity.py /leaderboard`: 0 missing

Done here: Text 94/94, links 2/2. Detail sits behind a click: the three recent rewards open in a sheet, and the four earning rules come one per pinned chapter.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (ink, greys and silvers only)
- [x] No label above a headline
- [x] Flat tiles (`.pf-r .pf-obj` is `#f5f5f5`, no shadow); hairline rows; the tape is the one dashed paper
- n/a Icons: only drawn arrows and the pause glyph
- [x] Differs from neighbours: podium hero (vs /trust's centred cabinet, /security's layer map, /benchmarks' chart stage)

Done here: Scale rhythm comes from `components/v2/ProofRhythm.css`: h1 52px, headings 26px, figures 64px, and one 84px Air "moment" per screen (tape total, 140.1M, receipt total, calculator total). There are two black rooms (the token board and the `Band`), never back to back.

## 8. UI component library
- [x] Every control has hover, press (.97/.98), focus-visible and disabled (steppers at 0 and 99)
- [x] Focus ring visible on every stop
- [x] The sheet traps focus, Esc closes it, and focus returns (`components/v2/DetailSheet.jsx`)
- n/a Inputs: only the styled range slider and steppers

Done here: The podium steps, pause, Log/Linear tabs, steppers, per-PR radio chips, slider and sheet each answer hover, press and focus. The slider is styled (no browser default).

## 9. Motion and interaction
- [x] One signature (the self-adding sum) plus 3 supporting (line-mask cut-in, dark-room wipe, bars drawing); 0 fade-ups
- [x] 4 kinds: idle (podium cycle), pointer (row fill, step lift), state (pill glide, sheet, totals swap), scroll (pinned receipt, wipe)
- [x] Moves without input; every control answers
- [x] Reduced motion shows final states; no `setInterval` (the cycle is a `setTimeout` chain that stops off screen)
- n/a Sound: the shared sound kit is not merged yet

Done here: Springs are gone. Swaps, bars and the pill run on ease-emphasis at 300ms (bars draw in 900ms). The podium's roster has a 44px pause control, first in its panel.

## 10. Media
- n/a `Film`/`Pic`: the page has no Hanzo images or films. Its objects are product-style UI (podium, tape, board, receipt, calculator).

Done here: The page uses no images or video, so it has no media budget, alt text or poster to set.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (audit script: 0 overlaps)
- [x] No horizontal scroll (`scripts/phone.mjs` 375/375)
- [x] Every target 44px or more; tap replaces hover (steps, pause)
- [x] Primary ask above the fold at 375×667

Done here: On phones the podium hides handles (still in the HTML), the pinned chapters stack each with its receipt, and big figures step down to 52px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: body `#525252` on white, captions `#737373` on white, light greys only on black
- [x] Pause control on the moving roster (`aria-pressed`)
- n/a Forms: none
- [x] One h1; an h2 per section; the sheet title is an h2 in its dialog
- [x] Keyboard reaches every control

Done here: `aria-pressed` on podium steps and pause, `role=radio` with `aria-checked` on the per-PR chips, `aria-live` on totals, and `aria-valuetext` on the slider.

## 13. Performance and engineering
- [x] h1 in the server HTML (a line-mask reveal, legible with JS off)
- [x] Motion is transform, opacity and clip-path only
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The only idle work is the podium's timer, which stops off screen (`useInView`). There is no canvas, video or blur.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`, unchanged (`app/leaderboard/page.jsx`)
- [x] Canonical: shared layout
- [x] `<JsonLd route="/leaderboard" />`
- n/a Cards: none

Done here: Metadata is "Leaderboard — Hanzo AI" plus Hanzo's description, unedited.

## 15. Catalogue and product pages
- n/a Not a catalogue or model page.

Done here: Not applicable: /leaderboard lists people and organizations, not models or products.

## 16. Developer experience
- n/a No code on the page.

Done here: Not applicable: the page shows no code, config or terminal.

## 17. States and resilience
- [x] Figures are Hanzo's published board (static), so there is no loading or empty state; the calculator has edge states (steppers disable at 0/99; "Below #10…" when your tokens fall under the tenth org)
- [x] No live data fetched, so a blocked API cannot blank the page
- n/a Forms: none
- [x] The shared error boundary covers a throw

Done here: With JS off every word reads in place (`<noscript>` overrides in the page and the kit).

## 18. Measurement and handover
- [x] `data-cta="leaderboard.hero"` on the primary; no tracking SDK imported (`lib/track.js` not merged yet)
- [x] Nothing identifier-bearing; no form
- [x] `V2:` line in the page file's top comment
- [ ] Review read: no `docs/review/leaderboard.md` yet

Done here: Filmed with `scripts/motion.mjs` (0 still screens, layout shift 0.000). Gallery holds `desktop.mp4`, `desktop.jpg` and `phone-1..3.jpg`. Waiting for the critic.
