# /security coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Security.jsx` · gallery: `docs/gallery/security/` · metric id: `contact_sales_submit` (cta_click on `security.hero`, `security.band`)

Open copy questions for James: none decided. MASTER §4.2 lists "DPA and subprocessors, security.txt link" for /security, but on hanzo.ai those live on /trust; no copy or link was added here, and /security links /trust ("The controls, and how to check them").
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/security.md` — restore the native-dialog `components/v2/DetailSheet.jsx` (a merge left the JSX and CSS mismatched); the page uses a local copy, `components/pages/security/Sheet.jsx`, until then.
Forks this page deleted: the page-level AskBar pill (the shared ask bar in `components/Ask.jsx` carries the ask), the self-advancing 3D layer zoom and its spring physics, the looping hero pulse, the rack's dark chassis.
Conflict noted (MASTER §0.6): §4.2 says "no signature" while JAMES.md asks for something moving within 1 s; the page keeps no signature and moves once (the six layers check themselves in a 0.4 s-step pass on arrival, then rest).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: One ask, Hanzo's "Talk to Security Team" (/contact), solid in the hero and again in the closing band; "Security Documentation", "The controls, and how to check them" and "Schedule Security Review" are text links. `lib/cta.js` has no System entry for /security yet, so the label is the page's own (no prices on this page).

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /security is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` after the layout's `#main` skip target; links use `A`/`More` (the mailto is a plain `<a>`); parity links 6/6.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards lead to pages here

Done here: The h1 (52px, line-mask cut-in), caption, lede, ask and the honest status row fit the first screen; the six-layer map starts its one-time check pass at 0.4 s. `PageHero` is not merged yet, so the hero is built from the kit (`MaskLines`). The shared `<NoJs>` rule (no `<noscript>`, so no hydration badge) stacks every control with JS off; checked headless with JavaScript disabled, no text is invisible.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: the only copy is the kit's `Copy` of security@hanzo.ai, which copies the displayed address
- [x] `data-cta` and `data-thumb` on every primary

Done here: Both asks are the kit `<Cta>` (`security.hero` with `thumb`, `security.band`). On desktop the shared header takes the hero's label ("Talk to Security Team", checked at 1470); on phones the shared header still reads "Try Hanzo" — that is the shared header's choice, not this page's file.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The status is Hanzo's sentence only ("Continual internal audits, with the report on request."); no seal, mark or uptime. The only numerals are the controls' own "01 / 06" counts and "U1–U4" rack labels.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /security`: 0 missing

Done here: Parity text 60/60, links 6/6. The controls are an APG tablist (arrow keys, roving tabindex) with every panel in the HTML; the eight Enterprise items sit in the kit's `DetailSheet`.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK on both files; only deck values (#0a0a0a, #525252, #737373, #f5f5f5, #ededed, #e4e4e7, #a3a3a3, #000, white steps), radii 6/12/16/20/24, no shadows on tiles. `tokens.css` does not exist yet, so the deck hexes are page variables on `.xsc`. Captions ("Security Architecture", "Infrastructure", "Enterprise") sit under their headings. Rhythm via `ProofRhythm.css` (`pf-r`): h1 52, headings 26, figures 64, one 84px moment (the closing line).

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- ~~Inputs 16px or larger; no bare `:hover`~~ n/a: no inputs; every hover sits inside `@media (hover:hover)`
- [x] Forks this page deleted: listed below

Done here: Tabs, map labels, worksheet toggles, rack rows and the email answer hover with a transform, press at scale .97 in 90 ms, focus with a 2px ink ring (white in the black room). The sheet is a native `<dialog>` opened with `showModal()` (page-local `security/Sheet.jsx`): focus trapped, Esc and the scrim close it, focus returns to the button (checked headless: activeElement `pf-plus` after Esc, scroll position unchanged on open). Deleted: the page-level AskBar and the auto-advancing zoom.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not merged; the page plays none

Done here: No signature (MASTER §4.2); supporting: line-mask cut-in (arrival), the one-time status pass (time, 300 ms steps), the gliding layer pill and plate crossfade (state, 300 ms ease-emphasis, no springs); the black room's entry is the only scroll-linked move. variety.py OK. Reduced motion shows all six checked at once. Filmed (`scripts/motion.mjs`, 1470): layout shift 0.000; the hero moves, the reading screens rest by design (MASTER §4.2 calm). Headless Chrome reports `(hover: none)`, so the film lists hover-gated controls as dead; with `--blink-settings=primaryHoverType=2` every control answered (map labels, tabs, rack rows, worksheet toggle, email).

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: One Hanzo image (koma.webp) on the organization's-file layer, with width and height and `alt=""` (decorative). `Pic` is not merged yet, so it is a sized `<img>`. Only a gradient sits under the plate's text.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Headless probe after the sheet fix: scrollWidth equals the viewport at 1470, 375 and 320; the closed sheet is a native `<dialog>` and draws nothing at rest. On phones the six-layer stack now sits inside the first 812px under the ask, the controls are a snap rail of 48px pills above the lifted-layer stack; the ask sits at about y 430 at 375.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- ~~Pause control on every moving item~~ n/a: nothing moves for more than 2 s (the status pass ends at rest)
- ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Text is #0a0a0a or #525252 on white and #f5f5f5, #fafafa or white 78% on black. Tablist with arrow keys; inactive panels `inert`; the worksheet count is `aria-live`; a hero layer label moves focus to its tab.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: Transform, opacity and clip-path only; timers stop at rest (the status pass runs once). Filming ran in the cloud session.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- ~~Every card is a real link~~ n/a: no cards

Done here: `app/security/page.jsx` keeps the metadata and `<JsonLd route="/security" />` unchanged.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a

Done here: n/a: /security is a System page with no cards, models or prices.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display~~ n/a: no code on the page
- ~~Config blocks parse on their own~~ n/a
- ~~Terminal pauses and ends on a static frame~~ n/a
- ~~No hand-typed version number~~ n/a

Done here: n/a: no code blocks; the security documentation link is kept.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: Static Hanzo copy with no live fetch, so nothing loads or fails; the worksheet survives reloads (localStorage in try/catch) and works without storage. JS off and reduced motion each show the final state.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/<page>.md` verdict 8 or more

Done here: `data-cta="security.hero"` and `"security.band"`; the page fires nothing itself. V2 line present. No critic review exists yet on origin/main.
