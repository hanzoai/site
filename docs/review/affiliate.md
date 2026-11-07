# /affiliate — James-eye review

Verdict: 7/10
First complaint: "When it loads there are two black buttons fighting each other, Try Hanzo up top and Apply, and once the link has typed itself out the top just sits there dead."

Walked 2026-11-07, HEAD fc1860fc, at 1470x801 and 375x812 (touch). First screen sampled at 0.2/1/3/6 s plus 1.5 s idle after, and a reload; full scroll in 200px notches with dwell; hover/press on Apply, the links and the copy button; tapped/clicked all three rule tabs; solid-fill timeline polled every 150 ms for the first 6 s; reduced motion and JS off; taste.py and parity.py run.

## What works
- One idea, clearly told: the referral link. The hero types `https://hanzo.ai/?aff=` then drops a black `<code>` chip; it moves inside 1 s at both sizes.
- "How it works" is a real pinned stage on desktop: the steps on the left advance a 4-dot rail while one card on the right changes (POST/email, review, `<code>` + link, org attributed), `01 / 04` counter. On phone it becomes a snap rail with a peek. One in, one out.
- Black room: three rule tabs (first touch / one affiliate per org / never your own) each redraw an SVG diagram; they respond to click and tap, and auto-advance when left alone. Good idle + state motion beside the scroll motion.
- Closing band in Hanzo's words ("Apply to become an affiliate." + Apply + referral link). The header ask relabels to Apply and goes outlined while a page Apply is on screen; on phone the header keeps Try Hanzo and goes outlined while the page's Apply is visible.
- Apply hover changes fill (#0a0a0a to graphite), press scales to 0.98, no opacity fade. Copy button swaps to a tick and copies exactly `POST /v1/affiliate/apply`.
- taste.py OK; parity text 15/15 (the one "missing" link is Cloudflare's email-protection rewrite on the captured live page; the page links hello@hanzo.ai directly). No horizontal scroll; reduced motion shows the final state with 0 running animations; JS off reads in full.

## The 11 answers
1. Sells in 5 s, yes: headline, one-line lede, Apply, and the link typing itself. Moves within 1 s, yes. But at desktop the first screen is pixel-identical from ~3 s onward: one-shot typing, then dead.
2. Yes, mostly: hero, pinned stage, black room, band. Not a document.
3. Yes: typed URL, stage card, SVG diagram, band ask. The hero's top-left quadrant is empty air above a bottom-aligned h1; it reads sparse rather than staged.
4. One ask in Hanzo's words (Apply, `data-cta="affiliate.hero"`), nothing floating over content. But for roughly 1–1.3 s after paint (desktop ~1.9–2.9 s, phone ~1.6–3.1 s) both the header ask and the hero Apply are solid black: two solids at once before the header flips to outlined. Scale: h1 52px, yet the mono URL strip just below is larger than the h1, so the first screen has two big things.
5. Yes: Apply, links, copy, tabs all answer; no jumps observed.
6. No overlaps or clipping at either size; no font swap or shift seen. Cookie card and dev badge are shared chrome.
7. Apple-ish: pinned stage where one panel changes; motion.dev-style tab diagrams. The reference motion is there.
8. Yes: typed link as hero object and a node diagram room are its own, not a template.
9. Mostly covered (one h1, `data-cta`, pinned stage, band, reduced motion, JS off, copy equals display). JS off loses the diagram's connecting curves (nodes only), and the phone hero puts a plain `hello@hanzo.ai` link with the same mailto right under Apply.
10. No banned hues, gradients or 3-box rows. Borderline: the "AFFILIATES" mono caption ends the hero strip and on phone sits ~100px above the "How it works" h2, so it reads like an eyebrow over that heading.
11. Copy untouched per parity.

Shared (not counted): one intermittent hydration-mismatch console error on the first walk (red "1 Issue" badge), not reproduced in 4 further loads; nothing pointed into Affiliate.jsx.

## Fixes (in order)
1. One solid at a time from the first paint: the header ask must render outlined on this route from the server (the page already marks `data-ask-name` on `<main>`), not flip after hydration.
2. Keep the first screen alive after typing: e.g. let the `<code>` chip cycle or the caret keep blinking, a quiet idle loop tied to the link, stopping under reduced motion.
3. Rebalance the hero scale: the URL strip should not out-size the h1 at rest (start it smaller and let it grow as the moment, or settle it to the 44px step), and fill the empty top-left so the hero feels staged.
4. Move or separate the "AFFILIATES" caption so it never reads as an eyebrow over "How it works", especially on phone.
5. JS off: draw the black-room diagram's curves statically in the server HTML.
6. Phone hero: give the hello@hanzo.ai line its own role (or drop the duplicate mailto beside Apply) so two adjacent targets don't share an href.
