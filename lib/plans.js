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
