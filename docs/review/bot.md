# /bot — James-eye review

Verdict: 6/10
First complaint: "The top's great, the bot actually works in front of me. Then after the scrolly bit it turns back into a long document: install, steps, prices, questions, all stacked, nothing moving. And on the phone the steps are squashed into a little strip."

Walked 2026-11-07 16:20–16:27 UTC, HEAD fc751a9a, at 1470x801 and 375x812 (isMobile, touch). Cold load and reload, shots at 0.2/1/3/6 s with pixel-change measurement, a wheel walk in 200px (desk) / 160px (phone) notches with 0.7 s dwell, then hovered, pressed and clicked the primary, hero channel tabs, the pause button, the "See all ten workflows" sheet, tool categories, the pricing slider, Copy and the FAQ button, and tapped the tabs on phone. Also ran reduced motion, JS off (both sizes), 320px width, `taste.py` (OK) and `parity.py /bot/` (306/306 text, 21/21 links).

## What works
- The hero object is the product: a channel where a person @mentions a bot, a wire runs to the crew row, and two bots reply with a PR and a green check. It runs itself and steps through #bugfix → #security → #launch (about 8 s each). The pause button toggles Pause/Play, and clicking a tab swaps the case with no change in hero height (707px before and after).
- A pinned stage at 1442px where one panel changes through five scenes ("A teammate with its own computer", "One bot per job", "Bots that hand work to each other", "Teach a routine once", "It remembers"), with a 01–05 index. This is the Apple move, and it is really there.
- Every control answers. Primary: #0a0a0a → #2c2c2e on hover, scale 0.98 on press, no fade. The workflow tile's "+" rotates on hover and opens a right-hand sheet that closes with Esc. Categories filter the list. The slider changes the plan and redraws the face count. Copy changes to "Copied".
- Monochrome only, with no hue in the UI. h1 52px, h2s 26px, a 64px-scale "200" figure, and the dark "Meet your first bot" band to close. Scale rhythm holds in the top half.
- The memoji fallback (remote faces are blocked here) draws a neat line smiley in a grey tile. It reads as intended and consistent.
- No horizontal scroll at 375 or 320. JS off shows the h1 and the full demo end state.

## The 11 answers
1. Partly. On reload, the h1 cuts in and the demo types within 1 s. On a cold first load, the 0.2 s and 1 s frames match (0.15% pixel change): the h1 area is blank and the demo is empty until hydration. The server HTML also paints the finished conversation, which is then wiped back to empty and replayed (replies visible at 0.2 s, gone at 3 s). On phone, the first screen is text only; the demo starts below the fold.
2. One in, one out through the pinned scene. After it (from about 5200px on desktop, 8300px on phone), it reads as a document: a 19-pill category cloud plus a list, then install, three steps, paste prompt, pricing, a 4-up "included" row, Get Bot, Questions. The phone page is 18,227px tall.
3. No. Hero, workflows wall, pinned scene, terminal, slider and channel wordmark all hold an object. "Three steps", "Get Bot / related capabilities" and "Questions" (one heading and one button) are text only. The tools list shows 12 empty grey squares where logos fail. Unlike the faces, that fallback looks like missing images, not a design.
4. One ask, "Try Hanzo", in the header. On desktop the header copy turns to outline when the hero primary is in view, which is good. On phone both stay solid black on the first screen, so there are two solid fills. Nothing of the page's own floats over content (the cookie card is shared). Scale has rhythm on top, but the bottom half is all medium/small.
5. Yes for everything tested, with no jumps.
6. Phone overlap/clipping: in "Three steps", the 12-column grid does not collapse under 900px. `.bt-start-r` stays at `grid-column: 7 / -1` (Bot.css:311; the 899px block at Bot.css:476 changes only the `li` columns), so the steps sit in a ~110px strip with 3–4 word lines while "HOW IT STARTS" floats alone on the left. Also on phone, the 13-face crew row is packed edge to edge and the Dev/Qa tiles touch. No font swap was seen.
7. Apple product page (the pinned scene, the product as hero) with a Slack-demo feel. The Apple motion is present in the middle third only.
8. Its own hero medium (a live multi-bot channel with a crew wire), but it is close in kind to the Slack/Tag channel demos. The crew wire and the face slider are its signature.
9. Header gate present (Persona/Goal/CTA/Signature/Beyond). Fails part 5 ("reduced motion shows the final state" without errors; see 10) and part 6 (375 passes only with the steps defect).
10. No hue, gradient text, eyebrow over an h1, or fading buttons. Near-tells: the 4-up "01–04" text row under the workflows and the 4-up "Included with your plan" row are equal boxes of explaining sentences (clutter); the 19-pill cloud is overload. Console: under `reducedMotion: 'reduce'`, the page's own hydration mismatch fires every time (desk and phone): `motion.div.bt-ask` at Bot.jsx:140 renders `initial={calm ? false : {opacity:0,y:12}}` (server opacity 0/translateY(12px), client 1/none), and the `bt-band` section's clip-path differs. That counts.
11. Yes. Parity 306/306 text, 21/21 links.

Shared (not counted): an intermittent hydration badge seen once on a cold load in normal motion (it did not reproduce in 3 later loads); the cookie card covering the bottom quarter of the phone screen; failed hanzo.ai requests from the sandbox.

## Fixes (in order)
1. Fix the reduced-motion hydration error. Don't branch the first render on `useReducedMotion` in `.bt-ask` (Bot.jsx:140) or the `bt-band` clip-path: render the same initial state on server and client and apply calm after mount (or through CSS `@media (prefers-reduced-motion)`).
2. Phone "Three steps": in the `max-width: 899px` block, set `.bt-start` to one column (`.bt-start-r { grid-column: 1 / -1; grid-row: auto }`, `.bt-start-h`/`.bt-cap` full width, caption under the heading). Give the crew row breathing room at 375 (a smaller face or a scroll with fade, without touching tiles).
3. Make the bottom half a sequence, not a stack. Give install/steps/paste one object that changes (the terminal typing the two commands, with the steps lighting in turn). Let "Questions" and "Get Bot" carry something to look at, or fold them into the close. Cut the 4-up text rows back to the objects.
4. First screen: keep the h1 visible in server HTML and cut it in without hiding it until hydration. Start the demo from the server state (or render the server state empty) so the finished replies don't flash and vanish. On phone, bring the top of the demo (the @mention line) onto the first screen, and let the header ask go outline while the hero primary is visible, as desktop does.
5. Tools: make the logo fallback intended (a monogram or the tool's initial in the tile, like the faces) instead of an empty grey square. Reduce the 19-pill cloud to a scrollable rail or fewer visible chips.
