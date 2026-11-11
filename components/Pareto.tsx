'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Head, Arrow } from './ui';
import useFigures from './home/useFigures';
import { lab } from './lab';

// placed exactly where Hanzo's own chart places them (log cost across, accuracy up).
// [name as Hanzo writes it, label on the chart, GPQA Diamond %, $ per 1,000 questions as Hanzo prints it, kind, reported by, date, source]
// kind: m = one model tested on the same 198 questions, r = a score reported by a lab or an independent evaluation, e = an Enso tier
// single models (each at its best run on the same 198 questions, the cost it filed per 1,000) and Enso's tiers (questions
// it has seen, at its cost on new ones) come from the research runs hanzo.ai reads (components/home/figures.js); the
// scores reported by a lab or an independent evaluation are the ones hanzo.ai cites, with their sources.
const short = (n) => n.replace(/^Claude /, '').replace(/ \d{4}$/, '');
const c2 = (x) => (x >= 1 ? x.toFixed(2) : String(+x.toPrecision(3)));
const pointsOf = (GPQA) => [
  ...GPQA.measured.filter((d) => d.accuracy >= 0.7).map((d) => [d.name, short(d.name), +(d.accuracy * 100).toFixed(1), c2(d.cost), 'm']),
  ['GLM 5.3', 'GLM 5.3', 90.9, '0.945', 'r', 'Epoch AI (independent)', '2026-08-14', 'https://epoch.ai/models/glm-5-3'],
  ['Grok 4.7', 'Grok 4.7', 92.7, '4.57', 'r', 'Epoch AI (independent)', '2026-09-21', 'https://epoch.ai/models/grok-4-7'],
  ['Kimi K3', 'Kimi K3', 93.5, '10.61', 'r', 'Moonshot AI (lab)', '2026-07-16', 'https://github.com/MoonshotAI/Kimi-K3'],
  ['GPT-6 Sol', 'GPT-6 Sol', 94.3, '5.09', 'r', 'Epoch AI (independent)', '2026-09-22', 'https://epoch.ai/models/gpt-6-sol'],
  ...GPQA.tiers.map((t) => [t.name, t.name, +(t.seen * 100).toFixed(1), c2(t.per1k), 'e']),
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
// two drawings of the same chart: wide for desktop, and a taller one for phones so labels, dots and the handle stay
// readable and touchable at true size (a composition, not a shrunk desktop)
const DESK = { VW: 1152, VH: 470, L: 60, R: 1120, T: 24, B: 412, ph: false };
const PHONE = { VW: 640, VH: 660, L: 64, R: 604, T: 40, B: 540, ph: true };
// the discs and the marks inside them, in the CSS px hanzo-inc/app's chart draws them at (components/enso/Chart `geom`),
// by the width the drawing is shown at: a phone's, a card's, a wide card's. Enso's stays the largest.
const DISC = (w) => (w < 600 ? { r: 8, ours: 10, mark: 11, h: 12 } : w < 1000 ? { r: 9, ours: 11, mark: 12, h: 13 } : { r: 11, ours: 13, mark: 15, h: 15 });
const geo = (g) => ({
  ...g,
  lx: (c) => g.L + ((Math.log10(c) - Math.log10(0.8)) / (Math.log10(60) - Math.log10(0.8))) * (g.R - g.L),
  ly: (a) => g.B - ((a - 75) / 25) * (g.B - g.T),
  cost: (x) => 10 ** (Math.log10(0.8) + ((x - g.L) / (g.R - g.L)) * (Math.log10(60) - Math.log10(0.8))),
});

export default function Pareto() {
  const { GPQA } = useFigures();
  const D = useMemo(() => pointsOf(GPQA), [GPQA]);
  const box = useRef(null);
  const [hot, setHot] = useState(null);
  const [ph, setPh] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width: 599px)');
    const on = () => setPh(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const g = useMemo(() => geo(ph ? PHONE : DESK), [ph]);
  const { VW, VH, L, R, T, B, lx, ly } = g;
  // user units to a CSS px, read off the drawing as it is shown, so a disc and its mark are the same size at every width
  const [k, setK] = useState(null);
  useEffect(() => {
    const svg = box.current.querySelector('svg');
    const read = () => { const m = svg.getScreenCTM(); if (m && m.a > 0) setK(1 / m.a); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [ph]);
  const u = k ?? (ph ? 1.9 : 1.4);
  const px = DISC(VW / u);
  // the budget is kept in dollars, so it holds its place when the drawing changes
  const [budget, setBudget] = useState(4);
  const cap = lx(budget);
  const setCap = (f) => setBudget((b) => g.cost(typeof f === 'function' ? f(lx(b)) : f));
  const [dragging, setDragging] = useState(false);
  // a point's card stays while the pointer travels to its source link; touch keeps it until you tap elsewhere
  const gone = useRef(0);
  const show = (p) => { clearTimeout(gone.current); setHot(p); };
  const hide = (e) => { if (e && e.pointerType === 'touch') return; clearTimeout(gone.current); gone.current = setTimeout(() => setHot(null), 180); };
  useEffect(() => () => clearTimeout(gone.current), []);
  // rounded so the server and the browser draw identical numbers
  const pts = useMemo(() => D.map(([full, n, a, cs, kind, who, date, src]) => {
    const c = parseFloat(cs);
    return { full, n, a, c, e: kind === 'e', r: kind === 'r', src, mark: lab(full, kind === 'e'), say: say(full, a.toFixed(1), cs, kind, who, date, src), x: Math.round(lx(c) * 100) / 100, y: Math.round(ly(a) * 100) / 100 };
  }).sort((p, q) => p.c - q.c), [D, lx, ly]);
  const front = useMemo(() => { let best = -1; return pts.filter((p) => (p.a > best ? ((best = p.a), true) : false)); }, [pts]);
  const path = front.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
  const within = pts.filter((p) => p.x <= cap);
  const pick = within.reduce((m, p) => (!m || p.a > m.a ? p : m), null);

  // the budget line: drag it along the cost axis; the most accurate model under it lights up
  const toX = (clientX) => { const r = box.current.querySelector('svg').getBoundingClientRect(); return Math.max(L + 4, Math.min(R, ((clientX - r.left) / r.width) * VW)); };
  const onDown = (e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); setCap(toX(e.clientX)); };
  const onMove = (e) => { if (dragging) setCap(toX(e.clientX)); };
  const onKey = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setCap((c) => Math.max(L + 4, Math.min(R, c + (e.key === 'ArrowRight' ? 12 : -12)))); } };
  const c = budget;
  const hw = ph ? 48 : 14, flip = VW * 0.8;

  return (
    <section className="x-sec x-pareto" id="pareto" data-hz-view="pareto" aria-labelledby="pareto-h">
      <div className="x-wrap">
        <Head id="pareto-h" title="A New Pareto Frontier of Intelligence" lede="GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers." />
        <div className="x-plot" data-tilt="" ref={box} onPointerDown={(e) => { if (!e.target.closest('.pt, .x-tip')) setHot(null); }}>
          <div className="x-plot-read" aria-live="polite">
            <span className="x-mono">Budget · ${c < 10 ? c.toFixed(2) : Math.round(c)} per 1,000 questions</span>
            <b>{pick ? `${pick.full} · ${pick.a.toFixed(1)}%` : '—'}</b>
          </div>
          <div className="x-plot-svg">
          <svg viewBox={`0 0 ${VW} ${VH}`} role="group" aria-label={KEY} style={{ '--u': u }} onPointerMove={onMove} onPointerUp={() => setDragging(false)}>
            {[75, 80, 85, 90, 95, 100].map((a) => (
              <g key={a}><line x1={L} x2={R} y1={ly(a)} y2={ly(a)} className="ax" /><text x={L - 12} y={ly(a) + (ph ? 8 : 4)} textAnchor="end" className="tick">{a}</text></g>
            ))}
            {[1, 3, 10, 30].map((v) => <text key={v} x={lx(v)} y={B + (ph ? 74 : 26)} textAnchor="middle" className="tick">${v}</text>)}
            <text x={L} y={T - (ph ? 16 : 8)} className="tick">GPQA Diamond %</text>
            <text x={R} y={B + (ph ? 112 : 50)} textAnchor="end" className="tick">cheaper ← $ per 1,000 questions → dearer</text>
            <motion.rect x={L} y={T} height={B - T} className="x-plot-zone" initial={{ width: cap - L }} animate={{ width: cap - L }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} />
            <path d={path} className="front" />
            {hot && (
              <g className="guide" aria-hidden="true">
                <line x1={hot.x} x2={hot.x} y1={hot.y} y2={B} /><line x1={L} x2={hot.x} y1={hot.y} y2={hot.y} />
              </g>
            )}
            {/* Enso's tiers are drawn last, on top, as the app draws them; the cards still enter in cost order */}
            {[...pts].sort((p, q) => p.e - q.e).map((p) => {
              const lit = (hot ? hot.n === p.n : true) && p.x <= cap;
              const best = pick && pick.n === p.n;
              const rad = u * (p.e ? px.ours : px.r), m = p.mark, ms = u * (p.e ? px.h : px.mark);
              const body = (
                <>
                  {p.e && <circle cx={p.x} cy={p.y} r={rad * 2.1} className="halo" />}
                  <circle cx={p.x} cy={p.y} r={rad} />
                  {m && (m.src
                    ? <image className="mk" href={m.src} x={p.x - ms / 2} y={p.y - ms / 2} width={ms} height={ms} aria-hidden="true" />
                    : <svg className="mk" x={p.x - ms / 2} y={p.y - ms / 2} width={ms} height={ms} viewBox={m.box} fill="currentColor" fillRule={m.rule} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: m.inner }} />)}
                  <text x={p.x + (p.x > flip ? -(rad + 6) : rad + 6)} y={p.y + (ph ? 8 : 4)} textAnchor={p.x > flip ? 'end' : 'start'}>{p.n} {p.a.toFixed(1)}%</text>
                </>
              );
              return (
                <motion.g
                  key={p.n}
                  className={'pt' + (p.e ? ' enso' : '') + (p.r ? ' rep' : '') + (best ? ' best' : '') + (hot && hot.n === p.n ? ' hot' : '')}
                  {...(p.src ? {} : { tabIndex: 0, role: 'img', 'aria-label': p.say })}
                  onPointerEnter={() => show(p)} onPointerLeave={hide} onFocus={() => show(p)} onBlur={() => hide()}
                  initial={false}
                  animate={{ opacity: lit ? 1 : 0.28 }}
                  transition={{ duration: 0.2 }}
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
              <rect x={-hw} y={B - 4} width={hw * 2} height={ph ? 44 : 22} rx={ph ? 22 : 11} />
              <path d={ph ? `M-8 ${B + 18}l-8 0M8 ${B + 18}l8 0` : `M-4 ${B + 7}l-3 0M4 ${B + 7}l3 0`} />
              <rect x={-Math.max(22, hw)} y={T - 6} width={Math.max(44, hw * 2)} height={B - T + (ph ? 50 : 30)} className="hit" />
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
        <div className="x-row-links">
          <Arrow href="/enso">How Enso routes</Arrow>
          <Arrow href="https://docs.hanzo.ai/docs/guides/cookbook/route">Route your own requests with Enso</Arrow>
          <Arrow href="/benchmarks#enso">Every board</Arrow>
          <Arrow href="/research">Published research &amp; specifications</Arrow>
        </div>
      </div>
    </section>
  );
}
