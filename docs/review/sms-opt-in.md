# /sms-opt-in/: James-eye review
Verdict: 8/10
First complaint: "The button's grey and I press it and nothing happens. Tell me what I've missed, don't just sit there."

Walked 7 Nov 2026, 17:05-17:10 UTC, on the dev server at 1470x801 and 375x812 (isMobile, hasTouch), moving. I ran walk.mjs at both sizes and took frames at 150, 700, 1400 and 4400 ms. I hovered and pressed the 5 chips, the field, the box and the submit (unready and ready). I sent one submit per size, intercepted by page.route and fulfilled with 503, so nothing went out. I did 4 cold loads in fresh contexts plus 2 more in America/Los_Angeles time.

## The 11 answers
1. **Sell in 5 s, move in 1 s.**
   - Yes. At 150 ms the h1 is mid line-mask cut; by 700 ms both lines have landed. The lede rises at 300 ms and the phone at 200 ms (48px).
   - At 900 ms the consent tour starts. It lights "Cost", "How to stop" and "Purchases" in turn, 1.3 s each, then rests (the active chip reads "" from about 5 s on).
   - The phone's colon blinks every second.
2. **One in, one out.**
   - Mostly n/a: this is a one-screen form. The desktop page is 2065px and the form plus phone hold the first screen; the footer follows at 681px.
   - On phone (4406px) the handset follows the fine print and its bubbles take turns as it scrolls in. There is no dead stretch before the footer, and the second dark room from run 5 is gone.
3. **A real object in every section.**
   - Yes: one section, and its object is the handset. It mirrors your number live: typing 4155550142 shows "+1 (415) 555-0142" on its To line.
   - Weak spot: on desktop the screen sits empty for 239px between the last bubble (y 412) and STOP/HELP (y 651).
4. **One ask; scale.**
   - At rest the header's "Try Hanzo" goes quiet (outlined) while the form's ask is in view. Once scrolled, the header swaps to a solid "Yes, sign me up!" (shared chrome).
   - The submit is the only fill once the box is ticked. Nothing floats over the content.
   - Scale has rhythm: one 52px h1 (40px on phone), a 21px lede, 16px body and an 11px mono caption below the h1. Nothing else on the page is 40px or larger.
5. **Hover and press.**
   - Chip hover goes from white to #0a0a0a fill with white text, and lights its own words in the paragraph and on the phone, so the hover tells you something. Press is scale .971.
   - The ready submit goes from #0a0a0a to #262626 and presses at scale .97. The tick draws in. No layout jump.
   - The unready submit is `disabled`. A press does nothing and focus drops to `<body>`, so nothing tells you that the box or the number is missing.
6. **Overlaps, font swap, shift.**
   - CLS 0.00024 and no horizontal overflow at 375. There are no overlaps at either size.
   - Console: 0 errors on 4 of 4 cold loads, and 0 in LA time. One "1 Issue" badge (a hydration mismatch) appeared once in a probe context. It did not reproduce, so I do not count it.
   - At 1470x801 the second line of the fine print sits at 795px, cut by the fold. The Terms and Privacy line is visible.
7. **Reference.**
   - apple.com product page: the product (a phone) is the hero and mirrors your input, with one idea on the screen.
   - The calm proof-listing of chatgpt enterprise is in the fine print. Its motion is present but restrained, as Utility asks.
8. **Neighbours.**
   - The handset is used only on this page (`Handset` appears in no other page component). Its "consent read in parts" is its own signature.
9. **18 parts.**
   - One h1 and a skip link. The field is 56px with type=tel, autocomplete=tel and inputmode=tel. The chips are a 44px rail with x scroll-snap on phone.
   - Privacy and Terms sit in the submit viewport. Failure keeps the values and the reason. 2xx-only success is in the code (I did not exercise it).
   - The 4 states are covered except unready guidance (item 5).
   - Tap targets: everything is 44px or more, except the inline Terms and Privacy links (18px tall, inline text, exempt). The 26px box sits inside a full-paragraph label.
10. **Banned tells.**
    - None on the page: no hue, no badge above the h1 (the caption sits below), no gradient text and no browser-default checkbox.
    - Shared: the disabled button text is rgb(110,110,115). That is #6e6e73, which is off the deck ramp (nearest is #737373) and comes from the shared `Cta`.
11. **Copy.**
    - The consent paragraph is word-for-word, split into spans and beside the submit. The h1, caption, lede, field label, button and fine print match live.
    - The 5 chip labels (What, How often, Cost, How to stop, Purchases) and the group label "Read the consent in parts" are not in live HTML or in `content/ui-strings.json`. They are not sentences, but they are unregistered UI strings.
    - The failure text "Request failed (503)" reuses the Startups form's wording.

## Fixes (in order, polish)
1. **Unready press answers.** Use `aria-disabled` instead of `disabled`. A press then focuses the first missing thing (the field if it has under 10 digits, else the box) and pulses the box border once (scale .97, 150 ms). No new words.
2. **Fill the handset's dead middle on desktop.** Set the screen's height to its content, or let the three bubbles sit lower toward the keys, so the 239px between them stays quiet but not empty. The phone frame's 632px height also pushes the fine print to the fold.
3. **Register the 6 new UI labels** (5 chips plus the group label) in `content/ui-strings.json`, or list them as a copy question on the card.
4. **Shared, not this page:** the disabled `Cta` text colour #6e6e73 should be deck grey #737373. The header's solid "Try Hanzo" and the scrolled header ask are shared chrome.
