# /features: James-eye review

Verdict: 5/10
First complaint: "The keyboard is the idea, and it's broken. The black screen is meant to show the feature I press, but it shows a sentence with an empty gap where the name should be and '3 / 0' in the corner. I can't see the keys until I scroll, and on my phone the screen is off the top by the time I tap one. Then at the bottom there are two 'Ask Hanzo anything' boxes, one after the other. Under the keyboard it's the same page as the others."

Reviewed: branch `claude/youthful-gauss-hiiqm9` @ `ffe7921` (not on main). The walk started at `514188b`. The branch moved twice while I worked (phone 14px floor, hero lede no longer starts at opacity 0, PinChapters rail hover and a phone layout change), and every finding below was re-checked on the current tree. Files hash: `b55ac7178f72`.
Walked 7 Nov 14:15–14:40 UTC on the dev server at 1470×801 and 375×812 (touch). I used a wheel-driven screencast, arrival and idle frame bursts with a frame-difference log, hover and press probes with real hover media, JS off, 320 wide and reduced motion. The cookie note was skipped. Every request to api.hanzo.ai was intercepted: the chat was tested only with a local mock reply and with an aborted request, and nothing reached the live API. No hanzo.ai images are used on this page; the Enso avatar is local and loads.
Proof: `img/features.jpg` (desktop first screen | phone first screen, settled). Both show the empty title band on the display and the "3 / 0" counter.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half.
   - **Desktop.** The h1 is strong: 91px with line-height .92, and it cuts in by line mask. The keyboard's display swaps feature every 2.1s with no input. But the object under the title is a black panel holding a description, a 60px empty band where the feature name should be (`.xft-feat h3` computes `rgb(10,10,10)` on `#0a0a0a`, 1.0:1) and a "3 / 0" counter, with the finder bar on the fold. The keys, which are what make it an instrument, start about 835px down, below 801.
   - **Phone.** The h1 runs 4 lines at 41px, then the label, the lede and three pills on two rows. Below that, the top 160px of the display shows its label wrapping into the pause button ("HANZO CHAT · / DEFAULT", "3 / / 0"). The keys are a full screen further down.
   - **Dev-mode note.** "PLATFORM FEATURES" sits alone in white for about 0.8s before the h1 rises. This may be dev hydration only.
2. **One in, one out, or a document?** At section level, yes: keyboard, then three pinned chapters (rail 01–03, words swap with 48px travel, the product UI changes), then the dark room. Inside each chapter, no. The words column shows 4 titles and 4 two-line descriptions at once, which is a list. Across the page each feature name appears four times (keycap, display, chapter list, chapter UI chip or terminal line) and each description twice. That is the "overload" James named.
3. **A real object in every section?**
   - **Hero:** the keyboard, a built object with real travel.
   - **Chapters:** illustrations made of words, not Hanzo product. The chat mock is a bubble whose user message is the placeholder "Ask Hanzo anything", plus chips of the four feature names. The Dev mock is a terminal ticking the four names under an invented `$ hanzo dev`. The Design mock is a node graph labelled agent/model/tool/memory.
   - **Dark room:** the live chat, which is real.
   - **Media:** apart from a 36px Enso avatar there is no Hanzo media anywhere, so the page is white, grey and black from top to bottom with no colour moment.
4. **One ask, sticky after the hero?** Mostly.
   - **What works.** "Open Chat" is the one solid in the hero (`data-thumb`, `data-cta="features.hero"`), and the ask bar carries it.
   - **Three pills in the hero.** The hero has "Open Chat", "Launch Dev" and "Try Hanzo", and "Try Hanzo" appears twice on the first screen (header and hero ghost, same /signup).
   - **The bar arrives late.** It waits until the whole hero section, keyboard included, has left. Between about 470px and 1,215px of scroll on desktop, and about 600px to 1,800px on phone, the only solid on screen is the header's "Try Hanzo", not the page's ask.
   - **The close.** It has no "Open Chat" except inside the error line.
5. **Every hover and press answers?** Mostly, and the keys are the best touch on the page.
   - **Primary:** it follows the pointer (12px), darkens to #2c2c2e, nudges its arrow 3px and presses at .98.
   - **Ghosts:** ink border plus a 4% veil, press .98.
   - **Keys:** a 1px lift on hover and 4px of travel on press with the shadow collapsing. But hovering a key does not preview its feature on the display, so the hover tells you nothing.
   - **Suggestion chips:** border and text brighten, press .98.
   - **Pause:** 92% to 100% white, which is barely visible, and press .94.
   - **Rail:** colour and bar growth (new on this branch).
   - **No response:** the chapter rows and the chapter UIs react to nothing.
   - **Finder:** "pdf" and "voice" each light one key ("1 of 10"). "image" dims all ten keys to .35 and says only "0 of 10".
   - No jumps anywhere.
6. **Overlap, font swap, layout shift?**
   - **Stable:** CLS 0 on load and 0 shifts across a full wheel walk. The h1 box holds (Zen loaded, no swap). No horizontal scroll at 320 or 375.
   - **Phone display:** the label and counter (`.xft-screen-top`, 14px) wrap into the 44px pause button.
   - **Phone dark room:** as it rises, the ask bar sits on the first suggestion chip, "How does Enso route a prompt?".
   - **Desktop dark room:** the ask bar crosses the "Try Hanzo" heading as the room enters (transient).
   - **Desktop chapters:** the pause button floats alone 60px above the visual at the right edge (`top:-60`), detached from what it pauses.
7. **Which reference, and is its motion there?** apple.com product page: the pinned chapters with a progress rail are there. synchronized.studio: no. Nothing opens into its page; the Hanzo Chat, Dev and Design chapters do not link to /chat, /dev or /design, and the keys open nothing. The self-playing keyboard is its own idea and a good one.
8. **Different from its neighbours?** The hero medium and signature are its own. The frame is the Business 2 template shared with /tabs, /risk, /sign, /treasury and /ui: LineMask h1, lede and buttons row, Settle stage, PinChapters with the 01–03 rail, one dark room, magnetic ink pill. Under the keyboard it reads as the same page.
9. **All 18 parts covered?** No; see below. `docs/coverage/features.md` exists but claims two things that are not true on screen: "its feature lighting on the display" (the name is invisible) and "JS off: NoJs" (the display smears).
10. **Banned tells?** Yes:
    - **An eyebrow above a headline.** `p.w2-kicker.acc` "Hanzo Chat" sits above the `h2` "Try Hanzo" in the dark room. It is also invisible: `rgb(10,10,10)` on `#050506`, 1.03:1.
    - **A browser-default tooltip.** The mic button carries `title=` ("Talk to Hanzo", "Listening — click to stop").
    - **Clean:** a computed-colour scan of `<main>` finds 0 hues. There is no green, and no button fades on hover (`.xft-ctl:disabled` .5 and `.xft-key.dim` .35 are states). The blue "Privacy choices" toggle belongs to the shared footer, not this page.
11. **Copy untouched?** Hanzo's copy is all there. All 30 page-content units (indices 10–39 of `content/live/features.json`) are in `<main>` at both widths, and the three hero links (/chat?skip=login, /dev, /signup) are present. `parity.py` reports MISSING only for the header and footer units outside `<main>`. "Platform Features" moved from above the h1 (live) to below it, a reorder only. But the page adds visible strings that are neither Hanzo's nor in `content/ui-strings.json`:
    - the three suggestion questions ("How does Enso route a prompt?", "What can Hanzo Dev do in my repository?", "What is sandboxed execution?");
    - the finder placeholder "Find a feature: PDF, refactor, voice…";
    - "No answer came back this time.";
    - the "N / 0" counter;
    - `$ hanzo dev` and agent/model/tool/memory;
    - the tooltip strings.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy / 4 Common gate:**
  - `Persona:`, `Goal:`, `CTA:` and metric `first_chat` are present.
  - The hero carries three pills (one solid, two outlined), and "Try Hanzo" appears twice on the first screen.
  - The page ask is absent for about 750px on desktop and about 1,200px on phone after the hero CTA leaves.
- **2.3 First impression:**
  - The signature object's keys are below the fold at 1470×801. On phone, a tapped key's feature lights on a display about 570px above the viewport (measured: display bottom at −280 when key 9 is tapped), so the tap answers out of sight.
  - JS off: the ten `.xft-feat` blocks all render at opacity 1 in one grid cell, an unreadable smear of ten descriptions on the first screen.
  - The close is a chat, not a Band repeating "Open Chat".
- **2.4 Conversion:** `data-cta` is only on the hero. The chat send, which is the page's literal first_chat moment, carries no `data-cta` or event.
- **2.6 Content:**
  - The display title has 1.0:1 contrast.
  - Feature names repeat four times and descriptions twice.
  - 10 text runs at 13px on phone remain inside the aria-hidden chapter UIs (bar labels, "routes each prompt", graph nodes). The new floor exempts them, but they are visible.
- **2.7 Visual system:**
  - `Features.css` holds 48 hex literals (18 unique) and 27 `rgba()` literals instead of the `--hz` and `--room` tokens.
  - No Hanzo media, so no colour moment.
  - Stale header comment "pink accent" at `Features.jsx` line 3.
- **2.8 Components:**
  - `title=` tooltip on the mic.
  - 2 bare `:hover` rules (`.xft-key:hover`, `.xft-asks button:hover`).
- **2.9 Motion:** the mix is good (arrival, idle autoplay, pointer, typing and streaming, key state, scroll). But the self-playing display is `aria-live="polite"`, so it announces every 2.1s, and autoplay runs whenever it is in view.
- **2.10 Media:** one 36px avatar. The chapters could hold real Hanzo Chat, Dev and Design product renders or films and do not.
- **2.11 Mobile:**
  - The display label collides with the pause button.
  - The ask bar covers a suggestion chip.
  - The hero pills wrap to two rows and push the object down.
  - The chapters' pause button floats alone between the keyboard and the chat mock.
- **2.12 Accessibility:**
  - Heading skip: h1 is followed by ten `h3`s in the display before the first `h2`.
  - Contrast fails: display label and counter `#6e6e73` on `#0a0a0a` at 3.9:1; terminal dim lines 3.9:1; display h3 1.0:1; dark-room kicker 1.03:1.
- **2.15 Product pages:** nothing on the page links its three products to /chat, /dev or /design, and there is no Morph.
- **2.17 States:** the chat shows thinking, streaming, done and error (verified with a mock and an abort). But the `fetch` has no timeout or AbortController, so a stalled network leaves it "thinking" forever, and the error sentence is invented copy.
- **Passing:** one h1, one main, no horizontal scroll at 320 and 375, CLS 0, reduced motion static (0 running animations), 44px targets, pause on both demos, 0 API calls on load, all 30 copy units present.

## Fixes (in order)
1. **Make the display work.** Give `.xft-feat h3` the screen's ink (`color: #f5f5f7`); the global heading colour is beating `.xft-screen`. Replace "N / 0" with the keycap number alone, or "3 of 10" using the register's "of". Make the ten display features `p`/`strong` (or put an `h2` above them) so the outline stops jumping h1 → h3. Drop `aria-live` while autoplaying and announce only a key the visitor presses.
2. **Put the keys on the first screen at both widths.**
   - **Desktop:** at 801 high, show the display and at least the top row of keys. Cut the hero's 100px top padding and the 120px minimum on the display, or set the display beside the board.
   - **Phone:** keep the display in view while keys are tapped. Make it sticky above the board, or let the lit key itself expand to show its feature.
   - **Hero pills:** reduce them to one solid plus text links ("Launch Dev"; drop the hero's second "Try Hanzo", which repeats the header), so they fit one row and the object rises.
3. **One chat, no eyebrow.** Delete the "Hanzo Chat" kicker above "Try Hanzo". Then either drop the page's dark-room prism in favour of the footer's own, or give the dark room that prism and suppress the footer copy on this page; never two in a row. Put `data-ask-hide` on the room so the bar stops covering the chips. Add `data-cta="features.chat"` to send, and a 6s AbortController timeout.
4. **Strip invented copy.** Delete the three suggestion questions. Drop the finder's visible placeholder, keep "Find a feature" as its aria-label, and add that string to the register for James's yes. Replace "No answer came back this time." with the register's `failed` string plus Hanzo's "Open Hanzo Chat" link. Remove `title=` and keep `aria-label`. Delete `$ hanzo dev` and the agent/model/tool labels unless they come from Hanzo's copy.
5. **One thing in, one thing out in the chapters.** Show one feature per scroll step: the chapter's list lights one row at a time while the visual answers that row. Replace the word-chip and terminal mocks with real Hanzo Chat, Dev and Design product renders or films; that is also where the page's only colour should come from. Link each chapter to /chat, /dev and /design with Morph, so the product opens into its page.
6. **JS off and phone polish.** Under no-JS show only the first `.xft-feat`. Move the chapters' pause into the visual's corner, not `top:-60`. Raise the display label to `#a1a1a6`. Make key hover preview its feature on the display. Swap the literal hexes for tokens, wrap the two bare hovers, and fix the stale "pink accent" comment.
