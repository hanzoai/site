# /bot — James-eye review

Verdict: 7/10
First complaint: "I tapped 'Is it open source?' and nothing happened. The bot just sits there typing forever. Either answer me or don't make it look like a button."

Walked 2026-11-07 16:49, HEAD ba89aa24, at 1470x801 and 375x812 (isMobile, hasTouch). First screen sampled at 0.2/1/3/6/7 s plus a reload. Wheel walk in 150 px notches with ~1 s dwell on desktop (27 screens) and 400 px steps on phone. Clicked or tapped the hero channel tabs, pause, "See all ten workflows" (sheet, Esc), workflow tiles, tools tabs, terminal Copy, the bots slider, "Why Hanzo Bot is built and priced this way", the FAQ bubbles and the header and hero asks. Also checked reduced motion, JS off, taste.py and parity.py.

## What works
- The hero object is the idea: a live channel where a human @-mentions a bot and a packet runs down the org-chart lines to the chosen face. A second specialist then picks it up and two reply cards stream in. It moves by 1 s, cycles use cases on its own (#security, then #launch, then #support, every ~7.5 s), has a real Pause (aria-pressed flips) and ten tabs that jump straight to a case (#ops re-routed to Opera with the packet on the line).
- The h1 cuts into its lines (line mask, in by ~1 s) and stays in its box. CLS is 0.0004.
- The pinned "What a bot is" stage swaps one panel at a time (sandbox, then one bot per job, hand-off, routines, memory) with a numbered 01–05 rail. Clicking a chapter scrolls to it. This is the page's best one-in, one-out stretch.
- Scale has rhythm: the 52 px h1, a 200 figure, a big grey/ink channel word list ("Desktop, iPhone, WhatsApp…"), a 64 px "1"/"5" bot-count figure, then quiet 13–14 px rows.
- State motion is real. The slider moves the plan highlight (5 bots → Max, $95 / month) and fills the face grid. The workflows and "Why…" sheets rise from the right and close on Esc. The tools tabs set aria-selected. The terminal types, and Copy put both commands on the clipboard.
- Faces from hanzo.ai fail in the sandbox (all 272 memoji). The fallback is a consistent hand-drawn smiley tile that reads as intended, not broken.
- Monochrome throughout. taste.py: OK. parity.py: 306/306 text, 21/21 links.
- Reduced motion: final states, no running animations after 3.5 s. JS off: h1, hero demo frame and sections are all legible.
- No console errors or page errors from this page's files.

## The 11 answers
1. Yes, mostly. "Teammates you can hand real work to" plus a channel that hands work to a bot sells in 5 s, and the crew and packet move within 1 s. At 0.2 s the left column is blank (h1 not yet in) while the lede sits mid-column. On phone, only the top of the demo is above the fold.
2. Hero, workflows and the pinned scene are one-in, one-out. From tools onward (200 tools, channel list, install, pricing, questions) it turns back into a document. Pricing especially is a long two-column stretch.
3. Yes: demo, workflow tile grid, sandbox/inbox/chat/routines/memory panels, tool list with a 200 figure, word list, terminal, slider with face grid, Get Bot card, closing face row. The 01–04 strip under the workflows and the 4-up "Dedicated Cloud Sandbox…" row are text only.
4. One solid ask. The header "Try Hanzo" goes outline while the hero's solid "Try Hanzo" is on screen, then solid again. The cookie card floats over the bottom of every screen (shared, see below). Scale rhythm is good.
5. The hero ask darkens on hover and scales to 0.98 on press. Tiles darken border and type. Tabs, sheet, slider and toggles all answer. The FAQ question pills look like dark buttons but are inert spans, and nothing answers a click. I saw no "Copied" label 200 ms after Copy, although the clipboard got the text, so this needs a check.
6. No overlap, no horizontal scroll at either size, no font swap. Big dead gaps: about 150 px of empty space between the Ultra row and its footnote in pricing, and long empty bands between sections (e.g. under the 01–04 strip). In the hero, both reply cards sit as large empty grey boxes with three dots for ~2 s per cycle, and on phone they fill the screen.
7. Apple-style pinned scene (present, scrubbed by scroll) plus the synchronized.studio sheet open. chatgpt-enterprise calm in the lower half. The references' motion is there in the top half and fades after the install section.
8. Yes. The org-chart packet hand-off is its own signature (it matches PAGES.md "bots handing work to each other"). No neighbour uses it.
9. Largely covered: hero, show-it, chapters, proof (tools, stars), objections (questions), Band, sheets, copy, slider and pause. The weak parts are the FAQ's non-interactive preview and the pricing composition.
10. No banned hue, gradient text, eyebrow over an h1/h2 or 3-equal row. Near-tell: 4-up tiles with an explaining sentence under each (the pricing features row) reads as clutter.
11. Untouched (parity 0 missing).

Shared (not counted): the cookie consent card floats over content on every screen at both sizes, and on phone it covers about a third of the screen. The header "Try Hanzo" hover only drops opacity to 0.88 (a fade-on-hover tell, in Shell). A hot-reload overlay for `components/pages/BlogIndex.jsx` appeared once mid-walk on phone (another page's edit).

## Fixes (in order)
1. Questions block (`.bt-qs` in Bot.jsx ~l.740–750): make each question bubble a real button that opens that answer (or opens the "Read all ten answers" sheet at that question), and let the bot's typing dots resolve into the first line of the answer. Otherwise drop the button styling so the bubbles stop promising a tap.
2. Pricing (`.bt-price`): close the dead gap under the Ultra row (move the "Every plan can run Hanzo Bot…" footnote up under the list). Make the section one screen with one moment (the slider driving the highlighted plan). Give the 4-up included-features row an object (e.g. the face count per tile growing as the slider moves) rather than four explaining sentences.
3. Hero reply cards: size them to their content, or show a skeleton line while typing, so the hero never shows two big empty grey boxes. On phone, let the second card stay collapsed until it has text.
4. Lower half: carry the one-in, one-out treatment past the install section (tools → channels → install → pricing → questions) and trim the empty bands between sections, so it stops reading as a document after the pinned scene.
5. Confirm the terminal Copy visibly flips to "Copied" (it copied, but no label change was seen at 200 ms).
