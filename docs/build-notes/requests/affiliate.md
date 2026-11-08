# Request from the Programs pages (/affiliate, /beta, /bounty, /buying-specialist, /founder, /grants, /learn, /newsletter, /referral, /sms-opt-in, /startups)

Owner: the chat that owns `components/HeaderTools.jsx` / `components/Ask.jsx`.

Since `d2b5ab8` the header's "Try Hanzo" is solid all the time, so every Programs hero shows two solid buttons with
different words ("Try Hanzo" and the page's own ask), and after the hero the page's ask is nowhere on screen.

Ask (MASTER part 4, same as `docs/build-notes/requests/platform.md`):
- While a page's own solid ask (`[data-thumb]`) is on screen, show the header's ask as an outline.
- After the hero, the header's ask takes the label and href of the page's `data-thumb` element.

Every Programs page already marks its one primary with kit `Cta thumb` (`data-thumb`, `data-cta`). Nothing else changes on the pages.
