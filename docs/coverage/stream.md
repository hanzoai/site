# /stream coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/cloud/Stream.jsx` · styles `Stream.css` · shared: `components/v2/StageHero` (frame), `Finale`, `x-hamilton/{Demo,Launch.css}` · gallery: `docs/gallery/stream/`

1. **Strategy and conversion.** Persona: a team running Kafka clients who would rather not run a Kafka cluster. Goal: open the repo and point a client at it. One ask, Hanzo's GitHub link (hanzoai/stream): "GitHub" solid in the hero (`data-thumb`, `data-cta="primary"`), the ask bar after the hero, and "View on GitHub" as the one solid in the closing band (same href). Metric id: `cta_click:stream.primary`.
2. **Information architecture and navigation.** Header and footer unchanged. Order: the partitions running → the facts on a sideways tape → the one line that changes (code + API checker) → one dark ending: "Point the bootstrap server at it" and the ask beside one partition still running with its committed offset, then Get Stream with the agent prompt.
3. **First impression and page narrative.** At 1470×801 the four partitions run full-bleed above the h1, its caption ("Kafka Wire Protocol", under the h1), the lede and the ask, all on the first screen; the committed offset rides lane 1 and a bad batch bounces within seconds. Ends in a band repeating the ask.
4. **Conversion system.** Kit `<Cta>`; one solid per viewport; "Deploy to Cloud" is a text link.
5. **Trust and proof.** Hanzo's four figures (Kafka, PubSub, Stateless, Durable) close the tape; the twelve Kafka APIs Hanzo lists drive the checker; repo chip shows "4 stars" from Hanzo's page.
6. **Content presentation (copy untouched).** Parity 75/75 text, 2/2 links. One fact per tape stop; the offset label sits under each headline.
7. **Visual design system.** Ink, greys and white only: records are silver on black, the committed-offset marker is a white chip, INVALID_RECORD is an outlined word, read records fill with ink. One dark room (the hero) and the dark closing band.
8. **UI component library.** Kit `Cta`, `Copy`, Frame `Code`; the checker is a real labelled input with answer buttons (press scale, hover border); no browser-default controls, no `title=`.
9. **Motion and interaction.** Idle: the partitions run, the consumer goes down and comes back, a batch bounces (with Pause); the closing partition keeps running under its committed offset (with Pause). Scroll: the hero clips into a card; the facts slide sideways and the committed offset counts. State: the checker lights the matching APIs as you type.
10. **Media.** No Hanzo media for Stream; objects are the partition tape, the records and the producer code.
11. **Mobile and responsive.** The hero tape stays full-bleed; the heading sits above the rail and the facts become a swipe rail from the 16px gutter with proximity snap and a peek; code stacks under the checker; no page sideways scroll; text ≥14px.
12. **Accessibility.** One h1; 44px Pause on the running tape (WCAG 2.2.2); the checker answer is `aria-live`; contrast ≥4.5:1; reduced motion stops the tape and shows the final state.
13. **Performance and engineering.** The tape is a CSS transform loop paused off screen and on Pause; the sideways tape is one transform from scroll; no canvas.
14. **SEO and machine files.** Metadata and JSON-LD unchanged; every word in the server HTML.
15. **Catalogue and product pages.** Product anatomy: identity, facts, how to use it (code), Get, band.
16. **Developer experience.** The producer/consumer code with the bootstrap line marked; agent prompt with honest Copy.
17. **States and resilience.** Consumer states: committed, down with offset kept, back where it left off; invalid batch refused. JS off shows every word.
18. **Measurement and handover.** `data-cta`: primary, deploy, close. Filmed at 1470×801 and 375×812, no console errors.

**Ledger (deleted):** the teal accent and glows, the red INVALID_RECORD chip, the teal marker, the offset labels above the fact headlines, the eyebrow above the h1, the magnetic primary.
