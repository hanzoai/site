# /founder coverage (PLAN-COMPONENTS areas 2.1–2.18)

Page file: `components/pages/Founder.jsx` (+ `Founder.claim.js`) · gallery: `docs/gallery/founder/`

1. **Strategy and conversion.** One ask, Hanzo's "Claim a merged pull request" (jumps to the claim form): the solid button in the hero (`data-thumb`, `data-cta="founder.hero"`), the sticky ask bar after it, and "Send the claim" as the one solid button in the claim screen (`founder.claim`). "Find an issue" is a text link.
2. **Information architecture.** Header and footer untouched. Hero, the levels (pinned scene), the counter, repositories and open bounties (dark room), claim, questions.
3. **First impression.** No label above the h1 ("Founder Program" labels the pull request window). The headline cuts in; within 1s the pull request starts merging itself.
4. **Conversion system.** `data-thumb`, `data-cta`, one solid per screen; the dark room is marked `data-ask-hide` so the bar never covers its button.
5. **Trust and proof.** Hanzo's thresholds only (first merged pull request; three, or 1,000 lines merged); "granted by hand", "no third level" kept beside them.
6. **Content (copy untouched).** Parity 37/37 text (the one "missing" link is Cloudflare's email-protection artifact; the real mailto is on the page). The counter's labels are Hanzo's ("Merged pull request", "lines merged", the level names and rewards); the invented question and hint are gone.
7. **Visual design.** Grey deck, 0 UI hues (GitHub green/purple replaced by ink; open = outline badge, merged = filled). One dark room.
8. **UI components.** System `.x-btn`, kit `Faq`, big labelled inputs with autocomplete, steppers as real buttons.
9. **Motion.** Signature: the merge counter scrubbed by scroll (0 → 3 merged, the levels pour). Idle/time: the hero pull request merges itself. State: the level card answers the counter; the sent state. Pointer: buttons press, bounty rows nudge. Arrival: line-mask headline.
10. **Media.** Product UI: the pull request with its diff, the level cards, the GitHub list.
11. **Mobile.** The scene is laid flat (all levels lit) under 900px; full-width ask; ≥44px targets.
12. **Accessibility.** Labelled form fields, `role=alert` on refusal, `role=status` on sent; FAQ answers stay in the HTML.
13. **Performance.** Transform/opacity only; the merge loop stops off screen.
14. **SEO.** All text server-rendered.
15. **Catalogue.** Does not apply.
16. **Developer experience.** The claim takes a GitHub pull request URL from Hanzo's four orgs, checked before sending.
17. **States.** Live bounties: reading, ready, none, unreachable. Claim: idle, sending, sent, refused (with the support@hanzo.ai fallback). It sends exactly what hanzo.ai sends (marketing lead, then the founder-apply form), tested only with interception.
18. **Measurement.** `data-cta` ids `founder.hero`, `founder.claim`. Ledger: deleted the GitHub hues, the invented counter words and the forked button styles.
