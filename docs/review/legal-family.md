# /legal/* — James-eye review

Verdict: 6/10
Ready: 7 Nov, held up next to /api and /affiliate (no score). Verified the earlier wip fixes in the browser rather than redoing them: tables fit all 7 columns at 1470 with no wheel trap and stack as labelled cards on phones, the rail marker stays visible in 25/25 Terms sections, Hanzo-only numbers, a 44px cover numeral turning in one stable node, one index on phones, print from page 1, 44px copy/clear controls with the check inside the screen; dropped the leftover score from the header comment. taste/unique/parity OK (acceptable-use 88/88 text 5/5 links, terms 168/168 12/12, subprocessors 75/75 2/2, cookies 61/61 2/2, dpa 100/100 0/0, all 11 members OK); 0 console errors, no overlap at 1470x801 and 375x812 (checker hits are hidden captions, `.x-sr` numbers and the closed phone Contents). Shared, not this page: arrival curtain on deep links, Morph cut-over, footer title tooltip and blue icon, header calling api.hanzo.ai (docs/requests/legal-family.md).
First complaint: "It's 29 screens of the same giant grey number and a paragraph, and the contents list on the left stops at 16, so I lose where I am. Then on the subprocessor page the table is cut off and my scroll gets stuck in it."

Walked 7 Nov. Page file at `d46d037` plus the owner's uncommitted edits made during the walk (14:32 UTC: `data-ask="off"`, Hanzo-only numbers on the cover, a 13px floor for code). The files are `components/pages/LegalDoc.jsx` and `LegalRoom.css`, on the kit `FamLines`, `FamStage`, `FamNext` and `DocNodes`.

How I walked it:
- Filmed moving at 1470×801 and 375×812: idle, wheel scroll, finger scroll, hover on index rows and cards, find, a rail jump, sibling click, phone swipe.
- Also checked reduced motion, JS off and print to A4.
- Mainly /legal/terms and /legal/subprocessors, with a glance at /legal/cookies, plus the plate numbering on all 11 documents.

Still: `img/legal-family.jpg`.
- Top: reading §23 of Terms at 91%. The rail stops at row 14 with no marker in sight, and Chrome's blue × sits in the find field.
- Bottom: the Subprocessor Register at 1470. 2 of its 7 columns are cut off, and 30 wheel notches moved the page 0 px.

## What works
- **The title is a real Display moment.** It is 96px with line height .92. The title, lede, effective date and version (and "Draft." where it applies) all sit above the fold at 1470×801 and 375×812. The "Legal" kicker moved from above the h1 to under the dates.
- **0 UI hues in the template's own CSS:**
  - an ink rail marker and ink hit-count pills;
  - grey find highlights through the CSS Highlight API.
- **Find in this document is useful.**
  - Typing "data" gives 22 hits in 10 of 25 sections, with a count per rail row.
  - Rows without the word dim, and the matches light up in the text.
- **The cover's hover tells you something.** Hovering any index row shows that clause's number and first sentence. The row draws an ink underline, and a press moves it by 1px.
- **The sibling cards answer.** They lift, show their own lede and turn their arrow. A press scales them to .98.
- **Reading is good.** Prose is 19px at 64ch. Every heading keeps its id and its copy link, and a rail jump lands the heading 104px down, clear of the header.
- **Behaviour checks pass:**
  - CLS is 0.
  - Reduced motion leaves 0 running animations and the plate holds still.
  - With JS off everything is legible.
- **Parity is clean:** Terms text 168/168 and links 12/12; Subprocessors 75/75 and 2/2; Cookies 61/61 and 2/2.
- **The phone sideways swipe works:** Terms goes to Acceptable Use, Cookies to Cybersecurity, and Subprocessors to Terms. The exception is a swipe over the turning plate (see 6).
- **The ask bar was fixed during the walk.** The site's "Try Hanzo" bar rode over the prose at both widths and covered a sibling card's arrow at 1470×801. The owner added `data-ask="off"`, which PLAN 2.4 requires (no thumb bar on legal), and the bar is gone.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The words sell: what the document is, its date and its version.
   - **Hierarchy:** the heaviest mass on screen is not the title. The cover's "1." is 118px, or 127px with the stage zoom, against a 96px h1.
   - **The cover's first line is cut:** "Hanzo AI, Inc. ("Hanzo," "we," "us") makes Hanzo:". `firstSentence()` stops at the first colon.
   - **Movement:** the timing bar fills, and the plate turns every 3.4 s. That only starts once the site's 000–100 arrival curtain lifts, which plays on this deep link.
   - **Hidden motion:** the h1's word rise plays under that curtain, so nobody sees it. The contour drifts at 16% opacity, which is invisible on #f5f5f7.
2. **One in, one out, or a document?** A document. The cover is the only scene. Terms is 23,168px tall: 29 screens at 1470 and 37 on a phone. Each of its 25 sections opens with the same 96px grey numeral that turns ink.
3. **A real visual object in every section?** No.
   - The hero has the cover, a type card over a faint contour.
   - Below the plate, the cover's left half is empty grey for a full screen.
   - On Cookies, with 4 rows, the right half is an empty white box.
   - The reading room is text only.
   - The six sibling cards are grey contour cards that look alike.
   - Legal has no Hanzo imagery, which is acceptable, but the object is thin.
4. **One ask, sticky after the hero?** None, by design for legal, and correct since 14:32. The header's "Try Hanzo" stays. The contact addresses in each document are the only action, and they carry no event.
5. **Every hover and press answers, no jumps?** Desktop: yes, mostly.
   - The rail rows tint on hover but have no press state.
   - The copy-link buttons only fade in, from opacity 0.

   Phone:
   - Tapping a copy link shows "Link copied" off the right edge of the screen: the tip sits at `left:34px` of a button at x=331.
   - The copy-link buttons are 28px and 24px wide.
6. **Overlaps, font swap, layout shift?** CLS is 0, and the curtain hides any swap. But:
   - **The rail does not follow.** At 801px it shows rows 1–16 and never scrolls to the active row. Reading §23 at 91%, the marker is 240px below the rail's bottom edge, so the signature is invisible for 9 of 25 sections.
   - **The tables break at 1470.** They are 7 columns, 1,133px wide, in a 758px frame with its own vertical scroll and `overscroll-behavior: contain`. Two columns are cut off, and the wheel is trapped: 30 notches moved the page 0px.
   - **The phone swipe dies if the cover plate turns mid-gesture.** The plate is keyed and remounts, so the touch target is removed from the page. This reproduced 2 of 2 times on Terms and on Subprocessors.
   - **Reduced motion:** the cover sits at scale 1.08 and 48px low, then snaps flat on the first scroll.
   - **Print:** 14 A4 pages. The prose starts on page 3, the index rows overlap on page 2, and "Skip to content" prints on every page.
7. **Which reference, and is its motion there?**
   - It feels like a calm Stripe- or Apple-style legal reading room, which is right for the persona.
   - The synchronized.studio card-into-page move is claimed but was not seen. The dev route took over 700 ms, so `Morph.jsx` cut over: the old Terms jumped to its own top and sat there 3.6 s, then Cookie Notice appeared with no title flying into its h1.
   - Re-check this on the preview build.
8. **Different from its neighbours?** Only partly.
   - The hero composition is /integrations/cursor's: h1 left, lede top right, object below.
   - The object is /trust's: a numbered list beside a giant "01" panel.
   - The /legal hub (a paper stack) is different.
9. **18 areas?** See below. `docs/coverage/legal-family.md` exists but overclaims:
   - "text 14px or more" on a phone;
   - "swipe checked";
   - "never a count of ours" for the cover, while the section plates still invent numbers.
10. **Banned tells?**
    - No eyebrow over the h1. Good.
    - One hue and one browser-default control: Chrome's blue × cancel button in the `type="search"` find field.
    - The copy buttons appear by fading.
    - "CONTENTS" is a mono, uppercase, tracked kicker. It is not over a headline, but it is the look James dislikes.
11. **Copy untouched?** Parity is clean, but the template adds numbers Hanzo never wrote:
    - "§1–§6" on Subprocessors and "§1–§10" on Cybersecurity;
    - "§15 Annex I", "§16 Annex II" and "§17 Annex III" on the DPA. A lawyer could cite section numbers that do not exist.

    Other copy problems:
    - The cover crops clauses mid-sentence and can add "…".
    - "Contents" and "Not in this document" show as visible text, but the register marks them `needs_james: true`.
    - "Link copied" and "Copy link to this section" are not in the register.

## Missing from the 18 areas
- **2.2 Navigation:** the rail cannot show rows 17–25 at 801px and does not follow the reader. The phone "Contents" disclosure has no chevron and no open/closed cue.
- **2.3 First impression:** the squint test fails (cover numeral larger than the h1). The cover's line is cut. The arrival cut-in is spent under the site curtain. The morph is unverified.
- **2.5 Legal typesetting:** there is no print CSS. PLAN asks for it on legal, and counsel prints Terms and the DPA.
- **2.6 Tables:** none of the planned table behaviour is there:
  - no wide layout;
  - no pinned first column;
  - no stacked rows under 720px;
  - an inner vertical scroll that traps the wheel.

  Separately, the phone type floor fails: cover index numbers and "Contents" are 13px.
- **2.8 Components:** a browser-default search control; 28px copy buttons; a tip off-screen on phone; strings outside the register.
- **2.9 Motion:** the plate change is unmount plus fade-up, not an authored move. Reduced motion snaps on the first scroll. The signature marker vanishes for the last third of long documents.
- **2.11 Mobile:**
  - The index shows twice: the 25-row cover list, then the 25-row Contents. The first clause starts about 2.7 screens down.
  - Tables show 2 of 7 columns.
  - The swipe dies over the turning plate.
- **2.12 Accessibility:** inactive number plates are heading text at about 1.4:1 contrast.
- **2.18 Measurement:** the stated metric, "one contact click", has no event or `data-cta` on the contact links.

## Fixes (in order)
1. **Fix the tables (Subprocessors, Cookies, DPA).**
   - At 900px and up, let `.xlg-tw` break out of the 760px measure to the full right column so all 7 columns fit at 1470.
   - Drop the frame's `max-height`, its vertical scroll, `overscroll-behavior: contain` and the vertical `data-lenis-prevent`, so the wheel always moves the page.
   - Under 720px, stack each row as a card with its header labels (PLAN 2.6), or at least pin the first column with an edge fade.
2. **Make the rail follow the reader.**
   - When `active` changes, scroll the rail so the active row sits about a third of the way down (smooth; instant under reduced motion).
   - Add top and bottom fades on the rail's edges.
   - Acceptance: at 1470×801 the marker is visible in every one of Terms' 25 sections.
3. **One numbering system, Hanzo's only.**
   - Delete the `'§' + i` fallback in `Section`: no plate when Hanzo gives no number. The DPA annexes read "Annex I" exactly as written.
   - The cover, the rail and the plates then agree.
4. **Fix the cover's hierarchy and line, and stop the remount.**
   - Cap the plate numeral at about 72–80px at 1470, so the 96px title stays the strongest mass.
   - Show the first complete sentence that ends in a full stop, or the section title when it would not fit. Never cut at ":" or ";", and never add "…".
   - Turn the plate inside one stable node: the old number masks up as the next masks in. This replaces the fade-up and fixes the dying swipe.
   - Pause the turning on `touchstart`.
5. **Show one index on phones.**
   - Under 900px, the cover keeps only its turning plate, or its list becomes the Contents disclosure. The first clause should start within about 1.5 screens.
   - Give the summary a chevron and an open state.
   - Set `.xlg2-ix-n` and the Contents label to 14px.
6. **Add a print stylesheet.**
   - Hide the header, footer, skip link, cover, rail, find, copy buttons and siblings.
   - Print the prose at full width, about 11pt.
   - Keep each `h2` with its first paragraph (`break-after: avoid`).
   - Print the effective date and version on page 1.
   - Acceptance: Terms prints with text from page 1 and no overlapping rows.
7. **Fix the small controls.**
   - Hide `::-webkit-search-cancel-button` and draw an ink 44px clear button.
   - On coarse pointers, make the copy links 44×44 and place the "Link copied" tip inside the viewport (to the left of the button). Take its strings from the register, and show "Contents" and "Not in this document" as icon plus aria-label until James approves them.
   - Under reduced motion, make `FamStage` render settled at first paint instead of snapping on the first scroll.
   - Inactive plates at 3:1 or better.
   - Add a press state on rail rows.
   - Track the contact `mailto:` clicks (the page's metric).
8. **Raise these site layers with the conductor (not this template):**
   - The 000–100 arrival curtain plays about 2.4 s on a deep link to /legal/terms and hides the h1 cut-in. CANON says home only, skip deep links, no counter.
   - The Morph cut-over scrolls the old page to its top while it waits (3.6 s on dev). Verify the card-to-h1 flight on the preview build.
   - The footer's "Talk to Hanzo" button uses a native `title` tooltip.
   - The footer's privacy-choices icon is blue.
