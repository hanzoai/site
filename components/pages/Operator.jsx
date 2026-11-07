'use client';
/* Operator. One binary that runs the stack on Kubernetes.
   Signature: the reconcile loop, live. What you declared in git sits on the left, what runs in the cluster on the right,
   and a sweep goes round between them: it reads each object before it applies, then logs what it did to it, created,
   reverted or already in sync.
   Beyond: break it yourself. Edit an object by hand, take a file out of git, run install a second time, push, or turn on
   autoscaling, and the loop answers each one the way Hanzo says it does: drift is reverted, a removed file is left alone,
   a second install changes nothing, a push sweeps at once, the autoscaler owns the replica count. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A } from '../kit';
import { Get, Paste, useLive, useSteps } from './cloud/Frame';
import './Operator.css';

const KINDS = ['Service', 'Datastore', 'Gateway', 'KMSSecret', 'Ingress', 'DNS'];
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

function Loop() {
  const calm = useReducedMotion();
  const [lap, setLap] = useState(0); // a push or an install restarts the lap
  const [n, setN] = useState(0); // sweeps so far
  const [have, setHave] = useState({}); // kind -> 'ok' | 'drift' in the cluster
  const [gone, setGone] = useState(false); // DNS taken out of git
  const [auto, setAuto] = useState(false);
  const [log, setLog] = useState([]);
  const id = useRef(0);
  const say = (lines) => setLog((l) => [...lines.map((t) => ({ t, k: ++id.current })).reverse(), ...l].slice(0, 6));
  const sweep = (why) => {
    const s = n + 1;
    const lines = why ? [why] : [];
    const next = { ...have };
    KINDS.forEach((k) => {
      if (k === 'DNS' && gone) { if (have[k]) lines.push(`sweep ${s} · ${k} · removed from git, left alone`); return; }
      lines.push(`sweep ${s} · ${k} · ${!have[k] ? 'created' : have[k] === 'drift' ? 'reverted' : 'already in sync'}`);
      next[k] = 'ok';
    });
    setHave(next); setN(s); say(lines);
  };
  useEffect(() => { if (calm) sweep(); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps -- reduced motion: one sweep, then still
  const drift = () => { if (!have.Service) return sweep(); setHave((h) => ({ ...h, Service: 'drift' })); say(['Service edited by hand in the cluster']); };
  const now = (why) => { setLap((l) => l + 1); sweep(why); };
  const install = () => now('operator install · server-side apply, so running it again changes nothing');
  return (
    <div className="xop-loop">
      <div className="xop-side">
        <p className="xop-side-k x-mono"><span>git · what you declared</span></p>
        <ul>
          {KINDS.map((k) => (
            <li key={k} className={k === 'DNS' && gone ? 'gone' : ''}>
              <span className="x-mono">kind: {k}</span>
              {k === 'Service' && auto && <em>autoscaling on · no replica count</em>}
              {k === 'KMSSecret' && <em>the path, never the secret</em>}
            </li>
          ))}
        </ul>
      </div>
      <div className="xop-ring" aria-hidden="true">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle className="xop-arc" cx="60" cy="60" r="50" key={lap} onAnimationIteration={() => sweep()} /></svg>
        <span className="xop-ring-n x-mono">sweep {n}</span>
        <span className="xop-ring-t">read · apply · log</span>
      </div>
      <div className="xop-side cluster">
        <p className="xop-side-k x-mono"><span>cluster · what runs</span><i className="xop-watch" aria-hidden="true" /></p>
        <ul>
          {KINDS.map((k, i) => (
            <li key={k} className={'xop-obj ' + (have[k] || 'none')} style={{ '--i': i }}>
              <i /><span className="x-mono">{k}</span>
              <b>{!have[k] ? 'not yet' : have[k] === 'drift' ? 'drifted' : k === 'DNS' && gone ? 'left alone' : 'in sync'}</b>
              {k === 'Service' && auto && have[k] && <em>the autoscaler owns the replicas</em>}
            </li>
          ))}
        </ul>
        <i className="xop-beam" key={n} aria-hidden="true" />
      </div>
      <div className="xop-try">
        <p className="xop-try-k">Break it yourself</p>
        <div className="xop-btns">
          <button type="button" onClick={drift}>Edit Service by hand</button>
          <button type="button" aria-pressed={gone} onClick={() => { setGone((g) => !g); say([gone ? 'DNS back in git' : 'DNS file removed from git']); }}>{gone ? 'Put DNS back in git' : 'Remove DNS from git'}</button>
          <button type="button" onClick={install}>Run install again</button>
          <button type="button" onClick={() => now('push webhook · instant sweep')}>Push</button>
          <button type="button" aria-pressed={auto} onClick={() => { setAuto((a) => !a); say([auto ? 'autoscaling off' : 'autoscaling on · the Deployment ships with no replica count']); }}>Autoscaling {auto ? 'on' : 'off'}</button>
        </div>
      </div>
      <ol className="xop-log x-mono" aria-live="polite">
        <AnimatePresence initial={false}>
          {log.map((l) => (
            <motion.li key={l.k} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className={/reverted|edited|removed|left/.test(l.t) ? 'warn' : /created/.test(l.t) ? 'new' : ''}>{l.t}</motion.li>
          ))}
        </AnimatePresence>
        {!log.length && <li className="dim">waiting for the first sweep</li>}
      </ol>
    </div>
  );
}

function Hero() {
  return (
    <section className="xop-hero" aria-labelledby="xop-h1">
      <div className="x-wrap">
        <div className="xop-top">
          <motion.div {...up(0)}><A to="https://github.com/hanzoai" className="xop-repo x-mono">hanzoai/operator</A></motion.div>
          <h1 id="xop-h1" className="xop-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Operator</motion.span></span></h1>
          <motion.p className="xop-sub" {...up(0.3)}>One binary that runs the stack on Kubernetes</motion.p>
          <motion.div className="xop-acts" {...up(0.42)}><A to="https://github.com/hanzoai" className="x-btn solid" data-thumb>View on GitHub</A></motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <Loop />
        </motion.div>
      </div>
    </section>
  );
}

const POINTS = [
  ['Kinds that know the stack', 'Service covers most workloads. Datastore covers the stateful ones and dispatches on its type, with SQL, KV, DocDB and S3 as thin facades over it. Gateway, Ingress, DNS, Base, IAM, KMS and MPC are their own Kinds, because each one wires up differently.'],
  ['Secrets come from KMS', 'A KMSSecret is materialized beside the workload and synced from kms.hanzo.ai. What lives in git is the path to a secret, never the secret.'],
  ['Drift is reverted, and said out loud', "Every sweep reads each object before it applies, then logs what it did to it: created, reverted, or already in sync. The resync interval is per-resource and clamped into a safe band, so a bad number can't turn the loop into a hot loop."],
  ['Git is a source, and it never deletes', "Point it at a repo and it applies what's there, on a tight poll a push webhook can interrupt for an instant sweep. A file removed from git is left alone — the plan type has no delete case, so pruning isn't something a bug can cause."],
  ['Every write is attributable', 'Server-side apply under its own field manager, so a git-driven apply never fights a per-Kind reconcile. Turn on autoscaling and the Deployment ships with no replica count at all — the autoscaler owns that field, alone.'],
  ['Install is one command', 'operator install lays down the CRDs, namespace, RBAC and Deployment. operator up does that and applies your resources behind it. Both are server-side apply, so running either again changes nothing.'],
];
const GLYPH = ['M4 6h16M4 12h16M4 18h10', 'M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z', 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4', 'M6 4v16M6 8a6 6 0 0 0 6 6h6M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3', 'M12 4v12M7 11l5 5 5-5M5 20h14'];

/* Six cards in a deck: the top one is read, the deck turns by itself, arrows or a swipe turn it by hand. */
function Deck() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(POINTS.length, 3800, live);
  const drag = useRef(null);
  const go = (d) => choose((at + d + POINTS.length) % POINTS.length);
  return (
    <section className="x-sec xop-deck" data-room="dark" ref={ref} aria-labelledby="xop-deck">
      <div className="x-wrap xop-deck-grid">
        <div>
          <Rise as="h2" id="xop-deck" y={20}>Declare the thing, not the thirty objects</Rise>
          <p className="xop-count x-mono" aria-live="polite">{String(at + 1).padStart(2, '0')} / 06</p>
          <div className="xop-nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous">←</button>
            <button type="button" onClick={() => go(1)} aria-label="Next">→</button>
          </div>
          <ol className="xop-dots">
            {POINTS.map(([t], i) => <li key={t}><button type="button" aria-pressed={at === i} aria-label={t} onClick={() => choose(i)}><i /></button></li>)}
          </ol>
        </div>
        <div className="xop-cards" data-swipe-own data-cursor="Drag"
          onPointerDown={(e) => { drag.current = e.clientX; }}
          onPointerUp={(e) => { const d = drag.current == null ? 0 : e.clientX - drag.current; drag.current = null; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}>
          {POINTS.map(([t, d], i) => {
            const k = (i - at + POINTS.length) % POINTS.length; // 0 is on top
            return (
              <motion.article key={t} className={'xop-card' + (k === 0 ? ' on' : '')} aria-hidden={k !== 0}
                animate={{ y: Math.min(k, 3) * 16, scale: 1 - Math.min(k, 3) * 0.04, opacity: k > 3 ? 0 : 1 - k * 0.18, zIndex: 10 - k }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}>
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d={GLYPH[i]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Operator() {
  return (
    <main className="xop">
      <Hero />
      <Deck />
      <section className="x-sec xop-paste">
        <div className="x-wrap">
          <Rise as="h2" className="xop-paste-h" y={20}>Get started with Hanzo Operator</Rise>
          <Paste name="Operator" prompt="Read https://hanzo.ai/skill.md and use Hanzo Operator in my project." />
        </div>
      </section>
      <Get name="Operator" tag="K8s operator"><p className="xop-get x-mono" aria-hidden="true">operator up<i /></p></Get>
    </main>
  );
}
