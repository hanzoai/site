'use client';
// Persona: a platform engineer running the stack on Kubernetes.
// Goal: install the operator.
// CTA: View on GitHub (operator.hero), and again under "Get started with Hanzo Operator" (the Band), as hanzo.ai pairs them; Deploy to Cloud sits in Get Operator, as live.
// Metric: cta_click operator.hero
// Signature: a card stack of the six points under "Declare the thing, not the thirty objects": flick or drag the top card away (swipe on touch), one idea per card, the next rising from beneath.
// Beyond: the hero cluster board (approved): drag any resource out of place yourself (or press it) and watch the next sweep revert it, with the log saying so.
/* Hanzo Operator.
   V2: 8/10 the deck scale (h1 52, sections 26, card titles 21); a dark control room as the hero where the cluster drifts and the operator puts it back (pausable, drag a resource yourself), then the six points as a card stack you flick through (buttons and arrow keys too), kit Cta and Band. Greys only.
   Signature: drift, reverted, said out loud. The hero is a live cluster board: ten Kinds in their desired places, a
   sweep crossing them on a loop. Between sweeps something drifts out of place; on the next sweep the operator moves it
   back and the log says what it did (created, reverted, or already in sync). A pause control stops the loop.
   Then "Declare the thing, not the thirty objects" heads a stack of six cards, Hanzo's six points, one per card: the
   top card is flicked or dragged away to either side and the next comes up (no pinned scene, no scroll-driven track).
   Every word is Hanzo's; the log uses only Hanzo's own words (drift, sweep, created, reverted, already in sync). */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { A, Cta, Band } from '../kit';
import { Copy } from '../ui';
import MaskLines from './proof/MaskLines';
import A2Paste from '../v2/A2Paste';
import A2Pause from '../v2/A2Pause';
import NoJs from '../NoJs';
import { T, EMPH, INOUT } from '../v2/A2Motion';
import HeroDither from './HeroDither';
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

function Tile({ k, sub, i, mv, onDrift, fine, box, inward }) {
  return (
    <motion.button type="button" className={'xop-tile' + (fine ? ' fine' : '')} style={{ x: mv.x, y: mv.y }} drag={fine} dragConstraints={box} dragMomentum={false} dragElastic={0}
      onDragEnd={() => onDrift(i)} onClick={() => { if (Math.abs(mv.x.get()) + Math.abs(mv.y.get()) < 2) { const [dx, dy] = inward(i); animate(mv.x, dx * 26, SPRING); animate(mv.y, dy * 14, SPRING); onDrift(i); } }}
      aria-label={'Drift ' + k} whileDrag={{ scale: 1.05, zIndex: 5 }}>
      <span className="xop-tile-k">{k}</span>
      {sub && <span className="xop-tile-s x-mono">{sub.startsWith('kms.') ? <>kms.<wbr />{sub.slice(4)}</> : sub}</span>}
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
  const say = (lines) => setLog((l) => [...lines.map(([t, k]) => ({ id: id.current++, t, k })).reverse(), ...l].slice(0, 5));
  // a tile drifts toward the middle of the board, never out past its edge (a right-hand tile goes left, a bottom one up)
  const inward = (i) => {
    const g = box.current, el = g?.children[i];
    if (!el) return [1, 1];
    return [el.offsetLeft + el.offsetWidth / 2 > g.offsetWidth / 2 ? -1 : 1, el.offsetTop + el.offsetHeight / 2 > g.offsetHeight / 2 ? -1 : 1];
  };
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
      if (!drifted.current.size) t2 = setTimeout(() => { const i = (s * 3) % KINDS.length; const [dx, dy] = inward(i); animate(xs[i], dx * (s % 2 ? 34 : 30), SPRING); animate(ys[i], dy * (s % 3 ? 18 : 16), SPRING); drifted.current.add(i); say([[KINDS[i][0], 'drift']]); }, 2400);
      t3 = setTimeout(lap, 4600);
    };
    t3 = setTimeout(lap, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [seen, calm, paused]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'xop-board' + (paused ? ' a2-paused' : '')} ref={ref}>
      <div className="xop-board-top"><A2Pause paused={paused} onChange={setPaused} label="Pause" /><span className="x-mono"><i className="xop-live" />sweep</span></div>
      <div className="xop-grid" ref={box}>
        {KINDS.map(([k, sub], i) => <Tile key={k} k={k} sub={sub} i={i} mv={{ x: xs[i], y: ys[i] }} onDrift={onDrift} fine={fine} box={box} inward={inward} />)}
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
      <HeroDither />
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

/* The six points as a stack of cards, one idea each: flick or drag the top card away (swipe on touch), or use the
   buttons and arrow keys; the next card comes up and the stack refills after the sixth. */
const POINTS = [
  ['Kinds that know the stack', 'Service covers most workloads. Datastore covers the stateful ones and dispatches on its type, with SQL, KV, DocDB and S3 as thin facades over it. Gateway, Ingress, DNS, Base, IAM, KMS and MPC are their own Kinds, because each one wires up differently.', 'Service · Datastore · Gateway'],
  ['Secrets come from KMS', 'A KMSSecret is materialized beside the workload and synced from kms.hanzo.ai. What lives in git is the path to a secret, never the secret.', 'KMSSecret ← kms.hanzo.ai'],
  ['Drift is reverted, and said out loud', "Every sweep reads each object before it applies, then logs what it did to it: created, reverted, or already in sync. The resync interval is per-resource and clamped into a safe band, so a bad number can't turn the loop into a hot loop.", 'created · reverted · already in sync'],
  ['Git is a source, and it never deletes', "Point it at a repo and it applies what's there, on a tight poll a push webhook can interrupt for an instant sweep. A file removed from git is left alone — the plan type has no delete case, so pruning isn't something a bug can cause.", 'git → apply'],
  ['Every write is attributable', 'Server-side apply under its own field manager, so a git-driven apply never fights a per-Kind reconcile. Turn on autoscaling and the Deployment ships with no replica count at all — the autoscaler owns that field, alone.', 'server-side apply'],
  ['Install is one command', 'operator install lays down the CRDs, namespace, RBAC and Deployment. operator up does that and applies your resources behind it. Both are server-side apply, so running either again changes nothing.', 'operator up'],
];

const N = POINTS.length;
const two = (n) => String(n).padStart(2, '0');

function Stack() {
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // applied after hydration, so server and client markup match
  useEffect(() => setCalm(!!rm), [rm]);
  const [top, setTop] = useState(0);
  const busy = useRef(false);
  const box = useRef(null);
  const x = useMotionValue(0);
  const rot = useTransform(x, [-480, 480], [-4, 4]);
  const far = () => (box.current?.offsetWidth || 480) * 1.25;
  // the top card leaves to one side; the next one is already underneath
  const flick = (dir) => {
    if (busy.current) return;
    busy.current = true;
    const done = () => { setTop((t) => (t + 1) % N); x.set(0); busy.current = false; };
    if (calm) { done(); return; }
    animate(x, dir * far(), { duration: T.slow, ease: INOUT }).then(done);
  };
  // the card before comes back from the side it left by
  const back = () => {
    if (busy.current) return;
    busy.current = true;
    setTop((t) => (t + N - 1) % N);
    if (calm) { x.set(0); busy.current = false; return; }
    x.set(-far());
    animate(x, 0, { duration: T.slower, ease: EMPH }).then(() => { busy.current = false; });
  };
  // once, on arrival, the top card leans aside and settles, so the stack reads as something to flick
  const seen = useInView(box, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!seen || calm || busy.current) return;
    const t = setTimeout(() => { animate(x, [0, -44, 0], { duration: 0.9, ease: INOUT, times: [0, 0.45, 1] }); }, 300);
    return () => clearTimeout(t);
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); flick(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); back(); } };
  return (
    <section className="a2-sec xop-cards" aria-labelledby="xop-declare-h">
      <NoJs css=".xop-stack{height:auto!important}.xop-sc{position:relative!important;inset:auto!important;height:auto!important;transform:none!important;opacity:1!important;margin-bottom:12px;visibility:visible!important}.xop-stack-ctl{display:none}" />
      <div className="a2-wrap a2-grid xop-cards-grid">
        <div className="xop-cards-copy">
          <h2 id="xop-declare-h" className="a2-headline">Declare the thing, not the thirty objects</h2>
          <div className="xop-stack-ctl">
            <button type="button" className="xop-nav" onClick={back} aria-label="Previous point"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <span className="xop-count x-mono" aria-live="polite">{two(top + 1)} / {two(N)}</span>
            <button type="button" className="xop-nav" onClick={() => flick(1)} aria-label="Next point"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </div>
          <ol className="xop-ticks" aria-hidden="true">{POINTS.map(([t], i) => <li key={t} className={i === top ? 'on' : i < top ? 'past' : ''} />)}</ol>
        </div>
        <ol className="xop-stack" ref={box} tabIndex={0} onKeyDown={onKey} aria-label="Six points" aria-roledescription="card stack">
          {POINTS.map(([t, d, code], i) => {
            const k = (i - top + N) % N; // 0 is the top card
            const isTop = k === 0;
            return (
              <motion.li key={t} className={'xop-sc' + (isTop ? ' top' : '') + (i === 2 ? ' alt' : '')} aria-hidden={!isTop}
                style={{ x: isTop ? x : 0, rotate: isTop ? rot : 0, zIndex: N - k }}
                animate={{ y: Math.min(k, 2) * 16, scale: 1 - Math.min(k, 2) * 0.04, opacity: k < 3 ? 1 : 0 }}
                transition={calm || k === N - 1 ? { duration: 0 } : { duration: T.slow, ease: EMPH }}
                drag={isTop && !calm ? 'x' : false} dragMomentum={false} dragElastic={0.9}
                onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) flick(Math.sign(info.offset.x || info.velocity.x) || 1); else animate(x, 0, { duration: T.base, ease: EMPH }); }}>
                <h3 className="xop-card-t">{t}</h3>
                <p>{d}</p>
                <span className="xop-card-f"><code className="x-mono">{code}</code><span className="xop-card-n x-mono">{two(i + 1)} / 06</span></span>
              </motion.li>
            );
          })}
        </ol>
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
          <Cta to="https://platform.hanzo.ai/deploy" id="operator.get" kind="quiet" size="sm">Deploy to Cloud</Cta>
        </div>
      </div>
    </section>
  );
}

export default function Operator() {
  return (
    <main className="a2 xop">
      <Hero />
      <Stack />
      <A2Paste name="Operator" text="Read https://hanzo.ai/skill.md and use Hanzo Operator in my project." />
      <Get />
      <Band title="Get started with Hanzo Operator" action="View on GitHub" to={GH} />
    </main>
  );
}
