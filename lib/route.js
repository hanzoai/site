// Links to pages this site has stay inside it; anything else is the app's (chat, sign-in, pay, the rooms) on hanzo.app.
import ROUTES from './routes.json';
import { APP } from './app';
const HAS = new Set(ROUTES);
export const href = (p) => {
  if (!p || !p.startsWith('/')) return p;
  const base = p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return HAS.has(base) ? p : APP + p;
};
