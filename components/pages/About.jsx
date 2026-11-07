'use client';
/* About. Signature: the frontier as one living curve. In the hero it draws and redraws on its own; in the track record
   your scroll draws it from 2014 to today and the milestones snap onto it. The six reasons we build sit on a radar whose
   axes push out as you read them; the Zen of Hanzo turns over card by card.
   Beyond: "Pick two? Keep all four." The lede's four trade-offs (capability, latency, cost, control) as switches: keep
   any, nothing switches off, and each shows the line on this page that holds it. Every word and figure is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Count } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import { useOpener } from '../Opener';
import { href } from '../../lib/route';
import './About.css';

/* ---------- the frontier: one curve, four ghost axes under it ---------- */
const W = 1000, H = 440, PX = 36, PT = 28, PB = 52;
const f = (t) => 1 - Math.pow(1 - t, 2.2);
const X = (t) => PX + t * (W - 2 * PX);
const Y = (v) => H - PB - v * (H - PB - PT);
const trace = (g) => Array.from({ length: 61 }, (_, i) => { const t = i / 60; return (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(g(t)).toFixed(1); }).join('');
const FRONT = trace(f);
const AXES = [
  ['Intelligence', 0.42, 1.6, 0.3],
  ['Speed', 0.55, 1.2, 0.42],
  ['Deterministic safety', 0.66, 2.1, 0.54],
  ['Equitable cost', 0.78, 1.4, 0.66],
].map(([name, a, q, at]) => { const g = (t) => f(t) * (a + (1 - a) * Math.pow(t, q)); return { name, d: trace(g), lx: X(at), ly: Y(g(at)) - 10 }; });
const YEARS = [2014, 2016, 2018, 2020, 2022, 2024, 2026];

const MILES = [
  { y: 2014, t: 0, title: 'SKULLY and open-source commerce' },
  { y: 2017, t: 0.25, title: 'Techstars ’17' },
  { y: 2024, t: 10 / 12, title: 'Damon Motors and Triller listing on Nasdaq' },
  { y: 2026, t: 1, title: '1700+ open repositories and the sovereign AI cloud' },
];

/* p runs 0 to 1: how much of the curve is drawn. Marks (milestones) snap on as the head passes them. */
function Frontier({ p, marks, big }) {
  const head = useTransform(p, (v) => X(v));
  const hy = useTransform(p, (v) => Y(f(v)));
  return (
    <svg className={'xab-svg' + (big ? ' big' : '')} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="The Pareto frontier: intelligence, speed, deterministic safety and equitable cost, advancing together from 2014 to 2026">
      {[0.25, 0.5, 0.75, 1].map((v) => <line key={v} x1={PX} x2={W - PX} y1={Y(v)} y2={Y(v)} className="xab-grid" />)}
      {YEARS.map((yr) => {
        const x = X((yr - 2014) / 12);
        return <g key={yr}><line x1={x} x2={x} y1={Y(0)} y2={Y(0) + 8} className="xab-tickline" /><text x={x} y={H - 14} textAnchor="middle" className="xab-yr">{yr}</text></g>;
      })}
      <line x1={PX} x2={W - PX} y1={Y(0)} y2={Y(0)} className="xab-base" />
      {AXES.map((a, i) => (
        <g key={a.name}>
          <motion.path d={a.d} className="xab-ghost" style={{ pathLength: p }} />
          <motion.text x={a.lx} y={a.ly} className="xab-axis" style={{ opacity: useTransform(p, [(0.3 + i * 0.12) - 0.05, (0.3 + i * 0.12) + 0.05], [0, 1]) }}>{a.name}</motion.text>
        </g>
      ))}
      <motion.path d={FRONT} className="xab-front" style={{ pathLength: p }} />
      {marks && MILES.map((m) => <Mark key={m.y} m={m} p={p} />)}
      <motion.g style={{ x: head, y: hy }}>
        <circle r="16" className="xab-halo" />
        <circle r="6.5" className="xab-head" />
      </motion.g>
    </svg>
  );
}

/* A milestone: its dot snaps onto the curve with a little overshoot, its year beside it. */
function Mark({ m, p }) {
  const r = useTransform(p, [m.t - 0.02, m.t + 0.015], [0, 1], { clamp: true });
  const s = useSpring(r, { stiffness: 520, damping: 16 });
  const o = useTransform(r, [0, 1], [0, 1]);
  const x = X(m.t), y = Y(f(m.t));
  const left = m.t > 0.5;
  return (
    <g>
      <motion.line x1={x} x2={x} y1={y} y2={Y(0)} className="xab-drop" style={{ opacity: o }} />
      <motion.circle cx={x} cy={y} r="9" className="xab-mark" style={{ scale: s }} />
      <motion.text x={left ? x - 18 : x + 18} y={y + 34} textAnchor={left ? 'end' : 'start'} className="xab-mark-y" style={{ opacity: o }}>{m.y}</motion.text>
    </g>
  );
}

function LedgerItem({ m, p }) {
  const r = useTransform(p, [m.t - 0.02, m.t + 0.04], [0, 1], { clamp: true });
  const y = useTransform(r, [0, 1], [14, 0]);
  return (
    <motion.li style={{ opacity: useTransform(r, [0, 1], [0.22, 1]), y }}>
      <b>{m.y}</b>
      <span>{m.title}</span>
    </motion.li>
  );
}

/* ---------- hero ---------- */
function HeroCurve() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const p = useMotionValue(calm ? 1 : 0);
  // idle: the curve draws itself, holds, and draws again, only while it is on screen
  useEffect(() => {
    if (calm) { p.set(1); return; }
    if (!seen) return;
    const c = animate(p, [0, 1, 1], { duration: 8, times: [0, 0.42, 1], ease: EASE, repeat: Infinity, repeatDelay: 0.4 });
    return () => c.stop();
  }, [seen, calm, p]);
  return (
    <div className="xab-hero-art" ref={ref}>
      <Frontier p={p} />
      <p className="xab-art-note" aria-hidden="true">Illustration, not data</p>
    </div>
  );
}

const FOUNDERS = [
  { name: 'Antje Worring', img: '/authors/antje-worring-portrait.jpg', role: 'Chief Executive Officer and co-founder', bio: 'Leads Hanzo’s strategy, enterprise partnerships and sovereign AI deployments.', links: [['Website', 'https://antjeworr.ing'], ['X', 'https://x.com/antjeworring'], ['GitHub', 'https://github.com/zooqueen'], ['LinkedIn', 'https://www.linkedin.com/in/antje-worring/']] },
  { name: 'Zach Kelling', img: '/authors/zach-kelling-portrait.jpg', role: 'Chief Technology Officer and founder', bio: 'Builds Hanzo’s AI cloud, its engine runtimes and its agent frameworks. A long-time open-source author.', links: [['Website', 'https://zeekay.io'], ['X', 'https://x.com/zeekay'], ['GitHub', 'https://github.com/zeekay'], ['LinkedIn', 'https://www.linkedin.com/in/zeekay/']] },
];

function Founder({ p }) {
  return (
    <div className="xab-founder">
      <img src={p.img} alt={p.name} width="72" height="72" />
      <div>
        <h3>{p.name}</h3>
        <p className="xab-role">{p.role}</p>
        <p>{p.bio}</p>
        <ul className="xab-socials">{p.links.map(([l, to]) => <li key={l}><A to={to}>{l} <span aria-hidden="true">↗</span></A></li>)}</ul>
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xab-hero" aria-labelledby="xab-h1">
      <div className="x-wrap xab-hero-grid">
        <div>
          <motion.span className="xab-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Techstars ’17</motion.span>
          <h1 id="xab-h1" className="xab-h1">{line('Chasing the', 0.05)}{line('Pareto Frontier', 0.15)}{line('of AI', 0.25)}</h1>
          <motion.p className="xab-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            From SKULLY and open-source commerce, through Techstars ’17, to 1700+ open repositories and the sovereign AI cloud today — advancing intelligence, speed, deterministic safety, and equitable cost together.
          </motion.p>
          <motion.div className="xab-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>
            <Go to="/pricing" solid>Get Started</Go><i hidden data-thumb="Get Started" data-href="/pricing" />
            <Go to="/history">Our History</Go>
            <Go to="/open-source">Open Source</Go>
          </motion.div>
        </div>
        <HeroCurve />
      </div>
      <div className="x-wrap xab-founders">
        {FOUNDERS.map((p) => <Founder key={p.name} p={p} />)}
      </div>
    </section>
  );
}

/* ---------- why we build: a radar whose axes push out as each reason is read ---------- */
const PILLARS = [
  ['Safety in AI', 'Deterministic verification over guesswork', 'Generative models drift and hallucinate when left unchecked. We pair frontier reasoning with Kai calibrated discrete decision models, formal policy gates, and sandboxed execution so autonomous agents stay bounded in production.', 'Safety research', '/research'],
  ['Frontier Performance', 'Bare-metal C, CUDA, and Metal runtimes', 'Speed is an architectural choice. From Hanzo Engine’s zero-Python inference kernels and Kai’s decisions, which write no text, to Enso’s learned multi-model routing, every layer is engineered to maximize intelligence per millisecond.', 'Live benchmarks', '/benchmarks'],
  ['Equitable Access', 'Frontier capability without hyperscaler tax', 'Breakthrough AI cannot belong only to trillion-dollar incumbents. By routing each task to the most efficient model, publishing open weights, and pricing compute fairly, we put startups, researchers, and builders on equal footing.', 'Transparent pricing', '/pricing'],
  ['Open Source', '1700+ public repositories since 2014', 'Our engines, agent SDKs, MCP servers, UI kits, and Hanzo Improvement Proposals (HIPs) are developed in the open. Anyone can inspect the code, verify how decisions are made, fork the stack, and contribute.', 'Browse repositories', '/open-source'],
  ['Privacy by Architecture', 'No training without your say', 'Business and API accounts are never used to train shared models unless an administrator or a written agreement says so, and a personal account only if you turn it on. Organizations sit in isolated tenant databases with scoped HKDF-SHA256 keys, local-first CLI workflows, and strict gateway identity stripping.', 'Security & trust', '/trust'],
  ['Ownership & Sovereignty', 'Cloud, private VPC, on-prem, or air-gapped', 'If you cannot move your weights, memory, and runtime onto your own hardware, you are renting your intelligence. Hanzo runs identically on our global cloud, inside your VPC, or completely air-gapped on your own GPUs.', 'Explore platform', '/platform'],
];
const ang = (i) => -Math.PI / 2 + (i * Math.PI) / 3;

function Spoke({ v, i }) {
  const cx = useTransform(v, (k) => 200 + Math.cos(ang(i)) * 150 * k);
  const cy = useTransform(v, (k) => 200 + Math.sin(ang(i)) * 150 * k);
  return <motion.circle cx={cx} cy={cy} r="6" className="xab-spoke" />;
}

function Radar({ act }) {
  /* six springs, a fixed number, one per axis */
  /* eslint-disable react-hooks/rules-of-hooks */
  const vs = PILLARS.map(() => useSpring(0.66, { stiffness: 110, damping: 15 }));
  /* eslint-enable react-hooks/rules-of-hooks */
  const pts = useTransform(vs, (a) => a.map((k, i) => (200 + Math.cos(ang(i)) * 150 * k).toFixed(1) + ',' + (200 + Math.sin(ang(i)) * 150 * k).toFixed(1)).join(' '));
  useEffect(() => { vs.forEach((s, i) => s.set(i === act ? 1 : 0.66)); }, [act]); // eslint-disable-line react-hooks/exhaustive-deps
  const ring = (k) => PILLARS.map((_, i) => (200 + Math.cos(ang(i)) * 150 * k).toFixed(1) + ',' + (200 + Math.sin(ang(i)) * 150 * k).toFixed(1)).join(' ');
  return (
    <svg viewBox="0 0 400 400" className="xab-radar" role="img" aria-label="Six reasons we build, as six axes pushed out together">
      {[0.34, 0.66, 1].map((k) => <polygon key={k} points={ring(k)} className="xab-ring" />)}
      {PILLARS.map((_, i) => <line key={i} x1="200" y1="200" x2={200 + Math.cos(ang(i)) * 150} y2={200 + Math.sin(ang(i)) * 150} className="xab-ring" />)}
      <motion.polygon points={pts} className="xab-shape" />
      {vs.map((v, i) => <Spoke key={i} v={v} i={i} />)}
      {PILLARS.map((p, i) => {
        const cx = Math.cos(ang(i)), on = i === act;
        return (
          <g key={i} className={'xab-lab' + (on ? ' on' : '')}>
            <text x={200 + cx * 176} y={200 + Math.sin(ang(i)) * 176 + 4} textAnchor="middle" className={'xab-num' + (on ? ' on' : '')}>{String(i + 1).padStart(2, '0')}</text>
            <text x={200 + cx * 176} y={200 + Math.sin(ang(i)) * 176 + (Math.sin(ang(i)) > 0 ? 24 : -14)} textAnchor="middle" className="xab-axname" aria-hidden="true">{p[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* Beyond: the lede says most platforms make you pick two of four; keep any of them and nothing switches off */
const PICKS = [
  ['Raw capability', '…every layer is engineered to maximize intelligence per millisecond.', 'Frontier Performance', '/benchmarks'],
  ['Low latency', 'Speed is an architectural choice.', 'Bare-metal C, CUDA, and Metal runtimes', '/benchmarks'],
  ['Affordable cost', '…routing each task to the most efficient model, publishing open weights, and pricing compute fairly…', 'Equitable Access', '/pricing'],
  ['Control over your data', 'Hanzo runs identically on our global cloud, inside your VPC, or completely air-gapped on your own GPUs.', 'Ownership & Sovereignty', '/platform'],
];

function Picks() {
  const [on, setOn] = useState([0, 1]);
  const flip = (i) => setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div className="xab-picks">
      <ul>
        {PICKS.map(([t, q, from, to], i) => (
          <li key={t} className={on.includes(i) ? 'on' : ''}>
            <button type="button" aria-pressed={on.includes(i)} onClick={() => flip(i)}><span className="xab-sw" aria-hidden="true" />{t}</button>
            <p>{q}</p>
            <More to={to}>{from}</More>
          </li>
        ))}
      </ul>
      <p className="xab-picks-sum" aria-live="polite">
        {on.length === PICKS.length ? <b>Chasing the Pareto frontier means advancing every axis at once through better systems engineering and open research.</b> : <span>{on.length} of {PICKS.length} kept</span>}
      </p>
    </div>
  );
}

function Why() {
  const [act, setAct] = useState(0);
  const list = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAct(+e.target.dataset.i); }), { rootMargin: '-42% 0px -42% 0px' });
    list.current.querySelectorAll('[data-i]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="x-sec xab-why" id="why">
      <div className="x-wrap">
        <SecHead kicker="Why We Build" title="Moving the frontier without trading away safety, privacy, or ownership." lede="Most AI platforms ask you to pick two: raw capability, low latency, affordable cost, or control over your data. Chasing the Pareto frontier means advancing every axis at once through better systems engineering and open research." />
        <Picks />
        <div className="xab-why-grid">
          <div className="xab-why-radar"><Radar act={act} /></div>
          <ol className="xab-pillars" ref={list}>
            {PILLARS.map(([t, k, d, l, to], i) => (
              <li key={t} data-i={i} className={i === act ? 'on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && setAct(i)} onFocus={() => setAct(i)}>
                <span className="xab-pn" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p className="xab-pk">{k}</p>
                  <div className="xab-more" inert={i !== act}><div><p>{d}</p><More to={to}>{l}</More></div></div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- the track record: your scroll draws the curve, 2014 to today ---------- */
function Track() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const drawn = useTransform(scrollYProgress, [0.05, 0.9], [0, 1], { clamp: true });
  const fixed = useMotionValue(1);
  const p = calm ? fixed : drawn;
  return (
    <>
      <section className="xab-track" ref={ref} aria-labelledby="xab-track-h">
        <div className="xab-pin">
          <div className="x-wrap">
            <header className="x-head">
              <p className="x-kick">Proven Track Record</p>
              <h2 id="xab-track-h">Built with founders, scaled to public markets.</h2>
            </header>
            <div className="xab-plot"><Frontier p={p} marks big /></div>
            <ol className="xab-ledger">{MILES.map((m) => <LedgerItem key={m.y} m={m} p={p} />)}</ol>
          </div>
        </div>
      </section>
      <section className="x-sec xab-record">
        <div className="x-wrap xab-record-grid">
          <p className="xab-record-p">From SKULLY and open-source commerce through Techstars ’17 to Damon Motors and Triller listing on Nasdaq in 2024, Hanzo has engineered sovereign commerce and AI systems for hundreds of venture-backed companies. Read the complete 2014–2026 archive on our history page, or start building today.</p>
          <dl className="xab-stats">
            <div><dt><Count to={100} suffix="+" /></dt><dd>Startups built &amp; funded</dd></div>
            <div><dt><Count to={1} prefix="$" suffix="B+" /></dt><dd>Client revenue generated</dd></div>
            <div><dt>2024</dt><dd>Went public on Nasdaq (2024)</dd></div>
          </dl>
        </div>
        <div className="x-wrap xab-acts-row">
          <Go to="/pricing" solid>Start Building</Go>
          <Go to="/history">Read Our Full History</Go>
          <Go to="/customers">Customer Stories</Go>
        </div>
      </section>
    </>
  );
}

/* ---------- the Zen of Hanzo: six cards that turn over, one after another ---------- */
const ZEN = [
  ['Enable the Underdog', 'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.'],
  ['Data-Driven Everything', 'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.'],
  ['Open Innovation', 'Be open, share often. Openness accelerates growth—both for the company and its community.'],
  ['Adaptability', 'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.'],
  ['Customer-Centric Growth', 'Treat each client as a long-term partner and guide them to success.'],
  ['First Principles Thinking', 'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.'],
];

function Zen() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [on, setOn] = useState([]);
  const hand = useRef(0);
  // idle: the cards turn one by one, hold, and turn back; a hand on any card pauses it for a while
  useEffect(() => {
    if (!seen || calm) return;
    let n = 0, t;
    const step = () => {
      if (performance.now() - hand.current < 9000) { t = setTimeout(step, 1200); return; }
      if (n < ZEN.length) { const k = n++; setOn((o) => (o.includes(k) ? o : [...o, k])); t = setTimeout(step, 1500); }
      else { t = setTimeout(() => { setOn([]); n = 0; t = setTimeout(step, 1500); }, 3200); }
    };
    t = setTimeout(step, 900);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const flip = (i) => { hand.current = performance.now(); setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i])); };
  return (
    <section className="x-sec xab-zen" id="zen">
      <div className="x-wrap">
        <SecHead kicker="Operating Principles" title="The Zen of Hanzo" lede="The principles the company argues from when a decision is close." />
        <ul className="xab-cards" ref={box}>
          {ZEN.map(([t, d], i) => (
            <li key={t}>
              <button type="button" className={'xab-card' + (on.includes(i) ? ' turned' : '')} aria-pressed={on.includes(i)} onClick={() => flip(i)}>
                <span className="xab-card-in">
                  <span className="xab-face front"><i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i><b>{t}</b></span>
                  <span className="xab-face back"><span>{d}</span></span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="x-row-links"><More to="/philosophy">Explore the full Zen manifesto</More></div>
      </div>
    </section>
  );
}

/* ---------- open source and deterministic safety, with the commits as they land ---------- */
const COMMITS = [
  ['hanzoai/ui', 'Merge pull request #299 from hanzoai/fix/footer-signature-no-crop', 'b44e122', 'Nov 6, 06:04 UTC', 'https://github.com/hanzoai/ui/commit/b44e1221957bb7e96d3c82c509109bb98300c92a'],
  ['hanzoai/desktop', 'chore(desktop): finalize 1.1.53 skin, guest/LSA integration, and UI primitive repairs', 'ddfcd04', 'Nov 6, 05:53 UTC', 'https://github.com/hanzoai/desktop/commit/ddfcd04565afa1b27a6480fd7fc2a9de0ec84e94'],
  ['hanzoai/desktop', 'Update css', 'e749213', 'Nov 6, 05:39 UTC', 'https://github.com/hanzoai/desktop/commit/e7492134d79dc3c7c1def579a2305cba7c8092f5'],
  ['hanzoai/desktop', "feat(desktop): hanzo.ai's app stack, macOS window controls, and the window's own skin", '421d4f2', 'Nov 6, 05:39 UTC', 'https://github.com/hanzoai/desktop/commit/421d4f233bd6516367293b496c6000c3a2219cde'],
  ['hanzoai/ui', 'fix(footer): keep full Hanzo wordmark and punctuation visible at responsive widths', '72c079f', 'Nov 6, 05:20 UTC', 'https://github.com/hanzoai/ui/commit/72c079f77bf1683373a719f575f3541006c72457'],
  ['hanzoai/homebrew-tap', 'hanzo 8.5.910', '098a650', 'Nov 6, 05:10 UTC', 'https://github.com/hanzoai/homebrew-tap/commit/098a650e94d36cbf48af446d647845ff90686929'],
];

function Open() {
  return (
    <section className="x-sec xab-open" data-room="dark">
      <div className="x-wrap">
        <SecHead dark kicker="Open Source & Deterministic Safety" title="Verifiable code. Calibrated decisions." lede="Opaque black-box platforms ask you to trust what you cannot inspect. Hanzo pairs public source code and open specifications with calibrated decision bounds and full infrastructure sovereignty." />
        <div className="xab-two">
          <div className="xab-pane">
            <h3>1700+ Open Repositories</h3>
            <p className="xab-pk">Auditable infrastructure from kernel to interface</p>
            <p>Since open-sourcing our commerce architecture in 2014, we have published over 1700 public repositories. From C/CUDA/Metal inference engines to agent compilers, MCP tools, and cross-platform UI kits, our stack is built to be read, audited, and extended.</p>
            <ul>
              <li><b>Zero Proprietary Lock-In:</b> Export and run models, agents, and state on your own hardware without rewriting application code.</li>
              <li><b>HIP Standards:</b> Core protocols and architectures published openly through Hanzo Improvement Proposals.</li>
              <li><b>Shared Ecosystem:</b> MCP servers, skills, UI primitives, and inference runtimes built in public with contributors worldwide.</li>
            </ul>
            <More to="/open-source">Explore Open Source Ecosystem</More>
          </div>
          <div className="xab-pane">
            <h3>Deterministic Safety Bounds</h3>
            <p className="xab-pk">Calibrated decisions, not guesswork</p>
            <p>Unconstrained token generators drift in high-stakes workflows. Hanzo puts calibrated decisions (Kai), policy checks and isolated sandboxes in front of any autonomous agent that touches production data or billing.</p>
            <ul>
              <li><b>Policy Governance:</b> Policy checks stop a tool call or a change your policy refuses before it is sent.</li>
              <li><b>Sovereign &amp; Air-Gapped:</b> Run inside your own VPC or offline cluster with zero external telemetry or third-party relays.</li>
              <li><b>Calibrated Confidence:</b> Kai returns calibrated probability distributions and defers cleanly when evidence is insufficient.</li>
            </ul>
            <More to="/research">Read Our Safety Research</More>
          </div>
        </div>
        <div className="xab-log">
          <div className="xab-log-h">
            <h3>Proof of Work: Recent Commits by Our Core Team</h3>
            <p><span className="xab-live" aria-hidden="true" />Public Activity <b>1700+ repositories</b> <A to="https://github.com/hanzoai">github.com/hanzoai</A></p>
          </div>
          <ul>
            {COMMITS.map(([repo, msg, sha, when, to], i) => (
              <li key={sha + i} style={{ '--i': i }}>
                <span className="xab-repo">{repo}</span>
                <A to={to} className="xab-msg">{msg}</A>
                <code>{sha}</code>
                <time>{when}</time>
              </li>
            ))}
          </ul>
          <div className="xab-log-f">
            <p>Every line written, reviewed, and shipped in the open by Hanzo engineers.</p>
            <Go to="/open-source">View Open Source Dashboard</Go>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- models and papers ---------- */
const RUNTIMES = [
  { name: 'Kai', kind: 'Decision Intelligence', d: 'Calibrated discrete decision model for autonomous agent loops. Factorized discrete choice, calibrated probability distributions, and deterministic policy governance.', tag: 'No output tokens · Calibrated confidence', to: '/kai', slug: 'kai' },
  { name: 'Zen Multimodal', kind: 'Foundation Models', d: 'Multimodal reasoning models across text, code, vision, speech, and structured output, built for both low-power edge devices and sovereign GPU clusters.', tag: 'High token throughput · Edge & Cloud', to: '/zen', slug: 'zen' },
  { name: 'Hanzo Engine', kind: 'Inference Runtime', d: 'Bare-metal C, CUDA, and Metal inference engine with speculative decoding and NVFP4/FP8 kernels, removing Python runtime overhead on production hardware.', tag: 'Zero Python runtime · C / CUDA / Metal', to: '/engine' },
  { name: 'Enso Router', kind: 'Semantic Routing', d: 'Learned semantic router and multi-model coordinator (HIP-0510) that sends each prompt to a model by accuracy and cost.', tag: 'Learned arbitration · Accuracy & cost', to: '/enso', slug: 'enso' },
];

function Runtime({ m, i }) {
  const box = useRef(null);
  const vid = useRef(null);
  const opener = useOpener();
  useEffect(() => {
    if (!vid.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const v = vid.current;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  const open = m.slug ? (e) => opener?.open(e, { el: box.current, src: `/models/${m.slug}.webp`, href: m.to, key: m.slug }) : undefined;
  return (
    <li>
      <a href={href(m.to)} ref={box} data-card={m.slug} className={'xab-rt' + (m.slug ? '' : ' plain')} onClick={open}>
        {m.slug && (
          <span className="xab-rt-media" aria-hidden="true">
            <img src={`/models/${m.slug}.webp`} alt="" />
            <video ref={vid} src={`/models/${m.slug}.webm`} muted loop playsInline preload="metadata" onPlaying={(e) => e.currentTarget.classList.add('on')} />
          </span>
        )}
        <span className="xab-rt-t">
          <h4>{m.name}</h4>
          <span className="xab-rt-k">{m.kind}</span>
          <span className="xab-rt-d">{m.d}</span>
          <span className="xab-rt-g">{m.tag}</span>
          <span className="xab-rt-go">Details <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </span>
      </a>
    </li>
  );
}

const PAPERS = [
  ['Research Paper', 'Oct 2026', 'Kai: Calibrated Discrete Decision Intelligence for Autonomous Agent Loops', 'Factorized discrete choice, calibrated distributions, and deterministic policy governance for mission-critical autonomy.', 'https://papers.hanzo.ai/kai-decision-model/'],
  ['Research Paper', 'Sep 2026', 'Linkage, Not Similarity: What Long-Term Agent Memory Has to Retrieve', 'Why cosine vector similarity falls short on multi-session recall and how linkage graphs preserve causal context over time.', 'https://papers.hanzo.ai/hanzo-context-memory/'],
  ['Technical Blog', 'Oct 2026', 'Your AI is Planning To Kill You: Deterministic Safety Bounds', 'Why unconstrained generative loops fail under adversarial pressure, and how Kai enforces mathematical safety bounds.', 'https://hanzo.blog/2026-10-16-your-ai-is-planning-to-kill-you/'],
  ['Technical Blog', 'Oct 2026', 'Optimizing for Headless Commerce in the Era of Agentic LLMs', 'What it takes for infrastructure to be readable, verifiable, and payable by autonomous agents with clear human authorization.', 'https://hanzo.blog/headless-commerce-agentic-llms/'],
];

function Research() {
  return (
    <section className="x-sec xab-research">
      <div className="x-wrap">
        <SecHead kicker="Frontier Models & Research" title="Original architectures, engines, and published research." lede="Rather than wrapping third-party endpoints, Hanzo designs decision models, semantic routers, bare-metal inference engines, and open research on verifiable agent safety." />
        <div className="xab-rt-head">
          <h3>Models &amp; Runtimes</h3>
          <More to="/models">View Model Catalog</More>
        </div>
        <ul className="xab-rts">{RUNTIMES.map((m, i) => <Runtime key={m.name} m={m} i={i} />)}</ul>
        <div className="xab-rt-head xab-papers-h">
          <h3>Selected Papers &amp; Technical Writing</h3>
          <div className="x-row-links tight"><More to="/research">Papers</More><More to="/blog">Blog</More></div>
        </div>
        <ul className="xab-papers">
          {PAPERS.map(([kind, when, t, d, to], i) => (
            <li key={t}>
              <A to={to} className="xab-paper">
                <span className="xab-paper-m"><span>{kind}</span><time>{when}</time></span>
                <span className="xab-paper-t" data-morph>{t}</span>
                <span className="xab-paper-d">{d}</span>
                <span className="xab-paper-go">Read publication <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- careers ---------- */
const ROLES = [
  ['Distributed Systems & Inference', 'Scaling bare-metal C/CUDA/Metal kernels, multi-node GPU clusters, and sovereign inference clouds.'],
  ['AI Safety & Formal Verification', 'Advancing calibrated discrete decision models (Kai), verification graphs, and deterministic policy bounds.'],
  ['Open Agent Compilers & Tools', 'Building MCP infrastructure, linkage memory, and local-first developer tools used across the ecosystem.'],
];

function Careers() {
  return (
    <section className="x-sec xab-careers">
      <div className="x-wrap">
        <SecHead kicker="Careers at Hanzo" title="Push the Pareto frontier with us." lede="We hire systems programmers, AI safety researchers, and product engineers who care about open source, equitable access, privacy, and sovereign ownership. High autonomy, zero bureaucracy, and code that ships in public." />
        <ul className="xab-roles">
          {ROLES.map(([t, d], i) => (
            <li key={t}>
              <svg viewBox="0 0 120 40" aria-hidden="true"><path d={`M2 38 C ${30 + i * 8} ${30 - i * 6}, ${70 + i * 6} ${8 + i * 2}, 118 ${4 + i * 3}`} /></svg>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <div className="xab-acts-row left">
          <Go to="/careers" solid>Explore Open Roles</Go>
          <Go to="/team">Meet the Team</Go>
          <Go to="/open-source">Browse Code on GitHub</Go>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <main className="xab">
      <Hero />
      <Why />
      <Track />
      <Zen />
      <Open />
      <Research />
      <Careers />
    </main>
  );
}
