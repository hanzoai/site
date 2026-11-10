'use client';
/* About, v4 (8 Nov, Zack's pages): the frame layer (Frame.css) over v3. Every section reads in one frame at 1470 x 801;
   split headings, Hanzo's halftone lit from a corner per section, the open-source room as the page's dark room (it
   opens like a curtain), the four runtimes as lit plates that tilt in, and a close on Try Hanzo and Book a call.
   About, v3 (Story archetype, editorial). Ink, greys and silvers only (JAMES.md 7): colour comes from Hanzo's own model art.
   First screen: "Chasing the Pareto Frontier of AI" at display size, the lede tucked beside its short last line, and the
   frontier itself full-bleed underneath: it draws itself (time), Techstars '17 sits on it as a milestone, and a pointer
   over it reads the year under the hand (pointer).
   Signature: the six reasons Hanzo builds are tiles that open. Click one and the tile itself grows into a full sheet
   (shared-element morph, synchronized.studio); previous / next turn through the six inside it; it folds back on close.
   Supporting (three): the frontier draws itself and answers the pointer; the startups figure counts up on a rising
   staircase of figures. Motion map (James, 7 Nov): signature word-light (about/WordLight.jsx) and five section entrances
   (about/enter.js); no pinned scene.
   Beyond: "Pick two? Keep all four." The lede's four trade-offs as switches; nothing switches anything else off, and
   each shows the line on this page that holds it.
   Every word, figure and link is Hanzo's (content/live/about.json). */
// Persona: a buyer, founder or engineer checking who is behind Hanzo (arrives from the footer, /history or search)
// Goal: believe the team and its record, then start building
// CTA: Get Started (/pricing) in the hero and in the sticky ask ("Start Building" after the track record is a text link); the page closes on Try Hanzo (/signup) and Book a call (cal.com/hanzo), Zack 8 Nov
// Metric: signup_start (data-cta="about.*")
// Signature: word-light on the pick-two belief (lit word by word as read), then six reasons Hanzo builds that open into their own sheet
// Beyond: pick two? keep all four: the lede's four trade-offs as switches that never knock each other off
// V2: 8/10 motion map: signature word-light (the Why belief statement lights word by word as it is read; a hand reads ahead); entrances ink-spread (Why figure + switches + principles), magnet-gather (track record), squash-land (founders), letter-cascade (Zen of Hanzo, now a plain index, no pinned scene), accordion (the dark room); phone chart labels clear of the curve
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Count } from '../ui';
import { A, Cta, Img, Tabs, TabPanel } from '../kit';
import StoryPause from './StoryPause';
import Sigil from '../Sigil';
import { useOpener } from '../Opener';
import { href } from '../../lib/route';
import StorySheet from './StorySheet';
import Zen from './AboutZen';
import WordLight from './about/WordLight';
import { useEntrances } from './about/enter';
import '../v2/system.css';
import './story.css';
import './Frame.css';
import './About.css';

const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Link2 = ({ to, children }) => <Cta to={to} kind="link">{children}</Cta>;
const TL = ({ to, children }) => <Cta to={to} kind="link">{children}</Cta>;
const pad = (n) => String(n).padStart(2, '0');

/* ---------- the frontier: one curve, four ghost axes under it ---------- */
const W = 1600, H = 340, PL = 28, PR = 64, PT = 30, PB = 54;
const f = (t) => 1 - Math.pow(1 - t, 2.2);
const X = (t) => PL + t * (W - PL - PR);
const Y = (v) => H - PB - v * (H - PB - PT);
const trace = (g) => Array.from({ length: 81 }, (_, i) => { const t = i / 80; return (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(g(t)).toFixed(1); }).join('');
const FRONT = trace(f);
const YEARS = [2014, 2016, 2018, 2020, 2022, 2024, 2026];

/* phones get the same frontier drawn on its own, taller plot, so the whole 2014–2026 curve, Techstars '17 and the four
   axis names fit 343px at a readable size (both plots are in the HTML; CSS shows one) */
// ph: the phone plot sets the four axis names as a right-aligned stack in the empty lower right of the plot (in the
// order their lines run), clear of the curve, the head and the plot's edges
const geo = (W, H, PL, PR, PT, PB, ph = false) => {
  const X = (t) => PL + t * (W - PL - PR);
  const Y = (v) => H - PB - v * (H - PB - PT);
  const tr = (g) => Array.from({ length: 81 }, (_, i) => { const t = i / 80; return (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(g(t)).toFixed(1); }).join('');
  const axes = [['Intelligence', 0.42, 1.6, 0.3], ['Speed', 0.55, 1.2, 0.44], ['Deterministic safety', 0.66, 2.1, 0.58], ['Equitable cost', 0.78, 1.4, 0.72]]
    .map(([name, a, q, at], i) => { const g = (t) => f(t) * (a + (1 - a) * Math.pow(t, q)); return ph ? { name, d: tr(g), lx: X(1), ly: Y(0.12 + i * 0.11) } : { name, d: tr(g), lx: X(at), ly: Y(g(at)) + 24 }; });
  return { W, H, PT, X, Y, front: tr(f), axes, ph };
};
const DESK = geo(W, H, PL, PR, PT, PB);
const PH = geo(700, 470, 40, 44, 56, 60, true);

function Plot({ g, cls, children }) {
  const { W, H, X, Y, front, axes, ph } = g;
  const tx = X(0.25), ty = Y(f(0.25));
  return (
    <svg className={'xab-front-svg ' + cls} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" role="img" aria-label="The Pareto frontier: intelligence, speed, deterministic safety and equitable cost, advancing together from 2014 to 2026">
      {[0.25, 0.5, 0.75, 1].map((v) => <line key={v} x1={0} x2={W} y1={Y(v)} y2={Y(v)} className="xab-grid" />)}
      <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} className="xab-base" />
      {YEARS.map((yr) => { const x = X((yr - 2014) / 12); return <g key={yr} className="xab-tick"><line x1={x} x2={x} y1={Y(0)} y2={Y(0) + 10} /><text x={x} y={H - 18} textAnchor="middle">{yr}</text></g>; })}
      {axes.map((a) => (
        <g key={a.name}>
          <path d={a.d} className="xab-ghost" pathLength={1} />
          <text x={a.lx} y={a.ly} textAnchor={ph ? 'end' : undefined} className="xab-axis">{a.name}</text>
        </g>
      ))}
      <path d={front} className="xab-line" pathLength={1} />
      <g className="xab-ts">
        <circle cx={tx} cy={ty} r="7" />
        {ph
          ? <text x={tx - 16} y={ty - 46} textAnchor="end"><tspan x={tx - 16}>Techstars</tspan><tspan x={tx - 16} dy="30">’17</tspan></text> /* above and left of the marker, on two lines: the curve there runs below it */
          : <><line x1={tx} x2={tx} y1={ty - 14} y2={ty - 46} /><text x={tx} y={ty - 58} textAnchor="middle">Techstars ’17</text></>}
      </g>
      {children}
      {/* idle: a reader walks the curve from 2014 to the frontier, slowly, until a hand takes over */}
      <g className="xab-glide" style={{ offsetPath: `path('${front}')` }} aria-hidden="true">
        <line x1="0" x2="0" y1="-18" y2="18" />
        <circle r="6" />
      </g>
      {/* the head rides the curve on a CSS motion path, in step with the line's dash */}
      <g className="xab-ride" style={{ offsetPath: `path('${front}')` }}>
        <circle r="26" className="xab-halo" />
        <circle r="10" className="xab-head" />
      </g>
    </svg>
  );
}

function Frontier() {
  // the curve, its four ghost axes, Techstars '17 and the head all draw by CSS from first paint (About.css, xab-draw):
  // nothing waits on hydration, reduced motion and JS off show the drawn frontier at rest
  // pointer: the hand reads the year under it, on the curve
  const hand = useMotionValue(-1);
  const cx = useTransform(hand, (t) => X(Math.max(0, t)));
  const cy = useTransform(hand, (t) => Y(f(Math.max(0, t))));
  const [yr, setYr] = useState(null);
  const move = (e) => {
    if (e.pointerType !== 'mouse' || matchMedia('(max-width: 900px)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width * W - PL) / (W - PL - PR)));
    hand.set(t);
    const y = Math.round(2014 + t * 12);
    setYr((v) => (v === y ? v : y));
  };
  // after the draw it stays alive by CSS: the head breathes and a reader glides along the curve while no hand is on it.
  // Off screen both pause (a class set on the element, never React state, so the server HTML is the same)
  const wrap = useRef(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('off', !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={'xab-front-w' + (yr ? ' read' : '')} ref={wrap} onPointerMove={move} onPointerLeave={() => setYr(null)}>
      <Plot g={DESK} cls="dk">
        <motion.g className="xab-hand" style={{ x: cx }} aria-hidden="true">
          <line x1="0" x2="0" y1={PT - 10} y2={Y(0)} />
          <text x="10" y={PT + 8}>{yr}</text>
        </motion.g>
        <motion.circle className="xab-hand-dot" r="8" cx={cx} cy={cy} />
      </Plot>
      <Plot g={PH} cls="ph" />
    </div>
  );
}

/* ---------- 1. the first screen ---------- */
/* Phones keep Hanzo's "Try Hanzo" solid in the header; while this hero's own solid ask is on screen the header's
   button reads as an outline (the same html[data-ask=quiet] the shell sets on desktop), so one solid shows at a time
   (the /bounty pattern). */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 700px)');
    const el = document.querySelector('main.xab [data-cta="about.hero"]');
    // the close's solid "Try Hanzo": while it is on screen the header's ask is quiet at every width
    const band = document.querySelector('main.xab .xab-close [data-cta="about.try"]');
    if (!el) return;
    let mine = false, vis = false, inBand = false, t = 0;
    const apply = () => {
      if ((mq.matches && vis) || inBand) { H.dataset.ask = 'quiet'; mine = true; }
      else if (mine) { delete H.dataset.ask; mine = false; }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const bo = new IntersectionObserver(([e]) => { inBand = e.isIntersecting; apply(); });
    if (band) bo.observe(band);
    // the shell rewrites data-ask about 80 ms after the scroll settles on desktop; say it again after it while the band shows
    const onScroll = () => { clearTimeout(t); if (inBand) t = setTimeout(apply, 160); };
    addEventListener('scroll', onScroll, { passive: true });
    const timers = [300, 1400].map((ms) => setTimeout(apply, ms)); // after the shell's own first pass
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); bo.disconnect(); clearTimeout(t); removeEventListener('scroll', onScroll); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

const H1 = ['Chasing the', 'Pareto Frontier', 'of AI'];

function Hero() {
  useOneSolidOnPhone();
  // WCAG 2.2.2 (MASTER part 12): the hero's idle loops (the breathing head, the reader walking the curve) can be paused;
  // the button is first in the hero, tucked into the plot's lower right corner, and hidden under reduced motion
  const [paused, setPaused] = useState(false);
  return (
    <section className={'zf-sec xab-hero' + (paused ? ' paused' : '')} aria-labelledby="xab-h1" data-ask-name="About" data-morph-target>
      <StoryPause paused={paused} onToggle={() => setPaused((v) => !v)} className="xab-pause" />
      <div className="v2s-wrap xab-hero-top">
        {/* the h1 cuts in line by line from first paint (CSS, never waiting on hydration) */}
        <h1 id="xab-h1" className="v2s-display xab-h1">
          {H1.map((l, i) => <span key={l} className="xab-h1-ln"><span style={{ '--i': i }}>{l}{i < H1.length - 1 ? ' ' : ''}</span></span>)}
        </h1>
        <div className="xab-hero-side">
          <p className="v2s-lede">From venture building and open-source commerce, through Techstars ’17, to 1700+ open repositories and the sovereign AI cloud today — advancing intelligence, speed, deterministic safety, and equitable cost together.</p>
          <div className="v2s-acts">
            <Cta to="/pricing" id="about.hero" thumb>Get Started</Cta>
            <TL to="/history">Our History</TL>
            <TL to="/open-source">Open Source</TL>
          </div>
        </div>
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

/* the one figure of the section: the four trade-offs as a diamond. A switch kept pushes its corner out to the edge; all
   four kept is the full frontier. A hand on a principle in the index swaps the diamond for that principle's own radar */
const DIA = PICKS.map((_, i) => -Math.PI / 2 + (i * Math.PI) / 2);
const dpt = (i, k) => [200 + Math.cos(DIA[i]) * 160 * k, 200 + Math.sin(DIA[i]) * 160 * k];
// corner names: top and bottom centred on their corner, the side ones set above their corner, inside the frame
const DLAB = [[200, 18, 'middle'], [400, 176, 'end'], [200, 398, 'middle'], [0, 158, 'start']];
const dlines = (t, i) => (i === 3 ? ['Control over', 'your data'] : [t]);

function Figure({ on, peek }) {
  const calm = useReducedMotion();
  const shape = PICKS.map((_, i) => dpt(i, on.includes(i) ? 1 : 0.36).map((v) => v.toFixed(1)).join(',')).join(' ');
  const all = on.length === PICKS.length;
  return (
    <div className={'xab-fig' + (peek != null ? ' peek' : '') + (all ? ' all' : '')} aria-hidden="true">
      <svg viewBox="0 0 400 410" className="xab-dia">
        {[0.36, 0.68, 1].map((k) => <polygon key={k} points={PICKS.map((_, i) => dpt(i, k).join(',')).join(' ')} className="xab-ring" />)}
        {PICKS.map((_, i) => <line key={i} x1="200" y1="200" x2={dpt(i, 1)[0]} y2={dpt(i, 1)[1]} className="xab-ring" />)}
        <motion.polygon className="xab-shape" initial={false} animate={{ points: shape }} transition={{ duration: calm ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }} />
        {PICKS.map(([t], i) => <text key={t} x={DLAB[i][0]} y={DLAB[i][1]} textAnchor={DLAB[i][2]} className={'xab-dia-l' + (on.includes(i) ? ' on' : '')}>{dlines(t, i).map((l, j) => <tspan key={l} x={DLAB[i][0]} dy={j ? 18 : 0}>{l}</tspan>)}</text>)}
      </svg>
      {peek != null && <div className="xab-fig-r" key={peek}><Radar at={peek} /><span className="xab-fig-n v2s-num">{pad(peek + 1)}</span></div>}
    </div>
  );
}

function Picks({ on, flip, touched }) {
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

/* the six principles as a compact index: a hand on one shows its radar in the figure; a click grows the row into its sheet */
function Tile({ p, i, cue, onOpen, onPeek }) {
  const [t, k, d, l, to] = p;
  return (
    <li>
      <motion.button type="button" layoutId={'xab-p' + i} className={'xab-tile' + (cue ? ' cue' : '')} style={{ borderRadius: 16 }} onClick={() => onOpen(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && onPeek(i)} onPointerLeave={() => onPeek(null)} onFocus={() => onPeek(i)} onBlur={() => onPeek(null)} aria-haspopup="dialog" aria-label={`${t}: ${k}. Open`}>
        <span className="xab-tile-n v2s-num" aria-hidden="true">{pad(i + 1)}</span>
        <span className="xab-tile-t" aria-hidden="true">
          <b>{t}</b>
          <span>{k}</span>
        </span>
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
  // on arrival the first tile shows a line of what it holds (an invitation to open it), once, then rests
  useEffect(() => {
    if (!seen || calm) return;
    const t = setTimeout(() => setCue(-1), 3200);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const show = (i) => { setAt(i); setOpen(i); };
  const [on, setOn] = useState([0, 1]);
  const [touched, setTouched] = useState(false);
  const flip = (i) => { setTouched(true); setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i])); };
  const [peek, setPeek] = useState(null);
  const shown = peek;
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
    <section className="v2s-sec zf-sec xab-why" id="why" aria-labelledby="xab-why-h">
      <div className="v2s-wrap">
        <div className="zf-head xab-why-head">
          <div className="xab-hl">
            <p className="v2s-cap">Why We Build</p>
            <h2 id="xab-why-h" className="xab-why-h">Moving the frontier without trading away safety, privacy, or ownership.</h2>
          </div>
          {/* the signature: Hanzo's belief, lit word by word as it is read */}
          <WordLight className="xab-why-l" text="Most AI platforms ask you to pick two: raw capability, low latency, affordable cost, or control over your data. Chasing the Pareto frontier means advancing every axis at once through better systems engineering and open research." />
        </div>
        <div className="xab-why-g" ref={grid} data-enter="ink-spread">
          <Figure on={on} peek={shown} />
          <Picks on={on} flip={flip} touched={touched} />
          <ul className="xab-tiles">
            {PILLARS.map((p, i) => <Tile key={p[0]} p={p} i={i} cue={cue === i && open == null && seen} onOpen={show} onPeek={setPeek} />)}
          </ul>
        </div>
      </div>
      <StorySheet layoutId={open == null ? null : 'xab-p' + open} onClose={() => setOpen(null)} label={t} className="xab-sheet" onKey={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'Tab') trap(e); }}>
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
      </StorySheet>
    </section>
  );
}

/* ---------- 3. the track record: three figures climbing like the frontier ---------- */
const MILES = [
  ['2014', 'Venture building and open-source commerce'],
  ['2017', 'Techstars ’17'],
  ['2024', 'Damon Motors and Triller listing on Nasdaq'],
  ['2026', '1700+ open repositories and the sovereign AI cloud'],
];

function Record() {
  // the three figures rest at 64px; only the one nearest the middle of the screen grows (MASTER 3.1: one big thing at a
  // time), handing over as the staircase passes the middle
  const figs = useRef(null);
  const seen = useInView(figs, { amount: 0.2 });
  const [big, setBig] = useState(-1);
  useEffect(() => {
    if (!seen) { setBig(-1); return; }
    const pick = () => {
      const mid = innerHeight / 2;
      let best = -1, d = Infinity;
      [...(figs.current?.children || [])].forEach((el, i) => { const r = el.querySelector('dt').getBoundingClientRect(); const x = Math.abs(r.top + r.height / 2 - mid); if (x < d) { d = x; best = i; } });
      setBig(d < innerHeight * 0.3 ? best : -1);
    };
    // three rects per scroll event, only while the figures are on screen; React skips the render when nothing changed
    pick();
    addEventListener('scroll', pick, { passive: true });
    return () => removeEventListener('scroll', pick);
  }, [seen]);
  return (
    <section className="v2s-sec zf-sec xab-rec" aria-labelledby="xab-rec-h" data-enter="magnet-gather">
      <div className="v2s-wrap">
        <div className="zf-head">
          <div className="xab-hl">
            <p className="v2s-cap">Proven Track Record</p>
            <h2 id="xab-rec-h">Built with founders, scaled to public markets.</h2>
          </div>
          <p className="xab-rec-l">From venture building and open-source commerce through Techstars ’17 to Damon Motors and Triller listing on Nasdaq in 2024, Hanzo has engineered sovereign commerce and AI systems for hundreds of venture-backed companies. Read the complete 2014–2026 archive on our history page, or start building today.</p>
        </div>
        <div className="xab-rec-stage zf-lift zf-dots">
        <dl className="xab-figs" ref={figs}>
          <div className={big === 0 ? 'big' : ''}><dt className="v2s-num"><Count to={100} suffix="+" duration={1.8} /></dt><dd>Startups built &amp; funded</dd></div>
          <div className={big === 1 ? 'big' : ''}><dt className="v2s-num">$1B+</dt><dd>Client revenue generated</dd></div>
          <div className={big === 2 ? 'big' : ''}><dt className="v2s-num">2024</dt><dd>Went public on Nasdaq (2024)</dd></div>
        </dl>
        <ol className="xab-miles">
          {MILES.map(([y, t]) => <li key={y}><b className="v2s-num">{y}</b><span>{t}</span></li>)}
        </ol>
        </div>
        <div className="xab-rec-foot">
          <div className="v2s-acts xab-rec-acts">
            <TL to="/pricing">Start Building</TL>
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

function Portrait({ p, has }) {
  const img = useRef(null);
  const [state, setState] = useState(has ? 'wait' : 'none');
  useEffect(() => { const el = img.current; if (el?.complete) setState(el.naturalWidth ? 'ok' : 'none'); }, []);
  if (!has) return (
    <figure className="xab-pic none" role="img" aria-label={p.name}>
      <Sigil seed={p.name} className="xab-pic-sigil" />
      <span className="xab-mono" aria-hidden="true">{p.mono}</span>
    </figure>
  );
  return (
    <figure className={'xab-pic ' + state}>
      {/* until the portrait has loaded (and whenever it cannot): the designed fallback, a contour field from the founder's name, initials in the corner */}
      {state !== 'ok' && <Sigil seed={p.name} className="xab-pic-sigil" />}
      <span className="xab-mono" aria-hidden="true">{p.mono}</span>
      <Img ref={img} src={p.img} alt={p.name} w={640} h={800} onLoad={() => setState('ok')} onError={() => setState('none')} />
    </figure>
  );
}

function Founders({ portraits = [] }) {
  return (
    <section className="v2s-sec tight zf-sec xab-people" aria-label="Founders" data-enter="squash-land">
      <div className="v2s-wrap xab-people-g">
        {FOUNDERS.map((p, i) => (
          <article key={p.name} className={'xab-person zf-lift zf-dots' + (i ? ' two' : '')}>
            <Portrait p={p} has={portraits.includes(p.img)} />
            <div className="xab-person-t">
              <h3 className="v2s-headline">{p.name}</h3>
              <p className="xab-role">{p.role}</p>
              <p className="v2s-body">{p.bio}</p>
              <ul className="xab-socials">{p.links.map(([l, to]) => <li key={l}><A to={to}>{l} <span aria-hidden="true">↗</span></A></li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. the Zen of Hanzo: a pinned scene (AboutZen.jsx) ---------- */

/* ---------- 6. the dark room: open source, deterministic safety, and the commits as they land ---------- */
const COMMITS = [ // the six hanzo.ai/about shows (8 Nov), word for word
  ['hanzoai/build', 'feat(customize): move Bots to its own left-sidebar section under Agents (v0.2.112)', '59d85b4', 'Nov 7, 08:12 UTC', 'https://github.com/hanzoai/build/commit/59d85b4ee9e194dee6f6f724f6ac1bae6b0115c1'],
  ['hanzoai/app', 'Merge pull request \u002338 from hanzoai/bots', '87c232f', 'Nov 7, 08:03 UTC', 'https://github.com/hanzoai/app/commit/87c232fe181ca6d01cbf032d25e2c0c73da36c6d'],
  ['hanzoai/personas', 'Merge pull request \u00232 from hanzoai/names-ed-mo', '9d67b12', 'Nov 7, 07:59 UTC', 'https://github.com/hanzoai/personas/commit/9d67b12ddd54b481b5ad411e89a137011862531f'],
  ['hanzoai/personas', "personas 1.2.1: Ed, Mo and Art by the owner's names", '8a182bb', 'Nov 7, 07:58 UTC', 'https://github.com/hanzoai/personas/commit/8a182bb5c58efe34335f5c2ccab7494ed0ea2cd1'],
  ['hanzoai/app', 'agents: the twelve leads are Team, the other 22 seats run 24/7 as Bots (0.3.41)', '7b01c57', 'Nov 7, 07:57 UTC', 'https://github.com/hanzoai/app/commit/7b01c57d1ec617efb318bf25a3152087dce032c5'],
  ['hanzoai/app', 'Merge pull request \u002337 from hanzoai/seats', '3979848', 'Nov 7, 07:47 UTC', 'https://github.com/hanzoai/app/commit/3979848f8a8f82bae2dfef77f59ec18daba85a1e'],
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
        <p><span className="xab-live" aria-hidden="true" /><span>Public Activity</span> <span className="xab-log-n">1700+ repositories</span> <A to="https://github.com/hanzoai">github.com/hanzoai</A></p>
      </div>
      <ul>
        {COMMITS.map(([repo, msg, sha, when, to], i) => (
          <li key={sha + i} style={{ '--n': i }}>
            <span className="xab-repo">{repo}</span>
            <A to={to} className="xab-msg">{msg}</A>
            <code>{sha}</code>
            <span className="xab-when">{when}</span>
          </li>
        ))}
      </ul>
      <div className="xab-log-f">
        <p>Every line written, reviewed, and shipped in the open by Hanzo engineers.</p>
        <Cta to="/open-source" kind="quiet">View Open Source Dashboard</Cta>
      </div>
    </div>
  );
}

function Open() {
  const [pane, setPane] = useState(0); // one pane at a time: the open code, or the safety bounds
  return (
    <section className="v2s-sec zf-room xab-open" data-room="dark" aria-labelledby="xab-open-h">
      <div className="v2s-wrap">
        <div className="zf-head">
          <div className="xab-hl">
            <p className="v2s-cap">Open Source &amp; Deterministic Safety</p>
            <h2 id="xab-open-h" className="xab-open-h"><span>Verifiable code.</span> <span className="xab-dim">Calibrated decisions.</span></h2>
          </div>
          <p className="xab-open-l">Opaque black-box platforms ask you to trust what you cannot inspect. Hanzo pairs public source code and open specifications with calibrated decision bounds and full infrastructure sovereignty.</p>
        </div>
        <div className="xab-open-g" data-enter="accordion">
          <div className="xab-panes">
            <Tabs id="xab-pane" tabs={PANES.map((x) => x[0])} value={pane} onChange={setPane} label="Open Source & Deterministic Safety" size="lg" />
            {PANES.map(([t, k, d, items, l, to], i) => (
              <TabPanel key={t} id="xab-pane" i={i} value={pane} className="xab-pane">
                <p className="xab-pk">{k}</p>
                <p className="v2s-body">{d}</p>
                <ul>{items.map(([b, s]) => <li key={b}><span className="xab-pane-k">{b}</span> <span>{s}</span></li>)}</ul>
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
    <>
    <section className="v2s-sec zf-sec xab-research" aria-labelledby="xab-res-h">
      <div className="v2s-wrap">
        <div className="zf-head">
          <div className="xab-hl">
            <p className="v2s-cap">Frontier Models &amp; Research</p>
            <h2 id="xab-res-h">Original architectures, engines, and published research.</h2>
          </div>
          <p className="xab-res-l">Rather than wrapping third-party endpoints, Hanzo designs decision models, semantic routers, bare-metal inference engines, and open research on verifiable agent safety.</p>
        </div>
        <div className="xab-row-h">
          <h3 className="v2s-kick">Models &amp; Runtimes</h3>
          <Link2 to="/models">View Model Catalog</Link2>
        </div>
        <ul className="xab-rts zf-tilt">{RUNTIMES.map((m) => <Runtime key={m.name} m={m} />)}</ul>
      </div>
    </section>
    {/* the papers: a frame of their own, an editorial list after the four lit plates */}
    <section className="v2s-sec zf-sec xab-papers-s" aria-labelledby="xab-pap-h">
      <div className="v2s-wrap">
        <div className="zf-head xab-papers-h">
          <h3 id="xab-pap-h" className="zf-h">Selected Papers &amp; Technical Writing</h3>
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
    </>
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
    <section className="v2s-sec zf-sec xab-careers" aria-labelledby="xab-car-h">
      <div className="v2s-wrap xab-car-g">
        <div className="xab-car-t">
          <p className="v2s-label">Careers at Hanzo</p>
          <h2 id="xab-car-h" className="xab-car-h">Push the Pareto frontier with us.</h2>
          <p className="xab-car-l">We hire systems programmers, AI safety researchers, and product engineers who care about open source, equitable access, privacy, and sovereign ownership. High autonomy, zero bureaucracy, and code that ships in public.</p>
          <div className="xab-car-acts">
            <Cta to="/careers" id="about.band" kind="quiet">Explore Open Roles</Cta>
            <TL to="/team">Meet the Team</TL>
            <TL to="/open-source">Browse Code on GitHub</TL>
          </div>
        </div>
        <div className="xab-car-r">
          <div className={'xab-tracks' + (on >= 0 ? ' lit' : '')} aria-hidden="true">
            <svg viewBox={`${PL} ${PT} ${W - PL - PR} ${H - PT - PB}`} preserveAspectRatio="none">
              <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} className="xab-base" />
              {TRACKS.map((d, i) => <path key={i} d={d} className={'xab-track' + (on === i ? ' on' : '')} />)}
              <path d={FRONT} className="xab-line" />
            </svg>
            <i className="xab-tracks-head" />
          </div>
          <ol className="xab-roles" onPointerLeave={() => setOn(-1)}>
            {ROLES.map(([t, d], i) => (
              <li key={t} className={on === i ? 'on' : ''} onPointerEnter={() => setOn(i)}>
                <span className="v2s-num" aria-hidden="true">{pad(i + 1)}</span>
                <div><h3 className="v2s-title">{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. the close (Zack, 8 Nov): the frontier runs on to its head, and the page ends on Try Hanzo and Book a call ---------- */
function Close() {
  return (
    <section className="zf-close xab-close" aria-label="Try Hanzo, Book a call">
      <div className="v2s-wrap">
        <div className="xab-close-stage zf-lift">
          <svg className="xab-close-curve" viewBox={`${PL} ${PT} ${W - PL - PR} ${H - PT - PB}`} preserveAspectRatio="none" aria-hidden="true">
            {[0.25, 0.5, 0.75].map((v) => <line key={v} x1={0} x2={W} y1={Y(v)} y2={Y(v)} className="xab-grid" />)}
            {TRACKS.map((d, i) => <path key={i} d={d} className="xab-ghost" />)}
            <path d={FRONT} className="xab-line" pathLength={1} />
          </svg>
          <i className="xab-close-head" aria-hidden="true" />
          <div className="zf-acts xab-close-acts">
            <Cta to="/signup" id="about.try" size="lg">Try Hanzo</Cta>
            <Cta to="https://cal.com/hanzo" id="about.call" kind="quiet" size="lg">Book a call</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About({ portraits = [] }) {
  useEntrances(); // the five section entrances (about/enter.js)
  return (
    <main id="main" className="xab v2s zf">
      {/* JavaScript off: the frontier shows drawn at rest (no film to stop part way), and the idle loops and their pause
          button (which needs JS) are off */}
      <noscript><style>{'.xab-line,.xab-ghost,.xab-ride,.xab-ts,.xab-axis,.xab-halo,.xab-glide{animation:none!important}.xab-glide,.xab-pause{display:none!important}'}</style></noscript>
      <Hero />
      <Why />
      <Record />
      <Founders portraits={portraits} />
      <Zen />
      <Open />
      <Research />
      <Careers />
      <Close />
    </main>
  );
}
