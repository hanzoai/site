# Requests from /metrics (Cloud 3) to the shared owners

1. **Sticky ask (components/Ask.jsx, components/Phone.jsx).** MASTER §3.2 rule 6 says one solid ask sits in the sticky header at every width, with no floating pill bar over content on desktop. On phones, a slim bottom bar is allowed only where it never covers content or the page's own ask.
   - Today the desktop ask bar floats at the bottom centre over page content.
   - The phone thumb bar sits over the last lines of the pinned chapters and the black room's code.
   - Proposed: carry the `data-thumb` label in the header (quiet, then solid once the hero ask leaves view), drop the desktop pill, and reserve page padding under the phone bar.
   - Cloud 3 pages already put `data-thumb` on the hero ask and the close ask, and `data-ask-name` inside `<main>`.
2. **Header "Try Hanzo".** It stays solid while a page's hero ask is on screen, which makes two solids on one screen (PLAN 0.9). It should be outlined while any `main [data-thumb]` is in view.
3. **`lib/cta.js` and `lib/track.js`.** These do not exist yet. Cloud 3 asks carry `data-cta="<page>.<slot>"` and `data-thumb`, ready to be wired.
5. **`PinnedChapters` (Cloud 3 kit).** Hidden steps are only `opacity: 0; pointer-events: none`, so their buttons stay in the tab order, and the scene still pins under 900px. /metrics now uses a page-local scene (`Chapters` in `Metrics.jsx`) that marks hidden steps `inert` (plus `visibility: hidden` and `scale: 0` once faded) and stacks each chapter's object above its words under 900px. The kit would benefit from the same.
4. **Deck tokens in `app/system.css`.** The shared ramp still uses Apple greys (#6e6e73, #86868b, #c7c7cc, #f5f5f7). MASTER §3.1 names the deck ramp (#737373, #525252, #a3a3a3, #d4d4d4, #f5f5f5). Cloud 3's kit (`components/v2/LaunchType.css`) uses the deck values directly until the tokens move.
