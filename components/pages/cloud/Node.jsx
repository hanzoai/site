'use client';
/* Node, Cloud 3 launch page, round 3 to docs/MASTER.md (the only brief).
   V2: 8/10 Round 5 (review 7/10): one machine from hero to chapter six. The hero machine is now one flat surface with one
   big changing readout (the level of the work being served, cut in by line mask on each job), a five-bar ladder, and
   the hardware and Lux as one quiet line each (7 labels, the lit bar the one ink block); it no longer pops at hydration
   (no SettleStage: scale 1 in server HTML, JS off and reduced motion, all of which show the final serving frame). The
   structural move: that same machine pins on the left while the words scroll on the right and it becomes the chapter
   stage, each chapter's one key thing set at size inside it (the hardware at 44px, the level bars, the lit answer, declared
   struck and attested ringed at 64px, the drive verb's effect, the Merkle chain); it grows 4% while it is the stage and
   settles back as it leaves. The h1 is visible from first paint (its cut starts 44% in, never a hole). The four derived
   figures are gone: "A tenth" is the one big statement and opens the levels sheet. Every visible word is Hanzo's
   verbatim (no invented status words, no drawn hashes). The chapter count rolls like an odometer; the ask's arrow nudges.
   Persona: Developer with a machine to lend (a compute provider).
   Goal: run a node.
   CTA: "Run a Node" → https://docs.hanzo.ai/docs/proof-of-ai/node-operator (data-cta node.hero, node.close; the site's
   sticky ask carries the same label from data-thumb).
   Metric: api_key_created.
   Signature: one machine, up. hanzo fabric up starts the node; it joins the fabric, serves models, and each job lights its
   level on the five-level ladder that scales a provider's share, and the work settles on Lux. It keeps serving by itself
   while seen (about seven seconds) and rests; play in its toolbar replays the whole run from hanzo fabric up. Point at a
   level and the node takes a job of that level. Scroll and the same machine becomes the stage of the six chapters.
   Beyond: drive it. In chapter five press up, join or stop: the node starts on the active network, switches and starts,
   or stops by its recorded pid while the other process that happens to share the name keeps running.
   Motion (1 signature + 3): idle = the machine's own run (the one continuous mover, pausable); pointer = the machine
   tilting toward a fine pointer (2.5° at most, eased 300ms), a level you point at taking a job, the magnetic close;
   time = each chapter's scripted beat inside the machine (one frame scheduler, plays once, rests on a blinking prompt;
   the toolbar replays it); state = the drive control, the levels sheet rising, the chapter odometer, the Copy confirm;
   arrival = the cut-in title, the readout's line mask, the timed wipe into the quiet room; scroll (under half) = the
   machine pinning and growing while it is the chapter stage (stacked under 900px). */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../../kit';
import { Paste, useLive, useFrame } from './Frame';
import ClipWipe from '../../v2/ClipWipe';
import { Sheet } from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import './Node.css';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const DOCS = 'https://docs.hanzo.ai/docs/proof-of-ai/node-operator';
const LEVELS = ['embeddings and small models', 'chat-sized models', 'large and multimodal', 'training', 'specialized compute like proofs'];
const HW = ['Consumer cards', 'datacenter accelerators', 'Apple Silicon'];
const JOBS = [1, 0, 2, 4];
const END = 3 + JOBS.length * 2 - 1; // up, joins, peer-to-peer, then four jobs lit and settled; it then rests
const SLOTS = 8;
const pad = (n) => String(n).padStart(2, '0');
// the machine's status line is Hanzo's lede, verbatim, a phrase at a time
const phase = (t) => (t === 0 ? '' : t === 1 ? 'joins the fabric' : t === 2 ? 'over a peer-to-peer transport' : 'serves models');

const WHY = [
  ['The hardware you already have', 'Consumer cards, datacenter accelerators, or Apple Silicon. The node reports what it can serve and the cluster routes to it on that basis.'],
  ['Paid out of the block reward', "A tenth of the block reward is set aside for AI compute. A provider's share is scaled by the level of the work — embeddings and small models, chat-sized models, large and multimodal, training, or specialized compute like proofs."],
  ['The cluster knows who has what', 'Ask it for models and it lists everything served across the peers your node can see. Ask it to route and it names who would answer; ask for placement and it says where a model nobody serves should be loaded.'],
  ['Attested, then trusted', "A node's confidential-compute tier is attested rather than declared, and its share is scaled by that tier and by a trust score. Claiming a capability is not the same as proving one."],
  ['Three commands, no orchestration', 'up starts it on the active network, join switches network and starts it, stop signals the process this CLI started by its recorded pid — and never anything else that happens to share the name.'],
  ['Settled on Lux', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, so what a node did is anchored where it cannot quietly be rewritten later.'],
];
// every string the machine shows in the chapters is lifted verbatim from the chapter it stages
const ASK = [['models', 'everything served across the peers your node can see'], ['route', 'names who would answer'], ['placement', 'where a model nobody serves should be loaded']];
const DRIVE = { up: 'up starts it on the active network', join: 'join switches network and starts it', stop: 'stop signals the process this CLI started by its recorded pid' };

/* each chapter's beat: when a chapter is on the machine (and the machine is seen), its parts play out once over BEAT
   seconds on the page's one frame scheduler (Frame's useFrame), then rest. Server HTML, JS off and reduced motion all
   hold the final frame (b = BEAT); after mount it is armed at 0 until seen. Returns [b, replay, finish]. */
const BEAT = 2.8;
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
function useBeat(key, run, calm) {
  const [b, setB] = useState(BEAT);
  const [n, setN] = useState(0);
  const t0 = useRef(0);
  useIso(() => {
    if (calm) { setB(BEAT); return; }
    if (!run) { setB(0); return; }
    t0.current = performance.now();
    setB(0);
  }, [key, run, calm, n]);
  useFrame(run && !calm && b < BEAT, () => {
    const v = Math.min(BEAT, (performance.now() - t0.current) / 1000);
    const q = v >= BEAT ? BEAT : Math.floor(v * 30) / 30;
    setB((o) => (o >= BEAT || o === q ? o : q));
  });
  return [b, useCallback(() => setN((x) => x + 1), []), useCallback(() => setB(BEAT), [])];
}
const autoVerb = (b) => (b < 0.3 || b >= BEAT ? null : b < 1.1 ? 'up' : b < 2 ? 'join' : 'stop');

/* a string keyed in a character at a time from at, at 50ms a character; the rest of it holds its room unseen */
function Keyed({ text, b, at }) {
  const n = b >= BEAT ? text.length : Math.max(0, Math.min(text.length, Math.floor((b - at) / 0.05)));
  return <>{text.slice(0, n)}<span className="nd-ghost">{text.slice(n)}</span></>;
}

/* the chapter count rolls like an odometer when the stage moves to the next chapter (Hanzo's own "01 / 06" captions) */
function Odo({ v }) {
  return (
    <span className="nd-odo">
      <span className="x-sr">{v}</span>
      <span className="nd-odo-v" aria-hidden="true">
        {[...v].map((c, j) => (/\d/.test(c)
          ? <span key={j} className="nd-col"><span style={{ transform: `translateY(${-c * 1.2}em)` }}>{[...'0123456789'].map((d) => <span key={d}>{d}</span>)}</span></span>
          : <span key={j}>{c === ' ' ? ' ' : c}</span>))}
      </span>
    </span>
  );
}

/* the machine's one shell: toolbar (pause first, LED, name, status or count), the command, then one readout */
function Shell({ el, state, pauseEl, right, cmd, caret, children, className = '' }) {
  return (
    <div className={'nd-mac ' + className} ref={el} data-status={state}>
      <div className="nd-mac-top">
        {pauseEl}
        <span className="nd-led" aria-hidden="true" />
        <span className="nd-mac-n">hanzod</span>
        <span className="nd-mac-r">{right}</span>
      </div>
      <p className="nd-cmd"><span>$</span><span>{cmd}</span><i className={'nd-caret' + (caret ? ' on' : '')} aria-hidden="true" /></p>
      {children}
    </div>
  );
}

/* one chapter, staged at size inside the machine: one key thing big, the rest small */
function Read({ step, drive, b }) {
  const R = (at, c = '') => (c ? c + ' ' : '') + 'nd-b' + (b >= at ? ' in' : '');
  if (step === 0) return (
    <div className="nd-read" data-step={0}>
      <p className="nd-cap">reports what it can serve</p>
      <ul className="nd-r0">{HW.map((h, i) => <li key={h} className={R(0.9 + i * 0.35)}>{h}</li>)}</ul>
      <p className={R(2.1, 'nd-quiet')}>the cluster routes to it <em>on that basis</em></p>
    </div>
  );
  if (step === 1) return (
    <div className="nd-read" data-step={1}>
      <p className="nd-cap">A provider&apos;s share is scaled by the level of the work</p>
      <ol className="nd-r1">{LEVELS.map((l, i) => {
        const f = ease((b - 0.3 - i * 0.3) / 0.7);
        return <li key={l} className={f > 0 ? 'on' : ''}><span>{l}</span><i><b style={{ transform: `scaleX(${((0.2 + i * 0.2) * f).toFixed(3)})` }} /></i></li>;
      })}</ol>
    </div>
  );
  if (step === 2) {
    const lit = b >= BEAT ? 2 : b < 0.3 ? -1 : Math.min(2, Math.floor((b - 0.3) / 0.8));
    return (
      <div className="nd-read" data-step={2}>
        <ul className="nd-r2">{ASK.map(([c, s], i) => <li key={c} className={R(0.3 + i * 0.8) + (lit === i ? ' lit' : '')}><code>{c}</code><span>{s}</span></li>)}</ul>
      </div>
    );
  }
  if (step === 3) return (
    <div className="nd-read" data-step={3}>
      <ul className="nd-r3">
        <li className={R(0.2, 'no') + (b >= 0.9 ? ' struck' : '')}>declared</li>
        <li className={R(1.2, 'yes') + (b >= 1.5 ? ' ring' : '')}>attested</li>
      </ul>
      <p className={R(2.1, 'nd-quiet')}>Claiming a capability is not the same as proving one.</p>
    </div>
  );
  if (step === 4) return (
    <div className="nd-read" data-step={4}>
      <p className="nd-r4" key={drive}>{DRIVE[drive]}</p>
      <ul className="nd-r4-ps">
        <li className={drive === 'stop' ? 'off' : 'run'}><i /><code>hanzod</code></li>
        <li className="run"><i /><code>hanzod</code><span>never anything else that happens to share the name</span></li>
      </ul>
    </div>
  );
  return (
    <div className="nd-read" data-step={5}>
      <p className="nd-cap">ordered on the Hanzo L2</p>
      <ol className="nd-r5" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <li key={i} className={R(0.3 + i * 0.3)} />)}</ol>
      <p className={R(2.2, 'nd-r5-t')}>committed to Lux as a Merkle root</p>
    </div>
  );
}
const chapterCmd = (step, drive, b) => (step === 4 ? 'hanzo fabric ' + drive : step === 0 ? <Keyed text="hanzo fabric up" b={b} at={0.1} /> : 'hanzo fabric up');
const chapterState = (step, drive) => (step === 4 && drive === 'stop' ? 'off' : 'on');

/* ---------- the object: one machine, from the hero to chapter six ---------- */
function Machine({ step, drive, onAuto }) {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, setT] = useState(END); // server, JS off, reduced motion: the final serving frame
  const [base, setBase] = useState(0); // roots already settled when the run picks up from that frame
  const [pick, setPick] = useState(-1); // a level the pointer has routed a job to
  const [extra, setExtra] = useState(0);
  const [armed, setArmed] = useState(false);
  const [back, setBack] = useState(false); // the hero readout has been left once (it restages when you return)
  const hero = step < 0;
  useEffect(() => { if (!hero) setBack(true); }, [hero]);
  // first time it is seen after mount, the node keeps serving from the frame you already see (no reset to stopped)
  useEffect(() => { if (live && !armed) { setArmed(true); setBase(4); setT(3); } }, [live, armed]);
  useEffect(() => {
    if (calm || !armed || !live || paused || pick >= 0 || !hero || t >= END) return; // MASTER §4.1: runs, then rests
    const id = setTimeout(() => setT((v) => v + 1), t === 0 ? 900 : t < 3 ? 1000 : 950);
    return () => clearTimeout(id);
  }, [t, live, calm, paused, pick, hero, armed]);
  const [b, replay, finish] = useBeat(step, live && !hero, calm);
  const auto = step === 4 ? autoVerb(b) : null;
  useEffect(() => { if (auto && onAuto) onAuto(auto); }, [auto, onAuto]);

  const toggle = () => { if (t >= END) { setT(0); setBase(0); setExtra(0); setArmed(true); if (paused) pause(); } else pause(); };
  const route = (i) => { setPick(i); setExtra((x) => x + 1); if (t < 3) setT(3); };
  const job = pick >= 0 ? pick : t >= 3 && t < END && (t - 3) % 2 === 0 ? JOBS[Math.floor((t - 3) / 2) % JOBS.length] : -1;
  const [last, setLast] = useState(JOBS[JOBS.length - 1]);
  useEffect(() => { if (job >= 0) setLast(job); }, [job]);
  const lv = job >= 0 ? job : last;
  const roots = base + (t >= 4 ? Math.floor((t - 2) / 2) : 0) + extra;
  const shown = Math.min(roots, SLOTS);
  const hwOn = t >= 2 ? Math.floor(t / 2) % 3 : -1;

  if (!hero) return (
    <Shell el={ref} state={chapterState(step, drive)} cmd={chapterCmd(step, drive, b)} caret={b >= BEAT}
      pauseEl={<LivePause paused={b >= BEAT} onToggle={b >= BEAT ? replay : finish} inline className="nd-pause" />}
      right={<Odo v={pad(step + 1) + ' / ' + pad(WHY.length)} />}>
      <Read key={step} step={step} drive={drive} b={b} />
    </Shell>
  );
  return (
    <Shell el={ref} state={t === 0 ? 'off' : t < 3 ? 'join' : 'on'} cmd="hanzo fabric up" caret={t === 0 || t >= END}
      pauseEl={<LivePause paused={paused || t >= END} onToggle={toggle} inline className="nd-pause" />}
      right={<span aria-live="polite">{phase(t)}</span>}>
      <div className="nd-read nd-read-h" data-back={back || undefined}>
        <p className="nd-cap" id="nd-lv-k">the level of the work</p>
        <p className="nd-big"><span className="nd-big-m"><span key={lv} className={'nd-big-in' + (armed && !calm ? ' cut' : '')}>{LEVELS[lv]}</span></span></p>
        <ol className="nd-ladder" aria-labelledby="nd-lv-k" onPointerLeave={() => setPick(-1)}>
          {LEVELS.map((l, i) => (
            <li key={l}>
              <button type="button" className={lv === i && t >= 3 ? 'on' : ''} aria-pressed={pick === i} aria-label={l} style={{ '--s': 0.2 + i * 0.2 }} data-cursor=""
                onPointerEnter={(e) => e.pointerType === 'mouse' && pick !== i && route(i)} onBlur={() => setPick(-1)} onClick={() => route(i)}>
                <i><b /></i>
              </button>
            </li>
          ))}
        </ol>
        <div className="nd-foot">
          <p className="nd-quiet nd-hw">{HW.map((h, i) => <span key={h} className={i === hwOn ? 'on' : ''}>{h}</span>)}</p>
          <div className="nd-quiet nd-lux">
            <span>Settled on Lux</span>
            <ol className="nd-chain" aria-hidden="true">
              {Array.from({ length: SLOTS }).map((_, i) => {
                if (i >= shown) return <li key={'e' + i} />;
                const n = roots - shown + i;
                return <li key={n} className={i === shown - 1 ? 'new' : 'set'} />;
              })}
            </ol>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* phones (under 900px, MASTER part 11): no pin; each chapter carries its own small machine at true height, playing its
   beat once as it comes into view. Desktop hides these: the one pinned machine stages every chapter there. */
function ChapterMac({ step, drive, onAuto }) {
  const [ref, live, calm] = useLive(0.3);
  const [b, replay, finish] = useBeat(step, live, calm);
  const auto = step === 4 ? autoVerb(b) : null;
  useEffect(() => { if (auto && onAuto) onAuto(auto); }, [auto, onAuto]);
  return (
    <Shell el={ref} className="nd-mac-s" state={chapterState(step, drive)} cmd={chapterCmd(step, drive, b)} caret={b >= BEAT}
      pauseEl={<LivePause paused={b >= BEAT} onToggle={b >= BEAT ? replay : finish} inline className="nd-pause" />}
      right={pad(step + 1) + ' / ' + pad(WHY.length)}>
      <Read step={step} drive={drive} b={b} />
    </Shell>
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

/* the stage grows 4% while it is the chapters' stage and settles back as you leave (scale 1 at the top of the page,
   so the server frame and the hydrated frame are the same; none under reduced motion or on phones) */
function Grow({ target, children }) {
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  // the style is always the same motion value (so the server and the first client frame match); reduced motion holds it at 1
  const scale = useTransform(scrollYProgress, [0, 0.16, 0.9, 1], calm ? [1, 1, 1, 1] : [1, 1.04, 1.04, 1]);
  return <motion.div className="nd-grow" style={{ scale }}>{children}</motion.div>;
}

/* "A tenth of the block reward": the one big statement; it opens the kit's sheet with the five levels it is shared by.
   The sheet mounts only while it is up, so the site's sticky ask never reads a closed sheet as an open overlay. */
function Tenth() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const show = () => { setMounted(true); setTimeout(() => setOpen(true), 30); };
  const hide = useCallback(() => { setOpen(false); setTimeout(() => setMounted(false), 500); }, []);
  return (
    <>
      <button type="button" className="nd-tenth" aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <LineMask as="span" className="nd-tenth-v" lines={['A tenth']} inView />
        <LineMask as="span" className="nd-tenth-l" lines={['of the block reward is set aside for AI compute.']} inView delay={0.12} />
        <span className="nd-tenth-p" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
      </button>
      {mounted && (
        <Sheet open={open} onClose={hide} title="Paid out of the block reward">
          <ol className="nd-sheet">{LEVELS.map((l, i) => <li key={l} style={{ '--i': i }}><b>{l}</b><i><em style={{ transform: `scaleX(${0.2 + i * 0.2})` }} /></i></li>)}</ol>
        </Sheet>
      )}
    </>
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

/* the h1 cut in by line mask (MASTER part 3: 700ms, ease-emphasis, 60ms apart), pure CSS from the server HTML, so it
   needs no hydration; it starts 44% into its mask, so the words are readable on the very first frame (never a hole). */
function Title() {
  return (
    <h1 className="lx-display nd-h1">
      <span className="lx-line"><span>Hanzo</span></span>
      <span className="lx-line"><span>Node</span></span>
    </h1>
  );
}

export default function Node() {
  const [drive, setDrive] = useState('up');
  const [at, setAt] = useState(-1);
  const [wide, setWide] = useState(false);
  const run = useRef(null);
  const mine = useRef(false); // once the visitor drives it, the beat never takes the wheel again
  const byHand = useCallback((c) => { mine.current = true; setDrive(c); }, []);
  const onAuto = useCallback((c) => { if (!mine.current) setDrive(c); }, []);
  useEffect(() => {
    const m = matchMedia('(min-width: 900px)');
    const f = () => setWide(m.matches);
    f(); m.addEventListener('change', f);
    const els = run.current ? [...run.current.querySelectorAll('[data-at]')] : [];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.at); }), { rootMargin: '-46% 0px -53% 0px' });
    els.forEach((el) => io.observe(el));
    return () => { m.removeEventListener('change', f); io.disconnect(); };
  }, []);
  const jump = (i) => {
    const el = run.current?.querySelector(`[data-at="${i}"]`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.4;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.2, easing: (x) => 1 - Math.pow(1 - x, 4) }) : window.scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const step = wide ? at : -1;
  return (
    <main className="lx nd">
      <section ref={run} className="nd-run" data-morph-target data-ask-name="Hanzo Node">
        <div className="lx-wrap nd-run-grid">
          <div className="nd-run-obj">
            <div className="nd-run-stick">
              <Lean><Grow target={run}><Machine step={step} drive={drive} onAuto={onAuto} /></Grow></Lean>
              <nav className="nd-rail" aria-label="Why Run a Hanzo Node">
                {WHY.map(([t], i) => (
                  <button key={t} type="button" aria-current={step === i ? 'step' : undefined} aria-label={`${pad(i + 1)}: ${t}`} onClick={() => jump(i)}><i /></button>
                ))}
              </nav>
            </div>
          </div>
          <div className="nd-run-copy">
            <div className="nd-hero-copy" data-at="-1">
              <Title />
              <p className="lx-title nd-sub">Decentralized AI Compute</p>
              <p className="lx-lede nd-lede">hanzod is the node that runs hanzo.network. It joins the fabric over a peer-to-peer transport, serves models to whatever the cluster routes to it, and settles the work on Lux. One Rust binary, started with hanzo fabric up.</p>
              <div className="nd-acts">
                <A to={DOCS} className="lx-cta" data-thumb="Run a Node" data-cta="node.hero" data-cursor="">Run a Node<Arr /></A>
                <A to="https://github.com/hanzoai" className="lx-text" data-cursor="">View Source</A>
              </div>
            </div>
            <div className="nd-why" data-at="-1">
              <LineMask as="h2" className="lx-headline nd-why-h" lines={['Why Run a Hanzo Node']} inView />
              <Tenth />
              <LineMask as="p" className="nd-why-m" lines={['One Rust binary, started with hanzo fabric up.']} inView delay={0.24} />
            </div>
            <ol className="nd-ch">
              {WHY.map(([t, d], i) => (
                <li key={t} data-at={i} data-on={step === i || undefined}>
                  <h3 className="nd-ch-t">{t}</h3>
                  <p className="lx-kick nd-ch-k">{pad(i + 1)} / {pad(WHY.length)}</p>
                  <p className="nd-ch-d">{d}</p>
                  {i === 4 && <Drive drive={drive} setDrive={byHand} />}
                  <div className="nd-ch-mac"><ChapterMac step={i} drive={drive} onAuto={onAuto} /></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

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
