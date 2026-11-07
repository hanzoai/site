# /cli — James-eye review

Verdict: 7/10
First complaint: "Lime green buttons? I said no green. Black, white and greys."

Walked 7 Nov, page file at `a1dcdca` (`components/pages/CliPage.jsx`, `CliPage.css`, shared `v2/AppStage`, `AppScenes`), on the preview of main plus the Apps 1 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. The machine was overloaded during the walk, so motion was judged from the frames, not the frame-rate numbers. Stills: `review/cli/desktop-walk.jpg`, `review/cli/phone-walk.jpg`.

## What works
- This is the right hero for a developer page. The whole first screen is one dark terminal window, and it types Hanzo's own session by itself: `hanzo`, "deploy the gateway to staging", reading the project, "gateway is on staging". The install line with Copy sits beside it. That is BRIEF §5.6 done properly.
- The resource tree is a real object: open a folder and the command it prints lands big beside it, with a block cursor.
- "What the binary carries" is a rail of real commands, each with its own Copy. The script builder copies line by line. Copy confirms ("Copied").
- Desktop has a sticky ask: a floating pill "A senior engineer in your shell · Install from hanzo.sh →" once the hero leaves, and the phone has the same bottom bar. Same verb as the hero.
- Press answers (scale .92 on Copy). Desktop CLS 0. Parity: text 82/82, links 10/10. Reduced motion leaves 0 running; JS off hides only 1 of 32 text blocks.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes. A headline plus a terminal typing a real job. It is the best first screen in the Apps group.
2. **One in, one out, or a document?** Mostly scenes. "A coding session, metered" is three numbered paragraphs in a list, a document moment in the middle.
3. **A real visual object in every section?** Yes, apart from the "metered" list.
4. **One ask, sticky after the hero?** Sticky, yes, at both widths. But the hero shows two solid buttons ("Open in the console" in white and "Install from hanzo.sh" in lime) plus the header's solid "Try Hanzo". The page also ends twice: "Install once. It comes with you." with a solid "Install the CLI", then a "Get CLI" card with a solid lime "Deploy to Cloud".
5. **Every hover and press answers, no jumps?** Desktop yes. Phone: two tree rows ("status", "--read-only") and one Copy gave no visible answer to a tap. "Open in the console" is a 15px-tall tap target on phone; "Read the docs" and "View on GitHub" are 21px.
6. **Overlaps, font swap, layout shift?** Phone layout shift is 0.42: opening a tree folder and the terminal output growing push the whole section down under your thumb. Desktop 0. No overlap.
7. **Which reference, is its motion there?** Apple product page (the product is the hero, one idea per screen): yes. osply's copy-in-place: yes.
8. **Different from neighbours?** Yes in the hero: it is the only page in the group whose first screen is the product's own dark room. Below the hero it shares the kit with /api, /bot, /desktop and /gen.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/cli.md`.
10. **Banned tells?** Yes:
    - a lime green accent on the main button, the prompt, the tree highlight, the cursor blocks and "Deploy to Cloud" (green accents and UI hues are both on his reject list);
    - eyebrows over the h1 ("~ HANZO CLI · DEVELOPERS") and over headlines ("WHAT IS HANZO CLI", "CAPABILITIES", "GET STARTED").
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.4 Conversion:** two solid buttons in the hero, and two endings with two different solids.
- **2.7 Visual system:** the lime accent; it is also the same green family /kata uses.
- **2.11 / 2.12:** phone layout shift 0.42; 15–21px tap targets.
- **2.16 Developer:** good. Copy equals the displayed line. Keep the `$` unselectable rather than in the copied text.
- **2.18:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Lose the green.** "Install from hanzo.sh" becomes the white solid on the dark room; prompt, tree highlight and cursor go white or a silver alpha step. "Deploy to Cloud" goes ink.
2. **One solid in the hero.** Keep "Install from hanzo.sh" solid. Make "Open in the console" and "View on GitHub" text links with a chevron.
3. **One ending.** Let "Install once. It comes with you." be the closing Band, with "Install from hanzo.sh" (the hero's verb) as its one solid. Move the "Get CLI" card and related links above it, or drop the extra solid.
4. **Stop the phone jump.** Give the tree's output pane and the hero terminal fixed heights, so opening a folder never moves what is below. Make every phone tap target 44px.
5. **Delete the kickers** over the h1 and the section headlines.
