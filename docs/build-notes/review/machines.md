# /machines — James-eye review

Verdict: 6/10
Ready: 8 Nov, copycheck missing 0 of 69 (live hanzo.ai). The Paste-and-ship endpoint is one plain line under the words ("api /v1/compute/machines", as live prints it, not the shared pill split in two), and the hero quote now does what live does with the API reachable: each size (1x, 2x, 4x H100) rolls in its own VRAM, hour, working day and month from api.hanzo.ai/v1/pricing (infrastructure.gpu, the same GET live makes; build-time list as first paint and fallback), every size's quote kept in the page for screen readers. taste/unique OK; 0 console errors, no overlap at 1470x801 and 375x812 (the VRAM/80 hit is the 112px figure's glyph box).
Dark: 8 Nov, matches live hanzo.ai in dark side by side (docs/gallery/machines/dark-*.jpg); darkcheck OK, lightcheck OK, copycheck 0. (darkcheck lists the two lit queue cells in the third use tile: ink accents that turn light in dark, as Hanzo's primary; the hero, the card's sheet and the close's rack are black rooms and stay black.) Live's hero halftone (HeroDither, ported from hanzo.ai's own Dither) sits under the hero in dark, as live draws it; bright mode unchanged.
First complaint: "The hero's whole idea is that the price rolls in, and two times out of three it rolls in a big white dash. I'm watching a quote machine that has no quote."

Walked 7 Nov 2026 on the dev server at 1470x801 and 375x812. I ran the recorder twice, because `Machines.jsx` was saved again at 16:54 in the middle of the first walk: 2x and 4x went from derived prices ($6.96, $5,081...) to em dashes. Everything below is the current build. I scrolled every stop at both sizes and checked each a/b pair for idle motion. I took 150 ms arrival frames and 100 ms frames through a pinned-chapter change. I hovered and pressed the hero ask, clicked all three size tabs (and tapped them on the phone), hovered a use tile and a related row, and did a 45-stop Tab crawl. I also checked reduced motion, JS off, 320px overflow, parity and taste.

Frames: [hero at 4x, quote is a dash](machines/r2-hero-dash.jpg) · [pinned console repeating the step text](machines/r2-pin-echo.jpg) · [phone: step text, then the same text again in a card](machines/r2-phone-steps.jpg)

## What works
- The hero object is real and on-idea. It is a rack of four H100 cards beside a `POST /v1/compute/machines` dryRun console. Every 4 s it moves to the next size on its own: that many cards light, the request body rewrites itself, and the gliding size pill (layoutId) follows. Tabs answer a click within 500 ms, and it has a pause control. At 1x it is excellent: $3.48 at 84px, then an hour, a working day and a month as $3.48 / $27.84 / $2,540, all above the fold at 1470x801.
- The spec section has one big thing: "80GB HBM3" at 64px counts up from 10 once as the solo card lights. The CPU and storage figures sit beside it as quiet hairline rows. The scale rhythm is right here.
- "How renting one works" is a true pinned stage. The left column swaps step 01 to 06 and the console on the right streams its lines in by line mask (500 ms, ease-emphasis, 120 ms stagger). My 100 ms frames show a clean cut, with no crossfade mush.
- The tiles in "When you want a whole machine" tilt under the mouse and run their diagram on hover. On touch they run once they are in view. Related rows fill #f5f5f5 on hover.
- It is clean on the mechanics:
  - CLS 0.0005 on desktop and 0 on phone. No horizontal overflow at 375 or 320.
  - Headings are 52 / 26 / 21px, and there is one h1.
  - Parity is OK (text 106/106, links 7/7) and taste is OK.
  - Under reduced motion there are 0 animations after 3.5 s and the hero freezes on 1x.
  - With JS off, 5,605 characters of text are present.
  - The Tab crawl shows a 2px focus ring on every stop and no invisible stops.
  - The only console error is the known FooterHTML hydration mismatch, which is shared chrome.

## The 11 answers
1. **Sells in 5 s; moves within 1 s?** On desktop it sells: the h1, a one-line lede, the ask and a live price are all on the first screen. Within 1 s the only motion is the rack's small scroll-settle (Lift from 1.04). I could not see an h1 line cut-in at 150 ms sampling: the h1 is fully set by the first painted frame. The first real idle event is the size change at 4 s. On the phone the quote is below the fold, so the first screen at 375x812 is the h1, the ask, four rack cards and the top of the console. The signature number is not visible.
2. **One in, one out, or a document?** It works for three screens: hero, then the spec moment, then the pinned chapters. After that it turns into a document:
   - a 2x2 grid of four equal tiles, each with a title, a sentence and three bullets;
   - three numbered hairline rows of paragraphs ("Whose machine it is");
   - a prompt block and three related rows.

   On the phone, the six chapters become six stacked pairs of paragraph plus console, and the page is 13,877px tall.
3. **A real object in every section?** Hero: yes. Specs: yes. Chapters: half a yes. The console has no product content of its own: every line is lifted from the paragraph beside it ("returns the price and creates nothing", "Unbinding is separate"). You read each step twice, once in Zen and once in Zen Mono (frame 2). Tiles: small diagrams, fine. "Whose machine it is": no object at all, only text rows. Close: the hero rack again, waking four cards. It is the same object, so it doesn't count as a new moment.
4. **One ask, sticky header, nothing floating; scale rhythm?**
   - Desktop: yes. The header ask goes quiet while the hero's solid "Try Hanzo" is visible, then fills once you scroll. Nothing floats over the content.
   - Phone: the header "Try Hanzo" stays solid ink (rgb 10,10,10) while the hero's solid white "Try Hanzo" sits on the same screen. That is two solid fills (shared header behaviour, noted only).
   - Scale is mostly right: 52 h1, 84 price, 64 VRAM, 26 heads, 21 h3.
   - The exception: when the quote shows "—" at 84px, the biggest thing on screen is a dash.
5. **Hover and press answer, no jumps?** Hover: yes on desktop. The ask lifts 2px, the tabs glide, the tiles tilt and the rows fill. Press: no. The probe read the ask's transform while the mouse button was held, and it stays at translateY(-2px), the hover lift. There is no press scale or 1px drop (kit `Cta`, shared). There is no hover-to-tell-you-something detail beyond the tiles.
   - The related-row hover fill runs 12px past the right gutter (row box 374 to 1458px against the 1446px gutter edge). On the phone the rows run 4 to 371px against a 16px gutter.
   - "Deploy to Cloud" in the close is a 21px-tall touch target on the phone.
6. **Overlap, font swap, layout shift?** No overlap at either size and CLS ≈ 0. With JS off, the hero lede sits at partial opacity and about 10px low: the `.v2-in` entry never completes, so `html:not(.js)` does not reach the final state. The lede is still readable. On the phone the hero quote row "a working day" wraps onto 2 lines, which drops its value below the other two.
7. **Which reference, and is its motion there?** apple.com product pages: a pinned chapter stage and the product as the hero. That motion is present and good. There is nothing of synchronized.studio or osply (no editorial asymmetry and no pointer-aware detail past the tiles). The anthropic "benchmarks as hero figures" idea is the right one for the quote, but the quote is empty for 2 of 3 sizes.
8. **Different from neighbours?** The hero medium (rack plus dryRun console) is its own. Below the hero, the page shares the cloud-family skeleton: `PinChapters` and `ShipPrompt` also appear in Gateway, Guard, Hsm, Iam, Idv, Insights and Ingress, and the tiles → rows → prompt → close order is the same. Only the hero and the spec moment are distinctive.
9. **18 parts covered?** Mostly. Gaps I measured:
   - `<main>` has no `id="main"`, so the skip link "Skip to content" has nowhere to land.
   - The canonical is `https://hanzo.ai/machines/`, with a trailing slash. MASTER part 2 says no trailing slash (shared metadata).
   - The press state is missing.
   - JS-off does not reach the final state.
   - There is no objection or answer strip near the ask. Hanzo's own "Scoped to your organization / Bring your own account" copy is the page's answer, but it sits four screens down.
10. **Banned tells?** None outright. Greys only, no pill above an h1 or h2, no Inter, no glow. Close calls:
   - The four equal tiles, each with an explaining sentence and three bullets, are the "explaining sentence under every tile" pattern.
   - The consoles carry both a raised shadow and an outline.
11. **Copy untouched?** Yes: parity 106/106 text and 7/7 links. The console fragments are verbatim slices of Hanzo's step text. Nothing is invented, but every fragment is a repeat.

## Fixes (in order)
1. **Stop the hero spending 8 of every 12 seconds on dashes** (`Machines.jsx`, `SIZES`, `Rent`). The em dashes are honest, but they kill the signature. Do one of these:
   - auto-cycle only the cards and the request body, and keep the 1x quote ($3.48, 80 GB, $27.84, $2,540) on screen as the quote for the one size Hanzo prices;
   - or, for 2x and 4x, swap the 84px figure for a small grey "—" line at caption size, and let the cards and the JSON carry the change.

   A dash must never take the 84px hero slot. If the live price list really carries 2x/4x prices, cite them; otherwise leave them out.
2. **Give the chapter console its own content instead of echoing the paragraph** (`CALLS`, `StepCon`). Use Hanzo's request and response shapes that already exist on the page:
   - step 01: the 1x/2x/4x size list;
   - step 02: the dryRun body plus $3.48 / h;
   - step 05: the GPU rows;
   - step 06: the agent/machine pair from the tile art.

   Where no such shape exists, drop the streamed prose lines and show only the ask line. On the phone (under 900px), set the console as one sticky panel above the six steps, or stack the six steps without a console. Do not print every sentence twice.
3. **Turn the lower half from a document into moments.** "When you want a whole machine" should be one tile in focus at a time: a rail with 14 to 18% peek and scroll-snap, or the 4 diagrams as tabs with the bullets inside. It should not be four equal boxes of text. "Whose machine it is" needs an object: for example, the three rows drive one small org / account / region diagram that changes per hovered or focused row.
4. **Make the close its own moment**, not the hero rack again (`Close`). For example, the rack can end lit at the size the visitor last chose in the hero. That needs a shared `at` from `Rent`, through a module-level store or context. Then the close remembers the choice instead of repeating the hero.
5. **First second:** make the h1 line-mask cut-in (`Lines`) visibly run after hydration, and start the first size step sooner (`useSteps(3, 4000, ...)`: the first tick at about 1.2 s, then 4 s). On the phone, shorten the rack (`.mc-rack` under 899px: 2 cards visible, or tighter rows) so that the $3.48 quote reaches the first 812px screen.
6. **Small fixes:**
   - add `id="main"` to `<main className="v2 mc">`;
   - finish `.v2-in` under `html:not(.js)` (opacity 1, no offset);
   - on the phone, give "a working day" `white-space: nowrap` or a smaller dt, so the three quote values share one baseline;
   - give "Deploy to Cloud" in `.mc-close-acts` a 44px hit area;
   - inset the `ShipPrompt` related-row hover fill to the gutter (page-local override in `Machines.css` under `.mc-ship`, or a request in `docs/build-notes/requests/machines.md`).
7. **Shared, request only (not scored):**
   - the kit `Cta` has no press state (it should press to scale .97 or translateY(1px) in 90 ms);
   - on the phone, the header ask stays solid while the hero's solid ask is visible;
   - the canonical has a trailing slash.
