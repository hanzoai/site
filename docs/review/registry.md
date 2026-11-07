# /registry: James-eye review

Verdict: 7/10
First complaint: "It's the O11y page with the picture on the other side: the same white window, a little number over a heading, a row of dashes, a black room, a paste box, cards, Get Registry. The top is a wall of text next to a window whose white half just melts into the page. I'm told 'short-lived token, not a password in a dockerconfigjson secret' four times. Quickstart doesn't react when I touch it. And once I'm past the top there's no button to get it."

Reviewed: branch `claude/elegant-johnson-b2vx1q` @ `9898ac2`. The page files are as committed in `fc0c285` + `c9784eb`; the Cloud 3 kit is at `3f456ca` (MASTER.md pass: h1 52, deck greys). Files hash: `d2193e9a520d`. While I walked, `PinnedChapters` had an uncommitted edit that moves the "01" kicker below each chapter title; it is committed as of `0d2a243`. My frames show the kicker above.
Walked 7 Nov 15:00–15:15 UTC on the dev server, moving, at 1470×801, 375×812 and 390×664. I recorded videos, frame sheets, per-stop audits, hover/press and tap probes, a 13-second hero height log, and a push-step log. The once-per-visit loader was skipped. Judged against JAMES.md and MASTER.md as they stand after the 14:37–14:45 changes (scale rhythm, the ask in the sticky header, nothing floating).
Proof: `img/registry.jpg` (desktop first screen | phone first screen).

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Half.
   - It moves: the push starts at first paint (`docker push` → 401 naming Hanzo IAM → a token chip flies → signature checked → four layers fill → v1.2.3 and its cosign signature land), and the title cuts in.
   - It doesn't sell in 5 seconds. The words are a 5-line paragraph (7 lines on phone) beside a window whose white "Container Registry" half has no visible edge at 1470×801, so the object reads as a black slab with loose text next to it.
   - The bottom ~200px of the desktop first screen is empty.
   - On phone the terminal starts at 480px (200px of it inside 390×664). The registry half where the image lands is stacked below it, off screen while the push runs, so the payoff is never on screen with the action.
2. **One in, one out, or a document?** Mostly one in, one out. The intro's "token" strikes itself through after 5 s, which is a good time-based beat. Then six chapters swap one pane each, and these panes do more than fade:
   - the handshake rows stagger in;
   - the scope highlights `acme`;
   - the bad tag slides out and the storage bar shrinks;
   - the revoked person is struck.

   After that it's a document again: the dark room, console + paste, "Get started" + three related rows, the close.
3. **A real object in every section?** Yes: the push, the repository view, the terminal + swap ledger, the console and prompt, the Sigil rows, the close's Sigil.
4. **One ask, in the sticky header, nothing floating; does scale have rhythm?** One ask: no. Scale: yes.
   - No sticky ask showed at either width across the whole walk, nor in a separate 16-stop check with 2.5 s and 12 s idles. `Registry.css` line 6 keeps the header's "Try Hanzo" outlined for the whole page. So from the hero to "Get Registry" there is no solid ask on screen.
   - The ask itself is consistent: "View Source" in the hero and the close, both `data-cta` and `data-thumb`.
   - Scale has rhythm after the kit pass: h1 52, statement 44, chapter titles 32, /v2/ figure 64, close 64. The dark room's h2 at 26px in a very tall black room reads small and empty.
5. **Every hover and press answers, no jumps?** Not all.
   - These answer:
     - hovering a push step holds that moment (checked: hovering the layers holds step 4 for 3 s+);
     - the swap switch (knob leans 4px, press .98, both states on phone tap);
     - the rail ticks, the asks (fill, arrow, press .97), Copy, the related rows and the "View on GitHub" ghost.
   - These do nothing: "Quickstart" (a ghost button) and "About IAM" in the dark room have no hover change and no press. "Deploy to Cloud", "hanzoai" and the console title don't react either.
   - On phone, the push steps have no tap equivalent of the hover peek.
6. **Overlap, font swap, layout shift?** None. CLS 0 on desktop and 0.0006 on phone. The hero height is constant over 13 s (716 / 1164). The h1 box is steady.
   - Small: when the token chip travels, it lands on top of the "layer 1" bar for about a second.
   - The red "1 issue" badge is the site footer's hydration mismatch (`FooterHTML`), not this page.
7. **Which reference, and is its motion there?**
   - apple.com product page: the pinned scene with one changing panel is there.
   - Pointer-aware detail (osply/hamol): the push peek is the page's best touch.
   - synchronized.studio card-to-page: not verified. The related rows tint on hover and nudge their arrow; I did not follow one.
8. **Different from its neighbours?** Partly.
   - The family neighbours differ: /gateway, /dns, /ingress, /tunnel, /playground.
   - Its Cloud 3 siblings don't. The first screen (window left, title right, lede, one pill) is /node's.
   - Below the hero, the order is the same as /o11y and /metrics: hero → PinnedChapters → ClipWipe room → console/paste → RelatedCards → LaunchClose.
   - The pinned screen is the same picture as /o11y's, mirrored: a white window, a "01" over a 32px h3, grey copy, a dash rail.
   - The signature (a push that asks IAM first) and the beyond (the secret swap) are its own.
9. **All 18 parts covered?** Mostly; see below. `docs/coverage/registry.md` claims the sticky ask carries "View Source" and "no text under 14px". Neither holds at the reviewed state.
10. **Banned tells?**
    - The "01"–"06" mono kicker over each chapter h3 (now being moved below the title in the kit).
    - No UI hue: status reads by ✓, ! and strike, and the only saturated colour is the site footer's blue "Privacy choices" icon. `taste.py` passes.
    - Nothing floats over content (there is no bar at all).
11. **Copy untouched?** Yes. Parity 69/69 text and 12/12 links.
    - Demo strings are labelled examples. A few demo labels restate Hanzo's sentences in new words, and they are not in `ui-strings.json`: "no password stored at either end", "one grant in one place", "same repository as the image they describe", "storage after the delete".
    - Hanzo's own links send "View Source" and "View on GitHub" to the same `github.com/hanzoai` org page, not a registry repo. That is a copy decision for James, not a design fault.

## Missing from the 18 parts (MASTER part 2 / PLAN-COMPONENTS §2.1–2.18, measured)
- **Part 1 / 4, Conversion:** no sticky ask after the hero (answer 4), and the header ask is forced to an outline by page CSS.
- **Part 3, Narrative:**
  - The phone hero puts the image landing below the fold, away from the push.
  - The same idea is told four times: the hero lede ("a short-lived token minted by your Hanzo IAM login, not a password living in a dockerconfigjson secret"), the pinned intro, the dark room's h2 + lede, then the swap rows.
  - The dark room's h2 "Delete the dockerconfigjson secret" is repeated word for word by the switch label right under it.
- **Part 6, Content:** at the reviewed state, "Related capabilities" is a 12px h2 and the "01"–"06" kickers are 12px on desktop. On phone, "Agent prompt" is 12px and the close facts ("License:", "Apache-2.0", "hanzoai") are 13px.
- **Part 7, Visual:** the hero window's white half has no edge (raise it or outline it, MASTER part 7). The related rows' 280px grey Sigil panels are the heaviest thing on that screen.
- **Part 8, Components:** two dead controls in the dark room (Quickstart, About IAM).
- **Part 9, Motion:** the push loops forever, about every 10 s. MASTER 4.1 says a cloud demo runs once for 6–10 s, then settles.
- **Part 11, Mobile:**
  - 44px targets everywhere and no sideways scroll at 320.
  - The lede is 7 lines before the ask.
  - The push peek has no tap path.
- **Part 12, Accessibility:**
  - Pause (first in the demo), `aria-pressed` on the switch, contrast ≥4.5:1 with true backgrounds.
  - Reduced motion shows the push at its end state, the token expired, and the swap switches without wipes; the first screen is still.
  - JS off: Hanzo's words show, while 58 demo strings in inactive panes stay hidden.
- Passing:
  - one h1 and one main;
  - Persona/Goal/CTA/Metric in the header;
  - `data-cta` and `data-thumb` on both asks;
  - no raw img, video, table or select;
  - one `title=` on the page, and that is the site chat button's;
  - no layout shift.

## Fixes (in order)
1. **Put the one ask where JAMES now says.** Delete `Registry.css` line 6 so the sticky header carries the solid ask after the hero ("View Source", via `data-thumb`). Never float a pill over content on desktop.
2. **Finish the hero object.** Give the window one edge all round: a hairline or a raise on the white half, so it reads as one window, not a slab plus loose text. On phone, put the registry half beside or over the terminal's last lines so the image lands on screen while it is pushed. Keep the token chip's path off the layer bars.
3. **Break the template below the hero.** Registry and O11y share every section. Give Registry one screen no sibling has. For example, make the push itself the pinned object (scroll walks the same push through 401 → token → signature → layers → signed image) instead of a second white repository window.
4. **Say it once.** Let the dark room carry the dockerconfigjson idea alone: drop the switch's duplicate of the h2 (the switch can be icon-labelled from the register), or make the h2 the switch. Let the pinned intro show the token expiring without restating the lede.
5. **Every control answers.** Give "Quickstart" a fill or ink hover and a .97 press, and give "About IAM", "Deploy to Cloud", "hanzoai" and the console title a hover that is not opacity. Give the push steps a tap path on phone (tap a step to hold it).
6. **Let the push settle.** Run it once (about 10 s), rest on the signed image with "replay" on hover or press, and keep pause.
7. **Floors.** 13px desktop and 14px phone for "Related capabilities", the chapter numbers, "Agent prompt" and the close facts. Give the dark room's h2 its moment (it is 26px in a 1,287px black room), or shorten the room.
