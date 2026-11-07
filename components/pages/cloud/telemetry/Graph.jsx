'use client';
/* /telemetry signature: the living graph (MOTION-MAP `graph`). The collector's pipeline from the page's own words
   (traces, metrics, logs → gRPC / HTTP → OTLP in → collector → memory_limiter → batch → OTLP out) as nodes and links
   that settle like a physics graph when the room arrives, drift a little, and lean away from the pointer. Hover, focus
   or tap a node and its paths light up and are named in the caption; packets run the lit links. At rest (no pointer)
   the graph walks the three signals in turn. Reduced motion and JS off: the settled graph, nothing moving.
   Page-local: only /telemetry imports this. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCalm } from '../../../ui';
import { PauseBtn } from '../../../v2/x-hamilton/Demo';

const N = [
  ['traces', 'traces', 's'], ['metrics', 'metrics', 's'], ['logs', 'logs', 's'],
  ['grpc', 'gRPC', 'p'], ['http', 'HTTP', 'p'],
  ['in', 'OTLP in', 'n'], ['col', 'collector', 'c'], ['mem', 'memory_limiter', 'n'], ['batch', 'batch', 'n'], ['out', 'OTLP out', 'n'],
];
const E = [['traces', 'in'], ['metrics', 'in'], ['logs', 'in'], ['grpc', 'in'], ['http', 'in'], ['in', 'col'], ['col', 'mem'], ['mem', 'batch'], ['batch', 'out']];
// settled places: wide (1000 × 460) and phone (400 × 640)
const AT = {
  wide: { traces: [80, 110], metrics: [80, 230], logs: [80, 350], grpc: [270, 90], http: [270, 370], in: [300, 230], col: [500, 230], mem: [680, 140], batch: [740, 320], out: [920, 230] },
  phone: { traces: [70, 60], metrics: [200, 60], logs: [330, 60], grpc: [80, 190], http: [320, 190], in: [200, 200], col: [200, 330], mem: [110, 450], batch: [290, 450], out: [200, 575] },
};
const BOX = { wide: [1000, 460], phone: [400, 640] };
const STAGES = [['traces', 'metrics', 'logs'], ['grpc', 'http'], ['in'], ['col'], ['mem'], ['batch'], ['out']];
const NAME = Object.fromEntries(N.map(([id, n]) => [id, n]));
const AUTO = ['traces', 'metrics', 'logs'];

function lit(sel) {
  if (!sel) return null;
  const on = new Set([sel]);
  const walk = (from, dir) => { E.forEach(([a, b]) => { const [x, y] = dir ? [a, b] : [b, a]; if (x === from && !on.has(y)) { on.add(y); walk(y, dir); } }); };
  walk(sel, true); walk(sel, false);
  return on;
}

export default function Graph({ held, onHold }) {
  const calm = useCalm();
  const [lay, setLay] = useState('wide');
  const [pick, setPick] = useState(null); // the visitor's node (hover, focus or tap)
  const [auto, setAuto] = useState(0);
  const [seen, setSeen] = useState(false);
  const box = useRef(null), svg = useRef(null), nodes = useRef({}), edges = useRef([]), dots = useRef([]);
  const sel = pick || (calm ? null : AUTO[auto]);
  const on = useMemo(() => lit(sel), [sel]);
  const live = seen && !held && !calm;

  useEffect(() => { // the phone draws the pipeline downwards
    const m = matchMedia('(max-width: 700px)');
    const set = () => setLay(m.matches ? 'phone' : 'wide');
    set(); m.addEventListener('change', set);
    return () => m.removeEventListener('change', set);
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => { // at rest the graph walks the three signals; a visitor's node stops it
    if (!live || pick) return;
    const t = setTimeout(() => setAuto((a) => (a + 1) % AUTO.length), 2600);
    return () => clearTimeout(t);
  }, [live, pick, auto]);

  // physics: springs to the settled places, a little drift, nodes push apart and lean away from the pointer
  const sim = useRef(null);
  const ptr = useRef(null);
  useEffect(() => {
    const at = AT[lay];
    const s = sim.current = sim.current && sim.current.lay === lay ? sim.current : {
      lay, started: false,
      p: Object.fromEntries(N.map(([id]) => [id, [...at[id]]])),
      v: Object.fromEntries(N.map(([id]) => [id, [0, 0]])),
    };
    const draw = () => {
      N.forEach(([id]) => { const g = nodes.current[id]; if (g) g.setAttribute('transform', `translate(${s.p[id][0].toFixed(1)} ${s.p[id][1].toFixed(1)})`); });
      E.forEach(([a, b], i) => { const l = edges.current[i]; if (l) { l.setAttribute('x1', s.p[a][0]); l.setAttribute('y1', s.p[a][1]); l.setAttribute('x2', s.p[b][0]); l.setAttribute('y2', s.p[b][1]); } });
    };
    if (calm) { N.forEach(([id]) => { s.p[id] = [...at[id]]; }); draw(); return; }
    if (!seen) return;
    if (!s.started) { // arrival: scattered, then the springs pull every node home
      s.started = true;
      N.forEach(([id], i) => { const a = i * 2.3; s.p[id] = [at[id][0] + Math.cos(a) * 160, at[id][1] + Math.sin(a) * 120]; s.v[id] = [0, 0]; });
    }
    let raf = 0, t0 = performance.now();
    const step = (now) => {
      const t = (now - t0) / 1000;
      if (!held) {
        N.forEach(([id], i) => {
          const [tx, ty] = at[id];
          const dx = tx + Math.sin(t * 0.7 + i) * 4 - s.p[id][0], dy = ty + Math.cos(t * 0.6 + i * 1.7) * 4 - s.p[id][1];
          let fx = dx * 0.045, fy = dy * 0.045;
          N.forEach(([o]) => { if (o === id) return; const ox = s.p[id][0] - s.p[o][0], oy = s.p[id][1] - s.p[o][1], d = Math.hypot(ox, oy) || 1; if (d < 70) { fx += (ox / d) * (70 - d) * 0.02; fy += (oy / d) * (70 - d) * 0.02; } });
          if (ptr.current) { const px = s.p[id][0] - ptr.current[0], py = s.p[id][1] - ptr.current[1], d = Math.hypot(px, py) || 1; if (d < 90) { fx += (px / d) * (90 - d) * 0.05; fy += (py / d) * (90 - d) * 0.05; } }
          s.v[id] = [(s.v[id][0] + fx) * 0.82, (s.v[id][1] + fy) * 0.82];
          s.p[id] = [s.p[id][0] + s.v[id][0], s.p[id][1] + s.v[id][1]];
        });
        draw();
        // packets run the lit links, a third of the way apart
        dots.current.forEach((c, i) => {
          if (!c) return;
          const [a, b] = E[i % E.length];
          const k = ((t * 0.9 + i * 0.33) % 1);
          c.setAttribute('cx', s.p[a][0] + (s.p[b][0] - s.p[a][0]) * k);
          c.setAttribute('cy', s.p[a][1] + (s.p[b][1] - s.p[a][1]) * k);
        });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lay, seen, held, calm]);

  const move = (e) => {
    if (e.pointerType !== 'mouse' || !svg.current) return;
    const m = svg.current.getScreenCTM();
    if (!m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    ptr.current = [pt.x, pt.y];
  };
  const [W, H] = BOX[lay];
  const at = AT[lay];
  const fs = lay === 'phone' ? 17 : 15;
  const caption = sel ? STAGES.map((st) => st.filter((id) => on.has(id))).filter((st) => st.length).map((st) => st.map((id) => (id === sel ? <b key={id}>{NAME[id]}</b> : <span key={id}>{NAME[id]}</span>)).reduce((acc, x, i) => (i ? [...acc, ' · ', x] : [x]), [])) : null;

  return (
    <div className="tl2-graph" ref={box} data-live={live ? '' : undefined}>
      <div className="tl2-graph-bar">
        <p className="tl2-graph-cap l2-mono" aria-live="polite">
          {caption ? caption.reduce((acc, x, i) => (i ? [...acc, <i key={'a' + i} aria-hidden="true"> → </i>, ...x] : [...x]), []) : <span>OTLP in · collector · OTLP out</span>}
        </p>
        <PauseBtn paused={held} onClick={onHold} className="tl2-graph-pause" />
      </div>
      <svg ref={svg} className="tl2-graph-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="The collector's pipeline"
        onPointerMove={move} onPointerLeave={(e) => { ptr.current = null; if (e.pointerType === 'mouse') setPick(null); }}>
        {E.map(([a, b], i) => (
          <line key={a + b} ref={(el) => { edges.current[i] = el; }} className={'tl2-gl' + (on && on.has(a) && on.has(b) ? ' on' : '')}
            x1={at[a][0]} y1={at[a][1]} x2={at[b][0]} y2={at[b][1]} />
        ))}
        {E.map(([a, b], i) => (
          <circle key={'d' + a + b} ref={(el) => { dots.current[i] = el; }} className={'tl2-gd' + (on && on.has(a) && on.has(b) && live ? ' on' : '')} r="4" cx={at[a][0]} cy={at[a][1]} />
        ))}
        {N.map(([id, name, kind]) => (
          <g key={id} ref={(el) => { nodes.current[id] = el; }} transform={`translate(${at[id][0]} ${at[id][1]})`}
            className={'tl2-gn ' + kind + (on && on.has(id) ? ' on' : '') + (sel === id ? ' sel' : '')}
            tabIndex={0} role="button" aria-label={name} aria-pressed={pick === id}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPick(id); }}
            onFocus={() => setPick(id)} onBlur={() => setPick(null)}
            onClick={(e) => { if (e.pointerType !== 'mouse') setPick(id); }}
            onKeyDown={(e) => { if (e.key === 'Escape') setPick(null); }}>
            <circle className="hit" r="30" />
            <circle className="dot" r={kind === 'c' ? 16 : 9} />
            <text y={kind === 'c' ? 38 : 30} textAnchor="middle" fontSize={fs}>{name}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
