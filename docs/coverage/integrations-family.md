# /integrations/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/integrations/Guide.jsx` (+ `intParts.jsx`, `guide.css`, `intData.js`; route `app/integrations/[slug]/page.jsx`, 19 guides) · gallery: `docs/gallery/integrations/` · metric id: `api_key_created` (leading `install_copy`)

Open copy questions for James:
- "Only the Hanzo lines" is now shown as visible text on the switch (register `int_only`, needs_james). Without it nobody could tell what the switch does (review 7/10, part 8).
- "Stop", "Replay", "Copy" and "Copy base URL" are icon-only controls named from the register.

Shared changes requested (`docs/requests/integrations-family.md`):
- n/a. Two site-level issues sit outside this template: the Morph slow path shows the old page (`components/Morph.jsx`), and kit `Copy` swaps its `aria-label` instead of using `role=status` (`components/ui.jsx`).

Forks this page deleted:
- The three look-alike code cards per page are now one pinned window with tabs.
- Per-member accent colours, syntax hues and the coloured gutter stripe.
- The kicker, emoji and category tag beside the h1.
- Visible invented words on Copy.
- The frame-counted typing that blanked the served code.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's own first action (`doc.band.actions[0]`; `lib/cta.js` not merged yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices (none on a guide)
- [x] Open copy questions for James listed, none decided

Done here:
- The h1 is the guide's promise ("Use Hanzo AI with LangChain").
- The one solid ask is "Get API key — Free" (magnetic, `data-thumb`, `data-cta="integrations.hero"`). The close repeats it as its only light-filled button.

## 2. Information architecture and navigation
- [x] One `<main>` (the site's skip link reaches it)
- [x] Every link through `A`; every card a real link
- [x] Breadcrumb at depth 2: "Integrations / LangChain · Frameworks", with the category as its last part
- [x] Link parity: 0 removed, 0 unexpected (23/23 on each member walked)

Done here:
- The six nearest guides are cards, same category first: Cursor shows Continue.dev and GitHub Copilot first.
- The other twelve are a list of real links, so every guide stays reachable.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Nothing above the h1 (the category moved into the breadcrumb under the lede)
- [x] JS off: legible (45 of 45 blocks; chapters stack)
- [x] One idea per 100svh: the window, then one pinned window of chapters, the credit, the cards, the close
- [x] Ends in `Band` equivalent (a black close in Hanzo's words) then the footer
- [ ] Card-to-page links use Morph: the cards carry `data-morph` into the next guide's `data-morph-target`. The 12px landing can't be checked on the dev server (the site-level slow path).

Done here:
- The sample is whole from the first paint. Only Hanzo's own lines type in, about 0.25 s after the window is seen: line 7 is half typed at 1 s, and 1.6% of pixels change between 1.5 s and 3.5 s on the phone.
- The editor sits about 400px down at 1470×801, so its code and connection are on the first screen.
- The gap before chapter 1 is now 44px plus the scene's centring.

## 4. Conversion system
- [x] No raw `.x-btn` (`v2f-btn`; `Cta` not merged yet)
- [x] Sticky ask in header and bar after the hero, same label: the hero is now its own short section, so the site's ask arrives as soon as the hero ask leaves
- [x] Copy button copies exactly the displayed text. Cursor's JSON copy now `JSON.parse`s, because the `//` line is a caption above the code.
- [x] `data-cta` and `data-thumb` on every primary

Done here:
- The ask bar is driven by `data-thumb="Get API key — Free"`.
- The first copy on /integrations/cursor parses as JSON (tested).

## 5. Trust and proof
- [x] No logo, seal or invented number; the only figures are counts of the guide's own lines ("2 / 9")
- [x] Every figure traces to Hanzo's copy
- n/a: marquees (none on this page)
- n/a: no submit on this page

Done here: The proof is Hanzo's own working code, with the lines that point at Hanzo marked in the gutter and typed in.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals: code 14/13, captions 13, category 12 mono caps (14 on phone)
- [x] Measures held: h1 max 17ch, lede 44ch, `text-wrap: balance` on headings
- [x] Code in one window component; tabs in the chapter window
- [x] `python3 scripts/parity.py`: langchain 92/92, cursor 77/77, docker 95/95, python 101/101 text; 23/23 links each

Done here: On phones every code line wraps, so Hanzo's lines read whole instead of being cut mid-URL.

## 7. Visual design system
- [x] `taste.py` passes (3 files). Only deck greys appear (`#fbfbfb`, `#e5e5e5`, `#a3a3a3`, `#404040`, `#262626`, `#171717`, `#0f0f0f`, `#0a0a0a`, `#000`) and white or black alpha steps
- [x] No label, tag, badge or pill above a headline
- [x] Radius 24 (kit); objects outlined, never raised; no shadow (clipped shadows gone)
- [x] One icon set (inline strokes); no icon in a rounded box
- [x] Differs from neighbours: the window's face follows the tool's category
  - a light editor for AI SDKs and frameworks;
  - the same editor mirrored (connection on the left) for languages;
  - a graphite editor for platforms and editors;
  - a black terminal beside the title for infrastructure.

Done here:
- Swiping from langchain lands on llamaindex (light), from cursor on docker (a terminal beside the title), from python on rust (mirrored).
- The credit emoji is greyed (`grayscale(1) contrast(1.08)`).

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97 at 90 ms), focus-visible (site ring), disabled n/a, loading n/a
- [x] Focus ring visible on a Tab crawl (site ring on links, buttons and code blocks)
- n/a: no dialog on this page
- n/a: no input on this page
- [x] Forks deleted: listed above

Done here:
- The switch shows its name and appears only where it means something: at least one Hanzo line, and not every line.
- The key link and the author link have hover, press (translateY 1px) and 44px hit areas.
- The chapter marks darken on hover.

## 9. Motion and interaction
- [x] One signature (the typed lines) plus 3 supporting: the window settling, the chapter window turning, the request on the route. Fade-ups: 0.
- [x] Six kinds of movement; scroll is 2 of them:
  - time: typing, by elapsed time, not frames;
  - idle: a request travelling the route once typing is done, and the contour in the close;
  - state: the switch dims every window; the chapter window changes tab with the heading on one 300 ms clock; a card opens into its page;
  - pointer: magnetic ask, drag rail with inertia, card previews;
  - arrival: masked h1;
  - scroll: settle and chapters.
- [x] Moves without input; every control answers
- [x] Reduced motion: every line shown, 0 running animations after load (tested); no `setInterval`
- n/a: sound kit not merged yet

Done here: Stop finishes the typing at once, and Replay types the Hanzo lines again.

## 10. Media
- n/a: Hanzo has no film or photograph for a guide. The objects are the code window, the route to `api.hanzo.ai/v1`, the guide's own contour (Sigil seeded with `/integrations/<tool>`), and the close's drifting contour.

Done here: Canvases per page: 1 still, 1 live, and up to 6 still card contours (8 of 12).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (walked langchain, cursor, docker, python)
- [x] No horizontal scroll (scrollWidth 375)
- [x] Every target 44px or more on phones (Copy, Stop, Replay, links via a padded hit area)
- [x] Primary ask above the fold at 375×667 (under the lede)

Done here:
- Phone CLS is 0.014 on cursor and 0.001 on langchain, down from 0.15.
- Window titles wrap instead of being cut off.
- A sideways swipe turns to the next guide (cursor → docker, langchain → llamaindex).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: code comments and punctuation are `#525252` (7.8:1 on white). On graphite they are white 55%.
- [x] Pause control on the moving item: Stop while typing, Replay after. The route pulse and the contour freeze under reduced motion.
- n/a: no forms
- [x] One h1; h2 per chapter; switch and controls named
- [x] Keyboard reaches every control; code blocks are focusable with a label

Done here: The route diagram is decorative (`aria-hidden`); the base URL and the key line are real text beside it.

## 13. Performance and engineering
- [x] h1 and the sample in server HTML
- [x] Transform, opacity and clip only; one rAF loop that ends when the typing does
- [x] No poller; no third-party request
- [x] Filmed and measured in the cloud only

Done here: The typed reveal keeps the full text laid out (the rest transparent, a zero-width caret), so typing never moves layout.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical unchanged (site-level)
- [x] `<JsonLd route>` unchanged
- [x] Every card is a real link

Done here: Every sample is complete in the server HTML; the typing only hides Hanzo's lines in the browser until they type.

## 15. Catalogue and product pages
- n/a: model card (not a model page)
- [x] Every card opens by Morph (`data-morph` title into `data-morph-target`)
- [x] Every guide linked in the DOM (6 cards + 12 links)
- n/a: no price on a guide

Done here: The six cards are ranked by category, then Hanzo's order. Each shows Hanzo's one line on hover (always on phones) and its own still contour.

## 16. Developer experience
- [x] One window component; copy equals display
- [x] Config blocks parse on their own: JSON comments become a caption, so Copy is pure JSON
- [x] The typing pauses (Stop) and ends on a static frame
- [x] No hand-typed version number

Done here: Copy is tested on cursor (JSON parses) and langchain (byte-identical).

## 17. States and resilience
- n/a: loading, empty, error and offline (the data is static)
- [x] No live data
- n/a: no submit
- [x] A thrown island does not blank the page (Sigil and typing are effects; the code is served)

Done here: JS off shows every line, every chapter and every link.

## 18. Measurement and handover
- [x] `data-cta` on the hero ask and the close (`lib/track.js` not merged yet)
- [x] Nothing identifier-bearing; no fields
- [x] `V2:` line in `Guide.jsx` (v5)
- [ ] Review read: `docs/review/integrations-family.md` was 7/10; this round fixes its six items. A re-score is pending.

Done here: Film and phone shots for langchain and cursor are in `docs/gallery/integrations/`, re-shot over the same names.
