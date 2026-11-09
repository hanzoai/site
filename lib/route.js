// Links to pages this site has stay inside it; sign-in is hanzo.ai's own page; anything else is the app's (chat, pay,
// the rooms) on hanzo.app.
import ROUTES from './routes.json';
import { APP, SIGNIN } from './app';
const HAS = new Set(ROUTES);
const SIGN = /^\/(?:login|signup|forget|join)(?:\/|$)/;
const base = (p) => p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
/** Whether this site renders `path`; anything else here (the sign-in pages, which the edge serves from the app) is a full page load. */
export const has = (path) => HAS.has(base(path));
export const href = (p) => {
  if (!p || !p.startsWith('/')) return p;
  if (has(p)) return p;
  return (SIGN.test(base(p)) ? SIGNIN : APP) + p;
};
