'use client';
/* Hanzo MCP.
   V2: 8/10 code-first launch: a live tool-call stream beside the headline, Hanzo's figures as heroes, the runtime as sheets that stack, six tool domains on a drag rail that open into their page, one dark room for the config.
   Persona: a developer wiring tools into an agent client. Goal: add Hanzo MCP to their client. CTA: Browse 260+ tools (mcp.hero).
   Metric: cta_click on mcp.hero and mcp.close (data-cta; the event layer is the conductor's).
   Signature: cards that open. The six tool domains sit on a rail you drag (or swipe); click one and the card itself
   grows into a full sheet (a shared-element morph, synchronized.studio) holding every tool name that domain carries.
   Around it: the hero's live tool-call stream (Hanzo's tools firing with latency bars; the only figures are Hanzo's,
   2ms for code_search and 6.4ms for the Kai tools), the summary line as three huge figures that count up, and the
   runtime's three parts as sheets that stack as you scroll. The one dark room is the config block.
   Beyond: each opened domain lists the tool names Hanzo gives for it, so you can see what an agent gets before you
   install. Accent: orange, from the tool stream. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy, Count } from '../ui';
import { A, Go } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import '../v2/A2.css';
import './McpPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/mcp';
const ALL = 'https://docs.hanzo.ai/docs/mcp-tools/all-tools';
const GH = 'https://github.com/hanzoai/mcp';
const EASE = [0.16, 1, 0.3, 1];

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

function Stream() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  const [n, setN] = useState(9);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setInterval(() => setN((v) => v + 1), 900);
    return () => clearInterval(t);
  }, [seen, calm]);
  const rows = Array.from({ length: 9 }, (_, k) => n - 9 + k);
  return (
    <div className="mcp-stream" ref={ref} aria-hidden="true">
      <div className="mcp-stream-top"><span className="mcp-live" />hanzo mcp<span className="mcp-stream-t">stdio</span></div>
      <ul className="mcp-rows">
        <AnimatePresence initial={false}>
          {rows.slice().reverse().map((id) => {
            const c = CALLS[id % CALLS.length];
            return (
              <motion.li key={id} layout="position" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.45, ease: EASE }} className={'mcp-row d-' + c[0]}>
                <span className="mcp-tool x-mono"><i />{c[1]}</span>
                <span className="mcp-lane">
                  <b style={{ left: X(id) + '%', width: W(id, c) + '%' }} />
                  {c[2] && <em className="x-mono" style={{ left: X(id) + W(id, c) + 2 + '%' }}>{c[2]}</em>}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

const CLIENTS = ['Claude Desktop', 'Claude Code', 'Cursor', 'Hanzo Dev', 'Any MCP client'];

function Hero() {
  return (
    <section className="mcp-hero" aria-labelledby="mcp-h1">
      <div className="a2-wrap a2-grid mcp-hero-grid">
        <div className="mcp-hero-copy">
          <p className="a2-kick"><b>Hanzo MCP</b> · 260+ tools · 117 cloud services</p>
          <A2Lines as="h1" id="mcp-h1" className="a2-display s mcp-h1" lines={['The complete', 'MCP runtime for', 'coding, decisions,', 'browser, and cloud']} now />
          <p className="a2-body mcp-lede">Give any model a filesystem, shell, semantic AST code index, Kai sub-10ms decisions, Playwright &amp; Chrome DevTools browser control, issue tracking, persistent memory, and 1,538 typed Hanzo Cloud operations over stdio or streamable HTTP.</p>
          <div className="a2-acts">
            <A to={ALL} className="x-btn solid" data-thumb="Browse 260+ tools" data-cta="mcp.hero">Browse 260+ tools</A>
            <Go to={DOCS}>Read the docs</Go>
            <Go to={GH}>View on GitHub</Go>
          </div>
        </div>
        <motion.div className="mcp-hero-obj" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <Stream />
        </motion.div>
      </div>
      <div className="a2-wrap mcp-via">
        <p className="mcp-oss">Open source, MIT. Identical tool names and schemas in TypeScript, Python, and Rust — plus remote streamable HTTP at api.hanzo.ai/v1/mcp.</p>
        <div className="mcp-via-l">
          <span className="a2-kick">Available through</span>
          <ul>{CLIENTS.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

/* The summary line, as three figures. */
function Figures() {
  return (
    <section className="a2-sec mcp-figs" aria-label="38 unified action tools + 1,538 Cloud operations + 260+ specialized servers">
      <div className="a2-wrap">
        <p className="mcp-sum">
          <span className="mcp-f"><Count to={38} className="a2-fig" /> <span>unified action tools</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Count to={1538} className="a2-fig" delay={0.1} /> <span>Cloud operations</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Count to={260} suffix="+" className="a2-fig" delay={0.2} /> <span>specialized servers</span></span>
        </p>
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

function Parts() {
  return (
    <section className="a2-sec mcp-parts" aria-label="The runtime">
      <div className="a2-wrap">
        <ol className="mcp-stack">
          {PARTS.map(([t, d], i) => (
            <li key={t} className="mcp-sheet" style={{ '--i': i }}>
              <div className="mcp-sheet-copy">
                <h2 className="a2-headline">{t}<span className="mcp-sheet-n x-mono">{String(i + 1).padStart(2, '0')} / 03</span></h2>
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
  const rail = useRef(null);
  const moved = useDragRail(rail);
  const close = useRef(null);
  const last = useRef(null);
  useEffect(() => {
    if (open < 0) return;
    const l = window.__lenis;
    l?.stop?.();
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 80);
    const key = (e) => { if (e.key === 'Escape') setOpen(-1); };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); l?.start?.(); last.current?.focus({ preventScroll: true }); };
  }, [open]);
  const d = DOMAINS[open];
  return (
    <section className="a2-sec mcp-doms" aria-labelledby="mcp-doms-h">
      <div className="a2-wrap a2-grid mcp-doms-head">
        <div className="mcp-doms-t">
          <p className="a2-kick">Tool domains</p>
          <A2Lines id="mcp-doms-h" className="a2-display s" lines={['Every surface', 'an autonomous', 'team needs']} />
        </div>
        <p className="a2-lede mcp-doms-l">From local AST refactoring and headless browser verification to multi-region cloud deployments.</p>
      </div>
      <motion.ul className="mcp-rail" ref={rail} data-cursor="Drag" layoutScroll>
        {DOMAINS.map(([t, desc, tools], i) => (
          <li key={t}>
            <motion.button type="button" layoutId={'mcp-dom-' + i} className={'mcp-card d' + i} aria-haspopup="dialog" aria-expanded={open === i}
              onClick={(e) => { if (moved.current) { e.preventDefault(); return; } last.current = e.currentTarget; setOpen(i); }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ visibility: open === i ? 'hidden' : 'visible' }}>
              <span className="mcp-card-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="x-mono">{t}</h3>
              <p>{desc}</p>
              <span className="mcp-card-tools" aria-hidden="true">{tools.slice(0, 4).map((x) => <i key={x} className="x-mono">{x}</i>)}{tools.length > 4 && <i className="x-mono more">+{tools.length - 4}</i>}</span>
              <span className="mcp-card-open" aria-hidden="true">+</span>
            </motion.button>
          </li>
        ))}
      </motion.ul>
      <AnimatePresence>
        {d && (
          <motion.div className="mcp-open" key="open" layoutRoot>
            <motion.button type="button" className="mcp-open-scrim" aria-label="Close" tabIndex={-1} onClick={() => setOpen(-1)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            <motion.div layoutId={'mcp-dom-' + open} className={'mcp-open-card d' + open} role="dialog" aria-modal="true" aria-label={d[0]} transition={{ type: 'spring', stiffness: 300, damping: 30 }} data-lenis-prevent="">
              <motion.div className="mcp-open-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                <div className="mcp-open-top">
                  <span className="mcp-card-n x-mono">{String(open + 1).padStart(2, '0')} / 06</span>
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

const TOK = /(\/\/.*$)|("(?:[^"\\]|\\.)*")/g;
const hl = (l) => {
  const out = []; let last = 0;
  l.replace(TOK, (m, c, s, i) => { if (i > last) out.push(l.slice(last, i)); out.push(<span key={i} className={c ? 'c' : 's'}>{m}</span>); last = i + m.length; return m; });
  out.push(l.slice(last));
  return out;
};

/* the config split in two: a .mcp.json that copies as valid JSON, and the shell lines that copy as shell */
const JSON_BLOCK = CONFIG.split('\n').slice(1, 9).join('\n');
const SHELL = ['npm i -g hanzo', 'hanzo mcp              # stdio; the binary downloads on first run', 'hanzo mcp -t sse       # or over HTTP'];

function Config() {
  return (
    <section className="a2-sec a2-dark mcp-cfg" data-room="dark" aria-labelledby="mcp-cfg-h">
      <div className="a2-wrap a2-grid">
        <div className="mcp-cfg-copy">
          <p className="a2-kick">Get started</p>
          <A2Lines id="mcp-cfg-h" className="a2-display s" lines={['One config', 'block']} />
          <p className="a2-body">Use the --package= form for local stdio, or point any MCP client directly at https://api.hanzo.ai/v1/mcp over streamable HTTP.</p>
          <A to={ALL} className="mcp-ref">All MCP Tools Reference <span aria-hidden="true">→</span></A>
        </div>
        <div className="mcp-codes">
          <div className="mcp-code">
            <div className="mcp-code-bar"><span className="x-mono">.mcp.json</span><Copy text={JSON_BLOCK} /></div>
            <p className="mcp-code-c x-mono">// .mcp.json — add Hanzo MCP to any MCP client</p>
            <pre><code>{JSON_BLOCK.split('\n').map((l, i) => <span key={i} className="mcp-ln">{hl(l)}{'\n'}</span>)}</code></pre>
          </div>
          <div className="mcp-code">
            <div className="mcp-code-bar"><span className="x-mono">bash</span><Copy text={SHELL.map((l) => l.split('#')[0].trim()).join('\n')} /></div>
            <p className="mcp-code-c x-mono">// Or install the whole native stack once and run it yourself:</p>
            <pre><code>{SHELL.map((l, i) => <span key={i} className="mcp-ln">{l.includes('#') ? <>{l.slice(0, l.indexOf('#'))}<span className="c">{l.slice(l.indexOf('#'))}</span></> : l}{'\n'}</span>)}</code></pre>
          </div>
          {/* the block exactly as Hanzo writes it, for search and screen readers */}
          <pre className="x-sr">{CONFIG}</pre>
        </div>
      </div>
    </section>
  );
}

function Add() {
  return (
    <section className="a2-sec mcp-add" aria-labelledby="mcp-add-h">
      <div className="a2-wrap a2-grid">
        <div className="mcp-add-copy">
          <A2Lines id="mcp-add-h" className="a2-display s" lines={['Add Hanzo MCP', 'to your client']} />
          <p className="a2-lede">One block in .mcp.json, or connect over streamable HTTP at api.hanzo.ai/v1/mcp.</p>
          <div className="a2-acts">
            <A to={ALL} className="x-btn solid" data-cta="mcp.close">Browse All Tools</A>
            <Go to={GH}>GitHub</Go>
            <Go to="https://platform.hanzo.ai">Hanzo Platform</Go>
          </div>
          <p className="mcp-add-more"><span className="a2-kick">MCP</span><A to={DOCS} className="mcp-docs">MCP docs →</A></p>
        </div>
        <div className="mcp-repo">
          <h2>Get MCP</h2>
          <p>Model Context Protocol — 260+ tools</p>
          <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div><div><dt>★</dt><dd>8 stars</dd></div></dl>
          <div className="mcp-repo-acts">
            <A to={GH} className="mcp-gh x-mono">hanzoai/mcp</A>
            <Go to="https://platform.hanzo.ai/deploy">Deploy to Cloud</Go>
            <Go to={DOCS}>Self-host</Go>
          </div>
        </div>
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
      <Add />
    </main>
  );
}
