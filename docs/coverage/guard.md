# /guard coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Guard.jsx` · gallery: `docs/gallery/guard/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "View on GitHub": solid in the hero, carried by the shared ask bar after the hero (`data-thumb`), and repeated as the one solid button at the close. Every other Hanzo button on the page is outlined or a text link. `Persona:`, `Goal:` and `CTA:` head the page file.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the black hero with the ask and the live composer, the six detectors as pinned chapters, the agent prompt, Paste your own with the dials, the close. The agent prompt sits mid-page, so the page has one ending, not two.

## 3. First impression and page narrative
Done here: The first screen is the name, Hanzo's line, the ask, and one live object: a composer (titled hanzoai/guard) where a request types itself, its card number and email snap into typed markers, the injection is measured against a threshold, and the model's reply comes back through the same detectors. The headline cuts into its lines with a CSS animation at first paint (it moves before any script runs and is legible with JavaScript off). No label sits above the h1.

## 4. Conversion system
Done here: `data-thumb="View on GitHub"` drives the shared ask bar; `data-cta` is on the hero ask and the closing ask. One solid button per screen: in-page controls and Hanzo's other buttons are outlined, and "Deploy to Cloud" sit under the closing ask as text links.

## 5. Trust and proof
Done here: Every claim is Hanzo's own sentence; the demos show mechanisms in Hanzo's words, never figures Hanzo does not state.

## 6. Content presentation (copy untouched)
Done here: Parity is 29/29 text and 2/2 links. Section labels sit under their headlines as captions, never above. The request and reply in the composer are made-up examples, labelled as such in the file; the markers come from Hanzo's own list.

## 7. Visual design system
Done here: v2 scale from `components/v2/v2scale.css` (display, headline, title, lede, body, Zen Mono captions at 12px). Hanzo's grey deck only: ink, greys and white, no UI hue (`scripts/taste.py` passes). One dark room: the hero. Hero objects use a 28px radius.

## 8. UI component library
Done here: Kit `A` and `Copy`; Cloud 2's v2 pieces (`Lines`, `Lift`, `PinChapters`, `ShipPrompt`, `GetIt`). Buttons have a fill or ink shift on hover (never opacity) and press to .98; segmented controls show a grey veil on hover; no browser-default controls.

## 9. Motion and interaction
Done here: Signature: both directions, read live.
- Idle: the composer types, marks, measures and replies in a loop while on screen.
- Pointer: buttons shift fill and nudge their arrow; controls veil and press.
- State: detector chips and marker-text radios re-run the detectors on your own text; markers spring in.
- Scroll: the composer settles as it rises; the six detectors pin while the board changes. Scroll-linked motion is under half of the page's motion.

## 10. Media
Done here: Product-style objects drawn in HTML and CSS from Hanzo's own words; the closing Sigil is drawn from the product's own figures.

## 11. Mobile and responsive
Done here: At 375px: the composer fills the width under the ask; the detector board sticks under the header while the facts scroll beneath it; the editor's dials wrap. No sideways scroll; the hero ask is on the first screen; targets are 44px or more.

## 12. Accessibility
Done here: Real buttons, radios and tabs with `aria-*`; `aria-live` where a demo answers; one focus ring from the shared system; reduced motion shows final states and stops the self-running demo.

## 13. Performance and engineering
Done here: Transform, opacity and clip-path only. Demo timers run only while their object is on screen (`useLive`). No video, no blur on large areas.

## 14. SEO and machine files
Done here: Metadata and JSON-LD unchanged (`app/guard/page.jsx`). All text is in the server HTML, including every chapter, tab panel and sheet.

## 15. Catalogue and product pages
Done here: A cloud product launch page (archetype A): hero object, chapters, the Beyond, the agent prompt, one close.

## 16. Developer experience
Done here: Hanzo's agent prompt with a working Copy button; Hanzo's docs and source links kept.

## 17. States and resilience
Done here: Static Hanzo copy, so no loading state. With JavaScript off every word is visible (chapter hide-states are scoped to `html.js`); checked headless with JavaScript disabled: 0 text blocks hidden. Paste your own runs in the page with nothing sent; empty text shows "Type something above." and no markers shows "No markers".

## 18. Measurement and handover
Done here: `data-cta` on the asks for the shared `cta_click` event. Gallery: `docs/gallery/guard/`. Owner: Cloud 2 chat (components/pages/cloud/Guard.jsx).
