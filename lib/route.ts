// Links to pages this site has stay inside it; /pay and the account pages are hanzo.ai's own; /login and /signup go to the
// app's host, where Hanzo starts the sign-in (hanzo.ai's own copy of those two only hands the visitor on to hanzo.app, a
// second page load); anything else is the app's (chat, the rooms) on hanzo.app.
import ROUTES from './routes.json';
import { APP, SIGNIN } from './app';
const HAS = new Set(ROUTES);
const SIGN = /^\/(?:forget|join|pay)(?:\/|$)/;
const base = (p: string) => p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
/** Whether this site renders `path`; anything else here (the sign-in pages, which the edge serves from the app) is a full page load. */
export const has = (path: string) => HAS.has(base(path));
export const href = (p: string) => {
  if (!p || !p.startsWith('/')) return p;
  if (has(p)) return p;
  return (SIGN.test(base(p)) ? SIGNIN : APP) + p;
};
