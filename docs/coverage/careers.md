# /careers coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Careers.jsx` (+ `CareersBoard.css`, `app/careers/page.jsx`, page-local kit `components/pages/company/`) · gallery: `docs/gallery/careers/` · metric id: `cta_click careers.*` (one contact click: a role page)

Open copy questions for James: none decided. The role pages' blue kicker and blue "Apply for this position" (the `/careers/*` template, Families A) clash with this page; that is their call.
Shared changes requested (`docs/requests/careers.md`):
- `components/Morph.jsx` resolves the view-transition update inside `requestAnimationFrame`, which does not fire while the transition holds rendering, so every `data-morph` click times out (about 4s). This page uses the page-local doorway until Morph is fixed.
- `components/kit.jsx` `A`: a bare `#hash` href is treated as external (`target=_blank`). This page uses `/careers#open-positions` instead.

Forks this page deleted: the `xcr-btn` and raw `.x-btn` buttons (all asks are kit `Cta`); the hand-rolled sticky ask (site Ask bar, here off by rule); the old orange accent; the perks' PinScenes pin; native `title=` tooltips.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's copy (`lib/cta.js` does not exist yet; labels are verbatim from `content/pages/careers`)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button. n/a prices: no prices on this page.
- [x] Open copy questions for James listed, none decided

Done here: Persona, Goal, CTA, Metric, Signature and Beyond are in `app/careers/page.jsx` and the component's top comment. The one solid per screen is "View Open Positions" in the hero; the role sheets' "Apply for this role" is `Cta kind="quiet"`, and Academic keeps one solid with the grant ask quiet.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (site layout: `#main` mark before `<main>`, skip link first in tab order)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- n/a: Breadcrumb at depth 2 or more (/careers is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /careers` gives links 13/13. Every role sheet is a real `<a href="/careers/<slug>">` (kit `A`), and every ask is a kit `Cta`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input (the h1 cuts in once the curtain lifts, and the hiring card starts sliding its steps)
- [~] `PageHero`: the kit has no `PageHero` yet; the hero follows its rules (line-mask h1, one lede, one primary, one object). Nothing sits above the h1.
- [x] JS off: legible; no `opacity:0` on the LCP element (`noscript` rules; checked: 0 hidden headings, paragraphs or links)
- [x] One idea per 100svh; no 3 same-height sections in a row (hero, still perk list, deck, 7/5 Academic, dark close)
- [~] Ends in the page's own close (dark room "Ready to join us?" with its one ask) and the footer. No proof strip: the careers copy has none.
- [~] Card-to-page: the site Morph is broken (see requests). The whole white sheet grows to fill the screen (doorway, 640ms), the role page arrives under it, and the cover wipes up (760ms). That is traced end to end. The title does not land on the h1.

Done here: At 1470×801 the h1 is the deck's 84px Book (4 masked lines). The lede and the ask sit above the fold (ask bottom about 660px). At 375 the ask's bottom is at 603px. A click on a sheet reaches `/careers/<slug>` through the doorway in about 1.1s.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` in the page file
- [x] Sticky ask: careers has none by rule (MASTER part 4), so `data-ask="off"` is on `<main>`
- [x] Copy button: the direct-link copy shows a drawn tick and `role=status` "Link copied" only when the clipboard write succeeds; a failure shows nothing
- [x] `data-cta` and `data-thumb` on every primary (kit `Cta id` and `thumb`)

Done here: The `data-cta` ids are `careers.hero`, `careers.history`, `careers.role.<id>`, `careers.open`, `careers.intern`, `careers.grant` and `careers.close`. There is no sticky bar: `data-ask="off"`.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy ("2,137+ open repositories" is in the live careers text)
- n/a: Marquees (none)
- n/a: Privacy link beside a submit (no form on this page; applying happens on the role pages)

Done here: The only figure is 2,137+, verbatim from `content/live/careers.json`. There are no logos and no badges.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals (the 12px Zen Mono labels)
- [x] Measures held; no orphan word in a heading (`text-wrap: balance`; phone titles keep whole words)
- [x] Tables, FAQ, tabs and code use the kit parts. n/a: the page has none.
- [x] `python3 scripts/parity.py /careers`: 0 missing

Done here: Parity is text 76/76 and links 13/13. Body 17px, lede 17–21px, deck sizes from `components/pages/company/deck.css`. Checked at 320, 375 and 1470: no title breaks inside a word.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; only deck values (`#0a0a0a`, `#525252`, `#737373`, `#f5f5f5`, `#f2f2f2`, `#ededed`, `#d4d4d4`, `#a3a3a3`, white alphas on black)
- [x] No label, tag, badge or pill above a headline ("Benefits & Perks" is a caption under its heading; each role's team sits in its meta row)
- [x] Radii 24 on tiles and sheets, 28 on the hiring card; never box plus shadow (sheets float with a shadow and no border; panels are a flat fill or a hairline outline)
- [x] One icon set; no icon in a rounded box (inline stroke icons for link, close and target)
- [x] Differs from neighbours in hero medium and room order (hero object: a black hiring card that slides steps; signature: the sheet deck)

Done here: `taste.py` reports OK on `Careers.jsx` and `CareersBoard.css`. Headings are Book 497 and giant numerals are Air 220, per the deck.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (scale .97, 90ms), focus-visible, and disabled or loading where it applies (`Cta aria-busy` on hand-off)
- [x] Focus ring visible on every stop of a Tab crawl (2px ink plus a white halo; white plus a black halo in the dark card and room)
- n/a: Dialogs (none)
- n/a: Inputs (none); no bare `:hover`
- [x] Forks this page deleted: listed above

Done here: The filter pill glides on a 300ms ease-emphasis tween (no spring). Skill chips and team filters are real `aria-pressed` buttons, 44px tall.

## 9. Motion and interaction
- [x] One signature (the role-sheet deck), at most 3 supporting (h1 line mask, hiring card steps, perk Sigil redraw); 0 fade-ups (`variety.py` OK)
- [x] At least 3 kinds of movement: arrival (h1 cut-in), idle (hiring card, Sigil drift), pointer (perk field redraws; sheet numeral lifts), state (filter pill, deck in and out, marked words), scroll (the deck only). Scroll is 1 of 5.
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state (deck unstuck, no bar animation); no `setInterval` (`setTimeout` steps only while in view)
- n/a: Sound: the shared sound kit is not on main yet; nothing here plays sound.

Done here: Utility rules (MASTER 4.5) are kept: no pinned scroll theatre besides the deck, and 0.4s entries for the lede and buttons. The h1 cut-in is 800ms.

## 10. Media
- n/a: `Film` and `Pic`: the careers copy carries no Hanzo images or films
- n/a: Videos (none)
- [x] Nothing missing; no `<img>`
- n/a: No photo to dim; Sigil fields are the designed image (MASTER part 10)

Done here: The page's objects are drawn: the hiring card, a Sigil field per perk, the sheets' Air numerals, a Sigil band in Academic, and a Sigil in the dark close. At most 3 Sigil canvases are on screen at once.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320 (checked: none)
- [x] Every target 44px or more; every hover has a tap path (a tap on a perk row redraws its field)
- [x] Primary ask above the fold at 375×667 (bottom about 603px)

Done here: At 360px and below, the step rail wraps two by two and long buttons wrap. The filter and skill chips are swipe rails on the phone.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: body `#525252` on white (7.8:1), labels `#737373` (4.74:1), white 78% on black
- [~] Pause control on every moving item: the hiring card stops on any tap of a step and pauses off screen; it has no separate pause button (it advances every 3.4s and rests when tapped)
- n/a: Forms
- [x] One h1; no heading skips (h1, then h2 for sections, h3 for perks and panels); names start with visible text
- [x] Keyboard reaches every control (perk rows are focusable and redraw the field on focus)

Done here: `role=status` on the count and the copy confirmation, and `aria-pressed` on toggles. Reduced motion leaves 0 running animations.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML (the h1 is real text; a `noscript` rule shows it)
- [x] Every image and video sized (none); Sigil pauses off screen
- [x] No poller; no third-party request
- [x] Nothing heavy run on James's laptop (filmed in the cloud)

Done here: Motion is transform, opacity and clip-path only. The deck's scale reads one `useScroll` for the whole list.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` via `metaOf('/careers')`, unedited
- [~] Canonical: the shared layout owns it; nothing page-local overrides it
- [x] `<JsonLd route="/careers">` rendered
- [x] Every card is a real link

Done here: `app/careers/page.jsx` sets `metadata` from `metaOf` and renders `JsonLd`. All 7 roles plus the open application are `<a href>`.

## 15. Catalogue and product pages
- n/a: Model card (not a model page)
- [~] Every card opens into its page: by the doorway while Morph is broken (see requests)
- n/a: Maker and model pages
- n/a: Price

Done here: The role list is the page's catalogue. The team filter is gone (each team has one role, per the review); the skill chips are the one filter. Every sheet opens into `/careers/<slug>`.

## 16. Developer experience
- n/a: no code on the page

Done here: n/a. There are no code blocks, config or terminals on /careers.

## 17. States and resilience
- [x] Empty state: a team filter always leaves the open-application sheet; "match what you know" with no hits dims every role and the count shows 0
- [x] Blocked live data: none fetched; the page is complete offline from its server HTML
- n/a: Submit (no form)
- [x] A thrown island does not blank the page (site error boundary; Sigil is the only canvas)

Done here: A blocked clipboard shows no false confirmation. JS off renders every word.

## 18. Measurement and handover
- [x] `data-cta` on every primary (kit `Cta` also dispatches the `hz-event cta_click`); `lib/track.js` is not on main yet
- [x] Nothing identifier-bearing before consent; no field values
- [x] `V2: 8/10 …` in the page file's top comment (`app/careers/page.jsx` and `Careers.jsx`)
- [~] Review read: `docs/review/careers.md` was 7/10. Its fixes are done here, and a new critic walk is pending.

Done here: Re-review 7/10 (7 Nov 14:45) fixes:
- JS off: the four hiring steps read as a list;
- reduced motion: no hydration mismatch, bars full;
- doorway: the landing wipe no longer gets cancelled;
- team filter removed.

Earlier review fixes:
- filter pill: painted (51×44 absolute);
- card open: through the doorway;
- phone titles: whole words;
- one solid with the bar: the bar is off here by rule;
- JS-off perks: legible;
- hiring card: bars aligned at y=644, starting in view.
