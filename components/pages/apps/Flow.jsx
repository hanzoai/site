'use client';
/* Flow (v2, archetype A "Launch"): the canvas is the hero, and a run travels it.
   Persona: a developer building an AI workflow (retrieval, a model, a parser) who wants to ship it as an API
   Goal: see a flow run node by node, find out how it is published and run, then open Flow
   CTA: Open Flow -> https://flow.hanzo.ai (hero, sticky, close; data-thumb, data-cta). The sticky ask is the site's own
   ask bar (components/Ask.jsx) reading data-thumb at every width; v2/AskBar would stack a second bar on top of it.
   Signature: the canvas, running. Hanzo's own components (a document loader, a text splitter, a vector store, a
   retriever, a model, an output parser) are wired on a full-bleed dotted canvas with "Hanzo Flow" sitting among them;
   a run leaves each node as a pulse that travels its edge to the next, the node runs, and what it returned appears on it.
   The inspector on the canvas follows the run and carries its Pause.
   Beyond: "Step through it" yourself. In the playground (the one dark room), play, pause, or take the flow one node at
   a time (next, previous, or tap a node or a step); the inspector shows what each node received and returned, the way
   Hanzo says you find the node that gave the strange answer. The REST card opens into the same flow published three
   ways (REST, JSON, MCP) as tabs.
   Not only scroll: the run is idle motion; the playground answers the hand; the facts open (state); chapters are scroll.
   Motion: the running canvas (signature) + line-masked headings + sticky chapters + nodes that open into their page.
V2: 8/10 the first screen is the dotted canvas with the title among running nodes and a Pause on it; six sticky chapters step the run with its inspector; the playground dark room steps it by hand; four facts are nodes that open (REST into three tabs); the close is the two commands and one ask; greys only, nothing above a headline
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy } from '../../ui';
import { EASE_OUT_EXPO, DUR } from '../../../lib/motion';
import { A, Go, More } from '../../kit';
import { Paste, useLive } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizChapters from '../../v2/BizChapters';
import BizOpen from '../../v2/BizOpen';
import './Flow.css';

const APP = 'https://flow.hanzo.ai';
const DOCS = 'https://docs.hanzo.ai/docs/cli/flow';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';

/* the components, what each received and what it returned */
const NODES = [
  { t: 'Document loader', r: 'a file', o: 'documents', d: 'M4 1.8h5.2L12.5 5v9.2H4zM9 1.8V5.2h3.4M6 8h4.5M6 10.5h4.5' },
  { t: 'Text splitter', r: 'documents', o: 'chunks', d: 'M2.5 3.5h11M2.5 6.5h11M2.5 9.5h5M2.5 12.5h5M10.5 9l3 2-3 2' },
  { t: 'Vector store', r: 'chunks', o: 'stored vectors', d: 'M3 4c0-1 2.2-1.8 5-1.8s5 .8 5 1.8v8c0 1-2.2 1.8-5 1.8S3 13 3 12zM3 4c0 1 2.2 1.8 5 1.8S13 5 13 4M3 8c0 1 2.2 1.8 5 1.8s5-.8 5-1.8' },
  { t: 'Retriever', r: 'a question', o: 'matching chunks', d: 'M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM10.5 10.5 14 14' },
  { t: 'Model', r: 'question and chunks', o: 'an answer', d: 'M8 1.8 13.5 5v6L8 14.2 2.5 11V5zM2.5 5 8 8l5.5-3M8 8v6.2' },
  { t: 'Output parser', r: 'an answer', o: 'structured output', d: 'M5.5 2.5c-1.6 0-2 .8-2 2.2v1.6c0 1-.6 1.7-1.5 1.7.9 0 1.5.7 1.5 1.7v1.6c0 1.4.4 2.2 2 2.2M10.5 2.5c1.6 0 2 .8 2 2.2v1.6c0 1 .6 1.7 1.5 1.7-.9 0-1.5.7-1.5 1.7v1.6c0 1.4-.4 2.2-2 2.2' },
];
// where each node sits on a canvas (% of its width and height): desktop, then phone
const LAY = {
  hero: [[[11, 24], [31, 15], [51, 25], [70, 15], [88, 31], [86, 66]], [[23, 42], [77, 42], [77, 56], [23, 56], [23, 70], [77, 70]]],
  snake: [[[17, 18], [50, 18], [83, 18], [83, 64], [50, 64], [17, 64]], [[22, 16], [78, 16], [78, 50], [22, 50], [22, 84], [78, 84]]],
  row: [[[9, 36], [25.4, 66], [41.8, 36], [58.2, 66], [74.6, 36], [91, 66]], [[22, 16], [78, 16], [78, 50], [22, 50], [22, 84], [78, 84]]],
};
const two = (n) => String(n).padStart(2, '0');
const r1 = (v) => Math.round(v * 10) / 10;
// the run, in steps: 2i = node i runs, 2i + 1 = its output travels to node i + 1, 11 = the run is done
const END = 11;
const STEP_MS = (s) => (s === END ? 2600 : s % 2 ? 950 : 900);

/* One edge between two nodes: leave on the side that faces the next node, a soft S between, and the points a pulse rides. */
function edge([ax, ay], [bx, by], nw, nh) {
  const dx = bx - ax, dy = by - ay;
  let p0, p3, c1, c2;
  if (Math.abs(dx) - nw / 2 > Math.abs(dy) - nh / 2) {
    const sx = Math.sign(dx) || 1;
    p0 = [ax + (sx * nw) / 2, ay]; p3 = [bx - (sx * nw) / 2, by];
    const k = Math.max(36, Math.abs(p3[0] - p0[0]) / 2);
    c1 = [p0[0] + sx * k, p0[1]]; c2 = [p3[0] - sx * k, p3[1]];
  } else {
    const sy = Math.sign(dy) || 1;
    p0 = [ax, ay + (sy * nh) / 2]; p3 = [bx, by - (sy * nh) / 2];
    const k = Math.max(28, Math.abs(p3[1] - p0[1]) / 2);
    c1 = [p0[0], p0[1] + sy * k]; c2 = [p3[0], p3[1] - sy * k];
  }
  const at = (t) => [0, 1].map((j) => (1 - t) ** 3 * p0[j] + 3 * (1 - t) ** 2 * t * c1[j] + 3 * (1 - t) * t * t * c2[j] + t ** 3 * p3[j]);
  const pts = Array.from({ length: 25 }, (_, i) => at(i / 24));
  return { d: `M${p0.map(r1)} C${c1.map(r1)} ${c2.map(r1)} ${p3.map(r1)}`, p0, p3, xs: pts.map((p) => r1(p[0])), ys: pts.map((p) => r1(p[1])) };
}

/* The run: it steps by itself while on (and on screen); reduced motion shows it finished. */
function useRun(live, calm, on = true) {
  const [s, setS] = useState(0);
  useEffect(() => { if (calm) setS(END); }, [calm]);
  useEffect(() => {
    if (!live || !on) return;
    const t = setTimeout(() => setS((v) => (v >= END ? 0 : v + 1)), STEP_MS(s));
    return () => clearTimeout(t);
  }, [s, live, on]);
  return [s, setS];
}
const nodeOf = (s) => (s >= END ? 5 : Math.floor(s / 2));

/* The graph on a canvas. s is the run's step; lit picks out one node; pick makes nodes tappable. */
function Graph({ lay, s, lit = -1, pulse = true, pick, cls = '' }) {
  const box = useRef(null);
  const [dim, setDim] = useState(null);
  useEffect(() => {
    const el = box.current;
    const mq = matchMedia('(max-width: 900px)');
    const m = () => {
      const n = el.querySelector('.fl-node');
      setDim({ w: el.clientWidth, h: el.clientHeight, nw: n.offsetWidth, nh: n.offsetHeight, phone: mq.matches });
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const L = LAY[lay][dim?.phone ? 1 : 0];
  const P = dim ? L.map(([x, y]) => [(x / 100) * dim.w, (y / 100) * dim.h]) : [];
  const E = dim ? P.slice(1).map((b, i) => edge(P[i], b, dim.nw, dim.nh)) : [];
  const go = s < END && s % 2 ? (s - 1) / 2 : -1;
  const Tag = pick ? 'button' : 'div';
  return (
    <div ref={box} className={'fl-g fl-' + lay + ' ' + cls}>
      <svg className="fl-edges" width={dim?.w || 0} height={dim?.h || 0} aria-hidden="true">
        {E.map((e, i) => (
          <g key={i} className={s > 2 * i + 1 ? 'done' : go === i ? 'go' : ''}>
            <path d={e.d} />
            <circle cx={e.p0[0]} cy={e.p0[1]} r="4.5" /><circle cx={e.p3[0]} cy={e.p3[1]} r="4.5" />
          </g>
        ))}
      </svg>
      {pulse && go >= 0 && E[go] && (
        <motion.i key={'p' + go} className="fl-pulse" aria-hidden="true" initial={{ x: E[go].xs[0], y: E[go].ys[0], opacity: 0 }} animate={{ x: E[go].xs, y: E[go].ys, opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
      )}
      {NODES.map((n, i) => {
        const run = s === 2 * i && s < END;
        const done = s > 2 * i;
        return (
          <Tag key={n.t} {...(pick ? { type: 'button', onClick: () => pick(i), 'aria-pressed': lit === i, 'aria-label': n.t } : {})}
            className={'fl-node' + (run ? ' run' : '') + (done ? ' done' : '') + (lit === i ? ' lit' : '')}
            style={{ '--x': LAY[lay][0][i][0] + '%', '--y': LAY[lay][0][i][1] + '%', '--px': LAY[lay][1][i][0] + '%', '--py': LAY[lay][1][i][1] + '%' }}>
            <span className="fl-node-h">
              <i className="fl-node-i"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d={n.d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /></svg></i>
              <b>{n.t}</b>
            </span>
            <span className="fl-node-o x-mono">{done ? <><em>out</em>{n.o}</> : run ? <><em>in</em>{n.r}</> : <><em>in</em>{n.r}</>}</span>
            <i className="fl-node-bar" aria-hidden="true" />
          </Tag>
        );
      })}
    </div>
  );
}

/* What one node received and returned. */
function Inspect({ s, i, cls = '', ctl }) {
  const n = NODES[i];
  const done = s > 2 * i;
  return (
    <div className={'fl-insp ' + cls}>
      <p className="fl-insp-k x-mono"><span>playground</span><span>{two(i + 1)} / 06</span>{ctl}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i + (done ? 'd' : 'r')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: DUR.fade, ease: EASE_OUT_EXPO }}>
          <h3>{n.t}</h3>
          <p><span className="x-mono">received</span><b>{n.r}</b></p>
          <p><span className="x-mono">returned</span><b className={done ? 'out' : ''}>{done ? n.o : '…'}</b></p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const Ico = ({ k }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    {k === 'play' && <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" />}
    {k === 'pause' && <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" />}
    {k === 'next' && <path d="M3.5 3.5v9L9.5 8zM11 3.5h1.8v9H11z" fill="currentColor" />}
    {k === 'prev' && <path d="M12.5 3.5v9L6.5 8zM3.2 3.5H5v9H3.2z" fill="currentColor" />}
  </svg>
);

/* The first screen is the canvas: the run travels it, the title sits among the nodes. */
function Hero() {
  const [ref, live, calm] = useLive(0.2);
  const [hold, setHold] = useState(false);
  const [s] = useRun(live, calm, !hold);
  const pause = <button type="button" className="fl-hold" onClick={() => setHold(!hold)} aria-label={hold ? 'Play the run' : 'Pause the run'}><Ico k={hold ? 'play' : 'pause'} /></button>;
  return (
    <section ref={ref} className="fl-hero" aria-labelledby="fl-h1">
      <Graph lay="hero" s={s} />
      <Inspect s={s} i={nodeOf(s)} cls="fl-hero-insp" ctl={pause} />
      <div className="fl-hero-in">
        <div className="bz-wrap">
          <div className="fl-copy">
            <BizLines as="h1" id="fl-h1" className="bz-display" lines={['Hanzo Flow']} now delay={0.05} />
            <div className="fl-intro">
              <p className="bz-lede">Build an AI workflow on a canvas, ship it as an API</p>
              <div className="bz-acts">
                <span data-thumb="Open Flow" data-cta="primary"><Go to={APP} solid>Open Flow</Go></span>
                <More to={DOCS}>Documentation</More>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Chapters: the graph pinned; each chapter lights the next node and shows what it received and returned. */
const PROPS = [
  ['The library', 'Models, vector stores, document loaders, text splitters, output parsers, memory, retrievers and toolkits — plus anything you write yourself, which is a component like the rest.'],
  ['Open any node', 'A component is a Python class. Edit it in the browser and the change is live on the next run — no rebuild, no plugin format, no waiting for someone to add the parameter you need.'],
  ['Step through it', 'The playground runs a flow one node at a time and shows what each one received and returned. When a chain gives a strange answer, this is where you find the node that caused it.'],
  ['Multi-agent', 'Several agents on the same canvas, with conversation state between them and retrieval underneath — visible as a graph rather than buried in a prompt.'],
  ['Publish it three ways', 'As a REST endpoint, as JSON your Python app loads directly, or as an MCP server — after which the flow is a tool your coding agent can call.'],
  ['Keys stay out of the flow', 'Credentials live as variables the graph references by name, so a flow you export or share carries the wiring and not the secrets.'],
];

function Chapters() {
  return (
    <BizChapters
      label="The canvas is not the ceiling"
      className="fl-ch"
      items={PROPS.map(([t, d], i) => ({
        k: NODES[i].t, t, d,
        x: <p className="fl-io x-mono"><span><em>received</em> {NODES[i].r}</span><span><em>returned</em> {NODES[i].o}</span></p>,
      }))}
      stage={(at) => (
        <div className="fl-ch-stage">
          <Graph lay="snake" s={2 * at + 1} lit={at} pulse={false} cls="fl-board" />
          <Inspect s={2 * at + 1} i={at} cls="fl-ch-insp" />
        </div>
      )}
    >
      <header className="bz-wrap fl-ch-head">
        <BizLines className="bz-display md" lines={['The canvas is', 'not the ceiling']} />
      </header>
    </BizChapters>
  );
}

/* Beyond, in the one dark room: the playground. Play, pause, next, previous, or tap a node; the inspector follows. */
function Playground() {
  const [ref, live, calm] = useLive(0.3);
  const [play, setPlay] = useState(true);
  const [s, setS] = useRun(live, calm, play);
  const i = nodeOf(s);
  const done = s > 2 * i;
  const to = (n) => { setPlay(false); setS(Math.max(0, Math.min(END, n))); };
  const node = (k) => to(2 * k + 1); // a node, run and returned
  const next = () => (s >= END ? to(1) : to(s % 2 ? s + 2 : s + 1));
  const prev = () => to(s % 2 ? s - 2 : s - 1);
  const state = s >= END ? 'run complete' : s % 2 ? 'passing to ' + NODES[i + 1].t.toLowerCase() : 'running';
  return (
    <section ref={ref} className="bz-sec fl-play" data-room="dark" aria-labelledby="fl-play-h">
      <div className="bz-wrap fl-play-top">
        <BizLines id="fl-play-h" className="bz-display md" lines={['Step through it']} />
      </div>
      <div className="bz-wrap">
        <div className="fl-pg">
          <div className="fl-pg-bar">
            <span className="x-mono"><i className={play && live ? 'on' : ''} aria-hidden="true" />flow.hanzo.ai<em>/ playground</em></span>
            <span className="fl-pg-state x-mono" aria-live="polite">{state}</span>
          </div>
          <Graph lay="row" s={s} lit={i} pick={node} cls="fl-pg-g" />
          <div className="fl-pg-bot">
            <div className="fl-pg-ctl" role="group" aria-label="Step through the flow">
              <button type="button" onClick={prev} disabled={s <= 0} aria-label="Previous node"><Ico k="prev" /></button>
              <button type="button" className="main" onClick={() => setPlay(!play)} aria-label={play ? 'Pause' : 'Play'}><Ico k={play ? 'pause' : 'play'} /><span>{play ? 'Pause' : 'Play'}</span></button>
              <button type="button" onClick={next} aria-label="Next node"><Ico k="next" /></button>
            </div>
            <ol className="fl-pg-steps" aria-label="Nodes">
              {NODES.map((n, k) => (
                <li key={n.t}><button type="button" className={(k === i ? 'on' : '') + (s > 2 * k ? ' done' : '')} onClick={() => node(k)} aria-current={k === i ? 'step' : undefined}><span className="x-mono">{two(k + 1)}</span><b>{n.t}</b></button></li>
              ))}
            </ol>
            <div className="fl-pg-io">
              <p><b>{NODES[i].r}</b><span className="x-mono">received</span></p>
              <i aria-hidden="true">→</i>
              <p><b className={done ? '' : 'wait'}>{done ? NODES[i].o : '…'}</b><span className="x-mono">returned</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* REST opens into the flow, published three ways. */
const WAYS = [['REST', 'As a REST endpoint'], ['JSON', 'As JSON your Python app loads directly'], ['MCP', 'As an MCP server — a tool your coding agent can call']];
function Ways() {
  const [w, setW] = useState(0);
  return (
    <div className="fl-ways">
      <div className="fl-ways-t" role="tablist" aria-label="Publish it three ways">
        {WAYS.map(([k], i) => <button key={k} type="button" role="tab" id={'fl-w-' + k} aria-selected={w === i} aria-controls={'fl-wp-' + k} onClick={() => setW(i)}>{k}</button>)}
      </div>
      {WAYS.map(([k, d], i) => (
        <div key={k} id={'fl-wp-' + k} role="tabpanel" aria-labelledby={'fl-w-' + k} hidden={w !== i} className="fl-ways-p">
          <div className="fl-mini" aria-hidden="true">{NODES.map((n) => <i key={n.t} />)}</div>
          <i className="fl-ways-arrow" aria-hidden="true" />
          <p><b className="x-mono">{k}</b>{d}</p>
        </div>
      ))}
      <p className="fl-vars x-mono"><span>{'{API_KEY}'}</span>referenced by name · not in the export</p>
    </div>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Four facts, each a node on the strip that opens into its own page (synchronized.studio). */
const FACTS = [
  { id: 'py', f: 'Python', t: 'Every component', d: 'A component is a Python class. Edit it in the browser and the change is live on the next run — no rebuild, no plugin format, no waiting for someone to add the parameter you need.' },
  { id: 'rest', f: 'REST', t: 'Or JSON, or MCP', d: 'As a REST endpoint, as JSON your Python app loads directly, or as an MCP server — after which the flow is a tool your coding agent can call.', x: <Ways /> },
  { id: 'port', f: ':7860', t: 'On your machine', d: 'uv pip install hanzoflow, then uv run hanzoflow run. It opens on 127.0.0.1:7860. Docker works too.' },
  { id: 'mit', f: 'MIT', t: 'Self-hosted', x: <><div className="fl-chips"><span className="fl-chip"><span>License:</span> Apache-2.0</span><A to={GH} className="fl-chip"><Gh />hanzoai</A></div><div className="fl-get-links"><More to={GH}>View on GitHub</More><More to={DEPLOY}>Deploy to Cloud</More></div></> },
];

/* The edges between the fact nodes, measured from where the cards actually sit (desktop; phones use a rule). */
function useWires(ref) {
  const [w, setW] = useState({ d: [], h: 0 });
  useEffect(() => {
    const el = ref.current;
    const m = () => {
      const box = el.getBoundingClientRect();
      const P = [...el.querySelectorAll('.fl-fact')].map((c) => { const r = c.getBoundingClientRect(); return { o: [r.right - box.left, r.top - box.top + r.height / 2], i: [r.left - box.left, r.top - box.top + r.height / 2] }; });
      const d = P.slice(1).map((p, k) => { const a = P[k].o, b = p.i, mx = (a[0] + b[0]) / 2; return `M${a.map(r1)} C${r1(mx)},${r1(a[1])} ${r1(mx)},${r1(b[1])} ${b.map(r1)}`; });
      setW({ d, h: box.height });
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function Facts() {
  const ref = useRef(null);
  const w = useWires(ref);
  return (
    <section className="bz-sec fl-facts-sec" aria-label="Flow in four facts">
      <div ref={ref} className="bz-wrap fl-strip">
        <svg className="fl-wires" width="100%" height={w.h} aria-hidden="true">{w.d.map((d, k) => <path key={k} d={d} />)}</svg>
        <BizOpen label="Flow in four facts" className="fl-facts" cardClass="fl-fact" items={FACTS.map((x) => ({
          id: x.id,
          label: x.f + ', ' + x.t,
          card: <><span className="fl-fact-port in" aria-hidden="true" /><b className="bz-fig">{x.f}</b><span className="fl-fact-t">{x.t}</span><span className="fl-fact-port out" aria-hidden="true" /></>,
          panel: (
            <div className={'fl-fp' + (x.id === 'rest' ? ' wide' : '')}>
              <div className="fl-fp-copy">
                <b className="bz-fig">{x.f}</b>
                <h3 className="bz-title">{x.t}</h3>
                {x.d && <p className="bz-body">{x.d}</p>}
              </div>
              {x.x && <div className="fl-fp-x">{x.x}</div>}
            </div>
          ),
        }))} />
      </div>
    </section>
  );
}

/* Getting it: the licence, the source, the ways to run it, and the agent prompt. Text links only. */
function GetFlow() {
  return (
    <section className="bz-sec fl-getsec" aria-labelledby="fl-get-h">
      <div className="bz-wrap bz-grid">
        <div className="fl-get">
          <h2 id="fl-get-h" className="bz-headline">Get Flow</h2>
          <p className="bz-lede">Visual workflow builder</p>
          <div className="fl-chips"><span className="fl-chip"><span>License:</span> Apache-2.0</span><A to={GH} className="fl-chip"><Gh />hanzoai</A></div>
          <div className="fl-get-links"><More to={DEPLOY}>Deploy to Cloud</More><More to={DOCS}>Documentation</More></div>
        </div>
        <Paste name="Flow" prompt="Read https://hanzo.ai/skill.md and use Hanzo Flow in my project. Start with: hanzo flow workflows list" className="fl-paste" />
      </div>
    </section>
  );
}

/* The close: the two commands that run it on your machine, the one ask, and one text row. */
function End() {
  return (
    <section className="bz-sec fl-end" aria-labelledby="fl-end-h">
      <div className="bz-wrap bz-grid fl-end-top">
        <div className="fl-end-copy">
          <BizLines id="fl-end-h" className="bz-display md" lines={['Run it', 'locally first']} />
          <p className="bz-body">uv pip install hanzoflow, then uv run hanzoflow run. It opens on 127.0.0.1:7860. Docker works too.</p>
          <div className="bz-acts"><span data-cta="primary"><Go to={APP} solid>Open Flow</Go></span></div>
        </div>
        <div className="fl-term">
          <div className="fl-term-bar"><span aria-hidden="true"><i /><i /><i /></span><span className="x-mono">terminal</span><Copy text={'uv pip install hanzoflow\nuv run hanzoflow run'} /></div>
          <pre className="x-mono"><span className="fl-cmd"><i>$</i>uv pip install hanzoflow</span>{'\n'}<span className="fl-cmd"><i>$</i>uv run hanzoflow run</span>{'\n'}<span className="fl-out">→ 127.0.0.1:7860<span className="fl-caret" /></span></pre>
        </div>
      </div>
      <div className="bz-wrap">
        <A to={GH} className="fl-row"><span>View on GitHub</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
      </div>
    </section>
  );
}

export default function Flow() {
  return (
    <main className="bz fl">
      <Hero />
      <Chapters />
      <Playground />
      <Facts />
      <GetFlow />
      <End />
    </main>
  );
}
