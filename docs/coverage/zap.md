# /zap coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Zap.jsx` (+ `Zap.css`) · gallery: `docs/gallery/zap/` · metric id: `install_copy` (docs hand-off)

Open copy questions for James: demo labels not in `content/ui-strings.json`: "ZAP · the buffer that arrived", "JSON · the same message as text", "pointer + offset N", "N characters walked", "Read a field", "Agents you run", the two topology captions and their counts.
Shared changes requested (`docs/requests/zap.md`): the header could start dark when the first section is `data-room="dark"` (shared chrome); the phone header ask should go quiet beside a page solid and carry "Read the docs" (until then this page outlines its own asks on phones and with JS off); `components/v2/Settle.jsx` mismatches on hydration under reduced motion (this page now uses a page-local copy, `components/pages/apps/zap/Settle.jsx`). Noted: no skip link; `useEvery` uses `setInterval` (shared `cloud/Frame`); `tokens.css` not merged.
Forks this page deleted: the ASCII `<pre>` as the visible diagram (kept `hidden` in the HTML for the record), the browser range input, the floating pauses on the wire, terminal and fleet, two outlined hero buttons (now text links), the close's second outlined button, the page-wide `--acc` that hid the packet numbers, the "electric-cyan" comments, every spring.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Read the docs" → zap-proto.dev quick start
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: 1 h1. One solid per screen, measured with Playwright: at 1470×801 the hero's white "Read the docs" while the header ask is outlined, then the header's solid "Read the docs" after it, and the close's solid while the header steps aside; at 375×812 the shared header keeps its solid "Try Hanzo", so the page's "Read the docs" asks are outlined there (first screen and close each show 1 solid); with JS off the header is solid, so the page's asks are outlined (1 solid). The chosen field is an outlined segment, not a second white solid.

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

Done here: four section headings cut into their line as they arrive. Gate JS-off hidden 0. The close band ends 24px above the footer at 1470 and 16px at 375 (was 116px).

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Read the docs" on desktop (header); on phones the shared header still says "Try Hanzo" and the shared bar says "Read the docs": requested, not fixed here
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
- [x] Text 13px+ on desktop and 14px+ on phone; only 11–12px mono capitals go smaller (measured: 0 runs below the floor at either width)
- [x] Measures held
- [x] Packet sentences live in their sheets; the terminal is Hanzo's text
- [x] `parity.py /zap`: 0 missing

Done here: parity `text 71/71 links 7/7`. The terminal never wraps: its lines keep Hanzo's spacing and scroll sideways inside a labelled region (`role="region"`, `aria-label="Terminal"`, `tabindex="0"`), so no token is split on phones.

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline
- [x] Tiles flat; the fleet card floats
- [x] One icon set
- [x] Differs from neighbours: a byte buffer and a JSON line, not a window or a desk

Done here: gate hues []; every literal colour in `Zap.css` is a deck value (the off-ramp greys #86868b, #a1a1a6, #f5f5f7, #48484f, #6e6e73, #1c1c20, #2c2c32, #c7c7cc, #d1d1d6, #e3e3e8, #0c0c0e, #0b0b0c, #0a0a0b are gone; the shared `.w2-dark .w2-cta` #f5f5f7 is overridden to #fafafa here). N:1, 1:M and the agent count rest at 64px; the 0 sits at 32px (MASTER part 5: a zero never gets hero size). The diagram's "..." sit inside their rows.

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press .98, focus-visible
- [x] Focus ring on every stop; field radios take arrow keys
- [x] Sheets trap Tab and return focus (OpenSheet)
- [x] No bare `:hover`; chips and links 44px
- [x] Forks deleted: listed above

Done here: the slider is drawn (`role="slider"`, arrows, Page keys, Home/End, drag), with an ink thumb that grows on hover (1.12) and presses to .92 while held (a state, since pointer capture drops `:active`; measured). The hero ask's hover fills from #fafafa to #e4e4e4 and its arrow nudges 3px. Field chips and the terminal's Copy are 44px. The shared `Copy` button has a colour-only hover (shared kit).

## 9. Motion and interaction
- [x] Signature (pointer versus parser), supporting: sheets, typing, magnetic; 0 fade-ups
- [x] Idle (wire, fleet), time (typing, the JSON walk), state (sheets, fields), pointer (slider, magnetic), arrival (cut-ins)
- [x] Moves without input; every control answers
- [x] Reduced motion rests, with no console error or issue badge (3 cold loads at each width, measured after load); no springs
- [x] n/a sound (shared kit)

Done here: `variety.py` OK; packet headers fill the rest of their sixteen bytes on hover. Idle while you wait: the active hero point's rule fills over its 3.6 s turn (it keeps stepping on the phone after the wire leaves view), and a pointer sweeps the landed packet's sixteen header bytes; both stop under reduced motion. The one scale moment: N:1 and 1:M arrive at 1.75× (about 106px), hold, then settle to 64px over 1.6 s (transform only, room reserved above so nothing overlaps; none under reduced motion). The sidecar squares take the largest of four sizes (48, 30, 20, 14px) at which the whole fleet fits its fixed 108px box, so a small fleet fills it.

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

Done here: the diagram keeps its four agents and three servers at 14px on phone, lines meeting. At 375 the hero ask sits on its own row and "Read the Papers" and "GitHub" share the next (GitHub no longer sits alone).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured (#a3a3a3 on #0a0a0a)
- [x] Pause in each object's own bar or control row (wire, terminal, fleet). Not covered by a pause: the landed packet's read-sweep, the terminal cursor and the band's address cursor (it blinks only while the band is on screen); all three stop under reduced motion
- [x] n/a forms
- [x] One h1; h2 order
- [x] Keyboard reaches every control

Done here: the diagram is a `figure` with real text; the ASCII stays `hidden`. Keyboard through the pinned "Why bother" stage: focusing a packet scrolls the page to the point where that packet has landed, the stick never scrolls sideways (`overflow: clip`, `scrollLeft` 0 on all 8 stops) and the 01 / 08 counter follows focus (01 → 08 measured on a Tab crawl at 1470).

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] One small image
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island. Layout shift over a full scroll plus a 13 s dwell on the terminal (two loops): 0.003 at 1470 and 0.006 at 375 (Playwright); `motion.mjs` 0.012 desktop, 0.013 phone. The terminal holds one height through its loop (303px desktop, 272px phone): the cursor sits at the end of the typed line, the line break lives outside the line's span, and the `pre` has a fixed six-line height.

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

Done here: 0 console errors at 1470×801 and 375×812, with normal and with reduced motion. The hero Stage uses a page-local `Settle` that renders the same on the server and the first client render, so reduced-motion visitors get no hydration mismatch.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in the top comment of `components/pages/apps/Zap.jsx`
- [ ] Review 8 or more (re-review pending)

Done here: last review 7/10 (round 2); its nine fixes addressed on the page (fix 3's header half and fix 9's ui-strings half are shared and requested).
