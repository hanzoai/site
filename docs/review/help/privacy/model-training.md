# /help/privacy/model-training — James-eye review
7 Nov, round 3, walked at 1470x801, 375x812 and 320x640 (phone: isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s with no input, a wheel or smooth scroll one screen at a time with 1.5 s dwell, hover and press on desktop, taps on phone, console capture, overflow probe, and a prefers-reduced-motion load at 1470 and 375.

Verdict: 7/10

First complaint: "On my phone the demo is a big grey slab that takes more than a whole screen before I even reach the contents, and the buttons are squashed onto two lines. And on the laptop the little counter says 04 of 04, then 03 of 05. Which is it?"

Clean on the basics: 0 console errors and 0 hydration diffs in any load, including reduced motion. The Next.js portal is present but carries no issue. No horizontal overflow at 1470, 375 or 320. No hue: every computed colour is neutral.

## The 11 answers
1. **Does the first screen sell in 5 seconds, and does something move within 1 s?** Yes on desktop. A self-running settings demo sits on the right: a cursor clicks the avatar, then Settings, then Privacy, and flips the switch, with 01/04 progress ticks, and it is moving by 1 s. The h1 cuts in by line. At t0 the title slot is still empty between the breadcrumb and the lede for a beat, which reads as a hole rather than an arrival. On the 375 phone the demo starts below the lede and then runs taller than a screen (tabs, phone mock, caption, toggle row, body text), so the contents list doesn't arrive until the second screen.
2. **Does one thing come in as one goes out, or is it a document?** On desktop, mostly the first. The right-hand stage is pinned and its panel changes with the section: the settings flow, a before/after timeline of dots for 03, and the privacy panel with a highlighted row for 04. On the left it is still an article, which is fine for a help page. On phone the stage breaks into inline figures per section (the timeline draws in, the dots fill), which is good. Sections 01 and 05 get no figure on phone, so 01 is an 8-line text block.
3. **Does every section hold a real visual object?** Desktop yes, through the pinned stage. Phone: 02, 03 and 04 yes; 01 and 05 no. The 04 object reuses the step-3 privacy panel with one grey bar lit, so it says nothing about "what it does not change".
4. **One ask, nothing floating, scale rhythm?** There is one ask, Try Hanzo, in the sticky header. The closing Help center row is a quiet link, not a competing ask. Nothing of the page floats over content; the cookie card is shared chrome. Scale on desktop is right: h1 52, lede about 21, h2 26, body 16, mono labels 12. On phone the stage is the biggest thing on the first screen and a half, so everything sits large at once there.
5. **Does every hover and press answer, with no jumps?** The stage tabs, pause/play, step rows and the steps tab all answer: hover darkens or tints them and press scales to 0.97 or 0.98, with no jumps. Pause really stops the demo and shows a play glyph. The contents rows only change their background on hover and do nothing on press (transform none), and the hover tells you nothing. Taps on phone answer: the contents rows scroll to their anchor and the tabs switch.
6. **Overlaps, font swap, layout shift?** No overlap of page elements at 1470, 375 or 320, and no font swap. Smaller issues:
   - The pinned stage ends flush against the grey "More" band as it releases, with 0 px of air.
   - Hairlines are inconsistent: the contents and ledger rows hang about 10 px left of the text column (149 vs 159 on desktop, 6 vs 16 on phone), while the last contents rule and the 03 list rules sit on the column.
   - The mono label "ON THE WEB AND THE DESKTOP APP" wraps to 2 lines inside its step card at 1470.
   - On 375 and 320 the "Web and the desktop app" and "On the web and the desktop app" pills wrap to 2 lines next to a 1-line "Mobile" pill.
7. **Which reference does it feel like, and is its motion there?** Apple's pinned stage where one panel changes is there on desktop. A live self-running demo answers the "time / idle" motion rule. Calm trust, in the chatgpt enterprise sense, comes through the quiet ledger in 04. Scroll is not the only motion: the demo, the cut-in and the stateful tabs carry the rest.
8. **Different from its neighbours, with its own hero and signature?** The signature is the settings demo with a live switch, and it is specific to this article. Not verified against sibling help articles. The `xhp-` structure suggests a shared help template, so the demo has to stay this article's own.
9. **All 18 parts covered?** For a support page:
   - IA: breadcrumb, numbered contents, anchors, and a closing route back to the Help center.
   - States: pause, and reduced motion lands on the final state (switch off, "saves to your account" tick).
   - Mobile: its own inline figures.
   - Not covered: no "was this helpful" or related-articles exit beyond the single Help center row, and no copy-link for the anchors.
10. **Banned tells?** None found:
    - The "HELP · PRIVACY" mono label sits under the lede, not above the h1.
    - No gradient text, hue, Inter or three equal boxes; the two step cards are a pair.
    - The h1 font stack lists "Noto Kufi Arabic" before Zen, which only matters for Arabic glyphs; Latin renders in Zen.
11. **Is the copy untouched?** No visible rewrite. The text reads as plain help copy. "HELP · PRIVACY" and "CONTENTS" are interface labels. I did not check the copy against a source.

Shared chrome, noted but not counted:
- On phone the translucent sticky header lets text ghost through under the logo.
- At 320 the header's Try Hanzo button is cut at the right edge.
- At 320 the cookie card covers about 40% of the screen.

## Fixes, in order
1. **Phone hero weight.** At 375 and 320, cap the hero stage at about 60% of the screen:
   - show only the device mock and the step caption;
   - move the toggle row and its body text into section 02 or drop them on phone;
   - put the contents list (or at least its first rows) inside the first screen and a half.
2. **One counter on the desktop stage.** Pick one counting system. Either show step progress only inside the 02 scene and the section index elsewhere, labelled differently (for example "Step 04 / 04" versus a section caption with no fraction), or drop the "/ 05". While section 01 is in view the stage should show the 01 scene, not the finished 04/04 step, and it should not snap back to 04/04 as it releases above "More".
3. **Tab pills on phone.** Keep "Web and the desktop app" and "On the web and the desktop app" on one line at 375 and 320: smaller tab type (14 px), tighter padding, or a 1fr/auto split so Mobile takes only its own width. Do the same for the 2-line mono label in the desktop step card. Shorten nothing in the copy.
4. **Give 01 and 05 an object on phone.** In 01, show a small inline switch (the stage's own toggle) that flips once when it arrives. In 05, the Help center row can carry a small preview, or the lit switch can settle into its final state.
5. **Make the 04 scene say something.** Mark the four ledger rows on the privacy panel as staying put while the switch goes off: for example, the switch flips and the four rows stay solid ink, tied to which ledger row is in view. That beats a single grey bar.
6. **Contents rows answer.** On hover, nudge the arrow or number (for example the number goes to ink and the row's rule darkens or draws), and on press translateY(1px), matching the rest of the page.
7. **Air at the stage release.** End the sticky stage 44 to 72 px above the grey "More" band, so the card bottom doesn't kiss the band edge.
8. **One hairline edge.** Put the contents rules, ledger rules and highlighted-row backgrounds on the text column (159 desktop, 16 phone), or hang all of them by the same amount, the 03 list included.
9. **h1 at t0.** Hold the title's first line visible from the first paint (cut-in from a partial mask, or start the mask under 150 ms) so the hero never shows an empty title slot.
