'use client';
/* Hanzo API. Signature: the endpoint explorer. The first screen is one huge address line: the method lights, the path
   types itself after https://api.hanzo.ai, and what the endpoint returns streams in beneath it, with the model that
   serves it playing beside. It walks all eight on its own; choose one and it is yours. In the dark room, requests
   travel through the one gateway to every service, and a rejected one comes back as a 429 with a Retry-After. The
   core endpoints are a routing table you can filter.
   Beyond: "Same host, same key". Pick any endpoint and its request line rebuilds: only the path wipes in, the host and
   the bearer header never change, which is the page's own claim (no second base URL) made visible. Copies as curl.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, Go, SecHead } from '../kit';
import './ApiPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/openapi/';
const HERO = [
  ['POST', '/v1/chat/completions', 'A completion from any model your organization can reach, streamed or buffered. Model ids come from the catalog, so the list is a request rather than a page in the docs.', 'ai/post-chat-completions', 'enso'],
  ['POST', '/v1/responses', 'Stateful multi-turn responses with built-in tool calling, structured outputs, reasoning traces, and server-managed conversation state.', 'ai/post-responses', 'zen'],
  ['POST', '/v1/decisions', 'Sub-10ms structured classification, routing, scoring, and guardrail decisions powered by Kai at a fraction of LLM cost.', 'ai/post-decisions', 'kai'],
  ['POST', '/v1/videos/generations', 'Generate cinematic video with synchronized audio and camera motion from text or reference frames via Koma.', 'ai/post-videos-generations', 'koma'],
  ['POST', '/v1/images/generations', 'Photorealistic image generation, inpainting, and layout-accurate typography rendering via Iro.', 'ai/post-images-generations', 'iro'],
  ['POST', '/v1/audio/speech · /v1/audio/music', 'Low-latency neural speech synthesis, voice cloning, transcription, foley sound effects, and full-track music generation via Koe, Oto, and Uta.', 'ai/post-audio-speech', 'koe'],
  ['POST', '/v1/3d/generations', 'Textured 3D meshes and spatial world assets generated from text prompts or multi-view images via Mori.', 'ai/post-3d-generations', 'mori'],
  ['POST', '/v1/embeddings', 'Vectors for search, retrieval and clustering, from the same key and the same bill as generation.', 'ai/post-embeddings', 'enso'],
];
const MORE = [
  ['GET', '/v1/models', 'What your organization may call right now — every model we serve plus any provider account you have connected, with their identifiers and pricing.', 'ai/get-models'],
  ['GET · POST', '/v1/agents', 'Define an agent once, run it by reference, and read its runs afterwards. The definition lives here, so everything that runs it runs the same one.', 'agent'],
  ['GET · POST', '/v1/code/search · /v1/code/ask', 'AST-indexed symbol search, repository context assembly, and semantic codebase Q&A across your organization’s repositories.', 'code/get-code-search'],
  ['POST', '/v1/sandbox', 'Lease isolated microVM sandboxes with filesystem, terminal WebSocket, headless browser screen streaming, and sub-second startup.', 'sandbox/post-sandbox'],
  ['POST', '/v1/crawl · /v1/search', 'Clean markdown extraction from any live web page and structured real-time web search for RAG and agent research.', 'crawl/read-page'],
  ['GET', '/v1/billing/balance · /v1/billing/usage', 'What is left, and what was spent. Usage is recorded per call and attributed to the organization on the token, so a bill can be traced back to the request that caused it.', 'billing/get-billing-usage'],
  ['GET', '/v1/tools', 'The tools your organization can call over REST or MCP. An agent picks from this list, and so can you — it is the same catalog either way.', 'tool'],
];
const n8 = (i) => String(i + 1).padStart(2, '0') + ' / 08';

/* The address line: the path types, the answer streams, the model plays. */
function Explorer() {
  const [at, setAtS] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const path = useRef(null);
  const desc = useRef(null);
  const vid = useRef(null);
  const [typed, setTyped] = useState(true);
  const live = seen && !calm;
  // type the path, then stream the description, writing straight to the text nodes
  useEffect(() => {
    const [, p, d] = HERO[at];
    if (!live) { if (path.current) path.current.textContent = p; if (desc.current) desc.current.textContent = d; setTyped(true); return; }
    let alive = true, t = 0;
    setTyped(false);
    const words = d.split(' ');
    let i = 0, w = 0;
    if (path.current) path.current.textContent = '';
    if (desc.current) desc.current.textContent = '';
    const typeP = () => {
      if (!alive) return;
      if (i <= p.length) { path.current && (path.current.textContent = p.slice(0, i++)); t = setTimeout(typeP, 34); return; }
      setTyped(true);
      t = setTimeout(stream, 220);
    };
    const stream = () => {
      if (!alive) return;
      if (w <= words.length) { desc.current && (desc.current.textContent = words.slice(0, w++).join(' ')); t = setTimeout(stream, 38); }
    };
    t = setTimeout(typeP, 200);
    return () => { alive = false; clearTimeout(t); };
  }, [at, live]);
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => setAtS((v) => (v + 1) % HERO.length), 5600);
    return () => clearTimeout(t);
  }, [at, mine, live]);
  useEffect(() => { const v = vid.current; if (!v) return; if (live) v.play().catch(() => {}); else v.pause(); }, [at, live]);
  const pick = (i) => { setAtS(i); setMine(true); };
  const [m, p, d, doc, model] = HERO[at];
  return (
    <div className="api-x" ref={box}>
      <div className="api-line">
        <span className="api-meth x-mono">{m}</span>
        <span className="api-url x-mono">
          <span className="api-host">https://api.hanzo.ai</span>
          <span className="api-path" ref={path}>{p}</span>
          <span className={'api-caret' + (typed ? ' idle' : '')} aria-hidden="true" />
        </span>
        <A to={DOCS + doc} className="api-send" aria-label={'Docs: ' + p}>
          <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </A>
      </div>
      <div className="api-out">
        <div className="api-ret">
          <span className="api-ret-k x-mono">{n8(at)}</span>
          <p className="api-desc" aria-live="polite"><span ref={desc}>{d}</span></p>
          <A to={DOCS + doc} className="api-doc">Docs <span aria-hidden="true">↗</span></A>
        </div>
        <div className="api-model">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={model} className="api-model-in" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <img src={`/models/${model}.webp`} alt="" />
              <video ref={vid} src={`/models/${model}.webm`} muted loop playsInline preload="metadata" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ol className="api-chips" role="tablist" aria-label="Endpoints">
        {HERO.map(([mm, pp], i) => (
          <li key={pp}>
            <button type="button" role="tab" aria-selected={at === i} onClick={() => pick(i)}>
              {at === i && <motion.span layoutId="api-chip" className="api-chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="x-mono">{mm + ' ' + pp}</span>
              {at === i && !mine && live && <i key={'t' + at} className="api-chip-t" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  return (
    <section className="api-hero" aria-labelledby="api-h1">
      <div className="x-wrap">
        <div className="api-top">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>API</motion.p>
            <motion.h1 id="api-h1" className="api-h1" initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, ease: EASE }}>One API for models, agents and tools</motion.h1>
          </div>
          <motion.div className="api-side" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            <p className="api-lede">Every Hanzo capability answers under one base URL, behind one key.</p>
            <div className="api-acts">
              <Go to="https://platform.hanzo.ai/api-keys" solid>Get an API key, free</Go><i hidden data-thumb="Get an API key, free" data-href="https://platform.hanzo.ai/api-keys" />
              <Go to={DOCS}>OpenAPI Reference ↗</Go>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}>
          <Explorer />
        </motion.div>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo API in my project.';
  return (
    <section className="api-paste">
      <div className="x-wrap">
        <div className="api-paste-in">
          <div>
            <p className="api-paste-k">Paste and ship</p>
            <p className="api-paste-d">Paste this into any agent. It reads the skill manifest and calls API from there.</p>
          </div>
          <div className="api-prompt">
            <span className="api-prompt-k x-mono">Agent prompt</span>
            <code>{text}</code>
            <Copy text={text} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* The one gateway: requests run in from your app, out to every service; now and then one is turned back with a 429. */
const SERVICES = ['/v1/chat/completions', '/v1/images/generations', '/v1/videos/generations', '/v1/agents', '/v1/sandbox', '/v1/tools'];

function Gateway() {
  return (
    <div className="api-gw" aria-hidden="true">
      <div className="api-gw-app"><b>Your app</b><span className="x-mono">Authorization: Bearer &lt;your key&gt;</span></div>
      <div className="api-gw-in"><i /><i /><i className="back" /><em className="x-mono">429 · Retry-After</em></div>
      <div className="api-gw-gate"><span className="x-mono">https://api.hanzo.ai/v1</span></div>
      <ul className="api-gw-out">
        {SERVICES.map((s, i) => (
          <li key={s} style={{ '--i': i }}>
            <span className="api-wire"><i /></span>
            <span className="api-svc x-mono">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Beyond: one request line; picking an endpoint changes only the path */
function Call() {
  const [k, setK] = useState(0);
  const [m, p, , doc] = ALL[k];
  const method = m.split(' ')[0], path = p.split(' · ')[0];
  const curl = `curl -X ${method} https://api.hanzo.ai${path} -H "Authorization: Bearer <your key>"`;
  return (
    <div className="api-call">
      <label className="api-call-k x-mono" htmlFor="api-call-sel">Endpoint</label>
      <select id="api-call-sel" value={k} onChange={(e) => setK(+e.target.value)}>
        {ALL.map(([mm, pp], i) => <option key={pp} value={i}>{mm.split(' ')[0]} {pp.split(' · ')[0]}</option>)}
      </select>
      <pre className="api-call-line"><code>
        <span className={'api-row-m m-' + method.toLowerCase()}>{method}</span> <span className="api-call-host">https://api.hanzo.ai</span><motion.span key={path} className="api-call-path" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.45, ease: EASE }}>{path}</motion.span>{'\n'}
        <span className="api-call-host">Authorization: Bearer &lt;your key&gt;</span>
      </code></pre>
      <div className="api-call-f"><Copy text={curl} label="Copy as curl" /><A to={DOCS + doc}>Body and parameters ↗</A></div>
    </div>
  );
}

function Base() {
  return (
    <section className="x-sec api-dark" data-room="dark">
      <div className="x-wrap">
        <div className="api-base">
          <div>
            <h2 className="api-base-h">Base URL</h2>
            <Rise className="api-big">
              <span className="x-mono">https://api.hanzo.ai/v1</span>
              <Copy text="https://api.hanzo.ai/v1" />
            </Rise>
            <p className="api-copy">
              Authenticate with a bearer token: <code>Authorization: Bearer &lt;your key&gt;</code>. Keys are created and revoked in the <A to="https://platform.hanzo.ai/api-keys">console</A>, and revoking one there is what stops it working.
            </p>
            <p className="api-copy">
              Every route lives under <code>/v1</code>, and every service answers on the same host — there is no second base URL to configure and no v2 waiting to break the first one. Rate limits are applied per caller and across the edge as a whole; a rejected request comes back as a <code>429</code> with a <code>Retry-After</code> rather than a dropped connection.
            </p>
            <Call />
          </div>
          <Rise delay={0.1}><Gateway /></Rise>
        </div>
      </div>
    </section>
  );
}

/* The core endpoints as a routing table: filter by method or by path. */
const ALL = [...HERO.map(([m, p, d, doc]) => [m, p, d, doc]), ...MORE];
const FILTERS = ['All', 'POST', 'GET'];

function Table() {
  const [f, setF] = useState(0);
  const [q, setQ] = useState('');
  const rows = ALL.filter(([m, p, d]) => (f === 0 || m.includes(FILTERS[f])) && (!q || (p + ' ' + d).toLowerCase().includes(q.toLowerCase())));
  return (
    <section className="x-sec api-core">
      <div className="x-wrap">
        <SecHead kicker="Reference" title="Core endpoints" lede="A few of the ones people reach for first. Every parameter and error shape is in the reference." />
        <div className="api-tools">
          <div className="api-seg" role="tablist" aria-label="Method">
            {FILTERS.map((x, i) => (
              <button key={x} type="button" role="tab" aria-selected={f === i} onClick={() => setF(i)}>
                {f === i && <motion.span layoutId="api-seg" className="api-seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{x}</span>
              </button>
            ))}
          </div>
          <label className="api-q">
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="/v1/…" aria-label="Filter endpoints" />
          </label>
          <span className="api-count x-mono">{rows.length} / {ALL.length}</span>
        </div>
        <motion.ul className="api-rows" layout>
          <AnimatePresence initial={false}>
            {rows.map(([m, p, d, doc]) => (
              <motion.li key={p} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <A to={DOCS + doc} className="api-row">
                  <span className="api-row-p x-mono">{p}</span>
                  <span className={'api-row-m x-mono m-' + m.split(' ')[0].toLowerCase()}>{m}</span>
                  <span className="api-row-d">{d}</span>
                  <span className="api-row-go" aria-hidden="true">↗</span>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {rows.length === 0 && <li className="api-none">No endpoint matches. <button type="button" onClick={() => { setQ(''); setF(0); }}>Show all</button></li>}
        </motion.ul>
      </div>
    </section>
  );
}

/* How it fits: three drawings that draw themselves. */
const FITS = [
  ['One key, one bill', 'A single key authenticates every endpoint, and usage meters to the organization it belongs to. Spend is attributed in one place instead of once per service.', 'M6 32a8 8 0 1 1 16 0a8 8 0 1 1-16 0M22 32h34M46 32v8M54 32v6'],
  ['Identity is the gateway’s to state', 'Every request passes a gateway that throws away the identity headers a client sent and writes them again from the verified token. Nothing downstream has to wonder whether an org id came from a token or from a curl flag.', 'M4 20h20M4 32h20M4 44h20M8 16l12 8M8 28l12 8M30 12v40M36 26h24M36 38h24'],
  ['Generated, not hand-written', 'The clients come from the OpenAPI document this API serves, and their method names are its operation ids. A client is checkable against a release rather than against somebody’s memory.', 'M8 10h18l6 6v32H8zM26 10v6h6M32 30h8M44 18h14v10H44zM44 36h14v10H44zM40 23v18'],
];

function Fit({ f, i }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div className="api-fit">
      <svg ref={ref} viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
        <motion.path d={f[2]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 0.1 + i * 0.12 }} />
      </svg>
      <h3>{f[0]}</h3>
      <p>{f[1]}</p>
    </div>
  );
}

function Fits() {
  return (
    <section className="x-sec api-fits">
      <div className="x-wrap">
        <SecHead title="How it fits together" />
        <div className="api-fit-row">{FITS.map((f, i) => <Fit key={f[0]} f={f} i={i} />)}</div>
      </div>
    </section>
  );
}

function Next() {
  return (
    <section className="x-sec api-next">
      <div className="x-wrap">
        <SecHead title="Next" />
        <div className="api-next-row">
          {[['API reference', 'Every endpoint, parameter and response shape.', DOCS], ['Getting started', 'An empty project to a first call that works.', 'https://docs.hanzo.ai/docs/quickstart']].map(([t, d, to], i) => (
            <div key={t}>
              <A to={to} className="api-next-a">
                <span className="api-next-t">{t}</span>
                <span className="api-next-d">{d}</span>
                <span className="api-next-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="22" height="22"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </A>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ApiPage() {
  return (
    <main className="api">
      <Hero />
      <Paste />
      <Base />
      <Table />
      <Fits />
      <Next />
    </main>
  );
}
