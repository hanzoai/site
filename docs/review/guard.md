# /guard — James-eye review

Ready: 8 Nov, held up next to /api and /agents (no score). The motion-map rework (spotlight composer, six facts as two row sections each with its own playing board, real dials shared with the playground, five entrances) holds on a fresh walk; this pass fixes the playground's detector chips (the letter-cascade spans were flex items, so every name was spread letter by letter and overflowed at 375) and gives the request's label room so a lit marker's struck value no longer touches it. Shared, not this page: the header's solid ask beside the close's solid (fix 8) lives in components/Ask.jsx and v2/GetIt. taste/unique/parity OK (text 29/29, links 2/2); 0 console errors from this page (only the shared footer hydration warning, which /agents shows too), no overflow/overlap at 1470x801 and 375x812.
7 Nov, round 5. Walked at 1470x801, 375x812 and 320x640 (phone: isMobile, hasTouch) with Playwright on the shared dev server. At each size: frames at 0, 1 and 3 s with no input, then the wheel a screen at a time with 1.5 s dwells. On desktop I hovered and pressed every stage tab, the pause control, Copy, the six detector chips and the three marker options; on the phones I tapped them. I typed into the playground at all three sizes, did reduced-motion loads at 1470 and 375, measured overflow and read the console. I dismissed the cookie card before judging. No console errors and no Next.js Issue badge at any size. Reduced motion logs only motion.dev's own warning. The header item over 320 is the shared ask button, so it is not counted.

Verdict: 7/10

First complaint: "In 'You set the dials' there are switches I can't flip. I tried, nothing happened. And while that stage is pinned, the bottom third of my screen is blank white for three screens of scrolling, then there's another empty hole before 'Paste and ship'. Under that, the 'paste by accident' panel is two rows of three identical white boxes. Make it feel alive all the way down, not just in the hero."

## The 11 answers
1. **5 s and 1 s: yes.** The black hero leads with "Guard" and Hanzo's line, and the demo is running before the first second: the request types out, `[card numbers]` and `[emails]` markers snap in, the confidence bar fills and the reply leg redacts. The lede cuts in by line mask. Two weak points:
   - The next section doesn't peek at 801. The hero runs to 808.
   - On phone the hero's own ask, View on GitHub, is a white outline on black, while the header's Try Hanzo is the solid. The page's ask looks secondary on its own first screen.
2. **One in, one out: mostly.** The pinned "What it looks for" stage swaps one panel at a time across 01–06, with the tab underline and the top progress hairline moving. That part is right. But at 1470x801 the stage only fills the top ~500px. The lower ~300px stays empty white for the ~3,000px the pin lasts. When the pin releases, a ~270px blank band follows before "Paste and ship" (shot d-s07). On phone the stage becomes a snap rail with a 16% peek, which works.
3. **A real object in every section: yes.**
   - Hero: the live request/reply demo.
   - Stage: six drawn panels (the injection list with a confidence bar, marker tiles, a request/reply route through GUARD, switches, the content/hash log, the proxy/CLI/MCP diagram).
   - "Paste and ship": the black prompt block.
   - The playground.
   - The closing: contour line art beside "Get Guard".
4. **One ask, nothing floating, scale rhythm: yes, with one gap.**
   - On scroll the header swaps to the page's own "View on GitHub" as the solid, and nothing floats over content.
   - Rhythm holds: h1 52, section heads 26, panel titles 21, mono 12. The hero is the one big thing; "Get Guard" at 44 closes.
   - Gap: in the closing viewport both View on GitHub buttons (header and band) are outlined. No solid fill on that screen.
5. **Every hover and press answers: no.**
   - These answer: stage tabs (grey chip), the hero ask (fill and ring), the pause/play control, detector chips (the tick drops and the playground output re-redacts live), marker options (white thumb), and Copy → "✓ Copied".
   - Fails:
     - Panel 04's five switches and panel 03's "machine-learning classifier" switch are drawings. They look exactly like controls and do nothing when pressed or tapped.
     - Copy widens 74→85px when it says Copied. It grows left, so nothing else moves, but it isn't fixed-width.
6. **Overlap, font swap, layout shift: none on the page.**
   - No horizontal scroll at 1470, 375 or 320 (scrollWidth equals clientWidth).
   - No h1 movement, and the h1 is in Zen at 52 / 40.
   - Fault: on the 375 and 320 rails, a card's h3 title stays blank (masked) until the card is near mid-screen. Its "01 / 06" counter and body are already showing, so for a moment each card is a hole with a number under it (p-s01, s-s02).
7. **Reference: apple.com product page plus motion.dev.** The apple pinned scene is there: one panel changing, a persistent ask in the header. The motion.dev patterns are there too: line-mask cut-in, a self-running demo, live state toggles. The anthropic-launch "benchmarks as hero figures" doesn't apply. The apple scene loses its polish to the half-empty pinned viewport.
8. **Different from neighbours: half.** The hero is its own: a centred black room with a running request/reply demo. /gateway and /hsm open on white with a left-set head. But section 2 has the same skeleton as /gateway's: a pinned six-step stage with a "01 / 06" counter, a picture card on one side and text on the other. Only the side and the tab style differ.
9. **18 parts: largely covered.**
   - Done:
     - one h1;
     - the header ask swaps;
     - a pause control on the hero demo;
     - reduced motion shows the final state: hero redacted, stage unpinned into a stacked list, `getAnimations()` empty after 3 s;
     - 44px targets on the phone;
     - no console errors;
     - the phone rail uses "Read more" disclosure.
   - Weak:
     - the hero is centred, but section 3 allows centred heads only in the closing;
     - there is no peek;
     - fake controls (part 8: every control has states);
     - a closing viewport with no solid fill.
10. **Banned tells: one.** Panel 02 ("The things people paste by accident") is a 3x2 grid of six identical white tiles, which is "three equal boxes in a row" twice. The wrapped "[Social security numbers]" and "[provider API keys]" sit top-aligned while the others are centred, so the grid reads ragged as well. No hue: the stage rooms are all from the neutral ramp. No gradient text, no Inter, no glow, no kicker over the h1 (hanzoai/guard has moved into the demo's title bar, which is correct).
11. **Copy untouched: yes, near enough.** Every sentence is Hanzo's, and "Get started with Guard" is kept as a caption under "Get Guard". The demo and panel labels are lifted word for word from Hanzo's sentences: request, reply, model, confidence, GUARD, hash, content, proxy, base URL, CLI tool, pseudo-terminal, MCP server, tool calls, token bucket, each detector, injection threshold, your own patterns, marker text, machine-learning classifier, Luhn. "Reset", "Read more", "Copy" and "Pause" are in ui-strings. The composed arrows ("request → model", "reply ← model", "→ model") are the only assembled labels, and they are borderline. The card number, the example.com address and 192.0.2.1 are data under the owner decision.

## Fixes, in order
1. Make the drawn switches real or stop drawing them as switches.
   - Panel 04: wire the switches (each detector, injection threshold, your own patterns, marker text) to the same state the playground uses, with a press state and the toggle tick sound. Or render them as static status marks (filled/hollow) so they don't invite a click.
   - Panel 03: give the machine-learning classifier switch the same treatment.
2. Fill the pinned viewport at 1470x801. The stage (heading and tabs on the left, panel on the right) should sit vertically centred in 100svh, with the panel grown to ~70% of the viewport height. Then no white band sits under it during the pin.
3. Close the ~270px blank band between the pin's release and "Paste and ship". The next section should overlap the outgoing stage by about 40px, per "one in, one out".
4. Replace panel 02's 3x2 equal-tile grid. Options: a single redacted sentence where each typed marker replaces its value in turn (it's the demo's own idea, so reuse it), or an unequal list with the Luhn tick on card numbers. Fix the top/centre misalignment of wrapped tiles either way.
5. Phone rail titles: start each card's h3 line-mask when the card itself enters the rail (horizontal IntersectionObserver on the card, threshold about 0.4). Today it waits until the card is near mid-screen vertically. Don't show the counter and body before the title. If needed, reveal title, counter and body as one group.
6. Give section 2 its own signature so it stops sharing /gateway's pinned-stage skeleton. For example, let the hero demo's request line travel into the stage and get re-read by each panel, or switch the tabs to a vertical list on the right. It must stop being "picture card + 01 / 06 + six tabs".
7. Phone hero: keep "View on GitHub" a solid fill in the hero on its first screen, as on desktop. Let the solid move to the header only once the hero ask has left view.
8. Closing viewport: make the closing View on GitHub the solid, or keep the header's solid there, so there's one solid fill on that screen.
9. Hero: let the next section peek 56px at 801. Consider the 8/5 left-set head the system asks for over the centred head, which is reserved for the closing.
10. Give Copy a fixed width so "Copy" → "✓ Copied" doesn't resize the button.
