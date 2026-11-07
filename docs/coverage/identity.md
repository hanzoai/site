# /identity coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Identity.jsx` · gallery: `docs/gallery/identity/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Try Hanzo": solid in the hero, carried by the shared ask bar after the hero (`data-thumb`), and repeated as the one solid button at the close. It is solid again in Add sign-in and at the close; "View Documentation", "Read Documentation" and "Read the docs" are outlined and "View on GitHub" is a text link. `Persona:`, `Goal:` and `CTA:` head the page file.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the pinned first screen (title, then the three stages, while the hosted card stays), What it does as a bento, Running it for a large organization in tabs, Wear your name, the dark room (Add sign-in), the close. The agent prompt sits mid-page, so the page has one ending, not two.

## 3. First impression and page narrative
Done here: The first screen is the name, Hanzo's line, the ask, and one live object: the hosted hanzo.id sign-in card (marked Sign-in) signing someone in by itself, password then the six boxes of a second factor, then signed in. The headline cuts into its lines with a CSS animation at first paint (it moves before any script runs and is legible with JavaScript off). No label sits above the h1.

## 4. Conversion system
Done here: `data-thumb="Try Hanzo"` drives the shared ask bar; `data-cta` is on the hero ask and the closing ask. One solid button per screen: in-page controls and Hanzo's other buttons are outlined, and "Deploy to Cloud" sit under the closing ask as text links.

## 5. Trust and proof
Done here: Every feature tile is Hanzo's sentence; the drawings are small product shapes (six code boxes, client ids meeting one authorize, organization > workspace > project, write-only log lines).

## 6. Content presentation (copy untouched)
Done here: Parity is 55/55 text and 4/4 links. Section labels sit under their headlines as captions, never above. The hostname and name in Wear your name are examples the visitor replaces; nothing is saved or sent.

## 7. Visual design system
Done here: v2 scale from `components/v2/v2scale.css` (display, headline, title, lede, body, Zen Mono captions at 12px). Hanzo's grey deck only: ink, greys and white, no UI hue (`scripts/taste.py` passes). One dark room: Add sign-in. Hero objects use a 28px radius.

## 8. UI component library
Done here: Kit `A` and `Copy`; Cloud 2's v2 pieces (`Lines`). Buttons have a fill or ink shift on hover (never opacity) and press to .98; segmented controls show a grey veil on hover; no browser-default controls.

## 9. Motion and interaction
Done here: Signature: the card that never leaves: the first screen pins and the three stages step in beside the same card as it changes.
- Idle: the card signs someone in on a loop; in the ways-in stage each way lights in turn.
- Pointer: buttons shift fill and nudge their arrow; controls veil and press.
- State: the large-organization tabs glide (layoutId) with every panel in the HTML; Wear your name redraws the card from your hostname, name and ways in.
- Scroll: the first screen pins while the title gives way to the three stages. Scroll-linked motion is under half of the page's motion.

## 10. Media
Done here: Product-style objects drawn in HTML and CSS from Hanzo's own words; the closing Sigil is drawn from the product's own figures.

## 11. Mobile and responsive
Done here: At 375px: no pin: the card sticks under the header while the three stages scroll beneath it; the bento becomes one column; the tabs wrap; the closing buttons stack. No sideways scroll; the hero ask is on the first screen; targets are 44px or more.

## 12. Accessibility
Done here: Real buttons, radios and tabs with `aria-*`; `aria-live` where a demo answers; one focus ring from the shared system; reduced motion shows final states and stops the self-running demo.

## 13. Performance and engineering
Done here: Transform, opacity and clip-path only. Demo timers run only while their object is on screen (`useLive`). No video, no blur on large areas.

## 14. SEO and machine files
Done here: Metadata and JSON-LD unchanged (`app/identity/page.jsx`). All text is in the server HTML, including every chapter, tab panel and sheet.

## 15. Catalogue and product pages
Done here: A cloud product launch page (archetype A): hero object, chapters, the Beyond, the agent prompt, one close.

## 16. Developer experience
Done here: Hanzo's agent prompt with a working Copy button; Hanzo's docs and source links kept.

## 17. States and resilience
Done here: Static Hanzo copy, so no loading state. With JavaScript off every word is visible (chapter hide-states are scoped to `html.js`); checked headless with JavaScript disabled: 0 text blocks hidden. Wear your name checks the hostname and says "Type a hostname, like auth.example.com." when it is not one, and "Choose at least one way in." when every way is off.

## 18. Measurement and handover
Done here: `data-cta` on the asks for the shared `cta_click` event. Gallery: `docs/gallery/identity/`. Owner: Cloud 2 chat (components/pages/cloud/Identity.jsx).
