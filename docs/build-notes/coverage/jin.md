# /jin coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Jin.jsx` (+ `Jin.css`) · gallery: `docs/gallery/jin/` · metric id: `docs_click` (researchers: a GitHub or docs click)

Open copy questions for James: none (Hanzo's "Read the docs" stays the ask; the live page's two buttons both remain, "View on GitHub" as a text link).
Shared changes requested (`docs/build-notes/requests/<page>.md`): `docs/build-notes/requests/jin.md` (Cta hover off-ramp, phone header second solid, header glass smudges, FooterHTML hydration).
Forks this page deleted: the raw `.x-btn` asks and `BizAsk` (now kit `Cta`), the v2 `AskBar`, the raw `<img>` and `<table>` (now kit `Img` and `DataTable`), Frame's fading `Paste` (now `BizPaste`), every `data-cursor` label, every spring (`useSpring`, `dragSnapToOrigin` bounce, `SPRING.*`) and hover lift.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header carries Persona, Metric `docs_click`, Goal, CTA, Signature, Beyond and V2. The page's one solid is "Read the docs" → docs.hanzo.ai (hero and close; `lib/cta.js` does not exist yet, so the live label and href are used); "View on GitHub" is a text link. No prices on this page.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /jin is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>`; the shell's skip link targets `#main`. Links go through `A`, `More` and `Cta`; parity links 3/3.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph~~ n/a: no cards lead to pages here

Done here: Round 2: the first screen is a title page: the h1 "Research on learning without labels" (52px, CSS line cut-in), byline and ask over the Abstract set as a side note, then Figure 1 full width (a | b | losses and caption), which starts its saccade within a second. Server HTML has 0 `opacity:0` runs in the hero. Rhythm: chapter 2 ("Ours") is the loud one in a quiet `#f5f5f5` room (numeral 112, heading 44, figure across 8 columns); 1 and 3 rest at 26px; 4-6 drop to 21px headings, 44px numerals, smaller figures and tighter padding; then the dark plate, then the close: one proof line (`hanzoai/jin`, `License: Apache-2.0`), the sentence and ask, rows, footer. Round 3 (verified 7 Nov round 4): chapters 1-6 are one pinned stage on desktop (texts left, the plate right draws each figure out and the next in, a point scrubbed along the round trip), chapter 3 breaks out at full width with numeral 112, chapter 5 at 84, so nothing dwindles; stacked under 900px with figures alternating and a one-line legend strip.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `<Cta to={DOCS} id="jin.hero" thumb>` and `<Cta … id="jin.close" size="lg" thumb>`, both "Read the docs"; the site bar (named by `data-ask-name="Jin"`) carries the same words after the hero. The agent prompt's Copy (kit `Copy` via `BizPaste`) copies exactly the shown prompt and only says Copied on success.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: Every sentence is Hanzo's; the drawn figures are lettered diagrams of what the copy names (encoders, round trip, Huber/cycle/VICReg, masked patches, UMAP, edge hardware) with legends in Hanzo's words. No numbers are claimed.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /<path>`: 0 missing

Done here: 0 text under 14px at 375 except 12px mono capitals; parity text 37/37, links 3/3. Table 1 is the kit `DataTable` inside a `BizSheet`; abstract at 46ch, section text at 3–4 columns.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK; greys snapped to the deck ramp and `--bz-*` tokens; radii 6/8/12/24/full; no drop shadows (frames outlined, the image flat); sizes: h1 52, section headings 26, numerals 64 (44 on phones), body 16–17. Byline, "Abstract" and "Figure N" labels sit beside or under headings. Hero medium is a research figure set full width under the title (round 2), so it no longer shares /ledger's "copy left, panel with pause right, abstract under a rule" layout. Chapter 3's losses are one weighted axis (Huber large, cycle and VICReg smaller), not three equal glyphs.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Pause (fill on hover, press .98, ring), the draggable image (outline on hover, focus ring, arrow keys), close rows (fill) and the sheet button answer; every `:hover` sits in `@media (hover: hover)`. The sheet is the kit `BizSheet` (focus in, Esc, back). Deleted: see the top of this card. Round 4: Figure 8's loss legend no longer picks up Hanzo's base `.l0/.l1/.l2` grey fill (it read as three light slabs on the black); verified in a browser that every visible control in the close answers a hover (close rows fill and slide their arrow, See Table 1, Read the docs).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the page plays no sound of its own

Done here: Signature: Figure 1's saccade (idle); supporting: line cut-ins (arrival), the drag (pointer), the sheet (state), and Figures 2-7 drawing in once at 60% visible (arrival: strokes by `pathLength` 1.1s ease-in-out 50 ms apart, marks and mask cells after, a point travelling the round trip in Figures 3 and 4, UMAP clusters separating in Figure 6); variety OK (drag + svg line draw), 0 Rise. Tweens only. Figures already on screen at load, JS off and reduced motion all show the finished drawing (0 armed figures, 0 running animations under reduced motion after 3.2s). Round 4: a drawn figure left alone walks itself through its lettered parts (a, b, c, d, 1.6 s each, lighter than a hover: the rest at 38%), then rests whole, so the pinned plate and the stacked figures never sit dead; Figure 8 makes one saccade by itself when 60% in view (a short shift and back) so its loss trace shows what a drag does, unless a hand gets there first. Both stop under reduced motion.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- ~~At most 2 videos playing~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- ~~4+ real visuals together~~ n/a: the page has one Hanzo image (zen), used twice

Done here: Hanzo's `zen.webp` goes through the kit `Img` with width 1200 and height 1500 (`priority` in Figure 1) and `alt=""` (decorative inside labelled figures); the six figures are inline SVG.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Filmed at both sizes: width 375/375 and 1470/1470, 0 targets under 44px; the ask sits at ~320px on a phone with Figure 1 under it inside the first 660px; sections stack numeral, text, figure; the image drags by touch. Round 4: check.mjs at 375 and 1470: errors 0, wide 0; its "covered" hits are body text scrolling under the sticky running head (by design, it is the chapter bar). The phone header carries "Read the docs" after the hero (shared Ask, verified).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text uses ink, `#525252` and `#737373` on white (`#a3a3a3`+ on black). Figure 1 has a 44px Pause (`aria-pressed`). One h1, h2 per section; the draggable image is a focusable `role="img"` with an aria-label and arrow-key shifts; the drag state is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and Figure 1 are in server HTML; the image has intrinsic size; the drag throttles its state to 25 fps. Round 2: CLS 0.207 -> 0.001 desktop, 0 phone (the step chip has its own nowrap line, the Abstract no longer sits in a row the figure spans, Figure 8's status chip reserves two lines); 0 shifts from the page over 10 s idle. Filmed in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/jin/page.jsx` unchanged (metadata from `content/pages.json`, `<JsonLd route="/jin" />`); the close rows are real links.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: /jin is a research story page with no catalogue, model card or price.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- ~~Config blocks parse on their own~~ n/a: no config block
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal
- [x] No hand-typed version number

Done here: The only code-like text is the agent prompt in `BizPaste` (copy equals display); no version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: nothing is submitted
- [x] A thrown island does not blank the page

Done here: No live data; the page is whole in server HTML. Figure 1: playing, paused, reduced; the drag: rest, shifting, shifting back, landed, each named in the status line. 0 console errors in the film; a drag crash found earlier (the trail updater) is fixed and re-tested.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/build-notes/review/<page>.md` verdict 8 or more

Done here: `data-cta="jin.hero"` and `"jin.close"`; `Cta` dispatches `cta_click` with the id only. `docs/build-notes/review/jin.md` read (6/10); fixes 1-8 done in round 2, fix 9 (shared chrome) in `docs/build-notes/requests/jin.md`; V2 line updated; awaiting a fresh critic. Round 4: review round 2 (7/10) fixes 1-3 and 5-10 verified in the round-3 build; fix 4 (phone header ask) is shared and filed in `docs/build-notes/requests/jin.md`. Proof `docs/gallery/jin/round4-*.jpg`.
