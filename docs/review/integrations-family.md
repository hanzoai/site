# /integrations/* (template) — James-eye review

Reviewed: main, page files at `3389ac0`. Members walked: `/integrations/openai-sdk` and `/integrations/langchain`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks, JS-off and reduced-motion checks; the once-per-visit loader skipped).

Note (7 Nov 14:12): a hydration error seen in the first walks came from the shared shell and is gone on main; it is not counted against this page.

Verdict: 5/10

First complaint: "Why is there a little emoji and a coloured tag sitting on the headline, and why is the LangChain page green? Then I land and nothing happens. The code only starts typing after I scroll."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "Use Hanzo AI with LangChain" plus Hanzo's lede is clear. It does not move: after the headline lands, the first screen is still on both sizes (under 0.4% change over 4 s). The editor sits on the fold showing one line, `pip install openai`; it types only once you scroll it into view.
2. **One in, one out?** Yes for the middle: once the editor types, the four samples come in as pinned chapters (01 / 04 … 04 / 04). After that it becomes a document: credit block, dark room, then a 4-column wall of 19 integration cards.
3. **A real object in every section?** Yes until the end. The 19-card wall is a grid of icons and sentences, not an object.
4. **One ask, sticky after the hero?** Partly. A floating bar with "Get an API key" follows you on desktop and "Get API key — Free" sits in the phone's bottom bar, which is right. But the header still says "Try Hanzo" beside it, and the hero itself has no ask.
5. **Every hover and press answers?** Cards and the breadcrumb answer on hover. No press state on anything tested. The round arrow buttons on all 19 cards look identical.
6. **Overlap, font swap, layout shift?** No overlap. **Phone layout shift is 0.15–0.16 on both members**, over Google's 0.1 limit, as the editor and chapters settle. "Install & configure" is cut off in the editor title on the phone.
7. **Which reference, and is its motion there?** apple.com chapters (the pinned 01 / 04 samples) are there. The "cards open into their page" (synchronized.studio) sits at the very end, under the wall, where few will reach it.
8. **Different from its neighbours?** The typed editor and "Only the Hanzo lines" switch are its own. The two members differ only by colour and emoji.
9. **All 18 parts covered?** See below.
10. **Banned tells?** Yes:
    - An eyebrow above the h1 on both: a category tag ("AI SDKS", "FRAMEWORKS") with an emoji-style icon (🐍, ⛓️).
    - UI hues per member: blue on openai-sdk, **green** on langchain (tag, Hanzo-line highlights, the ask's border). Purple code tokens on both. JAMES.md allows 0 UI hues and bans green outright.
    - Emoji icons on every card in the 19-card wall.
    - "Explaining sentences under every tile" (the wall).
11. **Copy untouched?** Yes. Parity 93/93 and 92/92 text, 23/23 links. The added labels are controls ("Only the Hanzo lines", "Copy base URL").

## Missing from the 18 parts (PLAN-COMPONENTS 2.1–2.18, measured)
- **2.3 First impression:** no moving object on the first screen; editor on the fold.
- **2.3 / 2.17 No-JS:** with JavaScript off, 6 of 20 text blocks stay invisible (chapter titles "LangChain TypeScript", "03 / 04", language labels).
- **2.4 Conversion:** 0 `data-cta`; header ask differs from the page ask.
- **2.6 Content:** the 19 cards are a wall; plan says lists over 5 collapse with a true count.
- **2.11 Mobile / 2.13 Performance:** phone layout shift 0.15+.
- **2.12 Accessibility:** the auto-typing editor has no pause control.

## Fixes
1. Remove the emoji and category tag from above the h1; move the tag into the breadcrumb, which already exists.
2. One ink colour for every member: no blue, no green, no purple tokens. Mark "Hanzo lines" with weight or a grey band.
3. Start the editor typing on arrival, and bring it fully into the first screen (shorter hero gap, or editor beside the headline on desktop).
4. Fix the phone layout shift (reserve the editor's and chapters' height).
5. Collapse the 19-card wall into a compact list or rail with one line each and no emoji; let a card open into its own guide.
6. Put "Get API key — Free" in the hero as the one solid ask.
