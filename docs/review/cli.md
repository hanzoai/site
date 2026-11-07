# /cli — James-eye review

Verdict: 6/10
First complaint: "The install button went a dull grey, so 'Open in the console' shouts louder than it. And there's a pill bar floating over the text."

Walked 7 Nov, page file at `4b53974` (`components/pages/CliPage.jsx`, `CliPage.css`, shared `v2/AppStage`, `AppScenes`), on the 14:43 preview of main plus the Apps branches, judged against `docs/MASTER.md` and `docs/JAMES.md`.
- **This build:** a 9-second first-screen film at 1470×801 and 375×812 with no input, a full scroll pass at both widths, reduced motion, JS off and phone tap targets.
- **The earlier `a1dcdca` walk:** the full moving walk with hovers and taps; the layout is the same.

Stills: `review/cli/desktop-walk.jpg`, `review/cli/phone-walk.jpg`, `review/cli/desktop-first-9s.jpg`.

## What works
- Still the best first screen in the Apps group. The whole first screen is one dark terminal window that types Hanzo's own session by itself (`hanzo`, "deploy the gateway to staging", reading the project, "gateway is on staging"), with the install line and Copy beside it. That is MASTER §4.6's developer hero.
- The resource tree is a real object: open a folder and the command it prints lands big beside it.
- "What the binary carries" is a rail of real commands with Copy. The script builder copies line by line. Copy confirms.
- Monochrome now (taste.py passes). JS off hides 0 of 32 text blocks. Reduced motion leaves 0 running. Parity: text 82/82, links 10/10.

## Card check
- `docs/coverage/cli.md` does not exist, so the verdict is capped at 7. All 18 parts are missing a `Done here:` line.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, the terminal types at once. On the slow machine the h1 arrived after the terminal had started; paint it first.
2. **One in, one out, or a document?** Mostly scenes. "A coding session, metered" is three numbered paragraphs, a document moment.
3. **A real visual object in every section?** Yes, apart from the "metered" list.
4. **One ask, in the sticky header?** No.
    - The header says "Try Hanzo", while the page's ask is "Install from hanzo.sh".
    - That ask rides in a floating pill at the bottom of the desktop screen, over the "metered" text and the script.
    - The palette swap turned the lime primary into a mid-grey (`#a3a3a3`) fill on black. The white "Open in the console" now reads as the main button, and the hierarchy is upside down.
    - The page still ends twice: "Install the CLI" (solid), then a "Get CLI" card with a grey solid "Deploy to Cloud".
5. **Every hover and press answers, no jumps?** Desktop yes on the full walk. Phone: "Open in the console" is a 15px-tall target; "Read the docs" and "View on GitHub" are 21px.
6. **Overlaps, font swap, layout shift?** The floating pill overlaps content at 1470×801. On phone, opening a tree folder pushed the section down: 0.42 layout shift on the full walk (`a1dcdca`, same layout).
7. **Which reference, is its motion there?** Apple's product-as-hero: yes. osply's copy-in-place: yes.
8. **Different from neighbours?** Yes in the hero, the only Apps page that opens in its own dark room.
9. **18 parts (MASTER §2)?** No card. See below.
10. **Banned tells?** Yes:
    - labels directly above the h1 ("~ HANZO CLI · DEVELOPERS") and above h2s ("WHAT IS HANZO CLI", "CAPABILITIES", "GET STARTED");
    - a floating pill bar over content.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts
- **Card:** no coverage card, and no `Persona:` / `Goal:` / `CTA:` / metric lines.
- **Part 3:** two endings, no single `Band`.
- **Part 4:** header ask mismatch; floating ask; the primary is weaker than the secondary.
- **Part 7:** labels over headings; a grey fill that reads disabled (MASTER §3.1: white 30% / grey is the disabled rank on black).
- **Part 11:** phone layout shift; small targets.

## Fixes (in order)
1. **Fix the hierarchy.** "Install from hanzo.sh" becomes the one white solid on the black room. "Open in the console" and "View on GitHub" become text links with a chevron. "Deploy to Cloud" stops being a filled grey.
2. **The ask goes in the header.** "Install from hanzo.sh" in the sticky header for this page (via `lib/cta.js`; write `docs/requests/cli.md` for the shared part). Turn off the floating desktop pill.
3. **One ending.** Let "Install once. It comes with you." be the closing `Band` with the hero's verb as its one solid. Move "Get CLI" and the related links above it.
4. **Stop the phone jump.** Give the tree's output pane and the hero terminal fixed heights. Make every phone target 44px.
5. **Delete every label sitting directly above a heading.**
6. **Write `docs/coverage/cli.md`.**
