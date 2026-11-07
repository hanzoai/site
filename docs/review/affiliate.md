# /affiliate — James-eye review

Verdict: 8/10
First complaint: "Once the link has typed itself, the top just sits there with a blinking cursor. The left half under the headline is empty space. Give that first screen one more live thing."

Walked 2026-11-07 16:58 UTC, HEAD 2e13f7ee, at 1470x801 and 375x812 (isMobile, touch). First screen at 0.2/1/3/6 s plus a reload. Scrolled the page in 200px (desktop) and 160px (phone) notches with dwell. Hovered and pressed every control in main, clicked the step dots and rule tabs, used Copy and read the clipboard. Checked idle frames on the hero, the pinned stage and the rule diagram. Also checked reduced motion and JS off on desktop and phone. taste.py OK. parity 15/15 text and links 2/3: the missing link is Cloudflare's `/cdn-cgi/l/email-protection` rewrite of hello@hanzo.ai, so the copy is intact.

## What works
- The pitch is clear in 5 s. "Refer customers to Hanzo" cuts in by line mask. The lede and a solid Apply sit to the right, and `https://hanzo.ai/?aff=<code>` types itself out underneath within about 1 s. The link is the product, shown as the hero object.
- The hero is not dead after typing. The caret keeps blinking, the `<code>` chip wipes again every 5 s, and the link line tilts with the pointer. These are small motions, but they are there.
- "How it works" is a real pinned stage (01 / 04 to 04 / 04). The left text swaps as the right panel changes: the POST chip and hello@ card, the application arriving, `<code>` with the URL, then the org pill "attributed to you". This is one thing in, one thing out. Clicking a step dot scrolls to that step.
- The dark rule section is the page's moment. The tabs (first touch / one affiliate per org / never your own) cycle on their own when idle, and each one redraws a monochrome SVG diagram. Clicking a tab switches it, and the selected state is clear.
- Copy works: the button reads "Copied" and the clipboard holds exactly `POST /v1/affiliate/apply`, as displayed.
- Pressing Apply scales it to 0.98, and on phone the press reveals `hello@hanzo.ai` under the button, so the hand-off tells you where it goes.
- The palette is ink and greys only, and the type is Zen / Zen Mono. There is no horizontal scroll at either size: phone scrollWidth is 375, and the step rail is a contained scroll-snap strip.
- Reduced motion shows final states. With JS off, the four steps lay out as a 2x2 of finished panels and the diagram is drawn, so the page is fully legible.
- The page and Band both end on Apply, with "A referral on its own pays nothing." as the quiet secondary line.

## The 11 answers
1. Yes. It sells in 5 s, and the h1 cut-in plus link typing move within 1 s. After about 3 s only the caret, the 5 s re-wipe and the pointer tilt are left. It is alive, but thin.
2. Mostly yes. Desktop has a pinned four-step scene, then the dark rule, then a Band. On phone the steps become a horizontal rail with dots. Scrolling down shows only step 01, and steps 02 to 04 need a swipe, so the phone loses the one-in-one-out story there.
3. Yes: the typed link, the stage panels, the attribution diagram, and the Band with Apply. The Band is a quiet closer, which is fine for the close.
4. Yes. Apply is the one solid fill. On desktop the header outline becomes a solid "Apply" once the hero ask leaves. On phone the shared kit keeps "Try Hanzo" in the header and adds a slim "Apply →" bar at the bottom. That is shared Ask.jsx behaviour, and it is hidden while the cookie note is open. Scale has rhythm: h1 52, link line about 44 mono, section heads 26, small mono captions.
5. Mostly. Apply, Copy and the inactive rule tabs answer on hover, and press is scale 0.98 with no jumps. The step dots 01 to 04 and the inline text links (hello@hanzo.ai in the step copy, "referral") showed no measured hover change.
6. None found. There are no overlaps at either size, no font swap seen, and the h1 box is stable. The shared cookie note covers the lower part of the stage until it is dismissed (shared chrome).
7. Apple product page: one idea per screen, a pinned stage that swaps panels, and a persistent ask in the header. The motion is really there.
8. Yes. The signature is the self-typing referral link plus the attribution diagram, which is its own object rather than a template hero.
9. Nearly. Every part I could check from the page holds. A proof strip does not apply (Hanzo has no proof copy here). I did not audit the coverage card.
10. None. There is no hue, no eyebrow or pill above an h1 or h2 ("AFFILIATES" is a caption below the link line), no 3 equal boxes, no gradient text, no Inter, and no fade-on-hover.
11. Yes. Parity has 15/15 text. The single "missing" link is the email-protection rewrite on the live capture.

Console: no errors from this page. Only warnings: willReadFrequently from the shared GL canvas, and font preload timing.
Shared (not counted): a hot-reload parse error from `components/pages/Brand.jsx:147`, a concurrent edit to another page, appeared once during the phone run. The cookie note sits over content until dismissed. On phone the header shows "Try Hanzo" while the page ask rides in the bottom bar (`components/Ask.jsx`).

## Fixes (in order)
1. Give the desktop first screen one more live element in the empty area left of the lede and under the h1. For example, let the typed link sit higher and larger as the hero object beside the h1, or have `<code>` cycle through example codes instead of just re-wiping. This should come from motion and placement, with no new copy.
2. Phone "How it works": tie the rail to vertical scroll (pin and advance), or auto-advance it once in view, so steps 02 to 04 arrive without a sideways swipe. Keep the dots in sync.
3. Add a hover answer to the step dots (fill or grow to the next state, or show the step number) and to the inline text links (thicker underline or offset change), so every hover answers.
