# Coverage: /agents — components/pages/AgentsPage.jsx

Persona: an agent, or the developer behind one, that must sign up and pay by itself. Goal: the headless sign-up. CTA: "Sign up headless" (`#headless`). Metric: `api_key_created` (and the llms.txt fetch). Brief: PLAN-COMPONENTS 5.8.

- **2.1 Strategy and conversion:** Persona, Goal, CTA and metric are in the file header. There is one solid ask in Hanzo's words, "Sign up headless": in the hero, in the site's sticky ask bar (`data-thumb`, `data-ask-name="For agents"`) and at the close. "Read the docs" is a text link (on v2 it was a second button). `data-cta` is set on `agents.hero` and `agents.close`.
- **2.2 Information architecture and navigation:** Hanzo's header and footer are unchanged. `#headless` lands on the sequence. Agents SDK, llms.txt and Book a call are kept.
- **2.3 First impression and page narrative:** The brief's order is kept: hero, then the literal sequence at `#headless`, then the agent prompt, then the close.
  - The first screen, in the one dark room over Koma's film, has the h1 (cut into its lines), the lede, the one ask and the hero object.
  - The hero object is the sequence as a numbered terminal, already writing its first request within about 1 second.
  - There is no eyebrow above the h1: "For agents" is a folio under the asks.
- **2.4 Conversion system:** The ask is an in-page jump (an arrow points down to the script). The script itself is the try-before-sign-up: every request, verbatim. One solid button per viewport on the page.
- **2.5 Trust and proof:** These are kept as Hanzo states them:
  - the five steps and their endpoints
  - the note on keys and deposit addresses
  - the FAQ, including $0.021, $8 a month, 402/429, Base/Ethereum/Solana and USDC/USDT
  
  Nothing was added.
- **2.6 Content presentation (copy untouched):** Parity is 0 missing (text 221/221, links 4/4). Removed as not Hanzo's words: the "Who is installing?" picker ("Headless agent", "Local inference") and the prompt's "Show all"/"Fold". The whole prompt is now one scroll region labelled by Hanzo's own "Agent prompt". The section labels (For agents, Install, Headless) are folios below their headings.
- **2.7 Visual design system:** Greys only; the v2 amber is gone. Colour arrives only through Koma's film, which plays at full strength. A gradient sits under the text side, with no filter on the film. Steps read as done by a tick and as current by weight and white. Hero objects have 28px radii.
- **2.8 UI component library:** Uses the kit's `A`, `More`, `Faq`, `Copy`, `Film` and `Magnetic`, plus `AppLines` and `AppDemo`. Every button has hover (background, arrow nudge, row shift) and press (scale .98 or 1px down). Gap: no kit `PageHero`, `Band`, `CodeBlock` or one shared `AgentPrompt` yet.
- **2.9 Motion and interaction:**
  - Time (signature): the terminal walks the five steps once. Each request is written out and each step ticks, then it rests on its final frame, with icon Pause or Replay (`AppDemo`). The install block writes itself once.
  - Arrival: the headline cut-in and the terminal rise.
  - State: steps open with a spring on `grid-template-rows`, ticks land, and the step counter rolls.
  - Pointer: tap or hover any step to read its requests; the script index previews on hover.
  - Scroll: `agent.ts` is scrubbed by the scroll on desktop, the only scroll-linked effect.
  - No loops are left (the v2 pulse dot and blinking caret are gone). Reduced motion: final frames, nothing pinned.
- **2.10 Media:** Koma's film plays through the kit's `Film` (only on screen, poster from Hanzo's own `koma.webp`, 187 KB). Gap: no AVIF or H.264 fallback.
- **2.11 Mobile and responsive:** At 375×812:
  - The h1, lede, ask and the top of the live terminal are on the first screen.
  - The script plays once by itself instead of pinning, and the step index scrolls sideways.
  - Targets are 44px or more.
  - No sideways scroll (checked); 320 not checked.
- **2.12 Accessibility (WCAG 2.2 AA):**
  - The terminal's final frame, with every request, is in the server HTML.
  - Steps are buttons with `aria-expanded`.
  - The prompt is a focusable region you read with the keys.
  - Pause is on the only auto-moving content. Focus is a 2px ring with a halo.
  - Gap: no axe run.
- **2.13 Performance and engineering:** Only transform, opacity and grid rows animate. Requests are written into DOM nodes through refs. The demo clock pauses off screen and in hidden tabs, and the film plays only on screen. Gap: LCP, CLS and INP not measured.
- **2.14 SEO and machine files:** The title and description are unchanged, with `JsonLd` route `/agents`. llms.txt is linked.
- **2.15 Catalogue and product pages:** Not applicable. The `/agents/*` family is another chat's template.
- **2.16 Developer experience:** The install block copies all of Hanzo's lines, `agent.ts` copies whole, and the prompt copies whole. Copy equals the displayed text.
- **2.17 States and resilience:** The sequence states are waiting (dim), current (open, writing) and done (tick). JS-off and reduced motion show the finished run. Nothing calls a network API.
- **2.18 Measurement and handover:** `data-cta` is set on both asks. No events are sent, because `lib/track.js` does not exist yet. Proof is in `docs/gallery/agents/` (`desktop.*`, `phone-*`; the `crew-*` and `sdk-*` files there belong to the family chat).

**Ledger (what this page deleted):** the install picker and its four invented labels, Show all/Fold, the amber accent, the endless loops (pulse dot, caret, run loop), the hidden `data-thumb` placeholder, and the kicker above the h1.
