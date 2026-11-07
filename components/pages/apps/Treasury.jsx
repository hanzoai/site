'use client';
/* Persona: developers building marketplaces, wallets and payouts inside their product. Goal: post a first transaction. CTA: "Read the docs" → docs.hanzo.ai/docs/cli/treasury. Metric: api_key_created (docs handoff).
   Treasury. V2: 7/10 motion-map build: the live calculator re-plans the whole page (hero streams, postings, balances, wallet, close) and always balances; five page-local section entrances; no pinned chapters; greys only
   Signature: calculator (MOTION-MAP). The visitor sets the amount and the split (treasury/calc.jsx) and every figure
   on the page re-plans at once. Order: hero, the calculator, the wallet, the statement, the parts carousel, the close.
   Entrances: accordion (calculator), iris (wallet), scramble (statement), side-carousel (parts), pixel-resolve (close).
   The hero keeps: the split that writes itself, in a dark room. Hanzo's split.num is written line by line and, as each
   destination is named, its stream of money pours out of @users:001 into its account: 90%, 5%, and the remaining,
   which Numscript works out. When the three meet the amount, the split is marked balanced, then it runs again.
   Beyond: "Hold it, then pay", inside chapter 04. A wallet with a hold you drive: hold the 10,000 at checkout, then pay
   the seller on delivery (the split lands 9,000 / 500 / 500) or release it, and watch each posting arrive. Controls are
   icons with aria-labels (no new words); the posting lines use only Hanzo's account names and the split's figures.
   Motion budget: signature = the calculator; supporting = the hero split (line draw), Stage (settle), magnetic
   primary. No springs. Colour: none (0 UI hues): the 90% stream is white, the 5% silver, the remainder grey. Pause in the
   editor bar and under the chapter visual. One dark room: the hero. Scale rhythm via Rhythm.css. Every word and link is Hanzo's; the only figures are
   the split's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useScroll, useTransform } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import { CalcProvider, Calculator, useCalc } from './treasury/calc';
import { useEnter, Scramble, Pixels } from './treasury/enter';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import './Treasury.css';
import './treasury/motion.css';

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

/* The split as the calculator has it: the three accounts' shares and figures, and the balanced line. */
function useSplit() {
  const c = useCalc();
  const pct = [c.p0 + '%', c.p1 + '%', 'remaining'];
  const sum = `${fmt(c.parts[0])} + ${fmt(c.parts[1])} + ${fmt(c.parts[2])} = ${fmt(c.a)} · balanced`;
  return { ...c, pct, sum };
}

/* Three streams out of one source, widths in proportion to the split (with a floor so a small share still reads). */
function Streams({ shown, done, still }) {
  const s = useSplit();
  const y = [70, 200, 300];
  const w = s.parts.map((v) => Math.max(4, (120 * v) / s.a));
  return (
    <div className={'ts-flow' + (still ? ' still' : '')} aria-hidden="true">
      <div className="ts-src"><span className="x-mono">@users:001</span><b className="x-mono">{fmt(s.a)}</b></div>
      <svg viewBox="0 0 400 360" preserveAspectRatio="none">
        {DEST.map((_, i) => {
          const st = 130 + (i === 0 ? -8 : i === 1 ? 54 : 70);
          return <motion.path key={i} d={`M0 ${st} C 180 ${st}, 220 ${y[i]}, 400 ${y[i]}`} strokeWidth={w[i]} initial={false} animate={{ pathLength: shown[i] ? 1 : 0, opacity: shown[i] ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }} />;
        })}
      </svg>
      <ul className="ts-dst">
        {DEST.map(([a], i) => (
          <li key={a} className={shown[i] ? 'on' : ''} style={{ top: (i === 0 ? 70 : i === 1 ? 200 : 300) / 3.6 + '%' }}>
            <span className="x-mono">{a}</span>
            <b className="x-mono">{shown[i] ? fmt(s.parts[i]) : '—'}</b>
            <em>{s.pct[i]}</em>
          </li>
        ))}
      </ul>
      {/* always in the layout, so the balanced line never pushes anything as the split re-writes */}
      <motion.p className="ts-ok x-mono" initial={false} animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }} transition={{ duration: 0.4, ease: EASE }}>{s.sum}</motion.p>
    </div>
  );
}
/* the editor's lines carry the calculator's figures (the server paints Hanzo's own: 10000, 90%, 5%) */
function codeLine(t, l, c) {
  if (t === 's') return `send [USD/2 ${c.a}] (`;
  if (t === 'd0') return `    ${(c.p0 + '%').padEnd(4)}to @merchants:042`;
  if (t === 'd1') return `    ${(c.p1 + '%').padEnd(4)}to @fees:processing`;
  return l;
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
  const c = useCalc();
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
                    <span key={i} className={'ts-l ' + (t === 'c' ? 'c' : '') + (i < k ? ' in' : '') + (t.startsWith('d') && i < k ? ' d' : '')}>{codeLine(t, l, c) || ' '}{'\n'}</span>
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
  const s = useCalc();
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>transaction</span><span>USD/2</span></p>
      <div className="ts-v-row h x-mono"><span>source</span><span>destination</span><span>amount</span></div>
      {DEST.map(([a], i) => <div key={a} className={'ts-v-row post x-mono' + (r === i ? ' hot' : '')}><span>@users:001</span><span><i className="ts-arr" />{a}</span><b>{fmt(s.parts[i])}</b></div>)}
      <div className="ts-v-sum x-mono"><span>balanced</span><b>{fmt(s.a)} = {fmt(s.parts[0] + s.parts[1] + s.parts[2])}</b></div>
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
  const s = useCalc();
  return (
    <div className="ts-v" aria-hidden="true">
      <p className="ts-v-k x-mono"><span>accounts</span><span>per currency</span></p>
      {DEST.map(([a], i) => <div key={a} className={'ts-v-row bal x-mono' + (r === i ? ' hot' : '')}><span>{a}</span><span>USD/2</span><b>{fmt(s.parts[i])}</b></div>)}
      <div className="ts-v-sum x-mono"><span>settles against</span><b>per deployment</b></div>
    </div>
  );
}
/* Chapter 04, the Beyond: the 10,000 travels from @users:001 into the hold, then on to @merchants:042 (or back). */
const SPOTS = ['@users:001', 'held', '@merchants:042'];
// the wallet's states, from the calculator's split (Hanzo's 10,000 / 9,000 / 500 / 500 by default)
const states = ({ a, parts: [m, f, r] }) => {
  const A = fmt(a), take = '@users:001 → held · ' + A;
  return {
    idle: { at: 0, coin: A, log: [] },
    held: { at: 1, coin: A, log: [take] },
    paid: { at: 2, coin: fmt(m), log: [take, 'held → @merchants:042 · ' + fmt(m), 'held → @fees:processing · ' + fmt(f), 'held → @platform:revenue · ' + fmt(r)] },
    back: { at: 0, coin: A, log: [take, 'held → @users:001 · ' + A] },
  };
};
const AUTO = ['idle', 'held', 'paid', 'idle', 'held', 'back'];
const Ico = ({ d }) => <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
function Wallet({ on }) {
  const [s, setS] = useState('held');
  const [mine, setMine] = useState(false);
  const [i, setI] = useState(1);
  useEvery(2400, on && !mine, () => { const n = (i + 1) % AUTO.length; setI(n); setS(AUTO[n]); });
  const go = (x) => { setMine(true); setS(x); };
  const v = states(useCalc())[s];
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

/* 1 · accordion: the signature, straight after the hero. The calculator unfolds row by row as it arrives. */
function CalcSection() {
  const [ref, st] = useEnter(0.2);
  return (
    <section ref={ref} data-enter={st} className="ts-calc ten-acc" aria-label="split.num">
      <div className="w2-wrap"><Calculator Postings={Postings} /></div>
    </section>
  );
}

/* 2 · iris: the wallet with a hold (part 04, the Beyond) in its own quiet room, opening out of a circle. */
function WalletSection() {
  const [ref, st] = useEnter(0.25);
  const [lref, live] = useLive(0.35);
  const [t, d] = PARTS[3];
  return (
    <section ref={ref} data-enter={st} className="ts-wal ten-iris">
      <div className="w2-wrap">
        <div className="ts-wal-in" ref={lref}>
          <div><h2 className="w2-headline">{t}</h2><p className="ts-sc-b">{d}</p></div>
          <Wallet on={live} />
        </div>
      </div>
    </section>
  );
}

/* 3 · scramble: the statement decodes out of noise. */
function SaySection() {
  const [ref, st] = useEnter(0.4);
  return (
    <section ref={ref} className="ts-say" aria-label="What it is made of">
      <div className="w2-wrap"><Scramble lines={SAY} className="gx-say ts-say-p" go={st} /></div>
    </section>
  );
}

/* 4 · side-carousel: the other four parts on a horizontal snapping track, each with its own live card. */
function Card({ i, n, paused }) {
  const [ref, live] = useLive(0.5);
  const [t, d] = PARTS[i];
  const V = VIS[i];
  return (
    <article ref={ref} className="ts-card" aria-label={`${n} / 4`}>
      <h2 className="w2-headline">{t}</h2>
      <p className="ts-sc-b">{d}</p>
      <V on={live && !paused} />
    </article>
  );
}
function PartsCarousel() {
  const [ref, st] = useEnter(0.2);
  const tr = useRef(null);
  const [at, setAt] = useState(0);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const ids = [0, 1, 2, 4];
  const step = (k) => { const el = tr.current; const c = el.children[0]; if (c) el.scrollBy({ left: k * (c.getBoundingClientRect().width + 12), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  const onScroll = () => { const el = tr.current; const c = el.children[0]; if (c) setAt(Math.min(3, Math.round(el.scrollLeft / (c.getBoundingClientRect().width + 12)))); };
  return (
    <section ref={ref} data-enter={st} className="ts-car ten-car" aria-label="What it is made of">
      <div className="w2-wrap ts-car-top">
        <span className="ts-car-n x-mono" aria-hidden="true">0{at + 1} / 04</span>
        {pauseBtn}
        <button type="button" className="ts-car-b" aria-label="Previous" onClick={() => step(-1)}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <button type="button" className="ts-car-b" aria-label="Next" onClick={() => step(1)}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      <div className={'ts-car-t' + (paused ? ' paused' : '')} ref={tr} onScroll={onScroll} tabIndex={0} aria-label="What it is made of">
        {ids.map((i, n) => <Card key={i} i={i} n={n + 1} paused={paused} />)}
      </div>
    </section>
  );
}

/* The close carries the hero's split, small and finished: one bar drawn in its three parts as it arrives. Hover or focus
   a row and its part of the bar lights up. Only the split's own figures. */
/* The figure moment: the split's 10,000 at figure size, counted once as the close arrives. The true value is in the
   server HTML; reduced motion shows it without counting. */
function Total() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const { a } = useCalc();
  const [v, setV] = useState(10000);
  const done = useRef(false);
  // after its first count, the figure rolls to whatever amount the calculator now holds
  useEffect(() => {
    if (!done.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(a); return; }
    const c = animate(v, a, { duration: 0.4, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [a]); // eslint-disable-line react-hooks/exhaustive-deps
  // the server paints the true 10,000; if the figure is still below the fold after hydration, it rests at 0 out of
  // sight and counts up when it arrives, so it never visibly drops and climbs back
  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (r && r.top > innerHeight && !matchMedia('(prefers-reduced-motion: reduce)').matches) setV(0);
  }, []);
  useEffect(() => {
    if (!seen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { done.current = true; setV(a); return; }
    const c = animate(0, a, { duration: 1.1, ease: EASE, onUpdate: (x) => setV(Math.round(x / 100) * 100), onComplete: () => { done.current = true; setV(a); } });
    return () => c.stop();
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return <p ref={ref} className="ts-total x-mono" aria-label={fmt(a)}>{fmt(v)}</p>;
}

function Split() {
  const [hot, setHot] = useState(-1);
  const s = useSplit();
  const w = s.parts.map((v) => (400 * v) / s.a);
  const x = [0, w[0], w[0] + w[1]];
  return (
    <figure className="ts-split" aria-label="split.num">
      <Total />
      <svg viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
        {DEST.map((_, i) => (
          <motion.path key={i} d={`M${(x[i] + (i ? 1 : 0)).toFixed(1)} 6 H${Math.max(x[i] + (i ? 1 : 0), x[i] + w[i] - 1).toFixed(1)}`} strokeWidth="12" className={hot === -1 || hot === i ? 'on' : ''}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.3 }} />
        ))}
      </svg>
      <ul>
        {DEST.map(([a], i) => (
          <li key={a} tabIndex={0} className={hot === i ? 'hot' : ''} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
            <span className="x-mono">{a}</span><em className="x-mono">{s.pct[i]}</em><b className="x-mono">{fmt(s.parts[i])}</b>
          </li>
        ))}
      </ul>
      <figcaption className="x-mono"><span>@users:001</span><b>{s.sum}</b></figcaption>
    </figure>
  );
}

/* 5 · pixel-resolve: the close resolves out of coarse, then fine, blocks. */
function First() {
  const [ref, st] = useEnter(0.25);
  return (
    <section ref={ref} data-enter={st} className="w2-sec ts-first ten-px">
      <Pixels />
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
      <CalcProvider>
        <Hero />
        <CalcSection />
        <WalletSection />
        <SaySection />
        <PartsCarousel />
        <First />
      </CalcProvider>
    </main>
  );
}
