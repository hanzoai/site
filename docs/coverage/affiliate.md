# /affiliate coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Affiliate.jsx` · gallery: `docs/gallery/affiliate/`

1. **Strategy and conversion.** One ask in Hanzo's words, "Apply" (mailto hello@hanzo.ai with Hanzo's own subject). It is the one solid button in the hero (`data-thumb="Apply"`, `data-cta="affiliate.hero"`), the sticky ask bar after the hero at every width, and the one solid button in the close (`affiliate.close`). The header's "Try Hanzo" goes outline while it is on screen.
2. **Information architecture.** Hanzo's header and footer untouched. Order: hero (promise + link object), how it works (four steps), the rule (the dark room), close. The /referral link is kept in the close.
3. **First impression and narrative.** No label above the h1. "Refer customers to Hanzo" cuts in line by line from the first paint (pure CSS, no wait for JavaScript). The next screen is the affiliate link itself at display size, writing itself once and resting with its code marked. Then one idea per screen; the rule is said once in words (step 4) and once drawn (the dark room, whose headline is Hanzo's three rules).
4. **Conversion system.** `data-thumb`, `data-cta` on both primaries, `data-ask-name="Affiliates"` names the page in the ask bar. Never more than one solid button per screen.
5. **Trust and proof.** Hanzo's rule in Hanzo's words only: first touch, one affiliate per org, never your own. No invented figures.
6. **Content presentation (copy untouched).** Parity 15/15 text (the one "missing" link is Cloudflare's email-protection artifact; the real mailto is on the page). The step titles are Hanzo's own step sentences; no labels were added. The copy control is icon-only (its name in `aria-label`) until James approves the word.
7. **Visual design system.** Grey deck only (`--hz-*`, room tokens), 0 UI hues. v2 scale from `components/v2/ProgramScale.css`; 28px hero objects, 16px cards. One dark room (the rule).
8. **UI components.** Kit `Tabs`/`TabPanel` (gliding pill, arrow keys), kit `Copy`, system `.x-btn` states, `.x-link`. No browser-default controls.
9. **Motion and interaction.** Signature: sticky chapters (scroll). Idle/time: the link writes itself once; the rule diagrams play themselves and the tabs advance every 4.2s until you choose. Pointer: the link leans toward the pointer (useTilt); hovering Apply shows where it goes (hello@hanzo.ai). State: the tab pill glides, the stage object springs between states. Arrival: line-mask headline. Scroll-linked effects are one of five kinds.
10. **Media.** The objects are product-style: the link at display size, the request, the email thread (Hanzo's own subject line), the code card, the rule diagrams (SVG). No raw images or video.
11. **Mobile.** At 375px the chapters become a swipe rail of cards with dots; the rule tabs scroll sideways; one full-width Apply; no sideways page scroll; text ≥14px.
12. **Accessibility.** Real buttons and links; tablist with roving tabindex; chapter rail buttons jump to each chapter; tabbing into a chapter scrolls to it. Reduced motion: the link shows in full, no auto-advance, diagrams draw at once.
13. **Performance.** Transform, opacity and SVG pathLength only; loops stop off screen (`useInView`); no canvas, no video.
14. **SEO.** Metadata and JSON-LD unchanged; all four step sentences, every rule and all text are in the server HTML. With JavaScript off (`NoJs`), every element shows its final state and the chapters lay out as a plain story.
15. **Catalogue.** Does not apply.
16. **Developer experience.** The endpoint `POST /v1/affiliate/apply` copies exactly as shown.
17. **States and resilience.** Static Hanzo copy; no live data. Copy failure never says copied (kit).
18. **Measurement.** `data-cta` ids `affiliate.hero`, `affiliate.close`. No metric id for affiliate applications in PLAN-COMPONENTS 1.1 yet. Ledger: this page deleted its forked button styles (`xp-cta` now sizes the system `.x-btn`), its hand-rolled case tabs (now kit `Tabs`) and all invented labels.
