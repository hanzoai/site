/* A course's way in, as hanzo-inc/app states it (app/(marketing)/university/seat.tsx). Where the catalog sells the course
   (a row under its planId in GET /v1/billing/plans, as lib/plans.js reads it: content/live/_pricing.json) the tuition is
   that row's price and Enroll opens the card step of pay on hanzo.app, coming back to the course's page here. Where it
   does not, the way in is a request for a seat at sales. A course the catalog starts selling draws its price and its
   Enroll with no change to the pages. No tuition is typed. */
import LIVE from '../../content/live/_pricing.json' with { type: 'json' };
import { SITE } from '../../lib/plans';

/* where a seat is asked for while the catalog sells the course none */
export const ASK = '/contact-sales';

const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });

/* the seat the catalog sells under planId, paid for and back at `back` (a hanzo.ai path), or null while it sells none */
export interface Seat {
  price: string;
  credit: string;
  href: string;
}

const PLANS: Record<string, { price: number } | undefined> = LIVE.plans;

export function seatFor(planId: string, back: string): Seat | null {
  const row = PLANS[planId];
  if (!row || !(row.price > 0)) return null;
  return {
    price: money(row.price),
    // a quarter of the tuition, rounded up to the dollar: the rebate these pages state
    credit: money(Math.ceil(row.price / 4)),
    href: `/pay/confirm/card?plan=${planId}&returnUrl=${encodeURIComponent(SITE + back)}`,
  };
}
