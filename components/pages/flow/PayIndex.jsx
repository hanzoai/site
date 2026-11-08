'use client';
/* /pay: not a page of its own on live, a doorway. Zack's ask: send people on to /pricing or the cart.
   A link that names a plan (/pay?plan=go…) goes to the cart with every parameter kept; any other visit goes to /pricing.
   While it moves (well under a second), the page shows where it is going and both doors, so it is never a dead end.
   New lines: Taking you to plans, Taking you to your cart, See plans, Go to cart. Listed in the PR. */
import { useEffect, useState } from 'react';
import { Cta } from '../../kit';
import { Stage, Waiting } from './Flow';
import { planId } from '../../../lib/plans';

export default function PayIndex() {
  const [to, setTo] = useState(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const id = planId(q.get('plan'));
    if (id) q.set('plan', id);
    const t = id ? '/pay/cart/?' + q.toString() : '/pricing/';
    setTo(t);
    const k = setTimeout(() => location.replace(t), 600);
    return () => clearTimeout(k);
  }, []);
  const cart = to?.startsWith('/pay/cart');
  return (
    <Stage className="fl-cb" label="Pay" lit="center">
      <div className="fl-solo center">
        <Waiting label={cart ? 'Taking you to your cart' : 'Taking you to plans'} />
        <div className="fl-row">
          <Cta to="/pricing" kind={cart ? 'quiet' : 'solid'} id="pay.pricing">See plans</Cta>
          {cart && <Cta to={to} kind="solid" id="pay.cart">Go to cart</Cta>}
        </div>
      </div>
    </Stage>
  );
}
