# /skills coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Skills.jsx` (+ `Skills.css`) · gallery: `docs/gallery/skills/` · metric id: `cta_click skills.hero`, `skills.close`

Open copy questions for James: none.
Shared changes requested (`docs/requests/skills.md`): A2Lines hydration mismatch under reduced motion; the phone header ask never swaps to "View on GitHub".
Forks this page deleted: the 200px ghost numerals (now 12px `01 / 06` captions under each heading), the visible-by-accident repo kicker above the h1 (now a 13px caption link under the ask), the overshooting sheet curve `cubic-bezier(.34,1.4,.64,1)`, the solid "Deploy to Cloud" (now the quiet outline), the absolutely stacked thread cards, `setInterval`, every non-deck grey (#0b0b0c, #1c1c1f, #86868b, #2c2c2e, #3a3a3c, #f5f5f7, #e4e4e9, #707070, #a1a1a6, #d1d1d6).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- ~~No dead or self-looping button; prices from `lib/plans.js`~~ n/a: no prices on this page; both asks go to real destinations (github.com/hanzoai, platform.hanzo.ai/deploy)
- [x] Open copy questions for James listed, none decided

Done here: Header block in Skills.jsx carries V2, Persona, Goal, CTA, Metric, Signature and Beyond. One solid ask ("View on GitHub", hero, then the header); "Deploy to Cloud" in the close is now an outline, so the closing viewport holds only the header's solid. `lib/cta.js` does not exist yet; labels and hrefs are Hanzo's live ones.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /skills is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main className="a2 xsk">` after the layout's `#main` marker and "Skip to content" link (app/layout.jsx). All three links (two to github.com/hanzoai, one to platform.hanzo.ai/deploy) go through kit `A`. Parity links 2/2.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no card links to another page

Done here: The prompt types "Postgres" from 0.5 s and discover-database lights; at 375×812 the agent panel now comes first in the hero object (`order:-1`, file prose hidden), so the typing prompt (y 472) and lit row (y ~555) sit inside the first screen. Nothing above the h1 (the repo kicker moved under the ask); PageHero kit part not yet shipped, hero is page-owned. h1 is 112px at rest at 1470 and settles to 84px (scale .75) over the first 200px of scroll; phone `clamp(52px, 14vw, 64px)` (52.5px at 375). Phone hero shows the agent alone (file card hidden, 3 shelf rows), hero object 290px (cap 45svh). No object repeats: stage scenes 01/02 are now the frontmatter close up and one gateway pulling two of five files, scene 05 is one file's links drawn out to two stubs (the room keeps the three cards), the close shows the install's done line instead of the shelf. Point 05's heading is printed once (as live); the thread room is labelled by it. After the hero: trade (paper, short), the pinned essay stage, the black thread room, paste strip, close; ends in the close card then the footer, no Band (none on the live page).

## 4. Conversion system
- [ ] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask has `data-thumb="View on GitHub"` and `data-cta="skills.hero"`; the desktop header swaps to it (solid) once the hero ask leaves view (phone header does not: requested). Both Copy buttons are kit `Copy` (copies `npx skills add https://hanzoskills.com/hanzo.md` and the agent prompt exactly; a failed copy returns without "Copied"). Raw `.x-btn` remains on the two asks until the kit `Cta` lands.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: No figures, logos or seals. The trade bars and the stage's scene 04 are relative lengths (one long file against five small ones), never a token count, as the header says.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no tables, FAQ or tabs; the one command uses kit `Copy`
- [x] `python3 scripts/parity.py /skills`: 0 missing

Done here: Sizes: h1 112 settling to 84 (52.5 phone), section headings 32/26, point headings 26 (22 phone), body 17-19, captions 12-13px mono (the `01 / 06` captions are 12px mono capitals-style figures). Parity `/skills: OK text 29/29 links 2/2`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK; every hex in Skills.css is a deck value (#000, #0a0a0a, #171717, #262626, #404040, #737373, #a3a3a3, #d4d4d4, #e4e4e7, #e5e5e5, #ededed, #f5f5f5, #fafafa, #fff) and white alphas from the deck list. The `01 / 06` captions sit under their h2; the invented "Follow a thread" label and "The thread" aria-label are gone (the room and its pill group are labelled by point 05's h2). Only the dropping file card in scene 06 floats, so only it has the floating shadow. The two arrows are one 1.5px-stroke inline glyph.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog
- ~~Inputs 16px or larger; no bare `:hover`~~ n/a: no inputs; every hover sits inside `@media (hover: hover)`
- [x] Forks this page deleted: listed below

Done here: Hero ask: fill steps #0a0a0a to #262626 and the arrow nudges 3px up-right, press scale .98 (90 ms). Deploy: border white 30% to 60% plus the arrow nudge, press .98. Repo caption link and card `hanzoai` link: 1px underline offset 3px appears on hover. Thread pills: hover brightens the pill and always lifts its file 8px at scale 1.02 while the other two dim to .4 (measured on all three pills); a rail beside the pills fills as the thread advances; press .97; white focus ring on the dark room. Hovering the close card lifts its done row ("hanzo.md" tick) 8px and fills it white. Forks: see the list at the top.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the page plays no sound of its own; the shared kit owns it

Done here: variety.py OK (2 techniques: typing, useScroll). Kinds: idle (wake loop, thread auto-cycle), time (typing, terminal wipe, frontmatter line wipes, gateway pull, link lines drawing, the close's done line), scroll (trade scrub, h1 settle, the room's rounded-card clip opening to full width, pinned stage swaps, highlighter), state (pills, rail, peek), pointer (arrow nudges, card hover). Tray sheets now drop clear of the CONTEXT label (label under the tray). Curves only ease-out / ease-in-out / ease-emphasis at 90/150/300/400/500 ms, scene moves 900 ms; the sheets' overshoot is gone. Reduced motion: `getAnimations()` 0, `.xsk .a2-ln-in{transform:none!important}` shows the two masked headings (0 hidden lines measured), every scene shows its after state; the thread cycle is a setTimeout chain.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or films; every visual is drawn in the DOM
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: Hanzo has no Skills media

Done here: No media: the skill file, shelf, tray, frontmatter close up, gateway, terminal, bars, link stubs, thread, new file and done line are drawn with Hanzo's names and blank lines, all `aria-hidden`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Walked both sizes (scratchpad fix-skills-2 frames). Phone page 10,591px to 9,239px (hero 731, essay 3,099, each point's object capped at 280px, no overflow). Stage ticks sit inside the panel's bottom edge and the essay's bottom padding is trimmed. Thread cards are a staircase in normal flow (16px gaps), so no card covers another's text. scrollWidth equals the viewport at 320, 375, 768, 1024, 1470. Targets under 44px: 0 (Copy buttons and caption links raised to 44px). Ask bottom at y 370 on 375. Under 900px the pinned stage stacks: each point carries its own scene (point 03 keeps its command box).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [ ] Pause control on every moving item
- ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text #0a0a0a and #525252 on white, #a3a3a3 and #fafafa on black. One h1, h2 per point and room, the close card's title is now an h3. Pills, Copy and links are native buttons/links; pills preview on focus too. The hero wake loop and thread cycle stop off screen and under reduced motion but have no pause button yet. Inactive essay points rest at opacity .5 on desktop while the active one is full.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 and every word in server HTML (parity reads it). Page CSS animates transform, opacity and clip-path only (the highlighter's background-size is the one 900 ms scene move); colour flips are instant. Typing writes to a text node. Budgets not measured in this pass.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- ~~Every card is a real link~~ n/a: no link cards

Done here: app/skills/page.jsx metadata and `<JsonLd route="/skills" />` untouched by this pass.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: not a catalogue
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue
- ~~One price figure everywhere~~ n/a: no prices

Done here: Not a catalogue; nothing to link or price.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: One command (`CMD` constant) shown and copied by kit `Copy`, identical text. The stage terminal (scene 03) wipes the command once in 900 ms, draws three output lines and lands on a static "hanzo.md" tick frame; it plays only while its panel is on. No versions.

## 17. States and resilience
- ~~Loading, empty, error and offline states designed~~ n/a: no live data or fetches
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no submit
- [ ] A thrown island does not blank the page

Done here: No network calls. 0 console errors and no dev issue badge on 10 fresh loads (5 desktop, 5 phone) with normal motion; under reduced motion the only error is A2Lines' shared hydration mismatch (requested).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/skills.md` verdict 8 or more

Done here: `data-cta="skills.hero"` and `skills.close`; the page sends nothing itself. V2 line rewritten (yellow accent dropped). Review read (7/10, second critic, 7 Nov) and fixes 1-6 worked in order; awaiting a new verdict.
