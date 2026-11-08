# /zap: James-eye review (re-review)

Ready: 8 Nov 23:17, copycheck missing 0 of 49 (captured page), Hanzo's images kept. The kicker, the four points, the terminal's command lines and the Go · Rust · TypeScript line now read as one run of text each, as Hanzo writes them (the $ prompt is shaded with ::first-letter instead of its own element). taste/unique/parity OK (71/71, 7/7); 0 console errors, no overlap at 1470 and 375.


Reviewed: the zap files as of `33b0215e` "wip(zap): fixes in progress" (`Zap.jsx` and `Zap.css` clean in the working tree).
Walked 7 Nov, 16:10 to 16:50 UTC, on the dev server (`localhost:4180/zap/`), moving, at 1470×801 and 375×812 (touch).
- **How:** Playwright Chromium (`hover: hover` true on desktop). The walk scrolled in 0.6-screen steps with eased scrolling, then dwelled 2 s on each screen with a frame-difference count.
- **Also checked:** first-second frames, a layout-shift `PerformanceObserver` with sources, the h1 box per frame, and hover and press probes on every control type. Then the sheet with Tab and Esc, Copy against the clipboard, the slider by keys and drag, and a Tab crawl of `<main>`.
- **Settings and sizes:** reduced motion at both widths, JavaScript off at both widths, 320px and 375×667.
- **Gates:** `parity.py` and `taste.py`.

Proof: `/tmp/claude-0/-home-user-hanzo-site/9061de80-a992-5492-8b0b-675a346f197b/scratchpad/zap-critic/out/` (`d-s*.png`, `p-s*.png`, `tab-*.png`, `rm-d.png`, `issue-*.png`, `walk/probe/interact` JSON).

Verdict: 7/10
First complaint: "It's alive now and the top sells it. The cards slide past one at a time, the terminal types, the diagram draws itself. But that terminal jumps every few seconds and shoves everything under it. On my phone there are two black buttons fighting, 'Try Hanzo' up top and 'Read the docs' in the page, and the terminal chops words in half: 'end / point', 's / tdio'. It's the little things that stop it feeling premium."

## The 11 answers

1. **Does it sell in 5 seconds and move within 1 second?** Yes.
   - **Desktop:** "ZAP" sits at 52px with "Zero-Copy Agent Protocol" under it, and the lede and one solid "Read the docs" sit on the right. The wire panel fills the fold.
   - **Motion on load:** 9 of 11 frames changed in the first 1.1 s. The JSON highlight starts walking at 120 ms, and the pointer jumps every 2.8 s.
   - **The h1:** it is in the server HTML (`data-lm="play"`, a CSS rise), lands by 1.1 s on desktop and 1.4 s on phone, and its box never moves. With JS off it sits at rest (`transform` none).
   - **Phone:** title, lede, ask and the top of the buffer fit inside 812. The ask's bottom is at 415px at 375×667.
   - **Weak spot:** "GitHub" wraps alone onto its own line under "Read the Papers".
2. **One thing in, one out, or a document?** Mostly one in, one out now.
   - **"Why bother" is a pinned stage:** the eight packets ride one wire, one lands at a time (its header fills), and the 01 / 08 counter follows the scroll.
   - **Every section moves without input:** the terminal types, N:1 / 1:M / 0 cut in, the diagram's wires draw, the agent counter grows, and the band types its address. 13 of 15 desktop screens changed while I dwelled without input.
   - **Where it drifts back to a document:** the "Point one agent at it" screen (a text column and a grey paragraph box) and roughly 180px of empty white above and below the pinned stage.
3. **A real visual object in every section?** Yes.
   - **Hero:** the wire, which is the best object on the page.
   - **Why bother:** packets whose sixteen header bytes fill. Each tile is still about 60% empty grey between the bits and the title.
   - **Running:** the typed terminal.
   - **Built:** the figures, a drawn gateway diagram whose lines meet, and the sidecar counter with a drawn slider.
   - **Close:** a black band with an address that types itself.
   - **Weak spots:** the fleet's sidecar area is a fixed 108px box that sits mostly empty below about 8 agents. The diagram's "…" marks float outside their boxes (on phone, below the black panel).
4. **One ask in the sticky header, nothing floating, and scale with rhythm?**
   - **Desktop:** yes. The header ask becomes "Read the docs" once the hero ask leaves view. It turns to an outline while the close's solid is on screen, then solid again. Nothing floats over content.
   - **Phone:** no.
     - The header keeps "Try Hanzo" as a **solid black** pill on white, so the first screen has two solids (it and the hero's "Read the docs"). The close screen (y≈4380) has two as well.
     - Once the hero ask leaves view, a bottom bar says "Read the docs" while the header still says "Try Hanzo", so the phone shows two different asks.
     - With JS off, the desktop header is also solid black "Try Hanzo" beside the hero solid.
   - **Scale:** acceptable but flat. h1 52px, h2 26px, figures 64px, all at rest. The only growth is the wire's 3% Settle and the landed packet's 12px lift. Nothing becomes the one big moment and then shrinks back.
5. **Does every hover and press answer, with no jumps?** Mostly.
   - **What answers:**
     - The asks, field chips and text links press at .98.
     - The hero ask is magnetic, and its arrow nudges 3px.
     - The text links' underline turns solid.
     - A packet lifts 4px and fills all sixteen bits.
     - The band rows tint and their arrows slide 4px.
     - `a.zp-chip2` inverts and is now 44px.
     - The slider knob grows to 1.12.
   - **What does not:**
     - The hero ask's hover fill goes from `#f5f5f7` to `#fff`, which can't be seen; only the arrow tells you.
     - The slider has no press: the hover `scale(1.12)` overrides `:active scale(.92)`, so dragging looks the same as hovering.
   - **Jumps:** the terminal jumps (see 6).
6. **Overlap, font swap, layout shift?**
   - **Layout shift fails the budget.** CLS was 0.0209 on desktop and 0.0427 on phone (the budget is 0.02).
     - **Source:** the terminal. `.zp-term pre span.last::after` puts the block cursor after the line's `\n`, so on the last line it opens an extra row. The terminal measures 302↔332px on desktop and 375↔399px on phone.
     - **Effect:** every loop (about 6 s), "How it is put together" below is pushed down and back. On desktop the copy column beside it re-centres too (the observer attributed it to `DIV.zp-run-copy` and `SECTION.zp-built`).
     - **Side effect:** the cursor sits at the start of the next line instead of at the end of the typed one.
   - **Font:** no swap. Zen and Zen Mono are loaded, and the h1 box is constant.
   - **Overlap:** none at either size. There is no horizontal scroll at 320, and the phone bar does not cover a focused control.
7. **Which reference, and is its motion there?**
   - **apple.com:** now partly there. The pinned "Why bother" stage is a real scrubbed scene with a counter.
   - **synchronized.studio:** the card-to-sheet open works at both widths (the sheet rises on phone), Esc returns focus, and Tab stays inside.
   - **anthropic launch:** half there. N:1 / 1:M / 0 are cut-in figures, but the four hero points are 21px text stepping every 3.6 s.
   - **motion.dev patterns:** typing, magnetic, the line mask and the scroll scrub are all present (`variety.py` OK).
8. **Different from its neighbours?** Yes in object and signature: a byte buffer against a JSON line, sidecars against one daemon. It is no in frame. The hero is still the house "title left, lede and ask right, dark product panel on the fold" composition shared with /treasury, /ui and /tabs.
9. **Are all 18 parts covered?** No (see below). `docs/build-notes/coverage/zap.md` also states things the page does not do:
   - "One solid fill per viewport" is false at 375 and with JS off (header pill).
   - "Phone text 14px+" is false: the active buffer label renders at 11px lowercase mono.
   - "Reduced motion rests" is true for motion, but reduced motion also raises a red Next issue badge (see 10).
   - "Pause in each object's own bar" does not cover the infinite packet read-sweep or the band and terminal cursors.
   - A false claim caps the verdict at 7.
10. **Any banned tells?**
    - **Clear:** no UI hue, gradient, green, emoji or Inter, and no eyebrow over the h1 (the kicker sits under it). Sheets put the "02" under the title.
    - **Red error badge under reduced motion (both widths):** "A tree hydrated but some attributes… didn't match". It comes from `components/v2/Settle.jsx:30`, called at `Zap.jsx:111`: the server renders `transform: translateY(12px) scale(1.03)` and the calm client renders `none`. DONE.md's "no red error badge, no console errors" fails for every reduced-motion visitor.
    - **Off-deck colours:** about 30 literal greys sit outside Hanzo's ramp (`#86868b`, `#a1a1a6`, `#f5f5f7`, `#6e6e73`, `#48484f`, `#1c1c20`, `#2c2c32`, `#c7c7cc`, `#d1d1d6`, `#e3e3e8`, `#0c0c0e`, `#0b0b0c`). Many are dead, overridden later in the file, but they are still in the file. `taste.py` passes, but MASTER part 7 says no literal hex in page CSS.
    - **A zero at figure size:** the "0" in N:1 / 1:M / 0 is set at 64px (MASTER part 5: "A zero never gets hero size").
    - **Low-contrast states:** the unwalked JSON is `#48484f` on `#0c0c0e`, about 2.2:1. It is a state, but it reads as dim dark text.
11. **Is the copy untouched?** Yes.
    - `parity.py /zap`: text 71/71, links 7/7.
    - The terminal now keeps Hanzo's aligned spacing (`slack  --url`, `db     --url`), and Copy puts exactly the four `zapd` lines on the clipboard. "1 character walked" is fixed.
    - The demo labels are still not in `content/ui-strings.json` ("Read a field", "ZAP · the buffer that arrived", "Agents you run"…). The card lists them honestly as open copy questions.

## Missing from the 18 parts (measured)

- **Part 1 (one solid):** two solids in the phone first screen and at the phone close. The cause is the shared header pill, but the page's gate claim is false.
- **Part 3:**
  - The close band ends with about 116px of white before the footer (MASTER: "then the footer with no gap").
  - About 180px of dead white above and below the pinned stage.
- **Part 4 (sticky ask):** on phone the header ask ("Try Hanzo") and the bar ("Read the docs") disagree.
- **Part 6:**
  - The active buffer label is 11px on phone.
  - The lane labels, "Read a field", "Terminal", "Copy" and "MCP Srv" are 12 to 12.5px on desktop, under the 13px step.
  - The terminal's `word-break: break-all` splits tokens on phone.
- **Part 7:**
  - Literal off-ramp hex (see 10).
  - Ad-hoc durations (.45s, .6s, .35s, .25s, .9s).
  - The diagram's "…" marks escape their boxes.
- **Part 8:**
  - The slider has no pressed state.
  - The hero ask's hover is invisible.
  - The `.zp-pick` chips are 40px on desktop.
  - Sheets are a `div`, not a native `<dialog>` (focus is trapped and returned, so this is a shared-kit note).
- **Part 9:**
  - Three `setInterval` loops (`useEvery`).
  - The infinite packet read-sweep and the cursors have no pause.
- **Part 10:** no Hanzo media beyond the 26px Enso, which is acceptable for a protocol page.
- **Part 12, keyboard through the pinned rail (desktop):**
  - Tabbing past packet 04 scrolls the `overflow: hidden` sticky box sideways: "Why bother" and half the lede slide off the left edge.
  - Packets 04 and 07 are focused half off-screen, with the ring clipped.
  - The 01 / 08 counter stays at 01.
  - The rest of the crawl was clean: 28 stops in `<main>`, every one with a visible ring, the field radios on arrow keys with a roving tabindex, and the slider taking Home, End and the arrow keys.
- **Part 13:** CLS over budget at both widths (terminal; see 6).
- **Part 17:** a console error and red badge under reduced motion. Normal runs had 0 console errors from this page (the one compile error seen was in `Treasury.jsx`, another chat's file).
- **Part 18:** coverage overstates four rows (see 9).
- **Passing:**
  - The header comment, one h1 and one main.
  - The h1 is in the server HTML and JS off is legible (desktop: 0 hidden runs; phone: only the decorative inactive buffer labels).
  - `data-cta` and `data-thumb` are on both primaries, and the header steps aside at the close on desktop.
  - Copy matches the display.
  - Phone targets are all 44px or more, with no horizontal scroll at 320.
  - Reduced motion shows final states (`getAnimations()` is empty, the terminal is fully shown, the rail is unpinned).
  - Kit `A` and `Img` only, and 0 UI hues.

## Fixes (in order)

1. **Stop the terminal jump.**
   - Put the block cursor before the line break. Render `{'\n'}` outside the span, or draw the cursor as a positioned element inside the line.
   - Or give the `pre` a fixed height for all six lines plus the cursor row.
   - Target: CLS under 0.02 at both widths, and the cursor sitting at the end of the typed line.
2. **Kill the reduced-motion hydration error.** `Settle` reads `useReducedMotion()` during render, so the server and a calm client disagree. Render the same style on both and apply calm after mount (or in CSS under `prefers-reduced-motion`). Settle is shared (`components/v2/Settle.jsx`), so either fix it there with its owner or stop using it in this hero. No red badge with reduced motion on.
3. **One ask on the phone.**
   - Ask the shared header owner to make the phone header ask quiet (outline) and carry the page's thumb label ("Read the docs"), as it already does on desktop.
   - Until then, note it on the card instead of claiming "one solid per viewport".
   - Keep "Read the Papers" and "GitHub" on one line at 375 (smaller gap or a tighter row) so GitHub doesn't sit alone.
4. **Make the pinned rail keyboard-safe.**
   - On `focusin` inside `.zp-packets`, scroll the window to the progress that puts that packet in view (the inverse of the scrub), and reset `.zp-why-stick` `scrollLeft` to 0.
   - Or make the stick `overflow: clip` so focus can't scroll it sideways.
   - The counter must follow focus.
5. **Phone terminal:** use `overflow-wrap: anywhere` on whole tokens, or let the `pre` scroll sideways at 14px with a labelled scroll region. Never split `endpoint`, `stdio` or `http` mid-word.
6. **Clean the palette.** Delete the dead early rules and replace every literal with deck tokens:
   - `#86868b` and `#a1a1a6` → `#a3a3a3` or `#737373`
   - `#f5f5f7` → `#fafafa`
   - `#1c1c20` and `#2c2c32` → `#171717` or `#262626`
   - `#c7c7cc` and `#e3e3e8` → `#e4e4e4`
   - `#48484f` → a ramp value at 3:1 or better
7. **Small craft.**
   - Give the hero ask a visible hover (fill to `#e4e4e4`, or the arrow plus a 1px lift).
   - Let `:active` win over hover on the slider knob.
   - Make the `.zp-pick` chips 44px on desktop.
   - Bring the 11 to 12.5px labels to 13px (14px on phone) or set them as 11 to 12px capitals.
   - Shrink the empty sidecar box to fit its rows, or let it grow with the count.
   - Anchor the diagram's "…" inside their rows.
   - Close the gap between the band and the footer.
8. **Give the page one scale moment.** For example, let N:1 / 1:M / 0 arrive at hero size and settle to 64px, or let the landed packet's header grow as it lands. Then James's "some start big and shrink" is there. Ask James whether the "0" may stay at figure size (MASTER part 5).
9. **Correct `docs/build-notes/coverage/zap.md`.** Fix the four rows in answer 9, and register the demo labels in `content/ui-strings.json` once James answers the copy questions.
