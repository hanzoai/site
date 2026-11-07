'use client';
/* Billing. Signature: the meter, running. Usage events drop in from the left, the meter sums them while the period
   bar fills, and when the period closes the invoice reads the meter, previews and issues itself; then a new period
   starts. Every invoice line says, on hover or tap, which object put it there.
   Beyond: "Change a price, not a customer". Publish a new price and watch existing subscribers stay on the old one while
   new sign-ups take the new one: Hanzo's plan/price split, made visible. Also: a bill's history plays in the dark room,
   lighting the capability that wrote each entry. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, More } from '../../kit';
import { Paste, Code, Related, Get, Console, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Billing.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/billing';
const GH = 'https://github.com/hanzoai';
const PERIOD = 18; // events in one demo period

const line = (t, d) => (
  <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
);
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

const LINES = [
  ['Subscription', 'price_api_metered', 'A plan says what someone gets. A price says what it costs.'],
  ['api_requests', null, 'The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.'],
  ['Tax', 'calculated on the invoice', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself.'],
];

/* The machine: events → meter → invoice, one period after another, only while seen. */
function Machine() {
  const [ref, live, calm] = useLive(0.25);
  const [n, setN] = useState(7);
  const [ev, setEv] = useState(7);
  const [phase, setPhase] = useState('run'); // run → read → issued
  const [period, setPeriod] = useState(1);
  useEffect(() => { if (calm) { setN(PERIOD); setPhase('issued'); } }, [calm]);
  useEvery(430, live && phase === 'run', () => { setEv((e) => e + 1); setN((c) => c + 1); });
  useEffect(() => { if (phase === 'run' && n >= PERIOD) setPhase('read'); }, [n, phase]);
  useEffect(() => {
    if (!live || phase === 'run') return;
    const t = phase === 'read'
      ? setTimeout(() => setPhase('issued'), 1100)
      : setTimeout(() => { setN(0); setPeriod((p) => p + 1); setPhase('run'); }, 2600);
    return () => clearTimeout(t);
  }, [phase, live]);
  const ids = Array.from({ length: Math.min(6, ev) }, (_, k) => ev - k);
  const status = phase === 'run' ? 'Draft' : phase === 'read' ? 'Preview' : 'Issued';
  return (
    <div className="bil-mach" ref={ref} data-phase={phase}>
      <div className="bil-zone bil-ev">
        <p className="bil-zk"><span>billing.usage.record</span><b className="x-mono">{ev}</b></p>
        <ul aria-hidden="true">
          <AnimatePresence initial={false}>
            {ids.map((id, k) => (
              <motion.li key={id} layout="position" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1 - k * 0.15, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                <span className="bil-ev-m">api_requests</span><span className="bil-ev-v">+1</span><span className="bil-ev-c">cus_abc123</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="bil-pipe" aria-hidden="true"><i key={ev} className={phase === 'run' ? 'go' : ''} /></div>
      <div className="bil-zone bil-meter">
        <p className="bil-zk"><span>Meter</span><span>api_requests</span></p>
        <div className="bil-num x-mono" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={n} initial={{ y: '-60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '60%', opacity: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 34 }}>{n}</motion.span>
          </AnimatePresence>
        </div>
        <p className="bil-period"><span>Period {period}</span><span>{phase === 'run' ? 'open' : 'closed'}</span></p>
        <i className="bil-bar"><motion.b animate={{ scaleX: Math.min(1, n / PERIOD) }} transition={{ type: 'spring', stiffness: 140, damping: 24 }} /></i>
      </div>
      <div className="bil-pipe two" aria-hidden="true"><i key={period + phase} className={phase === 'read' ? 'go' : ''} /></div>
      <div className="bil-zone bil-inv" data-cursor="Read">
        <div className="bil-inv-h">
          <span><b>Invoice</b><em>cus_abc123</em></span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={status} className={'bil-chip ' + status.toLowerCase()} initial={{ opacity: 0, scale: 1.25, rotate: status === 'Issued' ? -8 : 0 }} animate={{ opacity: 1, scale: 1, rotate: status === 'Issued' ? -4 : 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}>{status}</motion.span>
          </AnimatePresence>
        </div>
        <ul className="bil-lines">
          {LINES.map(([k, v, tip], i) => (
            <li key={k} tabIndex={0} className={i === 1 && phase === 'read' ? 'hot' : ''}>
              <span className="bil-lk">{k}</span>
              <span className="bil-lv x-mono">
                {v || (phase === 'run' ? <span className="bil-wait">metering…</span> : <motion.span key={period} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>× {n}</motion.span>)}
              </span>
              <span className="bil-tip" role="tooltip">{tip}</span>
            </li>
          ))}
        </ul>
        <p className="bil-inv-f">Preview one before it is issued.</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="bil-hero" aria-labelledby="bil-h1">
      <div className="x-wrap">
        <div className="bil-top">
          <div>
            <motion.p className="bil-kick" {...up(0)}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.3" /></svg>Billing &amp; Metering</motion.p>
            <h1 id="bil-h1" className="bil-h1">{line('Hanzo Billing', 0.05)}</h1>
          </div>
          <div>
            <motion.p className="bil-lede" {...up(0.3)}>Subscriptions, usage, invoices. Charge a fixed price, charge for what someone used, or charge for both on the same invoice. Plans, prices, meters, coupons and credits are separate objects, so a pricing change is a new price rather than a migration — and your servers never hold a card number to do any of it.</motion.p>
            <motion.div className="bil-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={DOCS} className="x-btn solid" data-thumb>Read the docs</A></motion.span>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={GH} className="x-btn">GitHub</A></motion.span>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <Machine />
        </motion.div>
      </div>
    </section>
  );
}

function Ship() {
  return (
    <section className="x-sec bil-ship">
      <div className="x-wrap bil-ship-grid">
        <Paste name="Billing" api="/v1/billing" prompt="Read https://hanzo.ai/skill.md and use Hanzo Billing in my project. Start with: hanzo billing balance" className="bil-paste" />
        <div className="bil-con">
          <Console name="Billing" api="/v1/billing" side={[['Billing', '/billing'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions'], ['Annotation Queues', '/cloud/annotation-queues']]} />
          <p className="bil-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

/* Beyond: publish a new price; subscribers already on the old one stay where they are, new sign-ups take the new one. */
function Prices() {
  const [ref, live] = useLive(0.4);
  // at rest it shows the outcome (four kept the old price, two signed up on the new one); sign-ups run once you publish
  const [subs, setSubs] = useState([0, 0, 0, 0, 1, 1]); // the price each subscriber is on
  const [prices, setPrices] = useState(2);
  const [mine, setMine] = useState(false);
  const publish = () => { setPrices((p) => Math.min(3, p + 1)); setMine(true); };
  const reset = () => { setPrices(1); setSubs([0, 0, 0, 0]); setMine(true); };
  useEvery(1300, live && mine && subs.length < 11, () => setSubs((s) => [...s, prices - 1]));
  return (
    <div className="bil-pv" ref={ref}>
      <div className="bil-pv-plan"><span className="x-mono">Plan</span><b>api</b></div>
      <ul className="bil-pv-rows">
        {Array.from({ length: prices }).map((_, v) => (
          <motion.li key={v} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className={v === prices - 1 ? 'new' : ''}>
            <span className="bil-pv-k x-mono">Price {v + 1}</span>
            <span className="bil-pv-subs">
              {subs.map((p, i) => p === v && <motion.i key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} />)}
            </span>
            <span className="bil-pv-n x-mono">{subs.filter((p) => p === v).length}</span>
          </motion.li>
        ))}
      </ul>
      <div className="bil-pv-acts">
        <button type="button" className="x-btn sm solid" onClick={publish} disabled={prices >= 3}>Publish a new price</button>
        <button type="button" className="x-btn sm" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

/* Preview, then issue: a wrong price is still cheap to fix while the invoice is a preview. */
function Issue() {
  const [at, choose] = useSteps(2, 3400, false); // turns by hand: only the meter in the hero runs by itself
  return (
    <div className="bil-iss">
      <div className="bil-iss-t" role="group" aria-label="Invoice state">
        {['Preview', 'Issued'].map((t, i) => <button key={t} type="button" aria-pressed={at === i} onClick={() => choose(i)}>{t}</button>)}
      </div>
      <div className={'bil-iss-doc' + (at ? ' done' : '')}>
        <p><span>Subscription</span><span className="x-mono"><s className={at ? 'gone' : ''}>price_api</s> price_api_metered</span></p>
        <p><span>api_requests</span><span className="x-mono">× {PERIOD}</span></p>
        <AnimatePresence>{at === 1 && <motion.b className="bil-stamp" initial={{ opacity: 0, scale: 1.4, rotate: -14 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}>Issued</motion.b>}</AnimatePresence>
      </div>
    </div>
  );
}

function Feed() {
  return (
    <div className="bil-feed" aria-hidden="true">
      <div className="bil-feed-in">{Array.from({ length: 7 }).map((_, i) => <span key={i}>+1</span>)}</div>
      <b className="x-mono">api_requests</b>
    </div>
  );
}

const OBJECTS = [
  ['Plans and prices', 'A plan says what someone gets. A price says what it costs. Keeping them apart is what lets you change a price without touching anyone already on the old one.', <Prices key="p" />],
  ['Meters', 'Post an event when something is used and the meter aggregates it. The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.', <Feed key="f" />],
  ['Invoices', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself. Preview one before it is issued, which is when a pricing mistake is still cheap.', <Issue key="i" />],
];

function Objects() {
  return (
    <section className="x-sec bil-obj">
      <div className="x-wrap">
        <header className="bil-obj-h">
          <p className="x-kick">What is Hanzo Billing</p>
          <Rise as="h2" y={20}>The objects you bill with</Rise>
          <p className="bil-obj-l">Small pieces that compose, rather than one plan type that has to cover every case.</p>
        </header>
        <ol className="bil-obj-rows">
          {OBJECTS.map(([t, d, vis], i) => (
            <li key={t} className={'bil-obj-row' + (i === 0 ? ' first' : '')}>
              <span className="bil-obj-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="bil-obj-copy"><h3>{t}</h3><p>{d}</p></div>
              <div className="bil-obj-vis">{vis}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CAPS = [
  ['Credits and refunds', 'Issue credit against a balance, or refund a payment that already settled. Both leave a record, because a customer arguing about a bill is really arguing about a history.'],
  ['Coupons and discounts', 'Apply one to a subscription or to a single invoice. A discount is an object on the invoice rather than an adjusted number, so the reason the total changed is still legible.'],
  ['Webhooks', 'The provider tells us a payment settled and we tell you. One endpoint per provider, so adding a second processor does not mean a second integration on your side.'],
];
// a bill's history, entry by entry; c = the capability that wrote it
const HISTORY = [
  [1, 'discount', 'on the invoice'],
  [2, 'payment settled', 'from the provider'],
  [2, 'webhook', 'to your endpoint'],
  [0, 'credit', 'against the balance'],
  [0, 'refund', 'of a settled payment'],
];

function History() {
  const [pick, setPick] = useState(-1); // the whole history is written; a capability lights the entries it wrote
  return (
    <section className="x-sec bil-hist" data-room="dark">
      <div className="x-wrap bil-hist-grid">
        <div>
          <p className="x-kick">Capabilities</p>
          <h2 className="bil-hist-h">What the endpoint gives you</h2>
          <ul className="bil-caps">
            {CAPS.map(([t, d], i) => (
              <li key={t} className={pick === i ? 'on' : ''}>
                <button type="button" aria-pressed={pick === i} onClick={() => setPick(i)} onMouseEnter={() => setPick(i)} onMouseLeave={() => setPick(-1)}>
                  <b>{t}</b><span>{d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bil-log" aria-hidden="true">
          <p className="bil-log-k"><span>cus_abc123</span><span>history</span></p>
          <ol>
            {HISTORY.map(([c, t, d]) => (
              <li key={t} className={(pick >= 0 ? (c === pick ? 'hi' : 'lo') : '')}>
                <i className={'c' + c} /><b className="x-mono">{t}</b><span>{d}</span><em>{CAPS[c][0]}</em>
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
    <section className="x-sec bil-start">
      <div className="x-wrap bil-start-grid">
        <div className="bil-start-copy">
          <p className="x-kick">Get started</p>
          <h2>Report the use, then charge for it</h2>
          <div className="x-row-links tight bil-start-links"><More to={DOCS}>Read the docs</More><More to={GH}>View on GitHub</More></div>
          <div className="bil-first">
            <h3>Send your first meter event</h3>
            <p>Report what someone used, and let the invoice read the meter at the end of the period.</p>
            <div className="bil-first-acts"><A to={DOCS} className="x-btn solid sm">Read the docs</A><A to={GH} className="x-btn sm">View on GitHub</A></div>
          </div>
        </div>
        <Rise delay={0.1}><Code tabs={[{ k: 'typescript', code: CODE }]} light mark="billing.usage.record" /></Rise>
      </div>
      <div className="x-wrap bil-rel">
        <Related items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs'], ['Dashboards', '/dashboards']]} />
      </div>
    </section>
  );
}

export default function Billing() {
  return (
    <main className="bil">
      <Hero />
      <Ship />
      <Objects />
      <History />
      <Start />
      <Get name="Billing" tag="Metered billing engine" />
    </main>
  );
}
