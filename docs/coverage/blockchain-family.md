# /blockchain/* coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/blockchain/BlockPage.jsx` (16 products) + `Directory.jsx` (the chain directory) + `BlockPage.css` + `bcData.js` · gallery: `docs/gallery/blockchain/` (bundler, defi, directory, exchange) · metric id: `api_key_created` (`signup_start` for "Try Hanzo")

Open copy questions for James: the chain finder's sentences ("Named on this page", "Other products that name …") are in `content/ui-strings.json` waiting for approval; until then the finder shows a tick or a dash and the product links only.
Shared changes requested (`docs/requests/blockchain-family.md`): none filed. Noted for the ask-bar owner: at the closing room the header's "Try Hanzo" turns solid beside the room's white button (two solids); and the site ask bar floats a pill over content (MASTER 3.2 rule 6). Noted for the Morph owner: on a sibling click the old page snaps to its top before the next page arrives.
Forks this page deleted: the identical key card as every member's hero (now a proof room after the hero), the 3×3 capability grid and the exploded deck, every derived number (counters, sheet, tile, console, Built For and stream numbering), the bare "5" in the finder, the fake language tabs, the GitHub chip styled like the License text, the inner scroll of the code block and chain picker on phones, the per-member accent, the coloured code tokens, native tooltips, Chrome's search ×, `setInterval`, springs and object shadows.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; labels are Hanzo's own ("Try Hanzo", "Read the docs") (`lib/cta.js` does not exist yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions listed above, none decided

Done here: the ask sits beside the h1 on the first screen at both widths: "Try Hanzo" solid and magnetic (`data-thumb`, `data-cta="blockchain.key"`), "View Documentation" as a text link (measured at 1470×801: h1 top 159, ask top about 455, hero object 148–699). The exchange uses its own "Read the docs" / "Contact Sales".

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A`; every card a real link
- [x] Hanzo's "Back to Web3 Overview" sits in the caption row under the lede
- [x] Link parity: 0 removed

Done here: parity links bundler 3/3, defi 3/3, exchange 6/6, the /blockchain index 16/16. The directory adds a closing rail of Hanzo's Web3 products (their names and chains), each a real link.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero from kit parts; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh
- [x] Ends in sibling cards, the closing room, the Get strip, footer
- [x] Card-to-page links use Morph (titles `data-morph`, h1 `data-morph-target`; 6 of 6 present)

Done here: the first screen holds the 52px name, claim, lede and ask beside this product's own capability deck, which turns by itself every 4.2 s with a filling mark (each card's top shows the product's contour seeded with that capability, so bundler, defi and explorer look different). The exchange's console starts moving at once (filling line) and turns every 3.6 s. JS off: 0 hidden text blocks on bundler, exchange (all 4 panels) and the directory.

## 4. Conversion system
- [x] Kit buttons only (`v2f-btn`); no raw `.x-btn`
- [x] Sticky ask: the header and the site ask bar carry the hero's label after the hero (`data-thumb`)
- [x] Copy (kit `Copy`) copies the code exactly as displayed
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` = `blockchain.key`, `blockchain.key-second`, `blockchain.hero`, `blockchain.hero-second`, `blockchain.band`, `blockchain.band-second`, `blockchain.deploy`. "Deploy to Cloud" is outlined so the Get strip never adds a second solid.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy (HA, <50ms, 100+, "under 5 minutes", chain IDs)
- [x] The chain stream pauses under a pointer and off screen, and freezes under reduced motion
- [x] n/a submit

Done here: Hanzo's "Get Your API Key" card is now the proof room after the hero (figures at 44px weight 220, "Trusted by developers building" chips). No counters anywhere; the directory's count is the true number of cards shown.

## 6. Content presentation (copy untouched)
- [x] No text under 13px desktop / 14px phone except mono capitals (captions 12px mono caps)
- [x] Measures held; headings balanced
- [x] Code via the template's `Code` with kit `Copy`; tabs are real (`role=tab`) on the console
- [x] Parity 0 missing

Done here: parity bundler 146/146, defi 149/149, exchange 109/109, directory 62/62, index 153/153 text. Phone floor raised to 14px for the stat labels, finder chips and links, directory filters, Copy and card meta.

## 7. Visual design system
- [x] `taste.py` passes; no literal hex in `BlockPage.css` (all tokens)
- [x] No label, tag, badge or pill above a headline
- [x] Radii and sizes from tokens; outlined or raised, never both (shadow only on the floating directory sheet)
- [x] No icons beyond the arrow and the tick; none in a box
- [x] Differs from neighbours: each product's hero object is its own capabilities and contour; the exchange a console, the directory a live figure and a grid

Done here: `python3 scripts/taste.py BlockPage.jsx BlockPage.css Directory.jsx` OK. Sizes at rest: h1 52, heads 26, titles 21, card titles 32–44 (the one big thing of the deck), figures 44–64 at weight 220.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97–.98) and focus-visible
- [x] Focus ring visible on deck marks, chips, finder, filters, cards
- [x] The directory sheet traps and returns focus, Esc closes, and it sits above the header (z 400, the scrim covers the header)
- [x] Search field: Chrome's native × hidden
- [x] Forks deleted: listed above

Done here: hover added to the key "Try Hanzo", the finder chips, the directory filters and legend, "Learn more", Built For rows. The language list is plain text (no pills that look like tabs); the GitHub link is a link and the License text is text.

## 9. Motion and interaction
- [x] One signature (the deck, one capability at a time) + 3 supporting (chain stream, typed code, chips driving the finder); 0 fade-ups
- [x] Kinds: idle (deck turning, stream, contours), time (the product's own code types in), pointer (magnetic ask, hold on hover, drag rail), state (finder, console tabs, legend lighting marks); scroll only on the exchange's pinned deck
- [x] Moves untouched; every control answers
- [x] Reduced motion: 0 running animations after 3.5 s; no `setInterval` (timeouts)
- [x] n/a sound (shared kit not merged)

Done here: no springs (directory re-flow and open 300 ms ease-emphasis), deck changes 300–500 ms; the exchange's pin is 25svh a card.

## 10. Media
- [x] n/a `Film`/`Pic`: Hanzo has no photographs or film for these products
- [x] n/a video
- [x] Canvases: hero deck 1, key room 1, chains 1, siblings at most 6 (9 per page)
- [x] No dimmed photo

Done here: the objects carry the page: the capability deck, the key card, the code, the console, the contours.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap from this page
- [x] No horizontal scroll (scrollWidth 375 on all four)
- [x] Targets 44px (links, chips, marks, filters, "Learn more"); hover detail has a tap path
- [x] Primary ask above the fold at 375×667

Done here: phones show the ask and the top of the capability deck on the first screen (exchange: its first product panel first). The code block and the chain picker have no inner scroll on phones (overflow visible, scrollHeight equals clientHeight), so a flick always moves the page. Sideways swipe: bundler → chains and → websockets, defi → directory (tested). The directory's first row starts at 562px on the phone's first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text from the deck ramp
- [x] Moving items hold under pointer or focus; the stream pauses on hover; all stop under reduced motion
- [x] n/a forms (the directory search has its own placeholder as its name)
- [x] One h1; h2 per section; names start with visible text
- [x] Keyboard reaches every control

Done here: deck marks named "<capability>, Chapter n of N" from the register; the finder's tick/dash is `role=img` with a register name; directory marks carry their product names as hidden text and the legend lights them.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] No poller; timers run only in view, stop when hidden or held
- [x] Transform, opacity and clip-path only
- [x] All rendering and filming ran in the cloud

Done here: 9 canvases at most per product page, all paused off screen (Sigil).

## 14. SEO and machine files
- [x] Title and description unchanged
- [x] Canonical unchanged
- [x] `<JsonLd route>` unchanged
- [x] Every card is a real link

Done here: `app/blockchain/[slug]/page.jsx` only passes the product list to the directory now.

## 15. Catalogue and product pages
- [x] n/a model card
- [x] Every sibling card opens by Morph (title → h1)
- [x] Directory: every chain is a button that opens its sheet; kind, search and product filters; a true count
- [x] n/a prices

Done here: phones read the directory as 72px list rows; the closing rail lists six Web3 products that open into their page.

## 16. Developer experience
- [x] Code copies exactly as displayed (kit `Copy`)
- [x] n/a config
- [x] The typed code ends whole; reduced motion shows it whole at once
- [x] No hand-typed version

Done here: the product's own code types itself in once when it reaches the screen; every line is in the HTML from the start.

## 17. States and resilience
- [x] Directory empty state: a silver 0 with its register name
- [x] No live data
- [x] n/a submit
- [x] Members without a key card get the console; JS off shows every panel and card

Done here: static data from `bcData.js`; nothing to fail.

## 18. Measurement and handover
- [x] `data-cta` on every primary (`lib/track.js` does not exist yet)
- [x] Nothing identifier-bearing
- [x] `V2:` lines in `BlockPage.jsx` and `Directory.jsx`
- [x] Review read: `docs/review/blockchain-family.md` 6/10 at ea71c97 + fe077aa; fixes in this commit

Done here: (1) deck back inside the gutters, a contour face per card, 25svh a card on the exchange; (2) one object of its own per product: its own capabilities turning in the hero with its own contour, its own code typing, its own chains driving the finder; (3) first screen top-aligned, object 148–699 at 1470×801, no stage zoom; (4) Built For without the empty column and with a row fill, chains with the product's contour beside the finder; (5) exchange code full width, panel first on phones, "Learn more" 44px, all 4 panels with JS off; (6) real controls, no inner scroll on phones, 14px floor; (7) directory: no native ×, sheet above the header, a row on the phone's first screen, legend lights marks, a closing rail; (8) Morph attributes present (6 of 6); the double solid and the snap-to-top are other owners'.
