'use client';
/* Treasury. Signature: the split that writes itself, in a dark room. Hanzo's split.num is written line by line and,
   as each destination is named, its stream of money pours out of @users:001 into its account: 90%, 5%, and the
   remaining, which Numscript works out. When the three meet the amount, the split is marked balanced, then it runs again.
   Beyond: "Hold it, then pay". A wallet with a hold you drive: take $100 at checkout, hold it, then pay the seller on
   delivery or release it, and watch each change of state arrive as an event. Hanzo's wallets-with-holds, made playable.
   Also: what it is made of, as a strip whose parts open one at a time. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go } from '../../kit';
import { Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Treasury.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/treasury';
const GH = 'https://github.com/hanzoai';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

const CODE = [
  ['c', '// A $100 order, split three ways, written once.'],
  ['c', '// Numscript refuses to run this if the amounts do not add up.'],
  ['', ''],
  ['s', 'send [USD/2 10000] ('],
  ['', '  source = @users:001'],
  ['', '  destination = {'],
  ['d0', '    90% to @merchants:042'],
  ['d1', '    5%  to @fees:processing'],
  ['d2', '    remaining to @platform:revenue'],
  ['', '  }'],
  ['', ')'],
];
const DEST = [['@merchants:042', '90%', 9000], ['@fees:processing', '5%', 500], ['@platform:revenue', 'remaining', 500]];
const N = CODE.length;

/* Three streams out of one source, widths in proportion to the split (with a floor so 5% still reads). */
function Streams({ shown, done }) {
  const y = [70, 200, 300];
  const w = [104, 16, 16];
  return (
    <div className="ts-flow" aria-hidden="true">
      <div className="ts-src"><span className="x-mono">@users:001</span><b className="x-mono">10,000</b></div>
      <svg viewBox="0 0 400 360" preserveAspectRatio="none">
        {DEST.map((_, i) => {
          const s = 130 + (i === 0 ? -8 : i === 1 ? 54 : 70);
          return (
            <motion.path key={i} d={`M0 ${s} C 180 ${s}, 220 ${y[i]}, 400 ${y[i]}`} strokeWidth={w[i]} initial={false} animate={{ pathLength: shown[i] ? 1 : 0, opacity: shown[i] ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }} />
          );
        })}
      </svg>
      <ul className="ts-dst">
        {DEST.map(([a, p, v], i) => (
          <li key={a} className={shown[i] ? 'on' : ''} style={{ top: (i === 0 ? 70 : i === 1 ? 200 : 300) / 3.6 + '%' }}>
            <span className="x-mono">{a}</span>
            <b className="x-mono">{shown[i] ? v.toLocaleString('en-US') : '—'}</b>
            <em>{p}</em>
          </li>
        ))}
      </ul>
      <AnimatePresence>{done && <motion.p className="ts-ok x-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>9,000 + 500 + 500 = 10,000 · balanced</motion.p>}</AnimatePresence>
    </div>
  );
}

function Hero() {
  const [ref, live, calm] = useLive(0.3);
  const [k, setK] = useState(N); // lines written; the page's HTML carries all of them
  useEffect(() => { if (!calm) setK(0); }, [calm]);
  useEvery(380, live, () => setK((v) => (v >= N + 9 ? 0 : v + 1)));
  const has = (tag) => CODE.findIndex((l) => l[0] === tag) < k;
  const shown = [has('d0'), has('d1'), has('d2')];
  return (
    <section className="ts-hero" data-room="dark" ref={ref} aria-labelledby="ts-h1">
      <div className="x-wrap">
        <div className="ts-top">
          <div>
            <motion.p className="ts-kick" {...up(0)}>Treasury Operations</motion.p>
            <h1 id="ts-h1" className="ts-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Treasury</motion.span></span></h1>
          </div>
          <div>
            <motion.p className="ts-lede" {...up(0.3)}>A double-entry ledger for money moving inside your product</motion.p>
            <motion.div className="ts-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={DOCS} className="x-btn solid" data-thumb="Read the docs">Read the docs</A></motion.span>
              <Go to={GH}>GitHub</Go>
            </motion.div>
          </div>
        </div>
        <motion.div className="ts-stage" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <div className="ts-ed">
            <div className="ts-ed-bar"><i /><i /><i /><span className="x-mono">split.num</span></div>
            <pre className="x-mono"><code>
              {CODE.map(([t, l], i) => (
                <span key={i} className={'ts-l ' + (t === 'c' ? 'c' : '') + (i < k ? ' in' : '') + (t.startsWith('d') && i < k ? ' d' : '')}>{l || ' '}{'\n'}</span>
              ))}
            </code></pre>
          </div>
          <Streams shown={shown} done={k >= N} />
        </motion.div>
      </div>
    </section>
  );
}

const PARTS = [
  ['Double-entry ledger', 'A transaction is a set of postings with a source and a destination, and it is rejected unless it balances. Entries are immutable — a correction is another transaction, so history stays true.'],
  ['Reconciliation', 'Match what the ledger believes against what a payment provider reports, and show the rows that disagree. The breaks are the output; agreeing totals need no attention.'],
  ['Accounts and balances', 'Hold balances per account and per currency, and move between them as ledger transactions. What an account settles against is configured per deployment.'],
  ['Wallets with holds', 'Multi-currency virtual wallets that can hold an amount and release it later. That is how you take money at checkout and pay a seller on delivery without the balance lying in between.'],
  ['Flows and webhooks', 'Longer sequences — capture, split, pay out, retry — run as orchestrated flows, and every change of financial state is delivered as an event you can subscribe to.'],
];

/* The five parts as a strip: one is open, the others stand as spines; it walks by itself until you choose. */
function Parts() {
  const [ref, live] = useLive(0.35);
  const [at, choose] = useSteps(PARTS.length, 3800, live);
  return (
    <section className="x-sec ts-parts" ref={ref}>
      <div className="x-wrap">
        <header className="ts-h">
          <Rise as="h2" y={20}>What it is made of</Rise>
          <p>A ledger, a language for writing transactions, and the machinery around them.</p>
        </header>
        <LayoutGroup>
          <ol className="ts-strip">
            {PARTS.map(([t, d], i) => (
              <motion.li layout key={t} className={at === i ? 'on' : ''} transition={{ type: 'spring', stiffness: 160, damping: 24 }} onMouseEnter={() => choose(i)}>
                <button type="button" aria-expanded={at === i} onClick={() => choose(i)}>
                  <motion.span layout="position" className="ts-n x-mono">{String(i + 1).padStart(2, '0')}</motion.span>
                  <motion.span layout="position" className="ts-t">{t}</motion.span>
                </button>
                <motion.p initial={false} animate={{ opacity: at === i ? 1 : 0, y: at === i ? 0 : 10 }} transition={{ duration: 0.4, ease: EASE, delay: at === i ? 0.2 : 0 }} aria-hidden={at !== i}>{d}</motion.p>
              </motion.li>
            ))}
          </ol>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* Beyond: a wallet with a hold you drive. */
const ST = {
  idle: { buyer: 10000, held: 0, seller: 0, ev: [] },
  held: { buyer: 0, held: 10000, seller: 0, ev: ['held at checkout · 10,000'] },
  paid: { buyer: 0, held: 0, seller: 9000, ev: ['held at checkout · 10,000', 'delivered · hold released', 'split: 9,000 / 500 / 500', 'paid out to @merchants:042'] },
  back: { buyer: 10000, held: 0, seller: 0, ev: ['held at checkout · 10,000', 'hold released to the buyer'] },
};
const AUTO = ['idle', 'held', 'paid', 'idle', 'held', 'back'];

function Hold() {
  const [ref, live] = useLive(0.35);
  const [s, setS] = useState('held');
  const [mine, setMine] = useState(false);
  const [i, setI] = useState(1);
  useEvery(2600, live && !mine, () => { const n = (i + 1) % AUTO.length; setI(n); setS(AUTO[n]); });
  const go = (x) => { setMine(true); setS(x); };
  const v = ST[s];
  const cell = (k, label, sub) => (
    <div className={'ts-w ' + k}>
      <span>{label}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={v[k]} className="x-mono" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>{v[k].toLocaleString('en-US')}</motion.b>
      </AnimatePresence>
      <em>{sub}</em>
    </div>
  );
  return (
    <section className="x-sec ts-hold" ref={ref}>
      <div className="x-wrap ts-hold-grid">
        <div>
          <p className="x-kick">Wallets with holds</p>
          <h2 className="ts-hold-h">Take money at checkout and pay a seller on delivery</h2>
          <p className="ts-hold-l">Multi-currency virtual wallets that can hold an amount and release it later, without the balance lying in between. Every change of financial state is delivered as an event you can subscribe to.</p>
          <div className="ts-hold-acts">
            <button type="button" className="x-btn sm solid" disabled={s === 'held'} onClick={() => go('held')}>Take at checkout</button>
            <button type="button" className="x-btn sm" disabled={s !== 'held'} onClick={() => go('paid')}>Delivered: pay the seller</button>
            <button type="button" className="x-btn sm" disabled={s !== 'held'} onClick={() => go('back')}>Release the hold</button>
            <button type="button" className="x-btn sm" onClick={() => go('idle')}>Reset</button>
          </div>
        </div>
        <Rise className="ts-wallet" delay={0.1}>
          <div className="ts-ws">
            {cell('buyer', '@users:001', 'available')}
            {cell('held', 'held', 'not spendable, not paid')}
            {cell('seller', '@merchants:042', 'paid on delivery')}
          </div>
          <div className="ts-ev">
            <p className="x-mono">events</p>
            <ol aria-live="polite">
              <AnimatePresence initial={false}>
                {v.ev.map((e, k) => <motion.li key={s + k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE, delay: k * 0.12 }} className="x-mono">{e}</motion.li>)}
              </AnimatePresence>
              {!v.ev.length && <li className="x-mono none">nothing held yet</li>}
            </ol>
          </div>
        </Rise>
      </div>
    </section>
  );
}

function First() {
  return (
    <section className="x-sec ts-first">
      <div className="x-wrap ts-first-in">
        <h2>Post your first transaction</h2>
        <div className="ts-first-acts"><A to={DOCS} className="x-btn solid">Read the docs</A><A to={GH} className="x-btn">View on GitHub</A></div>
      </div>
    </section>
  );
}

export default function Treasury() {
  return (
    <main className="ts">
      <Hero />
      <Parts />
      <Hold />
      <First />
      <Get name="Treasury" tag="Treasury management" />
    </main>
  );
}
