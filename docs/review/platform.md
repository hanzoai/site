# /platform — James-eye review
Verdict: 6/10
First complaint: "There's a red error in the corner, the layers run over the text in the black bit, and once you're past the stack it's just a document again: heading, paragraph, box, empty gap, repeat, for eighteen screens."

Walked 7 Nov at 1470x801 and 375x812 with Playwright: 250 ms frames for the first 8 s untouched, a slow wheel scroll top to bottom at both sizes, hover and press probes on 16 controls, layout-shift observer, console, overflow at 320/375/768/1024/1920, JS off and prefers-reduced-motion. No arrival curtain on this page. Page length: **14,430 px = 18.0 screens on desktop, 19,203 px = 23.6 screens on phone.** Proof in `docs/review/platform/`.

## The 11 questions

**1. Does the first screen sell in 5 s, and does something move within 1 s?** Mostly yes. "The AI-native cloud." with a lede, two asks and an install strip sells the idea at once. The hero object, an isometric stack of 11 plates, changes for the first time at about 345 ms, then slides labelled layers out ("AI Gateway", "Kai", "Kernel DSL") and settles by about 10 s. That is a good idle opener. Against it: the h1 sits at 84 px (resting size is 52), the plates are thin grey lines on white with a heavy blurred grey shadow, and on phone the art at t=0 is drawn about 380 px wide right over "Inspect the stack" and the lede for about 500 ms before it snaps down to a small faint drawing (proof 2).

**2. One thing in, one out, or a document?** First half yes, second half no. The black "One stack. Down to the kernel." room pins and lights one pair of plates at a time while the matching rows change on the left. That is the best moment on the page. The "Compute / Data / Anywhere / Security / Ship / Pricing" pinned chapters also swap one panel at a time. After that come reach, API, loop, open source and proofs, five sections built the same way (26 to 44 px heading left, grey lede right, one box below). Each is 590 to 1,030 px tall and they are separated by measured empty bands of 323, 340, 367 and 351 px. Three in a row (1,029, 953 and 963 px) fall within 15% of one height, which breaks the brief's rhythm rule. The hero plus the stack journey alone take 3,845 px (4.8 screens).

**3. Does every section hold a real visual object?** Mostly. Hero plates, the lit stack, the directory with a contour-art "Catalog" preview, the API Platform console UI (real product UI, the strongest object), the 2x2 data-primitive pictograms, the control-plane tree, the measure loop ring and the terminal blocks. Weak spots: the "Push code" chapter is four text columns in a grey box, "Pay for what runs" is four identical tiles with barcode ticks, and the proofs section ("11 native layers", 95.6%, 3.02x, 2.0x) is figures and hairlines only. The 95.6%, 3.02x and 2.0x figures appear three times on the page (stack, intelligence, proofs).

**4. One ask in the sticky header, nothing floating, scale rhythm?** Partly. One solid fill per viewport holds (only "Start building" measured solid on the hero screen). On desktop the header changes from "Try Hanzo" to "Start building" once the hero ask leaves. On phone it stays "Try Hanzo" for the whole 23 screens, so the phone visitor sees two labels for the primary. The System brief asks for the sales ask, and none appears anywhere. Floating over content: a "ZAP / NATIVE INTERCONNECT" pill bar sits at the foot of the black room, and the plates cross over it (proof 1). Scale: h1 84 px, then 44, then mostly 32 and 26 px h2s, figures at 64 px, and the closing band h2 at 88 px. The band is the one "big" moment and that part is fine. The middle is uniformly medium, with nothing that starts small and grows.

**5. Does every hover and press answer, with no jumps?** Press is good everywhere: every probed control scales to 0.97 or 0.98 (Copy goes to 0.92) with no layout move. Hover is uneven:
- The directory row hover is the brief's signature and it works: hovering "Models" fills the row white and swaps the preview card to "Models / Explore frontier models…".
- No hover at all: the directory group heads ("01 AI →"), the API endpoint rows ("api.hanzo.ai/v1/agent") and the "Quickstart →" links.
- Thin hover: "Inspect the stack" only darkens its border from 8% to 18%.
- The header ask fades to opacity 0.88 on hover, a banned "button that fades".
- The intelligence rows ("02 Code Intelligence") transition `padding` over 0.3 s, and the brief bans animating padding.

**6. Overlaps, font swap or layout shift?** Layout shift is fine: CLS 0.0004 desktop and 0.0068 phone. No font swap was seen (Zen loads at about 930 ms and the h1 box does not move). No horizontal scroll at any width. Overlaps fail in three places:
- (a) Black stack room: the plate stack runs down over "NOT TELEMETRY" and the ZAP strip's "MCP bridge · typed service communication" text on entry (1470x801, proof 1).
- (b) Phone hero at t=0 to 500 ms: the art covers "Inspect the stack" and the "Kubernetes-native…" lede (proof 2).
- (c) Directory: CSS columns split "06 Security" from its items, so its heading ends column 3 and IAM, Authz, KMS start column 4 under an orphan rule. At 801 px the preview card's description is cut off below the fold (proof 3).

Separately, the Next.js red "1 Issue" badge sits bottom-left on every frame at both sizes. Cause: a console hydration-mismatch error ("A tree hydrated but some attributes of the server rendered HTML didn't match"). That alone fails DONE item 3.

**7. Which reference does it feel like, and is its motion there?** apple.com product pages: two pinned, scrubbed scenes where one panel changes, plus a product UI as the object. That motion is genuinely present in the stack room and the chapters. The chatgpt.com/business/enterprise calm is missing in the lower half, which reads as a long docs page. One problem with the Apple read: inside the pinned stack nothing moves without scroll (screen identical over 2 s at rest). So the page's motion is almost all scroll-linked after the hero settles. The only idle movers are the hero (stops at about 10 s) and the loop ring, which has a pause control.

**8. Is it different from its neighbours?** Not enough. `/security`'s hero uses the same idea: a vertical stack of isometric plates beside numbered rows 01 to 06, with the active plate lit. `/platform`'s signature, a stack of isometric plates lit row by row, is therefore shared with a System neighbour. `/enterprise` (nested deployment frames) is distinct.

**9. Are all 18 parts covered?** Not all of them. Gaps visible from outside:
- Part 3: the band uses a blur reveal, and phone hero art is not at true size at first paint.
- Part 4: there is no sales ask on a System page, and the phone header label is inconsistent.
- Part 6: chapter tabs wrap "06 Pricing" onto a second line at 1470, and there is an orphaned column head in the directory.
- Part 8: the stack search pill is an empty 280x44 field with no placeholder or visible label, and some links and rows have no hover state.
- Part 11: the phone page is 23.6 screens with the directory as a 2-column list of about 2.5 screens.
- Part 13: console error and dev badge.

Reduced motion passes: `getAnimations()` is empty after 3.5 s and the final states show. JS-off passes: 155 of 157 headings and paragraphs are visible, and the stack becomes a readable static list.

**10. Any banned tells?**
- The closing band h2 "Build on the stack. Or run it yourself." reveals with `filter: blur(12px)` plus opacity 0. That is an opacity-and-blur reveal, and the blur is over the 4 px cap.
- "SELECT A LAYER" Zen Mono label sits above the h2 "One stack. Down to the kernel." in the same column. It is an eyebrow above a headline.
- The header ask fades on hover (opacity 0.88).
- The heavy blurred grey shadow under the white hero plates reads as a soft generic glow.

No hue, gradient text or Inter.

**11. Is the copy untouched?** As far as a visitor can tell, yes: Hanzo's own phrasing throughout ("Every plane, and what is in it.", "Pay for what runs."). I did not run parity. Counters render their true values in HTML (JS-off shows 95.6%, 3.02x, 2.0x, 11).

## Fixes (by impact)

1. **Kill the hydration mismatch** so the console has 0 errors and the red "1 Issue" badge is gone at both sizes. This is a DONE gate.
2. **Stack room overlap.** In the pinned "One stack" stage, keep the plate stack's bottom edge at least 24 px above the "HANZO / ARCHITECTURE MAP" caption. Cap the art at about 520 px tall at 801 px viewport height, or move the ZAP strip out of the art's column. Nothing may cross "MCP bridge · typed service communication" at any scroll position (proof 1).
3. **Phone hero first paint.** Render the hero art at its settled size (about 220 px wide, below the asks) from frame 0. No plate may intersect "Inspect the stack" (y 330 to 374) or the lede at any time from 0 to 1 s (proof 2).
4. **Closing band reveal.** Replace `blur(12px)` + opacity on the band h2 with the line-mask cut-in (translateY 105% to 0, 700 ms, ease-emphasis, 60 ms per line). Blur 0.
5. **Compress the lower document.** Merge the 323 to 367 px empty bands: section padding at most 116 px between reach, API, loop, open and proofs. Break the three equal-height sections (1,029, 953 and 963 px) by making one quiet (open source at about 480 px) and one loud (the API console pinned or full-bleed). Target 13 screens or fewer on desktop (now 18.0) and 18 or fewer on phone (now 23.6).
6. **Make the stack page's own.** `/security` already uses lit isometric plates beside numbered rows. Change `/platform`'s map so it reads as a map you zoom into, as the brief asks: the 11 layers as a plan view you zoom into on scroll (scale 1 to about 2.5, one layer filling the stage), not a second plate stack. Coordinate with the `/security` owner on who keeps plates.
7. **Idle life inside the pinned stage.** After 2 s at rest in the stack room, add one ambient mover so the stage is never a still: the lit pair breathes with a 4 s opacity 0.9 to 1, or a packet travels the ZAP line. Pause it under reduced motion. Today the screen is identical over 2 s at rest.
8. **Directory columns.** Lay the 7 groups out as a grid with explicit columns (AI + Compute | Data + Dev | Observe + Security | Network) so no group heading is separated from its items. At 1470x801 the whole directory plus the preview card's description must fit in one viewport (now cut off at y 801, proof 3).
9. **Hover gaps.**
   - Give the directory group heads ("01 AI →") and the API endpoint rows the same white row fill the item rows use.
   - Give "Inspect the stack" more than a border shift: the ink underline or an arrow nudge of 4 px.
   - Change the intelligence rows to transform the content instead of transitioning `padding`.
   - Remove `opacity: .88` on the header ask's hover.
10. **Eyebrow above the h2.** Move "SELECT A LAYER" below "One stack. Down to the kernel." as a caption, or into the right column beside the search field, so nothing sits above the headline.
11. **The empty search pill** in the stack room (about 280x44, top right) needs a visible placeholder or label from the page's existing strings. Otherwise it reads as a dead box.
12. **Chapter tabs.** Keep "01 Compute … 06 Pricing" on one line at 1470 (now "06 Pricing" wraps under the row). Reduce the gap to 17 px or let the row span the 8-column width.
13. **The ask.** A System page's one action is the sales ask. Put Hanzo's existing sales label in the header and the closing band (as `/enterprise` does), keeping "Start building" as the quiet secondary. On phone the header must show the same label as desktop after the hero (now "Try Hanzo" all the way down).
14. **Repeated figures.** 95.6%, 3.02x and 2.0x each appear 3 times. Keep each at hero size once (the proofs section) and set the other two instances as 13 px captions.
15. **Hero plates.** Drop the large blurred grey floor shadow under the plates (or cut it to under 40% of its size). The art should read as line art on paper, not a floating glowing card.
