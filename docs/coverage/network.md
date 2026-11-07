# /network coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Network.jsx` (+ `.css`) · route: `app/network/page.jsx` · gallery: `docs/gallery/network/` · metric id: `api_key_created`

Open copy questions for James: none decided. Two to confirm: (1) the live page sets "Compute Marketplace" as an eyebrow over the h1; MASTER part 7 moves it, so it names the fabric's toolbar here, words unchanged; (2) "Buy Compute" is the live hero label and links to the docs (https://docs.hanzo.ai/docs/network), not to a purchase flow, so it is kept as the one ask with its live href.
Shared changes requested (`docs/requests/network.md`): Frame's Paste on the deck (page-local overrides until then); `Copy` press to .97; the desktop ask bar floats over content; a hue in the shared nav icon; the pinned chapter count above the h3; `lib/cta.js` and `lib/track.js`.
Forks this page deleted: the floating "Compute Marketplace" panel with its shadow over the map, the white radial wash under the lede, the 128px title's text-shadow halo, the springs on the picker, lend toggle and placement tag, the shadows on the blocks, pills and packet, the opacity fade on settled blocks (it failed contrast), the hairline-plus-fill on the black room's ends, the arrow that slid on hover, the peer that scaled on hover, the 56px card titles, every Apple-grey literal (#6e6e73, #c7c7cc, #f2f2f5, #ececf0, #f5f5f7, #161618, #2c2c2e, #1f1f22, #a1a1a6).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label and href are Hanzo's live hero ask)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Persona: Developer who needs compute · Goal: buy compute on hanzo.network · CTA: "Buy Compute" → docs.hanzo.ai/docs/network · Metric: api_key_created`, plus Signature, Beyond and `V2:`, head both `Network.jsx` and `app/network/page.jsx`. `fs-audit.cjs` counts one solid ("Buy Compute") on the first screen at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets the one `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is kit `A`; the two ends in the black room are real `<a>` cards (platform.hanzo.ai/api-keys, /node). `parity.py /network`: 5/5 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is the kit's `LineMask` h1, the lede, one ask and the live fabric); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (`LaunchClose`: Sigil, "Get Network", the one ask, licence and repo)
- [x] Card-to-page links use Morph; title lands within 12px

Done here: The first screen is the 52px title, lede and ask on the left five columns and the fabric on the right eight, its toolbar in its own frame under it; nothing sits over the map or the words. `fs-audit.cjs`: 2,537 px change in 0.9 s with no input (desktop), 984 (phone), nothing above the h1. JS off: an `html:not(.js)` rule lays the six blocks out in order beside the six chapters. Rooms: hero, pinned chain (tall), black room, paper paste, close. "Provide Compute" carries `data-morph` into /node's `data-morph-target` hero.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's 48px `lx-cta`; swapped when the deck `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label (the site's `Ask.jsx` reads `data-thumb`)
- [x] Copy button copies exactly the displayed text; failure never says Copied (Frame's Paste and the lend toggle use the kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask has `data-cta="network.hero" data-thumb="Buy Compute"`, the close `network.close` with the same thumb; `data-ask-name="Hanzo Network"` sits on the hero section inside `<main>`. "Copy hanzo fabric join" copies exactly the command shown.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The only figure is Hanzo's "a tenth" of the block reward (one ink cell of ten). Peers, routes, hashes and the strand are drawn and labelled so in the header comment; no seal, no logo strip.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a for tables, FAQ and tabs: none; the code is Frame's Paste)
- [x] `python3 scripts/parity.py /network`: 0 missing

Done here: Parity 37/37 text, 5/5 links. Type rests at the kit sizes: h1 52, chapter intro 44, chapter titles 32, the black room's heading 26 and its two ends 32, lede 20, body 16, captions 13 (12px only for Zen Mono capitals). The "01 / 06" counts are set under each chapter title as a caption.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; values are #0a0a0a, #525252, #737373, #a3a3a3 (on black and graphite only), #d4d4d4, #e4e4e7, #ededed, #f2f2f2, #f5f5f5, #171717, #262626, #000. Blocks are 1px hairlines on paper, the ends flat #171717 tiles, nothing has a shadow; radii 24/16/12/8/6/full. Neighbour /node opens on a product card on the left with copy on the right, a graphite terminal and a quiet room; /network opens on a graph to the right of the copy, a chain of blocks and a black room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled and loading: nothing here is ever unavailable or fetches)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink with a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none; every hover is inside `@media (hover:hover)`)
- [x] Forks this page deleted: listed at the top

Done here: The model picker (`radiogroup`) and lend toggle (`aria-pressed`) are segmented controls on a flat #f2f2f2 track: hover fills #e4e4e7, press .97 in 90 ms, the white pill slides 300 ms ease-emphasis. The ends deepen #171717 → #262626 on hover. 44px targets throughout.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature: the request walking the fabric (idle, the one continuous mover, pausable). Supporting: the sliding pill (state), the strand the pointer sends a request down (pointer, line art 1.4 s ease-in-out), the chain whose settled blocks step back and shrink 4% each (scroll). Pointer also previews any peer's route; arrival is the cut-in title and the black room's wipe; scroll-linked moves are 2 of 8. `variety.py` OK (layoutId, useScroll, pathLength); no springs, no `setInterval`; durations 90/150/300/400/500 ms. Scale rhythm: the map grows to 1.16 as you leave the hero, settled blocks shrink, "Get Network" grows to 64.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (n/a: Hanzo has no Network photo or film)
- [x] At most 2 videos playing; pause button on loops over 5 s (the fabric's 44px pause is first in its toolbar)
- [x] Budgets met; nothing missing; alt on every image (n/a: no images)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no media)

Done here: Every object is drawn product UI (the fabric, six blocks, the strand and two ends, the agent prompt) plus the close's Sigil from `family.js` figures [10, 6].

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Phone order is title, lede, ask, then the full-width fabric (240px) and its toolbar; the ask sits at y≈300. In the chapters the chain sits in a 38svh window as a stack of card edges and `pinchk.cjs` passes 7/7. The route preview is pointer-only; the tap path is the model picker. No sideways scroll at 320 (the map is clipped by the hero).

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: #737373 on white 4.74:1, #525252 on #f2f2f2 7.0:1, #525252 on #f5f5f5 7.4:1, #a3a3a3 on #171717 7.1:1 and on #000 8.3:1; the probe finds 0 runs under 4.5:1 (settled blocks no longer fade). Headings: h1, h2 (intro), h3 ×6, h2 (black room), h2 (close). The fabric is `aria-hidden`; its answer line is `aria-live`.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (n/a for media: none)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 is real text cut in by CSS at first paint. The walk is a `setTimeout` chain that stops off screen, when paused, or while you point at a peer. Motion is transform, opacity, stroke and clip-path; filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/network/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/network" />`; both ends are real `<a href>`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [x] Every card opens by Morph ("Provide Compute" → /node carries `data-morph`)
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: A cloud product on the shared anatomy: identity (title and "Compute Marketplace"), the live object, six openable facts, the two ends, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt and the lend command copy exactly what they show)
- [x] Config blocks parse on their own (n/a: no config block)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal)
- [x] No hand-typed version number

Done here: `hanzo fabric join` / `hanzo runner` and the agent prompt are the code on the page; each Copy writes the displayed string. No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Phone and Cursor boundaries are the shared layer's)

Done here: The fabric's own states are designed: routing, a peer with the model loaded, a placement for a model nobody has, a previewed peer with "nothing loaded", paused. look2 and the probes log 0 console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: not built yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/network.md` verdict 8 or more (pending: no verdict had landed at push time)

Done here: `network.hero` and `network.close` are set. Gallery: `docs/gallery/network/d.mp4`, `d.jpg`, `p.jpg` (filmed with `film.cjs`, no errors). My own score is 8/10; the critic's verdict decides.
