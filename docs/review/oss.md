# /oss/* (template) — James-eye review
Verdict: 6/10
First complaint: "The top is fine, then I scroll and it's just a list of zeros. Nothing comes in, nothing goes out. It's a GitHub page with nicer fonts, there's no premium feel."

Walked moving on 7 Nov: /oss/hanzo-app/ (11 repos) and /oss/crowdstart/ (3 repos), at 1470x801 and 375x812. I took 250 ms frame runs for the first 8 s, slow wheel-scrolls through the whole page, hover and press probes, the filter, sort, search, row-open and rail-card-open, plus reduced motion, JS off and 320px. No arrival curtain appeared. Proof is in `docs/review/oss/`.

## The 11 questions

**1. Does the first screen sell in 5 s, and does something move within 1 s?** Partly. The h1 cuts into its line by about 500 ms, the hero figure counts up (11 / 3), a mono marquee of repo names runs, and contour line art draws inside the hero panel, so it is alive within a second. It does not sell, though. The hero object is a 1152x320 grey `#f5f5f5` panel that is mostly empty: about 90px of blank grey sits between "public repositories" and the marquee (hanzo-app), and on crowdstart one digit sits in the same big box. "Counted from GitHub 0 stars 1 forks" pokes in at the fold. On every load a red Next "1 Issue" badge sits bottom-left (proof 1).

**2. As you scroll, does one thing come in as one goes out?** No. It reads as a document. I jumped to each section on a fresh load and sampled it for 800 ms: `.xos-fg`, `.xos-repos`, the rows, `.xos-near` and the Band all show opacity 1 and transform none from the first frame. No section enters, nothing is pinned, nothing scrubs, and no marquee answers the scroll. The middle of the page is two stat blocks of zeros ("0 commits… 0 merges… 0 of those commits"), then a flat 11-row list, then the rail. Below the hero, the only scroll-linked motion is the header ask swapping from "Try Hanzo" to "hanzo-app on GitHub".

**3. Does every section hold a real visual object?** Mostly not. The hero has the panel, figure and marquee. The rail cards and the Band have Sigil contour line art. "Counted from GitHub" and "Counted on Hanzo Forge" are plain text and small numbers on white, and Repositories is text rows only. Two of the five sections have no object.

**4. One ask in the sticky header, nothing floating, and scale rhythm?** The header ask is good: it starts as "Try Hanzo", goes outline while the hero primary is in view, then becomes a solid "hanzo-app on GitHub" once the hero leaves. Nothing floats over content (the cookie card is 203px tall on phone, within the 220px budget). At 375 both "Try Hanzo" and "hanzo-app on GitHub" are solid black in the first screen, which makes 2 solid fills. Scale breaks the rest sizes: h1 is 72px (rest 52), "Repositories" h2 is 44px while the other h2s are 26px, and the hero figure and stat figures are the same light weight. Below the hero nothing grows or shrinks; everything is medium-small and flat.

**5. Does every hover and press answer, with no jumps?** Mostly yes. Primary: `#0a0a0a`→`#262626` and press scale 0.97 (spec is 0.98 or translateY 1px). Secondary: underline on hover, translateY(1px) on press. Chips: grey→ink, press 0.97. Rail card: `#f5f5f5`→`#ededed`, reveals its description, press 0.974. Repo row: a faint fill and press 0.98, and click raises a sheet with stars, forks, a GitHub/Forge clone toggle and a copy button. That sheet is the best moment on the page. Weak spots: the row hover tells you nothing new (no preview or number), and the language filter pill jumps instead of gliding. Search with no match ("zzz", or "vite" under Vue) shows only a magnifier and the quoted query: no sentence and no "clear filters" action.

**6. Overlaps, font swap or layout shift?** CLS is 0.0008 at desktop and 0 at phone. There is no horizontal overflow at 375 or 320, and the header is opaque, so nothing overlaps. However, every load logs 2 console errors, React hydration mismatches: the search `<input>` style (`{}` vs `caret-color:transparent`) and the footer HTML. They show the red "1 Issue" badge, which fails DONE item 3. Row 01 is a taller "lead" row whose Forge and ↗ actions sit 152px left of every other row's (952 vs 1104 px), and all actions stop about 110px short of the list's right edge (proof 3).

**7. Which reference does it feel like, and is its motion there?** synchronized.studio, in two places: a row opens into a sheet that rises from the row, and a rail card Morphs into the next org page, whose h1 lands where the card title was. That is real. Nothing of apple.com is here (no pinned scene, no one idea per screen), and the motion.dev gliding-tab pill is missing from the filter.

**8. Is it different from its neighbours?** Within the family, members differ only by data and Sigil seed, which the brief allows. hanzo-app and crowdstart are otherwise the same page. The hero medium (grey panel, mono figure, name marquee) is its own thing.

**9. Are all 18 parts covered?** No. Part 17: the empty state has no register sentence or action. JS off, phone: the h1 "Crowdstart" stays half-clipped by its line mask and the hero figure is blank, so the count-up has no SSR value (proof 2). Part 13/3: the hydration console errors. Part 15/4.3: no gliding pill. Part 1: 2 solid fills on the phone's first screen. Parity, reduced motion (it shows the final state) and 320px all pass.

**10. Any banned tells?** No hue, no gradient text, no Inter, no serif italics, no pill above the h1. "OPEN SOURCE · HANZO" sits under the lede in the right column, not above the headline. Two items from the banned list come close: "a dead page" below the fold (static sections), and an almost empty boxed hero panel.

**11. Is the copy untouched?** Yes. `parity.py`: /oss/hanzo-app text 37/37 and links 25/25; /oss/crowdstart text 28/28 and links 9/9.

## Fixes (by impact)

1. **Clear the hydration errors so the badge goes:** render the search input's `style` the same on server and client (no client-only `caret-color`), and stop the footer HTML string differing between SSR and client. Target: 0 console errors on both members at both sizes, and no "1 Issue" badge.
2. **Make the middle of the page arrive:** give each of the 4 sections below the hero one authored entrance (line-mask cut-in on the h2s; a list-level entrance on the rows at 60 ms stagger, 16px rise, `ease-emphasis` 400 ms). Give the two "Counted" blocks one pinned stage in which the figures count up as it's reached and the GitHub panel swaps for the Forge panel, so one goes out as one comes in. Scroll-linked effects must stay at most half of the page's motion.
3. **Make JS off legible:** server-render the hero figure's final value (11 / 3) and have the h1 line mask start unclipped without JS (`<noscript>` or a `.js` class gate). Target: a JS-off screenshot at 375 and 1470 shows the full h1 and figure.
4. **Fill or shrink the hero panel:** cut the empty band between the figure and the marquee (target panel height ≤ 240px at 1470), or let the figure be the one big thing (84–112px while it is the moment, then settle to 64). At 1470x801, "Counted from GitHub" should not peek in under the fold.
5. **Put the type back on the rest scale:** h1 at 52px desktop and "Repositories" h2 at 26px like the other h2s, so the hero figure is the single big thing per screen.
6. **Glide the filter pill:** one ink pill moves between language chips (`ease-emphasis` 300 ms, layout animation), not a background swap. Add an "N of 11" count change as the hover/press detail.
7. **Align the rows:** row 01's actions sit at the same x as rows 02–11, and actions end flush with the list's right edge (0px gap, measured).
8. **Design the empty state:** a register sentence from `content/ui-strings.json` and one "Clear" action that resets search and filter. Never show only the quoted query.
9. **One solid fill on the phone's first screen:** demote the header "Try Hanzo" to outline while the hero's "…on GitHub" primary is visible, as desktop already does.
10. **Press scale to spec:** primary and chips at 0.98 (not 0.97), 90 ms.
11. **Make row hover tell you something:** show the row's last-push age or star/fork delta, or a 1-line preview of the sheet, beyond the faint fill. Hover fill at least `#f5f5f5` so it reads.
