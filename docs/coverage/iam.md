# /iam coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Iam.jsx` · gallery: `docs/gallery/iam/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "API reference": solid in the hero, carried by the shared ask bar after the hero (`data-thumb`), and repeated as the one solid button at the close. "Discovery document" is outlined and "Source" is a text link. `Persona:`, `Goal:` and `CTA:` head the page file.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the live token family first with the name, Hanzo's line and the ask under it, the eight facts on a sideways rail, the agent prompt with related products, the dark room (Try to steal one), the close. The agent prompt sits mid-page, so the page has one ending, not two.

## 3. First impression and page narrative
Done here: The first screen is one live object above the name: hanzo.id runs the PKCE exchange (S256), the refresh-token family grows rt1, rt2, rt3 with each refresh spending the last, then a spent token is presented and the whole family turns over to revoked at once. Under it: Hanzo IAM, Hanzo's line and the ask. The headline cuts into its lines with a CSS animation at first paint (it moves before any script runs and is legible with JavaScript off). No label sits above the h1.

## 4. Conversion system
Done here: `data-thumb="API reference"` drives the shared ask bar; `data-cta` is on the hero ask and the closing ask. One solid button per screen: in-page controls and Hanzo's other buttons are outlined, and "Deploy to Cloud" sit under the closing ask as text links.

## 5. Trust and proof
Done here: Every claim is Hanzo's own sentence; the demos show mechanisms in Hanzo's words, never figures Hanzo does not state.

## 6. Content presentation (copy untouched)
Done here: Parity is 41/41 text and 7/7 links. Section labels sit under their headlines as captions, never above. The token names rt1 to rt3 are labels for the demo, not figures; the eight cards lead with the one term each fact turns on, in Hanzo's own words (S256, argon2id, single-use, passkey, SCIM 2.0, RS256, tenancy boundary, Authz).

## 7. Visual design system
Done here: v2 scale from `components/v2/v2scale.css` (display, headline, title, lede, body, Zen Mono captions at 12px). Hanzo's grey deck only: ink, greys and white, no UI hue (`scripts/taste.py` passes). One dark room: Try to steal one. Hero objects use a 28px radius.

## 8. UI component library
Done here: Kit `A` and `Copy`; Cloud 2's v2 pieces (`Lines`, `Lift`, `ScrubRail`, `ShipPrompt`, `GetIt`). Buttons have a fill or ink shift on hover (never opacity) and press to .98; segmented controls show a grey veil on hover; no browser-default controls.

## 9. Motion and interaction
Done here: Signature: the refresh-token family, live.
- Idle: the family grows and is revoked in a loop while on screen.
- Pointer: buttons shift fill and nudge their arrow; controls veil and press.
- State: the steal demo appends tokens on a spring and turns the family to revoked when a spent one is presented; buttons disable when they no longer apply.
- Scroll: the eight cards slide sideways as the section pins; the family settles as it rises. Scroll-linked motion is under half of the page's motion.

## 10. Media
Done here: Product-style objects drawn in HTML and CSS from Hanzo's own words; the closing Sigil is drawn from the product's own figures.

## 11. Mobile and responsive
Done here: At 375px: the rail becomes a native swipe rail with snap; the token family shows three tokens across; the steal panel stacks under its buttons. No sideways scroll; the hero ask is on the first screen; targets are 44px or more.

## 12. Accessibility
Done here: Real buttons, radios and tabs with `aria-*`; `aria-live` where a demo answers; one focus ring from the shared system; reduced motion shows final states and stops the self-running demo.

## 13. Performance and engineering
Done here: Transform, opacity and clip-path only. Demo timers run only while their object is on screen (`useLive`). No video, no blur on large areas.

## 14. SEO and machine files
Done here: Metadata and JSON-LD unchanged (`app/iam/page.jsx`). All text is in the server HTML, including every chapter, tab panel and sheet.

## 15. Catalogue and product pages
Done here: A cloud product launch page (archetype A): hero object, chapters, the Beyond, the agent prompt, one close.

## 16. Developer experience
Done here: Hanzo's agent prompt with a working Copy button; Hanzo's docs and source links kept.

## 17. States and resilience
Done here: Static Hanzo copy, so no loading state. With JavaScript off every word is visible (chapter hide-states are scoped to `html.js`); checked headless with JavaScript disabled: 0 text blocks hidden. 

## 18. Measurement and handover
Done here: `data-cta` on the asks for the shared `cta_click` event. Gallery: `docs/gallery/iam/`. Owner: Cloud 2 chat (components/pages/cloud/Iam.jsx).
