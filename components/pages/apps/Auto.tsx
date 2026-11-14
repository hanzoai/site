'use client';
/* Auto (v2, Cloud 4 chat). Archetype A, Launch. Order: the race (title stack over two full-bleed tracks) → the drag
   canvas, the one dark room → the connectors as a workflow you re-route → six properties as an index whose open row shows
   its live object beside its title → Get Auto → one closing band. No pinned or scroll-scrubbed scene.
   Persona: a developer who wants workflows that survive a restart. Goal: open Auto.
   CTA: "Open Auto" (hero, ask bar, close; data-cta primary / close). Metric: cta_click:auto.primary.
   V2: 8/10 signature drag-canvas: the second screen is a dark plane you pan by mouse, finger or arrow keys (momentum, clamped, reset button, tap-to-jump minimap) holding Auto's parts as they connect (two ways in, the published flow with a token running its wires, record vs goroutine, draft vs published, GET /v1/pieces, the connection with Hanzo IAM and KMS, the four figures and the container); the pinned figures room is gone; sections reordered (race, canvas, connectors, index, band) and each enters its own way (word-shuffle, rack-focus, scroll-tilt, iris, stack-drop)
   Signature: drag-canvas (MOTION-MAP). Auto's parts sit on one large plane the visitor drags around: the flow in the
   middle, its two triggers to the left, the two runs and the reschedule below, the catalog and the connection to the
   lower right, the figures and the container they live in to the right, wired together. It nudges sideways once on
   arrival; arrows pan it (Shift for longer steps), Home or the reset button recentres it, the minimap jumps.
   The first screen keeps the race: the same flow runs twice, once kept as a record and once held in a goroutine; on the
   first run the pod is rescheduled and the record resumes where the goroutine starts over.
   Beyond: restart the pod yourself, at any moment, and watch which run keeps its place (Hanzo's own claim: a run is a
   record, not a goroutine).
   Motion: drag with momentum (signature, in auto/Canvas.jsx) + the running tracks (time, pausable) + pointer lean on the
   tracks (useSpring) + drawn wires in the connector chain (pathLength). The index line grows as it opens (state). One
   section entrance each, no shared reveal. Every word and link is Hanzo's.
   Entrances (MOTION-MAP, in order): 1 word-shuffle (hero: the h1, caption and line arrive word by word out of order and
   swap into place) · 2 rack-focus (the drag canvas pulls into focus from a blur) · 3 scroll-tilt (the connectors tilt back
   on rotateX, lean with scroll speed and level out) · 4 iris (the property index opens through a circular clip from its
   centre) · 5 stack-drop (the closing band's layers drop and stack onto each other). All in auto/Entrances.jsx + Auto.css. */
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { EASE } from '../../ui';
import { Cta } from '../../kit';
import Finale from '../../v2/Finale';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import Mini from './auto/Minis';
import Canvas from './auto/Canvas';
import { Enter, Shuffle } from './auto/Entrances';
import './Auto.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/auto';
const OPEN = 'https://auto.hanzo.ai';
const NODES = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];
const N = NODES.length;

/* status glyph on a node: pending ring, running arc, done tick */
interface GlyphProps {
  s: string;
}
function Glyph({ s }: GlyphProps) {
  return (
    <svg className={'au2-g ' + s} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {s === 'done' && <path d="M5 8.2 7.1 10.3 11 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

/* One track of the flow, running edge to edge. */
interface LaneProps {
  label: string;
  at: number;
  kind: string;
  lost?: boolean;
}
function Lane({ label, at, kind, lost }: LaneProps) {
  const cur = Math.min(at, N - 1);
  return (
    <div className={'au2-lane ' + kind + (lost ? ' lost' : '')}>
      <div className="l2-wrap">
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
    </div>
  );
}

/* Pointer lean for the tracks, fine pointers only (up to 1.5°); applied only after mount so the server HTML is plain. */
function useLean() {
  const rx = useSpring(0, { stiffness: 140, damping: 22 });
  const ry = useSpring(0, { stiffness: 140, damping: 22 });
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches); }, []);
  if (!fine) return {};
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 3);
    rx.set((0.5 - (e.clientY - r.top) / r.height) * 2);
  };
  const onPointerLeave = () => { rx.set(0); ry.set(0); };
  return { style: { rotateX: rx, rotateY: ry, transformPerspective: 1800 }, onPointerMove, onPointerLeave };
}

/* The race: both runs step together; on the first run (then every other run) the pod is rescheduled at step 3. */
function Run() {
  const [ref, live, calm, paused, toggle] = useDemo(0.25);
  const lean = useLean();
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
    <div className="au2-race" ref={ref}>
      <div className="l2-wrap au2-ctl">
        <button type="button" className={'au2-restart' + (crash ? ' busy' : '')} onClick={() => { setMine(loops); restart(); }} aria-disabled={crash || undefined} aria-label="Restart the pod">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.55M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="au2-ctl-t l2-mono">Step state is written down as it goes.</span>
        <span className="au2-ctl-k l2-mono">React Flow · SSE</span>
        <span className="au2-pub l2-mono"><i />published</span>
        <PauseBtn paused={paused} onClick={toggle} />
      </div>
      <motion.div className="au2-lanes" {...lean}>
        <Lane label="A run kept as a record" at={R} kind="rec" />
        <div className={'au2-mark' + (cut ? ' on' : '')}>
          <i className="au2-mark-l" aria-hidden="true" />
          <div className="l2-wrap">
            <b className="l2-mono">pod rescheduled</b>
            <span className="l2-mono">record: resumes at step {(calm ? 2 : saved) + 1} · goroutine: starts over</span>
          </div>
        </div>
        <Lane label="A run held in a goroutine" at={G} kind="go" lost={crash} />
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="au2-hero" aria-labelledby="au2-h1">
      <div className="l2-wrap au2-top">
        <h1 id="au2-h1" className="l2-display"><Shuffle text="Hanzo Auto" /></h1>
        <p className="l2-stage-kick l2-mono"><Shuffle text="auto.hanzo.ai" start={2} /></p>
        <div className="au2-sub">
          <p className="l2-lede"><Shuffle text="Workflow automation in one binary" start={3} /></p>
          <div className="l2-acts">
            <Cta to={OPEN} id="primary" size="lg" thumb data-thumb="Open Auto">Open Auto</Cta>
            <Cta to={DOCS} kind="link" id="docs">Documentation</Cta>
          </div>
        </div>
      </div>
      <Run />
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

/* The six properties as an index: closed lines rest small; the open one grows, and its live object sits beside its title. */
function Index() {
  const [open, setOpen] = useState(0);
  const [ref, live, calm, paused, toggle] = useDemo<HTMLOListElement>(0.2);
  return (
    <Enter as="section" kind="iris" className="l2-sec au2-idx" threshold={0.12}>
      <div className="l2-wrap">
        <h2 className="l2-head">A run that survives the restart</h2>
        <ol className="au2-list" ref={ref}>
          {PROPS.map(([t, d], i) => (
            <li key={t} className={open === i ? 'open' : ''}>
              <div className="au2-li-l">
                <button type="button" className="au2-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="l2-ch-n">{String(i + 1).padStart(2, '0')} / 06</span>
                  <span className="au2-t">{t}</span>
                  <svg className="au2-x" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <div className="au2-d" inert={open !== i}><div><p className="l2-body">{d}</p></div></div>
              </div>
              <div className="au2-d au2-d-r" inert={open !== i}>
                <div>
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
    </Enter>
  );
}

const PIECES = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'HubSpot', 'Jira', 'Linear', 'Discord', 'Airtable', 'Google Sheets', 'Postgres'];

/* Press a connector and it becomes the flow's next step; the wires between steps draw again as the chain re-flows. */
function Pieces() {
  const [path, setPath] = useState([0, 4, 9]);
  const add = (i: number) => setPath((p) => (p.includes(i) ? p : [...p.slice(1), i]));
  return (
    <Enter as="section" kind="tilt" className="l2-sec tight au2-pieces" threshold={0.05}>
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
    </Enter>
  );
}

/* The one dark room: Auto laid out on a plane you drag around (the figures and the container live on it). */
function Explore() {
  return (
    <Enter as="section" kind="focus" className="l2-dark au2-cvs" data-room="dark">
      <div className="l2-wrap"><Canvas /></div>
    </Enter>
  );
}

export default function Auto() {
  return (
    <main id="main" className="l2-page au2" data-ask="off">
      <Hero />
      <Explore />
      <Pieces />
      <Index />
      <Enter kind="stack" threshold={0.15}>
      <Finale
        name="Auto"
        head="Or run it yourself"
        lede="One container, one port, a SQLite file for state. Nothing else to stand up first."
        ask={['Open Auto', OPEN]}
        links={[['View on GitHub', 'https://github.com/hanzoai']]}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Auto in my project. Start with: hanzo auto flows list"
        tag="Workflow automations"
      />
      </Enter>
    </main>
  );
}
