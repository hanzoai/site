# /support coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Support.jsx` (+ `Support.css`, deck tokens from `components/pages/company/deck.css`) · gallery: `docs/gallery/support/` · metric id: one contact click (`cta_click support.*`)

Open copy questions for James:
- /contact and /support both open on Hanzo's "How can we help?". That is Hanzo's copy, so it is kept on both. Should one page change it?

Shared changes requested (`docs/build-notes/requests/<page>.md`):
- None filed.
- For the kit owner:
  - the kit `Band` reveals its title with a blur and uses off-deck greys; this page restyles it locally on the deck;
  - `Band` takes no `data-cta`, so the enterprise ask has none.

Forks this page deleted:
- six raw `.x-btn` (now kit `Go`);
- the page's own dark room (now the kit `Band`);
- the dead ↵ `<kbd>` circle;
- the giant 01–06 numerals;
- the placeholder that repeated the h1.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions for James listed, none decided

Done here:
- **The ask.** The answer card's solid button starts as "Open Help Center", and it only changes when you choose: by typing finished words or pointing at a door.
- **The demo.** It types Hanzo's own "support ticket", which keeps the Help Center. Measured over 9s: the solid read "Open Help Center" throughout.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more — n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: The six doors are real links (`A`) and the answer buttons are kit `Go`. Parity is 6/6 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 — company `MaskLines` h1, the pill and the card stand in until the kit `PageHero` merges
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph — n/a: every door leaves the site

Done here:
- **Order of the first screen.**
  - The h1 cuts in once the curtain has cleared the top (550ms after it starts lifting; at once on a return visit).
  - The pill and card rise at +150ms and the list at +300ms (0.4s entries).
  - The demo types about 1.2s later.
- **Ending.** The page ends on the kit `Band`, which carries the enterprise line with its one email ask.
- **Fit.** At 1470×801 the h1, the pill and "Open Help Center" are above the fold (the button ends at y=630).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` — the kit `Cta` has not merged; kit `Go` is used
- [x] Sticky ask in header and bar after the hero, same label
- [ ] Copy button — n/a: none
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-thumb="Open Help Center"` drives the shared header ask: after the hero the header's button reads "Open Help Center" (desktop, measured at 1470); the phone header keeps the shared "Try Hanzo". `data-cta` is on support.answer.1–6. The Band's button is the kit's and takes no attributes (noted for the kit owner).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy — the page has no figures
- [ ] Marquees — n/a: none
- [ ] Privacy link beside every submit — n/a: the search sends nothing

Done here: Each door goes to Hanzo's own destination, the same as hanzo.ai. Nothing is claimed.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [ ] Tables, FAQ, tabs and code — n/a: none
- [x] `python3 scripts/parity.py /support`: 0 missing

Done here:
- **Parity.** 24/24 text and 6/6 links.
- **Deck type.**
  - h1: 84px, line height 1.02, weight 497, one line on desktop, no `nowrap`.
  - Answer titles: 32–52px.
  - Descriptions: 17–21px.
  - Rows: 21–26px.
- **Additions removed.** The 01–06 numerals, the ↵ glyphs and the repeated placeholder.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here:
- **Palette.** `taste.py` passes, with deck neutrals only.
- **Surfaces.** The pill and the card each have a hairline and no shadow (radius full and 28).
- **Match marks.** They are drawn with shadows, so no word moves (CLS 0.0000 through the demo).
- **Rooms.** One black room, the Band.
- **Neighbours.** The hero is one full-width line over a search pill, unlike the left-h1, right-card heroes of /contact and /contact-sales.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] Dialogs — n/a: none
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here:
- **Focus.** The pill carries the one focus ring: an ink border plus 1px ink and a 5px white halo, concentric with it. The field itself draws none (measured: outline none and box-shadow none on the input).
- **Sizes.** The field is 56px with 17px text, and buttons are 48px.
- **Pill hover.** The border inks from 10% to 30% black.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound — n/a: the shared sound kit has not merged

Done here:
- **Kinds of motion.**
  - **Arrival (7 Nov 22:40):** five entrances, one each: the h1's words dealt from a deck, the lede opened by a lens from the pointer, the help-finder folding out, the answer card flipping in as tiles, the Band levelling from a tilt. The lens now plays (its section, not its own clipped box, is watched).
  - **Time:** the typing demo, once.
  - **State:** the six ways stay in Hanzo's order under the pill and light up in place (best outlined, matches inked); the answer pane lifts; no springs.
  - **Pointer:** pointing at a row previews its door.
  - **Scroll:** none besides the Band's own reveal.
- **Typing rules.**
  - Re-ranking waits for a space or 300ms idle, and words under 3 letters never change the answer. Checked: "g" and "gi" keep the Help Center; "git" gives GitHub; "status pa" stays on System Status.
  - "tickets" finds "ticket" (stem match at 4+ letters).

## 10. Media
- [ ] `Film` and `Pic` only — n/a: Hanzo has no image or film for /support
- [ ] At most 2 videos — n/a
- [x] Budgets met; nothing missing; alt on every image — no images
- [ ] 4+ real visuals — n/a

Done here: The hero objects are product UI that works: the search pill, the answer card and the live list.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here:
- **Phone layout.** At 375 the order is h1, lede, pill, the six ways in two columns (every name whole, 15px), then the answer card with "Open Help Center".
- **Numeral overlap.** With the giant numerals removed, nothing can cross the titles.
- **Width checks.** No sideways scroll at 320 or 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused — the search is labelled; it has no errors
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here:
- **Contrast.** Rows no longer fade by opacity. The rest are `#737373` (4.74:1), a matching row is `#525252`, and the answer is ink.
- **Live region.** It names the shown door once you type, including "Email us" when nothing matches.
- **Demo.** It has a Pause button. Pointer or focus on the card or list, or any key in the field, stops it.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here:
- **Typing.** It sets the pill's state per key, but ranking reads a settled query, so the list and card re-render only on finished words.
- **Demo.** It writes straight to the input and stops off screen.
- **Not fixed here.** The masked h1 is hidden in the server HTML until hydration on return visits; that lives in the company kit.

## 14. SEO and machine files
- [x] Title and description match live
- [x] Canonical equals og:url — the shared layout's
- [x] `<JsonLd route>` parses
- [x] Every card is a real link

Done here: `app/support/page.jsx` keeps Hanzo's title and description and renders `<JsonLd route="/support" />`. All six answers are in the server HTML.

## 15. Catalogue and product pages
- [ ] n/a: not a catalogue or model page

Done here: n/a. /support is a Utility page.

## 16. Developer experience
- [ ] n/a: no code on the page

Done here: n/a. The Documentation and GitHub doors link out, unchanged.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit — n/a: no request is sent
- [x] A thrown island does not blank the page

Done here:
- **Pane states.** Empty shows the Help Center, a match shows the best door, and no match shows "Email us" with your words as the subject (`mailto:support@hanzo.ai?subject=refund%20xyz`).
- **Before hydration.** Only the shown pane takes taps, via `pointer-events` and `visibility` from the server CSS, so a tap can no longer hit the hidden mailto.
- **JS off.** All six answers are readable (checked: 0 hidden, 0 inert).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` — not merged; nothing is sent
- [x] Nothing identifier-bearing before consent
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/build-notes/review/support.md` (6/10). Applied:
  - the focus ring;
  - the numeral overlap;
  - the calm typing;
  - the demo that held the ask;
  - the reachable preview;
  - the honest ↵ (removed);
  - the drawn marks;
  - the pane states and the live region;
  - the Band ending;
  - `Go` buttons.

Done here: Gallery: `desktop.mp4`, `desktop-1.jpg`, `desktop-2.jpg`, `phone.jpg` and `before-desktop.jpg`.
