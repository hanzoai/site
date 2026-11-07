'use client';
/* Hanzo IDE. V2: 8/10 Stage hero (the editor arrives huge and settles into place as you scroll, memories surfacing in its gutter), the workbench exploding off its Rust engine, three pinned chapters, one dark room, detail tucked into an accordion.
   Signature: an editor that remembers. The hero object is the workbench itself: it starts huge and settles as you
   scroll (Stage), while a cursor walks the code and memories surface in the gutter beside the lines they belong to,
   the impact radius of a change glows through the file and the agent panel runs Hanzo's example session (live).
   Then the workbench lifts off its Rust engine as two planes (exploded view, scrubbed); the three promises are pinned
   chapters whose picture changes (memory, call graph, sandbox); the one dark room holds the memory tiers.
   Beyond: "Tell it something" - write one thing about your project, file it as what happened, what is true or how
   things are done here, and watch it sit in that memory, fading when unused and coming back at full strength when
   you recall it. Nothing is saved or sent. Accent: indigo, from the editor's own selection colour. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Go } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import A2Chapters from '../v2/A2Chapters';
import useNarrow from '../v2/A2Narrow';
import '../v2/A2.css';
import './IdePage.css';

const IDE = 'https://ide.hanzo.ai';
const GH = 'https://github.com/hanzoai/ide';

/* The code is drawn, not written: line shapes in syntax colours. Each memory belongs to a line. */
const LINES = [[2, 14, 3, 22], [2, 30], [], [1, 8, 2, 18, 1, 9], [3, 12, 2, 26], [3, 20, 1, 14], [3, 9], [1, 4], [], [1, 10, 2, 16], [3, 22, 2, 11], [3, 28], [3, 16, 1, 12, 2, 8], [1, 4], [], [2, 26], [1, 12, 3, 20]];
const MEMS = [
  [3, 'episodic', 'what happened'],
  [5, 'semantic', 'what is true about the project'],
  [10, 'procedural', 'how things are done here'],
];
const IMPACT = [4, 5, 6, 11, 12];
const SESSION = [['$', 'hanzo'], ['>', 'deploy the gateway to staging'], ['·', 'reading the project'], ['✓', 'gateway is on staging']];
const ramp = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const pairs = (segs) => segs.reduce((a, v, k) => (k % 2 ? a : [...a, [v, segs[k + 1]]]), []);

function Editor() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [t, setT] = useState(99); // the finished picture is in the HTML; the browser replays it
  useEffect(() => {
    if (!seen || calm) { setT(99); return; }
    let alive = true, h = 0;
    const tick = (v) => { if (!alive) return; setT(v); h = setTimeout(() => tick(v >= 16 ? 0 : v + 1), v >= 16 ? 4200 : 480); };
    tick(0);
    return () => { alive = false; clearTimeout(h); };
  }, [seen, calm]);
  const cursor = Math.min(t, LINES.length - 1);
  return (
    <div className="ide-win" ref={ref}>
      <div className="ide-bar">
        <span className="ide-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ide-title"><b>IDE</b> — Hanzo</span>
      </div>
      <nav className="ide-tabs" aria-label="Hanzo apps">
        <A to={IDE} className="on">IDE</A><A to="/cli">CLI</A><A to="/playground">Playground</A><A to="/desktop">Desktop</A><A to="/cloud/api-keys">API Keys</A>
      </nav>
      <div className="ide-body">
        <div className="ide-act" aria-hidden="true"><i className="on" /><i /><i /><i /></div>
        <div className="ide-tree" aria-hidden="true">
          <span className="ide-crumb x-mono"><b>api</b></span>
          {[70, 52, 64, 40, 58, 46].map((w, i) => <i key={i} className={i === 2 ? 'on' : ''} style={{ width: w + '%' }} />)}
        </div>
        <div className="ide-code">
          <div className="ide-crumbs x-mono"><span>api.hanzo.ai</span><span>/v1/code</span></div>
          <ol className="ide-lines" aria-hidden="true">
            {LINES.map((segs, i) => (
              <li key={i} className={(i === cursor && t < 99 ? 'cur' : '') + (t >= 12 && IMPACT.includes(i) ? ' hit' : '')}>
                <span className="ide-n x-mono">{i + 1}</span>
                <span className="ide-src">{pairs(segs).map(([c, w], k) => <b key={k} className={'c' + c} style={{ width: w * 6 + 'px' }} />)}</span>
              </li>
            ))}
          </ol>
          <ul className="ide-mems">
            {MEMS.map(([line, kind, what]) => (
              <motion.li key={kind} className={'ide-mem k-' + kind} style={{ top: line * 26 + 'px' }} initial={false} animate={t >= line + 1 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 16, scale: 0.94 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} tabIndex={0}>
                <span className="ide-mem-k x-mono">{kind}</span>
                <span className="ide-mem-w">{what}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <aside className="ide-agent">
          <span className="ide-agent-h"><Mark size={13} /> Hanzo</span>
          <ul>
            {SESSION.map(([p, s], i) => <li key={s} className={'k' + i + (t >= 13 + i ? ' on' : '')}><span className="ide-p">{p}</span>{s}</li>)}
          </ul>
          <A to="https://hanzo.team/" className={'ide-open' + (t >= 16 ? ' on' : '')}>Open in the console</A>
        </aside>
      </div>
    </div>
  );
}

/* Stage: the words first, then the editor arrives huge and settles into its place as you scroll. */
function Stage() {
  const ref = useRef(null);
  const narrow = useNarrow();
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const still = calm || narrow;
  const scale = useTransform(p, [0, 0.55], still ? [1, 1] : [1.42, 1]);
  const y = useTransform(p, [0, 0.55], still ? ['0vh', '0vh'] : ['47vh', '0vh']);
  const fade = useTransform(p, (v) => (still ? 1 : 1 - ramp(v, 0.02, 0.26))); // functions: an accelerated scroll fade does not clamp
  const lift = useTransform(p, [0, 0.3], still ? [0, 0] : [0, -160]);
  const cap = useTransform(p, (v) => (still ? 1 : ramp(v, 0.5, 0.62)));
  return (
    <section className="ide-stage" ref={ref} aria-labelledby="ide-h1">
      <div className="ide-stick">
        <motion.div className="a2-wrap ide-copy" style={{ opacity: fade, y: lift }}>
          <p className="a2-kick"><b>Hanzo IDE</b> · Developers</p>
          <A2Lines as="h1" id="ide-h1" className="a2-display m ide-h1" lines={['An IDE that remembers', 'your codebase']} now />
          <div className="ide-copy-row">
            <p className="a2-lede">The editor you already know, on a Rust engine that is ours. The agent keeps a memory of your project across sessions, reads the call graph before it changes a line, and runs every tool in a sandbox.</p>
            <div className="a2-acts"><span data-thumb="Open the IDE" data-href={IDE} style={{ display: 'contents' }}><Go to={IDE} solid>Open the IDE</Go></span><Go to={GH}>View on GitHub</Go></div>
          </div>
        </motion.div>
        <motion.div className="ide-obj" style={{ scale, y }}>
          <Editor />
          <motion.div className="ide-under" style={{ opacity: cap }}>
            <p>Open source (Apache 2.0). The VS Code workbench on a Rust engine. Open VSX extensions run as they are.</p>
            <p>Example project. Every name in it is one you would give your own. <A to="/home">Open in the console</A></p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* Two planes: the workbench you know, lifting off the Rust engine as you scroll (an exploded view). */
function Planes() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const lift = useTransform(p, [0.2, 1], calm ? [-120, -120] : [0, -120]);
  const tilt = useTransform(p, [0.2, 1], calm ? [14, 14] : [0, 14]);
  return (
    <div className="ide-planes" ref={ref} aria-hidden="true">
      <motion.div className="ide-plane top" style={{ y: lift, rotateX: tilt }}>
        <span className="ide-plane-k x-mono">VS Code workbench</span>
        <div className="ide-plane-row">{['editor surface', 'extension model', 'keybindings'].map((t) => <span key={t}>{t}</span>)}</div>
      </motion.div>
      <div className="ide-plane bot">
        <span className="ide-plane-k x-mono">Rust</span>
        <div className="ide-plane-row">{['agent loop', 'memory', 'indexing', 'sandbox'].map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  );
}

function Engine() {
  return (
    <section className="a2-sec ide-engine" aria-labelledby="ide-engine-h">
      <div className="a2-wrap a2-grid">
        <div className="ide-engine-copy">
          <p className="a2-kick">What is Hanzo IDE</p>
          <A2Lines id="ide-engine-h" className="a2-display s" lines={['The workbench you know,', 'on an engine', 'that is ours']} />
          <p className="a2-body">The editor surface, the extension model and the keybindings are the ones you use today. Everything under them is Rust: the agent loop, the memory, the indexing, the sandbox.</p>
        </div>
        <div className="ide-engine-vis"><Planes /></div>
      </div>
    </section>
  );
}

/* The three promises as pinned chapters; the picture beside them changes with each one. */
const WHAT = [
  ['01', 'It remembers', 'Engram gives the agent a memory that lasts past the conversation: what happened, what is true about the project, and how things are done here. Memories are consolidated, decay when unused, and come back when they matter.'],
  ['02', 'It understands structure', 'Tree-sitter indexing gives the agent the call graph, the type hierarchy and the impact radius of a change, so it reads the code that matters instead of every file.'],
  ['03', 'It is safe by default', 'Tool calls run in a sandbox. Secrets live in the keychain, sensitive fields are encrypted at rest, and every action lands in an audit trail. All of it is in the core, none of it is a plugin.'],
];

const GRAPH = [[50, 50, 0], [24, 26, 1], [78, 24, 1], [20, 72, 1], [80, 74, 1], [50, 12, 2], [6, 48, 2], [94, 48, 2], [50, 90, 2]];
const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [1, 6], [3, 6], [2, 7], [4, 7], [3, 8], [4, 8]];

function Picture({ i }) {
  if (i === 0) return (
    <div className="ide-pic ide-pic-mem" key="m">
      <ol className="ide-pic-code">
        {LINES.slice(0, 12).map((segs, k) => (
          <li key={k}><span className="x-mono">{k + 1}</span>{pairs(segs).map(([c, w], j) => <b key={j} className={'c' + c} style={{ width: w * 7 + 'px' }} />)}</li>
        ))}
      </ol>
      {MEMS.map(([line, kind, what], k) => (
        <p key={kind} className={'ide-pic-chip k-' + kind} style={{ top: 28 + line * 30 + 'px', animationDelay: 0.12 + k * 0.14 + 's' }}><span className="x-mono">{kind}</span>{what}</p>
      ))}
    </div>
  );
  if (i === 1) return (
    <div className="ide-pic ide-pic-graph" key="g">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b], k) => <line key={k} x1={GRAPH[a][0]} y1={GRAPH[a][1]} x2={GRAPH[b][0]} y2={GRAPH[b][1]} className={GRAPH[b][2] < 2 ? 'in' : ''} vectorEffect="non-scaling-stroke" />)}
      </svg>
      <span className="ide-ring-r" />
      {GRAPH.map(([x, y, d], k) => <i key={k} className={'ide-g d' + d} style={{ left: 10 + x * 0.8 + '%', top: 10 + y * 0.8 + '%', animationDelay: 0.1 + d * 0.18 + 's' }} />)}
      <div className="ide-pic-legend">{['call graph', 'type hierarchy', 'impact radius'].map((w) => <span key={w}>{w}</span>)}</div>
    </div>
  );
  return (
    <div className="ide-pic ide-pic-safe" key="s">
      <div className="ide-box"><span className="x-mono">sandbox</span><p>tool call</p></div>
      <div className="ide-key"><svg viewBox="0 0 24 24" width="22" height="22"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg><span>keychain</span><em>encrypted at rest</em></div>
      <ol className="ide-trail">
        <li className="x-mono">audit trail</li>
        {['tool call', 'decision', 'approval'].map((w, k) => <li key={w} style={{ animationDelay: 0.2 + k * 0.16 + 's' }}><i />{w}</li>)}
      </ol>
    </div>
  );
}

function Promises() {
  return <A2Chapters label="What Hanzo IDE does" items={WHAT.map(([, t, d]) => ({ t, d }))} visual={(i) => <Picture i={i} />} />;
}

let MID = 1;
/* Tell it something: three kinds of memory; each fades unless recalled. State only, nothing leaves the page. */
function Teach() {
  const [text, setText] = useState('');
  const [kind, setKind] = useState(0);
  const [mems, setMems] = useState([{ id: 0, k: 0, t: 'gateway is on staging', n: 0 }]);
  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMems((m) => [...m, { id: MID++, k: kind, t, n: 0 }].slice(-9)); // keeps the last nine, enough to show the tiers
    setText('');
  };
  const recall = (id) => setMems((m) => m.map((x) => (x.id === id ? { ...x, n: x.n + 1 } : x)));
  return (
    <section className="a2-sec ide-teach" aria-labelledby="ide-teach-h">
      <div className="a2-wrap">
        <div className="a2-grid ide-teach-top">
          <div className="ide-teach-l">
            <p className="a2-kick">It remembers</p>
            <A2Lines id="ide-teach-h" className="a2-display s" lines={['Tell it', 'something']} />
          </div>
          <form className="ide-teach-f" onSubmit={add}>
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} placeholder="One thing about your project" aria-label="One thing about your project" />
            <div role="radiogroup" aria-label="Kind of memory">
              {MEMS.map(([, k, d], i) => <button key={k} type="button" role="radio" aria-checked={kind === i} onClick={() => setKind(i)}>{d}</button>)}
            </div>
            <button type="submit" className="x-btn solid" disabled={!text.trim()}>Remember it</button>
          </form>
        </div>
        <div className="ide-teach-g">
          {MEMS.map(([, k, d], i) => {
            const list = mems.filter((m) => m.k === i);
            return (
              <div key={k} className={'ide-teach-c k-' + k}>
                <p className="ide-teach-k"><span className="x-mono">{k}</span> {d}</p>
                {list.length ? (
                  <ul>{list.map((m) => (
                    <li key={m.id + ':' + m.n}><span>{m.t}</span><button type="button" onClick={() => recall(m.id)}>Recall</button></li>
                  ))}</ul>
                ) : <p className="ide-teach-none">Nothing yet.</p>}
              </div>
            );
          })}
        </div>
        <p className="ide-teach-s">Memories are consolidated, decay when unused, and come back when they matter.</p>
      </div>
    </section>
  );
}

/* The dark room: memory in three tiers, things flowing in, settling, fading. Detail opens one row at a time. */
const CAPS = [
  ['Three tiers of memory', 'A sensory buffer for the turn, working memory for the session, and a long-term graph of episodic, semantic and procedural memory that survives a restart.'],
  ['Recall that ranks', 'Full-text and vector search run together across every store, fused and reranked, and every answer arrives with a quality score.'],
  ['Agent profiles', 'Name what an agent may touch, which model it runs on, and how far it may go on its own. Switch profiles per task.'],
  ['An activity feed', 'Every tool call, every decision and every approval the agent made, in real time, in one column.'],
  ['Open VSX extensions', 'The extensions you rely on install from Open VSX and run natively. Language servers, themes, keymaps.'],
  ['Ten layers of security', 'PII detection, field-level encryption, sandbox enforcement, keychain integration and audit trails, built into the engine.'],
];

function Tiers() {
  return (
    <div className="ide-tiers" aria-hidden="true">
      <div className="ide-ring r3"><span className="x-mono">long-term graph</span></div>
      <div className="ide-ring r2"><span className="x-mono">working memory</span></div>
      <div className="ide-ring r1"><span className="x-mono">sensory buffer</span></div>
      {Array.from({ length: 9 }).map((_, i) => <i key={i} className="ide-mote" style={{ '--a': i * 40 + 'deg', animationDelay: i * -0.9 + 's' }} />)}
      {['episodic', 'semantic', 'procedural'].map((k, i) => <b key={k} className={'ide-node n' + i}><span className="x-mono">{k}</span></b>)}
    </div>
  );
}

function Caps() {
  const [open, setOpen] = useState(0);
  return (
    <section className="a2-sec a2-dark ide-dark" data-room="dark" aria-labelledby="ide-caps-h">
      <div className="a2-wrap a2-grid">
        <div className="ide-caps-vis"><div className="ide-tiers-box"><Tiers /></div></div>
        <div className="ide-caps-copy">
          <p className="a2-kick">Capabilities</p>
          <A2Lines id="ide-caps-h" className="a2-headline" lines={['What the window carries']} />
          <ul className="ide-acc">
            {CAPS.map(([t, d], i) => (
              <li key={t} className={open === i ? 'on' : ''}>
                <h3><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{t}</span><i aria-hidden="true" /></button></h3>
                <div className="ide-acc-a" aria-hidden={open !== i} inert={open !== i}><p>{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const SCRIPT = `# Open it in the browser
open https://ide.hanzo.ai

# Or build the desktop app from source
git clone https://github.com/hanzoai/ide.git
cd ide
npm install
npm run tauri:dev

# First launch: pick a provider, paste a key, choose a model.`;

function Start() {
  return (
    <section className="a2-sec ide-start" aria-labelledby="ide-start-h">
      <div className="a2-wrap a2-grid">
        <div className="ide-start-copy">
          <p className="a2-kick">Get started</p>
          <A2Lines id="ide-start-h" className="a2-headline" lines={['Open it in the browser,', 'or build it on your machine']} />
        </div>
        <div className="ide-script">
          <div className="ide-script-bar"><span className="x-mono">bash</span><Copy text={SCRIPT} /></div>
          <pre>{SCRIPT.split('\n').map((l, i) => <span key={i} className={l.startsWith('#') ? 'c' : ''}>{l || ' '}{'\n'}</span>)}</pre>
        </div>
      </div>
    </section>
  );
}

function End() {
  return (
    <section className="a2-sec ide-end" aria-labelledby="ide-end-h">
      <div className="a2-wrap">
        <div className="a2-grid ide-end-in">
          <div className="ide-end-copy">
            <A2Lines id="ide-end-h" className="a2-display s" lines={['Open the IDE.', 'It already knows', 'the way around.']} />
            <p className="a2-lede">Your project, its call graph, and what the agent learned last week, in one window.</p>
            <div className="a2-acts"><Go to={IDE} solid>Open the IDE</Go><Go to={GH}>GitHub</Go><Go to="https://platform.hanzo.ai">Hanzo Cloud</Go></div>
          </div>
          <div className="ide-get">
            <span className="ide-get-i"><Mark size={22} /></span>
            <h2>Get IDE</h2>
            <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
          </div>
        </div>
        <div className="ide-rel">
          <p className="a2-kick">Related capabilities</p>
          <div>{[['CLI', '/cli'], ['Playground', '/playground'], ['Desktop', '/desktop']].map(([t, to]) => <A key={t} to={to} className="ide-rel-a">{t}<span aria-hidden="true">→</span></A>)}</div>
        </div>
      </div>
    </section>
  );
}

export default function IdePage() {
  return (
    <main className="a2 ide" style={{ '--acc': '#5e5ce6' }} data-acc-btn="">
      <Stage />
      <A2Paste name="IDE" text="Read https://hanzo.ai/skill.md and use Hanzo IDE in my project. Start with: hanzo code" />
      <Engine />
      <Promises />
      <Teach />
      <Caps />
      <Start />
      <End />
    </main>
  );
}
