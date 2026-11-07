'use client';
/* Engine. Signature: one binary, three verbs, and the card kept busy. The hero is the engine's own terminal: run
   streams tokens, serve shows continuous batching (requests of different lengths join and leave the batch while the
   card's utilisation stays full), bench draws the measurement of the very thing being served. The six things it does
   are a deck of cards that stack on each other as you scroll. Beyond: "Write the command" - choose the verb, name a
   Hugging Face model and whether you want the built-in UI, and the one line to run is written for you to copy, with
   Hanzo's sentence on what it does. Every word and link is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Copy } from '../../ui';
import { Hero, Paste, Get, useLive, useSteps, useFrame } from './Frame';
import './Engine.css';

const VERBS = ['run', 'serve', 'bench'];

function Run() {
  return (
    <div className="en-run">
      <p className="en-p"><span>&gt;</span> <i className="en-cursor" /></p>
      <div className="en-toks">{Array.from({ length: 64 }).map((_, i) => <i key={i} style={{ animationDelay: 0.25 + i * 0.045 + 's', width: 14 + ((i * 37) % 30) + 'px' }} />)}</div>
    </div>
  );
}

/* Continuous batching: eight slots; a request occupies a slot for its own length, and a new one takes it at once. */
function Serve({ live }) {
  const ref = useRef(null);
  const slots = useRef(Array.from({ length: 8 }, (_, i) => ({ left: 0.3 + i * 0.37, len: 1.4 + ((i * 7) % 5) * 0.5 })));
  useFrame(live, (t, dt) => {
    const el = ref.current;
    if (!el) return;
    slots.current.forEach((s, i) => {
      s.left -= dt;
      if (s.left <= 0) { s.len = 1.2 + Math.random() * 2.8; s.left = s.len; }
      const bar = el.children[i]?.firstChild;
      if (bar) bar.style.transform = `scaleX(${Math.max(0, s.left / s.len)})`;
    });
  });
  return (
    <div className="en-serve">
      <div className="en-slots" ref={ref}>{Array.from({ length: 8 }).map((_, i) => <div key={i} className="en-slot"><b /><span>req</span></div>)}</div>
      <div className="en-util"><span>card</span><i><b /></i><em>busy</em></div>
    </div>
  );
}

function Bench() {
  const bars = [62, 74, 81, 88, 92, 95, 97];
  return (
    <div className="en-bench">
      {bars.map((h, i) => <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: h / 100 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 }} />)}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>the thing you benchmarked is the thing you shipped</motion.p>
    </div>
  );
}

function Term() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(3, 4200, live);
  return (
    <div className="en-term" ref={ref}>
      <div className="en-bar">
        <i /><i /><i />
        <div className="en-verbs" role="tablist" aria-label="Verbs">
          {VERBS.map((v, i) => (
            <button key={v} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
              {at === i && <motion.span layoutId="en-verb" className="en-verb-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="en-cmd"><span>$</span> hanzo engine {VERBS[at]} &lt;model&gt;</p>
      <div className="en-out" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="en-pane" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }} transition={{ duration: 0.35, ease: EASE }}>
            {at === 0 ? <Run /> : at === 1 ? <Serve live={live} /> : <Bench />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="en-hw" aria-hidden="true">{['CUDA', 'Metal', 'CPU'].map((h) => <span key={h}>{h}</span>)}</div>
    </div>
  );
}

const DECK = [
  ['run, serve, bench', 'One binary, three verbs. Chat with a model, put it behind an HTTP API, or measure it — the thing you benchmarked is the thing you shipped.'],
  ['Built to serve, not just to run', 'Paged attention and continuous batching keep the card busy across concurrent requests. A disk-first KV cache carries a session across a restart, so an agent that reuses a long prefix does not pay for it twice.'],
  ['More than text', 'Vision, audio, speech, image and embeddings go through the same modality pipeline as generation, in the same process. A multimodal app is one deployment, not four.'],
  ['It quantizes on the way in', "In-situ quantization of any Hugging Face model, plus GGUF from 2 to 8 bits, GPTQ, AWQ, HQQ, FP8 and bitsandbytes. Ask for a level and it takes a published prebuilt when one exists, or makes one when it doesn't."],
  ['The silicon you have', 'CUDA with FlashAttention and multi-GPU tensor parallelism, Metal on Apple Silicon, or plain CPU. Same engine and same commands on each, and a doctor command that reports what it found.'],
  ['Tools, and a UI to watch them', 'It can call MCP servers over a process, HTTP or a WebSocket. The built-in UI at /ui shows reasoning, code execution and plots inline, and edits branch a conversation with its own state. Pass --no-ui and it is a plain API server.'],
];

/* Six cards that stick and stack: each new one slides over the last as you scroll. */
function Deck() {
  return (
    <section className="x-sec en-deck">
      <div className="x-wrap en-deck-grid">
        <div className="en-deck-h">
          <Rise as="h2">One process, laptop to GPU cluster</Rise>
        </div>
        <ol className="en-stack">
          {DECK.map(([t, d], i) => (
            <li key={t} className="en-card" style={{ top: 120 + i * 18 + 'px', zIndex: i + 1 }}>
              <p className="en-card-n">{String(i + 1).padStart(2, '0')} / 06</p>
              <h3>{t}</h3>
              <p className="en-card-d">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SAY = {
  run: 'Chat with a model.',
  serve: 'Put it behind an HTTP API. The built-in UI at /ui shows reasoning, code execution and plots inline.',
  'serve --no-ui': 'Pass --no-ui and it is a plain API server.',
  bench: 'Measure it — the thing you benchmarked is the thing you shipped.',
};

/* Write the command: the verb, the model, and whether you want the UI. */
function Write() {
  const [verb, setVerb] = useState('serve');
  const [model, setModel] = useState('');
  const [ui, setUi] = useState(true);
  const m = model.trim().replace(/\s+/g, '') || '<model>';
  const plain = verb === 'serve' && !ui;
  const cmd = `hanzo engine ${verb} ${m}${plain ? ' --no-ui' : ''}`;
  return (
    <section className="x-sec en-write">
      <div className="x-wrap en-write-grid">
        <div>
          <p className="x-kick">One binary, three verbs</p>
          <h2>Write the command</h2>
          <div className="en-write-verbs" role="radiogroup" aria-label="Verb">
            {VERBS.map((v) => <button key={v} type="button" role="radio" aria-checked={verb === v} onClick={() => setVerb(v)}>{v}</button>)}
          </div>
          <label className="en-write-f"><span>Hugging Face model</span><input value={model} onChange={(e) => setModel(e.target.value)} placeholder="<model>" spellCheck={false} autoComplete="off" maxLength={96} /></label>
          {verb === 'serve' && <label className="en-write-ui"><input type="checkbox" checked={ui} onChange={() => setUi(!ui)} /> The built-in UI at /ui</label>}
        </div>
        <div className="en-write-out">
          <div className="en-write-cmd"><code><b>$</b> {cmd}</code><Copy text={cmd} /></div>
          <p aria-live="polite">{SAY[plain ? 'serve --no-ui' : verb]}</p>
        </div>
      </div>
    </section>
  );
}

export default function Engine() {
  return (
    <main className="en">
      <Hero
        look="split"
        kick="hanzoai/engine"
        title="Hanzo Engine"
        sub="The inference engine, in one binary"
        acts={[['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Term />
      </Hero>
      <Deck />
      <Write />
      <section className="x-sec en-paste" data-room="dark">
        <div className="x-wrap">
          <Rise as="h2" className="en-start">Get started with Hanzo Engine</Rise>
          <Paste dark name="Engine" prompt="Read https://hanzo.ai/skill.md and use Hanzo Engine in my project. Start with: hanzo engine serve <model>" />
        </div>
      </section>
      <Get name="Engine" tag="AI inference engine" />
    </main>
  );
}
