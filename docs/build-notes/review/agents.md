# /agents — James-eye review

Ready: 7 Nov 21:35, held up next to /api and /affiliate (James's new bar, no score). Five steps take the stage in turn as you scroll (no pin), requests type in under the code, click holds a step; Koma film clear of the copy; hero card fixed height. taste/unique/parity OK (221/221, 4/4); 0 console errors, no overflow at 1470 and 375. Shared, not this page: header ask swap lives in components/Ask.jsx; cookie banner floats. Re-checked 8 Nov under the real copy check: copycheck missing 0 of 94 (every FAQ answer stays in the conversation and a question asked re-types its answer in place; agent.ts plain runs are spans).
Reviewed: 2026-11-07 16:40 UTC, walked at 1470x801 and 375x812 (touch). I filmed it with motion.mjs (shots/agents/d.webm, p.webm and the sheets) and ran my own Playwright walks: idle, hover, press, step click, FAQ, JS off and reduced motion.
Verdict: 5/10
First complaint: "The top's nice, the little run ticks through by itself. Then I scroll and it's a document. Code, more code, a big block of text, questions. Nothing comes in, nothing goes out, it just sits there. And why does the box in the hero keep getting taller?"

## The 11 answers
1. **First screen, 5 seconds, motion within 1 s.** Mostly yes. The five-step run plays on its own (01/05 to 05/05, ticks, pause/replay), and the glass-frame art behind it is alive. But the film shows a black stage with only the art for about 2 s before the h1, body copy and asks cut in, and the desktop d-sheet-01 starts on a blank white frame. The body copy sits on top of the frame art at both widths ("A small… over… No" at 1470; "API key… No" at 375), so the art is behind words that need to be read.
2. **One in, one out, or a document?** It is a document. After the hero, motion.mjs reports STILL on screens 2 to 7 at 1470 (6 still screens) and 9 of 11 at 375. The pinned "five steps" stage is 2,400 px tall and only moves a line highlight and the step label size. d-sheet-06 shows 12 identical frames (4 s of scrolling with nothing changing). Install, Prompt and FAQ only fade in.
3. **A real visual object in every section?** Partly. Hero: the live run plus the frame art. Install: a large `$ npm i -g hanzo` with a command list. Script: a code window. Prompt: a text block in a card. FAQ: nothing. Band: type only. Three sections in a row have mono text as their only object, so it reads as one object repeated.
4. **One ask, in the sticky header, nothing floating; scale rhythm.**
   - The ask is not one. At 1470 the header says "Try Hanzo" on the first screen, the hero says "Sign up headless", and after scrolling the header swaps to "Sign up headless". At 375 the header stays "Try Hanzo" for the whole page.
   - The cookie banner floats over content at the bottom centre of every screen on both widths (on the phone it covers the hero run).
   - Scale is fine: h1 52, h2 26, the install command big, and the 88 px band line as the one big moment.
5. **Does every hover and press answer?** No. The primary ask's hover brightens the fill and its press is scale 0.98 (good). Copy buttons answer, and so do the step rows in the script stage. These do not:
   - "Read the docs" in the hero barely changes (about 1 px of underline), and DEAD in the band.
   - "Agents SDK" and "llms.txt" are DEAD on one pass and give a 1-pixel change on another; "Book a call" also changes about 1 pixel.
   - The FAQ rows ("Can an agent sign up…", "How do I keep…", "Which tools…") are DEAD.
   - The pinned step list rows (01, 02, 04) are DEAD; they only change through scroll.
   - The prompt card is DEAD.
   In total motion.mjs counts 15 dead controls at 1470. Clicking hero step 02 jumps to 02/05 but shows ticks on all five rows, so the state reads as wrong.
6. **Overlaps, font swap, layout shift?** Yes:
   - **The hero run card grows.** At 1470 it is about 478 px tall at load and about 530 to 550 px as the steps run (bottom edge from 626 to 699).
   - **Text overlaps on the phone.** In the hero run's description, the outgoing and incoming step texts sit on top of each other mid-crossfade ("POST /v1/chat/completions…" over "…token. It is"), shown in p-scroll-01.
   - **Layout shift.** motion.mjs measures CLS 0.024 at 1470; my walk measured 0.012.
   - **No overlap of header, hero and buttons.** The h1 box is stable (52 px).
7. **Which reference, and is its motion there?** It wants to be an Apple pinned scene for the five-step script. The pin is there, but the scene barely changes: no scrubbed reveal of each request and no response landing. An anthropic.com-style launch with figures as the hero is absent. Pointer-aware detail (osply/hamol) is absent beyond the primary button.
8. **Different from its neighbours?** Yes, the hero is its own: a stack of glass frames plus a self-running step console. Below the hero, the install, code and prompt blocks look like every other developer page.
9. **The 18 parts.**
   - **Matches the brief.** The MASTER /agents brief is met literally: hero, the #headless sequence as a numbered code block, the AgentPrompt, the Band, and a terminal demo with pause and a static final frame.
   - **Missing.** The 4.1 Launch frame's "proof" screen. No figure or count-up anywhere.
   - **Broken without JS.** The band's "No human required." stays blurred and unreadable, and the pinned script section leaves a screen-tall empty grey void.
   - **Broken with reduced motion.** A React hydration error ("server rendered HTML didn't match", Pause vs Replay button in the hero run) puts a red "1 Issue" badge on screen in dev.
10. **Banned tells?** None hard. The palette is monochrome; there are no gradients, no Inter and no kicker over the h1. "FOR AGENTS" sits in the terminal chrome and "—— INSTALL" / "—— HEADLESS" sit below their headings, which is allowed. The floating cookie bar is the "floating over content" smell.
11. **Copy untouched?** It appears so. All headings and body text read as Hanzo's own. I did not diff against the original.

## Fixes (ranked)
1. **Make the pinned "five steps" stage a real scene.**
   - As each step pins, scrub the step's lines into view and stream that step's response under the code (token, key, `"ready"`, deposit address), so the scroll changes something you can see every 100 px.
   - Cut the dead first 4 s of the pin.
   - Without JS, render the stage unpinned so there is no empty void.
2. **Fix the hero run card height.** Reserve the description panel's height for the tallest step, so the card never grows from 478 to 550 px. Crossfade the step descriptions in one grid cell with the outgoing text fully gone before the new one shows: no superimposed text on the phone.
3. **One ask in the header, everywhere.** Have "Sign up headless" in the sticky header from the first frame at both widths, or keep "Try Hanzo" everywhere, but not one word on the first screen and another after scroll. The phone header never swaps today.
4. **Give every remaining control an answer that is not opacity:**
   - "Read the docs" (hero and band), "Agents SDK", "llms.txt", "Book a call": move the arrow and draw the underline.
   - FAQ rows: rotate the plus and shift the row tint.
   - Pinned step rows: preview that step's line number on hover; click to scrub to it.
   - Prompt card: lift the Copy affordance on hover.
5. **Fix the hydration mismatch in the hero run** (Pause on the server vs Replay on the client under reduced motion). It throws a page error and shows the dev issue badge.
6. **Bring the hero copy in with the h1, not about 2 s after a black frame.** Land the headline cut-in within 1 s and start the run at 01/05, not on a pre-ticked 05/05 frame. Fix the step click so a jump to 02 does not tick 03 to 05.
7. **Add the proof beat from MASTER 4.1.** One quiet row of real numbers already in the copy (Kai at $0.021 per million input tokens, a 24-hour deposit address, the five requests), with count-ups. It breaks the run of mono text blocks and gives the page a figure moment.
8. **Give the band one more alive thing,** for example the "No human required." line cutting in with the run's final tick. Fix its no-JS state, where the headline stays blurred.
9. **Move the hero frame art off the body copy.** Keep it clear of the paragraph at both widths, or put a gradient under the text; no art behind words that need reading.
10. **Dock the cookie consent to the bottom edge** (a full-width slim bar, or a corner on desktop) so it stops floating over the hero run on the phone.
