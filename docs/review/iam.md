# /iam — James-eye review
Walked 7 Nov at 1470x801 and 375x812 (isMobile, hasTouch), Playwright, moving: frames at 0, 1 and 3 s untouched, wheel scroll a screen at a time with 1.5 s dwell, hover and press on every main control, the steal demo played through, reduced motion, 320px overflow check, and the /authz and /kms first screens for comparison.

Verdict: 6/10

First complaint: "Why is the first thing I see an empty grey box? I scroll down to find out what the page even is. The name is at the bottom of the screen, and the box just sits there blank for two or three seconds before anything shows up."

## The 11 answers
1. **Sells in 5 s, moves in 1 s:** only partly. Inside the first second the only motion is the hero card shrinking from full width into a rounded card. The rt1 token does not arrive until about 2.5 to 3 s, so the stage sits empty and grey. At 1470x801 the h1 "Hanzo IAM" sits at y 665 (83% of the height, against the 38% target), under a 430px card. On the phone at 0 s, no h1 is visible at all.
2. **One in, one out:** mixed. The pinned horizontal rail (8 cards) and the steal room each feel like a scene. The rest reads as a document: about 200px of dead black under the steal room, then "Get IAM", then the footer. On the phone the rail is a plain swipe, and the page runs card, rail, code, steal, band.
3. **A real object in every section:** the hero token demo, the steal demo and the closing Sigil contour are all real. The 8 rail cards are only words in grey boxes. The "Paste and ship" block is a code bar with nothing alive. The Related row is text only.
4. **One ask, nothing floating, scale rhythm:** the header ask swaps to "API reference" on desktop (good) but stays "Try Hanzo" on the phone. Nothing floats from the page itself. Scale fails in the rail: three or four equal cards on screen, each with a big word at about 44px and an explaining paragraph underneath. Nothing grows or shrinks as you scroll through them.
5. **Every hover and press answers:**
   - API reference and Discovery document answer: fill or border changes, press scales 0.98.
   - The Source link does nothing on hover.
   - The rail cards do nothing on hover.
   - The Related links (Authz, KMS, Secrets) give no visible change on hover.
   - Copy works: it shows "Copied" and the clipboard holds exactly the displayed text.
   - The steal buttons work, and disabled states show.
6. **Overlap, font swap or layout shift:**
   - At 0 s on desktop the hero card is full width with "hanzo.id" cut at the left edge and the pause button cut at the right.
   - Under reduced motion the hero stays like that: full width, clipped on both sides, the "revoked" caption running off the right edge.
   - At 320px the header's "Try Hanzo" is cut off (shared chrome).
   - The first-load hydration-mismatch "1 Issue" badge did not repeat on 3 clean reloads, so I put it down to the cold compile or the shared server.
7. **Reference:** it aims at apple.com, with a pinned rail where one panel changes and a product-as-hero demo. The pinned scrub is there. There is no pointer motion anywhere (no tilt, no magnetic ask, no hover preview), so the osply and hamol pointer-aware detail is missing.
8. **Different from neighbours:** the layout differs (object above the h1, where /authz and /kms put the h1 first). The hero idea, though, is a stack of versioned tokens with a "live" or "current" state, which is the same visual idea as the KMS v3/v2/v1 stack beside it.
9. **18 parts:** not verifiable from the render alone. What shows:
   - Breadcrumb: none.
   - Proof strip: the closing band has license and stars chips, which are thin proof.
   - Morph: none.
   - Objection strip: none visible.
10. **Banned tells:**
    - The rail is a row of 3+ equal boxes, each with an explaining sentence under the tile.
    - The steal room shows 3 equal pill buttons in a row, two of them solid white at once after the first step.
    - The "REFRESH TOKENS" eyebrow sits directly under "Try to steal one". That is allowed (below, not above), but it reads as a kicker.
    - No hue, no gradient text, no Inter.
11. **Copy untouched:** parity reports 41/41 text and 7/7 links.

## Fixes, in order
1. **Hero read order.** Put the h1, lede and "API reference" first. Put the h1 baseline near 38% of 100svh, with the token stage below it, peeking 56px into the first screen (or right of the h1 in the 8/5 split). Today the h1 sits at y 665 under a 430px empty card. On the phone the h1, lede and primary must be visible at 0 s, with no opacity 0 on the h1.
2. **Hero stage never empty.** Render rt1 "live" in the server HTML at frame 0, and have the demo's first state change (rt1 to spent, rt2 to live) land by 1.0 s. Cut the 2.5 s of blank grey. Shrink the card height to fit its content (it is about 430px for one 120px-tall row of tokens).
3. **Reduced-motion final state.** Under reduced motion the card stays full width and clipped on both sides, with "revoked" overflowing at the right. Resolve it to the rounded, inset card, and show one coherent final frame: rt1 spent, rt2 spent, rt3 live, or the revoked family fitting inside the card.
4. **Arrival clipping.** At 0 s the full-width card cuts "hanzo.id" and the pause button. Animate the inset with clip-path or scale from inside the gutters, so content is never cut at the viewport edge.
5. **The rail.** Eight equal grey cards, each with a 44px word and a paragraph, is "everything big at once" plus 3 equal boxes:
   - Give it scale rhythm: the card at the rail's centre grows (word to 64px, card 1.0), and its neighbours sit at 0.92 with the word at 26px and the paragraph hidden until focus or hover.
   - Or put a small real glyph per card (an S256 hash line, an argon2id digest string, a JWKS key id) so each holds an object, not just a word.
   - Add a hover state to the cards: lift the fill to #ededed, or reveal the paragraph.
   - The first card's left edge is clipped at the start of the pin, so start it inside the 24px gutter.
6. **The steal room's buttons.** Never show two solid white pills at once. Make the next legal step the only solid, the others quiet outline, and the spent step text-only (not a third pill). "Start again" becomes a small text link with a 44px hit area.
7. **Dead black band.** Remove the roughly 200px of empty black below the steal demo before the white "Get IAM" band (desktop s08). End the black room on the demo's bottom edge plus section padding.
8. **Dead hovers.**
   - "Source →": nudge the arrow 4px on hover.
   - Related Authz, KMS and Secrets rows: a row hover fill, with the hairline darkening to ink and the arrow moving 4px.
   - All within ease-out 150 ms, inside `@media (hover:hover)`.
9. **Add one pointer motion.** The page has idle, state and scroll motion but nothing for the pointer. Give the hero token cards a 2.5° tilt or a cursor-aware sheen, on fine pointers only.
10. **Distinguish it from /kms.** The token stack mirrors the KMS version stack. Lean the hero into what is IAM's alone, the authorize to PKCE S256 to code to token flow: let the three header steps light in sequence as the token is minted. Don't stack rows like KMS.
11. **Phone.**
    - The agent-prompt code bar cuts mid-word ("use H"). Wrap it at 375, or show a fade plus a scroll hint.
    - The closing Sigil contours run behind "Identity + access (hanzo.id)" and the chips. Move them below the text, or mask them under it.
    - On the phone the steal demo's token panel sits below the buttons, under the cookie card. Put the panel above the buttons so a tap answers in view.
12. **Shared chrome (request, not this page):** at 320px the header "Try Hanzo" is cut off. The phone header ask stays "Try Hanzo" while desktop swaps to "API reference".
