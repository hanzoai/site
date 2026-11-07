# /contact-sales — James-eye review

Verdict: 6/10
First complaint: "I filled it in on my phone and pressed Talk to sales. The button went blank grey, then the whole page jumped and I'm looking at 'What Enterprise includes'. Did it send? This is the one form that makes us money and I can't tell."

Walked 7 Nov, about 14:19 to 14:33 UTC, with HEAD at `9e22aba` and then `927bd19`.
- Page files: `components/pages/ContactSales.jsx` and `ContactSales.css`.
- A page commit landed during the walk: `94acb12` at 14:27. It pauses the CSS arrivals under the curtain and stacks the questions with JS off. I re-ran the arrival, idle and JS-off checks on it, and the phone form runs were made on it. The form code it touches (only `aria-hidden`/`inert` after hydration) does not change any form finding below.

How it was walked:
- Filmed with headless Chromium at 1470×801. Wheel flicks with a dwell on every screen, hover and press on every control, and the form filled step by step.
- Filmed at 375×812 (isMobile, touch). Taps, form by touch, and an inclusion tapped from the list.
- Also checked: a return visit with no curtain, reduced motion, JS off at both sizes, and 320 and 375 widths.
- Measured: the layout-shift observer, tap targets and the console.
- api.hanzo.ai was always intercepted and never reached. I faked a 500, an abort, a 2.5s 200 and a hung request.

Stills:
- `review/contact-sales/desktop-walk.jpg`. Top row: the first screen at rest; the last step, with the note glued together ("…hostedA private model…"); sending, where the solid button is a pale empty pill. Bottom row: the inclusions with the ask bar; the rail with the bar gone and the header back to solid; the failed state.
- `review/contact-sales/phone-walk.jpg`. Team size; the last step with clipped chips; sending (blank pill); after success (the confirmation is above the screen); an inclusion before and after its "+" is tapped (the row drops 409px).

## What works
- **First screen at both sizes.**
  - At 1470×801 the h1 (Zen, 120px, line height 0.92), the lede, the card and its arrow all fit. The arrow's bottom is at y=605, and the last route line ends at y=784.
  - At 375×812 the h1 (64px), the lede and the card come first, with the arrow at y=673–725.
  - There is one solid button on screen (the arrow), and the three other routes are quiet rows.
  - Ink, greys and white only.
- **The conversation is a real signature.**
  - One question at a time, set large. Enter moves on, the answer lifts away and the next question rises.
  - The progress line springs, and answers drop in as chips.
  - Arrow and pills press to .98. The arrow darkens on hover, and pills ink their border.
- **The request is right.** It is a POST to /v1/marketing/leads with `application/json`.
  - The keys are name, email, company, size, need, source and visit (consent, tags, userAgent, url). That is the same set in the same order as `content/forms.json`.
  - A 500 and a network abort both keep every answer and show Hanzo's "Prefer email? enterprise@hanzo.ai".
  - The honeypot is off-screen, `aria-hidden` and has `tabIndex=-1`.
- **Inclusions answer the pointer.** The giant numeral greys from #d2d2d7 to #6e6e73 and slides 8px. "+" spins into a tick, and "See everything in Enterprise" nudges its arrow.
- **The rail.** It pauses under the pointer and has a pause button. With logos blocked (all ten 404 here), the names show in grey type and ink on hover.
- **Arrival (after `94acb12`).** The card rise and the h1 cut-in wait for `hz-arrived`. On a first visit the card is seen rising as the curtain wipes up.
- **Reduced motion and JS off.**
  - Reduced motion: 0 animations are running after 4s, and the rail becomes a still, wrapped wall.
  - JS off: all five questions, the sizes and the inclusions stack in order and are legible. The step controls hide, and the routes stay as the way in.
- **Engineering checks pass:**
  - No overlap at rest at either size.
  - No sideways scroll at 320 or 375.
  - Every phone target is 44px or more (size pills 48, round buttons 52).
  - No font swap.
  - CLS is 0 at rest.
  - The only console errors are the hanzo.ai logo 404s.
  - Parity is 30/30 text and 17/17 links.
  - The file has its Persona/Goal/CTA header, and both primaries carry `data-cta`.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells: "Talk to sales", "Full name" and a black arrow. Something moves within a second: the card rises with the curtain, and the h1 finishes its cut-in as the wipe passes over it.
   - After that the first screen is nearly still. Between lift+2.2s and lift+3.2s, 393 pixels change, all in the 44px strip of contour under the card.
   - The Sigil field is almost entirely covered by the card.
2. **One in, one out, or a document?** A short document in three blocks:
   - the form hero;
   - a list of five numerals with a sticky heading on desktop (the only hold);
   - a logo rail.

   Scroll motion is one headline cut-in. Nothing is pinned or scrubbed. On desktop there is about 220px of empty hero below the routes before the list starts.
3. **A real visual object in every section?** Mostly typographic:
   - Hero: the form card, with a faint contour.
   - List: giant numerals.
   - Rail: logos (names here).

   There is no Hanzo media, and none exists for this page.
4. **One ask, sticky after the hero?** No, only in a narrow stretch.
   - The ask bar shows only for scrollY 1000–1400 of 3000 on desktop, and 1200–1400 of 4800 on the phone.
   - `data-ask-hide` sits on the whole rail `<section>`, so the bar leaves as soon as the rail edges in, and the footer takes over after that. The header goes back to a solid "Try Hanzo".
   - The page ends with the wrong ask and no "Talk to sales" on screen. `docs/coverage` says the bar carries the ask "after the hero at every width"; it does so for about 400px.
5. **Every hover and press answers, no jumps?** Hovers and presses answer, except one: "Talk to AI Buying Specialist →" changes nothing on hover (colour, underline and transform all stay the same).

   The state changes jump:
   - **Picking a team size grows the card from 440px to 684px.**
     - On desktop the h1, lede and routes drop 53px and the list drops about 105px.
     - The last step's "Talk to sales" sits at y=766–818, cut by the 801 fold.
   - **Pressing "+" on an inclusion in the list** (the first time) jumps the form to step 5 off-screen. That grows the hero, so on the phone the row you tapped drops from y=320 to y=729 under your finger.
   - **Success collapses the card.**
     - On the phone (a 2.5s reply) the routes jump 471px up and the confirmation sits at y=−252 to −11, above the screen, with CLS 0.48.
     - On desktop the shift is 0.081.
6. **Overlaps, font swap, layout shift?** No overlap and no swap. Layout shift: see 5 (0.48 on the phone's success is "poor"). Also:
   - While the h1 waits in its mask, the tops of "T", "lk" and "t" peek out as stray dashes. On the return-visit film they show for about a second before the cut-in.
   - **Sending:** the submit is a raw `.x-btn`. When disabled, `app/system.css:100` repaints it room-fill grey, and the page's white ring on it is near invisible. "Talk to sales" turns into an empty pale pill at both sizes.
7. **Which reference, and is its motion there?**
   - The calm enterprise list and quiet proof rail are chatgpt.com/business/enterprise, and that is there.
   - The question-by-question state change is authored micro-motion in the osply/hamol sense, and it is real.
   - Apple's pinned or scrubbed scene is not here.
8. **Different from its neighbours?** Partly.
   - The one-question conversation is its own.
   - The hero skeleton is the company kit shared with /contact, /support, /press and /careers: a Display h1 on the left and a white card in a grey Sigil stage on the right.
   - Giant numerals also carry /careers perks and /support.
9. **18 areas?** See below. `docs/coverage/contact-sales.md` is accurate on layout, payload, parity, reduced motion and JS off. Two claims are wrong:
   - "sending (a ring in the button)". The ring cannot be seen.
   - The ask bar "after the hero at every width". It shows for about 400px of scroll.
10. **Banned tells?** None of the list:
    - no eyebrow over the h1;
    - no hue or green;
    - no gradient text;
    - no Inter;
    - no `title=` tooltips;
    - no buttons that fade on hover.

    Borderline: the mono "01 / 05" over each question and the mono "CHOOSE" read as small kickers. The keyboard focus ring draws a box around the underline-only inputs, which gives a double bottom line on every focused field.
11. **Copy untouched?** Nothing lost (30/30, 17/17). Things added that are not on hanzo.ai/contact-sales:
    - "cal.com ↗" (live has only "Or book a 30-minute call");
    - the "01 / 05" step counter;
    - the numerals 01–05 in three places (the list, the form's add buttons and the "✓ 02" chips).

    The success state reuses the lede's own sentence, so on desktop the same sentence is on screen twice.

## Missing from the 18 areas
- **2.1 Forms (the only revenue path):**
  - **The note gets corrupted.** An added inclusion is written into the note with no trailing newline. Clicking into the note and typing glues text onto it. What was sent: "Unlimited members, single sign-on, roles and an audit logSupport desk model".
    - The inclusion then silently un-ticks: its chip goes, and `aria-pressed` reads false.
  - **No timeout.** A hung request was still spinning after 12s, so the 8s timeout with one retry is not done.
  - No sessionStorage draft.
  - Not `LeadForm` (the kit has none yet).
- **2.3 Narrative:**
  - The page ends on the rail with no `Band`.
  - The idle stage is a 44px strip.
- **2.4 Conversion system:**
  - The bar hides for the last two thirds of the page (`data-ask-hide` on the rail).
  - The end of the page carries "Try Hanzo", not "Talk to sales".
- **2.6 Content:** "cal.com ↗", "01 / 05" and the 01–05 numerals are added text.
- **2.7 Visual:**
  - The hero skeleton and the giant numerals repeat the neighbouring pages.
  - The input focus box doubles the underline.
- **2.8 Components:**
  - The submit is a raw `.x-btn` (§4 gate 2), and that is why sending turns grey.
  - At 375 the chips are cut mid-word ("Ada Lovela", "Analytical I", "5,000+ pe", each 83px wide). `text-overflow` does not apply to an inline-flex `li`.
  - No `Band` or `PageHero`.
- **2.11 Mobile:**
  - The last step's submit is below the fold at both sizes.
  - The success lands above the viewport.
  - Chips are clipped.
- **2.12 Accessibility:**
  - **Arrow keys in Team size choose and advance.** ArrowRight picked 50–249 and jumped to 05/05 in 320ms. Back focuses 1–49, so a keyboard user cannot reach 1,000–4,999 without bouncing (WCAG 3.2.2).
  - **"+" in the list sends focus to the hero's textarea, off-screen.** The next Tab lands on the form's first add button.
  - On success, focus drops to `<body>`.
- **2.13 / 2.17 States:**
  - The sending ring cannot be seen.
  - Success is off-screen on the phone, with CLS 0.48.
  - A hung POST spins forever.

## Fixes (in order)
1. **Make the send visible where the finger is.**
   - Build the submit with the kit button (or its own class), and keep it solid ink while sending with a ring you can see.
   - Hold the card at its height into the sent state (or animate the height), and scroll its top into view with `block:'nearest'`. Move focus to the status.
   - Acceptance: with a 2.5s reply, the tick and sentence are on screen at 375×812 and 1470×801, with CLS under 0.02.
2. **Keep inclusions out of the free text until submit.** Hold them in their own list and join them into `need` when sending. That is the same field and the same shape, so typing can never glue onto them or un-tick them.
3. **Keep the ask to the end.** Remove `data-ask-hide` from the rail (nothing at its bottom edge needs the room). Close with the kit `Band` in Hanzo's words, with one solid "Talk to sales" to `#xcs-form`.
4. **Stop the hero jumping.**
   - Size the stage to the last step from the start, or make the form's add buttons a single row of five numerals. Then picking a size never moves the h1, and "Talk to sales" sits above the fold at 801.
   - "+" in the list should not move focus or switch the form's step. Let the chip show up when the form comes back into view.
5. **Phone and keyboard.**
   - Put the chips on their own wrapping row above the buttons at ≤900px.
   - Advance the size step on click, tap or Enter only, not on arrow keys.
   - Add the 8s timeout with one retry, then the failed state.
6. **Give the hero a moving object of its own.** Let the contour field show around a smaller card and answer the form (a hill rises with each answer), so the first screen moves after the lift and differs from /contact and /support. Remove "cal.com ↗", "01 / 05" and the repeated numerals, or get James's yes.
