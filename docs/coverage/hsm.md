# /hsm coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Hsm.jsx` · gallery: `docs/gallery/hsm/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "View on GitHub": solid in the hero, carried by the shared ask bar after the hero (`data-thumb`), and repeated as the one solid button at the close. Every other Hanzo button on the page is outlined or a text link. `Persona:`, `Goal:` and `CTA:` head the page file.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: hero with the ask and the signing module, the six facts as pinned chapters over the exploded module (the dark room), the agent prompt, Pick your module, the close. The agent prompt sits mid-page, so the page has one ending, not two.

## 3. First impression and page narrative
Done here: The first screen is the name, Hanzo's sentence, the ask, and one live object: a hardware module drawn as a stack of plates, closed and signing, with key id and bytes going in and a signature coming out while the module under "One interface" changes (AWS KMS, Azure Key Vault, Google Cloud KMS, Zymbit · PKCS#11). The headline cuts into its lines with a CSS animation at first paint (it moves before any script runs and is legible with JavaScript off). No label sits above the h1.

## 4. Conversion system
Done here: `data-thumb="View on GitHub"` drives the shared ask bar; `data-cta` is on the hero ask and the closing ask. One solid button per screen: in-page controls and Hanzo's other buttons are outlined, and "Deploy to Cloud" sit under the closing ask as text links.

## 5. Trust and proof
Done here: Pick your module answers per module in Hanzo's own sentences, including what cloud key services cannot do.

## 6. Content presentation (copy untouched)
Done here: Parity is 28/28 text and 2/2 links. Section labels sit under their headlines as captions, never above. 

## 7. Visual design system
Done here: v2 scale from `components/v2/v2scale.css` (display, headline, title, lede, body, Zen Mono captions at 12px). Hanzo's grey deck only: ink, greys and white, no UI hue (`scripts/taste.py` passes). One dark room: the exploded-module chapters. Hero objects use a 28px radius.

## 8. UI component library
Done here: Kit `A` and `Copy`; Cloud 2's v2 pieces (`Lines`, `Lift`, `PinChapters`, `ShipPrompt`, `GetIt`). Buttons have a fill or ink shift on hover (never opacity) and press to .98; segmented controls show a grey veil on hover; no browser-default controls.

## 9. Motion and interaction
Done here: Signature: the module, exploded: the plates open apart, each fact lighting the layer it is about, with labels on leader lines.
- Idle: the hero module signs and changes provider while on screen.
- Pointer: buttons shift fill and nudge their arrow; controls veil and press.
- State: the module tabs glide (layoutId) and the three answers cross-fade; the threshold chapter splits the key into shares.
- Scroll: the module settles as it rises; the chapters pin while the stack opens. Scroll-linked motion is under half of the page's motion.

## 10. Media
Done here: Product-style objects drawn in HTML and CSS from Hanzo's own words; the closing Sigil is drawn from the product's own figures.

## 11. Mobile and responsive
Done here: At 375px: the exploded stack sticks under the header at 44% of the screen with shortened gaps while the facts scroll beneath; the module tabs wrap; the three answers stack. No sideways scroll; the hero ask is on the first screen; targets are 44px or more.

## 12. Accessibility
Done here: Real buttons, radios and tabs with `aria-*`; `aria-live` where a demo answers; one focus ring from the shared system; reduced motion shows final states and stops the self-running demo.

## 13. Performance and engineering
Done here: Transform, opacity and clip-path only. Demo timers run only while their object is on screen (`useLive`). No video, no blur on large areas.

## 14. SEO and machine files
Done here: Metadata and JSON-LD unchanged (`app/hsm/page.jsx`). All text is in the server HTML, including every chapter, tab panel and sheet.

## 15. Catalogue and product pages
Done here: A cloud product launch page (archetype A): hero object, chapters, the Beyond, the agent prompt, one close.

## 16. Developer experience
Done here: Hanzo's agent prompt with a working Copy button; Hanzo's docs and source links kept.

## 17. States and resilience
Done here: Static Hanzo copy, so no loading state. With JavaScript off every word is visible (chapter hide-states are scoped to `html.js`); checked headless with JavaScript disabled: 0 text blocks hidden. 

## 18. Measurement and handover
Done here: `data-cta` on the asks for the shared `cta_click` event. Gallery: `docs/gallery/hsm/`. Owner: Cloud 2 chat (components/pages/cloud/Hsm.jsx).
