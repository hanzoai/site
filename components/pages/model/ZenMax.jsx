'use client';
/* Zen 6 Max. A dark film band for the name, four promises that each move, then the rack.
   Signature: the rack fills itself. Four 8-GPU servers slide in, their GPUs light, and the GPU memory counts up to
   Hanzo's own total (9,216 GB for B300, 5,760 GB for B200); switch the server and the rack reloads.
   Beyond: the planning range, played on the rack: the qualification starts at four servers, isolated production
   pools split the GPUs into one pool per specialist, redundant pools add a second replica across a failure domain. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Count } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import { media } from '../../../lib/models';
import { useFilms, arrows } from './live';
import './Model.css';
import './ZenMax.css';

const FEATS = [['One name', 'You call Zen 6 Max. One model, one API, one bill.'], ['Right-sized per request', 'Each request runs on the configuration built for that kind of work.'], ['Long context', 'Long context for large codebases and long documents.'], ['Tools and code', 'Tool calls and code generation, built in.']];
const DGX = [
  { name: 'DGX B300', total: 9216, rows: [['GPUs', '8 x B300'], ['GPU memory', '8 x 288 GB, 2,304 GB'], ['Cluster network', '8 x 800 Gb/s InfiniBand or Ethernet'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B300 user guide: 8 x 288 GB GPU memory', 'https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html'] },
  { name: 'DGX B200', total: 5760, rows: [['GPUs', '8 x B200'], ['GPU memory', '1,440 GB'], ['Cluster network', '8 x ConnectX-7, up to 400 Gb/s'], ['Data cache', '8 x 3.84 TB']], doc: ['NVIDIA DGX B200 user guide: 1,440 GB total GPU memory', 'https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html'] },
];
const PLAN = [['Qualification', 'Four 8-GPU servers is where a qualification starts.'], ['Isolated production pools', 'One pool for each specialist, so a busy class of work never takes memory from another.'], ['Redundant pools', 'Two independent replicas of those pools across failure domains.']];
const AROUND = ['NVLink and NVSwitch inside each server.', '400 or 800 Gb/s RDMA wherever a specialist spans servers.', 'About 31 TB of NVMe in each server (8 x 3.84 TB).', 'Separate sandbox workers for coding agents.', 'A high-availability control cluster.'];

function Rack({ k, plan, on }) {
  // a rack of four servers; with pools, the GPUs split into groups; with redundancy, a twin rack across the line
  const one = (twin) => (
    <div className={'zx-rack' + (twin ? ' twin' : '')}>
      {[0, 1, 2, 3].map((s) => (
        <motion.div key={s + '-' + k} className="zx-srv" initial={{ x: 60, opacity: 0 }} animate={on ? { x: 0, opacity: 1 } : {}} transition={{ duration: 0.7, ease: EASE, delay: (twin ? 0.3 : 0) + s * 0.22 }}>
          <span className="zx-srv-n">{DGX[k].name}</span>
          <span className="zx-gpus" data-pools={plan >= 1 ? '' : undefined}>
            {Array.from({ length: 8 }, (_, g) => <motion.i key={g} initial={{ opacity: 0.15 }} animate={on ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: (twin ? 0.3 : 0) + s * 0.22 + 0.4 + g * 0.04 }} data-p={plan >= 1 ? Math.min(2, Math.floor((s * 8 + g) / 11)) : undefined} />)}
          </span>
        </motion.div>
      ))}
    </div>
  );
  return (
    <div className="zx-racks" data-plan={plan}>
      {one(false)}
      <span className="zx-domain" aria-hidden="true" />
      {plan === 2 && one(true)}
    </div>
  );
}

function Deploy() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const live = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [k, setK] = useState(0);
  const [plan, setPlan] = useState(0);
  const [mine, setMine] = useState(false);
  const step = useRef(0);
  useEffect(() => {
    if (!live || mine || calm) return;
    const t = setInterval(() => { step.current = (step.current + 1) % 3; setPlan(step.current); if (!step.current) setK((x) => 1 - x); }, 3600);
    return () => clearInterval(t);
  }, [live, mine, calm]);
  return (
    <section className="zx-dep mb-sec" ref={box} aria-labelledby="zx-dep-h">
      <div className="x-wrap">
        <div className="zx-dep-head">
          <p className="mb-kick">Enterprise deployment</p>
          <h2 id="zx-dep-h" className="mb-h2">On your own premises</h2>
          <p className="mb-lede">What a rack for Zen 6 Max is made of.</p>
          <p className="zx-rec">We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises. Routing cuts the average inference work a request needs. It does not cut the memory needed to keep every specialist ready.</p>
        </div>
        <div className="zx-bay">
          <div className="zx-bay-l">
            <Rack k={k} plan={plan} on={seen} />
            <p className="zx-total"><Count key={k} to={DGX[k].total} suffix=" GB" run={seen} className="mb-tnum" /><span>GPU memory in four {DGX[k].name.replace('DGX ', '')} servers</span></p>
            <p className="zx-four">Four B300 servers hold 9,216 GB of GPU memory; four B200 servers hold 5,760 GB.</p>
          </div>
          <div className="zx-bay-r">
            <div className="zx-tabs" role="tablist" aria-label="Server" onKeyDown={arrows}>
              {DGX.map((d, i) => <button key={d.name} type="button" role="tab" id={'zx-t' + i} aria-selected={k === i} aria-controls={'zx-p' + i} className="zx-tab" onClick={() => { setK(i); setMine(true); }}>{d.name}</button>)}
            </div>
            {DGX.map((d, i) => (
              <div key={d.name} id={'zx-p' + i} role="tabpanel" aria-labelledby={'zx-t' + i} hidden={k !== i} className="zx-spec">
                <h3>{d.name}</h3>
                <dl>{d.rows.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
                <More to={d.doc[1]}>{d.doc[0]}</More>
              </div>
            ))}
            <h3 className="zx-plan-h">Planning range</h3>
            <ol className="zx-plan">
              {PLAN.map(([t, x], i) => (
                <li key={t}>
                  <button type="button" aria-pressed={plan === i} className="zx-step" onClick={() => { setPlan(i); setMine(true); }}>
                    <b>{t}</b><span>{x}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ZenMax() {
  const root = useRef(null);
  useFilms(root);
  return (
    <main className="zx" ref={root}>
      <section className="zx-hero" data-room="dark" aria-labelledby="zx-h">
        <video className="zx-film" src={media('zen', 'webm')} poster={media('zen', 'webp')} autoPlay muted loop playsInline aria-hidden="true" />
        <div className="x-wrap zx-hero-in">
          <p className="mb-kick"><A to="/zen">Zen</A></p>
          <h1 id="zx-h" className="zx-name" data-morph-target>Zen 6 Max</h1>
          <p className="zx-sub">Zen 6 Max. Built for the hardest work: deep reasoning, long context, and code.</p>
          <div className="mb-acts">
            <A to="/contact-sales" className="x-btn solid" data-thumb="Talk to sales">Talk to sales</A>
            <A to="/enterprise" className="x-btn">Run it on your own GPUs</A>
          </div>
        </div>
      </section>
      <section className="zx-feats mb-sec" aria-label="What Zen 6 Max is">
        <ul className="x-wrap">
          {FEATS.map(([t, x], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}>
              <span className={'zx-g zx-g' + i} aria-hidden="true"><i /><i /><i /></span>
              <h3>{t}</h3>
              <p>{x}</p>
            </motion.li>
          ))}
        </ul>
      </section>
      <Deploy />
      <section className="zx-around mb-sec" aria-labelledby="zx-ar-h">
        <div className="x-wrap zx-around-in">
          <div>
            <h3 id="zx-ar-h" className="mb-h2">Around the servers</h3>
            <ul className="zx-list">{AROUND.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="zx-close">
            <Sigil seed="zen6-max" data={[9216, 5760, 2304, 1440, 31]} className="zx-sig" />
            <p>Final capacity and performance commitments come from qualifying your workload: context length, concurrency, routing mix, latency, and failover.</p>
            <A to="/contact-sales" className="x-btn solid">Talk to sales</A>
          </div>
        </div>
      </section>
    </main>
  );
}
