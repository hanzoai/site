# /iam coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Iam.jsx` · gallery: `docs/gallery/iam/` · metric id: `cta_click iam.hero`

Open copy questions for James: none.
Shared changes requested (`docs/build-notes/requests/iam.md`): none filed; waiting on `tokens.css`, `lib/cta.js`, `lib/track.js`, `PageHero` to land on main.
Forks this page deleted: the page's own hero shell (Frame `Hero`), hand-made buttons (`.v2-btn` became the kit `Cta`), a second ending (the agent prompt moved mid-page), the sticky phone visual over text (chapters now stack), every spring transition

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are Hanzo's hero ask (`lib/cta.js` is not on main yet)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; no prices on this page
- [x] Open copy questions for James listed, none decided

Done here: `// Persona:` to `// Beyond:` head `components/pages/cloud/Iam.jsx`; the one ask is Hanzo's "API reference" (iam.hero, iam.close). Measured with a headless walk: one solid button on the first screen at 1470×801 and 375×812.

## 2. Information architecture and navigation
- [x] One `<main>`; the layout's skip link reaches `#main`
- [x] Every link through `A` or the kit `Cta`; related cards are real links
- ~~Breadcrumb at depth 2 or more~~ n/a: a depth-1 page
- [x] Link parity: 0 removed, 0 unexpected

Done here: Parity 41/41 text and 7/7 links; Hanzo's header and footer are untouched; every link goes through `A`/`Cta` (`lib/route.js`).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero built from the kit's line mask (`Lines`) and one object (`PageHero` is not on main yet); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; loud and quiet sections alternate
- [x] Ends in one close in Hanzo's words ("Get IAM" with the ask), then the footer
- [x] The h1 is the `data-morph-target`, so cards elsewhere open into it

Done here: Hanzo IAM, Hanzo's line and the ask at the left; at the right the hanzo.id sign-in runs itself from its first frame (server and client paint the same frame, so no flash): a way in is picked, Authorization code and PKCE · S256 land, the token fills and reads RS256, JWKS ticks, the five stations light in step. Order after it: the 8-fact snap rail, the black Refresh tokens room, Paste and ship, Get IAM (the token at rest), Related capabilities last. Checked 7 Nov (C1) at 0 and 1 s: buttons at rest from first paint.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page
- [x] Sticky ask: the shared ask bar carries the hero label (`data-thumb`)
- [x] Copy buttons copy exactly the displayed text (kit `CodeBlock`/`Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: Hero `<Cta thumb id="iam.hero">API reference</Cta>`; the close repeats it (`iam.close`); Hanzo's other buttons are quiet or link Ctas.

## 5. Trust and proof
- [x] No logo, seal or invented number
- [x] Every figure traces to Hanzo's copy
- ~~Marquees pause, freeze, hide duplicates~~ n/a: no marquee
- ~~Privacy link beside every submit~~ n/a: no form submits

Done here: No numbers on the page beyond Hanzo's own ("3 stars" from the live GitHub chip copy); the rail's figures (S256, argon2id, RS256 …) are lifted from Hanzo's sentences.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px on phones) except 11–12px mono capitals and the kit's own copy label
- [x] Measures held; headings balanced
- [x] Code uses the kit `CodeBlock`
- [x] `python3 scripts/parity.py /iam`: 0 missing

Done here: Parity 41/41 text and 7/7 links. Section labels sit under their headings as captions; phone labels raised to 14px (`components/pages/cloud/Iam.css`).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes (deck greys only; no hue)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 28 (objects), 16–24 (tiles); one shadow per raised object
- ~~One icon set~~ n/a: no icons beyond the kit's
- [x] Differs from neighbours in hero medium and room order

Done here: Greys from Hanzo's deck only (`taste.py` OK on Iam.jsx/css and iam/IamMotion.*). Hex literals remain in page CSS because `tokens.css` is not on main yet.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press .97, focus-visible, disabled
- [x] Focus ring is the shared system's
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog on this page
- [x] Inputs 16px or larger; no bare `:hover` in the page CSS
- [x] Forks this page deleted: listed above

Done here: Kit `Cta`, `CodeBlock`, `Copy` and Cloud 3's `LivePause`; segmented controls get a grey veil on hover and press .97 from `v2scale.css`.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` in the page (timers are `setTimeout` chains)
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`, wired by `components/Sound.jsx`): the ask taps, tabs, radios and pause toggles tick (radios carry `data-sound="tick"`), copy chimes; the demos loop while seen and never finish, so no done chime

Done here: Signature decode (heads and the facts' figures resolve on arrival and on hover/focus). Idle: the sign-in runs and loops while seen (pausable). Pointer: the card tilts up to 2.5°, hover re-decodes a fact. State: Previous / Next and the live 0N / 08, the refresh family (press the live token or a spent one). Scroll: only the stage recede and the dark room opening from a 16px (8px phone) inset to full width, now kept inside the text gutter (C1 fix: the inset used to cut the room's heading on phones). `motion.mjs`: 0 still on desktop, layout shift 0.000.

## 10. Media
- ~~`Film` and `Pic` only~~ n/a: no photo or film on Hanzo's page
- ~~At most 2 videos; pause on loops~~ n/a: no video
- [x] Nothing missing; no image without alt
- ~~No dimmed photo; 4+ real visuals together~~ n/a: Hanzo's page has no imagery

Done here: Every object is drawn from Hanzo's words: the sign-in card, eight line drawings in the rail, the token family, and the close's own token-at-rest SVG (not the hero card, not shared contour art).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (scrollWidth 320)
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: At 375: native swipe rail with snap and a 40px next-card peek, counter follows the swipe; the family shows 4 across in two rows. `check.mjs` 7 Nov (C1): desk and phone 0 errors, 0 covered, 0 wide. Measured before: ask bottom at 613 of 667; pinned scenes stack under 900px, nothing floats over text.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: #0a0a0a and #525252 on white and #f5f5f5, #a3a3a3 and white on black
- [x] Pause control (Cloud 3's `LivePause`, 44px, `aria-pressed`) on every self-running object
- [x] Forms labelled (no form fields)
- [x] One h1; no heading skips
- [x] Keyboard reaches every control

Done here: The live sign-in is `aria-hidden` with its pause button outside it; the rail's Previous / Next are labelled buttons that disable at the ends; family tokens are buttons with `aria-pressed`.

## 13. Performance and engineering
- [x] h1 and the hero object are in the server HTML
- [x] Transform, opacity and clip-path only; demo timers run only while on screen
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Timers stop off screen and when paused (`useLive`); bundle size not measured on this page.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical through the shared `<JsonLd route="/iam" />`
- [x] `<JsonLd route>` renders; no broken URL
- [x] Every card is a real link

Done here: `app/iam/page.jsx` unchanged: metadata from `content/pages.json` and `<JsonLd route="/iam" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a: no catalogue cards
- ~~Every maker and model page linked~~ n/a: not /models
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a: a top-level cloud product launch page; its h1 is the `data-morph-target` for cards that open into it.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display
- ~~Config blocks parse on their own~~ n/a: no config block
- ~~Terminal pauses and ends on a static frame~~ n/a: no typed terminal
- [x] No hand-typed version number

Done here: Hanzo's agent prompt use the kit `CodeBlock`, whose Copy copies exactly what is shown.

## 17. States and resilience
- [x] Every state looks intended: static copy, reduced motion and JS off checked
- [x] No live data, so nothing to block; no console errors
- ~~A failed submit keeps its values~~ n/a: n/a: no form posts anywhere; the page's inputs are in-page demos and nothing is sent
- [x] A thrown island leaves the page: the shared `app/error.jsx` keeps header and footer

Done here: A headless JS-off pass shows every word; reduced motion stops each demo on its final frame.

## 18. Measurement and handover
- [x] `data-cta` on every primary (the kit `Cta` sends `cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing; no field value in any payload
- [x] `V2: 8/10` line in the page file's top comment
- [x] Review read: `docs/build-notes/review/iam.md` round 4, all 9 fixes checked 7 Nov (C1)

Done here: `iam.hero` and `iam.close` on the asks. Gallery: `docs/gallery/iam/` (desktop film, phone stills, and C1 stills `c1-desk-hero.jpg`, `c1-desk-room.jpg`, `c1-phone-rail.jpg`).
