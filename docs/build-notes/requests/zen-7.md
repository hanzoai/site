# Requests from /zen/7 (and the other pages of this chat: /skills /slack /studio /tag /trust /world /zen/models /zen/zen6-max)

1. **Intermittent hydration mismatch in the shared footer.** Critics saw React's "A tree hydrated but some attributes
   of the server rendered HTML didn't match the client properties" with the red "1 Issue" badge on some fresh loads
   (roughly 1 in 3 to 1 in 5) on several of these pages, pointing at `FooterHTML` (`components/Shell.jsx`). FooterHTML
   is server-only `dangerouslySetInnerHTML`; the likely cause is `components/Chrome.jsx` changing attributes inside the
   footer (wordmark, ask input, dark-room classes) before hydration finishes. Ask: defer those DOM writes until after
   hydration (e.g. inside `useEffect` after a `requestIdleCallback`), or add `suppressHydrationWarning` on the shell div.
2. **The header ask on phones.** On desktop the header swaps to the page's own ask after the hero; on phones it stays
   "Try Hanzo", so the first phone screen shows two solid fills with two labels (MASTER part 4, the sticky ask).
3. **Long asks are clipped in the header** (/trust: "Request a review or an enterprise deployment" shows as
   "uest a review or an enterprise deploym"): the header button should size to its label.
