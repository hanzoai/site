# /gui — James-eye review
7 Nov, round 2, walked at 1470x801 and 375x812 (isMobile, hasTouch), plus 320 and reduced motion. Playwright from node: frames at 0, 1 and 3 s, wheel-scrolled a screen at a time with 1.5 s dwell, hovered and pressed or tapped the main controls, opened a platform card, used Copy and the hero pause, and collected the console. Screenshots re-taken with `caret: 'initial'`.

Verdict: 6/10

First complaint: "Why is 'Build it once. Ship it everywhere.' jammed against the left edge of the screen? Then the phones scroll straight through it. That's the main scene on the page and it looks broken."

## The 11 answers
1. **First screen sells, and it moves.** Yes. The h1 cuts in by line, and the black code pill cycles real token values (`p="$4"` to `"$6"`, `bg="$background"` to `"$color2"`). The four device frames under it restyle live to match, all within 1 s with no input. It is a centred stack (h1, mono line, ask, pill, devices), so it reads as a lot at once, but there is one big thing (the h1) and the rest is medium and small.
2. **One in, one out.** Mostly. Section 2 is a pinned stage. The devices stay put while chapters 01 to 05 scroll past on the right, and the stage answers each one: padding grows, tags appear ("Native", "Atomic CSS"), outlines show YStack/Text/Button, and a counter and progress hairline track it. That is the Apple move and it works. After it, the page turns back into a document: install code, a 4-card rail, then "Get GUI" with an agent prompt, then the close. Two large dead gaps (about 250 px of white below the platform cards, and about 160 px of empty black at the bottom of the shorthands room) make it feel like it stops.
3. **Real visual in every section.** Yes. Device frames, a live props editor with a preview, a terminal, platform cards with screen UIs, the agent-prompt card. No icon-only sections.
4. **One ask, nothing floating, scale rhythm.**
   - **Ask:** one ask in the sticky header. It swaps from "Try Hanzo" to "View on GitHub" once you pass the hero, which is in Hanzo's words. Nothing of the page's own floats over content; the cookie card is shared chrome.
   - **Scale:** too flat. The h1 is 52 px and every other heading, h2 and h3 alike, is 26 px, up to a 44 px close. Nothing grows while it is the moment; the pinned stage would be the place for it. Small type is used well (mono counters, chips).
5. **Hover and press.**
   - **Answers:** the token chips (`$2`, `$color2`, …) restyle the preview at once, which is the best moment on the page. Platform cards open into a sheet with the device enlarged. Copy answers. Pause turns into Play and the cycle stops. The GitHub button changes from black to graphite on hover, not just fading.
   - **Jumps:** none seen.
6. **Overlaps, font swap, layout shift.**
   - **Overlap at 1470:** **FAIL.** The pinned chapter head (`.bz-wrap.gu-ch-head`, 1152 px wide) is laid out at `left: 0` instead of centred in the container. So "Build it once. Ship it everywhere." sits flush against the viewport edge with no gutter (h2 left = 0 px; every other heading starts at 159 px). When the stage un-pins, the phone frames and "Hello, Hanzo" scroll straight through the still-pinned h2 (frame desk-s05).
   - **Phone:** on one cycle state the demo card turns mid-grey and "Hello, Hanzo" all but disappears on it (frame phone-s00). It is a demo state, but it reads as broken.
   - **No font swap:** the h1 renders in Zen and the box does not move.
   - **Hero labels:** under the hero devices, iOS/Android sit about 30 px lower than Web/Desktop, a ragged baseline.
   - **Overflow:** none at 375 (the platform rail scrolls inside itself). At 320 the only overflow is the shared header's "Try Hanzo".
   - **Console:** the red "1 Issue" badge in the first walk came from my own screenshot taken before hydration. Re-walked with `caret: 'initial'` and with no early screenshot: zero console errors at both sizes. Not counted.
7. **Reference.** apple.com: a pinned stage where one panel changes, with the product as the hero. It is genuinely there. The cards open in place as a sheet, not the synchronized.studio card that becomes the next page's hero. There is no count-up or marquee; the ambient motion is the self-running token cycle, which is fine.
8. **Different from its neighbours.** Yes. A live props demo across four device frames is its own hero medium and signature.
9. **18 parts.**
   - **Covered:** strategy (one ask), narrative, conversion (GitHub, Deploy to Cloud), trust (license and stars chips), states (pause), mobile, and reduced motion, which shows the final state with every chapter visible.
   - **Thin:** the end of the page rhythm (parts 3 and 6), and spacing consistency (part 7: the missing gutter and the dead gaps).
10. **Banned tells.**
    - **Overlap at 1470x801:** yes, the pinned h2 against the device frames. That alone fails the page.
    - **Inconsistent spacing:** the h2 at 0 px against 159 px everywhere else, and the dead gaps.
    - **Clean:** no hue (the main-content scan found no chroma), no Inter, no eyebrow above a headline, no browser-default controls, no gradient text.
11. **Copy untouched.** It reads as Hanzo's copy; nothing looks rewritten. The iOS sheet reuses the chapter 01 sentence, which is fine.

## Fixes, in order
1. **Centre the pinned chapter head.** Put `.gu-ch-head` inside the 1152 px container with `margin-inline: auto` and the gutter, so its left edge lines up at 159 px like every other heading. The cause is likely sticky or fixed positioning with `left: 0`, or the wrapper's auto margins being lost.
2. **Stop the un-pin collision.** Release the pinned h2 at the same scroll point as the device stage, or fade or clip it before the frames reach it. Nothing may pass under it at 1470x801.
3. **Fix the unreadable phone demo state.** On the `$accent`/grey state, either keep the demo card light or invert its text to white, so "Hello, Hanzo" stays legible at every cycle step.
4. **Close the dead gaps.**
   - Below the platform rail (about 250 px of white): cut to one section pad.
   - At the bottom of the shorthands black room (about 160 px of empty black): end the room after the editor.
5. **Give scale some rhythm.** Let the active chapter title or the stage counter grow while it is the moment, then settle back to 26 px. As it is, everything after the h1 rests at exactly 26 px.
6. **Align the hero device labels.** iOS/Android and Web/Desktop captions should sit on one baseline (bottom-align the frames, or give the captions a shared row).
7. **Optional, to reach 8.** Make the platform card open into its page (the synchronized.studio card-to-hero) rather than a centred sheet, or add one more non-scroll moment after the pinned stage, so the second half isn't a document.
