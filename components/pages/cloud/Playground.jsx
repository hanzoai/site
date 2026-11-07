'use client';
/* Playground. Signature: the playground itself, running. Eight kinds of run (chat to vision) take turns in one window,
   each drawing its own kind of answer (bubbles stream, an image develops, a waveform plays, a box finds its object),
   with the run's tokens and cost counting beside it; click a kind to hold it. Below, the sentence "a key, a model name,
   and a message" points at each part inside the real curl request. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { Hero, Paste, Code, Related, Get, useLive, useSteps } from './Frame';
import './Playground.css';

const MODES = ['Chat', 'Completions', 'Decisions', 'Embeddings', 'Image', 'Video', 'Audio', 'Vision'];
// demo run sizes for the meter: [tokens in, tokens out, seconds]
const RUN = [[9, 48, 1.2], [14, 96, 1.9], [22, 3, 0.4], [11, 0, 0.2], [18, 0, 6.4], [21, 0, 14.8], [16, 0, 3.1], [24, 37, 1.6]];
const rnd = (i) => { const x = Math.sin(i * 91.7) * 43758.5453; return x - Math.floor(x); };

function Chat() {
  return (
    <div className="pg-chat">
      <motion.p className="pg-bub me" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>Hello</motion.p>
      <motion.div className="pg-bub ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
        {[94, 82, 88, 70, 46].map((w, i) => (
          <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.32 }} />
        ))}
      </motion.div>
    </div>
  );
}

function Completions() {
  const rows = [[100, 1], [100, 1], [64, 1], [100, 0], [100, 0], [92, 0], [100, 0], [48, 0]];
  return (
    <div className="pg-comp">
      {rows.map(([w, given], i) => (
        <motion.i key={i} className={given ? 'given' : ''} style={{ width: w + '%' }} initial={{ scaleX: given ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, ease: 'linear', delay: given ? 0 : 0.3 + (i - 3) * 0.45 }} />
      ))}
      <b className="pg-caret" />
    </div>
  );
}

function Decisions() {
  return (
    <svg className="pg-tree" viewBox="0 0 320 200" aria-hidden="true">
      <motion.path d="M160 40 C160 90 80 90 80 150" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
      <motion.path d="M160 40 C160 90 240 90 240 150" className="on" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
      <circle cx="160" cy="34" r="12" className="root" />
      <motion.circle cx="80" cy="158" r="12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 18 }} />
      <motion.circle cx="240" cy="158" r="12" className="pick" initial={{ scale: 0 }} animate={{ scale: [0, 1.25, 1] }} transition={{ delay: 1.1, duration: 0.6 }} />
      <circle cx="240" cy="158" r="22" className="ring" />
    </svg>
  );
}

function Embeddings() {
  const hubs = [[70, 60], [220, 70], [150, 150]];
  return (
    <svg className="pg-emb" viewBox="0 0 300 200" aria-hidden="true">
      {Array.from({ length: 42 }).map((_, i) => {
        const h = hubs[i % 3];
        const tx = h[0] + (rnd(i) - 0.5) * 60, ty = h[1] + (rnd(i + 50) - 0.5) * 44;
        return <motion.circle key={i} r="4" className={'c' + (i % 3)} initial={{ cx: rnd(i + 9) * 300, cy: rnd(i + 99) * 200, opacity: 0 }} animate={{ cx: tx, cy: ty, opacity: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 + (i % 14) * 0.03 }} />;
      })}
    </svg>
  );
}

function Image() {
  return (
    <div className="pg-img">
      <img src="/models/iro.webp" alt="" />
      <div className="pg-tiles">
        {Array.from({ length: 60 }).map((_, i) => <motion.i key={i} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.2 + rnd(i) * 2.2 }} />)}
      </div>
    </div>
  );
}

function Video() {
  return (
    <div className="pg-vid">
      <div className="pg-strip">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <img key={i} src="/models/koma.webp" alt="" style={{ objectPosition: `${(i % 4) * 33}% 50%` }} />)}</div>
      <i className="pg-head" />
    </div>
  );
}

function Audio() {
  return (
    <div className="pg-wave">
      {Array.from({ length: 56 }).map((_, i) => <i key={i} style={{ animationDelay: `${-rnd(i) * 1.2}s`, height: `${24 + rnd(i + 3) * 76}%` }} />)}
    </div>
  );
}

function Vision() {
  return (
    <div className="pg-vis">
      <img src="/models/kai.webp" alt="" />
      <motion.i className="pg-box" initial={{ left: '8%', top: '10%', width: '80%', height: '78%', opacity: 0 }} animate={{ left: '30%', top: '18%', width: '38%', height: '56%', opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>found</motion.span>
      </motion.i>
    </div>
  );
}

const CANVAS = [Chat, Completions, Decisions, Embeddings, Image, Video, Audio, Vision];

/* Numbers that count to their value each time the run changes. */
function Tally({ to, k, dec = 0, suffix = '' }) {
  const v = useMotionValue(0);
  const t = useTransform(v, (x) => x.toFixed(dec) + suffix);
  useEffect(() => { v.set(0); const c = animate(v, to, { duration: 1.6, ease: EASE, delay: 0.4 }); return () => c.stop(); }, [k, to, v]);
  return <motion.span>{t}</motion.span>;
}

function Window() {
  const [ref, live] = useLive(0.3);
  const [at, choose, mine] = useSteps(MODES.length, 3600, live);
  const Canvas = CANVAS[at];
  const [tin, tout, secs] = RUN[at];
  return (
    <div className="pg-win" ref={ref}>
      <div className="pg-bar"><i /><i /><i /><span>Playground</span><b>zen</b></div>
      <div className="pg-modes" role="tablist" aria-label="Kind of run">
        {MODES.map((m, i) => (
          <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
            {at === i && <motion.span layoutId="pg-mode" className="pg-mode-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{m}</span>
            {at === i && !mine && <motion.em key={at} className="pg-mode-t" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.6, ease: 'linear' }} />}
          </button>
        ))}
      </div>
      <div className="pg-body">
        <div className="pg-canvas" aria-hidden="true">
          <div className="pg-stagebox">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={at} className="pg-cv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }} transition={{ duration: 0.35, ease: EASE }}>
                <Canvas />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="pg-input"><span>Hello</span><b><svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
        </div>
        <aside className="pg-run" aria-label="This run">
          <p className="pg-run-k">Run</p>
          <dl>
            <div><dt>Model</dt><dd>zen</dd></div>
            <div><dt>Tokens in</dt><dd><Tally to={tin} k={at} /></dd></div>
            <div><dt>Tokens out</dt><dd><Tally to={tout} k={at} /></dd></div>
            <div><dt>Time</dt><dd><Tally to={secs} k={at} dec={1} suffix=" s" /></dd></div>
          </dl>
          <p className="pg-run-k">Cost</p>
          <i className="pg-cost"><motion.b key={at} initial={{ scaleX: 0 }} animate={{ scaleX: Math.min(1, (tin + tout + secs * 6) / 120) }} transition={{ duration: 1.6, ease: EASE, delay: 0.4 }} /></i>
        </aside>
      </div>
    </div>
  );
}

const CURL = `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -d '{"model":"zen","messages":[{"role":"user","content":"Hello"}]}'`;
const PY = `pip install hanzoai

import os
from hanzoai.cloud import ApiClient, Configuration, KeysApi

api = ApiClient(Configuration(
    host="https://api.hanzo.ai",
    access_token=os.environ["HANZO_API_KEY"],
))
print(KeysApi(api).get_keys().keys)`;

const PARTS = [['A key', 'HANZO_API_KEY'], ['a model name', '"zen"'], ['a message', '"Hello"']];

function FromCode() {
  const [ref, live] = useLive(0.4);
  const [at, choose] = useSteps(PARTS.length, 2200, live);
  return (
    <section className="x-sec pg-code" ref={ref}>
      <div className="x-wrap pg-code-grid">
        <div className="pg-code-copy">
          <p className="x-kick">curl · python</p>
          <h2>Then the same request from code</h2>
          <p className="pg-anat">
            {PARTS.map(([t], i) => (
              <span key={t}>
                <button type="button" className={at === i ? 'on' : ''} onMouseEnter={() => choose(i)} onFocus={() => choose(i)} onClick={() => choose(i)} aria-pressed={at === i}>{t}</button>
                {i === 0 ? ', ' : i === 1 ? ', and ' : ' '}
              </span>
            ))}
            is the whole first request.
          </p>
        </div>
        <Code title="Request" mark={PARTS[at][1]} tabs={[{ k: 'curl', label: 'One request', code: CURL }, { k: 'python', label: 'The Python client', code: PY, lang: 'python' }]} />
      </div>
    </section>
  );
}

export default function Playground() {
  return (
    <main className="pg">
      <Hero
        look="stack"
        kick="Playground"
        title="Try a model, then ship it"
        lede="Chat, completions, decisions, embeddings, image, video, audio and vision, against every model in the catalog, with each run's tokens and cost beside the answer."
        acts={[['Open the Playground', 'https://platform.hanzo.ai/playground'], ['Read the API', '/api']]}
      >
        <Window />
      </Hero>
      <FromCode />
      <section className="x-sec pg-paste" data-room="dark">
        <div className="x-wrap"><Paste dark name="Playground" api="/v1/chat/completions" prompt="Read https://hanzo.ai/skill.md and use Hanzo Playground in my project." /></div>
      </section>
      <section className="pg-rel">
        <div className="x-wrap"><Related items={[['CLI', '/cli'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']]} /></div>
      </section>
      <Get name="Playground" tag="Hands-on sandbox for every product" />
    </main>
  );
}
