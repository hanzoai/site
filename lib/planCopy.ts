/* What each plan includes, read directly from commerce.hanzo.ai via lib/plans.ts so checkout, sign-up and onboarding
   pages always reflect the live Plan Authority without duplicated copy. */
import { PLANS, SEATS } from './plans.ts';

export const COPY = {
  free: { d: PLANS.free.description, word: 'No card needed', note: 'Instant access · Free forever', items: PLANS.free.features.slice(0, 4) },
  go: { d: PLANS.go.description, head: PLANS.go.head || 'Everything in Free, plus:', items: PLANS.go.features.slice(0, 4) },
  pro: { x: '3x', d: PLANS.pro.description, head: PLANS.pro.head || 'Everything in Go, plus:', items: PLANS.pro.features.slice(0, 4) },
  dev: { x: '5x', d: PLANS.dev.description, head: PLANS.dev.head || 'Everything in Pro, plus:', items: PLANS.dev.features.slice(0, 4) },
  max: { x: '15x', d: PLANS.max.description, head: PLANS.max.head || 'Everything in Dev, plus:', items: PLANS.max.features.slice(0, 4) },
  ultra: { x: '∞', d: PLANS.ultra.description, head: PLANS.ultra.head || 'Everything in Max, plus:', items: PLANS.ultra.features.slice(0, 4) },
  team: { d: SEATS.standard.description, items: SEATS.standard.features.slice(0, 4) },
};
// Hanzo's own billing notes (/pricing)
export const NOTE = { paid: 'No commitment · Cancel anytime', monthly: 'Billed monthly', team: 'Standard & Premium seats · From 2 members' };
