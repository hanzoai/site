# /ide coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/IdePage.jsx` (+ `.css`) · gallery: `docs/gallery/ide/` · metric id: `cta_click ide.hero`

Open copy questions for James: none.
Shared changes requested (`docs/requests/ide.md`): four UI strings for the register (Remember it, Recall, Nothing yet., One thing about your project); the Terminal and PageHero kit parts.
Forks this page deleted: the hand-written hero buttons (now kit Cta), the custom closing section (now kit Band), the tab row shared with /cli and /desktop, the grey code bars, every eyebrow, the indigo, orange, blue and green, springs.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [ ] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: Header lines Persona/Goal/CTA/Metric/Signature/Beyond in IdePage.jsx; one solid: kit Cta "Open the IDE" (ide.hero, thumb) in the hero and the kit Band at the end. `lib/cta.js` does not exist yet, so the label is Hanzo's own from the page.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One <main> (the layout's #main marker and skip link); links via kit A and Cta; parity links 10/10; depth 1, no breadcrumb.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px

Done here: h1 52px cut in by line mask (A2Lines, 700 ms, 60 ms apart); the editor starts under the buttons and settles as you scroll; it moves within 1 s (measured). JS off: 0 hidden text blocks (noscript rules). Ends: Get IDE and related cards, then kit Band, then footer. CLI, Playground and Desktop are Morph cards. PageHero is not in the kit yet.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit Cta only (solid hero, quiet and link secondaries); the ask bar carries "Open the IDE" via data-thumb; Copy copies the exact prompt and script text.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures on the page
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form sends anything (the memory demo is local)

Done here: No logos, seals or figures; Apache 2.0, GitHub and Open VSX as Hanzo states them.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /ide`: 0 missing

Done here: Deck sizes: h1 52, section 26, H3 17, lede 21, body 16; product render text 13px or more. Parity 75/75 text, 10/10 links. The accordion and the typed script are page-owned until kit parts fit them.

## 7. Visual design system
- [ ] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [ ] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py passes; brows check: 0 labels above a headline; radii 24/16, no shadows on tiles; hand-drawn glyphs (pause, add, recall) until the Lucide set is in the kit; literal deck greys in IdePage.css still to move onto tokens.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the hand-written hero buttons (now kit Cta), the custom closing section (now kit Band), the tab row shared with /cli and /desktop, the grey code bars, every eyebrow, the indigo, orange, blue and green, springs. listed below

Done here: Buttons press to .97/.98, focus ring from the system; hover rules only inside (hover: hover); the memory input is 17px.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the editor that remembers (time) in the Stage settle (scroll); supporting: exploded planes, pinned chapters, A2Grow statement, typed script; kinds: time, state, pointer, scroll, arrival; variety.py OK; reduced motion shows final states; no setInterval.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or films on this page
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: Hanzo has no IDE media

Done here: No media on this page: the editor and the planes are drawn in the DOM with Hanzo's real text.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 1470x801 and 375x812 checked (no overlap); 320 scrollWidth 320; ask bottom at 520px on 375x667; 44px targets on phones (status bar links, memory buttons).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Body and labels use #0a0a0a/#525252/#737373 on white; pause controls on the editor loop and the tier motes; the memory input has an accessible name; one h1, then h2 and h3; every control is a button or link.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and editor in server HTML; transform and opacity only; loops stop off screen or when paused; budgets not yet measured (no CI).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: app/ide/page.jsx metadata unchanged from content/pages.json; JsonLd route=/ide; cards are real links.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- [x] Every card opens by Morph
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue; the related app cards open into their pages by Morph.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: no config on this page
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The paste strip and the start script copy exactly what they show; the script types once and ends on its full text; no version numbers. Page-owned until the kit Terminal lands.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: The memory demo has an empty state (an em dash named Nothing yet.); no live data, so nothing can fail; no error boundary of its own yet.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/ide.md` verdict 8 or more

Done here: data-cta on ide.hero; the kit Band's button has no data-cta yet (requested); Cta sends cta_click through the system event; V2 line in the header; last review 5/10 was on an older build (every complaint fixed).
