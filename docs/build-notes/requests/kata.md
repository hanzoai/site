# /kata: requests (Apps 2 chat)

UI strings for `content/ui-strings.json` (James's approval). Until approved, each is an accessible name only (nothing visible):
- `A Kata session` (the terminal's name, role="log")
- `Test runner`, `CI`, `Language` (the three pick groups in the stack check; the options themselves are Hanzo's words)
- `The suite turns` (the dark room's name)
- `Pause` is already listed (`pause`).

Shared: the kit `Band` button has no `data-cta` (see `docs/requests/ide.md`); the shared ask bar floats over the dark room on desktop (same file). Kit parts this page waits for: `Terminal` (the session is page-owned until then), `PageHero`.

Re-filed 8 Nov (review round 8):
- Kit `Band`: please give its button `data-cta` (here `kata.band`) and send `cta_click` like `Cta`. Until then Kata.jsx (`useBandAsk`) marks it from the page; drop that hook once the kit does it.
- Shared `usePhoneAsk` (components/pages/usePhoneAsk.js): on phones the header keeps "Try Hanzo" after the hero because the swapped "Get API key" is judged not to fit. The critic wants the hero label in the phone header; please widen the fit test (the two labels are about the same width) or let a page opt in.
