'use client';
/* Zen 6 Max (/zen/zen6-max): a model launch read like a product film, one idea per screen.
   Stage: the Zen film opens full screen under the name and settles into its 28px card as you scroll.
   Signature: the rack builds itself, chapter by chapter. The black rack pins while four chapters pass beside it:
   four 8-GPU servers slide in and the GPU memory counts to Hanzo's own total (9,216 GB on B300, 5,760 GB on B200);
   qualification brackets the four; the GPUs split into one pool per specialist; a twin rack lands across a failure
   domain. Switch the server and the rack reloads.
   Beyond: B300 against B200 in one spec sheet, the rows Hanzo lists for each server side by side with the four-server
   total, so the server choice reads at a glance (and the rack above follows the column you pick).
V2: 8/10 film Stage hero settles into a card; the rack as four pinned scroll chapters; B300 vs B200 spec sheet with a drawer; one CTA
*/
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Count, Magnetic } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import { media } from '../../../lib/models';
import { useFilms, arrows } from './live';
import './ZenMax.css';

const FEATS = [['One name', 'You call Zen 6 Max. One model, one API, one bill.'], ['Right-sized per request', 'Each request runs on the configuration built for that kind of work.'], ['Long context', 'Long context for large codebases and long documents.'], ['Tools and code', 'Tool calls and code generation, built in.']];
const DGX = [
  { name: 'DGX B300', chip: 'B300', total: 9216, rows: [['GPUs', '8 x B300'], ['GPU memory', '8 x 288 GB, 2,304 GB'], ['Cluster network', '8 x 800 Gb/s InfiniBand or Ethernet'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B300 user guide: 8 x 288 GB GPU memory', 'https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html'] },
  { name: 'DGX B200', chip: 'B200', total: 5760, rows: [['GPUs', '8 x B200'], ['GPU memory', '1,440 GB'], ['Cluster network', '8 x ConnectX-7, up to 400 Gb/s'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B200 user guide: 1,440 GB total GPU memory', 'https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html'] },
];
const PLAN = [['Qualification', 'Four 8-GPU servers is where a qualification starts.'], ['Isolated production pools', 'One pool for each specialist, so a busy class of work never takes memory from another.'], ['Redundant pools', 'Two independent replicas of those pools across failure domains.']];
const AROUND = ['NVLink and NVSwitch inside each server.', '400 or 800 Gb/s RDMA wherever a specialist spans servers.', 'About 31 TB of NVMe in each server (8 x 3.84 TB).', 'Separate sandbox workers for coding agents.', 'A high-availability control cluster.'];
const REC = 'We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises. Routing cuts the average inference work a request needs. It does not cut the memory needed to keep every specialist ready.';

/* Stage: the film covers the screen, then settles into its card (scale and position only; the card's settled box is
   set in viewport units, so the cover scale is a constant and the server paints the first frame right) */
function Stage() {
  const box = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const k = useTransform(p, [0, 0.62], [1, 0], { clamp: true }); // 1 = full screen, 0 = settled
  const ke = useTransform(k, (v) => v * (2 - v)); // eased out; ZenMax.css turns it into translate and scale (2.74 covers the screen from a 38vw card)
  const show = useTransform(k, [0.55, 0.1], [0, 1]);
  const lift = useTransform(k, [0.55, 0.1], [24, 0]);
  return (
    <section className="zx-stage" ref={box} aria-labelledby="zx-h">
      <div className="zx-stage-pin">
        <motion.div className="zx-card" data-room="dark" style={{ '--k': ke }}>
          <video className="zx-film" src={media('zen', 'webm')} poster={media('zen', 'webp')} autoPlay muted loop playsInline aria-hidden="true" />
        </motion.div>
        <div className="zx-w zx-stage-t">
          <p className="zx-kick zx-blend"><A to="/zen">Zen</A></p>
          <div className="zx-stage-b">
            <h1 id="zx-h" className="zx-name zx-blend" data-morph-target>Zen 6 Max</h1>
            <motion.div className="zx-stage-more" style={{ opacity: show, y: lift }}>
              <p className="zx-sub">Zen 6 Max. Built for the hardest work: deep reasoning, long context, and code.</p>
              <div className="zx-acts">
                <Magnetic><A to="/contact-sales" className="x-btn solid zx-btn" data-thumb="Talk to sales">Talk to sales</A></Magnetic>
                <A to="/enterprise" className="x-btn zx-btn">Run it on your own GPUs</A>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the four promises: an editorial index, one line each, sitting still */
function Promises() {
  return (
    <section className="zx-prom" aria-label="What Zen 6 Max is">
      <ol className="zx-w zx-prom-l">
        {FEATS.map(([t, x], i) => (
          <li key={t}>
            <span className="zx-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h2>{t}</h2>
            <p>{x}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* the rack: four servers of eight GPUs; pools tint the GPUs per specialist; redundancy fills a twin rack across a
   failure domain (its slots wait, ghosted, until then) */
function Rack({ k, plan, q, on, calm }) {
  const one = (twin) => {
    const go = on && (!twin || plan === 2);
    return (
      <div className={'zx-rack' + (twin ? ' twin' : '')} data-go={go || undefined}>
        {[0, 1, 2, 3].map((s) => (
          <div key={s} className="zx-slot">
            <motion.div key={k} className="zx-srv" initial={{ x: 40, opacity: 0 }} animate={go ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }} transition={calm ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: s * 0.1 }}>
              <span className="zx-srv-n">{DGX[k].name}</span>
              <span className="zx-gpus">
                {Array.from({ length: 8 }, (_, g) => <i key={g} data-p={plan >= 1 ? Math.min(2, Math.floor((s * 8 + g) / 11)) : undefined} style={{ transitionDelay: (go && !calm ? 0.3 + s * 0.1 + g * 0.025 : 0) + 's' }} />)}
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

/* the chapters: text steps past a pinned rack; the step in the middle of the screen sets the rack's state */
function Chapters({ k, setK }) {
  const [at, setAt] = useState(0);
  const steps = useRef([]);
  const panel = useRef(null);
  const on = useInView(panel, { once: true, amount: 0.35 });
  const calm = useReducedMotion();
  useEffect(() => {
    // the step in the band where the eye reads: mid-screen on a desktop, under the pinned rack on a phone
    const phone = matchMedia('(max-width: 900px)').matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.step); }), { rootMargin: phone ? '-62% 0px -22% 0px' : '-45% 0px -45% 0px' });
    steps.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);
  const plan = Math.max(0, at - 1);
  const go = (i) => {
    const el = steps.current[i + 1];
    if (!el) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const y = el.getBoundingClientRect().top + scrollY - innerHeight / 2 + el.offsetHeight / 2;
    if (window.__lenis && !calm) window.__lenis.scrollTo(y, { duration: 1.1 }); else scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
    setAt(i + 1);
  };
  return (
    <section className="zx-dep" aria-labelledby="zx-dep-h">
      <div className="zx-w zx-dep-head">
        <p className="zx-kick">Enterprise deployment</p>
        <h2 id="zx-dep-h" className="zx-h2">On your own premises</h2>
      </div>
      <div className="zx-w zx-ch">
        <div className="zx-steps">
          <div className="zx-step" data-step="0" ref={(el) => { steps.current[0] = el; }} data-on={at === 0 || undefined}>
            <p className="zx-lede">What a rack for Zen 6 Max is made of.</p>
            <p className="zx-body">{REC}</p>
            <p className="zx-body zx-four">Four B300 servers hold 9,216 GB of GPU memory; four B200 servers hold 5,760 GB.</p>
          </div>
          {PLAN.map(([t, x], i) => (
            <div key={t} className="zx-step" data-step={i + 1} ref={(el) => { steps.current[i + 1] = el; }} data-on={at === i + 1 || undefined}>
              {i === 0 && <h3 className="zx-kick">Planning range</h3>}
              <h4 className="zx-step-t">{t}</h4>
              <p className="zx-body">{x}</p>
            </div>
          ))}
        </div>
        <div className="zx-pin">
          <div className="zx-panel" ref={panel}>
            <div className="zx-bar">
              <div className="zx-seg" role="radiogroup" aria-label="Server" onKeyDown={arrows}>
                {DGX.map((d, i) => <button key={d.name} type="button" role="radio" aria-checked={k === i} tabIndex={k === i ? 0 : -1} className="zx-chip" onClick={() => setK(i)}>{d.name}</button>)}
              </div>
              <span className="zx-bar-n" aria-hidden="true">{String(at + 1).padStart(2, '0')} / 04</span>
            </div>
            <Rack k={k} plan={plan} q={at === 1} on={on} calm={calm} />
            <div className="zx-foot">
              <p className="zx-total"><Count key={k} to={DGX[k].total} suffix=" GB" className="zx-num" /><span>GPU memory in four {DGX[k].chip} servers</span></p>
              <div className="zx-plan" role="group" aria-label="Planning range">
                {PLAN.map(([t], i) => <button key={t} type="button" aria-pressed={plan === i && at > 0} className="zx-chip sm" onClick={() => go(i)}>{t}</button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the spec sheet, B300 and B200 side by side; picking a column switches the rack above */
function Spec({ k, setK }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="zx-spec" aria-label="DGX B300 and DGX B200">
      <div className="zx-w">
        <div className="zx-sheet" role="table" aria-label="DGX B300 and DGX B200">
          <div className="zx-sheet-r zx-sheet-hd" role="row">
            <span role="columnheader" className="zx-sheet-k"><span className="x-sr">Row</span></span>
            {DGX.map((d, i) => (
              <span key={d.name} role="columnheader">
                <button type="button" className="zx-col" aria-pressed={k === i} onClick={() => setK(i)}><span className="zx-col-n">{d.name}</span></button>
              </span>
            ))}
          </div>
          {DGX[0].rows.map(([label], r) => (
            <div key={label} className="zx-sheet-r" role="row">
              <span role="rowheader" className="zx-sheet-k">{label}</span>
              {DGX.map((d, i) => <span key={d.name} role="cell" data-on={k === i || undefined}>{d.rows[r][1]}</span>)}
            </div>
          ))}
          <div className="zx-sheet-r" role="row">
            <span role="rowheader" className="zx-sheet-k">Four servers</span>
            {DGX.map((d, i) => <span key={d.name} role="cell" className="zx-sheet-big" data-on={k === i || undefined}>{d.total.toLocaleString('en-US')} GB</span>)}
          </div>
          <div className="zx-sheet-r zx-sheet-src" role="row">
            <span role="rowheader" className="zx-sheet-k"><span className="x-sr">Source</span></span>
            {DGX.map((d) => <span key={d.name} role="cell"><More to={d.doc[1]}>{d.doc[0]}</More></span>)}
          </div>
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
    <section className="zx-close" aria-label="Talk to sales">
      <div className="zx-w zx-close-g">
        <div className="zx-close-art" aria-hidden="true"><Sigil seed="zen6-max" data={[9216, 5760, 2304, 1440, 31]} className="zx-sig" /></div>
        <div className="zx-close-t">
          <p className="zx-lede">Final capacity and performance commitments come from qualifying your workload: context length, concurrency, routing mix, latency, and failover.</p>
          <div className="zx-acts"><Magnetic><A to="/contact-sales" className="x-btn solid zx-btn">Talk to sales</A></Magnetic></div>
        </div>
      </div>
    </section>
  );
}

export default function ZenMax() {
  const root = useRef(null);
  const [k, setK] = useState(0);
  useFilms(root);
  return (
    <main className="zx" ref={root}>
      <Stage />
      <Promises />
      <Chapters k={k} setK={setK} />
      <Spec k={k} setK={setK} />
      <Close />
    </main>
  );
}
