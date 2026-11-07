'use client';
/* Auto. Signature: a run that survives the restart. Two copies of one flow run side by side on a React-Flow-like
   canvas: one kept as a record, one held in a goroutine. Midway the pod is rescheduled; the record resumes at the step
   it had written down, the goroutine starts over from the trigger. It loops by itself.
   Beyond: "Restart the pod" yourself, at any moment, and watch which run keeps its place. Built from Hanzo's own claim
   (a run is a record, not a goroutine). Also: the six properties as tabs over the canvas, and a flow hopping between
   the connectors it ships with. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go } from '../../kit';
import { Paste, Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Auto.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/auto';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const PROPS = [
  ['Durable execution', 'A run is a record, not a goroutine. Step state is written down as it goes, so a crash, a deploy or a rescheduled pod resumes where it stopped rather than starting over or losing the run.'],
  ['The catalog is in the binary', 'GET /v1/pieces lists the connectors this build has. No plugin registry to reach at boot, so the version you deployed is the version that runs, offline and forever.'],
  ['Triggers', 'POST to a trigger and a run starts. Or start one by hand against /v1/runs. Either way it is the same run object with the same history.'],
  ['Watch it live', 'The editor is React Flow, embedded in the binary, and it follows a run over a server-sent event stream — so the canvas you drew is the canvas you watch execute.'],
  ['Draft, then publish', 'Edit a flow freely; nothing changes for callers until you publish. What triggers fire is a published version, so editing in the afternoon does not change what runs overnight.'],
  ['Connections, not pasted keys', "A connection is a named credential the flow refers to. It is encrypted at rest through Hanzo KMS, and who may touch it is Hanzo IAM's answer, not a second login here."],
];
const NODES = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];
const N = NODES.length;

/* One lane of the run. at: the step reached; lost: the step it fell back to after the crash. */
function Lane({ label, at, crashed, kind }) {
  return (
    <div className={'au-lane ' + kind + (crashed ? ' crashed' : '')}>
      <p className="au-lane-k"><b>{label}</b><span className="x-mono">step {Math.min(at + 1, N)} / {N}</span></p>
      <div className="au-nodes">
        {NODES.map((n, i) => (
          <div key={n} className={'au-node' + (i < at ? ' done' : i === at ? ' now' : '')}>
            <span>{n}</span>
            {i < N - 1 && <i className="au-edge"><motion.b initial={false} animate={{ scaleX: i < at ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} /></i>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Run() {
  const [ref, live] = useLive(0.3);
  const [rec, setRec] = useState(2);
  const [go, setGo] = useState(2);
  const [crash, setCrash] = useState(false);
  const [saved, setSaved] = useState(null);
  const [mine, setMine] = useState(false);
  const [loops, setLoops] = useState(0);
  // each tick both runs take a step; a run that reached the end starts a new one
  useEvery(950, live && !crash, () => {
    if (rec >= N) { setRec(0); setGo(0); setLoops((l) => l + 1); return; } // a new run starts for both
    setRec(rec + 1);
    setGo((v) => Math.min(N, v + 1));
  });
  // idle: every other run, the pod is rescheduled at step 3
  useEffect(() => { if (!mine && live && !crash && rec === 2 && go === 2 && loops % 2 === 1) restart(); }, [rec, go, loops, live]); // eslint-disable-line react-hooks/exhaustive-deps
  const restart = () => {
    if (crash) return;
    setSaved(rec);
    setCrash(true);
    setTimeout(() => { setGo(0); setCrash(false); }, 1500);
  };
  return (
    <div className="au-run" ref={ref} data-cursor="Watch">
      <div className="au-canvas">
        <Lane label="A run kept as a record" at={rec} crashed={crash} kind="rec" />
        <Lane label="A run held in a goroutine" at={go} crashed={crash} kind="go" />
        <AnimatePresence>
          {crash && (
            <motion.div className="au-crash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <b className="x-mono">pod rescheduled</b>
              <span>record: resumes at step {saved + 1} · goroutine: starts over</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="au-run-foot">
        <button type="button" className="x-btn sm solid" onClick={() => { setMine(true); restart(); }} disabled={crash}>Restart the pod</button>
        <span className="x-mono">Step state is written down as it goes.</span>
      </div>
    </div>
  );
}

function Hero() {
  const [at, choose] = useSteps(6, 4200, false); // the run is the one thing moving here; the six properties turn by hand
  return (
    <section className="au-hero" aria-labelledby="au-h1">
      <div className="x-wrap">
        <div className="au-top">
          <motion.p className="au-url x-mono" {...up(0)}><img src="/models/zen.webp" alt="" />auto.hanzo.ai</motion.p>
          <h1 id="au-h1" className="au-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Auto</motion.span></span></h1>
          <motion.p className="au-lede" {...up(0.3)}>Workflow automation in one binary</motion.p>
          <motion.div className="au-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://auto.hanzo.ai" className="x-btn solid" data-thumb>Open Auto</A></motion.span>
            <Go to={DOCS}>Documentation</Go>
          </motion.div>
        </div>
        <motion.div className="au-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <div className="au-tabs-row">
            <p className="au-tabs-k"><span>A run that survives the restart</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
            <div className="au-tabs" role="tablist" aria-label="A run that survives the restart">
              {PROPS.map(([t], i) => (
                <button key={t} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}
                </button>
              ))}
            </div>
          </div>
          <div className="au-grid">
            <Run />
            <div className="au-prop" aria-live="polite">
              {PROPS.map(([t, d], i) => (
                <motion.div key={t} initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={at !== i} className="au-prop-i">
                  <h2>{t}</h2>
                  <p>{d}</p>
                </motion.div>
              ))}
              <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const PIECES = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'HubSpot', 'Jira', 'Linear', 'Discord', 'Airtable', 'Google Sheets', 'Postgres'];

/* A flow through the connectors this build ships with: press one and it becomes the flow's next step. */
function Pieces() {
  const [path, setPath] = useState([0, 4, 9]);
  const add = (i) => setPath((p) => (p.includes(i) ? p : [...p.slice(1), i]));
  return (
    <section className="x-sec au-pieces">
      <div className="x-wrap au-pieces-grid">
        <div>
          <Rise as="h2" y={20}>Some of what it connects</Rise>
          <p className="au-pieces-l x-mono">GET /v1/pieces</p>
        </div>
        <ul className="au-board">
          {PIECES.map((t, i) => {
            const k = path.indexOf(i);
            return (
              <li key={t} className={k >= 0 ? 'on o' + k : ''}>
                <button type="button" aria-pressed={k >= 0} onClick={() => add(i)} data-cursor={k >= 0 ? undefined : 'Add'}>{t}</button>
                {k >= 0 && <em className="x-mono" aria-hidden="true">{k + 1}</em>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section className="x-sec au-facts-sec" data-room="dark">
      <div className="x-wrap">
        <ul className="au-facts">
          {[['Go', 'One process'], ['SQLite', 'Per replica'], ['/v1', 'Flows and runs'], ['Apache', 'Self-hosted']].map(([k, d], i) => (
            <li key={k}><b>{k}</b><span>{d}</span></li>
          ))}
        </ul>
        <div className="au-self">
          <div>
            <h2>Or run it yourself</h2>
            <p>One container, one port, a SQLite file for state. Nothing else to stand up first.</p>
            <div className="au-acts"><A to="https://auto.hanzo.ai" className="x-btn solid">Open Auto</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
          </div>
          <Rise className="au-box" delay={0.1} aria-hidden="true">
            <div className="au-ctr"><span className="x-mono">container</span><b>auto</b><i className="au-port x-mono">:port</i><em className="x-mono">state.sqlite</em></div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

export default function Auto() {
  return (
    <main className="au">
      <Hero />
      <section className="x-sec au-paste">
        <div className="x-wrap"><Paste name="Auto" prompt="Read https://hanzo.ai/skill.md and use Hanzo Auto in my project. Start with: hanzo auto flows list" /></div>
      </section>
      <Pieces />
      <Facts />
      <Get name="Auto" tag="Workflow automations" />
    </main>
  );
}
