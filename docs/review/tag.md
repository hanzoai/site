# /tag — James-eye review

Verdict: 6/10
First complaint: "The top is alive, the map is nice, then it turns into a document. After the hero it's text tiles, text rows, more text tiles, three buttons. Where's the thing to look at? And why is that heading crashing into itself?"

Walked on 7 Nov 2026 with Playwright (Chromium), with video recorded, at 1470x801 (mouse wheel in 100px notches, 110 ms per notch, 500 ms dwell every 500px) and at 375x812 (isMobile, hasTouch, DPR 2, scrolling in 100px steps). I hovered and pressed the hero asks, the secondary ask, the channel tiles, the "What it is" rows, the "Built" index, the platform chips and the closing ask. I clicked map nodes, opened an FAQ item, idled 6 s and compared hero frames 1 s apart, and reloaded under reduced motion. I checked horizontal overflow, broken images and console errors on ten or more loads. Working files, frames and video are in /tmp/claude-0/-home-user-hanzo-site/715b2a45-dd44-5306-98d1-bc0b4d91bc34/scratchpad/critic/tag/.

## What works
- **The hero object is real and alive.** The mention map (@Hanzo at the centre, six numbered steps, channel dots, Canvas/Code/View leaves) starts lighting nodes within 1 s with no input and keeps changing after 6 s idle. Clicking a node changes the thread panel ("03 / 10 2. Loop in design"). That counts as a real product moment, not an icon.
- The h1 cuts in by line mask and settles at 48px. Nothing visible sits above it: the kickers are visually hidden.
- The sticky ask hands over properly on desktop: the header reads "Try Hanzo" while the hero ask is visible, then becomes a solid "Set up Hanzo Tag". Hero and closing asks darken on hover and press at scale 0.98 with no layout jump.
- **"What can Hanzo Tag see in Slack?"** is the best section after the hero. It is an interactive picker that answers in Hanzo's own FAQ words, inside the page's one true black room. It is a good "Beyond".
- The setup wire (3 ticked steps drawing a line) and the Built index (one panel changes while the list stays) are proper "one panel changes" moves.
- No hue anywhere: `--acc` resolves to ink `rgb(10,10,11)`. No horizontal page scroll at 375 (scrollWidth 375). Reduced motion leaves 0 running animations after 3 s and shows the final state (all nodes lit, "Session ready").

## What fails (ranked, each with a concrete fix the owner can make in the page's own files)
1. **A heading overlaps itself at 1470.** In "Your Slack channels become live engineering & operations rooms", row 03 "Federated Agent Access (WIMSE)" wraps to two lines that overprint: the h3 computes to 35.2px with a 21.6px line-height. Any row title that wraps collides. Fix in `components/pages/Tag.css`: add `line-height: 1.1` to `.xtg-rows h3` (line 163). Also cap the size so the h3 (35px, and 28.8px in Built) is not bigger than its section h2 (26px). Rest the h3s around 21px and let only the `.on` row grow.
2. **After the hero it reads as a document.** It holds four text-only blocks:
   - `xtg-chans`: a 2x2 grid of paragraph tiles with "@" glyphs in rounded chips (an icon in a rounded box, which is banned);
   - `xtg-what`: three text rows;
   - `xtg-plat`: a 2x2 of headings and sentences with a crosshair;
   - a chip row.

   None holds a real visual object. Fix in `Tag.jsx`, using what the page already has (the `Msg` thread renderer, `CANVAS`, `DIFF`, `WINDOW`, `TABS` from `slackData.js`):
   - Chans: replace the 4 tiles with one live object, for example the Canvas card or the diff from `DIFF` rendering beside the lede. Keep the 4 sentences as small captions under it. Drop the `@` chips.
   - What: let the active row show its artifact (Code channel thread / Canvas+Diff / a WIMSE token line) in a right-hand stage that swaps with the row.
   - Plat: show the four surfaces as small product frames (or Sigil marks), not text quadrants.
3. **The phone first screen has no product.** At 375x812 the h1, lede and two asks fill the screen. The map starts at about y=1100 and the cookie card covers the rest. MASTER part 3 asks for 80px or more of product inside 660px. Fix in `Tag.css` under `@media (max-width: 899px)`:
   - drop "Configure Federated Access (WIMSE)" to a text link below "Slack integration docs";
   - tighten hero top padding (currently about 160px to the h1);
   - pull the map up so its top 120px shows on the first screen.
4. **Broken avatars and console errors.** Thread avatars hotlink `https://hanzo.ai/memoji/dev.svg` and `sci.svg` (`Tag.jsx` line 164). Each load logs `ERR_TUNNEL_CONNECTION_FAILED`, and the phone shows a broken-image icon beside "Dev". Fix: mirror the memoji into `public/memoji/` and use `/memoji/${m.face}.svg`, as MASTER part 10 requires. A React hydration-mismatch error also appeared on 2 of about 10 loads (the phone walk and a reduced-motion load), with the red "1 Issue" badge. Find the server/client-divergent attribute in the map or the auto-cycling islands: initial `useState` from timers or `useReducedMotion` driving `className` or `style` before mount. Gate it behind a mounted flag.
5. **Too many black blocks, nearly back to back.** The hero thread panel is black, the Built detail panel is black, and the "see" room is black right after it. On phone the Built panel runs straight into the black room (frame s10). MASTER allows at most 2 black or graphite rooms, never back to back. Fix: make the Built detail panel `#f5f5f5` (quiet room) or a hairline sheet, so the "see" room is the one dark moment below the hero.
6. **The closing section has 4 asks and two solid fills.** It shows "Connect Slack Workspace" (solid), "Explore Hanzo Team", "Explore Hanzo in Chrome" and a solid black "Get Hanzo Tag / Deploy to Cloud" card with a giant decorative "@". Three pill buttons in a row plus a second solid block breaks "one solid ask" and "never 3 or more equal buttons". Fix in `Tag.jsx` `Close` and `.xtg-get` CSS:
   - keep "Connect Slack Workspace" solid;
   - set the two Explore links as text links (`More`);
   - turn `.xtg-get` into a quiet outlined card (`#f5f5f5`, ink text) with "Deploy to Cloud" as a text link;
   - drop the 180px "@" glyph.
7. **Dead air between sections.** Gaps of roughly 250 to 300px of empty white appear after the hero (frame desk-s01), after "What it is" (desk-s07) and before the close (desk-s15). The black thread panel also has about 150px of empty black below the message (`.xtg-moment` `min-height: 520px`). Fix: let `.xtg-moment` size to content (drop the min-height or cut it to about 360px) and trim the `a2-sec` padding on `.xtg-what` and `.xtg-plat` toward the low end of the clamp.
8. **Every tap answers, mostly.**
   - The channel tiles in `xtg-chans` change nothing on hover or press.
   - The hover state of the "What" rows only re-targets the cycler.
   - The FAQ and setup wire are fine.

   Fix: give `.xtg-chans li` a hover fill to `#f5f5f5` plus a 1px ink underline, and add `:active { transform: scale(.98) }` to `.xtg-rows li`. Better, once fix 2 lands, make the hover preview the artifact.
9. **Too much auto-cycling.** The map, the What rows (3.2 s timer), the Built index (3 s timer) and the setup wire all rotate on their own. Each one moves, but by the third rotating list it feels mechanical rather than authored, and scroll-driven moves are nearly absent. Fix: keep the map and the "see" picker as the idle movers. Make the What rows scroll-scrubbed (the active row follows scroll position) and let Built advance only on scroll entry or click.

Note (shared chrome, not this page's to fix): on phone the cookie card is about 400px tall over content, against MASTER's 220px. The phone header keeps "Try Hanzo" instead of the page's own ask after the hero leaves.
