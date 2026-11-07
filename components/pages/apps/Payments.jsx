'use client';
/* Payments. Signature: a checkout settling, on a phone in the middle of the hero. The payment walks Hanzo's four
   steps beside it (one integration, no card data, route on outcome, retry elsewhere): a method is picked, the number
   becomes a vault token, the rule picks a processor, the first one soft-declines and the cascade settles it on the
   backup, ending on `succeeded` from the connector Hanzo's own code names. Tap a step to hold it.
   Beyond: "Move a percentage first". Drag how much traffic goes to a second processor and watch payments split
   between the two routes; "Roll back at once" sends it all home. Built only from Hanzo's own use cases.
   Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More, Tick } from '../../kit';
import { Code, Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Payments.css';

const API = 'https://docs.hanzo.ai/docs/openapi';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'iDEAL', 'Bancontact', 'SOFORT'];
const STEPS = [
  ['One integration', 'Cards, wallets, bank debits, buy-now-pay-later and crypto through the same API'],
  ['No card data', 'Numbers are tokenized in the vault, so this service never holds one'],
  ['Route on outcome', 'Send each payment to the processor most likely to approve it'],
  ['Retry elsewhere', 'A decline cascades to a backup rather than to your customer'],
];

/* What the phone shows at each step. */
function Screen({ at, live }) {
  const [m, setM] = useState(4);
  useEvery(900, live && at === 0, () => setM((v) => (v + 1) % METHODS.length));
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={at} className="pay-scr" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
        {at === 0 && (
          <>
            <ul className="pay-methods">{METHODS.map((t, i) => <li key={t} className={i === m ? 'on' : ''}>{t}</li>)}</ul>
            <p className="pay-api x-mono">hanzo.payments.create</p>
          </>
        )}
        {at === 1 && (
          <div className="pay-vault">
            <p className="pay-field"><span>Card</span><b className="x-mono">•••• •••• •••• ••••</b></p>
            <motion.i className="pay-down" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} />
            <motion.p className="pay-tok x-mono" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 380, damping: 22 }}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>vault token
            </motion.p>
          </div>
        )}
        {at === 2 && (
          <div className="pay-rule">
            {['cost', 'success rate', 'latency'].map((t, i) => (
              <motion.p key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: EASE }} className={i === 1 ? 'on' : ''}><span>{t}</span>{i === 1 && <b>rule</b>}</motion.p>
            ))}
            <motion.p className="pay-pick x-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>→ most likely to approve</motion.p>
          </div>
        )}
        {at === 3 && (
          <ol className="pay-try">
            <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><span>attempt 1</span><b className="x">soft decline</b></motion.li>
            <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}><span>attempt 2 · backup</span><b className="ok">'succeeded'</b></motion.li>
            <motion.li className="pay-conn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}><span>payment.connector</span><b>'adyen'</b></motion.li>
          </ol>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function Hero() {
  const [ref, live] = useLive(0.3);
  const [at, choose, mine] = useSteps(4, 3600, live);
  const done = at === 3;
  return (
    <section className="pay-hero" ref={ref} aria-labelledby="pay-h1">
      <div className="x-wrap pay-hero-grid">
        <div className="pay-copy">
          <motion.p className="pay-kick" {...up(0)}>Payment orchestration</motion.p>
          <h1 id="pay-h1" className="pay-h1">
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo</motion.span></span>
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>Payments</motion.span></span>
          </h1>
          <motion.p className="pay-lede" {...up(0.35)}>One integration, and the processor becomes a routing decision.</motion.p>
          <motion.div className="pay-acts" {...up(0.45)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login" className="x-btn solid" data-thumb>Try Hanzo</A></motion.span>
            <Go to={API}>Explore APIs</Go>
          </motion.div>
        </div>
        <motion.div className="pay-phone" initial={{ opacity: 0, y: 40, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }} data-cursor="Watch">
          <div className="pay-phone-in">
            <div className="pay-merch"><img src="/models/enso.webp" alt="" /><span><b>Order 6735</b><em className="x-mono">usd</em></span></div>
            <p className="pay-amt"><span className="x-mono">amount: 2000</span><b>$20.00</b></p>
            <div className="pay-scr-wrap"><Screen at={at} live={live} /></div>
            <motion.div className={'pay-btn' + (done ? ' ok' : '')} animate={{ scale: done ? [1, 0.96, 1] : 1 }} transition={{ duration: 0.5, delay: done ? 1.6 : 0 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={done ? 'ok' : 'pay'} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.35, ease: EASE, delay: done ? 1.6 : 0 }}>{done ? 'succeeded' : 'Pay'}</motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
        <div className="pay-steps">
          <p className="pay-steps-k"><span>A payment, routed</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <ol>
            {STEPS.map(([t, d], i) => (
              <li key={t} className={at === i ? 'on' : i < at ? 'past' : ''}>
                <button type="button" aria-pressed={at === i} onClick={() => choose(i)}>
                  <span className="pay-sn x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <b>{t}</b>
                  <span className="pay-sd">{d}</span>
                  <i className="pay-sbar">{at === i && !mine && <motion.b key={'b' + at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.6, ease: 'linear' }} />}</i>
                </button>
              </li>
            ))}
          </ol>
          <p className="x-sr">01 / 04 02 / 04 03 / 04 04 / 04</p>
        </div>
      </div>
    </section>
  );
}

const SUITE = [
  ['Smart routing', 'Choose the processor per payment on cost, success rate or latency. The rule lives here, so tuning it is a config change rather than a deploy.'],
  ['Cascading retries', 'A soft decline is often a fact about one processor, not about the card. Failed attempts fall through to a backup automatically, and the customer sees one outcome.'],
  ['Normalized webhooks', 'Every processor announces a settlement differently. You subscribe to one event shape and keep it when you add or drop a provider.'],
];

/* Three processors, three shapes of API, error and webhook, drawn as three different lines that leave as one. */
function Converge() {
  return (
    <svg className="pay-conv" viewBox="0 0 600 220" aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 30 C 60 30, 80 60, 140 40 S 230 20, 300 110" />
      <path d="M0 110 L 40 90 L 80 130 L 120 90 L 160 130 L 200 90 L 240 130 L 300 110" />
      <path d="M0 190 Q 50 150 100 190 T 200 190 T 300 110" />
      <path className="one" d="M300 110 L 600 110" />
      <circle cx="300" cy="110" r="7" />
    </svg>
  );
}

function Suite() {
  return (
    <section className="x-sec pay-suite">
      <div className="x-wrap">
        <div className="pay-suite-top">
          <Rise as="h2" y={20}>What sits behind the one integration</Rise>
          <Rise as="p" delay={0.1}>Each processor has its own API, its own idea of an error, and its own webhook format. This normalises all three, so your code sees one shape whichever of them took the payment.</Rise>
        </div>
        <Rise className="pay-conv-wrap"><Converge /><span className="pay-conv-k x-mono">Unified Payments Suite</span></Rise>
        <h3 className="x-sr">Unified Payments Suite</h3>
        <div className="pay-suite-cols">
          {SUITE.map(([t, d], i) => (
            <Rise key={t} className="pay-suite-col" delay={i * 0.08}>
              <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </Rise>
          ))}
        </div>
        <Rise className="pay-pipe">
          <h3>What you can see once it is one pipe</h3>
          <ul>
            {['Approval rates, cost and latency compared across processors, on one screen.', '3D Secure where the issuer asks for it, without a second integration.', 'Open source, so the routing logic is readable before you trust it.'].map((t) => <li key={t}><Tick size={18} />{t}</li>)}
          </ul>
        </Rise>
      </div>
    </section>
  );
}

function Tax() {
  const words = ['VAT', 'GST', 'sales tax', 'regional taxes'];
  return (
    <section className="x-sec pay-tax" data-room="dark">
      <div className="x-wrap">
        <header className="pay-tax-h">
          <Rise as="h2" y={20}>Automatic Global Tax Compliance</Rise>
          <Rise as="p" delay={0.1}>Focus on your business while Hanzo handles the complexity of global tax regulations and compliance.</Rise>
        </header>
        <div className="pay-tax-run" aria-hidden="true">
          <div className="pay-tax-track">{[0, 1].map((k) => <span key={k}>{words.map((w) => <b key={w}>{w}</b>)}</span>)}</div>
        </div>
        <div className="pay-tax-grid">
          {[
            ['Automated Tax Management', 'Automatically handle VAT, GST, and regional taxes (including sales tax).', ['Real-time tax rate calculation', 'Tax exemption handling', 'Automated tax reporting']],
            ['Fraud Protection', 'Automatic fraud detection and prevention built-in to protect your business.', ['Machine learning fraud detection', 'Adaptive risk rules', 'Chargeback protection']],
          ].map(([t, d, li], i) => (
            <Rise key={t} className="pay-tax-card" delay={i * 0.1}>
              <h3>{t}</h3>
              <p>{d}</p>
              <ul>{li.map((x) => <li key={x}><Tick size={18} />{x}</li>)}</ul>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function Checkout() {
  return (
    <section className="x-sec pay-co">
      <div className="x-wrap pay-co-grid">
        <div className="pay-co-left">
          <Rise as="h2" y={20}>Customizable Checkout Experiences</Rise>
          <Rise as="p" className="pay-co-l" delay={0.1}>Create beautiful, high-converting checkout flows that drive revenue growth and customer satisfaction.</Rise>
          <Rise className="pay-cloud">
            <h3>Global Payment Methods</h3>
            <div className="pay-rows" aria-hidden="true">
              {[0, 1].map((r) => (
                <div key={r} className={'pay-row ' + (r ? 'rev' : '')}>
                  {[0, 1].map((k) => <span key={k}>{(r ? [...METHODS].reverse() : METHODS).map((t) => <b key={t}>{t}</b>)}</span>)}
                </div>
              ))}
            </div>
            <ul className="x-sr">{METHODS.map((t) => <li key={t}>{t}</li>)}</ul>
            <ul className="pay-cloud-l">
              {['Cards, wallets, bank debits, buy-now-pay-later and crypto', 'Local methods handled by whichever processor supports them best', 'The method someone expects to see, in the country they are in'].map((t) => <li key={t}>{t}</li>)}
            </ul>
          </Rise>
        </div>
        <ul className="pay-co-list">
          {[
            ['Checkout Interface', 'Fully customizable checkout UI that matches your brand and maximizes conversions.', 'Customizable checkout flow'],
            ['Global Reach', 'Regional processors are connectors like any other, so entering a market is a routing rule rather than a new integration.'],
            ['Mobile Optimized', 'Responsive checkout flows designed for high conversion on all devices and screen sizes.'],
            ['Fully Customizable', 'Customize every aspect of the checkout experience to match your brand identity.'],
          ].map(([t, d, tag], i) => (
            <Rise as="li" key={t} delay={i * 0.06} y={18}>
              <h3>{t}</h3>
              <p>{d}</p>
              {tag && <span className="pay-tag x-mono">{tag}</span>}
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

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

function OneApi() {
  return (
    <section className="x-sec pay-api-sec">
      <div className="x-wrap">
        <header className="pay-api-h">
          <Rise as="h2" y={20}>One API in front of all of them</Rise>
          <Rise as="p" delay={0.1}>The connectors are the product. Each is a real implementation of one processor’s API, kept behind a single interface so your side never learns their differences.</Rise>
        </header>
        <div className="pay-api-grid">
          <div className="pay-api-copy">
            <Rise as="h3">The processor is not in your code</Rise>
            <Rise as="p" delay={0.06}>You ask for a payment. Which company took it is an answer, not an argument.</Rise>
            <div className="x-row-links tight"><More to={API}>API Reference</More></div>
            <ul className="pay-api-list">
              {[['Easy to Implement', 'Quick integration with just a few lines of code, with SDKs for all major programming languages.'], ['Comprehensive Documentation', 'Detailed guides, API reference, and code examples to help you integrate Hanzo Payments quickly.'], ['Explore Our APIs', 'Get started with quickstart guides, examples, and developer tools.']].map(([t, d], i) => (
                <Rise as="li" key={t} delay={i * 0.06} y={14}><h3>{t}</h3><p>{d}</p></Rise>
              ))}
            </ul>
            <A to={API} className="x-btn sm">API Reference</A>
          </div>
          <Rise delay={0.1}><Code tabs={[{ k: 'javascript', code: CODE }]} mark="'adyen'" /></Rise>
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

/* Beyond: a traffic split you drag. Dots are payments; the share you choose takes the second route. */
function Split() {
  const [ref, live] = useLive(0.3);
  const [pct, setPct] = useState(20);
  const [dots, setDots] = useState([]);
  const [count, setCount] = useState([0, 0]);
  useEvery(320, live, () => {
    const second = Math.random() * 100 < pct;
    setDots((d) => [...d.slice(-13), { id: Date.now() + Math.random(), r: second ? 1 : 0 }]);
    setCount((c) => (second ? [c[0], c[1] + 1] : [c[0] + 1, c[1]]));
  });
  const total = count[0] + count[1] || 1;
  return (
    <div className="pay-split" ref={ref}>
      <p className="pay-split-k">One traffic, two routes</p>
      <div className="pay-lanes" aria-hidden="true">
        <span className="pay-src">payments</span>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none"><path d="M0 60 C 90 60, 110 22, 300 22" /><path d="M0 60 C 90 60, 110 98, 300 98" /></svg>
        {dots.map((d) => <i key={d.id} className={'pay-dot r' + d.r} />)}
        <span className="pay-dst a"><b>current processor</b><em className="x-mono">{Math.round((count[0] / total) * 100)}%</em></span>
        <span className="pay-dst b"><b>second processor</b><em className="x-mono">{Math.round((count[1] / total) * 100)}%</em></span>
      </div>
      <label className="pay-range">
        <span>Move a percentage first <b className="x-mono">{pct}%</b></span>
        <input type="range" min="0" max="100" step="5" value={pct} onChange={(e) => { setPct(+e.target.value); setCount([0, 0]); }} aria-valuetext={pct + '% to the second processor'} />
      </label>
      <div className="pay-split-acts">
        <button type="button" className="x-btn sm" onClick={() => { setPct(0); setCount([0, 0]); }}>Roll back at once</button>
        <button type="button" className="x-btn sm" onClick={() => { setPct(50); setCount([0, 0]); }}>Split by percentage</button>
      </div>
    </div>
  );
}

function Cases() {
  const [open, setOpen] = useState(2);
  return (
    <section className="x-sec pay-cases">
      <div className="x-wrap">
        <header className="pay-cases-h">
          <Rise as="h2" y={20}>When a switch earns its place</Rise>
          <Rise as="p" delay={0.1}>One processor and one country does not need one. These four do.</Rise>
        </header>
        <div className="pay-cases-grid">
          <ul className="pay-case-list">
            {CASES.map(([t, d, f], i) => (
              <li key={t} className={open === i ? 'on' : ''}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3>
                </button>
                <motion.div className="pay-case-b" initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={open !== i}>
                  <p>{d}</p>
                  <h4>Key Features</h4>
                  <ul>{f.map((x) => <li key={x}>{x}</li>)}</ul>
                </motion.div>
              </li>
            ))}
          </ul>
          <Rise className="pay-cases-side"><Split /></Rise>
        </div>
      </div>
    </section>
  );
}

function Further() {
  return (
    <section className="x-sec pay-fur">
      <div className="x-wrap pay-fur-grid">
        <div>
          <Rise as="h2" y={20}>Explore Further</Rise>
          <Rise as="p" delay={0.08}>The API reference, and the guide to putting the checkout on your site.</Rise>
          <div className="pay-fur-links">
            <A to={API} className="pay-fur-a"><h3>API Reference</h3><p>Detailed documentation on all Hanzo Payments APIs and integration options.</p><span>View API Docs →</span></A>
            <A to="https://docs.hanzo.ai/docs/quickstart" className="pay-fur-a"><h3>Checkout Integration</h3><p>Step-by-step guide to integrating Hanzo Payments checkout into your website or app.</p><span>Integration Guide →</span></A>
          </div>
        </div>
        <Rise className="pay-one" delay={0.1}>
          <h2>Put one payment through it</h2>
          <p>Point it at the processor you already use, send a live payment, and add the second one when you want to see the difference. Nothing has to move on day one.</p>
          <div className="pay-acts"><Go to="/login" solid>Try Hanzo</Go><Go to="/contact-sales">Contact Sales</Go></div>
        </Rise>
      </div>
    </section>
  );
}

export default function Payments() {
  return (
    <main className="pay">
      <Hero />
      <Suite />
      <Tax />
      <Checkout />
      <OneApi />
      <Cases />
      <Further />
      <Get name="Payments" tag="Payments processor" />
    </main>
  );
}
