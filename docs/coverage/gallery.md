# /gallery coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Gallery.jsx` (+ `.css`) · gallery: `docs/gallery/gallery/` · metric id: `signup_start` (gallery hand-off; `data-cta` gallery.hero, gallery.viewer, gallery.close)

Open copy questions for James: the wall label reads "Image + video gallery" beside "Curated template showcase for Hanzo products"; both are Hanzo's words and they disagree (kept as live). "Close", "Previous template" and "Next template" are aria-labels only, awaiting the register.
Shared changes requested: the phone header ask (filed in `docs/requests/founder.md` for all my pages; meanwhile the page-local `usePhoneAsk` does it); the cookie card can cover a phone dialog's bottom edge (the viewer's controls moved to its top under 899px).
Forks this page deleted: the hand-written hero and close buttons (now kit `Cta`), the six Sigil canvases (each frame now holds a render of its own words), the three equal move cards (one stage with three states), the text-only plaque (now the Zen film card), the `data-cursor="View"` label, the `aria-live` counter, `saturate(.6)`, the off-deck greys.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy ("Browse the Gallery", gallery.hanzo.ai)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices: no prices on the page
- [x] Open copy questions for James listed, none decided

Done here: one solid per screen at both widths (phones via `usePhoneAsk`, which outlines the header's "Try Hanzo" while the page's ask shows). "Browse the Gallery" is the one solid in the hero (`Cta thumb`, `gallery.hero`) and again only in the dark close; Documentation, Deploy to Cloud and View on GitHub are quiet or text links.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A` or the kit `Cta`; every card a real link or a button that opens the viewer
- n/a: Breadcrumb at depth 2 or more (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /gallery` links 5/5; the "hanzoai" org link keeps `rel` and a hidden "(opens in a new tab)".

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero` (hand-built hero with the shared LineMask; nothing above the h1)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer (a page-local dark close, because the kit Band holds no second link and no object)
- [x] Card-to-page links use Morph (frame to viewer, 600 ms in-out, closes back into the same frame)

Done here: the h1 cuts in at first paint and the Zen film and walking light move with no input; the wall, one changing stage, the prompt and a dark close with the wall in miniature are four different rooms.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in the header after the hero, same label (desktop by the shared Ask; phones by `usePhoneAsk`: outlined while the page's ask shows, "Browse the Gallery" after it; no bottom bar)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-thumb="Browse the Gallery"` on the hero ask; the viewer carries a "Browse the Gallery" text link (`gallery.viewer`), so the one state change has the ask in it.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy (Apache-2.0, 01 / 06 counters only)
- n/a: Marquees (none on the page)
- n/a: Privacy link beside every submit (no form)

Done here: the only facts are Hanzo's six template statements and the license line; nothing is counted or claimed beyond them.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals and the aria-hidden renders
- [x] Measures held; no orphan word in a heading
- n/a: Tables, FAQ, tabs (none); code is the kit `Copy` prompt box
- [x] `python3 scripts/parity.py /gallery`: 0 missing

Done here: parity text 32/32, links 5/5. Each template's full sentence is read out on the plaque as the light reaches it, and in full in the viewer; no sentence is clamped mid-phrase.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; deck greys only (#f6f6f6 to #e9e9e9 silver, #f2f2f2, #f5f5f5, #525252, #737373, #0a0a0a, #000)
- [x] No label, tag, badge or pill above a headline
- [x] Radii from the deck: art cards and frames 20px, inner art 12px (concentric), wall 28px, windows 24px
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK (2 files). Colour enters only through Hanzo's Zen film on the plaque; the frames are ink on silver or white on black.

## 8. UI component library
- [x] Every control has hover, press, focus-visible (frames press to .98, links press 1px, viewer arrows .94)
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs are native (a `role=dialog` that traps focus, closes on Esc and returns focus to its frame)
- [x] No bare `:hover` (all inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: the viewer traps Tab across its links and buttons, ←/→ step templates by crossfade, Esc and the × close return focus to the frame you opened.

## 9. Motion and interaction
- [x] One signature (the walking light read out by the plaque), 3 supporting (Settle, frame-to-viewer open, typing)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only through the shared kit (no page sounds)

Done here: idle (film, walking light, the stage stepping fork → deploy → submit), pointer (hover holds the light, magnetic ask), state (viewer, stage buttons), time (typed prompt), arrival (h1 cut-in); the only scroll move is the wall's settle.

## 10. Media
- [x] Film through the shared `ModelFilm` (poster first, plays only on screen, never under reduced motion)
- [x] At most 2 videos playing (one); the page pause stops it and the walking light
- [x] Budgets met; the renders are aria-hidden with the words in the caption
- [x] No dimmed or filtered photo; unlit frames dim their render, not a photo

Done here: Hanzo's own `zen.webm` over `zen.webp` leads the wall; six product renders are built only from each frame's words.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: qc crawl 7 Nov: scrollWidth 320 at 320, 0 controls under 44px in `<main>` at 375; the Zen plaque is on the phone's first screen and the label strip moves below the frames.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #525252 and #737373 on white, white 78% on black
- [x] Pause control on every moving item (`FilmPause` stops the film, the light and the stage)
- n/a: Forms (none)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control; the counter no longer announces itself

Done here: the self-walking counter has no `aria-live`; the plaque's read-out is aria-hidden because each frame carries its full text.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] Every video sized by its box; six canvases removed
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop (cloud only)

Done here: CLS 0.0007 desktop, 0.0004 phone on a full walk, and 0.0000 over 12 s idle beside the Moves stage on phone (round 2: every move's words stay open, so its self-stepping changes no height); the typed prompt types over a hidden full copy.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical from the shared layout
- [x] `<JsonLd route="/gallery" />`
- [x] Every card is a real link or opens the viewer

Done here: `app/gallery/page.jsx` keeps "Gallery — Hanzo AI" and the live description.

## 15. Catalogue and product pages
- n/a: Model card SPEC (not a model grid; the Zen film is used as media only)
- [x] Every frame opens by Morph into the viewer and back
- n/a: maker and model pages
- n/a: prices

Done here: the viewer opens from the clicked frame's box (layoutId) and, while it still shows that frame, closes back into it. After stepping with ←/→ or the index it closes by a plain fade (the morph only joins the same picture), so nothing doubles or flies across the wall.

## 16. Developer experience
- [x] One prompt block; copy equals display (kit `Copy`)
- n/a: Config blocks
- [x] The typing ends on a static frame; reduced motion shows it typed
- [x] No hand-typed version number

Done here: the agent prompt copies exactly "Read https://hanzo.ai/skill.md and use Hanzo Gallery in my project."

## 17. States and resilience
- n/a: Loading, empty, error, offline (no live data or form)
- [x] Blocked live data leaves a complete page, no console errors
- n/a: Failed submit (no form)
- [x] A thrown island does not blank the page (film failure leaves the black plaque and its words)

Done here: qc with api.hanzo.ai blocked: 0 page errors, 0 console errors at 1470, 375 and 320.

## 18. Measurement and handover
- [x] `data-cta` on every primary (gallery.hero, gallery.viewer, gallery.close)
- [x] Nothing identifier-bearing before consent
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/gallery.md` verdict 8 or more (awaiting the fresh critic)

Done here: hero and close asks fire the kit `cta_click` event with their ids; no field values exist on the page.
