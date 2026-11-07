# /sign coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/apps/Sign.jsx` · gallery: `docs/gallery/sign/` · Persona: teams that send contracts, and developers who embed signing · Goal and metric: `signup_start` · CTA: "Try Hanzo" → /login

1. **Strategy and conversion.** One ask, Hanzo's "Try Hanzo": solid in the hero (`data-thumb`, `data-cta="sign.hero"`), carried by the shared ask bar after the hero, and again as the first card of the dark close ("Start signing … Try Hanzo →", `data-cta="sign.close"`). Plan buttons ("Contact Sales", "Get on GitHub"), "Documentation", "Deploy to Cloud" are outlined.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the self-signing desk, the five steps as pinned chapters, what is in it, the signing pad, what it costs and the open-source note, the dark close.
3. **First impression and page narrative.** "Hanzo Sign" cuts in; the desk under it already runs: fields drop, ink writes, recipients move, the certificate stamps. Then one step per screen, the same page changing beside the words.
4. **Conversion system.** One solid per viewport. The pad's "Sign" is a control, not an ask.
5. **Trust and proof.** Hanzo's own claims only (certificate per signer, AGPL, Documenso named as upstream). Prices are Hanzo's ($30/mo, $50/mo, Free, Custom).
6. **Content presentation (copy untouched).** Parity 106/106, 9/9. No label above any headline ("Document signing" names the desk; "Try the signing page" sits under its headline). The eight parts open into sheets; all text stays in the HTML.
7. **Visual design system.** v2 scale. 0 UI hues: fields are grey with an ink signature field, the certificate stamp is ink, recipient states read by fill (hollow sent, grey opened, ink signed). The language tile is the one inverted object. One dark room.
8. **UI component library.** Kit `A`, `Tick`, `Img`, `Magnetic`; v2 `Settle`, `OpenCards`, `x-gauss/PinChapters`, `LineMask`, `Pause`, `NoJs`. The run toggle uses `aria-pressed`.
9. **Motion and interaction.**
   - Idle: the desk signs itself; five people's states move; the twelve languages turn over.
   - Pointer: magnetic ask; cards lift and their plus turns; buttons press at .98; you draw on the pad.
   - State: run toggle dims the plans that don't apply; sheets morph out of cards; the pad turns signed with its time.
   - Time: the certificate time is the visitor's clock.
   - Scroll: the desk settles; the five steps pin. Scroll is under half the motion.
   - Pause buttons on the desk, the five recipients and the languages; the "Sign here" hint blinks three times and stops.
10. **Media.** Hanzo's Kai model image is the document's mark (kit `Img`, 38×38). Everything else is product UI.
11. **Mobile and responsive.** At 375px the desk stacks (step label, page, recipients); chapters pin the page above the words; the pad is 3:2; targets 44px+; no sideways scroll.
12. **Accessibility.** One h1. The pad canvas has an aria-label; the result is announced in text. Sheets trap focus and return it. JS off: `NoJs`.
13. **Performance and engineering.** Transform and opacity only; loops stop off screen and when paused.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Does not apply.
16. **Developer experience.** Docs and source links as Hanzo gives them.
17. **States and resilience.** The pad has idle, ready, signed; Clear resets. Nothing is sent.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/sign/`.
