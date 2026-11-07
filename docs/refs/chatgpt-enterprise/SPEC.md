# chatgpt.com/business/enterprise: NOT FILMED YET

**Status.** No video or frames yet: the network policy blocks chatgpt.com (proxy 403), and WebFetch is blocked too. The run is in `docs/refs/TO-FILM.md`.

**Labels:**
- **earlier text fetch:** `docs/BRIEF-v3.md` §9. The page text was fetched; sizes and motion were not observed.
- **write-up:** web search found only third-party copies of the page and 2023 launch coverage. The copies differ from each other, so they are different versions; none is confirmed as current.
- **measured (anthropic.com):** the interim calm-motion values come from `docs/refs/anthropic/`, a measured sibling page, until this page is filmed.

## What is known

| What | Value | Source |
|---|---|---|
| The ask | "Contact sales" in the header, the hero and the close: one label everywhere | earlier text fetch |
| Proof | One named quote plus five numbers, right after the claims. No logo wall. | earlier text fetch |
| Hero line | "Frontier AI built for enterprise", listing ChatGPT Work and Codex | write-up (page copy) |
| Metrics | A "100% active users in ChatGPT Enterprise" style metric block | write-up (page copy) |
| Security | Admin controls listed plainly (SAML SSO, SCIM provisioning, role-based access); a compliance block (centralized visibility, auditability, governance controls) | write-up (page copies) |

**Conflict to settle by filming.** VISION.md says "logo walls in motion", but the earlier text fetch saw no logo wall.

## Not known until filmed
- Every duration, easing and hover response.
- Whether anything moves without input (a marquee, an autoplay demo).
- The type scale and spacing.

## Moves Hanzo should borrow (provisional until filmed)

1. **One ask, one label, three places.**
   - **Pages:** System (/enterprise, /security, /trust) and Utility (/contact-sales).
   - **Behaviour:** the same words in the header, the hero and the close (earlier text fetch).
2. **Proof straight after each claim.**
   - **Pages:** System.
   - **Behaviour:** one named quote plus a short row of numbers, set as big figures, and only numbers Hanzo's own copy already has (James: never invent a number).
3. **Security as a calm list.**
   - **Pages:** System (/security, /trust, /enterprise).
   - **Behaviour:** controls named plainly in a quiet list (SSO, SCIM, roles, audit), not icon boxes. James bans three icon boxes in a row.
4. **Calm motion, short and quiet.**
   - **Pages:** System.
   - **Timing until filmed:** use the measured anthropic.com values: hover colour 100 to 200ms; menus 150ms; reveals 300ms on quart-out `cubic-bezier(.165,.84,.44,1)` (`docs/refs/anthropic/SPEC.md`).
5. **Big statements, small proof.**
   - **Pages:** System.
   - **Behaviour:** one large sentence per screen, with the proof set small beneath it. This is the "one comes in, one goes out" rhythm James asked for.

## Sources
- Earlier text fetch: `docs/BRIEF-v3.md` §9, Conversion references
- Page copies (third-party, unverified):
  - https://openai-dotcom-dun.vercel.app/enterprise
  - https://kfckfcv50-chat2api.hf.space/business/enterprise/
- Launch post (2023): https://openai.com/index/introducing-chatgpt-enterprise/
