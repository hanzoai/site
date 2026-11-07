# /careers/* coverage (MASTER.md part 2, the 18 parts)

Family template: `components/pages/CareerRole.jsx` + `CareerRole.css`, data `components/pages/careersData.js` (`role`, `peers`, `deckNo`), route `app/careers/[slug]/page.jsx` · eight members · checked: `/careers/compiler-engineer`, `/careers/academic-research-intern` (also `/careers/open`, `/careers/ai-ml-research-engineer`) · gallery: `docs/gallery/careers/compiler-engineer-*`, `academic-research-intern-*` (the other files there are the /careers index's) · metric id: one contact click (the application email)

Open copy questions for James: none.
Review fixes (`docs/review/careers-family.md`, 6/10): 1 tag line under the title (done); 2 grey deck for every member, no orange (done; taste OK); 3 contents plate fully in the first screen with one quiet move (hairlines draw, counts fill, contour drifts); 4 chapter hidden states scoped to `html.js` (in shared `v2/fam.css`; measured JS off: 0 hidden text blocks on both members at 1470); 5 one Hanzo object per team: only roles whose words name Hanzo models get renders, since `public/` has no Engine render (decision, noted). Scale: h1 rests at 52 (arrives up to 72 and settles on scroll), section heads 26, one figure at 64 per screen; it already met the lead's scale-rhythm note.
Shared changes requested (`docs/requests/careers.md`): one note for the chrome owner: with `data-ask="off"` (careers, per MASTER part 4) the header's "Try Hanzo" stays solid beside the hero's "Apply for this position", so two fills share the first screen; the header could turn quiet when a page turns its ask bar off.
Forks this page deleted: the orange accent, the kicker over the h1 and the counters over every headline, the separate contents plate (folded into the hero sheet), the hero sheet's shadow (outline only), the 88–184px numeral and 48–96px figures, the hover nudges (contents, ticks), the red required mark, the browser checkbox, the invented "Back", "Next", "· Copied" and "Your email is ready" strings, and the sticky ask bar.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill in the page per viewport ("Apply for this position", Hanzo's label); the email is outlined
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a: no prices
- [x] Open copy questions for James listed, none decided

Done here: the first screen is the role's sheet: title (h1, 52px), tags, Hanzo's line, "Apply for this position" (solid, `#apply`) and "Email resume directly" (outlined mailto), with the deck numeral and contents beside them.

## 2. Information architecture and navigation
- [x] One `<main>`; the site layout carries the skip link
- [x] Every link through `A` or a plain anchor to an in-page id; every sibling card a real link
- [x] "Back to all careers" (Hanzo's words) leads the page at depth 2
- [x] Link parity: 0 removed, 0 unexpected

Done here: compiler-engineer links 2/2, academic-research-intern 2/2, /careers index 13/13 (`scripts/parity.py`). The sheet's contents jump to each chapter, Why Join Hanzo and the application.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Hero from kit parts (`FamLines` h1 cut-in, 700 ms, 60 ms apart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh: one chapter a screen
- [x] Ends in the application room, then the other roles, then the footer
- [x] Morph: the hero sheet is the `data-morph-target` for the role's sheet clicked on /careers (docs/review/careers.md fix 5)

Done here: the whole sheet, contents plate included, sits on the first screen at 1470×801 (toc ends about y 727, sheet bottom about 780) and its asks at 375×812 (ask bottom 532). Idle on arrival: the contour drifts (opacity .22), the contents' hairlines draw in once (900ms, 60ms apart) and the chapter counts fill once from 0 (150ms steps), then rest at the true value (server HTML has the true value). Arriving from /careers, the clicked sheet's title and numeral fly onto this h1 and numeral (`careers/door.js`). JS off: 0 of 40 (compiler) and 0 of 42 (internship) text blocks hidden, measured; chapters stack without scripts.

## 4. Conversion system
- [x] Kit-style buttons (`v2f-btn`, `xcj-btn`); no raw `.x-btn`
- [x] Sticky ask: n/a by rule: "Legal and careers pages have none" (MASTER part 4); `data-ask="off"` on `<main>`
- [x] Share copies the page URL and answers with a drawn tick and a `copied` status; the application's submit writes Hanzo's email
- [x] `data-cta="careers.hero"` and `data-thumb` on the primary

Done here: one solid ask in the hero, the form's own submit in the dark room; nothing floats over content.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Every figure traces to Hanzo's copy (the deck numeral is the role's place in Hanzo's own list; counts are the role's own list lengths)
- [x] n/a: no marquee
- [x] The application's note and careers@hanzo.ai sit beside the submit

Done here: "Why Join Hanzo" is Hanzo's own list; the fit meters count only what you tick (0 at rest, never an invented step).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held (lede 40ch, list items 45ch); headings balanced
- [x] Requirements are tickable rows; the form is grouped in fieldsets
- [x] `python3 scripts/parity.py`: 0 missing

Done here: parity compiler-engineer 47/47, academic-research-intern 46/46, open 42/42, /careers 76/76. Sizes: h1 52 (40 phone), section heads 26, ledes 20, body 16–17, figures 64.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes
- [x] No label, tag, badge or pill above a headline (the team and terms are tags under the title)
- [x] The hero sheet is outlined, not shadowed; the form in the dark room is a flat white surface
- [x] Inline strokes only (arrows, link, tick); no icon in a rounded box
- [x] Differs from neighbours: a white editorial sheet (products lead with a dark console, legal with a cover)

Done here: ink, greys and white; the only colour on the page is Hanzo's own model renders on the internship. One dark room (the application), not next to another.

## 8. UI component library
- [x] Hover (inside `@media (hover:hover)`), press (scale .97, 90 ms) and focus-visible on asks, share, contents, ticks and step arrows
- [x] Focus ring visible on every stop (site ring; fields take an ink border and halo)
- [x] n/a: no dialog
- [x] Inputs 16px, 48px tall, labels above; styled file picker and checkbox (no browser defaults)
- [x] Forks this page deleted: listed above

Done here: step arrows are round icon buttons named from `content/ui-strings.json` (`previous`, `next`); share shows a tick and a `copied` status.

## 9. Motion and interaction
- [x] One signature (the chapter book), supporting: line-mask cut-in, tick draw, the one figure that grows (FamGrow); `variety.py` OK
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound: the open from /careers plays the kit's whoosh (lib/sound.js); nothing else here adds sound

Done here: arrival (title cut-in, or the /careers sheet's title landing on it), idle (the contour drifts in the sheet, or the Zen render plays; the contents draw and count once; Why Join and the application room each hold a drifting contour so neither screen is still), state (ticks draw and meters fill, the form slides step to step, share swaps to a tick), pointer (magnetic apply, the sibling rail drags with inertia), scroll (the chapter wipes; the total by the form grows past 64px only while it crosses the middle).

## 10. Media
- [x] Kit `Film` and `Img` only, sizes and posters set
- [x] One video at most (the internship's Zen render), playing only on screen, never under reduced motion
- [x] Nothing missing; each image has its model's name as alt
- [x] Undimmed, unfiltered; the three renders show together where the role names them

Done here: `careersData.js` finds the Hanzo models a role's own words name (the internship names Zen, Kai and Enso) and the sheet wears their renders from `/public/models`.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; ticks and contents are tap rows
- [x] Primary ask above the fold at 375×812 (renders sit in a row beside the numeral to keep it there)

Done here: sideways swipe turns to the previous or next role (site Phone layer; tested academic-research-intern → ai-ml-research-engineer, compiler-engineer → cryptography-engineer-zkp). No bottom bar covers the page.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: muted #525252 on white 7.8:1; dark room text #a3a3a3 on #0a0a0a about 8:1
- [x] The only loop is the Zen render (kit `Film`, stops off screen and under reduced motion); the contour freezes under reduced motion
- [x] Form fields labelled; the first invalid field takes focus on each step
- [x] One h1; h2 per chapter and section; requirements are `role=checkbox` with `aria-checked`
- [x] Keyboard reaches every control

Done here: inactive form steps are inert only once scripts run; with JS off every step shows, stacked.

## 13. Performance and engineering
- [x] h1 and LCP in server HTML
- [x] Model renders sized (1200×1500, 4:5), lazy except the playing one
- [x] No poller, no third-party request
- [x] Nothing heavy run on James's laptop

Done here: CSS transitions on opacity, transform and clip only; no timers.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical unchanged from the layout
- [x] `<JsonLd route>` unchanged
- [x] Every sibling card is a real link

Done here: `app/careers/[slug]/page.jsx` keeps `generateMetadata` and `JsonLd` for all eight roles.

## 15. Catalogue and product pages
- [x] n/a: not a model page
- [x] Every sibling card opens by Morph (title as `data-morph` into the next role's sheet)
- [x] All eight roles linked (six as siblings, next roles first, plus /careers)
- [x] n/a: no prices

Done here: `FamNext` shows up to six other roles, each with its own contour, Hanzo's line on hover and its tags.

## 16. Developer experience
- [x] n/a: no code on these pages
- [x] n/a
- [x] n/a
- [x] n/a

Done here: not a developer surface.

## 17. States and resilience
- [x] Each step checks its fields before the next; the ready state shows a tick and the address
- [x] n/a: no live data
- [x] Nothing is sent from the page (the form writes the same email Hanzo's form writes); values stay while you move between steps
- [x] A failed Sigil or film leaves the sheet whole (poster and outline remain)

Done here: tested with outgoing requests blocked: step 1 → 2 → back works; the form was never submitted.

## 18. Measurement and handover
- [x] `data-cta="careers.hero"` on the primary
- [x] Nothing identifier-bearing; no field value leaves the page
- [x] `V2:` line in the page file's top comment
- [ ] Review read: `docs/review/careers-family.md` verdict 8 or more: awaiting the critic's re-score after this round

Done here: this round answers the 6/10 family review's five fixes (see the line above part 1); parity compiler-engineer 47/47, ai-ml-research-engineer 48/48; console clean at 1470 (js, reduced motion); the role note link is now a 44px target.
