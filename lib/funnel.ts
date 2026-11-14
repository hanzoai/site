/* The plan funnel's moments, as hanzo-inc/app's Plans.tsx states them, for every plan card on the site (the home's and
   /pricing's). Each goes out through lib/track.js: our stream and the browser tags under one event_id. */
import { PLANS, RUNGS, planItem, charge } from './plans';
import type { Term } from './plans';
import { track } from './track';

/** The catalog slug of each rung of Personal's usage ladder the catalog sells (Pro 3x, Dev 5x, Max 15x, Ultra 25x, and
    Ultimate 50x and Unlimited ∞ once listed), and the plans each tab offers: Personal's are Free, Go and every rung. */
export const RUNG = RUNGS.map((p) => p.id);
export const LIST: Record<string, string[]> = { individual: ['free', PLANS.go.id, ...RUNG], team: ['team', 'enterprise'], api: ['api-payg', 'api-enterprise'] };

/** A tab's plans were shown: once per tab a reader looks at, with the prices it shows. */
export const viewed = (tab: string, slugs: string[]) => track('pricing_viewed', { currency: 'USD', item_list_id: tab, items: slugs.map((s) => planItem(s, 'month', tab)) });

/** A plan's way in was pressed. A plan sold by card ('card') also picks the plan and starts its checkout. */
export function chose({ slug, every = 'month', cta, tab, how }: { slug: string; every?: Term; cta?: string; tab: string; how?: string }) {
  const items = [planItem(slug, every, tab)];
  track('plan_clicked', { plan: slug, interval: every, cta, item_list_id: tab, items });
  if (how !== 'card') return;
  const value = charge(slug, every);
  track('plan_selected', { currency: 'USD', value, items });
  track('checkout_started', { currency: 'USD', value, interval: every, items });
}

/** The chat with the buying specialist, on a plan priced with our team. */
export const asked = (slug: string, tab: string, cta?: string) => track('plan_clicked', { plan: slug, cta, item_list_id: tab });

/** The usage ladder moved to another plan. */
export const picked = (slug: string, tab: string) => track('plan_tier_picked', { plan: slug, item_list_id: tab });

/** The term moved between the month and the year. */
export const termed = (slug: string, year: boolean, tab: string) => track('plan_term_changed', { plan: slug, interval: year ? 'year' : 'month', item_list_id: tab });
