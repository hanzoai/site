'use client';
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { EASE, Head, Arrow, Rise } from './ui';

const ENSO = [
  ['Enso Flash', 90.6, 3.26, true],
  ['Enso', 93.7, 10.03, true],
  ['Claude Sonnet 5', 77.8, 42.91],
  ['Claude Opus 4.8', 87.4, 45.01],
  ['Claude Fable 5.1', 87.9, 46.25],
];
const KAI = [
  ['Kai', 0.021, 0, true],
  ['Claude Opus 5', 5.57, 27.83],
  ['GPT-5.5', 5.57, 33.39],
  ['GPT-6 Astra', 11.13, 55.65],
  ['Claude Fable 5.1', 11.13, 55.65],
];
const money = (v) => (v >= 1e6 ? '$' + (v / 1e6).toFixed(2) + 'M' : v >= 1000 ? '$' + Math.round(v).toLocaleString('en-US') : '$' + v.toFixed(2));
const nice = (q) => { const p = 10 ** Math.floor(Math.log10(q)); return Math.round(q / p * 2) / 2 * p; };

const bar = (i) => ({ h: { scaleX: 0 }, s: { scaleX: 1, transition: { type: 'spring', stiffness: 90, damping: 18, delay: 0.25 + i * 0.09 } } });

function EnsoLane({ row, i, vol, dim, setDim }) {
  const [who, acc, cost, hi] = row;
  const v = useTransform(vol, (q) => `${acc}% · ${money(cost * q / 1000)}`);
  return (
    <div className={'x-lane' + (hi ? ' hi' : '') + (dim !== null && dim !== i ? ' dim' : '')} onPointerEnter={() => setDim(i)} onPointerLeave={() => setDim(null)}>
      <div className="x-lane-h"><span>{who}</span><motion.span className="x-mono x-lane-v">{v}</motion.span></div>
      <i className="x-lane-track"><motion.b style={{ width: (cost / 46.25) * 100 + '%' }} variants={bar(i)} /></i>
    </div>
  );
}

/* Hanzo's Enso comparison, with one control: how many questions. The rates are Hanzo's; only the count changes. */
function EnsoCard() {
  const [dim, setDim] = useState(null);
  const [exp, setExp] = useState(0); // 10^exp thousand questions
  const raw = useMotionValue(1000);
  const vol = useSpring(raw, { stiffness: 120, damping: 22 });
  const q = nice(1000 * 10 ** exp);
  return (
    <Rise className="x-cost">
      <p className="x-race-k">Enso vs frontier LLMs · GPQA Diamond</p>
      <p className="x-cost-big">up to 14.2× less</p>
      <p className="x-race-cap">per 1,000 questions, at higher accuracy</p>
      <p className="x-race-note">Enso Flash answers 90.6% of new GPQA Diamond questions at $3.26 per 1,000 — higher accuracy than Claude Fable 5.1 (87.9% at $46.25). Enso reaches 93.7% at $10.03, ahead of the best single model (93.1%).</p>
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
        {ENSO.map((r, i) => <EnsoLane key={r[0]} row={r} i={i} vol={vol} dim={dim} setDim={setDim} />)}
      </motion.div>
      <div className="x-race-end"><Arrow href="/enso">How Enso lowers the cost of an answer</Arrow></div>
    </Rise>
  );
}

function KaiCard() {
  const [dim, setDim] = useState(null);
  const max = 11.13 + 55.65;
  return (
    <Rise className="x-cost" delay={0.1}>
      <p className="x-race-k">Kai vs frontier LLMs</p>
      <p className="x-cost-big">up to 530× less</p>
      <p className="x-race-cap">than frontier LLMs, per input token</p>
      <p className="x-race-note">Kai bills input only; an LLM also bills every token it writes.</p>
      <p className="x-vol"><span className="x-mono">Per million tokens, input and output · less is cheaper</span></p>
      <motion.div className="x-lanes" initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }}>
        {KAI.map(([who, inp, out, hi], i) => (
          <div key={who} className={'x-lane' + (hi ? ' hi' : '') + (dim !== null && dim !== i ? ' dim' : '')} onPointerEnter={() => setDim(i)} onPointerLeave={() => setDim(null)}>
            <div className="x-lane-h"><span>{who}</span><span className="x-mono x-lane-v"><b>${inp}</b> in · ${out} out</span></div>
            <i className="x-lane-track two">
              <motion.b style={{ width: `max(3px, ${(inp / max) * 100}%)` }} variants={bar(i)} />
              <motion.s style={{ width: (out / max) * 100 + '%' }} variants={bar(i + 0.5)} />
            </i>
          </div>
        ))}
      </motion.div>
      <div className="x-race-end"><Arrow href="/kai">How Kai makes decisions</Arrow></div>
    </Rise>
  );
}

export default function Cheaper() {
  return (
    <section className="x-sec x-cheaper" id="cheaper" aria-labelledby="cheaper-h">
      <div className="x-wrap">
        <Head title="The same intelligence. A smaller bill." lede="Enso routes each answer to the right model. Kai answers a decision directly." />
        <div className="x-races"><EnsoCard /><KaiCard /></div>
        <div className="x-row-links">
          <Arrow href="https://docs.hanzo.ai/docs/models/enso">Which Enso tier for which job</Arrow>
          <Arrow href="/pricing">Every model rate</Arrow>
        </div>
      </div>
    </section>
  );
}
