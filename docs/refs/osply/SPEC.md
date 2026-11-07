# osply.co: NOT FILMED YET

**Status.** No video or frames yet: the network policy blocks osply.co (proxy 403), and WebFetch is blocked too. The run is in `docs/refs/TO-FILM.md`.

**Labels:**
- **earlier code read:** `docs/BRIEF-v3.md` §9, where an earlier session read the site's HTML, CSS and JS.
- **write-up:** found by web search.
- **conversion:** a standard curve equivalence, not measured.

## What is known

| What | Value | Source |
|---|---|---|
| Card to page | The cover image flies into the next page, blur 10px, 1.9s, with the next page prefetched | earlier code read |
| Headings | A line-mask reveal on every heading, 1.2s, GSAP `power4.out` | earlier code read |
| Contact | "Copy email" copies in place and confirms on the spot | earlier code read |
| Colour | A token ladder: near-black, then white at alpha steps for text levels | earlier code read |
| Type | Lay Grotesk, a trial font. Do not take. | earlier code read |
| Studio | OSPLY is a Webflow certified partner in Nice, France. Services: 3D, animation, branding, UI/UX, development. | write-up |

**Conversion:** GSAP `power4.out` is the quint-out curve. Its usual CSS form is `cubic-bezier(0.22, 1, 0.36, 1)`, which is exactly Hanzo's `ease-soft` token.

## Not known until filmed
- Idle motion and pointer-aware details.
- The type scale and spacing.
- Whether the 1.9s flight still exists on the live site.
- Hover responses.

## Moves Hanzo should borrow (provisional until filmed)

1. **Line-mask heading reveal.**
   - **Pages:** every page type, on H1 and H2, through the one `<Reveal>` component.
   - **Timing:** osply uses 1.2s `power4.out` (earlier code read). This agrees with BRIEF §8 (1.1 to 1.2s, ease-out-expo).
2. **Prefetch on intent.**
   - **Pages:** Catalogue (cards) and Launch (product cards on home).
   - **Behaviour:** start loading the destination on hover or touchstart, so the open feels instant (earlier code read).
   - **Do not take:** the blur and the 1.9s flight, which are too slow for a product site.
3. **Copy-email-in-place confirmation.**
   - **Pages:** Utility (/contact, /contact-sales), System (/enterprise) and Developer (/api: copy key or command).
   - **Behaviour:** the label swaps to a confirmation where you clicked. No toast.
4. **White-alpha hierarchy on near-black.**
   - **Pages:** all.
   - **Behaviour:** text levels as white at stepped alpha, not new greys (earlier code read). This fits James's "0 brand hues" rule.
5. **Editorial scale with confident asymmetry.**
   - **Pages:** Story (/about, /history, /blog).
   - **Status:** the direction comes from JAMES.md's reference table. Sizes come only after filming.

## Sources
- Earlier code read: `docs/BRIEF-v3.md` §9, Craft references
- Webflow partner profile (write-up): https://webflow.com/@osply
