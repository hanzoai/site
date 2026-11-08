# /platform: James-eye review

Verdict: 6/10 for the last committed design. As served on the dev server at 14:52 UTC it would be 4/10 (see "Live regression" below).

First complaint: "It's too much. It goes on for twenty-five screens: boxes with three or four little buttons under every one, three columns of numbers, a paragraph of small print. The bit where you go down through the stack is good, but when I stop scrolling nothing moves. And the first thing I see is a big blank white card."

Reviewed: branch `claude/ecstatic-edison-nyv8vo`. Page files as committed at `6bad886` (Platform v3), walked 7 Nov 14:05–14:45 UTC. Shared ask bar re-measured at `2106935`, because another chat changed `components/Ask.jsx` twice during the walk. The working tree was re-checked at 14:52 (uncommitted edits by the owning chat, files hash `6deb41f71516`).
Walked on the dev server, moving, at 1470×801 and 375×812, with JS on, JS off and reduced motion. Evidence: a scripted 16 s film, a 0–6.5 s first-screen frame log with pixel diffs, a per-screen idle-motion log, hover and press probes on every kind of control, a solid-button and ask-bar probe every 400 px, and contrast, font-floor and tap audits. The once-per-session arrival curtain was skipped, so the page is judged on its own.
Proof: `platform.jpg`: desktop first screen (v3) | phone first screen | desktop first screen in flight at 14:52, showing the black disc.

## Live regression (in-flight working tree, 14:52 UTC; fix before anything is committed)
- `Platform.jsx` now moves `.xpl-jr-bg` as a rising card (`y`, `scale` 0.94 at rest), but `Platform.css` still draws it as a 200 px disc. The result is a black ball under the hero stack on the first screen. The dark room also never opens: for the whole 6-screen journey the map's white headline, rows and figures sit white on white under a dark-grey header.
- Six mono tags (Retrieve / remember, Understand / edit, Build / ship, Edge…, Telemetry…, Catalog) are now 12 px at 4.35:1, below both the 13 px floor and 4.5:1.
- The new `CodeBlock` puts a faint grey "Copy" before the command. On the phone it clips the command to "docker run -p 8080:8".
- The new proof strip (95.6% / 3.02× / 2.0×) renders as tiny unstyled bullet rows above the Band.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Desktop: yes, just about. The h1 is server-rendered and steady (111.7 px on 102.8 px leading, box fixed at y=156 from first paint). The marquee and the slab move by 800 ms. But the object is an empty white slab with "01" in the corner, so nothing on it says "cloud" or "eleven layers". **Phone: no.** The first screen is h1, lede, two buttons and the command, with no object. The pixel diff is 0.0% from 0.8 s to 6.5 s: nothing moves at all.
2. **One in, one out, or a document?** Half and half. The journey is a real Apple scene: the night opens from the stack, the plates part, the camera visits API → MIND → ACT → RUN → SILICON with that group's words pinned, and the night closes back into the stack. The six-chapter Planes block is also one in, one out. Between and after them it is a document: Kernel, a five-tile grid (each tile with a sentence, a mono tag and 3–4 pill buttons), the ring, a three-column facts row plus a 5-line footnote, One API, Open, the directory, the Band. That is 20,357 px, about 25 screens at 1470×801, and 31 screens on the phone. James: "an overload of information".
3. **A real object in every section?** Mostly. Stack, fan, tile drawings, ring, console, data shapes, wires, locks, rail, tapes, terminal, directory with its Sigil preview. Two exceptions: the facts row is three numbers and a footnote with no object, and the Semantic + Graph tile has about 300 px of empty card under its figure.
4. **One ask, sticky after the hero?** Yes, but only since the shared bar was fixed at `2106935`. The bar carries "Start building" from the first scroll at both widths, the header's "Try Hanzo" turns to an outline, and the Band repeats "Start building". On the committed v3 the bar never appeared at any width, because the closed inspector sheet keeps `aria-modal="true"` in the DOM and the old bar treated it as an open overlay. Through the 6-screen journey the only ask was then the header's solid "Try Hanzo", a different verb.
5. **Every hover and press answers, no jumps?** Mostly yes. The hero asks shift fill and press to 0.98. Pills invert. Rows slide 8 px. Directory rows nudge and reveal their arrow. Ring steps fill. Copy presses to 0.92. Kernel cards fill. Tiles play their drawing. Gaps: "Explore", the facts links and the directory group heads have no press state; the Band's "Read the docs" has no hover. **Bug:** on desktop the inspector sheet's counter and close button sit under the sticky header (header z 300, sheet z 90, close at y 26–70, header bottom at 60). A click on the visible half of the close lands on the header and the sheet stays open, and keyboard focus opens onto a hidden control.
6. **Overlap, font swap, layout shift?** No font swap or shift: CLS 0 on desktop, 0.003 on phone, no sideways scroll. **Overlap:** the sheet head under the header (answer 5). In the journey the faded plates also run under the finder field and the ZAP bar.
7. **Which reference, and is its motion there?** apple.com product page: pinned scenes where one panel changes (journey and Planes), plus one 3D object (the stack, which turns to the pointer by up to about 6°). That earns its place. Headlines cut into their line masks. Missing from his list:
   - Count-ups (95.6%, 3.02×, 11 and 4 are static).
   - A marquee whose speed answers the scroll (a fixed 38 s CSS loop).
   - Cards that open into their page: directory heads carry `data-morph`, but nothing opens.
8. **Different from its neighbours?** Yes: the iso stack and the camera are its own. One echo: the Compute chapter's console shows the same four services (gateway, payments-api, checkout-web, docs-site) as 36 of the 42 /cloud pages.
9. **All 18 parts covered?** No, see below. `docs/coverage/platform.md` exists (committed during the walk), but several of its claims do not hold (listed below).
10. **Banned tells?** No hue, no gradient text, no eyebrow over the h1 ("Hanzo Platform" sits under it). Present:
    - "Three equal boxes in a row": the facts row (11 / 4 / Measure the work), the three "homes" in Anywhere, and the four equal kernel targets.
    - "Explaining sentences under every tile": five tiles, each with a sentence, a tag and 3–4 pills.
    - "HANZO / ARCHITECTURE MAP" sits 100 px above "One stack." at the same left edge and reads as an eyebrow.
    - A tracked mono-caps label under nearly every heading (Retrieve / remember, Build / ship, Research / recursive improvement, Open, Catalog…), which is the AI-template look he rejects.
11. **Copy untouched?** Yes. `scripts/parity.py /platform`: text 330/330, links 129/129. One visible new string: "Pause" on the One API control. `content/ui-strings.json` does not exist yet, so nothing is registered.

## Missing from the 18 parts (PLAN-COMPONENTS §2.1–2.18, measured)
- **2.1 Strategy:** Persona, Goal (`api_key_created`) and CTA are in the header. One solid per viewport now holds at both widths (it did not on v3). `lib/cta.js` does not exist (site-level).
- **2.3 First impression:**
  - Phone fold: 0 px of the product peeks above the fold (the plan asks for 80 px or more).
  - Morph: no card opens into its page.
  - Section rhythm: dead white gaps of about 450 px (after the night closes) and about 300 px (after the footnote).
  - The 5.9 order puts the directory after the hero; it sits at screen 22 of 25.
- **2.4 Conversion:** the Band's "Start building" has no `data-cta`. The kit `Copy` shows its tick even when the clipboard is blocked (the owner notes this too).
- **2.5 Trust:** figures sit beside their method lines (good). There is no count-up on any hero figure.
- **2.6 Content:**
  - v3: one 12 px run on desktop ("API · console · identities · bill") and six 13 px chapter numbers on the phone (floor 14).
  - In flight: six 12 px tags at 4.35:1.
- **2.8 Components:** 0 bare `:hover` and 0 `title=` (good). No press state on text links. The sheet close is under the header.
- **2.9 Motion:**
  - Idle log: 16 of 25 desktop screens and 19 of 31 phone screens do not change at all without input.
  - The six journey screens move only while you scroll, so here scroll is the motion. That breaks JAMES 9 ("not everything is a scroll animation").
  - The marquee (an infinite 38 s loop) and the auto-turning ring have no pause control (WCAG 2.2.2). The ring only holds while the pointer is on it.
  - 1 `setInterval`. Reduced motion is clean: 0 infinite animations after 3 s.
- **2.11 Mobile:** 31 screens long. No first-screen object or motion. Taps are all 44 px or more and nothing scrolls sideways (good).
- **2.12 Accessibility:** focus is obscured on the desktop sheet (it opens onto the hidden close button). Contrast is clean on v3 but fails in flight. No marquee pause.
- **2.15 Catalogue:** the 5.9 directory is well made (44 px rows, four columns, preview with the existing description and Sigil), but it is buried, and its columns are uneven (5/5/4/4/5/5/4) where 5.9 says to remove uneven lists.
- **2.16 Developer:** copy equals the displayed text on v3. The in-flight `CodeBlock` clips the command on the phone.
- **2.17 States:** with JS off, everything reads except the five ring steps (hidden). There is no error boundary around IsoStack or Sigil (owner gap).
- **2.18 Measurement:** `data-cta` is on the hero only. `docs/LEDGER.md` does not exist (site-level).
- **Coverage claims that do not hold:**
  - "One filled primary per screen" was false on v3.
  - "The site's ask bar carries the same words after the hero" was false on v3.
  - "UI strings only in aria-labels" is false: "Pause" is visible.
  - "Every hover changes something" misses the Band link.
  - The sheet overlap is not mentioned.
- **§4 gate lines that fail:**
  - 2: no `PageHero` (not in the kit); raw `.x-btn` on the hero asks in v3.
  - 3: literal radii instead of tokens; no `data-cta` on the Band's primary.
  - 5: JS-off hides the ring steps.
  - 6: overlap at 1470×801 (sheet head under the header); LCP and INP not measured.
  - 7: no rubric scores.
  - 8: no ledger file.
  - Passing: 1 and 4, plus one h1, no raw img/video/table, no sideways scroll at 320, and CLS ≈ 0.

## Fixes (in order)
1. **Repair the in-flight build before committing:** make `.xpl-jr-bg` the rounded card the JSX now animates, or revert the JSX to the disc. Restore the mono tags to 13 px and 4.5:1. Make the `CodeBlock` read command-first with Copy at the end, and stop it clipping at 375.
2. **Cut the page to one story, with no copy lost:** hero → journey → Planes → directory → Band. Move the five Reach tiles into the inspector pattern: one row per capability that opens a sheet holding its sentence, figure, drawing and pills. Fold "11 native layers" and "4 GPU backends" into the journey as the stack's own figures. Put the footnote in a disclosure. Target 15 screens or fewer at 1470×801 and 20 or fewer on the phone.
3. **Make the first screen show the product.** Rest the stack slightly open, with the 11 layer names readable on the plate edges, not a blank slab. On the phone, put that stack on the first screen under the h1 and let it turn or breathe by itself.
4. **Make the journey alive when you stop.**
   - While a group is lit, its plates breathe and its figure counts up once (95.6%, 3.02×).
   - The marquee speeds up with scroll velocity and settles back.
   - Give the marquee and the ring a pause control.
5. **Fix the inspector sheet:** start the panel below the header (`top: calc(var(--hdr) + 12px)`), or lift it above the header. The close button must be clickable and visible when it takes focus.
6. **Break the equal rows:** make the facts row one giant "11" with the others smaller beside it, set the three homes and four targets at different scales, and cut the empty space in the Semantic + Graph tile.
7. **Every control answers:** add `translateY(1px)` to "Explore", the facts links and the directory heads, a hover to the Band's "Read the docs", and `data-cta` to the Band's button.
8. **Open into the page:** directory rows and heads should Morph into their destination's hero, or crossfade for 250 ms where the destination has no target. Then correct `docs/coverage/platform.md`.
