# /ide — James-eye review

Verdict: 5/10
First complaint: "The editor is sitting on top of my buttons, and the code is just grey bars. Show the real thing."

Walked 7 Nov, page file at `cf12a91` (`components/pages/IdePage.jsx`, `IdePage.css`, shared `v2/A2*`), on main merged with the Apps 2 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/ide/desktop-walk.jpg`, `review/ide/phone-walk.jpg`.

## What works
- There is a real story: the editor arrives big and settles, then three pinned chapters ("It remembers", "It understands structure", "It is safe by default") swap their picture while the text holds. That is "one comes in, one goes out".
- "Tell it something" is a good Beyond: you type a memory, file it, and watch it fade and come back. A state change that is not scroll.
- The headline is big and tight (96px, line height 0.92). CLS 0, 60fps, reduced motion leaves 0 running animations.
- The agent-prompt and bash Copy buttons confirm ("Copied" replaces the label). Phone has a full-width "Open the IDE" bottom bar.
- Parity: text 75/75, links 10/10.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The headline sells. But at 1470×801 the dark editor window covers the bottom of the lede and cuts "Open the IDE" and "View on GitHub" in half, and its left edge runs off the screen (the "IDE" tab is cut). After the headline cut-in nothing moves until you scroll: the hero sat still for my 2.5s dwell.
2. **One in, one out, or a document?** Mostly a scene: stage, exploded workbench, pinned chapters, dark room. The accordion list in the dark room and the "Get started" code block read as a document.
3. **A real visual object in every section?** Yes, but the main one is fake. By the file's own comment, "the code is drawn, not written": grey and pink bars where code should be. A wireframe, not Hanzo's product.
4. **One ask, sticky after the hero?** Phone: yes, the bottom bar. Desktop: no. Once the stage passes, only the header's "Try Hanzo" stays. The close has two solids side by side: indigo "Open the IDE", and white "Deploy to Cloud" inside an indigo "Get IDE" card.
5. **Every hover and press answers, no jumps?** Hovers answer (the button grows, memory tags expand). Press on "Open the IDE" does nothing: no scale, no shift.
6. **Overlaps, font swap, layout shift?** Overlap in the hero at 1470×801 (above). No swap, no shift. Phone: "Open in the console" is an 18px tap target. JS off: 8 of 42 text blocks stay invisible.
7. **Which reference, is its motion there?** Apple product page (stage hero, pinned chapters): yes, the motion is there. synchronized.studio: no card opens into a page.
8. **Different from neighbours?** No. /desktop and /cli open on the same "— Hanzo" window with the same tabs (IDE, CLI, Playground, Desktop, API Keys). Every Apps page has a coloured kicker over a left headline and its own coloured button: indigo here, orange on /mcp, teal on /operator, blue on /operative, green on /cli.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/ide.md`.
10. **Banned tells?** Yes:
    - eyebrows over headlines ("HANZO IDE · DEVELOPERS", "WHAT IS HANZO IDE", "IT REMEMBERS", "CAPABILITIES", "GET STARTED");
    - UI colour everywhere: indigo buttons and card, a lavender graph box, a purple dashed sandbox, and orange, blue and green memory tags (green is banned outright);
    - a dead press on the primary.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 First impression:** h1, lede and primary do not fit cleanly at 1470×801; the hero object overlaps them.
- **2.3 / 2.7 Product renders:** the editor shows bar shapes, not crisp real text ("Show the real thing").
- **2.4 Conversion:** no desktop sticky ask; two solids in the close.
- **2.7 Visual system:** indigo accent plus five tag colours break the 0-hue rule.
- **2.8 Components:** no press state on the primary.
- **2.9 Motion:** the hero's live demo (cursor walking, memories surfacing) only starts once you scroll.
- **2.11 / 2.12:** 18px tap target; hidden text with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Clear the hero.** At 1470×801 the editor must start below "Open the IDE" (or start smaller and grow as you scroll) and stay inside the screen. Nothing may cover the lede or the buttons.
2. **Put real code in the editor.** Real text lines from Hanzo's own example (the gateway file the agent panel already talks about), crisp, in greys. Let the cursor walk them and the memories surface beside them from the first second, without waiting for scroll.
3. **Strip the eyebrows.** Delete "HANZO IDE · DEVELOPERS", "WHAT IS HANZO IDE", "IT REMEMBERS", "CAPABILITIES" and "GET STARTED" above the headlines.
4. **Take the colour out of the UI.** "Open the IDE" and "Get IDE" in ink and white. The graph box and sandbox in hairline grey. Tell the three memory kinds apart by label and position, not orange, blue and green.
5. **One ask, everywhere.** Add the desktop sticky "Open the IDE" once the hero button leaves. In the close, keep one solid and make "Deploy to Cloud" a text link. Give the primary a press (scale .98).
