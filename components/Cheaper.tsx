'use client';
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue, type Variants } from 'motion/react';
import { EASE, Head, Arrow, Count } from './ui';
import useFigures, { type Figs } from './home/useFigures';

// hanzo.ai's own rows, worked out from the research runs and price list it reads (components/home/figures.js), read
// again when the page opens (components/home/useFigures.js)
type Row = [who: string, acc: string, cost: number, hi: boolean | undefined];
const ensoRows = (GPQA: Figs['GPQA']): Row[] => GPQA.rows.map((r): Row => [r.who, r.acc, r.cost, r.hi]);
const money = (v: number) => (v >= 1e6 ? '$' + (v / 1e6).toFixed(2) + 'M' : v >= 1000 ? '$' + Math.round(v).toLocaleString('en-US') : '$' + v.toFixed(2));
const nice = (q: number) => { const p = 10 ** Math.floor(Math.log10(q)); return Math.round(q / p * 2) / 2 * p; };

const bar = (i: number): Variants => ({ h: { scaleX: 0 }, s: { scaleX: 1, transition: { type: 'spring', stiffness: 90, damping: 18, delay: 0.25 + i * 0.09 } } });

function EnsoLane({ row, i, vol, dim, setDim, TOP }: { row: Row; i: number; vol: MotionValue<number>; dim: number | null; setDim: (i: number | null) => void; TOP: number }) {
  const [who, acc, cost, hi] = row;
  const v = useTransform(vol, (q: number) => `${acc} · ${money(cost * q / 1000)}`);
  return (
    <div className={'x-lane' + (hi ? ' hi' : '') + (dim !== null && dim !== i ? ' dim' : '')} onPointerEnter={() => setDim(i)} onPointerLeave={() => setDim(null)}>
      <div className="x-lane-h"><span>{who}</span><motion.span className="x-mono x-lane-v">{v}</motion.span></div>
      <i className="x-lane-track"><motion.b style={{ width: (cost / TOP) * 100 + '%' }} variants={bar(i)} /></i>
    </div>
  );
}

/* A card's headline, up to N× less, counted up from 0 as it arrives; N is the figure as written ("14.2", "530"). */
const Big = ({ n }: { n: string }) => <Count to={+n} decimals={n.includes('.') ? 1 : 0} prefix="up to " suffix="× less" duration={1.4} />;

/* Hanzo's Enso comparison, with one control: how many questions. The rates are Hanzo's; only the count changes. */
function EnsoCard() {
  const { GPQA } = useFigures()!;
  const ENSO = ensoRows(GPQA);
  const TOP = Math.max(...ENSO.map((r) => r[2]));
  const [dim, setDim] = useState<number | null>(null);
  const [exp, setExp] = useState(0); // 10^exp thousand questions
  const raw = useMotionValue(1000);
  const vol = useSpring(raw, { stiffness: 120, damping: 22 });
  const q = nice(1000 * 10 ** exp);
  return (
    <div className="x-cost" data-tilt="">
      <p className="x-race-k">Enso vs frontier LLMs · GPQA Diamond</p>
      <p className="x-cost-big"><Big n={GPQA.big} /></p>
      <p className="x-race-cap">per 1,000 questions, at higher accuracy</p>
      <p className="x-race-note">{GPQA.note}</p>
      <label className="x-vol">
        <span className="x-mono">Per {q.toLocaleString('en-US')} GPQA Diamond questions · less is cheaper</span>
        <input
          type="range" min="0" max="3" step="0.01" value={exp}
          aria-label="Number of questions"
          aria-valuetext={q.toLocaleString('en-US') + ' questions'}
          onChange={(e) => { const x = +e.target.value; setExp(x); raw.set(nice(1000 * 10 ** x)); }}
        />
      </label>
      <motion.div className="x-lanes" initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }}>
        {ENSO.map((r, i) => <EnsoLane key={r[0]} row={r} i={i} vol={vol} dim={dim} setDim={setDim} TOP={TOP} />)}
      </motion.div>
      <div className="x-race-end"><Arrow href="/enso">How Enso lowers the cost of an answer</Arrow></div>
    </div>
  );
}

function KaiCard() {
  const { PRICES } = useFigures()!;
  const KAI = PRICES.rows;
  const [dim, setDim] = useState<number | null>(null);
  const max = PRICES.max;
  return (
    <div className="x-cost" data-tilt="">
      <p className="x-race-k">Kai vs frontier LLMs</p>
      <p className="x-cost-big"><Big n={PRICES.big} /></p>
      <p className="x-race-cap">than frontier LLMs, per input token</p>
      <p className="x-race-note">Kai bills input only; an LLM also bills every token it writes.</p>
      <p className="x-vol"><span className="x-mono">Per million tokens, input and output · less is cheaper</span></p>
      <motion.div className="x-lanes" initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }}>
        {KAI.map(({ who, inp, out, hi, label }, i) => (
          <div key={who} className={'x-lane' + (hi ? ' hi' : '') + (dim !== null && dim !== i ? ' dim' : '')} onPointerEnter={() => setDim(i)} onPointerLeave={() => setDim(null)}>
            <div className="x-lane-h"><span>{who}</span><span className="x-mono x-lane-v"><span>{label}</span></span></div>
            <i className="x-lane-track two">
              <motion.b style={{ width: `max(3px, ${(inp / max) * 100}%)` }} variants={bar(i)} />
              <motion.s style={{ width: (out / max) * 100 + '%' }} variants={bar(i + 0.5)} />
            </i>
          </div>
        ))}
      </motion.div>
      <div className="x-race-end"><Arrow href="/kai">How Kai makes decisions</Arrow></div>
    </div>
  );
}

export default function Cheaper() {
  return (
    <section className="x-sec x-cheaper" id="cheaper" data-hz-view="cheaper" aria-labelledby="cheaper-h">
      <div className="x-wrap">
        <Head id="cheaper-h" title="The same intelligence. A smaller bill." lede="Enso routes each answer to the right model. Kai answers a decision directly." />
        <div className="x-races"><EnsoCard /><KaiCard /></div>
        <div className="x-row-links">
          <Arrow href="https://docs.hanzo.ai/docs/models/enso">Which Enso tier for which job</Arrow>
          <Arrow href="/pricing">Every model rate</Arrow>
        </div>
      </div>
    </section>
  );
}
