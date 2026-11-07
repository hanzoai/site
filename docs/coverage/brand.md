# /brand coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Brand.jsx` (+ `Brand.css`) · gallery: `docs/gallery/brand/` · metric id: `cta_click brand.hero` (one contact click: the assets ZIP)

Open copy questions for James: the aria strings Pause, Replay, Copy, Font weight, Background and the three WCAG verdict names (`WCAG AA 4.5:1`, `WCAG AA 3:1`, `below WCAG AA`) wait for approval in `content/ui-strings.json`; Hanzo's "Success Badge" sample is shown in greys with a tick, because the deck allows no green.
Shared changes requested (`docs/requests/brand.md`): mirror `/press/hanzo-press-kit.zip` into `public/` (the dev server proxies it from hanzo.ai; a static export would 404).
Forks this page deleted: the forked `Btn` hero and contact buttons (now the kit's `Cta`); the kit `Copy` replaced by a copy control that never ticks on a failed write; the card hero /press shared.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label from Hanzo's copy ("Download Assets"; `lib/cta.js` does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: "Download Assets" is the hero's only solid (`Cta id="brand.hero" thumb`). The ZIP link in the assets panel carries the same `data-thumb`, so the ask bar steps aside there. "Press Kit" and "Contact Us" are quiet `Cta`s.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: The layout's skip link reaches `#main`. The links are `Cta`s plus the ZIP download link and the mailto. Parity is 4/4 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] ~~`PageHero`~~ not merged in the kit yet; the hero is page-local and nothing sits above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof, assets close, footer
- [x] ~~Morph~~ n/a: no card opens into a page

Done here:
- After the curtain (`useArrived`), the h1 cuts in by line. The construction guides draw full-bleed across the right of the stage (not a card, so it differs from /press), the five pieces land, and the mark opens once.
- The pieces then lean toward the pointer anywhere in the hero, and the compass turns with a Pause control.
- With JS off the lede, asks and whole drawing show (page `<noscript>`).
- The narrative: hero, then pinned principles (giant numerals), the black colour room (the strip fans open), the specimen, the bench, the assets.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (bench samples are content)
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: The swatches and the brand@hanzo.ai copy write exactly the hex or the address. They tick only when `navigator.clipboard.writeText` resolves; on a blocked clipboard the icon stays as it was. `data-cta` covers brand.hero, brand.press, brand.assets and brand.contact.

## 5. Trust and proof
- [x] No logo without permission (only Hanzo's own mark); no seal; no invented number
- [x] Every figure traces to Hanzo's copy (the contrast ratios, weight readout and px sizes were removed as new figures)
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link beside every submit~~ n/a: no form

Done here: The page shows only Hanzo's hex values and its own components. The WCAG verdicts are worked out from those hex values and shown as shapes, not as new figures.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs and code~~ n/a: none (the background switch is a two-button segmented control)
- [x] `python3 scripts/parity.py /brand`: 0 missing

Done here: Parity is 76/76 text and 4/4 links. "Design System" and "Design Principles" are section names, "01 / 03" is each principle's giant numeral, and Hanzo's group words are h3 titles.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside the token block
- [x] No label, tag, badge or pill above a headline
- [x] Radii 24 / 16 / 12, deck shadow only on the floating slider thumb; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- `taste.py` passes (2 checked). The `Brand.css` tokens are the deck ramp (#0a0a0a, #525252, #737373, #a3a3a3, #d4d4d4, #f5f5f5, #ededed, #171717, #262626, #fafafa, #000) and `company/deck.css` sets the type: headings at weight 497, h1 clamp(52px, 7vw, 84px).
- Two dark surfaces, not back to back: the colour room and the assets card.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a: none
- [x] ~~Inputs~~ n/a: the one slider is fully styled (no browser default); no bare `:hover`
- [x] Forks this page deleted: listed above

Done here:
- Press is scale .97 at 90 ms on the swatches, the bench and the copy. Hovers sit inside `@media (hover:hover)`: the gray swatch widens (flex-grow), the big swatches lift their name, the inactive segment lightens, Link Button's underline drops and brand@hanzo.ai thickens.
- The focus ring is ink with a white halo (white with a black halo in the colour room).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ the shared sound kit is not in yet

Done here:
- Signature: the specimen's weight sweeps once (200 → 900 → 560, 4.6 s) when it is 60% in view, then the slider takes over.
- Supporting: line masks, the hero drawing (draw, lean, compass with Pause) and the pinned principles.
- There are no springs (ease-emphasis 300 ms for the hand, 800 ms for the landing). The kinds are idle, pointer, state, arrival and scroll (2 of 5).

## 10. Media
- [x] ~~`Film`/`Pic`~~ n/a: no photograph or film; the objects are Hanzo's SVG mark, gradients and swatches
- [x] ~~Videos~~ n/a
- [x] Nothing missing that this page can fix (ZIP requested)
- [x] No dimmed or filtered photo

Done here: The assets panel shows the three logo plates the ZIP holds (mark on black, white and grey). The ZIP mirror is requested.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- At 375 the h1, lede and both asks come first and the drawing follows. The principles stack with their numerals, the swatches go 2 across and the contrast list 1 column.
- At 360 and under, the assets headline is 30px and the segment labels do not wrap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (the compass; the sweep is a single 4.6 s run)
- [x] ~~Forms~~ n/a
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The heading order is h1, then h2 (each principle, Color Palette, Typography, Components, the assets headline), then h3 (groups), then h4 (sample card). The verdicts are `role=img` shapes with names, never colour alone.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Transform, opacity and SVG only (font-weight on the specimen once)
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop

Done here: The one continuous mover (the compass) runs only while the hero is seen. The tick coordinates are rounded so the server and browser markup match (no hydration warning).

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical belongs to the shared layout owner
- [x] `<JsonLd route="/brand">` unchanged
- [x] ~~Every card is a real link~~ n/a: no cards link

Done here: `app/brand/page.jsx` keeps Hanzo's title "Hanzo Brand Guidelines. — Hanzo AI" and its description.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page

Done here: n/a. /brand is treated as a Story page.

## 16. Developer experience
- [x] ~~CodeBlock~~ n/a: no code; hex values copy exactly as displayed

Done here: n/a beyond the copyable hex values.

## 17. States and resilience
- [x] Copy fails quietly (no tick, no claim)
- [x] Blocked data leaves a complete page, no console errors
- [x] ~~Failed submit~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: All figures are computed or static, so there is no loading state. The console was clean on the last walk.

## 18. Measurement and handover
- [x] `data-cta` on every primary (through `Cta`)
- [x] Nothing identifier-bearing before consent
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: `docs/review/brand.md` was 6/10; every listed fix is done, awaiting re-review

Done here: The review's six fixes are done in its order: the arrival after the curtain and a live hero; scenes instead of a list; JS off; the signature in view; the hero split from /press; and the tidy list (except the ZIP mirror, which is requested). Gallery: `docs/gallery/brand/`.
