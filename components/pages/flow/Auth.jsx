'use client';
/* /signup and /login: two doors, cleanly split, both opening onto Hanzo's own identity provider (hanzo.id, Hanzo IAM).
   Persona: someone ready to try Hanzo (sign up), or coming back to it (log in, from the header's Log in).
   Goal: one press to Google or to email on hanzo.id. Sign-up shows the plan chosen and its price beside the doors.
   Zack's ask: /signup held people 14 seconds; /login must be split from sign-up, and the header's Log in must work.
   Safety: no email, password or code field on this site. Both buttons are links to hanzo.id (lib/handoff.js iamUrl),
   which returns to /auth/callback with the next step (and the plan) carried in OAuth's state.
   Copy: the plan lines and prices are Hanzo's (/pricing); "Chat, Dev and Studio" and "API keys, usage and billing" are
   the header's own Log in lines. New lines: the two headings, Continue with Google, Continue with email, the switch
   lines (New to Hanzo? / Already have an account?), the terms line, Your plan, Change. Listed in the PR.
   Motion: none beyond the buttons' own press; this is a door, it should hold still. */
import { Cta, A } from '../../kit';
import { Stage, useQuery, money, Lines, Brand, GoogleG, Mail } from './Flow';
import { resolvePlan } from '../../../lib/plans';
import { COPY, NOTE } from '../../../lib/planCopy';
import { iamUrl, safeNext, PLATFORM_URL } from '../../../lib/handoff';

function PlanPanel({ plan, q }) {
  const p = plan && !plan.free ? plan : null;
  const c = p ? COPY[p.key] : COPY.free;
  return (
    <aside className="fl-side" aria-label="Your plan">
      <div className="fl-side-top">
        <p className="fl-kick">Your plan</p>
        <A to={'/pricing'} className="fl-link">Change</A>
      </div>
      <p className="fl-side-name">{p ? p.name : 'Free'}{c.x && <span className="fl-x">{c.x}</span>}</p>
      <p className="fl-side-price">
        {p ? <><span className="x-tnum">{money(p.total)}</span><small>{p.seats ? (p.interval === 'year' ? 'USD/year' : 'USD/month') : 'USD/month'}</small></> : <span className="word">{COPY.free.word}</span>}
      </p>
      <p className="fl-side-note">{p ? (p.seats ? `${p.quantity} seats · ${p.interval === 'year' ? 'Annual' : 'Monthly'}` : NOTE.monthly + ' · ' + NOTE.paid) : COPY.free.note}</p>
      <p className="fl-side-d">{c.d}</p>
      <Lines head={c.head} items={c.items} />
    </aside>
  );
}

function Doors({ signup, next, plan }) {
  return (
    <div className="fl-doors">
      <Cta to={iamUrl({ google: true, signup, next, plan })} kind="solid" size="lg" id={(signup ? 'signup' : 'login') + '.google'} thumb className="fl-door"><GoogleG /><span>Continue with Google</span></Cta>
      <Cta to={iamUrl({ signup, next, plan })} kind="quiet" size="lg" id={(signup ? 'signup' : 'login') + '.email'} className="fl-door"><Mail /><span>Continue with email</span></Cta>
    </div>
  );
}

export default function Auth({ signup = false }) {
  const q = useQuery() || {};
  const plan = resolvePlan(q.plan, { interval: q.interval, quantity: q.quantity });
  // after sign-up: a paid plan goes to its checkout, otherwise onboarding; after log in: where they were going
  const next = signup ? safeNext(q.next, '') : safeNext(q.next, '/chat');
  const keep = (path) => path + (q.next || q.plan ? '?' + new URLSearchParams(Object.entries({ next: q.next, plan: q.plan }).filter(([, v]) => v)).toString() : '');

  return (
    <Stage className={'fl-auth ' + (signup ? 'is-signup' : 'is-login')} label={signup ? 'Sign up' : 'Log in'} lit={signup ? 'right' : 'left'}>
      <div className="fl-auth-grid">
        <section className="fl-auth-main" aria-labelledby="fl-auth-h">
          <Brand />
          <h1 id="fl-auth-h" className="fl-h1 auth">{signup ? 'Create your Hanzo account' : 'Log in to Hanzo'}</h1>
          <Doors signup={signup} next={next} plan={plan && !plan.free ? plan.id : ''} />
          <p className="fl-switch">
            {signup ? <>Already have an account? <A to={keep('/login')}>Log in</A></> : <>New to Hanzo? <A to={keep('/signup')}>Create an account</A></>}
          </p>
          <p className="fl-terms">By continuing, you agree to Hanzo’s <A to="/legal/terms">Terms</A> and <A to="/legal/privacy">Privacy Policy</A>.</p>
        </section>
        {signup ? <PlanPanel plan={plan} q={q} /> : (
          <aside className="fl-side" aria-label="Log in">
            <p className="fl-kick">Log in</p>
            <ul className="fl-dest">
              <li className="on"><b>Hanzo</b><span>Chat, Dev and Studio</span></li>
              <li><A to={PLATFORM_URL}><b>API Platform</b><span>API keys, usage and billing</span></A></li>
            </ul>
          </aside>
        )}
      </div>
    </Stage>
  );
}
