# /contact-sales — James-eye review

Verdict: 7/10
First complaint: "It's a white form in a grey box, and after a second nothing on that screen moves. You told me the contour field answers the form. I can't see it, because it's under the card."

Walked 7 Nov, about 15:00 to 15:30 UTC, with HEAD at `5768307`. Page files: `components/pages/ContactSales.jsx` and `ContactSales.css`, plus the company `MaskLines` and `deck.css`.

How it was walked:
- Headless Chromium at 1470×801 and at 375×812 (isMobile, touch). Both sizes had a first visit and a return visit (`hz-arrived` set), filmed. I scrolled each screen with a dwell, and hovered and pressed every control on desktop. On the phone I filled the form by tap.
- The form was filled step by step at both sizes. A wrong email was tried first, then Back and forward, a reload mid-form, and the inclusions added from the last step and from the list.
- api.hanzo.ai was always intercepted and never reached. The outcomes tried: a 200 after 2.5s, a 500, a hung request, and then a retry after the failure.
- Also checked: reduced motion, JS off at both sizes, widths 320, 375, 768, 1024 and 1920, 375×667, a Tab crawl, idle frames for 10s at both sizes, the layout-shift observer, phone tap targets and the console.
- Scripts: `parity.py` (30/30 text, 17/17 links), `taste.py` (OK), `unique.py` (OK).

Stills:
- `review/contact-sales/desktop-walk.jpg`:
  1. the first screen at rest;
  2. the last step, with hover on 02 reading out its sentence;
  3. sending;
  4. 1,000–4,999 was chosen, then Back, then Enter, and the size is now 1–49;
  5. the inclusions, with the ask bar saying "Talk to sales" twice;
  6. the proof rail as grey names over a white gap, then the Band.
- `review/contact-sales/phone-walk.jpg`: the first screen, Team size, the last step with five unlabelled numerals, sending, sent (in view), the inclusions with the bar, then the rail and Band.

A note on the console. A red "1 Issue" badge (a hydration mismatch) appeared only on runs where I took a screenshot before hydration had finished. The diff is `style` on the inputs, which is Playwright's own caret-hiding. Seven loads without early screenshots were clean, so it is not counted against the page.

## What the last review (6/10) asked, checked again
1. **A send you can see, where the finger is: fixed.**
   - The submit is its own ink pill. While sending it stays rgb(10,10,10) with a white ring that turns.
   - The card keeps its height into the sent state and lands in view: CLS 0.0009 on desktop, 0 on the phone. The status takes focus.
2. **Inclusions kept out of the note: fixed.** Typing can no longer glue onto them. They join `need` only at send, one sentence per line after your own words.
3. **Ask to the end: fixed.** The bar shows from scrollY 863 to 1439 on desktop (840 to 1680 on the phone), and then the closing Band carries "Talk to sales". It still reads "Talk to sales" twice on desktop (see 4 below).
4. **The hero jumping on desktop: fixed.** The card is 486px for every step, and Next/Send sits at y=625–673 throughout. A "+" in the list no longer moves focus or the step (the tapped row stayed at y=211).
5. **Phone and keyboard: mostly fixed.**
   - Chips have their own row and none are clipped.
   - Arrow keys only choose.
   - The 8s timeout and one retry work: a hung POST gave 2 calls, then the failed state.
   - A new keyboard bug has replaced the old one (see below).
6. **A moving hero object of its own: not done.** 13.5k of the Sigil's 15k inked canvas pixels sit under the opaque white card. What shows is a 27px strip whose lines are 230–244 grey on a 245 ground. "cal.com ↗" and "01 / 05" are gone.

## What works
- **It sells at once, at both sizes.** "Talk to sales" is in Zen 84px at 497, with the lede, a card asking "Full name" and one black arrow. The routes are quiet ruled rows.
  - On desktop the header ask is an outline after hydration, so there is one solid.
  - On the phone the arrow sits at y=591–639, above the 667 fold.
- **The conversation is a real signature.** One question set large. Enter moves on, the answer lifts 16px away and the next rises in 300ms on ease-emphasis, and the progress line glides. Your answers gather as chips.
- **The last step's numerals are a good "Beyond".** Hovering 02 reads "Dedicated compute, and your own models trained and hosted" under the row.
- **The request is right.**
  - It is a POST to /v1/marketing/leads as `application/json`.
  - The keys are name, email, company, size, need, source and visit (consent, tags, userAgent, url), the same set and order as `content/forms.json`.
  - A 500 keeps every answer and shows Hanzo's "Prefer email? enterprise@hanzo.ai", and a retry then delivers once.
  - The draft survives a reload: name, note, picks and step.
- **The inclusions answer the pointer.** The giant numeral greys, darkens and slides 10px, and "+" turns into a tick with the numeral going to ink. The heading pins while the list scrolls past, which is the page's one calm hold.
- **Engineering checks pass:**
  - no sideways scroll at 320, 375, 768, 1024 or 1920;
  - 0 phone targets under 44px;
  - no font swap (Zen is the rendered face);
  - CLS 0 at rest;
  - with JS off, every question, size, inclusion and the Band words are visible at both sizes;
  - with reduced motion, 0 running animations, and the rail becomes a still wall;
  - the console has only the ten hanzo.ai logo 404s.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** It sells. The card rises (0.4s) and the h1 cuts in by line between about 0.55s and 1.4s after first paint. After that the first screen is still: in 10s of idle frames at both sizes, the only change is the 27px contour strip under the card, at most 26 grey levels. The field that "redraws with every answer" redraws under the card.
2. **One in, one out, or a document?** It is a short, calm Utility page in three blocks: the form hero, the five inclusions with a pinned heading, and the proof rail, then the Band. That suits §4.5, which allows no scroll theatre. Between the list and the rail there is about 250px of white on desktop, and another 160px under the rail's one row of names.
3. **A real visual object in every section?**
   - Hero: the form card.
   - Inclusions: the giant numerals.
   - Rail: logos, which here are names in grey type because hanzo.ai is blocked. The fallback is tidy: 21px Zen grey, turning ink on hover.
   - The logos are not mirrored into `public/` (MASTER part 10), so the static export will show names too.
4. **One ask, sticky after the hero?** Yes, from the hero to the Band. On desktop the bar reads "Talk to sales | ⌕ | Talk to sales →", because the page sets `data-ask-name="Talk to sales"`. After the Band, the footer screen goes back to the header's solid "Try Hanzo" (shared header).
5. **Every hover and press answers, no jumps?** The hovers answer:
   - Route rows ink their label and nudge the right side 6px.
   - The AI link thickens its underline and drops it to a 6px offset.
   - Next darkens to #262626.
   - Pills and round buttons ink their border.

   The round buttons, pills and send press to .98. Route rows and logo links have no pressed state. Jumps:
   - A failed send grows the card from 486 to 524px. The stage top rises 12px and the send drops 25px. With a hung request that shift lands 16s after the click, so it counts as unexpected (CLS 0.019).
   - On the phone the card grows with each step (242→284→440→512px) and pushes the routes down. This happens after your own tap, so it scores 0.
   - Reloading on the phone with a draft at the last step grows the card 270px after hydration, with no input: CLS 0.129, which is "poor".
6. **Overlaps, font swap, layout shift?** No overlap and no swap. The only layout shifts are the two in 5.
7. **Which reference, and is its motion there?** chatgpt.com/business/enterprise calm is there: the quiet routes, the listed inclusions and a low-key proof rail. The osply/hamol-style micro-motion is there in the steps and the numerals. Nothing else is.
8. **Different from its neighbours?** Partly.
   - The conversation, and inclusions you add to your enquiry, are its own (`unique.py` passes).
   - The first screen is the company-kit skeleton seen on /contact, /support and /careers: a Display h1 on the left and a box on the right. Here it is a white card inside a grey rounded panel.
   - The one thing that would set it apart, the field answering the form, cannot be seen.
9. **18 parts?** See below. The card is accurate on payload, parity, JS off, reduced motion, the timeout and sent-in-view. Some claims are wrong or too generous (listed below).
10. **Banned tells?** No hue, no eyebrow above a headline, no gradient text, no Inter, no `title=` tooltips, and no buttons that fade on hover.
    - Borderline: "a framed or boxed static hero". It is a card in a box, and it is still after 1.4s.
11. **Copy untouched?** Not quite. The live kicker "Enterprise" over the h1 is deleted (listed in the page's "Deletes").
    - §0.4 puts copy first, and part 7 says a kicker's words stay, set below the heading as a caption.
    - Parity passes only because "Enterprise" is a substring of "What Enterprise includes".
    - The sent state repeats the lede's sentence; that is listed for James, which is fair.

## Problems the card does not mention
- **Team size is overwritten from the keyboard (the money form sends the wrong lead).**
  - Steps: choose "1,000–4,999 people", press Back (focus goes to the 1–49 radio, not the checked one), then press Enter. The size becomes 1–49 and is sent as `"size":"1-49"`.
  - Reproduced 4 times at both sizes.
  - Cause: every radio's Enter handler writes its own value, and `refs.current.size` is always the 1–49 input (`ContactSales.jsx:129-133`).
- **The rail does not pause on keyboard focus.** A focused logo slid 100px in 2s, out under the edge mask. Part 5 asks for a pause on hover *and* focus. Only `:hover` and the button pause it (`ContactSales.css:99`).
- **Errors have no words.** A bad email shows only a "!" next to "Work email", and its alert's name is just "Work email". A failed send shows "!" and "Prefer email?" but never says the send failed. Since the register has no strings for these, they belong on the card as copy questions for James, and they are not there.
- **On the phone the five numerals on the last step are mystery buttons.** The only way to learn what 03 means is to tap it, which also adds it to your enquiry. The meaning is 400px further down the page.
- "Unlimited members, single sign-/on…" breaks at the hyphen at 1470.
- The h1 bottom sits at 46% of the screen, against about 38% in part 3. The next section does not peek (it starts at y=861).

## Coverage card, claims that do not hold
- **Part 3, "Idle. The contour field drifts and redraws."** It does, under the card. On screen it is a near-white 27px strip.
- **Part 5, "Marquees pause…"** They do not pause on focus.
- **Part 6/7, deletes "the Enterprise eyebrow".** Part 7 says to keep the words below the heading.
- **Part 8, "Every control has … press".** Route rows and logo links have none.
- **Part 10, "nothing missing".** `/logos/customers/*` is not in `public/`, and no mirror request is filed.
- **Parts 11/17, "a card whose height never changes".** It grows 38px on failure, and 270px on a phone reload with a draft (CLS 0.129).
- **Part 12, "Keyboard reaches every control".** It does, but Back and then Enter rewrites Team size.

## Six axes (money page)
| Axis | Score |
|---|---|
| Clarity | 5 |
| Hierarchy | 4 |
| Craft | 3 |
| Motion | 3 |
| Distinctiveness | 3 |
| Action | 4 |

Distinctiveness is under the 4 the gate needs.

## Fixes (in order)
1. **Never rewrite a chosen size.**
   - Back to Team size should focus the *checked* radio (roving tabindex).
   - Enter should move on with `v.size` as it stands, not the focused radio's value.
   - Acceptance: choose 1,000–4,999, Back, Enter, and the payload says `1000-4999`.
2. **Let the hero's object be seen and alive.**
   - Shrink or offset the card so the contour field shows around it: at least 30% of the stage at 1470. Raise the line contrast to about the deck's black 20–30%.
   - Make one hill visibly rise with each answer, outside the card.
   - Let it drift by itself after the arrival, so the first screen still moves at 3s.
   - That also answers "boxed static hero" and gives the page its own first screen against /contact, /support and /careers.
3. **Put "Enterprise" back as Hanzo's words, below the h1.** Use a 12px Zen Mono caption, per part 7.
   - Name the bar with the same word (`data-ask-name="Enterprise"`), so the desktop bar stops reading "Talk to sales" twice.
4. **Hold the card's height in every state.**
   - Reserve the failure line's row, so a failed send does not grow the card.
   - On the phone, restore a draft at the first step's height, or before first paint, so the reload shift (0.129) goes.
5. **Pause the rail on focus.** Add `.xcs-rail:focus-within .xcs-track { animation-play-state: paused }`.
   - Request the logo mirror into `public/logos/customers/`, and close the white gap under the single row.
6. **Small things.**
   - Give the route rows and logos a pressed state.
   - On the phone, show the focused or last-tapped numeral's sentence before it is toggled (a first tap reads it, a second adds it), or show it on press.
   - List the missing error and failure wording on the card as copy questions for James.
