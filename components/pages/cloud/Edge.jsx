'use client';
/* Edge. Signature: the model on the machine in front of you, with the network cut. The hero is one device that walks
   Hanzo's three facts in turn: the machines it runs on (laptop, Linux box, browser tab), generation with the network
   switched off and the request counter held at zero, and the weights fetched once and then never again. The runtime's
   six parts read as a ledger with each part's own figure; the four reasons to reach for it are the page's dark room.
   Beyond: "What runs on yours" - pick the machine you have and see what Edge uses on it and which Zen model fits,
   each answer one of Hanzo's own lines. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Head, useLive, useSteps } from './Frame';
import './Edge.css';

const WHERE = [
  ['Where it runs', 'macOS on Apple Silicon and Intel, Linux on x86 and ARM, and modern browsers through WebAssembly'],
  ['No network at all', 'Weights on disk, tokens out of local memory. There is no request, so there is nothing to be slow'],
  ['Fetched once', 'Name a Hugging Face repo and it downloads and caches the weights. After that, offline'],
];

function Machines() {
  const [ref, live] = useLive(0.3);
  const [k] = useSteps(3, 1300, live);
  return (
    <div className="eg-forms" ref={ref}>
      {['macOS', 'Linux', 'WebAssembly'].map((f, i) => (
        <motion.div key={f} className={'eg-form f' + i} animate={{ opacity: k === i ? 1 : 0.28, scale: k === i ? 1 : 0.94, y: k === i ? -6 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <span className="eg-form-shape" />
          <span className="eg-form-k">{f}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Offline() {
  return (
    <div className="eg-off">
      <div className="eg-net"><span className="eg-wifi"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1.3" /><path d="M3 3l18 18" className="cut" /></svg></span>network off</div>
      <div className="eg-gen">{Array.from({ length: 40 }).map((_, i) => <i key={i} style={{ animationDelay: 0.2 + i * 0.06 + 's', width: 12 + ((i * 29) % 34) + 'px' }} />)}</div>
      <dl className="eg-zero"><div><dt>requests sent</dt><dd>0</dd></div><div><dt>uploaded</dt><dd>0 B</dd></div></dl>
    </div>
  );
}

function Fetch() {
  return (
    <div className="eg-fetch">
      <p className="eg-repo">Hugging Face repo</p>
      <div className="eg-dl"><motion.b initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1], delay: 0.2 }} /></div>
      <motion.p className="eg-cached" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.4 }}>cached · offline</motion.p>
      <motion.div className="eg-disk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}><span>weights on disk</span><i /></motion.div>
    </div>
  );
}

function Device() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(3, 4600, live);
  return (
    <div className="eg-dev" ref={ref}>
      <div className="eg-frame">
        <div className="eg-top"><i /><i /><i /><span>localhost</span></div>
        <div className="eg-screen" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={at} className="eg-pane" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }}>
              {at === 0 ? <Machines /> : at === 1 ? <Offline /> : <Fetch />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="eg-where" role="tablist" aria-label="Where it runs">
        {WHERE.map(([t, d], i) => (
          <button key={t} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)} className={at === i ? 'on' : ''}>
            <span className="eg-n">{String(i + 1).padStart(2, '0')} / 03</span>
            <b>{t}</b>
            <span className="eg-d">{d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const RUNTIME = [
  ['A server on localhost', 'A local inference endpoint on a port you pick. Point a client at it and the rest of your code does not change.', 'localhost'],
  ['Quantized as a first language', 'GGUF is the native format — Q4_K, Q5_K, Q8_0. A 4B model at Q4_K_M is about 2.5GB on disk, which is what makes a phone a plausible place to run one.', '2.5GB'],
  ['It uses what it finds', 'Metal on Apple Silicon, CUDA where there is an NVIDIA card, AVX2 or AVX-512 on CPU. Detected at startup rather than configured by you.', 'Metal · CUDA · AVX'],
  ['Zen models sized for devices', 'zen3-nano at 600M for embedded work and zen-eco at 4B for phones and tablets, both published pre-quantized.', '600M · 4B'],
  ['Token by token', 'Streaming over server-sent events from the local server, or a callback from the Rust API, so a UI starts drawing before generation finishes.', 'SSE'],
  ['The prompt never leaves', 'Nothing is uploaded and there is no key to leak. The prompt and the output stay in the process that made them, which is the whole reason to run a model here.', '0 B up'],
];

function Runtime() {
  return (
    <section className="x-sec eg-rt">
      <div className="x-wrap">
        <Head title="What the runtime does" lede="One Rust binary, a core crate to embed, a WASM build for the browser, and a local server for everything else" />
        <ul className="eg-ledger">
          {RUNTIME.map(([t, d, fig], i) => (
            <Rise as="li" key={t} delay={(i % 2) * 0.06} y={18}>
              <span className="eg-fig" aria-hidden="true">{fig}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

const WHEN = [
  ['Apps that work with no signal', 'The model is a file on disk, so the feature does not stop existing when the connection does.', ['A desktop app that drafts and summarizes without a round trip', 'Field tools on a laptop, on a site with no coverage', 'Anything that has to keep working on a plane']],
  ['Text that cannot leave the building', 'Some prompts are a legal problem the moment they cross a network boundary. This is the answer to those.', ['Clinical and legal text processed on the workstation that holds it', 'On-premise deployments with no egress at all', 'Personal data handled on the device it belongs to']],
  ['Inside the browser tab', 'The WebAssembly build runs the model in the page, with nothing behind it — so a visitor costs you bandwidth once and compute never.', ['A demo that does not bill per visitor', 'An assistant inside a web app you already ship', 'Classification done client-side, before anything is uploaded']],
  ['Small hardware', 'ARM64 Linux is a production target. Cortex-A class boards are experimental, and the 600M model is the one that fits them.', ['A 600M model on a single-board computer', 'An ARM server doing batch work on its own', 'Kiosks and appliances with no account to sign in to']],
];

function When() {
  return (
    <section className="x-sec eg-when" data-room="dark">
      <div className="x-wrap">
        <Head dark title="When to reach for it" lede="Use Edge when the data cannot leave, the network cannot be relied on, or a per-call bill is the wrong shape. Use Hanzo Engine when you need full precision or many users at once." />
        <div className="eg-cases">
          {WHEN.map(([t, d, pts], i) => (
            <Rise key={t} className={'eg-case c' + i} delay={(i % 2) * 0.08}>
              <span className="eg-case-g" aria-hidden="true"><i /><i /><i /></span>
              <h3>{t}</h3>
              <p>{d}</p>
              <ul>{pts.map((p) => <li key={p}>{p}</li>)}</ul>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// what Edge uses on each machine, and which model fits, in Hanzo's words; '' where Hanzo names no model
const YOURS = [
  ['Apple Silicon', 'Metal', '', 'Metal on Apple Silicon. Detected at startup rather than configured by you.'],
  ['NVIDIA card', 'CUDA', '', 'CUDA where there is an NVIDIA card. Detected at startup rather than configured by you.'],
  ['CPU only', 'AVX2 or AVX-512', '', 'AVX2 or AVX-512 on CPU. Detected at startup rather than configured by you.'],
  ['Phone or tablet', 'GGUF, Q4_K_M', 'zen-eco · 4B', 'A 4B model at Q4_K_M is about 2.5GB on disk, which is what makes a phone a plausible place to run one.'],
  ['Cortex-A board', 'ARM64 Linux', 'zen3-nano · 600M', 'Cortex-A class boards are experimental, and the 600M model is the one that fits them.'],
  ['Browser tab', 'WebAssembly', '', 'The WebAssembly build runs the model in the page, with nothing behind it.'],
];

function Yours() {
  const [at, setAt] = useState(0);
  const [, uses, model, line] = YOURS[at];
  return (
    <section className="x-sec eg-yours">
      <div className="x-wrap eg-yours-grid">
        <div>
          <p className="x-kick">It uses what it finds</p>
          <h2>What runs on yours</h2>
          <div className="eg-yours-pick" role="radiogroup" aria-label="Your machine">
            {YOURS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={at === i} onClick={() => setAt(i)}>{n}</button>)}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="eg-yours-a" aria-live="polite" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
            <dl>
              <div><dt>Uses</dt><dd>{uses}</dd></div>
              {model && <div><dt>Zen model</dt><dd>{model}</dd></div>}
            </dl>
            <p>{line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Edge() {
  return (
    <main className="eg">
      <Hero
        kick="On-device inference"
        title="Hanzo Edge"
        sub="Run a model on the machine in front of you."
        acts={[['View on GitHub', 'https://github.com/hanzoai/edge'], ['View Documentation', 'https://docs.hanzo.ai']]}
      >
        <Device />
      </Hero>
      <section className="eg-paste">
        <div className="x-wrap"><Paste name="Edge" prompt="Read https://hanzo.ai/skill.md and use Hanzo Edge in my project." /></div>
      </section>
      <Runtime />
      <Yours />
      <When />
      <section className="eg-rel">
        <div className="x-wrap"><Related items={[['GPUs', '/cloud/gpus', 'On-demand accelerators'], ['Machines', '/machines', 'VMs by the second'], ['Containers', '/cloud/containers']]} /></div>
      </section>
      <Get name="Edge" tag="Edge compute" />
    </main>
  );
}
