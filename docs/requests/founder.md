# /founder: shared change request (7 Nov)

For the shared Ask owner (`components/Ask.jsx`), not a page change:
- Under 900px the header keeps a solid "Try Hanzo" while the hero's solid "Claim a merged pull request" (`data-thumb`) is on screen, and no ask bar rises after the hero. Desktop already swaps. Please apply the same swap (or outline the header button) on phones, so one solid shows at a time.

Same request stands for /grants, /ide and /features (critics flagged it on each). Until it lands, these pages call the page-local `components/pages/usePhoneAsk.js`, which does the desktop swap on phones through the same shared hooks; fold it into Ask.jsx and delete the hook.

For the shared token owner: `--soft`, `--faint`, `--card` and `--hz-50/300/400` resolve to Apple greys (#48484a, #6e6e73, #f5f5f7, #a1a1a6), not the deck's (#525252, #737373, #f5f5f5, #a3a3a3). Pages that use them render off-deck greys.
