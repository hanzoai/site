'use client';
/* Billing (v2, Cloud 4 chat). Archetype A, Launch, re-sequenced for the motion map: the statement and the live calculator
   on the first screen → the objects you bill with (the running machine, then the three objects as quick rows) → the
   history room → get started → Get Billing and related. No pinned or scroll-scrubbed scene.
   Persona: a developer charging for usage. Goal: read the docs and send a first meter event.
   CTA: "Read the docs" (hero, get started; data-cta primary / start). Metric: cta_click:billing.primary.
   V2: 8/10 signature `calculator`: five sliders reprice the invoice, the running meter, the chapter objects and the closing invoice live; pinned chapters and the scroll-scrubbed hero replaced by plain sections
   Signature: `calculator` (MOTION-MAP.md), Live calculator. Five inputs, each named by the object it sets on Hanzo's own
   example invoice (api_requests, price_api_metered, Subscription, discount, Tax), reprice everything on the page at
   once: the invoice's lines and total roll to the new figures, the machine's meter counts toward the new usage, the
   meter in "Meters" refills, and the closing invoice carries the same figures. Draft / Preview / Issued is one shared
   stage: Issued lands the stamp; moving any input again makes it a new Preview ("Preview one before it is issued").
   On arrival it glides the usage once by itself (under 5 s), then waits for the visitor.
   // Entrances: 1 pixel-resolve (the calculator, first screen) → 2 orbit-in (The objects you bill with: head, machine,
   three rows) → 3 invert-flash (What the endpoint gives you, dark) → 4 shrink-to-card (Report the use, then charge for
   it) → 5 depth-parallax (the close: invoice, Get Billing, related at three depths). CSS keyframes, once each.
   Beyond: publish a new price and watch subscribers already on the old one stay where they are while new sign-ups take
   the new one: Hanzo's plan and price split, made visible.
   Motion: the calculator (signature, input + figures that roll) + the running meter (time, pausable) + capability
   highlight in the history (pointer, state); one reveal style on the page (the h1's line-mask cut-in). Every word and
   link is Hanzo's; customer, meter and price names are the examples Hanzo's own code uses, and the input values are
   the visitor's own (example starting values, not Hanzo prices). */
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { Cta } from '../../kit';
import { Code, Console, useLive } from '../cloud/Frame';
import Finale, { Prompt } from '../../v2/Finale';
import useCalm from '../../v2/useCalm';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import './Billing.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/billing';
const GH = 'https://github.com/hanzoai';
const PERIOD = 18; // events in one demo period
const STEPS = ['Draft', 'Preview', 'Issued'];

/* figures, formatted the same on the server and in the browser */
const NUM = new Intl.NumberFormat('en-US');
const CMP = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const usd = (v: number) => '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, v));
const unitUsd = (v: number) => '$' + v.toFixed(4);
const pct = (v: number) => (Number.isInteger(v) ? v : v.toFixed(1)) + '%';

/* what the visitor sets: usage in events, the unit price, the base fee, a discount and tax in percent */
interface Plan {
  usage: number;
  unit: number;
  base: number;
  disc: number;
  tax: number;
}
/* the visitor's inputs: [key, name on the invoice, min, max, step, format] */
type Input = [keyof Plan, string, number, number, number, (v: number) => string];
const INPUTS: Input[] = [
  ['usage', 'api_requests', 0, 1000000, 5000, (v: number) => NUM.format(Math.round(v))],
  ['unit', 'price_api_metered', 0.0005, 0.01, 0.0005, unitUsd],
  ['base', 'Subscription', 0, 200, 5, usd],
  ['disc', 'discount', 0, 50, 5, pct],
  ['tax', 'Tax', 0, 25, 0.5, pct],
];
const START: Plan = { usage: 120000, unit: 0.002, base: 20, disc: 0, tax: 8 };

function price(p: Plan) {
  const metered = p.usage * p.unit;
  const pre = p.base + metered;
  const off = (pre * p.disc) / 100;
  const tax = ((pre - off) * p.tax) / 100;
  return { metered, off, tax, total: pre - off + tax };
}

/* A figure that rolls to its new value (motion value, no re-render per frame). */
function Fig({ v, fmt, className = '' }: { v: number; fmt: (v: number) => string; className?: string }) {
  const calm = useCalm();
  const mv = useMotionValue(v);
  const txt = useTransform(mv, fmt);
  useEffect(() => { const c = animate(mv, v, { duration: calm ? 0 : 0.5, ease: EASE }); return () => c.stop(); }, [v, mv, calm]);
  return <motion.span className={className}>{txt}</motion.span>;
}

const Stamp = () => <motion.b className="bl2-stamp" initial={{ opacity: 0, scale: 1.5, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>Issued</motion.b>;

/* Signature: the live calculator. */
interface CalcProps {
  plan: Plan;
  set: React.Dispatch<React.SetStateAction<Plan>>;
  stage: number;
  setStage: (n: number) => void;
}
function Calc({ plan, set, stage, setStage }: CalcProps) {
  const [ref, live, calm] = useLive<HTMLDivElement>(0.4);
  const touched = useRef(false);
  const [demo, setDemo] = useState(0); // the one glide on arrival: 0 → 12 steps
  const DEMO = [120000, 150000, 185000, 225000, 270000, 320000, 360000, 390000, 410000, 420000, 425000, 425000];
  useTick(190, live && !calm && !touched.current && demo < DEMO.length, () => {
    if (touched.current) return;
    set((p) => ({ ...p, usage: DEMO[demo] }));
    setDemo((d) => d + 1);
  });
  const change = (k: keyof Plan, v: number) => {
    touched.current = true;
    set((p) => ({ ...p, [k]: v }));
    if (stage === 2) setStage(1); // a changed invoice is a new preview
  };
  const r = price(plan);
  return (
    <div className="bl2-calc" ref={ref}>
      <div className="bl2-cc">
        {INPUTS.map(([k, name, min, max, step, fmt]) => (
          <div className="bl2-in" key={k}>
            <label htmlFor={'bl2-' + k} className="l2-mono"><span>{name}</span><Fig v={plan[k]} fmt={fmt} className="bl2-in-v" /></label>
            <input id={'bl2-' + k} type="range" min={min} max={max} step={step} value={plan[k]} aria-valuetext={fmt(plan[k])}
              style={{ '--p': ((plan[k] - min) / (max - min)) * 100 + '%' }}
              onChange={(e) => change(k, +e.target.value)} onPointerDown={() => { touched.current = true; }} />
          </div>
        ))}
      </div>
      <div className="l2-obj bl2-ci" data-stage={STEPS[stage]}>
        <div className="bl2-ci-h">
          <div><p className="l2-mono">Invoice</p><b>cus_abc123</b></div>
          <div className="bl2-seg" role="group" aria-label="Invoice">
            {STEPS.map((t, i) => <button key={t} type="button" className="l2-mono" aria-pressed={stage === i} onClick={() => setStage(i)}>{t}</button>)}
          </div>
        </div>
        <ul className="bl2-ci-lines">
          <li><span className="bl2-ci-k">Subscription<em className="l2-mono">price_api_metered</em></span><Fig v={plan.base} fmt={usd} className="bl2-ci-v l2-mono" /></li>
          <li><span className="bl2-ci-k">api_requests<em className="l2-mono"><Fig v={plan.usage} fmt={(v: number) => '× ' + NUM.format(Math.round(v))} /> · {unitUsd(plan.unit)}</em></span><Fig v={r.metered} fmt={usd} className="bl2-ci-v l2-mono" /></li>
          <li className={plan.disc ? '' : 'off'}><span className="bl2-ci-k">discount<em className="l2-mono">{pct(plan.disc)}</em></span><Fig v={r.off} fmt={(v: number) => '−' + usd(v)} className="bl2-ci-v l2-mono" /></li>
          <li><span className="bl2-ci-k">Tax<em className="l2-mono">calculated on the invoice · {pct(plan.tax)}</em></span><Fig v={r.tax} fmt={usd} className="bl2-ci-v l2-mono" /></li>
        </ul>
        <div className="bl2-ci-f">
          <span className="l2-mono">Preview one before it is issued.</span>
          <span className="bl2-ci-stamp"><AnimatePresence>{stage === 2 && <Stamp />}</AnimatePresence></span>
          <Fig v={r.total} fmt={usd} className="bl2-ci-total l2-fig" />
        </div>
      </div>
    </div>
  );
}

const LINES: [string, string | null, string][] = [
  ['Subscription', 'price_api_metered', 'A plan says what someone gets. A price says what it costs.'],
  ['api_requests', null, 'The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.'],
  ['Tax', 'calculated on the invoice', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself.'],
];

/* The running machine: events → meter → invoice, one period after another, only while seen. It meters the usage the
   calculator is set to: each event carries one eighteenth of it. */
interface MachineProps {
  usage: number;
}
function Machine({ usage }: MachineProps) {
  const [ref, live, calm, paused, toggle] = useDemo(0.25);
  const [n, setN] = useState(7);
  const [ev, setEv] = useState(7);
  const [phase, setPhase] = useState('run');
  const [period, setPeriod] = useState(1);
  useEffect(() => { if (calm) { setN(PERIOD); setPhase('issued'); } }, [calm]);
  useTick(430, live && phase === 'run', () => { setEv((e) => e + 1); setN((c) => c + 1); });
  useEffect(() => { if (phase === 'run' && n >= PERIOD) setPhase('read'); }, [n, phase]);
  useEffect(() => {
    if (!live || phase === 'run') return;
    const t = phase === 'read' ? setTimeout(() => setPhase('issued'), 1100) : setTimeout(() => { setN(0); setPeriod((p) => p + 1); setPhase('run'); }, 2600);
    return () => clearTimeout(t);
  }, [phase, live]);
  const step = Math.max(1, Math.round(usage / PERIOD));
  const read = n >= PERIOD ? usage : n * step;
  const ids = Array.from({ length: Math.min(7, ev) }, (_, k) => ev - k);
  const status = phase === 'run' ? 'Draft' : phase === 'read' ? 'Preview' : 'Issued';
  return (
    <div className="l2-obj bl2-mach" ref={ref} data-phase={phase}>
      <PauseBtn paused={paused} onClick={toggle} />
      <div className="bl2-zone bl2-ev">
        <p className="bl2-zk l2-mono"><span>billing.usage.record</span><b>{ev}</b></p>
        {/* a fixed window: rows are stacked by transform only (each slot is 112% of a row), so nothing below them moves */}
        <ul aria-hidden="true">
          <AnimatePresence initial={false}>
            {ids.map((id, k) => (
              <motion.li key={id} initial={{ opacity: 0, y: '-112%' }} animate={{ opacity: 1 - k * 0.14, y: `${k * 112}%` }} exit={{ opacity: 0, y: `${(k + 1) * 112}%` }} transition={{ duration: 0.45, ease: EASE }}>
                <span className="l2-mono">api_requests</span><b className="l2-mono">+{CMP.format(step)}</b><em className="l2-mono">cus_abc123</em>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="bl2-zone bl2-meter">
        <p className="bl2-zk l2-mono"><span>Meter</span><span>api_requests</span></p>
        <div className="bl2-num l2-fig" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={read} initial={{ y: '-55%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '55%', opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{CMP.format(read)}</motion.span>
          </AnimatePresence>
        </div>
        <p className="bl2-period l2-mono"><span>Period {period}</span><span>{phase === 'run' ? 'open' : 'closed'}</span></p>
        <i className="bl2-bar"><b style={{ transform: `scaleX(${Math.min(1, n / PERIOD)})` }} /></i>
      </div>
      <div className="bl2-zone bl2-inv">
        <div className="bl2-inv-h">
          <span><b>Invoice</b><em className="l2-mono">cus_abc123</em></span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={status} className={'bl2-chip l2-mono ' + status.toLowerCase()} initial={{ opacity: 0, scale: 1.25 }} animate={{ opacity: 1, scale: 1, rotate: status === 'Issued' ? -4 : 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{status}</motion.span>
          </AnimatePresence>
        </div>
        <ul className="bl2-lines">
          {LINES.map(([k, v], i) => (
            <li key={k} className={i === 1 && phase === 'read' ? 'hot' : ''}>
              <span className="bl2-lk">{k}</span>
              <span className="bl2-lv l2-mono">{v || (phase === 'run' ? <span className="bl2-wait">metering…</span> : <motion.span key={period} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>× {NUM.format(usage)}</motion.span>)}</span>
            </li>
          ))}
        </ul>
        <p className="bl2-inv-f">Preview one before it is issued.</p>
      </div>
    </div>
  );
}

/* Beyond: publish a new price; existing subscribers stay on theirs, new sign-ups take the new one. */
function Prices() {
  const [ref, live] = useLive<HTMLDivElement>(0.4);
  const [subs, setSubs] = useState([0, 0, 0, 0, 1, 1]);
  const [prices, setPrices] = useState(2);
  const [mine, setMine] = useState(false);
  const publish = () => { setPrices((p) => Math.min(3, p + 1)); setMine(true); };
  const reset = () => { setPrices(1); setSubs([0, 0, 0, 0]); setMine(true); };
  useTick(1300, live && mine && subs.length < 11, () => setSubs((s) => [...s, prices - 1]));
  return (
    <div className="bl2-pv" ref={ref}>
      <div className="bl2-pv-plan"><span className="l2-mono">Plan</span><b>api</b></div>
      <ul className="bl2-pv-rows">
        {Array.from({ length: prices }).map((_, v) => (
          <motion.li key={v} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className={v === prices - 1 ? 'new' : ''}>
            <span className="bl2-pv-k l2-mono">Price {v + 1}</span>
            <span className="bl2-pv-subs">{subs.map((p, i) => p === v && <motion.i key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />)}</span>
            <span className="bl2-pv-n l2-mono">{subs.filter((p) => p === v).length}</span>
          </motion.li>
        ))}
      </ul>
      <div className="bl2-pv-acts">
        <button type="button" className="bl2-ib" onClick={publish} disabled={prices >= 3} aria-label="Publish a new price"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        <button type="button" className="bl2-ib" onClick={reset} aria-label="Reset"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.5-3.55M3 2.5v2.5h2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
    </div>
  );
}

/* Meters: the calculator's usage as one period of 18 cells; it refills whenever the usage changes. */
interface MeterFillProps {
  usage: number;
}
function MeterFill({ usage }: MeterFillProps) {
  const [ref, live] = useLive<HTMLDivElement>(0.4);
  const target = Math.round((usage / INPUTS[0][3]) * PERIOD);
  const [k, setK] = useState(0);
  useTick(45, live && k !== target, () => setK((c) => c + Math.sign(target - c)));
  return (
    <div className="bl2-mf" ref={ref} aria-hidden="true">
      <p className="bl2-mf-k l2-mono"><span>Meter · api_requests</span><Fig v={usage} fmt={(v: number) => CMP.format(Math.round(v))} className="l2-fig" /></p>
      <div className="bl2-mf-slots">{Array.from({ length: PERIOD }).map((_, i) => <i key={i} className={i < k ? 'on' : ''} />)}</div>
      <p className="bl2-mf-f l2-mono"><span>billing.usage.record</span><span>open</span></p>
    </div>
  );
}

/* Invoices: the same Draft / Preview / Issued stage the calculator's invoice shows. */
interface IssueStepsProps {
  s: number;
}
function IssueSteps({ s }: IssueStepsProps) {
  return (
    <div className="bl2-is" aria-hidden="true">
      <p className="bl2-is-k l2-mono"><span>Invoice</span><span>cus_abc123</span></p>
      <div className="bl2-is-row">
        <b className="bl2-is-line" style={{ transform: `scaleX(${s / 2})` }} />
        {STEPS.map((t, i) => (
          <p key={t} className={'bl2-is-s' + (i < s ? ' past' : '') + (i === s ? ' now' : '')}>
            <i className="bl2-is-dot" />
            <span className="l2-mono">{t}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

const OBJECTS = [
  ['Plans and prices', 'A plan says what someone gets. A price says what it costs. Keeping them apart is what lets you change a price without touching anyone already on the old one.'],
  ['Meters', 'Post an event when something is used and the meter aggregates it. The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.'],
  ['Invoices', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself. Preview one before it is issued, which is when a pricing mistake is still cheap.'],
];

/* The objects, as plain quick rows (no pin): the running machine first, then each object beside its own small thing. */
interface ObjectsProps {
  plan: Plan;
  stage: number;
}
function Objects({ plan, stage }: ObjectsProps) {
  const things = [<Prices key="p" />, <MeterFill key="m" usage={plan.usage} />, <IssueSteps key="s" s={stage} />];
  return (
    <section className="l2-sec bl2-objs bl2-e bl2-e-orbit">
      <div className="l2-wrap">
        <header className="bl2-objs-h bl2-orb" style={{ '--i': 0 }}>
          <h2 className="l2-head">The objects you bill with</h2>
          <p className="l2-kick">What is Hanzo Billing</p>
          <p className="l2-lede">Small pieces that compose, rather than one plan type that has to cover every case.</p>
        </header>
        <div className="bl2-orb" style={{ '--i': 1 }}><Machine usage={plan.usage} /></div>
        <ol className="bl2-rows">
          {OBJECTS.map(([t, d], i) => (
            <li key={t} className="bl2-orb" style={{ '--i': i + 2 }}>
              <div className="bl2-row-t">
                <h3 className="l2-title">{t}</h3>
                <p className="bl2-row-n l2-mono">{String(i + 1).padStart(2, '0')} / 03</p>
                <p className="l2-body">{d}</p>
              </div>
              <div className="bl2-row-o">{things[i]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The close: one object, this period's invoice at the calculator's figures, issued once as it arrives. */
interface ClosingProps {
  plan: Plan;
}
function Closing({ plan }: ClosingProps) {
  const [ref, live, calm] = useLive<HTMLDivElement>(0.5);
  const [done, setDone] = useState(false);
  useEffect(() => { if (calm) setDone(true); }, [calm]);
  useTick(1400, live && !done, () => setDone(true));
  const r = price(plan);
  return (
    <div className="l2-obj bl2-doc bl2-cl" ref={ref} aria-hidden="true">
      <div className="bl2-doc-h">
        <div><p className="l2-mono">Invoice</p><b>cus_abc123</b></div>
        <span className={'bl2-chip l2-mono ' + (done ? 'issued' : 'preview')}>{done ? 'Issued' : 'Preview'}</span>
      </div>
      <ul className="bl2-doc-lines">
        <li className="in"><span>Subscription</span><b className="l2-mono">{usd(plan.base)}</b></li>
        <li className="in"><span>api_requests</span><b className="l2-mono">× {NUM.format(plan.usage)}</b></li>
        <li className="in"><span>Tax</span><b className="l2-mono">calculated on the invoice</b></li>
      </ul>
      <div className="bl2-doc-f">
        <span className="l2-mono">Preview one before it is issued.</span>
        <AnimatePresence>{done && <Stamp />}</AnimatePresence>
        <Fig v={r.total} fmt={usd} className="bl2-cl-total l2-fig" />
      </div>
    </div>
  );
}

const CAPS = [
  ['Credits and refunds', 'Issue credit against a balance, or refund a payment that already settled. Both leave a record, because a customer arguing about a bill is really arguing about a history.'],
  ['Coupons and discounts', 'Apply one to a subscription or to a single invoice. A discount is an object on the invoice rather than an adjusted number, so the reason the total changed is still legible.'],
  ['Webhooks', 'The provider tells us a payment settled and we tell you. One endpoint per provider, so adding a second processor does not mean a second integration on your side.'],
];
const HISTORY: [number, string, string][] = [[1, 'discount', 'on the invoice'], [2, 'payment settled', 'from the provider'], [2, 'webhook', 'to your endpoint'], [0, 'credit', 'against the balance'], [0, 'refund', 'of a settled payment']];

function History() {
  const [pick, setPick] = useState(-1);
  return (
    <section className="l2-sec l2-dark bl2-hist bl2-e bl2-e-inv" data-room="dark">
      <div className="l2-wrap l2-grid">
        <div className="bl2-hist-l">
          <h2 className="l2-head">What the endpoint gives you</h2>
          <p className="l2-stage-kick l2-mono bl2-cap-k">Capabilities</p>
          <ul className="bl2-caps">
            {CAPS.map(([t, d], i) => (
              <li key={t} className={pick === i ? 'on' : ''}>
                <button type="button" aria-pressed={pick === i} onClick={() => setPick(pick === i ? -1 : i)} onMouseEnter={() => setPick(i)} onMouseLeave={() => setPick(-1)}>
                  <span className="bl2-cap-t">{t}</span><span>{d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bl2-log" aria-hidden="true">
          <p className="bl2-log-k l2-mono"><span>cus_abc123</span><span>history</span></p>
          <ol>
            {HISTORY.map(([c, t, d]) => (
              <li key={t} className={pick >= 0 ? (c === pick ? 'hi' : 'lo') : ''} onMouseEnter={() => setPick(c)} onMouseLeave={() => setPick(-1)}>
                <i className={'c' + c} /><b className="l2-mono">{t}</b><span>{d}</span><em>{CAPS[c][0]}</em>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const CODE = `import { Hanzo } from '@hanzo/billing';

const billing = new Hanzo({ apiKey: process.env.HANZO_API_KEY });

// Report usage in real time
await billing.usage.record({
  customer: 'cus_abc123',
  meter: 'api_requests',
  value: 1,
  timestamp: new Date(),
});

// Subscribe with metered pricing
await billing.subscriptions.create({
  customer: 'cus_abc123',
  items: [{ price: 'price_api_metered' }],
  payment_behavior: 'default_incomplete',
});`;

function Start() {
  return (
    <section className="l2-sec bl2-start bl2-e bl2-e-card">
      <div className="l2-wrap l2-grid">
        <div className="bl2-start-l">
          <h2 className="l2-head">Report the use, then charge for it</h2>
          <p className="l2-stage-kick l2-mono bl2-cap-k">Get started</p>
          <div className="bl2-first">
            <h3 className="l2-title">Send your first meter event</h3>
            <p className="l2-body">Report what someone used, and let the invoice read the meter at the end of the period.</p>
            <div className="l2-acts"><Cta to={DOCS} id="start" size="lg">Read the docs</Cta><Cta to={GH} kind="link" id="start-github">View on GitHub</Cta></div>
          </div>
          {/* Hanzo's example console, in the page as on hanzo.ai: the projects the session is changing, and where to open it */}
          <figure className="bl2-con">
            <Console name="Billing" api="/v1/billing" light cap="The service the session above is changing." side={[['Billing', '/billing'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions'], ['Annotation Queues', '/cloud/annotation-queues']]} />
            <figcaption className="bl2-note">Example project. Every name in it is one you would give your own.</figcaption>
          </figure>
        </div>
        <div className="bl2-start-r">
          <Code tabs={[{ k: 'typescript', code: CODE }]} light mark="billing.usage.record" />
          <Prompt name="Billing" api="/v1/billing" prompt="Read https://hanzo.ai/skill.md and use Hanzo Billing in my project. Start with: hanzo billing balance" className="bl2-pr" />
        </div>
      </div>
    </section>
  );
}

/* Entrances (MOTION-MAP rule 7), one per main section, each once as it first comes into view: the class bl2-in starts
   its CSS keyframes (Billing.css). Start states exist only under html.js and prefers-reduced-motion: no-preference, so
   with JS off or reduced motion every section simply stands in its final state. */
function useEntrances() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.bl2-e')];
    const io = new IntersectionObserver((list) => {
      for (const e of list) if (e.isIntersecting) { e.target.classList.add('bl2-in'); io.unobserve(e.target); }
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
/* pixel-resolve: 16 × 8 coarse pixels clear in a scattered (fixed, so server and browser agree) order */
const TILES = Array.from({ length: 128 }, (_, i) => ((i * 37 + (i >> 4) * 53) % 128) * 3.5);

export default function Billing() {
  const [plan, setPlan] = useState<Plan>(START);
  const [stage, setStage] = useState(1);
  const set = useCallback((f: React.SetStateAction<Plan>) => setPlan(f), []);
  useEntrances();
  useEffect(() => { // the code pane scrolls sideways on narrow screens rather than breaking a token, so it is a focusable region
    const pre = document.querySelector<HTMLElement>('.bl2-start-r .cf-code pre');
    if (pre) { pre.tabIndex = 0; pre.setAttribute('role', 'region'); pre.setAttribute('aria-label', 'typescript'); }
  }, []);
  return (
    <main id="main" className="l2-page bl2" data-ask="off">
      <section className="bl2-hero">
        <div className="l2-wrap bl2-hero-copy">
          <h1 className="l2-display">Hanzo Billing</h1>
          <p className="l2-kick bl2-hero-k">Billing & Metering</p>
          <p className="l2-lede">Subscriptions, usage, invoices. Charge a fixed price, charge for what someone used, or charge for both on the same invoice. Plans, prices, meters, coupons and credits are separate objects, so a pricing change is a new price rather than a migration — and your servers never hold a card number to do any of it.</p>
          <div className="l2-acts"><Cta to={DOCS} id="primary" size="lg" thumb>Read the docs</Cta><Cta to={GH} kind="link" id="primary-2">GitHub</Cta></div>
        </div>
        <div className="l2-wrap bl2-e bl2-e-px">
          <Calc plan={plan} set={set} stage={stage} setStage={setStage} />
          <div className="bl2-px" aria-hidden="true">{TILES.map((d, i) => <i key={i} style={{ '--d': d + 'ms' }} />)}</div>
        </div>
      </section>
      <Objects plan={plan} stage={stage} />
      <History />
      <Start />
      <Finale name="Billing" className="bl2-fin bl2-e bl2-e-depth" object={<Closing plan={plan} />} related={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs'], ['Dashboards', '/dashboards']]} tag="Metered billing engine" />
    </main>
  );
}
