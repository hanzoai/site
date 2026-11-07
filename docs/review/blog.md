# /blog — James-eye review

Verdict: 7/10
First complaint: "On my phone the month chart runs off the edge. September, October and the All button are just cut off and I can't get to them."

Walked 2026-11-07 16:40 UTC, HEAD be078192, at 1470x801 and 375x812 (Playwright: first screen at 0.2/1/3/6 s cold and on a warm reload; 200px wheel or scroll steps with about 0.7 s dwell to the footer; hovered, pressed and tapped the masthead ask, cover index, image cards, contents rows, month bars, All 24 and pause; reduced motion; JS off; console, page errors and failed requests captured; taste.py and parity.py run).

## What works
- The cover turns itself. Six latest posts take the cover in turn, a hairline times the current one, the contour art redraws and a silver curtain crosses the plate. The first screen is alive with no input (3-6 s pixel change about 4% on desktop, 14% on phone) and there is a 44px pause control.
- Hanzo's own art carries section 2: the synthesis sphere, the Pareto ring and the Kai lattice. It is one big card and two medium ones, asymmetric, not 3 equal boxes. On hover the image scales 1.03, the title underlines and the arrow moves.
- The contents section earns its place. A 64px Air "24" leads into a month bar chart; tapping a month narrows the list and the count grows and settles. On every row the hairline draws in, and on hover the row's tag goes ink and its hairline slides out 8px.
- Scale has rhythm: 52px masthead, 32px cover headline, 26px section head, 64px figure, mono captions. Only one thing is big per screen.
- The tells are clean. `taste.py` reports OK (3 files) and there is no hue: colour comes only from Hanzo's art. The BLOG mono label sits inline before the lede, not above the h1. No overlaps at either size: the detector's hits are the cover's stacked slides, and only the current one is visible.
- Copy: `parity.py /blog` reports text 95/95 and links 29/29.
- Reduced motion shows the final state and `getAnimations()` is empty. With JS off, one cover story and the full contents are legible on desktop and phone.
- The band closes in a black room with "Every post" solid and "Read the docs" as text, then the footer follows with no gap.

## The 11 answers
1. Partly. Once it lands it sells: masthead, cover story and the turning plate. But the first second is weak. On a warm reload at both sizes, the masthead h1, lede and ask are missing for about 1 s (desktop is still blank at 1 s, the lede and ask arrive about 1.6 s on phone). Meanwhile the cover plate is an empty black box until the contour draws at about 1 s. On the cold phone load the 0.2-1 s pixel change was 0.
2. Mostly one-in-one-out. The cover gives way to the three art cards, then contents, then the band. The contents list is a list, as a blog index should be, and it shows one month at a time. On desktop, under "The Next Frontier Will Be Synthesis", there is a blank left column of about 300px while the right column carries on. It reads as a hole, not as room.
3. Yes: contour cover plate, Hanzo art cards, bar chart and big figure, black band.
4. Yes. One ask, "Read the latest" (`data-cta="blog.hero"`); the header carries it once the masthead ask leaves view, and nothing floats over content except the shared cookie card. Scale rhythm is good (see above). Minor: during the slow arrival the header swapped Try Hanzo, then "Read the latest" (solid), then Try Hanzo in the first 6 s. The masthead ask was still hidden, so the header briefly carried a second solid in the same screen.
5. Mostly. The cover index changes ink, presses at 0.98 and cuts to its story. Cards and rows answer (see above), and the ask darkens and presses. One glitch: on image-card hover the scaling picture shows a 1px square sliver past the rounded corner at the card's left edge (`.xbl-here-img` scale inside the radius box, BlogIndex.css:73-74).
6. No overlap on desktop. On phone there is clipping: in the contents head the month strip is 444px wide in a 343px column. The page's `overflow-x: clip` cuts off the Sep and Oct bars, and the strip does not scroll (scrollWidth equals clientWidth, 444). "All 24" is pushed to x 360-444, off-screen. Cause: `.xbl-allbtn { align-self: flex-end }` (BlogIndex.css:91) wins over the phone rule's column `align-items: flex-start` (line 146), and `.xbl-strip` takes its content width instead of the column width. No font swap and no horizontal page scroll seen.
7. A magazine front page, editorial like osply and hamol. Its cover is close to an Apple pinned stage where one panel changes. The turning cover, line wipe and drawn hairlines are actually there.
8. Yes. Its own hero medium (a self-turning cover with a contour plate) and its own signature (the publishing strip that narrows the contents). Neither is the home trick.
9. Covered as far as a walk can show. Header comment with Persona, Goal, CTA, Metric, Signature and Beyond; one h1; `data-cta` on the primary and the band; pause control; reduced motion and JS off; external links get `rel`. Breadcrumb is n/a at depth 1.
10. None seen. The Kai row tag goes `--acc` on hover; taste.py passes it.
11. Yes, parity 0 missing.

Console: on the "All 24" view the page logs "You're attempting to animate multiple children within AnimatePresence, but its mode is set to 'wait'" (BlogIndex.jsx:268, several month sections under one `mode="wait"`). It is a warning, not an error, but it is the page's own noise.
Shared (not counted): one intermittent hydration-attribute mismatch with the red "1 Issue" badge on 2 of about 8 loads. I could not pin the diff to this page's files and it did not recur on 4 targeted reloads, so it is treated as the known shared FooterHTML mismatch. Also a Bounty.jsx parse error from another page's hot reload, and an aborted `/models/kai.webm` fetch during navigation, which had no visible effect.

## Fixes (in order)
1. Phone contents strip (375): make the strip fit or scroll inside the column. Give `.xbl-strip-w` `min-width: 0; width: 100%` and `.xbl-strip` `max-width: 100%` so its `overflow-x: auto` actually scrolls with a peek. Drop `align-self: flex-end` on `.xbl-allbtn` under 900px (`align-self: flex-start`) so "All 24" sits at the left under the bars. Check that Sep and Oct can be tapped.
2. First second: put the masthead h1, lede and ask on screen at once (start the line-mask cut-in on first paint, not after hydration). Give the cover plate its contour as a static SSR frame, so neither the top of the screen nor the plate is empty for about 1 s. This also stops the header ask flipping while the masthead ask is hidden.
3. Image-card hover: clip the scaling picture to the radius, e.g. `isolation: isolate` or `clip-path: inset(0 round 20px)` on the art box, so no square corner shows during the 1.03 scale.
4. Desktop section 2: close the empty left column under the big card. Let the big card's caption sit lower or the right column end with it, so the screen does not end in a blank hole.
5. Remove the AnimatePresence `mode="wait"` warning in the All view: use `mode="popLayout"`/`sync`, or wrap the month list in one keyed child.
