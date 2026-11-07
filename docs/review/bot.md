# /bot — James-eye review

Verdict: 6/10
First complaint: "The first screen is centred text and three buttons. Where's the product? And it's orange again."

Walked 7 Nov, page file at `a1dcdca` (`components/pages/Bot.jsx`, `Bot.css`, shared `v2/AppStage`, `AppScenes`), on the preview of main plus the Apps 1 branch. Filmed moving at 1470×801 and 375×812 (wheel and finger scroll, dwell on every screen, hover and press on desktop, taps on phone), plus a plain scroll pass to the footer at both widths, reduced motion and JS off. Stills: `review/bot/desktop-walk.jpg`, `review/bot/desktop-walk-2.jpg`, `review/bot/phone-walk.jpg`.

## What works
- The org chart under the hero is a real idea. A person @mentions a bot in a thread, a packet runs down the crew to that bot, and the reply fills in. It runs by itself through ten channels.
- Five pinned chapters hold the text while a live product pane changes (sandbox, bot roster, thread with "Yes, add it", routine toggles, memory file). That is the Apple pattern.
- "Message your bots where you already are" is a lovely type moment: one huge sentence of channel names, lit and dimmed.
- The plan slider ("How many resident bots do you need?") is a good Beyond. The close "Meet your first bot" is a proper Band: one solid "Try Hanzo" and a text link.
- Press scales .98, hovers answer, CLS 0 at both widths, no font swap. Parity: text 306/306, links 21/21. Reduced motion leaves 0 running animations.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** No at 1470×801. The first screen is a centred kicker, a centred headline, a paragraph and three asks. After the cut-in, nothing on it moves. The org chart that is the hero object starts below the fold, with only its caption strip peeking.
2. **One in, one out, or a document?** Mixed. The chapters and the channel sentence are scenes. But the page is 16,300px tall, about 20 screens: workflows list, chapters, 200 tools, channels, steps, install, paste, pricing, extras, FAQ, close, then a "Get Bot" related list and "Deploy to Cloud" after the close. That is the overload he complained about.
3. **A real visual object in every section?** Mostly. But several panes are grey placeholder bars where real content should be: the second thread card in the hero stage, the memory file, the sandbox panel. They read as loading skeletons, not product.
4. **One ask, sticky after the hero?** "Try Hanzo" is the page's ask and the header carries it at every scroll, so it is always on screen. But the hero offers three asks of near-equal weight ("Try Hanzo", "Install on your Mac", "Contact sales"), and a solid "Deploy to Cloud" appears after the closing Band.
5. **Every hover and press answers, no jumps?** Yes on desktop. On phone, tapping a workflow opens its drawer and the page behind is locked until Close, which is correct. Text links are 19–21px tall, under the 44px target.
6. **Overlaps, font swap, layout shift?** None seen, CLS 0. JS off: 158 of 219 text blocks stay invisible, so most of the page is blank without scripts.
7. **Which reference, is its motion there?** Apple product page: yes in the chapters. chatgpt.com/business calm trust: no, it is too long and too busy for that.
8. **Different from neighbours?** Partly. It shares the kicker-over-Display opening, the Stage, the pinned-chapter kit and the one dark room with /api, /cli, /desktop and /gen. The tangerine is close to /careers' and /affiliate's orange.
9. **18 areas (PLAN-COMPONENTS)?** See below. No `docs/coverage/bot.md`.
10. **Banned tells?** Yes:
    - eyebrows over the h1 ("HANZO BOT · AI TEAMMATES") and over most headlines ("10 KILLER WORKFLOWS", "01 · WHAT A BOT IS", "PRICING", "FAQ"…);
    - a tangerine UI accent on kickers, @mentions, bot faces, checks, toggles and `$` prompts;
    - a green "1 working" status;
    - a centred headline over three buttons, the stock SaaS opening.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 areas
- **2.3 First impression:** the hero object is not in the first screen at 1470×801. The page ends after its Band with more content ("Get Bot", "Deploy to Cloud").
- **2.4 Conversion:** three hero asks. The extra solid after the close.
- **2.6 Content presentation:** too long for one scroll. The 10 workflows and the FAQ could be one drawer each, as they already open.
- **2.7 Visual system:** tangerine and green UI hues. Placeholder bars inside product panes.
- **2.11 / 2.12:** 19–21px text-link targets; 158 text blocks hidden with JS off.
- **2.18:** no `Persona:` / `Goal:` / `CTA:` lines, no `data-cta`.

## Fixes (in order)
1. **Put the org chart in the first screen.** Headline left at about 96px, the live crew and thread right (or under a shorter headline), so the packet runs above the fold at 1470×801 within the first second.
2. **One ask in the hero.** Keep "Try Hanzo" solid. Make "Install on your Mac" and "Contact sales" text links. Move "Deploy to Cloud" and the "Get Bot" list above the closing Band, or into a drawer, so the page ends on "Meet your first bot".
3. **Take the orange out.** @mentions, faces, checks, toggles and prompts go ink or white alpha steps; "1 working" gets a shape, not green. Delete every kicker over a headline.
4. **Fill the panes with real content.** Replace the grey bars in the hero's second card, the sandbox and MEMORY.md with Hanzo's own example lines (the page already has them in the thread and skill text).
5. **Shorten the walk.** Fold "Three steps" into the install room, and put "Need more than one resident bot?" under the plan slider. Let the FAQ open in one sheet. Aim for about 12 screens, not 20.
