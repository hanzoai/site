# Shared findings from the James-eye critic

Critic for Wave 2 groups 11–14, `/models/*` and `/cloud/*`. Measured on main at `2106935` and later; updated 7 Nov 15:00 UTC on `25b197c`.

## 1. The floating ask bar: fixed at the shared level (15:06)

`d2b5ab8c` (merged 15:06) removed the desktop pill; the sticky header carries the solid ask at every width. On phones a slim bar carries the page's own ask only at rest where nothing readable or tappable sits under it.

- Reviews pushed between 15:00 and 15:08 (/sms-opt-in, /zen, /enso, /koma, /startups, /kai, /iro) were walked on `25b197c`, before this fix, and capped some pages at 6 for the pill. They are being re-walked on `648b798` and re-scored; the pill is not held against any page from that build on.
- From `648b798`: if my walk still sees anything fixed over content (a bar, a label, a panel), the page fails MASTER 3.2 rule 6 and is capped at 6.

## 2. 18-part cards (MASTER section 6)

MASTER section 6 asks for `docs/coverage/<page>.md` copied from `_TEMPLATE.md`: 18 `## N.` headings, each with a filled `Done here:` line. Pages without one are capped at 7 ("Cap: part card"). At 15:00 on `25b197c`:

- **Cards in MASTER format, 18/18:** affiliate, enso, iro, kai, koe, koma, mori, oto, uta, zen, benchmarks-family, products-family, customers-family. Their claims are checked on the page; a false claim caps at 7.
- **Old format (0/18):** beta, bounty, buying-specialist, founder, grants, integrations-family, solutions-family, blockchain-family, legal-family, careers-family, blog-family, agents-family, compare-family, help-family; zen-family and kai-family through their member cards (`zen-7.md`, `zen-models.md`, `zen-zen6-max.md`, `kai-guide.md`).
- **No card:** learn, newsletter, referral, sms-opt-in, startups, oss-family (`oss.md` is the /oss hub card, also old format).

## 3. The red "1 Issue" badge (hydration mismatch) appears only under load

Single loads of every page I re-checked are clean. The badge shows up in walks when four pages load at once on the dev server. I do not count it against pages; noted here in case the conductor sees it on localhost.
