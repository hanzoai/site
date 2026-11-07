# /mcp — James-eye review

Verdict: 6/10
First complaint: "Orange buttons, orange numbers, orange plus signs. I said black and white. And on my phone the headline runs to seven lines."

Walked 7 Nov, page file at `9d8a212` (`components/pages/McpPage.jsx`, `McpPage.css`, shared `v2/A2*`), on main merged with the Apps 2 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion, JS off and a card-open test. Stills: `review/mcp/desktop-walk.jpg`, `review/mcp/phone-walk.jpg`, `review/mcp/card-opens.jpg`.

## What works
- The hero object is alive from the first second: a tool-call stream where Hanzo's tools fire with latency bars, beside the headline.
- The signature really works. The six tool domains sit on a drag rail; click one and the card grows into a full sheet listing every tool in that domain. Esc closes it and focus returns to the card. That is the synchronized.studio move, in place.
- "38 + 1,538 + 260+" as giant figures, then three runtime sheets that stack as you scroll. One thing comes in, one goes out.
- A sticky "Hanzo MCP · Browse 260+ tools" pill on desktop after the hero, and a bottom bar on phone. Copy buttons confirm, press scales to .98, CLS 0. Reduced motion leaves 0 running animations; JS off leaves 0 hidden text.
- Parity: text 72/72, links 5/5.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes. Headline, lede, "Browse 260+ tools" and the live stream all fit 1470×801. Phone: the 48px headline breaks into 7 lines, and the button lands at the very bottom edge (y=769).
2. **One in, one out, or a document?** A scene for most of the page. But two screens are mostly empty white, above "Paste and ship" and between the rail and the dark room. They read like something failed to load.
3. **A real visual object in every section?** Mostly: the stream, the figures, a dot grid, a guard diagram, the rail, the config. The "Add Hanzo MCP to your client" close is text and two boxes.
4. **One ask, sticky after the hero?** Sticky, yes, at both widths. But the close has two solids side by side: orange "Browse All Tools" and black "Deploy to Cloud" in the "Get MCP" card.
5. **Every hover and press answers, no jumps?** Yes: buttons grow a little on hover and press to .98, and cards light their "+".
6. **Overlaps, font swap, layout shift?** None seen. Phone tap targets under 44px: "MCP docs →" (16px), "All MCP Tools Reference" and "hanzoai/mcp" (22px).
7. **Which reference, is its motion there?** synchronized.studio (card into sheet): yes. Apple (stacked sheets, figures as heroes): yes.
8. **Different from neighbours?** The rail and the stream are its own. The first screen is the shared Apps layout: coloured kicker, Display headline left, dark product card right (same as /kata, /ide, /operative).
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/mcp.md`.
10. **Banned tells?** Yes:
    - **Orange as UI colour** everywhere: the primary buttons, the kicker, "1,538", the dot grid, the "+" on cards, the links;
    - rainbow tool bars (white, yellow, blue, orange, red, cyan, green) and cream-tinted sheet boxes;
    - eyebrows over headlines ("HANZO MCP · 260+ TOOLS · 117 CLOUD SERVICES", "01 / 03" and the others, "TOOL DOMAINS", "GET STARTED").
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.16 Developer experience:** the "json" config block copies `//` comment lines and shell commands along with the JSON, so `JSON.parse` of what you paste fails. PLAN 2.16 names this exact row: split into a pure JSON block and a shell block, each with its own Copy.
- **2.8 Copy button:** the shared `Copy` says "Copied" even when the clipboard is blocked (`ui.jsx`; a kit fix, report it to the kit owner).
- **2.11 Mobile:** the h1 must be 3 lines or fewer on phone with the primary visible; today it is 7 lines.
- **2.4 Conversion:** two solids in the close.
- **2.7 Visual system:** orange accent and rainbow bars break the 0-hue rule.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Take the orange out.** "Browse 260+ tools" in ink, the kicker gone, "1,538" in ink like its neighbours, the "+" in ink. The tool bars in one silver at different lengths, with the active call in white. Sheet boxes in neutral grey, not cream.
2. **Split the config.** One `.mcp.json` block holding only the JSON (Copy gives valid JSON), and one bash block for `npm i -g hanzo` / `hanzo mcp`, each with its own Copy.
3. **Fix the phone hero.** Size the h1 so it breaks into 3 lines at most at 375 (or let the lede carry the list). "Browse 260+ tools" must sit fully inside 812.
4. **One solid in the close, and no empty screens.** Keep "Browse All Tools" solid and make "Deploy to Cloud" an outlined button. Close the two blank gaps (above "Paste and ship", and before the dark room) so every screen holds something.
5. **Strip the eyebrows.** Delete the kicker over the h1 and "TOOL DOMAINS" / "GET STARTED". Move "01 / 03" beside the sheet title, not above it.
