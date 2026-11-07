'use client';
/* Hanzo IDE. Signature: an editor that remembers. The hero is the workbench itself: a cursor walks the code, and
   memories surface in the gutter beside the lines they belong to (what happened, what is true about the project,
   how things are done here), the impact radius of a change glows through the file, and the agent panel runs Hanzo's
   example session. Below, the workbench lifts off its Rust engine as two planes; the dark room shows the three
   tiers of memory consolidating and decaying. Beyond: "Tell it something" - write one thing about your project, file
   it as what happened, what is true or how things are done here, and watch it sit in that memory, fading when unused
   and coming back at full strength when you recall it. Nothing is saved or sent. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Rise, Copy, Mark } from '../ui';
import { A, Go, More, SecHead } from '../kit';
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

function Editor() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const calm = useReducedMotion();
  const [t, setT] = useState(99); // the finished picture is in the HTML; the browser replays it
  useEffect(() => {
    if (!seen || calm) { setT(99); return; }
    let alive = true, h = 0;
    const tick = (v) => { if (!alive) return; setT(v); h = setTimeout(() => tick(v >= 16 ? 0 : v + 1), v >= 16 ? 4200 : 520); };
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
                <span className="ide-src">{segs.length ? segs.reduce((a, v, k) => (k % 2 ? a : [...a, [v, segs[k + 1]]]), []).map(([c, w], k) => <b key={k} className={'c' + c} style={{ width: w * 6 + 'px' }} />) : null}</span>
              </li>
            ))}
          </ol>
          <ul className="ide-mems">
            {MEMS.map(([line, kind, what], i) => (
              <motion.li key={kind} className={'ide-mem k-' + kind} style={{ top: line * 24 + 'px' }} initial={false} animate={t >= line + 1 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 16, scale: 0.94 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} tabIndex={0}>
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

function Hero() {
  return (
    <section className="ide-hero" aria-labelledby="ide-h1">
      <div className="x-wrap">
        <div className="ide-top">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo IDE · Developers</motion.p>
            <h1 id="ide-h1" className="ide-h1">
              {['An IDE that remembers', 'your codebase'].map((l, i) => <span className="x-line" key={l}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{l}</motion.span></span>)}
            </h1>
          </div>
          <motion.div className="ide-side" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="ide-lede">The editor you already know, on a Rust engine that is ours. The agent keeps a memory of your project across sessions, reads the call graph before it changes a line, and runs every tool in a sandbox.</p>
            <div className="ide-acts"><span data-thumb="Open the IDE" data-href={IDE} style={{ display: 'contents' }}><Go to={IDE} solid>Open the IDE</Go></span><Go to={GH}>View on GitHub</Go></div>
          </motion.div>
        </div>
        <motion.div className="ide-stage" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Editor />
          <div className="ide-under">
            <p>Open source (Apache 2.0). The VS Code workbench on a Rust engine. Open VSX extensions run as they are.</p>
            <p>Example project. Every name in it is one you would give your own. <A to="/home">Open in the console</A></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo IDE in my project. Start with: hanzo code';
  return (
    <section className="ide-paste">
      <div className="x-wrap ide-paste-in">
        <div><p className="ide-paste-k">Paste and ship</p><p className="ide-paste-d">Paste this into any agent. It reads the skill manifest and calls IDE from there.</p></div>
        <div className="ide-prompt"><span className="x-mono ide-prompt-k">Agent prompt</span><code>{text}</code><Copy text={text} /></div>
      </div>
    </section>
  );
}

/* Two planes: the workbench you know, lifting off the Rust engine as you scroll. */
const WHAT = [
  ['It remembers', 'Engram gives the agent a memory that lasts past the conversation: what happened, what is true about the project, and how things are done here. Memories are consolidated, decay when unused, and come back when they matter.'],
  ['It understands structure', 'Tree-sitter indexing gives the agent the call graph, the type hierarchy and the impact radius of a change, so it reads the code that matters instead of every file.'],
  ['It is safe by default', 'Tool calls run in a sandbox. Secrets live in the keychain, sensitive fields are encrypted at rest, and every action lands in an audit trail. All of it is in the core, none of it is a plugin.'],
];

function Planes() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lift = useTransform(p, [0.15, 0.55], [0, -70]);
  const tilt = useTransform(p, [0.15, 0.55], [0, 10]);
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

function What() {
  return (
    <section className="x-sec ide-what">
      <div className="x-wrap">
        <div className="ide-what-top">
          <SecHead kicker="What is Hanzo IDE" title="The workbench you know, on an engine that is ours" lede="The editor surface, the extension model and the keybindings are the ones you use today. Everything under them is Rust: the agent loop, the memory, the indexing, the sandbox." />
          <Planes />
        </div>
        <ol className="ide-three">
          {WHAT.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.08}>
              <span className="ide-three-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The dark room: memory in three tiers, things flowing in, settling, fading. */
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
  return (
    <section className="x-sec ide-dark" data-room="dark">
      <div className="x-wrap">
        <SecHead dark kicker="Capabilities" title="What the window carries" />
        <div className="ide-caps">
          <div className="ide-tiers-box"><Tiers /></div>
          <ul className="ide-cap-list">
            {CAPS.map(([t, d], i) => (
              <Rise as="li" key={t} delay={i * 0.05} y={14}>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
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
    <section className="x-sec ide-start">
      <div className="x-wrap ide-start-in">
        <SecHead kicker="Get started" title="Open it in the browser, or build it on your machine" />
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
    <section className="x-sec ide-end">
      <div className="x-wrap">
        <div className="ide-end-in">
          <div>
            <SecHead title="Open the IDE. It already knows the way around." lede="Your project, its call graph, and what the agent learned last week, in one window." />
            <div className="ide-end-acts"><Go to={IDE} solid>Open the IDE</Go><Go to={GH}>GitHub</Go><Go to="https://platform.hanzo.ai">Hanzo Cloud</Go></div>
          </div>
          <div className="ide-get">
            <span className="ide-get-i"><Mark size={22} /></span>
            <h2>Get IDE</h2>
            <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
          </div>
        </div>
        <div className="ide-rel">
          <p className="x-kick">Related capabilities</p>
          <div>{[['CLI', '/cli'], ['Playground', '/playground'], ['Desktop', '/desktop']].map(([t, to]) => <A key={t} to={to} className="ide-rel-a">{t}<span aria-hidden="true">→</span></A>)}</div>
        </div>
      </div>
    </section>
  );
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
    setMems((m) => [...m, { id: MID++, k: kind, t, n: 0 }].slice(-9)); // shortcut: keeps the last nine, enough to show the tiers
    setText('');
  };
  const recall = (id) => setMems((m) => m.map((x) => (x.id === id ? { ...x, n: x.n + 1 } : x)));
  return (
    <section className="x-sec ide-teach">
      <div className="x-wrap">
        <p className="x-kick">It remembers</p>
        <h2 className="ide-teach-h">Tell it something</h2>
        <form className="ide-teach-f" onSubmit={add}>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} placeholder="One thing about your project" aria-label="One thing about your project" />
          <div role="radiogroup" aria-label="Kind of memory">
            {MEMS.map(([, k, d], i) => <button key={k} type="button" role="radio" aria-checked={kind === i} onClick={() => setKind(i)}>{d}</button>)}
          </div>
          <button type="submit" className="x-btn solid" disabled={!text.trim()}>Remember it</button>
        </form>
        <div className="ide-teach-g">
          {MEMS.map(([, k, d], i) => {
            const list = mems.filter((m) => m.k === i);
            return (
              <div key={k} className="ide-teach-c">
                <p className="ide-teach-k">{k} <span>· {d}</span></p>
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

export default function IdePage() {
  return (
    <main className="ide">
      <Hero />
      <Paste />
      <What />
      <Teach />
      <Caps />
      <Start />
      <End />
    </main>
  );
}
