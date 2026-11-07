# /team — James-eye review

Verdict: 7/10
First complaint: "It's better, but I tap Security on my phone and the whole screen goes black. On the laptop it's still one word on a black card. Nine of the ten channels are empty rooms, and the canvas plays the ending first and then rewinds."

Walked 7 Nov, about 15:02 to 15:28 UTC. Page file at `94b550d` (`components/pages/TeamPage.jsx`, `TeamPage.css`, with `company/MaskLines`, `company/useArrived` and `Sigil`); HEAD `240c612`. Filmed moving at 1470×801 (wheel scroll, a dwell on every screen, hover and press, Replay and Pause, every workflow tab, every code step, Copy) and at 375×812 with isMobile and touch (raw touch drags, taps on Replay, the workflow pills, the steps and a Together row). Both a first visit and a return visit; on /team they are the same, because the arrival curtain now runs on the home page only. Also checked: reduced motion, JS off at both sizes, 320 and 375 widths, the console, layout shift, tap targets and a Tab crawl. Stills: `review/team/desktop-walk.jpg` (12 frames, captioned) and `review/team/phone-walk.jpg` (8 frames).

## What works
- **The hero is honest now.** With JS off, the lede, both asks, the docs link and the whole canvas show; the page's own hydration mismatch (the stage transform) is gone. The h1 (84px, line height 1.02) cuts in by line mask about 0.55s after paint. Then the canvas story plays where you can see it: Zoe reports, Dev takes the card and ticks three steps, Qa moves it to Done, in about 11s. Pause/Replay works on both widths (Pause → Replay on tap), and the phone control is 43px with a 51px hit area.
- **The chapters are fixed.** The old headline slides out of its mask before the new one rises; in 18s of frames, two titles never share the frame. Each chapter's visual changes on the right while the words pin left.
- **The rooms are mostly real.** Board, Drive, Meet, Inbox and Agents now draw Hanzo's own words (Email, Release Ops, Docs & Specs, PaySheet.tsx, the @Dev and @Zoe Maxwell rows, the seven teammates), and each makes one small move on arrival.
- **The workflow room no longer jumps.** It keeps 757px on desktop across all ten tabs, so nothing below it moves. "CHANNEL" is gone, and "…in your workspace:" now leads straight into "Open Hanzo Team". The tabs follow the APG pattern with arrow keys.
- **Every desktop control answers.** The solid ask darkens and presses to .98. Quiet buttons gain a fill and a darker edge. Arrow links underline and nudge 4px. The Together faces slide 12px together. Copy copies exactly the prompt on screen and says "Copied". The code session steps by hand, and the diff lights up at step 3.
- **The rest checks out.** Reduced motion shows the finished picture with 0 running animations and no tilt. Desktop CLS is 0.0055. There is no sideways scroll at 320 or 375. Parity: text 242/242, links 20/20. `taste.py`, `variety.py` and `unique.py` all pass.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells, and the h1 moves inside a second. But the first thing the canvas does is rewind. The server paints the finished story (card in Done, full chat, three ticks); at hydration the card flies back across "Docs & Specs" (text on text for about 0.5s), the ticks clear and the chat empties (desktop frame 2, phone frame 1). On desktop, after about 14s the first screen is completely still (0 pixels change from 16s to 18s). The "breathing" cursors rest at y 856–936, below the 801 fold, so nobody sees them.
2. **One in, one out, or a document?** The first third is a scene: the canvas, then the three pinned chapters. After that it reads as a well-made document: Together (a list), Rooms (six tiles that each move once), the dark room, the code window, Leaders, Get Team, the close. Each section now has an object, but besides the headline masks the only motion is one move per room on arrival and the Sigil at the close.
3. **A real visual object in every section?** Mostly. The real ones are the canvas, the chapters' teammates and orgs, five of the rooms, the bugfix case, the code window and the Sigil. The weak spots:
   - Chapter 01's thread pane is still grey placeholder bars.
   - The Calendar tile is still abstract grey blocks over about 180px of empty white.
   - The Meet note stretches into an empty grey box.
   - Together has only two initial discs per item.
   - Nine of the ten workflow panels hold one big word. Research, Sales, Finance and Legal also lack a name and role.
4. **One ask, sticky after the hero?** On the phone, yes: the full-width "Create your team" bar arrives on the first swipe and stays. On desktop, no: after a real wheel scroll the bar never appears in 41 frames from the hero to the footer. Only the header's "Try Hanzo" stays solid. That is the site `Ask.jsx` (see the site-layer note below), but on this page James sees no "Create your team" while he scrolls.
5. **Every hover and press answers, no jumps?** Desktop does. The phone does not:
   - Tapping any workflow pill except #bugfix shows a blank black card that fills the screen. Each panel keeps the bugfix card's 1649px height and centres its one word about 800px further down (phone frame 5).
   - The Together faces only move on hover, so a tap does nothing.
   - The canvas columns snap between 1.7fr and .65fr at each stage with no transition. That causes the phone's CLS of 0.060, over the 0.05 film threshold and three times the 0.02 lab target.
6. **Overlaps, font swap, layout shift?** No font swap, and the h1 box holds. But:
   - The rewind: the card flies over "Docs & Specs".
   - At rest on the phone, Qa's label is cut off at the board's right edge, as it was last time.
   - In the Board miniature, "Release Ops" slides 8px past the Done column's edge and doesn't line up with "Docs & Specs" below it.
   - On the phone, "agents ship together." and "Driven by research." sit directly on their ledes (0px gap). It was 6–8px last time and was listed as fixed.
   - JS off: all ten workflow panels sit in one grid cell. The opaque Growth card covers the whole bugfix case, and stray D and Q discs show through it (desktop frame 12, phone frame 6).
7. **Which reference, is its motion there?** Apple's product page, for the first third: the product as hero, huge type, the tilt-and-settle and a pinned stage where one panel changes. That motion is really there. The chatgpt.com enterprise calm suits Leaders and Get Team. The osply pointer details are still thin: the faces drawing together and the Sigil leaning.
8. **Different from neighbours?** Yes in the hero: a working multiplayer canvas under the h1 belongs to this page alone, and `unique.py` passes. The middle still shares the "01 / 03" giant grey numeral with /brand, /careers and /investors.
9. **18 parts?** Mostly covered; the gaps are listed below. Seven of `docs/coverage/team.md`'s claims don't hold:
   - Part 3, "JS off legible": the workflow room stacks ten panels and hides the bugfix case.
   - Part 4, "Sticky ask in header and bar after the hero": not on a desktop wheel scroll.
   - Part 6, "No text under 13px (14px phone) except mono capitals": the Agents room's roles are 12px Zen, and the phone Board miniature cards are 12px.
   - Part 9 / Part 3, "After Done the cursors breathe": they do, but below the fold, so the visible first screen is dead.
   - Part 11, "Every target 44px or more": the code window's "Open →" is 50×21, and the close's "Open Hanzo Team" is 108×22 (it was 19px).
   - Part 11, "pass with no overlap": Qa's label is clipped, and the Release Ops miniature hangs out of its column.
   - Part 18, "every listed fix is done": the nine panels are still empty, the phone heading spacing is 0px, and the hero still rests dead.
10. **Banned tells?** No hues (`taste.py` passes), no gradient text, no fading buttons, no native tooltips, no eyebrow over an h1 or h2. What's left:
    - **A plain-box "lazy" look:** the nine one-word panels, the Calendar blocks, the empty Meet note box and the grey bars in chapter 01.
    - **Inconsistent spacing on the phone:** 0px under the Code and Leaders headlines against 20–28px everywhere else.
    - A stray literal: `<main style="--acc:#1d1d1f">` is not on the deck ramp. It barely renders, but it is not a token.
11. **Copy untouched?** Yes. Parity is clean, "CHANNEL" is gone, and "42/42", "PR #418", "(8.9:1)" and the diff text all trace to `content/live/team.json`. The live page gives the nine channels nothing beyond their names, Cyber/Mark/Su/Opera's roles and "Engineering · Security · …", so nothing can be added. The design must not open nine rooms it can't fill.

## Site layers that break this page (not this page's code; request them)
- **`components/Ask.jsx`, the ask bar, never arrives on a desktop wheel scroll.** Lenis scrolls smoothly, so the hero ask's IntersectionObserver fires its last entry while the button's top is still between 0 and 64px (logged: top 11, scrollY 266). Line 97 then sets `past = false`, and the observer never fires again. The fallback on line 87 can't recover, because `filled()` counts a solid button as seen even when it is off screen. An instant jump shows the bar, and so does a phone touch scroll. /brand fails the same way, so it is site-wide. The owner should write `docs/requests/team.md`.
- **The footer** (`FooterHTML`) logs a hydration mismatch whenever the page paints before hydration finishes, so Next's red "1 Issue" badge shows on /team in dev. The page's own mismatch is fixed.

## Missing from the 18 parts
- **Part 3 First impression:** the server HTML's finished canvas rewinds at hydration. The desktop rest is below the fold. On the phone, only 49px of the canvas sits inside 660px (the brief asks for 80px or more).
- **Part 6 Content presentation:** the workflow room is ten tabs for one case; nine tabs open an empty frame. Text under the floor: the Agents room's 12px roles and the phone's 12px miniature cards.
- **Part 7 Visual system:** headline-to-lede gap is 0px on the phone at Code and Leaders. The fix in the CSS (`.xtm-lead-h, .xtm-code-h { gap: 28px }`) sits on a flex box with one child, so it does nothing. Also the `--acc:#1d1d1f` literal.
- **Part 9 Motion:** after the chapters, motion is one arrival move per room plus the Sigil. The canvas column change is a layout snap, not a transform.
- **Part 10 Media:** the memoji and the two leader portraits are still hot-linked from hanzo.ai, not mirrored into `public/`. The fallbacks hold: initial discs, and grey plates with AW and ZK. But Harry Boone shows a "D" disc in the Inbox miniature (he borrows Dev's memoji).
- **Part 11 Mobile:**
  - Tapping a workflow pill shows a blank screen.
  - Two small targets: "Open →" and the close's "Open Hanzo Team".
  - Together has no tap path.
  - Qa's label is clipped.
  - The canvas header wraps Pause onto its own empty row.
- **Part 13 / 17:** with JS off the workflow room's panels stack in one cell (`grid-area: 1/1` survives the noscript rule).

## Fixes (in order)
1. **Stop opening nine empty rooms.**
   - Keep #bugfix as the one open case. Turn the other nine channels into rows of the same list that only swap the case header's channel name, crew face, name and role (Cyber, Mark, Su, Opera; Qa for #research). Or size each panel to its content, top-aligned, never at the bugfix card's 1649px.
   - On the phone, a tapped pill must show its content in view, not a black void.
   - With JS off, show the panels in flow, one after another, not in one grid cell, so the bugfix case is readable.
   - Faces with no named teammate in Hanzo's copy (sal, fin, law) should not pretend to be a person.
2. **Start the canvas from its first frame, and keep its rest on screen.**
   - Behind an `html.js` rule, server-render the story's opening frame: the card in Backlog, the three messages hidden, the steps hollow. Keep the finished picture only for `html:not(.js)`. The first move you see is then Zoe walking, not a rewind.
   - At 1470×801, rest the cursors inside the first screen (above about y 760), or let the Done card breathe, so the still screen after 14s is gone.
3. **Phone pass.**
   - Put a real 28px between headline and lede at Code and Leaders (a margin on the lede or a grid row gap, not the header's flex gap).
   - Keep Qa's label inside the board at rest.
   - Change the columns without a layout snap: fixed widths with the card moving by transform, or a transform-only resize. This gets the phone CLS under 0.02.
   - Give "Open →" in the code window and the close's "Open Hanzo Team" a 44px height.
   - Give Together a tap path, the same faces-together move on press.
   - Bring 80px of the canvas inside 660px.
4. **Finish the rooms.**
   - Calendar: label the blocks with words already on the page, or crop the tile to the grid so there is no 180px blank.
   - Meet: size the note to its content.
   - Chapter 01: replace the grey bars with the real thread the page already has (Zoe's report, Dev's reply).
   - Board miniature: move "Release Ops" by exactly one column so it lines up with "Docs & Specs".
5. **Request the Ask bar fix** in `docs/requests/team.md` (above). Until it lands, /team has no sticky "Create your team" on desktop.
6. **Clean-up:**
   - Drop `--acc:#1d1d1f` from `<main>`.
   - Raise the Agents room roles and the phone miniature cards to 13px.
   - Give Harry Boone his own initial.
   - Mirror the memoji and portraits into `public/`.
   - Correct `docs/coverage/team.md` on the seven claims in answer 9.
