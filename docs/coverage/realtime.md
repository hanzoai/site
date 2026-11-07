# /realtime coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Realtime.jsx` (+ `Realtime.css`) · route: `app/realtime/page.jsx` · gallery: `docs/gallery/realtime/` · metric id: `api_key_created`

Open copy questions for James: none decided. Listed: on desktop the header takes this page's ask ("Start Building", checked at 1470 once the hero scrolls by), but on phones the shared header keeps "Try Hanzo" all the way down while the bar says "Start Building" (shared header; requested in `docs/requests/pricing.md` item 1); the handshake room says "Three calls, then it is live" and the strip before the close says "Two calls and the page keeps itself current" (both kept word for word); the demo's drawn product words ("rule reads b", "heard", "told · delete b", …) are not in `content/ui-strings.json` yet.
Shared changes requested (`docs/requests/realtime.md`): Frame's Code on the deck; light-code comment contrast in the kit; the sticky ask label and the floating desktop pill; a press on `lx-text`; `Copy` press .97; the UI-strings register; `lib/cta.js`, `lib/track.js` and the sound kit; the PinnedChapters rail with eight chapters on phones.
Forks this page deleted: the three equal client boxes (now a desktop, a tablet and a phone of three widths), the mono-caps "Live record updates" label (now the lede), the "View Documentation" outline button (now a text secondary), the always-open handshake paragraph and three always-open call notes, the three always-open growth notes, the 32px statement, the 50px growth figures, the 52px "What happens as it grows" and "Two calls…", the live-dot pulse (a second continuous mover), the elastic rail overscroll, the arrow nudges on hover, the header "Try Hanzo" override in page CSS, every spring, every raised shadow and every Apple-grey literal.

The overload (round 2's 7.5, "the handshake paragraph, three growth notes, another two-calls block before the close") is fixed by presentation, with every word still in the HTML: the handshake shows one call's words at a time in one slot beside the wire, and "The handshake, in full" is a native disclosure (find-in-page opens it; works with JS off); growth opens one note at a time beside the tenant map, its figure growing from 21 to 32px while it is the moment; "Two calls…" is a calm strip at section-heading size, so "Get Realtime" is the one big thing at the end. With JS off every call note and growth note reads in order under its title.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label is Hanzo's live hero label)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Realtime.jsx` and `app/realtime/page.jsx` open with Persona (Developer), Goal (an API key and a first stream), CTA ("Start Building" → platform.hanzo.ai/api-keys, `realtime.hero` / `realtime.close`), Metric (`api_key_created`), Signature, Beyond and `V2:`. `fs-audit.cjs` counts one solid ("Start Building") at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets `#main`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is the kit `A`; the card "Subscribe to your first collection" is one real `<a>` (`RelatedCards`). `parity.py /realtime`: 4/4 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is `LineMask` h1 + lede + one ask + the three clients); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the spec rows are the quiet proof, then `LaunchClose`: "Get Realtime" grows 26 → 64px)
- [x] Card-to-page links use Morph; title lands within 12px (n/a: the one card leaves the site for GitHub)

Done here: First screen at 1470×801: the two-line h1 (52px), the three clients settling (y ≈ 290–690) and "Live record updates" + "Start Building" + "View Documentation" beside them. The first record change lands within 0.6 s (`fs-audit.cjs`: 7,730 changed px in 0.9 s, 5,606 on phone), nothing above the h1. `c3nojs.cjs`: 0 hidden text runs with JS off. Order: hero, the living graph ("What the stream gives you"), statement + subscribe, the rail, the black room, growth + spec, the strip, the close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's `lx-cta` stands in at 48px until `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (the site's `Ask.jsx` bar carries "Start Building" from `data-thumb`; the header's own label is a shared request)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy` in Frame's Code)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero ask `data-cta="realtime.hero" data-thumb="Start Building"`, close ask `realtime.close`; `data-ask-name="Hanzo Realtime"` on the hero section. "Start Building" and "Documentation" in the strip are text links, so the solid appears only in the hero, the bar and the close.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: Figures are Hanzo's (thirty seconds, a limit of two, the three calls). The grant's countdown in chapter seven shows Hanzo's thirty seconds being spent; record letters, ids and org names are drawn, said so in the header comment.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (code: Frame's `Code`; the disclosure is a native `<details>`)
- [x] `python3 scripts/parity.py /realtime`: 0 missing

Done here: `parity.py /realtime`: 138/138 text, 4/4 links. `c3pal.cjs`: 0 runs under 13px on desktop and 0 under 14px on phone. Scale: h1 52, intro 44, chapter titles 32, headings 26, the growth figure 21 → 32, spec words 32 Air, lede 20–21, body 16, h3 17, code 13.5/1.65. `c3slot.cjs`: every one-at-a-time slot holds its longest note at 1920, 1470, 1024, 900, 768, 375 and 320 wide.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; `c3pal.cjs`: 0 computed colours off the deck at both widths. The graph tile is flat #f5f5f5 and the tenant map outlined (1px, radius 24), the wire a flat #171717 tile, the subscribe call white with one hairline, use cases flat #f5f5f5 at 24 with 8px inner art (concentric), nothing shadowed. Two-part sections sit on the 8/5 split, bottom-aligned. The graph names every node and, when lit, its links, each with a #f5f5f5 halo, and its rests keep every name clear of the others. Hero medium: three devices of three sizes receiving one record, unlike any neighbour.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled/loading: nothing waits on a network)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink plus a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog; the disclosure is native `<details>`)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none)
- [x] Forks this page deleted: listed at the top

Done here: Rule switches (`aria-pressed`), the three calls and growth figures (`aria-expanded` + `aria-controls`), the disclosure, rail arrows and pauses are real controls; hover changes ink, edge or fill inside `@media (hover:hover)`; press is .97 for 90 ms (text links too). `c3rt2.cjs`: a rule switch flips, a call opens its words and marks "subscriptions" in the wire, the disclosure opens, a hovered figure opens its note and adds the fourth tenant, the rail moves 822px, 0 console errors from this page (one walk saw a hydration warning from the shared footer under load; single loads are clean). Each client's list now has a fixed height (148px desktop, 112px phone), so a create or delete moves nothing below the hero (probe CLS 0 at 1470, 375 and 320; the earlier phone walk measured 0.051 before this fix).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature `graph` (MOTION-MAP, 7 Nov), second screen: "What the stream gives you" is a living graph (`realtime/RtGraph.jsx`, SVG, one rAF loop only while seen and unpaused) of one deployment's parts: delete · b, one store, API, access rule, org a · broker, org b · broker, GET /v1/realtime, grant, deployment, subscriptions and three clients, joined by named links (reads, messages, guards the API, filters the stream, ?token=grant, limit 2, orders/ord_42, text/event-stream). As it comes into view the nodes fly out from the middle and settle like a physics graph (heavily damped, no bounce, about 1.2 s); records then ride it by themselves (create a, update b, delete b: store → org broker → the stream → clients; anything about b stops at org b's broker and client 3 reads "not told"). Pointing at a node lights its links and names them and the panel beside it reads that part's words; tapping or focusing a node (or one of the eight 44px dots) picks it; untouched, the graph tours its parts every 4.8 s; a mouse can pull a node and the graph settles back. All eight facts are in the HTML in one grid cell, so the panel never changes height. Removed: the pinned eight chapters (PinnedChapters + ChapterClients + the unused stream map), the hero's scroll settle (SettleStage) and the black room's timed wipe (ClipWipe), so the h1 cut-in is the page's one reveal. Kept: the three screens and rule switch, layout glides, the drag rail with inertia and hard stops, the handshake calls, growth notes, "Get Realtime" growing. Reduced motion (read after hydration): the graph rests settled at "delete · record b", no records moving. JS off: the graph is hidden and the eight facts read in order. Checked at 1470×801, 375×812 and 320: 0 console or page errors (reduced motion too), CLS ≤ 0.001, no sideways scroll. Entrances (MOTION-MAP, `realtime/RtEnter.jsx`, one per section, once): shrink-to-card (leaving the hero, it settles into a smaller grey rounded card, scroll-linked), tile-flip (white tiles over the graph turn edge-on one diagonal at a time), card-deal (the use cases start as one deck on the first card and are dealt to their places), vertical-ticker (each growth spec row's figure and line ride up from under the row's edge), venetian-type ("Two calls and the page / keeps itself current", its line and links slide in from alternating sides). Final state in the server HTML; armed only after mount and only below the fold; reduced motion skips all; a walk to the footer leaves nothing armed at 1470 or 375 (probe, 7 Nov); CLS 0.0000 at 375, 0.0002 at 1470.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: no Hanzo photo or film for Realtime)
- [x] At most 2 videos playing; pause button on loops over 5 s (four 44px `LivePause` controls: screens, map, wire, tenant map)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: Hanzo has no Realtime media)

Done here: Objects are product UI (three clients, the living graph, the subscribe call, six use-case vignettes, realtime.js, the tenant map). The "Open a stream" card no longer repeats the close's contour: its picture is the hero's idea drawn in three lines (three clients' timelines with the same record landing on all three at once, carried along together on hover), so the close's Sigil from [30, 3, 2] is the page's one contour.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: No sideways scroll at 375 or 320 (check, 7 Nov); the ask's bottom at 259px at 375×667 (measured 7 Nov). The graph has its own tall layout on phones (360×620) with rests spaced so no name touches another; the stream hub's seven link names are left to its panel there, since they cannot fit round one hub at that width. Hover previews have tap paths (nodes are buttons; tapping one opens its words).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: `c3pal.cjs` measures every text run on its real background: 0 under 4.5:1 at both widths (#737373 resting figures and code comments on white 4.74:1, white 78% notes and #a3a3a3 call titles on #000). Headings: h1; h2 (intro), h3 ×8; h2 (uses), h3 ×6; h2 (room), h3 (disclosure); h2 (growth), h3 ×3; h2 ×2 (strip); h2 (close). Rule switches carry full names ("Client 3's rule can read record b").

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Every screen's first frame is in the server HTML; timers are timeout chains (`useBeat`, `useSteps`) that stop off screen and when paused; motion is transform, opacity and clip-path only. Filming and audits ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/realtime/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/realtime" />`; the card is a real `<a href="https://github.com/hanzoai">`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph (n/a: the one card is external)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: Cloud product anatomy: identity (h1, line), the product at work (three clients), openable features (the eight parts of the living graph, the calls, the notes), three spec facts, the close. The eight facts are read from the graph's nodes (no pinned scene). Phone h1 decision: 34px on two lines rather than MASTER's 40px on three, so the ask and the three clients start inside the first screen (noted here per MASTER §0.6). The use-case rail's drag and arrows share one measured hard stop, and a card answers hover (fill, its picture lifts 6px).

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (Frame's `Code` copies exactly what it shows)
- [x] Config blocks parse on their own (n/a: no JSON config)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal; the wire's step marker pauses)
- [x] No hand-typed version number

Done here: The subscribe call and realtime.js are 13.5px/1.65; pressing a call marks its line in the wire (`/v1/realtime/token`, `subscriptions`, `render(record)`). No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Cursor and Phone boundaries belong to the shared layer)

Done here: The product's states are designed in the demo: connected, a dropped network reconnecting, heard and not heard, told and not told, a grant counting down and spent, a deployment at its limit with a tenant waiting. `look2.cjs` and `c3rt2.cjs` log 0 errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: it does not exist yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/realtime.md` (7/10 on the walk before this build). In this build the pinned chapters are shorter (42 per step, was 66: about 3,500px instead of 5,559), "Deletes are checked too" is the run's scale moment (the three clients grow 12% while it is the chapter), and the empty bands after the pin and under the growth list are cut. The close's ask is the shared `LaunchClose` (its magnetic pull is that component's; not claimed for this page). CLS after the change: 0.002 at 1470, 0.001 at 375 and 320.

Done here: `realtime.hero` and `realtime.close` are set; `V2:` heads `Realtime.jsx`. Review: `docs/review/realtime.md` marked Ready 7 Nov (slice D) after the graph's crowded hub was re-spaced, the gap under the graph closed and the card's art made the page's own. Gallery: `docs/gallery/realtime/` (d.jpg, p.jpg, d-graph.jpg, d.mp4). Checks: 0 console errors, no sideways scroll, parity 0 missing, taste OK, unique OK.
