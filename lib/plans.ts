/* Hanzo's plans, as GET https://commerce.hanzo.ai/v1/billing/plans states them: content/live/_pricing.json, which
   scripts/live.ts writes before every build and which lib/useCommercePricing.ts refreshes live on page load. No price is
   typed here; change a plan in admin.hanzo.ai (commerce) and commerce.hanzo.ai serves it immediately. Per-token model
   rates are models, not plans — managed under admin.hanzo.ai/models and served from commerce.hanzo.ai/v1/models & /v1/pricing/models. */

import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import { APP } from './app.ts';

export const SITE = 'https://hanzo.ai';

// Whole dollars as a page writes them: $8, $4,999.
export const usd = (n) => '$' + n.toLocaleString('en-US');

// Strip a leading "Everything in X, plus:" inheritance header from a backend plan's feature list when the UI renders `head` separately.
export function splitPlanFeatures(features = [], fallbackHead = '') {
  const list = Array.isArray(features) ? features.filter(Boolean) : [];
  if (list.length > 0 && (/^Everything in .+, plus:?$/i.test(list[0]) || /^All .+ features, plus:?$/i.test(list[0]))) {
    return { head: list[0], items: list.slice(1) };
  }
  return { head: fallbackHead, items: list };
}

export function derivePlans(rawPlans = LIVE.plans) {
  const plan = (slug) => {
    const p = rawPlans[slug] ?? LIVE.plans[slug];
    if (!p) throw new Error(`plan ${slug} is not in ${LIVE.source}`);
    return p;
  };

  const personal = (slug, fallbackHead = '') => {
    const p = plan(slug);
    const { head, items } = splitPlanFeatures(p.features, fallbackHead);
    const products = Array.isArray(p.products) ? p.products : [];
    return {
      name: p.name,
      price: p.price,
      id: slug,
      bots: p.bots ?? 0,
      description: p.description ?? '',
      head,
      features: items,
      rawFeatures: Array.isArray(p.features) ? p.features : [],
      products,
      hasBot: products.includes('bot') || p.bots === -1,
      hasTeam: products.includes('team'),
      hasEngine: products.includes('engine'),
      popular: !!p.popular,
      earlyAccess: !!p.earlyAccess,
    };
  };

  const freePlan = plan('free');
  const freeSplit = splitPlanFeatures(freePlan.features, '');
  const plans = {
    free: {
      name: freePlan.name,
      price: freePlan.price,
      id: 'free',
      bots: freePlan.bots ?? 0,
      description: freePlan.description ?? '',
      head: freeSplit.head,
      features: freeSplit.items,
      rawFeatures: Array.isArray(freePlan.features) ? freePlan.features : [],
      products: Array.isArray(freePlan.products) ? freePlan.products : [],
      hasBot: false,
      hasTeam: false,
      hasEngine: false,
      popular: false,
      earlyAccess: false,
    },
    go: personal('go', 'Everything in Free, plus:'),
    pro: personal('pro-3x', 'Everything in Go, plus:'),
    dev: personal('dev-5x', 'Everything in Pro, plus:'),
    max: personal('max-15x', 'Everything in Dev, plus:'),
    ultra: personal('ultra', 'Everything in Max, plus:'),
  };

  const paidPersonal = Object.values(plans).filter((p) => p.price > 0);
  const withBot = paidPersonal.filter((p) => p.hasBot);
  const withTeam = paidPersonal.filter((p) => p.hasTeam);
  const minPrice = (arr, fallback) => (arr.length ? Math.min(...arr.map((p) => p.price)) : fallback);

  const floor = {
    paid: minPrice(paidPersonal, plans.go.price),
    bot: minPrice(withBot, plans.go.price),
    team: minPrice(withTeam, plans.pro.price),
  };

  const seat = (slug) => {
    const p = plan(slug);
    return {
      name: p.name,
      description: p.description ?? '',
      features: splitPlanFeatures(p.features, '').items.filter((f) => !/per member a month/i.test(f)),
      month: p.price,
      monthAnnual: p.priceAnnual,
      year: p.priceAnnual * 12,
      min: p.minSeats,
      max: p.maxMembers,
      hasBot: (p.products ?? []).includes('bot') || p.bots === -1,
      hasTeam: (p.products ?? []).includes('team'),
    };
  };

  const ent = plan('enterprise');
  const entSplit = splitPlanFeatures(ent.features, 'All Team plan features, plus:');
  const seats = {
    standard: seat('team'),
    premium: seat('team-premium'),
    enterprise: {
      name: ent.name,
      description: ent.description ?? '',
      head: entSplit.head || 'All Team plan features, plus:',
      features: entSplit.items.filter((f) => !/billed annually|minimum/i.test(f)),
      year: ent.price,
      monthAnnual: ent.priceAnnual,
      min: ent.minSeats,
    },
    saving: Math.round((1 - plan('team').priceAnnual / plan('team').price) * 100),
  };

  return { plans, floor, seats };
}

const DERIVED = derivePlans(LIVE.plans);

export const PLANS = DERIVED.plans;
export const FLOOR = DERIVED.floor;
export const SEATS = DERIVED.seats;

// Partners (/enterprise): the White-label plan, and the agency plans, which start at the cheapest of them.
const agency = Object.values(LIVE.plans).filter((p) => p.category === 'agency');
export const PARTNERS = { label: LIVE.plans['white-label'], agency: { names: agency.map((p) => p.name), from: Math.min(...agency.map((p) => p.price)) } };

// What /pricing's schema.org OfferCatalog states for a plan, by plan name (components/JsonLd.jsx): a month's price and,
// where the catalog sells one, a year's. Enterprise is sold by the year only, so its month is the year spread over twelve.
const spec = (price, billingDuration, unitText) => ({ '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', billingDuration, unitText });
export const OFFERS = Object.fromEntries(Object.values(LIVE.plans).filter((p) => p.category !== 'agency' && p.category !== 'white-label').map((p) => {
  const unit = p.perSeat ? 'per member per ' : 'per ';
  const year = p.priceAnnual == null ? [] : [spec(Math.round(p.priceAnnual * 1200) / 100, 'P1Y', unit + 'year')];
  const month = p.interval === 'year' ? spec(p.priceAnnual, 'P1M', unit + 'month, billed yearly') : spec(p.price, 'P1M', unit + 'month');
  return [p.name, { price: month.price, priceSpecification: [month, ...year] }];
}));

const back = (page) => encodeURIComponent(`${APP}/${page}`);

// card checkout for a plan id on hanzo.ai/pay; `page` is where the buyer lands afterwards (hanzo.app/<page>)
export const checkout = (id, page = 'chat') => `/pay/confirm/card?plan=${id}&returnUrl=${back(page)}`;
// the same, as a full URL
export const checkoutAbs = (id, page = 'chat') => SITE + checkout(id, page);
// Team card checkout (/pricing's Team card): from the plan's minimum seats, yearly or monthly
export const teamCheckout = (annual, quantity = SEATS.standard.min, page = 'chat') => `/pay/confirm/card?plan=team${annual ? '&interval=year' : ''}&quantity=${quantity}&returnUrl=${back(page)}`;
// Team cart with a seat count (the buying specialist's quote)
export const teamCart = (quantity) => `/pay/cart?plan=team&interval=year&quantity=${quantity}`;

// What one term of a plan charges, in dollars: a month is the plan's price, a year is twelve of its per-month price when
// billed by the year. 0 where the catalog sells no such term (app lib/api/read.ts `charge`).
export const charge = (slug, every, rawPlans = LIVE.plans) => {
  const p = rawPlans[slug] ?? LIVE.plans[slug];
  const n = every === 'month' ? p?.price : p?.priceAnnual != null ? Math.round(p.priceAnnual * 1200) / 100 : 0;
  return n > 0 ? n : 0;
};

// The plans the API tab sells, which the catalog does not hold: they are named here, as the app names them.
const API = { 'api-payg': 'Pay as you go', 'api-enterprise': 'Volume & Dedicated' };

// A plan as the analytics tags name it (app components/pricing/Plans.tsx `item`): the catalog slug, its name, the tab it
// stands on ('individual', 'team' or 'api') and what the term charges.
export const planItem = (slug, every, tab) => ({ item_id: slug, item_name: LIVE.plans[slug]?.name ?? API[slug], item_category: tab, price: charge(slug, every) });
