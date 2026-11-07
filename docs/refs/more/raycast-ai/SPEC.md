# raycast.com/ai: SPEC

Filmed 7 Nov 2026 (the Raycast AI product page). Films: `desktop.mp4` (1470×801) and `phone.mp4` (375×812). Frames: `frames/`. Method: `../INDEX.md`. No canvas or WebGL on this page (none found), so nothing is missing from the film. The walk found no card that opens a page, so there are no `desk-10` to `desk-14` frames, and the phone menu did not open (no `phone-p3`).

**Why it is in James's family:** an AI feature told as a product story, with the product as the hero. The first screen is a real chat window on a mock desktop that **holds a whole conversation by itself**: it thinks, runs a tool, streams an answer, takes a follow-up and fixes the bug. Even the mock menu bar shows the viewer's real time. Below it, each section is one statement plus one working panel, and the page ends in a calm pricing table with one boxed plan.

**Honest verdict:** the best reference so far for "the model at work" (James's rule 9: streaming text, staged loading, a live clock) and for a quiet pricing block. The type is small (h1 48 px) and every section has a red mono kicker over its heading, which is a banned tell. Take the demo script, the chips and the pricing, not the headings.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` | Arrival at 0.4 s: the h1 is still blurred while it fades in; nothing else yet |
| `desk-02/03` | Settled hero: h1, grey subline, one light "Download for macOS" key, a 14 px requirements note, then the top of a mock macOS desktop (menu bar with the real date and time) with the chat window "Fix a bug from Linear" over red and blue glass |
| `desk-04` | Screen Awareness card (black glossy ribbon art behind two window mocks), a Custom Agents grid with model names, a row of provider logos, then a red "QUICK AI" kicker |
| `desk-05` | "AI EXTENSIONS" kicker, "Connect your tools", a 2×8 grid of app icons, two small links, and a chat panel showing "Finding last week's meetings…" |
| `desk-06` | "AI COMMANDS" kicker, "Your prompts. One shortcut away.", a launcher list with red command icons fading out at the bottom |
| `desk-07` | Pricing: Monthly / Yearly pill toggle with a "−20%" tag; three plans ($0, $8, $12), only the middle one boxed and raised, each with a Pro / Plus / Max segmented control |
| `desk-08/09` | "Learn more about Raycast for Enterprise →", the FAQ accordion, then the footer and a newsletter field |
| `phone-p1/p2` | Phone hero: h1 at 40 px, subline, the whole chat window on the first screen, then 10 use-case chips wrapping under it. No download ask on phone |
| `phone-p4` | "Any model. One Interface.": a grid of model-provider tiles with the Raycast tile lit red in the centre, fading out at the edges |
| `phone-p5/p6` | The $8 plan with "Start Free Trial"; the FAQ list |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Hero arrival | h1, subline and ask: blur(10 px) → 0 with opacity 0 → 1, **500 ms ease-out**, staggered **0 / 150 / 300 ms** | measured + from code |
| Hero window arrival | rises 10 px and fades in, **700 ms ease-out**, starting at **450 ms** | measured + from code |
| Header asks arrive | visible at 0.81 s, 200 ms ease-in-out | measured |
| The conversation runs itself | no input: "Thinking…" (2 s after load) → "Checked new bugs in Linear" with a count badge, and the answer starts streaming (5 s) → still streaming (8 s) → user follow-up "Can you take a stab at fixing it?" → "Edited 2 files and verified the fix" → "Fixed it." (by 14 s). Window text grows from 406 to 990 characters over about 17 s | measured (probe, text read at intervals) |
| "Thinking" shimmer | background-position 100% → −100%, **1,500 ms linear**, infinite; label colour settles over 300 ms ease when done | measured |
| Tool icon stack | each icon fades in over **100 ms ease-out**, out over 240 ms | measured (Web Animations) |
| Input caret | opacity 1 → 0 → 1, **1,000 ms linear**, infinite | measured |
| Use-case chip click | the chip lights and a new conversation starts within **250 ms** | measured (probe) |
| Use-case chip hover / active | text white 35% → 90%, fill 0 → white 7%, border → white 12%, **150 ms** | measured + from code |
| Live clock | the mock menu bar shows the viewer's real date and time ("Sat Nov 7 2:40 PM" read at 14:40) | measured |
| Demo panels enter | opacity 0 and scale 0.98 → 1, **200 ms ease-out**, when scrolled into view; Quick AI chat fades in over 180 ms | measured + from code |
| Monthly / Yearly toggle | the lit pill slides (translate3d) and the label colour changes, **200 ms ease**; prices swap instantly ($8 → $10, $12 → $15) | measured (probe) |
| Plan tier switch (Pro / Plus / Max) | the price swaps instantly ($10 → $20), no motion | measured (probe) |
| FAQ open | row height (grid-template-rows) and opacity **200 ms ease**; chevron turns over **400 ms ease** | measured (probe) |
| Ask hover / press | fill `#e6e6e6` → `#ffffff`, 200 ms; press only darkens the fill, no transform (same key as the home page) | measured / from code |
| Model tile grid | static: no animations found in 5 s | measured |
| Scroll | **native, not smoothed** (400 px lands in one step) | measured |
| Scroll-linked motion | no pins, scrubs or reveals in a 10,131 px walk besides the panel entrances above | measured |
| Ambient (no input, 2.4 s) | desktop first screen 0.0%, mid page 0.0%, phone 0.3%: the streaming text is too small to register | measured (frame difference) |
| Curves in bundles | `(0.23, 1, 0.32, 1)` ×21, `(0.4, 0, 0.2, 1)` ×17, `(0.4, 0, 0.22, 0.96)` ×11, `(0.215, 0.61, 0.355, 1)` ×9, `(0.24, 0.77, 0.48, 0.94)` ×8 | from code |
| Durations / springs | 300 ms ×128, 200 ms ×90, 150 ms ×43; springs 500/25 and 550/0; `startViewTransition` ×3 | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| h1 | Inter **48/50.4 px** (1.05), weight 500, −1.92 px (−0.04 em), 450 px wide, centred | 40/44 px, −1.6 px (−0.04 em) |
| Subline | 16/24 px, white at 50% | 16/24 px, white at 50% |
| Section heads | h2 32/38.4 px, weight 500, −0.8 px, under a 12 px JetBrains Mono kicker, uppercase, 1.44 px tracking, `#ff6363` | h2 32/38.4 px |
| Price figure | 64/64 px, weight 600, +0.3 px; mono "billed annually" line with the old price struck through | same |
| Hero ask | "Download for macOS": 193×36 at 369 px, radius 8, `#e6e6e6`, text `#2f3031` 14/500; note under it 14 px at white 40% | none on phone |
| Hero window | 1020×800, top at 513 px, so 288 px shows above the fold | 335×217 at 320 px, all on the first screen |
| Use-case chips | 30 px tall, radius 10, 10 chips in 2 rows | wrapping list under the window |
| Header | the same floating glass bar as the home page (1204×76, radius 16, blur 5 px) | 343×58, menu icon only |
| Billing toggle | 45 px tall; lit pill 129×45, radius 22.5, `radial-gradient(#5a5a5a → #1a1a1a)`, blur 2 px | n/a |
| Plan cards | three columns 401 px wide; only the middle is boxed: radius 16, `linear-gradient(137deg, #222326, #151619)`, 1 px `#2f3031`, 16 px higher and 32 px taller; tier control pills radius 999, selected at white 9% | one column |
| FAQ | 700 px wide column, 39 px padding per row, hairline dividers that fade at both ends (from code) | full width |
| Model tiles | 80×80, radius 25%, near-black fill, deep shadow, 1 px top light | 3 columns visible |
| Palette | page `#07080a`, white at 90 / 50 / 40 / 35%, red `#ff6363` for kickers; colour also from the glass wallpaper and app icons | same |

## The 5 moves it gives Hanzo
1. **The conversation that plays itself.** A real Hanzo Chat window runs a scripted exchange with no input: a "thinking" shimmer (1.5 s linear), a tool step with a count, a streamed answer, a follow-up and a finished task, in about 15 s. Only Hanzo's own copy goes in the script. *Suits: Hanzo Chat, agents, model launch, home.*
2. **Chips that drive the demo.** A row of short use cases under the window (30 px, radius 10, white 35% → 90%, fill 7%, 150 ms); a click starts that script within 250 ms and the chip stays lit. *Suits: Chat, agents, solutions, Dev/CLI.*
3. **A live clock in the mock.** The mock desktop's menu bar shows the viewer's real date and time. A small, true "this is live" detail. *Suits: home, Chat, Dev/CLI, cloud console mocks.*
4. **Blur-in arrival.** h1, subline and ask arrive from blur(10 px) with opacity, 500 ms ease-out, 150 ms apart; the product window follows at 450 ms, rising 10 px over 700 ms. *Suits: every hero, model launch.*
5. **Pricing with one box.** A lit pill that slides 200 ms between Monthly and Yearly, three plans where only the middle one is boxed and raised 16 px, an in-card tier switch, a mono "billed annually" line, and one filled ask in the middle plan. *Suits: pricing, cloud and API pricing.*

## Gaps (do not copy)
- **A kicker over every section head** ("QUICK AI", "AI EXTENSIONS", "AI MODELS", "AI COMMANDS") in red mono. James bans an eyebrow over a headline, and red is a hue Hanzo does not have.
- **Inter** everywhere (a banned tell).
- h1 is 48 px; Hanzo heroes need 72 px or more at 1.05 or less.
- Prices change instantly on the toggle and the tier switch. Hanzo should roll or count the figure.
- The first screen reads as still (0.0% of pixels change in 2.4 s) because the streaming text is small, and only 288 px of the window shows at 1470×801.
- Press does not move the ask (no translateY(1px) or 0.98). No ask on phone at all.
- Colour from the red and blue glass wallpaper, the red-lit centre tile and coloured app icons (one green). Use Hanzo's own model imagery instead.
