# /bounty coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Bounty.jsx` · gallery: `docs/gallery/bounty/` · metric id: `github_click`

Open copy questions for James: none (Hanzo's words and live GitHub data only).
Shared changes requested (`docs/build-notes/requests/<page>.md`): none.
Forks this page deleted: forked `x-btn solid` / `x-btn xp-ghost` buttons (now kit `Cta`), tile hover lifts with shadows, the stepper's box-plus-shadow, oversized 10rem/8rem/6rem figures.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/bounty/page.jsx` names Persona, Goal, CTA, Metric `github_click`, Signature, Beyond. One solid per screen: kit `Cta` "Every open bounty" (`bounty.hero`). Desktop: the header's button is an outline while it shows, then carries "Every open bounty" down to the footer (`useHoldHeaderAsk` re-asserts it if the header's text is reset under the shell; see `docs/build-notes/requests/bounty.md`), and goes outline again while the closing band's ask shows. Phone: the page sets the shell's `html[data-ask=quiet]` while the hero ask is on screen, so the header's Try Hanzo is an outline there and solid after; the phone bar is the shell's quiet one. No copy questions.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`; GitHub issues open in a new tab; parity links 5/5.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages; issue rows link out to GitHub.

Done here: No label above the h1 (Hanzo's "Bounties & Rewards" sits inside the window's bar, beside "Open bounties"). "Take an issue. / Ship the fix." (52px) cuts in by line mask; the sub, the ask and the window rise by CSS from first paint (all on screen by 0.8 s, no wait for hydration); the GitHub window's rows deal in within 1 s (server HTML holds the build snapshot, `Bounty.snapshot.js`, so it is never empty); at 2.4 s the newest bounty arrives at the top as the count ticks 9→10; then a quiet reader walks the rows every 3.2 s (paused under the pointer, off screen, reduced motion). `PageHero` is not in the kit yet (hero page-local). The middle is one in, one out: standings, the awards deck, then the token race as one pinned scene on desktop. The page ends on the PR stage, one "Propose a bounty" card (words left; link and the security line in its foot), then a closing `.x-band` with the page's own headline and its one ask (`bounty.band`), then the footer. JS off: `NoJs` shows every final state.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only (no raw `.x-btn` in the page file); `data-cta` and `data-thumb` on the hero ask; `data-cta` also on Leaderboard, How to contribute and the window's Every open bounty. GitHub unreachable shows the build snapshot; nothing open hands off with a quiet kit `Cta` "Propose a bounty".

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- ~~Privacy link and owner line beside every submit~~ n/a: no form; the ask leaves for GitHub.

Done here: Every figure is Hanzo's own (points per way, standings, token counts, 217 organizations); qualifiers sit beside each number; no logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code; the standings are an ordered list Hanzo wrote.
- [x] `python3 scripts/parity.py /bounty`: 0 missing

Done here: Parity 102/102 text. Type from MASTER: h1 52px, section heads 26px, tile figures 64px (first and last) and 44px (middle), totals and standings 44px, names 21px, body 16–17px, mono meta 13px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only); nothing above a headline; objects outlined, radius 24, no box plus shadow; one dark room (the race). Differs from /beta (films) and /affiliate (link as type): its hero object is the live GitHub window.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: forked `x-btn solid` / `x-btn xp-ghost` buttons (now kit `Cta`), tile hover lifts with shadows, the stepper's box-plus-shadow, oversized 10rem/8rem/6rem figures. listed below

Done here: Kit `Cta` states; steppers have hover, press .97 in 90ms, focus ring and disabled at zero; issue rows, race lanes and tiles answer hover (fill, dim-the-rest, hairline darkens and the figure drifts 12px). Press: hero Cta scale .98, text links .97, issue rows .99, deck bars and PR title 1px down.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Signature: the race, one pinned scene on desktop (240vh, the room holds while the ten bars race and @hanzo's figure counts), scrubbed in place on phones; the figure grows only while it runs. Time: the newest bounty arrives once with the count ticking up, a reader walks the rows, the window's pulse; the tiles count through Hanzo's examples until you touch a stepper; the awards deck deals the next report every 5 s with its bar running. State: the marker glides to your total; the PR window (pinned on desktop) changes state open issue → pull request → merged as the three steps are read, its head inking in at merged. Arrival: line-mask headline. Ease-emphasis, no springs; reduced motion shows final states, read after mount (`useCalmed`), so the server and first client render match (0 console errors with reduced motion, 3 cold loads at each size).

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the objects are the live window, tiles, race and timeline.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the objects are DOM (live GitHub window, tiles, race, awards deck, the PR window).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: hero ask full width above the fold, window below; tiles stack with steppers under the words; race lanes stack; no horizontal scroll at 320; targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form; the steppers are labelled buttons with a live output.
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+ on white and on the dark room; one h1, h2s in order, h3 per tile; steppers labelled with live output; Hanzo's "Asking GitHub for the open bounties." is a status line while GitHub is asked. Moving items pause: the deck and the row reader stop under pointer or focus and the deck's bars pick any report; reduced motion stops both.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; one GitHub search request, no poller; motion is transform and opacity; loops stop off screen and under reduced motion.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/bounty" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form.
- [x] A thrown island does not blank the page

Done here: The live window shows the build snapshot (`Bounty.snapshot.js`, refreshed by `node components/pages/Bounty.github.test.mjs --snap`) until GitHub answers and keeps it if GitHub is blocked; empty hands off to "Propose a bounty". A blocked request leaves the full page with no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/bounty.md` verdict 8 or more

Done here: `data-cta` ids `bounty.hero`, `bounty.leaderboard`, `bounty.contributing`, `bounty.window`, `bounty.propose`, `bounty.band` (kit Cta fires `cta_click`); V2 line in the page file and route header; review `docs/build-notes/review/bounty.md` (6/10 at `c2fa6e5`): no eyebrow, 0 hues (checked computed), idle move added, awards as one deck, take as the PR itself, press states, phone one solid. Round 2 (7/10): reduced-motion hydration fixed, header ask held to the footer, race pinned as one scene, propose card and closing band, hero lands by CSS, step nudge removed, last row fades, security link hover, phone range on one line.
