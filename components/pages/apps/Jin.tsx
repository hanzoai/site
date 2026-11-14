'use client';
/* Jin (v2, archetype D "Story": an editorial research paper after osply.co / hamol.studio / grubogrubo.com, with
   apple.com's pinned stage for the six chapters; greys and ink only, JAMES.md 7).
   Persona: an ML researcher or engineer curious about self-supervised vision
   Metric: docs_click (a GitHub or docs click)
   Goal: see the saccade idea work in one figure, then open the docs
   CTA: Read the docs -> https://docs.hanzo.ai (hero, the header ask at every width, close; data-thumb, data-cta)
   Signature: Figure 1, a saccade that checks itself, under the title on the first screen. The image jitters, the
   predictor guesses where its embedding will move, the image shifts back and the embedding has to land where it
   started; the three losses (Huber, cycle-consistency, VICReg) lean with each phase. It runs twice by itself while
   seen, then rests on its last step; its own button pauses it and replays it (WCAG 2.2.2).
   Beyond: "Make the saccade yourself". Drag the image (arrow keys too): the predicted embedding follows your shift
   live, and the three losses are plotted as a trace over your drags; let go and the image shifts back and draws the
   round trip it closes.
   Motion: Figure 1 (idle, signature) + headlines cut into their line (arrival) + the chapters as one pinned stage
   whose plate draws each figure out and the next one in, with a point scrubbed along the round trip (scroll) + the
   drag (pointer) + legend letters lighting their part of the drawing (pointer) + Table 1 in a native dialog
   (state). Every word and link is Hanzo's.
Round 4: figures walk themselves through their lettered parts when left alone; Figure 8 makes one saccade by itself on arrival; its loss legend loses the base-CSS grey slabs.
Round 3 (review 7/10): chapters 1-6 are one pinned stage on desktop (texts scroll left; a plate pinned right draws each chapter's figure out and the next in, a hairline and a point on the round trip scrub with the scroll; stacked under 900px with figures alternating above and below and a one-line legend); chapter 3 breaks out at full width with numeral 112, chapter 5 at 84, nothing dwindles; Figure 8 plots the losses as a trace over your drags instead of repeating Figure 1's bars, its status is a mono caption on the black; legend letters and drawing parts light each other on hover; the counter switches as a chapter crosses the line; Table 1 is a native dialog; Figure 1 runs twice and rests, with replay; the phone header carries the page's ask after the hero
*/
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, useReducedMotion } from 'motion/react';
import { A, More, Cta, Img, DataTable } from '../../kit';
import { useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizLines from '../../v2/BizLines';
import './Jin.css';

const DOCS = 'https://docs.hanzo.ai';
const GH = 'https://github.com/hanzoai';
const IMG = '/models/zen.webp';
// deck motion (MASTER §3.1): ease-in-out for things that move and stay, ease-out to follow, no springs
const MOVE = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };
const FOLLOW = { duration: 0.3, ease: [0, 0, 0.2, 1] };
const two = (n: number) => String(n).padStart(2, '0');
// a shift of the image (in % of its frame) moves its embedding through a fixed linear map: an illustration of a learned one
const cl = (v: number) => Math.max(-44, Math.min(44, v));
const emb = (x, y) => [cl(x * 2 + y * 0.7), cl(y * 1.9 - x * 0.6)];
const pct = (v: number) => v + '%';
// other images' embeddings, fixed (a seeded scatter)
const r2 = (v: number) => Math.round(v * 100) / 100;
const CLOUD = Array.from({ length: 34 }, (_, i) => { const a = i * 2.39996, r = 14 + ((i * 37) % 31); return [r2(Math.cos(a) * r), r2(Math.sin(a) * r * 0.86)]; });
const useIso = typeof window === 'undefined' ? () => {} : useLayoutEffect;
const LOSSES = ['Huber', 'cycle-consistency', 'VICReg'];

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

interface LossesProps {
  v: number[];
}
function Losses({ v }: LossesProps) {
  const top = v.indexOf(Math.max(...v));
  return (
    <div className="jn-loss">
      {LOSSES.map((t, i) => (
        <div key={t} className={top === i ? 'on' : ''}>
          <span className="x-mono">{t}</span>
          <span className="jn-track"><motion.i initial={false} animate={{ scaleX: v[i] }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} /></span>
        </div>
      ))}
    </div>
  );
}

/* Figure 1, the signature: two saccades while it is on screen, then it rests on the last step. */
const PHASE = ['image at rest', 'shift the image', 'predict how its embedding moves', 'shift back', 'check it lands where it started'];
const SHIFTS = [[12, -8], [-10, 8], [9, 11], [-12, -6]];
const MISS = [[6, -7], [-7, 6], [7, 5], [-6, -7]];
const LEAN = [[0.14, 0.1, 0.46], [0.22, 0.14, 0.52], [0.82, 0.22, 0.48], [0.4, 0.78, 0.56], [0.14, 0.12, 0.46]];

interface PauseIProps {
  held: boolean;
}
const PauseI = ({ held }: PauseIProps) => (held
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);
const ReplayI = () => <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.2 6a3.8 3.8 0 1 0 1.1-2.7M2.2 1.6v2.1h2.1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* MASTER 4.1: the demo runs once (two saccades, about 10 s), then rests on "check it lands where it started"; the
   same button then replays it. */
const PASSES = 2;
function Figure1() {
  const [ref, seen, calm] = useLive(0.3);
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const live = seen && !held && !done;
  const ix = useMotionValue(0), iy = useMotionValue(0);
  const ex = useTransform([ix, iy], ([x, y]) => pct(emb(x, y)[0]));
  const ey = useTransform([ix, iy], ([x, y]) => pct(emb(x, y)[1]));
  const [ph, setPh] = useState(0);
  const [k, setK] = useState(0);
  useEffect(() => { if (calm) { ix.set(SHIFTS[0][0]); iy.set(SHIFTS[0][1]); setPh(2); } }, [calm, ix, iy]);
  useEffect(() => {
    if (!live) return;
    const [sx, sy] = SHIFTS[k % 4];
    const last = k % PASSES === PASSES - 1;
    const ts = [
      [600, () => { setPh(1); animate(ix, sx, MOVE); animate(iy, sy, MOVE); }],
      [1500, () => setPh(2)],
      [2900, () => { setPh(3); animate(ix, 0, MOVE); animate(iy, 0, MOVE); }],
      [3800, () => setPh(4)],
      [last ? 4700 : 5300, () => { if (last) setDone(true); else { setPh(0); setK((v) => v + 1); } }],
    ].map(([t, f]) => setTimeout(f, t));
    return () => ts.forEach(clearTimeout);
  }, [k, live, ix, iy]);
  const press = () => {
    if (done) { setDone(false); setHeld(false); setPh(0); setK((v) => v + 1); } else setHeld(!held);
  };
  const [sx, sy] = SHIFTS[k % 4];
  const [tx, ty] = emb(sx, sy);
  const guess = [tx + MISS[k % 4][0], ty + MISS[k % 4][1]];
  return (
    <figure className="jn-f1" ref={ref}>
      <div className="jn-f1-row">
        <div className="jn-pane">
          <p className="jn-pk x-mono"><b>a</b> input</p>
          <div className="jn-frame" aria-hidden="true">
            <motion.span className="jn-img" style={{ x: useTransform(ix, pct), y: useTransform(iy, pct) }}><Img src={IMG} alt="" w={1200} h={1500} priority draggable={false} /></motion.span>
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
          <p><span><b>Figure 1.</b> Saccade JEPA, step by step:</span> <span className="jn-phase x-mono">{PHASE[ph]}</span></p>
          {!calm && <button type="button" className={'jn-pause' + (done ? ' done' : '')} onClick={press} aria-pressed={done ? undefined : held} aria-label={done ? 'Replay Figure 1' : held ? 'Play Figure 1' : 'Pause Figure 1'}>{done ? <ReplayI /> : <PauseI held={held} />}</button>}
        </div>
      </figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className="jn-hero" aria-labelledby="jn-h1">
      <div className="bz-wrap jn-hero-in">
        <div className="bz-grid jn-hero-top">
          <div className="jn-hero-copy">
            <BizLines as="h1" id="jn-h1" className="bz-display" lines={['Research on learning', 'without labels']} now delay={0.2} />
            <p className="jn-byline"><span className="x-mono jn-name">Jin</span><span className="x-mono">hanzoai/jin</span></p>
            <div className="jn-acts">
              <Cta to={DOCS} id="jin.hero" thumb>Read the docs</Cta>
              <More to={GH}>View on GitHub</More>
            </div>
          </div>
          <div className="jn-abs">
            <p className="jn-abs-k x-mono">Abstract</p>
            <p className="bz-body">Eyes jitter constantly and the brain predicts what the jitter will do to the scene, so the model shifts an image, predicts how its embedding moves, and shifts back to check it lands where it started.</p>
          </div>
        </div>
        <div className="jn-hero-fig">
          <Figure1 />
        </div>
      </div>
    </section>
  );
}

/* The section figures: drawn diagrams, lettered; the legend under each says what the letters are, in Hanzo's words.
   Each lettered part is a <g data-k>, so a legend chip and its part of the drawing light each other. */
interface ArProps {
  id: string;
}
const Ar = ({ id }: ArProps) => <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className="mk" /></marker></defs>;
interface LProps {
  x: string;
  y: string;
  c: string;
  a?: boolean;
}
const L = ({ x, y, c, a }: LProps) => <text x={x} y={y} className={'lt' + (a ? ' a' : '')}>{c}</text>;
interface KProps {
  k?: string | number;
  children: ReactNode;
}
const K = ({ k = '', children }: KProps) => <g data-k={k}>{children}</g>;
const grid = (x0: number, y0: number, s: number, f: ((i: number) => "fa" | "sk") | ((i: number) => "sk" | "fz") | (() => string)) => Array.from({ length: 16 }).map((_, i) => <rect key={i} x={x0 + (i % 4) * s + 2} y={y0 + Math.floor(i / 4) * s + 2} width={s - 4} height={s - 4} rx="3" className={f(i)} />);
const seeded = (n: number, cx: string | number, cy: string | number, r: number, s: string | number) => Array.from({ length: n }, (_, i) => { const a = (i * 2.39996 + s) % 6.2832, d = r * Math.sqrt(((i * 7 + s * 13) % n) / n + 0.08); return [r2(cx + Math.cos(a) * d), r2(cy + Math.sin(a) * d * 0.8)]; });
const TRIP3 = 'M402 246 C 340 300, 140 300, 78 246';
const LOOP4 = 'M454 96 C 497.5 84, 517 130.5, 502 160.5 C 487 192, 430 192, 418 154.5 C 409 123, 427 100.5, 445 96';

const FIGS = [
  <svg key="f2" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a2" />
    <K>{grid(16, 100, 30, (i: number) => ([5, 6, 10].includes(i) ? 'fa' : 'sk'))}</K>
    <K k="a">
      <path className="sk" markerEnd="url(#jn-a2)" d="M140 140 C 162 140, 160 90, 186 90" />
      <rect x="190" y="60" width="96" height="60" rx="12" className="sk" /><L x="238" y="91" c="a" />
    </K>
    <K k="b">
      <path className="sk" markerEnd="url(#jn-a2)" d="M140 180 C 162 180, 160 230, 186 230" />
      <rect x="190" y="200" width="96" height="60" rx="12" className="sk" /><L x="238" y="231" c="b" />
      <path className="sa dash" markerEnd="url(#jn-a2)" d="M238 124 V 194" />
    </K>
    <K k="c">
      <path className="sk" markerEnd="url(#jn-a2)" d="M286 90 H 326" />
      <rect x="330" y="60" width="96" height="60" rx="12" className="sk fa-soft" /><L x="378" y="91" c="c" a />
    </K>
    <K k="d">
      <path className="sk" markerEnd="url(#jn-a2)" d="M426 90 H 446" />
      <circle cx="456" cy="90" r="8" className="sa" />
      <path className="sk" markerEnd="url(#jn-a2)" d="M286 230 H 446" />
      <circle cx="456" cy="230" r="8" className="fk" />
      <path className="sa" d="M456 104 V 216" strokeDasharray="2 6" />
      <L x="456" y="296" c="d" />
    </K>
  </svg>,
  <svg key="f3" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a3" />
    {[[20, 0, 0, ''], [190, 16, -10, 'a'], [360, 0, 0, 'c']].map(([x, dx, dy, k], i) => (
      <K key={i} k={k}>
        <rect x={x} y="30" width="100" height="100" rx="10" className="sk" />
        <circle cx={x + 50 + dx} cy={80 + dy} r="22" className={i === 1 ? 'fk' : 'fg'} />
        <rect x={x + 22} y="52" width="56" height="56" rx="6" className="sd" />
        <path className="sg dash" d={`M${x + 50} 136 V 214`} />
      </K>
    ))}
    <K k="a"><path className="sk" markerEnd="url(#jn-a3)" d="M126 80 H 184" /><L x="155" y="62" c="a" /></K>
    <K k="c"><path className="sk" markerEnd="url(#jn-a3)" d="M296 80 H 354" /><L x="325" y="62" c="c" /></K>
    <K><circle cx="70" cy="226" r="7" className="fk" /></K>
    <K k="b">
      <circle cx="240" cy="226" r="7" className="fk" />
      <circle cx="254" cy="214" r="13" className="sa" /><L x="282" y="204" c="b" a />
    </K>
    <K k="d">
      <circle cx="410" cy="226" r="7" className="fk" /><circle cx="410" cy="226" r="16" className="sa" />
      <path className="sa dash" markerEnd="url(#jn-a3)" d={TRIP3} data-scrub="" />
      <L x="240" y="306" c="d" a />
      {/* scrubbed with the scroll: a point rides the round trip while this chapter is read */}
      <circle r="5" className="jn-scrub" transform="translate(402 246)" />
      {/* drawn in once: a point travels the round trip and lands where it started */}
      <circle r="6" className="jn-trip"><animateMotion dur="1.2s" begin="indefinite" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1" path={TRIP3} /></circle>
    </K>
  </svg>,
  /* the three losses on one shared axis, weighted: the prediction's Huber leads, the round trip and VICReg follow */
  <svg key="f4" viewBox="0 0 720 270" className="jn-svg wide" aria-hidden="true">
    <K>
      <path className="sk" d="M20 232 H 700" />
      <path className="sk" d="M170 226 V 238 M460 226 V 238 M631 226 V 238" />
    </K>
    <K k="a">
      <path className="sg" d="M30 210 H 310 M170 40 V 214" />
      <path className="sa thick" d={Array.from({ length: 61 }, (_, i) => { const x = -60 + i * 2, h = Math.abs(x) <= 20 ? (x * x) / 40 : Math.abs(x) - 10; return `${i ? 'L' : 'M'}${r2(170 + x * 2.3)} ${r2(210 - h * 2.8)}`; }).join(' ')} />
      <L x="170" y="256" c="a" />
    </K>
    <K k="b">
      <path className="sk thick" d={LOOP4} data-scrub="" />
      <circle cx="454" cy="96" r="6" className="fk" /><circle cx="445" cy="96" r="6" className="sa" />
      <circle r="5" className="jn-scrub" transform="translate(454 96)" />
      <circle r="4.5" className="jn-trip"><animateMotion dur="1.4s" begin="indefinite" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1" path={LOOP4} /></circle>
      <L x="460" y="256" c="b" a />
    </K>
    <K k="c">
      {Array.from({ length: 36 }).map((_, i) => { const r = Math.floor(i / 6), c = i % 6, d = r === c; return <rect key={i} x={590 + c * 14} y={112 + r * 14} width="12" height="12" rx="2" className={d ? 'fk' : (r + c) % 4 === 1 ? 'fl' : 'fz'} />; })}
      <L x="631" y="256" c="c" />
    </K>
  </svg>,
  <svg key="f5" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <Ar id="jn-a5" />
    <K k="a">{grid(14, 100, 28, (i: number) => ([0, 2, 3, 5, 7, 8, 9, 11, 12, 14, 15].includes(i) ? 'fz' : 'sk'))}<L x="72" y="268" c="a" /></K>
    <K k="b">
      <path className="sk" markerEnd="url(#jn-a5)" d="M132 156 H 156" />
      <path className="sk fz-soft" d="M160 96 L 216 130 V 182 L 160 216 Z" />
      <circle cx="240" cy="156" r="10" className="fk" />
      <L x="188" y="268" c="b" />
    </K>
    <K k="c"><path className="sa dash fa-soft" d="M264 130 L 320 96 V 216 L 264 182 Z" /><L x="292" y="268" c="c" a /></K>
    <K k="d">
      <path className="sk" markerEnd="url(#jn-a5)" d="M324 156 H 348" />
      {grid(352, 100, 28, () => 'sg')}
      <L x="408" y="268" c="d" />
    </K>
  </svg>,
  <svg key="f6" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    {/* the clusters start bunched at the middle and separate by class when drawn in */}
    <K k="a">
      {[[120, 120, 0, 'fk'], [250, 90, 3, 'fg'], [170, 230, 5, 'fl'], [300, 210, 7, 'fo']].map(([cx, cy, s, c]) => (
        <g key={c} className="jn-clu" style={{ '--x': (210 - cx) * 0.8 + 'px', '--y': (165 - cy) * 0.8 + 'px' }}>
          {seeded(16, cx, cy, 48, s).map(([x, y], i) => <circle key={c + i} cx={x} cy={y} r="5" className={c} />)}
        </g>
      ))}
      <L x="200" y="300" c="a" />
    </K>
    <K k="b">
      {Array.from({ length: 25 }).map((_, i) => { const r = Math.floor(i / 5), c = i % 5, d = Math.hypot(r - 1.6, c - 2.6); return <rect key={i} x={366 + c * 20} y={40 + r * 20} width="19" height="19" className="fa" opacity={Math.max(0.08, 1 - d / 2.6).toFixed(2)} />; })}
      <rect x="366" y="40" width="99" height="99" className="sk" fill="none" />
      <L x="416" y="168" c="b" a />
    </K>
  </svg>,
  <svg key="f7" viewBox="0 0 480 320" className="jn-svg" aria-hidden="true">
    <K k="a">
      <path className="sg" d="M150 50 L 90 110 M150 50 L 210 110 M90 110 L 60 170 M90 110 L 120 170 M210 110 L 180 170 M210 110 L 240 170" />
      {[[150, 50], [90, 110], [210, 110], [60, 170], [120, 170], [180, 170], [240, 170]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i ? (i < 3 ? 12 : 9) : 16} className={i ? 'fk' : 'fa'} />)}
      <L x="150" y="230" c="a" />
    </K>
    <K k="b">
      <rect x="320" y="120" width="110" height="110" rx="14" className="sk" />
      <rect x="345" y="145" width="60" height="60" rx="6" className="fk" />
      {[0, 1, 2, 3].map((i) => <path key={i} className="sk" d={`M${340 + i * 22} 120 V 106 M${340 + i * 22} 230 V 244 M320 ${140 + i * 22} H 306 M430 ${140 + i * 22} H 444`} />)}
      <L x="375" y="290" c="b" />
    </K>
    <K k="c">
      <path className="sg" d="M352 76 A 30 30 0 0 1 398 76 M362 88 A 16 16 0 0 1 388 88" />
      <path className="sa thick" d="M346 56 L 404 100" />
      <L x="430" y="52" c="c" a />
    </K>
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
// chapter 3 breaks out of the stage at full width; the others share the pinned plate (run a: 1-2, run b: 4-6)
const BREAK = 2;
const run = (i: number) => (i < BREAK ? ' ra' : ' rb');

/* Each figure is an authored scene that draws itself in: strokes draw (pathLength, 1.1 s ease-in-out, 50 ms apart),
   marks and mask cells fill after them, dashed guides and letters land last, and a point travels the round trip
   where the figure has one. On the pinned stage (desktop) the plate draws the old figure out and the new one in each
   time a chapter crosses the line; stacked (phone, or the break-out chapter) a figure draws in once at 60% visible.
   The server HTML is the finished drawing; JS off, reduced motion and a figure already on screen show it as is. */
function useDraw(staged: boolean | undefined, on: boolean | undefined) {
  const ref = useRef(null);
  const prep = useRef<boolean | null>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    if (prep.current === null) {
      prep.current = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prep.current) {
        let s = 0, f = 0;
        el.querySelectorAll('svg .sk, svg .sa, svg .sg').forEach((n) => {
          if (n.closest('marker') || n.classList.contains('dash') || n.hasAttribute('stroke-dasharray')) return;
          n.setAttribute('pathLength', '1');
          n.classList.add('jn-dw');
          n.style.transitionDelay = Math.min(s++, 12) * 50 + 'ms';
        });
        el.querySelectorAll('svg .fk, svg .fa, svg .fg, svg .fl, svg .fz, svg .fo').forEach((n) => { n.style.transitionDelay = 320 + Math.min(f++, 40) * 20 + 'ms'; });
      }
    }
    if (!prep.current) return;
    if (staged) { setArmed(true); return; }
    if (seen || el.getBoundingClientRect().top < innerHeight) { setSeen(true); return; }
    setArmed(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setSeen(true); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [staged]);
  const drawn = staged ? on : seen;
  useEffect(() => {
    if (!armed || !drawn) return;
    const t = setTimeout(() => ref.current?.querySelectorAll('animateMotion').forEach((a) => a.beginElement && a.beginElement()), 900);
    return () => clearTimeout(t);
  }, [armed, drawn]);
  return [ref, armed ? ' armed' + (drawn ? ' drawn' : '') : ''];
}

interface FigProps {
  i: number;
  keys: string | string[];
  plate?: boolean;
  staged?: boolean;
  on?: boolean;
}
function Fig({ i, keys, plate, staged, on }: FigProps) {
  const [ref, st] = useDraw(plate && staged, on);
  const [hot, setHot] = useState(null);
  // left alone, a drawn figure walks itself through its lettered parts (a, b, c...), one at a time, then rests whole
  const [walk, setWalk] = useState(-1);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const live = !calm && seen && (!plate || !staged || on) && hot === null && st.includes('drawn');
  useEffect(() => {
    if (!live) { setWalk(-1); return; }
    const t = setTimeout(() => setWalk((w) => (w + 1 > keys.length ? -1 : w + 1)), walk === -1 ? 2400 : walk === keys.length ? 600 : 1600);
    return () => clearTimeout(t);
  }, [live, walk, keys.length]);
  const lit = walk >= 0 && walk < keys.length ? 'abcd'[walk] : null;
  const over = (e: React.PointerEvent<HTMLDivElement>) => { const g = e.target.closest?.('[data-k]'); setHot(g && g.dataset.k ? g.dataset.k : null); };
  return (
    <figure
      ref={ref} data-fig={i} data-hot={hot || undefined} data-walk={lit || undefined}
      className={'jn-mfig' + (plate ? ' jn-pfig' + run(i) + (on ? ' on' : '') : '') + st}
      style={plate ? { '--o': 2 * i + (i % 2 ? 0 : 1) } : undefined}
      aria-hidden={plate && staged && !on ? 'true' : undefined}
    >
      <i className="jn-scrub-bar" aria-hidden="true" />
      <div className="jn-fsvg" onPointerOver={over} onPointerLeave={() => setHot(null)}>{FIGS[i]}</div>
      <figcaption>
        <span className="x-mono">Figure {i + 2}</span>
        <ul>
          {keys.map((k, j) => {
            const c = 'abcd'[j];
            return <li key={k} className={hot === c ? 'on' : lit === c && !hot ? 'walk' : ''} onPointerEnter={() => setHot(c)} onPointerLeave={() => setHot(null)} onClick={() => setHot(hot === c ? null : c)}><b className="x-mono">{c}</b>{k}</li>;
          })}
        </ul>
      </figcaption>
    </figure>
  );
}

/* The repository as one pinned stage: the six numbered chapters scroll on the left under a running head, and the plate
   pinned on the right redraws as each chapter crosses the line; chapter 3 breaks out at full width between the two
   runs of the plate. Under 900px it stacks. */
function Paper() {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [staged, setStaged] = useState(false);
  useIso(() => {
    const mq = matchMedia('(min-width: 901px)');
    const f = () => setStaged(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    const root = ref.current;
    const secs = [...root.querySelectorAll('[data-sec]')];
    const figs = secs.map((_, i) => root.querySelector(`[data-fig="${i}"]`));
    const scrubs = figs.map((f) => { const p = f?.querySelector('[data-scrub]'), d = f?.querySelector('.jn-scrub'); return p && d ? [p, d, p.getTotalLength()] : null; });
    let raf = 0;
    const tick = () => {
      raf = 0;
      const line = innerHeight * 0.55;
      let a = 0;
      secs.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line) a = i;
        const p = Math.max(0, Math.min(1, (line - r.top) / Math.max(1, r.height)));
        figs[i]?.style.setProperty('--p', p.toFixed(3));
        const s = scrubs[i];
        if (s) { const pt = s[0].getPointAtLength(p * s[2]); s[1].setAttribute('transform', `translate(${r2(pt.x)} ${r2(pt.y)})`); }
      });
      setAt(a);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
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
      <div className="bz-wrap">
        {[[0, BREAK], [BREAK, BREAK + 1], [BREAK + 1, SECS.length]].map(([a, b]) => {
          const ch = SECS.slice(a, b).map(([t, lines, d, key], j) => {
            const i = a + j;
            return [
              <section key={t} className={'jn-ch c' + i + (at === i ? ' on' : '')} data-sec={i} aria-labelledby={'jn-s' + i} style={{ '--o': 2 * i + (i % 2 ? 1 : 0) }}>
                <p className="jn-num" aria-hidden="true">{i + 1}</p>
                <div className="jn-txt">
                  <BizLines id={'jn-s' + i} className="bz-headline jn-h" lines={lines} />
                  <p className="bz-body">{d}</p>
                </div>
                {i === BREAK && <Fig i={i} keys={key} />}
              </section>,
              // while chapter 3 is read, plate a leaves still showing its last figure
              i !== BREAK && <Fig key={t + '-f'} i={i} keys={key} plate staged={staged} on={at === i || (at === BREAK && i === BREAK - 1)} />,
            ];
          });
          // a run of the pinned stage is its own box, so its plate unpins where the run ends
          return a === BREAK ? ch : <div key={a} className={'jn-stage' + run(a)}><i className="jn-plate" aria-hidden="true" />{ch}</div>;
        })}
      </div>
    </div>
  );
}

/* Figure 8's own read-out: the three losses plotted as a trace over your drags (Figure 1 shows them as bars). */
const N = 96;
const REST = [0.12, 0.1, 0.46];
interface TraceProps {
  hist: number[][];
}
function Trace({ hist }: TraceProps) {
  const now = hist[hist.length - 1];
  const top = now.indexOf(Math.max(...now));
  const pts = (k: number) => hist.map((v, i) => `${r2((i / (N - 1)) * 300)},${r2(94 - v[k] * 86)}`).join(' ');
  return (
    <div className="jn-trc">
      <p className="jn-pk x-mono"><b>c</b> losses</p>
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="g" d="M0 94 H 300 M0 51 H 300 M0 8 H 300" />
        {[0, 1, 2].map((k) => <polyline key={k} className={'l' + k + (top === k ? ' on' : '')} points={pts(k)} />)}
      </svg>
      <ul className="jn-trc-k x-mono">{LOSSES.map((t, k) => <li key={t} className={'l' + k + (top === k ? ' on' : '')}><i />{t}</li>)}</ul>
    </div>
  );
}

/* Beyond, the one dark plate: drag the image yourself; the predictor follows, and on release the image shifts back. */
function Yours() {
  const box = useRef<HTMLDivElement>(null);
  const ix = useMotionValue(0), iy = useMotionValue(0);
  const W = useRef(400);
  const e = useTransform([ix, iy], ([x, y]) => emb((x / W.current) * 140, (y / W.current) * 140));
  const exn = useTransform(e, (v) => v[0]), eyn = useTransform(e, (v) => v[1]);
  // the predictor's guess follows the embedding a beat behind (a tween each time it moves; no spring)
  const pxn = useMotionValue(0), pyn = useMotionValue(0);
  useEffect(() => { const a = exn.on('change', (v) => animate(pxn, v, FOLLOW)); const b = eyn.on('change', (v) => animate(pyn, v, FOLLOW)); return () => { a(); b(); }; }, [exn, eyn, pxn, pyn]);
  const [state, setState] = useState('rest');
  const [hist, setHist] = useState(() => Array.from({ length: N }, () => REST));
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
      const v = [Math.min(1, 0.1 + miss / 14), Math.min(1, 0.08 + (mode.current === 'back' ? far / 26 : far / 70)), Math.min(0.9, 0.44 + far / 160)];
      setHist((h) => [...h.slice(1), v]);
      const m = mode.current;
      if (m === 'out' || m === 'back') {
        setTrail((t) => ({ ...t, [m]: [...t[m], [x, y]].slice(-80) }));
        if (m === 'back' && far < 0.6) { mode.current = 'landed'; setState('landed'); setHist((h) => [...h.slice(1), REST]); }
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
    touched.current = true;
    ev.preventDefault();
    start();
    const s = W.current * 0.1;
    animate(ix, d[0] * s, MOVE); animate(iy, d[1] * s, { ...MOVE, onComplete: () => setTimeout(() => { end(); animate(ix, 0, MOVE); animate(iy, 0, MOVE); }, 500) });
  };
  // arriving, the plate makes one saccade by itself (a short shift and back) so the read-out shows what a drag does;
  // a hand that gets there first, or reduced motion, skips it
  const touched = useRef(false);
  const calm = useReducedMotion();
  const shown = useInView(box, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!shown || calm || touched.current) return;
    let t2 = 0;
    const t1 = setTimeout(() => {
      if (touched.current) return;
      start();
      const s = W.current;
      animate(ix, s * 0.14, MOVE); animate(iy, -s * 0.08, { ...MOVE, onComplete: () => { t2 = setTimeout(() => { if (touched.current) return; end(); animate(ix, 0, MOVE); animate(iy, 0, MOVE); }, 700); } });
    }, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [shown, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const line = (pts) => pts.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <section className="bz-sec jn-try" data-room="dark" aria-labelledby="jn-try-h">
      <div className="bz-wrap bz-grid">
        <header className="jn-try-head">
          <BizLines id="jn-try-h" className="bz-headline" lines={['Make the saccade yourself']} />
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
                  className="jn-img grab" style={{ x: ix, y: iy }} drag dragConstraints={box} dragElastic={0.12} dragMomentum={false}
                  onPointerDown={() => { touched.current = true; }} onDragStart={start} onDragEnd={() => { end(); animate(ix, 0, MOVE); animate(iy, 0, MOVE); }}
                  tabIndex={0} role="img" aria-label="An image you can drag; arrow keys shift it too" onKeyDown={nudge}
                ><Img src={IMG} alt="" w={1200} h={1500} draggable={false} /></motion.span>
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
          <Trace hist={hist} />
        </div>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
const TABLE = [['I-JEPA', 'Reference build'], ['Saccade', 'Our own variant'], ['MAE', 'Self-distilled'], ['Papers', 'Edge AI proposals']];
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Plus = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
const Close = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

/* Table 1's sheet: a native <dialog> opened with showModal() (MASTER part 8): focus is trapped by the browser, Esc
   and the backdrop close it, focus returns to the button. It slides in from the right (from the bottom on phones)
   and slides out before it closes. */
interface SheetProps {
  label: string;
  title: string;
  kick: string;
  children: ReactNode;
}
function Sheet({ label, title, kick, children }: SheetProps) {
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const show = () => {
    dlg.current?.showModal();
    setOpen(true);
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
  };
  const shut = () => {
    if (!dlg.current?.open || leaving) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeaving(true);
    setTimeout(() => { dlg.current?.close(); setLeaving(false); }, calm ? 0 : 280);
  };
  const closed = () => {
    setOpen(false);
    window.__lenis?.start();
    document.documentElement.classList.remove('x-lock');
    btn.current?.focus({ preventScroll: true });
  };
  useEffect(() => () => { window.__lenis?.start(); document.documentElement.classList.remove('x-lock'); }, []);
  return (
    <div className="jn-sheet-wrap">
      <button ref={btn} type="button" className="bz-sheet-btn jn-sheet-btn" aria-haspopup="dialog" aria-expanded={open} onClick={show}><Plus />{label}</button>
      <dialog
        ref={dlg} className={'jn-dlg' + (leaving ? ' out' : '')} aria-labelledby="jn-dlg-h" data-lenis-prevent=""
        onCancel={(e) => { e.preventDefault(); shut(); }} onClose={closed}
        onClick={(e) => { if (e.target === dlg.current) shut(); }}
      >
        <div className="bz-sheet-top">
          <div>
            <h2 id="jn-dlg-h">{title}</h2>
            {kick && <p className="bz-kick">{kick}</p>}
          </div>
          <button type="button" className="bz-sheet-x" aria-label="Close" onClick={shut}><Close /></button>
        </div>
        <div className="bz-sheet-body">{children}</div>
      </dialog>
    </div>
  );
}

/* The close: one sentence at Display size, the same solid ask, and full-width text rows for everything else; Table 1
   and the agent prompt live in a sheet. */
function End() {
  return (
    <section className="bz-sec jn-end" aria-labelledby="jn-end-h">
      <div className="bz-wrap">
        <p className="jn-proof x-mono"><span>hanzoai/jin</span><span>License: Apache-2.0</span></p>
        <div className="jn-end-top">
          <BizLines id="jn-end-h" className="bz-display md" lines={['Read the code']} />
          <Cta to={DOCS} id="jin.close" size="lg" thumb>Read the docs</Cta>
        </div>
        <ul className="jn-rows">
          <li><A to={GH} className="jn-row"><b>View on GitHub</b><span className="x-mono"><Gh />hanzoai</span><Arrow /></A></li>
          <li><A to="https://platform.hanzo.ai/deploy" className="jn-row"><b>Get Jin</b><span><span>Multimodal foundation model</span> <i className="x-mono">License: Apache-2.0</i></span><em><span>Deploy to Cloud</span></em><Arrow /></A></li>
          <li className="jn-row-sheet">
            <Sheet label="See Table 1" kick="Table 1" title="What is in the repository">
              <DataTable className="jn-table" caption="Table 1" cols={[{ key: 'a', label: '' }, { key: 'b', label: '' }]} rows={TABLE.map(([a, b]) => ({ a, b }))} />
              <BizPaste name="Jin" prompt="Read https://hanzo.ai/skill.md and use Hanzo Jin in my project." className="jn-paste" />
            </Sheet>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* The header ask on phones (MASTER part 4, the sticky ask): the shared Ask swaps the header's button to the page's own
   ask only above 700px, so the phone header kept a solid "Try Hanzo" beside the hero's solid "Read the docs". Here, on
   phones only, the same move: the header's button is an outline while either "Read the docs" is on screen, and once
   they are gone by it becomes the solid "Read the docs". The phone's bottom bar is then not needed (data-ask="off"),
   so one solid shows at a time. Desktop is left to the shared Ask; everything is put back on leaving. Filed in
   docs/build-notes/requests/jin.md. */
function usePhoneAsk() {
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    const H = document.documentElement;
    let off = () => {};
    const start = () => {
      off();
      const main = document.querySelector('main');
      const btn = document.querySelector('header[data-slot=masthead] a[data-x-ask], header[data-slot=masthead] a[href="https://hanzo.ai/signup"]');
      if (!mq.matches || !main || !btn) { main?.removeAttribute('data-ask'); return; }
      main.setAttribute('data-ask', 'off');
      if (!btn.dataset.xAsk) { btn.dataset.xAsk = btn.textContent; btn.dataset.xHref = btn.getAttribute('href'); }
      const asks = [...document.querySelectorAll('main [data-cta="jin.hero"], main [data-cta="jin.close"]')];
      const seen = new Map();
      const set = () => {
        const any = [...seen.values()].some(Boolean);
        btn.textContent = any ? btn.dataset.xAsk : 'Read the docs';
        btn.setAttribute('href', any ? btn.dataset.xHref : DOCS);
        if (any) { btn.removeAttribute('data-cta'); H.dataset.ask = 'quiet'; } else { btn.setAttribute('data-cta', 'header-ask'); delete H.dataset.ask; }
      };
      const io = new IntersectionObserver((es) => { es.forEach((e) => seen.set(e.target, e.isIntersecting)); set(); });
      asks.forEach((a) => io.observe(a));
      off = () => {
        io.disconnect();
        btn.textContent = btn.dataset.xAsk; btn.setAttribute('href', btn.dataset.xHref); btn.removeAttribute('data-cta');
        delete H.dataset.ask;
      };
    };
    const t = setTimeout(start, 300);
    mq.addEventListener('change', start);
    return () => { clearTimeout(t); off(); mq.removeEventListener('change', start); document.querySelector('main')?.removeAttribute('data-ask'); };
  }, []);
}

export default function Jin() {
  usePhoneAsk();
  return (
    <main className="bz jn">
      <span data-ask-name="Jin" hidden />
      <Hero />
      <Paper />
      <Yours />
      <End />
    </main>
  );
}
