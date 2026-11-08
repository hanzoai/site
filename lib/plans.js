/* Hanzo's plans: every self-serve price and every checkout link the site uses, in one place.
   Change a number or a link here and every page that shows it follows (home, /pricing, /bot, /buying-specialist,
   /dev, /chat, /enso, /benchmarks, /studio, /beta). Prices are USD. The values are hanzo.ai's own as of 8 Nov 2026;
   Hanzo owns them. Per-token model rates are not here: see README.md, "Prices, plans and checkout links". */

export const SITE = 'https://hanzo.ai';

// Personal plans: monthly price in USD and the plan id Hanzo's checkout expects (/pay/confirm/card?plan=<id>)
export const PLANS = {
  free: { name: 'Free', price: 0 },
  go: { name: 'Go', price: 8, id: 'go' },
  pro: { name: 'Pro', price: 15, id: 'pro-2x' }, // the "3x" rung
  dev: { name: 'Dev', price: 45, id: 'dev-5x' }, // "5x"
  max: { name: 'Max', price: 95, id: 'max-10x' }, // "15x"
  ultra: { name: 'Ultra', price: 195, id: 'ultra' }, // "∞"
};

// Team seats (per member): yearly price, the same per month when billed yearly, and the monthly-billed price.
// Enterprise: per seat per year, billed annually, 20-seat minimum.
export const SEATS = {
  standard: { year: 240, monthAnnual: 20, month: 25 },
  premium: { year: 1200, monthAnnual: 100, month: 125 },
  enterprise: { year: 240, monthAnnual: 20, min: 20 },
  saving: 20, // percent saved by yearly billing
};

const back = (page) => encodeURIComponent(`${SITE}/${page}`);

// card checkout for a plan id; `page` is where Hanzo returns the buyer afterwards (hanzo.ai/<page>)
export const checkout = (id, page = 'chat') => `/pay/confirm/card?plan=${id}&returnUrl=${back(page)}`;
// the same, as a full hanzo.ai URL (for links that must leave this site even in local preview)
export const checkoutAbs = (id, page = 'chat') => SITE + checkout(id, page);
// Team card checkout (/pricing's Team card): 2 seats to start, yearly or monthly
export const teamCheckout = (annual, quantity = 2, page = 'chat') => `/pay/confirm/card?plan=team${annual ? '&interval=year' : ''}&quantity=${quantity}&returnUrl=${back(page)}`;
// Team cart with a seat count (the buying specialist's quote)
export const teamCart = (quantity) => `/pay/cart?plan=team&interval=year&quantity=${quantity}`;

/* ---------- every plan id a link may carry, resolved (the app and checkout pages: /pay/*, /signup, /onboarding) ----------
   Live's ids are go, pro-2x, dev-5x, max-10x, ultra and team (team-premium for premium seats). Links that say the
   plan's name instead (plan=pro, plan=Go, plan=max) resolve to the same plan, so no plan link lands on a dead end. */
export const PERSONAL = ['go', 'pro', 'dev', 'max', 'ultra'].map((k) => ({ key: k, ...PLANS[k] }));
const ALIAS = {
  go: 'go', pro: 'pro-2x', 'pro-2x': 'pro-2x', 'pro-3x': 'pro-2x', dev: 'dev-5x', 'dev-5x': 'dev-5x', max: 'max-10x', 'max-10x': 'max-10x', 'max-15x': 'max-10x',
  ultra: 'ultra', team: 'team', 'team-standard': 'team', 'team-premium': 'team-premium', premium: 'team-premium', free: 'free',
};
export const planId = (raw) => ALIAS[String(raw || '').trim().toLowerCase()] || null;
// a resolved plan: name, unit price, how it bills, whether it is per seat. Prices come only from PLANS and SEATS above.
export function resolvePlan(raw, { interval, quantity } = {}) {
  const id = planId(raw);
  if (!id) return null;
  if (id === 'free') return { id, key: 'free', name: PLANS.free.name, price: 0, free: true };
  if (id === 'team' || id === 'team-premium') {
    const s = id === 'team' ? SEATS.standard : SEATS.premium;
    const year = interval === 'year';
    const q = Math.min(100, Math.max(2, parseInt(quantity, 10) || 2));
    return { id, key: 'team', name: id === 'team' ? 'Team' : 'Team Premium', seats: true, quantity: q, interval: year ? 'year' : 'month', unit: year ? s.year : s.month, perMonth: year ? s.monthAnnual : s.month, total: q * (year ? s.year : s.month) };
  }
  const key = Object.keys(PLANS).find((k) => PLANS[k].id === id);
  return { id, key, name: PLANS[key].name, price: PLANS[key].price, interval: 'month', total: PLANS[key].price };
}
