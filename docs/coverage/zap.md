# /zap coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Zap.jsx` (+ `Zap.css`) · gallery: `docs/gallery/zap/` · metric id: `install_copy` (docs hand-off)

Open copy questions for James: demo labels not in `content/ui-strings.json`: "ZAP · the buffer that arrived", "JSON · the same message as text", "pointer + offset N", "N characters walked", "Read a field", "Agents you run", the two topology captions and their counts.
Shared changes requested (`docs/requests/zap.md`): the header could start dark when the first section is `data-room="dark"` (shared chrome). Noted: no skip link; `useEvery` uses `setInterval`; `tokens.css` not merged.
Forks this page deleted: the ASCII `<pre>` as the visible diagram (kept `hidden` in the HTML for the record), the browser range input, the floating pauses on the wire, terminal and fleet, two outlined hero buttons (now text links), the close's second outlined button, the page-wide `--acc` that hid the packet numbers, the "electric-cyan" comments, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Read the docs" → zap-proto.dev quick start
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 solid per viewport. The chosen field is an outlined segment, not a second white solid.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; n/a skip link (shared)
- [x] Every link through `A`; packets open sheets
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 7/7.

## 3. First impression and page narrative
- [x] Sells in 5 s; the pointer jumps and the JSON walks within 1 s
- [x] h1 CSS cut-in painted by the server; the kicker sits under the h1
- [x] JS off legible
- [x] Dark hero → packets → terminal → stats and gateway → close; heights vary
- [x] Ends on one ask, then footer
- [x] n/a Morph

Done here: four section headings cut into their line as they arrive. Gate JS-off hidden 0.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Read the docs"
- [x] Copy copies the four `zapd` lines without `$ `
- [x] `data-cta` and `data-thumb` on both primaries

Done here: `zap.hero` and `zap.close` (both `data-thumb`), so the bar steps aside at the close.

## 5. Trust and proof
- [x] No logo, seal or invented number; Hanzo's own "we have not published a benchmark" note stays beside the stats
- [x] N:1, 1:M, 0 and the 16-byte header are Hanzo's
- [x] n/a marquees
- [x] n/a submit

Done here: the fleet counter counts structure only (processes), no timings.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+ (no 9px diagram any more)
- [x] Measures held
- [x] Packet sentences live in their sheets; the terminal is Hanzo's text
- [x] `parity.py /zap`: 0 missing

Done here: parity `text 71/71 links 7/7`; gate small375 [].

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline
- [x] Tiles flat; the fleet card floats
- [x] One icon set
- [x] Differs from neighbours: a byte buffer and a JSON line, not a window or a desk

Done here: gate hues []; figures rest at 64px (N:1, 1:M, 0, the agent count).

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press .98, focus-visible
- [x] Focus ring on every stop; field radios take arrow keys
- [x] Sheets trap Tab and return focus (OpenSheet)
- [x] No bare `:hover`; chips and links 44px
- [x] Forks deleted: listed above

Done here: the slider is drawn (`role="slider"`, arrows, Page keys, Home/End, drag), with an ink thumb that grows on hover.

## 9. Motion and interaction
- [x] Signature (pointer versus parser), supporting: sheets, typing, magnetic; 0 fade-ups
- [x] Idle (wire, fleet), time (typing, the JSON walk), state (sheets, fields), pointer (slider, magnetic), arrival (cut-ins)
- [x] Moves without input; every control answers
- [x] Reduced motion rests; no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK; packet headers fill the rest of their sixteen bytes on hover.

## 10. Media
- [x] Kit `Img` only (the Enso mark beside the kicker)
- [x] n/a video
- [x] Sized 26×26
- [x] n/a photos

Done here: one decorative `Img` with `alt=""`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: the diagram keeps its four agents and three servers at 14px on phone, lines meeting.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured (#a3a3a3 on #0a0a0a)
- [x] Pause in each object's own bar or control row
- [x] n/a forms
- [x] One h1; h2 order
- [x] Keyboard reaches every control

Done here: the diagram is a `figure` with real text; the ASCII stays `hidden`.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] One small image
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/zap" />`
- [x] n/a cards

Done here: `app/zap/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] n/a
- [x] n/a
- [x] n/a

Done here: n/a.

## 16. Developer experience
- [x] The terminal copies exactly the four commands (no `$ `)
- [x] n/a config blocks
- [x] Terminal pauses (in its bar) and ends on its full text
- [x] No hand-typed version

Done here: `Copy` text is the `$` lines with the prompt stripped.

## 17. States and resilience
- [x] n/a live data
- [x] Blocked network: complete page, no console errors
- [x] n/a submit
- [x] n/a

Done here: look.cjs both widths errors none.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/zap/page.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: previous review 6/10; its eight fixes addressed.
