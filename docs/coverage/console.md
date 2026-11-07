# /console coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/ConsolePage.jsx` · gallery: `docs/gallery/console/` · metric id: `api_key_created`

Open copy questions for James: none (every string is the live page's; "Console — Hanzo" and the six module names in the shell are product UI labels taken from Hanzo's own module headings).
Shared changes requested (`docs/requests/<page>.md`): none; `lib/cta.js` does not exist yet, so the ask label is the live hero's own "Open Console".
Forks this page deleted: the v1 hand-written `Hero`, the drag-to-reorder sidebar (`Reorder`), the `Get` block from cloud/Frame, raw `.x-btn` asks (now `BizAsk`), the v1 `Related` list, the duplicate desktop `AskBar` (the site's ask bar carries the ask).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices on /console)
- [x] Open copy questions for James listed, none decided

Done here: Header lists Persona (operator), Metric `api_key_created`, Goal, CTA "Open Console" → platform.hanzo.ai, Signature, Beyond, V2. The only solid fills are the hero ask and the close ask (`BizAsk`, `data-cta` console.hero / console.close); `lib/cta.js` is not on main yet, so the label is the live hero's own.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] ~~Breadcrumb at depth 2 or more~~ n/a: /console is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main class="bz cs">`; the layout's `#main` mark takes the skip link. Every link goes through `A`/`More`/`BizAsk` (the palette's products go through `href()` then `router.push`); parity shows 14/14 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1 (kit equivalent: h1, lede, one ask, hero object)
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the four open facts, then the close sentence with the ask, then the footer)
- [ ] ~~Card-to-page links use Morph~~ n/a: the fact cards open in place (BizOpen), they do not lead to another page

Done here: The black hero holds a 52px h1, one line, the ask, then the console window, which opens its palette and types within 1.5 s. The intro uses a CSS arrival (no Motion opacity in server HTML). Sections alternate: black hero → pinned chapters → palette → facts → Get → close.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (kit `BizAsk` until `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: `BizAsk thumb="Open Console" cta="console.hero"` feeds the site's ask bar (one bar at every width, `data-ask-name`), the close repeats it with `cta="console.close"`. The Copy buttons are the kit's (`Code`, `BizPaste`) and copy the shown text.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] ~~Marquees pause~~ n/a: no marquee
- [ ] ~~Privacy link beside every submit~~ n/a: no form

Done here: The four figures are Hanzo's own (/v1, OIDC, Per-org, OSS) with their live captions; the usage count in the shell is a count of the demo rows on screen, not a claim.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /console`: 0 missing

Done here: Parity 93/93 text, 14/14 links. Phone rules lift every 13px label to 14px (filmed with no small-text warning); code is the kit `Code` pane in greys.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: Every hex in ConsolePage.css is on the deck ramp (#000, #0a0a0a, #0f0f0f, #171717, #262626 … #ffffff); radii 6/8/12/16/24/28/999; the window is outlined, not raised; only the palette (it floats) takes the black-room float shadow. h1 52, section heads 26, figures 64 at rest (84 only inside an opened fact).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it (kit `BizOpen` traps and returns focus)
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hovers sit inside `@media (hover: hover)` and fill rather than lift; presses scale .97; focus rings are 2px ink (white in the black room). The palette input is 32px. Forks deleted are listed above part 1.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit

Done here: Signature: the self-driving shell (idle + time: typing). Supporting: Stage, chapters (scroll), open cards (state). No springs: arrivals 300ms ease-emphasis, the module pill glides 300ms ease-in-out; timers are `setTimeout` chains cleared on every change; `variety.py` OK. The page plays no sounds of its own.

## 10. Media
- [ ] ~~`Film` and `Pic` only~~ n/a: no image or film on the page; the objects are product UI
- [ ] ~~At most 2 videos~~ n/a: none
- [ ] ~~Budgets met; alt~~ n/a: no media
- [ ] ~~No dimmed photo~~ n/a: no photo

Done here: The page has no Hanzo films or images for the console; its hero object is the console window drawn in HTML (shell, palette, six modules).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Filmed at both sizes with width 375/375 and 1470/1470; on phones the window drops its rail and module column, the chapters stack (kit), and the ask sits at ~210px from the top.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (the palette input has an aria-label; no form submits)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text uses #0a0a0a/#525252/#737373 on white and #fafafa/#a3a3a3 on black; the window's Pause is a 44px `aria-pressed` button; the palette is a combobox with `aria-activedescendant`, and / focuses it.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 and hero copy are server HTML; motion is transform and opacity; the film runs only while the window is on screen (`useLive`) and stops on Pause. Filming ran in the cloud container.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link (the fact cards are buttons that open a panel; product links are `<a>`)

Done here: `app/console/page.jsx` keeps `metadata` from `content/pages.json` and `<JsonLd route="/console" />`, unchanged. MASTER lists console as `noindex,follow`: that is the shared SEO owners' setting, not changed here.

## 15. Catalogue and product pages
- [ ] ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- [ ] ~~Every card opens by Morph~~ n/a
- [ ] ~~Every maker and model page linked~~ n/a
- [ ] ~~One price figure everywhere~~ n/a: no prices

Done here: A cloud product page with the anatomy of part 15: identity (hero), the console, a 4-fact strip from existing text, openable features, closing ask.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (kit `Code` until `CodeBlock` lands)
- [ ] ~~Config blocks parse~~ n/a: no config block
- [x] Terminal pauses and ends on a static frame (the window film has Pause; modules end at rest)
- [x] No hand-typed version number

Done here: The typed client (`app.py`) lives in the /v1 card's panel in the kit `Code` pane; Copy copies the shown text.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (palette empty state "Nothing matches …"; no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] ~~A failed submit keeps its values~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: The page fetches nothing live, so it is complete with the API blocked; the palette has an empty state; filmed with no console errors.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (no page events of its own)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/console.md` verdict 8 or more (no review written yet)

Done here: `data-cta="console.hero"` and `"console.close"`; the V2 line reads 8/10; gallery refilmed at 1470×801 and 375×812 (`desktop.mp4`, `desktop-hero.jpg`, `phone-1..3.jpg`).
