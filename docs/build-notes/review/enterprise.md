# /enterprise — James-eye review

Ready: 8 Nov, held up next to /api and /agents (no score). Workspace writing its audit log on stage in the first screen inside the four walls (wall names now clear of the corners), quiet hairline ledger under the one 64px figure, security panel lights each row, walls glyph in place of icon boxes, header ask swaps to "Get Enterprise plan" with nothing floating on desktop, 44px phone links and pressable rows, hero in the server HTML. taste/unique/parity OK (text 179/179, links 23/23); 0 console errors from the page (the one shared footer hydration warning shows on /agents too), no overflow/overlap at 1470x801 and 375x812. 8 Nov copy rule: copycheck missing 0 of 125 (titles keep Hanzo's full stops, customer and place lines read in full); Hanzo's customer and cloud logos shown in ink.

Verdict: 6/10
First complaint: "Why is there a pill floating over the page at the bottom? And the results are just a wall of giant numbers in boxes."

Walked 7 Nov, page file at `d42aa1a` (`components/pages/Enterprise.jsx`, `Enterprise.css`, `app/enterprise/page.jsx`), on the preview of origin/main refreshed 14:43, judged by JAMES.md and MASTER.md (§2, §3, §4.2). Filmed moving at 1470×801 and 375×812, then a hover-and-press probe of 14 controls down the page, a reload test, reduced motion and JS off. Stills: `review/enterprise/desktop-walk.jpg`, `review/enterprise/phone-walk.jpg`.

## What works
- **The signature is real.** Hanzo's workspace, open on an audit log that writes its own rows, settles inside four walls as you scroll. One wall per chapter (Hanzo Cloud, your cloud, your servers, air-gapped), with the words for each place coming in as the last go out. That is the Apple sticky chapter, and it carries the brief's thesis: "it runs where you need it".
- **The hero fits 1470×801:** h1, lede, one solid ask, an outlined second option, and the trust row ("Unlimited members · 24/7 engineering support · Runs fully offline", "How Hanzo is secured", "Trust center").
- **The prefill instrument works by hand:** pick a prompt size and the figures roll. The GPU detail rises as a sheet with a close button on phone.
- **One dark room, the closing Band** ("Tell us what you want to build." with one "Talk to sales" and the email).
- **Clean checks:** parity 179/179 text and 23/23 links; taste.py OK; layout shift 0.0004; reduced motion leaves 0 running animations.

## The 11 answers
1. **Sells in 5 s, moves within 1 s?** The words sell. But the first screen at 1470×801 is all type: the workspace shows only its title bar at the fold, so the hero object is not on stage. The h1 cuts in, and that's the only movement. On phone nothing changed in the first second and no product is in the first screen. The server HTML also ships the h1 lines pushed out of their masks and the lede at opacity 0, so on a slow load the hero sits blank for 1.5–3 s.
2. **One in, one out?** Yes for the four-walls chapter. After it the page turns into a document: a security list, a bento, a results grid, the GPU block, partners, FAQ and a form. It is 13,100px on desktop and 15,500px on phone.
3. **A real object in every section?** No. "Ready for your security review." is a numbered text list with nothing to look at. "What Enterprise includes" puts four icons in rounded boxes. The cloud wall is names in type, because the logos 500 here; they are not in `public/`.
4. **One ask, sticky?** The header carries the site's "Try Hanzo", not "Get Enterprise plan". After the hero the page's ask lives in the site's floating pill at the bottom of the screen ("Enterprise AI · search · Get Enterprise plan"). On desktop that is now a fail: it floats over the results tiles and body text (it sits on the "$7M+" tile in the walk). On phone the bottom bar covers the four-place tabs on screen 2.
5. **Every hover and press answers?**
   - Buttons, place tabs and prompt sizes hover and press at .98.
   - The six result tiles answer hover but have no press state.
   - The "01 Hanzo Cloud" tab gives no hover response.
6. **Overlaps, font swap, shift?** No shift, no swap. The floating pill overlaps content on desktop. The dev "1 Issue" badge shows the whole time: a hydration-mismatch error, red on every screen.
7. **Reference?** chatgpt.com/business/enterprise's calm shows in the hero and the trust row. apple.com's pinned chapter is there. The calm breaks at "Results on the record": seven large figures in a 3×2 grid of equal boxes is the opposite of "proof listed quietly".
8. **Different from neighbours?** Yes. The workspace-in-walls hero is its own.
9. **18 parts:** see the card check below.
10. **Banned tells?**
    - **Everything big at once:** "16 of 16", "$8.4M", "$7M+", "169M", "$2.5M", "$650M", "250,000", then "0.8 s", "2,658", "9,216 GB", "5,760 GB", "24/7", "$999 a month" and "From $4,999 a month", nearly all at hero size with little small around them.
    - **Three equal boxes in a row** (the results grid).
    - **Icons in rounded boxes** (the four places in "What Enterprise includes").
    - **A floating pill over content.**
11. **Copy untouched?** Yes (parity clean).

## Card check (`docs/build-notes/coverage/enterprise.md`)
- The card uses the old PLAN area headings rather than MASTER's `Done here:` lines. All 18 are present.
- **Part 11 is false:** it claims 44px targets. At 375 "How Hanzo is secured", "Trust center", "All customer stories", "Zen 6 on three machines", "Zen 6 Max" and "Talk to sales" are 21px tall with no larger hit area. That alone caps the page at 7.
- **Part 4** claims the ask bar carries "Get Enterprise plan". True, but that bar is the floating desktop pill the new rules fail.
- **Part 3** says the workspace "peeks below" at 1470×801. True, and that is the problem: the hero object isn't in the first screen.

## Missing from the 18 parts
- **Part 3:** hero object in the first screen at both sizes; h1 and lede visible before JS (no translated-out lines or opacity 0 in server HTML); no 3 loud sections in a row (security, includes, results).
- **Part 4:** the ask in the sticky header, not a floating pill.
- **Part 5:** results listed quietly; partner logos vendored, not hot-linked.
- **Part 7:** no icon in a rounded box; no 3 equal boxes.
- **Part 8:** press state on the result tiles; 44px targets on phone.
- **Done gate 3:** the red error badge.

## Fixes (in order)
1. **Move the ask into the header.** Drop `thumb` from the hero ask so the site's floating pill doesn't appear on desktop. Ask the shared-system chat for the header's quiet ask to read "Get Enterprise plan" on this page. On phone, keep the bottom bar clear of the place tabs (pad the section above it).
2. **Quiet the results.** "16 of 16" stays the one big figure (64px). The six commerce results become a hairline-divided list or ledger of rows: figure at 26–32px, label and company small, no boxes. Shrink "0.8 s / 2,658", "9,216 GB / 5,760 GB", "24/7" and "$999 a month" to resting size, so each grows only when it's the moment (for example the instrument figure when you pick a size).
3. **Put the workspace on stage in the first screen.** Shorten the h1 block or raise the workspace so at least 200px of the live audit log (rows writing) sits above the fold at 1470×801. On phone, show 80px+ of it under the ask.
4. **Give the security list and the includes an object, and lose the icon boxes.** Pin the four security items beside the audit-log workspace, so each item lights the row it describes (single sign-on → an SSO row, audit log → a new row writing). Draw the four places as the same wall glyph the hero uses, not icons in boxes.
5. **Ship the hero visible.** The h1 lines and lede should be in place in the server HTML, with the line-mask playing from a class added on hydration. Fix the hydration mismatch so the red badge goes. It also shows on /careers, so it may be site-wide; if so, request the fix from the shared-system chat.
6. **Fix the tap targets.** Give every text link a 44px hit area on coarse pointers (an `::after` inset), and a press state on the result rows.
