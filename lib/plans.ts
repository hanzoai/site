/* Hanzo's plans, as GET https://commerce.hanzo.ai/v1/billing/plans states them: content/live/_pricing.json, which
   scripts/live.ts writes before every build and which lib/useCommercePricing.ts refreshes live on page load. No price is
   typed here; change a plan in admin.hanzo.ai (commerce) and commerce.hanzo.ai serves it immediately. Per-token model
   rates are models, not plans — managed under admin.hanzo.ai/models and served from commerce.hanzo.ai/v1/models & /v1/pricing/models. */

import LIVE from '../content/live/_pricing.json' with { type: 'json' };
import { APP } from './app.ts';
import type { Plan } from './liveSources.ts';

export const SITE = 'https://hanzo.ai';

// The snapshot's plans by slug; the JSON import types each slug as its own object.
const SNAP = LIVE.plans as Record<string, Plan>;

/** The two terms a plan is sold by. */
export type Term = 'month' | 'year';

/** A personal plan as the cards and the usage slider state it. */
export interface Personal {
  name: string;
  price: number;
  id: string;
  bots: number;
  description: string;
  head: string;
  features: string[];
  rawFeatures: string[];
  products: string[];
  hasBot: boolean;
  hasTeam: boolean;
  hasEngine: boolean;
  popular: boolean;
  earlyAccess: boolean;
}
/** A rung of the usage ladder: a personal plan and its multiple of Go ('3x', '∞'). */
export interface Rung extends Personal { x: string }
/** A seat plan (Team, Team Premium). */
export interface Seat {
  name: string;
  description: string;
  features: string[];
  month: number;
  monthAnnual: number;
  year: number;
  min: number;
  max: number;
  hasBot: boolean;
  hasTeam: boolean;
}

// Whole dollars as a page writes them: $8, $4,999.
export const usd = (n: number) => '$' + n.toLocaleString('en-US');

// Strip a leading "Everything in X, plus:" inheritance header from a backend plan's feature list when the UI renders `head` separately.
export function splitPlanFeatures(features: string[] = [], fallbackHead = '') {
  const list = Array.isArray(features) ? features.filter(Boolean) : [];
  if (list.length > 0 && (/^Everything in .+, plus:?$/i.test(list[0]) || /^All .+ features, plus:?$/i.test(list[0]))) {
    return { head: list[0], items: list.slice(1) };
  }
  return { head: fallbackHead, items: list };
}

export function derivePlans(rawPlans: Record<string, Plan> = SNAP) {
  const plan = (slug: string) => {
    const p = rawPlans[slug] ?? SNAP[slug];
    if (!p) throw new Error(`plan ${slug} is not in ${LIVE.source}`);
    return p;
  };

  const personal = (slug: string, fallbackHead = ''): Personal => {
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
      hasBot: products.includes('bot') || (p.bots ?? 0) !== 0, // -1 is as many as you like, a count is that many
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
    // the two rungs above Ultra stand only where the catalog read lists them (null otherwise), never from the snapshot
    // under a live read that lacks them: the slider never offers a rung that cannot be bought
    ultimate: rawPlans.ultimate ? personal('ultimate', 'Everything in Ultra, plus:') : null,
    unlimited: rawPlans.unlimited ? personal('unlimited', 'Everything in Ultimate, plus:') : null,
  };

  // The usage ladder above Go, lowest first: the plan cards' slider stops at each rung the catalog sells, each named by
  // its multiple of Go as its own lines state it ("15x more usage than Go", "25x higher limits …"); a rung whose lines
  // lift every cap is ∞. A rung that states neither stops the build (and a live read that does keeps the page on its
  // snapshot), so a stop never claims what its plan does not.
  const times = (p: Personal) => {
    const n = p.features.map((f) => /^(\d+)x\b/i.exec(f)?.[1]).find(Boolean);
    if (n) return n + 'x';
    if (p.features.some((f) => /\bno usage caps\b|\bunlimited usage\b/i.test(f))) return '∞';
    throw new Error(`plan ${p.id} states no multiple of Go's usage`);
  };
  const rungs: Rung[] = [plans.pro, plans.dev, plans.max, plans.ultra, plans.ultimate, plans.unlimited].filter((p): p is Personal => p != null).map((p) => ({ ...p, x: times(p) }));

  const paidPersonal = Object.values(plans).filter((p): p is Personal => p != null && p.price > 0);
  const withBot = paidPersonal.filter((p) => p.hasBot);
  const withTeam = paidPersonal.filter((p) => p.hasTeam);
  const minPrice = (arr: Personal[], fallback: number) => (arr.length ? Math.min(...arr.map((p) => p.price)) : fallback);

  const floor = {
    paid: minPrice(paidPersonal, plans.go.price),
    bot: minPrice(withBot, plans.go.price),
    team: minPrice(withTeam, plans.pro.price),
  };

  // a seat plan is sold by the year as well as the month, with a seat floor and ceiling
  const seat = (slug: string): Seat => {
    const p = plan(slug);
    return {
      name: p.name,
      description: p.description ?? '',
      features: splitPlanFeatures(p.features, '').items.filter((f) => !/per member a month/i.test(f)),
      month: p.price,
      monthAnnual: p.priceAnnual!,
      year: p.priceAnnual! * 12,
      min: p.minSeats!,
      max: p.maxMembers!,
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
      monthAnnual: ent.priceAnnual!,
      min: ent.minSeats!,
    },
    saving: Math.round((1 - plan('team').priceAnnual! / plan('team').price) * 100),
  };

  return { plans, rungs, floor, seats };
}

/** What derivePlans works out of a catalog. */
export type Derived = ReturnType<typeof derivePlans>;

const DERIVED = derivePlans(LIVE.plans);

export const PLANS = DERIVED.plans;
export const RUNGS = DERIVED.rungs;
export const FLOOR = DERIVED.floor;
export const SEATS = DERIVED.seats;

// Partners (/enterprise): the White-label plan, and the agency plans, which start at the cheapest of them.
const agency = Object.values(SNAP).filter((p) => p.category === 'agency');
export const PARTNERS = { label: SNAP['white-label'], agency: { names: agency.map((p) => p.name), from: Math.min(...agency.map((p) => p.price)) } };

// What /pricing's schema.org OfferCatalog states for a plan, by plan name (components/JsonLd.jsx): a month's price and,
// where the catalog sells one, a year's. Enterprise is sold by the year only, so its month is the year spread over twelve.
const spec = (price: number | null, billingDuration: string, unitText: string) => ({ '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', billingDuration, unitText });
export const OFFERS = Object.fromEntries(Object.values(SNAP).filter((p) => p.category !== 'agency' && p.category !== 'white-label').map((p) => {
  const unit = p.perSeat ? 'per member per ' : 'per ';
  const year = p.priceAnnual == null ? [] : [spec(Math.round(p.priceAnnual * 1200) / 100, 'P1Y', unit + 'year')];
  const month = p.interval === 'year' ? spec(p.priceAnnual, 'P1M', unit + 'month, billed yearly') : spec(p.price, 'P1M', unit + 'month');
  return [p.name, { price: month.price, priceSpecification: [month, ...year] }];
}));

const back = (page: string) => encodeURIComponent(`${APP}/${page}`);

// card checkout for a plan id on hanzo.ai/pay; `page` is where the buyer lands afterwards (hanzo.app/<page>)
export const checkout = (id: string, page = 'chat') => `/pay/confirm/card?plan=${id}&returnUrl=${back(page)}`;
// the same, as a full URL
export const checkoutAbs = (id: string, page = 'chat') => SITE + checkout(id, page);
// Team card checkout (/pricing's Team card): from the plan's minimum seats, yearly or monthly
export const teamCheckout = (annual: boolean, quantity = SEATS.standard.min, page = 'chat') => `/pay/confirm/card?plan=team${annual ? '&interval=year' : ''}&quantity=${quantity}&returnUrl=${back(page)}`;
// Team cart with a seat count (the buying specialist's quote)
export const teamCart = (quantity: number) => `/pay/cart?plan=team&interval=year&quantity=${quantity}`;

// What one term of a plan charges, in dollars: a month is the plan's price, a year is twelve of its per-month price when
// billed by the year. 0 where the catalog sells no such term (app lib/api/read.ts `charge`).
export const charge = (slug: string, every: Term, rawPlans: Record<string, Plan> = SNAP) => {
  const p = rawPlans[slug] ?? SNAP[slug];
  const n = every === 'month' ? p?.price : p?.priceAnnual != null ? Math.round(p.priceAnnual * 1200) / 100 : 0;
  return n > 0 ? n : 0;
};

// The plans the API tab sells, which the catalog does not hold: they are named here, as the app names them.
const API: Record<string, string> = { 'api-payg': 'Pay as you go', 'api-enterprise': 'Volume & Dedicated' };

// A plan as the analytics tags name it (app components/pricing/Plans.tsx `item`): the catalog slug, its name, the tab it
// stands on ('individual', 'team' or 'api') and what the term charges.
export const planItem = (slug: string, every: Term, tab: string) => ({ item_id: slug, item_name: SNAP[slug]?.name ?? API[slug], item_category: tab, price: charge(slug, every) });
