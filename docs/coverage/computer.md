# /computer coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/ComputerPage.jsx` (+ `ComputerPage.css`, shared `components/v2/AppType.css`, `AppStage`, `AppScenes`) · gallery: `docs/gallery/computer/` · metric id: `signup_start`

Open copy questions for James: none decided.
Shared changes requested (`docs/requests/apps1.md`): only the `Band` `id` prop is still open (this page closes on its own Band markup with `<Cta id>` until then). The header ask and the phone ask bar landed in the shared system, so `data-ask="off"` is gone from `<main>`.
Forks this page deleted: two kickers over headlines ("computer.hanzo.ai", "Before you run it"; both now captions under their text), the outlined "Documentation" and "View on GitHub" buttons (now text links), the solid "Deploy to Cloud" (now a text link before the Band), the "-with-ocr" / "-with-som" chips and the voice pill that floated over the desktop (the voice now lights in the desktop's own menu bar), raw `<img>` (now kit `Img`), spring transitions, the motion `pathLength` tick (now a CSS stroke), the violet hue, grey bars where the desktop's windows had text (now Hanzo's lines).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the lib: not merged; the label is Hanzo's own "Try Hanzo Computer" → computer.hanzo.ai)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: Top comment names Persona (someone stuck with software that has no API), Goal, CTA, `Metric: signup_start`, Signature and Beyond. check.mjs: one solid on the first screen at both sizes; one `<h1>`.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: /computer is depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity reports links 4/4 (computer.hanzo.ai, docs.hanzo.ai, github.com/hanzoai/computer, platform.hanzo.ai/deploy).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the part: not merged; the kit equivalent is the line-mask h1 + one lede + one ask + one object); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (the repo meta "Apache-2.0 · hanzoai/computer · 3 stars" sits just before the Band "For the software with no API")
- ~~Card-to-page links use Morph~~ n/a: no cards; the desktop carries `data-morph-target`

Done here: At 1470×801 the h1 (52px), lede, "Try Hanzo Computer" and the desktop share the first screen; the agent cursor travels and the pixel grid scans within 1 s (check.mjs: 54 changes, 2 animations). Order: black hero → 3 pinned lenses → pre-flight → paste and repo → black Band (two black rooms, never back to back; the Band opens from a rounded card).

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label (the shared header always carries a solid "Try Hanzo"; on phones the slim quiet bar carries this page's own `data-thumb` ask; no floating bar on desktop)
- [x] Copy button copies exactly the displayed text; failure never says Copied (kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The primary appears twice: `computer-hero-try` (thumb) and `computer-band-try`. Text links: `computer-hero-docs`, `computer-deploy`, `computer-band-github`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number ("3 stars", "2009", "twenty pixels" only)
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee
- ~~Privacy link and owner line beside every submit~~ n/a: no form

Done here: The pre-flight meter shows how many of the three warnings you ticked (0 to 3, your own count), never a counted or invented figure.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (the desktop's window titles hide on phone, where the render is too small for them)
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (the six modes are real tabs; the agent prompt is kit `Copy`)
- [x] `python3 scripts/parity.py /computer`: 0 missing

Done here: Parity text 33/33, links 4/4. Lede 21px (19px phone), body 16px, captions 12px mono capitals.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck greys only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: taste.py OK; check.mjs 0 labels over headlines. The only page in the group whose hero is a black room with a full-bleed desktop; /bot is an org chart beside its headline, /design a workspace window under oversized type.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (pause, tabs, checks: press scale .97, hovers in `@media (hover: hover)`)
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: The three checks are `role="checkbox"` buttons with `aria-checked`, a drawn stroke tick and a 48px box; arrow keys move between the six mode tabs.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups (variety.py: magnetic, layoutId, useScroll, clip reveal; 0 Rise)
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (`lib/sound.js`; tabs, switches and pressed buttons tick through `components/Sound.jsx`)

Done here: Idle (the cursor works the desktop through six modes), pointer (magnetic ask), state (tab pill at 300ms ease-emphasis, ticks drawing), time (the field fills after the click), arrival (h1 line cut-in), scroll (Stage settle, pinned lenses, the Band opening). No springs. Sound: `play('done')` when all three pre-flight warnings are checked; `data-sound="tick"` on the three checks.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, 1600×900, `priority` on the desktop wallpaper)
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video
- [x] Budgets met; nothing missing; alt on every image (the wallpaper is decorative, `alt=""`)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a in part: one Hanzo image, Mori's wireframe, as the wallpaper)

Done here: The wallpaper is Hanzo's own `/models/mori.webp`, shown undimmed.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: check.mjs at 375×812: h1, one solid, the moving desktop and its pause control in the first screen, CLS 0.000, 0 small targets; the desktop becomes 4:3 and the lenses stack.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better (#fafafa and white 78% on black; #0a0a0a / #525252 on white)
- [x] Pause control on every moving item (the desktop's pause is its first control, 44px, `aria-pressed`)
- ~~Forms labelled; first error focused~~ n/a: no form
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: The desktop render is `aria-hidden`; its six modes are told by the tab labels and the chapter text.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The cursor and overlays are transform and opacity only; the mode timer stops off screen and while paused.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (`<JsonLd route="/computer" />`)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/computer/page.jsx` keeps Hanzo's metadata and renders `<JsonLd route="/computer" />`.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md`~~ n/a: not a catalogue or model page
- ~~Every card opens by Morph~~ n/a
- ~~Every maker and model page linked in the DOM~~ n/a
- ~~One price figure everywhere~~ n/a: no prices

Done here: n/a for every item: /computer is a launch page with no catalogue or prices.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt copies exactly the displayed line)
- ~~Config blocks parse on their own~~ n/a: no config
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal demo
- [x] No hand-typed version number

Done here: Copy gives "Read https://hanzo.ai/skill.md and use Hanzo Computer in my project. Start with: hanzo desktop", the line shown.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a in part: no live data)
- [x] Blocked live data leaves a complete page, no console errors
- ~~A failed submit keeps its values and shows no success~~ n/a: no form
- [x] A thrown island does not blank the page

Done here: No live calls; look.mjs and check.mjs report no console errors at either size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (kit `Cta`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/computer.md` verdict 8 or more (no review yet)

Done here: `data-cta` ids: computer-hero-try, computer-hero-docs, computer-deploy, computer-band-try, computer-band-github.
