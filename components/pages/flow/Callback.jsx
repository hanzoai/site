'use client';
/* /auth/callback: where hanzo.id returns people after Google or email. Zack's ask: it showed "unmatched", a dead end.
   Now: a calm waiting state, then the next step. The next step comes from OAuth's state (lib/handoff.js packState):
   a chosen paid plan goes to its checkout (/pay/confirm/card?plan=…), a new account to /onboarding, a log in to where
   it was going (default /chat). Only paths on this site are followed (safeNext). If hanzo.id returns an error, the
   page says so plainly and offers to try again.
   The code is not exchanged here (this site holds no secrets): AUTH_COMPLETE_URL in lib/handoff.js is where Hanzo's
   app finishes sign-in; while it is unset, people go straight to their next step.
   New lines: Signing you in…, Taking you to, We couldn't sign you in, Try again, Continue now. Listed in the PR.
   Motion: Hanzo's mark in a slowly breathing ring of halftone; reduced motion holds it still. */
import { useEffect, useState } from 'react';
import { Cta, A } from '../../kit';
import { Stage, Waiting } from './Flow';
import { planId } from '../../../lib/plans';
import { unpackState, safeNext, AUTH_COMPLETE_URL, SITE, DEFAULT_RETURN } from '../../../lib/handoff';

const NAMES = { '/onboarding': 'onboarding', '/chat': 'Hanzo Chat', '/pay/confirm/card': 'checkout' };

export default function Callback() {
  const [s, setS] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('error')) { setS({ error: q.get('error_description') || q.get('error') }); return; }
    const st = unpackState(q.get('state') || '') || {};
    const plan = planId(st.plan);
    const next = plan && plan !== 'free'
      ? `/pay/confirm/card?plan=${plan}&returnUrl=${encodeURIComponent(DEFAULT_RETURN)}`
      : st.signup ? safeNext(st.next, '/onboarding') : safeNext(st.next, '/chat');
    // the app finishes sign-in when Hanzo sets AUTH_COMPLETE_URL; it receives the code, the state and the next step
    const go = AUTH_COMPLETE_URL && q.get('code')
      ? AUTH_COMPLETE_URL + '?' + new URLSearchParams({ code: q.get('code'), state: q.get('state') || '', next: SITE + next }).toString()
      : next;
    setS({ next, go });
    const t = setTimeout(() => location.replace(go), 1400);
    return () => clearTimeout(t);
  }, []);

  if (s?.error) {
    return (
      <Stage className="fl-cb" label="Sign in" lit="center">
        <div className="fl-solo center">
          <h1 className="fl-h2">We couldn’t sign you in</h1>
          <p className="fl-lede">{s.error}</p>
          <Cta to="/login" kind="solid" size="lg" id="callback.retry" className="fl-pay">Try again</Cta>
          <p className="fl-switch">New to Hanzo? <A to="/signup">Create an account</A></p>
        </div>
      </Stage>
    );
  }
  const where = s ? NAMES[s.next.split('?')[0]] || s.next.split('?')[0] : null;
  return (
    <Stage className="fl-cb" label="Signing you in" lit="center">
      <div className="fl-solo center">
        <Waiting label="Signing you in…" />
        <p className="fl-back" aria-live="polite">{where ? <>Taking you to <b>{where}</b></> : ' '}</p>
        <p className="fl-alt">{s ? <a href={s.go}>Continue now</a> : ' '}</p>
      </div>
    </Stage>
  );
}
