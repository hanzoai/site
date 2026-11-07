'use client';
/* Zen 6 Max (/zen/zen6-max): a model launch read one idea per screen (docs/MASTER.md), moving its own way
   (docs/MOTION-MAP.md). No pinned scenes: five quick sections, each arriving differently.
   1 The first screen: the name cut in on load, Hanzo's lede, "Talk to sales", the crumb, beside the playing Zen film,
     whose card arrives tipped back in 3D and then tilts toward the pointer (pause on its corner).
   2 The rack, straight after: a cloud of dots assembles into four DGX servers, one dot per 9 GB of GPU memory; the
     pointer or a finger scatters it and it reforms. The server switch and the planning range reshape it (bracket,
     pools, a twin rack across a failure domain) while the total counts; the steps beside it set it on hover or tap.
     Its headings roll into place like slot reels.
   3 The B300/B200 sheet pulls into focus; picking a column switches the rack, the picked total grows in.
   4 The promises ride in on a conveyor beside the router drawing (not pinned); the row under the pointer, focused or
     tapped sets the drawing, which steps through them by itself until then.
   5 The close: the art card's outline draws itself, then it fills and the field in it bends to the pointer.
V2: 8/10 particle rack (dots form the DGX rack at 9 GB a dot, scatter at the pointer/finger, reform per server and plan); unpinned hero and rack; five entrances
*/
// Persona: enterprise buyer running Zen 6 Max on its own GPUs
// Goal: understand what a rack for Zen 6 Max is made of, then reach sales
// CTA: Talk to sales -> /contact-sales (data-cta zen6max.hero with data-thumb; again at the close as zen6max.close)
// Metric: contact_sales_submit
// Signature: particles — a cloud of dots assembles into the DGX rack (one dot per 9 GB), scatters at the pointer or finger and reforms; the server switch and planning range split it into pools and a twin rack
// Entrances: tilt-3d-hover, slot-roll, rack-focus, conveyor, line-draw
// Beyond: B300 against B200 in one sheet, the rows Hanzo lists for each server side by side under their four-server totals; picking a column switches the rack
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Count, useCalm } from '../../ui';
import { A, More, Cta, Film, DataTable } from '../../kit';
import Sigil from '../../Sigil';
import { media } from '../../../lib/models';
import { arrows } from './live';
import ParticleRack from './zenmax/ParticleRack';
import { Tilt, Slot, Outline, useIn } from './zenmax/enter';
import './ZenMax.css';

const FEATS = [['One name', 'You call Zen 6 Max. One model, one API, one bill.'], ['Right-sized per request', 'Each request runs on the configuration built for that kind of work.'], ['Long context', 'Long context for large codebases and long documents.'], ['Tools and code', 'Tool calls and code generation, built in.']];
const DGX = [
  { name: 'DGX B300', total: 9216, rows: [['GPUs', '8 x B300'], ['GPU memory', '8 x 288 GB, 2,304 GB'], ['Cluster network', '8 x 800 Gb/s InfiniBand or Ethernet'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B300 user guide: 8 x 288 GB GPU memory', 'https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html'] },
  { name: 'DGX B200', total: 5760, rows: [['GPUs', '8 x B200'], ['GPU memory', '1,440 GB'], ['Cluster network', '8 x ConnectX-7, up to 400 Gb/s'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B200 user guide: 1,440 GB total GPU memory', 'https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html'] },
];
const PLAN = [['Qualification', 'Four 8-GPU servers is where a qualification starts.'], ['Isolated production pools', 'One pool for each specialist, so a busy class of work never takes memory from another.'], ['Redundant pools', 'Two independent replicas of those pools across failure domains.']];
const AROUND = ['NVLink and NVSwitch inside each server.', '400 or 800 Gb/s RDMA wherever a specialist spans servers.', 'About 31 TB of NVMe in each server (8 x 3.84 TB).', 'Separate sandbox workers for coding agents.', 'A high-availability control cluster.'];
const REC = 'We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises. Routing cuts the average inference work a request needs. It does not cut the memory needed to keep every specialist ready.';
const FOUR = 'Four B300 servers hold 9,216 GB of GPU memory; four B200 servers hold 5,760 GB.';

/* the name cuts into its mask once on load (700 ms, ease-emphasis): the only line-mask cut-in on the page */
function Cut({ children, delay = 0 }) {
  return (
    <motion.span className="x-line" initial="h" animate="s">
      <motion.span className="x-line-in" variants={{ h: { y: '105%' }, s: { y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay }}>{children}</motion.span>
    </motion.span>
  );
}

/* 1 The first screen, unpinned: the words (5 of 13) beside the film card (8 of 13), bottoms on one baseline.
   Entrance tilt-3d-hover: the card tips in and follows the pointer. */
function Hero() {
  const zone = useRef(null);
  const card = useRef(null);
  const held = useRef(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = card.current?.querySelector('video');
    const on = () => { if (held.current) v.pause(); else setPlaying(true); };
    const off = () => setPlaying(false);
    v?.addEventListener('play', on);
    v?.addEventListener('pause', off);
    return () => { v?.removeEventListener('play', on); v?.removeEventListener('pause', off); };
  }, []);
  const toggle = () => {
    const v = card.current?.querySelector('video');
    if (!v) return;
    held.current = playing;
    if (playing) v.pause(); else v.play?.().catch(() => {});
  };
  return (
    <section className="zx-hero" ref={zone} aria-labelledby="zx-h">
      <noscript><style>{'.zx-card .zx-film{display:none!important}.zx-card{background:#000 url(/models/zen.webp) center/cover}.zx-pause{display:none}.zx-drawer-p[hidden]{display:block!important}'}</style></noscript>
      <div className="zx-w zx-hero-g">
        <div className="zx-hero-t">
          <h1 id="zx-h" className="zx-name" data-morph-target><Cut delay={0.1}>Zen 6 Max</Cut></h1>
          <p className="zx-sub">Zen 6 Max. Built for the hardest work: deep reasoning, long context, and code.</p>
          <div className="zx-acts">
            <Cta to="/contact-sales" id="zen6max.hero" thumb>Talk to sales</Cta>
            <Cta to="/enterprise" id="zen6max.hero.gpus" kind="link">Run it on your own GPUs</Cta>
          </div>
          <nav className="zx-crumb"><ol><li><A to="/zen">Zen</A></li><li aria-current="page">Zen 6 Max</li></ol></nav>
        </div>
        <Tilt zone={zone} className="zx-hero-art">
          <div className="zx-card" ref={card}>
            <Film src={media('zen', 'webm')} poster={media('zen', 'webp')} w={1200} h={1500} className="zx-film" />
            <button type="button" className="zx-pause" aria-label="Pause" aria-pressed={!playing} onClick={toggle}>
              {playing
                ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9l7-4.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
            </button>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

/* 2 The rack (the signature). The particle rack sits in the dark panel with the server switch, the count and the
   planning range; the steps beside it read the same states and set them on hover or tap. Until the visitor picks, the
   rack steps through the range by itself while it is on screen. Entrance slot-roll: the heading and step titles. */
function Deploy({ k, setK }) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useCalm();
  const [ref, inn] = useIn(0.2);
  const panel = useRef(null);
  const live = useInView(panel, { amount: 0.4 });
  useEffect(() => {
    if (calm || mine || !live) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % 4), at === 0 ? 3200 : 2800);
    return () => clearTimeout(t);
  }, [at, calm, mine, live]);
  const pick = (i) => { setMine(true); setAt(i); };
  const peek = (i) => (e) => { if (e.pointerType === 'mouse') pick(i); };
  const plan = Math.max(0, at - 1);
  const label = `${DGX[k].name}: ${at ? PLAN[at - 1][0] : FOUR}`;
  return (
    <section className="zx-dep" ref={ref} data-in={inn} aria-labelledby="zx-dep-h">
      <div className="zx-w zx-dep-head">
        <Slot as="h2" id="zx-dep-h" className="zx-h2" text="On your own premises" />
        <p className="zx-kick zx-under">Enterprise deployment</p>
      </div>
      <div className="zx-w zx-ch">
        <div className="zx-steps">
          <div className="zx-step" data-on={at === 0 || undefined} onPointerEnter={peek(0)} onClick={() => pick(0)}>
            <p className="zx-lede">What a rack for Zen 6 Max is made of.</p>
            <p className="zx-body">{REC}</p>
            <p className="zx-body zx-four">{FOUR}</p>
          </div>
          {PLAN.map(([t, x], i) => (
            <div key={t} className="zx-step" data-on={at === i + 1 || undefined} onPointerEnter={peek(i + 1)} onClick={() => pick(i + 1)}>
              <Slot as="h3" className="zx-step-t" text={t} at={8 + i * 6} />
              <p className="zx-body">{x}</p>
            </div>
          ))}
        </div>
        <div className="zx-panel" ref={panel}>
          <div className="zx-bar">
            <div className="zx-seg" role="radiogroup" onKeyDown={arrows}>
              {DGX.map((d, i) => <button key={d.name} type="button" role="radio" aria-checked={k === i} tabIndex={k === i ? 0 : -1} className="zx-chip" onClick={() => { setMine(true); setK(i); }}>{d.name}</button>)}
            </div>
            <span className="zx-bar-n" aria-hidden="true">{String(at + 1).padStart(2, '0')} / 04</span>
          </div>
          <ParticleRack k={k} at={at} label={label} />
          <div className="zx-foot">
            <p className="zx-total"><Count key={k} to={DGX[k].total} suffix=" GB" duration={1.2} className="zx-num" /><span>{DGX[k].name}</span></p>
            <div className="zx-plan" role="group" aria-labelledby="zx-plan-l">
              <p id="zx-plan-l" className="zx-plan-l">Planning range</p>
              {PLAN.map(([t], i) => <button key={t} type="button" aria-pressed={plan === i && at > 0} className="zx-chip sm" onClick={() => pick(i + 1)}>{t}</button>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3 Beyond: the sheet. Entrance rack-focus: figures, sheet and sources pull into focus one after another. The two
   four-server totals sit over their columns; picking a column switches the rack above and tints that column. */
function Spec({ k, setK }) {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(-1); // the column under a mouse previews its figure (ZenMax.css tints its cells)
  const [ref, inn] = useIn(0.2);
  const figs = useRef(null);
  const seen = useInView(figs, { once: true, margin: '0px 0px -40% 0px' });
  const hover = (i) => ({ onPointerEnter: (e) => { if (e.pointerType === 'mouse') setPeek(i); }, onPointerLeave: () => setPeek(-1) });
  const cols = [
    { key: 'row', label: '' },
    ...DGX.map((d, i) => ({ key: 'd' + i, subject: k === i, label: <button type="button" className="zx-col" aria-pressed={k === i} onClick={() => setK(i)} {...hover(i)}>{d.name}</button> })),
  ];
  const rows = DGX[0].rows.map(([label], r) => ({ row: label, d0: DGX[0].rows[r][1], d1: DGX[1].rows[r][1] }));
  return (
    <section className="zx-spec" ref={ref} data-in={inn}>
      <div className="zx-w">
        <div className="zx-figs zx-rf" style={{ '--i': 0 }} ref={figs} data-seen={seen || undefined} aria-hidden="true">
          <span />
          {DGX.map((d, i) => <span key={d.name} className="zx-fig" data-on={k === i || undefined} data-peek={(peek === i && k !== i) || undefined}><span>{d.total.toLocaleString('en-US')} GB</span></span>)}
        </div>
        <div className="zx-rf" style={{ '--i': 1 }}><DataTable caption={FOUR} cols={cols} rows={rows} className="zx-sheet" /></div>
        <div className="zx-srcs zx-rf" style={{ '--i': 2 }}>
          <span />
          {DGX.map((d) => <More key={d.name} to={d.doc[1]}>{d.doc[0]}</More>)}
        </div>
        <div className="zx-drawer zx-rf" style={{ '--i': 3 }}>
          <button type="button" className="zx-drawer-b" aria-expanded={open} aria-controls="zx-around" onClick={() => setOpen((o) => !o)}>
            <span id="zx-ar-h">Around the servers</span>
            <i aria-hidden="true" data-open={open || undefined} />
          </button>
          <div id="zx-around" role="region" aria-labelledby="zx-ar-h" className="zx-drawer-p" hidden={!open}>
            <ul>{AROUND.map((x, i) => <li key={x} style={{ '--i': i }}>{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the router drawing beside the promises: one object, one change per promise, each step adds to the last.
   01 One name: one node fans into the specialists. 02 Right-sized: a request runs down one line and lights its
   configuration. 03 Long context: a long bar fills under it. 04 Tools and code: the lit configuration opens a terminal
   line with a blinking caret. Shapes only, no words (aria-hidden); ZenMax.css moves it on transform, opacity and clip-path. */
const LANES = [88, 144, 200, 256, 312];
function Router({ at, seen }) {
  return (
    <div className="zx-rt" data-at={at} data-seen={seen || undefined} aria-hidden="true">
      <svg className="zx-rt-l zx-rt-fan" viewBox="0 0 640 440">
        {LANES.map((y) => <path key={y} className={y === 200 ? 'pick' : undefined} d={`M104 200 C 210 200, 210 ${y}, 316 ${y}`} />)}
      </svg>
      <svg className="zx-rt-l" viewBox="0 0 640 440">
        <circle className="zx-rt-ring" cx="80" cy="200" r="34" />
        <circle className="zx-rt-src" cx="80" cy="200" r="22" />
        {LANES.map((y) => <rect key={y} className="zx-rt-node" x="316" y={y - 15} width="116" height="30" rx="15" />)}
      </svg>
      <svg className="zx-rt-l zx-rt-req" viewBox="0 0 640 440">
        <rect className="zx-rt-lit" x="316" y="185" width="116" height="30" rx="15" />
        <circle className="zx-rt-dot" cx="104" cy="200" r="6" />
      </svg>
      <svg className="zx-rt-l zx-rt-ctx" viewBox="0 0 640 440">
        <rect className="zx-rt-track" x="58" y="374" width="524" height="10" rx="5" />
        <rect className="zx-rt-fill" x="58" y="374" width="524" height="10" rx="5" />
      </svg>
      <svg className="zx-rt-l zx-rt-tool" viewBox="0 0 640 440">
        <path className="zx-rt-wire" d="M432 200 H 470" />
        <rect className="zx-rt-term" x="470" y="168" width="128" height="64" rx="12" />
        <path className="zx-rt-chev" d="M488 192 l8 8 l-8 8" />
        <rect className="zx-rt-code" x="506" y="198" width="44" height="4" rx="2" />
        <rect className="zx-rt-caret" x="556" y="191" width="3" height="18" rx="1" />
      </svg>
    </div>
  );
}

/* 4 The promises: the router drawing (8 of 13) beside the rows (5 of 13), not pinned. Entrance conveyor: the drawing
   and then each row ride in from the right at one belt speed. The row under the pointer, focused or tapped sets the
   drawing; until then it steps through the four by itself while on screen. */
function Promises() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useCalm();
  const [ref, inn] = useIn(0.25);
  const live = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (calm || mine || !live) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % FEATS.length), 2600);
    return () => clearTimeout(t);
  }, [at, calm, mine, live]);
  const set = (i) => { setMine(true); setAt(i); };
  const peek = (i) => (e) => { if (e.pointerType === 'mouse') set(i); };
  return (
    <section className="zx-prom" ref={ref} data-in={inn}>
      <div className="zx-w zx-prom-g">
        <div className="zx-prom-art zx-belt" style={{ '--i': 0 }}><Router at={at} seen={inn} /></div>
        <ol className="zx-prom-l">
          {FEATS.map(([t, x], i) => (
            <li key={t} className="zx-belt" style={{ '--i': i + 1 }} tabIndex={0} data-on={at === i || undefined} onPointerEnter={peek(i)} onFocus={() => set(i)} onClick={() => set(i)}>
              <h2><span className="zx-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></h2>
              <p>{x}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 5 The close. Entrance line-draw: the art card's outline draws round, then the card fills and its field shows. */
function Close() {
  const [ref, inn] = useIn(0.35);
  return (
    <section className="zx-close" ref={ref} data-in={inn} data-ask-hide>
      <div className="zx-w zx-close-g">
        <div className="zx-close-art" aria-hidden="true">
          <div className="zx-close-fill"><Sigil seed="zen6-max" data={[9216, 5760, 2304, 1440, 31]} className="zx-sig" /></div>
          <Outline />
        </div>
        <div className="zx-close-t">
          <p className="zx-state">Final capacity and performance commitments come from qualifying your workload: context length, concurrency, routing mix, latency, and failover.</p>
          <div className="zx-acts"><Cta to="/contact-sales" id="zen6max.close">Talk to sales</Cta></div>
        </div>
      </div>
    </section>
  );
}

export default function ZenMax() {
  const [k, setK] = useState(0);
  return (
    <main className="zx">
      <Hero />
      <Deploy k={k} setK={setK} />
      <Spec k={k} setK={setK} />
      <Promises />
      <Close />
    </main>
  );
}
