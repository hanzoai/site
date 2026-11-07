'use client';
/* Auto (v2, Cloud 4 chat). Archetype A, Launch: the page opens on the editor itself → six properties as an editorial index
   with a preview that follows the cursor → the connectors → four figures in the one dark room → run it yourself. Accent:
   flow indigo.
   V2: 8/10 the hero is the flow editor, two runs racing a pod restart you can trigger; the six properties as a big-type index with a cursor-following preview (hamol/grubogrubo)
   Signature: a run that survives the restart. The first screen is a React-Flow-style canvas; the same flow runs twice, once
   kept as a record and once held in a goroutine. Every other run the pod is rescheduled: the record resumes at the step it
   wrote down, the goroutine starts over from the trigger.
   Beyond: "Restart the pod" yourself, at any moment, and watch which run keeps its place (Hanzo's own claim: a run is a
   record, not a goroutine).
   Motion: the running canvas (signature) + spring-follow preview + layout re-flow of the connector path + magnetic
   primary. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useReducedMotion } from 'motion/react';
import { EASE, Magnetic, fine } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import Finale from '../../v2/Finale';
import './Auto.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/auto';
const OPEN = 'https://auto.hanzo.ai';
const up = (d) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const NODES = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];
const N = NODES.length;

/* One lane of the flow on the canvas. */
function Lane({ label, at, crashed, kind }) {
  return (
    <div className={'au2-lane ' + kind + (crashed ? ' crashed' : '')}>
      <p className="au2-lane-k"><b>{label}</b><span className="l2-mono">step {Math.min(at + 1, N)} / {N}</span></p>
      <div className="au2-nodes">
        {NODES.map((n, i) => (
          <div key={n} className={'au2-node' + (i < at ? ' done' : i === at ? ' now' : '')}>
            <span className="au2-h l" /><span className="au2-ic" aria-hidden="true">{n[0].toUpperCase()}</span><span className="au2-nl">{n}</span><span className="au2-h r" />
            {i < N - 1 && <i className="au2-edge"><b style={{ transform: `scaleX(${i < at ? 1 : 0})` }} /></i>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* The canvas: both runs step together; every other run the pod is rescheduled at step 3. */
function Run() {
  const [ref, live] = useLive(0.25);
  const [rec, setRec] = useState(2);
  const [go, setGo] = useState(2);
  const [crash, setCrash] = useState(false);
  const [saved, setSaved] = useState(null);
  const [mine, setMine] = useState(false);
  const [loops, setLoops] = useState(0);
  useEvery(950, live && !crash, () => {
    if (rec >= N) { setRec(0); setGo(0); setLoops((l) => l + 1); return; }
    setRec(rec + 1);
    setGo((v) => Math.min(N, v + 1));
  });
  useEffect(() => { if (!mine && live && !crash && rec === 2 && go === 2 && loops % 2 === 1) restart(); }, [rec, go, loops, live]); // eslint-disable-line react-hooks/exhaustive-deps
  const restart = () => {
    if (crash) return;
    setSaved(rec);
    setCrash(true);
    setTimeout(() => { setGo(0); setCrash(false); }, 1500);
  };
  return (
    <div className="au2-ed" ref={ref}>
      <div className="au2-bar">
        <span className="au2-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="l2-mono">React Flow · SSE</span>
        <span className="au2-pub l2-mono"><i />published</span>
      </div>
      <div className="au2-canvas" data-cursor="Watch">
        <Lane label="A run kept as a record" at={rec} crashed={crash} kind="rec" />
        <Lane label="A run held in a goroutine" at={go} crashed={crash} kind="go" />
        <AnimatePresence>
          {crash && (
            <motion.div className="au2-crash" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <b className="l2-mono">pod rescheduled</b>
              <span>record: resumes at step {saved + 1} · goroutine: starts over</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="au2-foot">
        <button type="button" className="x-btn solid" onClick={() => { setMine(true); restart(); }} disabled={crash}>Restart the pod</button>
        <span className="l2-mono">Step state is written down as it goes.</span>
      </div>
    </div>
  );
}

function Hero() {
  const calm = useReducedMotion();
  return (
    <section className="au2-hero" aria-labelledby="au2-h1">
      <div className="l2-wrap">
        <div className="au2-top">
          <motion.p className="au2-url l2-mono" {...up(0)}><img src="/models/zen.webp" alt="" />auto.hanzo.ai</motion.p>
          <h1 id="au2-h1" className="l2-display"><span className="l2-ln"><motion.span initial={calm ? false : { y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.15, ease: EASE, delay: 0.08 }}>Hanzo Auto</motion.span></span></h1>
          <motion.p className="l2-lede" {...up(0.3)}>Workflow automation in one binary</motion.p>
          <motion.div className="l2-acts" {...up(0.42)}>
            <Magnetic strength={0.25}><A to={OPEN} className="x-btn solid" data-thumb="Open Auto">Open Auto</A></Magnetic>
            <A to={DOCS} className="x-btn">Documentation</A>
          </motion.div>
        </div>
        <motion.div initial={calm ? false : { opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
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

/* A small picture per property, shown in the cursor preview (and inline on phones). */
function Mini({ i }) {
  if (i === 0) return <ol className="au2-m0 l2-mono">{['trigger', 'GitHub', 'Postgres'].map((s, k) => <li key={s} className={k < 2 ? 'ok' : 'now'}><i />{s}</li>)}<li className="rec">record</li></ol>;
  if (i === 1) return <div className="au2-m1"><p className="l2-mono">GET /v1/pieces</p><span>Slack</span><span>GitHub</span><span>Postgres</span><span>Stripe</span></div>;
  if (i === 2) return <div className="au2-m2 l2-mono"><span>POST trigger</span><span>/v1/runs</span><b>run</b></div>;
  if (i === 3) return <div className="au2-m3"><p className="l2-mono">server-sent events</p>{[0, 1, 2, 3].map((k) => <i key={k} />)}</div>;
  if (i === 4) return <div className="au2-m4 l2-mono"><span className="d">draft</span><span className="p">published</span></div>;
  return <div className="au2-m5 l2-mono"><span>connection</span><span className="k">Hanzo KMS</span><span className="k">Hanzo IAM</span></div>;
}

/* The six properties as an index of big lines; the open one shows its words, and a preview card follows the cursor. */
function Index() {
  const [open, setOpen] = useState(0);
  const [hover, setHover] = useState(-1);
  const box = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const move = (e) => {
    if (!fine(e)) return;
    const r = box.current.getBoundingClientRect();
    x.set(e.clientX - r.left + 28);
    y.set(e.clientY - r.top - 90);
  };
  return (
    <section className="l2-sec au2-idx" ref={box} onPointerMove={move} onPointerLeave={() => setHover(-1)}>
      <div className="l2-wrap">
        <div className="au2-idx-h">
          <h2 className="l2-display m">A run that survives the restart</h2>
        </div>
        <ol className="au2-list">
          {PROPS.map(([t, d], i) => (
            <li key={t} className={open === i ? 'open' : ''} onPointerEnter={(e) => fine(e) && setHover(i)}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</span>
                <span className="au2-t">{t}</span>
                <i aria-hidden="true">+</i>
              </button>
              <div className="au2-d" aria-hidden={open !== i} inert={open !== i}>
                <div><p className="l2-body">{d}</p><div className="au2-inline" aria-hidden="true"><Mini i={i} /></div></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <motion.div className={'au2-peek' + (hover >= 0 ? ' on' : '')} style={{ x, y }} aria-hidden="true">
        {hover >= 0 && <Mini i={hover} />}
      </motion.div>
    </section>
  );
}

const PIECES = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'HubSpot', 'Jira', 'Linear', 'Discord', 'Airtable', 'Google Sheets', 'Postgres'];

/* Press a connector and it becomes the flow's next step. */
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
              {path.map((k, j) => <motion.li key={k} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}><span className="l2-mono">{j + 1}</span>{PIECES[k]}</motion.li>)}
            </AnimatePresence>
          </ol>
        </div>
        <ul className="au2-board">
          {PIECES.map((t, i) => {
            const k = path.indexOf(i);
            return (
              <li key={t}>
                <button type="button" className={k >= 0 ? 'on' : ''} aria-pressed={k >= 0} onClick={() => add(i)} data-cursor={k >= 0 ? undefined : 'Add'}>
                  <span className="au2-pi" aria-hidden="true">{t[0]}</span>{t}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Figures() {
  return (
    <section className="l2-sec l2-dark au2-figs" data-room="dark">
      <div className="l2-wrap">
        <ul>
          {[['Go', 'One process'], ['SQLite', 'Per replica'], ['/v1', 'Flows and runs'], ['Apache', 'Self-hosted']].map(([k, d]) => (
            <li key={k}><b>{k}</b><span className="l2-mono">{d}</span></li>
          ))}
        </ul>
        <div className="au2-box" aria-hidden="true">
          <div className="au2-ctr"><span className="l2-mono">container</span><b>auto</b><i className="au2-port l2-mono">:port</i><em className="l2-mono">state.sqlite</em></div>
        </div>
      </div>
    </section>
  );
}

export default function Auto() {
  return (
    <main className="l2-page au2" style={{ '--ac': '#4c4de8' }}>
      <Hero />
      <Index />
      <Pieces />
      <Figures />
      <Finale
        name="Auto"
        head="Or run it yourself"
        lede="One container, one port, a SQLite file for state. Nothing else to stand up first."
        acts={[['Open Auto', OPEN], ['View on GitHub', 'https://github.com/hanzoai']]}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Auto in my project. Start with: hanzo auto flows list"
        tag="Workflow automations"
      />
    </main>
  );
}
