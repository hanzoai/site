'use client';
/* Object Storage. Signature: an object, kept. An object drops in, breaks into ten data shards and four parity shards
   that fly to fourteen volume servers; four volumes then go dark, any four, and the object still reads. Below, the four
   facts behind it play as a slideshow (01 / 04) whose picture is the part being described: the four roles of the one
   binary, the key minted by KMS, the shards, the one protocol. Every word and link is Hanzo's.
   Beyond: lose four yourself. Tap any volumes to take them dark, up to the four Hanzo says can be lost; the object keeps
   reading whichever four you choose, and Replay hands the loop back. */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE } from '../../ui';
import { Hero, Paste, Get, useLive, useSteps } from './Frame';
import './S3.css';

const N = 14; // ten data shards, four parity
const hash = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

function Shard({ i }) {
  return <motion.i layoutId={'s3-' + i} className={'s3-shard' + (i >= 10 ? ' p' : '')} transition={{ type: 'spring', stiffness: 160, damping: 22, delay: (i % 7) * 0.03 }} />;
}

function Kept() {
  const [ref, live, calm] = useLive(0.3);
  const [phase, setPhase] = useState(0); // 0 object, 1 sharded, 2 four lost, 3 still reads
  const [cycle, setCycle] = useState(0);
  const [pick, setPick] = useState(null); // the volumes you took dark by hand; null = the loop chooses
  useEffect(() => {
    if (calm) { setPhase(3); return; }
    if (!live || pick) return;
    const t = setTimeout(() => {
      if (phase === 3) { setPhase(0); setCycle((c) => c + 1); } else setPhase(phase + 1);
    }, [1300, 1700, 1500, 2400][phase]);
    return () => clearTimeout(t);
  }, [phase, live, calm, pick]);
  // any four volumes: the four lowest of a per-cycle hash (no loop that could fail to finish)
  const auto = useMemo(() => new Set(Array.from({ length: N }, (_, i) => i).sort((a, b) => hash(a + cycle * N) - hash(b + cycle * N)).slice(0, 4)), [cycle]);
  const lost = pick || auto;
  const toggle = (i) => {
    const next = new Set(pick || []);
    if (next.has(i)) next.delete(i); else if (next.size < 4) next.add(i);
    setPick(next);
    setPhase(next.size ? 3 : 1);
  };
  return (
    <div className="s3-kept" ref={ref}>
      <LayoutGroup>
        <div className="s3-obj" aria-hidden="true">
          <p className="s3-k">object</p>
          <div className="s3-file">
            {phase === 0 && Array.from({ length: N }).map((_, i) => <Shard key={i} i={i} />)}
          </div>
          <AnimatePresence>
            {phase === 3 && <motion.p className="s3-read" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>✓ still reads</motion.p>}
          </AnimatePresence>
        </div>
        <svg className="s3-fan" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: N }).map((_, i) => <path key={i} d={`M0 50 C 50 50, 50 ${(i % 7) * 15 + (i < 7 ? 4 : 16)}, 100 ${(i % 7) * 15 + (i < 7 ? 4 : 16)}`} className={phase >= 1 && !(phase >= 2 && lost.has(i)) ? 'on' : ''} />)}
        </svg>
        <div className="s3-vols" role="group" aria-label="Volume servers: take up to four dark">
          {Array.from({ length: N }).map((_, i) => {
            const gone = phase >= 2 && lost.has(i);
            const name = i < 10 ? 'd' + (i + 1) : 'p' + (i - 9);
            return (
              <button type="button" key={i} className={'s3-vol' + (gone ? ' gone' : '') + (i >= 10 ? ' par' : '')} aria-pressed={!!pick && pick.has(i)} aria-label={'Volume ' + name} disabled={!!pick && pick.size >= 4 && !pick.has(i)} onClick={() => toggle(i)}>
                <span aria-hidden="true">{name}</span>
                {phase >= 1 && !gone && <Shard i={i} />}
                {gone && <motion.b aria-hidden="true" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>×</motion.b>}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <div className="s3-legend">
        <span><i />ten data shards</span><span><i className="p" />four parity</span><span><i className="x" />four can be lost</span>
        <span className="s3-mine" aria-live="polite">{pick ? pick.size + ' / 4 dark · still reads' : 'tap any four'}</span>
        {pick && <button type="button" className="s3-again" onClick={() => { setPick(null); setPhase(0); setCycle((c) => c + 1); }}>Replay</button>}
      </div>
    </div>
  );
}

const SLIDES = [
  ['One binary, four roles', 'One binary in four roles: a master that tracks where everything is, volume servers that hold the bytes, a filer for the namespace and the HTTP gateway your code talks to.'],
  ['Keys from KMS', 'Server-side encryption whose keys are minted by Hanzo KMS rather than read out of a config file.'],
  ['Ten data shards, four parity', 'Objects are erasure-coded across ten data shards and four parity shards, so four can be lost and the object still reads.'],
  ['One protocol', 'Every call between the pieces speaks one binary protocol, with no gRPC anywhere: one transport to secure and one to debug.'],
];

function Pic({ i }) {
  if (i === 0) return <div className="s3-roles">{['master', 'volume servers', 'filer', 'HTTP gateway'].map((r, k) => <motion.span key={r} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + k * 0.1, duration: 0.5, ease: EASE }}>{r}</motion.span>)}<b>one binary</b></div>;
  if (i === 1) return <div className="s3-key"><motion.span className="s3-key-k" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo KMS</motion.span><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6, ease: EASE }} /><motion.span className="s3-key-o" initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>server-side encryption</motion.span></div>;
  if (i === 2) return <div className="s3-grid14">{Array.from({ length: 14 }).map((_, k) => <motion.i key={k} className={k >= 10 ? 'p' : ''} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: k * 0.04, type: 'spring', stiffness: 380, damping: 22 }} />)}</div>;
  return <div className="s3-proto">{[0, 1, 2].map((k) => <span key={k}><b /><i style={{ animationDelay: k * 0.4 + 's' }} /><b /></span>)}<em>one binary protocol</em></div>;
}

function Slides() {
  const [ref, live] = useLive(0.4);
  const [at, choose, mine] = useSteps(4, 5600, live);
  return (
    <section className="x-sec s3-slides" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <div className="s3-sl-top">
          <h2>An object, kept</h2>
          <div className="s3-nav">
            <span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span>
            <button type="button" aria-label="Previous" onClick={() => choose((at + 3) % 4)}>←</button>
            <button type="button" aria-label="Next" onClick={() => choose((at + 1) % 4)}>→</button>
          </div>
        </div>
        <div className="s3-sl">
          <div className="s3-pic" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={at} className="s3-pic-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}><Pic i={at} /></motion.div>
            </AnimatePresence>
          </div>
          <ol className="s3-list">
            {SLIDES.map(([t, d], i) => (
              <li key={t} className={at === i ? 'on' : ''}>
                <button type="button" onClick={() => choose(i)} aria-pressed={at === i}>
                  <span className="s3-n">{String(i + 1).padStart(2, '0')} / 04</span>
                  <span className="s3-t">{t}</span>
                  {at === i && !mine && <motion.i key={'t' + at} className="s3-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.6, ease: 'linear' }} />}
                </button>
              </li>
            ))}
          </ol>
          <div className="s3-desc" aria-live="polite">
            {SLIDES.map(([t, d], i) => <p key={t} className={at === i ? 'on' : ''} aria-hidden={at !== i}>{d}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function S3() {
  return (
    <main className="s3">
      <Hero
        look="stack"
        kick="Storage"
        title="Hanzo Object Storage"
        lede="Buckets and objects, presigned links, multipart uploads, versioning and object lock."
        acts={[['API reference', 'https://docs.hanzo.ai/docs/openapi/s3'], ['Source', 'https://github.com/hanzoai/s3']]}
      >
        <Kept />
      </Hero>
      <Slides />
      <section className="x-sec s3-paste">
        <div className="x-wrap"><Paste name="Object Storage" api="/v1/s3/buckets" prompt="Read https://hanzo.ai/skill.md and use Hanzo Object Storage in my project. Start with: hanzo s3 buckets list" /></div>
      </section>
      <Get name="Object Storage" tag="Distributed object storage" repo={['hanzoai/s3', 'https://github.com/hanzoai/s3']} stars="4 stars" />
    </main>
  );
}
