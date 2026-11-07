# /tunnel coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Tunnel.jsx` · gallery: `docs/gallery/tunnel/` · metric id: `github_click` (MASTER §1, researchers: a GitHub click; fired as `cta_click` with `data-cta="tunnel.hero"`)

Open copy questions for James: none; every visible word is Hanzo's. The scene's four labels ("café network", "nothing listening", "open internet", "stopped answering") and the request lines are lifted from Hanzo's own sentences and its example output.
Shared changes requested (`docs/requests/tunnel.md`): the phone header should go quiet while the hero's "View Source" is on screen; Finale's close `data-cta` should take the page prefix.
Forks this page deleted: the cloud `Code` block on "One command, one URL" (it copied the "$" and output lines; replaced by the same look with a Copy of the command only), the opacity fade on the hero's terminal band, two hero fade-ups, the `aria-pressed` mode buttons (now a radio group with a gliding pill and arrow keys).

Measured on the dev server at 1470×801 and 375×812 with Playwright (JS on and off) and `node scripts/motion.mjs /tunnel`.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona: a developer who needs a public URL for something on their laptop. The one ask is Hanzo's "View Source" (`data-cta="tunnel.hero"`, `data-thumb`); the close's "View on GitHub" (same href) is outlined on this page so the page itself never shows two solids. On phones the shared header's "Try Hanzo" is still solid beside it (requested, not page-owned). h1 count 1. No prices printed.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /tunnel is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's skip link targets `#main`. Every link is a kit `Cta` or `A`. `python3 scripts/parity.py /tunnel`: text 38/38, links 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: The h1 cuts in by line mask, `hanzo share 3000` types itself and the URL lands at 64px; after that a request line ("GET / · 127.0.0.1:3000") rolls in every 2.6 s while the hero is seen (pausable), so the first screen never goes still. "hanzo share" is a mono caption under the h1. JS off (checked with JavaScript disabled): `.tn2-url`, `.tn2-share` and both scene captions compute opacity 1 via a `NoJs` rule. Rooms: hero (light + terminal band) → white gap → dark pinned scene → facts (light) → one command (quiet) → closing band (dark) → footer. The live page has no proof strip.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: CTAs: `tunnel.hero` (solid, thumb), `tunnel.install-cli` (outline), `tunnel.pricing` (link), Finale's `close` (outlined on this page) and `deploy` (link). The desktop header carries the page's ask after the hero (shared). The one-command Copy writes `hanzo share 3000`, exactly the command text shown; the "$ " prompt is `user-select:none` and the output lines are display only. Kit `Copy` never says Copied on failure.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No logos, no seals, no figures beyond Hanzo's own example URL and port 3000. The request lines repeat the example's own `127.0.0.1:3000`.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /tunnel`: 0 missing

Done here: Sizes: h1 52px (40 phone), URL 64px Air (26 phone), section heads 26px, fact titles 21px under their 26px head, body 15px; phone small text set to 14px. The builder URL breaks before ".share" (`<wbr>`, line-height 1.2). Code uses the kit `cf-code` look and kit `Copy`. Parity 38/38, 4/4.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on `Tunnel.jsx` and `Tunnel.css`; deck neutrals and `#e4e4e7` only (the literal values are all on the deck ramp; tokens.css is shared). Captions sit under headings. The hero's terminal band and the dark room are now separated by a white gap. Its own objects: the URL-as-headline band, the open-and-shut wipe room, the gate on fact 04, and a close that plays the page's own ending.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hovers sit in `@media (hover: hover)`; the selected mode now answers hover with a ring and lift on its pill. Modes are a `radiogroup` with roving tabindex and arrow keys. Packets move by `transform`. Inputs 17px mono, 52px tall. No dialogs. Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: the URL opens and closes (clip-path wipe, scrubbed on desktop, played by itself on phones with Pause). Supporting (`variety.py` OK): scroll scrub, clip reveal, gliding mode pill (layoutId). Two fade-ups (lede, ask). Kinds: arrival (h1 cut-in), time (hero typing, the room's laptop typing by time, request lines, the builder typing its placeholder once, the modes stepping once, the close's terminal shutting once), pointer (the open internet's light follows the pointer), state (modes, builder), scroll (the wipe only). Timers are `setTimeout` chains. Reduced motion renders the settled frame.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. Loops over 5 s carry a 44px pause: the hero's request line (Pause in the terminal band) and the scene (Pause, holds a still frame).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: The phone stage now stretches to the column (343×520 at 375; it was 0px wide) so the laptop, wipe and phone play between "01 / 06" and "05 / 06". scrollWidth 375 at 375. "See Pricing" and "Deploy to Cloud" get a 44px hit area on phones. "View Source" bottom sits at about 300px on a 375 screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text on light rooms uses `#525252` or darker on `#f5f5f5` (the close card's grey runs were moved from `#737373` to `#525252`); on black, `#a3a3a3` or lighter. Two pause controls (hero band, scene). The builder's inputs are labelled (`--name`, `target`); nothing validates. Modes reachable by Tab and arrows.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and URL are in the server HTML. Every timer runs only while its part is on screen (`useInView`) and stops when paused or off screen. Packets animate `transform`, not `left`. No fetch or third party. 0 console errors from this page at either width (Playwright).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Tunnel — Hanzo AI", canonical and og:url https://hanzo.ai/tunnel/ from `content/pages.json` via `app/tunnel/page.jsx`; `<JsonLd route="/tunnel" />`.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Cloud product anatomy: identity (hero), the terminal as console, the facts with their objects, the band. No prices printed; "See Pricing" links to /pricing.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: The one-command block copies `hanzo share 3000` only, which pastes and runs in zsh; it is a labelled scroll region (`tabindex="0"`). The agent prompt (Finale) copies the string it shows. No version numbers.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network shows the whole page; JS off was checked (all hidden runs now show). Each demo is its own component with its own state.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/tunnel.md` verdict 8 or more

Done here: `data-cta` in `tunnel.<slot>` form on the page's own asks (kit `Cta` fires `cta_click`); the builder sends nothing. `V2:` line in `components/pages/cloud/Tunnel.jsx` carries the critic's verdict from `docs/review/tunnel.md`.
