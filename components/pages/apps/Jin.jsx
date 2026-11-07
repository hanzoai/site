'use client';
/* Jin (v2, archetype D "Story": an editorial research paper after osply.co / hamol.studio / grubogrubo.com; greys and
   ink only, JAMES.md 7).
   Persona: an ML researcher or engineer curious about self-supervised vision (metric docs_click)
   Goal: see the saccade idea work in one figure, then open the docs
   CTA: Read the docs -> https://docs.hanzo.ai (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta)
   Signature: Figure 1, a saccade that checks itself, beside the title on the first screen. The image jitters, the
   predictor guesses where its embedding will move, the image shifts back and the embedding has to land where it
   started; the three losses (Huber, cycle-consistency, VICReg) lean with each phase. It runs by itself while seen and
   pauses on its own button (WCAG 2.2.2).
   Beyond: "Make the saccade yourself". Drag the image (spring physics; arrow keys too): the predicted embedding follows
   your shift live, the losses answer, and when you let go the image springs back and draws the round trip it closes.
   Motion: Figure 1 (idle, signature) + headlines cut into their line (arrival, scroll) + the drag with springs
   (pointer) + Table 1 in a sheet (state). Every word and link is Hanzo's.
V2: 8/10 a paper, not a launch: the title beside a live Figure 1 on the first screen at both sizes, the byline and one ask under the title, six numbered sections with big margin numerals and drawn figures under a running head, one dark plate to make the saccade yourself, Table 1 and the agent prompt in a sheet, greys only, one ask everywhere
*/
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'motion/react';
import { A, More } from '../../kit';
import { Paste, useLive } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizSheet from '../../v2/BizSheet';
import { SPRING as SP } from '../../../lib/motion';
import './Jin.css';

const DOCS = 'https://docs.hanzo.ai';
const GH = 'https://github.com/hanzoai';
const IMG = '/models/zen.webp';
const SPRING = SP.sheet;
const two = (n) => String(n).padStart(2, '0');
// a shift of the image (in % of its frame) moves its embedding through a fixed linear map: an illustration of a learned one
const cl = (v) => Math.max(-44, Math.min(44, v));
const emb = (x, y) => [cl(x * 2 + y * 0.7), cl(y * 1.9 - x * 0.6)];
const pct = (v) => v + '%';
// other images' embeddings, fixed (a seeded scatter)
const r2 = (v) => Math.round(v * 100) / 100;
const CLOUD = Array.from({ length: 34 }, (_, i) => { const a = i * 2.39996, r = 14 + ((i * 37) % 31); return [r2(Math.cos(a) * r), r2(Math.sin(a) * r * 0.86)]; });

/* The embedding space: other embeddings, where z started (dashed), where it is (ink) and the predictor's guess (ring). */
function Space({ ex, ey, px, py, guess, back, landed, out, home, children }) {
  return (
    <div className="jn-space" aria-hidden="true">
      <i className="jn-ax x" /><i className="jn-ax y" />
      {CLOUD.map(([x, y], i) => <i key={i} className="jn-cl" style={{ left: 50 + x + '%', top: 50 + y + '%' }} />)}
      {children}
      <span className="jn-z0" />
      <motion.span className={'jn-layer jn-guess' + (guess ? ' on' : '')} style={{ x: px, y: py }}><i /></motion.span>
      <motion.span className="jn-layer" style={{ x: ex, y: ey }}><i className="jn-z" /></motion.span>
      <span className={'jn-home' + (landed ? ' on' : '')} />
      <span className="jn-lbl z0 x-mono">z</span>
      {out && <span className={'jn-lbl go x-mono' + (back ? ' back' : '')}>{back ? 'shift back' : home}</span>}
    </div>
  );
}

function Losses({ v, dark }) {
  const top = v.indexOf(Math.max(...v));
  return (
    <div className={'jn-loss' + (dark ? ' dark' : '')}>
      {['Huber', 'cycle-consistency', 'VICReg'].map((t, i) => (
        <div key={t} className={top === i ? 'on' : ''}>
          <span className="x-mono">{t}</span>
          <span className="jn-track"><motion.i initial={false} animate={{ scaleX: v[i] }} transition={SPRING} /></span>
        </div>
      ))}
    </div>
  );
}

/* Figure 1, the signature: one saccade after another while it is on screen. */
const PHASE = ['image at rest', 'shift the image', 'predict how its embedding moves', 'shift back', 'check it lands where it started'];
const SHIFTS = [[12, -8], [-10, 8], [9, 11], [-12, -6]];
const MISS = [[6, -7], [-7, 6], [7, 5], [-6, -7]];
const LEAN = [[0.14, 0.1, 0.46], [0.22, 0.14, 0.52], [0.82, 0.22, 0.48], [0.4, 0.78, 0.56], [0.14, 0.12, 0.46]];

const PauseI = ({ held }) => (held
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);

function Figure1() {
  const [ref, seen, calm] = useLive(0.3);
  const [held, setHeld] = useState(false);
  const live = seen && !held;
  const ix = useMotionValue(0), iy = useMotionValue(0);
  const ex = useTransform([ix, iy], ([x, y]) => pct(emb(x, y)[0]));
  const ey = useTransform([ix, iy], ([x, y]) => pct(emb(x, y)[1]));
  const [ph, setPh] = useState(0);
  const [k, setK] = useState(0);
  useEffect(() => { if (calm) { ix.set(SHIFTS[0][0]); iy.set(SHIFTS[0][1]); setPh(2); } }, [calm, ix, iy]);
  useEffect(() => {
    if (!live) return;
    const [sx, sy] = SHIFTS[k % 4];
    const ts = [
      [600, () => { setPh(1); animate(ix, sx, SPRING); animate(iy, sy, SPRING); }],
      [1500, () => setPh(2)],
      [2900, () => { setPh(3); animate(ix, 0, SPRING); animate(iy, 0, SPRING); }],
      [3800, () => setPh(4)],
      [5300, () => { setPh(0); setK((v) => v + 1); }],
    ].map(([t, f]) => setTimeout(f, t));
    return () => ts.forEach(clearTimeout);
  }, [k, live, ix, iy]);
  const [sx, sy] = SHIFTS[k % 4];
  const [tx, ty] = emb(sx, sy);
  const guess = [tx + MISS[k % 4][0], ty + MISS[k % 4][1]];
  return (
    <figure className="jn-f1" ref={ref} data-cursor="Watch">
      <div className="jn-f1-row">
        <div className="jn-pane">
          <p className="jn-pk x-mono"><b>a</b> input</p>
          <div className="jn-frame" aria-hidden="true">
            <motion.span className="jn-img" style={{ x: useTransform(ix, pct), y: useTransform(iy, pct) }}><img src={IMG} alt="" draggable={false} /></motion.span>
            <i className="jn-patches" />
            <i className="jn-was" />
          </div>
        </div>
        <div className="jn-pane">
          <p className="jn-pk x-mono"><b>b</b> embedding</p>
          <Space ex={ex} ey={ey} px={pct(guess[0])} py={pct(guess[1])} guess={ph === 2} landed={ph === 4} out={ph === 2 || ph === 3} back={ph === 3} home="predicted">
            <svg className="jn-trace" viewBox="-50 -50 100 100" preserveAspectRatio="none">
              <line className={ph === 2 ? 'on' : ''} x1="0" y1="0" x2={tx} y2={ty} />
              <path className={'ret' + (ph >= 3 ? ' on' : '')} d={`M${tx} ${ty} Q ${tx * 0.2 - ty * 0.6} ${ty * 0.2 + tx * 0.6} 0 0`} />
            </svg>
          </Space>
        </div>
      </div>
      <div className="jn-pane jn-pane-c">
        <p className="jn-pk x-mono"><b>c</b> losses</p>
        <Losses v={LEAN[ph]} />
      </div>
      <figcaption>
        <ol className="jn-ticks" aria-hidden="true">{PHASE.map((p, i) => <li key={p} className={i === ph ? 'on' : i < ph ? 'past' : ''} />)}</ol>
        <div className="jn-cap">
          <p><b>Figure 1.</b> Saccade JEPA, step by step: <span className="jn-phase x-mono">{PHASE[ph]}</span></p>
          {!calm && <button type="button" className="jn-pause" onClick={() => setHeld(!held)} aria-pressed={held} aria-label={held ? 'Play Figure 1' : 'Pause Figure 1'}><PauseI held={held} /></button>}
        </div>
      </figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className="jn-hero" aria-labelledby="jn-h1">
      <div className="bz-wrap bz-grid jn-hero-grid">
        <div className="jn-hero-copy">
          <BizLines as="h1" id="jn-h1" className="bz-display jn-title" lines={['Research on', 'learning', 'without labels']} now delay={0.05} />
          <p className="jn-byline"><span className="x-mono jn-name">Jin</span><span className="x-mono">hanzoai/jin</span></p>
          <div className="jn-acts">
            <A to={DOCS} className="x-btn solid" data-thumb="Read the docs" data-cta="primary">Read the docs</A>
            <More to={GH}>View on GitHub</More>
          </div>
        </div>
        <div className="jn-hero-fig">
          <Figure1 />
        </div>
        <div className="jn-abs">
          <p className="jn-abs-k x-mono">Abstract</p>
          <p className="bz-body">Eyes jitter constantly and the brain predicts what the jitter will do to the scene, so the model shifts an image, predicts how its embedding moves, and shifts back to check it lands where it started.</p>
        </div>
      </div>
    </section>
  );
}

/* The section figures: drawn diagrams, lettered; the legend under each says what the letters are, in Hanzo's words. */
const Ar = ({ id }) => <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className="mk" /></marker></defs>;
const L = ({ x, y, c, a }) => <text x={x} y={y} className={'lt' + (a ? ' a' : '')}>{c}</text>;
const grid = (x0, y0, s, f) => Array.from({ length: 16 }).map((_, i) => <rect key={i} x={x0 + (i % 4) * s + 2} y={y0 + Math.floor(i / 4) * s + 2} width={s - 4} height={s - 4} rx="3" className={f(i)} />);
const seeded = (n, cx, cy, r, s) => Array.from({ length: n }, (_, i) => { const a = (i * 2.39996 + s) % 6.2832, d = r * Math.sqrt(((i * 7 + s * 13) % n) / n + 0.08); return [r2(cx + Math.cos(a) * d), r2(cy + Math.sin(a) * d * 0.8)]; });

const FIGS = [
  <svg key="f2" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a2" />
    {grid(16, 100, 30, (i) => ([5, 6, 10].includes(i) ? 'fa' : 'sk'))}
    <path className="sk" markerEnd="url(#jn-a2)" d="M140 140 C 162 140, 160 90, 186 90" />
    <path className="sk" markerEnd="url(#jn-a2)" d="M140 180 C 162 180, 160 230, 186 230" />
    <rect x="190" y="60" width="96" height="60" rx="12" className="sk" /><L x="238" y="91" c="a" />
    <rect x="190" y="200" width="96" height="60" rx="12" className="sk" /><L x="238" y="231" c="b" />
    <path className="sa dash" markerEnd="url(#jn-a2)" d="M238 124 V 194" />
    <path className="sk" markerEnd="url(#jn-a2)" d="M286 90 H 326" />
    <rect x="330" y="60" width="96" height="60" rx="12" className="sk fa-soft" /><L x="378" y="91" c="c" a />
    <path className="sk" markerEnd="url(#jn-a2)" d="M426 90 H 446" />
    <circle cx="456" cy="90" r="8" className="sa" />
    <path className="sk" markerEnd="url(#jn-a2)" d="M286 230 H 446" />
    <circle cx="456" cy="230" r="8" className="fk" />
    <path className="sa" d="M456 104 V 216" strokeDasharray="2 6" />
    <L x="456" y="296" c="d" />
  </svg>,
  <svg key="f3" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a3" />
    {[[20, 0, 0], [190, 16, -10], [360, 0, 0]].map(([x, dx, dy], i) => (
      <g key={i}>
        <rect x={x} y="30" width="100" height="100" rx="10" className="sk" />
        <circle cx={x + 50 + dx} cy={80 + dy} r="22" className={i === 1 ? 'fk' : 'fg'} />
        <rect x={x + 22} y="52" width="56" height="56" rx="6" className="sd" />
        <path className="sg dash" d={`M${x + 50} 136 V 214`} />
      </g>
    ))}
    <path className="sk" markerEnd="url(#jn-a3)" d="M126 80 H 184" /><L x="155" y="62" c="a" />
    <path className="sk" markerEnd="url(#jn-a3)" d="M296 80 H 354" /><L x="325" y="62" c="c" />
    <circle cx="70" cy="226" r="7" className="fk" />
    <circle cx="240" cy="226" r="7" className="fk" />
    <circle cx="254" cy="214" r="13" className="sa" /><L x="282" y="204" c="b" a />
    <circle cx="410" cy="226" r="7" className="fk" /><circle cx="410" cy="226" r="16" className="sa" />
    <path className="sa dash" markerEnd="url(#jn-a3)" d="M402 246 C 340 300, 140 300, 78 246" />
    <L x="240" y="306" c="d" a />
  </svg>,
  <svg key="f4" viewBox="0 0 720 270" className="jn-svg wide" aria-hidden="true">
    <path className="sg" d="M40 200 H 200 M120 36 V 206" />
    <path className="sa thick" d={Array.from({ length: 61 }, (_, i) => { const x = -60 + i * 2, h = Math.abs(x) <= 20 ? (x * x) / 40 : Math.abs(x) - 10; return `${i ? 'L' : 'M'}${120 + x} ${200 - h * 2.8}`; }).join(' ')} />
    <L x="120" y="250" c="a" />
    <path className="sk thick" d="M362 72 C 420 56, 446 118, 426 158 C 406 200, 330 200, 314 150 C 302 108, 326 78, 350 72" />
    <circle cx="362" cy="72" r="7" className="fk" /><circle cx="350" cy="72" r="7" className="sa" />
    <L x="370" y="250" c="b" a />
    {Array.from({ length: 36 }).map((_, i) => { const r = Math.floor(i / 6), c = i % 6, d = r === c; return <rect key={i} x={566 + c * 20} y={64 + r * 20} width="18" height="18" rx="2" className={d ? 'fk' : (r + c) % 4 === 1 ? 'fl' : 'fz'} />; })}
    <L x="625" y="250" c="c" />
  </svg>,
  <svg key="f5" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a5" />
    {grid(14, 100, 28, (i) => ([0, 2, 3, 5, 7, 8, 9, 11, 12, 14, 15].includes(i) ? 'fz' : 'sk'))}
    <path className="sk" markerEnd="url(#jn-a5)" d="M132 156 H 156" />
    <path className="sk fz-soft" d="M160 96 L 216 130 V 182 L 160 216 Z" />
    <circle cx="240" cy="156" r="10" className="fk" />
    <path className="sa dash fa-soft" d="M264 130 L 320 96 V 216 L 264 182 Z" />
    <path className="sk" markerEnd="url(#jn-a5)" d="M324 156 H 348" />
    {grid(352, 100, 28, () => 'sg')}
    <L x="72" y="268" c="a" /><L x="188" y="268" c="b" /><L x="292" y="268" c="c" a /><L x="408" y="268" c="d" />
  </svg>,
  <svg key="f6" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    {[[120, 120, 0, 'fk'], [250, 90, 3, 'fg'], [170, 230, 5, 'fl'], [300, 210, 7, 'fo']].map(([cx, cy, s, c]) => seeded(16, cx, cy, 48, s).map(([x, y], i) => <circle key={c + i} cx={x} cy={y} r="5" className={c} />))}
    <L x="200" y="300" c="a" />
    {Array.from({ length: 25 }).map((_, i) => { const r = Math.floor(i / 5), c = i % 5, d = Math.hypot(r - 1.6, c - 2.6); return <rect key={i} x={366 + c * 20} y={40 + r * 20} width="19" height="19" className="fa" opacity={Math.max(0.08, 1 - d / 2.6).toFixed(2)} />; })}
    <rect x="366" y="40" width="99" height="99" className="sk" fill="none" />
    <L x="416" y="168" c="b" a />
  </svg>,
  <svg key="f7" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <path className="sg" d="M150 50 L 90 110 M150 50 L 210 110 M90 110 L 60 170 M90 110 L 120 170 M210 110 L 180 170 M210 110 L 240 170" />
    {[[150, 50], [90, 110], [210, 110], [60, 170], [120, 170], [180, 170], [240, 170]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i ? (i < 3 ? 12 : 9) : 16} className={i ? 'fk' : 'fa'} />)}
    <L x="150" y="230" c="a" />
    <rect x="320" y="120" width="110" height="110" rx="14" className="sk" />
    <rect x="345" y="145" width="60" height="60" rx="6" className="fk" />
    {[0, 1, 2, 3].map((i) => <path key={i} className="sk" d={`M${340 + i * 22} 120 V 106 M${340 + i * 22} 230 V 244 M320 ${140 + i * 22} H 306 M430 ${140 + i * 22} H 444`} />)}
    <path className="sg" d="M352 76 A 30 30 0 0 1 398 76 M362 88 A 16 16 0 0 1 388 88" />
    <path className="sa thick" d="M346 56 L 404 100" />
    <L x="375" y="290" c="b" /><L x="430" y="52" c="c" a />
  </svg>,
];

const SECS = [
  ['I-JEPA', ['I-JEPA'], 'A clean implementation of the image variant: a context encoder, a target encoder that is its moving average, and a predictor that has to guess the target embeddings. Both a ViT and an energy-transformer backbone.', ['context encoder', 'target encoder, its moving average', 'predictor', 'target embeddings']],
  ['Saccade JEPA', ['Saccade', 'JEPA'], 'Ours. Eyes jitter constantly and the brain predicts what the jitter will do to the scene, so the model shifts an image, predicts how its embedding moves, and shifts back to check it lands where it started.', ['shift the image', 'predict how its embedding moves', 'shift back', 'lands where it started']],
  ['Three losses at once', ['Three losses', 'at once'], 'Huber loss on the prediction, a cycle-consistency term that punishes drift on the round trip, and the invariance and covariance parts of VICReg to stop the representation collapsing.', ['Huber loss on the prediction', 'cycle-consistency: drift on the round trip', 'VICReg: invariance and covariance']],
  ['Masked autoencoding', ['Masked', 'autoencoding'], 'An MAE with self-distillation sits alongside, for the comparison that matters: is a decoder worth its parameters when the goal is a good representation rather than a good reconstruction?', ['the image, masked', 'representation', 'decoder', 'reconstruction']],
  ['Ways to see what it learned', ['Ways to see', 'what it learned'], 'Self-supervised training has no validation loss to watch, so there are linear probes, KNN, attention-map visualisation in a Dash dashboard, correlation dimension, and UMAP coloured by true class.', ['UMAP coloured by true class', 'attention-map visualisation']],
  ['The papers', ['The papers'], 'Grant proposals on hierarchical JEPA for edge AI, where the interesting constraint is learning useful representations on hardware that cannot phone home.', ['hierarchical JEPA', 'edge AI', 'hardware that cannot phone home']],
];

/* The repository, as the paper's six numbered sections under a running head. */
function Paper() {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.sec)), { rootMargin: '-45% 0px -50% 0px' });
    ref.current.querySelectorAll('[data-sec]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="jn-paper" ref={ref}>
      <div className="jn-run" aria-hidden="true">
        <div className="bz-wrap jn-run-in">
          <span className="x-mono">What is in the repository</span>
          <span className="jn-run-t">{SECS[at][0]}</span>
          <span className="x-mono jn-run-n">{two(at + 1)} / 06</span>
        </div>
        <i className="jn-run-bar" style={{ transform: `scaleX(${(at + 1) / 6})` }} />
      </div>
      <p className="x-sr">What is in the repository</p>
      {SECS.map(([t, lines, d, key], i) => (
        <section key={t} className={'jn-sec v' + i} data-sec={i} aria-labelledby={'jn-s' + i}>
          <div className="bz-wrap bz-grid jn-sec-in">
            <p className="jn-num" aria-hidden="true">{i + 1}</p>
            <div className="jn-txt">
              <BizLines id={'jn-s' + i} className="bz-headline jn-h" lines={lines} />
              <p className="bz-body">{d}</p>
            </div>
            <figure className="jn-mfig">
              {FIGS[i]}
              <figcaption>
                <span className="x-mono">Figure {i + 2}</span>
                <ul>{key.map((k, j) => <li key={k}><b className="x-mono">{'abcd'[j]}</b>{k}</li>)}</ul>
              </figcaption>
            </figure>
          </div>
        </section>
      ))}
    </div>
  );
}

/* Beyond, the one dark plate: drag the image yourself; the predictor follows, and on release the image shifts back. */
function Yours() {
  const box = useRef(null);
  const ix = useMotionValue(0), iy = useMotionValue(0);
  const W = useRef(400);
  const e = useTransform([ix, iy], ([x, y]) => emb((x / W.current) * 140, (y / W.current) * 140));
  const exn = useTransform(e, (v) => v[0]), eyn = useTransform(e, (v) => v[1]);
  const pxn = useSpring(exn, { stiffness: 90, damping: 18 }), pyn = useSpring(eyn, { stiffness: 90, damping: 18 });
  const [state, setState] = useState('rest');
  const [v, setV] = useState([0.12, 0.1, 0.46]);
  const [trail, setTrail] = useState({ out: [], back: [] });
  const last = useRef(0);
  const mode = useRef('rest');
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      if (now - last.current < 40) return;
      last.current = now;
      const [x, y] = [exn.get(), eyn.get()];
      const miss = Math.hypot(pxn.get() - x, pyn.get() - y), far = Math.hypot(x, y);
      setV([Math.min(1, 0.1 + miss / 14), Math.min(1, 0.08 + (mode.current === 'back' ? far / 26 : far / 70)), Math.min(0.9, 0.44 + far / 160)]);
      const m = mode.current;
      if (m === 'out' || m === 'back') {
        setTrail((t) => ({ ...t, [m]: [...t[m], [x, y]].slice(-80) }));
        if (m === 'back' && far < 0.6) { mode.current = 'landed'; setState('landed'); }
      }
    };
    const offs = [exn.on('change', tick), eyn.on('change', tick), pxn.on('change', tick)];
    return () => offs.forEach((f) => f());
  }, [exn, eyn, pxn, pyn]);
  const start = () => { W.current = box.current?.offsetWidth || 400; mode.current = 'out'; setState('out'); setTrail({ out: [[0, 0]], back: [] }); };
  const end = () => { mode.current = 'back'; setState('back'); };
  const nudge = (ev) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[ev.key];
    if (!d) return;
    ev.preventDefault();
    start();
    const s = W.current * 0.1;
    animate(ix, d[0] * s, SPRING); animate(iy, d[1] * s, { ...SPRING, onComplete: () => setTimeout(() => { end(); animate(ix, 0, SPRING); animate(iy, 0, SPRING); }, 500) });
  };
  const line = (pts) => pts.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <section className="bz-sec jn-try" data-room="dark" aria-labelledby="jn-try-h">
      <div className="bz-wrap bz-grid">
        <header className="jn-try-head">
          <BizLines id="jn-try-h" className="bz-display sm" lines={['Make the', 'saccade', 'yourself']} />
          <p className="jn-try-k x-mono">Figure 8</p>
          <p className="bz-body">Drag the image. The predictor guesses where its embedding goes; let go, and the image shifts back and has to land where it started.</p>
          <p className="jn-state x-mono" aria-live="polite">{{ rest: 'drag the image', out: 'shift the image · predict how its embedding moves', back: 'shift back', landed: 'lands where it started' }[state]}</p>
        </header>
        <div className="jn-try-obj">
          <div className="jn-try-row">
            <div className="jn-pane">
              <p className="jn-pk x-mono"><b>a</b> input</p>
              <div className="jn-frame big" ref={box}>
                <motion.span
                  className="jn-img grab" style={{ x: ix, y: iy }} drag dragConstraints={box} dragElastic={0.12} dragSnapToOrigin
                  dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }} onDragStart={start} onDragEnd={end}
                  tabIndex={0} role="img" aria-label="An image you can drag; arrow keys shift it too" onKeyDown={nudge} data-cursor="Drag"
                ><img src={IMG} alt="" draggable={false} /></motion.span>
                <i className="jn-patches" />
                <i className="jn-was" />
              </div>
            </div>
            <div className="jn-pane">
              <p className="jn-pk x-mono"><b>b</b> embedding</p>
              <Space ex={useTransform(exn, pct)} ey={useTransform(eyn, pct)} px={useTransform(pxn, pct)} py={useTransform(pyn, pct)} guess={state === 'out'} landed={state === 'landed'} out={state === 'out' || state === 'back'} back={state === 'back'} home="predicted">
                <svg className="jn-trace" viewBox="-50 -50 100 100" preserveAspectRatio="none">
                  <polyline className="on" points={line(trail.out)} />
                  <polyline className="ret on" points={line(trail.back)} />
                </svg>
              </Space>
            </div>
          </div>
          <Losses v={v} dark />
        </div>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
const TABLE = [['I-JEPA', 'Reference build'], ['Saccade', 'Our own variant'], ['MAE', 'Self-distilled'], ['Papers', 'Edge AI proposals']];

/* The close: one sentence at Display size, the same solid ask, and full-width text rows for everything else; Table 1
   and the agent prompt live in a sheet. */
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function End() {
  return (
    <section className="bz-sec jn-end" aria-labelledby="jn-end-h">
      <div className="bz-wrap">
        <div className="jn-end-top">
          <BizLines id="jn-end-h" className="bz-display" lines={['Read the code']} />
          <A to={DOCS} className="x-btn solid jn-end-go" data-thumb="Read the docs" data-cta="primary">Read the docs</A>
        </div>
        <ul className="jn-rows">
          <li><A to={GH} className="jn-row"><b>View on GitHub</b><span className="x-mono"><Gh />hanzoai</span><Arrow /></A></li>
          <li><A to="https://platform.hanzo.ai/deploy" className="jn-row"><b>Get Jin</b><span>Multimodal foundation model <i className="x-mono">License: Apache-2.0</i></span><em>Deploy to Cloud</em><Arrow /></A></li>
          <li className="jn-row-sheet">
            <BizSheet label="See Table 1" kick="Table 1" title="What is in the repository" className="jn-sheet">
              <table className="jn-table">
                <caption className="x-mono">Table 1</caption>
                <tbody>{TABLE.map(([a, b]) => <tr key={a}><th className="x-mono">{a}</th><td>{b}</td></tr>)}</tbody>
              </table>
              <Paste name="Jin" prompt="Read https://hanzo.ai/skill.md and use Hanzo Jin in my project." className="jn-paste" />
            </BizSheet>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function Jin() {
  return (
    <main className="bz jn" data-ask-name="Jin">
      <Hero />
      <Paper />
      <Yours />
      <End />
    </main>
  );
}
