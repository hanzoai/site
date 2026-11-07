# /search: James-eye review

Verdict: 6/10
First complaint: "Better. The sizes are calm now, and nothing sits on top of the words. But once you're past the four ways, nothing moves unless I touch it. The dark room, the frameworks, the prices and the ending just sit there, and on my phone it's dead after the first screen. And the ending is the same black block as Stream's."

Reviewed: main @ `504a7ae` (last page commit `42470f7`). Files hash: `2615899eada7`
Walked 7 Nov 15:15–15:20 UTC on the dev server, moving, at 1470×801 and 375×812 (videos, frame sheets and a frame-difference motion log kept by the critic; the site loader was skipped).
Proof: `img/search.jpg` (desktop first screen | phone first screen).

## Since the last review
- **Done: nothing floats over content.** The shared fix (648b798) and this page together removed the bar. The walk found no floating bar or panel on any of the 32 screens at either width. On desktop the header's button reads "Read the docs" from s1 on. It turns to an outline whenever another "Read the docs" is on screen (s0, s9–s11), so one solid shows at a time. Last time the phone tap on "Copy" landed on the bar and left the page. Now it answers.
- **Done: scale has a rhythm.** These now rest at the deck sizes:
  - the h1 at 52px (was 116);
  - section heads at 26px (was 56);
  - chapter-01's "Kubernetes" at 64px, as that screen's one big thing (was 92);
  - the framework names at 32px (were 44);
  - "Get Search" at 26px (was 96).

  The prices rest at 44px (were 68), and the fitted plan's price grows to 1.18× while it fits. No screen has more than two runs at 44px or more.
- **Done: one ending, no three boxes, presses.**
  - The page ends once: a dark `Finale` with the bar answering "Kubernets", then "Get Search" with the prompt, then "Related capabilities" as one line of links (s11–s12).
  - Pause now presses (0.97). On phone the vector map labels no longer collide (round dots and a list under them).
  - `Search.jsx` has no springs left.
- **Still open: motion below the chapters.**
  - Desktop: s6 to s12 are STILL (shotdiff 0 from the dark room to the end).
  - Phone: 17 of 18 screens are STILL (last time 18 of 19).
  - `HowBar` still says "nothing here runs by itself".
  - The phone chapter pictures still play on mount, so they have finished before you reach them.
- **Still open, smaller:**
  - On phone "GitHub", "View on GitHub" and "Deploy to Cloud" are still 21px tall, and the card's part 11 still says "targets ≥44px".
  - The drawer still holds the gateway console.
  - The metric id is still not one of MASTER §1's.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Yes, at both widths.
   - **Desktop:** all of this fits inside 801px:
     - "Hanzo Search" at 52px, with "HYBRID SEARCH + RAG" as a caption under it;
     - the lede, "Read the docs" (solid) and "GitHub →";
     - a search bar the width of the page with its 32px query, the four modes and the first two results.

     The body is blank on the film until about 2.5 s. That is the usual dev-server wait, and the walker's "0/25 in the first second" falls inside it. Then the h1 rises, "K → Kubernets" types itself in about a second, and the modes take turns every 4.2 s (d-sheet-01 and 02: Text, Vector, RRF). The walker logged 10/47 moving frames in the rest of the 3 s, and s0 shotdiff 1.46.
   - **Phone:** the 40px title, caption, lede, ask, bar, four modes and two results are all inside 812px. 5/25 frames move in the first second and 38/55 after it.
   - Every screen has one big thing with medium and small around it. On the first screen that thing is the bar, not the title.
2. **One in, one out, or a document?** One in, one out down to the end of the chapters. After that it is a document.
   - **Desktop, top half:**
     - The bar settles to the top and keeps answering: at s1 the RAG answer streams, shotdiff 4.9.
     - "Four ways to ask, one index" pins, and one panel changes per chapter. Full text shows the corrected Kubern**e**tes. Vector draws its map (seen in the film between s3 and s4). In Hybrid the two lists fuse into one: the s4 shot pair goes from two columns to one ranked list, shotdiff 8.3. In RAG chat the answer streams, then its two sources appear (s5, shotdiff 4.6).
   - **Desktop, after the chapters:** stacked sections, each waiting for a hand. The dark room, the frameworks picker, pricing, the dark ending and "Get Search" are STILL from s6 to s12. With s2 and s3, that is 9 of the 13 page screens.
   - **Phone:** the chapters stack, and each picture plays when the page mounts. By the time you scroll to Hybrid the lists are already fused, and the RAG answer is already written (p-sheet-03). 17 of 18 screens are STILL.
   - There is still about 250px of empty white under the settled bar at s1, before "Four ways to ask".
3. **A real object in every section?** Yes.
   - **Hero:** the bar.
   - **Chapters:** four pictures: the corrected word with its chips and rows, the map by meaning, the fused rank and the streamed answer.
   - **Dark room:** a small bar with four documents landing in it.
   - **Frameworks:** a picker that sets its own bar ("Hanzo Docs | native | /v1/search").
   - **Pricing:** the fit-finder: Projects 5 and Docs 10k give "fits Build", and the Build card takes the ink ring.
   - **Ending:** the bar again with "one merged rank", then the agent prompt.
   - **Weak spot:** "See the example console" opens a sheet on phone (p-sheet-04). It still holds the shared gateway console (gateway, payments-api, checkout-web, docs-site, and "Every request enters here, so the limiter does too."). Nothing in it is about search.
4. **One ask, nothing floating, scale with rhythm?** Floats and scale pass. The ask passes on desktop.
   - **Ask, desktop:** "Read the docs" is solid in the hero. From s1 to s12 the sticky header carries it in Hanzo's words, and it steps down to an outline while another "Read the docs" is on screen.
     - On arrival the header shows "Read the docs" solid for about half a second, then flips back to "Try Hanzo" (d-sheet-01, frames 6–7). This comes from the shared `Ask.jsx` timing.
   - **Ask, phone:** the header keeps Hanzo's "Try Hanzo" solid black the whole way, and no page bar appeared on any of the 18 screens.
     - So the first screen has two solid black buttons, "Try Hanzo" and "Read the docs" (first-screen solids at y 8 and y 314).
     - At s11 the black "Try Hanzo" sits above the ending's white "Read the docs".
     - This is the shared header's phone rule, not the page, but MASTER part 4 says one solid at a time.
   - **Floats:** none. The FLOATS list is empty on every screen at both widths, and the shots agree. No cursor label, no pill bar.
   - **Scale, desktop:** 52 / 26 / 21 / 17px. There is one 64px "Kubernetes" while chapter 01 is lit, and five 32px framework names. The prices rest at 44px, and the fitted one grows to about 52px. "Make your content searchable and conversational" is 32px, and "Get Search" is 26px.
   - **Scale, phone:** 40 / 26px, with a 44px "Kubernetes" and 44px prices.
   - **One nit:** the five 32px framework names outrank their own 26px heading (s8).
5. **Every hover and press answers?** Yes, apart from the selected states.
   - **Hover and press (desktop):**
     - These press to 0.98: hero "Read the docs", the Text, RRF and RAG tabs, the "01" rail tick, "See the example console", the two step cards, "Contact Sales" and "hanzoai".
     - Pause presses to 0.97 and Copy to 0.93.
     - "GitHub", "Deploy to Cloud", the framework rows and the "Chat →" and "Bot →" links press 1px.
   - **Logged dead:**
     - "Vector": it was the selected mode when hovered, and the selected tab has no hover.
     - "Hanzo Docs": the selected framework.
     - The plan slider. The source gives its thumb a 6px halo on hover and a 1.15 grow on press. That is drawn on the range thumb, which the walker cannot read, so I don't count it as dead.
   - **Phone taps:**
     - "Text", "Let people ask instead", "Fumadocs" and "Copy" answer.
     - Pause swaps to a play icon (p-sheet-01, last frames), and the console sheet rises (p-sheet-04). The walker logged both as "no visible change".
   - No jumps, and no opacity-only hover.
6. **Overlap, font swap, layout shift?** One small overlap on phone.
   - **Phone, chapter 01 (p-shot-02):** "typo fixed" wraps onto two lines, and its outlined chip spills over the top and bottom border of the "Deploy to Kubernetes" row. The overlap check misses it because the chip is a child of the row.
   - **Phone hero:** the first result is cut to "Deploy to Kubernet…".
   - The OVERLAP lines at desktop s6–s8 and phone s6–s7 are each step card's invisible hit button over its own heading. Nothing visible collides there.
   - The h1 box is steady (one reading at each width). CLS is 0.014 on desktop (one result row) and 0 on phone. There is no horizontal scroll at 375 or 320.
7. **Which reference, and is its motion there?**
   - **apple.com product page:** yes. A Spotlight-size bar is the hero. The copy steps back as the bar settles, and the chapters pin while one panel changes.
   - **motion.dev:** yes. The mode pill glides (`layoutId`, 300 ms ease-emphasis), and the hybrid rows re-flow into one rank.
   - **synchronized.studio:** absent. "Chat", "Bot" and "Crawl" are plain links, and no card opens into its page.
   - **anthropic launch:** absent. There is no hero figure.
8. **Different from its neighbours?** The hero is its own. The rest is the Cloud 4 kit.
   - **The hero:** no other Cloud 4 page centres a title over a full-width live search bar. /stream (walked at the same commit) has a dark partition tape with its title at bottom left.
   - **What it shares:**
     - The 52px h1 with a mono caption under it is `StageHero`, used on 7 pages (Billing, Stream, Sentinel, World, Telemetry, Visor, Search).
     - The pinned chapters with "0N / 04" under a 21px title and the tick rail are `PinScenes`, shared with /billing and /telemetry.
     - The ending is the same `Finale` as /stream, and `Finale` is on 9 pages: a black room with the closing head and a white ask on the left and the object card on the right, a hairline, then "Get X", a caption, the "License" and "hanzoai" chips and "Deploy to Cloud" on the left, with "Paste and ship" on the right. Put s11 next to /stream's d-screens-3 and the only differences are the words.
   - James: "It's not just a template."
9. **All 18 parts covered?** No; see below. The card has all 18 parts in the older numbered form, but its claims for parts 1, 4 and 11 fail the walk.
10. **Banned tells?** Yes, two:
    - **A dead page below the chapters:** 9 of 13 desktop page screens and 17 of 18 phone screens do not move untouched.
    - **An overlap at 375:** the "typo fixed" chip spills over its row (answer 6).

    Clean:
    - no hue at either width;
    - nothing above the h1 or any h2 (the caption, "0N / 04" and "Step 0N" all sit under their headings);
    - nothing floating, no cursor labels;
    - 0 `title=` tooltips and no browser-default controls;
    - no sound code of its own (the shared kit only);
    - no model cards;
    - 0 console errors at both widths.
11. **Copy untouched?** Yes. Parity is 103/103 text and 14/14 links.
    - The 14 new strings are demo data (the result titles, "How does RAG chat answer?", "docs ·", "text · vector") and labels ("typo fixed", "Which plan fits", "fits", "See the example console", "Open in the console ↗"). There is also the shared console's line "a build is running from the last commit on main."
    - The streamed answer is Hanzo's own RAG chat sentence. Nothing new is a claim or a number.

## Missing from the 18 parts (MASTER §2, measured; coverage card checked)
- **Coverage card:** `docs/coverage/search.md` covers all 18 parts as numbered paragraphs (no `Done here:` lines), but three claims fail the walk:
  - **Part 1:** "carried by the site's ask bar after the hero at every width". No bar showed on any phone screen; the phone header keeps "Try Hanzo". On desktop it is the header's button, not a bar.
  - **Part 4:** "One solid per viewport: hero ask, then the ask bar". Phone s0 and s11 each show two solid buttons.
  - **Part 11:** "targets ≥44px … the ask bar sits under the thumb". "GitHub" (68×21), "View on GitHub" (127×21) and "Deploy to Cloud" (132×21) are under 44px at 375 and 320, and no bar appeared.

  It also lists no copy questions. This caps the page at 7.
- **Part 1:** the metric "cta_click:search.primary" sits inside the CTA line and is not one of MASTER §1's ids (developers: `api_key_created`), so the check finds none. The V2 and CTA lines still name an "ask bar".
- **Part 3:**
  - About 250px of empty white under the settled bar (desktop s1).
  - No card opens into its page (Morph).
- **Part 4:** on phone the header's "Try Hanzo" stays solid beside the hero's "Read the docs" (shared header). On desktop the header shows "Read the docs" for about half a second on arrival before flipping back (shared `Ask.jsx` timing).
- **Part 7:**
  - `Search.css` still writes 59 literal hex values. They are all deck greys now (it had `#5f5f64` last time), but they are not `--hz-*` tokens.
  - Radii of 14, 10, 7 and 2px are off the token list.
  - The fitted plan is outlined and raised at once (ink border plus a 30/80px shadow).
  - Only the hero differs from its neighbours.
- **Part 8:** the selected mode tab and the selected framework have no hover. The family file `Frame.css` has 9 bare `:hover` rules and 5 `.x-btn` uses, and `Frame.jsx` has 2 springs and 2 `setInterval` timers. None of these parts renders on /search, but they are in the page's file list.
- **Part 9:**
  - Below the chapters nothing runs by itself (desktop s6–s12 STILL). The dark room is hand-driven only.
  - On phone the chapter pictures play on mount, not in view, so the page is 17 of 18 STILL.
  - Reduced motion settles (0 running after 3 s).
- **Part 11:**
  - The three 21px links above.
  - The "typo fixed" chip spills over its row at 375.
  - The hero card's outer frame runs to about 3px from the screen edges at 375, inside the 16px gutter.
- **Part 17:** the "See the example console" drawer shows the gateway's services and the gateway's limiter line, not search.
- **Passing:**
  - **Structure:** one h1 (visible with JS off, 0 hidden runs) and one main. No raw img, video or table. A band at the end. No horizontal scroll at 320.
  - **Look:** 0 hues. Nothing above any headline. Nothing floating. Scale at 52 / 26 / 64. 0 low-contrast runs. The only sub-floor text is three 12px mono captions. 0 title tooltips. Custom sliders.
  - **Stability:** the h1 box is steady, CLS is 0.014 and 0, and there are 0 console errors.
  - **Asks:** 8 `data-cta` and 1 `data-thumb`. The header carries "Read the docs" on desktop, and the Pause is first in the hero object.
  - **Sound:** the shared kit only, with nothing on hover, scroll or load.
  - **Copy:** parity 103/103 and 14/14.

## Fixes (in order)
1. **Keep it moving below the chapters.**
   - **Dark room:** in `How`, let the steps run by themselves while the room is on screen. Use `useSteps(3, 4200, live)` with a `useDemo` ref on the section, as `Ask` does. Hover, focus or tap holds a step, and a `PauseBtn` sits first in the room.
   - **Ending:** let `EndBar` replay the hero once when it reaches 60% in view: type "Kubernets" into its bar, then let the rows fuse into the merged rank.
   - **Phone:** in `Way`, start the fuse timer and `Streamed run` only when the picture is 60% in view (`useInView`), not on mount. Then the lists fuse and the answer streams while you are looking at them.
2. **Make the card true.**
   - **Parts 1 and 4:** on desktop the header's button carries "Read the docs" after the hero. On phone the header keeps "Try Hanzo" and no bar showed.
   - **Part 11:** remove the 44px and "ask bar" claims until a walk measures them.
   - **Header and card:** put a MASTER §1 metric id on its own header line, and list the copy questions, or "none".
   - **Shared request:** write `docs/requests/search.md` asking for the phone header's "Try Hanzo" to go quiet while the hero's solid ask is on screen, as desktop already does.
3. **Fix the phone details.**
   - Make "GitHub", "View on GitHub" and "Deploy to Cloud" 44px tall under 900px (`min-height: 44px; display: inline-flex; align-items: center`).
   - Set `white-space: nowrap` on `.se2-fixc` and `.se2-fix`, so "typo fixed" stays on one line inside its row and the title wraps instead.
   - Give the hero card the 16px gutter at 375.
4. **Put search in the drawer.** Pass `Console` the page's own rows (Deploy to Kubernetes, Kubernetes ingress, Cluster quotas, Scaling a service, on "/v1/search") instead of the gateway services and the limiter line. Or drop the drawer: the dark room's bar already shows the index.
5. **Tokens and surfaces.**
   - Swap the 59 literal greys in `Search.css` for `--hz-*` tokens.
   - Move the 14, 10, 7 and 2px radii to 12, 8 or 6.
   - Give `.se2-plan.fit` the ink ring or the shadow, not both.
   - Give the selected mode tab and the selected framework row their own hover (for example, the white pill's border turning to ink), so they answer too.
