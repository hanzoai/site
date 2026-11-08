# Requests from the Cloud 1 pages (/analytics /authz /base /crawl /dashboards /datastore /dns /edge /engine /functions)

One line each: the part, what we need, and why. Worked around page-locally meanwhile.

- `components/kit.jsx` **Flap**: a mask-only mode that never draws a digit other than the true one. MASTER part 9 and the conductor's rule "counters never flash numbers that aren't Hanzo's" ban the flip through other digits; /datastore now drops its true digits in from behind masks page-locally.
- `components/kit.jsx` **Tabs**: the gliding pill uses a spring and carries a shadow. MASTER 3.1 says no springs (ease-emphasis, 300 ms) and no shadow on non-floating parts, so these pages keep page-local view switches.
- `app/system.css` **CodeBlock** header: the caption is 12px and Copy 12.5px, under the 14px phone floor (MASTER part 6). KeynoteClose overrides both to 14px on phones.
- A shared **example console** (the stand-in for Frame's `Console`, which carries `title=` tooltips): /authz and /base share `components/pages/cloud/ExampleConsole.jsx` page-locally until the kit has one.
