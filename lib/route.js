// Links to pages this site has stay inside it; sign-in is hanzo.ai's own page; anything else is the app's (chat, pay,
// the rooms) on hanzo.app.
import ROUTES from './routes.json';
import { APP, SIGNIN } from './app';
const HAS = new Set(ROUTES);
const SIGN = /^\/(?:login|signup|forget|join)(?:\/|$)/;
export const href = (p) => {
  if (!p || !p.startsWith('/')) return p;
  const base = p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (HAS.has(base)) return p;
  return (SIGN.test(base) ? SIGNIN : APP) + p;
};
