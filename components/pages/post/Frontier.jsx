'use client';
/* The post's GPQA Diamond chart: accuracy against what 1,000 questions cost (log scale), every dot from hanzo.ai's own
   chart. The faint line joins the single models nobody beats on both price and score; Enso's three tiers sit apart,
   ringed, because Hanzo marks them "questions it has seen". When idle the readout walks the dots by itself; hover, focus
   or press one to read its sentence. Labels are HTML over the plot so they stay legible on a phone. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';

const L = 48, R = 20, T = 18, B = 40, VW = 640, VH = 380;
const X0 = Math.log10(0.8), X1 = Math.log10(60);

export default function Frontier({ f }) {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.35 });
  const live = useInView(box, { amount: 0.2 });
  const order = useMemo(() => f.dots.map((d, i) => i).sort((a, b) => f.dots[a].cost - f.dots[b].cost), [f.dots]);
  const [at, setAt] = useState(order[order.length - 1]);
  const [held, setHeld] = useState(false);
  const y0 = Math.min(...f.y) - 1, y1 = Math.max(...f.y);
  const px = (c) => L + ((Math.log10(c) - X0) / (X1 - X0)) * (VW - L - R);
  const py = (a) => T + (1 - (a - y0) / (y1 - y0)) * (VH - T - B);
  // single models nobody beats on both price and score, cheapest first
  const edge = useMemo(() => {
    let best = -1;
    return order.map((i) => f.dots[i]).filter((d) => d.kind !== 'enso' && d.acc > best && ((best = d.acc), true));
  }, [order, f.dots]);

  useEffect(() => {
    if (held || !live || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setAt((a) => order[(order.indexOf(a) + 1) % order.length]), 2400);
    return () => clearInterval(id);
  }, [held, live, order]);

  const d = f.dots[at];
  const pick = (i) => { setAt(i); setHeld(true); };
  return (
    <figure className="xbg-gpqa" ref={box} onMouseLeave={() => setHeld(false)}>
      <div className="xbg-plot">
        <svg viewBox={`0 0 ${VW} ${VH}`} role="group" aria-label={f.yLabel + ', ' + f.xLabel}>
          {f.y.map((v) => <line key={v} x1={L} x2={VW - R} y1={py(v)} y2={py(v)} className="xbg-grid" />)}
          {f.x.map((v) => <line key={v} y1={T} y2={VH - B} x1={px(+v.slice(1))} x2={px(+v.slice(1))} className="xbg-grid" />)}
          <motion.polyline points={edge.map((e) => px(e.cost) + ',' + py(e.acc)).join(' ')} className="xbg-edge" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: EASE, delay: 0.9 }} />
          {f.dots.map((p, i) => (
            <g key={i} tabIndex={0} role="img" aria-label={p.said} className={'xbg-dot ' + p.kind + (i === at ? ' on' : '')}
              onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onBlur={() => setHeld(false)} onClick={() => pick(i)}>
              <circle cx={px(p.cost)} cy={py(p.acc)} r="16" className="xbg-hit" />
              <motion.circle cx={px(p.cost)} cy={py(p.acc)} r={p.kind === 'enso' ? 7 : 5.5} initial={{ opacity: 0, y: -18 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE, delay: 0.1 + order.indexOf(i) * 0.04 }} />
            </g>
          ))}
        </svg>
        {f.y.map((v) => <span key={v} className="xbg-tk y x-mono" style={{ top: (py(v) / VH) * 100 + '%' }}>{v}</span>)}
        {f.x.map((v) => <span key={v} className="xbg-tk x x-mono" style={{ left: (px(+v.slice(1)) / VW) * 100 + '%' }}>{v}</span>)}
        <span className="xbg-ax y x-mono">{f.yLabel}</span>
        <span className="xbg-ax x x-mono">{f.xLabel}</span>
        <span className="xbg-pin" aria-hidden="true" style={{ left: (px(d.cost) / VW) * 100 + '%', top: (py(d.acc) / VH) * 100 + '%' }}>{d.short}</span>
      </div>
      <div className="xbg-read" aria-live="polite">
        <b>{d.short}</b>
        <span>{d.kind === 'reported' ? d.said.replace(' ' + d.href, '') : d.said}</span>
      </div>
      <ul className="xbg-chips" data-swipe-own aria-label="Every dot">
        {order.map((i) => {
          const p = f.dots[i];
          return (
            <li key={i}>
              <button type="button" aria-pressed={i === at} onClick={() => pick(i)} className={p.kind}>{p.short}</button>
              {p.href && <A to={p.href} className="xbg-a xbg-chip-src">Source</A>}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
