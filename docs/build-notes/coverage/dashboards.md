# /dashboards coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Dashboards.jsx` (+ `Dashboards.css`) · gallery: `docs/gallery/dashboards/` · metric id: `api_key_created` (proxy on this page: `cta_click dashboards.hero`)

Open copy questions for James: (1) the Monitors section used an invented headline, "The alert and the chart / cannot disagree" (a cut of Hanzo's sentence) under a "Monitors" kicker; it now uses Hanzo's own "Monitors" as its heading and keeps the full sentence as body: confirm. (2) The hero's only ask on live is "GitHub" (to the repo); kept, no label change. (3) "4 stars" is Hanzo's static figure.
Shared changes requested (`docs/requests/dashboards.md`): none filed; kit gaps go to the kit owners in the report (CodeBlock's 12px label and 12.5px Copy under the 14px phone floor).
Forks this page deleted: Frame's `Console` (8 `title=` tooltips, a spring, a `setInterval`; now the page-local `ExampleConsole` shared with /authz and /base); Frame's `useLive`/`useSteps` (now a page-local timeout cycle gated on the Stage's pause); the hand-made `kn-btn` ask (now kit `Cta`); the motion `pathLength` draw (now CSS from first paint); the browser-default range input (now drawn on the deck); the yellow accent; the "01 / 06" counts above each part's h3 (now under the words).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are the live ones)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; ~~prices from `lib/plans.js`~~ n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: "GitHub" → github.com/hanzoai/dashboards is the hero's one page solid (`dashboards.hero`, `data-thumb`); "View on GitHub" (`dashboards.start`) after the console and "Deploy to Cloud" (`dashboards.close`) each own their view. Decision: since 7 Nov 15:01 the header's "Try Hanzo" is always solid (SYSTEM.md §5), so the page keeps one solid of its own per view.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches its `#main` mark
- [x] Every link through `A` or `Cta`; every card a real link
- [x] ~~Breadcrumb at depth 2 or more~~ n/a: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity links 12/12 (the console's eight product links, hanzo.team, the repo, Logs, Metrics, deploy).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] ~~`PageHero`~~ the kit's `KeynoteStage` (h1 52px at ~38%, nothing above it; the kicker sits under the ask)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip (the four marked words), console, graphite close, footer
- [x] ~~Card-to-page links use Morph~~ n/a: no card opens into a page

Done here: At first paint by CSS: the title cuts in, the saved query types itself (four lines, 0.2 s then 0.3 s apart) and its chart draws (1.2 s). JS off at 1470 and 375: every part's words show (the pinned board is `.js` only; the stacked board stands beside them); the only hidden text is the JS-only rail numbers and the console caption of an unselected row.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` or hand-made `kn-btn` ask
- [x] Sticky ask in header ("Try Hanzo"), and the phone bar carries "GitHub" after the hero (SYSTEM.md §5)
- [x] Copy button copies exactly the displayed text (the close's kit CodeBlock)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `data-cta` ids: dashboards.hero (thumb), dashboards.start, dashboards.close. The phone shot shows the quiet "GitHub" bar once the hero ask has gone by.

## 5. Trust and proof
- [x] No logo; no seal; no invented number
- [x] Every figure traces to Hanzo's copy
- [x] ~~Marquees~~ n/a: none
- [x] ~~Privacy link by every submit~~ n/a: no form

Done here: The only figure is Hanzo's "4 stars". Charts, bars and the score row are drawn and print no values (the score axis shows 1–5 positions only).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] ~~Tables, FAQ, tabs~~ the hero's four saved-query tabs are page-local (kit Tabs uses a layoutId pill, which the Stage's scroll scale breaks, per KeynoteStage's note); code is the kit CodeBlock
- [x] `python3 scripts/parity.py /dashboards`: 0 missing

Done here: Parity text 69/69, links 12/12. Phone audit at 375: no text under 14px outside 12px mono labels. Sizes: h1 52/40, headings 26, part titles 26 (21 on phones), body 16, query 17/16 mono, the four words 44 Air (32 phones).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; deck greys only
- [x] No label, tag, badge or pill above a headline
- [x] Radii 6/8/12/16/24/999; no shadow; never outline plus fill
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste OK. Replaced #fbfbfd #dcdce1 #efeff2 #f5f5f7 #8e8e93 #d1d1d6 #ececf0 #f0f0f3 #a1a1a6 and the yellow marker (now silver #e5e5e5); removed 5 shadows (panels, tabs, switch, bars). Status is shape: over-threshold points fill, the active panel gains an ink outline, "watched" fills its ring, the 4th score bar is hatched.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] ~~Dialogs~~ n/a: none
- [x] No browser-default control; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: Tabs and the widget/monitor switch move by arrow keys (roving tabindex), press .97 at 90 ms, focus `2px solid var(--focus)`. The slider is drawn (2px #d4d4d4 track, 20px ink thumb, 44px tall) and greys out when disabled. 0 `title=`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] ~~Sound~~ the shared kit plays on kit controls; no page sound added

Done here: `variety.py` OK (useScroll, pathLength). Kinds: idle (the query cycles every 3.8 s while seen), time (typing), pointer (drag the alert line), state (tabs, switch), arrival (cut-in, marks drawn), scroll (board build). No springs; deck curves, 90–500 ms, line draw 1.2 s. The cycle stops on the Stage's pause and when a tab is chosen.

## 10. Media
- [x] ~~`Film`/`Pic`~~ n/a: no Hanzo image or film; objects are drawn product UI
- [x] ~~Videos~~ n/a
- [x] ~~Budgets, alt~~ n/a
- [x] ~~Photos~~ n/a

Done here: Every section's object is product UI drawn in SVG/CSS: the saved query and widget, the board, the monitor, the marked words, the console, the prompt.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Audit: 320 sideways none, phone targets under 44px none, sweep desk/phone sideways none. Phones get each part then its panel (both layouts are in the HTML and the breakpoint picks one, so nothing swaps after hydration). The ask ends near y≈200 at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] ~~Forms~~ n/a; the slider has a visible label ("alert line")
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Muted text #525252 on #fafafa/#f5f5f5 panels; #737373 only on white; #a3a3a3 and white 78% in the graphite close. Headings 1, 2, 3×12 (six desktop, six phone), 2, 2, 2 with no skips. The hero's tabs are a real tablist with a tabpanel.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: First-screen motion is CSS on server HTML; the only timers are a timeout cycle while the hero is seen and the console's one build. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (`content/pages.json`)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses
- [x] Every card is a real link

Done here: "Hanzo Dashboards — Hanzo AI" and Hanzo's description via `app/dashboards/page.jsx`; canonical and og:url `https://hanzo.ai/dashboards/`.

## 15. Catalogue and product pages
- [x] ~~Model card~~ n/a: not a catalogue or model page
- [x] ~~Morph~~ n/a
- [x] ~~Maker and model links~~ n/a
- [x] ~~Price~~ n/a

Done here: Cloud product anatomy: identity (Stage), the console, openable parts (the board), the Get block.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the close's agent prompt)
- [x] ~~Config parses~~ n/a: no config block
- [x] ~~Terminal~~ n/a: the saved query is aria-hidden demo, not a terminal
- [x] No hand-typed version number

Done here: The prompt "Read https://hanzo.ai/skill.md and use Hanzo Dashboards in my project. Start with: hanzo o11y dashboards list" copies exactly as shown.

## 17. States and resilience
- [x] ~~Loading, empty, error, offline~~ n/a: no live data or form
- [x] Blocked live data leaves a complete page, no console errors
- [x] ~~Failed submit~~ n/a
- [x] A thrown island does not blank the page

Done here: No fetch on the page; film and sweep: 0 console errors at desk and phone. Paused, reduced-motion (board in place, query typed) and JS-off states each read as finished.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through the kit `Cta`
- [x] Nothing identifier-bearing before consent
- [x] `V2: 8/10 …` in the page file's top comment
- [ ] Review read: no `docs/review/dashboards.md` yet

Done here: Gallery `docs/gallery/dashboards/` (desktop.mp4, desktop.jpg, phone-1..3.jpg). Own score 8/10; the critic's verdict decides.
