'use client';
/* Hanzo Operator.
   V2: 8/10 a dark control room as the hero where the cluster drifts and the operator puts it back (drag a resource yourself), thirty objects collapsing into one declaration, the six points on a scroll-driven horizontal track.
   Signature: drift, reverted, said out loud. The hero is a live cluster board: ten Kinds in their desired places, a
   sweep crossing them on a loop. Between sweeps something drifts out of place; on the next sweep the operator springs
   it back and the log says what it did (created, reverted, or already in sync). You can drag any resource out of place
   yourself (or press it) and watch the next sweep revert it.
   Then "Declare the thing, not the thirty objects": thirty loose objects converge, scrubbed by scroll, into one
   declared Kind. The six points ride a horizontal track that your vertical scroll drives (a swipe rail on phones).
   Beyond: the drift you make is yours to test: any Kind, any distance, and the log tells you what the sweep did.
   Accent: teal, from the in-sync state. Every word is Hanzo's. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Go } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import useNarrow from '../v2/A2Narrow';
import '../v2/A2.css';
import './Operator.css';

const GH = 'https://github.com/hanzoai';
const KINDS = [['Service'], ['Datastore', 'SQL · KV · DocDB · S3'], ['Gateway'], ['Ingress'], ['DNS'], ['Base'], ['IAM'], ['KMS'], ['MPC'], ['KMSSecret', 'kms.hanzo.ai']];
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

function Tile({ k, sub, i, mv, onDrift }) {
  return (
    <motion.button type="button" className="xop-tile" style={{ x: mv.x, y: mv.y }} drag dragMomentum={false} dragElastic={0.2}
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
  const drifted = useRef(new Set());
  const id = useRef(1);
  const say = (lines) => setLog((l) => [...lines.map(([t, k]) => ({ id: id.current++, t, k })).reverse(), ...l].slice(0, 7));
  const onDrift = (i) => { drifted.current.add(i); say([[KINDS[i][0] + ' edited by hand in the cluster', 'drift']]); };
  const sweep = (s) => {
    const lines = [];
    if (s === 1) lines.push(['sweep 1', 'created']);
    else {
      KINDS.forEach((kd, i) => {
        const off = Math.abs(xs[i].get()) + Math.abs(ys[i].get()) > 2;
        if (off || drifted.current.has(i)) { lines.push([kd[0], 'reverted']); animate(xs[i], 0, SPRING); animate(ys[i], 0, SPRING); }
      });
      drifted.current.clear();
      lines.push(['sweep ' + s + ' · the rest', 'already in sync']);
    }
    say(lines);
  };
  useEffect(() => {
    if (!seen || calm) return;
    let s = n, t1 = 0, t2 = 0, t3 = 0;
    const lap = () => {
      s += 1; setN(s); setLit(s);
      t1 = setTimeout(() => sweep(s), 1100);
      if (!drifted.current.size) t2 = setTimeout(() => { const i = (s * 3) % KINDS.length; animate(xs[i], s % 2 ? 34 : -30, SPRING); animate(ys[i], s % 3 ? 18 : -16, SPRING); drifted.current.add(i); say([[KINDS[i][0] + ' edited by hand in the cluster', 'drift']]); }, 2400);
      t3 = setTimeout(lap, 4600);
    };
    t3 = setTimeout(lap, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="xop-board" ref={ref}>
      <div className="xop-board-top x-mono"><span><i className="xop-live" />cluster</span><span>sweep {Math.max(n, 1)}</span></div>
      <div className="xop-grid">
        {KINDS.map(([k, sub], i) => <Tile key={k} k={k} sub={sub} i={i} mv={{ x: xs[i], y: ys[i] }} onDrift={onDrift} />)}
        <span className="xop-sweep" key={lit} aria-hidden="true" />
      </div>
      <ol className="xop-log x-mono" aria-live="polite" aria-label="Operator log">
        {log.map((l) => <li key={l.id} className={'k-' + l.k.replace(/ /g, '-')}><span>{l.t}</span>{l.k && <b>{l.k}</b>}</li>)}
      </ol>
      <p className="xop-hint">Drag a resource out of place, or press it. The next sweep puts it back.</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="a2-dark xop-hero" data-room="dark" aria-labelledby="xop-h1">
      <div className="a2-wrap a2-grid xop-hero-grid">
        <div className="xop-hero-copy">
          <p className="a2-kick"><A to={GH} className="xop-repo">hanzoai/operator</A></p>
          <A2Lines as="h1" id="xop-h1" className="a2-display xop-h1" lines={['Hanzo', 'Operator']} now />
          <p className="a2-lede">One binary that runs the stack on Kubernetes</p>
          <div className="a2-acts"><span data-thumb="View on GitHub" data-href={GH} style={{ display: 'contents' }}><Go to={GH} solid>View on GitHub</Go></span></div>
        </div>
        <motion.div className="xop-hero-obj" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
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
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const k = useTransform(p, (v) => (calm ? 1 : Math.min(1, Math.max(0, (v - 0.15) / 0.75))));
  return (
    <section className="a2-sec xop-declare" ref={ref} aria-labelledby="xop-declare-h">
      <div className="a2-wrap a2-grid">
        <div className="xop-declare-copy">
          <A2Lines id="xop-declare-h" className="a2-display m" lines={['Declare the thing,', 'not the thirty', 'objects']} />
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
              <span className="a2-kick">{String(i + 1).padStart(2, '0')} / 06</span>
              <h3 className="a2-title">{t}</h3>
              <p>{d}</p>
              <code className="x-mono">{code}</code>
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
      <div className="a2-wrap a2-grid">
        <div className="xop-get-copy">
          <A2Lines id="xop-get-h" className="a2-display s" lines={['Get started with', 'Hanzo Operator']} />
        </div>
        <div className="xop-get-card">
          <h2>Get Operator</h2>
          <p>K8s operator</p>
          <p className="xop-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to={GH}>hanzoai</A></p>
          <p className="xop-get-cmd x-mono" aria-hidden="true">operator up</p>
          <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
        </div>
      </div>
    </section>
  );
}

export default function Operator() {
  return (
    <main className="a2 xop" style={{ '--acc': '#14b8a6' }}>
      <Hero />
      <Declare />
      <Track />
      <A2Paste name="Operator" text="Read https://hanzo.ai/skill.md and use Hanzo Operator in my project." />
      <Get />
    </main>
  );
}
