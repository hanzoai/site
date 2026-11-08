# Requests from /zen/models (shared header, owned by the chrome)

1. **The phone header ask should follow the page's primary.** At 375×812 the header shows a solid black "Try Hanzo"
   while the hero shows a solid white "Get API key" (`data-cta="zen-models.hero"`, `data-thumb`), so the first phone
   screen has two solid fills with two labels (MASTER part 4, the sticky ask; JAMES rule 5, one solid ask). On desktop
   the header already swaps to "Get API key" once the hero ask leaves view. Ask: on phones, render the header ask as the
   quiet (outlined) style while the page's `data-thumb` primary is in view, and swap it to that primary's label and href
   (solid) once it leaves view, exactly as desktop does. The page cannot do this from its own files. Same item as
   `docs/requests/zen-7.md` #2.
2. **Cold-load hydration warning.** The /zen/models critic saw one React hydration-mismatch error on the first two
   fresh loads (not on later ones). In this pass 6 fresh loads (desktop, phone, reduced motion) logged no error from this
   page; the page's own server/client branches render identically (no `window` reads in render). If it recurs it is
   likely the shared footer item in `docs/requests/zen-7.md` #1.
