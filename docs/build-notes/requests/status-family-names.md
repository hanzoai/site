# Request: scripts/status.py family names collide with index pages (7 Nov)

`row()` names a family `/x/*` as `x` (`key.strip("/").replace("/*", "")`), so the family and its index read the
same `docs/build-notes/review/x.md`, `docs/build-notes/coverage/x.md` and `docs/gallery/x/`. Every family card and review in the repo is
written as `x-family.md`, so the board shows a family with its index's verdict and card.

Affected: /agents/*, /benchmarks/*, /blockchain/*, /blog/*, /careers/*, /compare/*, /customers/*, /integrations/*,
/legal/*, /solutions/*, /kai/*, /zen/*, /models/* (/cloud/* has no index, so `cloud` is free).

Asked for (shared owner): for a `/*` key, read `<x>-family` files when they exist, else fall back to `<x>`.
Not edited by the /chat, /agents, /benchmarks/*, /blockchain, /blockchain/*, /cloud/* chat (shared script).
