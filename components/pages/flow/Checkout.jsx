'use client';
/* /pay/confirm/card and /pay/cart: the moment before the card.
   Persona: someone who has picked a plan (from /pricing, the home page, /chat, /dev, the buying specialist).
   Goal: see exactly what they are buying and what it costs, then pay. One primary action: "Continue to card payment".
   Zack's ask (GA, 10 Oct to 6 Nov): /pay/confirm/card had 233 views, 20 started checkout, 13 entered a card, 7 paid, and
   the Go and Pro buttons landed on "Cannot show this plan." Here every plan id a link carries resolves to a real plan
   (lib/plans.js resolvePlan: go, pro-2x, dev-5x, max-10x, ultra, team; plan names like plan=pro too), and a link with
   no plan, or one this site does not know, opens a plan picker instead of a dead end. /pay/cart (363 views, 13 seconds)
   is one card: the line, a card-only total, one button.
   Safety: no card field on this site. The button hands off to Hanzo's real card form (lib/handoff.js CARD_FORM_URL)
   with live's own parameters (plan, returnUrl; interval and quantity for Team).
   Copy: plan names, prices, descriptions and included lines are Hanzo's (/pricing, lib/plans.js, lib/planCopy.js). New
   lines (Zack's ask): Your plan, Change plan, Total today, Continue to card payment, Card only, the secure-checkout line,
   Returns you to, Your cart, seats. Listed in the PR.
   Motion: the total rolls between real prices (Odometer) when the plan or seat count changes; nothing else moves. */
import { useMemo } from 'react';
import { Cta, A } from '../../kit';
import Odometer from '../../v2/Odometer';
import { Stage, useQuery, setQuery, money, Lines, Lock, Card } from './Flow';
import { PERSONAL, resolvePlan } from '../../../lib/plans';
import { COPY, NOTE } from '../../../lib/planCopy';
import { cardFormUrl, safeReturn } from '../../../lib/handoff';

const host = (u) => { try { const x = new URL(u); return x.host + (x.pathname === '/' ? '' : x.pathname.replace(/\/$/, '')); } catch { return 'hanzo.ai'; } };

// the plan, the total and the hand-off, from the query
function useOrder(q) {
  return useMemo(() => {
    if (!q) return null;
    const plan = resolvePlan(q.plan, { interval: q.interval, quantity: q.quantity });
    const back = safeReturn(q.returnUrl);
    return { plan, back, to: plan && !plan.free ? cardFormUrl({ plan: plan.id, interval: plan.seats && plan.interval === 'year' ? 'year' : undefined, quantity: plan.seats ? plan.quantity : undefined, returnUrl: back }) : '/signup' };
  }, [q]);
}

const per = (p) => (p.seats ? (p.interval === 'year' ? 'USD/year' : 'USD/month') : 'USD/month');

/* the plan rail: the five personal plans, the chosen one lit (role=radiogroup, arrow keys) */
function PlanRail({ current, q }) {
  const pick = (id) => setQuery({ ...q, plan: id, interval: undefined, quantity: undefined });
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const i = Math.max(0, PERSONAL.findIndex((p) => p.id === current));
    const n = PERSONAL[(i + k + PERSONAL.length) % PERSONAL.length];
    pick(n.id);
    requestAnimationFrame(() => document.getElementById('fl-rail-' + n.id)?.focus());
  };
  return (
    <div className="fl-rail" role="radiogroup" aria-label="Change plan" onKeyDown={keys}>
      {PERSONAL.map((p) => (
        <button key={p.id} id={'fl-rail-' + p.id} type="button" role="radio" aria-checked={p.id === current} tabIndex={p.id === current || (!PERSONAL.some((x) => x.id === current) && p.key === 'go') ? 0 : -1} onClick={() => pick(p.id)}>
          <b>{p.name}</b><span className="x-tnum">{money(p.price)}</span>
        </button>
      ))}
    </div>
  );
}

/* Team: seats and billing, as /pricing sells them */
function Seats({ plan, q }) {
  const set = (o) => setQuery({ ...q, plan: plan.id, interval: plan.interval === 'year' ? 'year' : undefined, quantity: plan.quantity, ...o });
  return (
    <div className="fl-seats">
      <div className="fl-step" role="group" aria-label="Seats">
        <button type="button" aria-label="One seat fewer" disabled={plan.quantity <= 2} onClick={() => set({ quantity: plan.quantity - 1 })}>−</button>
        <output className="x-tnum" aria-live="polite">{plan.quantity} seats</output>
        <button type="button" aria-label="One seat more" disabled={plan.quantity >= 100} onClick={() => set({ quantity: plan.quantity + 1 })}>+</button>
      </div>
      <div className="fl-bill" role="radiogroup" aria-label="Billing">
        {[['year', 'Annual'], ['month', 'Monthly']].map(([v, t]) => (
          <button key={v} type="button" role="radio" aria-checked={plan.interval === v} onClick={() => set({ interval: v === 'year' ? 'year' : undefined })}>{t}</button>
        ))}
      </div>
    </div>
  );
}

/* the order card: what you pay, one button, why it is safe */
function Order({ o, cart }) {
  const p = o.plan;
  const unitLine = p.seats ? `${p.quantity} seats × ${money(p.unit)}` : NOTE.monthly;
  return (
    <section className="fl-order" aria-labelledby="fl-total-l">
      <div className="fl-order-row">
        <span className="fl-order-n">{p.name}{p.seats && <small> · {p.interval === 'year' ? 'Annual' : 'Monthly'}</small>}</span>
        <span className="x-tnum">{money(p.total)}</span>
      </div>
      <div className="fl-order-row soft"><span>{unitLine}</span><span>{per(p)}</span></div>
      <div className="fl-order-total">
        <span id="fl-total-l">Total today</span>
        <span className="fl-total"><Odometer value={money(p.total)} /><small>{per(p)}</small></span>
      </div>
      <Cta to={o.to} kind="solid" size="lg" id={(cart ? 'cart' : 'checkout') + '.pay.' + p.id} thumb className="fl-pay">Continue to card payment</Cta>
      <ul className="fl-trust">
        <li><Card />Card only</li>
        <li><Lock />You’ll enter your card on Hanzo’s secure checkout, never on this page.</li>
        <li><span className="fl-dot" aria-hidden="true" />{NOTE.paid}</li>
      </ul>
      <p className="fl-back">Returns you to <b>{host(o.back)}</b></p>
    </section>
  );
}

/* no plan, or one this site does not know: pick one here (never "Cannot show this plan") */
function Pick({ q }) {
  return (
    <div className="fl-pick">
      <p className="fl-kick">Your plan</p>
      <h1 className="fl-h1">Choose a plan</h1>
      <p className="fl-lede">{NOTE.paid}</p>
      <PlanRail current={null} q={q || {}} />
      <p className="fl-alt"><A to="/pricing">Compare plans</A></p>
    </div>
  );
}

export default function Checkout({ cart = false }) {
  const q = useQuery();
  const o = useOrder(q);

  if (!o) return <Stage className="fl-co is-loading" label="Checkout"><div className="fl-co-grid"><div className="x-skel fl-skel-a" /><div className="x-skel fl-skel-b" /></div></Stage>;
  if (!o.plan || o.plan.free) {
    if (o.plan?.free) return <Stage className="fl-co" label="Checkout"><div className="fl-solo"><p className="fl-kick">Your plan</p><h1 className="fl-h1">Free</h1><p className="fl-lede">{COPY.free.d}</p><Lines items={COPY.free.items} /><Cta to="/signup" kind="solid" size="lg" id="checkout.free" className="fl-pay">Try Hanzo</Cta><p className="fl-back">{COPY.free.note}</p></div></Stage>;
    return <Stage className="fl-co" label="Checkout"><Pick q={q} /></Stage>;
  }
  const p = o.plan, c = COPY[p.key];

  if (cart) {
    return (
      <Stage className="fl-co fl-cart" label="Cart" lit="center">
        <div className="fl-cart-card">
          <header className="fl-cart-h"><h1 className="fl-h2">Your cart</h1><A to="/pricing" className="fl-link">Change plan</A></header>
          <div className="fl-cart-line">
            <div><b>{p.name}</b>{c.x && <span className="fl-x">{c.x}</span>}<p>{c.d}</p></div>
          </div>
          {p.seats && <Seats plan={p} q={q} />}
          <Order o={o} cart />
        </div>
      </Stage>
    );
  }

  return (
    <Stage className="fl-co" label="Checkout">
      <div className="fl-co-grid">
        <div className="fl-plan">
          <p className="fl-kick">Your plan</p>
          <h1 className="fl-h1">{p.name}{c.x && <span className="fl-x big">{c.x}</span>}</h1>
          <p className="fl-lede">{c.d}</p>
          <Lines head={c.head} items={c.items} />
          <div className="fl-change">
            <p className="fl-change-h">{p.seats ? NOTE.team : 'Change plan'}</p>
            {p.seats ? <Seats plan={p} q={q} /> : <PlanRail current={p.id} q={q} />}
          </div>
        </div>
        <Order o={o} />
      </div>
    </Stage>
  );
}
