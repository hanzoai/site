# /help/privacy/model-training — James-eye review
7 Nov, round 2, walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s untouched, a wheel scroll one screen at a time with 1.5 s dwell, hover and press on every main control (tap on phone), overflow checked at 375 and 320, prefers-reduced-motion loaded, console read on every load.

Verdict: 7/10

First complaint: "The little settings demo is the best thing on the page, but it contradicts itself: the picture switches it off and the switch underneath still says on. And on my phone it shows a mouse pointer, the grey bars spill off the phone screen and at the small size 'Mobile' is cut off. It looks unfinished."

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes. The question is the h1 (52px) with the lede under it, and a self-running settings demo on the right: within 1 s a cursor walks to the avatar, then Settings, then Privacy, then the switch, with a 01/04 counter and progress dashes. The h1 cuts in after first paint into a reserved box, so nothing moves. At t0 the demo cursor sits half outside the window frame, on the card edge.
2. **One in, one out, or a document?** On desktop, mostly yes. The demo card pins on the right and changes with each section (03/05 shows a timeline with the switch flipped off, 04/05 shows the Privacy pane with the switch off and a highlighted row). On phone it is a document: the demo sits once under the lede, and sections 03, 04 and 05 are plain text rows with nothing changing as you scroll.
3. **Every section holds a real object?** Desktop: 01 to 04 have the pinned stage, and 02 also has its own web and mobile step cards. 05 "More" is a quiet grey band holding one sentence of links, with no object. Phone: only the hero demo and the 02 step cards. 03, 04 and 05 are text only.
4. **One ask in the header, nothing floating, scale rhythm?** The header ask ("Try Hanzo") is shared chrome. Nothing on the page floats over content (the cookie bar and dev badge are shared). Scale rhythm is right on desktop: one 52px h1, a 21px lede, a medium demo card, small mono contents. Two things are off: the "05 More" h2 is 32px on desktop while the other h2s are 26px, and on phone the demo takes about 1.3 screens straight after the lede, so the contents list is pushed below two folds.
5. **Every hover and press answers, no jumps?** Mostly. Contents rows get a #f5f5f5 fill and the label nudges right. The demo tabs and pause button press to scale 0.97, and the demo switch presses to 0.98. The "Help center" breadcrumb link shows no change at all on hover. The demo card grows about 11px whenever a step caption wraps to two lines ("Switch Help improve Hanzo's models off (or on)."), so its bottom edge jumps on every loop.
6. **Overlap, font swap, layout shift?** No font swap, and the h1 box holds. Problems:
   - At 320 the demo's segment control is wider than its card (to 338px), so "Mobile" is clipped at the card edge, and the panes run to about 406px inside the clip.
   - In both mock windows the skeleton bars run past the right edge of the frame, and one bar starts flush against the left edge.
   - On phone the breadcrumb wraps so that a lone "/" starts the second line, with a large gap after it.
   - The card-height jump from answer 5.

   The red "Issue" badge seen during the walk was a hydration diff in the root layout's FooterHTML (`data-x-shell="footer"`). It came from a screenshot taken before hydration and is shared chrome. I re-ran at both sizes with `caret: 'initial'` and the console was clean, so it is not counted.
7. **Which reference, and is its motion there?** Apple product page: a pinned stage where one panel changes per section, and it is really there on desktop. It is also calm like chatgpt.com/business/enterprise, with proof listed quietly in ruled rows. The Apple behaviour is missing on phone.
8. **Different from its neighbours?** Yes in its own right. A scripted settings walkthrough with a web and mobile toggle and a timeline scene is this page's idea, not a template hero. I did not walk the neighbouring help pages.
9. **18 parts covered?**
   - Present: breadcrumb, contents, anchors, sectioned IA, reduced motion (the demo lands on its final 04/04 state, paused with a play button), states (pause and play), no horizontal page scroll at 375 or 320.
   - Gaps: the closing section has no next step or related article, phone motion is thin, and the 320 component clips.
10. **Banned tells?**
    - No hue: the main palette is the neutral ramp only.
    - No gradient text, no Inter, no stripe, and no eyebrow above the h1. "HELP · PRIVACY" sits under the lede, which is allowed.
    - The computed h1 stack starts with "Noto Kufi Arabic" before Zen. It renders as Zen, but it is worth confirming that the Arabic face is unicode-range limited, so there is never a third face.
    - A desktop mouse cursor is drawn inside the phone-sized "Mobile" walkthrough. It is not a banned tell, but it is a wrong-device tell.
11. **Copy untouched?** It reads as Hanzo's own help copy, with no rewrites seen. I did not diff it against source.

## Fixes, in order
1. **Make the demo state consistent.** The panel's own "Help improve Hanzo's models" switch under the stage must follow the scene: when the stage shows it off (03/05, 04/05, and the end of the 04/04 loop), the switch and its caption flip to off. The 4-step loop should end with the switch actually turning off, not resting on "on".
2. **Fix the 320 clip.** Let the segment control shrink or wrap, or shorten the hit areas, so "Web and the desktop app" and "Mobile" both fit inside the card at 320. Keep the panes inside the frame.
3. **Keep the skeleton bars inside the mock frames.** Pad them on both sides in the web window and the phone screen. No bar should touch or cross the frame edge.
4. **On touch devices, replace the arrow cursor with a tap ripple or dot.** Also start the cursor inside the window, not on the card edge at t0.
5. **Stop the demo card's height jump.** Reserve two caption lines, or give the caption row a fixed min-height, so the card never resizes between steps.
6. **Give phone a scroll moment for 03 and 04.** Show a compact version of the stage (the timeline scene for 03, the Privacy pane with the switch off for 04) inline above each list, scrubbed or arriving as the section enters. Then phone is one in, one out, not a document.
7. **Shorten the phone hero demo** to roughly one screen. Shrink the mock and drop the long caption block under it, so the contents list sits within reach of the first scroll.
8. **Hold the breadcrumb together on phone.** Keep "/" attached to the following crumb (no orphaned separator), or truncate the last crumb with an ellipsis.
9. **Set the "05 More" h2 to 26px** like the other section heads. Give the closing band a small object or a next step (for example the related privacy articles as quiet rows) so it is not a dead grey strip.
10. **Give the "Help center" breadcrumb link a real hover** (for example the underline offset moves, or the ink darkens and the underline thickens), not nothing.
