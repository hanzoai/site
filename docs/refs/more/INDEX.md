# Reference Lab 2: more sites in James's family

Twelve SPECs: 11 pages filmed and measured on 9 sites, plus Lusion read from its code. Each folder holds `SPEC.md`, `desktop.mp4`, `phone.mp4` and `frames/`. Lusion has no films.

**Start here:** the ranked pattern library below. Each pattern names its source, the values, and the Hanzo page types it suits. The SPEC for each site has the frames and the full tables.

## How the values were taken
- **Browser:** Chrome for Testing 156, at 1470×801 and at 375×812 (phone, touch).
- **The walk:** arrival with no input, a pointer sweep, hover and press on the asks, one 400 px wheel step sampled every frame, a scroll walk sampled every 220 px, a mid-page pause, a card click, then the phone menu and a swipe walk.
- **The readings:**
  - every animation the browser ran (duration, delay, easing, keyframes)
  - GSAP tweens where present
  - pinned, scrubbed and revealed elements
  - pixel change with no input over 2.4 s (motion that is not scroll)
  - type, spacing and colour
  - a scan of the site's own CSS and JS for curves, durations, springs and Lenis settings
- **Labels:** "measured" means read from the live page. "From code" means read from the site's own bundle.
- **WebGL is off in every film.** The cloud box has no GPU, and WebGL ran at 3.5 fps, which would have broken every timing. Canvas scenes are described from code.
- **Workarounds, disclosed in each SPEC:**
  - Dennis Snellenberg's jQuery came from the cdnjs mirror (its own host is blocked).
  - Locomotive was filmed with a copy of its `app.js` that skips the 3D ring when WebGL is missing. Without that, the site never leaves its preloader.
- **Blocked hosts** are listed in `docs/refs/TO-FILM.md`. Linear, Exo Ape, Igloo and others could not be reached.

## What was filmed, and what to take from each
| SPEC | Verdict | Take | Do not take |
|---|---|---|---|
| `cursor/` | The product runs itself; the best ambient reference | Self-running demo, AI waiting states, product on a painted ground | 26 px h1, one green status border |
| `raycast-ai/` | A whole AI conversation plays by itself in about 15 s | Self-playing chat, use-case chips, one-box pricing, FAQ | **Inter, red kickers over headings (banned): motion moves only** |
| `raycast/` | Objects that type and switch on their own | Self-typing keyboard, phrase wall, glass header, lit-key ask | **Inter, colour-gradient cards (one green): motion moves only** |
| `deepmind-veo/` | 57 films on a white, ink and grey page: media is the only colour | Live film hero, many outputs at once, sticky sub-nav | Green and pink chart images, three asks in the hero |
| `deepmind-gemini/` | A model told in order: name, sentence, film, proof, try it | Proof table, progressive-blur header, rising sheet | Three equal asks, hover is only a tint, 34 px phone h1 |
| `dennis/` | The canonical magnetic ask and curtain transition | Curtain transition, magnetic ask, marquee that answers scroll, sticky round menu | Blue fill, hover preview that follows the cursor, 2022 stack |
| `obys/` | The brand mark does the work; strict black and white | Mark that frames the focus, line cut-in, clip-from-centre preview | Counting loader (about 7 s on phone), 11.2 px body. Desktop film stuck on the loader; values from code |
| `darkroom/` | The best smooth scroll and press | Lenis glide, inverting ask with press, pinned film stage, grid-locked h1 | The single red `#e71419` (use white or silver); dead first screen |
| `locomotive/` | The best "hover shows a preview" list | Preview list, letter shuffle, pixel-resolve image | **Emojis in the h1 (banned): moves only**; no filled ask, no press |
| `basement/` | Near-solid display type on a black stage | 87/78 h1, logo wall that answers the pointer, sticky heading over rows | Orange `#ff4d00` hover, 30 px text glow, hard-cut page change |
| `vercel/` | Type and palette, not motion | Monochrome token ladder, light-weight display type, one ask in two weights | No press, background-only hover |
| `lusion/` | From code only: the 3D card-to-page studio | Decoding hover label, heavier scroll, two-curve token set | Sound on hover, GPU-only stage |

## Ranked pattern library
Ranked by how directly each one answers what James asked for in `docs/JAMES.md`: card-to-page, motion that is not scroll, every tap answers, one live object per section, colour from media, display type.

| # | Pattern | Source | Values | How known | Hanzo page types |
|---|---|---|---|---|---|
| 1 | **Self-running product window** | Cursor, Raycast, Raycast AI | Cursor: selection box glides `top/width/height` 150 ms (0.4, 0, 0.2, 1); rows enter translateY(8 px) scale(0.97) → none over 280 ms; check pops from scale 0.4 in 280 ms. Raycast: types its own query, dock switches tool (about 13 s, then about 5 s), active icon 54 → 68 px. Raycast AI: a full conversation (thinking, tool, streamed answer, follow-up) in about 15 s, text 406 → 990 characters. First-screen pixel change with no input: Cursor phone 28.3% | measured | home hero, Chat, Dev/CLI, agents, cloud |
| 2 | **Card-to-page curtain** | Dennis (+ Obys, Lusion) | Dennis: curtain rises by about 0.7 s (0.5 s Power4.easeIn) with an 80 px curved edge; next title in by about 1.3 s; curtain leaves 1.4 → 2.1 s (0.8 s Power3.easeInOut); content rises from +50 vh by about 2.5 s (1 s Expo.easeOut, 0.05 s stagger). Obys: preview opens from the centre, clip-path inset(50%) → 0 in 800 ms (0.16, 1, 0.3, 1), image scale 1.15 → 1 over 1,600 ms. Lusion: the next page starts from a texture of the current view, and an overlay covers loading | measured (probe) + from code | customers to case study, models index to model page, careers role, product to product. Shorten to about 1 s for docs and pricing |
| 3 | **Marquee that answers scroll** | Dennis | 220 px name line at about 120 px/s (one loop per 18 s) with no input; reverses when the scroll direction reverses. First-screen change 9.5% with no input | measured + from code | model launch, careers, team, home |
| 4 | **Live film hero, many outputs at once** | DeepMind Veo | Film 1359×629, radius 36, inset 56; white 98/96 h1 over it; poster-to-film crossfade 300/200 ms ease; 53% of the first screen changes with no input. Below: 2×2 film grids and 1282×721 carousels with the next film peeking; 57 videos; each output has a one-line prompt caption (14.5 px `#45474d`) | measured | model pages and launches, home variant, customers |
| 5 | **Sticky sub-nav with the current section lit** | DeepMind Veo | 685×62 pill `#f8f9fc`, 16 px from the top; links 52 tall; current section fills `#121317` (300 ms) with white text (200 ms ease); hover `#e6eaf0` 200 ms; a click glides about 18,600 px in about 650 ms; on phone the pill scrolls sideways | measured | model pages, product pages, pricing, docs (the Apple sub-nav, with Hanzo's one ask at its end) |
| 6 | **Hover that shows a preview** | Locomotive, Cursor | Locomotive: a 112/112 project name opens a picture between its words, width 0 → 1.5 em (168 px) in 450 ms (0.23, 1, 0.32, 1), closes in 200 ms; off on touch. Cursor: the wordmark crossfades to a video, opacity 500 ms (0.4, 0, 0.2, 1) | measured + from code | customers list, models list, solutions, careers jobs, press; the shared header logo |
| 7 | **Every tap answers: invert, light, press** | Darkroom, Raycast, Cursor | Darkroom: fill and text swap in 200 ms (0.23, 1, 0.32, 1), arrow slides 18.4 px, press scale 0.97 in 120 ms. Raycast: 36 px lit-key ask, radius 8, `#e6e6e6` with a 2 px dark ring and inset top light; hover to `#fff` in 200 ms; press to `#cdcece`. Cursor: hover lifts the fill, press drops it back | measured | every ask, the sticky ask bar, pricing |
| 8 | **Magnetic ask with a rising fill** | Dennis | Movement = (pointer offset ÷ size − 0.5) × strength: 100/50 on the 176 px round ask (up to ±50 px), 25/15 on pills, 20/10 on links; 1.5 s Power4.easeOut, elastic on leave; desktop only (above 540 px). Fill: an ellipse 150% wide rises from 76% below in 0.6 s Power2.easeInOut | from code | the one main ask on home, product, pricing, contact, careers |
| 9 | **AI waiting vocabulary** | Cursor, Raycast AI | Shimmer on pending text, background 200% → −200%, 1,500–1,600 ms linear loop; three "working" dots, 3,100 ms loop; caret 1 → 0.5 → 1 opacity, 2,000 ms; tool icons in 100 ms, out 240 ms | measured | Chat, agents, model pages, API; every loading state |
| 10 | **Headline cut into its line / blur-in arrival** | Obys, Raycast AI | Obys: each line rises from translateY(102%) inside a clipped line, 1,400 ms expo-out; meta lines 1,600 ms after 560 ms; hide 300 ms. Raycast AI: blur(10 px) → 0 with opacity, 500 ms ease-out, staggered 0/150/300 ms; the product window rises 10 px over 700 ms from 450 ms | from code + measured | every hero h1; section statements |
| 11 | **Display type that reads like a logo** | Darkroom, Basement, Veo, Vercel | Darkroom: 204 px at 1470, line height 0.8, −0.05 em, caps, words on an 8-column grid (phone 100/80). Basement: 87/78 (0.90), −0.04 em, weight 600 (phone 46/39.2). Veo: 98/96. Vercel: 64/64, −0.06 em, weight 400 | measured | every hero; closing statements |
| 12 | **The brand mark frames the focus** | Obys | The mark sits mid-screen and splits to frame the centred item: halves move ±137% (desktop) or ±65% (phone) in 800 ms–1 s (0.16, 1, 0.3, 1); the mark resizes over 1.6 s (0.19, 1, 0.22, 1). The focused item is in colour; the rest greyscale at opacity 0.7, 400 ms | measured (phone) + from code | home, models gallery, customers. Hanzo's black-and-white mark is made for this |
| 13 | **Logo wall that answers the pointer and idles** | Basement, Vercel | Basement: hovered tile gets a drifting hatch (64 px tile, 10% white lines, fades in over 300 ms (0.4, 0, 0.2, 1), drifts 64 px per 6 s); other tiles dim to 0.5 in 200 ms; on phone, tiles cross-fade on a 16 s loop. Vercel phone: logo marquee, 40,000 ms linear loop | measured | customers, investors, home proof band |
| 14 | **A measured smooth scroll** | Darkroom, Locomotive, Lusion | Lenis lerp 0.125 (Darkroom): a 400 px step reaches 50/90/99% at 173/377/664 ms. Lenis lerp 0.1 (Locomotive): 170/422/784 ms. Lusion's own engine (coefficient 12): 90% in about 190 ms. Native on touch. Vercel and Cursor use plain native scroll | measured + from code | the shared system; all long pages |
| 15 | **Pinned film stage** | Darkroom | Full-bleed films pinned about 1,540 px; title pinned on a mid-screen hairline (354 px from the top); the next film rises from below; footer pinned about 805 px as a curtain | measured | customers, model pages, solutions; the footer of every page |
| 16 | **Colour only from media, on a monochrome ladder** | Vercel, Veo, Cursor | Vercel: page `#fafafa`, ink `#171717`, quiet `#4d4d4d`, hover `#f2f2f2`, dark hover `#383838`. Veo: white, ink `#121317`, quiet `#45474d`; the films are the colour. Cursor: each product window sits on a full-bleed painting | measured | the shared system; product and model pages |
| 17 | **Glass header** | Raycast, DeepMind Gemini | Raycast: floating 1204×76 bar, 16 px from the top, radius 16, 137° rgba(17,18,20,.75) → rgba(12,13,15,.9), blur 5 px, 1 px `#ffffff0f` border; phone 343×58. Gemini: 80 px progressive-blur strip, 5 stacked layers at 4/6/10/18/34 px, each masked to a band, fades in over 200 ms | measured + from code | the shared header |
| 18 | **Proof table with Hanzo's column lit** | DeepMind Gemini | 14.5 px tabular figures; own column filled with 2 px rules each side; best rival tinted `#e1e6ec`; methodology link under the table; on phone it scrolls sideways with the benchmark column sticky | measured | model pages, model launch, pricing |
| 19 | **Quiet pricing** | Raycast AI | Billing pill 129×45, radius 22.5; the lit pill slides in 200 ms ease. Only the middle plan is boxed (radius 16, 137° `#222326` → `#151619`, 1 px `#2f3031`), 16 px higher and 32 px taller. FAQ rows open in 200 ms ease, chevron turns in 400 ms, 700 px column | measured + from code | pricing, API and cloud pricing, FAQ on docs and contact |
| 20 | **Live clocks** | Raycast AI, Darkroom, Dennis | The mock menu bar shows the viewer's real date and time (Raycast AI); live city clocks in the footer (Darkroom); footer clock ticks every second (Dennis) | measured | home, Chat, contact, careers, team |
| 21 | **Text that decodes or shuffles** | Lusion, Locomotive | Lusion: a card label re-types at 40 letters per second with up to 5 random characters leading. Locomotive: 4 shuffles in 250 ms on hover and on page arrival; the copy ends unchanged | from code | model cards, nav labels; once per page |
| 22 | **Image that resolves from pixels** | Locomotive | A canvas at 8/16/32/48/96/128 blocks wide, 100 ms apart, then the real image | from code (seen in frames) | model pages, launches, customers, press; staged loading |
| 23 | **Sticky ask that springs in after the hero** | Dennis | A round button scales 0 → 1 in 400 ms (0.34, 1.5, 0.64, 1) once 30% of a screen has scrolled; leaves in 400 ms (0.36, 0, 0.66, 0) | measured + from code | every page (James's sticky ask after the hero) |
| 24 | **Sheets and the phone menu** | Vercel, Gemini, Basement | Gemini: sheet rises with opacity and scale 0.98 → 1, 250 ms (0.16, 1, 0.3, 1). Vercel's most-used curve is the sheet curve (0.32, 0.72, 0, 1). Basement: bars turn ±45° into an X and shrink to 83.3%, 300 ms (0.4, 0, 0.2, 1); items fade in over 300 ms, 16.7 ms apart, after 200 ms | measured + from code | phone menu, DetailSheet, spec drawers |
| 25 | **Lists that hold still while you read** | Darkroom, Basement, Gemini | Darkroom: row fills in 150 ms (0.23, 1, 0.32, 1), text slides 18.4 px. Basement: heading pinned while rows stack 165 px below it for 1,320 px. Gemini: a 624×737 featured story holds for 880 px while 9 posts scroll past | measured | press, changelog, careers jobs, customers, investors |
| 26 | **Figure plates** | Raycast | Hairline grid with mono figure labels; one part settles from −37 px over 1,500 ms (0.165, 0.84, 0.44, 1), its label rises 20 px over 2,000 ms on scroll-in. Use Hanzo's existing labels only (copy is frozen) | measured | Dev/CLI, cloud, docs-style, model specs |
| 27 | **Two-tone section heading** | DeepMind Veo | A 32/33.9 px / 500 title in ink `#121317` that runs on in `#45474d` at the same size. Only where Hanzo's heading already has two sentences | measured | every section on product and model pages |
| 28 | **HUMAN \| MACHINE switch** (idea, needs James) | Basement | 144×30 mono pill fixed 16 px above the bottom; MACHINE opens a plain-text copy of the site for AI agents. It adds UI and words, so it is not "pure design": James decides | measured (probe) | docs, Dev/CLI, model pages, home |

## Shared motion tokens (what the sites agree on)
| Use | Duration | Curve | Seen at |
|---|---|---|---|
| Colour hover | 150–200 ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Vercel, Cursor, Basement |
| Slide, fill, reveal | 200–450 ms | `cubic-bezier(0.23, 1, 0.32, 1)` or `(0.22, 1, 0.36, 1)` | Darkroom, Locomotive, Raycast, Cursor |
| Sheet, clip, rise | 250–800 ms | `cubic-bezier(0.16, 1, 0.3, 1)`; Vercel's sheet curve `(0.32, 0.72, 0, 1)` | Gemini, Obys, Vercel (code) |
| Big type cut-in | 1,400 ms | expo-out | Obys |
| Spring in with overshoot | 400 ms | `cubic-bezier(0.34, 1.5, 0.64, 1)` | Dennis |
| Press | 120 ms | scale 0.97 (Hanzo rule: translateY(1px) or 0.98) | Darkroom |
| Springs (code) | n/a | stiffness 360 / damping 32 (Cursor); 240 / 28 / mass 0.9 (Vercel) | from code |
| Smooth scroll | 90% in 377–433 ms | Lenis lerp 0.1–0.125; native on touch | Darkroom, Locomotive |
| Ambient loops | shimmer 1.5–1.6 s; dots 3.1 s; caret 2 s; phrase cycle 5 s; logo marquee 40 s | linear | Cursor, Raycast, Vercel |

## Which patterns suit which Hanzo page
| Page type | Lead patterns (by number) |
|---|---|
| Home | 1, 4 or 12, 3, 7, 13, 23 |
| Product: Chat, agents | 1, 9, 6, 16, 23 |
| Product: Dev/CLI, cloud | 1, 26, 9, 17, 20 |
| Model page / model launch | 4, 5, 18, 10, 22, 2 |
| Pricing | 19, 7, 5, 18 |
| Customers / case studies | 2, 6, 15, 13, 25 |
| Careers / team | 3, 20, 25, 2 |
| Press / news | 25, 6, 22 |
| Investors | 13, 11, 25 |
| Contact | 20, 7, 8 |
| Docs-style pages | 5, 24, 21, 9 |
| Every page (system) | 11, 14, 16, 17, 7, 23, 24 |

## The 20 picks
| # | Site | Kind | Award / standing (verified) | Why James would love it | Status |
|---|---|---|---|---|---|
| 1 | vercel.com | Dev platform | Category leader | Black, white and grey only, which is Hanzo's own palette. Big, light display type and one ask, repeated in the sticky header | Filmed |
| 2 | cursor.com | AI product | Category leader | The product UI is the hero and runs itself | Filmed |
| 3 | raycast.com | Dev / AI product | Category leader | Product objects that work by themselves | Filmed. Uses Inter: motion moves only |
| 4 | raycast.com/ai | AI product page | Same | A whole AI conversation plays itself; quiet pricing | Filmed. Inter and kickers: motion moves only |
| 5 | deepmind.google/models/gemini | AI-lab model launch | Google DeepMind | A model told in order, with a quiet proof table | Filmed (hero canvas did not render) |
| 6 | deepmind.google/models/veo | AI-lab model launch | Google DeepMind | Many real outputs at once; media is the only colour | Filmed |
| 7 | basement.studio | Studio | Awwwards Site of the Day + Developer Award, 25 Apr 2025; FWA Site of the Day, 29 Mar 2025 | Near-solid display type on a black stage, a logo wall that answers the pointer | Filmed (images and canvas blocked) |
| 8 | obys.agency | Studio | Awwwards Studio of the Year 2023 | The brand mark does the work, strict black and white | Phone filmed; desktop stuck on its loader |
| 9 | locomotive.ca | Studio | Awwwards Agency of the Year 2023; its site Site of the Month 2023 | Hover shows a preview, letters shuffle, editorial list | Filmed with a WebGL-skip patch. Emojis in h1: moves only |
| 10 | darkroom.engineering | Studio | Authors of Lenis; no award verified | The smooth-scroll and press feel James calls premium | Filmed |
| 11 | dennissnellenberg.com | Portfolio | Awwwards Site of the Day, 4 Apr 2022 (older than 2024; kept as the canonical source) | Magnetic asks, curtain transition, marquee that answers scroll | Filmed (jQuery from cdnjs); transition timed by probe |
| 12 | lusion.co | Studio (WebGL) | Awwwards Site of the Year 2023 (Lusion v3) | Card-to-page through one live 3D stage | From code (3D host blocked) |
| 13 | linear.app | Dev product | Category leader | Pinned product UI, quiet monochrome | Blocked (needs `static.linear.app`) |
| 14 | exoape.com | Studio | Awwwards Site of the Day and Site of the Month, May 2022 | Editorial type, route transitions with clip masks | Blocked (needs `www.exoape.com`) |
| 15 | igloo.inc | Product / brand | Awwwards Site of the Year 2024 + Developer Site of the Year (by abeto) | One 3D object told by scroll | Not on allow list |
| 16 | osmo.supply | Product (dev resource) | Awwwards Site of the Day, 16 Dec 2025 | Dennis Snellenberg's 2025 work | Not on allow list |
| 17 | arc.net / diabrowser.com | Product | Category reference | Playful, restrained pointer detail | Not on allow list |
| 18 | family.co | Product | Category reference for micro-interactions | Every tap answers with a spring | Not on allow list |
| 19 | openai.com model launch pages | AI-lab launch | Category leader | The closest peer to anthropic.com launches | Not on allow list |
| 20 | runwayml.com | AI product | Category leader | Film-led AI product on a black and white stage | Not on allow list |

## Rejected (banned tells)
| Site | Standing | Why it fails James's test |
|---|---|---|
| stripe.com | Category leader | The hero is a multi-colour animated gradient wave (purple, blue and orange): a banned purple-to-blue gradient, and colour from a box, not from media |
| landonorris.com | Awwwards Site of the Year 2025 (OFF+BRAND) | Neon lime-green accent all through the page: "green accents" |
| Messenger by abeto | Awwwards Site of the Year 2025 | A game world, not a product or studio page |
| cuberto.com | Long-time Awwwards studio | Built around a custom cursor follower, a cousin of the banned "cursor beam or glow" |
| elevenlabs.io | AI product | Gradient orbs in purple and blue as the brand object |

Raycast, Raycast AI and Locomotive also carry banned tells (Inter, kickers over headings, emojis in the h1). They were filmed before this was found. They stay in the library **for their motion moves only**; their type, kickers and emojis are rejected.
