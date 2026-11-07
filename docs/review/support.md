# /support/: James-eye review
Verdict: 7/10
First complaint: "Why does the button up top keep changing? I'm not touching anything and it flips from Try Hanzo to a black Open Help Center and back. Now there are two black buttons fighting."

Walked 2026-11-07 17:10 UTC on the dev server at 1470x801 and 375x812, moving. I watched the first screen for 14 s untouched, did 4+ fresh cold loads, hovered, pressed and typed in the search, and ran parity.

## The 11 answers
1. **First screen sells; motion inside 1 s: mostly.**
   - "How can we help?" sits at 52px with the search, the panel and 6 rows all above the fold. It reads in 2 s.
   - The search types itself at about 1.7 s ("sup", then "support ticket", with the matches underlined in the panel copy, then "uptime" switching the panel to System Status). By 10 s it settles back to the placeholder and the pause control goes away. This is a good Utility delight, and it is the only one.
   - Main is blank (header only) until hydration. Raw frames at about 1.0 to 1.3 s show an empty page, and the h1 is still mid cut-in at about 1.5 s. Nothing in main moves in the first second on dev.
2. **One in, one out:** the page is short (2,639px desktop, 3 stops): hero, black closing band, footer. That suits Utility, and the band headline cuts in word by word. It reads as a tool, not a document.
3. **Real object per section:** the hero has one, the live search plus the panel that answers it. The band has none: a headline and 7 buttons.
4. **One ask, nothing floating; scale rhythm:**
   - Bug: the header ask changes on its own. Sampled every 450 ms over 4 cold loads, it reads "Try Hanzo" (quiet), then at about 1.2 s "Open Help Center" (solid #0a0a0a), then quiet again. From about 7.1 to 9.5 s it is solid "Open Help Center" again, while the panel's own solid is on screen. That makes 2 solid fills and a label swap with no input. Typing "billing" or "zzqx" does the same: header "Open Help Center" plus the panel's "Email support@hanzo.ai". The header seems to treat the hero ask as "left view" whenever the panel swaps its button.
   - Scale is fine: h1 52, panel title 32, rows 26, lede 21, body 17. One big thing, with room around it.
   - Shared, not this page: on phone the header "Try Hanzo" is always solid, so it sits beside the panel's solid "Open Help Center".
5. **Hover and press answer:**
   - Row hover indents the row, inks the title and arrow, and swaps the panel to that destination. That is a real preview.
   - Row press: scale 0.982. Panel primary: hover #0a0a0a to #262626, press scale 0.98.
   - Band pills: hover adds white 10% fill and the border goes from 16% to 40%. No jumps seen.
6. **Overlap, font swap or shift:**
   - No overlap at either size and no horizontal scroll (375 scrollWidth 375).
   - The panel grows about 7px when the "billing" query line appears. Nothing below it moves.
   - **Red badge:** a hydration mismatch on the search input (`placeholder={undefined}` on the client vs "support ticket" on the server). It was logged on 3 of 7 fresh loads with full text, and the dev "1 Issue" badge was present on 4 of 4 dedicated loads.
7. **Reference:** apple.com-style calm utility. The self-running demo is the motion.dev "live demo that runs itself" pattern done properly: it starts by itself, can be paused, and ends at rest.
8. **Distinct:** a self-typing search that drives a preview panel. I have not seen this on neighbours. Its hero medium (input plus panel) differs from a form page.
9. **18 parts:** h1, label-for on the search (it reuses the h1 text), a pause control during the demo, 44px+ tap targets in main on phone (pills 44, rows 64, input 54), the closing Band and the footer are all present. Not met: one solid fill per viewport (see 4) and no console error (see 6).
10. **Banned tells:** none. There is no eyebrow above the h1, no hue, and no glow. The panel is a thin-outlined tile, not raised.
11. **Copy:** `parity.py /support`: text 24/24, links 6/6, OK.

## Fixes (in order)
1. **Fix the header ask.** It must not change label or fill while the hero panel swaps its button. Keep it on "Try Hanzo" (quiet) for as long as the hero panel is in view. Today the solid header "Open Help Center" appears with no input at about 1.2 s and from about 7.1 to 9.5 s, and on every query.
2. **Remove the hydration mismatch.** Render the same `placeholder` on server and client for `#xsp-q`, and let the demo clear it after mount. Then confirm 0 console errors and no "1 Issue" badge on 4 cold loads.
3. **Show the hero before hydration.** Main is empty for more than 1 s on a cold load. Start the h1 line-mask from CSS (or show the final state under `html:not(.js)` and while JS is pending) so that the h1, search and panel paint with the first HTML. Start the demo at about 0.6 s, not 1.7 s.
4. **Make the band quieter.** The 6 outlined pills repeat the 6 rows above word for word, giving 7 equal-weight buttons in one viewport. Keep the links but set them as one hairline text row (13px, ink, 1px underline), so the white "Email support@hanzo.ai" is the band's only button.
5. **Small polish:** during the demo, rows reorder (Email us jumps to slot 2 at about 5 s, then back), but a real query does not reorder them. Pick one behaviour, ideally no reorder, with the matched row highlighted in place.
