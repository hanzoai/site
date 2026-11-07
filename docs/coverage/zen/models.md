# /zen/models coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/ZenCatalog.jsx` (+ `ZenCatalog.css`) · gallery: `docs/gallery/zen/models/` · metric id: `api_key_created`

Open copy questions for James: the shelf filter and sort labels ("All", "Hanzo's order", "By size", "By context") and the sheet legend ("total params", "active per token", "context") are control labels this page needs; they are not yet in `content/ui-strings.json`, so please approve or name them.
Shared changes requested: `docs/requests/zen-models.md` (the phone header ask should follow the page's primary; the cold-load hydration note). Two notes for the shared owners: the desktop ask bar is a floating pill over content (MASTER 3.2 rule 6); the footer's server HTML logs a hydration warning on load.
Forks this page deleted:
- the bento cards with a paragraph and four spec rows (now `SPEC.md` model cards plus one sheet row each);
- the per-card "+" detail;
- the raw `<video>` (now kit `Film`);
- raw `.x-btn` asks (now `Cta`);
- every spring (now 300 ms ease-emphasis tweens);
- the 128px display h1 (now 52px rest);
- the jade and blue accents.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (not on this branch: Hanzo's own labels)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices — n/a: no plan; "From $0.01/MTok" is Hanzo's line
- [x] Open copy questions for James listed, none decided

Done here: Header lines `// Persona:`, `// Goal:`, `// CTA:`, `// Metric: api_key_created`, `// Signature:`, `// Beyond:`. One solid "Get API key" in the hero (measured: 1 solid on the first screen at 1470×801 and 375×812) and one "Get Started" in the close. Tiers with no Zen5 model (ultra max, pro max) are not offered as buttons; their names stay in the HTML as visually hidden text, so no control reads as broken. On phone the header still shows its own solid "Try Hanzo" (shared header; requested in `docs/requests/zen-models.md`).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared shell)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more — not added: the live page has none and the copy is frozen (the shared nav owns breadcrumbs)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity links 5/5. Each Zen5 card is a real `<a>` to its existing model page (`/models/hanzo/zen5`, `-coder`, `-flash`, `-mini`, `-pro`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the Zen5 field drifts; the h1 cuts in)
- [x] `PageHero` (kit part not merged: page-local hero, h1 cut in by line mask 105%→0, 700 ms, ease-emphasis, 60 ms apart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer — the sheet is the proof, then a centred close in Hanzo's words
- [x] Card-to-page links use Morph (`data-morph` on every card)

Done here: The hero object is this page's own Zen5 field (a Sigil seeded by the five Zen5 rows' total and active sizes); the model cards below now carry Hanzo's Zen film and still, so the field is not repeated. The black room starts 27px under the 60px header (measured: card top y=87 at 1470×801, was 144) and enters as a rounded 24px card inside the gutters that opens to full width as it is scrolled (clip-path from scroll, none under reduced motion); it ends 56px above the fold. Quick Start overlaps the room by 40px (`margin-top: -40px; padding-top: 72px`), so its terminal starts 32px under the room (y=777, inside the first screen). On phone the field is a 28svh band above the type. The figures pin over 200svh; each 112px figure (y≈259) sits over a 220px drawing of its own number (y≈415–635), with the index as the small thing beside them, crossfading 500/300 ms: 18 marks (the five Zen5 in ink), the Zen5 contexts on a linear 2M ruler, one filled cent of a 100-cell dollar, the five Zen5 sizes (total against active), and 7 capsules (44px wide, 27px apart; no captions, because Hanzo's lede names only 6 of the 7 modalities). JS off: the room shows Hanzo's `zen.webp` still inside `<noscript>` and the pause button is hidden (`html:not(.js)`); 0 hidden text blocks.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (shared ask bar fed by `data-thumb`)
- [x] Copy button copies exactly the displayed text (Quick Start copies the model name shown; the typed name lives in React state, so code, pressed name and clipboard always match)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids: `zen-models.hero` (thumb), `zen-models.hero-explore`, `zen-models.hero-pricing`, `zen-models.card-<slug>`, `zen-models.close`, `zen-models.close-dev`, `zen-models.close-pricing`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [x] Marquees — n/a: none
- [x] Privacy link by submit — n/a: no form

Done here: The figures are 18, 2M, $0.01/MTok, MoE + Dense and 7. The rows give each model's params, context, arch and "$0 / $0", plus Hanzo's scores in the Zen5 Mini paragraph. All are byte-identical to the live page (parity 89/89).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (and the `SPEC.md` card tag pill at 10px, which the spec fixes)
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts — the sheet is a list with inline disclosure; Quick Start keeps its own `<pre>` because the model name retypes inside it
- [x] `python3 scripts/parity.py /zen/models`: 0 missing

Done here: Rest sizes are h1 52px (40 on phone), section heads 26px, lede 21/17px, body 16px. The pinned figure is 112px Air (52 on phone), card titles are 22px (44 on the tall card), card lines 13px. Parity: text 89/89, links 5/5.

## 7. Visual design system
- [x] `taste.py` passes; deck values only, set once at the top of `ZenCatalog.css`
- [x] No label, tag, badge or pill above a headline (the "Zen 6 and Zen 6 Flash…" line sits under the h1; "Zen5" sits beside its heading)
- [x] Radii 24 (hero tile, terminal), 20 (model cards), 6 (chips), full (buttons, segments); no shadows
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours: its own Zen5 field hero (the shared zen.webm lives on the cards, not the hero) plus a card grid, where `/zen/zen6-max` pins a rack and `/zen/7` raises a 7

Done here: taste.py passes on both files. No hue in the UI; the only picture is Hanzo's own monochrome Zen film and still on the cards, unfiltered and undimmed. The sheet legend keeps each swatch with its label (`white-space: nowrap` spans), so it wraps as whole entries.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover: hover)`), press (scale .97, 90 ms), focus-visible, disabled
- [x] Focus ring visible on every stop (ink 2px with a white halo on cards; white with a black halo on the film's pause)
- [x] Dialogs — n/a: none
- [x] Inputs 16px — n/a: no input
- [x] Forks this page deleted: listed above

Done here: Field pause/play (hidden under reduced motion, where the field is already still), the model-name chips, tier and order segments (44px; hover grows an #ededed pill in under the label, 150/300 ms, previewing where the gliding ink lands; gliding ink pill on a 300 ms tween; on phone the tier rail snaps and shows a right-edge peek when it runs past the screen), row disclosure buttons (44px, `aria-expanded`), and cards (tilt, focus ring, and size bars on hover or focus).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting, 0 fade-ups (`variety.py` OK: layoutId, useScroll, Sigil, typing)
- [x] At least 3 kinds; scroll-linked half or less
- [x] Moves untouched; every control answers
- [x] Reduced motion final state; no `setInterval`
- [ ] Sound: not built here (shared kit not merged)

Done here:
- State: the sort and tier re-flow, with the leader taking the tall card.
- Time: the model line retypes; no new cycle starts on hover or focus, and a running cycle finishes its name.
- Idle: the hero's Zen5 field drifts and the lead card plays the Zen film (600 ms crossfade over its still once playing); each figure drawing idles (a wave through the 18 marks, a playhead sweeping the 2M ruler, the cent breathing, the active bars pulsing, the 7 capsules filling in turn); the close's context ruler drifts (32 s, ease-in-out, alternate).
- Pointer: card tilt up to 3° with the model's size bars drawing in to scale (500 ms ease-emphasis; measured on hover: Zen5 Coder total 47/166px, context 111/166; Zen5 Pro 166/166, active 22; Zen5 Flash 2/166, context 28); sheet rows fill #f5f5f5 and light their bars; the hero field leans toward the pointer; sort and tier pills grow an #ededed fill.
- Arrival: the h1 cut-in.
- Scroll: the hero room opens to full width, the pinned figures cut in through a mask while each figure's drawing grows in (scaleX/scaleY, 500 ms ease-emphasis, staggered), and the sheet bars draw.
- No springs anywhere.

## 10. Media
- [x] kit `Film` and `Img` only
- [x] At most 2 videos (one: the lead card); pause button on the moving field
- [x] Budgets: Hanzo's existing `/models/zen.webm` and `zen.webp`; nothing invented
- [x] No dimmed photo (a gradient sits only under the hero text; the card media is never filtered)

Done here: The hero is a Sigil canvas (only drawn while on screen, one still frame under reduced motion), with a 44px pause/play (`aria-pressed`). Every Zen5 page (`/models/hanzo/zen5…`) opens on the Zen film, so the cards carry it: the leader is kit `Film` (`/models/zen.webm`, poster `zen.webp`) fading in over an `Img` of the still once it plays (600 ms); the four others hold the `zen.webp` still, each framed on its own part (sphere, ripples, a close-up) with a static object-position and zoom. Sigil stays as the fallback for a model without media. Measured: 1 video in the page, playing only in view (0 playing at load, 1 on the shelf), 0 under reduced motion (poster). The Morph flies the card's own picture: the lead card's film grows to full screen and lands on /models/hanzo/zen5's Zen film hero; Back returns to the same scroll (2662 = 2662).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; tilt off on touch
- [x] Primary ask above the fold at 375×667

Done here: On phone, the hero tile puts a 28svh band of the Zen5 field above the type, and "Get API key" sits at 616–660px at 375×667 (656–700px at 375×812). The figures become a 64px lead figure ("18") with its own drawing under it (the 18 marks, 56px, the five Zen5 in ink, the wave idling; still under reduced motion), ruled off, over a 2-column grid at 32px (2M | $0.01/MTok, MoE + Dense | 7). The shelf is the leader full width (343×260, playing the film) over a snap rail of the other four (288×220 each, 84% wide so the next shows a 16% peek; `scroll-snap-type: x proximity`); the leader is sticky inside the rail, so a swipe moves only the four (measured: after a swipe the leader stays at x=16). Size bars always show to scale. The sheet rows become name / params / bars / facts. scrollWidth equals the viewport at 375 and 1470 (the rail scrolls inside itself).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item (film pause; the retype stops on hover and focus)
- [x] Forms — n/a
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text pairs are #0a0a0a, #525252 and #737373 on white; #525252 on the #f5f5f5 segments; white 78% and 55% on black and #171717. Row buttons are named by the model name with `aria-expanded`. Gap: no axe run in this pass.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Film sized; no unsized media
- [x] No poller (timeouts only, stopped off screen)
- [x] Nothing heavy run on James's laptop

Done here: Layout shift measured over a full scroll: 0 at 1470×801 and 375×812. One Sigil canvas (the hero); the cards carry one lazy `Film` (no source until it nears the screen) and lazy `Img` stills. Gap: bundle size not measured in this pass.

## 14. SEO and machine files
- [x] Title and description match live (`app/zen/models/page.jsx`, unchanged)
- [x] Canonical equals og:url (shared `JsonLd`)
- [x] `<JsonLd route="/zen/models">` parses
- [x] Every card is a real link

Done here: Metadata and `JsonLd` are untouched; the five cards are `<a href="/models/hanzo/zen5…">`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md`: #000, 20px radius, no shadow or border, title 22px/500 −0.44px/28px plus "→" (44px/48px on the tall card), line 13px/18px at white 80%, tag pill 10px mono 0.8px tracking, 4px 10px, 1px white 20% border; tilt up to about 3° with `perspective(900px)`, `.3s cubic-bezier(.2,.8,.2,1)`, flat on leave, none under reduced motion
- [x] Every card opens by Morph
- [ ] Every maker and model page linked — n/a here: this is the Zen catalog, not `/models`
- [x] One price figure everywhere ("$0 / $0" for every Zen5 row)

Done here: The grid is the SPEC grid: `385px repeat(4, 192px)`, rows `220px 220px`, gap 12px, one 1201px band at 1470 (measured: lead 385×452 spanning column 1 and both rows; the other four two tracks wide, 396×220, two by two). Below 1280px the same tracks as `2fr repeat(4, 1fr)`; below 900px the leader on top and a snap rail of the others. The Pro tier (3) gives the lead plus two 804×220 cards. Non-lead titles stay 22px. Media: the leader plays `/models/zen.webm` over `zen.webp` (600 ms crossfade, `object-fit: cover`, never filtered); the others hold the still. After "By size" the new leader (Zen5 Pro) takes the film; still one video. The card size bars read the page's own `--zc-w` (the shared `--w` is a registered length, which voided `scaleX()`).

## 16. Developer experience
- [x] Copy equals display (Quick Start copies the code with the model name on screen)
- [x] Config blocks — n/a
- [x] The rotating line stops on hover and focus
- [x] No hand-typed version number

Done here: Quick Start is the second chapter, a graphite 24px tile. Tapping zen6, zen6-flash or zen5-coder retypes the line and stops on it. Sampled every 150 ms, the code, the pressed name and the clipboard match (the cleanup no longer writes the old name back).

## 17. States and resilience
- [x] Loading, empty, error — the empty state is designed out: tiers with no Zen5 model are not offered
- [x] Blocked data — n/a: nothing fetched; 0 page errors
- [x] Failed submit — n/a
- [x] Thrown island — shared error boundary

Done here: JS-off and reduced motion show the h1, every figure (as a list), every card and every row with its paragraph. If the film is blocked, its poster shows.

## 18. Measurement and handover
- [x] `data-cta` on every primary (Cta sends `cta_click` through the shared event)
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/zen/models.md` 7/10 (third verdict); fixes 1–6 done here (Zen film and stills on the cards so the Morph hands over the same picture, figure drawings capped at 220px, top bands closed, phone 18-mark drawing and card rail, legend kept whole, Explore arrow drops and a JS-off still); no captions on the 7 capsules (Hanzo's copy names only 6 modalities); the shared items (footer hydration, phone header ask, header glass, cookie card) stay with their owners; awaiting a new verdict

Done here: Gallery: `docs/gallery/zen/models/` (desktop film plus 3 phone stills), re-filmed after this rework.
