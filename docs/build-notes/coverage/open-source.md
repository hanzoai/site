# /open-source coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/OpenSource.jsx` · gallery: `docs/gallery/open-source/` · metric id: `github_click`

Open copy questions for James: none. Decided here: commit totals differ by source (803,822 in Total across Hanzo; per-ecosystem figures elsewhere) and the hero's "38" sits beside the stat "73 organizations"; every figure is shown exactly as Hanzo prints it, nothing summed or derived. Copy rule (conductor, round 2): every visible string, number and aria-label checked against `content/live/open-source.json`, `content/pages/` and `content/ui-strings.json`; the invented ones were removed (pointer hint, "Charter" caption, card index numbers, composed sheet labels and share sentences, typed → ★ ⑂ glyphs now drawn icons, invented aria-labels).
Shared changes requested (`docs/build-notes/requests/<page>.md`): `docs/build-notes/requests/open-source.md` (round 2): the phone header ask should read "View on GitHub" like the desktop header, and ProofScale's `.pf-btn.solid:hover` fill `#2a2a2c` is off-deck (overridden page-locally here). Reported to the conductor: `components/Morph.jsx` waits on `requestAnimationFrame` inside the View Transition callback, which Chromium only runs at its 4 s timeout, so every in-site click freezes about 4 s; fix is `setTimeout(ok, 16)`.
Forks this page deleted: the floating AskBar pill, the cursor "Open" labels, the pinned ecosystem scene (now tabs), the second outlined hero button (now a text link), springs on the tab pills.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` — n/a for prices: the page has none
- [x] Open copy questions for James: none; decided on the page (above)

Done here: `// Persona / Goal / CTA / Metric: github_click / Signature / Beyond` head the file; the one solid ask is Hanzo's "View on GitHub" (white on the black hero), "Star Our Repos" is a text link; the closing band's one solid is Hanzo's own "Start Contributing". `lib/cta.js` has no entry for this page, so the labels are the live page's own.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site chrome)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more — n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity 139/139 links. Org cards are `<a href="/oss/<login>">`; the hero clusters open the same pages (`href()`), and every organization is also in the per-galaxy sheet list.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 — `PageHero` not merged yet, so the hero uses `MaskLines` (line mask) per MASTER part 0
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: 8 Nov: the h1's two lines cut up out of their masks (CSS, 700 ms, 60 ms apart, from the server HTML), then the caption, lede, asks and figures rise 160–360 ms after, so the headline always reads first; the page now ends Contribute → a centred black close room ("Join the Community" by line mask, "Start Contributing", Join Discord, Founder Program) → footer. Earlier: the h1 "Building in the open." cuts in by line mask; the sky pulls back from inside Hanzo to all three galaxies within 3 s of arrival with no input; "Open Source First" is a caption under the h1. JS off: 248 text blocks, 0 invisible; every tab panel shows. Order: sky → What we publish → Total → Every organization → Built on → Charter → Contribute (the band). Round 2: the list rise `xos-in` now has an end state (`to { opacity: 1 }`), so Totals, all six charter articles and the Contribute repository list are visible at both sizes (probe: every `.xos-arts > li`, `.xos-total-n > li`, `.xos-lrepos > li` at opacity 1, 1470 and 375); seams between paper sections tightened to 116 + 72px. Org card title morphs into `/oss/hanzoskill`'s h1 (`data-morph` → `data-morph-target`; filmed in `docs/gallery/open-source/click-through.jpg`, with the Morph fix above).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` — `.pf-btn` kit class until `<Cta>` merges
- [x] Sticky ask in header and bar after the hero, same label — on desktop Hanzo's header carries "View on GitHub" and the in-page band keeps only the name and the live read (no duplicate button); on phone the local band is not shown (one ask per screen; the phone header following the page ask is requested)
- [x] Copy button copies exactly the displayed text — n/a: no copy button on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta="open-source.hero"` with `data-thumb="View on GitHub"`; `data-cta="open-source.band"` on the close room's "Start Contributing". `.xos-local-a` is `display:none` from 900px up.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates — n/a: no marquee
- [x] Privacy link and owner line beside every submit — n/a: no form

Done here: every figure is from `openSource/snapshot.js`, written by `openSource/read.mjs` from the very read hanzo.ai's build baked in (api.hanzo.ai/v1/git/activity and GitHub, read Nov 7, 08:16), each with its own qualifier beside it ("In the past year", "as GitHub counts them"); the dashboard carries "Forge listing · read Nov 7, 08:16" and "Commits a day, from Nov 8, 2025 to Nov 7, 2026". On the hanzo.ai origin (the only one the API's CORS admits) `openSource/live.jsx` GETs /v1/git/activity after first paint and refreshes the forge figures it serves with the same meaning (each ecosystem's year of commits and merges, latest commits and their read time, every organization's commits this year and months, the total's commits); day cells, the past 7 days and GitHub figures stay as the build read them. Language shares are Hanzo's percentages, unchanged.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts — tabs are page-local APG tabs (arrow keys) until `<Tabs>` merges
- [x] `python3 scripts/parity.py /open-source`: 0 missing

Done here: parity 417/417 text, 139/139 links. Mono 12px only for captions and figure labels; body 14–16px; headings balance.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens — deck hexes only
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK. Rhythm on `ProofRhythm.css`: h1 52, section headings 26, one moment per screen: the hero's 1,734 rests at 64px (deck figure size) so the h1 is the one big thing there, and 803,822 counts up at 84 in Total; other figures 44/32. "Built on" shows Hanzo's twelve glyphs once, as a greyscale mark row on a `#f5f5f5` strip (not as 32px tile icons). Tiles are flat `#f5f5f5` fills (no outline, no shadow); only the hero tooltip floats and carries the deck's black shadow. Hero medium: a canvas of every repository, unlike /integrations' hub or /research's papers.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it — kit `DetailSheet` (focus in, Esc, focus back) until native `Sheet` merges
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: tabs, chips, cards, text links and the pause button press at `scale(.97)` in 90 ms; "Star Our Repos", "Join Discord", "Founder Program" and the "Read more" sheet triggers answer hover with a pill fill (`#f2f2f2`, white 14% on black); the closing ask hovers to `#262626`; pointing at a "Built on" credit lights its mark in the row, and pointing at a mark lights its credit (fill #ededed, licence chip inverts to ink); an organization card's hover thickens its repositories bar 3x and refills it to its share, and its commits line darkens; hovers sit inside `@media (hover: hover)`; focus is a 2px ink ring with a white halo (white with black on the hero). Deleted: the floating ask bar, cursor labels, outlined second button.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit — n/a: the sound kit is not merged; nothing plays

Done here: signature the card that opens (Morph). Supporting: the sky (idle: drift and twinkle; arrival: the pull-back), the tab pill gliding at 300 ms ease-emphasis while the heat map re-lights (state), the charter's drawn signature (arrival: 1.1 s once the signature line is 60% in view, the Hanzo mark beside it at 24px). The twelve Built-on glyphs are drawn in ink (text presentation where the glyph has one, a flat silhouette otherwise), no colour and no filter; each glyph stays in the page as text. Scroll-linked: only the line masks. No springs; hovers 150 ms ease-out, presses 90 ms, arrivals 400–500 ms ease-emphasis. Cards lean up to 2.5° (fine pointers only).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set — n/a: the page has no images or film
- [x] At most 2 videos playing — n/a
- [x] Budgets met; nothing missing; alt on every image — n/a
- [x] No dimmed or filtered photo — n/a

Done here: Hanzo has no photographs for this page; its visuals are its own data drawn (the canvas, the heat map, the language bar).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: `node scripts/phone.mjs /open-source`: OK, width 375/375. At 375 the sky is the top 45svh, the h1 sits at 40px, the ask is full width above the fold; the four counts stack with 1,734 first; tabs span the width. Round 2: "Built on" is two credits a row (was 12 full-width cards); the invented "point at a cluster" hint is gone; the mark row lights only for a mouse (`(hover: hover)`), so a tap never leaves it dimmed.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused — n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: text on white is `#0a0a0a`, `#525252` or `#737373`; on black `#fafafa`, white 78% and 55%. The hero lede measured `rgba(255,255,255,.78)` on `#000` (was `#525252`, 2.7:1, from `.pf-r .pf-lede`; now beaten by `.pf-r .xos-hero .xos-lede`). The sky has a 44px Pause (`aria-pressed`). Tabs use `role=tab` with arrow keys; the canvas and heat map carry Hanzo's own descriptions as labels.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the canvas loop runs only while the hero is on screen and not paused, and never under reduced motion; motion is transform, opacity and stroke. Filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/open-source/page.jsx` unchanged (metadata from `content/pages.json`, `<JsonLd route="/open-source" />`).

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` — n/a: no model cards on this page
- [x] Every card opens by Morph
- [x] Every maker and model page linked in the DOM — n/a: no models; every organization page is linked
- [x] One price figure everywhere — n/a: no prices

Done here: org cards (index numbers removed under the copy rule; each shows Hanzo's own repository count and bar) open into `/oss/<login>`, title first; all 56 organizations are linked (cards plus the per-galaxy sheet lists).

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display — n/a: no code on the page
- [x] Config blocks parse on their own — n/a
- [x] Terminal pauses and ends on a static frame — n/a
- [x] No hand-typed version number

Done here: no code; every repository and commit links to its source.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values — n/a: no form
- [x] A thrown island does not blank the page

Done here: the data is Hanzo's build snapshot (no live fetch), so the page is complete offline and with GitHub blocked; the Beyond's empty case is an em dash beside the ecosystem's name (no invented sentence); the language sheets open from "Read more" (`content/ui-strings.json`, shown icon-only with the words as its accessible name until James approves it).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/open-source.md` verdict 8 or more — read: 5/10; every Fix (1–7) addressed in round 2, awaiting a fresh review

Done here: `data-cta="open-source.hero"` and `"open-source.band"`; no tracking code on the page. `V2:` line in the top comment describes round 2. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`, `click-through.jpg`, and round 2 proof `round2-desktop.jpg`, `round2-totals-desktop.jpg`, `round2-phone.jpg`, `round2-phone-built.jpg`.
