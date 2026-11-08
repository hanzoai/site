'use client';
/* /onboarding: the first minute after sign-up. Zack's ask: add a pick-a-plan step.
   Two steps in one frame: what you will use first (Chat, Dev, Studio, API), then the plan, every rung from Free to
   Ultra with Hanzo's price. A paid plan continues to its checkout (/pay/confirm/card?plan=<live id>), returning to what
   you chose to use first; Free goes straight in. A plan in the link (?plan=pro-2x) arrives already chosen.
   Copy: plan names, prices and the 3x / 5x / 15x / ∞ rungs are Hanzo's (/pricing). New lines: Welcome to Hanzo, What
   will you use first?, Pick a plan, Step 1 of 2 / Step 2 of 2, Back, Skip, Continue, Continue to checkout, Start free.
   Listed in the PR.
   Motion: the steps slide forward and back (240 ms); the chosen plan's price rolls into the button (Odometer). */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cta } from '../../kit';
import { EASE } from '../../ui';
import Odometer from '../../v2/Odometer';
import { Stage, useQuery, money, Brand } from './Flow';
import { PLANS, PERSONAL, checkout, planId } from '../../../lib/plans';
import { COPY } from '../../../lib/planCopy';

const USE = [
  { k: 'chat', t: 'Chat', back: 'chat' },
  { k: 'dev', t: 'Dev', back: 'dev' },
  { k: 'studio', t: 'Studio', back: 'studio' },
  { k: 'api', t: 'API', back: 'api' },
];
const RUNGS = [{ id: 'free', key: 'free', name: PLANS.free.name, price: 0 }, ...PERSONAL];

export default function Onboarding() {
  const q = useQuery();
  const [step, setStep] = useState(0);
  const [use, setUse] = useState('chat');
  const [plan, setPlan] = useState('pro-2x');
  const [dir, setDir] = useState(1);
  useEffect(() => {
    const id = planId(q?.plan);
    if (id && RUNGS.some((r) => r.id === id)) { setPlan(id); setStep(1); }
  }, [q]);

  const r = RUNGS.find((x) => x.id === plan);
  const u = USE.find((x) => x.k === use);
  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };
  const to = r.price ? checkout(r.id, u.back) : 'https://hanzo.ai/' + u.back;

  const pickKeys = (list, cur, set, id) => (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const i = list.findIndex((x) => x === cur);
    const n = list[(i + k + list.length) % list.length];
    set(n);
    requestAnimationFrame(() => document.getElementById(id + n)?.focus());
  };

  return (
    <Stage className="fl-ob" label="Onboarding" lit="right">
      <div className="fl-ob-card">
        <div className="fl-ob-top">
          <Brand />
          <span className="fl-ob-step x-tnum" aria-live="polite">Step {step + 1} of 2</span>
          <span className="fl-ob-bar" aria-hidden="true"><motion.span animate={{ scaleX: (step + 1) / 2 }} transition={{ duration: 0.4, ease: EASE }} /></span>
        </div>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          {step === 0 ? (
            <motion.section key="use" className="fl-ob-pane" custom={dir} initial={{ opacity: 0, x: 24 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 * dir }} transition={{ duration: 0.24, ease: EASE }} aria-labelledby="fl-ob-h0">
              <p className="fl-kick">Welcome to Hanzo</p>
              <h1 id="fl-ob-h0" className="fl-h2">What will you use first?</h1>
              <div className="fl-uses" role="radiogroup" aria-labelledby="fl-ob-h0" onKeyDown={pickKeys(USE.map((x) => x.k), use, setUse, 'fl-use-')}>
                {USE.map((x) => (
                  <button key={x.k} id={'fl-use-' + x.k} type="button" role="radio" aria-checked={use === x.k} tabIndex={use === x.k ? 0 : -1} onClick={() => setUse(x.k)}>
                    <b>{x.t}</b>
                  </button>
                ))}
              </div>
              <div className="fl-ob-foot">
                <button type="button" className="fl-text" onClick={() => go(1)}>Skip</button>
                <Cta onClick={() => go(1)} kind="solid" size="lg" id="onboarding.use">Continue</Cta>
              </div>
            </motion.section>
          ) : (
            <motion.section key="plan" className="fl-ob-pane" custom={dir} initial={{ opacity: 0, x: 24 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 * dir }} transition={{ duration: 0.24, ease: EASE }} aria-labelledby="fl-ob-h1">
              <p className="fl-kick">Welcome to Hanzo</p>
              <h1 id="fl-ob-h1" className="fl-h2">Pick a plan</h1>
              <div className="fl-rungs" role="radiogroup" aria-labelledby="fl-ob-h1" onKeyDown={pickKeys(RUNGS.map((x) => x.id), plan, setPlan, 'fl-rung-')}>
                {RUNGS.map((x) => {
                  const c = COPY[x.key];
                  return (
                    <button key={x.id} id={'fl-rung-' + x.id} type="button" role="radio" aria-checked={plan === x.id} tabIndex={plan === x.id ? 0 : -1} onClick={() => setPlan(x.id)}>
                      <span className="fl-rung-n"><b>{x.name}</b>{c.x && <span className="fl-x">{c.x}</span>}</span>
                      <span className="fl-rung-p x-tnum">{x.price ? <>{money(x.price)}<small> USD/month</small></> : COPY.free.word}</span>
                    </button>
                  );
                })}
              </div>
              <p className="fl-ob-d">{COPY[r.key].d}</p>
              <div className="fl-ob-foot">
                <button type="button" className="fl-text" onClick={() => go(0)}>Back</button>
                <Cta to={to} kind="solid" size="lg" id={'onboarding.plan.' + r.id} thumb>
                  {r.price ? <>Continue to checkout · <Odometer value={money(r.price)} /></> : 'Start free'}
                </Cta>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
}
