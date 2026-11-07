# /leaderboard coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Leaderboard.jsx` · gallery: `docs/gallery/leaderboard/` · metric id: `cta_click` on `leaderboard.hero`

Open copy questions for James: none (every visible string is Hanzo's or the register's).
Shared changes requested (`docs/requests/leaderboard.md`): kit `Band` (line-mask reveal, `cta` prop, 52px h2, no focusable magnetic wrapper); shared greys on the Apple ramp moved to the deck; PinScenes meter numerals. (The Morph freeze on in-site clicks was filed in `docs/review/SYSTEM.md`.)
Forks this page deleted: the v1 hero `Go` pair (second outlined button became a `More` text link); its own sticky pill (AskBar now defers to the shared ask bar); the gold accent; the 128px totals; round 2: the kit `Band` (replaced by a page-local close until the kit fix lands), the black calculator result panel, the receipt's invented line labels and summed totals, the points calculator (its steppers, +100…+500 chips, credits line and sum line showed figures Hanzo never prints; it became a scrubber over the board's own volumes), the visible "Linear"/"Log" words (icon tabs now), the infinite print-head loop.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; Hanzo's own label "Open bounties" → /bounty
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button (no prices on the page)
- [x] Open copy questions for James listed, none decided

Done here: One audience (builders and bug hunters) and one ask, "Open bounties": solid in the hero, carried by the shared sticky ask, and repeated once in the page-local close (`data-cta="leaderboard.band"`). "GitHub issues" and "Browse open bounties" (44px hit area) are text links.

## 2. Information architecture and navigation
- [x] One `<main>`; skip link from the shared layout
- [x] Every link through `A` or `More`
- n/a Breadcrumb: /leaderboard is depth 1
- [x] Link parity: 0 removed, 0 unexpected (2/2)

Done here: The order is who leads, how ranks are counted, the token board, how to earn, then your own points, then the close. Hanzo's header and footer are unchanged, and parity reports links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the podium lights a hunter and its tape adds up)
- [x] Nothing above the h1 ("Leaderboard" is a caption under it); `PageHero` n/a until the shared part merges
- [x] JS off: legible (0 hidden blocks measured with JS disabled); no `opacity:0` on the h1
- [x] One idea per 100svh; heights alternate (hero, list, dark board, pinned chapters, calculator, band)
- [x] Ends in proof (a scrubber over the board's own ten volumes), a band, footer
- n/a Card-to-page Morph: the page has no cards that open into pages

Done here: The h1 rests at 52px. At 1470x801 the whole podium and the tape's 84px total sit above the fold (pod 310 to 676, total 553 to 629); on phone the tape sits first and level, so the total (486 to 533) and the lit block (580 to 656) are inside 660px. The "Leaderboard" caption clears the h1 box by 12px. The close is page-local: "Climb the ranks. Earn AI credits." cut in by line mask at 52px in a wiped black room, with "Open bounties".

## 4. Conversion system
- [x] No raw `.x-btn` in the page (every solid ask is `.pf-btn`)
- [x] Sticky ask after the hero, same label: `data-thumb="Open bounties"` feeds the shared ask bar (`components/Ask.jsx`)
- n/a Copy button: none on the page
- [x] `data-cta="leaderboard.hero"` and `data-thumb` on the primary; `data-cta="leaderboard.band"` on the close

Done here: The solid fill sits in one place at a time: first the hero ask, then the shared bar, then the close. The close is page-local (the kit `Band` takes no `cta`; request filed), so its ask carries `leaderboard.band` and has no extra wrapper in the tab order. Solid hover is the deck's `#262626`.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy; each total shows its sum (bounty pts + tokens ÷ 100K), checked by a development-time assertion
- n/a Marquees: none
- n/a Submit: no form

Done here: No figure is worked out on the page. A rendered-text audit at 1470 and 375 finds every visible string in `content/live/leaderboard.json`, `content/pages/leaderboard.html` or `content/ui-strings.json`. The tape prints each hunter's own lines ("+450 bounty pts", "106,039,884 tokens (#1 global)") up to Hanzo's total; the receipt prints Hanzo's four card titles and rolls each card's own points (+50, +100, +20, +1); the scrubber shows the board's own ranks, orgs and volumes. The merged pull request card keeps "+$20 AI credits": it is on Hanzo's card in `content/pages/leaderboard.html` (the live text list de-duplicates the string).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phone) except mono capitals
- [x] Measures held (`text-wrap: balance` on headings, `pretty` on paragraphs)
- [x] Disclosure through the kit sheet (recent rewards)
- [x] `python3 scripts/parity.py /leaderboard`: 0 missing

Done here: Text 94/94, links 2/2. Detail sits behind a click: the three recent rewards open in a sheet, and the four earning rules come one per pinned chapter.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; the deck ramp is named once as `--k-*` tokens at the top of `Leaderboard.css`, no literal hex below it
- [x] No label above a headline
- [x] Flat tiles (`.pf-r .pf-obj` is `#f5f5f5`, no shadow); hairline rows; the tape and the calculator result are paper on the quiet tile
- n/a Icons: only drawn arrows and the pause glyph
- [x] Differs from neighbours: podium hero (vs /bounty's and /referral's right-hand panel heroes)

Done here: Apple greys replaced by the deck: quiet `#f5f5f5`, tiles `#ededed`, text `#525252`/`#737373`, `#a3a3a3` only on black, deck silver `#f6f6f6 → #e9e9e9` on the #1 block; weights 220/400/497/606 only. Token bars are flat (lead `#fafafa`, the rest `#a3a3a3`). Two black rooms (token board, close), never back to back; the calculator's result is now light.

## 8. UI component library
- [x] Every control has hover, press (.97/.98), focus-visible and disabled (steppers at 0 and 99)
- [x] Focus ring visible on every stop
- [x] The sheet traps focus, Esc closes it, and focus returns (`components/v2/DetailSheet.jsx`)
- n/a Inputs: only the styled range slider and steppers

Done here: The podium steps, pause, icon Linear/Log tabs (hover fill, press .97), the scrubber's icon stepper (hover fills ink, press .97, no scale on hover), slider (ink fill track, ring on hover) and sheet each answer hover, press and focus. The lists' auto-reader steps aside while the mouse is over them, so only one row is ever filled.

## 9. Motion and interaction
- [x] One signature (the self-adding sum) plus 3 supporting (line-mask cut-in, dark-room wipe, bars drawing); 0 fade-ups
- [x] 4 kinds: idle (podium cycle, lists reading themselves, the scrubber climbing the board once), pointer (row fill, step lift), state (pill glide, sheet, totals roll, board disclosure), scroll (pinned receipt, wipes)
- [x] Moves without input; every control answers
- [x] Reduced motion shows final states; no `setInterval` (the cycle is a `setTimeout` chain that stops off screen)
- n/a Sound: the shared sound kit is not merged yet

Done here: Durations are the deck's only (90/150/300/400/500 ms as `--k-*` tokens; scene moves: blocks 1 s, bars 900 ms). The receipt's print head draws once per new line (500 ms) and rests, so the pinned screen's mover is the rolling total. Every existing motion stays: podium adding up, auto-lit rows, rolling counters.

## 10. Media
- n/a `Film`/`Pic`: the page has no Hanzo images or films. Its objects are product-style UI (podium, tape, board, receipt, calculator).

Done here: The page uses no images or video, so it has no media budget, alt text or poster to set.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (audit script: 0 overlaps)
- [x] No horizontal scroll (`scripts/phone.mjs` 375/375)
- [x] Every target 44px or more; tap replaces hover (steps, pause)
- [x] Primary ask above the fold at 375×667

Done here: On phones the podium is cropped to its moment (tape first, blocks only; names stay in each step's accessible name), the token board shows three rows behind a "Show all" disclosure, the four chapters stack and one receipt prints after them, and big figures step down to 52px. Phone page 8,772px (was 11,561).

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
- [x] Figures are Hanzo's published board (static), so there is no loading or empty state; the scrubber's stepper disables at #10 and #1
- [x] No live data fetched, so a blocked API cannot blank the page
- n/a Forms: none
- [x] The shared error boundary covers a throw

Done here: With JS off every word reads in place (`<noscript>` overrides in the page and the kit).

## 18. Measurement and handover
- [x] `data-cta="leaderboard.hero"` on the primary; no tracking SDK imported (`lib/track.js` not merged yet)
- [x] Nothing identifier-bearing; no form
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/leaderboard.md` (6/10), all ten fixes worked through in round 2

Done here: The range input no longer raises a hydration mismatch (its fill rides `--f` on the label; `suppressHydrationWarning` on the input); the only console error left is the shared FooterHTML one. Round 2 proof: `docs/gallery/leaderboard/round2-*.jpg`.
