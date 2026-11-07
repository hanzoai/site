# /iam — James-eye review
7 Nov, round 2, walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0, 1 and 3 s, wheel scroll a screen at a time with 1.5 s dwell, hover and press on desktop, tap on phone, overflow at 375 and 320, prefers-reduced-motion pass, and /authz and /kms opened for comparison.

Verdict: 6/10

First complaint: "Hang on, I've just seen this on KMS. Three little version boxes with one outlined as live, then a black room where you have a go yourself. Same trick, different words. And then it's eight grey cards that are just a word each, and they go on for four screens. Where's the thing that makes IAM feel like IAM?"

## The 11 answers
1. **First screen sells, and it moves within 1 s: yes.** The hero card runs its own story without input: rt1 goes live, then spent, then rt2 and rt3, with the authorize → PKCE · S256 → code → token strip above. "Hanzo IAM" at 52px with one solid ask. It reads in 5 seconds. Weak spot on phone: the arrows in the flow strip drop out and "token" sits alone on its own line, and the caption breaks as "kept as / a hash".
2. **One in, one out: partly.** The `hanzo.id` rail is a pinned horizontal scrub. One card comes forward, grows and shows its description while the others shrink and go grey. That is the right idea, but it runs 3,621px (about 4.5 desktop screens) of eight cards that look the same. At the end the cards sit on the left with the right half of the stage empty, and when the pin releases there is about 230px of dead white before "Paste and ship". On phone the rail is not pinned. It is a sideways swipe with a 30px peek, so 7 of the 8 cards and their descriptions never show up in a vertical scroll.
3. **A real object in every section: mostly.** Hero: the token demo. Steal: a live interactive panel. Paste and ship: a code block. Get IAM: the Sigil contour SVG. The rail is the weak one. Each card holds one word set as a figure (argon2id, passkey, SCIM 2.0, tenancy boundary, Authz) on a flat #f5f5f5 tile, with no drawing, UI or diagram. Eight text tiles in a row reads as a slide deck. On phone the Get IAM Sigil renders as faceted polygons, not smooth contours.
4. **One ask, nothing floating, scale rhythm: mostly.** On desktop the header ask becomes "API reference" once the hero leaves, and it turns to outline while the in-page solid is on screen. Good. The page adds nothing floating. The cookie card and the phone header keeping "Try Hanzo" are shared chrome. Scale inside the rail has real rhythm (big figure, 21px title, small body, focus grows). Section heading sizes drift instead: hanzo.id and Paste and ship are 26px, Try to steal one is 32px, Get IAM is 44px. That reads as inconsistency, not rhythm.
5. **Every hover and press answers, with no jumps: no.**
   - Press is a 0.97 scale on every button. Good.
   - The related rows fill #f5f5f5 and underline on hover. Good.
   - "Source →" and the "hanzoai/iam · 3 stars" pill show no measurable change on hover.
   - The API reference hover goes to rgb(44,44,46) and the Copy label is rgb(210,210,215). Neither is a token.
   - The steal demo jumps. Each step adds a token row to the panel. On desktop the section grows by 27px and pushes the page down. On phone the buttons sit under the panel and move down about 74px on every tap ("Refresh as you" went from y 447 to y 521), so the next tap lands on empty space.
6. **Overlap, font swap or layout shift: some.** The h1 box does not move between 0 and 3 s, and there is no font swap. There was no hydration badge and the console had zero errors. There is no horizontal overflow at 375. At 320 the body is 352px wide, but that comes from the header's ask clipping ("Try Han…"), which is shared chrome. The page's own shift is the steal demo growing, described in 5.
7. **Reference: apple.com, partly.** The pinned horizontal scrub with a focus card is apple.com's product-page move, and the idle hero demo is close to an anthropic launch figure. synchronized.studio's card-open is absent: the rail cards and the related rows only link out. The black room is a hard full-width rectangle. It does not enter as a rounded card and open to full width.
8. **Different from its neighbours: no.** /kms opens with the same object grammar: a stack of v3/v2/v1 versions with the live one outlined, then a "Seal one yourself" try-it room. /iam opens with rt1/rt2/rt3 boxes with the live one outlined, then a "Try to steal one" try-it room. Both name argon2id. /authz has its own hero (a caller → location → can diagram), so the clash is with KMS. Hero medium and signature need to split.
9. **18 parts: partly evident from the walk.**
   - Seen: sticky ask (2, 4); h1 with lede and hero object (3); figures with descriptions (5, 6); tokens with no hue (7); kit buttons, code block and copy confirmation (8, 16); idle, scroll and state motion (9); phone layout with no overflow at 375 (11); reduced-motion final state (12, 17); console clean (13); license, repo and docs links (15, 16).
   - Not provable from a walk: SEO and machine files (14), measurement (18).
   - Gaps: no hover preview on the rail or the related rows (part 9 "hover tells you something"); the phone rail hides 7 of 8 chapters (11).
10. **Banned tells: one borderline, otherwise clean.**
    - The hue scan found nothing over 20 points of chroma. No gradient text, no Inter, no eyebrow above an h1 or h2 ("REFRESH TOKENS" sits under its h2, which is allowed).
    - Borderline: "Related capabilities" is three equal columns in a row (Authz, KMS, Secrets). They are hairline rows, not boxes, but James will read them as three-in-a-row.
    - Reduced motion: the rail still slides sideways on scroll.
11. **Copy untouched: not verified.** The demo lines ("Try to steal one", "Copy it as the thief", "You hold rt1. Copy it as the thief.", "The thief presented spent rt1: …") and "Paste and ship" read as written for the page. If they do not trace to `content/pages`, they are a rewrite and fail. The owning chat must show the source line for each.

## Fixes, in order
1. **Split from /kms.** Give the IAM hero a different medium from KMS's version stack. The authorize → PKCE → code → token flow could be the moving object (a sign-in handshake drawn as a line that travels and lands a token), with the rt chain demoted to a small caption. Or keep the rt chain and change KMS's. Either way, the two pages must not share a "numbered boxes, one outlined live" hero plus a "try it yourself" black room. The second black room needs its own signature.
2. **Shorten and fill the rail.** Cut the pin from about 4.5 screens to 2 or 2.5. End it with the last card centred in focus, not a half-empty stage. Remove the roughly 230px blank band after unpinning. Give each card a small real object next to its figure (the S256 challenge pair, a hash prefix, the JWKS key row, a SCIM user row) so the cards stop being text-only tiles.
3. **Phone rail.** Make it a short pinned scrub, or stack the eight cards one per screen with their descriptions visible. Hiding 7 of 8 chapters behind a sideways swipe with a 30px peek fails "one in, one out" on the phone.
4. **Stop the steal demo jumping.**
   - Reserve the panel height for two rows and the result line from the start, so the section never grows.
   - On phone, put the three buttons above the panel, or fix their position, so a finger tapping step to step hits the next button.
5. **Hover answers everywhere.**
   - "Source →": the arrow moves 4px and the underline draws.
   - Repo pill: the star count rolls or the border inks.
   - Rail cards on fine pointer: show the description or tilt to 2.5°.
   - Related rows: show a preview line from the target page.
   - Replace the rgb(44,44,46) hover and the rgb(210,210,215) Copy label with ramp tokens (#262626, white 78%).
6. **Heading rhythm.** Bring Try to steal one (32px) and Get IAM (44px) to the 26px section rest, or let one of them grow only while it is the moment and then settle back. Do not leave three different resting sizes.
7. **Phone hero card.** Keep the flow strip on one line (shrink the gap and the mono size, or let it scroll), so "token" is not orphaned and the arrows stay. Stop "kept as / a hash" from breaking mid-phrase.
8. **Related capabilities.** Break the three equal columns. Use a 5/8 split with one row featured, or a stacked list with hover previews.
9. **Black room entry.** Enter "Try to steal one" as a rounded card inside the gutters that opens to full width as it is reached (MASTER 3.1, rooms).
10. **Reduced motion.**
    - Do not translate the rail on scroll. Show the cards stacked or in a static grid.
    - In the hero's final state, keep the rt1, rt2 and rt3 names on the revoked tiles so they read as a story, not an error.
11. **Get IAM Sigil on phone.** Render it with enough points (or as the desktop path scaled down) so the contours are smooth, not faceted.
12. **Copy proof.** List the `content/pages` source line for every demo string. Remove any that are not Hanzo's.

Shared, not counted: the header ask clips at 320 ("Try Han…", body 352px wide); the phone header keeps "Try Hanzo" instead of the page's ask; the cookie card covers the bottom of the steal demo on phone.
