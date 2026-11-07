# /koe coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/Koe.jsx` on its page-local `KoeCreative.jsx` (Koe's copy of the family `Creative.jsx`) and `KoePanels.jsx`, on `components/v2/Launch.jsx` · gallery: `docs/gallery/koe/` · metric id: `contact_sales_submit`

Open copy questions for James: none decided here. The page shows Hanzo's words only; labels that sat above headlines now sit below or beside them as captions.
Shared changes requested (`docs/requests/zen-names.md`): the desktop ask bar floats over content (Ask.jsx); the sound kit; `lib/cta.js`, `lib/track.js` and `tokens.css` are not on main yet.
Forks this page deleted: our scene headings, raw `.x-btn` asks (now `Cta`), raw `<img>`/`<video>` (now `Img`, `Film`, `ModelFilm`), the studio-map tile, springs on the tab pill, cursor labels.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label is used)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: model page, prices are the model's own)
- [x] Open copy questions for James listed, none decided

Done here: `app/koe/page.jsx` carries Persona, Goal, CTA, Metric `contact_sales_submit`, Signature and Beyond. One solid fill per screen, measured at 1470×801, 375×812 and 375×667: Koe's own "Request access" (/research-access?models=koe) is the solid one while it shows. It is white on the film on the first screen and ink beside the settled headline (`KoeCreative.jsx`), and the header's ask is outlined meanwhile (`html[data-ko-ask]`, Koe.jsx + Koe.css). Once it has scrolled by, the header's ask is the solid one. The closing Band repeats it. One h1 ("Koe") is in the server HTML and stays visible after the settle.

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

Done here: Koe's own film plays full-bleed under the h1 cut-in within the first second. It then settles into a tall voice capsule left of the headline (a pill on phones), and Hanzo's headline rises beside it. On phones the settled pill keeps speaking: the film keeps playing and slowly breathes (scale 1 to 1.1 over 7s), a playhead sweeps it every 6s and a 28-bar level meter moves at its foot (measured 15% of the 375×812 screen changing over 2.5s at rest; 0% once Pause is pressed). Once settled, the h1 "Koe" rests visibly at 52px above the headline on desktop and at 44px in the white band above the pill on phones. Then come four capability chapters, then the demo. Each chapter draws its own booth-derived picture (`KoePanels.jsx`, canvas):
- a pitch contour re-performing over level bars (emotional modulation);
- two waveforms under one shared envelope (cross-lingual cloning);
- the mouth shape of each phoneme of "Hanzo" opening on its timeline slot (viseme dubbing);
- a watermarked waveform with a provenance chain filling block by block (likeness rights).

So Koe's wave film shows only on the stage, the map card and the model card. Then the booth: a voice waveform streams while the phonemes of "Hanzo" light in step, four acting presets, with Pause, Hanzo's model-card grid and the `Band`. Entrance states are scoped to `html.js`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: the page's own ask is solid while it shows: `<Cta thumb>` beside the settled headline, and the film ask filled white on the first screen. The header's ask is outlined while either shows and solid after (desktop: Hanzo's header swaps to "Request access"). On phones the shared bar carries "Request access" after the hero. `data-cta` ids: `koe.first` (first screen), `koe.hero` (headline), `koe.preview` (preview).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] n/a: marquees pause, freeze under reduced motion, hide duplicates (no marquee)
- [ ] n/a: Privacy link and owner line beside every submit (no form on this page)

Done here: Hanzo's own research-preview note (samples publish only after blind review) beside the ask; the studio map on Hanzo's black cards; no figure is claimed. Numbers: no figure is claimed; the studio specs are the studio window's own labels from content/live.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /koe`: 0 missing

Done here: parity text 58/58, links 4/4. Section headings rest at 26px, the settled headline at 44px, body 16px, ledes 20px. Mono captions are 12-13px; Hanzo's model-card pills are 11px mono capitals (SPEC 10px, raised one step at the critics' ask). Tables: n/a: no table on this page. Headings use `text-wrap: balance`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only; `tokens.css` not on main)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on the page and shell files. Deck greys only (#0a0a0a, #525252, #737373, #a3a3a3 on black), Book 497 headings, radii 24 on tiles and 20 on Hanzo's art cards. Black rooms: the closing Band (the studio window is the black object, a flat fill with no shadow, since it is a static tile). Section captions ("In production", "Hanzo Creative AI") sit under their headings. /koe has its own settle shape (a tall voice capsule left of the headline (a pill on phones)), its own demo and its own scene order among the six creative pages.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] n/a: dialogs are native, trap focus and return it (no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: kit `Cta` gives hover, press (scale), focus and the leaving state. Chapter rail buttons press to scale .97. The stage's × close inverts on hover (white fill and ink glyph over the film; ink fill and white glyph once the film has settled onto the white page) and turns 90°; it presses to scale .9 with a darker fill. Measured with hover emulated:
- the solid hero ask goes #0a0a0a to #2c2c2e and presses to .97;
- the white film ask goes #fafafa to #e5e5e5;
- "Try it in Design →" moves its arrow 4px right and takes a 1px ink underline (offset 3px, 150ms);
- the outlined header ask fills #f5f5f5;
- any quiet button in the body fills #f5f5f5 with a black-18% border.

Model cards tilt on fine pointers and press to .98. Focus uses the shared ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (gap: one typing interval remains in v1 demo code where present)
- [ ] n/a: sound only on the listed moments, through the one kit (the shared sound kit is not on main)

Done here: Signature: the booth: a voice waveform streams while the phonemes of "Hanzo" light in step, four acting presets, with Pause. Supporting: the stage settle and the chapter wipes (scroll, desktop only), the h1 line cut-in (arrival), and the model-card tilt (pointer). The chapter and fits pictures loop on screen only, are held by the page Pause, and show one still frame under reduced motion. Phones settle the stage by time, with no pin, and the settled pill keeps its playhead and level meter moving (CSS transforms only, stopped by the page Pause through `[data-mpaused]`, hidden under reduced motion). Koe also undoes the stage film's own off-screen pause while the stage is on screen, so the film never freezes while Pause says playing. `variety.py` passes, with 0 fade-ups. Ease-emphasis throughout, no springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, `Film`, shared `ModelFilm`)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's own films are unfiltered; the only dimming is a gradient under the name. Koe's one film (`koe.webm`) appears three times: the stage, the map card and the model card. The chapters and "Where Koe fits" carry five different drawn Koe pictures instead. `ModelFilm` holds at most two films playing at once. The stage's `FilmPause` stops every film, the booth and the drawn pictures. The model-card grid puts nine real model films and posters on screen together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: at 375 nothing pins. The stage settles by itself 1.1s after arrival, and the camera pans the subject into the shape. The pill starts 8px under the × close and ends 28px above the headline (measured at 375×812: pill 136 to 413, headline from 441). Short phones get a slimmer pill, and the ask comes straight under the headline. At 375×667 the solid "Request access" sits at y 373 to 417, clear above the cookie card (top 448). The pause disc docks on the settled pill's right end (desktop: the capsule's foot), not on white. The map's field tabs are one row that scrolls sideways, with the next field peeking, and the chosen field scrolls into view. Chapters become picture-then-words, and the grids stack to 2 columns. scrollWidth equals innerWidth at 375. The first-screen ask sits under the name inside the first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [ ] n/a: forms labelled; first error focused (no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body text is #525252 on white and #a3a3a3 or better on black. The `FilmPause` (44px, `aria-pressed`) sits at the stage foot and stops the films, the phone pill's meter and playhead; it reads "Play" while paused. The demo also has its own Pause. h1 is the name, h2 the headline and section heads, h3 the chapters. Tabs and radios take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (gap: not measured with Lighthouse in the cloud)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the priority poster (`Img priority`, 1200×1500) are in server HTML. Only transform, opacity and clip-path animate; the demo loop runs only on screen (`useLoop`) and stops with its own Pause or the page pause. CLS measured 0.001 at 1470 and 0.000 at 375 during a filmed scroll of the page.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `metadata` in `app/koe/page.jsx` is unchanged, and `<JsonLd route="/koe" />` renders the canonical and schema.

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

Done here: JS off shows every word. Reduced motion shows the calm layout: the full-bleed film with "Koe", its lede and ask, then the headline, lede and asks below it. It also shows the demo's final frame and one still frame in each drawn picture, with no pin. With media blocked, the posters and black frames stand in at their reserved size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for `lib/track.js`: not on main; kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/koe.md` verdict 8 or more (pending a fresh walk of the current build)

Done here: the `V2:` line is in `components/pages/model/Koe.jsx` (and `app/koe/page.jsx`). Proof is in `docs/gallery/koe/`: first screens `desktop-1470.png` and `phone-375.png`, filmed sheets `d-sheet-01.jpg` and `p-sheet-01.jpg`, plus the earlier desktop film and phone stills. This card is refreshed after each review.
