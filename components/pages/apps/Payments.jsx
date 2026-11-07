'use client';
/* Payments (v2, archetype A "Launch", accent indigo #5b3df5).
   V2: 8/10 one huge phone is the Stage hero under a centred title (lede left, actions right), four sticky chapters pin the phone beside the route it takes, the dark room is the traffic split, the lists open as sheets and cards, one closing CTA.
   Signature: a checkout settling on one huge phone. A method is picked, the number becomes a vault token, the rule picks
   a processor, the first one soft-declines and the cascade settles it on the backup, ending on `succeeded` from the
   connector Hanzo's own code names. It runs by itself while on screen; tap a step to hold it.
   Beyond: "Move a percentage first". Drag how much traffic goes to a second processor: a hundred payments re-route
   between the two, the shares read out huge, and "Roll back at once" sends it all home. Built only from Hanzo's use cases.
   Motion: the checkout (signature) + Stage (the phone rises and settles) + sticky chapters + cards that open (BizOpen).
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import { Code, useLive } from '../cloud/Frame';
import BizStage from '../../v2/BizStage';
import BizChapters from '../../v2/BizChapters';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
import './Payments.css';

const API = 'https://docs.hanzo.ai/docs/openapi';
const QUICK = 'https://docs.hanzo.ai/docs/quickstart';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const two = (n) => String(n).padStart(2, '0');

const METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'iDEAL', 'Bancontact', 'SOFORT'];
const STEPS = [
  ['One integration', 'Cards, wallets, bank debits, buy-now-pay-later and crypto through the same API'],
  ['No card data', 'Numbers are tokenized in the vault, so this service never holds one'],
  ['Route on outcome', 'Send each payment to the processor most likely to approve it'],
  ['Retry elsewhere', 'A decline cascades to a backup rather than to your customer'],
];
const DUR = [3400, 3400, 3400, 5600];
const PICK = [4, 3, 6, 0];
const Lock = () => <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* What the phone's screen shows at each of the four steps. */
function Screen({ at, live }) {
  const [m, setM] = useState(0);
  const [picked, setPicked] = useState(true);
  useEffect(() => {
    if (at !== 0 || !live) { setM(0); setPicked(true); return; }
    setPicked(false);
    const ts = PICK.map((v, i) => setTimeout(() => { setM(v); if (i === PICK.length - 1) setPicked(true); }, 150 + i * 620));
    return () => ts.forEach(clearTimeout);
  }, [at, live]);
  const inn = (d) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: EASE, delay: d } });
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={at} className="pay-scr" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
        {at === 0 && (
          <>
            <ul className="pay-methods">{METHODS.map((t, i) => <li key={t} className={i === m ? (picked ? 'on' : 'hov') : ''}>{t}</li>)}</ul>
            <p className="pay-scr-api x-mono">hanzo.payments.create</p>
          </>
        )}
        {at === 1 && (
          <div className="pay-vault">
            <motion.p className="pay-field" initial={{ opacity: 1 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.6, duration: 0.6 }}>
              <span>Card</span>
              <b className="x-mono">{['••••', '••••', '••••', '••••'].map((g, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.14, duration: 0.2 }}>{g}</motion.span>)}</b>
            </motion.p>
            <motion.i className="pay-down" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.75 }} />
            <motion.p className="pay-tok x-mono" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.25, type: 'spring', stiffness: 300, damping: 30 }}><Lock />vault token</motion.p>
          </div>
        )}
        {at === 2 && (
          <div className="pay-rule">
            {['cost', 'success rate', 'latency'].map((t, i) => (
              <motion.p key={t} {...inn(0.1 + i * 0.1)} className={i === 1 ? 'pick' : ''}><span>{t}</span>{i === 1 && <motion.b initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.85, type: 'spring', stiffness: 300, damping: 30 }}>rule</motion.b>}</motion.p>
            ))}
            <motion.p className="pay-pick x-mono" {...inn(1.25)}>→ most likely to approve</motion.p>
          </div>
        )}
        {at === 3 && (
          <ol className="pay-try">
            <motion.li {...inn(0.1)}><span>attempt 1</span><motion.b className="x-mono no" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>soft decline</motion.b></motion.li>
            <motion.li {...inn(1.2)}><span>attempt 2 · backup</span><motion.b className="x-mono ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>&apos;succeeded&apos;</motion.b></motion.li>
            <motion.li className="pay-conn" {...inn(2.3)}><span className="x-mono">payment.connector</span><b className="x-mono">&apos;adyen&apos;</b></motion.li>
          </ol>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* The phone: the merchant, the amount, the step's screen and the Pay button that ends on `succeeded`. */
function Phone({ at, live, big }) {
  const calm = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (at !== 3) { setOk(false); return; }
    const t = setTimeout(() => setOk(true), calm ? 0 : 2400);
    return () => clearTimeout(t);
  }, [at, calm]);
  return (
    <div className={'pay-phone' + (big ? ' big' : '')} data-cursor="Watch">
      <div className="pay-phone-in">
        <i className="pay-island" aria-hidden="true" />
        <div className="pay-merch"><img src="/models/enso.webp" alt="" width="48" height="48" /><span><b>Order 6735</b><em className="x-mono">usd</em></span></div>
        <p className="pay-amt"><span className="x-mono">amount: 2000</span><b className="bz-fig">$20.00</b></p>
        <div className="pay-scr-wrap"><Screen at={at} live={live} /></div>
        <div className={'pay-btn' + (ok ? ' ok' : '')}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={ok ? 'ok' : 'pay'} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{ok ? <><Check />succeeded</> : 'Pay'}</motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Tracker({ at, pick, run }) {
  return (
    <div className="pay-track">
      <p className="pay-track-k"><span>A payment, routed</span><span className="x-mono">{two(at + 1)} / 04</span></p>
      <ol>
        {STEPS.map(([t], i) => (
          <li key={t} className={at === i ? 'on' : i < at ? 'past' : ''}>
            <button type="button" aria-pressed={at === i} onClick={() => pick(i)}>
              <span className="x-mono">{two(i + 1)}</span><b>{t}</b>
              <i className="pay-track-bar" aria-hidden="true">{at === i && run && <motion.b key={'b' + at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR[i] / 1000, ease: 'linear' }} />}</i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  const [ref, live, calm] = useLive(0.25);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => { if (calm) setAt(3); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => (held ? setHeld(false) : setAt((a) => (a + 1) % 4)), held ? 9000 : DUR[at]);
    return () => clearTimeout(t);
  }, [at, live, held]);
  return (
    <section className="pay-hero" ref={ref} aria-labelledby="pay-h1">
      <div className="bz-wrap pay-head">
        <p className="bz-kick">Payment orchestration</p>
        <h1 id="pay-h1" className="bz-display">Hanzo Payments</h1>
      </div>
      <div className="bz-wrap bz-grid pay-hero-grid">
        <p className="bz-lede pay-lede">One integration, and the processor becomes a routing decision.</p>
        <BizStage from={1.04} over={720} lift={50} className="pay-stage"><div className="pay-rise"><Phone at={at} live={live} big /></div></BizStage>
        <div className="pay-side">
          <div className="bz-acts">
            <A to="/login" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A>
            <A to={API} className="x-btn">Explore APIs</A>
          </div>
          <Tracker at={at} pick={(i) => { setAt(i); setHeld(true); }} run={live && !held} />
        </div>
      </div>
    </section>
  );
}

/* Chapter stage: the same phone, pinned, beside the route the payment takes through Hanzo. */
function Route({ at }) {
  const rows = ['payments.create', 'vault', 'rule'];
  return (
    <div className="pay-route" aria-hidden="true">
      <div className={'pay-wire' + (at >= 0 ? ' on' : '')}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={at === 0 ? 'm' : 't'} className="pay-wire-chip x-mono" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.35, ease: EASE }}>{at === 0 ? 'Visa' : <><Lock />vault token</>}</motion.span>
        </AnimatePresence>
      </div>
      <div className="pay-hub">
        <p className="pay-hub-k x-mono">hanzo</p>
        {rows.map((t, i) => <p key={t} className={'x-mono' + (at === i ? ' on' : at > i ? ' past' : '')}>{t}</p>)}
      </div>
      <svg className="pay-fork" viewBox="0 0 400 90" preserveAspectRatio="none">
        <path className={at === 2 ? 'on' : at === 3 ? 'no' : ''} d="M200 0 C 200 50, 100 40, 100 90" />
        <path className={at === 3 ? 'on' : ''} d="M200 0 C 200 50, 300 40, 300 90" />
      </svg>
      <div className="pay-procs">
        <div className={'pay-proc' + (at === 2 ? ' on' : at === 3 ? ' no' : '')}>
          <span className="x-mono">processor</span>
          <b>{at === 3 ? 'soft decline' : at === 2 ? 'most likely to approve' : '—'}</b>
        </div>
        <div className={'pay-proc' + (at === 3 ? ' on' : '')}>
          <span className="x-mono">backup</span>
          <b>{at === 3 ? "'succeeded'" : '—'}</b>
          {at === 3 && <em className="x-mono">&apos;adyen&apos;</em>}
        </div>
      </div>
    </div>
  );
}

function ChStage({ at }) {
  const [ref, live] = useLive(0.3);
  return (
    <div className="pay-chs" ref={ref}>
      <Phone at={at} live={live} />
      <Route at={at} />
    </div>
  );
}

const Note = ({ t, d }) => <div className="pay-note"><p className="pay-note-t">{t}</p><p>{d}</p></div>;
const CH = [
  <Note key="w" t="Normalized webhooks" d="Every processor announces a settlement differently. You subscribe to one event shape and keep it when you add or drop a provider." />,
  null,
  <Note key="s" t="Smart routing" d="Choose the processor per payment on cost, success rate or latency. The rule lives here, so tuning it is a config change rather than a deploy." />,
  <Note key="c" t="Cascading retries" d="A soft decline is often a fact about one processor, not about the card. Failed attempts fall through to a backup automatically, and the customer sees one outcome." />,
];

const CODE = `// Take a payment. You do not name the processor.
const payment = await hanzo.payments.create({
  amount: 2000,
  currency: 'usd',
  customer: customer.id,
  metadata: { order_id: '6735' },
});

// The routing rule picked one, and says so.
// If it had declined, the cascade would already
// have tried the next and told you that instead.
console.log(payment.status);    // 'succeeded'
console.log(payment.connector); // 'adyen'`;

const PIPE = ['Approval rates, cost and latency compared across processors, on one screen.', '3D Secure where the issuer asks for it, without a second integration.', 'Open source, so the routing logic is readable before you trust it.'];
const DEV = [['Easy to Implement', 'Quick integration with just a few lines of code, with SDKs for all major programming languages.'], ['Comprehensive Documentation', 'Detailed guides, API reference, and code examples to help you integrate Hanzo Payments quickly.'], ['Explore Our APIs', 'Get started with quickstart guides, examples, and developer tools.']];

function OneApi() {
  return (
    <section className="bz-sec pay-api" aria-labelledby="pay-api-h">
      <div className="bz-wrap bz-grid">
        <div className="pay-api-copy">
          <p className="bz-kick"><span className="x-mono">hanzo.payments.create</span></p>
          <h2 id="pay-api-h" className="bz-headline">One API in front of all of them</h2>
          <p className="bz-body">The connectors are the product. Each is a real implementation of one processor’s API, kept behind a single interface so your side never learns their differences.</p>
          <div className="pay-api-note">
            <h3 className="bz-title">The processor is not in your code</h3>
            <p className="bz-body">You ask for a payment. Which company took it is an answer, not an argument.</p>
          </div>
          <div className="pay-api-acts">
            <More to={API}>API Reference</More>
            <BizSheet label="See the spec" kick="Hanzo Payments" title="Explore Our APIs">
              <ul className="pay-sheet-list">
                {DEV.map(([t, d]) => <li key={t}><h3 className="bz-title">{t}</h3><p className="bz-body">{d}</p></li>)}
              </ul>
              <A to={API} className="x-btn solid pay-sheet-go">API Reference</A>
            </BizSheet>
          </div>
        </div>
        <div className="pay-api-code"><Code tabs={[{ k: 'javascript', code: CODE }]} light mark="'adyen'" /></div>
        <div className="pay-pipe">
          <h3 className="bz-title">What you can see once it is one pipe</h3>
          <ul>{PIPE.map((t) => <li key={t}><Check /><span>{t}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

const FEATS = [
  ['Checkout Interface', 'Fully customizable checkout UI that matches your brand and maximizes conversions.', 'Customizable checkout flow'],
  ['Global Reach', 'Regional processors are connectors like any other, so entering a market is a routing rule rather than a new integration.'],
  ['Mobile Optimized', 'Responsive checkout flows designed for high conversion on all devices and screen sizes.'],
  ['Fully Customizable', 'Customize every aspect of the checkout experience to match your brand identity.'],
];

function Checkout() {
  return (
    <section className="bz-sec pay-co" aria-labelledby="pay-co-h">
      <div className="bz-wrap">
        <div className="bz-grid pay-co-top">
          <h2 id="pay-co-h" className="bz-display sm">Customizable Checkout Experiences</h2>
          <div className="pay-co-side">
            <p className="bz-body">Create beautiful, high-converting checkout flows that drive revenue growth and customer satisfaction.</p>
            <BizSheet label="See the checkout" kick="Checkout" title="Customizable Checkout Experiences">
              <ul className="pay-sheet-list">
                {FEATS.map(([t, d, tag]) => <li key={t}><h3 className="bz-title">{t}</h3><p className="bz-body">{d}</p>{tag && <span className="pay-tag x-mono">{tag}</span>}</li>)}
              </ul>
            </BizSheet>
          </div>
        </div>
        <h3 className="bz-kick pay-co-k">Global Payment Methods</h3>
        <ul className="pay-co-methods">{METHODS.map((t) => <li key={t}>{t}</li>)}</ul>
        <ul className="bz-grid pay-co-lines">
          {['Cards, wallets, bank debits, buy-now-pay-later and crypto', 'Local methods handled by whichever processor supports them best', 'The method someone expects to see, in the country they are in'].map((t, i) => <li key={t}><span className="x-mono">{two(i + 1)}</span>{t}</li>)}
        </ul>
      </div>
    </section>
  );
}

const Shield = () => <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 10 14v16c0 14 9.5 24 22 28 12.5-4 22-14 22-28V14z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M22 32l7 7 13-14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const TAX = [
  ['tax', 'Automated Tax Management', 'Automatically handle VAT, GST, and regional taxes (including sales tax).', ['Real-time tax rate calculation', 'Tax exemption handling', 'Automated tax reporting'], <span className="pay-glyph bz-fig" key="g">VAT<br />GST</span>],
  ['fraud', 'Fraud Protection', 'Automatic fraud detection and prevention built-in to protect your business.', ['Machine learning fraud detection', 'Adaptive risk rules', 'Chargeback protection'], <span className="pay-glyph shield" key="g"><Shield /></span>],
];

function Tax() {
  return (
    <section className="bz-sec pay-tax" aria-labelledby="pay-tax-h">
      <div className="bz-wrap bz-grid">
        <BizOpen
          label="Automatic Global Tax Compliance"
          className="pay-tax-open"
          items={TAX.map(([id, t, d, li, g]) => ({
            id,
            label: t,
            card: <>{g}<span className="pay-tc-t bz-title">{t}</span><span className="pay-tc-d">{d}</span></>,
            panel: (
              <div className="pay-panel">
                <div className="pay-panel-g">{g}</div>
                <div>
                  <p className="bz-kick">Automatic Global Tax Compliance</p>
                  <h3 className="bz-headline">{t}</h3>
                  <p className="bz-lede">{d}</p>
                  <ul className="pay-panel-list">{li.map((x) => <li key={x}><Check />{x}</li>)}</ul>
                </div>
              </div>
            ),
          }))}
        />
        <div className="pay-tax-copy">
          <h2 id="pay-tax-h" className="bz-headline">Automatic Global Tax Compliance</h2>
          <p className="bz-body">Focus on your business while Hanzo handles the complexity of global tax regulations and compliance.</p>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the traffic split. A hundred payments, each with a fixed place in the queue; the share you drag re-routes them. */
const RANK = (() => {
  const a = [...Array(100).keys()];
  let s = 11;
  for (let i = 99; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
})();

function Move() {
  const [pct, setPct] = useState(20);
  const prev = useRef(20);
  const from = prev.current;
  useEffect(() => { prev.current = pct; }, [pct]);
  return (
    <section className="bz-sec pay-move" data-room="dark" aria-labelledby="pay-move-h">
      <div className="bz-wrap">
        <div className="bz-grid pay-move-top">
          <div className="pay-move-h">
            <p className="bz-kick">One traffic, two routes</p>
            <h2 id="pay-move-h" className="bz-display md">Move a percentage first</h2>
          </div>
          <p className="bz-body pay-move-b">The reason nobody switches is the rewrite. When the integration is here, moving is a routing change, and you can move a percentage first.</p>
        </div>
        <div className="pay-move-obj">
          <div className="pay-move-figs" aria-live="polite">
            <p className="b"><span>second processor</span><b className="bz-fig">{pct}%</b></p>
            <p><span>current processor</span><b className="bz-fig">{100 - pct}%</b></p>
          </div>
          <label className="pay-move-bar">
            <span className="bz-kick">Split by percentage</span>
            <input type="range" min="0" max="100" step="5" value={pct} onChange={(e) => setPct(+e.target.value)} style={{ '--f': pct / 100 }} aria-valuetext={pct + '% to the second processor'} />
          </label>
          <div className="pay-move-dots" aria-hidden="true">
            {RANK.map((r, i) => <i key={i} className={r < pct ? 'b' : ''} style={{ '--d': Math.min(600, Math.abs(r - from) * 14) + 'ms' }} />)}
          </div>
          <div className="pay-move-acts">
            <button type="button" className="x-btn" onClick={() => setPct(0)} disabled={pct === 0}>Roll back at once</button>
            <p className="pay-move-key x-mono"><i className="b" />second processor<i />current processor</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  ['Selling in several countries', 'You sell in more than one country and each one wants a different payment method. Add the connector, write the rule, leave the checkout alone.', ['Local methods', 'Currency routing', 'One checkout', 'Rules per country']],
  ['Recovering declines', 'Renewals fail for reasons that have nothing to do with the customer. Retrying through a second processor turns some of those failures back into payments.', ['Retry on a second processor', 'Decline reasons', 'Renewal recovery', 'Rules per code']],
  ['Leaving a processor', 'The reason nobody switches is the rewrite. When the integration is here, moving is a routing change, and you can move a percentage first.', ['Move a percentage first', 'No checkout rewrite', 'The same API', 'Roll back at once']],
  ['Comparing two of them', 'Run both and read the approval rates side by side. The argument about which processor is better becomes a measurement.', ['Approval rates side by side', 'Split by percentage', 'One traffic, two routes', 'Cost per authorization']],
];

function Cases() {
  return (
    <section className="bz-sec pay-cases" aria-labelledby="pay-cases-h">
      <div className="bz-wrap">
        <div className="bz-grid pay-cases-top">
          <h2 id="pay-cases-h" className="bz-display sm">When a switch earns its place</h2>
          <p className="bz-lede">One processor and one country does not need one. These four do.</p>
        </div>
        <BizOpen
          label="When a switch earns its place"
          className="pay-case-grid"
          items={CASES.map(([t, d, f], i) => ({
            id: 'case' + i,
            label: t,
            className: 'pay-case c' + i,
            card: <><span className="pay-case-n bz-fig">{two(i + 1)}</span><span className="pay-case-t bz-title">{t}</span><span className="pay-case-f x-mono">{f.join(' · ')}</span></>,
            panel: (
              <div className="pay-cp">
                <p className="bz-kick"><span className="x-mono">{two(i + 1)}</span>&ensp;When a switch earns its place</p>
                <h3 className="bz-display sm">{t}</h3>
                <p className="bz-lede">{d}</p>
                <h4 className="bz-kick">Key Features</h4>
                <ul className="pay-cp-f">{f.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The close: one action (Try Hanzo), the two places to read further, and the Get block. */
function End() {
  return (
    <section className="bz-sec pay-end" aria-labelledby="pay-one">
      <div className="bz-wrap bz-grid">
        <div className="pay-end-one">
          <h2 id="pay-one" className="bz-display md">Put one payment through it</h2>
          <p className="bz-lede">Point it at the processor you already use, send a live payment, and add the second one when you want to see the difference. Nothing has to move on day one.</p>
          <div className="bz-acts"><A to="/login" className="x-btn solid">Try Hanzo</A><More to="/contact-sales">Contact Sales</More></div>
        </div>
        <div className="pay-end-fur">
          <h3 className="bz-title">Explore Further</h3>
          <p className="bz-body">The API reference, and the guide to putting the checkout on your site.</p>
          <A to={API} className="pay-fur-a"><b>API Reference</b><span>Detailed documentation on all Hanzo Payments APIs and integration options.</span><em>View API Docs →</em></A>
          <A to={QUICK} className="pay-fur-a"><b>Checkout Integration</b><span>Step-by-step guide to integrating Hanzo Payments checkout into your website or app.</span><em>Integration Guide →</em></A>
        </div>
        <div className="pay-get">
          <h2 className="pay-get-h">Get Payments</h2>
          <p className="pay-get-t">Payments processor</p>
          <span className="pay-chip"><span>License:</span> Apache-2.0</span>
          <A to={GH} className="pay-chip"><Gh />hanzoai</A>
          <More to={DEPLOY}>Deploy to Cloud</More>
        </div>
      </div>
    </section>
  );
}

export default function Payments() {
  return (
    <main className="bz pay" style={{ '--acc': '#5b3df5' }}>
      <Hero />
      <BizChapters label="A payment, routed" className="pay-ch" items={STEPS.map(([t, d], i) => ({ t, d, x: CH[i] }))} stage={(at) => <ChStage at={at} />}>
        <header className="bz-wrap bz-grid pay-ch-head">
          <div className="pay-ch-h">
            <p className="bz-kick">Unified Payments Suite</p>
            <h2 className="bz-display md">What sits behind the one integration</h2>
          </div>
          <p className="bz-body">Each processor has its own API, its own idea of an error, and its own webhook format. This normalises all three, so your code sees one shape whichever of them took the payment.</p>
        </header>
      </BizChapters>
      <OneApi />
      <Checkout />
      <Tax />
      <Move />
      <Cases />
      <End />
    </main>
  );
}
