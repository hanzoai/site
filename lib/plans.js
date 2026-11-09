/* Hanzo's plans, as GET api.hanzo.ai/v1/billing/plans states them: content/live/_pricing.json, which scripts/live.mjs
   writes before every build and which stops the build when a plan is missing. No price is typed here; change a price
   in admin.hanzo.ai (commerce) and the next build shows it. Per-token model rates are not plans: see README.md. */

import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import { APP } from './app.js';

export const SITE = 'https://hanzo.ai';

const plan = (slug) => {
  const p = LIVE.plans[slug];
  if (!p) throw new Error(`plan ${slug} is not in ${LIVE.source}`);
  return p;
};

// Whole dollars as a page writes them: $8, $4,999.
export const usd = (n) => '$' + n.toLocaleString('en-US');

// Personal plans: billed by the month only. `id` is the slug checkout takes (/pay/confirm/card?plan=<id>); `bots` is the
// resident Hanzo Bots it includes.
const personal = (slug) => ({ name: plan(slug).name, price: plan(slug).price, id: slug, bots: plan(slug).bots });
export const PLANS = {
  free: { name: plan('free').name, price: plan('free').price },
  go: personal('go'),
  pro: personal('pro-2x'),
  dev: personal('dev-5x'),
  max: personal('max-10x'),
  ultra: personal('ultra'),
};

// The cheapest plan of a kind: the cheapest a person pays, and the floor under a resident Hanzo Bot (the cheapest plan that
// includes one).
const floor = (plans) => Math.min(...plans.map((p) => p.price));
export const FLOOR = { paid: floor(Object.values(PLANS).filter((p) => p.price > 0)), bot: floor(Object.values(PLANS).filter((p) => p.bots)) };

// Seats (per member): the month's price, the month when billed by the year, and that year. Enterprise is sold by the
// year only, from its minimum seats.
const seat = (slug) => {
  const p = plan(slug);
  return { month: p.price, monthAnnual: p.priceAnnual, year: p.priceAnnual * 12, min: p.minSeats, max: p.maxMembers };
};
const enterprise = plan('enterprise');
export const SEATS = {
  standard: seat('team'),
  premium: seat('team-premium'),
  enterprise: { year: enterprise.price, monthAnnual: enterprise.priceAnnual, min: enterprise.minSeats },
  // what a year saves against twelve months, as a whole percent
  saving: Math.round((1 - plan('team').priceAnnual / plan('team').price) * 100),
};

// Partners (/enterprise): the White-label plan, and the agency plans, which start at the cheapest of them.
const agency = Object.values(LIVE.plans).filter((p) => p.category === 'agency');
export const PARTNERS = { label: plan('white-label'), agency: { names: agency.map((p) => p.name), from: Math.min(...agency.map((p) => p.price)) } };

const back = (page) => encodeURIComponent(`${APP}/${page}`);

// card checkout for a plan id on hanzo.app; `page` is where the buyer lands afterwards (hanzo.app/<page>)
export const checkout = (id, page = 'chat') => `/pay/confirm/card?plan=${id}&returnUrl=${back(page)}`;
// the same, as a full URL
export const checkoutAbs = (id, page = 'chat') => APP + checkout(id, page);
// Team card checkout (/pricing's Team card): from the plan's minimum seats, yearly or monthly
export const teamCheckout = (annual, quantity = SEATS.standard.min, page = 'chat') => `/pay/confirm/card?plan=team${annual ? '&interval=year' : ''}&quantity=${quantity}&returnUrl=${back(page)}`;
// Team cart with a seat count (the buying specialist's quote)
export const teamCart = (quantity) => `/pay/cart?plan=team&interval=year&quantity=${quantity}`;

// What one term of a plan charges, in dollars: a month is the plan's price, a year is twelve of its per-month price when
// billed by the year. 0 where the catalog sells no such term (app lib/api/read.ts `charge`).
export const charge = (slug, every) => {
  const p = LIVE.plans[slug];
  const n = every === 'month' ? p?.price : p?.priceAnnual != null ? Math.round(p.priceAnnual * 1200) / 100 : 0;
  return n > 0 ? n : 0;
};

// The plans the API tab sells, which the catalog does not hold: they are named here, as the app names them.
const API = { 'api-payg': 'Pay as you go', 'api-enterprise': 'Volume & Dedicated' };

// A plan as the analytics tags name it (app components/pricing/Plans.tsx `item`): the catalog slug, its name, the tab it
// stands on ('individual', 'team' or 'api') and what the term charges.
export const planItem = (slug, every, tab) => ({ item_id: slug, item_name: LIVE.plans[slug]?.name ?? API[slug], item_category: tab, price: charge(slug, every) });
