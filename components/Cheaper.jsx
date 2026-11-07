'use client';
/* Home, cost (v2), the second chapter of the dark argument room. Two hero figures split by one hairline: Enso, up to 14.2× less, and Kai, up to 530× less.
   One control lets you say how many questions you ask; the rates are Hanzo's, only the count changes. */
import { useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react';
import { Arrow } from './ui';
import Lines from './v2/Lines';

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
/* the claim rests at 64px and grows while it crosses the middle of the screen, then settles (MASTER 3.1) */
function useMoment(at) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // side by side, the two claims share a scroll position: Enso has the first half of the pass, Kai the second
  const scale = useTransform(p, at, [1, 1.45, 1.45, 1]);
  return [ref, scale];
}
const money = (v) => (v >= 1e6 ? '$' + (v / 1e6).toFixed(2) + 'M' : v >= 1000 ? '$' + Math.round(v).toLocaleString('en-US') : '$' + v.toFixed(2));
const nice = (q) => { const p = 10 ** Math.floor(Math.log10(q)); return Math.round(q / p * 2) / 2 * p; };
const bar = (i) => ({ h: { scaleX: 0 }, s: { scaleX: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.06 } } });

function EnsoLane({ row, i, vol }) {
  const [who, acc, cost, hi] = row;
  const v = useTransform(vol, (q) => `${acc}% · ${money(cost * q / 1000)}`);
  return (
    <div className={'hv-lane' + (hi ? ' hi' : '')}>
      <div className="hv-lane-h"><span>{who}</span><motion.span className="x-mono hv-lane-v">{v}</motion.span></div>
      <i className="hv-lane-track"><motion.b style={{ width: (cost / 46.25) * 100 + '%' }} variants={bar(i)} /></i>
    </div>
  );
}

function Enso() {
  const [ref, scale] = useMoment([0.14, 0.26, 0.38, 0.47]);
  const [exp, setExp] = useState(0); // 10^exp thousand questions
  const raw = useMotionValue(1000);
  const vol = raw;
  const q = nice(1000 * 10 ** exp);
  return (
    <div className="hv-cost">
      <motion.p className="hv-cost-big" ref={ref} style={{ scale }}><span className="hv-upto">up to</span> <span className="v2-figure">14.2×</span> <span className="hv-less">less</span></motion.p>
      <p className="hv-cap">per 1,000 questions, at higher accuracy</p>
      <p className="v2-kicker hv-run-k">Enso vs frontier LLMs · GPQA Diamond</p>
      <p className="hv-run-note">Enso Flash answers 90.6% of new GPQA Diamond questions at $3.26 per 1,000 — higher accuracy than Claude Fable 5.1 (87.9% at $46.25). Enso reaches 93.7% at $10.03, ahead of the best single model (93.1%).</p>
      <label className="hv-vol">
        <span className="x-mono">Per {q.toLocaleString('en-US')} GPQA Diamond questions · less is cheaper</span>
        <input
          type="range" min="0" max="3" step="0.01" value={exp}
          aria-label="Number of questions"
          aria-valuetext={q.toLocaleString('en-US') + ' questions'}
          onChange={(e) => { const x = +e.target.value; setExp(x); raw.set(nice(1000 * 10 ** x)); }}
        />
      </label>
      <motion.div className="hv-lanes" initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }}>
        {ENSO.map((r, i) => <EnsoLane key={r[0]} row={r} i={i} vol={vol} />)}
      </motion.div>
      <div className="hv-run-end"><Arrow href="/enso">How Enso lowers the cost of an answer</Arrow></div>
    </div>
  );
}

function Kai() {
  const [ref, scale] = useMoment([0.5, 0.6, 0.72, 0.82]);
  const max = 11.13 + 55.65;
  return (
    <div className="hv-cost">
      <motion.p className="hv-cost-big" ref={ref} style={{ scale }}><span className="hv-upto">up to</span> <span className="v2-figure">530×</span> <span className="hv-less">less</span></motion.p>
      <p className="hv-cap">than frontier LLMs, per input token</p>
      <p className="v2-kicker hv-run-k">Kai vs frontier LLMs</p>
      <p className="hv-run-note">Kai bills input only; an LLM also bills every token it writes.</p>
      <p className="hv-vol"><span className="x-mono">Per million tokens, input and output · less is cheaper</span></p>
      <motion.div className="hv-lanes" initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }}>
        {KAI.map(([who, inp, out, hi], i) => (
          <div key={who} className={'hv-lane' + (hi ? ' hi' : '')}>
            <div className="hv-lane-h"><span>{who}</span><span className="x-mono hv-lane-v"><b>${inp}</b> in · ${out} out</span></div>
            <i className="hv-lane-track two">
              <motion.b style={{ width: `max(3px, ${(inp / max) * 100}%)` }} variants={bar(i)} />
              <motion.s style={{ width: (out / max) * 100 + '%' }} variants={bar(i + 0.5)} />
            </i>
          </div>
        ))}
      </motion.div>
      <div className="hv-run-end"><Arrow href="/kai">How Kai makes decisions</Arrow></div>
    </div>
  );
}

export default function Cheaper() {
  return (
    <section className="hv-cheap hv-room v2-sec" data-room="dark" id="cheaper" aria-labelledby="cheaper-h">
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="cheaper-h" className="hv-h2 hv-head-t" lines={['The same intelligence. A smaller bill.']} />
          <div className="hv-head-r">
            <p className="hv-lead">Enso routes each answer to the right model. Kai answers a decision directly.</p>
            <div className="hv-links">
              <Arrow href="https://docs.hanzo.ai/docs/models/enso">Which Enso tier for which job</Arrow>
              <Arrow href="/pricing">Every model rate</Arrow>
            </div>
          </div>
        </header>
        <div className="hv-costs"><Enso /><Kai /></div>
      </div>
    </section>
  );
}
