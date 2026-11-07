# /download — James-eye review
Ready: 2026-11-08 the dial stays alive at rest (the centre reads through the builds by itself, ray and chip lit in turn, resting under the pointer, off screen and under reduced motion); phone rails fade at the edge and peek once so they read as swipeable; the Desktop and Editors pictures grow with their cards; each build list arrives with your system's rows first (dot pops); hydration-safe local line mask (the shared one mismatched under reduced motion). taste OK, parity 48/48 + 19/19, unique OK, check.mjs 0 errors / 0 overlaps / no h-scroll at 1470 and 375, CLS ≤0.003, reduced motion 0 errors.
7 Nov, round 1 of this critic. Walked it moving at 1470x801 and 375x812 (phone: isMobile, hasTouch) with Playwright on :4182. At each size I took frames at 0, 1 and 3 s with no input, then compared frames at 4 s and 8 s. I scrolled one screen at a time with a 1.5 s dwell (a wheel pass, plus a pass stepping exactly one viewport). On desktop I hovered an orbit build and hovered and pressed the main ask. I measured CLS, horizontal overflow and console output.

Verdict: 6/10

First complaint: "The dial is clever: the files fan out and when I point at one a line runs to it. But once it's out, nothing moves. It's just sitting there. And on my phone the dial's gone: it's rows of little chips falling off the side of the screen."

## The 11 answers
1. **Does it sell in 5 s and move within 1 s? It sells; it moves only for its arrival.** "Download Hanzo", the lede and "Download for macOS" (with its own file name and 600 MB) read at once. The builds fan out of the button onto a four-quadrant orbit: Desktop, Hanzo CLI, Browser extension, Editors. That is the delight. Then the first screen is still: a frame diff from 4 s to 8 s is 0 pixels. JAMES.md rejects "a dead page: nothing moves without input". Here the only ambient motion is below the fold (the CLI caret).
2. **Does one thing come in as one goes out? Partly.** "Every build" is four product cards with small UIs: the desktop window with a prompt, the CLI terminal, the extension, and the editor tabs. Next come the build lists, then "Just your files" in the black room, then the closing statement. The page is short (5,265px at 1470), so it never overloads. But the build lists are a table the visitor reads, with nothing coming in.
3. **Does every section hold a real visual object? Yes.** The dial, the product UIs and the file list each count. The Desktop card's window is small inside a large empty grey card.
4. **One ask, nothing floating, and does scale have rhythm? Yes, on desktop.** "Download for macOS" is the hero's solid, and the header takes over the label after the hero. Nothing sits fixed over content. On phone the header stays "Try Hanzo" beside a full-width solid "Download for macOS", which makes two solids (shared, not held). Scale: 52px h1, 26px heads and the 44px closing statement give real rhythm, and the closing line is a proper ending.
5. **Does every hover and press answer? Yes.** Pointing at an orbit build draws a ray from the button to it. The centre then reads that build ("Hanzo CLI · Windows · v8.5.910 · 8 MB", hanzo-windows-amd64.tar.gz): a hover that tells you something. The main ask darkens and presses to scale .98. The system, browser and editor pickers glide on a layoutId fill, and Copy confirms.
6. **Do overlaps, a font swap or layout shift appear? None on desktop; the phone hero is weak.** CLS is 0.0007 at 1470 and 0 at 375, with no font swap and no page-level horizontal overflow. On phone the dial becomes one swipe rail per product. The rails' chips are cut at the right edge ("Linux", "Edg") with no other cue that they scroll, and each chip is a small icon plus a label in a pill. The page's signature is absent on phone.
7. **Which reference does it feel like? Apple's download / "which Mac" calm.** It is precise and quiet, with one delight. The fan-out is a good authored move, but it plays once, and nothing pointer- or time-driven carries on.
8. **Is it different from its neighbours? Yes.** Its signature is the orbit dial around one button, and no other page has it.
9. **Are all 18 parts covered? Yes.** `docs/coverage/download.md` has 18/18 parts, and its claims match what I saw: CLS 0 at 375, rails below 1200px, one h1.
10. **Any banned tells? None.** It is greys only and `taste.py` passes. No eyebrow sits above the h1, there is no glow, and the orbit chips' icons are the page's own small glyphs, not a Lucide wall.
11. **Is the copy untouched? Yes.** Parity is OK: text 48/48, links 19/19. Every size and file name traces to Hanzo's own pages.

Tools: `taste.py components/pages/DownloadPage.jsx` OK (CSS OK). `parity.py /download` OK, text 48/48, links 19/19. `unique.py` OK: all signatures unique, and its one failure is Contact.jsx, not this page.

Not counted: a hydration mismatch error and the "1 Issue" badge appear under parallel loads only (_shared.md §3).

## Fixes, in order
1. **Keep the dial alive at rest.** After the fan-out, let the centre read through the builds by itself every few seconds (the ray sweeping to each in turn, as the hover does) until the visitor points. Pause it on hover and under reduced motion. That one change makes the first screen idle-alive and shows what the hover does before anyone finds it.
2. **Phone: bring the signature back.** Give phones a compact dial: the button in the centre with the four product quadrants as a small orbit of counts ("Desktop 4", "CLI 5"…). Tapping one opens that rail. Or keep the rails but show a fade and a peek of the next chip, so they read as swipeable, not cut off.
3. **"Every build": fill the Desktop card.** Its window sits small inside a big empty grey card. Size it like the CLI terminal, so the four cards have one rhythm.
4. **Something arrives in the build lists.** Let the sizes count up, or the row for the visitor's own system light first, as the lists come into view, so it is not a static table.
