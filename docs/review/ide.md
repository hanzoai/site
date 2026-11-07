# /ide — James-eye review

Verdict: 7/10
First complaint: "It's finally calm and real. But the list in the black room is dead when I point at it, and the little GitHub links are too small to tap on my phone."

Walked 7 Nov 15:10, page file at `12d3703c` (`components/pages/IdePage.jsx`, `IdePage.css`, shared `v2/A2*`), on the preview with the shared system (header ask, slim phone bar, new morph, sound). Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/ide/desktop-walk.jpg`, `review/ide/phone-walk.jpg`. Replaces the 5/10 review of `cf12a91`.

## What works
- Every complaint from the last walk is fixed:
  - the editor now starts under the buttons and stays inside the screen;
  - it shows Hanzo's real start script (open, git clone, npm run tauri:dev), with memories surfacing in its gutter from the first second, and a pause control;
  - the indigo, orange, blue and green are gone (`taste.py` passes), with no eyebrow over any headline.
- The scale has rhythm: a 52px h1 with a short lede and a calm first screen. One big statement saved for the end, a black Band: "Open the IDE. It already knows the way around."
- Motion of several kinds: the editor running itself (time), the stage settling and the pinned chapters (scroll), "Tell it something" (state), the orbiting memory tiers with a pause (idle), and the line-mask h1 (arrival).
- Press scales to .98 and hover darkens the primary; Copy confirms. CLS 0. Reduced motion leaves 0 running animations.
- Parity: text 75/75, links 10/10.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. The headline, lede, "Open the IDE" and a live editor all fit 1470×801, and the cursor is walking the code at once.
2. **One in, one out, or a document?** A scene: stage, exploded workbench, three pinned chapters, the memory demo, a dark room, then the Band. The "Open it in the browser, or build it on your machine" block is the one document moment.
3. **A real visual object in every section?** Yes: editor, the two planes, call graph, sandbox, memory cards, orbit, terminal, the Get IDE card and the app cards.
4. **One ask, sticky after the hero?** "Open the IDE" in the hero and in the Band. But the header kept a solid "Try Hanzo" at every scroll position. So at the top there are two solids, and the page's own ask never reaches the header. **(shared:** `Ask.jsx` should outline the header button while the hero ask shows, then swap it for "Open the IDE"; that didn't happen here.**)**
5. **Every hover and press answers, no jumps?** Not all. In the dark room the accordion rows ("Three tiers of memory", "Agent profiles", "Ten layers of security") and the Pause button showed no change on hover. The primary, Copy and the memory tags answer.
6. **Overlaps, font swap, layout shift?** None. Phone tap targets: "View on GitHub", "GitHub" and "Hanzo Cloud" are 21px tall. JS off: 3 of 42 text blocks stay hidden.
7. **Which reference, is its motion there?** Apple product page (stage, pinned chapters, one statement at the end): yes. synchronized.studio: the CLI, Playground and Desktop cards open by the shared morph.
8. **Different from neighbours?** Better. It no longer opens on the /desktop and /cli window. But the editor still carries their tab row (IDE · CLI · Playground · Desktop · API Keys) along its bottom edge.
9. **18 parts?** The card is in the MASTER format with 18 filled `Done here:` lines. See the card check.
10. **Banned tells?** None found. Monochrome, no label over a headline, no floating panel, no springs seen.
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/coverage/ide.md`)
- **Part 11, false:** "Every target 44px or more" is ticked, but three phone links measure 21px. This caps the verdict at 7.
- **Part 4, false at 1470:** "Sticky ask in header and bar after the hero, same label" is ticked; the header said "Try Hanzo" throughout (shared, see answer 4).
- **Part 8, partly false:** "Every control has hover…" is ticked; the dark-room rows and Pause don't answer hover.
- **Header line, partly false:** "Forks this page deleted: the tab row shared with /cli and /desktop". The row is still in the editor's status bar.
- Honest gaps, already left unticked: one solid per viewport, `PageHero`, kit tables and code, icon set, budgets, `CodeBlock`, error boundary.

## Fixes (in order)
1. **Make every phone target 44px.** Give "View on GitHub", "GitHub" and "Hanzo Cloud" a 44px hit area (padding or an `::after` inset), or set them as quiet `Cta` buttons.
2. **Let the dark-room rows answer.** A hover fill on each accordion row (the row-fill move, 150ms) and a hover state on Pause, so pointing tells you the row opens.
3. **Drop the borrowed tab row.** Take "IDE · CLI · Playground · Desktop · API Keys" out of the editor's status bar, so /ide stops wearing its neighbours' window.
4. **Report the header ask.** The header kept "Try Hanzo" solid next to the hero's solid "Open the IDE", and never swapped. Tell the shared owner (`docs/requests/ide.md`), or check that the hero `Cta thumb` is the first `[data-thumb]` in `<main>`.
