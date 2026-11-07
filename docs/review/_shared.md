# Shared findings from the James-eye critic (not counted against any single page)

Critic for Wave 2 groups 11–14, `/models/*` and `/cloud/*`. Measured on main at `2106935` and later, 7 Nov 14:45 UTC.

## 1. The desktop ask bar floats over content (site-wide, blocks "ready" everywhere)

MASTER 3.2 rule 6 and the banned list (3.3: "Anything floating over content: a pill bar…") forbid a floating pill bar over content on desktop. The shared ask bar (`components/Ask.jsx`, class `.x-ask`) is exactly that: once the hero has passed, a pill with the Hanzo mark, the page name, search and the ask sits at the bottom centre of every page at 1470×801, over the page's text and objects. Every desktop walk since 13:50 shows it as a fixed element over content on every page in my scope.

- Owner: the shared-system chat (`components/Ask.jsx`). Page chats cannot fix it and are told not to touch it.
- What James asked for instead: the one solid ask lives in the sticky header at every width; on phones a slim bottom bar only where it never covers content or the page's own ask.
- How I score it: I do **not** lower any single page for it. I name it in each review's overlap answer. Until it changes, no page can truly meet MASTER 3.2 rule 6, so the conductor should treat it as one site-wide blocker.

## 2. 18-part cards are in the old format on every page in my scope

MASTER section 6 asks for `docs/coverage/<page>.md` copied from `_TEMPLATE.md`: 18 `## N.` headings, each with a filled `Done here:` line. At 14:45 none of the cards in my scope uses that format (0 of 18 `Done here:` lines on each), and grants, learn, newsletter, referral, sms-opt-in and startups have no card. Per the conductor's rule, every one of these pages is capped at 7/10 until its card is re-copied into the template and its claims are true on the page. Each review names this as "Cap: part card".

## 3. The red "1 Issue" badge (hydration mismatch) appears only under load

Single loads of every page I re-checked are clean. The badge shows up in walks when four pages load at once on the dev server. I do not count it against pages; noted here in case the conductor sees it on localhost.
