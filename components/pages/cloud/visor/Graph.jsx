'use client';
/* Visor's signature: the living fleet graph (MOTION-MAP `graph`). One API at the centre, the providers on the inner
   ring, the machines, the node pool and the cluster on the outer ring, every link drawn. As the section arrives the
   nodes orbit in on curves and settle like a damped spring (the `orbit-in` entrance, no overshoot); then they drift
   gently. Hover, focus or tap a node and its path back to the API lights and is named under the graph; at rest the
   graph names one path after another by itself. Radial, so it never reads like Telemetry's left-to-right pipeline.
   Reduced motion: the settled graph, still. JS off: the settled graph from the server HTML. Every word is the page's. */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useCalm from '../../../v2/useCalm';
import { useDemo, PauseBtn } from '../../../v2/x-hamilton/Demo';
import './Graph.css';

// ring: 0 centre, 1 providers, 2 what a launch creates. a: angle in degrees (0 = right, clockwise). p: the parent.
const NODES = [
  { id: 'api', label: 'one API', ring: 0, a: 0, kind: 'one API' },
  { id: 'aws', label: 'AWS', ring: 1, a: -35, p: 'api', kind: 'regions · sizes · GPUs' },
  { id: 'gcp', label: 'GCP', ring: 1, a: 95, p: 'api', kind: 'regions · sizes · GPUs' },
  { id: 'do', label: 'DigitalOcean', ring: 1, a: 215, p: 'api', kind: 'regions · sizes · GPUs' },
  { id: 't1', label: 'train-01', ring: 2, a: -78, p: 'aws', kind: 'machine' },
  { id: 't2', label: 'train-02', ring: 2, a: -40, p: 'aws', kind: 'machine' },
  { id: 't3', label: 'train-03', ring: 2, a: -2, p: 'aws', kind: 'machine' },
  { id: 'pool', label: 'gpu-pool', ring: 2, a: 72, p: 'gcp', kind: 'node pool' },
  { id: 'k8s', label: 'cluster', ring: 2, a: 196, p: 'do', kind: 'managed Kubernetes' },
];
const BY = Object.fromEntries(NODES.map((n) => [n.id, n]));
const OUTER = NODES.filter((n) => n.ring === 2).map((n) => n.id);
const R = [[0, 0], [21, 25], [40, 40]]; // ring radii in % of the stage, [x, y]
const rad = (d) => (d * Math.PI) / 180;
// phones: the same graph, set out by hand for a narrow, tall stage so no two labels touch and none leaves the stage
const PHONE = { api: [50, 47], aws: [64, 28], gcp: [74, 69], do: [28, 67], t1: [21, 9], t2: [51, 9], t3: [81, 9], pool: [73, 89], k8s: [28, 89] };
const base = (n, narrow) => (narrow ? PHONE[n.id] : [50 + R[n.ring][0] * Math.cos(rad(n.a)), 50 + R[n.ring][1] * Math.sin(rad(n.a))]);
const path = (id) => { const out = []; for (let n = BY[id]; n; n = n.p ? BY[n.p] : null) out.unshift(n); return out; };
const EDGES = NODES.filter((n) => n.p).map((n) => [n.p, n.id]);

export default function Graph() {
  const [ref, live, calm, paused, toggle] = useDemo(0.2);
  const stage = useRef(null);
  const nodes = useRef({});
  const lines = useRef({});
  const seen = useInView(stage, { once: true, amount: 0.35 });
  const still = useCalm();
  const [hot, setHot] = useState('t1');
  const [mine, setMine] = useState(false); // the visitor is pointing at, focused on or has tapped a node
  const start = useRef(0);
  const springs = useRef(NODES.map(() => ({ u: 0, v: 0 })));
  const [narrow, setNarrow] = useState(false); // set after mount: the server renders the wide layout
  useEffect(() => {
    const m = matchMedia('(max-width: 700px)');
    const on = () => setNarrow(m.matches);
    on(); m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  // the physics: each node's progress u springs 0 → 1 (critically damped, so it settles without overshoot); its angle
  // and radius come in from far out and 140° back along its ring, so it travels on a curve: the orbit-in arrival
  useEffect(() => {
    if (still) return;
    const st = springs.current; // kept across pauses and scrolling away, so the arrival plays once
    let raf = 0, last = 0, size = [0, 0];
    const el = stage.current;
    const ro = new ResizeObserver(([e]) => { size = [e.contentRect.width, e.contentRect.height]; });
    ro.observe(el);
    const k = 26, c = 2 * Math.sqrt(k);
    const place = (t, dt) => {
      NODES.forEach((n, i) => {
        const s = st[i];
        const wait = n.ring === 0 ? 0 : n.ring === 1 ? 120 + i * 110 : 420 + i * 90;
        if (start.current && t - start.current > wait) { const a = k * (1 - s.u) - c * s.v; s.v += a * dt; s.u += s.v * dt; }
        const off = 1 - s.u;
        const drift = start.current ? s.u : 0;
        // the node's resting offset from the stage centre, in px, turned back 140° and pushed out while it arrives:
        // it comes in on a curve; once settled it drifts a couple of degrees and a few px
        const [bx, by] = base(n, narrow);
        const W = size[0] || 1, H = size[1] || 1;
        const ox = ((bx - 50) * W) / 100, oy = ((by - 50) * H) / 100;
        const ang = rad(-140 * off + 2.2 * Math.sin(t / 1600 + i) * drift);
        const f = 1 + 0.9 * off + 0.025 * Math.sin(t / 2100 + i * 1.7) * drift;
        const cx = n.ring ? 0 : 4 * Math.sin(t / 1900) * drift, cy = n.ring ? 0 : 4 * Math.cos(t / 2300) * drift;
        const x = 50 + ((f * (ox * Math.cos(ang) - oy * Math.sin(ang)) + cx) * 100) / W;
        const y = 50 + ((f * (ox * Math.sin(ang) + oy * Math.cos(ang)) + cy) * 100) / H;
        n.x = x; n.y = y;
        const b = nodes.current[n.id];
        if (b) {
          b.style.transform = `translate(calc(-50% + ${(((x - bx) * size[0]) / 100).toFixed(1)}px), calc(-50% + ${(((y - by) * size[1]) / 100).toFixed(1)}px))`;
          b.style.opacity = String(Math.min(1, Math.max(0, s.u * 1.6)));
        }
      });
      EDGES.forEach(([a, b]) => {
        const l = lines.current[b];
        if (!l) return;
        l.setAttribute('x1', BY[a].x.toFixed(2)); l.setAttribute('y1', BY[a].y.toFixed(2));
        l.setAttribute('x2', BY[b].x.toFixed(2)); l.setAttribute('y2', BY[b].y.toFixed(2));
        l.style.opacity = String(Math.min(st[NODES.indexOf(BY[a])].u, st[NODES.indexOf(BY[b])].u));
      });
    };
    const loop = (t) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
      last = t;
      place(t, dt);
      raf = requestAnimationFrame(loop);
    };
    place(0, 0); // the nodes wait out on their orbits until the graph arrives
    if (live) raf = requestAnimationFrame(loop); // off screen or paused: the graph holds where it is
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [still, live, narrow]);
  useEffect(() => { if (seen && !start.current) start.current = performance.now(); }, [seen]);

  // at rest the graph names one path after another; the visitor's own pointer, focus or tap takes over
  useEffect(() => {
    if (!live || mine || paused || !seen) return;
    const id = setTimeout(() => setHot((h) => OUTER[(OUTER.indexOf(h) + 1) % OUTER.length] || OUTER[0]), 2600);
    return () => clearTimeout(id);
  }, [hot, live, mine, paused, seen]);

  const lit = new Set(path(hot).map((n) => n.id));
  const pick = (id) => { setMine(true); setHot(id); };
  return (
    <section className="l2-sec vs2g" ref={ref} aria-label="Hanzo Visor">
      <div className="l2-wrap">
        <div className="vs2g-stage" ref={stage} data-paused={paused ? '' : undefined} onPointerLeave={() => setMine(false)}>
          <PauseBtn paused={paused} onClick={toggle} className="vs2g-pause" />
          <svg className="vs2g-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {EDGES.map(([a, b]) => {
              const [x1, y1] = base(BY[a], narrow); const [x2, y2] = base(BY[b], narrow);
              return <line key={b} ref={(el) => { lines.current[b] = el; }} x1={x1} y1={y1} x2={x2} y2={y2} vectorEffect="non-scaling-stroke" className={lit.has(a) && lit.has(b) ? 'on' : ''} />;
            })}
          </svg>
          {NODES.map((n) => {
            const [x, y] = base(n, narrow);
            return (
              <button
                key={n.id} type="button" ref={(el) => { nodes.current[n.id] = el; }}
                className="vs2g-node" data-ring={n.ring} data-lit={lit.has(n.id) ? '' : undefined} data-hot={hot === n.id ? '' : undefined}
                style={{ left: x + '%', top: y + '%' }} aria-describedby="vs2g-say"
                onPointerEnter={(e) => e.pointerType === 'mouse' && pick(n.id)} onFocus={() => pick(n.id)} onBlur={() => setMine(false)}
                onClick={() => pick(n.id)}
              >
                <span className={n.ring === 2 ? 'l2-mono' : undefined}>{n.label}</span>
              </button>
            );
          })}
        </div>
        <div className="vs2g-say" id="vs2g-say" aria-live={mine ? 'polite' : 'off'}>
          <p className="vs2g-path l2-mono">
            {path(hot).map((n, i) => <span key={n.id}>{i > 0 && <i aria-hidden="true">→</i>}{n.label}</span>)}
          </p>
          <p className="vs2g-kind">{BY[hot].kind}</p>
        </div>
      </div>
    </section>
  );
}
