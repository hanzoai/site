# /affiliate — James-eye review

Verdict: 7/10
First complaint: "On the phone the code box is snapped in half: the POST chip is cut off at the edge and the next line starts with a comma. And once the link has typed itself, the top just sits there."

Walked 2026-11-07 16:27, HEAD 25bddc77, at 1470x801 and 375x812 (isMobile, hasTouch). First screen captured at 0.2/1/3/6/7 s plus a reload; whole page scrolled in 200px wheel notches (desktop, 0.7 s dwell) and 200px steps (phone); hovered and pressed every main control; clicked Copy, the 01-04 chapter dots and the three rule tabs; idle-watched the dark room for 5 s; a keyboard Tab crawl; reduced motion and JS off at both sizes. taste.py: OK (2 files). parity: text 15/15, links 2/3 (the one "missing" is Cloudflare's email-protection rewrite on the captured live page; the page links hello@hanzo.ai directly, so it doesn't count). Console errors, page errors, failed requests: none on either size.

## What works
- The idea is clear and it's this page's own: the affiliate link `https://hanzo.ai/?aff=<code>` at 64px mono is the hero object. It types itself (pixel change 2.6% from 0.2 to 1 s, then 4.3% from 1 to 3 s) and then the `<code>` gets marked in ink. It leans toward the pointer.
- The h1 cuts in by line mask. It rests at 52px, and the h1, lede and Apply all fit the first screen at both sizes.
- The signature works. "How it works" pins on desktop while a single object beside it changes: the POST request or email, then the application and its reply, then `<code>` and the link, then an org landing as "attributed to you". It reads one in, one out, with a `01 / 04` caption. On phone it becomes a swipe rail with a peek.
- The dark room turns Hanzo's three rules into tabs with a gliding pill, each with a small diagram (1 and 2 racing to an org, the second crossed out). The tabs move on their own: the selected tab changed with no input within 5 s.
- Every hover answers. Apply turns graphite and shows hello@hanzo.ai below it, which tells you where it goes. Copy copies exactly `POST /v1/affiliate/apply` and confirms with a tick. Nothing jumped (0px box shift on every hover).
- There's one ask, "Apply". On desktop the header swaps "Try Hanzo" to a solid "Apply" once the hero ask leaves view, and only one solid shows at a time.
- Reduced motion shows the final state (the link is whole, the code marked). With JS off everything is legible at both sizes. No horizontal scroll (scrollWidth equals clientWidth at both sizes).
- No hue, no gradient text, nothing above the h1, no three equal boxes.

## The 11 answers
1. Sells in 5 s: yes ("Refer customers to Hanzo" plus the link itself). Motion inside 1 s: yes (the h1 cut-in and the link typing). But after about 3 s the first screen is still: 0.00% change from 3 to 6 s and from 6 to 7 s. Only the pointer lean is left.
2. One in, one out: yes on desktop (pinned chapters, then the dark room, then the close). On phone the rail and the stacked tabs hold it reasonably.
3. A real object in every section: yes. The link, the request/mail/code/org stage, the rule diagrams. The close is the Apply band, which is fine.
4. One ask, "Apply", and it's in the sticky header on desktop. On phone the header keeps "Try Hanzo", which goes solid once Apply scrolls off, so the phone header carries a different ask (partly the shared header, see Shared). Scale has rhythm: h1 52, link 64 mono, chapters 26, tabs about 30, captions 12. One loud item per screen.
5. Hover and press answer with no jumps. Exceptions: the hello@hanzo.ai link and the "referral" link show no visible hover change on desktop. The desktop chapter dots are 28px targets.
6. Overlaps and shifts: none at 1470. At 375, step 1's inline `POST /v1/affiliate/apply` chip breaks across lines with its border sliced: "POST" is clipped at the right edge, the path starts with no left edge, and the next line opens with ", or write to". No font swap seen. The h1 box held.
7. Feels like apple.com's pinned one-idea-per-screen stage, and that motion really is there (scrubbed chapters). There's a little osply-style pointer detail in the link lean.
8. Distinct: the hero medium is a typed URL. The signature is the chapter stage plus the rule diagrams. Not a template look.
9. 18 parts: mostly covered as walked. Gaps I saw: the rule tab panel is a focus stop with no visible ring (DIV, outline none), and on phone the header ask doesn't match the page's ask.
10. Banned tells: none from the page. The cookie card floats over content at both sizes, but that's shared chrome.
11. Copy untouched: parity text 15/15. The rule words appear as tab labels and in Hanzo's own step-4 sentence.

Shared (not counted): the cookie card covers the lower part of the screen (203px tall on phone) and sits over the closing Apply. The phone header only swaps its ask above 700px.

## Fixes (in order)
1. Phone step 1: keep `POST /v1/affiliate/apply` plus its Copy button on one unbroken line, or let the chip drop whole to its own line. Right now `.xaf-keep { white-space: normal }` (the phone rule, Affiliate.css line 100) plus `overflow-wrap: anywhere` on `.xaf-code-in` slices the bordered chip and orphans the comma. Use `box-decoration-break: clone`, or better, `display: inline-block; max-width: 100%` on the chip so it never splits.
2. Give the first screen a quiet idle beat after the link finishes: a slow caret blink on `<code>`, or the code mark cycling once. Today it goes dead at 3 s.
3. Give the in-text hello@hanzo.ai and "referral" links a hover that does more than nothing (underline offset or weight shift, colour stays ink). Give the rule tab panel a visible focus ring or take it out of the tab order. Raise the desktop chapter dots to a 44px hit area.
4. On phone, ask the header owner (via docs/requests) to show "Apply" as the sticky ask, so the page's one ask lives in the header at every width.
