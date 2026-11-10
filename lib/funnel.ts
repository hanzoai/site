/* The plan funnel's moments, as hanzo-inc/app's Plans.tsx states them, for every plan card on the site (the home's and
   /pricing's). Each goes out through lib/track.js: our stream and the browser tags under one event_id. */
import { PLANS, planItem, charge } from './plans';
import { track } from './track';

/** The catalog slug of each rung of Personal's usage ladder (3x, 5x, 15x, 25x), and the plans each tab shows. */
export const RUNG = [PLANS.pro.id, PLANS.dev.id, PLANS.max.id, PLANS.ultra.id];
export const LIST = { individual: ['free', PLANS.go.id, PLANS.pro.id], team: ['team', 'enterprise'], api: ['api-payg', 'api-enterprise'] };

/** A tab's plans were shown: once per tab a reader looks at, with the prices it shows. */
export const viewed = (tab, slugs) => track('pricing_viewed', { currency: 'USD', item_list_id: tab, items: slugs.map((s) => planItem(s, 'month', tab)) });

/** A plan's way in was pressed. A plan sold by card ('card') also picks the plan and starts its checkout. */
export function chose({ slug, every = 'month', cta, tab, how }) {
  const items = [planItem(slug, every, tab)];
  track('plan_clicked', { plan: slug, interval: every, cta, item_list_id: tab, items });
  if (how !== 'card') return;
  const value = charge(slug, every);
  track('plan_selected', { currency: 'USD', value, items });
  track('checkout_started', { currency: 'USD', value, interval: every, items });
}

/** The chat with the buying specialist, on a plan priced with our team. */
export const asked = (slug, tab, cta) => track('plan_clicked', { plan: slug, cta, item_list_id: tab });

/** The usage ladder moved to another plan. */
export const picked = (slug, tab) => track('plan_tier_picked', { plan: slug, item_list_id: tab });

/** The term moved between the month and the year. */
export const termed = (slug, year, tab) => track('plan_term_changed', { plan: slug, interval: year ? 'year' : 'month', item_list_id: tab });
