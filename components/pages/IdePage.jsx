'use client';
// Persona: a developer choosing an AI editor.
// Goal: open the IDE.
// CTA: Open the IDE (ide.hero; the close repeats it in the Band).
// Metric: cta_click ide.hero
// Signature: an editor that remembers: real code, memories surfacing in its gutter, the editor settling as you scroll.
// Beyond: Tell it something: file one thing about your project in a memory and watch it fade and come back.
/* Hanzo IDE.
   V2: 8/10 the deck scale (h1 52, sections 26, one statement that grows while it is the moment); real code in a live editor with a pause control, memories surfacing in its gutter from the first second; the workbench exploding off its Rust engine, three pinned chapters, one dark room that opens from a rounded card, a start script that types itself, kit Cta and Band, related apps that open into their pages. Greys only.
   Persona: a developer choosing an AI editor. Goal: open the IDE. CTA: Open the IDE (ide.hero, sticky in the ask bar).
   Metric: cta_click on ide.hero and ide.close (data-cta; the event layer is the conductor's).
   Signature: an editor that remembers. The hero object is the workbench itself: it starts huge and settles as you
   scroll (Stage), while a cursor walks the code and memories surface in the gutter beside the lines they belong to,
   the impact radius of a change glows through the file and the agent panel runs Hanzo's example session (live).
   Then the workbench lifts off its Rust engine as two planes (exploded view, scrubbed); the three promises are pinned
   chapters whose picture changes (memory, call graph, sandbox); the one dark room holds the memory tiers.
   Beyond: "Tell it something" - write one thing about your project, file it as what happened, what is true or how
   things are done here, and watch it sit in that memory, fading when unused and coming back at full strength when
   you recall it. Nothing is saved or sent. Greys only (docs/JAMES.md). Every word is Hanzo's, and the editor's text is
   Hanzo's own start script from this page. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Cta, Band } from '../kit';
import A2Paste from '../v2/A2Paste';
import A2Chapters from '../v2/A2Chapters';
import useNarrow from '../v2/A2Narrow';
import A2Pause from '../v2/A2Pause';
import A2Grow from '../v2/A2Grow';
import { MOVE } from '../v2/A2Motion';
import '../v2/A2.css';
import usePhoneAsk from './usePhoneAsk';
import './IdePage.css';

const IDE = 'https://ide.hanzo.ai';
const GH = 'https://github.com/hanzoai/ide';

/* The editor shows real text: Hanzo's own start script from this page. Each memory belongs to a line of it. */
const SCRIPT_LINES = ['# Open it in the browser', 'open https://ide.hanzo.ai', '', '# Or build the desktop app from source', 'git clone https://github.com/hanzoai/ide.git', 'cd ide', 'npm install', 'npm run tauri:dev', '', '# First launch: pick a provider, paste a key, choose a model.'];
const MEMS = [
  [4, 'episodic', 'what happened'],
  [5, 'semantic', 'what is true about the project'],
  [7, 'procedural', 'how things are done here'],
];
const IMPACT = [4, 5, 6, 7];
const LAST = SCRIPT_LINES.length - 1;
const SESSION = [['$', 'hanzo'], ['>', 'deploy the gateway to staging'], ['·', 'reading the project'], ['✓', 'gateway is on staging']];
const ramp = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
/* Lines: the page's own line-mask cut-in (700 ms, 60 ms apart, ease-emphasis), done in CSS so the server paint and the
   client agree under every preference (the shared A2Lines branches on reduced motion while rendering). `now` cuts in
   on first paint; otherwise when the heading reaches the screen. Reduced motion and JS off show the final lines. */
/* Room: the dark room that enters as a rounded card inside the gutters and opens to full width as it is reached (as
   the shared A2Room), with no preference branch while rendering: phones and reduced motion open it in CSS. */
function Room({ className = '', children, ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const clip = useTransform(p, (v) => { const k = 1 - Math.min(1, Math.max(0, v)); return `inset(0px ${Math.round(k * 32)}px round ${Math.round(k * 24)}px)`; });
  return <motion.section ref={ref} className={'a2-dark ide-room ' + className} data-room="dark" style={{ clipPath: clip }} {...rest}>{children}</motion.section>;
}

function Lines({ lines, as = 'h2', className = '', now, id }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const Tag = as;
  return (
    <Tag className={className + ' ide-lines' + (now || seen ? ' go' : '')} id={id} ref={ref}>
      {lines.map((l, i) => <span className="ide-ln" key={i} style={{ '--i': i }}><span>{l}</span>{i < lines.length - 1 ? ' ' : null}</span>)}
    </Tag>
  );
}
/* one line of shell, lightly coloured in greys: comments faint, the command word bright, URLs quieter */
const Shell = ({ l }) => {
  if (!l) return ' ';
  if (l.startsWith('#')) return <span className="ide-cm">{l}</span>;
  const [w, ...rest] = l.split(' ');
  return <><span className="ide-kw">{w}</span>{rest.length ? ' ' : ''}{rest.map((r, i) => <span key={i} className={r.includes('://') ? 'ide-url' : ''}>{r}{i < rest.length - 1 ? ' ' : ''}</span>)}</>;
};

function Editor() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.01 }); // it starts the moment any of it is on screen, so the hero is alive at once
  const calm = useReducedMotion();
  const [t, setT] = useState(99); // the finished picture is in the HTML; the browser replays it
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    if (!seen || calm) { setT(99); return; }
    let alive = true, h = 0;
    const end = LAST + 6;
    const tick = (v) => { if (!alive) return; setT(v); h = setTimeout(() => tick(v >= end ? 0 : v + 1), v >= end ? 4200 : 520); };
    // the finished picture holds for 1.5 s, then its memories leave in order before the replay (no hard reset)
    h = setTimeout(() => tick(0), 1500);
    return () => { alive = false; clearTimeout(h); };
  }, [seen, calm, paused]);
  // each line that carries a memory keeps its text clear of that chip and its dashed lead (the chip can grow on hover)
  useEffect(() => {
    const w = ref.current;
    if (!w) return;
    const lis = w.querySelectorAll('.ide-lines li'), chips = w.querySelectorAll('.ide-mem');
    const set = () => MEMS.forEach(([line], i) => {
      const c = chips[i];
      if (!c || !lis[line]) return;
      const lead = parseFloat(getComputedStyle(c, '::before').width) || 0;
      lis[line].style.setProperty('--mw', Math.ceil(c.offsetWidth + lead + 24) + 'px');
    });
    set();
    const ro = new ResizeObserver(set);
    chips.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);
  const cursor = Math.min(t, LAST);
  const hit = t >= LAST + 1 && t < 99 ? true : t === 99;
  return (
    <div className={'ide-win' + (paused ? ' a2-paused' : '')} ref={ref}>
      <div className="ide-bar">
        <A2Pause paused={paused} onChange={setPaused} label="Pause" className="ide-pause" />
        <span className="ide-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ide-title"><b>IDE</b> — Hanzo</span>
      </div>
      <div className="ide-body">
        <div className="ide-act" aria-hidden="true"><i className="on" /><i /><i /><i /></div>
        <div className="ide-tree" aria-hidden="true">
          <span className="ide-crumb x-mono"><b>api</b></span>
          {[70, 52, 64, 40, 58, 46].map((w, i) => <i key={i} className={i === 2 ? 'on' : ''} style={{ width: w + '%' }} />)}
        </div>
        <div className="ide-code">
          <div className="ide-crumbs x-mono"><span>api.hanzo.ai</span><span>/v1/code</span></div>
          <ol className="ide-lines x-mono" aria-hidden="true">
            {SCRIPT_LINES.map((l, i) => (
              <li key={i} className={(i === cursor && t < 99 ? 'cur' : '') + (hit && IMPACT.includes(i) ? ' hit' : '') + (MEMS.some((m) => m[0] === i) ? ' m' : '')}>
                <span className="ide-n">{i + 1}</span>
                <span className="ide-src"><Shell l={l} /></span>
              </li>
            ))}
          </ol>
          <ul className="ide-mems">
            {MEMS.map(([line, kind, what], i) => (
              <motion.li key={kind} className={'ide-mem k-' + kind} style={{ top: line * 28 + 'px' }} initial={false} animate={t >= line + 1 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 16, scale: 0.94 }} transition={t >= line + 1 ? MOVE : { ...MOVE, delay: i * 0.06 }}>
                <span className="ide-mem-k x-mono">{kind}</span>
                <span className="ide-mem-w">{what}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <aside className="ide-agent">
          <span className="ide-agent-h"><Mark size={13} /> Hanzo</span>
          <ul>
            {SESSION.map(([p, s], i) => <li key={s} className={'k' + i + (t >= LAST + 2 + i ? ' on' : '')}><span className="ide-p">{p}</span>{s}</li>)}
          </ul>
          <A to="https://hanzo.team/" className={'ide-open' + (t >= LAST + 5 ? ' on' : '')}>Open in the console</A>
        </aside>
      </div>
      {/* an editor's own status bar; the app links shared with /cli and /desktop moved to the close (End) */}
      <div className="ide-status" aria-hidden="true">
        <span className="ide-status-dot" />
        <span className="ide-status-r x-mono">Rust · Open VSX</span>
      </div>
    </div>
  );
}

/* Stage: the words first, the editor beneath the buttons (never over them); as you scroll it rises into place and
   settles from a little larger to its own size, while the words make way. */
function Stage() {
  const ref = useRef(null);
  const copy = useRef(null);
  const obj = useRef(null);
  const sy = useMotionValue(0); // how far the editor rises as you scroll: it rests under the buttons in normal flow (no jump on hydration)
  const ss = useMotionValue(1); // it starts at its own size: no pop after hydration
  const narrow = useNarrow();
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [ready, setReady] = useState(false); // the server and the first client paint agree; preferences apply after mount
  useEffect(() => setReady(true), []);
  const still = ready && (calm || narrow);
  useEffect(() => {
    const m = () => {
      const c = copy.current, o = obj.current;
      if (!c || !o) return;
      sy.set(Math.max(0, o.offsetTop - 96)); // it rises from under the buttons to just below the header
    };
    m();
    addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, [sy, ss]);
  const k = (v) => (still ? 1 : ramp(v, 0, 0.55));
  const scale = useTransform([p, ss], ([v, s0]) => (still ? 1 : s0 + (1 - s0) * k(v)));
  const y = useTransform([p, sy], ([v, up]) => (still ? 0 : -up * k(v)));
  const fade = useTransform(p, (v) => (still ? 1 : 1 - ramp(v, 0.04, 0.3))); // functions: an accelerated scroll fade does not clamp
  const lift = useTransform(p, (v) => (still ? 0 : -160 * ramp(v, 0, 0.3)));
  const cap = useTransform(p, (v) => (still ? 1 : ramp(v, 0.5, 0.62)));
  return (
    <section className="ide-stage" ref={ref} aria-labelledby="ide-h1">
      <div className="ide-stick">
        <motion.div className="a2-wrap ide-copy" style={{ opacity: fade, y: lift }} ref={copy}>
          <p className="a2-kick"><b>Hanzo IDE</b> · Developers</p>
          <Lines as="h1" id="ide-h1" className="a2-display ide-h1" lines={['An IDE that remembers', 'your codebase']} now />
          <div className="ide-copy-row">
            <p className="a2-lede">The editor you already know, on a Rust engine that is ours. The agent keeps a memory of your project across sessions, reads the call graph before it changes a line, and runs every tool in a sandbox.</p>
            <div className="a2-acts"><Cta to={IDE} id="ide.hero" thumb>Open the IDE</Cta><Cta to={GH} kind="link">View on GitHub</Cta></div>
          </div>
        </motion.div>
        <motion.div className="ide-obj" style={{ scale, y }} ref={obj}>
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
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  // no reduced-motion branch in render (it would differ from the server); CSS shows the final state under reduced motion
  const lift = useTransform(p, [0.2, 1], [0, -120]);
  const tilt = useTransform(p, [0.2, 1], [0, 14]);
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
          <A2Grow to={1.55}><Lines id="ide-engine-h" className="a2-display s" lines={['The workbench you know,', 'on an engine', 'that is ours']} /></A2Grow>
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
      <ol className="ide-pic-code x-mono">
        {SCRIPT_LINES.map((l, k) => <li key={k}><span>{k + 1}</span><span className="ide-pic-src"><Shell l={l} /></span></li>)}
      </ol>
      {MEMS.map(([line, kind, what], k) => (
        <p key={kind} className={'ide-pic-chip k-' + kind} style={{ top: 28 + line * 34 + 'px', animationDelay: 0.12 + k * 0.14 + 's' }}><span className="x-mono">{kind}</span><span className="ide-pic-w">{what}</span></p>
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
            <h2 id="ide-teach-h" className="a2-headline">It remembers</h2>
          </div>
          <form className="ide-teach-f" onSubmit={add}>
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} aria-label="One thing about your project" placeholder="One thing about your project" />
            <div role="radiogroup" aria-label="Kind of memory">
              {MEMS.map(([, k, d], i) => <button key={k} type="button" role="radio" aria-checked={kind === i} onClick={() => setKind(i)}>{d}</button>)}
            </div>
            <button type="submit" className="ide-add" disabled={!text.trim()} aria-label="Remember it"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
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
                    <li key={m.id + ':' + m.n}><span>{m.t}</span><button type="button" onClick={() => recall(m.id)} aria-label="Recall"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 2.8v2.5H6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button></li>
                  ))}</ul>
                ) : <p className="ide-teach-none" aria-label="Nothing yet.">—</p>}
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
  const [paused, setPaused] = useState(false);
  return (
    <Room className="a2-sec ide-dark" aria-labelledby="ide-caps-h">
      <div className="a2-wrap a2-grid">
        <div className="ide-caps-vis"><div className={'ide-tiers-box' + (paused ? ' a2-paused' : '')}><A2Pause paused={paused} onChange={setPaused} label="Pause" className="ide-tiers-pause" /><Tiers /></div></div>
        <div className="ide-caps-copy">
          <p className="a2-kick">Capabilities</p>
          <Lines id="ide-caps-h" className="a2-headline" lines={['What the window carries']} />
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
    </Room>
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
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  let d = 0; // each line types after the one before it (time, not scroll)
  return (
    <section className="a2-sec ide-start" aria-labelledby="ide-start-h">
      <div className="a2-wrap a2-grid">
        <div className="ide-start-copy">
          <p className="a2-kick">Get started</p>
          <Lines id="ide-start-h" className="a2-headline" lines={['Open it in the browser,', 'or build it on your machine']} />
        </div>
        <div className="ide-script" ref={ref}>
          <div className="ide-script-bar"><span className="x-mono">bash</span><Copy text={SCRIPT} /></div>
          <pre className={seen && !calm ? 'type' : ''}>{SCRIPT.split('\n').map((l, i) => {
            const n = Math.max(1, l.length), at = d;
            d += n * 0.01 + 0.07; // the whole script lands in about 3 s
            return <span key={i} className={l.startsWith('#') ? 'c' : ''} style={{ '--n': n, '--d': at + 's' }}>{l || ' '}</span>;
          })}</pre>
        </div>
      </div>
    </section>
  );
}

function End() {
  return (
    <section className="a2-sec ide-end" aria-label="Get IDE">
      <div className="a2-wrap">
        <div className="ide-end-in">
          <div className="ide-get">
            <span className="ide-get-i"><Mark size={22} /></span>
            <h2 className="a2-headline">Get IDE</h2>
            <div className="ide-get-acts"><Cta to="https://platform.hanzo.ai/deploy" kind="quiet">Deploy to Cloud</Cta><Cta to={GH} kind="link">GitHub</Cta><Cta to="https://platform.hanzo.ai" kind="link">Hanzo Cloud</Cta></div>
          </div>
          <div className="ide-rel">
            <p className="a2-kick show">Related capabilities</p>
            {/* big cards: Morph flies the one you click into the next page's hero (synchronized.studio) */}
            <div>{[['CLI', '/cli', '$ hanzo'], ['Playground', '/playground', '> _'], ['Desktop', '/desktop', '⌘']].map(([t, to, g]) => <A key={t} to={to} className="ide-rel-a"><span className="ide-rel-g x-mono" aria-hidden="true">{g}</span><b data-morph="">{t}</b><span className="ide-rel-i" aria-hidden="true">→</span></A>)}</div>
            <nav className="ide-apps" aria-label="Hanzo apps">
              <A to={IDE} aria-current="page">IDE</A><A to="/cli">CLI</A><A to="/playground">Playground</A><A to="/desktop">Desktop</A><A to="/cloud/api-keys">API Keys</A>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function IdePage() {
  usePhoneAsk();
  return (
    <main className="a2 ide">
      <Stage />
      <A2Paste name="IDE" text="Read https://hanzo.ai/skill.md and use Hanzo IDE in my project. Start with: hanzo code" />
      <Engine />
      <Promises />
      <Teach />
      <Caps />
      <Start />
      <End />
      <Band title="Open the IDE. It already knows the way around." lede="Your project, its call graph, and what the agent learned last week, in one window." action="Open the IDE" to={IDE} />
    </main>
  );
}
