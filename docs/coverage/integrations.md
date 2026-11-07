# /integrations coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/integrations/IntegrationsIndex.jsx` · gallery: `docs/gallery/integrations/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Get an API key": solid in the hero, then the sticky ask after the hero. "SDK docs" is a text link with an arrow.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order: the hub, the starter code, the 19 guides, then the agent prompt. The guides live at `/integrations/*` and every card opens one.

## 3. First impression and page narrative
Done here: The first screen holds the headline, the base URL in the lede, one ask and one live object: the hub, 19 tool badges turning around `api.hanzo.ai/v1` by themselves within 1s. After that, one idea per screen.

## 4. Conversion system
Done here: `data-thumb="Get an API key"` drives the shared ask bar: the shared ask bar (components/Ask.jsx) carries the same label at every width once the hero has gone. One solid button per screen.

## 5. Trust and proof
Done here: The proof is the working code itself: the same three-line change in Python, TypeScript and Go, with the Hanzo lines marked, and a Copy for each.

## 6. Content presentation (copy untouched)
Done here: Parity is 71/71 text and 21/21 links. The families are chips, so the grid shows one family at a time; every card stays in the server HTML. No labels above headlines ("Paste and ship" is the dark room's headline, as Hanzo's section title).

## 7. Visual design system
Done here: v2 scale from `components/v2/ProofScale.css` (display 128 and 80, lede 24, Zen Mono for code and captions). Ink, greys and silvers only, including the code (hierarchy by white alpha steps, no syntax hues). Hero objects 28px radius, cards 16px. One dark room: the agent prompt.

## 8. UI component library
Done here: Kit `A`, `More` and `Copy`; v2 pieces `MaskLines`, `SceneWipe` and `AskBar`. Search field, family chips and language tabs are styled (no browser defaults).

## 9. Motion and interaction
Done here: see below.
- Idle: the hub turns; the starter switches language on its own every 4.2s, with a progress line under the tab.
- Pointer: hovering a badge holds the ring and names the tool in the centre; cards lift 5px, the badge tilts and the arrow nudges; press is .98.
- State: the family pill glides (layoutId), the grid re-flows with springs, the code lines stagger in on each language.
- Scroll: only the dark room arriving as a widening panel. No pinned scenes (Catalogue, BRIEF-v3 §5).

## 10. Media
Done here: Hanzo has no photographs or film for this page; the tools' own badges and the code are the visuals.

## 11. Mobile and responsive
Done here: At 375px the hub sits under the headline at a smaller radius, the chips become a swipe rail, the cards stack one per row, and the editor wraps its tabs. Targets are 44px or more, no sideways scroll, no text under 14px.

## 12. Accessibility
Done here: Chips and language tabs are `role=tab` with arrow keys; the search has a label; the code blocks are focusable; badges have `aria-label`s and the hub centre is `aria-live`. Reduced motion: the ring is still, the starter does not switch by itself, no staggers.

## 13. Performance and engineering
Done here: CSS animations only for the ring (paused off screen by `[data-off]`); the starter's timer runs only while it is in view. Transform and opacity only, no canvas, no video.

## 14. SEO and machine files
Done here: Metadata and JSON-LD unchanged (`app/integrations/page.jsx`). All 19 cards, all three code samples and the prompt are in the server HTML.

## 15. Catalogue and product pages
Done here: Signature: the card that opens. Numbered cards (`01 / 19`) open into their guide, the title as the morph source into the guide's headline (`data-morph-target`). The first card in view spans two columns, so no row is three equal boxes.

## 16. Developer experience
Done here: Copy on every code sample and on the agent prompt; the Hanzo lines are marked in the editor.

## 17. States and resilience
Done here: "Find your tool" has an empty state ("Nothing matches …"), and chips with no matches are disabled. The data is static, so there is no loading or error state.

## 18. Measurement and handover
Done here: The ask is a standard link; no analytics are wired yet (BRIEF-v3 §1). Filmed with `scripts/motion.mjs`. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
