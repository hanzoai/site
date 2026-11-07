'use client';
/* Node, Cloud 3 launch page, round 3 to docs/MASTER.md (the only brief).
   V2: 8/10 Round 4 (review 7/10): the h1 now cuts in after the page is painted (it used to finish before first paint); the machine shows its own process (pid, network, the level it is serving) instead of /network's peer lines; the hero-to-Why band is ~120px, not ~300; the figures roll and settle once on entry; the pinned stage is 48svh a chapter (was 76), sits higher, and each chapter plays a 2.8s scripted beat when it arrives (command keyed in, chips one by one, bars filling, models/route/placement lit in turn, declared struck then attested ringed, the node driving itself up/join/stop once, roots appended to Lux) and rests on a blinking prompt; under 900px the scene stacks, one terminal per chapter at true height; Copy swaps to the tick and "Copied" together; text links part their stroke, Node docs' arrow nudges.
   Persona: Developer with a machine to lend (a compute provider).
   Goal: run a node.
   CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's
   sticky ask carries the same label from data-thumb).
   Metric: api_key_created.
   Signature: one machine, up. hanzo fabric up starts the node; it joins the fabric, reports the hardware it can serve,
   work is routed to it and each job lights its level on the five-level ladder that scales a provider's share, and
   batches settle as Merkle roots on Lux. It runs once by itself while seen (about nine seconds) and rests serving; play in
   its toolbar replays it; point at a level and the
   node takes a job of that level and settles a root for it.
   Beyond: drive it. In chapter five press up, join or stop: the node starts on the active network, switches and starts,
   or stops by its recorded pid while the other process that happens to share the name keeps running.
   Motion (1 signature + 3): idle = the machine's own loop (the one continuous mover, pausable); pointer = the machine
   tilting toward a fine pointer (2.5° at most, eased 300ms), a level you point at taking a job, the magnetic close;
   time = each chapter's scripted beat on the terminal (one frame scheduler, plays once, rests on a blinking prompt);
   state = the drive control, the levels sheet rising, the Copy confirm; arrival = the cut-in title, the figures
   settling, the timed wipe into the quiet room; scroll (under half) = the stage settling from big to its place and
   the pinned terminal (stacked under 900px).
   Every word and link is Hanzo's; hashes and bars are drawn, not measured. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import { Paste, useLive, useFrame } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer, { Sheet } from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './Node.css';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const DOCS = 'https://docs.hanzo.ai/docs/proof-of-ai/node-operator';
const LEVELS = ['embeddings and small models', 'chat-sized models', 'large and multimodal', 'training', 'specialized compute like proofs'];
const HW = ['Consumer cards', 'datacenter accelerators', 'Apple Silicon'];
const HEX = '0123456789abcdef';
const root = (n) => { let x = (n * 2654435761) >>> 0; return '0x' + Array.from({ length: 8 }, () => { x = (x * 1103515245 + 12345) >>> 0; return HEX[(x >>> 16) & 15]; }).join('') + '…'; };
const JOBS = [1, 0, 2, 4];
const END = 3 + JOBS.length * 2 - 1; // up, starting, joined, then four jobs lit and settled: about nine seconds, once
const pad = (n) => String(n).padStart(2, '0');
const PID = '—'; // the recorded pid: Hanzo prints no value, so an em dash (copy is word-for-word Hanzo)

/* ---------- the hero object: one machine ---------- */
function Machine() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, setT] = useState(0);
  const [pick, setPick] = useState(-1); // a level the pointer has routed a job to
  const [extra, setExtra] = useState(0); // roots settled for those jobs
  useEffect(() => {
    if (calm) { setT(END); return; }
    if (!live || paused || pick >= 0 || t >= END) return; // MASTER §4.1: it runs once, then rests serving; play replays
    const id = setTimeout(() => setT((v) => v + 1), t === 0 ? 700 : t < 3 ? 1000 : 950);
    return () => clearTimeout(id);
  }, [t, live, calm, paused, pick]);
  const toggle = () => { if (t >= END) { setT(0); setExtra(0); if (paused) pause(); } else pause(); };
  const route = (i) => { setPick(i); setExtra((x) => x + 1); if (t < 3) setT(3); };
  const status = t === 0 ? 'stopped' : t === 1 ? 'starting' : t === 2 ? 'joined' : 'serving';
  const k = t >= 3 ? Math.floor((t - 3) / 2) % JOBS.length : -1;
  const job = pick >= 0 ? pick : t >= 3 && (t - 3) % 2 === 0 ? JOBS[k] : -1;
  const roots = (t >= 4 ? Math.floor((t - 2) / 2) : 0) + extra; // a job settles as a root one beat after it lights
  const [last, setLast] = useState(0); // the level of the last job, for the phone's one-line label
  useEffect(() => { if (job >= 0) setLast(job); }, [job]);
  const cyc = Math.floor(t / 16);
  return (
    <div className="nd-mac" ref={ref} data-status={status}>
      <div className="nd-mac-top">
        <LivePause paused={paused || t >= END} onToggle={toggle} inline className="nd-pause" />
        <span className="nd-led" aria-hidden="true" />
        <span className="nd-mac-n">hanzod</span>
        <span className="nd-status" aria-live="polite">{status}</span>
      </div>
      <p className="nd-cmd"><span>$</span> hanzo fabric up<i className={'nd-caret' + (t === 0 ? ' on' : '')} aria-hidden="true" /></p>
      <div className="nd-mac-grid">
        <div className="nd-cell nd-hw">
          <p className="nd-k">reports what it can serve</p>
          <ul>{HW.map((h, i) => <li key={h} className={t >= 2 && i === (cyc + 2) % 3 ? 'on' : ''}>{h}</li>)}</ul>
        </div>
        <div className="nd-cell nd-net">
          <p className="nd-k">joins the fabric</p>
          {/* this one machine's own process, not a peer diagram (that is /network's): its recorded pid as it starts, the
              network it joined, the level of the job it is serving now; each rule draws in as its row comes up */}
          <ul className="nd-peers nd-proc" aria-hidden="true">
            {[['pid', PID, t >= 1], ['network', 'hanzo.network', t >= 2], ['level', job >= 0 ? pad(job + 1) + ' / 05' : '·', t >= 3]].map(([k, v, on], i) => (
              <li key={k} className={(on ? 'on' : '') + (i === 2 && job >= 0 ? ' lit' : '')} style={{ '--i': i }}><span>{k}</span><i><b /></i><span>{on ? v : '·'}</span></li>
            ))}
          </ul>
          <p className="nd-k2">peer-to-peer</p>
        </div>
        <div className="nd-cell nd-lv">
          <p className="nd-k" id="nd-lv-k">level of the work</p>
          <ol aria-labelledby="nd-lv-k" onPointerLeave={() => setPick(-1)}>
            {LEVELS.map((l, i) => (
              <li key={l}>
                <button type="button" className={job === i ? 'on' : ''} aria-pressed={pick === i} aria-label={l} style={{ '--s': 0.2 + i * 0.2 }} data-cursor=""
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
          {/* three slots from the start: settled roots fill them, the empty ones wait as dashed rows (nothing ever moves) */}
          <ul>
            {Array.from({ length: 3 }).map((_, i) => {
              const shown = Math.min(roots, 3);
              if (i >= shown) return <li key={'s' + i} className={'slot' + (roots === 0 && i === 0 ? ' wait' : '')} aria-hidden={roots === 0 && i === 0 ? undefined : true}>{roots === 0 && i === 0 ? 'waiting for work' : null}</li>;
              const n = roots - shown + i;
              return <li key={n} className={i === shown - 1 ? 'new' : ''}><b>Merkle root</b>{root(n + 1)}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* the machine leans toward a fine pointer: at most 2.5° (MASTER §3.1), eased 300ms in CSS, home on leave; no spring */
function Lean({ children }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
    const rx = -((e.clientY - r.top) / r.height - 0.5) * 4;
    ref.current.style.transform = `perspective(1600px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };
  const home = () => { if (ref.current) ref.current.style.transform = ''; };
  return <div ref={ref} className="nd-lean" onPointerMove={move} onPointerLeave={home}>{children}</div>;
}

/* "See the levels": the kit's sheet, mounted only while it is up, so the site's sticky ask never reads a closed sheet
   as an open overlay (the five levels are in the HTML in chapter two and the hero). */
function LevelsSheet() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const show = () => { setMounted(true); setTimeout(() => setOpen(true), 30); };
  const hide = useCallback(() => { setOpen(false); setTimeout(() => setMounted(false), 500); }, []);
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

/* each chapter's beat: when a chapter becomes the one on the terminal (and the terminal is seen), its lines play out
   once over BEAT seconds on the page's one frame scheduler (Frame's useFrame), then rest. b is seconds into the beat.
   Server HTML, JS off and reduced motion all hold the final frame (b = BEAT); after mount it is armed at 0 until seen. */
const BEAT = 2.8;
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
function useBeat(key, run, calm) {
  const [b, setB] = useState(BEAT);
  const t0 = useRef(0);
  useIso(() => {
    if (calm) { setB(BEAT); return; }
    if (!run) { setB(0); return; } // armed: the terminal waits, empty of this chapter's lines, until it is seen
    t0.current = performance.now();
    setB(0);
  }, [key, run, calm]);
  useFrame(run && !calm && b < BEAT, () => {
    const v = Math.min(BEAT, (performance.now() - t0.current) / 1000);
    const q = v >= BEAT ? BEAT : Math.floor(v * 30) / 30;
    setB((o) => (o === q ? o : q));
  });
  return b;
}

/* a string keyed in a character at a time from at, at 50ms a character; the rest of it holds its room unseen */
function Keyed({ text, b, at }) {
  const n = b >= BEAT ? text.length : Math.max(0, Math.min(text.length, Math.floor((b - at) / 0.05)));
  return <>{text.slice(0, n)}<span className="nd-ghost">{text.slice(n)}</span></>;
}

function Screen({ step, drive, b }) {
  const R = (at, c = '') => (c ? c + ' ' : '') + 'nd-b' + (b >= at ? ' in' : '');
  const rest = <p className={R(BEAT - 0.3, 'c nd-rest')}><span>$</span><i className={'nd-caret' + (b >= BEAT ? ' on' : '')} aria-hidden="true" /></p>;
  if (step === 0) return (
    <>
      <p className="c"><span>$</span> <Keyed text="hanzo fabric up" b={b} at={0.1} /></p>
      <p className={R(1, 'o')}>reports what it can serve</p>
      <div className="nd-t-hw">{HW.map((h, i) => <b key={h} className={R(1.25 + i * 0.3)}>{h}</b>)}</div>
      <p className={R(1.95, 'o')}>the cluster routes to it <em><Keyed text="on that basis" b={b} at={2.05} /></em></p>
      {rest}
    </>
  );
  if (step === 1) return (
    <>
      <p className="o">block reward <em className={R(0.3)}>→ a tenth</em> · AI compute</p>
      <ol className="nd-t-lv">{LEVELS.map((l, i) => {
        const f = ease((b - 0.5 - i * 0.28) / 0.7);
        return <li key={l} className={f > 0 ? 'on' : ''} style={{ '--i': i }}><span>{l}</span><i><b style={{ transform: `scaleX(${((0.2 + i * 0.2) * f).toFixed(3)})` }} /></i></li>;
      })}</ol>
      <p className={R(2.2, 'o')}>share scaled by <em>the level of the work</em></p>
      {rest}
    </>
  );
  if (step === 2) {
    const lit = b >= 0.4 && b < 2.5 ? Math.min(2, Math.floor((b - 0.4) / 0.7)) : -1;
    return (
      <>
        <ul className="nd-t-ask">
          {[['models', 'everything served across the peers'], ['route', 'names who would answer'], ['placement', 'where a model nobody serves loads']].map(([c, s], i) => (
            <li key={c} className={R(0.4 + i * 0.7) + (lit === i ? ' lit' : '')}><code>{c}</code><span>{s}</span></li>
          ))}
        </ul>
        {rest}
      </>
    );
  }
  if (step === 3) return (
    <>
      <ul className="nd-t-tier">
        <li className={R(0.2, 'no') + (b >= 0.8 ? ' struck' : '')}><span>declared</span><b>not proof</b></li>
        <li className={R(1.3, 'yes') + (b >= 1.4 ? ' ring' : '')}><span>attested</span><b className={R(1.9)}>✓ tier</b></li>
        <li className={R(2.1, 'tr')}><span>trust score</span><i><b style={{ transform: `scaleX(${(0.8 * ease((b - 2.2) / 0.6)).toFixed(3)})` }} /></i></li>
      </ul>
      {rest}
    </>
  );
  if (step === 4) return (
    <>
      <p className="c"><span>$</span> hanzo fabric {drive}</p>
      <ul className="nd-t-ps">
        <li className={drive === 'stop' ? 'off' : 'run'}><code>hanzod</code><span>this CLI</span><em>{DRIVE[drive]}</em></li>
        <li className="run other"><code>hanzod</code><span>shares the name</span><em>running · untouched</em></li>
      </ul>
      {rest}
    </>
  );
  const newest = b >= BEAT ? -1 : Math.floor((b - 0.4) / 0.45);
  return (
    <>
      <p className="o">ordered on <em>the Hanzo L2</em></p>
      <ul className="nd-t-roots">{[1, 2, 3, 4].map((n, i) => <li key={n} className={R(0.4 + i * 0.45) + (newest === i ? ' lit' : '')}><b>Merkle root</b><code>{root(n + 3)}</code><span>Lux</span></li>)}</ul>
      <p className={R(2.4, 'o')}>anchored · <em>cannot quietly be rewritten</em></p>
      {rest}
    </>
  );
}

/* chapter five's beat drives the node itself once (up, then join, then stop) before handing it to the visitor */
const autoVerb = (b) => (b < 0.3 || b >= BEAT ? null : b < 1.1 ? 'up' : b < 2 ? 'join' : 'stop');

function Term({ step, drive, onAuto }) {
  const [ref, live, calm] = useLive(0.3);
  const b = useBeat(step, live, calm);
  const auto = step === 4 ? autoVerb(b) : null;
  useEffect(() => { if (auto && onAuto) onAuto(auto); }, [auto, onAuto]);
  return (
    <div className="nd-term" data-step={step} ref={ref}>
      <div className="nd-term-bar"><i /><i /><i /><span>hanzod — node</span></div>
      <div className="nd-term-body" key={step + (step === 4 ? drive : '')}><Screen step={step} drive={drive} b={b} /></div>
    </div>
  );
}

/* drive it: one command bar of three verbs (a single control, not three buttons); the chosen verb fills with ink */
function Drive({ drive, setDrive }) {
  return (
    <div className="nd-drive" role="group" aria-label="Drive the node">
      <span className="nd-drive-p" aria-hidden="true">hanzo fabric</span>
      {['up', 'join', 'stop'].map((c) => <button key={c} type="button" aria-pressed={drive === c} onClick={() => setDrive(c)}>{c}</button>)}
    </div>
  );
}

/* phones (under 900px, MASTER part 11): the pinned scene stacks, each chapter with its own terminal at true height,
   each playing its beat once as it comes into view. Desktop keeps the pinned stage; CSS shows one or the other. */
function Stack({ drive, setDrive, onAuto }) {
  return (
    <section className="nd-stack" aria-label="Why Run a Hanzo Node">
      <ol className="lx-wrap nd-stack-l">
        {WHY.map(([t, d], i) => (
          <li key={t}>
            <h3 className="lx-pin-t">{t}</h3>
            <p className="lx-kick nd-stack-k">{pad(i + 1)} / {pad(WHY.length)}</p>
            <p className="lx-pin-d">{d}</p>
            {i === 4 && <Drive drive={drive} setDrive={setDrive} />}
            <Term step={i} drive={drive} onAuto={onAuto} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* a figure settles once as it is reached: each digit rolls a full turn and lands on its true value (MASTER part 9).
   The true value is the server HTML; the rolling columns exist only after mount, below the fold, out of the a11y tree. */
function Roll({ v, i }) {
  const ref = useRef(null);
  const [st, setSt] = useState('set');
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // already in view: leave it set
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('go'); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (st === 'set') return <span ref={ref} className="nd-roll">{v}</span>;
  return (
    <span ref={ref} className="nd-roll" data-st={st}>
      <span className="x-sr">{v}</span>
      <span className="nd-roll-v" aria-hidden="true">
        {[...v].map((c, j) => (/\d/.test(c)
          ? <span key={j} className="nd-col" style={{ '--d': i * 2 + j, '--to': 10 + +c }}><span>{Array.from({ length: 11 + +c }, (_, k) => <span key={k}>{k % 10}</span>)}</span></span>
          : <span key={j}>{c}</span>))}
      </span>
    </span>
  );
}

/* the h1 cut in by line mask (MASTER part 3: 105% to 0, 700ms, ease-emphasis, 60ms apart). The kit's LineMask starts at
   style time, which on a cold load is before the first paint, so it was over before anyone saw it; here the cut starts
   once the page is up (after mount), with a CSS-only failsafe at 1.6s, and the words are the server HTML. */
function Title() {
  const ref = useRef(null);
  useEffect(() => {
    if (performance.now() > 1800) return; // the failsafe already has it
    const id = requestAnimationFrame(() => ref.current?.setAttribute('data-in', ''));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <h1 ref={ref} className="lx-display lx-lm nd-h1">
      <span className="lx-line"><span>Hanzo</span></span>
      <span className="lx-line"><span>Node</span></span>
    </h1>
  );
}

export default function Node() {
  const [drive, setDrive] = useState('up');
  const mine = useRef(false); // once the visitor drives it, the beat never takes the wheel again
  const byHand = useCallback((c) => { mine.current = true; setDrive(c); }, []);
  const onAuto = useCallback((c) => { if (!mine.current) setDrive(c); }, []);
  const steps = WHY.map(([t, d], i) => ({ t, d, extra: i === 4 ? <Drive drive={drive} setDrive={byHand} /> : null }));
  return (
    <main className="lx nd">
      <section className="nd-hero" data-morph-target data-ask-name="Hanzo Node">
        <div className="lx-wrap nd-hero-grid">
          <Lean><SettleStage from={1.06} lift={24} className="nd-stage"><Machine /></SettleStage></Lean>
          <div className="nd-hero-copy">
            <Title />
            <p className="lx-title nd-sub">Decentralized AI Compute</p>
            <p className="lx-lede nd-lede">hanzod is the node that runs hanzo.network. It joins the fabric over a peer-to-peer transport, serves models to whatever the cluster routes to it, and settles the work on Lux. One Rust binary, started with hanzo fabric up.</p>
            <div className="nd-acts">
              <A to={DOCS} className="lx-cta" data-thumb="Run a Node" data-cta="node.hero" data-cursor="">Run a Node<Arr /></A>
              <A to="https://github.com/hanzoai" className="lx-text" data-cursor="">View Source</A>
            </div>
          </div>
        </div>
      </section>

      <section className="lx-sec nd-why">
        <div className="lx-wrap">
          <LineMask as="h2" className="lx-headline nd-why-h" lines={['Why Run a Hanzo Node']} inView />
          <div className="nd-spec">
            <SpecDrawer rows={[['1', 'Rust binary'], ['3', 'commands, no orchestration'], ['5', 'levels of the work'], ['1/10', 'of the block reward, for AI compute']].map(([v, l], i) => ({ v: <Roll v={v} i={i} />, l }))} />
            <LevelsSheet />
          </div>
        </div>
      </section>

      <PinnedChapters className="nd-pin" label="Why Run a Hanzo Node" steps={steps} per={48} objH={36} visual={(at) => <Term step={at} drive={drive} onAuto={onAuto} />} />
      <Stack drive={drive} setDrive={byHand} onAuto={onAuto} />

      <ClipWipe className="nd-put">
        <div className="lx-wrap nd-put-grid">
          <div className="nd-put-l">
            <h2 className="lx-headline">Put a machine on the fabric</h2>
            <p className="lx-lede">Install the CLI, pick a network, run hanzo fabric up. The node binary is resolved from your PATH or an env var — the CLI runs it and never builds it for you.</p>
            <div className="nd-acts">
              <A to={DOCS} className="lx-ghost">Quickstart<Arr /></A>
              <A to="/network" className="lx-text" data-morph data-cursor="">About the Network</A>
              <A to="https://github.com/hanzoai" className="lx-text">View on GitHub</A>
            </div>
          </div>
          <div className="nd-put-r">
            <Paste name="Node" prompt="Read https://hanzo.ai/skill.md and use Hanzo Node in my project. Start with: hanzo node list" className="lx-paste" />
            <div className="nd-docs"><span className="lx-kick">Node</span><A to={DOCS} className="nd-docs-a">Node docs <span className="nd-docs-arr">→</span></A></div>
          </div>
        </div>
      </ClipWipe>

      <LaunchClose name="Node" tag="Standalone Hanzo node" seed="node" data={[5, 3, 10]} ask={['Run a Node', DOCS]} cta="node.close" self={DOCS} />
    </main>
  );
}
