# /tag coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Tag.jsx` (+ `Tag.css`, copy in `slackData.js`) · gallery: `docs/gallery/tag/` · metric id: `tag.hero`, `tag.close`

Open copy questions for James: none; the copy is unchanged (parity 168/168 text, 10/10 links).
Shared changes requested (`docs/requests/tag.md`): mirror the memoji, fix the shared A2Lines reduced-motion hydration, the phone header ask, cookie card height, the header solid beside the close's solid.
Forks this page deleted: the "@" chips in rounded boxes, the 180px "@" glyph and the solid black "Get Hanzo Tag" card, the outlined Explore pill buttons in the close, and the black Built detail panel.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: The close now has one solid ask ("Connect Slack Workspace"). The Explore links and Deploy to Cloud are text links, and the deploy card is a quiet `#f5f5f5` outlined tile.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /tag is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /tag` reports links 10/10. The `Go`/`.x-btn` links in the close became `More` with the same hrefs.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- [x] ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards open into pages

Done here: At 375x812 the phone first screen holds the h1, the lede, the solid ask, two text links (WIMSE moved below the docs link) and about 190px of the mention map. After the hero, every section now holds an object: the PR card, the room stage, the Built panel, the see room and the product frames.

## 4. Conversion system
- [ ] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask keeps `data-cta="tag.hero"` plus `data-thumb`, and the close keeps `tag.close`. `.x-btn` stays until `<Cta>` ships.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The new PR card and room art are built only from `DIFF`, `CANVAS`, `SETUP`, `BUILT` and `SESSION` strings (+32 -9, PR #418 merged · E2E green). The product frames are drawn shapes with no new words.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: The overlapping h3 is fixed: `.xtg-rows h3` rests at 21px with line-height 1.1 and only the active row grows (scale 1.14), and the Built h3 dropped from 28.8px to 21px. Parity reports text 168/168.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes, and the "pink accent" wording is gone from the header. The "@" icon chips were removed, and the Built panel became the quiet `#f5f5f5` room, so the dark rooms are only the hero moment panel and the "see" room, not back to back.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: On hover the promise captions fill `#f5f5f5` with a 1px underline, and the product frames lift 3px with an ink border. Rows and index buttons press at scale .98 and buttons at .97, each over 90ms.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] ~~Sound only on the listed moments, through the one kit~~ n/a: the shared kit owns sounds

Done here: `variety.py` passes with 3 techniques (Sigil, pathLength, useScroll). As the critic asked, the What rows and the Built index now follow scroll and their bars fill with it, and a Built click takes over; the map and the see picker stay the idle movers, and the PR lines wipe in by clip-path. `useEvery` now uses setTimeout instead of setInterval.

## 10. Media
- [x] ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no photos or films; the map, frames and Sigil are drawn
- [x] ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- [x] ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos

Done here: The memoji hotlinks were removed (hanzo.ai is unreachable here), so faces are drawn initial discs with 0 failed requests and no broken icons. Mirroring is filed in `docs/requests/tag.md`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: On the phone, the hero top padding dropped to 84px and the map top shows on the first screen. The rooms' art renders inline under each row, since the side stage hides on phone. A target scan at 375 finds 0 under 44px, and scrollWidth equals the viewport at 320 and 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Inactive moments, room stages and Built panels are `aria-hidden` and `inert`, and decorative art (PR card, frames, stage) is `aria-hidden`. Inactive row titles are `#737373` on white (4.7:1).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The hero moments stack in one grid cell, so the panel is as tall as its tallest moment and nothing below jumps while the map walks; the 520px min-height is gone. New motion animates only transform, opacity and clip-path.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Route metadata is untouched. All moments and panels stay in the server HTML (hidden with visibility, not removed).

## 15. Catalogue and product pages
- [x] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [x] ~~Every card opens by Morph~~ n/a: not a catalogue
- [x] ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- [x] ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue. The platform cross keeps its travelling signal and now shows each product's surface as a drawn frame beside its name.

## 16. Developer experience
- [x] ~~One `CodeBlock`; copy equals display~~ n/a: the diff is product UI, not a copyable block
- [x] ~~Config blocks parse on their own~~ n/a: no config
- [x] ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- [x] ~~No hand-typed version number~~ n/a: none shown

Done here: The only copyable text is the A2Paste prompt (copies what it shows). The PR card renders `DIFF.lines` exactly, including Hanzo's hex strings as copy.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: 0 console errors from /tag on desktop, phone, 320 and reduced motion. The other errors in that log were parse errors broadcast by another page's file (`ZenCatalog.jsx`), not from /tag. The map's reduced-motion state is gated behind a mounted flag, and the page imports `skills/Lines`, so the "1 Issue" hydration badge is gone.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: The `V2:` line was rewritten for this pass, and `docs/review/tag.md` (6/10) was worked through fixes 1 to 9, with the shared notes filed. A fresh critic verdict is pending.
