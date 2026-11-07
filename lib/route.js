// Links to pages this site has stay inside it; anything else (Hanzo's app: chat, pay, signup...) goes to hanzo.ai.
import ROUTES from './routes.json';
const HAS = new Set(ROUTES);
export const href = (p) => {
  if (!p || !p.startsWith('/')) return p;
  const base = p.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return HAS.has(base) ? p : 'https://hanzo.ai' + p;
};
