# /products/* (template) — James-eye review

Reviewed: main, page files at `ad801d4`. Members walked: `/products/agents` and `/products/memory`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped). The /products/memory desktop walk overlapped a dev-server reload, so its layout-shift figure (0.30) is not counted.

Verdict: 6/10

First complaint: "A tiny green-dot label over the title, the console is half under the fold, and then a huge paragraph lights up word by word. That's a wall of text, not a product."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Partly. "Agents" / "Memory" at display size with Hanzo's one line ("Workers the company keeps: a model, instructions, tools and a budget.") and "Try Hanzo". The console (a real `curl` to api.hanzo.ai with its endpoints) starts at the fold, so the first screen is nearly still (under 1% change).
2. **One in, one out?** Partly: the console, then a long statement that lights word by word as you scroll (about 60 words at 24px+), then "API", "Measured", "Hanzo OS", "Docs", "On this site". The statement is the brief's Story pattern used on a product page, and it reads as a wall.
3. **A real object in every section?** The console, yes. The statement and the later lists, no.
4. **One ask, sticky after the hero?** Yes: "Try Hanzo" solid in the hero with "Agents API" as a link, then the shared ask bar; the header's "Try Hanzo" turns outlined on desktop.
5. **Every hover and press answers?** Copy and Replay press; a pause control exists for the console.
6. **Overlap, font swap, layout shift?** No overlap; layout shift 0.0004 (agents desktop), 0.017 (agents phone), 0.015 (memory phone).
7. **Which reference, and is its motion there?** apple.com (product as hero) and a scroll word reveal. The word reveal is there; the product is not on the first screen.
8. **Different from its neighbours?** Members differ by name, line and endpoints; layout identical.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes (desktop, first walk):
    - A small eyebrow above the h1 ("• HANZO OS", green dot).
    - **Green** live dot and green tokens in the console; cyan/teal method labels ("GET"). JAMES.md bans green and allows 0 UI hues. (The phone walk of /products/memory, taken after a reload, showed none, so this may already be fixed; re-check on main.)
    - Clutter: a 60-word paragraph as a section.
11. **Copy untouched?** Yes: parity 60/60 and 59/59 text, 21/21 and 19/19 links.

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression:** hero object below the fold.
- **2.6 Type floor:** 16 labels under 13px on /products/agents (12px "TRY IT", "POST").
- **2.6 Content:** the statement is a long paragraph in the main scroll.

## Fixes
1. Remove the "• HANZO OS" label above the h1 (it belongs in the breadcrumb).
2. Bring the console into the first screen beside the title and let it run on arrival.
3. Replace the word-lit paragraph with one object (the console stepping through what the statement says), or cut it to Hanzo's first sentence with the rest behind "Read more".
4. Console in ink and greys only: no green dot, green tokens or cyan method labels.
5. Raise the 12px labels to 13px or more.
