# /philosophy coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Philosophy.jsx` (+ `Philosophy.css`, data `philosophyData.js`) · gallery: `docs/gallery/philosophy/` · metric id: `philosophy.close` (cta_click), lead `philosophy.hero`

Open copy questions for James: none (no copy changed; "Philosophy", "The premise", "The synthesis", "The 64 patterns", "The method", "Across the stack" are Hanzo's labels, set as captions under their headings).
Shared changes requested (`docs/requests/philosophy.md`): none.
Forks this page deleted: the floating AskBar pill (MASTER: nothing floats over content), the 236px headline (now 52px at rest), the v1 "seal" kickers above headings, the spring and overshoot easings, every hover lift and scale.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's page ("Explore the 64 patterns" → #patterns; close "Explore Hanzo" → /)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices on the page
- [x] Open copy questions for James listed, none decided

Done here: Story page, one audience (builders and researchers judging how Hanzo thinks), metric `philosophy.close`. One solid ask per screen; "Build with Hanzo", "Read the research" and "View the source" are text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `More` or a plain hash link; every stack row a real link
- [x] n/a: depth 1, no breadcrumb
- [x] Link parity: 10/10, 0 removed

Done here: `<main id="main">` takes the layout's "Skip to content"; links use the kit `A` and `More`; parity shows 10/10 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the hexagram's first change at 900 ms)
- [x] Hero: the hexagram is the one big thing; h1 52px by line mask; nothing above the h1 ("Philosophy" is a caption under it)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per screen; sizes alternate (one moment per screen: hexagram, premise sentence, law hexagram, belief statement)
- [x] Ends in the dark room's closing link ("Explore Hanzo"), then the footer
- [x] n/a: no cards to other pages beyond the stack rows (they morph through the site layer)

Done here: First screen at 1470×801: centred hexagram (≈420px) walking the sixty-four, 52px headline, caption, lede and ask at its foot; JS off measured 0 of 910 text blocks hidden.

## 4. Conversion system
- [x] Kit ask (`.pf-btn.solid`) only; no raw `.x-btn`
- [x] Sticky ask: the header's ask and the site's own bar read `data-thumb`; no page-level floating bar
- [x] n/a: no copy button
- [x] `data-cta="philosophy.hero"` and `data-thumb` on the primary; `data-cta="philosophy.close"` on the closing ask

Done here: The page's floating AskBar was removed (MASTER §3.2 rule 6); the site ask bar carries "Explore the 64 patterns" from `data-thumb`.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy (64, 8, the King Wen numbers)
- [x] n/a: no marquee
- [x] n/a: no form

Done here: The only figures are Hanzo's own (64 patterns, 8 trigrams, 5 laws, 8 steps); nothing is claimed beyond the copy.

## 6. Content presentation (copy untouched)
- [x] No text under 13px except 12px mono capitals
- [x] Headings 12–18ch, lede ≤ 44ch, body ≤ 66ch; `text-wrap: balance` on headings
- [x] Views are APG tabs with arrow keys; all 64 details in the HTML
- [x] `python3 scripts/parity.py /philosophy`: 437/437 text, 10/10 links

Done here: Sizes from ProofRhythm (h1 52, headings 26, titles 21, lede 20, body 16); detail lives in the pattern sheet (one per page, steps ← →), all 64 entries server-rendered.

## 7. Visual design system
- [x] `taste.py` passes; only deck greys (#0a0a0a, #525252, #737373, #f5f5f5, #e4e4e7, #e5e5e5)
- [x] No label, tag, badge or pill above a headline
- [x] Tiles are flat fills; rows divided by hairlines; only the sheet floats
- [x] n/a: no icons beyond arrows and the hexagram glyphs
- [x] Differs from neighbours: a centred line-art stage with the headline under it

Done here: Ink only; changing lines are marked by a dot, not a colour; the dark close enters as a rounded card and opens to full width (SceneWipe).

## 8. UI component library
- [x] Every control has hover (inside `@media (hover: hover)`), press (scale .97, 90 ms), focus-visible
- [x] Focus ring on every stop (hexagram lines, tiles, cells, steps, rows)
- [x] The pattern sheet traps focus, Esc closes, focus returns to the tile
- [x] n/a: no inputs
- [x] Forks deleted: listed above

Done here: Hovers fill or part the hexagram's strokes (James's "strokes parting", 2–6px); no lift or scale on hover; presses scale .97. The pattern sheet is a native `<dialog>` (`showModal()`): focus trapped, Esc and the backdrop close it, focus returns to the cell that opened it; checked headless: opening it leaves `scrollY` unchanged and the closed sheet draws nothing (0×0) at 1470 and 375.

## 9. Motion and interaction
- [x] Signature `timeline` (MOTION-MAP): the five laws on a strip you drag; supporting: a line-mask cut-in on the h1, premise and stanza only, gliding view pill (300 ms ease-emphasis); 0 fade-ups, no pinned scene, no scroll scrub
- [x] Kinds: idle (hero walk, the laws timeline playing through once, premise line, laws' last line, one lap of the method ring), pointer and touch (drag the strip, strokes part, fills), state (sheet, pill); nothing is scroll-driven
- [x] The hero moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] n/a: sound is a shared kit, not wired on this page

Done here: The pinned laws scene (PinScenes) and the scroll word reveal of the belief statement are gone. The second screen is the signature: a timeline of the five operating laws; dragging the thumb (pointer or finger, `touch-action: pan-y`), tapping a law's number or pressing ← → / Home / End moves it, the law under it takes the panel (outgoing 150 ms, incoming 300 ms ease-emphasis) and the hexagram beside it gains one line per law, the sixth (64 · Before Completion) flipping six times on law 05; on release it settles on the nearest law in 300 ms ease-in-out. It plays 01 → 05 once by itself when first seen until touched; the thumb moves by transform only (CLS 0.001 desktop, 0.0006 phone while scrolling). The belief statement is now set still in ink and grey. Deck timings only, no springs or overshoot; `variety.py` OK.

## 10. Media
- [x] n/a: the page has no Hanzo photo or film; its objects are drawn (hexagrams, ring)
- [x] n/a: no video
- [x] n/a: no image
- [x] n/a: no photo

Done here: Every object is drawn in HTML and CSS (the hexagram is 6 rows of two halves), so nothing loads. The hero's changing name and trigram lines keep fixed two-line, full-width boxes, so the walk moves nothing: measured CLS over 15 s idle 0.005 at 375×812 (was 0.125) and 0.008 at 1470×801.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll (phone.mjs 375/375); the matrix scrolls inside its own frame
- [x] Every target 44px or more; tiles and rows answer taps
- [x] Primary ask above the fold at 375 (moved above the lede)

Done here: Phone hero: a 150px hexagram whose lines sit in 44px tap pads, h1 at 40px, the ask before the lede; the laws timeline sets a 104px hexagram beside its caption, the law below, and the strip at full width with 44px number stops (drag with a finger). Nothing overlaps at 375 (the old closed-sheet overlap is gone; scrollWidth 375). The patterns open on the Matrix view (one 8×8 object) instead of eight rows of tiles; tile titles wrap instead of colliding at 1470.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text #0a0a0a / #525252 / #737373 on white, #525252 on #f5f5f5
- [x] Pause control (LivePause, 44px, `aria-pressed`) first in the hero stage; every other loop ends at rest
- [x] n/a: no forms
- [x] One h1; h2 per section, h3 in groups and the sheet
- [x] Keyboard reaches every line, tile, tab, cell and step

Done here: The hero walk has a pause button; the laws strip is a `role="slider"` (arrow keys, Home, End) with its value read as the law's name; the premise line, the laws' last line and the method ring stop after a few cycles; `aria-live` speaks only after a visitor changes a line.

## 13. Performance and engineering
- [x] h1 and the hexagram in server HTML
- [x] No images or video; CSS-only line art
- [x] No poller; timers stop off screen (`useInView`)
- [x] Filming and checks run in the cloud

Done here: All motion is transform, opacity and clip-path; timers are `setTimeout` chains that stop when unseen or paused.

## 14. SEO and machine files
- [x] Title and description unchanged (`app/philosophy/page.jsx`)
- [x] Canonical untouched (shared)
- [x] `<JsonLd route="/philosophy" />` renders
- [x] Stack rows are real links

Done here: Metadata and JSON-LD come from the route file, unchanged; every word is in the server HTML.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page (the 64 patterns open in a sheet, not pages)
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a: a Story page; its index of 64 opens each pattern in the one sheet.

## 16. Developer experience
- [x] n/a: no code on the page
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a: no code, terminal or config on /philosophy.

## 17. States and resilience
- [x] Static content: no loading or error state; the lens view has Hanzo's empty-state line
- [x] No live data
- [x] n/a: no form
- [x] JS off: a `<noscript>` rule lays out all views and all 64 patterns; reduced motion shows final states

Done here: JS off measured 0 hidden blocks at 1470; the sheet wraps 64 → 01; nothing on the page fetches.

## 18. Measurement and handover
- [x] `data-cta` on both primaries (`philosophy.hero`, `philosophy.close`); n/a: `lib/track.js` wiring is shared
- [x] Nothing identifier-bearing
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/philosophy.md` (7/10 on the walk before this build). In this build: the blank bands around the laws heading, the premise tail and above "Every hexagram is active" are cut; Sequence tiles run six a row at desktop widths so no name breaks mid-word; the questions section holds the question's trigram drawn large (walks the eight once, then follows the pointer), sticky beside the list; the closing statement is hydration-safe under reduced motion (0 console errors measured); text links are 44px tall. Not changed: the hero keeps its centred hexagram over the headline (the h1 sits low by design so the hexagram is the first screen's one big thing).

Done here: Filmed with `scripts/motion.mjs` (desktop) and `scripts/shot.mjs` (phone); gallery `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
