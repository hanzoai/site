# Hanzo v2: the Apple-grade overhaul (James, 7 Nov 13:10) — read this before DESIGN.md

## What James actually said (his words are the brief)
- "Not enough movement or motion, too many repeats of the same colours, not enough resources… 4/10. It needs to be more immersive. I want at least 8/10."
- "An overload of information… instead of, as you scroll, one thing comes in, one goes out. There's no premium feel."
- "Improve it as an expert would… give it the Apple feel." "A full revamp of every page, every product card, every single little thing."
- "Different spacing, different sizing, different animations. Wow me. Don't disappoint me."
- His references, which must visibly show up:
  - **synchronized.studio** (his favourite: a card you click opens into its page)
  - **osply.co**, **hamol.studio** and **grubogrubo.com**
  - **apple.com**, **chatgpt.com/business/enterprise** and **anthropic.com/claude-sonnet-5-5**
  - **godly.design** and **motion.dev** (the bar and the tooling)

## Why v1 underwhelmed (do not repeat it)
v1 was built to "nothing lost". Every sentence of the old page was crammed onto one long scroll, and fade-ups did the decorating. That passes the checks, but it reads as a document, not a product.
v2 keeps every word (parity still has to pass) but **chapters** it:
- One idea per screen. Detail lives in things you open: sheets, tabs, cards that expand, "see the spec" drawers.
- The HTML still holds everything, collapsed (DESIGN.md already allows this).

## Scale, honestly
About 800 URLs is **about 148 designs**: 131 top-level pages plus 17 family templates. The 544 model pages are one template.
So "every page" means 148 Apple-grade designs, each family template carrying its members' own data and Sigil.

## The v2 system (spacing, sizing, motion: all different from v1)
**Type**, on a fluid `clamp()` scale:
| Level | Desktop | Phone | Weight | Line height and tracking |
|---|---|---|---|---|
| Display | 128 / 96 / 80 | 56 / 48 | 600 | 0.92, -0.05em |
| Headline | 56 | 36 | | |
| Title | 28 | | | |
| Lede | 24 / 21 | | | |
| Body | 19 / 17 | | | 60–68ch |
| Kicker | Zen Mono 13, caps | | | 0.12em |
- At most three sizes per screen. Numbers are huge and tabular, because a figure is a hero.

**Space.** The base unit is 8pt.
- Chapters are 100svh scenes for each big idea.
- Sections have 200–260px of air on desktop and 120px on phone.
- Headlines run to 12–18ch, so they break into strong lines.
- The grid has 12 columns at a max of 1440 with 24px gutters. Use asymmetric compositions (7/5, 8/4) and full-bleed media. Centred-over-three-boxes is banned.

**Colour.** A white canvas and ink, with **one accent per page**, taken from that product's own media.
- No palette repeats on neighbouring pages.
- At most one dark room per page.
- Colour arrives through imagery and real product UI, not tinted boxes.

**Material.**
- Real Hanzo product UI as the hero objects, rendered big and crisp: chat, terminals, dashboards, model cards, code.
- Thin hairlines, soft long shadows, 28px radii on hero objects and 16px on cards.
- No glassy blur on large areas.

**Motion language.** Pick per page: one signature plus at most 3 supporting effects, and execute every one at Apple polish.
1. **Chapters.** Sticky, scroll-scrubbed scenes where one thing comes in as the last goes out: the text pins while the visual changes. This is the Apple product-page pattern, and the default backbone for product pages.
2. **Stage.** The hero object starts huge and settles to its place as you scroll. The camera feel comes from scale, position and clip only.
3. **Open.** Every card opens into its page with a shared-element morph (synchronized.studio). This uses the Morph layer plus `data-morph`, or the WebGL opener for model cards.
4. **Kinetic type.** Line-masked reveals, played once. Variable-weight response is reserved for one moment per page.
5. **Live product.** One demo that runs by itself: chat typing, agents working, a diff landing, a cost race.
6. **Physics.** Drag rails with inertia, magnetic primary buttons, and springs on everything the hand moves. A hover reveals real detail, never just a colour.
7. **Scene changes.** The background and accent shift between chapters, using clip-path wipes. No hard section edges.

Timing: UI 200–400ms, scenes scrubbed to scroll, easing `[0.16,1,0.3,1]`, springs `{stiffness: 300, damping: 30}`. Transform and opacity only, 60fps on an 8 GB Air, and reduced motion shows the final states.

## Page archetypes (one product family, no two pages alike)
| Archetype | Pages | Backbone | Signature options |
|---|---|---|---|
| A. Launch | product pages (chat, dev, agents, each cloud product, apps) | Stage hero → 3–5 chapters → spec sheet → compare → one CTA | live demo, scrubbed build-up, exploded view |
| B. System | platform, enterprise, security, trust | a map you travel: zoom from the whole into one part | layered explode, zoom-into-node, control room |
| C. Catalogue | models, integrations, oss, solutions, templates | filter chips, re-flow, open cards | open-into-page, compare drawer, sort race |
| D. Story | about, history, philosophy, blog, press, careers | an editorial scroll with big imagery | timeline scrub, chapter book, portrait wall |
| E. Utility | pricing, contact, legal, support, forms | calm, precise and fast; one delight | rolling price, step flow, answer-as-you-type |
| F. Developer | cli, api, sdks, mcp, ide | terminal-first, code as the hero | typed session, copy-and-run, diff stream |

## Where each reference shows up (make it visible)
| Reference | What to take |
|---|---|
| synchronized.studio | Every card on catalogue and home opens into its page; the next page's hero is the card you clicked. |
| apple.com | One idea per screen, the product as the hero, sticky chapters, huge type, tile grids of media. |
| osply.co / hamol.studio / grubogrubo.com | Editorial type scale, confident asymmetry, image-led sections, playful cursor-aware details, generous negative space. |
| chatgpt.com/business/enterprise | Calm enterprise trust: big statements, logo walls in motion, security as a calm list of proof. |
| anthropic.com/claude-sonnet-5-5 | A model launch as a story: the benchmark as hero figures, a "try it" moment, crisp comparison charts. |

## Process (how chats work)
1. **Flagships first, set the bar.** The first wave builds six flagships, and each must score 8/10 or better against the references before the wave counts as done:
   - `/`
   - `/models` + `/models/*`
   - `/enterprise` + `/pricing`
   - `/platform` + `/cloud/*`
   - `/chat`, `/dev` and `/agents`
   - `/about`, `/history` and `/blog`

   They put reusable pieces in `components/v2/<Name>.jsx`, one file per piece, owned by the chat that wrote it, with a usage note at the top.
2. **Then waves** of about 10 pages per chat, by archetype, reusing `components/v2/*`.
3. **Proof James can see.** A cloud chat with Chrome records a 10–15s desktop video and phone screenshots of each page. It commits them to `docs/gallery/<page>/` (jpg, webp or mp4, kept small) and links them in the PR. The conductor turns these into a visual "what changed" page with before and after.
4. **Score every page 1–10** against the references in the PR. Only ship 8 or better; anything lower is reworked first.
5. **The rules stay:**
   - Hanzo's header, footer, words, numbers and links (nothing lost, just chaptered).
   - Accessibility, reduced motion and 375px phones.
   - `unique.py` / `variety.py` must pass.
   - No invented figures.
