# /enterprise coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Enterprise.jsx` (+ `Enterprise.css`) · gallery: `docs/gallery/enterprise/` · metric id: `cta_click` on `enterprise.hero` and the Band (toward `contact_sales_submit`)

Open copy questions for James: the CTA labels. The hero's live label is "Get Enterprise plan" and the old close said "Talk to sales". The Band's solid now repeats the hero ask (MASTER 4.2: one identical sales ask), and "Talk to sales" stays as its text link, so no wording changed. Also: years beside the customer figures (the case copy has none, so none are shown).
Shared changes requested (`docs/requests/enterprise.md`): dock the shared ask bar so it never floats over content; kit `Band` blurs with JS off; kit `Film` has no pause control; `lib/cta.js`, `PageHero` and `tokens.css` are pending.
Forks this page deleted: the repeated deployment block and its second sales button; the long dark GPU room (now a light instrument plus a drawer); the clip-path wipe; the split-flap results (they showed numbers that are not Hanzo's); the scrolling logo marquee (now a still row); the kicker over the h1; the light hand-made close (now kit `Band`); `Answers` (now kit `Faq`).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport ("Get Enterprise plan"); "Build on Hanzo Platform" is the text secondary. n/a for `lib/cta.js` (not merged): Hanzo's own labels
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a for `lib/plans.js` (no price on this page)
- [x] Open copy questions for James listed, none decided

Done here: At 1470×801 the h1, lede, ask (bottom y=354), trust strip and three live log rows are all in the first screen. The Band's solid is the same ask; "Talk to sales" is its text link.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the shell's `#main` mark sits before the page's `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link (case results, offers)
- [x] n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity shows 23/23 links. "How Hanzo is secured" and "Trust center" are re-homed into the first-screen trust strip.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the first audit row lands at 0.9 s)
- [x] n/a: `PageHero` (not merged). Nothing above the h1; it cuts in by line mask at 700 ms with 60 ms between lines
- [x] JS off: legible (0 invisible blocks; log rows stack); no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof (the results board and the cloud row), `Band`, footer
- [x] Card-to-page: the rack card grows into its drawer; case results are links (Morph)

Done here: The order follows MASTER 4.2: hero with the sales ask; where it runs (four places, one in focus); trust strip (first screen, then Security right after the places); results; GPU detail one click down; `Band` with the same ask.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (`thumb` on the hero ask)
- [x] n/a: no copy button
- [x] `data-cta` and `data-thumb` on every primary

Done here: The ids are enterprise.hero, enterprise.platform and the Band's ask. The primary appears twice: in the hero and in the Band.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number. The cloud row is Hanzo's own line ("not partners or customers")
- [x] Every figure traces to Hanzo's copy; each case figure sits with its line and its case link
- [x] Marquee removed: the clouds are a still row, so there is no motion to pause
- [x] n/a: no form on this page

Done here: Results rise out of their masks once and show only Hanzo's value at every frame. The split-flap, which flashed other numbers, is gone.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (the workspace render is decorative and `aria-hidden`)
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (`DataTable` for prefill, `Faq` multi-open)
- [x] `python3 scripts/parity.py /enterprise`: 0 missing

Done here: Parity is 179/179 text. Every section label sits under its heading as a caption with a hairline lead.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes. Deck values are scoped on `.xe` until `tokens.css` lands
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24 tiles, 28 workspace, full for pills; never box plus shadow (the workspace is outlined, tiles are flat fills)
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours: a scrolled zoom over a product render (Pricing is a sheet of figures)

Done here: The scale has rhythm. The h1 is 52px Book 497 and section headings 26px. The place in focus is 44px and its wall label scales up while it is the moment. Figures are 44 to 64px Air 220, with 24/7 at 84px as that row's one big thing.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (.97 at 90 ms), focus-visible, disabled
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs trap focus and return it (`x-cannon/Drawer`, Esc closes)
- [x] n/a: no inputs
- [x] Forks this page deleted: listed above

Done here: Hovers change fill and tell you something (a prompt size reads on the instrument). Card lifts, the "+" spin and cursor labels are gone.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is one of five
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (static story, no pin); timers are one-shot timeouts
- [x] n/a: sound kit not merged (shared)

Done here: The kinds of movement:
- **Scroll:** the boundary zoom.
- **Time:** the log writes three rows in 4 s, then settles.
- **Arrival:** the h1 cut-in and the figure mask rises at 500 ms.
- **State:** the rack card grows into its sheet, and the readout rolls at 300 ms ease (no springs).
- **Pointer:** pointing reads a prompt size.

## 10. Media
- [x] `Film` (Zen) with poster; logos through kit `Img`
- [x] One video; its 8 s loop has a 44px pause button (register "Pause", `aria-pressed`), hidden under reduced motion where the film never plays
- [x] Budgets met; alt from names; decorative marks `alt=""`
- [x] No dimmed photo (only a gradient under the tile text)

Done here: The Zen film plays only on screen (kit `Film`). Customer and cloud logos fall back to their names when they cannot load.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 or 375
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: The phone composition is its own: headline, ask, the live workspace (4 rows in the first screen), then the trust strip. The pinned scene becomes tappable places that turn by themselves until touched.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: text #0a0a0a, #525252 and #737373 on white; #525252 on #f5f5f5
- [x] Pause control on every moving item over 5 s (the film); the log settles in 4 s and the live dot pulses twice
- [x] n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control (places, prompt sizes as a radio group, rack card, drawer)

Done here: The workspace render is `aria-hidden`. The places caption is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] The one film is lazy and plays only on screen; images sized
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Motion is transform, opacity and clip only. The pinned scene is 360svh (shortened from 540vh), and its section heights use `svh`.

## 14. SEO and machine files
- [x] Title and description match `content/pages.json` (the description was corrected to it)
- [x] Canonical equals og:url equals the live URL (`https://hanzo.ai/enterprise/`)
- [x] `<JsonLd route="/enterprise">` parses
- [x] Every card is a real link

Done here: The title is "Enterprise AI — Hanzo AI". Every place, caption, drawer line and answer is in the server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a
- [x] n/a
- [x] n/a: no prices on this page

Done here: n/a. The Zen 6 links go to `/benchmarks/zen-6` and `/zen/zen6-max`.

## 16. Developer experience
- [x] n/a: no code block (the endpoints in the workspace render are decorative)
- [x] n/a
- [x] n/a
- [x] No hand-typed version number

Done here: n/a. "Build on Hanzo Platform" goes to platform.hanzo.ai.

## 17. States and resilience
- [x] n/a: no live data, so no loading, empty or offline state
- [x] Blocked media leaves a complete page: logos fall back to names, the film to its poster
- [x] n/a: no form
- [x] A thrown island does not blank the page (shared `app/error.jsx`)

Done here: With hanzo.ai blocked in the cloud, every logo became its name in type with no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary. `lib/track.js` is not merged; kit `Cta` dispatches `hz-event` cta_click
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/enterprise.md` verdict 8 or more (none on main yet; my own critic said 6.5 on the build before this rework)

Done here: The critic's eight items are addressed:
1. the live log is in the first screen
2. the walls arrive after the headline leaves
3. no flashed numbers
4. labels under headings
5. one identical ask
6. the "Who" column aligned (a class clash)
7. a shorter pin with a growing place name
8. JS-off rows stacked
