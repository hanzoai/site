# /idv — James-eye review
7 Nov, round 2, walked at 1470x801 and 375x812 (isMobile, hasTouch) with Playwright: frames at 0/1/3 s untouched, wheel a screen at a time with 1.5 s dwell, hover and press (desktop) or tap (phone) on all 16 main controls, overflow at 375 and 320, a prefers-reduced-motion load.

Verdict: 6/10

First complaint: "The first screen is a name and a set of grey boxes. I don't know what IDV is until I scroll, and then I get a wall of giant text. And who wrote 'Sign one, forge one'? That isn't Hanzo's copy."

## The 11 answers
1. **Sells in 5 s? Moves in 1 s?** Motion yes: the h1 cuts in by 0 s, and the vendor demo cycles by itself (Jumio, then Onfido, with a pause button). It does not sell. The first screen is "Hanzo IDV", a GitHub button and a demo whose tabs read "forged callback" and "the rest". Without the lede those labels mean nothing. The one sentence that explains the product sits a full screen down.
2. **One in, one out?** Mostly. The six stacked sticky sheets (01/06 to 06/06) slide over each other, so it reads as one thing at a time. Two things go wrong. The lede is a scrubbed grey-to-ink paragraph of about 90 words at roughly 26px on desktop (about 34px on phone, 18 lines), a document moment shouted large. After sheet 06 there is about 250px of dead white before "Paste and ship".
3. **A real visual in every section?** Yes, and that is the page's strength. There is a four-call list with a "4" figure, the approved→refuses strike, a live HMAC hex, Plaid's polling dots, a KMS tree, IDV vs Risk columns, a code block, the black forge demo, and a sigil line field on the closing. They are all type-and-box diagrams, though. Nothing on the page is image or film, so "many real visuals at once" is not met.
4. **One ask, nothing floating? Scale rhythm?** The header ask swaps to "View on GitHub" on desktop scroll, which is good. On phone it stays "Try Hanzo", so the page's own ask is missing from the phone header. Nothing of the page's own floats over content (the cookie card is shared chrome). Scale is mostly right on desktop: h1 52, sheet heads 26, the closing 44. The phone lede breaks it, because one paragraph fills the whole screen at headline size.
5. **Hover and press answer?** Press scales to about 0.97 everywhere, with no layout jump. Hover is mostly a grey tint, rgba(128,128,128,.14), so it does not tell you anything. The Copy hover only adds a box-shadow ring. The forge buttons do answer properly: the body flips to "approved", the signature strikes and the verdict reads "Turned away". On the phone, after a tap, two of the three forge buttons stay at opacity 0.5 and grey text. That is a disabled look with no explanation.
6. **Overlap, font swap, shift?** No console errors or hydration diffs on either size or on the reduced-motion load. The phone demo's tab rail is broken. The black active pill sits offset from its label ("Ju" is visible, with the pill over the gap toward "Onfido"), and "Plaid" and "the rest" are clipped off the rail with no visible scroll cue. At 375 and 320 the rail's buttons run to x=456 and the agent-prompt code to x=689. They sit inside scrollers, so the page itself does not scroll sideways, but the rail and code are cut. At 320 the header ask clips (shared chrome).
7. **Which reference?** apple.com's "pinned panels, one idea per screen" comes through in the stacked sheets, and the forge demo is a good interactive moment. There is no synchronized.studio card-open, no marquee or count-up, and no pointer-aware detail beyond the shared header. The motion is half scroll (lede scrub, sheet stack) and half idle (demo cycle). That passes, but only just.
8. **Different from neighbours?** I could not confirm this from the walk. The numbered "01 / 06" sticky-sheet stack plus a closing sigil field looks like a shared product template, and the black forge room is the only move that belongs to this page.
9. **18 parts covered?** Partly. There is no proof or trust (part 5) beyond the GitHub chip and licence. There is no media (part 10). Parts 2, 3 and 4 are thin: the hero has no lede and the ask is GitHub only. Reduced motion shows the final state correctly (part 12 ok on that point).
10. **Banned tells?** There is no hue. The colours seen are greys, but several are off-token Apple greys: #e8e8ed, #a1a1a6, #d2d2d7, #f5f5f7, #0a0a0b and #2c2c2e on hover. None of them is in MASTER 3.1. Grey eyebrows sit under headings, which is allowed, but "A WEBHOOK HAS TO PROVE IT IS ONE" under "Sign one, forge one" works as a second headline. The font stack leads with "Noto Kufi Arabic" (shared?). The phone lede is a case of everything big at once.
11. **Copy untouched?** No. Invented visible copy that traces to neither content/live/idv.json nor ui-strings:
    - the h2 "Sign one, forge one"
    - "THE PROVIDER SENDS", "YOU RECEIVE", "signing secret", "raw body", "raw body, as it arrived", "signature header", "signature header, as it arrived", "example-signing-secret"
    - "Change rejected to approved", "Forge the signature", "Empty the secret", "Reset"
    - "Accepted: the signature is HMAC-SHA256 over this raw body.", "Turned away: a forged one…"
    - the tab "forged callback", "WEBHOOK", "polled from the provider" (a paraphrase), "approved" struck
    - the "HANZO IDV / HANZO RISK" column heads

    That is a whole invented section.

## Fixes, in order
1. Remove or re-word the forge room so that every visible word is Hanzo's. Make the heading Hanzo's own "A webhook has to prove it is one". Take the state labels and verdict lines from the sheet copy ("An empty signing secret is a refusal, never a skip"), or drop the sentences and show the state by shape (tick or cross). Delete "Sign one, forge one", "Turned away…", "Accepted: …" and the invented field labels.
2. Put the lede in the hero. The first screen should carry Hanzo IDV, its first sentence ("one interface in front of the identity-verification vendors…") and the demo. Keep the scrubbed reveal only for the remainder, at lede size (20–21px), not headline size. On phone, cap it at 17–21px.
3. Fix the phone tab rail. The active pill must track its label. Show all five tabs (wrap to two rows, or a visible fade and scroll cue), and scroll the active tab into view as the demo cycles.
4. Put the page's ask ("View on GitHub") in the phone header as on desktop, or say why the phone keeps "Try Hanzo".
5. Make hovers say something. A tab hover should preview that vendor's verdict line, and Copy should show what will be copied. Swap the 50%-opacity disabled forge buttons for a clear state (struck label plus Reset).
6. Swap the Apple greys (#e8e8ed, #a1a1a6, #d2d2d7, #f5f5f7, #0a0a0b, #2c2c2e) for MASTER 3.1 tokens (#e5e5e5, #a3a3a3, #d4d4d4, #f5f5f5, #0a0a0a, #262626).
7. Close the dead white gap (about 250px) between sheet 06 and "Paste and ship". Let the last sheet release straight into the next section.
8. Give the page one signature move that no neighbour has. The forge room is the candidate: make it the pinned moment, so the body flips and the signature visibly fails as you scroll in, with no tap needed. Also add one pointer-aware detail.
9. Wrap the agent-prompt code on phone instead of side-scrolling it off-screen at x=689.
