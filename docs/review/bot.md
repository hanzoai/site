# /bot — James-eye review

Verdict: 8/10
Ready: 8 Nov, held at missing 0 under the real copy check (copycheck 0 of 201): live's bugfix case now names @Sci (Science) as the verifier, and labels and the install line read as whole lines. 0 console errors (also under reduced motion), no overflow at 1470 and 375. Usable: install on your Mac with the two commands, Try Hanzo, the ten workflows and pricing.
First complaint: "As you scroll on the desktop there's half a screen of nothing between sections, so it goes dead for a moment. And on the phone it just keeps going, it's long."

Walked 2026-11-07 ~17:00 UTC, HEAD ef3bd40e, at 1470x801 and 375x812 (touch). I took first-screen captures at 0.2, 1, 3, 6 and 7.5 s with no input, and did a return-visit reload. I scrolled the whole page in 200px wheel steps (phone in 600px steps to the footer). I hovered and clicked or tapped all 62 controls in `main`, including all 10 hero channel tabs, the workflow wall and its sheet, the pinned-scene steps 01-05 and the Routines switches, 20 tool-category tabs, both copy buttons (the clipboard was read back), all three question bubbles, the FAQ sheet, the "Why Hanzo Bot" sheet and the bots slider. I also checked reduced motion and JS off. taste.py OK (3 files), parity 306/306 text, 21/21 links.

## What works
- **The hero object sells the product.** It is a self-running Slack-style demo: a person @mentions a bot, a routing line draws from the message to the crew, two bots answer with real artefacts (PR, "42/42 E2E GREEN"), then it moves to the next channel. The image changes within 1 s and is still cycling at 12 s on the phone (#bugfix → #security → #launch). It has a pause button, and the channel tabs jump to a case.
- **The h1 cuts in.** At 0.2 s the demo is up and the h1 is still arriving; by 1 s it is in place.
- **The desktop has a real pinned stage.** A 5-step scene ("A teammate with its own computer" → "One bot per job" → … → "It remembers what it learns") keeps one panel on the left that changes with each step, and has an 01-05 step rail. The Routines switches toggle (aria-checked true→false) when their step is on screen.
- **Every tap answers.**
  - Question bubbles fill to ink, the bot shows "…" and then answers in a chat bubble ("Yes, MIT licensed…").
  - Copy buttons change to "Copied". The clipboard matched exactly: `npm install -g @hanzo/bot\nhanzo-bot onboard --install-daemon` and the agent prompt. Press scales them to about 0.95.
  - The slider moves the plan highlight: 5 bots → Max, $95, and that row expands.
  - Sheets open from the right with a scrim and close again.
- **The sticky ask works.** The header "Try Hanzo" is quiet while the hero ask is in view and becomes solid once it leaves, so there is one solid fill at a time.
- **The blocked-image fallback looks intended.** All 12 memoji and the connector logos fail, because hanzo.ai is blocked here. The memoji fall back to a consistent drawn smiley tile, used everywhere: crew, wall, slider, band. The connectors fall back to grey monogram tiles (C, G, M…) in the same family. Nothing reads as broken.
- **Rooms and rhythm.** The rooms are paper, quiet, a graphite terminal, and one black closing Band that enters as an inset rounded card. Scale has rhythm: the 52px h1, 26px section heads, one big moment per screen ("200", the channel words, "Meet your first bot"), with small mono captions sitting below the headings.
- **Clean console and layout.**
  - The only console errors are hanzo.ai requests blocked by the sandbox. There were no page errors or hydration warnings in any run.
  - No horizontal scroll at either size (scrollWidth 1470 / 375). The only overflow is the tool-category tab rail, which is a scroller.
  - Reduced motion shows the final hero frame (routing line drawn, both replies in) and 0 running animations. JS off shows a full, legible static hero.

## The 11 answers
1. **Yes, it sells in 5 seconds.** The h1 plus the running mention demo explain the product, and something moves within 1 s on both sizes.
2. **Mostly.** On desktop the pinned scene and the chat Q&A are true one-in, one-out. The weak points:
   - Between sections there are bands of ~300px of blank (section padding top plus bottom). Several scroll stops show half an empty screen: before the pinned scene, after "It remembers…", before the install room, before Questions.
   - The phone page is 17,900px, about 22 screens, because the pinned scene stacks into 5 full text-plus-object blocks. It reads longer than it needs to.
3. **Yes, every section has a real object.**
   - Hero: the demo.
   - Wall of 10 workflow tiles with paired faces.
   - Pinned scene: sandbox, bot list, profile card, routine switches, MEMORY.md.
   - Tool list with tabs and the "200" count.
   - The channel-word wall (type-only, but it is the moment).
   - Terminal, and agent prompt.
   - Slider with the plan list, and the sandbox strip.
   - Repo card, and the chat Q&A.
   - Black Band with the face row.
4. **Yes on the ask.** "Try Hanzo" is in the header and nothing of the page's own floats over content. Scale has rhythm (see above). The shared cookie card does sit on top of the open sheets (see Shared).
5. **Yes.** Every control I hit changed state, and hover gives detail (inset ring on bubbles, + rotates on the wall button, arrow nudge on related rows). The one exception: the slider's 10 faces barely change between 1 and 5 bots.
6. **None observed.** No overlap, font swap or layout shift at either size. The h1 box does not move.
7. **Feels like** motion.dev patterns plus an apple.com pinned stage. Both are actually present: the pinned panel swap and the self-running demo.
8. **Yes, distinct from its neighbours.** No other page I know uses the routing-line mention demo as its hero, and the smiley crew is this page's own signature.
9. **Visibly covered:**
   - Strategy: one ask, `data-cta` on every primary.
   - Narrative ending: proof, Band, footer.
   - Conversion: copy equals display.
   - Disclosure: sheets and the FAQ accordion.
   - States: image fallback.
   - Reduced motion and JS off.
   - Touch targets: the bubbles have a 44px min height.

   Not verified from the browser: analytics events, sound on copy and tabs (no audio check), performance budgets.
10. **No banned tells.** No hue (taste.py OK), no eyebrow above an h1/h2, no 3 equal boxes, and buttons don't fade on hover. "USE CASE 01" and the "WHAT A BOT IS" captions are small mono labels inside objects or below headings, which is allowed.
11. **Yes, the copy is untouched.** Parity is 306/306 text and 21/21 links.

Shared (not counted): the cookie consent card (shared chrome) stacks above the page's open side sheets. In the FAQ and "See all ten workflows" sheets it covers the bottom rows until dismissed. Its z-index should sit below the sheet layer (sheet 90).

## Fixes (in order)
1. **Close the dead bands on desktop.** Where two `av-sec` sections meet, overlap the next object by the brief's 40px, or tighten the padding on the transitions around the pinned scene (`.bt-sc`), `.bt-inst-sec` and `.bt-more2`. The aim is that no scroll stop shows more than ~25% empty paper.
2. **Shorten the phone composition.**
   - Under 900px, the 5 pinned-scene steps each repeat a heading, a 3-item list and a full object. Show one object per step with the list collapsed into the object's caption, or turn the 5 steps into a swipe rail of 5 panels. Target under ~14 screens.
   - The 10-row tool list could also start at 5 rows.
3. **Make the slider faces count.** When the value moves from 1 to 5, the first N faces should visibly fill to ink (the others stay hollow) with a 60ms stagger, so the hover/drag detail tells you the number at a glance.
4. **(Polish) Remove the first-paint flash of the header ask.** At 0.2 s the header "Try Hanzo" is solid, then it flips to quiet once the hero ask is detected. Server-render it quiet on /bot so the page never shows two solid fills.
