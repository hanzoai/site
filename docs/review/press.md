# /press: James-eye review (independent critic, 7 Nov)

Verdict: 7/10
First complaint: "The top's lovely, the kit cards dealing out and that glint across the black one. But after the news it just stops. Contact, logos, socials, team, all sitting there dead, and every heading is shouting at the same huge size."

Walked moving at 1470x801 and 375x812 (cookie bar rejected), each screen held about 3 s with frames 1 s apart, every control in `main` hovered and pressed (33), network and console logged. `python3 scripts/parity.py /press`: OK, text 83/83, links 20/20. CLS 0.0016 on desktop (all from the shared header), 0 on phone. No page errors. The only console errors are 404s for the partner logos, portraits and kit ZIP, which are not mirrored in this sandbox. Their fallbacks (initials, Sigil plates) are judged as fallbacks.

## The 11 answers

1. **Sells in 5 s, moves within 1 s?** Yes. The h1 cuts in by mask, and the three-plate kit stack is the clear object. A light sweep crosses the black plate about every 3 s with no input. The ask and the download are both on the first screen at both sizes.
2. **One in, one out, or a document?** Yes for the first third: the stack fans out into the three kit plates on a pinned stage, the boilerplate fills in, the facts settle, and the news index runs beside its dark preview card. After that it reads as a document: a black contact room, a brand block, a 9-row social list and the team, stacked one after another. On phone, News is about 2.7 screens of headlines plus full summaries with no object (`img/press-phone-news.jpg`).
3. **A real visual object in every section?** Mostly. Kit plates, figures, the news card, the big email, the Brand Guidelines plate with partner logo rows, and the Sigil leadership plates all qualify. "Connect With Us" is only a hairline text list.
4. **One ask in the header, nothing floating, scale rhythm?** The ask passes on desktop: the header swaps to a solid "Contact Press Team" once the hero ask leaves, and nothing covers content. Scale fails. The h1 is 84px (rest is 52), every h2 is 64px (rest is 26), the email is 84px, the four facts are 64px and the boilerplate is 32px. The About screen has three big sizes on screen at once (`img/press-desk-still.jpg`). Neighbours Philosophy and Research rest at 52px.
5. **Every hover and press answers, no jumps?** Yes. Asks change fill and press to 0.97. News rows ink up, underline and drive the preview card (number, progress hairline, summary): a hover that tells you something. Partner download chips fill, social rows fill and nudge, kit-plate chips flip to ink, and the copy buttons press to 0.92 and draw a tick. Nothing fades and nothing jumps.
6. **Overlap, font swap, layout shift?** None on either size. On phone the black room's copy button shows alone at the bottom of the screen before the email cuts in beside it. On phone, "10-54%" breaks after the hyphen in news row 02.
7. **Which reference, and is its motion there?** Apple: the pinned stage where the kit spreads is real and good. The osply/hamol editorial index shows in the news. There is nothing ambient past the hero, so the "alive" half of the references is missing.
8. **Different from neighbours?** The hero medium (a dealt press kit) and the black press room are its own. The declared signature (the boilerplate filling word by word on scroll) is the same signature Philosophy.jsx and Research.jsx already claim.
9. **18 parts?** Visibly covered: one h1, one solid fill per viewport (desktop), `data-cta`/`data-thumb` on the primary, copy actions with confirmation, the noscript failsafe, the Story order ending on the page's own closing link, numbered rails, tokens only. The idle-motion and the "scroll at most half" items (part 9) are not met: the arrival, the glint, the Sigil drift and one pointer preview sit beside five scroll-driven moves (fan-out, word fill, row-crossing focus, facts settle, email and team cut-ins). There is no Time kind.
10. **Banned tells?** None. No hue, no gradient text, no label above a headline ("Press & Media" and "Leadership" sit below as captions), no fading buttons, no boxed hero.
11. **Copy untouched?** Yes. Parity is 83/83 text and 20/20 links, and the hero lede matches `content/live/press.json` byte for byte.

## Fixes to reach 8

1. **Give the lower half untouched life, one mover per viewport.** Right now, on desktop, the screens from About down to the social list show identical frames 1 s apart. Use what is already there, for example:
   - the partner row as a slow (25 s or slower) logo drift with a pause control that freezes under reduced motion;
   - the Brand Guidelines Mark drawing or breathing once in view;
   - the social index's numbered caption walking 01 to 09 by itself until pointed at.

   Add one Time-kind move. Scroll-linked effects must end up at no more than half the page's motion.
2. **Put scale back on rhythm.** Section h2s should rest at 26–32px, with one big thing per screen:
   - About: the four facts are the moment, so the heading and the 32px boilerplate step down.
   - News: the rows and the card are the moment; the heading is 26–32px.
   - Contact: keep the big email; the heading is small.
   - Hero: the h1 at 52–64px beside the kit stack, which is the big thing.
3. **Phone News as one object, not three screens of text.** Show titles and dates only, with the summary in one dark card that changes as each row crosses mid-screen (the desktop idea, stacked under the list), or open the summary on tap. Fix the "10-/54%" break with wrapping CSS, not copy.
4. **Own a signature.** The word fill is taken by Philosophy and Research. Make the kit dealing out (stack to spread, pinned) the declared signature, which is unique to this page, and demote or drop the word fill so the motion budget stays at 1 + 3.
5. **Phone black room:** keep the copy button hidden until the email has cut in beside it.

## Shared chrome (not counted against the page)
- At 375x812 the header shows a solid "Try Hanzo" all the way down. It never swaps to the page's ask the way desktop does, so the phone hero carries two solid fills (header plus "Contact Press Team").
- The partner logos, portraits and `/press/hanzo-press-kit.zip` are not mirrored into `public/` in this build, so their download links 404 locally (MASTER part 10: mirror every logo and face).
- The tiny header layout shift (CLS 0.0016) comes from the header tools row.
