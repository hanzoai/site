# /investors coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Investors.jsx` (+ `Investors.css`) · gallery: `docs/gallery/investors/` · metric id: `cta_click investors.hero` (one contact click)

Open copy questions for James: "Backed by" logos (MASTER part 1 list; shown as on live, permission not documented here); the aria strings Pause, Replay and Read the source wait for `content/ui-strings.json` approval.
Shared changes requested (`docs/requests/investors.md`): none (the PinScenes cross-fade ghost was avoided with a page-local pinned scene; the global no-JS rule in `app/layout.jsx` reveals hidden figures, so this page hides its counter's inactive figures in its own `<noscript>`).
Forks this page deleted: the forked `UiBtn`/`Btn` buttons (now the kit's `Cta`); the hand-drawn Pareto scatter; native checkboxes; the infinite logo marquee; the counter's endless loop.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live ones)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: "Contact investor relations" (mailto:ir@hanzo.ai) is the only solid in the hero, carried by the site's ask bar after it. The close's one solid is ir@hanzo.ai, the same address. "See the research" and "Book a call" are quiet `Cta`s.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: /investors is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: The layout's skip link reaches its `#main` mark. Every link goes through the kit's `A` or `Cta`. Parity is 43/43 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] ~~`PageHero`~~ not merged in the kit yet; the hero is page-local and nothing sits above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, closing room, footer
- [x] ~~Card-to-page links use Morph~~ n/a: no card opens into a page here (Morph is broken site-wide per the conductor)

Done here: The h1 (`MaskLines now`) and then the lede, asks and counter arrive once the curtain lifts (`useArrived`). The counter starts rolling within a second.
- With JS off, the h1, lede, both asks and one counter figure show (screenshot), and every pinned scene stacks.
- The narrative: hero, thesis (pinned), stack (layering slabs), results (pinned black room), commit record, wall, people, Read the source, close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] ~~Copy button copies exactly the displayed text~~ n/a: no copy control on this page
- [x] `data-cta` and `data-thumb` on every primary

Done here: The kit's `Cta` is used with `id="investors.hero"` and `thumb`, `investors.research`, `investors.close` and `investors.call`. The ask bar reads `data-thumb="Contact investor relations"` and steps aside while the close's ir@hanzo.ai solid is on screen.

## 5. Trust and proof
- [x] No logo without documented permission (Backed by listed for James); no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (the marquee is gone: a still wall)
- [x] ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here:
- Every figure is Hanzo's: 16 of 16, 93.7%, 95.6%, 0.8 ms, 3.02×, ~3,665, 732,288 and 51%. "Up to" stays beside 200× and 400×, and "~" beside 3,665.
- The bars sit on a zero baseline: LiveCodeBench at v/100 with Enso in white and the rest in grey, and Kai's 0.3, 0.4 and 0.8 ms on a 0.8 ms scale. 400× is twice the length of 200× against the same 1× dot.
- The page's own `--w` was dropped (`@property --w` in `public/hanzo.css` was eating it); bars now use `scaleX` values set directly.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: none on this page
- [x] `python3 scripts/parity.py /investors`: 0 missing

Done here: Parity is 131/131 text and 43/43 links. Hanzo's 03, 02 and 01 stay as the stack's giant numerals. Lede and body sizes come from `company/deck.css`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the deck ramp
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24/16/12/6, shadows and sizes from the deck; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- `taste.py` passes (2 checked). Colours are only the deck's: #0a0a0a, #525252, #737373, #a3a3a3, #d4d4d4, #f2f2f2, #f5f5f5, #000, plus white alpha steps.
- Tiles are flat fills with no shadow. There is one black room (results).
- The hero's rolling figure card differs from /press (a deck) and /team (a canvas).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs are native~~ n/a: no dialog
- [x] ~~Inputs 16px or larger~~ n/a: no input; no bare `:hover` (all inside `@media (hover:hover)`)
- [x] Forks this page deleted: listed above

Done here:
- Pause/Replay, the counter steps, the source arrows and the list ticks are real buttons with `aria-pressed`. Press is .97 at 90 ms.
- The focus ring is 2px ink with a white halo (white with a black halo in the results room).
- The tick circle previews half its check on hover.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ the shared sound kit is not in yet

Done here:
- Idle: the counter rolls once through 7 figures and rests, with Pause and Replay; the Sigil fields drift.
- State: the steps, the ticks filling the giant counter, and the figures rolling in per scene.
- Pointer: the source arrows and the logo tiles.
- Scroll (2 of 5 kinds): the pinned thesis and results, and the layering slabs.
- Arrival: the line masks. `variety.py` passes, there are no springs (ease-emphasis), and reduced motion stacks the scenes in their final state.

## 10. Media
- [x] `Pic`/`Img` only (kit `Img` for logos and portraits); sizes set
- [x] ~~At most 2 videos~~ n/a: no video
- [x] Nothing missing that this page can fix; alt on every image
- [x] No dimmed or filtered photo (logos greyscale until hover)

Done here: Logos and portraits use the kit's `Img` with width and height. A failed logo shows its name, and a failed portrait shows the person's own Sigil, not a blank disc. Mirroring /logos and /authors into `public/` belongs to the media owner.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- At 375 the ask ends at y≈428 and the pinned scenes stack, each with its object.
- The wall is 3 across, with fallback names at 15px that wrap.
- The heatmap scrolls inside a fading edge.
- Counter steps, Read the source, Legal and Press are all 44px.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#525252 and #737373 on white, white 78% and 55% on black)
- [x] Pause control on every moving item
- [x] ~~Forms labelled~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The counter announces its label politely, and its steps read figure, name and subject. Focus inside a pinned scene scrolls the page to that scene, and the inactive scenes do not take pointer events.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Only transform, opacity and SVG; every image sized
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: The counter runs only while seen and stops after one round. The Sigils pause off screen. The only timer is one `setTimeout` per counter step.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical belongs to the shared layout owner
- [x] `<JsonLd route="/investors">` unchanged
- [x] Every card is a real link

Done here: `app/investors/page.jsx` keeps Hanzo's title and description and the JsonLd.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a. /investors is a Story page (MASTER 4.4).

## 16. Developer experience
- [x] n/a: no code on the page

Done here: n/a. The commit record links each commit and is not code to copy.

## 17. States and resilience
- [x] Figures are a static snapshot ("Forge listing · read Nov 6, 06:04" shown); no loading state needed
- [x] Blocked media leaves a complete page, no console errors
- [x] ~~A failed submit~~ n/a: no form
- [x] A thrown island does not blank the page (Sigil sits inside the layout's boundary)

Done here: With hanzo.ai blocked (this cloud box), the logos show their names and the portraits their Sigils. The ticked list survives a blocked localStorage.

## 18. Measurement and handover
- [x] `data-cta` on every primary (through `Cta`, which fires `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/investors.md` was 6/10; every listed fix is done, awaiting re-review

Done here: All six fixes from the review are done in its order (bars, second half, hero and JS off, close, phone, hovers and portraits). Gallery: `docs/gallery/investors/`.
