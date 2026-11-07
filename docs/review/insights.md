# /insights — James-eye review

Verdict: 6/10
First complaint: "Every ten seconds the headline jumps. The kill switch fires, the whole hero hops up 20px, then drops back. And the second you scroll past it there's a big empty white hole, so it feels like a document again, not premium."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812 (full scroll with the recorder at both sizes, idle a/b frames, 14 hovers, 16 clicks, a 14 s frame-by-frame watch of the hero tracking the h1 and field positions, layout-shift attribution, tab and chip clicks, CTA hover and press, a 24 s watch of the tour window's height on phone, reduced motion, JS off, palette sweep of computed colours, parity and taste scripts).

Frames:
- `insights/d-hero-on.jpg`: the hero at 0 ms. h1 top at 404px.
- `insights/d-hero-killed-h1-jumps.jpg`: the same hero 1.2 s later, after the kill switch. The flag card has lost a row, the field has jumped 42px and the h1 21px.
- `insights/d-dead-gap-tour.jpg`: the second screen. About 330px of empty white, then figures that are bigger than their own heading.
- `insights/p-question-wall.jpg`: the phone "Ask it a question" section, a wall of ten stacked pills with the answer pushed off screen.

## What works
- **The hero object is real and alive.** A flag (`new-dashboard`) rolls out across a field of 120 people. It moves from a percentage (36 lit) to a cohort (28 lit) to one account (1 lit), then the kill switch drops all of them. It runs itself, has a pause button and stops when hidden. You can take it over with the switch or the three modes. The mode pill glides between them (layoutId, 300 ms ease-emphasis). This is a proper signature, and nothing on neighbouring pages does it.
- **Arrival motion.** The h1 cuts in by line mask. It is a CSS animation, so it also plays with JS off and finishes legible (checked at 0 ms and 3 s with JS disabled). The event line ticks every 700 ms, so something moves inside the first second.
- **The six tools as a product window** (`insights.hanzo.ai` chrome, `01 / 06` numbered tabs, a 5.2 s progress line, and a click stops the tour). Each panel has its own small drawing. Clicking tab 03 selects it and shows Session replay; checked.
- **The dark room** sets the provider code beside the app it flips (`<NewDashboard />` and `<OldDashboard />` every 2.8 s, with a pause). The idea is clear and quiet.
- **Reduced motion is clean:** 0 running animations after 3.5 s, and the field holds its final 36-lit state. JS off: the h1, lede, ask and one tab panel are all present.
- **The primary ask is correct.** "Open Insights", 44px, `#0a0a0a`, `data-cta="insights.hero"`. Press is scale(0.98). No horizontal overflow at either size. The h1 is 52px / 497 desktop and 40px phone.
- `parity.py /insights`: text 67/67, links 4/4. `taste.py` passes on Insights.jsx and Insights.css.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Mostly. "Hanzo Insights / Product analytics and feature flags / Open Insights" is readable, and the field beside it explains flags without words. Motion inside 1 s comes from the h1 cut-in and the event line ticking at 700 ms. The field itself does not change until 3.3 s, so the big object looks still for the first 3 s.

   The composition is weak. The h1 sits on the right with its bottom at 516px (64% of 801, against the 38% target). The hero object is 660px tall (192 to 853), so it runs off the fold. The next section never peeks: the hero section is 940px tall.
2. **One in, one out, or a document?** Closer to a document. Between sections there are large dead white bands:
   - about 330px between the hero object's bottom and "Ship it, then find out";
   - about 280px between "Start with autocapture" and "Paste and ship".

   No section is pinned or scrubbed. Each block simply sits there while you scroll past.
3. **A real visual in every section?** Hero: yes (the field). Tour: yes (the window). Dark room: yes (code plus flipping app). Closing: yes (contour art). Two sections fail:
   - "Ask it a question" has ten pills on the left and two lines of text on the right, with no object.
   - "Start with autocapture" is a heading, a lede and two quiet buttons.
4. **One ask in the sticky header, nothing floating, scale with rhythm?**
   - Desktop header: it starts as "Try Hanzo" (outlined) and swaps to a solid "Open Insights" once the hero ask leaves view. Good.
   - Phone header: it stays a solid black "Try Hanzo" throughout. On the first screen that makes two solid fills with two different labels ("Try Hanzo" in the header, "Open Insights" in the hero). This is shared chrome, noted.
   - Nothing floats over content apart from the shared cookie card.
   - Scale is off. The "Events / Flags / OSS" figures are 38px / 600, bigger than their own section heading at 32px. "Start with autocapture" is 44px, the Ask answer is 44px and the tour h3 is about 44px. That puts four 44px headings on the page, while section headings rest at 32px rather than 26px. Big, medium and small are not clearly separated.
5. **Every hover and press answers, no jumps?** Partly.
   - Kill switch: hover changes nothing.
   - Tabs, chips and modes: hover is only a grey background fill (`rgba(128,128,128,.14)`). Nothing on hover tells you anything (no preview, no number).
   - CTA: hover turns it `#2c2c2e`; press is scale .98.
   - Phone: 14 of 14 hover probes show no change, which is expected on touch.
   - The recorder logged 6 dead clicks on the desktop tabs. That is a false negative: a direct click selects the tab and swaps the panel.
6. **Overlap, font swap or layout shift?** Yes, and this is the main fault.
   - **Desktop, hero:** desktop CLS is 0.119 over the walk, above the 0.1 "good" line. Each kill-switch cycle (about every 10.5 s) logs a 0.039 shift. The sources are `.in-field`, `.in-hero-c`, `.in-pct`, `.in-flag-top` and `.in-events`. The h1 moves from 404px to 383px and back, and the field from 402px to 360px. Cause: in the killed state the events line is swapped and the mode row reflows from 2 lines to 1, so `.in-flag` gets shorter, the whole `.in-roll` gets shorter, and the vertically centred `.in-hero-c` moves with it.
   - **Phone, tour window:** the window changes height every time it tours (761 → 661 → 662 → 651 → 718px), so everything below it jumps by up to 110px every 5.2 s. Phone CLS is 0.088.
   - No overlaps, and no font swap was seen.
7. **Which reference, and is its motion there?** Apple product page in spirit: the product as the hero, one idea per block, a self-running demo. Apple's pinned, scrubbed scene is not there. No section pins or scrubs, and the page's motion is all idle and state, with nothing tied to scroll. That is allowed, but it makes the scroll itself feel flat.
8. **Different from neighbours?** The hero and signature are distinct from /analytics, /dashboards and /sentinel: a rollout field of people, with the object on the left and the h1 on the right. The last third is not. "Start with…", `ShipPrompt` and `GetIt` with the contour art make up the same closing used on 8 other cloud pages (Ingress, Hsm, Guard, Idv, Iam, Machines, Kms, Gateway). The last 1,500px look like a template.
9. **All 18 parts?** Not met.
   - Present: the header comment (Persona, Goal, CTA, Metric, Signature, Beyond), one h1, `<Cta>` with `data-cta` and thumb, the closing `Band` (GetIt), `CodeBlock` with Copy, pause controls on all three loops, reduced motion, JS off legible, and parity.
   - Missing or failing:
     - part 3: h1 baseline at 38%, the 56px peek, and "one thing in, one out";
     - part 3 and part 4: no proof strip before the close beyond "License: MIT, 4 stars";
     - part 1: no objection line near the primary;
     - part 6: invented UI strings;
     - part 7: literal hex values in page CSS, off-deck greys;
     - part 10: CLS under 0.02 (desktop is 0.119);
     - part 11: the phone composition of the Ask section.
10. **Banned tells?**
    - **Off-palette colour.** The page CSS uses Apple greys that are not on the deck ramp:
      - `#fbfbfd` (tab rail) and `#e3e3e6` (window dots);
      - `#f5f5f7` and `#161617` (Flip text and card);
      - `#1d1d1f` (Flip app card background);
      - `#f2f2f5` (replay SVG).

      Computed text colours `#e8e8ed`, `#d2d2d7`, `#a1a1a6` and `#86868b` also appear in the dark room, and the CTA hover is `#2c2c2e`. Each has a faint blue cast. They pass taste.py's chroma threshold, but they break "deck ramp only" and "no literal hex in page CSS". The file header still says "Accent: violet".
    - **Glow.** Lit dots carry `box-shadow: 0 0 12px rgba(115,115,115,.45)`, a soft grey glow. It is minor, but it is decoration.
    - **Three equal boxes in a row:** "Events / Flags / OSS" are three equal columns with a 2px top rule. That is borderline.
    - No gradient text, no purple, no eyebrow above an h1 or h2 ("Ask it a question" sits above the pills, not a heading).
11. **Copy untouched?** Not fully. Parity shows 0 missing. However, "Ask it a question" adds about 10 invented question strings that are not in `content/` or `ui-strings.json` (for example "Where do people stop?", "Is the new version better?", "Can we turn it off, now?", "A chart cannot ask it."). Its answers are cut-down fragments of Hanzo's sentences, for example "Funnels show where people stop." taken from the longer funnels line. The pane captions are also new words: "why someone gave up", "where people stop", "a flag with a metric attached", "kill switch · no deploy". That breaks "nothing rewrites, cuts or merges copy" and "new UI strings only from ui-strings.json".

## Fixes (in order)
1. **Stop the hero from jumping** (`components/pages/cloud/Insights.css`, `Insights.jsx` `Rollout`). Give `.in-flag` a fixed height, or reserve the events row with a `min-height` equal to the "on" state, so the kill state never shortens it. Keep `.in-modes` on one line in both states: set `flex-wrap: nowrap` and size the pill row for "one account". Alternatively, top-align `.in-hero-c` (`align-self: start` plus a fixed offset) so the h1 can never follow the object. Target CLS under 0.02 after a 30 s idle watch at 1470x801.
2. **Lock the tour window height on phone** (`Insights.css` `@media (max-width: 899px)`). Give `.in-panel` a fixed `min-height` equal to the tallest panel, or stack the panes in one grid cell (`grid-area: 1/1`) and use visibility, so touring never pushes the page.
3. **Re-compose the hero** to the brief. Put the h1 baseline near 38% of 100svh and cap `.in-roll` so it ends inside the first screen at 1470x801; about 560px tall, for example by trimming the field to 6 rows or reducing the gaps. Let the tour section peek 56px. Remove the roughly 330px of dead white between the hero and "Ship it, then find out". Do the same for the roughly 280px gap between "Start with autocapture" and `ShipPrompt`: tighten `.in-start` padding, or merge the two into one 8/5 row.
4. **Remove the invented copy in "Ask it a question"** (`ASK` in `Insights.jsx`), or rebuild it from Hanzo's words only. Use the tool names and their full sentences from the `LOG` copy as the choices, with no invented questions and no trimmed sentences. Give its right side a real object: reuse the matching `Pane` drawing so the answer is a picture, not two lines of text. On phone, turn the ten stacked pills into a horizontal snap rail (proximity, 14–18% peek), with the answer directly under it inside the same viewport.
5. **Palette.**
   - Replace `#fbfbfd` with `#fafafa` or `#f7f7f7`, `#e3e3e6` with `#e4e4e7`, `#f5f5f7` with `#f5f5f5`, `#161617` with `#171717`, `#1d1d1f` with `#171717` or `#262626`, and the SVG's `#f2f2f5` with `#f2f2f2`.
   - Use tokens rather than literals throughout `Insights.css`.
   - Drop the dot glow box-shadow; the scale and the ink fill are enough.
   - Delete the stale "Accent: violet" comment.
   - The `#2c2c2e` CTA hover and the dark-room `#e8e8ed` / `#86868b` text come from shared kit parts (`Cta`, `CodeBlock`). Write `docs/requests/insights.md` to bring them onto the ramp.
6. **Scale rhythm.**
   - Bring `.in-figs b` below the section heading: 21–26px Zen Mono figure-style, or the 64px Air 220 figure treatment as the one big thing on that screen.
   - Set the section h2s (`v2-display s`, currently 32px) to the 26px resting size.
   - Keep one 44px moment per screen, not four on the page. "Start with autocapture" and the Ask answer can drop to 32px.
7. **Hovers that tell you something.**
   - Kill switch: needs a hover (the knob nudges about 2px toward off, or the track darkens) and a press of scale .97.
   - Tour tabs: the number `01 / 06` steps to ink and a hairline draws under the title.
   - Mode buttons: hover lights a ghost preview of which dots that mode would light (the "hover tells you something" rule), without committing.
8. **Make the closing third this page's own.** Keep `ShipPrompt` and `GetIt`, but seed the `GetIt` art from the Insights field (dots, not the shared contour rings). Put one quiet proof line from Hanzo's copy beside the ask, so the last screen is not identical to eight other cloud pages.
9. **Shared chrome note (not scored):** on phone the header keeps a solid "Try Hanzo" beside the hero's solid "Open Insights" (two fills, two labels on screen one). Request that the header carry the page's hero label quietly at 375 width, as it does on desktop.
