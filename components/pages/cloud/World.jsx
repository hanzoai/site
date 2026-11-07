'use client';
/* World (v2, Cloud 4 chat). Archetype B, System: a planet rising under the title in the dark (Stage, rise) → a control
   room of six monitors, the last one a replay you scrub → close. Accent: arc cyan.
   V2: 8/10 a turning globe rising like a horizon under the title and settling with live arcs and latencies, the six capabilities as a control room, a session replay you scrub
   Signature: every model, everywhere, live. A dotted globe the width of the screen rises like a horizon under the title
   and settles as you scroll; requests arc from the edge to the GPUs that served them while P50, P95 and P99 tick by model
   beside it, and a drift alert fires when production leaves its baseline.
   Beyond: "Replay a session". Scrub an agent session step by step (prompt, tool call, model output, IO) the way Forensic
   Replay reconstructs one; each step says what you can inspect there.
   Motion: the canvas globe (signature) + latency bars ticking + the replay scrub + magnetic primary. Every word and link
   is Hanzo's; arcs, bars and the session are drawn examples, not measurements. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../../ui';
import { useLive, useFrame, useEvery } from './Frame';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './World.css';

// points on a sphere (golden spiral), drawn as a turning globe of dots
const PTS = Array.from({ length: 900 }, (_, i) => {
  const y = 1 - (i / 899) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
});
const HUBS = [21, 130, 247, 360, 471, 590, 702, 815];

function Globe() {
  const [ref, live, calm] = useLive(0.1);
  const cv = useRef(null);
  const arcs = useRef([]);
  const draw = (t) => {
    const c = cv.current;
    if (!c) return;
    const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.47, cx = w / 2, cy = h / 2, a = t * 0.12, ca = Math.cos(a), sa = Math.sin(a), tl = 0.32;
    const proj = ([x, y, z]) => { const X = x * ca - z * sa, Z = x * sa + z * ca; const Y = y * Math.cos(tl) - Z * Math.sin(tl), Z2 = y * Math.sin(tl) + Z * Math.cos(tl); return [cx + X * R, cy - Y * R, Z2]; };
    const glow = g.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.08);
    glow.addColorStop(0, 'rgba(64,200,255,0)'); glow.addColorStop(0.9, 'rgba(64,200,255,.2)'); glow.addColorStop(1, 'rgba(64,200,255,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, R * 1.08, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(64,200,255,.35)'; g.lineWidth = 1.2; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
    for (const p of PTS) {
      const [x, y, z] = proj(p);
      if (z < -0.02) continue;
      g.fillStyle = `rgba(235,245,255,${0.24 + z * 0.66})`;
      g.beginPath(); g.arc(x, y, 1.1 + z * 1.3, 0, 6.283); g.fill();
    }
    if (!arcs.current.length || Math.random() < 0.06) arcs.current.push({ a: PTS[Math.floor(Math.random() * 900)], b: PTS[HUBS[Math.floor(Math.random() * HUBS.length)]], t0: t });
    arcs.current = arcs.current.filter((r) => t - r.t0 < 2.4).slice(-18);
    for (const r of arcs.current) {
      const [x1, y1, z1] = proj(r.a), [x2, y2, z2] = proj(r.b);
      if (z1 < 0 || z2 < 0) continue;
      const k = Math.min(1, (t - r.t0) / 0.9), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.4;
      g.strokeStyle = `rgba(64,200,255,${Math.max(0, 0.9 - Math.max(0, t - r.t0 - 1.3))})`;
      g.lineWidth = 1.6;
      g.beginPath();
      for (let s = 0; s <= 28 * k; s++) { const u = s / 28, X = (1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, Y = (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2; s ? g.lineTo(X, Y) : g.moveTo(X, Y); }
      g.stroke();
      if (k >= 1) { g.fillStyle = '#40c8ff'; g.beginPath(); g.arc(x2, y2, 3, 0, 6.283); g.fill(); }
    }
    for (const hb of HUBS) { const [x, y, z] = proj(PTS[hb]); if (z > 0) { g.strokeStyle = 'rgba(64,200,255,.85)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, 6, 0, 6.283); g.stroke(); } }
  };
  useFrame(live, (t) => draw(t));
  useEffect(() => { const id = requestIdle(() => draw(2)); return () => cancelIdle(id); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="wd2-globe" ref={ref}><canvas ref={cv} aria-hidden="true" /></div>;
}
const requestIdle = (f) => setTimeout(f, 60);
const cancelIdle = (id) => clearTimeout(id);

const MODELS = ['zen', 'kai', 'enso'];
const rnd = (i) => { const x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); };

/* Latency by model, ticking; a drift alert when production leaves its baseline. */
function Panel() {
  const [ref, live] = useLive(0.2);
  const [n, setN] = useState(0);
  useEvery(1200, live, () => setN((v) => v + 1));
  const drift = n % 9 >= 6;
  return (
    <div className="wd2-panel" ref={ref} aria-hidden="true">
      <p className="wd2-k l2-mono">latency by model</p>
      {MODELS.map((m, k) => (
        <div key={m} className="wd2-lat">
          <b className="l2-mono">{m}</b>
          {['P50', 'P95', 'P99'].map((q, j) => <span key={q}><em className="l2-mono">{q}</em><i><u style={{ transform: `scaleX(${0.2 + j * 0.24 + rnd(n * 3 + k * 7 + j) * 0.16})` }} /></i></span>)}
        </div>
      ))}
      <p className={'wd2-drift l2-mono' + (drift ? ' on' : '')}>drift · production diverges from baseline</p>
    </div>
  );
}

function Hero() {
  return (
    <div className="wd2-world">
      <Globe />
      <Panel />
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

const NODES = [['edge', 8, 50], ['gateway', 30, 50], ['agent', 52, 26], ['tool call', 52, 74], ['zen', 74, 36], ['kai', 74, 64], ['GPU', 93, 50]];
const PATH = [[0, 1], [1, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 6]];

function Topology() {
  const [hot, setHot] = useState(4);
  const lit = (a, b) => (hot === 4 ? [[0, 1], [1, 2], [2, 4], [4, 6]] : [[0, 1], [1, 3], [3, 5], [5, 6]]).some(([x, y]) => x === a && y === b);
  return (
    <div className="wd2-topo">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{PATH.map(([a, b]) => <line key={a + '-' + b} className={lit(a, b) ? 'on' : ''} x1={NODES[a][1]} y1={NODES[a][2]} x2={NODES[b][1]} y2={NODES[b][2]} />)}</svg>
      {NODES.map(([t, x, y], i) => (
        <button key={t} type="button" className={'wd2-node l2-mono' + (i === 4 || i === 5 ? ' m' : '') + (i === hot ? ' on' : '')} style={{ left: x + '%', top: y + '%' }} onClick={() => (i === 4 || i === 5) && setHot(i)} onMouseEnter={() => (i === 4 || i === 5) && setHot(i)} tabIndex={i === 4 || i === 5 ? 0 : -1} aria-label={i === 4 || i === 5 ? `Trace a request to ${t}` : t}>{t}</button>
      ))}
    </div>
  );
}

const STEPS = [['prompt', 'the prompt the agent was given'], ['tool call', 'which tool it called, with what'], ['IO', 'what the tool read and wrote'], ['model output', 'what the model answered'], ['tool call', 'the next tool it reached for'], ['model output', 'the final answer']];

/* Beyond: scrub a session the way Forensic Replay reconstructs one. */
function Replay() {
  const [at, setAt] = useState(2);
  return (
    <div className="wd2-replay">
      <div className="wd2-rp-track" aria-hidden="true">
        {STEPS.map(([k], i) => <span key={i} className={'l2-mono' + (i <= at ? ' done' : '') + (i === at ? ' now' : '')}>{k}</span>)}
      </div>
      <label className="wd2-rp-scrub"><span className="x-sr">Replay step</span><input type="range" min="0" max={STEPS.length - 1} value={at} onChange={(e) => setAt(+e.target.value)} aria-valuetext={`step ${at + 1} of ${STEPS.length}: ${STEPS[at][0]}`} /></label>
      <div className="wd2-rp-now" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
            <b className="l2-mono">step {at + 1} / {STEPS.length} · {STEPS[at][0]}</b><span>Inspect {STEPS[at][1]}.</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Pic({ i }) {
  if (i === 0) return <Topology />;
  if (i === 1) return <div className="wd2-lc">{MODELS.map((m, k) => <p key={m}><b className="l2-mono">{m}</b>{[0.34, 0.58, 0.82].map((w, j) => <i key={j} style={{ width: (w - k * 0.05) * 100 + '%' }} className={'q' + j} />)}</p>)}<p className="spike l2-mono"><i />auto-anomaly · cost spike</p></div>;
  if (i === 2) return <svg className="wd2-drift-c" viewBox="0 0 200 90" aria-hidden="true"><rect x="0" y="34" width="200" height="22" className="band" /><path d="M0 46 C 20 42, 40 50, 60 45 S 100 48, 120 44 S 150 42, 160 38 S 185 20, 200 12" className="ln" /><circle cx="186" cy="19" r="4" className="al" /></svg>;
  if (i === 3) return <div className="wd2-ev">{['v1', 'v2'].map((v, k) => <p key={v} className={k ? 'b' : ''}><span className="l2-mono">{v}</span><i style={{ width: k ? '82%' : '68%' }} /><em className="l2-mono">{k ? 'pinned' : ''}</em></p>)}</div>;
  if (i === 4) return <ul className="wd2-mc">{['Hanzo Cloud', 'AWS', 'GCP', 'Azure', 'self-hosted'].map((s) => <li key={s}>{s}</li>)}<li className="one">One unified view</li></ul>;
  return <Replay />;
}

function Room() {
  return (
    <section className="l2-sec wd2-room">
      <div className="l2-wrap">
        <h2 className="l2-display m wd2-room-h">See Every Model, Everywhere</h2>
        <div className="wd2-grid">
          {CAPS.map(([t, d], i) => (
            <article key={t} className={'wd2-mon c' + i}>
              <header><span className="l2-mono">{String(i + 1).padStart(2, '0')} / 06</span><i className="wd2-led" aria-hidden="true" /></header>
              <div className="wd2-pic"><Pic i={i} /></div>
              <h3 className="l2-title">{t}</h3>
              <p className="l2-body">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function World() {
  return (
    <main className="l2-page wd2" style={{ '--ac': '#40c8ff' }}>
      <StageHero look="rise" travel={{ s: [1.3, 1], y: ['2svh', '-16svh'] }} dark kick="world.hanzo.ai" title="Hanzo World" sub="World Monitor — global AI-system observability" acts={[['Open World Monitor', 'https://world.hanzo.ai'], ['Documentation', 'https://docs.hanzo.ai/docs/cli/world']]}>
        <Hero />
      </StageHero>
      <Room />
      <Finale name="World" head="Run AI With Confidence" lede="Free for the first million events / month." ask={['Open World Monitor', 'https://world.hanzo.ai']} links={[['Documentation', 'https://docs.hanzo.ai/docs/cli/world']]} prompt="Read https://hanzo.ai/skill.md and use Hanzo World in my project. Start with: hanzo world news" tag="3D world building" />
    </main>
  );
}
