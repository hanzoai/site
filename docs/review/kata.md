# /kata — James-eye review

Verdict: 6/10
First complaint: "The whole page turns green. I said no green, black and white only. And the button's off the bottom of my screen."

Walked 7 Nov, page file at `99a05eb` (`components/pages/Kata.jsx`, `Kata.css`, shared `v2/A2*`), on main merged with the Apps 2 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/kata/desktop-walk.jpg`, `review/kata/phone-walk.jpg`.

## What works
- The best idea in the Apps group: the headline is the loop. "Test." lights while the suite runs, then "Repair.", then "Verify.". Beside it a test board and a terminal run Hanzo's own session by themselves (a red test goes green). It moved for my whole 2.5s dwell without input.
- The four stations are a pinned dial: 01 to 04 come in one at a time while the text swaps. Then a scrubbed wipe turns "1 failed" into a giant "0 failed". One thing in, one thing out.
- A sticky "Hanzo Kata · Get API key" pill rides the bottom on desktop after the hero, and a bottom bar does the same on phone. One ask, "Get API key", everywhere.
- "Will it fit my stack?" is a good Beyond: pick a runner, CI and language, and the answer comes only from Hanzo's own list.
- Copy confirms; Replay presses to .98; CLS 0; reduced motion leaves 0 running animations. Parity: text 76/76, links 11/11.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Moves, yes: the loop lights and the terminal types straight away. Sells, nearly. At 1470×801 the 128px headline takes four lines, so the lede is cut at the fold and "Get API key" sits at y=791, off the bottom of the screen.
2. **One in, one out, or a document?** A scene through the loop and the wipe. After that it turns into a document: a "capabilities" report card, a three-column link list ("The agent, the loop, the documentation") and an FAQ.
3. **A real visual object in every section?** Hero, dial and wipe: yes. The link list and the FAQ have nothing to look at.
4. **One ask, sticky after the hero?** Yes, at both widths. The ask is under the fold on desktop (see 1).
5. **Every hover and press answers, no jumps?** Yes on what I tried: Replay, Copy, the stack chips, the FAQ rows.
6. **Overlaps, font swap, layout shift?** None seen. JS off: 6 of 32 text blocks stay invisible.
7. **Which reference, is its motion there?** Apple product page (pinned dial, scrubbed reveal): yes, it is really there. motion.dev patterns: yes. No card opens into a page.
8. **Different from neighbours?** The loop headline and the dial are its own. The first screen is the shared Apps layout, though: coloured kicker, Display headline left, product object right (same as /ide, /mcp, /operative).
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/kata.md`.
10. **Banned tells?** Yes:
    - **Green**, as the signature: the "Autonomous loop." line, the kicker, the dial ring, the dots, the PASS chips and a full-screen green room. JAMES.md bans green accents, and wants 0 UI hues;
    - red for the failing test (status colour used as decoration);
    - eyebrows over headlines ("HANZO KATA · TEST REPAIR", "THE LOOP", "01 · OBSERVE" and the others, "CAPABILITIES", "READ", "QUESTIONS").
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 First impression:** h1, lede and primary do not fit 1470×801.
- **2.7 Visual system:** green and red as UI colour, a whole green room. Status colour must come with a shape or text cue, never as the theme.
- **2.3 Page endings:** no closing Band. The page ends on an FAQ with a second "Get API key", then the footer.
- **2.6 Content presentation:** the documentation section is a plain three-column link list.
- **2.12 / 2.17:** hidden text with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Take the green out.** Make "passing" ink and "failing" a mid grey with a strike or a cross. Keep the giant "1" becoming "0", but let the wipe go from dark to white (ink on paper), not to green. The same for the dial ring, the dots, the PASS chips and the "Autonomous loop." line.
2. **Fit the hero to 1470×801.** Keep the four-word loop, but size it so the lede and "Get API key" sit above the fold (about 104px, or tighter leading).
3. **Strip the eyebrows.** Delete the mono labels over the h1 and over every h2. Keep "01 / 04" beside the dial, not above the step title.
4. **Close like a launch.** After the FAQ, end on one Band: Display line, one solid "Get API key". Turn the documentation link list into rows with a hover fill that previews where each goes.
