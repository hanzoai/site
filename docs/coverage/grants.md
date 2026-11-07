# /grants coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Grants.jsx` (+ `Grants.apply.js`) · gallery: `docs/gallery/grants/`

1. **Strategy and conversion.** One ask, Hanzo's "Apply for a Grant" (the form on this page): solid in the hero (`data-thumb`, `data-cta="grants.hero"`), the sticky ask bar after it; each track sheet carries its own Hanzo CTA as that screen's one solid (`grants.oss/academic/internship`, which also sets the track); "Submit Grant Application" is the form's solid (`grants.apply`). "Academic Internships" and each sheet's second link are text links.
2. **Information architecture.** Header and footer untouched. Hero, how grants work, what recipients receive, the three ways (stacked sheets, dark room), the application.
3. **First impression.** No label above the h1 ("Grants & Research" labels the contour field). The headline cuts in from the first paint; the page's own Sigil contour field drifts beside it.
4. **Conversion system.** `data-thumb`, `data-cta` on every primary, one solid per screen.
5. **Trust and proof.** Hanzo's figures only (2,137+ repositories · 122 organizations), shown under the OSS track's title.
6. **Content (copy untouched).** Parity 57/57, links 5/5, 0 strings outside Hanzo's copy. Counters ("01 / 04") and the tracks' meta lines sit under their titles, never above. The card beside the form uses the form's own labels; the invented "Filed as / Department / Affiliation" labels are gone.
7. **Visual design.** Grey deck, 0 UI hues (the gold is gone); the Sigil draws in ink. One dark room (the three ways), whose light sheets are marked `data-room="light"` so buttons and focus follow.
8. **UI components.** System `.x-btn`; the track control is a radiogroup with a gliding pill and arrow keys; labelled inputs with autocomplete.
9. **Motion.** Signature: stacked sheets (scroll). Idle: the Sigil field drifts and bends toward the pointer (pointer). State: the track pill glides; the card fills as you type; the sent state. Scroll: the timeline draws once. Arrival: CSS line cut-in from the first paint.
10. **Media.** Hanzo's generative Sigil (seeded by the page, its own figures); product-style sheets and the application card.
11. **Mobile.** The timeline becomes a vertical line; sheets stack without pinning; one-column form; full-width ask.
12. **Accessibility.** Radiogroup with roving tabindex; `role=alert` errors; `role=status` success; reduced motion freezes the Sigil and shows final states.
13. **Performance.** Sigil pauses off screen; transform-only sheets.
14. **SEO.** All text server-rendered; `NoJs` shows every final state.
15. **Catalogue.** Does not apply.
16. **Developer experience.** Does not apply.
17. **States.** Idle, sending, sent ("Application Received", "Submit Another Application"), error with Hanzo's own fallback line (grants@hanzo.ai). It sends exactly what hanzo.ai sends (one marketing lead), tested only with interception.
18. **Measurement.** `data-cta` on every primary. Ledger: deleted the gold accent, the eyebrows, the invented filing labels and the forked buttons.
