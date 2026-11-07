# /contact-sales — James-eye review

Verdict: 5/10
First complaint: "Purple again, with a little label on top of the title. And after the form it just fizzles out: a list, some grey names, then the footer."

Walked 7 Nov, page file at `f33ebae` (`components/pages/ContactSales.jsx` and its css), on main plus the Company branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus reduced motion and JS off. Stills: `review/contact-sales/desktop-walk.jpg`, `review/contact-sales/phone-walk.jpg`.

## What works
- The form as a conversation is the right idea for this page: one question at a time, set large ("01 Full name"), a progress line, and Enter to move on. It is still the one real form.
- "Your brief" gathering under the questions, with "+ Add to brief" on the Enterprise list, helps someone decide what to ask for.
- The alternatives (cal.com call, enterprise@hanzo.ai, Get Hanzo Team) sit as quiet ruled rows under the lede, which is calm.
- No layout shift; reduced motion leaves 0 running animations. Parity: text 30/30, links 17/17.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "Talk to sales" and a form ready to type. Movement: only a blinking caret and a contour field you can barely see behind the card. Nothing on the stage moves with any purpose until you type.
2. **One in, one out, or a document?** Hero, then a numbered list, then a row of names, then the footer. It is short, so not a document, but it is not a scene either.
3. **A real visual object in every section?** Hero: yes (the form card). "What Enterprise includes": no, it is a text list. "Products Hanzo built and launched": the logo images fail to load, so it shows grey names in plain text with a large empty white band under them. It looks unfinished.
4. **One ask, sticky after the hero?** Partly. A floating bar appears mid-page, but it reads "Talk to sales" twice (the page name beside a "Talk to sales →" button), and it is gone by the end. The page has no closing ask; it ends in the footer.
5. **Every hover and press answers, no jumps?** Mostly. Pressing "+ Run Hanzo in your cloud" changes nothing. On the phone, tapping "+ Add to brief" makes the button grow from 122 to 137px as its label changes: a small jump. The logo rail uses 24 native browser tooltips.
6. **Overlaps, font swap, layout shift?** No shift, no swap, no overlaps. JS off: 3 of 6 text blocks stay invisible.
7. **Which reference, is its motion there?** chatgpt.com/business/enterprise calm, in the hero only. Its logo wall "in motion" is here as text names, not logos.
8. **Different from neighbours?** No. Kicker, left Display headline and a right object, like /contact, /support, /press, /investors, /brand and /careers, with a tint of its own (violet).
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/contact-sales.md`.
10. **Banned tells?** Yes:
    - an eyebrow over the h1 ("ENTERPRISE"), plus mono labels over the rail ("PRODUCTS HANZO BUILT AND LAUNCHED");
    - a violet UI hue (`#7b61ff`) on the kicker, progress line, caret, numerals and the tinted panel behind the card;
    - native tooltips.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 Page endings:** no closing Band.
- **2.4 Conversion:** the sticky bar repeats one label twice and disappears; no `data-cta`.
- **2.5 Trust:** the logo files are missing, so the proof row is text. The plan asks for the logos to be vendored into the site.
- **2.7 Visual system:** violet accent and a tinted panel instead of the grey deck.
- **2.8 Components:** 24 `title=` tooltips; the "Add to brief" button changes width.
- **2.9 Motion:** no idle motion with a purpose (no self-running demo of the conversation).
- **2.17 States:** half the text is invisible with JS off.
- **2.18 Measurement:** no `Persona:` / `Goal:` / `CTA:` lines.

## Fixes (in order)
1. **Strip the eyebrow and the violet.** Delete "ENTERPRISE" over the h1. Progress line, caret and numerals go to ink; the panel behind the card goes to `#f5f5f7` or a silver token.
2. **Let the form show itself.** Before anyone types, play the conversation once from Hanzo's own field labels: a name types in, the answer slides up, the next question rises, the brief gathers a line, then it settles back to "Full name". It runs once, never loops.
3. **Fix the proof row.** Get the real logo files in (the plan's media mirror), drop the `title=` tooltips, and close the empty white band under the row.
4. **End with one ask.** Add a closing Band repeating "Talk to sales" as the only solid button. Make the floating bar show the page's ask once (not "Talk to sales" twice) and keep it to the end.
5. **No jumps.** Give "+ Add to brief" a fixed width so the label change does not resize it, and give the Enterprise rows a pressed state.
