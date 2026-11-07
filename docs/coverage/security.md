# /security coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Security.jsx` · gallery: `docs/gallery/security/`

## 1. Strategy and conversion
Done here: One ask, Hanzo's "Talk to Security Team" (/contact): solid in the hero, then the sticky ask after the hero, then again at the close, word for word. "Security Documentation", "The controls, and how to check them" and Hanzo's closing "Schedule Security Review" are text links with an arrow. `// Persona:`, `// Goal:` and `// CTA:` head the page file.

## 2. Information architecture and navigation
Done here: Hanzo's header and footer are unchanged. Order follows BRIEF-v3 §5.2 (System): hero with the ask, then the six layers (the controls) with the reviewer's checklist beside them, then proof (what runs underneath, or none of it), then the dark room (the sign-off with its detail sheet, where to send what you find, the hard question). Every layer named in the hero map jumps to that layer in the stage.

## 3. First impression and page narrative
Done here: The first screen is the headline (line-mask cut-in), the honest-status row ("Continual internal audits, with the report on request", with a link to the controls), and one live object: the six-layer map, with a request passing down through every layer and each one checking itself within 1s and with no input. After that, one idea per screen.

## 4. Conversion system
Done here: `data-thumb="Talk to Security Team"` drives the shared ask bar: the shared ask bar (components/Ask.jsx) carries the same label at every width once the hero has gone. `data-cta="talk-to-security-team"` is on every solid ask and on the AskBar. There is one solid button per screen.

## 5. Trust and proof
Done here: The status is in Hanzo's words only, with no seals, certifications or uptime figures. Each control shows its mechanism in Hanzo's own terms (HKDF-SHA256, TLS 1.3, ML-KEM-768, the organization > workspace > project path, the headers struck at the gateway). The page links /trust for the evidence and security@hanzo.ai for reports.

## 6. Content presentation (copy untouched)
Done here: Parity is 60/60 text and 6/6 links. There are no labels above headlines: "Security Architecture", "Infrastructure" and "Enterprise" sit under their headlines as captions. The eight Enterprise items, a list of more than six, sit behind a sheet. Each control's paragraph is one tab panel at a time, and all six are in the HTML.

## 7. Visual design system
Done here: v2 scale from `components/v2/ProofScale.css` (display 96, headline 56, body 19, Zen Mono captions). Ink, greys and silvers only, with no UI hue. The one image is Hanzo's own (koma.webp) on the organization's-file layer. Hero objects use a 28px radius. There is one dark room: the sign-off and the close.

## 8. UI component library
Done here: Uses the kit (`A`, `More`, `Copy`) and the v2 pieces `MaskLines`, `SceneWipe`, `DetailSheet` and `AskBar`. The tablist, the worksheet toggles and the copy button are styled; no control uses browser defaults.

## 9. Motion and interaction
Done here: see below.
- Idle: the hero request pulse; the layer stage advances by itself every 5s while on screen, with a dwell line filling under the current tab.
- Pointer: map labels fill and their plate lifts; tabs nudge; rack rows wipe-fill and shift; option numerals darken and rise; buttons lift 1px and press at .98; the email's underline retracts.
- State: the selected layer lifts out of the stack and turns face-on on a spring; the tab pill glides (layoutId); worksheet ticks; the sheet rises.
- Scroll: only the dark-room wipe (and the line-mask cut-ins on arrival).

## 10. Media
Done here: Hanzo's koma.webp is the organization's-file layer in the map and the stage. Otherwise the objects are product-style: the layer stack, the mechanism plate and the rack.

## 11. Mobile and responsive
Done here: At 375px the layouts are designed, not shrunk:
- the map scales to a narrower stack with its labels;
- the stage becomes a swipe rail of layers above one face-on plate;
- all targets are 44px or more, there is no sideways scroll (`scripts/phone.mjs` passes), and no text is under 14px.

## 12. Accessibility
Done here: see below.
- Real buttons; a `role=tablist` with arrow keys and roving tabindex; `aria-pressed` on the worksheet toggles.
- `aria-live` on the checked count; the sheet traps focus, Esc closes it, and focus returns.
- Inactive panels are `inert`. Reduced motion stops the pulse and the auto-advance, shows the map's final state, and removes the dwell line.

## 13. Performance and engineering
Done here: see below.
- Motion is transform, opacity and clip-path only.
- The pulse and the auto-advance are timers that stop off screen (`useInView`).
- No canvas, no video, no blur, no looping CSS decoration.

## 14. SEO and machine files
Done here: Metadata and JSON-LD are unchanged (`app/security/page.jsx`). All text is in the server HTML, including every panel and the sheet.

## 15. Catalogue and product pages
Done here: Does not apply: /security is a System page, not a catalogue.

## 16. Developer experience
Done here: Does not apply beyond the link to the security documentation, which is kept.

## 17. States and resilience
Done here: The content is static Hanzo copy, so there is no loading or error state. With JS off, all six control paragraphs stand stacked under the stage, the dark room is unclipped, and the sign-off sheet shows inline (the kit's own fallback). Checked headless with JavaScript disabled: no text is invisible. The worksheet survives reloads (localStorage, guarded by try/catch) and hands over "Schedule Security Review" only at six of six. Reduced-motion and no-storage states are handled.

## 18. Measurement and handover
Done here: The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs`. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`. Note: PLAN-COMPONENTS 5.10 proposes /security as a signature-less utility page merged with /trust; the coordinator's BRIEF-v3 §5.2 System structure was followed instead, with the honest-status row on the first screen.
