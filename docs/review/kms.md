# /kms — James-eye review

Verdict: 6/10
First complaint: "The top's good, the vault actually does something, but then it's five screens of grey text with a number ticking in the corner. Nothing to look at, nothing moving, it's a document again. And on my phone the whole page jumps every few seconds."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812 (full scroll walk with the recorder at both sizes, all 14 desktop and 16 phone stops, a vs b idle frames, 14 hovers, 3 clicks; my own probes: screenshots every 120 to 300 ms for the first 3 s, vault and page-height sampling every 300 ms for 9 s, hover and press computed styles on the hero ask, a 60-stop Tab crawl, reduced motion, JS off, 375x667 fold, frame-by-frame scroll through the pinned numeral, and the neighbouring /iam, /authz and /cloud/secrets heroes for comparison).

Frames: `kms/desk-hero-version-gap.jpg` (the vault at 3 s: an empty slot opens between v3 and v2 and the card grows), `kms/desk-chapters-empty.jpg` (the six rules: a numeral and text on grey, nothing else), `kms/phone-getkms-art-over-lede.jpg` (the closing art's contour lines run through "Secrets + key management").

## What works
- **The hero object is real and specific.** The vault seals `DATABASE_PASSWORD` through Argon2id, HKDF-SHA256 and AES-256-GCM, rotates to v4, refuses a stale writer ("write replaces v3 · refused") and logs the agent read. It is the product's own story told as a running demo, with a pause control. It is the page's best idea.
- **"Seal one yourself" is a real Beyond.** Typing into the field produces real AES-256-GCM ciphertext and IV through WebCrypto, and the copy says honestly that Argon2id is not run in the browser.
- **The first second moves.** The h1 cuts in by line (screen hash changes at 413, 791 and 1043 ms), and the vault starts sealing at about 1.8 s.
- **The hero ask is right.** "Open KMS" is solid, 44px tall, `data-cta="kms.hero"`. Hover darkens the fill and press scales to 0.98. The header ask swaps from "Try Hanzo" to "Open KMS" once the hero ask leaves view on desktop.
- **The basics are clean.** No horizontal overflow at either size. Parity is 87/87 text and 12/12 links. `taste.py` passes. Reduced motion lands on the final vault state (v4 ciphertext, 3 log lines, `getAnimations()` empty at 3 s). The Tab crawl shows 0 invisible stops and a 2px ring on every control.
- **It differs from its neighbours.** /authz has a left h1 over a policy console, /cloud/secrets has a giant word over Sigil contours, and /iam has a token card above the h1. KMS has a centred h1 over a split vault card.

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes on desktop: "Hanzo KMS", "Secrets management", Open KMS and the vault are all above the fold (h1 52px at y192, ask at y274 to 318, vault from y403). The h1 cut-in moves before 1 s. On phone at 375x812 the h1 is 40px, the ask ends at y313 and the vault starts at y372, so 80px or more of product is inside 660px. At 375x667 the ask ends at y313, above the fold. One weak spot: the lede "Secrets management" sits inline beside the buttons, so it reads as a button label more than a lede.
2. **One thing in, one out, or a document?** It turns into a document after the Seal section. "What it holds and how it holds it" runs six rules at `min-height: 62svh` each, about 3,000px of desktop scroll (screens 02 to 06). Each screen has the same pinned title, the same pinned lede, a 112px outlined numeral and one paragraph on `#fafafa`. The recorder marks screens 04, 05, 06 and 07 as completely still (idle diff 0 bytes), and the phone has 10 of 16 stops still. The numeral roll is the only thing that happens, and while it rolls the old and new digits overlap for a frame (01 and 02 crossfading at 50%), which looks muddy rather than cut. Above the six rules there is also about 300px of dead white before "Seal one yourself" (screen 01).
3. **A real visual object in every section?** No. The hero (vault), Seal (crypto box), dark room (CLI `CodeBlock`), project (Console) and Get KMS (contour art) each have one. "What it holds" (the longest section) has none: a numeral is not an object. The four-figure strip in the dark room ("AES-256", "K8s", "Every read recorded", "MIT") is four equal type tiles with no object.
4. **One ask, nothing floating; scale rhythm?** Mostly. The sticky header carries the ask and nothing page-owned floats. The rhythm breaks in two places:
   - The dark room's figure row puts four 52.9px figures in four equal columns (`.km-figs`, `repeat(4, 1fr)`), so everything is big at once and the row reads as four equal boxes.
   - In the same room "Open KMS" and "View on GitHub" both render as white filled pills (`kind="quiet"` resolves to a white fill on black), so there are two equal solid buttons in one viewport.

   The 112px pinned numeral is the "big thing" for five screens running, so it never grows or settles. On phone the header ask stays "Try Hanzo" for the whole page and never becomes "Open KMS" (shared chrome).
5. **Every hover and press answers, no jumps?** Partly.
   - The hero ask darkens on hover and presses to 0.98.
   - Documentation's computed background, transform and opacity do not change on hover; only a faint fill is visible in the hover frame.
   - The six rule rows have no hover at all: their background stays `rgba(0,0,0,0)`.
   - "Open in the console ↗" and the Console title bar showed no style change in the walk.
   - The hover fill on the hero ask is `rgb(44,44,46)`, which is not a deck value (shared `Cta`).
   - The vault itself jumps; see 6.
6. **Overlap, font swap, layout shift?** Yes, the hero object shifts layout, and it is the worst defect on the page.
   - Desktop: when v4 arrives, the `layout` animation on `.km-ver` opens an empty slot between v3 and v2. The vault grows from 380 to 394px and the Seal section moves from y906 to y919, then back. You can see it at 3000 ms (frame `kms/desk-hero-version-gap.jpg`: the card bottom drops about 14px).
   - Phone: the vault height cycles 581, 668, 606, 632, 642 and back to 581px. Everything below it moves by up to 87px on every loop (`.km-seal` top 1015 to 1100), forever, while you are reading.
   - The recorder measured CLS of 0.023 on desktop and 0.020 on phone. That is over the 0.02 target, and it keeps adding up while the demo loops.
   - On phone the Get KMS contour art runs straight through the lede "Secrets + key management" (frame `kms/phone-getkms-art-over-lede.jpg`).
   - I saw no font swap: the h1 box sits at y192 at every sample.
   - The phone walk logged one hydration error with a red "1 Issue" badge. It is the shared FooterHTML mismatch plus an input `style` diff on `#km-in` (`caret-color: transparent`, which the page source does not set). I could not reproduce it on two fresh loads at either size (0 console errors), so I am not counting it, but it should be watched.
7. **Which reference, and is its motion there?** It wants to be an apple.com product page: the product as hero and a pinned scene where one panel changes. The hero demo delivers that. The pinned section copies the shape of an Apple pinned scene without the substance: on Apple the pinned panel changes picture, and here only a digit changes. There is no pointer motion at all (no tilt, magnetic ask or hover preview), so the osply/hamol "pointer-aware details" are missing. The page has arrival, idle, scroll and user-input motion, and no pointer kind.
8. **Different from its neighbours?** Yes. It has a centred h1 and a split vault card, against /authz (a left h1 over a policy console), /cloud/secrets (a huge word over Sigil) and /iam (a token card above the h1). Its lower half shares `Console`, `ShipPrompt` and `GetIt` with the same neighbours, which is acceptable as shared system. The six-rule pinned numeral is the only thing between the hero and that shared tail, so the middle of the page is where KMS needs its own moment.
9. **All 18 parts covered?** Not as walked. These gaps showed:
   - Part 3: JS off hides the lede "Secrets management" at `opacity: 0`, because the `v2-in` class has no `html:not(.js)` fallback.
   - Part 3 rhythm: the six rules make 6 near-identical quiet screens in a row.
   - Part 7: "Sealed before it leaves you" is an eyebrow directly above the h2 "Seal one yourself".
   - Part 7 tokens: literal hex and shadows in `Kms.css` (`#fff`, `#0a0a0a`, `#f5f5f7`, `rgba(115,115,115,.45)` shadows).
   - Part 8: the `#km-in` focus state is a pale `rgba(212,212,212,.25)` halo with `outline: none`, not the one 2px ink ring.
   - Part 10: CLS is over 0.02.
   - Part 12: the vault loop moves content, and its pause sits after the vault in the visual flow on desktop (it is first in the DOM, which is correct).

   Parity, `data-cta` on the primaries, the one h1 and the skip link are fine.
10. **Banned tells?** One clear tell: an eyebrow directly above a headline ("SEALED BEFORE IT LEAVES YOU" over the h2 "Seal one yourself"; `.v2-kick` immediately followed by the H2). There are also four equal boxes of big type in a row (the figure strip) and two equal solid buttons in the dark room. There is no hue: `#f5f5f7` is off-deck but not chromatic. The file header still says "Accent: gold", which is stale but not rendered.
11. **Copy untouched?** Yes. Parity is 87/87 text and 12/12 links. The rule text, CLI and figures match the page data. The only oddity is that "Sealed before it leaves you" appears twice: as the Seal eyebrow and as rule 01's h3.

## Fixes (in order)
1. **Stop the vault from changing height** (`components/pages/cloud/Kms.jsx` `Vault`, `Kms.css`). Give `.km-vers` a fixed height of 3 rows and `.km-log` a fixed height of 3 lines (`min-height` plus `overflow: hidden`). Drop `layout` from the `.km-ver` motion divs, or use `mode="popLayout"` on that `AnimatePresence`, so v4 slides in and v1 leaves without opening a slot. Position `.km-stale` so it never adds height. On phone, fix `.km-val` to two lines (`min-height: 2.4em` already exists, so also set `height` and clamp it), because the 32-char hex wraps differently from the dots. Target: vault height constant across a full loop, and CLS under 0.02 at both sizes.
2. **Give "What it holds" a real object and cut its length** (`Holds`, `.km-rule`). The pinned left column should hold something that changes per rule, built from the vault you already have. Rule 01 shows the seal chain lighting up, 02 a `kms run` env line, 03 the refused stale write, 04 the append-only log line with the agent's name, 05 the CLI, Go, Node and Python chips, and 06 a "will not boot" line. The numeral becomes a small `01 / 06` caption. Drop `.km-rule` from `62svh` to about `44svh` so the section is about 2 screens, not 5. Add a row hover or focus state (a hairline fill per part 8). Make the numeral (or caption) cut in by mask instead of crossfading two outlined digits over each other.
3. **Remove the eyebrow above the h2** (`Seal`). Move "Sealed before it leaves you" below "Seal one yourself" as a caption, or drop the `v2-kick` there, since rule 01 already carries those words as an h3. Do the same check for "Example project" over its title.
4. **Fix the dark room's scale and buttons** (`.km-figs`, the `km-disk` acts). Make one figure the moment, for example "Every read recorded" at size and the other three at 26px, or count them in one at a time instead of four equal 53px tiles. Make "View on GitHub" a text link (or the outlined quiet style on dark) so only "Open KMS" is filled. Let the black room enter as a rounded card inside the gutters and open to full width (part 3.1 rooms).
5. **Close the dead white** above "Seal one yourself" (about 300px at 1470). Tighten `.km-hero`'s bottom padding and the Seal section's top so the next section peeks within 56px of the hero vault.
6. **JS off:** give the hero lede (`.v2-in`, `animationDelay .3s`) an `html:not(.js)` rule so "Secrets management" is visible without JS. Request it in `docs/requests/kms.md` if the rule must live in shared CSS.
7. **Add one pointer moment** so the page is not scroll plus idle only. Use a 2.5 degree tilt on the vault card on fine pointers, or a magnetic Open KMS. Neither should run under reduced motion.
8. **Tokens and focus** (`Kms.css`). Replace literal `#fff`, `#0a0a0a` and `#f5f5f7` and the hand-rolled shadows with `tokens.css` values (`#f5f5f7` is not on the deck: use `#f5f5f5` or `#f7f7f7`). Give `#km-in` the standard 2px ink focus ring with a white halo. Remove the stale "Accent: gold" lines from the file header and the CSS comment.
9. **Phone closing art** (`GetIt` usage). Keep the contour art clear of the lede at 375. Pass a seed or offset that keeps it right of the text, or request a text-safe area in `components/v2/GetIt` via `docs/requests/kms.md`.
10. **Shared chrome, not scored:** on phone the header ask stays "Try Hanzo" instead of the page's "Open KMS". On desktop the header glass shows the hero card's blur under the left nav (screen 01), and the header was caught mid-drop at y67 on one stop (screen 09). Raise these with the Chrome owner.
