# Shared findings from the James-eye critic

Critic for Wave 2 groups 11–14, `/models/*` and `/cloud/*`. Measured on main at `2106935` and later; updated 7 Nov 15:00 UTC on `25b197c`.

## 1. The desktop ask bar floats over content (site-wide, blocks "ready" everywhere)

MASTER 3.2 rule 6 and the banned list (3.3: "Anything floating over content: a pill bar…") forbid a floating pill bar over content on desktop. The shared ask bar (`components/Ask.jsx`, class `.x-ask`) is exactly that: once the hero has passed, a pill with the Hanzo mark, the page name, search and the ask sits at the bottom centre of every page at 1470×801, over the page's text and objects. Every desktop walk since 13:50 shows it as a fixed element over content on every page in my scope.

- Owner: the shared-system chat (`components/Ask.jsx`). Page chats cannot fix it and are told not to touch it.
- What James asked for instead: the one solid ask lives in the sticky header at every width; on phones a slim bottom bar only where it never covers content or the page's own ask.
- How I score it, from 15:00: **counted per page.** A page can now turn the pill off itself (`data-ask="off"` on `<main>`; /api, /careers and the legal pages already do), and other critics fail it. So if my desktop walk sees the pill over a page's content, that page fails Part 4 (MASTER 3.2 rule 6) and is capped at 6. If the walk never sees it (a solid ask stays on screen, or the page turns it off), the page passes this rule.

## 2. 18-part cards (MASTER section 6)

MASTER section 6 asks for `docs/coverage/<page>.md` copied from `_TEMPLATE.md`: 18 `## N.` headings, each with a filled `Done here:` line. Pages without one are capped at 7 ("Cap: part card"). At 15:00 on `25b197c`:

- **Cards in MASTER format, 18/18:** affiliate, enso, iro, kai, koe, koma, mori, oto, uta, zen, benchmarks-family, products-family, customers-family. Their claims are checked on the page; a false claim caps at 7.
- **Old format (0/18):** beta, bounty, buying-specialist, founder, grants, integrations-family, solutions-family, blockchain-family, legal-family, careers-family, blog-family, agents-family, compare-family, help-family; zen-family and kai-family through their member cards (`zen-7.md`, `zen-models.md`, `zen-zen6-max.md`, `kai-guide.md`).
- **No card:** learn, newsletter, referral, sms-opt-in, startups, oss-family (`oss.md` is the /oss hub card, also old format).

## 3. The red "1 Issue" badge (hydration mismatch) appears only under load

Single loads of every page I re-checked are clean. The badge shows up in walks when four pages load at once on the dev server. I do not count it against pages; noted here in case the conductor sees it on localhost.
