'use client';
/* Zen 6 Max (/zen/zen6-max): a model launch read like a product film, one idea per screen (docs/MASTER.md).
   The first screen sells on its own: the name, Hanzo's lede and "Talk to sales" over the playing Zen film. The film's
   left edge then wipes off the words, and the film settles into its card (8 of 13 columns) beside them, so card and
   words never share pixels; the name settles from 112px to its resting 52px. The pause rides the card's corner.
   Then the promises beside a router drawing that changes per promise, the rack chapters (pinned on a desktop, stacked
   on a phone), the B300/B200 sheet whose picked total grows, the close.
   Not only scroll: the name cuts in on load, the film plays (with a pause control), the count runs, the rack answers its
   switches, the router answers the row under the pointer, the drawer opens, the field in the close bends to the pointer.
V2: 8/10 film wipes off the words then settles beside them; router drawing per promise; shorter stage; rack panel overlaps its head; picked total grows; hover answers
*/
// Persona: enterprise buyer running Zen 6 Max on its own GPUs
// Goal: understand what a rack for Zen 6 Max is made of, then reach sales
// CTA: Talk to sales -> /contact-sales (data-cta zen6max.hero with data-thumb; again at the close as zen6max.close)
// Metric: contact_sales_submit
// Signature: the rack builds itself, chapter by chapter: four servers slide in and the GPU memory counts to Hanzo's total, the GPUs split into one pool per specialist, a twin rack lands across a failure domain
// Beyond: B300 against B200 in one sheet, the rows Hanzo lists for each server side by side under their four-server totals; picking a column switches the rack
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Count } from '../../ui';
import { A, More, Cta, Film, DataTable } from '../../kit';
import Sigil from '../../Sigil';
import { media } from '../../../lib/models';
import { arrows } from './live';
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

/* a line that cuts into its mask once (700 ms, ease-emphasis); the mask is watched, not the hidden line inside it */
function Cut({ children, load, delay = 0 }) {
  const when = load ? { animate: 's' } : { whileInView: 's', viewport: { once: true, amount: 0.6 } };
  return (
    <motion.span className="x-line" initial="h" {...when}>
      <motion.span className="x-line-in" variants={{ h: { y: '105%' }, s: { y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay }}>{children}</motion.span>
    </motion.span>
  );
}

/* Stage: the film opens full width under the header (--k 1), then settles into its card (--k 0). Scale and position
   only; ZenMax.css turns --k into the transforms, and --s0 (the cover scale) is measured here and guessed in CSS for the
   first paint. The asks read light while the film is under them. */
function Stage() {
  const box = useRef(null);
  const pin = useRef(null);
  const card = useRef(null);
  const held = useRef(false);
  const [over, setOver] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const k = useTransform(p, [0, 0.75], [1, 0], { clamp: true });
  const ke = useTransform(k, (v) => v * (2 - v)); // eased out
  // the film's left edge wipes off the words between --k 1 and .8 (ZenMax.css --edge); past about .91 it has cleared the ask
  useMotionValueEvent(ke, 'change', (v) => setOver(v > 0.91));
  useEffect(() => {
    setOver(ke.get() > 0.91);
    const fit = () => {
      const c = card.current;
      if (!c || !c.offsetWidth) return;
      const s = Math.max((innerWidth * 1.08) / c.offsetWidth, (innerHeight - 40) / c.offsetHeight);
      pin.current?.style.setProperty('--s0', s.toFixed(3));
    };
    fit();
    addEventListener('resize', fit);
    const v = card.current?.querySelector('video');
    const on = () => { if (held.current) v.pause(); else setPlaying(true); };
    const off = () => setPlaying(false);
    v?.addEventListener('play', on);
    v?.addEventListener('pause', off);
    return () => { removeEventListener('resize', fit); v?.removeEventListener('play', on); v?.removeEventListener('pause', off); };
  }, [ke]);
  const toggle = () => {
    const v = card.current?.querySelector('video');
    if (!v) return;
    held.current = playing;
    if (playing) v.pause(); else v.play?.().catch(() => {});
  };
  return (
    <section className="zx-stage" ref={box} aria-labelledby="zx-h">
      {/* JS off: the stage settled, the poster for the film, every step and the drawer shown (gate item 5) */}
      <noscript><style>{'.zx-stage-pin{--k:0!important}.zx-stage{height:auto!important}.zx-srv{opacity:1!important;transform:none!important}.zx-step{opacity:1!important}.zx-drawer-p[hidden]{display:block!important}.zx-pause{display:none}.zx-card .zx-film{display:none!important}.zx-card{background:#000 url(/models/zen.webp) center/cover}.zx-rt-fan,.zx-rt-tool{clip-path:none!important}.zx-rt-lit,.zx-rt-ctx{opacity:1!important}.zx-rt-lit,.zx-rt-fill{transform:none!important}'}</style></noscript>
      <motion.div className="zx-stage-pin" ref={pin} style={{ '--k': ke }}>
        <div className="zx-card" ref={card}>
          <Film src={media('zen', 'webm')} poster={media('zen', 'webp')} w={1200} h={1500} className="zx-film" />
        </div>
        {/* the pause rides the film's visible corner at every --k (ZenMax.css .zx-pause-at) */}
        <div className="zx-pause-at">
          <button type="button" className="zx-pause" aria-label="Pause" aria-pressed={!playing} onClick={toggle}>
            {playing
              ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9l7-4.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
          </button>
        </div>
        <div className="zx-w zx-stage-t">
          <div className="zx-stage-b">
            <h1 id="zx-h" className="zx-name zx-blend" data-morph-target><Cut load delay={0.1}>Zen 6 Max</Cut></h1>
            <p className="zx-sub zx-blend">Zen 6 Max. Built for the hardest work: deep reasoning, long context, and code.</p>
            <div className="zx-acts" data-over={over || undefined}>
              <Cta to="/contact-sales" id="zen6max.hero" thumb>Talk to sales</Cta>
              <Cta to="/enterprise" id="zen6max.hero.gpus" kind="link">Run it on your own GPUs</Cta>
            </div>
            <nav className="zx-crumb zx-blend"><ol><li><A to="/zen">Zen</A></li><li aria-current="page">Zen 6 Max</li></ol></nav>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* the router drawing beside the promises: one object, one change per promise, each step adds to the last.
   01 One name: one node fans into the specialists. 02 Right-sized: a request runs down one line and lights its
   configuration. 03 Long context: a long bar fills under it. 04 Tools and code: the lit configuration opens a terminal
   line with a blinking caret. Shapes only, no words (aria-hidden); ZenMax.css moves it on transform, opacity and clip-path. */
const LANES = [88, 144, 200, 256, 312];
function Router({ at }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div className="zx-rt" ref={ref} data-at={at} data-seen={seen || undefined} aria-hidden="true">
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

/* the four promises: the router drawing (8 of 13, pinned on a desktop) beside the rows (5 of 13); the row at mid-screen,
   or the one under the pointer, sets the drawing. Each heading cuts into its line on arrival. */
function Promises() {
  const [at, setAt] = useState(0);
  const rows = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.i); }), { rootMargin: '-40% 0px -50% 0px' });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const peek = (i) => (e) => { if (e.pointerType === 'mouse') setAt(i); };
  return (
    <section className="zx-prom">
      <div className="zx-w zx-prom-g">
        <div className="zx-prom-art"><Router at={at} /></div>
        <ol className="zx-prom-l">
          {FEATS.map(([t, x], i) => (
            <li key={t} data-i={i} ref={(el) => { rows.current[i] = el; }} data-on={at === i || undefined} onPointerEnter={peek(i)}>
              <h2><span className="zx-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><Cut>{t}</Cut></h2>
              <p>{x}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* the rack: four servers of eight GPUs; pools tint the GPUs per specialist; redundancy fills a twin rack across a
   failure domain (its slots wait, ghosted, until then) */
function Rack({ k, plan, q, on, calm, dx = 40 }) {
  const one = (twin) => {
    const go = on && (!twin || plan === 2);
    return (
      <div className={'zx-rack' + (twin ? ' twin' : '')} data-go={go || undefined}>
        {[0, 1, 2, 3].map((s) => (
          <div key={s} className="zx-slot">
            <motion.div key={k} className="zx-srv" initial={{ x: dx, opacity: 0 }} animate={go ? { x: 0, opacity: 1 } : { x: dx, opacity: 0 }} transition={calm ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: s * 0.06 }}>
              <span className="zx-srv-n">{DGX[k].name}</span>
              <span className="zx-gpus">
                {Array.from({ length: 8 }, (_, g) => <i key={g} data-p={plan >= 1 ? Math.min(2, Math.floor((s * 8 + g) / 11)) : undefined} style={{ transitionDelay: (go && !calm ? 0.3 + s * 0.06 + g * 0.02 : 0) + 's' }} />)}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="zx-racks" data-plan={plan} data-q={q || undefined}>
      <div className="zx-rack-a">{one(false)}<span className="zx-brk" aria-hidden="true" /></div>
      <span className="zx-domain" aria-hidden="true" />
      <div className="zx-rack-b" aria-hidden={plan < 2 || undefined}>{one(true)}</div>
    </div>
  );
}

/* the chapters. Desktop: text steps past the pinned rack and the step at mid-screen sets its state. Phone: no pin
   (MASTER part 11): the rack sits above its steps and the planning buttons set it. */
function Chapters({ k, setK }) {
  const [at, setAt] = useState(0);
  const [wide, setWide] = useState(true);
  const steps = useRef([]);
  const panel = useRef(null);
  const on = useInView(panel, { once: true, amount: 0.35 });
  const calm = useReducedMotion();
  useEffect(() => {
    const mq = matchMedia('(min-width: 900px)');
    setWide(mq.matches);
    if (!mq.matches) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.step); }), { rootMargin: '-45% 0px -45% 0px' });
    steps.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);
  const plan = Math.max(0, at - 1);
  const go = (i) => {
    setAt(i + 1);
    const el = steps.current[i + 1];
    if (!wide || !el) return;
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const y = el.getBoundingClientRect().top + scrollY - innerHeight / 2 + el.offsetHeight / 2;
    if (window.__lenis && !quiet) window.__lenis.scrollTo(y, { duration: 0.5 }); else scrollTo({ top: y, behavior: quiet ? 'auto' : 'smooth' });
  };
  return (
    <section className="zx-dep" aria-labelledby="zx-dep-h">
      <div className="zx-w zx-dep-head">
        <h2 id="zx-dep-h" className="zx-h2">On your own premises</h2>
        <p className="zx-kick zx-under">Enterprise deployment</p>
      </div>
      <div className="zx-w zx-ch">
        <div className="zx-steps">
          <div className="zx-step" data-step="0" ref={(el) => { steps.current[0] = el; }} data-on={at === 0 || undefined}>
            <p className="zx-lede">What a rack for Zen 6 Max is made of.</p>
            <p className="zx-body">{REC}</p>
            <p className="zx-body zx-four">{FOUR}</p>
          </div>
          {PLAN.map(([t, x], i) => (
            <div key={t} className="zx-step" data-step={i + 1} ref={(el) => { steps.current[i + 1] = el; }} data-on={at === i + 1 || undefined}>
              <h3 className="zx-step-t">{t}</h3>
              <p className="zx-body">{x}</p>
            </div>
          ))}
        </div>
        <div className="zx-pin">
          <div className="zx-panel" ref={panel}>
            <div className="zx-bar">
              <div className="zx-seg" role="radiogroup" onKeyDown={arrows}>
                {DGX.map((d, i) => <button key={d.name} type="button" role="radio" aria-checked={k === i} tabIndex={k === i ? 0 : -1} className="zx-chip" onClick={() => setK(i)}>{d.name}</button>)}
              </div>
              <span className="zx-bar-n" aria-hidden="true">{String(at + 1).padStart(2, '0')} / 04</span>
            </div>
            <Rack k={k} plan={plan} q={at === 1} on={on} calm={calm} dx={wide ? 40 : 16} />
            <div className="zx-foot">
              <p className="zx-total"><Count key={k} to={DGX[k].total} suffix=" GB" duration={1.2} className="zx-num" /><span>{DGX[k].name}</span></p>
              <div className="zx-plan" role="group" aria-labelledby="zx-plan-l">
                <p id="zx-plan-l" className="zx-plan-l">Planning range</p>
                {PLAN.map(([t], i) => <button key={t} type="button" aria-pressed={plan === i && at > 0} className="zx-chip sm" onClick={() => go(i)}>{t}</button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the sheet. The two four-server totals sit over their columns (the one big thing on this screen); picking a
   column switches the rack above and tints that column. */
function Spec({ k, setK }) {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(-1); // the column under a mouse previews its figure (ZenMax.css tints its cells)
  const hover = (i) => ({ onPointerEnter: (e) => { if (e.pointerType === 'mouse') setPeek(i); }, onPointerLeave: () => setPeek(-1) });
  const cols = [
    { key: 'row', label: '' },
    ...DGX.map((d, i) => ({ key: 'd' + i, subject: k === i, label: <button type="button" className="zx-col" aria-pressed={k === i} onClick={() => setK(i)} {...hover(i)}>{d.name}</button> })),
  ];
  const rows = DGX[0].rows.map(([label], r) => ({ row: label, d0: DGX[0].rows[r][1], d1: DGX[1].rows[r][1] }));
  return (
    <section className="zx-spec">
      <div className="zx-w">
        <div className="zx-figs" aria-hidden="true">
          <span />
          {DGX.map((d, i) => <span key={d.name} className="zx-fig" data-on={k === i || undefined} data-peek={(peek === i && k !== i) || undefined}><span>{d.total.toLocaleString('en-US')} GB</span></span>)}
        </div>
        <DataTable caption={FOUR} cols={cols} rows={rows} className="zx-sheet" />
        <div className="zx-srcs">
          <span />
          {DGX.map((d) => <More key={d.name} to={d.doc[1]}>{d.doc[0]}</More>)}
        </div>
        <div className="zx-drawer">
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

function Close() {
  return (
    <section className="zx-close" data-ask-hide>
      <div className="zx-w zx-close-g">
        <div className="zx-close-art" aria-hidden="true"><Sigil seed="zen6-max" data={[9216, 5760, 2304, 1440, 31]} className="zx-sig" /></div>
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
      <Stage />
      <Promises />
      <Chapters k={k} setK={setK} />
      <Spec k={k} setK={setK} />
      <Close />
    </main>
  );
}
