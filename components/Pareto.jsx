'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Arrow } from './ui';
import Lines from './v2/Lines';

// placed exactly where Hanzo's own chart places them (log cost across, accuracy up).
// [name as Hanzo writes it, label on the chart, GPQA Diamond %, $ per 1,000 questions as Hanzo prints it, kind, reported by, date, source]
// kind: m = one model tested on the same 198 questions, r = a score reported by a lab or an independent evaluation, e = an Enso tier
const D = [
  ['DeepSeek V4 Pro 0423', 'DeepSeek V4 Pro', 76.3, '1.05', 'm'], ['Claude Sonnet 5', 'Sonnet 5', 77.8, '42.91', 'm'], ['Claude Fable 5', 'Fable 5', 82.8, '14.95', 'm'], ['Claude Haiku 5.5', 'Haiku 5.5', 83.3, '1.07', 'm'],
  ['Claude Opus 4.8', 'Opus 4.8', 87.4, '45.01', 'm'], ['Claude Fable 5.1', 'Fable 5.1', 87.9, '46.25', 'm'], ['Claude Sonnet 5.5', 'Sonnet 5.5', 90.4, '10.41', 'm'], ['GPT-5.5', 'GPT-5.5', 90.4, '18.64', 'm'],
  ['GLM 5.3', 'GLM 5.3', 90.9, '0.945', 'r', 'Epoch AI (independent)', '2026-08-14', 'https://epoch.ai/models/glm-5-3'], ['Claude Opus 5.5', 'Opus 5.5', 90.9, '21.23', 'm'], ['GPT-5.6 Sol', 'GPT-5.6 Sol', 91.9, '10.08', 'm'],
  ['Grok 4.7', 'Grok 4.7', 92.7, '4.57', 'r', 'Epoch AI (independent)', '2026-09-21', 'https://epoch.ai/models/grok-4-7'],
  ['Kimi K3', 'Kimi K3', 93.5, '10.61', 'r', 'Moonshot AI (lab)', '2026-07-16', 'https://github.com/MoonshotAI/Kimi-K3'],
  ['GPT-6 Sol', 'GPT-6 Sol', 94.3, '5.09', 'r', 'Epoch AI (independent)', '2026-09-22', 'https://epoch.ai/models/gpt-6-sol'],
  ['Enso Flash', 'Enso Flash', 95.5, '3.26', 'e'], ['Enso', 'Enso', 96.5, '10.03', 'e'], ['Enso Ultra', 'Enso Ultra', 98.0, '14.76', 'e'],
];
// Hanzo's words for each point, kept in the page for readers who cannot hover
const say = (full, a, c, k, who, date, src) => (k === 'm'
  ? `${full} ${a}%, a single model tested on the same 198 GPQA Diamond questions, $${c} per 1,000 of them`
  : k === 'r'
    ? `${full} ${a}% on GPQA Diamond, reported by ${who}, ${date}; $${c} per 1,000 questions estimated from its list price. ${src}`
    : `${full} at $${c} per 1,000, its cost on new questions: ${a}% · questions it has seen`);
// the sentence shown on the card: the model's name and score are already its heading, and the source is its link
const tipText = (p) => (p.e ? p.say : p.say.replace(`${p.full} ${p.a.toFixed(1)}%`, '').replace(/^[,\s]+/, '').replace(p.src ? ' ' + p.src : '', '').replace(/^./, (m) => m.toUpperCase()));
const KEY = "GPQA Diamond accuracy against what 1,000 questions cost, on a log scale; models under 70% are not drawn. Plain discs are single models tested on the same 198 questions, each at its best run and the cost it filed. Ink discs wearing Hanzo's H are Enso's tiers on questions it has seen, each at its tier's cost on new questions. Dashed discs are scores reported by a lab or an independent evaluation, each at its model's list price times the median tokens a question took in our runs of its lab's models, or of all of them. The frontier, the points no other beats on both accuracy and cost, is GLM 5.3, Enso Flash, Enso, Enso Ultra.";
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
  // a point's card stays while the pointer travels to its source link; touch keeps it until you tap elsewhere
  const gone = useRef(0);
  const show = (p) => { clearTimeout(gone.current); setHot(p); };
  const hide = (e) => { if (e && e.pointerType === 'touch') return; clearTimeout(gone.current); gone.current = setTimeout(() => setHot(null), 180); };
  useEffect(() => () => clearTimeout(gone.current), []);
  // rounded so the server and the browser draw identical numbers
  const pts = useMemo(() => D.map(([full, n, a, cs, k, who, date, src]) => {
    const c = parseFloat(cs);
    return { full, n, a, c, e: k === 'e', r: k === 'r', src, say: say(full, a.toFixed(1), cs, k, who, date, src), x: Math.round(lx(c) * 100) / 100, y: Math.round(ly(a) * 100) / 100 };
  }).sort((p, q) => p.c - q.c), []);
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
    <section className="hv-pareto v2-sec" id="pareto" aria-labelledby="pareto-h">
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="pareto-h" className="v2-display-s hv-head-t" lines={['A New Pareto Frontier', 'of Intelligence']} />
          <div className="hv-head-r">
            <p className="v2-lede">GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers.</p>
            <div className="hv-links">
              <Arrow href="/enso">How Enso routes</Arrow>
              <Arrow href="https://docs.hanzo.ai/docs/guides/cookbook/route">Route your own requests with Enso</Arrow>
            </div>
          </div>
        </header>
        <div className="x-plot hv-plot" ref={box} onPointerDown={(e) => { if (!e.target.closest('.pt, .x-tip')) setHot(null); }}>
          <div className="x-plot-read" aria-live="polite">
            <span className="x-mono">Budget · ${c < 10 ? c.toFixed(2) : Math.round(c)} per 1,000 questions</span>
            <b>{pick ? `${pick.full} · ${pick.a.toFixed(1)}%` : '—'}</b>
          </div>
          <div className="x-plot-svg">
          <svg viewBox={`0 0 ${VW} ${VH}`} role="group" aria-label={KEY} onPointerMove={onMove} onPointerUp={() => setDragging(false)}>
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
              const body = (
                <>
                  {p.e && <circle cx={p.x} cy={p.y} r="15" className="halo" />}
                  <circle cx={p.x} cy={p.y} r={p.e ? 7 : 5} />
                  <text x={p.x + (p.x > 940 ? -12 : 12)} y={p.y + 4} textAnchor={p.x > 940 ? 'end' : 'start'}>{p.n} {p.a.toFixed(1)}%</text>
                </>
              );
              return (
                <motion.g
                  key={p.n}
                  className={'pt' + (p.e ? ' enso' : '') + (p.r ? ' rep' : '') + (best ? ' best' : '') + (hot && hot.n === p.n ? ' hot' : '')}
                  {...(p.src ? {} : { tabIndex: 0, role: 'img', 'aria-label': p.say })}
                  onPointerEnter={() => show(p)} onPointerLeave={hide} onFocus={() => show(p)} onBlur={() => hide()}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={seen ? { opacity: lit ? 1 : 0.28, scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 360, damping: 20, delay: seen && !hot ? 0.15 + i * 0.05 : 0 }}
                  style={{ originX: p.x + 'px', originY: p.y + 'px', transformBox: 'view-box' }}
                >
                  {p.src ? <a href={p.src} target="_blank" rel="noopener noreferrer" aria-label={p.say}>{body}</a> : body}
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
          {hot && (
            <div className={'x-tip' + (hot.y < 190 ? ' below' : '')} style={{ left: Math.max(24, Math.min(76, (hot.x / VW) * 100)) + '%', top: (hot.y / VH) * 100 + '%' }} onPointerEnter={() => show(hot)} onPointerLeave={hide}>
              <b>{hot.full}<i>{hot.a.toFixed(1)}%</i></b>
              <span>{tipText(hot)}</span>
              {hot.src && <a href={hot.src} target="_blank" rel="noopener noreferrer">Source: {hot.src.replace('https://', '')} ↗</a>}
            </div>
          )}
          </div>
          <p className="x-plot-hint">Drag the line to set a budget. Point at any model to read it.</p>
          <p className="x-plot-src">
            Dashed discs are scores reported by a lab or an independent evaluation:
            {pts.filter((p) => p.src).map((p) => <a key={p.n} href={p.src} target="_blank" rel="noopener noreferrer">{p.full} ↗</a>)}
          </p>
        </div>
      </div>
    </section>
  );
}
