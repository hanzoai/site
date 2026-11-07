# /slack — James-eye review

Verdict: 7/10
First complaint: "The Slack window is brilliant, then it goes flat. After the dark bit it's lists again: six feature names in two columns with nothing to look at, then four little icons in boxes with a sentence under each, with big white gaps in between. The back half is a document."

I walked the page with Playwright (Chromium) on the dev server, moving, with video recorded.
- **Desktop, 1470x801:** I wheel-scrolled top to bottom in 100px notches with a 170ms dwell (117 notches, a frame every 4th notch). I took frames at 150ms, 950ms, 3s and 4s with no input, and diffed two idle frames 600ms apart.
- **Controls:** I hovered and pressed each of these (mouse down, read computed styles, release off the target): hero solid, hero outline, docs link, a rail step, the View artifact tab, an avatar (tooltip), the canvas card, a promise row, Paste's Copy, a rooms tab, "How each one works", a platform item, a runtime pill, an FAQ question, the close solid and Deploy to Cloud.
- **Opened things:** I clicked rail step 4 (it jumps and selects), switched to View, opened the sheet and closed it with Esc, and opened an FAQ.
- **Phone, 375x812 (isMobile, hasTouch, DPR 2):** I scrolled in 100px steps (151 steps, a frame every 6th). I scanned main for overflow and for targets under 44px, and checked 320 for horizontal scroll.
- **Reduced motion:** I reloaded with reduced motion and read `getAnimations()` after 3.2s.
- **Console:** 4 fresh loads (2 desktop, 2 phone) gave 0 errors and 0 warnings. The dev "1 Issue" badge came and went between runs while other pages were being edited, and was absent on a clean load, so I did not count it.

Working files: /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic3/slack/

## What works
- **The first screen sells.** The h1 is 52px, three lines, with its baseline near 43% of the screen. The lede, one solid ask, a quiet outline and the docs link sit on the right. The dark room, the step rail and the window top peek in from y=459. The h1 cuts in by line mask: absent at 150ms, set by 950ms. The kicker is screen-reader only, so nothing sits above the h1.
- **It moves with no input.** The "Working" dot and the typing dots run, and two idle frames 600ms apart differ.
- **The signature is right now.** The window pins and settles from 0.9 to full scale. Each stretch of scroll plays the next step, and the Code / View / Canvas pane follows with a gliding pill. The thread now scrolls inside the window, so step 4's canvas card, step 5's QA message and step 6's "PR #418 merged · E2E green" and Archive Channel all land in view. The status flips to "Session ready" and the sidebar badge to "PR ready". The previous review's number 1 failure is fixed.
- **The phone scene is excellent.** It is a compact pinned window under a snap rail that slides the current step in. Main has no overflow at 375 or 320 and no target under 44px.
- **Hover and press answer, with no layout jump.**
  - Solids go from #0a0a0a to #2c2c2e and press to .97.
  - The outline and sheet buttons fill #f2f2f2 and press to .97.
  - Rail steps and tabs brighten and press to .98.
  - Avatars lift 3px and show a name and role tip.
  - The canvas card lifts 2px and its border brightens.
  - Text links nudge 1px on press.
  - Rooms tabs ink their label and rule.
  - Platform items press to .98.
- **The copy fixes landed.** The setup card is labelled by its own name. Hanzo's sentence heads the close only. "Questions" is screen-reader only.
- **The setup demo plays once** from a visible ask and ends at rest. It fits in a 604px section.
- **Scale rhythm in Notes is fixed.** Unlit promises are 17px grey, and only the lit one steps up to 21px ink beside the crop, which lights the matching part.
- **Reduced motion:** after 3.2s there are 0 running animations, and the setup card shows its finished state.
- **The sheet** rises from the right, is opaque and closes with Esc.

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **The platform row is four equal tiles, each a little icon in a rounded box with an explaining sentence under it.** MASTER part 7 says "never an icon in a rounded box", and JAMES bans "an explaining sentence under every tile". The rail and drops above the tiles are nice, but the eye lands on four identical icon boxes. Fix in `Slack.jsx` `Platform()` and `Slack.css`:
   - Drop the `.xsq-mark` boxes. Make the rail the object: the drop for the pointed product grows into a small ink node carrying the product's name.
   - Show only the active item's description (`d`) under the rail, swapping like the rooms tile. The other three become 17px titles on the line, with no sentence.
   - That turns four equal boxes into one thing in focus.
2. **"From @Hanzo mention to merged pull request" has no object.** It is six feature names in a two-column text list plus a sheet button, which fails "every section holds a real visual object". Fix in `Slack.jsx` `What()` (the `.xsq-built` block):
   - Render the six names as a list of Slack-style rows with the timestamp and mono chip treatment already used in the window (`Msg`/chips).
   - Or draw them as checkpoints along the same thread line, the lit one ink and the rest grey.
   - Keep the sheet for the descriptions. Words unchanged.
3. **Dead white bands still break the walk.** Each section ends with about 103px of padding plus the next one's 72px top, so about 175px of nothing sits between Built and Platform, Platform and Questions, and Questions and the close. At 375 there is about 150px of blank between the last FAQ and the close. Fix in `Slack.css`:
   - Set `padding-bottom` on `.xsq-what, .xsq-plat, .xsq-faq` to 44px.
   - Pull the next object up so neighbours overlap by about 40px, as part 3 asks (for example `.xsq-plat { margin-top: -40px }` with the rail as the bridge).
4. **The scene drags per notch.** It is 5,126px tall for 6 steps, which is about 8 wheel notches per step at 1470x801 with nothing changing between them. James will feel he is scrolling through a still. Fix in `Slack.css`/`Slack.jsx` `Scene()`:
   - Cut `.xsq-scene` height to about 360svh.
   - Or, between steps, scrub something continuous: the current rail bar fill, already drawn, plus the new message's line-mask arrival tied to progress inside the step.
5. **A few presses do not answer.** The runtime pills, the canvas card and the avatars have hover but no pressed transform. Fix in `Slack.css`: add `:active { transform: scale(.97) }` (90ms, `cubic-bezier(0,0,.2,1)`) to `.xsq-rt`, `.xsq-canvas-card` and `.xsq-who-i`. For the hover-lifted ones, use `translateY(-1px) scale(.98)`.
6. **The Built section runs together on phone.** The six bold titles stack as 16px lines with nothing else, a plain list between two strong objects. Fix 2 covers it. Show phone-specific rows at 56px with the chip.

Shared (noted, not counted):
- On phone the header ask stays "Try Hanzo" and never swaps to "Set up Hanzo Tag"; desktop does swap.
- At 375x812 the cookie card covers the lower third over the scene until it is dismissed.
- The dev "1 Issue" badge appeared intermittently while other pages compiled.
