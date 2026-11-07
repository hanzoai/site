# /help/privacy/model-training — James-eye review
7 Nov, round 4. Walked moving at 1470x801, 375x812 and 320x700 (phone: isMobile, hasTouch) with Playwright Chromium. Frames at 0, 1 and 3 s with no input, one wheel-screen at a time with 1.5 s dwell, hover and press on every main control on desktop, taps on phone, prefers-reduced-motion loads at 1470 and 375. Cookie card dismissed before judging. All screenshots taken with `caret: 'initial'`.

Verdict: 7/10

First complaint: "The whole point of the demo is the switch flipping, and on my phone the switch is cut in half by the bottom of the phone frame. You built the moment and then hid it."

## The 11 answers

1. **First screen sells in 5 s, motion within 1 s?** Yes on desktop. The h1 cuts in, and the self-running stage on the right starts inside a second: the cursor goes to the avatar, Settings opens, Privacy, the switch goes off, and the tick line "The change saves to your Hanzo account…" lands. It is a real answer to the question in the h1, and it is the right object for a help page. Two flaws: the caption reads "02 / 05" for the whole run, even on step 1 "Click your avatar." while the dashes say 1 of 4, so the counter contradicts itself. And the stage starts with the switch on and a paragraph saying what "on" means, so the first frame explains the opposite of what the page tells you to do. On phone (375 and 320) the stage takes the whole second screen and its key frame is broken (see 6).
2. **One thing in, one out, or a document?** Desktop: the right-hand stage pins and changes with each section: 01 settings, 03 a before-and-after timeline with the switch, 04 the settings list with one row lit. That is Apple's pinned-stage idea at help-page scale, and it works. Section 05 never shows its panel on desktop because the stage scrolls away first. Phone: it is a document with a static card per section. That is acceptable for a support page, but the card bodies are mostly grey skeleton bars.
3. **A real visual object in every section?** Mostly. 01, 02, 03 and 04 each have a drawn UI or a diagram. 05 "More" has nothing on desktop. On phone it has three identical outlined document glyphs in a row that link nowhere (see 10).
4. **One ask in the sticky header, nothing floating, scale rhythm?** Yes. "Try Hanzo" is the only solid fill. Nothing floats over the article on desktop or phone. Scale follows the tokens: h1 52/32 px, h2 26 px, body 16 px, labels 11 to 12 px Zen Mono, closing paragraph 21 px. There is one big thing per screen. The TOC is quiet and correct.
5. **Every hover and press answers, no jumps?** Mostly. TOC rows fill #f5f5f5 on hover and press down 1px. Tabs, the pause button, step rows and the "Help Center" row press at 0.97, and the definition rows fill on hover. Nothing fades, and CLS was 0.0002. Two things are broken:
   - Clicking or tapping step "01 Click your avatar." lights step **02**, on desktop and at 320. That is either an off-by-one or the autoplay racing the tap, and either way the tap selects the wrong step.
   - On desktop, clicking a step in section 02 never drives the stage. The pinned panel keeps showing whichever section is in view, for example the 03 timeline. The step list looks like a remote for the demo, but it is not wired to it.

   The stage's own switch has no hover state at all (rest = hover).
6. **Overlap, font swap or layout shift?**
   - At 375 and 320 the switch in the mobile phone mock sits on the bottom bezel and is clipped by half (p375-top, p320-s1). That is cut content at the demo's key moment.
   - At 320 the pause button gets its own row above the tabs: a lone "II" floating in 60px of grey.
   - At 375 the breadcrumb wraps so that "Help Center / Privacy /" ends on a dangling slash and the current title drops to a line of its own, right above the same words in the h1.
   - On phone in section 04, the hairlines are inset (52 to 698 px) but the hover fill runs 32 to 718 px, so the rules and the fill don't line up. In the 01 card the row border is inset inside its own fill, which reads as a box inside a box.
   - Reduced motion: the server render paints step 1 (switch on), then after hydration it flips to the final state (switch off, tick). There is no animation, but the state visibly swaps at first paint.
   - No horizontal overflow from page content. The only overflowing elements at 320 are header chrome.
   - No console errors, and no hydration diff in a normal or a reduced-motion load.
7. **Which reference, and is its motion there?** apple.com support plus chatgpt.com/business/enterprise calm: a pinned stage where one panel changes, and a self-running scripted demo. The pinned stage and the demo are really there on desktop. The arrival is a line-mask h1 cut-in. Motion is mixed, not only scroll: idle demo, time (staged steps), state (tabs, switch) and scroll (pinned panel, progress hairline). That meets the "not just scroll" rule.
8. **Different from neighbours?** It is the only help article, and its hero medium (a scripted settings walkthrough beside the article) is its own. Its row-hover TOC and "01 / 05" numbering are shared system pieces, which is fine.
9. **18 parts covered?** Breadcrumb, TOC, anchors, legal links, contact and support exits, the reduced-motion path, pause control, no overflow and no errors are all there. Weak points:
   - The stage switch is a `button role=switch` with no hover.
   - A decorative toggle in the mock (`button.xhp-sw`, tabindex -1) has no name. It should be aria-hidden or not a button.
   - Two sets of platform tabs say the same thing in different words: the stage's "Web and the desktop app / Mobile" and section 02's "On the web and the desktop app / On mobile".
10. **Banned tells?**
    - On phone, section 05 shows three identical outlined document glyphs in a row. That is the "three icon boxes in a row" tell: an icon alone, three times.
    - "HELP · PRIVACY" sits under the lede and above "Contents". It is not above a headline, so it isn't banned, but on phone it is stranded alone in roughly 120px of white and reads as a stray label.
    - No hue (every colour is on the neutral ramp), no gradient text, no Inter (Zen and Zen Mono only), no glow, and no fade-on-hover buttons.
11. **Copy untouched?** All article text traces to `content/live/help/privacy/model-training.json`. "Open Help Center", "Help Center", "Email support@hanzo.ai", "Documentation", "System Status" and "Community" trace to `content/live/support.json`, and "Pause" to `ui-strings.json`. Two visible labels are rewrites: the stage tabs read **"Web and the desktop app"** and **"Mobile"**, but Hanzo's words are "On the web and the desktop app" and "On mobile". The stage caption "02 / 05" is numbering, not copy, but it is wrong (see 1).

## Fixes, in order

1. **Phone mock, 375 and 320:** give the phone screen enough height, or move the setting row up, so the switch and the tap ring sit fully inside the bezel at every step. The flip has to be seen whole.
2. **Step tap off-by-one:** tapping step N must select step N. Pause autoplay on any step interaction, and don't let the next autoplay tick advance past the step that was tapped.
3. **Wire the step list to the stage on desktop.** Clicking a step in section 02 (web or mobile) should put the stage on that step and platform even if another section is in view, or scroll the stage's section into view first. If it can't drive the stage, it should not look like a control.
4. **Caption counter:** show the demo's own step ("1 / 4", "2 / 4"…) while the walkthrough runs, and the section index only when the stage is following sections. Never a fixed "02 / 05" over step 1.
5. **Restore Hanzo's words** on the stage tabs: "On the web and the desktop app" and "On mobile". Better still, drop the second tab set in section 02 and let one control set the platform for both.
6. **Reduced motion:** server-render the final state (switch off, tick line) so there is no state flip at hydration. The phone path already does this after hydration, so do it on desktop SSR too.
7. **Section 05:** replace the three document glyphs on phone with one real object, such as the two linked documents as named rows (Terms of Service 5.4, Privacy Policy 6), or with nothing. On desktop either let the stage reach 05 or end the pin at 04 cleanly.
8. **320 stage header:** keep pause and tabs on one row. Shrink the tab padding or make pause a 36px circle inside the tab track, so the lone "II" row goes.
9. **Phone breadcrumb:** never end a line on "/". Either truncate the current title with an ellipsis on one line, or drop it on phone, since the h1 repeats it directly below.
10. **Hairlines vs fills, phone section 04 and the 01 card:** make the row rules and the hover fill share the same inset. Remove the inner border inside the filled settings row.
11. **"HELP · PRIVACY":** sit it with the breadcrumb, or tighten it to the TOC (17px gap), so it is not stranded in white on phone.
12. **Small a11y:** give the stage switch a hover (track darkens one ramp step). Make the decorative mock toggles `aria-hidden` spans rather than unnamed buttons.
