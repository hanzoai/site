/* Hand-offs: every place the app and checkout pages (/pay, /pay/cart, /pay/confirm/card, /signup, /login,
   /auth/callback, /onboarding, /docs/quickstart, /docs/cli) send someone to Hanzo's real systems. ONE file, so Hanzo's
   team can confirm or change each URL without touching a page. README.md, "Hand-offs to Hanzo's real flows", lists them.

   The rule these pages follow: this site never collects a card number, a password or a one-time code. Card entry
   happens on Hanzo's real checkout; sign-in and sign-up happen on Hanzo's identity provider (hanzo.id, Hanzo IAM).
   These pages are the experience around those hand-offs: the plan, the total, trust, and one clear action.

   CONFIRM marks a value this redesign could not read from live hanzo.ai (its app pages were unreachable when this was
   built, 8 Nov 2026). Each is Hanzo's to confirm before launch. */

export const SITE = 'https://hanzo.ai';

/* ---------- payment ---------- */

// Hanzo's real card form. Every pay button hands off here with live's own parameters:
//   ?plan=<go | pro-2x | dev-5x | max-10x | ultra | team>&returnUrl=<https://hanzo.ai/...>  (+ &interval=year&quantity=<n> for Team)
// CONFIRM: today this is hanzo.ai's own app page of the same path. If this redesign is served at hanzo.ai/pay/*,
// point it at the origin that renders the card form (the app, or a Stripe-hosted checkout link), or every pay button
// would come back to this page.
export const CARD_FORM_URL = 'https://hanzo.ai/pay/confirm/card';

// where Hanzo sends a buyer after paying, when the link that brought them did not say (live's own default, lib/plans.js)
export const DEFAULT_RETURN = 'https://hanzo.ai/chat';

/* ---------- identity (hanzo.id, Hanzo IAM, OpenID Connect) ---------- */

export const IAM_ORIGIN = 'https://hanzo.id';
// hanzo.ai's own OAuth client id (live's agent instructions sign in with clientId "hanzo-ai")
export const IAM_CLIENT_ID = 'hanzo-ai';
// CONFIRM: the authorize endpoint. Live documents the token endpoint as https://hanzo.id/v1/iam/oauth/token and the
// discovery document at https://hanzo.id/.well-known/openid-configuration; this is the matching authorize path.
export const IAM_AUTHORIZE_URL = 'https://hanzo.id/v1/iam/oauth/authorize';
// where hanzo.id returns people after sign-in (this site's /auth/callback)
export const AUTH_CALLBACK_URL = 'https://hanzo.ai/auth/callback';
export const IAM_SCOPE = 'openid profile email';
// CONFIRM: the parameter that opens hanzo.id straight on Google (the provider name Hanzo IAM uses for Google)
export const IAM_GOOGLE = { provider: 'google' };
// sign-up asks hanzo.id for its create-account screen with OpenID Connect's standard prompt=create
export const IAM_SIGNUP = { prompt: 'create' };
// CONFIRM: where /auth/callback hands the code to finish sign-in (the app's session endpoint). Until it is set, the
// callback page takes people straight on to their next step, and their hanzo.id session signs them in there.
export const AUTH_COMPLETE_URL = null;

/* ---------- developer ---------- */

// live's own links (hanzo.ai/api, /dev, /pricing)
export const API_KEYS_URL = 'https://platform.hanzo.ai/api-keys';
export const DOCS_QUICKSTART_URL = 'https://docs.hanzo.ai/docs/quickstart';
export const DOCS_CLI_URL = 'https://docs.hanzo.ai/docs/cli';
export const PLATFORM_URL = 'https://platform.hanzo.ai';

/* ---------- helpers ---------- */

const qs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');

// only Hanzo's own https hosts may receive a returning buyer
export function safeReturn(u) {
  try {
    const x = new URL(u);
    if (x.protocol === 'https:' && (x.hostname === 'hanzo.ai' || x.hostname.endsWith('.hanzo.ai'))) return x.href;
  } catch {}
  return DEFAULT_RETURN;
}

// only a path on this site may be a "next" step (no other hosts, no //evil.com)
export function safeNext(n, fallback = '/chat') {
  return typeof n === 'string' && /^\/(?!\/)[^\s\\]*$/.test(n) ? n : fallback;
}

// the card form, with live's parameters
export function cardFormUrl({ plan, interval, quantity, returnUrl }) {
  return CARD_FORM_URL + '?' + qs({ plan, interval, quantity, returnUrl: safeReturn(returnUrl || DEFAULT_RETURN) });
}

// state carried through hanzo.id and read back by /auth/callback: where to go next, and the plan chosen
export const packState = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export function unpackState(s) {
  try { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))); } catch { return null; }
}

// a hanzo.id link: sign in (or sign up) with Google or with email, then back to /auth/callback
export function iamUrl({ google = false, signup = false, next, plan }) {
  return IAM_AUTHORIZE_URL + '?' + qs({
    client_id: IAM_CLIENT_ID,
    response_type: 'code',
    redirect_uri: AUTH_CALLBACK_URL,
    scope: IAM_SCOPE,
    state: packState({ next: safeNext(next, ''), plan: plan || '', signup: signup ? 1 : 0 }),
    ...(signup ? IAM_SIGNUP : {}),
    ...(google ? IAM_GOOGLE : {}),
  });
}
