'use client';
/* Persona: developers running many agents against shared MCP tool servers. Goal: start zapd from the quick start. CTA: "Read the docs" → zap-proto.dev/docs/quick-start. Metric: install_copy.
   ZAP, v2. V2: 8/10 the wire is the Stage (pointer versus parser arrives huge in the dark room and settles), four hero figures, eight packets that open into sheets, a typed terminal, the sidecar counter as a full-width object, electric-cyan accent
   The wire is the object.
   Signature: pointer versus parser. The message lies in the buffer as it arrived (a sixteen-byte header, then a struct, a
   list, text and bytes on eight-byte boundaries); a reader asks for a field and the pointer jumps straight to its offset,
   while the same message as JSON text is walked character by character to get there. Choose the field yourself.
   Beyond: sidecars or one daemon. Set how many agents you run and count the tool-server processes each topology starts
   for the three servers of the example: one beside every agent, or one zapd in front of them. Structure only, no timings,
   because Hanzo publishes none.
   Motion budget: signature = the pointer and the walking parser; supporting = Stage (Settle), Open (packets as sheets),
   typing (the terminal). Colour: none (0 UI hues): the pointer and the walked text are white and silver in the dark
   room. Pause buttons on the wire, the terminal and the fleet. One dark room: the hero. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../../ui';
import { A, Img } from '../../kit';
import { useLive, useEvery, useSteps } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import Settle from '../../v2/Settle';
import { OpenCards } from '../../v2/OpenSheet';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import '../../v2/Scale.css';
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
      count.current.textContent = i + ' characters walked';
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
          <motion.i className="zp-ptr" animate={{ x: `${(f[1] / 8) * 100}%` }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} />
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
  const [paused, pauseBtn] = usePause({ right: 16, bottom: 16 });
  const live = live0 && !paused;
  const [pick, setPick] = useState(2);
  const [mine, setMine] = useState(false);
  const [at, choose] = useSteps(4, 3600, live);
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
              <A to="https://github.com/zap-proto/papers" className="w2-ghost">Read the Papers</A>
              <A to="https://github.com/zap-proto/spec" className="w2-ghost">GitHub</A>
            </div>
          </motion.div>
        </div>
        <div ref={ref}>
          <Settle from={1.04} lift={30}>
            <div className="zp-wire-box">
            {pauseBtn}
            <Wire pick={pick} live={live} auto={(
              <div className="zp-pick" role="radiogroup" aria-label="Read a field">
                <span className="x-mono">Read a field</span>
                {FIELDS.map(([t], i) => <button key={t} type="button" role="radio" aria-checked={pick === i} onClick={() => { setMine(true); setPick(i); }} className="x-mono">{t}</button>)}
              </div>
            )} />
            </div>
          </Settle>
        </div>
        <ol className="zp-points">
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

/* Each reason is a packet: a sixteen-byte header, filled a little more on every packet. */
const Hdr = ({ n }) => <span className="zp-hdr" aria-hidden="true">{Array.from({ length: 16 }).map((_, b) => <i key={b} className={b < 2 + n ? 'f' : ''} />)}</span>;

function Why() {
  return (
    <section className="w2-sec zp-why">
      <div className="w2-wrap">
        <div className="zp-split">
          <h2 className="w2-display s">Why bother</h2>
          <p className="w2-lede">JSON over HTTP is fine until a hundred agents are calling the same tools. Then the cost is the copies, and the fix is to stop making them.</p>
        </div>
        <OpenCards cols={4} className="zp-packets" items={WHY.map(([t, d], i) => ({ id: 'zp-' + i, k: String(i + 1).padStart(2, '0'), t, art: <Hdr n={i} />, body: <p>{d}</p> }))} />
      </div>
    </section>
  );
}

const TERM = `# Connect 12 MCP servers → 1 ZAP endpoint
$ zapd serve --port 9999
$ zapd add mcp --name github --url stdio://gh-mcp
$ zapd add mcp --name slack --url http://localhost:8080
$ zapd add mcp --name db --url zap+unix:///tmp/postgres.sock
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
  const [paused, pauseBtn] = usePause({ right: 12, bottom: 12 });
  const live = live0 && !paused;
  const lines = TERM.split('\n');
  const [k, setK] = useState(lines.length);
  useEffect(() => { if (live) setK(0); }, [live]);
  useEvery(600, live, () => setK((v) => (v >= lines.length + 4 ? 0 : v + 1)));
  return (
    <section className="w2-sec zp-run" ref={ref}>
      <div className="w2-wrap zp-run-grid">
        <div className="zp-run-copy">
          <h2 className="w2-headline">Four lines and it is running</h2>
          <p className="w2-body">One daemon in front of the servers you already have. Agents hold a single connection to it.</p>
          <p className="w2-body zp-zapd"><code>zapd</code> presents the tools and resources of every backend as one schema, whether the backend speaks MCP or ZAP.</p>
        </div>
        <div className="zp-term">
          {pauseBtn}
          <div className="zp-term-bar"><i /><i /><i /><span className="x-mono">Terminal</span><Copy text={lines.filter((l) => l.startsWith('$')).map((l) => l.slice(2)).join('\n')} /></div>
          <pre className="x-mono">{lines.map((l, i) => <span key={i} className={(l.startsWith('#') ? 'c' : '') + (i < k ? ' in' : '')}>{l}{'\n'}</span>)}</pre>
        </div>
      </div>
    </section>
  );
}

// the three servers the terminal above adds: github, slack, db
const SERVERS = ['github', 'slack', 'db'];

/* Sidecars or one daemon: the processes each topology starts, for as many agents as you say. */
function Fleet() {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ right: 16, top: 16 });
  const [n, setN] = useState(4);
  const [mine, setMine] = useState(false);
  // until you take the slider, the swarm grows by itself
  useEvery(1100, live && !mine && !paused, () => setN((v) => (v >= 16 ? 1 : v + 1)));
  const side = n * SERVERS.length;
  const box = (k, cls) => Array.from({ length: k }).map((_, i) => <i key={i} className={cls} style={{ '--s': i % 3 }} />);
  return (
    <div className="zp-fleet w2-object" ref={ref}>
      {pauseBtn}
      <label className="zp-fleet-k">
        <span>Agents you run</span>
        <b className="w2-fig">{n}</b>
        <input type="range" min="1" max="100" value={n} aria-label="Agents you run" onChange={(e) => { setMine(true); setN(+e.target.value); }} />
      </label>
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

function Built() {
  return (
    <section className="w2-sec zp-built">
      <div className="w2-wrap">
        <div className="zp-split">
          <h2 className="w2-headline">How it is put together</h2>
          <p className="w2-lede">Many agents on one side, many tool servers on the other, one address in the middle.</p>
        </div>
        <ul className="zp-stats">
          {[['N:1', 'Every agent, one address'], ['1:M', 'One schema over every backend'], ['0', 'Copies of the same tool server']].map(([k, d]) => (
            <li key={d}><b className="w2-fig">{k}</b><span>{d}</span></li>
          ))}
        </ul>
        <div className="zp-built-grid">
          <div className="zp-ascii"><pre className="x-mono">{ASCII}</pre></div>
          <Fleet />
        </div>
      </div>
    </section>
  );
}

function Point() {
  return (
    <section className="w2-sec zp-point">
      <div className="w2-wrap">
        <div className="zp-point-grid">
          <div className="zp-point-copy">
            <h2 className="w2-display s">Point one agent at it</h2>
            <p className="zp-chip x-mono"><span>Go</span> · <span>Rust</span> · <span>TypeScript</span></p>
            <p className="w2-lede">Start the daemon, add the MCP servers you already run, change one address in your agent.</p>
            <p className="w2-lede zp-strong">Nothing else about your setup has to move.</p>
            <div className="zp-acts"><A to="https://zap-proto.dev/docs" className="w2-cta" data-cta="zap.close">Read the docs</A><A to="https://github.com/zap-proto/spec" className="w2-ghost">View on GitHub</A></div>
          </div>
          <div className="zp-note">
            <p>What ZAP saves depends on your workload, your payload size and your topology. The claim here is about mechanism, not about a number: a reader that walks the buffer in place does no parsing and no allocation, and shared backends run one process where per-agent sidecars run many. Measure it on your own traffic — we have not published a benchmark and will not quote one we cannot show you.</p>
          </div>
        </div>
        <div className="zp-proto">
          <h2 className="w2-title">Read the protocol</h2>
          <div className="zp-acts"><A to="https://docs.hanzo.ai/docs/zap" className="w2-ghost">Read the docs</A><A to="https://github.com/hanzoai" className="w2-ghost">View on GitHub</A></div>
        </div>
        <div className="zp-get">
          <div>
            <h2 className="w2-headline">Get ZAP</h2>
            <p className="zp-get-tag">Zero-copy application protocol</p>
            <p className="zp-addr x-mono" aria-hidden="true">zap://localhost:9999<i /></p>
          </div>
          <div className="zp-get-meta">
            <span className="zp-chip2"><span>License:</span> Apache-2.0</span>
            <A to="https://github.com/hanzoai" className="zp-chip2">hanzoai</A>
            <A to="https://platform.hanzo.ai/deploy" className="w2-ghost">Deploy to Cloud</A>
            <A to="https://docs.hanzo.ai/docs/zap" className="w2-ghost">Self-host</A>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Zap() {
  return (
    <main className="zp w2">
      <NoJs />
      <Hero />
      <Why />
      <Running />
      <Built />
      <Point />
    </main>
  );
}
