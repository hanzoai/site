# /models/* (template) — James-eye review

Verdict: 6/10
Ready: 8 Nov, copycheck missing 0 of N (live hanzo.ai) on all 73 maker shelves (every /models/<maker> but /models/enso, which is M's): DeepSeek 0/49, Liquid 0/21, Meta 0/47, MiniMax 0/31, NVIDIA 0/33, Qwen 0/95, ricursiveai 0/17, Thinking Machines 0/20, stealth 0/17, the other 64 0 too; model pages DeepSeek V4 Flash 0731 0/47, Llama 4 Maverick 0/49, LFM2.5-2.6B (free) 0/42, Inkling 0/39, Crouton Alpha 0/35. hanzo.ai renders its maker pages on its server from api.hanzo.ai/v1/models, so models added after our capture were missing: the shelf now reads that same public GET in the browser (useShelf in parts.jsx; captured shelf is the first paint and the fallback) and follows it: the count, the lede ("model" for one, as hanzo.ai writes it) and the cards in the gateway's order. A model page's "More from" follows the same list. A model with no page here opens hanzo.ai in a new tab (↗, rel noopener, no Morph), as other off-site cards do. /models/stealth is now the stealth maker shelf, as on hanzo.ai (re-captured; it no longer draws the catalogue). taste/unique OK; 0 console errors, no overlap at 1470x801 and 375x812 (the one hit on /models/deepseek phone is the sr-only "(opens in a new tab)" hint).
Dark: 8 Nov, matches live hanzo.ai in dark side by side (docs/gallery/models-family/dark-*.jpg); darkcheck OK, lightcheck OK, copycheck 0. Checked /models/aion-labs, /models/anthropic, /models/hanzo, /models/aion-labs/aion-2.0, /models/anthropic/claude-opus-5.5, /models/hanzo/kai: html:not(.light) rules on Hanzo's tokens only; the page's local greys give way to the page's in dark (--muted, a caption grey here, takes --text-tertiary); hero glow as live; Sigil fields in --foreground; object, plot and reach on --muted (#171717) with the white-10% hairline; bars and selected pills light (primary). darkcheck's remaining hits on model pages are the ink data bars (the page's model in the bill, the IN/OUT rates), light on dark as live's primary fills, intended. Black in both modes as before: SPEC model cards, films, the guest terminal, the quick start room (data-room=dark). 0 console errors, no sideways scroll, both modes at 1470x801 and 375x812.
First complaint: "I click the first card under 'More from Anthropic' and it throws me off to the old live site. And the Anthropic page is eight rows of three identical black text boxes with a bar floating over them."

Walked 7 Nov on main at `b8c4ac3` (`components/pages/models/ModelSheet.jsx`, `ProviderShelf.jsx`, `parts.jsx`, `models.css`, `components/v2/SpecCard.jsx`) on the dev server. Judged against `docs/MASTER.md` (parts 1–18, section 3, 4.7), `docs/JAMES.md` and `docs/refs/hanzo-model-cards/SPEC.md`.

Members walked:
- `/models/anthropic/claude-opus-5.5/`, `/models/hanzo/kai/` and the maker page `/models/anthropic/`, at 1470×801 and 375×812 (touch).
- Opus also at 320px.

How:
- First-screen frames at 0, 500 and 1,000 ms, then a settled hero at 3.5 s.
- A scroll pass in 120px steps every 50 ms.
- Hover and press on the hero ask, sibling cards and field dots.
- A click on a sibling card.
- JS off on all three.

Stills and scripts are in `/tmp/claude-0/critic2/`.

## What works
- **The hero is MASTER 4.7.** The name (44px for "Claude Opus 5.5", 52px for "Kai"), the lede and Hanzo's CTA pair sit on the left.
  - **Figures:** three 64px figures (1M / $4.45 / $22.26) on hairline columns.
  - **Object:** on the right, a 4:5 Sigil object holding the breadcrumb, the model ID and "Copy model ID". Nothing sits above the h1 (`hero/opus-js.png`).
  - **Phone:** the name, lede, both asks, the object and the three figures fit the first screen at 375 (`phone-heroes-3s.png`).
  - **JS off:** the same figures and asks render.
- **The sticky local nav** ("Specifications · Quick start · More from Anthropic") carries the ask. It turns solid only once the hero ask has left. No site ask bar floats on the model pages.
- **The model page feels made, not templated in places:**
  - a graphite quick-start room with APG tabs;
  - a bill calculator with drawn sliders ("$89.02 Bill a month", the Beyond);
  - a sibling field whose dots answer hover with name and rates ("Claude Opus 5.5 · 1M · $4.45 in · $22.26 out", `hero/opus-dot-hover.png`);
  - SPEC black sibling cards (#000, 20px, 22px/500, tilt);
  - Hanzo's close.
- **Controls answer:** the hero ask darkens on hover and presses to .97; sibling cards tilt.
- **Checks:**
  - No sideways scroll at 375 or 320.
  - Parity OK on all three: Opus 106/106 and 10/10, Kai 209/209 and 9/9, Anthropic 56/56 and 28/28.
  - `taste.py`: OK.

## Card check
`docs/coverage/models-family.md` uses the 18-part format. No cap. Spot checks:
- **"Every card opens by Morph" (part 3 and part 15): false.** Some cards link to `https://hanzo.ai/models/…`, pages that are not among the rebuild's 470. Clicking the first sibling card, "Claude Fable 5", leaves the site (it ended on `chrome-error://` in the sandbox).
  - On Opus, 4 of the 6 sibling cards: `claude-fable-5`, `-5.1`, `-5.1:batch`, `claude-haiku-5.5:batch`.
  - On the Anthropic shelf, 7 of 24 cards.
- **"The name is 52px (44 or 32 for long names)… section headings 26px": false on two members.** The maker h1 is **76px**, off the scale. Kai's "Limits" heading is **35.2px** (25.6px on phone), also off the scale.
- **"The sticky local nav … the site Ask steps aside for it": true on model pages.** But the maker shelf still shows the shared Ask pill over its cards (`crop-anth-ask.png`).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Something moves: the name cuts in, the figures rise and the Sigil drifts. But at 1,000 ms the three "largest" figures are still blank under their mask on both sizes (`opus-desktop/first-1000.png`, `op-psheet.jpg` frame 1). They read only at about 1.5–2 s.
2. **One in, one out, or a document?**
   - **Opus:** close to one-per-screen. But "Specifications" is four rows on an otherwise empty screen, which reads quiet, not alive.
   - **Kai:** a document. "Shipping today" and "In development" spec tables, a "Limits" text block, then a sibling rail holding a single card in a white field (`kai-dsheet.jpg`).
   - **Maker shelf:** a document. 24 cards of 4-line text (`anth-dsheet.jpg`). The phone shelf is 10,983px.
3. **A real object in every section?** Mostly: the Sigil, the code room, the field, the bill and the cards. But Specifications and Kai's Limits have none. The sibling field crowds every dot against the right edge (most siblings are 1M), leaving a mostly empty grey box, and on phone the right-hand dots clip.
4. **One ask, nothing floating, scale has rhythm?**
   - **Model pages:** yes on the ask (local nav) and nothing floats. Scale is right: 44 / 20 / 64 / 26 / 44.
   - **Maker shelf:** the shared pill "Anthropic Models via Hanzo AI · Get API Access" floats over the card grid at 1470×801. Its 76px h1 sits next to a 64px "24", which is two big things at once.
5. **Every hover and press answers, no jumps?** Yes for the asks, cards and dots. The quick-start Copy button is a white pill with a `#d4d4d4` label (about 1.5:1), so it barely answers. Copy and "Copy model ID" are 30px tall.
6. **Overlap, font swap, layout shift?**
   - Desktop: the maker shelf's floating Ask covers card text and pills (`crop-anth-ask.png`).
   - Phone: the Anthropic hero's Sigil lines run through the lede text (`an-psheet.jpg` frame 1).
   - Every load logs the hydration-mismatch error, and the "1 Issue" badge is in every frame.
7. **Which reference, and is its motion there?** The anthropic.com launch page in the hero (name, figures, object): yes. But 4.7's benchmark row is absent, and the Morph arrival breaks wherever a card goes off-site.
8. **Different from its neighbours?** Yes. A light Sigil launch page, not /models' film grid.
9. **All 18 parts covered?** The card is complete, but parts 3, 7, 10, 12 and 15 have gaps (below).
10. **Banned tells?**
    - 3 equal boxes in a row on the maker shelf (24 cards, 3 per row, 373px each).
    - An explaining paragraph under every shelf tile.
    - A pill bar floating over content on the maker shelf (shared component, but the template lets it show).
    - No hue and no pill above a heading.
11. **Copy untouched?** Yes, parity is clean on all three.

## Missing from the 18 parts
- **Part 3 / 15:**
  - Cards whose model has no page link out to `hanzo.ai`, so there is no Morph and the visitor leaves the site.
  - Kai's sibling rail shows one card.
  - The figures arrive after the 1-second mark.
- **Part 4:** the ask labels drift within a page: "Get API key" in the hero, "Get an API key" in the close; "Get decisions" on Kai. These may be Hanzo's words; list them as a copy question.
- **Part 7:**
  - The maker h1 is 76px and Kai's "Limits" is 35.2px, both off the deck scale.
  - Kai has two "More from Hanzo" h2s: a 13px mono-capital row under the hero, and the 26px section.
- **Part 10:** Kai is Hanzo's own flagship and its film exists (`kai.webm` plays on /models), yet its page shows a grey Sigil. "Colour arrives only through Hanzo's own media"; this page throws that away.
- **Part 11:** the phone maker shelf is 11k px of full-width text cards. The sibling field's dots clip at the right edge on phone.
- **Part 12:** Copy at about 1.5:1 contrast and 30px targets. axe not run (the card admits it).
- **Part 13:** a hydration mismatch on every load.
- **Part 15:** Kai's spec is in "Shipping today / In development" groups, not 4.7's four groups (Identity, Limits, Price, Modalities).

## Fixes (most important first)
1. **No card leaves the site.**
   - Sibling rail: pick only models that have a page in `content/pages.json` (same maker first, then nearest context and price, 6 at most).
   - Shelf: list the cards Hanzo links to `hanzo.ai/models/…` as a copy question. Until it is answered, render them as real external links: `rel`, the "opens in a new tab" hint, no Morph promise and no → arrow that implies an open.
   - Evidence: the click on "Claude Fable 5" ended on `chrome-error://` (`/tmp/claude-0/critic2/hero.cjs` output). The shelf hrefs are listed by `/tmp/claude-0/critic2/misc.cjs`.
2. **Remake the maker shelf as one thing in, one out.**
   - Drop the 3-equal grid for the SPEC rhythm (one big card plus small ones), or for 72px rows with the price, whose description opens on hover or focus.
   - Suppress the shared Ask pill here as the model pages do (local nav, or `data-thumb` in the header).
   - Set the h1 to 52px so the "24" (64px) is the one big thing.
   - Evidence: `/tmp/claude-0/critic2/anth-dsheet.jpg`, `/tmp/claude-0/critic2/crop-anth-ask.png`, `/tmp/claude-0/critic2/an-psheet.jpg`.
3. **Fix Copy everywhere in the template.** An ink label on the white pill (or a white-78% label on graphite), 44px tall, `role="status"`. The same for "Copy model ID". Evidence: `/tmp/claude-0/critic2/opus-dsheet.jpg` (quick-start frame), `/tmp/claude-0/critic2/kai-dsheet.jpg`.
4. **Give Hanzo's own models their film.** On `/models/hanzo/kai` (and any member with `media(slug,'webm')`), the 4:5 hero object is the model's film over its poster. Keep the Sigil for the third-party members. Evidence: `/tmp/claude-0/critic2/hero/` vs `/tmp/claude-0/critic2/models-desktop/first-1000.png`.
5. **Land the three figures inside the first second.**
   - Start the mask at 200 ms and finish by 700–800 ms, so 1M / $4.45 / $22.26 read before anything else finishes.
   - JS off already shows them.
   - Evidence: `/tmp/claude-0/critic2/opus-desktop/first-1000.png` vs `/tmp/claude-0/critic2/hero/opus-js.png`.
6. **Kai:**
   - Put the spec into 4.7's four groups and fold the rest.
   - Set "Limits" at 26px and give it an object (the 32,768-token reach as a drawn bar, from the existing text).
   - Remove the duplicate "More from Hanzo" heading level (make the top row a caption, not an h2).
   - Fill the sibling rail with real Hanzo members, or drop it.
   - Evidence: `/tmp/claude-0/critic2/kai-dsheet.jpg`.
7. **Sibling field:**
   - Spread the x scale (log context, padded) so the dots do not stack on the right edge and do not clip on phone.
   - Label the current model's dot at rest.
   - Evidence: `/tmp/claude-0/critic2/opus-dsheet.jpg`, `/tmp/claude-0/critic2/op-psheet.jpg`.
8. **Specifications on Opus** is four rows on an empty screen. Bring it up under the hero object, or pair it with the bill so the screen has one object.
9. **Find the hydration mismatch** (it fires on every load of every member) and keep the Sigil lines off the lede on the phone maker hero.
