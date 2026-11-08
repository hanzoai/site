# For Hanzo's app team: the GA items this repo can't fix (7 Nov)

The owner ranked 20 pages by lost buying intent (Google Analytics, 10 Oct to 6 Nov: 9,905 users, 7 purchases, $371). This repo is the marketing site only. The pages below are part of Hanzo's app (`/pay`, `/signup`, `/login`, `/auth`, `/onboarding`, `/docs` and the signed-in `/chat`), so the app team has to make these changes. They are in the owner's order.

## To build

1. **/pay/cart (item 3).** Show a total for card payment only, with a single pay button. Build it to Des's mockup (we don't have a copy; see open questions).
2. **/signup (item 6).** Offer Google sign-in plus an email field. Show the chosen plan and its price on the page, e.g. "Go, $8/month".
3. **/login (item 7).** Give login its own page, separate from signup. The nav's "Log in" should be a real link to it, not a menu.
4. **/auth/callback (item 8).** Replace the raw word "unmatched" with a plain message, then send people on to the plan they picked or, if they didn't pick one, to /chat.
5. **/chat (item 9).** Add an upgrade prompt inside the app, at the moment someone hits a limit.
6. **/pay (item 10).** Don't leave people on a dead end: send them to /pricing, or to the cart if a plan is already chosen.
7. **/onboarding (item 11).** Add a step where new signups pick a plan.
8. **/studio (item 14).** Add an upgrade prompt inside the product.
9. **/beta/apply (item 18).** Add a "skip the wait, go paid" option next to the application.
10. **/docs/quickstart and /docs/cli (item 19).** Add "Get an API key" to both pages, linking to platform.hanzo.ai/api-keys. Also check that /docs/cli renders properly: GA shows an average visit of 1 second.

## To filter

- **The 1 Nov /beta spike (item 5)** was bots. Add a GA filter for that traffic so it stops skewing the funnel numbers.

## Open questions for the owner

- **Des's mockup for /pay/cart is missing.** Please send it, or say who has it.
- **The /dev price doesn't match.** /dev went out at Go, $8/month, but you said $20, and the plan named Dev costs $45 (api.hanzo.ai/v1/billing/plans). Which one should /dev sell?
- **The Go and Pro checkout links worked on live hanzo.ai on 7 Nov:** `/pay/confirm/card?plan=go` and `?plan=pro-2x`, both with `returnUrl=https://hanzo.ai/chat`. The new buy links on this site, including /enso's, point to them, so please keep those URLs stable.

## Already done in this repo

- **/models (item 15):** every model whose price Hanzo publishes now shows it, and each model has a "Use it now" button that goes to /chat. Models with no published price show none.
- **/enso (item 17):** added "Every model through Enso, Go is $8/month", which goes to Go's card checkout. The per-token rates for Flash, Pro and Ultra are on the page.
