// Links to pages this site has stay inside it; /pay and the account pages are hanzo.ai's own; anything else, /login and /signup
// included (hanzo.app starts the sign-in), is the app's on hanzo.app.
import ROUTES from './routes.json';
import { APP, SIGNIN } from './app';
import DARK from '../content/live/_dark.json';
const HAS = new Set(ROUTES);
const NO_PAGE = new Set<string>(DARK.logins);
const SIGN = /^\/(?:forget|join|pay)(?:\/|$)/;
const base = (p: string) => p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
/** Whether this site renders `path`; anything else here (the sign-in pages, which the edge serves from the app) is a full page load. */
export const has = (path: string) => HAS.has(base(path));
/** A GitHub page a signed-out visitor is not shown (scripts/live.ts finds them): its link is words. */
export const unseen = (url: string) => { const m = /^https:\/\/github\.com\/([^/?#]+)/i.exec(url); return !!m && NO_PAGE.has(m[1].toLowerCase()); };
export const href = (p: string) => {
  if (!p || !p.startsWith('/')) return p;
  if (has(p)) return p;
  return (SIGN.test(base(p)) ? SIGNIN : APP) + p;
};
