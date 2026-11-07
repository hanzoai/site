# /referral coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Referral.jsx` · gallery: `docs/gallery/referral/` · metric id: `signup_start`

Open copy questions for James: none decided. The live page has no closing `Band` or proof strip, so none is added (no new sections or copy).
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the hand-rolled `xp-cta`/`xp-ghost` anchors (now kit `Cta`), the four glyphs in rounded icon boxes (now one stepping object), the CSS-only rails (now one rAF rail with pause), the "Referrals" and "Referral or affiliate" kickers above headings (moved under them), every Apple grey (#6e6e73, #161617, #f5f5f7, #a1a1a6).

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are the live page's ("Get your link" → /signup?next=/referral)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices: the page shows none
- [x] Open copy questions for James listed, none decided

Done here: `Referral.jsx` top comment names Persona, Goal, CTA, metric `signup_start`, Signature and Beyond; server HTML has 1 `<h1>` ("Bring a builder to Hanzo."), and the hero has one solid (`Cta id="referral.hero"`) beside an outlined "Sign in".

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (shared layout, `app/layout.jsx` line 62)
- [x] Every link through `A` or `Cta`
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /referral` reports links 3/3; the signup, login and /affiliate links all go through `A` or `Cta` from `components/kit.jsx`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Line-masked h1 (`LineReveal`, 700 ms, 60 ms apart); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; heights vary (hero, a short rails band, steps, the dark room)
- [x] n/a proof strip and `Band`: the live page has neither, and no section is added
- [x] n/a Morph: no card opens a page

Done here: the h1 cuts in by CSS from first paint; the card rises 24px (transform only) and one builder rides from the link into Referred, Pending and Qualified between 0.9 s and 5.1 s, then rests on Qualified; the "Referrals" caption now sits under the asks.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header after the hero, same label (the header reads "Get your link" from `data-thumb` once the hero ask leaves view)
- [x] n/a copy: the signed-out card's Copy is `aria-disabled` (there is no link until you sign in); pressing it points to the sign-in line and never says Copied
- [x] `data-cta` and `data-thumb` on the primary

Done here: `Cta id="referral.hero" thumb`; the walk's frame at 900 px shows the header's solid "Get your link" while the hero ask is out of view.

## 5. Trust and proof
- [x] No logo, no seal, no invented number (the counts show an em dash, as hanzo.ai does signed out)
- [x] Every figure traces to Hanzo's copy (there are none to trace)
- [x] Marquees pause (44px `aria-pressed` button first in the rails section), stop off screen, freeze under reduced motion, duplicates `aria-hidden`
- [x] n/a Privacy link: no form on the page

Done here: the three rails run from one rAF loop in `Run`, honour the pause button and `useReducedMotion()`, and are `aria-hidden`; the section's label carries their meaning.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; headings balanced
- [x] Steps are a keyboard tablist (↑ ↓ ← →); no table, FAQ or code here
- [x] `python3 scripts/parity.py /referral`: 0 missing

Done here: parity `text 20/20 links 3/3`; body 14–17px, mono chips 13px, the scene's SVG labels 16px.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; deck greys only (#0a0a0a, #525252, #737373, #a3a3a3, #d4d4d4, #e5e5e5, #ededed, #f5f5f5, #171717, #262626)
- [x] No label, tag, badge or pill above a headline
- [x] Radii 12/16/20/24/full; flat tiles with no outline plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours: /affiliate's hero is a link at display size, this one is the signed-out card plus three rails

Done here: `taste.py components/pages/Referral.jsx components/pages/Referral.css` → OK; the dark room's sides are flat #171717 and #262626 with no border.

## 8. UI component library
- [x] Every control has hover (inside `@media (hover:hover)`), press (.97 / translate), focus-visible
- [x] Focus ring visible on every stop of a Tab crawl
- [x] n/a dialogs: none
- [x] n/a inputs: none
- [x] Forks this page deleted: listed above

Done here: Copy fills ink on hover and nudges its icon (no opacity fade); the pause button inverts; steps slide 6px and ink; dark-room rows fill white 5%; the "Affiliates" links move their underline or arrow.

## 9. Motion and interaction
- [x] One signature (the rails) and 3 supporting (line-mask h1, the card's landing builder, the steps' drawings); 0 fade-ups
- [x] Kinds: idle (rails, way chips, flow dots), time (the builder landing once, the steps running once), pointer (hovers, scroll-boosted rails), state (step tabs), arrival (h1 cut-in); scroll-linked is only the rails' boost
- [x] Something moves without input; every control answers (`motion.mjs`: 0 still screens; the one dead hover it found is fixed)
- [x] Reduced motion shows the final state (card on Qualified, step 04, rails still); no `setInterval`
- [x] Sound through the one kit: `data-sound="tick"` on the step tabs, pause and Copy

Done here: `variety.py` OK; `motion.mjs /referral` desktop 0 still screens, layout shift 0.000; phone 0 still screens, 0 dead controls.

## 10. Media
- [x] n/a `Film`/`Pic`: the page has no Hanzo photo or film; its objects are the card, the rails and drawn SVG
- [x] n/a videos
- [x] Budgets met; no image to size
- [x] n/a photos

Done here: no media on the live page; every object is DOM or inline SVG (0 KB of images).

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 375 (scrollWidth − innerWidth = 0)
- [x] Targets 44px or more (Copy 44, pause 44, step rows 64); hovers have tap paths
- [x] Primary ask above the fold at 375×667 (y ≈ 315)

Done here: on phones the rails are 52/21/14px, the steps' object sits above its four rows, and the asks run full width.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text contrast at 4.5:1 or better (the unlit rail words are #737373, 4.74:1)
- [x] Pause control on the rails; the way chips and flow dots pause with it
- [x] n/a forms
- [x] One h1; h2 "How it works", h2 dark room, h3 sides
- [x] Keyboard reaches every control; steps use roving tabindex

Done here: the step list is `role="tablist"` with `aria-selected`/`aria-controls` to the stage panel; the pause button is `aria-pressed`.

## 13. Performance and engineering
- [x] h1 and lede in server HTML
- [x] No new dependency; one rAF per rail that stops off screen
- [x] No poller; no third-party request
- [x] Filming ran in the cloud only

Done here: `curl /referral/` returns 200 with the h1 in HTML; 0 console errors at 1470×801 and 375×812.

## 14. SEO and machine files
- [x] Title and description from the live page
- [x] Canonical from the shared metadata
- [x] `<JsonLd route="/referral" />` renders (2 ld+json blocks)
- [x] n/a cards: no cards

Done here: `app/referral/page.jsx` keeps title "Bring a builder to Hanzo — Hanzo AI" and the live description.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a Morph
- [x] n/a maker and model links
- [x] n/a prices

Done here: n/a, a programs page with no model cards.

## 16. Developer experience
- [x] n/a: no code on the page
- [x] n/a config
- [x] n/a terminal
- [x] n/a versions

Done here: n/a, the only mono text is the link placeholder `hanzo.ai/?ref=…`.

## 17. States and resilience
- [x] Signed-out state designed (Hanzo's own: em dash counts, disabled Copy, the sign-in line)
- [x] No live data, so nothing can block the page
- [x] n/a submit
- [x] Islands are plain components; a failed rail leaves the words in place

Done here: the card is hanzo.ai's signed-out referral card; pressing Copy flips the sign-in line to ink and nudges it, instead of pretending to copy.

## 18. Measurement and handover
- [x] `data-cta` on the primary (`referral.hero`) and Sign in (`referral.signin`); events go through the kit's `hz-event`
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/referral.md` (5/10) complaints addressed; the next verdict comes from the critic

Done here: every complaint in the 5/10 review is answered on the page: the label above the h1, the everything-big rails, the icon boxes, the fading Copy, the near-still card, and the missing card.
