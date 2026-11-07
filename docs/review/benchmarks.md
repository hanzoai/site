# /benchmarks — James-eye review

Reviewed 2026-11-07, walked moving at 1470x801 and 375x812 (Playwright, wheel steps of 400px every 700ms, rest pairs on the first screen and mid-page, hover/press/tap on the hero ask, links, (+) sheets, frontier tabs, board toggles, race tabs, sub-nav rail, "/" search and the context dial).

Verdict: 5/10
Ready: 8 Nov, held up next to /api and /affiliate (James's new bar, no score). On top of the 7 Nov fixes already in (page-local sheets inside the viewport, opaque rail, folded lists, hero arrival after the h1), the context dial no longer moves the page as it steps (phone CLS 0.336 to 0.000, desktop 0.049 to 0.002) and the phone rail tabs are 44px. taste/unique/parity OK (text 860/860, links 134/134); 0 console errors, no overflow at 1470 and 375; benchmarks/* untouched (it does not import Benchmarks.css), /benchmarks/zen-6 rechecked clean. Phone is still about 33 screens (was 47); the rest of the volume cut would mean restructuring sections.

First complaint: "I pressed one of the plus buttons and the whole page slid off to the left with a stack of panels on top, and Escape didn't bring it back. On the phone it threw me to the top and opened the wrong panel. That's broken, not premium."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Mostly yes. The h1 "Intelligence, cost and speed, each measured." (52px) cuts in by line, and the frontier draws its step line, then reads GLM 5.3 by itself. Two problems: at 300ms the left half of the first screen is blank, because the h1 is still masked while the lede and ask on the right are already there, so the screen reads right to left. A stepped grey shadow band also sits on the right edge at desktop (x≈1370–1470) and along the bottom on the phone, over the chart. It comes from the closed sheets' shadows leaking into the viewport, and it looks like a rendering fault in the first 5 seconds.
2. **One in, one out?** Partly. Stage, pinned chapters and the scroll-spy rail give it shape. But the page is 23,138px at desktop (about 29 screens) and 38,543px on the phone (about 47 screens). Kai alone runs 16 duel tiles, a "suite by suite" board, a pinned 4-step chapter, a price chapter and agent-tool cards. That is the "overload of information" James named. The full 24-row shelf and the 5-column "Every benchmark page" link list make the second half read like a document.
3. **A real object in every section?** Yes. Frontier chart, duel tiles, board, context dial bars, race arena, the 477-byte square, the shelf. Every section has a real data object, and this is the page's strength.
4. **One ask, sticky after the hero?** Yes on desktop: the header swaps to solid "Start on Hanzo Cloud" once the hero ask leaves, and nothing of the page's own floats. Scale has rhythm: a 52px h1, 26px heads and one 84px moment per screen (3.02×, 2.0×, 477 bytes, ~3,665 tok/s, 72.40×). The sticky sub-nav rail is translucent, though: headings and body text show through it while scrolling ("Agent tools", "Choice among 77…", "Knowledge graph" on phone), so it does sit over content.
5. **Every hover and press answers?** Controls do answer: the Cta darkens and scales to 0.98, links drop 1px, rows fill, pills switch, the board re-sorts, the race runs and "/" focuses search. The (+) sheet controls fail badly: see 6.
6. **Overlap, font swap, layout shift?** Fails.
   - Desktop: pressing any (+) (tested "Decision Suite" and "The 12 runs as a table") scrolls the document 1052px sideways, even though html is `overflow-x: clip`. All 13 sheet panels then sit in the viewport together, with "The research" on top. Escape leaves scrollX at 1052 with the page broken (proof `desktop-walk.jpg`).
   - Phone: tapping "Decision Suite" jumps to the top of the page and shows "Zen 6 throughput & Latent Sparse Attention", the wrong sheet. Escape does not close it, and its table clips sideways.
   - Next.js red "1 Issue" badge on every screen: a hydration attribute mismatch is logged on load.
   - Layout shift: desktop CLS 0.045 (one 0.043 jump from `xbm-dial-n`, the context dial numbers). Phone CLS 0.62, from repeated 0.03–0.06 jumps on `.xbm-harness`, `.xbm-plat`, `.xbm-methods` and `.xbm-shelf` as they scroll into view.
   - No font swap seen.
7. **Which reference, and is its motion there?** It points at the anthropic.com launch (benchmarks as hero figures) and apple.com (pinned chapters, a sub-nav with a persistent ask). The pinned scene and the sub-nav are there. The launch "story" is lost under volume, and nothing opens as a card into its page.
8. **Different from its neighbours?** Yes in medium: a data chart that settles into the Stage, and a product rail. Distinct enough.
9. **All 18 parts covered?** The card has 18 headings, but several claims are false on the page:
   - Part 3: "nothing above the h1" holds, but the JS-on first frame shows the lede and ask before the h1.
   - Part 8: "dialogs trap focus and return it" is false, because sheets do not close on Escape and open the wrong panel on phone.
   - Part 11: "375×812 and 1470×801 pass with no overlap" and "layout shift 0.000" are false: the sideways shove and the stacked sheets, the translucent rail, and phone CLS 0.62.
   - Part 13: "no console errors" is false (hydration mismatch, red badge).
   - Part 16: the methods command line is clipped mid-word ("…&& node") with no visible copy control beside it at desktop.
10. **Banned tells?** The race lane labels carry emoji ("⚡ HANZO NATIVE", "⚙️ LOCAL RAG"). The ⚙️ emoji brings in colour, and they are pills sitting over the data. The stepped grey shadow bands read as grain or banding. There is no gradient text, no Inter and no hue.
11. **Copy untouched?** I saw no rewording. Eyebrows were moved under their headings as captions with the same words. The heading "Subquadratic Ultra-Long Context" breaks on its hyphen into "Ultra- / Long Context", so it needs `text-wrap: balance` or a wider measure.

## Fixes (ordered, most important first)
- **Fix the (+) sheets.** Closed sheets must not be laid out at `left:1482px` (desktop) or just below the fold (phone), where focus can scroll them into view. Use `visibility:hidden` plus `inert` (or `display:none`) when closed, and put the opened sheet in `position:fixed` inside the viewport. Escape must close it and return focus to its (+). The tapped (+) must open its own sheet on phone. Opening must never change scrollX or scrollY.
- **Remove the leaking sheet shadows.** The stepped grey band on the right edge of the desktop first screen and the rings at the bottom of the phone first screen come from closed sheets' `0 24px 60px` shadows. With the sheets hidden when closed, the band goes.
- **Kill the hydration mismatch** that raises the red "1 Issue" badge. Something renders different attributes on the server and the client: likely a date, a random seed, `window`, or a URL-hash board view read during render. Move that read to an effect.
- **Phone layout shift 0.62.** Give `.xbm-harness`, `.xbm-plat`, `.xbm-methods` and `.xbm-shelf` a `contain-intrinsic-size` that matches their real phone height, or drop `content-visibility:auto` there. Reserve the dial number width (`min-width` in `ch`, tabular numerals) so `xbm-dial-n` stops jumping 0.043 on desktop.
- **Make the sticky sub-nav rail opaque.** Use #fff, black-room #000 in Zen 6, and a 1px hairline, or real glass with enough blur and tint, so headings never show through it at either size.
- **Cut the volume, not the copy.** Keep the 4×4 duel grid and the 24-row shelf, but put more of them behind openers so each screen holds one idea. For example, show 4 duel tiles with "16 of 16" as the moment and the other 12 behind the board. Collapse the 5-column "Every benchmark page" list on phone. Aim to roughly halve the phone scroll length (now about 47 screens).
- **Hero arrival order.** Hold the lede, meta and ask until the h1 lines have cut in, staggered 60ms after the last line, so the first frame is not a blank left half beside finished right-hand content.
- **Race lane labels.** Set "HANZO NATIVE" and "LOCAL RAG" without the ⚡ and ⚙️ glyphs (the words stay) or swap them for a mono stroke icon. No colour emoji.
- **Methods command.** Show the full line in the kit `CodeBlock` (scroll region and visible 44px Copy) instead of a clipped dark bar.
