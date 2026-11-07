'use client';
/* Engine.
   V2: 8/10 Launch page on the deck: a 52px title over the engine's own terminal (the one big thing, serving by itself from first paint, pausable); six pinned chapters, one idea and one scene each, the moment a block of weights losing precision from 8 bits to 2 as you scroll; "One binary, three verbs" writes the command; one graphite close.
   Persona: Developer. Goal: run Hanzo Engine (read the source, then deploy it).
   CTA: "View on GitHub" → https://github.com/hanzoai (data-cta engine.hero, data-thumb for the ask bar); "Deploy to
   Cloud" → platform.hanzo.ai/deploy (engine.close). Metric: api_key_created (proxy on this page: engine.hero click).
   Signature: the quantization scrub. In the fourth pinned chapter a block of weights loses precision as you scroll,
   GGUF 8 bits down to 2: the shades visibly collapse while a marker travels from Hanzo's 8 to Hanzo's 2.
   Supporting: the Stage hero (the terminal starts big and settles as you scroll; run streams tokens by CSS from first
   paint, serve shows continuous batching, bench measures), the line-mask title, the graphite close opening to full width.
   Motion kinds: idle (the terminal), time (tokens streaming, lanes), state (verb tabs, the switch), arrival (title cut-in),
   scroll (the chapters and the scrub only).
   Beyond: "One binary, three verbs": choose the verb, name a Hugging Face model and whether you want the built-in UI,
   and the one line to run is written for you to copy, with Hanzo's sentence on what it does.
   Every word, figure and link is Hanzo's; the scenes are drawn, not measured, and show no numbers. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { Field } from '../../kit';
import { useLive, useSteps, useFrame } from './Frame';
import KeynoteStage, { useStagePause } from '../../v2/KeynoteStage';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import './Engine.css';

const VERBS = ['run', 'serve', 'bench'];

/* which of n steps a chapter is on: from the scroll through it on desktop (p), or by itself while seen on phones */
function useStepOf(p, n, on) {
  const [k, setK] = useState(0);
  const calm = useReducedMotion();
  useEffect(() => {
    if (p) { const f = (v) => setK(Math.min(n - 1, Math.max(0, Math.floor(v * n)))); f(p.get()); return p.on('change', f); }
    if (!on || calm) return;
    const t = setTimeout(() => setK((x) => (x + 1) % n), 1500);
    return () => clearTimeout(t);
  }, [p, n, on, calm, k]);
  return k;
}

/* run: a prompt, and tokens arriving */
function Run() {
  return (
    <div className="en-run">
      <p className="en-p"><span>&gt;</span> <i className="en-cursor" /></p>
      <div className="en-toks">{Array.from({ length: 72 }).map((_, i) => <i key={i} style={{ animationDelay: 0.2 + i * 0.04 + 's', width: 18 + ((i * 37) % 34) + 'px' }} />)}</div>
    </div>
  );
}

/* serve: continuous batching. Eight slots; a request holds a slot for its own length and a new one takes it at once. */
function Lanes({ live, n = 8 }) {
  const ref = useRef(null);
  const slots = useRef(Array.from({ length: n }, (_, i) => ({ left: 0.3 + i * 0.37, len: 1.4 + ((i * 7) % 5) * 0.5 })));
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
  return <div className="en-lanes" ref={ref}>{Array.from({ length: n }).map((_, i) => <div key={i} className="en-lane"><b /></div>)}</div>;
}

function Bench() {
  return (
    <div className="en-bench">
      <div className="en-bars">{[62, 74, 81, 88, 92, 95, 97].map((h, i) => <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: h / 100 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.1 }} />)}</div>
      <p>the thing you benchmarked is the thing you shipped</p>
    </div>
  );
}

/* The hero object: the engine's own terminal, cycling its three verbs by itself until you pick one. */
function Term() {
  const [ref, seen] = useLive(0.25);
  const paused = useStagePause();
  const live = seen && !paused;
  const [at, choose] = useSteps(3, 4600, live);
  return (
    <div className="kn-obj ink en-term" ref={ref}>
      <div className="en-bar">
        <i /><i /><i />
        <span className="en-bar-t">hanzoai/engine</span>
        <div className="en-verbs" role="tablist" aria-label="Verbs">
          {VERBS.map((v, i) => (
            <button key={v} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="en-term-b">
        <p className="en-cmd"><span>$</span> hanzo engine {VERBS[at]} &lt;model&gt;</p>
        <div className="en-out" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={at} className="en-pane" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }}>
              {at === 0 ? <Run /> : at === 1 ? <div className="en-serve"><Lanes live={live} /><div className="en-util"><span>card</span><i><b /></i><em>busy</em></div></div> : <Bench />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="en-hw" aria-hidden="true">{['CUDA', 'Metal', 'CPU'].map((h) => <span key={h}>{h}</span>)}</div>
      </div>
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

/* 01: the three verbs, one lit at a time as you scroll through the chapter */
function VerbsScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  const say = ['Chat with a model', 'put it behind an HTTP API', 'or measure it'];
  return (
    <div className="kn-obj en-sc en-sc-verbs">
      {VERBS.map((v, i) => (
        <div key={v} className={'en-vl' + (k === i ? ' on' : '')}>
          <code><b>$</b> hanzo engine <em>{v}</em> &lt;model&gt;</code>
          <span>{say[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* 02: batching lanes, and the KV cache on disk */
function ServeScene({ on }) {
  return (
    <div className="kn-obj ink en-sc en-sc-serve">
      <p className="en-sc-k">continuous batching</p>
      <Lanes live={on} n={10} />
      <div className="en-kv"><span className="en-kv-chip">paged attention</span><span className="en-kv-chip">disk-first KV cache</span></div>
    </div>
  );
}

/* 03: five modalities into one process; the lines draw as you scroll */
const MODS = ['Vision', 'audio', 'speech', 'image', 'embeddings'];
function ModScene({ p, on }) {
  return (
    <div className="kn-obj en-sc en-sc-mod">
      <ul className="en-mods">{MODS.map((m) => <li key={m}>{m}</li>)}</ul>
      <svg className="en-mod-lines" viewBox="0 0 300 500" preserveAspectRatio="none" aria-hidden="true">
        {MODS.map((m, i) => (
          <motion.path key={m} d={`M0 ${50 + i * 100} C 150 ${50 + i * 100}, 150 250, 300 250`} style={p ? { pathLength: p } : undefined} initial={p ? false : { pathLength: 0 }} animate={p ? undefined : { pathLength: on ? 1 : 0 }} transition={{ duration: 1.2, ease: EASE, delay: i * 0.08 }} />
        ))}
      </svg>
      <div className="en-proc"><b>one process</b><span>same modality pipeline as generation</span></div>
    </div>
  );
}

/* 04, the signature: a block of weights re-quantized as you scroll, 8 bits down to 2 */
const BITS = [8, 6, 5, 4, 3, 2];
const W = Array.from({ length: 16 * 10 }, (_, i) => (Math.sin(i * 12.9898) * 43758.5453) % 1).map((x) => Math.abs(x));
function QuantScene({ p, on }) {
  const b = BITS[useStepOf(p, BITS.length, on)];
  const steps = Math.min(2 ** b, 24);
  return (
    <div className="kn-obj en-sc en-sc-q">
      <div className="en-q-top">
        <p className="en-q-scale kn-fig" style={{ '--q': (8 - b) / 6 }}>
          <b className={b === 8 ? 'on' : ''}>8</b><span aria-hidden="true"><i /></span><b className={b === 2 ? 'on' : ''}>2</b>
          <em>GGUF from 2 to 8 bits</em>
        </p>
      </div>
      <div className="en-q-grid" aria-hidden="true">
        {W.map((w, i) => {
          const q = Math.round(w * (steps - 1)) / (steps - 1);
          return <i key={i} style={{ opacity: 0.12 + q * 0.88 }} />;
        })}
      </div>
      <ul className="en-q-fmt">{['GPTQ', 'AWQ', 'HQQ', 'FP8', 'bitsandbytes'].map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
  );
}

/* 05: the same command on three kinds of silicon */
function SiliconScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  const S = [['CUDA', 'FlashAttention · multi-GPU tensor parallelism'], ['Metal', 'Apple Silicon'], ['CPU', 'plain CPU']];
  return (
    <div className="kn-obj en-sc en-sc-si">
      <div className="en-chips">{S.map(([t, d], i) => <div key={t} className={'en-chip' + (k === i ? ' on' : '')}><b>{t}</b><span>{d}</span></div>)}</div>
      <div className="en-doc"><code><b>$</b> hanzo engine serve &lt;model&gt;</code><code className="dim"><b>$</b> doctor</code></div>
    </div>
  );
}

/* 06: the built-in UI at /ui */
function UiScene() {
  return (
    <div className="kn-obj en-sc en-sc-ui">
      <div className="en-ui-bar"><i /><i /><i /><span>/ui</span></div>
      <div className="en-ui-b">
        <p className="en-ui-r"><em>reasoning</em></p>
        <pre className="en-ui-c"><code>{'>>> plot(x, y)'}</code></pre>
        <svg className="en-ui-plot" viewBox="0 0 200 70" aria-hidden="true"><path d="M0 60 C 30 58, 50 20, 80 30 S 130 64, 160 18 S 190 10, 200 8" /></svg>
        <div className="en-mcp">{['process', 'HTTP', 'WebSocket'].map((t) => <span key={t}>{t}</span>)}<code>--no-ui</code></div>
      </div>
    </div>
  );
}

const SCENES = [VerbsScene, ServeScene, ModScene, QuantScene, SiliconScene, UiScene];

const SAY = {
  run: 'Chat with a model.',
  serve: 'Put it behind an HTTP API. The built-in UI at /ui shows reasoning, code execution and plots inline.',
  'serve --no-ui': 'Pass --no-ui and it is a plain API server.',
  bench: 'Measure it — the thing you benchmarked is the thing you shipped.',
};

/* Beyond: write the command. The verb, the model, and whether you want the UI. */
function Write() {
  const [verb, setVerb] = useState('serve');
  const [model, setModel] = useState('');
  const [ui, setUi] = useState(true);
  const m = model.trim().replace(/\s+/g, '') || '<model>';
  const plain = verb === 'serve' && !ui;
  const cmd = `hanzo engine ${verb} ${m}${plain ? ' --no-ui' : ''}`;
  return (
    <section className="kn-sec en-write">
      <div className="kn-wrap kn-grid en-write-g">
        <div className="en-write-l">
          <KeynoteLines className="kn-headline" lines="One binary, three verbs" />
          <p className="kn-kick">run, serve, bench</p>
          <div className="en-write-verbs" role="radiogroup" aria-label="Verb">
            {VERBS.map((v) => <button key={v} type="button" role="radio" aria-checked={verb === v} onClick={() => setVerb(v)}>{v}</button>)}
          </div>
          <Field label="Hugging Face model" name="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="<model>" spellCheck={false} autoComplete="off" autoCapitalize="none" enterKeyHint="done" maxLength={96} />
          {verb === 'serve' && <button type="button" role="switch" aria-checked={ui} className="en-switch" onClick={() => setUi(!ui)}><i aria-hidden="true" />The built-in UI at /ui</button>}
        </div>
        <div className="en-write-out">
          <code className="en-write-cmd"><b>$</b> {cmd}</code>
          <div className="en-write-foot"><p aria-live="polite">{SAY[plain ? 'serve --no-ui' : verb]}</p><Copy text={cmd} /></div>
        </div>
      </div>
    </section>
  );
}

export default function Engine() {
  return (
    <main className="kn en">
      <KeynoteStage
        kick="hanzoai/engine"
        title={['Hanzo Engine']}
        lede="The inference engine, in one binary"
        acts={[['View on GitHub', 'https://github.com/hanzoai']]}
        meta={<span>Apache-2.0 · CUDA · Metal · CPU</span>}
        from={1.12}
        cta="engine.hero"
      >
        <Term />
      </KeynoteStage>

      <KeynoteChapters
        className="en-ch"
        head={<KeynoteLines className="kn-headline en-ch-h" lines={['One process,', 'laptop to GPU cluster']} />}
        items={DECK.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        swap="wipe"
        count
      />

      <Write />

      <KeynoteClose
        name="Engine"
        tag="AI inference engine"
        lead="Get started with Hanzo Engine"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Engine in my project. Start with: hanzo engine serve <model>"
        cta="engine.close"
      />
    </main>
  );
}
