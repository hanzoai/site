'use client';
/* Persona: developers building marketplaces, wallets and payouts inside their product. Goal: post a first transaction. CTA: "Read the docs" → docs.hanzo.ai/docs/cli/treasury. Metric: api_key_created (docs handoff).
   Treasury, v2. V2: 8/10 the dark-room Stage (split.num writes itself and the money pours out as the object settles), five pinned chapters each drawing its part of the ledger, a wallet with a hold you drive, gold accent
   Signature: the split that writes itself, in a dark room. Hanzo's split.num is written line by line and, as each
   destination is named, its stream of money pours out of @users:001 into its account: 90%, 5%, and the remaining,
   which Numscript works out. When the three meet the amount, the split is marked balanced, then it runs again.
   Beyond: "Hold it, then pay". A wallet with a hold you drive: take $100 at checkout, hold it, then pay the seller on
   delivery or release it, and watch each change of state arrive as an event. Hanzo's wallets-with-holds, made playable.
   Motion budget: signature = the split (line draw); supporting = Stage (Settle), Chapters (PinChapters), magnetic
   primary. Colour: none (0 UI hues): the 90% stream is white, the 5% silver, the remainder grey. Pause buttons on the
   split, the flow chapter and the wallet. One dark room: the hero. Every word and link is Hanzo's; the only figures are
   the split's own. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import Settle from '../../v2/Settle';
import PinChapters from '../../v2/x-gauss/PinChapters';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import '../../v2/Scale.css';
import './Treasury.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/treasury';
const GH = 'https://github.com/hanzoai';

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
const fmt = (v) => v.toLocaleString('en-US');

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
          return <motion.path key={i} d={`M0 ${s} C 180 ${s}, 220 ${y[i]}, 400 ${y[i]}`} strokeWidth={w[i]} initial={false} animate={{ pathLength: shown[i] ? 1 : 0, opacity: shown[i] ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }} />;
        })}
      </svg>
      <ul className="ts-dst">
        {DEST.map(([a, p, v], i) => (
          <li key={a} className={shown[i] ? 'on' : ''} style={{ top: (i === 0 ? 70 : i === 1 ? 200 : 300) / 3.6 + '%' }}>
            <span className="x-mono">{a}</span>
            <b className="x-mono">{shown[i] ? fmt(v) : '—'}</b>
            <em>{p}</em>
          </li>
        ))}
      </ul>
      <AnimatePresence>{done && <motion.p className="ts-ok x-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>9,000 + 500 + 500 = 10,000 · balanced</motion.p>}</AnimatePresence>
    </div>
  );
}

function Hero() {
  const [ref, live, calm] = useLive(0.25);
  const [paused, pauseBtn] = usePause();
  const [k, setK] = useState(N); // lines written; the page's HTML carries all of them
  useEffect(() => { if (!calm) setK(0); }, [calm]);
  useEvery(380, live && !paused, () => setK((v) => (v >= N + 9 ? 0 : v + 1)));
  const has = (tag) => CODE.findIndex((l) => l[0] === tag) < k;
  const shown = [has('d0'), has('d1'), has('d2')];
  return (
    <section className="ts-hero w2-dark" data-room="dark" aria-labelledby="ts-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="ts-top">
          <div>
            <LineMask as="h1" id="ts-h1" now className="w2-display ts-h1" lines={['Hanzo Treasury']} />
          </div>
          <motion.div className="ts-top-r" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede ts-lede">A double-entry ledger for money moving inside your product</p>
            <div className="ts-acts">
              <Magnetic strength={0.25}><A to={DOCS} className="w2-cta" data-thumb="Read the docs" data-cta="treasury.hero">Read the docs <i aria-hidden="true">→</i></A></Magnetic>
              <A to={GH} className="w2-ghost">GitHub</A>
            </div>
          </motion.div>
        </div>
        <div ref={ref}>
          <Settle from={1.04} lift={30}>
            <div className="ts-stage">
              {pauseBtn}
              <div className="ts-ed">
                <div className="ts-ed-bar"><i /><i /><i /><span className="x-mono">split.num</span><b className="ts-name x-mono">Treasury Operations</b></div>
                <pre className="x-mono"><code>
                  {CODE.map(([t, l], i) => (
                    <span key={i} className={'ts-l ' + (t === 'c' ? 'c' : '') + (i < k ? ' in' : '') + (t.startsWith('d') && i < k ? ' d' : '')}>{l || ' '}{'\n'}</span>
                  ))}
                </code></pre>
              </div>
              <Streams shown={shown} done={k >= N} />
            </div>
          </Settle>
        </div>
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

/* Chapter visuals: the same ledger, drawn for each part. Only the split's own figures appear. */
function Postings() {
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>transaction</span><span>USD/2</span></p>
      <div className="ts-v-row h x-mono"><span>source</span><span>destination</span><span>amount</span></div>
      {DEST.map(([a, , v]) => <div key={a} className="ts-v-row x-mono"><span>@users:001</span><span>{a}</span><b>{fmt(v)}</b></div>)}
      <div className="ts-v-sum x-mono"><span>balanced</span><b>10,000 = 10,000</b></div>
    </div>
  );
}
function Recon() {
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>ledger</span><span>provider</span></p>
      {['@merchants:042', '@fees:processing', '@platform:revenue'].map((a, i) => (
        <div key={a} className={'ts-v-row two x-mono' + (i === 1 ? ' brk' : '')}><span>{a}</span><span>{i === 1 ? 'disagrees' : 'agrees'}</span><i>{i === 1 ? '!' : '✓'}</i></div>
      ))}
      <div className="ts-v-sum x-mono"><span>output</span><b>the breaks</b></div>
    </div>
  );
}
function Balances() {
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>accounts</span><span>per currency</span></p>
      {DEST.map(([a, , v]) => <div key={a} className="ts-v-row x-mono"><span>{a}</span><span>USD/2</span><b>{fmt(v)}</b></div>)}
      <div className="ts-v-sum x-mono"><span>settles against</span><b>per deployment</b></div>
    </div>
  );
}
function Wallet() {
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>wallet</span><span>hold</span></p>
      <div className="ts-v-hold"><span className="x-mono">@users:001</span><b className="x-mono">10,000</b><em>held at checkout</em></div>
      <div className="ts-v-sum x-mono"><span>on delivery</span><b>@merchants:042</b></div>
    </div>
  );
}
function Flow({ on }) {
  const [k, setK] = useState(0);
  useEvery(900, on, () => setK((v) => (v + 1) % 5));
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>flow</span><span>events</span></p>
      <ol className="ts-v-flow">
        {['capture', 'split', 'pay out', 'retry'].map((s, i) => <li key={s} className={i < k ? 'on' : ''}><i /><span className="x-mono">{s}</span>{i < k && <em className="x-mono">event →</em>}</li>)}
      </ol>
    </div>
  );
}

function Parts() {
  const [ref, live] = useLive(0.05);
  const [paused, pauseBtn] = usePause({ right: 0, top: -60 });
  return (
    <div ref={ref}>
      <PinChapters id="ts-parts" label="What it is made of" className="ts-pin"
        chapters={PARTS.map(([t, d], i) => ({ k: i === 0 ? 'What it is made of' : `Part ${String(i + 1).padStart(2, '0')}`, t, b: <p>{d}</p> }))}
        visual={(at) => (
          <div className="ts-vis">
            {pauseBtn}
            {[Postings, Recon, Balances, Wallet, Flow].map((V, i) => (
              <motion.div key={i} className="ts-vis-i" initial={false} animate={{ opacity: at === i ? 1 : 0, y: at === i ? 0 : at > i ? -24 : 24 }} transition={{ duration: 0.55, ease: EASE }} aria-hidden={at !== i}>
                <V on={live && !paused && at === i} />
              </motion.div>
            ))}
          </div>
        )} />
    </div>
  );
}

function Lede() {
  return (
    <section className="w2-sec tight ts-say" aria-label="A ledger and a language">
      <div className="w2-wrap">
        <p className="ts-say-p">A ledger, a language for writing transactions, and the machinery around them.</p>
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
  const [paused, pauseBtn] = usePause();
  const [s, setS] = useState('held');
  const [mine, setMine] = useState(false);
  const [i, setI] = useState(1);
  useEvery(2600, live && !mine && !paused, () => { const n = (i + 1) % AUTO.length; setI(n); setS(AUTO[n]); });
  const go = (x) => { setMine(true); setS(x); };
  const v = ST[s];
  const cell = (k, label, sub) => (
    <div className={'ts-w ' + k}>
      <span>{label}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={v[k]} className="w2-fig" initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{fmt(v[k])}</motion.b>
      </AnimatePresence>
      <em>{sub}</em>
    </div>
  );
  return (
    <section className="w2-sec ts-hold" ref={ref}>
      <div className="w2-wrap">
        <div className="ts-hold-head">
          <h2 className="w2-display s ts-hold-h">Take money at checkout and pay a seller on delivery</h2>
          <p className="ts-hold-k x-mono">Wallets with holds</p>
          <p className="w2-lede">Multi-currency virtual wallets that can hold an amount and release it later, without the balance lying in between. Every change of financial state is delivered as an event you can subscribe to.</p>
        </div>
        <div className="ts-wallet w2-object">
          {pauseBtn}
          <div className="ts-ws">
            {cell('buyer', '@users:001', 'available')}
            {cell('held', 'held', 'not spendable, not paid')}
            {cell('seller', '@merchants:042', 'paid on delivery')}
          </div>
          <div className="ts-wallet-b">
            <div className="ts-hold-acts">
              <button type="button" className="ts-b solid" disabled={s === 'held'} onClick={() => go('held')}>Take at checkout</button>
              <button type="button" className="ts-b" disabled={s !== 'held'} onClick={() => go('paid')}>Delivered: pay the seller</button>
              <button type="button" className="ts-b" disabled={s !== 'held'} onClick={() => go('back')}>Release the hold</button>
              <button type="button" className="ts-b ghost" onClick={() => go('idle')}>Reset</button>
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
          </div>
        </div>
      </div>
    </section>
  );
}

function First() {
  return (
    <section className="w2-sec ts-first">
      <div className="w2-wrap">
        <h2 className="w2-display m ts-first-h">Post your first transaction</h2>
        <div className="ts-first-row">
          <div className="ts-first-acts"><A to={DOCS} className="w2-cta" data-cta="treasury.close">Read the docs <i aria-hidden="true">→</i></A><A to={GH} className="w2-ghost">View on GitHub</A></div>
          <div className="ts-get">
            <div><h2 className="w2-title">Get Treasury</h2><p className="ts-get-tag">Treasury management</p></div>
            <div className="ts-get-meta">
              <span className="ts-chip"><span>License:</span> Apache-2.0</span>
              <A to="https://github.com/hanzoai" className="ts-chip">hanzoai</A>
              <A to="https://platform.hanzo.ai/deploy" className="w2-ghost">Deploy to Cloud</A>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Treasury() {
  return (
    <main className="ts w2">
      <NoJs />
      <Hero />
      <Lede />
      <Parts />
      <Hold />
      <First />
    </main>
  );
}
