'use client';
/* About, v3 (Story archetype, editorial). Ink, greys and silvers only (JAMES.md 7): colour comes from Hanzo's own model art.
   First screen: "Chasing the Pareto Frontier of AI" at display size, the lede tucked beside its short last line, and the
   frontier itself full-bleed underneath: it draws itself (time), Techstars '17 sits on it as a milestone, and a pointer
   over it reads the year under the hand (pointer).
   Signature: the six reasons Hanzo builds are tiles that open. Click one and the tile itself grows into a full sheet
   (shared-element morph, synchronized.studio); previous / next turn through the six inside it; it folds back on close.
   Supporting (three): the frontier draws itself and answers the pointer; the startups figure counts up on a rising
   staircase of figures; the core team's commits land in the one dark middle room, the newest pulsing.
   Beyond: "Pick two? Keep all four." The lede's four trade-offs as switches; nothing switches anything else off, and
   each shows the line on this page that holds it.
   Every word, figure and link is Hanzo's (content/live/about.json). */
// Persona: a buyer, founder or engineer checking who is behind Hanzo (arrives from the footer, /history or search)
// Goal: believe the team and its record, then start building
// CTA: Get Started (/pricing) in the hero, after the track record and in the sticky ask; the close repeats the careers ask
// Metric: signup_start (data-cta="about.*")
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Count } from '../ui';
import { A, Img, Tabs, TabPanel } from '../kit';
import StoryClose from './StoryClose';
import Sigil from '../Sigil';
import { useOpener } from '../Opener';
import { href } from '../../lib/route';
import Lines from '../v2/Lines';
import Unfold from '../v2/Unfold';
import '../v2/system.css';
import './story.css';
import './About.css';

const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Link2 = ({ to, children }) => <A to={to} className="v2s-link"><span>{children}</span><Arr /></A>;
const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const TL = ({ to, children }) => <A to={to} className="v2s-tlink">{children}<Chev /></A>;
const pad = (n) => String(n).padStart(2, '0');

/* ---------- the frontier: one curve, four ghost axes under it ---------- */
const W = 1600, H = 340, PL = 28, PR = 64, PT = 30, PB = 54;
const f = (t) => 1 - Math.pow(1 - t, 2.2);
const X = (t) => PL + t * (W - PL - PR);
const Y = (v) => H - PB - v * (H - PB - PT);
const trace = (g) => Array.from({ length: 81 }, (_, i) => { const t = i / 80; return (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(g(t)).toFixed(1); }).join('');
const FRONT = trace(f);
const AXES = [
  ['Intelligence', 0.42, 1.6, 0.3],
  ['Speed', 0.55, 1.2, 0.44],
  ['Deterministic safety', 0.66, 2.1, 0.58],
  ['Equitable cost', 0.78, 1.4, 0.72],
].map(([name, a, q, at]) => { const g = (t) => f(t) * (a + (1 - a) * Math.pow(t, q)); return { name, d: trace(g), lx: X(at), ly: Y(g(at)) + 24 }; });
const YEARS = [2014, 2016, 2018, 2020, 2022, 2024, 2026];

function Frontier() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  const p = useMotionValue(0); // the same on server and client; reduced motion jumps it to the end before first paint
  useLayoutEffect(() => { if (calm) p.set(1); }, [calm, p]);
  const hx = useTransform(p, (v) => X(v));
  const hy = useTransform(p, (v) => Y(f(v)));
  const ax = useTransform(p, [0.25, 0.6], [0, 1]);
  const ts = useTransform(p, [0.24, 0.3], [0, 1]); // Techstars '17 lands as the head passes 2017
  // pointer: the hand reads the year under it, on the curve
  const hand = useMotionValue(-1);
  const cx = useTransform(hand, (t) => X(Math.max(0, t)));
  const cy = useTransform(hand, (t) => Y(f(Math.max(0, t))));
  const [yr, setYr] = useState(null);
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width * W - PL) / (W - PL - PR)));
    hand.set(t);
    const y = Math.round(2014 + t * 12);
    setYr((v) => (v === y ? v : y));
  };
  // idle: the curve draws itself, holds at the frontier, and draws again; only while it is on screen
  useEffect(() => {
    if (calm) { p.set(1); return; }
    if (!seen) return;
    const c = animate(p, [0, 1, 1], { duration: 9, times: [0, 0.45, 1], ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0.3 });
    return () => c.stop();
  }, [seen, calm, p]);
  return (
    <div className={'xab-front-w' + (yr ? ' read' : '')} ref={ref} onPointerMove={move} onPointerLeave={() => setYr(null)} data-cursor="">
      <svg className="xab-front-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" role="img" aria-label="The Pareto frontier: intelligence, speed, deterministic safety and equitable cost, advancing together from 2014 to 2026">
        {[0.25, 0.5, 0.75, 1].map((v) => <line key={v} x1={0} x2={W} y1={Y(v)} y2={Y(v)} className="xab-grid" />)}
        <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} className="xab-base" />
        {YEARS.map((yr) => { const x = X((yr - 2014) / 12); return <g key={yr} className="xab-tick"><line x1={x} x2={x} y1={Y(0)} y2={Y(0) + 10} /><text x={x} y={H - 18} textAnchor="middle">{yr}</text></g>; })}
        {AXES.map((a) => (
          <g key={a.name}>
            <motion.path d={a.d} className="xab-ghost" style={{ pathLength: p }} />
            <motion.text x={a.lx} y={a.ly} className="xab-axis" style={{ opacity: ax }}>{a.name}</motion.text>
          </g>
        ))}
        <motion.path d={FRONT} className="xab-line" style={{ pathLength: p }} />
        <motion.g className="xab-ts" style={{ opacity: ts }}>
          <circle cx={X(0.25)} cy={Y(f(0.25))} r="7" />
          <line x1={X(0.25)} x2={X(0.25)} y1={Y(f(0.25)) - 14} y2={Y(f(0.25)) - 46} />
          <text x={X(0.25)} y={Y(f(0.25)) - 58} textAnchor="middle">Techstars ’17</text>
        </motion.g>
        <motion.g className="xab-hand" style={{ x: cx }} aria-hidden="true">
          <line x1="0" x2="0" y1={PT - 10} y2={Y(0)} />
          <text x="10" y={PT + 8}>{yr}</text>
        </motion.g>
        <motion.circle className="xab-hand-dot" r="8" cx={cx} cy={cy} />
        <motion.g style={{ x: hx, y: hy }}>
          <circle r="26" className="xab-halo" />
          <circle r="10" className="xab-head" />
        </motion.g>
      </svg>
    </div>
  );
}

/* ---------- 1. the first screen ---------- */
function Hero() {
  return (
    <section className="xab-hero" aria-labelledby="xab-h1" data-ask-name="About">
      <div className="v2s-wrap xab-hero-top">
        <Lines as="h1" id="xab-h1" className="v2s-display xab-h1" now delay={0.05} lines={['Chasing the', 'Pareto Frontier', 'of AI']} />
        <motion.div className="xab-hero-side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.55 }}>
          <p className="v2s-lede">From SKULLY and open-source commerce, through Techstars ’17, to 1700+ open repositories and the sovereign AI cloud today — advancing intelligence, speed, deterministic safety, and equitable cost together.</p>
          <div className="v2s-acts">
            <A to="/pricing" className="v2s-btn solid" data-thumb="Get Started" data-cta="about.hero">Get Started</A>
            <TL to="/history">Our History</TL>
            <TL to="/open-source">Open Source</TL>
          </div>
        </motion.div>
      </div>
      <Frontier />
    </section>
  );
}

/* ---------- 2. why we build: the statement, the four switches (Beyond) and the six tiles that open (Signature) ---------- */
const PILLARS = [
  ['Safety in AI', 'Deterministic verification over guesswork', 'Generative models drift and hallucinate when left unchecked. We pair frontier reasoning with Kai calibrated discrete decision models, formal policy gates, and sandboxed execution so autonomous agents stay bounded in production.', 'Safety research', '/research'],
  ['Frontier Performance', 'Bare-metal C, CUDA, and Metal runtimes', 'Speed is an architectural choice. From Hanzo Engine’s zero-Python inference kernels and Kai’s decisions, which write no text, to Enso’s learned multi-model routing, every layer is engineered to maximize intelligence per millisecond.', 'Live benchmarks', '/benchmarks'],
  ['Equitable Access', 'Frontier capability without hyperscaler tax', 'Breakthrough AI cannot belong only to trillion-dollar incumbents. By routing each task to the most efficient model, publishing open weights, and pricing compute fairly, we put startups, researchers, and builders on equal footing.', 'Transparent pricing', '/pricing'],
  ['Open Source', '1700+ public repositories since 2014', 'Our engines, agent SDKs, MCP servers, UI kits, and Hanzo Improvement Proposals (HIPs) are developed in the open. Anyone can inspect the code, verify how decisions are made, fork the stack, and contribute.', 'Browse repositories', '/open-source'],
  ['Privacy by Architecture', 'No training without your say', 'Business and API accounts are never used to train shared models unless an administrator or a written agreement says so, and a personal account only if you turn it on. Organizations sit in isolated tenant databases with scoped HKDF-SHA256 keys, local-first CLI workflows, and strict gateway identity stripping.', 'Security & trust', '/trust'],
  ['Ownership & Sovereignty', 'Cloud, private VPC, on-prem, or air-gapped', 'If you cannot move your weights, memory, and runtime onto your own hardware, you are renting your intelligence. Hanzo runs identically on our global cloud, inside your VPC, or completely air-gapped on your own GPUs.', 'Explore platform', '/platform'],
];
const ang = (i) => -Math.PI / 2 + (i * Math.PI) / 3;
const pt = (i, k) => (200 + Math.cos(ang(i)) * 150 * k).toFixed(1) + ',' + (200 + Math.sin(ang(i)) * 150 * k).toFixed(1);

/* six axes, the one this pillar stands for pushed out to the edge */
function Radar({ at }) {
  const ring = (k) => PILLARS.map((_, i) => pt(i, k)).join(' ');
  const shape = PILLARS.map((_, i) => pt(i, i === at ? 1 : 0.56)).join(' ');
  const [sx, sy] = pt(at, 1).split(',');
  return (
    <svg viewBox="-30 -20 460 440" className="xab-radar" aria-hidden="true">
      {[0.34, 0.67, 1].map((k) => <polygon key={k} points={ring(k)} className="xab-ring" />)}
      {PILLARS.map((_, i) => { const [x, y] = pt(i, 1).split(','); return <line key={i} x1="200" y1="200" x2={x} y2={y} className="xab-ring" />; })}
      <polygon points={shape} className="xab-shape" />
      <line x1="200" y1="200" x2={sx} y2={sy} className="xab-spoke" />
      <circle cx={sx} cy={sy} r="9" className="xab-dot" />
    </svg>
  );
}

const PICKS = [
  ['Raw capability', '…every layer is engineered to maximize intelligence per millisecond.', 'Frontier Performance', '/benchmarks'],
  ['Low latency', 'Speed is an architectural choice.', 'Bare-metal C, CUDA, and Metal runtimes', '/benchmarks'],
  ['Affordable cost', '…routing each task to the most efficient model, publishing open weights, and pricing compute fairly…', 'Equitable Access', '/pricing'],
  ['Control over your data', 'Hanzo runs identically on our global cloud, inside your VPC, or completely air-gapped on your own GPUs.', 'Ownership & Sovereignty', '/platform'],
];

function Picks() {
  const [on, setOn] = useState([0, 1]);
  const [touched, setTouched] = useState(false);
  const flip = (i) => { setTouched(true); setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i])); };
  const all = on.length === PICKS.length;
  // until a hand touches them, the next switch still off breathes, asking to be kept too
  const hint = touched ? -1 : PICKS.findIndex((_, i) => !on.includes(i));
  return (
    <div className="xab-picks">
      <ul>
        {PICKS.map(([t, q, from, to], i) => (
          <li key={t} className={(on.includes(i) ? 'on' : '') + (i === hint ? ' hint' : '')}>
            <button type="button" role="switch" aria-checked={on.includes(i)} onClick={() => flip(i)}>
              <span className="xab-sw" aria-hidden="true" />
              <span className="v2s-title">{t}</span>
            </button>
            <p>{q}</p>
            <Link2 to={to}>{from}</Link2>
          </li>
        ))}
      </ul>
      <p className={'xab-picks-sum' + (all ? ' all' : '')} aria-live="polite">
        {all && <b>Chasing the Pareto frontier means advancing every axis at once through better systems engineering and open research.</b>}
      </p>
    </div>
  );
}

const SPANS = ['xab-s7', 'xab-s5', 'xab-s5', 'xab-s7', 'xab-s8', 'xab-s4'];

function Tile({ p, i, cue, onOpen }) {
  const [t, k, d, l, to] = p;
  return (
    <li className={SPANS[i]}>
      <motion.button type="button" layoutId={'xab-p' + i} className={'xab-tile' + (cue ? ' cue' : '')} style={{ borderRadius: 28 }} onClick={() => onOpen(i)} aria-haspopup="dialog" data-cursor="Open" aria-label={`${t}: ${k}. Open`}>
        <span className="xab-tile-n v2s-num" aria-hidden="true">{pad(i + 1)}</span>
        <span className="xab-tile-art" aria-hidden="true"><Radar at={i} /></span>
        <span className="xab-tile-t" aria-hidden="true">
          <b>{t}</b>
          <span>{k}</span>
        </span>
        <span className="xab-tile-peek" aria-hidden="true">{d.split('. ')[0]}.</span>
        <span className="xab-tile-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
      </motion.button>
      {/* the full text stays in the page (hidden, so no invisible stops for the keyboard); the sheet is its reading view */}
      <div hidden>
        <h3>{t}</h3>
        <p>{k}</p>
        <p>{d}</p>
        <A to={to}>{l}</A>
      </div>
    </li>
  );
}

function Why() {
  const [open, setOpen] = useState(null);
  const [at, setAt] = useState(0);
  const [cue, setCue] = useState(0);
  const grid = useRef(null);
  const seen = useInView(grid, { amount: 0.35 });
  const calm = useReducedMotion();
  // idle: one tile at a time shows a line of what it holds, an invitation to open it
  useEffect(() => {
    if (!seen || calm || open != null) return;
    const t = setInterval(() => setCue((c) => (c + 1) % PILLARS.length), 2600);
    return () => clearInterval(t);
  }, [seen, calm, open]);
  const show = (i) => { setAt(i); setOpen(i); };
  // Tab stays inside the open sheet: from its last control back to its first, and the other way round
  const trap = (e) => {
    const box = document.querySelector('.v2u-sheet');
    if (!box) return;
    const f = [...box.querySelectorAll('a[href], button:not([disabled])')];
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1], here = document.activeElement;
    if (!box.contains(here)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && here === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && here === last) { e.preventDefault(); first.focus(); }
  };
  const step = (d) => setAt((a) => (a + d + PILLARS.length) % PILLARS.length);
  const [t, k, d, l, to] = PILLARS[at];
  return (
    <section className="v2s-sec xab-why" id="why" aria-labelledby="xab-why-h">
      <div className="v2s-wrap">
        <div className="v2s-head side xab-why-head">
          <p className="v2s-label">Why We Build</p>
          <h2 id="xab-why-h" className="v2s-headline xab-why-h">Moving the frontier without trading away safety, privacy, or ownership.</h2>
          <p className="v2s-lede xab-why-l">Most AI platforms ask you to pick two: raw capability, low latency, affordable cost, or control over your data. Chasing the Pareto frontier means advancing every axis at once through better systems engineering and open research.</p>
        </div>
        <Picks />
        <ul className="xab-tiles" ref={grid}>
          {PILLARS.map((p, i) => <Tile key={p[0]} p={p} i={i} cue={cue === i && open == null} onOpen={show} />)}
        </ul>
      </div>
      <Unfold layoutId={open == null ? null : 'xab-p' + open} onClose={() => setOpen(null)} label={t} className="xab-sheet" onKey={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'Tab') trap(e); }}>
        <div className="xab-sheet-g">
          <div className="xab-sheet-a">
            <p className="xab-sheet-n v2s-num" aria-hidden="true">{pad(at + 1)}</p>
            <Radar at={at} />
          </div>
          <motion.div className="xab-sheet-t" key={at} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <h3 className="v2s-headline">{t}</h3>
            <p className="v2s-lede xab-sheet-k">{k}</p>
            <p className="v2s-body">{d}</p>
            <Link2 to={to}>{l}</Link2>
          </motion.div>
        </div>
        <div className="xab-sheet-f">
          <button type="button" className="xab-step" onClick={() => step(-1)}><span aria-hidden="true">←</span> {PILLARS[(at + 5) % 6][0]}</button>
          <span className="xab-step-n v2s-num" aria-hidden="true">{pad(at + 1)} / {pad(PILLARS.length)}</span>
          <button type="button" className="xab-step" onClick={() => step(1)}>{PILLARS[(at + 1) % 6][0]} <span aria-hidden="true">→</span></button>
        </div>
      </Unfold>
    </section>
  );
}

/* ---------- 3. the track record: three figures climbing like the frontier ---------- */
const MILES = [
  ['2014', 'SKULLY and open-source commerce'],
  ['2017', 'Techstars ’17'],
  ['2024', 'Damon Motors and Triller listing on Nasdaq'],
  ['2026', '1700+ open repositories and the sovereign AI cloud'],
];

function Record() {
  return (
    <section className="v2s-sec xab-rec" aria-labelledby="xab-rec-h">
      <div className="v2s-wrap">
        <div className="v2s-head">
          <p className="v2s-label">Proven Track Record</p>
          <h2 id="xab-rec-h" className="v2s-headline">Built with founders, scaled to public markets.</h2>
        </div>
        <dl className="xab-figs">
          <div><dt className="v2s-num"><Count to={100} suffix="+" duration={1.8} /></dt><dd>Startups built &amp; funded</dd></div>
          <div><dt className="v2s-num">$1B+</dt><dd>Client revenue generated</dd></div>
          <div><dt className="v2s-num">2024</dt><dd>Went public on Nasdaq (2024)</dd></div>
        </dl>
        <ol className="xab-miles">
          {MILES.map(([y, t]) => <li key={y}><b className="v2s-num">{y}</b><span>{t}</span></li>)}
        </ol>
        <div className="v2s-grid xab-rec-foot">
          <p className="v2s-body v2s-c-1-7">From SKULLY and open-source commerce through Techstars ’17 to Damon Motors and Triller listing on Nasdaq in 2024, Hanzo has engineered sovereign commerce and AI systems for hundreds of venture-backed companies. Read the complete 2014–2026 archive on our history page, or start building today.</p>
          <div className="v2s-acts v2s-c-8-12 xab-rec-acts">
            <A to="/pricing" className="v2s-btn solid" data-cta="about.record">Start Building</A>
            <TL to="/history">Read Our Full History</TL>
            <TL to="/customers">Customer Stories</TL>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. the founders: a portrait wall ---------- */
const FOUNDERS = [
  { name: 'Antje Worring', mono: 'AW', img: '/authors/antje-worring-portrait.jpg', role: 'Chief Executive Officer and co-founder', bio: 'Leads Hanzo’s strategy, enterprise partnerships and sovereign AI deployments.', links: [['Website', 'https://antjeworr.ing'], ['X', 'https://x.com/antjeworring'], ['GitHub', 'https://github.com/zooqueen'], ['LinkedIn', 'https://www.linkedin.com/in/antje-worring/']] },
  { name: 'Zach Kelling', mono: 'ZK', img: '/authors/zach-kelling-portrait.jpg', role: 'Chief Technology Officer and founder', bio: 'Builds Hanzo’s AI cloud, its engine runtimes and its agent frameworks. A long-time open-source author.', links: [['Website', 'https://zeekay.io'], ['X', 'https://x.com/zeekay'], ['GitHub', 'https://github.com/zeekay'], ['LinkedIn', 'https://www.linkedin.com/in/zeekay/']] },
];

function Portrait({ p }) {
  const img = useRef(null);
  const [state, setState] = useState('wait');
  useEffect(() => { const el = img.current; if (el?.complete) setState(el.naturalWidth ? 'ok' : 'none'); }, []);
  return (
    <figure className={'xab-pic ' + state}>
      <span className="xab-mono" aria-hidden="true">{p.mono}</span>
      <Img ref={img} src={p.img} alt={p.name} w={640} h={800} onLoad={() => setState('ok')} onError={() => setState('none')} />
    </figure>
  );
}

function Founders() {
  return (
    <section className="v2s-sec tight xab-people" aria-label="Founders">
      <div className="v2s-wrap xab-people-g">
        {FOUNDERS.map((p, i) => (
          <article key={p.name} className={'xab-person' + (i ? ' two' : '')}>
            <Portrait p={p} />
            <h3 className="v2s-headline">{p.name}</h3>
            <p className="xab-role">{p.role}</p>
            <p className="v2s-body">{p.bio}</p>
            <ul className="xab-socials">{p.links.map(([l, to]) => <li key={l}><A to={to}>{l} <span aria-hidden="true">↗</span></A></li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. the Zen of Hanzo: an index and its plate ---------- */
const ZEN = [
  ['Enable the Underdog', 'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.'],
  ['Data-Driven Everything', 'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.'],
  ['Open Innovation', 'Be open, share often. Openness accelerates growth—both for the company and its community.'],
  ['Adaptability', 'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.'],
  ['Customer-Centric Growth', 'Treat each client as a long-term partner and guide them to success.'],
  ['First Principles Thinking', 'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.'],
];

function Zen() {
  const [at, setAt] = useState(0);
  const [hold, setHold] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || hold || calm) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % ZEN.length), 4200);
    return () => clearTimeout(t);
  }, [seen, hold, calm, at]);
  const pick = (i) => { setAt(i); setHold(true); };
  return (
    <section className="v2s-sec xab-zen" id="zen" aria-labelledby="xab-zen-h">
      <div className="v2s-wrap">
        <div className="v2s-head side xab-zen-head">
          <p className="v2s-label">Operating Principles</p>
          <h2 id="xab-zen-h" className="v2s-display xab-zen-h">The Zen of Hanzo</h2>
          <div className="xab-zen-l">
            <p className="v2s-lede">The principles the company argues from when a decision is close.</p>
            <Link2 to="/philosophy">Explore the full Zen manifesto</Link2>
          </div>
        </div>
        <div className="v2s-grid xab-zen-g" ref={box} onPointerLeave={() => setHold(false)}>
          <ol className="v2s-c-1-6 xab-zen-list">
            {ZEN.map(([t, d], i) => (
              <li key={t} className={i === at ? 'on' : ''}>
                <button type="button" aria-pressed={i === at} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onFocus={() => pick(i)}>
                  <span className="v2s-num" aria-hidden="true">{pad(i + 1)}</span>
                  <b>{t}</b>
                </button>
                <p className="xab-zen-d">{d}</p>
              </li>
            ))}
          </ol>
          <div className="v2s-c-7-12 xab-zen-plate" aria-hidden="true">
            {ZEN.map(([t, d], i) => (
              <div key={t} className={'xab-zen-card' + (i === at ? ' on' : '')}>
                <span className="xab-zen-n v2s-num">{pad(i + 1)}</span>
                <b className="v2s-title">{t}</b>
                <p className="v2s-lede">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. the dark room: open source, deterministic safety, and the commits as they land ---------- */
const COMMITS = [
  ['hanzoai/ui', 'Merge pull request #737373 from hanzoai/fix/footer-signature-no-crop', 'b44e122', 'Nov 6, 06:04 UTC', 'https://github.com/hanzoai/ui/commit/b44e1221957bb7e96d3c82c509109bb98300c92a'],
  ['hanzoai/desktop', 'chore(desktop): finalize 1.1.53 skin, guest/LSA integration, and UI primitive repairs', 'ddfcd04', 'Nov 6, 05:53 UTC', 'https://github.com/hanzoai/desktop/commit/ddfcd04565afa1b27a6480fd7fc2a9de0ec84e94'],
  ['hanzoai/desktop', 'Update css', 'e749213', 'Nov 6, 05:39 UTC', 'https://github.com/hanzoai/desktop/commit/e7492134d79dc3c7c1def579a2305cba7c8092f5'],
  ['hanzoai/desktop', "feat(desktop): hanzo.ai's app stack, macOS window controls, and the window's own skin", '421d4f2', 'Nov 6, 05:39 UTC', 'https://github.com/hanzoai/desktop/commit/421d4f233bd6516367293b496c6000c3a2219cde'],
  ['hanzoai/ui', 'fix(footer): keep full Hanzo wordmark and punctuation visible at responsive widths', '72c079f', 'Nov 6, 05:20 UTC', 'https://github.com/hanzoai/ui/commit/72c079f77bf1683373a719f575f3541006c72457'],
  ['hanzoai/homebrew-tap', 'hanzo 8.5.910', '098a650', 'Nov 6, 05:10 UTC', 'https://github.com/hanzoai/homebrew-tap/commit/098a650e94d36cbf48af446d647845ff90686929'],
];

const PANES = [
  ['1700+ Open Repositories', 'Auditable infrastructure from kernel to interface', 'Since open-sourcing our commerce architecture in 2014, we have published over 1700 public repositories. From C/CUDA/Metal inference engines to agent compilers, MCP tools, and cross-platform UI kits, our stack is built to be read, audited, and extended.',
    [['Zero Proprietary Lock-In:', 'Export and run models, agents, and state on your own hardware without rewriting application code.'], ['HIP Standards:', 'Core protocols and architectures published openly through Hanzo Improvement Proposals.'], ['Shared Ecosystem:', 'MCP servers, skills, UI primitives, and inference runtimes built in public with contributors worldwide.']], 'Explore Open Source Ecosystem', '/open-source'],
  ['Deterministic Safety Bounds', 'Calibrated decisions, not guesswork', 'Unconstrained token generators drift in high-stakes workflows. Hanzo puts calibrated decisions (Kai), policy checks and isolated sandboxes in front of any autonomous agent that touches production data or billing.',
    [['Policy Governance:', 'Policy checks stop a tool call or a change your policy refuses before it is sent.'], ['Sovereign & Air-Gapped:', 'Run inside your own VPC or offline cluster with zero external telemetry or third-party relays.'], ['Calibrated Confidence:', 'Kai returns calibrated probability distributions and defers cleanly when evidence is insufficient.']], 'Read Our Safety Research', '/research'],
];

function Log() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div className={'xab-log' + (seen ? ' in' : '')} ref={ref}>
      <div className="xab-log-h">
        <h3 className="v2s-title">Proof of Work: Recent Commits by Our Core Team</h3>
        <p><span className="xab-live" aria-hidden="true" />Public Activity <b>1700+ repositories</b> <A to="https://github.com/hanzoai">github.com/hanzoai</A></p>
      </div>
      <ul>
        {COMMITS.map(([repo, msg, sha, when, to], i) => (
          <li key={sha + i} style={{ '--i': COMMITS.length - 1 - i }}>
            <span className="xab-repo">{repo}</span>
            <A to={to} className="xab-msg">{msg}</A>
            <code>{sha}</code>
            <time>{when}</time>
          </li>
        ))}
      </ul>
      <div className="xab-log-f">
        <p>Every line written, reviewed, and shipped in the open by Hanzo engineers.</p>
        <A to="/open-source" className="v2s-btn">View Open Source Dashboard</A>
      </div>
    </div>
  );
}

function Open() {
  const [pane, setPane] = useState(0); // one pane at a time: the open code, or the safety bounds
  return (
    <section className="v2s-sec xab-open" data-room="dark" aria-labelledby="xab-open-h">
      <div className="v2s-wrap">
        <div className="v2s-head">
          <p className="v2s-label">Open Source &amp; Deterministic Safety</p>
          <h2 id="xab-open-h" className="v2s-display xab-open-h">Verifiable code. <span className="xab-dim">Calibrated decisions.</span></h2>
          <p className="v2s-lede xab-open-l">Opaque black-box platforms ask you to trust what you cannot inspect. Hanzo pairs public source code and open specifications with calibrated decision bounds and full infrastructure sovereignty.</p>
        </div>
        <div className="xab-open-g">
          <div className="xab-panes">
            <Tabs id="xab-pane" tabs={PANES.map((x) => x[0])} value={pane} onChange={setPane} label="Open Source & Deterministic Safety" size="lg" />
            {PANES.map(([t, k, d, items, l, to], i) => (
              <TabPanel key={t} id="xab-pane" i={i} value={pane} className="xab-pane">
                <p className="xab-pk">{k}</p>
                <p className="v2s-body">{d}</p>
                <ul>{items.map(([b, s]) => <li key={b}><b>{b}</b> {s}</li>)}</ul>
                <Link2 to={to}>{l}</Link2>
              </TabPanel>
            ))}
          </div>
          <Log />
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. models and papers ---------- */
const RUNTIMES = [
  { name: 'Kai', kind: 'Decision Intelligence', d: 'Calibrated discrete decision model for autonomous agent loops. Factorized discrete choice, calibrated probability distributions, and deterministic policy governance.', tag: 'No output tokens · Calibrated confidence', to: '/kai', slug: 'kai' },
  { name: 'Zen Multimodal', kind: 'Foundation Models', d: 'Multimodal reasoning models across text, code, vision, speech, and structured output, built for both low-power edge devices and sovereign GPU clusters.', tag: 'High token throughput · Edge & Cloud', to: '/zen', slug: 'zen' },
  { name: 'Hanzo Engine', kind: 'Inference Runtime', d: 'Bare-metal C, CUDA, and Metal inference engine with speculative decoding and NVFP4/FP8 kernels, removing Python runtime overhead on production hardware.', tag: 'Zero Python runtime · C / CUDA / Metal', to: '/engine' },
  { name: 'Enso Router', kind: 'Semantic Routing', d: 'Learned semantic router and multi-model coordinator (HIP-0510) that sends each prompt to a model by accuracy and cost.', tag: 'Learned arbitration · Accuracy & cost', to: '/enso', slug: 'enso' },
];

function Runtime({ m }) {
  const box = useRef(null);
  const opener = useOpener();
  // the card's own picture lifts into the model page (WebGL opener); Hanzo Engine has no film, so its plate is its contour field
  const open = m.slug ? (e) => opener?.open(e, { el: box.current, src: `/models/${m.slug}.webp`, href: m.to, key: m.slug }) : undefined;
  return (
    <li>
      <a href={href(m.to)} ref={box} data-card={m.slug} className={'xab-rt' + (m.slug ? '' : ' plain')} onClick={open}>
        <span className="xab-rt-media" aria-hidden="true">
          {m.slug ? <Img src={`/models/${m.slug}.webp`} w={1200} h={1500} /> : <Sigil seed={m.name} className="xab-rt-sigil" />}
        </span>
        <span className="xab-rt-t">
          <h4 className="v2s-title">{m.name}</h4>
          <span className="xab-rt-k">{m.kind}</span>
          <span className="xab-rt-d">{m.d}</span>
          <span className="xab-rt-g">{m.tag}</span>
          <span className="xab-rt-go">Details <Arr /></span>
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
    <section className="v2s-sec xab-research" aria-labelledby="xab-res-h">
      <div className="v2s-wrap">
        <div className="v2s-head side">
          <p className="v2s-label">Frontier Models &amp; Research</p>
          <h2 id="xab-res-h" className="v2s-headline">Original architectures, engines, and published research.</h2>
          <p className="v2s-lede xab-res-l">Rather than wrapping third-party endpoints, Hanzo designs decision models, semantic routers, bare-metal inference engines, and open research on verifiable agent safety.</p>
        </div>
        <div className="xab-row-h">
          <h3 className="v2s-kick">Models &amp; Runtimes</h3>
          <Link2 to="/models">View Model Catalog</Link2>
        </div>
        <ul className="xab-rts">{RUNTIMES.map((m) => <Runtime key={m.name} m={m} />)}</ul>
        <div className="xab-row-h xab-papers-h">
          <h3 className="v2s-kick">Selected Papers &amp; Technical Writing</h3>
          <div className="xab-row-links"><Link2 to="/research">Papers</Link2><Link2 to="/blog">Blog</Link2></div>
        </div>
        <ul className="xab-papers">
          {PAPERS.map(([kind, when, t, d, to]) => (
            <li key={t}>
              <A to={to} className="xab-paper">
                <span className="xab-paper-m"><span>{kind}</span><time>{when}</time></span>
                <span className="xab-paper-t v2s-title" data-morph>{t}</span>
                <span className="xab-paper-d">{d}</span>
                <span className="xab-paper-go">Read publication <Arr /></span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 8. careers: the close ---------- */
const ROLES = [
  ['Distributed Systems & Inference', 'Scaling bare-metal C/CUDA/Metal kernels, multi-node GPU clusters, and sovereign inference clouds.'],
  ['AI Safety & Formal Verification', 'Advancing calibrated discrete decision models (Kai), verification graphs, and deterministic policy bounds.'],
  ['Open Agent Compilers & Tools', 'Building MCP infrastructure, linkage memory, and local-first developer tools used across the ecosystem.'],
];

/* three tracks, one frontier: each role is a line that ends at the same head; a hand on a role lights its line */
const TRACKS = [[0.5, 1.5], [0.62, 1.1], [0.74, 2]].map(([a, q]) => trace((t) => f(t) * (a + (1 - a) * Math.pow(t, q))));

function Careers() {
  const [on, setOn] = useState(-1);
  return (
    <>
      <section className="v2s-sec tight xab-careers" aria-label="Careers at Hanzo">
        <div className="v2s-wrap xab-car-g">
          <p className="v2s-label">Careers at Hanzo</p>
          <ol className="xab-roles" onPointerLeave={() => setOn(-1)}>
            {ROLES.map(([t, d], i) => (
              <li key={t} className={on === i ? 'on' : ''} onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(-1)} tabIndex={0}>
                <span className="v2s-num" aria-hidden="true">{pad(i + 1)}</span>
                <div><h3 className="v2s-title">{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
          <div className={'xab-tracks' + (on >= 0 ? ' lit' : '')} aria-hidden="true">
            <svg viewBox={`${PL} ${PT} ${W - PL - PR} ${H - PT - PB}`} preserveAspectRatio="none">
              <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} className="xab-base" />
              {TRACKS.map((d, i) => <path key={i} d={d} className={'xab-track' + (on === i ? ' on' : '')} />)}
              <path d={FRONT} className="xab-line" />
            </svg>
            <i className="xab-tracks-head" />
          </div>
        </div>
      </section>
      <StoryClose
        cta="about.band"
        title="Push the Pareto frontier with us."
        lede="We hire systems programmers, AI safety researchers, and product engineers who care about open source, equitable access, privacy, and sovereign ownership. High autonomy, zero bureaucracy, and code that ships in public."
        action="Explore Open Roles"
        to="/careers"
        note={<p className="x-band-note xab-band-note"><A to="/team">Meet the Team</A><A to="/open-source">Browse Code on GitHub</A></p>}
      />
    </>
  );
}

export default function About() {
  return (
    <main className="xab v2s">
      {/* JavaScript off: every line and the curve show at rest */}
      <noscript><style>{'.xab .v2-line>span,.xab-hero-side{transform:none!important;opacity:1!important}.xab-line{stroke-dasharray:none!important}.xab-ghost{display:none}'}</style></noscript>
      <Hero />
      <Why />
      <Record />
      <Founders />
      <Zen />
      <Open />
      <Research />
      <Careers />
    </main>
  );
}
