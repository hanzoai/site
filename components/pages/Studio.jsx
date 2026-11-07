'use client';
/* Studio. A cutting room: the hero is a monitor and a multi-track timeline; the film plays by itself, every camera move
   running on a real still, and the playhead is yours the moment you grab it. Then the line between Design and Studio,
   the capabilities wired as a node graph a render pass walks through, and the six creative models as a media bin.
   Signature: Scrubbable film timeline: a viewer whose camera move (Dolly In, Crane Rise, Vertigo Zolly, Crash Zoom, 360° Orbit) plays on a real still, a draggable playhead crossing Koma video, Oto foley, Koe voice and Uta score tracks, the shot, rig label and Actor Lock changing as it passes; it plays by itself until you grab it.
   Beyond: "Studio or Design?": say what you are making and Hanzo's own sentence on each sends you to /design or studio.hanzo.ai.
   Every word, figure and link is Hanzo's; the pairing of stills to camera moves is a demo, not a claim. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, More } from '../kit';
import { useLive, useEvery, useFrame, Paste, Related, Get } from './cloud/Frame';
import { useOpener } from '../Opener';
import Sigil from '../Sigil';
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
const wave = (k, n) => Array.from({ length: n }, (_, i) => 22 + ((i * 37 + k * 23) % 61)); // a fixed waveform per clip
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const line = (t, d) => (
  <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
);

function Cinema() {
  const [box, live, calm] = useLive(0.2);
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [grabbed, setGrabbed] = useState(false);
  const [model, setModel] = useState(1);
  const t = useRef(0), cur = useRef(0), sec = useRef(-1), drag = useRef(false);
  const imgs = useRef([]), lanes = useRef(null), ph = useRef(null), tc = useRef(null), bar = useRef(null), ret = useRef(null);

  // one frame of the film, written straight to the elements (no React render per frame)
  const paint = () => {
    const T = Math.max(0, t.current), k = Math.min(SHOTS.length - 1, Math.floor(T / SHOT)), p = (T - k * SHOT) / SHOT;
    const el = imgs.current[k];
    if (el) el.style.transform = MOVE[k](p);
    if (ret.current) ret.current.style.transform = k === 2 ? `scale(${0.82 + 0.3 * p})` : 'scale(1)'; // the zolly's subject holds while the world stretches
    if (ph.current) ph.current.style.transform = `translate3d(${(T / LEN) * 100}%, 0, 0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (tc.current) tc.current.textContent = `00:00:${pad(Math.floor(T))}:${pad(Math.floor((T % 1) * 24))}`;
    if (lanes.current && Math.floor(T) !== sec.current) { sec.current = Math.floor(T); lanes.current.setAttribute('aria-valuenow', sec.current); lanes.current.setAttribute('aria-valuetext', `${sec.current} seconds, shot ${k + 1}, ${SHOTS[k].rig}`); }
    if (k !== cur.current) { cur.current = k; setShot(k); }
  };
  useLayoutEffect(() => { if (calm) { t.current = SHOT * 0.6; setPlaying(false); } paint(); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useLayoutEffect(paint, [shot]); // the newly active tab's progress bar picks up where the film is
  // the first frame's dt can come out negative (rAF stamps the frame before the loop started), so it is floored at 0
  useFrame(live && playing, (_, dt) => { t.current = (t.current + Math.max(0, dt)) % LEN; paint(); });

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
    <div className="xst-desk" ref={box}>
      <div className="xst-mon">
        <div className="xst-view">
          {SHOTS.map((x, i) => (
            <img key={x.title} ref={(el) => { imgs.current[i] = el; }} src={`/models/${x.img}.webp`} alt={i === shot ? `${x.title}, made with ${NAME[x.img]}` : ''} className={i === shot ? 'on' : ''} draggable="false" />
          ))}
          <span className="xst-ret" ref={ret} aria-hidden="true"><i /><i /><i /><i /></span>
          <div className="xst-hud tl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={s.rig} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{s.rig}</motion.b>
            </AnimatePresence>
            <span>Shot {pad(shot + 1)} · {s.title}</span>
          </div>
          <div className="xst-hud tr x-mono"><i className="xst-rec" aria-hidden="true" />REC <span ref={tc}>00:00:00:00</span></div>
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
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip' + (i === shot ? ' now' : '')} style={{ backgroundImage: `url(/models/${x.img}.webp)` }}><em>{x.rig}</em></span>)}
            </div>
            <div className={'xst-track a' + (MODELS[model] === 'Oto' ? ' on' : '')}>
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip w' + (i === shot ? ' now' : '')}>{wave(i, 16).map((h, j) => <i key={j} style={{ transform: `scaleY(${h / 100})` }} />)}</span>)}
            </div>
            <div className={'xst-track k' + (MODELS[model] === 'Koe' ? ' on' : '')}>
              {SHOTS.map((x, i) => <span key={x.title} className={'xst-clip' + (i % 2 ? ' gap' : '') + (i === shot ? ' now' : '')}>{i % 2 ? null : wave(i + 7, 10).map((h, j) => <i key={j} style={{ transform: `scaleY(${h / 100})` }} />)}</span>)}
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
          <span>Describe what to make</span>
          <i className="xst-caret" aria-hidden="true" />
        </A>
        <p className="xst-ik">Library</p>
        <ul className="xst-lib">
          {LIB.map(([m, t, k]) => (
            <li key={t}>
              <button type="button" aria-pressed={shot === k && SHOTS[k].title === t} className={MODELS[model] === NAME[m] ? 'mine' : ''} onClick={() => go(k)}>
                <img src={`/models/${m}.webp`} alt={`${t}, made with ${NAME[m]}`} loading="lazy" />
                <span><b>{NAME[m]}</b><em>{t}</em></span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Hero() {
  return (
    <section className="xst-hero" data-room="dark" aria-labelledby="xst-h1">
      <div className="x-wrap">
        <div className="xst-top">
          <div>
            <motion.p className="xst-kick x-mono" {...up(0)}><i aria-hidden="true" />Hanzo Studio · AI Cinema & Production Engine</motion.p>
            <h1 id="xst-h1" className="xst-h1">{line('Direct AI cinema', 0.05)}{line('with precision camera rigs', 0.16)}{line('& multi-shot timelines', 0.27)}</h1>
          </div>
          <div className="xst-top-r">
            <motion.p className="xst-lede" {...up(0.35)}>Full production-quality AI film direction, camera motion control, character consistency lock, multi-shot storyboard sequencing, and node-graph VFX pipelines on cloud GPUs.</motion.p>
            <motion.div className="xst-acts" {...up(0.48)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://studio.hanzo.ai" className="x-btn solid" data-thumb="Launch studio.hanzo.ai">Launch studio.hanzo.ai</A></motion.span>
              <Go to="/studio">Open Studio</Go>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <Cinema />
        </motion.div>
        <ul className="xst-specs">
          {SPECS.map((t, i) => <li key={t}><span className="x-mono">{pad(i + 1)}</span>{t}</li>)}
        </ul>
        <p className="xst-note">Hanzo Studio runs at studio.hanzo.ai on dedicated Hanzo Cloud GPUs.</p>
      </div>
    </section>
  );
}

// Beyond: the two tools in Hanzo's own sentence, sorted by what you are making
const MAKE = [
  ['Everyday visuals', 0], ['Decks', 0], ['Docs', 0], ['Interactive apps', 0],
  ['AI film direction', 1], ['Camera rigs', 1], ['Multi-shot timelines', 1], ['Node-graph VFX', 1],
];
const PILLARS = [
  ['Cinema Camera & Lens Rig', 'Control physical 6-DoF camera trajectories (Dolly In/Out, Crane Rise, Vertigo Zolly, Crash Zoom, Whip Pan, 360° Orbit, Bullet-Time), 14mm–135mm prime & anamorphic 2.39:1 lenses, T-Stop aperture bokeh, and volumetric lighting.'],
  ['Character & World Consistency Lock', 'Lock Actor ID identity embeddings, wardrobe, reference stills, and Koe voice profiles so your cast and environment stay frame-accurate across every angle and cut.'],
  ['Multi-Shot Timeline & Node Graph', 'Chain shots directly with last-frame conditioning (ConcatVideo), layer Oto foley and Uta musical scores on a multi-track timeline, or drop into the full Comfy-compatible Node Graph pipeline.'],
];

function Which() {
  const [ref, live] = useLive(0.4);
  const [at, setAt] = useState(4);
  const [mine, setMine] = useState(false);
  useEvery(2400, live && !mine, () => setAt((v) => (v + 3) % MAKE.length)); // hops between the two sides while you read
  const side = MAKE[at][1];
  return (
    <div className="xst-which" ref={ref}>
      <p className="xst-which-k x-mono">Studio or Design?</p>
      <div className="xst-make" role="radiogroup" aria-label="What are you making?">
        {MAKE.map(([t, s], i) => (
          <button key={t} type="button" role="radio" aria-checked={at === i} className={s ? 's' : 'd'} onClick={() => { setAt(i); setMine(true); }}>{t}</button>
        ))}
      </div>
      <span className="xst-which-t" aria-hidden="true">{live && !mine && <i key={at} />}</span>
      <div className="xst-ans">
        {[
          ['Hanzo Design', 'builds everyday visuals, decks, docs, and interactive apps inside your workspace.', <Go key="d" to="/design" solid>Open Hanzo Design</Go>],
          ['Hanzo Studio', 'is a full cinema production suite built for directors, filmmakers, and VFX teams.', <Go key="s" to="https://studio.hanzo.ai" solid>Launch studio.hanzo.ai</Go>],
        ].map(([h, d, go], i) => (
          <motion.div key={h} className="xst-ans-c" initial={false} animate={side === i ? { opacity: 1, y: 0 } : { opacity: 0, y: i ? 16 : -16 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={side !== i} inert={side !== i}>
            <b>{h}</b><p>{d}</p>{go}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function What() {
  return (
    <section className="x-sec xst-what">
      <div className="x-wrap">
        <div className="xst-what-grid">
          <div>
            <p className="x-kick">What is Hanzo Studio</p>
            <h2 className="xst-h2">Production-grade AI film direction and node-graph VFX</h2>
            <p className="xst-say">Where Hanzo Design (<A to="/design">/design</A>) builds everyday visuals, decks, docs, and interactive apps inside your workspace, Hanzo Studio (<A to="https://studio.hanzo.ai">studio.hanzo.ai</A>) is a full cinema production suite built for directors, filmmakers, and VFX teams.</p>
          </div>
          <Which />
        </div>
        <ol className="xst-pillars">
          {PILLARS.map(([h, d], i) => (
            <li key={h}>
              <span className="xst-pn x-mono">{pad(i + 1)}</span>
              <span className="xst-perf" aria-hidden="true" />
              <h3>{h}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
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

/* The capabilities as a node graph: wires are measured from the cards, and a render pass walks node to node. */
function Graph() {
  const [ref, live] = useLive(0.25);
  const [at, setAt] = useState(0);
  const [hov, setHov] = useState(-1);
  const nodes = useRef([]);
  const [wires, setWires] = useState([]);
  useEvery(1300, live && hov < 0, () => setAt((v) => (v + 1) % CAPS.length));
  useEffect(() => {
    const box = ref.current;
    const measure = () => {
      // layout boxes (offset*), not getBoundingClientRect: the cards are still rising in on a transform when this runs
      const r = nodes.current.map((n) => ({ left: n.offsetLeft, top: n.offsetTop, right: n.offsetLeft + n.offsetWidth, bottom: n.offsetTop + n.offsetHeight, width: n.offsetWidth }));
      setWires(r.slice(0, -1).map((a, i) => {
        const b = r[i + 1];
        if (Math.abs(b.top - a.top) < 8) { // same row: side port to side port
          const ltr = b.left > a.left;
          const x1 = ltr ? a.right : a.left, x2 = ltr ? b.left : b.right, y = a.top + 46, m = (x1 + x2) / 2;
          return `M${x1} ${y} C${m} ${y} ${m} ${y} ${x2} ${y}`;
        }
        const x1 = a.left + a.width / 2, y1 = a.bottom, x2 = b.left + b.width / 2, y2 = b.top, m = (y1 + y2) / 2;
        return `M${x1} ${y1} C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [ref]);
  const lit = hov >= 0 ? hov : at;
  return (
    <section className="x-sec xst-graph">
      <div className="x-wrap">
        <header className="xst-gh">
          <p className="x-kick">Capabilities</p>
          <h2 className="xst-h2">Built for cinema, VFX, and multi-shot storytelling</h2>
        </header>
        <div className="xst-net" ref={ref}>
          <svg className="xst-wires" aria-hidden="true">
            {wires.map((d, i) => <path key={i} d={d} className={i === lit || i === lit - 1 ? 'on' : ''} />)}
          </svg>
          {CAPS.map(([h, d, tag], i) => (
            <Rise
              key={h} delay={i * 0.06} y={18}
              className={'xst-node n' + (i + 1) + (i === lit ? ' on' : '')}
              ref={(el) => { nodes.current[i] = el; }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)} onPointerLeave={() => setHov(-1)}
            >
              <span className="xst-node-h"><span className="x-mono">{pad(i + 1)}</span><em className="x-mono">{tag}</em><i aria-hidden="true" /></span>
              <h3>{h}</h3>
              <p>{d}</p>
            </Rise>
          ))}
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

function Clip({ slug, d, kind, on, play, setOn, i }) {
  const opener = useOpener();
  const box = useRef(null);
  return (
    <Rise as="li" delay={(i % 3) * 0.07}>
      <a
        href={'/' + slug} className={'xst-bin-c' + (on ? ' on' : '')} data-card={slug} data-cursor="Open"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(i)} onFocus={() => setOn(i)}
        onClick={(e) => opener?.open(e, { el: box.current, src: `/models/${slug}.webp`, href: '/' + slug, key: slug })}
      >
        <span className="xst-bin-m" ref={box}>
          <img src={`/models/${slug}.webp`} alt="" loading="lazy" />
          {play && <video src={`/models/${slug}.webm`} autoPlay muted loop playsInline aria-hidden="true" />}
        </span>
        <span className="xst-bin-t"><b>{NAME[slug]}</b><span>{d}</span><em className="x-mono">{kind}</em></span>
      </a>
    </Rise>
  );
}

function Bin() {
  const [ref, live, calm] = useLive(0.3);
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  useEvery(3200, live && !held, () => setOn((v) => (v + 1) % BIN.length)); // one clip plays at a time, the reel moves on
  return (
    <section className="x-sec xst-bin" ref={ref}>
      <div className="x-wrap">
        <div className="xst-bin-h">
          <h2 className="xst-h2">Every creative model, in one studio.</h2>
          <p>Video, image, 3D, sound, voice and music, each a node on the canvas. Open one to see what it makes.</p>
        </div>
        <ul className="xst-bin-g" onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}>
          {BIN.map(([slug, d, kind], i) => <Clip key={slug} slug={slug} d={d} kind={kind} i={i} on={on === i} play={on === i && !calm} setOn={setOn} />)}
        </ul>
        <div className="x-row-links"><More to="/pricing">Explore model pricing</More><More to="/models">View full model catalog</More></div>
      </div>
    </section>
  );
}

function Chair() {
  return (
    <section className="xst-chair">
      <Sigil seed="studio" data={[12, 14, 135, 2.39, 4]} className="xst-sigil" />
      <div className="x-wrap xst-chair-in">
        <h2 className="xst-chair-h">Step into the director’s chair</h2>
        <p>Launch Hanzo Studio at studio.hanzo.ai or open Hanzo Design at hanzo.ai/design.</p>
        <div className="xst-acts"><Go to="/studio" solid>Open Studio</Go><Go to="/design">Open Hanzo Design</Go></div>
        <Related items={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']]} className="xst-rel" />
      </div>
    </section>
  );
}

export default function Studio() {
  return (
    <main className="xst">
      <Hero />
      <section className="xst-paste"><div className="x-wrap"><Paste name="Studio" prompt="Read https://hanzo.ai/skill.md and use Hanzo Studio in my project." /></div></section>
      <What />
      <Graph />
      <Bin />
      <Chair />
      <Get name="Studio" tag="Visual builder studio" license="GPL-3.0" mark={<span className="xst-mark" aria-hidden="true"><i />REC</span>} />
    </main>
  );
}
