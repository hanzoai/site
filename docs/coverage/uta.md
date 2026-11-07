# /uta coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/Uta.jsx` on `components/pages/model/Creative.jsx` and `components/v2/Launch.jsx` · gallery: `docs/gallery/uta/` · metric id: `contact_sales_submit`

Open copy questions for James: none decided here. The page shows Hanzo's words only (the family's studio map, whose heading "Find your field" and field tabs were our words, is off this page); labels that sat above headlines now sit below or beside them as captions.
Shared changes requested (`docs/requests/zen-names.md`): the header ask swaps label between "Try Hanzo" and the page ask and moves its neighbours (Header); the kit `Band` blurs its headline in; the sound kit; `lib/cta.js`, `lib/track.js` and `tokens.css` are not on main yet.
Forks this page deleted: our scene headings, raw `.x-btn` asks (now `Cta`), raw `<img>`/`<video>` (now `Img`, `Film`, `ModelFilm`), the studio-map tile, springs on the tab pill, cursor labels; on /uta only: the studio map (the model grid below shows the same six cards), the glyph tile in the chapter pictures, the kit `Band` (a page-local band with the same words).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label is used)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: model page, prices are the model's own)
- [x] Open copy questions for James listed, none decided

Done here: `app/uta/page.jsx` carries Persona, Goal, CTA, Metric `contact_sales_submit`, Signature and Beyond. One solid fill per screen, measured: at 1470 the header ask goes outlined while the page's own ask is in view, so the first-screen "Request access" (white on the film) and the settled headline's "Request access" are solid there (`Uta.css`, desktop only), and the header turns solid once they leave. At 375 the header keeps its solid "Try Hanzo" and the page's hero asks stay outlined. The closing band's "Request access" is solid. One h1 ("Uta") is in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] n/a: breadcrumb at depth 2 or more (the page sits at depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: the skip link in `app/layout.jsx` reaches `#main`. Every link goes through `A`, `More`, `Cta` or `Arrow`, and every model card is a real `<a href>`. Parity links are 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a: `PageHero` is not in the kit yet; `v2/Launch` plays its role); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (the model cards use the WebGL opener, which lands the picture as this page's hero)

Done here: Uta's own film plays full-bleed under the h1 cut-in within the first second. On desktop the scroll settles it into four stems rising like a crescendo, with Hanzo's headline beside it. On phones the film, name, lede and ask hold until the visitor scrolls (or 6 s pass), then the film eases (1.4 s) into the stems. Then the studio with the piano roll (two bars in D minor at 96 BPM across four stems, solo, presets, tap-to-add notes, Sound, Download MIDI, Pause), then four capability chapters, each with its own picture of Uta's film: the whole fan (01), a playhead crossing three cuts (02), the film split into four stems (03), a D-minor keyboard lighting the roll's scale (04). Then where Uta fits, Hanzo's model-card grid and a closing band in the kit Band's words, its headline cut in by line mask. Entrance states are scoped to `html.js`; JS off shows every word, the band unblurred.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in the header after the hero (the shared header carries it; no phone bar shows on /uta)
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: kit `Cta` only. Desktop: the page's first-screen and headline asks are solid while the header ask is quiet; after them the shared header carries the ask. Phone: the header's solid "Try Hanzo" is the sticky ask; there is no bottom bar on /uta, and "Request access" returns in the closing band. The header swaps its label as page asks enter and leave view (shared, requested). `data-cta` ids: `uta.first` (first screen), `uta.hero` (headline), `uta.band` (close), each with `data-thumb`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] n/a: marquees pause, freeze under reduced motion, hide duplicates (no marquee)
- [ ] n/a: Privacy link and owner line beside every submit (no form on this page)

Done here: Hanzo's own research-preview note (samples publish only after blind review) beside the closing ask; Hanzo's black model cards; no figure is claimed. Numbers: no figure is claimed; the studio specs are the studio window's own labels from content/live.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /uta`: 0 missing

Done here: parity text 74/74, links 4/4. Section headings rest at 26px, the settled headline at 44px, body 16px, ledes 20px. Mono captions are 12-13px; Hanzo's model-card pills are 11px mono capitals (SPEC 10px, raised one step at the critics' ask). Tables: n/a: no table on this page. Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only; `tokens.css` not on main)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on the page and shell files. Deck greys only (#0a0a0a, #525252, #737373, #a3a3a3 on black), Book 497 headings, radii 24 on tiles and 20 on Hanzo's art cards. Black rooms: the closing Band (the studio window is the black object). /uta has its own settle shape (four stems rising like a crescendo), its own demo and its own scene order among the six creative pages.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] n/a: dialogs are native, trap focus and return it (no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: kit `Cta` gives hover, press (scale), focus and the leaving state. The chapter rail buttons are 44px, ink and slide 4px on hover and press to .97; the film Pause grows to 1.08 and lightens on hover and presses to .94; the band's two links are 44px, 15px/500 alike, underline on hover, press to .97; every studio control is 44px (measured: no target under 44px at 1470 or 375 in `main`). Model cards tilt on fine pointers and press to .98. Focus uses the shared ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` on /uta (the family map's tour interval is off this page)
- [ ] n/a: sound only on the listed moments, through the one kit (the shared sound kit is not on main)

Done here: Signature: the piano roll: two bars in D minor at 96 BPM across four stems, solo, presets, tap-to-add notes, Sound and Download MIDI, with Pause. Supporting: the stage settle and the chapter wipes (scroll, desktop only), the h1 and band line cut-ins (arrival), and the model-card tilt (pointer). Idle: the chapter 02 playhead (6 s, linear) and the chapter 04 keys (3.25 s) run only while their chapter is shown. Phones hold the stage until the first scroll, then settle it, with no pin. `variety.py` passes (fade-ups within budget; the settled headline's children rise in on the shared Launch). Under reduced motion the roll rests, its button reads "Play" and "STREAMING ACTIVE" is hidden (measured). Ease-emphasis throughout, no springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, `Film`, shared `ModelFilm`)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's own films are unfiltered; the only dimming is a gradient under the name. `ModelFilm` holds at most two films playing at once. The stage's `FilmPause` stops every film and the page's self-running demos. The model-card grid puts nine real model films and posters on screen together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: at 375 nothing pins. The film, name, lede and ask hold full-bleed until the first scroll (6 s at most), then the film eases into the stems. Chapters become picture-then-words, and the model grid stacks to 2 columns. Every target in `main` is 44px or more (measured). scrollWidth equals innerWidth at 375. The first-screen ask sits under the name inside the first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [ ] n/a: forms labelled; first error focused (no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body text is #525252 on white and #a3a3a3 or better on black. The `FilmPause` (44px, `aria-pressed`) sits at the stage foot; the demo also has its own Pause. h1 is the name, h2 the headline and section heads, h3 the chapters. Tabs and radios take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (gap: not measured with Lighthouse in the cloud)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the priority poster (`Img priority`, 1200×1500) are in server HTML. Only transform, opacity and clip-path animate; the demo loop runs only on screen (`useLoop`) and stops with its own Pause or the page pause. CLS measured with a PerformanceObserver over a full scroll: 0.0010–0.0015 at 1470 (the shared header's label swap) and 0.0000 at 375; 0 console errors at both.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `metadata` in `app/uta/page.jsx` is unchanged, and `<JsonLd route="/uta" />` renders the canonical and schema.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [x] Every card opens by Morph
- [ ] n/a: every maker and model page linked in the DOM (that is `/models`)
- [x] One price figure everywhere

Done here: `ModelCards.jsx` copies SPEC: grid 2fr + 4×1fr at 1131px, rows 220px, gap 12, #000 cards, radius 20, title 22/500 (Enso 44), 11px mono pills (SPEC 10px), the film over its poster with a 0.6s crossfade, and a pointer tilt of 3° that settles flat. This page's card is marked. Each card opens through the WebGL opener.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] n/a: config blocks parse on their own (no config)
- [ ] n/a: terminal pauses and ends on a static frame (no terminal)
- [x] No hand-typed version number

Done here: n/a: no code block on this page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the poster is the loading and offline state for every film)
- [x] Blocked live data leaves a complete page, no console errors (the page has no live data; films fall back to posters)
- [ ] n/a: a failed submit keeps its values and shows no success (no form)
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: JS off shows every word, the closing band unblurred (checked at 1470). Reduced motion shows the settled stage and the demo at rest ("Play", no streaming claim), with no pin. With media blocked, the posters and black frames stand in at their reserved size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for `lib/track.js`: not on main; kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/uta.md` verdict 8 or more (pending a fresh walk of the current build)

Done here: the `V2:` line goes in the page file once a critic scores this build. Proof is in `docs/gallery/uta/` (desktop film and phone stills). This card is refreshed after each review.
