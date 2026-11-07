# /idv — James-eye review
7 Nov, walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright Chromium: frames at 0, 1, 3, 4, 6, 8 and 10 s untouched; wheel scroll one screen at a time with 1.5 s dwell, then a 400 px fine pass; hover and press on every control on desktop, tap on phone; overflow at 375 and 320; prefers-reduced-motion; console read after a clean, hydrated load.

Verdict: 5/10

First complaint: "Why are there six big grey boxes with one word in each? 'refuses', 'polled', 'KMS'... and the actual sentence is hiding at the bottom, then the next box slides over it before I've read it. That's empty, not premium. And before that, a whole paragraph at headline size. It's a wall of text in my face."

## The 11 answers
1. **First screen in 5 s, motion within 1 s: half yes.** Something moves straight away: the stage tucks in from full bleed to a rounded card, the connector line draws, and the vendor demo runs itself (Jumio, then Onfido, then forged callback greying out to "refused", then Plaid "polled from the provider"). That is a real idle moment. But the first screen is just "Hanzo IDV" and a demo. Nothing says what IDV is until you scroll. "View on GitHub" floats at x≈1185, lined up with nothing: not the h1 baseline, not the stage edge. On the phone the payoff (the vendor verdict card) is below the fold. The fold is mostly four mono step rows and a tab rail that wraps into a three-row blob.
2. **One in, one out, or a document: mostly a document.** The statement is scrubbed word by word from grey to ink, which is authored. But it is 11 lines at 50 px and stays on screen for two full viewports. The six sticky sheets do stack, which is the right idea. But each sheet is 545 px of empty grey: a 26 px h3 on the left, one word or figure on the right, and the body pinned to the bottom edge. The next sheet covers that body almost as soon as it appears (desktop d-s03 to d-s07; phone m-s03 cuts sheet 02 mid-sentence). The page reads as six empty cards plus a document.
3. **A real visual object in every section: no.**
   - Hero: live demo (yes).
   - Statement: type only.
   - Sheets 01 to 06: a single word ("4", "refuses", "HMAC-SHA256", "polled", "KMS", "Hanzo Risk"). That is a label, not an object.
   - "Paste and ship": a code block (fine).
   - Forge: a real working HMAC playground (the best thing on the page).
   - Close: contour Sigil (yes).

   Six of nine screens have nothing to look at.
4. **One ask, nothing floating, scale rhythm: partly.**
   - The sticky header ask switches from "Try Hanzo" to "View on GitHub" once you leave the hero. That is good, and it is Hanzo's words.
   - Nothing of the page's own floats over content. The cookie bar and the dev "Issue" badge are shared chrome.
   - Scale fails in the statement: 11 lines at h1 size, with nothing small or medium around it. That is "everything big at once".
   - The sheets fail the other way: a tiny heading, a big word and acres of nothing.
   - Close: the "Get IDV" h2 sits on its mono label with no air. On the phone the h2, the label and "Identity verification" collide into one stack.
5. **Every hover and press answers, no jumps: yes.**
   - Tabs take a grey fill on hover. Black buttons lift to graphite. Press scales on the forge pills. None of this is opacity-only, and nothing jumps.
   - Copy turns into "✓ Copied".
   - The forge buttons rewrite the body and signature. The verdict panel turns from "Accepted: …" to a greyed "Turned away: …". "Change rejected to approved" disables after use.
   - Phone taps answer the same way.
   - Weak spot: the verdict change in the forge is a quiet tone shift in a panel far from the button you pressed, at the top right of the section. The moment is easy to miss.
6. **Overlap, font swap, layout shift: overlap yes, swap and shift no.** CLS is 0.0002 on desktop and 0 on phone. No horizontal overflow at 375 or 320; the only wide thing is the prompt code line, which scrolls inside its own block. But:
   - The sticky sheets cover their own body copy on desktop and phone. Content is covered by content.
   - At 1470 the stage's first frame runs flush to the right edge, with the pause button touching the edge.
   - **Reduced motion does not show the final state.** With reduce on, the statement stays mostly grey (only the first ~6 lines are ink) and the hero stays in its full-bleed start frame.
   - The hydration diff I first saw was caused by my own pre-hydration screenshot. A clean load (networkidle, caret: 'initial') logs 0 console errors at both sizes, so it is not counted.
7. **Which reference, and is its motion there: apple.com (pinned stages) and anthropic launch (figures as heroes), both only half there.** The pinned sheets exist, but nothing changes inside a pinned panel. They just stack. The "figures" are words, not figures with count-ups or a measured moment. The forge is the one place that feels like motion.dev-grade state change.
8. **Different from its neighbours: unverified, with a risk.** The hero medium (a vendor router demo) is its own. But the scrubbed "say" statement, the numbered "0N / 06" sheet stack, the "Paste and ship" block and the Sigil close look like shared v2 sections (v2-sec, v2-dark, gi). That is a template rhythm James called out.
9. **All 18 parts covered: no.**
   - Trust and proof: none. No vendor marks, even though the page names Jumio, Onfido and Plaid in every frame.
   - Media: no real Hanzo imagery or UI capture beyond the demo.
   - Mobile composition: the hero tab rail and the close stack are broken.
   - Reduced-motion state: wrong.
   - The rest is present: header ask, close with GitHub and Deploy, copy-to-clipboard, sound toggle, dark room count (one).
10. **Banned tells:**
    - No hue, no gradient text, no Inter, no purple-blue. The lone black room is fine.
    - Browser-default control: the forge's "raw body, as it arrived" textarea shows the native resize grip (desktop and phone).
    - Three equal outlined pills in a row: "Change rejected to approved", "Forge the signature", "Empty the secret". That brushes "never 3 or more equal buttons".
    - "WHAT IT IS" is a stranded mono eyebrow under the statement and over the sheet stack. It labels nothing.
    - Dead air: ~350 px of empty white between sheet 06 and "Paste and ship", and ~250 px of empty black above "Sign one, forge one".
11. **Copy untouched: looks untouched** (statement, sheet bodies, forge strings and prompt read as Hanzo's own). Not checked against source, by instruction.

## Fixes, in order
1. **Sheets: give each one an object and let its copy be read.**
   - Move the body up under the h3 (left column), so the sticky overlap never covers it. Or hold each sheet pinned until its body has been on screen ~1 s before the next slides over.
   - Replace the lone word with a real object built from the demo's own parts:
     - 01: the four call rows lighting in sequence, with the "4" counting up.
     - 02: the verdict card flipping to "refused".
     - 03: an HMAC hex string resolving character by character.
     - 04: a poll tick.
     - 05: a KMS key path.
     - 06: a split between "verify" and "Hanzo Risk".
   - Cut each sheet to ~60% of its height, so there is no grey void.
2. **Fix reduced motion.** Under prefers-reduced-motion the statement must render fully in ink and the hero stage in its settled rounded-card state.
3. **Shrink the statement.** Rest it at the 26 px section size (or 32 px), with the word scrub kept. Let only the closing clause grow while it is the moment, then settle. One big thing per screen; right now it is a 50 px wall for two screens.
4. **Hero composition.**
   - Put "View on GitHub" on the h1 row's baseline at the right edge of the container, or under the h1. It should not float at x≈1185.
   - The opening frame must never run the stage and pause button flush to the viewport edge.
   - Phone: make the vendor tabs a single horizontally scrolling rail (no 3-row wrap), and pull the verdict card above the four step rows. The payoff must sit on the first screen.
5. **Remove dead air.** Close the ~350 px gap after sheet 06 and the ~250 px black void above the forge heading to the section padding token.
6. **Forge.**
   - Remove the textarea's native resize grip.
   - Make the verdict the moment: put it beside the buttons, or move it under them, and give "Turned away" a real state change (stroke, tick against cross, a hairline drawing). It should not be just a grey tone.
   - Make the three action pills read as one segmented control, not three equal buttons; Reset stays as the quiet text button.
7. **Remove or attach "WHAT IT IS".** Either drop it or make it the caption of the sheet stack's first figure. It must not sit alone between sections.
8. **Close.** Give "Get IDV" and its mono label proper spacing (≥17 px), and on the phone let the Sigil sit behind with less weight so the stack does not crowd.
9. **Proof.** Add a quiet row of the vendors the router fronts, in mono or monochrome marks only if Hanzo's copy names them. That gives the "calm trust" part something to stand on.
