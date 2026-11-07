'use client';
/* World. Signature: every model, everywhere, live. A dotted globe turns in the dark; requests arc from the edge to the
   GPUs that served them; beside it P50, P95 and P99 tick by model, and a drift alert fires when production leaves its
   baseline. The six capabilities are a mission-control grid of panels. Every word and link is Hanzo's; arcs and
   latencies are drawn, not measured. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, useLive, useFrame, useEvery } from './Frame';
import './World.css';

// points on a sphere (golden spiral), drawn as a turning globe of dots on a canvas
const PTS = Array.from({ length: 520 }, (_, i) => {
  const y = 1 - (i / 519) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
});
const HUBS = [12, 77, 140, 203, 266, 331, 398, 455];

function Globe() {
  const [ref, live, calm] = useLive(0.2);
  const cv = useRef(null);
  const arcs = useRef([]);
  const draw = (t) => {
    const c = cv.current;
    if (!c) return;
    const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2, a = t * 0.18, ca = Math.cos(a), sa = Math.sin(a), tilt = 0.35;
    const proj = ([x, y, z]) => { const X = x * ca - z * sa, Z = x * sa + z * ca; const Y = y * Math.cos(tilt) - Z * Math.sin(tilt), Z2 = y * Math.sin(tilt) + Z * Math.cos(tilt); return [cx + X * R, cy - Y * R, Z2]; };
    for (const p of PTS) {
      const [x, y, z] = proj(p);
      if (z < -0.05) continue;
      g.fillStyle = `rgba(245,245,247,${0.12 + z * 0.55})`;
      g.beginPath(); g.arc(x, y, 1.1 + z * 0.8, 0, 6.283); g.fill();
    }
    // arcs from an edge point to a GPU hub, each living for a second or two
    if (!arcs.current.length || Math.random() < 0.04) arcs.current.push({ a: PTS[Math.floor(Math.random() * 520)], b: PTS[HUBS[Math.floor(Math.random() * HUBS.length)]], t0: t });
    arcs.current = arcs.current.filter((r) => t - r.t0 < 2.2).slice(-14);
    for (const r of arcs.current) {
      const [x1, y1, z1] = proj(r.a), [x2, y2, z2] = proj(r.b);
      if (z1 < 0 || z2 < 0) continue;
      const k = Math.min(1, (t - r.t0) / 0.9), mx = (x1 + x2) / 2 + (cy - (y1 + y2) / 2) * 0.25, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.35;
      g.strokeStyle = `rgba(48,209,88,${0.85 - Math.max(0, t - r.t0 - 1.2)})`;
      g.lineWidth = 1.4;
      g.beginPath();
      for (let s = 0; s <= 24 * k; s++) { const u = s / 24, X = (1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, Y = (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2; s ? g.lineTo(X, Y) : g.moveTo(X, Y); }
      g.stroke();
      g.fillStyle = '#30d158'; g.beginPath(); g.arc(x2, y2, 2.6, 0, 6.283); g.fill();
    }
    for (const hb of HUBS) { const [x, y, z] = proj(PTS[hb]); if (z > 0) { g.strokeStyle = 'rgba(100,210,255,.8)'; g.lineWidth = 1; g.beginPath(); g.arc(x, y, 5, 0, 6.283); g.stroke(); } }
  };
  useFrame(live, (t) => draw(t));
  useEffect(() => { if (calm) draw(2); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="wd-globe" ref={ref}><canvas ref={cv} aria-hidden="true" /></div>;
}

const MODELS = ['zen', 'kai', 'enso'];
const rnd = (i) => { const x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); };

function Panel() {
  const [ref, live] = useLive(0.3);
  const [n, setN] = useState(0);
  useEvery(1200, live, () => setN((v) => v + 1));
  const drift = n % 9 >= 6;
  return (
    <div className="wd-panel" ref={ref} aria-hidden="true">
      <p className="wd-k">latency by model</p>
      {MODELS.map((m, k) => (
        <div key={m} className="wd-lat">
          <b>{m}</b>
          {['P50', 'P95', 'P99'].map((q, j) => <span key={q}><em>{q}</em><i><motion.u animate={{ scaleX: 0.18 + j * 0.24 + rnd(n * 3 + k * 7 + j) * 0.14 }} transition={{ duration: 0.6, ease: EASE }} /></i></span>)}
        </div>
      ))}
      <AnimatePresence>{drift && <motion.p className="wd-drift" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>drift · production diverges from baseline</motion.p>}</AnimatePresence>
    </div>
  );
}

const CAPS = [
  ['Live Topology', 'A real-time map of every model, agent, and tool call. Trace any request from edge to GPU.'],
  ['Latency + Cost', 'P50/P95/P99 by model and route. Per-org and per-user spend. Auto-anomaly on cost spikes.'],
  ['Drift Detection', 'Embedding drift, output drift, prompt drift. Alert when production diverges from baseline.'],
  ['Eval Dashboards', 'Continuous evals on live traffic. Pin scores. Compare model versions in production.'],
  ['Multi-Cloud', 'Pulls signals from Hanzo Cloud, AWS, GCP, Azure, and self-hosted clusters. One unified view.'],
  ['Forensic Replay', 'Reconstruct any agent session step by step. Inspect tool calls, prompts, model outputs, and IO.'],
];

export default function World() {
  return (
    <main className="wd">
      <section className="wd-hero" data-room="dark">
        <div className="x-wrap wd-hero-grid">
          <div className="wd-copy">
            <motion.p className="cf-kick wd-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>world.hanzo.ai</motion.p>
            <h1 className="cf-h1 wd-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo World</motion.span></span></h1>
            <motion.p className="cf-sub wd-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>World Monitor — global AI-system observability</motion.p>
            <motion.div className="cf-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
              <A to="https://world.hanzo.ai" className="x-btn solid">Open World Monitor</A>
              <A to="https://docs.hanzo.ai/docs/cli/world" className="x-btn">Documentation</A>
            </motion.div>
            <Panel />
          </div>
          <Globe />
        </div>
      </section>
      <section className="x-sec wd-caps">
        <div className="x-wrap">
          <div className="wd-caps-h"><Rise as="h2">See Every Model, Everywhere</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <div className="wd-grid">{CAPS.map(([t, d], i) => <Rise key={t} className={'wd-cap c' + i} delay={(i % 3) * 0.06}><span className="wd-led" /><span className="wd-n">{String(i + 1).padStart(2, '0')} / 06</span><h3>{t}</h3><p>{d}</p></Rise>)}</div>
        </div>
      </section>
      <section className="x-sec wd-run">
        <div className="x-wrap wd-run-grid">
          <div><Rise as="h2">Run AI With Confidence</Rise><Rise as="p" delay={0.06}>Free for the first million events / month.</Rise></div>
          <Paste name="World" prompt="Read https://hanzo.ai/skill.md and use Hanzo World in my project. Start with: hanzo world news" className="wd-paste" />
        </div>
      </section>
      <Get name="World" tag="3D world building" />
    </main>
  );
}
