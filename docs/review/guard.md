# /guard — James-eye review
7 Nov. Walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s untouched, then a wheel scroll a screen at a time with 1.5 s dwell, then hover, press and tap on every control, a reduced-motion pass and an overflow check at 320. Neighbours /kms and /gateway were looked at for variety.

Verdict: 6/10

First complaint: "There's a red error thing in the corner, and the hero box jumps when it loads. Then I scroll and every section has a little 01 / 06 label sitting on top of the heading, with big empty white gaps between the parts. It's the same stage as Gateway. It's not premium yet."

## The 11 answers
1. **First screen sells; something moves in under 1 s.** "Guard / It reads what goes into a model, and what comes back" plus a typing request that turns into [CARD] / [EMAIL] markers within 3 s. But at 0 s the lede and ask are missing and the hero card is 1208px wide at y=407. By 1 s it has snapped to 1098px at y=388, a visible jump. At 1470x801 the payoff, the redacted reply, lands below the fold (y≈775), so a desktop visitor never sees the reply half of "and what comes back".
2. **Half in and out, half document.** The pinned 01–06 stage swaps one panel at a time, which is good. Around it are dead white gaps: about 400px after the stage, about 250px before "Each becomes a typed marker" and about 300px under the closing ask. Those stretches read as a document with holes in it.
3. **Every section holds an object.** The hero demo, six stage panels (rows, marker tiles, request/reply, toggles, hash, proxy/CLI/MCP), the agent-prompt block, the live playground and the Sigil contour art. The stage panels are text in grey boxes, not product UI, and "content / hash of the content" is thin.
4. **Ask and scale.** The header ask is inconsistent. On desktop it reads "Try Hanzo" (outlined) in the hero, then swaps to a solid "View on GitHub". On phone it stays a solid "Try Hanzo" beside the solid white hero "View on GitHub", so two solid fills with two different labels share the first screen. Nothing floats over content except the shared cookie card. Scale rhythm fails in the stage: panel rows are 26–32px bold ("Overriding the instructions", "MCP server") and outshout the 32px section heading beside them. That makes two big things per screen and no small.
5. **Hovers are weak.** Hero ask: #f5f5f7 to #fff on black, invisible. Header ask: opacity drops to 0.88 (a fade, which is banned). Stage dots, detector chips and the marker switch have no hover change at all. Copy only gains a faint shadow. Press is good (scale .98). After clicking the hero "View on GitHub", the spinner (aria-busy) is still there 2.3 s and more later and never returns to its label.
6. **Overlap, swap and shift.** The hero card resizes after hydration on both sizes; at 375 and 0 s the card is full-bleed with text touching the screen edge, then it insets. There is no horizontal scroll at 375 or 320. The agent-prompt line is cut at 375 ("…and use H"). The Sigil contours run behind the "hanzoai" chip and text on the phone closing band. There was no font swap.
7. **Reference.** It feels like an apple.com pinned scene (one panel changes) on a Vercel-style black hero. The pinned-stage motion is actually there. Nothing from synchronized.studio or osply is present: no pointer-aware detail, no card-to-page.
8. **Variety is weak.** The "01 / 06 + dots" pinned stage with heading left and panel right is the same signature as /gateway, mirrored. The centred h1 plus ask plus product card hero is /kms's layout in a black room. Guard's own moment is the redaction demo and playground, which is good but not the page's spine.
9. **The 18 parts are mostly covered.** The parts that fail:
   - 3: the hero object moves on load.
   - 4: two solid fills on phone, and the busy state never ends.
   - 12: h1 jumps straight to h3 (stage heads are h3 at 32px; h2s come later at 26px).
   - 17/DONE: hydration error.
10. **Banned tells:**
    - "01 / 06" Zen Mono counter sits directly above every stage heading (label above a headline), on all six.
    - On phone the orphan "WHAT IT LOOKS FOR" caption sits about 90px above "Paste and ship" and reads as its eyebrow.
    - Header ask fades on hover.
    - Stage panel is outlined and shadowed (raise or outline, never both).
    - A 3px black bar down the left of the playground textarea on focus reads as a stripe down a card.
    - Off-deck greys #f5f5f7 and #2c2c2e on the asks.
11. **Copy looks untouched.** Hanzo's lines appear verbatim (license, hanzoai, Deploy to Cloud, the six detector names). I did not diff.

## Fixes, in order
1. **Kill the red "1 Issue" badge.** There is a hydration mismatch on `textarea#gd-in`: the server renders `style={{}}` but the client sets `caret-color: transparent`. Set the caret style only after mount, through a class toggled in an effect, or render the same value on the server. Zero console errors at both sizes.
2. **Stop the hero card jumping.** The card's width, inset and y must be final in server HTML: 1098px wide at 1470, 16px gutters at 375. It must not change between 0 s and 1 s. Lede and ask must be visible at 0 s, cut in by line mask rather than appearing late from nothing.
3. **Get the reply on screen at 1470x801.** Pull the hero up about 60–80px: tighten the h1/lede/ask stack and cut the request-row min-height of about 100px of empty space. "reply ← model … Done. Use key [API_KEY]" must land above the fold. On desktop, the demo's payoff is the page's sell.
4. **Remove the label above every stage heading.** Drop "01 / 06" from above the h3, or set it below the heading and copy as a caption beside the dots. On phone, move "WHAT IT LOOKS FOR" so it sits with the dots of its own section and never directly above "Paste and ship" (or hide it under 900px).
5. **Fix scale in the stage panels.** Panel rows go to 17–21px Book (not 26–32px bold), with tags at 12–13px Zen Mono. The 26px section heading on the left (use h2 at 26px, fixing the h1 to h3 skip) is then the one big thing. Grow a single panel element only while it is active, then settle.
6. **Make every hover answer.**
   - Hero ask on black: a visible fill change to #e4e4e7, or the magnetic 22px move.
   - Header ask: no opacity fade; change the fill instead.
   - Stage dots: grow 6 to 10px on hover and show the step title as a 12px caption.
   - Detector chips: invert on hover and preview the count they would remove.
   - Marker switch segments: hover fill.
   - Copy: label and icon swap, not a shadow.
   - Closing ask hover uses #262626, not #2c2c2e. Hero ask rest is #f5f5f5, not #f5f5f7.
7. **End the stuck busy state.** "View on GitHub" aria-busy must clear after 200–400 ms, or on `visibilitychange`/`pagehide`, so returning to the tab shows the label, not a spinner.
8. **One solid fill per viewport on phone.** Either the header ask is quiet (outlined) while the hero ask is in view, then turns solid once it leaves (as on desktop), or the hero ask is the outlined one. Use one label logic at both sizes.
9. **Close the dead gaps.** Remove about 400px after the pinned stage, about 250px above "Each becomes a typed marker" and about 300px under the closing ask. Overlap old and new objects by about 40px so one comes in as one goes out. Put "Paste and ship" heading-left/lead-right on the 8/5 grid like the rest instead of a heading floating right of the code block with its line running to the edge.
10. **Panel surface.** Choose a 1px hairline or the floating shadow, not both. A pinned panel is not floating, so use the hairline. Keep the panel inside the 1152px container so its right edge doesn't sit 24px from the window while the middle 110px is empty.
11. **Playground focus.** Replace the 3px black left bar on the focused textarea with the standard 2px ink focus ring around the field.
12. **Phone fixes.** Let the agent-prompt line wrap (or show a visible scroll affordance) instead of cutting at "use H". Keep the Sigil contours clear of the "Get Guard" text and chips: art right of 60%, or under them at 30% or less ink.
13. **Differ from /gateway.** The pinned "heading left, panel right, six dots" stage is Gateway's signature. Give Guard its own: for example, the hero redaction demo becomes the pinned stage, with each detector step redacting the same sentence in place (one sentence, six passes) instead of six unrelated grey panels. Or drop the dots and let the confidence bar scrub with scroll.
14. **Add a pointer moment.** The page has idle (typing), scroll (stage) and state (playground) motion but no pointer motion. Add a subtle 2.5° tilt on the hero demo card or the playground on fine pointers.
