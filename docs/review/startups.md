# /startups/: James-eye review
Verdict: 7/10
First complaint: "On my phone that black Acme box sticks under the header and rides over the form. It covers the questions as I scroll and ends up sitting on the privacy line under Submit. Something's floating over the content again."

Walked 2026-11-07 17:06 UTC on the dev server at 1470x801 and 375x812, moving. All three form steps were walked with test values, and every non-GET request was aborted, so nothing was sent.

## The 11 answers
1. **First screen**
   - Sells in 5 s: the 52px h1, the lede, the primary, and a $150,000 odometer card as the object.
   - Motion within 1 s: yes. Frames at 300 ms and 1000 ms differ as the odometer digits roll in and the CTAs rise 16px.
   - After about 3 s the hero is still. Frames at 4 s and 7 s are identical, with no idle life on the first screen.
2. **One in, one out**
   - Partly. The program list lights one row at a time (the active row is ink #0a0a0a, the rest #737373).
   - The active row lags the viewport. At scrollY 1100, row 03 is on screen at top 90 and still grey, while row 02 (at -86, off screen) is still the lit row. Row 03's own $150,000 odometer stays grey.
   - The Techstars paragraph sits in about 500px of white with nothing else in it. That is a dead stretch.
3. **A real object per section**
   - Hero: the odometer card.
   - Form: a live summary card. It runs a demo by itself ("Acme AI", "0/5 · Select stage" moving to "2/5 · Seed") and then follows what you enter: "Test Co · 4/5 · Seed". Ticking Sequoia swaps it to "Up to $150,000 in credits"; Compute and the "heard about" answer light up too. This is the page's moment and it is good.
   - No object: the Techstars paragraph and the black "Not venture-backed?" Band (text and two buttons only).
4. **One ask; rhythm**
   - The header ask swaps from a quiet "Try Hanzo" to a solid "Apply for credits" once the hero ask leaves view. Good.
   - Phone: the sticky summary bar (56px, top 60 to 116) floats over the form. Content measured under it: "How will you use Hanzo?", "A friend or colleague", "Hanzo docs or GitHub", and at the end "By submitting…" and "Submit application". It never releases at the form's end.
   - Rhythm is mostly fine: the h1 is 52px and the h3 rows grow when active. On the first screen, though, the 52px h1 and the about 59px odometer digits are two big things side by side.
5. **Hover and press**
   - Every control changes background, not opacity: primary #0a0a0a to #262626, ghost to #f5f5f5, Band white to #e4e4e7.
   - Press is a 0.97 scale with no layout jump.
   - The stage chip hover is barely visible (#f2f2f2 to #ececef), and no hover tells you anything.
   - Pressing the primary scrolls to the form, but focus stays on `<body>`.
6. **Overlap, font swap, layout shift**
   - CLS is 0.0002 to 0.0008 over 4 cold loads, with no font swap.
   - Phone overlap: the sticky summary bar (see 4).
   - Form bug, 4 of 4 runs: pressing "02 / 03" with the form empty shows a grey box, "Company name is required." The box stays after the field is filled. There is no `aria-invalid` on the field and no inline error under it.
7. **Reference**
   - It feels like chatgpt.com/business/enterprise: calm, with quiet proof.
   - The live card has the synchronized.studio "it answers you" feel, but there is no Morph or pointer layer.
   - Kinds of motion: arrival (rise, odometer), idle (the card demo), state (steps, the card reacting), scroll (the row highlight). There is no pointer motion at all.
8. **Neighbours**
   - Its own medium: an odometer hero plus a live application card. Not template-like.
9. **The 18 parts**
   - Present: one h1, the sticky ask, a Privacy link in the submit viewport, a honeypot, steps "01 / 03", a Band, and the footer.
   - Missing or weak: inline field errors (part 12), focus on the first field after the ask (part 8), and a Band with an object.
10. **Banned tells**
    - No hue, no eyebrow above a headline (the "TECHSTARS '17" caption sits below the h1), no gradient text.
    - The hero card is both outlined (1px) and raised (a large soft shadow). The deck says one or the other, and a boxed white card reads close to a "framed hero".
11. **Copy**
    - parity.py `/startups: OK text 82/82 links 3/3`.

Console: 0 errors on 4 of 4 cold loads, desktop and phone. One "1 Issue" badge appeared once during an interaction run and did not come back on 4 fresh loads, so it is not counted.

Shared (not this page): on phone the header "Try Hanzo" is always solid, so the first screen has two solid fills. On desktop the glass header shows a grey smear over the dark card while scrolling.

## Fixes (in order)
1. Phone: stop the summary bar overlapping content.
   - Either let it scroll inside the form column, or give it its own reserved row (padding-top on the form equal to the bar height plus 10.5px).
   - Release it when the form's last button leaves; it must never sit over Submit or the privacy line.
   - Give the "4 / 5 · Seed" line room: it touches the bar's bottom edge.
2. Program list: drive the active row from the viewport centre (the row crossing about 45% of 100svh), so row 03 lights while it is on screen. Its $150,000 should roll to ink when it lights.
3. Form errors:
   - Clear the error as soon as the field is valid.
   - Put it inline under the field with `aria-invalid` and `aria-describedby`.
   - Move focus to the first field when "Apply for credits" lands on the form.
4. Give the hero life after arrival, for example a very slow re-tick of one odometer column or a pointer-aware sheen on the card. Drop either the border or the shadow on the card.
5. Fill the dead Techstars stretch and the Band with something to look at: the "Techstars '17" mark or a small figure from existing copy beside the paragraph, and something quiet in the Band so the black room is not just text.
