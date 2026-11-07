# /identity — James-eye review
7 Nov, round 2, walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright Chromium: frames at 0, 1 and 3 s untouched, wheel-scrolled a screen at a time with a 1.5 s dwell, hovered and pressed every main control on desktop, tapped on phone, typed into the white-label form, plus 320px overflow and prefers-reduced-motion loads at both sizes.

Verdict: 7/10

First complaint: "The phone at the top is lovely, it signs itself in and it changes as I scroll. Then it turns back into a document: a box of tabs with a paragraph and a tick list, a numbered list on black, and every tile's sentence chopped off with dots. And who wrote 'Wear your name'? That isn't Hanzo's line."

## The 11 answers
1. **Sells in 5 s, moves in 1 s?** Yes. h1 "Hanzo Identity" (52px) on the left, a live hanzo.id sign-in on the right. By 1 s the caret is blinking in the password field, by 3 s the password is typed and the second-factor boxes are filling, and the header ask has settled. The first screen sells "the sign-in your users actually see" by showing it. The card is roughly 100px of empty white above "Sign in", which makes the phone look half-loaded.
2. **One in, one out, or a document?** The opening is right. On desktop the phone pins while the left text swaps through "What the token carries" and "One sign-in, every app", 01/03 to 03/03, and the app grid fills in to "one session". That is Apple's pinned stage. After that it reverts to a document: a six-tile bento, all visible at once; "Running it for a large organization", which is a tab bar over a white card holding a paragraph and a three-line tick list; and "Add sign-in", which is three numbered rows on black. On phone nothing pins: the card scrolls past, then the text.
3. **A real visual object in every section?** Hero, the pinned stage, the bento tiles (OTP boxes, SCIM avatars, client-id/authorize, organization > workspace > project nesting, the WebAuthn mark, write/write/write/~~edit~~ log) and the "Wear your name" live preview all have one. Three sections fail: "Running it for a large organization" (text and ticks only), "Add sign-in" (a numbered list only) and the closing "Get started with Identity" (headline, three links and a grey radial sheen).
4. **One ask in the header, nothing floating, scale rhythm?** Yes, one ask: "Try Hanzo" sits in the sticky header. The page repeats it in the hero, in the black room and in the close, always paired with a text link, never as 3 equal buttons. Nothing of the page's own floats over content (the cookie card is shared chrome). Scale mostly has rhythm: h1 52, h3 17 to 21, mono 12. But the section h2s rest at 32px, not the 26px resting size, "Add sign-in" jumps to 44 and the close to 52, so the bottom third gets louder instead of settling. Desktop has a dead middle gutter of about 350px between the copy column and the phone in the hero and in "Wear your name".
5. **Every hover and press answers, no jumps?**
   - **What answers:** text links underline and the arrow nudges 4px; buttons, tabs and chips press to scale 0.97 or translateY(1px); tabs and chips change fill and ink on hover; bento tiles tilt (about 1.5°) and darken a step; the pause button gets a fill.
   - **What doesn't:** a chip that is already on (black "passkey", "Google") does nothing on hover.
   - **The jump:** opening a tile with "+" grows it from 324 to 401px and shoves the whole bento row below it down. That is a layout jump on press, and the opened paragraph renders soft because the tile is still mid-tilt.
   - **The form:** typing a hostname and a name into "Wear your name" rewrites the preview at once (id.acme.dev, "A", "Sign in to Acme"). That is the best interaction on the page.
6. **Overlap, font swap, layout shift?**
   - No font swap: Zen and Zen Mono are loaded and the h1 box holds.
   - CLS is 0.0002, and all of it comes from the shared header's right cluster.
   - No hydration diff or console error in the normal or reduced-motion loads, and no Next issue badge on screen.
   - No horizontal page scroll at 375 or 320. At 320 the shared header ask clips ("Try Han"), which is shared chrome.
   - At 375 the enterprise tab rail is a sideways scroller cut mid-word ("Bring the identity you a") with no fade or edge cue.
   - Under reduced motion the hero shows the final state ("✓ signed in", all six factor boxes filled) and nothing is left invisible. Correct.
7. **Which reference, and is its motion there?** It feels like apple.com: product as hero, a pinned scene where one panel changes, ink on paper. That motion is really there on desktop. synchronized.studio is absent: tiles expand in place instead of opening into a page. Nothing of osply/hamol: no pointer-aware detail beyond the tilt, no asymmetric editorial scale.
8. **Different from its neighbours?** Yes. /iam leads with a horizontal OIDC flow diagram and /idv with a vendor tab rail. /identity leads with a self-typing phone sign-in and has its own signature: the white-label configurator. The bento, tabs-in-a-card and black numbered steps are the shared kit, and they make the lower half look like every other product page.
9. **All 18 parts?**
   - **Strong:** first impression, conversion path, component states, motion and reduced motion, responsive.
   - **Thin:**
     - Trust and proof: no figure, logo wall or quiet proof list, though Hanzo's copy has standards to show (OpenID Connect, SCIM 2.0, WebAuthn, GDPR).
     - Media: no Hanzo imagery at all, every visual is drawn UI. That is right for this product, but nothing has 4 or more real visuals at once.
     - Phone narrative: the pin is lost on phone.
10. **Banned tells?**
    - Copy: the one hard fail is a copy rewrite (see 11).
    - Clutter: each bento tile ends in a truncated explaining sentence. That is cut text and it reads as "a sentence under every tile".
    - Clean: no hue, no gradient text, no Inter, no eyebrow above a headline. The "WHITE-LABELLED BY HOSTNAME" mono label sits under its h2, which is allowed placement.
11. **Copy untouched?** No.
    - **"Wear your name":** an h2 that is not in identity.json or ui-strings.json.
    - **The lede under it:** Hanzo's bullet "White-labelled by hostname — your mark on your domain, never ours" has been cut in two. The front half became an eyebrow, the back half was re-capitalised into "Your mark on your domain, never ours." as a lede.
    - **Demo labels not traceable:** "Hostname", "Sign in to Example", "then a second factor", "one session", "where they act" (a shortening of "the role they hold where they asked to act") and "Continue". Scripted demo chrome is defensible, but each should come from Hanzo's words or ui-strings.
    - **What is verbatim:** the rest checks out, including hero, section heads, bento titles and bodies, the enterprise tabs and ticks, "Add sign-in", its three steps and the close.

## Fixes, in order
1. **Remove the invented headline.** Delete "Wear your name" and restore Hanzo's bullet as written. Use "White-labelled by hostname — your mark on your domain, never ours" as the section's single line, or the head as "White-labelled by hostname" with the bullet text intact, not split and re-capitalised. Source "Hostname", "Continue", "then a second factor", "one session" and "where they act" from identity.json or ui-strings.json, or replace them with Hanzo's own words ("signed in", "second factor", "they hold where they asked to act").
2. **Give "Running it for a large organization" an object.** Each tab should drive a visual that changes with it, not a paragraph and a tick list. Use region/cluster pins for "Where the data sits", an OIDC issuer URL resolving for "Bring the identity you already have", the organization > sub-organization tree for "Signing up your customers" and the SDK call for "What you write". Keep the paragraph, but secondary.
3. **Make "Add sign-in" a scene, not a list.** As each step lights on scroll, show what it produces: the registered client id, the callback URL, the SDK install line typed out. Same three Hanzo phrases, one panel changing.
4. **Stop truncating tile copy with an ellipsis.** Show the title and the drawing at rest, and open the full Hanzo sentence on click. Open it as an overlay or sheet that does not reflow the grid, or open the tile into its own state (synchronized.studio). Freeze the tilt while open so the text is crisp.
5. **Settle the type scale.** Section h2s go to the 26px resting size. "Add sign-in" and the close stay at 32 to 44 at most, and grow only while they are the moment. Close the dead gutter between copy and phone at 1470: shift the phone onto the 8/5 split, or let the copy column own the left 5.
6. **Phone narrative.** Give the 375 hero stage a short pin, or a swipe rail with a progress tick, so "token" and "one session" swap in one place instead of scrolling past as a card then a paragraph. Give the enterprise tab rail an edge fade and scroll-snap so the clipped label reads as more, not as cut.
7. **Close the hero card's empty top.** Vertically centre "Sign in" plus the factor row in the phone, or start the "hanzo.id" header lower, so the card does not read as half-loaded at 0 s.
8. **Small answers.** Selected chips need a hover state (a ring or a step lighter), the closing section needs one object (the configured sign-in card from "Wear your name", small, carrying the name the visitor typed), and add one quiet proof row from Hanzo's copy (OpenID Connect · SCIM 2.0 · WebAuthn · GDPR) in mono.
