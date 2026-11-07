# /gallery coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Gallery.jsx` · gallery: `docs/gallery/gallery/` · Persona: builders looking for a working app to start from · Goal and metric: `signup_start` (gallery handoff) · CTA: "Browse the Gallery" → gallery.hanzo.ai

1. **Strategy and conversion.** One ask, Hanzo's "Browse the Gallery": solid in the hero (`data-thumb`, `data-cta="gallery.hero"`), in the ask bar after the hero, solid again in the dark close (`data-cta="gallery.close"`). "Documentation", "Deploy to Cloud" and "View on GitHub" are outlined or text links.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the salon wall (hero), three moves (fork, deploy, submit), paste and ship, the dark close ("Skip the Boilerplate").
3. **First impression and page narrative.** "Gallery" cuts in; under it six living frames hang salon-style with the Get Gallery label, and a spotlight walks from frame to frame by itself, the plaque counting with it.
4. **Conversion system.** One solid per viewport.
5. **Trust and proof.** Hanzo's six statements (Apache-2.0 monorepo, deploy button, paid bounty) only.
6. **Content presentation (copy untouched).** Parity 32/32, 5/5. "gallery.hanzo.ai" sits under the headline. Each frame opens into the viewer with its full text.
7. **Visual design system.** v2 scale; 0 UI hues: the spotlight is white light; frames hold the shared Sigil contour pictures (two inverted). One dark room (the close).
8. **UI component library.** Kit `A`, `Copy`, `Magnetic`; shared `Sigil`; v2 `Settle`, `x-gauss/LineMask`, `Pause`, `NoJs`. The viewer is `role=dialog`, focus is trapped and returns to the frame.
9. **Motion and interaction.**
   - Idle: the spotlight walks the wall; each frame's Sigil drifts.
   - Pointer: hovering a frame holds the light on it; frames lean; Sigils bend to the mouse; magnetic ask.
   - State: a frame opens into the viewer (layoutId morph) with previous and next; arrows and Esc work.
   - Time: the agent prompt types itself once.
   - Scroll: only the wall's settle.
   - The wall has a pause button; the caret blinks four times.
10. **Media.** The shared Sigil, seeded with each frame's own name and length.
11. **Mobile and responsive.** At 375px the wall is two columns with two full-width frames; frames keep a 4:3 picture; the viewer stacks; targets 44px; no sideways scroll.
12. **Accessibility.** One h1. Frames are buttons with `aria-haspopup="dialog"`. JS off: `NoJs`.
13. **Performance and engineering.** Sigils pause off screen; the spotlight timer stops off screen, on hover, when paused and while the viewer is open.
14. **SEO and machine files.** Unchanged.
15. **Catalogue and product pages.** Six showcase frames, each opening into its detail.
16. **Developer experience.** The paste-and-ship prompt with Copy.
17. **States and resilience.** Static content; reduced motion shows the wall lit and still.
18. **Measurement and handover.** `data-cta` on both asks. Filmed into `docs/gallery/gallery/`.
