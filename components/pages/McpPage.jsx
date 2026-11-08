'use client';
// Persona: a developer wiring tools into an agent client.
// Goal: add Hanzo MCP to their client.
// CTA: Browse 260+ tools (mcp.hero, data-thumb; after the hero the sticky header carries it; the close's one solid is Browse All Tools, mcp.close).
// Metric: cta_click mcp.hero (and mcp.close)
// Signature: compare — one MCP client before and after Hanzo MCP: drag the divider from its empty .mcp.json and empty tool slots to Hanzo's block and the tools it carries.
// Entrances: diagonal-wipe, cursor-trail, count-roll, side-carousel, curtain-rise
// Beyond: each opened domain lists the tool names Hanzo gives for it, so you see what an agent gets before you install; the config copies as valid JSON.
/* Hanzo MCP.
   V2: 9/10 motion-map pass (7 Nov): the signature is a before/after slider in the second screen (pointer, touch and
   arrow keys); the stacked, pinned runtime sheets are plain sections now; five sections each arrive their own way:
   the hero wipes in on a diagonal, a cursor drags the compare divider in with a trail, the three figures roll their
   digits into place, the domain cards ride in sideways on their snapping rail, the config rises behind a curtain clip.
   Kept: ink only; captions under headlines; .mcp.json copies as JSON and bash copies one command per row (notes
   shown, never copied, so it runs in zsh); the live tool stream; domain cards that lift, preview and morph into
   their sheet; one mover per screen; 44px Copy everywhere. Every word is Hanzo's (plus the slider's two side labels). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, CodeBlock } from '../kit';
import { Copy } from '../ui';
import NoJs from '../NoJs';
import A2Paste from '../v2/A2Paste';
import A2Pause from '../v2/A2Pause';
import { T, EMPH, MOVE } from '../v2/A2Motion';
import McpCompare from './mcp/McpCompare';
import useEnter from './mcp/useEnter';
import HeroDither from './HeroDither';
import '../v2/A2.css';
import './McpPage.css';

/* a heading's lines as plain blocks (the line-mask cut-in is gone: each section's entrance does the arriving) */
const Lines = ({ lines }) => lines.map((l, i) => <span className="a2-ln" key={i}>{l}{i < lines.length - 1 ? ' ' : null}</span>);

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
      <HeroDither />
      {/* entrance 1, diagonal-wipe: the words, then the stream, then the client row are uncovered by a diagonal clip
          that sweeps left to right on load (CSS only, under html.js, so JavaScript off shows it all at once) */}
      <div className="a2-wrap a2-grid mcp-hero-grid">
        <div className="mcp-hero-copy mcp-wipe">
          {/* one h1, two line sets: Hanzo's three lines on wide screens, the same words in four lines at the phone's deck size
              (the inactive set is display:none, so it is neither seen nor read) */}
          <h1 id="mcp-h1" className="a2-display mcp-h1">
            <span className="mcp-h1-d"><Lines lines={['The complete MCP runtime', 'for coding, decisions,', 'browser, and cloud']} /></span>
            <span className="mcp-h1-p"><Lines lines={['The complete MCP', 'runtime for', 'coding, decisions,', 'browser, and cloud']} /></span>
          </h1>
          <p className="a2-kick show mcp-cap">Hanzo MCP · 260+ tools · 125 cloud services</p>
          <p className="a2-lede mcp-lede">Give any model a filesystem, shell, semantic AST code index, Kai sub-10ms decisions, Playwright &amp; Chrome DevTools browser control, issue tracking, persistent memory, and 1,700+ typed Hanzo Cloud operations over stdio or streamable HTTP.</p>
          <div className="a2-acts">
            <Cta to={ALL} id="mcp.hero" thumb>Browse 260+ tools</Cta>
            <Cta to={DOCS} kind="quiet">Read the docs</Cta>
            <Cta to={GH} kind="link">View on GitHub</Cta>
          </div>
        </div>
        <div className="mcp-hero-obj mcp-wipe">
          <Stream />
        </div>
      </div>
      <div className={'a2-wrap mcp-via mcp-wipe' + (viaSeen ? ' seen' : '')} ref={via}>
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

/* A figure as one box per character. At rest each box simply holds Hanzo's character. During the count-roll entrance
   (McpPage.css, .e-arm/.e-go) each digit's text goes clear and a CSS-drawn reel of 0–9 (a ::after, so it is never in
   the page's text) rolls up through one full turn and stops on that digit; the boxes never change size. */
function Fig({ v, d = 0 }) {
  return (
    <span className="a2-fig mcp-fig">
      {[...v].map((c, i) => /\d/.test(c)
        ? <span key={i} className="mcp-dg" style={{ '--n': c, '--t': (d + (v.length - i) * 0.09).toFixed(2) + 's' }}>{c}</span>
        : <span key={i} className="mcp-dg s" style={{ '--t': (d + 0.5).toFixed(2) + 's' }}>{c}</span>)}
    </span>
  );
}

/* The summary line, as three figures. Entrance 3, count-roll: the digits roll into their values once. */
function Figures() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 }); // the "+" signs breathe three times on arrival, then rest
  useEnter(ref, { ms: 2200, amount: 0.5 });
  return (
    <section ref={ref} className={'a2-sec mcp-figs' + (seen ? ' seen' : '')}>
      <div className="a2-wrap">
        {/* Hanzo's line whole, for readers; the rolling digits below are its picture */}
        <p className="x-sr">38 unified action tools + 1,700+ Cloud operations + 260+ specialized servers</p>
        <p className="mcp-sum" aria-hidden="true">
          <span className="mcp-f"><Fig v="38" /> <span>unified action tools</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Fig v="1,700+" d={0.12} /> <span>Cloud operations</span></span>
          <span className="mcp-plus" aria-hidden="true">+</span>
          <span className="mcp-f"><Fig v="260+" d={0.24} /> <span>specialized servers</span></span>
        </p>
      </div>
    </section>
  );
}

/* The signature, in the second screen: one client before and after Hanzo MCP (entrance 2, cursor-trail, is inside it). */
function Before() {
  return (
    <section className="a2-sec tight mcp-cmp-sec" aria-labelledby="mcp-cmp-h">
      <div className="a2-wrap">
        <div className="mcp-cmp-head">
          <h2 id="mcp-cmp-h" className="a2-headline">Add Hanzo MCP to any MCP client</h2>
          <p className="mcp-cmp-hint x-mono" aria-hidden="true">Drag to compare</p>
        </div>
        <McpCompare json={JSON_BLOCK} tools={CORE} client="Any MCP client" />
      </div>
    </section>
  );
}

/* The runtime in three parts: three plain sheets, one after another (no longer pinned; nothing sticks while you scroll). */
const PARTS = [
  ['Full-stack agent capabilities, ready out of the box', 'Core runtime (fs, exec, code, git, fetch, workspace, ui), semantic code intelligence (code_search, code_context, code_ask, code_index), Kai decision & safety guardrails (kai_decide, kai_command_guard, kai_injection_screen), browser CDP, issue tracker, and persistent memory.'],
  ['125 Hanzo Cloud services, 1,700+ typed operations', 'Through the unified hanzo router and /docs/mcp-tools catalog, agents provision sandboxes, deploy containers across 34 regions, query vector indexes, rotate KMS secrets, verify IAM policies, and inspect billing usage under one bearer key.'],
  ['Scoped permissions & Kai safety screening', 'Every shell command and external input can pass through kai_command_guard and kai_injection_screen in single-digit milliseconds. Enable or drop tool groups per environment with --enable-tools and --disable-tools.'],
];
const CORE = ['fs', 'exec', 'code', 'git', 'fetch', 'workspace', 'ui', 'code_search', 'code_context', 'code_ask', 'code_index', 'kai_decide', 'kai_command_guard', 'kai_injection_screen', 'browser', 'cdp', 'tracker', 'memory'];

function PartArt({ i }) {
  if (i === 0) return <div className="mcp-art a0">{CORE.map((t, k) => <span key={t} className="x-mono" style={{ '--d': k * 0.35 + 's' }}>{t}</span>)}</div>;
  if (i === 1) return <div className="mcp-art a1">{Array.from({ length: 125 }).map((_, k) => <i key={k} style={{ animationDelay: ((k * 53) % 125) * 0.04 + 's' }} />)}</div>;
  return (
    <div className="mcp-art a2">
      <div className="mcp-gate x-mono"><span>kai_command_guard</span><span>kai_injection_screen</span></div>
      <div className="mcp-cmds">{[0, 1, 2, 3].map((k) => <span key={k} className={k === 2 ? 'stop' : ''} style={{ animationDelay: k * 0.9 + 's' }}><b /></span>)}</div>
    </div>
  );
}

/* Only one sheet runs its art: the last one whose top has passed 60% of the screen. One mover per screen. */
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
  ['hanzo (125 Cloud services · 1,700+ ops)', 'Direct typed access to Deploy, Sandbox, IAM, KMS, KV, S3, Vector, Search, Crawl, Workflow, Commerce, and Billing — inspectable at docs.hanzo.ai/docs/mcp-tools.', ['Deploy', 'Sandbox', 'IAM', 'KMS', 'KV', 'S3', 'Vector', 'Search', 'Crawl', 'Workflow', 'Commerce', 'Billing']],
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
  // entrance 4, side-carousel: the six cards ride in from the right along their snapping rail, one after another
  const sec = useRef(null);
  useEnter(sec, { ms: 1900, amount: 0.25 });
  return (
    <section className="a2-sec mcp-doms" aria-labelledby="mcp-doms-h" ref={sec}>
      <div className="a2-wrap a2-grid mcp-doms-head">
        <div className="mcp-doms-t">
          <h2 id="mcp-doms-h" className="a2-headline"><Lines lines={['Every surface', 'an autonomous team needs']} /></h2>
          <p className="a2-kick show mcp-cap">Tool domains</p>
        </div>
        <div className="mcp-doms-r">
          <p className="a2-lede mcp-doms-l">From local AST refactoring and headless browser verification to multi-region cloud deployments.</p>
          <A2Pause paused={paused} onChange={setPaused} label="Pause" className="mcp-doms-pause" />
        </div>
      </div>
      <motion.ul className={'mcp-rail' + (paused ? ' a2-paused' : '')} ref={rail} layoutScroll>
        {DOMAINS.map(([t, desc, tools], i) => (
          <li key={t} style={{ '--i': i }}>
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
/* the shell lines, shown exactly as Hanzo writes them ("//   hanzo mcp   # stdio; …", one line each), with one Copy per
   command that copies the bare command only, so a paste never carries the "//" or the "#" note and never queues a
   blocking `hanzo mcp` before `-t sse` */
const SHELL = CONFIG.split('\n').slice(-3).map((line) => [line.replace(/^\/\/\s+/, '').split(/\s+#/)[0].trim(), line]);

function Shell() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 }); // the rows light in turn once (about 4 s), then rest
  return (
    <figure ref={ref} className={'x-codeblock mcp-sh' + (seen ? ' go' : '')} data-room="dark">
      <figcaption className="x-codeblock-h"><span>bash</span></figcaption>
      <ol className="mcp-sh-rows">
        {SHELL.map(([cmd, line], i) => (
          <li key={cmd} style={{ '--k': i }}>
            <span className="mcp-sh-line x-mono">{line}</span>
            <Copy text={cmd} label="Copy" />
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* The one dark room. Entrance 5, curtain-rise: the words, then each code block, rise from below behind a clip. */
function Config() {
  const ref = useRef(null);
  useEnter(ref, { ms: 1700, amount: 0.3 });
  return (
    <section ref={ref} className="a2-dark a2-sec mcp-cfg" data-room="dark" aria-labelledby="mcp-cfg-h">
      <div className="a2-wrap a2-grid">
        <div className="mcp-cfg-copy mcp-cur">
          <h2 id="mcp-cfg-h" className="a2-headline">One config block</h2>
          <p className="a2-kick show mcp-cap">Get started</p>
          <p className="a2-body">Use the --package= form for local stdio, or point any MCP client directly at https://api.hanzo.ai/v1/mcp over streamable HTTP.</p>
          <A to={ALL} className="mcp-ref">All MCP Tools Reference<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
        </div>
        <div className="mcp-codes">
          <div className="mcp-cur" style={{ '--c': 1 }}>
            <p className="mcp-code-c x-mono">// .mcp.json — add Hanzo MCP to any MCP client</p>
            <CodeBlock code={JSON_BLOCK} label=".mcp.json" />
          </div>
          <div className="mcp-cur" style={{ '--c': 2 }}>
            <p className="mcp-code-c x-mono">// Or install the whole native stack once and run it yourself:</p>
            <Shell />
          </div>
          {/* the block exactly as Hanzo writes it, for search */}
          <pre className="x-sr" aria-hidden="true">{CONFIG}</pre>
        </div>
      </div>
    </section>
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
          <h2 id="mcp-close-h" className="a2-display mcp-close-h"><Lines lines={['Add Hanzo MCP', 'to your client']} /></h2>
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
      <NoJs css={'.a2 [style*="opacity:0"]{opacity:1!important;transform:none!important}'} />
      <Hero />
      <Before />
      <Figures />
      <Parts />
      <A2Paste name="MCP" text="Read https://hanzo.ai/skill.md and use Hanzo MCP in my project. Start with: hanzo mcp create" />
      <Domains />
      <Config />
      <Close />
    </main>
  );
}
