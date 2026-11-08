# /api — James-eye review

Verdict: 8/10
First complaint: "I've seen this list of endpoints three times now: in the hero, in the black box and again at the bottom. Show it once properly and let the rest be about something else."

Walked 2026-11-07 16:42–17:05 UTC, HEAD 10953462 (main moved to 41867139 during the walk; no ApiPage change observed), at 1470x801 and 375x812 (isMobile, hasTouch). First screen at 0.2/1/3/6 s plus a return visit; full wheel walk in 200px notches with 0.7 s dwell; clicked or tapped every hero tab, Pause, all 4 chapter buttons, all 15 black-room endpoint options, all 3 Copy buttons (clipboard read back), the All/POST/GET filter, the search box (8 queries incl. empty result, case and whitespace), filter+search combined, Show all, row expand; reduced motion; JS off; CLS observer; 320px width.

## What works
- The first screen sells: h1, lede, "Get an API key, free" and a live request bar (POST + typed URL, Pause, send arrow to the docs) with Hanzo model art per endpoint. It moves within 1 s (h1 cut-in plus typing caret: 0.9% of pixels change 0.2→1 s, 2–3% each later interval) and never goes dead: the endpoint auto-advances about every 4–6 s through all 8.
- Pause works (aria-pressed toggles, nothing advances for 9 s). Every hero tab click swaps URL, description, art and docs link with no hero height change (715.9 px throughout).
- The "How it fits together" pinned stage is the one-in-one-out moment: four chapters, one panel each (key → billing meter, identity headers struck and rewritten, OpenAPI → client, app → /v1 gateway → six services), 01–04 buttons scroll to the right chapter. On phone it unpins into stacked panels.
- Black room is a real curl builder: picking any of 15 endpoints rewrites the curl, and "Copy as curl" copies exactly what is shown (checked: `curl -X GET https://api.hanzo.ai/v1/tools …`). Base URL and agent prompt Copy buttons also copy the displayed text and say Copied.
- Core endpoints filter and search behave: POST 12/15, GET 5/15 (GET·POST rows correctly in both), "chat" 1, "billing" 1, "/v1/a" 2, "AUDIO" case-insensitive, filter+search combine, "zzz" gives a designed empty state ("No endpoint matches. Show all").
- Header ask swaps to "Get an API key, free" on desktop once the hero ask leaves view. Primary hover darkens fill, press scales .98, `data-cta="api-hero-key"`.
- 0 console errors, 0 page errors, CLS 0.0003 desktop / 0.0001 phone, no horizontal scroll at 375 or 320. Reduced motion: no running animations, hero holds on endpoint 1, stage shows final panels. JS off: everything legible. taste.py OK; parity 80/80 text, 18/18 links.

## The 11 answers
1. Yes. It sells in 5 s and moves inside 1 s on both sizes (typing caret, h1 cut-in, auto-advancing endpoint).
2. Mostly one-in-one-out: the pinned stage is good. After it the page turns into a document of the same thing: base URL + endpoint picker, then the endpoint list again.
3. Yes, every section holds an object (request bar + art, agent prompt, stage panels, curl builder, endpoint rows). Weakest: chapter 03 "Generated, not hand-written" on desktop is a big grey panel with two mono labels, one small chip and dots; mostly empty.
4. One ask, "Get an API key, free", in hero, header and closing Band. Nothing page-owned floats. Scale has rhythm on the first screen (52px h1, small mono UI). But the chapter h3s are 32px while "Base URL" and "Core endpoints" h2s are 26px, so the inner headings outrank the section headings.
5. Mostly. Rows nudge the path 6px on hover, chips, options, Docs and Pause change fill/border, presses scale. Keyboard gaps: All/POST/GET tabs ignore ArrowRight, the black-room listbox ignores ArrowDown, Escape does not clear search.
6. No overlap, font swap or layout shift from the page. The shared cookie card sits over content at both sizes until dismissed (shared, 203px tall on phone, within the 220px limit).
7. apple.com product page: the sticky stage where one panel changes is really there. motion.dev-style state changes (tab underline progress, curl rewrite). No streamed response: the hero types the request URL but no response ever lands, so "the first call works" is told, not shown.
8. Yes: a request bar with model art and an auto-advancing endpoint tray is its own hero medium, not the home hero's trick.
9. Largely covered (hero, show-it, chapters, code/key, reference list, Band, next links, footer). No proof strip before the Band. Developer states (loading, rate-limited, error) aren't shown anywhere.
10. No banned tells. No eyebrow above h1/h2 ("01 / 08" and "AGENT PROMPT" sit above body text, not headings), no hue, no 3 equal boxes, buttons don't fade on hover. The hero is box-in-box (outlined frame → outlined description card → grey chip tray), which reads a bit busy and "framed".
11. Copy untouched (parity 0 missing).

## Fixes (in order)
1. Stop repeating the endpoint list three times. Keep the full list once (Core endpoints) and let the hero tray and the black-room picker do different jobs: e.g. the black room only shows the curl for the endpoint chosen in the hero, with no second 15-item list in an inner scroll box (236px visible of 696px).
2. Land a response in the hero: after the URL types, stream the existing response once (pausable) so the first call is seen working, as the brief's /api signature asks.
3. Give chapter 03 a full object: the OpenAPI → client panel is mostly empty grey at 1470x801; fill it with the operation-id mapping at true size.
4. Fix the counter: "15 / 15" shows while only 6 rows are visible behind "Show all +9". Show "6 of 15" or drop the count until search or filter is used. Trim the query (" embeddings " returns 0).
5. Keyboard: APG arrow keys on the All/POST/GET tabs and the endpoint listbox; Escape clears the search.
6. Bring chapter h3s down below the section h2 size (17–21px), or the h2s up, so the hierarchy reads.
7. Flatten the hero frame: outline or fill, not outline-inside-outline-inside-fill.

Shared (not counted): cookie card overlays content until dismissed; font preload "not used within a few seconds" warnings (Zen, Zen Mono) on every load; phone header ask stays "Try Hanzo" while desktop swaps to the page ask.
