'use client';
/* Flow. Signature: the node graph, running, with the title sitting on the canvas. Components from Hanzo's own library
   (a document loader, a text splitter, a vector store, a retriever, a model, an output parser) are wired on a dotted
   canvas and a run travels the edges one node at a time; the inspector shows what each node received and returned.
   Beyond: "Step through it" yourself. Pause the run and walk it node by node with the playground controls, the way
   Hanzo says you find the node that gave the strange answer. Also: publish the same flow three ways (REST, JSON, MCP)
   and the two commands that run it on your machine. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Copy } from '../../ui';
import { A, Go } from '../../kit';
import { Paste, Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Flow.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/flow';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
// node, where it sits on the canvas (%), what it received, what it returned
const NODES = [
  ['Document loader', 11, 14, 'a file', 'documents'],
  ['Text splitter', 27, 44, 'documents', 'chunks'],
  ['Vector store', 44, 12, 'chunks', 'stored vectors'],
  ['Retriever', 59, 42, 'a question', 'matching chunks'],
  ['Model', 74, 12, 'question and chunks', 'an answer'],
  ['Output parser', 89, 40, 'an answer', 'structured output'],
];

function Graph() {
  const [ref, live] = useLive(0.25);
  const [at, setAt] = useState(4);
  const [paused, setPaused] = useState(false);
  useEvery(1300, live && !paused, () => setAt((v) => (v + 1) % NODES.length));
  const step = (d) => { setPaused(true); setAt((v) => (v + d + NODES.length) % NODES.length); };
  const n = NODES[at];
  return (
    <div className="fl-graph" ref={ref}>
      <svg className="fl-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {NODES.slice(1).map((b, i) => {
          const a = NODES[i];
          const m = (a[1] + b[1]) / 2;
          const d = `M${a[1]} ${a[2]} C ${m} ${a[2]}, ${m} ${b[2]}, ${b[1]} ${b[2]}`;
          return <path key={i} d={d} className={i + 1 < at ? 'done' : i + 1 === at ? 'go' : ''} />;
        })}
      </svg>
      {NODES.map(([t, x, y], i) => (
        <button key={t} type="button" className={'fl-node' + (i === at ? ' on' : i < at ? ' done' : '')} style={{ left: x + '%', top: y + '%' }} onClick={() => { setPaused(true); setAt(i); }} aria-pressed={i === at}>
          <span className="fl-port in" aria-hidden="true" /><b>{t}</b><span className="fl-port out" aria-hidden="true" />
          {i === at && <motion.i layoutId="fl-ring" className="fl-ring" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />}
        </button>
      ))}
      <div className="fl-insp" aria-live="polite">
        <p className="fl-insp-k x-mono"><span>playground</span><span>node {at + 1} / {NODES.length}</span></p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
            <h3>{n[0]}</h3>
            <p><span className="x-mono">received</span><b>{n[3]}</b></p>
            <p><span className="x-mono">returned</span><b>{n[4]}</b></p>
          </motion.div>
        </AnimatePresence>
        <div className="fl-ctl">
          <button type="button" onClick={() => step(-1)} aria-label="Previous node">◀</button>
          <button type="button" onClick={() => setPaused(!paused)} className="run">{paused ? 'Run' : 'Pause'}</button>
          <button type="button" onClick={() => step(1)} aria-label="Next node">▶</button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="fl-hero" aria-labelledby="fl-h1">
      <div className="fl-bg" aria-hidden="true" />
      <div className="x-wrap fl-hero-in">
        <div className="fl-copy">
          <motion.p className="fl-url x-mono" {...up(0)}><img src="/models/koma.webp" alt="" />flow.hanzo.ai</motion.p>
          <h1 id="fl-h1" className="fl-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Flow</motion.span></span></h1>
          <motion.p className="fl-lede" {...up(0.3)}>Build an AI workflow on a canvas, ship it as an API</motion.p>
          <motion.div className="fl-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://flow.hanzo.ai" className="x-btn solid" data-thumb>Open Flow</A></motion.span>
            <Go to={DOCS}>Documentation</Go>
          </motion.div>
        </div>
        <motion.div className="fl-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}><Graph /></motion.div>
      </div>
    </section>
  );
}

const PROPS = [
  ['The library', 'Models, vector stores, document loaders, text splitters, output parsers, memory, retrievers and toolkits — plus anything you write yourself, which is a component like the rest.'],
  ['Open any node', 'A component is a Python class. Edit it in the browser and the change is live on the next run — no rebuild, no plugin format, no waiting for someone to add the parameter you need.'],
  ['Step through it', 'The playground runs a flow one node at a time and shows what each one received and returned. When a chain gives a strange answer, this is where you find the node that caused it.'],
  ['Multi-agent', 'Several agents on the same canvas, with conversation state between them and retrieval underneath — visible as a graph rather than buried in a prompt.'],
  ['Publish it three ways', 'As a REST endpoint, as JSON your Python app loads directly, or as an MCP server — after which the flow is a tool your coding agent can call.'],
  ['Keys stay out of the flow', 'Credentials live as variables the graph references by name, so a flow you export or share carries the wiring and not the secrets.'],
];
const WAYS = [['REST', 'a REST endpoint'], ['JSON', 'JSON your Python app loads directly'], ['MCP', 'an MCP server: a tool your coding agent can call']];

function Props() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(6, 3600, live);
  const [way, setWay] = useState(0);
  return (
    <section className="x-sec fl-props" ref={ref}>
      <div className="x-wrap fl-props-grid">
        <div className="fl-props-l">
          <p className="fl-props-k"><span>The canvas is not the ceiling</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
          <ol>
            {PROPS.map(([t, d], i) => (
              <li key={t} className={at === i ? 'on' : ''}>
                <button type="button" aria-expanded={at === i} onClick={() => choose(i)}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}</button>
                <motion.p initial={false} animate={{ height: at === i ? 'auto' : 0, opacity: at === i ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={at !== i}>{d}</motion.p>
              </li>
            ))}
          </ol>
          <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
        </div>
        <div className="fl-pub">
          <p className="fl-pub-k x-mono">one flow, published</p>
          <div className="fl-pub-t" role="tablist" aria-label="Publish it three ways">
            {WAYS.map(([k], i) => (
              <button key={k} type="button" role="tab" aria-selected={way === i} onClick={() => setWay(i)}>
                {way === i && <motion.span layoutId="fl-way" className="fl-way-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{k}</span>
              </button>
            ))}
          </div>
          <div className="fl-pub-box">
            <div className="fl-mini" aria-hidden="true">{[0, 1, 2].map((k) => <i key={k} />)}</div>
            <i className="fl-arrow" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={way} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3, ease: EASE }}>As {WAYS[way][1]}</motion.p>
            </AnimatePresence>
          </div>
          <div className="fl-vars x-mono" aria-hidden="true"><span>{'{API_KEY}'}</span><em>referenced by name · not in the export</em></div>
        </div>
      </div>
    </section>
  );
}

function Local() {
  return (
    <section className="x-sec fl-local" data-room="dark">
      <div className="x-wrap">
        <ul className="fl-facts">
          {[['Python', 'Every component'], ['REST', 'Or JSON, or MCP'], [':7860', 'On your machine'], ['MIT', 'Self-hosted']].map(([k, d], i) => (
            <Rise as="li" key={k} delay={i * 0.06}><b className="x-mono">{k}</b><span>{d}</span></Rise>
          ))}
        </ul>
        <div className="fl-local-grid">
          <div>
            <h2>Run it locally first</h2>
            <p>uv pip install hanzoflow, then uv run hanzoflow run. It opens on 127.0.0.1:7860. Docker works too.</p>
            <div className="fl-acts"><A to="https://flow.hanzo.ai" className="x-btn solid">Open Flow</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
          </div>
          <div className="fl-term">
            <div className="fl-term-bar"><i /><i /><i /><span className="x-mono">terminal</span><Copy text={'uv pip install hanzoflow\nuv run hanzoflow run'} /></div>
            <pre className="x-mono"><span className="p">$</span> uv pip install hanzoflow{'\n'}<span className="p">$</span> uv run hanzoflow run{'\n'}<span className="o">→ 127.0.0.1:7860</span><span className="fl-caret" /></pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Flow() {
  return (
    <main className="fl">
      <Hero />
      <Props />
      <section className="x-sec fl-paste"><div className="x-wrap"><Paste name="Flow" prompt="Read https://hanzo.ai/skill.md and use Hanzo Flow in my project. Start with: hanzo flow workflows list" /></div></section>
      <Local />
      <Get name="Flow" tag="Visual workflow builder" />
    </main>
  );
}
