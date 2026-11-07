# /team — James-eye review

Verdict: 6/10
First complaint: "The top is lovely, the little cursors actually doing the work. Then it goes dead. 'Everything the team works in' is six boxes of grey bars that look like the page hasn't loaded, and when I click Security I get one word on a black card."

Walked 7 Nov, about 14:14 to 14:37 UTC. Page file at `215d6ed` (`components/pages/TeamPage.jsx`, `TeamPage.css`, with `company/PinScenes`, `company/MaskLines` and `Sigil`). HEAD moved from `521755e` to `a9f7245` during the walk, and the arrival was filmed again after `9e22aba` changed MaskLines. Filmed moving at 1470×801 and 375×812: wheel scroll and real touch swipes with a dwell on every screen, hover and press on desktop, and taps on the phone (Replay, every workflow tab, the team line, the six steps, Copy). Also checked reduced motion, JS off at both sizes, 320 and 375 widths, the console, layout shift and tap targets. Stills: `review/team/desktop-walk.jpg` (12 frames, captioned) and `review/team/phone-walk.jpg` (8 frames).

## What works
- **The hero is a real Display moment on a real object.** The h1 is 123px with line height 0.92. The lede, "Create your team" and the outline button sit above the fold at both sizes (the button's bottom edge is at 372 of 801 on desktop and 465 of 812 on the phone). Below it, the hero object is the product itself: named cursors work one card from Backlog to Doing to Done while the thread fills in beside them. The story runs about 10.5s, Replay is disabled while it plays, and the window tilts from 18° to flat as you scroll. No font swap: the fonts load under the curtain and the h1 box holds still.
- **The three chapters are a scene.** Each one pins: the words change, the visual wipes up over the last one, and the rail scrubs. That is "one thing in, one thing out".
- **There are two more real product objects.** The bugfix case shows a thread, four checked steps and the tool chips. The code window shows a branch, the conversation and a diff, which is told by weight and strike-through, not colour, and steps through six states by hand.
- **There is one ask, and it is sticky.** "Hanzo Team · Create your team" arrives after the hero at both widths, turns dark in the dark room and steps aside at the close. The UI uses 0 hues: agents are told apart by ◆ and an outline. There are no native tooltips or browser-default controls.
- **Every control answers.** Buttons lift 1.02 with a darker fill and press to .98. Arrow links underline, nudge their arrow and press down 1px. The handoff faces slide together on hover. Tabs follow the APG pattern with arrow keys. Copy draws a tick and copies exactly the prompt on screen.
- **The rest checks out.** The close's Sigil drifts by itself and leans toward the pointer. Reduced motion shows the final picture with 0 running animations. CLS is 0.0015 on desktop and 0.006 on the phone (both from the card that moves). There is no sideways scroll at 320 or 375. Parity: text 242/242, links 20/20.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. The h1 cuts in as the curtain lifts (since `9e22aba`), and the canvas is already working. But the right column's fade, the canvas rising and Zoe's first walk to the card all play behind the curtain, so they are never seen. After about 13s the first screen is completely still (0 pixels change between 14s and 15s).
2. **One in, one out, or a document?** The first third is a scene: the canvas settles, then the three chapters. After that it is a document of about 9 screens that scroll past with nothing coming or going: the six-item Together list, the six Rooms tiles, the leaders, then Get Team. Their only motion is each headline masking in.
3. **A real visual object in every section?** No. The hero, the chapters, the bugfix case and the code window are real. "Everything the team works in" is six tiles of grey rounded bars and squares (Board, Drive, Calendar, Meet, Inbox), a wireframe placeholder that reads as a page still loading. Together has only two initial discs per item. Nine of the ten workflow panels hold one word and one face.
4. **One ask, sticky after the hero?** Yes, at both widths. One gap: the bar waits for the whole hero section, canvas included, to leave, so from about y=900 to y=1500 on desktop no "Create your team" is on screen. At the hero and the close, the header's "Try Hanzo" is solid next to "Create your team" (a site-wide header rule, not this page's code).
5. **Every hover and press answers, no jumps?** Desktop mostly does. But switching from #bugfix to any other channel shrinks the dark room by 137px, so everything below it jumps. The social icons only go from #333 to ink on hover, which is barely visible. On the phone the handoff pairs never move (their animation is hover-only), and Replay can't be tapped for the 10s the story is playing.
6. **Overlaps, font swap, layout shift?** No font swap, and CLS is near 0. But there are three overlaps:
   - At each chapter change the old headline is still fading while the new one rises, so for about 200ms two headlines sit on top of each other (frame 3 of the desktop strip).
   - At rest, Zoe's cursor sits on the "DOING" column label.
   - On the phone the board's columns are about 95px wide. The task card runs one word per line, Dev's cursor covers "Apple Pay", and Qa's label is cut off at the right edge.

   JS off: 33 text blocks at opacity 0 on desktop (32 on the phone). These are the hero lede, "Create your team", "Open Hanzo Team", "Teams in the docs" and the whole canvas. Only the h1 shows.
7. **Which reference, is its motion there?** Apple's product page: the product as hero, huge type, a pinned stage where one panel changes, and the tilt-and-settle. That motion really is here, but only for the first third. The chatgpt.com enterprise calm suits Leaders and Get Team. The osply pointer details are thin: the faces sliding together and the Sigil leaning.
8. **Different from neighbours?** Partly. The hero medium, a working multiplayer canvas under the h1, belongs to this page alone. The middle uses the same machinery as /brand, /careers and /investors: the "01 / 03" rail, the giant grey numeral and the masked headlines. The leaders block repeats /press.
9. **18 areas (PLAN-COMPONENTS)?** Mostly covered; the gaps are listed below. Six of `docs/coverage/team.md`'s claims are wrong:
   - The canvas does not start "within half a second" on screen: it starts behind the curtain.
   - At 375 the board is still three columns, not one.
   - Not every button is 44px: Replay measures 41×36 under the tilt.
   - JS off does not show everything: only the headlines appear.
   - There is a console error: a hydration mismatch.
   - There is a label over a headline: "CHANNEL" sits over every workflow title.
10. **Banned tells?** Yes:
    - **An eyebrow over a heading.** Each of the nine non-bugfix panels prints a mono "CHANNEL #launch" over its title.
    - **A plain-box "lazy" look.** The Rooms tiles.
    - **Inconsistent spacing on the phone.** "research." and "agents ship together." sit 6–8px above their lede, where every other headline gets 28px or more.

    Other mono caps labels remain, though they are Hanzo's own words inside product UI: "10 KILLER WORKFLOWS", "TEAMMATES", "PASTE AND SHIP", and "ACTIVE CREW … USE CASE 01" over the bugfix title. There are no hues, no gradient text, no fading buttons and no native tooltips.
11. **Copy untouched?** Almost. Parity is clean, and "42/42", "PR #418" and "(8.9:1)" all trace to the live page. One visible word is new: "CHANNEL", which does not appear in `content/live/team.json`. Everything else added is an aria-label.

## Missing from the 18 areas
- **2.3 First impression:** the hero's entrance and the start of the story play behind the curtain. Server-rendered text fails with JS off: the lede, the ask and the canvas are `opacity:0` in the HTML (P1). "One new idea per 100svh" holds only through the chapters.
- **2.6 Content presentation:** two controls for the same ten things, since the team line (now ten buttons) sits directly above the channel tab list. Nine tabs open onto a near-empty card. "Run #bugfix with Dev & Qa in your workspace:" ends on a colon that leads nowhere.
- **2.7 Visual system:** headline-to-lede spacing is 6–8px on the phone at Leaders and Code channels. The code window's three dots squash into thin pills on the phone. Chapter 01's numeral is hidden behind the cards, so it shows as a sliver, and on the phone the "02" and "03" numerals peek out behind the lists like smudges.
- **2.9 Motion:** Rooms, Together, Leaders and Get Team have nothing beyond the headline mask. The hero rests dead after 13s. The chapter change cross-fades two headlines.
- **2.10 Media:** the memoji are hot-linked from hanzo.ai (plan: mirror them). The fallback disc takes the file name, not the person: Zoe shows "V" and Qa shows "S".
- **2.11 Mobile:** 15 arrow links are 21px tall and the close's "Open Hanzo Team" is 19px. Replay is 41×36. The three-column board is too narrow at 375.
- **2.13 / 2.17:** the hero stage's server style (`translateY(80px)`) doesn't match the client's (`… scale(0.9) rotateX(18deg)`). React logs a hydration mismatch, and Next shows "1 Issue". The room changes height when you switch tabs.

## Fixes (in order)
1. **Make the hero honest without JS, and visible with it.**
   - Render the right column and the stage in their final state in the server HTML: no `initial` opacity 0, or an `html:not(.js)` rule like MaskLines has.
   - Give the stage the same transform on server and client so the hydration error goes away.
   - Gate the column's fade, the canvas rising and the canvas story on `useArrived`, so Zoe's first move happens where people can see it.
2. **Replace the grey bars in Rooms with real miniatures, using only words already on the page.**
   - Board: a small copy of the hero board with "Email", "Release Ops" and "Docs & Specs".
   - Inbox: the @Dev mention and the "@Zoe Maxwell" rows.
   - Agents: the seven teammates with their roles.
   - Give each tile one small idle move (a card sliding to Done, a calendar block filling), or pin the six so one comes in as the last goes out.
3. **Give the workflow room one control and full panels.**
   - Keep the channel tab list as the control and let the team line read as text again.
   - Delete "CHANNEL".
   - Give the nine other channels the bugfix card's frame: the #channel header, the mate's face, name and role, at the bugfix card's height, so the room never changes size.
   - Put the "Open Hanzo Team" link right after "in your workspace:" so the colon points at something.
4. **Keep the hero alive at rest and fix the chapter change.**
   - After Done, one quiet idle: the cursors drift a few pixels and the Done card breathes, staying within one continuous mover.
   - Rest Zoe's cursor off the "DOING" label.
   - In the chapters, let the old headline leave before the new one rises (a mask slide), so two titles never overlap.
5. **Phone pass.**
   - The board: make the active column wide enough for the card to read in lines, not single words, and keep the cursors inside it and off the text.
   - Spacing: 28px between headline and lede at Leaders and Code channels.
   - The window dots: `flex:none`.
   - Hit areas: 44px for the arrow links, and move Replay out of the tilted stage or give it a 44px hit area.
   - Fallback discs: use the person's initial (Z, D, Q).
   - Numerals: hide the giant ones behind the lists on the phone, and on desktop let "01" show like "02" and "03".
6. **Correct `docs/coverage/team.md`** on the six claims in answer 9.
