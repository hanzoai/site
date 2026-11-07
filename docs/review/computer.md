# /computer — James-eye review

Verdict: 7.5/10
First complaint: "Don't change the copy. 'Text on a web page can redirect it', 'Tick each one', 'Before you run it' aren't Hanzo's words, and that checklist just says the paragraph next to it a second time."

Walked 2026-11-07 on the dev server at 1470×801 and 375×812, moving. Method: Playwright with video. I wheel-scrolled in 130px notches (6 per screen, plus a finer 2-notch pass through the pinned stage) and dwelt about 1.2s per screen. I sampled frames at 0.1, 0.4, 0.8, 1.3 and 2s with no input. I clicked all 6 hero step tabs, Pause, the 3 checklist rows, Copy and the links, did an 18-stop Tab crawl from the h1 and pressed the arrow keys on the hero tablist. I also loaded the page 10 times for console errors, emulated reduced motion, and tapped through the phone layout top to bottom. Proof sheets: `docs/review/computer/r5-desktop.jpg` and `docs/review/computer/r5-phone.jpg`.

## What works
- **The hero is a self-running product demo, not a picture.** On a black stage a fake desktop shows "The vendor portal that exports one CSV at a time" and "The desktop tool from 2009". A cursor travels between them, CSV rows fill and tick, and numbered marks 1 to 6 land on the targets in step 04 (Set-of-Mark, shown rather than told). A "01 / 06" counter and a 6-tab strip follow it. Something moves within 400ms with no input: the first CSV progress bar is already filling at 0.4s.
- **The h1 cuts in.** At 0.1s the h1 box is empty and the demo is dimmed. By 0.4s "Hanzo Computer" is in at 52px/497, with a sr-only copy for screen readers. The h1 box does not move. CLS over the full walk is 0.0007.
- **The pinned stage changes one panel at a time.** It runs 2211px and holds 3 panels, "It reads pixels", "OCR when clicking is hard" and "Mouse and keyboard", each with its own drawn object:
  - a 4-tile pixel board (native app, canvas, remote desktop, web page) with a scan line passing over it;
  - a wireframe UI whose elements get outlined, with `-with-ocr` and `-with-som` chips;
  - macOS permission toggles that switch on, Mac/Windows/Linux chips, and an `operate --voice` waveform pill.

  A 01/02/03 progress rail under the copy tracks the scroll. This is the Apple "one idea per screen" move, done in Hanzo greys.
- **Every control answers.**
  - The hero tabs are APG tabs (ArrowRight moves the selection and the focus, and only the selected tab is in tab order). Pause flips `aria-pressed`, and the icon changes to play.
  - The checklist rows fill black with a tick. "0 / 3" counts up to "3 / 3" and its hairline bar draws to full width.
  - Copy changes to "Copied", and the clipboard holds exactly "Read https://hanzo.ai/skill.md and use Hanzo Computer in my project. Start with: hanzo desktop".
  - The primary presses to scale(0.98), and its hover changes the fill from #f5f5f7 to #d4d4d4.
- **Monochrome throughout.** There is no hue anywhere. Two black rooms (hero and Band) are not back to back. Focus rings are white on the dark hero and ink on the paper sections.
- **Reduced motion shows the final state.** With reduced motion on, the demo shows all 5 CSV rows ticked and `getAnimations()` is empty after 3s.
- **The phone layout is clean.** scrollWidth is 375 and nothing scrolls sideways. No tap target is under 44px. The h1 sits on one line at 40px. h1, lede, ask and demo are all inside 700px. The pinned stage stacks into readable panels, each with its object under the copy.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Partly. The demo moves by 0.4s and "If a person can click it, so can this" sits right above it, so the idea lands. But the hero section is 1035px tall at 801px, so the demo's dock and the step-6 action sit below the fold, and the next section does not peek. The 6 tabs are bare numerals: the caption stays "If a person can click it, so can this" for all six steps, so 01 to 06 tell you nothing until you watch each one.
2. **One in, one out, or a document?** Mostly one in, one out through the hero and the pinned stage. After the stage, "It has whatever you have" (a checklist) and "Paste and ship / Get Computer" (two cards side by side) read as two static half-screens in a row before the Band. The terminal cursor blink and the checklist are the only life there.
3. **A real visual object in every section?** Yes:
   - hero: the demo desktop;
   - stage: pixel board, OCR wireframe, permission toggles and waveform;
   - pre-flight: the 0/3 counter, bar and tick rows;
   - ship: the prompt card and a `$ hanzo desktop` terminal;
   - Band: type only, which is acceptable for a closing Band.
4. **One ask, nothing floating, scale rhythm?**
   - On desktop there is one solid fill per viewport. The header ask is outlined "Try Hanzo" over the hero and turns into solid "Try Hanzo Computer" once the hero ask leaves view. The Band "Try Hanzo Computer" is solid, while the header ask turns outlined.
   - Scale has rhythm: h1 52px, stage h3s 26px, pre-flight h2 26px, Band h2 44px, mono labels 12px.
   - One oddity: the largest figure on the pre-flight screen is a 44px "0" (MASTER part 5 says a zero never gets hero size).
5. **Every hover and press answers, no jumps?** Yes for the primary, the tabs (02 to 06 go from #a3a3a3 to #fafafa), Pause (white 8% to white 14%), the checklist and Copy. "hanzoai/computer" underlines on hover. The "Deploy to Cloud" and "Documentation" arrow links showed no colour or underline change on hover (the shared `x-arrow`; the arrow glyph may move). No layout jumps.
6. **Overlap, font swap, layout shift?** None found at either size. CLS is 0.0007 and no element overlaps another. On phone `.cp-lane` measures 496px wide but is clipped, so the page does not scroll sideways.
7. **Which reference, and is its motion there?** Apple product pages: a pinned stage where one panel changes, plus a product demo as the hero. The motion is genuinely there:
   - the hero demo runs itself and the h1 cuts in by line mask (idle and arrival);
   - the toggles and checklist answer with a tick (state);
   - the stage scrubs with the scroll;
   - the terminal cursor blinks (time).

   Scroll-linked motion is well under half of the page's motion.
8. **Different from its neighbours?** Yes. Its hero medium is a scripted desktop with a moving cursor and Set-of-Mark numbering, which I have not seen on the other launch pages. The signature is its own.
9. **18 parts?**
   - Covered visibly: one h1; one solid fill; `data-cta="computer-hero-try"` on the primary; skip link first in tab order; Band; reduced motion; a pause control on the looping demo; a copy button that copies exactly what is shown; 44px targets.
   - Weak: part 3 (the hero is taller than one screen, and the phone hero object is shrunk, not cropped); part 6 (new UI strings that are not in `content/ui-strings.json`, see 11).
10. **Banned tells?** No hue, gradient text, Inter or icon boxes. No pill sits above an h1 or h2: "BEFORE YOU RUN IT" sits below its h2, which is allowed. Nothing floats over content on desktop. None found.
11. **Copy untouched?** No. `parity.py /computer` passes (33/33 text, 4/4 links), but the page adds and rewrites words in `components/pages/ComputerPage.jsx`:
    - `'Text on a web page can redirect it'` (line 269) paraphrases Hanzo's "text on a web page can try to redirect it". Dropping "try to" changes the claim.
    - Invented UI strings that are in neither `content/live/computer.json` nor `content/ui-strings.json`:
      - "Before you run it" (line 285);
      - "Tick each one" / "Start with: hanzo desktop" (line 292);
      - "Hands and voice" (line 262), plus the matching "Pixels" kicker;
      - "Copy the agent prompt" (live says "Copy");
      - "Source".
    - The checklist titles "A fresh user account or a VM" and "Screen Recording and Accessibility" are fragments re-cut from the lede. The checklist therefore repeats, item for item, the paragraph printed beside it.

## Fix list (to reach 8+), most important first
1. **Stop rewriting copy.**
   - Restore "text on a web page can try to redirect it" wherever row 03 quotes it, or title row 03 with the exact live clause.
   - Remove "Tick each one", "Before you run it", "Hands and voice", "Pixels", "Source" and "Copy the agent prompt", or replace each with an existing string from `content/ui-strings.json`. For the copy button, use Hanzo's own "Copy".
   - If the checklist cannot be built only from Hanzo's sentences, drop it and let the lede stand. As it is, the section prints the same three warnings twice side by side.
2. **Fit the hero to one screen at 1470×801.** The hero section is 1035px tall, and the demo's dock and step-6 click sit below the fold. Shorten the demo stage (or start it closer under the h1) so the whole desktop and a 56px peek of "It reads pixels" fit in 801px.
3. **Give the 6 hero steps meaning.** The caption stays "If a person can click it, so can this" through all six. Either tie each tab to a visible change the visitor can read (the counter alone is not enough), or reduce the bare 01 to 06 strip so it does not look like six options that do nothing different. Ideally use Hanzo's own short phrases from the page.
4. **Phone hero object: crop, don't shrink.** At 375px the demo is scaled down to about 0.41× (`scaleX(0.406)` and `scaleY(0.3)` on the window parts), the window titles are hidden (top 0) and the CSV rows become unreadable bars. Show one window at true size, cropped, as MASTER part 11 asks.
5. **The pre-flight and ship screens read like a document.** After the stage, two half-screens of flat cards follow: a checklist, then the "Paste and ship" card beside "Get Computer". Give the ship screen its moment, for example `hanzo desktop` typing in once when it enters view, or the copy confirmation landing visibly in the prompt card. Make the screen alternate quiet and loud rather than presenting two quiet rows.
6. **The resting "0" should not be the biggest thing on screen.** Set "0 / 3" at the 26px heading size until a row is ticked, or count at 44px only once the visitor acts.
7. **Panel headings jump between steps.** "It reads pixels" sits at y=308 and "Mouse and keyboard" at y=235 inside the same pinned frame, so the left column hops about 70px as panels change. Pin the heading to one top line and let the body grow downward.

## Shared chrome
- **Intermittent console error with a red "1 Issue" badge.** On 1 of 10 desktop loads I got a React hydration mismatch: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties". The other 9 loads were clean. I could not attribute it to this page's code, so it is reported here, but the page owner should confirm that the demo does not seed anything from `Date.now()` or `Math.random()` on the server render.
- **Phone first screen shows two white solid fills.** The header ask "Try Hanzo" and the hero "Try Hanzo Computer" are both filled, with different labels. On desktop the header ask is outlined over the hero.
- **The header ask label changes with scroll position.** It reads "Try Hanzo" at the top and "Try Hanzo Computer" further down.
- **The mobile ask bar sits close to the "It reads pixels" panel.** On phone it rises at the bottom edge of that panel (p-02 frame). It is slim and covered no text in my frames, but it sits within a few pixels of the panel's bottom edge.
- **The `x-arrow` links show no colour or underline change on hover.** This affects "Documentation" and "Deploy to Cloud".
