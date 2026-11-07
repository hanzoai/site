# /integrations/* (template) — James-eye review
Verdict: 6/10
First complaint: "When I scroll through the chapters, two lots of text sit on top of each other, and around them there are big empty white holes. It looks broken, not premium. And on my phone it's just a very long page of code."

Walked 7 Nov 2026: /integrations/openai-sdk/ and /integrations/langchain/, moving, at 1470×801 and 375×812 (Playwright, deviceScaleFactor 1). For each, I took 32 frames at 250 ms over the first 8 s with no input, then scrolled slowly in 60 px steps with a frame every half screen. I hovered and pressed 40 controls per run, held the pinned chapters at 9 scroll positions, and loaded each page with JS off and with prefers-reduced-motion. Proof is in `docs/review/integrations-family/`: `1-desktop-hero-badge-cookie.jpg` shows the hero with the red Issue badge and the empty top-left. `2-desktop-pinned-stage-empty-clipped.jpg` catches the chapter crossfade with text on top of text. `3-phone-two-fills-duplicate-labels.jpg` shows the phone first screen with two solid black asks.

## The 11 questions

**1. Does it sell in 5 s, and does something move within 1 s?** Yes. At 1470 the h1 is cut in by a line mask within the first second. From about 1.1 s the "Install & configure" code types the two Hanzo lines (`api_key`, `base_url`), and the pill chain from SDK to api.hanzo.ai/v1 to the model lights up. The demo settles at about 4.8 s, wakes again at about 6.5 s, and has a Stop/Replay control. On phone it settles at about 4 s. The weak spot is the composition. The h1 sits bottom-left (top 265 px) under about 200 px of empty white, while the lede sits top-right (top 104 px). The eye lands on the lede first and on the h1 second, so the hero reads as two half-filled columns, not one idea.

**2. As you scroll, does one thing come in as one goes out?** Only in the middle. The pinned chapter stage (01/03 to 03/03, about 1,922 px of pin) is the one moment that works that way. While you scroll between chapters, though, both chapters show at about 50% at once: "02" over "03", "Vision model" over "Environment variable", and two code blocks interleaved (proof 2). The held positions are clean, so this happens only in the crossfade, which is exactly where a moving visitor sees it. Before and after the pin there are about 220 to 250 px of dead white. After that the page is a document: credit, a card rail, a 12-row link grid, then the band. On phone it is entirely a document. The page is 8,749 px tall (openai-sdk) and 9,322 px (langchain). It is three stacked chapters, each repeating the pill chain, the "Only the Hanzo lines" toggle and a long code block.

**3. Does every section hold a real visual object?** Mostly. The hero holds the live code stage, the chapters hold code plus the chain, "More integrations" holds Sigil contour cards (each one different), and the band holds a Sigil. The credit section fails: its only object is "OP" or "LA" initials in a grey rounded square, which reads as an icon in a box. The pill chain is the same object four times per page, so after the hero it no longer adds anything. There are 0 `img` and 0 `video` elements. That is fair for this family, but the partner gets no real mark anywhere.

**4. Is there one ask, in Hanzo's words, in the sticky header, with nothing floating over content? Does scale have rhythm?** On desktop, yes. Once the hero ask leaves the view, the header ask turns into a solid "Get API key — Free" and nothing floats over content apart from the consent card. In the first second, though, the header "Try Hanzo" starts solid and then flips to an outline, so for a moment there are two solid fills. On phone the header never swaps. "Try Hanzo" stays solid black next to the solid "Get API key — Free" in the same first viewport: two fills, two different labels (proof 3). Scale is good: the h1 is 52 px (40 on phone), the 01/03 chapter figure is large, h2s are 26 px, and labels are small mono. Nothing grows or shrinks, though, so the scale never answers the scroll.

**5. Does every hover and press answer, with no jumps?** Mostly. Presses scale to 0.97 or 0.98 on every button. Copy buttons go to 0.92 and confirm. The integration cards answer well: the fill steps from #f5f5f5 to #ededed, the hidden description rises 8 px into view, and the arrow turns 45°. Rows nudge 4 px, links underline, and I measured no size jumps. The misses: the header "Try Hanzo" hover only fades opacity from 1 to 0.88 (a banned fade). The hero primary hover only shifts the fill from #0a0a0a to #262626 and tells you nothing. The band's "Browse Models" showed no measurable hover change. The three chapter dashes have no hover state.

**6. Do overlaps, a font swap or layout shift appear anywhere?**
- **Layout shift.** On desktop, CLS is 0.0003 at load and 0.0007 after a full scroll. On phone it is 0.0188 (openai-sdk) and 0.008 (langchain) over the first 10 s, mostly the consent card's text reflowing at 2.2 to 3.5 s (one shift of 0.0121). That is under the 0.02 limit, but only just.
- **Font swap and overflow.** I saw no font swap. Horizontal overflow is 0 px at both sizes.
- **Overlaps.** The chapter crossfade puts text on top of text. On first load the consent card covers lines 10 to 13 of the hero code on desktop and 203 px of the phone screen.
- **Error badge.** A red Next "1 Issue" badge sat bottom-left on all 4 walked loads, and those walks logged a hydration-mismatch error ("A tree hydrated but some attributes… didn't match"). It did not reproduce on 2 networkidle loads, so it is intermittent. It still fails the "no red badge, no console errors" bar.

**7. Which reference does it feel like, and is that reference's motion actually there?** It feels like apple.com's pinned scene, where one panel changes, plus motion.dev's typewriter and staged loading, and those motions really are there. synchronized.studio's card opening into its page did not show in my walk: clicking a "More integrations" card swapped the page with no visible handover of title or picture. That makes it a dev-docs page with good manners, not the Apple "one idea per screen" story it reaches for.

**8. Is it different from its neighbours?** The two members are the same composition with different data and different Sigil seeds, which MASTER allows for a family. At template level the hero medium (a code stage with a live routing chain) is distinct from the model and catalogue templates.

**9. Are all 18 parts covered?** Most parts show:
- one h1, a breadcrumb, `data-cta="integrations.hero"` on the primary, and the sticky-ask swap on desktop;
- the Stop/Replay control on the demo and copy confirmation;
- a reduced-motion final state with 0 running animations after 3.5 s, and a legible JS-off page;
- the Band before the footer, and the sound toggle in the header.

The open parts are:
- Part 4 (the phone header ask);
- Part 16 (code wraps mid-token: "What is in / this image?" on desktop, "from_templat / e(" on phone, instead of a labelled scroll region);
- Part 17 (the console error and badge);
- Part 6 (with JS off, the 6 card descriptions stay at opacity 0).

**10. Are there any banned tells?**
- Buttons that fade on hover: the header "Try Hanzo" goes from opacity 1 to 0.88.
- Something like an icon in a box: the initials tile in the credit section.
- Low contrast: over the black band the header becomes a muddy grey bar (72% white glass over black) with grey text.

There are no hues, gradient text, pills above the h1, serif accents or cursor glow. The category label sits beside the breadcrumb, not above the h1.

**11. Is the copy untouched?** Yes. `parity.py` reports openai-sdk at text 93/93 and links 23/23, and langchain at text 92/92 and links 23/23.

## Fixes (ordered by impact)
1. **Kill the chapter ghosting.** Between chapters, no two chapter titles, numbers or code blocks may both sit above 0.15 opacity in the same frame. Run the outgoing chapter out (opacity to 0, translateY −16 px, 300 ms) before the incoming one starts. Re-film at 60 px per 90 ms of scroll and check every frame.
2. **Remove the dead white.**
   - The gap between the bottom of the hero stage and the first chapter's content must be 72 px or less at 1470×801. Today it is about 220 px.
   - The space between the chapter dashes and the credit hairline must also be 72 px or less. Today it is about 250 px.
   - In the hero, either move the lede under the h1 on the 8/5 split or start the h1 at 38% of the viewport with the lede baseline-aligned. No empty block over 120 px tall may sit beside the h1.
3. **Phone: one ask.** Once the hero ask is in view at 375×812, the header ask must be quiet (not solid), and it must take the label "Get API key — Free" when the hero ask leaves, as it does on desktop. Exactly 1 solid fill per phone viewport.
4. **Phone: not a document.** Cut the phone page from 8,749 or 9,322 px to under 6,000 px:
   - Show the chapters as a single tabbed code panel at a fixed height, or as a horizontal snap rail with a 14–18% peek, not three full stacks.
   - Show the pill chain once, in the hero.
   - Show the "Only the Hanzo lines" toggle once.
5. **Fix the error.** 0 console errors and no "Issue" badge on 5 consecutive plain loads at each size, including loads screenshotted from `commit`. The hydration-mismatch attribute must go.
6. **Code must not wrap.** Code blocks use `white-space: pre` inside a labelled `tabindex="0"` scroll region (Part 16). No identifier or string may break across lines at 1470 or at 375.
7. **No fade on hover, and every hover tells you something.** The header "Try Hanzo" hover must change fill or border, not opacity. The hero primary hover should show something useful (for example the destination host, platform.hanzo.ai) or at least a fill-plus-icon nudge of up to 4 px. "Browse Models" needs a visible border or fill change. The chapter dashes need a hover state and a 44 px hit area with a label.
8. **Give the credit section a real object.** Replace the "OP"/"LA" initials tile with the partner's real mirrored mark, or the family's Sigil seed. No initials in a rounded box.
9. **Header over the black band.** On black rooms the header must switch to its dark state (graphite or black glass, #fafafa text) so text contrast is at least 4.5:1. No mid-grey bar.
10. **Rail and states.**
    - The "More integrations" rail must bleed to the viewport edge with a 14–18% peek instead of clipping at the container ("LlamaInde").
    - With JS off, card descriptions must be visible (opacity 1).
    - The first-second header flip from solid to outline must not be visible. Render it quiet from the server.
