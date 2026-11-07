# /integrations/* — James-eye review

Verdict: 7/10
First complaint: "The top's good. Then there's a big empty gap, and it's the same white code box three times. I swipe to the next one and it's the exact same page. And why did the code disappear and type itself again?"

Walked 7 Nov, 14:20–14:42, on the template (`components/pages/integrations/Guide.jsx`, `intParts.jsx`, `guide.css`, plus `components/v2/fam.css`). HEAD `74e626f`, and the owner's uncommitted "v4" was being edited while I walked: Guide/intParts/guide.css at 14:36, fam.css at 14:41. Everything below is re-measured on that working tree. Routes walked: /integrations/langchain and /integrations/cursor in full, /integrations/openai-sdk at a glance.

How I walked it:
- Filmed at 1470×801, with wheel scrolls and dwells. The phone was 375×812 with touch scroll and a sideways swipe.
- Hovered and pressed every control on desktop.
- Checked the clipboard after every Copy.
- Ran reduced motion and JS off.
- Gates: `taste.py` OK (3 files). Parity: langchain 92/92 text and 23/23 links, cursor 77/77 and 23/23.

This replaces the 5/10 review of `3389ac0` (see git history). Fixed since then:
- the emoji and coloured tag over the h1;
- the per-member hues;
- the still first screen;
- the missing hero ask;
- the header ask beside the bar;
- phone CLS (was 0.15).

Stills:
- `img/integrations-family-blink.jpg`: the served code, then the blank, then the retype.
- `img/integrations-family-scroll.jpg`: a chapter card with its cut shadow, and the phone with the Hanzo lines cut mid-URL.

## What works
- **First screen:**
  - The h1 is 96px at line height 0.92. Zen renders, and the h1 box does not move after first paint.
  - The lede, crumbs and one solid ask ("Get API key — Free") sit above the fold at both sizes.
  - While the page ask is on screen, the header's "Try Hanzo" steps back to an outline.
- **No eyebrows, 0 UI hues** (`taste.py` and a computed-colour scan both agree).
- **Copy is exact.** In all 5 windows on both guides, the clipboard equals the displayed code byte for byte, and a drawn check confirms each copy.
- **Motion is a real mix:**
  - time: the typed session, now with stop and replay;
  - state: the "Hanzo lines" switch dims every window at once;
  - pointer: the magnetic ask, the drag rail with inertia, card lift with preview and a turning arrow;
  - idle: the contour drifting in the close;
  - arrival: the h1 masked rise;
  - scroll: the editor settles and the chapters wipe.
- **Hover and press answer** on the ask (grey step, magnetic, scale .98), Copy (ring, scale .92), the switch, the cards, the list (nudge and underline) and the band buttons.
- **Resilience and layout:**
  - Reduced motion: 0 running animations, full code, the stage settled.
  - JS off: 45 of 45 blocks visible, and chapters stack.
  - CLS: 0 on desktop, 0.0008 on the phone (v4 fixed the 0.10 that blanking used to cause).
  - The phone swipe turns to the next guide (langchain → llamaindex, cursor → docker). A swipe on code stays in the code.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. "Use Hanzo AI with LangChain" plus a live editor sells to a developer, and the words rise on first paint. But the editor is not "whole on the first screen" as Guide.jsx and the coverage file claim: at 1470×801 it runs 452→988, about 65% visible. Worse, the served code paints in full, then about half a second later goes blank, then retypes over about 3 s (still 1). On a phone the code types off screen and you scroll into half-typed lines.
2. **One in, one out, or a document?** Half. The chapters pin and wipe, one in and one out. But:
   - between the editor and the first chapter there is about 300px of empty white (a screen with nothing on it);
   - the chapter text (title, a language label, a switch) changes about half a second before its card finishes wiping, so the heading names one sample while the card shows the last;
   - after the chapters, the credit strip is a document: an emoji tile and a paragraph.
3. **A real visual object in every section?**
   - Hero: yes. The editor plus a route diagram.
   - Chapters: the same white code card three times (two of Cursor's are 3 to 5 lines of comments).
   - Credit: a 48px emoji in a grey tile. An icon alone fails.
   - Close: only a faint drifting contour.
   - No Hanzo imagery anywhere (none exists for guides, but nothing stands in for it).
4. **One ask, sticky after the hero?** Mostly. One ask in Hanzo's words in the hero, the bar and the close; one solid per screen now. But the bar only arrives once the whole editor has left. From y≈350 to ≈1140 on desktop, and ≈500 to ≈1950 on the phone, the page ask is gone and the only solid is the header's "Try Hanzo", which is different words.
5. **Every hover and press answers, no jumps?** Almost. Two misses:
   - The editor's "platform.hanzo.ai/api-keys" link (the key path itself) has no hover or press.
   - The chapter marks have no hover.

   The "Only the Hanzo lines" switch is an unlabelled icon toggle with a bare "2 / 9". Nobody will guess what it does. On openai-sdk "Streaming" (0 / 7), turning it on greys out the whole sample. On cursor "Available models" (3 / 3) it does nothing.
6. **Overlaps, font swap, layout shift?** No swap, and CLS ≈ 0. But:
   - Under every chapter card the long shadow is cut by the scene's clip, leaving a pale box with hard sides (still 2).
   - Phone: the Hanzo lines, the one thing this page exists to show, are cut mid-URL (`openai_api_base="https://api.`) in every sample.
   - Phone: the chapter card title is clipped ("LangChain TypeS"), and the base-URL Copy sits alone on its own row.
   - Phone targets under 44px: "platform.hanzo.ai/api-keys" 182×19, "LangChain AI" 129×27.
   - Phone text: the category ("FRAMEWORKS") is 13px.
7. **Which reference, is its motion there?**
   - Apple's pinned chapters: yes, but with one kind of object.
   - The typed session: motion.dev-ish.
   - synchronized.studio (card opens into page): not verifiable here. Every card click on the dev server took over 700 ms, and the site's Morph fallback scrolls the old page to its own top and cuts, so you see "with LangChain" again for 1–2 s before LlamaIndex arrives. That fallback is site-level (`components/Morph.jsx`), but it is what this family's click does whenever the next page is slow.
8. **Different from neighbours?** No.
   - Same build as /benchmarks/*: Display h1 left; lede, crumbs and ask right; a FamStage object under it; FamChapters; FamNext contour cards; dark close with a drifting contour.
   - /sdks also opens with a Display h1 over a code editor.
   - The 19 guides differ only in words and a faint still contour, so the swipe lands on the same page.
9. **18 areas?** See below. A coverage file exists (`docs/coverage/integrations-family.md`), but three of its claims are false: the editor is "whole on the first screen", "targets are 44px or more", and the typing is done "within the first second".
10. **Banned tells?** None hard. One colour emoji is left (the credit tile, 48px). The /integrations index greys the same emoji (`IntegrationsIndex.css:152`, `filter: grayscale(1)`), so the guide is the odd one out. The only native tooltip is the footer mic ("Talk to Hanzo"), which is site chrome.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 Scroll story:** the white band between the hero and chapter 1 breaks "one new idea per 100svh". The morph cannot be verified, and the slow-path fallback shows the old page.
- **2.4 Conversion:** the ask bar waits for the whole editor, leaving a page-ask gap of about one screen on desktop and 1.5 on the phone.
- **2.6 / 2.12 Contrast:** code comments and punctuation `#8e8e93` measure 3.26:1 on white and 2.92:1 on the Hanzo band; the plan asks for ≥4.5:1. Cursor's "Tips" sample is all comment text.
- **2.8 Components:** the switch has no visible name. The 0-hit and all-hit states are broken. Copy's "Copied" is an aria-label swap, not a `role=status`.
- **2.9 Motion:**
  - the served code blanks before it types;
  - typing speed counts frames (2 characters a frame), so it runs twice as fast at 120 Hz as at 60 Hz;
  - chapter text and card are out of step.
- **2.11 Mobile:** Hanzo lines cut, card titles clipped, the 19px and 27px links, the 13px category, and the orphaned base-URL Copy.
- **2.15 Related:** the six cards are the same six in the same order on every guide. Cursor shows OpenAI SDK, Anthropic SDK and LangChain, not Continue.dev or GitHub Copilot.
- **2.16 Developer experience:** Cursor's "JSON" block opens with `// Settings > Models > Add custom model`, so the copied block does not `JSON.parse`. Split the comment off as a caption; the words stay.
- **Variation (JAMES.md 8):** no per-guide hero medium or signature beyond the words.

## Fixes (in order)
1. **Kill the blink.** Never show the served code and then take it away. Ghost the editor's code until typing starts, with `@media (prefers-reduced-motion: no-preference) { html.js .xig-ed[data-state=rest] .xig-pre { color: transparent } }` (state stays "rest" under reduced motion, so the media query is required), and start typing on first paint, not on hydration plus in-view. Or type only the Hanzo lines into an otherwise complete sample. Reduced motion and JS off keep the full code.
2. **Close the gap and make the chapters a scene, not three copies.**
   - Pull chapter 1 up so it starts as the editor settles; no empty screen.
   - Keep one code window pinned and change its contents per chapter (tab morph plus line diff, with Hanzo's lines lighting up), instead of wiping in identical cards.
   - Put the text change and the card change on one clock.
   - Let the close's contour actually read (it is 20% white on black).
3. **Fix the phone's reason for being.**
   - Wrap long lines on ≤900px (`white-space: pre-wrap` with a hanging indent), or at least wrap `.xig-ln.hz`, so the base URL is whole.
   - Let the chapter card title wrap.
   - Keep the base-URL Copy inline with the URL.
   - Give "platform.hanzo.ai/api-keys" and the author link 44px hit areas.
   - Set the category to 14px.
4. **Name the switch, and hide it where it means nothing.** Show "Only the Hanzo lines" as visible text (it is in the register; ask James to sign it). Do not render the switch when hits are 0 or equal to all lines. Add a hover and a press to the editor's key link and to the chapter marks.
5. **Fix the craft.**
   - Stop the clip-path cutting the card shadow: put the shadow on an unclipped wrapper, or clip with an overflow margin.
   - Raise code comments and punctuation to `#6e6e73` (5.07:1).
   - Grey the credit emoji like the index does (`filter: grayscale(1) contrast(1.08)`), or replace the tile with the tool's real monochrome mark.
6. **Give the family its own face, and the ask its full run.**
   - Change something structural per tool category (frameworks, editors, infrastructure, languages): e.g. the editor becomes a terminal for infrastructure and an IDE settings pane for editors, with the route diagram animating a request through api.hanzo.ai. Then a swipe lands somewhere new, and it no longer reads as /benchmarks with code.
   - Let the ask bar appear as soon as the hero ask leaves, not after the whole editor.
   - Rank the six sibling cards by category.
   - Re-test the card-to-h1 morph on a production build, and make the slow path cover with the veil rather than scrolling the old page.
