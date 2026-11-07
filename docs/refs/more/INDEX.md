# Reference Lab 2: more sites in James's family

Status: **in progress.** SPECs land one site at a time; the ranked pattern library is filled in as each site is measured.

Rules used here (from `docs/JAMES.md`):
- Values are marked **measured** (filmed and read from the live page in Chrome for Testing 156 at 1470×801 and 375×812) or **from code/write-up** (read from the site's own CSS/JS bundles or a published write-up).
- Anything with one of James's banned tells is rejected, even if it won an award.
- The cloud box has no GPU, so WebGL is off in the films (it ran at 3.5 fps). Canvas scenes are described from code.
- Hosts still blocked are listed in `docs/refs/TO-FILM.md`.

## The 20 picks

| # | Site | Kind | Award / standing (verified) | Why James would love it | Filmed? |
|---|---|---|---|---|---|
| 1 | vercel.com | Dev platform | Category leader; Geist type system | Black, white and grey only, which is Hanzo's own palette. Huge tight display type and one sticky ask | Yes |
| 2 | cursor.com | AI product | Category leader | The product UI is the hero and runs itself, with a calm editorial page around it | Yes |
| 3 | raycast.com | Dev / AI product | Category leader | Dark, high-contrast stage, a product object on every screen, keyboard-tactile hover details | Yes |
| 4 | raycast.com/ai | AI product page | Same | An AI feature told as a product story, with models listed as proof | Yes |
| 5 | deepmind.google/models/gemini | AI-lab model launch | Google DeepMind | A model told as a story: film-led hero, benchmarks as figures, quiet proof | Yes |
| 6 | deepmind.google/models/veo | AI-lab model launch | Google DeepMind | Many real outputs on screen at once, with the model's media as the only colour | Yes |
| 7 | basement.studio | Studio | Awwwards Site of the Day + Developer Award, 25 Apr 2025; FWA Site of the Day, 29 Mar 2025 | Big confident type, dark stage, a live 3D object, fast and heavy on detail | Yes (some images blocked) |
| 8 | obys.agency | Studio | Awwwards Studio of the Year 2023 | Editorial grotesk at logo scale, monochrome, playful but restrained micro-motion | Yes (project images blocked) |
| 9 | locomotive.ca | Studio | Awwwards Agency of the Year 2023; site Site of the Month 2023 | Editorial asymmetry, smooth scroll, case cards that open into their page | Yes (showreel blocked) |
| 10 | darkroom.engineering | Studio | Authors of Lenis (the smooth-scroll library most award sites use); no award verified | The source of the "measured smooth scroll" feel James calls premium | Yes |
| 11 | dennissnellenberg.com | Portfolio | Awwwards Site of the Day, 4 Apr 2022 (older than 2024, kept as the canonical source of magnetic asks) | Magnetic buttons, a curtain page transition, big type with a rotating globe badge | Yes (jQuery served from the cdnjs mirror) |
| 12 | linear.app | Dev product | Category leader | Pinned product UI, quiet monochrome, short reveal motion | No: blocked |
| 13 | lusion.co | Studio (WebGL) | Awwwards Site of the Year 2023 (Lusion v3) | Project cards that open into their page over one live 3D stage | No: blocked |
| 14 | exoape.com | Studio | Awwwards Site of the Day and Site of the Month, May 2022 | Editorial type, route transitions with clip masks | No: blocked |
| 15 | igloo.inc | Product / brand | Awwwards Site of the Year 2024 + Developer Site of the Year (by abeto) | One 3D object told by scroll, with easy navigation (jury note) | No: not on allow list |
| 16 | osmo.supply | Product (dev resource) | Awwwards Site of the Day, 16 Dec 2025 | Dennis Snellenberg's 2025 work: a product library with crafted micro-motion | No: not on allow list |
| 17 | arc.net / diabrowser.com | Product | Category reference | Playful but restrained pointer detail | No: not on allow list |
| 18 | family.co | Product | Category reference for micro-interactions | Every tap answers with a spring | No: not on allow list |
| 19 | openai.com model launch pages | AI-lab launch | Category leader | The closest peer to anthropic.com launches: a model as a story, with benchmarks as hero figures | No: not on allow list (and bot-protected) |
| 20 | runwayml.com | AI product | Category leader | Film-led AI product: the model's own output is the colour, on a black and white stage | No: not on allow list |

## Rejected (banned tells)

| Site | Standing | Why it fails James's test |
|---|---|---|
| stripe.com | Category leader | The hero is a multi-colour animated gradient wave (purple, blue and orange): a banned purple-to-blue gradient, and colour from a box, not from media |
| landonorris.com | Awwwards Site of the Year 2025 (OFF+BRAND) | Neon lime-green accent all through the page: "green accents" |
| Messenger by abeto | Awwwards Site of the Year 2025 | A game world, not a product or studio page; nothing a Hanzo page can reuse without looking like a toy |
| cuberto.com | Long-time Awwwards studio | Built around a custom cursor follower, a cousin of the banned "cursor beam or glow" |
| elevenlabs.io | AI product | Gradient orbs in purple and blue as the brand object |

## Pattern library

Filled in from the SPECs as each site lands. See each `docs/refs/more/<site>/SPEC.md`.
