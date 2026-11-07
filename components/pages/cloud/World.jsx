'use client';
/* World (v2, Cloud 4 chat). Archetype B, System: a turning planet beside the title in the dark (Stage, side) → a control
   room of six monitors, the last one a replay you scrub → Get World → one closing band.
   Persona: a team running models in production who wants one view of them. Goal: open World Monitor.
   CTA: "Open World Monitor" (hero, ask bar, close; data-cta primary / close). Metric: cta_click:world.primary.
   V2: 8/10 a turning globe that eases out as you leave, then a pinned control room where one big monitor is on air at a time (its drawing plays as it arrives) beside a numbered rail of six, a replay you scrub; phone stacks with a cut-in per monitor
   Signature: every model, everywhere, live. A dotted globe turns beside the title; requests arc from the edge to the GPUs
   that served them while P50, P95 and P99 tick by model, and a drift alert fires when production leaves its baseline.
   Beyond: scrub an agent session step by step (prompt, tool call, IO, model output), the way Forensic Replay
   reconstructs one.
   Motion: the canvas globe (signature, idle, pausable; on desktop it shrinks, rises and slows as the hero leaves) +
   latency bars ticking (time) + the control room pinned on desktop, scroll choosing which monitor is on air, each
   monitor's drawing playing once as it arrives and its h3 cutting in by line mask (scroll, state; on phones the same
   moment plays as each monitor scrolls in) + the topology trace on hover or press (pointer, state) + the replay scrub
   (state) + a magnetic hero ask on fine pointers. Every word and link is Hanzo's; arcs, bars and the session are drawn
   examples, not measurements. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionValueEvent, useInView } from 'motion/react';
import { EASE, useCalm } from '../../ui';
import { useFrame } from './Frame';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import './World.css';

// points on a sphere (golden spiral), drawn as a turning globe of dots
const PTS = Array.from({ length: 900 }, (_, i) => {
  const y = 1 - (i / 899) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
});
const HUBS = [21, 130, 247, 360, 471, 590, 702, 815];

function Globe({ run, calm, exit }) {
  const cv = useRef(null);
  const arcs = useRef([]);
  const ang = useRef(0.24);
  const draw = (t, dt = 0) => {
    const c = cv.current;
    if (!c) return;
    const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const e = exit ? exit.get() : 0;
    ang.current += dt * 0.12 * (1 - 0.65 * (e > 0 ? e : 0)); // the spin slows as the hero leaves
    const R = Math.min(w, h) * 0.47, cx = w / 2, cy = h / 2, a = ang.current, ca = Math.cos(a), sa = Math.sin(a), tl = 0.32;
    const proj = ([x, y, z]) => { const X = x * ca - z * sa, Z = x * sa + z * ca; const Y = y * Math.cos(tl) - Z * Math.sin(tl), Z2 = y * Math.sin(tl) + Z * Math.cos(tl); return [cx + X * R, cy - Y * R, Z2]; };
    const glow = g.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.08);
    glow.addColorStop(0, 'rgba(163, 163, 163, 0)'); glow.addColorStop(0.9, 'rgba(163, 163, 163, .16)'); glow.addColorStop(1, 'rgba(163, 163, 163, 0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, R * 1.08, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(163, 163, 163, .35)'; g.lineWidth = 1.2; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
    for (const p of PTS) {
      const [x, y, z] = proj(p);
      if (z < -0.02) continue;
      g.fillStyle = `rgba(250,250,250,${0.22 + z * 0.66})`;
      g.beginPath(); g.arc(x, y, 1.1 + z * 1.3, 0, 6.283); g.fill();
    }
    if (!arcs.current.length || Math.random() < 0.06) arcs.current.push({ a: PTS[Math.floor(Math.random() * 900)], b: PTS[HUBS[Math.floor(Math.random() * HUBS.length)]], t0: t });
    arcs.current = arcs.current.filter((r) => t - r.t0 < 2.4).slice(-18);
    for (const r of arcs.current) {
      const [x1, y1, z1] = proj(r.a), [x2, y2, z2] = proj(r.b);
      if (z1 < 0 || z2 < 0) continue;
      const k = Math.min(1, (t - r.t0) / 0.9), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.4;
      g.strokeStyle = `rgba(250,250,250,${Math.max(0, 0.9 - Math.max(0, t - r.t0 - 1.3))})`;
      g.lineWidth = 1.6;
      g.beginPath();
      for (let s = 0; s <= 28 * k; s++) { const u = s / 28, X = (1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, Y = (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2; s ? g.lineTo(X, Y) : g.moveTo(X, Y); }
      g.stroke();
      if (k >= 1) { g.fillStyle = '#fafafa'; g.beginPath(); g.arc(x2, y2, 3, 0, 6.283); g.fill(); }
    }
    for (const hb of HUBS) { const [x, y, z] = proj(PTS[hb]); if (z > 0) { g.strokeStyle = 'rgba(163, 163, 163, .85)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, 6, 0, 6.283); g.stroke(); } }
  };
  useFrame(run, (t, dt) => draw(t, dt));
  useEffect(() => { const id = requestIdle(() => draw(2)); return () => cancelIdle(id); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = useTransform(exit, [0, 1], [1, 0.9]);
  const y = useTransform(exit, [0, 1], [0, -24]);
  return <div className="wd2-globe"><motion.div className="wd2-globe-in" style={{ scale: s, y }}><canvas ref={cv} aria-hidden="true" /></motion.div></div>;
}
const requestIdle = (f) => setTimeout(f, 60);
const cancelIdle = (id) => clearTimeout(id);

const MODELS = ['zen', 'kai', 'enso'];
const rnd = (i) => { const x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); };

/* Latency by model, ticking; a drift alert when production leaves its baseline. */
function Panel({ run, children }) {
  const [n, setN] = useState(0);
  useTick(1200, run, () => setN((v) => v + 1));
  const drift = n % 9 >= 6;
  return (
    <div className="wd2-panel">
      <div className="wd2-panel-h"><p className="wd2-k l2-mono" aria-hidden="true">latency by model</p>{children}</div>
      <div aria-hidden="true">
        {MODELS.map((m, k) => (
          <div key={m} className="wd2-lat">
            <b className="l2-mono">{m}</b>
            {['P50', 'P95', 'P99'].map((q, j) => <span key={q}><em className="l2-mono">{q}</em><i><u style={{ transform: `scaleX(${0.2 + j * 0.24 + rnd(n * 3 + k * 7 + j) * 0.16})` }} /></i></span>)}
          </div>
        ))}
        <p className={'wd2-drift l2-mono' + (drift ? ' on' : '')}>drift · production diverges from baseline</p>
      </div>
    </div>
  );
}

/* matches a media query once mounted (false on the server, so the first paint is the CSS's own layout) */
function useMedia(q) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setOn(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return on;
}
const PINNED = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* The hero object: the turning globe with requests arcing to the GPUs that served them, and the latency panel. Both run
   while on screen, pause together, and hold a still frame under reduced motion. On desktop, as the hero scrolls away, the
   globe shrinks to .9, rises 24px and slows its spin (one goes out as the control room comes in). */
function Hero() {
  const [ref, run, calm, paused, toggle] = useDemo(0.1);
  const wide = useRef(false);
  wide.current = useMedia(PINNED);
  const box = useRef({ a: 0, b: 1 });
  useEffect(() => {
    const sec = ref.current && ref.current.closest('.l2-stage');
    if (!sec) return;
    const m = () => { const top = sec.getBoundingClientRect().top + scrollY, end = top + sec.offsetHeight; box.current = { a: Math.max(top, end - innerHeight * 1.4), b: end - innerHeight * 0.25 }; }; // the exit runs across the hero's last stretch, so it is seen
    m(); addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, [ref]);
  const { scrollY: pageY } = useScroll();
  const exit = useMotionValue(0);
  useMotionValueEvent(pageY, 'change', (v) => exit.set(wide.current ? clamp01((v - box.current.a) / (box.current.b - box.current.a)) || 0 : 0));
  return (
    <div className="wd2-world" ref={ref}>
      <Panel run={run}><PauseBtn paused={paused} onClick={toggle} className="dk" /></Panel>
      <Globe run={run} calm={calm} exit={exit} />
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

/* While on air, the traced route swaps between zen and kai every 2s until the visitor points at a node. */
function Topology({ live }) {
  const [hot, setHot] = useState(4);
  const [touched, setTouched] = useState(false);
  useTick(2000, live && !touched, () => setHot((h) => (h === 4 ? 5 : 4)));
  const pick = (i) => { setTouched(true); setHot(i); };
  const lit = (a, b) => (hot === 4 ? [[0, 1], [1, 2], [2, 4], [4, 6]] : [[0, 1], [1, 3], [3, 5], [5, 6]]).some(([x, y]) => x === a && y === b);
  return (
    <div className="wd2-topo">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g>{PATH.map(([a, b]) => <line key={a + '-' + b} className={lit(a, b) ? 'on' : ''} x1={NODES[a][1]} y1={NODES[a][2]} x2={NODES[b][1]} y2={NODES[b][2]} />)}</g></svg>
      {NODES.map(([t, x, y], i) => (i === 4 || i === 5
        ? <button key={t} type="button" className={'wd2-node l2-mono m' + (i === hot ? ' on' : '')} style={{ '--x': x + '%', '--y': y + '%', '--d': i * 60 + 'ms' }} onClick={() => pick(i)} onMouseEnter={() => pick(i)} aria-pressed={i === hot}>{t}</button>
        : <span key={t} className="wd2-node l2-mono" style={{ '--x': x + '%', '--y': y + '%', '--d': i * 60 + 'ms' }}>{t}</span>
      ))}
    </div>
  );
}

const STEPS = ['prompt', 'tool call', 'IO', 'model output', 'tool call', 'model output'];

/* Beyond: scrub a session the way Forensic Replay reconstructs one. While on air it plays itself one step every 1.5s,
   until the visitor takes the scrub. */
function Replay({ live }) {
  const [at, setAt] = useState(2);
  const [touched, setTouched] = useState(false);
  const [ready, setReady] = useState(false); // the range input renders after mount: the server paints a still track of the same size
  useEffect(() => setReady(true), []);
  useTick(1500, live && !touched, () => setAt((a) => (a + 1) % STEPS.length));
  const take = () => setTouched(true);
  const p = (at / (STEPS.length - 1)) * 100 + '%';
  return (
    <div className="wd2-replay">
      <div className="wd2-rp-track" aria-hidden="true">
        {STEPS.map((k, i) => <span key={i} className={'l2-mono' + (i <= at ? ' done' : '') + (i === at ? ' now' : '')} style={{ '--d': 200 + i * 60 + 'ms' }}>{k}</span>)}
      </div>
      <label className="wd2-rp-scrub"><span className="x-sr">Forensic Replay</span>{ready
        ? <input className="l2-range" type="range" min="0" max={STEPS.length - 1} value={at} onChange={(e) => { take(); setAt(+e.target.value); }} onPointerDown={take} onKeyDown={take} onFocus={take} style={{ '--p': p }} aria-valuetext={`${at + 1} / ${STEPS.length} ${STEPS[at]}`} />
        : <span className="wd2-rp-still" aria-hidden="true"><i style={{ width: p }} /><b style={{ left: p }} /></span>}</label>
      <div className="wd2-rp-now" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
            <b className="l2-mono">{at + 1} / {STEPS.length}</b><span>{STEPS[at]}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* A beat counter for the monitor on air: counts every ms while live, back to 0 (the arrival pose) once it is not. */
function useBeat(ms, live) {
  const [n, setN] = useState(0);
  useTick(ms, live, () => setN((v) => v + 1));
  useEffect(() => { if (!live) setN(0); }, [live]);
  return n;
}

/* Latency: while on air the P50/P95/P99 bars re-draw every 1.2s inside their own lanes (the order never changes),
   and the cost-spike dot blinks when a P99 bar runs long. */
function Latency({ live }) {
  const n = useBeat(1200, live);
  const at = (t, k, j) => (t ? 0.82 + rnd(t * 3 + k * 7 + j) * 0.18 : 1);
  const w = (k, j) => at(n, k, j);
  let hit = 0; // the latest beat on which a P99 bar ran long: the dot re-blinks when it changes
  for (let t = n; t > 0 && !hit; t--) if (MODELS.some((m, k) => at(t, k, 2) > 0.95)) hit = t;
  return (
    <div className="wd2-lc">
      {MODELS.map((m, k) => <p key={m}><b className="l2-mono">{m}</b>{[0.34, 0.58, 0.82].map((b, j) => <i key={j} style={{ width: (b - k * 0.05) * 100 + '%', '--d': (k * 3 + j) * 60 + 'ms' }} className={'q' + j}><u style={{ transform: `scaleX(${w(k, j)})` }} /></i>)}</p>)}
      <p className="spike l2-mono"><i key={hit} className={hit ? 'again' : ''} />auto-anomaly · cost spike</p>
    </div>
  );
}

/* Drift: a hollow ink ring at the line's end; while on air it sends out a pulse every 1.5s. */
function Drift({ live }) {
  const n = useBeat(1500, live);
  return (
    <svg className="wd2-drift-c" viewBox="0 0 200 90" aria-hidden="true">
      <rect x="0" y="34" width="200" height="22" className="band" />
      <path d="M0 46 C 20 42, 40 50, 60 45 S 100 48, 120 44 S 150 42, 160 38 S 178 24, 188 16" className="ln" />
      {n > 0 && <circle key={n} cx="188" cy="16" r="5" className="pu" />}
      <circle cx="188" cy="16" r="5" className="al" />
    </svg>
  );
}

/* Eval: while on air the pinned v2 score nudges inside its own bar every 1.5s; v1 holds. */
function Evals({ live }) {
  const n = useBeat(1500, live);
  return <div className="wd2-ev">{['v1', 'v2'].map((v, k) => <p key={v} className={k ? 'b' : ''}><span className="l2-mono">{v}</span><i style={{ width: k ? '82%' : '68%' }}><u style={k && n ? { transform: `scaleX(${0.95 + rnd(n) * 0.05})` } : undefined} /></i><em className="l2-mono">{k ? 'pinned' : ''}</em></p>)}</div>;
}

/* Multi-cloud: while on air each source lights its signal dot in turn, feeding the one view. */
function Clouds({ live }) {
  const n = useBeat(1200, live);
  return <ul className="wd2-mc">{['Hanzo Cloud', 'AWS', 'GCP', 'Azure', 'self-hosted'].map((s, k) => <li key={s} className={n && (n - 1) % 5 === k ? 'sig' : ''} style={{ '--x': GATHER[k][0] + 'px', '--y': GATHER[k][1] + 'px', '--d': k * 60 + 'ms' }}>{s}</li>)}<li className="one">One unified view</li></ul>;
}

function Pic({ i, live }) {
  if (i === 0) return <Topology live={live} />;
  if (i === 1) return <Latency live={live} />;
  if (i === 2) return <Drift live={live} />;
  if (i === 3) return <Evals live={live} />;
  if (i === 4) return <Clouds live={live} />;
  return <Replay live={live} />;
}
const GATHER = [[-28, -22], [18, -30], [34, 12], [-16, 26], [26, 30]]; // where each signal starts before it gathers into one view

/* The control room. Desktop (no reduced motion): the room pins and scroll chooses which monitor is on air: one large
   monitor at a time, its drawing playing once as it arrives, beside the heading and a numbered rail of all six (the rail
   jumps there). Phones and reduced motion: the six stack, each playing its moment once as it scrolls in. */
function Room() {
  const track = useRef(null);
  const sec = useRef(null);
  const pinned = useMedia(PINNED);
  const calm = useCalm();
  const near = useInView(sec, { amount: 0.15 });
  const [act, setAct] = useState(0);
  // phones: the six sit on a sideways snap rail; the card in view is the one on air
  const onRail = (e) => {
    const el = e.currentTarget, c = el.firstElementChild;
    if (!c) return;
    const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    setAct(end ? CAPS.length - 1 : Math.min(CAPS.length - 1, Math.round(el.scrollLeft / (c.offsetWidth + 12))));
  };
  const [seen, setSeen] = useState(() => CAPS.map(() => false));
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => { if (pinned) setAct(Math.min(CAPS.length - 1, Math.floor(v * CAPS.length))); });
  useEffect(() => {
    if (pinned) return;
    if (calm) { setSeen(CAPS.map(() => true)); return; }
    const els = [...track.current.querySelectorAll('.wd2-mon')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = els.indexOf(e.target); setSeen((s) => (s[i] ? s : s.map((v, j) => v || j === i))); } }), { threshold: 0.35 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pinned, calm]);
  const go = (i) => {
    const el = track.current;
    const top = el.getBoundingClientRect().top + scrollY, len = el.offsetHeight - innerHeight;
    scrollTo({ top: top + len * ((i + 0.5) / CAPS.length), behavior: 'smooth' });
  };
  return (
    <section ref={sec} className={'l2-sec wd2-room' + (pinned ? ' pinned' : '')}>
      <div className="wd2-track" ref={track}>
        <div className="l2-wrap wd2-pin">
          <div className="wd2-side">
            <h2 className="l2-head wd2-room-h">See Every Model, Everywhere</h2>
            <p className="wd2-count" aria-hidden="true"><span className="wd2-roll"><span style={{ transform: `translateY(${-act * 100 / CAPS.length}%)` }}>{CAPS.map((c, i) => <b key={i} className="l2-fig">{String(i + 1).padStart(2, '0')}</b>)}</span></span><em className="l2-mono">/ 06</em></p>
            {pinned && (
              <nav className="wd2-rail" aria-label="See Every Model, Everywhere">
                {CAPS.map(([t], i) => <RailItem key={t} i={i} t={t} p={p} on={i === act} onClick={() => go(i)} />)}
              </nav>
            )}
          </div>
          <div className="wd2-grid" onScroll={pinned ? undefined : onRail}>
            {CAPS.map(([t, d], i) => {
              const on = pinned ? i === act : seen[i];
              const live = on && i === act && near && !calm; // one idle beat, only on the monitor on air, only on screen
              return (
                <article key={t} className={'wd2-mon c' + i + (on ? ' on' : '') + (pinned && i < act ? ' past' : '')} inert={pinned && !on ? true : undefined}>
                  <header><span className="l2-mono">{String(i + 1).padStart(2, '0')} / 06</span></header>
                  <div className="wd2-pic"><Pic i={i} live={live} /></div>
                  <div className="wd2-cap">
                    <h3 className="l2-title"><span className="wd2-ln"><span>{t}</span></span></h3>
                    <p className="l2-body">{d}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* One rail stop: its number, its title, and a hairline that fills as scroll passes through its monitor. */
function RailItem({ i, t, p, on, onClick }) {
  const fill = useTransform(p, (v) => clamp01(v * CAPS.length - i));
  return (
    <button type="button" className={'wd2-stop' + (on ? ' on' : '')} aria-current={on ? 'step' : undefined} onClick={onClick}>
      <span className="l2-mono">{String(i + 1).padStart(2, '0')}</span>
      <b>{t}</b>
      <i aria-hidden="true"><motion.u style={{ scaleX: fill }} /></i>
    </button>
  );
}

/* Fine pointers: the hero ask leans toward the pointer (at most 8px) once it comes within 22px of it, and settles back. */
function useMagnet() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = document.querySelector('.wd2 .l2-stage [data-cta="primary"]');
    if (!el) return;
    const zone = el.parentElement;
    const move = (e) => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const near = e.clientX > r.left - 22 && e.clientX < r.right + 22 && e.clientY > r.top - 22 && e.clientY < r.bottom + 22;
      const c = (v) => Math.max(-8, Math.min(8, v));
      el.style.translate = near ? `${c((e.clientX - cx) * 0.12)}px ${c((e.clientY - cy) * 0.25)}px` : '0px 0px';
    };
    const leave = () => { el.style.translate = '0px 0px'; };
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', leave);
    return () => { zone.removeEventListener('pointermove', move); zone.removeEventListener('pointerleave', leave); };
  }, []);
}

export default function World() {
  useMagnet();
  return (
    <main id="main" className="l2-page wd2" data-ask="off">
      <StageHero look="side" dark kick="world.hanzo.ai" title="Hanzo World" sub="World Monitor — global AI-system observability" acts={[['Open World Monitor', 'https://world.hanzo.ai'], ['Documentation', 'https://docs.hanzo.ai/docs/cli/world']]}>
        <Hero />
      </StageHero>
      <Room />
      <Finale name="World" head="Run AI With Confidence" lede="Free for the first million events / month." ask={['Open World Monitor', 'https://world.hanzo.ai']} links={[['Documentation', 'https://docs.hanzo.ai/docs/cli/world']]} prompt="Read https://hanzo.ai/skill.md and use Hanzo World in my project. Start with: hanzo world news" tag="3D world building" />
    </main>
  );
}
