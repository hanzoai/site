'use client';
import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Head, Arrow, Rise } from './ui';

// placed exactly where Hanzo's own chart places them (log cost across, accuracy up)
const D = [
  ['DeepSeek V4 Pro', 76.3, 1.04], ['Sonnet 5', 77.8, 42.91], ['Fable 5', 82.8, 14.93], ['Haiku 5.5', 83.3, 1.06],
  ['Opus 4.8', 87.4, 45.01], ['Fable 5.1', 87.9, 46.25], ['Sonnet 5.5', 90.4, 10.39], ['GPT-5.5', 90.4, 18.62],
  ['GLM 5.3', 90.9, 0.94], ['Opus 5.5', 90.9, 21.21], ['GPT-5.6 Sol', 91.9, 10.07], ['Grok 4.7', 92.7, 4.56],
  ['Kimi K3', 93.5, 10.59], ['GPT-6 Sol', 94.3, 5.08], ['Enso Flash', 95.5, 3.25, 1], ['Enso', 96.5, 10.01, 1], ['Enso Ultra', 98.0, 14.74, 1],
];
const VW = 1152, VH = 470, L = 60, R = 1120, T = 24, B = 412;
const lx = (c) => L + ((Math.log10(c) - Math.log10(0.8)) / (Math.log10(60) - Math.log10(0.8))) * (R - L);
const ly = (a) => B - ((a - 75) / 25) * (B - T);
const cost = (x) => 10 ** (Math.log10(0.8) + ((x - L) / (R - L)) * (Math.log10(60) - Math.log10(0.8)));

export default function Pareto() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.45 });
  const [hot, setHot] = useState(null);
  const [cap, setCap] = useState(lx(4));
  const [dragging, setDragging] = useState(false);
  // rounded so the server and the browser draw identical numbers
  const pts = useMemo(() => D.map(([n, a, c, e]) => ({ n, a, c, e: !!e, x: Math.round(lx(c) * 100) / 100, y: Math.round(ly(a) * 100) / 100 })).sort((p, q) => p.c - q.c), []);
  const front = useMemo(() => { let best = -1; return pts.filter((p) => (p.a > best ? ((best = p.a), true) : false)); }, [pts]);
  const path = front.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
  const within = pts.filter((p) => p.x <= cap);
  const pick = within.reduce((m, p) => (!m || p.a > m.a ? p : m), null);

  // the budget line: drag it along the cost axis; the most accurate model under it lights up
  const toX = (clientX) => { const r = box.current.querySelector('svg').getBoundingClientRect(); return Math.max(L + 4, Math.min(R, ((clientX - r.left) / r.width) * VW)); };
  const onDown = (e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); setCap(toX(e.clientX)); };
  const onMove = (e) => { if (dragging) setCap(toX(e.clientX)); };
  const onKey = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setCap((c) => Math.max(L + 4, Math.min(R, c + (e.key === 'ArrowRight' ? 12 : -12)))); } };
  const c = cost(cap);

  return (
    <section className="x-sec x-pareto" id="pareto" aria-labelledby="pareto-h">
      <div className="x-wrap">
        <Head title="A New Pareto Frontier of Intelligence" lede="GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers." />
        <Rise className="x-plot" ref={box}>
          <div className="x-plot-read" aria-live="polite">
            <span className="x-mono">Budget · ${c < 10 ? c.toFixed(2) : Math.round(c)} per 1,000 questions</span>
            <b>{pick ? `${pick.n} · ${pick.a.toFixed(1)}%` : '—'}</b>
          </div>
          <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label="GPQA Diamond accuracy against what 1,000 questions cost, on a log scale" onPointerMove={onMove} onPointerUp={() => setDragging(false)}>
            {[75, 80, 85, 90, 95, 100].map((a) => (
              <g key={a}><line x1={L} x2={R} y1={ly(a)} y2={ly(a)} className="ax" /><text x={L - 12} y={ly(a) + 4} textAnchor="end" className="tick">{a}</text></g>
            ))}
            {[1, 3, 10, 30].map((v) => <text key={v} x={lx(v)} y={B + 26} textAnchor="middle" className="tick">${v}</text>)}
            <text x={L} y={T - 8} className="tick">GPQA Diamond %</text>
            <text x={R} y={B + 50} textAnchor="end" className="tick">cheaper ← $ per 1,000 questions → dearer</text>
            <motion.rect x={L} y={T} height={B - T} className="x-plot-zone" animate={{ width: cap - L }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} />
            <motion.path d={path} className="front" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 1.6, ease: EASE, delay: 0.9 }} />
            {hot && (
              <g className="guide" aria-hidden="true">
                <line x1={hot.x} x2={hot.x} y1={hot.y} y2={B} /><line x1={L} x2={hot.x} y1={hot.y} y2={hot.y} />
              </g>
            )}
            {pts.map((p, i) => {
              const lit = (hot ? hot.n === p.n : true) && p.x <= cap;
              const best = pick && pick.n === p.n;
              return (
                <motion.g
                  key={p.n}
                  className={'pt' + (p.e ? ' enso' : '') + (best ? ' best' : '')}
                  tabIndex={0}
                  role="img"
                  aria-label={`${p.n} ${p.a.toFixed(1)}%`}
                  onPointerEnter={() => setHot(p)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(p)} onBlur={() => setHot(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={seen ? { opacity: lit ? 1 : 0.28, scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 360, damping: 20, delay: seen && !hot ? 0.15 + i * 0.05 : 0 }}
                  style={{ originX: p.x + 'px', originY: p.y + 'px', transformBox: 'view-box' }}
                >
                  {p.e && <circle cx={p.x} cy={p.y} r="15" className="halo" />}
                  <circle cx={p.x} cy={p.y} r={p.e ? 7 : 5} />
                  {(p.e || best || (hot && hot.n === p.n)) && <text x={p.x + (p.x > 940 ? -12 : 12)} y={p.y + 4} textAnchor={p.x > 940 ? 'end' : 'start'}>{p.n} {p.a.toFixed(1)}%</text>}
                </motion.g>
              );
            })}
            <g
              className={'cap' + (dragging ? ' on' : '')}
              transform={`translate(${cap} 0)`}
              tabIndex={0}
              role="slider"
              aria-label="Budget per 1,000 questions"
              aria-valuemin={0.8} aria-valuemax={60} aria-valuenow={+c.toFixed(2)} aria-valuetext={`$${c.toFixed(2)}`}
              onPointerDown={onDown}
              onKeyDown={onKey}
            >
              <line y1={T - 6} y2={B} />
              <rect x="-14" y={B - 4} width="28" height="22" rx="11" />
              <path d={`M-4 ${B + 7}l-3 0M4 ${B + 7}l3 0`} />
              <rect x="-22" y={T - 6} width="44" height={B - T + 30} className="hit" />
            </g>
          </svg>
          <p className="x-plot-hint">Drag the line to set a budget. Point at any model to read it.</p>
        </Rise>
        <div className="x-row-links">
          <Arrow href="/enso">How Enso routes</Arrow>
          <Arrow href="https://docs.hanzo.ai/docs/guides/cookbook/route">Route your own requests with Enso</Arrow>
        </div>
      </div>
    </section>
  );
}
