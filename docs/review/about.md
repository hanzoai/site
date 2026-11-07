# /about — James-eye review

Verdict: 7/10
First complaint: "After the chart it turns into a pile: four switches, then six grey cards with the same little spider chart, then three giant numbers. That's the overload again. One thing in, one thing out, please."

Walked 2026-11-07 16:45–16:55, HEAD e205a1f6, at 1470x801 and 375x812 (touch). I took first-screen frames at 0.2/1/3/6 s plus a reload, then scrolled the whole page in 160px wheel steps with dwell. I hovered and pressed the primary, the hero pause, the four switches, a principle card (opens a dialog, Esc closes it), the Zen list, the dark-room tabs, the model cards, the paper rows, the careers rows and the Band ask. On phone I tapped the switches, a card, the Zen list and the tabs. I also checked reduced motion and JS off. taste.py OK (3 files). parity.py /about: text 167/167, links 36/36.

## What works
- The hero sells and moves. The h1 cuts in by 1 s, and the Pareto curve draws 2014 to 2026 over about 5 s. The Techstars '17 marker lands on it, the four axis labels fan out and it settles. It has a 44px pause control (aria-pressed toggles). It's a real, page-specific object, not the home trick.
- Every control answers. The primary darkens on hover and scales to 0.98 on press, with no fade. The switches flip aria-checked. A principle card opens a dialog with "02 / 06" and prev/next, and Esc closes it. The Zen list drives a pinned panel ("01" to "06" with a progress line). The dark-room tabs swap state. A careers row hover redraws the frontier curve. The Band ask brightens on hover.
- Real objects in most sections: the frontier chart, the radar figures, the count-up figures (95+ to 100+, final value in the HTML and under reduced motion), founder contour tiles, a live commits ledger in the black room, 4 model media cards together, the papers list and the careers curve.
- One ask: "Try Hanzo" in the header becomes a solid "Get Started" once the hero ask leaves. Nothing of the page's own floats over content.
- Reduced motion shows the final chart and figures, with 0 running animations. JS off is legible at both sizes, with no hidden h1, h2 or p.
- No page console errors or pageerrors at either size. No horizontal scroll.
- Shared (not counted): the consent card (it covers the hero ask on phone until dismissed); a hot-reload parse error from `components/pages/Brand.jsx`; font-preload warnings.

## The 11 answers
1. Yes. The h1 and the drawing curve are moving within 1 s, and the first screen says who and why. On phone the chart is cropped to 2020 to 2026, so for the first second or so the chart band is empty. The Techstars '17 marker and the Intelligence and Speed labels never appear on phone.
2. Partly. The hero to Why and the Zen pinned panel are one-in-one-out. The middle is a document: Why runs 1934px on desktop and 2293px on phone (switch row, then 6 cards). Then the track record (3 figures, 4 milestones, a paragraph, 3 links) is all at once.
3. Yes, with one weakness. Six near-identical radar charts repeat one object six times. One Hanzo Engine model card is a contour fallback rather than media.
4. One ask in the header, nothing floating: yes. Scale rhythm: mostly. But the track-record screen puts 95+/$1B+/2024 at about 112px side by side, so everything is big at once there (resting figures should be 64px).
5. Yes for the primary, the switches, the cards, the Zen list, the tabs, careers and the Band. The model cards lift with a drop shadow (a tile taking a shadow). "View Model Catalog" and the paper rows show no visible hover change beyond the arrow.
6. No overlap or layout shift seen at either size. Founder link rows wrap unevenly ("Website X GitHub" then "LinkedIn" alone, with irregular gaps). Phone text links are 21px tall: Our History, Open Source, Start Building, Read Our Full History, Customer Stories, Explore the full Zen manifesto, View Model Catalog, Papers, Blog. They are under the 44px target.
7. Closest to osply/hamol editorial (asymmetric 8/5 heads, mono captions), plus the anthropic-launch "story with a figure". The authored motion is there: the curve draw, count-ups, the pinned Zen panel, cards opening. The middle lacks the editorial restraint.
8. Yes. The frontier-curve hero and the careers curve echo are this page's own signature.
9. Mostly evident: one h1, `data-cta` on hero and Band, `Band` close, a black room as a rounded card, a pause control, reduced-motion final state, JS-off legible, a dialog with Esc. I can't confirm the rest from the walk.
10. No hue, no gradient text, no fading buttons, no eyebrow above an h1 or h2 (all mono labels sit below their h2). Borderline: three oversized figures at once.
11. Copy untouched (parity 167/167 text, 36/36 links).

## Fixes (in order)
1. Thin the Why section into one-in-one-out. Let the four switches drive one radar figure that changes, instead of six identical radar cards stacked. Or pin the cards so one comes in as one goes out. Keep every word, reachable through the existing card dialog.
2. The track-record figures: rest at 64px and let only the one in view grow, or stagger them in one at a time. Don't show three ~112px numbers side by side.
3. Phone hero: fit or rescale the curve so 2014, Techstars '17 and the four axis labels are visible at 375px. Right now the drawing starts off-screen and the milestone is lost.
4. Phone tap targets: give the inline text links a 44px hit area (padding or a pseudo-element) without changing their look.
5. Founder link rows: one even gap, all four links on one line or a clean 2x2.
6. Model cards: replace the hover shadow with a non-shadow answer (media drift or tilt within 2.5°). Give "View Model Catalog" and the paper rows a hover that tells you something (row fill or the date or kind shifting).
7. JS off: SSR the hero chart at its final state (it currently freezes mid-draw at about 2022).
