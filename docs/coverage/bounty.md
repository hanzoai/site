# /bounty coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Bounty.jsx` · gallery: `docs/gallery/bounty/`

1. **Strategy and conversion.** One ask in Hanzo's words, "Every open bounty" (GitHub search of Hanzo's bounty issues): the one solid button in the hero (`data-thumb`, `data-cta="bounty.hero"`), then the sticky ask bar at every width. "Leaderboard" and "How to contribute" are text links with an arrow.
2. **Information architecture.** Header and footer untouched. Hero with the live window, rewards (the four ways, countable), standings and recent awards, the token race (dark room), how a bounty is taken, propose a bounty.
3. **First impression.** No label above the h1 ("Bounties & Rewards" is the window's own label). "Take an issue. Ship the fix." cuts in; the GitHub window pulses and its open bounties arrive within 1s.
4. **Conversion system.** `data-thumb`, `data-cta`, one solid per screen.
5. **Trust and proof.** Every figure is Hanzo's (rates, standings, token volumes, 217 organizations). The race uses a log line with only Hanzo's own marks (100K, 1M).
6. **Content (copy untouched).** Parity 102/102, links 5/5. Every chip is as Hanzo shows it (the merged pull request tile carries "+$20 AI credits"; only the first award row carries the credits). The old "Where would you rank?" drawer and its sentences are gone; the count lives on the tiles with Hanzo's labels only.
7. **Visual design.** Grey deck, 0 UI hues; GitHub's green and purple replaced by ink and shape cues (filled dot = merged, ring = open). One dark room (the race).
8. **UI components.** System `.x-btn` and arrow links; steppers are real buttons with aria-labels and an `output` with `aria-live`.
9. **Motion.** Signature: the scrubbed race (scroll), with @hanzo's 106,039,884 counting along with it. The tile figures count up once on entry. Time/idle: live GitHub issues arrive, the window pulses, the tiles count through Hanzo's examples until you take over. Pointer: tiles lift, a hovered race lane brightens while the others dim, issues fill, links and steppers press. State: the total marker springs along the standings. Arrival: line-mask headline.
10. **Media.** Product-style objects: the GitHub window, the huge figures, the race, the timeline.
11. **Mobile.** Tiles stack with their stepper under the text; the race lanes become two-line rows; ≥44px targets; no sideways scroll.
12. **Accessibility.** Steppers labelled by the tile's own name; live outputs; reduced motion stops the demo count and shows the race at its end.
13. **Performance.** Transform-only bars; GitHub fetched once; loops stop off screen.
14. **SEO.** All text server-rendered; `NoJs` not needed beyond defaults (no hidden text in the hero window's reading state: Hanzo's "Asking GitHub for the open bounties.").
15. **Catalogue.** Does not apply.
16. **Developer experience.** Links to the repositories, CONTRIBUTING and the GitHub bounty search are kept.
17. **States.** The live window keeps one fixed height in every state, so the headline never moves when GitHub answers: reading (skeleton + Hanzo's "Asking GitHub for the open bounties."), ready (the list, then Hanzo's "Every open bounty"), none (Hanzo's "Propose a bounty" link), unreachable (Hanzo's "Every open bounty" link). No sentences of ours.
18. **Measurement.** `data-cta="bounty.hero"`. Ledger: deleted the rank drawer and its invented sentences, the GitHub hues, and the forked button styles.
