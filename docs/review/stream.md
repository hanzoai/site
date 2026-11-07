# /stream/: James-eye review
Verdict: 7/10
First complaint: "On the computer the tape and the sliding records are nice. On my phone it's six grey boxes of paragraphs stacked one under the other and nothing moves for five screens. It's a document again."

Walked 2026-11-07 (run 2) on the dev server at 1470x801 and 375x812, moving. Judging frames taken 1.6 s at rest after each scroll.

## The 11 answers
1. **First screen, 1 s motion**
   - It moves: by 800 ms the partition tape is running, and frames 700 ms apart differ at rest. Every 10 s or so the consumer label goes "consumer down · offset kept" and then resumes. That is a good idle moment.
   - In dev, the hero is solid black for about 500 ms: the h1 is in the HTML at opacity 1, but nothing paints until hydration.
   - The h1 is 52px, but its box spans 543 to 603 of 801, so it sits at 75% (the target is about 38%). You read the tape first and the name last.
   - On phone the h1 is at 624 to 670 of 812, and the GitHub ask is cut by the fold, roughly 770 to 818. At 375x667 the ask is fully below the fold.
2. **One in, one out**
   - Desktop: yes. The tape narrows into a card as you leave. The pinned rail (section 3845px) slides six records sideways, each outlined number fills to ink as it centres, and "committed offset 0001 to 0006" ticks. Then the 4 facts land beside card 0006.
   - Desktop dead stretch: at scrollY 433 there are about 410px of empty black under the shrunk tape. The hero is still 945px tall, and at y=0 the next section does not peek.
   - Phone: the rail is now a vertical stack, but 11 straight rest stops (y 487 to 5357) show no motion. The numbers stay outlined and nothing commits. Six cards of 45 to 60 words each run for about 3,000px.
3. **A real object in every section**
   - Hero tape, the rail (each card now ends in an offset strip with its committed cell inked), the API checker beside producer.py, and the closing tape with a typed agent prompt.
   - The 4-fact strip is plain type, but it sits as the rail's end state, which is acceptable.
4. **One ask, nothing floating, scale rhythm**
   - There is one hero ask (GitHub), and nothing floats over content.
   - Shared: the header ask swaps from Try Hanzo to GitHub, and its timing is shared header-ask behaviour. On phone, "Try Hanzo" stays solid in the header.
   - Scale is calm: h1 52 (40 on phone), section heads 26, one 32px band head, 12px mono captions. Nothing is too big, but no figure grows into a moment either.
5. **Hover and press**
   - Hero and band GitHub: background goes from #f5f5f7 to #fff, and press scales to 0.98. Pause: the fill and border lift, and press scales to 0.97. Copy: a ring, and press scales to 0.92. Repo pill: the border goes to #f5f5f5. Rail card: lifts 4px. Deploy to Cloud: no hover change, press is translateY(1px).
   - The client names above the tape (kafka-python, sarama, confluent-kafka, franz-go) are `span`s with cursor:auto and do nothing. The twelve API pills are `li`s, and clicking Heartbeat leaves the input unchanged. They look like controls but do not answer.
   - The checker answers typing well: "DeleteTopics is not among the twelve APIs Hanzo lists."
6. **Overlaps and layout shift**
   - Desktop tape: the partition labels sit over tile numbers ("1257 partition 2 1258"), and the offset pill hides one or two tiles. It is intended, but it reads as collisions.
   - Phone hero: the pill is truncated to "my-service · consumer down …". In the phone closing tape it is clipped at the right edge ("committed o").
   - No horizontal overflow at 375, and no font swap seen.
7. **Reference**: an apple.com pinned scrub, and that motion is genuinely there on desktop. The motion.dev ticker is present. It does not reach the anthropic launch's hero-figure proof.
8. **Neighbours**: it is its own: a live partition log as the hero medium, plus a committed-offset rail.
9. **18 parts**: Band, CodeBlock with Copy, terminal prompt with a pause control, the "Beyond" checker, and phone stacking are all present. I did not audit the coverage card.
10. **Banned tells**: none found. There is no hue, and "KAFKA WIRE PROTOCOL" sits below the h1. The rail on phone leans toward "a paragraph in every tile".
11. **Copy**
    - parity.py: text 75/75, links 2/2.
    - Console: 0 errors on 4 of 4 cold loads. The "1 Issue" badge during the walk came from another page's compile (Startups.jsx parse error), not this one.

## Fixes (in order)
1. Make the phone rail alive. As each stacked card crosses 50% of the viewport, ink its number and its offset cell, and tick a small sticky "committed offset 000N" caption (the desktop logic on a vertical axis). Phone should not run 5,000px with nothing moving.
2. Remove the desktop dead black. Shorten the hero, or start the rail as the tape finishes shrinking, so there is never more than about 120px of empty room. Let the rail's first card peek about 56px at y=0.
3. Raise the hero. Put the h1 baseline near 40 to 45% of the viewport. On phone, get the GitHub ask fully above 667, and keep the tape at 45svh or less.
4. Make the look-alike controls answer: clicking an API pill fills the checker, and choosing a client name swaps the code block's import or the tape label. Otherwise restyle them as captions.
5. Fit the phone pill inside 375px (shorter visible state, no ellipsis or clipping), and give the partition labels an opaque gutter so tile numbers never peek under them.
6. Polish: give Deploy to Cloud a hover detail (the arrow moves 3px).
7. Shared: header ask timing, and the always-solid phone "Try Hanzo". Request these in the shared chrome rather than here.
