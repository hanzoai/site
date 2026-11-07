'use client';
/* Persona: developers building marketplaces, wallets and payouts inside their product. Goal: post a first transaction. CTA: "Read the docs" → docs.hanzo.ai/docs/cli/treasury. Metric: api_key_created (docs handoff).
   Treasury. V2: 6/10 the dark-room split writes itself from a finished, balanced state; five pinned chapters whose rows are read in turn, the fourth a wallet whose 10,000 travels from buyer to hold to seller; the close carries the finished split; greys only
   Signature: the split that writes itself, in a dark room. Hanzo's split.num is written line by line and, as each
   destination is named, its stream of money pours out of @users:001 into its account: 90%, 5%, and the remaining,
   which Numscript works out. When the three meet the amount, the split is marked balanced, then it runs again.
   Beyond: "Hold it, then pay", inside chapter 04. A wallet with a hold you drive: hold the 10,000 at checkout, then pay
   the seller on delivery (the split lands 9,000 / 500 / 500) or release it, and watch each posting arrive. Controls are
   icons with aria-labels (no new words); the posting lines use only Hanzo's account names and the split's figures.
   Motion budget: signature = the split (line draw); supporting = Stage (Settle), Chapters (PinChapters), magnetic
   primary. No springs. Colour: none (0 UI hues): the 90% stream is white, the 5% silver, the remainder grey. Pause in the
   editor bar and under the chapter visual. One dark room: the hero. Scale rhythm via Rhythm.css. Every word and link is Hanzo's; the only figures are
   the split's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useScroll, useTransform } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import PinChapters from '../../v2/x-gauss/PinChapters';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
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

/* The Stage, page-local: the same settle as v2/Settle (the hero arrives a touch large and low, then settles as the first
   screen scrolls away), except reduced motion is read after mount, so the server and the first client render match in
   every motion mode. (v2/Settle reads it during render; requested in docs/requests/treasury.md.) */
function Stage({ children, from = 1.015, lift = 12 }) {
  const ref = useRef(null);
  const [m, setM] = useState({ h: 800, phone: false, calm: false });
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setM({ h: innerHeight, phone: innerWidth < 900, calm: q.matches });
    on();
    addEventListener('resize', on);
    q.addEventListener('change', on);
    return () => { removeEventListener('resize', on); q.removeEventListener('change', on); };
  }, []);
  const { scrollY } = useScroll();
  const f = m.calm ? 1 : m.phone ? 1 + (from - 1) / 2 : from;
  const scale = useTransform(scrollY, [0, m.h * 0.7], [f, 1], { clamp: true });
  const y = useTransform(scrollY, [0, m.h * 0.7], [m.calm ? 0 : lift, 0], { clamp: true });
  return <motion.div ref={ref} className="w2-settle" style={{ scale, y, transformOrigin: '50% 0%' }}>{children}</motion.div>;
}

/* Three streams out of one source, widths in proportion to the split (with a floor so 5% still reads). */
function Streams({ shown, done, still }) {
  const y = [70, 200, 300];
  const w = [104, 16, 16];
  return (
    <div className={'ts-flow' + (still ? ' still' : '')} aria-hidden="true">
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
      {/* always in the layout, so the balanced line never pushes anything as the split re-writes */}
      <motion.p className="ts-ok x-mono" initial={false} animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }} transition={{ duration: 0.4, ease: EASE }}>9,000 + 500 + 500 = 10,000 · balanced</motion.p>
    </div>
  );
}

function Hero() {
  const [ref, live, calm] = useLive(0.25);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  // lines written. It starts finished and balanced (the server paints that), holds, then re-writes from the source line,
  // so the streams are never an empty box: the first destination is named within a second of each re-write.
  const [k, setK] = useState(N);
  useEvery(380, live && !paused && !calm, () => setK((v) => (v >= N + 9 ? 5 : v + 1)));
  const has = (tag) => CODE.findIndex((l) => l[0] === tag) < k;
  const shown = [has('d0'), has('d1'), has('d2')];
  return (
    <section className="ts-hero w2-dark" data-room="dark" aria-labelledby="ts-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="ts-top">
          <div>
            <LineMask as="h1" id="ts-h1" now className="w2-display ts-h1" lines={['Hanzo Treasury']} />
          </div>
          <motion.div className="ts-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede ts-lede">A double-entry ledger for money moving inside your product</p>
            <div className="ts-acts">
              <Magnetic strength={0.25}><A to={DOCS} className="w2-cta" data-thumb="Read the docs" data-cta="treasury.hero">Read the docs <i aria-hidden="true">→</i></A></Magnetic>
              <A to={GH} className="w2-ghost">GitHub</A>
            </div>
          </motion.div>
        </div>
        <div ref={ref}>
          <Stage from={1.015} lift={12}>
            <div className="ts-stage">
              <div className="ts-ed">
                <div className="ts-ed-bar"><i /><i /><i /><span className="x-mono">split.num</span><b className="ts-name x-mono">Treasury Operations</b><span className="ts-pause">{pauseBtn}</span></div>
                <pre className="x-mono"><code>
                  {CODE.map(([t, l], i) => (
                    <span key={i} className={'ts-l ' + (t === 'c' ? 'c' : '') + (i < k ? ' in' : '') + (t.startsWith('d') && i < k ? ' d' : '')}>{l || ' '}{'\n'}</span>
                  ))}
                </code></pre>
              </div>
              <Streams shown={shown} done={k >= N} still={paused || !live} />
            </div>
          </Stage>
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

/* Chapter visuals: the same ledger, drawn for each part. Only the split's own figures appear. While a chapter is in
   view its rows are read in turn, one lit at a time, so the card is never a still table. */
function useRow(on, n, ms = 1300) {
  const [r, setR] = useState(0);
  useEvery(ms, on, () => setR((v) => (v + 1) % n));
  return r;
}
function Postings({ on }) {
  const r = useRow(on, 3);
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>transaction</span><span>USD/2</span></p>
      <div className="ts-v-row h x-mono"><span>source</span><span>destination</span><span>amount</span></div>
      {DEST.map(([a, , v], i) => <div key={a} className={'ts-v-row post x-mono' + (r === i ? ' hot' : '')}><span>@users:001</span><span><i className="ts-arr" />{a}</span><b>{fmt(v)}</b></div>)}
      <div className="ts-v-sum x-mono"><span>balanced</span><b>10,000 = 10,000</b></div>
    </div>
  );
}
function Recon({ on }) {
  const r = useRow(on, 3);
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>ledger</span><span>provider</span></p>
      {['@merchants:042', '@fees:processing', '@platform:revenue'].map((a, i) => (
        <div key={a} className={'ts-v-row two x-mono' + (i === 1 ? ' brk' : '') + (r === i ? ' hot' : '')}><span>{a}</span><span>{i === 1 ? 'disagrees' : 'agrees'}</span><i>{i === 1 ? '!' : '✓'}</i></div>
      ))}
      <div className="ts-v-sum x-mono"><span>output</span><b>the breaks</b></div>
    </div>
  );
}
function Balances({ on }) {
  const r = useRow(on, 3);
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>accounts</span><span>per currency</span></p>
      {DEST.map(([a, , v], i) => <div key={a} className={'ts-v-row bal x-mono' + (r === i ? ' hot' : '')}><span>{a}</span><span>USD/2</span><b>{fmt(v)}</b></div>)}
      <div className="ts-v-sum x-mono"><span>settles against</span><b>per deployment</b></div>
    </div>
  );
}
/* Chapter 04, the Beyond: the 10,000 travels from @users:001 into the hold, then on to @merchants:042 (or back). */
const SPOTS = ['@users:001', 'held', '@merchants:042'];
const ST = {
  idle: { at: 0, coin: '10,000', log: [] },
  held: { at: 1, coin: '10,000', log: ['@users:001 → held · 10,000'] },
  paid: { at: 2, coin: '9,000', log: ['@users:001 → held · 10,000', 'held → @merchants:042 · 9,000', 'held → @fees:processing · 500', 'held → @platform:revenue · 500'] },
  back: { at: 0, coin: '10,000', log: ['@users:001 → held · 10,000', 'held → @users:001 · 10,000'] },
};
const AUTO = ['idle', 'held', 'paid', 'idle', 'held', 'back'];
const Ico = ({ d }) => <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
function Wallet({ on }) {
  const [s, setS] = useState('held');
  const [mine, setMine] = useState(false);
  const [i, setI] = useState(1);
  useEvery(2400, on && !mine, () => { const n = (i + 1) % AUTO.length; setI(n); setS(AUTO[n]); });
  const go = (x) => { setMine(true); setS(x); };
  const v = ST[s];
  return (
    <div className="ts-v ts-hv">
      <p className="ts-v-k x-mono" aria-hidden="true"><span>wallet</span><span>hold</span></p>
      <div className="ts-track" aria-hidden="true">
        {SPOTS.map((a, j) => <div key={a} className={'ts-spot' + (v.at === j ? ' on' : '') + (j === 1 ? ' held' : '')}><span className="x-mono">{a}</span></div>)}
        <b className="ts-coin x-mono" style={{ '--at': v.at }}>{v.coin}</b>
      </div>
      <ol className="ts-log" aria-live={mine ? 'polite' : 'off'}>
        {v.log.map((e) => <li key={s + e} className="x-mono">{e}</li>)}
      </ol>
      <div className="ts-hold-acts" role="group" aria-label="Wallets with holds">
        <button type="button" className="ts-b" disabled={s === 'held'} onClick={() => go('held')} aria-label="Take at checkout"><Ico d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z" /></button>
        <button type="button" className="ts-b" disabled={s !== 'held'} onClick={() => go('paid')} aria-label="Delivered: pay the seller"><Ico d="M4 12h15M13 6l6 6-6 6" /></button>
        <button type="button" className="ts-b" disabled={s !== 'held'} onClick={() => go('back')} aria-label="Release the hold"><Ico d="M20 12H5M11 6l-6 6 6 6" /></button>
        <button type="button" className="ts-b" onClick={() => go('idle')} aria-label="Reset"><Ico d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" /></button>
      </div>
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

const VIS = [Postings, Recon, Balances, Wallet, Flow];
const SAY = ['A ledger, a language for writing', 'transactions, and the machinery', 'around them.'];

/* Phones, and the server (so JS off reads it too): each chapter is its words, then its own card, in flow. Nothing is
   pinned over text. The wallet (04) takes a full screen of its own and stays playable. */
function Chapter({ i, t, d, paused }) {
  const [ref, live] = useLive(0.35);
  const V = VIS[i];
  return (
    <article ref={ref} className={'ts-sc' + (i === 3 ? ' ts-sc-w' : '')}>
      <h2 className="w2-headline">{t}</h2>
      <p className="ts-sc-b">{d}</p>
      <V on={live && !paused} />
    </article>
  );
}

function Parts() {
  const [ref, live] = useLive(0.05);
  // wide screens pin the chapters beside one changing card; that pin mounts after hydration, so the server and the
  // first client render are the same stacked markup in every motion mode (no reduced-motion hydration mismatch)
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = matchMedia('(min-width: 900px)');
    const on = () => setWide(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  const [paused, pauseBtn] = usePause(wide ? { right: 0, bottom: 0, top: 'auto' } : { position: 'relative', right: 'auto', top: 'auto' });
  const lead = { rail: false, node: <LineMask as="p" className="gx-say ts-say-p" lines={SAY} /> };
  if (!wide) return (
    <section className="ts-stack" aria-label="What it is made of" ref={ref}>
      <div className="w2-wrap">
        <div className="ts-stack-top">
          <LineMask as="p" className="gx-say ts-say-p" lines={SAY} />
          <span className="ts-stack-pause">{pauseBtn}</span>
        </div>
        <div className={paused ? 'ts-stack-l paused' : 'ts-stack-l'}>
          {PARTS.map(([t, d], i) => <Chapter key={t} i={i} t={t} d={d} paused={paused} />)}
        </div>
      </div>
    </section>
  );
  return (
    <div ref={ref}>
      <PinChapters id="ts-parts" label="What it is made of" className="ts-pin"
        title="What it is made of"
        chapters={[lead, ...PARTS.map(([t, d]) => ({ t, b: <p>{d}</p> }))]}
        visual={(at) => {
          const v = Math.max(0, at - 1);
          return (
            <div className={'ts-vis' + (paused ? ' paused' : '')}>
              {pauseBtn}
              {VIS.map((V, i) => (
                <motion.div key={i} className="ts-vis-i" initial={false} animate={{ opacity: v === i ? 1 : 0, y: v === i ? 0 : v > i ? -24 : 24 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={v !== i} inert={v !== i}>
                  <V on={live && !paused && v === i} />
                </motion.div>
              ))}
            </div>
          );
        }} />
    </div>
  );
}

/* The close carries the hero's split, small and finished: one bar drawn in its three parts as it arrives. Hover or focus
   a row and its part of the bar lights up. Only the split's own figures. */
/* The figure moment: the split's 10,000 at figure size, counted once as the close arrives. The true value is in the
   server HTML; reduced motion shows it without counting. */
function Total() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const [v, setV] = useState(10000);
  useEffect(() => {
    if (!seen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = animate(0, 10000, { duration: 1.1, ease: EASE, onUpdate: (x) => setV(Math.round(x / 100) * 100) });
    return () => c.stop();
  }, [seen]);
  return <p ref={ref} className="ts-total x-mono" aria-label="10,000">{fmt(v)}</p>;
}

function Split() {
  const [hot, setHot] = useState(-1);
  const x = [0, 360, 380];
  const w = [360, 20, 20];
  return (
    <figure className="ts-split" aria-label="split.num">
      <Total />
      <svg viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
        {DEST.map((_, i) => (
          <motion.path key={i} d={`M${x[i] + (i ? 1 : 0)} 6 H${x[i] + w[i] - 1}`} strokeWidth="12" className={hot === -1 || hot === i ? 'on' : ''}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.3 }} />
        ))}
      </svg>
      <ul>
        {DEST.map(([a, p, v], i) => (
          <li key={a} tabIndex={0} className={hot === i ? 'hot' : ''} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
            <span className="x-mono">{a}</span><em className="x-mono">{p}</em><b className="x-mono">{fmt(v)}</b>
          </li>
        ))}
      </ul>
      <figcaption className="x-mono"><span>@users:001</span><b>9,000 + 500 + 500 = 10,000 · balanced</b></figcaption>
    </figure>
  );
}

function First() {
  return (
    <section className="w2-sec ts-first">
      <div className="w2-wrap">
        <div className="ts-first-top">
          <h2 className="w2-display m ts-first-h">Post your first transaction</h2>
          <Split />
        </div>
        <div className="ts-first-row">
          <div className="ts-first-acts"><A to={DOCS} className="w2-cta" data-thumb="Read the docs" data-cta="treasury.close">Read the docs <i aria-hidden="true">→</i></A><A to={GH} className="w2-ghost">View on GitHub</A></div>
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
    <main id="main" className="ts w2 gx">
      <NoJs />
      <Hero />
      <Parts />
      <First />
    </main>
  );
}
