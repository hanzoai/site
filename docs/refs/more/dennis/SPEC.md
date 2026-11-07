# dennissnellenberg.com: SPEC

Filmed 7 Nov 2026 (home page). Films: `desktop.mp4` and `phone.mp4`. Frames: `frames/`. Method: `../INDEX.md`. jQuery 3.5.1 was served from the cdnjs mirror because `code.jquery.com` is blocked; nothing else was blocked. The site uses GSAP 3.9.1 + ScrollTrigger, Barba page transitions and Locomotive Scroll. Locomotive moves a transformed container, so the desktop wheel walk could not see the page move (the phone walk did scroll). The card click missed in both walks (Locomotive had moved the link off screen), so the **curtain transition was measured by a separate in-page probe** that clicks "Work" and samples the curtain every frame (`/root/lab/q_dennis_curtain.js`).

**Why it is in James's family:** a 220 px name line runs across a portrait like a logo, with asymmetry around it (a location pill hugging the left edge, the role at the right). Every ask is magnetic and fills from below, a page change is a dark curtain with a curved edge, and the footer has a live local clock. Little is static, yet nothing shouts.

**Honest verdict:** the canonical source for magnetic asks and a curtain page transition. The site is from 2022, built on an older stack, and its ask fill is a brand blue. Take the timings, not the colour or the libraries.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` | White, nothing painted yet |
| `desk-02` | The loader: a flat `#141517` screen |
| `desk-03` | Hero: grey `#999d9e` stage, portrait in the centre, "© Code by Dennis" top left, "Work About Contact" top right, a dark "Located in the Netherlands" pill with a globe on the left edge, an arrow and "Freelance Designer & Developer" on the right, and "…s Snellenberg —" at 220 px across the lower third |
| `desk-04` to `desk-09` | The same hero (the page did not move for the walk); the name line keeps rolling between frames |
| `desk-10` to `desk-14` | The card click missed, so the hero again, now with a round dark menu button popped in at top right |
| `phone-p1` | Dark loader |
| `phone-p2` | Phone hero: portrait, the name line at 144 px, "• Menu" top right |
| `phone-p4/p5` | Intro text with a round dark "About me" ask; project cards (TWICE, The Damai) and a "More work" pill |
| `phone-p6` | Dark footer: "Let's work together", a round blue "Get in touch" ask on a rule, email and phone as outlined pills, socials, "Local time 03:40 PM GMT+1" |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Magnetic asks | the ask moves (pointer offset from its centre ÷ size − 0.5) × strength, and its label by half that; **1.5 s Power4.easeOut** while moving, **1.5 s Elastic.easeOut** back on leave; desktop only (over 540 px) | from code |
| Magnetic strengths | round asks 100 / label 50 (so up to ±50 px); menu 50/25; pill asks 25/15; menu links 24/12; header links 20/10 | from code (`data-strength`) |
| Magnetic settle | still moving at the last sample, 1,000 ms after the pointer arrives | measured (hover probe) |
| Ask fill | an ellipse 150% wide rises from 76% below to 0, **0.6 s Power2.easeInOut**, and leaves upward the same way; label turns white in 0.3 s Power3.easeIn | from code |
| Logo hover | "©" turns 360° while "Code by" slides away, **500 ms cubic-bezier(0.7, 0, 0.3, 1)**; the link widens 184.7 → 216.5 px | measured + from code |
| Name line | rolls without input: 288 px in 2.4 s (about 120 px/s), one loop per 18 s; reverses when the scroll direction reverses | measured (ambient) + from code |
| Round menu button | appears after 30% of a screen of scroll: scale 0 → 1, **400 ms cubic-bezier(0.34, 1.5, 0.64, 1)** (overshoot); hides in 400 ms `(0.36, 0, 0.66, 0)` | measured + from code |
| Page curtain | URL changes at the click; a `#141517` curtain starts below the screen at **~250 ms** and rises 801 → 0 px by **~700 ms** (0.5 s Power4.easeIn), its top edge bulging 0 → 80 px (10 vh); the next page's name fades in by **~1.3 s**; the curtain leaves upward **~1.40 → 2.10 s** (0.8 s Power3.easeInOut) trailing an 80 px curve; new content rises from +400 px (50 vh) to 0, **~1.55 → 2.50 s** (1 s Expo.easeOut, 0.05 s stagger). Click to settled: about 2.5 s | measured (probe, every frame) + from code |
| First load | "Hello" in 9 languages, a new word every **0.15 s**; then the curtain lifts (0.8 s Power4.easeInOut) and content rises from 50 vh in 1.5 s Expo.easeOut, 0.07 s stagger | measured (GSAP hook) + from code |
| Text on enter | lines rise from 100% in 1 s power3.out, 0.01 s stagger; other blocks rise 2 em and fade in over 1.75 s expo.out | from code |
| Globe badge | wobbles ±15° on a **5,400 ms** loop, `(0.35, 0, 0.65, 1)` | measured + from code |
| Scroll | Locomotive Scroll, smooth on, lerp 0.1; the footer's curved top edge flattens as you reach it (scrubbed) | from code |
| Press | no `:active` rules; pressing only continues the magnetic drift | measured + from code |
| Ambient (no input, 2.4 s) | desktop first screen 9.5%, mid 9.0%, phone 7.5% (the name line) | measured (frame difference) |
| Bundles | curves `(0.34, 1, 0.64, 1)` ×9, `(0.36, 0, 0.66, 0)` ×8, `(.7, 0, .2, 1)` ×6, `(.7, 0, .3, 1)` ×4; durations 0.4 s ×12 | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| Name line (h1) | Dennis Sans **220.5/220.5 px** (max(9 em, 15 vw), line height 1), weight 450, white | 144/144 px |
| Project titles | 77.2/77.2 px, 450 | n/a |
| Closing line | "together" at 90/95.9 px | n/a |
| Body | 17.6/29.3 px, 450, `#1c1d20` | 16/26.6 px |
| Gutter | 235 px content inset; nav 22 px | 20 px |
| Nav | 93 px, transparent, links 17.6 px; hero stage 921 px tall | n/a |
| Round asks | 176×176 circle: "About me" `#1c1d20`, "Get in touch" `#455ce9` (fill `#334bd3`) | same |
| Pill asks | 75 px tall, fully round, 1 px inset ring at 18% ink: "More work" 176×75, email 305×75 | full width |
| Palette | ink `#1c1d20`, curtain `#141517`, stage `#999d9e`, light `#e9eaeb`, white; blue `#455ce9` | same |

## The 5 moves it gives Hanzo
1. **Magnetic asks that fill from below.** Strength 100/50 on a 176 px round ask (up to ±50 px), 25/15 on pills, 20/10 on links; 1.5 s Power4.easeOut, Elastic return; the fill rises in 0.6 s Power2.easeInOut. Fill in white or silver. *Suits: the one ask on home, product pages, pricing, contact, careers.*
2. **The curtain with a curved edge, carrying the next page's name.** Up by 0.7 s, name in by 1.3 s, off by 2.1 s, content risen by 2.5 s. *Suits: route changes between product pages (Chat, Dev/CLI, agents, cloud) and into a model launch.*
3. **A name line that rolls and answers scroll direction.** 220 px, one loop per 18 s, reversing with scroll: ambient motion that also responds. Use a name Hanzo already has (a product or model name). *Suits: model launch, careers, team.*
4. **The sticky round menu that springs in after the hero.** Scale 0 → 1 in 400 ms with overshoot `(0.34, 1.5, 0.64, 1)`, out in 400 ms ease-in. This is James's rule 5 shape. *Suits: every page, desktop and phone.*
5. **A logo that plays, a clock that is live.** "©" spins 360° and words slide in 500 ms `(0.7, 0, 0.3, 1)`; the footer shows local time updated every second. *Suits: the shared header; contact, careers and team (office times).*

## Gaps (do not copy)
- The blue `#455ce9` fill is a brand hue. Hanzo's fill is white, silver or black.
- On the work list, a preview image and a round "View" button follow the cursor with lag (1/12 and 1/7 of the gap per tick): a custom cursor follower. Anchor previews to the row instead.
- No press state anywhere. Add translateY(1px) or scale 0.98.
- 2.5 s from click to settled is long for docs and pricing pages; keep the curtain for big moves only.
- jQuery, Locomotive Scroll and Barba are an old stack. Take the values, not the libraries.
