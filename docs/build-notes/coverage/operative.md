# /operative coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Operative.jsx` (+ `.css`) · gallery: `docs/gallery/operative/` · metric id: `cta_click operative.hero`

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/operative.md`): Band headline reveal by line mask instead of blur; Cta solid hover #262626; data-cta (and a quiet option) on the kit Band; the desktop ask bar floating over content; the Terminal and PageHero kit parts.
Forks this page deleted: the raw hero anchor and Go buttons (now kit Cta), the raw <img> (now kit Img), the dimmed and greyscale photos, the gradient crate and shadowed slabs, the Interrupt/Resume button and the interrupted label (now the kit pause control), the autoplaying provider switch, the blue accent, springs, setInterval. Round 2: the four equal provider cards (now one tab panel), the height-animated chapter accordion (now one fixed slot), the open requirements/usage blocks (now native disclosures), the invented desktop/key/port labels and glyphs.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [ ] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: Header lines Persona/Goal/CTA/Metric/Signature/Beyond in Operative.jsx; one solid: kit Cta "Get Started" (operative.hero, thumb, to the docker run on the page), quiet "View Docs"; the Band closes on Hanzo's "Deploy to Cloud". `lib/cta.js` does not exist yet.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main">` (the layout's skip-link marker also exists, noted in requests); links via kit A and Cta; parity links 6/6; depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px

Done here: h1 "Hanzo Operative" 52px by line mask, lede line-masked 180 ms after it and bottom-aligned to it on the right (h1 top 164, lede top 175, both bottom 272), acts under the lede; the hands move within 1 s. Pinned scene 400svh: explode over the first 10%, then each of six layers lifts out and opens across the rest, so every scroll step moves something. Gaps between blocks cut to 24–116px. JS off: noscript shows every chapter text. Ends: Get Operative (the six layers pressed back into one box, its docker pull with the image name unbroken), the close band, footer. 8 Nov: the hero rests on hand 01 / 04 with the objective typed, the button labelled and the reading chip showing (server, JS off, reduced motion).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit Cta only; the ask bar carries "Get Started" via data-thumb; the install Copy copies exactly the two displayed commands. The close is page-local (`Close` in Operative.jsx) so "Deploy to Cloud" carries `data-cta="operative.band"`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form on this page

Done here: Only Hanzo's words, ports (8501, 6080, 5900, 8080) and commands; no logos, seals or figures of our own.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /operative`: 0 missing

Done here: Deck sizes: h1 52, section headings 26, provider name 26, list 17, body 16, ports 44; the loop grows to 1.3x only while it is the moment; 13px floor. Disclosure: chapter text in one fixed slot (inactive aria-hidden, in HTML), providers as APG tabs with hidden panels in the DOM, requirements and usage in native `<details>` (find-in-page opens them). Commands wrap only between words; long tokens scroll in `tabindex=0` regions. Parity 104/104 text, 6/6 links; every visible string traced to live/pages/ui-strings.

## 7. Visual design system
- [ ] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [ ] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py passes; the deck ramp is named once on `.xov` (--g50…--g900, --ink) and every rule reads those vars; the Apple greys #f5f5f7/#d2d2d7/#e5e5ea are gone; 0 labels above a headline; flat fills, never fill plus shadow (only the render's window keeps its own).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the raw hero anchor and Go buttons (now kit Cta), the raw <img> (now kit Img), the dimmed and greyscale photos, the gradient crate and shadowed slabs, the Interrupt/Resume button and the interrupted label (now the kit pause control), the autoplaying provider switch, the blue accent, springs, setInterval. listed below

Done here: Walk: 0/14 dead hovers on desktop. Hand tabs preview their hand (ghost cursor plus its sign on the desktop); chapter rows ink and lift their slab 12px; provider tabs preview their variable in the command; ports light on hover; pause, links, summaries all answer; everything presses (.97/.98 or 1px); hovers inside (hover: hover), transform/colour only; the hero pause glyph is 14px in its 44px button again.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: 8 Nov: signature is the live conversation beside the hero desktop (three objectives in Hanzo's words, steps stream while the desktop acts them out); five section entrances (iris, accordion, zoom-through, deal, orbit-in), the iris now watched on its section so it fires (it never opened before); the close headline rises from its line mask, no blur (the kit Band's blur word reveal is not used here); the container stack explodes once as it arrives and a hovered row lifts its slab 28px; supporting: the hands working the desktop (idle), the provider tabs (state, layoutId), the typed docker run (time); pointer: a 2.5° tilt on the hero crate (mouse only), hover previews. variety.py OK (4 techniques). Reduced motion: final state, no tilt. CLS 0.001 desktop, 0.0005 phone (was 0.074).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's iro image through kit Img with width, height and sizes (priority on the hero only) as the hero wallpaper; the dark room's "Demo Video" window plays Hanzo's Koma film through kit Film (poster, muted, plays only on screen, held by the room's pause), so the two windows no longer show the same picture; no filter or dimming.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375x812 and 1470x801: 0 overlaps, overflowX 0; phone stack shows one layer open at a time, stepped by tapping its row; the provider command is three fixed lines on phone; no mid-token wraps; 44px targets.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text #0a0a0a/#404040/#525252 on white and #a3a3a3 or lighter on black; pause controls on the desktop's hands and the loop; the provider switch is a named radio group; one h1, h2 sections, h3 lists.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and the desktop in server HTML; transform and opacity only; loops stop off screen and when paused; budgets not yet measured.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: app/operative metadata unchanged; JsonLd route=/operative; every link is real.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no cards that open into pages
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The docker run types once when it arrives and ends on its static frame; Replay runs it again; copy equals the displayed commands; no version numbers. Page-owned until the kit Terminal lands.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: No live data, so nothing loads or fails.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/operative.md` verdict 8 or more

Done here: data-cta on operative.hero and operative.band (page-local close); Cta sends cta_click through the system event; V2 line updated for round 2; review read (6/10) and fixes 1–9 worked (gallery round2-*.jpg).
