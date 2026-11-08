'use client';
/* Studio.
   V2: 8/10 white holes closed (47-131px between sections, the reel pulled up under the card), changeovers cut instead of blending (out in 150 ms, titles in by line mask), reel 240svh with bigger subject-framed moves and a frame that grows .92 to 1, phone reel a sticky 2.39:1 frame that swaps per pillar, phone h1 36px in 3 lines with the monitor at 413px, one solid plus one text link at the close.
   Persona: a director or a VFX team. Goal: launch Studio. CTA: Launch studio.hanzo.ai (studio.hero).
   Metric: cta_click on studio.hero and studio.close (data-cta; the event layer is the conductor's).
   Signature: the camera moves with your scroll. After the cutting room, a 2.39:1 frame pins on a white stage; each
   stretch of scroll performs one of Hanzo's camera moves on a still (Dolly In, Crane Rise, 360° Orbit) while the
   pillar it belongs to comes in as a subtitle. The hero is the product itself: a monitor and a multi-track timeline
   that play by themselves, every camera move running on a real still, the playhead yours the moment you grab it.
   The six creative models sit on a film strip; each frame opens into its model page (the WebGL opener).
   Beyond: "Studio or Design?": say what you are making and Hanzo's own sentence on each sends you to /design or
   studio.hanzo.ai. No accent: deck greys only; the tally light is silver (#d4d4d4). Every word, figure and link is Hanzo's; the pairing of stills
   to camera moves is a demo, not a claim. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { A, Cta, Go, More } from '../kit';
import { scrollToEl } from '../../lib/scroll';
import { useOpener } from '../Opener';
import A2Lines from './skills/Lines'; // page-local A2Lines: no reduced-motion hydration mismatch (docs/requests/skills.md)
import A2Paste from '../v2/A2Paste';
import '../v2/A2.css';
import './Studio.css';

const NAME = { iro: 'Iro', koma: 'Koma', mori: 'Mori', oto: 'Oto', koe: 'Koe', uta: 'Uta' };
// five shots, one per camera move; the stills are the models' own pictures, titled from Hanzo's library
const SHOTS = [
  { rig: 'Dolly In', img: 'koma', title: 'The drift', actor: 'KAI-01' },
  { rig: 'Crane Rise', img: 'iro', title: 'Friday street', actor: 'KAI-01' },
  { rig: 'Vertigo Zolly', img: 'mori', title: 'Paper lantern', actor: 'SORA-02' },
  { rig: 'Crash Zoom', img: 'oto', title: 'Tin roof', actor: 'KAI-01' },
  { rig: '360° Orbit', img: 'koe', title: 'The shop sign', actor: 'SORA-02' },
];
const SHOT = 4; // seconds a shot
const LEN = SHOTS.length * SHOT;
// each move as a transform of the still, p = 0..1 through the shot
const MOVE = [
  (p) => `scale(${1.04 + 0.18 * p})`,
  (p) => `translate3d(0, ${7 - 14 * p}%, 0) scale(1.18)`,
  (p) => `scale(${1.34 - 0.3 * p})`,
  (p) => `scale(${p < 0.62 ? 1.04 + 0.05 * p : 1.07 + 0.75 * Math.pow((p - 0.62) / 0.38, 2.4)})`,
  (p) => `translate3d(${8 - 16 * p}%, 0, 0) scale(1.22) rotate(${-1.6 + 3.2 * p}deg)`,
];
const TRACKS = [['Koma', 'video'], ['Oto', 'foley'], ['Koe', 'voice'], ['Uta', 'score']];
const MODELS = ['Iro', 'Koma', 'Mori', 'Oto', 'Koe', 'Uta'];
const LIB = [
  ['koe', 'Slower sign', 4], ['koe', 'The shop sign', 4], ['oto', 'Tin roof', 3],
  ['mori', 'Paper lantern', 2], ['koma', 'The drift', 0], ['iro', 'Friday street', 1],
];
const SPECS = [
  '12 cinema camera trajectories: Dolly, Crane, Vertigo Zolly, Crash Zoom, FPV Drone, 360° Orbit & SnorriCam',
  'Character & world continuity lock across every shot — face seed, wardrobe, lighting & Koe voice print',
  'Multi-shot NLE timeline sequencer with frame-chained Koma 2.0 video, Oto foley, Uta score & Node Graph pipeline',
];
const pad = (n) => String(n).padStart(2, '0');
// bring one item of a horizontal rail to its centre by scrolling the rail itself (never the page)
const follow = (rail, el, smooth) => {
  if (!rail || !el || rail.scrollWidth <= rail.clientWidth + 1) return;
  const r = rail.getBoundingClientRect(), b = el.getBoundingClientRect();
  rail.scrollTo({ left: rail.scrollLeft + (b.left + b.width / 2) - (r.left + r.width / 2), behavior: smooth ? 'smooth' : 'auto' });
};
const wave = (k, n) => Array.from({ length: n }, (_, i) => 22 + ((i * 37 + k * 23) % 61)); // a fixed waveform per clip

function Cinema() {
  const box = useRef(null);
  const live = useInView(box, { amount: 0.2 });
  const calm = useReducedMotion();
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [grabbed, setGrabbed] = useState(false);
  const [model, setModel] = useState(1);
  const t = useRef(0), cur = useRef(0), sec = useRef(-1), drag = useRef(false);
  const imgs = useRef([]), lanes = useRef(null), ph = useRef(null), tc = useRef(null), bar = useRef(null), ret = useRef(null);
  const lib = useRef(null), inLib = useRef(false);
  useEffect(() => { // the library rail follows the shot on the monitor (left alone while the pointer is in it)
    if (inLib.current) return;
    follow(lib.current, lib.current?.querySelector('[aria-pressed="true"]')?.parentElement, !calm);
  }, [shot, calm]);

  // one frame of the film, written straight to the elements (no React render per frame)
  const paint = () => {
    const T = Math.max(0, t.current), k = Math.min(SHOTS.length - 1, Math.floor(T / SHOT)), p = (T - k * SHOT) / SHOT;
    const el = imgs.current[k];
    if (el) el.style.transform = MOVE[k](p);
    if (ret.current) ret.current.style.transform = k === 2 ? `scale(${0.82 + 0.3 * p})` : 'scale(1)'; // the zolly's subject holds while the world stretches
    if (ph.current) ph.current.style.transform = `translate3d(${(T / LEN) * 100}%, 0, 0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (lanes.current && Math.floor(T) !== sec.current) { sec.current = Math.floor(T); lanes.current.setAttribute('aria-valuenow', sec.current); lanes.current.setAttribute('aria-valuetext', `${sec.current} seconds, shot ${k + 1}, ${SHOTS[k].rig}`); }
    if (k !== cur.current) { cur.current = k; setShot(k); }
  };
  useLayoutEffect(() => { if (calm) { t.current = SHOT * 0.6; setPlaying(false); } paint(); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useLayoutEffect(paint, [shot]); // the newly active tab's progress bar picks up where the film is
  // the first frame's dt can come out negative (rAF stamps the frame before the loop started), so it is floored at 0
  useEffect(() => { // the film runs on one animation-frame loop while it is on screen
    if (!live || !playing) return;
    let raf = 0, last = performance.now();
    const loop = (now) => { const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t.current = (t.current + dt) % LEN; paint(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (k) => { t.current = k * SHOT + (calm ? SHOT * 0.6 : 0.001); paint(); if (!calm) setPlaying(true); };
  const seek = (e) => { const r = lanes.current.getBoundingClientRect(); t.current = Math.min(0.9999, Math.max(0, (e.clientX - r.left) / r.width)) * LEN; paint(); };
  const grab = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); drag.current = true; setPlaying(false); setGrabbed(true); seek(e); };
  const key = (e) => {
    const d = { ArrowRight: 0.5, ArrowLeft: -0.5, PageUp: SHOT, PageDown: -SHOT }[e.key];
    if (d === undefined && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    t.current = e.key === 'Home' ? 0 : e.key === 'End' ? LEN - 0.01 : Math.min(LEN - 0.01, Math.max(0, t.current + d));
    setPlaying(false); setGrabbed(true); paint();
  };
  const s = SHOTS[shot];

  return (
    <div className="xst-desk" id="xst-cinema" ref={box}>
      <div className="xst-mon">
        <div className="xst-view">
          {SHOTS.map((x, i) => (
            <img key={x.title} ref={(el) => { imgs.current[i] = el; }} src={`/models/${x.img}.webp`} alt={i === shot ? `${x.title}, made with ${NAME[x.img]}` : ''} className={i === shot ? 'on' : ''} draggable="false" />
          ))}
          <span className="xst-ret" ref={ret} aria-hidden="true"><i /><i /><i /><i /></span>
          <div className="xst-hud tl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={s.rig} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{s.rig}</motion.b>
            </AnimatePresence>
            <span>Shot {pad(shot + 1)} · {s.title}</span>
          </div>
          <div className="xst-hud tr x-mono"><i className="xst-rec" aria-hidden="true" />REC</div>
          <div className="xst-hud bl x-mono">35mm Anamorphic 2.39:1 · f/1.4</div>
          <div className="xst-hud br x-mono">Actor Lock: {s.actor}</div>
        </div>
        <div className="xst-tr">
          <button type="button" className="xst-play" aria-pressed={playing} onClick={() => { if (!calm) { setPlaying(!playing); setGrabbed(false); } }}>
            {playing ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor" /></svg>}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          <span className="xst-tr-hint">{grabbed ? 'Playhead is yours: press Play to roll again' : 'Drag the playhead to scrub'}</span>
        </div>
        <div className="xst-tl">
          <div className="xst-tl-k" aria-hidden="true">
            <span />
            {TRACKS.map(([m, k]) => <span key={m} className={MODELS[model] === m ? 'on' : ''}><b>{m}</b><i>{k}</i></span>)}
          </div>
          <div
            className="xst-lanes" ref={lanes} role="slider" tabIndex={0} aria-label="Playhead" aria-valuemin={0} aria-valuemax={LEN} aria-valuenow={0}
            data-cursor="Scrub" data-swipe-own=""
            onPointerDown={grab} onPointerMove={(e) => drag.current && seek(e)} onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }} onKeyDown={key}
          >
            <div className="xst-ruler" aria-hidden="true">{Array.from({ length: SHOTS.length }, (_, i) => <span key={i}>00:{pad(i * SHOT)}</span>)}</div>
            <div className={'xst-track v' + (MODELS[model] === 'Koma' ? ' on' : '')}>
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip' + (i === shot ? ' now' : '')} style={{ backgroundImage: `url(/models/${x.img}.webp)` }}><em>{x.rig}</em><b className="xst-tc x-mono" aria-hidden="true">00:{pad(i * SHOT)}–00:{pad((i + 1) * SHOT)}</b></span>)}
            </div>
            <div className={'xst-track a' + (MODELS[model] === 'Oto' ? ' on' : '')}>
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip w' + (i === shot ? ' now' : '')}>{wave(i, 16).map((h, j) => <i key={j} style={{ transform: `scaleY(${h / 100})` }} />)}</span>)}
            </div>
            <div className={'xst-track k' + (MODELS[model] === 'Koe' ? ' on' : '')}>
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip' + (i % 2 ? ' gap' : i === shot ? ' now' : '')}>{i % 2 ? null : wave(i + 7, 10).map((h, j) => <i key={j} style={{ transform: `scaleY(${h / 100})` }} />)}</span>)}
            </div>
            <div className={'xst-track u' + (MODELS[model] === 'Uta' ? ' on' : '')}>
              <span className="xst-clip score">{wave(3, 48).map((h, j) => <i key={j} style={{ transform: `scaleY(${h / 120})` }} />)}</span>
            </div>
            <div className="xst-ph" ref={ph} aria-hidden="true"><i /></div>
          </div>
        </div>
      </div>

      <aside className="xst-insp" aria-label="Studio controls">
        <p className="xst-ik">CAMERA RIG</p>
        <div className="xst-rigs" role="tablist" aria-label="Camera rig">
          {SHOTS.map((x, i) => (
            <button key={x.rig} type="button" role="tab" aria-selected={i === shot} onClick={() => go(i)}>
              <span>{x.rig}</span>
              <i className="xst-rig-bar" aria-hidden="true"><b ref={i === shot ? bar : undefined} /></i>
            </button>
          ))}
        </div>
        <div className="xst-models" role="radiogroup" aria-label="Model">
          {MODELS.map((m, i) => <button key={m} type="button" role="radio" aria-checked={model === i} onClick={() => setModel(i)}>{m}</button>)}
        </div>
        <A to="https://studio.hanzo.ai" className="xst-prompt" data-cursor="Open">
          <span className="xst-pm x-mono">{MODELS[model]}</span>
          {/* as on live: the empty prompt, then Hanzo's example prompt types itself in, holds, and clears (CSS loop, words always in the page) */}
          <span className="xst-pa">Describe what to make</span>
          <span className="xst-pb">A lantern-lit street after rain, painted</span>
          <i className="xst-caret" aria-hidden="true" />
        </A>
        <p className="xst-ik">Library</p>
        {/* three tiles show, the rest wait in the rail with a peek; the rail follows the shot that is playing */}
        <ul className="xst-lib" ref={lib} onPointerEnter={() => { inLib.current = true; }} onPointerLeave={() => { inLib.current = false; }}>
          {LIB.map(([m, t, k]) => (
            <li key={t}>
              <button type="button" aria-pressed={shot === k && SHOTS[k].title === t} className={MODELS[model] === NAME[m] ? 'mine' : ''} onClick={() => go(k)}>
                <img src={`/models/${m}.webp`} alt={`${t}, made with ${NAME[m]}`} loading="lazy" />
                <span><b>{NAME[m]}</b><em><span>{t}</span></em></span>
              </button>
            </li>
          ))}
        </ul>
        <p className="xst-note">Hanzo Studio runs at studio.hanzo.ai on dedicated Hanzo Cloud GPUs.</p>
      </aside>
      {/* Hanzo's three specs, one compact line each, straight under the timeline: no band of their own */}
      <ul className="xst-specs">{SPECS.map((x, i) => <li key={x}><span className="x-mono">{pad(i + 1)}</span><span>{x}</span></li>)}</ul>
    </div>
  );
}

// "Open Studio" is Hanzo's own label for the page you are on, so it never reloads it: it takes you into the cutting
// room (the monitor) instead. The href stays /studio so the link survives with JavaScript off.
function jump(e) {
  const el = document.getElementById('xst-cinema');
  if (!el) return;
  e.preventDefault();
  scrollToEl(el, { offset: -84, duration: 0.9 }); // reduced motion jumps (lib/scroll)
  el.querySelector('.xst-lanes')?.focus({ preventScroll: true });
}

function Hero() {
  return (
    <section className="a2-dark xst-hero" data-room="dark" aria-labelledby="xst-h1">
      <div className="a2-wrap">
        <div className="a2-grid xst-top">
          <div className="xst-top-l">
            <p className="a2-kick xst-kick"><i aria-hidden="true" /><span>Hanzo Studio · AI Cinema & Production Engine</span></p>
            <A2Lines as="h1" id="xst-h1" className="a2-display xst-h1" lines={['Direct AI cinema', 'with precision camera rigs', '& multi-shot timelines']} now />
          </div>
          <div className="xst-top-r">
            <p className="a2-lede">Full production-quality AI film direction, camera motion control, character consistency lock, multi-shot storyboard sequencing, and node-graph VFX pipelines on cloud GPUs.</p>
            <div className="a2-acts">
              <Cta to="https://studio.hanzo.ai" id="studio.hero" thumb className="xst-ask">Launch studio.hanzo.ai</Cta>
              <Cta to="/studio" kind="link" className="xst-jump" onClick={jump}>Open Studio</Cta>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}>
          <Cinema />
        </motion.div>
      </div>
    </section>
  );
}

// Beyond: the two tools in Hanzo's own sentence, sorted by what you are making
const MAKE = [
  ['Everyday visuals', 0], ['Decks', 0], ['Docs', 0], ['Interactive apps', 0],
  ['AI film direction', 1], ['Camera rigs', 1], ['Multi-shot timelines', 1], ['Node-graph VFX', 1],
];

function Which() {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(4);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || mine || calm) return;
    const t = setInterval(() => setAt((v) => (v + 3) % MAKE.length), 2400); // hops between the two sides while you read
    return () => clearInterval(t);
  }, [live, mine, calm]);
  const side = MAKE[at][1];
  return (
    <div className="xst-which" ref={ref}>
      <p className="a2-kick show xst-which-k">Studio or Design?</p>
      <div className="xst-make" role="radiogroup" aria-label="What are you making?">
        {MAKE.map(([t, s], i) => <button key={t} type="button" role="radio" aria-checked={at === i} className={s ? 's' : 'd'} onClick={() => { setAt(i); setMine(true); }}>{t}</button>)}
      </div>
      <div className="xst-ans">
        {[
          ['Hanzo Design', 'builds everyday visuals, decks, docs, and interactive apps inside your workspace.', <Go key="d" to="/design">Open Hanzo Design</Go>],
          ['Hanzo Studio', 'is a full cinema production suite built for directors, filmmakers, and VFX teams.', <Go key="s" to="https://studio.hanzo.ai">Launch studio.hanzo.ai</Go>],
        ].map(([h, d, go], i) => (
          <div key={h} className={'xst-ans-c' + (side === i ? ' on' : '')} aria-hidden={side !== i} inert={side !== i}><b><span className="xst-m"><span>{h}</span></span></b><p>{d}</p>{go}</div>
        ))}
      </div>
    </div>
  );
}

function What() {
  return (
    <section className="a2-sec xst-what" aria-labelledby="xst-what-h">
      <div className="a2-wrap a2-grid">
        <div className="xst-what-copy">
          <p className="a2-kick">What is Hanzo Studio</p>
          <A2Lines id="xst-what-h" className="a2-headline" lines={['Production-grade AI film direction', 'and node-graph VFX']} />
          <p className="a2-body">Where Hanzo Design (/design) builds everyday visuals, decks, docs, and interactive apps inside your workspace, Hanzo Studio (studio.hanzo.ai) is a full cinema production suite built for directors, filmmakers, and VFX teams.</p>
        </div>
        <Which />
      </div>
    </section>
  );
}

/* The signature: a 2.39:1 frame pinned on a white stage; scroll performs one camera move per pillar. */
const PILLARS = [
  ['Cinema Camera & Lens Rig', 'Control physical 6-DoF camera trajectories (Dolly In/Out, Crane Rise, Vertigo Zolly, Crash Zoom, Whip Pan, 360° Orbit, Bullet-Time), 14mm–135mm prime & anamorphic 2.39:1 lenses, T-Stop aperture bokeh, and volumetric lighting.', 'koma', 0, 'Dolly In'],
  ['Character & World Consistency Lock', 'Lock Actor ID identity embeddings, wardrobe, reference stills, and Koe voice profiles so your cast and environment stay frame-accurate across every angle and cut.', 'iro', 1, 'Crane Rise'],
  ['Multi-Shot Timeline & Node Graph', 'Chain shots directly with last-frame conditioning (ConcatVideo), layer Oto foley and Uta musical scores on a multi-track timeline, or drop into the full Comfy-compatible Node Graph pipeline.', 'koe', 4, '360° Orbit'],
];
/* The reel's own moves, bigger than the monitor's so they read at scroll speed. The stills are portrait pictures with
   their subject right of centre on black, so each move is framed on its subject: the dolly scales about the right edge
   (the subject slides from the right third into the centre as it pushes in), the crane rises through the mountain,
   the orbit pans across the wave while the horizon tilts. p = 0..1 through the pillar. */
const REEL = [
  (p) => `scale(${1.25 + 0.45 * p})`,
  (p) => `translate3d(0, ${12 - 24 * p}%, 0) scale(1.32)`,
  (p) => `translate3d(${-4 - 23 * p}%, 0, 0) scale(1.62) rotate(${-2.5 + 5 * p}deg)`,
];
const NARROW = '(max-width: 899px)';

function Reel() {
  const ref = useRef(null);
  const imgs = useRef([]);
  const frame = useRef(null);
  const subs = useRef([]);
  const calm = useReducedMotion();
  const [on, setOn] = useState(0);
  const now = useRef(0), narrow = useRef(false);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // one frame of the reel, written straight to the still and the frame (no React render per frame)
  const paint = (v) => {
    const q = Math.min(0.9999, Math.max(0, v));
    // pinned (desktop): the scroll third picks the pillar. Stacked (phone): the caption under the sticky frame does.
    const k = narrow.current ? now.current : Math.floor(q * PILLARS.length);
    if (!narrow.current && k !== now.current) { now.current = k; setOn(k); }
    if (calm) return;
    const el = imgs.current[k];
    if (el) el.style.transform = REEL[k](Math.min(1, Math.max(0, q * PILLARS.length - k)));
    // the frame is the moment: it grows from .92 to full size over the first 15% of the pin, then holds
    if (frame.current) frame.current.style.transform = narrow.current ? 'none' : `scale(${0.92 + 0.08 * Math.min(1, q / 0.15)})`;
  };
  useMotionValueEvent(p, 'change', paint);
  useEffect(() => { // read after mount: the layout (pinned or stacked) and reduced motion
    const mq = matchMedia(NARROW);
    const set = () => { narrow.current = mq.matches; if (calm && frame.current) frame.current.style.transform = 'none'; paint(p.get()); };
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { // phone: the frame stays stuck under the header and swaps its still as each caption passes under it
    if (!narrow.current) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { const k = subs.current.indexOf(e.target); if (k >= 0 && k !== now.current) { now.current = k; setOn(k); paint(p.get()); } } });
    }, { rootMargin: '-30% 0px -60% 0px' });
    subs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="xst-reel" ref={ref} aria-label="Three pillars">
      <noscript><style>{'.xst-reel{height:auto!important;padding:96px 0}.xst-reel-stick{position:static!important;height:auto!important;display:block!important}.xst-subs{gap:36px}.xst-subs li{grid-area:auto!important;opacity:1!important;transform:none!important}.xst-m>span{transform:none!important}'}</style></noscript>
      <div className="xst-reel-stick">
        <div className="a2-wrap">
          <div className="xst-frame-pin">
            <div className="xst-frame" ref={frame}>
              {PILLARS.map(([t, , img], i) => <img key={t} ref={(el) => { imgs.current[i] = el; }} src={`/models/${img}.webp`} alt="" className={i === on ? 'on' : ''} style={{ transform: REEL[i](0.5) }} draggable="false" />)}
              <span className="xst-frame-rig x-mono" aria-hidden="true">{PILLARS[on][4]}</span>
              <span className="xst-frame-n x-mono" aria-hidden="true">{pad(on + 1)} / 03</span>
            </div>
          </div>
          <ol className="xst-subs">
            {PILLARS.map(([t, d], i) => (
              <li key={t} className={i === on ? 'on' : ''} ref={(el) => { subs.current[i] = el; }}>
                <span className="x-mono">{pad(i + 1)}</span>
                <h3 className="a2-title"><span className="xst-m"><span>{t}</span></span></h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const CAPS = [
  ['Koma 2.0 Camera Motion Control', 'Direct exact camera paths, focal lengths (14mm to 135mm Anamorphic), shutter angles, and depth-of-field rack focus before rendering.', 'Koma 2.0'],
  ['Persistent Actor & Set Vault', 'Upload character sheets or lock generated seeds once; reference @KAI-01 or @SORA-02 in any shot to preserve face, costume, and voice.', '@KAI-01'],
  ['Frame-Chained Storyboard Sequencer', 'Cut multi-shot scenes on a real timeline with automatic boundary frame matching, lip-sync dialogue, and OpenTimelineIO / MP4 master export.', 'OpenTimelineIO'],
  ['Visual Node-Graph Pipeline', 'Switch to the node-graph canvas at any time to wire custom checkpoints, ControlNets, relighting passes, and Python nodes.', 'ControlNets'],
  ['Synchronized Foley, Voice & Score', 'Every shot automatically pairs Koma video with Oto spatial foley, Koe multi-speaker lip-sync dialogue, and Uta stems.', 'Oto · Koe · Uta'],
  ['Dedicated Cloud GPU Render Farm', 'Queue 4K anamorphic multi-shot renders across distributed Hanzo Cloud GPUs with organization-wide asset libraries and IAM access control.', '4K'],
];

/* The capabilities as one node graph a render pass walks through: six small nodes wired on one canvas, and the node
   the pass is on opens its sentence in the one pane beside it (one in, one out). Positions are % of the canvas. */
const NODE = [[0, 22], [0, 72], [26, 47], [52, 20], [52, 74], [78, 47]];
const WIRE = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]];
const NW = 22; // node width, % of the canvas
const wire = ([a, b]) => {
  const [x1, y1] = [NODE[a][0] + NW, NODE[a][1]], [x2, y2] = NODE[b];
  return `M${x1} ${y1} C${x1 + 2.6} ${y1} ${x2 - 2.6} ${y2} ${x2} ${y2}`;
};

function Graph() {
  const ref = useRef(null);
  const tabs = useRef([]);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const [hov, setHov] = useState(-1);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || calm || hov >= 0 || mine) return;
    const t = setInterval(() => setAt((v) => (v + 1) % CAPS.length), 3200); // the pass moves on while you read
    return () => clearInterval(t);
  }, [live, calm, hov, mine]);
  const lit = hov >= 0 ? hov : at;
  const prev = useRef(lit);
  const jumpy = Math.abs(lit - prev.current) > 1; // a long jump (06 back to 01) cuts instead of flying across the wires
  useEffect(() => { prev.current = lit; }, [lit]);
  const pick = (i) => { setAt(i); setHov(-1); setMine(true); };
  const key = (e, i) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? CAPS.length - 1 : d === undefined ? -1 : (i + d + CAPS.length) % CAPS.length;
    if (n < 0) return;
    e.preventDefault(); pick(n); tabs.current[n]?.focus();
  };
  return (
    <section className="a2-sec xst-graph" ref={ref} aria-labelledby="xst-graph-h">
      <noscript><style>{'.xst-pane-st{gap:28px}.xst-pane-c,.xst-ans-c{grid-area:auto!important;opacity:1!important;transform:none!important;clip-path:none!important}.xst-m>span{transform:none!important}'}</style></noscript>
      <div className="a2-wrap">
        <div className="xst-gh">
          <p className="a2-kick">Capabilities</p>
          <A2Lines id="xst-graph-h" className="a2-display s" lines={['Built for cinema, VFX,', 'and multi-shot storytelling']} />
        </div>
        <div className="xst-gw">
          <div className="xst-canvas" role="tablist" aria-label="Capabilities" onPointerLeave={() => setHov(-1)}>
            <svg className="xst-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {WIRE.map((w) => <path key={w.join()} d={wire(w)} vectorEffect="non-scaling-stroke" />)}
              {WIRE.map((w) => <path key={'l' + w.join()} d={wire(w)} vectorEffect="non-scaling-stroke" className={'lit' + (w[1] <= lit ? ' on' : '')} />)}
            </svg>
            {CAPS.map(([h, , tag], i) => (
              <button
                key={h} type="button" role="tab" id={'xst-cap-' + i} aria-selected={i === lit} aria-controls="xst-cap-pane" tabIndex={i === lit ? 0 : -1}
                ref={(el) => { tabs.current[i] = el; }}
                className={'xst-node' + (i === lit ? ' on' : '') + (i < lit ? ' done' : '')}
                style={{ '--x': NODE[i][0] / 100, '--y': NODE[i][1] / 100 }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}
              >
                {i === lit && <motion.span layoutId="xst-node-ring" className="xst-node-ring" aria-hidden="true" transition={{ duration: calm || jumpy ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }} />}
                <span className="xst-node-k x-mono"><span>{pad(i + 1)}</span><i aria-hidden="true" /></span>
                <b>{h}</b>
                <em className="x-mono">{tag}</em>
              </button>
            ))}
          </div>
          <div className="xst-pane" id="xst-cap-pane" role="tabpanel" aria-labelledby={'xst-cap-' + lit} onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(lit)} onPointerLeave={() => setHov(-1)}>
            <div className="xst-pane-k x-mono" aria-hidden="true">
              <span>{pad(lit + 1)} / {pad(CAPS.length)}</span>
              <i><b style={{ transform: `scaleX(${(lit + 1) / CAPS.length})` }} /></i>
            </div>
            <div className="xst-pane-st">
              {CAPS.map(([h, d, tag], i) => (
                <div key={h} className={'xst-pane-c' + (i === lit ? ' on' : '')} aria-hidden={i !== lit}>
                  <em className="x-mono">{tag}</em>
                  <h3 className="a2-title"><span className="xst-m"><span>{h}</span></span></h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BIN = [
  ['iro', 'Image generation and visual understanding.', 'Images'],
  ['koma', 'Video generation and world simulation.', 'Video'],
  ['oto', 'Sound generation and audio understanding.', 'Audio'],
  ['koe', 'Voice synthesis and speech understanding.', 'Voice'],
  ['uta', 'Music generation and composition.', 'Music'],
  ['mori', '3D generation and spatial understanding.', '3D'],
];

/* The six creative models on a film strip: one frame plays; each opens into its model page. */
function Strip() {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const opener = useOpener();
  const boxes = useRef([]);
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  const [ready, setReady] = useState(false); // the server cannot know reduced motion: films join after hydration
  const rail = useRef(null);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!live || held || calm) return;
    const t = setInterval(() => setOn((v) => (v + 1) % BIN.length), 3200);
    return () => clearInterval(t);
  }, [live, held, calm]);
  useEffect(() => { if (live && !held) follow(rail.current, boxes.current[on]?.closest('li'), !calm); }, [on, live, held, calm]); // the lit frame is always in view
  return (
    <section className="a2-sec xst-strip" ref={ref} aria-labelledby="xst-strip-h">
      <div className="a2-wrap a2-grid xst-strip-head">
        <A2Lines id="xst-strip-h" className="a2-display s xst-strip-h" lines={['Every creative model,', 'in one studio.']} />
        <p className="a2-lede">Video, image, 3D, sound, voice and music, each a node on the canvas. Open one to see what it makes.</p>
      </div>
      <ul className="xst-film" ref={rail} onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}>
        {BIN.map(([slug, d, kind], i) => (
          <li key={slug}>
            <a href={'/' + slug} className={'xst-fr' + (on === i ? ' on' : '')} data-card={slug} data-cursor="Open" onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(i)} onFocus={() => setOn(i)}
              onClick={(e) => opener?.open(e, { el: boxes.current[i], src: `/models/${slug}.webp`, href: '/' + slug, key: slug })}>
              <span className="xst-fr-m" ref={(el) => { boxes.current[i] = el; }}>
                <img src={`/models/${slug}.webp`} alt="" loading="lazy" />
                {ready && on === i && !calm && <video src={`/models/${slug}.webm`} autoPlay muted loop playsInline aria-hidden="true" />}
              </span>
              <span className="xst-fr-t"><em className="x-mono">{kind}</em><b>{NAME[slug]}</b><span>{d}</span></span>
            </a>
          </li>
        ))}
      </ul>
      <div className="a2-wrap xst-strip-links"><More to="/pricing">Explore model pricing</More><More to="/models">View full model catalog</More></div>
    </section>
  );
}

function Chair() {
  return (
    <section className="a2-sec xst-chair" aria-labelledby="xst-chair-h">
      <div className="a2-wrap a2-grid">
        <div className="xst-chair-copy">
          <A2Lines id="xst-chair-h" className="a2-display m" lines={['Step into', 'the director’s chair']} />
          <p className="a2-lede">Launch Hanzo Studio at studio.hanzo.ai or open Hanzo Design at hanzo.ai/design.</p>
          {/* one solid ask and one text link; "Open Studio" (back up into the monitor) waits under the related list */}
          <div className="a2-acts">
            <Cta to="https://studio.hanzo.ai" id="studio.close" thumb className="xst-ask">Launch studio.hanzo.ai</Cta>
            <More to="/pricing">See plans, from $8/month</More>
            <More to="/design">Open Hanzo Design</More>
          </div>
          <div className="xst-rel">
            <p className="a2-kick">Related capabilities</p>
            <ul>{[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']].map(([t, to, d]) => <li key={t}><A to={to} className="xst-rel-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A></li>)}</ul>
            <Cta to="/studio" kind="link" className="xst-jump xst-up" onClick={jump}>Open Studio</Cta>
          </div>
        </div>
        <div className="xst-get">
          <span className="xst-get-shot" aria-hidden="true"><img src="/models/koe.webp" alt="" loading="lazy" /><span className="xst-mark"><i />REC</span><span className="xst-get-tc x-mono">00:16</span></span>
          <h2>Get Studio</h2>
          <p>Visual builder studio</p>
          <p className="xst-get-meta x-mono"><span><span>License:</span> GPL-3.0</span><A to="https://github.com/hanzoai">hanzoai</A></p>
          <More to="https://platform.hanzo.ai/deploy">Deploy to Cloud</More>
        </div>
      </div>
    </section>
  );
}

export default function Studio() {
  return (
    <main className="a2 xst" id="main">
      <Hero />
      <A2Paste name="Studio" text="Read https://hanzo.ai/skill.md and use Hanzo Studio in my project." />
      <What />
      <Reel />
      <Graph />
      <Strip />
      <Chair />
    </main>
  );
}
