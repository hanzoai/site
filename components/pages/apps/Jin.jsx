'use client';
/* Jin. Signature: Figure 1, a saccade that checks itself. Laid out like a paper: the image jitters, the predictor guesses
   where its embedding will move, the image shifts back and the embedding has to land where it started; the three
   losses (Huber, cycle-consistency, VICReg) lean with each phase. It runs by itself.
   Beyond: "Make the saccade yourself". Drag the image: the predicted embedding follows your shift live, and when you let
   go it shifts back and shows the round trip it has to close. Built from Hanzo's own description of Saccade JEPA.
   Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Paste, Get, useLive, useSteps } from '../cloud/Frame';
import './Jin.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const PHASE = ['image at rest', 'shift the image', 'predict how its embedding moves', 'shift back', 'check it lands where it started'];
const SHIFTS = [[18, -10], [-16, 12], [10, 16], [-14, -14]];

function Figure() {
  const [ref, live, calm] = useLive(0.3);
  const dx = useMotionValue(0), dy = useMotionValue(0);
  const [ph, setPh] = useState(0);
  const [k, setK] = useState(0);
  const [held, setHeld] = useState(false);
  // the embedding moves with the shift through a fixed linear map (an illustration of a learned one)
  const ex = useTransform([dx, dy], ([x, y]) => x * 1.6 + y * 0.6);
  const ey = useTransform([dx, dy], ([x, y]) => y * 1.4 - x * 0.5);
  useEffect(() => {
    if (!live || held || calm) return;
    const [sx, sy] = SHIFTS[k % SHIFTS.length];
    const steps = [
      () => { setPh(1); animate(dx, sx, { duration: 0.5, ease: EASE }); animate(dy, sy, { duration: 0.5, ease: EASE }); },
      () => setPh(2),
      () => { setPh(3); animate(dx, 0, { duration: 0.6, ease: EASE }); animate(dy, 0, { duration: 0.6, ease: EASE }); },
      () => setPh(4),
      () => { setPh(0); setK((v) => v + 1); },
    ];
    const ts = steps.map((f, i) => setTimeout(f, 700 + i * 900));
    return () => ts.forEach(clearTimeout);
  }, [k, live, held, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const grab = () => { setHeld(true); setPh(1); };
  const drop = () => { setPh(3); animate(dx, 0, { duration: 0.6, ease: EASE }); animate(dy, 0, { duration: 0.6, ease: EASE, onComplete: () => { setPh(4); setTimeout(() => { setHeld(false); setPh(0); }, 1400); } }); };
  const bars = [[0.3, 0.75, 0.6, 0.4, 0.2], [0.15, 0.3, 0.35, 0.7, 0.4], [0.5, 0.45, 0.45, 0.45, 0.5]];
  return (
    <figure className="jn-fig" ref={ref}>
      <div className="jn-panels">
        <div className="jn-pane">
          <p className="jn-pk x-mono">a · input</p>
          <div className="jn-img-box" data-cursor="Drag">
            <motion.img src="/models/kai.webp" alt="An image the model shifts and shifts back" style={{ x: dx, y: dy }} drag dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }} dragElastic={0.15} dragMomentum={false} onDragStart={grab} onDragEnd={drop} draggable={false} />
            <i className="jn-cross" aria-hidden="true" />
          </div>
        </div>
        <div className="jn-pane">
          <p className="jn-pk x-mono">b · embedding</p>
          <div className="jn-space" aria-hidden="true">
            <i className="jn-axis x" /><i className="jn-axis y" />
            <span className="jn-z0" />
            <motion.span className={'jn-pred' + (ph === 2 || ph === 1 ? ' on' : '')} style={{ x: ex, y: ey }} />
            <motion.span className="jn-z" style={{ x: ex, y: ey }} />
            {ph === 4 && <motion.span className="jn-ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} />}
          </div>
        </div>
        <div className="jn-pane">
          <p className="jn-pk x-mono">c · losses</p>
          <div className="jn-bars" aria-hidden="true">
            {['Huber', 'cycle', 'VICReg'].map((t, i) => (
              <div key={t}><motion.i animate={{ scaleY: bars[i][ph] }} transition={{ type: 'spring', stiffness: 160, damping: 20 }} /><span className="x-mono">{t}</span></div>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        <b>Figure 1.</b> Saccade JEPA, step by step: <span className="jn-phase x-mono">{PHASE[ph]}</span>. Drag the image to make the saccade yourself.
      </figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className="jn-hero" aria-labelledby="jn-h1">
      <div className="x-wrap">
        <div className="jn-head">
          <motion.p className="jn-kick x-mono" {...up(0)}>hanzoai/jin</motion.p>
          <h1 id="jn-h1" className="jn-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Jin</motion.span></span></h1>
          <motion.p className="jn-lede" {...up(0.3)}>Research on learning without labels</motion.p>
          <motion.div className="jn-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://docs.hanzo.ai" className="x-btn solid" data-thumb>Read the docs</A></motion.span>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></motion.span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}><Figure /></motion.div>
      </div>
    </section>
  );
}

const ITEMS = [
  ['I-JEPA', 'A clean implementation of the image variant: a context encoder, a target encoder that is its moving average, and a predictor that has to guess the target embeddings. Both a ViT and an energy-transformer backbone.'],
  ['Saccade JEPA', 'Ours. Eyes jitter constantly and the brain predicts what the jitter will do to the scene, so the model shifts an image, predicts how its embedding moves, and shifts back to check it lands where it started.'],
  ['Three losses at once', 'Huber loss on the prediction, a cycle-consistency term that punishes drift on the round trip, and the invariance and covariance parts of VICReg to stop the representation collapsing.'],
  ['Masked autoencoding', 'An MAE with self-distillation sits alongside, for the comparison that matters: is a decoder worth its parameters when the goal is a good representation rather than a good reconstruction?'],
  ['Ways to see what it learned', 'Self-supervised training has no validation loss to watch, so there are linear probes, KNN, attention-map visualisation in a Dash dashboard, correlation dimension, and UMAP coloured by true class.'],
  ['The papers', 'Grant proposals on hierarchical JEPA for edge AI, where the interesting constraint is learning useful representations on hardware that cannot phone home.'],
];

/* The repository as a paper's sections, read in two columns; the one being read is marked in the margin. */
function Repo() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(6, 3400, live);
  return (
    <section className="x-sec jn-repo" ref={ref}>
      <div className="x-wrap">
        <p className="jn-repo-k"><span>What is in the repository</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
        <ol className="jn-secs">
          {ITEMS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''} onMouseEnter={() => choose(i)}>
              <button type="button" aria-pressed={at === i} onClick={() => choose(i)}><span className="x-mono">§{i + 1}</span><h2>{t}</h2></button>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
        <Rise as="table" className="jn-table">
          <caption className="x-mono">Table 1</caption>
          <tbody>
            {[['I-JEPA', 'Reference build'], ['Saccade', 'Our own variant'], ['MAE', 'Self-distilled'], ['Papers', 'Edge AI proposals']].map(([a, b]) => <tr key={a}><th>{a}</th><td>{b}</td></tr>)}
          </tbody>
        </Rise>
      </div>
    </section>
  );
}

export default function Jin() {
  return (
    <main className="jn">
      <Hero />
      <Repo />
      <section className="x-sec jn-code" data-room="dark">
        <div className="x-wrap jn-code-grid">
          <Paste name="Jin" prompt="Read https://hanzo.ai/skill.md and use Hanzo Jin in my project." dark />
          <div className="jn-read">
            <Rise as="h2" y={20}>Read the code</Rise>
            <Rise className="jn-acts" delay={0.1}><A to="https://docs.hanzo.ai" className="x-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></Rise>
          </div>
        </div>
      </section>
      <Get name="Jin" tag="Multimodal foundation model" />
    </main>
  );
}
