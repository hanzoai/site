# /bot — James-eye review

Verdict: 6/10
First complaint: "The first screen is centred text and three buttons. Where's the product? And there's a pill bar floating over the text."

Walked 7 Nov, page file at `4b53974` (`components/pages/Bot.jsx`, `Bot.css`, shared `v2/AppStage`, `AppScenes`), on the 14:43 preview of main plus the Apps branches, judged against `docs/MASTER.md` and `docs/JAMES.md`.
- **This build:** a 9-second first-screen film at 1470×801 and 375×812 with no input, hover and press on the primary, a full scroll pass at both widths, reduced motion, JS off and phone tap targets.
- **The earlier `a1dcdca` walk:** the full moving walk with hovers and taps; the layout is the same.

Stills: `review/bot/desktop-walk.jpg`, `review/bot/desktop-walk-2.jpg`, `review/bot/phone-walk.jpg`, `review/bot/desktop-first-9s.jpg`.

## What works
- The org chart under the hero is a real idea. A person @mentions a bot in a thread, a packet runs down the crew to that bot, and the reply fills in. It runs by itself through ten channels.
- Five pinned chapters hold the text while a live pane changes (sandbox, bot roster, thread with "Yes, add it", routine toggles, memory file).
- "Message your bots where you already are" is one huge sentence of channel names, lit and dimmed: a lovely type moment. The plan slider is a good Beyond.
- "Meet your first bot" is a proper close: one solid "Try Hanzo" and a text link. The header's ask is the same "Try Hanzo".
- Monochrome now (taste.py passes). Press scales .98, hovers answer, CLS 0. Reduced motion leaves 0 running. Parity: text 306/306, links 21/21.

## Card check
- `docs/coverage/bot.md` does not exist, so the verdict is capped at 7. All 18 parts are missing a `Done here:` line.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** No at 1470×801. The first screen is a centred label, a 126px centred headline, a paragraph and three asks. After the headline's cut-in, nothing on it moves. The org chart, the real object, starts below the fold.
2. **One in, one out, or a document?** Mixed. The chapters and the channel sentence are scenes. But the page is about 20 screens: workflows, chapters, 200 tools, channels, steps, install, paste, pricing, extras, FAQ, close, then "Get Bot" and "Deploy to Cloud" after the close.
3. **A real visual object in every section?** Mostly, but the hero thread's second card, the sandbox and the memory file are grey placeholder bars, not product.
4. **One ask, in the sticky header?** The header carries "Try Hanzo", the page's ask. But the hero gives three asks of near-equal weight, a solid "Deploy to Cloud" sits after the closing Band, and a floating pill ("Hanzo Bot · search · Try Hanzo") rides over the workflow rows and the FAQ on desktop.
5. **Every hover and press answers, no jumps?** Yes on desktop. Phone text links are 19–21px tall.
6. **Overlaps, font swap, layout shift?** The floating pill overlaps content at 1470×801. No shift. JS off: 146 of 219 text blocks stay invisible.
7. **Which reference, is its motion there?** Apple product page: yes in the chapters. chatgpt.com/business calm: no, too long and busy.
8. **Different from neighbours?** Partly. The centred label, Display headline and stage opening repeats /desktop. Chapters, black room and "Paste and ship" repeat /api and /cli.
9. **18 parts (MASTER §2)?** No card. See below.
10. **Banned tells?** Yes:
    - labels directly above the h1 ("HANZO BOT · AI TEAMMATES") and above h2s ("10 KILLER WORKFLOWS", "PRICING", "FAQ"…);
    - a floating pill bar over content;
    - a centred headline over three buttons, the stock SaaS opening.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts
- **Card:** no coverage card, and no `Persona:` / `Goal:` / `CTA:` / metric lines.
- **Part 3 First impression:** the hero object is not in the first screen. Content continues after the Band.
- **Part 4 Conversion:** three hero asks; an extra solid after the close; the floating pill.
- **Part 6 Content:** too long for one scroll.
- **Part 7 Visual system:** labels over headings; placeholder bars in product panes.
- **Parts 11 / 12:** 19–21px phone targets; 146 text blocks hidden with JS off.

## Fixes (in order)
1. **Put the org chart in the first screen.** Headline at rest size (about 52–64px, MASTER §3.1) on the left of an 8/5 split, the live crew and thread on the right, so the packet runs above the fold within the first second.
2. **One ask.** Keep "Try Hanzo" solid. Make "Install on your Mac" and "Contact sales" text links. Turn off the floating desktop pill (the header already carries the ask). Move "Get Bot" and "Deploy to Cloud" above the FAQ so the page ends on "Meet your first bot".
3. **Delete every label sitting directly above a heading.**
4. **Fill the panes with real content.** Replace the grey bars with Hanzo's own example lines from the thread and skill text.
5. **Shorten.** Fold "Three steps" into the install room, and put "Need more than one resident bot?" under the slider. Aim for about 12 screens.
6. **Write `docs/coverage/bot.md`**: 18 parts, each with real evidence.
