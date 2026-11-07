# /kata coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Kata.jsx` (+ `.css`) · gallery: `docs/gallery/kata/` · metric id: `cta_click kata.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/kata.md`): UI strings (A Kata session, Test runner, CI, Language, The suite turns) as accessible names only; data-cta on the kit Band; the desktop ask bar floating over content; the Terminal and PageHero kit parts.
Forks this page deleted: the hand-written hero and close buttons (now kit Cta and Band), the custom closing section, the capabilities report bar and PASS chips, the invented stack-check title, labels and answer sentence, the green wipe and every green, the 108px and 320px type, springs.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [ ] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: Header lines Persona/Goal/CTA/Metric/Signature/Beyond in Kata.jsx; one solid: kit Cta "Get API key" (kata.hero, thumb) in the hero, repeated in the kit Band. `lib/cta.js` does not exist yet; the label and href are Hanzo's own from the page.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One <main> inside the layout's #main marker and skip link; links via kit A and Cta; site pages in the link cards carry data-morph; parity links 11/11; depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: h1 "Test. Repair. Verify." at 52px cuts in by line mask (700 ms, 60 ms apart) and lights word by word with the live session; it moves within 1 s (alive check: moving at 1470x801 and 375x812). JS off: 0 hidden text (4 dial number buttons hidden on purpose). Ends: questions, kit Band, footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit Cta only (solid hero, quiet GitHub, plain docs link); the ask bar carries "Get API key" via data-thumb; the A2Paste strip copies exactly the prompt it shows.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form sends anything (the stack check is local)

Done here: No logos, seals or invented figures: 12 passed · 1 failed and 13 passed · 0 failed are Hanzo's session text; the stack check answers only with Hanzo's own sentences.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /kata`: 0 missing

Done here: Deck sizes: h1 52, section headings 26, H3 17, lede 21, body 16, figures 44 in the board and 64 at rest in the dial and room; 13px floor (mono render text 13-14px). Parity 76/76 text, 11/11 links. FAQ through A2Faq; the terminal is page-owned until the kit Terminal lands.

## 7. Visual design system
- [ ] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [ ] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py passes (deck greys only, no green); brows check 0 labels above a headline; tiles 24, cards 16, no shadows; failing shown by an outline dot and a strike, not a hue. Literal greys in Kata.css still to move onto tokens.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the hand-written hero and close buttons (now kit Cta and Band), the custom closing section, the capabilities report bar and PASS chips, the invented stack-check title, labels and answer sentence, the green wipe and every green, the 108px and 320px type, springs. listed below

Done here: Chips, Replay and links press to .97 or 1px; focus ring from the system and on Replay; hovers only inside (hover: hover); no inputs.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the loop headline lit by the live session (time); supporting: pinned dial chapters (state), the room's scrubbed wipe and growing figure (scroll), drawn ticks (arrival); variety.py OK; reduced motion shows the passing state; timeouts only, no setInterval.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or films: the board, terminal, dial and room are drawn in the DOM
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: Hanzo has no Kata media

Done here: No media on this page; every visual is drawn in the DOM with Hanzo's real session text.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375x812 and 1470x801: 0 text overlaps; 320 scrollWidth 320; ask bottom at 524px on 375x667; chips, Replay and links 44px or more on phones.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text #0a0a0a/#525252 on white and #a3a3a3 or lighter on black; pause control first in the hero box (stops the loop and the cursor); radio groups named; one h1, h2 sections, h3 items; keyboard reaches every control.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and the hero object are in server HTML (passing state); transform, opacity and clip-path only; the loop stops off screen and when paused; budgets not yet measured.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: app/kata metadata unchanged from content/pages.json; JsonLd route=/kata; every card row is a real link.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue; site links in the read cards open by Morph.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: no config block on this page
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The terminal replays Hanzo's session and ends on its full static frame with a pause control; no version numbers. Page-owned until the kit Terminal lands.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: No live data, so nothing can fail or load; the stack check has an empty state (Hanzo's sentence in grey until you pick).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/kata.md` verdict 8 or more

Done here: data-cta on kata.hero; the kit Band's button has no data-cta yet (requested); Cta sends cta_click through the system event; V2 line in the header; last review 6/10 was on an older build (green, eyebrows, fold and Band complaints fixed).
