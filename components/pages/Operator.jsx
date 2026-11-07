'use client';
// Persona: a platform engineer running the stack on Kubernetes.
// Goal: install the operator.
// CTA: View on GitHub (operator.hero); the close is Deploy to Cloud in the Band.
// Metric: cta_click operator.hero
// Signature: drift, reverted, said out loud: a live cluster board where something drifts and the next sweep puts it back.
// Beyond: drag any resource out of place yourself (or press it) and watch the next sweep revert it, with the log saying so.
/* Hanzo Operator.
   V2: 8/10 the deck scale (h1 52, sections 26, card titles 21); a dark control room as the hero where the cluster drifts and the operator puts it back (pausable, drag a resource yourself), thirty objects collapsing into one declaration, the six points on a scroll-driven horizontal track, kit Cta and Band. Greys only.
   Signature: drift, reverted, said out loud. The hero is a live cluster board: ten Kinds in their desired places, a
   sweep crossing them on a loop. Between sweeps something drifts out of place; on the next sweep the operator moves it
   back and the log says what it did (created, reverted, or already in sync). A pause control stops the loop.
   Then "Declare the thing, not the thirty objects": thirty loose objects converge, scrubbed by scroll, into one
   declared Kind. The six points ride a horizontal track that your vertical scroll drives (a swipe rail on phones).
   Every word is Hanzo's; the log uses only Hanzo's own words (drift, sweep, created, reverted, already in sync). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta, Band } from '../kit';
import { Copy } from '../ui';
import MaskLines from './proof/MaskLines';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import useNarrow from '../v2/A2Narrow';
import A2Pause from '../v2/A2Pause';
import { T, EMPH } from '../v2/A2Motion';
import '../v2/A2.css';
import './Operator.css';

const GH = 'https://github.com/hanzoai';
const KINDS = [['Service'], ['Datastore', 'SQL · KV · DocDB · S3'], ['Gateway'], ['Ingress'], ['DNS'], ['Base'], ['IAM'], ['KMS'], ['MPC'], ['KMSSecret', 'kms.hanzo.ai']];
const SPRING = { duration: T.slower, ease: EMPH }; // a tween, not a spring (no overshoot)

/* drag only with a fine pointer: on touch a swipe must scroll the page, and a tap drifts the tile instead */
function useFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => { const m = matchMedia('(pointer: fine)'); const f = () => setFine(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return fine;
}

function Tile({ k, sub, i, mv, onDrift, fine, box }) {
  return (
    <motion.button type="button" className={'xop-tile' + (fine ? ' fine' : '')} style={{ x: mv.x, y: mv.y }} drag={fine} dragConstraints={box} dragMomentum={false} dragElastic={0}
      onDragEnd={() => onDrift(i)} onClick={() => { if (Math.abs(mv.x.get()) + Math.abs(mv.y.get()) < 2) { animate(mv.x, i % 2 ? 26 : -26, SPRING); animate(mv.y, 14, SPRING); onDrift(i); } }}
      aria-label={'Drift ' + k} whileDrag={{ scale: 1.05, zIndex: 5 }}>
      <span className="xop-tile-k">{k}</span>
      {sub && <span className="xop-tile-s x-mono">{sub}</span>}
      <i aria-hidden="true" />
    </motion.button>
  );
}

/* The control room: a sweep every few seconds; drift between sweeps; reverted on the sweep. */
function Board() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const xs = KINDS.map(() => useMotionValue(0)); // eslint-disable-line react-hooks/rules-of-hooks -- KINDS never changes length
  const ys = KINDS.map(() => useMotionValue(0)); // eslint-disable-line react-hooks/rules-of-hooks
  const [n, setN] = useState(0);
  const [log, setLog] = useState([{ id: 0, t: 'operator up', k: '' }]);
  const [lit, setLit] = useState(-1);
  const [paused, setPaused] = useState(false);
  const drifted = useRef(new Set());
  const id = useRef(1);
  const fine = useFine();
  const box = useRef(null); // dragged tiles stay inside the board
  const say = (lines) => setLog((l) => [...lines.map(([t, k]) => ({ id: id.current++, t, k })).reverse(), ...l].slice(0, 7));
  const onDrift = (i) => { drifted.current.add(i); say([[KINDS[i][0], 'drift']]); };
  const sweep = (s) => {
    const lines = [];
    if (s === 1) lines.push(['sweep', 'created']);
    else {
      KINDS.forEach((kd, i) => {
        const off = Math.abs(xs[i].get()) + Math.abs(ys[i].get()) > 2;
        if (off || drifted.current.has(i)) { lines.push([kd[0], 'reverted']); animate(xs[i], 0, SPRING); animate(ys[i], 0, SPRING); }
      });
      drifted.current.clear();
      lines.push(['sweep', 'already in sync']);
    }
    say(lines);
  };
  useEffect(() => {
    if (!seen || calm || paused) return;
    let s = n, t1 = 0, t2 = 0, t3 = 0;
    const lap = () => {
      s += 1; setN(s); setLit(s);
      t1 = setTimeout(() => sweep(s), 1100);
      if (!drifted.current.size) t2 = setTimeout(() => { const i = (s * 3) % KINDS.length; animate(xs[i], s % 2 ? 34 : -30, SPRING); animate(ys[i], s % 3 ? 18 : -16, SPRING); drifted.current.add(i); say([[KINDS[i][0], 'drift']]); }, 2400);
      t3 = setTimeout(lap, 4600);
    };
    t3 = setTimeout(lap, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [seen, calm, paused]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'xop-board' + (paused ? ' a2-paused' : '')} ref={ref}>
      <div className="xop-board-top"><A2Pause paused={paused} onChange={setPaused} label="Pause" /><span className="x-mono"><i className="xop-live" />sweep</span></div>
      <div className="xop-grid" ref={box}>
        {KINDS.map(([k, sub], i) => <Tile key={k} k={k} sub={sub} i={i} mv={{ x: xs[i], y: ys[i] }} onDrift={onDrift} fine={fine} box={box} />)}
        <span className="xop-sweep" key={lit} aria-hidden="true" />
      </div>
      <ol className="xop-log x-mono" aria-live="polite" aria-label="Operator log">
        {log.map((l) => <li key={l.id} className={'k-' + l.k.replace(/ /g, '-')}><span>{l.t}</span>{l.k && <b>{l.k}</b>}</li>)}
      </ol>
    </div>
  );
}

function Hero() {
  return (
    <section className="a2-dark xop-hero" data-room="dark" aria-labelledby="xop-h1">
      <div className="a2-wrap a2-grid xop-hero-grid">
        <div className="xop-hero-copy">
          <MaskLines as="h1" id="xop-h1" className="a2-display xop-h1" lines={['Hanzo', 'Operator']} amount={0.1} />
          <p className="a2-lede">One binary that runs the stack on Kubernetes</p>
          <div className="a2-acts"><Cta to={GH} id="operator.hero" thumb>View on GitHub</Cta><A to={GH} className="xop-repo x-mono">hanzoai/operator</A></div>
        </div>
        <motion.div className="xop-hero-obj" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.15 }}>
          <Board />
        </motion.div>
      </div>
    </section>
  );
}

/* Thirty loose objects converge into one declared Kind as you scroll. */
const LOOSE = Array.from({ length: 30 }, (_, i) => [((i * 47) % 100) - 50, ((i * 29) % 70) - 35, (i * 37) % 360]);

function Declare() {
  const ref = useRef(null);
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // applied after hydration, so server and client markup match
  useEffect(() => setCalm(!!rm), [rm]);
  // pinned: the scene holds the screen while the thirty come together, centred, then lets go
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const kv = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.08) / 0.7)));
  const k = calm ? 1 : kv;
  return (
    <section className="xop-declare" ref={ref} aria-labelledby="xop-declare-h">
      <div className="a2-wrap a2-grid xop-declare-stick">
        <div className="xop-declare-copy">
          <MaskLines id="xop-declare-h" className="a2-headline" lines={['Declare the thing,', 'not the thirty objects']} />
        </div>
        <motion.div className="xop-converge" style={{ '--k': k }} aria-hidden="true">
          {LOOSE.map(([x, y, r], i) => <i key={i} style={{ '--x': x, '--y': y, '--r': r + 'deg' }} />)}
          <div className="xop-one"><span className="x-mono">kind</span><b>Service</b></div>
        </motion.div>
      </div>
    </section>
  );
}

/* The six points ride a horizontal track that vertical scroll drives. */
const POINTS = [
  ['Kinds that know the stack', 'Service covers most workloads. Datastore covers the stateful ones and dispatches on its type, with SQL, KV, DocDB and S3 as thin facades over it. Gateway, Ingress, DNS, Base, IAM, KMS and MPC are their own Kinds, because each one wires up differently.', 'Service · Datastore · Gateway'],
  ['Secrets come from KMS', 'A KMSSecret is materialized beside the workload and synced from kms.hanzo.ai. What lives in git is the path to a secret, never the secret.', 'KMSSecret ← kms.hanzo.ai'],
  ['Drift is reverted, and said out loud', "Every sweep reads each object before it applies, then logs what it did to it: created, reverted, or already in sync. The resync interval is per-resource and clamped into a safe band, so a bad number can't turn the loop into a hot loop.", 'created · reverted · already in sync'],
  ['Git is a source, and it never deletes', "Point it at a repo and it applies what's there, on a tight poll a push webhook can interrupt for an instant sweep. A file removed from git is left alone — the plan type has no delete case, so pruning isn't something a bug can cause.", 'git → apply'],
  ['Every write is attributable', 'Server-side apply under its own field manager, so a git-driven apply never fights a per-Kind reconcile. Turn on autoscaling and the Deployment ships with no replica count at all — the autoscaler owns that field, alone.', 'server-side apply'],
  ['Install is one command', 'operator install lays down the CRDs, namespace, RBAC and Deployment. operator up does that and applies your resources behind it. Both are server-side apply, so running either again changes nothing.', 'operator up'],
];

function Track() {
  const ref = useRef(null);
  const row = useRef(null);
  const narrow = useNarrow();
  const calm = useReducedMotion();
  const [span, setSpan] = useState(0);
  useLayoutEffect(() => {
    const m = () => setSpan(row.current ? Math.max(0, row.current.scrollWidth - window.innerWidth) : 0);
    m();
    addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(p, (v) => (narrow || calm ? 0 : -Math.min(1, Math.max(0, (v - 0.04) / 0.92)) * span));
  const bar = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.04) / 0.92)));
  return (
    <section className="xop-track" ref={ref} style={{ '--span': span + 'px' }} aria-label="Six points">
      <div className="xop-track-stick">
        <motion.ol className="xop-row" ref={row} style={{ x }}>
          {POINTS.map(([t, d, code], i) => (
            <li key={t} className="xop-card">
              <h3 className="xop-card-t">{t}</h3>
              <p>{d}</p>
              <span className="xop-card-f"><code className="x-mono">{code}</code><span className="xop-card-n x-mono">{String(i + 1).padStart(2, '0')} / 06</span></span>
            </li>
          ))}
        </motion.ol>
        <div className="a2-wrap xop-bar" aria-hidden="true"><motion.i style={{ scaleX: bar }} /></div>
      </div>
    </section>
  );
}

function Get() {
  return (
    <section className="a2-sec xop-get" aria-labelledby="xop-get-h">
      <div className="a2-wrap">
        <div className="xop-get-card">
          <div>
            <h2 id="xop-get-h" className="a2-headline">Get Operator</h2>
            <p>K8s operator</p>
          </div>
          <p className="xop-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to={GH}>hanzoai</A></p>
          <p className="xop-get-cmd x-mono"><code>operator up</code><Copy text="operator up" /></p>
        </div>
      </div>
    </section>
  );
}

export default function Operator() {
  return (
    <main className="a2 xop">
      <Hero />
      <Declare />
      <Track />
      <A2Paste name="Operator" text="Read https://hanzo.ai/skill.md and use Hanzo Operator in my project." />
      <Get />
      <Band title="Get started with Hanzo Operator" action="Deploy to Cloud" to="https://platform.hanzo.ai/deploy" />
    </main>
  );
}
