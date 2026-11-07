'use client';
/* Hanzo MCP. Signature: the tool-call stream. Under the headline a full-bleed dark band runs a live waterfall of
   Hanzo's own tools firing one after another (fs, code_search, kai_command_guard, browser, git, tracker, hanzo cloud),
   each with its latency bar; the only figures shown are Hanzo's (2ms for code_search, 6.4ms for the Kai tools).
   The three-part runtime is a stepper that runs itself; the six tool domains spill their tool names as chips;
   the config block lights its lines. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, useTilt } from '../ui';
import { A, Go, More, SecHead } from '../kit';
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
const W = (i, c) => (c[2] ? (c[2] === '2ms' ? 3 : 7) : 12 + ((i * 37) % 44)); // bar width, % of the lane
const X = (i) => (i * 23) % 38; // bar start, % of the lane

function Stream() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  const [n, setN] = useState(8);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setInterval(() => setN((v) => v + 1), 820);
    return () => clearInterval(t);
  }, [seen, calm]);
  const rows = Array.from({ length: 8 }, (_, k) => n - 8 + k);
  return (
    <div className="mcp-stream" ref={ref}>
      <div className="mcp-stream-h x-mono">
        <span>tool</span><span>domain</span><span className="mcp-lane-h">latency</span>
      </div>
      <ul className="mcp-rows">
        <AnimatePresence initial={false}>
          {rows.slice().reverse().map((id) => {
            const c = CALLS[id % CALLS.length];
            return (
              <motion.li key={id} layout initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }} className={'mcp-row d-' + c[0]}>
                <span className="mcp-id x-mono">#{String(id + 1).padStart(4, '0')}</span>
                <span className="mcp-tool x-mono"><i />{c[1]}</span>
                <span className="mcp-dom x-mono">{c[0]}</span>
                <span className="mcp-lane">
                  <motion.b style={{ left: X(id) + '%', width: W(id, c) + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }} />
                  {c[2] && <em className="x-mono" style={{ left: X(id) + W(id, c) + 1 + '%' }}>{c[2]}</em>}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Hero() {
  return (
    <section className="mcp-hero" aria-labelledby="mcp-h1">
      <div className="x-wrap">
        <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo MCP · 260+ tools · 117 cloud services</motion.p>
        <motion.h1 id="mcp-h1" className="mcp-h1" initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, ease: EASE }}>The complete MCP runtime for coding, decisions, browser, and cloud</motion.h1>
        <div className="mcp-sub">
          <motion.p className="mcp-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>Give any model a filesystem, shell, semantic AST code index, Kai sub-10ms decisions, Playwright &amp; Chrome DevTools browser control, issue tracking, persistent memory, and 1,538 typed Hanzo Cloud operations over stdio or streamable HTTP.</motion.p>
          <motion.div className="mcp-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <Go to={ALL} solid>Browse 260+ tools</Go>
            <Go to={DOCS}>Read the docs</Go>
            <Go to={GH}>View on GitHub</Go>
          </motion.div>
        </div>
      </div>
      <motion.div className="mcp-band" data-room="dark" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
        <div className="x-wrap">
          <Stream />
          <div className="mcp-band-f">
            <p className="mcp-oss">Open source, MIT. Identical tool names and schemas in TypeScript, Python, and Rust — plus remote streamable HTTP at api.hanzo.ai/v1/mcp.</p>
            <div className="mcp-via">
              <span className="x-mono">Available through</span>
              <ul>{['Claude Desktop', 'Claude Code', 'Cursor', 'Hanzo Dev', 'Any MCP client'].map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* The runtime in three parts, running itself. */
const PARTS = [
  ['Full-stack agent capabilities, ready out of the box', 'Core runtime (fs, exec, code, git, fetch, workspace, ui), semantic code intelligence (code_search, code_context, code_ask, code_index), Kai decision & safety guardrails (kai_decide, kai_command_guard, kai_injection_screen), browser CDP, issue tracker, and persistent memory.'],
  ['117 Hanzo Cloud services, 1,538 typed operations', 'Through the unified hanzo router and /docs/mcp-tools catalog, agents provision sandboxes, deploy containers across 34 regions, query vector indexes, rotate KMS secrets, verify IAM policies, and inspect billing usage under one bearer key.'],
  ['Scoped permissions & Kai safety screening', 'Every shell command and external input can pass through kai_command_guard and kai_injection_screen in single-digit milliseconds. Enable or drop tool groups per environment with --enable-tools and --disable-tools.'],
];

function PartArt({ i }) {
  if (i === 0) {
    return (
      <div className="mcp-art mcp-art-0" aria-hidden="true">
        {['fs', 'exec', 'code', 'git', 'fetch', 'workspace', 'ui', 'code_search', 'code_context', 'code_ask', 'code_index', 'kai_decide', 'kai_command_guard', 'kai_injection_screen', 'browser', 'cdp', 'tracker', 'memory'].map((t, k) => (
          <motion.span key={t} className="x-mono" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 + k * 0.03 }}>{t}</motion.span>
        ))}
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="mcp-art mcp-art-1" aria-hidden="true">
        {Array.from({ length: 117 }).map((_, k) => <i key={k} style={{ animationDelay: ((k * 53) % 117) * 0.03 + 's' }} />)}
      </div>
    );
  }
  return (
    <div className="mcp-art mcp-art-2" aria-hidden="true">
      <div className="mcp-guard x-mono"><span>kai_command_guard</span><span>kai_injection_screen</span></div>
      <div className="mcp-cmds">{[0, 1, 2, 3].map((k) => <span key={k} className={k === 2 ? 'stop' : ''} style={{ animationDelay: k * 0.8 + 's' }}><b /></span>)}</div>
    </div>
  );
}

function Parts() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || !seen || calm) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 5200);
    return () => clearTimeout(t);
  }, [at, mine, seen, calm]);
  return (
    <section className="x-sec mcp-parts" ref={ref}>
      <div className="x-wrap">
        <Rise as="p" className="mcp-sum">38 unified action tools + 1,538 Cloud operations + 260+ specialized servers</Rise>
        <div className="mcp-parts-in">
          <div className="mcp-steps" role="tablist" aria-label="The runtime">
            {PARTS.map(([t, d], i) => (
              <button key={t} type="button" role="tab" aria-selected={at === i} className={at === i ? 'on' : ''} onClick={() => { setAt(i); setMine(true); }}>
                <span className="mcp-step-n x-mono">{String(i + 1).padStart(2, '0')} / 03</span>
                <span className="mcp-step-t">{t}</span>
                <motion.span className="mcp-step-d" initial={false} animate={at === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <span>{d}</span>
                </motion.span>
                {at === i && !mine && seen && <i key={'t' + at} className="mcp-step-time" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="mcp-art-box">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={at} className="mcp-art-in" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
                <PartArt i={at} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo MCP in my project. Start with: hanzo mcp create';
  return (
    <section className="mcp-paste">
      <div className="x-wrap mcp-paste-in">
        <Rise y={14}><p className="mcp-paste-k">Paste and ship</p><p className="mcp-paste-d">Paste this into any agent. It reads the skill manifest and calls MCP from there.</p></Rise>
        <Rise className="mcp-prompt" y={14} delay={0.06}><span className="x-mono mcp-prompt-k">Agent prompt</span><code>{text}</code><Copy text={text} /></Rise>
      </div>
    </section>
  );
}

/* Six domains; each spills its own tool names. */
const DOMAINS = [
  ['fs & exec', 'read, write, stat, list, mkdir, rm, mv, apply_patch, search_text — plus exec with run, background, ps, kill, and logs so long-running dev servers and test suites stream cleanly.', ['read', 'write', 'stat', 'list', 'mkdir', 'rm', 'mv', 'apply_patch', 'search_text', 'run', 'background', 'ps', 'kill', 'logs']],
  ['code_search, code_context, code_ask, code_index', 'AST-aware symbol resolution, call graphs, cross-repository indexing, and structural transforms. Find every caller of a symbol in 2ms without grep noise.', ['code_search', 'code_context', 'code_ask', 'code_index']],
  ['kai_decide, kai_command_guard, kai_injection_screen', '13 purpose-built Kai decision, scoring, routing, log triage, recovery, and context compaction tools running in 6.4ms at a fraction of LLM token cost.', ['kai_decide', 'kai_command_guard', 'kai_injection_screen']],
  ['browser, cdp, git & fetch', 'Full Playwright and Chrome DevTools Protocol automation (navigate, click, screenshot, console, network), complete git workflows, and streaming HTTP fetch.', ['navigate', 'click', 'screenshot', 'console', 'network', 'git', 'fetch']],
  ['tracker, memory, think, plan & tasks', 'tracker_boards, tracker_issues, tracker_create, and tracker_update sync directly with engineering boards, while memory, think, and plan persist architecture context across sessions.', ['tracker_boards', 'tracker_issues', 'tracker_create', 'tracker_update', 'memory', 'think', 'plan', 'tasks']],
  ['hanzo (117 Cloud services · 1,538 ops)', 'Direct typed access to Deploy, Sandbox, IAM, KMS, KV, S3, Vector, Search, Crawl, Workflow, Commerce, and Billing — inspectable at docs.hanzo.ai/docs/mcp-tools.', ['Deploy', 'Sandbox', 'IAM', 'KMS', 'KV', 'S3', 'Vector', 'Search', 'Crawl', 'Workflow', 'Commerce', 'Billing']],
];

function Domain({ d, i }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <li ref={ref} className={'mcp-dom-i d' + i}>
      <div className="mcp-dom-l">
        <span className="mcp-dom-n x-mono">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="x-mono">{d[0]}</h3>
        <p>{d[1]}</p>
      </div>
      <div className="mcp-chips" aria-hidden="true">
        {d[2].map((t, k) => (
          <motion.span key={t} className="x-mono" initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={seen ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 + k * 0.04 }} whileHover={{ y: -3 }}>{t}</motion.span>
        ))}
      </div>
    </li>
  );
}

function Domains() {
  return (
    <section className="x-sec mcp-doms">
      <div className="x-wrap">
        <SecHead kicker="Tool domains" title="Every surface an autonomous team needs" lede="From local AST refactoring and headless browser verification to multi-region cloud deployments." />
        <ul className="mcp-dom-list">{DOMAINS.map((d, i) => <Domain key={d[0]} d={d} i={i} />)}</ul>
      </div>
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

function Config() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="x-sec mcp-cfg">
      <div className="x-wrap mcp-cfg-in">
        <div>
          <SecHead kicker="Get started" title="One config block" lede="Use the --package= form for local stdio, or point any MCP client directly at https://api.hanzo.ai/v1/mcp over streamable HTTP." />
          <More to={ALL}>All MCP Tools Reference</More>
        </div>
        <Rise className="mcp-code" ref={ref}>
          <div className="mcp-code-bar"><span className="x-mono">json</span><Copy text={CONFIG} /></div>
          <pre><code>{CONFIG.split('\n').map((l, i) => (
            <motion.span key={i} className="mcp-ln" initial={{ opacity: 0, x: -8 }} animate={seen ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}>{l ? hl(l) : ' '}{'\n'}</motion.span>
          ))}</code></pre>
        </Rise>
      </div>
    </section>
  );
}

function Add() {
  const { rx, ry, glow, on } = useTilt(4, 'rgba(0,0,0,.05)');
  return (
    <section className="x-sec mcp-add">
      <div className="x-wrap">
        <div className="mcp-add-in">
          <div>
            <SecHead title="Add Hanzo MCP to your client" lede="One block in .mcp.json, or connect over streamable HTTP at api.hanzo.ai/v1/mcp." />
            <Rise className="mcp-add-acts">
              <Go to={ALL} solid>Browse All Tools</Go>
              <Go to={GH}>GitHub</Go>
              <Go to="https://platform.hanzo.ai">Hanzo Platform</Go>
            </Rise>
            <Rise className="mcp-add-more"><span className="x-kick">MCP</span><A to={DOCS} className="mcp-docs">MCP docs →</A></Rise>
          </div>
          <Rise delay={0.1}>
            <motion.div className="mcp-repo" style={{ rotateX: rx, rotateY: ry }} {...on}>
              <motion.span className="x-mglow" style={{ background: glow }} aria-hidden="true" />
              <h2>Get MCP</h2>
              <p>Model Context Protocol — 260+ tools</p>
              <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div><div><dt>★</dt><dd>8 stars</dd></div></dl>
              <div className="mcp-repo-acts">
                <A to={GH} className="mcp-gh x-mono">hanzoai/mcp</A>
                <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
                <Go to={DOCS}>Self-host</Go>
              </div>
            </motion.div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

export default function McpPage() {
  return (
    <main className="mcp">
      <Hero />
      <Parts />
      <Paste />
      <Domains />
      <Config />
      <Add />
    </main>
  );
}
