# /edge — James-eye review
7 Nov, critic pass on `claude/modest-rosalind-d8d1e2` (dev server :4182). Walked moving at 1470x801 and 375x812 (phone: isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s with no input, wheel scrolls one screen at a time with a 1.5 s dwell, hover and press on every control in `main` on desktop, tap-size audit on phone, plus a 14 s dwell on the machine field and a click into a runtime card. I measured CLS, horizontal overflow, fixed elements and console output.

Verdict: 7/10

First complaint: "The top's good, the little localhost window is going. But it's grey bars, not words, it looks like a loading skeleton. Then the big dotty bit in the middle is just three blobs of dots. Is that the moment? And on my phone it goes on forever."

## The 11 answers
1. **Sells in 5 s, moves within 1 s: yes.** "Hanzo Edge", "Run a model on the machine in front of you.", a solid View on GitHub and a quiet View Documentation on the left; on the right the localhost window ("No network at all", zen-eco 4B, Q4_K_M, Metal) streams `data:` lines from first paint (pixel change 1 s to 3 s: 6% desktop). The streamed lines are blank grey bars, not tokens, so the "token by token" panel reads as a skeleton loader rather than output. The window also runs off the right edge and below the fold at 1470, so the one big thing is cropped on both sides.
2. **One in, one out: half.** The machine field is a real time-driven scene: three dot clusters labelled macOS / Linux / WebAssembly, then "Fetched once" spreads them into one lit grid with a "Hugging Face repo" pill, with a filling bar under the three facts. The six runtime cards then open into a sheet (good). After that, "What runs on yours" is a picker, and "When to reach for it" is a dark room of four numbered text blocks with bullet lists: a document. Phone height is 11,004 px (16 screens), desktop 7,653 px.
3. **A real object in every section: yes, mostly.** Window, field canvas, card thumbnails (localhost:port, quant bars, Metal/CUDA/AVX2, 600M/4B, prompt/output), picker answer card, agent-prompt block. The dark room has none: text and bullets only.
4. **One ask, nothing floating; scale: mostly.** Desktop header swaps "Try Hanzo" for "View on GitHub" once the hero ask leaves (good). On the first screen the header's solid "Try Hanzo" sits beside the hero's solid View on GitHub (shared side-effect, not counted). On phone the header stays "Try Hanzo" all the way down: the page's own ask never reaches the header. Nothing page-owned floats. Scale: 52 px h1, 26 px heads, 64 px "600M 4B" figure: some rhythm, but nothing grows or shrinks.
5. **Hover and press: partly.** Primary, picker buttons, related rows and the card "+" answer. My computed-style probe found no hover change on View Documentation, the three field facts, and the four lower runtime cards (only the "+" disc moves); Copy and the picker have no press change. "Close" in the sheet has no hover.
6. **Overlap, font swap, layout shift: clean.** CLS 0.0005 desktop / 0 phone (the only shifts are the shared header). No horizontal overflow. No font swap; h1 box holds. The cookie card covers the lower third on phone (shared, not counted).
7. **Reference: apple.com product page, weakly; synchronized.studio in the card-to-sheet open.** No pinned stage, no count-up, no headline type moment.
8. **Different from its neighbours: yes.** Localhost window + machine field is its own; it differs from /engine (terminal + pinned chapters) and /cloud/* (console template).
9. **18 parts: card 18/18** (`docs/coverage/edge.md`). Claims hold except "every hover answers" (see 5) and "0 console errors": a hydration-mismatch error fires on every load (the diff is in `<Head>`, shared layout; it appears on all pages I walked, so not counted against the page).
10. **Banned tells: none hard.** Monochrome only, no gradient text, Zen fonts, no eyebrow over the h1. The dot field is close to generic "AI particles".
11. **Copy: untouched.** `parity.py /edge`: text 64/64, links 7/7.

Tools: `taste.py Edge.jsx` OK. `unique.py`: signatures unique (exit 1 only for Contact.jsx motion count, not this page).

## Fixes, in order
1. **Make the stream real.** Stream Hanzo's own words or tokens in the TOKEN BY TOKEN panel (or `data:` with a short real payload), not blank bars. Fit the window inside 1470 so it is not cropped on the right.
2. **Give the field a moment.** Let the lit machine grow (the moment) and the answer ring be visible at reading size; one cluster at a time, larger, instead of three small dot blobs. At phone width the clusters are tiny: show one.
3. **Shorten the phone.** 16 screens: turn the dark room's four blocks into one switching stage (tabs or a pinned list), and collapse the six cards to a swipe rail.
4. **Phone header ask.** Carry "View on GitHub" into the header on phone after the hero, as desktop does.
5. **Hovers.** View Documentation (arrow nudge plus underline draw), whole runtime cards (lift and preview), field facts (select that fact), sheet Close, Copy press.
6. **Dark room object.** Give "When to reach for it" one visual (the field reused offline, or the localhost window going dark-network) so it is not text only.
