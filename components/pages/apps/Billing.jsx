'use client';
/* Billing (v2, Cloud 4 chat). Archetype A, Launch: an editorial split Stage with the meter running → the three objects as
   pinned chapters while one invoice builds itself → the history room → get started → Get Billing and related.
   Persona: a developer charging for usage. Goal: read the docs and send a first meter event.
   CTA: "Read the docs" (hero, ask bar, get started; data-cta primary / start). Metric: cta_click:billing.primary.
   V2: 8/10 round 3: no dead air between rooms; dark rooms open from rounded cards; chapter objects and the invoice read one meter and one stage; the close is one invoice landing Issued; phone machine in the gutter, stacked chapters show only the changing line, code scrolls sideways; rail and ledger rows answer hover
   Signature: the invoice builds as you scroll. Three pinned chapters (plans and prices, meters, invoices) assemble a single
   invoice: the subscription line arrives from its price, the metered line counts up with your scroll as events land on
   the meter, tax is calculated on the invoice, and the preview turns into an issued stamp at the end.
   Beyond: publish a new price and watch subscribers already on the old one stay where they are while new sign-ups take
   the new one: Hanzo's plan and price split, made visible.
   Motion: scroll-built invoice (signature, scroll) + the hero's running meter (time, pausable) + capability highlight in
   the history (pointer, state); the chapter 02 meter and chapter 03 steps (one shared value with the invoice) and the closing invoice's stamp each settle once (time). Every word, figure and link is Hanzo's; customer and meter names are the examples
   Hanzo's own code uses. */
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useMotionValue } from 'motion/react';
import { EASE } from '../../ui';
import { Cta } from '../../kit';
import { Code, Console, useLive } from '../cloud/Frame';
import StageHero from '../../v2/StageHero';
import PinScenes from '../../v2/x-hamilton/PinScenes';
import Finale, { Prompt } from '../../v2/Finale';
import Drawer from '../../v2/Drawer';
import { useWide } from '../../v2/useWide';
import useCalm from '../../v2/useCalm';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import './Billing.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/billing';
const GH = 'https://github.com/hanzoai';
const PERIOD = 18; // events in one demo period

const LINES = [
  ['Subscription', 'price_api_metered', 'A plan says what someone gets. A price says what it costs.'],
  ['api_requests', null, 'The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.'],
  ['Tax', 'calculated on the invoice', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself.'],
];

/* Stage object: events → meter → invoice, one period after another, only while seen. */
function Machine() {
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
                <span className="l2-mono">api_requests</span><b className="l2-mono">+1</b><em className="l2-mono">cus_abc123</em>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="bl2-zone bl2-meter">
        <p className="bl2-zk l2-mono"><span>Meter</span><span>api_requests</span></p>
        <div className="bl2-num l2-fig" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={n} initial={{ y: '-55%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '55%', opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{n}</motion.span>
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
              <span className="bl2-lv l2-mono">{v || (phase === 'run' ? <span className="bl2-wait">metering…</span> : <motion.span key={period} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>× {n}</motion.span>)}</span>
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
  const [ref, live] = useLive(0.4);
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

/* The chapter objects and the invoice read ONE value each (the meter count, the invoice stage), held by the page:
   while pinned the invoice writes them from the scroll; stacked (phones, reduced motion) the chapter object runs
   them once on time as it comes into view (under 5 s, then it rests), and the invoice line beside it follows. */

/* Chapter 02: one period of events filling the meter. */
function MeterFill({ n, setN, auto }) {
  const [ref, live, calm] = useLive(0.5);
  useEffect(() => { if (auto && calm) setN(PERIOD); }, [auto, calm, setN]);
  useTick(170, auto && live && n < PERIOD, () => setN((c) => Math.min(PERIOD, c + 1)));
  const done = n >= PERIOD;
  return (
    <div className="bl2-mf" ref={ref} aria-hidden="true">
      <p className="bl2-mf-k l2-mono"><span>Meter · api_requests</span><b className="l2-fig">{n}</b></p>
      <div className="bl2-mf-slots">{Array.from({ length: PERIOD }).map((_, i) => <i key={i} className={i < n ? 'on' : ''} />)}</div>
      <p className="bl2-mf-f l2-mono"><span>billing.usage.record</span><span className={done ? 'done' : ''}>{done ? 'closed' : 'open'}</span></p>
    </div>
  );
}

/* Chapter 03: the invoice's three states; it rests on Issued. */
const STEPS = ['Draft', 'Preview', 'Issued'];
function IssueSteps({ s, setS, auto }) {
  const [ref, live, calm] = useLive(0.3);
  useEffect(() => { if (auto && calm) setS(2); }, [auto, calm, setS]);
  useTick(750, auto && live && s < 2, () => setS((v) => Math.min(2, v + 1)));
  return (
    <div className="bl2-is" ref={ref} aria-hidden="true">
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

/* The close: one object, the period's invoice landing once: it rises in as Preview, then the stamp lands and it is Issued. */
function Closing() {
  const [ref, live, calm] = useLive(0.5);
  const [done, setDone] = useState(false);
  useEffect(() => { if (calm) setDone(true); }, [calm]);
  useTick(1400, live && !done, () => setDone(true));
  return (
    <motion.div className="l2-obj bl2-doc bl2-cl" ref={ref} aria-hidden="true" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: EASE }}>
      <div className="bl2-doc-h">
        <div><p className="l2-mono">Invoice</p><b>cus_abc123</b></div>
        <span className={'bl2-chip l2-mono ' + (done ? 'issued' : 'preview')}>{done ? 'Issued' : 'Preview'}</span>
      </div>
      <ul className="bl2-doc-lines">
        <li className="in"><span>Subscription</span><b className="l2-mono">price_api_metered</b></li>
        <li className="in"><span>api_requests</span><b className="l2-mono">× {PERIOD}</b></li>
        <li className="in"><span>Tax</span><b className="l2-mono">calculated on the invoice</b></li>
      </ul>
      <div className="bl2-doc-f">
        <span className="l2-mono">Preview one before it is issued.</span>
        <AnimatePresence>{done && <motion.b className="bl2-stamp" initial={{ opacity: 0, scale: 1.5, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>Issued</motion.b>}</AnimatePresence>
      </div>
    </motion.div>
  );
}

/* Stacked chapters: the invoice is drawn whole once (chapter 01); chapters 02 and 03 show only what changes on it. */
function InvLine({ n }) {
  return (
    <div className="l2-obj bl2-doc bl2-part">
      <ul className="bl2-doc-lines">
        <li className="in now"><span>api_requests</span><b className="l2-mono l2-fig">× {n}</b></li>
      </ul>
    </div>
  );
}
function InvFoot({ s }) {
  const status = STEPS[s];
  return (
    <div className="l2-obj bl2-doc bl2-part">
      <div className="bl2-doc-h"><div><p className="l2-mono">Invoice</p><b>cus_abc123</b></div><span className={'bl2-chip l2-mono ' + status.toLowerCase()}>{status}</span></div>
      <div className="bl2-doc-f">
        <span className="l2-mono">Preview one before it is issued.</span>
        <AnimatePresence>{s === 2 && <motion.b className="bl2-stamp" initial={{ opacity: 0, scale: 1.5, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>Issued</motion.b>}</AnimatePresence>
      </div>
    </div>
  );
}

const OBJECTS = [
  ['Plans and prices', 'A plan says what someone gets. A price says what it costs. Keeping them apart is what lets you change a price without touching anyone already on the old one.'],
  ['Meters', 'Post an event when something is used and the meter aggregates it. The invoice reads the meter at the end of the period, so nobody has to add up rows by hand.'],
  ['Invoices', 'Line items assembled from the subscription and the meters, with tax calculated on the invoice itself. Preview one before it is issued, which is when a pricing mistake is still cheap.'],
];

/* Signature: one invoice, built by the chapter reached (and, while pinned, by the scroll within it). */
function Invoice({ at, p, onRead }) {
  const zero = useMotionValue(at >= 2 ? 1 : at === 1 ? 0.55 : 0);
  const src = p || zero;
  const [v, setV] = useState(src.get());
  useMotionValueEvent(src, 'change', setV);
  const meter = at === 0 ? 0 : at === 1 ? Math.round(Math.min(1, Math.max(0, (v - 0.36) / 0.26)) * PERIOD) : PERIOD;
  const issued = at === 2 && (p ? v > 0.9 : true);
  const status = at < 2 ? 'Draft' : issued ? 'Issued' : 'Preview';
  const stage = at < 2 ? 0 : issued ? 2 : 1;
  useEffect(() => { onRead?.(meter, stage); }, [meter, stage, onRead]); // the chapter objects read these same two values
  return (
    <div className="l2-obj bl2-doc">
      <div className="bl2-doc-h">
        <div><p className="l2-mono">Invoice</p><b>cus_abc123</b></div>
        <span className={'bl2-chip l2-mono ' + status.toLowerCase()}>{status}</span>
      </div>
      <div className="bl2-doc-src l2-mono">
        <span className={at === 0 ? 'on' : ''}>Plan · api</span><i />
        <span className={at === 0 ? 'on' : ''}>Price · price_api_metered</span>
        <span className={'m' + (at === 1 ? ' on' : '')}>Meter · api_requests</span>
      </div>
      <ul className="bl2-doc-lines">
        <li className={'in' + (at === 0 ? ' now' : '')}><span>Subscription</span><b className="l2-mono">price_api_metered</b></li>
        <li className={at >= 1 ? 'in' + (at === 1 ? ' now' : '') : ''}><span>api_requests</span><b className="l2-mono l2-fig">× {meter}</b></li>
        <li className={at >= 2 ? 'in now' : ''}><span>Tax</span><b className="l2-mono">calculated on the invoice</b></li>
      </ul>
      <div className="bl2-doc-f">
        <span className="l2-mono">Preview one before it is issued.</span>
        <AnimatePresence>{issued && <motion.b className="bl2-stamp" initial={{ opacity: 0, scale: 1.5, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>Issued</motion.b>}</AnimatePresence>
      </div>
    </div>
  );
}

const CAPS = [
  ['Credits and refunds', 'Issue credit against a balance, or refund a payment that already settled. Both leave a record, because a customer arguing about a bill is really arguing about a history.'],
  ['Coupons and discounts', 'Apply one to a subscription or to a single invoice. A discount is an object on the invoice rather than an adjusted number, so the reason the total changed is still legible.'],
  ['Webhooks', 'The provider tells us a payment settled and we tell you. One endpoint per provider, so adding a second processor does not mean a second integration on your side.'],
];
const HISTORY = [[1, 'discount', 'on the invoice'], [2, 'payment settled', 'from the provider'], [2, 'webhook', 'to your endpoint'], [0, 'credit', 'against the balance'], [0, 'refund', 'of a settled payment']];

function History() {
  const [pick, setPick] = useState(-1);
  return (
    <section className="l2-sec l2-dark bl2-hist" data-room="dark">
      <div className="l2-wrap l2-grid">
        <div className="bl2-hist-l">
          <h2 className="l2-head">What the endpoint gives you</h2>
          <p className="l2-stage-kick l2-mono bl2-cap-k">Capabilities</p>
          <ul className="bl2-caps">
            {CAPS.map(([t, d], i) => (
              <li key={t} className={pick === i ? 'on' : ''}>
                <button type="button" aria-pressed={pick === i} onClick={() => setPick(pick === i ? -1 : i)} onMouseEnter={() => setPick(i)} onMouseLeave={() => setPick(-1)}>
                  <b>{t}</b><span>{d}</span>
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
    <section className="l2-sec bl2-start">
      <div className="l2-wrap l2-grid">
        <div className="bl2-start-l">
          <h2 className="l2-head">Report the use, then charge for it</h2>
          <p className="l2-stage-kick l2-mono bl2-cap-k">Get started</p>
          <div className="bl2-first">
            <h3 className="l2-title">Send your first meter event</h3>
            <p className="l2-body">Report what someone used, and let the invoice read the meter at the end of the period.</p>
            <div className="l2-acts"><Cta to={DOCS} id="start" size="lg">Read the docs</Cta><Cta to={GH} kind="link" id="start-github">View on GitHub</Cta></div>
          </div>
          <Drawer label="Open in the console" title="Hanzo Billing">
            <Console name="Billing" api="/v1/billing" light side={[['Billing', '/billing'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions'], ['Annotation Queues', '/cloud/annotation-queues']]} />
            <p className="bl2-note">Example project. Every name in it is one you would give your own.</p>
          </Drawer>
        </div>
        <div className="bl2-start-r">
          <Code tabs={[{ k: 'typescript', code: CODE }]} light mark="billing.usage.record" />
          <Prompt name="Billing" api="/v1/billing" prompt="Read https://hanzo.ai/skill.md and use Hanzo Billing in my project. Start with: hanzo billing balance" className="bl2-pr" />
        </div>
      </div>
    </section>
  );
}

export default function Billing() {
  const wide = useWide();
  const calm = useCalm();
  const pin = wide && !calm; // the same test PinScenes uses to pin
  const [meter, setMeter] = useState(0);
  const [stage, setStage] = useState(0);
  const read = useCallback((m, s) => { setMeter(m); setStage(s); }, []);
  const extra = (i) => (i === 0 ? <Prices key="p" /> : i === 1 ? <MeterFill key="m" n={meter} setN={setMeter} auto={!pin} /> : <IssueSteps key="s" s={stage} setS={setStage} auto={!pin} />);
  const visual = (at, p) => (p ? <Invoice at={at} p={p} onRead={read} /> : at === 0 ? <Invoice at={0} /> : at === 1 ? <InvLine n={meter} /> : <InvFoot s={stage} />);
  useEffect(() => { // the code pane scrolls sideways on narrow screens rather than breaking a token, so it is a focusable region
    const pre = document.querySelector('.bl2-start-r .cf-code pre');
    if (pre) { pre.tabIndex = 0; pre.setAttribute('role', 'region'); pre.setAttribute('aria-label', 'typescript'); }
  }, []);
  return (
    <main id="main" className="l2-page bl2" data-ask="off">
      <StageHero look="split" kick="Billing & Metering" title="Hanzo Billing" sub="Subscriptions, usage, invoices. Charge a fixed price, charge for what someone used, or charge for both on the same invoice. Plans, prices, meters, coupons and credits are separate objects, so a pricing change is a new price rather than a migration — and your servers never hold a card number to do any of it." acts={[['Read the docs', DOCS], ['GitHub', GH]]}>
        <Machine />
      </StageHero>
      <PinScenes
        kick="What is Hanzo Billing"
        head="The objects you bill with"
        lede="Small pieces that compose, rather than one plan type that has to cover every case."
        items={OBJECTS.map(([t, d], i) => [t, d, extra(i)])}
        visual={visual}
        screens={1.1}
      />
      <History />
      <Start />
      <Finale name="Billing" className="bl2-fin" object={<Closing />} related={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs'], ['Dashboards', '/dashboards']]} tag="Metered billing engine" />
    </main>
  );
}
