# /stream/: James-eye review
Verdict: 7/10
First complaint: "The log tape at the top is lovely, then I scroll and get a big empty black hole and six grey boxes of paragraphs sliding sideways. It's a document on a conveyor belt, and nothing answers when I touch it."

Walked 2026-11-07 16:49 UTC on the dev server at 1470x801 and 375x812, moving.

## The 11 answers
1. **First screen, 1 s motion**
   - Yes, it moves: the partition tape scrolls on its own from the first frame. Frames 300 ms and 1000 ms after load differ.
   - The first screen sells as "a Kafka port". The h1 is 52px, but its bottom sits at 603px, which is 75% of 801 (the target is about 38%). The object sits above the h1, so you read the tape first and the name last.
   - On phone the hero GitHub ask runs from 770 to 818px, so it is cut by the 812px fold.
2. **One in, one out**
   - Mostly yes. The tape shrinks into a framed card as you leave the hero. The pinned rail scrubs six records sideways, and each outlined number (0001 to 0006) fills to ink as its card centres, while a "committed offset 0000 to 0006" counter ticks. That is the page's moment.
   - The hero section is 1201px tall. Between scrollY 500 and 700, about 400px of empty black sits under the shrunk tape. It is a dead stretch.
   - At stop 8 (the code block) and at the footer nothing moves, which is acceptable.
3. **A real object in every section**
   - The hero (live tape), the API lookup with the code block, and the closing tape with a typed agent prompt all have one.
   - The six rail cards hold only an outlined number and 45 to 60 words of copy each. The record is never drawn as a record: there are no bytes, offsets or header strip. The 4-fact strip (Kafka, PubSub, Stateless, Durable) is plain type.
4. **One ask, nothing floating, scale rhythm**
   - There is one hero ask (GitHub), and the header ask swaps from Try Hanzo to GitHub after the hero (shared chrome).
   - On a cold load the header showed a solid black GitHub while the hero's solid GitHub was in view: two solid fills in one viewport. This is shared, and it comes from the sticky-ask logic.
   - Scale is fine: one 52px h1, 26px section heads, a 12px mono caption. Nothing is too big at once.
5. **Hover and press**
   - The hero GitHub ask changes background from #f5f5f7 to #fff on hover and scales to 0.98 on press. That is good.
   - The rail cards do not change on hover: same transform, same #f5f5f5 background.
   - The five client chips over the tape (kafka-python … stream.hanzo.ai:9092) look like buttons but are plain spans with cursor:auto, and nothing happens on hover or click. The twelve API pills are plain `li` elements too, so only typing drives them.
   - The Copy button gets a hover ring. The API lookup answers as you type ("Banana is not among the twelve APIs Hanzo lists"), and that is the best tap on the page.
6. **Overlaps and layout shift**
   - In the tape, the partition labels sit over tile numbers ("1257 partition 2 1258", "129: partition 3"), and the committed-offset pill covers tile 1224. This is intentional, but it reads as collisions.
   - On phone, the hero offset pill is clipped at the right edge ("committed offse"). In the closing tape "partition 0" wraps to two lines and the pill is clipped.
   - At 375 there is no horizontal page overflow and no font swap.
7. **Reference**
   - It feels like an apple.com pinned scrub, and that motion is there. The motion.dev ticker is present.
   - The anthropic.com sense of benchmarks as hero figures is not there: the facts strip is quiet type.
8. **Neighbours**
   - The hero medium (a live partition log) and the offset-counter rail are its own. It does not read like /pubsub or /realtime.
9. **18 parts**
   - Present: Band, code with Copy, typed prompt with a pause control, and the "Beyond" lookup aid.
   - Phone has no static fallback for the rail. The rail is a horizontal snap track 2312px wide in a 375px viewport, swipe-only. The 4 facts sit at x≈1981, so most phone visitors never see cards 2 to 6 or the facts.
10. **Banned tells**
    - None found: no hue, no gradient text, no kicker above the h1. The mono "KAFKA WIRE PROTOCOL" caption sits below the h1, which is allowed.
    - The rail edges toward "an explaining sentence under every tile".
11. **Copy**
    - parity.py: text 75/75, links 2/2.
    - Console: 0 errors on 4 of 4 cold loads.

## Fixes (in order)
1. Cut the dead black after the hero. Collapse the hero section from 1201px so the rail's first card peeks within 56px once the tape has shrunk, or keep the h1 and ask on stage while the tape shrinks.
2. Give each rail record an object, drawn from words already on the card: a record-batch strip with offset, header stamp and INVALID_RECORD refusal for 0005 and 0006, and a dying-and-returning consumer marker for 0004. Add a hover state that changes more than opacity, such as the record lifting 2px or its offset filling.
3. On phone, make the rail a vertical stack of pinned panels, or add a visible "01 / 06" progress plus a peek, so cards 2 to 6 and the 4 facts are reached by scrolling, not by an undiscovered swipe.
4. Raise the hero composition so the h1 baseline sits near 38% to 45% of the viewport. On phone, get the GitHub ask fully above 812, with the tape at 45svh or less.
5. Make the hero client chips do something (select a client and the tape's consumer label changes to match), or style them as captions, not buttons. Do the same for the API pills: a click fills the input.
6. Tidy the tape collisions: give partition labels an opaque gutter so tile numbers never show under them. On phone, keep "partition 0" on one line and let the offset pill fit inside 375px.
7. Shared: the header ask is solid while the hero ask is in view. Request the sticky-ask fix in the shared chrome rather than here.
