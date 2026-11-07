# /enso — James-eye review

Verdict: 7/10
First complaint: "It starts beautifully, then halfway down it turns into a spreadsheet: a 17-row table, then the same three prices again in another table. One thing in, one thing out, please."

Walked on build `38cd52a9` at http://localhost:4180/enso/. Desktop 1470×801 and phone 375×812 (isMobile, hasTouch), both recorded. I watched the first 3 s with no input (6 frames), then scrolled in 200px steps with a stop on every screen: 18 desktop screens and 21 phone screens. On desktop I hovered and pressed every control and link in `main` with a real Playwright mouse; `(hover: hover)` and `(pointer: fine)` were both true there. On phone I tapped every control. I also checked reduced motion, JS off, 375×667, 320 width, console errors, CLS, hues, labels above headings and tap targets, and ran `parity.py` and `taste.py`. Stills: `docs/review/enso/desktop-walk.jpg`, `docs/review/enso/phone-walk.jpg`.

The page itself is close to an 8. The verdict is capped at 7 because the card makes a false claim (see Card check).

## What works
- **The first screen sells and moves at once.** Enso's own film fills the frame, and "Enso" cuts in within 0.5 s. The lede, tags and one outlined "Try Hanzo" follow. Scrolling settles the film into a round ensō beside "The right intelligence. Every time." This is a real signature, and no neighbouring page has it.
- **The three tiers pin as chapters, and the motion is right.** The left side swaps Flash, Pro and Ultra. The film stays, and a white tier card rides on it. The 01/02/03 rail steps in 6px on hover and presses to scale .97 (measured).
- **The switchboard runs by itself.** Requests stream into the Enso dial, the quality/speed/cost arc moves, and each request lands in its tier. Clicking a chip under "Send a request" sends one by hand and changes the DOM. This is the idle-motion moment James asked for.
- **The proof has hierarchy.** 98.0% for Enso Ultra stands alone, with 96.5% and 95.5% smaller beside it. The Pareto plot and the Compare panel run their own tour.
- **Hanzo's model cards** sit together (9 real films and posters), tilt under the pointer and press. The closing black Band carries the one ask.
- **Every hover answers on desktop.** The hero ask gets a grey fill and its rim darkens. Text links underline and their arrow moves. Request chips change and press to about .97. "By cost" changes and the active "By score" holds. Model cards tilt, and "Explore model pricing" shifts. Nothing fades and nothing jumps: no element changed height.
- **Clean:** 0 console errors (desktop, phone, reduced motion), CLS 0.0003, no horizontal scroll at 375 or 320, no hue anywhere in computed colours, and no label above any h1 or h2. Parity is text 72/72 and links 11/11, and taste passes.
- **Reduced motion and JS off** both show the full first screen with the h1, lede, tags and ask. JS off hides 0 of 45 headings and paragraphs.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** Yes. The film is live at once and the h1 cuts in by 0.5 s on both sizes. On phone the stage settles by time at about 1.1 s, so the big "Enso" is gone almost before you read it. That is a little hasty, but not wrong.
2. **One in, one out, or a document?** The top half is one in, one out: stage, chapters, switchboard, then the 98.0% figure. After that it turns into a document. The plot and Compare panel are followed by a 17-row GPQA table (about 1.3 screens), then about 300px of empty white, then a second table that repeats the tier prices you have already seen twice (in the chapter text and on the chapter cards). That is about 2.5 desktop screens of rows.
3. **A real object in every section?** Yes: film, ring, tier films with cards, the switchboard, the figure, the plot, the tables and the model cards. The tables are objects, but quiet ones placed back to back.
4. **One ask, nothing floating, scale rhythm?** Mostly. The ask is "Try Hanzo" in Hanzo's words, appearing at the hero, the settled headline and the Band. Scale has rhythm: 112px name, 44px settled headline, 26px section heads, the 132px figure as the one moment, 32px side figures and small mono captions. Two small faults:
   - After the settle, the film's 44px pause button sits alone at the right edge of a white page (x 1402, y 534), cut loose from the ring it controls.
   - The phone cookie card covers the hero ask. That is shared chrome, so it is not held against the page.
5. **Every hover and press answers, no jumps?** Yes on desktop (above). Press is .97 to .98 on the asks, rail rows and chips, and links nudge 1px. The model cards' press measured no scale (only the tilt's perspective matrix), against the card's ".98". That is minor. On phone every chip tap changes the switchboard.
6. **Overlaps, font swap, layout shift?** No CLS (0.0003 desktop, 0.0003 phone) and no visible font swap. No overlaps apart from the shared cookie card.
7. **Which reference?** The Apple product page: a pinned stage that changes one panel, the product as hero, huge type for the one figure. The anthropic.com launch shows in the benchmark-as-hero figure. The synchronized.studio card-to-page open is present through the model cards' WebGL opener. Apple's discipline breaks in the table stretch.
8. **Different from neighbours?** Yes. It is the only ring, the only router and the only Pareto plot. The hero medium is a live film that becomes a shape.
9. **18 parts covered?** The card has all 18 `## N.` headings and 18 `Done here:` lines, but one claim is false (Card check).
10. **Banned tells?** None found: no gradient text, no purple, no Inter, no pill above a headline, no icon boxes, no cursor glow, and no button that fades on hover.
11. **Copy untouched?** Parity is text 72/72 and links 11/11.

## Card check
- "CLS measured 0.000 at 1470 and at 375": **true**. I measured 0.0003 at both sizes.
- "Chapter rail rows step in 6px … press to scale .97": **true**. I measured a 6px offset and matrix .9705.
- "scrollWidth equals innerWidth at 375": **true**, and also at 320.
- "Primary ask above the fold at 375×667": **true**. The visible `enso.hero` ask sits at y 508–552.
- Part 11, "[x] Every target 44px or more": **false**. At 375 the four GPQA source links (↗, aria "GPT-6 Sol source" and so on) measure 9×18px. They have no padding and no `::after` hit area, and the points 10px around them hit other elements. "All Enso models" is 132×21px. **This false claim caps the verdict at 7.**
- Part 15, "Model cards … press to .98": unconfirmed. The computed transform during mousedown showed no scale.
- Format: 18 `## N.` headings and 18 `Done here:` lines, so it is in order.

## Fixes (in order)
1. **Make the table stretch one thing at a time.** Keep every row and word, but put the 17-row GPQA results behind a disclosure (drawer or accordion with `hidden="until-found"`) under the plot. Alternatively, cap it at the Enso rows plus the closest rivals with a "show all" control. Move the tiers side-by-side table so it is not back to back with it, and close the roughly 300px dead white gap after the GPQA caption. The page should read stage → chapters → switchboard → figure → plot → cards → Band, without two screens of rows.
2. **Give the small links real targets.** The ↗ source links need a hit area of at least 44×44px (padding or a positioned `::after`) at every size. "All Enso models" (21px tall) needs one too. Then correct part 11 of the card so it matches the measurement.
3. **Re-anchor the film's pause button after the settle.** Pin it to the ring's lower-right edge, or move it into the stage's caption line, so it does not hang alone on the white page at the viewport edge. Also hold the phone stage's full-bleed "Enso" a beat longer, about 2 s rather than 1.1 s, before it settles, so the name registers. Optionally, make the model cards' press visibly scale to .98 as the card states.
