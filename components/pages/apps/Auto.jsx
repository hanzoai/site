'use client';
/* Auto (v2, Cloud 4 chat). Archetype A, Launch: the page opens on the editor itself → six properties as an index that
   opens one at a time, each with its own small live object → four figures in the one dark room, pinned while they cut in →
   the connectors as a workflow you re-route → Get Auto → one closing band.
   Persona: a developer who wants workflows that survive a restart. Goal: open Auto.
   CTA: "Open Auto" (hero, ask bar, close; data-cta primary / close). Metric: cta_click:auto.primary.
   V2: 8/10 the hero race splits within 2 s (pod rescheduled on the first run: record holds step 3, goroutine drops to step 1, a hairline marker instead of a scrim); each property opens on its own live object (record ticks, /v1/pieces streaming, one run with two triggers, the SSE event log, draft vs published, IAM then KMS); the figures room pins and cuts each word in on scroll while the container draws; connectors are quiet rows feeding a drawn chain; the editor tilts under a fine pointer
   Signature: a run that survives the restart. The first screen is a React-Flow-style canvas; the same flow runs twice, once
   kept as a record and once held in a goroutine. On the first run (and every other run after) the pod is rescheduled: the
   record resumes at the step it wrote down, the goroutine starts over from the trigger and finishes last.
   Beyond: restart the pod yourself, at any moment, and watch which run keeps its place (Hanzo's own claim: a run is a
   record, not a goroutine).
   Motion: the running canvas (signature, time, pausable) + pointer tilt on the editor (useSpring) + the pinned figures
   scrubbed by scroll (useScroll) + drawn wires in the connector chain and the container (pathLength). The index line grows
   as it opens (state). Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { EASE, useCalm } from '../../ui';
import { Cta } from '../../kit';
import Finale from '../../v2/Finale';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import Mini from './auto/Minis';
import './Auto.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/auto';
const OPEN = 'https://auto.hanzo.ai';
const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay: d } });
const NODES = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];
const N = NODES.length;

/* status glyph on a node: pending ring, running arc, done tick */
function Glyph({ s }) {
  return (
    <svg className={'au2-g ' + s} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {s === 'done' && <path d="M5 8.2 7.1 10.3 11 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

/* One lane of the flow on the canvas. */
function Lane({ label, at, kind, lost }) {
  const cur = Math.min(at, N - 1);
  return (
    <div className={'au2-lane ' + kind + (lost ? ' lost' : '')}>
      <p className="au2-lane-k"><b>{label}</b><span className="l2-mono">step {Math.min(at + 1, N)} / {N}<em> · {at >= N ? 'done' : NODES[cur]}</em></span></p>
      <div className="au2-nodes">
        <i className="au2-track" aria-hidden="true"><b style={{ transform: `scaleX(${cur / (N - 1)})` }} /></i>
        {NODES.map((n, i) => {
          const s = i < at ? 'done' : i === at ? 'now' : 'wait';
          return (
            <div key={n} className={'au2-node ' + s}>
              <span className="au2-h l" /><Glyph s={s} /><span className="au2-nl">{n}</span><span className="au2-h r" />
              {i < N - 1 && <i className="au2-edge"><b style={{ transform: `scaleX(${i < at ? 1 : 0})` }} /></i>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Pointer tilt for the editor, fine pointers only (up to 2.5°). */
function useLean() {
  const rx = useSpring(0, { stiffness: 140, damping: 22 });
  const ry = useSpring(0, { stiffness: 140, damping: 22 });
  const fine = useRef(false);
  useEffect(() => { fine.current = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches; }, []);
  const onPointerMove = (e) => {
    if (!fine.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set((0.5 - (e.clientY - r.top) / r.height) * 3);
  };
  const onPointerLeave = () => { rx.set(0); ry.set(0); };
  return { style: { rotateX: rx, rotateY: ry, transformPerspective: 1600 }, onPointerMove, onPointerLeave };
}

/* The canvas: both runs step together; on the first run (then every other run) the pod is rescheduled at step 3. */
function Run() {
  const [ref, live, calm, paused, toggle] = useDemo(0.25);
  const tilt = useLean();
  const [rec, setRec] = useState(1);
  const [go, setGo] = useState(1);
  const [crash, setCrash] = useState(false);
  const [saved, setSaved] = useState(2);
  const [loops, setLoops] = useState(0);
  const [mine, setMine] = useState(-1);
  const [hold, setHold] = useState(0);
  const restart = () => {
    if (crash) return;
    setSaved(rec);
    setGo(0);
    setCrash(true);
  };
  useTick(700, live && !crash, () => {
    if (rec === 2 && go === 2 && loops % 2 === 0 && mine !== loops) { restart(); return; }
    if (rec >= N && go >= N) {
      if (hold < 2) { setHold(hold + 1); return; }
      setHold(0); setRec(0); setGo(0); setLoops(loops + 1); return;
    }
    setRec(Math.min(N, rec + 1));
    setGo(Math.min(N, go + 1));
  });
  useEffect(() => { if (crash) { const t = setTimeout(() => setCrash(false), 1600); return () => clearTimeout(t); } }, [crash]);
  const R = calm ? 3 : rec;
  const G = calm ? 0 : go;
  const cut = calm || crash;
  return (
    <motion.div className="au2-ed" ref={ref} {...tilt}>
      <div className="au2-bar">
        <span className="au2-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="l2-mono">React Flow · SSE</span>
        <span className="au2-pub l2-mono"><i />published</span>
        <PauseBtn paused={paused} onClick={toggle} />
      </div>
      <div className="au2-canvas">
        <Lane label="A run kept as a record" at={R} kind="rec" />
        <div className={'au2-mark' + (cut ? ' on' : '')}>
          <i className="au2-mark-l" aria-hidden="true" />
          <b className="l2-mono">pod rescheduled</b>
          <span className="l2-mono">record: resumes at step {(calm ? 2 : saved) + 1} · goroutine: starts over</span>
        </div>
        <Lane label="A run held in a goroutine" at={G} kind="go" lost={crash} />
      </div>
      <div className="au2-foot">
        <button type="button" className={'au2-restart' + (crash ? ' busy' : '')} onClick={() => { setMine(loops); restart(); }} aria-disabled={crash || undefined} aria-label="Restart the pod">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.55M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="l2-mono">Step state is written down as it goes.</span>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="au2-hero" aria-labelledby="au2-h1">
      <div className="l2-wrap">
        <div className="au2-top">
          <div className="au2-name">
            <h1 id="au2-h1" className="l2-display"><span className="l2-ln"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}>Hanzo Auto</motion.span></span></h1>
            <motion.p className="l2-stage-kick l2-mono" {...up(0.16)}>auto.hanzo.ai</motion.p>
            <motion.p className="l2-lede" {...up(0.22)}>Workflow automation in one binary</motion.p>
          </div>
          <motion.div className="l2-acts" {...up(0.3)}>
            <Cta to={OPEN} id="primary" size="lg" thumb data-thumb="Open Auto">Open Auto</Cta>
            <Cta to={DOCS} kind="link" id="docs">Documentation</Cta>
          </motion.div>
        </div>
        <motion.div className="au2-stage" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <Run />
        </motion.div>
      </div>
    </section>
  );
}

const PROPS = [
  ['Durable execution', 'A run is a record, not a goroutine. Step state is written down as it goes, so a crash, a deploy or a rescheduled pod resumes where it stopped rather than starting over or losing the run.'],
  ['The catalog is in the binary', 'GET /v1/pieces lists the connectors this build has. No plugin registry to reach at boot, so the version you deployed is the version that runs, offline and forever.'],
  ['Triggers', 'POST to a trigger and a run starts. Or start one by hand against /v1/runs. Either way it is the same run object with the same history.'],
  ['Watch it live', 'The editor is React Flow, embedded in the binary, and it follows a run over a server-sent event stream — so the canvas you drew is the canvas you watch execute.'],
  ['Draft, then publish', 'Edit a flow freely; nothing changes for callers until you publish. What triggers fire is a published version, so editing in the afternoon does not change what runs overnight.'],
  ['Connections, not pasted keys', "A connection is a named credential the flow refers to. It is encrypted at rest through Hanzo KMS, and who may touch it is Hanzo IAM's answer, not a second login here."],
];

/* The six properties as an index: each line rests small; the open one grows and runs its own small live object. */
function Index() {
  const [open, setOpen] = useState(0);
  const [ref, live, calm, paused, toggle] = useDemo(0.2);
  return (
    <section className="l2-sec au2-idx">
      <div className="l2-wrap">
        <h2 className="l2-head">A run that survives the restart</h2>
        <ol className="au2-list" ref={ref}>
          {PROPS.map(([t, d], i) => (
            <li key={t} className={open === i ? 'open' : ''}>
              <button type="button" className="au2-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</span>
                <span className="au2-t">{t}</span>
                <svg className="au2-x" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
              <div className="au2-d" inert={open !== i}>
                <div className="au2-d-in">
                  <p className="l2-body">{d}</p>
                  <div className="au2-mini">
                    {open === i && <PauseBtn paused={paused} onClick={toggle} />}
                    <div aria-hidden="true"><Mini i={i} run={live && open === i} calm={calm} /></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const PIECES = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'HubSpot', 'Jira', 'Linear', 'Discord', 'Airtable', 'Google Sheets', 'Postgres'];

/* Press a connector and it becomes the flow's next step; the wires between steps draw again as the chain re-flows. */
function Pieces() {
  const [path, setPath] = useState([0, 4, 9]);
  const add = (i) => setPath((p) => (p.includes(i) ? p : [...p.slice(1), i]));
  return (
    <section className="l2-sec tight au2-pieces">
      <div className="l2-wrap l2-grid">
        <div className="au2-pieces-l">
          <h2 className="l2-head">Some of what it connects</h2>
          <p className="au2-api l2-mono">GET /v1/pieces</p>
          <ol className="au2-path" aria-hidden="true">
            <AnimatePresence initial={false} mode="popLayout">
              {path.map((k, j) => (
                <motion.li key={k} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  {j > 0 && (
                    <svg className="au2-wire" viewBox="0 0 12 28" width="12" height="28">
                      <motion.path key={k + '-' + j} d="M6 0V22M2.5 18.5 6 22l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.08 * j }} />
                    </svg>
                  )}
                  <span className="au2-step"><span className="l2-mono">{j + 1}</span>{PIECES[k]}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
        <ul className="au2-board">
          {PIECES.map((t, i) => {
            const k = path.indexOf(i);
            return (
              <li key={t}>
                <button type="button" className={k >= 0 ? 'on' : ''} aria-pressed={k >= 0} onClick={() => add(i)}>
                  <span className="au2-pn">{t}</span>
                  <span className="au2-ps l2-mono" aria-hidden="true">
                    {k >= 0 ? k + 1 : <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const FIGS = [['Go', 'One process'], ['SQLite', 'Per replica'], ['/v1', 'Flows and runs'], ['Apache', 'Self-hosted']];

/* one figure: its word cuts up into its line as the pinned room scrolls past its stretch */
function Fig({ p, i, on, k, d }) {
  const y = useTransform(p, [0.08 + i * 0.11, 0.24 + i * 0.11], ['105%', '0%']);
  const o = useTransform(p, [0.08 + i * 0.11, 0.24 + i * 0.11], [0.3, 1]);
  return (
    <li>
      <b className="l2-ln"><motion.span style={on ? { y } : undefined}>{k}</motion.span></b>
      <motion.span className="l2-mono" style={on ? { opacity: o } : undefined}>{d}</motion.span>
    </li>
  );
}

/* The one dark room: pinned while the four words cut in, then the container that holds them draws its outline. */
function Figures() {
  const ref = useRef(null);
  const calm = useCalm();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(!calm), [calm]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.7', 'end end'] });
  const draw = useTransform(p, [0.58, 0.82], [0, 1]);
  const chips = useTransform(p, [0.74, 0.88], [0, 1]);
  return (
    <section ref={ref} className={'l2-dark au2-figs' + (on ? ' pin' : '')} data-room="dark">
      <div className="au2-figs-pin">
        <div className="l2-wrap">
          <ul>
            {FIGS.map(([k, d], i) => <Fig key={k} p={p} i={i} on={on} k={k} d={d} />)}
          </ul>
          <div className="au2-box" aria-hidden="true">
            <div className="au2-ctr">
              <svg className="au2-ctr-line" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.rect x="0.5" y="0.5" width="99" height="99" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={on ? { pathLength: draw } : undefined} />
              </svg>
              <span className="l2-mono">container</span><b>auto</b>
              <motion.i className="au2-port l2-mono" style={on ? { opacity: chips } : undefined}>:port</motion.i>
              <motion.em className="l2-mono" style={on ? { opacity: chips } : undefined}>state.sqlite</motion.em>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Auto() {
  return (
    <main id="main" className="l2-page au2" data-ask="off">
      <Hero />
      <Index />
      <Figures />
      <Pieces />
      <Finale
        name="Auto"
        head="Or run it yourself"
        lede="One container, one port, a SQLite file for state. Nothing else to stand up first."
        ask={['Open Auto', OPEN]}
        links={[['View on GitHub', 'https://github.com/hanzoai']]}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Auto in my project. Start with: hanzo auto flows list"
        tag="Workflow automations"
      />
    </main>
  );
}
