# /tabs/: James-eye review
Verdict: 8/10
First complaint: "The window at the top is the product and it works itself, I like that. But on my phone the picture in the middle sticks at the top and the words slide underneath it, and the bit straight after the hero is just a paragraph sitting in white with nothing happening."

Walked 2026-11-07 17:18 UTC on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving. Page height 7351px desktop, 8534px phone.

## The 11 answers
1. First screen sells, moves inside 1 s
   - h1 "Keep tabs on your agents." at 52px with one solid "Open Tabs" ask; below it the Hanzo Tabs window runs itself. Frames at 300 ms and 1000 ms differ (cursor blink, panes splitting). By 9 s the demo has split into 4 panes and the layout tree on the right keeps up.
   - It is a real object you can drive: Split adds "shell 5", Close removes "build", and the Browser/Phone toggle swaps to a phone frame with "1 / 4" swipe pages and a key row. That is the page's moment.
2. One in, one out
   - Mostly yes. "Why it is shaped this way" is a pinned stage: 01/02/03 rail, one diagram swaps per chapter (browser-server-machine, tabs.hanzo.ai/build URL, the layout tree closing a pane). The 01-03 buttons jump the scroll (1400 -> 2874).
   - Weak spot: the lede after the hero sits alone in white with about 118px plus section padding (~250px visible) of nothing before the stage. One dead beat.
3. A real visual in every section
   - Yes: app window, three stage diagrams, the machine map (laptop / workstation / GPU box wired to a tabs.hanzo.ai card with a travelling packet), four bento panes each with a mini object (scrollback, pane strip, key row, MIT stamp), and a closing band with a two-pane mini window.
   - The machine map's dashed network box is open on its right edge and the tabs.hanzo.ai card overruns it at x~1275; it reads unfinished.
4. One ask, nothing floating; scale rhythm
   - Desktop header ask switches from "Try Hanzo" to solid "Open Tabs" once past the hero; hero, closing band and header say the same words. Shared issue: on phone the header always shows solid "Try Hanzo", and the header ask goes outlined over dark rooms.
   - Rhythm: one big thing per screen (52px h1, then 26px heads, 17px h3, 12-13px mono captions). Nothing grows or shrinks as you go, so there is no "start small, become the moment" beat beyond the hero.
   - Phone: the pinned stage card (about 300px tall plus a 44px pause button) stays at top while chapter text scrolls under it; at y1440-2400 the h2s and paragraphs are covered by the stage (elementFromPoint hits .xtb-vis). Readable once they clear, but it is a panel over text.
5. Hover and press
   - Hero ask: hover darkens fill, press scale 0.98. Pause: hover inverts, press 0.94. Device toggle: colour plus press 0.98. Copy: press 0.92 and a tick appears, but the label stays "Copy".
   - "Read the source" card lifts 4px on hover but has no press state. Shared issue: header ask hover is opacity only (1 -> 0.88).
6. Overlap, font swap, shift
   - CLS 0.0009 desktop. No font swap seen. Hero ask rises 14px on arrival (authored, h1 box steady).
   - Phone stage-over-text noted above. Phone tap targets: pane Close buttons 32x44.
7. Reference
   - apple.com product page: product as hero, a pinned stage where one panel changes. The motion is actually there (idle demo, swapping diagrams, packet travel). No synchronized-style card open, which this page does not need.
8. Neighbours
   - Own hero medium (a live tiling terminal you can split and close) and own signature (the layout tree). Not a template of its Business-2 siblings from what I walked.
9. 18 parts
   - Hero, narrative, proof-of-shape chapters, install (`$ hanzo link` with Copy), feature panes, closing band, footer all present; pause controls on every self-running scene; phone layout considered (stage stacks, demo has its own phone mode).
10. Banned tells
   - None found: no hue, no eyebrow over the h1, no 3 equal boxes (bento is wide+narrow / narrow+wide). The vertical mono "Why it is shaped this way" rail sits beside, not above, the h2 on desktop; on phone it does sit above the stage and its h2, borderline.
11. Copy
   - parity.py: "/tabs: OK text 26/26 links 2/2".

Console: 0 errors across 4 fresh cold loads. A red "1 Issue" badge appeared once at ~9 s in one run; it did not reproduce in 4 cold loads (11 s each), so not counted.

## Fixes (in order)
1. Phone: stop chapter text running under the sticky stage. Either un-pin on phone (three static panels, each above its own text) or give the text column its own lane below the stage so no h2 or paragraph is ever covered.
2. Close the dead beat after the hero: tighten the gap between the lede and the pinned stage, or let the hero window settle/shrink into the stage as you scroll so something carries you down.
3. Machine map: close the dashed network box (or end it cleanly) so the tabs.hanzo.ai card does not overrun its edge.
4. Small polish: a press state on the "Read the source" card; Copy should confirm in words or swap the glyph cleanly (tick and copy icon overlap mid-transition); pane Close buttons to 44x44 on phone.
5. Shared, not this page: phone header always solid "Try Hanzo"; header ask hover is opacity-only.
