# /slack — James-eye review

Verdict: 7/10
First complaint: "I scroll the whole Slack window and the bar says 'Session complete', but I never see it finish. The last messages, the QA check and the merged PR, just run off the bottom of the window. The best bit is cut off."

I walked the page with Playwright (Chromium) on the dev server, moving, with video recorded.
- **Desktop, 1470x801:** I wheel-scrolled top to bottom in 100px notches with a 160ms dwell (132 notches, a frame every 4th notch). I diffed frames at 150ms, 950ms, 3s and 4s with no input.
- **Controls:** I hovered and pressed (mouse down, read styles, release off the target) the hero solid, the hero outline, the docs link, the "How each one works" trigger, a rooms tab, a platform item, the close solid, a close text link and a runtime pill. I clicked rail step 4 and the View tab. I opened the sheet and closed it with Esc, and opened an FAQ.
- **Scene probe:** I scrolled to the middle of each of the six steps with the cookie bar rejected, then measured the message list against the window.
- **Phone, 375x812 (isMobile, hasTouch, DPR 2):** I scrolled in 100px steps (144 steps, a frame every 5th). I scanned for overflow and for targets under 44px, and checked horizontal scroll at 320.
- **Reduced motion:** I reloaded with reduced motion and checked `getAnimations()` after 3s, plus the settled scene and setup card.
- **Console:** I checked it on 6 fresh loads (3 desktop, plus 3 mixed). The page's own console is clean, with 0 errors and 0 warnings and no issue badge. One load showed a compile error from `components/pages/Skills.jsx` (another page being edited) and a red badge in the long recording; I ignored both as instructed.
- **Parity:** `parity.py /slack`: text 196/196, links 10/10.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic2/slack/

## What works
- **The hero now sells.** The h1 is 52px and its baseline sits at about 43% of the screen. The lede, one solid ask and a quiet secondary are on the right. The black room and the step rail peek at y=458, so the product is on the first screen. The h1 cuts in by line mask (absent at 150ms, set by 950ms).
- **Something moves untouched.** The "Working" dot and typing dots run; frames at 3s and 4s differ with no input.
- **The signature is an apple.com-style pinned scene.** The window settles from 0.9 to full scale, each stretch of scroll plays the next message, the rail bars fill, and the Code / View / Canvas artifact follows the step. The tab pill glides (layoutId). Clicking rail step 4 jumps there and selects it.
- **Phone scene is very good.** It is a compact pinned window under a snap rail that slides the current step into view. The thread scrolls to the newest message at every step, and the canvas shows under it. Nothing overflows at 375 or 320. In main, no target is under 44px.
- **The fixes since the last review landed:**
  - no hydration error;
  - "Get Hanzo Tag" is one clean 26px line;
  - the close has one solid ask with the two Explore links as text links;
  - the three rooms are one tile with three states (hover or tap swaps the picture);
  - the promises light parts of a window crop as you read;
  - the platform is a runtime map where the product you point at is drawn in ink;
  - the sheet trigger and outline button now fill on hover and press to .97.
- **Every tested control answers** with more than opacity, with no layout jump. The solid fills #0a0a0a to #2c2c2e and presses to scale .97. The rooms tabs ink their label and rule. Text links nudge 1px on press. The runtime pills fill.
- **The "Beyond" contrast slider** sweeps by itself until you drag it, and it is a real, honest object.
- **No hue renders.** A computed-style scan of main found 0 chromatic colours.
- **Reduced motion:** after 3s there are 0 running animations, and the setup card shows all three steps ticked with the full exchange.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **On desktop the scene's last three steps play out of sight.** The probe measured this at each step's midpoint:

   | Step | Message list bottom | Window bottom |
   |---|---|---|
   | 4. Canvas summary | 854 | 767 |
   | 5. E2E verify | 937 | 767 |
   | 6. Session complete | 965 | 767 |

   The list's `scrollHeight` equals its `clientHeight`, so the scroll-to-bottom does nothing. The canvas card, the QA "Verified e2e" message, "PR #418 merged · E2E green" and the Archive Channel button are clipped below the window. The rail says "Session complete" while the thread still shows step 3's message. This is the page's signature, and its payoff is invisible at 1470x801. (Phone is correct.)

   The cause: `.xsq-win-body` is a grid with a fixed height but an auto row, and `.xsq-thread` keeps `min-height: auto`, so the thread grows past the body and `.xsq-win { overflow: hidden }` clips it.

   Fix in `Slack.css`:
   - add `grid-template-rows: minmax(0, 1fr);` to `.xsq-win-body` (line 46);
   - add `min-height: 0;` to `.xsq-thread` (line 61);
   - add `.xsq-msgs > * { flex: none; }` so messages don't squash.

   The existing `scrollTo` in `Window()` then brings each new step into view. Re-check at 1470x801 that "Session complete" and Archive Channel are visible at step 6.
2. **Copy is not untouched: two headings are invented.**
   - "Connect @Hanzo / in three steps" (setup h2) is a cut-down of Hanzo's sentence "Connect @Hanzo to your Slack workspace in three steps." That full sentence then appears twice, as the setup lede and again as the close h2.
   - "Questions" (the FAQ h2) is in neither `content/live/slack.json` nor `content/ui-strings.json`.

   Fix in `Slack.jsx`:
   - In `Setup()`, use `CLOSE.lede` once as the h2 (drop the invented two-line title and the duplicate lede), or give the setup card no heading of its own and let the close carry the sentence.
   - In `Questions()`, use the FAQ's own label from `slackData.js`/live if Hanzo has one. If it does not, use a visually hidden h2 and list the question on the card.
3. **The setup demo loops forever and opens on an empty black box.** `Setup()` cycles `k` from 0 to 9 every 1.3s indefinitely. For about 4s of each 13s cycle the 286px dark mini-channel is blank (the frame at notch 76 shows a large empty black panel). MASTER says demos run once for 6 to 10s and then settle, and that a loop over 5s needs a pause control.

   Fix in `Slack.jsx` `Setup()`: stop at `k === 9` instead of wrapping to 0 (`setK(v => Math.min(9, v + 1))` and clear the timer at 9). Start with the ASK message already in, so the box is never empty: begin at `k = 3`, or show the steps ticking over the visible ASK.
4. **Dead white gaps between sections at 1470.** Each section is padded 161px top and bottom, so you scroll through about 320px of nothing between Notes and Setup, between Paste and the rooms, and before Questions and the close. It reads as a document between moments. Fix in `Slack.css`: collapse adjoining padding (for example `.xsq-notes + .xsq-setup, .xsq-what, .xsq-faq, .xsq-close { padding-top: 72px }`), so one section's object overlaps the next by about 40px, as part 3 asks.
5. **Scale rhythm in Notes is flat.** The four promises are 19 to 23px, as big as the 26px section heading beside them, and they stack about 640px tall. Everything reads at one size. Fix in `Slack.css` line 223: drop `.xsq-points li p` to 16 to 17px with `--muted` for unlit rows, and let only the lit row step up to 21px. Then the crop and the lit promise are the one thing to look at.
6. **The setup card at 1470x801 is taller than the screen** (top edge at y≈78, bottom at the fold), so you never see the steps and the exchange together. Fix in `Slack.css`: reduce `.xsq-mini` to about 220px and tighten `.xsq-card` padding, so the card fits in about 640px.
7. **Platform items have no press state.** Hover inks the mark (good), but the `li` gets no pressed transform, and it is clickable with no button role or focus path. Fix in `Slack.jsx` `Platform()`: make each item a `<button type="button">` (or give the `li` `tabIndex={0}` and `onFocus={() => setI(k)}`). In `Slack.css`, add `:active { transform: scale(.98) }` with a 90ms ease.

Shared (noted, not counted; request in `docs/requests/slack.md`):
- On phone the header ask stays "Try Hanzo" and never takes "Set up Hanzo Tag", although desktop does swap.
- At 375x812 the cookie card covers about 30% of the screen over the scene and setup.
