'use client';
/* Node, v2 launch page (Cloud 3), round 2 to JAMES.md.
   V2: 8/10 One machine's life: the node object settles beside huge type and runs itself (up, joined, hardware reported, jobs lighting the five levels of work, roots settling on Lux), tilts toward your pointer and takes a job of whatever level you point at; six reasons play in one pinned terminal; spec figures with a levels sheet; one dark room to put a machine on the fabric; ink and greys only.
   Signature: one machine, up. hanzo fabric up starts the node; it joins the fabric, reports the hardware it can serve,
   work is routed to it and each job lights its level on the five-level ladder that scales a provider's share, and
   batches settle as Merkle roots on Lux. It loops by itself while seen (pause in its toolbar); point at a level and the
   node takes a job of that level and settles a root for it.
   Beyond: drive it. In chapter five press up, join or stop: the node starts on the active network, switches and starts,
   or stops by its recorded pid while the other process that happens to share the name keeps running.
   Persona: Developer with a machine to lend (a compute provider). Goal: run a node.
   CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's
   sticky ask carries the same label from data-thumb). Metric: api_key_created.
   Motion: idle = the machine's own loop (pausable); pointer = the machine tilting toward a fine pointer on a spring, a
   level you point at taking a job, the magnetic close; state = the drive buttons in chapter five, the levels sheet
   rising; arrival = the cut-in title, the timed wipe into the dark room; scroll = Stage settle and the pinned terminal.
   Every word and link is Hanzo's; hashes and bars are drawn, not measured. */
import { useCallback, useEffect, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import { Paste, useLive } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer, { Sheet } from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './Node.css';

const DOCS = 'https://docs.hanzo.ai/docs/proof-of-ai/node-operator';
const LEVELS = ['embeddings and small models', 'chat-sized models', 'large and multimodal', 'training', 'specialized compute like proofs'];
const HW = ['Consumer cards', 'datacenter accelerators', 'Apple Silicon'];
const HEX = '0123456789abcdef';
const root = (n) => { let x = (n * 2654435761) >>> 0; return '0x' + Array.from({ length: 8 }, () => { x = (x * 1103515245 + 12345) >>> 0; return HEX[(x >>> 16) & 15]; }).join('') + '…'; };
const JOBS = [1, 0, 2, 4, 1, 3, 0, 2];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- the hero object: one machine ---------- */
function Machine() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, setT] = useState(0);
  const [pick, setPick] = useState(-1); // a level the pointer has routed a job to
  const [extra, setExtra] = useState(0); // roots settled for those jobs
  useEffect(() => {
    if (calm) { setT(9); return; }
    if (!live || paused || pick >= 0) return;
    const id = setTimeout(() => setT((v) => (v >= 3 + JOBS.length * 2 ? 3 : v + 1)), t === 0 ? 1200 : t < 3 ? 1000 : 1150);
    return () => clearTimeout(id);
  }, [t, live, calm, paused, pick]);
  const route = (i) => { setPick(i); setExtra((x) => x + 1); if (t < 3) setT(3); };
  const status = t === 0 ? 'stopped' : t === 1 ? 'starting' : t === 2 ? 'joined' : 'serving';
  const k = t >= 3 ? Math.floor((t - 3) / 2) % JOBS.length : -1;
  const job = pick >= 0 ? pick : t >= 3 && (t - 3) % 2 === 0 ? JOBS[k] : -1;
  const roots = (t >= 3 ? Math.floor((t - 3) / 2) : 0) + extra;
  const [last, setLast] = useState(0); // the level of the last job, for the phone's one-line label
  useEffect(() => { if (job >= 0) setLast(job); }, [job]);
  const cyc = Math.floor(t / 16);
  return (
    <div className="nd-mac" ref={ref} data-status={status}>
      <div className="nd-mac-top">
        <span className="nd-led" aria-hidden="true" />
        <span className="nd-mac-n">hanzod</span>
        <span className="nd-status" aria-live="polite">{status}</span>
        <LivePause paused={paused} onToggle={pause} className="nd-pause" />
      </div>
      <p className="nd-cmd"><span>$</span> hanzo fabric up<i className={'nd-caret' + (t === 0 ? ' on' : '')} aria-hidden="true" /></p>
      <div className="nd-mac-grid">
        <div className="nd-cell nd-hw">
          <p className="nd-k">reports what it can serve</p>
          <ul>{HW.map((h, i) => <li key={h} className={t >= 2 && i === (cyc + 2) % 3 ? 'on' : ''}>{h}</li>)}</ul>
        </div>
        <div className="nd-cell nd-net">
          <p className="nd-k">joins the fabric</p>
          <svg viewBox="0 0 120 70" aria-hidden="true" className={t >= 2 ? 'on' : ''}>
            {[[60, 35, 18, 14], [60, 35, 104, 12], [60, 35, 22, 58], [60, 35, 100, 60], [18, 14, 22, 58], [104, 12, 100, 60]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} style={{ transitionDelay: i * 0.08 + 's' }} />)}
            {[[18, 14], [104, 12], [22, 58], [100, 60]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" />)}
            <circle cx="60" cy="35" r="9" className="me" />
          </svg>
          <p className="nd-k2">peer-to-peer</p>
        </div>
        <div className="nd-cell nd-lv">
          <p className="nd-k" id="nd-lv-k">level of the work</p>
          <ol aria-labelledby="nd-lv-k" onPointerLeave={() => setPick(-1)}>
            {LEVELS.map((l, i) => (
              <li key={l}>
                <button type="button" className={job === i ? 'on' : ''} aria-pressed={pick === i} aria-label={l} style={{ '--s': 0.2 + i * 0.2 }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && pick !== i && route(i)} onBlur={() => setPick(-1)} onClick={() => route(i)}>
                  <i><b /></i>
                  <span aria-hidden="true">{l}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="nd-lv-now" aria-hidden="true">{job >= 0 ? LEVELS[job] : LEVELS[last]}</p>
        </div>
        <div className="nd-cell nd-lux">
          <p className="nd-k">settled on Lux</p>
          <ul>
            {roots === 0 ? <li className="wait">waiting for work</li> : Array.from({ length: Math.min(roots, 3) }).map((_, i) => {
              const n = roots - Math.min(roots, 3) + i;
              return <li key={n} className={i === Math.min(roots, 3) - 1 ? 'new' : ''}><b>Merkle root</b>{root(n + 1)}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* the machine leans toward a fine pointer, a few degrees, on a spring {300, 30}; home on leave */
function Lean({ children }) {
  const calm = useReducedMotion();
  const rx = useSpring(0, { stiffness: 300, damping: 30 });
  const ry = useSpring(0, { stiffness: 300, damping: 30 });
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
  };
  return (
    <motion.div className="nd-lean" style={{ rotateX: rx, rotateY: ry, transformPerspective: 1600 }} onPointerMove={move} onPointerLeave={() => { rx.set(0); ry.set(0); }}>
      {children}
    </motion.div>
  );
}

/* "See the levels": the kit's sheet, mounted only while it is up. The kit's SpecDrawer keeps its closed sheet in the DOM
   with aria-modal="true", which the site's sticky ask (components/Ask.jsx) reads as an open overlay, so the ask never
   showed on this page; mounting on demand keeps the ask (the five levels are in the HTML in chapter two and the hero). */
function LevelsSheet() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const show = () => { setMounted(true); setTimeout(() => setOpen(true), 30); };
  const hide = useCallback(() => { setOpen(false); setTimeout(() => setMounted(false), 650); }, []);
  return (
    <div className="lx-spec-foot">
      <button type="button" className="lx-ghost lx-spec-open" aria-haspopup="dialog" aria-expanded={open} onClick={show}>See the levels<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
      {mounted && (
        <Sheet open={open} onClose={hide} title="Level of the work">
          <ol className="nd-sheet">{LEVELS.map((l, i) => <li key={l} style={{ '--i': i }}><span className="lx-num">{pad(i + 1)}</span><b>{l}</b><i><em style={{ transform: `scaleX(${0.2 + i * 0.2})` }} /></i></li>)}</ol>
        </Sheet>
      )}
    </div>
  );
}

/* ---------- the chapters' object: one terminal ---------- */
const WHY = [
  ['The hardware you already have', 'Consumer cards, datacenter accelerators, or Apple Silicon. The node reports what it can serve and the cluster routes to it on that basis.'],
  ['Paid out of the block reward', "A tenth of the block reward is set aside for AI compute. A provider's share is scaled by the level of the work — embeddings and small models, chat-sized models, large and multimodal, training, or specialized compute like proofs."],
  ['The cluster knows who has what', 'Ask it for models and it lists everything served across the peers your node can see. Ask it to route and it names who would answer; ask for placement and it says where a model nobody serves should be loaded.'],
  ['Attested, then trusted', "A node's confidential-compute tier is attested rather than declared, and its share is scaled by that tier and by a trust score. Claiming a capability is not the same as proving one."],
  ['Three commands, no orchestration', 'up starts it on the active network, join switches network and starts it, stop signals the process this CLI started by its recorded pid — and never anything else that happens to share the name.'],
  ['Settled on Lux', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, so what a node did is anchored where it cannot quietly be rewritten later.'],
];
const DRIVE = { up: 'running · active network', join: 'running · switched network', stop: 'stopped · recorded pid' };

function Screen({ step, drive }) {
  if (step === 0) return (
    <>
      <p className="c"><span>$</span> hanzo fabric up</p>
      <p className="o">reports what it can serve</p>
      <div className="nd-t-hw">{HW.map((h) => <b key={h}>{h}</b>)}</div>
      <p className="o">the cluster routes to it <em>on that basis</em></p>
    </>
  );
  if (step === 1) return (
    <>
      <p className="o">block reward <em>→ a tenth</em> · AI compute</p>
      <ol className="nd-t-lv">{LEVELS.map((l, i) => <li key={l} style={{ '--i': i }}><span>{l}</span><i><b style={{ transform: `scaleX(${0.2 + i * 0.2})` }} /></i></li>)}</ol>
      <p className="o">share scaled by <em>the level of the work</em></p>
    </>
  );
  if (step === 2) return (
    <ul className="nd-t-ask">
      <li><code>models</code><span>everything served across the peers</span></li>
      <li><code>route</code><span>names who would answer</span></li>
      <li><code>placement</code><span>where a model nobody serves loads</span></li>
    </ul>
  );
  if (step === 3) return (
    <ul className="nd-t-tier">
      <li className="no"><span>declared</span><b>not proof</b></li>
      <li className="yes"><span>attested</span><b>✓ tier</b></li>
      <li className="tr"><span>trust score</span><i><b /></i></li>
    </ul>
  );
  if (step === 4) return (
    <>
      <p className="c"><span>$</span> hanzo fabric {drive}</p>
      <ul className="nd-t-ps">
        <li className={drive === 'stop' ? 'off' : 'run'}><code>hanzod</code><span>this CLI</span><em>{DRIVE[drive]}</em></li>
        <li className="run other"><code>hanzod</code><span>shares the name</span><em>running · untouched</em></li>
      </ul>
    </>
  );
  return (
    <>
      <p className="o">ordered on <em>the Hanzo L2</em></p>
      <ul className="nd-t-roots">{[1, 2, 3, 4].map((n) => <li key={n} style={{ '--i': n }}><b>Merkle root</b><code>{root(n + 3)}</code><span>Lux</span></li>)}</ul>
      <p className="o">anchored · <em>cannot quietly be rewritten</em></p>
    </>
  );
}

function Term({ step, drive }) {
  return (
    <div className="nd-term" data-step={step}>
      <div className="nd-term-bar"><i /><i /><i /><span>hanzod — node</span></div>
      <div className="nd-term-body" key={step + (step === 4 ? drive : '')}><Screen step={step} drive={drive} /></div>
    </div>
  );
}

function Drive({ drive, setDrive }) {
  return (
    <div className="nd-drive" role="group" aria-label="Drive the node">
      {['up', 'join', 'stop'].map((c) => <button key={c} type="button" aria-pressed={drive === c} onClick={() => setDrive(c)}><span>hanzo fabric</span> {c}</button>)}
    </div>
  );
}

export default function Node() {
  const [drive, setDrive] = useState('up');
  const steps = WHY.map(([t, d], i) => ({ t, d, extra: i === 4 ? <Drive drive={drive} setDrive={setDrive} /> : null }));
  return (
    <main className="lx nd" data-ask-name="Hanzo Node">
      <section className="nd-hero" data-morph-target>
        <div className="lx-wrap nd-hero-grid">
          <Lean><SettleStage from={1.05} lift={30} className="nd-stage"><Machine /></SettleStage></Lean>
          <div className="nd-hero-copy">
            <LineMask as="h1" className="lx-display nd-h1" lines={['Hanzo', 'Node']} />
            <p className="lx-title nd-sub">Decentralized AI Compute</p>
            <p className="nd-lede">hanzod is the node that runs hanzo.network. It joins the fabric over a peer-to-peer transport, serves models to whatever the cluster routes to it, and settles the work on Lux. One Rust binary, started with hanzo fabric up.</p>
            <div className="nd-acts">
              <A to={DOCS} className="lx-cta" data-thumb="Run a Node" data-cta="node.hero">Run a Node<Arr /></A>
              <A to="https://github.com/hanzoai" className="lx-text">View Source</A>
            </div>
          </div>
        </div>
      </section>

      <section className="lx-sec nd-why">
        <div className="lx-wrap nd-why-grid">
          <LineMask as="h2" className="lx-display m" lines={['Why Run a', 'Hanzo Node']} inView />
          <div className="nd-spec">
            <SpecDrawer rows={[{ v: '1', l: 'Rust binary' }, { v: '3', l: 'commands, no orchestration' }, { v: '5', l: 'levels of the work' }, { v: '1/10', l: 'of the block reward, for AI compute' }]} />
            <LevelsSheet />
          </div>
        </div>
      </section>

      <PinnedChapters label="Why Run a Hanzo Node" steps={steps} per={76} visual={(at) => <Term step={at} drive={drive} />} />

      <ClipWipe dark className="nd-put">
        <div className="lx-wrap nd-put-grid">
          <div className="nd-put-l">
            <h2 className="lx-headline">Put a machine on the fabric</h2>
            <p className="lx-lede">Install the CLI, pick a network, run hanzo fabric up. The node binary is resolved from your PATH or an env var — the CLI runs it and never builds it for you.</p>
            <div className="nd-acts">
              <A to={DOCS} className="lx-ghost">Quickstart<Arr /></A>
              <A to="/network" className="lx-text" data-morph>About the Network</A>
              <A to="https://github.com/hanzoai" className="lx-text">View on GitHub</A>
            </div>
          </div>
          <div className="nd-put-r">
            <Paste dark name="Node" prompt="Read https://hanzo.ai/skill.md and use Hanzo Node in my project. Start with: hanzo node list" className="lx-paste" />
            <div className="nd-docs"><span className="lx-kick">Node</span><A to={DOCS} className="nd-docs-a">Node docs →</A></div>
          </div>
        </div>
      </ClipWipe>

      <LaunchClose name="Node" tag="Standalone Hanzo node" seed="node" data={[5, 3, 10]} ask={['Run a Node', DOCS]} cta="node.close" self={DOCS} />
    </main>
  );
}
