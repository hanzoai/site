# /trust coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Trust.jsx` · gallery: `docs/gallery/trust/`

1. **Strategy and conversion.** One ask, Hanzo's "Request a review or an enterprise deployment" (/contact-sales): solid in the hero, then the sticky ask after the hero, then again at the close, word for word. Everything else is a text link with an arrow: the two published papers, "Ask for it", and the link to the security page.
2. **Information architecture and navigation.** Hanzo's header and footer are unchanged. Order: what a review gets (the locker), what you can read now (the two papers), where Hanzo stands today, every control (find, then five groups), the first-email facts, then the dark room (where to send what you find, the one ask). The two papers open into /legal/dpa and /legal/subprocessors with the morph layer (`data-morph` on the title).
3. **First impression and page narrative.** The first screen is the headline (line-mask cut-in), one sentence, the one ask, and one wide live object: the evidence locker. Its first drawer pulls itself out within 1s, and the rest follow every 3.4s with no input. After that, one idea per screen.
4. **Conversion system.** `data-thumb` with the ask's label drives the phone thumb bar. `AskBar` carries the same label on desktop once the hero has gone. There is one solid button per screen.
5. **Trust and proof.** Everything shown is in Hanzo's words: Published or On request for each document, the honest limits kept in place (the DPA is a draft, SCIM groups are not implemented, a passkey cannot complete a sign-in, the actor is not indexed, signing keys are held by the platform). There are no seals, no certification marks and no uptime figure.
6. **Content presentation (copy untouched).** Parity is 87/87 text and 6/6 links. There are no labels above headlines; "Trust" sits under the h1 as a caption. The 16 controls, sixteen long paragraphs on v1's scroll, now sit in five evidence sheets, one per group, all of them in the HTML.
7. **Visual design system.** v2 scale from `components/v2/ProofScale.css` (display 128, headline 56, body 19, Zen Mono captions). Ink, greys and silvers only: Published is a filled ink chip, On request a hollow mark (a shape cue, not a colour). Hero objects use a 28px radius and papers 16px. There is one dark room: the close.
8. **UI component library.** Uses the kit (`A`, `More`) and the v2 pieces `MaskLines`, `SceneWipe`, `DetailSheet` and `AskBar`. The search field is styled (no browser cancel button; its own clear button), and the locker is a real `role=tablist`. No control uses browser defaults.
9. **Motion and interaction.**
   - Idle: the locker's drawers pull themselves out one at a time while it is on screen.
   - Pointer: drawers' handles nudge; papers straighten and lift; group numerals darken; group titles nudge; answers shift; buttons lift 1px and press at .98; the clear button turns.
   - State: drawers ride springs; the tray's contents change; answers appear in place as you type and the count and the per-group dots update; sheets rise.
   - Scroll: only the dark-room wipe (and the line-mask cut-ins on arrival).
10. **Media.** The page has no Hanzo images or film that belong to it, and the v1 "seal" image was removed (no seals). Its objects are product-style: the cabinet, the two papers typeset as title pages, the evidence sheets.
11. **Mobile and responsive.** At 375px the layouts are designed, not shrunk:
   - the locker stacks drawers over its tray, with chips under titles;
   - the papers stack upright;
   - the search, count and groups run in one column;
   - all targets are 44px or more, there is no sideways scroll (`scripts/phone.mjs` passes), and no text is under 14px.
12. **Accessibility.**
   - The locker is a tablist with arrow keys; the tray panels are `role=tabpanel`, and inactive ones are `inert`.
   - The search has a real label and an `aria-live` count.
   - Each group's sheet traps focus, Esc closes it, and focus returns. Reduced motion opens the first drawer and stops the cycle.
13. **Performance and engineering.**
   - Motion is transform, opacity and clip-path only.
   - The locker's cycle is a timer that stops off screen (`useInView`) and once you choose a drawer.
   - No canvas, video, blur or looping decoration (v1's pulsing green chip is gone).
14. **SEO and machine files.** Metadata and JSON-LD are unchanged (`app/trust/page.jsx`). All text is in the server HTML, including every tray and every sheet. The security.txt link is kept.
15. **Catalogue and product pages.** Does not apply: /trust is a System page, not a catalogue.
16. **Developer experience.** Does not apply.
17. **States and resilience.**
   - Empty: a search with no match shows Hanzo's own line, "If a control you need is not on this page, ask.", with "Ask for it".
   - Partial: non-matching groups dim, and their dots stay hollow.
   - The content is static Hanzo copy, so there is no loading or error state.
18. **Measurement and handover.** The asks are standard links; no analytics are wired yet (BRIEF-v3 §1, pending Hanzo's event log). Filmed with `scripts/motion.mjs`. Gallery: `desktop.mp4`, `desktop.jpg`, `phone-1..3.jpg`.
