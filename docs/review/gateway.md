# /gateway — James-eye review
7 Nov, round 3, walked at 1470x801 and 375x812 (phone with isMobile and hasTouch), plus 320 wide and prefers-reduced-motion at both sizes. Playwright in Chromium: frames at 0, 1, 3, 5, 7 and 9 s with no input; a wheel walk one screen at a time with 1.5 s dwells; hover and press on every main control on desktop, taps on phone; the cookie card dismissed before judging. No console errors at either size, with or without reduced motion. No hydration diff from this page. The Next.js dev portal is present but shows no issue.

Verdict: 6/10

First complaint: "On my phone the little window just sits on top of the writing. I'm reading half a sentence as it slides under a box. Then further down you show me the identity headers bit a second time. It's the same thing twice, and it feels like a document again."

## The 11 answers
1. **First screen sells in 5 s, and moves within 1 s? Mostly.** "Hanzo Gateway / The trust boundary in front of the API" sits over a self-running request diagram. It already moves at 0 s: the request card writes JWT, then X-Org-Id, and the token-bucket bars drain. That is the right idea. The composition is weak, though. The lede and buttons float top-right, higher than the h1, so the two are not bottom-aligned on the 8/5 split, and a dead band runs between them. On phone at 3 s the stage is an empty grey grid with the GATEWAY line and "Hanzo Cloud /v1", and the token-bucket chip is cut by the fold.
2. **One thing in, one thing out? In the middle, yes; at both ends, no.** The six chapters are a real pinned stage on desktop: one diagram changes per step, with 01 / 06 to 06 / 06 and a dot pager. Outside it the page reads as a list of blocks: Paste and ship, then Related capabilities, then a black room, then the console, then Get Gateway. Related capabilities is stranded mid-page with two full sections after it. The gaps between blocks are big, empty white bands; at 7200 px on desktop there is about 250 px of nothing.
3. **A real visual object in every section? Yes, but thin.** Hero diagram, chapter diagrams, prompt block, the black client/service panels, a console mock with a Building to Ready tick, and Sigil line art at the close. The chapter diagrams are sparse: two pills and a line inside an 820x530 window, with the top third of the card empty. The console section leaves its left 40% empty except a two-line caption at the bottom. It reads as "lazy" rather than quiet.
4. **One ask, nothing floating, scale has rhythm? Partly.**
   - The header ask switches to "Read the docs" on scroll, which is good.
   - On phone the pinned chapter card is a panel over content. As each chapter scrolls up, its heading and first lines pass under the sticky card. You see "before anything else reads the request." cut at the card's edge, and the "API key" pill in scene 01 is clipped by the card's left edge.
   - Scale is mostly fine: h1 52, h2 44, h3 32, body 16, Zen Mono captions. "Nothing downstream has to ask who is calling" at 44px in four lines on phone is the one screen where type is everything.
5. **Every hover and press answers, no jumps? No.**
   - These answer: hero buttons (fill or inset), Copy, the Related cards (fill), the JWT / API key / curl tabs (fill, pill moves, panel changes), and Open in the console (inverts). Presses scale to about 0.97.
   - These measured no change on hover: the six chapter dots, the four console rows, the console sidebar's active "Gateway" icon, and the Deploy to Cloud and Self-host links (any change on a child arrow is too slight to register).
   - The four header toggles in the black room are native `<input type="checkbox">` styled as switches that nobody can use. They look like controls and do nothing.
   - No hover tells you anything: no number, no preview.
6. **Overlap, font swap or layout shift? Yes, overlap.**
   - In the desktop hero loop, the request card slides over the landed "checkout-web X-Org-Id ✓" and "payments-api" chips, and its "✓ JWKS" stamp sits on top of "X-Org-Id ✓" (frame at about 9 s).
   - The phone sticky card covers chapter text (see 4).
   - At 320 the hero request card is pushed off the left edge, so "api.hanzo.ai" reads "i.hanzo.ai" and JWT reads "T".
   - No font swap seen; the h1 box holds.
7. **Which reference, and is its motion there?** Apple product page: a pinned stage where one panel changes, and that is present on desktop. Nothing from synchronized.studio, osply or hamol: no pointer-aware detail, no tilt, no magnetic ask, no count-up, and no headline cut-in seen at load. Motion mix: idle hero loop, scroll-pinned stage, tabs, a console tick. There is no pointer motion at all.
8. **Different from its neighbours?** The hero medium (a live request crossing a trust line) is its own. The chapter window with "api.hanzo.ai" in a traffic-light frame plus a dot pager is a generic device that other cloud pages are likely to share. I could not confirm this without walking them.
9. **All 18 parts covered? No.** Proof and trust are thin: nothing beyond "Apache-2.0" and a GitHub chip. The console section has no heading. The close repeats the hero ask. Mobile fails part 11 because of the covering sticky card.
10. **Banned tells:**
    - A panel covering text on phone.
    - Overlap in the hero loop at 1470.
    - Browser-default checkboxes passed off as switches. They are restyled, but they are still dead native inputs.
    - No hue (monochrome throughout), no gradient text, no eyebrow above a headline.
11. **Copy untouched? Mostly.**
    - All sentences trace to `content/live/gateway.json` and `content/pages/gateway.html`.
    - The diagram labels are fragments cut from Hanzo's sentences: "STRIPPED", "EVERY SERVICE BEHIND IT", "the service that issued them", "the process is up", "backends / dialed lazily", "client IP", "the edge", "health", "/v1 mount table", the JWT / API key / curl tabs, and "X-User-Id ← sub". That is borderline: they are Hanzo's words recombined as UI.
    - The black room repeats chapter 02's heading and body word for word, which adds content the live page has once.

## Fixes, in order
1. **Phone chapters:** stop the sticky card from covering text. Either pin the card and swap only the caption under it, so the text never scrolls beneath it, or unpin on phone and let each diagram sit above its own heading. Inset scene 01 so the "API key" pill is not clipped.
2. **Hero loop overlap:** keep the request card's path clear of the landed chips (stack the landed chips higher, or fade them before the card crosses). Never let "✓ JWKS" sit on chip text. At 320, keep the request card inside the stage.
3. **Delete the black-room repeat** of "Identity headers are written, not trusted", or make it chapter 02's opened detail (a card that opens into it) rather than a second section with the same words. If kept, make the four switches real (they toggle what reaches "every service behind it"), or render them as non-control shapes.
4. **Order:** move Related capabilities to just above the footer, after Get Gateway, or merge it into the close. Paste and ship and the console should sit next to each other as the "use it" pair.
5. **Hover answers:**
   - Chapter dots: fill or grow on hover, and show the chapter title as an inline label (not a browser tooltip).
   - Console rows: row fill, and reveal "Ready" or "Building" detail.
   - Deploy to Cloud and Self-host: the arrow moves 4px.
   - Make one hover tell a number, for example the token bucket showing remaining tokens.
6. **Add one pointer motion:** tilt to 2.5° on the chapter window or the hero stage, or a magnetic primary ask. Add a line-mask cut-in on "Nothing downstream has to ask who is calling".
7. **Fill the empty stages:** scale the chapter diagrams to use the window's height (or shrink the window to the diagram), and put the console caption beside the console, bottom-aligned on the 8/5 split, instead of under 350px of white. Pull the 250px dead bands between sections back to the section padding.
8. **Hero layout:** bottom-align the lede and buttons with the h1 (8/5 split, heading left, lead right). On phone, keep a request in flight at all times so the stage is never an empty grid at 3 s.
