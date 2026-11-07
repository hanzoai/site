'use client';
/* Flow (v2, archetype A "Launch"): the canvas is the hero, and a run travels it.
   Persona: a developer building an AI workflow (retrieval, a model, a parser) who wants to ship it as an API
   Metric: app_handoff
   Goal: see a flow run node by node, find out how it is published and run, then open Flow
   CTA: Open Flow -> https://flow.hanzo.ai (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta flow.hero / flow.close)
   Signature: the canvas, running. Hanzo's own component kinds (its library list: document loaders, text splitters,
   vector stores, retrievers, Models, output parsers) are wired on a full-bleed dotted canvas beside "Hanzo Flow"; a run
   leaves each node as a pulse that travels its edge to the next, the node runs, and what it returned shows on it.
   This is the only place the pipeline is drawn. Hover a node and it lifts and shows the other side of what it does.
   Beyond: the playground, in the one dark room and nowhere else: play, pause, or take the flow one node at a time
   (previous, next, or pick a step); what each node received and returned is the object, large, streaming in.
   Chapters: each of Hanzo's six features gets its own object on the pinned board, built from its own sentence
   (components/pages/apps/flow/FlowPanels.jsx): the library's palette, a node opened to its Python class, steps ticked
   until the node that caused it, several agents with retrieval underneath, a flow published three ways, a flow
   exported with the wiring and not the secrets. The fact cards open into their own object (every kind a Python class,
   the three ways as tabs, the terminal).
   Not only scroll: the run is idle motion; the playground answers the hand; the facts open (state); chapters are scroll.
   Motion: the running canvas (signature) + line-masked headings + sticky chapters + nodes that open into their page.
V2: 8/10 round 4: the pipeline is drawn once (the hero); the six chapters each get their own object from their own copy; the playground appears only in the dark room, with no second "Step through it" heading; no invented demo data (node names, received and returned are Hanzo's own words); hero hover lifts a node and shows what it returns; the run's pause and counter sit on the canvas; heights reserved so nothing bobs; phone cards wrap at spaces only and their port heads never fuse; gaps closed
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Copy } from '../../ui';
import { A, More } from '../../kit';
import BizAsk from '../../v2/BizAsk';
import { useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizLines from '../../v2/BizLines';
import BizOpen from '../../v2/BizOpen';
import FlowChapters from './flow/FlowChapters';
import FlowPanel from './flow/FlowPanels';
import './Flow.css';

const APP = 'https://flow.hanzo.ai';
const DOCS = 'https://docs.hanzo.ai/docs/cli/flow';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';

/* the components, in Hanzo's own words (its library list, lower case as Hanzo writes them; CSS sets the first capital).
   What a node received is the node before it; what it returned goes to the node after it, and the last one out is the
   REST endpoint Hanzo publishes. No invented data: every value is a fragment of Hanzo's copy. */
const NODES = [
  { t: 'document loaders', r: '—', o: 'text splitters' },
  { t: 'text splitters', r: 'document loaders', o: 'vector stores' },
  { t: 'vector stores', r: 'text splitters', o: 'retrievers' },
  { t: 'retrievers', r: 'vector stores', o: 'Models' },
  { t: 'Models', r: 'retrievers', o: 'output parsers' },
  { t: 'output parsers', r: 'Models', o: 'REST endpoint' },
];
// where each node sits on a canvas (% of its width and height): desktop, then phone
const LAY = {
  hero: [[[52, 25], [70, 17], [88, 28], [87, 57], [69, 51], [52, 62]], [[25, 37], [75, 37], [75, 54], [25, 54], [25, 71], [75, 71]]],
  snake: [[[17, 18], [50, 18], [83, 18], [83, 64], [50, 64], [17, 64]], [[22, 16], [78, 16], [78, 50], [22, 50], [22, 84], [78, 84]]],
  // the phone's pinned mini-graph: two rows of three, compact nodes
  mini: [[[17, 27], [50, 27], [83, 27], [83, 73], [50, 73], [17, 73]], [[17, 27], [50, 27], [83, 27], [83, 73], [50, 73], [17, 73]]],
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
  // two stacked nodes close together: their port heads would fuse into one blob, so the short wire draws without them
  const short = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) < 30;
  return { d: `M${p0.map(r1)} C${c1.map(r1)} ${c2.map(r1)} ${p3.map(r1)}`, p0, p3, short, xs: pts.map((p) => r1(p[0])), ys: pts.map((p) => r1(p[1])) };
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
function Graph({ lay, s, lit = -1, pulse = true, pick, upto = 5, cls = '' }) {
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
    <div ref={box} className={'fl-g fl-lay-' + lay + ' ' + cls}>
      <svg className="fl-edges" width={dim?.w || 0} height={dim?.h || 0} aria-hidden="true">
        {E.map((e, i) => (
          <g key={i} className={(s > 2 * i + 1 ? 'done' : go === i ? 'go' : '') + (i >= upto ? ' off' : '')}>
            <path d={e.d} />
            {!e.short && <><circle cx={e.p0[0]} cy={e.p0[1]} r="4.5" /><circle cx={e.p3[0]} cy={e.p3[1]} r="4.5" /></>}
          </g>
        ))}
      </svg>
      {pulse && go >= 0 && E[go] && (
        <motion.i key={'p' + go} className="fl-pulse" aria-hidden="true" initial={{ x: E[go].xs[0], y: E[go].ys[0], opacity: 0 }} animate={{ x: E[go].xs, y: E[go].ys, opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }} />
      )}
      {NODES.map((n, i) => {
        const run = s === 2 * i && s < END;
        const done = s > 2 * i;
        return (
          <Tag key={n.t} {...(pick ? { type: 'button', onClick: () => pick(i), 'aria-pressed': lit === i, 'aria-label': n.t } : {})}
            className={'fl-node' + (run ? ' run' : '') + (done ? ' done' : '') + (lit === i ? ' lit' : '') + (i > upto ? ' off' : '')}
            aria-hidden={i > upto || undefined}
            style={{ '--x': LAY[lay][0][i][0] + '%', '--y': LAY[lay][0][i][1] + '%', '--px': LAY[lay][1][i][0] + '%', '--py': LAY[lay][1][i][1] + '%' }}>
            <span className="fl-node-h">
              <span className="fl-node-n x-mono" aria-hidden="true">{two(i + 1)}</span>
              <b>{n.t}</b>
            </span>
            {/* received and returned share one box: the run (or a hover) swaps which one shows, so the card never grows */}
            <span className={'fl-node-o x-mono' + (done ? ' is-out' : '')}>
              <span className="fl-io-r"><em>received</em> {n.r}</span>
              <span className="fl-io-o"><em>returned</em> {n.o}</span>
            </span>
            <i className="fl-node-bar" aria-hidden="true" />
          </Tag>
        );
      })}
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
  const [s, setS] = useRun(live, calm, !hold);
  // tap or click a node: the run holds there, that node lit with what it returned
  const pick = (k) => { setHold(true); setS(2 * k + 1); };
  return (
    <section ref={ref} className="fl-hero" aria-labelledby="fl-h1">
      <Graph lay="hero" s={s} lit={hold ? nodeOf(s) : -1} pick={pick} />
      {/* the run's own pause (WCAG 2.2.2): icon only, its name from the register; pressed while held */}
      {/* it sits on the canvas under node 06, inside the graph; under reduced motion the run is shown finished and the
          control is only its counter, out of the tab order */}
      <button type="button" className="fl-hold" onClick={() => setHold(!hold)} aria-label="Pause" aria-pressed={hold} tabIndex={calm ? -1 : undefined} aria-hidden={calm || undefined}><Ico k={hold ? 'play' : 'pause'} /><span className="fl-hold-n x-mono" aria-hidden="true">{two(nodeOf(s) + 1)} / 06</span></button>
      <div className="fl-hero-in">
        <div className="bz-wrap">
          <div className="fl-copy">
            <BizLines as="h1" id="fl-h1" className="bz-display" lines={['Hanzo Flow']} now delay={0.05} />
            <div className="fl-intro">
              <p className="bz-lede">Build an AI workflow on a canvas, ship it as an API</p>
              <div className="bz-acts">
                <BizAsk to={APP} thumb="Open Flow" cta="flow.hero">Open Flow</BizAsk>
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
    <FlowChapters
      label="The canvas is not the ceiling"
      items={PROPS.map(([t, d]) => ({ t, d }))}
      stage={(at) => <FlowPanel at={at} />}
      mini={(at) => <FlowPanel at={at} compact />}
    >
      <header className="bz-wrap fl-ch-head">
        <BizLines className="bz-headline" lines={['The canvas is not the ceiling']} />
      </header>
    </FlowChapters>
  );
}

/* What a node returned, arriving the way a run streams it: letter by letter, once; reduced motion shows it whole. */
function Typed({ text, calm }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (calm) { setN(text.length); return; }
    setN(0);
    let k = 0, t;
    const step = () => { k += 1; setN(k); if (k < text.length) t = setTimeout(step, 28); };
    t = setTimeout(step, 60);
    return () => clearTimeout(t);
  }, [text, calm]);
  return <><span>{text.slice(0, n)}</span><span className="fl-ghost" aria-hidden="true">{text.slice(n)}</span></>;
}

/* Beyond, in the one dark room: the playground, led by its inspector. Play, pause, next, previous, or pick a node;
   what it received and what it returned are the object here, not another copy of the canvas. */
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
  // the one place the playground appears; its heading is the chapter "Step through it" just above, so it adds none
  return (
    <section ref={ref} className="bz-sec fl-play" data-room="dark" aria-label="The playground">
      <div className="bz-wrap">
        <div className="fl-pg">
          <div className="fl-pg-bar">
            <span className="x-mono"><i className={play && live ? 'on' : ''} aria-hidden="true" />flow.hanzo.ai<em>playground</em></span>
            <span className="fl-pg-state x-mono" aria-live="polite">{two(i + 1)} / 06</span>
          </div>
          <div className="fl-pg-stage">
            <p className="fl-pg-node"><span className="x-mono">{two(i + 1)} / 06</span><b>{NODES[i].t}</b></p>
            <div className="fl-pg-io">
              <p><span className="x-mono">received</span><b>{NODES[i].r}</b></p>
              <i className={'fl-pg-flow' + (s % 2 && s < END ? ' go' : '') + (done ? ' done' : '')} aria-hidden="true"><em key={s} /></i>
              <p><span className="x-mono">returned</span><b className={done ? 'out' : 'wait'}>{done ? <Typed key={i} text={NODES[i].o} calm={calm} /> : <i className="fl-pg-wait" aria-hidden="true" />}</b></p>
            </div>
          </div>
          <div className="fl-pg-bot">
            <div className="fl-pg-ctl" role="group" aria-label="The playground">
              <button type="button" onClick={prev} disabled={s <= 0} aria-label="Previous"><Ico k="prev" /></button>
              <button type="button" className="main" onClick={() => setPlay(!play)} aria-label="Pause" aria-pressed={!play}><Ico k={play ? 'pause' : 'play'} /></button>
              <button type="button" onClick={next} aria-label="Next"><Ico k="next" /></button>
            </div>
            <ol className="fl-pg-steps">
              {NODES.map((n, k) => (
                <li key={n.t}><button type="button" className={(k === i ? 'on' : '') + (s > 2 * k ? ' done' : '')} onClick={() => node(k)} aria-current={k === i ? 'step' : undefined}><span className="x-mono">{two(k + 1)}</span><b>{n.t}</b></button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* REST opens into the flow, published three ways. */
const WAYS = [['REST', 'As a REST endpoint'], ['JSON', 'As JSON your Python app loads directly'], ['MCP', 'As an MCP server']];
function Ways() {
  const [w, setW] = useState(0);
  return (
    <div className="fl-ways">
      <div className="fl-ways-t" role="tablist" aria-label="Publish it three ways">
        {WAYS.map(([k], i) => <button key={k} type="button" role="tab" id={'fl-w-' + k} aria-selected={w === i} aria-controls={'fl-wp-' + k} onClick={() => setW(i)}>{k}</button>)}
      </div>
      {WAYS.map(([k, d], i) => (
        <div key={k} id={'fl-wp-' + k} role="tabpanel" aria-labelledby={'fl-w-' + k} hidden={w !== i} className="fl-ways-p">
          <span className="fl-ways-src">a flow</span>
          <i className="fl-ways-arrow" aria-hidden="true" />
          <p><b className="x-mono">{k}</b>{d}</p>
        </div>
      ))}
    </div>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Four facts, each a node on the strip that opens into its own page (synchronized.studio). */
/* The two commands, as the terminal at the close shows them. */
const Term = ({ copy }) => (
  <div className="fl-term">
    <div className="fl-term-bar"><span aria-hidden="true"><i /><i /><i /></span>{copy && <Copy text={'uv pip install hanzoflow\nuv run hanzoflow run'} />}</div>
    <pre className="x-mono"><span className="fl-cmd"><i>$</i>uv pip install hanzoflow</span>{'\n'}<span className="fl-cmd"><i>$</i>uv run hanzoflow run</span>{'\n'}<span className="fl-out">→ 127.0.0.1:7860<span className="fl-caret" /></span></pre>
  </div>
);

const FACTS = [
  { id: 'py', f: 'Python', t: 'Every component', d: 'A component is a Python class. Edit it in the browser and the change is live on the next run — no rebuild, no plugin format, no waiting for someone to add the parameter you need.', x: <div className="fl-pylib" aria-hidden="true">{['Models', 'vector stores', 'document loaders', 'text splitters', 'output parsers', 'memory', 'retrievers', 'toolkits'].map((t) => <span key={t}><b>{t}</b><em className="x-mono">Python class</em></span>)}</div> },
  { id: 'rest', f: 'REST', t: 'Or JSON, or MCP', d: 'As a REST endpoint, as JSON your Python app loads directly, or as an MCP server — after which the flow is a tool your coding agent can call.', x: <Ways /> },
  { id: 'port', f: ':7860', t: 'On your machine', d: 'uv pip install hanzoflow, then uv run hanzoflow run. It opens on 127.0.0.1:7860. Docker works too.', x: <Term /> },
  { id: 'mit', f: 'MIT', t: 'Self-hosted' },
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
  const [sec, live] = useLive(0.4);
  const [big, setBig] = useState(0);
  const [hand, setHand] = useState(false);
  // one figure is the moment at a time: it walks the wire by itself while seen; a pointer or focus takes it over
  useEffect(() => {
    if (!live || hand) return;
    const t = setTimeout(() => setBig((b) => (b + 1) % FACTS.length), 2400);
    return () => clearTimeout(t);
  }, [big, live, hand]);
  const take = (e) => { const c = e.target.closest?.('.fl-facts > li'); if (!c) return; setHand(true); setBig([...c.parentNode.children].indexOf(c)); };
  return (
    <section ref={sec} className="bz-sec fl-facts-sec" aria-label="Hanzo Flow">
      <div ref={ref} className="bz-wrap fl-strip" onPointerOver={(e) => e.pointerType === 'mouse' && take(e)} onPointerLeave={() => setHand(false)} onFocus={take} onBlur={() => setHand(false)}>
        <svg className="fl-wires" width="100%" height={w.h} aria-hidden="true">{w.d.map((d, k) => <path key={k} d={d} />)}</svg>
        <BizOpen label="Hanzo Flow" className="fl-facts" cardClass="fl-fact" items={FACTS.map((x, k) => ({
          id: x.id,
          className: big === k ? 'big' : undefined,
          label: x.f + ', ' + x.t,
          card: <><span className="fl-fact-port in" aria-hidden="true" /><b className="bz-fig">{x.f}</b><span className="fl-fact-t">{x.t}</span><span className="fl-fact-port out" aria-hidden="true" /></>,
          panel: (
            <div className={'fl-fp' + (x.x && x.id !== 'mit' ? ' wide' : '')}>
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
          <div className="fl-get-links"><More to={DEPLOY}>Deploy to Cloud</More></div>
        </div>
        <BizPaste name="Flow" prompt="Read https://hanzo.ai/skill.md and use Hanzo Flow in my project. Start with: hanzo flow workflows list" className="fl-paste" />
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
          <BizLines id="fl-end-h" className="bz-headline" lines={['Run it locally first']} />
          <p className="bz-body">uv pip install hanzoflow, then uv run hanzoflow run. It opens on 127.0.0.1:7860. Docker works too.</p>
        </div>
        <Term copy />
      </div>
      <div className="bz-wrap">
        <A to={GH} className="fl-gh"><span>View on GitHub</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
      </div>
    </section>
  );
}

/* The closing band: the page's own line (the one big type on the last screens), the one ask, then the footer. */
function Close() {
  return (
    <section className="fl-band" aria-labelledby="fl-band-h">
      <div className="bz-wrap fl-band-in">
        <h2 id="fl-band-h" className="bz-display md">Build an AI workflow on a canvas, ship it as an API</h2>
        <div className="bz-acts"><BizAsk to={APP} cta="flow.close">Open Flow</BizAsk><More to={DOCS}>Documentation</More></div>
      </div>
    </section>
  );
}

export default function Flow() {
  return (
    <main className="bz fl">
      <span data-ask-name="Hanzo Flow" hidden />
      <Hero />
      <Chapters />
      <Playground />
      <Facts />
      <GetFlow />
      <End />
      <Close />
    </main>
  );
}
