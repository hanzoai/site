# /blockchain/* (template) — James-eye review

Verdict: 6/10 (up from 5/10 last round)
First complaint: "'Key Capabilities' is stuck to the edge of my screen and the card is hanging off the other side. It's a big empty white box with one sentence in it. Then I click to the next product and it's the exact same black card: HA, <50ms, 100+. It's just a template."

Walked 7 Nov, 14:20–14:55 UTC. The family moved under me twice, so the verdict is on the last state:
- the family files at `ea71c97` (round 4: one-card deck, typed code, no counters);
- the shared Families kit at `fe077aa`, plus uncommitted `fam.css` (14:47). This kit change set h1 to 52px, the container to 1152 and new section padding.

What I filmed:
- Moving at 1470×801 and 375×812: 4 s idle, then a wheel or finger walk to the footer, on /blockchain/defi, /blockchain/exchange and /blockchain/directory.
- Hover and press on every control. Directory open, filters and search; chain picks; a sibling click; the phone sideways swipe.
- Reduced motion and JS off, and a first-screen sweep of all 17 members.
- I re-checked every claim below on the final state.

Stills:
- `img/blockchain-deck.jpg`: the deck at 1470 and 375. There is 0 px gutter on both, and the card face is empty.
- `img/blockchain-directory.jpg`: the directory with Chrome's blue native × in the search field.

## What works
- **The key card is the right object.** It sits beside the headline with one solid ask, "Try Hanzo". "View Documentation" is now a text link. The chains stream across it within 1 s, and the member's contour drifts behind it. The exchange uses a product console instead, which turns by itself and holds under the pointer.
- **No eyebrows; 0 hues in the template's own CSS.** The labels sit in a meta row under the lede, and the code is in grey steps.
- **The ask holds.** The ask bar carries the hero's `data-thumb` after the hero at both widths ("Try Hanzo", or "Read the docs" on the exchange) and steps aside over the dark room. `data-cta` is on every product primary.
- **Mixed motion, not just scroll:**
  - idle: the stream, the console, the contour;
  - time: the member's code types itself in line by line, with a block cursor;
  - state: the deck changes one card at a time, plus the chain picker and console tabs;
  - pointer: a magnetic ask and a sibling rail that drags with inertia.
- **The directory works as a catalogue.**
  - Kind, search and product filters narrow a live count, and the grid reflows.
  - A card opens in place into its sheet (a real shared-element morph, about 450 ms), with Esc and focus return.
  - Phones get 72px list rows, and there are only 2 canvases.
- **Clean basics:**
  - CLS is 0 on all three; the exchange console's height jump from round 3 is gone.
  - No console errors, and no sideways scroll at 375.
  - Reduced motion leaves 0 running animations, and the deck unpins.
  - The phone swipe goes to the next sibling (defi → directory, exchange → explorer).
  - Parity is 149/149, 109/109 and 62/62, and taste.py is clean.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It moves, yes. It sells less than it did:
   - The kit now rests the h1 at 52px Book (44 on the exchange, 40 on the phone). JAMES.md asks for display type at 72px and up. The kit cites a `MASTER.md` that is not in the repo, so this conflict needs James.
   - The first screen opens on about 150px of empty white above a small title.
   - The key card's bottom (820) still runs under the fold at 1470×801, on all 15 key-card members.
   - On the exchange, only a 2px progress line moves for the first 3.6 s.
   - Exchange phone: the first screen shows only the tab list; the panel that changes is below the fold.
   - Directory phone: the first screen is the headline, the count and the filters, with no chain row.
2. **One in, one out, or a document?** The deck does one in, one out. But it holds about 3.8 screens of scroll for 9 short sentences.
   - From the code onward it is a document: the code types once, then 4 text rows, chips, the rail, the room and the strip.
   - There is about 320px of white between sections. The screens between the hero and the deck, and beside the Supported Chains chips, are mostly empty.
3. **A real visual object in every section?** Yes in the hero, the code and the sibling rail. No in three places:
   - the deck card, which is about 60% empty white above its title;
   - Built For, which is text only;
   - Supported Chains: chips next to half a screen of white.

   There is no Hanzo imagery anywhere (0 `img`/`video`).
4. **One ask, sticky after the hero?** Yes, at both sizes. But at the closing room the bar steps aside and the header's "Try Hanzo" turns solid again, next to the room's white "Get Your API Key" or "Read the docs". That is two solids, measured on defi at 1470 and 375 and on the exchange at 1470.
   - The exchange asks five things: Read the docs, Contact Sales, View Pricing, Deploy to Cloud, plus the header.
   - The directory has no ask of its own and ends straight into the footer.
5. **Every hover and press answers, no jumps?** These answer: sibling cards (lift, preview, arrow, .98), directory cards (lift 4px, .98), exchange "Read the docs" and Copy. These have no hover:
   - the key card's "Try Hanzo" (only the magnetic pull);
   - the 41 chain-picker chips;
   - the 17 directory filters;
   - "Learn more";
   - the "hanzoai" GitHub chip (no press either).

   The code header's "Solidity Node Python Go Rust C C++ Ruby" are styled as tabs and do nothing.
6. **Overlaps, font swap or layout shift?** Yes:
   - **The deck has a 0 px gutter at both widths.** "Key Capabilities" and its marks start at x=0, and the card runs to x=1470 (x=375 on the phone). The cause: `.xb2-deckx-g{width:100%}` overrides `.v2f-wrap`.
   - The directory's open sheet slides under the site header, which stays bright and clickable above the scrim (z 90 vs 300).
   - No font swap, no CLS.
7. **Which reference, and is its motion there?** Mostly apple.com: a pinned one-at-a-time deck and big figures on the key card. synchronized.studio only half:
   - The directory card does open in place.
   - The sibling cards do not open into their page. On click the old page snaps to its own top and shows the DeFi hero again (about 1.5 s on the dev server), then cuts to Explorer. No title lands on the h1.
8. **Different from its neighbours?** No, inside the family. All 15 key-card members (sweep of 17) have the same layout and the same card with the same "HA / <50ms / 100+". They share the same deck, code, rows, chains and room. Only the h1, the chain list and a contour at 16% opacity change. The exchange and the directory differ.
9. **All 18 areas?** See below. `docs/coverage/blockchain-family.md` exists, but it claims the hero object is "whole on the first screen" and "targets 44px or more", and neither is true.
10. **Banned tells?** These are gone: eyebrows, UI hues, and the three-boxes-in-a-row wall. Left:
    - Chrome's blue native search × on the directory (a hue and a browser-default control);
    - a plain empty white box as the signature's face;
    - pill "tabs" that are not tabs.
11. **Copy untouched?** Yes (parity above; every figure is Hanzo's). The chain picker shows a giant "5" with no visible words, so it reads as a number with no meaning.

## Missing from the 18 areas
- **2.3 First impression:**
  - No display headline.
  - The key card is cut by the fold at 1470×801.
  - The exchange phone's moving panel is below the fold, and the directory phone shows no row on its first screen.
  - The sibling morph does not land, and the directory has no closing room.
- **2.4 Conversion:** two solids at every closing room; five asks on the exchange.
- **2.6 Content:**
  - "5" is a figure with no visible meaning.
  - Built For titles keep an empty first column now that the numerals are gone.
  - Text under the floor: the meta labels ("Available now", "Exchange infrastructure", "Chain resource directory") are 12px at both widths.
  - On the phone: the stat labels "FAILOVER / LATENCY / CHAINS" (13), the chain chips and product links (13.5), the directory filters (13.5) and Copy (12.5).
- **2.7 / 2.8 Visual and components:**
  - the deck's 0 gutter;
  - the native search input;
  - fake language tabs;
  - the License text and the GitHub link styled as identical chips;
  - the dialog sits under the header;
  - no hover on 60+ buttons.
- **2.9 Motion:** the sibling card-to-page open is missing.
- **2.10 Media:** none (per the coverage file Hanzo has none for these products, so the objects must carry the page).
- **2.11 Mobile:**
  - Two scroll traps: the code block and the chain picker's 248px inner list each swallowed 3 finger flicks in a row (the page did not move).
  - "Learn more" is 22px tall.
  - The phone deck has 0 gutter.
- **2.12 / 2.17 JS off:** 3 of the exchange's 4 products (DEX Aggregator, Order Book Engine, Liquidity Network) stay in `hidden` tab panels.

## Fixes (in order)
1. **Put the deck back inside the page, and give its card a face.**
   - Delete `width:100%` on `.xb2-deckx-g`, so the headline, marks and card keep the kit gutter at both widths.
   - Fill the card's empty top with this member's own object for that capability. For example, the line of its own code that does it, typed, or the chains it runs on. Otherwise shrink the card to its words.
   - Cut the pin to about 25svh per card.
2. **One thing of its own per member (still open from last round).** The 15 key-card pages are one page with a new word. Bundler: a UserOperation dropping into a bundle. DeFi: a swap routing through the router. Explorer: a block landing. Use the member's own code and chains; the exchange's console proves the template can switch objects.
3. **Fix the first screen at 1470×801.**
   - Rest the stage at scale 1, so the key card's bottom sits above the fold.
   - Close the empty band above the title.
   - Get James's ruling on the h1: JAMES.md says 72px or more; the kit now says 52. Until then, this family can opt its h1 up to a display size.
4. **Make the tail a story, not a document.**
   - Pin Built For beside the code and light the matching lines as each row comes in.
   - Let the Supported Chains chips feed the picker instead of sitting beside empty white.
   - Fix the Built For indent.
5. **Exchange:**
   - Give the code section its heading, or let the code take the full width (today half the screen is empty grey).
   - Bring the moving panel onto the phone's first screen.
   - Make "Learn more" 44px.
   - Render all 4 panels readable with JS off.
6. **Every control real.**
   - Language chips: make them working tabs, or plain text with no pill.
   - The "hanzoai" GitHub link must look and act like a link and differ from the License text.
   - Add a hover (not opacity) to the key card's "Try Hanzo", the chain chips, the directory filters and "Learn more".
   - On the phone, take the inner scroll out of the chain picker and the code block, so a flick always moves the page.
   - Raise the 12px meta labels and the phone's 13–13.5px text to the floor.
7. **Directory:**
   - Replace Chrome's blue search × with an ink one (`::-webkit-search-cancel-button{appearance:none}`).
   - Raise the open sheet above the header, or dim the header with the scrim.
   - Show the first chain row on the phone's first screen.
   - Label the 10 marks (the legend as column heads, or the product name on tap).
   - End on a closing room with Hanzo's own words, as James approves.
8. **Close the loops.**
   - The sibling card must fly into the next page's h1, not snap the old page to its top first.
   - Keep the header outlined while the closing room's white button is on screen (a request to the Ask owner), so there is one solid.
   - The chain picker's bare "5" needs its register sentence approved, or it goes.
