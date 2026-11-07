'use client';
// Persona: a developer wiring tools into an agent client.
// Goal: add Hanzo MCP to their client.
// CTA: Browse 260+ tools (mcp.hero, data-thumb; after the hero the sticky header carries it; the close's one solid is Browse All Tools, mcp.close).
// Metric: cta_click mcp.hero (and mcp.close)
// Signature: cards that open: six tool domains on a drag rail, each card growing into the sheet that lists its tools.
// Beyond: each opened domain lists the tool names Hanzo gives for it, so you see what an agent gets before you install; the config copies as valid JSON.
/* Hanzo MCP.
   V2: 8/10 ink only; captions under headlines; .mcp.json copies as JSON and bash copies one command per row (notes shown, never copied, so it runs in zsh); phone is its own composition (h1 40px in 4 lines, the live stream inside 660px, the ask inside 812); one mover per screen (top sheet only, the rail's centre card only); domain cards lift and preview more tools on hover; 44px Copy everywhere.
   Signature: cards that open. The six tool domains sit on a rail you drag (or swipe); click one and the card itself
   grows into a full sheet (a shared-element morph, synchronized.studio) holding every tool name that domain carries.
   Around it: the hero's live tool-call stream (Hanzo's tools firing with latency bars; the only figures are Hanzo's,
   2ms for code_search and 6.4ms for the Kai tools), the summary line as three figures that rest at 64px and grow
   while they cross the screen, and the runtime's three parts as sheets that stack as you scroll. The one dark room,
   opening from a rounded card, is the config. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, CodeBlock } from '../kit';
import { Copy } from '../ui';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import A2Pause from '../v2/A2Pause';
import A2Room from '../v2/A2Room';
import A2Grow from '../v2/A2Grow';
import { T, EMPH, MOVE } from '../v2/A2Motion';
import '../v2/A2.css';
import './McpPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/mcp';
const ALL = 'https://docs.hanzo.ai/docs/mcp-tools/all-tools';
const GH = 'https://github.com/hanzoai/mcp';

/* Hanzo's tool names, in the order an agent might reach for them. */
const CALLS = [
  ['fs', 'read'], ['code', 'code_search', '2ms'], ['kai', 'kai_command_guard', '6.4ms'], ['exec', 'run'], ['browser', 'navigate'],
  ['browser', 'screenshot'], ['git', 'git'], ['kai', 'kai_decide', '6.4ms'], ['fs', 'apply_patch'], ['tracker', 'tracker_update'],
  ['hanzo', 'hanzo · Deploy'], ['memory', 'memory'], ['code', 'code_context'], ['kai', 'kai_injection_screen', '6.4ms'], ['fs', 'write'],
  ['browser', 'console'], ['hanzo', 'hanzo · Sandbox'], ['fetch', 'fetch'], ['code', 'code_ask'], ['exec', 'logs'], ['hanzo', 'hanzo · KMS'],
  ['plan', 'plan'], ['fs', 'search_text'], ['tracker', 'tracker_issues'],
];
const W = (i, c) => (c[2] ? (c[2] === '2ms' ? 3 : 7) : 12 + ((i * 37) % 44)); // bar width, % of the lane (drawn, not measured)
const X = (i) => (i * 23) % 38;

/* One call every 900 ms, by a chain of timeouts (no setInterval); it stops off screen and while paused. */
function Stream() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  const [n, setN] = useState(9);
  const [paused, setPaused] = useState(false);
  const [rh, setRh] = useState(46); // row height in px (40 on phones, set in CSS too)
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px)');
    const f = () => setRh(mq.matches ? 40 : 46);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    if (!seen || calm || paused) return;
    const t = setTimeout(() => setN((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [n, seen, calm, paused]);
  const rows = Array.from({ length: 10 }, (_, k) => n - 10 + k).filter((id) => id >= 0); // the 10th slides out below
  return (
    <div className={'mcp-stream a2-darkpanel' + (paused ? ' a2-paused' : '')} ref={ref}>
      <A2Pause paused={paused} onChange={setPaused} label="Pause" className="mcp-pause" />
      <div className="mcp-stream-top" aria-hidden="true"><span className="mcp-live" />hanzo mcp<span className="mcp-stream-t">stdio</span></div>
      <ul className="mcp-rows" aria-hidden="true">
        {rows.slice().reverse().map((id, at) => {
            const c = CALLS[id % CALLS.length];
            // rows ride on transforms only (y in row heights), so a new call never shifts layout; the 10th fades
            // out below the fold of the panel and then simply leaves the list
            return (
              <motion.li key={id} initial={id < 9 ? false : { opacity: 0, y: -16 }} animate={{ opacity: at > 8 ? 0 : 1, y: at * rh }} transition={MOVE} className={'mcp-row d-' + c[0] + (at === 0 ? ' now' : '')}>
                <span className="mcp-tool x-mono"><i />{c[1]}</span>
                <span className="mcp-lane">
                  <b style={{ left: X(id) + '%', width: W(id, c) + '%' }} />
                  {c[2] && <em className="x-mono" style={{ left: X(id) + W(id, c) + 2 + '%' }}>{c[2]}</em>}
                </span>
              </motion.li>
            );
          })}
      </ul>
    </div>
  );
}

const CLIENTS = ['Claude Desktop', 'Claude Code', 'Cursor', 'Hanzo Dev', 'Any MCP client'];

function Hero() {
  const via = useRef(null);
  const viaSeen = useInView(via, { once: true, amount: 0.8 });
  return (
    <section className="mcp-hero" aria-labelledby="mcp-h1">
      <div className="a2-wrap a2-grid mcp-hero-grid">
        <div className="mcp-hero-copy">
          {/* one h1, two line sets: Hanzo's three lines on wide screens, the same words in four lines at the phone's deck size
              (the inactive set is display:none, so it is neither seen nor read) */}
          <h1 id="mcp-h1" className="a2-display mcp-h1">
            <A2Lines as="span" className="mcp-h1-d" lines={['The complete MCP runtime', 'for coding, decisions,', 'browser, and cloud']} now />
            <A2Lines as="span" className="mcp-h1-p" lines={['The complete MCP', 'runtime for', 'coding, decisions,', 'browser, and cloud']} now />
          </h1>
          <p className="a2-kick show mcp-cap"><b>Hanzo MCP</b> · 260+ tools · 117 cloud services</p>
          <p className="a2-lede mcp-lede">Give any model a filesystem, shell, semantic AST code index, Kai sub-10ms decisions, Playwright &amp; Chrome DevTools browser control, issue tracking, persistent memory, and 1,538 typed Hanzo Cloud operations over stdio or streamable HTTP.</p>
          <div className="a2-acts">
            <Cta to={ALL} id="mcp.hero" thumb>Browse 260+ tools</Cta>
            <Cta to={DOCS} kind="quiet">Read the docs</Cta>
            <Cta to={GH} kind="link">View on GitHub</Cta>
          </div>
        </div>
        <motion.div className="mcp-hero-obj" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.15 }}>
          <Stream />
        </motion.div>
      </div>
      <div className={'a2-wrap mcp-via' + (viaSeen ? ' seen' : '')} ref={via}>
        <p className="mcp-oss">Open source, MIT. Identical tool names and schemas in TypeScript, Python, and Rust — plus remote streamable HTTP at api.hanzo.ai/v1/mcp.</p>
        <div className="mcp-via-l">
          <span className="a2-kick show">Available through</span>
          {/* arrival: each client lights in turn once (about 4 s), then rests */}
          <ul>{CLIENTS.map((c, k) => <li key={c} style={{ '--k': k }}>{c}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

/* A figure rises once out of its mask: only Hanzo's own number is ever shown (no count-up through other numbers). */
function Fig({ v, d = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  return <span className="a2-fig mcp-fig" ref={ref}><motion.span initial={calm ? false : { y: '105%' }} animate={seen ? { y: 0 } : undefined} transition={{ duration: T.line, ease: EMPH, delay: d }}>{v}</motion.span></span>;
}

/* The summary line, as three figures: they rest at 64px and grow while they are the moment, then settle back. */
function Figures() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 }); // the "+" signs breathe three times on arrival, then rest
  return (
    <section ref={ref} className={'a2-sec mcp-figs' + (seen ? ' seen' : '')} aria-label="38 unified action tools + 1,538 Cloud operations + 260+ specialized servers">
      <div className="a2-wrap">
        <A2Grow to={1.45} origin="50% 50%">
        <p className="mcp-sum">
          <span className="mcp-f"><Fig v="38" /> <span>unified action tools</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Fig v="1,538" d={0.1} /> <span>Cloud operations</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Fig v="260+" d={0.2} /> <span>specialized servers</span></span>
        </p>
        </A2Grow>
      </div>
    </section>
  );
}

/* The runtime in three parts: sheets that stack as you scroll. */
const PARTS = [
  ['Full-stack agent capabilities, ready out of the box', 'Core runtime (fs, exec, code, git, fetch, workspace, ui), semantic code intelligence (code_search, code_context, code_ask, code_index), Kai decision & safety guardrails (kai_decide, kai_command_guard, kai_injection_screen), browser CDP, issue tracker, and persistent memory.'],
  ['117 Hanzo Cloud services, 1,538 typed operations', 'Through the unified hanzo router and /docs/mcp-tools catalog, agents provision sandboxes, deploy containers across 34 regions, query vector indexes, rotate KMS secrets, verify IAM policies, and inspect billing usage under one bearer key.'],
  ['Scoped permissions & Kai safety screening', 'Every shell command and external input can pass through kai_command_guard and kai_injection_screen in single-digit milliseconds. Enable or drop tool groups per environment with --enable-tools and --disable-tools.'],
];
const CORE = ['fs', 'exec', 'code', 'git', 'fetch', 'workspace', 'ui', 'code_search', 'code_context', 'code_ask', 'code_index', 'kai_decide', 'kai_command_guard', 'kai_injection_screen', 'browser', 'cdp', 'tracker', 'memory'];

function PartArt({ i }) {
  if (i === 0) return <div className="mcp-art a0">{CORE.map((t, k) => <span key={t} className="x-mono" style={{ '--d': k * 0.35 + 's' }}>{t}</span>)}</div>;
  if (i === 1) return <div className="mcp-art a1">{Array.from({ length: 117 }).map((_, k) => <i key={k} style={{ animationDelay: ((k * 53) % 117) * 0.04 + 's' }} />)}</div>;
  return (
    <div className="mcp-art a2">
      <div className="mcp-gate x-mono"><span>kai_command_guard</span><span>kai_injection_screen</span></div>
      <div className="mcp-cmds">{[0, 1, 2, 3].map((k) => <span key={k} className={k === 2 ? 'stop' : ''} style={{ animationDelay: k * 0.9 + 's' }}><b /></span>)}</div>
    </div>
  );
}

/* Only the sheet on top runs its art: the last one whose top has passed 60% of the screen. One mover per screen. */
function useTopSheet(list) {
  const [on, setOn] = useState(0);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const kids = [...el.children];
      let k = 0;
      kids.forEach((c, i) => { if (c.getBoundingClientRect().top < innerHeight * 0.6) k = i; });
      setOn(k);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    addEventListener('scroll', go, { passive: true });
    addEventListener('resize', go);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', go); removeEventListener('resize', go); };
  }, [list]);
  return on;
}

function Parts() {
  const [paused, setPaused] = useState(false);
  const list = useRef(null);
  const on = useTopSheet(list);
  return (
    <section className="a2-sec mcp-parts" aria-label="The runtime">
      <div className={'a2-wrap mcp-parts-in' + (paused ? ' a2-paused' : '')}>
        <A2Pause paused={paused} onChange={setPaused} label="Pause" className="mcp-parts-pause" />
        <ol className="mcp-stack" ref={list}>
          {PARTS.map(([t, d], i) => (
            <li key={t} className={'mcp-sheet' + (on === i ? ' on' : '')} style={{ '--i': i }}>
              <div className="mcp-sheet-copy">
                <div className="mcp-sheet-head">
                  <h2 className="a2-headline">{t}</h2>
                  <span className="mcp-sheet-n x-mono">{String(i + 1).padStart(2, '0')} / 03</span>
                </div>
                <p className="a2-body">{d}</p>
              </div>
              <div className="mcp-sheet-art" aria-hidden="true"><PartArt i={i} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Six domains on a rail; each card opens into its own sheet. */
const DOMAINS = [
  ['fs & exec', 'read, write, stat, list, mkdir, rm, mv, apply_patch, search_text — plus exec with run, background, ps, kill, and logs so long-running dev servers and test suites stream cleanly.', ['read', 'write', 'stat', 'list', 'mkdir', 'rm', 'mv', 'apply_patch', 'search_text', 'run', 'background', 'ps', 'kill', 'logs']],
  ['code_search, code_context, code_ask, code_index', 'AST-aware symbol resolution, call graphs, cross-repository indexing, and structural transforms. Find every caller of a symbol in 2ms without grep noise.', ['code_search', 'code_context', 'code_ask', 'code_index']],
  ['kai_decide, kai_command_guard, kai_injection_screen', '13 purpose-built Kai decision, scoring, routing, log triage, recovery, and context compaction tools running in 6.4ms at a fraction of LLM token cost.', ['kai_decide', 'kai_command_guard', 'kai_injection_screen']],
  ['browser, cdp, git & fetch', 'Full Playwright and Chrome DevTools Protocol automation (navigate, click, screenshot, console, network), complete git workflows, and streaming HTTP fetch.', ['navigate', 'click', 'screenshot', 'console', 'network', 'git', 'fetch']],
  ['tracker, memory, think, plan & tasks', 'tracker_boards, tracker_issues, tracker_create, and tracker_update sync directly with engineering boards, while memory, think, and plan persist architecture context across sessions.', ['tracker_boards', 'tracker_issues', 'tracker_create', 'tracker_update', 'memory', 'think', 'plan', 'tasks']],
  ['hanzo (117 Cloud services · 1,538 ops)', 'Direct typed access to Deploy, Sandbox, IAM, KMS, KV, S3, Vector, Search, Crawl, Workflow, Commerce, and Billing — inspectable at docs.hanzo.ai/docs/mcp-tools.', ['Deploy', 'Sandbox', 'IAM', 'KMS', 'KV', 'S3', 'Vector', 'Search', 'Crawl', 'Workflow', 'Commerce', 'Billing']],
];

/* A rail the mouse can drag and fling; touch and trackpads scroll it natively. */
function useDragRail(ref) {
  const moved = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x0 = 0, s0 = 0, v = 0, lx = 0, lt = 0, down = false;
    const dn = (e) => { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved.current = false; x0 = lx = e.clientX; s0 = el.scrollLeft; lt = performance.now(); v = 0; el.classList.add('grab'); };
    const mv = (e) => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 6) moved.current = true; el.scrollLeft = s0 - dx; const t = performance.now(); v = (e.clientX - lx) / Math.max(1, t - lt); lx = e.clientX; lt = t; };
    const up = () => { if (!down) return; down = false; el.classList.remove('grab'); if (Math.abs(v) > 0.2) el.scrollBy({ left: -v * 320, behavior: 'smooth' }); };
    el.addEventListener('pointerdown', dn);
    addEventListener('pointermove', mv);
    addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', dn); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
  }, [ref]);
  return moved;
}

function Domains() {
  const [open, setOpen] = useState(-1);
  const [paused, setPaused] = useState(false);
  const rail = useRef(null);
  const moved = useDragRail(rail);
  const close = useRef(null);
  const last = useRef(null);
  const card = useRef(null);
  useEffect(() => {
    if (open < 0) return;
    const l = window.__lenis;
    l?.stop?.();
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 80);
    // Escape closes; Tab stays inside the open sheet; focus returns to the card that opened it
    const key = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key !== 'Tab' || !card.current) return;
      const f = [...card.current.querySelectorAll('a[href], button:not([tabindex="-1"])')];
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); l?.start?.(); last.current?.focus({ preventScroll: true }); };
  }, [open]);
  // idle on the rail: only the card nearest the rail's centre calls its tools (one mover), and only while the rail is seen
  const railSeen = useInView(rail, { amount: 0.1 });
  const [live, setLive] = useState(0);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = Math.max(r.left, 0) + Math.min(r.width, innerWidth) / 2;
      let best = 0, bd = Infinity;
      [...el.querySelectorAll('.mcp-card')].forEach((c, i) => { const q = c.getBoundingClientRect(); const dd = Math.abs(q.left + q.width / 2 - mid); if (dd < bd) { bd = dd; best = i; } });
      setLive(best);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    el.addEventListener('scroll', go, { passive: true });
    addEventListener('resize', go);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('scroll', go); removeEventListener('resize', go); };
  }, []);
  const d = DOMAINS[open];
  return (
    <section className="a2-sec mcp-doms" aria-labelledby="mcp-doms-h">
      <div className="a2-wrap a2-grid mcp-doms-head">
        <div className="mcp-doms-t">
          <A2Lines id="mcp-doms-h" className="a2-headline" lines={['Every surface', 'an autonomous team needs']} />
          <p className="a2-kick show mcp-cap">Tool domains</p>
        </div>
        <div className="mcp-doms-r">
          <p className="a2-lede mcp-doms-l">From local AST refactoring and headless browser verification to multi-region cloud deployments.</p>
          <A2Pause paused={paused} onChange={setPaused} label="Pause" className="mcp-doms-pause" />
        </div>
      </div>
      <motion.ul className={'mcp-rail' + (paused ? ' a2-paused' : '')} ref={rail} layoutScroll>
        {DOMAINS.map(([t, desc, tools], i) => (
          <li key={t}>
            <motion.button type="button" layoutId={'mcp-dom-' + i} className={'mcp-card d' + i + (railSeen && live === i ? ' live' : '')} aria-haspopup="dialog" aria-expanded={open === i}
              onClick={(e) => { if (moved.current) { e.preventDefault(); return; } last.current = e.currentTarget; setOpen(i); }} transition={MOVE} style={{ visibility: open === i ? 'hidden' : 'visible' }}>
              <h3 className="x-mono">{t}</h3>
              <p>{desc}</p>
              <span className="mcp-card-tools" aria-hidden="true">
                <span className="mcp-chips rest">{tools.slice(0, 4).map((x, k) => <i key={x} className="x-mono" style={{ '--cd': (k * 1.8).toFixed(1) + 's' }}>{x}</i>)}{tools.length > 4 && <i className="x-mono more">+{tools.length - 4}</i>}</span>
                {/* hover / focus preview: two more of the tools the sheet holds, and what is still behind it */}
                {tools.length > 4 && <span className="mcp-chips peek">{tools.slice(0, 6).map((x) => <i key={x} className="x-mono">{x}</i>)}{tools.length > 6 && <i className="x-mono more">+{tools.length - 6}</i>}</span>}
              </span>
              <span className="mcp-card-open" aria-hidden="true">+</span>
            </motion.button>
          </li>
        ))}
      </motion.ul>
      <AnimatePresence>
        {d && (
          <motion.div className="mcp-open" key="open" layoutRoot>
            <motion.button type="button" className="mcp-open-scrim" aria-label="Close" tabIndex={-1} onClick={() => setOpen(-1)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: T.base }} />
            <motion.div layoutId={'mcp-dom-' + open} className={'mcp-open-card d' + open} role="dialog" aria-modal="true" aria-label={d[0]} transition={{ duration: T.slow, ease: EMPH }} data-lenis-prevent="" ref={card}>
              <motion.div className="mcp-open-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                <div className="mcp-open-top">
                  <button ref={close} type="button" className="mcp-open-x" aria-label="Close" onClick={() => setOpen(-1)}>×</button>
                </div>
                <h3 className="mcp-open-h x-mono">{d[0]}</h3>
                <p className="a2-lede">{d[1]}</p>
                <ul className="mcp-open-tools">{d[2].map((x, k) => <li key={x} className="x-mono" style={{ animationDelay: 0.2 + k * 0.035 + 's' }}>{x}</li>)}</ul>
                <A to={ALL} className="mcp-open-more">All MCP Tools Reference →</A>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const CONFIG = `// .mcp.json — add Hanzo MCP to any MCP client
{
  "mcpServers": {
    "hanzo": {
      "command": "npx",
      "args": ["-y", "hanzo", "mcp"]
    }
  }
}

// Or install the whole native stack once and run it yourself:
//   npm i -g hanzo
//   hanzo mcp              # stdio; the binary downloads on first run
//   hanzo mcp -t sse       # or over HTTP`;

/* the config split in two: a .mcp.json that copies as valid JSON, and the shell lines; each copies exactly what it shows */
const JSON_BLOCK = CONFIG.split('\n').slice(1, 9).join('\n');
/* the shell lines: one Copy per command, so a paste never queues a blocking `hanzo mcp` before `-t sse`, and Hanzo's
   `#` notes stay on screen as unselectable annotations (default zsh has no interactive comments, so they never ride along) */
const SHELL = [['npm i -g hanzo'], ['hanzo mcp', '# stdio; the binary downloads on first run'], ['hanzo mcp -t sse', '# or over HTTP']];

function Shell() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 }); // the rows light in turn once (about 4 s), then rest
  return (
    <figure ref={ref} className={'x-codeblock mcp-sh' + (seen ? ' go' : '')} data-room="dark">
      <figcaption className="x-codeblock-h"><span>bash</span></figcaption>
      <ol className="mcp-sh-rows">
        {SHELL.map(([cmd, note], i) => (
          <li key={cmd} style={{ '--k': i }}>
            <span className="mcp-sh-line x-mono"><span className="mcp-sh-cmd"><span className="mcp-sh-p" aria-hidden="true">$ </span><code>{cmd}</code></span>{note && <span className="mcp-sh-note">{note}</span>}</span>
            <Copy text={cmd} label="Copy" />
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Config() {
  return (
    <A2Room className="a2-sec mcp-cfg" aria-labelledby="mcp-cfg-h">
      <div className="a2-wrap a2-grid">
        <div className="mcp-cfg-copy">
          <A2Lines id="mcp-cfg-h" className="a2-headline" lines={['One config block']} />
          <p className="a2-kick show mcp-cap">Get started</p>
          <p className="a2-body">Use the --package= form for local stdio, or point any MCP client directly at https://api.hanzo.ai/v1/mcp over streamable HTTP.</p>
          <A to={ALL} className="mcp-ref">All MCP Tools Reference <span aria-hidden="true">→</span></A>
        </div>
        <div className="mcp-codes">
          <div>
            <p className="mcp-code-c x-mono">// .mcp.json — add Hanzo MCP to any MCP client</p>
            <CodeBlock code={JSON_BLOCK} label=".mcp.json" />
          </div>
          <div>
            <p className="mcp-code-c x-mono">// Or install the whole native stack once and run it yourself:</p>
            <Shell />
          </div>
          {/* the block exactly as Hanzo writes it, for search */}
          <pre className="x-sr" aria-hidden="true">{CONFIG}</pre>
        </div>
      </div>
    </A2Room>
  );
}

/* The close: one solid ask on a light stage beside the repository card, where a terminal types the one command.
   The header's ask goes quiet while "Browse All Tools" is on screen (it is marked as the hero ask's twin), so one
   solid shows at a time. "Deploy to Cloud" is outlined. */
const RUN = 'npx -y hanzo mcp';
function Typed() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const END = RUN.length + 6; // types once, connects, then rests on that static frame
  const [k, setK] = useState(0);
  useEffect(() => {
    if (calm) { setK(END); return; }
    if (!seen || k >= END) return;
    const t = setTimeout(() => setK((v) => v + 1), k === 0 ? 500 : k >= RUN.length ? 120 : 70);
    return () => clearTimeout(t);
  }, [k, seen, calm, END]);
  const n = Math.min(k, RUN.length);
  return (
    <p className="mcp-typed x-mono" ref={ref} aria-hidden="true">
      <span className="mcp-typed-p">$</span>{RUN.slice(0, n)}<i className={'mcp-caret' + (n === RUN.length ? ' on' : '')} />
      <span className={'mcp-typed-ok' + (k >= END ? ' on' : '')}><span className="mcp-live" /><span className="mcp-typed-name">hanzo mcp</span><span>stdio</span></span>
    </p>
  );
}

function Close() {
  return (
    <section className="a2-sec mcp-close" aria-labelledby="mcp-close-h" data-ask-hide="">
      <div className="a2-wrap a2-grid mcp-close-grid">
        <div className="mcp-close-copy">
          <A2Lines id="mcp-close-h" className="a2-display mcp-close-h" lines={['Add Hanzo MCP', 'to your client']} />
          <p className="a2-lede mcp-close-l">One block in .mcp.json, or connect over streamable HTTP at api.hanzo.ai/v1/mcp.</p>
          <div className="mcp-close-acts">
            <Cta to={ALL} id="mcp.close" size="lg" data-thumb="Browse 260+ tools">Browse All Tools</Cta>
          </div>
          <p className="mcp-add-more"><span className="a2-kick">MCP</span><A to={DOCS} className="mcp-docs">MCP docs <span aria-hidden="true">→</span></A></p>
          <div className="mcp-add-links">
            <Cta to={GH} kind="link" id="mcp.close-github">GitHub</Cta>
            <Cta to="https://platform.hanzo.ai" kind="link" id="mcp.close-platform">Hanzo Platform</Cta>
          </div>
        </div>
        <motion.div className="mcp-repo" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: T.slower, ease: EMPH }}>
          <h2 id="mcp-get-h" className="a2-headline">Get MCP</h2>
          <p>Model Context Protocol — 260+ tools</p>
          <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div><div><dt>★</dt><dd>8 stars</dd></div></dl>
          <Typed />
          <A to={GH} className="mcp-gh x-mono">hanzoai/mcp</A>
          <div className="mcp-repo-acts">
            <Cta to="https://platform.hanzo.ai/deploy" kind="quiet" id="mcp.close-deploy">Deploy to Cloud</Cta>
            <Cta to={DOCS} kind="link" id="mcp.close-selfhost">Self-host</Cta>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function McpPage() {
  return (
    <main className="a2 mcp">
      <Hero />
      <Figures />
      <Parts />
      <A2Paste name="MCP" text="Read https://hanzo.ai/skill.md and use Hanzo MCP in my project. Start with: hanzo mcp create" />
      <Domains />
      <Config />
      <Close />
    </main>
  );
}
