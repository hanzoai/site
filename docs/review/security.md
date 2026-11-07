# /security — James-eye review

Verdict: 5/10
First complaint: "On the phone there's a whole Enterprise list sitting on top of the security layers, text over text. And when I press 'What comes with Enterprise' it throws me back to the top and the list is printed over the hero. That's broken, not premium."

Walked 7 Nov 2026 (main at `f244a55c`), Playwright Chromium, moving: 1470×801 and 375×812 (isMobile, hasTouch), 12 frames over the first ~5.5 s with no input, then half-screen wheel steps (desktop) or scroll steps (phone) with a 700 ms dwell each, plus video. Hovered and pressed the hero layer labels, tabs, worksheet ticks, rack rows, options, band ask; clicked a hero layer, arrowed the tablist, ticked 6/6, opened and Esc-closed the Enterprise sheet, copied the address. Also checked reduced motion, JS off, 375×667 and 320. Non-localhost POSTs were blocked.

Stills: `docs/review/security/hero-1470.jpg`, `phone-sheet-over-hero.jpg`, `sheet-open-1470.jpg`.

## What works
- The hero idea is right for an "honest status" page. The six layers stack as isometric plates, from the edge down to Koma's black file. They check themselves once at 0.4 s and then 300 ms steps (`01 / 06` to `06 / 06`), and then rest. Something moves inside 1 s, it says "checked", and it stops. Reduced motion shows all six checked with 0 animations after 3 s.
- One ask, Hanzo's words: "Talk to Security Team", solid in the hero. Once the hero leaves, the desktop header ask swaps to the same label. The closing band repeats it. The secondaries are text links.
- Clicking a hero layer scrolls to the controls with that tab selected and focused. The tablist is a proper APG tablist (arrows wrap; inactive panels are `inert`). The layout-id pill glides at 300 ms ease-emphasis with no spring.
- The reviewer's worksheet (Beyond) is a real idea. Ticking all six reveals "Schedule Security Review", and the count is `aria-live`.
- The plate's mechanism glyphs are an honest small object made from the copy's own terms. Examples: struck-through `org / user / email → verified token`, and `organization → workspace → project`.
- Clean numbers: CLS 0.0008 desktop and 0 on phone. No horizontal scroll at 375 or 320. Parity 60/60 text and 6/6 links. `taste.py` OK and `unique.py` OK. The ask bottom sits at y 454 at 375×667. JS off reads fully (h1 at opacity 1, every panel stacked).
- No seals and no invented uptime. The status is Hanzo's own sentence.

## The 11 answers
1. **5 s / 1 s:** Yes on desktop. The h1, lede, ask, status line and the layer stack all fit, and the check pass starts at 0.4 s. On the phone the first screen is just text, ask and status. The layers start below the fold, so nothing moves on the phone's first screen.
2. **One in, one out?** Only for the hero and the controls section. After that it is a document: "What runs underneath" (a paragraph beside 4 list rows), "Or none of our infrastructure at all" (a paragraph beside 3 rows), then the black room (paragraphs, a sheet button, an email, the band). The 3 white screens in a row read as the same type, so it is a text page with hairlines.
3. **A real visual object in every section?** Hero: yes (the layer stack). Controls: a weak yes (a white plate holding a big "05" and some chips; only plate 06 has Koma). The infra "rack" is 4 rows with three dots each, which is decoration rather than an object. The "none" section has no object at all. In the black room the large statement and the address carry it, which is acceptable for a closing room.
4. **One ask, nothing floating, scale rhythm:**
   - Desktop: yes on the ask.
   - Phone: the header still says "Try Hanzo", and no page ask bar appeared on the walk.
   - Floating over content: on the phone, the Enterprise sheet panel sits over document y 812–1533. That covers the hero layers and the start of the controls (see the still). This fails rule 6.
   - Scale: there is rhythm (52 h1, 26 heads, 64 plate figure, 84 closing line), but below the hero every section is the same mid scale. Nothing grows or shrinks.
5. **Hover and press:**
   - Hero labels fill and their plate lifts 10px. Press is scale 0.974.
   - Tabs nudge the title 4px. Rack and option rows nudge 4px, and the rack gets a clip-path fill.
   - The tick button lifts 1px.
   - The band ask's hover sets the background to the white it already has, so it does not visibly answer.
   - No hover tells you anything new (a number or a preview). They are all nudges.
6. **Overlap, font swap, shift:** No shift and no font swap. **Overlap: yes.**
   - (a) On the phone, the closed `DetailSheet` panel renders in flow over the hero and controls.
   - (b) On desktop, opening the sheet jumps the page to the top. The panel is not fixed and has no scrim, so the hero's layer labels print through it.
   - (c) On desktop at rest, the parked panel's shadow shows as a grey fade down the right 50px of every screen. It is parked at x 1482–2122, which makes `scrollWidth` 2122 under `overflow-x: clip`.
   - The cause is shared: `components/v2/DetailSheet.jsx` renders a `div.pf-sheet`, while `DetailSheet.css` only positions `dialog.pf-sheet` (the merge `d490cc53` kept mismatched halves). /trust shows the same right-edge fade. It still breaks this page.
7. **Reference:** chatgpt.com/business/enterprise calm, as the brief asks. That calm is there, but its "big statements and proof listed quietly" turns into paragraphs here. No apple pinned scene and no osply-style editorial asymmetry.
8. **Different from neighbours?**
   - The hero differs: the isometric stack, versus /trust's centred h1 and /enterprise's nested-boxes diagram.
   - But the controls section repeats /trust's own move: a numbered `01 / 06` list on the left and a detail plate with a big numeral on the right. Neighbours share a signature shape.
9. **18 parts:** The card has 18 headings, each with a filled line. See the card check for claims that are now false.
10. **Banned tells:**
    - Nothing above the h1 ("Security Architecture" sits below it, which is correct).
    - No hue, gradient text, Inter or seals.
    - The "Or none of our infrastructure" plus "What runs underneath" pairing reads as walls of text.
    - The sheet overlap is a hard fail.
11. **Copy untouched:** Parity 60/60 and 6/6. No changes seen.

Console: one hydration-mismatch error and the red "1 Issue" badge on the first loaded walk, but a single quiet reload was clean. This matches `_shared.md` §3 (load-only), so it is not held against the page.

## Card check
`docs/coverage/security.md` is in MASTER format, with 18/18 headings and every "Done here" line filled. Three claims are false on this build:
- **Part 11:** "375×812 and 1470×801 pass with no overlap" is false. The sheet panel sits over the hero and controls on the phone. The card cites `phone.mjs`, which did not catch it.
- **Part 8:** "Dialogs are native, trap focus and return it" is false. The sheet is a `div`, not `<dialog>`. After Esc, focus goes to `body` and does not return to the "What comes with Enterprise" button. There is no scrim.
- **Part 4:** "Sticky ask in header and bar after the hero, same label" holds on desktop only. On the phone the header stays "Try Hanzo", and no bar with "Talk to Security Team" appeared.

Per `_shared.md` §2, a false claim caps the page at 7, so the cap applies even after the overlap is fixed. Part 18 correctly leaves "Review read" unticked.

## To reach 8
- **Fix the sheet (blocker).** Either render `DetailSheet` as the native `<dialog>` its CSS expects, or ship page-local CSS that makes `.pf-sheet` `position: fixed; inset: 0`, with the scrim and `visibility: hidden` while closed. Then:
  - Confirm that nothing of the sheet is visible at rest on the phone and that the desktop right edge has no shadow.
  - Confirm that opening it does not scroll the page and that Esc returns focus to the button.
  - File `docs/requests/security.md` against the shared owner, because /trust and the other DetailSheet pages share the bug.
- **Give the two white middle sections an object and make them one-in-one-out.**
  - Turn the infra rack into a real thing: the four rows light one by one as they enter, or draw each as a server unit whose bay LEDs answer hover. Don't leave it as four list rows with dots.
  - Give "Or none of our infrastructure at all" one visual: the same six-layer stack lifting off a "Hanzo cloud" base onto "your rack", built from the existing labels "Our cloud, your cluster, your rack".
  - Or pin the two sections so that one replaces the other instead of three white screens of paragraphs stacking up.
- **Move the controls section away from /trust's numbered-list-plus-plate layout.** One option: carry the hero stack down, sticky, so selecting a tab lifts that plate out of the stack and the words come up beside it. This also makes the hero object the page's through-line.
- **Phone first screen:** pull at least the top of the layer stack (or a compact horizontal version) inside 812px so something moves without scrolling. Put "Talk to Security Team" in the phone header or the slim bar once the hero ask leaves.
- **Make hovers tell something.** Hovering a hero layer could show its mechanism chips (for example `HKDF-SHA256 · TLS 1.3`). Give the band ask a visible hover change (not opacity).
- **Correct the three card claims** once they are true.
