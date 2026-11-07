'use client';
/* Persona: developers running many agents against shared MCP tool servers. Goal: start zapd from the quick start. CTA: "Read the docs" → zap-proto.dev/docs/quick-start. Metric: install_copy.
   ZAP. V2: 7/10 the wire is the hero object (pointer versus parser in the dark room), four points, eight packets whose headers fill, a typed terminal, the gateway drawn as a diagram beside the sidecar counter, one ask closes; greys only
   The wire is the object.
   Signature: pointer versus parser. The message lies in the buffer as it arrived (a sixteen-byte header, then a struct, a
   list, text and bytes on eight-byte boundaries); a reader asks for a field and the pointer jumps straight to its offset,
   while the same message as JSON text is walked character by character to get there. Choose the field yourself.
   Beyond: sidecars or one daemon. Set how many agents you run and count the tool-server processes each topology starts
   for the three servers of the example: one beside every agent, or one zapd in front of them. Structure only, no timings,
   because Hanzo publishes none.
   Motion budget: signature = the pointer and the walking parser; supporting = Stage (Settle), Open (packets as sheets),
   typing (the terminal). No springs. Colour: none (0 UI hues): the pointer and the walked text are white and silver in the
   dark room. Pause buttons sit in each object's own bar or control row. One dark room: the hero. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy, Magnetic } from '../../ui';
import { A, Img } from '../../kit';
import { useLive, useEvery, useSteps } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import Settle from '../../v2/Settle';
import { OpenCards } from '../../v2/OpenSheet';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import './Zap.css';

// the example message: field, its offset in the buffer (bytes, 8-aligned after the 16-byte header), its length in words
const FIELDS = [['struct', 16, 2], ['list', 32, 3], ['text', 56, 2], ['bytes', 72, 2]];
const JSON_TXT = '{"struct":{"a":1,"b":2},"list":[1,2,3],"text":"hello","bytes":"aGk="}';
const POINTS = [['No parse', 'Read it where it landed.'], ['A 16-byte header', 'The whole header is sixteen bytes.'], ['Go · Rust · TS', 'One wire, three readers.'], ['MCP · A2A · ACP', 'All run on ZAP.']];

function Wire({ pick, auto, live }) {
  const f = FIELDS[pick];
  const target = JSON_TXT.indexOf('"' + f[0] + '"');
  const seen = useRef(null), cur = useRef(null), rest = useRef(null), count = useRef(null);
  useEffect(() => {
    // the JSON reader walks the text up to the field, one character at a time; written straight to the text nodes
    const len = f[0].length + 2;
    const draw = (i) => {
      if (!seen.current) return;
      seen.current.textContent = JSON_TXT.slice(0, i);
      cur.current.textContent = JSON_TXT.slice(i, i + len);
      rest.current.textContent = JSON_TXT.slice(i + len);
      count.current.textContent = i + (i === 1 ? ' character walked' : ' characters walked');
    };
    let i = 0, t = 0;
    // walks again from the start while it is seen: the parser pays this on every message
    const step = () => { i = Math.min(target, i + 1); draw(i); if (i < target) t = setTimeout(step, 22); else if (live) t = setTimeout(() => { i = 0; draw(0); t = setTimeout(step, 300); }, 1400); };
    draw(0);
    t = setTimeout(step, 120);
    return () => clearTimeout(t);
  }, [pick, target, live]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="zp-wire">
      <div className="zp-lane">
        <p className="zp-lane-k x-mono"><span>ZAP · the buffer that arrived</span><span>pointer + offset {f[1]}</span></p>
        <div className="zp-buf" aria-hidden="true">
          {Array.from({ length: 11 }).map((_, w) => {
            const hdr = w < 2;
            const fi = FIELDS.findIndex(([, o, n]) => w >= o / 8 && w < o / 8 + n);
            return (
              <div key={w} className={'zp-word' + (hdr ? ' hdr' : '') + (fi === pick ? ' on' : '')}>
                {Array.from({ length: 8 }).map((_, b) => <i key={b} />)}
                <span className="x-mono">{hdr ? (w === 0 ? 'header' : '') : fi >= 0 && w === FIELDS[fi][1] / 8 ? FIELDS[fi][0] : ''}</span>
              </div>
            );
          })}
          <motion.i className="zp-ptr" animate={{ x: `${(f[1] / 8) * 100}%` }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      <div className="zp-lane json">
        <p className="zp-lane-k x-mono"><span>JSON · the same message as text</span><span ref={count}>{target} characters walked</span></p>
        <p className="zp-json x-mono" aria-hidden="true">
          <span className="seen" ref={seen}>{JSON_TXT.slice(0, target)}</span><span className="cur" ref={cur}>{JSON_TXT.slice(target, target + f[0].length + 2)}</span><span ref={rest}>{JSON_TXT.slice(target + f[0].length + 2)}</span>
        </p>
      </div>
      {auto}
    </div>
  );
}

function Hero() {
  const [ref, live0] = useLive(0.25);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const live = live0 && !paused;
  const [pick, setPick] = useState(2);
  const [mine, setMine] = useState(false);
  // the four points keep stepping while they are seen, even once the wire has scrolled away (phone)
  const [ptsRef, ptsLive] = useLive(0.4);
  const [at, choose, chosen] = useSteps(4, 3600, ptsLive && !paused);
  useEvery(2800, live && !mine, () => setPick((p) => (p + 1) % FIELDS.length));
  return (
    <section className="zp-hero w2-dark" data-room="dark" aria-labelledby="zp-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="zp-top">
          <div>
            <LineMask as="h1" id="zp-h1" now className="w2-display zp-h1" lines={['ZAP']} />
            <p className="zp-kick x-mono"><Img src="/models/enso.webp" alt="" w={26} h={26} />Zero-Copy Agent Protocol</p>
          </div>
          <motion.div className="zp-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="zp-lede">The wire format is the data structure</p>
            <div className="zp-acts">
              <Magnetic strength={0.25}><A to="https://zap-proto.dev/docs/quick-start" className="w2-cta" data-thumb="Read the docs" data-cta="zap.hero">Read the docs <i aria-hidden="true">→</i></A></Magnetic>
              <A to="https://github.com/zap-proto/papers" className="zp-tlink">Read the Papers</A>
              <A to="https://github.com/zap-proto/spec" className="zp-tlink">GitHub</A>
            </div>
          </motion.div>
        </div>
        <div ref={ref}>
          <Settle from={1.03} lift={12}>
            <div className="zp-wire-box">
            <Wire pick={pick} live={live} auto={(
              <div className="zp-pick" role="radiogroup" aria-label="Read a field">
                <span className="x-mono">Read a field</span>
                {FIELDS.map(([t], i) => <button key={t} type="button" role="radio" aria-checked={pick === i} tabIndex={pick === i ? 0 : -1} onClick={() => { setMine(true); setPick(i); }} onKeyDown={(e) => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); const n = (i + d + FIELDS.length) % FIELDS.length; setMine(true); setPick(n); e.currentTarget.parentElement.querySelectorAll('button')[n]?.focus(); }} className="x-mono">{t}</button>)}
                <span className="zp-pause">{pauseBtn}</span>
              </div>
            )} />
            </div>
          </Settle>
        </div>
        <ol className={'zp-points' + (ptsLive && !paused && !chosen ? ' run' : '')} ref={ptsRef}>
          {POINTS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''}>
              <button type="button" aria-pressed={at === i} onClick={() => choose(i)}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')} / 04</span><b>{t}</b><em>{d}</em>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const WHY = [
  ['One tool server, not one per agent', 'Running an MCP server beside every agent duplicates the process, the schema and the idle memory as many times as you have agents. Put the servers behind one endpoint and the agents share them.'],
  ['The work you removed cannot be slow', 'Fewer processes to schedule and no text to turn into objects on either side of a call. That is where the time goes at scale, and the way to get it back is not to do it.'],
  ['It carries the protocol you already use', 'MCP, A2A and ACP layer on ZAP without changing what your code says. ZAP is underneath them, not instead of them.'],
  ['The message is already the object', 'Structs, lists, text and bytes are laid out on the wire in the shape a reader wants them, eight-byte aligned. Reading a field is a pointer and an offset into the buffer that arrived.'],
  ['Nothing to collect afterwards', 'A reader that walks the buffer in place allocates nothing per message, so there is no garbage to collect and no pause to tune away later.'],
  ['Existing MCP servers, wrapped', 'Point the daemon at the MCP servers you already run — over stdio, over HTTP, over a Unix socket — and it presents their tools as one federated schema. Agents connect once and see everything.'],
  ['Keys arrive instead of being fetched', 'ZAP carries its own key distribution: a service subscribes once and receives the snapshot, then rotations and revocations as they happen. Nothing polls a JWKS endpoint, and a revoked key stops working when it is revoked rather than when a cache expires.'],
  ['Three implementations, one wire', 'Go, Rust and TypeScript, held wire-compatible against a single schema file. The schema is the contract, and an incompatible change bumps its identifier rather than hoping nobody notices.'],
];

/* Each reason is a packet: a sixteen-byte header, filled a little more on every packet; the packet that lands fills it all. */
const Hdr = ({ n }) => <span className="zp-hdr" aria-hidden="true">{Array.from({ length: 16 }).map((_, b) => <i key={b} className={b < 2 + n ? 'f' : ''} style={{ '--b': b }} />)}</span>;

/* Why bother is a pinned stage on wide screens: the eight packets ride past on one wire as you scroll, one lands at a
   time (its header fills) and the caption counts 01 / 08. Phones and reduced motion get a swipe rail with a peek. */
function Why() {
  const sec = useRef(null), track = useRef(null);
  const calm = useReducedMotion();
  const [span, setSpan] = useState(0);
  const [on, setOn] = useState(0);
  useEffect(() => {
    const m = () => {
      const t = track.current; if (!t) return;
      const ul = t.querySelector('ul');
      setSpan(!calm && innerWidth >= 900 && ul ? Math.max(0, ul.scrollWidth - t.clientWidth) : 0);
    };
    m(); addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, [calm]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -span]);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (span) setOn(Math.min(WHY.length - 1, Math.max(0, Math.round(v * (WHY.length - 1))))); });
  useEffect(() => {
    // on the rail (phone), the packet nearest the left edge is the one that has landed
    const t = track.current; if (!t || span) return;
    const ul = t.querySelector('ul');
    const f = () => { const li = ul.children; let best = 0, d = 1e9; for (let i = 0; i < li.length; i++) { const k = Math.abs(li[i].getBoundingClientRect().left - ul.getBoundingClientRect().left); if (k < d) { d = k; best = i; } } setOn(best); };
    ul.addEventListener('scroll', f, { passive: true });
    return () => ul.removeEventListener('scroll', f);
  }, [span]);
  useEffect(() => { track.current?.querySelectorAll('.zp-packets > li').forEach((li, i) => li.classList.toggle('on', i === on)); }, [on]);
  return (
    <section ref={sec} className={'zp-why' + (span ? ' pinned' : '')} style={span ? { height: `calc(100svh + ${span}px)` } : undefined}>
      <div className="zp-why-stick">
        <div className="w2-wrap">
          <div className="zp-split">
            <LineMask as="h2" className="w2-display s" lines={['Why bother']} />
            <p className="w2-lede">JSON over HTTP is fine until a hundred agents are calling the same tools. Then the cost is the copies, and the fix is to stop making them.</p>
          </div>
          <div className="zp-why-track" ref={track}>
            <motion.div style={span ? { x } : undefined}>
              <OpenCards cols={4} className="zp-packets" items={WHY.map(([t, d], i) => ({ id: 'zp-' + i, k: String(i + 1).padStart(2, '0'), t, art: <Hdr n={i} />, body: <p>{d}</p> }))} />
            </motion.div>
          </div>
          <p className="zp-why-at x-mono" aria-hidden="true"><b>{String(on + 1).padStart(2, '0')}</b> / 08<i style={{ '--p': (on + 1) / WHY.length }} /></p>
        </div>
      </div>
    </section>
  );
}

const TERM = `# Connect 12 MCP servers → 1 ZAP endpoint
$ zapd serve --port 9999
$ zapd add mcp --name github --url stdio://gh-mcp
$ zapd add mcp --name slack  --url http://localhost:8080
$ zapd add mcp --name db     --url zap+unix:///tmp/postgres.sock
# Agents connect once: zap://localhost:9999`;

const ASCII = `┌─────────────────────────────────────────────────────────────────┐
│                        Agent Swarm                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Agent 1 │  │ Agent 2 │  │ Agent 3 │  │ Agent N │    ...      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘             │
│       │            │            │            │                   │
│       └────────────┴─────┬──────┴────────────┘                   │
│                          │                                       │
│                          ▼                                       │
│              ┌───────────────────────┐                           │
│              │      ZAP Gateway       │                           │
│              │   zap://localhost:9999│                           │
│              │                       │                           │
│              │  • Schema Federation  │                           │
│              │  • Request Routing    │                           │
│              │  • Capability Control │                           │
│              └───────────┬───────────┘                           │
│                          │                                       │
│       ┌──────────────────┼──────────────────┐                    │
│       │                  │                  │                    │
│       ▼                  ▼                  ▼                    │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐                │
│  │MCP Srv │       │ZAP Srv │       │MCP Srv │                │
│  │ GitHub  │       │ Native  │       │ Slack   │    ...         │
│  └─────────┘       └─────────┘       └─────────┘                │
└─────────────────────────────────────────────────────────────────┘`;

function Running() {
  const [ref, live0] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const live = live0 && !paused;
  const lines = TERM.split('\n');
  const [k, setK] = useState(lines.length);
  useEffect(() => { if (live) setK(0); }, [live]);
  useEvery(600, live, () => setK((v) => (v >= lines.length + 4 ? 0 : v + 1)));
  return (
    <section className="w2-sec tight zp-run" ref={ref}>
      <div className="w2-wrap zp-run-grid">
        <div className="zp-run-copy">
          <LineMask as="h2" className="w2-headline" lines={['Four lines and it is running']} />
          <p className="w2-body">One daemon in front of the servers you already have. Agents hold a single connection to it.</p>
          <p className="w2-body zp-zapd"><code>zapd</code> presents the tools and resources of every backend as one schema, whether the backend speaks MCP or ZAP.</p>
        </div>
        <div className="zp-term">
          <div className="zp-term-bar"><i /><i /><i /><span className="x-mono">Terminal</span><Copy text={lines.filter((l) => l.startsWith('$')).map((l) => l.slice(2)).join('\n')} /><span className="zp-pause">{pauseBtn}</span></div>
          <pre className="x-mono">{lines.map((l, i) => <span key={i} className={(l.startsWith('#') ? 'c' : '') + (i < k ? ' in' : '') + (i === k - 1 ? ' last' : '')}>{l.startsWith('$ ') ? <><span className="zp-ps">$ </span>{l.slice(2)}</> : l}{'\n'}</span>)}</pre>
        </div>
      </div>
    </section>
  );
}

// the three servers the terminal above adds: github, slack, db
const SERVERS = ['github', 'slack', 'db'];

/* A drawn slider (no browser control): drag the track, or arrows / Page keys / Home / End. */
function Slide({ n, set }) {
  const tr = useRef(null);
  const clamp = (v) => Math.max(1, Math.min(100, v));
  const at = (x) => { const r = tr.current.getBoundingClientRect(); return clamp(Math.round(1 + ((x - r.left) / r.width) * 99)); };
  const key = (e) => {
    const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
    if (d) { e.preventDefault(); set(clamp(n + d)); } else if (e.key === 'Home') { e.preventDefault(); set(1); } else if (e.key === 'End') { e.preventDefault(); set(100); }
  };
  return (
    <div ref={tr} className="zp-slide" role="slider" tabIndex={0} aria-label="Agents you run" aria-valuemin={1} aria-valuemax={100} aria-valuenow={n}
      onPointerDown={(e) => { tr.current.setPointerCapture(e.pointerId); set(at(e.clientX)); }} onPointerMove={(e) => { if (e.buttons) set(at(e.clientX)); }} onKeyDown={key}
      style={{ '--v': (n - 1) / 99 }}>
      <i className="zp-slide-t"><em /></i><b className="zp-slide-k" />
    </div>
  );
}

/* Sidecars or one daemon: the processes each topology starts, for as many agents as you say. */
function Fleet() {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [n, setN] = useState(4);
  const [mine, setMine] = useState(false);
  // until you take the slider, the swarm grows by itself
  useEvery(1100, live && !mine && !paused, () => setN((v) => (v >= 16 ? 1 : v + 1)));
  const side = n * SERVERS.length;
  const box = (k, cls) => Array.from({ length: k }).map((_, i) => <i key={i} className={cls} style={{ '--s': i % 3 }} />);
  return (
    <div className="zp-fleet w2-object" ref={ref}>
      <div className="zp-fleet-k">
        <span>Agents you run</span>
        <b className="w2-fig">{n}</b>
        <span className="zp-pause">{pauseBtn}</span>
        <Slide n={n} set={(v) => { setMine(true); setN(v); }} />
      </div>
      <div className="zp-topos">
        <div className="zp-topo">
          <p className="zp-topo-k">An MCP server beside every agent</p>
          <div className="zp-procs" aria-hidden="true">{box(Math.min(side, 300), 'p')}</div>
          <p className="zp-topo-n x-mono"><b>{side}</b> tool-server processes · {n - 1} more of each</p>
        </div>
        <div className="zp-topo one">
          <p className="zp-topo-k">One zapd in front, servers shared</p>
          <div className="zp-procs" aria-hidden="true">{box(SERVERS.length, 'p')}<i className="d" /></div>
          <p className="zp-topo-n x-mono"><b>{SERVERS.length}</b> tool-server processes and zapd · none repeated</p>
        </div>
      </div>
    </div>
  );
}

/* the diagram's wires draw themselves in the first time they are seen, agents to gateway, then gateway to servers.
   A clip wipes them downwards as whole strokes, so every line meets its box (no dash pattern on a stretched path). */
function Wires({ d, late, seen }) {
  return (
    <svg className={'zp-dia-l' + (seen ? ' on' : '') + (late ? ' late' : '')} viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      {d.map((p) => <path key={p} d={p} />)}
    </svg>
  );
}

/* Hanzo's gateway diagram, drawn: the same words as the ASCII (kept in the HTML, hidden, for the record). */
function Diagram() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <figure className="zp-dia" ref={ref}>
      <div className="zp-dia-swarm">
        <p className="x-mono">Agent Swarm</p>
        <div className="zp-dia-row">{['Agent 1', 'Agent 2', 'Agent 3', 'Agent N'].map((a) => <span key={a} className="x-mono">{a}</span>)}<em aria-hidden="true">...</em></div>
      </div>
      <Wires d={['M12.5 0 V16 H50', 'M87.5 0 V16 H50', 'M37.5 0 V16', 'M62.5 0 V16', 'M50 16 V32']} seen={seen} />
      <div className="zp-dia-gw">
        <b>ZAP Gateway</b>
        <span className="x-mono">zap://localhost:9999</span>
        <ul>{['Schema Federation', 'Request Routing', 'Capability Control'].map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <Wires d={['M50 0 V16', 'M50 16 H16.7 V32', 'M50 16 H83.3 V32', 'M50 16 V32']} late seen={seen} />
      <div className="zp-dia-row srv">{[['MCP Srv', 'GitHub'], ['ZAP Srv', 'Native'], ['MCP Srv', 'Slack']].map(([a, b]) => <span key={b}><b className="x-mono">{a}</b>{b}</span>)}<em aria-hidden="true">...</em></div>
      <pre className="x-mono" hidden>{ASCII}</pre>
    </figure>
  );
}

function Built() {
  return (
    <section className="w2-sec tight zp-built">
      <div className="w2-wrap">
        <div className="zp-split">
          <LineMask as="h2" className="w2-headline" lines={['How it is put together']} />
          <p className="w2-lede">Many agents on one side, many tool servers on the other, one address in the middle.</p>
        </div>
        <ul className="zp-stats">
          {[['N:1', 'Every agent, one address'], ['1:M', 'One schema over every backend'], ['0', 'Copies of the same tool server']].map(([k, d]) => (
            <li key={d}><LineMask as="p" className="w2-fig zp-fig" lines={[k]} /><span>{d}</span></li>
          ))}
        </ul>
        <div className="zp-built-grid">
          <Diagram />
          <Fleet />
        </div>
      </div>
    </section>
  );
}

function Point() {
  return (
    <section className="w2-sec tight zp-point">
      <div className="w2-wrap">
        <div className="zp-point-grid">
          <div className="zp-point-copy">
            <LineMask as="h2" className="w2-display s" lines={['Point one agent at it']} />
            <p className="zp-chip x-mono"><span>Go</span> · <span>Rust</span> · <span>TypeScript</span></p>
            <p className="w2-lede">Start the daemon, add the MCP servers you already run, change one address in your agent.</p>
            <p className="w2-lede zp-strong">Nothing else about your setup has to move.</p>
            <div className="zp-acts"><Magnetic strength={0.25}><A to="https://zap-proto.dev/docs" className="w2-cta" data-thumb="Read the docs" data-cta="zap.close">Read the docs <i aria-hidden="true">→</i></A></Magnetic><A to="https://github.com/zap-proto/spec" className="zp-tlink">View on GitHub</A></div>
          </div>
          <div className="zp-note">
            <p>What ZAP saves depends on your workload, your payload size and your topology. The claim here is about mechanism, not about a number: a reader that walks the buffer in place does no parsing and no allocation, and shared backends run one process where per-agent sidecars run many. Measure it on your own traffic — we have not published a benchmark and will not quote one we cannot show you.</p>
          </div>
        </div>
        <Band />
      </div>
    </section>
  );
}

const host = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
const Row = ({ to, children }) => <A to={to} className="zp-row"><span>{children}</span><em className="x-mono">{host(to)}</em><i aria-hidden="true">→</i></A>;

/* The close: one black band holds the protocol and the way to get it, as quiet rows; the only solid stays above. The
   address types itself in when the band arrives and its cursor keeps time while it is on screen. */
function Band() {
  const [ref, live] = useLive(0.4);
  const [seen, setSeen] = useState(false);
  useEffect(() => { if (live) setSeen(true); }, [live]);
  return (
    <div className={'zp-band w2-dark' + (seen ? ' seen' : '') + (live ? ' live' : '')} data-room="dark" ref={ref}>
      <div className="zp-band-proto">
        <h2 className="w2-title">Read the protocol</h2>
        <div className="zp-rows">
          <Row to="https://docs.hanzo.ai/docs/zap">Read the docs</Row>
          <Row to="https://github.com/hanzoai">View on GitHub</Row>
        </div>
      </div>
      <div className="zp-band-get">
        <LineMask as="h2" className="w2-headline" lines={['Get ZAP']} />
        <p className="zp-get-tag">Zero-copy application protocol</p>
        <p className="zp-addr x-mono" aria-hidden="true"><span>zap://localhost:9999</span><i /></p>
        <div className="zp-get-meta">
          <span className="zp-chip2"><span>License:</span> Apache-2.0</span>
          <A to="https://github.com/hanzoai" className="zp-chip2">hanzoai</A>
        </div>
        <div className="zp-rows">
          <Row to="https://platform.hanzo.ai/deploy">Deploy to Cloud</Row>
          <Row to="https://docs.hanzo.ai/docs/zap">Self-host</Row>
        </div>
      </div>
    </div>
  );
}

export default function Zap() {
  return (
    <main id="main" className="zp w2 gx">
      <NoJs />
      <Hero />
      <Why />
      <Running />
      <Built />
      <Point />
    </main>
  );
}
