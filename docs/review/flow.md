# /flow — James-eye review
7 Nov, round 4, walked at 1470x801, 375x812 and 320 (isMobile, hasTouch) with Playwright Chromium: frames at 0/1/3 s untouched, wheel-scrolled a screen at a time with 1.5 s dwell through every pinned chapter, hovered/pressed every main control on desktop, tapped on phone, opened a figure card, ran Copy and the playground's Next, and reloaded under prefers-reduced-motion at desktop and 375.

Verdict: 6/10

First complaint: "It's the same six boxes three times. The hero, the 'Step through it' bit and the black playground all go document loaders to output parsers, received, returned. Then the chapters are little grey wireframes sitting in the top half of the screen with a big white gap under them. Where's the actual product? Show me Flow."

## The 11 answers
1. **First screen in 5 s, motion in 1 s: yes.** "Hanzo Flow", Hanzo's lede, Open Flow / Documentation, and a node graph on the right that runs by itself. By 1 s the first wire is drawing and node 01 flips from "received" to "returned". This is the best thing on the page. Against it: the graph sits top-right and the bottom ~300px of the hero at 1470x801 is empty dot grid. At t=1 s node 01's "received —" and "returned text splitters" cross-fade on top of each other for a frame, so the two lines overlap mid-swap.
2. **One in, one out: partly.** The six "The canvas is not the ceiling" chapters are a real pinned stage. The text column swaps and one panel changes, with a 01–06 progress hairline. But the stage is anchored at the top of the viewport and every chapter leaves ~270px of dead white below it at 1470x801. On phone the chapters stack into stage, heading, paragraph and then a long white gap. After the pin, the page goes back to being a document: four figure cards, Get Flow / Paste and ship, Run it locally first, View on GitHub, closing.
3. **A real visual object in every section: thin.** The hero graph and the playground are real objects. The chapter panels are diagram stubs: a chip cloud, a dark "Python class" card with a typing caret, six boxes of grey bars ("Step through it"), three dots on a line ("Multi-agent"), "a flow" fanning out to three pills, and a checklist. There is not one real Flow screenshot, film or product UI frame on a page about a visual canvas product, and no block of 4+ real Hanzo visuals anywhere.
4. **One ask, nothing floating, scale rhythm: mostly.** The desktop header ask turns from "Try Hanzo" into "Open Flow" once past the hero. That is good and in Hanzo's words. Against it:
   - The hero's "⏸ 01 / 06" control is absolutely placed bottom-right. As you leave the hero it rides up and sits right under the header over the next section's edge (desk scroll 1). On phone it sits alone in a dead dotted band.
   - On phone the header still says "Try Hanzo" while a bottom bar says "Open Flow", so there are two different asks on screen.
   - Scale has some rhythm: h1 52, chapter heads 26, the active figure card's "Python" or ":7860" grows to ~64 while the others rest smaller.
   - It also has misses. The playground's RETURNED value is set larger than the box holding it. The closing repeats the hero lede at 44px, bigger than the 21px it had in the hero.
5. **Every hover and press answers: most.** Open Flow darkens and presses to 0.98. Hero nodes ring on hover and drive the graph on click. Playground step chips light up. Figure cards tint, their + fills black and the card opens a dialog. Copy turns into "✓ Copied". Taps answer on phone. Dead on hover: the playground Previous and Next buttons (no change at all), and Documentation (no hover state, only a 1px press).
6. **Overlap, font swap, layout shift: no shift (CLS 0.0015 desktop, 0.0055 at 375, 0.008 at 320), no horizontal overflow at any width, no hydration issue from this page** (Next badge reads 0 issues). Visible defects:
   - The playground's RETURNED card puts "Retrievers", "Vector stores" or "REST endpoint" in ~44px type jammed against the top edge, with the bottom half of the white card empty. It is the same under reduced motion, so it is a layout bug and not a mid-animation frame.
   - On phone the RETURNED slot is often just "▪▪▪" over ~250px of empty black.
   - At 375 the Keys chapter's 01/02/03 chips are squeezed, with the text pushed against the right edge.
   - At 375 the playground's done-step chip is light grey on light grey ("01" barely readable).
   - The hero cross-fade overlap is noted in 1.
7. **Reference: apple.com pinned scenes, half there.** The pin and one-panel-changes are there. Apple's product-as-hero and huge type are not, because the product never appears. synchronized.studio's card-into-page shrinks to a card opening a centred modal. No 3D or WebGL moment. The motion mix is honest: idle (hero graph autoplay, playground autoplay), time (typing caret in "Open any node"), state (dialog, Copied, step chips), pointer (hover rings), scroll (the pin). Scroll is not the majority.
8. **Different from neighbours: yes in idea** (a live node graph as hero is Flow's own). It is weakened because the same graph idea is then reused twice more on the page.
9. **18 parts:**
   - Covered: hero with ask, narrative chapters, demo, proof figures, install and agent-prompt dev section, closing with ask, footer, states (Copied, paused, reduced motion), sound toggle in the header.
   - Missing: media (part 10) is missing entirely.
   - Weak: trust and proof is weak (License and GitHub chips only).
   - Thin: phone is functional but thin (see 2 and 6).
   - Reduced motion is half-done. The playground shows its final 06/06 state, but the hero stays on "01 / 06" with wires undrawn and a Pause button still showing.
10. **Banned tells: no hue, no gradient text, no eyebrow over an h1/h2, no browser-default controls, no fading buttons.** Off-token greys: node body text uses `#4d4d4d` and the "Python class" and "Every component" labels use `#333333`. Neither is on the deck ramp. The "anything floating over content" rule is brushed by the hero's 01/06 control (see 4).
11. **Copy untouched: yes.** Every visible label traces to flow.json, flow.html or ui-strings. Labels like "Python class", "a flow", "the parameter you need", "live on the next run", "references by name" and "the node that caused it" are pieces cut from Hanzo's own sentences. That is allowed, but it means each chapter says its sentence twice, once in the diagram and once beside it. The figure dialog then says "Python class" eight times under eight chips and repeats the chapter paragraph a third time.

## Fixes, in order
1. **Stop telling the six-step chain three times.**
   - Keep the hero graph as the live object.
   - Make the playground the one place you step through received → returned.
   - Give "Step through it" a different panel (for example the playground's own step rail, scrubbed), not grey bars.
2. **Put the real product on the page.** Use a Flow canvas screenshot or screen film from Hanzo's own media in the pinned stage, at least for "Open any node" and "Multi-agent". Add a block of 4+ real Flow frames where the four figure cards are, if Hanzo has them. The diagram stubs stay only as overlays on real UI.
3. **Centre the pinned stage vertically** in the 801px viewport, or let it fill it, so no chapter has ~270px of dead white below. On phone, close up the gap after each chapter paragraph.
4. **Fix the playground RETURNED card.**
   - Size the value to fit the box (32px, matching RECEIVED), with even padding, vertically centred.
   - On phone, never show an empty "▪▪▪" slot: show the last returned value until the next one arrives.
5. **Reduced motion: show the hero's final state.** All six nodes "returned", all wires drawn, and the control shows 06 / 06 with no Pause.
6. **Move the hero "⏸ 01 / 06" control** inside the graph's own frame, under node 06, so it never rides under the header or floats in an empty band on phone.
7. **Phone: one ask.** Either the header ask becomes "Open Flow" as on desktop, or the bottom bar goes. Never both with different words.
8. **Give Previous/Next a hover** (fill #262626 and icon to #fafafa, as on Pause) and give Documentation a hover (the arrow moves 4px or the underline draws).
9. **Fix the hero cross-fade.** The outgoing "received" line must be gone (or masked) before "returned" arrives in the same slot.
10. **Phone details.** Give the Keys chapter's 01/02/03 chips their full width. Give the playground's done-step chips readable contrast: ink text on #e5e5e5, or white 55% on graphite.
11. **Put the off-ramp greys back on tokens:** `#4d4d4d` → `#525252`, `#333333` → `#404040` or `#262626`.
12. **Trim the figure dialog.** Drop the eight repeated "Python class" sublabels, and don't repeat the chapter paragraph the reader just scrolled past. Set the closing restatement of the lede at the 26–32px step, not 44px above the hero's own 21px.
