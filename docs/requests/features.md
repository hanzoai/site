# /features: copycheck request (8 Nov)

`node scripts/copycheck.mjs /features` reports missing 28 of 53. Every one of the 28 is hanzo.ai's site header, mega-menu or footer
(Compare models, Hanzo Team, Browser extension, … © 2026 Hanzo AI, Inc., Usage policy, Privacy choices), not the page's own copy:
- hanzo.ai/features has no `<main>`, so copycheck's `document.querySelector('main') || document.body` reads the whole body there,
  while on our page it reads only `<main>`.
- All 28 lines are on our /features page, in the shared site footer and header (checked against the full rendered page).
- The page's own 25 lines all match.

Suggested one-line fix for the script owner, in `text()`: when there is no `<main>`, drop the chrome before reading:
`const main = document.querySelector('main') || (document.querySelectorAll('body > * header, body > * footer, header, footer, nav').forEach((n) => n.remove()), document.body);`
(or compare both sides against the full body). /features stays off Ready until the check says missing 0.
