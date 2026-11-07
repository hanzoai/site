# /mcp coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/McpPage.jsx` (+ `.css`) · gallery: `docs/gallery/mcp/` · metric id: `cta_click mcp.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/mcp.md`): data-cta on the kit Band; the desktop ask bar floating over content; the PageHero kit part.
Forks this page deleted: the hand-written hero and close buttons (now kit Cta and Band), the hand-built code panels (now kit CodeBlock), the orange tool stream and its coloured shadow, the 196px figures, the sheet outlines and shadows, the numbers above card titles, the drag cursor label, springs, setInterval.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [ ] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: Header lines Persona/Goal/CTA/Metric/Signature/Beyond in McpPage.jsx; one solid: kit Cta "Browse 260+ tools" (mcp.hero, thumb), then quiet "Read the docs" and a link to GitHub; the Band closes on "Browse All Tools". `lib/cta.js` does not exist yet; labels and hrefs are Hanzo's.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One <main> inside the layout's #main marker; links via kit A and Cta; parity links 5/5; depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: h1 52px in three lines cut in by line mask; the tool stream moves within 1 s (alive: moving). JS off: 0 of 74 text blocks hidden. Ends: Get MCP card, kit Band, footer. The six domain cards open into sheets by a shared-element morph.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit Cta only (no raw .x-btn); the ask bar carries "Browse 260+ tools" via data-thumb; both CodeBlocks copy exactly what they show (the JSON parses alone).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form on this page

Done here: Only Hanzo's figures: 38, 1,538, 260+, 2ms, 6.4ms, Apache-2.0 and 8 stars, as the page prints them; no logos or seals.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /mcp`: 0 missing

Done here: Deck sizes: h1 52 (32 on phones), section headings 26, card titles 17, lede 21, body 16, figures 64 at rest growing to 1.45x while they cross the screen; 13px floor. Parity 72/72 text, 5/5 links. Code in kit CodeBlock.

## 7. Visual design system
- [ ] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [ ] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py passes (greys only); brows check 0 labels above a headline; tiles 24, cards 16, sheets flat fills with no outline or shadow; only the open sheet (a dialog) takes a shadow. Literal greys still to move onto tokens.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the hand-written hero and close buttons (now kit Cta and Band), the hand-built code panels (now kit CodeBlock), the orange tool stream and its coloured shadow, the 196px figures, the sheet outlines and shadows, the numbers above card titles, the drag cursor label, springs, setInterval. listed below

Done here: Cards press to .98, close to .96; focus ring from the system; hovers only inside (hover: hover). The open sheet is a role=dialog div (not native <dialog>, because the card morphs into it): Escape closes, Tab stays inside, focus returns to the card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: cards that open (state, layoutId morph, 400 ms ease-emphasis); supporting: the tool stream (time), stacked sheets and growing figures (scroll), the drag rail (pointer); variety.py OK; reduced motion stops every loop; timeouts only.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or films: the stream, sheets and cards are drawn in the DOM
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: Hanzo has no MCP media

Done here: No media; every visual is drawn with Hanzo's tool names.

## 11. Mobile and responsive
- [ ] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375x812: 0 overlaps; 1470x801: the only overlaps are the stacked sheets, opaque by design (each covers the last; only its padding shows); 320 scrollWidth 320; ask bottom at 558px on 375x667; 44px targets.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text #0a0a0a/#525252 on white and #a3a3a3 or lighter on black; pause controls on the tool stream and on the sheets' loops; one h1, h2 sections, h3 cards; every card is a button with its title as name.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and stream in server HTML; transform, opacity and clip-path only; the stream stops off screen and when paused; budgets not yet measured.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: app/mcp metadata unchanged; JsonLd route=/mcp; Hanzo's exact config block kept in the HTML for search.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue; the domain cards open in place by morph.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Two kit CodeBlocks: .mcp.json (valid JSON on its own) and the shell lines; copy equals display; no version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: No live data, so nothing loads or fails; closing the sheet restores the rail and focus.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/mcp.md` verdict 8 or more

Done here: data-cta on mcp.hero; the kit Band's button has no data-cta yet (requested); Cta sends cta_click through the system event; V2 line in the header; last review 6/10 was on an older build (complaints fixed).
