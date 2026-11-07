# /world coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/World.jsx` · gallery: `docs/gallery/world/` · metric id: `cta_click:world.primary`

Open copy questions for James: none: every visible word is Hanzo's. Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only.
Shared changes requested (`docs/requests/world.md`): StageHero's phone pin keeps its sticky `top` offset (worked around in World.css); the footer hydration mismatch the critic logged.
Forks this page deleted: the blue arcs and cyan accent (greys now), the blinking monitor lights, the centred hero shared with /search.

Measured on the dev server at 1470×801, 375×667 and 320×640 with `audit.cjs` (Playwright), JS on and off.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a team running models in production who wants one view of them; the one ask is Hanzo's "Open World Monitor" (`data-cta` primary in the hero, "close" as the later solid), metric `cta_click:world.primary`. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. "Free for the first million events / month." is Hanzo's line, printed as written. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /world is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. 6 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /world` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is side (copy at left, the globe at right), dark; the object is a turning globe with requests arcing to the GPUs that served them, and latency by model ticking, so the globe turning from paint moves within the first second. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo World" at opacity 1, 0 hidden headings or paragraphs. Rooms: hero (dark) → the control room of six monitors (light) → closing band (dark). One in, one out: on desktop the globe shrinks to .9, rises 24px and slows its spin as the hero leaves, then the room pins (about 3 screens of scroll) with one large monitor on air at a time beside the heading, a rolling 64px "0n" figure and a numbered rail of six; scroll swaps the monitor (rise and clip in, the old one rising out) and the room hands straight to the band with no white gap. Phones and reduced motion stack the six (7/5, 12, 5/7, 12 on a wide screen, never three equal boxes). The live page has no proof strip, so it ends on the band and the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, primary-2, close*, close-documentation, deploy (* = solid). The header carries the sticky ask at every width; the page bar is off (`data-ask="off"`) because the critic's shared note (15:00) fails any pill seen over content. Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No partner logos; product names appear as text only. Parity holds every printed figure. Demo values (counts, offsets, machine names) are labelled examples in the header comment and drawn as objects, not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /world`: 0 missing

Done here: Small text: 0 runs under 13px on desktop, 0 under 14px on the phone (mono capitals excepted). Sizes follow the deck: h1 52px (40 phone), section heads 26px, h3 17px (21px only on the monitor on air), lede 20px, body 15px, the on-air figure 64px Air, growing only in their moment. Replay step labels wrap to two lines instead of ellipsis (0 truncated labels at 1470 and 375; the only clipped node is the screen-reader name of the range). Lede 44ch, body 66ch, headings balanced. Code: the agent prompt in the band. Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS and the Cloud 4 shared files; only the deck neutrals and `#e4e4e7`. Captions sit under headings. Radii 6, 8, 12, 16, 20, 24 (28 on the search composer only); objects are outlined with a hairline and carry no shadow. Icons are one inline 16px stroke set. /search keeps the centred hero; World is side and dark.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover)`: the hero ask turns brand silver `#e4e4e7` and leans toward a fine pointer (at most 8px, from 22px out); a monitor draws a hairline across its header; a rail stop inks and its title steps 6px right. Press is scale .97 to .98 in 90 ms; focus-visible draws a 2px ink or white ring; disabled controls drop to 40%. Nothing on the page loads data, so no loading state. Dialogs: none. Inputs: the replay range input (labelled "Forensic Replay"). Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: every model, everywhere, live (canvas globe). Supporting: latency bars ticking (time), the pinned control room (`useScroll`, the only counted technique: scroll picks the monitor on air), topology trace on hover or press (pointer), replay scrub (state), magnetic hero ask (pointer). Each monitor plays one moment as it comes on air (desktop) or scrolls in (phone, once): its h3 cuts in by line mask; topology nodes appear 60 ms apart and the paths draw edge to GPU; latency bars grow 60 ms apart and the cost-spike dot blinks; the drift line draws in 900 ms and the alert dot lands and blinks; v2 fills and "pinned" slides in; the five clouds gather and "One unified view" wipes in; the replay steps rise in. Transform, opacity and clip-path only; deck curves (0,0,.2,1 / .4,0,.2,1 / .16,1,.3,1) and 90 to 500 ms, 900 ms for line draws. `scripts/variety.py` OK (0 fade-ups). Kinds: idle, time, state, pointer; scroll is the pin and the hero exit only. Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion: stacked room, every drawing whole, `getAnimations()` 0 after 3 s at both sizes. No springs.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML, SVG and one canvas; each loop over 5 s carries a 44px pause button (1 on the page): the hero globe and panel (one pause for both).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Overflow 0px at 375 (scrollWidth 375 after a full walk). 0 controls under 44px at 375 or 1470. Phone hero: the globe sits at 64% width to the right, partly off-canvas behind the ask, and the latency panel starts 40px under it, so the h1, ask, globe and panel header are all inside the first 660px; the pause button lives in the panel's header row, off the art. The pinned room stacks below 900px, each monitor playing its moment once as it scrolls in; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Lowest measured text contrast 7.11:1 (0 runs flagged). Headings 1233333322 with 0 skips. Pause controls: the hero globe and panel (one pause for both, first in the object's DOM, in the panel header). Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs. In the pinned room the monitors off air are `inert`, and the rail's six buttons (`aria-current="step"`) jump to any monitor, so the keyboard reaches all six.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /world/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. 0 console errors at both widths, with and without reduced motion; the Replay range renders after mount (a still track of the same size in the server HTML), which removes the hydration mismatch on its style.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo World — Hanzo AI". Canonical https://hanzo.ai/world/, og:url https://hanzo.ai/world/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity, the globe as console, six monitors, the band. Prices: "Free for the first million events / month." is Hanzo's line, printed as written.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: the agent prompt in the band. The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network still shows the whole page; JS off was checked above. Each demo is its own component; the page has no shared runtime state to lose.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/world.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/cloud/World.jsx`. Last critic verdict on file: 6/10 (`docs/review/world.md`, the static six-tile room); fixes 1 to 7 and 9 are in, 8 in part (the globe exits; the panel does not dock into the room); this version waits for the next walk.
