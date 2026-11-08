# Hanzo website revamp: master brief

**How to use this.** Give this whole file, with the `site/` and `src/` folders beside it, to the engineer or coding agent that works in the hanzo.ai website codebase, as the first message. The folder is a working reference: fifteen pages and a brand deck, served from one address. Start it with `python3 -m http.server 4173` in this folder, then open `http://localhost:4173/site/brand.html`. Read the brand deck first, then scroll the pages in the order of the strip at the top.

Everything measured below was read from the live site and from Hanzo's public design system on 6 Nov 2026.

---

## 1. The job

Make every page of hanzo.ai feel as considered as its best screens. The heroes are already good. Below them, most pages lose their identity. Fix that across the whole site, at the level of apple.com and better where this brief says how.

The feeling to hit: **premium, luxurious, subtle, and alive.** Quiet confidence. Nothing shouts, nothing is decoration, everything is precise, and the page answers the person using it. A calm page is not a dead page.

The purpose under the feeling: **simplify the complicated.** Hanzo's product is deep and intricate. A visitor should understand what a page offers in five seconds, find proof in thirty, and reach detail only when they ask for it.

**It is not one template.** One system, and no two pages alike. Every page type shares the tokens and components, then gets its own idea, its own object and its own moment (section 6).

### Do not change

1. Any hero, on any page. Match the vibe of the hero as the page continues below it.
2. The home page section "Frontier AI for everything you build" (the Enso, Kai, Zen, Iro, Koma, Oto, Koe, Uta, Mori cards). These cards are the reference for all art on the site.
3. Any word, number, price, link target or legal text. **This is pure design.** If copy is too long for a layout, change the layout. Labels inside a visual reuse words already on that page. Sample data in an illustration is marked Example and Hanzo confirms it. The only new words allowed are function labels a control needs, such as Copy, Replay, Search or Skip to content.
4. The brand: monochrome, Zen and Zen Mono, the halftone dot field, the mono capital labels, pill buttons.
5. `/platform`. It is the strongest page on the site. Treat it as a second reference.
6. The header and the footer. The reference shows stand-ins for both.

---

## 2. Built on Hanzo's own design system

Hanzo already publishes a design system: `github.com/hanzoai/design`, package `@hanzo/design` (read at commit `12408ef`). The redesign uses its token names and values and obeys its rules. The reference stylesheet copies the token block only so the folder runs alone; in the codebase replace that block with `@import "@hanzo/design/styles.css"` and keep `npx hanzo-design-lint` green.

**Rules of the system that the redesign obeys**

- The atom: "Monochrome. True black. White type. Colour only as state, never as decoration."
- Hover changes colour only. Never a transform.
- No springs, no bounce, no parallax, no carousel that moves by itself.
- Sentence case. Capitals only for eyebrow labels.
- One primary action per view.
- Raise a surface or outline it, never both.
- Icons from the one set (lucide), for actions and status only.
- Motion tokens: `--duration-press` 90ms, `--duration-fast` 150ms, `--duration-base` 300ms, `--duration-slow` 400ms, `--duration-slower` 500ms; `--ease-out` `cubic-bezier(0,0,.2,1)`, `--ease-in-out` `cubic-bezier(.4,0,.2,1)`, `--ease-emphasis` `cubic-bezier(.16,1,.3,1)`; `--stagger` 60ms; `--entry-rise` 16px (24px large).

**What the system has and the live pages barely use**

- The golden ramp `--golden-1` to `--golden-9` (4 to 188px) and `--golden-split` (38.2% and 61.8%).
- The thin weight preset `.zen-air` (220).
- The larger steps of the type scale (40, 52, 64, 84, 112px).

**Amendments this brief proposes.** Each one is a request to add to the system, not a quiet break of it. Approve or strike each line before building.

1. **Larger marketing type.** Section headings move from 26px up the existing scale to 36 to 64px. (The reference tops out at 68px; use the 64px step.)
2. **Golden rhythm.** Section padding runs `clamp(var(--golden-7), 11vw, var(--golden-9))`. Grids divide 8 and 5 over 13 columns, which is the golden split.
3. **Thin figures.** Every large figure is set in Air (220). It is what makes the numbers read as luxury instead of dashboard.
4. **Arrivals tied to scroll.** The system's entry is a timed fade and 20px rise. The redesign keeps the fade and the rise and ties them to scroll position, so nothing plays late or twice.
5. **A figure settles, it never counts.** Characters rise into place 35ms apart, showing the true value only. This replaces the count-up from zero on the live site.
6. **Arrivals that draw.** A hairline draws in 900ms, line art in 800 to 1,400ms. Both run longer than `--duration-slower`. Interface motion stays inside 90 to 500ms.
7. **Real-time evidence.** A race bar or a boot log runs for as long as the thing it shows really took.
8. **One pinned scene** on pages with a real sequence, with a plain-list fallback.
9. **Pointer light.** A soft light follows the pointer across a surface. It is a colour change, so it sits inside the hover rule.
10. **The dock.** A floating bar at the bottom with the page's sections and its one action.
11. **Segmented control.** The selected segment is one light surface that slides to the choice.
12. **Model marks.** Line art generated from each model ID.
13. **Retire the "three-column feature grid"** from the system's page prompt. It is the pattern this redesign removes.
14. **Five rooms.** Silver (a light gradient with a sheen that follows the pointer) and graphite (`#171717`) join paper, quiet and black, so a page changes material without repeating one.
15. **Pointer answers with movement, inside limits.** A card tilts up to 2.5 degrees, a solid button leans up to 22px toward a nearby pointer, strokes part by up to 12px under it. Only with a fine pointer; never on touch. The hover-is-colour-only rule stays for everything else.
16. **Depth on art, never on words.** Art drifts up to 140px against the page across its travel through the screen.
17. **A live halftone field** on the GPU behind black rooms and closing sections. It pauses off screen.
18. **Smooth scroll and page transitions.** A small scroll weight (Lenis) and a 500ms crossfade between pages, with the header and dock held in place.

---

## 2b. The immersion layer

The first build obeyed the system to the letter and scored 4 out of 10: not enough movement, the same three colours in the same order on every page, and nothing built from the references. This layer is what lifted it. It is one stylesheet and one script (`site/assets/immersive.css`, `immersive.js`) on top of the shared system, and every part of it degrades to the plain page without script or with motion off.

| Instrument | What it does | Where |
|---|---|---|
| **Rooms** | Paper, quiet, silver, graphite, black. Each page has its own sequence; no page repeats the last page's | Every page |
| **Bloom** | A dark room enters as a rounded card inside the gutters and opens to the full width as it is reached (`clip-path`, tied to scroll) | Every dark room |
| **Field** | The room's own halftone, drawn on the GPU: it breathes, parts around the pointer, ripples where it is pressed. In white on black rooms, in ink on closing sections | Black rooms, closing sections |
| **Depth** | Art sits a layer behind the words and drifts a little slower than the page | Tiles, marks, case cards |
| **Words** | Section headings arrive one word after another from under a line, 50ms apart | Every `h2.display` |
| **Scene** | A stage sticks while its steps pass; the page's own script listens for progress. On Models one mark becomes the next family, holding on each | Models, Enterprise |
| **Ticker** | One line of the page's own words, very large and very thin, moving; still off screen and under the pointer | Home, Models |
| **Answer** | Buttons lean toward the pointer and settle back; cards tilt a few degrees; strokes part and brighten; the light already follows | Everywhere with a fine pointer |
| **Header** | Reads the room under it and turns dark over dark rooms | Every page |
| **Between pages** | The page crossfades and settles 14px; the header and dock are held. A curtain lifts once per visit, in under 1.2s | Every page |
| **Scroll** | Lenis at a lerp of 0.085 on wheel only; touch scrolls natively. Nested scrollers (the rail, code, the dock strip) are left alone | Every page |

Limits, so it stays premium: one field per room, at most two moving things on their own per screen, nothing on touch that needs a pointer, nothing at all under reduced motion, every loop paused off screen. Measured after the change: 54 to 60 frames a second on every page, no layout shift, no sideways scroll at 375, checker clean.

What the references measured, for comparison: linear.app runs 83 animations at once with 7 distinct large surfaces, 9 gradients and 14 masks; vercel.com 4 surfaces and one canvas. The first build had 3 surfaces and no field.

---

## 3. What the audit found

All 892 pages in the sitemap were fetched and measured. They come from a small set of templates, so the work is templates and shared components, not 892 hand edits.

| Page type | Pages | Measured today |
|---|---|---|
| Model pages `/models/*` | 543 | 2 sections, 4 headings, one code block. No image, no art, on any of them. |
| Top-level pages (products, company, pricing) | 131 | Mixed. Home, Platform and Models index are strong. Most others fall back to grey cards. |
| Open-source projects `/oss/*` | 56 | A median of 33 identical grey stat boxes per page. No visuals. Many boxes show a zero. |
| Cloud services `/cloud/*` | 42 | One section, about 800 characters, one terminal. Thin. |
| Benchmark reports `/benchmarks/*` | 27 | A table on every page. No chart on any. |
| Integration guides `/integrations/*` | 19 | Code on every page. No "on this page" navigation. |
| Solutions `/solutions/*` and `/enterprise` | 19 | Centred heading, then rows of equal grey icon cards. |
| Blockchain `/blockchain/*` | 17 | About 7 headings and 17 sub-headings per page, text and code only. |
| Legal, careers, products, blog, customers, others | about 38 | Reading pages with no reading layout. |

Shared facts, measured:

- Headings: `h1` 52px, `h2` 26px, body 14px. The step from hero to section heading is too small, so sections feel like footnotes.
- Motion: the Enterprise page runs animation only in the hero. Below it, nothing moves and nothing responds to scroll.
- Sections: one repeated recipe. Centred mono label, centred 26px heading, centred sentence, grid of equal `_bg-muted` cards with a small icon.
- Header: 60px. Menu targets are 34px tall, under the 44px touch minimum.
- Forms: 56px pill inputs, labels present. Good base.

What the references do, measured the same day:

- **Apple** (iPhone product page): tagline 80px, section heading 48px, caption 28px, body 17px, all weight 600. Reveals are tied to scroll position: a heading rises 25px and fades in as it enters, cards follow one behind the other. One 802px scene is pinned inside a 4,517px section. A local bar with the product name and one button stays on screen.
- **ChatGPT Enterprise**: `h1` 64px, `h2` 48px, weight 500, tracking -0.03em. No scroll animation at all. Strength is large media panels, alternating rows and a quote grid. Weakness is the same three-card rows Hanzo has.
- **Anthropic model page**: a 640px reading column, evidence tables with one highlighted column, tabbed quotes, footnotes. Trust comes from showing the working.

---

## 4. What "premium, luxurious, subtle" means here

These are rules, not adjectives. Each one can be checked.

1. **One idea per screen.** A section says one thing. If it says two, it is two sections.
2. **Space is the material.** Never fill a gap with a card. Empty space is what makes the next thing feel expensive.
3. **Type does the work.** One family and its mono. Scale, weight and spacing carry hierarchy, not boxes, colour or icons.
4. **No accent colour.** Whites, silvers, greys, blacks. Colour appears only inside third-party logos and real product imagery.
5. **Hairlines before shadows.** A 1px line at 10% is the default separator. Nothing at rest has a shadow. Only things that float have one: menus, the dock, dialogs.
6. **Black is a room, not a card colour.** At most two black sections per page, never back to back. A black card is for line art or for a terminal.
7. **Every section has one visual object, made of the brand's own material:** the line art from the model cards, the halftone field, real product UI in mono, or large thin numerals. Never an icon in a rounded box.
8. **Numbers are the heroes.** Large, thin, tabular, with a small plain caption and a source. A zero never gets hero size.
9. **Calm, never dead.** Every section has one arrival and every control answers (section 4b). Nothing rises more than 24px. At most one thing moves on its own in any one screen.
10. **Everything answers touch.** Hover in 150ms by colour, press in 90ms, a visible focus ring, always.
11. **Honest by design.** Every figure carries its source line. Every example is labelled Example. A bar is drawn to true scale or not drawn.
12. **It works with everything off.** Motion off, script off, images off: the page is still complete and still handsome.

### Better than Apple, specifically

- Apple's motion is spectacle. Hanzo's motion is **evidence**: a bar grows for as long as the task took, a terminal boots in the seconds it really boots in. If a motion explains nothing, cut it.
- Apple ships heavy video. Hanzo's art is **drawn in code** (canvas and SVG), a few kilobytes, sharp on every screen, instant to load.
- Apple's pinned scenes trap keyboard and reduced-motion users. Here every pinned scene has a **plain-list fallback and real buttons**.
- Apple hides the sums. Hanzo **shows sources** beside every claim.
- Apple's local bar sits at the top. Hanzo's **dock** sits at the bottom, under the thumb, with the page's one action.

---

## 4a. Simplify the complicated (the psychology, with sources)

Each rule comes from published research or a primary guideline, read on 6 Nov 2026. Two are marked as not re-checked.

1. **One claim and one action per screen.** Mental effort per screen is the budget. (Cognitive load, lawsofux.com/cognitive-load)
2. **Fewer choices, faster decisions.** One solid button per screen. A menu or row never offers more than it needs. (Hick's law, lawsofux.com/hicks-law)
3. **Groups of four or fewer.** No set of more than four equal items without a sub-group. Six things become three pairs. (Miller, lawsofux.com/millers-law and /chunking. Cowan's figure of about four chunks is widely taught but was not re-checked.)
4. **Depth in two layers, never three.** Show the few things that matter; keep detail one step away. Designs with more than two levels of disclosure test badly. (nngroup.com/articles/progressive-disclosure)
5. **Write the page for scanners.** People read about 20 to 28 percent of the words. The page must make sense from its headings and the first line of each block. (nngroup.com/articles/how-little-do-users-read, /layer-cake-pattern-scanning, /f-shaped-pattern-reading-web-content-discovered)
6. **Space does the grouping.** The gap inside a group is smaller than the gap between groups. A group that needs a box to read as a group is spaced wrongly. (Gestalt proximity and common region, lawsofux.com/law-of-proximity)
7. **One thing stands out.** The brand has no accent colour, so isolation comes from weight: the solid button is the only solid shape in its screen. (Von Restorff, lawsofux.com/von-restorff-effect)
8. **First and last are remembered.** Strongest proof first in every list. The action last on every page. (Serial position, lawsofux.com/serial-position-effect)
9. **Beauty buys patience, not forgiveness.** Good looks make people rate a site as easier to use and hide small faults in testing. Test with tasks, not opinions. (nngroup.com/articles/aesthetic-usability-effect)
10. **Easy to read feels true.** One type scale, plain sentences, generous line height. (Processing fluency; not re-checked against a source.)
11. **Big, near targets.** Controls at least 44px, the main action where the thumb already is. Patterns people know from other sites stay as they know them. (Fitts and Jakob, lawsofux.com/fittss-law, /jakobs-law)
12. **Answer in a tenth of a second.** 0.1s feels instant, 1s keeps the thought, 10s loses the person. (nngroup.com/articles/response-times-3-important-limits, lawsofux.com/doherty-threshold)
13. **Design the peak and the end.** People judge an experience by its best moment and its last. Each page gets one memorable moment and a deliberate closing section. (nngroup.com/articles/peak-end-rule)
14. **Complexity moves, it does not vanish.** Hanzo carries it in defaults, order and layout so the visitor does not. (Tesler's law, lawsofux.com/teslers-law)
15. **A link says what is behind it.** Hanzo's link words stay as they are; the design gives each one its context. (Information scent, nngroup.com/articles/information-foraging)
16. **Trust is visible.** Real organisation, easy contact, sources beside claims, no broken links, no typos. (Stanford web credibility guidelines, credibility.stanford.edu/guidelines)

How this lands on a Hanzo page: a visitor gets **the promise** (hero, unchanged), then **three to five proofs**, each one screen with one object, then **the action**. Anything a specialist needs (full spec tables, planning notes, method) sits one click down, in the page, under Hanzo's own sub-heading.

---

## 4b. Alive, not busy (feedback and motion)

Use **Motion** (motion.dev, `npm install motion`, version 14 in the reference) as the one motion engine. The reference uses six functions: `animate`, `inView`, `scroll`, `stagger`, `press`, `hover`, and the immersion layer in 2b adds nothing outside them. Import only those. Run `npx motion-ai` in the repo so the coding agent has Motion's own rules. No springs anywhere: Hanzo's rule, and right for a serious product.

**What the craft teaches** (Apple, WWDC 2018 "Designing Fluid Interfaces"; Emil Kowalski; Rauno Freiberg; Vercel's Web Interface Guidelines):

- Respond at once. People feel latency before they can name it.
- Interface motion under 300ms. Entering uses ease-out. Nothing grows from zero size.
- The more often a thing is seen, the less it moves. Keyboard actions get no animation.
- Animate transform and opacity (and `clip-path` for the sliding segment). Never `transition: all`. Never width, height, margin or padding.

**Arrivals.** Each section's object assembles once as the visitor reaches it. This is what makes the page feel made, not templated.

| Object | Arrival |
|---|---|
| Any block | Fades in and rises 20px, tied to scroll position |
| Hairline | Draws from the left |
| Figure | Each character rises into place, 35ms apart. The true value only. A word never breaks in the middle |
| Line art and model mark | Drawn stroke by stroke, like a pen plotter |
| Bars in a table | Grow to their value as the row comes on screen |
| Code and product fragments | Lines arrive top to bottom, 28ms apart |
| Cells, ticks, steps | Light in order, 60ms apart |

**Linked to scroll.** The reader drives these, so they can be read at any speed and never replay:

- The pinned scene on Enterprise: hold, change, hold.
- The route on Gateway: a line fills through six checks; a black card names the one being read. On a phone it is one hairline under the header.
- The rail on the integration guide: the line beside the numbered steps fills as each is passed.
- The letter on the company page: each section's opening line darkens word by word as it crosses the middle of the screen.
- The specimen on the brand deck: runs through the family's weights, Air to Medium.

**In real time.** Evidence shown at its true pace:

- The two races on Home: every bar grows at one speed, so the task that took four times as long is seen to take four times as long.
- The boot on the cloud page: the terminal lines arrive in the seconds they really took, and two lanes time the commands. A Replay button runs it again.

**Answers.** Every control and surface responds to the person:

- Surfaces: a soft light follows the pointer. A colour change, never a movement.
- Rows: the top line darkens, the arrow strengthens, the small mark redraws.
- Buttons: press to 97% in 90ms, back in 150ms. Copy confirms in place for two seconds and is announced.
- Tabs and segmented controls: one surface or underline slides between items. Arrow keys switch with no animation.
- Forms: the fault is said beside the field, in plain words, as soon as the visitor leaves it.
- The dock: marks the section in view, keeps the page's one action under the thumb, and steps aside wherever the page shows its own main action.

**Ambient.** Rare and slow: the line art in a hero card breathes, example audit rows arrive every few seconds while the log is on screen. At most one of these per screen.

A generic fade-up on every block is not motion design. If an arrival does not suit the object, the object does not move.

---

## 4c. The team: one Apple-grade specialist per discipline

Work as each of these in turn. Each has their own sources and their own check before anything ships.

| Discipline | What they do on this job | Sources they use | Their check |
|---|---|---|---|
| Information architecture | Order each page as promise, proofs, action. Two layers of depth | Rosenfeld, Morville and Arango, *Information Architecture*; NN/g on progressive disclosure | The page makes sense from headings alone |
| Content design | Changes no words. Shapes line length, breaks and emphasis so the words read fast | NN/g on how little users read; *Nicely Said* | Read only headings and first lines aloud |
| Art direction | One idea per page, one visual object per section, from the brand's own material | The home model cards; `/platform`; *Refactoring UI* | Squint test: one focal point per screen. Cover the logo: is it still Hanzo? |
| Typography | Scale, weight, tracking, measure, balance, tabular figures | Bringhurst; Butterick's *Practical Typography*; *Thinking with Type* | No line over 75 characters, no orphan in a heading, no figure broken mid-number |
| Layout and grid | 13 columns split 8 and 5, golden rhythm, optical alignment | Müller-Brockmann, *Grid Systems*; Hanzo's golden ramp | 375 and 1470 wide: nothing collides, edges align |
| Colour and contrast | Whites, silvers, greys, blacks, in two rooms | WCAG 2.2 success criterion 1.4.3 | 4.5:1 text, 3:1 large text, in both rooms |
| Interaction design | Every state of every control | Saffer, *Microinteractions*; Apple Human Interface Guidelines | Keyboard-only pass; all states exist |
| Motion design | Arrivals, scroll links, answers | WWDC 2018 session 803; motion.dev docs; Emil Kowalski's essays; Hanzo's motion tokens | Watch it at 60 frames a second; motion off is still complete |
| Data visualisation | Tables, bars, charts that tell the truth | Tufte, *The Visual Display of Quantitative Information* | Each mark matches its number; reads without colour |
| Front-end engineering | Tokens, components, templates, no layout shift | web.dev Core Web Vitals; Vercel Web Interface Guidelines | LCP, CLS and INP inside the bars in section 8 |
| Accessibility | Structure, focus, names, targets, announcements | WCAG 2.2 quick reference; WAI-ARIA Authoring Practices | Screen reader and keyboard on every template |
| Design systems | One token and one component for each job | Kholmatova, *Design Systems*; `@hanzo/design` and `@hanzo/gui` | `npx hanzo-design-lint` passes; no one-off value in any page |
| Behavioural design | Hierarchy of attention, one action, trust signals | lawsofux.com; Stanford web credibility guidelines | Five-second test: what is this, what do I do |
| Research | Proves it with people, not taste | NN/g usability testing guidance | Five people, three tasks, per template |
| Search | Nothing a crawler relied on changes | Google Search Central | Titles, canonicals, structured data identical |
| Internationalisation | Mirrors cleanly, survives longer words | W3C Internationalization guidance | A real right-to-left render of each template |

---

## 5. Foundations (Hanzo's tokens, used fully)

The brand deck (`site/brand.html`) shows every value below, live.

**Palette.** One neutral ramp, eleven steps, plus pure black and pure white: `#fafafa #f5f5f5 #e5e5e5 #d4d4d4 #a3a3a3 #737373 #525252 #404040 #262626 #171717 #0a0a0a`. On black, text and lines use the white opacity ladder (5, 10, 15, 20, 30, 40, 60, 80%).

**Two rooms.** Light: paper is pure white (the live marketing site uses white, though the token says `#f7f7f7`), quiet room `#f5f5f5`, card `#ededed`, text `#0a0a0a`, second text `#525252`, lines black at 10%. Dark: true black, text `#fafafa`, second text white at 78%, third white at 55%, lines white at 10 to 14%. Text has five ranks; the deck shows each with its measured contrast. Do not use the third rank under 24px on a grey surface.

**Type.** Zen for everything, Zen Mono for labels, code and table figures. Never a third face.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Closing line | clamp(40px, 6.6vw, 88px) | Book | line 1.02, tracking -0.035em. (88px is between two steps; use 84px) |
| Section heading `h2` | clamp(36px, 5.3vw, 64px) | Book | line 1.02, tracking -0.035em, two-tone |
| Hero `h1` | unchanged | | |
| Statement paragraph | clamp(22px, 2.6vw, 34px) | Book | line 1.25, at most 30em wide |
| Sub-heading `h3` | clamp(20px, 1.9vw, 26px) | Book | line 1.15 |
| Lead | clamp(17px, 1.5vw, 21px) | Regular | line 1.45, at most 44 characters wide |
| Body | 17px (16px in cards) | Regular | line 1.55, at most 62 characters wide |
| Notes | 13px | Regular | line 1.6, at most 64 characters wide |
| Eyebrow | 11 to 12px mono, capitals | Medium | tracking 0.14em. Nothing on the site is set under 11px |
| Hero figure | clamp(72px, 13vw, 176px) | **Air (220)** | line 0.9, tabular, tracking -0.03em |
| Row figure | clamp(28px, 3vw, 40px) | Air | for small counts and zeros |

Headings use `text-wrap: balance`. Paragraphs use `text-wrap: pretty`. A two-tone heading sets the first clause in ink and the rest in grey; the words do not change. The reference sets headings at weight 500; map that to the Book preset.

**Space.** Section padding `clamp(var(--golden-7), 11vw, var(--golden-9))` (72 to 188px). Gutter `clamp(16px, 4vw, 32px)`. Container 1152px, prose 768px. Tile gap 12px. A section head is two columns, 8 and 5 of 13: heading left, lead right, aligned to the bottom. Centred heads are for the closing section only.

**Shape and paper.** Radius 6, 8, 12, 16, 24px and full, from the tokens. Tiles 24px, art cards 20px, chips 6px, pills full. Tiles are flat fills with no outline and no shadow. Rows are divided by hairlines. The dock, menus and dialogs are the only things that float, on `--shadow-floating`.

**Rhythm.** A page alternates rooms: paper, quiet room, black. The halftone field appears in the hero and returns in the closing section, so the page ends where it began.

---

## 6. Fifteen pages, fifteen ideas

One system. Each page then gets **one idea** (two words), **one object** only it has, and **one moment** the visitor remembers. This is what stops the site reading as one template repeated. Open each in the reference.

| Page (reference file) | Covers | The idea | The object and the moment |
|---|---|---|---|
| Home (`index`) | 1 | **The race** | Two bars run for as long as each product really took. A product rail of nine cards, each a real fragment of that product's UI; the three command-line products sit on black, as terminals do. A frontier plot drawn from the page's own figures, every point focusable |
| Models index (`models`) | 4 | **The wall of marks** | Every model has its own line-art mark. A catalog table with a mark per row, a preview that redraws as rows are pointed at, filters as chips |
| Model page (`model`) | 543 | **The plotter** | The model's mark is drawn stroke by stroke beside its figures. 543 pages gain a visual with no image files |
| Product page (`gateway`) | 108 | **The route** | One request travels down a line through the product's steps; a black card names the step being read |
| Solutions, Enterprise (`enterprise`) | 20 | **The seal** | One pinned scene: the same line art changes shape to show where the product runs. Spec sheets with detail one click down |
| Cloud service (`cloud-local`) | 42 | **The boot** | The terminal starts a cluster in the seconds it really takes, and two lanes time the commands |
| Open-source project (`oss-crowdstart`) | 57 | **The ledger** | Counts as entries on ruled lines with dotted leaders. A zero is written as plainly as any figure and never made large |
| Benchmark report (`benchmark-fleet`) | 29 | **The paper** | A reading column with notes in the margin. Bars drawn to true scale. "What this does not measure" gets equal weight |
| Guide (`integration`) | 38 | **The rail** | A line beside the numbered steps fills as each is passed. A contents list follows the reader |
| Pricing (`pricing`) | 1 | **The columns** | Plans are columns of one sheet, not cards. One plan comes in four sizes; choosing a size changes its price and list in place |
| Customers (`customers`) | 3 | **The figures** | Each launch is one line of a long ledger, its result set very large and very thin |
| Company, careers, blog, legal (`about`) | 36 | **The letter** | One calm reading column. Each section's opening line darkens word by word as it is read |
| Contact and forms (`contact-sales`) | 9 | **The exchange** | What comes back lights up as each field is filled. The result replaces the form |
| Platform | 1 | Unchanged | Apply tokens and component states only |
| System pages (`404`) | on top | **The field** | A thin 404 on the halftone field; the dots swell under the pointer |
| | **892** | | |

The count is by address in the sitemap; confirm the top-level pages by eye.

### Rules for keeping pages apart

1. **Name the idea before designing.** Two words. If two page types would get the same words, one of them is wrong.
2. **The object comes from that page's own content.** A product page shows that product's real screen or real sequence. A benchmark shows its own numbers to scale. Never an object borrowed from another page.
3. **One moment per page.** A page with two is tiring; a page with none is a template.
4. **Vary the instrument, not the system.** Pages differ in grid split, room order, the kind of object (line art, UI fragment, figure, chart, terminal, form) and the kind of motion (drawn, timed, scroll-linked, typed). They never differ in tokens, type or component states.
5. **Inside one template, the data makes the difference.** 543 model pages share a layout and each has its own mark. 108 product pages share an order and each has its own object.
6. **Test:** shrink two pages to thumbnails side by side. If you cannot tell which is which without reading, redo one.

---

## 7. Components (every one, with its states)

For each: default, hover, pressed, focus-visible, disabled, loading where it applies, light and black rooms, phone and desktop, left-to-right and right-to-left. **Built** means it is in the reference; the rest are specified here only.

**Navigation**
1. **Header.** Keep. Raise every target to 44px tall with padding, not bigger text.
2. **Mega menu.** Keep the layout. Open and close in 300ms. Arrow keys move between items, Escape closes and returns focus.
3. **Announcement bar.** One line, dismissible, remembers dismissal.
4. **Breadcrumbs.** Mono, on model, OSS, cloud, benchmark and guide pages. Last item is not a link. *Built.*
5. **Dock.** Fixed, bottom centre, glass pill. Shows the sections of the page, marks the one in view, and carries the page's one action as a solid pill. Appears after the hero and steps aside wherever the page shows its own main action. On phones it spans the width and its section strip scrolls sideways with a fade. Set `--dock-clear` to the width of anything fixed bottom right, such as a chat launcher. *Built.*
6. **Footer.** Keep the links. Apply the type scale.
7. **"Ask Hanzo anything" bar and chat launcher.** Keep. Make sure neither covers a focused control.
8. **Search.** Opens as a centred dialog, results as hairline rows, full keyboard support, an empty state that suggests pages.

**Text and actions**
9. **Section head.** Eyebrow, two-tone heading, lead, split 8 and 5. *Built.*
10. **Chip.** 26px tall, 1px line, 6px radius (fully round inside art cards). *Built.*
11. **Button.** 48px (40px small), fully round. Solid: ink on paper, reversed in black rooms. Outline: 1px line, darkens on hover. Pressed 97%. Loading keeps its width. One solid button per screen. *Built.*
12. **Text link with arrow.** The arrow strengthens on hover. Minimum 44px tall. *Built.*
13. **Inline link.** Underlined, 1px, offset 3px. A link that stands alone gets a 44px target by padding. *Built.*
14. **Segmented control.** Pill group; the selected segment is one light surface that slides. Arrow keys move the choice. *Built (Pricing).*

**Cards and tiles**
15. **Model art card.** The existing home page card. Do not restyle. It is the pattern for every black art surface.
16. **Product card** (App, Dev, Design, API, CLI, MCP, Agent, Bot, Team and every card like them). One real fragment of that product's UI in mono as the visual, never an icon. Name, mono address, two actions on one shared baseline. Terminal products sit on black. The fragment writes itself out, line by line, when the rail arrives. *Built (Home).*
17. **Bento tile.** 24px radius, visual on top, words at the bottom, never overlapping. Rows alternate 8 and 5 columns then 5 and 8. Three equal tiles in a row are banned. *Built.*
18. **Figure.** Thin numeral, caption, source. Sizes: hero, large, row. Zeros and small counts use row size. *Built.*
19. **Spec sheet.** Mono label, one large figure, then label and value rows split by hairlines, then the source link. *Built.*
20. **Result row** (customer outcomes). A hairline grid, not boxes: figure, what it was, who and context in mono. The whole cell is the link. *Built.*
21. **Ledger line.** Label, dotted leader, figure. For counts that are small or zero. *Built (Open source).*
22. **Quote.** Statement size, name and role in mono, logo in one colour. *Built.*
23. **Logo row.** One colour, optical sizes matched, with the plain sentence that says what the logos are.
24. **Pricing plan.** Columns of one sheet split by hairlines. Price as a thin figure. Inclusions as a plain list with a short dash, no icon per line. One plan may sit in black. *Built.*

**Evidence**
25. **Table.** Mono capital headers, hairline rows, right-aligned tabular figures, one highlighted column. On phones, decorative columns drop. *Built.*
26. **Bar row.** A 6px bar on a grey track, scaled to the largest value in the set. The table still reads correctly without the bar. *Built.*
27. **True-scale bar.** Two values on one scale, even when one is two thousand times the other. *Built (Benchmark).*
28. **Race.** Two or more bars that grow at one speed. *Built (Home).*
29. **Chart.** Monochrome. One series in ink, others as open points with direct labels. No legend box. Every point is focusable and read out. *Built (Home).*
30. **Code block.** Language tabs, a copy button that confirms for two seconds, the file or command name in mono above, sideways scroll inside the block only. *Built.*
31. **Terminal.** Black, 20px radius. Lines arrive as the block enters view. The full text is in the page for readers and copy. On a phone the lines wrap. *Built.*
32. **Source line.** 13px grey, under the thing it supports, always present. *Built.*

**Disclosure and steps**
33. **Accordion.** Hairline rows, plus turns to a cross, opens in 400ms, built on the native element. A search field narrows a long list. *Built.*
34. **Tabs.** Underline moves between tabs. Arrow keys, Home and End switch. *Built.*
35. **Numbered steps.** Hairline list, mono numbers, a line that fills as steps are passed. *Built.*
36. **Pinned scene.** The active step is full strength, the rest dimmed. Each shape holds, changes, then holds. Steps are buttons. With motion off it is a plain open list. *Built.*

**Forms**
37. **Field.** 56px, label above always, hint below, error below in plain words. Focus ring 2px ink. Correct `autocomplete`, `inputmode` and `type`. Paste always allowed. *Built.*
38. **Select, textarea, checkbox, switch, radio.** Same height rhythm and focus ring. Native controls underneath.
39. **Submit.** Solid button, shows progress in place, then a result panel that replaces the form and says what happens next. On failure the entries stay and the reason shows. *Built as a demo that sends nothing.*

**Feedback and system**
40. **Dialog, menu, tooltip, toast.** One motion: fade and 8px rise in 200ms. Focus is trapped in dialogs and returned on close.
41. **Loading.** Skeletons the exact size of what replaces them. No spinners on page sections.
42. **Empty.** One sentence and one action. Never a blank box. *Built for search and filters.*
43. **404.** *Built.*
44. **Cookie and privacy choices.** A small panel, equal weight for accept and decline.

**Media and art**
45. **Line-art engine.** One small canvas module that draws white strokes on black and moves between shapes. Shapes live as data. It pauses off screen and renders one still frame with motion off. *Built.*
46. **Halftone field.** True halftone: dot size carries the tone. *Built.*
47. **Model mark.** Generated from the model ID: the lab picks the family of shape, the model picks its proportions. The same ID always draws the same mark. *Built.*
48. **Images and video.** Fixed aspect boxes, no layout shift, lazy below the fold.
49. **Favicon, share image, page titles.** One share-image template per page type, built from the same line art.

---

## 8. Quality bars (a page is not done until all pass)

- **Speed.** Largest content paint under 2.0s on a mid phone, layout shift under 0.02, interaction delay under 150ms. Added script under 12KB compressed per page beyond Motion's used functions. No video above the fold.
- **Smooth.** 55 frames a second or better while scrolling the whole page on a laptop. No task over 100ms.
- **Access.** WCAG 2.2 AA. Full keyboard path, visible focus never hidden behind the header or dock, targets 44px, correct heading order, one `h1`, labels on every field, status never by colour alone. Test with a screen reader, not only a scanner.
- **Responsive.** Check 320, 375, 768, 1024, 1470 and 1920 wide. No sideways scroll, no clipped words, no text over art.
- **Right-to-left.** The site loads Arabic fonts. Use logical properties so every layout mirrors, including the dock, arrows and bars.
- **Dark preference.** Tokens resolve for both. Black rooms stay black.
- **Motion off.** Every page complete and still. Add `?calm` to any reference address to see it.
- **Script off.** Content, links, forms and accordions work.
- **Search engines.** Titles, descriptions, canonical links, structured data and the sitemap stay as they are.
- **Honesty.** Every figure on the page matches the source it had before the change.

**What the reference measured on its last walk** (Chrome, 1470 wide, 6 Nov 2026): all fifteen pages at 59 to 60 frames a second; layout shift 0 on fourteen and 0.004 on Enterprise; one task over 50ms on one page; no errors; no sideways scroll at 375; no target under 40px; contrast, text size, heading order, names and labels clean on every page at both widths.

---

## 9. Order of work

1. **Baseline.** Record one page of each template at 1470×801 and 375×812 before any change.
2. **Agree the amendments** in section 2.
3. **Tokens.** Type roles, golden rhythm, the 13-column grid. Ship behind a flag. Every page inherits.
4. **Shared components**, in this order: section head, button, link, tile, figure, table, code block, accordion, field, dock.
5. **Art.** Line-art engine, model marks, product UI fragments.
6. **Templates by reach:** model page (543), product pages (108), open-source (57), cloud (42), guides (38), company and legal (36), benchmarks (29), solutions (20), then the rest.

### Four rounds, and a walk after every one

No template is done in one pass. Run four rounds. After each round, **walk it**, then fix what the walk found before the next round starts.

1. **Round 1: build** it to this brief.
2. **Round 2: fix and lift.** Everything the first walk found, and the weakest section rebuilt.
3. **Round 3: simplify and bring alive.** Section 4a, then 4b. Remove, group, layer. One arrival per section, an answer on every control.
4. **Round 4: craft.** Optical alignment, spacing rhythm, line breaks, phone layout, right-to-left, the bars in section 8.

**A walk is using the page, not looking at a picture of it.**

- Open it in a real browser at full frame rate. Scroll the whole page at reading speed. Watch every arrival finish. Use every control: every tab, filter, copy button, field, the dock.
- Do it again at phone width. `phone.html?p=index,models,model` in the reference folder shows three pages at phone width side by side.
- Do it again with the keyboard only, and again with motion off.
- Measure while walking. `site/assets/walk.js` scrolls a page like a visitor and returns frames per second, slow frames, layout shift, long tasks, loops running at once, content left faint, small targets and errors. `site/assets/audit.js` checks contrast against the real background, text size, heading order, names, labels, cut-off text and line length.
- Write down what is wrong, weak or dead. Screenshots alone miss most of it.

**What the walks caught on the reference, that a screenshot review did not:** text sitting on top of other text because a footer class leaked into a card; a guide page that scrolled sideways on a phone because a one-column grid was written `1fr` and not `minmax(0, 1fr)`; a figure that broke in the middle of a number; a price separated from its label; link styles reaching links nested inside a row; a button hidden behind the dock; labels at 10px; three texts under 4.5:1. Scope component class names, and walk at 375.

After each round, score your own work against these ten questions and fix the lowest before moving on:

1. In five seconds, is it clear what this page offers and what to do?
2. Does each screen hold one idea and one object?
3. Is there any group of more than four equal things?
4. Could a specialist find the deep detail in one click, without it crowding everyone else?
5. Does the page still make sense from headings and first lines only?
6. Does every section arrive, and does every control answer?
7. Would any single motion be missed if removed? If not, remove it.
8. Does it look made for Hanzo, and made for this page, or could it be any page of any company?
9. Is every word and number exactly Hanzo's?
10. Does it pass with motion off, script off and a keyboard?

Report after each step in under 15 lines: what changed, which pages inherit it, what was measured, what is not verified.

---

## 10. Never

- Three equal icon cards in a row. A centred label over a centred heading over a centred sentence, repeated down a page.
- The same layout on two page types.
- Gradients, glows, coloured accents, emoji, stock icons as art, drop shadows on resting cards.
- A spring, a bounce, parallax on words, a custom cursor, scroll hijacking, a carousel that moves by itself. A hover transform beyond the tilt and lean limits in 2b.
- A number that counts through values it is not.
- The marks of a generated template: a centred hero with a glow, gradient text, three rounded icon cards, the same fade-up on every block.
- A dead page: a section with no arrival, a control with no answer.
- Animating width, height, margin or padding.
- Text over busy art. A zero at hero size. A figure without its source. A bar that is not to scale. Text under 11px.
- A second solid button in the same screen. A dead link. A control that is a `div`.
- Changing a hero, a word or a number.

---

## 11. The reference folder

| Path | What it is |
|---|---|
| `site/brand.html` | The brand deck: palette, text ranks, rooms, type, space, shape, motion, art, and the page ideas. Start here |
| `site/*.html` | The fifteen built pages. Do not edit these; they are built |
| `src/pages/*.html` | One fragment per page: its own styles, markup, dock and script. Edit these |
| `build.py` | Joins each fragment to the shared head, stand-in header, footer and scripts. Run `python3 build.py` |
| `site/assets/hanzo.css` | Tokens and every shared component |
| `site/assets/hanzo.js` | Shared behaviour: line art, marks, halftone, code blocks, dock, and the motion layer |
| `site/assets/motion.js` | The whole Motion library, so the folder runs offline. In the codebase import only the six functions used |
| `site/assets/immersive.css`, `immersive.js` | The immersion layer: rooms, bloom, field, depth, words, scenes, tickers, answers, header, transitions, scroll |
| `site/assets/lenis.js` | Lenis 1.3, smooth scroll (npm `lenis`) |
| `site/assets/walk.js`, `audit.js`, `phone.html` | Review tools. Not part of the site |

Port the patterns, not the markup. The site runs on `@hanzo/gui`; these pages are plain HTML so they can be read and run anywhere.

**Stand-ins, so nobody ships them by mistake**

- Every hero, the header, the footer and the Frontier AI cards stand in for the live ones, which stay.
- The strip at the top of each page and the "Next page" link are for review only.
- Logos are plain text. The demo form sends nothing.
- Zen and Zen Mono load from Hanzo's public repository through a CDN; the site should serve its own copies.

**Left out of the reference on purpose** (keep them on the live pages): on Home, six of the twelve repositories and the commit heat map; on Models, the per-family card lists, the creative models and "Your first request"; on Company, the commit feed and the publications list; on Pricing, the per-model rate catalog behind the API tab. Some links in the reference point at a section's main page, not the exact live address.

**Not checked**

- No screen-reader pass. Right-to-left was not rendered. A dark colour preference was not built.
- Speed on a real phone and on Hanzo's hosting. The numbers above are from one laptop.
- No one outside has tested it. Section 4c asks for five people per template.
- Motion's own performance audit was not run; it needs a Motion+ account.

**Faults seen on the live site while reading it** (content, so not changed here; Hanzo decides):

1. The description of "Command R (08-2024)" shows a raw Markdown link.
2. The Python quick-start sample uses `os` without importing it.
3. The pricing questions say annual billing "saves 92% against paying monthly"; the Team card says "Annual −20%".
4. Several live figures count up from zero, so a visitor who reads early reads a wrong number.

Pattern scouting used godly.design and motion.dev. Nothing was copied from any site.
